var $ = lib.c.$;

// date value should be either Date or String in ISO 8601 format 'YYYY-MM-DD HH:MI:SS'
var Db2Adaptor = $({
    escapeField: function(field) {
        return "\"" + field + "\"";
    },
    escapeDateValue: function(value) {
        return "TIMESTAMP('" + formatDate(value) + "')";
    }
});

var SqlserverAdaptor = $({
    escapeField: function(field) {
        return "[" + field + "]";
    },
    escapeDateValue: function(value) {
        return "CAST('" + formatDate(value) + "' as DATETIME)";
    }
});

var OracleAdaptor = $({
    escapeField: function(field) {
        return "\"" + field + "\"";
    },
    escapeDateValue: function(value) {
        return "TO_DATE('" + formatDate(value) + "', 'yyyy-mm-dd hh24:mi:ss')";
    }
});

var PostgresqlAdaptor = $({
    escapeField: function(field) {
        return "\"" + field + "\"";
    },
    escapeDateValue: function(value) {
        return "'" + formatDate(value) + "'";
    }
});

/**
 * format date to 'YYYY-MM-DD HH:MI:SS' format in UTC timezone
 */
function formatDate(date) {
    if (!(date instanceof Date)) {
        return date;
    }

    var year = date.getUTCFullYear();
    var month = ("0" + (date.getUTCMonth() + 1)).slice(-2);
    var day = ("0" + date.getUTCDate()).slice(-2);
    var hour = ("0" + date.getUTCHours()).slice(-2);
    var minute = ("0" + date.getUTCMinutes()).slice(-2);
    var second = ("0" + date.getUTCSeconds()).slice(-2);
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}

var adaptors = {
    "sqlserver": new SqlserverAdaptor(),
    "db2": new Db2Adaptor(),
    "oracle": new OracleAdaptor(),
    "postgresql": new PostgresqlAdaptor()
};

function getAdaptor(name) {
    if ($.contains(name, "sqlserver")) {
        return adaptors["sqlserver"];
    } else if ($.contains(name, "db2")) {
        return adaptors["db2"];
    } else if ($.contains(name, "postgresql")) {
        return adaptors["postgresql"];
    } else {
        return adaptors["oracle"];
    }
}

var DataService = $(new function() {
    var dbdictService = $("#dbdictService");

    return {
        escapeField: function(dbdict, field) {
            var dbType = dbdict["sql.tables"][0]["sql.db.type"];

            var adaptor = getAdaptor(dbType);
            return adaptor.escapeField(field);
        },

        updateWithoutTrigger: function(file) {
            var ret;
            var result = true;
            funcs.rtecall("trigger", ret, 0);
            try {
                file.doSave();
            } catch (e) {
                print(e);
                result = false;
            }
            funcs.rtecall("trigger", ret, 1);
            return result;
        },

        getUpdateSql: function(fileName, fieldPath, newValue, oldValue) {
            var dbdict = $(fileName).dbdict();
            var dbType = dbdict["sql.tables"][0]["sql.db.type"];
            var adaptor = getAdaptor(dbType);

            var descriptorMeta = dbdictService.getDescriptorMeta(dbdict["field"]);
            var fieldMeta = dbdictService.getFieldMeta(fieldPath, descriptorMeta);
            var field = fieldMeta.field;
            var fieldType = field["type"];

            var sqlFieldName = field["sql.field.options"]["sql.column.name"];
            if (sqlFieldName == null) {
                return null;
            }

            var tableAlias = field["sql.field.options"]["sql.table.alias"];
            var table = dbdictService.getTableByAlias(dbdict["sql.tables"],
                tableAlias);

            var sql = "update " + adaptor.escapeField(table["sql.table.name"]) + " set " + adaptor.escapeField(sqlFieldName) + " = ";
            if (fieldType == $.Character) {
                sql += "'" + newValue + "'";
            } else {
                sql += newValue;
            }

            var whereCond = "";

            if (oldValue === undefined) {
                whereCond = "";
            } else {
                whereCond = " where ";
                if (oldValue == null) {
                    whereCond += adaptor.escapeField(sqlFieldName) + " is null";
                } else {
                    whereCond += adaptor.escapeField(sqlFieldName) + " = ";
                    if (fieldType == $.Character) {
                        whereCond += "'" + oldValue + "'";
                    } else {
                        whereCond += oldValue;
                    }
                }
            }

            sql += whereCond;
            return sql;
        },

        executeSQL: function(statement) {
            try {
                $.callrad("SQLexecute", {
                    "values": [statement, "commit"]
                });
                return true;
            } catch (e) {
                return false;
            }
        }
    };

});

function getClass() {
    return DataService;
}