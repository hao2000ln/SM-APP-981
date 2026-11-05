var $ = lib.c.$;
var forceObject = lib.ProcessDesignerEnablementUtil.forceObject;
var getIconForPDMenu = lib.ProcessDesignerEnablementUtil.getIconForPDMenu;

/**
 * Contants
 */
// the suffix used by PD temp records before enabling
var PDTMP_SUFFIX = "_for_pd4_tobe_used";
var PDTMP_SUFFIX_SHORT = "_for_pd4";
// the suffix used by legacy records after enabling
var LEGACY_SUFFIX = "_disabled_by_PDHD";
var LEGACY_SUFFIX_SHORT = "_disabled";

// Object constant
var OBJECT_NAMES = new Array("cm3r","cm3t");
// Process constant
var PROCESS_NAMES = new Array("cm.open", "cm.open.save", "cm.update");

// Links related to category/subcategory/area
var PHASE_RELATED_LINKS = new Array("cm3rcatphase.main","cm3tcphs.main");
var PHASE_RELATED_LINKLINES = new Array("dflt.reviewers");

// Menu constant
var TOP_MENUS= new Array("ADMIN","APPROVER GEN","HELPDESK GEN","HOME","ICM GEN","IM GEN","PM GEN","CM GEN","CM SETUP");
// the descriptions and menu name of PD menu
// TODO, question: how menu do L10N? whether it is safe to use menu description field here?
var PD_MENU_DESCS = new Array("Change Management");
var PD_MENU_NAMES = new Array("ChM PD");
var PD_MENU_CONDS = new Array();
PD_MENU_CONDS.push("lioption(\"Change Management\") and not  (null(contents($G.cm3r.environment))) or not  (null(contents($G.cm3t.environment)))");

// the ENV related menu items
var ENV_MENU_ITEM_DESCS = new Array("Change Management Request Environment", "Change Management Task Environment");
// the prefix for legacy menu description after enabling
var LEGACY_MENU_PREFIX = "Legacy ";
// the ENV related menu items
var PROFILE_MENU_ITEM_DESCS = new Array("Change Management Profiles");

/**
 * Inbox constant
 */

var ENABLE_QUEUE_OPERATION_UPDATE = "update";
var ENABLE_QUEUE_OPERATION_DELETE = "delete";
var ENABLE_QUEUE_OPERATION_ADD = "add";
var ENABLE_QUEUE_OPERATION_REPLACE = "replace";
var ENABLE_QUEUES = new Array();
ENABLE_QUEUES.push(["All Open Changes", ENABLE_QUEUE_OPERATION_ADD, ["inbox.name","short.query"], ["All Open Change Proposals",'open=true and category="Change Proposal"']]);
var ENABLE_CM_EXTACCESS = 
[
  {
  "serviceName":"ChangeManagement",
  "name":"cm3r",
  "objectName":"Change",
  "modifiedAllowedActions":["nextphase","close"],
  "actionType":["",""],
  "executeActions":["ChM.nextChangePhase","ChM.closeChange"],
  "addedField":["header,changeModel","change.owner","effect.not.impl","description.structure,plan","backout.plan","build.test.plan","build.test.result","implementationStart","implementationEnd","description.structure,implementationComments","pir.review","build.test.required","cust.visible","update.type","update.action","middle,backout.comments"],
  "addedCaption":["ChangeModel","ChangeOwner","EffectOfNotImplementing","ImplementationPlan","BackOutPlan","BuildTestPlan","BuildTestResult","ImplementationStart","ImplementationEnd","ImplementationComments","ReviewResults","BuildTestRequired","CustomerVisible","UpdateType","UpdateAction","BackOutComments"],
  "addedType":["","","","","","","","DateTimeType","DateTimeType","","","BooleanType","BooleanType","","",""],
  "modifiedExpression":[]
  },
  {
  "serviceName":"ChangeManagement",
  "name":"cm3r",
  "objectName":"ChangeIIA",
  "modifiedAllowedActions":["add","close","nextphase"],
  "actionType":["create","",""],
  "executeActions":["ChM.createRecord","ChM.closeChange","ChM.nextChangePhase"],
  "addedField":[],
  "modifiedExpression":[]
  },
  {
  "serviceName":"ChangeManagement",
  "name":"cm3r",
  "objectName":"ChangeRC",
  "modifiedAllowedActions":["add","close","nextphase"],
  "actionType":["create","",""],
  "executeActions":["ChM.createRecord","ChM.closeChange","ChM.nextChangePhase"],
  "addedField":["header,changeModel","change.owner","effect.not.impl","description.structure,plan","backout.plan","build.test.plan","build.test.result","description.structure,implementationComments","pir.review","build.test.required","cust.visible","update.type","update.action","middle,backout.comments"],
  "addedCaption":["ChangeModel","ChangeOwner","EffectOfNotImplementing","ImplementationPlan","BackOutPlan","BuildTestPlan","BuildTestResult","ImplementationComments","ReviewResults","BuildTestRequired","CustomerVisible","UpdateType","UpdateAction","BackOutComments"],
  "addedType":["","","","","","","","","","BooleanType","BooleanType","","",""],
  "modifiedExpression":["if ($L.bg.action=\"save\" and current.phase in $L.file=\"Post Implementation Review\" and null(pir.review in $L.file)) then (pir.review in $L.file={\"Please update the review comments\"})","if ($L.bg.action=\"save\" and (current.phase in $L.file=\"Implementation\" or current.phase in $L.file=\"Deployment\" or current.phase in $L.file=\"Execution\") and null(implementationComments in $L.file)) then (implementationComments in $L.file={\"Please update the Implementation comments\"})"]
  },
  {
  "serviceName":"ChangeManagement",
  "name":"cm3t",
  "objectName":"ChangeTask",
  "modifiedAllowedActions":["add","close","nextphase"],
  "actionType":["","",""],
  "executeActions":["ChM.createRecord","ChM.closeTask","ChM.nextTaskPhase"],
  "addedField":[],
  "addedCaption":[],
  "addedType":[],
  "modifiedExpression":[]
  },
  {
  "serviceName":"ChangeManagement",
  "name":"cm3t",
  "objectName":"ChangeTaskRC",
  "modifiedAllowedActions":["add","close","nextphase"],
  "actionType":["","",""],
  "executeActions":["ChM.createRecord","ChM.closeTask","ChM.nextTaskPhase"],
  "addedField":[],
  "addedCaption":[],
  "addedType":[],
  "modifiedExpression":["if ($L.bg.action=\"save\" and current.phase in $L.file=\"Review\" and null(review.comments in $L.file)) then (review.comments in $L.file={\"Please update the review comments\"})"]
  }
];
var ENABLE_CM_DATADICT_DEFAULTFORMAT = 
[
  {
  "name":"cm3rcatphase",
  "defaultfmt":"chm.cm3rcatphase.main.g"
  },
  {
  "name":"cm3tcatphase",
  "defaultfmt":"chm.cm3tcphs.main.g"
  }
];

var BAK_RECORD_SUFFIX="_bak_by_PD";

//PD change categories--cm3rcategory

