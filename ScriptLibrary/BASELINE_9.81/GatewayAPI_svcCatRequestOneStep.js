var select = lib.GatewayAPI_RAD._select;
var fun = system.functions;
var _getItemDetail=lib.GatewayAPI_WSInterface_Add_Item._getItemDetail;
var _getCartDetail=lib.GatewayAPI_WSInterface_Add_Item._getCartDetail;
var _addItemToCart=lib.GatewayAPI_WSInterface_Add_Item._addItemToCart;
var dealCartRequest = lib.GatewayAPI_WSInterface_Update_Item.dealCartRequest;
var checkInteractionCart = lib.GatewayAPI_WSInterface_svcCart_Util.checkInteractionCart;
var checkPermission=lib.GatewayAPI_WSInterface_svcCart_Util.checkPermission;
var _getInteractionFromCart = lib.GatewayAPI_WSInterface_Add_Item._getInteractionFromCart;
var _createRequest = lib.GatewayAPI_svcCatRequest.createRequest;  
var _createCartRequest = lib.GatewayAPI_svcCatRequest.createCartRequest;
var BAD_VALIDATION_EXIT = lib.GatewayAPI_Constants.BAD_VALIDATION_EXIT();
var NO_RECORD_EXIT = lib.GatewayAPI_Constants.NO_RECORD_EXIT();
var NORMAL_EXIT = lib.GatewayAPI_Constants.NORMAL_EXIT();
var setExitType = lib.GatewayAPI_Util.setExitType;
var setErrorMsg = lib.GatewayAPI_Util.setErrorMsg;
var getMessage = lib.GatewayAPI_Util.getMessage;
var log = lib.GatewayAPI_Logger.log("GatewayAPI_svcCatRequestOneStep");
var _resubmitRequest=lib.GatewayAPI_svcCatRequest.resubmitRequest;
var _getItemDetailFromCartItem=lib.GatewayAPI_WSInterface_Update_Item._getItemDetailFromCartItem;
var _deleteItemInCart=lib.GatewayAPI_WSInterface_Update_Item._deleteItemInCart;
var getCurrentOperator=lib.GatewayAPI_Util.getCurrentOperator;
var _checkCanResubmit=lib.GatewayAPI_WSInterface_Interaction_Info._checkCanResubmit;
var NO_AUTH_EXIT= lib.GatewayAPI_Constants.NO_AUTH();
var _changeUserSession=lib.GatewayAPI_Util.changeUserSession;
var validateOrder = lib.GatewayAPI_WSInterface_svcCart_Util.validateOrder;

function createInteractionOneStep(){
var startDate = new Date();
var ROBUser=vars.$L_file.operator;
cart = _createCart();

if(cart['cartId'] && _addItemsToCart(cart)){
  	vars.$L_file["cartId"] = cart['cartId'];
  	_createRequestViaOneStep(cart,ROBUser);
  }
  
  log.debug("createInteractionOneStep Total time cost: "+(new Date().getTime() -startDate.getTime()));

}

function resubmitInteractionOneStep(){
  var sdID =vars.$L_file["incident.id"]; 
  if(sdID == null) {
		setExitType(NO_RECORD_EXIT);
	    setErrorMsg(getMessage(138));
		return;
  }
  var interaction = select("incidents", "incident.id=\"" + sdID + "\"");
  if(interaction == null) {
		setExitType(NO_RECORD_EXIT);
		return;
  }
 
  var cart = select("svcCart", "sdID=\"" + sdID + "\"");
  if (cart == null) {
	   setExitType(NO_RECORD_EXIT);
	   setErrorMsg(getMessage(108));
	   return false;
   }
  
  if(interaction['bRequestOnBehalf']==true){
    var canResubmitROB=_checkCanResubmit(interaction,getCurrentOperator().name);
    if(canResubmitROB==false){
       setExitType(NO_AUTH_EXIT);
	   setErrorMsg(getMessage(113));
	   return;
    } 
  }
  
  vars.$L_file["cartId"]=cart.cartId;
  if(cart.cartId!=null){
    if (_dealItemsToCart(cart,interaction)){
      _resubmitRequest();
      vars.$L_file["bundleSubItems"]=null;
      vars.$L_file["cartItems"]=null;
    } 
  } 
}

