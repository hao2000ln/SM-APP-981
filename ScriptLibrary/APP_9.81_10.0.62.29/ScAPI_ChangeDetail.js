/** @fileoverview QuetoDetail - get quote detail information
*   @author Zheng, Xiang
*/

var NORMAL_EXIT = lib.ScAPI_Constants.NORMAL_EXIT();
var NO_RECORD_EXIT = lib.ScAPI_Constants.NO_RECORD_EXIT();
var BAD_VALIDATION_EXIT = lib.ScAPI_Constants.BAD_VALIDATION_EXIT();
var setExitType = lib.ScAPI_Util.setExitType;
var setErrorMsg = lib.ScAPI_Util.setErrorMsg;
var getDisplayNameByLogicalName = lib.ScAPI_Util.getDisplayNameByLogicalName;

var log = new lib.ScAPI_Logger.log( 'ScAPI_ChangeDetail' );

function getChangeDetailForApproval() {
	setExitType(NORMAL_EXIT);
	vars['$L.file']['middle']['assets'] = getDisplayNameByLogicalName( vars['$L.file']['middle']['assets'].toArray() );
	var File = lib.DBUtils.File;
    var number = vars['$L.file']['header']['number'];
    var priorityCode = vars['$L.file']['header']['priority.code'];
    if (number == null) {
        setExitType(BAD_VALIDATION_EXIT);
        setErrorMsg(lib.ScAPI_Util.getMessage(138)); 
		return;
    }
    if (priorityCode == null) {
    	setExitType(NO_RECORD_EXIT);
    	return;
    }
}