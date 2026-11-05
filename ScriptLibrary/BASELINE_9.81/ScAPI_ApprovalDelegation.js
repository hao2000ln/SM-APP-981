/** @fileoverview ApprovalDelegation - contains functions used by the SRC Approval Delegation module
*   @author Beddy
*/
var select = lib.ScAPI_RAD._select;
var queryBuilder = lib.ScAPI_RAD._queryBuilder;
var approval_delegation_get_groups = lib.ScAPI_RAD.approval_delegation_get_groups;
var us_notify = lib.ScAPI_RAD.us_notify;

var NO_RECORD_EXIT = lib.ScAPI_Constants.NO_RECORD_EXIT();
var NORMAL_EXIT = lib.ScAPI_Constants.NORMAL_EXIT();
var BAD_VALIDATION_EXIT = lib.ScAPI_Constants.BAD_VALIDATION_EXIT();
var getQuoteFileName = lib.ScAPI_Util.getQuoteFileName;
var setExitType = lib.ScAPI_Util.setExitType;
var setErrorMsg = lib.ScAPI_Util.setErrorMsg;

var log = lib.ScAPI_Logger.log("ScAPI_ApprovalDelegation");


var delegateModuleNode = function(v,n) { this.value = v; this.name = n; };

function isValueInModules(lValue, lModules)
{
    var i;
    for (i = 0; i < lModules.length; i++)
    {
        if (lModules[i].value == lValue) {
            return true;
        }
    }
    
    return false;
}

// Return a delegateModuleNode array which related the given operator
function getApprovalDelegationModules(lOperator)
{
    var modules = [];
    
    var objSql = 'approval.location~="" or approval.status.field~="" ';
    var obj = new SCFile('Object', SCFILE_READONLY);
    obj.setFields(["file.name"]);
    var rlt = obj.doSelect(objSql);
    
    // Prepare variables to used by customer plugin
    vars['$avail.approval.modules.value'] = [];
    vars['$avail.approval.modules'] = [];
    
    var pdEnabled = lib.ProcessDesignerEnablement.isRequestEnabled();
    var useLagacyQuote = lib.ProcessDesignerEnablement.isNonPDRequestInParallel();
    
    // Check all selected Object records
    while (rlt == RC_SUCCESS)
    {
        var fileName = obj['file.name'];
        var value;
        var name;
        var module;
        if (fileName == 'cm3r' || fileName == 'cm3t')
        {
            value = 'Change';
            if (!isValueInModules(value, modules)) // This module was not added
            {
	            name = funcs.scmsg(value, 'approval');
	            
	            var hasRight = lib.security.getRights(value, "approve.delegate");
	            if (hasRight == null)
	            {
	            	hasRight = vars['$G.cm3r.environment']['approve.delegate'];
	            }
                else
                {
	            	hasRight=(hasRight=="true"?true:false);
                }
	            if (hasRight)
	            {
	            	modules.push(new delegateModuleNode(value, name));
	            	vars['$avail.approval.modules.value']=funcs.insert(vars['$avail.approval.modules.value'], 1, 1, value);	
					vars['$avail.approval.modules']=funcs.insert(vars['$avail.approval.modules'], 1, 1, name);
	            }
            }
        }
        else if (fileName == 'incidents')
        {
            value = 'SVC';
            module = 'Service Desk';
            if (!isValueInModules(value, modules)) // This module was not added
            {
	            name = funcs.scmsg(value, 'approval');
	            
	            var hasRight = lib.security.getRights(module, "approve.delegate");
	            if (hasRight == null)
	            {
	            	hasRight = vars['$G.sm.environment']['approve.delegate'];
	            }
                else
                {
	            	hasRight=(hasRight=="true"?true:false);
                }
	            if (hasRight)
	            {
	            	modules.push(new delegateModuleNode(value, name));
	            	vars['$avail.approval.modules.value']=funcs.insert(vars['$avail.approval.modules.value'], 1, 1, value);	
					vars['$avail.approval.modules']=funcs.insert(vars['$avail.approval.modules'], 1, 1, name);
	            }
            }
        }
        else if (fileName == "ocmq" && ( (pdEnabled && useLagacyQuote) || !pdEnabled ))
        {
            value = 'Request';
            module = "Request";
            if (!isValueInModules(value, modules)) // This module was not added
            {
	            name = funcs.scmsg(value, 'approval');
	            var hasRight;
            	hasRight = vars['$G.ocmq.environment']['approve.delegate'];
	            if (hasRight)
	            {
	            	modules.push(new delegateModuleNode(value, name));
	            	vars['$avail.approval.modules.value']=funcs.insert(vars['$avail.approval.modules.value'], 1, 1, value);	
					vars['$avail.approval.modules']=funcs.insert(vars['$avail.approval.modules'], 1, 1, name);
	            }
            }
        }
        else if (pdEnabled && fileName == "request")
        {
 			value = 'Request';
            module = "Request";
        	if (useLagacyQuote) {
        		value = 'PD Request';
            	module = "PD Request";
        	}

            if (!isValueInModules(value, modules)) // This module was not added
            {
	            name = funcs.scmsg(value, 'approval');
	            var hasRight;
	            hasRight = lib.security.getRights("Request", "approve.delegate");
	            if (hasRight == "false" || hasRight == null) {
	            	hasRight = false;
	            }
	            if (hasRight == "true") {
	            	hasRight = true;
	            }
	            if (hasRight)
	            {
	            	modules.push(new delegateModuleNode(value, name));
	            	vars['$avail.approval.modules.value']=funcs.insert(vars['$avail.approval.modules.value'], 1, 1, value);	
					vars['$avail.approval.modules']=funcs.insert(vars['$avail.approval.modules'], 1, 1, name);
	            }
            }
        }
        else
        {
            lib.ApprovalCustomPlugin.checkProfileForModule(fileName, lOperator);
            
            // Get result from two RAD array
            var len = vars['$avail.approval.modules.value'].length();
            var i;
            for (i = 0; i < len; i++)
            {
            	if (vars['$avail.approval.modules.value'][i] != "Change" && vars['$avail.approval.modules.value'][i] != "SVC" && vars['$avail.approval.modules.value'][i] != "Request"
            		&& vars['$avail.approval.modules.value'][i] != "PD Request"){
                	modules.push(new delegateModuleNode(vars['$avail.approval.modules.value'][i], vars['$avail.approval.modules'][i]));
                }
            }
        }
        
        rlt = obj.getNext();
    }
    
    // Check whether need to add "all" module
    if (isValueInModules('SVC', modules)
     && isValueInModules('Request', modules)
     && isValueInModules('Change', modules)
	 && ((pdEnabled && useLagacyQuote) ? isValueInModules('PD Request', modules) : true)
     )
    {
        modules.push(new delegateModuleNode('all', 'all'));
    }
    return modules;
}

