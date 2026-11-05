var log = lib.GatewayAPI_Logger.log("GatewayAPI_WSInterface_Add_Item");

var select = lib.GatewayAPI_RAD._select;
var SVCCATALOG_FILE = lib.GatewayAPI_Constants.JOINSVCDISPLAY_FILENAME();
var NO_RECORD_EXIT = lib.GatewayAPI_Constants.NO_RECORD_EXIT();
var NORMAL_EXIT = lib.GatewayAPI_Constants.NORMAL_EXIT();
var BAD_VALIDATION_EXIT = lib.GatewayAPI_Constants.BAD_VALIDATION_EXIT();
var setExitType = lib.GatewayAPI_Util.setExitType;
var setErrorMsg = lib.GatewayAPI_Util.setErrorMsg;
var dealCartRequest = lib.GatewayAPI_WSInterface_Update_Item.dealCartRequest;
var checkInteractionCart = lib.GatewayAPI_WSInterface_svcCart_Util.checkInteractionCart;
var getMessage = lib.GatewayAPI_Util.getMessage;
var validateOrder = lib.GatewayAPI_WSInterface_svcCart_Util.validateOrder;
var getCurrentOperator = lib.GatewayAPI_Util.getCurrentOperator;

var oper = getCurrentOperator();
var defaultCurrency = oper.display_currency_code || vars.$G_root_currency;

function addItemToCart() {
	
	var itemName = vars.$L_file["name"];
	var item = _getItemDetail(itemName);
	var cartId = vars.$L_file["cartId"];
	

	if (item == null || cartId == null) {
		setExitType(NO_RECORD_EXIT);
		return;
	}
	if (item.active == false || item.infoOnly == "false"){
		setExitType(BAD_VALIDATION_EXIT);
		setErrorMsg(getMessage(177));
		return;
	}
	if (item.infoOnly == true || item.infoOnly == "true"){
		setExitType(BAD_VALIDATION_EXIT);
		setErrorMsg(getMessage(176));
		return;
	}
	
	try {
		var cart = _getCartDetail(cartId);
		if (cart == null) {
			setExitType(NO_RECORD_EXIT);
			setErrorMsg(getMessage(108));
			return;
		}
		var interaction = _getInteractionFromCart(cart);
		checkInteractionCart(interaction, cart);
		if (item.type == "item" || item.type == "bundle" ) { 
			vars.$L_file["cartItemId"] = _addItemToCart(item,cartId,vars.$L_file);
		} else {
			setErrorMsg(getMessage(109));
			return;
		}
		
		if(interaction != null){
			dealCartRequest(cart, interaction);
		}
	}catch( ex ) {
		setExitType(BAD_VALIDATION_EXIT);
		setErrorMsg(ex);
		log.error(ex);
	}
	
}



//return cart item ID
function _addItemToCart(item,cartId,order) {
	
	if (! order) return null;	
	var cartItem = null,cartItemID = null;
	var requestedFor = order["requested.for"];
	var requestedForDept = order["requested.for.dept"];
	var requestedForType = order["requested.for.type"];
    var quantity = order["quantity"];
    var delivery = order["delivery"];
    var serviceSLA = order["serviceSLA"];
    var options = order["options"];
    var gwCartItemId= order["cartItemId"];
    
	
	/*
	 *It is possible the "incidents['contact.name'] field removed from tailoring(Especially for "support catalog"). 
	 *In this case, "request.for" won't set by SRC-UI.
	 */
	if (!requestedFor) {
		requestedFor = oper["contact.name"];
	}
	
    validateOrder(item, order);

	if (log.isDebug()) {
		log.debug("cartId:"+cartId);
		log.debug("options:"+ options);
		log.debug("requestedFor:"+requestedFor);
		log.debug("quantity:"+quantity);
		log.debug("delivery:"+delivery);
		log.debug("serviceSLA:"+serviceSLA);
	}
	
	
	//convert the options to correct currency
	var old_currency=lib.svcCatalog.getCatCurrency(item.name);	
	options = lib.GatewayAPI_RAD.fix_bundle_opts_currency(options, old_currency, defaultCurrency, false, item["option.costs"] ).getForm();
	var cartItemHandler = lib.GatewayAPI_CartItem.createCartItemHandler( item.name,cartId);
	if (item.type == "item") {
		cartItem = cartItemHandler.addItemToCart(requestedFor,quantity,options,delivery,serviceSLA,requestedForType,requestedForDept,null,defaultCurrency);
	}else{
		cartItem = cartItemHandler.addItemToCart(requestedFor,quantity,options,delivery,serviceSLA,requestedForType,requestedForDept,vars.$L_file,defaultCurrency, gwCartItemId);
	}
	if (cartItem != null){
		cartItemID = cartItem.cartItemId ;
	}
	return cartItemID;
}


function _getItemDetail(name) {

	//Default type is "normal"
	setExitType(NORMAL_EXIT);
	var itemName = name;
	
	var query = "name=\""+itemName+"\"";
	if (itemName == null || itemName == "") return null;
    var item = select(SVCCATALOG_FILE, query);
    if(item == null || item.syslanguage == null){
       query = query + " and syslanguage like \"*\"";
       item = select(SVCCATALOG_FILE, query);
      }
	return item;	
}

function _getCartDetail(cartId){
	var cartItem = select("svcCart", "cartId="+cartId);
	return cartItem;
}

function _getInteractionFromCart(cart){
	var interaction = select("incidents", "incident.id=\"" + cart.sdID + "\"");
	return interaction;
}

