var _ = lib.Underscore.require(),
    XQuery = lib.XQuery.require(),
    IDOLAdvancedSettings = lib.IDOLAdvancedSettings.require(),
    IDOLClientFactory = lib.IDOLClientFactory.require(),
    IDOLAssistantsProvider = lib.IDOLAssistantsProvider.require(),
    IDOLGlobalSearchFieldCaption = lib.IDOLGlobalSearchFieldCaption.require(),
    IDOLGlobalSearchDisplayValue = lib.IDOLGlobalSearchDisplayValue.require();

var GlobalSearchSettings = IDOLAdvancedSettings.GlobalSearch;
var logger = getLog('IDOLGlobalSearchPreview');
var IDOLGlobalSearchPreview = (function() {

  function getCaptionMapping(filename) {
    return IDOLGlobalSearchFieldCaption.getCaptions(filename);
  }

  function getHitList(filename, database) {
    var file = new SCFile('kmknowledgebase');
    //var query = new QueryCond('sclibtablename', EQ, filename);
    var query = 'sclibtablename="'+filename+'"';
    if(database)
    {
      query +=' and kbname="'+database+'"';
    }
    var rc = file.doSelect(query);
    if (rc !== RC_SUCCESS) { return {}; }

    var fields = file.kbfields;
    var hitlists = [], i;
    for (i = 0, length = fields.length(); i < length; i++) {
      var field = fields[i];
      if (field.hitlist) {
        var sort = parseInt(field.sort, 10);
        if (_.isNaN(sort)) {
          sort = Number.MAX_VALUE;
        }
        hitlists.push({
          name: field.kbfieldname,
          type: field.kbfieldtype,
          order : sort
        });
      }
    }
    return hitlists;
  }

  function extractPreviewFields(file, hitlist, captions) {
    var filename = funcs.filename(file);
    return _.chain(hitlist).sortBy(function(def) {
      return def.order;
    }).map(function(def) {
      var name = def.name, 
          value = file[name], 
          caption = captions[name] || name;
      //QCCR1E151618: Remove the html tag if field is Rich text
      //Author: maofeng
      if((def.type == "Rich Text" || def.type == "Rich_Text") && value) {
        value = lib.KMCollection_Update_Utils.processRichText(value);
        //Maybe need some length limit for performance optimization and user experience
        //if(value)
        //  value=lib.KMUtils.truncateStringWithEllipsis(value, 256);
      }
      var displayValue = IDOLGlobalSearchDisplayValue.toDisplay(filename, name, value);
      return { name: name, caption: caption, value: displayValue };
    }).value();
  }

  function getPreviewData(file, database) {
    var filename = funcs.filename(file),
        hitlist = getHitList(filename, database),
        captions = getCaptionMapping(filename);
    return extractPreviewFields(file, hitlist, captions);
  }

  function getMoreSummary(database, reference, text) {
    var client = IDOLClientFactory.create('GlobalSearch');
    var doc = client.executeAction({
      action : 'SuggestOnText',
      DatabaseMatch : database,
      MatchReference : encodeURIComponent(reference),
      QuerySummary : true,
      Summary : 'Context',
      Characters : GlobalSearchSettings.PREVIEW_CHARACTERS,
      Text : text,
      SingleMatch : true,
      Print : 'none'
    });
    return XQuery.queryText('responsedata/autn:hit/autn:summary', doc);
  }
 function getContent(database, reference) {
    var client = IDOLClientFactory.create('GlobalSearch');
    var doc = client.executeAction({
      action : 'GetContent',
      DatabaseMatch : database,
      Reference:reference
    });
    return doc;
  }
   
  function checkInject(qs,sclibFile)
  {
    if(!qs.database || !qs.reference)
    {
      return true;
    }
    var strisin='indexstatus isin {"'+lib.KMCollection_Status_Constant.INDEXSTATUS_FINISHED()+'","'
                +lib.KMCollection_Status_Constant.INDEXSTATUS_INDEXING()+'","'+lib.KMCollection_Status_Constant.INDEXSTATUS_NOTSTARTED()+'"}';
    var file = new SCFile('kmknowledgebase');
    var query = 'sclibtablename="'+qs.filename+'"'+' and kbname="'+qs.database+'" and '+ strisin;
    var rc = file.doSelect(query);
    if(rc != RC_SUCCESS)
    {
      return true;
    }
    //check database access rights
    var IDOLKMQuery = lib.IDOLKMQuery.require();
    var script = lib[file.kbaccessscript];
    var operator =  funcs.operator();
    if (script && script.checkAccess && !script.checkAccess(operator, file))
    {
      return true;
    }
    //now check query
    var doc_id = sclibFile[file.docid];
    var sequery = file.docid+"=\""+doc_id+"\"";
    var catquery = sequery+' and syslanguage like "*"';
    if(qs.query != sequery && qs.query != catquery)
    {
      return true;
    }
    //the last check
    var sefilename = file.sclibtablename;
    sequery = sefilename+":"+file.docid+"=&quot;"+doc_id+"&quot;";
    var doc_link = "scactivelink://"+sequery+"&nbsp;and&nbsp;kbname=&quot;"+file.kbname+"&quot;";
    if(qs.reference != doc_link)
    {
      return true;
    }
    return false;
  }
  function getPreview(qs) {
    var filename = qs.filename, 
        query = qs.query,
        database = qs.database,
        reference = qs.reference,
        summary = qs.summary;

    var response = { data : [], preview : [], actions: []};
    var handled = false;
    if (filename && query) {
      var assoc = new SCFile(filename, SCFILE_READONLY);
      var rc = assoc.doSelect(query);
      if (rc === RC_SUCCESS) {
        if(checkInject(qs,assoc))
        {
           logger.error("found sql injection through getpreview with query: "+query);
           return response;
        }
        var fields = getPreviewData(assoc, database);
        response.data = _.filter(fields, function(field) {
          return _.isBoolean(field.value) ? true : !!field.value;
        });
      }
    }
    else if( !filename && lib.IDOLGlobalSearchOKM.isOkmDocument(query, database, reference))
    {
      //check okm preview
      try
      { 
        if( eval("lib."+database+"_OKMFeature.needCustimizePrview(vars['$L.file'])"))
        {
          var doc = getContent(database, reference);
          response.data=eval("lib."+database+"_OKMFeature.getPreviewData(doc, system.functions.filename(vars['$L.file']))");
          handled = true;
        }
      }
      catch(e)
      {
        logger.error("meet error when preview okm document "+e);
      }
    } 
    if (!handled && database && reference) {
      var content = getMoreSummary(database, reference, summary);
      content = _.escape(content);
      content = content.replace(/\n+/g, '<br>');
      response.preview = [{value : content}];
    }
    var record = vars['$L.file'];
    if (record) {
      response.actions = IDOLAssistantsProvider.getActions(record, qs);
    }
    return response;
  }

  return {
    getPreview : getPreview,
    getContent : getContent
  };
}());


function require() {
  return IDOLGlobalSearchPreview;
}