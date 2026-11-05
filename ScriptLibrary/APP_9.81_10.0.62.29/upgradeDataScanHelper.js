/*
	QCRQ1E53294
	
	Script Lib for Bad data scan.
	@author Tian, Shao-Qin
*/

/**
* check if the table exist
*/
function isDbdictExist(dbdict) {
	var record = new SCFile("dbdict");
	var ret = record.doSelect("name=\"" + dbdict + "\"");
	if (ret == RC_SUCCESS)
		return true;
	
	return false;
}

/*
* list containing tables which is excluded in the scan list
*/
var exclude_list = ["dbdict"];

/*
* check if the table is in the exclude list
*/
function isDbdictExcluded(dbdict) {
	for (var i=0; i < exclude_list.length; i++) {
		if (exclude_list[i] == dbdict)
			return true;
	}
	
	return false;
}