var PD_CHM_CATEGOTY = 
[
  {
  "name":"Emergency Change",
  "description":"",
  "availcond":"true",
  "workflow":"Emergency",
  "assignnumber":"true",
  "phases":["Abandoned","Backout","Build and Test","Closure","ECAB Approval","Implementation","Post Implementation Review","Registration and Categorization","Risk and Impact Analysis"]
  },
  {
  "name":"Normal Change",
  "description":"Normal Change",
  "availcond":"true",
  "workflow":"Normal",
  "assignnumber":"true",
  "phases":["Abandoned","Backout","Build and Test","Closure","CMDB Update","DCAB Approval","Deployment","Post Implementation Review","Registration and Categorization","Risk and Impact Analysis","TCAB Approval","Validation"]
  },
  {
  "name":"Standard Change",
  "description":"Pre-approved low risk/common change",
  "availcond":"true",
  "workflow":"Standard Change",
  "assignnumber":"true",
  "phases":["Abandoned","Authorization (CAB)","Backout","Closure","Execution","Plan and Schedule","Post Implementation Review","Registration and Categorization"]
  },
  {
  "name":"Change Proposal",
  "description":"Change Proposal",
  "availcond":"true",
  "workflow":"Change Proposal",
  "assignnumber":"true",
  "phases":["Abandoned","Authorization (CAB)","Closure","Project Initiation","Registration and Categorization","Risk and Impact Analysis"]
  }
];
//PD change category related subcategories--cm3rsubcat
var PD_CHM_SUBCATEGOTY = 
[
  {
  "category":"Emergency Change",
  "subcategory":["Emergency"],
  "description":[""]
  },
  {
  "category":"Normal Change",
  "subcategory":["Major","Minor"],
  "description":["",""]
  },
  {
  "category":"Standard Change",
  "subcategory":["Hardware","Maintenance","Network","Routine Jobs","Software","User Admin Requests"],
  "description":["Hardware","Maintenance","Network","Routine Jobs","Software","User Admin Requests"]
  },
  {
  "category":"Change Proposal",
  "subcategory":["Change Proposal"],
  "description":["Change Proposal"]
  }
];
//PD change phases--cm3rcatphase
var PD_CHM_PHASE = 
[
  {
  "name":"Abandoned",
  "clscontrol":null 
  },
  {
  "name":"Backout",
  "clscontrol":null 
  },  
  {
  "name":"Closure",
  "clscontrol":null 
  },
  {
  "name":"ECAB Approval",
  "clscontrol":null 
  },
  {
  "name":"Implementation",
  "clscontrol":null 
  },
  {
  "name":"Post Implementation Review",
  "clscontrol":null 
  },
  {
  "name":"Registration and Categorization",
  "clscontrol":"approval.status in $L.file=\"approved\""
  },
  {
  "name":"Risk and Impact Analysis",
  "clscontrol":"approval.status in $L.file=\"approved\""
  },
  {
  "name":"CMDB Update",
  "clscontrol":null 
  },
  {
  "name":"DCAB Approval",
  "clscontrol":null 
  },
  {
  "name":"Deployment",
  "clscontrol":"approval.status in $L.file=\"approved\""
  },
  {
  "name":"TCAB Approval",
  "clscontrol":null 
  },
  {
  "name":"Validation",
  "clscontrol":"approval.status in $L.file=\"approved\""
  },
  {
  "name":"Execution",
  "clscontrol":null
  },
  {
  "name":"Plan and Schedule",
  "clscontrol":"approval.status in $L.file=\"approved\""
  },
  {
  "name":"Project Initiation",
  "clscontrol":null
  },
  {
  "name":"Authorization (CAB)",
  "clscontrol":null
  }
];

//PD change task phases--cm3tcatphase
var PD_CHM_TASK_PHASE = 
[
  {
  "name":"Abandoned",
  "appcontrol":null
  },
  {
  "name":"Active",
  "appcontrol":"open in $L.file=true or index(\"SysAdmin\", $lo.ucapex)>0 or index(\"ChMAdmin\", $lo.ucapex)>0"
  },
  {
  "name":"Cancelled",
  "appcontrol":"open in $L.file=true or index(\"SysAdmin\", $lo.ucapex)>0 or index(\"ChMAdmin\", $lo.ucapex)>0"
  },
  {
  "name":"Closed",
  "appcontrol":null
  },
  {
  "name":"Review",
  "appcontrol":"open in $L.file=true or index(\"SysAdmin\", $lo.ucapex)>0 or index(\"ChMAdmin\", $lo.ucapex)>0"
  },
  {
  "name":"Waiting",
  "appcontrol":"open in $L.file=true or index(\"SysAdmin\", $lo.ucapex)>0 or index(\"ChMAdmin\", $lo.ucapex)>0"
  }
]

//PD change task categories--cm3tcategory
//PD change task available change phases(request.phases)--cm3tcategory
var PD_CHMTASK_CATEGOTY = 
[
  {
  "category":"Build and Test",
  "description":"Generic task to perform Build and Test",
  "availcond":"true",
  "workflow":"Generic Task",
  "assignnumber":"true",
  "avaichmphase":["Build and Test","Execution"]
  },
  {
  "category":"Change Backout activity",
  "description":"Generic task to perform Change backout",
  "availcond":"true",
  "workflow":"Generic Task",
  "assignnumber":"true",
  "avaichmphase":["Back Out","Backout"]
  },
  {
  "category":"Change Execution",
  "description":"Generic task for executing Change",
  "availcond":"true",
  "workflow":"Generic Task",
  "assignnumber":"true",
  "avaichmphase":["Execution","Post Implementation Review"]  // added "Post Implementation Review" for merging legacy task planner data into common task planner
  },
  {
  "category":"CMDB Update",
  "description":"Generic task to update CMDB",
  "availcond":"true",
  "workflow":"Generic Task",
  "assignnumber":"true",
  "avaichmphase":["CMDB Update","Implementation","Execution"]
  },
  {
  "category":"Deployment activity",
  "description":"Generic task to perform Deployment",
  "availcond":"true",
  "workflow":"Generic Task",
  "assignnumber":"true",
  "avaichmphase":["Deployment"]
  },
  {
  "category":"Implementation activity",
  "description":"Generic task to perform Implementation",
  "availcond":"true",
  "workflow":"Generic Task",
  "assignnumber":"true",
  "avaichmphase":["Implementation"]
  },
  {
  "category":"PIR",
  "description":"Generic task to perform Review(PIR)",
  "availcond":"true",
  "workflow":"Generic Task",
  "assignnumber":"true",
  "avaichmphase":["Post Implementation Review"]
  },
  {
  "category":"Planning and Schedule",
  "description":"Generic task to perform Plan Schedule",
  "availcond":"true",
  "workflow":"Generic Task",
  "assignnumber":"true",
  "avaichmphase":["Risk and Impact Analysis","Plan and Schedule","Execution"] // added "Execution" for merging legacy task planner data into common task planner
  },
  {
  "category":"Risk and Impact Analysis",
  "description":"Generic task to perform Risk and Impact",
  "availcond":"true",
  "workflow":"Generic Task",
  "assignnumber":"true",
  "avaichmphase":["Risk and Impact Analysis","Plan and Schedule"]
  }
];

//PD Change datadict - cm3r
var DATADICT_CM3R = [
      {
            "fieldName":"current.phase",
            "attributes":["globallist"],
            "values":["Change Local WorkflowPhases"]
      },
      {
            "fieldName":"backout.plan",
            "attributes":["captions"],
            "values":["Remediation Plan"]
      },
      {
            "fieldName":"backout.method",
            "attributes":["captions"],
            "values":["Remediation Method"]
      },
      {
            "fieldName":"backout.comments",
            "attributes":["captions"],
            "values":["Remediation Comments"]
      }
 
];

