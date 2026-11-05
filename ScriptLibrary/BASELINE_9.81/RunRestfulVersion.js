var _ = lib.Underscore.require();

var logger = getLog('RunRestfulVersion');

function getSmartAnalyticsStatus() {
  var hasLicense = funcs.lioption("Smart Analytics");
  var isEnabled = vars.$lo_idol_enabled;
  return hasLicense ? (isEnabled ? "enabled" : "disabled") : "no license";
}

function GET(req, res) {
  var rteVersions = funcs.version();
  var isChatEnabled = lib.settings.getSettingValue("Collaboration", "smcEnabled") === 'true';
  res.send({
    "dbType": funcs.dbdict_helper("db.type"),
    "serverOs": rteVersions[0],
    "serverVersion": rteVersions[2],
    "applicationVersion": lib.AppService.getAppVersion(),
    "pdEnabled": lib.ProcessDesignerEnablement.isPDEnabled(),
    "kmEngine": lib.KMSearchInterface.getEngineName(),
    "smartAnalyticsStatus": getSmartAnalyticsStatus(),
    "chatEnabled": isChatEnabled
  });
}

function authorize() {
  return lib.security.getRights("Common Configuration", "admin") === "true";
}