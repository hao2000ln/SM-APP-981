var _ = lib.Underscore.require(),
  scmsg = funcs.scmsg;

var IDOLCommon = (function() {

  function dateformat(date) {
    var out = "";
    if (date) {
      out += date.getFullYear() + '/';
      if (date.getMonth() < 9) {
        out += "0";
      }
      out += (date.getMonth() + 1) + '/';
      if (date.getDate() < 10) {
        out += "0";
      }
      out += date.getDate();
    }
    return out;
  }

  function dateformatEpoc(date) {
    return Math.round( date.getTime()/1000 ) + 'e';
  }

  // XXX: These names should not globalize, because some feature depends on it as a query condition
  var FEATURES = {
    SC : 'Smart Tickets',
    HTA : 'Hot Topic Analyzer'
  };

  var FEATURES_DISPLAY = {
    SC  : scmsg(63, 'idol'),
    HTA : scmsg(60, 'idol')
  };

  function getReferenceFields(filename) {
    var keys = funcs.dbdict_helper("unique.key", filename);
    return keys.toArray();
  }

  function convertToIDOLFieldName(fieldname) {
    var name = fieldname || "";
    return name.replace(/\./g, "_")
      .replace(/,/g, ".")
      .toUpperCase();
  }

  function compositeCriteria(sqls, op) {
    if (_.isArray(sqls)) {
      if (sqls.length > 1) {
        return _.chain(sqls)
          .compact()
          .map(function(sql) { return ' (' + sql + ') '; })
          .value()
          .join(op);
      } else {
        return sqls[0] || '';
      }
    }
    return sqls;
  }

  function toHiddenMatchField(fieldname) {
    return '_HID_' + convertToIDOLFieldName(fieldname) + '_MATCH';
  }

  function escapeFieldTextValueSpecialCharacter(value) {
    if (value === null || value === undefined) { return ""; }
    // when value equal boolean 'false', should return a string "false"
    value = value.toString();

    // XXX: From IDOL official document
    //
    // > To distinguish curly braces in strings from query syntax, percent-encode left ({) and right (}) braces twice, as %257B and %257D.
    // > To distinguish commas in strings from separator commas, percent-encode commas twice in strings (%252C).
    // 
    // But encode twice doesn't work !!
    return value.replace(/%/g,"%25")
                .replace(/\\/g,"%5C")
                .replace(/,/g,"%2C")
                .replace(/&/g,"%26")
                .replace(/\{/g,"%7B")
                .replace(/\}/g,"%7D");
  }

  function getTableNames(filename, joins) {
    var subs = joins[filename];
    if (!!subs) {
      return _.reduce(subs, function(memo, name) {
        var names = getTableNames(name, joins);
        return memo.concat(names);
      }, []);
    }
    return [filename];
  }

  var NOT_DUPLICATE = 0x08;

  // var NOT_NULL = 0x04,
  // var UNIQUE = NOT_NULL + NOT_DUPLICATE;
  // 
  // XXX: for `joinsvcDisplay`, we have to use 'displayId'
  // and 'displayId' is only NOT_DUPLICATE, can be null
  // it's a little weak validation than expected
  function isUniqueKey(key) {
    var flag = key.flags;
    return (NOT_DUPLICATE & flag) === NOT_DUPLICATE;
  }

  // XXX: for cm3r, its unique key has hierachy, like 'header,number', 
  // but only the last field name part is required
  function shortname(name) {
    var position = name.lastIndexOf(',');
    return name.substr(position + 1);
  }

  function findUniqueKeys(filename) {
    var dbdict = new SCFile('dbdict', SCFILE_READONLY);
    var rc = dbdict.doSelect(new QueryCond('name', EQ, filename));
    if (rc !== RC_SUCCESS) {
      throw new Error(filename + ' is not a valid database table name');
    }
    return _.chain(dbdict.key)
      .filter(isUniqueKey)
      .map(function(key) { return _.map(key.name, shortname); })
      .value();
  }

  function createJoinFileComponents() {
    var joins = {};
    var joindefs = new SCFile('joindefs', SCFILE_READONLY);
    var rc = joindefs.doSelect(true);
    while (rc === RC_SUCCESS) {
      var name = joindefs['join.name'];
      var jointables = joindefs['join.tables']; // SCArray
      var tables = _.map(jointables, function(t) { return t['table.name']; });
      joins[name] = tables;
      rc = joindefs.getNext();
    }
    return joins;
  }

  var memoizedJoinMappings = _.memoize(createJoinFileComponents);

  function findAllUniqueKeys(filename) {
    var joins = memoizedJoinMappings();
    var names = getTableNames(filename, joins);
    var keys = _.reduce(names, function(memo, name) {
      var uniques = findUniqueKeys(name);
      return memo.concat(uniques);
    }, []);

    return _.chain(keys)
      .filter(function(fields) { return fields.length === 1; })
      .map(function(fields) { return fields[0]; })
      .value();
  }


  
  // XXX: lib.GetFieldNames.getAllFields doesn't return ALL fields
  //
  // for example:
  // `lib.GetFieldNames.getAllFields('cm3r')[0].length()` can only return 116 fields
  // but system actually have 301 (count on alias)
  function getAllFields(filename) {
    var joins = memoizedJoinMappings();
    var names = getTableNames(filename, joins);
    return _.chain(names)
      .reduce(function(memo, name) {
        var dbdict = new SCFile('dbdict', SCFILE_READONLY);
        var rc = dbdict.doSelect(new QueryCond('name', EQ, name));
        if (rc !== RC_SUCCESS) {
          throw new Error('dbdict not exists ' + name);
        }
        var fieldnames = _.map(dbdict.field, function(field) {
          return field.name;
        });
        return memo.concat(fieldnames);
      }, [])
      .uniq()
      .value();
  }

  function getIdentity(record) {
    var unique = new SCDatum();
    var rc = funcs.getunique(unique, record);
    if (!rc) {
      throw new Error('unable to get the unique value from: ' + recrod);
    }
    return unique.join('-');
  }

  function toSCArray(values) {
    var arr = new SCDatum();
    arr.setType(8);
    _.each(values, function(v) {
      arr.push(v);
    });
    return arr;
  }

  // split large array into chunks
  function chunk(list, size) {
    size = size || 1;
    var lists = _.groupBy(list, function(d, index) {
      return Math.floor(index / size);
    });
    return _.toArray(lists);
  }

  var RECORD_ITERATION_CHUNK_SIZE = 100;


  function createSCFileSQLIterator(filename, sql) {
    return function(callback, scope) {
      var target = new SCFile(filename, SCFILE_READONLY);
      var rc = target.doSelect(sql), i = 0;
      while(rc === RC_SUCCESS) {
        var result = callback.call(scope, target, i++);
        if (result === false) { return false; }
        rc = target.getNext();
      }
      return target;
    };
  }

  function iterateSCFileWithSQL(filename, sql, callback, scope) {
    var iterator = createSCFileSQLIterator(filename, sql);
    return iterator.call(scope, callback, scope);
  }

  // XXX: SQL query has length limit, sometimes we need to iterate large
  // amount of data with ID speicified, iterate them one by one can have 
  // performance issue.
  //
  // e.g.
  // need to iterate thousands of test sample in SmartTicket testing
  // 
  // in this case, split IDs into chunks and load them in a batch
  function createSCFileIDsIterator(filename, ids, chunkSize) {
    chunkSize = chunkSize || RECORD_ITERATION_CHUNK_SIZE;
    var keys = funcs.dbdict_helper('unique.key', filename);
    if (keys.length() !== 1) {
      throw new Error('composite unique key is not supported');
    }
    var key = keys[0], abortIteration = false, lists = chunk(ids, chunkSize);

    return function(callback, scope) {
      _.each(lists, function(ids) {
        if (abortIteration) { return; }

        var query = new QueryCond(key, ISIN, ids);
        var rc = iterateSCFileWithSQL(filename, query, callback, scope);
        if (rc === false) { abortIteration = true; }
      });
    };
  }

  return {
    getReferenceFields   : getReferenceFields,
    dateformat           : dateformat,
    dateformatEpoc       : dateformatEpoc,
    FEATURES             : FEATURES,
    FEATURES_DISPLAY     : FEATURES_DISPLAY,
    toIDOLFieldName      : convertToIDOLFieldName,
    compositeCriteria    : compositeCriteria,
    toHiddenMatchField   : toHiddenMatchField,
    escapeFieldTextValue : escapeFieldTextValueSpecialCharacter,
    findUniqueKeys       : findAllUniqueKeys,
    getAllFields         : getAllFields,
    getIdentity          : getIdentity,
    toSCArray            : toSCArray,
    createSCFileIDsIterator : createSCFileIDsIterator,
    createSCFileSQLIterator : createSCFileSQLIterator
  };
}());


function require() {
  return IDOLCommon;
}