// Add, update or delete cart items according by resubmit request
function _dealItemsToCart(cart, interaction) {
  var oInfo = vars.$L_file;
  var cartId = cart["cartId"];
  var cartItemsList = oInfo["cartItems"];
  if (vars.$L_file.bRequestOnBehalf == true){
    // change user context
    var oriOperator = getCurrentOperator().name;
    if (vars.$L_file.operator != null) {
      var requestOnBehalf = vars.$L_file.operator;
      if (oriOperator != requestOnBehalf) {
        _changeUserSession(requestOnBehalf);
      }
    }
    var newOper = getCurrentOperator().name;
  }
  try {
    checkInteractionCart(interaction, cart);
  } catch (ex) {
    setExitType(BAD_VALIDATION_EXIT);
    setErrorMsg(ex);
    log.error(ex);
    if (vars.$L_file.bRequestOnBehalf == true && newOper != oriOperator) {
      _changeUserSession(oriOperator);
    }
    return false;
  }
  // Cart item ids contained in resubmit request
  var submittedCartItemIds = [];
  var changed = false;
  for (var i = 0; i < cartItemsList.length(); i++) {
    var cartItem = cartItemsList[i];
    var itemName = cartItem.name;
    var toUpdate = cartItem["to.update"];
    var cartItemId = cartItem.cartItemId;
    if (cartItemId != null) {
      submittedCartItemIds.push(cartItemId);
    }
    if (cartItemId == null || toUpdate == true) {
      // If cartItemId is null, that means it is new cart item
      // If toUpdate is true, that means this cart item should be updated.
      var item = _getItemDetail(itemName);
      if (item == null ) {
        setExitType(NO_RECORD_EXIT);
        setErrorMsg(getMessage(109));
        if (vars.$L_file.bRequestOnBehalf == true && newOper != oriOperator) {
          _changeUserSession(oriOperator);
        }
        return false;
      }
      try {
        if (item.type == "item" || item.type == "bundle" ) {
          if (cartItemId == null) {
            if (item.active == false || item.active == "false") {
              setExitType(BAD_VALIDATION_EXIT);
              setErrorMsg(getMessage(177));
              if (vars.$L_file.bRequestOnBehalf == true && newOper != oriOperator) {
                _changeUserSession(oriOperator);
              }
              return false;
            }
            if (item.infoOnly == true || item.infoOnly == "true") {
              setExitType(BAD_VALIDATION_EXIT);
              setErrorMsg(getMessage(176));
              if (vars.$L_file.bRequestOnBehalf == true && newOper != oriOperator) {
                _changeUserSession(oriOperator);
              }
              return false;
            }
            var cartItemIdtemp = _addItemToCart(item, cartId, cartItem);
            cartItem["cartItemId"] = system.functions.parse(cartItemIdtemp, 1);
            submittedCartItemIds.push(cartItemIdtemp);
          } else {
            _updateItemInCart(item, cart, cartItemId, interaction, cartItem);
          }
          changed = true;
        } else {
           setErrorMsg(getMessage(109));
           if (vars.$L_file.bRequestOnBehalf == true && newOper != oriOperator) {
             _changeUserSession(oriOperator);
           }
           return false;
        }
      } catch (ex) {
        setExitType(BAD_VALIDATION_EXIT);
        setErrorMsg(ex);
        log.error(ex);
        if (vars.$L_file.bRequestOnBehalf == true && newOper != oriOperator) {
          _changeUserSession(oriOperator);
        }
        return false;
      }
    }
  }
  var flag = _deleteMissingCartItems(cart, interaction, submittedCartItemIds);
  if (interaction != null && (changed || flag)) {
    dealCartRequest(cart, interaction);
  }
  if (vars.$L_file.bRequestOnBehalf == true && newOper != oriOperator) {
    _changeUserSession(oriOperator);
  }
  return true;
}

