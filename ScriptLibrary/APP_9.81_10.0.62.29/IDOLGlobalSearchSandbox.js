var _ = lib.Underscore.require(),
    JSON = lib.JSON.json();

var logger = getLog('IDOLGlobalSearchSandbox');

var IDOLGlobalSearchSandbox = (function() {

  function isJSObject(v) {
    return Object.prototype.toString.call(v) === '[object Object]';
  }

  // XXX: there are some tricky behavior of assign value between JS engine and RAD engine
  // equality may changed after evaluation (2015/08/04);
  // 
  // e.g.
  // 
  // 1. RAD value assign is not transitive (╯‵□′)╯︵┻━┻
  // var v = new SCDatum();
  // vars['$L.sc.value'] = v;
  // vars['$L.sc.value1'] = vars['$L.sc.value'];
  // print(vars['$L.sc.value1'] === v);  // false
  // 
  // 2. cannot assign js object to RAD variable
  // vars['$L.test.value'] = { test : 'value' };
  // print(vars['$L.test.value'] === null);   // true
  //
  // 3. after assign SCDatum to RAD variable, it is not same as the one stay in JS engine
  // var v = new SCDatum();
  // vars['$L.sc.value'] = v;
  // print(vars['$L.sc.value'] === v);  // false
  //
  // 4. same behavior for Date
  // var d = new Date();
  // vars['$L.date'] = d;
  // print(vars['$L.date'] === d);  // false
  //
  // 5. RAD function 'same' treat all js object same
  // print(funcs.same([1], [1]));      // true
  // print(funcs.same({a:1}, {b:2}));  // true
  function evaluateInSandbox(trueman, callback, scope) {
    var context = _.reduce(trueman, function(memo, v, k) {
      if (isJSObject(v)) {
        logger.warn('cannot update sandbox vars with value ' + JSON.stringify(v));
        throw new Error('Cannot update sandbox vars');
      }
      memo[k] = vars[k]; 
      return memo;
    }, {});

    try {
      _.each(trueman, function(v, k) { vars[k] = v; });
      return callback.apply(scope);
    } finally {
      _.each(context, function(v, k) { vars[k] = v; });
    }
  }
  return {
    evaluate : evaluateInSandbox
  };
}());

function require() {
  return IDOLGlobalSearchSandbox;
}