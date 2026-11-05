/** use this security script to simple use PD security for common table, this condition can be used in formatctrl*/
function hasViewRight() {
	return lib.security.getRights("Common Configuration", "view") == "true";

}

function hasNewRight() {
	return lib.security.getRights("Common Configuration", "new") == "true";
			
}

function hasAdminRight() {
	return lib.security.getRights("Common Configuration", "admin") == "true";
			
}

function hasExpertRight() {
	return lib.security.getRights("Common Configuration", "expert") == "true";
			
}


function hasUpdateRight() {
	return lib.security.getRights("Common Configuration", "update") !=null && lib.security.getRights("Common Configuration", "update") != "never";
	

}

function hasDeleteRight() {
	return lib.security.getRights("Common Configuration", "delete") !=null &&  lib.security.getRights("Common Configuration", "delete") != "never";
}