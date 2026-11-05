
function changeManagementUpgrade()
{
	var ret;
    try{ 
        funcs.rtecall("trigger", ret, 1);	             
    	upgradeCategories();
     	upgradeProfiles();  
    	funcs.rtecall("trigger", ret, 0);
    	upgradeOperators();
    	funcs.rtecall("trigger", ret, 1);	
    	upgradeChangeAreas();
    	upgradeUserRoles();
    	updateChangePhases();	
    	deleteUnplannedClosedPhase();		
    	specialFix4ChangeApproval();	
	}
	catch(e)
	{
	 print("Error in Change Upgrade.");
     print(e.toString()); 
     funcs.rtecall("trigger", ret, 1);    
	} 
}


function upgradeUserRoles()
{
 var usrRole = new SCFile("userrole");
 var sql="true";
 var index=0;
 usrRole.doSelect(sql);
 if(usrRole.getFirst() == RC_SUCCESS)
 {
  do
  {
    vars.$L_sf=funcs.rtecall("sort", vars.$L_rc,usrRole.profile_change, 0, 0);
    usrRole.profile_change=funcs.denull(usrRole.profile_change);
    
    var i;
    var lng = usrRole.profile_change.length();
    for(i=0;i<lng;i++)
    {
      if(usrRole.profile_change[i]!=null)
      {
        if(funcs.index(usrRole.profile_change[i],usrRole.secRole)==0)
        {
          usrRole.secRole.push(usrRole.profile_change[i]);
        }
      } 
    }
	index=funcs.index( "default", usrRole.secRole );
	if ( index > 0 )
	{    	    
		usrRole.secRole[index-1]="DEFAULT";
	} 

	if ( funcs.lng( funcs.denull( usrRole.secRole ) ) == 0 )
	{
		usrRole.secRole[0] = "DEFAULT";
	}

    vars.$L_sf=funcs.rtecall("sort", vars.$L_rc,usrRole.secRole, 0, 0);
    usrRole.doUpdate();
   
   }while(usrRole.getNext()== RC_SUCCESS) ;
 }
 
}

function upgradeChangeAreas()
{
	var datadict = new SCFile("datadict");
	var sql = "name isin {\"activitycm3r\",\"cm3r\",\"cm3rpage\"}";
	
	if (datadict.doSelect( sql ) == RC_SUCCESS ) {
    	do
    	{
    		datadict.sc_area = "Change";
    		datadict.doUpdate();	
    	}
    	while (datadict.getNext() == RC_SUCCESS);
    }
	
	sql = "name isin {\"activitycm3t\",\"cm3t\",\"cm3tpage\"}";
	if (datadict.doSelect( sql ) == RC_SUCCESS ) {
    	do
    	{
    		datadict.sc_area = "Change Tasks";
    		datadict.doUpdate();	
    	}
    	while (datadict.getNext() == RC_SUCCESS);
    }
	
	sql = "name isin {\"changeModel\",\"cm3rcategory\",\"cm3rcatphase\",\"cm3roperatorinfo\",\"cm3messages\",\"cm3groups\",\"cm3rsubcat\",\"cm3tcatphase\",\"cm3tcategory\"}";
	if (datadict.doSelect( sql ) == RC_SUCCESS ) {
    	do
    	{
    		datadict.sc_area = "Change Management Configuration";
    		datadict.doUpdate();	
    	}
    	while (datadict.getNext() == RC_SUCCESS);
    }
    	
	var secArea = new SCFile("secArea");
	sql="name#\"Change\"";
	if (secArea.doSelect( sql ) == RC_SUCCESS ) {
    	do
    	{
    	 try {
    		lib.securityTriggers.updateAreaRights( secArea, secArea.name );
    	 }
    	 catch ( exception )
    	 {
    		print( exception.toString() );
    	 }
    	}
    	while (secArea.getNext() == RC_SUCCESS);
    }
}

