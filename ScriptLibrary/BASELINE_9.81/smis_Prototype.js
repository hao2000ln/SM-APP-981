/******************************************************
* Module Name: SMIS Prototype class
* Function: provide basic class inherent mechanism
* Author: Tian, Shao-Qin
* Version: 1.00
* Creation Date: spr, 2009
*******************************************************/

function getClass() { return Class; }

function toString() {
	var str = "";
	for (var prop in this) {
		str += prop;
		str += "=";
		str += this[prop];
		str += ", ";		
	}
	return str;
}


var Class = {
  create: function() {
    var parent = null, properties = toArray(arguments);
    if (typeof(properties[0]) == 'function')
      parent = properties.shift();

    function klass() {
      this.initialize.apply(this, arguments);
    }

    Object.extend(klass, Class.Methods);
    klass.superclass = parent;
    klass.subclasses = [];

    if (parent) {
      var subclass = function() { };
      subclass.prototype = parent.prototype;
      klass.prototype = new subclass;
      parent.subclasses.push(klass);
    }

    for (var i = 0; i < properties.length; i++)
      klass.addMethods(properties[i]);

    if (!klass.prototype.initialize)
      klass.prototype.initialize = function() { };

    klass.prototype.constructor = klass;

    klass.prototype.toString = toString;
    
    return klass;
  }
};

Class.Methods = {
  addMethods: function(source) {
    var ancestor   = this.superclass && this.superclass.prototype;

    for (var property in source) {
      value = source[property];
      if (ancestor && typeof(value) == 'function' &&
          value.argumentNames()[0] == "$super") {
        var method = value;
        value = (function(m) {
          return function() { return ancestor[m].apply(this, arguments) };
        })(property).wrap(method);
      }
      this.prototype[property] = value;
    }

    return this;
  }
};

Object.extend = function(destination, source) {
  for (var property in source)
    destination[property] = source[property];
  return destination;
};


Object.extend(Function.prototype, {
  argumentNames: function() {
    var names = this.toString().match(/^[\s\(]*function[^(]*\(([^\)]*)\)/)[1]
      .replace(/\s+/g, '').split(',');
    return names.length == 1 && !names[0] ? [] : names;
  },

  bind: function() {
    if (arguments.length < 2 && typeof(arguments[0]) == 'undefined') return this;
    var __method = this, args = toArray(arguments), object = args.shift();
    return function() {
      return __method.apply(object, args.concat(toArray(arguments)));
    }
  },

  wrap: function(wrapper) {
    var __method = this;
    return function() {
      return wrapper.apply(this, [__method.bind(this)].concat(toArray(arguments)));
    }
  }

});

function toArray(iterable) {
  var length = iterable.length || 0, results = new Array(length);
  while (length--) results[length] = iterable[length];
  return results;
}


