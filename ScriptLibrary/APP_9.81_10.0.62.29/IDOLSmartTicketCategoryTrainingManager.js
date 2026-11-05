/**
 * IDOL training documents can be stored in two different place, one is at
 * content server, another is agent store. The term weight can be count differently.
 *
 * Training documents were selected when category creating
 * Tuning documents were manually selected by admin when training result is not ideal
 */
 /**
 * train/tune category with IDOL commands
 *
 * Training and Tuning are basiclly the same thing in IDOL, but we split them
 * into to features in SM.
 *
 * Training should only execute once, but tuning can apply multiple times.
 */
var _ = lib.Underscore.require(),
    XQuery = lib.XQuery.require(),
    IDOLCommon = lib.IDOLCommon.require(),
    IDOLIDXDocument = lib.IDOLIDXDocument.require();

var logger = getLog('IDOLSmartTicketCategoryTrainingManager');

var IDOLSmartTicketCategoryTrainingManager = (function() {

  var DEFAULT_INDEX_BATCH_SIZE = 300;
  var CATEGORY_FIELD_NAMES = ['category', 'subcategory', 'product.type'];


  function TrainingManager(category, cfg) {
    var categorizer = category.getCategorizer();
    this._category = category;
    this._categorizer = categorizer;
    this._cfg = _.extend({ batchSize : DEFAULT_INDEX_BATCH_SIZE }, cfg);
    var method = categorizer.getTrainingMethod();
    if (method === 'bydoc') {
      this.doTrainCategory = this._trainByDocuments;
    } else if (method === 'byterm') {
      this.doTrainCategory = this._trainByTerms;
    } else {
      throw new Error('unknown training method: ' + method);
    }
  }

  TrainingManager.prototype.getTrainingDocs = function(client) {
    var doc = client.executeAction({
      action: 'CategoryGetTraining',
      category: this._category.getId()
    });
    var hits = XQuery.query('responsedata/autn:trainingdoc', doc);
    return _.map(hits, function(hit) {
      return XQuery.queryObject({
        id : 'autn:id',
        title : 'autn:title',
        'ticket.id' : 'autn:originallocation',
        'ticket.body' : 'autn:trainingtext'
      }, hit);
    });
  };

  // caculate the difference from the declared training and actual training.
  //
  // training samples ware added by SM apps (update record `cate2idol2`), 
  // but IDOL category `training document set` were not updated yet.
  //
  // IDOL category can be updated by `CategorySetTraining` and `CategoryBuild`
  TrainingManager.prototype.getTrainingDelta = function(client) {
    var category = this._category;
    var trainedDocs = this.getTrainingDocs(client);
    var trainedDocRefs = _.pluck(trainedDocs, 'ticket.id');
    var plannedDocRefs = category.getAllTrainingDocumentRefs();

    var toAdd = _.difference(plannedDocRefs, trainedDocRefs).sort(),
        toDelete = _.difference(trainedDocRefs, plannedDocRefs).sort(),
        toKeep = _.difference(plannedDocRefs, toAdd, toDelete).sort();

    toAdd = _.compact(toAdd);
    toDelete = _.compact(toDelete);
    toKeep = _.compact(toKeep);

    var serverSideDocs = _.indexBy(trainedDocs, 'ticket.id');

    toAdd    = _.map(toAdd,    function(ref) { return _.extend(serverSideDocs[ref] || {}, { 'ticket.id': ref, status: 'toadd' }); });
    toDelete = _.map(toDelete, function(ref) { return _.extend(serverSideDocs[ref] || {}, { 'ticket.id': ref, status: 'todelete' }); });
    toKeep   = _.map(toKeep,   function(ref) { return _.extend(serverSideDocs[ref] || {}, { 'ticket.id': ref, status: 'normal' }); });

    var hasChanged = (toAdd.length + toDelete.length) > 0;
    var docs = [].concat(toAdd).concat(toDelete).concat(toKeep);
    return {
      docs : docs,
      hasChanged : hasChanged 
    };
  };




  ///////////////////////////////// index training/tuning records //////////////////////////

  TrainingManager.prototype._extractTicketIDXModel = function(fTicket, tags) {
    var categorizer = this._categorizer;
    var clean = categorizer.getCleansing();

    var model = categorizer.extractTicketModel(fTicket);
    model.properties = _.reduce(model.properties, function(memo, value, name) {
      var idxName = IDOLCommon.toIDOLFieldName(name);
      memo[idxName] = value;
      return memo;
    }, {});

    model.contents = _.map(model.contents, clean);
    tags = tags || {};
    tags = _.extend(tags, {
      "SRCTAXONOMY" : categorizer.getTaxonomy()
    });
    model.tags = tags;
    return model;
  };

  TrainingManager.prototype._getIndexBatchSize = function() {
    return this._cfg.batchSize || DEFAULT_INDEX_BATCH_SIZE;
  };
  
  // XXX: the IDX format for "Hot Topic" & "Smart Search" & "Smart Ticket" are different
  // cannot share the index at this moment, they have different data model.
  TrainingManager.prototype._sendIDXInBatch = function(client, database, batch) {
    batch.push("#DREENDDATAREFERENCE\n\n");

    var idxdocs = batch.join('\n\n');
    logger.trace(idxdocs);
    var response = client.executeIndexAction('DREADDDATA', {
      'DREDbName' : database,
      'CreateDatabase': 'TRUE',
      'KillDuplicates' : 'REFERENCE'
    }, idxdocs);
    logger.info('DREADDDATA response: ' + _.trim(response));
    return _.trim(response.split('=')[1]);
  };

  // XXX: The better way is to index ALL the data, and use a query to as the training/tuning
  // once the training sample change, we can simply update the query definition.
  //
  // Currently have to index the required data first, then do the training
  TrainingManager.prototype.doIndex = function(client, tags, options) {
    if (!tags) {
      throw new Error('ContentStore field is required, otherwise the target content is unknown');
    }

    var category = this._category,
        filename = category.getFilename(),
        database = category.getIDOLDatabaseName(),
        refs = category.getAllTrainingDocumentRefs(),
        batchSize = this._getIndexBatchSize(),
        batch = [],
        docCount = 0;

    // XXX: may skip already indexed document
    var iterateTrainingRecords = IDOLCommon.createSCFileIDsIterator(filename, refs);

    iterateTrainingRecords(function(fTicket, i) {
      var model = this._extractTicketIDXModel(fTicket, tags);
      var idx = IDOLIDXDocument.convert(model);
      batch.push(idx);
      if (++docCount % batchSize === 0) {
        this._sendIDXInBatch(client, database, batch);
        batch = [];
      }
    }, this);
    if (batch.length > 0) {
      this._sendIDXInBatch(client, database, batch);
      batch = [];
    }
    return docCount;
  };

  ///////////////// training/testing record management ////////////////

  TrainingManager.prototype.generateNRandomNumbers = function(min, max, n) {
    if ((1.2 * n) > Math.abs(max - min + 1)) {
      return _.range(min, Math.min(max + 1, min + n));
    }

    var uniques = {}, i = 0;
    while(i < n) {
      var v = min + Math.ceil(Math.random() * max);
      if (uniques[v] === undefined) {
        uniques[v] = v; i++;
      }
    }
    return _.values(uniques);
  };

  TrainingManager.prototype.randomSampling = function(recordset, amount, total) {
    if (total <= 0) { return []; }
    var keyname = this._categorizer.getRecordIdName();
    var randoms = this.generateNRandomNumbers(0, total - 1, amount);
    // sort to make access database more efficiency, can iterate from start to end
    randoms = _.sortBy(randoms, function(a, b) { return a > b; });
    return _.map(randoms, function(i) { 
      if (recordset[i] && recordset[i][keyname]) {
        return recordset[i][keyname];
      }
      return undefined; }).filter(function(value) {
        return value !== undefined;
    });
  };

  // XXX: in fact, the more standard way for classification is to split data into three data set
  // 1. training set
  // 2. cross validation set
  // 3. testing set
  //
  // But, to keep it compatible with existing behavior (9.34-9.51), still use two data set.
  //
  // TODO: move logic to 'IDOLSmartTicketCategory', since it can use tuning record instead
  TrainingManager.prototype.updateTrainingAndTestingSamples = function() {
    var categorizer = this._categorizer;
    var filename = categorizer.getFilename(),
        keyname = categorizer.getRecordIdName(),
        fieldnames = categorizer.getCategoryFields(),
        mquery = categorizer.getMandantQuery();

    var fCategory = this._category.getSCFile();

    var restricionQuery = categorizer.getRestrictionQuery(); // XXX: include restriction query and company name
    var values = _.map(CATEGORY_FIELD_NAMES, function(name) { return fCategory[name]; });
    var kv = _.object(fieldnames, values);
    var critiera = _.reduce(kv, function(critiera, value, fieldname) {
      return critiera.and(new QueryCond(fieldname, EQ, value));
    }, new QueryCond());

    var trainingRestrictionQuery = IDOLCommon.compositeCriteria([restricionQuery, critiera.asRAD(), mquery], ' and ');
    logger.info(categorizer + ', fetching training sample via query: ' + trainingRestrictionQuery);
    
    var trainingCandidates = new SCRecordList(filename, trainingRestrictionQuery);
    var trainingTotalCount = trainingCandidates.getCount();
    var trainingSelectedCount = categorizer.getTrainingDocCount(trainingTotalCount);

    // Training doc count is an absolute number, its value can exceed total count
    // in that case, reserve certain amount of data as test sample, and use rest as training
    if (trainingSelectedCount >= trainingTotalCount) {
      trainingSelectedCount = trainingTotalCount - categorizer.getTestingDocCount(trainingTotalCount);
      // XXX: in case `test sample` was configured as 100%
      trainingSelectedCount = Math.max(trainingSelectedCount, 1);
    }

    logger.info(categorizer + ', category ' + fCategory.id + ', training docs: ' + trainingSelectedCount + ' out of ' + trainingTotalCount);
    var trainingRefs = this.randomSampling(trainingCandidates, trainingSelectedCount, trainingTotalCount);

    var testingCriteria = critiera.and(new QueryCond(keyname, ISIN, trainingRefs).not());

    var testingRestrictionQuery = IDOLCommon.compositeCriteria([restricionQuery, testingCriteria.asRAD()], ' and ');
    logger.info(categorizer + ', fetch testing sample via query: ' + testingRestrictionQuery);
    var testingCandidates = new SCRecordList(filename, testingRestrictionQuery);
    var testingTotalCount = testingCandidates.getCount();
    var testingSelectedCount = categorizer.getTestingDocCount(trainingTotalCount);

    logger.info(categorizer + ', category ' + fCategory.id + ', testing docs: ' + testingSelectedCount + ' out of ' + testingTotalCount);
    var testingRefs = this.randomSampling(testingCandidates, testingSelectedCount, testingTotalCount);

    fCategory.traindocs = trainingRefs;
    fCategory.testdocs = testingRefs;
    fCategory.traincount = trainingSelectedCount;
    fCategory.sourcecount = trainingTotalCount;
    fCategory.status = 0; // category need train
    return fCategory;
  };




  ////////////////////////////////////// tuning records management ////////////////////

  TrainingManager.prototype.addTuningRecords = function(refs) {
    var trainingDocRefs = this._category.getTrainingDocumentRefs();
    var trainingRefs = _.uniq(trainingDocRefs.concat(refs));

    var fCategory = this._category.getSCFile();
    fCategory.traindocs = trainingRefs;
    fCategory.doUpdate();
  };

  // after tuning records deleted, the training document defined in IDOL server 
  // still hold, has to do `CategorySetTraining` to update
  TrainingManager.prototype.removeTuningRecords = function(refs) {
    var fCategory = this._category.getSCFile();
    // TODO: handle very large amount of reference delete, delete records by chunk
    var tunings = new SCFile('idoltuning');
    tunings.doPurge(new QueryCond('file.key', ISIN, refs));

    var trainedDocuments = fCategory.traindocs || [];
    _.each(trainedDocuments, function(line, i) {
      line = line || '';
      var traindocs = line.split(',');
      var remains = _.difference(traindocs, refs);
      trainedDocuments[i] = remains.join(',');
    });

    fCategory.traindocs = trainedDocuments;
    fCategory.doSave();
  };


  /**
   * Find tuning records for one specific category
   * 
   * RTE function `generate_sql_query` can only produce `OUTER JOIN`.
   * but `INNER JOIN` is required here.
   */
  var TUNING_RECORD_QUERY = _.template(
    'SELECT <%= selectFields %> ' +
    'FROM <%= filename %> <%= prefix %> INNER JOIN idoltuning t1 ' +
    'ON (<%= prefix %>.<%= key %> = t1.file.key) ' + 
    'WHERE <%= criteria %>'
  );

  TrainingManager.prototype._generateTuningRecordQuery = function(selectFields, initialCriteria) {
    var categorizer = this._categorizer,
        prefix = 't0',
        fCategory = this._category.getSCFile(),
        filename = categorizer.getFilename(),
        key = funcs.dbdict_helper('unique.key', filename)[0],
        withPrefix = function(name) { return prefix + '.' + name; };

    initialCriteria = initialCriteria || new QueryCond();

    selectFields = selectFields || ['*']; // select all fields by default
    selectFields = _.isArray(selectFields) ? selectFields : [ selectFields ];
    selectFields = _.map(selectFields, withPrefix).join(',');

    // Attention: `QueryCond` object is mutable
    //
    // e.g.
    // var qc1 = new QueryCond(), qc2 = new QueryCond();
    // print(qc1.and(qc2) === qc1); // true
    var criteria = _.chain(categorizer.getCategoryFields())
                    .map(function(name) { 
                      var fieldname = withPrefix(name);
                      return new QueryCond(fieldname, EQ, fCategory[name]); 
                    })
                    .reduce(function(c1, c2) { return c1.and(c2); }, initialCriteria)
                    .value();

    var sql = IDOLCommon.compositeCriteria([criteria.asRAD(), categorizer.getRestrictionQuery()], ' and ');
    
    return TUNING_RECORD_QUERY({
      key : key,
      prefix : prefix,
      filename : filename,
      selectFields : selectFields,
      // select tuning records for one category at a time
      criteria : sql
    });
  };
  
  //////////////////////////////////////////////////////////////////////////
  TrainingManager.prototype._getISINQuery = function( filename )
  {
    var records = new SCFile("idoltuning", SCFILE_READONLY);
    var rc = records.doSelect( new QueryCond('file.name', EQ, filename));
    var refs = [];
    while (rc === RC_SUCCESS) {
      refs.push(records["file.key"]);
      rc = records.getNext();
    }
    
    return refs;
  }
  
  TrainingManager.prototype._generateTuningRecordQueryNew = function(selectFields, initialCriteria) {
    var categorizer = this._categorizer,
        prefix = 't0',
        fCategory = this._category.getSCFile(),
        filename = categorizer.getFilename(),
        key = funcs.dbdict_helper('unique.key', filename)[0],
        withPrefix = function(name) { return prefix + '.' + name; };

    initialCriteria = initialCriteria || new QueryCond();

    selectFields = selectFields || ['*']; // select all fields by default
    selectFields = _.isArray(selectFields) ? selectFields : [ selectFields ];
    selectFields = selectFields.join(',');

    // Attention: `QueryCond` object is mutable
    //
    // e.g.
    // var qc1 = new QueryCond(), qc2 = new QueryCond();
    // print(qc1.and(qc2) === qc1); // true
    
    
    var CATEGORY_FIELD_NAMES = ['category', 'subcategory', 'product.type'];
    var realFieldName = categorizer.getCategoryFields();
    var criteriaArray = [];
    
   
    for(var i=0; i<realFieldName.length; i++){
      var realname = realFieldName[i];
      var fieldname = CATEGORY_FIELD_NAMES[i];
      var fieldvalue = fCategory[fieldname]
      var aCond = new QueryCond(realname, EQ, fieldvalue);
      criteriaArray.push(aCond.asRAD());
    }
    
    var criteria = IDOLCommon.compositeCriteria(criteriaArray,' and ');
    
    /**
      the below code has issue since cate2idol2 table does't contain field named affected.item. so remark it and use above code instead
    **/
    /*
    var criteria = _.chain(categorizer.getCategoryFields())
                    .map(function(name) { 
                      var fieldname = name;
                      return new QueryCond(fieldname, EQ, fCategory[name]); 
                    })
                    .reduce(function(c1, c2) { return c1.and(c2); }, initialCriteria)
                    .value();*/
                    
    var isInQuery = new QueryCond(this._categorizer.getRecordIdName(), ISIN, this._getISINQuery(filename));
    
    logger.info("IS IN Query to filter tuning samples:" + isInQuery.asRAD());
    
    var sql = IDOLCommon.compositeCriteria(
       [
        
          criteria, 
          categorizer.getMandantQuery(), 
          categorizer.getRestrictionQuery(), 
          isInQuery.asRAD(), 
       ], ' and ');
    
    return sql;
  };  
  
  //////////////////////////////////////////////////////////////////////////

  TrainingManager.prototype.getTuningRecordRefs = function() {
    var idfield = this._categorizer.getRecordIdName();
    var filename = this._category.getFilename();
    var records = new SCFile(filename, SCFILE_READONLY);
    var query = this._generateTuningRecordQuery(idfield);
    var tquery = this._generateTuningRecordQueryNew(idfield);
    
    logger.info(this._category + ', new tuning record query: ' + tquery);
    logger.info(this._category + ', tuning record query: ' + query);
    
    var rc = records.doSelect(tquery);
    var refs = [];
    while (rc === RC_SUCCESS) {
      refs.push(records[idfield]);
      rc = records.getNext();
    }
    
    logger.info("tunning refs:" + refs);
    return refs;
  };


  /////////////////////////////////////// train category /////////////////////////

  TrainingManager.prototype._trainByTerms = function(client, refs) {
    var strRefs = refs.join('+');
    var id = category.getId();
    var terms = lib.jsaci.getBestTerms(strRefs, lib.IDOL_Constant.getBestTermsCount());
    return lib.jsaci.trainingCategoryByTerms(id, terms);
  };

  TrainingManager.prototype._trainByDocuments = function(client, refs) {
    var database = this._categorizer.getIDOLDatabaseName(),
        category = this._category;
    // these training methods should be invoked in background scheduler
    // because it can take minuts to finish, if running in webtier foreground
    // client timeout may happen
    var res = client.executeAction({
      action: 'CategorySetTraining',
      Category: category.getId(),
      DocRef: refs.join(','),
      DatabaseMatch : database,
      BuildNow : true
    }, {
      long_time : true,
      synchronize : true
    });

    logger.info('train finished, ActionID: ' + res.actionId + ', resposne: ' + res.response);
  };

  TrainingManager.prototype.doTrain = function(client, options) {
    var category = this._category,
        id = category.getId(),
        refs = category.getAllTrainingDocumentRefs();

    client.executeAction({ action: 'CategoryDeleteTraining', Category: id });

    if (refs.length === 0) {
      logger.warn('category ' + id + ' has no training document, skip training');
      return;
    }
    this.doTrainCategory(client, refs);
  };

  TrainingManager.prototype.doBuild = function(client, options) {
    var category = this._category;
    var cmd = _.extend({
      action: 'CategoryBuild',
      Category: category.getId(),
      ForceRefresh: true,
      Recurse: true
    }, options);
    return client.executeAction(cmd, {
      long_time : true,
      synchronize : true
    });
  };

  TrainingManager.prototype.doDelete = function(client, options) {
    var category = this._category;
    var cmd = _.extend({
      action: 'CategoryDelete',
      Category: category.getId(),
      DeletedChildIDs: true
    }, options);
    return client.executeAction(cmd);
  };

  /**
   * Save training/testing result as a snapshot
   *
   * Category tuning can execute many times, history/snapshot is required to
   * notify user that the categorizer accuracy has improvment or downgrade.
   *
   * if it is required, roll back to previous training (rollback training docs
   * and training term weight)
   */
  TrainingManager.prototype.takeSnapshot = function(client, meta) {
    var category = this._category;
    var categorizer = category.getCategorizer();
    
    var snapshot = new SCFile('SmartTicketCategorySnapshot');
    var id = category.getId();
    snapshot['round.id'] = meta.round;
    snapshot['categorizer.id'] = this._categorizer.id;

    // TODO: handle mulitple company
    // snapshot.company = this._categorizer;
    snapshot['category.id'] = id;

    // load training document from IDOL server side.
    var trainings = this.getTrainingDocs(client);
    snapshot['train.docs'] = _.pluck(trainings, 'ticket.id');
    snapshot['train.docs.title'] = _.pluck(trainings, 'title');

    // load term weights from IDOL server side
    var terms = category.getTermWeights(client);
    snapshot.term = _.pluck(terms, 'term');
    snapshot['term.weight'] = _.pluck(terms, 'weight');
    snapshot['term.generated.weight'] = _.pluck(terms, 'generatedWeight');
    snapshot['term.modified.weight'] = _.pluck(terms, 'modifiedWeight');

    snapshot['test.docs'] = category.getTestDocumentRefs();

    snapshot.precision = meta.precision;
    snapshot.recall = meta.recall;
    snapshot['f1.score'] = meta['f1.score'];
    snapshot['company'] = categorizer._company;

    return snapshot.doInsert();
  };

  TrainingManager.prototype.getSnapshot = function(round) {
    var snapshot = new SCFile('SmartTicketCategorySnapshot', SCFILE_READONLY);
    var query = new QueryCond('round.id', EQ, round)
           .and(new QueryCond('categorizer.id', EQ, this._categorizer.id))
           .and(new QueryCond('category.id', EQ, this._category.getId()));

    var rc = snapshot.doSelect(query);
    return rc === RC_SUCCESS ? snapshot : null;
  };

  TrainingManager.prototype.rollbackTraining = function(fSnapshot) {
    var fCategory = this._category.getSCFile();
    var traindocs = fSnapshot['train.docs'];
    var testdocs = fSnapshot['test.docs'];

    fCategory.traindocs = traindocs;
    fCategory.testdocs = testdocs;

    logger.info('rollback ' + fCategory.id + ' with training: ' + traindocs + ' length: ' + traindocs.length);
    return fCategory.doUpdate();
  };
  return {
    create : function(category, options) {
      return new TrainingManager(category, options);
    }
  };
}());


function require() {
  return IDOLSmartTicketCategoryTrainingManager;
}