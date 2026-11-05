// all the fields not included in this oob list will treat as customized fields
var dbdict_cm3profile_930=["alert","allowed.cats","allowedStatus","append.query","area","approvals","approve.delegate","new.category","request.manage.format","phase.sel","close","default.category","default.task.category","duplicates","partial.key","initial.request.inbox","initial.fmt","initial.task.inbox","pagelist","name","new","qbe.format","reopen","skip.warning","task.manage.format","update","view","closed.update","cpyopn","tasks","modifyTemplate","approve.override","approve.mass","manager.group","approval.groups","query.window","open","apprdism","database","expand","valid.lkup","notify","views","count","clear","find","fill","irquery","withdraw","calc.risk","review","show.parent","db.template","db.complex","groups","active.query","all.query","deferred","history","qberestore","query.time.limit","statements","all","audit","cat","db.mass.update","default.template.change","default.template.task","print","print.bg","print.fg","print.qbe","printer","qbelist.format","qbelist.report","qberecs","qberecs.format","qberecs.report","standard","structured","sysmodcount","sysmodtime","sysmoduser"];
var mappedFields =["append.query","approvals","approve.delegate","request.manage.format","default.category","default.task.category","partial.key","initial.request.inbox","initial.fmt","initial.task.inbox","qbe.format","reopen","skip.warning","task.manage.format", "calc.risk","review","history","active.query","all.query"];

function getTailoredFields() {
	var list = [];
	var cm3profileDbdict = new SCFile("dbdict");
	cm3profileDbdict.doSelect("name=\"cm3profile\"");
	var allFields = cm3profileDbdict.field;
	for (var i = 0; i < allFields.length(); i++) {
		//  support number (1 number), string (2 character),  boolean (4 logical), record (6 record), list (8 array), condition( 11 expression)
		var allowedType = [1, 2, 4, 8, 11]; //6,
		if (allFields[i] != null && allFields[i].level == 1 && lib.ArrayUtil.contains(allowedType, allFields[i].type)) {
			//avoid field alias
			if(i>0 && allFields[i].level == allFields[i-1].level && allFields[i].index == allFields[i-1].index){
			  continue;
			}
			var name = allFields[i].name;
			if(!lib.ArrayUtil.contains(dbdict_cm3profile_930, name)) {
				list.push([name, allFields[i].type]);
			}
		}
	}
	return list;
}
var tailoredCm3rFields = [];

