function search(fileName, formatName, query) {
	if (formatName != null && fileName == null) {
		var idx = formatName.indexOf(".");
		fileName = formatName.substring(0, idx);
	}
	
	if (fileName == "taskPlannerFieldsDef") {
		if (query == null || query == "") {
			return "#searchTaskAddlFieldsView.view";
		} else {
			return "#listTaskAddlFieldsView.list";
		}
	}
	// when search All Known Errors,the query is not null,but fail to open a known error record from the view in Favortes and dashboards panel,set vars.$isKnownError=true	
	if(fileName == "rootcause" && vars.$isKnownError==null && query!=null && (query.match(/^\s*isKnownError\s*=\s*true\s*$/)||query.match(/^\s*id=\"KE\d*\"\s*$/))){
	
	    vars.$isKnownError=true;
	}

	
}


function runAction(actionStr){
	var k = actionStr.indexOf(':');
	var action = actionStr.substring(0, k);
	
	var param = actionStr.substring(k+1);
	
	if(action == 'showRiskResult') {
		lib.RiskView.showRisk(param);
		return;
	}
}