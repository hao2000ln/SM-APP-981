var $ = lib.c.$;
/**
 * Script to update Serice Desk module to PD style
 * TODO upgradeOperator and upgradeUserRoles can be refect and reuse in other module
 **/
var ServiceDeskUpgradeManager = $(lib.ProcessDesignCPUpgradeManager.getClass(),
new function () {
	function syncSubcategory(categoryName) {
		var oldSubcategory = new SCFile("subcategory");
		var sql = "category=\"" + categoryName + "\"";
		// query old subcategory table, sync to new sub category table
		var selectRC = oldSubcategory.doSelect(sql);
		if (selectRC != RC_SUCCESS) {
			print("ERROR: select old subcategory failed, RC=" + RCtoString(selectRC));
			return;
		}
		do {
			var newSubcategory = new SCFile("sdSubcategory");
			var sql2 = "category=\"" + categoryName + "\" and subcategory.name=\"" + oldSubcategory.subcategory + "\"";
			if (newSubcategory.doSelect(sql2) == RC_SUCCESS) {
				// new sub category already exists, update active field
				newSubcategory.Active = oldSubcategory.active;
				newSubcategory.doUpdate();
			}
			else {
				// new sub category does not exist, add it
				newSubcategory.subcategory_name = oldSubcategory.subcategory;
				newSubcategory.category = oldSubcategory.category;
				newSubcategory.Active = oldSubcategory.active;
				newSubcategory.doInsert();
			}
			syncArea(categoryName, oldSubcategory.subcategory);
		} while (oldSubcategory.getNext() == RC_SUCCESS);
	};

	function syncArea(categoryName, subcategoryName) {
		var oldArea = new SCFile("producttype");
		var sql = "category=\"" + categoryName + "\" and subcategory=\"" + subcategoryName + "\"";
		// query old area table, sync to new area table
		var selectRC = oldArea.doSelect(sql);
		if (selectRC != RC_SUCCESS) {
			print("ERROR: select old area failed, RC=" + RCtoString(selectRC));
			return;
		}
		do {
			var newArea = new SCFile("sdArea");
			var sql2 = "category=\"" + categoryName + "\" and subcategory=\"" + subcategoryName + "\" and area.name=\"" + oldArea.product_type + "\"";
			if (newArea.doSelect(sql2) == RC_SUCCESS) {
				// new area already exists, update active field
				newArea.Active = oldArea.active;
				newArea.doUpdate();
			}
			else {
				// new area does not exist, add it
				newArea.area_name = oldArea.product_type;
				newArea.category = categoryName;
				newArea.subcategory = subcategoryName;
				newArea.Active = oldArea.active;
				newArea.doInsert();
			}
		} while (oldArea.getNext() == RC_SUCCESS);
	};
	return {
		
	
		upgradeProfiles: function () {
			var profile = new SCFile("smenv");
			var sql = "true";
			var upgradeInfoObj = {};
			// all the fields not included in this oob dbdict list will treat as custmoized fields
			upgradeInfoObj["dbdict_profile_930"] = ["advanced.search", "allowedStatus", "append.query", "approval.groups", "approve.delegate", "browse", "close", "count", "db.complex", "db.template", "default.template", "edit.format", "ess.edit.format", "ess.initial.format", "ess.qbe.format", "ess.search.format", "expressions", "fill", "find", "full.name", "global.inbox", "inbox.edit", "inbox.search", "initial.format", "initial.inbox", "list.edit", "lock.on.display", "manage.format", "massclose", "modifyTemplate", "name", "new", "notify", "open", "personal.inbox", "print", "print.format", "qbe.format", "search.format", "search.list", "server", "sysmodcount", "sysmodtime", "sysmoduser", "unused", "update", "vdir", "view", "views"];
			upgradeInfoObj["mapped_fields"] = ["allowedStatus", "append.query","approve.delegate","approval.groups", "default.template","edit.format","ess.edit.format","ess.initial.format","ess.qbe.format","ess.search.format","global.inbox","inbox.edit","inbox.search","initial.inbox","list.edit","lock.on.display","manage.format","modifyTemplate","personal.inbox","print.format","qbe.format","search.format","search.list","initial.format"];
			upgradeInfoObj["profile_dbdict_name"] = "smenv";
			upgradeInfoObj["script_setup_name"] = "SecuritySetupEnvironment";
			upgradeInfoObj["areas"] = ["Service Desk"];

			if (profile.doSelect(sql) == RC_SUCCESS) {
				do {
					//using the new role upgrade script	
					lib.SecurityProfileCopy.upgradeProfiles(profile.name, upgradeInfoObj);
				}
				while (profile.getNext() == RC_SUCCESS);

			}
		},

		upgradeAreas: function () {
			var datadict = new SCFile("datadict");
			var sql = "name isin {\"incidents\"}";

			if (datadict.doSelect(sql) == RC_SUCCESS) do {
				datadict.sc_area = "Service Desk";
				datadict.doUpdate();
			}
			while (datadict.getNext() == RC_SUCCESS)

		},
		
		upgradeSchema: function(){
			//rename dbdict field directly, db name will be updated via store procedure with high performance
			var dbdict = $("incidents").dbdict();
			var currentPhase = $("#dbdictService").getFieldByName("current.phase", dbdict["field"]);
			if (currentPhase == null) {
				for (var i = 0; i < dbdict.field.length(); i++) {
					if (dbdict.field[i].name == "contact.location") {
						dbdict.field[i].name = "current.phase";
						dbdict.field[i]["sql.field.options"]["sql.column.name"] = "CURRENT_PHASE";
						break;
					}
				}
				dbdict.doSave();
			}
		}
	};
});

function getClass() {
	return ServiceDeskUpgradeManager;
}

function getInstance() {
	return new ServiceDeskUpgradeManager("incidents", "Service Desk", "profile.service");
}