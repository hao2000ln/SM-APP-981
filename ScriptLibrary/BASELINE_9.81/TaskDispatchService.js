
function TaskDispatchService( )
{
  this.location = new String( "http://127.0.0.1:18080/TaskDispatchService/" );

  this.user = null;
  this.password = null;
  this.connectTimeOut = 10;
  this.sendTimeOut = 10;
  this.recvTimeOut = 10;
  this.soapEnvelope = null;
  this.soapBody = null;
  this.soapHeader = null;
  this.attachments = new Array();
  this.resultXML = null;
  this.invoke = invoke;
  this.SOAPOperations = new Array();
  this.getSOAPOperation = function( reqName )
  {
     var soapOp = this.SOAPOperations[ reqName ];
  
     if ( soapOp != null )
     {
       return soapOp;
     }
  
    for ( var op in this.SOAPOperations )
    {
       soapOp = this.SOAPOperations[op];
  
       if ( soapOp.requestObj == reqName )
         return soapOp;
    }
    throw( "Can't find SOAP Operation for " + reqName );
  }

  this.SOAPOperations[ "Submit" ] = new soap_Operation( "Submit", "http://schemas.hp.com/ism/Actions/1/Submit", "document", "TaskSubmitRequest", "null" );
  this.SOAPOperations[ "AddComment" ] = new soap_Operation( "AddComment", "http://schemas.hp.com/ism/Actions/1/AddComment", "document", "AddCommentRequest", "null" );
  this.SOAPOperations[ "OnStatusChange" ] = new soap_Operation( "OnStatusChange", "http://schemas.hp.com/ism/Actions/1/StatusChange", "document", "OnStatusChangeRequest", "null" );
  this.getProto = function( )
  {
    return this.location.before("://");
  }
   
  this.getHost = function( )
  {
    var hostport = this.location.after("://");
    var h;
    return ( (h = hostport.before(":")) ? h : hostport );
  }
   
  this.getPort = function( )
  {
    var hostport = this.location.after("//");
    var p;
    return ( (p = hostport.after(":")) ? p : 80 );
  }
   
  this.setHost = function( host )
  {
    var port  = this.getPort();
    var proto = this.getProto();
   
    this.location = proto + "://" + host + ":" + port;
  }
   
  this.setPort = function( port )
  {
    var host  = this.getHost();
    var proto = this.getProto();
   
    this.location = proto + "://" + host + ":" + port;
  }

   this.setAttachments = function( attachments )
  {
    this.attachments = attachments;
  }
  
  this.getAttachments = function()
  {
    return this.attachments;
  }

}

function invoke( requestObj, headerObj )
{
  var soapOp = this.getSOAPOperation( requestObj.getName() );
 
  this.soapEnvelope = new soap_Envelope();
  this.soapBody = new soap_Body();
 
  this.soapBody.setContent( requestObj );
 
  if ( headerObj != undefined && headerObj != null )
  {
    this.soapHeader = new soap_Header();
    this.soapHeader.setContent( headerObj );
    this.soapEnvelope.setContent( this.soapHeader, this.soapBody );
  }
  else
    this.soapEnvelope.setContent( this.soapBody );
 
  var result = new Object();
 
  lib.SOAP.serialize( this.soapEnvelope, result );
 
  this.resultXML = doSOAPRequest( this.location, soapOp.SOAPAction, result.xml,
                              this.user, this.password,
                              this.connectTimeOut, this.sendTimeOut, this.recvTimeOut,
                              this.attachments );

  if ( soapOp.responseObj == "null" )  // one-way MEP ? 
  {
    return null;
  }
 
  var resultObj = new Object();
 
  resultObj.responseObj = soapOp.responseObj;
 
  try
  {
    lib.SOAP.deserialize( "TaskDispatchService", this.resultXML.getDocumentElement(), resultObj );
  }
  catch( e )
  {
    print( "Error deserializing response: " + e.toString() );
    return null;
  }
   
  try
  {
    this.soapEnvelope = resultObj["soap_Envelope"];
    this.soapBody = this.soapEnvelope[ "Body" ];
   
    if ( this.soapEnvelope[ "Header" ] != undefined )
    {
      this.soapHeader = this.soapEnvelope[ "Header" ];
    }
    else
      this.soapHeader = null;
    
    return this.soapBody.getContent();
  }
  catch( e )
  {
    print( "Error extracting response object: " + e.toString() );
    return null;
  }
}

function soap_Operation( name, SOAPAction, style, requestObj, responseObj )
{
  this.name       = name;
  this.SOAPAction = SOAPAction;
  this.style      = style;
  this.requestObj = requestObj;
  this.responseObj= responseObj;
}

function soap_Body(  ) 
{
  this.$$nsPrefix = "soap";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "soap_Body";
  this.$$xmlNames[ "soap_Body" ] = "soap:Body";
}

