var _ = lib.Underscore.require(),
    JSON = lib.JSON.json(),
    IDOLKMQueryFactory = lib.IDOLKMQueryFactory.require(),   
    IDOLGlobalSearchHighLight = lib.IDOLGlobalSearchHighLight.require();
var IDOLAdvancedSettings = lib.IDOLAdvancedSettings.require();
var GlobalSearchSettings = IDOLAdvancedSettings.GlobalSearch;

var logger = getLog('SmartSearchWebService');

function search() {
  var record = vars['$L.file'];
  var query = record.query || "*",
      strfilters = record.filters,
      start =  record.start || 1,
      limit = record.size || 10,
      startTag = record.startTag,
      endTag = record.endTag,
      characters = record.max_characters || 300,
      // XXX: this flag should be a boolean value
      attachflag = record.attachflag || "false";
   var ignoreSpecials = GlobalSearchSettings.IGNORE_SPECIALS;
   var minScore = (GlobalSearchSettings.MINSCORE || GlobalSearchSettings.MINSCORE==0)?GlobalSearchSettings.MINSCORE:30;
   vars['$start'] = start;
   
   var options = {};
   var fKMQuery = new SCFile('kmquery');
    options = _.extend(options, {
      "IgnoreSpecials" : ignoreSpecials,
      "MinScore" : minScore,
      "Start": start,
      "MaxResults": start + limit - 1,
      "StartTag" : startTag || IDOLGlobalSearchHighLight.START_TAG,
      "EndTag" : endTag  ||  IDOLGlobalSearchHighLight.END_TAG,
      "Characters": characters
    });
    
    fKMQuery.query = query;
    var criteria = {};
    if (strfilters) {
      criteria = JSON.parse(strfilters);
      var libs=[];
      _.map(criteria, function(v, k) {
        libs.push(k);
      });
      criteria['__library__'] = libs;
    }
    
    var IDOLKMQuery = IDOLKMQueryFactory.create('quicksearch', fKMQuery, criteria);
    
    try {
      var ret = IDOLKMQuery.search(options);

      var results = _.chain(ret.data || [])
        .filter(function(doc) {
          return (!doc.isAttachment || (doc.isAttachment && attachflag == "true"));
        }).map(function(doc) {
          return {
            id : doc.id,
            title : doc.title,
            content : doc.content,
            kbname: doc.database,
            href: doc.href
          };
        })
        .value();
     
      vars['$restful.results'] = JSON.stringify(results);
      vars['$L.exit'] = 'normal';    
    } catch (e) {
      vars['$restful.results'] = "[]" ;  
      vars['$L.exit'] = "user.define";
      vars['$ERROR.CODE'] = 998;
      print(e.message || e);

      logger.error(e);
      logger.error(e.stack);
    } finally{
      record.query = null;
      record.filters = null;
      record['in'] = null;
      record.start = null;
      record.size = null;
      record.startTag= null;
      record.endTag= null;
      record.max_characters = null;
      record.attachflag = null;
    }   
}