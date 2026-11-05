/**
   * This clas is used for parsing query editor xml and generate xml with json object from UI.
   * The xml example is like following:
   * 
   * 
    <collection logic='and' negative='false'>

      <query>
        <operand>
          <field name='coordinator' datatype='string'/>
        </operand>
        <operator name='equal'/>
        <value type='CurrentRecord'>
          <field name='operator'/>
        </value>
      </query>
    
      <query>
        <operand>
          <field name='coordinator' datatype='string'/>
        </operand>
        <operator name='equal'/>
        <value type='Value'><![CDATA[Closed]]></value>
      </query>
    
      <query>
        <operand>
          <field name='coordinator' datatype='string'/>
        </operand>
        <operator name='equal'/>
        <value type='Variable'>$L.file</value>
      </query>
    
      <query>
        <operand>
          <field name='coordinator' datatype='string'/>
        </operand>
        <operator name='equal'/>
        <value type='NULL'/>
      </query>
    
    </collection>
    
   * The following xml structure are supported:
   * <collection>
   *   <collection>
   *     <query/>
   *     <collection>
   *       <query/>
   *       <query/>
   *     </collection>
   *     <query/>
   *   </collection> 
   *   <query/>
   * </collection> 
   * 
   * The root node is always a collection.
   */
var $ = lib.c.$;
var dt = lib.DataTypeConst;
var _str = funcs.str;

var logger = getLog("QueryEditorParser");

var COMPARISON_Map = {
    equals: "=",
    equal: "=",
    neq: "~=",
    gt: ">",
    get: ">=",
    lt: "<",
    let: "<=",
    startswith: "#"
};
var COMPARISON_Desc_Map = {
    equals: "=",
    equal: "=",
    neq: "!=",
    gt: ">",
    get: ">=",
    lt: "<",
    let: "<=",
    startswith: funcs.scmsg("startswith", "xmlFilter")
};

var LOGICAL_Map = {
    and: "AND",
    or: "OR"
};


function getComparison(operator) {
    return COMPARISON_Map[operator] || '';
}

function encloseValue(valueStr, dataType, field, context) {
    if (dataType == "array" && typeof(valueStr) == "string") {
        dataType = getArrayType(field, context);
    }
    if (typeof(valueStr) != "string") {
        valueStr = _str(valueStr);
    }
    return encloseValueStr(valueStr, dataType);
}

function encloseValueStr(valueStr, dataType, descOnly) {
    if (!valueStr) {
        return "NULL";
    }
    switch (dataType) {
        case "boolean":
            return valueStr;
        case "string":
            if (valueStr != "NULL") {
                if (descOnly) {
                    return "\"" + valueStr + "\"";
                }
                return "\"" + valueStr.replace(/\\/g, "\\\\").replace(/\"/g, "\\\"") + "\"";
            } else {
                return "NULL";
            }
        case "number":
            return valueStr;
        case "datetime":
            return "'" + valueStr + "'";
        case "null":
            return "NULL";
    }
    return valueStr;
}

function getQuery(xml, context, tableAlias) {
    if (context.CurrentRecord === null || context.CurrentRecord === undefined) {
        context.CurrentRecord = vars["$L.file"];
    }
    if (context.SavedRecord === null || context.SavedRecord === undefined) {
        context.SavedRecord = vars["$L.file.save"];
    }
    // make sure the $L.file.save is not null otherwise it might cause some unexpected error, for e.g., this query eidtor is configure at On-add state.
    if (context.CurrentRecord != null && (context.SavedRecord === null || context.SavedRecord === undefined)) {
        context.SavedRecord = new SCFile(funcs.filename(context.CurrentRecord));
    }
    var queryObj = parseXMLToJson(xml);

    try {
        return parseJsonToQuery(queryObj, context, tableAlias);
    } catch (ex) {
        logger.error("getQuery", `xml:${xml}`, "json:" + JSON.stringify(queryObj), ex);
        return false;
    }
}

function strLizeDataType(dataType) {
    var dataTypeArray = {
        "1": 'number',
        "2": 'string',
        "3": 'datetime',
        "4": 'boolean',
        "8": 'array'
    };
    if (dataTypeArray[dataType] != null) {
        dataType = dataTypeArray[dataType];
    }
    return dataType;
}


function getArrayType(field, context) {
    if (context && context.TargetFile) {
        context._dbdictService = context._dbdictService || $("#dbdictService");
        context.DBDICT = context.DBDICT || $(context.TargetFile).dbdict();
        context.DBDICT_FIELDSDESC = context.DBDICT_FIELDSDESC || context._dbdictService.getDescriptorMeta(context.DBDICT.field);
        var fieldMeta = context._dbdictService.getFieldMeta(field, context.DBDICT_FIELDSDESC, false);
        return strLizeDataType(fieldMeta.childs[0].field.type);
    }
    return 'string';
}

function parseJsonToQuery(json, context, tableAlias) {

    var logical = " " + json.logic + " ";
    var query = null;
    if (json.isGroup) {
        var children = json.children;
        if (!children || children.length == 0) {
            return "true";
        }

        var i;
        for (i = 0; i < children.length; ++i) {
            var childQuery = parseJsonToQuery(children[i], context, tableAlias);
            query = query ? (query + logical + childQuery) : childQuery;
        }

        var notPrefix = (json.negative == "true") ? "not " : "";
        return notPrefix + "( " + query + " )";
    } else {
        var comparision = getComparison(json.operator);
        var field = json.left.value;
        if (tableAlias && "" !== tableAlias) {
            field = tableAlias + "." + field;
        }
        var dataType = json.left.datatype;
        switch (json.right.type) {
            case 'Value':
                return field + comparision + encloseValue(json.right.value, dataType, field, context);
            case 'CurrentRecord':
            case 'SavedRecord':
                //if null? context[json.right.type][json.right.value]
                return field + comparision + encloseValue(context[json.right.type][json.right.value], dataType, field, context);
            case 'NULL':
                return field + comparision + encloseValue(null, dataType, field, context);
            case "Variable":
                //if null? 
                return field + comparision + encloseValue(vars[json.right.value], dataType, field, context);
            default:
                print(json.right.type);
                return "not suppoted!" + json.right.type;
        }
    }

}

