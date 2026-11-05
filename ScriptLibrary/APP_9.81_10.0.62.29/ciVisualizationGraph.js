var _ = lib.Underscore.require();
var utils = lib.ArrayUtil;

function printStack() {
    try{
        throw new Error();
    }catch(e){
        getLog('xxx').info(e.stack);
    }
}
// Simple string formatter
if (!('format' in String.prototype)) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
  };
}

function _toSQLParam(param){
    if(null==param){
        return 'NULL';
    }
    
    return '"'+lib.StringUtil.escapeAllStr(param.toString())+'"';
}

function prepareSql(sql){
    var args = arguments;
    var sql1 = sql.replace(/\%(\d+)/g, function(match, number) {
      return typeof args[number] != 'undefined' ? _toSQLParam(args[number]) : match;
    });
    
    return sql1;
}

var dFields = (function a(){
    var decorators= new lib.FileUtil._file('civisualizationdecorator');
    fields = [];
    decorators.setFields('filter.xml.string').select().iterate(function(decorator) {
            var segments = decorator['filter.xml.string'];
            var xml = new XML();
            rc = decorator.getNext();
            if(!segments || segments == '<filter> </filter>') {
                return;
            }
            xml.setContent(segments);
            var node = xml.getFirstChildElement();
            while(node!=null) {
                if(lib.ArrayUtil.contains(fields,node.getName())) {
                    node = node.getNextSiblingElement();    
                    continue;
                }
                fields.push(node.getName());
                node = node.getNextSiblingElement();
            }
    });
    fields.push('type');
    fields.push('subtype');

    return fields;
})();

var console = (function() {
  // return print;
  return function(msg) {
    funcs.rtecall("log", undefined, msg);
  };
})();

/**
 * Use thread ID as key to store cache object. When request first use thread ID
 * to locate the slot, and if the request token matched, return the stored
 * object otherwise create a new container to store cache objects
 */
var sm = (function() {
  var _pool = [];

  function activeThreads() {
    var i, threadIds = [];
    for ( i in system.threads) {
      var thread = system.threads[i];
      var id = thread.getFirstChildElement().getValue();
      threadIds.push(id);
    }
    return threadIds;
  }

  function currentThreadID() {
    return system.sysinfo.ThreadID;
  }

  function refresh() {
    var new_pool = [];
    utils.each(activeThreads(),function(id){
        new_pool[id] = _pool[id];
    },this);    
    _pool = new_pool;
  }

  function closeCurrent(){
    //var new_pool = [];
    funcs.cleanup(vars.$displayedFromGroupCis);
    delete _pool[currentThreadID()] ;
  }
  function refreshRepo(repo){
    utils.each(activeThreads(),function(id){
        if(id == currentThreadID()) {
            var entry = _pool[id];
            if(entry && entry.value){
                entry.value['_relation_'] = {};
                entry.value['relationship']={};
            }
        }
    },this);
  }
  function request(token) {
    refresh();
    var entry;
    var threadid = currentThreadID();
    if (threadid in _pool) {
      entry = _pool[threadid];
      if (entry && entry.token == token) {
        return entry.value;
      }
    }

    entry = { "token" : token, "value" : {} };
    _pool[threadid] = entry;
    return entry.value;
  }

  function status(console) {
    for ( var i = 0; i < _pool.length; i++) {
      var entry = _pool[i];
      if (!entry) {
        console("Thread {0} is empty".format(i));
      } else {
        console("Thread {0} assocate with \"{1}\"".format(i, entry.token));
        var name;
        for ( name in entry.value) {
          console("------------------- {0} -------------------".format(name));
          var repo = entry.value[name];
          var item;
          for ( item in repo) {
            console(item);  
          }
        }
      }
    }
  }
  
  return { "request" : request, "refresh" : refresh, "status" : status, "closeCurrent" : closeCurrent, "refreshRepo" : refreshRepo };
})();

function printCacheStatus() {
  sm.status(console);
}

function closeCurrent() {
    sm.closeCurrent();
}

function refreshRepo(repo) {
    sm.refreshRepo(repo);
}

/**
 * Update "thread variables", maybe invoke it when closing device thread to
 * release memory.
 */
function refreshCache() {
  sm.refresh();
}

