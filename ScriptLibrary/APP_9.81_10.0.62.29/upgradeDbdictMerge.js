/** @fileoverview upgradeDbdictMerge - contains functions used by the Service Manager Upgrade
 *   @author Alex Corvino
 */
var aAddedFields = new SCDatum();
var aException = new SCDatum();

function mergeDbdictByXML(fOldDbdict, fNewDbdict, aLogs) {
    var strName = fOldDbdict.name;

    var oldXML = fOldDbdict.getXML();
    var newXML = fNewDbdict.getXML();

    var bDidFieldMerge = mergeFields(strName, oldXML, newXML);
    var bDidSQLMerge = mergeSQLTables(strName, oldXML, newXML);

    aLogs.push(aException);
    aLogs.push(aAddedFields);

    if (bDidFieldMerge || bDidSQLMerge) {
        fOldDbdict.setRecord(oldXML.toXMLString());
        fOldDbdict.doUpdate();
    }

    return aLogs;
}


//function testMergeByXML() {
//    var fOld = new SCFile("dbdict");
//    fOld.doSelect("name=\"cm3r\"");
//
//    var fNew = new SCFile("upgradedbdict");
//    fNew.doSelect("name=\"cm3r\"");
//
//    var oldXML = fOld.getXML();
//    var newXML = fNew.getXML();
//
//    var bDidFieldMerge = mergeFields("cm3r", oldXML, newXML);
//    var bDidSQLMerge = mergeSQLTables("cm3r", oldXML, newXML);
//
//    return oldXML.toXMLString();
//}


