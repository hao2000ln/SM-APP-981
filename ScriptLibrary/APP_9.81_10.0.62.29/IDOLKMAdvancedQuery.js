var _ = lib.Underscore.require(),
    KMQuery = lib.KMQuery;

var IDOLKMAdvancedQuery = (function() {

  function wordSegment(word) {
    if( word) {
      word = _.trim(word);
      word = KMQuery.compressWhiteSpace(word);
      var words = word.split(" ");

      if(words.length <= 1 )
        words = word.split(",");

      if(words.length > 0) {
        return words;
      }
    }
    return [];
  }

  function advancedFilter(fKMQuery) {
    var buff=[];
    var allWords = processAllWords(fKMQuery.allwords);
    if (allWords) {
      buff.push(allWords);
    }

    var anyWords = processAnyWords(fKMQuery.anywords);
    if (anyWords) {
      buff.push(anyWords);
    }

    var exactPhrase = processExactPhrase(fKMQuery.exactphrase);
    if (exactPhrase) {
      buff.push(exactPhrase);
    }

    var noneWords = processNoneWords(fKMQuery.nonewords);
    if (noneWords) {
      buff.push(noneWords);
    }

    return buff.join(' AND ');
  }

  function processNoneWords( wordStr ) {
    var words = wordSegment(wordStr);
    return _.isEmpty(words) ? '' : "NOT(" + words.join(' ') + ")";
  }

  function processAllWords(allWords) {
    var words = wordSegment(allWords);
    return _.isEmpty(words) ? '' : "(" + words.join(' AND ') + ")";
  }

  function processAnyWords(anyWords) {
    var words = wordSegment(anyWords);
    return _.isEmpty(words) ? '' : "(" + words.join(' OR ') + ")";
  }

  function processExactPhrase(exactPhrase) {
    if( exactPhrase) {
        exactPhrase = _.trim(exactPhrase);
        exactPhrase = exactPhrase.replace(/[\"]/g, " "); //make sure there are not quotes.
        return KMQuery.parsePhrases("\"" + exactPhrase.toLowerCase() + "\"");
    }
    return '';
  }

  return {
    advancedFilter : advancedFilter
  }
})();

function require() {
  return IDOLKMAdvancedQuery;
}