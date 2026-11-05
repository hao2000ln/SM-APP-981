	
	function updateCm3r(){
		var file = new SCFile("dbdict");
		var rc = file.doSelect("name=\"cm3r\"");
		if(rc == RC_SUCCESS){
			if(renameColumn(file, "vj.number.string.1", 57, 2, "vj.number.deprecate")){
				//updateDB(file);
				rc = file.doUpdate();
				if(rc == RC_SUCCESS){
					lib.upgradeLog.scUpgrade(1200);
					lib.upgradeLog.scDetail(1200);
				}else{
					lib.upgradeLog.scError(1201);
				}
			}
		}
	}

	function renameColumn(file, oldname, index, level, newname){
		var ind = findFieldIndex(file.field, oldname, index, level);
		if(ind != -1){
			file.field[ind].name = newname;
			return true;
		}
		return false;
	}
	
	/**
	 * return the index of the field in a list of fields
	 */
	function findFieldIndex(fields, name, index, level){
		for(var i = 0; i < fields.length(); i++){
			if(fields[i].name == name && fields[i].level == level && fields[i].index == index){
				return i;
			}
		}
		return -1;
	}
	
	/**
	 * Method: updateDB
	 * Update field in the backend RDBMS TABLE
	 */
	function updateDB(file){
		var names = new SCDatum();
		var values = new SCDatum(); 		
		names.push("record"); 		  
		names.push("all.null");
		names.push("boolean1");
		values.setType(8);
		
		values=system.functions.insert(values, 0, 1, file);
		values=system.functions.insert(values, 0, 1, true);
		values=system.functions.insert(values, 0, 1, true);
		
		//this rad app will have to run in the same thread
		return system.functions.rtecall("callrad", new SCDatum(), "dbdict.sql.changes", names, values, false);
	}
	
	/**
	* Delete old Release Management phases
	*/
	function removeRMPhases(){
		var oldPhases = ["Train", "Back Out", "Closed"];
		var query= "workflowName=\"Release Management\" and tableName=\"cm3r\" and phaseName isin " + funcs.str(oldPhases);
		var phase = new SCFile("WorkflowPhase");
		var rc = phase.doSelect(query);
		
		while(rc == RC_SUCCESS)
		{
		    phase.doDelete();
		    rc = phase.getNext();
		}
	}
	