function getBsgLinkQuery(field) {
    var displayName=system.functions.get_display_value(vars.$File, field);
    return getBsgLinkQueryByValue(displayName);
}

function getBsgLinkQueryByValue(displayName) {
    var query = 'type~="bizservice"';
    
    if (vars.$L_file.affected_item != null)
    {    
        query='select d.logical.name, d.sm.device.display.name, d.type, d.subtype, d.current.phase, d.istatus'
        +' from device d inner join cirelationbsg r on (d.logical.name=r.child) where d.type~=\"bizservice\" and r.parent="'+vars.$L_file.affected_item+'" and r.level<='+vars.$G_cilevel;
        
        if (vars['$G.multi'] && vars.$File.company!=null){
            query = query+' and (d.company="'+lib.StringUtil.escapeAllStr(vars.$File.company) +'" or d.company="DEFAULT")'
        }
        
        if (displayName!=null) {
            query = query+' and d.display.name#"'+lib.StringUtil.escapeAllStr(displayName)+'"'    
        }    
    }
    else if (displayName != null)
    {
        query = "display.name#\"" + lib.StringUtil.escapeAllStr(displayName) + "\" and type~=\"bizservice\"";
        if (vars['$G.multi'] && vars.$File.company!=null){
            query = query+' and (d.company="'+lib.StringUtil.escapeAllStr(vars.$File.company) +'" or d.company="DEFAULT")'
        }
    }
    
    return query;
}

function getBsgLinkQueryForArray(field) {
	var logicalNameDis = null;
	var idx = system.functions.cursor_line(1);
	if (idx > 0 && vars.$File[field][idx-1] != null) {	
		var logicalNameDis=vars.$File[field][idx-1];
	}
	
	return getBsgLinkQueryByValue(logicalNameDis);
}


function isValidServiceToCi(service, ci) {
	var device = new SCFile("device", SCFILE_READONLY);
	device.setFields(["logical.name"]);
		
	var result = device.doSelect("logical.name = \"" + ci + "\" and type~=\"bizservice\"");
	var valid = (RC_SUCCESS == result);
	if (valid) {
		var sql = 'parent="'+lib.StringUtil.escapeAllStr(service)+'" and child="'+lib.StringUtil.escapeAllStr(ci)+'" and level<=$G.cilevel';
		valid = lib.c.$('cirelationbsg').count(sql) > 0;
	}
	
	if (!valid) {
		return false;
	}
	
	return true;
}
