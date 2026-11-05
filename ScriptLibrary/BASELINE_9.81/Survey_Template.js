/**
 * During apply template, the template variable like {name} will replace to
 * corresponding parameter value, but the value itself may contains variable
 * too, need expand it again.
 * In order to prevent recursive expanding, define max depth
 */
var NESTED_PARAM_MAX_DEPTH = 5;

/**
 * Set log context name (ScriptLibrary) for every log message
 */
var logger = (function() {
  var _logger = lib.Survey_Logger.getLogger();
  return reduce(["info", "debug", "warn", "error"], function(context, method) {
    context[method] = function(message) {
      _logger[method].call(_logger, "Survey_Template", message);
    };
    return context;
  }, {});
})();

// ECMA262-5 string trim
function trim(text) {
  return text.replace(/^\s+|\s+$/g, '');
}

/**
 * Apply a function against an accumulator and each value of the array 
 * (from left-to-right) as to reduce it to a single value.
 * 
 * reduce executes the callback function once for each element present
 * in the array, excluding holes in the array, receiving four arguments: 
 * 1. the initial value (or value from the previous callback call)
 * 2. the value of the current element
 * 3. the current index
 * 4. the array over which iteration is occurring.
 * 
 * Implemented in JavaScript 1.8
 * ECMAScript 5th Edition
 */
function reduce(array, callback, initialValue) {
  var index = 0, length = array.length, value = initialValue;
  for (; length > index; ++index) {
    value = callback(value, array[index], index, array);
  }
  return value;
}

/**
 * Creates a new array with the results of calling a provided function
 * on every element in this array.
 * 
 * Implemented in JavaScript 1.6
 */
function map(array, mapper) {
  var index = 0, length = array.length, other = new Array(array.length);
  for (; length > index; index++)
    if (index in array)
      other[index] = mapper(array[index], index, array);
  return other;
}

/**
 * (a -> b -> c) -> [a] -> [b] -> [c]
 * Combine two array into one
 * Choose one iterm from array fst, one item from array snd, pass these
 * two items into function fn, and put the return value into a new array
 */
function zipWith(fn, fst, snd) {
  return map(fst, function (_, i) {
    return fn(fst[i], snd[i]);
  });
}

/**
 * Merge several javascript object into one, later one will override 
 * previous one with same property name
 *
 * @returns merged object
 */
/*
function merge() {
  return reduce(arguments, function(context, merger) {
    for (var field in merger) {
      context[field] = merger[field]; // override the existing ones
    }
    return context;
  }, {});
}*/

function merge() {
  return reduce(arguments, function(context, merger) {
    for (var field in merger) {
      if (system.functions.type(merger[field])==8)
      {
      	context[field] = lib.Survey_Internal.transformArrayToString(merger[field]);
      }
      else
      {
      	context[field] = merger[field]; // override the existing ones
      }
    }
    return context;
  }, {});
}
/**
 * Find Survey default language code default language code which configured
 * in Survey Settings
 * 
 * @returns language code
 */
function surveyDefaultLanguage() {
  var language = lib.settings.getSettingValue("Survey", "defaultLanguage");
  if (!language) {
    logger.warn("Cannot get default langauge from settings, use \"en\" instead!");
    language = "en";
  }
  return language;
}

/**
 * Find html mail setting in Survey settings
 * @returns boolean indicate send html mail or text mail
 */
function isSendHtml() {
  return lib.settings.getSettingValue("Survey", "htmlEmails") == "true";
}

/**
 * Search database for localized email body and subject template.
 * 
 * @param id SurveyDefinition Id
 * @returns hash map
 *  key -> language code
 *  value -> JSON object, including email body and email subject
 */
function findLocalizedMailTemplates(id) {
  var localized = new SCFile("SurveyEmailLocalization", SCFILE_READONLY);
  var ret = localized.doSelect('surveyId="' + id + '"');
  var mapping = {};
  while (ret == RC_SUCCESS) {
    mapping[localized.language] = {
      "emailSubject" : localized.emailSubject,
      "emailBody"    : localized.emailBody
    };
    ret = localized.getNext();
  }
  return mapping;
}

/**
 * Generate email content according to Survey task
 * 
 * @param task Survey task, including parameters defined in SurveyDefinition
 *  and recipient list which contains the mail addresses need send survey
 * @param definition SurveyDefinition object, including survey email 
 *  default template
 * @returns list of email task, format is like
 *  @code [{ 
 *   "emailAddress" : "email.address@example.com", 
 *   "emailSubject" : "Localized Email subject", 
 *   "emailBody" : "Localized Email body" 
 *  }, ...]
 */
function renderLocalizedMail(task, definition) {
  var html = isSendHtml()
    , templates = findLocalizedMailTemplates(task.surveyId);
  logger.debug("Generate html email: " + html);
  logger.debug(task.recipients.length + " mails will be generated");

  vars["$survey.template"] = definition['template.id'];
  return map(task.recipients, function(recipient) {
    var context = createContext(recipient, task);
    var url  = applyTemplate(definition.externalSurveyUrl, context, encodeURIComponent);
    context = merge(context, {"$EXURL" : url});
    // If one cannot found template in SurveyEmailLocalization, use default 
    // one which was defined in SurveyDefinition
    var template = templates[context["$LANGUAGE"]] || getDefaultEmailTemplate(definition);
    var subject = applyTemplate(template.emailSubject, context);
    var body = applyTemplate(template.emailBody, context, html ? htmlEscape : undefined);
    if (html) {
      // If html email was edit by Htmleditor, it doesn't have <html> tag
      body = "<html>" + body + "</html>";
    }
    
    vars["$survey.template"] = null;
    return {
      "emailAddress"      : recipient.email,
      "emailSubject"      : subject,
      "emailBody"         : body,
      "externalSurveyUrl" : url
    };
  });
}

