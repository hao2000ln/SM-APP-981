var _ = lib.Underscore.require(),
    IDOLPreference = lib.IDOLPreference.require(),
    IDOLGlobalSearchFieldCaption = lib.IDOLGlobalSearchFieldCaption.require();

var IDOLGlobalSearchLibrary = (function() {

  var STATUS = {
    INDEXING: lib.KMCollection_Status_Constant.INDEXSTATUS_INDEXING(),
    FINISHED: lib.KMCollection_Status_Constant.INDEXSTATUS_FINISHED(), 
    NOT_STARTED : lib.KMCollection_Status_Constant.INDEXSTATUS_NOTSTARTED()
  };

  function getLibraryList() {
    var operator = funcs.operator();
    var databases =  [];
    var kmbase = new SCFile("kmknowledgebase", SCFILE_READONLY);
    var rc = kmbase.doSelect(new QueryCond('indexstatus', ISIN, [ STATUS.INDEXING, STATUS.FINISHED, STATUS.NOT_STARTED ]));

    while (rc === RC_SUCCESS) {
      var accessScript = lib[kmbase.kbaccessscript];
      if (accessScript && accessScript.checkAccess && accessScript.checkAccess(operator, kmbase)) {
        var namesMapping = {};
        if (kmbase.kbtype === 'sclib') {
          namesMapping = IDOLGlobalSearchFieldCaption.getCaptions(kmbase.sclibtablename);
        }

        var fields = _.map(kmbase.kbfields, function(field) {
          var name = field.kbfieldname,
              caption = namesMapping[name] || field.kbfieldvalue;

          return {
            name : name,
            type : field.kbfieldtype,
            match : !!field.match,
            caption : caption
          };
        });

		// check English scmessage first
		var query = 'syslanguage="en" and class="local:kmknowledgebase" and message.id="' + kmbase.kbname + '"';
		var fmsg = lib.c.$("scmessage", SCFILE_READONLY).select(query).uniqueResult();

		var vDescription;
		if (fmsg != null) {
        	vDescription = funcs.scmsg(kmbase.kbname, "local:kmknowledgebase");
        }
        else {
           vDescription = funcs.nullsub(kmbase.kbdescription, kmbase.kbname);
        }

        databases.push({
          name: kmbase.kbname,
          text: vDescription,
          table: kmbase.sclibtablename,
          type: kmbase.kbtype,
          fields: fields
        });
      }
      rc = kmbase.getNext();
    }
    return databases;
  }
  
  function getAllLibraryList() {
    var operator = funcs.operator();
    var databases =  [];
    var kmbase = new SCFile("kmknowledgebase", SCFILE_READONLY);
    var rc = kmbase.doSelect(new QueryCond('indexstatus', ISIN, [ STATUS.INDEXING, STATUS.FINISHED ]));

    while (rc === RC_SUCCESS) {
      //var accessScript = lib[kmbase.kbaccessscript];
      //if (accessScript && accessScript.checkAccess && accessScript.checkAccess(operator, kmbase)) {
        var namesMapping = {};
        if (kmbase.kbtype === 'sclib') {
          namesMapping = IDOLGlobalSearchFieldCaption.getCaptions(kmbase.sclibtablename);
        }

        var fields = _.map(kmbase.kbfields, function(field) {
          var name = field.kbfieldname,
              caption = namesMapping[name];

          return {
            name : name,
            type : field.kbfieldtype,
            match : !!field.match,
            caption : caption
          };
        });

        databases.push({
          name: kmbase.kbname,
          text: kmbase.kbdescription || kmbase.kbname,
          table: kmbase.sclibtablename,
          type: kmbase.kbtype,
          fields: fields
        });
      //}
      rc = kmbase.getNext();
    }
    return databases;
  }

  function getLibraryWithSelection() {
    var libraries = IDOLGlobalSearchLibrary.getLibraryList(),
        selectedLibs = IDOLPreference.getLibraries();

    // library selection preference not exists, check them all
    if (!selectedLibs) { 
      return _.map(libraries, function(library) {
        library.selected = true;
        return library;
      });
    } else {
      // otherwise pick the library which saved in preference definition
      return _.map(libraries, function(library) {
        library.selected = (_.indexOf(selectedLibs, library.name) !== -1);
        // library.filters = 
        return library;
      });
    }
  }


  function isCatalog(kmlib) {
    return kmlib.sclibtablename === 'joinsvcDisplay';
  }

  function isKMDocument(kmlib) {
    return kmlib.sclibtablename === 'kmdocument';
  }

  var KNOWN_ERROR_FINGER_PRINT = /isKnownError\s*=\s*true/;

  var isPDProblemEnabled = lib.ProcessDesignerEnablement.isProblemEnabled();
  
  function isPDKnownError(kmlib) {
    if (kmlib.sclibtablename === 'rootcause' && isPDProblemEnabled) {
      var sql = kmlib.scquery || '';
      return KNOWN_ERROR_FINGER_PRINT.test(sql);
    }
    return false;
  }

  function isPDProblem(kmlib) {
    return kmlib.sclibtablename === 'rootcause' && !isPDKnownError(kmlib);
  }

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // km library and scfile are not one-to-one relation
  // this method can only be used in limited scenario
  function getLibraryByFilename(filename) {
    var kmbase = new SCFile("kmknowledgebase", SCFILE_READONLY);
    var rc = kmbase.doSelect(new QueryCond('sclibtablename', EQ, filename));
    if (rc === RC_SUCCESS) {
      return kmbase;
    }
    return null;
  }

  function getLibrary(matches) {
    var kmlib = new SCFile('kmknowledgebase', SCFILE_READONLY), querycond, rc;
    if (_.isString(matches)) {
      querycond = new QueryCond('kbname', EQ, matches);
    } else if (_.isObject(matches)) {
      querycond = _.reduce(matches, function(memo, v, k) {
        var cond = new QueryCond(k, EQ, v);
        return memo ? memo.and(cond) : cond;
      }, null);
    }
    rc = kmlib.doSelect(querycond);
    return rc === RC_SUCCESS ? kmlib : null;
  }

  return {
    isCatalog : isCatalog,
    isKMDocument : isKMDocument,
    isPDKnownError : isPDKnownError,
    isPDProblem : isPDProblem,
    getLibrary : getLibrary,
    getLibraryWithSelection : getLibraryWithSelection,
    getLibraryList : getLibraryList,
    getAllLibraryList : getAllLibraryList,
    getLibraryByFilename : getLibraryByFilename
  };
}());

function require() {
  return IDOLGlobalSearchLibrary;
}
