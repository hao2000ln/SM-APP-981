
function ProblemTaskAdded()
{
  
  var taskDispatchService = new lib.TaskDispatchService.TaskDispatchService();
  
  

  taskDispatchService.location = "http://16.59.63.177:8080/active-bpel/services/DefectDispatcherPLTService"
  
  // taskDispatchService.location = "http://16.59.45.192:1234/active-bpel/services/DefectDispatcherPLTService"
 
  var taskSubmitRequest       = new lib.TaskDispatchService.TaskSubmitRequest();
  
  /*
  <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:m0="http://schemas.hp.com/ism-pws/ServiceOperation/TaskManagement/1/Task" xmlns:m1="http://schemas.hp.com/ism-pws/ServiceOperation/Common/1/Ticket" xmlns:m2="http://schemas.hp.com/ism-pws/Common/1/Common" xmlns:m3="http://schemas.hp.com/ism-pws/ServiceTransition/ConfigurationManagement/1/PersonProperties" xmlns:m4="http://schemas.hp.com/ism-pws/ServiceTransition/ConfigurationManagement/1/ConfigurationItemProperties" xmlns:m5="http://schemas.hp.com/ism-pws/ServiceOperation/TaskManagement/1/TaskProperties">
  <SOAP-ENV:Body>
    <m:TaskSubmitRequest xmlns:m="http://schemas.hp.com/ism-pws/ServiceOperation/TaskManagement/1/TaskDispatch">
      <m0:Task>
        <m1:AssignedTo>
          <m2:EntityReference>
            <m2:Address>http://www.altova.com</m2:Address>
            <m2:ResourceURI>http://www.altova.com</m2:ResourceURI>
            <m2:ID>String</m2:ID>
          </m2:EntityReference>
          <m3:PersonProperties>
            <m4:ID>String</m4:ID>
            <m4:Name>String</m4:Name>
            <m3:FullName>String</m3:FullName>
            <m3:Extensions/>
          </m3:PersonProperties>
        </m1:AssignedTo>
        <m5:ID>String</m5:ID>
        <m5:IntegrationID>String</m5:IntegrationID>
        <m5:Title>String</m5:Title>
        <m5:Type>String</m5:Type>
        <m5:Description>String</m5:Description>
        <m5:LifecycleState>String</m5:LifecycleState>
        <m5:Severity>String</m5:Severity>
        <m0:Extensions/>
      </m0:Task>
    </m:TaskSubmitRequest>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>
  
  */
  
  taskSubmitRequest.Task.ID.setValue( record.id );
  taskSubmitRequest.Task.Title.setValue( record.brief_description );
  taskSubmitRequest.Task.Description.setValue( record.description.toArray().join( "\r\n" ) );
  
  
   
  var severity = new String( record.severity );
  
  if ( severity == "1" )
  {
    severity = "1 - Critical";
  }
  else
  if ( severity == "2" )
  {
    severity = "2 - High";
  }
  else  
  if ( severity == "3" )
  {
    severity = "3 - Average";
  }
  else  
  if ( severity == "4" )
  {
    severity = "4 - Low";
  }
  else  
  if ( severity == "5" )
  {
    severity = "5 - None";
  }
   
  taskSubmitRequest.Task.Severity.setValue( severity );
      
  try
  {
     taskDispatchService.invoke( taskSubmitRequest );
  }
  catch( e )
  {
     print( "TaskSubmit " + e );
  }
  
}

