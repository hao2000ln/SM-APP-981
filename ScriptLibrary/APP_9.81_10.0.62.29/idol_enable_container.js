var rad_resetsession = system.functions.resetsession;
var rad_operator = system.functions.operator;
var lib_reportExport = lib.reportExport;

function enable( testParameter)
{
	var idolserverinfo = new SCFile("idolserverinfo");
	changeUserSession("falcon", true)
	if (idolserverinfo.doSelect("true") === RC_SUCCESS) 
	{
		lib.IDOL_EnableKM.enableIDOL(idolserverinfo);
		
		idolserverinfo['enable'] = true;
		idolserverinfo['image.enable'] = true;
		idolserverinfo['server.url'] = "http://smarta-st-proxy-svc:31390/";
		idolserverinfo['default.cfs.url'] = "http://smarta-ss-cfs-svc:7000/";
		idolserverinfo['image.url'] = "http://smarta-ss-imgsvr-svc:18000/";
		idolserverinfo['search.msvc.url'] = "http://smarta-ss-dah-svc:9060/";
	    idolserverinfo['index.msvc.url'] = "http://smarta-ss-dih-svc:31370/";
	    idolserverinfo['installer.msvc.url'] = "http://smarta-installer-svc:8080/";
	    idolserverinfo['config.msvc.url'] = "http://smarta-idolfarm-config-svc:8080/";
	    idolserverinfo['community.url'] = "http://smarta-ss-community-svc:9030/";
	    idolserverinfo['community.service.port'] = 9031;
		idolserverinfo.doSave();
		
		vars['$lo.idol.enabled'] = true;
		vars['$lo.idol.img.enabled'] = true;
		vars['$G.kmsearchengine'] = 'IDOL';
		vars['$is.enable'] = true;
		
		vars['$lo.idol.enabled'] = idolserverinfo['enable'];
		vars['$lo.idol.img.enabled'] = idolserverinfo['image.enable'];
		if (vars['$lo.idol.enabled'] && funcs.lioption('Knowledge Management')){
			vars.$G_kmsearchengine = 'IDOL';
		} else {
			vars.$G_kmsearchengine = null;
		}
		lib.IDOLConfigure.require().clearIDOLServerConfigCache();
		lib.jsaci.clearIDOLServer();
		 //cleanFormat();
        generateSchedule();
        updateSaaTemplate();
	} 
}

function changeUserSession(newOperator, directlyChange) {
    var oriOperator = rad_operator();
    
    if (directlyChange || oriOperator != newOperator) {
        var oldBG = vars['$G.bg'];

        try {
            lib_reportExport.setOpertor(newOperator);
            rad_resetsession();
            lib_reportExport.loginAs(newOperator);
        }
        catch (e) {
            lib_reportExport.setOpertor(oriOperator);
            rad_resetsession();
            lib_reportExport.loginAs(oriOperator);
            vars['$G.bg'] = oldBG;
            print("Changing session failed for user " + newOperator);
        }
        vars['$G.bg'] = oldBG;
    }
}

function cleanFormat()
{
	var sql='syslanguage ~= "en" and (name="idolserverinfo" or name="idolhta.list")';
	var form = new SCFile('format');
	var rc = form.doSelect(sql);
	while (rc == RC_SUCCESS) {
	  form.doDelete();
	  //print(form.name);
	  rc = form.getNext();
	}
}

function generateKMschedule()
{
	var idolserverinfo = new SCFile("idolserverinfo");
	if (idolserverinfo.doSelect("true") === RC_SUCCESS)	{
		//Fix for 2 kmupdate process running issue. 
		//lib.IDOL_EnableKM.triggerScheduler();
		lib.IDOL_SMIS.createSMISInstance('BG', 'IDOL');
		lib.IDOL_SMIS.createSMISInstance('BG', 'AutoFill');
		lib.IDOL_SMIS.createSMISInstance('BG', 'OCR');
	}
}

function generateSchedule() {
    var schedule = new SCFile("schedule");
    var schedulename = "idol_container_enable_schedule";

    schedule._class = "linker";
    var time = new Date();
    var sched = new Date(time.getTime());
    schedule.expiration = sched;

    schedule.name = schedulename;

    var JSStr = "lib.idol_enable_container.generateKMschedule();";
    schedule.javascript = JSStr;

    schedule.doSave();
}

function updateSaaTemplate() {
	var template = new SCFile("idolToolsTemplate");
	if (template.doSelect("name = \"Backup Component\"") === RC_SUCCESS) 
	{
		template.action = "action=BackupServer&path=/var/backup";
		template.doSave();
	}
	
	if (template.doSelect("name = \"Backup Index\"") === RC_SUCCESS) 
	{
		template.action = "indexPort/DREEXPORTIDX?filename=/var/backup/FilePrefix&DatabaseMatch=***&HostDetails=true";
		template.doSave();
	}
	
	if (template.doSelect("name = \"Restore Component\"") === RC_SUCCESS) 
	{
		template.action = "action=RestoreServer&filename=/var/backup/***.zip";
		template.doSave();
	}
	
	if (template.doSelect("name = \"Restore Index\"") === RC_SUCCESS) 
	{
		template.action = "indexPort/DREADD?/var/backup/***.idx&DREDbName=***&CreateDatabase=True";
		template.doSave();
	}
}