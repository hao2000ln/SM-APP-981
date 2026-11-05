/** @fileoverview svcCartHelper - contains functions used by the Service Catalog module when dealing with svcCart and svcCartItems
*   @author Alex Corvino
*/

var $ = lib.c.$;
var logger = getLog("svcCartHelper");

var g_isClearedDeadCart = false;


/**  This function is called to delete cart items that belong to the contact name supplied. 
*	 This is called when first displaying the catalog when the requester should not have anything in the
* 	 svcCart or svcCartItem table.
*/
function clearDeadCartItems ()
{
    var operator = funcs.operator();   
    clearDeadCartItemsByOperator(operator);
}


/**
*   This function is use to support delete cart and related items by operator name
*/
function clearDeadCartItemsByOperator (sOperatorName) {

	if (g_isClearedDeadCart) {
		return;
	}
	
	g_isClearedDeadCart = true;
	
    if (sOperatorName == undefined || sOperatorName == null) {
        sOperatorName = funcs.operator();
    }

    var fOperator = $("operator", SCFILE_READONLY).setFields(["name","contact.name"]).select('name="' + sOperatorName + '"').uniqueResult();
    if (fOperator == null) {
        return;
    }

    var procs = null;
    
    $("svcCart").select('owner="' + fOperator.contact_name + '" and sysmoduser="' + fOperator.name + '" and null(submitted)"').iterate(function(fCart) {
        
        // initialize processes once
        if (procs == null) {
            procs = funcs.processes("ALL");
        }
          
        if (fCart.template == null && !isCartInActiveThreads(fCart, procs)) {
           
            logger.debug("delete dead cart:" + fCart.cartId + ", owner:" + sOperatorName);
            
            // delete related cart items
            $("svcCartItem").select("cartId=" + fCart.cartId).iterate(function(fCartItem) {
                fCartItem.doDelete(); 
            });
            
            // delete dead cart
            fCart.doDelete();
        }    
    });
}


/**  This function is called check if a cart's user.tid is in the status table. Carts that are should
*	 not be deleted because there's the possibility that the cart is active in a different session.
*
*	@param {SCFile} fCart	-  The svcCart record
*	@returns  {Boolean} True for a cart that is in an active thread false if not.
*/
function isCartInActiveThreads(fCart, procs) {

    if (fCart.template == true ) {	
		return true;
	}
	
	var operator = funcs.operator();
    
	var x, length = procs.length();
	for (x = 0; x < length; x++) {
		var aProcs = procs[x].toArray();

		if (aProcs[1] == fCart.user_tid && aProcs[3] == operator) {
			return true;
		} 
	}	
	
	return false;
}

/**  This will return the TID associated with the PID passed to it. The PID must be from an active process.
*
*	@param {int} iPID	-  The PID
*	@return the TID or -1 if one cannot be found
*	@type int
*/
function getClientTIDFromPID( iPID )
{
	var procs = funcs.processes("ACTIVE");
	
	var x, length = procs.length();
	for (x = 0; x < length; x++)
	{
		var aProcs = procs[x].toArray();
				
		if (aProcs[1] == iPID )
		{
			return aProcs[6];
		} 
	}	
	
	//impossible!
	return -1;
}

/** This is used by trigger.svcCartItem.after.update.
*   When completed is set in cart item, check and set completed in its parent cart item.
*  @param cartItem  -  The change cart item
*  @param oldCartItem  - The same cart item before updated
*/
function updateCartItemAfterCompletedUpdate (cartItem, oldCartItem)
{
    if (cartItem.completed == oldCartItem.completed || cartItem.parentCartItemId == null)
    {
        return;
    }
    
    // Get the parent cart item of this cart item
    var fParentCartItem = new SCFile("svcCartItem");
    var rc = fParentCartItem.doSelect("cartId=\"" + cartItem.cartId + "\" and cartItemId=\"" + cartItem.parentCartItemId + "\"");
    if (rc != RC_SUCCESS) {
        return;
    }
    
    if (fParentCartItem.completed == cartItem.completed) 
    {
        return;
    } 
    else if (fParentCartItem.completed == true && cartItem.completed == false)
    {
        fParentCartItem.completed = false;
        fParentCartItem.doUpdate();
        return;
    }
    
    // Get all brother cart items
    var fBrotherCartItem = new SCFile("svcCartItem", SCFILE_READONLY);
    fBrotherCartItem.setFields(["completed"]);
    rc = fBrotherCartItem.doSelect("cartId=\"" + cartItem.cartId + "\" and parentCartItemId=\"" + cartItem.parentCartItemId + "\"");
    
    var allCompleted = true;
    while (rc == RC_SUCCESS)
    {
        if (fBrotherCartItem.completed == false)
        {
            allCompleted = false;
            break;
        }
        rc = fBrotherCartItem.getNext();
    }
    
    if (allCompleted == true)
    {
        fParentCartItem.completed = true;
        fParentCartItem.doUpdate();
    }
}

