var $ = lib.c.$;
var _ = lib.Underscore.require();
var _str = _.str;
var copycurrent = system.functions.copycurrent;
var msg = system.functions.msg;
var scmsg = system.functions.scmsg;
var _null = system.functions._null;
var cursor_field_name_set = system.functions.cursor_field_name_set;

var getCaption = lib.PreDefinedTaskFieldsUtil.getCaption;
var getDescription = lib.QueryEditorParser.getDescription;
var getRelationById = lib.PreDefinedTaskFieldsUtil.getRelationById;
var getTaskCategoryFileName = lib.PreDefinedTaskFieldsUtil.getTaskCategoryFileName;

function setAddlFieldList(file, fieldNames, isMandatories, isRecordTypes, referredTables,
        referredFields, referredQueries) {
  var taskFileName = file["fileName"];
  var datadict = $("datadict").select('name="' + taskFileName + '"').uniqueResult();

  var fields = file["fields"];
  for (var i = 0, iLoopTimes = fields.length(); i < iLoopTimes; i++) {
    var field = fields[i];
    if (!_null(field)) {
      var caption = field["name"];
      if (datadict != null) {
        caption = getCaption(caption, datadict["fields"], datadict["captions"]);
      }
      fieldNames.push(caption);

      if (field["mandatory"] == true) {
        isMandatories.push(scmsg("yes", "pdtf"));
      } else {
        isMandatories.push(scmsg("no", "pdtf"));
      }

      if (field["isRecordType"] == true) {
        isRecordTypes.push(scmsg("yes", "pdtf"));
      } else {
        isRecordTypes.push(scmsg("no", "pdtf"));
      }

      var queryXml = field["queryXML"];
      var queryDesc = "";
      if (!_str.isBlank(queryXml)) {
        queryDesc = getDescription(queryXml);
      }
      referredQueries.push(queryDesc);

      var referredTable = "";
      var referredField = "";
      var relationId = field["relation.id"];
      if (relationId != null && relationId != 0) {
        var relation = getRelationById(relationId);
        if (relation != null) {
          referredTable = relation["target.file"];
          referredField = relation["target.field"];
        }
      }
      referredTables.push(referredTable);
      referredFields.push(referredField);
    }
  }
}

var ListTaskAddlFieldsView = $(lib.BaseListView.getClass(), {
  fileName: null,
  taskCategoryName: null,

  // constructor
  init: function(request) {
    this._super.apply(this, arguments);
    // passed from search view
    var thread = request.getThread();
    this.fileName = thread.getAttribute("fileName");
    this.taskCategoryName = thread.getAttribute("taskCategoryName");
  },

  /**
   * @protected
   */
  getFileName: function() {
    return "taskPlannerFieldsDef";
  },

  /**
   * @protected
   */
  getQBEFormat: function(request) {
    return "taskPlannerFieldsDef.qbe";
  },

  /**
   * @protected
   */
  getDetailFormat: function(request) {
    return "taskPlannerFieldsDef.list";
  },

  /**
   * @protected
   */
  getDisplayScreen: function(request) {
    return "addlTaskFields.list";
  },

  /**
   * @protected
   */
  doBack: function(request) {
    return request.redirect("#searchTaskAddlFieldsView.view", {});
  },

  /**
   * @protected
   */
  validate: function(request) {
    if (!_str.isBlank(this.curFile["taskCategoryName"])) {
      var taskCategoryFile = getTaskCategoryFileName(this.curFile["fileName"]);
      var category = $(taskCategoryFile).select('name="' + this.curFile["taskCategoryName"] + '"')
              .uniqueResult();
      if (category == null) {
        msg(scmsg("taskCategoryName.vallidate", "pdtf"), 2);
        cursor_field_name_set("taskCategoryName");
        return false;
      }
    }
    return true;
  },

  /**
   * render the detail form
   */
  renderDetail: function(request) {
    var fieldNames = $.createSCArray();
    var isRecordTypes = $.createSCArray();
    var isMandatories = $.createSCArray();
    var referredTables = $.createSCArray();
    var referredFields = $.createSCArray();
    var referredQueries = $.createSCArray();

    setAddlFieldList(this.curFile, fieldNames, isMandatories, isRecordTypes, referredTables,
            referredFields, referredQueries);
    request.setAttribute("$L.fieldNames", fieldNames);
    request.setAttribute("$L.isMandatories", isMandatories);
    request.setAttribute("$L.isRecordTypes", isRecordTypes);
    request.setAttribute("$L.referredTables", referredTables);
    request.setAttribute("$L.referredFields", referredFields);
    request.setAttribute("$L.referredQueries", referredQueries);
    
    if (this.mode != "add" && lib.security.getRights("Tailoring", "update") == "always") {
    	request.setAttribute("$L.tableAccess.update", true);
    } else {
	    request.setAttribute("$L.tableAccess.update", false);
    }
    
    if (this.mode == "add" && lib.security.getRights("Tailoring", "new") == "true") {
    	request.setAttribute("$L.tableAccess.new", true);
    } else {
	    request.setAttribute("$L.tableAccess.new", false);
    }
    
    if (lib.security.getRights("Tailoring", "delete") == "always") {
    	request.setAttribute("$L.tableAccess.delete", true);
    } else {
	    request.setAttribute("$L.tableAccess.delete", false);
    }

  }
});

function getClass() {
  return ListTaskAddlFieldsView;
}