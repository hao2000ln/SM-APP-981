/**
 * In IDOL server side, category was organized in a tree style
 * 
 * Every time when doing the categorization, find its root category first, then
 * predict the rest.
 *
 * 1. Standard categorization:
 *    CATEGORIZER -> "1.standard category" -- "2.complaint" ...
 *                                        |
 *                                        +- "3.incident" -- "4.performance" ...
 *                                                        |
 *                                                        +- "5.failure" -- "6.system down"
 *                                                                       |
 *                                                                       +- "7.job failed"
 *    Start suggestion from the root category "1.standard category".
 *
 * 2. Prefill values:
 *    Sometimes the `level 1` value is already known, can switch the root
 *    category before doing categorization.
 * 
 *    e.g.
 *    One Interaction record may have `category="incident"` before categorization
 *    Move the CATEGORIZER point to the child category node
 *   
 *    "1.standard category" -- "2.complaint" ...
 *                          |
 *           CATEGORIZER ->  +- "3.incident" -- "4.performance" ...
 *                                          |
 *                                          +- "5.failure" -- "6.system down" 
 *                                                         |
 *                                                         +- "7.job failed" 
 * 
 *    At this time we can use IDOL command to predict the rest of the category
 *    values like below.
 *
 *    { 
 *      Action : "CategorySuggestFromText", 
 *      Schema : 3        // point to the start point
 *      ...
 *    }
 *
 * 3. Multi-company
 *    The behaivor is similar to above "Prefill", it add one more layer for every company
 *
 *    "1.standard category" -- "2.companyA"
 *                          |
 *           CATEGORIZER ->  +- "3.companyB" -- "4.complaint" ...
 *                                          |
 *                                          +- "5.incident" ...         
 */
var _ = lib.Underscore.require(),
    XQuery = lib.XQuery.require(),
    IDOLSmartTicketCompatible = lib.IDOLSmartTicketCompatible.require(),
    IDOLCommon = lib.IDOLCommon.require();

var CompatibleCodec = IDOLSmartTicketCompatible.name;

var logger = getLog('IDOLSmartTicketCategorizerSuggestionAgent');

