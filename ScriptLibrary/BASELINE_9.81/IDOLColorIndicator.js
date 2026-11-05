var _ = lib.Underscore.require();

var IDOLColorIndicator = (function() {

  var COLOR_CANDIDATES = [
    '#435057', '#767676', '#7298A5', '#005492', '#40A0D9', '#4E80D8',
    '#0E7987', '#00993A', '#ACB720', '#65B780', '#B57D00', '#EF9C22',
    '#C42F12', '#A53C3C', '#F1542F', '#E8816D', '#AD4DAB', '#832980',
    '#6443A7', '#8676A5'
  ];

  // function genRandomColor() {
  //   var color = '#'+Math.floor(Math.random() * 16777215).toString(16);
  //   return color.toUpperCase();
  // }

  function genRandomColor() {
    return _.sample(COLOR_CANDIDATES).toUpperCase();
  }

  function formatFieldValue(value) {
    return 'gs-' + value;
  }

  function populateColorIndicator(kmlib) {
    var indicator = new SCFile("colorindicatorsetting");
    var query = new QueryCond("file", EQ, "kmknowledgebase").and(new QueryCond("field", EQ, "kbname"));
    var rc = indicator.doSelect(query);
    if (rc !== RC_SUCCESS) {
      indicator["file"] = "kmknowledgebase";
      indicator["field"] = "kbname";
      indicator["apply.to.list"] = true;
      indicator["apply.to.detail"] = true;
    }
    var values = indicator.value || [];
    var fgcolors = indicator.fgcolor || [];
    var bgcolors = indicator.bgcolor || [];

    var name = formatFieldValue(kmlib.kbname);
    if (!_.contains(values, name)) {
      values.push(name);
      fgcolors.push('#FFFFFF');
      bgcolors.push(genRandomColor());

      indicator.value = values;
      indicator.fgcolor = fgcolors;
      indicator.bgcolor = bgcolors;

      indicator.doSave();
    }
  }
  return {
    populateColorIndicator : populateColorIndicator
  };
})();

function require() {
  return IDOLColorIndicator;
}