/*   @author Tony Bray
 *
 *   Package: KMAdmin
 * 
 *   Description: This library contains helper utilities called by KMCollection
 *
*/
/**********************************************************************
 *
 * These functions handle update scheduling
 *
 *********************************************************************/

function KMCollection_Update_Utils()
{

}

function setCurrentIndexing(strCollectionFile, updating)
{
   	var collectionFile = new SCFile("kmupdateinfo");
   	var collFind = collectionFile.doSelect("kbname = \""+strCollectionFile.kbname+"\"");
   	if (collFind == RC_SUCCESS)
   	{
		collectionFile.updating = updating;
		collectionFile.doUpdate();
	}
}

function getCurrentIndexing(strCollectionFile)
{
   	var collectionFile = new SCFile("kmupdateinfo", SCFILE_READONLY);
   	collectionFile.setFields(["updating"]);
   	var collFind = collectionFile.doSelect("kbname = \""+strCollectionFile.kbname+"\"");
   	if (collFind == RC_SUCCESS)
   	{
		return collectionFile.updating;
	}
}

function ifSRCChecked()
{
	var result =false;
	var environment = new SCFile("environment",SCFILE_READONLY);
	environment.setFields(["src"]);
	var query ="name=\"knowledge management\"";
	var rc=environment.doSelect(query);
	if (rc==RC_SUCCESS)
	{
		result = environment.src;
	}
	return result;
}

function setCurrentInterval(strCollectionFile)
{
   	var collectionFile = new SCFile("kmupdateinfo");
   	var collFind = collectionFile.doSelect("kbname = \""+strCollectionFile.kbname+"\"");
   	if (collFind == RC_SUCCESS)
   	{
		collectionFile.currentinterval = strCollectionFile.currentinterval;
		collectionFile.doUpdate();
	}
}

function getCurrentInterval(strCollectionFile)
{
   	var interval = 0;
   	var collectionFile = new SCFile("kmupdateinfo");
   	var collFind = collectionFile.doSelect("kbname = \""+strCollectionFile.kbname+"\"");
   	if (collFind == RC_SUCCESS)
   	{
		interval = collectionFile.currentinterval;
	}
	else
	{
	  collectionFile.currentinterval = 0;
	  collectionFile.kbname = strCollectionFile.kbname;
	  collectionFile.doInsert();
	}  

	return interval;
}

function getKBInterval(strCollectionFile)
{
   	var interval = 0;
   	var collectionFile = new SCFile("kmknowledgebase",SCFILE_READONLY);
   	collectionFile.setFields(["interval"]);
   	var collFind = collectionFile.doSelect("kbname = \""+strCollectionFile.kbname+"\"");
   	if (collFind == RC_SUCCESS)
   	{
		interval = collectionFile.interval;
	}
	
	return interval;
}

function logUnexpectedError(errorStr)
{
	var callRtn = new SCDatum();
	funcs.rtecall("log", callRtn, "KMUpdate service could not continue " + errorStr);	   	
}

function setCurrentIndex(strCollectionFile)
{
   	var collectionFile = new SCFile("kmupdateinfo");
   	var collFind = collectionFile.doSelect("kbname = \""+strCollectionFile.kbname+"\"");
   	if (collFind == RC_SUCCESS)
   	{
		collectionFile.updating = true;
		collectionFile.doUpdate();
	}
}

function getCurrentIndex()
{
    var strKbname = "";
   	var collectionFile = new SCFile("kmupdateinfo",SCFILE_READONLY);
   	collectionFile.setFields(["kbname"]);
   	var collFind = collectionFile.doSelect("updating = \"true\"");
   	if (collFind == RC_SUCCESS)
   	{
		strKbname = collectionFile.kbname;
	}
	else
	{
	  strKbname = "Idle";
	}
	return strKbname;
}

