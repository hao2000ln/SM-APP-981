var log = lib.GatewayAPI_Logger.log("GatewayAPI_WSInterface_Update_Item");

var select = lib.GatewayAPI_RAD._select;
var getTotalCost = lib.GatewayAPI_RAD.svcCat_checkout_total;
var cc_set_approval = lib.GatewayAPI_RAD.cc_set_approval;
var SVCCATALOG_FILE = lib.GatewayAPI_Constants.JOINSVCDISPLAY_FILENAME();
var NO_RECORD_EXIT = lib.GatewayAPI_Constants.NO_RECORD_EXIT();
var NORMAL_EXIT = lib.GatewayAPI_Constants.NORMAL_EXIT();
var BAD_VALIDATION_EXIT = lib.GatewayAPI_Constants.BAD_VALIDATION_EXIT();
var setExitType = lib.GatewayAPI_Util.setExitType;
var setErrorMsg = lib.GatewayAPI_Util.setErrorMsg;
var getCurrentOperator = lib.GatewayAPI_Util.getCurrentOperator;
var checkInteractionCart = lib.GatewayAPI_WSInterface_svcCart_Util.checkInteractionCart;
var getMessage = lib.GatewayAPI_Util.getMessage;
var validateOrder = lib.GatewayAPI_WSInterface_svcCart_Util.validateOrder;
var getCurrentOperator = lib.GatewayAPI_Util.getCurrentOperator;

var oper = getCurrentOperator();
var defaultCurrency = oper.display_currency_code || vars.$G_root_currency;

function updateItemInCart() {
	var cartItemId = vars.$L_file["cartItemId"];
	try{
		if ( cartItemId == null ){
			setExitType(BAD_VALIDATION_EXIT);
			setErrorMsg(getMessage(110));
			return;
		}
		var cartItem = _getCartItemDetail(cartItemId);
		if ( cartItem == null ){
			setExitType(NO_RECORD_EXIT);
			setErrorMsg(getMessage(111));
			return;
		}
		var item = _getItemDetailFromCartItem(cartItem);
		vars.$L_file["name"] = item.name;
		var cart = _getCartFromCartItem(cartItem);
		vars.$L_file.cartId = cart.cartId;
		var interaction = _getInteractionFromCart(cart);
		checkInteractionCart(interaction, cart);
		if (item.type == "item" || item.type == "bundle") { 
			_updateItemInCart(item,cart, cartItemId,interaction,vars.$L_file);
		} else {
			setErrorMsg(getMessage(112));
			return;
		}
		
	}catch( ex ) {
		setExitType(BAD_VALIDATION_EXIT);
		setErrorMsg(ex);
		log.error(ex);
		return;
	}
	setExitType(NORMAL_EXIT);
	
}

function deleteItemInCart(){
	try{
		var cartItemId = vars.$L_file["cartItemId"];
		if ( cartItemId == null ){
			setExitType(BAD_VALIDATION_EXIT);
			setErrorMsg(getMessage(110));
			return;
		}
		var cartItem = _getCartItemDetail(cartItemId);
		if ( cartItem == null ){
			setExitType(BAD_VALIDATION_EXIT);
			setErrorMsg(getMessage(111));
			return;
		}
		var item = _getItemDetailFromCartItem(cartItem);

		var cart = _getCartFromCartItem(cartItem);
		
		var interaction = _getInteractionFromCart(cart);
		checkInteractionCart(interaction, cart);
	
		if (item.type == "item" || item.type == "bundle") { 
			_deleteItemInCart(item,cart, cartItemId,interaction,vars.$L_file);
		} else {
			setErrorMsg(getMessage(112));
			return;
		}
		
	}catch( ex ) {
		setExitType(BAD_VALIDATION_EXIT);
		setErrorMsg(ex);
		log.error(ex);
		return;
	}
	setExitType(NORMAL_EXIT);
}