function getDelegationModules()
{
    // Default type is "normal"
	setExitType(NORMAL_EXIT);
	
	var currentOperator = vars['$lo.operator'];
	
    vars['$L.file']['login.name']   = currentOperator['name'];
    vars['$L.file']['contact.name'] = currentOperator['contact.name'];
    vars['$L.file']['delegate.all'] = false; // Default value for delegate.all is false
    
	var modules = getApprovalDelegationModules(currentOperator);
	
	var i;
	for (i = 0; i < modules.length; i++)
	{
	    if (modules[i].value == 'all')
	    {
	        vars['$L.file']['delegate.all'] = true;
	        continue;
	    }
	    
	    vars['$L.file']['delegate.module'][i]['value'] = modules[i].value;
	    vars['$L.file']['delegate.module'][i]['name']  = modules[i].name;
	}
}

function getDelegationList()
{
    // Default type is "normal"
	setExitType(NORMAL_EXIT);
	
	var operatorName = funcs.operator();
	vars['$L.file']['approver'] = operatorName;
	
	var delegationSql  = 'Enable=true and Approver="' + operatorName + '" and DateTo>=tod() and AppModule<>"Timeperiod"';
	var delegationList = select('ApprovalDelegation', delegationSql);
	
	if (delegationList != null)
	{
	    var i = 0;
	    do
	    {
	        vars['$L.file']['delegation.list'][i]['delegate.to']   = delegationList['Delegate'];
	        vars['$L.file']['delegation.list'][i]['app.module']    = delegationList['AppModule'];
	        vars['$L.file']['delegation.list'][i]['app.group']     = delegationList['AppGroup'];
	        vars['$L.file']['delegation.list'][i]['date.from']     = delegationList['DateFrom'];
	        vars['$L.file']['delegation.list'][i]['date.to']       = delegationList['DateTo'];
	        vars['$L.file']['delegation.list'][i]['enable']        = delegationList['Enable'];
	        vars['$L.file']['delegation.list'][i]['delegation.id'] = delegationList['delegation.id'];
	        vars['$L.file']['delegation.list'][i]['date.from.str'] = funcs.str(delegationList['DateFrom']);
	        vars['$L.file']['delegation.list'][i]['date.to.str']   = funcs.str(delegationList['DateTo']);
	        var delegateToOpt = select('operator', 'name="'+delegationList['Delegate']+'"',['full.name']);
	        if (delegateToOpt != null) {
	            vars['$L.file']['delegation.list'][i]['delegate.to.full.name'] = delegateToOpt['full.name'];
	        }	
	            
 	     i++;
	    } while (delegationList.getNext() == RC_SUCCESS);
	}
	 
}

