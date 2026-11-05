var _ = lib.Underscore.require(),
    IDOLSMProfile = lib.IDOLSMProfile.require();

var logger = getLog('IDOLMandant');

var IDOLMandant = (function() {
  
  function getMandantField(tablename) {
    var mf = new SCFile("scmandant"),
        query = new QueryCond("filename", EQ, tablename),
        rc;
    rc = mf.doSelect(query);
    return rc === RC_SUCCESS ? mf.fieldname : "";
  }

  // XXX: background schedulor operator shouldn't have any mandant defined, otherwise only
  // portion of the data can be indexed.
  function detectMandantValues(filename, query) {
    var mandant = IDOLMandant.getMandantField(filename);
    if (!mandant) {
      logger.warn('"' + filename + '" doesn\'t have mandant field defined, ignore mandant detection');
      return [];
    }

    var source = new SCFile(filename), rc;
    var sql = "select " + mandant + ", count(" + mandant + ") as num from " + filename;
    if (query) {
      sql += " where " + query;
    }
    sql += ' group by ' + mandant;

    logger.debug('query mandant values via sql: ' + sql);

    rc = source.doSelect(sql);
    var companies = [];
    while (rc === RC_SUCCESS) {
      companies.push(source[mandant]);
      rc = source.getNext();
    }
    return companies;
  }
  
  // multi-company mode IDOL database name schema
  function buildDatabaseName(base, company) {
    var name = _.compact([base, company]).join('_');
    // XXX: if the http query string has space character
    // when sending it in HTTP GET, the space character will be encoded to '%20'
    // in HTTP POST (application/x-www-form-urlencoded), the space character will be encoded to '+'
    // But at IDOL server side, only '%20' is acceptable.
    // So replace space character to underscore character as a workaround
    var newname = encodeURIComponent(name.replace(/[ &\t]/g, '_'));
    if (name !== newname) {
      logger.warn('"' + name + '" is not a valid IDOL database name, rename it to "' + newname + '"');
    }
    return newname;
  }

  function buildCompanyNames() {
    var company = new SCFile("company"),
        query = new QueryCond("show.company", EQ, "Y"),
        rc;
    rc = company.doSelect(query);
    var companies = [];
    while(rc === RC_SUCCESS) {
      var name = company.company;
      companies.push({
        name : name,
        text : company["company.full.name"] || name
      });
      rc = company.getNext();
    }
    return companies;
  }
  
  return {
    detectMandantValues : detectMandantValues,
    getMandantField : getMandantField,
    buildCompanyNames : buildCompanyNames,
    buildDatabaseName : buildDatabaseName
  };
})();

function require() {
  return IDOLMandant;
}