function insertFieldsToSettingsConfig(list) {
	var areas=["Change","Change Tasks"];
	var scriptLibrary = new SCFile("ScriptLibrary");
	scriptLibrary.doSelect("name=\"SetupCm3Environment\"");
	var script = scriptLibrary.script;
	var lines = script.split("\n");
	var initialLines=lines.length;
	for(var type=0;type<areas.length; type++ ){
	var area = areas[type];
	var table = area=="Change" ? "cm3r":"cm3t";
	for (var i = 0; i < list.length; i++) {
		var scFile = new SCFile("settingsConfig");
		var item = list[i];
		//using map format to avoid keyword. I.E. new broken javascript compile
		if (!lib.ArrayUtil.contains(mappedFields, item[0]) ) {
			tailoredCm3rFields.push(item[0]);
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
	if (field == null) {
		return "";
	}
	var words = field.replace(/\./g, " ").split(" ");
	for (var i = 0; i < words.length; i++) {
		words[i] = words[i].substr(0, 1).toUpperCase() + words[i].substr(1);
	}
	return words.join(" ");
}
/*

upgradeProfiles();
*/

function upgradeProfiles(profileName) {
	if (tailoredCm3rFields.length == 0) { //initial the tailoring fields
		var list = getTailoredFields();
		insertFieldsToSettingsConfig(list);
	}

	var profile = new SCFile("cm3profile");
	var sql = "name=\"" + profileName + "\"";

	if (profile.doSelect(sql) == RC_SUCCESS) {
		do {
			var role = new SCFile("secRole");
			var sql = "name=\"" + profile.name + "\"";
			if (role.doSelect(sql) != RC_SUCCESS) {
				role.name = profile.name;
				role.description = profile.name;
				role.doInsert();
			}

            var folders = null;

            if (profile.area == "a" || profile.area == "c") {
                if (profile.area == "a") {
                    folders = {
                        mode: "get"
                    };
                }
                var changeRight = updateChangeRights(profile, false, folders);

            }

            if (profile.area == "a" || profile.area == "t") {
                if (profile.area == "a" && folders) {
                    folders.mode = "set";
                }
                updateChangeRights(profile, true, folders);
            }

		}
		while (profile.getNext() == RC_SUCCESS);

	}

}

/*
This method is used to update change/task security including folder.
*/
function updateChangeRights(profile, isTask, migratedcm3Folders) {
    var area = isTask ? "Change Tasks" : "Change";
    var tableName = isTask ? "cm3t" : "cm3r";
    var folderTableName = {
        c: "cm3r",
        t: "cm3t",
        a: "cm3"
    }[profile.area];
	var rights = new SCFile("secRights");
	var sql = "role=\"" + profile.name + "\" and area=\""+area+"\"";
	var action = "update";

	if (rights.doSelect(sql) != RC_SUCCESS) {
		action = "add";
		rights.role = profile.name;
		rights.area = area;
	}
 
	//all the profile security mapped to rights
	rights.view = profile.view;
	rights._new = profile._new;
	rights.update = profile.update;
	rights._delete = "never";
	if (profile.close == true) {
		rights._delete = "always";
	}
	rights.modifyTemplate = profile.modifyTemplate;
	rights.expert = false;
	rights.admin = false;
	if (profile.alert == true || profile.duplicates == true || profile.pagelist == true) {
		rights.expert = true;
	}
	if (profile.new_category == true || profile.phase_sel == true) {
		rights.admin = true;
	}
	rights.allowedStatus = profile.allowedStatus;
	rights.allowedCategory = profile.allowed_cats;

	for (var i = 0; i < tailoredCm3rFields.length; i++) {
		if (!lib.ArrayUtil.contains(mappedFields, tailoredCm3rFields[i])) {
			mappedFields.push(tailoredCm3rFields[i]);
		}
	}
	for (var i = 0; i < mappedFields.length; i++) {
		var sourceField=mappedFields[i];
		var targetField=sourceField;
		if(sourceField=="initial.fmt"){
		   targetField="initial.format";
		}
		var existedId = system.functions.index(targetField, rights.settingId);
		if (existedId == 0) { //add to the last
			var lastPostion = system.functions.lng(rights.settingId) ;
			rights.settingId[lastPostion] = targetField;
			rights.settingValue[lastPostion] = system.functions.str(profile[sourceField]);
		} else {
			rights.settingValue[existedId - 1] = system.functions.str(profile[sourceField]);
		}

    }

    if (migratedcm3Folders && migratedcm3Folders.mode == "set") { //folders are passed in 
        lib.FolderMigrate.apendRightFolders(rights, migratedcm3Folders.folders);

    } else {

        var folder = new SCFile("FolderRights");
        var foldersql = "name=\"" + profile.name + "\" and tablename=\"" + folderTableName + "\"";
        var mgFolders = [];
        if (folder.doSelect(foldersql) == RC_SUCCESS) {

            do {
                lib.FolderMigrate.migrateFolderRight(folder);
                mgFolders.push(folder.folder);
            } while (folder.getNext() == RC_SUCCESS);

            lib.FolderMigrate.apendRightFolders(rights, mgFolders);

        }
        if (migratedcm3Folders && migratedcm3Folders.mode == "get") {
            //folders are passed out
            migratedcm3Folders.folders = mgFolders;
        }
    }


    if (action == "add") {
        rights.doInsert();
    } else {
        rights.doUpdate();
    }

}