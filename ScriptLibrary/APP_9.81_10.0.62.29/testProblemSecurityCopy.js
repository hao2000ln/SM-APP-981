/*
This script should run for every profile, so that we can confirm all the problem/problem task role are happly cloned.
1.clone the profile
2.change $G.role and $G.roleRights to be able to reload the security
3.load the security from rcenv
4.load the security from security script
5.compare every elements
6.setback the $G.role and $G.roleRights
*/
var pm_compare_fields = ["append.query","partial.key","initial.format","initial.request.inbox","qbe.format","request.manage.format","reopen","skip.warning","new","view","views","close","update","closed_update","post.to.knowledge","create.known.error","pm.template","pm.complex","advanced.search","personal.inbox","change.category","change.phase","allowedStatus","assign.groups"];
var pmt_compare_fields = ["pmt.append.query","pmt.partial.key","pmt.initial.format","pmt.qbe.format","pmt.request.manage.format","pmt.reopen","pmt.skip.warning","pmt.new","pmt.view","pmt.views","pmt.close","pmt.update","pmt.closed.update","pmt.post.to.knowledge","pmt.create.known.error","pmt.template","pmt.complex","pmt.advanced.search","pmt.personal.inbox","pmt.change.category","pmt.allowedStatus","pmt.assign.groups"];

var roleMapping = {
	"views": "view",
	"count": "view",
	"closed.update": "expert",
	"post.to.knowledge": "expert",
	"create.known.error": "expert",
	"pm.template": "expert",
	"pm.complex": "expert",
	"advanced.search": "expert",
	"personal.inbox": "expert",
	"change.category": "admin",
	"change.phase":"admin"
    }
; //

var pmtRoleMapping = {
	"pmt.views": "view",
	"pmt.count": "view",
	"pmt.closed.update": "expert",
	"pmt.post.to.knowledge": "expert",
	"pmt.create.known.error": "expert",
	"pmt.template": "expert",
	"pmt.complex": "expert",
	"pmt.advanced.search": "expert",
	"pmt.personal.inbox": "expert",
	"pmt.change.category": "admin"
};

var upgradeInfoObj={};