/**
 * One of the public static function to parse the xml and return the json object.
 * @param xml
 */
function parseXMLToJson(xml) {
    var root = getRootNode(xml);
    return parseCollection(root, 1);
}

function getRootNode(xml) {
    if (!xml) {
        xml = '';
    }

    var xmlObject = new XML();
    xmlObject.setContent(xml);

    return xmlObject.getDocumentElement();
}

/**
 * To parse collection node
 * @param node
 * @returns
 */
function parseCollection(node) {
    var group = {
        logic: 'and'
    };
    if (node) {
        group.negative = node.getAttributeValue('negative');
        group.logic = node.getAttributeValue('logic');
        group.isGroup = true;
        group.children = [];
        iterateChildren(node, function(element) {
            var nodeName = element.getName();
            var child;

            if (nodeName == 'query') {
                child = parseQuery(element);
                group.children.push(child);
            } else if (nodeName == 'collection') { // in chrome, if there's an error while parsing, nodeName equals to 'parseerror'
                child = parseCollection(element);
                group.children.push(child);
            }
        });
    }
    return group;
}

function iterateChildren(xmlNode, childProcesser) {
    var element = "NOT Initilized";
    do {
        if (element == "NOT Initilized") {
            element = xmlNode.getFirstChildElement();
        } else {
            element = element.getNextSiblingElement();
        }
        if (element == null) {
            break;
        }

        childProcesser(element);

    } while (true);
}

/**
 * To parse query node
 * @param node
 * @returns
 */
function parseQuery(node) {
    var query = {};
    iterateChildren(node, function(element) {
        var nodeName = element.getName();
        if (nodeName == 'operand') {
            query.left = parseOperand(element);
        } else if (nodeName == 'operator') {
            query.operator = element.getAttributeValue('name');
        } else if (nodeName == 'value') {
            query.right = parseValue(element);
        }

    });
    return query;
}

/**
 * To parse operand node
 * @param node
 * @returns
 */
function parseOperand(node) {
    //Currently, there should be only one node inside.
    //But in future, we may support cross table, and there may be more nodes;
    return parseField(node.getFirstChildElement());
}

/**
 * To parse value node
 * @param node
 * @returns
 */
function parseValue(node) {
    var right = {};
    var type = node.getAttributeValue('type');
    var typeCaption = node.getAttributeValue('caption') || type;
    //Currently we support 4 kinds of types: CurrentRecord, Value, Variable, NULL
    switch (type) {
        case 'CurrentRecord':
        case 'SavedRecord':
            right = parseField(node.getFirstChildElement());
            break;
        case 'NULL':
            break;
        case 'Value':
            right.value = node.getValue();
            break;
        case 'Variable':
            right.value = node.getValue();
            break;
    }
    right.type = type;
    right.typeCaption = typeCaption;
    return right;
}

/**
 * To parse field node
 * @param node
 * @returns
 */
function parseField(node) {
    var field = {};
    field.value = node.getAttributeValue('name');
    field.caption = node.getAttributeValue('caption');
    var datatype = node.getAttributeValue('datatype');
    if (datatype) {
        field.datatype = datatype;
    }
    return field;
}

function getDescription(xml) {
    var queryObj = parseXMLToJson(xml);
    return parseJsonToDesc(queryObj);
}

function parseJsonToDesc(json) {

    var logical = " " + LOGICAL_Map[json.logic] + " ";
    var query = null;
    if (json.isGroup) {
        var notPrefix = (json.negative == "true") ? "not " : "";

        var i;
        for (i = 0; i < json.children.length; ++i) {
            var childQuery = parseJsonToDesc(json.children[i]);
            query = query ? (query + logical + childQuery) : childQuery;
        }
        if (!json.children || json.children.length == 0) {
            return "Always";
        }
        return notPrefix + "( " + query + " )";
    } else {
        return getUserFriendlyExpression(json);
    }

}

function getUserFriendlyExpression(QueryItem) {
    var expression = '{left}{operator}{right}';
    var left = (QueryItem.left.caption && QueryItem.left.caption != "") ? QueryItem.left.caption : QueryItem.left.value;
    var operator = ' ' + COMPARISON_Desc_Map[QueryItem.operator] + ' ';
    var right = getUFEOperand(QueryItem.right, QueryItem.left.datatype);

    expression = expression.replace('{left}', left);
    expression = expression.replace('{operator}', operator);
    expression = expression.replace('{right}', right);
    return expression;
}

function getUFEOperand(input, datatype) {
    if (input.type == "CurrentRecord" || input.type == "SavedRecord") {
        return ((input.caption && input.caption != "") ? input.caption : input.value) + ' in ' + input.typeCaption;
    } else if (input.type == 'Value' || input.type == 'NULL') {
        return encloseValueStr(input.value, datatype == "array" ? 'string' : datatype, true);
    } else {
        return input.value;
    }
}