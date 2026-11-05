var $ = lib.c.$;
/**
* Script to update Incident module to PD style
* TODO upgradeOperator and upgradeUserRoles can be refect and reuse in other module
**/
var IncidentUpgradeManager = $(lib.ProcessDesignCPUpgradeManager.getClass(),
		new function() {
			function syncSubcategory(categoryName) {
				var oldSubcategory=new SCFile("subcategory");
				var sql="category=\"" + categoryName + "\"";
				// query old subcategory table, sync to new sub category table
				var selectRC = oldSubcategory.doSelect(sql);
				if ( selectRC != RC_SUCCESS )
				{
					print( "ERROR: select old subcategory failed, RC=" + RCtoString(selectRC));
					return;
				}
				do {
					var newSubcategory=new SCFile("imSubcategory");
					var sql2="category=\"" + categoryName + "\" and subcategory.name=\"" + oldSubcategory.subcategory + "\"";
					if(newSubcategory.doSelect(sql2)== RC_SUCCESS){
						// new sub category already exists, update active field
						newSubcategory.Active=oldSubcategory.active;
						newSubcategory.doUpdate();
					} else {
						// new sub category does not exist, add it
						newSubcategory.subcategory_name=oldSubcategory.subcategory;
						newSubcategory.category=oldSubcategory.category;
						newSubcategory.Active=oldSubcategory.active;
						newSubcategory.doInsert();
					}
					syncArea(categoryName, oldSubcategory.subcategory);
				} while(oldSubcategory.getNext() == RC_SUCCESS);
			};

			function syncArea(categoryName, subcategoryName) {
				var oldArea=new SCFile("producttype");
				var sql="category=\"" + categoryName + "\" and subcategory=\"" + subcategoryName + "\"";
				// query old area table, sync to new area table
				var selectRC = oldArea.doSelect(sql);
				if ( selectRC != RC_SUCCESS )
				{
					print( "ERROR: select old area failed, RC=" + RCtoString(selectRC));
					return;
				}
				do {
					var newArea=new SCFile("imArea");
					var sql2="category=\"" + categoryName + "\" and subcategory=\"" + subcategoryName + "\" and area.name=\"" + oldArea.product_type + "\"";
					if(newArea.doSelect(sql2)== RC_SUCCESS){
						// new area already exists, update active field
						newArea.Active=oldArea.active;
						newArea.doUpdate();
					} else {
						// new area does not exist, add it
						print("The old area \"" + oldArea.product_type + "\" is not in new area table, add it to new area table!");
						newArea.area_name=oldArea.product_type;
						newArea.category=categoryName;
						newArea.subcategory=subcategoryName;
						newArea.Active=oldArea.active;
						newArea.doInsert();
					}
				} while(oldArea.getNext() == RC_SUCCESS);
			};

			return {
				upgradeCategories: function() {
				},
				upgradeProfiles: function() {
					var profile = new SCFile( "pmenv" );
					var sql = "true";
					var upgradeInfoObj={};
					
					upgradeInfoObj["dbdict_profile_930"]=["allowedStatus", "append.query", "assignment.groups", "background.print", "browse", "browse.flag", "browse.format", "call.manage.format", "callback", "categories", "category", "check.duplicates", "check.ke", "check.parents", "check.rc", "close", "closed.update", "confirm.on.end", "count", "database", "db.complex", "db.mass.update", "db.template", "default.qbe", "default.template", "detail", "duplicates", "edit.incident.format", "exit", "exit.names", "exit.values", "expressions", "fill", "find", "foreground.print", "format.name", "full.name", "global.inbox", "home", "inactivate", "inbox.edit", "inbox.search", "incident.print.format", "incident.search.format", "initial.inbox", "initial.incident.format", "initial.incident.inbox", "ir.query", "list.edit", "lock.call.on.display", "lock.on.display", "log", "log.all", "log.format", "macro.problem.format", "mass.inactivate", "massclose", "max.hits", "max.levels", "modifyTemplate", "name", "new", "new.category", "notes", "notify", "notify.format", "open", "override", "partial.key", "personal.inbox", "present.qbe", "present.query", "present.script", "prob.mgmt.candidate", "problem.manage.format", "problem.search.format", "prompt.on.cancel", "prompt.on.ok", "query", "query.group", "reassignment", "reopen", "require.password", "resolution.format", "resolution.format.name", "resolution.script", "resolution.script.name", "review.queries", "script.name", "search.list", "server", "skip.warning", "suspend", "sysmodcount", "sysmodtime", "sysmoduser", "unsuspend", "unused", "update", "vdir", "view", "views"]
					upgradeInfoObj["mapped_fields"]=["categories","allowedStatus","assignment.groups","default.qbe","global.inbox","inbox.edit","inbox.search","initial.inbox","list.edit","lock.on.display","modifyTemplate","notify.format","partial.key","personal.inbox","problem.manage.format","problem.search.format","reopen","search.list","skip.warning","check.rc"];
					upgradeInfoObj["profile_dbdict_name"]="pmenv";
					upgradeInfoObj["script_setup_name"]="SecuritySetupEnvironment";
					upgradeInfoObj["areas"]=["Incident"];
					
					if ( profile.doSelect( sql ) == RC_SUCCESS )
					{
						do
						{
						//using the new role upgrade script	
						 if(profile.name=="problem manager/coord"){
						 	lib.SecurityProfileCopy.upgradeProfiles(profile.name,upgradeInfoObj,"problem manager");
						 	lib.SecurityProfileCopy.upgradeProfiles(profile.name,upgradeInfoObj,"problem coordinator");
						 }else{
						 	lib.SecurityProfileCopy.upgradeProfiles(profile.name,upgradeInfoObj);
						 }
							
						}
						while ( profile.getNext() == RC_SUCCESS );
						
					}
				},

				upgradeAreas: function() {
						var datadict = new SCFile("datadict");
						var sql = "name isin {\"probsummary\",\"activity\"}";
						
						if (datadict.doSelect( sql ) == RC_SUCCESS )
						do
						{
							datadict.sc_area = "Incident";
							datadict.doUpdate();	
						}
						while (datadict.getNext() == RC_SUCCESS)
						
						
					
				},
				
				upgradeSchema: function(){
					//rename dbdict field directly, db name will be updated via store procedure with high performance
					var dbdict = $("probsummary").dbdict();
					var currentPhase = $("#dbdictService").getFieldByName("current.phase", dbdict["field"]);
					if (currentPhase == null) {
						for (var i = 0; i < dbdict.field.length(); i++) {
							if (dbdict.field[i].name == "sla.vendor") {
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
	return IncidentUpgradeManager;
}

function getInstance() {
	return new IncidentUpgradeManager("probsummary","Incident","profile.incident");
}