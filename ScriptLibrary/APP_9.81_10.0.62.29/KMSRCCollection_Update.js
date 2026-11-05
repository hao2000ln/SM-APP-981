/*   @author Heron Li
*/
function nosql_reindex(tablename, key)
{
	  var result = 0;
      result = lib.KMAdmin.kmadminlock();
      if (result != 0) {
          return -3;
      }
	  var servername = nosql_getservername();
	  if (servername==null)
	  {
	  	  lib.KMAdmin.kmadminunlock();
	  	  print(funcs.scmsg(247, "km"));
	  	  return -1;
	  }
      var getenginename = lib.KMSearchInterface.getEngineName();
	  if (getenginename != "IDOL")
	  {
	     var strxml = nosql_getSearchEngineConfig(servername, "admin");// index , search
	     result = lib.KMSearchInterface.initializeEngine(strxml);
	     if (result == -1)
	     {
	     	lib.KMAdmin.kmadminunlock();
	     	print(funcs.scmsg(224, "km"));
	     	return -1;
	     }
	  }
	  result = lib.KMCollection_Delete.deleteCollection(lib.KMUtils.scToJSName(tablename));
  	  if (result != 0)
  	  {
  	  	lib.KMAdmin.kmadminunlock();
  	  	return -1;
  	  }
	  // check for slaves here, call configure and create for master and slaves...
	  var strXML;
	  var serverFile = new SCFile("kmsearchservers");
      var serverFind = serverFile.doSelect("servername = \""+servername+"\"");
      if (serverFind == RC_SUCCESS)
	  {
			var kbfile = new SCFile("kmknowledgebase");
		   	kbfile.kbname = tablename;
		   	kbfile.kbtype = "sclib";
		   	kbfile.docid = key;
		    kbfile.searchservername = servername;
		    kbfile.sclibtablename = tablename;
		    kbfile.interval = 1;
		    kbfile.locale = "en";
		    var y;
		    var length = serverFile.servers.length();
			for (y = 0; y < length; y++)
			{
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
				result = lib.KMSearchInterface.initializeEngine(strCfg);
				var xmlstr;
				if(serverFile.servers[y].servertype == "master" && result == 0)
				{
					xmlstr = lib.KMUtils.recordToXML(kbfile);
	  				result = lib.KMCollection_Configure.configureCollection(xmlstr);
	  				if (result != 0)
  	  				{
  	  					lib.KMAdmin.kmadminunlock();
  	  					return -1;
  	  				}
	  				result = lib.KMCollection_Create.createCollection(lib.KMUtils.scToJSName(tablename));		  
	  				if (result != 0)
  	  				{
  	  					lib.KMAdmin.kmadminunlock();
  	  					return -1;
  	  				}
  	  			}
  	  			if(serverFile.servers[y].servertype == "slave" && result == 0)
  	  			{
  	  				strXML = "<collectioninfo>";
					strXML += "<indexname>"+tablename+"</indexname>";
					strXML += "<indextype>master</indextype>";
					strXML += "</collectioninfo>"; 
					var aStats = lib.KMSearchInterface.getIndexStatistics(strXML);
					if(aStats.length() > 0 && aStats[0] != "OK" )
					{
						xmlstr = lib.KMUtils.recordToXML(kbfile);
	  					result = lib.KMCollection_Configure.configureCollection(xmlstr);
	  					if (result != 0)
  	  					{
  	  						lib.KMAdmin.kmadminunlock();
  	  						return -1;
  	  					}	
						result = lib.KMCollection_Create.createCollection(lib.KMUtils.scToJSName(tablename));		  
	  					if (result != 0)
  	  					{
  	  						lib.KMAdmin.kmadminunlock();
  	  						return -1;
  	  					}
					}
  	  			}
  	  			if(serverFile.servers[y].servertype == "slave" && result != 0)
  	  			{
  	  				print("Slave server: "+serverFile.servers[y].hostname+" offline, skipping..");
  	  			}
  	  			if(serverFile.servers[y].servertype == "master" && result != 0)
				{
					print("Master server: "+serverFile.servers[y].hostname+" offline, stopping..");
				}
  	  		}
  	  		result = submitDocs(tablename,key,servername);
			if (result != 0)
			{
				lib.KMAdmin.kmadminunlock();
				return result;
			}
			else
			{
				var slaveXML = lib.KMCollection_Update_Utils.getSlaveXML(servername);
		  		if (slaveXML.length > 0)
		  		{
			   		var closeIndexXML = "";
			       	closeIndexXML = "<closeindex><indexname>"+lib.KMUtils.scToJSName(tablename)+"</indexname>";
			       	closeIndexXML += slaveXML;
			       	closeIndexXML += "</closeindex>";
			       	var close_result = lib.KMSearchInterface.closeIndex(closeIndexXML);
			    }
			}
  	  	}	
  	  	else
  	  	{
  	  		lib.KMAdmin.kmadminunlock();
  	  		return -1;  
	  	}
	   	return lib.KMAdmin.kmadminunlock(); 
}


function replaceSCMSGTokens(theView,langcode)
{
	if (theView == null) {
	    return "";
	}
	var spec_loc2 = theView.indexOf("*SCMSG");
	var tmpFld3 = "";
	var tmpVal2 = "";
	while (spec_loc2 >= 0)
	{
		tmpFld3 = theView.substring(spec_loc2 + 7, theView.length);
		tmpFld3 = tmpFld3.substring(0, tmpFld3.indexOf("*SCMSG"));
 		tmpVal2 = eval("getLangScmsg(langcode," + tmpFld3 + ", \"km\");");
	 	if (tmpVal2 == null)
	 	{
	 		tmpVal2 = "";
	 	}
		theView = theView.substring(0, spec_loc2) + tmpVal2 + theView.substring((theView.indexOf(tmpFld3 + "*SCMSG")+tmpFld3.length+7), theView.length);
		spec_loc2 = theView.indexOf("*SCMSG");   
	}
	return theView;
}

