var CONSTANT = lib.IDOL_Constant,
	ExceptionLib = lib.IDOLCategoryException,
	CategoryUtilLib = lib.IDOLCategoryUtil;

/* Add rule base to IDOL*/
function addRuleBase(id,oldrulses) {
	ExceptionLib.setLastRuleBaseException(null);
	var isfine = lib.jsaci.checkCategoryStatus(id);
	if(isfine == false) {
		ExceptionLib.setLastRuleBaseException("IDOL server is not ready or special category is not existing!");
		return false;
	}

	var fcate = new SCFile(CONSTANT.getCategoryFileName());
	var rc = fcate.doSelect("id="+id);
	if(rc != RC_SUCCESS) {
		myPrint("category which id is "+id +" is not existing now");
		ExceptionLib.setLastRuleBaseException("can't find category information in database");
		return false ;
	}
	
	var prefix = getRuleBaseField(fcate.groupid);
	if(prefix == "") {
		ExceptionLib.setLastRuleBaseException("Rule base field is empty!");
		return false;
	}
	var oldrules = "";
	var strrules ="";
	var i = 0;
	var isokay = true;
	if(fcate.rulebase != null) {
		var rules = fcate.rulebase.toArray();
		for(i=0; i<rules.length; i++) {
			if(rules[i] != null && rules[i] != "") {
				if(strrules != "") {
					strrules += ",";
				}
				strrules += encodeForRuleBase(prefix + "_" + rules[i] + "2");
			}
		}
	}
	for(i = 0; oldrulses != null && oldrulses != undefined && i < oldrulses.length; i++) {
		if(oldrulses[i] != null && oldrulses[i] != "") {
			if(oldrules != "") {
				oldrules += ",";
			}
			oldrules += oldrulses[i];
		}
	}

	if( strrules != "") {
		isokay = lib.jsaci.setBooleanTraining(id,strrules);
	} else if( oldrules != "" ) {
		isokay = lib.jsaci.setBooleanTraining(id,"*");
	}
	
	if(isokay == false) {
		ExceptionLib.setLastRuleBaseException("Fail to connect IDOL server or parameter error!");
	}
	return isokay;
}

/* Get rule base primary field defined in adapter*/
function getRuleBaseField(id) {
	var f = new SCFile(CONSTANT.getCategoryConfigFileName());
	var rc = f.doSelect("adapter.id=" + id);
	var str = "";
	
	if(rc == RC_SUCCESS && f.rule_field != null && f.rule_field != "") {
		str = f.rule_field.toString();
		var ar = str.split(";");
		var getfile = ar[ar.length - 2].replace(/\./g,"_");
		var getfield = ar[ar.length - 1].replace(/\./g,"_");
		str = getfile + "_" + getfield;
	}
	return str;
}

/* Get the value from query statements configured in adapter */
function getRuleBaseValue(file, strlink) {
  //incidents;callback.contact;contacts;contact.name;contacts;location;location;location;location;city
  //incidents;contact.name;contacts;contact.name;contacts;city
  //incidents;priority.code
	var ar = strlink.split(";");
	var strquery = "";
	if(ar != null && ar.length>5)
	{
		var field = ar[1].replace(/\./g, "_");
		var value = file[field];
		if(value == null || value == "")
		{
			return "";
		}
		strquery = ar[3] + "=\"" + value + "\"";
		var f = new SCFile(ar[4], SCFILE_READONLY);
		var rc = f.doSelect(strquery);
		if(rc == RC_SUCCESS)
		{
			var getfiled = ar[5].replace(/\./g, "_");
			var givenvalue = f[getfiled];
			if(givenvalue == null || givenvalue == "")
			{
				return "";
			}
			var getfile = ar[4].replace(/\./g, "_");
			if(ar.length == 6)
			{
				return encodeForRuleBase(getfile + "_" + getfiled + "_" + givenvalue + "2");
			}
			var f2 = new SCFile(ar[6], SCFILE_READONLY);
			rc = f2.doSelect(ar[7] + "=\"" + givenvalue + "\"");
			if(rc == RC_SUCCESS)
			{
				getfiled = ar[9].replace(/\./g, "_");
				givenvalue = f2[getfiled];
				if(givenvalue == null || givenvalue == "")
				{
					return "";
				}
				getfile = ar[8].replace(/\./g, "_");
				return encodeForRuleBase(getfile + "_" + getfiled + "_" + givenvalue + "2");
			}
		}
    
	}
	else if(ar != null && ar.length == 2)
	{
		var getfile = ar[0].replace(/\./g, "_");
		var ownfiled = ar[1].replace(/\./g, "_");
		var ownvalue = file[ownfiled];
		if(ownvalue != null && ownvalue != "" )
		{
			return encodeForRuleBase(getfile + "_" + ownfiled + "_" + ownvalue+"2");
		}
	}
  
	return "";
}

function encodeForRuleBase(value) {
	if(value == "" || value == null) {
		return "";
	}
	
	var newvalue = encodeURIComponent(value);
	newvalue = newvalue.replace(/%/g,"");
	if(newvalue.length> 20) {
		newvalue = newvalue.substring(newvalue.length - 20,newvalue.length);
	}
	return newvalue;
  
}