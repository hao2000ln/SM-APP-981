/*   @author Tony Bray
*/

/**
*   @class KMAdmin
*   @constructor
*/
// vars.$G_km_globalenv.km_adminport


/* all functions return 0 for succes, -1 for errors
*/
function KMAdmin() 
{
 
}


function kmtriggerAfterAdd(filename, record)
{
// function moved to KMCollection_Update_Triggers!
	lib.KMCollection_Update_Triggers.kmtriggerAfterAdd(filename, record);
}

function kmtriggerBeforeUpdate(filename, record)
{
// function moved to KMCollection_Update_Triggers!
	lib.KMCollection_Update_Triggers.kmtriggerBeforeUpdate(filename, record);
}

function kmtriggerAfterUpdate(filename, record)
{
// function moved to KMCollection_Update_Triggers!
	lib.KMCollection_Update_Triggers.kmtriggerAfterUpdate(filename, record);
}

function kmtriggerBeforeDelete(filename, record)
{
// function moved to KMCollection_Update_Triggers!
	lib.KMCollection_Update_Triggers.kmtriggerBeforeDelete(filename, record);
}


function kmaltriggerAfterUpdate(filename, record)
{
// function moved to KMCollection_Update_Triggers!
   lib.KMCollection_Update_Triggers.kmaltriggerAfterUpdate(filename, record);
}


function kmadminlock()
{
	var lockFile = new SCFile("kmadminlock");
	var lockFind = lockFile.doSelect("id = \"kmadmin\"");
	if (lockFind == RC_SUCCESS)
	{
		if (Lock("KMAdmin") == 0)
		{
		    return 0;
	    }
	    else {
			return -1; // cannot lock it
		}
	}
	else // kmadminlock record not found; add a default for the stop flag
    {
    	lockFile.id = "kmadmin";
  	    lockFile.stop = false;
  	    lockFile.doInsert(); 
  	    if (Lock("KMAdmin") == 0)
		{
		    return 0;
	    }
	    else {
			return -1; // cannot lock it
  	    }  	
    }
}

function kmadminunlock() // use this function to override a bad lock
{
	if (Unlock("KMAdmin") > 0) {
		return -1;
	}
    else {
      return 0;
    }
}

/*
* QCCR1E54429
* This function is just a proxy call to support upgraded sysytems.  On an upgraded
* system, the KMUpdate schedule record would not be changed and would still contain
* a call to lib.KMAdmin.refreshIndexes() instead of lib.KMCollection_Update.refreshIndexes();
*/
function refreshIndexes()
{
	lib.KMCollection_Update.refreshIndexes();
}

/**
	Solr ssl support
	Check if the ssl configuration is correct
	return 0: ssl enabled and https port configured
	return -1 : ssl enabled but https port is empty
	return 1: ssl not configured
*/
function isSSLConfigured(server) {
	if(vars.$G_km_globalenv['ssl.enabled']) {
		if(server.https_port) {
			return 0;
		} else {
			var args = new SCFile();
			args.setType( 8 );	//type array
			args.push( server.hostname );
			var str = funcs.scmsg( 99994, "km", args);
			funcs.rtecall("msg","",str, 3); 
			return -1;
		}
	} 
	return 1;
}

function isFipsMode() {
	return funcs.sysinfo_get("ssl");
}