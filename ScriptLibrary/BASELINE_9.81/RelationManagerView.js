var $ = lib.c.$;
var CallRad = lib.executor.CallRad;
var JsThread = lib.executor.JsThread;

// constant
var GROUP_PATTERN = /Group ID:(.*), Group Value:(.*)/;
var COUNT_PATTERN = /----Target File:(.*), Target Field:(.*), Field Value:(.*), Count:(.*)/;
var RECORD_PATTERN = /----Target File:(.*), Target Field:(.*), Query:(.*), Record:(.*)/;

var RelationManagerView = $(lib.BaseListView.getClass(),new function() {
	// service
	var dbdictService = $("#relationManagerDbdictService");
	var relationService = $("#relationService");
	var erddefService = $("#erddefService");
    var linkService = $("#linkService");
    var relatedObjectMapService = $("#relatedObjectMapService");
    
	// variables
	var MAX_SEARCH_VALUES = 50;
	function ArrayWithLimit(){
		var ary = new Array();
		return {
			push : function(e){
				if(ary.length < MAX_SEARCH_VALUES){
					ary.push(e);
				} else {
					throw "array length exceeds limitation.";		
				}
			},
			get : function(index){
				return ary[index];
			},
			length : function(){
				return ary.length;
			}
		}
	}
	var sourceFileName;
	var sourceFieldName;
	var defType;
	var status;
	var searchValue;
	var fieldValue;
	var updateScript;
	var sourceQueries;

	var source;
	var sourceFieldMeta;
	var target;
	var targetFieldMeta;
	var relations;
	var values;
	var disableTriggers;
	var useDocEngine;
	var retCode;
	

	function _buildGroupDescription(id, value) {
		return "Group ID:" + id + ", Group Value:" + value;
	}

	function _buildCountDescription(targetFile, targetField, fieldValue, count) {
		return "----Target File:" + targetFile + ", Target Field:"
				+ targetField + ", Field Value:" + fieldValue + ", Count:"
				+ count;
	}

	function _buildRecordDescription(targetFile, targetField, query, record) {
		return "----Target File:" + targetFile + ", Target Field:"
				+ targetField + ", Query:" + query + ", Record:"
				+ system.functions.str(record);
	}

	function _validateSearchDefinitionFrontEnd() {
		if ($.isEmpty(sourceFileName)) {
			system.functions.msg("The file name is empty!", 2);
			return false;
		}
		if ($.isEmpty(sourceFieldName)) {
			system.functions.msg("The field name is empty!", 2);
			return false;
		}
		
		return true;
	}

	function _validateSearchValueFrontEnd(query) {
		if (_validateSearchDefinitionFrontEnd()) {
			if (!query && $.isEmpty(fieldValue)) {
				system.functions.msg("The search value is empty! ");
			} else {
				return true;
			}
		}
		return false;
	}

	function _validateUpdateFrontEnd(query) {
		if (_validateSearchValueFrontEnd(query)) {
			if ($.isEmpty(updateScript)) {
				system.functions.msg("The update script is empty!", 2);
			} else {
				return true;
			}
		}
		return false;
	}

	// validate sourceFile and sourceField
	function _validateSourceFileAndField() {
		source = dbdictService.getValidDbdictWithCacheByName(sourceFileName);
		system.functions.msg("SourceFileName " + sourceFileName);
		if (source == null) {
			system.functions.msg("The dbdict " + sourceFileName
					+ " is not exist or invalid");
			return false;
		} else {
			var sourceMeta = dbdictService.getDescriptorMetaWithCache(source,"field");
			sourceFieldMeta = dbdictService.getFieldMeta(sourceFieldName,
					sourceMeta);
			if (sourceFieldMeta == null) {
				system.functions.msg("The field " + sourceFieldName
						+ " is not exist in dbdict " + sourceFileName);
				return false;
			} else {
				sourceFieldName = sourceFieldMeta.path;
			}
		}

		return true;
	}
	
	// build source, sourceFieldMeta and relations
	function _validateSearchDefinitionBackEnd() {
		source = dbdictService.getValidDbdictWithCacheByName(sourceFileName);
		if (source == null) {
			system.functions.msg("The dbdict " + sourceFileName
					+ " is not exist or invalid");
			return false;
		} else {
			var sourceMeta = dbdictService.getDescriptorMetaWithCache(source,"field");
			sourceFieldMeta = dbdictService.getFieldMeta(sourceFieldName,
					sourceMeta);
			if (sourceFieldMeta == null) {
				system.functions.msg("The field " + sourceFieldName
						+ " is not exist in dbdict " + sourceFileName);
				return false;
			} else {
				sourceFieldName = sourceFieldMeta.path;
			}
		}

		return true;
	}

	// build values
	function _validateSearchValueBackEnd(query) {
		if (_validateSearchDefinitionBackEnd()) {
			var sourceQuery = query;
			if (!query) {
				var sourceField = sourceFieldMeta.field;
				var sourceFieldType = sourceField["type"];
				sourceQuery = dbdictService.getFieldQuery(sourceFieldName,
						fieldValue, sourceFieldType, true);
			}

			values = new Array();
			$(sourceFileName).select(sourceQuery).iterate(function(record) {
				var value = record[sourceFieldName];
				if (!$.contains(values, value)) {
					values.push(value);
				}
			});

			if ($.isEmpty(values)) {
				system.functions.msg("The value " + fieldValue + " for "
						+ sourceFileName + "[" + sourceFieldName
						+ "] is not found.");
			} else {
				return true;
			}
		}

		return false;
	}


	function _searchDefinition() {
		var relationViews = new Array();

		for ( var i = 0; i < relations.length; i++) {
			var relation = relations[i];
			var sourceFile = relation["source.file"];
			var sourceField = relation["source.field"];
			var targetFile = relation["target.file"];
			var targetField = relation["target.field"];
            var relType = relation["relType"];
            var sourceSqlTable = relation["source.sqltable"];
			var sourceSqlField = relation["source.sqlfield"];
			var targetSqlTable = relation["target.sqltable"];
			var targetSqlField = relation["target.sqlfield"];
            var key = false;
			var lob = false;
			var targetType = '';
			var cascadeQuery = relation["cascade.query"] || false;
			var cascadeUpdate = relation["cascade.update"] || false;
			
			var target = dbdictService.getValidDbdictWithCacheByName(targetFile);
			if( target != null ){
				var targetDescriptorMeta = dbdictService
						.getDescriptorMetaWithCache(target,"field");
				var targetFieldMeta = dbdictService.getFieldMeta(targetField,
						targetDescriptorMeta);
						
				if (targetFieldMeta != null) {
				    var tf = targetFieldMeta.field;
				    var targetType = tf["type"];
					key = dbdictService.isKey(targetField, target["key"]);
					lob = dbdictService.isLob(tf["sql.field.options"]);
				}
			}
		    
		    var relationView = [ sourceFile, sourceField, targetFile, targetField,$.scTypeToString(targetType), key, lob,
								cascadeQuery, cascadeUpdate, relation["def.type"], relation["def.query"], relType, 
								sourceSqlTable, sourceSqlField, targetSqlTable, targetSqlField];
			

			relationViews.push(relationView);	
			
			}	
			// set view objects
			var sourceFiles = $.createSCArray();
			var sourceFields = $.createSCArray();
			var targetFiles = $.createSCArray();
			var targetFields = $.createSCArray();
			var sourceSqlTables = $.createSCArray();
			var sourceSqlFields = $.createSCArray();
			var targetSqlTables = $.createSCArray();
			var targetSqlFields = $.createSCArray();
			var targetTypes = $.createSCArray();
			var keys = $.createSCArray();
			var lobs = $.createSCArray();
			var cascadeQueries = $.createSCArray();
			var cascadeUpdates = $.createSCArray();
			var definitionTypes = $.createSCArray();
			var definitionQueries = $.createSCArray();
            var relationTypes = $.createSCArray();
            
			for ( var i = 0; i < relationViews.length; i++) {
				var relationView = relationViews[i];
				sourceFiles.push(relationView[0]);
				sourceFields.push(relationView[1]);
				targetFiles.push(relationView[2]);
				targetFields.push(relationView[3]);
				targetTypes.push(relationView[4]);
				keys.push(relationView[5]);
				lobs.push(relationView[6]);
				cascadeQueries.push(relationView[7]);
				cascadeUpdates.push(relationView[8]);
				definitionTypes.push(relationView[9]);
				definitionQueries.push(relationView[10]);
				relationTypes.push(relationView[11]);
				sourceSqlTables.push(relationView[12]);
				sourceSqlFields.push(relationView[13]);
				targetSqlTables.push(relationView[14]);
				targetSqlFields.push(relationView[15]);
			}

			var viewObj = {};

			viewObj["$L.source.file"] = sourceFileName;
			viewObj["$L.source.fields"] = sourceFieldName;
			viewObj["$L.source.files"] = sourceFiles;
			viewObj["$L.source.fields"] = sourceFields;
			viewObj["$L.target.files"] = targetFiles;
			viewObj["$L.target.fields"] = targetFields;
			viewObj["$L.source.sqlTables"] = sourceSqlTables;
			viewObj["$L.source.sqlFields"] = sourceSqlFields;
			viewObj["$L.target.sqlTables"] = targetSqlTables;
			viewObj["$L.target.sqlFields"] = targetSqlFields;
			viewObj["$L.target.keys"] = keys;
			viewObj["$L.target.lobs"] = lobs;
			viewObj["$L.cascade.queries"] = cascadeQueries;
			viewObj["$L.cascade.updates"] = cascadeUpdates;
			viewObj["$L.definition.types"] = definitionTypes;
			viewObj["$L.definition.queries"] = definitionQueries;
			viewObj["$L.relation.types"] = relationTypes;		
		
		return 	viewObj;	
	}

	function _getRelationDescription(forQuery) {
		var targets = new Array();
		for ( var i = 0; i < relations.length; i++) {
			var relation = relations[i];
			var targetFileName = relation["target.file"];
			var targetFieldName = relation["target.field"];
			var target = dbdictService.getValidDbdictWithCacheByName(targetFileName);
			var targetMeta = dbdictService.getDescriptorMetaWithCache(target,"field");
			var targetFieldMeta = dbdictService.getFieldMeta(targetFieldName,
					targetMeta);
			var identifier = dbdictService.getIdentifier(target["key"]);
			var keyFieldMetas = dbdictService.getKeyFieldMetas(identifier,
					targetMeta);
			var keyFieldNames = new Array();
			var keyFieldTypes = new Array();
			for ( var j = 0; j < keyFieldMetas.length; j++) {
				var keyFieldMeta = keyFieldMetas[j];
				var keyField = keyFieldMeta.field;
				keyFieldNames.push(keyField["name"]);
				keyFieldTypes.push(keyField["type"]);
			}

			var fieldValuePaths = new Array();
			if (!forQuery && relation["cascade.update"]) {
				fieldValuePaths = dbdictService
						.getFieldValuePaths(targetFieldMeta);
			}

			if ((forQuery && relation["cascade.query"])
					|| (!forQuery && relation["cascade.update"])) {
				targets.push([ targetFileName, targetFieldMeta, keyFieldNames,
						keyFieldTypes, fieldValuePaths ]);
			}
		}
		return targets;
	}

	function _searchValue() {
		var targets = _getRelationDescription(true);

		var relationValues = new ArrayWithLimit();
		for ( var i = 0; i < values.length; i++) {
			try {
				var value = values[i];
				relationValues.push(_buildGroupDescription(i + 1, value));
				for ( var j = 0; j < targets.length; j++) {
					var target = targets[j];
					var targetFileName = target[0];
					var targetFieldMeta = target[1];
					var targetField = targetFieldMeta.field;
					var keyFieldNames = target[2];
					var keyFieldTypes = target[3];

					var targetQuery = dbdictService.getFieldQuery(
							targetField["name"], value, targetField["type"]);
					var targetValues = $(targetFileName).select(targetQuery).list();

					if (!$.isEmpty(targetValues)) {
						if (targetValues.length == 1) {
							var targetValue = targetValues[0];
							var keyQuery = dbdictService.getFieldsQuery(
									targetValue, keyFieldNames, keyFieldTypes);
							var description = _buildRecordDescription(
									targetFileName, targetFieldMeta.path, keyQuery,
									targetValue);
							relationValues.push(description);
						} else if (values.length == 1) {
							for ( var k = 0; k < targetValues.length; k++) {
								var targetValue = targetValues[k];
								var keyQuery = dbdictService.getFieldsQuery(
										targetValue, keyFieldNames, keyFieldTypes);
								var description = _buildRecordDescription(
										targetFileName, targetFieldMeta.path,
										keyQuery, targetValue);
								relationValues.push(description);
							}
						} else {
							var description = _buildCountDescription(
									targetFileName, targetFieldMeta.path, value,
									targetValues.length);
							relationValues.push(description);
						}
					}
				}
			} catch(e){
				break;
			}
		}
		return relationValues;
	}

	function _getSourceRelationDescription(forQuery) {
		var sources = new Array();
		for ( var i = 0; i < relations.length; i++) {
			var relation = relations[i];
			var sourceFileName = relation["source.file"];
			var sourceFieldName = relation["source.field"];
			var source = dbdictService.getValidDbdictWithCacheByName(sourceFileName);
			var sourceMeta = dbdictService.getDescriptorMetaWithCache(source,"field");
			var sourceFieldMeta = dbdictService.getFieldMeta(sourceFieldName,
					sourceMeta);
			var identifier = dbdictService.getIdentifier(source["key"]);
			var keyFieldMetas = dbdictService.getKeyFieldMetas(identifier,
					sourceMeta);
			var keyFieldNames = new Array();
			var keyFieldTypes = new Array();
			for ( var j = 0; j < keyFieldMetas.length; j++) {
				var keyFieldMeta = keyFieldMetas[j];
				var keyField = keyFieldMeta.field;
				keyFieldNames.push(keyField["name"]);
				keyFieldTypes.push(keyField["type"]);
			}

			var fieldValuePaths = new Array();
			if (!forQuery && relation["cascade.update"]) {
				fieldValuePaths = dbdictService
						.getFieldValuePaths(sourceFieldMeta);
			}

			if ((forQuery && relation["cascade.query"])
					|| (!forQuery && relation["cascade.update"])) {
				source.push([ sourceFileName, sourceFieldMeta, keyFieldNames,
						keyFieldTypes, fieldValuePaths ]);
			}
		}
		return sources;
	}

	function _searchSourceValue() {
		var sources = _getSourceRelationDescription(true);

		var relationValues = new ArrayWithLimit();
		for ( var i = 0; i < values.length; i++) {
			try {
				var value = values[i];
				relationValues.push(_buildGroupDescription(i + 1, value));
				for ( var j = 0; j < sources.length; j++) {
					var source = sources[j];
					var sourcesFileName = sources[0];
					var sourcesFieldMeta = sources[1];
					var sourcesField = sourcesFieldMeta.field;
					var keyFieldNames = sources[2];
					var keyFieldTypes = sources[3];

					var sourcesQuery = dbdictService.getFieldQuery(
							sourcesField["name"], value, sourcesField["type"]);
					var sourcesValues = $(sourcesFileName).select(sourcesQuery).list();

					if (!$.isEmpty(sourcesValues)) {
						if (sourcesValues.length == 1) {
							var sourcesValue = sourcesValues[0];
							var keyQuery = dbdictService.getFieldsQuery(
									sourcesValue, keyFieldNames, keyFieldTypes);
							var description = _buildRecordDescription(
									sourcesFileName, sourcesFieldMeta.path, keyQuery,
									sourcesValue);
							relationValues.push(description);
						} else if (values.length == 1) {
							for ( var k = 0; k < sourcesValues.length; k++) {
								var sourcesValue = sourcesValues[k];
								var keyQuery = dbdictService.getFieldsQuery(
										sourcesValue, keyFieldNames, keyFieldTypes);
								var description = _buildRecordDescription(
										sourcesFileName, sourcesFieldMeta.path,
										keyQuery, sourcesValue);
								relationValues.push(description);
							}
						} else {
							var description = _buildCountDescription(
									sourcesFileName, sourcesFieldMeta.path, value,
									sourcesValues.length);
							relationValues.push(description);
						}
					}
				}
			} catch(e){
				break;
			}
		}
		return relationValues;
	}

		
	function _updateValue(record, fieldParentPaths, oldValue, newValue, idx) {
		var layers = fieldParentPaths.length;
		var array = fieldParentPaths[idx];
		var arrayPath = array[0];
		var arrayFieldMeta = array[1];
		var arrayMeta = arrayFieldMeta.parent;
		var array = arrayMeta.field;

		if (array["type"] == $.Array) {
			var arrayValue = record;
			if (arrayPath.length > 0) {
				arrayValue = record[arrayPath];
			}

			if (arrayValue != null) {
				for ( var i = 0; i < arrayValue.length(); i++) {
					if (idx == layers - 1) {
						if (arrayValue[i] == oldValue) {
							arrayValue[i] = newValue;
						}
					} else {
						_updateValue(arrayValue[i], fieldParentPaths, oldValue,
								newValue, idx + 1);
					}
				}
			}
		} else {
			if (record[arrayPath] == oldValue) {
				record[arrayPath] = newValue;
			}
		}
	}
	

	return {
		count : null,
		
	
		getFileName : function() {
			return "relation";
		},
	
		init : function(request) {
			this._super.apply(this, arguments);
			sourceFileName = $.trim(request.getParameter("$L.source.file"));
			sourceFieldName = $.trim(request.getParameter("$L.source.field"));
			defType = $.trim(request.getParameter("$L.def.type"));
			status = $.trim(request.getParameter("$L.status"));
			this.count = request.getParameter("$L.count");		
		},
		
		goDefinition: function(request) {
			var handlers = request.handlers;
			handlers.push(this.searchDefinition)
			handlers.push(this.list)
		},
		
		/**
		*@Protected
		*/
		searchDefinition: function(request) {
			var defType = this.curFile["def.type"];
			var query = this.curFile["def.query"];
			beginThread(null, CallRad, ["se.search.engine", [ "name", "query"], [ defType, query]]);
		},


        list : function(request) {
	        if (this.curFile == null) {
	        	var fileName = this.getFileName();
				var sql = "1=1";
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
				var helper = $("relation");
				this.count = helper.count(sql);
				this.curFile = helper.scfile;
				this.title = this.getTitle();
				this.savedFile = new SCFile(fileName);
				system.functions.fduplicate(this.savedFile,this.curFile);
			}
			
			if (this.count > 0) {
					request.setAttribute("$L.file", this.curFile);	
					request.setAttribute("$L.count", this.count);
					
					request.setAttribute("$L.dd.qbe.format","relations.qbe");
					request.setAttribute("$L.title", this.title);
				
				
				// for next
				request.setAttribute("$L.file.save", this.savedFile);		
				
				return "relations.qbe";			
			} else {
				this.msg(14);//No records found!
				return "relations.search";
			}
			
		},
		
		add : function(request) {
			var relation = relationService.addRelation(this.curFile.source_file, this.curFile.source_field, this.curFile.target_file, this.curFile.target_field, 'manual',
				'', false);
			if( relation["status"] == 'skip' ){
				this.msg(16);//No records found!
			}
			//return "relations.qbe";
			return this.list(request);	
		},
		
		save : function(request) {
			this.curFile = relationService.save(this.curFile);
			return this.list(request);	
		},
		
		toggleRefCheck: function (request) {
		    this.curFile = relationService.toggleRefCheck(this.curFile);
			return this.list(request);
		},
		
		del : function(request) {
			this.curFile.doDelete();
			return this.list(request);
		},
		
		doYes : function(request) {
			this.add(request);
			return this.doNo(request);
		},
		
		ok : function(request) {
			return "relations.search";
		},
		
		cancel : function(request) {
			return this.ok();
		},
		
		back : function(request) {
			
		},

		searchSources : function() {
		    var relationViewObj={};
		    var targetFileName = sourceFileName; //values filled in form are now for traget*
			var targetFieldName = sourceFieldName;
			
			if (searchValue) {
				if (_validateSearchValueFrontEnd()
						&& _validateSearchValueBackEnd()) {

					relations = relationService.findRelationsByTargetTableField(targetFileName,targetFieldName);
		
					var relationValues = _searchSourceValue();
                    
					// set view objects
					var viewObj = {};
					viewObj["$L.source.file"] = targetFileName;
					viewObj["$L.source.field"] = targetFieldName;

					viewObj["$L.field.value"] = fieldValue;
					viewObj["$L.relation.values"] = relationValues;
					$.setViewObject(viewObj);
					vars.$L_result_view = "relations.sourceValue.view";
				}
			} else {
			
      			if ($.isEmpty(targetFieldName) && (!$.isEmpty(targetFileName))) {
			      		    
			      target = dbdictService.getValidDbdictWithCacheByName(targetFileName);
				  if (target == null) {
				  	system.functions.msg("The dbdict " + targetFileName
						+ " is not exist or invalid");
				  	 return false;
		          } else {
		              relations = relationService.findRelationsByTable(targetFileName);
		              var viewObj = _searchDefinition();
		             
		              
		              $.setViewObject(viewObj);
		              vars.$L_result_view = "relations.byTable.view";
			      }
				} else {
					if (_validateSearchDefinitionFrontEnd()
						&& _validateSearchDefinitionBackEnd()) { 
						relations = relationService.findRelationsByTargetTableField(targetFileName,targetFieldName);
					if ($.isEmpty(relations)) {
						system.functions.msg("The relation of " + targetFileName + "["
						+ targetFieldName + "] is not found, try build it first!",2);
						return false;
					}
					   var viewObj = _searchDefinition();
					   
					   $.setViewObject(viewObj);
					   vars.$L_result_view = "relations.byTargetField.view";
		             }
			    }			
			}
		},

		update : function(query) {
			if (_validateUpdateFrontEnd(query)
					&& _validateSearchValueBackEnd(query)) {
				var targets = _getRelationDescription(false);
				var sourceField = sourceFieldMeta.field;
				var sourceFieldType = sourceField["type"];
			    
			    if (disableTriggers) {
			    	system.functions.rtecall("trigger", retCode, 0); 
				}
				
				for ( var i = 0; i < values.length; i++) {
					var value = values[i];
					var fileName = sourceFileName;
					var fieldName = sourceFieldName;
					var groupId = i + 1;
					var newValue = eval(updateScript);
					if (i != 0 && (i % 10 == 0 || i == values.length - 1)) {
						print(i + " '" + fieldName + "' of '" + fileName
								+ "' are updated");
					}
					

					for ( var j = 0; j < targets.length; j++) {
						var target = targets[j];
						var targetFileName = target[0];
						var targetFieldMeta = target[1];
						var targetField = targetFieldMeta.field;
						var targetFieldName = targetField["name"];
						var targetFieldType = targetField["type"];
						var fieldParentPaths = target[4];

						var targetQuery = dbdictService.getFieldQuery(
								targetFieldName, value, targetFieldType);
						var targetValues = $(targetFileName)
								.select(targetQuery).list();
						if (!$.isEmpty(targetValues)) {
							for ( var k = 0; k < targetValues.length; k++) {
								var targetValue = targetValues[k];
								_updateValue(targetValue, fieldParentPaths,
										value, newValue, 0);
										
								if (useDocEngine) {
									targetValue.doAction("save");
								} else {		
									targetValue.doUpdate();
								}
							}

						}
					}

					var sourceQuery = dbdictService.getFieldQuery(
							sourceFieldName, value, sourceFieldType);
					$(sourceFileName).select(sourceQuery).iterate(
							function(record) {
								record[sourceFieldName] = newValue;
								if (useDocEngine) {
									record.doAction("save");
								} else {		
									record.doUpdate();
								}
							});
				}

				   
			    if (disableTriggers) {
			    	system.functions.rtecall("trigger", retCode, 1); 
				}
				
				vars.$L_value_search = false;
				vars.$L_result_view = "relations.search.view";
				return true;
			}
			return false;
		},

		massUpdate : function() {
			var sourceFiles = vars.$L_source_files;
			var sourceFields = vars.$L_source_fields;
			var sourceQueries = vars.$L_source_queries;
			var updateScripts = vars.$L_update_scripts;
	
			for ( var i = 0; i < sourceFiles.length(); i++) {
				sourceFileName = $.trim(sourceFiles[i]);
				sourceFieldName = $.trim(sourceFields[i]);
				updateScript = $.trim(updateScripts[i]);
				var sourceQuery = $.trim(sourceQueries[i]);
				if (!this.update(sourceQuery)) {
					break;
				}
			}
		},
		
		buildRelations : function(request) {
			try{
			    this.msg(7);//Truncate existing relations from erddef,link,relatedObjectMap definitions......
			    
			    relationService.truncateByQuery('def.type ~= "manual"');

				this.msg(8);//Build relations from erddef definitions......
				erddefService.buildRelations();
				
				this.msg(9);//Build relations from link definitions......
				linkService.buildRelations();

				this.msg(10);//Build relations from relatedObjectMap definitions......
				relatedObjectMapService.buildRelations();

				this.msg(11);//Derive relations from combined unique key......
				relationService.buildCombinedRelations();

				this.msg(12);//Build relations done......
			} catch(e){
				system.functions.log(e);
				this.msg(13);//Please try to Build Relations again......
			}
			return "relations.search";
		},

		msg : function(no){
			system.functions.msg( system.functions.scmsg(no, "relation") , 1);
		},
		
		hasModified : function(request) {
			return false;
		},

		updateRelations : function() {
		    system.functions.msg("Update existing relations......", 1);
		    relationService.updateRelations();
			system.functions.msg("Update relations done......", 1);
		},
		
		massUpdateConfig : function() {
                    var sourceHash = relationService.findAllSourceFiles();
                    var sourceList = $.createSCArray();
                    
                    for (var key in sourceHash) {
						if(sourceHash.hasOwnProperty(key)) { // important check that this is objects own property not from prototype prop inherited   
							sourceList.push(key);
						}
    				}
    					
					// set view objects
					var viewObj = {};
					viewObj["$L.source.file"] = sourceFileName;
					viewObj["$L.source.field"] = sourceFieldName;
					
					
					viewObj["$L.source.list"] = sourceList;
                    viewObj["$L.source.hash"] = sourceHash;
	
					$.setViewObject(viewObj);
					vars.$L_result_view = "relations.massUpdate.view";
		},
		
        exportRelations : function() {
           
			
            var sourceFiles = vars.$L_source_files;
			var sourceFields = vars.$L_source_fields;
			var targetFiles = vars.$L_target_files;
			var	targetFields = vars.$L_target_fields;
			var relationTypes = vars.$L_relation_types;	
			var sourceSqlTables = vars.$L_source_sqlTables;	
			var sourceSqlFields	= vars.$L_source_sqlFields;
			var targetSqlTables = vars.$L_target_sqlTables;
			var targetSqlFields = vars.$L_target_sqlFields;
			
            var exportFileName = vars.$L_export_file_name;
            
            if ($.isEmpty(exportFileName)) {
				system.functions.msg("The file name is empty!", 2);
				return false;
			}
			
			headerText =  delimitText('sourceFile') +  delimitText('sourceField') + delimitText('targetFile') + delimitText('targetField') + delimitText('relationType') +
						 delimitText('sourceSqlTable') +delimitText('sourceSqlField') + delimitText('targetSqlTable') + delimitText('targetSqlField');
						 
			headerText = headerText.substring(0, headerText.length - 1) + '\n';			 
			
	        writeFile(exportFileName, null, headerText);
            
            for (i=0;i<sourceFields.length();i++) {
               var rowText = delimitText(sourceFiles[i]) +  delimitText(sourceFields[i]) + delimitText(targetFiles[i]) + delimitText(targetFields[i]) + delimitText(relationTypes[i])
                            + delimitText(sourceSqlTables[i]) + delimitText(sourceSqlFields[i]) + delimitText(targetSqlTables[i]) + delimitText(targetSqlFields[i]);
			   rowText = rowText.substring(0, rowText.length - 1) + '\n';  // remove the last delimiter		 
         
               writeFile(exportFileName, 'a', rowText);
            
            }
			system.functions.msg("Relations have been exported to " + exportFileName, 1);
		},


		createConfig : function() {
			var sourceFiles = vars.$L_source_files;
			var sourceFields = vars.$L_source_fields;
			var sourceQueries = vars.$L_source_queries;
			var updateScripts = vars.$L_update_scripts;
            var updateSysModTime = vars.$L_update_SysModTime;
            var configFileName = vars.$L_config_file_name;
            var configExportFlag = vars.$L_config_export_flag;
            var userName = vars.$lo_user_name;
            
            //output to XML file
			var xmlObj = new XML("config");
		
			
            createNewNode(xmlObj, "config", "updates");
            
			for ( var i = 0; i < sourceFiles.length(); i++) {
				var sourceFileName = $.trim(sourceFiles[i]);
				var sourceFieldName = $.trim(sourceFields[i]);
				var updateScript = $.trim(updateScripts[i]);
				var sourceQuery = $.trim(sourceQueries[i]);
				if (sourceFileName != null) {
					var update = createNewNode(xmlObj, "updates", "update");
					var sourceTable = update.addElement("sourceTable");
				    sourceTable.setNodeValue(sourceFileName);
					var sourceField = update.addElement("sourceField");
				    sourceField.setNodeValue(sourceFieldName);
				    var condition = update.addElement("condition");
				    condition.setNodeValue(mappingCondition(sourceQuery));
				    var replacedBy = update.addElement("replacedBy");
				    replacedBy.setNodeValue(updateScript);
				}
			}
			
			
	        appendNewNodeWithValue( xmlObj, "config", "updateSysModAttrs", updateSysModTime );
		    appendNewNodeWithValue( xmlObj, "config", "sysModUser", userName);
			
			var xmlString = xmlObj.toXMLString();
			var isMode = null;
			var fileObject = xmlString;
			writeFile( configFileName, isMode, fileObject );
			system.functions.msg("Configuration file " + configFileName + " has been saved.", 1);
			
		}
	};
});

