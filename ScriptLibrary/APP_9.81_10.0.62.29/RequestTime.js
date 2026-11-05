////////////////////////////////////////////////////////////////
//// Calculate Global lead time and request delivery date///////
////////////////////////////////////////////////////////////////

function getTaskDependency(taskid, tasks, container, deep)
{
	var len=!funcs._null(tasks) ? tasks.length() : 0;
	var max=0;
	
	var i;
	var j;
	for(i=0; i<len; i++){
		if(taskid==tasks[i].taskId){
			var tt=timestr2num(getMyPlannedLeadTime(tasks[i], "planned"));
			var deps=tasks[i].dependentIds;			
			if(deps!=null){
				var len1=0;
				len1=deps.length();
				if(len1>0){
					for(j=0; j<len1; j++){
						var temp=getTaskDependency(deps[j], tasks, container, deep+1);						
						if(max<temp){
							max=temp;
						}
					}				
					max=max+tt; 
				}else{
					max=tt;
				}	
			}else{
				max=tt; 
			}			
		}
	}
	container.push(max);
	return max;
}


function getLeadTime(fileId, fileName)
{
	var plan=new SCFile("changePlan", SCFILE_READONLY);
	var sql="fileId= \""+fileId+"\" and fileName=\""+fileName+"\"";	
	var max=0;
	var sum=0;
	
	if ( plan.doSelect( sql ) === RC_SUCCESS ){
		var len=plan.tasks.length();
		var i;	
		for(i=0; i<len; i++){
			var t=plan.tasks[i];
			var deep=0;
			var container=[];
			getTaskDependency(t.taskId, plan.tasks, container, deep);	
			var tlen = container.length;
			sum=sum+timestr2num(getMyPlannedLeadTime(t, "planned"));
			if(max<container[tlen-1]){
				max=container[tlen-1];
			}
		}	
	}
	return {"max":max, "sum":sum};
}

function getMyGlobalLeadTime(record)
{
	var fileId=record.id;
	var fileName=funcs.filename(record);
	var ret=getLeadTime(fileId, fileName);	
	
	if(ret.max !== 0 && ret.sum !== 0){

		if(record.global_lead_time == null|| funcs.val(record.global_lead_time,3) === funcs.val("00:00:00",3)){
			record.global_lead_time=funcs.val(num2timestr(ret.max),3);
		}
	
		record.global_lead_time_max=funcs.val(num2timestr(ret.sum),3);
		record.global_lead_time_min=funcs.val(num2timestr(ret.max),3);
	}
	return;
}

function getMyDeliveryDate(record)
{
	var fileId=record.modelId;
	var fileName="requestModel";
	var plan=new SCFile("changePlan", SCFILE_READONLY);
	var sql="fileId= \""+fileId+"\" and fileName=\""+fileName+"\"";
	var container=[];
	if(record.submit_date === null || record.submit_date === ""){
		record.submit_date=funcs.tod();
	}
	var deliveryTime=record.submit_date;
	
	if ( plan.doSelect( sql ) === RC_SUCCESS ){
		var task0 = plan.tasks[0];
		if (task0 != null && task0.taskId != null) {
			getEndTime(task0, record.submit_date, plan.tasks, container);
			var len=container.length;
			var i;
			for(i=0;i<len;i++){
				if(container[i]>deliveryTime) {
					deliveryTime=container[i];
				}
			}
		}
	}
	
	record.delivery_date=deliveryTime;
}

function getEndTime(task, startTM, tasks, contain){
	var leadTime=getMyPlannedLeadTime(task, "planned");
	var calendar=getMyCalendar(task);
	var timezone=vars['$G.system.info'].time_zone;
	
	var tempEndTM=getAdjustedDate("", startTM, leadTime, calendar, timezone);
	var deps=getNextTasks(task.taskId, tasks);
	var length=	deps.length;
	if(length>0){
		var i;
		for(i=0;i<length;i++){
			startTM=tempEndTM;
			getEndTime(deps[i], startTM, tasks, contain);
		}
	}else{
		 contain.push(tempEndTM);
	}
}

function getNextTasks(taskid, tasks)
{
	var nextTasks=[];
	var len=!funcs._null(tasks) ? tasks.length() : 0;
	var i;
	var j;
	for(i=0;i<len;i++){
		var t=tasks[i];
		var dependent=t.dependentIds;
		if(dependent!==null){ 
			var ll=dependent.length();
			for(j=0;j<ll;j++){
				if(dependent[j]==taskid){
					nextTasks.push(tasks[i]);
				}
			}
		}
	}
	return nextTasks;
}

function calculateDeliveryDate(record)
{
	var fileId=record.number;
	var fileName="request";
	var ret=getLeadTime(fileId, fileName);
	record.global_lead_time=funcs.val(num2timestr(ret.max),3);
	
	var num1=timestr2num(record.submit_date);
	num1=num1 + ret.max;
	record.delivery_date=funcs.val(num2timestr(num1),3);
	return;
}

