var NORMAL_EXIT = lib.GatewayAPI_Constants.NORMAL_EXIT();
var BAD_VALIDATION_EXIT = lib.GatewayAPI_Constants.BAD_VALIDATION_EXIT();
var setExitType = lib.GatewayAPI_Util.setExitType;
var setErrorMsg = lib.GatewayAPI_Util.setErrorMsg;
var getCurrentOperator = lib.GatewayAPI_Util.getCurrentOperator;
var se_call_process = lib.GatewayAPI_RAD.se_call_process;

var log = lib.GatewayAPI_Logger.log("GatewayAPI_KM_Feedback");

/**
 * SRC API for create a feedback to a Kownledge.
 */
function createKMFeedback() {
	setExitType(BAD_VALIDATION_EXIT);
	var file = vars.$L_file;
	var callRtn = new SCDatum;
	var nextNumber = new SCDatum;
	system.functions.rtecall("getnumber", callRtn, nextNumber, "kmfeedback");
	var strID = nextNumber.getText();
	if (!isNaN(strID))
	{
		var obj   = new SCFile('Object');
		obj.doSelect('file.name="kmfeedback"');
		var env   = new SCFile('smenv');
		env = vars['$G.sm.environment'];
		
		var feedback = new SCFile("kmfeedback");
		feedback['id'] = parseInt(strID);
		feedback['useful'] = file['useful'];
		feedback['feedbacktext'] = file['feedbacktext'];
		feedback['kmdocumentid'] = file['kmdocumentid'];
		feedback['author'] = file['author'];
		
		if (!feedback['author']) {
			var operator = getCurrentOperator();
			feedback['author'] = operator['name'];
		}
		
		var initNames  = ['$L.mode','$L.format'];
		var initValues = ['add',"feedback"];
		se_call_process(feedback,"kmfeedback.savengo",true,false, null, feedback, feedback, [obj,null,null], initNames, initValues);
		setExitType(NORMAL_EXIT);
	}
}