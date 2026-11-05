function writewebStyleFile()
{
	return 0;
}

function webCreateIndex(strCollection)
{
  	var result = 0;

  	// check for slaves, call init and create for master and slaves here...
	var strXML;
	var serverFile = new SCFile("kmsearchservers", SCFILE_READONLY);
	var serverFind = serverFile.doSelect("servername = \""+vars.$L_file.searchservername+"\"");
	if (serverFind == RC_SUCCESS)
	{
		serverFind = serverFile.getFirst();
		
		var y, lng = serverFile.servers.length();
		for (y = 0; y < lng; y++)
		{
			var strCfg = "<SEConfig>";
			strCfg += "<adminhost>"+ serverFile.servers[y].hostname + "</adminhost>";
			strCfg += "<adminport>" + serverFile.servers[y].port + "</adminport>";
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
			
			lib.KMSearchInterface.initializeEngine(strCfg);
			var xmlRec = lib.KMCollection_WebCrawl.webRecordToXML(vars.$L_file);
			result = lib.KMSearchInterface.configureIndex(xmlRec.toXMLString());
			result = lib.KMSearchInterface.createIndex(strCollection);
		}
	}
	return result;
}

function webDeleteIndex(strCollection)
{
	var strxml = lib.KMUtils.getSearchEngineConfig(vars.$L_file.kbname, "admin");
    var result = lib.KMSearchInterface.initializeEngine(strxml);
    
	if (result == -1)
	{
	 	return -1;
	}   	
	result = lib.KMSearchInterface.deleteIndex(strCollection);
    return result;
}

function createJob(record)
{
  print("creating Job");
  var crawlhost = "";
  crawlhost = record.crawlhost;

  var arrayArgs, errorMsg;
  
  if (funcs._null(crawlhost))
  {
  	arrayArgs = new SCDatum();
  	arrayArgs.setType(8);  //type array
  	arrayArgs.push("Crawler Host");
	errorMsg = funcs.scmsg(223, "km", arrayArgs);
	lib.KMUtils.domessageBox(errorMsg);
 	
	lib.KMCollection_Update_Utils.logUnexpectedError(errorMsg);			
    return -1; // no environment record
   }
   
  var crawlport = "";
  crawlport = record.crawlport;
  if (funcs._null(crawlport))
  {
  	arrayArgs = new SCDatum();
  	arrayArgs.setType(8);  //type array
  	arrayArgs.push("Crawler Port");
	errorMsg = funcs.scmsg(223, "km", arrayArgs);
	lib.KMUtils.domessageBox(errorMsg);
 	
	lib.KMCollection_Update_Utils.logUnexpectedError(errorMsg);			
    return -1; // no environment record
  } 
  
  if (record.kbtype == "weblib")
  {
	  var weburls = "";
	  if (lib.KMUtils.isSCArray(record.weburllist))
	  {
	   	weburls = lib.KMUtils.scArrayToString(record.weburllist);
	  }
	  
	  if (weburls == null || weburls.length < 5)
	  {
	    arrayArgs = new SCDatum();
	  	arrayArgs.setType(8);  //type array
	  	arrayArgs.push("URLS");
		errorMsg = funcs.scmsg(223, "km", arrayArgs);
		lib.KMUtils.domessageBox(errorMsg);
	 	
		lib.KMCollection_Update_Utils.logUnexpectedError(errorMsg);
	   	return -1;
	  }  
	  
	  if (record.webjumps == null)
	  {
	    arrayArgs = new SCDatum();
	  	arrayArgs.setType(8);  //type array
	  	arrayArgs.push("Max Links to Follow");
		errorMsg = funcs.scmsg(223, "km", arrayArgs);
		lib.KMUtils.domessageBox(errorMsg);
	 	
		lib.KMCollection_Update_Utils.logUnexpectedError(errorMsg);  
		return -1;
	  } 
  }
  
  if (record.webpathlen == null)
  {
    arrayArgs = new SCDatum();
  	arrayArgs.setType(8);  //type array
  	if (record.kbtype == "weblib")
  	{
  		arrayArgs.push("URL Path Depth");
  	}
  	else
  	{
  		arrayArgs.push("Path Depth");
  	}
	errorMsg = funcs.scmsg(223, "km", arrayArgs);
	lib.KMUtils.domessageBox(errorMsg);
 	
	lib.KMCollection_Update_Utils.logUnexpectedError(errorMsg);  
  	return -1;
  }
  
    var slaveXML = lib.KMCollection_Update_Utils.getSlaveXML(record.searchservername);
    
    var xmlRec = lib.KMCollection_WebCrawl.webRecordToXML(record);
    var strJobName = lib.KMUtils.scToJSName(record.kbname);
    if (slaveXML != null && slaveXML.length > 0)
  	{
  		// add slaveXML to xmlRec
  		slaveXML = "<slaveinfo>"+slaveXML+"</slaveinfo>";
		var slaveXMLRec = new XML();
		slaveXMLRec = slaveXMLRec.setContent(slaveXML);
		var FoundNode = findTargetElement( slaveXMLRec , "slaveinfo" );
		var NewNode = xmlRec.importNode( FoundNode );
		var appendedNode = xmlRec.appendNode( NewNode );
  	}
    
    var result = lib.KMSearchInterface.createJob(strJobName, xmlRec.toXMLString());
    return result;
}

