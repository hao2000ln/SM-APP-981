var _ = lib.Underscore.require(),
    IDOLCommon = lib.IDOLCommon.require();

var logger = getLog('IDOLHTAQueryEvaluator');

var IDOLHTAQueryEvaluator = (function() {
  var MAX_FIELD_VALUE_LENGTH = 999;

  function collectQueryFieldNames(ast) {
    var type = ast.NodeType();
    switch(type) {
      case 'FIELD2': return [ ast.NodeValue() ];
      case 'OPERATOR': return _.reduce(ast.NodeValue(), function(memo, ast) {
        return memo.concat(collectQueryFieldNames(ast));
      }, []);
      case 'NULL':
      case 'NUMBER':
      case 'STRING2':
      case 'TIME':
      case 'BOOLEAN':
      case 'ARRAY':
      case 'LABEL':
      case 'RELATION':
      case 'OFFSET':
      case 'STRUCTURE':
      case 'EXPRESSION':
      case 'PSEUDOFIELD':
      case 'GLOBALVAR':
      case 'LOCALVAR': return []; // do nothing
      default: throw new Error("unknown expression type: " + type);
    }
  }

  var escapeValue = IDOLCommon.escapeFieldTextValue;

  function isTerminal(ast) {
    return _.contains(['TIME', 'NULL', 'NUMBER', 'STRING2', 'BOOLEAN', 'ARRAY'], ast.NodeType());
  }

  function getNormalizedNodeValue(ast) {
    // make sure the termial node appears at the first
    return _.chain(ast.NodeValue())
      .partition(isTerminal)
      .flatten()
      .compact()
      .value();
  }

  function convertToIDOLQuery(ast, fallback, mapping, filename) {
    var fkm = new SCFile("kmknowledgebase");
    var count = fkm.doCount('sclibtablename="'+filename+'"');
    var bfound = false;
    var rc = 0;
    if(count > 1 && filename == "rootcause")
    {
      //root cause known error
      rc = fkm.doSelect('sclibtablename="'+filename+'"');
      var evfile = new SCFile("rootcause");
      evfile.isKnownError=true;
      while(rc == RC_SUCCESS)
      {
         if(!funcs.evaluate_query(fkm.scquery, evfile))
         {
           bfound = true;
           break;
         }
         rc = fkm.getNext();
      }
    }
    else
    {
      rc = fkm.doSelect('sclibtablename="'+filename+'"');
      if(rc == RC_SUCCESS)
      {
        bfound = true;
      }
    }
      
    mapping = mapping || IDOLCommon.toIDOLFieldName;

    function toIDOLQuery(ast, fallback) {
      var type = ast.NodeType();
      switch(type) {
        // Epoch seconds (seconds since January first 1970).
        case 'TIME': return Math.round(ast.NodeValue().getTime() / 1000) + 'e';
        case 'OPERATOR':
          var op = _.trim(ast.OP()),
            values = ast.NodeValue(),
            expressionConverter = function(ast) {
              return toIDOLQueryWrapper(ast, fallback);
            };
          switch(op) {
            case 'and': return _.chain(values).map(expressionConverter).compact().value().join(' AND ');
            case 'or':  return '(' + _.chain(values).map(expressionConverter).compact().value().join(' OR ') + ')';
            case 'not': return 'NOT (' + toIDOLQuery(values[0], fallback) + ')';

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
    
    function getIDOLFieldName(knowledgeBase,field) {
    //print("getIDOLFieldName called with:"+field);
    var jsname = lib.KMUtils.scToJSName(field);
    var REF_PREFIX = '_DN_';
    var KMIDOLUtils = lib.KMIDOLUtils.require();
    var indexFieldSet = KMIDOLUtils.getIndexFieldSet(knowledgeBase);

    var indexFields = indexFieldSet.indexFields;
    var indexfType = indexFieldSet.indexfType;
    var indexfAlias = indexFieldSet.indexfAlias;
    var indexWeights = indexFieldSet.indexWeights;
    var isMatch = indexFieldSet.isMatch;
    
    var numfields = knowledgeBase.kbfields.length();
    for (var i = 0; i< numfields; i++)
    {
         
            if(indexFields[i] != jsname)
            {
              continue;
            }
        
            var weight = indexWeights[i];
            var strField = jsname;
            if (indexfAlias[i] && indexfAlias[i].toUpperCase() == 'TITLE' && weight > -1){  
               weight = -1;
            }
            if (indexfType[i] === 'Date' && strField.match(/_date$/g) == null){
               strField += '_DATE';
            }
            if(isMatch[i])
            {
               strField += "_MATCH";
            }
            else
            {
               strField += KMIDOLUtils.getFieldPostfix(weight);
            }
            if (indexfType[i] == 'Reference' )
            {
               strField = strField+":"+REF_PREFIX+strField;
            }
            strField = strField.toUpperCase();
            return strField;

        } 
        
        return field;
   }
    function toIDOLQueryWrapper(ast, fallback) {
      if (!ast) return "";

      try {
        return toIDOLQuery(ast, fallback);
      } catch(e) {
        // when convert error happend, just ignore this expression, 
        // and fallback to naive security restrict method:
        //   do IDOL query summary, and filter out the ticket which current
        //   user don't have privilege to view it
        logger.warn(e);
        return _.isFunction(fallback) ? fallback(ast, e) : null;
      }
    }

    var toFieldValue = _.compose(escapeValue, toIDOLQuery);

    function toFieldName(ast) {
      var type = ast.NodeType();
      if (type !== 'FIELD2')
        throw new Error(type + " is not a valid field name");

      var fieldname = toIDOLQuery(ast);
      if(fieldname && bfound)
      {
         fieldname = getIDOLFieldName(fkm ,fieldname);
      }
      if(filename)
      {
        return mapping(fieldname,filename);
      }
      else
      {
        return mapping(fieldname);
      }
    }

    function generateEqualQuery(value, op, ast) {
      if (ast.NodeType() === 'OPERATOR') {
        switch(_.trim(ast.OP())) {
          case 'lng':
            var length = parseInt(toFieldValue(value)), args = ast.NodeValue();
            return 'LENGTH{' + length + ',' + length + '}:' + toFieldName(args[0]);
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
        case 'NULL': return 'EMPTY{}:' + toFieldName(ast);
        case 'NUMBER': return 'EQUAL{' + toFieldValue(value) + '}:' + toFieldName(ast);
        case 'BOOLEAN':
        case 'STRING2':return 'MATCH{' + toFieldValue(value) + '}:' + toFieldName(ast);
        default: throw new Error("cannot apply = onto " + type);
      }
    }

    function generateNotEqualQuery(value, op, ast) {
      if (ast.NodeType() === 'OPERATOR' && _.trim(ast.OP()) === 'lng') {
        var length = parseInt(toFieldValue(value)), args = ast.NodeValue();
        return '(' +
          [
            'LENGTH{0,' + (length - 1) + '}:' + toFieldName(args[0]),
            'LENGTH{' + (length + 1) + ',' + MAX_FIELD_VALUE_LENGTH + '}:' + toFieldName(args[0])
          ].join(' OR ')
          + ')';
      }

      var type = value.NodeType();
      switch(type) {
        case 'NULL': return 'EXISTS{}:' + toFieldName(ast);
        case 'NUMBER': return 'NOT EQUAL{' + toFieldValue(value) + '}:' + toFieldName(ast);
        case 'BOOLEAN':
        case 'STRING2': return 'NOT MATCH{' + toFieldValue(value) + '}:' + toFieldName(ast);
        default: throw new Error("cannot apply ~= onto " + type);
      }
    }

    function generateGTQuery(value, op, ast) {
      if (ast.NodeType() === 'OPERATOR' && _.trim(ast.OP()) === 'lng') {
        var length = parseInt(toFieldValue(value)), args = ast.NodeValue();
        return 'LENGTH{' + (length + 1) + ',' + MAX_FIELD_VALUE_LENGTH + '}:' + toFieldName(args[0]);
      }

      var type = value.NodeType();
      switch(type) {
        case 'NUMBER' : return 'GREATER{' + toFieldValue(value) + '}:' + toFieldName(ast);
        case 'TIME': return 'RANGE{>' + toFieldValue(value) + ',.}:' + toFieldName(ast);
        default: throw new Error("cannot apply > onto " + type);
      }
    }

    function generateGEQuery(value, op, ast) {
      if (ast.NodeType() === 'OPERATOR' && _.trim(ast.OP()) === 'lng') {
        var length = parseInt(toFieldValue(value)), args = ast.NodeValue();
        return 'LENGTH{' + length + ',' + MAX_FIELD_VALUE_LENGTH + '}:' + toFieldName(args[0]);
      }

      var type = value.NodeType();
      switch(type) {
        case 'NUMBER' : return 'GREATER{=' + toFieldValue(value) + '}:' + toFieldName(ast);
        case 'TIME': return 'RANGE{' + toFieldValue(value) + ',.}:' + toFieldName(ast);
        default: throw new Error("cannot apply >= onto " + type);
      }
    }

    function generateLTQuery(value, op, ast) {
      if (ast.NodeType() === 'OPERATOR' && _.trim(ast.OP()) === 'lng') {
        var length = toFieldValue(value), args = ast.NodeValue();
        return 'LENGTH{0,' + (length - 1) + '}:' + toFieldName(args[0]);
      }

      var type = value.NodeType();
      switch(type) {
        case 'NUMBER' : return 'LESS{' + toFieldValue(value) + '}:' + toFieldName(ast);
        case 'TIME': return 'RANGE{.,<' + toFieldValue(value) + '}:' + toFieldName(ast);
        default: throw new Error("cannot apply < onto " + type);
      }
    }

    function generateLEQuery(value, op, ast) {
      if (ast.NodeType() === 'OPERATOR' && _.trim(ast.OP()) === 'lng') {
        var length = toFieldValue(value), args = ast.NodeValue();
        return 'LENGTH{0,' + length + '}:' + toFieldName(args[0]);
      }
      var type = value.NodeType();
      switch(type) {
        case 'NUMBER' : return 'LESS{=' + toFieldValue(value) + '}:' + toFieldName(ast);
        case 'TIME': return 'RANGE{.,' + toFieldValue(value) + '}:' + toFieldName(ast);
        default: throw new Error("cannot apply <= onto " + type);
      }
    }
    function removeWildChar(value)
    {
      if(!value)return value;
      var i = value.lastIndexOf('*');
      while(i >=0 && value && value.length>0 && i == value.length -1)
      {
        value = value.substring(0, i)
        i = value.lastIndexOf('*');
      }
      return value;
    }
    function generateStartWithQuery(value, op, ast) { return 'WILD{' + removeWildChar(toFieldValue(value)) + '*}:' + toFieldName(ast); }
    function generateNotStartWithQuery(value, op, ast) { return 'NOT WILD{' + removeWildChar(toFieldValue(value)) + '*}:' + toFieldName(ast); }
    function generateLikeQuery(value, op, ast) { return 'WILD{' + toFieldValue(value) + '}:' + toFieldName(ast); }
    function generateNullFunctionQuery(field, op) { return 'EMPTY{}:' + toFieldName(field); }
    function generateIsInQuery(value, op, ast) {
      var options = toIDOLQuery(value);
      //return 'MATCH{' + _.map(options, escapeValue).join(',')  + '}:' + toFieldName(ast);
      return 'TERMEXACT{' + _.map(options, escapeValue).join(',')  + '}:' + toFieldName(ast);
    }

    var GENERATOR_TABLE = {
      '='    : generateEqualQuery,
      '~='   : generateNotEqualQuery,
      '>'    : generateGTQuery,
      '>='   : generateGEQuery,
      '<'    : generateLTQuery,
      '<='   : generateLEQuery,
      '#'    : generateStartWithQuery,
      '~#'   : generateNotStartWithQuery,
      'like' : generateLikeQuery,
      'isin' : generateIsInQuery,
      'null' : generateNullFunctionQuery
    };

    function generateIDOLQuery(l, op, ast) {
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
      return generateIDOLQuery(l, op, n);
    }

    var query = toIDOLQueryWrapper(ast, fallback);
    // sm true search shouldn't return any criteria
    // for false query, just return 'false' query string, 
    // like 'FieldText=false', nothing will return in IDOL side
    if (_.isBoolean(query)) {
      return query === true ? '' : 'false';
    }
    return (query || '').toString();
  }

  function collectFieldNames(ast) {
    var fields = collectQueryFieldNames(ast);
    return _.uniq(fields);
  }

  return {
    collectFieldNames : collectFieldNames,
    convertToIDOLQuery : convertToIDOLQuery
  };
})();

function require() {
  return IDOLHTAQueryEvaluator;
}
