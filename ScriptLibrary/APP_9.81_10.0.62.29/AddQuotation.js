var IDOLAdvancedSettings = lib.IDOLAdvancedSettings.require();
var GlobalSearchSettings = IDOLAdvancedSettings.GlobalSearch;
function includeSpecials(query){
    var pattern = /(\*|\?|\"|\:|\(|\)|(\W+|^)AND(\W+|$)|(\W+|^)NOT(\W+|$)|(\W+|^)OR(\W+|$)|(\W+|^)EOR(\W+|$)|(\W+|^)XOR(\W+|$)|(\W+|^)NEAR(\W+|$)|(\W+|^)DNEAR(\W+|$)|(\W+|^)WNEAR(\W+|$)|(\W+|^)BEFORE(\W+|$)|(\W+|^)AFTER(\W+|$))/;
    query = query.toUpperCase();
    if(query.match(pattern)){
      return true;
    }
    return false;
}


/**
 Per FA's requirements, if enable quotation search, the exactly match result should be the 1st postion of result, and follows the reset result.
 the before implemetation only retrieved the exactly match result but there is no simliar result returned as well.
 
 For Idol query, for example here: 
 before is:     http://16.187.188.150:9000/action=query&text="CONNECT TO A VPN"
 now should be: http://16.187.188.150:9000/action=query&text="CONNECT TO A VPN" CONNECT TO A VPN 
*/
function reloadQuery(query){
    var retQuery = query;
    var ignoreSpecials = GlobalSearchSettings.IGNORE_SPECIALS || false;
    var enableAddQuotation = GlobalSearchSettings.ENABLE_AUTOMATICALLY_ADD_QUOTATION || false;
    var hasSpecials = includeSpecials(query);
    if(!ignoreSpecials && enableAddQuotation && !hasSpecials){
      retQuery = "\""+query+"\" " + query;
    }
    return retQuery;
}