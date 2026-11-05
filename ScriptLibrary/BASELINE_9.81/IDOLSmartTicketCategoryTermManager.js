var _ = lib.Underscore.require(),
    XQuery = lib.XQuery.require();

var IDOLSmartTicketCategoryTermManager = (function() {

  function parseQueryTNW(value) {
    var regex = /([\w ]+)~\[(\d+)\]/g;
    var matches = [];
    var match = regex.exec(value);
    while (match != null) {
      matches.push({
        term : _.trim(match[1]),
        weight : parseInt(match[2], 10)
      });
      match = regex.exec(value);
    }
    return matches;
  }

  function composeTermWeightPairs(terms, weights) {
    var pairs = [], i;
    for (i = 0, length = terms.length; i < length; i++) {
      pairs.push({ term : terms[i], weight : weights[i] });
    }
    return pairs;
  }

  function mergeTNW(tnw, genTNW, modTNW) {
    var genMap = _.indexBy(genTNW, 'term');
    var modMap = _.indexBy(modTNW, 'term');

    tnw = _.map(tnw, function(d) {
      var term = d.term, weight = d.weight;
      var genWeight = genMap[term] ? genMap[term].weight : null;
      var modWeight = modMap[term] ? modMap[term].weight : null;
      modWeight = (genWeight == modWeight) ? null : modWeight;
      return {
        term : term,
        weight : weight,
        generatedWeight : genWeight,
        modifiedWeight : modWeight
      };
    });
    return _.sortBy(tnw, function(t) {
      return -t.weight;
    });
  }

  function TermManager(category, options) {
    this._category = category;
  }

  TermManager.prototype.getTNW = function(client) {
    var id = this._category.getId();
    var doc = client.executeAction({
      action: 'CategoryGetTNW',
      Category: id
    });

    // TODO: handle autn:modifiedterms and autn:modifiedweights
    var category = XQuery.queryObject({
      terms : 'responsedata/autn:generatedterms',
      weights : 'responsedata/autn:generatedweights',
      modifiedterms : 'responsedata/autn:modifiedterms',
      modifiedweights : 'responsedata/autn:modifiedweights',
      queryagenttnw: 'responsedata/autn:queryagenttnw'
    }, doc);

    var terms = category.terms.split(','),
        weights = category.weights.split(','),
        modifiedterms = category.modifiedterms.split(','),
        modifiedweights = category.modifiedweights.split(',');

    weights = _.map(weights, function(w) { return parseInt(w, 10); });
    modifiedweights = _.map(modifiedweights, function(w) { return parseInt(w, 10); });

    var tnw = parseQueryTNW(category.queryagenttnw);
    var genTNW = composeTermWeightPairs(terms, weights);
    var modTNW = composeTermWeightPairs(modifiedterms, modifiedweights);

    return mergeTNW(tnw, genTNW, modTNW);
  };

  TermManager.prototype.updateTNW = function(client, tnw) {
    var id = this._category.getId();
    var terms = _.keys(tnw), weights = _.values(tnw);

    return client.executeAction({
      action: 'CategorySetTNW',
      Category: id,
      Terms: terms.join(','),
      Weights: weights.join(','),
      BuildNow: true
    });
  };

  TermManager.prototype.resetTNW = function(client) {
    this.updateTNW(client, {});
  };

  TermManager.prototype.addTerm = function(client, word, weight, tnw) {
    var info = this.getTermInfo(client, word);
    if (info.length === 0) {
      funcs.msg(funcs.scmsg('stem.term.fail', 'idol', [word]),2);
      term = word;
    } else {
      term = info[0].term;
      funcs.msg(funcs.scmsg('stem.term.okay', 'idol', [word, term]));
    }

    tnw[term] = weight;
    return this.updateTNW(client, tnw);
  };

  TermManager.prototype.getTermInfo = function(client, text, options) {
    options = options || {};
    var command = _.extend({
      action: 'TermGetInfo',
      Stemming : 'False',
      Text : text
    }, options);

    var doc = client.executeAction(command);
    var terms = XQuery.query('responsedata/autn:term', doc);
    return _.map(terms, function(term) {
      var text = term.getText(),
          weight = term.getAttributeValue('apcm_weight'),
          occurrences = term.getAttributeValue('document_occurrences'),
          total = term.getAttributeValue('total_occurrences');
      return {
        term : text,
        weight : parseInt(weight, 10),
        occurrences : parseInt(occurrences, 10),
        total : parseInt(total, 10)
      };
    });
  };

  TermManager.prototype.expandTerm = function(client, term) {

  };

  TermManager.prototype.findUsageInTraining = function(client, term) {
    var category = this._category;
    var refs = category.getTrainingDocumentRefs(),
        database = category.getIDOLDatabaseName();

    var doc = client.executeAction({
      action: 'Query',
      MatchReference : refs.join('+'),
      DatabaseMatch : database,
      Text : term,
      MaxResults : 10,
      Summary : 'Context',
      Highlight : 'SummaryTerms',
      // TODO: handle XSS issue
      StartTag : '<font color="red">',
      EndTag : '</font>',
      Print : 'None'
    });
    var hits = XQuery.query('responsedata/autn:hit', doc);
    return _.map(hits, function(hit) {
      return XQuery.queryObject({
        reference : 'autn:reference',
        weight : 'autn:weight',
        title : 'autn:title',
        summary : 'autn:summary'
      }, hit);
    });
  };

  TermManager.prototype.findUsageInTestResult = function(term) {

  };

  return {
    create : function(category, options) {
      return new TermManager(category, options);
    }
  };
}());


function require() {
  return IDOLSmartTicketCategoryTermManager;
}