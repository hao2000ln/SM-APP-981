var $ = lib.c.$;

function getSearchSql(){
  var sourceFileName=vars.$sourceFile;
  var sourceFieldName = vars.$sourceField;
  var defType = vars.$defType;
  var status = vars.$relationStatus;
  var sql = "true";
  if( !$.isEmpty(sourceFileName) ){
    sql += ' and (source.file like "' + sourceFileName + '*" or target.file like "' + sourceFileName +'*")';
  }
  if( !$.isEmpty(sourceFieldName) ){
    sql += ' and (source.field like "' + sourceFieldName + '*" or target.field like "' + sourceFieldName+'*")';
  }
  if( !$.isEmpty(defType) ){
    sql += ' and (def.type=\"' + defType + '\")';
  }
  if( !$.isEmpty(status) ){
    sql += ' and (status=\"' + status + '\")';
  }
  return sql;
}

function msg(no){
  system.functions.msg( system.functions.scmsg(no, "relation") , 1);
}

function buildRelations(){
  try{
  	var dbdictService = $("#relationManagerDbdictService");
	var relationService = $("#relationService");
	var erddefService = $("#erddefService");
    var linkService = $("#linkService");
    var relatedObjectMapService = $("#relatedObjectMapService");
	var referenceService = $("#referenceService");
    
    msg(7);//Truncate existing relations from erddef,link,relatedObjectMap definitions......
			    
	relationService.truncateByQuery('def.type ~= "manual"');

	msg(8);//Build relations from erddef definitions......
	erddefService.buildRelations();
				
	msg(9);//Build relations from link definitions......
	linkService.buildRelations();
	
	msg(17);//Building relationships from datadict definitions...
	referenceService.buildRelations();

	msg(10);//Build relations from relatedObjectMap definitions......
	relatedObjectMapService.buildRelations();

	msg(11);//Derive relations from combined unique key......
	relationService.buildCombinedRelations();

	msg(12);//Build relations done......
  } catch(e){
	system.functions.log(e);
	msg(13);//Please try to Build Relations again......
  }
}

function add(file) {
  var relationService = $("#relationService");
  var relation = relationService.createRelation(file.source_file, file.source_field, 
                      file.target_file, file.target_field, 'manual', '', false);
  var status = relation["status"];
  if( status == 'invalid' ){
    // system.functions.msg( system.functions.scmsg(16, "relation") , 3);//Validation failed! Please check your input
  } else if( status != 'fixed' && status != 'skip' ){
    relation["status"] = 'fixed';
  }
  return relation;
}
// called by trigger (Before Add) for table: relation
function relationAddTrigger(record) {
  var relationService = $("#relationService");
  if (relationService.isValidforIgnoreList(record)) {
    var r = relationService.findRelationIgnoreList(record);
    if (r != null) {
      record['do.ref.check'] = false;
      r = null;
    } else {
      record['do.ref.check'] = true;
    }
  }
}
// called by trigger (Before Update) for table: relation
function relationUpdateTrigger(record, oldrecord) {
  if (record == null || oldrecord == null) {
    print("Empty records are passed into relationUpdateTrigger.");
    return;
  }
  var relationService = $("#relationService");
  if (!relationService.isValidforIgnoreList(record)) {
    return;
  }

  var check = record['do.ref.check'];
  var old_check = oldrecord['do.ref.check'];
  if (!check && old_check) {
    // true -> false, add to ignore list
    if (relationService.findRelationIgnoreList(record) == null) {
      var r = relationService.createIgnoreListRecord(record);
      r.doInsert();
    }
  } else if (check && !old_check) {
    // false -> true, remove from ignore list 
    var r = relationService.findRelationIgnoreList(record);
    if (r != null) {
      r.doRemove();
    }
  }
}


function validateRecord(file) {
  vars.$formValidation = true;
  var relationService = lib.c.$("#relationService");
  var file = relationService.validate(file);
  if (file.status != "invalid") {
    file.status = "fixed";
  }
  return file.status;
}