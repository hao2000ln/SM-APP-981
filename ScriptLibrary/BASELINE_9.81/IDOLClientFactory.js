var _ = lib.Underscore.require(),
    XQuery = lib.XQuery.require(),
    IDOLRequest = lib.IDOLRequest.require(),
    IDOLURLParser = lib.IDOLURLParser.require(),
    IDOLConfigure = lib.IDOLConfigure.require(),
    IDOLHTTPRequest = lib.IDOLHTTPChannel.require();

var logger = getLog('IDOLClientFactory');

var IDOLClientFactory = (function() {
  var SMART_SEARCH_ENGINE_NAME = 'SmartSearch',
      PROPEL_ENGINE_NAME = 'Content-Propel';

  function IDOLClientInternal(prefix) {
    this._prefix = prefix;
  }

  IDOLClientInternal.prototype.getEndPoint = function() {
    // main proxy (default port 9000)
    return IDOLConfigure.getEndPoint();
  };

  function getEngines(endpoint) {
    /*
    <autnresponse xmlns:autn="http://schemas.autonomy.com/aci/">
      <action>ENGINEMANAGEMENT</action>
      <response>SUCCESS</response>
      <responsedata> 
        <engines>
          <num_engines>2</num_engines>
          <down_engines>0</down_engines>
          <online_engines>2</online_engines>
          <offline_engines>0</offline_engines>
          <engine aciport="20010" host="127.0.0.1" id="0" name="SmartSearch" status="online" type="IDOL" weight="100"/>
          <engine aciport="10010" host="127.0.0.1" id="1" name="Content1" status="online" type="IDOL" weight="100"/>
        </engines>
      </responsedata>
    </autnresponse>
    */
    var doc = IDOLRequest.doIDOLGet(endpoint, { action : 'EngineManagement', EngineAction : 'ShowStatus' });
    var enginesCollection = XQuery.query('responsedata/engines/engine', doc);

    var query = IDOLURLParser.parse(endpoint),
        proxyHost = query.host,
        protocol = query.protocol;

    return _.chain(enginesCollection).map(function(engine) {
      var id = engine.getAttributeValue("id"),
          name = engine.getAttributeValue("name"),
          host = engine.getAttributeValue("host"),
          status = engine.getAttributeValue("status"),
          aciport = engine.getAttributeValue("aciport"),
          weight = parseInt(engine.getAttributeValue("weight"), 10);

      host = (host === '127.0.0.1' || host === 'localhost') ? proxyHost : host;
      // TODO: need to consider HTTPs scenario
      var endpoint = protocol + '://' + host + ':' + aciport + '/';
      endpoint = lib.IDOL_Utilities.getCommonEndpoint(endpoint);
      return {
        id : id,
        name : name,
        endpoint : endpoint,
        status : status,
        weight : weight
      };
    }).filter(function(engine) {
      // ignore down server for failover reason.
      // XXX: but the return value was cachec, it may not able to detect down server in one sm session
      return engine.status === 'online';
    }).value();
  }

  var getCachedEngine = _.memoize(getEngines, _.identity);

  function getComponentEndPoint(endpoint, component) {
    if (!_.contains(['index', 'service'], component)) {
      throw new Error('only index/service are allowed');
    }
    var doc = IDOLRequest.doIDOLGet(endpoint, { action : 'GetStatus' });
    var comp = XQuery.queryObject({
      index : 'responsedata/indexport',
      service : 'responsedata/serviceport',
      ssl : 'responsedata/indexport_ssl_enabled'
    }, doc);

    var query = IDOLURLParser.parse(endpoint),
        host = query.host;
    var protocol = query.protocol;

    var port = comp[component];
    // TODO: should use http(s) protocal base on 'ssl' flag
    // but ssl option doesn't work as expected. (IDOL v10.5)
    // Even index port has configured ssl, the option 'indexport_ssl_enabled' is still false
    return protocol + '://' + host + ':' + port + '/';
  }

  var getCachedComponentEndPoint = _.memoize(getComponentEndPoint, function(endpoint, component) {
    return [endpoint, component].join('-');
  });

  function executeHTTPAction(base, action, params, payload) {
    base = lib.IDOL_Utilities.getCommonEndpoint(base);
    action = action || '';
    var endpoint = base + action;

    if (payload) { 
      var qs = _.map(params, function(v, k) { return k + '=' + encodeURIComponent(v); }).join('&');
      endpoint = _.compact([endpoint, qs]).join('?');

      logger.info(endpoint);
      logger.debug(payload);
      return doHTTPRequest('POST', endpoint, [], payload);
    } else {
      logger.info(endpoint);
      return IDOLHTTPRequest.doGet(endpoint, params);
    }
  }

  IDOLClientInternal.prototype._getEngines = function() {
    var endpoint = this.getEndPoint();
    return getCachedEngine(endpoint);
  };

  IDOLClientInternal.prototype.getComponentEndPoint = getCachedComponentEndPoint;

  var DEFAULT_OPTIONS = {
    max_ttl : 120,
    wait_interval : 5, // seconds
    allow_silent_success : false
  };

  function pickValueIgnoreCase(obj, key) {
    key = key.toLowerCase();
    return _.find(obj, function(v, k) {
      k = k.toLowerCase();
      return k === key;
    });
  }

  function getACIThreads(endpoint) {
    var doc = IDOLRequest.doIDOLPost(endpoint, { action: 'ThreadStatus' });
    var nodes = XQuery.query('responsedata/autn:threads/autn:thread', doc);
    return _.map(nodes, function(node) {
      return {
        id : node.getAttributeValue('id'),
        action: node.getAttributeValue('action'),
        action_id: node.getAttributeValue('action_id'),
        elapsed : node.getAttributeValue('elapsed_time_ms'),
        canceled : node.getAttributeValue('cancel_requested'),
        status : node.getNodeValue()
      };
    });
  }

  /**
   * All ACI action can be found in `ACIThreadStatus` or `ThreadStatus` response
   *
   * TODO: check whether ACI action can be queued or not
   * if the action was queued, it may not available in `ThesadStatus` response,
   * need confirm
   *
   * @param endpoint, which IDOL server connected to
   * @param action, there are overrided version
   *        String => ActionID
   *        Function => predicate function
   */
  function findACIActionThread(endpoint, action) {
    var predicate;
    if (_.isString(action)) {
      predicate = function(d) { return d.action_id === action; };
    } else if (_.isFunction(action)) {
      predicate = action;
    } else {
      throw new Error('unable to handle action: ' + action);
    }
    var threads = getACIThreads(endpoint);
    return _.find(threads, predicate);
  }


  /**
   * Busy wait until task finished or reach max allowed excution time.
   *
   * e.g.
   * IDOL Categorization training can take quite a long time.
   * But IDOL doesn't provide async action for Category (v10.11), and HTTP 
   * connection also have timeout limit, cannot hold the connection forever.
   *
   * XXX: There is no other way to get the ACI action resposne when original 
   * request timed out, cannot have response
   */
  function busyWaitTaskFinish(taskname, options, monitor, scope) {
    options = _.defaults(options, DEFAULT_OPTIONS);
    var start = new Date().getTime();
    var ttl = options.max_ttl;
    while(ttl > 0) {
      ttl--;
      var isFinished = monitor.call(scope, ttl, options);
      if (isFinished) {
        logger.info(taskname + ' finished');
        var end = new Date().getTime();
        return {
          task : taskname,
          timeUsage : (end - start)
        };
      } else {
        logger.info(taskname + ' is not finish, re-check in ' + options.wait_interval + 's');
        funcs.sleep(options.wait_interval);
      }
    }
    if (ttl <= 0) {
      var timeUsage = options.max_ttl * options.wait_interval;

      if (options.allow_silent_success) {
        logger.warn(taskname + ' exceed its max waiting time: ' + timeUsage + ', continue');
      } else {
        throw new Error(taskname + 'exceed its max waiting time: ' + timeUsage + ', abort');
      }
    }
  }

  /**
   * Some action can take minuts to finish, release connection quickly, and allow
   * main thread to update UI, but if the 'synchronized' flag was set true, 
   * client still can be blocked.
   */
  function executeLongTimeAction(endpoint, params, options) {
    var action = pickValueIgnoreCase(params, 'action'),
        actionId = pickValueIgnoreCase(params, 'actionid');
    if (!actionId) {
      throw new Error('ActionID is required to trace the long time execution action, abort');
    }

    var response = null;
    try {
      options = options || {};
      options = _.extend(options, { read_timeout : 2 });
      response = IDOLRequest.doIDOLPost(endpoint, params, options);
    } catch (e) {
      // TODO: make sure there is no L10N exception message
      if (typeof e === 'string' && e.indexOf('Read timed out') !== -1) {
        logger.info(e);
        logger.info('skip read time out exception, action: ' + action + ' can take a long time');
        if (options.synchronize) {
          logger.info('waiting ' + actionId + ' to finish its task');

          busyWaitTaskFinish(actionId, options, function(ttl) {
            var action = findACIActionThread(endpoint, actionId);
            if (action) {
              logger.info(actionId + ', ' + 
                          'action: ' + action.action + ', ' +
                          'status: ' + action.status + ', ' +
                          'elasped: ' + action.elapsed + 'ms, ' +
                          'ttl: ' + ttl);
              return false;
            }
            return true;
          }, this);
        }
      } else {
        throw e;
      }
    }
    return { actionId: actionId, response: response };
  }

  function executeOEMAction(endpoint, params, options) {
    options = options || {};
    endpoint = lib.IDOL_Utilities.getCommonEndpoint(endpoint);
    var handle = options.long_time ? executeLongTimeAction : IDOLRequest.doIDOLPost;
    return handle(endpoint, params, options);
  }

  /**
   * @param params, JSON object represent IDOL ACI action query string
   * @param options, configurations, include HTTP connection args
   */
  IDOLClientInternal.prototype.executeAction = function(params, options) {
    options = options || {};
    var handler = executeOEMAction, prefix = this._prefix;
    if (options.long_time && !prefix) {
      throw new Error('long time execution action require ActionID prefix defined');
    }

    if (prefix) {
      // add `ActionID` parameter to allow trace the ACI action
      // By default the `ActionID` is a random string, and cannot determine which
      // SM feature sent this request.
      // Meaningful `ActionID` prefix can group ACI action by feature name, and 
      // make it easy to trace.
      var action = pickValueIgnoreCase(params, 'action'),
          actionId = pickValueIgnoreCase(params, 'actionid');

      if (actionId && !_.str.startsWith(actionId, prefix)) {
        throw new Error('ActionID: ' + actionId + ' was assigned to action: ' + action + ', but its name mismatch, cannot be traced');
      }

      actionId = actionId || (prefix + new Date().getTime().toString());
      params = _.extend(params, { ActionID: actionId });
    }
    var args = [ this.getEndPoint(), params, options ];
    return handler.apply(this, args);
  };

  IDOLClientInternal.prototype.findACIActions = function() {
    var endpoint = this.getEndPoint(), prefix = this._prefix;
    if (!prefix) {
      throw new Error('cannot ind ACI Action if `ActionID` Prefix is not defined');
    }
    var threads = getACIThreads(endpoint);
    return _.filter(threads, function(thread) {
      return _.str.startsWith(thread.action_id, prefix);
    });
  };

  IDOLClientInternal.prototype._getIndexerStatus = function(id) {
    id = parseInt(id, 10);
    if (id > 0) {
      var doc = this.executeAction({
        action : 'IndexerGetStatus',
        Index : id
      });
      var status = XQuery.queryObject({
        received_time : 'responsedata/item/received_time',
        start_time : 'responsedata/item/received_time',
        end_time : 'responsedata/item/end_time',
        duration_secs : 'responsedata/item/duration_secs',
        percentage_processed : 'responsedata/item/percentage_processed',
        status : 'responsedata/item/status',
        description : 'responsedata/item/description',
        index_command : 'responsedata/item/index_command'
      }, doc);
      return status;
    } else {
      throw new Error('unable to flush IDOL index');
    }
  };

  IDOLClientInternal.prototype.flushAndWait = function(options) {
    options = options || {};
    options = _.defaults(options, { allow_silent_success : true }, DEFAULT_OPTIONS);
    var response = this.executeIndexAction('DRESYNC') || '';
    var id = _.trim(response.split('=')[1]);
    var taskname = 'index task ' + id;
    busyWaitTaskFinish(taskname, options, function(ttl) {
      var status = this._getIndexerStatus(id);
      logger.info('status:' + lib.JSON.json().stringify(status));
      if ((status.status === '-1') && (status.end_time !== 'Not Finished')) { // TODO: handle failed case
        return true;
      } else {
        logger.info(taskname + ', ' +
                    'command: ' + status.index_command + ', ' +
                    'status: ' + status.status + ', ' +
                    'duration: ' + status.duration_secs + 's, ' + 
                    'end time: ' + status.end_time + ' ' +
                    'ttl: ' + ttl);
        return false;
      }
    }, this);
  };

  // same as `executeAction`, but send command to DAH endpoint
  IDOLClientInternal.prototype.executeDAHAction = function() {
    return executeOEMAction.apply(this, [ this.getDAHEndPoint() ].concat(_.toArray(arguments)));
  };

  IDOLClientInternal.prototype.executeIndexAction = function(action, params, payload, options) {
    options = options || {};
    var response = executeHTTPAction(this.getIndexEndPoint(), action, params, payload);
    if (options.synchronize) {
      this.flushAndWait(options);
    }
    return response;
  };

  IDOLClientInternal.prototype.executeDIHAction = function(action, params, payload) {
    return executeHTTPAction(this.getDIHEndPoint(), action, params, payload);
  };

  IDOLClientInternal.prototype.executeServiceAction = function(params) {
    return executeHTTPAction(this.getServiceEndPoint(), '', params);
  };

  IDOLClientInternal.prototype.isDistributeMode = function() {
    return this._getEngines().length > 1;
  };

  IDOLClientInternal.prototype.isVDBExists = function(database) {
    var doc = this.executeDAHAction({ "action":"VDBManagement", "VDBAction":"ShowStatus" });
    var vdbs = XQuery.query('responsedata/vdbs/vdb', doc);

    return _.any(vdbs, function(vdb) {
      return vdb.getAttributeValue('name') === database;
    });
  };

  IDOLClientInternal.prototype.setDatabaseRole = function(database, role) {
    return this.executeDAHAction({
      "action"    : "RoleSetPrivilegeForRole",
      "Privilege" : "Databases",
      "RoleName"  : role,
      "Value"     : database
    });
  };

  IDOLClientInternal.prototype.getDAHEndPoint = function() {
    return this.getEndPoint();
  };

  IDOLClientInternal.prototype.getDIHEndPoint = function() {
    return this.getIndexEndPoint();
  };

  IDOLClientInternal.prototype.getServiceEndPoint = function() {
    var endpoint = this.getDAHEndPoint();
    return this.getComponentEndPoint(endpoint, 'service');
  };

  IDOLClientInternal.prototype.isInContainer = function() {
    return false;
  };

  //----------------------------------------------------------------------------------------------------------

  function IDOLClientForHotTopic() {
    IDOLClientInternal.apply(this, arguments);
  }

  function F1() {}
  F1.prototype = IDOLClientInternal.prototype;
  IDOLClientForHotTopic.prototype = new F1();
  IDOLClientForHotTopic.prototype.constructor = IDOLClientForHotTopic;

  IDOLClientForHotTopic.prototype.getIndexEndPoint = function() {
    var endpoint = IDOLConfigure.getIDOLIndexBaseURL();
    this.getIndexEndPoint = function() { return endpoint; };
    return endpoint;
  };

  IDOLClientForHotTopic.prototype._findEngineID = function(database) {
    var doc = this.executeDAHAction({ "action":"VDBManagement", "VDBAction":"ShowStatus" });
    var vdbs = XQuery.query('responsedata/vdbs/vdb', doc);
    var vdb = _.find(vdbs, function(vdb) {
      return vdb.getAttributeValue('name') === database;
    });
    var mapTo = XQuery.queryOne('mapstos/mapsto', vdb);
    return mapTo.getAttributeValue('engine');
  };

  var DISTRIBUTE_FIELDNAME = "ContentStore",
      DISTRIBUTE_FIELDVALUE_BASE = 'CONTENT';

  IDOLClientForHotTopic.prototype.getDistributeNameAndValue = function(database) {
    if (this.isDistributeMode() && !this.isVDBExists(database)) {
      this.createVDB(database);
    }
    var id = this._findEngineID(database);
    if (!id) {
      throw new Error('cannot find the engine which contains the data of ' + database);
    }

    var value = DISTRIBUTE_FIELDVALUE_BASE + id;
    var pair = {};
    pair[DISTRIBUTE_FIELDNAME] = value;
    return pair;
  };

  IDOLClientForHotTopic.prototype._roundRobinEngine = function() {
    var engines = this._getEngines();
    engines = _.filter(engines, function(engine) {
      return engine.name !== SMART_SEARCH_ENGINE_NAME && engine.name !== PROPEL_ENGINE_NAME;
    });

    if (engines.length === 0) {
      throw new Error('there is no proper IDOL engine for hot topic/smart ticket');
    }

    var settings = new SCFile('idolserverinfo');
    var rc = settings.doSelect(true);
    if (rc === RC_SUCCESS) {
      var index = settings.last_index_number || 0;
      var last = _.find(engines, function(engine) { 
        return parseInt(engine.id, 10) === index;
      });
      var position = _.indexOf(engines, last);

      var next = ((position + 1) > (engines.length - 1)) ? 0 : position + 1;
      var id = engines[next].id;

      settings.last_index_number = parseInt(id, 10);
      settings.doSave();
      return id;
    } else {
      throw new Error('IDOL Server settings cannot be found');
    }
  };

  IDOLClientForHotTopic.prototype.createVDB = function(database) {
    var engineId = this._roundRobinEngine(database);
    this.executeDAHAction({
      "action"   : "VDBManagement",
      "VDBAction": "VDBAdd",
      "VDBName"  : database,
      "VDBType"  : "Combinator",
      "VDBMapsTo": engineId + ':' + database
    });

    this.setDatabaseRole(database, "everyone");
    return engineId;
  };


  //----------------------------------------------------------------------------------------------------------

  function IDOLClientForGlobalSearch() {
    IDOLClientInternal.apply(this, arguments);
  }

  function F2() {}
  F2.prototype = IDOLClientInternal.prototype;
  IDOLClientForGlobalSearch.prototype = new F2();
  IDOLClientForGlobalSearch.prototype.constructor = IDOLClientForGlobalSearch;

  IDOLClientForGlobalSearch.prototype.getSmartSearchEngine = function() {
    var engines = this._getEngines() || [];
    var engine = _.find(engines, function(engine) { return engine.name === SMART_SEARCH_ENGINE_NAME; });
    return engine;
  };

  IDOLClientForGlobalSearch.prototype.getIndexEndPoint = function() {
    var engine = this.getSmartSearchEngine();
    return engine ? this.getComponentEndPoint(engine.endpoint, 'index') : '';
  };
  
  IDOLClientForGlobalSearch.prototype.executeAction = function(params) {
    var engine = this.getSmartSearchEngine();
    var endpoint = engine.endpoint;
    return executeOEMAction(endpoint, params);
  };
  
  IDOLClientForGlobalSearch.prototype.executeGSAction = function(params) {
    var engine = this.getSmartSearchEngine();
    var endpoint = engine.endpoint;
    return executeOEMAction(endpoint, params);
  };

  IDOLClientForGlobalSearch.prototype.getServiceEndPoint = function() {
    var engine = this.getSmartSearchEngine();
    return engine ? this.getComponentEndPoint(engine.endpoint, 'service') : '';
  };
  
  IDOLClientForGlobalSearch.prototype.getCommonEndPoint = function() {
    var engine = this.getSmartSearchEngine();
    var endpoint = engine.endpoint;
    return lib.IDOL_Utilities.getCommonEndpoint(endpoint);
  };

  // there is only one "content" for GlobalSearch, which use "virtual node" to build its distribute structure
  IDOLClientForGlobalSearch.prototype.getDistributeNameAndValue = function() {
    return { 'ContentStore' : 'GlobalSearch' };
  };

  IDOLClientForGlobalSearch.prototype.createVDB = function(database) {
    var engine = this.getSmartSearchEngine();
    var id = engine.id;
    this.executeDAHAction({
      "action"    : "VDBManagement",
      "VDBAction" : "VDBAdd",
      "VDBName"   : database,
      "VDBType"   : "Distributor",
      "VDBMapsTo" : id + ':' + database
    });
    this.setDatabaseRole(database, "everyone");
  };

  //----------------------------------------------------------------------------------------------------------

  function IDOLClientForGlobalSearchInContainer() {
    IDOLClientInternal.apply(this, arguments);
  }

  function F3() {}
  F3.prototype = IDOLClientInternal.prototype;
  IDOLClientForGlobalSearchInContainer.prototype = new F3();
  IDOLClientForGlobalSearchInContainer.prototype.constructor = IDOLClientForGlobalSearchInContainer;

  IDOLClientForGlobalSearchInContainer.prototype.getSmartSearchEngine = function() {  
    var engines = {"id":"0","name":"SmartSearch","endpoint": this.getEndPoint(),"status":"online","weight":100};
    return engines;
  };

  IDOLClientForGlobalSearchInContainer.prototype.getEndPoint = function() {
    return IDOLConfigure.getSearchMsvcEndPoint();
  };
  
  IDOLClientForGlobalSearchInContainer.prototype.getIndexEndPoint = function() {
    return IDOLConfigure.getIndexMsvcEndPoint();
  };

  IDOLClientForGlobalSearchInContainer.prototype.executeGSAction = function(params) {
//    var endpoint = this.getIndexEndPoint();
    var endpoint = IDOLConfigure.getIndexMsvcCommonPoint();
    return executeOEMAction(endpoint, params);
  };

  IDOLClientForGlobalSearchInContainer.prototype.getServiceEndPoint = function() {
    throw new Error("Service End Point is not avaiable in container");
  };
  
  IDOLClientForGlobalSearchInContainer.prototype.getCommonEndPoint = function() {
    throw new Error("Level 2 proxy is not avaiable in container");
  };
  
  IDOLClientForGlobalSearchInContainer.prototype.executeAction = function(params) {
    return executeOEMAction(this.getEndPoint(), params);
  };
  
  IDOLClientForGlobalSearchInContainer.prototype.executeServiceAction = function(params) {
    return executeHTTPAction(this.getServiceEndPoint(), '', params);
  };
  
  // there is only one "content" for GlobalSearch, which use "virtual node" to build its distribute structure
  IDOLClientForGlobalSearchInContainer.prototype.getDistributeNameAndValue = function() {
    return { 'ContentStore' : 'GlobalSearch' };
  };
  
  IDOLClientForGlobalSearchInContainer.prototype.isInContainer = function() {
    return IDOLConfigure.isInContainer();
  }; 

  IDOLClientForGlobalSearchInContainer.prototype.createVDB = function(database) {
    var id = "0";
    this.executeDAHAction({
      "action"    : "VDBManagement",
      "VDBAction" : "VDBAdd",
      "VDBName"   : database,
      "VDBType"   : "Distributor",
      "VDBMapsTo" : id + ':' + database
    });
    this.setDatabaseRole(database, "everyone");
  };

  //----------------------------------------------------------------------------------------------------------
  // please don't create this object multiple times
  // because some time consuming result was cached in this object
  function createInstance(feature, prefix) {
    switch(feature) {
      case 'GlobalSearch':         
        if(IDOLConfigure.isInContainer()){
          return new IDOLClientForGlobalSearchInContainer(prefix);
        } else {
          return new IDOLClientForGlobalSearch(prefix);
        }
      // "Hot Topic" and "Smart Ticket" are running in the same content
      case 'HotTopic' : 
      case 'SmartTicket': 
        return new IDOLClientForHotTopic(prefix);
      default : 
        throw new Error("doesn't recognize feature name " + feature);
    }
  }

  function createMemoizedInstance() {
    // Create new instance when IDOL endpoint changed.
    return _.memoize(createInstance, function(feature, prefix) {
      var hash = [IDOLConfigure.getEndPoint(), feature, prefix].join('-');
      logger.debug('memoize hash value: ' + hash);
      return hash;
    });
  }

  var instance = {
    create : createMemoizedInstance(),
    invalidCache : function() {
      logger.debug('clear memoized client instance');
      instance.create = createMemoizedInstance();
    }
  };

  return instance;
}());

function require() {
  return IDOLClientFactory;
}