function upgradeCategory( name, type )
{
	if ( name == null )
	{
		return;
	}
	
	var changeCat;
	
	if ( type == "change" )
	{
		changeCat = new SCFile( "cm3rcategory" );
	}
	else
	{
		changeCat = new SCFile( "cm3tcategory" );
	}
	
	var sql = "name=\"" + name + "\" and (workflow=NULL or workflow=\"\")";
	
	if ( changeCat.doSelect( sql ) == RC_SUCCESS )
	{
		var workflow = createWorkflow( changeCat, type );
		changeCat.workflow = workflow.name;
		changeCat.doUpdate();
	}
}

function createWorkflow( changeCat, type )
{
	var workflow = new SCFile( "Workflow" );
	var filename="cm3r";
	if ( type != "change" ) {
		filename="cm3t";
	}
	var sql = "name=\"" +changeCat.name+ "\" and tableName=\"" +filename+ "\"";

	if ( workflow.doSelect( sql ) != RC_SUCCESS )
	{
		workflow.name = changeCat.name;
		if ( type == "change" )
		{
			workflow.tableName = "cm3r";
		}
		else
		{
			workflow.tableName = "cm3t";
		}
		workflow.description= changeCat.description +" - Automatically Upgraded.";
		workflow.type = "standard";
		workflow.defaultPhase = changeCat.phases[0];
		workflow.firstPhase = changeCat.phases[0];
			
		if ( workflow.doInsert() == RC_SUCCESS )
		{
			createPhases( changeCat, workflow, type);
		}
	}
	return workflow;
}


// For those "two-copy" formats, convert them to PD formats during workflow creation
function getPhaseForm( inputForm )
{
	var rtnForm=inputForm;
	switch(inputForm)
 	{
  		case "cm3r.cigroup.g":rtnForm="chm.cm3r.cigroup.g";
   		break;
   		
   		case "cm3t.Create.Release":rtnForm="chm.cm3t.Create.Release";
   		break;
   		
   		case "cm3t.Identify.Affected.Systems":rtnForm="chm.cm3t.Identify.Affected.Systems";
   		break;
   		
   		case "cm3t.Update.Affected.Systems":rtnForm="chm.cm3t.Update.Affected.Systems";
   		break;
   		
   		case "cm3t.cigroup.g":rtnForm="chm.cm3t.cigroup.g";
   		break;
   		
   		case "CM.change.approval":rtnForm="chm.change.review";
   		break;
   		
   		case "CM.change.approvalprep":rtnForm="chm.change.review";
   		break;
   		
   		case "CM.change.closure":rtnForm="chm.change.closure";
   		break;
   		
   		case "CM.change.implementation":rtnForm="chm.change.review";
   		break;
   		
   		case "CM.change.logging":rtnForm="chm.change.logging";
   		break;
   		
   		case "CM.change.planning":rtnForm="chm.change.review";
   		break;
   		
   		case "CM.change.review":rtnForm="chm.change.review";
   		break;
   		
   		case "cm3r.km.g":rtnForm="chm.cm3r.km.g";
   		break;
   		
   		case "cm3r.release":rtnForm="chm.cm3r.release";
   		break;
   		
   		case "cm3r.subscription":rtnForm="chm.cm3r.subscription";
   		break;
   		
   		case "CM.task":rtnForm="chm.task";
   		break;
  
   		default :rtnForm=inputForm;
   		break;

  	}
	return rtnForm;
}

