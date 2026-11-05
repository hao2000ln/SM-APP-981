var $ = lib.c.$;
/**
* Script to update Problem module to PD style
* TODO upgradeOperator and upgradeUserRoles can be refect and reuse in other module
**/
var ProblemUpgradeManager = $(lib.ProcessDesignCPUpgradeManager.getClass(),
		new function() {

			return {
				upgradeCategories: function() {
				 
				},
				postMethod: function(){
					var declaredStatus = [{
							"module": "rootcause",
							"status": "{\"Rejected\"}"
						}, {
							"module": "rootcausetask",
							"status": "{\"Updated\",\"Work-In-Progress\"}"
						}];
					
					var i;
					for (i = 0; i < declaredStatus.length; i++) {
						var sc = new SCFile("ModuleStatus");
						var ret = sc.doSelect("module=\"" + declaredStatus[i].module + "\" and status isin " + declaredStatus[i].status);
						while (ret == RC_SUCCESS) {
							sc.doDelete();
							ret = sc.getNext();
						}
					}
				},
				upgradeProfiles : function() {
					var profile = new SCFile( "rcenv" );
					var sql = "true";
					var upgradeInfoObj={};
					// all the fields not included in this oob dbdict list will treat as customized fields
					upgradeInfoObj["dbdict_profile_930"]=["advanced.search", "allowedStatus", "append.query", "assign.groups", "browse", "change.category", "change.phase", "change.task.category", "close", "closed.update", "count","create.known.error", "create.task", "edit.format", "expressions", "fill", "find", "full.name", "global.inbox", "inbox.edit","inbox.search", "initial.format", "initial.inbox", "ket.advanced.search", "ket.allowedStatus", "ket.assign.groups", "ket.close", "ket.complex", "ket.count", "ket.edit.format", "ket.full.name", "ket.global.inbox", "ket.inbox.edit", "ket.inbox.search", "ket.initial.format", "ket.initial.inbox", "ket.list.edit", "ket.lock.on.display", "ket.manage.format", "ket.new", "ket.partial.key", "ket.personal.inbox", "ket.print.format", "ket.qbe.format", "ket.reopen", "ket.search.format","ket.search.list", "ket.skip.warning", "ket.template", "ket.update", "ket.view", "ket.views", "kne.advanced.search", "kne.allowedStatus", "kne.assign.groups", "kne.browse", "kne.change.category", "kne.change.phase", "kne.close", "kne.closed.update", "kne.complex", "kne.count", "kne.edit.format", "kne.fill", "kne.find", "kne.full.name", "kne.global.inbox", "kne.inbox.edit", "kne.inbox.search", "kne.initial.format", "kne.initial.inbox", "kne.list.edit", "kne.lock.on.display", "kne.manage.format", "kne.mass.update", "kne.new", "kne.open.script.name", "kne.partial.key", "kne.personal.inbox", "kne.post.to.knowledge", "kne.print", "kne.print.format", "kne.qbe.format", "kne.reopen", "kne.resolution.script.name", "kne.search.format", "kne.search.list", "kne.skip.warning", "kne.template", "kne.update", "kne.view", "kne.views", "list.edit", "lock.on.display", "manage.format", "name", "name.ket", "name.keta", "name.kne", "name.pmt", "name.prob", "new", "open", "open.script.name", "partial.key", "personal.inbox", "pm.complex", "pm.mass.update", "pm.template", "pmt.allowedStatus", "pmt.advanced.search", "pmt.assign.groups", "pmt.browse", "pmt.close", "pmt.complex", "pmt.count", "pmt.create.known.error", "pmt.edit.format", "pmt.fill", "pmt.find", "pmt.full.name", "pmt.global.inbox", "pmt.inbox.edit", "pmt.inbox.search", "pmt.initial.format", "pmt.initial.inbox", "pmt.list.edit", "pmt.lock.on.display", "pmt.manage.format", "pmt.mass.update", "pmt.new", "pmt.open.script.nameXXX", "pmt.partial.key", "pmt.personal.inbox", "pmt.print", "pmt.print.format", "pmt.qbe.format", "pmt.reopen", "pmt.resolution.script.nameXXX", "pmt.search.format", "pmt.search.list", "pmt.skip.warning", "pmt.template", "pmt.update", "pmt.view", "pmt.views", "post.to.knowledge", "print", "print.format", "qbe.format", "reopen", "resolution.script.name", "search.format", "search.list", "skip.warning", "sysmodcount", "sysmodtime", "sysmoduser", "update", "view", "views"];
					upgradeInfoObj["mapped_fields"]=["allowedStatus","append.query","assign.groups","create.known.error","edit.format","global.inbox","inbox.edit","inbox.search","initial.inbox","list.edit","lock.on.display","manage.format","partial.key","personal.inbox","print.format","qbe.format","reopen","search.format","search.list","skip.warning"];
					upgradeInfoObj["profile_dbdict_name"]="rcenv";
					upgradeInfoObj["script_setup_name"]="SecuritySetupEnvironment";
					upgradeInfoObj["areas"]=["Problem","Problem Tasks"];
					
					if ( profile.doSelect( sql ) == RC_SUCCESS )
					{
						do
						{
						//using the new role upgrade script	
						 lib.SecurityProfileCopy.upgradeProfiles(profile.name,upgradeInfoObj);
						}
						while ( profile.getNext() == RC_SUCCESS );
						
					}
				},

				upgradeAreas : function() {
					var datadict = new SCFile("datadict");
					var sql = "name isin {\"rootcause\",\"activityproblem\",\"knownerror\", \"activityknownerror\"}";
					
					if (datadict.doSelect( sql ) == RC_SUCCESS ) {
    					do
    					{
    						datadict.sc_area = "Problem";
    						datadict.doUpdate();	
    					}
    					while (datadict.getNext() == RC_SUCCESS);
   					}
					
					sql = "name isin {\"rootcausetask\",\"activityproblemtasks\",\"knownerrortask\"}";
					if (datadict.doSelect( sql ) == RC_SUCCESS ) {
    					do
    					{
    						datadict.sc_area = "Problem Tasks";
    						datadict.doUpdate();	
    					}
    					while (datadict.getNext() == RC_SUCCESS);
    				}
    				
 					sql = "name isin {\"rootcausecat\",\"rootcausephase\",\"rootcausetaskcat\",\"knownerrorcat\",\"knownerrorphase\"}";
					if (datadict.doSelect( sql ) == RC_SUCCESS ) {
    					do
    					{
    						datadict.sc_area = "Problem Management Configuration";
    						datadict.doUpdate();	
    					}
    					while (datadict.getNext() == RC_SUCCESS);
    				}
					
					var secArea = new SCFile("secArea");
					sql="name#\"Problem\"";
					if (secArea.doSelect( sql ) == RC_SUCCESS ) {
    					do
    					{
    					 try {
    						lib.securityTriggers.updateAreaRights( secArea, secArea.name );
    					 }
    					 catch ( exception )
    					 {
    						print( exception.toString() );
    					 }
    					}
    					while (secArea.getNext() == RC_SUCCESS);
					}
				}
			};
		});

function getClass() {
	return ProblemUpgradeManager;
}

function getInstance() {
	return new ProblemUpgradeManager("rootcause","Problem","profile.rootcause");
}