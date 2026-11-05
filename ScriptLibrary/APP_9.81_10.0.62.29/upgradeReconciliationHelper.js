function getReconcileRec( fUpgResult )
{
	var fReconcileRec=new SCFile ("upgreconciliation" );
	var rc = fReconcileRec.doSelect("object.name=\"" + parseString(fUpgResult.object_name) + "\"");
	
	if (rc == RC_SUCCESS)
	{
		return fReconcileRec;
	}
	
	return null;
}

function getReconcileRecFromObj ( fUpgObj )
{
	var fReconcileRec=new SCFile("upgreconciliation");
	var rc = fReconcileRec.doSelect("object.name=\"" + parseString(getRecNameFromObj(fUpgObj)) + "\"");
	
	if (rc == RC_SUCCESS)
	{
		return fReconcileRec;
	}
	
	return null;
}

function getRecNameFromObj( fUpgObj )
{
	return fUpgObj[1][0][0];
}

function getLatestSigDate( fUpgObj )
{
	var sigs=fUpgObj.contents;
	
	//the release.date of the first element of the sigs array in the dbdict
	var dtLatest=sigs[0][3][0][2];
	
	var x, length = sigs[0][3].length();
	for (x=0; x < length; x++)
	{ 	
		if (dtLatest < sigs[0][3][x][2])
		{
			dtLatest=sigs[0][3][x][2];
		}
	}
	
	return dtLatest;
}

function getLatestSigName( fUpgObj )
{
	var sigs=fUpgObj.contents;
	
	//the release.date and version of the first element of the sigs array in the dbdict
	var dtLatest=sigs[0][3][0][2];
	var strVersion=sigs[0][3][0][1];
	
    var x, length = sigs[0][3].length();	
	for (x=0; x < length; x++)
	{ 	
		if (dtLatest < sigs[0][3][x][2])
		{
			dtLatest=sigs[0][3][x][2];
			strVersion=sigs[0][3][x][1];
		}
	}
	
	return strVersion;
}

function hasRecordBeenReconciled( fUpgObj )
{	
	var fRecObj=getReconcileRecFromObj( fUpgObj );
	
	if (fRecObj==null)
	{
		return null;
	}
	
	return fRecObj.version_reconciled;
	
}

function setRecordAsReconciled( fUpgResult )
{
	var fUpgObj = lib.upgradeHelper.getTableData("upgradeobjects", "object.name = \"" + lib.upgradeCommonLib.replaceSpecialCharacter(fUpgResult.upgobject_key) + "\"");
	if (fUpgObj != null){
		var strVersion = lib.upgradeVersionUtil.getCurrentVersion();
		fUpgResult.version_reconciled = strVersion;
		fUpgResult.result = "Reconciled";
		var rc = fUpgResult.doUpdate();
		if (rc === RC_SUCCESS || rc === true){
			var fRecObj=getReconcileRecFromObj(fUpgObj);
			if (fRecObj==null)
			{
				fRecObj = new SCFile("upgreconciliation");
				fRecObj.object_name = fUpgObj.name;
				fRecObj.object_type = fUpgObj.table;
				if (fRecObj.doInsert() != RC_SUCCESS)
				{	
					funcs.msg(funcs.scmsg("FAIL_MARK_RECONCILED", "upg", [fUpgResult.object_type, fUpgResult.object_name]), 3);
					return false;
				}
			}
			var strSigName 	= getLatestSigName(fUpgObj);
			var dtSigDate 	= getLatestSigDate(fUpgObj);
			fRecObj.latest_sig_name = strSigName;
			fRecObj.latest_sig_date = dtSigDate;
			fRecObj.version_reconciled = strVersion;
			if (fRecObj.doUpdate() != RC_SUCCESS)
			{
				funcs.msg(funcs.scmsg("FAIL_MARK_RECONCILED", "upg", [fUpgResult.object_type, fUpgResult.object_name]), 3);
				return false;
			}			
			
			print(funcs.scmsg("SUC_MARK_RECONCILED", "upg", [fUpgResult.object_type, fUpgResult.object_name]));
			return true;
		}					
	}
	
	funcs.msg(funcs.scmsg("FAIL_MARK_RECONCILED", "upg", [fUpgResult.object_type, fUpgResult.object_name]), 3);
	return false;
}

function parseString( value )
{
	var strParse = funcs.strrep(funcs.str(value), "\"", "\\\"");
	return strParse;
}

/**
 * The specified parameter <result> should be a list which can be next util it gets last.
*/
function massSetRecordAsReconciled( result )
{
	var succount = 0;
	var failcount = 0;
	var rc = result.getFirst();
	var list = ["Renamed", "Auto Merged", "Previously Reconciled"];
	while(rc === RC_SUCCESS || rc === true){
		if(funcs.index(result.result, list) > 0){
			if(setRecordAsReconciled(result) === true){
				succount++;
			}else{
				failcount++;
			}
		}
		rc = result.getNext();
	}
	print(funcs.scmsg("REC_MASS_MARK_RECONCILED", "upg", [succount]));
	if(failcount > 0){
		funcs.msg(funcs.scmsg("FAIL_MASS_MARK_RECONCILED", "upg", [failcount]), 3);
	}					
	//go back to the first record to avoid client navigating to last record
	result.getFirst();	
}