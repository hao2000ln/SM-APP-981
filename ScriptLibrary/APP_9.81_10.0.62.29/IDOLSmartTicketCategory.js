/**
 * IDOL Category is defined in SM table `cate2idol2`
 *
 * Category is the minimal tuning unit
 */
var _ = lib.Underscore.require(),
    $ = lib.c.$,
    IDOLSmartTicketCategoryAnalyzer = lib.IDOLSmartTicketCategoryAnalyzer.require(),
    IDOLSmartTicketCategoryTermManager = lib.IDOLSmartTicketCategoryTermManager.require(),
    IDOLSmartTicketCategoryTrainingManager = lib.IDOLSmartTicketCategoryTrainingManager.require();

var logger = getLog('IDOLSmartTicketCategory');

var IDOLSmartTicketCategory = (function() {

  // The value in `testdocs, indexdocs, traindocs` fields in `cate2idol` are 
  // array of string, 
  // e.g.: 
  //   ['SD10001,SD10002', 'SD20001,SD20002']
  //
  // convert above values to
  // ['SD10001', 'SD10002', 'SD20001', 'SD20002']
  function expandDocRefs(fCategory, name) {
    return _.chain(fCategory[name])
            .compact()
            .map(function(line) { return line.split(','); })
            .flatten()
            .value();
  }

  /**
   * Wrapper class for `cate2idol2`, it can represent a `category collection`
   *
   * This object only contains some basic work flow control, the real work can
   * be delegated to its `manager`
   */
  function Category(categorizer, fCategory, cfg) {
    cfg = cfg || {};
    cfg.count = cfg.count || 1;

    this._cfg = cfg;
    this._isMulti = (cfg.count > 1);
    this._fCategory = fCategory;
    this._categorizer = categorizer;

    this._analyzer        = IDOLSmartTicketCategoryAnalyzer.create(this);
    this._termManager     = IDOLSmartTicketCategoryTermManager.create(this);
    this._trainingManager = IDOLSmartTicketCategoryTrainingManager.create(this);
  }

  Category.prototype.toString = function() {
    return 'Category: ' + this.getId() + ' (' + this.getName() + ')';
  };

  Category.prototype.limit = function(limit) {
    var cfg = _.clone(this._cfg);
    cfg = _.extend(cfg, { limit : limit });
    cfg.count = Math.min(cfg.count, cfg.limit);
    return new Category(this._categorizer, this._fCategory, cfg);
  };

  // stop iteration when callback return value is boolean false
  Category.prototype.each = function(callback, scope) {
    var limit = this._cfg.limit;
    if (this._isMulti) {
      var rc = this._fCategory.getFirst(), i = 0;
      while (rc === RC_SUCCESS) {
        var result = callback.call(scope, this, i);
        if (result === false) { return; }
        if (limit && ++i >= limit) { return; }
        rc = this._fCategory.getNext();
      }
    } else {
      if (this._fCategory.getFirst() === RC_SUCCESS) {
        callback.call(scope, this, 0);
      }
    }
  };

  Category.prototype.map = function(callback, scope) {
    var results = [];
    scope = scope || this;
    this.each(function() {
      var result = callback.apply(scope, arguments);
      results.push(result);
    }, scope);
    return results;
  };

  // XXX: id value can vary when execute `getNext, getPrev`
  Category.prototype.getId = function() {
    return this._fCategory.id;
  };

  Category.prototype.getNames = function() {
    var fieldnames = this._categorizer.getCategoryFieldsInCategory();
    var fCategory = this.getSCFile();
    var names = _.map(fieldnames, function(name) {
      return fCategory[name];
    });
    return _.compact(names);
  };

  // category can have hierachy, flatten them to have a quick view.
  Category.prototype.getName = function() {
    var names = this.getNames();
    return names.join(' / ');
  };

  Category.prototype.getSCFile = function() {
    return this._fCategory;
  };

  Category.prototype.getValue = function() {
    return {
      id: this.getId(),
      status: this._fCategory.status,
      sourcecount: this._fCategory.sourcecount,
      traindocs: this.getTrainingDocumentRefs()
    };
  };

  Category.prototype.getCount = function() {
    return this._cfg.count;
  };

  Category.prototype.getCategorizer = function() {
    return this._categorizer;
  };

  Category.prototype.getFilename = function() {
    return this._categorizer.getFilename();
  };

  Category.prototype.getTaxonomy = function() {
    return this._categorizer.getTaxonomy();
  };

  Category.prototype.getIDOLDatabaseName = function() {
    return this._categorizer.getIDOLDatabaseName();
  };

  Category.prototype.getTuningDocumentRefs = function() {
    return this._trainingManager.getTuningRecordRefs();
  };

  Category.prototype.getTrainingDocumentRefs = function() {
    return expandDocRefs(this._fCategory, 'traindocs');
  };

  // XXX: In fact, we can update `cate2idol2` record directly to add/remove training sample
  // But for compatible reason, still need to add the new training sample into `idoltuning` table, 
  // since customer may already have chosen the tuning records there.
  Category.prototype.getAllTrainingDocumentRefs = function() {
    var traindocs = this.getTrainingDocumentRefs(),
        tuningdocs = this.getTuningDocumentRefs();
    var all = traindocs.concat(tuningdocs);
    return _.uniq(all);
  };

  Category.prototype.getTestDocumentRefs = function() {
    return expandDocRefs(this._fCategory, 'testdocs');
  };

  ///////////////////////////////// term management /////////////////////////////////

  Category.prototype.termUsage = function(client, term) {
    var refs = this.getTrainingDocumentRefs();
    return this._termManager.getTermInfo(client, term, {
      MatchReference : refs.join('+')
    });
  };

  Category.prototype.getTermWeights = function(client) { return this._termManager.getTNW(client); };
  Category.prototype.termInDocuments = function(client, term) { return this._termManager.findUsageInTraining(client, term); };
  Category.prototype.updateTerms = function(client, tnw) { 
    var categorizer = this._categorizer;
    logger.info(categorizer + ', update category term weights: ' + this.getId());
    return this._termManager.updateTNW(client, tnw);
  };

  Category.prototype.resetTerms = function(client) {
    var categorizer = this._categorizer;
    logger.info(categorizer + ', reset category term weights: ' + this.getId());
    return this._termManager.resetTNW(client);
  };

  Category.prototype.addTerm = function(client, term, weight, tnws) {
    var categorizer = this._categorizer;
    logger.info(categorizer + ', add term: ' + term + ' to category ' + this.getId());
    return this._termManager.addTerm(client, term, weight, tnws);
  };

  ////////////////////////////////// category snapshot /////////////////////////////////

  Category.prototype.getSnapshot = function(round) { return this._trainingManager.getSnapshot(round); };
  Category.prototype.takeSnapshot = function(client, meta) { return this._trainingManager.takeSnapshot(client, meta); };
  Category.prototype.rollbackTo = function(fSnapshot) { return this._trainingManager.rollbackTraining(fSnapshot); };

  ////////////////////////////////// tuning ///////////////////////////////////

  Category.prototype.getTrainings = function(client) { 
    return this._trainingManager.getTrainingDelta(client);
  };

  Category.prototype.doIndex = function(client, tags, options) {
    var categorizer = this._categorizer;
    logger.info(categorizer + ', index category: ' + this);
    return this._trainingManager.doIndex(client, tags, options); 
  };

  Category.prototype.doTrain = function(client, options) { 
    var categorizer = this._categorizer;
    logger.info(categorizer + ', train category, ' + this);
    return this._trainingManager.doTrain(client, options); 
  };

  Category.prototype.doBuild = function(client, options) { 
    var categorizer = this._categorizer;
    logger.info(categorizer + ', build category, ' + this);
    return this._trainingManager.doBuild(client, options); 
  };

  Category.prototype.doDelete = function(client, options) {
    var categorizer = this._categorizer;
    logger.info(categorizer + ', delete category, ' + this);
    return this._trainingManager.doDelete(client, options); 
  };

  Category.prototype.doCreate = function(client, options) {
    var categorizer = this._categorizer;
    logger.info(categorizer + ', create category, ' + this);
    return this._trainingManager.doCreate(client, options);
  };

  ////////////////////////////// training //////////////////////////////


  Category.prototype.isLeaf = function() {
    var names = this.getNames();
    var categories = this._categorizer.getCategoryFields();
    return names.length === categories.length;
  };

  // TODO: refine verbs, since 'category CRUD' can happend in two place
  // 1. in sm table `cate2idol2`
  // 2. in IDOL server side
  Category.prototype.pickSamples = function() {
    var categorizer = this._categorizer;
    // in Smart Ticket, assume category concept was not inherited
    // only leaf node can have training document
    if (this.isLeaf()) {
      logger.info(categorizer + ', pick training sample, ' + this);
      return this._trainingManager.updateTrainingAndTestingSamples();
    }
  };

  //////////////////////////////////// ticket related ///////////////////////////

  Category.prototype.addTuningRecords = function(refs) { return this._trainingManager.addTuningRecords(refs); };
  Category.prototype.deleteTuningRecords = function(refs) { return this._trainingManager.removeTuningRecords(refs); };

  Category.prototype.addTestingRecords = function(toAdd) {
    toAdd = _.isArray(toAdd) ? toAdd : [ toAdd ];
    var fCategory = this._fCategory;
    var refs = this.getTestDocumentRefs();
    fCategory.testdocs = _.uniq(refs.concat(toAdd));
    fCategory.doUpdate();
  };

  Category.prototype.deleteTestingRecords = function(toDelete) {
    toDelete = _.isArray(toDelete) ? toDelete : [ toDelete ];
    var fCategory = this._fCategory;
    var refs = this.getTestDocumentRefs();
    fCategory.testdocs = _.difference(refs, toDelete);
    fCategory.doUpdate();
  };
  /////////////////////////////////// misc ///////////////////////////////

  Category.prototype.getStatus = function(client, options) { throw new Error('unimplemented'); };
  Category.prototype.activeIt = function(client, options) { throw new Error('unimplemented'); };
  Category.prototype.deactiveIt = function(client, options) { throw new Error('unimplemented'); };
  Category.prototype.evaluateTraining = function(client, ref) { return this._analyzer.evaluateImportance(client, ref); };
  
  Category.prototype.hasChanged = function(client, options) {
    var delta = this.getTrainings(client);
    return delta.hasChanged;
  };

  Category.prototype.createClient = function() {
    return this._categorizer.createClient();
  };

  // When SMIS task is running, should block UI to do further tuning/training
  Category.prototype.findSMISTask = function() {
    return lib.IDOL_SMIS.findSMISTask(this._categorizer.getSCFile()) ||
           lib.IDOL_SMIS.findSMISTask(this.getSCFile());
  };

  Category.prototype.findACIActions = function() {
    return this._categorizer.findACIActions();
  };

  Category.prototype.getCategoryValues = function() {
    var names = this._categorizer.getCategoryFields();
    var values = this.getNames();
    return _.object(names, values);
  };

  Category.prototype.doFill = function(fTicket) {
    var filename = funcs.filename(fTicket);
    if (filename !== this.getFilename()) {
      throw new Error(this + ' cannot be used to fill ' + filename);
    }

    var values = this.getCategoryValues();
    _.each(values, function(v, k) { fTicket[k] = v; });
    // TODO: use `link` fill to make sure user can view this category
    // TODO: if user cannot view `current` category, iterate to next one
    return fTicket;
  };

  function findCompany(fCategory) {
    var fCompanyCategory = new SCFile('cate2idol2', SCFILE_READONLY);
    var rc = fCompanyCategory.doSelect(new QueryCond('id', EQ, fCategory.subgroup));
    return (rc === RC_SUCCESS) ? fCompanyCategory.name : '';
  }

  return {
    create : function(categorizer, fCategory, cfg) {
      return new Category(categorizer, fCategory, cfg);
    },
    wrap : function(fCategory) {
      // prevent recursive reference
      var IDOLSmartTicketCategorizerFactory = lib.IDOLSmartTicketCategorizerFactory.require();
      var company = findCompany(fCategory);
      var categorizer = IDOLSmartTicketCategorizerFactory.create(fCategory.groupid, company);
      return this.create(categorizer, fCategory);
    }
  };
}());

function require() {
  return IDOLSmartTicketCategory;
}
