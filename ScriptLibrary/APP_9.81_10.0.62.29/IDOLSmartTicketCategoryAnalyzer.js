/**
 * Analyze training document, category training terms. Give some hint about 
 * whether this document/term is important or not.
 */
var _ = lib.Underscore.require(),
    XQuery = lib.XQuery.require(),
    IDOLSmartTicketCompatible = lib.IDOLSmartTicketCompatible.require();

var CompatibleCodec = IDOLSmartTicketCompatible.name;

var IDOLSmartTicketCategoryAnalyzer = (function() {

  function CategoryAnalyzer(category, cfg) {
    this._category = category;
  }

  /**
   * Analyze the training relevance, training document should have high relevance
   * of its belonging category, otherwise this training document have negative
   * contribution, should be removed from category
   */
  CategoryAnalyzer.prototype.evaluateImportance = function(client, ref) {
    var currentCategory = this._category.getId();
    var database = this._category.getIDOLDatabaseName();
    var doc = client.executeAction({
      action: 'CategorySuggestFromDocument',
      AnyLanguage: true,
      DatabaseMatch: database,
      NumResults: 1,
      DocRef: ref
    });
    var hits = XQuery.query('responsedata/autn:hit', doc);
    var categories = _.map(hits, function(hit) {
      var category = XQuery.queryObject({
        id: 'autn:id',
        title: 'autn:title',
        weight: 'autn:weight',
        links: 'autn:links'
      }, hit);
      category.title = CompatibleCodec.decode(category.title);
      category.weight = parseFloat(category.weight);
      category.links = category.links.split(',');
      return category;
    });
    var category = _.find(categories, function(c) {
      return c.id === currentCategory.toString();
    });
    if (!category) { return null; }
    return category.weight;
  };

  return {
    create : function(category, cfg) {
      return new CategoryAnalyzer(category, cfg);
    }
  };
}());

function require() {
  return IDOLSmartTicketCategoryAnalyzer;
}