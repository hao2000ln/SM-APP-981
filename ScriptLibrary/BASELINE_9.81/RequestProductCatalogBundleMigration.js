
function getRequestModelSubCategory(linkcategory){

	var subcategory=[];

	subcategory.push({"legacyCategory":"Computer Accessories","PDSubCategory":"Hardware"});
	subcategory.push({"legacyCategory":"Computer Components","PDSubCategory":"Hardware"});
	subcategory.push({"legacyCategory":"Computers and Related","PDSubCategory":"Hardware"});
	subcategory.push({"legacyCategory":"Desktop","PDSubCategory":"Hardware"});
	subcategory.push({"legacyCategory":"Desktop Packages","PDSubCategory":"Hardware"});
	subcategory.push({"legacyCategory":"Desktops","PDSubCategory":"Hardware"});
	subcategory.push({"legacyCategory":"Handheld and PDAs","PDSubCategory":"Hardware"});
	subcategory.push({"legacyCategory":"Hardware","PDSubCategory":"Hardware"});
	subcategory.push({"legacyCategory":"Hardware Upgrade","PDSubCategory":"Hardware"});
	subcategory.push({"legacyCategory":"Monitor","PDSubCategory":"Hardware"});
	subcategory.push({"legacyCategory":"Non PC Computers","PDSubCategory":"Hardware"});
	subcategory.push({"legacyCategory":"Notebook","PDSubCategory":"Hardware"});
	subcategory.push({"legacyCategory":"Notebooks","PDSubCategory":"Hardware"});
	subcategory.push({"legacyCategory":"PC's and Related","PDSubCategory":"Hardware"});
	subcategory.push({"legacyCategory":"Printer", "PDSubCategory":"Hardware"});
	subcategory.push({"legacyCategory":"Toner Products","PDSubCategory":"Hardware"});
	subcategory.push({"legacyCategory":"pc","PDSubCategory":"Hardware"});
	subcategory.push({"legacyCategory":"Employee Termination","PDSubCategory":"Employee Off-boarding"});
	subcategory.push({"legacyCategory":"Termination","PDSubCategory":"Employee Off-boarding"});
	subcategory.push({"legacyCategory":"New Accounts","PDSubCategory":"Request for Administration"});
	subcategory.push({"legacyCategory":"User Accounts","PDSubCategory":"Request for Administration"});
	subcategory.push({"legacyCategory":"PC Apps","PDSubCategory":"Software"});
	subcategory.push({"legacyCategory":"PC Software","PDSubCategory":"Software"});
	subcategory.push({"legacyCategory":"Programming","PDSubCategory":"Software"});
	subcategory.push({"legacyCategory":"Software","PDSubCategory":"Software"});
	subcategory.push({"legacyCategory":"Software Applications","PDSubCategory":"Software"});
	subcategory.push({"legacyCategory":"Software Categories","PDSubCategory":"Software"});
	subcategory.push({"legacyCategory":"Software Group","PDSubCategory":"Software"});
	subcategory.push({"legacyCategory":"Software Installation","PDSubCategory":"Software"});
	subcategory.push({"legacyCategory":"Software License","PDSubCategory":"Software"});
	subcategory.push({"legacyCategory":"Software Purchase","PDSubCategory":"Software"});
	subcategory.push({"legacyCategory":"Software Upgrade","PDSubCategory":"Software"});
	subcategory.push({"legacyCategory":"UNIX Applications","PDSubCategory":"Software"});
	subcategory.push({"legacyCategory":"New Employee Setup","PDSubCategory":"Employee On-boarding"});
	subcategory.push({"legacyCategory":"Security","PDSubCategory":"Request for Administration"});
	subcategory.push({"legacyCategory":"Security Access","PDSubCategory":"Request for Administration"});
	
	var ret = "Others";
	
	for(var i=0; i<subcategory.length; i++){
		var t = subcategory[i];
		if(t.legacyCategory===linkcategory){
			ret = t.PDSubCategory;
			break;
		}
	}
	
	return ret;

}

