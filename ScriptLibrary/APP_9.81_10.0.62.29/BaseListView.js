var $ = lib.c.$;
var same = system.functions.same;
var scmsg = system.functions.scmsg;
var msg = system.functions.msg;
var copycurrent = system.functions.copycurrent;
var _filename = system.functions.filename;
var _str = system.functions.str;

var BaseListView = $(new function() {
  var _dbdictService = $("#dbdictService");

  return {
    // initialize the request parameters
    savedFile: null,
    curFile: null,
    title: null,
    count: null,
    mode: null,
    query: true,

    // used for QBE only selection
    QBEOnly: false,
    chooseFromQBEOnly: false,

    // set to true for next/previous
    isCurFileChanged: false,

    // constructor
    init: function(request) {
      this.curFile = request.getParameter("$L.file");
      this.savedFile = request.getParameter("$L.file.save");
      this.title = request.getParameter("$L.title");
      this.count = request.getParameter("$L.count");
      this.mode = request.getParameter("$L.mode");
      this.query = request.getParameter("$L.query");
      if (this.query == null) {
        this.query = true;
      }

      this.QBEOnly = request.getParameter("$L.QBEOnly");
      if (this.QBEOnly == null) {
        this.QBEOnly = false;
      }

      this.chooseFromQBEOnly = request.getParameter("$L.QBEOnly.choose");
      if (this.chooseFromQBEOnly == null) {
        this.chooseFromQBEOnly = false;
      }
    },

    /**
     * @private
     */
    _isQBEOnly: function() {
      return this.QBEOnly && (this.count > 1);
    },

    /**
     * @private
     */
    _doCurFileChange: function() {
      // set flag
      this.isCurFileChanged = true;
      // change savedFile
      this.savedFile = new SCDatum();
      copycurrent(this.savedFile, this.curFile);
      // change title
      this.title = this.getTitle();
    },

    /**
     * @private
     */
    _doNext: function(request) {
      if (this.curFile.getNext() == RC_NO_MORE) {
        this.curFile.getLast();
        print(scmsg(3, "us"));
      } else {
        this._doCurFileChange();
      }
      return this.list(request);
    },

    _doPrevious: function(request) {
      if (this.curFile.getPrev() == RC_NO_MORE) {
        this.curFile.getFirst();
        print(scmsg(2, "us"));
      } else {
        this._doCurFileChange();
      }
      return this.list(request);
    },

    /**
     * @private
     */
    _doYesNo: function(direction, request) {
      // set view variable in mb.yes.no
      request.setAttribute("$L.mb.message", scmsg(8, "us"));
      request.setAttribute("$L.mb.needCancel", true);

      // configure the button on this view
      var beanName = request.getParameter("$L.js.bean.name");
      request.setAttribute("$L.mb.yes", beanName + ".doYes");
      request.setAttribute("$L.mb.no", beanName + ".doNo");
      request.setAttribute("$L.mb.cancel", beanName + ".doCancel");

      // set request parameters for these buttons
      request.setAttribute("$L.previous.request", direction);
      return "mb.yes.no";
    },

    /**
     * @private
     */
    _getIdNames: function() {
      var fileName = this.getFileName();
      var dbdict = $(fileName).dbdict();
      var id = _dbdictService.getIdentifier(dbdict["key"]);
      var names = id["name"];
      return names;
    },

    /**
     * Get the file name
     * 
     * @protected
     * @returns file name
     */
    getFileName: function() {
      if (this.curFile != null) {
        return _filename(this.curFile);
      } else {
        return null;
      }
    },

    /**
     * Get the file name description
     * 
     * @protected
     */
    getFileNameDescription: function() {
      var desc = this.getFileName();
      var descStr = scmsg(desc, "tablename");
      if (descStr.indexOf("Could not be found") == -1) {
        desc = descStr;
      }
      return desc;
    },

    /**
     * Get the title
     * 
     * @protected
     */
    getTitle: function() {
      var title = this.getFileNameDescription();
      var names = this._getIdNames();
      if (names.length() == 1) {
        title += ":  " + this.curFile[names[0]];
      }
      return title;
    },

    /**
     * Check if the file has modified with next/previous protected
     * 
     * @protected
     * @returns True if the file is modified.
     */
    hasModified: function(request) {
      return !same(this.curFile, this.savedFile);
    },

    /**
     * Print the file is updated message
     * 
     * @protected
     */
    printUpdatedMsg: function() {
      var names = this._getIdNames();

      var msg = null;
      if (names.length() > 1) {
        msg = scmsg(6, "object", [this.getFileNameDescription()]);
      } else {
        msg = scmsg(201, "object", [this.getFileNameDescription(), this.curFile[names[0]]]);
      }
      print(msg);
    },

    /**
     * Print the file is deleted message
     * 
     * @protected
     */
    printDeletedMsg: function() {
      var names = this._getIdNames();

      var msg = null;
      if (names.length() > 1) {
        msg = scmsg(7, "object", [this.getFileNameDescription()]);
      } else {
        msg = scmsg(203, "object", [this.getFileNameDescription(), this.curFile[names[0]]]);
      }
      print(msg);
    },

    /**
     * Print the file is inserted message
     * 
     * @protected
     */
    printInsertedMsg: function() {
      var names = this._getIdNames();

      var msg = null;
      if (names.length() > 1) {
        msg = scmsg(8, "object", [this.getFileNameDescription()]);
      } else {
        msg = scmsg(200, "object", [this.getFileNameDescription(), this.curFile[names[0]]]);
      }
      print(msg);
    },

    /**
     * add the current ticket
     * 
     * @protected
     */
    add: function(request) {
      var rc = this.curFile.doInsert();
      if (rc == RC_SUCCESS) {
        this.printInsertedMsg();
        return true;
      } else {
        return false;
      }
    },

    /**
     * update the current input
     * 
     * @protected
     */
    update: function(request) {
      var rc = this.curFile.doUpdate();
      if (rc == RC_SUCCESS) {
        this.printUpdatedMsg();
        // reset the saved file
        this._doCurFileChange();
        return true;
      } else {
        return false;
      }
    },

    /**
     * validate the current input
     * 
     * @protected
     */
    validate: function(request) {
      return true;
    },

    /**
     * Get detail format
     * 
     * @protected
     */
    getDetailFormat: function(request) {
      return this.getFileName() + ".g";
    },

    /**
     * Get QBE format
     * 
     * @protected
     */
    getQBEFormat: function(request) {
      return this.getFileName() + ".qbe";
    },

    /**
     * Get the target display screen
     * 
     * @protected
     */
    getDisplayScreen: function(request) {

    },

    /**
     * render the detail form
     * 
     * @protected
     */
    renderDetail: function(request) {
    },

    /**
     * render the QBE form
     * 
     * @protected
     */
    render: function(request) {
      if (!this.QBEOnly || this.chooseFromQBEOnly || this.count == 1) {
        this.renderDetail(request);
      }
      return this.getDisplayScreen(request);
    },

    /**
     * Back to the previous screen
     * 
     * @protected
     */
    doBack: function(request) {
      // TOBE IMPLEMENTED BY SUBCLASS
    },

    back: function(request) {
      if (this.chooseFromQBEOnly) {
        this.chooseFromQBEOnly = false;
        request.setAttribute("$L.QBEOnly.choose", false);
        return this.list(request);
      } else {
        return this.doBack(request);
      }
    },

    _saveAndExit: function(request, exit) {
      var saveSuccess = false;
      if (this.validate(request)) {
        if (this.mode == "add") {
          saveSuccess = this.add(request);
        } else {
          saveSuccess = this.update(request);
        }
      }

      if (saveSuccess) {
        if (exit) {
          return this.back(request);
        } else {
          return this.list(request);
        }
      } else {
        if (this.mode == "add") {
          // re-render "add" form
          return this.showAdd(request);
        } else {
          return this.list(request);
        }
      }
    },

    save: function(request) {
      return this._saveAndExit(request, false);
    },

    ok: function(request) {
      return this._saveAndExit(request, true);
    },

    showCount: function(request) {
      var beanName = request.getParameter("$L.js.bean.name");
      request.setAttribute("$L.mb.message", scmsg("20", "us", [_str(this.count)]));
      request.setAttribute("$L.mb.ok", beanName + ".list");
      return "mb.ok";
    },

    del: function(request) {
      var beanName = request.getParameter("$L.js.bean.name");
      request.setAttribute("$L.mb.message", scmsg("181", "us"));
      request.setAttribute("$L.mb.yes", beanName + ".doDelYes");
      request.setAttribute("$L.mb.no", beanName + ".doDelNo");
      request.setAttribute("$L.mb.needCancel", false);
      return "mb.yes.no";
    },

    doDelNo: function(request) {
      return this.list(request);
    },

    doDelYes: function(request) {
      var rc = this.curFile.doDelete();
      if (rc == RC_SUCCESS) {
        this.printDeletedMsg();
        this.count--;
        if (this.count > 0) {
          var rc = this.curFile.getNext();
          if (rc != RC_SUCCESS) {
            rc = this.curFile.getPrev();
          }
          // reset the saved file
          this._doCurFileChange();
        }

        if (this.chooseFromQBEOnly) {
          return this.back(request);
        } else {
          return this.list(request);
        }
      } else {
        return this.list(request);
      }
    },

    cancel: function(request) {
      if (this.curFile != null) {
        var modified = false;
        if (this.savedFile != null) {
          modified = this.hasModified(request);
        }

        if (modified) {
          return this._doYesNo("cancel", request);
        } else {
          return this.back(request);
        }
      } else {
        return this.back(request);
      }
    },

    doYes: function(request) {
      var updateSuccess = this.update(request);
      if (updateSuccess) {
        return this.doNo(request);
      } else {
        return this.list(request);
      }
    },

    doNo: function(request) {
      var previousRequest = request.getParameter("$L.previous.request");
      if (previousRequest == "next") {
        return this._doNext(request);
      } else if (previousRequest == "previous") {
        return this._doPrevious(request);
      } else if (previousRequest == "cancel") { return this.back(request); }
    },

    doCancel: function(request) {
      return this.list(request);
    },

    chooseItemForQBEOnly: function(request) {
      if (this._isQBEOnly()) {
        this.chooseFromQBEOnly = true;
        request.setAttribute("$L.QBEOnly.choose", true);
        // The scfile has been changed to the selected file
        this._doCurFileChange();
      }
      return this.list(request);
    },

    /**
     * Show add page
     * 
     * @public
     */
    showAdd: function(request) {
      this.mode = "add";
      request.setAttribute("$L.mode", this.mode);

      request.setAttribute("$L.count", 1);
      request.setAttribute("$L.file", this.curFile);
      request.setAttribute("$L.title", this.getTitle());
      request.setAttribute("$L.format", this.getDetailFormat());
      return this.render(request);
    },

    /**
     * Show list page
     * 
     * @public
     */
    list: function(request) {
      this.mode = "browse";
      request.setAttribute("$L.mode", this.mode);
      if (this.curFile == null) {
        // initialize from query

        var fileName = this.getFileName();
        var helper = $(fileName);

        this.count = helper.count(this.query);
        this.curFile = helper.scfile;
        this.title = this.getTitle();

        this.savedFile = new SCDatum();
        copycurrent(this.savedFile, this.curFile);
      }

      if (this.count > 0) {
        // used for qbe form
        request.setAttribute("$L.count", this.count);
        request.setAttribute("$L.file", this.curFile);
        request.setAttribute("$L.title", this.title);
        request.setAttribute("$L.file.save", this.savedFile);

        var qbeOnly = this._isQBEOnly();
        var qbeForm = this.getQBEFormat(request);
        var detailForm = this.getDetailFormat(request);
        if (qbeOnly) {
          if (!this.chooseFromQBEOnly) {
            detailForm = qbeForm;
          }
        } else {
          request.setAttribute("$L.dd.qbe.format", qbeForm);
        }
        request.setAttribute("$L.format", detailForm);
        return this.render(request);
      } else {
        msg(scmsg(9, "object"), 2);
        return this.back(request);
      }
    },

    next: function(request) {
      if (this.curFile != null) {
        var modified = false;
        if (this.savedFile != null) {
          modified = this.hasModified(request);
        }

        if (modified) {
          return this._doYesNo("next", request);
        } else {
          return this._doNext(request);
        }
      }
    },

    previous: function(request) {
      if (this.curFile != null) {
        var modified = false;
        if (this.savedFile != null) {
          modified = this.hasModified(request);
        }

        if (modified) {
          return this._doYesNo("previous", request);
        } else {
          return this._doPrevious(request);
        }
      }
    }

  };
});

function getClass() {
  return BaseListView;
}