function setCurrentIndexCurrRec(strCollectionFile,currRec)
{
   	var collectionFile = new SCFile("kmupdateinfo");
   	var collFind = collectionFile.doSelect("kbname = \""+strCollectionFile.kbname+"\"");
   	if (collFind == RC_SUCCESS)
   	{
		collectionFile.currrec = currRec;
		collectionFile.doUpdate();
	}
}

function setCurrentIndexTotRec(strCollectionFile,totRec)
{
   	var collectionFile = new SCFile("kmupdateinfo");
   	var collFind = collectionFile.doSelect("kbname = \""+strCollectionFile.kbname+"\"");
   	if (collFind == RC_SUCCESS)
   	{
		collectionFile.totrec = totRec;
		collectionFile.doUpdate();
	}
}

function setIndexStopOn()
{
   	var lockFile = new SCFile("kmadminlock");
   	var lockFind = lockFile.doSelect("id = \"kmadmin\"");
   	if (lockFind == RC_SUCCESS)
   	{
	    lockFile.stop = true;
	    lockFile.doUpdate();
	}
	return 0;
}

function setIndexStopOff() 
{
    var lockFile = new SCFile("kmadminlock");
   	var lockFind = lockFile.doSelect("id = \"kmadmin\"");
   	if (lockFind == RC_SUCCESS)
   	{
	    lockFile.stop = false;
	    lockFile.doUpdate();
	}
	return 0;
}

function getIndexStop(currRec)
{
	var result = false;
    var modulus = currRec % 50; // check every 50 records...
    if (modulus == 0)
    {
      var lockFile = new SCFile("kmadminlock",SCFILE_READONLY);
      lockFile.setFields(["stop"]);
   	  var lockFind = lockFile.doSelect("id = \"kmadmin\"");
   	  if (lockFind == RC_SUCCESS)
   	  {
	    result = lockFile.stop;
	  }
    }
     
   	return result;
}


function stopKMUpdate()
{
    if (lib.KMCollection_Update_Utils.getKMUpdateProcState())
    {
    	vars.$L_kmupdatekb = ""; // collname
    	vars.$L_kmupdatecurrrec = ""; // currrec
    	vars.$L_kmupdatetotrec = ""; // totrec
    	vars.$L_kmupdatestate = "";
    	vars.$L_kmupdaterunning = true;    

    	var fSchedule = new SCFile( "schedule" ); 
    	var currentTime = new XMLDate( new Date() );

    	fSchedule.name = "Stop KMUpdate Process";		
    	fSchedule._class ="KMUpdate";
    	fSchedule.sched_class ="KMUpdate";
    	fSchedule.expiration = currentTime.getDatum();
    	fSchedule.application = "scheduler.stop";

    	fSchedule.doInsert();	
    }
    
    return 0;
}

function clearKMUpdateFile(collectionname)
{
    var kmuFile = new SCFile("kmknowledgebaseupdates");
    var kmuFind = kmuFile.doPurge("collectionname = \""+collectionname+"\"");
   /* var kmuFind = kmuFile.doSelect("collectionname = \""+collectionname+"\"");
    if (kmuFind == RC_SUCCESS)
    {
    	kmuFind = kmuFile.getFirst();
        while (kmuFind == RC_SUCCESS)
        {
        	kmuFile.doDelete();
            kmuFind = kmuFile.getNext();
        }
    } 
    */
}

function clearKMErrorFile(collectionname)
{
    var kmuFile = new SCFile("kmknowledgebaseerrors");
    var kmuFind = kmuFile.doSelect("sedocid#\""+collectionname+"\"");
    if (kmuFind == RC_SUCCESS)
    { 
        print("found error records");
    	kmuFind = kmuFile.getFirst();
        while (kmuFind == RC_SUCCESS)
        {
        	kmuFile.doDelete();
            kmuFind = kmuFile.getNext();
        }
    } 
}

