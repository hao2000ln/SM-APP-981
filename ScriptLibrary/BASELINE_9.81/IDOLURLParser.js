/**
 * Parse IDOL ACI command
 * 
 * 'http://xxxxx:9000/action=query&text=*' is not a valid URL but a valid
 * IDOL command, this library can parse above command, and return a JSON
 * object as parse result.
 */
var _ = lib.Underscore.require();

var IDOLURLParser = (function() {
  var PATTERN_HTTP = /^(http|https):\/\/([^:\/]+)(?::(\d+))?(?:\/)?/i,
      PATTERN_HTTP_IPV6 = /^(http|https):\/\/\[([^\]]+)\](?::(\d+))?(?:\/)?/i;
  
  var WELL_KNOWN_PORTS = { http: 80, https: 443 };
  
  function parse(url) {
    var matches = url.match(PATTERN_HTTP_IPV6) || url.match(PATTERN_HTTP);
    if (!matches) {
      throw new Error("Invalid IDOL command url: " + url);
    }
    var endpoint = matches[0],
        protocol = (matches[1] || 'http').toLowerCase(),
        port = matches[3] || WELL_KNOWN_PORTS[protocol.toLowerCase()],
        index, qs;
    
    qs = url.substring(endpoint.length) || '';
    if ((index = qs.indexOf('?')) !== -1) {
      // question mark (?) is optional for idol commands
      qs = qs.substring(index + 1);
    }
    var params = _.chain(qs.split('&')).map(function(param) {
      var pair = param.split('='), name = pair[0], value = pair[1];
      return [name, decodeURIComponent(value)];
    }).object().value();

    var action = params.action;
    delete params.action;
    
    return {
      endpoint : endpoint,
      protocol : protocol,
      host : matches[2],
      port : parseInt(port, 10),
      action: action,
      params: params
    };
  }
  
  return {
    parse: parse
  };
})();

function require() {
  return IDOLURLParser;
}

