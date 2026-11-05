/******************************************************
* Module Name: SMOO
* Function: wizard edit runbook links
* Author: Yang, Wen-Ying
* Version: 1.00
* Creation Date: Nov, 2009
*******************************************************/
function checkLink(uuid, kmid, type){
	if(uuid==null||uuid==""){
		print( system.functions.scmsg( 2, "smoo" ) );
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
			var linkFile = new SCFile("OOFlowLinks");
		 	var sql = "number =\""+ kmid + "\" and type = \"" + type +"\" and OOFlow.uuid = \"" + uuid+"\"";
		 	var rc1 = linkFile.doSelect(sql);
		 	if ( rc1 == RC_SUCCESS ){
		 		
				print( system.functions.scmsg( 3, "smoo" ) );		
				return false; 		 
		 	}else{
				
				
				return true;
			}
		}else{		
			isUUID = false;
		}
	}
	
	if(!isUUID){
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
			var linkFile = new SCFile("OOFlowLinks");
		 	var sql = "number =\""+ kmid + "\" and type = \"" + type +"\" and OOFlow.uuid = \"" + uuidV+"\"";
		 	var rc1 = linkFile.doSelect(sql);
		 	if ( rc1 == RC_SUCCESS ){
		 		
				print( system.functions.scmsg( 3, "smoo" ) );	
				return false;	 
		 	}else{
					
				
				return true;
			}
		}else{		
			
			print( system.functions.scmsg( 6, "smoo", [uuid] ) );
			return false;
		}
	}
}

function removeLinkByPath(OOFlow_path, km_id, type){
	var linkFile = new SCFile("OOFlowLinks");
	print(OOFlow_path);
	var sql = "number = \""+km_id+"\" and OOFlow.path = \""+ OOFlow_path+"\" and type = \""+type+"\"";
	var RC_Int=linkFile.doSelect(sql);
	if(RC_Int==RC_SUCCESS){
		rc = linkFile.getFirst();
		while( rc == RC_SUCCESS ){
			var rc_int = linkFile.doDelete();
			if (rc_int == RC_SUCCESS) 
				
				if(type == "kmdocument"){
					print( system.functions.scmsg( 5, "smoo", [OOFlow_path] ) );
				}else if(type== "cm3r"){
					print( system.functions.scmsg( 16, "smoo", [OOFlow_path] ) );
				}
			rc = linkFile.getNext();
		}
	}
	
}

function removeLinkByUUID(OOFlow_uuid, km_id, type){
	var linkFile = new SCFile("OOFlowLinks");
	var sql = "number = \""+km_id+"\" and OOFlow.uuid = \""+ OOFlow_uuid+"\" and type = \""+type+"\"";
	var RC_Int=linkFile.doSelect(sql);
	if(RC_Int==RC_SUCCESS){
		rc = linkFile.getFirst();
		while( rc == RC_SUCCESS ){
			var rc_int = linkFile.doDelete();
			if (rc_int == RC_SUCCESS) 
				
				if(type == "kmdocument"){
					print( system.functions.scmsg( 5, "smoo", [OOFlow_uuid] ) );
				}else if(type== "cm3r"){
					print( system.functions.scmsg( 16, "smoo", [OOFlow_uuid] ) );
				}
			rc = linkFile.getNext();
		}
	}
}

function newOOFlowLinkFile(ooflow,number,type){

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
		var rc = ooflowFile.doSelect(sql1);
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
	var ooflowlinkFile = new SCFile("OOFlowLinks");
	ooflowlinkFile.number = number;
	ooflowlinkFile.type = type;
	ooflowlinkFile.OOFlow_path = path;
	ooflowlinkFile.OOFlow_uuid = uuid;
	
	var j = 0;
	var k =0;
	for(var i = 0;i <system.functions.lng(paras);i++){
		var sensitive = paras[i].para_sensitive;
		if(sensitive == null || sensitive.toString()=="false"){		
			ooflowlinkFile.paras[j].para_name=paras[i].para_name;
			ooflowlinkFile.paras[j].para_required=paras[i].para_required;
			j++;
		}
		else{
			ooflowlinkFile.senparas[k].senpara_name=paras[i].para_name;
			ooflowlinkFile.senparas[k].senpara_required=paras[i].para_required;
			k++;
		}
	}
	return ooflowlinkFile;
}
