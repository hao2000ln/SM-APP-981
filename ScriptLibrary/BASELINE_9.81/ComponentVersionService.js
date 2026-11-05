/**
 * get version
 * @param {string} id - component id
 * @return {Object} json object format like {"version":"1.0.0","condition":"","key":"COLOR_INDICATOR_SETTING"}
 */
function getVersion(id) {
  var ret = {};
  if (id == null || id == "") {
    return ret;
  }
  var file = new SCFile("componentversion", SCFILE_READONLY);
  var rc = file.doSelect('key="' + id +'"');
  if (rc == RC_SUCCESS) {
    return {"version": file.version,
             "condition": file.condition,
             "key": file.key};
  }
  return ret;
}