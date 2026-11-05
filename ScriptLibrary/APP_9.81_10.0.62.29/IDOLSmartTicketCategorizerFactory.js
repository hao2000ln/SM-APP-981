/**
 * Smart Ticket facade, it manage basic meta information
 *
 * Hide the difference of `Regular Categorizer` and `Multi-Company Categorizer`
 */
var _ = lib.Underscore.require(),
    XQuery = lib.XQuery.require(),
    IDOLCommon = lib.IDOLCommon.require(),
    IDOLSmartTicketCategory = lib.IDOLSmartTicketCategory.require(),
    IDOLSmartTicketCompatible = lib.IDOLSmartTicketCompatible.require(),
    IDOLMandant = lib.IDOLMandant.require();

var logger = getLog('IDOLSmartTicketCategorizerFactory');
var CompatibleCodec = IDOLSmartTicketCompatible.name;

var IDOLSmartTicketCategorizerFactory = (function() {


  // TODO: support infinite level of category
  // for historical reason, the field names were hard-coded as below, even the 
  // real field name is not below three.
  var CATEGORY_FIELD_NAMES = ['category', 'subcategory', 'product.type'];


  function newCategoryId() {
    var rc = new SCDatum(), number = new SCDatum();
    funcs.rtecall("getnumber", rc, number, "cate2idolid");
    return number.getValue();
  }

  function Categorizer(fCategorizer, fRootCategory) {
    if (!fRootCategory) {
      throw new Error('root category is not available');
    }

    var filename = fCategorizer['table.name'];
    var keys = funcs.dbdict_helper("unique.key", filename);
    if (keys.length() !== 1) {
      throw new Error('unable to handle compound unique key, filename: ' + filename + ', keys: ' + keys);
    }

    var categoryFields = _.compact([ fCategorizer['level1.field'], fCategorizer['level2.field'], fCategorizer['level3.field']]);
    if (categoryFields.length === 0) {
      throw new Error('there is no category field defined, abort');
    }

    this.id = fCategorizer['adapter.id'];

    this._fCategorizer = fCategorizer;
    this._fRootCategory = fRootCategory;

    this._categoryFields = categoryFields;
    this._titleField = fCategorizer['title.field'];
    this._contentFields = _.compact(fCategorizer['content.fields']);

    this._keyName = keys[0];
    this._filename = filename;

    var fieldNamesInCategory = CATEGORY_FIELD_NAMES.slice(0, categoryFields.length);
    var fieldNamesInTicket = categoryFields;

    this._nameMapping = _.object(fieldNamesInTicket, fieldNamesInCategory);
    this._fieldNamesInCategory = fieldNamesInCategory;
  }

  Categorizer.prototype.toString          = function() { return 'Categorizer: ' + this.id; };
  Categorizer.prototype.getType           = function() { return this.constructor.name; };
  Categorizer.prototype.isActive          = function() { return this._fCategorizer.is_active; };
  Categorizer.prototype.getSCFile         = function() { return this._fCategorizer; };
  Categorizer.prototype.getFilename       = function() { return this._filename; };
  Categorizer.prototype.getRecordIdName   = function() { return this._keyName; };
  Categorizer.prototype.getTaxonomyRoot   = function() { return this._fRootCategory; };
  Categorizer.prototype.getRootCategory   = function() { return this._fRootCategory; };
  Categorizer.prototype.getTaxonomy       = function() { return this._fCategorizer['category.group.name']; };
  Categorizer.prototype.getTitleField     = function() { return this._fCategorizer['title.field']; };
  Categorizer.prototype.getNameMapping    = function() { return this._nameMapping; };
  Categorizer.prototype.getContentFields  = function() { return _.compact(this._fCategorizer['content.fields']); };

  // category field, its value are field name defined in ticket table
  Categorizer.prototype.getCategoryFields = function() { return this._categoryFields; };
  // cate2idol2 category field names;
  Categorizer.prototype.getCategoryFieldsInCategory = function() { return this._fieldNamesInCategory; };

  // Lazy load
  Categorizer.prototype.getCleansing      = function() {
    var filename = this._filename;
    var IDOLDataCleansing = lib.IDOLDataCleansing.require();
    var cleansing = IDOLDataCleansing.getCleanser(filename) || _.identity;
    this.getCleansing = function() { return cleansing; };
    return cleansing;
  };

  Categorizer.prototype.getStatusManager  = function() {
    var IDOLSmartTicketCategorizerStatusManager = lib.IDOLSmartTicketCategorizerStatusManager.require();
    var statusManager = IDOLSmartTicketCategorizerStatusManager.create(this);
    this.getStatusManager = function() { return statusManager; };
    return statusManager;
  };

  Categorizer.prototype.getTrainingDocCount = function(total) {
    return this._fCategorizer['training.doc.number'];
  };

  Categorizer.prototype.getCoverage = function() {
    return this._fCategorizer['src.data.coverage'] / 100;
  };

  // XXX: this method was overwritten by CompanyCategorizer to restrict the data access
  Categorizer.prototype.getRestrictionQuery = function() {
    return this._fCategorizer['training.condition'] || 'true';
  };
 
  
  // XXX: for common categorizer do not provide mandant field  
  Categorizer.prototype.getMandantField = function() { 
    return null
  }
 
  // XXX: for common categorizer do not provide mandant query 
  Categorizer.prototype.getMandantQuery = function() {
    return null;
  };

  Categorizer.prototype.getTrainingMethod = function() {
    return this._fCategorizer['training.method'] === 1 ? 'byterm' : 'bydoc';
  };

  Categorizer.prototype.getThreshold = function() {
    return this._fCategorizer['suggestion.threshold'] || 0;
  };

  // IDOL Content database stored all the document which will be used as training sample
  Categorizer.prototype.getIDOLDatabaseName = function() {
    var filename = this._filename;
        group = this._fCategorizer['category.group.name'];
    return lib.acicategory.getCategoryIDOLDatabase(filename, group);
  };

  Categorizer.prototype.getTestingDocCount = function(total) {
    // data type of 'test.sample.percentage' is character
    var ratio = this._fCategorizer['test.sample.percentage'];
    ratio = parseInt(ratio, 10);
    ratio /= 100;
    var count = Math.max(ratio * total, 1);
    return Math.ceil(count);
  };

  Categorizer.prototype.getRecordId = function(fTicket) {
    var filename = funcs.filename(fTicket);
    if (filename !== this._filename) {
      throw new Error(this + ' unable to handle ' + filename + ' categorization.');
    }
    return fTicket[this._keyName];
  };

  Categorizer.prototype.getLatestTestRound = function() {
    var fResult = new SCFile('SmartTicketTestRounds', SCFILE_READONLY);
    fResult.setOrderBy(['test.time'], [SCFILE_DSC]);
    var rc = fResult.doSelect(new QueryCond('categorizer.id', EQ, this.id));
    return rc === RC_SUCCESS ? fResult.id : 0;
  };


  // for training & tesing
  // SM table schema is not important for IDOL, IDOL server only need to know which field
  // contains reference (unique identifier), and which fields contains text information
  //
  // Convert SCFile into JSON format
  Categorizer.prototype.extractTicketModel = function(fTicket) {
    var filename = funcs.filename(fTicket);
    if (filename !== this.getFilename()) {
      throw new Error(this + ' cannot extract text features for ' + filename);
    }

    var model = {};
    model.reference = this.getRecordId(fTicket);
    model.properties = _.reduce(this._categoryFields, function(memo, name) {
      memo[name] = fTicket[name];
      return memo;
    }, {});
    model.title = fTicket[this._titleField];
    model.contents = _.map(this._contentFields, function(name) {
      var value = fTicket[name];
      return _.isArray(value) ? value.join('\n') : value;
    });
    return model;
  };

  Categorizer.prototype._wrapCategory = function(fCategory, cfg) {
    return IDOLSmartTicketCategory.create(this, fCategory, cfg);
  };

  Categorizer.prototype.createCategoryQueryCriteria = function() {
    return new QueryCond('groupid', EQ, this.id)
      .and(new QueryCond('subgroup', EQ, this._fRootCategory.subgroup))
      .and(new QueryCond('parentid', NEQ, 0));
  };

  Categorizer.prototype.createCategoryCollectionWithQuery = function(criteria, options) {
    criteria = criteria || new QueryCond();
    options = options || {};

    var query = this.createCategoryQueryCriteria().and(criteria);

    var fCategory = new SCFile('cate2idol2');

    var orderBy = options.orderBy;
    if (orderBy) {
      var names = _.keys(orderBy), values = _.values(orderBy);
      fCategory.setOrderBy(names, values);
    }

    var count = fCategory.doCount(query);
    var rc = fCategory.doSelect(query);
    var cfg = { count : count };
    return this._wrapCategory(fCategory, cfg);
  };

  // sometimes the fCategory record was not saved into database yet, use this 
  // method to create a wrapper to provide additional information without 
  // database access.
  Categorizer.prototype.wrapCategory = function(fCategory) {
    return this._wrapCategory(fCategory, { count: 1});
  };

  Categorizer.prototype.getCategory = function(id) {
    return this.createCategoryCollectionWithQuery(new QueryCond('id', EQ, id));
  };

  Categorizer.prototype.getCategoryByStatus = function(status, options) {
    var criteria = new QueryCond('status', EQ, status);
    return this.createCategoryCollectionWithQuery(criteria, options);
  };

  Categorizer.prototype.getCategories = function(options) {
    return this.createCategoryCollectionWithQuery(new QueryCond(), options);
  };

  Categorizer.prototype.idsToCategory = function(ids) {
    ids = _.isArray(ids) ? ids : [ ids ];
    return this.createCategoryCollectionWithQuery(new QueryCond('id', ISIN, ids));
  };

  Categorizer.prototype.getTrainedCategory = function(options) {
    return this.getCategoryByStatus(2, options);  // training finished
  };

  // `client` with prefix can be used to trace ACI action which IDOL server 
  // currently is running
  Categorizer.prototype.createClient = function() {
    var IDOLClientFactory = lib.IDOLClientFactory.require();
    var prefix = 'SM_Smart_Ticket_Categorizer_' + this.id + '_';
    return IDOLClientFactory.create('SmartTicket', prefix);
  };

  Categorizer.prototype.findACIActions = function() {
    return this.createClient().findACIActions();
  };

  Categorizer.prototype.createSuggestionAgent = function(client, cfg) {
    var factory = lib.IDOLSmartTicketCategorizerSuggestionAgent.require();
    return factory.create(client, this, cfg);
  };

  // Single Company & Multi Company can have different style of taxonomy
  Categorizer.prototype.createTaxonomyRoot = function(client) {
    var taxonomy = this.getTaxonomy(),
        id = this.getTaxonomyRoot().id;

    logger.info('create category taxonomy: "' + taxonomy + '", id: ' + id);
    client.executeAction({
      action: 'CategoryCreate',
      Name: CompatibleCodec.encode(taxonomy),
      Category: id,
      Parent: 0 // Single company, taxonomy was attached to the root
    });

    client.executeAction({
      action: 'CategorySetDetails',
      Category: id,
      TaxonomyRoot: true
    });
    return { name: taxonomy, id : id };
  };

  Categorizer.prototype.indexTrainingSamples = function(client) {
    var database = this.getIDOLDatabaseName();
    var tags = client.getDistributeNameAndValue(database);

    var delta = 0;
    var categoryCollection = this.getCategoryByStatus(0); // newly added ones
    categoryCollection.each(function(category) {
      var value = category.getValue();
      // intermediate category doesn't have training document, but its status is also '0'
      // TODO: refine to only search leaf category
      var traindocs = value.traindocs || []; 
      if (traindocs.length > 0) {
        category.doIndex(client, tags);
      }
      delta += traindocs.length;
    });
    if (delta > 0) {
      client.flushAndWait();
      logger.info(this + ', ' + delta + ' training records has been indexed');
    }
  };

  Categorizer.prototype.updateProps = function(key, value) {
    var fCategorizer = this._fCategorizer;
    funcs.rtecall("refresh", vars['$L.void'], fCategorizer);
    fCategorizer[key] = value;
    return fCategorizer.doUpdate();
  };

  Categorizer.prototype.start = function() {
    this.updateProps('last.training.time', null);
  };

  Categorizer.prototype.done = function() {
    this.updateProps('last.training.time', new Date());
    this.updateProps('is.active', true);
  };

  Categorizer.prototype.resetTrainingStatus = function() {
    this.getStatusManager().createTrainingStatusMonitor().reset();
  };

  Categorizer.prototype.resetTestingStatus = function() {
    this.getStatusManager().createTestingStatusMonitor().reset();
  };

  Categorizer.prototype.resetTuningStatus = function() {
    this.getStatusManager().createTuningStatusMonitor().reset();
  };

  // XXX: Seems like RTE doesn't work well on `doPurge`
  //  RTE warning SCFile.doPurge called on unsupported table "SmartTicketTestResults" with aliases - ignored
  function oldFashionPurge(filename, query) {
    logger.warn('failed to purge record, filename:' + filename + ' query:' + query + ', fallback to loop delete');
    var fTarget = new SCFile(filename);
    var rc = fTarget.doSelect(query);
    while (rc === RC_SUCCESS) {
      fTarget.doDelete();
      rc = fTarget.getNext();
    }
  }

  function purgeCategorizer(filename, query) {
    var fTarget = new SCFile(filename);
    var rc = fTarget.doPurge(query);
    if (rc === RC_SUCCESS) {
      var purgedCount = fTarget.getPurgedRowCount();
      logger.info(purgedCount + ' ' + filename + ' record has been purged with query: ' + query);
    } else {
      oldFashionPurge(filename, query);
    }
  }

  Categorizer.prototype.destroyCategories = function() {
    purgeCategorizer('SmartTicketCategorySnapshot', new QueryCond('categorizer.id', EQ, this.id).asRAD());
    purgeCategorizer('SmartTicketTestResults', new QueryCond('categorizer.id', EQ, this.id).asRAD());
    purgeCategorizer('SmartTicketTestRounds', new QueryCond('categorizer.id', EQ, this.id).asRAD());
    purgeCategorizer('cate2idol2', new QueryCond('groupid', EQ, this.id).asRAD());
    purgeCategorizer('idolsecgroup',  new QueryCond('adapter.id', EQ, this.id).asRAD());
  };

  // dump categorizer information for debug purpose
  Categorizer.prototype._inspect = function() {
    return {
      "id": this.id,
      "name": this._fCategorizer['category.group.name'],
      "idol": {
        "taxonomy": this.getTaxonomy(),
        "threshold": this.getThreshold(),
        "database": this.getIDOLDatabaseName()
      },
      "source": {
        "filename": this.getFilename(),
        "record.id.field": this.getRecordIdName(),
        "catgory.fields": this.getCategoryFields(),
        "title.field": this.getTitleField(),
        "content.fields": this.getContentFields()
      },
      "train": {
        "coverage": this.getCoverage(),
        "method": this.getTrainingMethod(),
        "train.doc.1000": this.getTrainingDocCount(1000),
        "test.doc.1000": this.getTestingDocCount(1000)
      }
    };
  };

  Categorizer.prototype.newCategoryId = newCategoryId;

  Categorizer.prototype.newCategory = function() {
    var fCategory = new SCFile('cate2idol2');
    fCategory.id = this.newCategoryId();
    fCategory.groupid = this.id;
    fCategory.subgroup = 0;
    return fCategory;
  };

  /**
   * for MSP, depends on `$G.multi`
   */
  function CompanyCategorizer(fCategorizer, fRootCategory, fCompanyCategory) {
    Categorizer.apply(this, arguments);
    var company = fCompanyCategory.name;
    if (!company) {
      throw new Error('company is required in CompanyCategorizer');
    }
    this._fCompanyCategory = fCompanyCategory;
    this._company = company;
  }

  function F1() {}
  F1.prototype = Categorizer.prototype;
  CompanyCategorizer.prototype = new F1();
  CompanyCategorizer.prototype.constructor = CompanyCategorizer;

  CompanyCategorizer.prototype.toString = function() {
    return 'Company Categorizer: ' + this.id + ', company: ' + this._company;
  };

  CompanyCategorizer.prototype.getTaxonomyRoot = function() {
    return this._fCompanyCategory;
  };

  CompanyCategorizer.prototype.getTaxonomy = function() {
    var name = this._fCategorizer['category.group.name'];
    return [name, this._fCompanyCategory.name].join('_');
  };

  CompanyCategorizer.prototype.getRootCategory = function() {
    return this._fCompanyCategory;
  };

  CompanyCategorizer.prototype.createCategoryQueryCriteria = function() {
    return new QueryCond('groupid', EQ, this.id)
      .and(new QueryCond('subgroup', EQ, this._fCompanyCategory.id))
      .and(new QueryCond('id', NEQ, this._fCompanyCategory.id));
  };

  CompanyCategorizer.prototype.newCategory = function() {
    var fCategory = new SCFile('cate2idol2');
    fCategory.id = this.newCategoryId();
    fCategory.groupid = this.id;
    fCategory.subgroup = this._fCompanyCategory.id;
    return fCategory;
  };

  CompanyCategorizer.prototype.findOrCreateAggregationCategoryRoot = function(client) {
    var fAggregationCategoryRoot = this._fRootCategory;
    var id = fAggregationCategoryRoot.id;
    var name = this._fCategorizer['category.group.name'];
    var doc = client.executeAction({
      action: 'CategoryFind',
      Name: CompatibleCodec.encode(name),
      Parent: 0
    });
    var categoryIdText = XQuery.queryText('responsedata/autn:id', doc);
    if (categoryIdText) {
      // XXX: in fact convert "IDOL category id" into integer format is not a safe way
      // IDOL server side the category id is a 'long' number, it can be overflow when
      // converting to js int value, but currently all category id are assigned by
      // sm apps code, unlikely exceed the int number limit
      var categoryId = parseInt(categoryIdText, 10);
      if (categoryId === id) {
        return { name: name, id : id };
      } else {
        logger.warn('*******************************************************************************************************');
        logger.warn('* SM defined multi-company root category id is ' + fAggregationCategoryRoot.id);
        logger.warn('* But IDOL side multi-company root category id is ' + categoryId);
        logger.warn('* Category ID miss match, delete IDOL side multi-company root category and create a new one');
        logger.warn('* ');
        logger.warn('* This is mainly because `cate2idol2` category definition has been removed, but IDOL server still keep');
        logger.warn('*******************************************************************************************************');

        logger.info('delete multi-company category root and create a new one');
        logger.info('old multi-company category root is: ' + categoryId);
        logger.info('new multi-company category root is: ' + fAggregationCategoryRoot.id);

        client.executeAction({
          action: 'CategoryDelete',
          Category: categoryId
        });
      }
    }
    
    client.executeAction({
      action: 'CategoryCreate',
      Name: CompatibleCodec.encode(name),
      Category: id,
      Parent: 0
    });

    return { name: name, id: id};
  };

  CompanyCategorizer.prototype.createTaxonomyRoot = function(client) {
    var multiCompanyRoot = this.findOrCreateAggregationCategoryRoot(client);
    var taxonomy = this.getTaxonomy(),
        id = this.getTaxonomyRoot().id;

    logger.info('create category taxonomy: "' + taxonomy + '", id: ' + id);
    client.executeAction({
      action: 'CategoryCreate',
      Name: CompatibleCodec.encode(taxonomy),
      Category: id,
      Parent: multiCompanyRoot.id
    });

    client.executeAction({
      action: 'CategorySetDetails',
      Category: id,
      TaxonomyRoot: true
    });
    return { name: taxonomy, id : id };
  };

  CompanyCategorizer.prototype.getIDOLDatabaseName = function() {
    var filename = this._filename,
        group = this._fCategorizer['category.group.name'],
        company = this._company;
    return lib.acicategory.getCategoryIDOLDatabase(filename, group, company);
  };

  /**
  * this._company is a single value, even mandant field is array type and it can hold value list in it. 
  * but in training process, this._company should be a one of of all possible mandant value list
  **/
  CompanyCategorizer.prototype.getRestrictionQuery = function() {
    var base = this._fCategorizer['training.condition'] || 'true';
    return base;
  };
  
  CompanyCategorizer.prototype.getMandantField = function() {
    var filename = this._filename;
    var mandantFieldValue = this._company;
    var mandantFieldName = IDOLMandant.getMandantField(filename);
    var mandantFieldType = lib.tableFunctions.getFieldType(mandantFieldName, filename, true) 
  
    if(mandantFieldType == -1){
      throw new Error('Error Configuration of Mandant settings');
    }  
    return {'mandantFieldName': mandantFieldName, 'mandantFieldType': mandantFieldType, 'isArray': mandantFieldType==8}
  }
  
  CompanyCategorizer.prototype.getMandantQuery = function() {
    
    var filename = this._filename;
    var mandantFieldValue = this._company;
    var mandantFieldName = IDOLMandant.getMandantField(filename);
    var mandantFieldType = lib.tableFunctions.getFieldType(mandantFieldName, filename, true)

    if(mandantFieldType == -1){
      throw new Error('Error Configuration of Mandant settings');
    }
    
    var criteria = '';
    if(mandantFieldType!=8){
      criteria = new QueryCond(mandantFieldName, EQ, mandantFieldValue).asRAD();
    }else{
      criteria = 'index("'+ mandantFieldValue +'"' +',' + mandantFieldName + ')>0';
    }
    
    //criteria = 'index("incident",testmandarray)>0' 
    //criteria = 'testmandarray="incident"';
    return criteria;
  };

  CompanyCategorizer.prototype.getLatestTestRound = function() {
    var result = new SCFile('SmartTicketTestRounds', SCFILE_READONLY);
    result.doSelect('select max(id) from SmartTicketTestRounds where company="' + this._company + '" and categorizer.id=' + this.id);
    return result[0];
  };

  /**
   * TODO: support Mandant settings, depends on `scmandat` definition. 
   * Catgory can have mandant restriction
   *
   * e.g.
   * when the target `category` field is `affected.item`, not all CI can be exposed
   * to the end user, and IDOL should only suggest those category which user has
   * permission to see it.
   */
  function MandantCategorizer(fCategorizer, mandant) {
    Categorizer.apply(this, arguments);
  }

  function F2() {}
  F2.prototype = Categorizer.prototype;
  MandantCategorizer.prototype = new F2();
  MandantCategorizer.prototype.constructor = MandantCategorizer;

  MandantCategorizer.prototype.toString = function() {
    return 'Mandant Categorizer: ' + this.id;
  };

  MandantCategorizer.prototype.createSuggestionAgent = function() {
    throw new Error('unimplemented exception');
  };

  /**
   * TODO: Summaries information of multiple company
   * 
   * Most of the time we only concern about ONE company category accuracy, or
   * train ONE category, but sometimes we want to have a whole overview of the
   * Smart Ticket testing/training
   */
  function MultiCompanyCategorizer() {
    Categorizer.apply(this, arguments);
  }

  function F3() {}
  F3.prototype = Categorizer.prototype;
  MultiCompanyCategorizer.prototype = new F3();
  MultiCompanyCategorizer.prototype.constructor = MultiCompanyCategorizer;

  MultiCompanyCategorizer.prototype.toString = function() {
    return 'MultiCompany Categorizer: ' + this.id;
  };
  
  
  MultiCompanyCategorizer.prototype.getMandantField = function() {
    var filename = this._filename;
    var mandantFieldName = IDOLMandant.getMandantField(filename);
    var mandantFieldType = lib.tableFunctions.getFieldType(mandantFieldName, filename, true) 
    if(mandantFieldType == -1){
      throw new Error('Error Configuration of Mandant settings');
    }  
    return {'mandantFieldName': mandantFieldName, 'mandantFieldType': mandantFieldType, 'isArray': mandantFieldType==8}
  }

  MultiCompanyCategorizer.prototype.createSuggestionAgent = function() {
    throw new Error('unsupported method, need to speicify which "company" it is working on');
  };

  MultiCompanyCategorizer.prototype.newCategory = function() {
    throw new Error('create new category for multi-company');
  };

  MultiCompanyCategorizer.prototype.createTaxonomyRoot = function() {
    throw new Error('create texonomy root for multi-company');
  };

  // this function can be a little bit duplicate with child category creation
  // but there it use different field name and values
  function createCategorizerRootCategory(fCategorizer) {
    var fCategory = new SCFile('cate2idol2');
    fCategory.id = newCategoryId();
    fCategory.groupid = fCategorizer['adapter.id'];
    fCategory.subgroup = 0;
    fCategory.parentid = 0;
    fCategory.status = 0;
    fCategory.sourcecount = 0;
    fCategory.indexcount = 0;
    fCategory.traincount = 0;
    fCategory.testflag = 0;
    fCategory.name = fCategorizer['category.group.name'];
    var category_fieldnames = ['category', 'subcategory', 'product.type'];
    var fieldnames = [ fCategorizer['level1.field'], fCategorizer['level2.field'], fCategorizer['level3.field']];
    var kvs = _.object(category_fieldnames, fieldnames);
    _.each(kvs, function(value, name) { fCategory[name] = value; });
    fCategory.doInsert();
    logger.info('creating root category: ' + fCategory.id + ' for ' + fCategorizer['adapter.id']);
    return fCategory;
  }

  function findOrCreateCategorizerRootCategory(fCategorizer) {
    var id = fCategorizer['adapter.id'];
    var fRootCategory = new SCFile('cate2idol2');
    var query = new QueryCond('groupid', EQ, id)
           .and(new QueryCond('parentid', EQ, 0));

    var rc = fRootCategory.doSelect(query);
    return rc === RC_SUCCESS ? fRootCategory : createCategorizerRootCategory(fCategorizer);
  }

  function createCategorizerCompanyCategory(fCategorizer, fRootCategory, company) {
    var fCategory = new SCFile('cate2idol2');
    fCategory.id = newCategoryId();
    var category_fieldnames = ['category', 'subcategory', 'product.type'];
    var fieldnames = [ fCategorizer['level1.field'], fCategorizer['level2.field'], fCategorizer['level3.field']];
    var kvs = _.object(category_fieldnames, fieldnames);
    _.each(kvs, function(value, name) { fCategory[name] = value; });
    fCategory.groupid = fCategorizer['adapter.id'];
    fCategory.subgroup = fCategory.id;
    fCategory.parentid = fRootCategory.id;
    fCategory.traincount = 0;
    fCategory.status = 0;
    fCategory.name = company;
    fCategory.doInsert();
    return fCategory;
  }

  function findOrCreateCategorizerCompanyCategory(fCategorizer, fRootCategory, company) {
    var id = fCategorizer['adapter.id'];
    var fCompanyCategory = new SCFile('cate2idol2');
    var query = new QueryCond('groupid', EQ, id)
           .and(new QueryCond('parentid', EQ, fRootCategory.id))
           .and(new QueryCond('name', EQ, company));
    var rc = fCompanyCategory.doSelect(query);
    return rc === RC_SUCCESS ? fCompanyCategory : createCategorizerCompanyCategory(fCategorizer, fRootCategory, company);
  }

  return {
    /**
     * Create categorizer instance, this categorizer is using IDOL as its backend
     * Every company has its own training sample and taxonomy, has to create its own categorizer instance
     *
     * @param fCategorizer, it can be an `idoladapter` instance, or the `adapter.id` of `idoladapter`
     * @param company, required when running multi-company mode
     *                  in mandant scenario, the company parameter not only point to company but also can be other fields 
     */
    create : function(fCategorizer, company) {
      if (_.isNumber(fCategorizer)) {
        var categorizer = fCategorizer;
        // shouldn't mark this SCFile as readonly, since some status flags can be updated during training
        fCategorizer = new SCFile('idoladapter');
        var rc = fCategorizer.doSelect(new QueryCond('adapter.id', EQ, categorizer));
        if (rc !== RC_SUCCESS) {
          throw new Error('unable to find fCategorizer ' + categorizer);
        }
      }
      
      /**************** Get mandant setting for main table ****************/
      var fScmandant =  new SCFile('scmandant', SCFILE_READONLY);
      var tableName  =  fCategorizer['table.name']
      var ismandant = false;
      if(fScmandant.doSelect('filename="'+ tableName+'"') == RC_SUCCESS ) {
         ismandant = true;
      }
      /**************** Get mandant setting for main table ****************/
      
      // root category is a record which contain meta data
      // but root category is not available when categorizer was not trained
      var fRootCategory = findOrCreateCategorizerRootCategory(fCategorizer);
      // XXX: `$G.multi` can be undefined when running in background scheduler, use `$G.system.info` instead.
      
      if(!ismandant) {
         return this.createCategorizer(fCategorizer, fRootCategory);
      }else if (company) {      
        // working on ONE company
        var fCompanyCategory = findOrCreateCategorizerCompanyCategory(fCategorizer, fRootCategory, company);
        return this.createCompanyCategorizer(fCategorizer, fRootCategory, fCompanyCategory);
      } else {
        // train all company in one round
        return this.createMultiCompanyCategorizer(fCategorizer, fRootCategory);
      }
      
      /**
      if (!vars['$G.system.info']['multi.company']) {
        return this.createCategorizer(fCategorizer, fRootCategory);
      } else if (company) {      
        // working on ONE company
        var fCompanyCategory = findOrCreateCategorizerCompanyCategory(fCategorizer, fRootCategory, company);
        return this.createCompanyCategorizer(fCategorizer, fRootCategory, fCompanyCategory);
      } else {
        // train all company in one round
        return this.createMultiCompanyCategorizer(fCategorizer, fRootCategory);
      } **/
    },
    // XXX: SCFile object have side effect (lookup database), make them as a pass-in paramter to help do UT
    createCategorizer : function(fCategorizer, fRootCategory) {
      return new Categorizer(fCategorizer, fRootCategory);
    },
    createCompanyCategorizer : function(fCategorizer, fRootCategory, fCompanyCategory) {
      return new CompanyCategorizer(fCategorizer, fRootCategory, fCompanyCategory);
    },
    createMultiCompanyCategorizer : function(fCategorizer, fRootCategory) {
      return new MultiCompanyCategorizer(fCategorizer, fRootCategory);
    }
  };
}());

function require() {
  return IDOLSmartTicketCategorizerFactory;
}
