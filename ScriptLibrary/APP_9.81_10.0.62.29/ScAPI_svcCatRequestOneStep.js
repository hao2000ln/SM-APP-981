var _getItemDetail=lib.ScAPI_WSInterface_Add_Item._getItemDetail;
var _getCartDetail=lib.ScAPI_WSInterface_Add_Item._getCartDetail;
var _addItemToCart=lib.ScAPI_WSInterface_Add_Item._addItemToCart;
var dealCartRequest = lib.ScAPI_WSInterface_Update_Item.dealCartRequest;
var checkInteractionCart = lib.ScAPI_WSInterface_svcCart_Util.checkInteractionCart;
var _getInteractionFromCart = lib.ScAPI_WSInterface_Add_Item._getInteractionFromCart;
var _createRequest = lib.ScAPI_svcCatRequest.createRequest;
var BAD_VALIDATION_EXIT = lib.ScAPI_Constants.BAD_VALIDATION_EXIT();
var NO_RECORD_EXIT = lib.ScAPI_Constants.NO_RECORD_EXIT();
var NORMAL_EXIT = lib.ScAPI_Constants.NORMAL_EXIT();
var setExitType = lib.ScAPI_Util.setExitType;
var setErrorMsg = lib.ScAPI_Util.setErrorMsg;
var getMessage = lib.ScAPI_Util.getMessage;
var log = lib.ScAPI_Logger.log("ScAPI_svcCatRequestOneStep");

function createInteractionOneStep(){

vars.$L_file["cartId"] = _createCart();
if(_addItemsToCart())

  _createRequestViaOneStep();

}
function _createCart(){

  var cartTemp = new SCFile( 'svcCart' );
  cartTemp['completed'] = false;
  var operator = lib.ScAPI_Util.getCurrentOperator();
  
  cartTemp['owner'] = operator["contact.name"];
  var clientpid=system.functions.sysinfo_get("ClientPID");
  var clienttid=lib.svcCartHelper.getClientTIDFromPID(clientpid);
  cartTemp['user.tid']=system.functions.parse(clienttid);
  
 
  var rc = cartTemp.doInsert();
   if ( rc == RC_SUCCESS )
   {		
      return cartTemp.cartId;
   }
    else
   {     
    setExitType(BAD_VALIDATION_EXIT);
    setErrorMsg(RCtoString( rc ) );
	log.error(RCtoString( rc ) );
    return null;
   }
}


function _addItemsToCart() {
 
  
  var oInfo = vars.$L_file;
  var cartId = vars.$L_file["cartId"];
  var cartItemsList = oInfo["cartItems"];
  for (var i in cartItemsList) {
			
   var cartItem = cartItemsList[i];		
   var itemName = cartItem.name;
   var item = _getItemDetail(itemName);

   if (item == null || cartId == null) {
	 setExitType(NO_RECORD_EXIT);
	 return false;
   }
   if (item.active == false || item.infoOnly == "false"){
	  setExitType(BAD_VALIDATION_EXIT);
	  setErrorMsg(getMessage(177));
	 return false;
   }
   if (item.infoOnly == true || item.infoOnly == "true"){
	  setExitType(BAD_VALIDATION_EXIT);
	  setErrorMsg(getMessage(176));
	  return false;
	}
	
  try {
	 var cart = _getCartDetail(cartId);
	 if (cart == null) {
	   setExitType(NO_RECORD_EXIT);
	   setErrorMsg(getMessage(108));
	   return false;
   }
    var interaction = _getInteractionFromCart(cart);		

    checkInteractionCart(interaction, cart);
    if (item.type == "item" || item.type == "bundle" ) 
    { 
		 		
    var cartItemIdtemp = _addItemToCart(item,cartId,cartItem);   
		 
    cartItem["cartItemId"] = system.functions.parse(cartItemIdtemp,1);
	} 
	  else 
	{
	 
	  setErrorMsg(getMessage(109));
	  return false;
	}
		
    if(interaction != null){
	  dealCartRequest(cart, interaction);
	  
    }
    
	}catch( ex ) {
	
	  setExitType(BAD_VALIDATION_EXIT);
	  setErrorMsg(ex);
	  log.error(ex);
	  return false;
	 
   }
  
}
 return true;
}

function _createRequestViaOneStep() {


  var $L_file_bak = vars.$L_file;  
  var incidentTemp = new SCFile('incidents' );
  _initIncidentWithFile(incidentTemp);
  vars.$L_file = incidentTemp; 
  _createRequest();
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
