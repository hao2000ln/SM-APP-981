
function getPossibleStatusValues(currentStatus)
{
	var statusValues = ["Analysis","Design","Develop","Authorized","Retiring","Retired"];
	var startIndex = 0;
	for (var i=0;i<statusValues.length;++i)
	{
		if(currentStatus == statusValues[i])
			startIndex = i ;	
	}	
	for(var i=startIndex;i<statusValues.length;++i)
	{
		system.vars.$possible_status_value=system.functions.insert(system.vars.$possible_status_value,0,1,statusValues[i]);
		var displayName = system.functions.scmsg(statusValues[i],"baseline");
		system.vars.$possible_status_name=system.functions.insert(system.vars.$possible_status_name,0,1,displayName);
	}	
}

function getInitStatus()
{
	return "Analysis";
}

function canChangeAttributes(record)
{
	if(record.status == "Analysis" || record.status == "Design" || record.status == "Develop")
	{
		return true;
	} 
	else return false;
}

function canRetire(baseline)
{	
	//look to see if there is any ci associated with this baseline
	var device = new SCFile("device");
	var deviceSql = "baseline=\""+baseline.name+"\" and baseline.version=\""+baseline.version+"\"";
	var rc = device.doSelect(deviceSql);
	if (rc == RC_SUCCESS)
		return false;
	else return true;	
}

/**
get the CI type by query devtype table
**/
function getTableNameViaType(ciType){
	var devtype=new SCFile("devtype");
	devtype.doSelect("device.type=\"" + ciType + "\" and active=true");
	var fileType="device";
	if(devtype.joindef!=null && devtype.joindef!=""){
		fileType=devtype.joindef;
	}
	return fileType;
}

function getJoinFileName(devtypeName)
{
	var devtype = new SCFile("devtype");
	var devtypeSql = "device.name=\""+devtypeName+"\" and active=true";
	var rc= devtype.doSelect(devtypeSql);
	return devtype.joindef;
}

function getDeviceType(joinFileName)
{
	if(joinFileName==null || joinFileName=="" || joinFileName=="device")
		return "";
	var devtype = new SCFile("devtype");
	var devtypeSql = "joindef=\""+joinFileName+"\" and active=true";
	var rc= devtype.doSelect(devtypeSql);
	return devtype.device_name;
}

function convertFieldName(fieldName)
{
	fieldName = system.functions.denull(fieldName);
	for(var i=0;i<fieldName.length();++i)
	{
		if(fieldName[i].indexOf(",") <=0)
			continue;
		else 
		{
			fieldName[i] =fieldName[i].substring(fieldName[i].indexOf(",")+1);
		}	
	}
	return fieldName;	
}

function getFileName(fieldName,joinFileName)
{

	if(joinFileName == "device")
		return "device";
		
	if(fieldName.indexOf(",") >0)
		fieldName = fieldName.substring(fieldName.indexOf(",")+1);
		
	var dbdict = new SCFile("dbdict");
	var dbdictSql = "name=\"device\"";	
	var rc = dbdict.doSelect(dbdictSql);
	for (var i=0;i<dbdict.field.length();++i)
	{
		if (dbdict.field[i].name == fieldName)
			return "device";
	}
		
	var devtype = new SCFile("devtype");
	var devtypeSql = "joindef=\""+joinFileName+"\" and active=true";
	var rc= devtype.doSelect(devtypeSql);
	return devtype.attr_file;
}

function getJoinNamesAndCaptions()
{
	var def = new SCFile("joindefs");
	var defSql = "join.name=\""+(vars.$this_filename)+"\"";
	var rc = def.doSelect(defSql);
 
	if (rc == RC_SUCCESS)
	{
		vars.$bl_field_names=def.field_names;
		vars.$bl_field_captions=def.field_captions; 		
	}
}

function getAllOtherCITypes(type)
{
	var temp = type;
	
 	var allOtherCITypes = new SCDatum();
	allOtherCITypes.setType(8);
 		
	var ciTypeRecord = new SCFile("devtype", SCFILE_READONLY);
	ciTypeRecord.setFields("device.type");
	var rc = ciTypeRecord.doSelect("true");
	if(rc === RC_SUCCESS){
		do{
			if(system.functions.index(ciTypeRecord["device.type"], temp) === 0) {
				allOtherCITypes.push(ciTypeRecord["device.type"]);
			}
		} while (ciTypeRecord.getNext() === RC_SUCCESS);
	}
	
	return allOtherCITypes;
}