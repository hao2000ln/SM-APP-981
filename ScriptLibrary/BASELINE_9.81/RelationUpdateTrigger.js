var $ = lib.c.$;

var RelationUpdateTrigger = $(new function() {
	var linkService = $('#linkService');
	var erdService = $('#erddefService');
	var relatedObjectMapService = $('#relatedObjectMapService');

	return {
		updateLink : function(newLink, oldLink){
			// delete old record in relation
			var keys = new Array();
			keys.push(['def.query', 'name=\\\"' + oldLink['name'] + '\\\"']);
			keys.push(['def.type', 'link']);
			deleteRelationByKeys(keys);
			// add new record in relation
			linkService.buildRelationWithLink(newLink);
		},
		
		insertLink : function(link){
			linkService.buildRelationWithLink(link);
		},
		
		deleteLink : function(link){
			var keys = new Array();
			keys.push(['def.query', 'name=\\\"' + link['name'] + '\\\"']);
			keys.push(['def.type', 'link']);
			deleteRelationByKeys(keys);
		},
		
		updateErd : function(newErd, oldErd){
 			var keys = new Array();
 			var query = erdService.getDefQuery(oldErd['counter'], oldErd['file1'], oldErd['file2']);
 			keys.push(['def.query', lib.StringUtil.escapeAllStr(query)]);
 			keys.push(['def.type', 'erddef']);
 			deleteRelationByKeys(keys);
 			erdService.buildRelationWithErd(newErd);
		},
		
		insertErd : function(erddef){
			erdService.buildRelationWithErd(erddef);
		},
		
		deleteErd : function(erddef){
			var keys = new Array();
 			var query = erdService.getDefQuery(erddef['counter'], erddef['file1'], erddef['file2']);
 			keys.push(['def.query', lib.StringUtil.escapeAllStr(query)]);
 			keys.push(['def.type', 'erddef']);
 			deleteRelationByKeys(keys);
		},
		
		updateRelatedObjectMap : function(newFile, oldFile){
 			var keys = new Array();
 			keys.push(['source.file',oldFile['sourceTable']]);
 			keys.push(['source.field', oldFile['sourceField']]);
 			keys.push(['def.type', 'relatedObjectMap']);
 			deleteRelationByKeys(keys);
 			relatedObjectMapService.buildRelation(newFile);
		},
		
		insertRelatedObjectMap : function(file){
			relatedObjectMapService.buildRelation(file);
		},
		
		deleteRelatedObjectMap : function(file){
			var keys = new Array();
 			keys.push(['source.file', file['sourceTable']]);
 			keys.push(['source.field', file['sourceField']]);
 			keys.push(['def.type', 'relatedObjectMap']);
 			deleteRelationByKeys(keys);
		}
	};
});

function deleteRelationByKeys(keyAndValues){
	var relation = new SCFile('relation');
	var query = keyAndValues[0][0]+'="'+keyAndValues[0][1]+'"';
	if( $.isEmpty(keyAndValues[0][1]) ) query = keyAndValues[0][0]+'=NULL';
	for(var i=1;i<keyAndValues.length;i++){
		if( $.isEmpty(keyAndValues[i][1]) ){
			query += ' and '+keyAndValues[i][0]+'=NULL';
		}else{
			query += ' and '+keyAndValues[i][0]+'="' + keyAndValues[i][1] + '"';
		}
	}
	query += ' and status~="fixed"';
	
	// print( query );
	var status = relation.doSelect(query);
	while(status == RC_SUCCESS){
		relation.doDelete();
		status = relation.getNext();
	}
}

function getClass() {
	return RelationUpdateTrigger;
}