function _deleteMissingCartItems(cart, interaction, validCartItemIds) {
  var fields = ['cartItemId', 'svcCatalogId'];
  var svcCartItem = select("svcCartItem", "cartId=" + cart.cartId, fields);
  if (svcCartItem == null){
    return false;
  }
  var changed = false;
  do {
    var cartItemId = svcCartItem.cartItemId;
    if (funcs.index(cartItemId, validCartItemIds) < 1) {
      var item = _getItemDetailFromCartItem(svcCartItem);
      log.info("Delete cart item " + cartItemId);
      var cartItemHandler = lib.GatewayAPI_UpdateCartItem.updateCartItemHandler( item.name, cart.cartId, cartItemId);
      cartItemHandler.deleteItemInCart();
      changed = true;
    }
    rc = svcCartItem.getNext();
  } while (rc == RC_SUCCESS);
  return changed;
}

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
    //convert the options to correct currency
    var old_currency=lib.svcCatalog.getCatCurrency(item.name);
    var oper = getCurrentOperator();
    var defaultCurrency = oper.display_currency_code || vars.$G_root_currency;
    options = lib.GatewayAPI_RAD.fix_bundle_opts_currency(options, old_currency, defaultCurrency, false, item["option.costs"] ).getForm();
    var cartItemHandler = lib.GatewayAPI_UpdateCartItem.updateCartItemHandler( item.name, cart.cartId, cartItemId);
    cartItemHandler.updateItemInCart(requestedFor,quantity,options,delivery,serviceSLA,requestedForType,requestedForDept,order,defaultCurrency);
}
function _createCart(){

  var cartTemp = new SCFile( 'svcCart' );
  cartTemp['completed'] = false;
  var operator = getCurrentOperator();
  
  cartTemp['owner'] = operator["contact.name"];
 // var clientpid=system.functions.sysinfo_get("ClientPID");
  //var clienttid=lib.svcCartHelper.getClientTIDFromPID(clientpid);
  var clienttid = system.user.threadID;
 
  
  cartTemp['user.tid']=system.functions.parse(clienttid);
  
  system.functions.rtecall("trigger", 1, 0);
  var rc = cartTemp.doSave();
   system.functions.rtecall("trigger", 1, 1);
   if ( rc == RC_SUCCESS )
   {		
      return cartTemp;
   }
    else
   {     
    setExitType(BAD_VALIDATION_EXIT);
    setErrorMsg(RCtoString( rc ) );
	log.error(RCtoString( rc ) );
    return null;
   }
}


