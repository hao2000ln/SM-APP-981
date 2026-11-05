var _ = lib.Underscore.require(),
    JSON = lib.JSON.json(),
    IDOLMandant = lib.IDOLMandant.require(),
    IDOLSMProfile = lib.IDOLSMProfile.require(),
    IDOLFieldProcessor = lib.IDOLFieldProcessor.require(),
    IDOLQueryEvaluator = lib.IDOLQueryEvaluator.require(),
    QueryHelper = lib.QueryHelper;

var logger = getLog('IDOLSecurity');

var IDOLSecurity = (function() {
  function parseAndCollectFields(sql) {
    if (!sql) { return []; }
    var ast = parseQuery(sql);
    return IDOLQueryEvaluator.collectFieldNames(ast);
  }

  function collectAccessFields(filename, module) {
    var scaccess = new SCFile(filename, SCFILE_READONLY), 
        allfields = [],
        rc;

    rc = scaccess.doSelect(new QueryCond('filename', EQ, module));
    while (rc === RC_SUCCESS) {
      var fields = parseAndCollectFields(scaccess["restricting.query"]);
      allfields.push(fields);
      rc = scaccess.getNext();
    }
    return _.chain(allfields).flatten().compact().sort().uniq().value();
  }

  function collecdtSCAccessRestrictQueryFields(filename) {
    return collectAccessFields("scaccess", filename);
  }

  function collectFolderAccessRestrictQueryFields(filename) {
    return collectAccessFields("scFolderAccess", filename);
  }

  function collectAppendQueryFields(filename) {
    var sqls = IDOLSMProfile.getQueryDefines(filename);
    var fields = _.reduce(sqls, function(fields, sql) {
      return fields.concat(parseAndCollectFields(sql));
    }, []);

    // some append query are hard coded, cannot be found in database
    // emit a fake query and collect its using fields
    var hardCodedSql = QueryHelper.buildFullQuery('true', filename);
    var hardCodedFields = parseAndCollectFields(hardCodedSql);

    return _.chain(fields).concat(hardCodedFields).compact().sort().uniq().value();
  }

  function collectSecurityFields(filename) {
    var scaccessFields = collecdtSCAccessRestrictQueryFields(filename),
        folderAccessFields = collectFolderAccessRestrictQueryFields(filename),
        appendQueryFields = collectAppendQueryFields(filename),
        mandantField = IDOLMandant.getMandantField(filename);
    return _.chain([scaccessFields, folderAccessFields, mandantField, appendQueryFields])
            .flatten().compact().sort().uniq().value();
  }

  function toLiteral(value) {
    return JSON.stringify(value);
  }
   
  function buildSecuritySQLQuery(record) {
    var filename = funcs.filename(record),
        // only choose the fields which are already indexed into IDOL
        spec = IDOLFieldProcessor.create(filename);

    // TODO: or use sm query builder to generate this query?
    var query = _.chain(spec.propertyfields)
      .filter(function(name) { 
        var value = record[name]; 
        return _.isArray(value) ? !_.isEmpty(_.compact(value)) : !!value;
      })
      .map(function(name) {
        var value = record[name];
        if (_.isArray(value)) {
          var items = _.chain(value).compact().map(toLiteral).value().join(',');
          return name + ' isin {' + items + '}';
        }
        return name + '=' + toLiteral(record[name]); 
      })
      .value()
      .join(' and ');

    query = query || 'true';

    // append query
    var sql = IDOLSMProfile.appendQuery(query, filename),
        mandantSQL = getMandantQuery(filename);
    //mandantSQL = checkArrayMandant(filename,mandantSQL);
    return _.chain([sql, mandantSQL])
            .compact()
            .map(function(sql) { return ['(', sql, ')'].join(''); })
            .value()
            .join(' and ');
  }

  return {
    collectSecurityFields : collectSecurityFields,
    buildSQLQuery : buildSecuritySQLQuery
  };
}());

function require() {
  return IDOLSecurity;
}

 
function isMandantArray(filename,field)
{
  if (!filename || !field)
  {
    return false;
  }
  else
  {
    var f = new SCFile(filename);
    if(f.getFieldType(field) == 8)
    {
      return true;
    }
  }
  return false;
}
  
function checkArrayMandant(filename,mandant)
{
   if(mandant)
   {
     var field = IDOLMandant.getMandantField(filename);
     if(isMandantArray(filename,field))
     {
       var name= field+"=";
          
       var npos = mandant.indexOf(name)
       if( npos != -1)
       {
          mandant = mandant.replace("=", " isin {");
          mandant = mandant+"}";
       }
     }
   }
     
   return mandant;
}