
var _ = lib.Underscore.require(),
    $ = lib.c.$,
    scmsg = funcs.scmsg,
    nullsub = funcs.nullsub,
    rtecall = funcs.rtecall;

var IDOLAssistantRelatedTo = (function() {

  function relatedType(filename, type) {
    switch(filename) {
      case "incidents":  return scmsg(136, 'us');
      case "problem":    return scmsg(137, 'us');
      case "cm3r":       return scmsg(138, 'us');
      case "ocmq":       return scmsg(139, 'us');
      case "request":    return scmsg(2774, 'us');
      case "knownerror": return scmsg(1943, 'us');
      case "rootcause":  return lib.problemManagement.getTypeString(type);
      default : return filename;
    }
  }

  function relatedTo(record, target) {
  
    var sourcefile= funcs.filename(record);
    var sourcealias = sourcefile;
    if (sourcefile === "probsummary") {
      sourcealias = "problem";
    }
    var sourceid = "";    
    var sourceObj = $("screlconfig").select('filename="' + sourcealias + '"').uniqueResult();
    
    if (sourceObj) {       
      var sourcekey = sourceObj['unique.fieldname'];
      sourceid = record[sourcekey];
    }
  
    var targetfile = funcs.filename(target);
    var targetalias = targetfile;
    if (targetfile === "probsummary") {
      targetalias = "problem";
    }
    var targetid = "";
    var targetObj = $("screlconfig").select('filename="' + targetalias + '"').uniqueResult();
    if (targetObj) {     
      var targetkey = targetObj['unique.fieldname'];
      targetid = target[targetkey];
    }  
    
    if ( !sourceid || !sourcefile || !targetid || !targetfile ) { return; }
    
    var sourcetype;
    if (sourcefile === "rootcause") {
      sourcetype = nullsub(record.isKnownError, false) ? "ke" : "pbm";
    }
    
    var targettype;
    if (targetfile === "rootcause") {
      targettype = nullsub(target.isKnownError, false) ? "ke" : "pbm";
    }
    
    var query = 'source="' + sourceid + '" and source.filename="' + sourcealias + '" and depend="' + targetid + '" and depend.filename="' + targetalias + '"';
    var relationRcd = $("screlation").select(query).uniqueResult();
    
    if (relationRcd) {
      var stype = relatedType(sourcefile, sourcetype);
      var dtype = relatedType(targetfile, targettype);
      rtecall("msg", null, scmsg("134", "us", [stype, sourceid, dtype, targetid]), 3);
      return;
    }
  

  /*
   * XXX:
   * 'screlationtype' has some invalid relation, such as
   * 
   * { 
   *   source.file : 'request', source.type : 'request',
   *   target.file : 'request', target.type : 'cm3r'
   * }
   *
   * but we cannot simply change the field value, because all these four fields are working as primary key
   * change field value will cause "Upgrade" to do new record add, because "Upgrade" cannot handle "delete/replace"
   * 
   * if change field value, duplicate relation name may appears in screlationtype;
   * So only pick required 'source.file' and 'target.file', append other condition if variable was set
   */
    vars['$L.gs.smartaction.next'] = true;
    vars['$L.gs.smartaction.process'] = "idol.related.to";

    vars['$L.names'] = ["$source", "$sourceid", "$sourcefile", "$sourceType", "$targetid", "$targetfile", "$targetType"];
    vars['$L.values'] = [record,    sourceid,    sourcefile,    sourcetype,    targetid,    targetfile,    targettype];
  }

  return {
    handle : relatedTo
  };
}());

function handle() {
  return IDOLAssistantRelatedTo.handle.apply(this, arguments);
}