function mergeFields(strName, oldXML, newXML) {
    var rebuiltFields = new XML("field");
    rebuiltFields.addAttribute("sctype", "array");

    var oldInstance = lib.xmlHelpers.getElement(oldXML, "instance", null);
    var oldFields = lib.xmlHelpers.getElement(oldInstance, "field", null);
    var oldField = oldFields.getFirstChildElement();
    //put the decriptor field in the rebuilt fields.
    rebuiltFields = lib.xmlHelpers.addChildElement(rebuiltFields, oldField);
    oldField = oldField.getNextSiblingElement(); //skip the descriptor field

    var newInstance = lib.xmlHelpers.getElement(newXML, "instance", null);
    var newFields = lib.xmlHelpers.getElement(newInstance, "field", null);
    var newField = newFields.getFirstChildElement();
    newField = newField.getNextSiblingElement(); //skip the descriptor field

    var bDidMerge = false;
    var bCheckedNextField = false;
    print("MERGING " + strName);

    while (newField != null) {
        var newName = (lib.xmlHelpers.getElement(newField, "name", null)).getText();
        var newLevel = (lib.xmlHelpers.getElement(newField, "level", null)).getValue();
        var newIndex = (lib.xmlHelpers.getElement(newField, "index", null)).getValue();
        var newType = (lib.xmlHelpers.getElement(newField, "type", null)).getValue();
        var newSQLFields = lib.xmlHelpers.getElement(newField, "sql.field.options", null);

        var element = lib.xmlHelpers.getElement(newSQLFields, "sql.table.alias", null);
        var newSQLTableAlias = null;
        if (element != null) {
            newSQLTableAlias = element.getText();
        }

        element = lib.xmlHelpers.getElement(newSQLFields, "sql.column.name", null);
        var newSQLColumnName = null;
        if (element != null) {
            newSQLColumnName = element.getText();
        }

        element = lib.xmlHelpers.getElement(newSQLFields, "sql.data.type", null);
        var newSQLDataType = null;
        if (element != null) {
            newSQLDataType = element.getText();
        }

        element = lib.xmlHelpers.getElement(newSQLFields, "sql.rcformat", null);
        var newSQLRCFormat = null;
        if (element != null) {
            newSQLRCFormat = element.getValue();
        }

        //if we'er out of old fields and we still have new ones then they have been added. 
        if (oldField == null) {
            rebuiltFields = lib.xmlHelpers.addChildElement(rebuiltFields, newField);
            aAddedFields.push(newName);
            bDidMerge = true;
            print("Added NEW FIELD " + newName + " LEVEL " + newLevel + " INDEX " + newIndex);
        } else {
            var oldIndex = (lib.xmlHelpers.getElement(oldField, "index", null)).getValue();
            var oldName = (lib.xmlHelpers.getElement(oldField, "name", null)).getText();
            var oldLevel = (lib.xmlHelpers.getElement(oldField, "level", null)).getValue();
            var oldType = (lib.xmlHelpers.getElement(oldField, "type", null)).getValue();
            var oldSQLFields = lib.xmlHelpers.getElement(oldField, "sql.field.options", null);

            element = lib.xmlHelpers.getElement(oldSQLFields, "sql.table.alias", null);
            var oldSQLTableAlias = null;
            if (element != null) {
                oldSQLTableAlias = element.getText();
            }

            element = lib.xmlHelpers.getElement(oldSQLFields, "sql.column.name", null);
            var oldSQLColumnName = null;
            if (element != null) {
                oldSQLColumnName = element.getText();
            }

            element = lib.xmlHelpers.getElement(oldSQLFields, "sql.data.type", null);
            var oldSQLDataType = null;
            if (element != null) {
                oldSQLDataType = element.getText();
            }

            element = lib.xmlHelpers.getElement(oldSQLFields, "sql.rcformat", null);
            var oldSQLRCFormat = null;
            if (element != null) {
                oldSQLRCFormat = element.getValue();
            }

            if (newName == oldName &&
                newLevel == oldLevel &&
                newIndex == oldIndex &&
                newType == oldType &&
                newSQLTableAlias == oldSQLTableAlias &&
                newSQLColumnName == oldSQLColumnName &&
                newSQLDataType == oldSQLDataType &&
                newSQLRCFormat == oldSQLRCFormat) {
                //fields didn't change. Move along.
                print("Skipping " + oldName);
                rebuiltFields = lib.xmlHelpers.addChildElement(rebuiltFields, oldField);
            } else if (newName != oldName &&
                (newLevel == oldLevel &&
                    newIndex == oldIndex &&
                    newType == oldType &&
                    newSQLTableAlias == oldSQLTableAlias &&
                    newSQLColumnName == oldSQLColumnName &&
                    newLevel == 1)) {
                //if ONLY the dbdict field names are different and the SQL mapping is the same then there was
                //a field renamed. Take the new field name.		
                bDidMerge = true;
                var node = lib.xmlHelpers.getElement(oldField, "name", null);
                node.setText(newName);
                aAddedFields.push("dbdict: " + strName + " Renamed field " + oldName + " to " + newName);
                print("renaming " + oldName + " to " + newName);

                rebuiltFields = lib.xmlHelpers.addChildElement(rebuiltFields, oldField);
            } else if (newName == oldName &&
                newLevel == oldLevel &&
                newIndex == oldIndex &&
                newType == oldType &&
                (newSQLTableAlias != oldSQLTableAlias ||
                    newSQLColumnName != oldSQLColumnName ||
                    newSQLDataType != oldSQLDataType ||
                    newSQLRCFormat != oldSQLRCFormat)) {
                //if the field names are the same but the SQL mapping changed then take the new sql mapping.			
                bDidMerge = true;
                replaceSQLFields(oldField, newSQLFields);
                print("Getting the sql mapping for " + newName);
                rebuiltFields = lib.xmlHelpers.addChildElement(rebuiltFields, oldField);
            } else if (newName == oldName &&
                newLevel == oldLevel &&
                newIndex == oldIndex &&
                newType != oldType) {
                //if just the types are different then you did something 
                //really, really, *really* wrong and you're on your own.
                aException.push("dbdict: " + strName + " Field:" + oldName + " Level:" + oldLevel + " Index:" + oldIndex +
                    " was not changed because type " + oldType + " does not match " + newType);

                print("Bad type for " + oldName);
                rebuiltFields = lib.xmlHelpers.addChildElement(rebuiltFields, oldField);
            } else if (newLevel > 1) {
                bCheckedNextField = true;

                while (newName != oldName &&
                    newField != null) {
                    if (newName != oldName &&
                        newLevel == oldLevel &&
                        newIndex == oldIndex &&
                        oldXML.toXMLString().indexOf(">" + newName + "<") == -1) {
                        rebuiltFields = lib.xmlHelpers.addChildElement(rebuiltFields, newField);
                        aAddedFields.push(newName);
                        bDidMerge = true;
                        print("Struct add " + newName + " LEVEL " + newLevel + " INDEX " + newIndex);
                    }

                    newField = newField.getNextSiblingElement();
                    newLevel = (lib.xmlHelpers.getElement(newField, "level", null)).getValue();
                    newIndex = (lib.xmlHelpers.getElement(newField, "index", null)).getValue();
                    newName = (lib.xmlHelpers.getElement(newField, "name", null)).getText();
                    newType = (lib.xmlHelpers.getElement(newField, "type", null)).getValue();
                }
            }
        }

        if (!bCheckedNextField) {
            newField = newField.getNextSiblingElement();
        }

        if (oldField != null && !bCheckedNextField) {
            oldField = oldField.getNextSiblingElement();
        }
        bCheckedNextField = false;
    }

    if (bDidMerge) {
        //Since we don't have the best DOM support right now we'll just rebuild the whole document	
        var strOldXML = oldXML.toXMLString();
        var strStart = strOldXML.slice(0, strOldXML.indexOf("<field"));
        var strEnd = strOldXML.slice(strOldXML.indexOf("<key sctype=\"array\">"));
        var strRebuiltXML = strStart + rebuiltFields.toXMLString() + strEnd;

        oldXML = oldXML.setContent(strRebuiltXML);
    }

    return bDidMerge;
}


