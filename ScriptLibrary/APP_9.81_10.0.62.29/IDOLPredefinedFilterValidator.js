var _ = lib.Underscore.require(),
    IDOLQueryEvaluator = lib.IDOLQueryEvaluator.require(),
    IDOLGlobalSearchLibrary = lib.IDOLGlobalSearchLibrary.require(),
    IDOLGlobalSearchSandbox = lib.IDOLGlobalSearchSandbox.require(),
    IDOLGlobalSearchPreconditionCriteria = lib.IDOLGlobalSearchPreconditionCriteria.require();

var IDOLPredefinedFilterValidator = (function() {

  // ESS side user can see much less library
  // the library visible condition was evaluate by kmaccess script
  // ScriptLibrary -> *_kmaccess
  //
  // In OOB, only Catalog_Library and Knowledge_Library are exposed to ESS.
  function validateChosenLibrary(record) {
    var libnames = IDOLGlobalSearchSandbox.evaluate({
      '$G.ess' : !!record.ess
    }, function() {
      var kmlibs = IDOLGlobalSearchLibrary.getLibraryList();
      return _.pluck(kmlibs, 'name');
    });

    var libraries = record.library.toArray(), 
        length = libraries.length, 
        i;

    for (i = 0; i < length; i++) {
      var libname = libraries[i];
      if (!_.contains(libnames, libname)) {
        var message = funcs.scmsg('invalid.library', 'idol', [ libname ]);
        throw {
          field : 'library',
          line : (i + 1), 
          message : message
        };
      }
    }
  }

  function validatePrecondition(record) {
    var filename = record.filename,
        criteria = record.criteria;

    if (!filename || !criteria) {
      // skip validation if no value fulfilled
      return;
    }

    var ast = IDOLGlobalSearchSandbox.evaluate({
      '$L.file' : new SCFile(filename, SCFILE_READONLY)
    }, function() {
      try {
        return parseQuery(criteria);  
      } catch(e) {
        throw { field : 'criteria', message : e };
      }
    });
    var usedfields = IDOLQueryEvaluator.collectFieldNames(ast);
    var availablefields = getValidFieldNames(filename);

    var unknowfields = _.reduce(availablefields, _.without, usedfields);
    if (unknowfields.length > 0) {
      var names = unknowfields.join(',');
      var message = funcs.scmsg('unknown.field', 'idol', [ filename, names ]);
      throw { field : 'criteria', message : message };
    }

    try {
      IDOLGlobalSearchPreconditionCriteria.compile(ast);
    } catch (e) {
      throw { field : 'criteria', message : e };
    }
  }

  function validatePredefinedFilters(record) {
    var libraries = record.library.toArray(),
        sqls = record.sql.toArray(),
        length = libraries.length,
        i;

    for (i = 0; i < length; i++) {
      var libname = libraries[i], sql = sqls[i];
      validatePredefinedFilter(libname, sql, i + 1);
    }
  }

  function getValidDataPolicyFields(filename) {
    var datadict = new SCFile('datadict', SCFILE_READONLY);
    var rc = datadict.doSelect(new QueryCond('name', EQ, filename));
    return rc === RC_SUCCESS ? datadict.fields.toArray() : [];
  }

  // TODO: need refactor to handle jointable at one place
  function getValidFieldNames(filename) {
    var joindefs = new SCFile('joindefs', SCFILE_READONLY);
    var rc = joindefs.doSelect(new QueryCond('join.name', EQ, filename));
    if (rc === RC_SUCCESS) {
      var tables = joindefs.join_tables, fields = [], i, length;
      for (i = 0, length = tables.length(); i < length; i++) {
        var _filename = tables[i].table_name;
        var _fields = getValidDataPolicyFields(_filename);
        fields = fields.concat(_fields);
      }
      return _.uniq(fields);
    } else {
      return getValidDataPolicyFields(filename);
    }
  }

  function validateFieldNames(kmlib, usedfields, cursor) {
    var filename = kmlib.sclibtablename;

    var availablefields = getValidFieldNames(filename);

    var unknowfields = _.reduce(availablefields, _.without, usedfields);
    if (unknowfields.length > 0) {
      var names = unknowfields.join(',');
      var message = funcs.scmsg('unknown.field', 'idol', [ filename, names ]);
      throw {
        field : 'sql',
        line : cursor, 
        message : message
      };
    }
  }

  function validateIndexedFields(kmlib, usedfields, cursor) {
    var kbfields = kmlib.kbfields;

    var indexedfields = _.pluck(kbfields, 'kbfieldname');
    var invalidfields = _.reduce(indexedfields, _.without, usedfields);
    if (invalidfields.length > 0) {
      var libname = kmlib.kbname, names = invalidfields.join(',');
      var message = funcs.scmsg('not.indexed.fields', 'idol', [ libname, names ]);
      throw {
        field : 'sql',
        line : cursor, 
        message : message
      };
    }
  }

  function validatePredefinedFilter(libname, sql, cursor) {
    // only sclib need this validation
    var kmlib = IDOLGlobalSearchLibrary.getLibrary({ kbname : libname, kbtype : 'sclib' });
    // skip weblib/fsyslib/splib or doesn't have sql defined
    if (kmlib && sql) {

      var filename = kmlib.sclibtablename;
      var ast = IDOLGlobalSearchSandbox.evaluate({
        '$L.file' : new SCFile(filename, SCFILE_READONLY)
      }, function() {
        try {
          return parseQuery(sql);
        } catch(e) {
          throw { field : 'sql', line: cursor, message : e };
        }
      });
      var usedfields = IDOLQueryEvaluator.collectFieldNames(ast);

      validateFieldNames(kmlib, usedfields, cursor);
      validateIndexedFields(kmlib, usedfields, cursor);
    }
  }

  function validate(record) {
    validateChosenLibrary(record);
    validatePrecondition(record);
    validatePredefinedFilters(record);
  }

  return {
    validate : validate
  };
}());


function validate(record) {
  try {
    IDOLPredefinedFilterValidator.validate(record);
    return true;
  } catch (e) {
    var field = e.field;
    if (!field) { throw e; }

    vars['$L.failed.message'] = e.message;

    var cursor = e.line;
    // by default formatctrl cannot set focus right to array field
    // RAD: format.cval
    // Panel: calc.validations
    if (cursor) {
      funcs.cursor_field_name_set(field, cursor);
    } else {
      funcs.cursor_field_name_set(field);
    }
  }
  return false;
}