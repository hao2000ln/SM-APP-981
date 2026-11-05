var _ = lib.Underscore.require(),
    IDOLGlobalSearchLibrary = lib.IDOLGlobalSearchLibrary.require(),
    IDOLGlobalSearchHighLight = lib.IDOLGlobalSearchHighLight.require(),
    IDOLGlobalSearchSandbox = lib.IDOLGlobalSearchSandbox.require(),
    IDOLGlobalSearchReplica = lib.IDOLGlobalSearchReplica.require(),
    IDOLAdvancedSettings = lib.IDOLAdvancedSettings.require(),
    IDOLKMFieldMapping = lib.IDOLKMFieldMapping.require(),
    IDOLQueryEvaluator = lib.IDOLQueryEvaluator.require(),
    IDOLKMNLProcessing = lib.IDOLKMNLProcessing.require(),
    IDOLKMSecurity = lib.IDOLKMSecurity.require(),
    IDOLKMSorting = lib.IDOLKMSorting.require(),
    IDOLSMProfile = lib.IDOLSMProfile.require(),
    IDOLCommon = lib.IDOLCommon.require(),
    KMQuery_IDOL = lib.KMQuery_IDOL.require(),
    DisplayName = lib.DisplayName;

var GlobalSearchSettings = IDOLAdvancedSettings.GlobalSearch;

