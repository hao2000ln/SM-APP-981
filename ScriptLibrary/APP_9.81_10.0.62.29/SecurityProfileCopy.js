_getAllOtherCITypes = lib.BaselineHelper.getAllOtherCITypes;

var mappedFields = [];

var areaTableMap = {"Change":"cm3r","Change Task":"cm3t","Problem":"rc","Problem Tasks":"rct","Incident":"pm","Service Desk":"sm","Request":"request","Configuration Item":"am"}

/** script to identify tailored fields**/
function getTailoredFields(upgradeInfoObj) {
      var list = new Array();
      var profileDbdict = new SCFile("dbdict");
      profileDbdict.doSelect("name=\""+upgradeInfoObj["profile_dbdict_name"]+"\"");
      var allFields = profileDbdict.field;
      for (var i = 0, iLoopTimes = allFields.length(); i < iLoopTimes; i++) {
            //  support number (1 number), string (2 character),  boolean (4 logical), record (6 record), list (8 array), condition( 11 expression)
            var allowedType = [1, 2, 4, 8, 11]; //6,
            if (allFields[i] != null && allFields[i].level == 1 && lib.ArrayUtil.contains(allowedType, allFields[i].type)) {
                  //avoid field alias
                  if(i>0 && allFields[i].level == allFields[i-1].level && allFields[i].index == allFields[i-1].index){
                    continue;
                  }
                  var name = allFields[i].name;
                  if(!lib.ArrayUtil.contains(upgradeInfoObj["dbdict_profile_930"], name))
                  list.push([name, allFields[i].type]);
            }
      }
      return list;
}
var profileFileName="";
var tailoredFields = [];
/** script to insert tailored fields to settingConfig and javscript**/
function insertFieldsToSettingsConfig(list,upgradeInfoObj) {
      var areas=upgradeInfoObj["areas"];
      var scriptLibrary = new SCFile("ScriptLibrary");
      scriptLibrary.doSelect("name=\""+upgradeInfoObj["script_setup_name"]+"\"");
      var script = scriptLibrary.script;
      var lines = script.split("\n");
      var initialLines=lines.length;
      for(var type=0;type<areas.length; type++ ){
	      var area = areas[type];
	      var table = areaTableMap[area];
	      for (var i = 0; i < list.length; i++) {
	            var scFile = new SCFile("settingsConfig");
	            var item = list[i];
	            //using map format to avoid keyword. I.E. new broken javascript compile
	            if (!lib.ArrayUtil.contains(mappedFields, item[0]) ) {
	                  tailoredFields.push(item[0]);
	            }
	            var addingLine = "vars.$G_"+table+"_environment[\"" + item[0] + "\"] =system.functions.val(lib.security.getToken(\""+area+"\", \"" + item[0] + "\")," + item[1] + ");";
	            var insertPoint = lib.ArrayUtil.indexOf(lines, "/**end "+table+" tailoring fields**/");
	            //always add to the last line
	            if (insertPoint > 0 && !lib.ArrayUtil.contains(lines, addingLine)) {
	                  lines.splice(insertPoint, 0, addingLine);
	            }
	
	            if (scFile.doSelect("setting=\""+area+"\" and id=\"" + item[0] + "\"") != RC_SUCCESS) {
	                  scFile.setting = area;
	                  scFile.settingType = "area";
	                  scFile.id = item[0];
	                  scFile.label = setFieldLable(item[0]);
	                  switch ("" + item[1]) {
	                  case "4":
	                        scFile.type = "boolean";
	                        break;
	                  case "6":
	                        scFile.type = "record";
	                        break;
	                  case "8":
	                        scFile.type = "list";
	                        break;
	                  default:
	                        scFile.type = "string";
	                        break;
	                  }
	                  print("inserting new fields:"+item+" into settingsConfig area:"+area);
	                  scFile.doSave();
	            } 
	      }
      }
      if(initialLines<lines.length){
            scriptLibrary.script = lines.join("\n");
            scriptLibrary.doSave();
      }
}

function setFieldLable(field) {
      if (field == null) return "";
      var words = field.replace(/\./g, " ").split(" ");
      for (var i = 0; i < words.length; i++) {
            words[i] = words[i].substr(0, 1).toUpperCase() + words[i].substr(1);
      }
      return words.join(" ");
}

