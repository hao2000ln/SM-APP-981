// This is common util for Condition Editor. 

// Used for getting the fields list in Webtier's Condition Editor by Remote JSCall
var $ = lib.c.$;
var getRadQueryFromCondtionXml = lib.conditionXmlParser.getRadQueryFromCondtionXml;

function getDescriptionFromConditionXml(xml) {
    var result = getRadQueryFromCondtionXml(xml);
    return result[1];
}

function getPhaseDisplayFields(table) {
    return getDisplayFieldsListByTable(getObjectValue(table, 'phase.file.name'));
}

function getCategoryDisplayFields(table) {
    return getDisplayFieldsListByTable(getObjectValue(table, 'category.file.name'));
}

function getSecurityAreas() {
    var areas = [];
    var sql = "true";
    var dbFile = new SCFile("secArea", SCFILE_READONLY);
    dbFile.setFields("name");
    var rc = dbFile.doSelect(sql);
    while (rc == RC_SUCCESS) {
        var name = dbFile['name'];
        areas.push(genRetObj(name, getCaption("local:secArea", name, name), name, ''));
        rc = dbFile.getNext();
    }

    var km = 'Knowledge Document';
    areas.push(genRetObj(km, getCaption("local:secArea", km, km), km, ''));

    return areas;
}

function getSecurityRights(area) {

    var rights = [];
    if (area == 'Knowledge Document') {
        rights = getDisplayFieldsListByTable('kmprofile');
    } else {
        var sql = 'setting="' + area + '" and settingType="area"';
        var dbFile = new SCFile("settingsConfig", SCFILE_READONLY);
        var rc = dbFile.doSelect(sql);
        while (rc == RC_SUCCESS) {
            var name = dbFile['id'];
            var caption = getCaption("local:settingsConfig", area + ';' + name, dbFile['label']);
            var type = dbFile['type'];

            var globalList = type == 'globallist' ? dbFile['addlTypeInfo'] : null;
            // globallist is stored in globallist table, but if type is list (manual list), it's stored in itself
            // acutally, to get a settingsConfig, we need area name and setting id which have already been passed over.
            var globalListType = (type == 'globallist' || type == 'list') ? type : null;

            type = (type == 'number' || type == 'boolean') ? type : 'string';

            rights.push(genRetObj(name, caption, name, type, globalList, globalListType));

            rc = dbFile.getNext();
        }
    }

    rights.push(genRetObj('view', getCaption("local:secRight", 'View', 'View'), 'View', 'boolean'));
    rights.push(genRetObj('new', getCaption("local:secRight", 'New', 'New'), 'New', 'boolean'));
    rights.push(genRetObj('modifyTemplate', getCaption("local:secRight", 'ModifyTemplate', 'ModifyTemplate'), 'ModifyTemplate', 'boolean'));
    rights.push(genRetObj('update', getCaption("local:secRight", 'Update', 'Update'), 'Update', 'string', 'DUMMY_GL_SpecialRight'));
    rights.push(genRetObj('delete', getCaption("local:secRight", 'Delete', 'Delete'), 'Delete', 'string', 'DUMMY_GL_SpecialRight'));
    rights.push(genRetObj('admin', getCaption("local:secRight", 'Admin', 'Admin'), 'Admin', 'boolean'));
    rights.push(genRetObj('expert', getCaption("local:secRight", 'Expert', 'Expert'), 'Expert', 'boolean'));

    return rights;
}

function getDisplayFieldsListByTable(tableName) {
    var resultObjs = [];
    var sql = "name=\"" + tableName + "\"";
    var dbFile = new SCFile("datadict", SCFILE_READONLY);

    if (dbFile.doSelect(sql) == RC_SUCCESS) {
        var scversion = $("scversion", SCFILE_READONLY).selectAll().uniqueResult();
        var version = parseFloat(scversion["application.version"].match(/[\d.]+/)[0]);
        var crossTableInfo = {};
        if (version >= 9.4) {
            crossTableInfo = getCrossTableInfo(tableName);
        }

        var aryFields = dbFile["fields"];
        var aryCaptions = dbFile["captions"];
        var aryTypes = dbFile["types"];
        var globallists = (version >= 9.4) ? dbFile["globallist"] : [];
        var arySysFieldType = dbFile["sysFieldType"];

        var displayDeprecatedfields = lib.settings.getSettingValue("Condition Editor", "display.deprecatedfields");
        var displaySystemfields = lib.settings.getSettingValue("Condition Editor", "display.systemfields");

        //fix QCCR1E118618, if there is no depericatedfiled setting config(say in pd3), we will default assume the depreicated field will be displayed
        if ((displayDeprecatedfields != null && displayDeprecatedfields == "true") || $("settingsConfig", SCFILE_READONLY).select('id="display.deprecatedfields"').uniqueResult() == null) {
            displayDeprecatedfields = true;
        } else {
            displayDeprecatedfields = false;
        }
        //fix QCCR1E118618, if there is no systefield setting config(say in pd3), we will default assume the system field will be displayed
        if ((displaySystemfields != null && displaySystemfields == "true") || $("settingsConfig", SCFILE_READONLY).select('id="display.systemfields"').uniqueResult() == null) {
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
                    var crossTables = null;
                    var crossTableCaptions = null;
                    var foreignKeys = null;
                    if (crossTableInfo != null) {
                        crossTables = crossTableInfo[aryFields[i]] ? crossTableInfo[aryFields[i]].crossTables : null;
                        crossTableCaptions = crossTableInfo[aryFields[i]] ? crossTableInfo[aryFields[i]].crossTableCaptions : null;
                        foreignKeys = crossTableInfo[aryFields[i]] ? crossTableInfo[aryFields[i]].foreignKeys : null;
                    }
                    resultObjs.push(genRetObj(
                        aryFields[i],
                        getLocalFieldCaption(aryFields[i], aryCaptions[i], true),
                        getLocalFieldCaption(aryFields[i], aryCaptions[i], false),
                        aryTypes[i],
                        globallists[i],
                        globallists[i] ? 'globallist' : null,
                        crossTables,
                        crossTableCaptions,
                        foreignKeys
                    ));
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
            return getCaption("sccaption", caption, caption);
        }
    }

    return result;
}

function getCaption(clazz, key, defaultCaption) {
    var result = funcs.scmsg(key, clazz);
    if (funcs.index("Could not be found:", result) > 0) {
        result = defaultCaption;
    }
    return result;
}

function getCrossTableInfo(tableName) {
    var relationService = $("#relationService");
    var newRelations = relationService.findForeignRelations(tableName);
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

function getObjectValue(table, field) {
    var sql = "file.name=\"" + table + "\"";
    var dbFile = new SCFile("Object", SCFILE_READONLY);
    dbFile.setFields(field);
    if (dbFile.doSelect(sql) == RC_SUCCESS) {
        return dbFile[field];
    }
    return '';
}

function genRetObj(field, caption, enCaption, dataType, globalList, globalListType, crossTables, crossTableCaptions, foreignKeys) {
    return {
        "fieldName": field,
        "caption": caption,
        "enCaption": enCaption,
        "dataType": dataType,
        "globalList": globalList ? globalList : null,
        "globalListType": globalListType ? globalListType : null,
        "crossTables": crossTables ? crossTables : null,
        "crossTableCaptions": crossTableCaptions ? crossTableCaptions : null,
        "foreignKeys": foreignKeys ? foreignKeys : null
    };
}