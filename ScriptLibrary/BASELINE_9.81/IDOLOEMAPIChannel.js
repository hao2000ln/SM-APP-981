/**
 * IDOL ACI OEM version
 * 
 * sm rte provide an api 'doIDOLRequest' to communicate with IDOL server
 * it will read 'idoloemkey' which defined in sm.ini, and use this key to
 * encrypt the communication messages
 * 
 * Currently only GET/POST are supported (2014/05/22)
 */
var JSON = lib.JSON.json(),
    _ = lib.Underscore.require(), 
    Parser = lib.IDOLURLParser.require();

var logger = getLog('IDOLOEMAPIChannel');

var IDOLOEMAPIChannel = (function() {

  var DEFAULT_CONNECTION_OPTIONS = {
    conn_timeout : 10,
    read_timeout : 60,
    oem_key : lib.jsaci.getOEMKey(),
    is_oem : true
  };
    
  function doIDOLOEMAPIRequest(method, endpoint, params, options) {
    var query = Parser.parse(endpoint),
        protocol = query.protocol,
        host = query.host, 
        port = query.port,
        action = params.action || query.action,
        qs1 = params,
        qs2 = query.params,
        qs3 = _.extend(qs1, qs2);
    
    var qs = _.chain(qs3).map(function(v, k) {
      return { name: k, value: v };
    }).filter(function(param) {
      return !!param.name && param.name !== 'action';
    }).map(function(param) {
      return new Header(param.name, param.value);
    }).value();
    
    logger.debug('request oem api: ' + action);
    
    if (logger.isTraceEnabled()) {
      logger.trace('\tmethod: ' + method);
      logger.trace('\thost: ' + host);
      logger.trace('\tport: ' + port);
      logger.trace('\tquery params: ' + qs);
    }
    options = options || {};
    options = _.defaults(options, DEFAULT_CONNECTION_OPTIONS);

    var connTimeout = options.conn_timeout,
        readTimeout = options.read_timeout,
        isOEM = options.is_oem,
        oemKey = options.oem_key;
    
    var response = doIDOLRequest(host, port, action, qs, method === 'POST', 
        connTimeout, readTimeout, isOEM, protocol === 'https', "", oemKey);
    if (logger.isDebugEnabled()) {
      logger.debug('response: ' + response);
    }
    return response;
  }
  
  function doIDOLOEMAPIGet() {
    return doIDOLOEMAPIRequest.apply(this, [ 'GET' ].concat(_.toArray(arguments)));
  }

  function doIDOLOEMAPIPost() {
    return doIDOLOEMAPIRequest.apply(this, [ 'POST' ].concat(_.toArray(arguments)));
  }

  return {
    doGet: doIDOLOEMAPIGet,
    doPost: doIDOLOEMAPIPost
  };
}());

function require() {
  return IDOLOEMAPIChannel;
}