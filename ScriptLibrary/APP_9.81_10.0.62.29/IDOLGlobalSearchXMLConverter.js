var _ = lib.Underscore.require(),
    XQuery = lib.XQuery.require(),
    IDOLGlobalSearchLibrary = lib.IDOLGlobalSearchLibrary.require(),
    IDOLGlobalSearchReplica = lib.IDOLGlobalSearchReplica.require(),
    IDOLGlobalSearchHighLight = lib.IDOLGlobalSearchHighLight.require(),
    IDOLGlobalSearchFieldCaption = lib.IDOLGlobalSearchFieldCaption.require(),
    IDOLGlobalSearchDisplayValue = lib.IDOLGlobalSearchDisplayValue.require(),
    IDOLGlobalSearchSharePointLinkBuilder = lib.IDOLGlobalSearchSharePointLinkBuilder.require(),
    KMIdolSearch_Filter = lib.KMIdolSearch_Filter;

var logger = getLog('IDOLGlobalSearchXMLConverter');

var IDOLGlobalSearchXMLConverter = (function() {

  var ATTACHMENT_REFERENCE_PATTERN = /^scattach:\/\//;

  function pluckHitList(hit, libname, kmquery) {
    var kmlib = kmquery.getLibrary(libname);

    if (kmlib.kbtype === 'sclib') {
      var doc = XQuery.queryOne('autn:content/DOCUMENT', hit);
      var filename = kmlib.sclibtablename;
      var captions = IDOLGlobalSearchFieldCaption.getCaptions(filename);
      var hitlists = kmquery.getHitListMappings(kmlib);
      var sortings = kmquery.getHitListOrders(kmlib);
      var values = XQuery.queryObject(hitlists, doc, true);

      var attrs = _.map(values, function(value, fieldname) {
        var showvalue = value;
        if(IDOLGlobalSearchLibrary.isCatalog(kmlib) && kmlib['portal.default.language'] 
           && kmlib['portal.available.languages'] && kmlib['portal.available.languages'].length()>0
           && fieldname =="syslanguage" && value)
         {
            showvalue = value.toString();
            if(showvalue.indexOf(",")!= -1)
            {
               showvalue = kmlib['portal.default.language'];
            }
        }
        var text = IDOLGlobalSearchDisplayValue.toDisplay(filename, fieldname, showvalue);
        return {
          name : fieldname,
          caption : captions[fieldname] || fieldname,
          value : showvalue,
          text : text
        };
      });

      return _.chain(attrs).filter(function(entry) { 
        return !!entry.value; 
      }).sortBy(function(field) {
        return sortings[field.name] || Number.MAX_VALUE;
      }).value();
    }
    else if(kmlib.kbtype === 'okmlib' || kmlib.kbtype === 'confluencelib' )
    {
      var doc = XQuery.queryOne('autn:content/DOCUMENT', hit);
      var hitlists = kmquery.getHitListMappings(kmlib);
      var sortings = kmquery.getHitListOrders(kmlib);
      var values = XQuery.queryObject(hitlists, doc, true);
      var captions = kmquery.getHitListCaption(kmlib);
      var types = kmquery.getHitListFieldType(kmlib);
      var attrs = _.map(values, function(value, fieldname) {
      var disfun = 'lib.'+kmlib.featurescript+'.getDisplayValue(value,types[fieldname])';
      var display = null;
      try
      {
        display = eval(disfun);
      }
      catch(e)
      {
        print(e);
        display = value;
      }
        return {
          name : fieldname,
          caption : captions[fieldname] || fieldname,
          value : value,
          text : display
        };
      });
      return _.chain(attrs).filter(function(entry) { 
        return !!entry.value; 
      }).sortBy(function(field) {
        return sortings[field.name] || Number.MAX_VALUE;
      }).value();
    }
    return [];
  }

  function convertResultsToJSONFormat(doc, kmquery) {
    var collection = XQuery.query('responsedata/autn:hit', doc);

    return _.map(collection, function(hit) {

      var data = XQuery.queryObject({
        title : 'autn:title',
        weight : 'autn:weight',
        summary : 'autn:summary',
        database : 'autn:database',
        reference : 'autn:reference',
        id : 'autn:content/DOCUMENT/ID|DOCUMENTID',
        query : 'autn:content/DOCUMENT/SEQUERY',
        url : 'autn:content/DOCUMENT/FILEURL|LISTITEMURL|URL',
        parentRef : 'autn:content/DOCUMENT/DREROOTPARENTREFERENCE',
        hotnews : 'autn:content/DOCUMENT/HOTNEWS|HOTNEWS_INDEX|HOTNEWS_MATCH',
        hotnews_start_date:'autn:content/DOCUMENT/HOTNEWS_START_DATE',
        hotnews_end_date:'autn:content/DOCUMENT/HOTNEWS_END_DATE'
      }, hit);

      var database = data.database,
          reference = data.reference,
          href = data.url,
          weight = parseFloat(data.weight, 10),
          title = data.title || href,
          content = data.summary;

      var kmlib = kmquery.getLibrary(database);
      if (kmlib == null) {
      	logger.warn("convertResultsToJSONFormat(): Knowledgebase \"" + database + "\" not found.");
      }
      
      // XXX: should only evaluate on SharePoint Library
      if (kmlib != null && kmlib.kbtype === 'splib' && !IDOLGlobalSearchSharePointLinkBuilder.isLinkValidate(href)) {
        href = IDOLGlobalSearchSharePointLinkBuilder.buildParentLink(data.parentRef, database);
      }

      reference = decodeURIComponent(reference);

      // HTML escape
      title = IDOLGlobalSearchHighLight.escape(title);
      content = IDOLGlobalSearchHighLight.escape(content);
       var myhref = href || reference;
      if(kmlib != null && kmlib.kbtype === 'okmlib' )
      {
         var func='lib.'+kmlib.featurescript+'.getOKMViewUrl(reference)';
         try
         {
           myhref=eval(func);
         }
         catch(e)
         {
           myhref = href || reference;
         }
      }
      else
      {
      content = content.replace(/\n+/g, '<br>');
      }
      var dataquery = data.query;
      if(IDOLGlobalSearchLibrary.isCatalog(kmlib) && kmlib['portal.default.language'] 
         && kmlib['portal.available.languages'] && kmlib['portal.available.languages'].length()>0)
      {
         //multi-language is enabled
         dataquery +=' and syslanguage like "*"';
      }
      var record = {
        "id" : data.id,
        // reference are also used for update ranking
        "reference" : reference, 
        "title": title,
        "content": content,
        "query": dataquery,
        // for weblib/fsylib, reference is also its url link
        "href" : myhref,
        "database" : database,
        "weight": isNaN(weight) ? 0 : weight
      };
      if (kmlib != null && IDOLGlobalSearchLibrary.isKMDocument(kmlib)) {
        var hotnews = data.hotnews;
        var hotnews_start_date = null;
        var hotnews_end_date = null;
        if(data.hotnews_start_date)
        {
          hotnews_start_date = new Date(data.hotnews_start_date);
        }
        if(data.hotnews_end_date)
        {
          hotnews_end_date = new Date(data.hotnews_end_date);
        }
        var td = new Date();
        // boolean value was stored as string in IDOL side
        if(hotnews === 'true' && (!hotnews_start_date || hotnews_start_date<=td) && (!hotnews_end_date || hotnews_end_date>td))
        {
          record.hotnews = true;
        }
        else
        {
          record.hotnews = false;
        }
      }

      if (ATTACHMENT_REFERENCE_PATTERN.test(reference)) {
        record.isAttachment = true;
      }

      if (kmlib != null && kmquery.from === 'main' && !record.isAttachment) {
        record.attrs = pluckHitList(hit, database, kmquery);
      }
      return record;
    });
  }

  function getStatistics(kmquery, doc) {
    var databases = XQuery.query('responsedata/autn:databasehits/autn:database', doc) || [];
    var replica = IDOLGlobalSearchReplica.getReplica();
    var kmlibs  = kmquery.getSelectedLibraries();
    var shortcut = _.indexBy(kmlibs, 'kbname');

    return _.reduce(databases, function(memo, database) {
      var name = database.getAttributeValue('name');
      // by default IDOL will print all the database, even this database is not in 'DatabaseMatch'. such as 'User'
      if (!shortcut[name]) {
        return memo;
      }
      var count = parseInt(database.getText(), 10) || 0;
      count = Math.floor(count / replica);
      memo[name] = count;
      return memo;
    }, {});
  }


  function filterOutInvalidCatalog(kmquery, resp) {
    var filtered = _.filter(resp.data, function(entry) {
      var database = entry.database;
      var kmlib = kmquery.getLibrary(database);
      if (kmlib != null && IDOLGlobalSearchLibrary.isCatalog(kmlib)) {
        var pass = KMIdolSearch_Filter.filterCatalog(entry.id);
        if (!pass) {
          resp.statistic[database] -= 1;
        }
        return pass;
      }
      return true;
    });

    var delta = (resp.data.length - filtered.length);
    if (delta > 0) {
      resp.data = filtered;
      resp.total -= delta;
    }
    return resp;
  }

  function convert(doc, kmquery) {
    var results = convertResultsToJSONFormat(doc, kmquery);
    var total = parseInt(XQuery.queryText('responsedata/autn:totalhits', doc), 10) || 0;
    var statistic = getStatistics(kmquery, doc);

    var resp = { data: results, total : total, statistic : statistic };
    resp = filterOutInvalidCatalog(kmquery, resp);
    
    resp.messages = kmquery.getMessages() || [];
    resp.actions = kmquery.getActions() || [];
    resp.query = kmquery.getQuery();

    return resp;
  }

  return {
    convert : convert
  };
}());

function require() {
  return IDOLGlobalSearchXMLConverter;
}