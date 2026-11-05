var KEY_TYPES = {
    0: "Nulls & Duplicates",
    4: "No Nulls",
    8: "No Duplicates",
    12: "Unique",
    28: "Primary",
    64: "IR Key"
};


function scanKeys(outFile) {
   	var i, j, k;

    var dbdicts = [];
    var f = new SCFile("dbdict", SCFILE_READONLY);
    var rc = f.doSelect("true");
    
    while (rc == RC_SUCCESS) {
        var table = {
            name: f.name,
            keys: []
        };
        dbdicts.push(table);
        table.maps = [];
        
        var lngTables = funcs.lng(f.sql_tables);
        for (i = 0; i < lngTables; ++i) {
            table.maps.push(f.sql_tables[i]["sql_table_name"]);
        }
        table.dbTable = f.sql_tables[0]["sql_table_name"];

        var lngFiled = funcs.lng(f.field);
        table.fields = {};
        for (i = 0; i < lngFiled; ++i) {
            var fieldName = f.field[i]["name"];
            table.fields[fieldName] = f.field[i]["sql.column.name"];
        }

        var lngKey = funcs.lng(f.key);

        for (i = 0; i < lngKey; ++i) {
            var keyInfo = {
                keyType: f.key[i].flags,
                keyFields: [],
                keyDBFileds: []
            };
            table.keys.push(keyInfo);

            var lngKeyFields = funcs.lng(f.key[i].name);
            for (j = 0; j < lngKeyFields; ++j) {
                var fieldKFName = f.key[i].name[j];
                keyInfo.keyFields.push(fieldKFName);
                var nameSplits = fieldKFName.split(",");
                if (nameSplits.length > 1) {
                	fieldKFName = nameSplits[nameSplits.length - 1];
                }
                keyInfo.keyDBFileds.push(table.fields[fieldKFName]);
            }
        }

        rc = f.getNext();
    }

    var msgs = [];
    var title = "table\tDB table\tkey#\tkey type\tkey fields\tkey DB fields";
    msgs.push(title);

    for (i = 0; i < dbdicts.length; ++i) {
        var theTable = dbdicts[i];
        msgs.push(theTable.name + "\t" + theTable.dbTable);
        
        for (j = 0; j < theTable.keys.length; ++j) {
            msgs.push("\t\t" + (j + 1) + "\t" + KEY_TYPES[theTable.keys[j].keyType] + "\t");
            for (k = 0; k < theTable.keys[j].keyFields.length; ++k) {
                msgs.push("\t\t\t\t" + theTable.keys[j].keyFields[k] + "\t" + theTable.keys[j].keyDBFileds[k]);
            }
        }
    }

//    print(msgs.join("\n"));
    if (outFile) {
    	writeFile(outFile, "\t", msgs.join("\n"));
    }
}



function scanSysmodtime(outFile) {
	var i, j;
	
    var dbdicts = [];
    var f = new SCFile("dbdict", SCFILE_READONLY);
    var rc = f.doSelect("true");
    
    while (rc == RC_SUCCESS) {
        var table = {
            name: f.name
        };
        dbdicts.push(table);
        table.maps = [];
        var lngTables = funcs.lng(f.sql_tables);
        for (i = 0; i < lngTables; ++i) {
            table.maps.push(f.sql_tables[i]["sql_table_name"]);
        }
        table.dbTable = f.sql_tables[0]["sql_table_name"];

        var lngFiled = funcs.lng(f.field);
        for (i = 0; i < lngFiled; ++i) {
            var fieldName = f.field[i]["name"];
            if (fieldName == "sysmodtime") {
                table.sysmodtime = true;
                table.sysmodtime_db = f.field[i]["sql.column.name"];
//                print(f.name+" has sysmodtime");
                break;
            }
        }

        var lngKey = funcs.lng(f.key);
        var keyFound = false;
        for (i = 0; keyFound == false && i < lngKey; ++i) {
        
            var lngKeyFields = funcs.lng(f.key[i].name);
            for (j = 0; j < lngKeyFields; ++j) {
                var fieldKFName = f.key[i].name[j];
                if (fieldKFName == "sysmodtime") {
                    table.sysmodtimeKey = f.key[i].flags;
                    table.sysmodtimeKeyPos = String(i + 1) + "#" + (j + 1);
                    keyFound = true;
                    break;
                }
            }
        }

        rc = f.getNext();
    }

    var msgs = [];
    var title = "table\thas sysmodtime?\tDB Table\tDB field\tkey\tkey pos";
    msgs.push(title);

    for (i = 0; i < dbdicts.length; ++i) {
        var theTable = dbdicts[i];
        var line = theTable.name + "\t" + (theTable.sysmodtime || "") + "\t" + (theTable.dbTable || "") + "\t" + (theTable.sysmodtime_db || "") + "\t" + (KEY_TYPES[theTable.sysmodtimeKey] || "") + "\t" + (theTable.sysmodtimeKeyPos || "");
        msgs.push(line);
    }

//    print(msgs.join("\n"));
    if (outFile) {
    	writeFile(outFile, "\t", msgs.join("\n"));
    }
}


/**
 * Show general import schedule wizard
 */
function generateImportSchedule() {

	var typeArray = lib.DataTypeConst.typeArray();
	var typeString = lib.DataTypeConst.typeCharacter();
	
    var rteReturnValue = new SCDatum();
	var argNames = new SCDatum();
	var argVals = new SCDatum();
	
	argVals.setType(typeArray);
	argNames.setType(typeArray);
	
	var argVal = new SCDatum();
	argVal.setType(typeString);                           
	argVal = "name";
	argNames.push(argVal);
	
	argVal = new SCDatum();
	argVal.setType(typeString);                      
	argVal = "unload.schedule.import";
	argVals.push(argVal);      
	      
	funcs.rtecall("callrad", rteReturnValue, "wizard.run", argNames, argVals, true);
}


//scanKeys("C:\\temp\\keys.txt");
//scanSysmodtime("C:\\temp\\sysmodtime.txt");
//generateImportSchedule();
