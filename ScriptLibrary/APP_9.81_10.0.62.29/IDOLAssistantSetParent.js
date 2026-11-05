var IDOL_Help = lib.IDOL_Help;

var IDOLAssistantSetParent = (function() {

  function setParent(record, assoc) {
    record["parent.incident"] = assoc.number;
    record["problem.status"] = "Pending Parent Incident";
    record["prob.mgmt.candidate"]= false;
    record["master.incident"] = null;

    funcs.cursor_field_name_set("parent.incident");
    //record.doSave();
  }

  function isValid(record) {
    return funcs.filename(record) === "probsummary" && funcs.nullsub(record['flag'], true);  
  }

  function isParent(record) {
    return record['master.incident'];
  }

  function isChild(record) {
    return !!record['parent.incident'];
  }

  function precondition(record, assoc) {
    if (!assoc) {
      return false;
    }

    var isPDEnabled = IDOL_Help.isPDEnabled("probsummary");
    return isPDEnabled && isValid(record) && isValid(assoc) && !isChild(record) && isParent(assoc);
  }

  return {
    accept : precondition,
    handle : setParent
  };
}());

function accept() {
  return IDOLAssistantSetParent.accept.apply(this, arguments);
}

function handle() {
  return IDOLAssistantSetParent.handle.apply(this, arguments);
}