function createPhases( changeCat, workflow, type )
{
	var lng = changeCat.phases.length();
	var i;
	for ( i = 0; i < lng; i ++ )
	{
		var changePhase;
		if ( type == "change" )
		{
			changePhase = new SCFile( "cm3rcatphase" );
		}
		else
		{
			changePhase = new SCFile( "cm3tcatphase" );
		}
		var sql = "name=\"" + changeCat.phases[i] + "\"";
		var next = i + 1;
		
		if ( changePhase.doSelect( sql ) == RC_SUCCESS )
		{
			var updOldPhase = false;
			if ( changePhase.open_behavior == "prompt" )
			{
				changePhase.open_behavior = "update";
				updOldPhase = true;
			}
			
			if ( updOldPhase == true ) {
				changePhase.doUpdate();
			}
			
			var wfPhase = new SCFile( "WorkflowPhase" );
			
			var wfpSQL= "workflowName=\""+workflow.name+"\" and tableName=\""+workflow.tableName+"\" and phaseName=\""+changePhase.name+"\"";
			if(wfPhase.doSelect(wfpSQL) == RC_SUCCESS) {
			    continue;
			}
			
			wfPhase.workflowName = workflow.name;
			wfPhase.tableName = workflow.tableName;
			wfPhase.phaseName = changePhase.name;
			wfPhase.phaseOrder = next;
			wfPhase.displayForm = getPhaseForm(changePhase.view_default);
			wfPhase.description = changePhase.description;
			wfPhase.active = true;
			wfPhase.approvals = changePhase.approvals;
			wfPhase.alerts = changePhase.alerts;
			wfPhase.approvalsRecalc = changePhase.recalc_approvals;
			wfPhase.approvalsReset = changePhase.reset_approvals;
			wfPhase.alertsRecalc = changePhase.recalc_alerts;
			wfPhase.alertsReset = changePhase.reset_alerts;
			
			var updateCondStr = "$L.tableAccess.update=true";
			// use new or update to authorize the first phase
			if ( i == 0 ) {
				updateCondStr = updateCondStr + " or $L.tableAccess.new=true";
			}
			if ( changePhase.upd_control != null ) {
				updateCondStr = updateCondStr + " and (" + funcs.str( changePhase.upd_control ) + ")";
			}
			wfPhase.updateCond = funcs.parse( updateCondStr );
			wfPhase.updateCondXML = "<XmlCondition><collection logical=\"\" negate=\"\"><condition logical=\"\" negate=\"false\">\
					                                         <operand type=\"expression\"><Expression caption=\"\">\""+ 
					                                         updateCondStr+"\"</Expression>\
					                                         </operand></condition></collection></XmlCondition>";
			wfPhase.updateCondDesc = funcs.str( updateCondStr );
			wfPhase.xCoordinate = 20 + ( i * 140 );
			wfPhase.yCoordinate = 60;
			if ( changeCat.phases[next] != null )
			{
				wfPhase.manualTransition[0].mtToPhase  = changeCat.phases[next];
				wfPhase.manualTransition[0].mtOptionName = "nextphase";
				wfPhase.manualTransition[0].mtOptionLoc = 1;
				wfPhase.manualTransition[0].mtId = 1;
				if ( changePhase.cls_control != null && changePhase.cls_control != ""  && funcs.str(changePhase.cls_control) != "true" )
				{
					var phase_cls_control = funcs.str(changePhase.cls_control);

					if(phase_cls_control.indexOf("and approval.status in $L.file=\"approved\"")<0){//if already added , will not add again
						changePhase.cls_control = funcs.val(
					                             "("+funcs.str(changePhase.cls_control)+
					                             ") and approval.status in $L.file=\"approved\"", 10);
					}
					wfPhase.manualTransition[0].mtCondition = funcs.val( changePhase.cls_control,10);
					wfPhase.manualTransition[0].mtCondXML = "<XmlCondition><collection logical=\"\" negate=\"\"><condition logical=\"\" negate=\"false\">\
					                                         <operand type=\"expression\"><Expression caption=\"\">\""+ 
					                                         funcs.str( changePhase.cls_control )+"\"</Expression>\
					                                         </operand></condition></collection></XmlCondition>";
					wfPhase.manualTransition[0].mtCondDesc =  funcs.str( changePhase.cls_control ) ;
				}
				else
				{
					wfPhase.manualTransition[0].mtCondXML = "<XmlCondition><collection logical=\"\" negate=\"\" ><condition logical=\"\" negate=\"false\">\
															 <operand type=\"field\"><TableName>CurrentRecord</TableName>\
															 <FieldName caption=\"Approval Status\">approval.status</FieldName></operand>\
															 <Comparison>equals</Comparison><Value dataType=\"string\">approved</Value>\
															 </condition></collection></XmlCondition>";
					wfPhase.manualTransition[0].mtCondDesc = "( Approval Status in CurrentRecord= approved  )";
					wfPhase.manualTransition[0].mtCondition = funcs.val("approval.status in $L.file=\"approved\"",10);									 
				}
				wfPhase.manualTransition[0].mtxCoordinate = 20 + ( i * 140 ) + 120;
				wfPhase.manualTransition[0].mtyCoordinate = 80;
				wfPhase.manualTransition[0].mtOption = lib.Workflow.getOptionNumber( wfPhase, 1 );
			}
			else
			{
				var lastPhase = new SCFile( "WorkflowPhase" );
				lastPhase.workflowName = workflow.name;
				lastPhase.tableName = workflow.tableName;
				lastPhase.phaseName = "Closed";
				lastPhase.phaseOrder = next + 1;
				lastPhase.displayForm = getPhaseForm(changePhase.view_default);
				lastPhase.description = "Closed";
				lastPhase.active = false;
				lastPhase.updateCond = false;
				lastPhase.updateCondXML = "<XmlCondition><collection logical=\"\" negate=\"\"><condition logical=\"\" negate=\"false\">\
					                                         <operand type=\"expression\"><Expression caption=\"\">\""+ 
					                                         funcs.str( "false" )+"\"</Expression>\
					                                         </operand></condition></collection></XmlCondition>";
			    lastPhase.updateCondDesc = funcs.str( "false" );
				lastPhase.xCoordinate = 20 + ( (i+1) * 140 );
				lastPhase.yCoordinate = 60;
				
				wfPhase.manualTransition[0].mtToPhase  = "Closed";
				wfPhase.manualTransition[0].mtOptionName = "close";
				wfPhase.manualTransition[0].mtOptionLoc = 1;
				wfPhase.manualTransition[0].mtId = 1;
				wfPhase.manualTransition[0].mtCondition = changePhase.cls_control;
				wfPhase.manualTransition[0].mtRules[0] = "chm.task.close.status";
				
				if ( changePhase.cls_control != null && changePhase.cls_control != ""  && funcs.str(changePhase.cls_control) != "true" )
				{
				    var phase_cls_control = funcs.str(changePhase.cls_control);
					
					if(phase_cls_control.indexOf("and approval.status in $L.file=\"approved\"")<0){//if already added , will not add again
						changePhase.cls_control = funcs.val(
					                             "("+funcs.str(changePhase.cls_control)+
					                             ") and approval.status in $L.file=\"approved\"", 10);
					}
					wfPhase.manualTransition[0].mtCondition = funcs.val(changePhase.cls_control,10);
					wfPhase.manualTransition[0].mtCondXML = "<XmlCondition><collection logical=\"\" negate=\"\"><condition logical=\"\" negate=\"false\">\
					                                         <operand type=\"expression\"><Expression caption=\"\">\""+ 
					                                         funcs.str( changePhase.cls_control )+"\"</Expression>\
					                                         </operand></condition></collection></XmlCondition>";
					wfPhase.manualTransition[0].mtCondDesc = funcs.str( changePhase.cls_control );
				}
				else
				{
					wfPhase.manualTransition[0].mtCondXML = "<XmlCondition><collection logical=\"\" negate=\"\" ><condition logical=\"\" negate=\"false\">\
															 <operand type=\"field\"><TableName>CurrentRecord</TableName>\
															 <FieldName caption=\"Approval Status\">approval.status</FieldName></operand>\
															 <Comparison>equals</Comparison><Value dataType=\"string\">approved</Value>\
															 </condition></collection></XmlCondition>";
					wfPhase.manualTransition[0].mtCondDesc = "( Approval Status in CurrentRecord= approved  )";
					wfPhase.manualTransition[0].mtCondition = funcs.val("approval.status in $L.file=\"approved\"",10);									 
				}
				
				wfPhase.manualTransition[0].mtOption = lib.Workflow.getOptionNumber( wfPhase, 1 );
				wfPhase.manualTransition[0].mtxCoordinate = 20 + ( i * 140 ) + 120;
				wfPhase.manualTransition[0].mtyCoordinate = 80;
				
				// Add a reopen option to last phase
				lastPhase.manualTransition[0].mtToPhase  = changePhase.name;
				lastPhase.manualTransition[0].mtOptionName = "reopen";
				lastPhase.manualTransition[0].mtOptionLoc = 1;
				lastPhase.manualTransition[0].mtId = 1;
				if ( type == "change" )
				{
					lastPhase.manualTransition[0].mtCondition = funcs.val("jscall(\"security.getToken\",\"Change\",\"reopen\")=\"true\"",10);
					lastPhase.manualTransition[0].mtCondXML = "<XmlCondition><collection logical=\"\" negate=\"\" ><condition logical=\"\" negate=\"false\">\
															 <operand type=\"security\"><Area caption=\"Change\">Change</Area><Right caption=\"Reopen\">reopen</Right>\
															 </operand><Comparison>equals</Comparison><Value dataType=\"string\">true</Value></condition>\
															 </collection></XmlCondition>";
					lastPhase.manualTransition[0].mtCondDesc = "( Reopen in Change= true  )";
				}
				else
				{
					lastPhase.manualTransition[0].mtCondition = funcs.val("jscall(\"security.getToken\",\"Change Tasks\",\"reopen\")=\"true\"",10);
					lastPhase.manualTransition[0].mtCondXML = "<XmlCondition><collection logical=\"\" negate=\"\" ><condition logical=\"\" negate=\"false\">\
															 <operand type=\"security\"><Area caption=\"Change Tasks\">Change Tasks</Area><Right caption=\"Reopen\">reopen</Right>\
															 </operand><Comparison>equals</Comparison><Value dataType=\"string\">true</Value></condition>\
															 </collection></XmlCondition>";
					lastPhase.manualTransition[0].mtCondDesc = "( Reopen in Change Tasks= true  )";
				}
				lastPhase.manualTransition[0].mtOption = lib.Workflow.getOptionNumber( wfPhase, 1 );
				lastPhase.manualTransition[0].mtxCoordinate = 70 + ( (i+1) * 140 ) ;
				lastPhase.manualTransition[0].mtyCoordinate = 140;
				
				// check if the WorkflowPhase exists
				var checkLastPhase = new SCFile( "WorkflowPhase" );
				if (checkLastPhase.doSelect("phaseName=\"" + lastPhase.phaseName + "\" and workflowName=\"" + lastPhase.workflowName + "\" and tableName=\"" + lastPhase.tableName + "\"") != RC_SUCCESS) {
					lastPhase.doInsert();
				}
				
				var rmessage = new SCFile( "scmessage" );
				var rmsql = "class=\"wfT\" and message.id=\""+lastPhase.phaseName+"_"+wfPhase.workflowName+"_"+wfPhase.tableName+":1\"";
				
				if ( rmessage.doSelect( rmsql ) == RC_SUCCESS )
				{
					rmessage.message = "Reopen";
					rmessage.doUpdate();
				}
				else
				{
					rmessage._class="wfT";
					rmessage.message_id=lastPhase.phaseName+"_"+wfPhase.workflowName+"_"+wfPhase.tableName+":1";
					rmessage.message = "Reopen";
					rmessage.doInsert();
				}
			}
			
			// check if the WorkflowPhase exists
			var checkPhase = new SCFile( "WorkflowPhase" );
			if (checkPhase.doSelect("phaseName=\"" + wfPhase.phaseName + "\" and workflowName=\"" + wfPhase.workflowName + "\" and tableName=\"" + wfPhase.tableName + "\"") != RC_SUCCESS) {
				var rc = wfPhase.doInsert();
			}
			
			var message = new SCFile( "scmessage" );
			var msql = "class=\"wfT\" and message.id=\""+wfPhase.phaseName+"_"+wfPhase.workflowName+"_"+wfPhase.tableName+":1\"";
			
			if ( message.doSelect( msql ) == RC_SUCCESS )
			{
				if ( changeCat.phases[next] != null ) {
					message.message = "Next Phase";
				}
				else {
					message.message = "Close";
				}
				message.doUpdate();
			}
			else
			{
				message._class="wfT";
				message.message_id=wfPhase.phaseName+"_"+wfPhase.workflowName+"_"+wfPhase.tableName+":1";
				if ( changeCat.phases[next] != null ) {
					message.message = "Next Phase";
				}
				else {
					message.message = "Close";
				}
				message.doInsert();
			}
			
			var localmessage = new SCFile( "scmessage" );
			msql = "class=\"local:WorkflowPhase\" and message.id=\""+wfPhase.phaseName+";"+wfPhase.workflowName+";"+wfPhase.tableName+"\"";
			
			if ( localmessage.doSelect( msql ) == RC_SUCCESS )
			{
				localmessage.message = wfPhase.phaseName;
				message.doUpdate();
			}
			else
			{
				
				localmessage._class="local:WorkflowPhase";
				localmessage.message_id=wfPhase.phaseName+";"+wfPhase.workflowName+";"+wfPhase.tableName;
				localmessage.message = wfPhase.phaseName;
				localmessage.doInsert();
			}
		}
		
		changePhase.doUpdate();
	}
}

