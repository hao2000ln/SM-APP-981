var NORMAL_EXIT = lib.GatewayAPI_Constants.NORMAL_EXIT();
var setExitType = lib.GatewayAPI_Util.setExitType;
var setErrorMsg = lib.GatewayAPI_Util.setErrorMsg;
var log = new lib.GatewayAPI_Logger.log( 'GatewayAPI_ExpressionEvaluate' );
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