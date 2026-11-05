var $ = lib.c.$;

var ErddefService = $(new function() {
	var joindefsService = $("#joindefsService");
	var dbdictService = $("#relationManagerDbdictService");
	var relationService = $("#relationService");
	
	return {
		buildRelations : function() {
			var tmpThis = this;
			
			var erds = $("erddef").selectAll().iterate(function(record) {
				tmpThis.buildRelationWithErd(record);
			});			
		},
		
		getDefQuery : function(counter,file1,file2){
			var defQuery = 'counter='+counter;
				
			if( $.isEmpty(file1) ){
				defQuery += ' and file1=NULL';
			}else{
				defQuery += ' and file1="' + file1 + '"';
			}
			
			if( $.isEmpty(file2) ){
				defQuery += ' and file2=NULL';
			}else{
				defQuery += ' and file2="' + file2 + '"';
			}
			return defQuery;
		},
		
		getFields : function(fields){
			var result="";
			for ( var i = 0; i < fields.length(); i++) {
				var field = fields[i];
				// skip the empty line
				if( !$.isEmpty(field) ){
					if(result==""){
						result = field;
					}else{
						result += "|"+field;
					}
				}
			}
			return result;
		},
		
		buildRelationWithErd : function(erddef) {
			var file1 = erddef["file1"];
			var file2 = erddef["file2"];
			var file1Fields = erddef["file1.names"];
			var file2Fields = erddef["file2.names"];
			var counter = erddef["counter"];
			var relationType = erddef["reltype"];
			var field1=null,field2=null;
			
			// check if file1 or file2 is null
			var defQuery = this.getDefQuery(counter, file1, file2);
			
			//index++;
			relationService.buildRelation(file1,this.getFields(file1Fields), file2, this.getFields(file2Fields),
											"erddef", defQuery, false, relationType);
			// reverse source and target talbe/field and add record again per Jin's request
			if( relationType == 'A' ){
				relationType = 'B';
			}else if( relationType == 'B' ){
				relationType = 'A';
			}
			relationService.buildRelation(file2,this.getFields(file2Fields), file1, this.getFields(file1Fields),
											"erddef", defQuery, false, relationType);
		}
	};
});

function getClass() {
	return ErddefService;
}