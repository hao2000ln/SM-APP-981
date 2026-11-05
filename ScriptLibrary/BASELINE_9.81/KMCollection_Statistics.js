/*   @author Tony Bray
 *
 *   Package: KMAdmin
 *
 *   Description: make plugin call to get search engine statistics
 *
 */

function getStatistics(arrayStats)
{

    var result = 0;
    if("IDOL"  != vars.$G_kmsearchengine ) {
        var aStats;
        var strXML;
        var strCollectionInfo = "";
        var serverFile = new SCFile("kmsearchservers");
        var serverFind = serverFile.doSelect("servername = \"" + vars.$L_file.searchservername + "\"");
        if (serverFind == RC_SUCCESS) {
            serverFind = serverFile.getFirst();
            
            for (var y = 0; y < serverFile.servers.length(); y++) {
                var strCfg = "<SEConfig>";
                strCfg += "<adminhost>" + serverFile.servers[y].hostname + "</adminhost>";
                switch (lib.KMAdmin.isSSLConfigured(serverFile.servers[y])) {
					case 0:
						strCfg += "<adminport>" + serverFile.servers[y].https_port + "</adminport>";
						break;			
					case -1:
						return null;
					default: 
							strCfg += "<adminport>" + serverFile.servers[y].port + "</adminport>";
							break;
				}
                strCfg += "<admininstance>" + serverFile.servers[y].searchinstancename + "</admininstance>";
                strCfg += "<webdav>" + serverFile.webdavname + "</webdav>";
                strCfg += "</SEConfig>";
                
                system.library.KMSearchInterface.initializeEngine(strCfg);
                if (serverFile.servers[y].servertype == "master") {
                    // build xml here to tell plugin master or slave
                    strXML = "<collectioninfo>";
                    strXML += "<indexname>" + vars.$L_file.kbname + "</indexname>";
                    strXML += "<indextype>master</indextype>";
                    strXML += "</collectioninfo>";
                    aStats = system.library.KMSearchInterface.getIndexStatistics(strXML);
                    
                    if (aStats[0] == "OK") {
                        // build a "string" to hold this info, add master to it for a label
                        arrayStats[0] = aStats[0]; //return code
                        //read return array and build string and pass back in element 1 of arrayStats
                        strCollectionInfo = system.functions.scmsg(244, "km"); //master
                        if (lib.KMAdmin.isSSLConfigured(serverFile.servers[y]) == 0) {
							strCollectionInfo += ": \t\t" + serverFile.servers[y].hostname + ":" + serverFile.servers[y].https_port;
						} else {
							strCollectionInfo += ": \t\t" + serverFile.servers[y].hostname + ":" + serverFile.servers[y].port;
						}
                        
                        strCollectionInfo += "\n\n";
                        strCollectionInfo += system.functions.scmsg(241, "km"); //state
                        if (aStats[5] == "online")
                            strCollectionInfo += ": \t\t\t " + system.functions.scmsg(208, "km"); // online
                        if (aStats[5] == "offline")
                            strCollectionInfo += ": \t\t\t" + system.functions.scmsg(209, "km"); // offline
                        if (aStats[5] == "created")
                            strCollectionInfo += ": \t\t\t" + system.functions.scmsg(211, "km"); // created

                        strCollectionInfo += "\n\n";
                        strCollectionInfo += system.functions.scmsg(242, "km"); //created
                        strCollectionInfo += ": \t\t" + aStats[1];
                        strCollectionInfo += "\n\n";
                        strCollectionInfo += system.functions.scmsg(243, "km"); //docs
                        strCollectionInfo += ": \t\t\t" + aStats[3];
                        strCollectionInfo += "\n";
                        /*arrayStats[1] = aStats[1]; //creation date
                         arrayStats[2] = aStats[1]; //squeezed date
                         arrayStats[3] = aStats[2]; //purged date
                         arrayStats[4] = aStats[3]; //live docs
                         arrayStats[5] = aStats[4]; //deleted docs
                         arrayStats[6] = aStats[5]; //status
                         if (arrayStats[6] == "online")
                         arrayStats[6] = system.functions.scmsg(208, "km"); // online
                         else if (arrayStats[6] == "offline")
                         arrayStats[6] = system.functions.scmsg(209, "km"); // offline
                         else if (arrayStats[6] == "created")
                         arrayStats[6] = system.functions.scmsg(211, "km"); // created*/
                        arrayStats[6] = strCollectionInfo; // +strCollectionInfo;
                    }
                    else {
                        arrayStats[0] = aStats[0];
                        strCollectionInfo = system.functions.scmsg(244, "km"); //master
                      	if (lib.KMAdmin.isSSLConfigured(serverFile.servers[y]) == 0) {
							strCollectionInfo += ": \t\t" + serverFile.servers[y].hostname + ":" + serverFile.servers[y].https_port;
						} else {
							strCollectionInfo += ": \t\t" + serverFile.servers[y].hostname + ":" + serverFile.servers[y].port;
						}
                        strCollectionInfo += "\n\n";
                        strCollectionInfo += system.functions.scmsg(241, "km"); //state
                        strCollectionInfo += ": \t\t\t" + system.functions.scmsg(209, "km"); // offline
                        strCollectionInfo += "\n\n";
                        strCollectionInfo += system.functions.scmsg(242, "km"); //created
                        strCollectionInfo += "\n\n";
                        strCollectionInfo += system.functions.scmsg(243, "km"); //docs
                        strCollectionInfo += "\n";
                        arrayStats[6] = strCollectionInfo;
                    }
                }
                if (serverFile.servers[y].servertype == "slave") {
                    // build xml here to tell plugin master or slave
                    strXML = "<collectioninfo>";
                    strXML += "<indexname>" + vars.$L_file.kbname + "</indexname>";
                    strXML += "<indextype>slave</indextype>";
                    strXML += "</collectioninfo>";
                    aStats = system.library.KMSearchInterface.getIndexStatistics(strXML);
                    if (aStats[0] == "OK") {
                        // build a "string" to hold this info, add master to it for a label
                        arrayStats[0] = aStats[0]; //return code
                        //read return array and build string and pass back in element 1 of arrayStats
                        strCollectionInfo += "______________________________________________\n\n";
                        strCollectionInfo += system.functions.scmsg(245, "km"); //slave
                        if (lib.KMAdmin.isSSLConfigured(serverFile.servers[y]) == 0) {
							strCollectionInfo += ": \t\t\t" + serverFile.servers[y].hostname + ":" + serverFile.servers[y].https_port;
						} else {
							strCollectionInfo += ": \t\t\t" + serverFile.servers[y].hostname + ":" + serverFile.servers[y].port;
						}
                        strCollectionInfo += "\n\n";
                        strCollectionInfo += system.functions.scmsg(241, "km"); //state
                        if (aStats[5] == "online")
                            strCollectionInfo += ": \t\t\t " + system.functions.scmsg(208, "km"); // online
                        if (aStats[5] == "offline")
                            strCollectionInfo += ": \t\t\t" + system.functions.scmsg(209, "km"); // offline
                        if (aStats[5] == "created")
                            strCollectionInfo += ": \t\t\t" + system.functions.scmsg(211, "km"); // created

                        strCollectionInfo += "\n\n";
                        strCollectionInfo += system.functions.scmsg(242, "km"); //created
                        strCollectionInfo += ": \t\t" + aStats[1];
                        strCollectionInfo += "\n\n";
                        strCollectionInfo += system.functions.scmsg(243, "km"); //docs
                        strCollectionInfo += ": \t\t\t" + aStats[3];
                        strCollectionInfo += "\n\n";
                        arrayStats[6] = strCollectionInfo;
                    }
                    else {
                        arrayStats[0] = aStats[0];
                        strCollectionInfo += "______________________________________________\n\n";
                        strCollectionInfo += system.functions.scmsg(245, "km"); //master
                        strCollectionInfo += ": \t\t" + serverFile.servers[y].hostname + ":" + serverFile.servers[y].port;
                        if (lib.KMAdmin.isSSLConfigured(serverFile.servers[y]) == 0) {
							strCollectionInfo += ": \t\t" + serverFile.servers[y].hostname + ":" + serverFile.servers[y].https_port;
						} else {
							strCollectionInfo += ": \t\t" + serverFile.servers[y].hostname + ":" + serverFile.servers[y].port;
						}
                        strCollectionInfo += "\n\n";
                        strCollectionInfo += system.functions.scmsg(241, "km"); //state
                        strCollectionInfo += "\n\n";
                        strCollectionInfo += system.functions.scmsg(242, "km"); //created
                        strCollectionInfo += "\n\n";
                        strCollectionInfo += system.functions.scmsg(243, "km"); //docs
                        strCollectionInfo += "\n";
                        arrayStats[1] = strCollectionInfo;
                    }
                }
            }
            

        }
    }else
    {
        var strCollectionInfo = getIDOLStatus();
        arrayStats[6] = strCollectionInfo;
    }
    return result

}

