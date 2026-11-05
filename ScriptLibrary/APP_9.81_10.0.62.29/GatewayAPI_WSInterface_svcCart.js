var log = lib.GatewayAPI_Logger.log("GatewayAPI_WSInterface_svcCart");

var select = lib.GatewayAPI_RAD._select;

var SVCCATALOG_FILE = lib.GatewayAPI_Constants.JOINSVCDISPLAY_FILENAME();
var select = lib.GatewayAPI_RAD._select;
var NO_RECORD_EXIT = lib.GatewayAPI_Constants.NO_RECORD_EXIT();
var NORMAL_EXIT = lib.GatewayAPI_Constants.NORMAL_EXIT();
var BAD_VALIDATION_EXIT = lib.GatewayAPI_Constants.BAD_VALIDATION_EXIT();
var setExitType = lib.GatewayAPI_Util.setExitType;
var setErrorMsg = lib.GatewayAPI_Util.setErrorMsg;
var checkInteractionCart = lib.GatewayAPI_WSInterface_svcCart_Util.checkInteractionCart;
var getCurrentOperator = lib.GatewayAPI_Util.getCurrentOperator;
var getMsg = lib.GatewayAPI_Util.getMessage;

function getCart(){
	setExitType(NORMAL_EXIT);
	var	oper = getCurrentOperator();
	var query= "owner=\""+oper['contact.name']+"\" and (submitted~=true or null(submitted))";
	var fields=["cartId","owner","submitted"];
	var cart = select("svcCart",query,fields);
	if(cart!=null) {
	vars.$L_file['cartId']=cart['cartId'];
	vars.$L_file['owner']=cart['owner'];
	setExitType(NORMAL_EXIT);
	return;
	} else {
	setExitType(NO_RECORD_EXIT);
	return;
	}
}

function removeCart() {

	//Default type is "normal"
	setExitType(NORMAL_EXIT);
	var cartId = vars.$L_file.cartId;

	if (!cartId) {
		setExitType(NO_RECORD_EXIT);
		return;
	}
	
	var cart = select("svcCart", "cartId="+cartId);
	
	if (!cart) {
		setExitType(NO_RECORD_EXIT);
		return;
	}
	
	if (cart.sdID != null) {
		setExitType(BAD_VALIDATION_EXIT);
		setErrorMsg(getMsg(103)); 
		return;
	}
	
	
	try {
		_checkPermission(cart);
	} catch (ex) {
	 	setExitType(BAD_VALIDATION_EXIT);
		setErrorMsg(getMsg(104));
		return;
	}
	
	//get cart items
	var cartItems = select("svcCartItem","cartId = " +cartId);
	
	if (!cartItems) {
		cart.doDelete();
		return;
	}
	
	
	do{
		
		if (cartItems.doDelete() != RC_SUCCESS) {
			log.warn("Can not remove the current cart item, cart id is :" + cartId + " cart item id is : " + cartItems.cartItemId);
		}
	}while(cartItems.getNext() == RC_SUCCESS)
	
	cart.doDelete();
	
}

function _checkPermission(cart) {
	
	var interaction = null;
	
	if (cart != null && cart.sdID) {
		interaction = select("incidents", "incident.id=\""+cart.sdID+"\"");
		checkInteractionCart(interaction,cart);
	}

}

/*
vars.$L_file = new SCFile("svcCart");
vars.$L_file.cartId = 188;

removeCart();
*/