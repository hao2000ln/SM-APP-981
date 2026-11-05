var NORMAL_EXIT = lib.ScAPI_Constants.NORMAL_EXIT();
var setExitType = lib.ScAPI_Util.setExitType;
var setErrorMsg = lib.ScAPI_Util.setErrorMsg;
var log = new lib.ScAPI_Logger.log( 'ScAPI_ExpressionEvaluate' );
function evaluate() {
	setExitType(NORMAL_EXIT);
	var expressions = vars.$L_file["expressions"];
	if (expressions) {
		for (var i=0; i<expressions.length(); i++) {
			var expression = expressions[i].expression;
			log.debug("expression:"+expression);
			var value = system.functions.parse_evaluate(expression, 2);
			expressions[i].value = ""+value;
		}
	}
}