function checkIndexStatus(collectionName)
{
    var cache = lib.KMCache.getCache();
    var result = 0;
    var aStats;
    var strXML;
   
    if("IDOL" == vars.$G_kmsearchengine){
        var idolMiscService = lib.IDOLServiceMisc.require();
        try{
            var statusXML = idolMiscService.getStatus();

            var xQuery = lib.XQuery.require();
            var databaseNodes = xQuery.query('responsedata/databases/database', statusXML);

            var docCount = 0;

            for (var obj in databaseNodes) {

                var dbname = (xQuery.queryText('name', databaseNodes[obj]));
                if(dbname == collectionName ) {

                    docCount = xQuery.queryText('documents', databaseNodes[obj]);
                    if (Number(docCount) > 0) {
                        cache.set(collectionName, "totalDocs", Number(docCount));
                    }

                    break;
                }

            }

        } catch (ex) {
            
            var logger = getLog('KMSearchQuery');
            logger.info( system.functions.scmsg("72", "idol")); //Cannot connect to IDOL server.
            return -1;
        }

        return 0;
    }
    else {
    
        var collectionFile = new SCFile("kmknowledgebase");
        var collectionFind = collectionFile.doSelect("kbname = \""+collectionName+"\"");
        var serverFile = new SCFile("kmsearchservers");
        var serverFind = serverFile.doSelect("servername = \"" + collectionFile.searchservername + "\"");
        if (serverFind == RC_SUCCESS) {
            serverFind = serverFile.getFirst();
            for (var y = 0; y < serverFile.servers.length(); y++) {
                if (serverFile.servers[y].primarysearcher) {
                    if (serverFile.servers[y].active == false) {
                        system.functions.rtecall("log", 1, "KM server " + serverFile.servers[y].hostname + " is not active.");
                        return -1;
                    }
                    var strCfg = "<SEConfig>";
                    strCfg += "<adminhost>" + serverFile.servers[y].hostname + "</adminhost>";
                    switch (lib.KMAdmin.isSSLConfigured(serverFile.servers[y])) {
						case 0:
							strCfg += "<adminport>" + serverFile.servers[y].https_port + "</adminport>";
							break;			
						case -1:
							return null;
						default: 
								strCfg += "<adminport>" + serverFile.servers[y].port + "</adminport>";
								break;
					}

                    strCfg += "<admininstance>" + serverFile.searchinstancename + "</admininstance>";
                    strCfg += "<webdav>" + serverFile.webdavname + "</webdav>";
                    strCfg += "</SEConfig>";
                    system.library.KMSearchInterface.initializeEngine(strCfg);
                    // build xml here to tell plugin master or slave
                    strXML = "<collectioninfo>";
                    strXML += "<indexname>" + collectionName + "</indexname>";
                    strXML += "<indextype>master</indextype>";
                    strXML += "</collectioninfo>";
                    aStats = system.library.KMSearchInterface.getIndexStatistics(strXML);
                    if (aStats[0] == "OK") {
                        cache.set(collectionName, "totalDocs", aStats[3]);
                        return 0;
                    } else {
                        return -1;
                    }
                }

            }
        }
    }

}

