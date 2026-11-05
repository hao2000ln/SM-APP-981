var NORMAL_EXIT = lib.GatewayAPI_Constants.NORMAL_EXIT();
var BAD_VALIDATION_EXIT = lib.GatewayAPI_Constants.BAD_VALIDATION_EXIT();
var setExitType = lib.GatewayAPI_Util.setExitType;
var setErrorMsg = lib.GatewayAPI_Util.setErrorMsg;
var getCurrentOperator = lib.GatewayAPI_Util.getCurrentOperator;
var newId = lib.KMSearchHistory.newId;


var log = lib.GatewayAPI_Logger.log("GatewayAPI_KM_Statistic");

function createSearchHistory() {
	setExitType(BAD_VALIDATION_EXIT);
	var searchHistory = new SCFile("kmsearchhistory");
	var inFile = vars.$L_file;
	searchHistory.id = newId();
    searchHistory.query = inFile.query;
    searchHistory.hits = inFile.hits;
    if(inFile.contexttag != null)
    	searchHistory.contexttag = inFile.contexttag;
   	searchHistory.SMA = true;
    searchHistory.escalated = false;
    searchHistory.userid = system.functions.operator();
	searchHistory.doInsert();
	setExitType(NORMAL_EXIT);
}

function viewKMDoc() {
	setExitType(BAD_VALIDATION_EXIT);
	var inFile = vars.$L_file;
	lib.KMUsageHistory.viewed(inFile.kmid, "kmdocument");
	setExitType(NORMAL_EXIT);
}