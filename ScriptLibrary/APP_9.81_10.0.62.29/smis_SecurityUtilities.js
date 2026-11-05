/*
* set global privileges for incident, etc.
*/
function setupGlobals() {
	vars.$G_pm_environment["new"] = true;
	vars.$G_pm_environment["update"] = "always";
	vars.$G_pm_environment["close"] = true;
	vars.$G_pm_environment["reopen"] = true;
	
	// below codes don't take effect, comment out
//	var tableAccess = vars.$G_pm_environment["tableAccess"];
//	tableAccess["new"] = true;
//	tableAccess["update"] = "always";
//	tableAccess["close"] = true;
//	tableAccess["reopen"] = true;
//	tableAccess["view"] = true;
	
	lib.smis_CommonLib.setTableAccessUpdate("always");
	lib.smis_CommonLib.setTableAccessClose(true);
}