function deleteJob(record)
{
	print("deleting Job");
  	var crawlhost = "";
  	crawlhost = record.crawlhost;
  	var crawlport = "";
  	crawlport = record.crawlport;
  	var strJobName = lib.KMUtils.scToJSName(record.kbname);
  	var jobxml = "";
  	jobxml = "<deletejob><jobname>"+strJobName+"</jobname><crawlhost>"+crawlhost+"</crawlhost><crawlport>"+crawlport+"</crawlport></deletejob>";
    result = lib.KMSearchInterface.deleteJob(jobxml);
    return result;
}


function startwebcrawl(strCollection)
{
	var result = lib.KMSearchInterface.startJob(lib.KMCollection_WebCrawl.getCrawlDestination(vars.$L_file));
    return result;
}

function stopwebcrawl(strCollection)
{
    var result = lib.KMSearchInterface.stopJob(lib.KMCollection_WebCrawl.getCrawlDestination(vars.$L_file));
    return result;
}

function getJobStatus(strCollection)
{
	var result = lib.KMSearchInterface.getJobStatus(lib.KMCollection_WebCrawl.getCrawlDestination(vars.$L_file));
	return result;
}

function webRecordToXML(record)
{
	var indexConfig = new XML();
	indexConfig = indexConfig.setContent(lib.KMUtils.getSearchEngineConfig(record.kbname, "index"));
	//locate elements by name
	var indexHost = lib.KMCollection_WebCrawl.findTargetElement(indexConfig, "indexhost");
	var indexPort = lib.KMCollection_WebCrawl.findTargetElement(indexConfig, "indexport");
	var indexInstance = lib.KMCollection_WebCrawl.findTargetElement(indexConfig, "indexinstance");
	//need to convert $L.file to xml
	var xmlRec = record.getXML();
	//find "instance" element
	var targetElement = lib.KMCollection_WebCrawl.findTargetElement(xmlRec, "instance");
	//create new nodes for xmlRec using data from SEConfig xml
	var NewNodeServer = xmlRec.createNode(1,indexHost.getNodeName(),"");
	NewNodeServer.setValue(indexHost.getNodeValue());
	var NewNodePort = xmlRec.createNode(1,indexPort.getNodeName(),"");
	NewNodePort.setValue(indexPort.getNodeValue());
	var NewNodeInstance = xmlRec.createNode(1,indexInstance.getNodeName(),"");
	NewNodeInstance.setValue(indexInstance.getNodeValue());

	//add nodes to xmlRec at our target element "instance"
	targetElement.appendNode(NewNodeServer);
	targetElement.appendNode(NewNodePort);	
	targetElement.appendNode(NewNodeInstance);
	var mimeElement = lib.KMCollection_WebCrawl.findTargetElement(xmlRec, "mastermimelist");
	if (mimeElement != null)
	{
		mimeElement.setValue(getXMLMimeList(record));
	}
	else
	{
		//create mastermimelistnode here...
		var NewNodeMimes = xmlRec.createNode(1,"mastermimelist","");
		NewNodeMimes.setValue(getXMLMimeList(record));
		targetElement.appendNode(NewNodeMimes);
	}
	
	return xmlRec;
}

