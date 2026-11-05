/***
*				SM Upgrade 
*
* this script for update previous SM OOB data
* 
* Tod
* 2011-03-31
***/


/***
*	QCCR1E62339  delete 4 oob records for performance reason
*
*	table=uimcompdefinitions
*	record---> id=1011
*	record---> id=1014
*	
*	table=uimcompdefcatscdefs
*	record---> definition.id=1011
*	record---> definition.id=1014
***/
function cleanMySMdata() {
	var uiini = getSCFile("uimcompdefinitions");
	if (uiini != null) {
		removeQuery(uiini, 1011);
		removeQuery(uiini, 1014);
	}
	
	var uicat = getSCFile("uimcompdefcatscdefs");	
	if (uicat != null) {
		removeQuery(uicat, 1011);
		removeQuery(uicat, 1014);
	}
}


function getSCFile(tableName) {
	var dbdict = new SCFile("dbdict");
	var rc = dbdict.doSelect("name=\"" + tableName + "\"");
	if (rc == RC_SUCCESS) {
		return new SCFile(tableName)
	} else {
	// table does not exist
		return null;
	}
}

function removeQuery(file, id) {
	var rc = file.doSelect("id=\"" + id + "\"");
	if (rc == RC_SUCCESS) {
		file.doRemove();
		// Log: Delete record in table %S, propery values [%S]
		lib.upgradeLog.scDetail(1158, [system.functions.str(file)]);
	}
}


function deleteIndexGL() {

   var glNm = "inboxes";
   var gl = new SCFile("globallists");
   var rc = gl.doSelect("name=\""+ glNm + "\"");
   if (rc == RC_SUCCESS) {
      rc = gl.doDelete();
      lib.upgradeLog.scUpgrade(998, [glNm]); 
      lib.upgradeLog.scDetail(998, [glNm]); 
   } 

}

/**
copied from FixInboxQuery.
QCCR1E63927
**/
function fixInboxQuery(){
	var inboxFile = new SCFile("inbox");
	var inboxQuery = "short.query ~= query";
	if (inboxFile.doSelect(inboxQuery) == RC_SUCCESS) {
		do {
			inboxFile.short_query = inboxFile.query;
			inboxFile.doUpdate();
		} while (inboxFile.getNext() == RC_SUCCESS);
	}
}


/***
*    Fix QCCR1E65212
*
*    Add value for id in notification table
***/
function addValueForNotification() {

      var notification = new SCFile("notification");
      var rc = notification.doSelect("null(id)");
      
      lib.upgradeLog.upgrade("Setting default id for notification...");
      lib.upgradeLog.detail("Setting default id for notification...");
      
      while (rc == RC_SUCCESS) {
            notification.id = getUniqueIdByName(notification.name);
            lib.upgradeLog.detail("Setting id for notification:" + notification.name +" as:" + notification.id);
            notification.doUpdate();
            rc = notification.getNext();            
      }
      
      lib.upgradeLog.upgrade("Finished setting default id for notification.");
      lib.upgradeLog.detail("Finished setting default id for notification.");
}

// generate the unique id as SM9.30 format
function getUniqueIdByName(name) {

      var index = 1;
      var id = name + "_"+ index.toString();
      var notification = new SCFile("notification");
      var rc = notification.doSelect("id=\"" + id  + "\"");
      
      while (rc == RC_SUCCESS) {
            id = name + "_"+ (++index).toString();
            rc = notification.doSelect("id=\"" + id  + "\"");
      }
      
      return id;
}