function getApprovalGroups()
{
	var module = vars['$L.file']['module'];
	if (module == null) // module can't be null
	{
	    setExitType(BAD_VALIDATION_EXIT);
	    setErrorMsg(lib.ScAPI_Util.getMessage(159));
	    return;
	}
	
	// Default type is "normal"
	setExitType(NORMAL_EXIT);
	
    var approvalGroups = approval_delegation_get_groups(module);
    var i;
    var length = approvalGroups.length();
    for (i = 0; i < length; i++)
    {
        vars['$L.file']['approval.group'][i] = approvalGroups[i];
    }
}

function createDelegation()
{
    // Default type is "badval"
    setExitType(BAD_VALIDATION_EXIT);
	
	var currentOperator = vars['$lo.operator'];
	
	// Input field validation
	var module = vars['$L.file']['AppModule'];                       //Check:module
	if (module == null)
	{
	    setErrorMsg(lib.ScAPI_Util.getMessage(160));
	    return;
	}
	var moduleList = getApprovalDelegationModules(currentOperator);
	if (!isValueInModules(module, moduleList))
	{
	    setErrorMsg(lib.ScAPI_Util.getMessage(161));
	    return;
	}
	if (module == 'all') //Set group to all when module is all
	{
	    vars['$L.file']['AppGroup'] = 'all';
	}
	var startDate = vars['$L.file']['DateFrom'];                    //Check:StartDate
	if (startDate == null)
	{
	    setErrorMsg(lib.ScAPI_Util.getMessage(164));
	    return;
	}
	var endDate = vars['$L.file']['DateTo'];                        //Check:EndDate
	if (endDate == null)
	{
	    setErrorMsg(lib.ScAPI_Util.getMessage(165));
	    return;
	}
	if (startDate >= endDate) // endDate cannot be earlier than startDate.
	{
	    setErrorMsg(lib.ScAPI_Util.getMessage(174));
	    return;
	}
	if (endDate < new Date()) // endDate cannot be in the past
	{
	    setErrorMsg(lib.ScAPI_Util.getMessage(175));
	    return;
	}
	var delegate = vars['$L.file']['Delegate'];                     //Check:delegate
	if (delegate == null)
	{
	    setErrorMsg(lib.ScAPI_Util.getMessage(166));
	    return;
	}
	// check whether delegate is valid
	var filterQuery = queryBuilder('name="%s" and ' + lib.ApprovalUtil.getFilteredQuery(module), [delegate]);
	if (select('operator', filterQuery, ['name']) == null)
	{
	    setErrorMsg(lib.ScAPI_Util.getMessage(173, [delegate]));
	    return;
	}
	var group = vars['$L.file']['AppGroup'];                        //Check:group
	if (group == null)
	{
	    setErrorMsg(lib.ScAPI_Util.getMessage(162));
	    return;
	}
	var groupList = approval_delegation_get_groups(module);
	if (group != 'all' && funcs.index(group, groupList) < 1) // If group is all, no need to check group name
	{
	    setErrorMsg(lib.ScAPI_Util.getMessage(163));
	    return;
	}
	
	var rc = true;
	
	var dupSqlTpl = "Approver=\"%s\" and Delegate=\"%s\" and AppModule=\"%s\" and DateTo>='%s' and DateFrom<='%s' and AppGroup=\"%s\"";
	var dupSqlTplSmp = queryBuilder(dupSqlTpl, [currentOperator['name'], delegate,module, funcs.str(endDate), funcs.str(startDate)]);
	var multiMode = (module != 'all' && group == 'all');
    if (!multiMode)
    {
        var dupSql = queryBuilder(dupSqlTplSmp, [group]);
        
		// Check if this record is duplicate
		if (select('ApprovalDelegation', dupSql + " and Enable=true", ['delegation.id']) != null)
		{
		    setErrorMsg(lib.ScAPI_Util.getMessage(178, [delegate, module, group]));
		    return;
		}
		
		var dFile = select('ApprovalDelegation', dupSql + " and (Enable=false or Enable=NULL)");
		if (dFile == null)
		{
			// Set other fileds
			vars['$L.file']['Approver'] = currentOperator['name']; //Set Approver
			vars['$L.file']['AppArea'] = getModuleGroupArea(currentOperator, module, group); //Set AppArea
			vars['$L.file']['delegation.id'] = null; //Clear delegation.id
			vars['$L.file']['Enable'] = true; //Set Enable to true for add
			
			// Do add action
			rc = vars['$L.file'].doAction('add');
            if (rc === true || rc === RC_SUCCESS) {
                setExitType(NORMAL_EXIT);
                logMessage("add");
            }
		}
		else // already have one delegation record have a coincident date duration, just update its duration and enable it
		{
		    dFile['DateFrom'] = startDate;
		    dFile['DateTo'] = endDate;
		    dFile['Enable'] = true;
		     
		    rc = dFile.doAction('save');
		     
            if (rc === true || rc === RC_SUCCESS) {
                // write back the delegation id
                vars['$L.file']['delegation.id'] = dFile['delegation.id'];

                setExitType(NORMAL_EXIT);
                logMessage("update");
            }
		}
    }
    else // There will be several approval delegation records created
    {
        // If module is not all, and group is all, we need to create record for every group in the given module
        var succNbr = 0;
        var errNbr = 0;
        var rtnCode = new SCDatum();
        
        var errorGroups = []; //error groups to combine error message
        
        var i;
        for (i in groupList)
        {
            var dupSql = queryBuilder(dupSqlTplSmp, [groupList[i]]);
            
            // Check if this record is duplicate
            if (select('ApprovalDelegation', dupSql + " and Enable=true", ['delegation.id']) != null)
			{
			    errNbr++;
			    
			    // Output failed message
			    errorGroups.push(groupList[i]);
			    
			    continue;
			}
			
			var dFile = select('ApprovalDelegation', dupSql + " and (Enable=false or Enable=NULL)");
			if (dFile == null)
			{
				// Set other fileds
				vars['$L.file']['AppGroup'] = groupList[i]; // Set group
				vars['$L.file']['Approver'] = currentOperator['name']; //Set Approver
				vars['$L.file']['AppArea'] = getModuleGroupArea(currentOperator, module, groupList[i]); //Set AppArea
				vars['$L.file']['delegation.id'] = null; //Clear delegation.id
				vars['$L.file']['Enable'] = true; //Set Enable to true for add
				
				// Do add action
			    rc = vars['$L.file'].doAction('add');
		    }
		    else // already have one delegation record have a coincident date duration, just update its duration and enable it
		    {
		        dFile['DateFrom'] = startDate;
			    dFile['DateTo'] = endDate;
			    dFile['Enable'] = true;
			     
			    rc = dFile.doAction('save');
			    
			    // write back the delegation id
		        vars['$L.file']['delegation.id'] = dFile['delegation.id'];
		    }
		    
		    if (rc === true || rc === RC_SUCCESS) {
		        succNbr++;
		    }
		    else {
		        errNbr++;
		    }
        }
        
        //combit errorGroups to string
        if (errorGroups.length > 0) {
        	var strErrorGroup = "";
        	var i;
        	for (i = 0; i < errorGroups.length; i++) {
        		strErrorGroup += errorGroups[i];
        		if (i < errorGroups.length - 1) {
        			strErrorGroup += ", ";
        		}
        	}
        	funcs.rtecall('msg', rtnCode, lib.ScAPI_Util.getMessage(178,[delegate, module, strErrorGroup]));
        }
        
        // Successful added or no error occur
        if (succNbr > 0 || errNbr == 0) {
            setExitType(NORMAL_EXIT);
        }
    }
}