function getMyCalendar(task)
{
	var calendar = null;
	var settings = task.taskFieldsSetting;
	// var calendarList = vars["$G.calendars"];
	if(settings==null){
		return calendar;
	}
		
	var len=settings.length();
	var i;
	for(i=0;i<len;i++){
		var set=settings[i];
		if(set.fieldName=="calendar.name"){
			calendar=set.fieldValue;
		}
	}
	return calendar;
}

////////////////////////////////////////////////////////////////
///////// Calculate Plan Start date and Plan end date ///////////
////////////////////////////////////////////////////////////////

function calculatePlanStartAndPlanEnd(myEnd, taskid, tasks, container, invoker)
{
	var me=getMe(taskid, tasks);
	if (!me) {
	   return;
	}
	
	var myLead = getMyLeadTime(me, invoker);
	var myDesc = me.taskDescription;
	var myDuty = getMyCalendar(me);	
    var timezone = vars['$G.system.info'].time_zone;
    
	var myStart=0;
	if(myDuty==null||myDuty==""){
		myStart = timestr2num(myEnd)-timestr2num(myLead);
	}
	else{
		myStart = getMyStart(myEnd, myLead, myDuty, timezone);
	}
	operateStartAndEnd(myDesc, taskid, myStart, myEnd, myLead, container);
	var myDepIDs=getMyDepends(taskid, tasks);
	if(myDepIDs==null){
		return;
	}else{
		var len=myDepIDs.length();
		var i;
		for(i=0; i<len; i++){
			calculatePlanStartAndPlanEnd(myStart, myDepIDs[i], tasks, container, invoker);
		}
	}
}
 
function getMyLeadTime(task, invoker)
{
	var myLead = getMyPlannedLeadTime(task, invoker);
	var taskNumber=task.taskNumber;
	var taskfile=new SCFile("requestTask", SCFILE_READONLY);
	taskfile.setFields(["actual.lead.time"]);
	var sql="number=\""+taskNumber+"\"";
	if ( taskfile.doSelect( sql ) === RC_SUCCESS ){
		if(taskfile.actual_lead_time!==null && taskfile.actual_lead_time!==""){
			myLead = taskfile.actual_lead_time;
		}
	}
	myLead=funcs.val(myLead,2);
	return myLead;
}


function getMe(taskid, tasks)
{
	var len=!funcs._null(tasks) ? tasks.length() : 0;
	var i;
	for(i=0; i<len; i++){
		var t=tasks[i];
		if(taskid === t.taskId){
			return t;
		}
	}
	
	return null;
}

function getMyStart(end, interval, dutyTable, timezone)
{
	if(interval=="00:00:00"){
		rs=end;
		return timestr2num(rs);
	}
	var _calExpr = lib.SysUtil._parse( '$L.void=rtecall("callrad", NULL, "calendar.calc.date", {"times,1","times,2","prompt", "name"}, { $L.end, $L.interval, $L.duty.table, $L.time.zone}, false, true)', lib.SysUtil.SMTYPE.Expression );
	vars.$L_end = funcs.val(end,3);
  
	interval = timestr2num(interval)*(-1);
	vars.$L_interval = funcs.val(interval,3); 
  
	vars.$L_duty_table = dutyTable;
	vars.$L_time_zone = timezone;
	lib.SysUtil._evaluate( _calExpr );
	var rs=vars["$calendar.calc.date.neg.rt"];
	return timestr2num(rs);
}

function getMyDepends(taskid, tasks)
{
	var len=tasks.length();
	var i;
	for(i=0; i<len; i++){
		var t=tasks[i];
		if(taskid === t.taskId){
			return t.dependentIds;
		}
	}
}

function getModelVendorLeadTime(partno, vendor)
{
	var modelvendor=new SCFile("modelvendor", SCFILE_READONLY);
	modelvendor.setFields(["delivery.lead.time"]);
	var sql="part.no=\""+partno+"\" and vendor=\""+vendor+"\"";

	if(modelvendor.doSelect(sql)=== RC_SUCCESS){
		var ret= funcs.str(modelvendor.delivery_lead_time);
		
		if(ret!=null && ret!=""){
		
			if(ret.substring(0,1)=="-"){
				return(ret.substring(1));
			}else{
				return ret;
			}
		}
	}
	return "00:00:00";
}

