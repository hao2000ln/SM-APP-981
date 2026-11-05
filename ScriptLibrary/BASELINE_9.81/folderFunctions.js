/**  This function is used to return limiting sql for folder permissions
*
*	@param {String} tableName	-  The name of the table to reference
*	@param {String}	profileName	-	The name of the module profile to use
*	@return the limiting sql from the scaccess record for the corresponding module/profile
*		if the profileName is null then the function will retrieve the correct profile
*	@type String
*/

function getAllowedFolders( tableName, profileName )
{
	var scaccessRecord = new SCFile("scaccess", SCFILE_READONLY);
	scaccessRecord.setFields(["restricting.query"]);
	var folderSql = "folder=NULL";
	var profile;
	
	if (profileName != null) {
	    profileName=null;
	}

	if ( profileName == null )
	{
		switch( tableName )
		{
			case "incidents":
				profile = vars.$G_sm_environment;
				profileName = vars.$G_sm_environment.name;
				break;
			case "probsummary":
				profile = vars.$G_pm_environment;
				profileName = vars.$G_pm_environment.name;
				break;
			case "rootcause":
			case "rootcausetask":
			case "knownerror":
			    profile = vars.$G_rc_environment;
				profileName = vars.$G_rc_environment.name;
				break;
			case "device":
			    profile = vars.$G_am_environment;
				profileName = vars.$G_am_environment.name;
				break;				
			case "contract":
				profile = vars.$G_ct_environment;
				profileName = vars.$G_ct_environment.name;
				break;
			case "sla":
				profile = vars.$G_sla_profile;
				profileName = vars.$G_sla_profile.name;
				break;
			case "ocmo":
			case "ocml":
			case "ocmq":
			case "request":
				profile = vars.$G_ocmq_environment;
				profileName = vars.$G_ocmq_environment.name;
				funcs.strclpl(profileName,2);
				break;
			case "requestTask":
				profile = vars.$G_ocml_environment;
				profileName = vars.$G_ocml_environment.name;
				funcs.strclpl(profileName,2);
				break;
			case "cm3r":
			case "cm3t":
				profile = vars.$G_cm3r_environment;
				profileName = vars.$G_cm3r_environment.name;
				funcs.strclpl(profileName,2);
				break;	
		    default:
		        profile = vars.$L_env;															
		}
	}

	var folders=lib.tableAccess.getFoldersWithViewAccess(profile);
	if (folders.length>0)
	{
	    folderSql="(folder isin "+funcs.str(folders)+"or folder=NULL)";
	}
	
	var sql = "filename=\"" + tableName + "\" and security.id=\"" + profileName + "\"";

	if ( scaccessRecord.doSelect( sql ) == RC_SUCCESS )
	{
		if (folders.length>0)
		{
		    return folderSql+" and "+scaccessRecord.restricting_query;
		}
		return scaccessRecord.restricting_query;
	}
	else
	{
		return folderSql;
	}
}

function createFolderRights( folderDef )
{
	var rights = new SCFile( "secRights", SCFILE_READONLY );
	if ( rights.doSelect( "true" ) == RC_SUCCESS )
	{
		do
		{
			var fRights = new SCFile( "FolderRights" );
			var sql = "role=\"" + rights.role + "\" and area=\"" +rights.area+"\" and folder=\"" + folderDef.name +"\"";

			if ( fRights.doSelect( sql ) != RC_SUCCESS )
			{
				fRights.folder = folderDef.name;
				fRights.role = rights.role;
				fRights.area = rights.area;
				fRights.view = rights.view;
				fRights._new = rights._new;
				fRights.update = rights.update;
				fRights._delete = rights._delete;
				fRights.expert = rights.expert;
				fRights.admin = rights.admin;
				fRights.allowedStatus = rights.allowedStatus;
				
				fRights.doInsert();
			}
		}
		while ( rights.getNext() == RC_SUCCESS );
	}
}

function removeFolderRights( folderDef )
{
	var rights = new SCFile( "FolderRights" );
	var sql = "folder=\""+folderDef.name+"\""; 
	
	if ( rights.doSelect( sql ) == RC_SUCCESS )
	{
		do
		{
			rights.doDelete();
		}
		while ( rights.getNext() == RC_SUCCESS );
	}
}

function renameFolderRights( folderDef, oldFolderDef )
{
	var rights = new SCFile( "FolderRights" );
	var sql = "folder=\""+oldFolderDef.name+"\""; 
	
	if ( rights.doSelect( sql ) == RC_SUCCESS )
	{
		do
		{
			rights.folder = folderDef.name;
			rights.doUpdate();
		}
		while ( rights.getNext() == RC_SUCCESS );
	}
}

/**
QCCR1E74348 - An operator who has no folder right to view incident management records can incorrectly view all incident management records.
Update the scFolderAccess that has no view rights
 */
function updateFolderAccessNoViewRights(){
    var rights = new SCFile( "FolderRights" );
    var sql = "view=false";
    var ret = rights.doSelect( sql );
    
    while (ret==RC_SUCCESS){
        var rc = funcs.rtecall("callrad", 1, "trigger.folderAccess", 
								["file", "record", "index"],  [rights, rights, 2], false);
        ret = rights.getNext();
    }
		
}

function getAllFolders() {
    var i=0;
    var folders=[];
    var folder=new SCFile("FolderDef", SCFILE_READONLY);
    folder.setFields(["name"]);
    var rc=folder.doSelect("true");
    while (rc==RC_SUCCESS) {
        folders[i++]=folder.name;
        rc=folder.getNext();
    }
    return folders;
}


/**
 * Refresh all folder rights to update scFolderAccess records
 */
function refreshAllFolderRights() {
	lib.c.$("FolderRights").selectAll().iterate(function(right) {
		right.doUpdate();
	});
}