function upgradeCategories()
{
	var changeCat = new SCFile( "cm3rcategory" );
	var sql = "true";
	
	if ( changeCat.doSelect( sql ) == RC_SUCCESS )
	{
		do
		{
			upgradeCategory( changeCat.name, "change" );
		}
		while ( changeCat.getNext() == RC_SUCCESS );
		
		
		var phase = new SCFile("cm3rcatphase");
		var rc = phase.doSelect("true");
		while(rc == RC_SUCCESS){
			phase.approvals = null;
			phase.doUpdate();
			rc = phase.getNext();
		}
	}
	
	var taskCat = new SCFile( "cm3tcategory" );
	if ( taskCat.doSelect( sql ) == RC_SUCCESS )
	{
		do
		{
			upgradeCategory( taskCat.name, "task" );
		}
		while ( taskCat.getNext() == RC_SUCCESS );
	}
}


function upgradeProfiles()
{
	var profile = new SCFile( "cm3profile" );
	var sql = "true";
	
	if ( profile.doSelect( sql ) == RC_SUCCESS )
	{
		do
		{
		//using the new role upgrade script	
		 lib.SecurityCM3ProfileCopy.upgradeProfiles(profile.name);
		 /**
			var role = new SCFile( "secRole" )
			var sql = "name=\""+profile.name+"\"";
			if ( role.doSelect( sql ) != RC_SUCCESS )
			{
				role.name = profile.name;
				role.description = profile.name;
				role.doInsert();
			}
			
			if ( profile.area == "a" || profile.area == "c" )
			{
				updateChangeRights( profile );
			}
			
			if ( profile.area == "a" || profile.area == "t" )
			{
				updateTaskRights( profile );
			}
		**/	
		}
		while ( profile.getNext() == RC_SUCCESS );
	}
}


