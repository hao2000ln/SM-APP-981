/*
This script should run for every profile, so that we can confirm all the cm3r/cm3t role are happly cloned.
1.clone the profile
2.change $G.role and $G.roleRights to be able to reload the security
3.load the security from cm3profile
4.load the security from security script
5.compare every elements
6.setback the $G.role and $G.roleRights
*/
var dbdict_obsolete_fields = ["count", "name", "area", "name.alias", "database", "expand", "valid.lkup", "withdraw", "calc.risk", "review", "groups", "active.query", "all.query", "deferred", "history", "qberestore", "query.time.limit", "statements", "all", "audit", "cat", "db.mass.update", "default.template.change", "default.template.task", "print", "print.bg", "print.fg", "print.qbe", "printer", "qbelist.format", "qbelist.report", "qberecs", "qberecs.format", "qberecs.report", "standard", "structured", "sysmodcount", "sysmodtime", "sysmoduser"];
var roleMapping = {
	"alert": "expert",
	"new.category": "admin",
	"phase.sel": "admin",
	"duplicates": "expert",
	"pagelist": "expert",
	"closed.update": "expert",
	"tasks": "view",
	"approve.override": "admin",
//	"count": "view",
	"approve.mass": "expert",
	"query.window": "expert",
	"cpyopn":"new",
	"apprdism": "expert",
	"notify": "view",
	"views": "view",
	"count": "view",
	"clear": "view",
	"close": "delete",
	"find": "view",
	"fill": "view",
	"irquery": "view",
	"show.parent": "view",
	"db.template": "expert",
	"db.complex": "expert"
}; //
function verifySecurityProfileCopy(role) {
	var currentRole = []; //the currentRole should be saved and rollback after the test.Otherwise the secRights may unable to save.
	for (var i = 0; i < vars.$G_role.length(); i++) {
		currentRole.push(vars.$G_role[i]);
	}
	
	lib.SecurityCM3ProfileCopy.upgradeProfiles(role);

	//get all the fields from cm3profile, so that we can iterator them.
	var fieldList = [];
	var allowedType = [1, 2, 4, 8, 11]; //6,
	var cm3profileDbdict = new SCFile("dbdict");
	cm3profileDbdict.doSelect("name=\"cm3profile\"");
	var allFields = cm3profileDbdict.field;
	for (var i = 0; i < allFields.length(); i++) {
		if (allFields[i] != null && allFields[i].level == 1 && lib.ArrayUtil.contains(allowedType, allFields[i].type)) {
			fieldList.push(allFields[i].name);
		}
	}
	//reset the role
	vars.$G_roleRights = null;
	vars.$G_role = [role];
	//clear vars.$G_cm3r_environment
	vars.$G_cm3r_environment = new SCFile("cm3profile");
	vars.$G_cm3t_environment = new SCFile("cm3profile");
	lib.SetupCm3Environment.cm3rEnvironment();
	lib.SetupCm3Environment.cm3tEnvironment();
	var profile = new SCFile("cm3profile");
	var sql = "name=\"" + role + "\" and area isin {\"a\",\"c\"}";
	if (profile.doSelect(sql) == RC_SUCCESS) {
		//set the default value for new item
		roleExpert = profile["alert"] || profile["duplicates"] || profile["pagelist"];
		roleAdmin = profile["new_category"] || profile["phase_sel"];
		//compare them
		for (var i = 0; i < fieldList.length; i++) {
			field = fieldList[i];
			var oldValue;
			if (roleMapping[field] != null) {
				oldValue = profile[roleMapping[field]];
				if (roleMapping[field] == "expert") {
					oldValue = roleExpert;
				}
				else if (roleMapping[field] == "admin") {
					oldValue = roleAdmin;
				}
			}
			else {
				oldValue = profile[field];
			}
			if (field == "approval.groups") {
				oldValue = vars.$G_myGroups.approver_of;
			}
			else if (field == "manager.groups") {
				oldValue = vars.$G_myGroups.member_of;
			}
			
				var thisArea = new SCFile("secArea");
		var sql = "name=\"Change\"";
		if (oldValue==null && thisArea.doSelect( sql ) == RC_SUCCESS )
		{
			for ( var y = 0; y < thisArea.settingId.length(); y++ )
				{
					if ( thisArea.settingId[y] == field )
					{
						oldValue= thisArea.settingValue[y];
						break;
					}

				}
		}
			
			var currentValue = vars.$G_cm3r_environment[field];
			currentValue = system.functions.nullsub(currentValue, false);
			oldValue = system.functions.nullsub(oldValue, false);
			if (!lib.ArrayUtil.contains(dbdict_obsolete_fields, field) && system.functions.str(oldValue) != system.functions.str(currentValue)) {
				print("cm3r:" + field + ":" + (oldValue == currentValue) + "=>" + oldValue + "*" + currentValue);
			}

		}
	}
	
	var taskProfile = new SCFile("cm3profile");
	var sql = "name=\"" + role + "\" and area isin {\"a\",\"t\"}";
	if (taskProfile.doSelect(sql) == RC_SUCCESS) {
		//set the default value for new item
		roleExpert = taskProfile["alert"] || taskProfile["duplicates"] || taskProfile["pagelist"];
		roleAdmin = taskProfile["new_category"] || taskProfile["phase_sel"];
		//compare them
		for (var i = 0; i < fieldList.length; i++) {
			field = fieldList[i];
			var oldValue;
			if (roleMapping[field] != null) {
				oldValue = taskProfile[roleMapping[field]];
				if (roleMapping[field] == "expert") {
					oldValue = roleExpert;
				}
				else if (roleMapping[field] == "admin") {
					oldValue = roleAdmin;
				}
			}
			else {
				oldValue = taskProfile[field];
			}
			if (field == "approval.groups") {
				oldValue = vars.$G_myGroups.approver_of;
			}
			else if (field == "manager.groups") {
				oldValue = vars.$G_myGroups.member_of;
			}
							var thisArea = new SCFile("secArea");
		var sql = "name=\"Change Tasks\"";
		if (oldValue==null && thisArea.doSelect( sql ) == RC_SUCCESS )
		{
			for ( var y = 0; y < thisArea.settingId.length(); y++ )
				{
					if ( thisArea.settingId[y] == field )
					{
						oldValue= thisArea.settingValue[y];
						break;
					}

				}
		}
		
			var currentValue = vars.$G_cm3t_environment[field];
			currentValue = system.functions.nullsub(currentValue, false);
			oldValue = system.functions.nullsub(oldValue, false);
			if (!lib.ArrayUtil.contains(dbdict_obsolete_fields, field) && system.functions.str(oldValue) != system.functions.str(currentValue)) {
				print("cm3t:" + field + ":" + (oldValue == currentValue) + "=>" + oldValue + "*" + currentValue);
			}

		}
	}
 

	//set role back to the login user.
	vars.$G_role = currentRole;
	vars.$G_roleRights = null;

}

var cm3profile = new SCFile("cm3profile");
var ret = cm3profile.doSelect("name=\"change approver\""); //area isin {\"a\",\"c\"}  and name=\"change approver\"
while (ret == RC_SUCCESS) {
	print("verify " + cm3profile.name);
	verifySecurityProfileCopy(cm3profile.name);
	ret = cm3profile.getNext();
}