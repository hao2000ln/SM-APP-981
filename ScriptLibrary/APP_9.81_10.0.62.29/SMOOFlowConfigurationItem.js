var $ = lib.c.$;


function getTaskOOFlowMappedFields(fileName, fileId ,fieldType)
{
  var parentFileName = "";
  var currentFileName="";
  var pFile = new SCFile("taskPlannerMapping");
  var sql = "parentFileName=\""+ fileName +"\" or modelFileName=\""+ fileName +"\"";
  if (pFile.doSelect(sql)===RC_SUCCESS)
  {
    parentFileName = pFile.parentFileName;
    currentFileName = pFile.taskFileName;
  }
  var mappedFields = {};
  mappedFields.values = [];
  mappedFields.disps = [];
  if (fieldType==="Parent File" && parentFileName!="")
  {
    getFileFields(parentFileName, mappedFields);
  }
  else if (fieldType==="Current File" && currentFileName!="")
  {
    getFileFields(currentFileName, mappedFields);
  }
  else if (fieldType==="Additional Properties")
  {
    getTicketContextFields(fileId, fileName, mappedFields);
  }
  else if (fieldType==="User Options" && parentFileName===fileName)
  {
    getUserOptions(fileId, fileName, mappedFields);
  }
  return mappedFields;
}

function getFileFields(fileName, mappedFields)
{
  var ristrictFields=[''];
  var fields=[];
  var captions=[];
  var sysFieldType=[];
  var dataDict=new SCFile("datadict");
  var dbDict=new SCFile("dbdict");
  var sql="name=\""+fileName+"\"";
  if(dataDict.doSelect( sql )=== RC_SUCCESS){
        fields=dataDict.fields;
        captions=dataDict.captions;
        sysFieldType=dataDict.sysFieldType;
        if(dbDict.doSelect( sql )=== RC_SUCCESS){
        	var i, length = fields.length(); 
            for(i=0;i<length;i++){
            	if(sysFieldType[i]!==1){
            	    if(!isAliasField(fileName,fields[i])&&!lib.ArrayUtil.contains(ristrictFields,fields[i])){
            	        mappedFields.values.push(fields[i]);
            	        mappedFields.disps.push(captions[i]);
                    }
                }
            }
        }
  }
}

function getTicketContextFields(id, fileName, mappedFields)
{
	var isModelFile = lib.TaskPlannerService.isRegisteredModelFileName(fileName);
	if(!isModelFile) {
		var modelFileName = lib.TaskPlannerUtilities.getTableNameByParentFileName(fileName, "Model");
		var modelId = lib.TaskPlannerUtilities.getModelIdByTicketID(fileName, id);
	}

    var contextFile=new SCFile("ticketContextConfig");
    var sql="fileId=\""+id+"\" and fileName=\""+fileName+"\"";
    if(contextFile.doSelect( sql )=== RC_SUCCESS){
        var language;
        language = "en";
        if ( vars.$G_my_language !== null ){
            language = vars.$G_my_language;
        }
        var messageFile=new SCFile("scmessage");
        var msgClass="local:ticketContextConfig";
        do{
            var msgId = null;
            if(!isModelFile && lib.TaskPlannerService.isFromModel(modelFileName,modelId,contextFile.id)) {
            	msgId = modelFileName + "_" + modelId + "_" + contextFile.id;
            } else {
            	msgId = fileName + "_" + id + "_" + contextFile.id;
            }
            var msgSql="syslanguage =\"" + language + "\" and class = \"" + msgClass + "\" and message.id=\"" + msgId + "\"";
            if(messageFile.doSelect( msgSql )=== RC_SUCCESS){
               mappedFields.values.push(contextFile.id);
               mappedFields.disps.push(messageFile.message);
            }
            else{
               mappedFields.values.push(contextFile.id);
               mappedFields.disps.push(contextFile.label);
            }
        }while (contextFile.getNext() === RC_SUCCESS);
    }
}

function getUserOptions(id, fileName, mappedFields)
{
    var optionNames=[];
    var userOpts=new SCFile("userOption");
    var sql="Ticket.ID=\""+id+"\"";
    if(userOpts.doSelect(sql)=== RC_SUCCESS){
        do{
            if(!lib.ArrayUtil.contains(optionNames,userOpts.Option_Name))
            {
              mappedFields.values.push(userOpts.Option_Name);
              mappedFields.disps.push(userOpts.Option_Label);
            }
            optionNames.push(userOpts.Option_Name);
        }while (userOpts.getNext() === RC_SUCCESS);
    }
}

function isAliasField(fileName,field){
    var dbdict = $(fileName).dbdict();
    var dbdictService = $("#dbdictService");
    var descriptor = dbdictService.getDescriptorMeta(dbdict["field"]);
    var fieldMeta = dbdictService.getFieldMeta(field, descriptor, false);
    if (fieldMeta == null || fieldMeta.field.name != field) {
        return true;
    }
    return false;
}

