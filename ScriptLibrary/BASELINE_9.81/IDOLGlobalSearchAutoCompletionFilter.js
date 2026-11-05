var _ = lib.Underscore.require(),
    IDOLKMQueryFactory = lib.IDOLKMQueryFactory.require(),
    IDOLClientFactory = lib.IDOLClientFactory.require(),
    IDOLAdvancedSettings = lib.IDOLAdvancedSettings.require();

var GlobalSearchSettings = IDOLAdvancedSettings.GlobalSearch;

var IDOLGlobalSearchAutoCompletionFilter = (function() {

  function queryStartWith(qs, criteria) {
    var keyword = qs.query || '*',
        options = {},
        start = parseInt(qs.start, 10) || 1,
        limit = parseInt(qs.limit, 10) || GlobalSearchSettings.PARAMETRIC_PAGE_SIZE;

    var fKMQuery = new SCFile('kmquery');
    fKMQuery.query = keyword;
    var minScore = (GlobalSearchSettings.MINSCORE || GlobalSearchSettings.MINSCORE==0)?GlobalSearchSettings.MINSCORE:30;
    options = _.extend(options, {
      "Start" : start,
      "MinScore" : minScore,
      "MaxValues" : start + limit - 1
    });

    var client = IDOLClientFactory.create('GlobalSearch');
    var IDOLKMQuery = IDOLKMQueryFactory.create('parametric', fKMQuery, criteria);
    var result = IDOLKMQuery.search(options);
    var field = criteria['__field__'];
    if(field && field.libname && field.libname == "Knowledge_Library" && field.fieldname == "hotnews")
    {
      IDOLKMQuery.fKMQuery.kmlib_hotnews = true;
      var hotnews = IDOLKMQuery.search(options);
      //        {"data":[{"text":"false","value":"false","count":198},{"text":"true","value":"true","count":4}],"total":2}
      //hotnews:{"data":[{"text":"true","value":"true","count":1}],"total":1}
      var i=0;
      //when no hotnews return:{"data":[],"total":0}
      if(hotnews && (!hotnews["data"] || hotnews["data"].length == 0))
      {
         hotnews["data"]=[{"text":"true","value":"true","count":0}];
      }
      for(;hotnews && hotnews["data"] && i<hotnews["data"].length;i++)
      {
        if(hotnews["data"][i]["value"]=="true" && hotnews["data"][i]["count"] != null)
        {
           var tcount = hotnews["data"][i]["count"] ;
           var old_fcount =0;
           var old_tcount =0;
           var j=0;
           for(;result&& result["data"] && j<result["data"].length;j++)
           {
             if(result["data"][j].value == "true")
             {
               old_tcount = result["data"][j].count;
               
             }
             else if(result["data"][j].value == "false")
             {
               old_fcount = result["data"][j].count;               
             }
           }
           if(old_tcount != tcount && old_tcount > 0 )
           {
              result["data"]=[];
              if(tcount > 0)
              {
                result["data"].push({"text":"true","value":"true","count": tcount});
              }
              if(old_fcount+old_tcount-tcount > 0)
              {
                result["data"].push({"text":"false","value":"false","count": old_fcount+old_tcount-tcount});
              }
              result["total"] = result["data"].length;
           }
        }
      }
    } 
    return result;
  }

  return {
    query : queryStartWith
  };
}());


function require() {
  return IDOLGlobalSearchAutoCompletionFilter;
}