function mergeSQLTables(strName, oldXML, newXML) {
    var bDidMerge = false;
    var oldInstance = lib.xmlHelpers.getElement(oldXML, "instance", null);
    var oldTables = lib.xmlHelpers.getElement(oldInstance, "sql.tables", null);
    var oldTable = oldTables.getFirstChildElement();

    var newInstance = lib.xmlHelpers.getElement(newXML, "instance", null);
    var newTables = lib.xmlHelpers.getElement(newInstance, "sql.tables", null);
    var newTable = newTables.getFirstChildElement();

    var bOldTableFound = false;
    var bBadTableFound = false;

    while (newTable != null) {
        var newDBType = (lib.xmlHelpers.getElement(newTable, "sql.db.type", null)).getText();
        var newTableName = (lib.xmlHelpers.getElement(newTable, "sql.table.name", null)).getText();
        var newTableAlias = (lib.xmlHelpers.getElement(newTable, "sql.table.alias", null)).getText();
        var newTableKeys = (lib.xmlHelpers.getElement(newTable, "sql.lookup.table.keys", null)).getText();
        var newTableOptions = (lib.xmlHelpers.getElement(newTable, "sql.table.options", null)).getText();

        while (!bOldTableFound && !bBadTableFound && oldTable != null) {
            var oldDBType = (lib.xmlHelpers.getElement(oldTable, "sql.db.type", null)).getText();
            var oldTableName = (lib.xmlHelpers.getElement(oldTable, "sql.table.name", null)).getText();
            var oldTableAlias = (lib.xmlHelpers.getElement(oldTable, "sql.table.alias", null)).getText();
            var oldTableKeys = (lib.xmlHelpers.getElement(oldTable, "sql.lookup.table.keys", null)).getText();
            var oldTableOptions = (lib.xmlHelpers.getElement(oldTable, "sql.table.options", null)).getText();

            if (newDBType == oldDBType &&
                newTableName == oldTableName &&
                newTableAlias == oldTableAlias &&
                newTableKeys == oldTableKeys &&
                newTableOptions == oldTableOptions) {
                bOldTableFound = true;
            } else if (newTableAlias == oldTableAlias &&
                (newDBType != oldDBType ||
                    newTableName != oldTableName ||
                    newTableKeys != oldTableKeys ||
                    newTableOptions != oldTableOptions)) {
                bBadTableFound = true;
                aException.push("dbdict: " + strName + " table alias mismatch found");

            } else {
                oldTable = oldTable.getNextSiblingElement();
            }
        }

        if (!bOldTableFound && !bBadTableFound) {
            bDidMerge = true;
            print("added table " + newTable);
            lib.xmlHelpers.addChildElement(oldTables, newTable);
            aAddedFields.push("dbdict: " + strName + " added table:" + newTableName + " alias:" + newTableAlias);
        }

        oldTable = oldTables.getFirstChildElement();
        newTable = newTable.getNextSiblingElement();
        bOldTableFound = false;
        bBadTableFound = false;
    }

    return bDidMerge;
}

