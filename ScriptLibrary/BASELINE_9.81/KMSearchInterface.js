var IDOLKMQueryFactory = lib.IDOLKMQueryFactory.require(),
     KMIDOLUtils = lib.KMIDOLUtils.require(),
     IDOLErrorCode = lib.IDOLErrorCode.require(),
                 _ = lib.Underscore.require();

                 
function getEngineName()
{
    return vars.$G_kmsearchengine;
}

function configureIndex(strXML)
{
    return RC_SUCCESS;
}

function initializeEngine(strXML)
{
	if(!strXML) {
		return -1;
	}

    return RC_SUCCESS;
}

function createIndex(strIndexName)
{
    return RC_SUCCESS;
}

function deleteIndex(strIndexName)
{   
    return RC_SUCCESS;
}

function openIndex(strIndexName)
{
    return RC_SUCCESS;
}

function closeIndex(strIndexName)
{
    return RC_SUCCESS;
}

function addDocument(strIndexName, strDocumentData)
{
    return RC_SUCCESS;
}

function deleteDocument(strIndexName, strDocumentId)
{
    return RC_SUCCESS;
}

function getIndexStatistics(strIndexName)
{
    var aStatsArray = new Datum();
    aStatsArray.setType(8);

    return aStatsArray;
}

function searchIndexes(strQuery, strQueryType, strQueryFields, strStartDoc, strMaxDocsToRetrieve, strMaxDocsToSearch, aCollections, aFields, strFilterQueries, sortInfo)
{
    var result;
    var aHitArray = new Datum();
    aHitArray.setType(8);

    return aHitArray;
}

function pingEngine(aArgs)
{
    return RC_SUCCESS;
}

function createJob(strJobName, strXML)
{
    return RC_SUCCESS;
}

function deleteJob(strJobName)
{
    return RC_SUCCESS;
}

function startJob(strXML)
{
    return RC_SUCCESS;
}

function stopJob(strXML)
{
    return RC_SUCCESS;
}

function getJobStatus(strJobName)
{
    return "";
}

function isBadAttachment(returncode)
{
    if (returncode == -1 || returncode == -2 || returncode == -8 || returncode == -13) {
        return true; //bad attachment
    }
    else {
        return false;
    }
}

function isBadDocument(returncode)
{
    if (returncode == -4 || returncode == -6 || returncode == -7 || returncode == -9 || returncode == -10) {
        return true; //document error
    }
    else {
        return false;
    }
}

function isBadServer(returncode)
{
    if (returncode == -3 || returncode == -5) {
        return true; //server error
    }
    else {
        return false;
    }
}

function isJobNotFound(returncode)
{
    if (returncode == -14) {
        return true;
    }
    else {
        return false;
    }
}

function isSchedulerException(returncode)
{
    if (returncode == -15) {
        return true;
    }
    else {
        return false;
    }
}

function isJobNameInvalid(returncode)
{
    if (returncode == -16) {
        return true;
    }
    else {
        return false;
    }
}

function isJobStopException(returncode)
{
    if (returncode == -17) {
        return true;
    }
    else {
        return false;
    }
}

function isJobHTTPException(returncode)
{
    if (returncode == -18) {
        return true;
    }
    else {
        return false;
    }
}

function isJobNullPointerException(returncode)
{
    if (returncode == -19) {
        return true;
    }
    else {
        return false;
    }
}

function isJobStatusRunning(returncode)
{
    if (returncode == 1) {
        return true;
    }
    else {
        return false;
    }
}

function isJobStatusScheduled(returncode)
{
    if (returncode == 2) {
        return true;
    }
    else {
        return false;
    }
}

function isJobStatusCompleted(returncode)
{
    if (returncode == 3) {
        return true;
    }
    else {
        return false;
    }
}

function isJobIOException( returncode ){
    if ( -2 == returncode ) {
        return true;
    }
    else {
        return false;
    }
}

function srcSearch( text, filterObj, docstart, maxdocs )
{
  var fKMQuery =  new SCFile('kmquery');
  fKMQuery.query = text;
  fKMQuery.docstart = docstart;
  fKMQuery.maxdocs = docstart+maxdocs-1;
  
  var searchResult = null;
  vars.$G_advsearch = false;
     
  try {
        var Filters = [];
        if(filterObj && filterObj.Filters){
           Filters = filterObj.Filters;
          var langFilter = _.where(Filters,{field:"language"});
          if(langFilter && langFilter.value){
              fKMQuery.locale = langFilter.value;
              vars.$G_advsearch = true;
            }
        }
       
       IDOLKMSRCQuery = IDOLKMQueryFactory.create('src', fKMQuery);
       
       IDOLKMSRCQuery.filters = Filters;

       var printField ={"PrintFields":"DRETITLE+CATEGORY+KMSEARCHCATEGORY+DOCTYPE+SYSMODTIME_DATE+ID+KMSTATUS+GUIDS+CONTENT-TYPE+SMUUID+FILEURL+LISTITEMURL"};
       
       try{
           searchResult = IDOLKMSRCQuery.search(printField);
           var messages = IDOLKMSRCQuery.getMessages() || [];
           var actions = IDOLKMSRCQuery.getActions();

            _.each(actions, function(a) {
              var action = a.action, msg;
              if (action === 'suggest.query') {
                msg = funcs.scmsg('suggest.query', 'idol', [ a.suggest ]);
              } else if (action === 'alternative.search') {
                msg = funcs.scmsg('alternative.search', 'idol', [ a.alternative, a.query ]);
              }
              if (msg) {
                messages.push(msg);
              }
            });
            searchResult =  KMIDOLUtils.setMessagesInSRCResponse(searchResult, messages);
       }catch( e ){
           if(e.id && e.id == IDOLErrorCode.INVALID_QUERY_TEXT){
             var msg = funcs.scmsg('2001', 'idol');
             searchResult = KMIDOLUtils.getSRCInvalidQueryResp(msg);    
           }else{
            throw e;
           }
       }
       
   }
    catch(er){
        var logger = getLog('KMSearchInterface');
        logger.error(er.toString());
        throw er;
     }
     
  return searchResult;
}

function retrieveKMArticle( docID )
{
   var kmdoc = null;
   if( docID )
   {
      try{
           var docfile =  new SCFile("kmdocument", SCFILE_READONLY);
           var rc = docfile.doSelect('id="'+docID+'"');
           if( rc == RC_SUCCESS )
           {
              kmdoc = docfile.getXML();
              var guidstr= lib.KMDocumentAttachment.getGUIDs(docID);
            if(guidstr)
            {  
              KMIDOLUtils.appendNewNode( 1, 'guids', null, kmdoc, 'instance' );
              KMIDOLUtils.appendNewNode( 3, null, guidstr, kmdoc, 'guids' );
            }
           }
       }
       catch(er){
         var logger = getLog('KMSearchInterface');
         logger.error(er.toString());
         throw er;
       }
   }
   
   return kmdoc;
}