function getLangScmsg(langcode,msgID,className)
{
	var lang = new SCFile("scmessage");
	var query = "syslanguage=\""+ langcode +"\" and class=\""+className+"\" and message.id=\""+ msgID +"\"";
	var ret = lang.doSelect(query);
	if (ret == RC_SUCCESS)
	{
		return lang.message;
	}
	else {
	    return null;
	}
}

function submitDocs(tablename,key,servername)
{
    return RC_SUCCESS;
}


function nosql_getservername()
{
	var environment = new SCFile("environment");
	var query = "name=\"knowledge management\" and src=true";
	var rc= environment.doSelect(query);
	if (rc==RC_SUCCESS)
	{
		return environment.searchservername;
	}
	else {
	    return null;
	}
}

function nosql_getSearchEngineConfig(searchservername, type)
{
	var searchserversFile = new SCFile("kmsearchservers");
	var searchserverFind;
	if (type == "admin" || type == "index") {
		searchserverFind = searchserversFile.doSelect("servername = \""+searchservername+"\"");
	}
	else {
		searchserverFind = searchserversFile.doSelect("true");
	}

	while (searchserverFind == RC_SUCCESS)
	{
		var indexinstancename = searchserversFile.searchinstancename;
		var webdav = searchserversFile.webdavname;
		var searchinstancename = searchserversFile.searchinstancename;			
	    
	    var y;
	    var length = searchserversFile.servers.length();
	    for (y = 0; y < length; y++)
	    {
	    	if(searchserversFile.servers[y].servertype == "master")
	    	{
				var indexhostname = searchserversFile.servers[y].hostname;
				var indexport = searchserversFile.servers[y].port;
                switch (lib.KMAdmin.isSSLConfigured(searchserversFile.servers[y])) {
					case 0:
						indexport = searchserversFile.servers[y].https_port;
						break;			
					case -1:
						return null;
					default:
				}
			}
			
			if(searchserversFile.servers[y].primarysearcher)
			{
				var args = new Datum();
				args.setType(8);
				args.push(searchserversFile.servers[y].hostname);
				switch (lib.KMAdmin.isSSLConfigured(searchserversFile.servers[y])) {
					case 0:
						args.push(searchserversFile.servers[y].https_port);
						break;			
					case -1:
						return null;
					default: 
						args.push(searchserversFile.servers[y].port);
				}
                args.push(searchserversFile.searchinstancename);
                switch (lib.KMAdmin.isSSLConfigured(searchserversFile.servers[y])) {
					case 0:
						args.push('ssl.enabled');
						break;			
					case -1:
						return null;
					default:
				}
				var pingResponse =lib.KMSearchInterface.pingEngine(args);
				if(pingResponse == RC_SUCCESS)
				{
					var searchhostname = searchserversFile.servers[y].hostname;
					var searchport = "";
					switch (lib.KMAdmin.isSSLConfigured(searchserversFile.servers[y])) {
					case 0:
						searchport = searchserversFile.servers[y].https_port;
						break;			
					case -1:
						return null;
					default: 
						searchport = searchserversFile.servers[y].port;
    				}
				}
			}
		}
		if (!searchserverFind) {
			searchserverFind = searchserversFile.getNext();
		}
		else {
			break;
		}
	}
	
	var strCfg = "<SEConfig>";
	
	if (type == "index")
	{
		strCfg += "<indexhost>"+ indexhostname + "</indexhost>";
		strCfg += "<indexport>" + indexport + "</indexport>";
		strCfg += "<indexinstance>" + indexinstancename + "</indexinstance>";
	}
	else
	if (type == "admin")
	{
		strCfg += "<adminhost>"+ indexhostname + "</adminhost>";
		strCfg += "<adminport>" + indexport + "</adminport>";
		strCfg += "<admininstance>" + indexinstancename + "</admininstance>";
		strCfg += "<webdav>" + webdav + "</webdav>";
	}
	else
	if (type == "search")
	{
		strCfg += "<searchhost>"+ searchhostname + "</searchhost>";
		strCfg += "<searchport>" + searchport + "</searchport>";
		strCfg += "<searchinstance>" + searchinstancename + "</searchinstance>";
	}
	strCfg += "</SEConfig>";
	return strCfg;
}

function SRCReindex()
{
  	var result = nosql_reindex("kmdoctype", "name");
  	if (result!=0)
  	{
  		return result;
  	}
  	else {
  	    result = nosql_reindex("kmstopword", "langcode");
  	}
  	if (result!=0)
  	{
  		return result;
  	}
  	//submit docs for kmlib
	reindexKMLib();
  	print("Full reindex finished.");
  	return result;
}

/**
 * fix for QCCR1E120089, call re-index function with $L.file='Knowledge_Library' context
 */
function reindexKMLib(){
	//save current $L.file to temp variale
	var tmp = new SCFile('kmknowledgebase'); 
	funcs.fduplicate(tmp,vars.$L_file);
	var kb = new SCFile('kmknowledgebase');
	kb.doSelect('kbname="Knowledge_Library"');
	vars.$L_file=kb;
	
	//call re-index function with Knowledge_Library as $L.file
//	lib.KMCollection_Update.reindex();
    lib.KMCollection_Update_IDOL.require().reindex();

	vars.$L_file = null;
	vars.$L_file = new SCFile('environment');
	//restore current $L.file
	funcs.fduplicate(vars.$L_file,tmp);
}