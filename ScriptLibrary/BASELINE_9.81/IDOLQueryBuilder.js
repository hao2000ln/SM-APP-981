var _ = lib.Underscore.require(),
    IDOLConfigure = lib.IDOLConfigure.require(),
    IDOLHTAQueryEvaluator = lib.IDOLHTAQueryEvaluator.require(),
    IDOLMandant = lib.IDOLMandant.require(),
    IDOLCommon = lib.IDOLCommon.require(),
    KMQuery_IDOL=lib.KMQuery_IDOL.require(),
    IDOLSecurity = lib.IDOLSecurity.require();

var logger = getLog('IDOLQueryBuilder');

var IDOLQueryBuilder = (function() {
  //Transform date value into IDOL date: DD/MM/YY， 1/2/3 = 2003/01/02 January, 1/2/50 =1950/01/02, 
  //The year between: 40-99 means 1900's
  //IDOL supports three types dates: DD/MM/YY || EPOCH Seconds (e) || Relative seconds from now (s)
  //Here we select EPOCH Time
  //QCCR1E151507 Unable to filter Hot topic using from/to fields.
  function formatIDOLDate(value){
    if (!value) return '';
    var date = funcs.val(value, 3);
    if(date){
      return KMQuery_IDOL.getEpochSeconds(date);
    }
    return '';
  }
  function buildFieldTextQuery(record, customQuery, fallback) {
    // convert sm query into idol query
    var criteria = IDOLSecurity.buildSQLQuery(record),
        sql = _.compact([criteria, customQuery]).join(' and '),
        ast = parseQuery(sql);
    var query = IDOLHTAQueryEvaluator.convertToIDOLQuery(ast, fallback, lib.IDOLQueryBuilder.mandantFieldToIDOLFieldName, system.functions.filename(record));
    logger.debug('convert sql "' + sql + '" to "' + query + '"');
    return { 'fieldtext' : query };
  }

  function buildCompanyNames(database, company) {
    var companies = IDOLMandant.buildCompanyNames();
    if (_.isEmpty(companies)) {
      // scmsg: Cannot get any valid company("company" should be configured in scmandant). abort ...
      throw new Error(funcs.scmsg(1000, 'idol'));
    }
    
    var names = _.pluck(companies, 'name');
    if (company) {
      // check valid company
      if (_.indexOf(names, company) === -1) {
        throw new Error(funcs.scmsg(1001, 'idol', [company]));
      }
      return IDOLMandant.buildDatabaseName(database, company);      
    }
    return _.map(names, function(company) {
      return IDOLMandant.buildDatabaseName(database, company);
    }).join(',');
  }

  function buildDatabaseMatchQuery(record) {
    var filename = funcs.filename(record),
        config = IDOLConfigure.getTopicmapConfig(filename),
        name = IDOLMandant.getMandantField(filename);

    var database = config.database;
   // if (IDOLConfigure.isMultiCompany(filename)) {
   //   database = buildCompanyNames(database, record[name]);
   // }
    return { 'databasematch' : database };
  }

  function buildTimeRangeQuery(from, to) {
    var min = formatIDOLDate(from),
        max = formatIDOLDate(to);
    return { 'mindate' : min, 'maxdate' : max };
  }

  function buildIDOLQueryCriteria(keyword, record, range, customQuery, fallback) {
    var filename = funcs.filename(record),
        fieldtext = buildFieldTextQuery(record, customQuery, fallback),
        databasematch = buildDatabaseMatchQuery(record),
        timerange = buildTimeRangeQuery.apply(null, (range || []));
    var conditions = _.extend({ text : keyword }, databasematch, fieldtext, timerange);
    var criteria = {};
    _.each(conditions, function(value, key) {
      if (value || _.isBoolean(value)) {
        criteria[key] = value;
      }
    });
    return criteria;
  }

  function buildIDOLQueryCriteriaWithSQL(filename, sql, keyword) {
    var config = IDOLConfigure.getTopicmapConfig(filename),
        database = config.database;
    if (IDOLConfigure.isMultiCompany(filename)) {
      database = buildCompanyNames(database); // choose all accessible company
    }

    var ast = parseQuery(sql);
    var query = IDOLHTAQueryEvaluator.convertToIDOLQuery(ast,null, lib.IDOLQueryBuilder.mandantFieldToIDOLFieldName, filename);
    return _.extend({ text: keyword }, { fieldtext: query }, { databasematch: database});
  }

  function createFallbackHandler() {
    var counter = 0, errors = [];

    function fallbackHandler(ast, error) {
      counter++;
      errors.push(error);
      return "";
    }

    return {
      handler : fallbackHandler,
      hasError : function() { return errors.length > 0; },
      getErrors : function() { return errors; }
    };
  }

  return {
    buildCriteria : buildIDOLQueryCriteria,
    buildCriteriaViaSQL : buildIDOLQueryCriteriaWithSQL,
    createFallbackHandler : createFallbackHandler
  };
})();


function mandantFieldToIDOLFieldName(fieldname, filename)
  {
    var f = new SCFile("scmandant");
    var rc = f.doSelect('fieldname="'+fieldname+'" and filename="'+filename+'"');
   if(rc == RC_SUCCESS)
   {
      return IDOLCommon.toIDOLFieldName(fieldname)+"_MATCH";
   }
   return IDOLCommon.toIDOLFieldName(fieldname);
  }
  
function require() {
  return IDOLQueryBuilder;
}