function getFileNameAndQuery(des, fileName, fieldName) {
	var query = false;
	if (GROUP_PATTERN.test(des)) {
		var res = GROUP_PATTERN.exec(des);
		var fieldValue = res[2];
		query = $("#dbdictService").getFileFieldQuery(fileName, fieldName,
				fieldValue);
	} else if (COUNT_PATTERN.test(des)) {
		var res = COUNT_PATTERN.exec(des);
		fileName = res[1];
		var fieldName = res[2];
		var fieldValue = res[3];
		query = $("#dbdictService").getFileFieldQuery(fileName, fieldName,
				fieldValue);
	} else if (RECORD_PATTERN.test(des)) {
		var res = RECORD_PATTERN.exec(des);
		fileName = res[1];
		query = res[3];
	}
	return [ fileName, query ];
}

function getClass() {
	return RelationManagerView;
}

/* Create a function that searches an XML object (node) for a particular
* element (targetElem) and returns an XML object containing the element.
* This function assumes that there is only one instance of the target
* element in the source data. If it finds more than one element in the
* data it only returns the first instance of the element. */
function findTargetElement( node, targetElem ) {
	var topNodeName = node.getNodeName();
	while (node != null && node.getNodeName() != targetElem ) {
		var childNode = node.getFirstChildElement();
		if (childNode == null) {
			childNode = node.getNextSiblingElement();
		while (childNode == null) {
			node = node.getParentNode();

			if ( node == null || topNodeName == node.getNodeName() ) {
			return null;
		}
		childNode = node.getNextSiblingElement();}
		node = childNode;
		} else {
		node = childNode;
		}
		}
	return node;
}

