var _ = lib.Underscore.require(),
    IDOLGlobalSearchRanking = lib.IDOLGlobalSearchRanking.require(),
    IDOLClientFactory = lib.IDOLClientFactory.require(),
    IDOLGlobalSearchAdaptiveLearning = lib.IDOLGlobalSearchAdaptiveLearning.require(),
    KMSearch = lib.KMSearch;

var logger = getLog('IDOLAssistantUseSolution');

var IDOLAssistantUseSolution = (function() {

  function updateRanking(database, reference) {
    var client = IDOLClientFactory.create('GlobalSearch');
    return IDOLGlobalSearchRanking.increaseRank(client, database, reference);
  }

  function useSolution(record, solution, library, reference, keyword) {
    var mapping = funcs.filename(record);
    logger.debug('applying solution ' + solution + ' onto ' + record);

    KMSearch.useSolution(mapping, solution, record);

    var database = library.kbname;
    // XXX: reference has to encode twice ...
    reference = encodeURIComponent(reference);
    updateRanking(database, reference);
    IDOLGlobalSearchAdaptiveLearning.appendPhrase(library, solution, keyword);
    return record;
  }
  function useSolutionForOkm(record, solution, library, reference, keyword) {
    var mapping = funcs.filename(record);
    var strfunc='lib.'+library.featurescript+'.useSolution(record, library, reference, keyword);'
    try
    {
      eval(strfunc);
    }
    catch(e)
    {
    }
    var database = library.kbname;
    // XXX: reference has to encode twice ...
    reference = encodeURIComponent(reference);
    updateRanking(database, reference);
    //IDOLGlobalSearchAdaptiveLearning.okmAppendPhrase(library, reference, keyword);
    return record;
  }




  function toJSON(kmmapping) {
    var name = kmmapping.name,
        fields = kmmapping['fields'],
        retrievalFieldss = kmmapping['retrieval.fields'],
        searchFields = kmmapping['search.fields'];

    var searchs = _.map(searchFields, function(field) {
      return { name : field['sc.searchfield'], target : field['km.target'] };
    });
    var mappings = _.map(fields, function(field) {
      return { name : field['sc.field'], type : field['km.doctype'] };
    });
    var retrievals = _.map(retrievalFieldss, function(field) {
      return { type : field['km.type'], source : field['km.source'], target : field['km.target'] };
    });
    return {
      "filename" : name,
      "searchs" : searchs,
      "solutions" : mappings,
      "retrievals" : retrievals
    };
  }

  function pluckKMFieldMappings() {
    var kmmapping = new SCFile('kmmapping', SCFILE_READONLY);
    var rc = kmmapping.doSelect(true);
    var mappings = [];
    while (rc === RC_SUCCESS) {
      mappings.push(toJSON(kmmapping));
      rc = kmmapping.getNext();
    }
    return mappings;
  }

  function initializeFieldMappings() {
    var mappings = pluckKMFieldMappings();
    return _.indexBy(mappings, 'filename');
  }

  var mappings = initializeFieldMappings();

  function precondition(record, assoc) {
    if (!assoc) { return false; }

    var solutionfilename = funcs.filename(assoc),
        workingfilename = funcs.filename(record);

    var mapping = mappings[workingfilename];
    if (!mapping) { return false; }

    var matchers = _.chain(mapping.retrievals).pluck('type').uniq().value();

    if (solutionfilename === 'kmdocument') {
      if (_.indexOf(matchers, 'all') !== -1) {
        return true;
      }
      var doctype = assoc.doctype;
      if (_.indexOf(matchers, doctype) !== -1) {
        return true;
      }
    }
    var matched = _.indexOf(matchers, solutionfilename) !== -1;
    if (matched) {
      if (solutionfilename === 'incidents' || solutionfilename === 'probsummary') {
        return !funcs._null(assoc.resolution);
      } else if (solutionfilename === 'rootcause' || solutionfilename === 'knownerror') {
        return !funcs._null(assoc.workaround);
      }
    }
    return matched;
  }

  return {
    accept : precondition,
    handle : useSolution,
    handleokm : useSolutionForOkm
  };

}());


function handle() {
  return IDOLAssistantUseSolution.handle.apply(this, arguments);
}

function accept() {
  return IDOLAssistantUseSolution.accept.apply(this, arguments);
}
function handleokm() {
  return IDOLAssistantUseSolution.handleokm.apply(this, arguments);
}