/*
Function Description:
1.One time split relationship from one-to-many to one-to-one.
2.Trigger add or deletation a record of cirelationship1to1 table.

Author: Zhi Chao.Fei
Create Time:09/01/2011
*/

//Below two lines a constant for record of one-to-one relationship.
var RELATIONSHIP1TO1_IN_USED="In Used";
var RELATIONSHIP1TO1_REMOVED="Removed";

var ciNameArray = new Array();
var ciArray = new Array();

//This function is used to one time split relationship.
function createRelations()
{
   deleteAllRelation2(); 
   var relationFile = new SCFile("cirelationship"); 
	var members = new Array();
	var index = 0;
	var memberIndex = 0;
	if (relationFile.doSelect("true") == RC_SUCCESS) 
	{
		
		do {			
		    //get the related cis from a relation
		    var memberLng = system.functions.lng(system.functions.denull(relationFile.related_cis));
		    
		    var logicalName = relationFile.logical_name;
		    var relationSubType = relationFile.relationship_subtype;
		    var relationType = relationFile.relationship_type;
		    var relationshipName = relationFile.relationship_name;
		    var outageDependency = relationFile.outage_dependency;
		    var outageThreshold = relationFile.outage_threshold;
		    
		    var upstreamCI= getCI(logicalName); 
		    if (upstreamCI != null){
			    for(var i=0;i<memberLng;++i){
			    	 	var relatedCi = relationFile.related_cis[i];
			    	 	var downstreamCI= getCI(relatedCi);
			    	 	if (downstreamCI != null){
			    	 		var cirelationships= new SCFile("cirelationship1to1");
			    	 		cirelationships.relationship_name =  relationFile.relationship_name;

			    	 		cirelationships.upstreamci_logical_name =  relationFile.logical_name;
			    	 		cirelationships.downstreamci_logical_name =  downstreamCI.logical_name;
			    	 		
			    	 		cirelationships.upstreamci_type = upstreamCI.type;
			    	 		cirelationships.downstreamci_type = downstreamCI.type;
			    	 		
							// add by Xiong-jie MA, set the subtype while creating the relationship1to1 records.
			    	 		cirelationships.upstreamci_subtype = upstreamCI.subtype;
			    	 		cirelationships.downstreamci_subtype = downstreamCI.subtype;

			    	 		cirelationships.upstreamci_ucmdb_id = upstreamCI.ucmdb_id;
			    	 		cirelationships.downstreamci_ucmdb_id = downstreamCI.ucmdb_id;

							// end by Xiong-jie MA
			    	 		
			    	 		//Below code lines are added by fei, zhi-chao
			    	 	    cirelationships.upstreamci_id = upstreamCI.logical_name;
							cirelationships.downstreamci_id = downstreamCI.logical_name;
							cirelationships.status = RELATIONSHIP1TO1_IN_USED;			    	 					    	 		
			    	 		cirelationships.relationship_type = relationType;
			    	 		cirelationships.relationship_subtype = relationSubType;
			    	 		cirelationships.create_datetime = system.functions.tod();
			    	 		cirelationships.update_datetime = system.functions.tod();
			    	 		cirelationships.doInsert();
			    	 	}
			    }
		    }	
		} while(relationFile.getNext() == RC_SUCCESS)
	}
	print(system.functions.scmsg(59, "am"));
}

//Get ci detail information
function getCI(ciName){
 var index = lib.ArrayUtil.indexOf(ciNameArray,ciName);
 if (index == -1){
    var device = new SCFile("device");
    if (device.doSelect("logical.name=\"" + ciName + "\"") == RC_SUCCESS) {
    	ciArray.push(device);
    	ciNameArray.push(ciName);
    	return device;
    }
    return null;
 }else{
   return ciArray[index];
 }
}

