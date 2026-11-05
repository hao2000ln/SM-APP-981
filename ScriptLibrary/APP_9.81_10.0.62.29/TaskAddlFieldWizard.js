var $ = lib.c.$;
var _ = lib.Underscore.require();
var _str = _.str;
var msg = system.functions.msg;
var scmsg = system.functions.scmsg;
var denull = system.functions.denull;
var _delete = system.functions._delete;
var _null = system.functions._null;
var cursor_field_name_set = system.functions.cursor_field_name_set;
var str = system.functions.str;

var getFields = lib.PreDefinedTaskFieldsUtil.getFields;
var getRelationQuery = lib.PreDefinedTaskFieldsUtil.getRelationQuery;
var getDescription = lib.QueryEditorParser.getDescription;
var getRelationById = lib.PreDefinedTaskFieldsUtil.getRelationById;

var msgCls = "local:taskPlannerFieldsDef";
var BaseOKOnlyWizard = lib.BaseOKOnlyWizard.getClass();
var TaskAddlFieldWizard = $(BaseOKOnlyWizard, {
  mode: "update",

  file: null,
  fieldName: null,
  queryXml: null,
  relationId: null,
  mandatory: false,
  isRecordType: false,

  // constructor
  init: function init(request) {
    this._super.apply(this, arguments);
    this.mode = request.getParameter("$L.mode");

    this.file = request.getParameter("$L.file");
    this.fieldName = request.getParameter("$L.fieldName");
    this.queryXml = request.getParameter("$L.query.xml");
    this.relationId = request.getParameter("$L.relationId");
    this.mandatory = request.getParameter("$L.mandatory") == "true";
    this.isRecordType = request.getParameter("$L.isRecordType") == "true";
  },
  /**
   * @protected
   */
  getTitle: function getTitle(request) {
    if (this.mode === 'add') {
      return scmsg("add.field.title", msgCls);
    } else {
      return scmsg("edit.field.title", msgCls);
    }
  },

  /**
   * @protected
   */
  getMainTitle: function getMainTitle(request) {
    if (this.mode === 'add') {
      return scmsg("add.field.mainTitle", msgCls);
    } else {
      return scmsg("edit.field.mainTitle", msgCls);
    }
  },

  /**
   * @protected
   */
  getPrompt: function getPrompt(request) {
    return scmsg("description", msgCls);
  },

  /**
   * @protected
   */
  getSubFormat: function getSubFormat(request) {
    return "taskPlannerFieldsDef.addField";
  },

  /**
   * @protected
   */
  setResult: function setResult(request) {
    this._super.apply(this, arguments);

    // used for auto complete
    var formatName = "wizard.js.okonly";
    var format = $("format").select('name="' + formatName + '"').uniqueResult();
    format["name"] = "wizard-" + this.getSubFormat(request);
    request.setAttribute("$L.format", format);

    var fileName = this.file["fileName"];
    request.setAttribute("$L.taskFileName", fileName);

    var restrictedFields = ["title", "category"];
    var existFields = this.file["fields"];
    for (var i = 0, iLoopTimes = existFields.length(); i < iLoopTimes; i++) {
      var existField = existFields[i];
      if (this.fieldName !== existField["name"]) {
        restrictedFields.push(existField["name"]);
      }
    }

    var fields = getFields(fileName, restrictedFields);
    var fieldValues = $.createSCArray();
    var fieldDisps = $.createSCArray();
    _.each(fields, function(field) {
      fieldValues.push(field.value);
      fieldDisps.push(field.disp);
    });

    request.setAttribute("$L.fieldNames", fieldValues);
    request.setAttribute("$L.fieldNames.local", fieldDisps);

    if (!_str.isBlank(this.relationId)) {
      var relation = getRelationById(this.relationId);
      if (relation != null) {
        request.setAttribute("$L.referredTable", relation["target.file"]);
        request.setAttribute("$L.referredField", relation["target.field"]);
      }
    } else if (!_str.isBlank(this.fieldName)) {
      var relationQuery = getRelationQuery(fileName, this.fieldName);
      var relations = $("relation").select(relationQuery).list();
      if (relations.length == 1) {
        var relation = relations[0];
        request.setAttribute("$L.relationId", relation["id"]);
        request.setAttribute("$L.referredTable", relation["target.file"]);
        request.setAttribute("$L.referredField", relation["target.field"]);
      }
    }

    if (!_str.isBlank(this.queryXml)) {
      request.setAttribute("$L.query.desc", getDescription(this.queryXml));
    }
  },

  /**
   * @protected
   */
  doWizard: function doWizard(request) {
    this._super.apply(this, arguments);

    // setup thread variable for query editor
    if (this.queryXml != null) {
      vars["$xmlString"] = this.queryXml;
    } else {
      vars["$xmlString"] = '';
    }

    return "taskAddlFieldWizard.view";
  },

  /**
   * @protected
   */
  validate: function validate(request) {
    if (_str.isBlank(this.fieldName)) {
      msg(scmsg("require.fieldName", msgCls), 3);
      cursor_field_name_set("$L.fieldName");
      return false;
    }

    if (this.isRecordType && _str.isBlank(this.relationId)) {
      msg(scmsg("require.relationId", msgCls), 3);
      cursor_field_name_set("$L.relationId");
      return false;
    }

    return true;
  },

  showWizard: function showWizard(request) {
    if (this.mode == "update" || this.mode == "delete") {
      var selectedLine = request.getParameter("$L.selectedLine");
      if (selectedLine > 0) {
        var fields = this.file["fields"];
        var updateField = fields[selectedLine - 1];
        if (!_null(updateField)) {
          if (this.mode == "update") {
            this.fieldName = updateField["name"];
            this.queryXml = updateField["queryXML"];
            this.relationId = updateField["relation.id"];
            this.mandatory = updateField["mandatory"];
            this.isRecordType = updateField["isRecordType"];
            request.setAttribute("$L.fieldName", this.fieldName);
            request.setAttribute("$L.query.xml", this.queryXml);
            request.setAttribute("$L.relationId", this.relationId);
            request.setAttribute("$L.mandatory", str(this.mandatory));
            request.setAttribute("$L.isRecordType", str(this.isRecordType));
            return this.doWizard(request);
          } else {
            this.file["fields"] = _delete(fields, selectedLine);
          }
        } else {
          msg(scmsg("1624", "us"), 2);
        }
      } else {
        msg(scmsg("1624", "us"), 2);
      }
    } else {
      return this.doWizard(request);
    }
  },

  wizard: function wizard(request) {
    request.setAttribute("$L.mandatory", "false");
    request.setAttribute("$L.isRecordType", "false");
    this.relationId = null;
    request.setAttribute("$L.relationId", this.relationId);
    this.queryXml = "";
    request.setAttribute("$L.query.xml", this.queryXml);
    return this.doWizard(request);
  },

  ok: function ok(request) {
    if (this.validate(request)) {
      this._super.apply(this, arguments);

      var updateField = null;
      this.file["fields"] = denull(this.file["fields"]);
      var fields = this.file["fields"];

      var length = fields.length();
      for (var i = 0; i < length; i++) {
        var field = fields[i];
        if (field["name"] == this.fieldName) {
          updateField = field;
          break;
        }
      }

      if (updateField != null) {
        updateField["name"] = this.fieldName;
        updateField["mandatory"] = this.mandatory;
        updateField["isRecordType"] = this.isRecordType;
        if (this.isRecordType) {
          updateField["relation.id"] = this.relationId;
          updateField["queryXML"] = this.queryXml;
        } else {
          updateField["relation.id"] = null;
          updateField["queryXML"] = null;
        }
      } else {
        fields[length]["name"] = this.fieldName;
        fields[length]["mandatory"] = this.mandatory;
        fields[length]["isRecordType"] = this.isRecordType;
        if (this.isRecordType) {
          fields[length]["relation.id"] = this.relationId;
          fields[length]["queryXML"] = this.queryXml;
        } else {
          fields[length]["relation.id"] = null;
          fields[length]["queryXML"] = null;
        }
      }
    } else {
      return this.doWizard(request);
    }
  }
});

function getClass() {
  return TaskAddlFieldWizard;
}