function soap_Envelope(  ) 
{
  this.$$nsPrefix = "soap";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "soap_Envelope";
  this.$$xmlNames[ "soap_Envelope" ] = "soap:Envelope";
  this.xmlns_ns0 = new String("http://schemas.hp.com/ism-pws/ServiceOperation/TaskManagement/1/TaskDispatchServiceSpecification");
  this.$$attributes.push( "xmlns_ns0" );
  this.$$xmlNames["xmlns_ns0"] = "xmlns:ns0";
  this.$$objNames["xmlns:ns0"] = "xmlns_ns0";
  this.xmlns_ns1 = new String("http://schemas.hp.com/ism-pws/ServiceOperation/TaskManagement/1/TaskDispatchService");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  this.xmlns_ns2 = new String("http://schemas.xmlsoap.org/wsdl/soap/");
  this.$$attributes.push( "xmlns_ns2" );
  this.$$xmlNames["xmlns_ns2"] = "xmlns:ns2";
  this.$$objNames["xmlns:ns2"] = "xmlns_ns2";
  this.xmlns_ns3 = new String("http://schemas.xmlsoap.org/ws/2004/08/addressing");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
  this.xmlns_ns4 = new String("http://schemas.xmlsoap.org/wsdl/");
  this.$$attributes.push( "xmlns_ns4" );
  this.$$xmlNames["xmlns_ns4"] = "xmlns:ns4";
  this.$$objNames["xmlns:ns4"] = "xmlns_ns4";
  this.xmlns_ns5 = new String("http://schemas.hp.com/ism-pws/ServiceOperation/TaskManagement/1/TaskDispatch");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
  this.xmlns_xsd = new String("http://www.w3.org/2001/XMLSchema");
  this.$$attributes.push( "xmlns_xsd" );
  this.$$xmlNames["xmlns_xsd"] = "xmlns:xsd";
  this.$$objNames["xmlns:xsd"] = "xmlns_xsd";
  this.xmlns_ns7 = new String("http://schemas.hp.com/ism-pws/Common/1/Common");
  this.$$attributes.push( "xmlns_ns7" );
  this.$$xmlNames["xmlns_ns7"] = "xmlns:ns7";
  this.$$objNames["xmlns:ns7"] = "xmlns_ns7";
  this.xmlns_ns8 = new String("http://schemas.hp.com/ism-pws/ServiceTransition/ConfigurationManagement/1/ConfigurationItemProperties");
  this.$$attributes.push( "xmlns_ns8" );
  this.$$xmlNames["xmlns_ns8"] = "xmlns:ns8";
  this.$$objNames["xmlns:ns8"] = "xmlns_ns8";
  this.xmlns_ns9 = new String("http://schemas.hp.com/ism-pws/ServiceTransition/ConfigurationManagement/1/NodeProperties");
  this.$$attributes.push( "xmlns_ns9" );
  this.$$xmlNames["xmlns_ns9"] = "xmlns:ns9";
  this.$$objNames["xmlns:ns9"] = "xmlns_ns9";
  this.xmlns_ns10 = new String("http://schemas.hp.com/ism-pws/Common/1/WsdlCommon");
  this.$$attributes.push( "xmlns_ns10" );
  this.$$xmlNames["xmlns_ns10"] = "xmlns:ns10";
  this.$$objNames["xmlns:ns10"] = "xmlns_ns10";
  this.xmlns_ns11 = new String("http://schemas.hp.com/ism-pws/ServiceOperation/TaskManagement/1/Task");
  this.$$attributes.push( "xmlns_ns11" );
  this.$$xmlNames["xmlns_ns11"] = "xmlns:ns11";
  this.$$objNames["xmlns:ns11"] = "xmlns_ns11";
  this.xmlns_ns12 = new String("http://schemas.hp.com/ism-pws/ServiceOperation/TaskManagement/1/TaskExtensions");
  this.$$attributes.push( "xmlns_ns12" );
  this.$$xmlNames["xmlns_ns12"] = "xmlns:ns12";
  this.$$objNames["xmlns:ns12"] = "xmlns_ns12";
  this.xmlns_ns13 = new String("http://schemas.hp.com/ism-pws/ServiceOperation/TaskManagement/1/TaskProperties");
  this.$$attributes.push( "xmlns_ns13" );
  this.$$xmlNames["xmlns_ns13"] = "xmlns:ns13";
  this.$$objNames["xmlns:ns13"] = "xmlns_ns13";
  this.xmlns_ns14 = new String("http://schemas.hp.com/ism-pws/ServiceTransition/ConfigurationManagement/1/ServiceProperties");
  this.$$attributes.push( "xmlns_ns14" );
  this.$$xmlNames["xmlns_ns14"] = "xmlns:ns14";
  this.$$objNames["xmlns:ns14"] = "xmlns_ns14";
  this.xmlns_ns15 = new String("http://schemas.hp.com/ism-pws/ServiceOperation/Common/1/Ticket");
  this.$$attributes.push( "xmlns_ns15" );
  this.$$xmlNames["xmlns_ns15"] = "xmlns:ns15";
  this.$$objNames["xmlns:ns15"] = "xmlns_ns15";
  this.xmlns_ns16 = new String("http://schemas.hp.com/ism-pws/ServiceTransition/ConfigurationManagement/1/PersonProperties");
  this.$$attributes.push( "xmlns_ns16" );
  this.$$xmlNames["xmlns_ns16"] = "xmlns:ns16";
  this.$$objNames["xmlns:ns16"] = "xmlns_ns16";
  this.xmlns_ns17 = new String("http://schemas.hp.com/ism-pws/ServiceTransition/ConfigurationManagement/1/SupportGroupProperties");
  this.$$attributes.push( "xmlns_ns17" );
  this.$$xmlNames["xmlns_ns17"] = "xmlns:ns17";
  this.$$objNames["xmlns:ns17"] = "xmlns_ns17";
  this.xmlns_ns18 = new String("http://schemas.hp.com/ism-pws/ServiceOperation/Common/1/TicketExtensions");
  this.$$attributes.push( "xmlns_ns18" );
  this.$$xmlNames["xmlns_ns18"] = "xmlns:ns18";
  this.$$objNames["xmlns:ns18"] = "xmlns_ns18";
  this.xmlns_ns19 = new String("http://schemas.hp.com/ism-pws/ServiceOperation/Common/1/WorkItem");
  this.$$attributes.push( "xmlns_ns19" );
  this.$$xmlNames["xmlns_ns19"] = "xmlns:ns19";
  this.$$objNames["xmlns:ns19"] = "xmlns_ns19";
  this.xmlns_ns20 = new String("http://schemas.hp.com/ism-pws/ServiceOperation/Common/1/TicketProperties");
  this.$$attributes.push( "xmlns_ns20" );
  this.$$xmlNames["xmlns_ns20"] = "xmlns:ns20";
  this.$$objNames["xmlns:ns20"] = "xmlns_ns20";
  this.xmlns_ns21 = new String("http://schemas.hp.com/ism-pws/ServiceTransition/ConfigurationManagement/1/ConfigurationItemExtensions");
  this.$$attributes.push( "xmlns_ns21" );
  this.$$xmlNames["xmlns_ns21"] = "xmlns:ns21";
  this.$$objNames["xmlns:ns21"] = "xmlns_ns21";
  this.xmlns_ns22 = new String("http://schemas.hp.com/ism-pws/ServiceTransition/ConfigurationManagement/1/NodeExtensions");
  this.$$attributes.push( "xmlns_ns22" );
  this.$$xmlNames["xmlns_ns22"] = "xmlns:ns22";
  this.$$objNames["xmlns:ns22"] = "xmlns_ns22";
  this.xmlns_ns23 = new String("http://schemas.hp.com/ism-pws/ServiceTransition/ConfigurationManagement/1/PersonExtensions");
  this.$$attributes.push( "xmlns_ns23" );
  this.$$xmlNames["xmlns_ns23"] = "xmlns:ns23";
  this.$$objNames["xmlns:ns23"] = "xmlns_ns23";
  this.xmlns_ns24 = new String("http://schemas.hp.com/ism-pws/ServiceTransition/ConfigurationManagement/1/SupportGroupExtensions");
  this.$$attributes.push( "xmlns_ns24" );
  this.$$xmlNames["xmlns_ns24"] = "xmlns:ns24";
  this.$$objNames["xmlns:ns24"] = "xmlns_ns24";
  this.xmlns_soap = new String("http://schemas.xmlsoap.org/soap/envelope/");
  this.$$attributes.push( "xmlns_soap" );
  this.$$xmlNames["xmlns_soap"] = "xmlns:soap";
  this.$$objNames["xmlns:soap"] = "xmlns_soap";
  this.xmlns_xsi = new String("http://www.w3.org/2001/XMLSchema-instance");
  this.$$attributes.push( "xmlns_xsi" );
  this.$$xmlNames["xmlns_xsi"] = "xmlns:xsi";
  this.$$objNames["xmlns:xsi"] = "xmlns_xsi";
  this.Body = new soap_Body();
  this.$$elementChildren.push( "Body" );
}

function soap_Fault(  ) 
{
  this.$$nsPrefix = "soap";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "soap_Fault";
  this.$$xmlNames[ "soap_Fault" ] = "soap:Fault";
  this.faultcode = new xsd_string();
  this.$$elementChildren.push( "faultcode" );
  this.faultstring = new xsd_string();
  this.$$elementChildren.push( "faultstring" );
  this.faultactor = new xsd_string();
  this.$$elementChildren.push( "faultactor" );
  this.detail = new XML();
  this.$$elementChildren.push( "detail" );
}

function soap_Header(  ) 
{
  this.$$nsPrefix = "soap";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "soap_Header";
  this.$$xmlNames[ "soap_Header" ] = "soap:Header";
}

function OnStatusChangeRequestType(  ) 
{
  this.$$nsPrefix = "ns5";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "OnStatusChangeRequestType";
  this.$$xmlNames[ "OnStatusChangeRequestType" ] = "OnStatusChangeRequestType";
  this.$$refs[ "EntityReference" ] = true;
  this.EntityReference = new EntityReference();
  this.$$elementChildren.push( "EntityReference" );
  this.NewStatus = new xs_string();
  this.$$elementChildren.push( "NewStatus" );
}

