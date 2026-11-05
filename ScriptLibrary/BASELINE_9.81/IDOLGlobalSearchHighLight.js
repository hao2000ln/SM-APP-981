var _ = lib.Underscore.require();

var IDOLGlobalSearchHighLight = (function() {

  function highlightWords(raw) {
    var escaped = _.escape(raw);
    // used to output html
    return escaped.replace(/&lt;_em_&gt;/g, '<em>')
                  .replace(/&lt;\/_em_&gt;/g, '</em>');
  }

  return {
    // used in IDOL action command
    START_TAG : '<_em_>',
    END_TAG : '</_em_>',
    escape : highlightWords
  };
}());

function require() {
  return IDOLGlobalSearchHighLight;
}