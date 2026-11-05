/**
 * Send IDOL ACI command via standard HTTP client.
 */
var _ = lib.Underscore.require();

var logger = getLog('IDOLHTTPChannel');

var IDOLHTTPChannel = (function() {
  //IDOL required that "action" must be the first parameter
  function queryString(params) {
    if (_.isEmpty(params)) return "";

    var serialize = function(v, k) { return k + '=' + encodeURIComponent(v); };
    var action = _.chain(params).pick('action').map(serialize).value(),
        others = _.chain(params).omit('action').map(serialize).value();
    return [].concat(action).concat(others).join('&');
  }
  
  // TODO send plain http request, may need add authentication later.
  function doIDOLHTTPGet(endpoint, params) {
    var qs = queryString(params);
    // NOTE: '?' is not required for IDOL, but use it is more standard.
    var url = _.compact([endpoint, qs]).join('?');
    
    logger.debug('request url (GET): ' + url);
    var response = doHTTPRequest('GET', url, []);
    logger.debug('response: ' + response);
    return response;
  }

  // only handle "application/x-www-form-urlencoded" post
  // multi-part is not considered
  function doIDOLHTTPPost(endpoint, params) {
    var payload = queryString(params);
    logger.debug('request url (POST): ' + endpoint);
    logger.debug('request payload: ' + payload);
    // all the parameters are encoded in the post body
    var response = doHTTPRequest('POST', endpoint, [], payload);
    logger.debug('response: ' + response);
    return response;
  }
  
  return {
    doGet: doIDOLHTTPGet,
    doPost: doIDOLHTTPPost
  };
})();

function require() {
  return IDOLHTTPChannel;
}