function findMyLeft( me , deep, result, left, right){
	
	var pos = [];
	
	for(var i=0; i<right.length(); i++){
		if(right[i] == me){
			pos.push(i);
		}
	}
	
	
	for(var i=0; i<pos.length; i++){
		if(left[pos[i]] == null ) {
			continue;
		}
		result.push({"left":left[pos[i]] ,"deep":deep});
		
		findMyLeft(left[pos[i]], deep+1 , result, left, right);
	}

}


function GetStartPoint(left, right){
	var ret = [];
	for(var i=0; i<right.length(); i++){
		var r = right[i];
		
		var found = false;
		for(var j=0; j<left.length(); j++){
			var l = left[j];
			
			if(r == l){
				found = true;
				break;
			}
		}
		
		if(!found){
			ret.push(r);
		}
	}
	
	return ret;
}

function removeDuplicate(a){
	var ret=[];
	for(var i=0; i<a.length; i++){
		var found =false;
		for(var j=0; j<ret.length; j++){
			if(ret[j] == a[i]){
				found = true;
			}
		}
		
		if(!found){
			ret.push(a[i]);
		}
	}
	
	return ret;
}

function GenerateDependLoop(l, r)
{
	var t = removeDuplicate(GetStartPoint(l, r));
	var result = new Array();
	findMyLeft(t[0], 1, result, l, r);
	
	return result;
}


function getTaskCategory( linecategory ){
	LineItemCategoryArray = [];
	
	LineItemCategoryArray.push("Changes");
	LineItemCategoryArray.push("Changes to Lines");
	LineItemCategoryArray.push("Common Office Environment");
	LineItemCategoryArray.push("Contractor Conversion");
	LineItemCategoryArray.push("Corporate");
	LineItemCategoryArray.push("Corporate Security");
	LineItemCategoryArray.push("Employee Change");
	LineItemCategoryArray.push("Employee Office Move");
	LineItemCategoryArray.push("Employee Promotion");
	LineItemCategoryArray.push("Employee Termination");
	LineItemCategoryArray.push("Employee Transfer");
	LineItemCategoryArray.push("HR Tasks");
	LineItemCategoryArray.push("Human Resources");
	LineItemCategoryArray.push("Installation");
	LineItemCategoryArray.push("Installation Services");
	LineItemCategoryArray.push("Move Equipment");
	LineItemCategoryArray.push("Network");
	LineItemCategoryArray.push("New Accounts");
	LineItemCategoryArray.push("New Employee Setup");
	LineItemCategoryArray.push("New Lines");
	LineItemCategoryArray.push("Office Move");
	LineItemCategoryArray.push("PC Software");
	LineItemCategoryArray.push("Payroll");
	LineItemCategoryArray.push("Payroll Tasks");
	LineItemCategoryArray.push("Programming");
	LineItemCategoryArray.push("Promotion");
	LineItemCategoryArray.push("Repair");
	LineItemCategoryArray.push("Repair Services");
	LineItemCategoryArray.push("Security");
	LineItemCategoryArray.push("Security Access");
	LineItemCategoryArray.push("Software Installation");
	LineItemCategoryArray.push("Software Upgrade");
	LineItemCategoryArray.push("Telecom");
	LineItemCategoryArray.push("Termination");
	LineItemCategoryArray.push("Transfer");
	LineItemCategoryArray.push("UNIX Applications");
	LineItemCategoryArray.push("User Accounts");
	LineItemCategoryArray.push("Voice Requests");
	LineItemCategoryArray.push("Workorder");
	LineItemCategoryArray.push("labor");
	LineItemCategoryArray.push("phone");
	LineItemCategoryArray.push("training");
	
	var found=false;
	
	for(var i=0; i<LineItemCategoryArray.length; i++){
		if(linecategory==LineItemCategoryArray[i]){
			found=true;
			
			break;
		}
	}
	
	var ret="";
	
	if(found){
		ret="Labor";
	}else{
		ret="Purchase";
	}
	
	return ret;
}