function queryTaskPlanLeadTimeFromChangePlan(task)
{
	var tfs = task.taskFieldsSetting;
		
	if(tfs == null){
		return "00:00:00";
	}

	var len=tfs.length();
	if(len > 0){
		var planleadtime="";
		var partno="";
		var vendor="";

		var i;			
		for(i=0; i<len; i++){
			var t=tfs[i];
			if(t.fieldName=="planned.lead.time"){
				planleadtime = t.fieldValue;
			}	
			if(t.fieldName=="part.no"){
				partno = t.fieldValue;
			}
			if(t.fieldName=="vendor"){
				vendor = t.fieldValue;
			}			
		}
		
		if(planleadtime.length>0){
			return planleadtime;
		}else if(partno.length>0 && vendor.length>0){
			return getModelVendorLeadTime(partno, vendor);
		}else{
			return "00:00:00";
		}
	}else{
		return "00:00:00"; 
	}
}

function getMyPlannedLeadTime(task, invoker)
{
	if(invoker=="planned"){
		return queryTaskPlanLeadTimeFromChangePlan(task);
	}else if(invoker=="contractual"){
		var taskfile=new SCFile("requestTask", SCFILE_READONLY);
		taskfile.setFields(["actual.lead.time"]);
		var sql="number=\""+task.taskNumber+"\"";
		if ( taskfile.doSelect( sql ) === RC_SUCCESS ){
			if(taskfile.actual_lead_time == null || taskfile.actual_lead_time== ""){
				return taskfile.actual_lead_time;
			}else{
				return queryTaskPlanLeadTimeFromChangePlan(task);
			}
		}else{
			return queryTaskPlanLeadTimeFromChangePlan(task);
		}	
	}else{
		return "00:00:00";
	}
}

function operateStartAndEnd(taskdesc, taskid, myStart, myEnd, myLead, c)
{
	c.push({"taskdesc": taskdesc, "taskid": taskid, "myStart": myStart, "myEnd": myEnd, "myLead":myLead});
	return;
}

function rootNodeFunction(tasks, invoker, parentDeliveryDateStr)
{
	var noOneDependsOnMe=getNoOneDependsOnMe( tasks );
	var len=noOneDependsOnMe.length;
	var allend=parentDeliveryDateStr;
	var container=[];
	var i;
	for(i=0; i<len; i++){
		var temp=noOneDependsOnMe[i];
		calculatePlanStartAndPlanEnd(allend, temp, tasks, container, invoker);
	}
	return container;
}

function getNoOneDependsOnMe( tasks )
{
	var ret=[];
	var len=tasks.length();
	var i;
	var j;	
	for(i=0; i<len; i++){
		var myId=tasks[i].taskId;
		var temp=false;	
		for(j=0; j<len; j++){
			var t=tasks[j];
			var deps=t.dependentIds;
						
			if(checkDeps(myId, deps)){
				temp=true;
				break;
			}
		}
		if(!temp){
			ret.push(myId);
		}		
	}
	return ret;
}

function checkDeps(taskid, deps)
{
	if(deps==null){
		return false;
	}
	if(deps.length()>0){
		var lenDep=deps.length();				
		var m;
		for(m=0; m<lenDep; m++)	{
			if(taskid===deps[m]){
				return true;
			}
		}
	}
	return false;
}

function timestr2num( timestr )
{
	var tempTime=funcs.val(timestr, 3);
	return funcs.val(tempTime, 1);
}

function num2timestr( num )
{
	var tempTime=funcs.val(num, 3);	
	return funcs.str(tempTime);
}

function getMin(c)
{
	var len=c.length;
	var order=[];
	var i;
	var j;
	for(i=len; i>=0; i--){
		order.push(i);
	}	
	for(i=0; i<len; i++){
		for(j=0; j<len; j++){
			if(c[i]<c[j]){
				var t=c[i];
				c[i]=c[j];
				c[j]=t;
			}	
		}
	}	
	return c[0];
}

function getStartDate(fileId, fileName, whichtaskid, invoker, parentDeliveryDateStr)
{
	var sql="fileId=\""+fileId+"\" and fileName=\""+fileName+"\"";
	var r=new SCFile("changePlan", SCFILE_READONLY);
	var all_start_end=[];
	
	if(r.doSelect(sql)===RC_SUCCESS){
		all_start_end=rootNodeFunction(r.tasks, invoker, parentDeliveryDateStr);				
	}
	var l=all_start_end.length;	
	var t=[];
	var t_all=[];
	
	if(l>0){
		var i;
		for(i=0; i<l; i++){
			t_all.push(all_start_end[i].myStart);
			
			if(whichtaskid == all_start_end[i].taskid){
				t.push(all_start_end[i].myStart);
			}
		}
	
		var myEnd="";
		var min_all=getMin(t_all);
		var min=getMin(t);
		
		for(i=0; i<l; i++){
			if(min == all_start_end[i].myStart && all_start_end[i].taskid==whichtaskid ){
				myEnd = all_start_end[i].myEnd;
			}
		}	
		
		return ({"selfstart":num2timestr(min),"selfend":num2timestr(myEnd),"totalstart":num2timestr(min_all)});
	}
	return ({"selfstart":"00:00:00","selfend":"00:00:00","totalstart":"00:00:00"});
}

