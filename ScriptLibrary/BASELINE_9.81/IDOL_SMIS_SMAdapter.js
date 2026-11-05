var _ = lib.Underscore.require();

var logger = getLog('IDOL_SMIS_SMAdapter');

var Class = lib.smis_Prototype.getClass();

function isRecord(value) {
  var str = Object.prototype.toString.apply(value);
  if (str.indexOf('SCFile') >= 0 || str.indexOf('Datum') >= 0) {
    return value.getType() === 'RELATION';
  }
  return false;
}

function detectTypeName(value) {
  if (isRecord(value)) {
    return 'Record';
  } else if (_.isNumber(value)) {
    return 'Number';
  } else if (_.isString(value)) {
    return 'String';
  } else if (_.isBoolean(value)) {
    return 'Boolean';
  } else if (_.isArray(value)) {
    return 'Array';
  } else if (_.isObject(value)) {
    return 'Object';
  } else {
    return 'Unknown';
  }
}

function serializeSCFile(record) {
  var dTag = new SCDatum();
  funcs.tag(dTag, record);
  return funcs.str(dTag);
}

function deserializeSCFile(tag) {
  var filename = tag.substring(0, tag.indexOf(';'));
  // To prevent accident that string contains ';' character
  if (/^[a-zA-Z0-9_]+$/.test(filename) && system.files[filename]) {
    var file = new SCFile(filename);
    var dSql = new SCDatum();
    funcs.tagquery(file, dSql, tag);
    return file;
  }
  return tag;
}

// XXX: in fact, use JSON serialize/deserialize is enough, no need additional encoding.
// XXX: for arguments which contains SCFile can use ScripLibrary IDOLSerialization to 
// serialize and deserialize
//
// but for compatible reason, we have to provide explict specify the data type of parameters
function decodeParameters(params) {
  if (!_.isArray(params)) {
    throw new Error('invalid parameter type: ' + params);
  }
  params = _.compact(params);
  return _.map(params, function(param) {
    var value = param.value, type = param.type;
    if (type === 'Record') {
      return deserializeSCFile(value);
    }
    return value;
  });
}

function encodeParameters() {
  var args = _.toArray(arguments);
  return _.map(args, function(value) {
    var type = detectTypeName(value);
    if (type === 'Record') {
      value = serializeSCFile(value);
    }
    return { type : type, value : value };
  });
}

var IDOL_SMAdapterClass = Class.create({
  initialize: function(configItem) {
    this.configItem = configItem;
  },
  sendRecords: function(task) {
    try{
      var script = this.getScriptByAction(task.action);
      if (script && _.isFunction(script)) {
        var params = decodeParameters(task.inRecord);
        var result = script.apply(this, params);
        if (result) {
          task.responseMsg = result;
        }
        return true;
      }
      task.responseMsg = 'Action "' + task.action + '" is not defined or has no script';
      return false;
    } catch(ex) {
      logger.error(ex);
      logger.error(ex.stack);
      if (ex) {
        task.responseMsg = ex
        if (ex.stack) {
          task.responseMsg += '\n' + ex.stack;
        }
      }
      return false;
    }
  },
  getScriptLibraryFunction: function(fullname) {
    var names = fullname.split('.');
    var libname = names[0], funcname = names[1];
    var sl = lib[libname];
    if (!sl) {
      throw new Error('unable to locate ScriptLibrary: ' + libname);
    }
    var func = sl[funcname];
    if (!func) {
      throw new Error('unable to locate function, libname: ' + libname + ', function name: ' + funcname);
    }
    return func;
  },
  getScriptByAction: function(action) {
    var actions = this.configItem.getConfigParameterValue('actions'),
        scripts = this.configItem.getConfigParameterValue('scripts');
    actions = actions.split('~');
    scripts = scripts.split('~');

    var mappings = _.object(actions, scripts);
    var script = mappings[action];
    if (!script) { return null; }

    return this.getScriptLibraryFunction(script);
  }
});

function getClass() {
  return IDOL_SMAdapterClass;
}
