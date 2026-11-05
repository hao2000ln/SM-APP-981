var _tag = system.functions.tag;

var moduleName = "pd";

function forceObject(fileName, curFile, disabledFile) {
  var forcedobjects = new SCFile("forcedobjects");
  forcedobjects["module"] = moduleName;
  forcedobjects["filename"] = fileName;

  var tag = new Datum();
  _tag(tag, curFile);

  forcedobjects["tag"] = tag.getValue();

  if (disabledFile != null) {
    var disabledtag = new Datum();
    _tag(disabledtag, disabledFile);
    forcedobjects["disabledtag"] = disabledtag.getValue();
  }

  forcedobjects.doSave();
}

function getIconForPDMenu(des) {
  if (des == "Change Management") {
    return "icon-change-mgnt";
  } else if (des == "Configuration Management") {
    return "icon-configuration-mgnt";
  } else if (des == "Incident Management") {
    return "icon-incident-mgnt";
  } else if (des == "Knowledge Management") {
    return "icon-knowledge-mgnt";
  } else if (des == "Legacy Change Management") {
    return "icon-legacy-change-mgnt";
  } else if (des == "Legacy Incident Management") {
    return "icon-legacy-incident-mgnt";
  } else if (des == "Legacy Problem Management") {
    return "icon-legacy-problem-mgnt";
  } else if (des == "Legacy Request Management") {
    return "icon-legacy-request-mgnt";
  } else if (des == "Legacy Service Desk") {
    return "icon-legacy-service-desk";
  } else if (des == "Problem Management") {
    return "icon-problem-mgnt";
  } else if (des == "Reporting") {
    return "icon-report";
  } else if (des == "Request Management"||des == "Request Fulfillment") {
    return "icon-request-mgnt";
  } else if (des == "Service Catalog") {
    return "icon-service-catalog";
  } else if (des == "Service Desk") {
    return "icon-service-desk";
  } else if (des == "Service DeskService Level anagement") {
    return "icon-service-level-mgnt";
  } else if (des == "System Administration") {
    return "icon-system-admin";
  } else if (des == "Tailoring") {
    return "icon-tailoring";
  } else if (des == "Time Period Management") {
    return "icon-time-period-mgnt";
  } else {
    return "";
  }
}

function containPDFileSuffix(fRecord, filename) {
    if (filename == "svcCatInterface") {
        return fRecord.interface_name.indexOf("_tobe_used") >=0;
    }
    return false;
}