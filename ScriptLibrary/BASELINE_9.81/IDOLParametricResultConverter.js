var _ = lib.Underscore.require(),
    XQuery = lib.XQuery.require(),
    IDOLGlobalSearchReplica = lib.IDOLGlobalSearchReplica.require(),
    IDOLGlobalSearchDisplayValue = lib.IDOLGlobalSearchDisplayValue.require();

var IDOLParametricResultConverter = (function() {
  function convertParametricResults(doc, kmquery) {
    var criteria = kmquery.criteria;
    var field = criteria['__field__'];
    var filename = field.filename, fieldname = field.fieldname;

    var nodes = XQuery.query('responsedata/autn:field/autn:value', doc);
    var values = _.map(nodes, function(node) {
      var value = node.getText(),
          count = node.getAttributeValue('count');

      var text = IDOLGlobalSearchDisplayValue.toDisplay(filename, fieldname, value);
      var replica = IDOLGlobalSearchReplica.getReplica();
      count = Math.floor(count / replica);

      return {
        text : text,
        value : value,
        count : count
      };
    });
    return values;
  }

  function getTotal(doc) {
    var total = XQuery.queryText('responsedata/autn:field/autn:total_values', doc);
    return parseInt(total) || 0;
  }

  function convert(doc, kmquery) {
    var values = convertParametricResults(doc, kmquery);
    var total = getTotal(doc);
    return { 
      data : values,
      total : total
    };
  }

  return {
    convert : convert
  };
}());

function require() {
  return IDOLParametricResultConverter;
}