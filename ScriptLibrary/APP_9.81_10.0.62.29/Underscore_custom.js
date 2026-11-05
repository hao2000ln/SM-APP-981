/*
* common utilities special for sc
*/

var _type = funcs.type;


function install(root){
  'use strict';
  
  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  root._ = root._ || {};
  var _ = root._;
    
  var _s = {
    
    /*
    * isSCArray, check if the array is SC specific array
    */
    isSCArray: function(obj) {
      return _type(obj) === 8 && (toString.call(obj) === '[object SCDatum]' || toString.call(obj) === '[object Datum]');
    },
    
    /*
    * isArray, will override Underscore built-in isArray
    */
    isArray: function(obj) {
    	return toString.call(obj) === '[object Array]' || _s.isSCArray(obj);
    },
    
    /*
    * arrayLen, if SC array, return length(), otherwise return length
    */
    arrayLen: function(obj) {
      if (_.isSCArray(obj)) {
        return obj.length();
      } else if (this.isArray(obj) || _.isString(obj)) {
        return obj.length;
      }      
    },
    
    /*
    * toJSArray, supported nested sc array
    */
    toJSArray: function(obj) {
      if (_s.isSCArray(obj)) {
	    var i, iLoopTimes;
	    var arr = [];
	    for (i = 0, iLoopTimes = obj.length(); i < iLoopTimes; i++) {
	      if (!!obj[i]) {
	    	arr.push(_s.toJSArray(obj[i]));
	      }
	    }
        return arr;
      } /*else if (_type(obj) == 9 || _type(obj) == 6) {
        var newObj = {};
        for (var p in obj) { print(p + ": " + obj[p]);
          newObj[p] = _s.toJSArray(obj[p]);
        }
        return newObj;
      } */else {
        return obj;
      }
      
    },
    
    getFieldList: function(tableName) {
    	return lib.tableFunctions.getFieldList(tableName);
    }
  
  };
  
  // copy the utilities to Underscore
  var p;
  for (p in _s) {
    root._[p] = _s[p];
  }

}