function getSRCUserSecurity()
{	
	var loginname = funcs.operator();
	var kbs = getvalidKBsForUser(loginname);
	var obj = {};
	obj.collections=[];
	obj.groups=[];
	
	var i, length;
	length = funcs.lng(kbs.cols);
	for (i=0; i<length;i++)
	{
		var collection = {};
		collection.name=kbs.cols[i];
		collection.shard=kbs.shards[i];
		collection.security=kbs.security[i];
		obj.collections.push(collection);
	}
	if(vars.$G_km_globalenv['ssl.enabled']) {
		obj['sslEnabled'] = '';
		obj['sslEnabled'] = vars.$G_km_globalenv['ssl.enabled'];
	}
	if (funcs.index("SysAdmin", vars.$lo_ucapex) > 0 ||
	    funcs.index("KMAdmin", vars.$lo_ucapex) > 0 )
	{
		obj.groups.push("*");
	}
	else
	{
		var userKMGroup = lib.KMSecurity.getKMGroupsForDocView(null);
		length = funcs.lng(userKMGroup);
		for (i=0; i<length;i++)
		{	
			if (userKMGroup[i]!=null)
			{
				obj.groups.push(userKMGroup[i]);
			}
		}
	}
	var JSON = lib.JSON.json();
	var ret = JSON.stringify(obj);
	return ret;
}

function getUserKMGroup(loginname)
{
	var op = new SCFile("operator", SCFILE_READONLY);
	op.setFields(["kmgroup"]);
	var query = "name=\""+loginname+"\"";
	var rc = op.doSelect(query);
	if (rc==RC_SUCCESS)
	{
		return op.kmgroup;
	}
	else
	{
	    return null;
	}
}

function getvalidKBsForUser(loginname)
{
	var collections = new Datum();
	collections.setType(8);
	var shardInfo = new Datum();
	shardInfo.setType(8);
	var security = new Datum();
	security.setType(8);
    var kmlibFile = new SCFile("kmknowledgebase");
    var kmFind = kmlibFile.doSelect("true");
    if (kmFind == RC_SUCCESS) {
        kmFind = kmlibFile.getFirst();
        while (kmFind == RC_SUCCESS) {
            var strEval = false; 
            if (lib[kmlibFile.kbaccessscript]) {
                strEval = lib[kmlibFile.kbaccessscript].checkAccess(loginname,kmlibFile);
            }
            var getenginename = lib.KMSearchInterface.getEngineName();
  			if (getenginename != "IDOL")
  			{
  				if (lib.KMCollection_Statistics.checkIndexStatus(kmlibFile.kbname) != 0)
  				{
  				  strEval = false;
  				}
  			}   
            if (strEval) {
                var shardInfostr = lib.KMUtils.getShardInfo4SRC(kmlibFile.searchservername)+"/"+kmlibFile.kbname;
                var securitystr = lib[kmlibFile.searchsecurityscript].getSecurityInfo(loginname,kmlibFile);
                collections.push(kmlibFile.kbname);
                shardInfo.push(shardInfostr);
                security.push(securitystr);
            } 
            kmFind = kmlibFile.getNext();
        }
    }
    
    var servername = lib.KMSRCCollection_Update.nosql_getservername();
    if (lib.KMCollection_Update_Utils.ifSRCChecked() && servername!=null)
    {
    	var tmpShardInfo = lib.KMUtils.getShardInfo4SRC(servername);
    	collections.push("kmdoctype");
    	shardInfo.push(tmpShardInfo+"/kmdoctype");
    	security.push("(knowledgebase_name:kmdoctype)");
    	collections.push("kmstopword");
    	shardInfo.push(tmpShardInfo+"/kmstopword");
    	security.push("(knowledgebase_name:kmstopword)");
    	collections.push("kmcategory");
    	shardInfo.push(tmpShardInfo+"/kmcategory");
    	security.push("(knowledgebase_name:kmcategory)");
    }
    
    return { cols:     collections,
    		  shards:   shardInfo,
    		  security:	security
    		  };
}