function updateChangeRights( profile )
{
	var rights = new SCFile( "secRights" );
	var sql = "role=\""+profile.name+"\" and area=\"Change\"";
	var action = "update";
	
	if ( rights.doSelect( sql ) != RC_SUCCESS )
	{
		action = "add";
		rights.role = profile.name;
		rights.area = "Change";
	}
	
	rights.view = profile.view;
	rights._new = profile._new;
	rights.update = profile.update;
	rights.close = "never";
	if ( profile.close == true ) {
		rights.close = "always";
	}
	rights.modifyTemplate = profile.modifyTemplate;
	rights.expert = false;
	rights.admin = false;
	if ( profile.alert == true || profile.duplicates == true || profile.pagelist == true ) {
		rights.expert = true;
	}
	if ( profile.new_category == true || profile.phase_sel == true ) {
		rights.admin = true;
	}
	rights.allowedStatus = profile.allowedStatus;
	rights.allowedCategory = profile.allowed_cats;
	rights.settingId[0] = "append.query";
	rights.settingValue[0] = funcs.str( profile.append_query );
	rights.settingId[1] = "approvals";
	rights.settingValue[1] = funcs.str( profile.approvals );
	rights.settingId[2] = "approve.delegate";
	rights.settingValue[2] = funcs.str( profile.approve_delegate );
	rights.settingId[3] = "default.category";
	rights.settingValue[3] = funcs.str( profile.default_category );
	rights.settingId[4] = "default.task.category";
	rights.settingValue[4] = funcs.str( profile.default_task_category );
	rights.settingId[5] = "initial.format";
	rights.settingValue[5] = funcs.str( profile.initial_fmt );
	rights.settingId[6] = "initial.request.inbox";
	rights.settingValue[6] = funcs.str( profile.initial_request_inbox );
	rights.settingId[7] = "initial.task.inbox";
	rights.settingValue[7] = funcs.str( profile.initial_task_inbox );
	rights.settingId[8] = "partial.key";
	rights.settingValue[8] = funcs.str( profile.partial_key );
	rights.settingId[9] = "qbe.format";
	rights.settingValue[9] = funcs.str( profile.qbe_format );
	rights.settingId[10] = "reopen";
	rights.settingValue[10] = funcs.str( profile.reopen );
	rights.settingId[11] = "request.manage.format";
	rights.settingValue[11] = funcs.str( profile.request_manage_format );
	rights.settingId[12] = "skip.warning";
	rights.settingValue[12] = funcs.str( profile.skip_warning );
	rights.settingId[13] = "task.manage.format";
	rights.settingValue[13] = funcs.str( profile.task_manage_format );

	var folderList = []; 
	var folder = new SCFile( "FolderRights" );
	var foldersql = "name=\"" + profile.name + "\" and (tablename=\"cm3\" or tablename=\"cm3r\")";
	if ( folder.doSelect( foldersql ) == RC_SUCCESS )
	{
		do
		{
			if ( folder.view == true )
			{
				if ( funcs.index( folder.folder, folderList ) == 0 ) {
					folderList.push( folder.folder );
				}
			}
		} while ( folder.getNext() == RC_SUCCESS );
	}
	rights.folders = folderList;
	
	if ( action == "add" )
	{
		rights.doAction("add");
	}
	else
	{
		rights.doAction("save");
	}
}