function findTargetElement( node, targetElem )
{
 var topNodeName = node.getNodeName();
 while (node != null && node.getNodeName() != targetElem )
 {
  var childNode = node.getFirstChildElement();
  if (childNode == null)
  {
   childNode = node.getNextSiblingElement();
   while (childNode == null)
   {
    node = node.getParentNode();
    if ( node == null || topNodeName == node.getNodeName() )
    {
     return null;
    }
    childNode = node.getNextSiblingElement();
   }
   node = childNode;
  }
  else
  {
   node = childNode;
  }
 }
 return node;
}


function getCrawlDestination(record)
{
	var crawlXML = "";
	crawlXML = "<jobinfo>\n";
	crawlXML += "<crawlhost>"+record.crawlhost+"</crawlhost>\n";
	crawlXML += "<crawlport>"+record.crawlport+"</crawlport>\n";
	crawlXML += "<crawlinstance>"+"crawlinstance"+"</crawlinstance>\n";
	crawlXML += "<jobname>"+record.kbname+"</jobname>\n";
	crawlXML += "</jobinfo>\n";
	
	return crawlXML;
}

function didJobChange(current_record, new_record)
{
    var oldurl = "";
    var newurl = "";
    if (lib.KMUtils.isSCArray(current_record.weburllist))
    {
    	newurl = lib.KMUtils.scArrayToString(new_record.weburllist);
    	oldurl = lib.KMUtils.scArrayToString(current_record.weburllist);
    }
	if (oldurl != newurl)
	{
    	return true;
	}
	var oldmimelist = "";
	var newmimelist = "";
	if (lib.KMUtils.isSCArray(current_record.mimelist))
    {
    	newmimelist = lib.KMUtils.scArrayToString(new_record.mimelist);
    	oldmimelist = lib.KMUtils.scArrayToString(current_record.mimelist);
    }
	if (oldmimelist != newmimelist)
	{
   		return true;
   	}
   	
   	if (current_record.webhost != new_record.webhost)
	{
   		return true;
   	}
   	if (current_record.webpathlen != new_record.webpathlen)
	{
   		return true;
   	}
   	if (current_record.webjumps != new_record.webjumps)
	{
   		return true;
   	}
   	if (current_record.mimeproperty != new_record.mimeproperty)
	{
   		return true;
   	}
   	if (current_record.crawlhost != new_record.crawlhost)
   	{
   		return true;
   	}
   	if (current_record.crawlport != new_record.crawlport)
   	{
   		return true;
   	}
   	
   return false;
}

function getXMLMimeList(record)
{
	var i, ilng, y, ylng;
	
	var includeMimes = new SCDatum();
  	includeMimes.setType(8); //type array
  	if (record.mimeproperty == "unlimited")
  	{
  		includeMimes.push("unlimited");
  	}
	else if (record.mimeproperty == "include")
	{
		if (record.mimelist.mimelist == null)
		{
			includeMimes = vars.$mimetypes;
		}
		else
		{
			includeMimes = record.mimelist;
		}
	}
	else if (record.mimeproperty == "exclude")
	{
		if (record.mimelist.mimelist == null)
		{
			includeMimes = vars.$mimetypes;
		}
		else
		{
			var excludeMimes = new SCDatum();
  			excludeMimes.setType(8);  //type array
  			excludeMimes = record.mimelist;
  			var mimeFound = false;
  			
  			ilng = vars.$mimetypes.length();
			ylng = excludeMimes.length();
  			for (i =0; i < ilng; i++)
  			{
  				for (y = 0; y < ylng; y++)
  				{
  					if (excludeMimes[y] == vars.$mimetypes[i] && excludeMimes[y] != null)
  					{
						mimeFound = true;
  					}
  				}
  				if (mimeFound == false)
  				{
  					includeMimes.push(vars.$mimetypes[i]);
  				}
  				else
  				{
  					mimeFound = false;
  				}
  			}
  		}
	}

    var mastermimelist = "";
    ylng = includeMimes.length();
	for (y=0; y<ylng; y++)
	{
		if (y>0)
		{
			mastermimelist += ", ";
		}
		mastermimelist += "\""+includeMimes[y]+"\"";
	}
	print("masterMimeList: "+mastermimelist);
	return mastermimelist;
}