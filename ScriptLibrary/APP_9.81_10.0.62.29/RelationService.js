var $ = lib.c.$;

var RelationService = $(new function() {
    var dbdictService = $("#relationManagerDbdictService");
    var separatorChar = '|';

    return {
        findRelationsByTable: function(tableName) {
            var relationFromSource = $("relation").select(
                'source.file="' + tableName + '"').list();

            var relationFromTarget = $("!relation").select(
                'target.file="' + tableName + '"').list();

            //convert relationFromTarget to relationFromSource format
            var newRelations = relationFromSource.concat(this.swapRelations(relationFromTarget));
            newRelations.sort(this.sortArray);
            return newRelations;
        },

        findRelationsByTableField: function(tableName, fieldName) {
            var sql = "";
            if (!$.isEmpty(tableName)) {
                sql = '(source.file="' + tableName + '" or target.file="' + tableName + '")';
            }
            if (!$.isEmpty(fieldName)) {
                if (!$.isEmpty(sql)) {
                    sql += ' and ';
                }
                sql += '(source.field="' + fieldName + '" or target.field="' + fieldName + '")';
            }
            var newRelations = $("relation").select(sql).list();
            return newRelations;

        },

        findRelationsBySourceTable: function(sourceFile) {
            return $("relation").setOrderBy(
                ["target.file", "target.field", "source.field"],
                [SCFILE_ASC, SCFILE_ASC, SCFILE_ASC]).select(
                'source.file="' + sourceFile + '" and status ~= "invalid"').list();
        },

        findRelationsByTargetTable: function(targetFile) {
            return $("relation").setOrderBy(
                ["source.file", "source.field", "target.field"],
                [SCFILE_ASC, SCFILE_ASC, SCFILE_ASC]).select(
                'target.file="' + targetFile + '"').list();
        },

        findRelationsBySourceTargetTables: function(sourceFile, targetFile) {
            return $("relation").setOrderBy(
                ["source.file", "source.field", "target.file", "target.field"],
                [SCFILE_ASC, SCFILE_ASC, SCFILE_ASC, SCFILE_ASC]).select('source.file="' + sourceFile +
                'target.file="' + targetFile + '"').list();
        },

        findRelationsByTargetTableField: function(targetFile, targetField) {
            return $("relation").setOrderBy(
                ["source.file", "source.field"],
                [SCFILE_ASC, SCFILE_ASC]).select(
                'target.file="' + targetFile + '" and target.field="' +
                targetField + '"').list();
        },

        findRelations: function(sourceFile, sourceField) {
            return $("relation").setOrderBy(
                ["target.file", "target.field", "cascade.update", "cascade.query"],
                [SCFILE_ASC, SCFILE_ASC, SCFILE_DSC, SCFILE_DSC]).select(
                'source.file="' + sourceFile + '" and source.field="' +
                sourceField + '"').list();
        },

        findRelation: function(sourceFile, sourceField, targetFile,
            targetField) {
            return $("relation").select(
                    'source.file="' + sourceFile + '" and source.field="' +
                    sourceField + '" and target.file="' + targetFile +
                    '" and target.field="' + targetField + '"')
                .uniqueResult();
        },

        // relType could be A(one-to-many), B(many-to-one), C(one-to-one) and D(many-to-many)
        findRelationsByrelType: function(relType) {
            return $("relation").setOrderBy(
                ["source.file", "source.field", "target.file", "target.field"],
                [SCFILE_ASC, SCFILE_ASC, SCFILE_ASC, SCFILE_ASC]).select('relType="' + relType + '"').list();
        },

        findAllSourceFiles: function() {
            var relations = $("!relation").
            fields(["source.file", "source.field", "target.file", "target.field"]).
            setOrderBy(["source.file", "source.field"], [SCFILE_ASC, SCFILE_ASC]).
            select('status ~= "invalid"').list();

            var soruceHash = {};

            var i;
            for (i = 0; i < relations.length; i++) {
                var relation = relations[i];
                var sourceFileName = relation["source.file"];
                var sourceFieldName = relation["source.field"];
                var targetFileName = relation["target.file"];
                var targetFieldName = relation["target.field"];
                if (!soruceHash[sourceFileName]) {
                    soruceHash[sourceFileName] = {};
                }
                if (!soruceHash[sourceFileName][targetFileName]) {
                    soruceHash[sourceFileName][targetFileName] = {};
                }
                if (!soruceHash[sourceFileName][targetFileName][sourceFieldName]) {
                    soruceHash[sourceFileName][targetFileName][sourceFieldName] = {};
                }

                soruceHash[sourceFileName][targetFileName][sourceFieldName][targetFieldName] = targetFieldName;

            }
            return soruceHash;
        },

        findAllTargetFiles: function() {
            var relations = $("!relation").fields(["target.file", "target.field"]).
            setOrderBy(["target.file", "target.field"], [SCFILE_ASC, SCFILE_ASC]).select('true').list();

            var targetHash = {};

            var i;
            for (i = 0; i < relations.length; i++) {
                var relation = relations[i];
                var targetFileName = relation["target.file"];
                var targetFieldName = relation["target.field"];
                if (!targetHash[targetFileName]) {
                    targetHash[targetFileName] = {};
                } else {
                    targetHash[targetFileName][targetFieldName] = 1;
                }
            }
            return targetHash;
        },

        findForeignRelations: function(tableName) {
            var query = 'SELECT distinct source.file, source.field, target.file, target.field FROM relation WHERE (relType="B" or relType = "C") and source.file="' + tableName + '"';
            var relations = $("relation").select(query).list(true);
            return relations;
        },

        findRelationIgnoreList: function(relation) {
            if (relation == null) {
                return null;
            }
            var query = [
                "source.file=\"",
                relation["source.file"],
                "\" and source.field=\"",
                relation["source.field"],
                "\" and target.file=\"",
                relation["target.file"],
                "\" and target.field=\"",
                relation["target.field"],
                "\" and relation.type=\"",
                relation["relType"],
                "\""
            ].join("");
            return $("refCheckSkipList").select(query).uniqueResult();
        },
        isValidforIgnoreList: function(relation) {
            if (relation == null) {
                return false;
            }
            var postExp = relation["post.expression"];
            var status = relation["status"];
            var defType = relation["def.type"];
            var relType = relation["relType"];
            return !postExp && status != "invalid" &&
                (defType == "erddef" || defType == "link" || defType == "manual");
        },

        createIgnoreListRecord: function(relation) {
            var record = new SCFile("refCheckSkipList");
            record["source.file"] = relation["source.file"];
            record["source.field"] = relation["source.field"];
            record["target.file"] = relation["target.file"];
            record["target.field"] = relation["target.field"];
            record["relation.type"] = relation["relType"];
            var rteNumber = new SCDatum();
            funcs.getnumber(rteNumber, "refCheckSkipList", "id");
            record["id"] = rteNumber;
            return record;
        },

        truncateBydefType: function(defType) {
            var relations = $("relation").select('def.type="' + defType + '" and status ~= "fixed"').list();

            var i;
            for (i = 0; i < relations.length; i++) {
                var relation = relations[i];
                relation.doDelete();
            }
        },

        truncateByQuery: function(query) {
            var relation = new SCFile("relation");
            relation.doPurge(query);
        },

        msg: function(no) {
            funcs.msg(funcs.scmsg(no, "relation"), 1);
        },
        createRelation: function(fromFile, fromField, toFile, toField, defType,
            defQuery, hasPostExpression, relType) {
            var relation = new SCFile("relation");
            // default to true for all fields for cascade.query and cascade.update
            relation["cascade.query"] = true;
            relation["cascade.update"] = true;
            relation["def.type"] = defType;
            relation["def.query"] = defQuery;
            relation["relType"] = relType;

            relation["source.file"] = fromFile;
            relation["source.field"] = fromField;
            relation["target.file"] = toFile;
            relation["target.field"] = toField;
            if ($.isEmpty(hasPostExpression)) {
                hasPostExpression = false;
            }
            relation["post.expression"] = hasPostExpression;
            relation["do.ref.check"] = true;
            relation = this.validate(relation);
            return relation;
        },

        addRelation: function(fromFile, fromField, toFile, toField, defType,
            defQuery, hasPostExpression, relType) {
            var relation = this.createRelation(fromFile, fromField, toFile, toField, defType,
                defQuery, hasPostExpression, relType);
            var status = relation["status"];
            if (status == 'invalid' && defType == 'manual') {
                this.msg(16); //Validation failed! Please check your input
            } else if (status != 'fixed' && status != 'skip') {
                if (defType == 'manual') {
                    relation["status"] = 'fixed';
                }
                var rc = relation.doInsert();
                if (rc == RC_SUCCESS && defType == 'manual') {
                    this.msg(15); //New relation saved!
                }
            }
            return relation;
        },

        save: function(relation) {
            relation = this.validate(relation);
            if (relation["status"] == 'invalid') {
                this.msg(16); //Validation failed! Please check your input
            } else {
                relation["status"] = 'fixed';
                relation.doUpdate();
            }
            return relation;
        },
        addSeparatorCharIfNotNull: function(str) {
            return str == null ? '' : str + separatorChar;
        },

        isValidFields: function(from, relation) {
            var table = relation[from + ".file"];
            var fields = relation[from + ".field"];
            var fieldOptions;
            var dbdict;
            if ($.isEmpty(table) ||
                $.isEmpty(fields)) {
                relation["status"] = "invalid";
                return false;
            }
            //table
            dbdict = dbdictService.getValidDbdictWithCacheByName(table);
            if (dbdict == null) {
                relation["status"] = "invalid";
                return false;
            }

            //field
            var fieldsArray = fields.split(separatorChar);
            relation[from + ".sqlfield"] = null;
            var i;
            for (i = 0; i < fieldsArray.length; i++) {
                var field = fieldsArray[i];
                var descriptorMeta = dbdictService.getDescriptorMetaWithCache(dbdict, "field");
                var fieldMeta = dbdictService.getFieldMeta(field, descriptorMeta);
                if (fieldMeta == null) {
                    relation["status"] = "invalid";
                    return false;
                } else {
                    var sourceField = fieldMeta.field;
                    var fieldName = from + ".sqlfield";

                    fieldOptions = sourceField["sql.field.options"];
                    // get SQL information for source field
                    var isLobField = dbdictService.isLobField(fieldMeta);
                    var curValue = relation[fieldName];
                    var fieldValue = this.addSeparatorCharIfNotNull(curValue);
                    fieldValue += isLobField ? 'In LOB:' : '';
                    var sourceFieldMeta = dbdictService.getFieldMetaWithSQLInfo(fieldMeta);
                    var sourceSqlField = sourceFieldMeta.field["sql.field.options"]["sql.column.name"];
                    fieldValue += sourceSqlField;
                    relation[fieldName] = fieldValue;
                    // replace the field value with full path
                    fieldName = from + ".field";
                    curValue = relation[fieldName];
                    if (curValue == fields) {
                        curValue = null;
                    }
                    fieldValue = this.addSeparatorCharIfNotNull(curValue) + fieldMeta.path;
                    relation[fieldName] = fieldValue;
                }
            }
            //table
            var sqlTables = dbdict["sql.tables"];
            var sourceSqlTable = dbdictService.getSqlTable(fieldOptions, sqlTables);
            relation[from + ".sqltable"] = sourceSqlTable == "" ? sqlTables["sql.table.name"] : sourceSqlTable;
            relation["status"] = "new";
            return true;
        },

        isUniqueKey: function(from, relation) {
            var table = relation[from + ".file"];
            var fields = relation[from + ".field"];
            var strField = fields.split(separatorChar).sort().join();
            var dbdict = dbdictService.getValidDbdictWithCacheByName(table);
            var uniqueKeys = dbdictService.getUniqueKeys(dbdict["key"]);
            var i;
            for (i = 0; i < uniqueKeys.length; i++) {
                if (uniqueKeys[i].name.toArray().sort().join() == strField) {
                    return true;
                }
            }
            return false;
        },

        checkUniqueKey: function(relation) {
            var relType;
            var isSUKey1 = this.isUniqueKey('source', relation);
            var isSUKey2 = this.isUniqueKey('target', relation);

            if ((isSUKey1) && (!isSUKey2)) {
                relType = "A"; //one to many
            } else if ((!isSUKey1) && (isSUKey2)) {
                relType = "B"; //many to one
            } else if ((isSUKey1) && (isSUKey2)) {
                relType = "C"; //one to one
            } else {
                relType = "D"; //many to many
            }

            relation["relType"] = relType;
        },

        validate: function(relation) {
            if ($.isEmpty(relation["source.file"]) ||
                $.isEmpty(relation["source.field"]) ||
                $.isEmpty(relation["target.file"]) ||
                $.isEmpty(relation["target.field"])) {
                relation["status"] = "invalid";
                return relation;
            }
            // backup the alias field; 
            relation["source.field.alias"] = relation["source.field"];
            relation["target.field.alias"] = relation["target.field"];
            if (this.isValidFields('source', relation) && this.isValidFields('target', relation)) {
                if (relation["def.type"] != 'erddef') {
                    this.checkUniqueKey(relation);
                }
            }
            var status = relation["status"];
            if (status == 'invalid') {
                var fixedMemo = relation["source.file"] + relation["source.field"] + relation["target.file"] + relation["target.field"] + "";
                if (fixedMemo == 0) {
                    // skip this since all the required field are empty
                    relation["status"] = 'skip';
                    return relation;
                }
                var defQuery = relation["def.query"];
                var defType = relation["def.type"];
                var sql = 'status="fixed" and def.type="' + defType + '" and def.query="' + lib.StringUtil.escapeAllStr(defQuery) + '" and fixed.memo="' + fixedMemo + '"';
                var frelation = $("!relation").fields(["id"]).select(sql).one();
                if (frelation) {
                    relation["status"] = 'fixed';
                } else {
                    relation["fixed.memo"] = fixedMemo;
                }
            }

            return relation;
        },

        updateRelation: function(relation, file1, fieldMeta1, file2, fieldMeta2, relType, defType, defQuery) {
            // relation defined in erddef has higher priority 
            var sourceField = fieldMeta1.field;
            var targetField = fieldMeta2.field;

            // get SQL information			
            var sourceSqlTable = dbdictService.getSqlTable(sourceField["sql.field.options"], file1["sql.tables"]);
            var sourceSqlField = dbdictService.getSqlField(sourceField["sql.field.options"]);
            var targetSqlTable = dbdictService.getSqlTable(targetField["sql.field.options"], file2["sql.tables"]);
            var targetSqlField = dbdictService.getSqlField(targetField["sql.field.options"]);

            relation["source.sqltable"] = sourceSqlTable;
            relation["source.sqlfield"] = sourceSqlField;
            relation["target.sqltable"] = targetSqlTable;
            relation["target.sqlfield"] = targetSqlField;
            relation["relType"] = relType;

            if (defType == relation["def.type"] && defQuery != relation["def.query"]) {
                relation["def.query"] = defQuery;
            } else if (defType != relation["def.type"] && defType == "erddef") {
                relation["def.type"] = defType;
                relation["def.query"] = defQuery;
            }
            relation.doUpdate();
        },

        updateRelations: function() { //update relations with possible dbdict changes, also used for manual defined relation to get SQL tables and fields.
            var relations = $("relation").setOrderBy(
                ["source.file", "source.field"],
                [SCFILE_ASC, SCFILE_ASC]).select('def.type ~= "CombinedKey"').list(); //don't check CombinedKey

            var i;
            for (i = 0; i < relations.length; i++) {
                var relation = relations[i];
                var sourceFileName = relation["source.file"];
                var sourceFieldName = relation["source.field"];
                var targetFileName = relation["target.file"];
                var targetFieldName = relation["target.field"];
                var defType = relation["def.Type"];
                var defQuery = relation["def.Query"];
                var relType = relation["rel.Type"];

                var source = dbdictService.getValidDbdictWithCacheByName(sourceFileName);

                var sourceDescriptorMeta = dbdictService
                    .getDescriptorMetaWithCache(source, "field");
                var sourceFieldMeta = dbdictService.getFieldMeta(sourceFieldName,
                    sourceDescriptorMeta);

                var target = dbdictService.getValidDbdictWithCacheByName(targetFileName);
                var targetDescriptorMeta = dbdictService
                    .getDescriptorMetaWithCache(target, "field");
                var targetFieldMeta = dbdictService.getFieldMeta(targetFieldName,
                    targetDescriptorMeta);

                if (sourceFieldMeta != null && targetFieldMeta != null) {
                    var isSUKey1 = dbdictService.isSingleFieldUniqueKey(sourceFieldMeta.path, source["key"]);
                    var isSUKey2 = dbdictService.isSingleFieldUniqueKey(targetFieldMeta.path, target["key"]);

                    if ((isSUKey1) && (!isSUKey2)) {
                        relType = "A"; //one to many
                    } else if ((!isSUKey1) && (isSUKey2)) {
                        relType = "B"; //many to one
                    } else if ((isSUKey1) && (isSUKey2)) {
                        relType = "C"; //one to one
                    } else {
                        relType = "D"; //many to many
                    }

                    this.updateRelation(relation, source, sourceFieldMeta, target, targetFieldMeta, relType, defType, defQuery);
                }
            }
        },


        addOrUpdateRelation: function(file1, fieldMeta1, file2, fieldMeta2, relType,
            defType, defQuery) {
            var relation1 = this.findRelation(file1.name, fieldMeta1.path,
                file2.name, fieldMeta2.path);
            if (relation1 == null) {
                this.addRelation(file1, fieldMeta1, file2, fieldMeta2, relType, defType, defQuery);
            } else {
                this.updateRelation(relation1, file1, fieldMeta1, file2, fieldMeta2, relType, defType, defQuery);
            }
        },

        addCombinedRelation: function(file1, combinedField1, file2, combinedField2,
            Sqlfile1, combinedSqlField1, Sqlfile2, combinedSqlField2, defType, defQuery, relType) {
            var relation1 = this.findRelation(file1, combinedField1, file2, combinedField2);
            if (relation1 == null) {
                var relation = new SCFile("relation");
                relation["source.file"] = file1;
                relation["source.field"] = combinedField1;
                relation["target.file"] = file2;
                relation["target.field"] = combinedField2;
                relation["source.sqltable"] = Sqlfile1;
                relation["source.sqlfield"] = combinedSqlField1;
                relation["target.sqltable"] = Sqlfile2;
                relation["target.sqlfield"] = combinedSqlField2;
                relation["def.type"] = defType;
                relation["def.query"] = defQuery;
                relation["relType"] = relType;
                // default to false for all combinedfields for cascade.query and cascade.update
                relation["cascade.query"] = false;
                relation["cascade.update"] = false;

                relation["status"] = "new";
                relation["post.expression"] = false;
                relation["cascade.update"] = false;

                relation.doInsert();
            }
        },

        //swap relations between source and target for display purpose
        swapRelations: function(relations) {
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
        },

        // run this after build all relations between indivual fields
        buildCombinedRelations: function() {
            var hasThisTargetField = {};

            //serach unique keys for each table
            var sourceTables = this.findAllSourceFiles();

            var sourceTableName;
            for (sourceTableName in sourceTables) {
                var sourceTable = dbdictService.getValidDbdictWithCacheByName(sourceTableName);

                if (sourceTable) {
                    var combinedKeys = dbdictService.getCombinedFieldUniqueKey(sourceTable["key"]);
                    var relations = this.findRelationsBySourceTable(sourceTableName);

                    if (combinedKeys.length > 1) {
                        var targetTableName;
                        for (targetTableName in sourceTables[sourceTableName]) { // loop for target table for each source table
                            var isSameTarget = false;
                            var combinedKey = '';
                            var combinedSQLKey = '';
                            var combinedSourceSQLTable = '';
                            var combinedTargetField = '';
                            var combinedTargetSQLField = '';
                            var combinedTargetSQLTable = '';
                            var relType = 'D';

                            var i;
                            var j;

                            for (i = 0; i < combinedKeys.length; i++) {
                                if (!sourceTables[sourceTableName][targetTableName][combinedKeys[i]]) {
                                    isSameTarget = false;
                                    break;
                                } else {
                                    for (j = 0; j < relations.length; j++) {
                                        if (relations[j][2] == targetTableName && relations[j][1] == combinedKeys[i]) {
                                            if (!combinedTargetField) { //initalize 
                                                combinedKey = combinedKeys[i];
                                                combinedSQLKey = relations[j][8];
                                                combinedSourceSQLTable = relations[j][7];
                                                combinedTargetField = relations[j][3];
                                                hasThisTargetField[relations[j][3]] = 1;
                                                combinedTargetSQLField = relations[j][10];
                                                combinedTargetSQLTable = relations[j][9];
                                                break;
                                            } else if (hasThisTargetField[relations[j][3]] == 1) { //avoid duplicate
                                                break;
                                            } else {
                                                combinedKey = combinedKey + separatorChar + combinedKeys[i];
                                                combinedSQLKey = combinedSQLKey + separatorChar + relations[j][8];
                                                combinedSourceSQLTable = combinedSourceSQLTable + separatorChar + relations[j][7];
                                                combinedTargetField = combinedTargetField + separatorChar + relations[j][3];
                                                combinedTargetSQLField = combinedTargetSQLField + separatorChar + relations[j][10];
                                                combinedTargetSQLTable = combinedTargetSQLTable + separatorChar + relations[j][9];
                                                isSameTarget = true;
                                                break;
                                            }
                                        }

                                    }
                                }
                            }

                            if (isSameTarget) {
                                //check if match combinedKey of target table
                                var targetTableDbDict = dbdictService.getValidDbdictWithCacheByName(targetTableName);

                                if (targetTableDbDict == null) {
                                    break;
                                }

                                var targetCombinedKeys = dbdictService.getCombinedFieldUniqueKey(targetTableDbDict["key"]);
                                var targetFieldArray = combinedTargetField.split(separatorChar);

                                if (targetCombinedKeys.length == targetFieldArray.length) {
                                    for (i = 0; i < targetCombinedKeys.length; i++) {
                                        var matched = false;
                                        for (j = 0; j < targetFieldArray.length; j++) {
                                            if (targetCombinedKeys[i] == targetFieldArray[j]) {
                                                matched = true;
                                            }
                                        }
                                    }
                                    if (matched) {
                                        relType = 'C';
                                    } else {
                                        relType = 'A';
                                    }
                                } else {
                                    relType = 'A';
                                }

                                this.addCombinedRelation(sourceTableName,
                                    combinedKey,
                                    targetTableName,
                                    combinedTargetField,
                                    combinedSourceSQLTable,
                                    combinedSQLKey,
                                    combinedTargetSQLTable,
                                    combinedTargetSQLField,
                                    'CombinedKey',
                                    'CombinedKey',
                                    relType);
                            }

                        }

                    }
                }
            }
        },

        /**
         * Sort the array by four specific fields
         */
        sortArray: function(a, b) {
            var ac1 = a["source.file"];
            var bc1 = b["source.file"];
            var ac2 = a["source.field"];
            var bc2 = b["source.field"];
            var ac3 = a["target.file"];
            var bc3 = b["target.file"];
            var ac4 = a["target.field"];
            var bc4 = b["target.field"];

            if (ac1 != bc1) {
                return ac1 < bc1 ? -1 : 1;
            } else if (ac2 != bc2) {
                return ac2 < bc2 ? -1 : 1;
            } else if (ac3 != bc3) {
                return ac3 < bc3 ? -1 : 1;
            } else {
                return ac4 < bc4 ? -1 : 1;
            }
        },


        /* 
         * derive relations within logical file, i.e., m1. m2, a1, ai, array of character, array of structure for a given field
         */

        findInternalRelationByField: function(file, childField) {
            var relation = new SCFile("relation");
            var dbdict = dbdictService.getValidDbdictWithCacheByName(file);
            var descriptorMeta = dbdictService.getDescriptorMetaWithCache(dbdict, "field");
            var childMeta = dbdictService.getFieldMeta(childField, descriptorMeta);

            if (childMeta == null) {
                funcs.msg("The field " + childField +
                    " is not exist in dbdict " + file);
                return false;
            }

            var parentMeta = childMeta.parent;
            var parentField = parentMeta.field;

            var targetTable = '';
            var targetField = parentField;

            if (parentField["type"] == $.Array) {

                var combinedKeys = dbdictService.getCombinedFieldUniqueKey(dbdict["key"]);
                var combinedKey = '';
                var combinedSQLKey = '';
                var combinedKeySQLTable = '';

                var i;
                for (i = 0; i < combinedKeys.length; i++) {
                    var keyMeta = dbdictService.getFieldMeta(combinedKeys[i], descriptorMeta);
                    var sourceField = keyMeta.field;
                    if (!combinedKey) {
                        combinedKey = combinedKeys[i];
                        combinedKeySQLTable = dbdictService.getSqlTable(sourceField["sql.field.options"], dbdict["sql.tables"]);
                        combinedSQLKey = dbdictService.getSqlField(sourceField["sql.field.options"]);
                        break;
                    } else {
                        combinedKey = combinedKey + separatorChar + combinedKeys[i];
                        combinedKeySQLTable = combinedKeySQLTable + separatorChar + dbdictService.getSqlTable(sourceField["sql.field.options"], dbdict["sql.tables"]);
                        combinedSQLKey = combinedSQLKey + separatorChar + dbdictService.getSqlField(sourceField["sql.field.options"]);
                        break;
                    }

                }

                var combinedTargetField = combinedKey + separatorChar + childMeta.path;

                var targetSqlTable = dbdictService.getSqlTable(targetField["sql.field.options"], dbdict["sql.tables"]);

                if (!targetSqlTable) {
                    //convert it to an array table with naming convension "main_table_name_field_name"
                    targetSqlTable = file + '_' + childField;
                }

                var combinedTargetSQLField = combinedSQLKey + separatorChar + childField;

                relation["source.file"] = dbdict["name"];
                relation["source.field"] = combinedKey;
                relation["target.file"] = dbdict["name"];
                relation["target.field"] = combinedTargetField;

                relation["source.sqltable"] = combinedKeySQLTable;
                relation["source.sqlfield"] = combinedSQLKey;
                relation["target.sqltable"] = targetSqlTable;
                relation["target.sqlfield"] = combinedTargetField;
                relation["relType"] = 'A';

                // default to true for all fields for cascade.query and cascade.update
                relation["def.type"] = 'dbdict';
                relation["def.query"] = 'name="' + file + '"';

                return relation;

            } else {

                return null;
            }

        },

        buildRelation: function(file1, fieldMeta1, file2, fieldMeta2, defType,
            defQuery, hasPostExpression, relType) {
            this.addRelation(file1, fieldMeta1, file2, fieldMeta2,
                defType, defQuery, hasPostExpression, relType);
        }
    };
});

function getClass() {
    return RelationService;
}