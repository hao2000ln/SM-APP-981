var _ = lib.Underscore.require(),
    XQuery = lib.XQuery.require(),
    IDOLClientFactory = lib.IDOLClientFactory.require();

var logger = getLog('IDOLGlobalSearchSharePointLinkBuilder');

var IDOLGlobalSearchSharePointLinkBuilder = (function() {
  var HTTP_URL_PATTERN = /^https?:\/\//;

  function buildRootParentSharePointLink(reference, database) {
    logger.trace('try to find sharepoint document: ' + reference + ', database ' + database);

    var client = IDOLClientFactory.create('GlobalSearch');
    var params = {
      action: 'GetContent',
      Reference: encodeURIComponent(reference),
      DatabaseMatch: database,
      Print: 'Fields',
      PrintFields: 'FILEURL,LISTITEMURL'  
    };
    if(vars.$G_securityInfo) {
      params.SecurityInfo = vars.$G_securityInfo;
    }
    var doc = client.executeAction(params);
    var hit = XQuery.queryOne('responsedata/autn:hit', doc);
    
    // XXX: Currently only `queryObject` can handle alternative path
    // TODO: make `XQuery.queryText` be able to handle alternatives
    var data = XQuery.queryObject({
      url: 'autn:content/DOCUMENT/FILEURL|LISTITEMURL'
    }, hit);
    return data.url;
  }

  function buildSharePointLink(reference, database) {
    if (HTTP_URL_PATTERN.test(reference)) {
      return reference;
    }
    
    var client = IDOLClientFactory.create('GlobalSearch');
    var params = {
      action: 'GetContent',
      Reference: encodeURIComponent(reference),
      DatabaseMatch: database,
      PrintFields: 'LISTITEMURL,FILEURL,DREROOTPARENTREFERENCE'  
    };
    if(vars.$G_securityInfo) {
      params.SecurityInfo = vars.$G_securityInfo;
    }
      
    var doc = client.executeAction(params);

    var hit = XQuery.queryOne('responsedata/autn:hit', doc);
    var data = XQuery.queryObject({
      url : 'autn:content/DOCUMENT/FILEURL|LISTITEMURL',
      parentRef : 'autn:content/DOCUMENT/DREROOTPARENTREFERENCE'
    }, hit);

    var url = data.url;

    if (HTTP_URL_PATTERN.test(url)) { return url; }

    return IDOLGlobalSearchSharePointLinkBuilder.buildLink(data.parentRef, database);
  }

  function isLinkValidate(reference) {
    return HTTP_URL_PATTERN.test(reference);
  }

  return {
    isLinkValidate : isLinkValidate,
    buildParentLink : buildRootParentSharePointLink,
    buildLink : buildSharePointLink
  };
}());


function require() {
  return IDOLGlobalSearchSharePointLinkBuilder;
}