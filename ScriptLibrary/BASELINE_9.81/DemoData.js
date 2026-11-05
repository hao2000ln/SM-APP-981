var $ = lib.c.$;
var log = getLog("DemoData");

/**
 * Unload demo data
 *
 * @param {String} path
 * @returns {Number}
 */
function unload(path)
{
	var unloadName = "OutofBoxData";
	var fUnload = $("unload", SCFILE_READONLY).select("name=\"" + unloadName + "\"").uniqueResult();
	
	if (!fUnload)
	{
		print(funcs.scmsg(676, "us", ["unload", unloadName]));
		return -1;
	}
	
	var output = path;
	// if path not set, export to current folder with default name
	if (output == null)
	{
		output = "demodata.unl";
	}
	
	return callrad("us.unload.process", ["name","prompt"], [fUnload, output]);
}


/**
 * Post process after load demo data
 */
function postProcessAfterLoad()
{
	// fix Counters
	log.debug("fix counters");
	lib.BaseUtil.synchronizeCounters();
	
	// fix numbers	
	log.debug("fix number");
	lib.BaseUtil.synchronizeNumbers();

	// migrate legacy groups	
	if (lib.ProcessDesignerEnablement.isRequestEnabled())
	{
		log.debug("enabling assignment group");
		lib.MergeGroupsUtil.DataMigrationForLegacyGroups();
	}
	
	// refresh globallists
	refreshGlobalList();
}


/**
 * Refresh globallist after load demo data
 */
function refreshGlobalList()
{
	// update globallists those filename not null
	$("globallists").selectAll().iterate(function(list)
	{
		if (list.filename == null || list.filename.length == 0)
		{
			return;
		}

		var rc;	
		
		if (list.build_startup)
		{
			// update expiration date if build at startup
			list.expiration = new Date();
			rc = list.doUpdate();
		}
		else
		{
			// rebuild if not build at startup
		    rc = callrad("apm.server.initer", ["names"], [[list.name]]);		
		}
		
		if (rc == RC_SUCCESS)
		{
			log.debug(funcs.scmsg(201, "object", ["globallists", list.name]));
		}
		else
		{
			log.warn(funcs.scmsg(121, "patchrel", ["globallists", list.name]));
		}
		
	});
}


/**
 * Apply demo data background.
 *
 * This function is called through command line.
 */
function applyBackground(path)
{
	// The logic should be same as Process 'demodata.apply'

	if (path == null)
	{
		log.error(funcs.scmsg("25", "us"));
		return;
	}
	if (!funcs.isfileexist(path))
	{
		log.error(funcs.scmsg("875", "us", [path]));
		return;
	}

	// 1. purge old data
	log.info(funcs.scmsg("5", "demodata"));
	callrad("us.unload.delete.wrapper", ["text"], ["PurgeOutofBoxData"]);
	
	// 2. apply demo data
	log.info(funcs.scmsg("6", "demodata"));
	var rc = new SCDatum();
	funcs.rtecall("trigger", rc, 0);
	funcs.rtecall("counter", rc, 0);
	callrad("file.load", ["name", "text"], [path, "none"]);
	funcs.rtecall("trigger", rc, 1);
	funcs.rtecall("counter", rc, 1);
	
	// 3. post process
	postProcessAfterLoad();

	log.info(funcs.scmsg("2", "demodata"));
}
