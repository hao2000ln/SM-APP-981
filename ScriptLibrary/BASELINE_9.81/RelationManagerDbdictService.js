/**
 * See {@link module:c}
 * 
 * @private
 * @method
 */
var $ = lib.c.$;

var RelationManagerDbdictService = $(lib.DbdictService.getClass(), new function() {
	var cacheSet = {};
	
	function _dbdictCacheEntity(dbdict, descriptorMeta){
		return {
			dbdict : dbdict,
			descriptorMeta : descriptorMeta
		}
	}
	
	function _setCacheValue(key, field, value){
		var cache = cacheSet[key];
		if($.isEmpty(cache)){
			temp = _dbdictCacheEntity(null, null);
			temp[field] = value;
			cacheSet[key] = temp;
		} else {
			cache[field] = value;
		}
	}
	
	function _getCacheValue(key, field){
		var cache = cacheSet[key];
		if(!$.isEmpty(cache)){
			return cache[field];
		}
		return null;
	}
	
	function _getAllFieldMetas(parent, allFieldMetas) {
		var childs = parent.childs;
		for (var i = 0; i < childs.length; i++) {
			allFieldMetas.push(childs[i]);
			_getAllFieldMetas(childs[i], allFieldMetas);
		}
	}

	return {
		getDescriptorMetaWithCache : function(dbdict, descField){
			var dictName = dbdict["name"];
			var cache = _getCacheValue(dictName, descField);
			if(!$.isEmpty(cache)){
				return cache;
			}
			var descriptorMeta = this.getDescriptorMeta(dbdict[descField]);
			_setCacheValue(dictName, descField, descriptorMeta);
			return descriptorMeta;
		},
		
		getDbdictWithCacheByLinkName : function(name,fieldName){
			var cache = _getCacheValue(name, "dbdict");
			if(!$.isEmpty(cache)){
				return cache;
			}
			var dbdict = this.getValidDbdictWithCacheByName(name);
			if (dbdict == null) {
				var formatService = $("#formatService");
				var format = formatService.getFormat(name);
				if (format != null) {
					var fileName = format["file.name"];					
					dbdict = this.getValidDbdictWithCacheByName(fileName);
				}
				if(dbdict == null && !$.isEmpty(fieldName)) {
					var joindefsService = $("#joindefsService");
					dbdict = joindefsService.getDbdictByJoinName(name, fieldName);
				}
			}
			_setCacheValue(name, "dbdict", dbdict);
			return dbdict;
		},
		
		getDbdictWithCacheByErd : function(file, fileField){
			var cache = _getCacheValue(file, "dbdict");
			if(!$.isEmpty(cache)){
				return cache;
			}
			var joindefsService = $("#joindefsService");
			var dbdict = joindefsService.getDbdictByJoinName(file, fileField);
			_setCacheValue(file, "dbdict", dbdict);
			return dbdict;
		},
		
		getValidDbdictWithCacheByName : function(name){
			var cache = _getCacheValue(name, "dbdict");
			if(!$.isEmpty(cache)){
				return cache;
			}
			var dbdict = this.getValidDbdict(name);
			_setCacheValue(name, "dbdict", dbdict);
			return dbdict;
		},

		getSimpleFieldMeta : function(fieldName, fields){
			var fieldStack = new Array();
			var targetIsAlias = false;
			var target;
			var getTarget = false;
			var parentLevel;
			var targetLevel;
			
			for(var i = fields.length() - 1; i >= 1; i--){
				var isAlias = false;
				var field = fields[i];
				var next = fields[i-1];
				
				if(!$.isEmpty(next) && next.level == field.level 
					&& next.index == field.index){
					isAlias = true;
				}
				
				var top = fieldStack[fieldStack.length - 1];
				
				if(!$.isEmpty(top) && top.level == 1){
					break;
				}
				if(field.name == fieldName) {
					getTarget = true;
					if(!isAlias){
						targetIsAlias = false;
						target = field;
						targetLevel = field.level;
						parentLevel = targetLevel - 1;
						fieldStack.push(field);
					} else {
						targetIsAlias = true;
					}
				} else if(getTarget) {
					if(targetIsAlias){
						if(!$.isEmpty(next) 
							&& (next.level != field.level || next.index != field.index)){
							targetIsAlias = false;
							target = field;
							targetLevel = field.level;
							parentLevel = targetLevel - 1;
							fieldStack.push(field);
						}
					} else if(field.level == parentLevel){
						if(top.level != field.level){
							fieldStack.push(field);
							parentLevel--;
						}
					}
				}
			}
			if($.isEmpty(fieldStack)){
				return null;
			}
			var path = '';
			for(var i = fieldStack.length - 1; i >= 0; i--){
				path = path + RAD_PATH + fieldStack[i].name;
			}
			return _fieldMeta(target, null, null, null, path.substring(1));
		},


	    // get all logical tables in dbdict
	    getAllTables : function () {
	    	var tableNames = new Array();
	    	var tableDbdicts = $("dbdict").setOrderBy(
					[ "name"],[ SCFILE_ASC]).select('true').list();
	
			
			for ( var i = 0; i < tableDbdicts.length; i++) {
				var tableDbdict = tableDbdicts[i];
				var Name = tableDbdict["name"];
				
				tableNames.push(Name);
			}

			return tableNames;
		},
	    
	    // get all fields including path a given table
	    getAllFieldsInPath : function (tableName) {
	    	var fieldMetas = new Array();
	    	var fieldNames = new Array();
			var tableDbdict = this.getValidDbdictWithCacheByName(tableName);
			if (tableDbdict == null) {
				system.functions.msg("The dbdict " + tableName
					+ " does not exist or is invalid");
				return false;
			} else {
				var fields = tableDbdict["field"];
				var descriptorMeta = this.getDescriptorMetaWithCache(tableDbdict,"field");
				_getAllFieldMetas(descriptorMeta, fieldMetas);
				
				
				for (var i = 0; i < fieldMetas.length; i++) {
				    var field = fieldMetas[i].field;
				    if (field["type"] != 8 && field["type"] != 9) {
						fieldNames.push(fieldMetas[i].path);
					}
				}
			}

			return fieldNames;
		},
	
		// find child in a LOB field, i.e, sql info is null
		isLobChild : function(fieldOptions) {
			if (fieldOptions["sql.table.alias"] == null
					|| fieldOptions["sql.table.alias"] == "" ) {
				return true;
			} else {
				return false;
			}
		},

		getSqlTable : function(fieldOptions, sqlTables) {	    
			if (fieldOptions["sql.table.alias"] == null
					|| fieldOptions["sql.table.alias"] == "" ) {
				return "";
			} else {
			    for ( var i = 0; i < sqlTables.length(); i++) {
				  var sqlTable = sqlTables[i];
				  if (sqlTable["sql.table.alias"] == fieldOptions["sql.table.alias"]) {
				     return sqlTable["sql.table.name"];
				     break;
				  }
				}
			}
		},
		
		getSqlField : function(fieldOptions) {
			if (fieldOptions["sql.table.alias"] == null
					|| fieldOptions["sql.table.alias"] == "") {
				return "";
			} else {
				return fieldOptions["sql.column.name"];
			}
		},

		isSingleFieldUniqueKey : function(field, keys) {
			var uniqueKeys = this.getUniqueKeys(keys);
			var isSUKey = false;
			for ( var i = 0; i < uniqueKeys.length; i++) {
				var key = uniqueKeys[i];
				var names = key.name;
				if (names.length() == 1 && field == names[0]) {
					isSUKey = true;
					break;
				}
				if (isSUKey) {
					break;
				}
			}
			return isSUKey;
		},	
		
		getCombinedFieldUniqueKey : function(keys) {
			var uniqueKeys = this.getUniqueKeys(keys);
			var combinedKey = new Array();
			for ( var i = 0; i < uniqueKeys.length; i++) {
				var key = uniqueKeys[i];
				var names = key.name;
				
				var name = names[0]; 
				combinedKey.push(name); 
				if (names.length() > 1) {
				   for ( var j = 1; j < names.length(); j++) {
				        name = this.getFieldNameByPath(names[j]);
				   		combinedKey.push(name);
                   }
				}
			}
			return combinedKey;
		},	
		
	    // get array fields, i.e. the array tpye field, for a selected fieldMeta,
		getParentArray : function(fieldMeta) {
			var parents = new Array();
			var parentMeta = fieldMeta.parent;
			while (parentMeta != null) {
				var parent = parentMeta.field;
				if (parent["level"] == 0) { // descriptor
					break;
				}
				if (parent["type"] == $.Array) {
					parents.push(parentMeta);
				}
				fieldMeta = parentMeta;
				parentMeta = parentMeta.parent;
			}
			return parents.reverse();
		}		
	};
});

function getClass() {
	return RelationManagerDbdictService;
}