//Trigger add operation when user add one ci relationship.
function addRelationShipToCiRelation1to1(relationship, oldRelationship)
{			
	if(system.vars.$G_UCMDB_integration == false){
		return;
	}
    var memberLng = system.functions.lng(system.functions.denull(relationship.related_cis));
    var logicalName = relationship.logical_name;
    var relationSubType = relationship.relationship_subtype;
    var relationType = relationship.relationship_type;
    var relationshipName = relationship.relationship_name;
    var outageDependency = relationship.outage_dependency;
    var outageThreshold = relationship.outage_threshold;
    
    var upstreamCI= getCI(logicalName);
    if (upstreamCI != null){		    
	    for(var i=0;i<memberLng;++i){
	    	 	var relatedCi = relationship.related_cis[i];
	    	 	var downstreamCI= getCI(relatedCi);
	    	 	if (downstreamCI != null){
	    	 		if (checkRelationship1to1Exist(logicalName, relatedCi, relationSubType))
	    	 		    continue;
	    	 		this.deleterelationship1to1(logicalName,downstreamCI.logical_name,relationSubType);
	    	 		var cirelationships= new SCFile("cirelationship1to1");
	    	 		cirelationships.relationship_name =  relationship.relationship_name;

	    	 		cirelationships.upstreamci_logical_name =  relationship.logical_name;
	    	 		cirelationships.downstreamci_logical_name =  downstreamCI.logical_name;
	    	 		
	    	 		cirelationships.upstreamci_type = upstreamCI.type;
	    	 		cirelationships.downstreamci_type = downstreamCI.type;
	    	 		
	    	 		cirelationships.upstreamci_subtype = upstreamCI.subtype;
	    	 		cirelationships.downstreamci_subtype = downstreamCI.subtype;
	    	 		
	    	 	    cirelationships.upstreamci_id = upstreamCI.logical_name;
					cirelationships.downstreamci_id = downstreamCI.logical_name;
					
					cirelationships.status = RELATIONSHIP1TO1_IN_USED;			    	 	    	 		
	    	 		cirelationships.relationship_type = relationType;
	    	 		cirelationships.relationship_subtype = relationSubType;

					// add by xjma to sync the ucmdb ids to 1to1 table
	    	 	    cirelationships.upstreamci_ucmdb_id = upstreamCI.ucmdb_id;
					cirelationships.downstreamci_ucmdb_id = downstreamCI.ucmdb_id;
					// end add by xjma
	    	 		
	    	 		cirelationships.create_datetime = system.functions.tod();
	    	 		cirelationships.update_datetime = system.functions.tod();
	    	 		cirelationships.doInsert();
	    	 	}

	    }
    }	
}

//Trigger delete relationship1to1 when user delete a ci relationship record.
function deleteRelatedRelation1to1(relationship)
{
	if(system.vars.$G_UCMDB_integration == false){
		return;
	}
    var memberLng = system.functions.lng(system.functions.denull(relationship.related_cis));
    var logicalName = relationship.logical_name;
    var relationSubType = relationship.relationship_subtype;
    
    for(var i=0;i<memberLng;++i){
 		removeRelationship1to1(logicalName, relationship.related_cis[i], relationSubType, relationship.relationship_name);
 	}
}

//Trigger delete relationship1to1 when user delete a device record.
function deleteRelatedRelation1to1ByDevice(device)
{
	if(system.vars.$G_UCMDB_integration == false){
		return;
	}
    var logicalName = device.logical_name;

	var cirelationships= new SCFile("cirelationship1to1");
	var result = cirelationships.doSelect("(upstreamci.logical.name=\"" + logicalName + "\" or downstreamci.logical.name=\""+logicalName+"\") and status=\"In Used\"");
	if(result == RC_SUCCESS){
    	do{
    		cirelationships.status = RELATIONSHIP1TO1_REMOVED;	
	 		cirelationships.update_datetime = system.functions.tod();		    	 	    	 		
	 		cirelationships.doUpdate();
    	}while(cirelationships.getNext() == RC_SUCCESS)
    }
}