/**
 * When localized mail template is not found, return a default one
 * which defined in SurveyDefinition
 */
function getDefaultEmailTemplate (definition) {
  //logger.warn("Cannot find localized email template, use default one instead!");
  return {
    "emailSubject" : definition.emailSubject,
    "emailBody"    : definition.emailBody
  };
}

/*
 * Create tempalte context, including some predefined parameter
 */
function createContext(recipient, task) {
  // In "preview" scenario, if recipient is not defined, we should not 
  // substitute its paramters, so cannot add "predefined" into context
  var configs = [{"predefined" : "$EMAIL", "name" : "email"},
                 {"predefined" : "$NAME" , "name" : "name" }];
  var predefined =  reduce(configs, function(context, config) {
    if (recipient.hasOwnProperty(config.name))
      context[config.predefined] = recipient[config.name];
    return context;
  }, {});
  return merge(predefined, {
    // XXX: Most of the time, user language was not sat, it may
    // impact performance
    "$LANGUAGE" : recipient.lan || surveyDefaultLanguage()
  },{
  	"$SURVEYURL": lib.Survey_Internal.genSurveyURL(recipient, task)
  }, task.paramMap);
}

/*
 * generate api template for each recipient
 * return list of result
 */
function renderAPITemplate(template, task) {
  return map(task.recipients, function(recipient) {
    var context = createContext(recipient, task);
    return applyTemplate(template, context);
  });
}

/**
 * Replace template variable with corresponding parameter value.
 * 
 * @param template Template string, which contains variables defined 
 *  like {variable_name} or {scope.symbol}
 * @param context Parameter values which defined in SurveyDefinition, 
 *  Connector or some predefined values
 * @param escaper Function used to escape special character
 * @returns text string used for mail content
 */
function applyTemplate(template, context, escaper) {
  function _applyTemplate(template, context, escaper, level) {
    template = template || "";
    if (level > NESTED_PARAM_MAX_DEPTH) { // prevent recursive template
      logger.warn("Reach template max expansion depth limit: " + NESTED_PARAM_MAX_DEPTH);
      return template;
    }
    return String(template).replace(/{([^{}]*)}/gi, function(match, expr) {
      var name = trim(expr);
      // If parameter was not defined, return parameter expression and
      // doesn't need escape
      if (!context.hasOwnProperty(name))
        return match;

      var template = context[name];
      // If template variable has found a matched value, replace it
      // otherwise return emptry string
      // When variable was replaced, need to check the replaced value contains
      // other nested parameter or not
      // Don't need escape html tag when expanding nested parameter
      var value = template ?
	    _applyTemplate(template, context, undefined, (level + 1)) : "";
      return escaper ? escaper(value) : value;
    });
  }
  return _applyTemplate(template, context, escaper, 1);
}

/**
 * Escape character which may break html page.
 * 
 * @param text Text string which may contains html tags
 * @returns escaped text string
 */
function htmlEscape(text) {
  return String(text).replace(/[&<>]/g, function(tag) {
    return {
      '<' : '&lt;',
      '>' : '&gt;'
    }[tag] || tag;
  });
}

/**
 * Create a temporary task object which is used to generate email
 */
function prepareTask(definition, record_id) {
  if (!record_id) {
    throw system.functions.scmsg(27, "survey");
  }
  var tableName = definition.tableName;
  var keys = lib.Survey_Utilities.getFileUniqueKey(tableName).toArray();
  // Create query and concat conditions with "and"
  var query = zipWith(function(field, value) {
    return field + "=\"" + value + "\"";
  }, keys, [record_id]).join(" and ");
  
  var file = new SCFile(tableName);
  var rc = file.doSelect(query);
  if (rc == RC_SUCCESS) {
    var smis = lib.Survey_ConfigurationManager.makeDefinition(definition);
    var calc = new (lib.Survey_TaskProducer.getClass())(smis);
    return calc.prepareMapData(file, smis);
  }
  // Record not found
  throw system.functions.scmsg(12, "error", [tableName, query]);
}

/**
 * Preview email template with concreate ticket value
 */
function preview(definition, record_id) {
  var task = prepareTask(definition, record_id);
  if (task.recipients && task.recipients.length == 0) {
    logger.warn("Recipient is not defined, predefined paramter " + 
                "\"Recipient Email\" and \"Recipient Name\" are not available");
    // When recipient is not defined, add an empty one.
    // Otherwise it cannot generate email.
    task.recipients.push({});
  }
  return renderLocalizedMail(task, definition);
}

/**
 * @deprecated
 */
function updateTask(task, definition) {
  var mails = renderLocalizedMail(task, definition);
  task.mails = mails;
  return task;
}