function getKMUpdatestats(arrayStats) 
{
// query the schedule record to see if we are running an update.  
// If so, then query kmupdateinfo for the kb we are updating
// and get it's info here.

    var updating = false;
    var kbname = "";
    var currrec = "";
    var totrec = "";
    var currintv = "";
   	var schedFile = new SCFile("schedule", SCFILE_READONLY);
   	schedFile.setFields(["status"]);
   	var schedFind = schedFile.doSelect("name = \"KMUpdate\"");
   	if (schedFind == RC_SUCCESS)
   	{
		if (schedFile.status != "rescheduled")
		{
		   updating = true;
		}
	}

   	if (updating)  // we are updating so get the collection info
   	{
   	  arrayStats[0] = funcs.scmsg(206, "km"); //"Running"
   	  var collFile = new SCFile("kmupdateinfo", SCFILE_READONLY);
   	  var collFind = collFile.doSelect("updating = \"true\"");
   	  if (collFind == RC_SUCCESS)
   	  {
        kbname = collFile.kbname;
        currrec = collFile.currrec;
        totrec = collFile.totrec;
   	  }
   	}
   	else {
   	  arrayStats[0] = funcs.scmsg(207, "km"); //"Idle"
   	}

    arrayStats[1] = kbname; // collname
    arrayStats[2] = currrec; // currrec
    arrayStats[3] = totrec; // totrec
    return 0;
}

function getKMUpdateProcIdle()
{
  var procs = new SCDatum();
  procs.setType(8);     //type array
  procs = funcs.processes();
  var procsLen = procs.length();
  var procsCount;
  for (procsCount=0; procsCount < procsLen; procsCount ++)
  {
    if (procs[procsCount+.3] == "KMUpdate")
    {
      return procs[procsCount+.4];
      // procs[procsCount+.4] Idle
      // procs[procsCount+.0] last expiration
    }
 
  }
   
}

function getKMUpdateProcLastExp()
{
  var procs = new SCDatum();
  procs.setType(8);     //type array
  procs = funcs.processes();
  var procsLen = procs.length();
  for (var procsCount=0; procsCount < procsLen; procsCount ++)
  {
    if (procs[procsCount+.3] == "KMUpdate")
    {
      return procs[procsCount+.0];
      // procs[procsCount+.4] Idle
      // procs[procsCount+.0] last expiration
    }
 
  }
   
}

function getKMUpdateProcID()
{
  var procs = new SCDatum();
  procs.setType(8);     //type array
  procs = funcs.processes();
  var procsLen = procs.length();
  for (var procsCount=0; procsCount < procsLen; procsCount ++)
  {
    if (procs[procsCount+.3] == "KMUpdate")
    {
      return procs[procsCount+.1];
      // procs[procsCount+.4] Idle
      // procs[procsCount+.0] last expiration
    }
 
  }
   
}

function getKMUpdateProcState()
{
  var result = false;
  var procs = new SCDatum();
  procs.setType(8);     //type array
  procs = funcs.processes();
  var procsLen = procs.length();
  for (var procsCount=0; procsCount < procsLen; procsCount ++)
  {
    if (procs[procsCount+.3] == "KMUpdate")
    {
      result = true;
    }
    
  }
  return result;  
}



/**********************************************************************
 *
 * Verify environment settings here
 *
 *********************************************************************/

function verifyEnvironment()
{
    var kmsearchservers = new SCFile("kmsearchservers", SCFILE_READONLY);
    kmsearchservers.setFields(["servername"]);
    var kmfind = kmsearchservers.doSelect("true");
    if (kmfind == RC_SUCCESS)
    {
		return 0;
    }
	else
	{
		return -1;
	}
}


