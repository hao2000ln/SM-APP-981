var _ = lib.Underscore.require();
var logger = getLog('IDOLQueryEditorEvaluator');
var _getFieldCaption = system.functions.get_field_caption;
var _getDataTypeStr = lib.QueryEditorParser.strLizeDataType;

function escapeValue(value) {
  if ( value === null || value === undefined )
    value = "";

  // when value equal boolean 'false', should return a string "false"
  value = value.toString();
  return lib.jsaci.encodeStringForFieldText(value);
}

function isTerminal(ast) {
  return _.contains(['TIME', 'NULL', 'NUMBER', 'STRING2', 'BOOLEAN', 'ARRAY'], ast.NodeType());
}

function strLizeDataType( smDataType )
{
  var ret = _getDataTypeStr(smDataType);
  if ( ret )
  {
    ret = ret.toUpperCase();
    if ( ret === 'STRING')
      ret = 'STRING2';
  }

  return ret;
}

function getNormalizedNodeValue(ast) {
  // make sure the terminal node appears at the first
  return _.chain(ast.NodeValue())
    .partition(isTerminal)
    .flatten()
    .compact()
    .value();
}

function convertToXML(ast, fileName) {
  var strXML = convertToXMLQuery(ast, fileName);
  if (strXML.substr(1, 11)!="<collection") strXML = '<collection logic=\'and\' negative=\'false\'> ' + strXML + ' </collection> ';

  return strXML;
}

