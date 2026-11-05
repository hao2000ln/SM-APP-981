var _ = lib.Underscore.require(),
  IDOLCommon = lib.IDOLCommon.require(),
  IDOLDataCleansing = lib.IDOLDataCleansing.require(),
  _parseeval = system.functions.parse_evaluate,
  JSON = lib.JSON.json();

function toJSON(obj) {
  return JSON.stringify(obj, null, 4);
}

var logger = getLog("IDOLFieldProcessor");

var IDOLFieldProcessor = (function() {

  function IDOLFieldProcessorInternal(indexDef) {
    var tablename = indexDef['table.name'];
    this.source = new SCFile(tablename, SCFILE_READONLY);

    this.tableName = tablename;
    this.indexDef = indexDef;
    this.propertyfields = [];
    this.sourcefields = [];
    this.tagfields = {};
    this.keys = [];
    this.fields = [];

    this.refFullFields = [];
    this.refFields = [];
  }

  IDOLFieldProcessorInternal.prototype.getFileName = function() {
    return this.indexDef['table.name'];
  };

  IDOLFieldProcessorInternal.prototype.buildKeyFields = function() {
    var filename = this.getFileName();
    this.keys = IDOLCommon.getReferenceFields(filename);
    return this;
  };

  IDOLFieldProcessorInternal.prototype.buildExpiry = function() {
    var expiry = this.indexDef.expiry;
    if (expiry !== undefined && expiry !== null) {
      var now = new Date(),
        expireAt = new Date(now.getTime() + expiry * 24 * 60 * 60 * 1000); // by day
      this.tagfields.valid_time = IDOLCommon.dateformat(expireAt);
    }
    return this;
  };

  IDOLFieldProcessorInternal.prototype.buildFields = function() {
    var indexDef = this.indexDef, spec = this;
    var fields = _.compact(indexDef.fields);
    _.each(fields, function(field) {
      switch(field.type) {
        case "content":   spec.sourcefields.push(field.name);   break;
        case "security":
        case "property":  spec.propertyfields.push(field.name); break;
        case "title":     spec.titlefield = field.name;         break;
        case "timestamp": spec.timefield = field.name;          break;
        default: throw new Error("unknow field type: " + field.type);
      }
    });
    return this;
  };

  IDOLFieldProcessorInternal.prototype.buildIdolOnlyFields = function() {
    var indexDef = this.indexDef, spec = this;
    var rawIdolOnlyFields = indexDef.idolonlyfields;
    var idolFields = [];
    var idolFieldsMap = {};

    for ( var i = 0; (rawIdolOnlyFields) && (i < rawIdolOnlyFields.getSize()); i++ )
    {
      var field = rawIdolOnlyFields[i];
      var fieldname = field[0];

      if ( fieldname )
      {
        idolFields.push(fieldname);
        idolFieldsMap[fieldname] = {
          "searchjs" : field[2],
          "getvaluejs" : field[3]
        };
      }
    }

    spec.idolFields = idolFields;
    spec.idolFieldsMap = idolFieldsMap;

    return this;
  };

  IDOLFieldProcessorInternal.prototype.initialize = function() {
    this.buildKeyFields();
    this.buildFields();
    this.buildExpiry();
    this.buildIdolOnlyFields();

    var fields = _.chain([
      this.titlefield,
      this.timefield,
      this.keys,
      this.sourcefields,
      this.propertyfields
    ]).flatten().compact().uniq().value();

    this.fields = fields;

    return this;
  };

  IDOLFieldProcessorInternal.prototype.buildFieldMap = function() {
    this.fieldsMap = {};
    this.midFieldMap = {};
    this.refFullFields = [];
    this.refFields = [];

    var lng = this.fields.length;
    for (var i=0;i<lng;i++) {
      var strField = this.fields[i];
      var strMidField = "";
      var strSqlField = strField;

      if (strField.indexOf(this.tableName + ";")==0) {
        strMidField = strField.replace(/\;/g,"_");
        strSqlField = strMidField.replace(/\./g,"").replace(/\_/g,"");

        this.midFieldMap[strMidField] = strSqlField;
        this.fieldsMap[strField] = strSqlField;
      } else {
        var refFullField = lib.DisplayName.getRefFullField(strField, this.tableName);
        if (refFullField!=null) {
          this.fields.push(refFullField);

          this.refFields.push(strField);
          this.refFullFields.push(refFullField);

          strMidField = refFullField.replace(/\;/g,"_");
          strSqlField = strMidField.replace(/\./g,"").replace(/\_/g,"");

          this.midFieldMap[strMidField] = strSqlField;
          this.fieldsMap[refFullField] = strSqlField;
          this.fieldsMap[strField] = strField;
        } else {
          this.fieldsMap[strField] = strSqlField;
        }
      }
    }
  };

  IDOLFieldProcessorInternal.prototype.getFieldValue1 = function(source, fieldname) {
    var strSqlField = this.fieldsMap[fieldname];
    var lengthPosition = strSqlField.indexOf(",");
    if(lengthPosition > -1){
                  strSqlField=strSqlField.substr(lengthPosition+1);
    }
    return source[strSqlField];
  };

  IDOLFieldProcessorInternal.prototype.getFieldValue = function(fieldname) {
    return this.getFieldValue1(this.source, fieldname);
  };

  IDOLFieldProcessorInternal.prototype._iterateWithSQL = function(sql, iterator, scope) {
    var filename = this.getFileName();
    var cleansing = IDOLDataCleansing.getCleanser(filename);
    var source = this.source, rc;
    rc = source.doSelect(sql);
    while (rc === RC_SUCCESS) {
      var model = this.serializeData(cleansing);
      iterator.call(scope, model, source, this);
      rc = source.getNext();
    }
  };

  IDOLFieldProcessorInternal.prototype.iterateWithQuery = function(criteria, iterator, scope) {
    this.buildFieldMap();

    var tablename = this.getFileName(), fields = this.fields;
    if (criteria === false) {
      criteria = 'false';
    }
    criteria = criteria || 'true';
    criteria = criteria.toString();

    var sql = funcs.generate_sql_query(fields, criteria, tablename, true);
    logger.debug('Index data into IDOL with SQL: ' + sql);

    _.each(this.midFieldMap, function(value, key) {
      sql = sql.replace(key, value);
    });

    return this._iterateWithSQL(sql, iterator, scope);
  };

  function toFieldStringValue(value) {
    if (_.isNumber(value))  { return value; }
    if (_.isBoolean(value)) { return value; }
    // date object will be treat as empty, should put at first
    if (_.isDate(value))    { return IDOLCommon.dateformatEpoc(value); }
    if (_.isBlank(value))   { return ""; }
    if (_.isArray(value))   { return value.join('\n'); }
    return value;
  }

  IDOLFieldProcessorInternal.prototype.serializeData = function(cleansing) {
    var model = {}, spec = this;

    function retrieveFieldValue(fieldname) {
      var value = spec.getFieldValue(fieldname);
      return toFieldStringValue(value);
    }

    cleansing = cleansing || _.identity;
    var retrieveWithCleansing = _.compose(cleansing, retrieveFieldValue);

    model.reference = _.map(spec.keys, retrieveFieldValue).join('-');

    spec.propertyfields = _.union(spec.propertyfields, spec.keys);
    model.properties = _.reduce(spec.propertyfields, function(memo, fieldname) {
      var name = IDOLCommon.toIDOLFieldName(fieldname);
      memo[name] = retrieveFieldValue(fieldname);
      return memo;
    }, {});

    model.refProperties = _.reduce(spec.refFullFields, function(memo, fieldname, index) {
      var name = IDOLCommon.toIDOLFieldName(spec.refFields[index]);
      memo[name] = retrieveFieldValue(fieldname);
      return memo;
    }, {});
    model.refProperties[IDOLCommon.toIDOLFieldName(spec.timefield)] = retrieveFieldValue(spec.timefield);

    _.each(this.idolFields, function(idolfieldname){
      var handlerJs = spec.idolFieldsMap[idolfieldname];
      if ( handlerJs && handlerJs.getvaluejs )
      {
        vars['$hta.action.facet'] = "getFieldValue";
        vars['$hta.action.facet.key'] = _.map(spec.keys, retrieveFieldValue);

        var idolValue = _parseeval(handlerJs.getvaluejs, 2);
        model.refProperties[IDOLCommon.toIDOLFieldName(idolfieldname)] = idolValue;
      }
    });

    model.contents = _.map(spec.sourcefields, retrieveWithCleansing);
    model.title = retrieveWithCleansing(spec.titlefield);
    model.date = retrieveFieldValue(spec.timefield);
    model.tags = spec.tagfields || {};

    // TODO: where assigned this value ? 
    if (spec.mandant) {
      model.company = retrieveFieldValue(spec.mandant);
    }

    return model;
  };

  function createFieldProcessor(indexDef) {
    if (_.isString(indexDef)) {
      var tablename = indexDef;
      indexDef = new Query('idolindex', new QueryCond('table.name', EQ, tablename)
        .and(new QueryCond("feature", EQ, IDOLCommon.FEATURES.HTA)))[0];
      if (!indexDef) {
        throw new Error(tablename + ' is not a valid IDOL index specification');
      }
    }

    var spec = new IDOLFieldProcessorInternal(indexDef);
    spec.initialize();
    return spec;
  }

  return {
    create : createFieldProcessor
  };
}());

function require() {
  return IDOLFieldProcessor;
}