/**
*  Populates a array of indexable field names and a corresponding array of field types from
*	a kmknowledgebase file.
*	fKmKnowledgebase - a kmknowledgebase file variable containing a single kmknowledgebase record
*   indexFields - an Array variable sized to the number of fields in the kmknowledgebase record 
*   indexTypes - an Array variable sized to the number of fields in the kmknowledgebase record 
**/
function getIndexFieldList(fKmKnowledgebase, indexFields, indexTypes)
{	
	var numfields = fKmKnowledgebase.kbfields.length();
	
   	// get list of fields to index from current record
   	for( var i = 0; i < numfields; i++)
	{ 
		indexFields[i]= lib.KMUtils.scToJSName(fKmKnowledgebase.kbfields[i].kbfieldname);
	 	indexTypes[i]= lib.KMUtils.scToJSName(fKmKnowledgebase.kbfields[i].kbfieldtype);
    }  
    return; //TODO - does this return the populated arrays?
}

function processRichText(fieldValue)
{
	fieldValue = "" + lib.KMUtils.HTMLtoText( fieldValue );
	fieldValue = fieldValue.replace(/(\n|\r)/g, " ");
	return fieldValue;
}

function getNextKMUpdateId()
{
	var callRtn = new SCDatum();
	var nextNumber = new SCDatum();
	funcs.rtecall("getnumber", callRtn, nextNumber, "kmknowledgebaseupdates");
	return nextNumber.getText();
}

function getALtext(collection, doc_id)
{
   	var ALText = "";
	// query target table for data 
	var sclibFile = new SCFile("kmadaptivelearning", SCFILE_READONLY);
   	var scFind = sclibFile.doSelect("kbname = \""+collection+"\" and id = \""+doc_id+"\"");
   	if( scFind == RC_SUCCESS )
	{
		var numphrases = sclibFile.phrasecount.length();
		for( var i = 0; i < numphrases; i++)
        {
        	var phrase = sclibFile.phrasecount[i].phrase;
         	var pcount = eval(sclibFile.phrasecount[i][1]);
         	for (var y = 0; y < pcount; y++)
         	{
           		ALText += phrase + " ";
         	}
        }		
	}
	
	return ALText;
}

function searchSEDocID(sedocid, shard)
{
    var hitarray;
    if(vars.$G_kmsearchengine != "IDOL")
    {
	    var colls = new Datum();
		colls.setType(8);
		colls.push(shard);
	    var fields = new Datum();
    	fields.setType(8);
    	fields.push("score");
	    hitarray = lib.KMSearchInterface.searchIndexes("sedocid:"+sedocid, "standard", "","1", "10", "200",  colls, fields, "");
	}
	else
	{
	   var searchString = "&FieldText=MATCH{"+sedocid+"}:SEDOCID";
	   var searchResult = lib.IDOLServiceQuery.require().doQueryString(searchString);
       
       hitarray = lib.KMQuery_IDOL.require().getKMHitArray(searchResult);
	}

	if (hitarray[0]>0) {
  		return true;
  	}
	else {
  		return false;
  	}

}

function usrrightstoname(usrrights)
{
	var catstr = "";
	var cats_rights = usrrights.split(";");
	for (i = 0; i < cats_rights.length-1; i++)
	{
		var cats = cats_rights[i].split(",");
		var cat = cats[0].split(":");
		for (y = 0; y < cat.length; y++)
		{
			var catFile = new SCFile("kmcategory", SCFILE_READONLY);
			catFile.setFields(["name"]); 
			if (catFile.doSelect("id = \""+cat[y]+"\"") == RC_SUCCESS && getLastRC() == RC_SUCCESS ) 
			{ 
				if (catstr.length ==0) {
		  			catstr = catFile.name;
		  		}
				else {
		  			catstr += catFile.name;
		  		}
				if (cat.length > 1 && y < cat.length-1) {
		  			catstr += ">";
		  		}
			}  
	
  		}
     	catstr +=","+cats[1]+";"; 
	}
	return catstr;
}

