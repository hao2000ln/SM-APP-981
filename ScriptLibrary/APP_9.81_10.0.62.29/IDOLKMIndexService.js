/**
 *    IDOL Index Utilities for KM
 *
 *    Author Yang,Chun-Fu
 *
 */

var _ = lib.Underscore.require(),
    IDOLHTTPChannel = lib.IDOLHTTPChannel.require(),
    IDOLDistributeManagement = lib.IDOLDistributeManagement.require(),
    IDOLServiceQuery = lib.IDOLKMSearchService.require(),
    IDOLURLParser = lib.IDOLURLParser.require(),
    XQuery = lib.XQuery.require();
    logger = getLog('IDOLKMIndexService');

var IDOLKMIndex = function(){

    function createIndexDB( indexDbName )
    {
        var glsIndexUrl = lib.IDOLConfigure.require().getGSIndexUrl();
        var glsURL = glsIndexUrl+"DRECREATEDBASE?DREDbName="+indexDbName+"&Internal=false&ReadOnly=false",
            result = lib.jsaci.sendRequestToIDOL(glsURL, "");
        if(result == null) {
            logger.error("get result timeout for createIndexDb");
            return -1;
        }
        return RC_SUCCESS;

    }

    function mappingVDB(indexDbName){
        var vdbAction = IDOLDistributeManagement.VDBAdd();

        if ( IDOLDistributeManagement.isVDBExist( indexDbName )){
            vdbAction = IDOLDistributeManagement.VDBUpdate();
        }

        var result = IDOLDistributeManagement.manageVDB( vdbAction,indexDbName, IDOLDistributeManagement.GLSEngine());

        if( result == -1) {
            logger.error("Failed to add VDB");
            return -1;
        }

        result = IDOLDistributeManagement.setDBPrivilege( indexDbName );

        return result;
    }

    function deleteIndexDB(indexDbName){
        var glsIndexUrl = lib.IDOLConfigure.require().getGSIndexUrl();
        var idolUrl = glsIndexUrl+'DREDELDBASE';
        var result =  IDOLHTTPChannel.doGet(idolUrl,{
            DREDbName:indexDbName
        });

        return  _.trim(result.split('=')[1]) >0 ? 0 : -1;
    }

    function addDocument(indexDBName, strdata) {
        var glsIndexUrl = lib.IDOLConfigure.require().getGSIndexUrl();
        var strurl =glsIndexUrl+"DREADDDATA?DREDBNAME="+indexDBName+"&CreateDatabase=TRUE";
        var result =  lib.jsaci.sendRequestToIDOL(strurl,strdata);
        if(result == null) {
            logger.error(" get result timeout for index data");
            return -1;
        }
        return result;
    }

    function flushIndexData() {
        var glsIndexUrl = lib.IDOLConfigure.require().getGSIndexUrl();
        var strurl = glsIndexUrl+"DRESYNC";

        var result =  lib.jsaci.sendRequestToIDOL(strurl,"");
        if(result == null) {
            logger.error("get result timeout for flushIndexData");
        }

        return result;
    }
    function deleteIDOLKMDocument(fKmKnowledgebase, doc_id) 
    {
        var sefilename = fKmKnowledgebase.sclibtablename;
        var sequery = sefilename+":"+fKmKnowledgebase.docid+"=&quot;"+doc_id+"&quot;";
        var doc_link = "scactivelink://"+sequery+"&nbsp;and&nbsp;kbname=&quot;"+fKmKnowledgebase.kbname+"&quot;";
        doc_link = encodeURIComponent(doc_link);
        doc_link = encodeURIComponent(doc_link);
        //dreref += doc_link +"\n";
        
        var glsIndexUrl = lib.IDOLConfigure.require().getGSIndexUrl();
        var contenturl = glsIndexUrl + 'DREDELETEREF?';
            //Specify the IDs of one or more documents.
            //To specify multiple document IDs, separate them with plus symbols (there must be no space before or after a plus symbol).
        contenturl += 'Docs=' + doc_link +'&DREDbName='+fKmKnowledgebase.kbname;

        try{
                var rerult = lib.jsaci.runIDOLAction(contenturl, false);
                //print(result);
            }
        catch(e) 
            {
                //print(e.message);
                logger.error(e.stack);
                return -1;
            }
        return 0;
        
    }
    function deleteDocument(indexDBName, sedocid) {
        var result = 0;
        var Refs = IDOLServiceQuery.getDocRefByDocID(indexDBName, sedocid);
        if (Refs && Refs.length) {
            var glsIndexUrl = lib.IDOLConfigure.require().getGSIndexUrl();
            var contenturl = glsIndexUrl + 'DREDELETEREF?';
            //Specify the IDs of one or more documents.
            //To specify multiple document IDs, separate them with plus symbols (there must be no space before or after a plus symbol).
            contenturl += 'Docs=' + Refs.join('+')+'&DREDbName='+indexDBName;

            try{
                rerult = lib.jsaci.runIDOLAction(contenturl, false);
                print(result);
            }
            catch(e) {
                print(e.message);
                logger.error(e.stack);
                return -1;
            }
        }

        return 0;
    }

    function deleteAttachment(params){
        var glsIndexUrl = lib.IDOLConfigure.require().getGSIndexUrl();
        var contenturl = glsIndexUrl + 'DREDELETEREF?';

        var idx = 0
        for (var obj in params) {
            if(idx == 0){
                contenturl += obj + '=' + params[obj];
            }else{
                contenturl += '&' + obj + '=' + params[obj];
            }
            idx++;
        }

        try {
            lib.jsaci.runIDOLAction(contenturl, false);
            return 0;
        } catch (e) {
            print(e.message);
            logger.error(e.stack);
            return -1;
        }
    }

    function removeIndexDB(dbname){
        var glsIndexUrl = lib.IDOLConfigure.require().getGSIndexUrl();
        var strURL = glsIndexUrl+"DREREMOVEDBASE?DREDbName="+dbname;
        lib.jsaci.sendRequestToIDOL(strURL, "");
    }


    function renameIndexDB(dbname, newDBName){
        var glsIndexUrl = lib.IDOLConfigure.require().getGSIndexUrl();
        var strurl = glsIndexUrl+"DRERENAMEDBASE?DREDbName="+dbname+"&NewName="+newDBName;
        lib.jsaci.sendRequestToIDOL(strurl, "");
    }

    function isDBExists(dbName){
        var gsProxyurl = "";
        
        if(lib.IDOLConfigure.require().isInContainer()){
            gsProxyurl=lib.IDOLConfigure.require().getSearchMsvcEndPoint();
        }else{
            var idolUrl = lib.IDOLConfigure.require().getConfig()['server.url'];
            var idoltree = lib.IDOL_Tools_Tree.getIDOLTree(idolUrl);        
            gsProxyurl= idoltree.gsProxyUrl;
        }
                
        gsProxyurl += "action=GetStatus";
        var result = lib.jsaci.sendRequestToIDOL(gsProxyurl, "");
        if( null == result) {
            logger.error("get result timeout for checking the DB existence.");
            return false;
        }
        var xml = new XML();
        xml.setContent(result);
        var dbs = XQuery.query('responsedata/databases/database',xml);
        for(var i =0; i < dbs.length;i++){
            var name = XQuery.queryText('name',dbs[i]);
            if(dbName == name){return true;}
        }
        return false;
    }

    function tempDBPostFix(){
        return '_KM_INTERNAL_TEMP';
    }

    function getDatabases(idolURL){
        var result = lib.jsaci.sendRequestToIDOL(idolURL, "");
        if( null == result ) {
            logger.error("get result timeout for getting database names.");
            return null;
        }
        var xml_doc =  new XML();
        xml_doc.setContent(result);
        var dbs = XQuery.query('responsedata/databases/database', xml_doc);
        return dbs;
    }

    function getContentURLs()
    {
        var contentURLs =[];        
        var gsContents = null;
        var idolServerEP = null;
        
        if(lib.IDOLConfigure.require().isInContainer()){
            var gsProxyurl = lib.IDOLConfigure.require().getSearchMsvcEndPoint();
            gsContents = lib.IDOL_Tools_Tree.getContentService(gsProxyurl);
            idolServerEP = IDOLURLParser.parse(gsProxyurl);
        }else{
            var idol_url = lib.IDOLConfigure.require().getConfig()['server.url'];                
            idolServerEP = IDOLURLParser.parse(idol_url);
            var idol_tree = lib.IDOL_Tools_Tree.getIDOLTree(idol_url);
            gsContents = idol_tree.gsContent;
        }
        
        if(gsContents && gsContents.length>0){
            for(var i=0; i < gsContents.length; i++){
                var contentSvr = gsContents[i] || {};
                var name = contentSvr.name || '';
                // suite content servers are not accessible from sm side
                if (name.indexOf('SuiteContent') === -1) {
                  var content_url = idolServerEP.protocol+'://'+contentSvr.host+':'+contentSvr.port+'/action=getstatus';
                  contentURLs.push(content_url);
                }
            }
        }
        return contentURLs;
    }

    function isDBReadOnly(dbs,dbName)
    {
        if(dbs && dbs.length){
            for(var j = 0; j < dbs.length; j++){
                var name = XQuery.queryText('name',dbs[j]);
                if(name === dbName){
                    var read_only = XQuery.queryText('readonly',dbs[j]);
                    if(read_only ==='true'){return true;}
                }
            }
        }
        return false;
    }

    function isDBReadOnlyOnAnyContent(dbName)
    {
        var content_urls = getContentURLs();
        if( content_urls && content_urls.length ){
            for( var i = 0; i<content_urls.length;i++){
                var dbs = getDatabases(content_urls[i]);
                if(isDBReadOnly(dbs, dbName)){
                    return true;
                }
            }
        }

        return false;
    }

    return {
        createIndexDB  : createIndexDB,
        mappingVDB     : mappingVDB,
        deleteIndexDB  : deleteIndexDB,
        addDocument    : addDocument,
        deleteDocument : deleteDocument,
        flushIndexData : flushIndexData,
        renameIndexDB  : renameIndexDB,
        removeIndexDB  : removeIndexDB,
        isDBExists     : isDBExists,
        tempDBPostFix  : tempDBPostFix,
        deleteAttachment : deleteAttachment,
        isDBReadOnlyOnAnyContent :  isDBReadOnlyOnAnyContent,
        deleteIDOLKMDocument     :  deleteIDOLKMDocument
    }
}();

function require() {
    return IDOLKMIndex;
}