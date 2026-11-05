/*
* @fileoverview  Handles the referential integrity functions for the Security Model.
* @author Pete Budic
*/


/**
*  This function is called from a trigger on secRole to add or update the secRights table
*  that functions as the join of the secRole and secArea tables.
*/
function updateRoleRights( role, oldRole )
{
	var roleName = role.name;
	var oldRoleName;
	if (oldRole == null )
	{
		oldRoleName = roleName;
	}	
	else
	{
		oldRoleName = oldRole.name;
		if ( oldRoleName == null )
		{
			oldRoleName = roleName;
		}
	}
	var area = new SCFile( "secArea", SCFILE_READONLY );
	var sql;
	if ( area.doSelect( "true" ) == RC_SUCCESS )
	{
		do
		{
			var right = new SCFile( "secRights" );
			sql = "role=\""+oldRoleName+"\" and area=\""+area.name+"\"";
			if ( right.doSelect( sql ) == RC_SUCCESS )
			{
				var doUpdate = false;
				
				if ( right.role != roleName)
				{
					right.role = roleName;
					doUpdate = true;
				}
				if ( doUpdate )
				{
					right.doUpdate();
				}
			}
			else
			{
				right.role = role.name;
				right.area = area.name;
				right.view = area.view;
				right._new = area._new;
				right.update = area.update;
				right._delete = area._delete;
				right.modifyTemplate = area.modifyTemplate;
				//addAllSecFolders( right ); //this is not applicable since we now implement PD folder rights based on "FolderRights" table.
				right.doInsert();
			}
		}
		while (area.getNext() == RC_SUCCESS);
	}
	
	if ( roleName != oldRoleName )
	{
		renameRoleInOperators( oldRoleName, roleName );
		renameRoleInUserRoles( oldRoleName, roleName);
		//another trigger adds the new one.
		removeRoleFromMandanten( oldRoleName );
	}
}

/**
*  This function is called from a trigger on secArea to add or update the secRights table
*  that functions as the join of the secRole and secArea tables.
*/
function updateAreaRights( area, oldAreaName )
{
	if (oldAreaName == null || oldAreaName == "")
	{
		oldAreaName = area.name;
	}	
	var role = new SCFile( "secRole", SCFILE_READONLY );
	role.setFields(["name"]);
	var sql;
	if ( role.doSelect( "true" ) == RC_SUCCESS )
	{
		do
		{
			var right = new SCFile( "secRights" );
			sql = "role=\""+ role.name +"\" and area=\""+ oldAreaName +"\"";
			if ( right.doSelect( sql ) == RC_SUCCESS )
			{
				if ( right.area != area.name)
				{
					right.area = area.name;
					right.doUpdate();
				}
			}
			else
			{
				right.role = role.name;
				right.area = area.name;
				right.view = area.view;
				right._new = area._new;
				right.update = area.update;
				right._delete = area._delete;
				right.modifyTemplate = area.modifyTemplate;
				//addAllSecFolders( right );//this is not applicable since we now implement PD folder rights based on "FolderRights" table.
				right.doInsert();
			}
		}
		while (role.getNext() == RC_SUCCESS);
	}
	
	if ( area.name != oldAreaName )
	{
		sql = "sc.area=\""+ oldAreaName +"\"";
		var table = new SCFile("datadict");
		
		if ( table.doSelect(sql) == RC_SUCCESS )
		{
			table.sc_area = area.name;
			table.doUpdate();
		}
	}
}


/**
*  This function is called from a trigger on secModule to remove or update secModule entries from the secArea
*  records if the module is deleted.
*/
function updateModuleInAreas( moduleName, oldModuleName )
{

    // When you delete a module, the module name needs to be removed from secArea
	if (moduleName == oldModuleName )
	{
		moduleName="";
	}	
	if (oldModuleName != null)
	{
		var sql = "module=\""+ oldModuleName +"\"";
		var areas = new SCFile("secArea");
		
		if ( areas.doSelect(sql) == RC_SUCCESS )
		{
			do
			{
				areas.module=moduleName;
				areas.doUpdate();
			}
			while (areas.getNext() == RC_SUCCESS);
		}
	}	
}

/**
*  This function is called from a trigger on secRole to delete records from the secRights
*  table if the role is deleted.
*/
function deleteRoleTrigger( roleName, oldRoleName )
{
	if (oldRoleName == null )
	{
		oldRoleName = roleName;
	}	
	if (oldRoleName != null)
	{
		var sql = "role=\""+ oldRoleName +"\"";
		var rights = new SCFile("secRights");
		
		if ( rights.doSelect(sql) == RC_SUCCESS )
		{
			do
			{
				rights.doDelete();
			}
			while (rights.getNext() == RC_SUCCESS);
		}
						
		removeRoleFromOperators( oldRoleName );
		removeRoleFromUserrole( oldRoleName );
		removeRoleFromMandanten( oldRoleName );
	}	
}	
	
