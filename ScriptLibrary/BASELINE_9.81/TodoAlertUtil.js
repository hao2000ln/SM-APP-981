var $ = lib.c.$;
var arrayUtil = lib.ArrayUtil;

/**
*  This function is to check whether "Display records from previous days" setting in the operator level is valid or not
*  This function is to check whether "Maximum number of records in the list" setting in the operator level is valid or not
*	
*  @return {boolean}
*/
function isAlertNumberConfigValid(number, maximum) {
	if ((/^[1-9][0-9]*$/).test("" + number) && number > 0 && number <= maximum) {
		return true;
	}
	
	return false;
}


/**
*  This function is to refresh the to-do company list (to remove the invalid companies automatically)
*
*  @param  {obj} object of the operator record
*  @return {array} list of companies
*/
function cleanCompanyList(operator_obj) {
	var company_set = getMandantenCompanylist(operator_obj.security_group);
	var company_selected = operator_obj.todo_company;
	var company_valid = [];
	
	for (var i=0; i<arrayUtil.length(company_selected); i++) {
		if (arrayUtil.contains(company_set, company_selected[i])) {
			company_valid.push(company_selected[i]);
		}
	}
	return company_valid;
}


/**
*  This function is to refresh the to-do folder list (to remove the invalid folders automatically)
*
*  @param  {obj} object of the operator record
*  @return {array} list of folders
*/
function cleanFolderList(operator_obj) {
	var folder_set = getFolderList(operator_obj);
	var folder_selected = operator_obj.todo_folder;
	var folder_valid = [];
	
	for (var i=0; i<arrayUtil.length(folder_selected); i++) {
		if (arrayUtil.contains(folder_set, folder_selected[i])) {
			folder_valid.push(folder_selected[i]);
		}
	}
	return folder_valid;
}


/**
*  This function is to get the company list configured in security groups
*  
*  @param  {array} list of security groups
*  @return {array} list of companies
*/
function getMandantenCompanylist(security_groups) {
	var company_all = [];
	var company_list = [];
	
	// get the full set of companies
	$("company", SCFILE_READONLY).setFields(["company"]).selectAll().iterate(function(record) {
		company_all.push(record.company);
	});

	if (arrayUtil.isEmptyString(security_groups)) {
		return company_all;
	}

	// get companies by security group
	for (var i=0; i<arrayUtil.length(security_groups); i++) {
		var s_group = security_groups[i];
		
		if (s_group != "" && s_group != null) {
			var sql = "security.id=\"" + s_group + "\"";
		
			$("scsecuritygroup", SCFILE_READONLY).select(sql).iterate(function(record) {
				var company_include = record.include;
				var company_exclude = record.exclude;
			
				if (arrayUtil.isEmptyString(company_include)) {
					if (arrayUtil.isEmpty(company_list)) {
						company_list = company_all;
					}
					// remove the company if it's in the exclude list
					for (var eLen=0; eLen<company_exclude.length(); eLen++) {
						var ex_company = company_exclude[eLen];
					
						if (ex_company != "" && ex_company != null) {
							if (arrayUtil.contains(company_list, ex_company)) {
								company_list = arrayUtil.removeA(company_list, ex_company);
							}
						}
					}
				}
				else {
					// add the company if it's in the include list
					for (var iLen=0; iLen<company_include.length(); iLen++) {
						if (!arrayUtil.contains(company_list, company_include[iLen])) {
							company_list.push(company_include[iLen]);
						}
					}
				}
			});
		}
	}
	
	return company_list;
}


/**
*  This function is to get table name of target FolderRight record
*  
*  @param  {string} profile - file name of the profile
*  @param  {string} area - profile area
*  @return {string} table name of target FolderRight record
*/
function _getFolderTable(profile, area) {
	if (profile === "smenv") {
		return "incidents";
	}
	if (profile === "pmenv") {
		return "probsummary";
	}
	if (profile === "icmenv") {
		return "device";
	}
	if (profile === "rcenv") {
		return ["rootcause", "rootcausetask", "knownerror", "knownerrortask"];
	}

	if (profile === "cm3profile") {
		if (area === "c") {
			return "cm3r";
		}
		if (area === "t") {
			return "cm3t";
		}
		return "cm3";
	}
	
	if (profile === "ocmprofile") {
		if (area === "q") {
			return "ocmq";
		}
		if (area === "l") {
			return "ocml";
		}
		if (area === "o") {
			return "ocmo";
		}
		return "ocm";
	}
}