function getCategoryAndDesc( partno ){
	var model = new SCFile("model", SCFILE_READONLY);
	model.setFields(["part.desc","category"]);
	var sql="part.no=\""+partno+"\"";
	
	if(model.doSelect(sql) == RC_SUCCESS){
		return {"desc":model.part_desc,"lcategory":model.category};
	}else{
		return {"desc":"","lcategory":""};
	}
}

function convertPos(sourcepostion){
	var t = sourcepostion.split(",");
	
	var xx = 150;
	var yy = 50;
	
	var xpos = (system.functions.val(t[0]) + 1) * xx;
	var ypos = (system.functions.val(t[1]) + 1) * yy;
	
	return xpos +"," + ypos;
}

function buildTaskXML(tj)
{
	var txml = new XML("tasks");
	txml.setAttributeValue("sctype","structure")
	
	//task id
	var taskId = new XML("taskId");
	taskId.setValue(tj.taskid);
	taskId.setAttributeValue("type", "decimal");
	
	//task description
	var taskDesc = new XML("taskDescription");
	taskDesc.setValue(getCategoryAndDesc(tj.mypart_no).desc);
	taskDesc.setAttributeValue("type", "string");	
	taskDesc.setAttributeValue("Nullvalue", "1");
	
	//task number
	var taskNum = new XML("taskNumber");
	taskNum.setAttributeValue("type", "string");	
	taskNum.setAttributeValue("Nullvalue", "1");	

	//task status
	var taskStatus = new XML("taskStatus");
	taskStatus.setValue("1");
	taskStatus.setAttributeValue("type", "string");	
	taskStatus.setAttributeValue("Nullvalue", "1");
	
	//task active
	var taskActive = new XML("taskActive");
	taskActive.setValue("false");
	taskActive.setAttributeValue("type", "string");	
	taskActive.setAttributeValue("Nullvalue", "1");

	//taskTemplate
	var taskTemplate = new XML("taskTemplate");
	taskTemplate.setAttributeValue("type", "string");	
	taskTemplate.setAttributeValue("Nullvalue", "1");	
	
	//taskAasignment
	var taskAssignment = new XML("taskAssignment");
	taskAssignment.setAttributeValue("type", "string");	
	taskAssignment.setAttributeValue("Nullvalue", "1");
	
	var taskOOFlowLink  = new XML("taskOOFlowLink");
	taskOOFlowLink.setAttributeValue("type", "string");	
	taskOOFlowLink.setAttributeValue("Nullvalue", "1");	

	//dependentIds
	var dependentIds   = new XML("dependentIds");
	dependentIds.setAttributeValue("sctype", "array");
	
	if(tj.DependentOnGroupList == null ){
		var did = new XML("dependentIds");
		did.setAttributeValue("sctype", "decimal");
	}else{
		var dependidsArray = tj.DependentOnGroupList.split(",");
		for(var i=0; i<dependidsArray.length; i++){
			if(dependidsArray[i] == ""){
				continue;
			}
			var did = new XML("dependentIds");
			did.setAttributeValue("sctype", "decimal");
			did.setValue(dependidsArray[i]);
			lib.xmlHelpers.addChildElement(dependentIds, did);
		}
	}
	
	//dependentCoords	
	var dependentCoords   = new XML("dependentCoords");
	dependentCoords.setAttributeValue("sctype", "array");
	var dc = new XML("dependentCoords");
		
	//taskCoords			
	var taskCoords   = new XML("taskCoords");
	var posstr = tj.x +","+tj.y;
	taskCoords .setValue(convertPos(posstr));
	taskCoords .setAttributeValue("type", "string");	

	//taskCategory
	var taskCategory  = new XML("taskCategory");
	
	var tcat = getTaskCategory(getCategoryAndDesc(tj.mypart_no).lcategory);
	
	taskCategory.setValue(tcat);
	taskCategory.setAttributeValue("type", "string");	
	taskCategory.setAttributeValue("Nullvalue", "1");
	
	//openInPhase
	var openInPhase    = new XML("openInPhase");
	openInPhase.setValue("Fulfillment");
	openInPhase.setAttributeValue("type", "string");

	//closeByPhase
	var closeByPhase    = new XML("closeByPhase");
	closeByPhase.setValue("");
	closeByPhase.setAttributeValue("type", "string");
	
	//mandatory
	var mandatory    = new XML("mandatory");
	mandatory.setValue("false");
	mandatory.setAttributeValue("type", "string");
	
	//activeCondDesc
	var activeCondDesc   = new XML("activeCondDesc");
	activeCondDesc.setValue("");
	activeCondDesc.setAttributeValue("type", "string");
	
	//activeCondXML
	var activeCondXML  = new XML("activeCondXML");
	activeCondXML.setValue("");
	activeCondXML.setAttributeValue("type", "string");
	
	//taskFieldsSetting
	var taskFieldsSetting  = new XML("taskFieldsSetting");
	taskFieldsSetting.setAttributeValue("sctype", "array");
	
	var tc = new XML("taskFieldsSetting");
	tc.setAttributeValue("sctype", "structure");
	
	var fieldName = new XML("fieldName");
	fieldName.setAttributeValue("type", "string");
	fieldName.setValue("part.no");
	
	var fieldValue = new XML("fieldValue");
	fieldValue.setAttributeValue("type", "string");
	fieldValue.setValue(tj.mypart_no);
	
	lib.xmlHelpers.addChildElement(tc, fieldName);
	lib.xmlHelpers.addChildElement(tc, fieldValue);
	
	lib.xmlHelpers.addChildElement(taskFieldsSetting, tc);
	
	
	//inputs
	var inputs  = new XML("inputs");
	inputs.setAttributeValue("sctype", "array");
	var ic = new XML("inputs");
	ic.setAttributeValue("sctype", "structure");
	lib.xmlHelpers.addChildElement(inputs, ic);
	
	//outputs												
	var outputs  = new XML("outputs");
	outputs.setAttributeValue("sctype", "array");
	var oc = new XML("inputs");
	oc.setAttributeValue("sctype", "structure");
	lib.xmlHelpers.addChildElement(outputs, oc);
	
	
	lib.xmlHelpers.addChildElement(txml, taskId);
	lib.xmlHelpers.addChildElement(txml, taskDesc);
	lib.xmlHelpers.addChildElement(txml, taskNum);	
	lib.xmlHelpers.addChildElement(txml, taskTemplate);	
	lib.xmlHelpers.addChildElement(txml, taskAssignment);	
	lib.xmlHelpers.addChildElement(txml, taskOOFlowLink);	
	lib.xmlHelpers.addChildElement(txml, dependentIds);
	lib.xmlHelpers.addChildElement(txml, dependentCoords);		
	lib.xmlHelpers.addChildElement(txml, taskCategory);	
	lib.xmlHelpers.addChildElement(txml, taskCoords);	
	lib.xmlHelpers.addChildElement(txml, openInPhase);	
	lib.xmlHelpers.addChildElement(txml, closeByPhase);
	lib.xmlHelpers.addChildElement(txml, mandatory);	
	lib.xmlHelpers.addChildElement(txml, activeCondXML);	
	lib.xmlHelpers.addChildElement(txml, activeCondDesc);	
	lib.xmlHelpers.addChildElement(txml, taskFieldsSetting);
	lib.xmlHelpers.addChildElement(txml, inputs);
	lib.xmlHelpers.addChildElement(txml, outputs);			
	
	return txml;

}



