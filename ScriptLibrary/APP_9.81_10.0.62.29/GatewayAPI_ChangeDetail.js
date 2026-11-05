/** @fileoverview ChangeDetail for Approval
 *  @author Zheng, Xiang
 *  Copy from SRC proejct and update for SM gateway by Xiong-jie MA
 */

var NORMAL_EXIT = lib.GatewayAPI_Constants.NORMAL_EXIT();
var NO_RECORD_EXIT = lib.GatewayAPI_Constants.NO_RECORD_EXIT();
var BAD_VALIDATION_EXIT = lib.GatewayAPI_Constants.BAD_VALIDATION_EXIT();
var setExitType = lib.GatewayAPI_Util.setExitType;
var setErrorMsg = lib.GatewayAPI_Util.setErrorMsg;
var getDisplayNameByLogicalName = lib.GatewayAPI_Util.getDisplayNameByLogicalName;
var _setDetailCartItems=lib.GatewayAPI_WSInterface_Interaction_Info_Custom.setDetailCartItems;
var getCurrentOperator = lib.GatewayAPI_Util.getCurrentOperator;
var _ = lib.Underscore.require();
var toJsArray = lib.ArrayUtil.toJsArray;
var getOperatorCurrency=lib.GatewayAPI_svcCatApprovals.getOperatorCurrency;
var log = new lib.GatewayAPI_Logger.log( 'GatewayAPI_ChangeDetail' );

function getChangeDetailForApproval() {
	setExitType(NORMAL_EXIT);
	//vars['$L.file']['middle']['assets'] = getDisplayNameByLogicalName( vars['$L.file']['middle']['assets'].toArray() );
	var File = lib.DBUtils.File;
    var number = vars['$L.file']['header']['number'];
    var priorityCode = vars['$L.file']['header']['priority.code'];
    if (number == null) {
        setExitType(BAD_VALIDATION_EXIT);
        setErrorMsg(lib.GatewayAPI_Util.getMessage(138)); 
		return;
    }
    if (priorityCode == null || !lib.GatewayAPI_Security.checkChangeRights(number)) {
    	setExitType(NO_RECORD_EXIT);
    	return;
    }
    /*
    // localize initial.impact
    vars['$L.file']['initial.impact'] = _getDisplayValue(vars['$L.file']['initial.impact'], '$G.init.impact', '$G.init.impact.disp');
    // localize risk.assessment
    vars['$L.file']['header']['risk.assessment'] = _getDisplayValue(vars['$L.file']['header']['risk.assessment'], '$G.impact', '$G.impact.desc');
    // use display name to display the affected service (affected.item)
    vars['$L.file']['affected.item'] = getDisplayNameByLogicalName(vars['$L.file']['affected.item']);
    */
    var rate;
    var oper = getCurrentOperator();
    defaultCurrency = oper.display_currency_code || vars.$G_root_currency;
    var operCurrency=oper.display_currency_code;
    var sysCurrency=vars.$G_root_currency;
    if (operCurrency !=sysCurrency){
        rate = lib.GatewayAPI_Cache.getCurrencyRateCache().get(operCurrency, sysCurrency);
    } 
    var lang = vars["$G.my.language"];
    var cartId = vars['$L.file']['svcCartId'];
    if(cartId!=null) {
           _setDetailCartItems(cartId,rate,lang,number);
    }
     // build source xml by portal form configuration
    var srcConfig = lib.GatewayAPI_WSInterface_Interaction_Info_Custom.getSrcConfigByModule("cm3r");
    if (srcConfig != null) {
      var currency = vars['$L.file']['cost.currency.code'];
      var currencyFieldAry = ["total.cost"];
      vars['$L.file']['middle']['misc10'] = lib.GatewayAPI_WSInterface_Interaction_Info_Custom.buildXmlContentFromFile(vars.$L_file, srcConfig.fields, currencyFieldAry, currency);
    }
}

/**
 * get display value from global list
 * @param  {String} value [description]
 * @param  {String} listVarName  the list variable name of the global list 
 * @param  {String} displayVarName  the display variable name of the global list
 * @return {String}       [description]
 */
function _getDisplayValue(value, listVarName, displayVarName){
	var localizedDisplayValue;

	if(value && vars[listVarName]){
		var gValues = toJsArray(vars[listVarName]);
		var gDisplay = toJsArray(vars[displayVarName]);
		displayValue = gDisplay[_.indexOf(gValues, value)];
		if(!displayValue) {
			displayValue = value;
		}
		localizedDisplayValue = system.functions.scmsg(displayValue, "global");
        if (localizedDisplayValue.indexOf("Could not be found")>-1){
        	localizedDisplayValue = displayValue;
        }		
	}

	return localizedDisplayValue;
}
