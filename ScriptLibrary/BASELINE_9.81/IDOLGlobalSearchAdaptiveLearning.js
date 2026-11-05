var _ = lib.Underscore.require(),
    str = _.str;

var IDOLGlobalSearchAdaptiveLearning = (function() {

  function increaseAdaptiveLearning(record, query) {
    var phrases = record.phrasecount, i, length;

    for (i = 0, length = phrases.length(); i < length; i++) {
      var line = phrases[i];
      // already exists, increase count exit
      if (line.phrase === query) {
        // line.count is a function, use index name instead
        line[1] += 1;
        record.doSave();
        return;
      }
    }

    var newphrase = new SCDatum();
    newphrase.setType(9);
    newphrase.push(query);
    newphrase.push(1);
    phrases.push(newphrase);

    record.doSave();
  }

  function appendAdaptiveLearningPhrase(kmlib, record, query) {
    query = query || '';
    query = str.humanize(query);

    if (query === '*' || query === '') { return; }

    var id = record[kmlib.docid],
        kbname = kmlib.kbname;
    var kmadaptivelearning = new SCFile('kmadaptivelearning');
    var rc = kmadaptivelearning.doSelect(
      new QueryCond('id', EQ, id).and(new QueryCond('kbname', EQ, kbname)));
    if (rc === RC_NO_MORE) {
      kmadaptivelearning.id = id;
      kmadaptivelearning.kbname = kbname;
      var newPhrase = new SCDatum();
      newPhrase.setType(8); // array
      kmadaptivelearning.phrasecount = newPhrase;
    }
    increaseAdaptiveLearning(kmadaptivelearning, query);
  }

  return {
    appendPhrase : appendAdaptiveLearningPhrase
  };
}());

function require() {
  return IDOLGlobalSearchAdaptiveLearning;
}