/** This is used by trigger.svcCartItem.after.update.
*   When completed is set in cart item, set completed.time accordingly.
*  @param cartItem  -  The change cart item
*  @param oldCartItem  - The same cart item before updated
*/
function updateCompleteTimefieldAfterCompletedUpdate (cartItem, oldCartItem)
{
    if (cartItem.completed == oldCartItem.completed) {
        return;
    }
    
    var cartItemId;
    if( cartItem != null && cartItem.cartItemId != null) {
        cartItemId = cartItem.cartItemID;
    }
    else if( oldCartItem != null && oldCartItem.cartItemId != null) {
        cartItemId = oldCartItem.cartItemID; 
    }
    
 // Get the  cart item record 
    var fCartItem = new SCFile("svcCartItem");
    var rc = fCartItem.doSelect( "cartItemId=\"" + cartItem.cartItemId + "\"");
    if (rc != RC_SUCCESS) {
        return;
    }
    
    if(cartItem.completed == true && (oldCartItem.completed == false || oldCartItem.completed == null)) {
        fCartItem.completed_time = funcs.tod();
        fCartItem.doUpdate();  
        cartItem.completed_time = fCartItem.completed_time;
    } 
    else if(oldCartItem.completed == true && (cartItem.completed == false || cartItem.completed == null)) {
        fCartItem.completed_time = null;
        fCartItem.doUpdate();
        cartItem.completed_time = fCartItem.completed_time;  
    }
 
}

/**
 * check and update the Hashkey Configurations in info record if needed

 */
function UpdateInfoHashkeyConfigurations()
{
	var info = new SCFile("info");	
	var rc = info.doSelect("type=\"company\" and format=\"info.company\"");

	if ( rc == RC_SUCCESS )		
	{
		if (info["strong.queryhash.flag"] == null)
		{
    		info["keep.old.queryhash.flag"] = true;
    		info["strong.queryhash.flag"] = true;		
    
    		var ret = new SCDatum();	
    		funcs.rtecall("trigger", ret, 0);			
    		info.doUpdate();
    		funcs.rtecall("trigger", ret, 1);
	    }
     }
}

//UpdateInfoHashkeyConfigurations();
/**
 * check and update the option.costs field for the service catalog item records if it is dis-ordered
 */
function syncCatalogCost()
{
    var rc = new SCDatum();
    funcs.rtecall("trigger", rc, 0);
    
    var tpFile = new SCFile("svcCatalog");
    var ret = tpFile.doSelect("type=\"item\" and option.costs~=NULL"); 
    
    while (ret == RC_SUCCESS)
    {
        var name = tpFile["name"];
        var aOptionNames = tpFile["option.names"];
        var optionCostXML = tpFile["option.costs"];
       
         var newCost = reOrderFields( aOptionNames, optionCostXML );
   
        if(needOrdered( optionCostXML, newCost )){
            tpFile["option.costs"] = newCost;
            
            tpFile.doUpdate();
            print("===="+name +" re-ordered====================")
        }
        
                
        ret = tpFile.getNext();
    }
    
    funcs.rtecall("trigger", rc, 1);
}

function needOrdered( optionCostXML, newCost )
{
    var formXML = new XML();    
    formXML.setContent(optionCostXML);
    var node = formXML.getFirstChildElement();
   
    
    var newform = new XML();    
    newform.setContent(newCost);
    var newNode = newform.getFirstChildElement();
  

    while ( node != null && newNode !=null )
    {

        if(node.toXMLString()!=newNode.toXMLString()) return true;
        else{        
            node = node.getNextSiblingElement();
            newNode = newNode.getNextSiblingElement();
        }
    }
    return false;
}


function reOrderFields( aOptionNames, optionXML )
{
    var options = new XML();
    options.setContent("<form></form>");

    var xml = new XML();
    xml.setContent( optionXML );       

    var aIds = new Array();
    aIds = aOptionNames.toArray();

    for ( i = 0; i < aIds.length; i++ )
    {
        var node = lib.xmlHelpers.getElement( xml, aIds[i], "id" );

        if ( node != null )
            options = lib.xmlHelpers.addChildElement( options, node );
    }

    return options.toXMLString();
}
