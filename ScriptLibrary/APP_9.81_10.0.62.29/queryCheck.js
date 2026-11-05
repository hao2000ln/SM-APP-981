var _val = funcs.val;
var _type = funcs.type;
var _ = lib.Underscore.require();
var log = getLog("queryCheck");

function toJSON(obj) {
  return JSON.stringify( obj );
}

var FIELD_MAPPED_POD  = 0;
var FIELD_MAPPED_BLOB = 1;
var FIELD_NOT_MAPPED  = 2;

function extractKeyInfo(keys, fieldInKeyMap)
{
  var nKey;
  var length = keys.getSize();
  for (nKey = 0; nKey < length; nKey++)
  {
    var key = keys[nKey];

    var fields;
    if (key && key[1]) {
      fields = key[1];
    }

    var nField;
    var flength = fields.getSize();
    for (nField = 0; fields && nField < flength; nField++)
    {
      var fieldname = fields[nField];
      if ( fieldname )
      {
        fieldname = handleStructureField(fieldname);
        fieldInKeyMap[fieldname] = true;
      }
    } // nfield

  } // nkey
}

function extractFieldInfo( fields, fieldMap )
{
  var nField;
  var length = fields.getSize();
  for (nField = 0; nField < length; nField++)
  {
    var field = fields[nField];
    var fieldname = field[0];

    var sqOpt;
    if ( length >= 7 ) {
      sqOpt = field[7];
    }
    else
    {
      fieldMap[fieldname] = FIELD_NOT_MAPPED;
      continue;
    }

    var rcFlag = sqOpt[3];
    var sqType = sqOpt[2];

    if ( sqType ) {
      sqType = sqType.toUpperCase();
    }
    else {
      sqType = "";
    }

    var isBlob = (rcFlag) || (!sqType) ||
      (sqType === "IMAGE") || (sqType === "NTEXT") ||
      (sqType === "TEXT") || (sqType.substring(0, 4) === "BLOB") || (sqType.substring(0, 4) === "CLOB");

    fieldMap[fieldname] = (isBlob)? FIELD_MAPPED_BLOB : FIELD_MAPPED_POD;
  } // nkey
}

/**
 * Get index info and mapping info of all related fields in file
 *
 * @param filename : dbdict name
 *
 * @return object with following 2 members
 *    fieldInKeyMap, {"<fieldname>" : true/false, whether there is index related}
 *    fieldsMapping, {"<fieldname>" : mapped pod/not mapped or mapped to POD }
 *
 * @return no return value
 */
function getDbdictMeta( filename )
{
  var dbdictMeta = {
    "fieldInKeyMap" : {},
    "fieldsMapping" : {}
  };

  var f = new SCFile('dbdict', SCFILE_READONLY);
  var rc = f.doSelect( 'name="' + filename + '"' );
  if ( rc == RC_SUCCESS )
  {
    var keys = f.key;
    extractKeyInfo( keys, dbdictMeta.fieldInKeyMap );
    extractFieldInfo( f.field, dbdictMeta.fieldsMapping );
  }

  return dbdictMeta;
}

/**
 * Hanle the adhoc fields in the query.
 * Convert the field like '' to '', or the ';' or '_' would be regarded as field separator
 *
 * @param query
 */
function queryPreprocessing( query )
{
  if ( query ) {
    query = query.replace(/;/g, '..');
  }

  return query;
}

function handleStructureField( fieldname )
{
  if ( !fieldname ) {
    return fieldname;
  }

  var pos = fieldname.indexOf(',');
  if ( pos > 0 ) {
    fieldname = fieldname.substring(pos + 1);
  }

  return fieldname;
}

function doHandleField( filename, field )
{
  var libCmn = lib.reportCmn;

  var isAdhocField = libCmn.isAdhocField( field.ref );
  if ( isAdhocField )
  {
    var adhocField = libCmn.getRealFieldNameFromAdhocFieldString( field.ref );
    field.realFile = adhocField.filename;
    field.realField = handleStructureField( adhocField.fieldname );
  }
  else
  {
    field.realFile  = filename;
    field.realField = handleStructureField(field.ref);
  }

  return field;
}

/**
 * Fetch and normalize the
 * Recover the adhoc field which contains "..", replace ".." with ";"
 *
 * @param filename: name of main table, for adhoc field, should extract the field from fieldname
 * @param fieldname: raw field name, could be adhoc field name
 * @returns field object { "ref": raw, "realFile": xxx, "realField":xxx }
 */
function extractField( filename, fieldname )
{
  if ( !fieldname ) {
    return null;
  }

  fieldname = fieldname.replace(/(\.\.)/g, ";");
  var field = {"ref" : fieldname };

  return doHandleField( filename, field );
}

function getFieldsFromQuery( filename, query )
{
  var fields = [] ;
  var isTrueQuery = false;
  var isFalseQuery = false;

  try{
    query = queryPreprocessing( query );
    var ast = parseQuery( query );

    var nodeValue = (ast)? ast.NodeValue() : null;
    isTrueQuery = (nodeValue === true);
    isFalseQuery = (nodeValue === false);

    var fieldNames = collectQueryFieldNames(ast);

    var i;
    for ( i = 0; fieldNames && i < fieldNames.length; i++ )
    {
      var field = extractField( filename, fieldNames[i] );
      if ( field ) {
        fields.push( field );
      }
    } // for
  }
  catch( e )
  {
    // TODO
  }

  return {
    "isTrueQuery" : isTrueQuery,
    "isFalseQuery" : isFalseQuery,
    "fields" : fields
  };
}