function updateTaskRights( profile )
{
	var rights = new SCFile( "secRights" );
	var sql = "role=\""+profile.name+"\" and area=\"Change Tasks\"";
	var action = "update";
	
	if ( rights.doSelect( sql ) != RC_SUCCESS )
	{
		action = "add";
		rights.role = profile.name;
		rights.area = "Change Tasks";
	}
	
	rights.view = profile.view;
	rights._new = profile._new;
	rights.update = profile.update;
	rights.close = "never";
	if ( profile.close == true ) {
		rights.close = "always";
	}
	rights.modifyTemplate = profile.modifyTemplate;
	rights.expert = false;
	rights.admin = false;
	if ( profile.alert == true || profile.duplicates == true || profile.pagelist == true ) {
		rights.expert = true;
	}
	if ( profile.new_category == true || profile.phase_sel == true ) {
		rights.admin = true;
	}
	rights.allowedStatus = profile.allowedStatus;
	rights.allowedCategory = profile.allowed_cats;
	rights.settingId[0] = "append.query";
	rights.settingValue[0] = funcs.str( profile.append_query );
	rights.settingId[1] = "approvals";
	rights.settingValue[1] = funcs.str( profile.approvals );
	rights.settingId[2] = "approve.delegate";
	rights.settingValue[2] = funcs.str( profile.approve_delegate );
	rights.settingId[3] = "default.category";
	rights.settingValue[3] = funcs.str( profile.default_category );
	rights.settingId[4] = "default.task.category";
	rights.settingValue[4] = funcs.str( profile.default_task_category );
	rights.settingId[5] = "initial.format";
	rights.settingValue[5] = funcs.str( profile.initial_fmt );
	rights.settingId[6] = "initial.request.inbox";
	rights.settingValue[6] = funcs.str( profile.initial_request_inbox );
	rights.settingId[7] = "initial.task.inbox";
	rights.settingValue[7] = funcs.str( profile.initial_task_inbox );
	rights.settingId[8] = "partial.key";
	rights.settingValue[8] = funcs.str( profile.partial_key );
	rights.settingId[9] = "qbe.format";
	rights.settingValue[9] = funcs.str( profile.qbe_format );
	rights.settingId[10] = "reopen";
	rights.settingValue[10] = funcs.str( profile.reopen );
	rights.settingId[11] = "request.manage.format";
	rights.settingValue[11] = funcs.str( profile.request_manage_format );
	rights.settingId[12] = "skip.warning";
	rights.settingValue[12] = funcs.str( profile.skip_warning );
	rights.settingId[13] = "task.manage.format";
	rights.settingValue[13] = funcs.str( profile.task_manage_format );
	
	var folderList = []; 
	var folder = new SCFile( "FolderRights" );
	var foldersql = "name=\"" + profile.name + "\" and (tablename=\"cm3\" or tablename=\"cm3t\")";
	if ( folder.doSelect( foldersql ) == RC_SUCCESS )
	{
		do
		{
			if ( folder.view == true )
			{
				if ( funcs.index( folder.folder, folderList ) == 0 ) {
					folderList.push( folder.folder );
			    }
			}
		}	while ( folder.getNext() == RC_SUCCESS );
	}
	rights.folders = folderList;
	
	if ( action == "add" )
	{
		rights.doAction("add");
	}
	else
	{
		rights.doAction("save");
	}
}

