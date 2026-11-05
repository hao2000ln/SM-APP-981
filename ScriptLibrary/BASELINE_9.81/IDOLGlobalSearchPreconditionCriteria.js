/**
 * PURPOSE: 
 * Convert RAD sql into ast which can be recognized and execute in webtier side.
 *
 * e.g.
 * sql: field.name = "field.value"
 * 
 * convert above sql string into ast like:
 *
 *                  $eq
 *                /     \
 *            $field    $value
 *               |       |
 *       "field.name"   "field.value"
 *
 * serialize above ast into a JSON object and send it to webtier as the 
 * initialze settings. 
 *
 * When client side field value changed, it can calculate immediately can take 
 * corresponding action without communicate with server side.
 */
var _ = lib.Underscore.require();

var IDOLGlobalSearchPreconditionCriteria = (function() {

  var OPERATOR_MAPPING = {
    'and': '$and',
    'or': '$or',
    'not': '$not',
    '=': '$eq',
    '~=': '$neq',
    '>': '$gt',
    '>=': '$gte',
    '<': '$lt',
    '<=': '$lte',
    '#': '$sw',
    '~#': '$nsw',
    'isin': '$isin'
  };

  function compileExpression(ast) {
    var type = ast.NodeType();
    switch (type) {
      case 'ARRAY':
      case 'NUMBER':
      case 'STRING2':
      case 'BOOLEAN':
        // literal values
        return ['$value', ast.NodeValue()];
      case 'FIELD2':
        return ['$field', ast.NodeValue()];
      case 'OPERATOR':
        var op = _.trim(ast.OP());
        var opname = OPERATOR_MAPPING[op];
        if (!opname) {
          throw funcs.scmsg('invalid.operator', 'idol', [opname]);
        }

        var values = ast.NodeValue();
        values = _.map(values, compileExpression);
        values.unshift(opname);
        return values;
      default:
        // NOTE: other node type can be 'TIME'
        // its hard to handle time value, since it has to consider time 
        // format, timezone and l10n related problem
        throw funcs.scmsg('invalid.type', 'idol', [type, ast.NodeValue()]);
    }
  }

  return {
    compile: compileExpression
  };
}());

function require() {
  return IDOLGlobalSearchPreconditionCriteria;
}