//PD cm3r datadict
var datadictCaptionAndUsage=
[
  {
  "datadictName":"cm3r",
  "fieldName":["affected.item","reviewer.class","closing.comments","plan","foreign.id","orig.date.entered","planned.end","planned.start","reason","requested.by","sla.alert1","sla.deadline","sla.target","actual.outage.end","actual.outage.start","assets","ci.down","next.breach","sla.breach","svc.options","tpconflict"],
  "caption":["","Reviewers","Closing/Closure Comments","Implementation Plan","Ext. Project Ref.","Open Time","Scheduled Implementation End","Scheduled Implementation Start","Reason for Change","Change Requester","SLT Alert1","SLT Deadline","SLT Target Date","Actual Downtime End","Actual Downtime Start","Affected Configuration Item","Configuration Item(s) Down","Next Expiration","SLT Breached","User Options","Timeperiod Conflict Flag"],
  "usage":[3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  }
];

/**
 * Replace or delete a record
 */
function enableReplaced() {
	// 2. enable the Objects, 
    enableObjects();
    
    //Processes
    //enableProcesses();
}

/**
 * Update the current record directly
 */
function enableUpdated() {
	
	// transform searchConfig for cm3r
	enableSearchConfig();
	
	// update datadict
	enableDatadict();
	
	// 3. add PD sub-menus to 9 tops menus
    enableMenus();
    
    // 17. extaccess
    enableCMExtaccesses();
    
    
    //Change Templates
    enableChgTemplate();
    
    //Pick the PD format when user clicks "Addl phase info" from web client workflow phase
    enableCMCategoryForm();
    
    //Upgrade PD change categories before calling lib.processDesignerChangeUpgrade.upgradeCategories();
    upgradePDChangeCategories();
    
      // 9. SLA
    enableSLA();
    
    //auto crate workflow for legacy category
  	var ret = 0;
    try{ 
        system.functions.rtecall("trigger", ret, 1);               
      	lib.processDesignerChangeUpgrade.deleteUnplannedClosedPhase();    
      	lib.processDesignerChangeUpgrade.specialFix4ChangeApproval(); 
  	}
  	catch(e)
  	{
     	print("Error in Change enablement.");
      	print(e.toString()); 
       	system.functions.rtecall("trigger", ret, 1);    
  	} 
  	
  	 // 19. Security
    enableSecurity();
    // 5. inbox
    enableInboxes();
    
    enableLinks();
    
}

/**
 * Main method of enabling the Change Management Module.
 */
function enableChangeManagement() {
    print("Start enabling PD Change Management module...");

    // 1. check whether PD already enabled
    if(checkEnabled()) {
        print("The PD Change Management has already been enabled, ignore current enable process!");
        return;
    }
    
    // replace or delete or add a record
    enableReplaced();
    // update a record
    enableUpdated();

    print("Finish enabling PD Change management module");
}

function checkEnabled() {
    // TODO, currently we only check whether the cm3r Object is enabled or not.
    var pdTmpProbsummaryObjectName = "cm3r" + PDTMP_SUFFIX;
    var objectList = new SCFile("Object");
  var querySQL = "file.name=\"" + pdTmpProbsummaryObjectName + "\"";
  print("Query SQL for check enabled:" + querySQL);
  if (objectList.doSelect(querySQL) == RC_SUCCESS) {
    return false;
  } else {
    return true;
  }
    return false;
}

function enableObjects() {
    print("Start enabling Objects...");
    replaceRecords(OBJECT_NAMES, "Object", "file.name");
    print("Finish enabling Objects");
}

function enableProcesses() {
    print("Start enabling Processes...");
    replaceRecords(PROCESS_NAMES, "Process", "process");
    print("Finish enabling Processes");
}

function enableMenus() {
  print("Start enabling Menus for Change Module...");
  for(var i=0; i<TOP_MENUS.length; i++) {
        print("Enabling Top Menu \"" + TOP_MENUS[i] + "\"...");
        var topMenu = new SCFile("menu");
    var topMenuQuerySQL = "name=\"" + TOP_MENUS[i] + "\"";

    if (topMenu.doSelect(topMenuQuerySQL) == RC_SUCCESS) {
          if(null!=topMenu.description) {
            // duplicate the original top menu
        var oldTopMenu = new SCFile("menu");
        system.vars.$L_void=system.functions.fduplicate(oldTopMenu, topMenu);

            for(var j=0; j<topMenu.description.length(); j++) {
              for(var k=0; k<PD_MENU_DESCS.length; k++) {
                if(topMenu.description[j] == PD_MENU_DESCS[k]) {
                  print("Update menu \"" + topMenu.description[j] + "\"");
                topMenu.group[j] = null;
                topMenu.command[j] = null;
                topMenu.application[j] = "menu.manager";
                topMenu.pname[j] = "name";
                topMenu.pvalue[j] = PD_MENU_NAMES[k];
                topMenu.thread[j] = null;
                topMenu.condition[j] = PD_MENU_CONDS[k];
                if("CM GEN"==topMenu.name){
                  topMenu.condition[j] = "true";
                }
                topMenu.icon[j] = getIconForPDMenu(topMenu.description[j]);
              }
            }
          }
          if("CM SETUP"==topMenu.name){
                topMenu.name="CM SETUP LEGACY";
            }
            topMenu.doUpdate();
            addSMPatches(topMenu, oldTopMenu, "menu;" + topMenu.name, "update");
          }

          print("Enabled top menu \"" + TOP_MENUS[i] + "\" for Change Module.");
    } else {
        // Ignore it if the top menu does not exist
      print("Can not find the top menu, ignore the enabling for top menu \"" + TOP_MENUS[i] + "\"!");
    }
    }

    print("Removing the Change and Change Task ENV menu items under \"System Administration->Onging Maintenance-> Environment Records\"...");
    // find the menu "ENV RECORDS", and remove the PD help desk related menus.
    
    var envMenu = new SCFile("menu");
  var envMenuQuerySQL = "name=\"ENV RECORDS\"";
  if (envMenu.doSelect(envMenuQuerySQL) == RC_SUCCESS) {
    // duplicate the original env menu
    var oldEnvMenu = new SCFile("menu");
    system.vars.$L_void=system.functions.fduplicate(oldEnvMenu, envMenu);

    for(var j=envMenu.description.length()-1; j>=0; j--) {
        if(lib.ArrayUtil.indexOf(ENV_MENU_ITEM_DESCS, envMenu.description[j])>=0) {
          print("Remove Menu Item \"" + envMenu.description[j]);
            envMenu.option[j] = null;
            envMenu.group[j] = null;
            envMenu.description[j] = null;
            envMenu.command[j] = null;
            envMenu.application[j] = null;
            envMenu.pname[j] = null;
            envMenu.pvalue[j] = null;
            envMenu.thread[j] = null;
            envMenu.condition[j] = null;
            envMenu.system[j] = null;
        }
      }
      envMenu.doUpdate();
      addSMPatches(envMenu, oldEnvMenu, "menu;" + envMenu.name, "update");
  } else {
    print("Can not find the menu \"ENV RECORDS\", ignore the removing\"!");
  }
    print("Finish removing the Change and Change Task ENV menus items");
    
    print("Removing the Change Profile menu items under \"System Administration->Onging Maintenance-> Profiles\"...");
    var profileMenu = new SCFile("menu");
  var profileMenuQuerySQL = "name=\"MODULE PROFILES\"";
  if (profileMenu.doSelect(profileMenuQuerySQL) == RC_SUCCESS) {
    // duplicate the original env menu
    var oldprofileMenu = new SCFile("menu");
    system.vars.$L_void=system.functions.fduplicate(oldprofileMenu, profileMenu);

    for(var j=profileMenu.description.length()-1; j>=0; j--) {
        if(lib.ArrayUtil.indexOf(PROFILE_MENU_ITEM_DESCS, profileMenu.description[j])>=0) {
          print("Remove Menu Item \"" + profileMenu.description[j]);
            profileMenu.option[j] = null;
            profileMenu.group[j] = null;
            profileMenu.description[j] = null;
            profileMenu.command[j] = null;
            profileMenu.application[j] = null;
            profileMenu.pname[j] = null;
            profileMenu.pvalue[j] = null;
            profileMenu.thread[j] = null;
            profileMenu.condition[j] = null;
            profileMenu.system[j] = null;
        }
      }
      profileMenu.doUpdate();
      addSMPatches(profileMenu, oldprofileMenu, "menu;" + profileMenu.name, "update");
  } else {
    print("Can not find the menu \"MODULE PROFILES\", ignore the removing\"!");
  }
    print("Finish removing the Change Profile menus items");
   

  print("Finish enabling Menus");
}


function getMenuItemLength(menu) {
    if(null==menu) {
      return 0;
    }

    var retLen = 0;
    if(null!=menu.option) {
        retLen = Math.max(retLen, menu.option.length());
    }
    if(null!=menu.group) {
        retLen = Math.max(retLen, menu.group.length());
    }
    if(null!=menu.description) {
        retLen = Math.max(retLen, menu.description.length());
    }
    if(null!=menu.command) {
        retLen = Math.max(retLen, menu.command.length());
    }
    if(null!=menu.application) {
        retLen = Math.max(retLen, menu.application.length());
    }
    if(null!=menu.pname) {
        retLen = Math.max(retLen, menu.pname.length());
    }
    if(null!=menu.pvalue) {
        retLen = Math.max(retLen, menu.pvalue.length());
    }
    if(null!=menu.thread) {
        retLen = Math.max(retLen, menu.thread.length());
    }
    if(null!=menu.condition) {
        retLen = Math.max(retLen, menu.condition.length());
    }
    if(null!=menu.system) {
        retLen = Math.max(retLen, menu.system.length());
    }

    return retLen;
}


function enableSecurity() {
    print("Start enabling Security for Change Module...");

    //change management related security enablement
    var ret=0;
    lib.processDesignerChangeUpgrade.upgradeProfiles();    
    system.functions.rtecall("trigger", ret, 0);
    lib.processDesignerChangeUpgrade.upgradeOperators();
    system.functions.rtecall("trigger", ret, 1);  
    lib.processDesignerChangeUpgrade.upgradeUserRoles();
    


    print("Finish enabling Security for Change Module");
}

function enableCMExtaccesses() {
    print("Start enabling CM extaccess...");
    for(var i = 0; i < ENABLE_CM_EXTACCESS.length; i++){
    var pdRecord = new SCFile("extaccess");
    var pdQuerySQL = "object.name=\"" + ENABLE_CM_EXTACCESS[i].objectName + "\" and name=\"" + ENABLE_CM_EXTACCESS[i].name + "\"";
    // find the record first
    if (pdRecord.doSelect(pdQuerySQL) == RC_SUCCESS) {
      do {
        // duplicate the original extaccess
        var oldPdRecord = new SCFile("extaccess");
        system.vars.$L_void=system.functions.fduplicate(oldPdRecord, pdRecord);

        for (var k=0;k<ENABLE_CM_EXTACCESS[i].modifiedAllowedActions.length;k++){
          for (var j=0;j<pdRecord["allowed.actions"].length();j++){
            if(pdRecord["allowed.actions"][j]==ENABLE_CM_EXTACCESS[i].modifiedAllowedActions[k]){
              pdRecord["action.type"][j]=ENABLE_CM_EXTACCESS[i].actionType[k];
              pdRecord["execute.actions"][j]=ENABLE_CM_EXTACCESS[i].executeActions[k];
            }
          }
        }
        if(ENABLE_CM_EXTACCESS[i].addedField.length>0){
          for (var h=0;h<ENABLE_CM_EXTACCESS[i].addedField.length;h++){
            pdRecord["soafield"]=system.functions.insert(pdRecord["soafield"],1,1,ENABLE_CM_EXTACCESS[i].addedField[h]);
            pdRecord["soacaption"]=system.functions.insert(pdRecord["soacaption"],1,1,ENABLE_CM_EXTACCESS[i].addedCaption[h]);
            pdRecord["soatype"]=system.functions.insert(pdRecord["soatype"],1,1,ENABLE_CM_EXTACCESS[i].addedType[h]);
          }
        }
        if(ENABLE_CM_EXTACCESS[i].modifiedExpression.length>0){
          for (var m=0;m<ENABLE_CM_EXTACCESS[i].modifiedExpression.length;m++){
            pdRecord["expressions"].push(ENABLE_CM_EXTACCESS[i].modifiedExpression[m]);
          }
        }
        pdRecord.doUpdate();
        addSMPatches(pdRecord, oldPdRecord, "extaccess;" + pdRecord.object_name + ";" + pdRecord.service_name, "update");
            print("Enabled extaccess \"" + pdRecord["object.name"] + "--"+ pdRecord["service.name"] + "\" of file \"" + pdRecord["name"] + "\".");
        } while (pdRecord.getNext() == RC_SUCCESS)
    } else {
        // Ignore it if PD temp Record does not exist
      print("Can not find the temp PD extaccess, ignore the enabling for extaccess \"" + ENABLE_CM_EXTACCESS[i].name + "\"!");
    }
  }
    
    print("Finish enabling CM extaccess");
}


function enableChgTemplate()
{
   print("Start enabling change templates...");
  var f = new SCFile("Template");
  var rc= f.doSelect("tablename=\"cm3r\"");
  var _LNG=system.functions.lng;
  var _DEL=system.functions._delete;
  var _FCOPY=system.functions.fduplicate;
  while(rc==RC_SUCCESS)
  {
    {
      var arrPos=[];
      var removeFields=["priority.code","subcategory"];
      var iLenTempFields=_LNG(f.templateInfo);
      var oldPdRecord = new SCFile("Template");
      system.vars.$L_void=_FCOPY(oldPdRecord, f);
      for(var i=0;i<iLenTempFields && removeFields.length>0;i++)
      {
        
        for(var j=0;j<removeFields.length;j++)
        {

          if(f.templateInfo[i].field==removeFields[j])
          {
            arrPos.push(i+1);
            removeFields.splice(j,1);
          }
        }
      }   
      
      arrPos=arrPos.sort(function (a,b) {return b-a;}); 
      for(var k=0;k<arrPos.length;++k)
      {
        f.templateInfo=_DEL(f.templateInfo,arrPos[k],1);
      }
      if(arrPos.length>0)
      {
        print("Updating template \""+f.name+"\"");
        f.doUpdate();
        addSMPatches(f, oldPdRecord, "Template;" + f.name + ";" + f.tablename, "update");
      }
      
    }   

    rc = f.getNext();
  }
  
  print("Finish enabling change templates");
}

/**
 * The common private function for replacing a list of legacy records with PD records
 * by changing the key filed value of legacy record from xxx to xxx_disabled_by_PDHD
 * and changing the tmp PD record from xxx_for_pd4_tobe_used to xxx.
 * @param records the list of record names which to be replaced.
 * @param fileName  the file name of the records.
 * @param keyField  the key field name of the records.
 */
function replaceRecords(records, fileName, keyField) {
    if(null == records) {
      return;
    }

    for(var i=0; i<records.length; i++) {
        print("Enabling " + fileName + " \"" + records[i] + "\"...");
        var pdRecord = new SCFile(fileName);
        var pdQuerySQL = keyField + "=\"" + records[i] + PDTMP_SUFFIX + "\"";
        // find the PD temp record first
        if (pdRecord.doSelect(pdQuerySQL) == RC_SUCCESS) {
          var legacyRecord = new SCFile(fileName);
          var legacyQuerySQL = keyField + "=\"" + records[i] + "\"";
          // find the legacy Record, rename it if it exists.
          var oldLegacyRecord = null;
          if (legacyRecord.doSelect(legacyQuerySQL) == RC_SUCCESS) {
            // duplicate the original legacy reocrd
            oldLegacyRecord = new SCFile(fileName);
            system.vars.$L_void=system.functions.fduplicate(oldLegacyRecord, legacyRecord);

            legacyRecord[keyField] = records[i] + LEGACY_SUFFIX;
            legacyRecord.doUpdate();
            print("Renamed the legacy " + fileName + " " + keyField + " to \"" + legacyRecord[keyField] + "\"");
          } else {
            legacyRecord = null;
            print("The legacy " + fileName + " does not exist.");
          }

          // rename the PD temp Record name
          pdRecord[keyField] = records[i];
          pdRecord.doUpdate();
          
          // insert to table forcedobjects
          forceObject(fileName, pdRecord, legacyRecord);
          addSMPatches(pdRecord, oldLegacyRecord, fileName + ";" + pdRecord[keyField], "update");
          print("Enabled " + fileName + " \"" + records[i] + "\".");
        } else {
        // Ignore it if PD temp Record does not exist
          print("Can not find the temp PD " + fileName + ", ignore the enabling for " + fileName + " \"" + records[i] + "\"!");
        }
    }
}



/**
 * The common private function for updating a list of records.
 * @param records the list of record names which to be updated.
 * @param fileName  the file name of the records.
 * @param keyField  the key field name of the records.
 * @param updateField the field name to be updated.
 * @param updateValue the value to be updated to the update field.
 */
function updateRecords(records, fileName, keyField, updateField, updateValue) {
    if(null == records) {
      return;
    }

    for(var i=0; i<records.length; i++) {
        print("Updating " + fileName + " \"" + records[i] + "\"...");
        var pdRecord = new SCFile(fileName);
    var pdQuerySQL = keyField + "=\"" + records[i] + "\"";
    // find the PD temp record first
    if (pdRecord.doSelect(pdQuerySQL) == RC_SUCCESS) {
      do {
        // duplicate the original datadict
        var oldPdRecord = new SCFile(fileName);
        system.vars.$L_void=system.functions.fduplicate(oldPdRecord, pdRecord);

        // rename the PD temp Record name
        pdRecord[updateField] = updateValue;
        pdRecord.doUpdate();
        addSMPatches(pdRecord, oldPdRecord, fileName + ";" + pdRecord[keyField], "update");

        print("Updated the field " + updateField + " of " + fileName + " " + records[i] + " to \"" + updateValue + "\"");
        } while (pdRecord.getNext() == RC_SUCCESS)
    } else {
        // Ignore it if PD temp Record does not exist
      print("Can not find the " + fileName + ", ignore the updating " + fileName + " \"" + records[i] + "\"!");
    }
    }
}


function enableCMCategoryForm(){
  print("Start enabling Change Category Default Format...");
    for(var i = 0; i < ENABLE_CM_DATADICT_DEFAULTFORMAT.length; i++){
    var pdRecord = new SCFile("datadict");
    var pdQuerySQL = "name=\"" + ENABLE_CM_DATADICT_DEFAULTFORMAT[i].name + "\"";
    // find the record first
    if (pdRecord.doSelect(pdQuerySQL) == RC_SUCCESS) {
      do {
        // duplicate the original extaccess
        var oldPdRecord = new SCFile("datadict");
        system.vars.$L_void=system.functions.fduplicate(oldPdRecord, pdRecord);

        pdRecord["display.format"]=ENABLE_CM_DATADICT_DEFAULTFORMAT[i].defaultfmt;
        
        
        pdRecord.doUpdate();
        addSMPatches(pdRecord, oldPdRecord, "datadict;" + ENABLE_CM_DATADICT_DEFAULTFORMAT[i].name, "update");
            
        } while (pdRecord.getNext() == RC_SUCCESS)
    } else {
        // Ignore it if PD temp Record does not exist
      print("Can not find the temp PD datadict, ignore the enabling for datadict \"" + ENABLE_CM_DATADICT_DEFAULTFORMAT[i].name + "\"!");
    }
  }
    
    print("Finish enabling Change Category Default Format");
}
function upgradeNONPDOOBCategories(){
  var oobChangeCategories=["CI Group","Hardware","KM Document","Maintenance","Network","Release Management","Software","Subscription"];
  var oobTaskCategories=["Create Group","Create Release","Delete Group","Hardware","Identify Affected Systems","Maintenance","Network","Software","Update Affected Systems","Update Group"];
  var changeCat=new SCFile("cm3rcategory");
  var taskCat=new SCFile("cm3tcategory");
  var sql;
  for(var i=0;i<oobChangeCategories.length;i++){
    sql = "name=\""+oobChangeCategories[i]+"\"";
    if(changeCat.doSelect( sql )=== RC_SUCCESS){
      changeCat.workflow=oobChangeCategories[i];
      changeCat.doUpdate();
    }
  }
  for(var j=0;j<oobTaskCategories.length;j++){
    sql = "name=\""+oobTaskCategories[j]+"\"";
    if(taskCat.doSelect( sql )=== RC_SUCCESS){
      taskCat.workflow=oobTaskCategories[j];
      taskCat.doUpdate();
    }
  }
}
function upgradePDChangeCategories(){
  print("Start upgrading Change Module categories...");
  upgradeNONPDOOBCategories();
  //Handle change phases--cm3rcatphase
  var changeCat = new SCFile("cm3rcategory");
  var changePhase = new SCFile( "cm3rcatphase" );
  var _FCOPY=system.functions.fduplicate;
  for(var a=0;a<PD_CHM_PHASE.length;a++){
    sql = "name=\""+PD_CHM_PHASE[a].name+"\"";
    if (changePhase.doSelect( sql )== RC_SUCCESS){
      changePhase.name=changePhase.name + BAK_RECORD_SUFFIX;
      var checkPhase = $("cm3rcatphase").select('name="' + changePhase["name"] + '"').uniqueResult();
      if (checkPhase == null) {
      	print("The Change phase of "+PD_CHM_PHASE[a].name+" already exists, backup it...");
      	changePhase.doUpdate();

      	addSMPatches(changePhase, changePhase, "cm3rcatphase" + ";" + changePhase.name, "add");
      	print("Finished Change phase backup..");
      }
      //Check if the phase is referenced by a change category
      var sql2="phases=\""+PD_CHM_PHASE[a].name+"\"";
      if(changeCat.doSelect( sql2 )== RC_SUCCESS){
        do{
          print("Change phase of "+PD_CHM_PHASE[a].name+" is referenced by change category of "+changeCat.name);
          //backup the phase reference
          for(var b=0;b<changeCat.phases.length();b++){
            if(PD_CHM_PHASE[a].name==changeCat.phases[b]){
              var oldPdRecord = new SCFile("cm3rcategory");
              system.vars.$L_void=_FCOPY(oldPdRecord, changeCat);
              
              changeCat.phases[b]=changeCat.phases[b] + BAK_RECORD_SUFFIX;
              changeCat.doUpdate();
              
              addSMPatches(changeCat, oldPdRecord, "cm3rcategory" + ";" + changeCat.name, "update");
            }
          }
        } while (changeCat.getNext() == RC_SUCCESS)
      }
      
    }
    print("Inserting new change phases...");
    changePhase = new SCFile( "cm3rcatphase" );
    
    changePhase.name=PD_CHM_PHASE[a].name;
    changePhase.cls_control=PD_CHM_PHASE[a].clscontrol;
    
    changePhase.doSave();
    
    addSMPatches(changePhase, changePhase, "cm3rcatphase" + ";" + changePhase.name, "add");
    print("Finished inserting new change phases...");
  }
  
  
  //Handle change categories
  
  changeCat = new SCFile("cm3rcategory");
  var sql = "";
  
  for(var i=0;i<PD_CHM_CATEGOTY.length;i++){
    sql = "name=\""+PD_CHM_CATEGOTY[i].name+"\"";
    if (changeCat.doSelect( sql )== RC_SUCCESS){
      changeCat.name=changeCat.name + BAK_RECORD_SUFFIX;
      changeCat.avail_cond="false";
      
      var checkCat = $("cm3rcategory").select('name="' + changeCat["name"] + '"').uniqueResult();
      if (checkCat == null) {
      	print("The Change Category of "+PD_CHM_CATEGOTY[i].name+" already exists, backup it...");
        changeCat.doUpdate();
      
      	addSMPatches(changeCat, changeCat, "cm3rcategory" + ";" + changeCat.name, "add");
      	print("Finished Change Category backup..");

      	// also update the subcategory's category if the parent (cateory) is renamed
        var subCat = new SCFile("cm3rsubcat");
	    var subCatRC = subCat.doSelect('category="' + PD_CHM_CATEGOTY[i].name + '"');
	    while(subCatRC == RC_SUCCESS) {
	        subCat.category = changeCat.name;
	        subCat.doUpdate();
	        subCatRC = subCat.getNext();
	    }
      }
    }
    
    
    changeCat = new SCFile("cm3rcategory");
    print("Inserting new change categories...");
    changeCat.name=PD_CHM_CATEGOTY[i].name;
    changeCat.description=PD_CHM_CATEGOTY[i].description;
    changeCat.avail_cond=PD_CHM_CATEGOTY[i].availcond;
    changeCat.workflow=PD_CHM_CATEGOTY[i].workflow;
    changeCat.assign_number=PD_CHM_CATEGOTY[i].assignnumber;
    changeCat.phases=PD_CHM_CATEGOTY[i].phases;
    
    changeCat.doSave();
    
	addSMPatches(changeCat, changeCat, "cm3rcategory" + ";" + changeCat.name, "add");
	print("Finished inserting new change categories...");
  }
  
  //Handle change subcategories
  var changeSubcat = new SCFile( "cm3rsubcat" );
  for(var j=0;j<PD_CHM_SUBCATEGOTY.length;j++){
    for(var h=0;h<PD_CHM_SUBCATEGOTY[j].subcategory.length;h++){
      sql = "category=\""+PD_CHM_SUBCATEGOTY[j].category+"\" and subcategory=\"" + PD_CHM_SUBCATEGOTY[j].subcategory[h] + "\"";
      if (changeSubcat.doSelect( sql )== RC_SUCCESS){
      	changeSubcat.category=changeSubcat.category + BAK_RECORD_SUFFIX;
        changeSubcat.subcategory=changeSubcat.subcategory + BAK_RECORD_SUFFIX;
        var checkSubCat = $("cm3rsubcat").select('category="' + changeSubcat["category"] + '" and subcategory="' + changeSubcat["subcategory"] + '"').uniqueResult();
        if (checkSubCat == null) {
        	print("The Change Subcategory of "+PD_CHM_SUBCATEGOTY[j].category+"-->"+PD_CHM_SUBCATEGOTY[j].subcategory[h]+" already exists, backup it...");
        	changeSubcat.doUpdate();
        
        	addSMPatches(changeSubcat, changeSubcat, "cm3rsubcat" + ";" + changeSubcat.category+";"+changeSubcat.subcategory, "add");
        	print("Finished change sub category backup..");
        }
      }
      changeSubcat = new SCFile( "cm3rsubcat" );
      print("Inserting new change sub categories...");
      changeSubcat.category=PD_CHM_SUBCATEGOTY[j].category;
      changeSubcat.subcategory=PD_CHM_SUBCATEGOTY[j].subcategory[h];
      changeSubcat.description=PD_CHM_SUBCATEGOTY[j].description[h];
      changeSubcat.doSave();
      
      addSMPatches(changeSubcat, changeSubcat, "cm3rsubcat" + ";" + changeSubcat.category+";"+changeSubcat.subcategory, "add");
      print("Finished inserting new change sub categories...");
    }
    
  }
  
  
  //Handle change task phases
  var changeTaskPhase = new SCFile( "cm3tcatphase" );
  var changeTaskCat = new SCFile("cm3tcategory");
  for(var c=0;c<PD_CHM_TASK_PHASE.length;c++){
    sql = "name=\""+PD_CHM_TASK_PHASE[c].name+"\"";
    if (changeTaskPhase.doSelect( sql )== RC_SUCCESS){
      changeTaskPhase.name=changeTaskPhase.name + BAK_RECORD_SUFFIX;
      var checkTaskPhase = $("cm3tcatphase").select('name="' + changeTaskPhase["name"] + '"').uniqueResult();
      if (checkTaskPhase == null) {
	    print("The Change Task phase of "+PD_CHM_TASK_PHASE[c].name+" already exists, backup it...");
      	changeTaskPhase.doUpdate();
      
      	addSMPatches(changeTaskPhase, changeTaskPhase, "cm3tcatphase" + ";" + changeTaskPhase.name, "add");
      	print("Finished Change Task phase backup..");
      }
      //Check if the phase is referenced by a change task category
      var sql2="phases=\""+PD_CHM_TASK_PHASE[c].name+"\"";
      if(changeTaskCat.doSelect( sql2 )== RC_SUCCESS){
        do{
          print("Change Task phase of "+PD_CHM_PHASE[a].name+" is referenced by change task category of "+changeTaskCat.name);
          //backup the phase reference
          for(var d=0;d<changeTaskCat.phases.length();d++){
            if(PD_CHM_TASK_PHASE[c].name==changeTaskCat.phases[d]){
              var oldPdRecord = new SCFile("cm3tcategory");
              system.vars.$L_void=_FCOPY(oldPdRecord, changeTaskCat);
              
              changeTaskCat.phases[d]=changeTaskCat.phases[d] + BAK_RECORD_SUFFIX;
              changeTaskCat.doUpdate();
              addSMPatches(changeTaskCat, oldPdRecord, "cm3tcategory" + ";" + changeTaskCat.name, "update");
            }
          }
        } while (changeTaskCat.getNext() == RC_SUCCESS)
      }
    }
    print("Inserting new change task phases...");
    changeTaskPhase = new SCFile( "cm3tcatphase" );
    changeTaskPhase.name=PD_CHM_TASK_PHASE[c].name;
    changeTaskPhase.app_control=PD_CHM_TASK_PHASE[c].appcontrol;
    
    changeTaskPhase.doSave();
    
    addSMPatches(changeTaskPhase, changeTaskPhase, "cm3tcatphase" + ";" + changeTaskPhase.name, "add");
    print("Finished inserting new change task phases...");
  }
  
  //Handle change task categories
  changeTaskCat = new SCFile("cm3tcategory");
  for(var k=0;k<PD_CHMTASK_CATEGOTY.length;k++){
    sql = "name=\""+PD_CHMTASK_CATEGOTY[k].category+"\"";
    if (changeTaskCat.doSelect( sql )== RC_SUCCESS){
      changeTaskCat.name=changeTaskCat.name + BAK_RECORD_SUFFIX;
      var checkTaskCat = $("cm3tcategory").select('name="' + changeTaskCat["name"] + '"').uniqueResult();
      if (checkTaskCat == null) {
      	print("The Change Task Category of "+PD_CHMTASK_CATEGOTY[k].category+" already exists, backup it...");
      	changeTaskCat.avail_cond="false";
      	changeTaskCat.doUpdate();
      
      	addSMPatches(changeTaskCat, changeTaskCat, "cm3tcategory" + ";" + changeTaskCat.name, "add");
      	print("Finished Change Task Category backup..");
      }
    }
    changeTaskCat = new SCFile("cm3tcategory");
    print("Inserting new change task categories...");
    changeTaskCat.name=PD_CHMTASK_CATEGOTY[k].category;
    changeTaskCat.description=PD_CHMTASK_CATEGOTY[k].description;
    changeTaskCat.avail_cond=PD_CHMTASK_CATEGOTY[k].availcond;
    changeTaskCat.workflow=PD_CHMTASK_CATEGOTY[k].workflow;
    changeTaskCat.assign_number=PD_CHMTASK_CATEGOTY[k].assignnumber;
    changeTaskCat.request_phases=new Array();
    for(var x=0;x<PD_CHMTASK_CATEGOTY[k].avaichmphase.length;x++){
      changeTaskCat.request_phases[x]=PD_CHMTASK_CATEGOTY[k].avaichmphase[x];
    }
    
    changeTaskCat.doSave();
    
    addSMPatches(changeTaskCat, changeTaskCat, "cm3tcategory" + ";" + changeTaskCat.name, "add");
    print("Finish inserting new change task categories...");
  }
  print("Finish upgrading Change Module categories...");
}


/**
 * Common private function to add smpatches record while enablement script upadating/adding a 
 * record.
 */
function addSMPatches(file, oldFile, recordTag, action) {
  // 1. find the signaturemake
  var signaturemake = new SCFile("signaturemake");
  var querySQL = "table.name=\"" + system.functions.filename(file) + "\"";
  var oldSignture = null;
  var newSignture = null;
  if (signaturemake.doSelect(querySQL) == RC_SUCCESS) {
    // found it
    if(null!=oldFile) {
      oldSignture = system.functions.make_sig(oldFile, signaturemake.fields, signaturemake.fieldarray_type).toString();
    }
    newSignture = system.functions.make_sig(file, signaturemake.fields, signaturemake.fieldarray_type).toString();
  } else {
      // the signaturemake could not be found
    print("Can not find the signaturemake for file \"" + system.functions.filename(file) + "\"!");
    if(null!=oldFile) {
      oldSignture = system.functions.make_sig(oldFile).toString();
    }
    newSignture = system.functions.make_sig(file).toString();
  }
  
  // 2. try to find the smpatches, update it if existing, otherwise add it.
  if(null==oldFile) {
    action="add";
  }
  var smpatches = new SCFile("smpatches");
  var patchQuerySQL = "version=\"SM9.30\" and tag=\"" + recordTag + "\"";
  if(smpatches.doSelect(patchQuerySQL) == RC_SUCCESS) {
    // found it, then update it
    print("Find the smpatches, update it!");
    smpatches.curr_sig=newSignture;
    var foundPreSigVer = false;
    for(var i=0; i<smpatches["pre.sigs.ver"].length(); i++) {
          if(smpatches["pre.sigs.ver"][i]=="SM9.30_PD4") {
              smpatches["pre.sigs"][i]=newSignture;
              foundPreSigVer = true;
              break;
          }
      }
      if(!foundPreSigVer && smpatches.action!="add") {
          smpatches.pre_sigs_ver[smpatches["pre.sigs.ver"].length()]="SM9.30_PD4";
      smpatches.pre_sigs[smpatches["pre.sigs"].length()]=newSignture;
      }
  } else {
      // the smpatches could not be found
    print("Can not find the smpatches, add it!");
    smpatches.version="SM9.30";
    smpatches.filename=system.functions.filename(file);
    smpatches.tag=recordTag;
    smpatches.action=action;
    smpatches.curr_sig=newSignture;
    if(action=="add") {
    } else if(action=="update") {
      smpatches.pre_sigs_ver[0]="SM9.30.000";
      smpatches.pre_sigs_ver[1]="SM9.30_PD4";
      smpatches.pre_sigs[0]=oldSignture;
      smpatches.pre_sigs[1]=newSignture;
    } else {
        print("Unknown action \"" + action + "\"!");
    }
  }
  smpatches.doSave();
}


function enableSearchConfig() {
 
  print("Start enabling SearchConfigs...");
  var srchCfg = new SCFile("SearchConfig");
  var query = 'tablename="cm3r"';
  if(srchCfg.doSelect(query) == RC_SUCCESS){
    if(srchCfg.searchFormat === "advFind.search.change") {
      // duplicate the original SearchConfig
      var oldSearchConfig = new SCFile("SearchConfig");
      system.vars.$L_void=system.functions.fduplicate(oldSearchConfig, srchCfg);
 
      srchCfg.searchFormat = "advFind.search.chm";
      srchCfg.doUpdate();
      addSMPatches(srchCfg, oldSearchConfig, "SearchConfig;" + srchCfg.tablename, "update");
    }
  }
  print("Finish enabling SearchConfigs");
}

function enableDatadict() {
      print("Start enabling Datadicts...");
 
      //update cm3r
      var datadict = new SCFile("datadict");
      datadict.doSelect('name="cm3r"');
 
      // duplicate the original datadict
      var oldDatadict = new SCFile("datadict");
      system.vars.$L_void = system.functions.fduplicate(oldDatadict, datadict);
 
      for (var i = DATADICT_CM3R.length - 1; i >= 0; i--) {
            var index = system.functions.index(DATADICT_CM3R[i].fieldName, datadict.fields) - 1;
            var attributes = DATADICT_CM3R[i].attributes;
            var values = DATADICT_CM3R[i].values;
            for (var j = attributes.length - 1; j >= 0; j--) {
                  var attribute = attributes[j];
                  var value = values[j];
                  datadict[attribute][index] = value;
            };
      };
      datadict.doUpdate();
      addSMPatches(datadict, oldDatadict, "datadict;" + datadict.name, "update");
 	  enableCm3rDatadictCaptionAndUsage();
	  enableCm3tDatadictGloballist();
      print("Finish enabling Datadicts");
}

function enableLinks() {
    
    updateLinks(PHASE_RELATED_LINKS, PHASE_RELATED_LINKLINES);
}


function enableInboxes() {
    print("Start enabling Inboxes...");

    updateInboxes(ENABLE_QUEUES);

    print("Finish enabling Inboxes");
}

/**
 * The common private function for updating a list of inbox.
 * @param records the list of record which to be updated, the struct of this parameter is:
 *   [inboxName, operation:update/delete, [updateFields1,...], [updateToValue1,...]]
 */
function updateInboxes(records) {
    if(null == records) {
      return;
    }

    for(var i=0; i<records.length; i++) {
        print("Updating inbox \"" + records[i][0] + "\"...");
        var pdRecord = new SCFile("inbox");
    var pdQuerySQL = "inbox.name=\"" + records[i][0] + "\"";
    // find the record first
    if (pdRecord.doSelect(pdQuerySQL) == RC_SUCCESS) {
        if(ENABLE_QUEUE_OPERATION_DELETE==records[i][1]) {
            pdRecord.doDelete();
            // we do nothing for inbox deltion in smpatches
            print("Deleted the inbox \"" + records[i][0] + "\"");
        } else if(ENABLE_QUEUE_OPERATION_UPDATE==records[i][1]) {
            // duplicate the original datadict
          var oldPdRecord = new SCFile("inbox");
          system.vars.$L_void=system.functions.fduplicate(oldPdRecord, pdRecord);

            for(var j=0; j<records[i][2].length; j++) {
                pdRecord[records[i][2][j]] = records[i][3][j];
                print("Updating field \"" + records[i][2][j] + "\" to value \"" + records[i][3][j] + "\".");
            }
            pdRecord.doUpdate();
            addSMPatches(pdRecord, oldPdRecord, "inbox;" + pdRecord.inbox_id , "update");
            
            print("Updated inbox \"" + records[i][0] + "\".");
        } else if(ENABLE_QUEUE_OPERATION_ADD==records[i][1]){
          for(var j=0; j<records[i][2].length; j++) {
                pdRecord[records[i][2][j]] = records[i][3][j];            
            }
            pdRecord.inbox_id=null;
            var checkRecord = $("inbox").select('inbox.name="' + pdRecord["inbox.name"] + '"').uniqueResult();
            
            if (checkRecord == null) {
            	pdRecord.doInsert();
            	addSMPatches(pdRecord, pdRecord, "inbox;" + pdRecord.inbox_id , "add");
            
            	print("Added inbox \"" + pdRecord.inbox_name + "\".");
            }
        } else if(ENABLE_QUEUE_OPERATION_REPLACE==records[i][1]){
           // duplicate the original datadict
          var oldPdRecord = new SCFile("inbox");
          system.vars.$L_void=system.functions.fduplicate(oldPdRecord, pdRecord);

            for(var j=0; j<records[i][2].length; j++) {
                var oldValue = pdRecord[records[i][2][j]];
                var newValue =  oldValue.replace(records[i][3][j], records[i][4][j]);               
                pdRecord[records[i][2][j]]=newValue;              
                print("Updating field \"" + records[i][2][j] + "\" to value \"" + newValue + "\".");
            }
            pdRecord.doInsert();
            addSMPatches(pdRecord, oldPdRecord, "inbox;" + pdRecord.inbox_id , "update");           
            print("Updated inbox \"" + records[i][0] + "\".");
        
        } else {
            print("Unknown operation \"" + records[i][1] + "\", ingore the inbox \"" + records[i][0] + "\"");
        }
    } else {
        // Ignore it if PD temp Record does not exist
      print("Can not find the inbox, \"" + records[i][0] + "\", ignore it!");
    }
    }
}

function enableCm3rDatadictCaptionAndUsage(){
    var fields=[];
    var captions=[];
    var usages=[];
    var dataDict=new SCFile("datadict");
    var sql;
    for (var i=0;i<datadictCaptionAndUsage.length;i++){
      sql="name=\""+datadictCaptionAndUsage[i].datadictName+"\"";
      if(dataDict.doSelect( sql )=== RC_SUCCESS){
        fields=dataDict.fields;
        captions=dataDict.captions;
        usages=dataDict.sysFieldType;
        for(var j=0;j<datadictCaptionAndUsage[i].fieldName.length;j++){
          for(var k=0;k<fields.length();k++){
            if(fields[k]===datadictCaptionAndUsage[i].fieldName[j]){
              if(""!==datadictCaptionAndUsage[i].caption[j]){
                captions[k]=datadictCaptionAndUsage[i].caption[j];
              }
              if(0!==datadictCaptionAndUsage[i].usage[j]){
                usages[k]=datadictCaptionAndUsage[i].usage[j];
              }
            }
          }
        }
        dataDict.doUpdate();
      }
    }
}
function enableCm3tDatadictGloballist(){
    var fields=[];
    var gls=[];
	var datadictName="cm3t"
    var dataDict=new SCFile("datadict");
    var sql="name=\""+datadictName+"\"";
    if(dataDict.doSelect( sql )=== RC_SUCCESS){
    	var oldDatadict = new SCFile("datadict");
        system.vars.$L_void=system.functions.fduplicate(oldDatadict, dataDict);
        fields=dataDict.fields;
        gls=dataDict.globallist;
        for(var k=0;k<fields.length();k++){
            if(fields[k]==="status"){
              gls[k]="Change Task Search Status";
            }
        }
        dataDict.doUpdate();
        addSMPatches(dataDict, oldDatadict, "datadict;" + datadictName, "update");
      }
    
}


function enableSLA() {
    print("Start enabling SLA...");

    
    //update status progession list to PD version for SLA module control of change task
    updateRecords(["cm3t"], "slamodulecontrol", "table.name", "use.phases", true);
    updateRecords(["cm3t"], "slamodulecontrol", "table.name", "response.state.field", "current.phase");
    updateRecords(["cm3t"], "slamodulecontrol", "table.name", "status.progression", []);
    print("Finish enabling SLA");
}



/** This method is used to purge legacy OOB change categories and it's related workflow and workflow phases during the change enablement process
*
*/
function purgeNonPDOOBCategories() {
  var oobChangeCategories=["CI Group","Hardware","KM Document","Maintenance","Network","Software"];
  var oobTaskCategories=["Create Group","Create Release","Delete Group","Hardware","Identify Affected Systems","Maintenance","Network","Software","Update Affected Systems","Update Group"];
  var changeCat=new SCFile("cm3rcategory");
  var taskCat=new SCFile("cm3tcategory");
  var sql;
  for(var i=0;i<oobChangeCategories.length;i++){
    sql = "name=\""+oobChangeCategories[i]+"\"";
    if(changeCat.doSelect( sql )=== RC_SUCCESS){
      changeCat.doDelete();
    }
  }
  for(var j=0;j<oobTaskCategories.length;j++){
    sql = "name=\""+oobTaskCategories[j]+"\"";
    if(taskCat.doSelect( sql )=== RC_SUCCESS){
      taskCat.doDelete();
    }
  }
}


/**
 * The common private function for update a list of links to disable the 
 * related linklines by changing the linkline to xxx_disabled_by_PDHD, and 
 * and enable linkline by changing the tmp PD record from xxx_for_pd4_tobe_used
 * to xxx.
 * @param links the list of link.
 * @param linklines the linklines to be enabled.
 */
function updateLinks(links, linklines, changeorders) {
    if(null == links) {
      return;
    }
 
    for(var i=0; i<links.length; i++) {
        print("Enabling link \"" + links[i] + "\"...");
        var pdRecord = new SCFile("link");
    var pdQuerySQL = "name=\"" + links[i] + "\"";
    // find the link first
    if (pdRecord.doSelect(pdQuerySQL) == RC_SUCCESS) {
      // duplicate the original link
      var oldPdRecord = new SCFile("link");
      system.vars.$L_void=system.functions.fduplicate(oldPdRecord, pdRecord);

      for(var j=0; j<linklines.length; j++) {
          var orgIndex = -1;
          var newIndex = -1;
          for(var k=0; k<pdRecord.source_fields.length(); k++) {
              if(linklines[j]==pdRecord.source_fields[k]) {
                  print(pdRecord.source_fields[k]);
                  print(pdRecord.target_files[k]);
                  if(pdRecord.source_fields[k] =="dflt.reviewers" && pdRecord.target_files[k]=="cm3groups" || pdRecord.source_fields[k] !=="dflt.reviewers" ){
                  	orgIndex = k;
                  }
              }
              if((linklines[j]+PDTMP_SUFFIX)==pdRecord.source_fields[k]) {
                  newIndex = k;
              }
          }
                if (orgIndex != -1 && newIndex != -1) {
                    print("Update the legacy link line from \"" + linklines[j] + "\" to \"" + linklines[j] + LEGACY_SUFFIX + "\"");
                    pdRecord.source_fields[orgIndex] = linklines[j] + LEGACY_SUFFIX;
                    print("Update the PD temp link line from \"" + linklines[j] + PDTMP_SUFFIX + "\" to \"" + linklines[j] + "\"");
                    pdRecord.source_fields[newIndex] = linklines[j];
                    if (changeorders != null && changeorders[j] == true) {
                        changeLinklinePosition(pdRecord, orgIndex, newIndex);
                    }
          }
      }

      // rename the linkline
      pdRecord.doUpdate();
      addSMPatches(pdRecord, oldPdRecord, "link;" + pdRecord.name, "update");
          print("Enabled link \"" + links[i] + "\".");
    } else {
        // Ignore it if link does not exist
      print("Can not find the link, ignore the enabling for link \"" + links[i] + "\"!");
    }
    }
}