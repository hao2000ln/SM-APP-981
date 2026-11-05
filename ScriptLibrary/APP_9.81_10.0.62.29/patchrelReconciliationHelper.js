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

function getReconcileRecFromObj( fUpgObj )
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
	
	if (fRecObj.latest_sig_date==getLatestSigDate( fUpgObj ))
	{
		return fRecObj.version_reconciled;
	}
	
	return null;
}

function setRecordAsReconciled( fUpgResult )
{
	var fUpgObj = new SCFile("patchrelobjects", SCFILE_READONLY);
		
	if (fUpgObj.doSelect("object.name=\"" + parseString(fUpgResult.object_key) + "\"") != RC_SUCCESS)
	{
		return false;
	}
	
	var dtSigDate 	= getLatestSigDate(fUpgObj); 
	var strSigName 	= getLatestSigName(fUpgObj);
	var strVersion;
		
	//updated by Ryan, added content process
    var patchName = fUpgResult.patch_name;
    if( patchName != null && (patchName.indexOf(" ") != -1 || patchName.indexOf("Content_") != -1) )
    {
    	strVersion = patchName;
    }
    else
    {
  		strVersion 	= lib.patchrelHelper.getCurrentVersionString();
  	}
	
	var fRecObj=getReconcileRecFromObj(fUpgObj);
	
	if (fRecObj==null)
	{
		fRecObj = new SCFile("upgreconciliation");
		fRecObj.object_name = fUpgObj.name;
		fRecObj.object_type = fUpgObj.table;
		
		if (fRecObj.doInsert() != RC_SUCCESS)
		{
			return false;
		}
	}	
	
	fRecObj.latest_sig_name = strSigName;
	fRecObj.latest_sig_date = dtSigDate;
	fRecObj.version_reconciled = strVersion;
	
	if (fRecObj.doUpdate() != RC_SUCCESS)
	{
		return false;
	}
	
	fUpgResult.version_reconciled = strVersion;
	fUpgResult.result = "Reconciled";
	
	var rc = fUpgResult.doUpdate(); 
	if (rc !== RC_SUCCESS && rc !== true)
	{
		return false;
	}
	
	return true;
}

function parseString( value )
{
	var strParse = system.functions.strrep(system.functions.str(value), "\"", "\\\"");
	return strParse;
}


/**
 * Mass mark result as reconciled
 *
 * @param {SCFile} result
 * 		parameter <result> should be a list which can be next until it gets last.
 */
function massSetRecordAsReconciled(result)
{
	var succount = 0;
	var failcount = 0;
	var rc = result.getFirst();

	while (rc === RC_SUCCESS || rc === true) 
	{
		if ("Renamed" == result.result)
		{
			if (setRecordAsReconciled(result))
			{
				succount++;
			}
			else
			{
				failcount++;
			}
		}
		rc = result.getNext();
	}
		
	print(system.functions.scmsg("REC_MASS_MARK_RECONCILED", "upg", [succount]));
	if (failcount > 0)
	{
		system.functions.msg(system.functions.scmsg("FAIL_MASS_MARK_RECONCILED", "upg", [failcount]), 3);
	}
	
	//go back to the first record to avoid client navigating to last record
	result.getFirst();	
}