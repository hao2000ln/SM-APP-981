var $ = lib.c.$;

var WorkflowPhaseService = $({
	getUpdateCond : function(phase, mode, action) {
		var updateCond = true;
		if (phase != null) {
			if (phase["updateCond"] != null) {
				updateCond = phase["updateCond"];
				// handle both expression and literal expression
				updateCond = system.functions.str(phase["updateCond"]);
				updateCond = system.functions.parse(updateCond, 2);
			} else {
				updateCond = this.getDefaultUpdateCond(mode, action,
						phase["active"]);
			}
		}
		return updateCond;
	},

	getDefaultUpdateCond : function(mode, action, active) {
		var updateCond = true;
		if (active) {
			if ("add" == mode || "add" == action) {
				updateCond = vars.$L_tableAccess_new;
			} else {
				updateCond = vars.$L_tableAccess_update;
			}
		} else {
			updateCond = false;
		}
		return updateCond;
	},

	getAllPhases : function(tableName) {
		var allPhases = $.createSCArray();
		$("WorkflowPhase").select('tableName=\"' + tableName + '\"').iterate(
				function(record) {
					if (!$.contains(allPhases, record["phaseName"], $.Array)) {
						allPhases.push(record["phaseName"]);
					}
				});
		return allPhases;
	} 

	
});

function getClass() {
	return WorkflowPhaseService;
}