function getTaskByTaskNumber(tasknum, fileid, filename)
{
	var changeplan=new SCFile("changePlan", SCFILE_READONLY);
	var sql="fileId=\""+fileid+"\" and fileName=\""+filename+"\"";
	
	if(changeplan.doSelect(sql)=== RC_SUCCESS){
		var tasks = changeplan.tasks;
		
		if(tasks!=null){
			var len=tasks.length();
			var i;
			for(i=0; i<len; i++){
				if(tasks[i].taskNumber == tasknum){
					return tasks[i];
				}
			}
		}
	}
	return null;
}

function getParentRequestDeliveryDate(parentNumber)
{
	var req= new SCFile("request", SCFILE_READONLY);
	req.setFields(["delivery.date"]);
	var sql="number=\""+parentNumber+"\"";
	
	if(req.doSelect(sql)===RC_SUCCESS){
		return req.delivery_date;
	}else{
		return funcs.str(funcs.tod());
	}
}
function getMyStartDate(taskrecord, invoker)
{
	var fileId = taskrecord.parentTicket;
	var fileName = "request"; 
	var taskNumber = taskrecord.number;	
	var task=getTaskByTaskNumber(taskNumber, fileId, fileName);

	if(task!=null){
		var taskId=task.taskId;	
		var parentDeliveryDateStr=getParentRequestDeliveryDate(fileId);
		var t = getStartDate(fileId, fileName, taskId, invoker, parentDeliveryDateStr);
		taskrecord.planned_start=funcs.val(t.selfstart, 3);
		taskrecord.planned_end=funcs.val(t.selfend, 3);

		//planned.lead.time change data type to datetime (before is character)
		//OLD CODE:taskrecord.planned_lead_time=getMyPlannedLeadTime(task,"planned");
		taskrecord.planned_lead_time=funcs.val(getMyPlannedLeadTime(task,"planned"), 3);
	}
}

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////

function getMyRequestedDate(record)
{
	if(record.svcCartId!==null && record.svcCartId!=="")
	{
		var fCartItem=new SCFile("svcCartItem", SCFILE_READONLY);
		var sql="cartId=\"" + record.svcCartId + "\" and bundle=true";
		var duration=0;
		var duty = "24x7";
		var timezone = "US/Mountain";
		var submitDate = funcs.tod();
		if(fCartItem.doSelect(sql)===RC_SUCCESS){
 			duration = fCartItem.duration;
			duty= fCartItem.schedule; 
			if(fCartItem.requested_for_type=="department"){
				timezone= lib.tzFunctions.getTZforContact(fCartItem.requested_by);
			}else{
				timezone= lib.tzFunctions.getTZforContact(fCartItem.requested_for);
 			}
		}else{
			sql="cartId=\"" + record.svcCartId + "\"";
			if(fCartItem.doSelect(sql)===RC_SUCCESS){
 				duration = fCartItem.duration;
				duty= fCartItem.schedule;
				if(fCartItem.requested_for_type=="department"){
					timezone= lib.tzFunctions.getTZforContact(fCartItem.requested_by);
				}else{
					timezone= lib.tzFunctions.getTZforContact(fCartItem.requested_for);
 				}
			}
		} 
		
		if(duration==0 || duration==null){
			return;
		}
		
 		if(record.submit_date === null || record.submit_date === ""){
 			submitDate = funcs.tod();
		}else{
 			submitDate =record.submit_date;
		}  		 
		record.requested_date = getAdjustedDate("",submitDate,duration,duty,timezone);
	}
}


function getAdjustedDate(holiday,startDate,interval,duty,timezone){

	var argNames = new SCDatum();
	var argVals = new SCDatum();
	var argTypes = new SCDatum();
	var results = new SCDatum();          
          
    argNames.setType(8); 
	argVals.setType(8);      
	argTypes.setType(8);
	results.setType(8); 
          
    argNames.push("query");     
	argNames.push("times,1"); 
	argNames.push("times,2"); 
	argNames.push("prompt");  
	argNames.push("name");
	argNames.push("times,3");     
	 
	argVals.push(holiday);	 	
	argVals.push(startDate);          
    argVals.push(interval);            
	argVals.push(duty);
	argVals.push(timezone);
		 
	argTypes.push(2); 
	argTypes.push(3);
	argTypes.push(3);
	argTypes.push(2);
    argTypes.push(2);
    argTypes.push(3);
         	
    results.push("times,3");

	var radResults = lib.RAD.run( "calendar.calc.date", argNames, argVals, argTypes, results );
	return radResults.results[0]; 
}