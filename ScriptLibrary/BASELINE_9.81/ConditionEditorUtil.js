// This is common util for Condition Editor. 

// Used for getting the fields list in Webtier's Condition Editor by Remote JSCall
var $ = lib.c.$;
var getRadQueryFromCondtionXml = lib.conditionXmlParser.getRadQueryFromCondtionXml;

function getDescriptionFromConditionXml(xml) {
    var result = getRadQueryFromCondtionXml(xml);
    return result[1];
}

function getDisplayFieldsListByTable(tableName) {
    var resultObjs = [];
    var sql = "name=\"" + tableName + "\"";
    var dbFile = new SCFile("datadict", SCFILE_READONLY);

    if (dbFile.doSelect(sql) == RC_SUCCESS) {

        var crossTableInfo = getCrossTableInfo(tableName);
        var aryFields = dbFile["fields"];
        var aryCaptions = dbFile["captions"];
        var aryTypes = dbFile["types"];
        var globallists = dbFile["globallist"];
        var arySysFieldType = dbFile["sysFieldType"];

        var displayDeprecatedfields = lib.settings.getSettingValue("Condition Editor", "display.deprecatedfields");
        var displaySystemfields = lib.settings.getSettingValue("Condition Editor", "display.systemfields");

        if (displayDeprecatedfields != null && displayDeprecatedfields == "true") {
            displayDeprecatedfields = true;
        } else {
            displayDeprecatedfields = false;
        }
        if (displaySystemfields != null && displaySystemfields == "true") {
            displaySystemfields = true;
        } else {
            displaySystemfields = false;
        }

        if (aryFields != null && aryCaptions != null) {
            var lng = funcs.lng(funcs.denull(aryFields));
            var bShowField = true;
            if (lng == null) {
                lng = 0;
            }

            var i;
            for (i = 0; i < lng; i++) {
                bShowField = true;

                if (arySysFieldType != null && arySysFieldType[i] != null) {
                    if (arySysFieldType[i] == 4 && displayDeprecatedfields == false) {
                        bShowField = false;
                    }
                    if (arySysFieldType[i] == 1 && displaySystemfields == false) {
                        bShowField = false;
                    }
                }

                if (bShowField) {
                    resultObjs.push({
                        fieldName: aryFields[i],
                        caption: getLocalFieldCaption(aryFields[i], aryCaptions[i], true),
                        enCaption: getLocalFieldCaption(aryFields[i], aryCaptions[i], false),
                        dataType: aryTypes[i],
                        globalList: globallists[i],
                        crossTables: crossTableInfo[aryFields[i]] ? crossTableInfo[aryFields[i]].crossTables : null,
                        crossTableCaptions: crossTableInfo[aryFields[i]] ? crossTableInfo[aryFields[i]].crossTableCaptions : null,
                        foreignKeys: crossTableInfo[aryFields[i]] ? crossTableInfo[aryFields[i]].foreignKeys : null
                    });
                }
            }
        }
    }

    return resultObjs;
}

function getLocalFieldCaption(fieldName, caption, localized) {
    if (localized == null) {
        localized = true;
    }

    var result = fieldName;
    if (caption != null) {
        result = caption;

        if (localized) {
            result = funcs.scmsg(caption, "sccaption");
            if (funcs.index("Could not be found:", result) > 0) {
                result = caption;
            }
        }
    }

    return result;
}

function getCrossTableInfo(tableName) {
    var relationFromSource = $("relation").select(
        '(relType="B" or relType = "C") and source.file="' + tableName + '"').list();

    var relationFromTarget = $("relation").select(
        '(relType="A" or relType = "C") and target.file="' + tableName + '"').list();

    var newRelations = relationFromSource.concat(swapRelations(relationFromTarget));
    newRelations.sort();

    var map = {};
    var i;
    for (i = 0; i < newRelations.length; ++i) {
        var crossTable = newRelations[i].target_file;
        var crossTableCaption = funcs.scmsg(crossTable, "tablename");
        var foreignKey = newRelations[i].target_field;
        var sourceField = newRelations[i].source_field;

        if (!sourceField) {
            continue;
        }

        sourceField = sourceField.split(',');
        sourceField = sourceField[sourceField.length - 1];

        if (!map[sourceField]) {
            map[sourceField] = {
                crossTables: [],
                crossTableCaptions: [],
                foreignKeys: []
            };
        }
        map[sourceField].crossTables.push(crossTable);
        map[sourceField].crossTableCaptions.push(crossTableCaption);
        map[sourceField].foreignKeys.push(foreignKey);
    }

    return map;
}


//swap relations between source and target for display purpose
function swapRelations(relations) {
    var newRelations = [];
    var i;
    for (i = 0; i < relations.length; i++) {
        var relation = relations[i];
        var newRelation = new SCFile("relation");

        newRelation["source.file"] = relation["target.file"];
        newRelation["source.field"] = relation["target.field"];
        newRelation["target.file"] = relation["source.file"];
        newRelation["target.field"] = relation["source.field"];
        newRelation["source.sqltable"] = relation["target.sqltable"];
        newRelation["source.sqlfield"] = relation["target.sqlfield"];
        newRelation["target.sqltable"] = relation["source.sqltable"];
        newRelation["target.sqlfield"] = relation["source.sqlfield"];
        newRelation["cascade.query"] = relation["cascade.query"];
        newRelation["cascade.update"] = relation["cascade.update"];
        newRelation["def.type"] = relation["def.type"];
        newRelation["def.query"] = relation["def.query"];
        newRelation["sysmodtime"] = relation["sysmodtime"];

        if (relation["relType"] == "A") {
            newRelation["relType"] = "B";
        } else if (relation["relType"] == "B") {
            newRelation["relType"] = "A";
        } else {
            newRelation["relType"] = relation["relType"];
        }

        newRelations.push(newRelation);
    }

    return newRelations;
}

//--------------------- add for ide -------------------------

lib.ConditionEditorUtil = {
    "getDescriptionFromConditionXml": getDescriptionFromConditionXml,
    "getDisplayFieldsListByTable": getDisplayFieldsListByTable,
    "getLocalFieldCaption": getLocalFieldCaption,
    "getCrossTableInfo": getCrossTableInfo,
    "swapRelations": swapRelations
};