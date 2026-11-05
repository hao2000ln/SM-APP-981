var log = getLog("JSCodeChecker");

/*
 * This file does simple checker for one line Javascript code.
 *
 *
 * You can add your check function in this file, by following the rule below:
 *
 * function name: startwith "check"
 * function parameter: String for one line code
 * return: String which contains the error/warning message, return empty string if no error found.
 *
 * e.g.
 * 	function checkMyRule(codeline) {
 * 		if (!match) {
 *			return "My warning message.";
 *		} else {
 *			return "";
 *		}
 */

var root = this;
var _checkers = null;
var _ = lib.Underscore.require();

// need fix suggestion
var needSuggestion = true;


/**
 * Check code, this is the main method
 *
 * @return 
 * It returns a structure with this form:
 *
 *     errors: [ 
 *		   {
 *             line: NUMBER,
 *             message: STRING,
 *         }
 *     ]
 */
function check(script) {
	var errors = [];
	var lines = _.lines(script);
	
	var warning;
	var i;
	for (i = 0; i < lines.length; i++) {
		if (lines[i]) {
			warning = checkLine(lines[i]);
			if (warning) {
				warning = {
          			line: i+1,
          			message: warning
		        };
		        errors.push(warning);
			}
		}
	}
	
	return errors;
}


/**
 * Check one line code
 *
 * @return warning/error message, empty string if no error found
 */
function checkLine(codeline) {
	codeline = _.trim(codeline);
	
	// ignore comments
	if ( codeline.length == 0 || _.startsWith(codeline, "//") || _.startsWith(codeline, "*") || 
		 _.startsWith(codeline, "/*") || _.endsWith(codeline, "*/") ) {
		return "";
	}
	
	// get all check functions
	var checkers = getAllCheckFunctions();

	var output = [];
	var i;
	for (i = 0; i < checkers.length; i++) {
		var warning = root[checkers[i]](codeline);
		if (warning) {
			if (output.length > 0) {
				output.push('\n');
			}
			output.push(warning);
		}
	}
	
	return output.join('');
}


/**
 * Get all functions which start with 'check'
 */
function getAllCheckFunctions() {
	if (_checkers) {
		return _checkers;
	}

	_checkers = [];
	
	// get all functions
	var list = [];
	Object.keys(root).forEach(function(f) {
    	if (typeof(root[f])=='function') {
    		if (list.indexOf(f) >= 0) {
    			return;
    		}
    		list.push(f);

			// filter functions which start with 'check'
			if (_.startsWith(f, "check") && f != "check" && f != "checkLine") {
				_checkers.push(f);
			}
	    } 
	});
	
	return _checkers;
}
 

/**
 * Check 'for' statement
 */
