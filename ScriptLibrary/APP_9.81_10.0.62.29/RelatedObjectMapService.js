var $ = lib.c.$;

var RelatedObjectMapService = $(new function() {
	var tableName = "relatedObjectMap";
	var dbdictService = $("#relationManagerDbdictService");
	var relationService = $("#relationService");
	
	
	return {
		buildRelations : function() {
			var tmpThis = this;
			
			var erds = $(tableName).selectAll().iterate(function(record) {
				tmpThis.buildRelation(record);
			});
		},
		
		getDefQuery : function(file1,file1Field){
			var defQuery;
				
			if( $.isEmpty(file1) ){
				defQuery = 'sourceTable=NULL';
			}else{
				defQuery = 'sourceTable="' + file1 + '"';
			}
			
			if( $.isEmpty(file1Field) ){
				defQuery += ' and sourceField=NULL';
			}else{
				defQuery += ' and sourceField="' + file1Field + '"';
			}
			
			return defQuery;
		},
		
		buildRelation : function(erddef) {
			var file1 = erddef["sourceTable"];
			var file2 = erddef["toTable"];
			var file1Field = erddef["sourceField"];
			var file2Field = erddef["toField"];
			
			relationService.buildRelation(file1,file1Field, file2, file2Field, 
											tableName, this.getDefQuery(file1, file1Field), false, null);
		}
	};
});

function getClass() {
	return RelatedObjectMapService;
}