function updateDelegation()
{
    var delegationId = vars['$L.file']['delegation.id'];
    if (delegationId == null)
    {
        setExitType(BAD_VALIDATION_EXIT);
        setErrorMsg(lib.ScAPI_Util.getMessage(167));
        return;
    }
    var query = 'delegation.id=' + delegationId + ' and Approver="' + funcs.operator() + '"';
    var lFile = select('ApprovalDelegation', query);
    if (lFile == null)
    {
        setExitType(NO_RECORD_EXIT);
        return;
    }
    
    // Copy $L.file fields to lFile
    var copyFields = ['Delegate', 'DateFrom', 'DateTo', 'Enable'];
    var i;
    for (i = 0; i < copyFields.length; i++)
    {
        var tmp = vars['$L.file'][copyFields[i]];
        if (tmp != null) {
            lFile[copyFields[i]] = tmp; //If not null, then copy
        }
    }
    
    // Input variable validation
    var startDate = lFile['DateFrom'];
	var endDate   = lFile['DateTo'];
	var module    = lFile['AppModule'];
	var delegate  = lFile['Delegate'];
	if (startDate >= endDate)  // endDate cannot be earlier than startDate.
	{
	    setExitType(BAD_VALIDATION_EXIT);
	    setErrorMsg(lib.ScAPI_Util.getMessage(174));
	    return;
	}
	if (endDate < new Date()) // endDate cannot be in the past
	{
	    setExitType(BAD_VALIDATION_EXIT);
	    setErrorMsg(lib.ScAPI_Util.getMessage(175));
	    return;
	}
	// check whether delegate is valid
	var filterQuery = queryBuilder('name="%s" and ' + lib.ApprovalUtil.getFilteredQuery(module), [delegate]);
	if (select('operator', filterQuery, ['name']) == null)
	{
	    setExitType(BAD_VALIDATION_EXIT);
	    setErrorMsg(lib.ScAPI_Util.getMessage(173, [delegate]));
	    return;
	}
	
	//QCCR1M4082 Do not check any more
    // Check if this record is duplicate

    // Do update action
    var rc = lFile.doAction('save');

    if (rc === true || rc === RC_SUCCESS) {
        // Default type is "normal"
        setExitType(NORMAL_EXIT);
    }
    else {
        setExitType(BAD_VALIDATION_EXIT);
    }
   
    /* Do Update notification
	 * No need to call by JS code, this notification will be generated by DocEngine
	 * us_notify('Approval Delegation Updated', vars['$L.file']);
	 */
}