/* Create a XML node
*/
function createNewNode( xml, parentNode, nodeName ) {

	var searchResult = findTargetElement( xml, parentNode );
	if ( searchResult != null ) {
		var newNode = searchResult.addElement( nodeName );
		return newNode;
	} else {
		print( "Cannot find " + parentNode );
	}
}
/* append a new node with value */
function appendNewNodeWithValue( xml, parentNode, nodeName, value)
{
	var searchResult = findTargetElement( xml, parentNode );
	if ( searchResult != null ) {
		var newNode = searchResult.addElement( nodeName );
		newNode.setNodeValue(value);
		searchResult.appendNode( newNode);
		return newNode;
	} else {
		print( "Cannot find " + parentNode );
	}
}

function mappingCondition(condition) {
	var notstartOperator = condition.replace(/\~\#(.*)\"(.*)\"/g, "not like \"$2\%\""); 
	condition = notstartOperator;
	var startOperator = condition.replace(/\#(.*)\"(.*)\"/g, "like \"$2\%\"");
	condition = startOperator;
	var orOperator = condition.replace(/\|/g, " or ");
	condition = orOperator;
	var andOperator = condition.replace(/\&/g, " and ");
	condition = andOperator;
	return condition;

}

function visitElement( elem )
{
	print( "Element " + elem.getQualifiedName() );
	// Print attributes for this element
	var node = elem.getFirstAttribute();
	while( node != null )
	{
	var attrName = node.getQualifiedName();
	var attrValue = node.getNodeValue();
	print( "Attribute " + attrName + "=" + attrValue );
	node = elem.getNextAttribute();
	}
	// Print possible element value
	var nodeValue = elem.getNodeValue();
	if ( typeof nodeValue == "string" && nodeValue.length > 0 )
	{
	print( "Element value is " + nodeValue );
	}
	// Now print child elements
	var child = elem.getFirstChildElement();
	while( child != null )
	{
	visitElement( child );

	child = child.getNextSiblingElement();
	}
}


function delimitText(text) {
	return '"' + text + '",';
}