var repository = function(context) {
  Repository.instances = {};
  
  function createCompoundKey(keys) {
    return keys.join('_');
  }
  
  
  
  /**
   * Database Query helper, query one record or query full table. 
   * After database query execute, it will return a function to accept an
   * iterator to traverse the result set.
   * 
   * e.g. <code>
   * var _dbquery = dbquery("device", ["logical.name"]);
   * _dbquery.selectAll()(function(value, key) {
   *   // iterate record here
   * }, this);
   * </code>
   * dbquery function will return an object has methods "selectAll", "selectMany", 
   * "selectOne", "customQuery" which are used in Repository to perform database
   * actions. Here are some examples:
   * 
   * <code>
   * var _dbquery = dbquery("cirelationship", ["logical.name", "relationship.name"])
   *   .customQuery(["related.cis"], ["logical.name"]);
   * var selectMany = _dbquery.selectMany("adv-nam-switch")(function(value, key) {
   *   print("Key: " + key + "   Value: " + value);
   * }, this);
   * </code>
   * also
   * <code>
   * var _dbquery = dbquery("cirelationship", ["logical.name", "relationship.name"]);
   * _dbquery.selectAll()(function(value, key) {
   *   print("Key: " + key + "  Value: " + value);
   * }, this);
   * </code>
   * 
   * @param name
   *          SCFile name, used to indicate which database table to query on
   * @param keys
   *          unique keys to identify the record. It does not need to be the
   *          same as database unique keys. These keys are only identify record
   *          in cache.
   * @param identifiers
   *          Which fields should be used to generate cache key
   * @param postaction
   *          Call back function when record has been found.
   * @param querycallback
   *          Optional call back function, when one query was executed, invoke
   *          this call back, pass filename and query string into this call back 
   */
  function dbquery(name, keys, identifiers, postaction /*opt*/, querycallback /*opt*/) {
    var delegate = new lib.FileUtil._file(name);
    
    function extractUniqueKey(record) {
      var values = utils.map(identifiers,function(identifier) {
        return record[identifier];
      }, this);
      return createCompoundKey(values);
    }
    /**
   * Use key-value pairs to generate query string
   * <code>
   * keys   = ["relationship.type", "relationship.subtype"],
   * values = ["Application", "Development Tools"]
   * </code>
   * The generated query string is like below:
   * <code>
   * "relationship.type=\"Application\" and relationship.subtype=\"Development Tools\""
   * </code>
   */
    function buildQuery(keys, values) {
      if (!keys || !keys.length) {
        throw new Error("Unique key of [{0}] doesn't exists!".format(name));
      }
  
      var index = 0;
      var template = utils.map(keys,function(key) {
        return key + "=\"{" + (index++) + "}\"";
      }, this).join(" and ");
  
      var query = String.prototype.format.apply(template, values);
      if (query.match(/{(\d+)}/)) {
        throw new Error(
            "Not enough parameter, template is: [{0}], but values are {1}"
                .format(template, values));
      }
      return query;
    }
    
    function executeQuery(query,fields) {
      return function(iterator, that) {
        querycallback && querycallback(name, query);
        delegate.setFields(fields).select(query).iterate(function(_record) {
          var uniqueName = extractUniqueKey(_record);
          var record = postaction ? postaction(uniqueName, _record) : _record;
          iterator.call(that, record, uniqueName);
        });
      };
    }
    
    return {
      "selectAll" : function() {
        return executeQuery("true");
      },
      "selectMany" : function() {
        var query = buildQuery(keys, arguments);
        return executeQuery(query);
      },
      "selectOne" : function() {
        var count = 0;
        var record = null;
        var query = buildQuery(keys, arguments);
        executeQuery(query)(function(value) {
          if (count > 0) {
            throw new Error("Multi records has been found one [{0}] with query [{1}]"
                .format(name, query));
          }
          record = value;
          count++;
        }, this);
        return record;
      },
      "execute" : function(query,fields) {
        return executeQuery(query,fields);
      },
      "customQuery" : function(keys) {
        return dbquery(name, keys, identifiers, postaction, querycallback);
      }
    };
  }
  
  /**
   * This repository is used to store Wrapper object.
   * When one object has been looked up from this repository, it will search 
   * cache first, if not found it will delegate to "dbquery" to search from
   * database. No matter found or not found, it will stored the query result
   * in the cache.
   * 
   * During executing, the "this" pointer is point to a Function 
   * (e.g. Node/Relationship/VisualIcon ...)
   * After execution, the Function has additional methods which defined here.
   * This is kind of "inheritance"
   */
  function Repository(spec) {
    Repository.instances[this.name] = this;
    
    var _hit = 0, _missing = 0, _count = 0, _query = 0, _loaded = false, file = spec.file;

    // When record has been found via "dbquery", this callback function will be invoked
    // XXX When deal with "Relationship" object, there is no way to check cache in 
    // advance.(They are not query by its unique key).
    // So one record may appear several times, but only the first one will be returned.
    var _postaction = function(key, record) { 
      var value = context.get(file, key);
      if (!value) {
        value = new spec.repository(record);
        _put(key, value);
      }
      return value;
    };
    
    var _finder = function() { 
      var args = Array.prototype.slice.call(arguments); 
      return createCompoundKey(args);
    };
    
    var _put = function(key, value) {
        if(key && value && file) { 
            context.set(file, key, value);
            _count++;
        }
    };
    
    var _querycallback = function(name, query) {
      _query++;
    };
    
    var _dbquery = dbquery(spec.file, spec.keys, spec.keys, _postaction, _querycallback);
    var _selectOne = _dbquery.selectOne, _selectAll = _dbquery.selectAll;

    this.dbquery = _dbquery;
    this.put = _put;
    
    this.get=function(){
        var key = _finder.apply(this, arguments);
        return context.get(file, key);
    };
    
    this.lookup = function() {
      var key = _finder.apply(this, arguments);
      var value = context.get(file, key);
      if (value === undefined) {
        _missing++;
        value = _selectOne.apply(this, arguments);
        
        // XXX In dbquery, it use iterator to traverse the result set and put the 
        // result into cache, but sometimes database query doesn't return and record, 
        // in this situation place a null value as a placeholder to prevent query it again.
        if (!value) {
          _put(key, null);
        }
      } else {
        _hit++;
      }
      return value;
    };
    
    /*
     * forEach and filter accept iterator, and pass value first, then key
     * Because usually the key didn't use at all
     */
    this.forEach = function(iterator, that) {
      var collection = context.get(file);
      var key;
      for (key in collection) {
        iterator.call(that, collection[key], key, this);
        _hit++;
      }
      return this;
    };

    this.filter = function(filter, that) {
      var matches = [];
      var collection = context.get(file);
      var key;
      for (key in collection) {
        var value = collection[key];
        if (filter.call(that, value, key, this)) {
          matches.push(value);
        }
        _hit++;
      }
      return matches;
    };
    
    this.contains = function(name) {
      return !!context.get(file, name);
    };

    this.loadAll = function() {
      if (_selectAll && !_loaded) {
        _missing++;
        // Invoke "selectAll" to return a function which can do real database query
        // There is nothing to do when record found.
        // All the work as been done in "_postaction" call back, and "dbquery" was design
        // as lazy load, query will really execute when iteration was defined.
        _selectAll()(function() { }, this);
        _loaded = true;
      }
      return this;
    };
    
    this.getCacheStatus = function() {
      return { "name" : this.name, "count" : _count, "query" : _query, "missing" : _missing, "hit" : _hit };
    };
  }

  function diagnostic(printer) {
    var name;
    for ( name in Repository.instances) {
      var instance = Repository.instances[name];
      var status = instance.getCacheStatus();
      var message = "[{0}] Cached Object: {1}, Queried : {2},  Missing: {3}, Hit: {4}, Hit Ratio: {5}%"
          .format(name, status.count, status.query, status.missing, status.hit,
              (100 * (status.hit / (status.hit + status.missing))).toFixed(2));
      printer(message);
    }
  }

  /**
   * Define a repository.
   * After define finished, one JavaScript function will be defined, and it can
   * search database and save the record in cache
   *  
   * @param spec Repository specification
   *  this parameter must be a structure with following fields
   *    "repository": A JavaScript function which will be enhanced to act as a 
   *      Repository after initialization, this function will have methods like
   *      "lookup/forEach/filter..."
   *    "file": The name of SCFile, when repository(cache) do not have the 
   *      requesting record, then lookup this table to load the record
   *    "keys" The unique keys(Array) of SCFile. After record loaded, this 
   *      record will be stored in the repository(cache), it need a unique key 
   *      to identify it
   */
  function define(spec) {
    var target = spec.repository;
    // attach additional method to the "target", and the type of "target" is
    // Function, so the attach is like to add static methods
    Repository.call(target, spec);
  }
  
  return {
    "define" : define,
    "diagnostic" : diagnostic
  };
};

