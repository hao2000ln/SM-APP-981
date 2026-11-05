/** @fileoverview attachment for SRC API
*   @author He, Peng-Fei
*/

var NORMAL_EXIT = lib.GatewayAPI_Constants.NORMAL_EXIT();
var BAD_VALIDATION_EXIT = lib.GatewayAPI_Constants.BAD_VALIDATION_EXIT();
var NO_RECORD_EXIT = lib.GatewayAPI_Constants.NO_RECORD_EXIT();
var setExitType = lib.GatewayAPI_Util.setExitType;
var setErrorMsg = lib.GatewayAPI_Util.setErrorMsg;
var log = new lib.GatewayAPI_Logger.log( 'GatewayAPI_Attachment' );
var select = lib.GatewayAPI_RAD._select;
var getMessage = lib.GatewayAPI_Util.getMessage;

/**
Function for removeInteractionAttachment API
*/
function removeAttachment() {
	
	var interactionId = vars['$L.file']['topic'];
    var uid = vars['$L.file']['uid'];
    
    var interaction = select('incidents', 'incident.id="' + interactionId + '"', ['incident.id']);
    if (interaction == null){
    	setExitType(NO_RECORD_EXIT);
    	setErrorMsg(getMessage("126"));//The interaction id is not valid.
    	return;
    }
    
    var result = _deleteAttachment(interaction, uid);
    if (result == RC_NO_MORE) {
    	setExitType(NO_RECORD_EXIT);
    	setErrorMsg(getMessage("186"));//UID of attachment is not valid.
    	return
    } else if (result == RC_SUCCESS) {
    	setExitType(NORMAL_EXIT);
    	return;
    } else {
    	setExitType(BAD_VALIDATION_EXIT);
    	setErrorMsg(getMessage(185, RCtoString(result)));//"Error " + RCtoString(result) + " occurred trying to delete an attachment";
    }
}

function _deleteAttachment(interaction, uid){
	return interaction.deleteAttachment(uid)
}