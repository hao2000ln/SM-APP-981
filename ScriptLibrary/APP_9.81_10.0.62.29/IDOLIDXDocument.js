var _ = lib.Underscore.require(),
    JSON = lib.JSON.json();

var logger = getLog('IDOLIDXDocument');

var IDOLIDXDocument = (function() {
  
  var IDOL_DOC_TEMPLATE = [
    '#DREREFERENCE <%= model.reference %>\n',

    '<% _.each(model.properties, function(value, key) { %>',
    '#DREFIELD <%= key.toUpperCase() %>="<%= value %>"\n',
    '<% }) %>',

    '<% _.each(model.refProperties, function(value, key) { %>',
    '#DREFIELD <%= key.toUpperCase() %>="<%= value %>"\n',
    '<% }) %>',

    '<% _.each(model.tags, function(value, key) { %>',
    '#DREFIELD <%= key.toUpperCase() %>="<%= value %>"\n',
    '<% }) %>',

    '<% if (model.date) { %>',
    '#DREDATE <%= model.date %>\n',
    '<% } %>',

    '#DRETITLE\n',
    '<%= model.title %>\n',
 
    '#DRECONTENT\n',
    '<% _.each(model.contents, function(content) { %>',
    '<%= content %>\n',
    '<% }) %>',

    '#DREENDDOC'
  ].join('');
  
  var template = _.template(IDOL_DOC_TEMPLATE);
  
  /**
   * Convert SCFile into IDOL index document style
   * 
   * The IDOL document field spec is like below:
   * spec = {
   *   keys: ["key1", "key2"],
   *   timefield : "tfield",
   *   titlefield : "tfield2",
   *   propertyfields : ["pfields1", "pfields2", ...],
   *   sourcefields : ["sfields1", "sfields2", ...],
   *   tagfields : {
   *     "fieldname" : "fieldvalue",
   *     ...
   *   }
   * }
   */
  function convertToIDOLDocument(model) {
    
    var doc = template({model : model});
    logger.debug('indexing document: ' + model.reference);
    
    if (logger.isTraceEnabled()) {
      logger.trace(JSON.stringify(model, null, ' '));
      logger.trace('generating idx: \n' + doc);
    }
    return doc;
  }
  
  return {
    convert : convertToIDOLDocument
  };
}());

function require() {
  return IDOLIDXDocument;
}