//Trigger update operation when user update a ci relationship reocrd.
function updateRelatedRelation1to1(relationship, oldRelationship)
{
	if(system.vars.$G_UCMDB_integration == false){
		return;
	}
    var memberLng = system.functions.lng(system.functions.denull(relationship.related_cis));
    var logicalName = relationship.logical_name;
    var relationSubType = relationship.relationship_subtype;
    
    var relationType = relationship.relationship_type;
    var relationshipName = relationship.relationship_name;
    var outageDependency = relationship.outage_dependency;
    var outageThreshold = relationship.outage_threshold;
    var cirelationarray = new Array();
    
    var diff=diffArray(relationship.related_cis.toArray(),oldRelationship.related_cis.toArray());
    
    var newrelationset = diff.add;
    var delrelationset = diff.del;
    
	var upstreamCI= getCI(logicalName);		    
    if(newrelationset != null && newrelationset.length > 0){
    	for(var i = 0; i < newrelationset.length;i++){
    	    if (checkRelationship1to1Exist(logicalName, newrelationset[i], relationSubType))
    	        continue;
    	    var downstreamCI= getCI(newrelationset[i]);
    	    
    	    if (null==downstreamCI){
    	    	continue;
    	    }
    	    
    	    this.deleterelationship1to1(logicalName,downstreamCI.logical_name,relationSubType);
    		var cirelationships= new SCFile("cirelationship1to1");
   	 		cirelationships.relationship_name =  relationship.relationship_name;

	 		cirelationships.upstreamci_logical_name =  relationship.logical_name;
	 		cirelationships.downstreamci_logical_name =  downstreamCI.logical_name;
	 		
	 		cirelationships.upstreamci_type = upstreamCI.type;
	 		cirelationships.downstreamci_type = downstreamCI.type;
	 		
	 		cirelationships.upstreamci_subtype = upstreamCI.subtype;
	 		cirelationships.downstreamci_subtype = downstreamCI.subtype;
	 		
	 		cirelationships.upstreamci_ucmdb_id = upstreamCI.ucmdb_id;
			cirelationships.downstreamci_ucmdb_id = downstreamCI.ucmdb_id;
	 		
	 	    cirelationships.upstreamci_id = upstreamCI.logical_name;
			cirelationships.downstreamci_id = downstreamCI.logical_name;
			cirelationships.status = RELATIONSHIP1TO1_IN_USED;			    	 	    	 		
	 		cirelationships.relationship_type = relationType;
	 		cirelationships.relationship_subtype = relationSubType;
	 		cirelationships.create_datetime = system.functions.tod();
	    	cirelationships.update_datetime = system.functions.tod();
	 		cirelationships.doInsert();
    	}
    }
    
    if(delrelationset != null && delrelationset.length > 0){
    	for(var i = 0; i < delrelationset.length;i++){
    	    removeRelationship1to1(logicalName, delrelationset[i], relationSubType, oldRelationship.relationship_name);
    	}
    }
}

// If there is the cirelationship1to1 created by other relationship, do nothing and return false
// Otherwise, set the status of the cirelationship1to1 to Removed.
function removeRelationship1to1(upstreamci, downstreamci, subtype, relationship_name) {
    var cirelationship1to1 = new SCFile("cirelationship1to1");
    var rc = cirelationship1to1.doSelect("upstreamci.logical.name=\""+upstreamci+"\" and downstreamci.logical.name=\""+downstreamci+"\" and relationship.subtype=\""+subtype+"\" and status=\"In Used\"");
    if (rc == RC_SUCCESS) {
        var relationships = new SCFile("cirelationship",SCFILE_READONLY);
        relationships.setFields(['relationship.name', 'logical.name']);
        var count = relationships.doCount("logical.name=\""+upstreamci+"\" and relationship.subtype=\""+subtype+"\" and relationship.name<>\""+relationship_name+"\" and related.cis=\""+downstreamci+"\"");
        if (count == 0) {
            cirelationship1to1.status = RELATIONSHIP1TO1_REMOVED;     
            cirelationship1to1.update_datetime = system.functions.tod();                                                    
            cirelationship1to1.doUpdate();
            return true;
        }
    }
    return false;
}

// Check if the cirelation1to1 exists. Return true when exist, otherwise, return false.
function checkRelationship1to1Exist(upstreamci, downstreamci, subtype) {
    var cirelationship1to1 = new SCFile("cirelationship1to1");
    var rc = cirelationship1to1.doSelect("upstreamci.logical.name=\""+upstreamci+"\" and downstreamci.logical.name=\""+downstreamci+"\" and relationship.subtype=\""+subtype+"\" and status=\"In Used\"")
    if (rc == RC_SUCCESS)
        return true;
    return false;
}


//If the specified record of ci relationship one-to-one is exist then we will delete it.
function deleterelationship1to1(upstreamciname,downstreamciname,relationshipsubtype)
{
	var cirelationships= new SCFile("cirelationship1to1");
	var result = cirelationships.doSelect("upstreamci.logical.name=\"" + upstreamciname + "\" and downstreamci.logical.name=\""+downstreamciname+"\" and relationship.subtype=\""+relationshipsubtype+"\"");
	if(result == RC_SUCCESS)
	{
		cirelationships.doDelete();
	}

}

