/**
* Service Manager RESTful API required specific database schema, but sometimes
* the resources doesn't have persistent storage
*/
var _ = lib.Underscore.require(),
    JSON = lib.JSON.json();

var logger = getLog('RestfulBase');

var RESOURCE_NAME = 'base';
var SCRIPT_PREFIX = 'RunRestful';

var RestfulBase = (function() {

  function isInt(n){
    return Number(n) === n && n % 1 === 0;
  }

  function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
  }

  function getType(value) {
    if (_.isArray(value)) {
      return 'array';
    } else if (_.isString(value)) {
      return 'string';
    } else if (_.isBoolean(value)) {
      return 'boolean';
    } else if (isInt(value)) {
      return 'integer';
    } else if (isFloat(value)) {
      return 'float';
    } else if (_.isObject(value)) {
      return 'object';
    } else {
      return 'unknown';
    }
  }

  // TODO: handle Date type, since "_.isObject(new Date()) === true"
  function toSMRestfulFormat(value) {
    if (!_.isObject(value)) { 
      return { type: getType(value), value: value };
    }

    var result = {};
    if(_.isArray(value)){
      result = [];
    }
    
    _.each(value, function(child, key) {
      var item = null;
      var type = getType(child);
      if (type === 'array') {
        item = _.map(child, toSMRestfulFormat);
      } else if (type === 'object') {
        item = mapObject(child, toSMRestfulFormat);
      } else {
        item = child;
      }
      
      result[key] = { type: type, value: item };
    });
    
    return {type: getType(value), value:result};
  }

  function HTTPRequest(uri, options, object) {
    this.uri = uri;
    this.options = options;
    if (options.method === 'POST') {
      try {
        this.body = JSON.parse(object);
      } catch (e) {
        // make "body" empty if the post is not a valid JSON string
      }
    }
  }

  function HTTPResponse() {
    this.httpStatus = 200;
    this.messages = [];
    this.body = {};
  }

  HTTPResponse.prototype.status  = function(httpStatus) { this.httpStatus = httpStatus; return this; };
  HTTPResponse.prototype.message = function(message)    { this.messages.push(message);  return this; };
  HTTPResponse.prototype.send    = function(body)       { this.body = body;             return this; };

  HTTPResponse.prototype.toSMRestfulResponse = function() {
    var messages = this.messages || [];
    if (this.httpStatus !== 200) {
      return {
        HttpStatus: this.httpStatus,
        Messages: messages.join('\n'),
        ReturnType: 'record'
      };
    } else {
      return toSMRestfulFormat(this.body);
    }
  };

  function processRequest(uri, options, object) {
    var request = new HTTPRequest(uri, options, object);
    var response = new HTTPResponse();

    var path = uri[1];
    var libname = SCRIPT_PREFIX + _.capitalize(path);

    var script = lib[libname];
    if (!script) {
      return response.status(404).message('script library ' + libname + ' is not available');
    }

    var method = options.method;
    var handle = script[method];
    if (!_.isFunction(handle)) {
      return response.status(404).message('script: ' + libname + ' does\'t have ' + method + ' defined');
    }

    var authorize = script.authorize;
    if (!_.isFunction(authorize) || !authorize.call(this, request, response)) {
      return response.status(403).message(funcs.scmsg('36', 'restful'));
    }

    handle.call(this, request, response);
    return response;
  }

  return {
    process: processRequest
  };
}());

function accept(uri, options){
  return uri[0] === RESOURCE_NAME;
}

function process(uri, options, object) {
  try {
    var response = RestfulBase.process(uri, options, object);
    var data = response.toSMRestfulResponse();
    return JSON.stringify(data);
  } catch(e) {
    logger.error(e);
    logger.error(e.stack);
    throw e;
  }
}

function mapObject(object, func) {
  var result = {};
  _.each(object, function(item, key){
    result[key] = func(item, key);
  });
  return result;
}
