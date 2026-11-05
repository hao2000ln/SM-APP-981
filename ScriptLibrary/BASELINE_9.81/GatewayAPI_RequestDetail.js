/** @fileoverview RequestDetail for Approval
 */

var NORMAL_EXIT = lib.GatewayAPI_Constants.NORMAL_EXIT();
var NO_RECORD_EXIT = lib.GatewayAPI_Constants.NO_RECORD_EXIT();
var BAD_VALIDATION_EXIT = lib.GatewayAPI_Constants.BAD_VALIDATION_EXIT();
var setExitType = lib.GatewayAPI_Util.setExitType;
var setErrorMsg = lib.GatewayAPI_Util.setErrorMsg;
var getDisplayNameByLogicalName = lib.GatewayAPI_Util.getDisplayNameByLogicalName;
var _ = lib.Underscore.require();
var toJsArray = lib.ArrayUtil.toJsArray;
var setDetailCartItems=lib.GatewayAPI_WSInterface_Interaction_Info_Custom.setDetailCartItems;
var getCurrentOperator = lib.GatewayAPI_Util.getCurrentOperator;
var lang;
var defaultLang="en";
var rate;
var convert_currency=lib.GatewayAPI_svcCatApprovals.convert_currency;
var getOperatorCurrency=lib.GatewayAPI_svcCatApprovals.getOperatorCurrency;

var log = new lib.GatewayAPI_Logger.log( 'GatewayAPI_RequestDetail' );

function getRequestDetailForApproval() {
	setExitType(NORMAL_EXIT);
	var File = lib.DBUtils.File;
    var number = vars['$L.file']['number'];
    var oper = getCurrentOperator();
    defaultCurrency = oper.display_currency_code || vars.$G_root_currency;
    var operCurrency=oper.display_currency_code;
    var sysCurrency=vars.$G_root_currency;
    if (operCurrency !=sysCurrency){
        rate = lib.GatewayAPI_Cache.getCurrencyRateCache().get(operCurrency, sysCurrency);
    } 
    lang = vars['$L.file']['foreign.id'];
    if (number == null) {
        setExitType(BAD_VALIDATION_EXIT);
        setErrorMsg(lib.GatewayAPI_Util.getMessage(138)); 
		return;
    }
    if (!lib.GatewayAPI_Security.checkRequestRights(number)) {
        setExitType(NO_RECORD_EXIT);
        return;
    }
    /*
    vars['$L.file']['affected.item'] = getDisplayNameByLogicalName(vars['$L.file']['affected.item']);
    */   
    var cartId = vars['$L.file']['svcCartId'];
    if(cartId!=null) {
           setDetailCartItems(cartId,rate,lang,number);
    }
    // build source xml by portal form configuraiton
    var srcConfig = lib.GatewayAPI_WSInterface_Interaction_Info_Custom.getSrcConfigByModule("request");
    if (srcConfig != null) {
      var currency = vars['$L.file']['cost.currency.code'];
      var currencyFieldAry = ["total.cost"];
      vars['$L.file']['reason'] = lib.GatewayAPI_WSInterface_Interaction_Info_Custom.buildXmlContentFromFile(vars.$L_file, srcConfig.fields, currencyFieldAry, currency);
    }
}


