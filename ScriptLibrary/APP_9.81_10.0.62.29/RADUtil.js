var $ = lib.c.$;


function checkRadExist(name) {
    var appl=new SCFile("enclapplication", SCFILE_READONLY);
    appl.setFields(["application.name"]);
    var rc=appl.doSelect("application.name=\""+name+"\"");
    
    return (rc==RC_SUCCESS);
}


/**
 * Update RAD release version
 *
 * @param {String} version
 * @param {Date} date
 */
function updateReleaseVersion(version, date) {
	var query = "object.type=\"Application Cluster\" and result isin {\"Added\",\"Updated\"}";
	
	$("patchrelresults", SCFILE_READONLY).select(query).iterate(function(result) {
		var name = result.object_name;
		updateEnclapplication(name, version, date);
	});	
}


/**
 * Update enclapplication release version
 *
 * @param {String} name
 * @param {String} version
 * @param {Date} date
 */
function updateEnclapplication(name, version, date) {
	var encl = $("enclapplication").select("application.name=\"" + name + "\"").uniqueResult();
	if (encl != null) {
		// update release level and release date
		encl.current_release_level = version;
		encl.current_release_date = date;			
		encl.doUpdate();
	}
}


function compileRad(name) {
    var names = ["name","cond.input","boolean1"];
    var values = [name, false, false];
    var rc = callrad("compile", names, values);
    
    return rc;
}


/**
 * Get the type of the current RAD thread
 *
 * @return list, detail, listdetail, messagebox, or unknown if the getThreadType() function is not supported in RTE
 */
function getRadThreadType() {
    var threadtype = "unknown";
    if (typeof getThreadType === "function") {
        threadtype = getThreadType();
    }

    return threadtype;
}