/*
vars.$L_file = new SCFile("svcCatAddItem");
vars.$L_file.cartId = 159;
vars.$L_file.requested_for = "Jennifer Falcon";
//add item

vars.$L_file.name = "pf test";
vars.$L_file.quantity = 1;
vars.$L_file.requested_for_type = "individual";
vars.$L_file.options = "<form><checkbox id=\"test\" label=\"test [+$10.00]\">true</checkbox></form>";

//add bundle
vars.$L_file.name = "New Application Hosting";
vars.$L_file.quantity = 2;
vars.$L_file.options = "<form><label id=\"opt1\">(1) Hardware Specification and Capacity Planning</label><label id=\"opt2\">(1) Hardware Installation and Configuration</label><label id=\"opt3\">(1) Software Installation</label><label id=\"opt4\">(1) Network Capacity and Planning</label><label id=\"opt5\">(1) Network Installation and Configuration</label><label id=\"opt6\">(1) New Mobile Employee Bundle</label></form>";

var i = 0;
vars.$L_file.option_list[i].subItemId=i;
vars.$L_file.option_list[i].subItemName="New Application Hosting";
vars.$L_file.option_list[i++].subOptions="<form><label id=\"opt1\">(1) Hardware Specification and Capacity Planning</label><label id=\"opt2\">(1) Hardware Installation and Configuration</label><label id=\"opt3\">(1) Software Installation</label><label id=\"opt4\">(1) Network Capacity and Planning</label><label id=\"opt5\">(1) Network Installation and Configuration</label><label id=\"opt6\">(1) New Mobile Employee Bundle</label></form>";
vars.$L_file.option_list[i].subItemId=i;
vars.$L_file.option_list[i].subItemName="Hardware Specification and Capacity Planning";
vars.$L_file.option_list[i++].subOptions="<form><checkbox id=\"testt\" label=\"test [+$5.00]\">true</checkbox><text id=\"number\" label=\"number\">40</text></form>";
vars.$L_file.option_list[i].subItemId=i;
vars.$L_file.option_list[i].subItemName="Hardware Installation and Configuration";
vars.$L_file.option_list[i++].subOptions="<form/>";
vars.$L_file.option_list[i].subItemId=i;
vars.$L_file.option_list[i].subItemName="Software Installation";
vars.$L_file.option_list[i++].subOptions="<form/>";
vars.$L_file.option_list[i].subItemId=i;
vars.$L_file.option_list[i].subItemName="Network Capacity and Planning";
vars.$L_file.option_list[i++].subOptions="<form/>";
vars.$L_file.option_list[i].subItemId=i;
vars.$L_file.option_list[i].subItemName="Network Installation and Configuration";
vars.$L_file.option_list[i++].subOptions="<form/>";
vars.$L_file.option_list[i].subItemId=i;
vars.$L_file.option_list[i].subItemName="New Mobile Employee Bundle";
vars.$L_file.option_list[i++].subOptions="<form><label id=\"opt1\">(1) Standard Laptop Bundle</label><label id=\"opt2\">(1) PC Backup</label><label id=\"opt3\">(1) Employee Mailbox</label><label id=\"opt4\">(1) Business Call from Home</label><label id=\"opt5\">(1) Employee Remote Access</label></form>";
vars.$L_file.option_list[i].subItemId=i;
vars.$L_file.option_list[i].subItemName="Standard Laptop Bundle";
vars.$L_file.option_list[i++].subOptions="<form><label id=\"opt1\">(1) Performance Laptop</label><label id=\"opt2\">(1) Docking Station</label><label id=\"opt3\">(1) Flat Screen Monitor</label></form>";
vars.$L_file.option_list[i].subItemId=i;
vars.$L_file.option_list[i].subItemName="Performance Laptop";
vars.$L_file.option_list[i++].subOptions="<form/>";
vars.$L_file.option_list[i].subItemId=i;
vars.$L_file.option_list[i].subItemName="Docking Station";
vars.$L_file.option_list[i++].subOptions="<form/>";
vars.$L_file.option_list[i].subItemId=i;
vars.$L_file.option_list[i].subItemName="Flat Screen Monitor";
vars.$L_file.option_list[i++].subOptions="<form><select id=\"size\" label=\"Size\" style=\"radio\">twentyone<option label=\"17 Inch\">seventeen</option><option label=\"21 Inch [+$250.00]\">twentyone</option></select></form>";
vars.$L_file.option_list[i].subItemId=i;
vars.$L_file.option_list[i].subItemName="PC Backup";
vars.$L_file.option_list[i++].subOptions="<form/>";
vars.$L_file.option_list[i].subItemId=i;
vars.$L_file.option_list[i].subItemName="Employee Mailbox";
vars.$L_file.option_list[i++].subOptions="<form/>";
vars.$L_file.option_list[i].subItemId=i;
vars.$L_file.option_list[i].subItemName="Business Call from Home";
vars.$L_file.option_list[i++].subOptions="<form/>";
vars.$L_file.option_list[i].subItemId=i;
vars.$L_file.option_list[i].subItemName="Employee Remote Access";
vars.$L_file.option_list[i++].subOptions="<form/>";
vars.$L_file.option_list[i].subItemId=i;
vars.$L_file.option_list[i].subItemName="Hardware Specification and Capacity Planning";
vars.$L_file.option_list[i++].subOptions="<form><checkbox id=\"testt\" label=\"test [+$5.00]\">true</checkbox><text id=\"number\" label=\"number\">40</text></form>";

addItemToCart();*/



