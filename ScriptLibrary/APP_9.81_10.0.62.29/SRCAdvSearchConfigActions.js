function fieldListAction() {
	if(vars.$L_option == "403") {
		lib.SRCAdvSearchConfigService.removeSelectedField();	
		vars.$restart = true;
	}
	else if(vars.$L_option == "402") {
		lib.SRCAdvSearchConfigService.prepareFieldsForEdit();	
	}
	else if(vars.$L_option == "407") {
		lib.SRCAdvSearchConfigService.moveUpSelectedField();	
		vars.$restart = true;
	}
	else if(vars.$L_option == "408") {
		lib.SRCAdvSearchConfigService.moveDownSelectedField();	
		vars.$restart = true;
	}
	else if(vars.$L_option == "409") {
		lib.SRCAdvSearchConfigService.onCompanyChanged();	
		vars.$restart = true;
	}
	else if(vars.$L_option == "5") {
		lib.SRCAdvSearchConfigService.persistAllChanges();
	}	
}

function fieldAddAction() {
	if(vars.$L_option == "6") {
		lib.SRCAdvSearchConfigService.onFieldChangedDuringAdd();
		vars.$restart = true;
	}
	
	else if(vars.$L_option == "5") {
		vars.$restart = false;
	}
	else if(vars.$L_option == "3") {
		vars.$restart = false;
	}	
}

function fieldEditAction() {	
	if(vars.$L_option == "5") {
		vars.$restart = false;
	}
	else if(vars.$L_option == "3") {
		vars.$restart = false;
	}	
}





