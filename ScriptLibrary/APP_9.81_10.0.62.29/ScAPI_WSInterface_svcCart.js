var log = lib.ScAPI_Logger.log("ScAPI_WSInterface_svcCart");

var select = lib.ScAPI_RAD._select;

var SVCCATALOG_FILE = lib.ScAPI_Constants.JOINSVCDISPLAY_FILENAME();
var select = lib.ScAPI_RAD._select;
var NO_RECORD_EXIT = lib.ScAPI_Constants.NO_RECORD_EXIT();
var NORMAL_EXIT = lib.ScAPI_Constants.NORMAL_EXIT();
var BAD_VALIDATION_EXIT = lib.ScAPI_Constants.BAD_VALIDATION_EXIT();
var setExitType = lib.ScAPI_Util.setExitType;
var setErrorMsg = lib.ScAPI_Util.setErrorMsg;
var checkInteractionCart = lib.ScAPI_WSInterface_svcCart_Util.checkInteractionCart;
var getCurrentOperator = lib.ScAPI_Util.getCurrentOperator;
var getMsg = lib.ScAPI_Util.getMessage;

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