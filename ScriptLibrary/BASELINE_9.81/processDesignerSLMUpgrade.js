var NULLSUB=funcs.nullsub;
var DENULL=funcs.denull;
var LNG=funcs.lng;
var INDEX=funcs.index;
var INSERT=funcs.insert;


function upgradeSecurity() {
    print("Start enabling Security for SLM module...");

    var ret=0;
    upgradeProfiles();
    
    funcs.rtecall("trigger", ret, 0);
    upgradeOperatorsAndUserRoles("operator");
    funcs.rtecall("trigger", ret, 1);  
    upgradeOperatorsAndUserRoles("userrole");
    
    print("Finish enabling Security for SLM module");
}

function tryAddRole( profile )
{
	var secRole = new SCFile("secRole");
	var sql="name=\""+profile.name+"\"";
	
	if ( secRole.doSelect( sql ) == RC_SUCCESS ){
		return;
	}else{
		secRole.name=profile.name;
		secRole.doSave();
	}
}

function upgradeProfiles()
{
	var profile = new SCFile( "slaprofile" );
	var sql = "true";
	if ( profile.doSelect( sql ) == RC_SUCCESS ){
		do{
			tryAddRole(profile);
			
			var roleRight = new SCFile( "secRights" );
			
			roleRight["area"]="Service Level Management";
			roleRight["delete"]=setDelete(profile);
			roleRight["new"]=setNew(profile);
			roleRight["update"]=setUpdate(profile);
			roleRight["view"]=setView(profile);
			roleRight["role"]=profile["name"];
			roleRight["settingId"]=["sltcat.manage", "aggregate.view", "monthly.avail.view", "monthly.resp.view", "outage.detail.view", "outage.event.view", "resp.detail.view", "sla.active.view"];
			roleRight["settingValue"]=setSettingConfig(profile);
			roleRight["allowedStatus"]=setAllowedStatus(profile);

            migrateFolderRights(profile, roleRight);

            roleRight.doSave();


			
		}
		while ( profile.getNext() == RC_SUCCESS );
	}
}


function migrateFolderRights(profile, rights) {

    var migratedFolders = lib.FolderMigrate.migrateSLAFolder(rights);

    lib.FolderMigrate.apendRightFolders(rights, migratedFolders);
}


function upgradeOperatorsAndUserRoles(filename)
{
	var operatorORuserrole = new SCFile(filename);
	var sql = "true";
	var index =0;
	if ( operatorORuserrole.doSelect( sql ) == RC_SUCCESS )
	{
		do
		{	
			if(operatorORuserrole.profile_sla!=null)
			{
				if ( INDEX( operatorORuserrole.profile_sla, operatorORuserrole.secRole ) == 0 )
				{
					operatorORuserrole.secRole = INSERT( operatorORuserrole.secRole, 0, 1, operatorORuserrole.profile_sla );
				}
			}
			index=INDEX( "default", operatorORuserrole.secRole );
			if ( index > 0 )
			{    	    
				operatorORuserrole.secRole[index-1]="DEFAULT";
			}
			
			if ( LNG(DENULL( operatorORuserrole.secRole ) ) == 0 )
			{
				operatorORuserrole.secRole[0] = "DEFAULT";
			}	
			operatorORuserrole.doUpdate();
		}
		while ( operatorORuserrole.getNext() == RC_SUCCESS );
	}

}



function setSettingConfig( sourceTableRow )
{
	var var1, var2, var3, var4, var5, var6, var7, var8;

	if(NULLSUB(sourceTableRow["slocat.new"], false)==false && 
	   NULLSUB(sourceTableRow["slocat.delete"], false)==false && 
       (NULLSUB(sourceTableRow["slocat.update"], "")=="never" || NULLSUB(sourceTableRow["slocat.update"], "")=="")&&
	   NULLSUB(sourceTableRow["slocat.view"], false)==false)
	{
		var1="false";
	}else{
		var1="true";
	}
	
	if(NULLSUB(sourceTableRow["aggregate.view"], false)){
		var2="true";
	}else{
		var2="false";
	}
		
	if(NULLSUB(sourceTableRow["monthly.avail.view"], false)){
		var3="true";
	}else{
		var3="false";
	}
	
	if(NULLSUB(sourceTableRow["monthly.resp.view"], false)){
		var4="true";
	}else{
		var4="false";
	}
	
	if(NULLSUB(sourceTableRow["outage.detail.view"], false)){
		var5="true";
	}else{
		var5="false";
	}
		
	if(NULLSUB(sourceTableRow["resp.detail.view"], false)){
		var7="true";
	}else{
		var7="false";
	}

	if(NULLSUB(sourceTableRow["outage.event.view"], false)){
		var6="true";
	}else{
		var6="false";
	}			
		
	if(NULLSUB(sourceTableRow["sla.active.view"], false)){
		var8="true";
	}else{
		var8="false";
	}			
		
	return [var1,var2,var3,var4,var5,var6,var7,var8];
}

function setView( sourceTableRow )
{
	if(NULLSUB(sourceTableRow["sla.view"], false) || NULLSUB(sourceTableRow["slor.view"], false) || NULLSUB(sourceTableRow["sloa.view"], false)){
		return true;
	}else{
		return false;
	}
}

function setNew( sourceTableRow )
{
	if(NULLSUB(sourceTableRow["sla.new"], false) || NULLSUB(sourceTableRow["slor.new"], false) || NULLSUB(sourceTableRow["sloa.new"], false)){
		return true;
	}else{
		return false;
	}
}

function convertToNumber(updatestring)
{
	if(updatestring=="always"){
		return 4;	
	}else if(updatestring=="assigned"){
		return 3;
	}else if(updatestring=="never"){
		return 2;
	}else if(updatestring=="" || updatestring==null){
		return 1;
	}
}

function convertToUpdate(updatenumber)
{
	if(updatenumber==4){
		return "always";	
	}else if(updatenumber==3){
		return "assigned";
	}else if(updatenumber==2){
		return "never";
	}else{
		return "";
	}
}

function setUpdate( sourceTableRow )
{	
	var temp=[];
	var max=0;
	
	temp.push(NULLSUB(sourceTableRow["sla.update"], "never"));
	temp.push(NULLSUB(sourceTableRow["slor.update"], "never"));
	temp.push(NULLSUB(sourceTableRow["sloa.update"], "never"));
	
	var i;
	for(i=0; i<temp.length; i++){
		var it=convertToNumber(temp[i]);
		if(max<it){
			max=it;
		}
	}	
	return convertToUpdate(max);
}

function setDelete( sourceTableRow )
{
	if(NULLSUB(sourceTableRow["sla.delete"], false) || NULLSUB(sourceTableRow["slor.delete"], false) || NULLSUB(sourceTableRow["sloa.delete"], false)){
		return "always";
	}else{
		return "never";
	}
}

function removeDuplicate(sourceArray, targetArray)
{
	var t= DENULL(sourceArray);
	var len=LNG(t);
	
	var i, j;
	for(i=0; i<len; i++){
		var found=false;
		for(j=0; j<ret.length; j++){
			if(t[i]==targetArray[j]){
				found=true;
				break;
			}
		}
		
		if(!found){
			targetArray.push(t[i]);
		}
	}

}

function setAllowedStatus( sourceTableRow )
{
	var ret=[];
	removeDuplicate(sourceTableRow["slor.allowedStatus"], ret);
	removeDuplicate(sourceTableRow["sloa.allowedStatus"], ret);
	removeDuplicate(sourceTableRow["sla.allowedStatus"], ret);		
	return ret;
}