////////////////////////////// Library definition end //////////////////////

var XMLNode = {
  "ELEMENT_NODE" : 1,
  "ATTRIBUTE_NODE" : 2,
  "TEXT_NODE" : 3
};

// CI Visualization graph object, all nodes/edges are added to this object
// When needed, generate XML document to represent the CI relationship
var graph = (function() {
  var context = (function() {
    var _cache = {
      "device" : {},
      "_relation_" : {},
      "cirelationship" : {},
      "SYSATTACHMENTS" : {},
      "civisualizationline" : {},
      "civisualizationadmin" : {},
      "civisualizationlabel" : {},
      "civisualizationdevice" : {},
      "civisualizationdecorator" : {},
      "civisualizationrelationship" : {}
    };

    return {
      "get" : function(slot, key) {
        var collection = _cache[slot];
        if (!key) {
          return collection;
        }
        return collection[key];
      },
      "set" : function(slot, key, value) {
        _cache[slot][key] = value;
      },
      "clean" : function(slot) {
        _cache[slot]={};
      },
      /* Every thread has its own Node, Relation, Relationship cache*/
      /* **********************************************************************
       *                  WARNING !!!!!!!!
       * FIXME because context is a global object ("graph" is global object), so the
       * update method will affect all the threads connected. 
       * But since Service Manager is a running in single thread environment, 
       * this piece of code can work in this scenario.
       * 
       * To find current thread id is a time consuming approach
       *   system.sysinfo[19].getValue();
       * It is not acceptable to get thread variable every time.
       * 
       * When define "Repository", it will accept a scope parameter to store
       * the cache object, and shouldn't define "Repository" every time. 
       * Because repository also has instance objects. If we define "Repository"
       * again the instance object constructor is different from current one.
       * 
       * 
       * The best way is to pass scope as parameter into every method invoked
       * here, in this situation its better to re-design
       * **********************************************************************/
      "update" : function(local) {
        var name;
        for (name in local) {
          _cache[name] = local[name];
        }
      }
    };
  })();
  
  // XXX There are several table didn't involved, including "civisualizationbounds", 
  // "civisualizationcat, civisualizationshape", need confirm what these tables are for
  var repo = repository(context);
  var repositories =   [ { "repository" : Node,                "file" : "device",                      "keys" : ["logical.name"] },
    // XXX Relation doesn't exists in database, here just what to use repository method (put/forEach/filter...)
    { "repository" : Relation,            "file" : "_relation_",                  "keys" : [] },
    { "repository" : Relationship,        "file" : "cirelationship",              "keys" : ["logical.name", "relationship.name"] },
    // XXX Though the unique key of SYSATTACHMENTS is not only these two fields, but they are enough for visualization
    { "repository" : VisualIcon,          "file" : "SYSATTACHMENTS",              "keys" : ["application", "topic"] },
    { "repository" : VisualLine,          "file" : "civisualizationline",         "keys" : ["line.name"] }, 
    { "repository" : VisualAdmin,         "file" : "civisualizationadmin",        "keys" : ["id"] }, 
    { "repository" : VisualLabel,         "file" : "civisualizationlabel",        "keys" : ["label.name"] }, 
    { "repository" : VisualDevice,        "file" : "civisualizationdevice",       "keys" : ["uniqueID"] },
    { "repository" : VisualDecorator,     "file" : "civisualizationdecorator",    "keys" : ["name"] }, 
    { "repository" : VisualRelationship,  "file" : "civisualizationrelationship", "keys" : ["relationship.type", "relationship.subtype"]}
  ];
  utils.each(repositories, function(spec){
      repo.define(spec);
  },this);
  
  function generateguid() {
    var guid = "";
    for ( var i = 0; i < 32; i++) {
      guid += Math.floor(Math.random() * 0xF).toString(0xF)
          + (i == 8 || i == 12 || i == 16 || i == 20 ? "-" : "");
    }
    return guid;
  }
  
  function one(func, that) {
    var _result = null;
    return function() {
      if (!_result) {
        _result = func.apply(that, arguments);
      }
      return _result;
    };
  }

  /**
   * The wrapper base class for every SCFile object Since SCFile object is pass
   * by reference, so must create a detach object Otherwise only last one is
   * available when scroll with cursor.
   * 
   * @param record
   *          SCFile object, and it is a cursor.
   */
  function Wrapper(record) {
    var _record = new SCFile();
    funcs.fduplicate(_record, record);
    
    this.getRecord = function() { return _record; };
    this.get = function(name) {
        return _record[name]; 
    };
  }
  
  function VisualAdmin        (record) { Wrapper.apply(this, arguments); }
  function VisualLine         (record) { Wrapper.apply(this, arguments); }
  function VisualIcon         (record) { Wrapper.apply(this, arguments); }
  function VisualLabel        (record) { Wrapper.apply(this, arguments); }
  function Relationship       (record) { Wrapper.apply(this, arguments); }
  function VisualDevice       (record) { Wrapper.apply(this, arguments); }
  function VisualDecorator    (record) { Wrapper.apply(this, arguments); }
  function VisualRelationship (record) { Wrapper.apply(this, arguments); }
  
  /**
   * Group nodes, when nodes has exceed its limit, group them together
   */
  function Group(subtype, type, count, relationType, relationSubType) {
    var name = generateguid();
    this.count = count;
    // Group was composed by the node which have the same type or subtype
    // so choose anyone is OK
    this.toString = function() {
      var label = subtype || type;
      return label + " (" + this.count + ")";
    };
    
    this.isVisible = function() {
      return this.count>0;
    };
    
    var createGroupNodeOnce = one(function(parent,relationshipName, direction) {
      var fakeDevice = new SCFile("device");
      fakeDevice["logical.name"] = name; // logical.name is the identifier in cache
      fakeDevice["type"] = type;
      fakeDevice["subtype"] = subtype;
      
      var group = new Node(fakeDevice, this);
      
      var relatedcis = new SCDatum();
      relatedcis.setType(8); // Array
      
      var sql;
      var relationship = new SCFile("cirelationship");
      if(direction == Relation.DIRECTION.upstream) {
        relationship["logical.name"] = name;
        relationship["relationship.name"] = name;
        relatedcis.push(parent.getName());
        
        sql = 'select d.* '
            +'from device d join cirelationship m on (m.logical.name=d.logical.name) '
            +'where m.related.cis=%1 and m.relationship.subtype=%2 and d.type=%3 and d.subtype=%4 and not d.logical.name isin $currentNodeList';
        
        this.listSql = prepareSql(sql, parent.getName(), relationSubType, type, subtype);        
      } else {
        relationship["logical.name"] = parent.getName();
        relationship["relationship.name"] = parent.getName();
        relatedcis.push(name);

        sql = 'select d.* '
            +'from device d join cirelationship m on (m.related.cis=d.logical.name) '
            +'where m.logical.name=%1 and m.relationship.subtype=%2 and d.type=%3 and d.subtype=%4 and not d.logical.name isin $currentNodeList';

        this.listSql = prepareSql(sql, parent.getName(), relationSubType, type, subtype);
      }
      
      relationship["relationship.type"] = relationType;
      relationship["relationship.subtype"] = relationSubType;
      relationship["related.cis"] = relatedcis;
      
      var groupRelation = new Relationship(relationship);
      parent.addRelation(groupRelation, direction);
      group.addRelation(groupRelation, direction.opposite());
      Node.put(name, group); // Add group node to repository
      return group;
   },this);
    
    this.createGroupNode = function(parent, item, direction) {
      return createGroupNodeOnce(parent, item, direction);
    };
    
    this.setEnvironment = function() {        
        vars.$relatedCis = funcs.insert( vars.$relatedCis, 0, 1, this.listSql );
        vars.$relatedNodeIds = funcs.insert( vars.$relatedNodeIds, 0, 1, name );
    };
  }

  /**
   * The wrapper of SCFile "device"
   */
  function Node(record, group) {  
    Wrapper.apply(this, arguments);
    // When node is "focus" it will display a background image which defined
    // in civisualizationdecorator with name "Point of Focus"
    var _isVisible = false;
    var _relations  = [];
    
    this.getName = function() { return this.get("logical.name");  };
    // this.getLabel = function() {  return group ? group.toString() : this.getName(); };
    this.getLabel = function() {  return group ? group.toString() : this.get("sm.device.display.name") || this.get("logical.name"); };
    
    this.isFocus    = function()      { 
      var current = vars["$L.file"];
      return current && (current["logical.name"] == this.getName());
    };
    this.isGroup    = function()      { return !!group; };
    this.getGroup   = function()      { return group;   };
    
    this.loadRelatedNodes = one(Node.prototype._loadRelatedNodes, this);
    
    this.addRelation = function(relationship, direction) {
      var relation = new Relation(relationship, direction);
      return this;
    };
    
    this.isVisible = function() { return group ? group.isVisible() : _isVisible; };
    this._hasFoldingNodes = null;
    
    // Every node need to appears in xml document must invoke this method
    // to attach node to the graph
    this.attachGraph = function() { _isVisible = true; return this; };
    
    this.setEnvironment = function() {
      if (group) { group.setEnvironment(); }
      return this;
    };
    
    var findRelatedDecoratorOnce = one(function() {
      // loop through entire civisualizationdecorator table to evaluate and 
      // see if there is any record match criteria
      // This step is required, because RAD script envolved, we must load record first.
      var decoratorFlag = function(decorator) {
        // "special.disabled" field type is "logical", use as boolean value
        if (decorator.get("disabled.flag") || decorator.get("special.disabled")) { return false; }
        // Perform RAD evaluate
        var criteria = decorator.get("filter.criteria");
        // "filter.criteria" field type is "character", compare as string
        if (criteria == null || criteria == "" || criteria.toLowerCase() == "false") { return false; }
        if (criteria.toLowerCase() == "true") { return true; }
        var parseString = criteria.replace(/\$L.file/g, "$G.parsefile");
        vars.$G_parsefile = record;
        var ret = funcs.parse_evaluate(parseString, 2);
        
        return ret;
      };
      var decoratoryTypes = function(decorator){
        var changeLinkeType = decorator.get("change.link.type");
        if (changeLinkeType && changeLinkeType.toLowerCase() != "none") {
            var daysOut = "0";
            if(changeLinkeType == "future") {
              daysOut =  decorator.get("days.in.advance") || daysOut;
            }
            var tableName = decorator.get("external.table.name");
            var device = record;
            return lib.ciVizProcessExternal.hasDecoratorForExternal(device, tableName, "", daysOut);
        }
        return true;
      };
      var allDecorators = VisualDecorator.loadAll();
      var enabledDecorators = allDecorators.filter(decoratorFlag, this);
      var types = utils.filter(enabledDecorators, decoratoryTypes, this);
      return types.sort(function(a, b) {
        return a.get("priority") - b.get("priority");
      });
    }, this);
    /**
     * Loop through civisualizationdecorator table to find matched decorator
     * and return them in an array. 
     */
    this.decorators = function() {
      return findRelatedDecoratorOnce();
    };
  }
  
  
  /**
   * Relation indicate which Node related to which Relationship and indicate its
   * direction (upstream/downstream)
   */
  function Relation(relationship, direction) {
    this.relationship = relationship;
    this.direction = direction;
    
    this.get = function(name) {
      return this.relationship.get(name);
    };
    
    var uniqueName = generateguid();
    Relation.put(uniqueName, this);
  }
  
  Relation.edges = function() {
    var visibleRelations = Relation.filter(function(relation) {
      // Only draw downstream line
      // since if downstream relation exists the corresponding upstream relation also exists
      // When drawing downstream relation, current node must be the upstream node
      // so only check "logical.name"
      
        if(relation.direction == Relation.DIRECTION.downstream 
            && Node.lookup(relation.get("logical.name")).isVisible()) {
           var related = relation.get("related.cis").toArray();
             while(related.length > 0) {
                // Because query length has limitation, so search at most 100 items at a time
                var slice = related.splice(0, 100);
                var query = utils.map(slice,function(name) {
                    return "\"{0}\"".format(name);
                }, this).join(" , ");
              query = "logical.name isin { " + query + " }"; //For fixing QCCR1E104131
              Node.preload(query);
            }   
          return true;
        }
    }, this);
    return utils.reduce(visibleRelations,function(edges, relation) {
        var from = Node.lookup(relation.get("logical.name"));
        var related_cis = relation.get("related.cis").toArray();
        for(var i = 0;i<related_cis.length;i++) {
          var name = related_cis[i];
          var to = Node.lookup(name);
          if(to instanceof Node == false) { continue; }
            to.isVisible() && edges.push(new Edge(from, to, relation.relationship));
        }
        return edges;
      }, [], this);
  };

  Relation.DIRECTION = {
    "upstream" : {
      "loadRelatedNodes" : function(node, relation) {
        var name = relation.get("logical.name");
        return [ Node.lookup(name) ];
      },
      "searchRelatedNodeNames" : function(relation) {
        return [ relation.get("logical.name") ];
      },
      "opposite" : function() {
        return Relation.DIRECTION.downstream;
      },
      "toString" : function() { return "upstream"; }
    },
    "downstream" : {
      "loadRelatedNodes" : function(node, relation) {
        var nodes = [];
        var related = relation.get("related.cis").toArray();
        while(related.length > 0) {
          // Because query length has limitation, so search at most 100 items at a time
          var slice = related.splice(0, 100);
          var query = utils.map(slice,function(name) {
            return "\"{0}\"".format(name);
          }, this).join(" , ");
          query = "logical.name isin { " + query + " }"; //For fixing QCCR1E104131
          nodes = nodes.concat(Node.preload(query));
        }
        return nodes;
      },
      "searchRelatedNodeNames" : function(relation) {
        return relation.get("related.cis").toArray();
      },
      "opposite" : function() {
        return Relation.DIRECTION.upstream;
      },
      "toString" : function() { return "downstream"; }
    }
  };

  Relation.prototype.loadRelatedNodes = function(node) {
    return this.direction.loadRelatedNodes(node, this);
  };
  
  Relation.prototype.searchRelatedNodeNames = function() {
    return this.direction.searchRelatedNodeNames(this);
  };
  
  Relation.prototype.hasFoldingNodes = function() {
    // Only search, shouldn't load more nodes into memory
    return utils.some(this.searchRelatedNodeNames(), function(name) {
      // related node exists but doesn't loaded into memory
      // or has loaded, but it is invisible. (invisible means in group node)
      return !(Node.contains(name) && Node.lookup(name).isVisible && Node.lookup(name).isVisible());
    }, this);
  };

  Node.preload = function(query) {
    var loaded = [];
    Node.dbquery.execute(query,dFields)(function(value) {
      loaded.push(value);
    }, this);
    return loaded;
  };
  
  Node.prototype.hasFoldingNodes = function() {
      if (this.isGroup()){
          return false;
      }

      if(false===this._hasFoldingNodes){
          return false;
      }
      
      return true;
  };

  /**
   * Load related node from database, including upstream and downstream
   * But when the nodes count has exceed this limit, group nodes will be created and returned.
   */
  Node.prototype._loadRelatedNodes = function() {
    var upstreams = this.loadDirectionNodes(Relation.DIRECTION.upstream);
    var downstreams =  this.loadDirectionNodes(Relation.DIRECTION.downstream);
    
    var relatedNodeList = [].concat(upstreams).concat(downstreams);
    
    if(relatedNodeList.length>0){
        this._hasFoldingNodes = true;
    }else {
        this._hasFoldingNodes = false;
    }
    
    return utils.map(relatedNodeList, function(node) {
      return node.attachGraph();
    }, this);
  };
  
  Node.prototype.makeRelation = function(toNode, type, subtype){
      var relationship = new SCFile("cirelationship");

      relationship["relationship.name"] = subtype;
      relationship["relationship.type"] = type;
      relationship["relationship.subtype"] = subtype;
      relationship["logical.name"] = this.getName();
      relationship["related.cis"] = [toNode.getName()];

      var groupRelation = new Relationship(relationship);
      
      this.addRelation(groupRelation, Relation.DIRECTION.upstream);
      toNode.addRelation(groupRelation, Relation.DIRECTION.downstream);
  };

  Node.prototype._loadNodesWithGroups = function(ciName, addition, direction){
      var ciName = this.get('logical.name');  
      var relationSql = prepareSql(_groups[direction].relationSql, ciName);
      var node = this;

      var threshold = VisualAdmin.lookup("0").get("default.display.threshold");

      var ret = [];
      var f = lib.c.$('cirelationship').select(relationSql).iterate(function(relation){
          var count = relation[3];
          var relationSubType     = relation[0];
          var nodeType    = relation[1];
          var nodeSubType = relation[2];
          var relationType = null;

          if(count>=threshold){
              var name = nodeSubType || nodeType;
              var group = new Group(nodeSubType, nodeType, count, relationType, relationSubType).createGroupNode(node,name,direction, ciName);
              ret.push(group);
          } else {
              var deviceSql = prepareSql(_groups[direction].deviceSql, ciName, relationSubType, nodeType, nodeSubType);
              var f = lib.c.$('device').select(deviceSql).iterate(function(item){
                  var toNode = Node.get(item[0]);
                  if (toNode === undefined) {
                      toNode = new Node(item);
                  }
                  
                  if(direction == Relation.DIRECTION.upstream){
                      toNode.makeRelation(node, relationType, relationSubType);
                  } else {
                      node.makeRelation(toNode, relationType, relationSubType);
                  }
                  
                  ret.push(toNode);
              });
          }
      });

      utils.each(ret, function(item){
          Node.put(item.get('logical.name'),item);
      }, this);
      
      return ret;
  };
  
  var _groups = {
          "upstream" : {
              expanedSql: ' select d.logical.name, m.relationship.type, m.relationship.subtype '
                  +' from device d join cirelationship m on (m.logical.name=d.logical.name) '
                  +' where m.related.cis=%1 and d.logical.name isin $currentNodeList',

              relationSql: 'select m.relationship.subtype, d.type, d.subtype, count(*) '
                  +' from cirelationship m join device d on (m.logical.name=d.logical.name) '
                  +' where m.related.cis=%1  and not d.logical.name isin $currentNodeList group by m.relationship.subtype, d.type, d.subtype',    

              deviceSql: ' select d.* '
                  +' from device d join cirelationship m on (m.logical.name=d.logical.name) '
                  +' where m.related.cis=%1 and m.relationship.subtype=%2 and d.type=%3 and d.subtype=%4'
          },
          
          "downstream" : {
              expanedSql: ' select d.logical.name, m.relationship.type, m.relationship.subtype '
                  +' from device d join cirelationship m on (d.logical.name=m.related.cis) '
                  +' where m.logical.name=%1 and d.logical.name isin $currentNodeList',


              relationSql: 'select m.relationship.subtype, d.type, d.subtype, count(*) '
                  +' from cirelationship m join device d on (m.related.cis=d.logical.name) '
                  +' where m.logical.name=%1 and not d.logical.name isin $currentNodeList '
                  +' group by m.relationship.subtype, d.type, d.subtype',    

              deviceSql: ' select d.* '
                  +' from device d join cirelationship m on (m.related.cis=d.logical.name) '
                  +' where m.logical.name=%1 and m.relationship.subtype=%2 and d.type=%3 and d.subtype=%4'
          }
  };

  Node.prototype._loadExpanedNodes = function(ciName, direction){
      var sql = prepareSql(_groups[direction].expanedSql, ciName);

      var node= this;
      var f = lib.c.$('device').select(sql).iterate(function(item){
//        var f = new SCFile('device');
        var toNode = Node.lookup(item[0]);
        
        if(direction == Relation.DIRECTION.upstream){
            toNode.makeRelation(node, item[1], item[2]);
        } else {
            node.makeRelation(toNode, item[1], item[2]);
        }
        
      });
  };
  
  Node.prototype.loadDirectionNodes = function(direction) {
      var addition = vars.$ciListFromGroup;
      
      var ciName = this.get('logical.name');
      vars.$currentNodeList = [];
      
      utils.each(Node.filter(function(node) {
          return !node.isGroup();
      }, this), function(node){vars.$currentNodeList.push(node.getName());}, this);
      
      var node = this;
      
      this._loadExpanedNodes(ciName, direction);
      var ret = this._loadNodesWithGroups(ciName, addition, direction);
      return ret;
  };
  
  // Node.prototype.loadDirectionNodes= // one(function(direction){return this._loadDirectionNodes(direction);}, this);
  
  //////////////////////////////// XML function start ////////////////////////////
  VisualLabel.prototype.format = function(xmldoc, text) {
    var xmlLabel = xmldoc.createNode(XMLNode.ELEMENT_NODE, "label");
    var font = this.get("label.font");
    var size = this.get("label.size");
    var style = this.get("label.style");
    font && xmlLabel.addAttribute("font", font);
    size && xmlLabel.addAttribute("size", size);
    style && xmlLabel.addAttribute("style", style);
    xmlLabel.setValue(text);
    return xmlLabel;
  };
  
  VisualIcon.prototype.toXML = function(xmldoc) {
    var value = [ "scattach://img", this.get("uid"), this.get("filename"), 
                  this.get("application"),  this.get("topic") ].join(':');
    var icon = xmldoc.createNode(XMLNode.ELEMENT_NODE, "icon");
    icon.setValue(value);
    return icon;
  };
  
  VisualDecorator.prototype.toXML = function(xmldoc, node) {
    var xmlIcon = xmldoc.createNode(XMLNode.ELEMENT_NODE, "icon");
    
    var position = this.get("position");
    position && xmlIcon.addAttribute("position", position);

    var category = this.get("category");
    category && xmlIcon.addAttribute("group", category);
    
    var xmlPath = xmldoc.createNode(XMLNode.ELEMENT_NODE, "path");
    xmlPath.setValue(this.get("strSysAttach"));
    xmlIcon.appendNode(xmlPath);

    var device = node.getRecord();
    var decorator = this.getRecord();
    // TODO check this method to see if there is any possible to improve performance
    var text = lib.ciVizBalloonHelper.getBalloonText(device, decorator, true);
    if (text) {
      var xmlBalloon = xmldoc.createNode(XMLNode.ELEMENT_NODE, "balloon");
      xmlBalloon.setValue(text);
      xmlIcon.appendNode(xmlBalloon);
    }
    return xmlIcon;
  };
  
  function Edge(from, to, relation) {
    this.from = from;
    this.to = to;
    this.relation = relation;
  }
  
  Edge.prototype.highlights = function() {
    // Because the line is undirect. and only downstream relation is drawn
    // So here we can treat "from" as the upstream node and "to" is the 
    // downstream node
    var highlights = [];
    var toDecorators = utils.map(this.to.decorators(), function(decorator) {
      return {
        "priority" : decorator.get("priority"),
        "color" : decorator.get("highlight.upstream")
      };
    });
    highlights = highlights.concat(toDecorators);
    var fromDecorators = utils.map(this.from.decorators(), function(decorator) {
      return {
        "priority" : decorator.get("priority"),
        "color" : decorator.get("highlight.downstream")
      };
    }); 
    highlights = highlights.concat(fromDecorators);
    
    return utils.filter(highlights, function(decorator) {
          return !!decorator.color;
        }).sort(function(a, b) {
      return a.priority - b.priority;
    });
    
  };
  
  Edge.prototype.toXML = function(xmldoc) {
    var type = this.relation.get("relationship.type");
    var subtype = this.relation.get("relationship.subtype");
    /* 
        in uCMDB CP, the type of relationship is null, uses Physical as the default display style
    */
    var relationship = VisualRelationship.lookup(type, subtype) || 
                       VisualRelationship.lookup(type, "") || 
                       VisualRelationship.lookup("Physical", subtype) ||
                       VisualRelationship.lookup("Physical", "");
    
    var line = VisualLine.lookup(relationship.get("line.name"));
    
    var xmlEdge = xmldoc.createNode(XMLNode.ELEMENT_NODE, "edge");
    xmlEdge.addAttribute("from", this.from.getName());
    xmlEdge.addAttribute("to", this.to.getName());
    xmlEdge.addAttribute("id", (this.from.getName() + this.relation.get("relationship.name")));
    
    var xmlAttr = xmldoc.createNode(XMLNode.ELEMENT_NODE, "attr");
    xmlAttr.addAttribute("name", "Viz");
    
    var xmlLine = xmldoc.createNode(XMLNode.ELEMENT_NODE, "line");
    xmlLine.addAttribute("color", "#" + line.get("line.color"));
    xmlLine.addAttribute("style", line.get("line.style"));
    xmlLine.addAttribute("weight", line.get("line.weight"));
    
    var highlights = this.highlights();
    if (highlights && highlights.length > 0) {
      // Though there may exists several ones, but only one color can be displayed at the same time
      // so choose the highest priority one
      // TODO do we need to highlight group node ? Since group node is a fake device
      var highlight = highlights[0].color;
      xmlLine.addAttribute("highlightcolor", "#" + highlight);
    }
    
    xmlAttr.appendNode(xmlLine);
    xmlAttr.appendNode(VisualLabel.lookup('DEFAULT').format(xmldoc, subtype));
    xmlEdge.appendNode(xmlAttr);
    return xmlEdge;
  };

  Node.prototype.label = function() {
    var name = this.getLabel();
    return {
      "toXML" : function(xmldoc) {
        return VisualLabel.lookup('DEFAULT').format(xmldoc, name);
      }
    };
  };

  Node.prototype.icon = function() {
    var type = this.get("type");
    var subtype = this.get("subtype");
    var application = "civisualizationdevice";
    var icon = VisualIcon.lookup(application, type + subtype) || 
               VisualIcon.lookup(application, type + "none") || 
               VisualIcon.lookup(application, "DEFAULTDEFAULT");
    return {
      "toXML" : function(xmldoc) {
        return icon != null ? icon.toXML(xmldoc) : xmldoc.createNode(XMLNode.ELEMENT_NODE, "icon");
      }
    };
  };
  
  Node.prototype.tooltip = function() {
    var type = this.get("type");
    var subtype = this.get("subtype");
    var tooltip = VisualDevice.lookup(type + subtype) ||
                  VisualDevice.lookup(type + "none") ||
                  VisualDevice.lookup("DEFAULTDEFAULT");
    var text = "";
    if(this.isGroup()){
        text = "<p>Type: "+type+"</p>";
        if(subtype) {
          text += "<p>Subtype: "+subtype+"</p>";
        }      
    } else {
        text = lib.ciVizBalloonHelper.getBalloonText(this.getRecord(), tooltip.getRecord(), false);
    }
    //var text = lib.ciVizBalloonHelper.getBalloonText(this.getRecord(), tooltip.getRecord(), false);
    return {
      "toXML" : function(xmldoc) {
        var balloon = xmldoc.createNode(XMLNode.ELEMENT_NODE, "balloon");
        balloon.setValue(text);
        return balloon;
      }
    };
  };
  
  function Action(type) {
    this.type = type;
  }
  
  Action.prototype.toXML = function(xmldoc) {
    var xmlAction = xmldoc.createNode(XMLNode.ELEMENT_NODE, "action");
    switch (this.type) {
    case "XMLADD":
      xmlAction.addAttribute("type", this.type);
      xmlAction.setValue(this.type);
      break;
    case "detail":
      xmlAction.addAttribute("type", this.type);
      xmlAction.addAttribute("label","View CI Details");
      xmlAction.addAttribute("forcemenu", "true");
      xmlAction.addElement("action").setValue("detail");
      break;
    case "expand":
      xmlAction.addAttribute("type", this.type);
      xmlAction.addAttribute("label", "Expand Group");
      xmlAction.addAttribute("forcemenu", "true");
      break;
    default:
      throw new Error("Illegal action type: [{0}]".format(this.type));
    }
    return xmlAction;
  };
  
  Node.prototype.actions = function() {
    var actions = [];
    // TODO maybe add "MINUS" sign here ?
    if (this.hasFoldingNodes()) {
      actions.push(new Action("XMLADD"));
    }
    
    if (this.isGroup()) {
      actions.push(new Action("expand"));
    } else {
      actions.push(new Action("detail"));  
    }
    return actions;
  };
  
  Node.prototype.focus = function() {
    var node = this;
    return { 
      "toXML": function(xmldoc) {
        if (node.isFocus() && VisualDecorator.lookup("Point of Focus")) {
          var icon = VisualIcon.lookup("civisualizationdecorator", "Point of Focus");
          return icon && icon.toXML(xmldoc);
        }
        return null;
      } 
    };
  };
  
  Node.prototype.group = function() {
    var node = this;
    return {
      "toXML" : function(xmldoc) {
        if (node.isGroup() && VisualDecorator.lookup("Group Icon")) {
          var icon = VisualIcon.lookup("civisualizationdecorator", "Group Icon");
          return icon && icon.toXML(xmldoc);
        }
        return null;
      }
    };
  };

  Node.prototype.toXML = function(xmldoc) {
    var xmlNode = xmldoc.createNode(XMLNode.ELEMENT_NODE, "node");
    xmlNode.addAttribute("id", this.getName());
    var xmlAttr = xmlNode.addElement("attr");
    xmlAttr.addAttribute("name", "Viz");
    var label = this.label().toXML(xmldoc);
    xmlAttr.appendNode(this.label().toXML(xmldoc));
    xmlAttr.appendNode(this.group().toXML(xmldoc));
    xmlAttr.appendNode(this.focus().toXML(xmldoc));
    xmlAttr.appendNode(this.icon().toXML(xmldoc));
    xmlAttr.appendNode(this.tooltip().toXML(xmldoc));
    utils.each(this.decorators(),function(decorator) {
      xmlAttr.appendNode(decorator.toXML(xmldoc, this));
    }, this);
    utils.each(this.actions(),function(action) {
      xmlAttr.appendNode(action.toXML(xmldoc));
    }, this);
    return xmlNode;
  };

  function createXMLDocument() {
    var xmldoc = new XML("gxl");
    var graph = xmldoc.addElement("graph");
    graph.addAttribute("id", "mygraph");
    utils.each(Node.filter(function(node) {
      return node.isVisible();
    }, this), function(node) {
      // Group node need set variable to let client know how to expand
      node.setEnvironment();
      graph.appendNode(node.toXML(graph));
    }, this);

    utils.each(Relation.edges(), function(edge) {
      graph.appendNode(edge.toXML(graph));
    }, this);
    
    return xmldoc;
  }
  
  return {
    "createNode" : function(name) {
      return Node.lookup(name).attachGraph();
    },
    "createXMLDocument" : createXMLDocument,
    "updateContext" : function(local) {
      context.update(local);
    },
    "diagnostic" : function(console) {
      repo.diagnostic(console);
    },
    "get" : function() {
      return context;
    },
    'doExpand':function(){
        var addition = vars.$displayedFromGroupCis;
        var pattern = /logical.name=(["'])([^"]+)\1/g;
        if (addition && vars.$nodeId) {
          var result;
          while ((result = pattern.exec(addition)) != null) {
            // XXX this method is not that bad as it looks like
            // since when generating graph, the related nodes have already been loaded (they are
            // required when grouping node by the "type"/"subtype"). Instead if use sql string
            // to query database, it will cost a lot of resource and discard the result.
              var name = result[2];
              var groupNode = Node.lookup(vars.$nodeId);
              groupNode.getGroup().count = groupNode.getGroup().count-1;
              var node = graph.createNode(name);
              node._loadExpanedNodes (node.getName(), 'upstream');
              node._loadExpanedNodes (node.getName(), 'downstream');
              vars.$currentNodeList.push(node.getName());
              node.attachGraph();
          }
        }
        
        vars.$displayedFromGroupCis = null;
        vars.$nodeId = null;
    }
  };
})();

