/************************************************************************************************
 *
 * Remove collection information from kmknowledgebase
 * Remove triggers from sclib
 * delete collection from search engine
 * 
 ************************************************************************************************/

function KMCollection_Remove() { }
 
function removeCollection(kmknowledgebase) {
  var result = 0; 
  if (kmknowledgebase == null || kmknowledgebase.kbtype == "extern") {
    // don't remove the extern collection, just delete our connection to it.
    return RC_SUCCESS;
  }
  
  // call configureIndex for this collection as admin
  var serverFile = new SCFile("kmsearchservers", SCFILE_READONLY);
//  var searchservername;
//  if (!funcs._null(vars.$L_oldsearchserver)) {
//    searchservername = vars.$L_oldsearchserver;
//  } else {
//    searchservername = kmknowledgebase.searchservername;
//  }

  var rc = serverFile.doSelect("servername = \""+kmknowledgebase.searchservername+"\"");
  if (rc == RC_SUCCESS) {
    var y;
    var length = serverFile.servers.length();
    for (y = 0; y < length; y++) {
      if (serverFile.servers.servertype != "loadbalancer") {
        var strCfg = "<SEConfig>";
        strCfg += "<adminhost>"+ serverFile.servers[y].hostname + "</adminhost>";
        switch (lib.KMAdmin.isSSLConfigured(serverFile.servers[y])) {
          case 0:
            strCfg += "<adminport>" + serverFile.servers[y].https_port + "</adminport>";
            break;      
          case -1:
            return null;
          default: 
            strCfg += "<adminport>" + serverFile.servers[y].port + "</adminport>";
        }
        strCfg += "<admininstance>" + serverFile.servers[y].searchinstancename + "</admininstance>";
        strCfg += "<webdav>" + serverFile.webdavname + "</webdav>";
        strCfg += "</SEConfig>";
        lib.KMSearchInterface.initializeEngine(strCfg);
        result = lib.KMCollection_Delete.deleteCollection(lib.KMUtils.scToJSName(kmknowledgebase.kbname));
      }
    }
  }
   
  if (kmknowledgebase.kbtype != "sclib") {
    result = lib.KMCollection_WebCrawl.deleteJob(kmknowledgebase);
  }
   return result;
}
