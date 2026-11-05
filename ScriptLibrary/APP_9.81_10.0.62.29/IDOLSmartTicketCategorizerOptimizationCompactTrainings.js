/**
 * By default the training samples were selected randomly, and doesn't have any
 * guarantee on data quality. 
 * These chosen training sample may have negative contribution on its categorization.
 *
 * This optimization process is base on following assumption:
 * 1. The training sample MUST have some relationship with its training category
 * 2. The trained category SHOULD be able to be suggested out when using this 
 *    training sample as input
 * 3. Tuning records are ignored, since tuning records are added by business
 *    export, there perspective is more important
 */
var _ = lib.Underscore.require(),
    XQuery = lib.XQuery.require();

var IDOLSmartTicketCategorizerOptimizationCompactTrainings = (function() {

  function CompactOptimization(client, cfg) {
    this._client = client;
    this._cfg = cfg || {};
  }

  CompactOptimization.prototype.optimizeCategory = function(category) {
    var refs = category.getTrainingDocumentRefs();
  };

  CompactOptimization.prototype.optimize = function(categorizer) {
    var collection = categorizer.getTrainedCategory();
    collection.each(this.optimizeCategory, this);
  };

  return {
    create : function(client, cfg) {
      return new CompactOptimization(client, cfg);
    }
  };
}());


function require() {
  return IDOLSmartTicketCategorizerOptimizationCompactTrainings;
}