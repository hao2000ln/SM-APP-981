var IDOLAssistantExecuteOO = (function() {

  function executeOO(record, target) {
    var number = target.id,
        type = funcs.filename(target),
        kmmapname = funcs.filename(record),
        kmmapsource = funcs.nullsub(vars.$kmmapsource, record);


    vars['$L.gs.smartaction.next'] = true;
    vars['$L.gs.smartaction.process'] = "kmdocument.exeooflow.new";

    vars['$L.names'] = ["$number", "$type", "$kmmapsource", "$kmmapname" ];
    vars['$L.values'] = [number,   type,    kmmapsource,    kmmapname];
  }

  function precondition(record, assoc) {
    if (!assoc) { return false; }
    
    if (system.functions.nullsub(vars['$L.mode'], "update")=="add")  { return false; }

    var ooflowlinks = new SCFile("OOFlowLinks", SCFILE_READONLY);
    // var sql = "number=\"" + assoc.id + "\" and type =\"" + funcs.filename(assoc) + "\"";
    var query = new QueryCond('number', EQ, assoc.id).and(new QueryCond('type', EQ, funcs.filename(assoc)));
    var rc = ooflowlinks.doSelect(query);

    if (rc === RC_SUCCESS) {
      var filename = funcs.filename(record);
      return vars.$G_system_info.SMOO && vars.$G_system_info.OOKM && (filename === "probsummary" || filename === "incidents");
    }
    return false;
  }

  return {
    accept : precondition,
    handle : executeOO
  };
}());


function accept() {
  return IDOLAssistantExecuteOO.accept.apply(this, arguments);
}

function handle() {
  return IDOLAssistantExecuteOO.handle.apply(this, arguments);
}