function checkLink(uuid, filename, fileid){
	if(uuid==null||uuid==""){
		print( funcs.scmsg( 2, "smoo" ) );
		return false;
	}
	var isUUID = true;
	if(isUUID){
		var ooflow = new SCFile("OOFlow");
		var sql = "uuid = \""+uuid+"\"";
		var rc = ooflow.doSelect(sql);
		var path = "";
		if ( rc == RC_SUCCESS )
		{
			rc = ooflow.getFirst();
				while( rc == RC_SUCCESS )
				{
					path = ooflow.path;
					break;
				}
		}
		if(path!=""){
			var linkFile = new SCFile("OOFlowConfigurationItem");
		 	var sql = "fileName =\""+ filename + "\" and fileId = \"" + fileid +"\" and OOFlow.uuid = \"" + uuid+"\"";
		 	var rc1 = linkFile.doSelect(sql);
		 	if ( rc1 == RC_SUCCESS ){
		 		
				print( funcs.scmsg( 3, "smoo" ) );		
				return false; 		 
		 	}else{
				return true;
			}
		}else{		
			isUUID = false;
		}
	}
	
	if (!isUUID){
		var pathV = uuid;
		var ooflow = new SCFile("OOFlow");
		var sql = "path = \""+pathV+"\"";
		var rc = ooflow.doSelect(sql);
		var uuidV = "";
		if ( rc == RC_SUCCESS )
		{
			rc = ooflow.getFirst();
				while( rc == RC_SUCCESS )
				{
					uuidV = ooflow.uuid;
					break;
				}
		}
		if(uuidV!=""){
			var linkFile = new SCFile("OOFlowConfigurationItem");
		 	var sql ="fileName =\""+ filename + "\" and fileId = \"" + fileid +"\" and OOFlow.uuid = \"" + uuid+"\"";
		 	var rc1 = linkFile.doSelect(sql);
		 	if ( rc1 == RC_SUCCESS ){
		 		
				print( funcs.scmsg( 3, "smoo" ) );	
				return false;	 
		 	}else{
					
				
				return true;
			}
		}else{		
			
			print( funcs.scmsg( 6, "smoo", [uuid] ) );
			return false;
		}
	}
}


function newOOFlowLinkFile(ooflow, filename, fileid){

	var ooflowFile = new SCFile("OOFlow");
	var sql = "uuid = \""+ooflow+"\"";
	var rc = ooflowFile.doSelect(sql);
	var paraName;
	var path;
	var uuid;
	var paraRe;
	var paras=[];
	if ( rc == RC_SUCCESS )
	{
		rc = ooflowFile.getFirst();
		while( rc == RC_SUCCESS )
		{
			paras = ooflowFile.paras;
			paraName = ooflowFile.para_name;
			paraRe = ooflowFile.para_required;
			paras = ooflowFile.paras;
			uuid = ooflow;
			path = ooflowFile.path;
			break;
		}
	} else{
		var sql1 = "path = \""+ooflow+"\"";
		rc = ooflowFile.doSelect(sql1);
		if ( rc == RC_SUCCESS )
		{
			rc = ooflowFile.getFirst();
			while( rc == RC_SUCCESS )
			{
				paraName = ooflowFile.paras.para_name;
				paraRe = ooflowFile.paras.para_required;
				paras = ooflowFile.paras;
				path = ooflow;
				uuid = ooflowFile.uuid;
				break;
			}
		}
	}
	var ooflowlinkFile = new SCFile("OOFlowConfigurationItem");
	ooflowlinkFile.fileName = filename;
	ooflowlinkFile.fileId = fileid;
	ooflowlinkFile.name = path;
	ooflowlinkFile.OOFlow_path = path;
	ooflowlinkFile.OOFlow_uuid = uuid;
	ooflowlinkFile.excute_mode = "noauto";
	var j = 0;
	var k =0;
	var i, length = funcs.lng(paras);
	for(i = 0;i < length;i++){
		var sensitive = paras[i].para_sensitive;
		if(sensitive == null || sensitive.toString()=="false"){		
			ooflowlinkFile.paraFields[j].paraField_name=paras[i].para_name;
			ooflowlinkFile.paraFields[j].paraField_required=paras[i].para_required;
			j++;
		}
		else{
			ooflowlinkFile.secureFields[k].secureField_name=paras[i].para_name;
			ooflowlinkFile.secureFields[k].secureField_required=paras[i].para_required;
			k++;
		}
	}
	/*
	ooflowlinkFile.paras.para_name = paraName;
	ooflowlinkFile.paras.para_required = paraRe;
	ooflowlinkFile.paras = paras;
	*/
	return ooflowlinkFile;
}


function complementOOFCIFullName() {
	// use sql directly to improve performance, some customer have millions of OOFlowConfiguration or OOFlowConfigurationItem records
	var co = "||";	// concatenation operator
	var dataType = lib.dbdictHelper.getDbType();
	if ($.contains(dataType, "sqlserver")) {
		co = "+";
	}
	var adapter = lib.DataService.getAdaptor(dataType);
	
	// batch update OOFlowConfigurationItem
	var tableOOItem = $("#dbdictService").getPrimaryTable($("OOFlowConfigurationItem").dbdict())[1];
	var batchUpdateSql0 = "update "+ tableOOItem + " set " + adapter.escapeField("FULLNAME") + "=" + adapter.escapeField("FILENAME") + co + "\'_\'" + co + adapter.escapeField("FILEID") + " where " + adapter.escapeField("FULLNAME") + " is NULL";
	var result0 = $("#dataService").executeSQL(batchUpdateSql0); 
	
//	$("OOFlowConfigurationItem").select("null(fullname)").iterate(function (record) {
//		record.fullname = record.fileName + "_" + record.fileId;
//		record.doSave();
//	});
	
	// batch update OOFlowConfiguration
	var tableOO = $("#dbdictService").getPrimaryTable($("OOFlowConfiguration").dbdict())[1];
	var batchUpdateSql = "update "+ tableOO + " set " + adapter.escapeField("FULLNAME") + "=" + adapter.escapeField("FILENAME") + co + "\'_\'" + co + adapter.escapeField("FILEID") + " where " + adapter.escapeField("FULLNAME") + " is NULL";
	var result = $("#dataService").executeSQL(batchUpdateSql);

//	$("OOFlowConfiguration").select("null(fullname)").iterate(function (record) {
//		record.fullname = record.fileName + "_" + record.fileId;
//		record.doSave();
//	});
}
