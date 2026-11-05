/**
* @fileoverview  Additional logic for the Security Model to handle the Knowledge profiles with 
*                the same logic.  Knowledge has Category based security rather than Role Based,
*                So the profile actually changes between documents.
* @author Pete Budic
*/

/**
*  This function takes a security token and returns the value from the same named field
*  in the current Knowledge Document profile record.
*
*  @param {String} token - The name of the attribute we want the value of
*/
function getTokenValue( token )
{
	var operatorName = system.functions.operator();
	
	if (system.functions.index("SysAdmin", vars.$lo_ucapex) > 0 ||
		system.functions.index("KMAdmin", vars.$lo_ucapex) > 0 ||
		operatorName=="scheduler" || operatorName=="external" || operatorName=="KMUpdate" ||
		// default KM profile has no "contribute knowledge" permission, use admin profile for "draft" document
		vars.$L_file.status == "draft" ||
		system.functions.filename(vars.$L_file) != "kmdocument"){
		return adminValue(token);
	} else {
		return docProfileValue(token);
	}
}

function docProfileValue(token)
{
	var file = vars.$L_file;
	var docId = file["id"];
	
	if (vars.$currkmdoc_id == null) {
		
		vars.$currkmdoc_id = docId;
		vars.$currkmdoc_profile = new SCFile("kmprofile", SCFILE_READONLY);
		updateKMDocProfile(vars.$currkmdoc_profile);
	} else {
		
		if (vars.$currkmdoc_id == docId) {
			
		} else {
			
			vars.$currkmdoc_id = docId;
			updateKMDocProfile(vars.$currkmdoc_profile);
		}
	}
	
	var profile = vars.$currkmdoc_profile;
	
	
	var result = profile[token];
	
	return result;
}

function updateKMDocProfile(profile)
{
	
	var file = vars.$L_file;
	var fileCats = new Datum();
	fileCats.setType(8);
	fileCats = file["categories"];
	var iFileCats = system.functions.lng(system.functions.denull(fileCats));
	if (iFileCats == 0) {	// a new KM Doc
		system.library.KMSecurity.initProfile(profile, false);
		var kmprofile = new SCFile("kmprofile", SCFILE_READONLY);
		// apply default KM profile
		if (kmprofile.doSelect("id = \"KMP001\"") == RC_SUCCESS) {
			system.library.KMSecurity.updateProfile(profile, kmprofile);
		}
		return;
	}
	var realFileCats = new Array();
	for (var i = 0; i < fileCats.length(); ++i) {
		var idx = fileCats[i].indexOf(":");
		if (idx >= 0) {
			var hierCats = fileCats[i].split(":");
			for (var j = 0; j < hierCats.length; ++j)
				realFileCats = system.functions.insert(realFileCats, 0, 1, hierCats[j]);
		} else {
			realFileCats = system.functions.insert(realFileCats, 0, 1, fileCats[i]);
		}
	}
	
	var docGroups = new Array();
	var docProfiles = new Array();
	docGroups = system.functions.insert(docGroups, 0, 1, "");
	docProfiles = system.functions.insert(docProfiles, 0, 1, "");
	
	var catFile = new SCFile("kmcategory", SCFILE_READONLY);
	catFile.setFields("permission");
	var sql = "id = \"" + realFileCats[0] + "\"";
	for (var i = 1; i < realFileCats.length(); ++i)
		sql += " or id = \"" + realFileCats[i] + "\"";
	
	if (catFile.doSelect(sql) == RC_SUCCESS) {
		var rc = catFile.getFirst();
		while (rc == RC_SUCCESS) {
			var catFilePermissions = catFile.permission;
			for (var j = 0; j < catFilePermissions.length(); ++j) {
				docGroups = system.functions.insert(docGroups, 0, 1, catFilePermissions[j].kmgroup);
				docProfiles = system.functions.insert(docProfiles, 0, 1, catFilePermissions[j].kmprofile);
			}
			rc = catFile.getNext();
		}
	}
	
	
	
	var oper = vars.$lo_operator;
	var operGroups = new Datum();
	operGroups.setType(8);
	operGroups = oper["kmgroup"];
	// add the Default Knowledge View Group
	
	
	var interProfs = new Array();
	// add the default KM profile
	interProfs = system.functions.insert(interProfs, 0, 1, "KMP001");
	for (var i = 0; i < docGroups.length(); ++i) {
		if (system.functions.index(docGroups[i], operGroups) > 0) {
			interProfs = system.functions.insert(interProfs, 0, 1, docProfiles[i]);
		}
	}
	
	system.library.KMSecurity.initProfile(profile, false);
	var kmprofile = new SCFile("kmprofile", SCFILE_READONLY);
	var sql = "id = \"" + interProfs[0] + "\"";
	for (var i = 1; i < interProfs.length(); ++i)
		sql += " or id = \"" + interProfs[i] + "\"";
	
	if (kmprofile.doSelect(sql) == RC_SUCCESS) {
		var rc = kmprofile.getFirst();
		while (rc == RC_SUCCESS) {
			system.library.KMSecurity.updateProfile(profile, kmprofile);
			
			
			rc = kmprofile.getNext();
		}
	}
}

function adminValue(token)
{
	var profile = vars.$G_km_environment;
	if ( profile == null || profile == undefined )
	{
		return false;
	}
	
	var result;
	try
	{
		result = profile[token];
	}
	catch (e)
	{
		result = false;
	}
	if ( result == null || result == undefined )
		return "";
	return	result;
}