function checkStatementFor(codeline) {
	var msg = "";
	var ForPattern = /^[{|\s]*for\s*\(.*$/;
	var ForInPattern = /\s*\S*in\S*\s*/;

    if (ForPattern.test(codeline)) {
        var enClosedPos = findEnclosed(codeline);
        var conditionState = codeline.substr(enClosedPos.start, enClosedPos.end - enClosedPos.start + 1);
        var condition = conditionState.split(';');
        
        if (condition.length != 3) {
            if (ForInPattern.test(conditionState)) {
                msg = "Please avoid (for...in) statement without filtering unwanted properties from the prototype in the body.";
            }
        } else {
			if (_.endsWith(condition[1], "length()")) {
	            msg = "The length function call happens in each loop, which leads to low performance.";

    	        if (needSuggestion) {
        	        var newConditon = fixConditionFor(condition);
            	    msg += "\nPlease try:\n" + newConditon;
            	}
            }
            else if (_.endsWith(condition[1], "getSize()")) {
                msg = "The getSize function call happens in each loop, which leads to low performance.";
            }
            else if (condition[1].indexOf("funcs.lng(") >=0 || condition[1].indexOf("system.functions.lng(") >= 0) {
                msg = "The lng function call happens in each loop, which leads to low performance.";
            }
        }
    }

	if (msg.length > 0) {
		msg = warn(msg);
	}
	
    return msg;
}

function findEnclosed(codeline) {
    var enclosePos = {
        start: -1,
        end: -1
    };

    var level = 0;
	var total = codeline.length;
	var k;
    for (k = 0; k < total; ++k) {
        if (codeline[k] == '(') {
            level++;
            if (enclosePos.start == -1) {
            	enclosePos.start = k;
            }
        }
        if (codeline[k] == ')') {
            level--;
            if (enclosePos.start != -1 && level == 0) {
                enclosePos.end = k;
                break;
            }
        }
    }
    return enclosePos;
}

function fixConditionFor(condition) {
    var LenghPattern = /[^&|]*\.length[^&|]*/g;
	var LenStatePattern = /[^<|>|=]*\.length[^<|>|=]*/;

    var matchs = condition[1].match(LenghPattern);
    if (matchs) {
		var j;
        for (j = 0; matchs != null && j < matchs.length; ++j) {
            var lengState = matchs[j].match(LenStatePattern);

            if (lengState) {
                var loopVariable = condition[0].match(/[^=]*/);
//                if (!loopVariable) {
//                }
                loopVariable = loopVariable.toString().replace(/^\s*\(/, "").replace(/var\s*/, "").replace(/\s*/g, "");
				condition[0] = "var length = " + lengState + ";\nfor" + condition[0];
                condition[1] = condition[1].replace(lengState.toString(), " length");
            } 
//            else {
//            }
        }
        condition = condition.join(";");
        condition = condition.replace(/\s*([><=]+)\s*/g, " $1 ");

        return condition;
    }
}


/**
 * Check by simple regular expression.
 */
function checkByRegularExpression(codeline) {
	var exps = [
		{
			// print
			pattern: /^[{|\s]*print\s*\(.*$/,
			reason: info("Please avoid using print directly.")
		},
		{
			// eval
			pattern: /^[{|\s]*eval\s*\(.*$/,
			reason: warn("Please avoid using eval.")
		},
		{
			// SCFile()
            pattern: /(\$|SCFile)\s*\(\s*["']?[\w|.|$|_]+["']?\s*\)/,
			reason: info("Please make sure the SCFile object is for write, otherwise set 'SCFILE_READONLY' and setFields()")
		}
	];

	var i;
	for (i = 0; i < exps.length; i++) {
		if (exps[i].pattern.test(codeline)) {
			return exps[i].reason;
		}
	}

    return "";	
}


/**
 * Check RTE functions those may have performance concern.
 */
function checkRteFunction(codeline) {
	var functions = [
		"insert",
		"fduplicate"
	];
	
	var i;
	for (i = 0; i < functions.length; i++) {
		if (codeline.indexOf("functions." + functions[i] + "(") != -1 || codeline.indexOf("funcs." + functions[i] + "(") != -1) {
			return info("Please avoid using RTE " + functions[i] + " function for performance concern.");
		}
	}
	
	return "";
}


/**
 * Check legacy JSON library.
 */
function checkLegacyJSONLib(codeline) {
    var legacyJSONs = [
        "JSON2",
        "JSON3",
        "JSON"
    ];
    
    var i;
    for (i = 0; i < legacyJSONs.length; i++) {
        if (codeline.indexOf("lib." + legacyJSONs[i]) != -1 || codeline.indexOf("system.library." + legacyJSONs[i]) != -1) {
            return info("Please use native JSON function instead of legacy " + legacyJSONs[i] + " Script Library.");
        }
    }
    
    return "";
}

function debug(message) {
	if (log.isDebugEnabled()) {
		return "DEBUG - " + message;
	}
}

function info(message) {
	if (log.isInfoEnabled()) {
		return "INFO - " + message;
	}
}

function warn(message) {
	if (log.isWarnEnabled()) {
		return "WARN - " + message;
	}
}

function filterIgnorePart(line) {
    return line.replace(/\$\(\s*(["'])(?:(?=(\\?))\2.)*?\1/g, '$(""')  
        .replace(/security\.getRights\([^\)]*\)/, "security.getRights()")
        .replace(/\s*SCFile\([^\)]*\)/, " SCFile()")
        .replace(/\s*XMLDate\([^\)]*\)/, " XMLDate()")
        .replace(/\s*XML\([^\)]*\)/, " XML()")
        .replace(/\[\s*["'][^\]]*\]/g, "[]")
        .replace(/["']true["']/, "")
        .replace(/["']false["']/, "")
        .replace(/["']\w["']/, "")
        .replace(/\s*callrad\([^\)]*\)/, " callrad()")
        .replace(/msg\([^\)]*\)/, "msg()")
        .replace(/rtecall\([^\)]*\)/, "rtecall()")
        .replace(/getLog\([^\)]*\)/, "getLog()")
        .replace(/\.select\([^\)]*\)/, ".select()")
        .replace(/\.doSelect\([^\)]*\)/, ".doSelect()");
        //.replace(/^\W*\n\W*$/, "");
        //.replace(/\([^\)]*?\)/, "()")
}


/**
 * Check hardcode string
 */
function checkHardcodeStr(codeline) {
    var regxx = new RegExp(/(["'])(?:(?=(\\?))\2.)*?\1/gi);
    var line = filterIgnorePart(codeline);
    var m = regxx.exec(line);
    while (m) {
        //print(m[0]+m[0].length);
        if (/(^|[^\\])[a-zA-Z]/.test(m[0])) {
            return debug("Suspicion of hardcoded string:"+m[0]);
        }
        m = regxx.exec(line);
    }  
	
    return "";
}
