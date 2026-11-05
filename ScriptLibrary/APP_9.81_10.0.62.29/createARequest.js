/** This function is used to create a record using web services. 
*   
*   @param 	{File} 		fRecord 		-	The incoming incident record
*   @param 	{File} 		fItem 	 		-	The incoming cart record
*   @param 	{File} 		fCartItem 		-	The incoming cart item record
*   @param 	{String}	strLocation		-	The service location
*   @param 	{String}	strUser 		-	The service user
*   @param 	{String}	strPwd	 		-	The service user password
*
*	@return {Boolean} true 				- true
*/


function createARequest( strLocation, strUser, strPwd, fRecord, fItem, fCartItem )
{
  // Setup service info
  var aService     = new lib.ServiceCatalog.ServiceCatalog();

  if ( strLocation != null && strLocation != "" )
    aService.location = new String( strLocation );
  else
    print( system.functions.scmsg( 150, "ScriptLibrary" ) );
    

  if ( strUser != null && strUser != "" )
    aService.user     = ( strUser );
  else
    print( system.functions.scmsg( 151, "ScriptLibrary" ) );
    
       
  aService.password = ( strPwd );
 

  if ( fRecord != null )
  {
    // Get the information on the record to be added
    



    // Create different parts of the request 
	var aRequest = new lib.ServiceCatalog.CreateFulfillmentRequest();

    // Setup values for different parts of the message 
    aRequest.RequesterRequestID.setValue( fRecord.incident_id ); 
    
    
    var operatorRec = system.library.userUtils.findOperatorByField("contact.name", fRecord.contact_name);
    if ( operatorRec != null)
    {
      aService.user = operatorRec.name;      
    }
    else
    {
      print( system.functions.scmsg( 161, "ScriptLibrary", [fRecord.contact_name] ) );
      return;
    } 

    aRequest.RequestedBy.setValue( fRecord.contact_name ); 
    aRequest.CallBackContact.setValue( fRecord.callback_contact ); 
    aRequest.NotifyBy.setValue( fRecord.callback_type ); 

    if ( fRecord.needed_by_time > 0 )
    {
      var theXMLDate = new XMLDate( fRecord.needed_by_time );
      var dDate = theXMLDate.getISODateTimeString();
      aRequest.NeededBy.setValue( dDate );
    }  

    aRequest.Severity.setValue( fRecord.severity ); 

    // Special setup for the description since it's an array
    if ( fRecord.description != null )
      fRecord.description = system.functions.denull( fRecord.description );

    var len = fRecord.description.length();
    var extDesc = fRecord.description[0];
    for ( var i=1; i < len; i++ )
    {
      extDesc = extDesc + " " + fRecord.description[i];
    }  

    aRequest.Description.setValue( extDesc );  
    aRequest.CartItemID.setValue( fCartItem.cartItemId ); 
    aRequest.Submitted = fCartItem.submitted;
    aRequest.Completed = fCartItem.completed; 
    aRequest.Status.setValue( fCartItem.status ); 
    aRequest.SLAAgreementID.setValue( fRecord.agreement_id ); 

    if ( fCartItem.cost == null || fCartItem.cost == "" ) 
      fCartItem.cost= 0;    

    aRequest.Cost.setValue( parseFloat(fCartItem.cost) ); 
    aRequest.Currency.setValue( system.vars.$G_root_currency ); 

    if ( fCartItem.duration > 0 )
    {
      var theXMLDate = new XMLDate( fCartItem.duration );
      var dDate = theXMLDate.getISODateTimeString();
      aRequest.Duration.setValue( dDate ); 
    }
    
    aRequest.Quantity.setValue( fCartItem.quantity ); 

    if ( fCartItem.next_breach > 0 )
    {
      var theXMLDate = new XMLDate( fCartItem.next_breach );
      var dDate = theXMLDate.getISODateTimeString();
      aRequest.SLADeadline.setValue( dDate );
    }  

    aRequest.UnitCost.setValue( fCartItem.unit_cost ); 

    if ( fCartItem.request_time > 0 )
    {
      var theXMLDate = new XMLDate( fCartItem.request_time );
      var dDate = theXMLDate.getISODateTimeString();
      aRequest.RequestTime.setValue( dDate );
    }

    if ( fCartItem.start_time > 0 )
    {
      var theXMLDate = new XMLDate( fCartItem.start_time );
      var dDate = theXMLDate.getISODateTimeString();
      aRequest.StartTime.setValue( dDate );
    }
    
    aRequest.ServiceCatalogID.setValue( fItem.id ); 
    aRequest.ItemDescription.setValue( fCartItem.item_description ); 
    
    

    // Setup arrays to store the names and values of the options
    var aNameArray  = new Array();
    var aValueArray = new Array();
    var index = 0;
	
	if ( fCartItem.options != null )
	{
      var select   = "select";
      var checkbox = "checkbox";
      var text     = "text";
      var optionXML = new XML();
      if ( fCartItem.options != null && fCartItem.options != "" )
      {
        if ( optionXML.setContent( fCartItem.options ) )
        {
          var node = optionXML.getFirstChildElement();
          while ( node != null )
		  {
		    if ( node.getName() == select || node.getName() == checkbox || node.getName() == text )
            {
			  var id = node.getAttributeValue( "id" );
              var value = node.getValue();
              aNameArray[index]  = id;
              aValueArray[index] = value;
              index++; 
            }
            node = node.getNextSiblingElement();
          }
        } 
      }  
    }    

    // Setup the options in the request
    var aOption;
  
    for ( var i = 0; i < index; i++ )
    {
      aOption = aRequest.options.option_newInstance(); 
      aOption.name = (aNameArray[i]);
      aOption.value = (aValueArray[i]);      
      
      
    }

    aRequest.RequestedFor.setValue( fCartItem.requested_for ); 

    var strPartNumber;
    strPartNumber = lib.svcCatInterface.getXMLFieldValue( fItem.interface_info, "partNumber" );   
    if ( strPartNumber != null ) 
      aRequest.PartNumber.setValue( strPartNumber ); 
    
    // Invoke the service and create response
    var aResponse = aService.invoke( aRequest );
      
    // If there is  aproblem, get the error.
    if ( aResponse.isFault() )
    {
      print( aResponse.faultstring.getValue() ); 
      print( system.functions.scmsg( 152, "ScriptLibrary" ) );
      
    }  
    else 
    {
      var rc;

      if (aResponse.status == "FAILURE" )
      {
        fCartItem.status="failed";
        rc = fCartItem.doAction("save");
      } 
      // If the change is added, get the change number
      else
      {  
        var requestNumber = aResponse.ProviderRequestID.getValue();
        print( "Request Number: " + requestNumber );
        print( system.functions.scmsg( 153, "ScriptLibrary", [aResponse.ProviderRequestID.getValue()] ) );
      
        fCartItem.action_id = aResponse.ProviderRequestID.getValue();
        rc = fCartItem.doAction("save");
      }

      if ( rc == RC_SUCCESS)
      {
        print( system.functions.scmsg( 153, "ScriptLibrary", [aResponse.ProviderRequestID.getValue()] ) );
      }
      else 
      {
	    scmessage=system.functions.scmsg(158, "ScriptLibrary");	
      }

    }
  }  
  return true;
}


