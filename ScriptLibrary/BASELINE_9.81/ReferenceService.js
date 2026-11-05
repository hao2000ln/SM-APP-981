var $ = lib.c.$;

var ReferenceService = $(new function() {
	var relationService = $("#relationService");
	var dbdictService = $("#dbdictService");
	
	return {
	
	    buildRelations: function() {
			var tables = [];
            var me = this;
			$('dbdict').select('true').iterate(function(r) {
				me.buildRelationsByTable(r.name);
			});
			
		},
		
		buildRelationsByTable: function(srcTable) {
			var references = this.retrieveReferencesByTable(srcTable);
			for (var i in references) {
				this.buildRelation(srcTable, i, references[i]);
			}
		},
		
		removeRelationsByTable: function(srcTable) {
			var references = this.retrieveReferencesByTable(srcTable);
			for (var i in references) {
				this.removeRelation(srcTable, i, references[i]);
			}
		},
		
		retrieveReferencesByTable: function(table) {

			var references = {};
			$("datadict").select('name="' + table + '"').iterate(function(record) {
				if (record == null || record['reference.table'] == null) {
				    return;
				}
				
				var length = record['reference.table'].length();

				for (var i = 0; i < length; i++) {
					if (record['reference.table'][i] != null) {
						references[record['fields'][i]] = record['reference.table'][i];
					}
				}
			});
			
			return references;
		},
		
		retrieveAllTables: function() {
			$('dbdict').select('true').iterate(function(r) {
				identifier = dbdictService.getIdentifier(r.key);
				if (identifier) {
					key = identifier[1][0];
				}
			});
		},
		
		buildRelation: function(srcTable, srcField, targetTable) {
			
			var targetField = this.getTargetField(targetTable);
			relationService.buildRelation(srcTable,
												srcField,
												targetTable,
												targetField,
												"reference",
												'name="' + srcTable + '"');
		},
		
		removeRelation: function(srcTable, srcField, targetTable) {
			var targetField = this.getTargetField(targetTable);
			var tmpRelation = relationService.createRelation(srcTable,
												srcField,
												targetTable,
												targetField,
												"reference",
												'name="' + srcTable + '"');
			tmpRelation = relationService.validate(tmpRelation);
														
			var query = ['source.file="',tmpRelation['source.file'],'" and source.field="',
					tmpRelation['source.field'],'" and target.file="',
					tmpRelation['target.file'],'" and target.field="', 
					tmpRelation['target.field'],'" and def.type="reference"'];
					
    		relationService.truncateByQuery(query.join(''));
		},

		getTargetField: function(table) {
			var dbdictService = $("#dbdictService");
			var identifier = null;
			var realKey = null;
            $('dbdict').select('name="'+ table +'"').iterate(function(r) {
				identifier = dbdictService.getIdentifier(r.key);
				if (identifier) {
					key = identifier[1][0];
				}
			});
			return key;
		}
	};
			
});

function getClass() {
	return ReferenceService;
}

function getReferencesByTableForJS(table) {
	var referenceService = $("#referenceService");
	var references = referenceService.retrieveReferencesByTable(table);
	var ret = [];

    for (var i in references) {
    	ret.push(i);
    }

	return ret;
}

function getReferencesByTableForRAD(table) {
	var referenceService = $("#referenceService");
	var references = referenceService.retrieveReferencesByTable(table);
	var ret = new SCDatum();
    ret.setType(8);
    
    for (var i in references) {
    	ret.push(i);
    }
   
	return ret;
}

function getReferenceTableID(table, field) {
	var referenceService = $("#referenceService");
	return referenceService.getTargetField(table);
}