function getModel(part_no, GlobalResultArray, deep, parent_depend_group)
{
	var model = new SCFile("model", SCFILE_READONLY);
	var sql="part.no=\""+part_no+"\"";
	var LocalResultArray = new Array();
	var retChildID=null;

	if(deep == 1){
		initTaskId();
	}
		
	if(model.doSelect(sql) === RC_SUCCESS){
		for(var i=0; i<model.component_part_no.length(); i++){
			handleComponents(deep, LocalResultArray, model.component_part_no[i], model.component_group[i], model.component_category[i], model.parent_group, model.dependent_group, GlobalResultArray, i);
		}
		
		var dependloop = GenerateDependLoop(model.parent_group, model.dependent_group);
		
		LocalResultArray = AdjustXPos(LocalResultArray, dependloop);
		
		var t = ReplaceGroupnameByIDlist(LocalResultArray, GlobalResultArray);
		retChildID1 = GetNobodyDepnendsOnMe(t);
		retChildID2 = IDependsOnNobody(t);
	}

	return {"retChildID1":retChildID1, "retChildID2":retChildID2};
}

function AdjustXPos(LocalResultArray, dependloop){
	var temp = [];
	
	for(var i=0; i< LocalResultArray.length; i++){
		var t = LocalResultArray[i];
		var newx=system.functions.val(t.x);		
		for(var j=0; j<dependloop.length; j++){
			if(dependloop[j].left == t.mygroup){
				newx = newx + system.functions.val(dependloop[j].deep);
			}
		}
		temp.push({"DependentOnGroupList":t.DependentOnGroupList, "taskid":t.taskid, "mygroup":t.mygroup , "mypart_no":t.mypart_no, "startnodelist":t.startnodelist, "x":newx, "y":t.y});
	}
	
	return temp;
}

