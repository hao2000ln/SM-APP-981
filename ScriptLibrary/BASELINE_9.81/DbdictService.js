/**
 * See {@link module:c}
 * 
 * @private
 * @method
 */
var $ = lib.c.$;

/**
 * @class DbdictService
 * @classdesc The dbdict service for handling dbdict.
 */
var DbdictService = $(new function() {
  /**
   * @private
   * @type {string}
   * @default ","
   */
  var RAD_PATH = ",";

  /**
   * Get the field related meta data.
   * 
   * @private
   */
  function _fieldMeta(field, parent, aliases, childs, path) {
    return {
      field: field,
      parent: parent,
      aliases: aliases,
      childs: childs,
      path: path
    };
  }

  /**
   * The recursive method to extract field meta
   * 
   * @private
   */
  function _extractMetas(parentMeta, aliases, childs, allFields, length, start,
          parentPath) {
    var end = length - 1;
    var parent = parentMeta.field;
    var parentLevel = parent["level"];
    var parentIndex = parent["index"];

    for (var i = start; i < length; i++) {
      var field = allFields[i];
      fieldLevel = field["level"];

      if (fieldLevel < parentLevel) {
        end = --i;
        break;
      } else if (fieldLevel == parentLevel) {
        var fieldIndex = field["index"];
        // might be alias
        if (fieldIndex == parentIndex) {
          aliases.push(field);
        } else {
          end = --i;
          break;
        }
      } else {
        var fieldAliases = new Array();
        var fieldChilds = new Array();
        var path = field["name"];
        if (!$.isEmpty(parentPath)) {
          path = parentPath + RAD_PATH + field["name"];
        }

        var fieldMeta = _fieldMeta(field, parentMeta, fieldAliases,
                fieldChilds, path);
        i = _extractMetas(fieldMeta, fieldAliases, fieldChilds, allFields,
                length, i + 1, path);
        childs.push(fieldMeta);
      }
    }

    return end;
  }

  /**
   * Find a field's meta data
   * 
   * @private
   */
  function _getFieldMeta(name, meta, byPath, primitive) {
    // skip primitive type
    if (!primitive || $.isPrimitiveType(meta.field.type)) {
      if (byPath && name == meta.path) {
        return meta;
      } else if (!byPath && name == meta.field.name) { return meta; }

      // find in aliases
      var aliases = meta.aliases;
      for (var i = 0; i < aliases.length; i++) {
        var aliasField = aliases[i];
        if (byPath) {
          var path = aliasField.name;
          var fieldPath = meta.path;
          var parentIdx = fieldPath.lastIndexOf(RAD_PATH);
          if (parentIdx > 0) {
            var parentPath = fieldPath.substring(0, parentIdx);
            path = parentPath + RAD_PATH + aliasField.name;
          }
          if (name == path) { return meta; }
        } else if (name == aliasField.name) { return meta; }
      }
    }

    // find in childs
    var childs = meta.childs;
    for (var i = 0; i < childs.length; i++) {
      var meta = _getFieldMeta(name, childs[i], byPath, primitive);
      if (meta != null) { return meta; }
    }

    return null;
  }
  
  /**
   * Get the sql column information from field
   * 
   * @private
   */
  function _getSQLColumn(field) {
    var fieldOptions = field["sql.field.options"];
    if (fieldOptions != null) {
      var sqlColumnName = fieldOptions["sql.column.name"];
      if (sqlColumnName != null && sqlColumnName != "") { return sqlColumnName; }
    }
    return null;
  }

  /** @lends DbdictService.prototype */
  return {
    /**
     * Get the field meta data tree from the dbdict fields
     * 
     * @public
     * @param {object[]}
     *          fields - The dbdict.field
     * @return The field meta data for the descriptor field
     */
    getDescriptorMeta: function(fields) {
      var descriptor = fields[0];
      var aliases = new Array();
      var childs = new Array();
      var descriptorMeta = _fieldMeta(descriptor, null, aliases, childs);
      _extractMetas(descriptorMeta, aliases, childs, fields, fields.length(),
              1, null);
      return descriptorMeta;
    },
    
    /**
     * Get the field meta which contains the SQL information for the given field meta
     * 
     * @public
     * @param fieldMeta -
     *          The field meta data
     * @return The field meta which contains the SQL information for the given field meta
     */
    getFieldMetaWithSQLInfo: function(fieldMeta) {
      var sqlFieldMeta = null;

      // check if it contains SQL information itself
      var field = fieldMeta.field;
      if (_getSQLColumn(field) != null) {
        sqlFieldMeta = fieldMeta;
      }

      // check the array of primitive type
      if (sqlFieldMeta == null) {
        if (field["type"] == $.Array && fieldMeta.childs.length > 0) {
          var childMeta = fieldMeta.childs[0];
          var childField = childMeta.field;
          if ($.isPrimitiveType(childField["type"])) {
            if (_getSQLColumn(childField) != null) {
              sqlFieldMeta = childMeta;
            }
          }
        }
      }

      // check parent
      if (sqlFieldMeta == null) {
        sqlFieldMeta = this.getFieldMetaWithSQLInfo(fieldMeta.parent);
      }

      return sqlFieldMeta;
    },

    /**
     * Get a valid dbdict.
     * 
     * @public
     * @param {string}
     *          name - The dbdict.name
     * @return The dbdict record, return null if the "root.record" is not set.
     */
    getValidDbdict: function(name) {
      var dbdict = $("dbdict").select('name="' + name + '"').uniqueResult();
      if (dbdict != null && dbdict["root.record"] != null) {
        return dbdict;
      } else {
        return null;
      }
    },

    /**
     * Get the field name from field path
     * 
     * @public
     * @param {string}
     *          path - The field path, e.g.: header,number will return number
     * @return The field name ignore the path
     */
    getFieldNameByPath: function(path) {
      var pathIdx = path.lastIndexOf(RAD_PATH);
      if (pathIdx > 0) {
        path = path.substring(pathIdx + 1);
      }
      return path;
    },

    /**
     * Get the dbdict field according to field name/path
     * 
     * @public
     * @param {string}
     *          name - The field name or path
     * @param fields -
     *          The dbdict.field
     * @param {boolean}
     *          [primitive=true] - True means only retrieve the primitive field.
     * @return The dbdict field
     */
    getFieldByName: function(name, fields, primitive) {
      if (primitive == null) {
        primitive = true;
      }
      name = this.getFieldNameByPath(name);
      for (var i = 0, iLoopTimes = fields.length(); i < iLoopTimes; i++) {
        var field = fields[i];
        if (field.name == name) {
          // skip primitive type
          if (!primitive) {
            return field;
          } else if ($.isPrimitiveType(field.type)) { return field; }

        }
      }
      return null;
    },

    /**
     * Get the field meta data according to field name/path
     * 
     * @public
     * @param {string}
     *          name - The field name or path
     * @param descriptorMeta -
     *          The descriptor meta data
     * @param {boolean}
     *          [primitive=true] - True means only retrieve the primitive field.
     * @return The field meta data
     */
    getFieldMeta: function(name, descriptorMeta, primitive) {
      if (primitive == null) {
        primitive = true;
      }
      var byPath = false;
      if (name.lastIndexOf(RAD_PATH) != -1) {
        byPath = true;
      }
      return _getFieldMeta(name, descriptorMeta, byPath, primitive);
    },

    /**
     * Check if a primitive field is stored in LOB
     * 
     * @public
     * @param fieldOptions -
     *          The dbdict.field.fieldOptions field.
     * @return {boolean} True if is a lob.
     */
    isLob: function(fieldOptions) {
      if (fieldOptions["sql.table.alias"] == null
              || fieldOptions["sql.table.alias"] == ""
              || fieldOptions["sql.rcformat"] == true) {
        return true;
      } else {
        return false;
      }
    },

    /**
     * Check if a field is stored in LOB, include array/structure field
     * 
     * @public
     * @param fieldMeta -
     *          The field meta data
     * @return {boolean} True if is a lob.
     */
    isLobField: function(fieldMeta) {
      var field = fieldMeta.field;
      var fieldOptions = field["sql.field.options"];
      if (fieldOptions != null) {
        if (this.isLob(fieldOptions)) {
          return true;
        } else {
          var parent = fieldMeta.parent;
          if (parent != null) {
            var parentField = parent.field;
            if (parentField["type"] == $.Array) {
              var parentFieldOptions = parentField["sql.field.options"];
              if (parentFieldOptions != null) { return this
                      .isLob(parentFieldOptions); }
            }
          }
        }
      }
      return false;
    },

    /**
     * Check if a field is a key
     * 
     * @public
     * @param {string}
     *          field - The field name or field path
     * @param keys -
     *          The dbdict.key
     * @return {boolean} True if is a key.
     */
    isKey: function(field, keys) {
      field = this.getFieldNameByPath(field);
      var isKey = false;
      for (var i = 0, iLoopTimes = keys.length(); i < iLoopTimes; i++) {
        var key = keys[i];
        var names = key.name;
        for (var j = 0, jLoopTimes = names.length(); j < jLoopTimes; j++) {
          var name = this.getFieldNameByPath(names[j]);
          if (name == field) {
            isKey = true;
            break;
          }
        }
        if (isKey) {
          break;
        }
      }
      return isKey;
    },

    /**
     * Get all unique keys which include keyType.Unique and keyType.NoDuplicates
     * 
     * @public
     * @param keys -
     *          The dbdict.key
     * @return All unique key definitions
     */
    getUniqueKeys: function(keys) {
      var uniqueKeys = new Array();
      for (var i = 0, iLoopTimes = keys.length(); i < iLoopTimes; i++) {
        var key = keys[i];
        var flags = key["flags"];
        if (flags == $.keyType.Unique || flags == $.keyType.NoDuplicates
                || flags == $.keyType.Primary) {
          uniqueKeys.push(key);
        }
      }
      return uniqueKeys;
    },
    
    /**
     * Get all unique keys except no null keys which include keyType.Unique and Primary
     * 
     * @public
     * @param keys -
     *          The dbdict.key
     * @return All unique key definitions
     */
    getUniqueAndPrimaryKeys: function(keys) {
      var uniqueKeys = new Array();
      for (var i = 0, iLoopTimes = keys.length(); i < iLoopTimes; i++) {
        var key = keys[i];
        var flags = key["flags"];
        if (flags == $.keyType.Unique ||  flags == $.keyType.Primary) {
          uniqueKeys.push(key);
        }
      }
      return uniqueKeys;
    },

    /**
     * Get the real primary key, the key mapped to the primary constraint in database
     * 
     * @public
     * @param keys -
     *          The dbdict.key
     * @return The real primary key
     */
    getRealPrimaryKey: function(keys) {
      var pk = null;
      for (var i = 0, iLoopTimes = keys.length(); i < iLoopTimes; i++) {
        var key = keys[i];
        var flags = key["flags"];
        if (flags == $.keyType.Primary) {
          pk = key;
          break;
        }
      }
      return pk;
    },

    /**
     * Get the first unique key which has the same meaning with RTE side
     * 
     * @public
     * @param keys -
     *          The dbdict.key
     * @return The first unique key
     */
    getFirstUniqueKey: function(keys) {
      var uniqueKey = null;
      for (var i = 0, iLoopTimes = keys.length(); i < iLoopTimes; i++) {
        var key = keys[i];
        var flags = key["flags"];
        if (flags == $.keyType.Unique) {
          uniqueKey = key;
          break;
        }
      }
      return uniqueKey;
    },

    /**
     * Check if the field is the only field of first unique key
     * 
     * @public
     * @param {string}
     *          field - The field name to be checked
     * @param key -
     *          The single key
     * @return {boolean} True if it is the only field of first unique key.
     */
    isFieldFUK: function(field, key) {
      if (key == null || field == null) { return false; }

      field = this.getFieldNameByPath(field);
      var keyNames = key.name;
      if (keyNames.length() == 1
              && field == this.getFieldNameByPath(keyNames[0])) { return true; }
      return false;
    },

    /**
     * Get the primary key which is always the first unique key
     * 
     * @public
     * @param keys -
     *          The dbdict.key
     * @return The primary key
     */
    getPrimaryKey: function(keys) {
      var uniqueKeys = this.getUniqueKeys(keys);
      var pk = null;
      for (var i = 0; i < uniqueKeys.length; i++) {
        var uniqueKey = uniqueKeys[i];
        if (uniqueKey["flags"] == $.keyType.Primary) { return uniqueKey; }

        if (pk == null) {
          pk = uniqueKey;
        } else {
          if (pk["flags"] == $.keyType.NoDuplicates
                  && uniqueKey["flags"] == $.keyType.Unique) {
            pk = uniqueKey;
          } else if (pk["flags"] == uniqueKey["flags"]
                  && pk["name"].length() > uniqueKey["name"].length()) {
            pk = uniqueKey;
          }
        }
      }
      return pk;
    },

    /**
     * Get the identifier key for a dbdict, it should be the primary key if there it is, otherwise return the first key definition
     * 
     * @public
     * @param keys -
     *          The dbdict.key
     * @return The identifier
     */
    getIdentifier: function(keys) {
      var pk = this.getPrimaryKey(keys);
      if (pk == null) {
        pk = keys[0];
      }
      return pk;
    },

    /**
     * Get the field metas for the key
     * 
     * @public
     * @param key -
     *          The dbdict.key *
     * @param descriptorMeta -
     *          The descriptor meta data
     * @return The key field meta datas
     */
    getKeyFieldMetas: function(key, descriptorMeta) {
      var fieldNames = key["name"];
      var fieldMetas = new Array();
      for (var i = 0, iLoopTimes = fieldNames.length(); i < iLoopTimes; i++) {
        var fieldName = fieldNames[i];
        var fieldMeta = this.getFieldMeta(fieldName, descriptorMeta);
        if (fieldMeta == null && fieldName.lastIndexOf(RAD_PATH) != -1) {
          fieldName = this.getFieldNameByPath(fieldName);
          fieldMeta = this.getFieldMeta(fieldName, descriptorMeta);
        }
        fieldMetas.push(fieldMeta);
      }
      return fieldMetas;
    },

    /**
     * Get the primary table which contains the primary key
     * 
     * @public
     * @param dbdict -
     *          The dbdict record
     * @return The table in dbdict["sql.tables"] which should be the primary table
     */
    getPrimaryTable: function(dbdict) {
      var tables = dbdict["sql.tables"];
      var primaryTable = null;
      if (tables.length() > 0) {
        if (tables.length() == 1) {
          primaryTable = tables[0];
        } else {
          var primaryKey = this.getPrimaryKey(dbdict["key"]);
          if (primaryKey != null) {
            var descriptorMeta = this.getDescriptorMeta(dbdict["field"]);
            var primaryFields = this.getKeyFieldMetas(primaryKey,
                    descriptorMeta);
            for (var i = 0; i < primaryFields.length; i++) {
              var primaryField = primaryFields[i].field;
              var sqlFieldOptions = primaryField["sql.field.options"];
              if (sqlFieldOptions != null) {
                var tableAlias = sqlFieldOptions["sql.table.alias"];
                if (tableAlias != null && tableAlias.length > 0) {
                  primaryTable = this.getTableByAlias(tables, tableAlias);
                  break;
                }
              }
            }
          }
          if (primaryTable == null) {
            primaryTable = tables[0];
          }
        }
      }
      return primaryTable;
    },

    /**
     * Get the query against a field name
     * 
     * @public
     * @param {string}
     *          name - The field name
     * @param value -
     *          The field value
     * @param {number}
     *          [type=2] - The field type, default to be $.Character
     * @param {boolean}
     *          [like=false] - Is it a like operation?
     * @return {string} The SM query agains the field
     */
    getFieldQuery: function(name, value, type, like) {
      var query = false;
      type = type || $.Character;
      like = like || false;
      if (type == $.Character) {
        if (like) {
          query = name + ' like "*' + value + '*"';
        } else {
          query = name + '="' + value + '"';
        }
      } else {
        query = name + '=' + value;
      }
      return query;
    },

    /**
     * Get the query against multiple fields
     * 
     * @public
     * @param record -
     *          The record of SCFile
     * @param {string[]}
     *          names - The field names
     * @param {number[]}
     *          types - The field types
     * @return {string} The SM query agains the field
     */
    getFieldsQuery: function(record, names, types) {
      var query = '';
      for (var i = 0; i < names.length; i++) {
        var name = names[i];
        var value = record[name];
        if (value != null) {
          var type = types[i];
          if (query.length == 0) {
            query = this.getFieldQuery(name, value, type);
          } else {
            query = query + ' and ' + this.getFieldQuery(name, value, type);
          }
        }
      }
      return query;
    },

    /**
     * Get the query against a field name for a SM file
     * 
     * @public
     * @param {string}
     *          fileName - The SM file name
     * @param {string}
     *          fieldName - The field name
     * @param value -
     *          The field value
     * @return {string} The SM query agains the field
     */
    getFileFieldQuery: function(fileName, fieldName, value) {
      var dbdict = this.getValidDbdict(fileName);
      var des = this.getDescriptorMeta(dbdict["field"]);
      var fieldMeta = this.getFieldMeta(fieldName, des);
      var field = fieldMeta.field;
      var fieldType = field["type"];
      return this.getFieldQuery(field["name"], value, fieldType);
    },

    /**
     * Get the array field metas in the field path
     * 
     * @public
     * @param fieldMeta -
     *          The meta data for a field
     * @return The array field metas in the field path
     */
    getParentArrayFields: function(fieldMeta) {
      var parents = new Array();
      var parentMeta = fieldMeta.parent;
      while (parentMeta != null) {
        var parent = parentMeta.field;
        if (parent["level"] == 0) { // descriptor
          break;
        }
        if (parent["type"] == $.Array) {
          parents.push(fieldMeta);
        }
        fieldMeta = parentMeta;
        parentMeta = parentMeta.parent;
      }
      return parents.reverse();
    },

    /**
     * Get the array field metas and value paths in the field path
     * 
     * @public
     * @param fieldMeta -
     *          The meta data for a field
     * @return The array field metas and value paths in the field path
     */
    getFieldValuePaths: function(fieldMeta) {
      var paths = new Array();
      var parentArrayFields = this.getParentArrayFields(fieldMeta);
      var parentArrayFieldPath = null;
      for (var i = 0; i < parentArrayFields.length; i++) {
        var parentArrayField = parentArrayFields[i];
        var arrayFieldPath = parentArrayField.path;
        var parentArray = parentArrayField.parent;
        var arrayPath = parentArray.path;
        if (parentArrayFieldPath != null) {
          if (arrayPath.length > parentArrayFieldPath.length) {
            arrayPath = arrayPath.substring(parentArrayFieldPath.length + 1);
          } else {
            arrayPath = "";
          }
        }
        var path = [arrayPath, parentArrayField];
        paths.push(path);
        parentArrayFieldPath = arrayFieldPath;
      }

      var fieldPath = fieldMeta.path;
      if (paths.length > 0) {
        var parentMeta = fieldMeta.parent;
        var parentField = parentMeta.field;
        if (parentField["type"] != $.Array) {
          var lastArrayFieldPath = "";
          if (parentArrayFieldPath != null
                  && fieldPath.length > parentArrayFieldPath.length) {
            lastArrayFieldPath = fieldPath
                    .substring(parentArrayFieldPath.length + 1);
          }
          var path = [lastArrayFieldPath, fieldMeta];
          paths.push(path);
        }
      } else {
        var path = [fieldPath, fieldMeta];
        paths.push(path);
      }
      return paths;
    },

    /**
     * Get the table record for a given alias
     * 
     * @public
     * @param tables -
     *          The dbdict.table
     * @param {string}
     *          alias - The table name alias
     * @return The table record for a given alias
     */
    getTableByAlias: function(tables, alias) {
      for (var i = 0, iLoopTimes = tables.length(); i < iLoopTimes; i++) {
        var table = tables[i];
        if (table["sql.table.alias"] == alias) { return table; }
      }
      return null;
    }
  /* #dbdictService */
  };
});

function getClass() {
  return DbdictService;
}