function ProblemTaskUpdated()
{
  
    var taskDispatchService = new lib.TaskDispatchService.TaskDispatchService();
  

  taskDispatchService.location = "http://16.59.63.177:8080/active-bpel/services/DefectDispatcherAddCommentPLTService"
  
 
  var addCommentRequest       = new lib.TaskDispatchService.AddCommentRequest();
  
  /*
  <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:m0="http://schemas.hp.com/ism-pws/Common/1/Common">
  <SOAP-ENV:Body>
    <m:AddCommentRequest xmlns:m="http://schemas.hp.com/ism-pws/ServiceOperation/TaskManagement/1/TaskDispatch">
      <m0:EntityReference>
        <m0:Address>http://www.altova.com</m0:Address>
        <m0:ResourceURI>http://www.altova.com</m0:ResourceURI>
        <m0:ID>String</m0:ID>
      </m0:EntityReference>
      <m:Comment>String</m:Comment>
    </m:AddCommentRequest>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>
  
  */
  
  addCommentRequest.EntityReference.ID.setValue( record.id );
  
  if (system.functions._null(system.vars.$pmt_update))
      return;
  var lastUpdate = system.vars.$pmt_update.toArray().join( "\r\n" );
  
  addCommentRequest.Comment.setValue( lastUpdate );
  
  try
  {
     taskDispatchService.invoke( addCommentRequest );
  }
  catch( e )
  {
     print( "AddComment " + e );
  }
}

function SymphonyRelationAdded( fromSystem, subject, object, key )
{
  
  if ( object == "problem" ) // this really should be "Incident", but historically SC called these "problems"
  {
     lib.Symphony.sendCreateNotification( "Success", fromSystem, subject, "Incident", key );
  }
  else if (object == "rootcause")
  {
     lib.Symphony.sendCreateNotification( "Success", fromSystem, subject, "Problem", key );
  }
  print(system.functions.scmsg(163, "ScriptLibrary")); //Your association request was sent to BAC.
   
}

// Send a CreateNotification back to the FromSystem, which becomes ToSystem

function sendCreateNotification( status, toSystem, subject, object, key )
{

   var entityObserver = new lib.EntityNotification.EntityNotification();

   // TO-DO:  Figure out where/how to configure the entity observer ws location URL
   // TO-DO:  For now, just fire it at our IncidentLookupService, which will fail, but allows us to log the message and verify it
   //entityObserver.location = "http://127.0.0.1:9080/SymphonyAdapter/services/IncidentLookupService";
	entityObserver.location = vars.$G_system_info.BAC_services_endpoint   
   // TO-DO;  Figure out how to preserve and pass along the user and security HTTP header values from the web tier to here.
   // TO-DO:  Perhaps put these in the SOAP message in the web tier, then into the record before calling doc engine?
   // TO-DO:  We need to have these to maintain the SSO scenario....
   
   
   entityObserver.user     = system.user.name;   
   entityObserver.password = "";

   var createNotification = new lib.EntityNotification.CreateNotification();

   createNotification.EntityNotificationHeader.ToSystem.setValue( toSystem );
   createNotification.EntityNotificationHeader.Subject.setValue( subject );

   if ( status == "Cancel" )
   {
     status = new lib.EntityNotification.OutcomeCodeType().Cancel.getValue();
 
     createNotification.EntityNotificationBody.OutcomeCode.setValue( status );    
   }
   else
   if ( status == "Success" )
   {
     status = new lib.EntityNotification.OutcomeCodeType().Success.getValue();
     
     createNotification.EntityNotificationBody.OutcomeCode.setValue( status );
     
     createNotification.EntityNotificationBody.EntityReference.Address.setValue( "http://www.service-manager-7_0.hp.com" );
   
     createNotification.EntityNotificationBody.EntityReference.ResourceURI.setValue( "http://schemas.hp.com/ism-pws/ServiceOperation/1/" + object );
   
     createNotification.EntityNotificationBody.EntityReference.ID.setValue( key );
   }
   
   try
   {

     var result = entityObserver.invoke( createNotification );

     if ( result != null && result.isFault() )
     {
        print( "Fault received trying to send createNotification: " + result.faultstring.getValue() );
     }
     else
     {
       print(system.functions.scmsg(163, "ScriptLibrary")); //Your association request was sent to BAC.
     }
   }
   catch( e )
   {
     print( "Exception occurred trying to send createNotification: " + e );
   }

} // sendCreateNotification


// Send a SelectNotification back to the FromSystem, which becomes ToSystem