function GetNobodyDepnendsOnMe(LocalResultArray){
	var temp=[];
	
	for(var i=0; i<LocalResultArray.length; i++){
		var t= LocalResultArray[i];
		var tid=t.taskid;
		var found = false;
		
		for(var j=0; j<	LocalResultArray.length; j++){
			var t1= LocalResultArray[j];
			var dependids = t1.DependentOnGroupList;
			if(dependids!=null && dependids!=""){
				var idArray=dependids.split(",");
				
				for(var s=0; s<idArray.length; s++){
					if(tid === idArray[s]){
						found = true;
						break;
					}
				}
			}
		}
		
		if(!found){
			temp.push(tid);
		}
	}
	
	var str = "";
	for(var i=0; i<temp.length; i++){
		str = str + temp[i] + ",";
	}
	
	return str.substr(0, str.length-1);
}

function IDependsOnNobody(LocalResultArray){
	var temp=[];
	
	for(var i=0; i<LocalResultArray.length; i++){
		var t= LocalResultArray[i];
		var dependids = t.DependentOnGroupList;
		var tid=t.taskid;
		if(dependids==null || dependids==""){
			temp.push(tid);
		}
	}
	
	var str = "";
	for(var i=0; i<temp.length; i++){
		str = str + temp[i] + ",";
	}
	
	return str.substr(0, str.length-1);
}

function isBundle(mypart_no)
{
	var model = new SCFile("model", SCFILE_READONLY);
	var sql="part.no=\""+mypart_no+"\"";
	var ret = false;
	if(model.doSelect(sql) === RC_SUCCESS){
		if(model.component_part_no!= null && system.functions.lng(system.functions.denull(model.component_part_no))>0){
			ret = true;
		}
	}	
	return ret;
}

function handleComponents(deep, LocalResultArray, mypart_no, mygroup, mycategory, leftgroup, rightgroup, GlobalResultArray, row)
{
	if(isBundle(mypart_no)){
		var d = isDependentOthers(mygroup, leftgroup, rightgroup);
		var s = getModel(mypart_no, GlobalResultArray, deep+1, d);
		var Nobody_Depend_ON_Me = s.retChildID1;
		var Depend_ON_Nobody = s.retChildID2;
		LocalResultArray.push({"DependentOnGroupList":d, "taskid":Nobody_Depend_ON_Me, "mygroup":mygroup , "mypart_no":mypart_no, "startnodelist":Depend_ON_Nobody, "x":deep, "y":row});
	}else{
	
		if(mygroup == null || mygroup == ""){
			var newTaskId = getTaskId();
			LocalResultArray.push({"DependentOnGroupList":null, "taskid":newTaskId, "mygroup":mygroup , "mypart_no":mypart_no, "startnodelist":null, "x":deep, "y":newTaskId});
		}else{
			var d = isDependentOthers(mygroup, leftgroup, rightgroup);
			if(d==null){
				var newTaskId = getTaskId();
				LocalResultArray.push({"DependentOnGroupList":null, "taskid":newTaskId, "mygroup":mygroup, "mypart_no":mypart_no, "startnodelist":null, "x":deep, "y":newTaskId});
			}else{
				var newTaskId = getTaskId();
				LocalResultArray.push({"DependentOnGroupList":d, "taskid":newTaskId, "mygroup":mygroup, "mypart_no":mypart_no, "startnodelist":null, "x":deep, "y":newTaskId});
			}
		}
	}
	
	return;
}

