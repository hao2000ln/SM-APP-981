/**
	This function either returns the total results and the action name for a specific Definition
	as three arrays of values (contextAction name [vars.$G_context_name], the localized version of the 
	name [vars.$G_context_local_name], record count [vars.$G_context_totals] and the table they are
	based on as [vars.$G_table]) or 1 or 0 only to indicate respectively there are or are no records
	found related to the relevant context. The latter can be achieved by setting the checkFlag to true.
**/
function GetResult(fFile, table, field, state, profile, checkFlag)
{
	var fcontextDefinition = SelectContext(table, field, state, profile);	
	var arrayTable = [];
	var arrayNames = [];
	var arrayLocalNames = [];
	var arrayTotals = [];
	var iActiveActions = 0;
	
	var i;
	for (i in fcontextDefinition.actions)
	{
		if (fcontextDefinition.actions[i].actionCondition)
		{
			var actionName = fcontextDefinition.actions[i].actionName;
			fRecords = RunAction(fFile, actionName);
			
			if (fRecords != false && checkFlag != true)
			{
				var iTotal = GenerateCount(fRecords);
				arrayTable.push(funcs.filename(fRecords));
				arrayNames.push(actionName);
				arrayLocalNames.push(funcs.scmsg(actionName, "contextAction"));
				arrayTotals.push(iTotal);
				iActiveActions+=iTotal;
			}
			else if (fRecords != false && checkFlag == true)
			{
				iActiveActions = 1;
				i = fcontextDefinition.actions.length();
			}
		}
	}
	vars.$G_context_table = arrayTable;
	vars.$G_context_names = arrayNames;
	vars.$G_context_local_names = arrayLocalNames;
	vars.$G_context_totals = arrayTotals;
	return iActiveActions;
}

/**
	This function sets the "context indicator" value for all fields for a specific table.
	The function itself does not return anything, but all $<fieldname>.on variables will
	be set according to the found result.
**/

function ResetForFields(fFile, state, profile)
{
	var tablename = funcs.filename(fFile);
	var recordList = getRecordFields(tablename);
	var contextDef = getContextDef(tablename);	

    var i;	
	for (i=0, len=recordList.length; i<len; i++)
	{
		var field = recordList[i];
		if(field==null) {
		    continue;
		}
		
		var jfield = field.replace(/\./g, '_');

		var result = hasContextDef(contextDef, tablename, field, state, profile);
		if (result )
		{
			var cString = "record." + jfield;
			var cString1 = "vars.$" + jfield + "_on=\"false\"";
			var cString2 = "vars.$" + jfield + "_on=\"true\"";
			
			vars["$" + jfield + "_on"] = false;
			if (record[jfield] != null)
			{
				iResult = GetResultFromCache(contextDef, fFile, tablename, field, state, profile);
				
				if (iResult) {
					vars["$" + jfield + "_on"] = true;
				}
			}
		}
	}
}

/**
	This function selects the correct contextDefinition record based on the provided variables
	It tries to retrieve the most appropriate match based on the following selection scheme:
	table, field, state, profile
	table, field, profile
	table, field, state
	table, field
	
	Output is either a contextDefintion record or "false".
**/
function SelectContext(table, field, state, profile)
{
	if(table == null | field == null) {
		return false;
	}
	else
	{
		var fContextDefinition = new SCFile("contextDefinition");
		
		var sql = "table=\"" + table + "\" and field=\"" + field + "\" and state=\"" + state + "\" and profile=\"" + profile + "\"";
		var rc = fContextDefinition.doSelect( sql );
		if (rc ==RC_SUCCESS) {
			return fContextDefinition;
		}	
		else
		{
			sql = "table=\"" + table + "\" and field=\"" + field + "\" and null(state) and profile=\"" + profile + "\"";
			rc = fContextDefinition.doSelect( sql );
			if (rc ==RC_SUCCESS) {
				return fContextDefinition;
			}
			else
			{
				sql = "table=\"" + table + "\" and field=\"" + field + "\" and state=\"" + state + "\" and null(profile)";
				rc = fContextDefinition.doSelect( sql );
				if (rc ==RC_SUCCESS) {
					return fContextDefinition;
				}
				else
				{
					sql = "table=\"" + table + "\" and field=\"" + field + "\" and null(state) and null(profile)";
					rc = fContextDefinition.doSelect( sql );
					if (rc ==RC_SUCCESS) {
						return fContextDefinition;
					}
					else {
						return false;
					}
				}
			}
		}
	}
}


/**
	This function runs the code that is in the contextAction record and returns 
	the record set it generates
**/
function RunAction(fFile, ContextActionName)
{
	var fContextAction = new SCFile("contextAction", SCFILE_READONLY);
	var sql = "name=\""+ContextActionName+"\"";
	
	rc = fContextAction.doSelect( sql );
	
	if (rc == RC_SUCCESS)
	{
		var code = fContextAction.code;
		eval(code);
		
		if (rc == RC_SUCCESS)
		{
			return fRecords;
		}
		else {
			return false;
		}
	}
}

/**
	This function counts and returns the total records for a given File Object
**/
function GenerateCount(fFile)
{
	return lib.rtecallUtil.countFile(fFile);
}

