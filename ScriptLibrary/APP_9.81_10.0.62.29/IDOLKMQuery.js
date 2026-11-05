var _ = lib.Underscore.require(),
    XQuery = lib.XQuery.require(),
    IDOLKMFieldMapping = lib.IDOLKMFieldMapping.require(),
    IDOLAdvancedSettings = lib.IDOLAdvancedSettings.require(),
    IDOLKMQueryParameter = lib.IDOLKMQueryParameter.require(),
    IDOLClientFactory = lib.IDOLClientFactory.require(),
    IDOLErrorCode = lib.IDOLErrorCode.require(),
    Constant = lib.KMCollection_Status_Constant;

var GlobalSearchSettings = IDOLAdvancedSettings.GlobalSearch;
/**
 * @abstract
 *
 * Should NOT use this class directly, only used for mixin or inherit
 */
var IDOLKMQuery = (function() {

  var STATUS = {
    INDEXING: Constant.INDEXSTATUS_INDEXING(),
    FINISHED: Constant.INDEXSTATUS_FINISHED(), 
    NOT_STARTED : Constant.INDEXSTATUS_NOTSTARTED()
  };

  function getHistListFields(kmlib) {
    return _.chain(kmlib.kbfields).filter(function(field) {
      return !!field.hitlist;
    }).reduce(function(memo, field) {
      var fieldname = field.kbfieldname;
      var idolfield = IDOLKMFieldMapping.mappingIDOLField(fieldname, kmlib.kbname);
      memo[fieldname] = idolfield;
      return memo;
    }, {}).value();
  }

  // TODO: should merge with 'IDOLGlobalSearchPreview' hitlist sorting
  function getHitListOrders(kmlib) {
    return _.reduce(kmlib.kbfields, function(memo, field) {
      var fieldname = field.kbfieldname;
      memo[fieldname] = parseInt(field.sort, 10) || Number.MAX_VALUE;
      return memo;
    }, {});
  }

  function getHitListCaption(kmlib) {
    return _.reduce(kmlib.kbfields, function(memo, field) {
      var fieldname = field.kbfieldname;
      memo[fieldname] = field.kbfieldvalue;
      return memo;
    }, {});
  }
  function getHitListFieldType(kmlib) {
    return _.reduce(kmlib.kbfields, function(memo, field) {
      var fieldname = field.kbfieldname;
      memo[fieldname] = field.kbfieldtype;
      return memo;
    }, {});
  }
  function KMQueryBehavior(fKMQuery, criteria) {
    fKMQuery.hitlist = fKMQuery.hitlist || 'Default';
    this.criteria = criteria || {};
    this.fKMQuery = fKMQuery;
    this._messages = [];
    this._actions = [];
    this._realQuery = '';

    // rebuild for every search
    // XXX: may cache in global scope to improve performance
    this.getHitListMappings = _.memoize(getHistListFields, function(kmlib) {
      return kmlib.kbname;
    });
    this.getHitListOrders = _.memoize(getHitListOrders, function(kmlib) {
      return kmlib.kbname;
    });
    this.getHitListCaption=_.memoize(getHitListCaption, function(kmlib) {
      return kmlib.kbname;
    });
   this.getHitListFieldType=_.memoize(getHitListFieldType, function(kmlib) {
      return kmlib.kbname;
    });
  }

  KMQueryBehavior.prototype.getLibrary = function(libname) {
    var kmlibs = this.getSelectedLibraries();
    var indexes = _.indexBy(kmlibs, 'kbname');
    this.getLibrary = function(libname) {
      return indexes[libname];
    };
    return indexes[libname];
  };

  // XXX overwrite/cache this method, since database reading is a time consuming process
  KMQueryBehavior.prototype.getAvailableLibraries = function(operator) {
    operator = operator || funcs.operator();

    var kmbase = new SCFile('kmknowledgebase', SCFILE_READONLY);
    var rc = kmbase.doSelect(new QueryCond('indexstatus', ISIN, [ STATUS.INDEXING, STATUS.FINISHED, STATUS.NOT_STARTED ]));

    var databases = [];
    while (rc === RC_SUCCESS) {
      var script = lib[kmbase.kbaccessscript];
      if (script && script.checkAccess && script.checkAccess(operator, kmbase)) {
        var database = new SCFile('kmknowledgebase');
        funcs.fduplicate(database, kmbase);
        databases.push(database);
      }
      rc = kmbase.getNext();
    }
    return databases;
  };

  KMQueryBehavior.prototype.hasLibrarySelected = function() {
    var libs = this.getSelectedLibraries();
    return libs.length > 0;
  };

  KMQueryBehavior.prototype.hasAttachmentLibrary = function() {
    var kmlibs = this.getSelectedLibraries();
    return _.any(kmlibs, function(kmlib) {
      return kmlib.kbtype === 'sclib' && kmlib.indexattachments;
    });
  };

  KMQueryBehavior.prototype.hasSharePoint = function() {
    var selectedLibs = this.getSelectedLibraries();
    return _.any(selectedLibs, function(library) {
      return (library['kbtype'] === 'splib' || library['kbtype'] === 'confluencelib') && !library['no.security'];
    });
  };

  KMQueryBehavior.prototype.addSCMessage = function(msgid) {
    var args = Array.prototype.slice.call(arguments, 1);
    var escapded = _.map(args, _.escape);
    var message = funcs.scmsg(msgid, 'idol', escapded);
    return this._messages.push(message);
  };

  KMQueryBehavior.prototype.getMessages = function() {
    return this._messages;
  };

  KMQueryBehavior.prototype.getActions = function() {
    return this._actions;
  };

  KMQueryBehavior.prototype.clear = function() {
    this._messages = [];
    this._actions = [];
  };

  KMQueryBehavior.prototype.getQuery = function() {
    return this._realQuery;
  };

  KMQueryBehavior.prototype._sendRequest = function(command) {
    var client = IDOLClientFactory.create('GlobalSearch');
    var doc = client.executeAction(command);
    var query = command.Text;
    var alternative = XQuery.queryText('responsedata/autn:spellingquery', doc);
    var num = parseInt(XQuery.queryText('responsedata/autn:numhits', doc), 10) || 0;


    this._realQuery = query;
    // long text query doesn't have to do spell check

    // TODO: IDOL server already has spell check term length configuration,
    // no need to use this threshold any more;

    // search within result has 'Text' combine
    // there are some additional 'AND', 'OR'
    // the spell check result may have those keyword which user doesn't enter
    if (alternative && !this.force && !this.searchWithinResults && (query.length < GlobalSearchSettings.SPELLCHECK_THRESHOLD)) {
      // no result found
      if (num > 0) {
        this._actions.push({ action : 'suggest.query', suggest : alternative });
      } else {
        this._actions.push({ action : 'alternative.search', alternative : alternative, query : query });

        command = _.extend(command, {Text: alternative});
        doc = client.executeAction(command);
        // alternative search hit count
        num = parseInt(XQuery.queryText('responsedata/autn:numhits', doc), 10) || 0;

        // XXX: use for advanced filter document count
        // after spell check, the query text changed
        this._realQuery = alternative;
      }
    }

    var total = parseInt(XQuery.queryText('responsedata/autn:totalhits', doc), 10) || 0;
    var raw = this.fKMQuery.query || query;

    // it is always no results for library document counting, but it shouldn't show error message on the client
    if (command.Print !== 'NoResults') {
      lib.KMSearchHistory.addSearchHistory(raw, total);
      if (num === 0) {
        this.clear();
        this.addSCMessage('no.result.found', query);
      }
    }

    return doc;
  };

  KMQueryBehavior.prototype.sendRequest = function(command) {
    try {
      return this._sendRequest(command);
    } catch (e) {
      if (XQuery.queryText('responsedata/error/errorid', e.xml) === 'DAHQUERY502') {
        var error =  new Error(funcs.scmsg('2001', 'idol'));
        error.id = IDOLErrorCode.INVALID_QUERY_TEXT;
        throw error;
      }
      throw e;
    }
  };

  /* @abstract */
  KMQueryBehavior.prototype.getSelectedLibraries = function() { 
    throw new Error('no implementation for "getSelectedLibraries"');
  };

  KMQueryBehavior.prototype.getResponseFormatter = function() {
    return _.identity;
  };

  KMQueryBehavior.prototype.buildParams = function() {
    var criteria = this.criteria;
    return IDOLKMQueryParameter.buildSearchCommand(this, criteria);
  };

  /**
   * @deprecated, it doesn't have XSS check
   */
  KMQueryBehavior.prototype.addMessage = function(message) {
    return this._messages.push(message);
  };

  KMQueryBehavior.prototype.search = function(options) {
    this.clear();
    var JSON = lib.JSON.json();

    var command = this.buildParams();
    command = _.extend(command, options);
    var doc = this.sendRequest(command);

    var formatter = this.getResponseFormatter();
    return formatter(doc, this);
  };

  return KMQueryBehavior;
}());

function require() {
  return IDOLKMQuery;
}