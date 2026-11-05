/**
 * Not recommand to use, this feature is used to keep compatible with existing
 * behavior, and it doesn't work well in real world
 *
 * This optimization process is base on following assumption:
 * 1. All the term defined in test sample are correct
 * 2. When test sample term matches category terms, assume these terms are correct
 * 3. Enlarge these `correct` term to make them as dominant ones in category definition.
 *
 * Problems:
 * 1. In real world, the test sample can also be bad, enlarge `bad` term weight
 *    can lead to even worse result
 * 2. Adjust term weight is not recommend, because once term weight was modified, 
 *    it will always keep that way, even we introduced more training sample.
 */
var _ = lib.Underscore.require();

var IDOLSmartTicketCategorizerOptimizationEnlargePositiveTerms = (function() {
  function TermWeightOptmization(client, cfg) {
    this._client = client;
    this._cfg = cfg;
  }

  TermWeightOptmization.prototype.optimize = function(categorizer) {

  };

  return {
    create : function(client, cfg) {
      return new TermWeightOptmization(client, cfg);
    }
  };
}());

function require() {
  return IDOLSmartTicketCategorizerOptimizationEnlargePositiveTerms;
}