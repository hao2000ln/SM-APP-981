var $ = lib.c.$;
var _ = lib.Underscore.require();
var _str = _.str;
var scmsg = system.functions.scmsg;
var msg = system.functions.msg;
var cursor_field_name_set = system.functions.cursor_field_name_set;

var SearchTaskAddlFieldsView = $({
  // constructor
  init: function init(request) {
    this._bindThreadVar(request, "$L.fileName", "fileName");
    this._bindThreadVar(request, "$L.taskCategoryName", "taskCategoryName");
    this._bindThreadVar(request, "$L.fromModule", "fromModule");

    var title = scmsg("search.title", "local:taskPlannerFieldsDef");
    request.setAttribute("$L.title", title);
    
    if (lib.security.getRights("Tailoring", "new") == "true") {
    	request.setAttribute("$L.tableAccess.new", true);
    } else {
	    request.setAttribute("$L.tableAccess.new", false);
    }
    
  },

  /**
   * @private
   */
  _bindThreadVar: function bindThreadVar(request, localVar, threadVar) {
    var thread = request.getThread();
    var attr = request.getParameter(localVar);
    if (_str.isBlank(attr)) {
      attr = thread.getAttribute(threadVar);
    } else {
      thread.setAttribute(threadVar, attr);
    }
    request.setAttribute(localVar, attr);
    return attr;
  },

  /**
   * @private
   */
  _rebindThreadVar: function bindThreadVar(request, localVar, threadVar) {
    var thread = request.getThread();
    var attr = request.getParameter(localVar);
    thread.setAttribute(threadVar, attr);
    return attr;
  },

  /**
   * validate the current input for add
   * 
   * @protected
   */
  validate: function(fileName, taskCategoryName) {
    if (fileName == null) {
      msg(scmsg("filename.required", "pdtf"), 2);
      cursor_field_name_set("$L.fileName");
      return false;
    } else {
      var tableName = "taskPlannerFieldsDef";
      var file = $(tableName).select(
              'fileName="' + fileName + '" and taskCategoryName="' + taskCategoryName + '"')
              .uniqueResult();
      if (file != null) {
        msg(scmsg("def.exists", "pdtf"), 2);
        cursor_field_name_set("$L.fileName");
        return false;
      }
    }
    return true;
  },

  view: function view(request) {
    var fileNames = $.createSCArray();
    $("taskPlannerMapping").selectAll().iterate(function(mapping) {
      var taskFileName = mapping["taskFileName"];
      fileNames.push(taskFileName);
    });
    request.setAttribute("$L.fileNames", fileNames);

    return "addlTaskFields.search";
  },

  cancel: function cancel(request) {
    // do nothing
  },

  add: function add(request) {
    var fileName = this._rebindThreadVar(request, "$L.fileName", "fileName");
    var taskCategoryName = this
            ._rebindThreadVar(request, "$L.taskCategoryName", "taskCategoryName");

    if (this.validate(fileName, taskCategoryName)) {
      // redirect to real add page
      file = new SCFile("taskPlannerFieldsDef");
      file["fileName"] = fileName;
      file["taskCategoryName"] = taskCategoryName;
      return request.redirect("#listTaskAddlFieldsView.showAdd", {
        "$L.file": file
      });
    } else {
      return this.view(request);
    }
  },

  search: function(request) {
    var fileName = this._rebindThreadVar(request, "$L.fileName", "fileName");
    var taskCategoryName = this
            ._rebindThreadVar(request, "$L.taskCategoryName", "taskCategoryName");

    var query = "true";
    if (!_str.isBlank(fileName)) {
      query = 'fileName="' + fileName + '"';
    }
    if (!_str.isBlank(taskCategoryName)) {
      query += ' and taskCategoryName like "*' + taskCategoryName + '*"';
    }
    return request.redirect("#listTaskAddlFieldsView.list", {
      "$L.query": query
    });
  }
});

function getClass() {
  return SearchTaskAddlFieldsView;
}