// Return the area of the given module and group 
function getModuleGroupArea(operator, module, group)
{
    var area = null; // init area to null 
    if (module == 'Change')
    {
    	if(lib.ProcessDesignerEnablement.isChangeEnabled()) {
    		return 'a';
    	}
        var profileSql = 'name isin ' + funcs.str(operator['profile.change']);
        var profile = new SCFile('cm3profile', SCFILE_READONLY);
        var pRlt = profile.doSelect(profileSql);
        while (pRlt == RC_SUCCESS)
        {
            if (profile['approvals'] == true && profile['approve.delegate'] == true)
            {
                var i;
                for (i in profile['approval.groups'])
                {
                    if (profile['approval.groups'][i] == group)
                    {
                        area = profile['area'];
                        break;
                    }
                }
            }
            
            if (area != null) {
                break; //We have found area, so no need to continue
            }
            pRlt = profile.getNext();
        }
    }
    else if (module == 'Request')
    {
    	var useLagacyQuote = lib.ProcessDesignerEnablement.isNonPDRequestInParallel();
      	if(lib.ProcessDesignerEnablement.isRequestEnabled() && !useLagacyQuote) {
    		return 'a';
    	}
        var profileSql = 'name isin ' + funcs.str(operator['profile.request']);
        var profile = new SCFile('ocmprofile', SCFILE_READONLY);
        var pRlt = profile.doSelect(profileSql);
        while (pRlt == RC_SUCCESS)
        {
            if (profile['approve'] == true && profile['approve.delegate'] == true)
            {
                var i;
                for (i in profile['approval.groups'])
                {
                    if (profile['approval.groups'][i] == group)
                    {
                        area = profile['area'];
                        break;
                    }
                }
            }
            
            if (area != null) {
                break; //We have found area, so no need to continue
            }
            pRlt = profile.getNext();
        }
    }
    if (module == 'PD Request')
    {
    	return 'a';
    }
    
    if (area == null) {
        return 'a'; // Default value is "a"
    }
    return area;
}