function getIDOLStatus() {
    var idolMiscService = lib.IDOLServiceMisc.require();
    var strCollectionInfo;

    try{
        var statusXML = idolMiscService.getStatus();

        var kbname = vars['$L.file']['kbname'];
        var xQuery = lib.XQuery.require();
        var databaseNodes = xQuery.query('responsedata/databases/database', statusXML);

        var found = false,
            state = system.functions.scmsg(209, "km"), //offline
            docCount = 0,
            updateTime = funcs.str(funcs.tod()); //todo need to be updated


        for (var obj in databaseNodes) {

            var dbname = (xQuery.queryText('name', databaseNodes[obj]));
            if (dbname === kbname) {
                docCount = xQuery.queryText('documents', databaseNodes[obj]);
                //if document count > 0, means online
                if (Number(docCount) > 0) {
                    state = system.functions.scmsg(208, "km"); // online
                } else {
                    state = system.functions.scmsg(211, "km"); // created
                }
                found = true;
                break;
            }
        }

        strCollectionInfo = system.functions.scmsg(241, "km"); //state
        strCollectionInfo += ": \t\t\t "+state;

        if (found) {
            strCollectionInfo += "\n\n";
            strCollectionInfo += system.functions.scmsg(73, "idol"); //last index time
            strCollectionInfo += ": \t\t"+updateTime;
            strCollectionInfo += "\n\n";
            strCollectionInfo += system.functions.scmsg(243, "km"); //docs
            strCollectionInfo += ": \t\t\t"+docCount;
            strCollectionInfo += "\n";
        }

    } catch (ex) {
        
        strCollectionInfo = system.functions.scmsg("72", "idol"); //Cannot connect to IDOL server.
    }
    return strCollectionInfo;
}