var generateGraph = function(name) {
  funcs.cleanup(vars.$displayedFromGroupCis);
  funcs.cleanup(vars.$relatedCis);
  funcs.cleanup(vars.$relatedNodeIds);
  
  var token = vars["$L.file"]["logical.name"];
  var local = sm.request(token);
  utils.each(["device", "_relation_", "cirelationship"],function(name) {
    local[name] = local[name] || {};
  }, this);
  
  /*
   * Here assume service manager script library was running in single thread mode
   * If library was invoke by multi-thread simultaneously, it will cause critical
   * problem.
   */
  graph.updateContext(local);
  
  // By default expand current selected nodes, and add expanded nodes to graph
  graph.createNode(name).loadRelatedNodes();
  graph.doExpand();
  
  return graph.createXMLDocument().toXMLString();
};

function printRepositoryStatistics() {
  graph.diagnostic(console);
}

function refreshCurrent(repo) {
    graph.get().clean(repo);
}

function getGraph(name) {
    return generateGraph(name);
}


function time(func, name, that) {
  return function() {
    var start = new Date().getTime();
    var result = func.apply(that, arguments);
    var end = new Date().getTime();
    console("Execute [{0}] consumed {1}ms".format(name, (end - start)));
    return result;
  };
}

var generateGraphWithTime = time(generateGraph, "generateGraph", this);