function getDelegateToList()
{
    var currentOperator = vars['$lo.operator'];
    
    // Default type is "badval"
    setExitType(BAD_VALIDATION_EXIT);
    
    var module = vars['$L.file']['module'];                       //Check:module
	if (module == null)
	{
	    setErrorMsg(lib.ScAPI_Util.getMessage(160));
	    return;
	}
	var moduleList = getApprovalDelegationModules(currentOperator);
	if (!isValueInModules(module, moduleList))
	{
	    setErrorMsg(lib.ScAPI_Util.getMessage(161));
	    return;
	}
	
	// Default type is "normal"
    setExitType(NORMAL_EXIT);
	
	// Set default value
	if (vars['$L.file']['startId'] == null  || vars['$L.file']['startId'] < 1)
	{
	    vars['$L.file']['startId']  = 1;
	}
	if (vars['$L.file']['pageSize'] == null || vars['$L.file']['pageSize'] < 1)
	{
	    vars['$L.file']['pageSize'] = 10;
	}
	
	// Build up query
	var startId  = vars['$L.file']['startId'];
	var pageSize = vars['$L.file']['pageSize'];
	var firstNameFilter   = vars['$L.file']['firstName'];
	var lastNameFilter    = vars['$L.file']['lastName'];
	var contactNameFilter = vars['$L.file']['contactName'];
    var filterQuery = '('+lib.ApprovalUtil.getFilteredQuery(module)+')';
    
    var firstLastQuery = null;
    var contactNameQuery = null;
    
    //make contact.query
	if (contactNameFilter != null)
	{
		contactNameQuery = 'file.contacts,contact.name#"' + contactNameFilter + '"';
	}
	
	//first.name and last.name query
    if (firstNameFilter != null)
    {
        firstLastQuery = 'first.name#"' + firstNameFilter + '"';
    }
    if (lastNameFilter != null)
    {
        if (firstLastQuery == null) {
            firstLastQuery = 'last.name#"' + lastNameFilter + '"';
        }
        else {
            firstLastQuery += ' and last.name#"' + lastNameFilter + '"';
        }
    }
    
    //composite query
    //query like: and (contact.name#"cn' or (first.name#"fn" and last.name#"ln"))
    if (contactNameQuery != null && firstLastQuery != null)
    {
        filterQuery += ' and (' + contactNameQuery + ' or (' + firstLastQuery + '))';
    }
    else
    {
        if (contactNameQuery != null) {
            filterQuery += ' and (' + contactNameQuery + ')';
        }
        else if (firstLastQuery != null) {
            filterQuery += ' and (' + firstLastQuery + ')';
        }
    }

    var valueFields = ['name', 'contact.name', 'full.name', 'first.name', 'last.name'];
    var needFields  = ['file.operator,name', 'file.operator,contact.name', 'file.operator,full.name', 'file.contacts,first.name', 'file.contacts,last.name'];
    var lOperator = select('operator-contacts', filterQuery, needFields);

    vars.$L_file._count = lib.ScAPI_RAD._count('operator-contacts', filterQuery);
    if (lOperator != null)
    {
        var j;
        for (j = 1; j < startId; j++) {
            // Skip startId
            if (lOperator.getNext() != RC_SUCCESS) {
                break;
            }
        }
        if (j >= startId) // If j < startId, no enough records to skip, so no records need to return
        {
	        var idx = 0;
	        do
	        {
	            var i;
	            for (i=0;i<needFields.length;i++) {
	                vars['$L.file']['delegate.list'][idx][valueFields[i]] = lOperator[needFields[i]];
	            }
	            
	            if (++idx >= pageSize) {
	                break;
	            }
	        } while (lOperator.getNext() == RC_SUCCESS);
        }
    }
}


/**
 * Log message which will be shown in the SOAP response
 */
function logMessage(action) {
    var rc = new SCDatum();
    var objname = funcs.scmsg("ApprovalDelegation", "tablename");
    
    if (action == "add") {
        funcs.rtecall("msg", rc, funcs.scmsg("8", "object", [objname]), 1);
    }
    else if (action == "update") {
        funcs.rtecall("msg", rc, funcs.scmsg("6", "object", [objname]), 1);
    }
}