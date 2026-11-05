var _ = lib.Underscore.require();
var $ = lib.c.$;

// map module to area
var areaMap = {
	'incident': 'Incident',
	'interaction': 'Service Desk',
	'change': 'Change'
};

// map object table to area
// lazy set values
var objectAreaMap = {};

/**
*   check if the user has right to add/update ticket
*
*   @param {operator} - operator name
*	@param {object} - interaction or incident
*	@param {right} - right like new or view
*	@return - true/false
*   @type - Boolean
**/
function checkRight(operator, object, right) {
	var area = objectAreaMap[object];
	if (area == null) {
	    area = lib.security.getArea(object);
	    if (area == null) {
	        area = areaMap[object];
	        if (area == null) {
	            return false;
	        }
	    }
	}
	objectAreaMap[object] = area;
	
	var operatorInfo = $("operator", SCFILE_READONLY).setFields(['secRole']).select('name="' + operator + '"').uniqueResult();
	if (operatorInfo != null) {
		// check operator right
		return checkModuleRight(lib.ArrayUtil.toJsArray(operatorInfo['secRole']), area, right);
	}
	return false;
}

/**
 *  Check if the operator has the update right for the file ticket
 */
function hasUpdateRight(operator, file, object) {
    return hasRight(operator, file, "update", object);
}

/**
 *  Check if the operator has the new right for the file ticket
 */
function hasNewRight(operator, file, object) {
    return hasRight(operator, file, "new", object);
}

/**
 *  Check if the operator has the right for the file ticket
 */
function hasRight(operator, file, right, object) {
    return lib.SecurityIntegration.hasRight(operator, file, right, objectAreaMap[object]);
}

/**
*   get contact name by email
*
*   @param {email} - email address of email
*	@return - contact name
*   @type - Object - contact info
**/
function getContactInfoByEmail(email) {
	var fContacts = new SCFile("contacts", SCFILE_READONLY);
	fContacts.setFields(['contact.name', 'language', 'company', 'operator.id']);
	var query="tolower(email)=\""+email.toLowerCase()+"\"";
	var rc = fContacts.doSelect(query);	
	if (rc == RC_SUCCESS) {
		return {
			"name": fContacts['contact.name'],
			"language": fContacts['language'],
			"email": email,
			'company': fContacts['company'],
			'operator.id': fContacts['operator.id']
		};
	}
	return null;
}
 

/**
*   get operator info by contact name
*
*   @param {contactName} - contact name
*	@return - contact name
*   @type - Object - operator info
**/
function getOperatorByContactName(contactName) {
	var operator=new SCFile("operator", SCFILE_READONLY);
    operator.setFields(['name', 'secRole']);
    var rc=operator.doSelect("contact.name=\""+contactName+"\"");
    
    if (rc == RC_SUCCESS) {
    	return {'name': operator['name'], 'secRoles': lib.ArrayUtil.toJsArray(operator['secRole'])};
    }
    
    return null;
}



/**
*   check module right
*
*   @param {secRoles} - sec roles
*   @param {area} - area like incident, interaction
*   @param {right} - right like new, view, update
*	@return - true/false
*   @type - Boolean
**/
function checkModuleRight(secRoles, area, right) {
	var secRight = new SCFile("secRights", SCFILE_READONLY);
	var ret = secRight.doSelect("area=\"" + area + "\" and role isin " + funcs.str(secRoles));
	while (ret == RC_SUCCESS) {
		if (secRight[right] == true 
		        || (right == "update" && secRight[right] != "never")) {
			return true;
		}
		ret = secRight.getNext();
	}
	return false;
}


/**
*   set Global permission for Service Desk
*
**/
function setGlobalPermission(environment) {
	environment["new"] = true;
	environment["update"] = "always";
	environment["close"] = true;
	environment["reopen"] = true;
	
	//lib.smis_CommonLib.setTableAccessUpdate("always");
	//lib.smis_CommonLib.setTableAccessClose(true);
}


/**
*   check if the operator is in current pending groups
*
**/
function checkApprovePermission(operator, approval, myGroups) {
	// first get current pending groups in approval
	var currentPendingGroups = lib.ArrayUtil.toJsArray(approval['current.pending.groups']);
	if (_.indexOf(currentPendingGroups, operator) != -1) {
		return true;
	} else if (myGroups['approver.of']) {
		// check if operator is in the groups
		var approverOf = lib.ArrayUtil.toJsArray(myGroups['approver.of']);
		if (_.intersection(currentPendingGroups, approverOf).length > 0) {
			return true;
		}
	}
	return false;
}


function isValidOperator(operator_name) {
	if ($("operator", SCFILE_READONLY).setFields(['name']).count('name="' + operator_name + '"') > 0) {
		return true;
	}
	return false;
}