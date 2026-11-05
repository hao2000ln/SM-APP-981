/*
	@fileoverview Interactions - Process, utilities associated with Interactions.
   	@author Ayaz Usman
*/


/*
	Users have the ability to cancel their own requests they have opened through Service Catalog
*/

function cancelInteractionRequest(fInteraction)
{
    cancelLineItems(fInteraction);

}


/*
	Changes the status on the svcCartItems to canceled.
*/
function cancelLineItems(fInteraction)
{
	var fsvcCart = new SCFile("svcCart");
	var query="sdID=\""+fInteraction.incident_id+"\"";
	var rc = fsvcCart.doSelect(query);
    if ( rc == RC_SUCCESS )
    {
    	var fsvcCartItem= new SCFile("svcCartItem");
		rc = fsvcCartItem.doSelect("cartId=\""+fsvcCart.cartId+"\"");
		
		if( rc == RC_SUCCESS )
		{
			var ret;
			system.functions.rtecall("trigger", ret, 0);			
			do
        	{
	        	 fsvcCartItem.status = "Canceled";
    	     	 fsvcCartItem.doUpdate();
        	}
     		while (fsvcCartItem.getNext() == RC_SUCCESS);
			system.functions.rtecall("trigger", ret, 1);			
	    }
	}

}