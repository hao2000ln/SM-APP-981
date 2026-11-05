var IDOLGlobalSearchRanking = lib.IDOLGlobalSearchRanking.require(),
    IDOLClientFactory = lib.IDOLClientFactory.require();

var IDOLGlobalSearchVoting = (function() {

  function voteKMDocument(kmdocument, useful) {
    var client = IDOLClientFactory.create('GlobalSearch');

    if (useful) {
      IDOLGlobalSearchRanking.increaseDocumentRank(client, kmdocument);
    } else {
      IDOLGlobalSearchRanking.decreaseDocumentRank(client, kmdocument);
    }
  }

  return {
    vote : voteKMDocument
  };
}());

function require() {
  return IDOLGlobalSearchVoting;
}