function collectQueryFieldNames(ast)
{
  var type = ast.NodeType();
  switch(type) {
    case 'FIELD':
    case 'FIELD2': return [ ast.NodeValue() ];
    case 'OPERATOR': return _.reduce(ast.NodeValue(), function(memo, ast) {
      return memo.concat(collectQueryFieldNames(ast));
    }, []);
    case 'NULL':
    case 'NUMBER':
    case 'STRING2':
    case 'TIME':
    case 'BOOLEAN':
    case 'ARRAY':
    case 'LABEL':
    case 'RELATION':
    case 'OFFSET':
    case 'STRUCTURE':
    case 'EXPRESSION':
    case 'PSEUDOFIELD':
    case 'GLOBALVAR':
    case 'LOCALVAR': return []; // do nothing
    default: throw new Error("unknown expression token type: " + type);
  }
}

var ERR_TYPE_INFO    = "1";
var MSG_CLASS_REPORT = "Reporting";

var INFO_TRUE_QUERY      = 410;  // Current search criteria is equal to "(1=1)", full table query would be needed.
var INFO_FALSE_QUERY     = 411;  // Current search criteria is equal to "(1=0)", no data would be fetched.
var INFO_BLOB_FIELD      = 412;  // Partial File Scan might be needed since field "%S" (on file %S) is mapped to BLOB/CLOB/TEXT/IMAGE.
var INFO_FIELD_NO_INDEX  = 413;  // There is no index defined in dbdict for field "%S".
var ERR_GEN_QUERY_FAILED = 414;  // Failed to generate query for current report.
var ERR_FAIL_EXECUTE_QUERY = 213;

function diagQuery( filename, sql, logLevel )
{
  if ( !logLevel ) {
    logLevel = 2;
  }
  log.setLevel(logLevel);

  if ( !sql ) {
    sql = 'true';
  }

  var msgs = [];
  var msg;

  var ret = getFieldsFromQuery( filename, sql );
  if (log.isDebugEnabled()) {
    log.debug("Check Query: " + sql );
  }
  
  if ( ret.isTrueQuery )
  {
    // fill true-query msg
    msg = funcs.scmsg( INFO_TRUE_QUERY, MSG_CLASS_REPORT );
    msgs.push(msg);
  }
  else if ( ret.isFalseQuery )
  {
    // fill false-query msg
    msg = funcs.scmsg( INFO_FALSE_QUERY, MSG_CLASS_REPORT );
    msgs.push(msg);
  }
  else
  {
    // normal query
    // Map of dbdict meta data
    var dbdictMetaMap = {};

    // To avoid check fields multiple times
    var fieldsCheck = {};

    var fields = ret.fields;
    var i;
    for ( i = 0; fields && (i < fields.length); i++ )
    {
      var field = fields[i];
      if ( !field || !field.realFile ) {
        continue;
      }

      if ( fieldsCheck[field.ref] ) {
        continue;
      }
      fieldsCheck[field.ref] = true;
      if (log.isDebugEnabled()) {
        log.debug("Check Field: " + field.realField + " (" + field.realFile + ")" );
      }

      var dbdictMap = dbdictMetaMap[field.realFile];
      if ( !dbdictMap ) {
        dbdictMap = getDbdictMeta( field.realFile );
      }

      // 1. check whether there is indexes created on each field, report the field which is not indexed
      if ( !dbdictMap.fieldInKeyMap[field.realField] )
      {
        msg = funcs.scmsg( INFO_FIELD_NO_INDEX, MSG_CLASS_REPORT, [ field.realField, field.realFile ] );
        msgs.push(msg);
      }

      // 2. Check whether the field is mapped to BLOB/CLOB
      if ( dbdictMap.fieldsMapping[field.realField] != FIELD_MAPPED_POD )
      {
        msg = funcs.scmsg( INFO_BLOB_FIELD, MSG_CLASS_REPORT, [ field.realField, field.realFile ] );
        msgs.push(msg);
      }
    } // for
  }

  validateQuery( filename, sql, msgs );

  return msgs;
}

/**
 * Verify whether a query is valid or not
 *
 * @param filename
 * @param sql, raw sql
 * @param msgs, array to hold error messages
 *
 * @return no return value, no exception
 */
function validateQuery( filename, sql, msgs )
{
  try{
    var fields = [];
    fields.push('*');
    
    var msg;
    
    var q = "(1=0) and " + sql;
    q = funcs.generate_sql_query( fields, q, filename, false );

    if ( !q )
    {
      // invalid query
      msg = funcs.scmsg( ERR_GEN_QUERY_FAILED, MSG_CLASS_REPORT, [ ] );
      msgs.push(msg);
    }
    else
    {
      var f = new SCFile( filename, SCFILE_READONLY );
      var rc = f.doSelect( q );
      if ( rc == -1 )
      {
        // invalid query, too
        msg = funcs.scmsg( ERR_FAIL_EXECUTE_QUERY, MSG_CLASS_REPORT, [ ] );
        msgs.push(msg);
      }
    }
  }
  catch ( e )
  {
    log.info("Exception caught when check query: " + e.message);
  }

}