function upgradeProfiles(profileName,upgradeInfoObj,roleNameAlias) {
      if (upgradeInfoObj["profile_dbdict_name"]!=profileFileName) 
      { 	
            //initial the tailoring fields
      		profileFileName=upgradeInfoObj["profile_dbdict_name"];
      		tailoredFields=[];
      		mappedFields = [];
            var list = getTailoredFields(upgradeInfoObj);
            insertFieldsToSettingsConfig(list,upgradeInfoObj);
      }
      
      mappedFields = upgradeInfoObj["mapped_fields"];

      var profile = new SCFile(upgradeInfoObj["profile_dbdict_name"]);
      var sql = "name=\"" + profileName + "\"";

      if (profile.doSelect(sql) == RC_SUCCESS) {
            do {
                  var role = new SCFile("secRole");
                  var roleName=profile.name;
                  if(roleNameAlias!=null){
                  	roleName=roleNameAlias;
                  }
                  var sql = "name=\"" + roleName + "\"";
                  if (role.doSelect(sql) != RC_SUCCESS) {
                        role.name = roleName;
                        role.description = profile.name;
                        role.doInsert();
                  }
                  if(upgradeInfoObj["profile_dbdict_name"] =="rcenv"){
                  	 var delete_right="never";
                  	 var admin_right=false;
                  	 var expert_right=false;
                  	 if (profile.close == true) delete_right = "always";
                  	 if (profile.pm_template==true || profile.pm_complex==true) expert_right = true;
					 if (profile.change_phase == true) admin_right = true;
					 var rightObj={"new":profile._new,"view":profile.view,"update":profile.update,"delete":delete_right,"admin":admin_right,"expert":expert_right};
                 	 updateRights(roleName, profile,"Problem",rightObj,"rootcause",{"assign.groups":"assignmentGroup"});
                 	 
                 	 mappedFields=["pmt.advanced.search","pmt.allowedStatus","pmt.assign.groups","pmt.close","pmt.count","pmt.create.known.error","pmt.edit.format","pmt.global.inbox","pmt.inbox.edit","pmt.inbox.search","pmt.initial.format","pmt.initial.inbox","pmt.list.edit","pmt.lock.on.display","pmt.manage.format","pmt.new","pmt.partial.key","pmt.personal.inbox","pmt.complex","pmt.template","pmt.print.format","pmt.qbe.format","pmt.reopen","pmt.search.format","pmt.search.list","pmt.skip.warning","pmt.update","pmt.view","pmt.views"];
                  	 var delete_right="never";
                  	 var admin_right=false;
                  	 var expert_right=false;
                  	 if (profile.pmt_close == true) delete_right = "always";
                  	 if (profile.pmt_template==true || profile.pmt_complex==true ) expert_right = true;
					 var rightObj={"new":profile.pmt_new,"view":profile.pmt_view,"update":profile.pmt_update,"delete":delete_right,"admin":admin_right,"expert":expert_right};
                 	  updateRights(roleName, profile,"Problem Tasks",rightObj,"rootcausetask",{'pmt.new':'new', 'pmt.close':'delete', 'pmt.update':'update', 'pmt.reopen':'reopen', 'pmt.view':'view',  'pmt.create.known.error':'create.known.error', 'pmt.template':'expert', 'pmt.complex':'expert', 'pmt.views':'view', 'pmt.count':'view', 'pmt.advanced.search':'expert', 'pmt.personal.inbox':'personal.inbox', 'pmt.global.inbox':'global.inbox', 'pmt.lock.on.display':'lock.on.display', 'pmt.allowedStatus':'allowedStatus', 'pmt.assign.groups':'assignmentGroup', 'pmt.partial.key':'partial.key', 'pmt.skip.warning':'skip.warning', 'pmt.initial.inbox':'initial.inbox', 'pmt.edit.format':'edit.format', 'pmt.search.format':'search.format', 'pmt.qbe.format':'qbe.format', 'pmt.manage.format':'manage.format', 'pmt.print.format':'print.format', 'pmt.inbox.search':'inbox.search', 'pmt.search.list':'search.list', 'pmt.list.edit':'list.edit', 'pmt.inbox.edit':'inbox.edit'});
                  
                  
                  }else if(upgradeInfoObj["profile_dbdict_name"] =="pmenv"){
                     var delete_right="never";
                  	 var expert_right=false;
                  	 var admin_right=false;
                  	 if (profile.close == true) delete_right = "always";
                  	 if (profile.prob_mgmt_candidate == true || profile.suspend == true || profile.unsuspend == true || profile.notes == true || profile.override == true || profile.db_template == true || profile.db_complex == true) expert_right = true;
                  	 //for the solution matching in Incident module , if all of the incident solution matching options are not checked , then the solution matching in the new secRight will be set as false , otherwise , the value will be true 
                  	 if (profile.check_rc ==false  && profile.ir_query ==false  && profile.check_duplicates ==false  && profile.check_parents == false){
                  	    profile.check_rc =false;//pickup the first solution matching option as representative and used for later value copy over
                  	 }else {
                  	    profile.check_rc =true;
                  	 }
					 var rightObj={"new":profile._new,"view":profile.view,"update":profile.update,"delete":delete_right,"admin":admin_right,"expert":expert_right};
                     updateRights(roleName, profile,"Incident",rightObj,"probsummary",{"assignment.groups":"assignmentGroup", "categories":"allowedCategory","check.rc":"use.solution.matching"});                                                                                                                                                      
                  }else if(upgradeInfoObj["profile_dbdict_name"] =="smenv"){
                  
                   	 var delete_right="never";
                  	 var admin_right=false;
                  	 var expert_right=false;
                  	 if (profile.close == true) delete_right = "always";
                  	 if ( profile.db_template == true || profile.db_complex == true) expert_right = true;
					 var rightObj={"new":profile._new,"view":profile.view,"update":profile.update,"delete":delete_right,"admin":admin_right,"expert":expert_right};
                     updateRights(roleName, profile,"Service Desk",rightObj,"incidents",{"approval.groups":"approvalGroup"});
                  }else if(upgradeInfoObj["profile_dbdict_name"] =="ocmprofile"){
                     var delete_right="never";
                  	 var admin_right=false;
                  	 var expert_right=false;
                  	 if (profile.close == true) delete_right = "always";
                  	 if (profile.audit==true || profile.pagelist==true || profile.valid_lkup==true || profile.alert_brw==true || profile.approve_mass==true || profile.apprdism==true) expert_right = true;
					 if (profile.approve_override==true) admin_right = true;
					 var rightObj={"new":profile._new,"view":profile.view,"update":profile.update,"delete":delete_right,"admin":admin_right,"expert":expert_right};
                 	 updateRights(roleName, profile,"Request",rightObj,"request",{"assign.groups":"assignmentGroup"});
                 	 
                  }else if(upgradeInfoObj["profile_dbdict_name"] =="icmenv") {
                     var delete_right="never";
                  	 var admin_right=false;
                  	 var expert_right=false;
                  	 if (profile["delete"] == true) delete_right = "always";
                  	 if (profile.db_template == true || profile.db_complex == true) expert_right = true;
					 var rightObj={"new":profile._new,"view":profile.view,"update":profile.update,"delete":delete_right,"admin":admin_right,"expert":expert_right};
                     updateRights(roleName, profile,"Configuration Item",rightObj,"device",{"type":"allowedCategory"});
                  }

            }
            while (profile.getNext() == RC_SUCCESS);

      }
}