//Update the record of ci relationship one-to-one
function updaterelation1to1(upstreamciname,relationshipname,fieldname,fieldvalue){
	if(system.vars.$G_UCMDB_integration == false){
		return;
	}
	var relationships = new SCFile("cirelationship1to1");
    var result = relationships.doSelect("upstreamci.logical.name=\"" + upstreamciname + "\" and relationship.name=\"" + relationshipname + "\"");
    
    var relationarray = new Array();
    if(result == RC_SUCCESS){
    	do{
	    	//Delete the recured
	    	if(fieldname=="status")
	    	{
	    		relationships.status=fieldvalue;
	    	}
	    	else
	    	{
	    		relationships.relationship_type=fieldvalue		    	
	    	}
	    	relationships.update_datetime = system.functions.tod();		    	 	
	    	relationships.doUpdate();
    	}while(relationships.getNext() == RC_SUCCESS)
    }
}


//Conpare the downstreamci list with record of one-to-one, then get which ci will be delete or add.
function puckupCis(memberLng,related_cis,relation2_cis){
	var obj = new Object();
	var newrelationarr = new Array();
	var delrelationarr = new Array();	
	obj.newrelation = {};
	obj.delrelation = {};
	
	for(var i=0;i<memberLng;i++){
 		var relatedCi = related_cis[i];
 		var isnotexistinrelation2 = false;
 		for(var j = 0;j < relation2_cis.length;j++){
 			if(relatedCi==relation2_cis[j]){
 				isnotexistinrelation2 = true;
 				break;
 			}
 		}
 		if(!isnotexistinrelation2){
 			newrelationarr.push(relatedCi);
 		}
 	}
 		
 		
	for(var i = 0;i < relation2_cis.length;i++){
		var isnotexistinrelation2 = false;
		for(var j=0;j<memberLng;j++){
			var relatedCi = related_cis[j];
			if(relation2_cis[i] == relatedCi){
				isnotexistinrelation2 = true;
				break;
			}
		}
		if(!isnotexistinrelation2){
			delrelationarr.push(relation2_cis[i]);
		}
	}
 	obj.newrelation = newrelationarr;
	obj.delrelation = delrelationarr;
 	return obj;
}

//Clear all ci relationship one-to-one record.
function deleteAllRelation2(){
	
	var cirelationships= new SCFile("cirelationship1to1");
	var result = cirelationships.doSelect("true");
	if(result == RC_SUCCESS){
		do{
			cirelationships.doDelete();
		}while(cirelationships.getNext() == RC_SUCCESS)
    }
}

// add by Xiongjie MA 2012-08-07, sync the ucmdb id and ci type/subtype to relationshop1to1 table while device record is changed
function updateRelation1to1ByDevice(device, oldDevice) {
    // if uCMDB integration is disabled, do nothing
    if(system.vars.$G_UCMDB_integration == false){
		return;
	}
	// if uCMDB id and subtype  are not changed, do nothing
    if(device.ucmdb_id == oldDevice.ucmdb_id && device.subtype == oldDevice.subtype && device.type == oldDevice.type) {
		return;
	}

	// update ucmdb id and subtype of upstream CI in cirelationship1to1 table
	var relationships = new SCFile("cirelationship1to1");
    var result = relationships.doSelect("upstreamci.logical.name=\"" + device.logical_name + "\"");
    if(result == RC_SUCCESS) {
    	do{
	    	relationships.upstreamci_ucmdb_id = device.ucmdb_id
	    	relationships.upstreamci_type = device.type
	    	relationships.upstreamci_subtype = device.subtype
	    	relationships.doUpdate();
    	}while(relationships.getNext() == RC_SUCCESS)
    }

    // update ucmdb id and subtype of downstream CI in cirelationship1to1 table
	var relationships = new SCFile("cirelationship1to1");
    var result = relationships.doSelect("downstreamci.logical.name=\"" + device.logical_name + "\"");
    if(result == RC_SUCCESS) {
    	do{
	    	relationships.downstreamci_ucmdb_id = device.ucmdb_id
	    	relationships.downstreamci_type = device.type
	    	relationships.downstreamci_subtype = device.subtype
	    	relationships.doUpdate();
    	}while(relationships.getNext() == RC_SUCCESS)
    }
}


function diffArray(a1,a2){
   var a = {};
   var b = {};
   var k = 0;
   
   for(k=0;k<a1.length;k++){
      a[a1[k]]=1;
   }
   
   for(k=0;k<a2.length;k++){
      b[a2[k]]=1;
   }
   
   var r1 = [];
   var r2 = [];
   
   for (k=0;k<a1.length;k++){
      if (!b[a1[k]]){
        r1.push(a1[k]);
      }
   }
   
   for(k=0;k<a2.length;k++){
      if (!a[a2[k]]){
        r2.push(a2[k]);
      }
   }
   
   return {add: r1, del:r2};
   
}