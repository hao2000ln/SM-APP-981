var $ = lib.c.$;

/**
 * Return all revision file dbdict
 *
 * @return
 *	[ [fileName1, revisionName1], [fileName2, revisionName2], ... ]
 */
function getAllRevisionDbdict()
{
	var list = [];
	
	var datadicts = $("datadict", SCFILE_READONLY).setFields(["name", "revision.file"]).select("true").iterate(function(datadict)
	{
		var name = datadict.name;
		
		// query datadict first
		if (datadict.revision_file)
		{
			list.push([name, datadict.revision_file]);
		}
		else
		{
			// then query Object 
			var object = $("Object", SCFILE_READONLY).setFields(["revision.file"]).select("file.name=\"" + name + "\"").uniqueResult();
			if (object && object.revision_file)
			{
				list.push([name, object.revision_file]);
			}
		}
	});
	
	return list;
}


/**
 * Rebuild all revision dbdicts
 */
function rebuildAllRevisionDbdicts()
{
	var list = getAllRevisionDbdict();
	
	var i;
	for (i = 0; i < list.length; i++)
	{
		var name = list[i][0];
		var revision = list[i][1];
		
		// if revision dbdict not exists, continue
		var rdbdict = $("dbdict", SCFILE_READONLY).select("name=\"" + revision + "\"").uniqueResult();
		if (!rdbdict)
		{
			continue;
		}
		
		rebuildRevisionDbdict(name, revision);
	}
}


/**
 * Rebuild revision dbdict
 * 
 * @param	name, dbdict name
 * @param	revision, revision dbdict name
 */
function rebuildRevisionDbdict(name, revision)
{
	var typeCharacter = lib.DataTypeConst.typeCharacter();
	
	// remove and recreate the revision dbdict
	lib.RAD.run("sm.patchrel.fremove.file", ["names,1"], [revision], [typeCharacter]);
	lib.RAD.run("sm.patchrel.revision.new.dbdict", ["text", "name"], [name, revision], [typeCharacter, typeCharacter]);

	print(system.functions.scmsg(201, "object", ["dbdict", revision]));	
}