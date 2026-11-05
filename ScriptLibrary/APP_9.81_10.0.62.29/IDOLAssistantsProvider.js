var _ = lib.Underscore.require(),
    IDOLGlobalSearchSandbox = lib.IDOLGlobalSearchSandbox.require(),
    logger = getLog('IDOLAssistantsProvider');

var IDOLAssistantsProvider = (function() {

  // every searchsearchaction configuration has multiple conditions
  // need to validate one by one
  function SmartSearchActionCondition() { }

  function acceptCurrentFile(record, assoc, library, params) {
    if (this.currentFilename) {
      var currentFilename = funcs.filename(record);
      if (currentFilename && currentFilename !== this.currentFilename) {
        return false; 
      }
    }
    return true;
  }

  function acceptCurrentCriteria(record, assoc, library, params) {
    if (this.currentCriteria && record) {
      return funcs.evaluate_query(this.currentCriteria, record);
    }
    return true;
  }

  function acceptSuggestFile(record, assoc, library, params) {
    if (this.suggestFilename) {
      var suggestFilename = funcs.filename(assoc);
      if (suggestFilename && suggestFilename !== this.suggestFilename) {
        return false;
      }
    }
    return true;
  }

  function acceptSuggestLibrary(record, assoc, library, params) {
    if (this.suggestLibrary && library) {
      return library.kbname === this.suggestLibrary;
    }
    return true;
  }

  function acceptSuggestCriteria(record, assoc, library, params) {
    if (this.suggestCriteria && assoc) {
      return funcs.evaluate_query(this.suggestCriteria, assoc);
    }
    return true;
  }

  function acceptPreconditionCriteria(record, assoc, library, params) {
    if (this.preconditionScript) {
      var script = this.preconditionScript;
      var context = {
        '$L.file' : record,
        '$L.assoc.file' : assoc,
        '$L.library' : library,
        '$L.reference' : params.reference
      };
      return IDOLGlobalSearchSandbox.evaluate(context, function() {
        return funcs.parse_evaluate(script, 4);
      });
    }
    return true;
  }

  var checkers = [ 
    acceptCurrentFile, 
    acceptCurrentCriteria, 
    acceptSuggestFile, 
    acceptSuggestLibrary, 
    acceptSuggestCriteria, 
    acceptPreconditionCriteria
  ];

  SmartSearchActionCondition.prototype.execute = function(record, assoc, library, params) {
    var script = this.handlerScript;
    var context = {
      '$L.file' : record,
      '$L.assoc.file' : assoc,
      '$L.library' : library,
      '$L.reference' : params.reference,
      '$L.keyword' : params.keyword
    };
    return IDOLGlobalSearchSandbox.evaluate(context, function() {
      return funcs.parse_evaluate(script, 4);
    });
  };

  SmartSearchActionCondition.prototype.accept = function(record, assoc, library, params) {
    return _.every(checkers, function(checker) {
      return checker.call(this, record, assoc, library, params);
    }, this);
  };







  function SmartSearchAction(name, text, criteria) { 
    this.name = name;
    this.text = text;
    this.criteria = criteria || [];
  }

  SmartSearchAction.prototype.accept = function(record, assoc, library, params) {
    return _.some(this.criteria, function(criterion) {
      return criterion.accept(record, assoc, library, params || {});
    });
  };

  SmartSearchAction.prototype.execute = function(record, assoc, library, params) {
    var matched = _.find(this.criteria, function(criterion) {
      return criterion.accept(record, assoc, library, params || {});
    });
    if (matched) {
      return matched.execute(record, assoc, library, params);
    }
    return false;
  };



  // TODO: cache candidates to improve performance
  function loadActionCandidates() {
    var actions = new SCFile('smartsearchaction', SCFILE_READONLY), candidates = {};
    var rc = actions.doSelect(true);
    while (rc === RC_SUCCESS) {
      var name = actions.name,
          action = actions.action,
          displayName = actions['display.name'],
          precondition = actions.precondition,
          text = funcs.parse_evaluate(displayName, 2) || displayName; // evaluate to string

      var currentFilenames    = actions['current.filename'].toArray(),
          currentCriteria     = actions['current.criteria'].toArray(),
          suggestionFilenames = actions['suggestion.filename'].toArray(),
          suggestionLibraries = actions['suggestion.library'].toArray(),
          suggestionCriteria  = actions['suggestion.criteria'].toArray(),
          preconditionScripts = actions['precondition.script'].toArray(),
          handlerScripts      = actions['suggestion.action'].toArray();

      var criteria = [], length = currentFilenames.length, i;
      for (i = 0; i < length; i++) {
        var condition = new SmartSearchActionCondition();
        condition.currentFilename = currentFilenames[i];
        condition.currentCriteria = currentCriteria[i];
        condition.suggestFilename = suggestionFilenames[i];
        condition.suggestLibrary = suggestionLibraries[i];
        condition.suggestCriteria = suggestionCriteria[i];
        condition.preconditionScript = preconditionScripts[i] || precondition;
        condition.handlerScript = handlerScripts[i] || action;
        criteria.push(condition);
      }

      candidates[name] = new SmartSearchAction(name, text, criteria);

      rc = actions.getNext();
    }
    return candidates;
  }

  function executeAction(record, params) {
    var action = params.event, 
        filename = params.filename, 
        query = params.query,
        database = params.database,
        assoc, library;

    if (filename && query) {
      assoc = new SCFile(filename, SCFILE_READONLY);
      assoc.doSelect(query);
    }

    if (database) {
      library = new SCFile('kmknowledgebase', SCFILE_READONLY);
      library.doSelect(new QueryCond('kbname', EQ, database));
    }

    var candidates = loadActionCandidates(),
        candidate = candidates[action];

    if (candidate) {
      return candidate.execute(record, assoc, library, params);
    }
    return false;
  }

  function getAssistantCandidates(record, params) {
    var filename = params.filename, 
        query = params.query,
        database = params.database,
        assoc, library;

    if (filename && query) {
      assoc = new SCFile(filename, SCFILE_READONLY);
      assoc.doSelect(query);
    }

    if (database) {
      library = new SCFile('kmknowledgebase', SCFILE_READONLY);
      library.doSelect(new QueryCond('kbname', EQ, database));
    }

    var candidates = loadActionCandidates();

    return _.chain(candidates).filter(function(candidate) {
      return candidate.accept(record, assoc, library, params);
    }).map(function(candidate) {
      return { action : candidate.name, text : candidate.text };
    }).compact().value();
  }

  return {
    execute : executeAction,
    getActions : getAssistantCandidates
  };
}());

function require() {
  return IDOLAssistantsProvider;
}