/**
*  This function is called from a trigger on secArea to delete records from the secRights
*  table if the area is deleted.
*/
function deleteAreaTrigger( areaName, oldAreaName )
{
	if (oldAreaName == null )
	{
		oldAreaName = areaName;
	}	
	if (oldAreaName != null)
	{
		var sql = "area=\""+ oldAreaName +"\"";
		var rights = new SCFile("secRights");
		
		if ( rights.doSelect(sql) == RC_SUCCESS )
		{
			do
			{
				rights.doDelete();
			}
			while (rights.getNext() == RC_SUCCESS);
		}
		
		// delete settingsConfig records for this Area
        sql = "setting=\""+ oldAreaName +"\"";
        var settingsConf = new SCFile("settingsConfig");
                                
        if ( settingsConf.doSelect(sql) == RC_SUCCESS )
        {
            do
            {
            	settingsConf.doDelete();
            }
            while (settingsConf.getNext() == RC_SUCCESS);
        }
		
		
		sql = "sc.area=\""+ oldAreaName +"\"";
		var table = new SCFile("datadict");
		
		if ( table.doSelect(sql) == RC_SUCCESS )
		{
			table.sc_area = null;
			table.doUpdate();
		}				                            				
	}	
}

/**
*  This function is called from a trigger on secRights to delete the associated
*  FolderRights records.
*/
function deleteRightsTrigger( oldRecord )
{
	if ( oldRecord != null )
	{
		var sql = "name=\""+ oldRecord.role +"\" and tablename=\"" + oldRecord.area +"\"";
		var folder = new SCFile("FolderRights");
		
		if ( folder.doSelect(sql) == RC_SUCCESS )
		{
			do
			{
				folder.doDelete();
			}
			while (folder.getNext() == RC_SUCCESS);
		}
		
	}	
}	


/**
*  This function is called from a trigger on secRole on delete to update all operators
*  that were using that role.  It will remove the role from their list of roles, and
*  set their role to "Default" if they only had the one role.
*/
function removeRoleFromOperators( roleName )
{
	if ( roleName == null )
	{
		return;
	}
	var DEFAULT = "DEFAULT";
	var user = new SCFile("operator");
	var sql = "secRole=\"" + roleName +"\"";
	if ( user.doSelect( sql ) == RC_SUCCESS )
	{
		do
		{
			var position = funcs.index( roleName, user.secRole );
			if ( position > 0 )
			{
				user.secRole = funcs._delete( user.secRole, position, 1 );
			}
			
			var length = funcs.lng( user.secRole );
			if ( length == 0 )
			{
				user.secRole[0] = DEFAULT;
			}
			user.doUpdate();
		}
		while ( user.getNext() == RC_SUCCESS );
	}
}

/**
*  This function sets all security folders on a new secRights record
*/
function addAllSecFolders( right )
{
	var folder = new SCFile("FolderDef", SCFILE_READONLY);
	folder.setFields(["name"]);
	var sql = "true";
	
	if ( folder.doSelect( sql ) == RC_SUCCESS )
	{
		var i = 0;
		do
		{
			right.folders[i++] = folder.name;
		}
		while ( folder.getNext() == RC_SUCCESS );
	}
}



/**
*  This function is called from a trigger on secRole on delete to update all userrole
*  that were using that role.  It will remove the role from their list of roles, and
*  set their role to "default" if they only had the one role.
*/
function removeRoleFromUserrole( roleName )
{
	if ( roleName == null )
	{
		return;
	}
	var DEFAULT = "DEFAULT";
	var userRole = new SCFile("userrole");
	var sql = "secRole=\"" + roleName +"\"";
	if ( userRole.doSelect( sql ) == RC_SUCCESS )
	{
		do
		{
			var position = funcs.index( roleName, userRole.secRole );
			if ( position > 0 )
			{
				userRole.secRole = funcs._delete( userRole.secRole, position, 1 );
			}
			
			var length = funcs.lng( userRole.secRole );
			if ( length == 0 )
			{
				userRole.secRole[0] = DEFAULT;
			}
			userRole.doUpdate();
		}
		while ( userRole.getNext() == RC_SUCCESS );
	}
}