function getTaskId(){
	var newid = new Datum();
	var rcode = new Datum();
	rcode = system.functions.rtecall("getnumber", rcode, newid, "tempClass");
	return newid.getText();
}

function initTaskId()
{
	var num = new SCFile("number");
	var sql = "name=\"tempClass\"";
	
	if(num.doSelect(sql)===RC_SUCCESS){
		num.number=1;
		num.doSave();
	}else{
		num.name="tempClass";
		num.number=1;
		num.doSave();
	}
}
function ReplaceGroupnameByIDlist(LocalResultArray, GlobalResultArray)
{
	var ret=[];
	var groupIDArray=[];
	var groupTaskIDArray=[];	
	var retArray=[];
	
	for(var i=0; i<LocalResultArray.length; i++){
		var t= LocalResultArray[i];
		
		var found=false;
		for(var j=0; j<groupIDArray.length; j++){
			if(t.mygroup != null && groupIDArray[j] == t.mygroup){
				found=true; 
				var ss = groupTaskIDArray[j];
				ss = ss + "," + t.taskid;
				groupTaskIDArray[j]=ss;
			}
		}
		
		if(!found && t.mygroup != null){
			groupIDArray.push(t.mygroup);
			groupTaskIDArray.push(t.taskid);
		}
	}

	for(var i=0; i<LocalResultArray.length; i++){
		var t= LocalResultArray[i];		
		var d="";
		
		var found=false;
		for(var j=0; j<groupIDArray.length; j++){
			if(t.DependentOnGroupList == groupIDArray[j]){
				d = groupTaskIDArray[j];
				found=true;
				break;
			}
		}
		
		GlobalResultArray.push({"DependentOnGroupList":d, "taskid":t.taskid, "mygroup":t.mygroup, "mypart_no":t.mypart_no, "startnodelist":t.startnodelist, "x":t.x, "y":t.y});
		retArray.push({"DependentOnGroupList":d, "taskid":t.taskid, "mygroup":t.mygroup, "mypart_no":t.mypart_no, "startnodelist":t.startnodelist, "x":t.x, "y":t.y});
	}
	
	return retArray;
}

function isDependentOthers(mygroup,  leftgroup, rightgroup)
{
	var ret=[]
	for(var i=0; i<leftgroup.length(); i++){
		if(leftgroup[i] == mygroup){
			ret.push(rightgroup[i]);
		}
	}
	if(ret.length<1){
		ret = null;
	}
	return ret;
}

function UpdateMyChildsDependentOnGroupList(part_no , group_dependon_list, taskid, startnode, GlobalResultArray)
{
	var updatedarray=[];
	var taskID = startnode.split(",");	
	for(var i=0; i<taskID.length; i++){		
		for(var j=0; j<GlobalResultArray.length; j++){
			var ts=GlobalResultArray[j];
			if(ts.taskid === taskID[i]){
				updatedarray.push({"DependentOnGroupList":group_dependon_list, "taskid":ts.taskid, "mygroup":ts.mygroup, "mypart_no":ts.mypart_no, "startnodelist":ts.startnodelist, "x":ts.x, "y":ts.y});
				break;
			}
		}
	}	
	return updatedarray;
}