function getStructSize(curXML, strCurrStruct) {
    var curInstance = lib.xmlHelpers.getElement(curXML, "instance", null);
    var curFields = lib.xmlHelpers.getElement(curInstance, "field", null);
    var curField = curFields.getFirstChildElement();

    var tgtLevel = 0;
    var size = 0;
    var curLevel;
    var curName;

    while (curField != null) {
        curLevel = (lib.xmlHelpers.getElement(curField, "level", null)).getValue();
        curName = (lib.xmlHelpers.getElement(curField, "name", null)).getText();

        if (curName == strCurrStruct) {
            tgtLevel = Number(curLevel) + 1;
        }

        if (Number(curLevel) == tgtLevel - 1) {
            return size;
        } else if (Number(curLevel) == tgtLevel) {
            size++;
        }

        curField = curField.getNextSiblingElement();
    }

    return size;
}

function getLastFieldIndex(fields) {
    var field = fields.getFirstChildElement();
    var iIndex = 0;
    var iCurIndex = 0;
    var iCurLevel = 0;

    while (field != null) {
        iCurLevel = Number((lib.xmlHelpers.getElement(field, "level", null)).getValue());
        iCurIndex = Number((lib.xmlHelpers.getElement(field, "index", null)).getValue());

        //we don't care about the indexes in structures. 
        if (iCurLevel == 1 && iCurIndex > iIndex) {
            iIndex = iCurIndex;
        }

        field = field.getNextSiblingElement();
    }

    return iIndex;
}

function replaceSQLFields(curField, newSQLFields) {
    var sqlFieldNames = ["sql.table.alias", "sql.column.name", "sql.data.type", "sql.rcformat"];
    var oldSQLFields = lib.xmlHelpers.getElement(curField, "sql.field.options", null);

    var x;
    for (x = 0; x < sqlFieldNames.length; x++) {
        var newElement = lib.xmlHelpers.getElement(newSQLFields, sqlFieldNames[x], null);
        var oldElement = lib.xmlHelpers.getElement(oldSQLFields, sqlFieldNames[x], null);

        if (newElement == null && oldElement != null) {
            oldElement.setValue(null);
        } else if (oldElement == null && newElement != null) {
            oldElement = oldSQLFields.addElement(sqlFieldNames[x]);
            oldElement.addAttribute("sctype", "string");
            oldElement.setValue(newElement.getValue());
        } else if (oldElement != null && newElement != null) {
            oldElement.setValue(newElement.getValue());
        }
    }
}

function sortDbdictFieldIndex(name, level) {
    if (level < 1) {
        return RC_ERROR;
    }

    var dbdict = new SCFile("dbdict");
    var rc = dbdict.doSelect("name=\"" + name + "\"");

    if (rc == RC_SUCCESS) {
        var length = system.functions.lng(dbdict["field"]);
        var i;
        for (i = 0; i < length; i++) {
            if (dbdict["field"][i]["level"] == level) {
                var index = dbdict["field"][i]["index"];
                var j;
                for (j = i + 1; j < length; j++) {
                    if (dbdict["field"][j]["level"] == level) {
                        break;
                    }
                }
                if (j < length) {
                    if (index > dbdict["field"][j]["index"]) {
                        var temp = dbdict["field"][j]["index"];
                        dbdict["field"][j]["index"] = dbdict["field"][i]["index"];
                        dbdict["field"][i]["index"] = temp;
                    }
                }
                i = j - 1;
            }
        }

        return dbdict.doUpdate();
    } else {
        return RC_NO_MORE;
    }
}