//return cart item ID
function _updateItemInCart(item,cart,cartItemId,interaction,order) {
	
	if (! order) return null;	
	var cartItem = null,cartItemID = null;
	var requestedFor = order["requested.for"];
	var requestedForDept = order["requested.for.dept"];
	var requestedForType = order["requested.for.type"];
    var quantity = order["quantity"];
    var delivery = order["delivery"];
    var serviceSLA = order["serviceSLA"];
    var options = order["options"];
    
        
    validateOrder(item, order);
	
	
	if (log.isDebug()) {
		log.debug("cartId:"+cart.cartId);
		log.debug("options:"+ options);
		log.debug("requestedFor:"+requestedFor);
		log.debug("quantity:"+quantity);
		log.debug("delivery:"+delivery);
		log.debug("serviceSLA:"+serviceSLA);
	}
	
	//convert the options to correct currency
	var old_currency=lib.svcCatalog.getCatCurrency(item.name);	
	options = lib.GatewayAPI_RAD.fix_bundle_opts_currency(options, old_currency, defaultCurrency, false, item["option.costs"] ).getForm();
	var cartItemHandler = lib.GatewayAPI_UpdateCartItem.updateCartItemHandler( item.name, cart.cartId, cartItemId);		
	cartItemHandler.updateItemInCart(requestedFor,quantity,options,delivery,serviceSLA,requestedForType,requestedForDept,order,defaultCurrency);
	if ( interaction != null ){
		dealCartRequest(cart, interaction);
	}
	
}


//return cart item ID
function _deleteItemInCart(item,cart,cartItemId,interaction,order) {
	
	if (! order) return null;	
	
	//convert the options to correct currency
	//var old_currency=lib.svcCatalog.getCatCurrency(item.name);	
	//options = lib.GatewayAPI_RAD.fix_bundle_opts_currency(options, old_currency, defaultCurrency, false, item["option.costs"] ).getForm();
	var cartItemHandler = lib.GatewayAPI_UpdateCartItem.updateCartItemHandler( item.name, cart.cartId, cartItemId);
	cartItemHandler.deleteItemInCart();
	if ( interaction != null ){
		dealCartRequest(cart, interaction);
	}
	
}

function dealCartRequest(cart, interaction){
	var sql = "cartId=" + cart.cartId;
	cart.cost = getTotalCost(sql, 0);
	cart.doUpdate();
	
	interaction.svc_cost=cart.cost;
	
	/***QCCR1E101123, dengxin, SM933
	 this issue was caused by the fix of QCCR1E98545,it removed 
	 cc_set_approval(interaction); which will save the interaction.
	 so we need to save interaction with the calculated cost individual, otherwise the svc.cost will keep the old value.
	***/
	interaction.doUpdate();

	//QCCR1E101123, end
	
}

function _getCartItemDetail(cartItemId){
    var query = "cartItemId="+cartItemId;
	var cartItem = select("svcCartItem", query);
	return cartItem;
}
function _getItemDetailFromCartItem(cartItem) {
    var query = "id="+cartItem.svcCatalogId;
	var item = select(SVCCATALOG_FILE,query);
	if(item == null || item.syslanguage == null){
	   query = query + " and syslanguage like \"*\"";
       item = select(SVCCATALOG_FILE,query);
	}
	return item;
}

function _getInteractionFromCart(cart){
	var interaction = select("incidents", "incident.id=\"" + cart.sdID + "\"");
	return interaction;
}

function _getCartFromCartItem(cartItem){
	var cart = select("svcCart", "cartId="+cartItem.cartId);
	return cart;
}


/*vars.$L_file = new SCFile("svcCatAddItem");
//vars.$L_file.cartId = 30;
vars.$L_file.cartItemId = 144;
vars.$L_file.quantity = 3;
vars.$L_file.requested_for_type = "individual";
vars.$L_file.requested_for = "FALCON, JENNIFER";
vars.$L_file.options = "<form><text id=\"test\" label=\"test\">11</text><checkbox id=\"rr\" label=\"rr [+$15.00]\" >true</checkbox></form>";
updateItemInCart();

/*deleteItemInCart();
/*print(_getItemDetailFromCartItemId(8));
var item = _getItemDetail("simpleItem");
var cartId = 14;
var cart = select("svcCart", "cartId="+cartId);
var cartItemId = 8;
var old_currency=lib.svcCatalog.getCatCurrency(item.name);
options = lib.GatewayAPI_RAD.fix_bundle_opts_currency("<form><text id=\"test\" label=\"test\">2</text><checkbox id=\"rr\" label=\"rr [+$15.00]\" >true</checkbox></form>", old_currency, defaultCurrency, false, item["option.costs"] ).getForm();
var cartItemHandler = lib.GatewayAPI_UpdateCartItem.updateCartItemHandler( item.name, cartId, cartItemId);
cartItem = cartItemHandler.updateItemInCart(null, 2, options, null, null, "individual", null);
var sql = "cartId=" + cartId;
cart.cost = getTotalCost(sql, 0);
cart.doUpdate();
var interaction = _getInteractionFromCart(cart);
interaction.svc_cost=cart.cost;
//interaction.doUpdate();
cc_set_approval(interaction);*/