var _ = lib.Underscore.require(),
    IDOLCommon = lib.IDOLCommon.require(),
    scmsg = funcs.scmsg;;

var IDOLHTMLBuilder = (function() {

  function getResource(name, version) {
    var query = new QueryCond('name', EQ, name);
    if (version) query = query.and(new QueryCond('version', EQ, version));

    var resource = new Query('idolwebresources', query)[0];
    if (resource) {
      return resource.min || resource.raw;
    }
    throw new Error('cannot find web resource (name:' + name + ', version:' + version + ')');
  }

  function jsonify(jsonstr) {
    return jsonstr ? jsonstr.replace(/<\//g, '<\\/') : jsonstr;
  }

  var html_template = getResource('IDOL_TOPICMAP_TEMPLATE'),
      topicmap_style = getResource('IDOL_TOPICMAP_STYLE'),
      d3_compact_script = getResource('IDOL_TOPICMAP_D3_COMPACT'),
      topicmap_script = getResource('IDOL_TOPICMAP_SCRIPT');
  
  var MESSAGES = {
    selectall : scmsg(1014, 'idol'),
    maximize : scmsg(1024, 'idol')
  };

  var template = _.template(html_template);
  
  function applyTemplate(variables, actions) {
    // all variable value should be a string;
    var data = _.map(variables, function(value, name) {
      return 'var ' + name  + ' = ' + jsonify(value) + ';';
    }).join('\n');

    var model = {
      title : IDOLCommon.FEATURES_DISPLAY.HTA,
      styles : [ topicmap_style ],
      scripts : [ d3_compact_script, topicmap_script ],
      variable : data,
      messages : MESSAGES,
      actions : actions
    };
    return template(model);
  }

  return {
    applyTemplate : applyTemplate
  }
})();

function require() {
  return IDOLHTMLBuilder;
}