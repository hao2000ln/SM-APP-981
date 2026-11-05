
/**
 * The main purpose of this script is to resolve the performance issue for some tables, for example, kmknowledgebaseupdates, cirelationship.
 *
 */
 
	function run(){
		//the order for sqlstatement:oracle, db2, mssql
		fixData("kmknowledgebaseupdates", ["set id='KMU'||to_char(rownum) where id is null", "set id='KMU'||row_number() over() where id is null", ""]);
		//fixData("cirelationship", ["", "", ""]);
	}
	
	function fixData(filename, statements){
		var file = new SCFile("dbdict");
		var rc = file.doSelect("name=\"" + filename + "\"");
		if(rc == RC_SUCCESS){
			var tablename;
			var dbtype;
			for(var i =0; i < file.sql_tables.length(); i++){
				if(file.sql_tables[i].sql_table_alias.toLowerCase() == "m1"){
					tablename = file.sql_tables[i].sql_table_name;
					dbtype = file.sql_tables[i].sql_db_type;
					break;
				}
			}
			if(tablename != null && dbtype != null){
				if(dbtype.toLowerCase().indexOf("ora")== 0){
					var sql = "update " + tablename + " " + statements[0];
					lib.upgradeLog.detail("Executing sql:" + sql);
					executeSQL(sql);
					lib.upgradeLog.detail("Finished executing sql.");
				}else if(dbtype.toLowerCase().indexOf("db2") == 0){
					var sql = "update " + tablename + " " + statements[1];
					lib.upgradeLog.detail("Executing sql:" + sql);
					executeSQL(sql);
					lib.upgradeLog.detail("Finished executing sql.");
				}
			}
		}
	}
	
	function executeSQL(statement){
	    var names = new SCDatum();
		var values = new SCDatum(); 		
		
		names.push("values"); 		  	
		values.push([statement, "commit"]); 
		
		system.functions.rtecall("callrad", new SCDatum(), "SQLexecute", names, values, false);
	}
	
	
