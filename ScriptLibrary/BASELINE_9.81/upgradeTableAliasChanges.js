	
		
	/**
	 * This script is used to update three columns in dbdict: sql.column.name, sql.data.type, sql.table.alias
	 * It will compare the field between new version and old version and cover the change in the old field.
	 *
	 * Author: Wang, Weihua(Lucas)
	 * Date: 2011-02-15
	 */
	 
	 
	/**
	 * All the table alias changes needed to be applied in upgrade.
	 * The sqltype is written as SQL Server systax, RTE will update to its corresponding systax if db type is not SQL Server.
	 */
	var changes = 
		[
			{
				"table":"Approval",
				"change":[
					{"array":"current.pending.groups", "field":[{"name":"current.pending.groups", "sqltype":"VARCHAR(70)"}]}
				]
			},
			{
				"table":"cirelationship",
				"change":[
					{"array":"related.cis", "field":[{"name":"related.cis", "sqltype":"VARCHAR(200)"}]}
				]
			},
			{
				"table":"cm3groups",
				"change":[
					{"array":"approvers", "field":[{"name":"approvers", "sqltype":"VARCHAR(80)"}]},
					{"array":"members", "field":[{"name":"members", "sqltype":"VARCHAR(80)"}]}
				]
			},
			{
				"table":"kmcategory",
				"change":[
					{"array":"permission", "field":[
											{"name":"kmprofile", "sqltype":"VARCHAR(60)"},
											{"name":"kmgroup", "sqltype":"VARCHAR(60)"}
											]
					}
				],
				"forced":true
			},
			{
				"table":"kmgroup",
				"change":[
					{"array":"operators", "field":[{"name":"operators", "sqltype":"VARCHAR(80)"}]}
				]
			},
			{
				"table":"svcItemCount",
				"change":[
					{"array":"access.list", "field":[{"name":"access.list", "sqltype":"VARCHAR(50)"}]}
				]
			},
			{
				"table":"capability",
				"change":[
					{"array":"parent.tree", "field":[{"name":"parent.tree", "sqltype":"VARCHAR(50)"}]}
				]
			},
			{
				"table":"cigroup",
				"change":[
					{"array":"group.members", "field":[{"name":"group.members", "sqltype":"VARCHAR(200)"}]}
				]
			},
			{
				"table":"ocmgroups",
				"change":[
					{"array":"approvers", "field":[{"name":"approvers", "sqltype":"VARCHAR(80)"}]}
				]
			},
			{
				"table":"svcCatalog",
				"change":[
					{"array":"access.list", "field":[{"name":"access.list", "sqltype":"VARCHAR(50)"}]}
				]
			}
		];
		
	var preChanges = 
		[
			{
				"table":"RuleSet",
				"change":[
					{"array":"tablename", "field":[{"name":"tablename", "sqltype":"VARCHAR(60)"}]}
				],
				versions:["7.", "9.2", "9.3"],
				"times":2,
				"forced":true
			}
		];
	
	function applyTableAliasPreChanges(){
		lib.upgradeLog.upgrade("Applying field alias changes ...");
        lib.upgradeLog.detail("Applying field alias changes ...");
        var fromVersion = lib.upgradeVersionUtil.getUpgradeFromVersion();
		for(var i = 0; i < preChanges.length; i++){
		    var dbdict = lib.upgradeUtility.getRecord("dbdict", "name=\""+preChanges[i].table+"\"");
		    if (dbdict == null)
		        continue;
		    
		    var valid = false;
		    if (preChanges[i].versions == null) {
		        preChanges[i].versions = [];
		    }
		    for (var k=0; k<preChanges[i].versions.length; k++) {
		        if (fromVersion.indexOf(preChanges[i].versions[k]) == 0) {
		            valid = true;
		            break;
		        }
		    }
		    
		    if (!valid) {
		        continue;
		    }
		    
		    var times = preChanges[i].times;
		    if (times == null)
		        times = 1;
		    
		    for(var j=0; j<times; j++) {
		        
			    try{
				    applyChanges(preChanges[i]);
			    }catch(e){
				
			    }
			}
		}
	}
		
	function applyTableAliasChanges(){
		for(var i = 0; i < changes.length; i++){
			try{
				applyChanges(changes[i]);
			}catch(e){
				
			}
		}
	}
	
	function applyChanges(change){
		var dbdict = new SCFile("dbdict");
		var rc = dbdict.doSelect("name=\"" + change.table + "\"");
		if(rc == RC_SUCCESS){
			var forced = change.forced;
		    if (forced == null)
		        forced = false;
			
			var updated = false;
			for(var i = 0; i < change.change.length; i++){
				updated = updateAlias(dbdict, change.change[i], forced) || updated;
			}
			if(updated){
				refreshSQLTable(dbdict);
				dbdict.doUpdate();
			}
		}
	}
	
	/**
	 * Change the array field mapping according to sqloption:array.table
	 */
	function updateAlias(dbdict, change, forced){		
		var arrayIndex = findArrayFieldIndex(dbdict.field, change.array);
		var childIndexes = [];
		if(change.field.length == 1){
			childIndexes[0] = arrayIndex + 1;//for general array
		}else{
			for(var i = 0; i < change.field.length; i++){ //for structure in array
				childIndexes[i] = arrayIndex + 2 + i;
			}
		}
		if(!forced && hasChanged(dbdict, arrayIndex, childIndexes)){
			return false;
		}
		var alias = refreshAlias(dbdict.sql_tables, "a1");
		addSQLTable(dbdict, alias);
		lib.upgradeLog.scDetail(1199, ["SQL Table", dbdict.field[arrayIndex].name, dbdict.name, trim(dbdict.field[arrayIndex].sql_field_options.sql_table_alias), alias]);
		dbdict.field[arrayIndex].sql_field_options.sql_table_alias = alias;
		dbdict.field[arrayIndex].sql_field_options.sql_column_name = null;
		dbdict.field[arrayIndex].sql_field_options.sql_data_type = null;
		dbdict.field[arrayIndex].sql_field_options.sql_rcformat = false;
		for(var i = 0; i < childIndexes.length; i++){
			lib.upgradeLog.scDetail(1199, ["SQL Table", dbdict.field[childIndexes[i]].name, dbdict.name, trim(dbdict.field[childIndexes[i]].sql_field_options.sql_table_alias), alias]);
			dbdict.field[childIndexes[i]].sql_field_options.sql_table_alias = alias;
			dbdict.field[childIndexes[i]].sql_field_options.sql_column_name = getCapital(dbdict.field[childIndexes[i]].name);
			dbdict.field[childIndexes[i]].sql_field_options.sql_data_type = change.field[i].sqltype;
		}
		return true;
	}
	
	function hasChanged(dbdict, arrayIndex, childIndexes){
		var correctAlias=isAliasCorrect(dbdict.field[arrayIndex].sql_field_options.sql_table_alias);;
		
		// When the child is not structure, there is only one child.
		// The sql table alias of parent is null and the child is "m1".
		// Once the field is alias, all of parent and child are not null.
		if (childIndexes.length==1) {
		    if(dbdict.field[arrayIndex].sql_field_options.sql_table_alias != null){
		        if (correctAlias && dbdict.field[arrayIndex].sql_field_options.sql_table_alias==dbdict.field[childIndexes[0]].sql_field_options.sql_table_alias) {
		            lib.upgradeLog.detail("The alias of the array field "+dbdict.field[arrayIndex].name+" in the table "+dbdict.name+" has been "+dbdict.field[arrayIndex].sql_field_options.sql_table_alias+", so it is skipped to be updated to upgraded version.");
		        } else {
		            lib.upgradeLog.error("The alias of the array field "+dbdict.field[arrayIndex].name+" in the table "+dbdict.name+" cannot be updated to upgraded version.");
		        }
				return true;
			} else {
			    return false;
			}
		}
		
		// When the child is structure, the sql table alias of parent is m1 and all children are null.
		// Once the field is alias, all of parent and children are not null.
		var aliased=0;
		for(var i = 0; i < childIndexes.length; i++){
			if(dbdict.field[childIndexes[i]].sql_field_options.sql_table_alias != null){
			    if (!correctAlias || dbdict.field[arrayIndex].sql_field_options.sql_table_alias!=dbdict.field[childIndexes[i]].sql_field_options.sql_table_alias) {
				    lib.upgradeLog.error("The alias of the array field "+dbdict.field[arrayIndex].name+" in the table "+dbdict.name+" cannot be updated to upgraded version.");
				    return true;
				} else {
				    aliased++;
				}
			} 
		}
		
		if (aliased==childIndexes.length) {
		    lib.upgradeLog.detail("The alias of the array field "+dbdict.field[arrayIndex].name+" in the table "+dbdict.name+" has been "+dbdict.field[arrayIndex].sql_field_options.sql_table_alias+", so it is skipped to be updated to upgraded version.");
		    return true;
		}
		return false;
	}
	
	function isAliasCorrect(alias) {
        if (alias==null || alias=="")
            return false;
                  
	    var pattern=new RegExp("^a[0-9]+$");
	    var match=pattern.exec(alias);
	    if (match!=null) 
            return true;
	    
	    return false;
	}
	
	function findArrayFieldIndex(fields, name){
		for(var i = 0; i < fields.length(); i++){
			if(fields[i].name == name && fields[i].type == lib.DataTypeConst.typeArray()){
				return i;
			}
		}
		return -1;
	}
	
	function getCapital(name){
		return name.toUpperCase().replace(/\./g, "_");
	}
	
	function refreshSQLTable(dbdict){
		var sqltables = [];
		for(var i = 0; i < dbdict.field.length(); i++){
			if(system.functions.index(dbdict.field[i].sql_field_options.sql_table_alias, sqltables) == 0){
				sqltables[sqltables.length] = dbdict.field[i].sql_field_options.sql_table_alias.toLowerCase();
			}
		}
		for(var i = 0; i < dbdict.sql_tables.length(); i++){
			if(system.functions.index(dbdict.sql_tables[i].sql_table_alias.toLowerCase(), sqltables) == 0){
				dbdict.sql_tables = system.functions._delete(dbdict.sql_tables, i + 1);
				i--;
			}
		}
	}
	
	function addSQLTable(table, alias){
		var dbtype = getValue("sqloptions", "true", "sql.db.type");
		var basename = getValue("datadict", "name=\"" + table.name + "\"", "sqlbasename");
		var sqltable = new SCDatum();
		sqltable.setType(9);
		sqltable.push(dbtype);
		sqltable.push(basename + alias);
		sqltable.push(alias);
		sqltable.push(null);
		sqltable.push(null);
		table.sql_tables.push(sqltable);
	}
	
	function getValue(table, query, field){
		var file = new SCFile(table);
		var rc = file.doSelect(query);
		if(rc == RC_SUCCESS){
			return file[field];
		}
		return null;
	}
	
	/**
	 * This function will return alias itself if it's not being used, or a new alias will be generated with number increased.
	 **/
	function refreshAlias(aliases, alias){
		if(!isAliasUsed(aliases, alias)){
			return alias;
		}
		var prefix = alias.replace(/[0-9]+$/, "");
		do{
			var number = alias.substr(prefix.length);
			if(number == ""){
				number = 0;
			}
			alias = prefix + (++number);
		}while(isAliasUsed(aliases, alias));
		return alias;
	}
	
	/**
	 * To check whether or not alias is being used.
	 **/
	function isAliasUsed(aliases, alias){
		for(var i = 0; i < aliases.length(); i++){
			if(aliases[i].sql_table_alias == alias){
				return true;
			}
		}
		return false;
	}
	
	// Similar functions as above, but accept an array including all alias table names
	function refreshAlias2(aliasNames, alias){
		if(!isAliasUsed2(aliasNames, alias)){
			return alias;
		}
		var prefix = alias.replace(/[0-9]+$/, "");
		do{
			var number = alias.substr(prefix.length);
			if(number == ""){
				number = 0;
			}
			alias = prefix + (++number);
		}while(isAliasUsed2(aliasNames, alias));
		return alias;
	}
	
	function isAliasUsed2(aliasNames, alias) {
	    for(var i = 0; i < system.functions.lng(aliasNames); i++){
			if(aliasNames[i] == alias){
				return true;
			}
		}
		return false;
	}
	
	function trim(value){
		if(value == null){
			return "EMPTY";
		}
		value = value.replace( /^\s+/, "").replace( /\s+$/, "");
		if(value == ""){
			return "EMPTY";
		}
		return value;
	}
	

function getAliasChanges(){ return changes; }
function getAliasPreChanges(){ return preChanges; }
	
	