function buildRequestModel( part_no ){

	var model = new SCFile("model", SCFILE_READONLY);
	var sql="part.no=\""+part_no+"\"";
	
	if(model.doSelect(sql) == RC_SUCCESS){
		var fvalue=model.part_desc.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g," "); 
		
		var rmodel = new SCFile("requestModel", SCFILE_READONLY);
		var sql1="id=\""+part_no + " - " + fvalue+"\"";
		
		if(rmodel.doSelect(sql1)!==RC_SUCCESS){
			var requestmodel = new SCFile("requestModel");
			
			
			requestmodel.id=part_no + " - " + fvalue;
			requestmodel.name=part_no + " - " + fvalue;
			requestmodel.category="Generic Request";
			
			requestmodel.subcategory=getRequestModelSubCategory(model.category);
			var t1= requestmodel.doAction("add");
			
			var changeplan = new SCFile("changePlan");
			changeplan.fileId=requestmodel.id;
			changeplan.fileName="requestModel";
			var t2 = changeplan.doAction("add");
			return changeplan.fileId;	

		}else{
			return 	rmodel.id;
		}
	}
	return null;
}


function MainEntrance( part_no ){

	var test_part_no= part_no ;	
	if(!isBundle(part_no)){
		
		system.functions.msg(part_no + " is not a bundle!",3);
		return;
	}
	
	var changePlanFileId = buildRequestModel(test_part_no);
		
	if(changePlanFileId != null){
	
		var GlobalResultArray = new Array();
		var r = getModel(test_part_no, GlobalResultArray ,1, null);	
		var finalarray=[];
				
		var bundleArray=[];
		for(var i=0; i<GlobalResultArray.length; i++){
			var t= GlobalResultArray[i];
			if(!isBundle(t.mypart_no)){
				continue;
			}else{
				bundleArray.push({"DependentOnGroupList":t.DependentOnGroupList, "taskid":t.taskid, "mygroup":t.mygroup, "mypart_no":t.mypart_no, "startnodelist":t.startnodelist, "x":t.x, "y":t.y});
			}
		}
		 
		
		for(var i=0; i<bundleArray.length; i++){
			var t= bundleArray[i];
			if(t.DependentOnGroupList== null || t.DependentOnGroupList==""){
				continue;
			}else{
				var tarray = UpdateMyChildsDependentOnGroupList(t.mypart_no, t.DependentOnGroupList, t.taskid, t.startnodelist, GlobalResultArray);
				
				for (var j=0; j<tarray.length; j++){
					finalarray.push(tarray[j]);
				}
			}
		}
		
		for(var i=0; i<GlobalResultArray.length; i++){
			var t= GlobalResultArray[i];
			if(!isBundle(t.mypart_no)){
				var found=false;;
				for(var j=0; j<finalarray.length; j++){
					var t1= finalarray[j];
					if(t1.taskid === t.taskid){
						found=true;
						break;
					}
				}
				if(!found){
					finalarray.push(t);
				}
			}
		}
		
		var rootxml = new XML("root");	
		var fileName = new XML("fileName");
		
		fileName.setValue("requestModel");
		fileName.setAttributeValue("type", "string");	
		var fileId = new XML("fileId");
		fileId.setValue(changePlanFileId);
		fileId.setAttributeValue("type", "string");	
			
		lib.xmlHelpers.addChildElement(rootxml, fileName);	
		lib.xmlHelpers.addChildElement(rootxml, fileId);		
			
		var tasksxml = new XML("tasks");
		tasksxml.setAttributeValue("sctype","array");	
		for(var i=0; i<finalarray.length; i++){
			var t= finalarray[i];
			var task = buildTaskXML(t);	
			lib.xmlHelpers.addChildElement(tasksxml, task);
		}	
				
		lib.xmlHelpers.addChildElement(rootxml, tasksxml);
		lib.TaskPlannerRemoteServiceImplementation.saveTaskPlan("model", "request", rootxml.toXMLString() );
		
		system.functions.msg("Request Model ("+changePlanFileId+") has been created/updated!",1);
		
	}
}

function main(){
	var m = new SCFile("model");
	var s = "true";
	if(m.doSelect(s, SCFILE_READONLY) === RC_SUCCESS){
		do{
			MainEntrance(m.part_no);
		}while(m.getNext()===RC_SUCCESS)
	
	}

}

