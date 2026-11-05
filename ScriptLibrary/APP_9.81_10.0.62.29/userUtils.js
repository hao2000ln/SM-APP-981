/************************************************
	
	This script contains utility functions for
	contacts, operators, users, people
	
	@Date: 		1/26/05
	@Author: 	Ayaz Usman
	
*************************************************/

/**
 *	Returns true if new User data is ok to create.
 */
function preCheckCreateUser(contactName, login) {
    var rOp = findOperatorByField("name", login, ["name"]);
    if (rOp != null) {
        return "operatorexists";
    }

    //contact.name is always all caps
    var rCon = findContactByField("contact.name", contactName.toUpperCase(), ["contact.name"]);
    if (rCon != null) {
        return "contactexists";
    }

    return "true";
}

function findContactByField(field, val, contactFields) {
    var fContact;
    if (contactFields) {
        fContact = new SCFile("contacts", SCFILE_READONLY);
        fContact.setFields(contactFields);
    } else {
        fContact = new SCFile("contacts");
    }

    var query = field + "=\"" + val + "\"";
    var rc = fContact.doSelect(query);
    if (rc == RC_SUCCESS) {
        return fContact;
    } else {
        return null;
    }
}


function countContactByField(field, val) {
    var fContact = new SCFile("contacts", SCFILE_READONLY);
    fContact.setFields("contact.name");
    var query = field + "=\"" + val + "\"";
    var count = fContact.doCount(query);
    return count;
}


function findOperatorByField(field, val, opFields) {
    var fOperator;
    if (opFields) {
        fOperator = new SCFile("operator", SCFILE_READONLY);
        fOperator.setFields(opFields);
    } else {
        fOperator = new SCFile("operator");
    }

    var query = field + "=\"" + val + "\"";

    var rc = fOperator.doSelect(query);
    if (rc == RC_SUCCESS) {
        return fOperator;
    } else {
        return null;
    }
}


/**
 *	This function returns true if a contact with contact.name val exists
 *	returns false if contact does not exist.
 */
function isValidContact(val) {
    var conValid = "true";

    if (val == null) {
        val = "";
    }

    var rc = findContactByField("contact.name", val, ["contact.name"]);

    if (rc == null) {
        conValid = "false";
    } else {
        conValid = "true";
    }

    return conValid;
}


/**
 *	This functions checkes to see if a contact is already linked to an operator.
 *	A contact should not be linked to more than 1 operator.
 */
function isContactLinkedToOperator(val, opname) {
    var contactLinked = "true";

    if (val == null) {
        return "false";
    }

    var contactName = val.toUpperCase();

    var fOperator = new SCFile("operator", SCFILE_READONLY);
    fOperator.setFields("name");

    var opname_escape = lib.StringUtil.escapeAllStr(opname);
    var contactName_escape = lib.StringUtil.escapeAllStr(contactName);
    
    var rc = fOperator.doSelect(new QueryCond("contact.name", EQ, contactName_escape).and(new QueryCond("name", NEQ, opname_escape)));

    if (rc == RC_SUCCESS) {
        contactLinked = "true";
    } else {
        contactLinked = "false";
    }

    return contactLinked;
}


/**
 *	This functions checkes to see if an operator is already linked to a contact.
 *	An operator should not be linked to more than 1 contact, unless Synchronize Contacts
 *	with Operators is turned off on info.company.g record
 */
function isOperatorLinkedToContact(operatorId, contactName) {
    //operatorId can be blank, i.e. contact doesnt require operator
    if (operatorId == null || operatorId == "") {
        return "false";
    }

    var operatorLinked = "false";
    if (vars.$doChecks) {
        var syncOn = vars.$G_system_info.syncOpCon;
    }

    if (syncOn) {
        var fContact = new SCFile("contacts", SCFILE_READONLY);
        fContact.setFields("contact.name");
        var rc = fContact.doSelect(new QueryCond("operator.id", EQ, operatorId).and(new QueryCond("contact.name", NEQ, contactName)));
        if (rc == RC_SUCCESS) {
            operatorLinked = "true";
        } else {
            operatorLinked = "false";
        }
    }

    return operatorLinked;
}


function createContactId(first, last) {
    var ret = last + ", " + first;
    return ret.toUpperCase();
}


/** 
 *	Returns current time as a string in milliseconds past midnight January 1, 1970
 */
function getUniqueId() {
    var theXMLDate = new XMLDate(new Date());
    var dt = theXMLDate.getDate();
    var ndt = dt.getTime();
    var sdt = ndt.toString();
    return sdt;
}


/**
 *	This function finds the desired operator and performs a deletion.
 */
function deleteOperatorByField(field, val) {
    var op = findOperatorByField(field, val);

    if (op != null) {

        var ret = op.doDelete();

        if (ret == RC_SUCCESS) {
            var opName = op.name;
            var scmessage = funcs.scmsg(116, "ScriptLibrary", [opName]);
            print(scmessage);
        }
    }
}


function printThis(x) {
    print(x);
}