var IDOLKMQueryParameter = (function() {

  var PARAMETRIC_SEARCH_PARAMS_KEY     = '__field__';
  var SEARCH_WITHIN_RESULT_PARAMS_KEY  = '__history__';
  var GLOBAL_CRITERIA_PARAMS_KEY       = '__global__';
  var PRECONDITION_CRITERIA_PARAMS_KEY = '__smart__';

  var SEARCH_ACTION_BASE = {
    "action"             : "Query",
    "Characters"         : 200,
    "TotalResults"       : true,
    //"DetectLanguagetype" : true,
    "SpellCheck"         : true,
    "Synonym"            : true,
    "Summary"            : "Context"
  };

  var PARAMETRIC_ACTION_BASE = {
    "action"        : "GetQueryTagValues",
    "Sort"          : "Alphabetical",
    "Start"         : 1,
    "MaxValues"     : 10,
    "DocumentCount" : true
  };

  var mappingIDOLField = IDOLKMFieldMapping.mappingIDOLField;
  var escapeIDOLFieldTextValue = IDOLCommon.escapeFieldTextValue;

  function buildPrintFieldParams(kmquery, advCriteria) {
    var fields = [
      // for drilldown
      "ID", "DOCUMENTID", "SEFILENAME", "SEQUERY",
      // for sharepoint attachment
      "FILEURL", "LISTITEMURL", "DREROOTPARENTREFERENCE","URL"
    ];

    var kmlibs = kmquery.getSelectedLibraries();
    // only main search page need to show hit list data;
    var printhitlist = (kmquery.from === 'main');
    _.each(kmlibs, function(kmlib) {
      if (IDOLGlobalSearchLibrary.isKMDocument(kmlib)) {
        var fieldname = mappingIDOLField("hotnews", kmlib.kbname);
        fields.push(fieldname);
        fields.push( mappingIDOLField("hotnews.start.date", kmlib.kbname));
        fields.push( mappingIDOLField("hotnews.end.date", kmlib.kbname));
      }
      if (printhitlist) {
        var hitlists = kmquery.getHitListMappings(kmlib);
        fields = fields.concat(_.values(hitlists));
      }
    });
    fields = _.uniq(fields);
    return { PrintFields : fields.join(',') };
  }

  function buildDatabaseMatchParams(kmquery, advCriteria) {
    var selectedLibs = kmquery.getSelectedLibraries();
    var names = _.pluck(selectedLibs, 'kbname');
    
    // XXX: For IDOL, if no databasematch parameter assigned, all database will be used
    if (names.length === 0) {
      return { DatabaseMatch : '_not_exists_database_name_' };
    }
    return { DatabaseMatch : names.join(',') };
  }

  function buildFieldTextParams(kmquery, advCriteria) {
    var filters = [];
    appendAttachmentFilters(kmquery, advCriteria, filters);
    appendFieldWildcardFilters(kmquery, advCriteria, filters);
    appendLibraryFilters(kmquery, advCriteria, filters);
    return { 
      // "FieldText" currently is only used for security control, shouldn't count for document weight.
      "WeighFieldText" : false,
      "FieldText" : IDOLCommon.compositeCriteria(filters, 'AND') 
    };
  }

  function buildTimeRangeParams(kmquery, advCriteria) {
    var global = advCriteria[GLOBAL_CRITERIA_PARAMS_KEY];
    if (global) {
      var lastmodifytime = global['lastmodifytime'];
      if (lastmodifytime) {
        var min = lastmodifytime * 60 * 60 * 24;
        return { MinDate : min + 's' };
      }
    }
    return {};
  }

  function buildLanguageParams(kmquery, advCriteria) {
    var fKMQuery = kmquery.fKMQuery;
    var params = IDOLKMNLProcessing.buildNaturalLanguageParams(fKMQuery);

    var words = extractHistorySearchText(kmquery, advCriteria);
    words.push(params.Text);
    params.Text = IDOLCommon.compositeCriteria(words, 'AND');

    return params;
  }

  function extractHistorySearchText(kmquery, advCriteria) {
    var history = advCriteria[SEARCH_WITHIN_RESULT_PARAMS_KEY];
    if (history) {
      var words = [];
      _.each(history, function(advCriteria) {
        var keyword = advCriteria.__text__;
        if (keyword && keyword !== '*') {
          if(kmquery && kmquery.fKMQuery && kmquery.fKMQuery.query != keyword){
            words.push(keyword);
          }
        }
      });
      return words;
    }
    return [];
  }

  function buildSharePointParams(kmquery, advCriteria) {
    if (kmquery.hasSharePoint()) {
      return IDOLKMSecurity.getSecurityInfo(funcs.operator());
    }
    return {};
  }

  function appendAttachmentFilters(kmquery, advCriteria, filters) {
    if (kmquery.hasAttachmentLibrary()) {
      filters.push('(NOT MATCH{joboptions}:IMPORTMAGICEXTENSION) OR EMPTY{}:IMPORTMAGICEXTENSION');
    }
  }

  function appendLibraryFilters(kmquery, advCriteria, filters) {
    var kmlibs = kmquery.getSelectedLibraries();

    var alllibfilters = _.map(kmlibs, function(kmlib) {
      var filters = [];
      appendPerLibraryFilter(kmquery, advCriteria, kmlib, filters);
      // for search in results, one criteria may add several times
      filters = _.uniq(filters);

      var dbfield = (kmlib.kbtype === 'sclib') ? 'KNOWLEDGEBASE_NAME_MATCH' : 'DREDBNAME';
      filters.push([ 'MATCH{' + kmlib.kbname + '}:' + dbfield ]);
      return IDOLCommon.compositeCriteria(filters, 'AND');
    });

    if (alllibfilters.length > 0) {
      var filter = IDOLCommon.compositeCriteria(alllibfilters, 'OR');
      filters.push(filter);
    }
  }

  function buildPagingParams(kmquery, advCriteria) {
    var fKMQuery = kmquery.fKMQuery;
    return {
      "Start": fKMQuery.docstart || 1,
      "MaxResults": fKMQuery.maxdocs || 10
    };
  }

  function buildSortingParams(kmquery, advCriteria) {
    return IDOLKMSorting.getSortInfo(kmquery.sortinfo);
  }

  function appendPerLibraryFilter(kmquery, advCriteria, kmlib, filters) {
    appendPreConditions             (kmquery, advCriteria, kmlib, filters);
    appendAdhocCriteria             (kmquery, advCriteria, kmlib, filters);
    appendKMSecurityFilter          (kmquery, advCriteria, kmlib, filters);
    appendAdvancedCriteria          (kmquery, advCriteria, kmlib, filters, false);
    appendMandantenSecurityFilter   (kmquery, advCriteria, kmlib, filters);
    appendSearchWithinResultCriteria(kmquery, advCriteria, kmlib, filters);
    appendCatalogSearchCriteria     (kmquery, advCriteria, kmlib, filters);
    appendSharePointSearchCriteria  (kmquery, advCriteria, kmlib, filters);
  }
  
  function appendSharePointSearchCriteria(kmquery, advCriteria, kmlib, filters){
    if(kmlib.kbtype ==='splib') {
      filters.push('EXISTS{}:FILEURL:LISTITEMURL:DREROOTPARENTREFERENCE OR WILD{http://*,https://*}:DREFERENCE');
    }
  }

  // The default hashFunction just uses the first argument to the memoized function as the key.
  var getCapabilityWords = _.memoize(lib.capability.getAllCapabilityWordbyOperator);

  function appendCatalogSearchCriteria(kmquery, advCriteria, kmlib, filters) {
    if (IDOLGlobalSearchLibrary.isCatalog(kmlib)) {
      var lang = vars['$G.my.language'];
      if (!advCriteria.ignorelanguage && lang) {
        var filter = 'MATCH{' + escapeIDOLFieldTextValue(lang) + '}:' + mappingIDOLField('syslanguage', kmlib.kbname);
        filters.push(filter);
      }

      var capability = getCapabilityWords(funcs.operator()) || [];
      var sql = new QueryCond('active', EQ, true)
                .and(new QueryCond('type', ISIN, ['item', 'bundle']))
                .and(new QueryCond('access.list', ISIN, capability).or(new QueryCond('access.list', EQ, null)))
                .asRAD();

      var ast = parseQuery(sql);
      var query = IDOLQueryEvaluator.convertToIDOLQuery(ast, null, IDOLCommon.toHiddenMatchField);
      filters.push(query);
    }
  }

  function appendAdvancedCriteria(kmquery, advCriteria, kmlib, filters, isSearchInResult) {
    var kbname = kmlib.kbname;
    var criterion = advCriteria[kbname];
    var hasHotnews = false;
    if (criterion) {
      var advFilters = _.map(criterion, function(values, fieldname) {
        if(kbname=="Knowledge_Library" && fieldname.toLowerCase()== "hotnews") //hotnews is magic
        {
           var i=0;
           var hotnews_filters=[];
           var tod = KMQuery_IDOL.getEpochSeconds(system.functions.tod());
           hasHotnews = true;
           for(;i<values.length;i++)
           {
             if(values[i]=="true")
             {
               
               var hotnews = [];
               hotnews.push('(MATCH{true}:'+mappingIDOLField("hotnews", "Knowledge_Library")+')');
               hotnews.push('(RANGE{.,'+tod+'}:'+mappingIDOLField("hotnews_start_date",kbname) +' OR EMPTY{}:'+mappingIDOLField("hotnews_start_date",kbname)+')');
               hotnews.push('(RANGE{'+tod+',.}:'+mappingIDOLField("hotnews_end_date",kbname)+' OR EMPTY{}:'+mappingIDOLField("hotnews_end_date",kbname)+')');
               hotnews_filters.push('('+hotnews.join('+AND+') +')');
             }
             else
             {
               var hotnews = [];
               hotnews.push('(MATCH{false}:'+mappingIDOLField("hotnews", "Knowledge_Library")+')');
               hotnews.push('(MATCH{true}:'+mappingIDOLField("hotnews", "Knowledge_Library")+'+AND+'+'RANGE{'+tod+',.}:'+mappingIDOLField("hotnews_start_date",kbname)+')');
               hotnews.push('(MATCH{true}:'+mappingIDOLField("hotnews", "Knowledge_Library")+'+AND+'+'RANGE{.,'+tod+'}:'+mappingIDOLField("hotnews_end_date",kbname)+')');
               hotnews_filters.push('('+hotnews.join('+OR+') +')');
             }
             
           }
           return hotnews_filters.join('+OR+');
        }
        else
        {
           return 'MATCH{' + _.map(values, escapeIDOLFieldTextValue).join(',') + '}:' + mappingIDOLField(fieldname, kbname);
        }
      });
      if (advFilters.length > 0) {
        var filterquery = IDOLCommon.compositeCriteria(advFilters, 'AND');
        filters.push(filterquery);
      }
    }
    //append hotnews validate
    var fKMQuery = kmquery.fKMQuery;
    if(fKMQuery && kbname == "Knowledge_Library" && fKMQuery.kmlib_hotnews)
    {
       var tod = KMQuery_IDOL.getEpochSeconds(system.functions.tod());
       var hotnews = [];
       hotnews.push('(MATCH{true}:'+mappingIDOLField("hotnews", "Knowledge_Library")+')');
       hotnews.push('(RANGE{.,'+tod+'}:'+mappingIDOLField("hotnews_start_date",kbname) +' OR EMPTY{}:'+mappingIDOLField("hotnews_start_date",kbname)+')');
       hotnews.push('(RANGE{'+tod+',.}:'+mappingIDOLField("hotnews_end_date",kbname)+' OR EMPTY{}:'+mappingIDOLField("hotnews_end_date",kbname)+')');
       filters.push('('+hotnews.join('+AND+') +')');
    } else if (kmquery.searchType == 'quicksearch' && lib.IDOLKMHotnewsSearch.needShowHotnewsTop() && !isSearchInResult && hasHotnews == false && kbname == "Knowledge_Library" ) {
       //only show false for when need show hotnews top,but not search in result
       var tod = KMQuery_IDOL.getEpochSeconds(system.functions.tod());
       var hotnews = [];
       hotnews.push('(MATCH{false}:' + mappingIDOLField("hotnews", "Knowledge_Library") + ')');
       hotnews.push('(MATCH{true}:' + mappingIDOLField("hotnews", "Knowledge_Library") + '+AND+' + 'RANGE{' + tod + ',.}:' + mappingIDOLField("hotnews_start_date", kbname) + ')');
       hotnews.push('(MATCH{true}:' + mappingIDOLField("hotnews", "Knowledge_Library") + '+AND+' + 'RANGE{.,' + tod + '}:' + mappingIDOLField("hotnews_end_date", kbname) + ')');
       filters.push('(' + hotnews.join('+OR+') + ')');
    }
  }

  function appendKMSecurityFilter(kmquery, advCriteria, kmlib, filters) {
    if (kmlib.kbtype === 'sclib') {
      var script = lib[kmlib.searchsecurityscript];
      if (script && script.getSecurityInfo) {
        var filter = script.getSecurityInfo(funcs.operator(), kmlib);
        filters.push(filter);
      }
    }
  }

  function appendSQLSecurityFilter(kmlib, sql, filters) {
    var sctable = kmlib.sclibtablename;
    if (sql) {
      var ast = parseQuery(sql);
      // XXX: all security fields are mapped to 'MATCH' field
      var filter = IDOLQueryEvaluator.convertToIDOLQuery(ast, null, function(fieldname) {
        return mappingIDOLField(fieldname) + '_MATCH';
      });
      if (filter) {
        filters.push(filter); 
      }
    }
  }

  // append query will use this flag to generate SQL;
  function guessLibrarySearchContext(kmlib) {
    if (IDOLGlobalSearchLibrary.isPDKnownError(kmlib)) {
      return { '$isKnownError' : true };
    } else if (IDOLGlobalSearchLibrary.isPDProblem(kmlib)) {
      return { '$isKnownError' : false };
    } else {
      return {};
    }
  }

  function appendMandantenSecurityFilter(kmquery, advCriteria, kmlib, filters) {
    if (kmlib.kbtype !== 'sclib') { return; }

    var sctable = kmlib.sclibtablename;
    if (!sctable) { return; }

    var sql = getMandantQuery(sctable);
    //sql = lib.IDOLSecurity.checkArrayMandant(sctable, sql);
    var context = guessLibrarySearchContext(kmlib);
    var appendSQL = IDOLGlobalSearchSandbox.evaluate(context, function() {
      return IDOLSMProfile.appendQuery('true', sctable);
    });

    appendSQLSecurityFilter(sctable, sql, filters);
    appendSQLSecurityFilter(sctable, appendSQL, filters);
  }

  function appendSearchWithinResultCriteria(kmquery, advCriteria, kmlib, filters) {
    var history = advCriteria[SEARCH_WITHIN_RESULT_PARAMS_KEY];
    if (history) {
      _.each(history, function(advCriteria) {
        appendAdvancedCriteria(kmquery, advCriteria, kmlib, filters, true);
      });
    }
  }

  function appendPreConditions(kmquery, advCriteria, kmlib, filters) {
    var smart = advCriteria[PRECONDITION_CRITERIA_PARAMS_KEY];
    if (smart && smart['smartcriteria']) {
      var kbname = kmlib.kbname,
          preconditions = smart['smartcriteria'];

      var item = _.findWhere(preconditions, { library : kbname });
      if (item) {
        var ast = parseQuery(item.sql);
        var filter = IDOLQueryEvaluator.convertToIDOLQuery(ast, null, function (fieldname){ 
          return mappingIDOLField(fieldname, kbname);
        });
        filters.push(filter);
      }
    }
  }

  function appendAdhocCriteria(kmquery, advCriteria, kmlib, filters) {
    var func = kmquery.perLibAdHocCriteria;
    if (_.isFunction(func)) {
      var filter = func.call(kmquery, kmlib);
      filters.push(filter);
    }
  }

  function toParametricName(name) {
    name = mappingIDOLField(name);
    // only match field can be used as filter
    if (name.indexOf('_MATCH') === -1) {
      name += '_MATCH';
    }
    return name;
  }

  function buildParametricFieldName(kmquery, advCriteria) {
    var field = advCriteria[PARAMETRIC_SEARCH_PARAMS_KEY];
    if (field) {
      var fieldname = field.fieldname;
      return { FieldName: toParametricName(fieldname) };
    }
    return {};
  }

  function appendFieldWildcardFilters(kmquery, advCriteria, filters) {
    var field = advCriteria[PARAMETRIC_SEARCH_PARAMS_KEY];
    if (field) {
      var prefix = field.prefix,
          fieldname = field.fieldname,
          filename = field.filename,
          libname = field.libname;

      var matches = [];
      if (prefix) {
        var idolFieldName = mappingIDOLField(fieldname, libname);
        var wildStart = 'WILD{';
        matches.push(wildStart + escapeIDOLFieldTextValue(prefix) + '*}:' + idolFieldName);

        // need to search its display name when necessary
        var reftable = DisplayName.getFieldReferenceTable(filename, fieldname);
        if (reftable) {
          matches.push(wildStart + escapeIDOLFieldTextValue(prefix) + '*}:_DN_' + idolFieldName);  
        }
      }

      var filter = IDOLCommon.compositeCriteria(matches, 'OR');
      if (filter) {
        filters.push(filter);  
      }
    }
  }

  function isContextMatched(record, kmlib) {
    var tablename = kmlib.sclibtablename;
    if (funcs.filename(record) === tablename) {
      if (IDOLGlobalSearchLibrary.isPDKnownError(kmlib)) {
        return vars['$isKnownError'];
      }
      return true;
    }
    return false;
  }

  
  /**
   * When perform context aware search, the most similar one must be the working on ticket itself.
   * Build parameters to exclude self record
   */
  function buildSelfExclusionParams(kmquery, advCriteria) {
    var kmlibs = kmquery.getSelectedLibraries();
    var kblength = kmlibs.length;
    if (kblength === 0 || kmquery.from !== 'quick') {
      return {};
    }

    var i, j;
    for (i = 0; i < kblength; i++) {
      var kmlib = kmlibs[i];
      if (kmlib.kbtype !== 'sclib') {
        continue;
      }

      var record = vars['$L.file'];

      if (record && isContextMatched(record, kmlib)) {
        var tablename = kmlib.sclibtablename;
        var fieldname = kmlib.docid;
        var value = record[fieldname];
        var links = [];
    
        // TODO: extract function to share with "index" processing

        // record link
        var sequery = tablename + ":" + fieldname + "=&quot;" + value + "&quot;";
        var link = "scactivelink://" + sequery + "&nbsp;and&nbsp;kbname=&quot;" + kmlib.kbname + "&quot;";

        // double encode
        link = encodeURIComponent(encodeURIComponent(link));
        links.push(link);
    
        // attachment link
        if (kmlib.indexattachments) {
          var attachments = record.getAttachments();
          for (j = 0; j < attachments.length; j++) {
            var attach = attachments[j];
            if (attach.href == null || attach.href.length <= 4) {
              continue;
            }
            link = "scattach://" + attach.href.substring(4) + ":" + attach.name + ":" + tablename + ":" + value;
            // double encode
            link = encodeURIComponent(encodeURIComponent(link));
            links.push(link);
          }
        }
        var reference = links.join('+');
        return { "DontMatchReference": reference };
      }
    }
    return {};
  }
  
  function buildCombineParams(kmquery, advCriteria) {
    var replica = IDOLGlobalSearchReplica.getReplica();
    return (replica > 1) ? { "Combine" : "simple+drereference" } : {};
  }

  function buildHighLightParams(kmquery, advCriteria) {
    return {
      "Highlight" : "SummaryTerms",
      "StartTag"  : IDOLGlobalSearchHighLight.START_TAG,
      "EndTag"    : IDOLGlobalSearchHighLight.END_TAG
    };
  }

  function buildCountingParams(kmquery, advCriteria) {
    var settings = IDOLAdvancedSettings.GlobalSearch;
    var enableCounting = settings.DISPLAY_RECORD_COUNT;
    return {
      "Predict" : !enableCounting
    };
  }
  
  function buildDetectLanguage(kmquery, advCriteria) {
    var settings = IDOLAdvancedSettings.GlobalSearch;
    var detectLanguage = settings.AUTO_DETECT_LANGUAGE;
    return {
      "DetectLanguageType" : detectLanguage
    };
  }

  function buildTimeoutParams(kmquery, advCriteria) {
    var timeout = GlobalSearchSettings.QUERY_TIMEOUT || 3000;
    return {
      TimeoutMS : timeout
    };
  }
  
  function buildIDOLParametricSearchCommand(kmquery, advCriteria) {
    advCriteria = advCriteria || {};
    return _.extend({},
      PARAMETRIC_ACTION_BASE, 
      buildDatabaseMatchParams(kmquery, advCriteria), 
      buildFieldTextParams(kmquery, advCriteria),
      buildTimeRangeParams(kmquery, advCriteria),
      buildLanguageParams(kmquery, advCriteria),
      buildParametricFieldName(kmquery, advCriteria),
      buildCombineParams(kmquery, advCriteria),
      buildTimeoutParams(kmquery, advCriteria)
    );
  }

  function buildIDOLSearchCommand(kmquery, advCriteria) {
    advCriteria = advCriteria || {};
    var params = _.extend({},
      SEARCH_ACTION_BASE,
      buildDatabaseMatchParams(kmquery, advCriteria),
      buildTimeRangeParams(kmquery, advCriteria),
      buildFieldTextParams(kmquery, advCriteria),
      buildPrintFieldParams(kmquery, advCriteria),
      buildLanguageParams(kmquery, advCriteria),
      buildSortingParams(kmquery, advCriteria),
      buildPagingParams(kmquery, advCriteria),
      buildSharePointParams(kmquery, advCriteria),
      buildSelfExclusionParams(kmquery, advCriteria),
      buildCombineParams(kmquery, advCriteria),
      buildHighLightParams(kmquery, advCriteria),
      buildCountingParams(kmquery, advCriteria),
      buildDetectLanguage(kmquery, advCriteria),
      buildTimeoutParams(kmquery, advCriteria)
    );

    if (params.Text.length > GlobalSearchSettings.SUGGEST_ON_TEXT_THRESHOLD) {
      _.extend(params, { "action" : "SuggestOnText" });
    }

    return params;
  }

  return {
    buildSearchCommand : buildIDOLSearchCommand,
    buildParametricSearchCommand : buildIDOLParametricSearchCommand
  };
}());

function require() {
  return IDOLKMQueryParameter;
}