var IDOLSmartTicketCategorizerSuggestionAgent = (function() {

  // This SuggestionAgent can be used in two different environment
  // 
  // 1. Smart Ticket Testing
  // 2. Real Categorization
  // 
  // The behavior should be the same, but they have different consideration
  // on the input ticket record
  //
  // In real world Smart Ticket suggestion, if category field already has value
  // we only need to suggest the rest.
  //
  // But the category fields were all filled with value when runing in test 
  // environment, has to ignore them
  function SuggestionAgent(client, categorizer, cfg) {
    var categoryFields = categorizer.getCategoryFields();
    var fCategorizer = categorizer.getSCFile();
    var isPrefilled = [ fCategorizer['is.level.1.prefilled'], fCategorizer['is.level.2.prefilled'] ];
    var prefilledFields = [];
    _.each(categoryFields, function(name, i) {
      if (isPrefilled[i]) { prefilledFields.push(name); }
    });

    this._categoryFields = categoryFields;
    this._prefilledFields = prefilledFields;
    this._client = client;
    this._categorizer = categorizer;
    this._cfg = cfg || {};
  }

  SuggestionAgent.prototype.toString = function() {
    return 'Suggestion Agent: ' + this._categorizer.id;
  };

  SuggestionAgent.prototype.getEnvironment = function() {
    return this._cfg.env;
  };

  SuggestionAgent.prototype.getRule = function(fTicket) {
    var fCategorizer = this._categorizer.getSCFile();
    var ruleField = fCategorizer['rule.field'];
    if (ruleField) {
      return lib.IDOLCategoryRuleBase.getRuleBaseValue(fTicket, ruleField);
    }
  };

  SuggestionAgent.prototype.getPrefilledFields = function() {
    return this._prefilledFields;
  };

  SuggestionAgent.prototype.getThreshold = function() {
    return this._categorizer.getThreshold();
  };

  SuggestionAgent.prototype._isTesting = function() {
    return this.getEnvironment() === 'test';
  };


  /***
   TODO Generate fieldText and add here.
   Generate fieldText base on current user's security group. first generate mandant sql, then get idol fieldtext base on mandant sql 
  **/
  
  
  SuggestionAgent.prototype._getTargetTableInfo = function( fileName, field ){
      //retrieve link by file name
    var link = new SCFile('link');
    var rc = link.doSelect('name = "' + fileName + '"');
    //if no link found, return the top numresult
    if (rc !== RC_SUCCESS) {
        return null
    }
    
    //get the source field and targe field in link
    var sourceFields = link['source.fields'];
    var targetField;
    var length = sourceFields.length();
    for (i = 0; i < length; i++) {
        if (sourceFields[i] === field) {
            targetField = link['target.fields'][i];
            targetFile  = link['target.files'][i];
            
            return {'targetField':targetField, 'targetFile':targetFile}
        }
    }
    return null;
  }
  
  
  SuggestionAgent.prototype._getPrimaryKey =  function (fileName){
    var dbdict = new SCFile('dbdict');
    var rc = dbdict.doSelect('name = "' + fileName +'"');   
    if (rc == RC_SUCCESS) {
       var keys = dbdict['key'];
       var keysLen = keys.length();
       for(var i=0; i<keysLen; i++){
          var key = keys[i];
          if(key['flags'] == '12') {
             return (key['name']);
          }
       }
    }
    return null;
  }  
  
  SuggestionAgent.prototype._getFieldAndValue = function (filename, categoryFieldName , data ){

    var IDOLMandant = lib.IDOLMandant.require();
    var IDOLCommon = lib.IDOLCommon.require();
    
    var linkObj = this._getTargetTableInfo(filename, categoryFieldName);
    if(linkObj == null){
       logger.info("get link information for table["+filename+"] field["+categoryFieldName+"] meet error, please make sure master link is existing");
       return null;
    } 
    var mandantFieldName = IDOLMandant.getMandantField(linkObj.targetFile );
    
    if(_.isEmpty(mandantFieldName)){
       logger.info("there is not mandant setting for table ["+ linkObj.targetFile +"]");
       return null;
    }else{
       logger.info("found mandant setting for table ["+ linkObj.targetFile +"], mandant fieldname ["+ mandantFieldName +"]");
    }
    
    var mandantFieldType = lib.tableFunctions.getFieldType(mandantFieldName, filename, true)
    var mandantFieldNameStr = mandantFieldName.replace(/\./g, '_');
    
    var detailFieldNames = [];
	var detailFieldValues = [];
	
	var mandantValues = '';
	if(_.isString(data)) {
      mandantValues = lib.SmartTicketMandantTools.getCurrentUserMandantValue();
    } else if (funcs.filename(data) === this._categorizer.getFilename()) {
      mandantValues = lib.SmartTicketMandantTools.getUserMandantValueByFile( data )
      //mandantValues = lib.SmartTicketMandantTools.getCurrentUserMandantValue()
    } else {
      throw new Error('unable to suggest category, type: ' + typeof data);
    }
		
	if(mandantValues && mandantValues.length >0){
      if(mandantFieldType == 8){
        var len = mandantValues.length;
        for(var i=0; i<len; i++){
          if(!_.isEmpty(mandantValues[i])){
            detailFieldNames.push(mandantFieldNameStr);
            detailFieldValues.push(mandantValues[i]);
          } 
	    }
	  }else{
	    detailFieldNames.push(mandantFieldNameStr);
	    detailFieldValues.push(mandantValues);
	  }
	  return {'fields': detailFieldNames, 'values': detailFieldValues}	
	}else{
	  return null;
	}
}


  SuggestionAgent.prototype._suggestIDOLCategory = function(text, options) {
    options = options || {};
    var taxonomy = this._categorizer.getTaxonomy();
    logger.info("taxonomy name is:[" + taxonomy + "]");
    var categorizer = this._categorizer;
    
    var command = _.extend({
      action: 'CategorySuggestFromText',
      TaxonomyName: CompatibleCodec.encode(taxonomy),
      IgnoreSpecials: true,
      QueryText: text,
      AnyLanguage: true,
      Params: 'DetectLanguageType',
      Values: 'true'
    }, options);

    var JSON = lib.JSON.json();
    logger.info("suggestion command is:" + JSON.stringify(command) );
    var doc = this._client.executeAction(command);
    logger.info("suggestion idol return result is" + doc);
    var hits = XQuery.query('responsedata/autn:hit', doc);
    var rets =  _.map(hits, function(hit) {
      var category = XQuery.queryObject({
        id : 'autn:id',
        title : 'autn:title',
        weight : 'autn:weight',
        links : 'autn:links'
      }, hit);
      category.title = CompatibleCodec.decode(category.title);
      category.weight = parseFloat(category.weight);
      category.links = (category.links || '').split(',');
      return category;
    });

    return rets;
  };
  
  SuggestionAgent.prototype._postFilterSuggestionResult = function( fTicket, originRets ) {    
    /** post filter according to the scaccess definition of category defintion table  **/
    var categoryFileName = null;
    var baseMandantQuery = null;
    
    var linkObj = this._getTargetTableInfo(this._categorizer.getFilename(),  _.last(this._categorizer.getCategoryFields()));
    if(linkObj == null){
      logger.info("get link information for table["+filename+"] field["+ _.last(this._categorizer.getCategoryFields()) +"] meet error, please make sure master link is existing");
    }else{
      categoryFileName = linkObj.targetFile;
      //baseMandantQuery = getMandantQuery(categoryFileName);
      var restrictingQuerys = lib.SmartTicketMandantTools.getUserRestrictingQueryByFile(fTicket, categoryFileName);
      var baseMandantQuery =  IDOLCommon.compositeCriteria(restrictingQuerys,' and ');
      logger.info('categoryFilename is ['+ categoryFileName +']' + ',' + 'baseMandantQuery is ['+ baseMandantQuery +']' +',' + 'targetFile fieldname is ['+linkObj.targetField+']');
    }
    var JSON = lib.JSON.json();
    if(baseMandantQuery){
      var newRet = [];
      for(var i=0; i<originRets.length; i++){
        var aRet = originRets[i];
        if( this._postFilterByRestrictQuery(aRet.id, categoryFileName, baseMandantQuery) ){
           logger.info('add ['+JSON.stringify(aRet)+'] to return after post filter, para is ['+ categoryFileName +'],['+baseMandantQuery+']');
           newRet.push(aRet);
        }
      }
      return newRet;
    }
    /** post filter according to the scaccess definition of category defintion table  **/
    
    return originRets;
  }
  
  SuggestionAgent.prototype._postFilterByRestrictQuery = function ( categoryId, categoryFileName , baseMandantQuery){
    
    var sql = new QueryCond('id', EQ, categoryId);
    var fCategory = new SCFile('cate2idol2', SCFILE_READONLY);
    var rc = fCategory.doSelect(sql);
    
    if(rc === RC_SUCCESS) {
      var pKeyFieldNameList = this._getPrimaryKey(categoryFileName); 
      if(pKeyFieldNameList == null){
         logger.info("get primary key for file ["+ categoryFileName +"] meet error");
         return true;
      }  
      
      var fieldNames = [];
      var filterQuery = [];
      for(var j=0; j<pKeyFieldNameList.length(); j++){
        if(pKeyFieldNameList[j] == 'company'){
           continue;
        }else{
           fieldNames.push(pKeyFieldNameList[j]);
        }
      }
            
      var CATEGORY_FIELD_NAMES = ['category', 'subcategory', 'product.type'];
      var categoryvalues = [];
      for(var j=0; j<CATEGORY_FIELD_NAMES.length; j++){
        categoryvalues.push( fCategory[CATEGORY_FIELD_NAMES[j]] );
      }
            
      categoryvalues = _.compact(categoryvalues);
      fieldNames = _.compact(fieldNames);
            
      if(categoryvalues.length !=  fieldNames.length){
        logger.info("Provided filter values["+categoryvalues+"] number["+categoryvalues.length+"] is not equals "+
              "primary key fields["+fieldNames+"] number["+fieldNames.length+"]");
        return true;
      }
      
      for(var i=0; i<fieldNames.length; i++){
        var aQuery = new QueryCond(fieldNames[i], EQ, categoryvalues[i]).asRAD(); 
        filterQuery.push(aQuery);
      }
              
      var sql = IDOLCommon.compositeCriteria(filterQuery,' and ');
      sql = IDOLCommon.compositeCriteria([sql, baseMandantQuery],' and ');
      logger.info("query category table ["+categoryFileName+"] via sql ["+sql+"]");
	          
	  var fCategoryFile = new SCFile(categoryFileName, SCFILE_READONLY);
	  if(fCategoryFile.doSelect(sql) === RC_SUCCESS) {
	    logger.info('this category ['+categoryvalues+'] is valid');
	    return true;
	  }else{
	    logger.info('this category ['+categoryvalues+'] is invalid');
	    return false;
	  }
    }else{
      logger.info("can not found the category which id is:["+ aRet.id +"]");
    }
  };

  SuggestionAgent.prototype._normalizeText = function(features) {
    var body, clean = this._categorizer.getCleansing();
    if (_.isObject(features) || _.isArray(features)) {
      body = _.map(features, clean).join('\n');
    } else if (_.isString(features)) {
      body = clean(features);
    } else {
      throw new Error('unable to suggest category with: ' + features);
    }
    return body;
  };

  SuggestionAgent.prototype._getCategoryFieldValues = function(fTicket, fieldnames) {
    var nameMapping = this._categorizer.getNameMapping(); // { fieldNamesInTicket: fieldInCategory}
    var values = [], skip = false;
    _.each(fieldnames, function(name) {
      var value = fTicket[name];
      skip = skip || !value;
      // if one category field value is empty, skip the rest
      value = skip ? null : value;
      values.push({ name : nameMapping[name], value : value });
    });
    return values;
  };

  SuggestionAgent.prototype._findCategoryByQuery = function(criteria) {
    var fCategory = new SCFile('cate2idol2', SCFILE_READONLY);
    fCategory.setOrderBy(['id'], [SCFILE_ASC]);
    var rc = fCategory.doSelect(criteria);
    return rc === RC_SUCCESS ? fCategory : null;
  };

  SuggestionAgent.prototype._findIDOLSuggestionRootCategory = function(fTicket) {
    var names = this._isTesting() ? this._prefilledFields : this._categoryFields;
    var prefills = this._getCategoryFieldValues(fTicket, names);
    // this 'root' category can be 'company' category when running in multi-company mode
    var root = this._categorizer.getRootCategory();
    var values = _.pluck(prefills, 'value');
    if (_.compact(values).length === 0) { return root; }
    return this.findCategorySchema(prefills) || root;
  };

  SuggestionAgent.prototype.findCategorySchema = function(values) {
    var root = this._categorizer.getRootCategory();
    var initialCriteria = this._categorizer.createCategoryQueryCriteria();
    var criteria = _.reduce(values, function(qcond, kv) {
      var name = kv.name, value = kv.value;
      return value ? qcond.and(new QueryCond(name, EQ, value)) : qcond;
    }, initialCriteria);
    return this._findCategoryByQuery(criteria.asRAD());
  };

  // given ticket record, return the category IDOL represented.
  SuggestionAgent.prototype.findCategory = function(fTicket) {
    var values = this._getCategoryFieldValues(fTicket, this._categoryFields);
    return this.findCategorySchema(values);
  };

  SuggestionAgent.prototype._suggestIDOLCategoryWithTicket = function(fTicket, options) {
    var text = this.getPlainDocument(fTicket);
    var rule = this.getRule(fTicket);
    if (rule) {
      text += ' ' + rule;
      options = _.extend({ AgentBoolean: true }, options);
    }

    var root = this._findIDOLSuggestionRootCategory(fTicket);
    if (root) {
      options = _.extend({ Schema : root.id }, options);
    }

    var threshold = this.getThreshold();
    if (threshold) {
      options = _.extend({ Threshold : threshold }, options);
    }

    return this._postFilterSuggestionResult(fTicket ,this._suggestIDOLCategory(text, options));
  };

  SuggestionAgent.prototype.getPlainDocument = function(fTicket) {
    var model = this._categorizer.extractTicketModel(fTicket);
    var features = _.pick(model, 'title', 'contents');
    return this._normalizeText(features);
  };

  /**
   * Smart Ticket provide more option to improve accuracy
   * 
   * 1. "Category" can have hierachy, if part of them already known, keep existing 
   *    and predict the rest
   *
   * 2. "Rule" based, some category can only be chosen if the text contains certain
   *    characters.
   *
   * Above optimization applied and only applied when users want to do a `fill`.
   * because those information only available on certain kind of SM `ticket`,
   * those kinds of data has structure.
   *
   * plain text catgorization doesn't have those optimization.
   */
  SuggestionAgent.prototype.suggestIDOLCategory = function(data, options) {
    options = options || {};
  

  
    if(_.isString(data)) {
      var body = this._normalizeText(data);
      return this._suggestIDOLCategory(body, options);
    } else if (funcs.filename(data) === this._categorizer.getFilename()) {    
      /** generate field text base on mandant setting of current user or service recipients of current ticket**/
      var fieldTextValue = this._getFieldAndValue(this._categorizer.getFilename(),  _.last(this._categorizer.getCategoryFields()) , data);
      logger.info("field text para is:" + fieldTextValue);
    
      if(fieldTextValue) {
         var fields = fieldTextValue['fields'];
         var values = fieldTextValue['values'];
         var fieldTextStr = 'MATCH{'+ values.join(',') +'}:' + (_.first(fields)).toUpperCase();
         logger.info("field text str is:" + fieldTextStr);   
         options = _.extend(options, {'FieldText' : fieldTextStr });
      }
      /** generate field text base on mandant setting of current user or service recipients of current ticket**/    
      return this._suggestIDOLCategoryWithTicket(data, options);
    } else {
      throw new Error('unable to suggest category, type: ' + typeof data);
    }
  };
  
  

  // explain the term information of current document (plain text) in whole IDOL content wide
  SuggestionAgent.prototype.explainText = function(plain) {
    if (!_.isString(plain)) {
      throw new Error('can only explain text features, but got ' + typeof plain);
    }

    var doc = this._client.executeAction({
      action: 'TermGetInfo',
      Text : plain
    });
    var terms = XQuery.query('responsedata/autn:term', doc);
    return _.map(terms, function(term) {
      var text = term.getText(),
          weight = term.getAttributeValue('apcm_weight'),
          occurrences = term.getAttributeValue('document_occurrences'),
          total = term.getAttributeValue('total_occurrences');
      return {
        term : text,
        weight : parseInt(weight, 10),
        occurrences : parseInt(occurrences, 10),
        total : parseInt(total, 10)
      };
    });
  };

  return {
    create : function(client, categorizer, cfg) {
      return new SuggestionAgent(client, categorizer, cfg);
    }
  };
}());

function require() {
  return IDOLSmartTicketCategorizerSuggestionAgent;
}