function convertToXMLQuery(ast, fileName) {
  function toXMLQuery(ast, parentOP) {
    var type = ast.NodeType();

    switch(type) {
      case 'TIME': return system.functions.val(ast.NodeValue(), 2);
      case 'OPERATOR':
        var op = _.trim(ast.OP()),
          values = ast.NodeValue(),
          expressionConverter = function(ast) {
            return toXMLQueryWrapper(ast, op);
          };
        switch(op) {
          case 'and':
            if (parentOP=="and") return ' ' + _.chain(values).map(expressionConverter).compact().value().join(' ') + ' ';
            return ' <collection logic=\'and\' negative=\'false\'> ' + _.chain(values).map(expressionConverter).compact().value().join(' ') + ' </collection> ';
          case 'or':
            if (parentOP=="or") return ' ' + _.chain(values).map(expressionConverter).compact().value().join(' ') + ' ';
            return ' <collection logic=\'or\' negative=\'false\'> ' + _.chain(values).map(expressionConverter).compact().value().join(' ') + ' </collection> ';
          case 'not': return ' <collection logic=\'and\' negative=\'true\'> ' + toXMLQuery(values[0]) + ' </collection> ';

          // sm RAD functions
          case 'null':
          case '=':
          case '~=':
          case '>':
          case '>=':
          case '<':
          case '<=':
          case '#':
          case '~#':
          case 'like':
          case 'isin': return convertOperator(ast);

          default:
            throw new Error('cannot convert operator(' + op + ') into IDOL query');
        }
      case 'NULL':
      case 'NUMBER':
      case 'STRING2':
      case 'BOOLEAN':
      case 'FIELD2':
      case 'ARRAY': return ast.NodeValue();
      case 'LABEL':
      case 'RELATION':
      case 'OFFSET':
      case 'STRUCTURE':
      case 'EXPRESSION':
      case 'PSEUDOFIELD':
      case 'GLOBALVAR':
      case 'LOCALVAR':
        throw new Error("do not support convert " + type + " expression to IDOL query");
      default:
        throw new Error("unknown expression type: " + type);
    }
  }

  function toXMLQueryWrapper(ast, parentOP) {
    if (!ast) return "";

    try {
      return toXMLQuery(ast, parentOP);
    } catch(e) {
      logger.warn(e);
      return null;
    }
  }

  var toFieldValue = _.compose(escapeValue, toXMLQuery);

  function toFieldName(ast, dataType) {
    var type = ast.NodeType();
    if (type !== 'FIELD2')
      throw new Error(type + " is not a valid field name");

    var fieldname = toXMLQuery(ast);
    dataType = dataType || "string";

    return "<operand><field name='" + fieldname + "' caption='" + _.escape(_getFieldCaption(fieldname, fileName)) + "' datatype='" + dataType + "'/></operand>";
  }

  function generateEqualQuery(value, op, ast) {
    if (ast.NodeType() === 'OPERATOR') {
      switch(_.trim(ast.OP())) {
        case 'nullsub':
          var args = ast.NodeValue(), match = toFieldValue(value), alternative = toFieldValue(args[1]);
          if (match === alternative) {
            return '(' + [ 'MATCH{' + match + '}:' + toFieldName(args[0]), 'EMPTY{}:' + toFieldName(args[0]) ].join(' OR ') + ')';
          } else {
            return 'MATCH{' + match + '}:' + toFieldName(args[0]);
          }
      }
    }
    var type = value.NodeType();

    switch(type) {
      case 'NULL': return '<query>' + toFieldName(ast, "string") + ' <operator name=\'equals\' caption=\'Equals\'/><value type=\'NULL\' caption=\'Blank/NULL\'></value></query>';
      case 'NUMBER': return '<query>' + toFieldName(ast, "number") + ' <operator name=\'equals\' caption=\'Equals\'/><value type=\'Value\' caption=\'Value\'><![CDATA[' + toFieldValue(value) + ']]></value></query> ';
      case 'BOOLEAN': return '<query>' + toFieldName(ast, "boolean") + ' <operator name=\'equals\' caption=\'Equals\'/><value type=\'Value\' caption=\'Value\'><![CDATA[' + toFieldValue(value) + ']]></value></query> ';
      case 'STRING2': return '<query>' + toFieldName(ast, "string") + ' <operator name=\'equals\' caption=\'Equals\'/><value type=\'Value\' caption=\'Value\'><![CDATA[' + toFieldValue(value) + ']]></value></query> ';
      default: throw new Error("cannot apply = onto " + type);
    }
  }

  function generateNotEqualQuery(value, op, ast) {
    var type = value.NodeType();
    switch(type) {
      case 'NULL': return  '<query>' + toFieldName(ast, "string") + ' <operator name=\'neq\' caption=\'Not Equals\'/><value type=\'NULL\' caption=\'Blank/NULL\'></value></query> ';
      case 'NUMBER': return '<query>' + toFieldName(ast, "number") + ' <operator name=\'neq\' caption=\'Not Equals\'/><value type=\'Value\' caption=\'Value\'><![CDATA[' + toFieldValue(value) + ']]></value></query> ';
      case 'BOOLEAN': return '<query>' + toFieldName(ast, "boolean") + ' <operator name=\'neq\' caption=\'Not Equals\'/><value type=\'Value\' caption=\'Value\'><![CDATA[' + toFieldValue(value) + ']]></value></query> ';
      case 'STRING2': return '<query>' + toFieldName(ast, "string") + ' <operator name=\'neq\' caption=\'Not Equals\'/><value type=\'Value\' caption=\'Value\'><![CDATA[' + toFieldValue(value) + ']]></value></query> ';
      default: throw new Error("cannot apply ~= onto " + type);
    }
  }

  function generateGTQuery(value, op, ast) {
    var type = value.NodeType();
    switch(type) {
      case 'NUMBER' : return '<query>' + toFieldName(ast, "number") + ' <operator name=\'gt\' caption=\'Greater Than\'/><value type=\'Value\' caption=\'Value\'><![CDATA[' + toFieldValue(value) + ']]></value></query> ';
      case 'TIME': return '<query>' + toFieldName(ast, "datetime") + ' <operator name=\'gt\' caption=\'Greater Than\'/><value type=\'Value\' caption=\'Value\'><![CDATA[' + toFieldValue(value) + ']]></value></query> ';
      default: throw new Error("cannot apply > onto " + type);
    }
  }

  function generateGETQuery(value, op, ast) {
    var type = value.NodeType();
    switch(type) {
      case 'NUMBER' : return '<query>' + toFieldName(ast, "number") + ' <operator name=\'get\' caption=\'Greater Than Or Equals\'/><value type=\'Value\' caption=\'Value\'><![CDATA[' + toFieldValue(value) + ']]></value></query> ';
      case 'TIME': return '<query>' + toFieldName(ast, "datetime") + ' <operator name=\'get\' caption=\'Greater Than Or Equals\'/><value type=\'Value\' caption=\'Value\'><![CDATA[' + toFieldValue(value) + ']]></value></query> '
      default: throw new Error("cannot apply >= onto " + type);
    }
  }

  function generateLTQuery(value, op, ast) {
    var type = value.NodeType();
    switch(type) {
      case 'NUMBER' : return '<query>' + toFieldName(ast, "number") + ' <operator name=\'lt\' caption=\'Less Than\'/><value type=\'Value\' caption=\'Value\'><![CDATA[' + toFieldValue(value) + ']]></value></query> ';
      case 'TIME': return '<query>' + toFieldName(ast, "datetime") + ' <operator name=\'lt\' caption=\'Less Than\'/><value type=\'Value\' caption=\'Value\'><![CDATA[' + toFieldValue(value) + ']]></value></query> '
      default: throw new Error("cannot apply < onto " + type);
    }
  }

  function generateLETQuery(value, op, ast) {
    var type = value.NodeType();
    switch(type) {
      case 'NUMBER' : return '<query>' + toFieldName(ast, "number") + ' <operator name=\'let\' caption=\'Less Than Or Equals\'/><value type=\'Value\' caption=\'Value\'><![CDATA[' + toFieldValue(value) + ']]></value></query> ';
      case 'TIME': return '<query>' + toFieldName(ast, "datetime") + ' <operator name=\'let\' caption=\'Less Than Or Equals\'/><value type=\'Value\' caption=\'Value\'><![CDATA[' + toFieldValue(value) + ']]></value></query> '
      default: throw new Error("cannot apply <= onto " + type);
    }
  }

  function generateStartWithQuery(value, op, ast) {
    var type = value.NodeType();
    switch(type) {
      case 'NULL': return '<query>' + toFieldName(ast, "string") + ' <operator name=\'equal\' caption=\'Equal\'/><value type=\'NULL\' caption=\'Blank/NULL\'></value></query>';
      case 'STRING2': return '<query>' + toFieldName(ast, "string") + ' <operator name=\'startswith\' caption=\'Starts With\'/><value type=\'Value\' caption=\'Value\'><![CDATA[' + toFieldValue(value) + ']]></value></query> ';

      case 'NUMBER' :
      case 'BOOLEAN':
        return generateEqualQuery(value, op, ast);

      default: throw new Error("cannot apply # onto " + type);
    }
  }

  function generateNotStartWithQuery(value, op, ast) {
    var ret = "<collection logic='or' negative='true'>";
    ret += generateStartWithQuery(value, op, ast);
    ret += "</collection>";
    return ret;
  }

  function generateLikeQuery(value, op, ast) {
    var type = value.NodeType();
    switch(type) {
      case 'NULL': return '<query>' + toFieldName(ast, "string") + ' <operator name=\'equal\' caption=\'Equal\'/><value type=\'NULL\' caption=\'Blank/NULL\'></value></query>';
      case 'STRING2': return '<query>' + toFieldName(ast, "string") + ' <operator name=\'startswith\' caption=\'Starts With\'/><value type=\'Value\' caption=\'Value\'><![CDATA[' + toFieldValue(value) + ']]></value></query> ';
      default: throw new Error("cannot apply Like onto " + type);
    }
  }

  function generateNullFunctionQuery(value, op, ast) {
    var type = value.NodeType();
    switch(type) {
      case 'NULL': return '<query>'    + toFieldName(ast, "string")  + ' <operator name=\'equal\' caption=\'Equal\'/><value type=\'NULL\' caption=\'Blank/NULL\'></value></query>';
      case 'NUMBER': return '<query>'  + toFieldName(ast, "number")  + ' <operator name=\'equal\' caption=\'Equal\'/><value type=\'NULL\' caption=\'Blank/NULL\'></value></query> ';
      case 'BOOLEAN': return '<query>' + toFieldName(ast, "boolean") + ' <operator name=\'equal\' caption=\'Equal\'/><value type=\'NULL\' caption=\'Blank/NULL\'></value></query> ';
      case 'STRING2': return '<query>' + toFieldName(ast, "string")  + ' <operator name=\'equal\' caption=\'Equal\'/><value type=\'NULL\' caption=\'Blank/NULL\'></value></query> ';
      default: throw new Error("cannot apply null onto " + type);
    }
  }

  function generateIsInQuery(value, op, ast) {
    var options = toXMLQuery(value);

    // if the option is empty, then just it's a NULL() query
    if ( !options || options.length <= 0 )
      return generateNullFunctionQuery(value, op, ast);

    var type = value.NodeType();
    var ret = "<collection logic='or' negative='false'>";

    if ( type && type === 'ARRAY' )
      type = strLizeDataType(system.functions.type(options[0]));

    for ( var i = 0; i < options.length; i++ )
    {
      var item = "";
      switch(type) {
        case 'NULL':    item = '<query>' + toFieldName(ast, "string") + ' <operator name=\'equals\' caption=\'Equals\'/><value type=\'NULL\' caption=\'Blank/NULL\'></value></query> '; break;
        case 'NUMBER':  item = '<query>' + toFieldName(ast, "number") + ' <operator name=\'equals\' caption=\'Equals\'/><value type=\'Value\' caption=\'Value\'><![CDATA[' + options[i] + ']]></value></query> '; break;
        case 'BOOLEAN': item = '<query>' + toFieldName(ast, "boolean") + ' <operator name=\'equals\' caption=\'Equals\'/><value type=\'Value\' caption=\'Value\'><![CDATA[' + options[i] + ']]></value></query> '; break;
        case 'STRING2': item = '<query>' + toFieldName(ast, "string") + ' <operator name=\'equals\' caption=\'Equals\'/><value type=\'Value\' caption=\'Value\'><![CDATA[' + options[i] + ']]></value></query> '; break;

        default:
          throw new Error("cannot apply isin onto " + type);
      }

      ret += item + " ";
    }

    ret += " </collection> ";

    return ret;
  }

  var GENERATOR_TABLE = {
    '='    : generateEqualQuery,
    '~='   : generateNotEqualQuery,
    '>'    : generateGTQuery,
    '>='   : generateGETQuery,
    '<'    : generateLTQuery,
    '<='   : generateLETQuery,
    '#'    : generateStartWithQuery,
    '~#'   : generateNotStartWithQuery,
    'like' : generateLikeQuery,
    'isin' : generateIsInQuery,
    'null' : generateNullFunctionQuery
  };

  function generateXMLQuery(l, op, ast) {
    if (!isTerminal(l) && op !== 'null') {
      throw new Error('cannot evaluate L-attributes from "' + l.NodeType() + '" of ' + op);
    }

    var generator = GENERATOR_TABLE[op];
    if (!generator) {
      throw new Error("unsupported operator (" + op + ")");
    }
    return generator(l, op, ast);
  }

  function convertOperator(ast) {
    // Use L-attributed SDD to genenate IDOL query
    var values = getNormalizedNodeValue(ast),
      op = _.trim(ast.OP()),
      l = values[0], // inherited attribute from its sibling
      n = values[1];
    return generateXMLQuery(l, op, n);
  }

  var query = toXMLQueryWrapper(ast);
  // sm true search shouldn't return any criteria
  // for false query, just return 'false' query string,
  // like 'FieldText=false', nothing will return in IDOL side
  if (_.isBoolean(query)) {
    return query === true ? '' : 'false';
  }
  return (query || '').toString();
}