function upgradeOperators()
{
	var operator = new SCFile("operator");
	var sql = "true";
	var index =0;
	if ( operator.doSelect( sql ) == RC_SUCCESS )
	{
		do
		{	
			for ( var i =0, lng = operator.profile_change.length(); i < lng ; i++ )
			{
                if (operator.profile_change[i] != null && operator.profile_change[i] != "" && funcs.index(operator.profile_change[i], operator.secRole) == 0) {
					operator.secRole = funcs.insert( operator.secRole, 0, 1, operator.profile_change[i] );
				}
			}
			index=funcs.index( "default", operator.secRole );
			if ( index > 0 )
			{    	    
				operator.secRole[index-1]="DEFAULT";
			}
			
			if ( funcs.lng( funcs.denull( operator.secRole ) ) == 0 )
			{
				operator.secRole[0] = "DEFAULT";
			}	
			operator.doUpdate();
		}
		while ( operator.getNext() == RC_SUCCESS );
	}
}


function updateChangePhases()
{
}

function deleteUnplannedClosedPhase()
{
      var wfPhase1 = new SCFile("WorkflowPhase");
      var wfPhase2 = new SCFile("WorkflowPhase");
      
      if(wfPhase1.doSelect("tableName=\"cm3r\" and workflowName=\"Unplanned Change\" and phaseName=\"Closure\"")==RC_SUCCESS)
      {
            if(wfPhase2.doSelect("tableName=\"cm3r\" and workflowName=\"Unplanned Change\" and phaseName=\"closed\"")==RC_SUCCESS)
            {
                  wfPhase2.doDelete();
            }
      }
}


/**
 * This function is used to fix bad data applied in PD 9.30.0. 
 */
function specialFix4ChangeApproval(){
	var version = new SCFile("patchrelversioninfo");
	var count = version.doCount("module=\"Process_Designer\"");
	if(count == 2){
		var rc = version.doSelect("module=\"Process_Designer\" and version=\"9.30.0\"");
		if(rc == RC_SUCCESS){
			var phase = new SCFile("WorkflowPhase");
			rc = phase.doSelect("phaseName=\"Change Approval\" and not null(approvals)");
			if(rc == RC_SUCCESS){
				var approvalPhase = new SCFile("WorkflowPhase");
				rc = approvalPhase.doSelect("phaseName=\"Change Approval\" and null(approvals)");
				while(rc == RC_SUCCESS){
					approvalPhase.approvals = phase.approvals;
					approvalPhase.doUpdate();
					rc = approvalPhase.getNext();
				}
			}
		}
	}
}