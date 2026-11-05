/** @fileoverview Subscriptions - contains functions used by the SRC Subscriptions module
*   @author Beddy
*/
var NO_RECORD_EXIT = lib.GatewayAPI_Constants.NO_RECORD_EXIT();
var NORMAL_EXIT = lib.GatewayAPI_Constants.NORMAL_EXIT();
var BAD_VALIDATION_EXIT = lib.GatewayAPI_Constants.BAD_VALIDATION_EXIT();
var setExitType = lib.GatewayAPI_Util.setExitType;
var setErrorMsg = lib.GatewayAPI_Util.setErrorMsg;
var getDisplayNameByLogicalName = lib.GatewayAPI_Util.getDisplayNameByLogicalName;
var select_subscriptions = lib.GatewayAPI_RAD.select_subscriptions;
var subscription_other = lib.GatewayAPI_Constants.SUBSCRIPTION_OTHER();
var toJSON = lib.JSON2.toJSON;

function getSDSubscribedCIs(lContactName, withDisplayName)
{
    var rtn = [];
    var file = new SCFile('incidents');
    file['contact.name'] = lContactName;
    
    var CIs = select_subscriptions(file);
    if (CIs == null) // If CIs is null, then build a blank RAD array
    {
        CIs = new SCDatum();
        CIs.setType(8);
    }
    if(withDisplayName){
	    for(var i=0;i<CIs.length();i++){
	    	rtn.push( toJSON( {key: CIs[i], value: getDisplayNameByLogicalName(CIs[i])} ) );
	    }
	    rtn.push( toJSON( {key: 'others', value: subscription_other} ) );
	    return rtn;
    }else{
	    CIs.push(subscription_other);
	    return CIs;
    }
}
//print( getSDSubscribedCIs("AARON, JIM", true) ); // false

function getServiceList() // Used by WS API
{
    // Default type is "normal"
	setExitType(NORMAL_EXIT);
	
	var contactName = vars['$L.file']['contact.name'];
	
	// Contact name cannot be null
	if (contactName == null || contactName == '')
	{
	    setExitType(BAD_VALIDATION_EXIT);
	    setErrorMsg(lib.GatewayAPI_Util.getMessage(156));
	    return;
	}

	vars['$L.file']['service.list'] = getSDSubscribedCIs(contactName,true);
}