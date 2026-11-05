var _ = lib.Underscore.require(),
    JSON = lib.JSON.json(),
    IDOLIndexCore = lib.IDOLIndexCore.require(),
    IDOLCommon = lib.IDOLCommon.require(),
    IDOLSecurity = lib.IDOLSecurity.require(),
    IDOLQueryEvaluator = lib.IDOLQueryEvaluator.require(),
    _sf = system.functions;

var logger = getLog('IDOLIndex');

function toJSON(obj) {
  return JSON.stringify(obj, null, 4);
}

var IDOLIndex = (function() {

  //for scfile "idoladapter"
  function categorizationConfigConverter(file) {
    var categories = [ file["level1.field"], file["level2.field"], file["level3.field"] ];
    var contents = file["content.fields"] ? file["content.fields"].toArray() : [];
    return {
      id : file["adapter.id"],
      module : file["table.name"],
      // several categories are merged into one idol database
      // XXX: maybe every taxonomy should have its own training set
      name : file["table.name"],
      properties : _.compact(categories),
      title :  contents[0],
      timestamp : null,
      contents : _.rest(contents),
      query: file.query || 'true'
    };
  }

  function select(name, query) {
    function convert(callback) {
      var results = [], file = new SCFile(name), rc;
      rc = file.doSelect(query || 'true');
      while (rc === RC_SUCCESS) {
        results.push(callback(file));
        rc = file.getNext();
      }
      return results;
    }
    return { convert : convert };
  }

  function createIDOLOnlyFields( config ){
    var idolOnlyFields =  config.idolOnlyFields;
    if ( !idolOnlyFields || idolOnlyFields.length == 0 ) {
      return null;
    }

    var idolfields = new SCDatum();
    idolfields.setType(8);

    var nFields = idolOnlyFields.length, i;
    for ( i = 0 ; i < nFields; i++ )
    {
      var rawItem = idolOnlyFields[i];
      var dtItem = new SCDatum();
      dtItem.setType(9);

      dtItem.push(rawItem.fieldname);
      dtItem.push("(null)");
      dtItem.push(rawItem.searchjs);
      dtItem.push(rawItem.getvaluejs);

      idolfields.push(dtItem);
    }

    return idolfields;
  }


  function saveIDOLIndexConfig(config, feature) {
    var fields = config.fields,
      title = config.title,
      module = config.module,
      name = config.name,
      query = config.query,
      expiry = config.expiry,
      timestamp = config.timestamp;

    var idolindex = new SCFile("idolindex");
    // TODO: or refresh all record
    var rc = idolindex.doSelect("table.name=\"" + module + "\" and feature=\"" + feature + "\"");
    if (rc === RC_NO_MORE) {
      var rtc = new SCDatum(), next = new SCDatum();
      funcs.rtecall("getnumber", rtc, next, "idolindexid");
      idolindex["index.id"] = parseInt(next.getText(), 10);
    }
    idolindex.feature = feature;
    idolindex.expiry = expiry;
    idolindex.fields = _.map(fields, function(field) {
      var data = new SCDatum();
      data.setType(9); // structure
      data.push(field.name); // field name
      data.push(field.type); // field type
      return data;
    });

    idolindex["table.name"] = module;
    idolindex["db.name"] = name;
    idolindex["title.field"] = title;
    idolindex["timestamp.field"] = timestamp;
    idolindex["filter.query"] = query;
    idolindex["idolonlyfields"] = createIDOLOnlyFields( config );
    rc = idolindex.doSave();
    if (rc !== RC_SUCCESS) {
      throw new Error("Error: " + RCtoString(rc));
    }
    logger.info("IDOL index for " + module + "(" + feature + ") has been populated");
  }


  // TODO: may remove this function, since it was not been used.
  function populationSmartCategorizationConfigs(module) {
    try {
      var configs = select("idoladapter").convert(categorizationConfigConverter),
        results = IDOLIndexCore.merge(configs, module);
      _.each(results, function(config) {
        saveIDOLIndexConfig(config, IDOLCommon.FEATURES.SC);
      });
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  function collectFieldNamesFromSQL(query) {
    var ast = parseQuery(query);
    return IDOLQueryEvaluator.collectFieldNames(ast);
  }

  function populateHotTopicMapConfig(record) {
    var titleField = record["title.field"],
        timestampField = record["timestamp.field"],
        filterFields = record["properties.fields"].toArray(),
        securityFields = record["security.fields"].toArray(),
        contentFields = record["contents.fields"].toArray(),
        groupByField = record["group.by"];

    var aryCandQuery = record["candidates.query"].toArray();
    var candidatesQueryFields = [];
    var idolOnlyFields = [];

    _.each(aryCandQuery, function(candQuery) {
      var candidatesQuery = candQuery || "true";

      var q = candidatesQuery;
      var idolField = null;
      if ( q.indexOf("jscall") >= 0 )
      {
        var idolonlyfield = {};

        vars['$hta.action.facet'] = "getSearchCriteria";
        var extendActionRet = _sf.parse_evaluate(q, 2);
        if ( extendActionRet && typeof extendActionRet === 'string' )
        {
          idolonlyfield.searchjs = extendActionRet;
          candidatesQuery = extendActionRet;
        }

        vars['$hta.action.facet'] = "getIDOLFieldName";
        idolonlyfield.fieldname = _sf.parse_evaluate(q, 2);
        idolField = idolonlyfield.fieldname;

        idolonlyfield.getvaluejs = q;

        idolOnlyFields.push(idolonlyfield);
      }

      var fieldsFound = collectFieldNamesFromSQL(candidatesQuery);
      fieldsFound = _.difference(fieldsFound, [idolField]);
      candidatesQueryFields.push(fieldsFound);
    });

    var others = []; 
    // Parent Incident query sql
    if (record['table.name'] === 'probsummary') {
      var parentIncidentQuery = lib.IDOLModuleConfiguration.getParentIncidentSearchQuery();
      others = others.concat(collectFieldNamesFromSQL(parentIncidentQuery));
    }

    // these 'properties' fields are used as 'filter fields' in search form
    var properties = _.chain([filterFields, candidatesQueryFields, groupByField, others])
      .flatten()
      .compact()
      .uniq()
      .map(function(name) { return { name : name, type : 'property' }; })
      .value();

    var security = _.chain(securityFields)
      .difference(filterFields) // exclude filter fields;
      .uniq()
      .map(function(name) { return { name : name, type : 'security' }; })
      .value();

    var contents = _.chain(contentFields)
      .uniq()
      .map(function(name) { return { name : name, type : 'content' }; })
      .value();

    var timestamp = { name : timestampField, type : 'timestamp' };
    var title = { name : titleField, type : 'title' };

    var fields = _.chain([title, contents, timestamp, properties, security]).flatten().value();

    var config = {
      title : titleField,
      timestamp : timestampField,
      fields : fields,
      module : record["table.name"],
      query : record.query || 'true',
      name : record["database.name"], // used as IDOL database name
      expiry : record.expiry,
      idolOnlyFields : idolOnlyFields
    };

    try {
      saveIDOLIndexConfig(config, IDOLCommon.FEATURES.HTA);
    } catch(e) {
      logger.error(e);
      throw e;
    }
  }

  function populateHotTopicMapSecurityFields(record) {
    var filename = record["table.name"],
      fields = IDOLSecurity.collectSecurityFields(filename);
    record['security.fields'] = fields;
  }

  return {
    populationSmartCategorizationConfigs : populationSmartCategorizationConfigs,
    populateHotTopicMapConfig : populateHotTopicMapConfig,
    populateHotTopicMapSecurityFields : populateHotTopicMapSecurityFields
  };
}());

function require() {
  return IDOLIndex;
}