/**
	This function is based on template.getTemplateFields, and is used to generate
	an overview of all active fields in a dbdict, assisting the generation of context
	for fields already filled in and for "resetting" when a new record in a record
	list is selected.
	
	Active Fields are fields not System or Deprecated, and available, as defined in
	the datadict for that table.
*/

/** This function gets and returns all allowed fields for a table.
*
*	@param {table} 		table	    - a table name
*/
function getRecordFields(tablename)
{
	var table = new SCFile( "dbdict" );
	var datadict = new SCFile( "datadict" );
	var joinfile = new SCFile( "joindefs", SCFILE_READONLY );
	joinfile.setFields(["join.tables"]);
	var object = new SCFile( "Object", SCFILE_READONLY );
	var fieldList = [];
    var i;
    			
	var sql = "name=\"" + tablename + "\"";
	var joinsql = "join.name=\"" + tablename + "\"";
	var hasDatadict = datadict.doSelect( sql );
	var isJoin = joinfile.doSelect( joinsql );
	
	if ( isJoin == RC_SUCCESS )
	{
		var num = joinfile.join_tables.length();

		for (i = 0; i < num; i++)
		{
			if ( i == 0 ) {
				sql = "name=\"" + joinfile.join_tables[i].table_name + "\"";
			}
			else {
				sql = sql + " or name=\"" + joinfile.join_tables[i].table_name + "\"";
			}
		}
	}
	
	if ( table.doSelect( sql ) == RC_SUCCESS )
	{
		var pos = 0;
		var typeStructure = lib.DataTypeConst.typeStructure();
		var typeArray = lib.DataTypeConst.typeArray();
		
		do
		{
			var max = table.field.length();
			var singleSql = "name=\"" + table.name + "\"";
			var level = 1;
			var last = null;
			var current = null;
			
			if ( datadict.doSelect(singleSql) == RC_SUCCESS )
			{
				hasCaption = true;
			}
		
			for (i = 0; i < max; i++)
			{
				current = "pos:" + table.field[i].level + ":" + table.field[i].index;
				if ( current != last )
				{
					if ( table.field[i].type != typeStructure )
					{
						if ( table.field[i].level <= level)
						{
							if ( table.field[i].type != typeArray )
							{
								if ( getDatadictInfo(table.field[i].name, pos, datadict) )
								{
									fieldList[pos] = table.field[i].name;
									pos++;	
								}
							}
							else
							{
								level = table.field[i].level;
								i++;
								if ( table.field[i].type != typeStructure )
								{
									if ( getDatadictInfo(table.field[i].name, pos, datadict) )
									{
										fieldList[pos] = table.field[i].name;
										pos++;
									}
								}
							}
						}
					}
					else
					{
						level = table.field[i].level + 1;
					}
				}
				last = current;
			}
		}
		while ( table.getNext() == RC_SUCCESS );
	}
		
	sql = "file.name=\"" + tablename + "\"";
	var hasObject = false;

	if ( object.doSelect( sql ) == RC_SUCCESS )
	{
		hasObject = true;
		var length = object.watch_variables.length();
		for (i = 0; i < length; i++)
		{
			fieldList[pos] = object.watch_variables[i];
			pos++;
		}
	}
	
	return fieldList;
}

/**
	This function is based on template.getDatadictInfo and validates a field
	is in use.
**/
function getDatadictInfo( name, position, datadict)
{
	var x = funcs.index( name, datadict.fields ) - 1;
	
	if ( x !=-1 && x != null )
	{
		if ( datadict.sysFieldType[x] == 1 || datadict.sysFieldType[x] == 4  || datadict.avail[x] == false)
		{
			return false;
		}
	}
	return true;
}

/**
	This function select the value of a specified field of a specified record in a specified table.

*	@param {name} 			name	    - the field value of the record to be retrieved
*	@param {tablename} 		table	    - a table name
*	@param {field} 			field	    - the field name that is to contain the {name} value
*	@param {returnfield}	field	    - the field containing the value that the function returns
**/
function GetValue(name, tablename, field, returnfield)
{
	var fRecord = new SCFile(tablename, SCFILE_READONLY);
	fRecord.setFields([returnfield]);
	var sql = field + "= \"" + name + "\"";
	fRecord.doSelect( sql );
	return fRecord[returnfield];
}


/**
	This function select all relevant Assignment groups for a given set of CI's.

*	@param {cis} 			name	    - an array of CI names
**/
function GetAllAssignmentGroups(cis)
{
	var BATCH_SIZE = 1000;
	var assignmentGroups = [];
	var tempCIList = [];
	for (i = 0 ; i < cis.length() ; i++ )
	{
		tempCIList.push(cis[i]);
		
		// handle the cis query by batch so as to ensure it will not exceed the 64k query limit. 
        if(tempCIList.length % BATCH_SIZE ==0 ){

             _processAssignmentsGroupsByBatch(tempCIList, assignmentGroups);

              tempCIList = [];
         }
	}
	
	//Retrive the remaining assignmentgroups that is less than the BATCH_SIZE
     if(tempCIList.length >0){
        _processAssignmentsGroupsByBatch(tempCIList, assignmentGroups);
     }
    
	return lib.ArrayUtil.removeDuplicateEmptyElement(assignmentGroups);
}


