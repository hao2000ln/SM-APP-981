/***
*				SM Upgrade 
*
* Check sqlsystemtables make sure do right remap works for SM.
* 
* Tod
* 2011-01-18
***/


/**
*    insert blob tables' name to table "upgsqlsys"
*	"upgsqlsys" remember old dbdict blob tables' status
**/
function saveDbdictTableStatus() {
	var dbdict = new SCFile("dbdict");
	var rc = dbdict.doSelect(true);
	var array = new Datum();
	
	while (rc == RC_SUCCESS) {
				
		if (dbdict.field[0].sql_field_options.sql_data_type != null) {
			array.push(dbdict.name);// table name
		}
		
		rc = dbdict.getNext();
	}
	var upgsqlsys = new SCFile("upgsqlsys");
	upgsqlsys.unique = "UPGRADE";
	upgsqlsys.system_tables = array;
	upgsqlsys.doInsert();
	
	lib.upgradeLog.scUpgrade(9084);
	lib.upgradeLog.scDetail(9084);
}


/**
*   compare SM930 sqlsystemtables records with old records, add different records to remap array
*   @remapArray  array for remap
**/
function compareSqlsystemtables() {
	// Log: Start comparing sqlsystemtables ...
	lib.upgradeLog.scUpgrade(1160);
	lib.upgradeLog.scDetail(1160);
	
	var oldtables = getOldSqlsys();
	var newtables = getNewSqlsys();
	var remapArray = new Datum();
	
	if (oldtables != null && oldtables != undefined 
			&& newtables != null && newtables != undefined) {
    	var i, remapItem;
    	var lng = oldtables.length;
    	for (i=0; i<lng; i++) {
    	//QCCR1E63576 - only remap the systemperform table, modified by LiuYongliang
			if (oldtables[i]=="systemperform"
					&& system.functions.index(oldtables[i], newtables) == 0) {
				remapItem = new Datum();
				remapItem.push(true); // Blob --> Noblob
				remapItem.push(oldtables[i]); 
				remapArray.push(remapItem);
			}
		}
		
		lng = newtables.length;
		for (i=0; i<lng; i++) {
			if (system.functions.index(newtables[i], oldtables) == 0 
					&& isExistInDbdict(newtables[i]) 
					//QCCR1E63576 - skip the code and ScriptLibrary table, modified by LiuYongliang					
					&& newtables[i] != "code" 
					&& newtables[i] != "ScriptLibrary"
					&& newtables[i].indexOf("upgrade") != 0) // filter upgrade tables
					 {
				remapItem = new Datum();
				remapItem.push(false); // Noblob --> Blob
				remapItem.push(newtables[i]);
				remapArray.push(remapItem);
			}
		}
    } 
    // Log: Finsh comparing sqlsystemtables ...
	lib.upgradeLog.scUpgrade(1161);
	lib.upgradeLog.scDetail(1161);
	return remapArray;
	
}

function getNewSqlsys() {
	var newsqlsys = new SCFile("sqlsystemtables");
	var rc = newsqlsys.doSelect(true);
	var array = [];
	while (rc == RC_SUCCESS) {
		array.push(newsqlsys.dbdict);
		rc = newsqlsys.getNext();
	}
	return array;
}

function getOldSqlsys() {
	var oldsqlsys = new SCFile("upgsqlsys");
	try {
		var rc = oldsqlsys.doSelect(true);//"dbdict=\"systemperform\""
	} catch (err) {
		// Log: Table [upgsqlsys] does not exist in current SM.
		lib.upgradeLog.scError(1163);
	}

	if (rc == RC_SUCCESS) {
		if (oldsqlsys.system_tables != null) {
		    return oldsqlsys.system_tables.toArray();
		}
	} 
	
	if (rc == RC_NO_MORE) {
		// Log: Table [upgsqlsys] has no record, please import records at first.
		lib.upgradeLog.scError(1164);
	}
	
	return null;
}

/**
*	print remap log
*   @param  remap array item
**/
function printRemapLog(remapItem) {
	if (remapItem == null || remapItem[0] == null) {
		return;
	}
	if (remapItem[0]) {
		// Log: Remap table: table [%S] from Blob to Noblob.
		lib.upgradeLog.scDetail(1166, [remapItem[1]]);
	} else {
		// Log: Remap table: table [%S] from Noblob to Blob.
		lib.upgradeLog.scDetail(1167, [remapItem[1]]);
	}
}

function isExistInDbdict(tableName) {
	var dbdict = new SCFile("dbdict");
	var rc = dbdict.doSelect("name=\"" + tableName + "\"");
	return rc == RC_SUCCESS ? true : false;
}