function _addItemsToCart(cart) {

  var oInfo = vars.$L_file;
  var cartId = cart["cartId"];
  var cartItemsList = oInfo["cartItems"];
  if (vars.$L_file.bRequestOnBehalf==true){

 	var oriOperator=getCurrentOperator().name;
 	 if (vars.$L_file.operator !=null) {
	   var requestOnBehalf=vars.$L_file.operator;
	   if (oriOperator!=requestOnBehalf)
	   _changeUserSession(requestOnBehalf);
		} 
  	var  newOper=getCurrentOperator().name;

  }
  for (var i=0;i<cartItemsList.length();i++) {
			
   var cartItem = cartItemsList[i];		
   var itemName = cartItem.name;
   var item = _getItemDetail(itemName);

   if (item == null ) {
	  setExitType(NO_RECORD_EXIT);
	  setErrorMsg(getMessage(109));
	  if (vars.$L_file.bRequestOnBehalf==true&&newOper!=oriOperator)
  	  _changeUserSession(oriOperator);
	 return false;
   }
   
  
   if (item.active == false || item.infoOnly == "false"){
	  setExitType(BAD_VALIDATION_EXIT);
	  setErrorMsg(getMessage(177));
	  if (vars.$L_file.bRequestOnBehalf==true&&newOper!=oriOperator)
  	  _changeUserSession(oriOperator);
	 return false;
   }
   if (item.infoOnly == true || item.infoOnly == "true"){
	  setExitType(BAD_VALIDATION_EXIT);
	  setErrorMsg(getMessage(176));
	  if (vars.$L_file.bRequestOnBehalf==true&&newOper!=oriOperator)
  	  _changeUserSession(oriOperator);
	  return false;
	}
	
   try {
   var interaction = _getInteractionFromCart(cart);	
   if(interaction != null){	
    checkInteractionCart(interaction, cart);
   }
    if (item.type == "item" || item.type == "bundle" ) 
    { 
		 		
    var cartItemIdtemp = _addItemToCart(item,cartId,cartItem);   
		 
    cartItem["cartItemId"] = system.functions.parse(cartItemIdtemp,1);
	} 
	  else 
	{
	 
	  setErrorMsg(getMessage(109));
	  if (vars.$L_file.bRequestOnBehalf==true&&newOper!=oriOperator)
  	  _changeUserSession(oriOperator);
	  return false;
	}
	
	if(interaction != null){
	  dealCartRequest(cart, interaction);
	  
    }	
    
	}catch( ex ) {
	
	  setExitType(BAD_VALIDATION_EXIT);
	  setErrorMsg(ex);
	  log.error(ex);
	  if (vars.$L_file.bRequestOnBehalf==true&&newOper!=oriOperator)
  	  _changeUserSession(oriOperator);
	  return false;
	 
   }
  
}
 if (vars.$L_file.bRequestOnBehalf==true&&newOper!=oriOperator)
 _changeUserSession(oriOperator);
 return true;
}

function _createRequestViaOneStep(cart,ROBUser) {

  var $L_file_bak = vars.$L_file;  
  var incidentTemp = new SCFile('incidents' );
  _initIncidentWithFile(incidentTemp);
  vars.$L_file = incidentTemp; 
  _createCartRequest(cart,ROBUser);
  vars.$L_file = $L_file_bak;

}

function _initIncidentWithFile(incidentTemp){
//initialize incidentTemp record with vars.$L_file; 
//affected.item; bRequestOnBehalf; needed.by.time; callback.contact; callback.type;contact.name; description; other; severity;title;variable1;variable2; cartId

var fileFieldsArray = new Array("affected.item","bRequestOnBehalf","needed.by.time","callback.contact","callback.type","contact.name","description","other","severity","title","variable1","variable2");
  for (var i=0;i<fileFieldsArray.length;i++) 
  {
   if(vars.$L_file[fileFieldsArray[i]] != null)       
     incidentTemp[fileFieldsArray[i]]  = vars.$L_file[fileFieldsArray[i]];
  }
  incidentTemp.cartId  = system.functions.str(vars.$L_file.cartId);  
  

}

function _deleteCartItems(cart,interaction) {
  var fields  = ['cartItemId','svcCatalogId']
  var svcCartItem = select ("svcCartItem", "cartId="+cart.cartId,fields);
  if ( svcCartItem == null ){
	  return true;
   }
  try {
  	 checkInteractionCart(interaction); //check permission and approval status 
 	 do{
  		var item = _getItemDetailFromCartItem(svcCartItem);
  		var cartItemId=svcCartItem.cartItemId;
   		if (item.type == "item" || item.type == "bundle") { 
			_deleteItemInCart(item,cart, cartItemId,interaction,svcCartItem);
		} else {
			setErrorMsg(getMessage(112));
			return;
		}
	    rc=svcCartItem.getNext();
  	}while (rc == RC_SUCCESS)
  	
  }catch( ex ) {
	  setExitType(BAD_VALIDATION_EXIT);
	  setErrorMsg(ex);
	  log.error(ex);
	  return false;
	 
   }

 return true;
} 
  


