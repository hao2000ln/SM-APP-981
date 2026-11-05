/**
 * Some of process is not required in latest Smart Analytcis
 * but still need to run them in order to to keep backward compatible
 */
var _ = lib.Underscore.require();

var IDOLSmartTicketCompatible = (function() {

  function autoOptimizeCategorizer() {}

  var OLD_CODEC = {
    encode: encodeURIComponent,
    decode: decodeURIComponent
  };

  var NEW_CODEC = {
    encode: _.identity,
    decode: _.identity
  };

  return {
    optimize : autoOptimizeCategorizer,
    name : OLD_CODEC
  };
}());

function require() {
  return IDOLSmartTicketCompatible;
}