/**
*  This function is called from a trigger on secRole on delete to update all operators
*  that were using that role.  
*/
function renameRoleInOperators( roleName, newRoleName )
{
	if ( roleName == null )
	{
		return;
	}
	var user = new SCFile("operator");
	var sql = "secRole=\"" + roleName +"\"";
	if ( user.doSelect( sql ) == RC_SUCCESS )
	{
		do
		{
			var position = funcs.index( roleName, user.secRole );
			if ( position > 0 )
			{
				user.secRole[--position] = newRoleName;
			}
			user.doUpdate();
		}
		while ( user.getNext() == RC_SUCCESS );
	}
}


/**
*  This function is called from a trigger on secRole on delete to update all userrole 
*  records that were using that role. 
*/
function renameRoleInUserRoles( roleName, newRoleName )
{
	if ( roleName == null )
	{
		return;
	}
	
	var userRole = new SCFile("userrole");
	var sql = "secRole=\"" + roleName +"\"";
	if ( userRole.doSelect( sql ) == RC_SUCCESS )
	{
		do
		{
			var position = funcs.index( roleName, userRole.secRole );
			if ( position > 0 )
			{
				userRole.secRole[--position] = newRoleName;
			}
			userRole.doUpdate();
		}
		while ( userRole.getNext() == RC_SUCCESS );
	}
}


/**
*  This function is called from a trigger on secRole on delete to update all scaccess records
*  that were using that role. 
*/
function removeRoleFromMandanten( roleName )
{
	if ( roleName == null )
	{
		return;
	}
	
	var mandanten = new SCFile("scaccess");
	var sql = "security.id=\"" + roleName +"\"";
	if ( mandanten.doSelect( sql ) == RC_SUCCESS )
	{
		do
		{
			mandanten.doDelete();
		}
		while ( mandanten.getNext() == RC_SUCCESS );
	}
}

/**
*  This function is called from a trigger on secRole on delete to update all scFolderAccess records
*  that were using that role. 
*/
function removeRoleFromFolderAccess( roleName )
{
	if ( roleName == null )
	{
		return;
	}
	
	var folderAccess = new SCFile("scFolderAccess");
	var sql = "security.id=\"" + roleName +"\"";
	if ( folderAccess.doSelect( sql ) == RC_SUCCESS )
	{
		do
		{
			folderAccess.doDelete();
		}
		while ( folderAccess.getNext() == RC_SUCCESS );
	}
}



/***QCCR1E98515, start, dengxin, 932***/

function updateFolderAccess( right )
{
	if (right==null || right.role ==null || right.area==null){
		return;
	}
	var folderAccess = new SCFile("scFolderAccess");
	var sql = "security.id=\"" + right.role +"\"" +"and filename=\""+right.area+"\"";
	var query;
	
	if ( folderAccess.doSelect( sql ) == RC_SUCCESS ){

		var sameFolders=lib.ArrayUtil.sameArray(folderAccess.folders, right.folders);
		if (sameFolders){
			return;
		}
		else{
			folderAccess.folders=right.folders;
			query=getFolderQueryString(right.folders);		
			folderAccess.restricting_query=query;
			folderAccess.doUpdate();
		}
	}else{
	
		if (right.folders==null || right.folders.length()==0 ||right.folders.toArray()==null ||right.folders.toArray().length==0) {
			return ;
		}
		else{
		
			folderAccess.filename=right.area;
			folderAccess.security_id=right.role;
			folderAccess.folders=right.folders;
			query=getFolderQueryString(right.folders);
			folderAccess.restricting_query=query;
			folderAccess.doSave();
		}
	}
}

function getFolderQueryString(scFolders) {

  if (scFolders==null ) {
      return "";
  }
  var folderArray=scFolders.toArray();
  if (folderArray==null || folderArray.length==0) {
      return "";
  }

  var aFolderQuery = "folder isin { \"\"";
  var i;
  for (i=0, len=folderArray.length; i<len; i++)
  {
      aFolderQuery += ", \"" +folderArray[i]+"\"";
  }

  aFolderQuery += "}";
  
  aFolderQuery=aFolderQuery+" or folder=NULL";
  return aFolderQuery;
}

// this function is for customer to sync folders from secRights to scFolderAccess for the exist secRights data.
function syncSecRightsScFolderAccess()
{
	print("synchronizing folders...");
	try{
		var right = new SCFile("secRights");
		var sql = "true";
		
		if ( right.doSelect( sql ) == RC_SUCCESS )
		{
			do
			{	
				updateFolderAccess(right);	
	
			}
			while ( right.getNext() == RC_SUCCESS );
		}
		print("synchronize folders from File secRights to File scFloderAccess finished!");
	}
	catch ( exception )
	{
		print( exception.toString() );
	}
}

/***QCCR1E98515, end*/