/*
This method is used to update service desk security including folder.
*/
function updateServiceDeskRights(profile, area,sdFieldMap,tableName) {
        var rights = new SCFile("secRights")
      var sql = "role=\"" + profile.name + "\" and area=\""+area+"\"";
      var action = "update";

      if (rights.doSelect(sql) != RC_SUCCESS) {
            action = "add";
            rights.role = profile.name;
            rights.area = area;
      }

      //all the profile security mapped to rights
  
      rights._new = profile._new;
      rights.update = profile.update;
      rights.modifyTemplate = profile.modifyTemplate;
      
      rights._delete = "never";
      if (profile.close == true) rights._delete = "always";
      rights.view = false;
      if(profile.view == true || profile.views  == true ) rights.view=true;
      
      rights.expert = false;
      rights.admin = false;
      if( profile.db_template == true || profile.db_complex == true ||  profile.personal_inbox == true) rights.expert = true;
      if(profile.personal_inbox == true ) rights.admin = true;
      rights.allowedStatus = profile.allowedStatus;

      
      //combine mapped fields and tailored fields
      for (var i = 0; i < tailoredFields.length; i++) {
            if (!lib.ArrayUtil.contains(mappedFields, tailoredFields[i])) {
                  mappedFields.push(tailoredFields[i]);
            }
      }

      setRights(tableName, profile,rights,mappedFields,action,sdFieldMap);
}