/*
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:m0="http://schemas.hp.com/ism-pws/Common/1/Common">
  <SOAP-ENV:Body>
    <m:SelectNotification xmlns:m="http://schemas.hp.com/ism-pws/Common/EntityObserver/1/EntityNotification">
      <m:EntityNotificationHeader>
        <m:ToSystem>String</m:ToSystem>
        <m:Subject>String</m:Subject>
      </m:EntityNotificationHeader>
      <m:EntityNotificationBody>
        <m:OutcomeCode>String</m:OutcomeCode>
        <m:FaultDescription>String</m:FaultDescription>
        <m0:EntityReference>
          <m0:Address>http://www.altova.com</m0:Address>
          <m0:ResourceURI>http://www.altova.com</m0:ResourceURI>
          <m0:ID>String</m0:ID>
        </m0:EntityReference>
      </m:EntityNotificationBody>
    </m:SelectNotification>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>
*/

function sendSelectNotification( status, toSystem, subject, object, key )
{

   var entityObserver = new lib.EntityNotification.EntityNotification();

   // TO-DO:  Figure out where/how to configure the entity observer ws location URL
   // TO-DO:  For now, just fire it at our IncidentLookupService, which will fail, but allows us to log the message and verify it
   //entityObserver.location = "http://127.0.0.1:9080/SymphonyAdapter/services/IncidentLookupService";
   entityObserver.location = vars.$G_system_info.BAC_services_endpoint;
   
   // TO-DO;  Figure out how to preserve and pass along the user and security HTTP header values from the web tier to here.
   // TO-DO:  Perhaps put these in the SOAP message in the web tier, then into the record before calling doc engine?
   // TO-DO:  We need to have these to maintain the SSO scenario....
   
   entityObserver.user     = system.user.name;   
   entityObserver.password = "";

   var selectNotification = new lib.EntityNotification.SelectNotification();

   selectNotification.EntityNotificationHeader.ToSystem.setValue( toSystem );
   selectNotification.EntityNotificationHeader.Subject.setValue( subject );

   if ( status == "Cancel" )
   {
     status = new lib.EntityNotification.OutcomeCodeType().Cancel.getValue();
 
     selectNotification.EntityNotificationBody.OutcomeCode.setValue( status );    
   }
   else
   if ( status == "Success" )
   {
     status = new lib.EntityNotification.OutcomeCodeType().Success.getValue();
     
     selectNotification.EntityNotificationBody.OutcomeCode.setValue( status );
     
     selectNotification.EntityNotificationBody.EntityReference.Address.setValue( "http://www.service-manager-7_0.hp.com" );
   
     selectNotification.EntityNotificationBody.EntityReference.ResourceURI.setValue( "http://schemas.hp.com/ism-pws/ServiceOperation/1/" + object );
   
     selectNotification.EntityNotificationBody.EntityReference.ID.setValue( key );
   }
   
   try
   {

     var result = entityObserver.invoke( selectNotification );

     if ( result != null && result.isFault() )
     {
        print( "Fault received trying to send selectNotification: " + result.faultstring.getValue() );
     }
     else
     {
        print(system.functions.scmsg(163, "ScriptLibrary")); //Your association request was sent to BAC.
     }
   }
   catch( e )
   {
     print( "Exception occurred trying to send selectNotification: " + e );
   }

} // sendSelectNotification


function sendStatusChangeNotification()
{
/*
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:m0="http://schemas.hp.com/ism-pws/Common/1/Common">
  <SOAP-ENV:Body>
    <m:OnStatusChangeRequest xmlns:m="http://schemas.hp.com/ism-pws/ServiceOperation/TaskManagement/1/TaskDispatch">
      <m0:EntityReference>
        <m0:Address>http://www.altova.com</m0:Address>
        <m0:ResourceURI>http://www.altova.com</m0:ResourceURI>
        <m0:ID>String</m0:ID>
      </m0:EntityReference>
      <m:NewStatus>String</m:NewStatus>
    </m:OnStatusChangeRequest>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>
*/
}