/** This purpose of this function is to retrieve the assignement for CI in batch so as to improve performance
*
*     @param {Array} cilist - ci list that need to retrive the logical name
*     @param {Array} returnlist - the logical name list that will be returned
*     @returns
*   @type Void
*/
function _processAssignmentsGroupsByBatch(ciList,assignmentGroups){

    //start to compose the sql to retrive logical name list
    var sql = "logical.name isin {"   ;
    var i;
    for (i =  0 ; i < ciList.length ; i++)
    { 
        if (i > 0) {
            sql += ",";
        }
        sql = sql + "\"" + ciList[i ] + "\""   ;                        
    }
    sql += "}";

    var fields = ['assignment','support.groups'];
    var fFile = lib.ScAPI_RAD._select("device",sql,fields);
  
    if ( fFile != null ){

         do{
         
          if(fFile.assignment != null){	
          	assignmentGroups.push(fFile.assignment);
          }
          
          if (fFile.support_groups != null ){
            var j, length = fFile.support_groups.length();
			for (j = 0; j < length; j++)
			{
				assignmentGroups.push(fFile.support_groups[j]);
			}
		  }
         }while(fFile.getNext()==RC_SUCCESS);
     }

}


/**
	This function removes all blanks and duplicates from an array, and sorts it.
**/
function CleanupArray(a) {
	a.sort();
	var t = null;
	var i;
	for (i = 0; i < a.length; i++) {
		if (a[i] == null || a[i] == t) {
			a.splice(i,1);
			i -= 1;
		}
		t = a[i];
	}
	return a;
}

function getContextDef(table)
{
	var fContextDefinition = new SCFile("contextDefinition", SCFILE_READONLY);
	var sql = "table=\"" + table + "\"";
	var rc = fContextDefinition.doSelect( sql );
	var contextArray = [];
	while(rc == RC_SUCCESS)  
	{
		var aCt = {};
		aCt.table = fContextDefinition.table;
		aCt.field = fContextDefinition.field;
		aCt.state = fContextDefinition.state;
		aCt.profile = fContextDefinition.profile;
		contextArray.push(aCt);
		rc = fContextDefinition.getNext();		
	}
	return contextArray;
}

function hasContextDef(contextDef, tablename, field, state, profile)
{
    var i;
	for(i=0;i<contextDef.length;++i)
	{
		if(contextDef[i].field == field) {
		    return true;
		}			
	}	
	return false;
}

function getBestMatchContext(contextArray, tablename, field, state, profile)
{

	var fContextDefinition = new SCFile("contextDefinition");
	var sql=getBestMatch(contextArray, tablename, field, state, profile);
	var rc = fContextDefinition.doSelect( sql );
	if (rc ==RC_SUCCESS) {
		return fContextDefinition;
	}
}

function getBestMatch(contextDef, tablename, field, state, profile)
{
	var fieldMatch;
	var stateMatch;
	var profileMatch;	
	var allMatch;
	
	var i;
	for(i=0;i<contextDef.length;++i)
	{
		if(contextDef[i].field == field)
		{
		 	fieldMatch= contextDef[i];
		 	if(contextDef[i].profile!=undefined && contextDef[i].state !=undefined && contextDef[i].profile == profile && contextDef[i].state == state)
		 	{
		 		allMatch= contextDef[i];
		 		break;		 		
		 	}
		 	else {
		 	  if(contextDef[i].profile!=undefined && contextDef[i].profile == profile)
		 	  {
		 	  	profileMatch= contextDef[i];		 		
		 	  }
		 	  if(contextDef[i].state!=undefined && contextDef[i].state == state)
		 	  {
		 	  	stateMatch= contextDef[i];		 		
		 	  }
		 	}  
		 	  
		 }		
				
	}	
	
	if(allMatch != undefined) {
		return "table=\"" + tablename + "\" and field=\"" + field + "\" and state=\"" + state + "\" and profile=\"" + profile + "\"";
	}
	else if (profileMatch != undefined) {
		return "table=\"" + tablename + "\" and field=\"" + field + "\" and null(state) and profile=\"" + profile + "\"";
	}
	else if (stateMatch != undefined) {
		return "table=\"" + tablename + "\" and field=\"" + field + "\" and state=\"" + state + "\" and null(profile)";
	}
	else if (fieldMatch != undefined) {
		return "table=\"" + tablename + "\" and field=\"" + field + "\" and null(state) and null(profile)";
	}
	else {
	    return "false";
	}
}

function GetResultFromCache(result, fFile, table, field, state, profile)
{
	var fcontextDefinition = getBestMatchContext(result, table, field, state, profile);
	
	var i;
	for (i in fcontextDefinition.actions)
	{
		if (fcontextDefinition.actions[i].actionCondition)
		{
			var actionName = fcontextDefinition.actions[i].actionName;
			fRecords = RunAction(fFile, actionName);
				
			if (fRecords) {
				return true;
			}				
		}
	}

	return false;
}