function verifySecurityProfileCopy(role) {
	var currentRole = []; //the currentRole should be saved and rollback after the test.Otherwise the secRights may unable to save.
	for (var i = 0; i < vars.$G_role.length(); i++) {
		currentRole.push(vars.$G_role[i]);
	}
	
	upgradeInfoObj["dbdict_profile_930"]=["advanced.search", "allowedStatus", "append.query", "assign.groups", "browse", "change.category", "change.phase", "change.task.category", "close", "closed.update", "count","create.known.error", "create.task", "edit.format", "expressions", "fill", "find", "full.name", "global.inbox", "inbox.edit","inbox.search", "initial.format", "initial.inbox", "ket.advanced.search", "ket.allowedStatus", "ket.assign.groups", "ket.close", "ket.complex", "ket.count", "ket.edit.format", "ket.full.name", "ket.global.inbox", "ket.inbox.edit", "ket.inbox.search", "ket.initial.format", "ket.initial.inbox", "ket.list.edit", "ket.lock.on.display", "ket.manage.format", "ket.new", "ket.partial.key", "ket.personal.inbox", "ket.print.format", "ket.qbe.format", "ket.reopen", "ket.search.format","ket.search.list", "ket.skip.warning", "ket.template", "ket.update", "ket.view", "ket.views", "kne.advanced.search", "kne.allowedStatus", "kne.assign.groups", "kne.browse", "kne.change.category", "kne.change.phase", "kne.close", "kne.closed.update", "kne.complex", "kne.count", "kne.edit.format", "kne.fill", "kne.find", "kne.full.name", "kne.global.inbox", "kne.inbox.edit", "kne.inbox.search", "kne.initial.format", "kne.initial.inbox", "kne.list.edit", "kne.lock.on.display", "kne.manage.format", "kne.mass.update", "kne.new", "kne.open.script.name", "kne.partial.key", "kne.personal.inbox", "kne.post.to.knowledge", "kne.print", "kne.print.format", "kne.qbe.format", "kne.reopen", "kne.resolution.script.name", "kne.search.format", "kne.search.list", "kne.skip.warning", "kne.template", "kne.update", "kne.view", "kne.views", "list.edit", "lock.on.display", "manage.format", "name", "name.ket", "name.keta", "name.kne", "name.pmt", "name.prob", "new", "open", "open.script.name", "partial.key", "personal.inbox", "pm.complex", "pm.mass.update", "pm.template", "pmt.allowedStatus", "pmt.advanced.search", "pmt.assign.groups", "pmt.browse", "pmt.close", "pmt.complex", "pmt.count", "pmt.create.known.error", "pmt.edit.format", "pmt.fill", "pmt.find", "pmt.full.name", "pmt.global.inbox", "pmt.inbox.edit", "pmt.inbox.search", "pmt.initial.format", "pmt.initial.inbox", "pmt.list.edit", "pmt.lock.on.display", "pmt.manage.format", "pmt.mass.update", "pmt.new", "pmt.open.script.nameXXX", "pmt.partial.key", "pmt.personal.inbox", "pmt.print", "pmt.print.format", "pmt.qbe.format", "pmt.reopen", "pmt.resolution.script.nameXXX", "pmt.search.format", "pmt.search.list", "pmt.skip.warning", "pmt.template", "pmt.update", "pmt.view", "pmt.views", "post.to.knowledge", "print", "print.format", "qbe.format", "reopen", "resolution.script.name", "search.format", "search.list", "skip.warning", "sysmodcount", "sysmodtime", "sysmoduser", "update", "view", "views"];
	upgradeInfoObj["mapped_fields"]=["append.query","partial.key","initial.format","initial.request.inbox","qbe.format","request.manage.format","reopen","skip.warning"];
	upgradeInfoObj["profile_dbdict_name"]="rcenv";
	upgradeInfoObj["script_setup_name"]="SecuritySetupEnvironment";
	upgradeInfoObj["areas"]=["Problem Management","Problem Tasks"];
	
	lib.SecurityProfileCopy.upgradeProfiles(role,upgradeInfoObj);

	//get all the fields from cm3profile, so that we can iterator them.
	var fieldList = [];
	var allowedType = [1, 2, 4, 8, 11]; //6,
	var profileDbdict = new SCFile("dbdict");
	
	profileDbdict.doSelect("name=\"rcenv\"");
	var allFields = profileDbdict.field;
	for (var i = 0; i < allFields.length(); i++) {
		if (allFields[i] != null && allFields[i].level == 1 && lib.ArrayUtil.contains(allowedType, allFields[i].type)) {
			fieldList.push(allFields[i].name);
		}
	}

	/**Start to verify problem fields */
	//reset the role
	vars.$G_roleRights = null;
	vars.$G_role = [role];
	//clear vars.$G_rc_environment
	vars.$G_rc_environment = new SCFile("rcenv");
	lib.SecuritySetupEnvironment.populateRootcauseEnvironment();
	
	var profile = new SCFile("rcenv");
	var sql = "name=\"" + role +"\"";
	if (profile.doSelect(sql) == RC_SUCCESS) {
		//set the default value for new item
		roleExpert = profile["closed_update"] || profile["post_to_knowledge"] || profile["create_known_error"] || profile["pm_template"] || profile["pm_complex"] || profile["advanced_search"]||profile["personal.inbox"];
		roleAdmin = profile["personal_inbox"] || profile["change_category"] || profile["change_phase"];
		roleView = profile["view"] || profile["views"] || profile["count"];
		//compare them
		for (var i = 0; i < fieldList.length; i++) {
			field = fieldList[i];
			var oldValue;
			if (roleMapping[field] != null) {
				oldValue = profile[roleMapping[field]];
				if (roleMapping[field] == "expert") {
					oldValue = roleExpert;
				}else if (roleMapping[field] == "admin") {
					oldValue = roleAdmin;
				}else if (roleMapping[field] == "view") {
					oldValue = roleView;
				}
			}
			else {
				oldValue = profile[field];
			}
			
			
		var thisArea = new SCFile("secArea");
		var sql = "name=\"Problem Management\"";
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
			var currentValue = vars.$G_rc_environment[field];
			
			currentValue = system.functions.nullsub(currentValue, false);
			oldValue = system.functions.nullsub(oldValue, false);
			if (lib.ArrayUtil.contains(pm_compare_fields, field) && system.functions.str(oldValue) != system.functions.str(currentValue)) {
				print("rootcause:" + field + ":" + (oldValue == currentValue) + "=>" + oldValue + "*" + currentValue);
			}

		}
	}
	
	/**Start to verify problem tasks fields */
	//reset the role
	vars.$G_roleRights = null;
	vars.$G_role = [role];
	//clear vars.$G_rc_environment
	vars.$G_rc_environment = new SCFile("rcenv");

	lib.SecuritySetupEnvironment.populateRootcauseTaskEnvironment();
	      
	var profile = new SCFile("rcenv");
	var sql = "name=\"" + role +"\"";
	if (profile.doSelect(sql) == RC_SUCCESS) {
		//set the default value for new item
		roleExpert = profile["pmt_closed_update"] || profile["pmt_create_known_error"] || profile["pmt_template"] || profile["pmt_complex"] || profile["pmt_advanced_search"]||profile["pmt_personal.inbox"];
		roleAdmin = profile["pmt_personal_inbox"] || profile["pmt_change_category"];
		roleView = profile["pmt_view"] || profile["pmt_views"] || profile["pmt_count"];
		//compare them
		for (var i = 0; i < fieldList.length; i++) {
			field = fieldList[i];
			var oldValue;
			if (pmtRoleMapping[field] != null) {
				oldValue = profile[pmtRoleMapping[field]];
				if (pmtRoleMapping[field] == "expert") {
					oldValue = roleExpert;
				}else if (pmtRoleMapping[field] == "admin") {
					oldValue = roleAdmin;
				}else if (pmtRoleMapping[field] == "view") {
					oldValue = roleView;
				}
			}
			else {
				oldValue = profile[field];
			}
		
		
			
		var thisArea = new SCFile("secArea");
		var sql = "name=\"Problem Tasks\"";
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
		
		//if the update field is empty , set the default value as "never"	
		if(field=="pmt.update" && oldValue==null ){
				    oldValue="never";	
		}
			var currentValue = vars.$G_rc_environment[field];
			
			currentValue = system.functions.nullsub(currentValue, false);
			oldValue = system.functions.nullsub(oldValue, false);
			if (lib.ArrayUtil.contains(pmt_compare_fields, field) && system.functions.str(oldValue) != system.functions.str(currentValue)) {
				print("rootcause:" + field + ":" + (oldValue == currentValue) + "=>" + oldValue + "*" + currentValue);
			}

		}
	}
	
	
	//set role back to the login user.
	vars.$G_role = currentRole;
	vars.$G_roleRights = null;

}


var profile = new SCFile("rcenv");
var ret = profile.doSelect("true"); //area isin {\"a\",\"c\"}  and name=\"change approver\"
while (ret == RC_SUCCESS) {
	print("verify " + profile.name);
	verifySecurityProfileCopy(profile.name);
	ret = profile.getNext();
}