/**
*  This function is to get the folder list from the profile record which enables the view access
*  
*  @param  {array} profiles - list of profile name
*  @param  {string} filename - file name of the profile
*  @return {array} list of folders
*/
function _getFoldersWithViewRight(profiles, filename, folders) {
	for (var i=0; i<profiles.length; i++) {
		var profile_name = profiles[i];
		
		if (profile_name != null & profile_name != "") {
			var folder_sql = "name=\"" + profile_name + "\"";
			
			if (filename === "cm3profile" || filename === "ocmprofile") {
				// get the profile area
				var profile_areas = [];
				
				$(filename, SCFILE_READONLY).select("name=\"" + profile_name + "\"").iterate(function(profile) {
					profile_areas.push(_getFolderTable(filename, profile.area));
				});
				folder_sql += " and tablename isin " + system.functions.str(profile_areas);
			}
			else if (filename === "rcenv") {
				folder_sql += " and tablename isin " + system.functions.str(_getFolderTable(filename));
			}
			else {
				folder_sql += " and tablename=\"" + _getFolderTable(filename) + "\"";
			}

			$("FolderRights", SCFILE_READONLY).select(folder_sql).iterate(function(record) {
				if (record.view) {
					folders.push(record.folder);
				}
			});
		}
	}
	
	return folders;
}


/**
*  This function is to get the folder list from the operator record which enables the view access
*  
*  @param  {obj} object of the operator record
*  @return {array} list of folders
*/
function getFolderList(operator_obj) {
	var role_rights = lib.security.buildSecRoleRight(operator_obj.secRole).areas;
	var disabled_sec_areas = vars.$G_disabled_area;
	var folder_list = [];
	
	if (disabled_sec_areas == null) {
		disabled_sec_areas = [];
	}
	
	// get the folder which has the view right from security roles
	for (var i=0; i<role_rights.length(); i++) {
		if (!arrayUtil.contains(disabled_sec_areas, role_rights[i].area)) {
			var folders = role_rights[i].folders;
	
			for (var fLen=0; fLen<folders.length(); fLen++) {
				var folder_name = folders[fLen].folder;
				var has_view_right = folders[fLen].fTokenValue[0];
		
				if (has_view_right === "true") {
					folder_list.push(folder_name);
				}
			}
		}
	}

	// get the folder which has the view right from profiles
	// configuration profile
	var configuration_profile = operator_obj.profile_inventory;
	folder_list = _getFoldersWithViewRight([configuration_profile], "icmenv", folder_list);
	// change profiles
	if (arrayUtil.contains(disabled_sec_areas, "Change")) {
		var change_profile = operator_obj.profile_change;
		folder_list = _getFoldersWithViewRight(change_profile, "cm3profile", folder_list);
	}
	// request profile
	if (arrayUtil.contains(disabled_sec_areas, "Request")) {
		var request_profile = operator_obj.profile_request;
		folder_list = _getFoldersWithViewRight(request_profile, "ocmprofile", folder_list);
	}
	// incident profile
	if (arrayUtil.contains(disabled_sec_areas, "Incident")) {
		var incident_profile = operator_obj.profile_incident;
		folder_list = _getFoldersWithViewRight([incident_profile], "pmenv", folder_list);
	}
	// service profile
	if (arrayUtil.contains(disabled_sec_areas, "Service Desk")) {
		var service_profile = operator_obj.profile_service;
		folder_list = _getFoldersWithViewRight([service_profile], "smenv", folder_list);
	}
	// problem profile
	if (arrayUtil.contains(disabled_sec_areas, "Problem")) {
		var problem_profile = operator_obj.profile_rootcause;
		folder_list = _getFoldersWithViewRight([problem_profile], "rcenv", folder_list);	
	}

	return arrayUtil.removeDuplicateEmptyElement(folder_list);
}


var MAX_LENGTH = 150;
/**
*  trim message to 150, add ... to the end.
*  
*  @param  {String} msg to be trimmed
*  @return {String} trimmed string
*/
function trimMessage(msg) {
	if (msg && msg.length > MAX_LENGTH) {
		return msg.substring(0, MAX_LENGTH) + "...";
	}
	return msg;
}