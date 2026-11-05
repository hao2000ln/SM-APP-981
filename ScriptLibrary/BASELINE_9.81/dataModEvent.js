/** @fileoverview dataModEvent - contains functions used by the Data Modification Events
*   @author Pete Budic
*/

/**  This function is called to populate an incident that is to be opened by the DDM
*
*	@param {Record} change - The Change record
*	@param {String} action - The action to be performed
*	@return Return Code
*   @type String
*/

function processChangeAction( change, action )
{
	var VERIFICATION = "Discovery Verification";
	var BACKOUT = "Discovery Back Out"
	var IMPLEMENTATION = "Discovery Implementation";
	
	if ( change.category != "Unplanned Change")
	{
		IMPLEMENTATION = "Change Implementation";
		VERIFICATION = "Evaluation & Change Closure";
		BACKOUT = "Change Implementation";
		
	}
	
	var retCode = "normal";
	var doAction = "none";
	
	if ( action == "validate" )
	{
		if ( change.current_phase == VERIFICATION )
		{
			if ( change.category == "Unplanned Change" )
			{
				doAction = "close";
			}
		}
	}
	if ( action == "failValidation" )
	{
		if ( change.current_phase == VERIFICATION )
		{
			if ( change.category == "Unplanned Change" )
			{
				change.current_phase = IMPLEMENTATION;
			}
			else
			{
				change.current_phase = BACKOUT;
			
				if ( change.backout_method[0] == null || change.backout_method[0] == "" )
				{
					change.backout_method[0] = "Failed verification";
				}
			}
			doAction = "save";
		}
	}
	if ( action == "implement" )
	{
		if ( change.current_phase == IMPLEMENTATION )
		{
			change.current_phase = VERIFICATION;

			doAction = "save"
		}
	}
	if ( action == "cancel" )
	{
	
	}

	retCode = doAction
	
	return retCode;
}

function getActiveDmeFields( id, tableName )
{
	var fields = new Array();
	
	var dme = new SCFile( "dataModEvent" );
	var sql = "tableName=\"" + tableName + "\" and recordId=\"" + id + "\" and active=true";
	
	if ( dme.doSelect( sql ) == RC_SUCCESS )
	{
		do
		{
			fields.push( dme.fieldName );
		}
		while ( dme.getNext() == RC_SUCCESS );
	}
	
	return fields;
}

function changeDmeStatus( id, tableName, oldStatus, newStatus, active )
{
	var dme = new SCFile( "dataModEvent" );
	var sql = "linkedTableName=\"" + tableName + "\" and linkedRecordId=\"" + id + "\" and status=\"" + oldStatus +"\"";
	
	if ( active == true )
		sql = "linkedTableName=\"" + tableName + "\" and linkedRecordId=\"" + id + "\" and active=true and status=\"" + oldStatus +"\"";
	else if ( active == false )
		sql = "linkedTableName=\"" + tableName + "\" and linkedRecordId=\"" + id + "\" and active=false and status=\"" + oldStatus +"\"";

	if ( dme.doSelect( sql ) == RC_SUCCESS )
	{
		do
		{
			dme.status = newStatus;
			dme.active = true;
			if ( newStatus == "cancelled" )
			{
				dme.active = false;
			}
			dme.doUpdate();
		}
		while ( dme.getNext() == RC_SUCCESS );
	}
	
		//update dataModEventRelItem at the same time
		var dme = new SCFile( "joinDataModEventRelItem" );
		var sql = "linkedTableName=\"" + tableName + "\" and linkedRecordId=\"" + id + "\" and item.status=\"" + oldStatus +"\"";
		
		if ( active == true )
			sql = "linkedTableName=\"" + tableName + "\" and linkedRecordId=\"" + id + "\" and item.active=true and item.status=\"" + oldStatus +"\"";
		else if ( active == false )
			sql = "linkedTableName=\"" + tableName + "\" and linkedRecordId=\"" + id + "\" and item.active=false and item.status=\"" + oldStatus +"\"";
	
		if ( dme.doSelect( sql ) == RC_SUCCESS )
		{
			do
			{
				dme.item_status = newStatus;
				dme.item_active = true;
				if ( newStatus == "cancelled" )
				{
					dme.item_active = false;
				}
				dme.doUpdate();
			}
			while ( dme.getNext() == RC_SUCCESS );
		}
	
}

function setApproved( id, tableName )
{
	changeDmeStatus( id, tableName, "proposed", "planned", true);

}

function setCancelled( id, tableName )
{
	changeDmeStatus( id, tableName, "proposed", "cancelled", true);
	changeDmeStatus( id, tableName, "planned", "cancelled", true);

}

//Get the tableNames
function getTableNames(number)
{
    var tableNames=[];
    var sql="select distinct tableName from dataModEvent where linkedRecordId=\"" + number + "\"";

    lib.c.$("dataModEvent", SCFILE_READONLY).setFields(["tableName"]).select(sql).iterate(function(record){

        tableNames.push(record.tableName);
    })
    return tableNames;
}

