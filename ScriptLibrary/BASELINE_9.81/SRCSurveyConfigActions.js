/* 
* function to handle the action on the list survey fields page.
*/
function fieldListAction() {
	if(vars.$L_option == "403") {
		lib.SRCSurveyConfigService.removeSelectedField();	
		vars.$restart = true;
	}
	else if(vars.$L_option == "402") {
		lib.SRCSurveyConfigService.prepareFieldsForEdit();	
	}
	else if(vars.$L_option == "407") {
		lib.SRCSurveyConfigService.moveUpSelectedField();	
		vars.$restart = true;
	}
	else if(vars.$L_option == "408") {
		lib.SRCSurveyConfigService.moveDownSelectedField();	
		vars.$restart = true;
	}
	else if(vars.$L_option == "409") {
		lib.SRCSurveyConfigService.onCompanyChanged();	
		vars.$restart = true;
	}	
}

/* 
* function to handle the action on the add survey question page.
*/
function fieldAddAction() {
	if(vars.$L_option == "6") {
		lib.SRCSurveyConfigService.onFieldChangedDuringAdd();
		vars.$restart = true;
	}
	
	else if(vars.$L_option == "5") {
		vars.$restart = false;
	}
	else if(vars.$L_option == "3") {
		vars.$restart = false;
	}	
}

/* 
* function to handle the action on the edit survey question page.
*/
function fieldEditAction() {	
	if(vars.$L_option == "5") {
		vars.$restart = false;
	}
	else if(vars.$L_option == "3") {
		vars.$restart = false;
	}	
}