/*
This method is used to update common security including folder.
*/
function updateRights(roleName, profile,area,rightsObj,tableName,addlFieldMap) {

      var rights = new SCFile("secRights")
      var sql = "role=\"" + roleName + "\" and area=\""+area+"\"";
      var action = "update";

      if (rights.doSelect(sql) != RC_SUCCESS) {
            action = "add";
            rights.role = roleName;
            rights.area = area;
      }

      //all the profile security mapped to rights
      rights._new = rightsObj["new"];
      rights.update =rightsObj["update"] ;
  	  rights._delete =rightsObj["delete"] ;
      rights.view=rightsObj["view"];
      
      rights.expert = rightsObj["expert"];
      rights.admin = rightsObj["admin"];
     
      //combine mapped fields and tailored fields
      for (var i = 0; i < tailoredFields.length; i++) {
            if (!lib.ArrayUtil.contains(mappedFields, tailoredFields[i])) {
                  mappedFields.push(tailoredFields[i]);
            }
      }
      setRights(tableName,profile,rights,mappedFields,action,addlFieldMap);
}


/** 
* table: the table of module
* profile: profile of the record
* rights: new rights of the security
* mappedFields: all the fields need mapped
* action: add or save
**/
function setRights(tableName, profile,rights,mappedFields,action,addrFieldMap){
//set the mapping values
      for (var i = 0; i < mappedFields.length; i++) {
        
            var sourceField=mappedFields[i];
               
            var targetField=sourceField;

            if(addrFieldMap !=null && addrFieldMap[sourceField] !=null){
               targetField = addrFieldMap[sourceField];
            }
            
            //handle the array type
            if(system.functions.type(profile[sourceField])==8){
                rights[targetField] = profile[sourceField];
               } 
            else {	         
	            var existedId = system.functions.index(targetField, rights.settingId);
	           
	            if (existedId == 0) { //add to the last
	                  var lastPostion = system.functions.lng(rights.settingId) ;
	                  rights.settingId[lastPostion] = targetField;
	                  rights.settingValue[lastPostion] = system.functions.str(profile[sourceField]);
	            } else {
	                  rights.settingValue[existedId - 1] = system.functions.str(profile[sourceField]);
	            }
            }
            
            //handle specially for CI "Allowed Categories" migration, since "$G.icm.types = type in $G.am.environment" is black list
            if(tableName == "device" && targetField == "allowedCategory") {
				if (funcs.lng(funcs.denull(profile[sourceField])) == 0) {
					rights[targetField] = new Array();
				} else {            
            		rights[targetField] = _getAllOtherCITypes(profile[sourceField]);
            	}
            }
      }
      //set folder
      var folderList = new Array();
      var folder = new SCFile("FolderRights");
      //additional code for cm3 contains both cm3r and cm3t
      var additionalQuery="";
      if(tableName=="cm3t" || tableName=="cm3r"){
            additionalQuery=" tablename=\"cm3\" or ";
      }
      if (tableName=="request"){
      
         tableName = "ocm";
      }

    var foldersql = "name=\"" + profile.name + "\" and ( " + additionalQuery + " tablename=\"" + tableName + "\")";

    var migratedFolders = [];

    if (folder.doSelect(foldersql) == RC_SUCCESS) {
        do {
            lib.FolderMigrate.migrateFolderRight(folder);
            migratedFolders.push(folder.folder);
        } while (folder.getNext() == RC_SUCCESS);

        lib.FolderMigrate.apendRightFolders(rights, migratedFolders);
    }
      if (action == "add") {
            rights.doInsert();
      } else {
            rights.doUpdate();
      }
      
}