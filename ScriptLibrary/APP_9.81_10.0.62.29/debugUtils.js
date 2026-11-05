function printOut( strPrint )
{
	print( strPrint );
}

function logData( strLog )
{
	var retval = new SCDatum();
	funcs.rtecall("log", retval, strLog); 
}

function strReplace ( strTarget, strOld, strNew)
{
	strTarget = String( strTarget );
    var regexp = new RegExp(strOld, "g");
    strTarget = strTarget.replace(regexp, strNew);
	return strTarget;
}

var Parser = function(node) {
    this.toJSON = function() {
        var result = {};
        foreach(node, function(node) { processField(node, result); });
        return result;
    };

    function foreach(node, action) {
        var cnode = node.getFirstChildElement();
        while (cnode != null) {
            action(cnode);
            cnode = cnode.getNextSiblingElement();
        }
    }

    function processField(node, result) {
        var name = node.getNodeName();
        result[name] = processFieldValue(node);
    }

    function processFieldValue(node) {
        var result = null;
        switch (node.getAttributeValue("type") || node.getAttributeValue("sctype")) {
            case "":
            case "structure":
                result = {};
                foreach(node, function(node) { processField(node, result); });
                break;
            case "array":
                result = [];
                foreach(node, function(node) { result.push(processFieldValue(node)); });
                break;
            default:
                result = node.getNodeValue();
        }
        return result;
    }
};

/**
 * This function is to enhance "d $L.file" in RAD Debugger to display field name with field value
 * Usage: 
 *  d jscall("debugUtils.display",$L.file)
 *  or
 *  dd $L.file
 * Note: The field with empty value will not be displayed
 *
 * @param {SCFile} file
 * @returns {String}
 */
function display(file) {
    
    if (!file) {
        return "NULL";
    }
    
    var json = fileToJson(file);
    var jsonString = JSON.stringify(json, null, "   ");

    if (file.getType && file.getType() == "RELATION") {
        // add file name for SCFile
        return funcs.filename(file) + " = " + jsonString;
    }
    else {
        return jsonString;
    }
}


function fileToJson(file) {
    if (!file) {
        return "Provided file is invalid.";
    }

    // JS Array
    if (file instanceof Array) {
        return file.map((item) => fileToJson(item));
    }
    
    if (!file.getType) { 
        return file;
    }

    var type = file.getType();

    // SCDatum Array
    if (type == "ARRAY") {
        var array = [];
        var i;
        var length = funcs.lng(file);
        for (i = 0; i < length; i++) {
        var j = fileToJson(file[i]);
            array.push(fileToJson(file[i]));
        }
        
        return array;        
    }
    
    // SCFile
    if (type != "RELATION") {
        return "Currently I can't handle type \"" + type + "\", only \"RELATION\" is acceptable";
    }
        
    var node = file.getXML();
    return new Parser(node).toJSON();
}


/**
 * Log message in rtm:3 mode
 */
function log(message)
{
	/*
	 * This function doesn't has any code inside.
	 * Server logs all the javascript parameter value in rtm:3 mode,
	 * that is the purpose of the function, to print message in sm.log.
	 */	
}

function printObject(obj) {
    var item;
	for(item in obj) {
	    print( " - " + item + ": " + obj[item]);
	}
}


/**
 * get stack trace
 */
function getStackTrace() {
    try {
        throw new Error();
    }
    catch (e) {
        var trace = e.stack;
        
        // remove fist line of debugUtils itself 
        var index = trace.indexOf('\n');
        if (index > 0) {
            trace = trace.substring(index + 1);
        }
        
        return trace;
    }
}


/**
 * Show the display tag query of the file
 * 
 * This function is used in RAD Debugger to display file query
 * Usage: 
 *  dq $L.file
 *
 * @param {SCFile} file
 * @returns {String}
 */
function displayTagQuery(file) {
    if (!file || !file.getType || file.getType() != "RELATION") {
        return "NULL";
    }

    var tag = lib.upgradeSignatures.getTag(file);

    var fileTag = new SCFile();
    funcs.fduplicate(fileTag, file);
    
    var query = new SCDatum();    
    funcs.rtecall("tagquery", new SCDatum(), fileTag, query, tag);
    return query.getText();
}
