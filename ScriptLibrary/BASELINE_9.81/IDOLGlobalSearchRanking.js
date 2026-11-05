var _ = lib.Underscore.require(),
    XQuery = lib.XQuery.require(),
    IDOLGlobalSearchLibrary = lib.IDOLGlobalSearchLibrary.require();

var logger = getLog('IDOLGlobalSearchRanking');

var IDOLGlobalSearchRanking = (function() {

  var RANKING_TEPMLATE = [
    '#DREDOCREF <%= reference %>\n',
    '#DREFIELDNAME <%= name %>\n',
    '#DREFIELDVALUE <%= value %>\n',
    '#DREENDDATA\n',
    '#DREENDDATANOOP\n\n'
  ].join('');

  var template = _.template(RANKING_TEPMLATE);

  // TODO: max limit ?
  function rankIncreaser(rank) {
    return rank + 1;
  }

  function rankDecreaser(rank) {
    return rank > 0 ? rank - 1 : 0; 
  }

  function getRankingReference(client, database, reference) {
    var doc = client.executeAction({
      action : 'GetContent',
      DatabaseMatch : database,
      Reference : reference,
      PrintFields : 'AUTNRANK'
    });
    var rank = XQuery.queryText('responsedata/autn:hit/autn:content/DOCUMENT/AUTNRANK', doc);
    return parseInt(rank, 10) || 0;
  }

  function updateRanking(client, database, reference, rankUpdator) {
    reference = encodeURIComponent(reference);
    var rank = getRankingReference(client, database, reference);
    var newRank = rankUpdator.call(null, rank);
    var data = template({
      reference : reference,
      name : 'AUTNRANK',
      value : newRank
    });
    return client.executeIndexAction('DREREPLACE', { DREDbName : database }, data);
  }

  function updateDocumentRank(client, kmdocument, rankUpdator) {
    var filename = funcs.filename(kmdocument);
    var kmlib = IDOLGlobalSearchLibrary.getLibraryByFilename(filename);
    if (kmlib) {
      var database = kmlib.kbname;
      var doc = client.executeAction({
        action : 'Query',
        DatabaseMatch : database,
        Print : 'None',
        FieldText : 'MATCH{' + kmdocument.id + '}:ID'
      });
      var reference = XQuery.queryText('responsedata/autn:hit/autn:reference', doc);
      if (reference) {
        updateRanking(client, database, reference, rankUpdator);  
      } else {
        logger.warn('cannot search kmdocumet "' + kmdocument.id + '" from library "' + database + '"');
      }
    } else {
      logger.warn('"' + filename + '" was not indexed into IDOL database');
    }
  }

  function increaseDocumentRank(client, kmdocument) {
    return updateDocumentRank(client, kmdocument, rankIncreaser);
  }

  function decreaseDocumentRank(client, kmdocument) {
    return updateDocumentRank(client, kmdocument, rankDecreaser);
  }

  function increaseRank(client, database, reference) {
    return updateRanking(client, database, reference, rankIncreaser);
  }

  return {
    increaseRank : increaseRank,
    increaseDocumentRank : increaseDocumentRank,
    decreaseDocumentRank : decreaseDocumentRank
  };
}());

function require() {
  return IDOLGlobalSearchRanking;
}