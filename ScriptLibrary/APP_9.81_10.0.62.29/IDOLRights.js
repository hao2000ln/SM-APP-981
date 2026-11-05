
_lioption  = system.functions.lioption;
_index     = system.functions.index;
_nullsub   = system.functions.nullsub;

function canOpenSmartTicket4ESS() {
  if (_nullsub(vars["$lo.idol.enabled"], false)==false)  return false;
  if (_nullsub(vars["$lo.idol.img.enabled"], false)==false)  return false;

  return true;
}

function canOpenHTA() {
  if (_nullsub(vars["$lo.idol.enabled"], false)==false)  return false;

  return hasIDOLRight();
}

function canOpenPH4Incident() {
  if (_nullsub(vars["$lo.idol.enabled"], false)==false)  return false;

  return hasIDOLRight();
}

function canOpenPH() {
  if (_nullsub(vars["$lo.idol.enabled"], false)==false)  return false;

  return hasIDOLRight();
}

function canOpenSmartTicket() {
  if (_nullsub(vars["$lo.idol.enabled"], false)==false)  return false;

  return hasIDOLRight();
}

function hasIDOLRight() {
  var hasRight = _lioption("Smart Analytics") && (_index("SysAdmin", vars['$lo.ucapex'])>0 || _index("idol.assistant", vars['$lo.ucapex'])>0);

  return hasRight;
}