function categoryStrtoName(categoryStr)
{
	catstr = "";
	cats = categoryStr.split(";");
	for (i = 0; i < cats.length; i++)
	{
		cat = cats[i].split(":");
		
		for (y=0; y < cat.length; y++)
		{
			var catFile = new SCFile("kmcategory", SCFILE_READONLY);
			catFile.setFields(["name"]); 
			if (catFile.doSelect("id = \""+cat[y]+"\"") == RC_SUCCESS && getLastRC() == RC_SUCCESS ) 
			{ 
				if (catstr.length ==0) {
		  			catstr = catFile.name;
		  		}
				else {
		  			catstr += catFile.name;
		  		}
				if (cat.length > 1 && y < cat.length-1) {
		  			catstr += ">";
		  		}
			}  
	
  		}	
  		catstr +=";";		

	}
  	return catstr;
}

function getSlaveXML(servername)
{
  var strSlaveXML = "";
  var slaveFound = false;
  var serverFile = new SCFile("kmsearchservers", SCFILE_READONLY);
  var serverFind = serverFile.doSelect("servername = \""+servername+"\"");
  if (serverFind == RC_SUCCESS)
  {
    var y, length = serverFile.servers.length();
  	for (y = 0; y < length; y++)
  	{
  		if(serverFile.servers[y].servertype == "master")
  		{
  			strSlaveXML += "<master>";
  			strSlaveXML += "<hostname>"+serverFile.servers[y].hostname+"</hostname>";
  			switch (lib.KMAdmin.isSSLConfigured(serverFile.servers[y])) {
				case 0:
					strSlaveXML += "<port>"+serverFile.servers[y].https_port+"</port>";
					break;			
				case -1:
					return null;
				default: 
					strSlaveXML += "<port>"+serverFile.servers[y].port+"</port>";
					break;
			}
  			strSlaveXML += "</master>\n";
  		}
  		if(serverFile.servers[y].servertype == "slave")
  		{
  			slaveFound = true;
  			strSlaveXML += "<slave>";
  			strSlaveXML += "<hostname>"+serverFile.servers[y].hostname+"</hostname>";
  			switch (lib.KMAdmin.isSSLConfigured(serverFile.servers[y])) {
				case 0:
					strSlaveXML += "<port>"+serverFile.servers[y].https_port+"</port>";
					break;			
				case -1:
					return null;
				default: 
					strSlaveXML += "<port>"+serverFile.servers[y].port+"</port>";
					break;
			}
  			strSlaveXML += "</slave>\n";
  		}
  		
  	}
  	if (slaveFound) {
	  	return strSlaveXML;
	}
	else {
		return "";
	}
  }
  
}

function getFieldAlias(indexFields, aliasFields, index)
{
	var aliasArray=[];

	if((indexFields instanceof Array) &&
		(aliasFields instanceof Array) &&
		indexFields.length == aliasFields.length &&
		index < indexFields.length &&
		index >= 0
	){
		aliasArray = aliasFields[index].toLowerCase().split(";");
		var idx = lib.ArrayUtil.indexOf(aliasArray, indexFields[index].toLowerCase());
		if (aliasArray.length > 0 && idx > -1) {
			aliasArray.splice(idx, 1);
		}
	}
	return aliasArray;
}


function createKnowledgebaseerror(collection, sedocid, errorstr) {

    var rc = new SCDatum();
    var kmeid = new SCDatum();
    var collectionname = collection;

    var kmeFile = new SCFile("kmknowledgebaseerrors");
    funcs.rtecall("getnumber", rc, kmeid, "kmknowledgebaseerrors");

    kmeFile.sedocid = sedocid;
    kmeFile.id = kmeid;
    kmeFile.collectionname = collectionname;
    kmeFile.errormessage = funcs.str(errorstr);

    rc = kmeFile.doInsert();

    if (rc != RC_SUCCESS) {
        logger.error("Error inserting into kmknowledgebaseerrors table for sedocid: " + sedocid + " RC: " + rc);
    }

}