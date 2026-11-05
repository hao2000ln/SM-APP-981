var logger = getLog('smis_Utils');

function setup_smis_instance(conf_file){

	var conf = readConfFromTxt(conf_file);
	if(!vars.$G_system_info){
		var info = new SCFile("info");
		var RC = info.doSelect("type=\"company\"");
		vars.$G_system_info = info;
	}

	if(!checkCreateAvailable(conf["template"])) {
		logger.info("The SMIS Instance is already created, and not be able to create any more.");
		return 0;
	}

	var smisBuilder = new(lib.smis_InstanceBuilder.getClass())();

	smisBuilder.buildFromTemplate(conf.template,true);
	smisBuilder.confGeneralInfo(conf);
	smisBuilder.confParamInfo(conf);
	smisBuilder.add();

	var intId = smisBuilder.instance['intId'];

//	if(!vars.$G_system_info){
//		system.vars.$G_system_info = new SCFile("info");;
//	}

	//var confItem = lib.smis_ConfigurationManager._getInstanceConfigByIntId(intId);

	//schedule based integration
	// if (conf.category === 'Schedule-based') {
	// 	lib.smis_SchedulerManager.addScheduleRecord(confItem);
	// 	lib.smis_SchedulerManager.addInfoRecord(smisBuilder.instance);
	// }

	// if(confItem.runOnStartup) {
	//
	// 	lib.smis_SchedulerManager.addProcessRecordToStartup(confItem);
	//
	// }

//	else {
//		lib.smis_SchedulerManager.removeProRecordInStartup(confItem);
//	}

	if (conf.runNow === true || conf.runNow === 'true') {
		logger.info('Enable instance... '+intId);
		if(conf.category === 'Schedule-based'){
			print('Schedule-based, start later...');
			sch = new SCFile('schedule');
			sch['class'] = 'Survey_Service_Agent';
			sch['sched.class'] = 'Survey_Service_Agent';
			sch['name'] = conf.name + '_to_be_started';
			sch['expiration'] = funcs.tod();
			sch['javascript'] = 'lib.smis_ConfigurationManager.enableInstance("'+ intId +'")';
			sch.doInsert();
		}
		else {
			lib.smis_ConfigurationManager.enableInstance(intId);
		}
	}
	//lib.smis_ConfigurationManager.disableInstance(intId,true);

	if (conf.template === 'SMtoUCMDB') {
		logger.info('SMtoUCMDB: createRelations');
		lib.createRelations.createRelations();
	}

	return 1;
}


function readConfFromTxt(txt){

	var smoo = readFile(txt, "t");
	smoo = rteJSONParse(smoo);

	return smoo["instance"];
}


function checkCreateAvailable(templatename){

	var maxInst = 1;
	var currInst = 0;

	if(!templatename){
		maxInst = 0;
	}

	var smis_reg = new SCFile("SMISRegistry",SCFILE_READONLY);
	smis_reg.setFields(['instCount']);
	var query = 'name="' + templatename + '"';
	var ret = smis_reg.doSelect(query);

	if(ret == RC_SUCCESS){
		maxInst = smis_reg.instCount;
	}
	else{
		maxInst = 0;
	}

	var smis_conf = new SCFile("SMISConfiguration",SCFILE_READONLY);
	var query2 = 'template="' + templatename + '"';
	currInst = smis_conf.doCount(query2);

	if(currInst >= maxInst){
		return false;
	}

	return true;
}


//setup_smis_instance('C:\\WorkShop\\SM_GIT\\sma-suite\\itsma_v3\\sm\\smoo.txt');
//setup_smis_instance('C:\\WorkShop\\SM_GIT\\sma-suite\\itsma_v3\\sm\\smucmdb.txt');

//lib.smis_ConfigurationManager.enableInstance(6);
