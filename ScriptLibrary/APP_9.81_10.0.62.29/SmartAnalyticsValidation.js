/**
 * Validator specification:
 *
 * 1. validator is high order ANONYMOUS function.
 *    it accept some configuration return a new function
 *    1st config argument is validator definition itself (SmartAnalyticsValidations SCFile instance)
 *    2nd config argument is SCFile `idolserverinfo` SCFile instance
 *
 * 2. the returned furnction accept vary arguments
 *    1st argument is 'ValidationResults' object.
 *    most of the time, 2nd argument is a SCFile instance, such as 'kmknowledgebase'
 *
 *    function(idolserverinfo, config) {
 *      return function(results, args...) {
 *        ... validate with `args` and `config`
 *        return results;
 *      }
 *    }
 */
var _ = lib.Underscore.require(),
    JSON = lib.JSON.json();

var logger = getLog('SmartAnalyticsValidation');

var Validation = (function() {

  // same as Underscore reduce, but it works on SCFile record list
  // and `memo` object is required
  function reduceSCFile(filename, iteratee, memo) {
    var record = new SCFile(filename, SCFILE_READONLY);
    var rc = record.doSelect(true);
    while (rc === RC_SUCCESS) {
      memo = iteratee.call(this, memo, record);
      rc = record.getNext();
    }
    return memo;
  }


  function evaluateFunction(fValidationRule, type) {
    var script = fValidationRule[type],
        validationId = fValidationRule.id;
    try {
      var func = eval('(' + script + ')');
      if (!_.isFunction(func)) {
        throw new Error('script evaluation result is not a function.\n' + script);
      }
      if (func.name) {
        funcs.msg('please use an anonymous function, otherwise it MAY have name collision with existing one. ' 
          + 'id: ' + validationId + ', '
          + 'script type: ' + type + ', ' 
          + 'function name: ' + func.name, 2);
      }
      return func;
    } catch (e) {
      funcs.msg('evaluation error happened in SmartAnalyticsValidations, id: ' + validationId, 3);
      funcs.msg(e.message, 3);
      funcs.msg(e.stack, 3);
      throw e;
    }
  }

  // compose several validator into one function
  function createValidatorChain(rules) {
    rules = _.sortBy(rules, function(r) { return r.order; });
    // results => `ValidationResults` object
    // record => SCFile instance which is under validation
    return function(/* results, record */) {
      var original_args = arguments, results = _.first(original_args);
      return _.reduce(rules, function(results, rule) {
        var assert = results.createAssert(rule);
        // Array.prototype.unshift is an in-place edit, have to apply on its original copy
        var args = _.rest(original_args);
        args.unshift(assert);
        rule.validator.apply(this, args);
        return results;
      }, results);
    };
  }

  function readValidationRules(idolserverinfo) {
    return reduceSCFile('SmartAnalyticsValidations', function(rules, fValidationRules) {
      if (_.isBlank(fValidationRules.validator)) {
        funcs.msg('SmartAnalyticsValidations, rule ' + fValidationRules.id + ' doesn\'t have validation script defined. Skipped', 2);
        return rules;
      }

      var wrap = evaluateFunction(fValidationRules, 'validator');
      var resolver = _.isBlank(fValidationRules.resolver) ? null : evaluateFunction(fValidationRules, 'resolver');
      var validator = wrap.call(null, fValidationRules, idolserverinfo);

      rules.push({
        id : fValidationRules.id,
        summary : fValidationRules.summary,
        description : fValidationRules.description,
        validator : validator,
        resolver : resolver,
        type : fValidationRules.type,
        order : fValidationRules.order || 0
      });
      return rules;
    }, []);
  }

  function applyTemplate(template, data) {
    data = data || {};
    return String(template).replace(/\{([^{}]+)\}/gi, function(match, expr) {
      var name = _.trim(expr);
      return _.reduce(name.split('.'), function(data, name) {
        return data.hasOwnProperty(name) ? data[name] : match;
      }, data);
    });
  }

  function Assert(rule, collector) {
    this._rule = rule;
    this._collector = collector;
  }

  Assert.prototype._addToCollector = function(type, expected, actual, message) {
    var rule = this._rule, 
        data = { expected : expected, actual: actual };
    this._collector.push({
      id : rule.id,
      type: type,
      args: data,
      summary : applyTemplate(rule.summary, data),
      description: applyTemplate(rule.description, data),
      hasResolver: !!rule.resolver
    });
  };
  Assert.prototype.fail = _.partial(Assert.prototype._addToCollector, 'fail');
  Assert.prototype.warn = _.partial(Assert.prototype._addToCollector, 'warn');


  function ValidationResults() { this._data = []; }
  ValidationResults.prototype.createAssert = function(rule) { return new Assert(rule, this._data); };
  ValidationResults.prototype.hasError = function() { return this._data.length > 0; };
  ValidationResults.prototype.toString = function() { return JSON.stringify(this._data); };
  
  // XXX: getIDs ... getResolvers are for UI display
  // format => SmartAnalyticsValidations.ValidationResult.list
  ValidationResults.prototype.getIDs = function() { return _.pluck(this._data, 'id'); };
  ValidationResults.prototype.getSummaries = function() { return _.pluck(this._data, 'summary'); };
  ValidationResults.prototype.getDescriptions = function() { return _.pluck(this._data, 'description'); };
  ValidationResults.prototype.getResolvers = function() { return _.pluck(this._data, 'hasResolver'); };
  ValidationResults.prototype.getExtraArgs = function() {
    return _.map(this._data, function(d) {
      return JSON.stringify(d.args);
    });
  };

  function validateAllSettings(idolserverinfo) {
    var rules = readValidationRules(idolserverinfo);
    return _.chain(rules)
      .groupBy('type')
      .reduce(function(results, rules, type) {
        // `type` is same as SCFile `filename`
        var validator = createValidatorChain(rules);
        return reduceSCFile(type, validator, results);
      }, new ValidationResults())
      .value();
  }

  // XXX: it is impossible to pass javascript object (with function) into 
  // RAD application, only primary type can be used
  // 
  // have to re-select the SmartAnalyticsValidations object and evaluate
  // the resolver again
  function resolveValidationError(id, strJSON) {
    var rule = new SCFile('SmartAnalyticsValidations', SCFILE_READONLY);
    var rc = rule.doSelect(new QueryCond('id', EQ, id));

    if (rc !== RC_SUCCESS) {
      throw new Error('cannot find error definition in SmartAnalyticsValidations. (id: ' + id + ')');
    }

    var resolver = evaluateFunction(rule, 'resolver');

    var args = JSON.parse(strJSON);
    var expected = args.expected, actual = args.actual;
    return resolver.call(this, expected, actual);
  }

  return {
    validate : validateAllSettings,
    resolve : resolveValidationError
  };
}());

// this function can be evaluated in two place
// 1. Process => idolserver.validate
// 2. RAD => view.smartanalytics.validation.errors => refresh.error.list
// though they are using the same variable names, but there stack/scope is different
function validate() {
  var result = Validation.validate.apply(Validation, arguments);
  var hasError = result.hasError();
  vars['$L.has.validation.error'] = hasError;
  vars['$L.validation.error.ids'] = result.getIDs();
  vars['$L.validation.error.summaries'] = result.getSummaries();
  vars['$L.validation.error.descriptions'] = result.getDescriptions();
  vars['$L.validation.error.args'] = result.getExtraArgs();
  vars['$L.validation.error.resolvers'] = result.getResolvers();

  if (!hasError) {
    var message = funcs.scmsg('validate.success', 'idol');
    funcs.msg(message);
  }
  return result;
}

function resolve() {
  return Validation.resolve.apply(Validation, arguments);
}

//SmartAnalyticsValidation.validate();