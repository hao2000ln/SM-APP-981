/*
 * these datadict are special, 
 * need to change unique key of dbdict instead of datadict
 */
var excludeDatadictList = ["computerprintersuniq", "outage"];


/**
 * synchronize unique key of datadict
 */
function synchronizeDatadictUniqueKey(bUpdate)
{
	lib.upgradeLog.upgrade("Synchronizing unique key of datadict...");
	lib.upgradeLog.detail("Synchronizing unique key of datadict ...");
	
	var count = 0;
	var fDbdict = new SCFile("dbdict", SCFILE_READONLY);
  	fDbdict.setFields(["name","key"]);
	var rc = fDbdict.doSelect("true");
	
	while (rc == RC_SUCCESS)
	{
		var name = fDbdict.name;
		
		// query datadict
		var fDatadict = new SCFile("datadict");
		var rc2 = fDatadict.doSelect("name=\"" + name + "\"");

		if (rc2 == RC_SUCCESS)
		{
			var key = getUniqueKey(fDbdict);
			
			// correct the key value if dbdict and datadict are not same		
			if (!sameKey(key, fDatadict.unique_key) && system.functions.index(name, excludeDatadictList)<=0)
			{
				count++;
				
				if (bUpdate)
				{
					lib.upgradeLog.detail("Update datadict "+name);
					lib.upgradeLog.detail(name + ": " + "dbdict key - {" + key.toArray() + "}, datadict key - {" + fDatadict.unique_key.toArray() + "}");
					fDatadict.unique_key = key;
					var rcDatadict = fDatadict.doUpdate();		
				}
				else
				{
					print(name + ": " + "dbdict key - {" + key.toArray() + "}, datadict key - {" + fDatadict.unique_key.toArray() + "}");					
				}
			}
		}
		
		rc = fDbdict.getNext();
	}
	
	return count;
}


/**
 * synchronize unique key of object
 */
function synchronizeObjectUniqueKey(bUpdate)
{
	lib.upgradeLog.upgrade("Synchronizing unique key of Object...");
	lib.upgradeLog.detail("Synchronizing unique key of Object ...");
	
	var count = 0;
	var fObject = new SCFile("Object");
	var rc = fObject.doSelect("true");
	
	while (rc == RC_SUCCESS)
	{
		var name = fObject.file_name;
		
		// query datadict
		var fDatadict = new SCFile("datadict", SCFILE_READONLY);
	  	fDatadict.setFields(["unique.key"]);
		var rc2 = fDatadict.doSelect("name=\"" + name + "\"");

		if (rc2 == RC_SUCCESS)
		{
			var key = fDatadict.unique_key;
			
			// correct the key value if Object and datadict are not same		
			if (!sameKey(fObject.unique_field, key))
			{
				// sometimes dbdict/datadict has no unique key
				if (key != null && key.length() > 0)
				{
					count++;
					
					if (bUpdate)
					{
						lib.upgradeLog.detail("Update Object "+name);
						lib.upgradeLog.detail(name + ": " + "Object key - {" + fObject.unique_field.toArray() + "}, datadict key - {" + key.toArray() + "}");
						fObject.unique_field = key;				
						var rcObject = fObject.doUpdate();			
					}
					else
					{
						print(name + ": " + "Object key - {" + fObject.unique_field.toArray() + "}, datadict key - {" + key.toArray() + "}");					
					}
				}
			}
		}
		
		rc = fObject.getNext();
	}
	
	return count;
}


/**
 * get unique key of dbdict
 */
function getUniqueKey(dbdict)
{
	var keys = dbdict.key;
	var ukey = null;
	var i;	
	
	for (i = 0; i < keys.length(); i++)
	{
		var key = keys[i];
		
		// primary key
		if (key[0] == 28)
		{
			ukey = key[1];
			break;
		}
			
		// first unique key
		if (key[0] == 12 && ukey == null)
		{
			ukey = key[1];
		}
	}
	
	return ukey;
}

/**
 * determine whether 2 keys are same
 */
function sameKey(key1, key2)
{
	if (key1 == null && key2 == null)
	{
		return true;
	}

	if ((key1 == null && key2.length() == 0) || (key2 == null && key1.length() == 0))
	{
		return true;
	}
		
	if (key1 == null || key2 == null)
	{
		return false;
	}
		
	var lng = key1.length();
	if (lng != key2.length())
	{
		return false;
	}

	var i;		
	for (i = 0; i < lng; i++)
	{
		if (key1[i] != key2[i])
		{
			return false;
		}
	}
	
	return true;
}