function xs_string( val ) 
{
  this.$$nsPrefix = "ns5";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xsi_type = new String("xsd:string");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function AddCommentRequestType(  ) 
{
  this.$$nsPrefix = "ns5";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "AddCommentRequestType";
  this.$$xmlNames[ "AddCommentRequestType" ] = "AddCommentRequestType";
  this.$$refs[ "EntityReference" ] = true;
  this.EntityReference = new EntityReference();
  this.$$elementChildren.push( "EntityReference" );
  this.Comment = new xs_string();
  this.$$elementChildren.push( "Comment" );
}

function TaskSubmitRequestType(  ) 
{
  this.$$nsPrefix = "ns5";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "TaskSubmitRequestType";
  this.$$xmlNames[ "TaskSubmitRequestType" ] = "TaskSubmitRequestType";
  this.$$refs[ "Task" ] = true;
  this.Task = new Task();
  this.$$elementChildren.push( "Task" );
}

function TaskSubmitRequest(  ) 
{
  this.$$nsPrefix = "ns5";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "TaskSubmitRequest";
  this.$$xmlNames[ "TaskSubmitRequest" ] = "TaskSubmitRequest";
  this.xsi_type = new String("ns5:TaskSubmitRequestType");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
  this.xmlns_ns5 = new String("http://schemas.hp.com/ism-pws/ServiceOperation/TaskManagement/1/TaskDispatch");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
  this.$$refs[ "Task" ] = true;
  this.Task = new Task();
  this.$$elementChildren.push( "Task" );
}

function AddCommentRequest(  ) 
{
  this.$$nsPrefix = "ns5";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "AddCommentRequest";
  this.$$xmlNames[ "AddCommentRequest" ] = "AddCommentRequest";
  this.xsi_type = new String("ns5:AddCommentRequestType");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
  this.xmlns_ns5 = new String("http://schemas.hp.com/ism-pws/ServiceOperation/TaskManagement/1/TaskDispatch");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
  this.$$refs[ "EntityReference" ] = true;
  this.EntityReference = new EntityReference();
  this.$$elementChildren.push( "EntityReference" );
  this.Comment = new xs_string();
  this.$$elementChildren.push( "Comment" );
}

function OnStatusChangeRequest(  ) 
{
  this.$$nsPrefix = "ns5";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "OnStatusChangeRequest";
  this.$$xmlNames[ "OnStatusChangeRequest" ] = "OnStatusChangeRequest";
  this.xsi_type = new String("ns5:OnStatusChangeRequestType");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
  this.xmlns_ns5 = new String("http://schemas.hp.com/ism-pws/ServiceOperation/TaskManagement/1/TaskDispatch");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
  this.$$refs[ "EntityReference" ] = true;
  this.EntityReference = new EntityReference();
  this.$$elementChildren.push( "EntityReference" );
  this.NewStatus = new xs_string();
  this.$$elementChildren.push( "NewStatus" );
}

function MessageID( val ) 
{
  this.$$nsPrefix = "ns7";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xsi_type = new String("ns7:IsmAttributedURI");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function To( val ) 
{
  this.$$nsPrefix = "ns7";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xsi_type = new String("ns7:IsmAttributedURI");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function Action( val ) 
{
  this.$$nsPrefix = "ns7";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xsi_type = new String("ns7:IsmAttributedURI");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function From(  ) 
{
  this.$$nsPrefix = "ns7";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "From";
  this.$$xmlNames[ "From" ] = "From";
  this.xsi_type = new String("ns7:IsmEndpointReferenceType");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
  this.$$minOccurs[ "Address" ] = 0;
  this.Address = new IsmAttributedURI();
  this.$$elementChildren.push( "Address" );
  this.$$minOccurs[ "ResourceURI" ] = 0;
  this.ResourceURI = new IsmAttributableURI();
  this.$$elementChildren.push( "ResourceURI" );
  this.Selector = new Array();  // of IsmEndpointReferenceType_IsmSelectorType
  this.Selector.$$nsPrefix = "ns7"
  this.Selector_newInstance = function()
  {
    var newLen = this.Selector.push( new IsmEndpointReferenceType_IsmSelectorType() );
    return this.Selector[ newLen-1 ];
  }
  this.$$elementChildren.push( "Selector" );
}

function ReplyTo(  ) 
{
  this.$$nsPrefix = "ns7";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "ReplyTo";
  this.$$xmlNames[ "ReplyTo" ] = "ReplyTo";
  this.xsi_type = new String("ns7:IsmEndpointReferenceType");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
  this.$$minOccurs[ "Address" ] = 0;
  this.Address = new IsmAttributedURI();
  this.$$elementChildren.push( "Address" );
  this.$$minOccurs[ "ResourceURI" ] = 0;
  this.ResourceURI = new IsmAttributableURI();
  this.$$elementChildren.push( "ResourceURI" );
  this.Selector = new Array();  // of IsmEndpointReferenceType_IsmSelectorType
  this.Selector.$$nsPrefix = "ns7"
  this.Selector_newInstance = function()
  {
    var newLen = this.Selector.push( new IsmEndpointReferenceType_IsmSelectorType() );
    return this.Selector[ newLen-1 ];
  }
  this.$$elementChildren.push( "Selector" );
}

function FaultTo(  ) 
{
  this.$$nsPrefix = "ns7";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "FaultTo";
  this.$$xmlNames[ "FaultTo" ] = "FaultTo";
  this.xsi_type = new String("ns7:IsmEndpointReferenceType");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
  this.$$minOccurs[ "Address" ] = 0;
  this.Address = new IsmAttributedURI();
  this.$$elementChildren.push( "Address" );
  this.$$minOccurs[ "ResourceURI" ] = 0;
  this.ResourceURI = new IsmAttributableURI();
  this.$$elementChildren.push( "ResourceURI" );
  this.Selector = new Array();  // of IsmEndpointReferenceType_IsmSelectorType
  this.Selector.$$nsPrefix = "ns7"
  this.Selector_newInstance = function()
  {
    var newLen = this.Selector.push( new IsmEndpointReferenceType_IsmSelectorType() );
    return this.Selector[ newLen-1 ];
  }
  this.$$elementChildren.push( "Selector" );
}

function IsmSelectorType(  ) 
{
  this.$$nsPrefix = "ns7";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "IsmSelectorType";
  this.$$xmlNames[ "IsmSelectorType" ] = "IsmSelectorType";
  this.Name = new String();
  this.$$attributes.push( "Name" );
  this.$$refs[ "xxEndpointReference" ] = true;
  this.$$minOccurs[ "xxEndpointReference" ] = 0;
  this.xxEndpointReference = new xxEndpointReference();
  this.$$elementChildren.push( "xxEndpointReference" );
}

function IsmAttributableURI( val ) 
{
  this.$$nsPrefix = "ns7";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
}

function IsmAttributedURI( val ) 
{
  this.$$nsPrefix = "ns7";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
}

function IsmEndpointReferenceType(  ) 
{
  this.$$nsPrefix = "ns7";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "IsmEndpointReferenceType";
  this.$$xmlNames[ "IsmEndpointReferenceType" ] = "IsmEndpointReferenceType";
  this.$$minOccurs[ "Address" ] = 0;
  this.Address = new IsmAttributedURI();
  this.$$elementChildren.push( "Address" );
  this.$$minOccurs[ "ResourceURI" ] = 0;
  this.ResourceURI = new IsmAttributableURI();
  this.$$elementChildren.push( "ResourceURI" );
  this.Selector = new Array();  // of IsmEndpointReferenceType_IsmSelectorType
  this.Selector.$$nsPrefix = "ns7"
  this.Selector_newInstance = function()
  {
    var newLen = this.Selector.push( new IsmEndpointReferenceType_IsmSelectorType() );
    return this.Selector[ newLen-1 ];
  }
  this.$$elementChildren.push( "Selector" );
}

function IsmEndpointReferenceType_IsmSelectorType(  ) 
{
  this.$$nsPrefix = "ns7";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "IsmEndpointReferenceType_IsmSelectorType";
  this.$$xmlNames[ "IsmEndpointReferenceType_IsmSelectorType" ] = "Selector";
  this.Name = new String();
  this.$$attributes.push( "Name" );
  this.$$refs[ "xxEndpointReference" ] = true;
  this.$$minOccurs[ "xxEndpointReference" ] = 0;
  this.xxEndpointReference = new xxEndpointReference();
  this.$$elementChildren.push( "xxEndpointReference" );
}

function IsmSimpleEndpointReferenceType(  ) 
{
  this.$$nsPrefix = "ns7";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "IsmSimpleEndpointReferenceType";
  this.$$xmlNames[ "IsmSimpleEndpointReferenceType" ] = "IsmSimpleEndpointReferenceType";
  this.$$minOccurs[ "Address" ] = 0;
  this.Address = new xs_anyURI();
  this.$$elementChildren.push( "Address" );
  this.ResourceURI = new xs_anyURI();
  this.$$elementChildren.push( "ResourceURI" );
  this.ID = new xs_string();
  this.$$elementChildren.push( "ID" );
}

function xs_anyURI( val ) 
{
  this.$$nsPrefix = "ns7";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xsi_type = new String("xsd:anyURI");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function xxEndpointReference(  ) 
{
  this.$$nsPrefix = "ns7";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "xxEndpointReference";
  this.$$xmlNames[ "xxEndpointReference" ] = "xxEndpointReference";
  this.xsi_type = new String("ns7:IsmEndpointReferenceType");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
  this.$$minOccurs[ "Address" ] = 0;
  this.Address = new IsmAttributedURI();
  this.$$elementChildren.push( "Address" );
  this.$$minOccurs[ "ResourceURI" ] = 0;
  this.ResourceURI = new IsmAttributableURI();
  this.$$elementChildren.push( "ResourceURI" );
  this.Selector = new Array();  // of IsmEndpointReferenceType_IsmSelectorType
  this.Selector.$$nsPrefix = "ns7"
  this.Selector_newInstance = function()
  {
    var newLen = this.Selector.push( new IsmEndpointReferenceType_IsmSelectorType() );
    return this.Selector[ newLen-1 ];
  }
  this.$$elementChildren.push( "Selector" );
}

function SimpleEndpointReference(  ) 
{
  this.$$nsPrefix = "ns7";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "SimpleEndpointReference";
  this.$$xmlNames[ "SimpleEndpointReference" ] = "SimpleEndpointReference";
  this.xsi_type = new String("ns7:IsmSimpleEndpointReferenceType");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
  this.$$minOccurs[ "Address" ] = 0;
  this.Address = new xs_anyURI();
  this.$$elementChildren.push( "Address" );
  this.ResourceURI = new xs_anyURI();
  this.$$elementChildren.push( "ResourceURI" );
  this.ID = new xs_string();
  this.$$elementChildren.push( "ID" );
}

function EntityReference(  ) 
{
  this.$$nsPrefix = "ns7";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "EntityReference";
  this.$$xmlNames[ "EntityReference" ] = "EntityReference";
  this.xsi_type = new String("ns7:IsmSimpleEndpointReferenceType");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
  this.$$minOccurs[ "Address" ] = 0;
  this.Address = new xs_anyURI();
  this.$$elementChildren.push( "Address" );
  this.ResourceURI = new xs_anyURI();
  this.$$elementChildren.push( "ResourceURI" );
  this.ID = new xs_string();
  this.$$elementChildren.push( "ID" );
}

function IsmEndpointReferenceListType(  ) 
{
  this.$$nsPrefix = "ns7";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "IsmEndpointReferenceListType";
  this.$$xmlNames[ "IsmEndpointReferenceListType" ] = "IsmEndpointReferenceListType";
  this.$$refs[ "xxEndpointReference" ] = true;
  this.xxEndpointReference = new Array();  // of xxEndpointReference
  this.xxEndpointReference.$$nsPrefix = "ns7"
  this.xxEndpointReference_newInstance = function()
  {
    var newLen = this.xxEndpointReference.push( new xxEndpointReference() );
    return this.xxEndpointReference[ newLen-1 ];
  }
  this.$$elementChildren.push( "xxEndpointReference" );
}

function IsmSimpleEndpointReferenceListType(  ) 
{
  this.$$nsPrefix = "ns7";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "IsmSimpleEndpointReferenceListType";
  this.$$xmlNames[ "IsmSimpleEndpointReferenceListType" ] = "IsmSimpleEndpointReferenceListType";
  this.$$refs[ "EntityReference" ] = true;
  this.EntityReference = new Array();  // of EntityReference
  this.EntityReference.$$nsPrefix = "ns7"
  this.EntityReference_newInstance = function()
  {
    var newLen = this.EntityReference.push( new EntityReference() );
    return this.EntityReference[ newLen-1 ];
  }
  this.$$elementChildren.push( "EntityReference" );
}

function IsmCreateResponseType(  ) 
{
  this.$$nsPrefix = "ns7";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "IsmCreateResponseType";
  this.$$xmlNames[ "IsmCreateResponseType" ] = "IsmCreateResponseType";
  this.ResourceCreated = new IsmCreateResponseType_IsmEndpointReferenceType();
  this.$$elementChildren.push( "ResourceCreated" );
}

function IsmCreateResponseType_IsmEndpointReferenceType(  ) 
{
  this.$$nsPrefix = "ns7";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "IsmCreateResponseType_IsmEndpointReferenceType";
  this.$$xmlNames[ "IsmCreateResponseType_IsmEndpointReferenceType" ] = "ResourceCreated";
  this.$$minOccurs[ "Address" ] = 0;
  this.Address = new IsmAttributedURI();
  this.$$elementChildren.push( "Address" );
  this.$$minOccurs[ "ResourceURI" ] = 0;
  this.ResourceURI = new IsmAttributableURI();
  this.$$elementChildren.push( "ResourceURI" );
  this.Selector = new Array();  // of IsmEndpointReferenceType_IsmSelectorType
  this.Selector.$$nsPrefix = "ns7"
  this.Selector_newInstance = function()
  {
    var newLen = this.Selector.push( new IsmEndpointReferenceType_IsmSelectorType() );
    return this.Selector[ newLen-1 ];
  }
  this.$$elementChildren.push( "Selector" );
}

function RelatesTo( val ) 
{
  this.$$nsPrefix = "ns7";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xsi_type = new String("ns7:IsmRelationship");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function IsmRelationship( val ) 
{
  this.$$nsPrefix = "ns7";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.RelationshipType = new String();
  this.$$attributes.push( "RelationshipType" );
}

function Locale( val ) 
{
  this.$$nsPrefix = "ns7";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xsi_type = new String("ns7:IsmLocaleType");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function IsmLocaleType( val ) 
{
  this.$$nsPrefix = "ns7";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
}

function ResourceURI( val ) 
{
  this.$$nsPrefix = "ns7";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xsi_type = new String("ns7:IsmAttributableURI");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function IsmOptionType( val ) 
{
  this.$$nsPrefix = "ns7";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.Name = new String();
  this.$$attributes.push( "Name" );
  this.MustComply = new Boolean("false");
  this.$$attributes.push( "MustComply" );
  this.Type = new String();
  this.$$attributes.push( "Type" );
}

function Option( val ) 
{
  this.$$nsPrefix = "ns7";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xsi_type = new String("ns7:IsmOptionType");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function OptionSet(  ) 
{
  this.$$nsPrefix = "ns7";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "OptionSet";
  this.$$xmlNames[ "OptionSet" ] = "OptionSet";
  this.xsi_type = new String("ns7:IsmOptionSetType");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
  this.$$refs[ "Option" ] = true;
  this.Option = new Array();  // of Option
  this.Option.$$nsPrefix = "ns7"
  this.Option_newInstance = function()
  {
    var newLen = this.Option.push( new Option() );
    return this.Option[ newLen-1 ];
  }
  this.$$elementChildren.push( "Option" );
}

function IsmOptionSetType(  ) 
{
  this.$$nsPrefix = "ns7";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "IsmOptionSetType";
  this.$$xmlNames[ "IsmOptionSetType" ] = "IsmOptionSetType";
  this.$$refs[ "Option" ] = true;
  this.Option = new Array();  // of Option
  this.Option.$$nsPrefix = "ns7"
  this.Option_newInstance = function()
  {
    var newLen = this.Option.push( new Option() );
    return this.Option[ newLen-1 ];
  }
  this.$$elementChildren.push( "Option" );
}

function xs_duration( val ) 
{
  this.$$nsPrefix = "ns7";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xsi_type = new String("xsd:duration");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function OperationTimeout( val ) 
{
  this.$$nsPrefix = "ns7";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xsi_type = new String("xsd:duration");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function xs_positiveInteger( val ) 
{
  this.$$nsPrefix = "ns7";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xsi_type = new String("xsd:positiveInteger");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function MaxEnvelopeSize( val ) 
{
  this.$$nsPrefix = "ns7";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xsi_type = new String("xsd:positiveInteger");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function Selector(  ) 
{
  this.$$nsPrefix = "ns7";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "Selector";
  this.$$xmlNames[ "Selector" ] = "Selector";
  this.xsi_type = new String("ns7:IsmSelectorType");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
  this.Name = new String();
  this.$$attributes.push( "Name" );
  this.$$refs[ "xxEndpointReference" ] = true;
  this.$$minOccurs[ "xxEndpointReference" ] = 0;
  this.xxEndpointReference = new xxEndpointReference();
  this.$$elementChildren.push( "xxEndpointReference" );
}

function IsmSelectorSetType(  ) 
{
  this.$$nsPrefix = "ns7";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "IsmSelectorSetType";
  this.$$xmlNames[ "IsmSelectorSetType" ] = "IsmSelectorSetType";
  this.$$refs[ "Selector" ] = true;
  this.Selector = new Array();  // of Selector
  this.Selector.$$nsPrefix = "ns7"
  this.Selector_newInstance = function()
  {
    var newLen = this.Selector.push( new Selector() );
    return this.Selector[ newLen-1 ];
  }
  this.$$elementChildren.push( "Selector" );
}

function SelectorSet(  ) 
{
  this.$$nsPrefix = "ns7";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "SelectorSet";
  this.$$xmlNames[ "SelectorSet" ] = "SelectorSet";
  this.xsi_type = new String("ns7:IsmSelectorSetType");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
  this.$$refs[ "Selector" ] = true;
  this.Selector = new Array();  // of Selector
  this.Selector.$$nsPrefix = "ns7"
  this.Selector_newInstance = function()
  {
    var newLen = this.Selector.push( new Selector() );
    return this.Selector[ newLen-1 ];
  }
  this.$$elementChildren.push( "Selector" );
}

function EmittingNode(  ) 
{
  this.$$nsPrefix = "ns11";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "EmittingNode";
  this.$$xmlNames[ "EmittingNode" ] = "EmittingNode";
  this.xsi_type = new String("ns11:NodeReferenceType");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
  this.$$refs[ "EntityReference" ] = true;
  this.$$minOccurs[ "EntityReference" ] = 0;
  this.EntityReference = new EntityReference();
  this.$$elementChildren.push( "EntityReference" );
  this.$$minOccurs[ "NodeProperties" ] = 0;
  this.NodeProperties = new NodeReferenceType_NodePropertiesType();
  this.$$elementChildren.push( "NodeProperties" );
}

function EmittingCI(  ) 
{
  this.$$nsPrefix = "ns11";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "EmittingCI";
  this.$$xmlNames[ "EmittingCI" ] = "EmittingCI";
  this.xsi_type = new String("ns11:ConfigurationItemReferenceType");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
  this.$$refs[ "EntityReference" ] = true;
  this.$$minOccurs[ "EntityReference" ] = 0;
  this.EntityReference = new EntityReference();
  this.$$elementChildren.push( "EntityReference" );
  this.$$minOccurs[ "ConfigurationItemProperties" ] = 0;
  this.ConfigurationItemProperties = new ConfigurationItemPropertiesType();
  this.$$elementChildren.push( "ConfigurationItemProperties" );
}

function AffectedCI(  ) 
{
  this.$$nsPrefix = "ns11";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "AffectedCI";
  this.$$xmlNames[ "AffectedCI" ] = "AffectedCI";
  this.xsi_type = new String("ns11:ConfigurationItemReferenceType");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
  this.$$refs[ "EntityReference" ] = true;
  this.$$minOccurs[ "EntityReference" ] = 0;
  this.EntityReference = new EntityReference();
  this.$$elementChildren.push( "EntityReference" );
  this.$$minOccurs[ "ConfigurationItemProperties" ] = 0;
  this.ConfigurationItemProperties = new ConfigurationItemPropertiesType();
  this.$$elementChildren.push( "ConfigurationItemProperties" );
}

function RootCauseCI(  ) 
{
  this.$$nsPrefix = "ns11";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "RootCauseCI";
  this.$$xmlNames[ "RootCauseCI" ] = "RootCauseCI";
  this.xsi_type = new String("ns11:ConfigurationItemReferenceType");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
  this.$$refs[ "EntityReference" ] = true;
  this.$$minOccurs[ "EntityReference" ] = 0;
  this.EntityReference = new EntityReference();
  this.$$elementChildren.push( "EntityReference" );
  this.$$minOccurs[ "ConfigurationItemProperties" ] = 0;
  this.ConfigurationItemProperties = new ConfigurationItemPropertiesType();
  this.$$elementChildren.push( "ConfigurationItemProperties" );
}

function ImpactedCIs(  ) 
{
  this.$$nsPrefix = "ns11";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "ImpactedCIs";
  this.$$xmlNames[ "ImpactedCIs" ] = "ImpactedCIs";
  this.xsi_type = new String("ns11:ConfigurationItemListReferenceType");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
  this.$$refs[ "EntityReference" ] = true;
  this.$$minOccurs[ "EntityReference" ] = 0;
  this.EntityReference = new EntityReference();
  this.$$elementChildren.push( "EntityReference" );
  this.Item = new Array();  // of ConfigurationItemListReferenceType_ConfigurationItemReferenceType
  this.Item.$$nsPrefix = "ns11"
  this.Item_newInstance = function()
  {
    var newLen = this.Item.push( new ConfigurationItemListReferenceType_ConfigurationItemReferenceType() );
    return this.Item[ newLen-1 ];
  }
  this.$$elementChildren.push( "Item" );
}

function TaskBaseType(  ) 
{
  this.$$nsPrefix = "ns11";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "TaskBaseType";
  this.$$xmlNames[ "TaskBaseType" ] = "TaskBaseType";
  this.$$refs[ "AssignedTo" ] = true;
  this.$$minOccurs[ "AssignedTo" ] = 0;
  this.AssignedTo = new AssignedTo();
  this.$$elementChildren.push( "AssignedTo" );
  this.$$refs[ "ID" ] = true;
  this.$$minOccurs[ "ID" ] = 0;
  this.ID = new ID();
  this.$$elementChildren.push( "ID" );
  this.$$refs[ "IntegrationID" ] = true;
  this.$$minOccurs[ "IntegrationID" ] = 0;
  this.IntegrationID = new IntegrationID();
  this.$$elementChildren.push( "IntegrationID" );
  this.$$refs[ "Title" ] = true;
  this.$$minOccurs[ "Title" ] = 0;
  this.Title = new Title();
  this.$$elementChildren.push( "Title" );
  this.$$refs[ "Type" ] = true;
  this.$$minOccurs[ "Type" ] = 0;
  this.Type = new Type();
  this.$$elementChildren.push( "Type" );
  this.$$refs[ "Description" ] = true;
  this.$$minOccurs[ "Description" ] = 0;
  this.Description = new Description();
  this.$$elementChildren.push( "Description" );
  this.$$refs[ "LifecycleState" ] = true;
  this.$$minOccurs[ "LifecycleState" ] = 0;
  this.LifecycleState = new LifecycleState();
  this.$$elementChildren.push( "LifecycleState" );
  this.$$refs[ "Severity" ] = true;
  this.$$minOccurs[ "Severity" ] = 0;
  this.Severity = new Severity();
  this.$$elementChildren.push( "Severity" );
}

function Task(  ) 
{
  this.$$nsPrefix = "ns11";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "Task";
  this.$$xmlNames[ "Task" ] = "Task";
  this.xsi_type = new String("ns11:TaskType");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";

// Added by NRM due to WSDL2JS bug
  
  this.$$refs[ "AssignedTo" ] = true;
  this.$$minOccurs[ "AssignedTo" ] = 0;
  this.AssignedTo = new AssignedTo();
  this.$$elementChildren.push( "AssignedTo" );
  this.$$refs[ "ID" ] = true;
  this.$$minOccurs[ "ID" ] = 0;
  this.ID = new ID();
  this.$$elementChildren.push( "ID" );
  this.$$refs[ "IntegrationID" ] = true;
  this.$$minOccurs[ "IntegrationID" ] = 0;
  this.IntegrationID = new IntegrationID();
  this.$$elementChildren.push( "IntegrationID" );
  this.$$refs[ "Title" ] = true;
  this.$$minOccurs[ "Title" ] = 0;
  this.Title = new Title();
  this.$$elementChildren.push( "Title" );
  this.$$refs[ "Type" ] = true;
  this.$$minOccurs[ "Type" ] = 0;
  this.Type = new Type();
  this.$$elementChildren.push( "Type" );
  this.$$refs[ "Description" ] = true;
  this.$$minOccurs[ "Description" ] = 0;
  this.Description = new Description();
  this.$$elementChildren.push( "Description" );
  this.$$refs[ "LifecycleState" ] = true;
  this.$$minOccurs[ "LifecycleState" ] = 0;
  this.LifecycleState = new LifecycleState();
  this.$$elementChildren.push( "LifecycleState" );
  this.$$refs[ "Severity" ] = true;
  this.$$minOccurs[ "Severity" ] = 0;
  this.Severity = new Severity();
  this.$$elementChildren.push( "Severity" );
  
  // End of lines added by NRM due to WSDL2JS bug
  
  this.$$minOccurs[ "Extensions" ] = 0;
  this.Extensions = new TaskExtensionsType();
  this.$$elementChildren.push( "Extensions" );
}

function TaskType(  ) 
{
  this.$$nsPrefix = "ns11";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "TaskType";
  this.$$xmlNames[ "TaskType" ] = "TaskType";
  this.$$refs[ "ID" ] = true;
  this.$$minOccurs[ "ID" ] = 0;
  this.ID = new ID();
  this.$$elementChildren.push( "ID" );
  this.$$refs[ "IntegrationID" ] = true;
  this.$$minOccurs[ "IntegrationID" ] = 0;
  this.IntegrationID = new IntegrationID();
  this.$$elementChildren.push( "IntegrationID" );
  this.$$refs[ "Title" ] = true;
  this.$$minOccurs[ "Title" ] = 0;
  this.Title = new Title();
  this.$$elementChildren.push( "Title" );
  this.$$refs[ "Type" ] = true;
  this.$$minOccurs[ "Type" ] = 0;
  this.Type = new Type();
  this.$$elementChildren.push( "Type" );
  this.$$refs[ "Description" ] = true;
  this.$$minOccurs[ "Description" ] = 0;
  this.Description = new Description();
  this.$$elementChildren.push( "Description" );
  this.$$refs[ "LifecycleState" ] = true;
  this.$$minOccurs[ "LifecycleState" ] = 0;
  this.LifecycleState = new LifecycleState();
  this.$$elementChildren.push( "LifecycleState" );
  this.$$refs[ "Severity" ] = true;
  this.$$minOccurs[ "Severity" ] = 0;
  this.Severity = new Severity();
  this.$$elementChildren.push( "Severity" );
  this.$$minOccurs[ "Extensions" ] = 0;
  this.Extensions = new TaskExtensionsType();
  this.$$elementChildren.push( "Extensions" );
}

function TaskArrayType(  ) 
{
  this.$$nsPrefix = "ns11";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "TaskArrayType";
  this.$$xmlNames[ "TaskArrayType" ] = "TaskArrayType";
  this.$$refs[ "Task" ] = true;
  this.Task = new Array();  // of Task
  this.Task.$$nsPrefix = "ns11"
  this.Task_newInstance = function()
  {
    var newLen = this.Task.push( new Task() );
    return this.Task[ newLen-1 ];
  }
  this.$$elementChildren.push( "Task" );
}

function TaskItemType(  ) 
{
  this.$$nsPrefix = "ns11";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "TaskItemType";
  this.$$xmlNames[ "TaskItemType" ] = "TaskItemType";
  this.$$refs[ "EntityReference" ] = true;
  this.EntityReference = new EntityReference();
  this.$$elementChildren.push( "EntityReference" );
  this.$$refs[ "Task" ] = true;
  this.Task = new Task();
  this.$$elementChildren.push( "Task" );
}

function TaskListType(  ) 
{
  this.$$nsPrefix = "ns11";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "TaskListType";
  this.$$xmlNames[ "TaskListType" ] = "TaskListType";
  this.$$refs[ "EntityReference" ] = true;
  this.EntityReference = new Array();  // of EntityReference
  this.EntityReference.$$nsPrefix = "ns11"
  this.EntityReference_newInstance = function()
  {
    var newLen = this.EntityReference.push( new EntityReference() );
    return this.EntityReference[ newLen-1 ];
  }
  this.$$elementChildren.push( "EntityReference" );
  this.Item = new Array();  // of TaskListType_TaskItemType
  this.Item.$$nsPrefix = "ns11"
  this.Item_newInstance = function()
  {
    var newLen = this.Item.push( new TaskListType_TaskItemType() );
    return this.Item[ newLen-1 ];
  }
  this.$$elementChildren.push( "Item" );
}

function TaskListType_TaskItemType(  ) 
{
  this.$$nsPrefix = "ns11";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "TaskListType_TaskItemType";
  this.$$xmlNames[ "TaskListType_TaskItemType" ] = "Item";
  this.$$refs[ "EntityReference" ] = true;
  this.EntityReference = new EntityReference();
  this.$$elementChildren.push( "EntityReference" );
  this.$$refs[ "Task" ] = true;
  this.Task = new Task();
  this.$$elementChildren.push( "Task" );
}

function TaskList(  ) 
{
  this.$$nsPrefix = "ns11";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "TaskList";
  this.$$xmlNames[ "TaskList" ] = "TaskList";
  this.xsi_type = new String("ns11:TaskListType");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
  this.$$refs[ "EntityReference" ] = true;
  this.EntityReference = new Array();  // of EntityReference
  this.EntityReference.$$nsPrefix = "ns11"
  this.EntityReference_newInstance = function()
  {
    var newLen = this.EntityReference.push( new EntityReference() );
    return this.EntityReference[ newLen-1 ];
  }
  this.$$elementChildren.push( "EntityReference" );
  this.Item = new Array();  // of TaskListType_TaskItemType
  this.Item.$$nsPrefix = "ns11"
  this.Item_newInstance = function()
  {
    var newLen = this.Item.push( new TaskListType_TaskItemType() );
    return this.Item[ newLen-1 ];
  }
  this.$$elementChildren.push( "Item" );
}

function TaskWrappedType(  ) 
{
  this.$$nsPrefix = "ns11";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "TaskWrappedType";
  this.$$xmlNames[ "TaskWrappedType" ] = "TaskWrappedType";
  this.$$refs[ "Task" ] = true;
  this.$$minOccurs[ "Task" ] = 0;
  this.Task = new Task();
  this.$$elementChildren.push( "Task" );
}

function TaskWrapped(  ) 
{
  this.$$nsPrefix = "ns11";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "TaskWrapped";
  this.$$xmlNames[ "TaskWrapped" ] = "TaskWrapped";
  this.xsi_type = new String("ns11:TaskWrappedType");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
  this.$$refs[ "Task" ] = true;
  this.$$minOccurs[ "Task" ] = 0;
  this.Task = new Task();
  this.$$elementChildren.push( "Task" );
}

function ResourceID( val ) 
{
  this.$$nsPrefix = "ns11";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xsi_type = new String("ns11:anyURI");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function AssignedTo(  ) 
{
  this.$$nsPrefix = "ns15";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "AssignedTo";
  this.$$xmlNames[ "AssignedTo" ] = "AssignedTo";
  this.xsi_type = new String("ns15:PersonReferenceType");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
  this.$$refs[ "EntityReference" ] = true;
  this.$$minOccurs[ "EntityReference" ] = 0;
  this.EntityReference = new EntityReference();
  this.$$elementChildren.push( "EntityReference" );
  this.$$minOccurs[ "PersonProperties" ] = 0;
  this.PersonProperties = new PersonReferenceType_PersonPropertiesType();
  this.$$elementChildren.push( "PersonProperties" );
}

function PrimaryAssignmentGroup(  ) 
{
  this.$$nsPrefix = "ns15";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "PrimaryAssignmentGroup";
  this.$$xmlNames[ "PrimaryAssignmentGroup" ] = "PrimaryAssignmentGroup";
  this.xsi_type = new String("ns15:SupportGroupReferenceType");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
  this.$$refs[ "EntityReference" ] = true;
  this.$$minOccurs[ "EntityReference" ] = 0;
  this.EntityReference = new EntityReference();
  this.$$elementChildren.push( "EntityReference" );
  this.$$minOccurs[ "SupportGroupProperties" ] = 0;
  this.SupportGroupProperties = new SupportGroupReferenceType_SupportGroupPropertiesType();
  this.$$elementChildren.push( "SupportGroupProperties" );
}

function TicketBaseType(  ) 
{
  this.$$nsPrefix = "ns15";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "TicketBaseType";
  this.$$xmlNames[ "TicketBaseType" ] = "TicketBaseType";
  this.$$refs[ "AssignedTo" ] = true;
  this.$$minOccurs[ "AssignedTo" ] = 0;
  this.AssignedTo = new AssignedTo();
  this.$$elementChildren.push( "AssignedTo" );
}

function Ticket(  ) 
{
  this.$$nsPrefix = "ns15";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "Ticket";
  this.$$xmlNames[ "Ticket" ] = "Ticket";
  this.xsi_type = new String("ns15:TicketType");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
  this.$$minOccurs[ "Extensions" ] = 0;
  this.Extensions = new TicketExtensionsType();
  this.$$elementChildren.push( "Extensions" );
}

function TicketType(  ) 
{
  this.$$nsPrefix = "ns15";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "TicketType";
  this.$$xmlNames[ "TicketType" ] = "TicketType";
  this.$$refs[ "AssignedTo" ] = true;
  this.$$minOccurs[ "AssignedTo" ] = 0;
  this.AssignedTo = new AssignedTo();
  this.$$elementChildren.push( "AssignedTo" );
  this.$$minOccurs[ "Extensions" ] = 0;
  this.Extensions = new TicketExtensionsType();
  this.$$elementChildren.push( "Extensions" );
}

function ID( val ) 
{
  this.$$nsPrefix = "ns13";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xsi_type = new String("xsd:string");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function IntegrationID( val ) 
{
  this.$$nsPrefix = "ns13";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xsi_type = new String("xsd:string");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function Title( val ) 
{
  this.$$nsPrefix = "ns13";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xsi_type = new String("xsd:string");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function xs_dateTime( val ) 
{
  this.$$nsPrefix = "ns13";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xsi_type = new String("xsd:dateTime");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function CreationDate( val ) 
{
  this.$$nsPrefix = "ns13";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xsi_type = new String("xsd:dateTime");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function Description( val ) 
{
  this.$$nsPrefix = "ns13";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xsi_type = new String("xsd:string");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function Solution( val ) 
{
  this.$$nsPrefix = "ns13";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xsi_type = new String("xsd:string");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function Category( val ) 
{
  this.$$nsPrefix = "ns13";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xsi_type = new String("xsd:string");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function SubCategory( val ) 
{
  this.$$nsPrefix = "ns13";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xsi_type = new String("xsd:string");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function Type( val ) 
{
  this.$$nsPrefix = "ns13";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xsi_type = new String("xsd:string");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function ProblemType( val ) 
{
  this.$$nsPrefix = "ns13";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xsi_type = new String("xsd:string");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function LifecycleState( val ) 
{
  this.$$nsPrefix = "ns13";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xsi_type = new String("xsd:string");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function Severity( val ) 
{
  this.$$nsPrefix = "ns13";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xsi_type = new String("xsd:string");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function CollaborationModeType( val ) 
{
  this.$$nsPrefix = "ns13";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.FYI = new xs_string( "FYI" );
  this.Peer = new xs_string( "Peer" );
  this.TaskExchange = new xs_string( "TaskExchange" );
}

function CollaborationMode( val ) 
{
  this.$$nsPrefix = "ns13";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xsi_type = new String("ns13:CollaborationModeType");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function TaskPropertiesBaseType(  ) 
{
  this.$$nsPrefix = "ns13";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "TaskPropertiesBaseType";
  this.$$xmlNames[ "TaskPropertiesBaseType" ] = "TaskPropertiesBaseType";
  this.$$refs[ "ID" ] = true;
  this.$$minOccurs[ "ID" ] = 0;
  this.ID = new ID();
  this.$$elementChildren.push( "ID" );
  this.$$refs[ "IntegrationID" ] = true;
  this.$$minOccurs[ "IntegrationID" ] = 0;
  this.IntegrationID = new IntegrationID();
  this.$$elementChildren.push( "IntegrationID" );
  this.$$refs[ "Title" ] = true;
  this.$$minOccurs[ "Title" ] = 0;
  this.Title = new Title();
  this.$$elementChildren.push( "Title" );
  this.$$refs[ "Type" ] = true;
  this.$$minOccurs[ "Type" ] = 0;
  this.Type = new Type();
  this.$$elementChildren.push( "Type" );
  this.$$refs[ "Description" ] = true;
  this.$$minOccurs[ "Description" ] = 0;
  this.Description = new Description();
  this.$$elementChildren.push( "Description" );
  this.$$refs[ "LifecycleState" ] = true;
  this.$$minOccurs[ "LifecycleState" ] = 0;
  this.LifecycleState = new LifecycleState();
  this.$$elementChildren.push( "LifecycleState" );
  this.$$refs[ "Severity" ] = true;
  this.$$minOccurs[ "Severity" ] = 0;
  this.Severity = new Severity();
  this.$$elementChildren.push( "Severity" );
}

function TaskProperties(  ) 
{
  this.$$nsPrefix = "ns13";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "TaskProperties";
  this.$$xmlNames[ "TaskProperties" ] = "TaskProperties";
  this.xsi_type = new String("ns13:TaskPropertiesType");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
  this.$$minOccurs[ "Extensions" ] = 0;
  this.Extensions = new TaskExtensionsType();
  this.$$elementChildren.push( "Extensions" );
}

function TaskPropertiesType(  ) 
{
  this.$$nsPrefix = "ns13";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "TaskPropertiesType";
  this.$$xmlNames[ "TaskPropertiesType" ] = "TaskPropertiesType";
  this.$$refs[ "ID" ] = true;
  this.$$minOccurs[ "ID" ] = 0;
  this.ID = new ID();
  this.$$elementChildren.push( "ID" );
  this.$$refs[ "IntegrationID" ] = true;
  this.$$minOccurs[ "IntegrationID" ] = 0;
  this.IntegrationID = new IntegrationID();
  this.$$elementChildren.push( "IntegrationID" );
  this.$$refs[ "Title" ] = true;
  this.$$minOccurs[ "Title" ] = 0;
  this.Title = new Title();
  this.$$elementChildren.push( "Title" );
  this.$$refs[ "Type" ] = true;
  this.$$minOccurs[ "Type" ] = 0;
  this.Type = new Type();
  this.$$elementChildren.push( "Type" );
  this.$$refs[ "Description" ] = true;
  this.$$minOccurs[ "Description" ] = 0;
  this.Description = new Description();
  this.$$elementChildren.push( "Description" );
  this.$$refs[ "LifecycleState" ] = true;
  this.$$minOccurs[ "LifecycleState" ] = 0;
  this.LifecycleState = new LifecycleState();
  this.$$elementChildren.push( "LifecycleState" );
  this.$$refs[ "Severity" ] = true;
  this.$$minOccurs[ "Severity" ] = 0;
  this.Severity = new Severity();
  this.$$elementChildren.push( "Severity" );
  this.$$minOccurs[ "Extensions" ] = 0;
  this.Extensions = new TaskExtensionsType();
  this.$$elementChildren.push( "Extensions" );
}

function TaskReferenceType(  ) 
{
  this.$$nsPrefix = "ns13";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "TaskReferenceType";
  this.$$xmlNames[ "TaskReferenceType" ] = "TaskReferenceType";
  this.$$refs[ "EntityReference" ] = true;
  this.$$minOccurs[ "EntityReference" ] = 0;
  this.EntityReference = new EntityReference();
  this.$$elementChildren.push( "EntityReference" );
  this.$$minOccurs[ "TaskProperties" ] = 0;
  this.TaskProperties = new TaskReferenceType_TaskPropertiesType();
  this.$$elementChildren.push( "TaskProperties" );
}

function TaskReferenceType_TaskPropertiesType(  ) 
{
  this.$$nsPrefix = "ns13";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "TaskReferenceType_TaskPropertiesType";
  this.$$xmlNames[ "TaskReferenceType_TaskPropertiesType" ] = "TaskProperties";
  this.$$minOccurs[ "Extensions" ] = 0;
  this.Extensions = new TaskExtensionsType();
  this.$$elementChildren.push( "Extensions" );
}

function TaskExtensionsType( val ) 
{
  this.$$nsPrefix = "ns12";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
}

function Name( val ) 
{
  this.$$nsPrefix = "ns8";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xsi_type = new String("xsd:string");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function ConfigurationItemPropertiesBaseType(  ) 
{
  this.$$nsPrefix = "ns8";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "ConfigurationItemPropertiesBaseType";
  this.$$xmlNames[ "ConfigurationItemPropertiesBaseType" ] = "ConfigurationItemPropertiesBaseType";
  this.$$refs[ "ID" ] = true;
  this.$$minOccurs[ "ID" ] = 0;
  this.ID = new ID();
  this.$$elementChildren.push( "ID" );
  this.$$refs[ "Name" ] = true;
  this.$$minOccurs[ "Name" ] = 0;
  this.Name = new Name();
  this.$$elementChildren.push( "Name" );
}

function ConfigurationItemReferenceType(  ) 
{
  this.$$nsPrefix = "ns8";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "ConfigurationItemReferenceType";
  this.$$xmlNames[ "ConfigurationItemReferenceType" ] = "ConfigurationItemReferenceType";
  this.$$refs[ "EntityReference" ] = true;
  this.$$minOccurs[ "EntityReference" ] = 0;
  this.EntityReference = new EntityReference();
  this.$$elementChildren.push( "EntityReference" );
  this.$$minOccurs[ "ConfigurationItemProperties" ] = 0;
  this.ConfigurationItemProperties = new ConfigurationItemPropertiesType();
  this.$$elementChildren.push( "ConfigurationItemProperties" );
}

function ConfigurationItemPropertiesType(  ) 
{
  this.$$nsPrefix = "ns8";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "ConfigurationItemPropertiesType";
  this.$$xmlNames[ "ConfigurationItemPropertiesType" ] = "ConfigurationItemPropertiesType";
  this.$$refs[ "ID" ] = true;
  this.$$minOccurs[ "ID" ] = 0;
  this.ID = new ID();
  this.$$elementChildren.push( "ID" );
  this.$$refs[ "Name" ] = true;
  this.$$minOccurs[ "Name" ] = 0;
  this.Name = new Name();
  this.$$elementChildren.push( "Name" );
  this.$$minOccurs[ "Extensions" ] = 0;
  this.Extensions = new ConfigurationItemExtensionsType();
  this.$$elementChildren.push( "Extensions" );
}

function ConfigurationItemListReferenceType(  ) 
{
  this.$$nsPrefix = "ns8";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "ConfigurationItemListReferenceType";
  this.$$xmlNames[ "ConfigurationItemListReferenceType" ] = "ConfigurationItemListReferenceType";
  this.$$refs[ "EntityReference" ] = true;
  this.$$minOccurs[ "EntityReference" ] = 0;
  this.EntityReference = new EntityReference();
  this.$$elementChildren.push( "EntityReference" );
  this.Item = new Array();  // of ConfigurationItemListReferenceType_ConfigurationItemReferenceType
  this.Item.$$nsPrefix = "ns8"
  this.Item_newInstance = function()
  {
    var newLen = this.Item.push( new ConfigurationItemListReferenceType_ConfigurationItemReferenceType() );
    return this.Item[ newLen-1 ];
  }
  this.$$elementChildren.push( "Item" );
}

function ConfigurationItemListReferenceType_ConfigurationItemReferenceType(  ) 
{
  this.$$nsPrefix = "ns8";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "ConfigurationItemListReferenceType_ConfigurationItemReferenceType";
  this.$$xmlNames[ "ConfigurationItemListReferenceType_ConfigurationItemReferenceType" ] = "Item";
  this.$$refs[ "EntityReference" ] = true;
  this.$$minOccurs[ "EntityReference" ] = 0;
  this.EntityReference = new EntityReference();
  this.$$elementChildren.push( "EntityReference" );
  this.$$minOccurs[ "ConfigurationItemProperties" ] = 0;
  this.ConfigurationItemProperties = new ConfigurationItemPropertiesType();
  this.$$elementChildren.push( "ConfigurationItemProperties" );
}

function ShortHostname( val ) 
{
  this.$$nsPrefix = "ns9";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xsi_type = new String("xsd:string");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function PrimaryDnsDomainName( val ) 
{
  this.$$nsPrefix = "ns9";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xsi_type = new String("xsd:string");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function NodePropertiesBaseType(  ) 
{
  this.$$nsPrefix = "ns9";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "NodePropertiesBaseType";
  this.$$xmlNames[ "NodePropertiesBaseType" ] = "NodePropertiesBaseType";
  this.$$refs[ "ID" ] = true;
  this.$$minOccurs[ "ID" ] = 0;
  this.ID = new ID();
  this.$$elementChildren.push( "ID" );
  this.$$refs[ "Name" ] = true;
  this.$$minOccurs[ "Name" ] = 0;
  this.Name = new Name();
  this.$$elementChildren.push( "Name" );
  this.$$refs[ "ShortHostname" ] = true;
  this.$$minOccurs[ "ShortHostname" ] = 0;
  this.ShortHostname = new ShortHostname();
  this.$$elementChildren.push( "ShortHostname" );
  this.$$refs[ "PrimaryDnsDomainName" ] = true;
  this.$$minOccurs[ "PrimaryDnsDomainName" ] = 0;
  this.PrimaryDnsDomainName = new PrimaryDnsDomainName();
  this.$$elementChildren.push( "PrimaryDnsDomainName" );
}

function NodeProperties(  ) 
{
  this.$$nsPrefix = "ns9";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "NodeProperties";
  this.$$xmlNames[ "NodeProperties" ] = "NodeProperties";
  this.xsi_type = new String("ns9:NodePropertiesType");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
  this.$$minOccurs[ "Extensions" ] = 0;
  this.Extensions = new NodeExtensionsType();
  this.$$elementChildren.push( "Extensions" );
}

function NodePropertiesType(  ) 
{
  this.$$nsPrefix = "ns9";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "NodePropertiesType";
  this.$$xmlNames[ "NodePropertiesType" ] = "NodePropertiesType";
  this.$$refs[ "ShortHostname" ] = true;
  this.$$minOccurs[ "ShortHostname" ] = 0;
  this.ShortHostname = new ShortHostname();
  this.$$elementChildren.push( "ShortHostname" );
  this.$$refs[ "PrimaryDnsDomainName" ] = true;
  this.$$minOccurs[ "PrimaryDnsDomainName" ] = 0;
  this.PrimaryDnsDomainName = new PrimaryDnsDomainName();
  this.$$elementChildren.push( "PrimaryDnsDomainName" );
  this.$$minOccurs[ "Extensions" ] = 0;
  this.Extensions = new NodeExtensionsType();
  this.$$elementChildren.push( "Extensions" );
}

function NodeReferenceType(  ) 
{
  this.$$nsPrefix = "ns9";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "NodeReferenceType";
  this.$$xmlNames[ "NodeReferenceType" ] = "NodeReferenceType";
  this.$$refs[ "EntityReference" ] = true;
  this.$$minOccurs[ "EntityReference" ] = 0;
  this.EntityReference = new EntityReference();
  this.$$elementChildren.push( "EntityReference" );
  this.$$minOccurs[ "NodeProperties" ] = 0;
  this.NodeProperties = new NodeReferenceType_NodePropertiesType();
  this.$$elementChildren.push( "NodeProperties" );
}

function NodeReferenceType_NodePropertiesType(  ) 
{
  this.$$nsPrefix = "ns9";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "NodeReferenceType_NodePropertiesType";
  this.$$xmlNames[ "NodeReferenceType_NodePropertiesType" ] = "NodeProperties";
  this.$$minOccurs[ "Extensions" ] = 0;
  this.Extensions = new NodeExtensionsType();
  this.$$elementChildren.push( "Extensions" );
}

function FullName( val ) 
{
  this.$$nsPrefix = "ns16";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xsi_type = new String("xsd:string");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function PersonPropertiesBaseType(  ) 
{
  this.$$nsPrefix = "ns16";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "PersonPropertiesBaseType";
  this.$$xmlNames[ "PersonPropertiesBaseType" ] = "PersonPropertiesBaseType";
  this.$$refs[ "ID" ] = true;
  this.$$minOccurs[ "ID" ] = 0;
  this.ID = new ID();
  this.$$elementChildren.push( "ID" );
  this.$$refs[ "Name" ] = true;
  this.$$minOccurs[ "Name" ] = 0;
  this.Name = new Name();
  this.$$elementChildren.push( "Name" );
  this.$$refs[ "FullName" ] = true;
  this.$$minOccurs[ "FullName" ] = 0;
  this.FullName = new FullName();
  this.$$elementChildren.push( "FullName" );
}

function PersonPropertiesType(  ) 
{
  this.$$nsPrefix = "ns16";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "PersonPropertiesType";
  this.$$xmlNames[ "PersonPropertiesType" ] = "PersonPropertiesType";
  this.$$refs[ "FullName" ] = true;
  this.$$minOccurs[ "FullName" ] = 0;
  this.FullName = new FullName();
  this.$$elementChildren.push( "FullName" );
  this.$$minOccurs[ "Extensions" ] = 0;
  this.Extensions = new PersonExtensionsType();
  this.$$elementChildren.push( "Extensions" );
}

function PersonProperties(  ) 
{
  this.$$nsPrefix = "ns16";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "PersonProperties";
  this.$$xmlNames[ "PersonProperties" ] = "PersonProperties";
  this.xsi_type = new String("ns16:PersonPropertiesType");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
  this.$$minOccurs[ "Extensions" ] = 0;
  this.Extensions = new PersonExtensionsType();
  this.$$elementChildren.push( "Extensions" );
}

function PersonReferenceType(  ) 
{
  this.$$nsPrefix = "ns16";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "PersonReferenceType";
  this.$$xmlNames[ "PersonReferenceType" ] = "PersonReferenceType";
  this.$$refs[ "EntityReference" ] = true;
  this.$$minOccurs[ "EntityReference" ] = 0;
  this.EntityReference = new EntityReference();
  this.$$elementChildren.push( "EntityReference" );
  this.$$minOccurs[ "PersonProperties" ] = 0;
  this.PersonProperties = new PersonReferenceType_PersonPropertiesType();
  this.$$elementChildren.push( "PersonProperties" );
}

function PersonReferenceType_PersonPropertiesType(  ) 
{
  this.$$nsPrefix = "ns16";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "PersonReferenceType_PersonPropertiesType";
  this.$$xmlNames[ "PersonReferenceType_PersonPropertiesType" ] = "PersonProperties";
  this.$$minOccurs[ "Extensions" ] = 0;
  this.Extensions = new PersonExtensionsType();
  this.$$elementChildren.push( "Extensions" );
}

function SupportGroupPropertiesBaseType(  ) 
{
  this.$$nsPrefix = "ns17";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "SupportGroupPropertiesBaseType";
  this.$$xmlNames[ "SupportGroupPropertiesBaseType" ] = "SupportGroupPropertiesBaseType";
  this.$$refs[ "ID" ] = true;
  this.$$minOccurs[ "ID" ] = 0;
  this.ID = new ID();
  this.$$elementChildren.push( "ID" );
  this.$$refs[ "Name" ] = true;
  this.$$minOccurs[ "Name" ] = 0;
  this.Name = new Name();
  this.$$elementChildren.push( "Name" );
}

function SupportGroupPropertiesType(  ) 
{
  this.$$nsPrefix = "ns17";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "SupportGroupPropertiesType";
  this.$$xmlNames[ "SupportGroupPropertiesType" ] = "SupportGroupPropertiesType";
  this.$$minOccurs[ "Extensions" ] = 0;
  this.Extensions = new SupportGroupExtensionsType();
  this.$$elementChildren.push( "Extensions" );
}

function SupportGroupReferenceType(  ) 
{
  this.$$nsPrefix = "ns17";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "SupportGroupReferenceType";
  this.$$xmlNames[ "SupportGroupReferenceType" ] = "SupportGroupReferenceType";
  this.$$refs[ "EntityReference" ] = true;
  this.$$minOccurs[ "EntityReference" ] = 0;
  this.EntityReference = new EntityReference();
  this.$$elementChildren.push( "EntityReference" );
  this.$$minOccurs[ "SupportGroupProperties" ] = 0;
  this.SupportGroupProperties = new SupportGroupReferenceType_SupportGroupPropertiesType();
  this.$$elementChildren.push( "SupportGroupProperties" );
}

function SupportGroupReferenceType_SupportGroupPropertiesType(  ) 
{
  this.$$nsPrefix = "ns17";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "SupportGroupReferenceType_SupportGroupPropertiesType";
  this.$$xmlNames[ "SupportGroupReferenceType_SupportGroupPropertiesType" ] = "SupportGroupProperties";
  this.$$minOccurs[ "Extensions" ] = 0;
  this.Extensions = new SupportGroupExtensionsType();
  this.$$elementChildren.push( "Extensions" );
}

function TicketExtensionsType( val ) 
{
  this.$$nsPrefix = "ns18";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
}

function TicketPropertiesBaseType( val ) 
{
  this.$$nsPrefix = "ns20";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
}

function TicketProperties(  ) 
{
  this.$$nsPrefix = "ns20";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "TicketProperties";
  this.$$xmlNames[ "TicketProperties" ] = "TicketProperties";
  this.xsi_type = new String("ns20:TicketPropertiesType");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
  this.$$minOccurs[ "Extensions" ] = 0;
  this.Extensions = new TicketPropertiesType_TicketExtensionsType();
  this.$$elementChildren.push( "Extensions" );
}

function TicketPropertiesType(  ) 
{
  this.$$nsPrefix = "ns20";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "TicketPropertiesType";
  this.$$xmlNames[ "TicketPropertiesType" ] = "TicketPropertiesType";
  this.$$minOccurs[ "Extensions" ] = 0;
  this.Extensions = new TicketPropertiesType_TicketExtensionsType();
  this.$$elementChildren.push( "Extensions" );
}

function TicketPropertiesType_TicketExtensionsType( val ) 
{
  this.$$nsPrefix = "ns20";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
}

function ConfigurationItemExtensionsType( val ) 
{
  this.$$nsPrefix = "ns21";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
}

function NodeExtensionsType( val ) 
{
  this.$$nsPrefix = "ns22";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
}

function PersonExtensionsType( val ) 
{
  this.$$nsPrefix = "ns23";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
}

function SupportGroupExtensionsType( val ) 
{
  this.$$nsPrefix = "ns24";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
}

function SubmitMessage( val ) 
{
  this.$$nsPrefix = "ns0";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xmlns_ns0 = new String("http://schemas.hp.com/ism-pws/ServiceOperation/TaskManagement/1/TaskDispatchServiceSpecification");
  this.$$attributes.push( "xmlns_ns0" );
  this.$$xmlNames["xmlns_ns0"] = "xmlns:ns0";
  this.$$objNames["xmlns:ns0"] = "xmlns_ns0";
}

function AddCommentMessage( val ) 
{
  this.$$nsPrefix = "ns0";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xmlns_ns0 = new String("http://schemas.hp.com/ism-pws/ServiceOperation/TaskManagement/1/TaskDispatchServiceSpecification");
  this.$$attributes.push( "xmlns_ns0" );
  this.$$xmlNames["xmlns_ns0"] = "xmlns:ns0";
  this.$$objNames["xmlns:ns0"] = "xmlns_ns0";
}

function OnStatusChangeMessage( val ) 
{
  this.$$nsPrefix = "ns0";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xmlns_ns0 = new String("http://schemas.hp.com/ism-pws/ServiceOperation/TaskManagement/1/TaskDispatchServiceSpecification");
  this.$$attributes.push( "xmlns_ns0" );
  this.$$xmlNames["xmlns_ns0"] = "xmlns:ns0";
  this.$$objNames["xmlns:ns0"] = "xmlns_ns0";
}

function xsd_string( val ) 
{
  this.$$nsPrefix = "ns0";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xsi_type = new String("xsd:string");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function getName( ) 
{
 return this.$$name;
}

function getXmlName( ) 
{
 return this.$$xmlNames[ this.$$name ];
}

function getValue( ) 
{
 return this.$$value;
}

function setValue( value ) 
{
 this.$$value = value;
}

function setContent( obj, obj2 ) 
{
  var name = obj.getXmlName();
  if ( name.indexOf(":") > 0 ) 
  {
    name = name.after(":");
  }
  this.$$elementChildren.length = 0;
  this.$$elementChildren.push( name );
  this[ name ] = obj;

  this.$$refs[ name ] = true;

  if ( obj2 != undefined )
  {
    name = obj2.getXmlName();
    if ( name.indexOf(":") > 0 ) 
    {
      name = name.after(":");
    }

    this.$$elementChildren.push( name );
    this.$$refs[ name ] = true;

    this[ name ] = obj2;
  }
}

function addContent( obj ) 
{
  var name = obj.getXmlName();
  if ( name.indexOf(":") > 0 ) 
  {
    name = name.after(":");
  }

  this.$$elementChildren.push( name );
  this.$$refs[ name ] = true;

  this[ name ] = obj;
}

function getContent( ) 
{
  return this[this.$$elementChildren[0]];
}

function isFault( ) 
{
  return this.$$name == "soap_Fault";
}

// Ensure that material in lib.SOAP is available

lib.SOAP.init();
/// End ----------------