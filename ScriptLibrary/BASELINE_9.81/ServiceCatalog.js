
function ServiceCatalog( )
{
  this.location = new String( "http://localhost:7070/ServiceCatalog/services/ServiceCatalog" );

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

  this.SOAPOperations[ "CreateFulfillment" ] = new soap_Operation( "CreateFulfillment", "CreateFulfillment", "document", "CreateFulfillmentRequest", "CreateFulfillmentResponse" );
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
 
  var resultObj = new Object();
 
  if ( soapOp.style == "rpc" )
  {
    resultObj.responseObj = soapOp.responseObj;
  }
  else
  {
    resultObj.responseObj = null;
  }
   
  try
  {
    lib.SOAP.deserialize( "ServiceCatalog", this.resultXML.getDocumentElement(), resultObj );
  }
  catch( e )
  {
    print( "Error deserializing response: " + e.toString() );
    return null;
  }
   
  try
  {
    this.soapEnvelope = resultObj.soap_Envelope;
    this.soapBody = resultObj.soap_Envelope.soap_Body;
   
    if ( this.soapEnvelope.soap_Header != undefined )
    {
      this.soapHeader = this.soapEnvelope.soap_Header;
    }
    else
      this.soapHeader = null;
    
    return resultObj.soap_Envelope.soap_Body.getContent();
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
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
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
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "soap_Envelope";
  this.$$xmlNames[ "soap_Envelope" ] = "soap:Envelope";
  this.xmlns_soap = new String("http://schemas.xmlsoap.org/soap/envelope/");
  this.$$attributes.push( "xmlns_soap" );
  this.$$xmlNames["xmlns_soap"] = "xmlns:soap";
  this.$$objNames["xmlns:soap"] = "xmlns_soap";
  this.xmlns_xsi = new String("http://www.w3.org/2001/XMLSchema-instance");
  this.$$attributes.push( "xmlns_xsi" );
  this.$$xmlNames["xmlns_xsi"] = "xmlns:xsi";
  this.$$objNames["xmlns:xsi"] = "xmlns_xsi";
  this.xmlns_xsd = new String("http://www.w3.org/2001/XMLSchema");
  this.$$attributes.push( "xmlns_xsd" );
  this.$$xmlNames["xmlns_xsd"] = "xmlns:xsd";
  this.$$objNames["xmlns:xsd"] = "xmlns_xsd";
  this.xmlns_ns = new String("http://schemas.hp.com/ServiceCatalog/1");
  this.$$attributes.push( "xmlns_ns" );
  this.$$xmlNames["xmlns_ns"] = "xmlns:ns";
  this.$$objNames["xmlns:ns"] = "xmlns_ns";
  this.Body = new soap_Body();
  this.$$elementChildren.push( "Body" );
}

function soap_Fault(  ) 
{
  this.$$nsPrefix = "soap";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
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
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
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

function ArrayType(  ) 
{
  this.$$nsPrefix = "ns";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.type = new String("Array");
  this.$$attributes.push( "type" );
}

function MessageType( val ) 
{
  this.$$nsPrefix = "ns";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.severity = new Number();
  this.$$attributes.push( "severity" );
  this.module = new String();
  this.$$attributes.push( "module" );
}

function MessagesType(  ) 
{
  this.$$nsPrefix = "ns";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "MessagesType";
  this.$$xmlNames[ "MessagesType" ] = "ns:MessagesType";
  this.message = new Array();  // of MessageType
  this.message_newInstance = function()
  {
    var newLen = this.message.push( new MessageType() );
    return this.message[ newLen-1 ];
  }
  this.$$elementChildren.push( "message" );
}

function OptionsType(  ) 
{
  this.$$nsPrefix = "ns";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "OptionsType";
  this.$$xmlNames[ "OptionsType" ] = "ns:OptionsType";
  this.option = new Array();  // of OptionsType_option
  this.option_newInstance = function()
  {
    var newLen = this.option.push( new OptionsType_option() );
    return this.option[ newLen-1 ];
  }
  this.$$elementChildren.push( "option" );
}

function OptionsType_option(  ) 
{
  this.$$nsPrefix = "ns";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "OptionsType_option";
  this.$$xmlNames[ "OptionsType_option" ] = "ns:option";
  this.name = new String();
  this.$$attributes.push( "name" );
  this.value = new String();
  this.$$attributes.push( "value" );
}

function StatusType( val ) 
{
  this.$$nsPrefix = "ns";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.SUCCESS = new xs_string( "SUCCESS" );
  this.FAILURE = new xs_string( "FAILURE" );
}

function CreateFulfillmentRequest(  ) 
{
  this.$$nsPrefix = "ns";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "CreateFulfillmentRequest";
  this.$$xmlNames[ "CreateFulfillmentRequest" ] = "ns:CreateFulfillmentRequest";
  this.xmlns = new String("http://schemas.hp.com/ServiceCatalog/1");
  this.$$attributes.push( "xmlns" );
  this.RequesterRequestID = new xs_string();
  this.$$elementChildren.push( "RequesterRequestID" );
  this.RequestedBy = new xs_string();
  this.$$elementChildren.push( "RequestedBy" );
  this.CallBackContact = new xs_string();
  this.$$elementChildren.push( "CallBackContact" );
  this.NotifyBy = new xs_string();
  this.$$elementChildren.push( "NotifyBy" );
  this.Description = new xs_string();
  this.$$elementChildren.push( "Description" );
  this.$$minOccurs[ "NeededBy" ] = 0;
  this.NeededBy = new xs_dateTime();
  this.$$elementChildren.push( "NeededBy" );
  this.Severity = new xs_string();
  this.$$elementChildren.push( "Severity" );
  this.CartItemID = new xs_int();
  this.$$elementChildren.push( "CartItemID" );
  this.Completed = new xs_boolean();
  this.$$elementChildren.push( "Completed" );
  this.Submitted = new xs_boolean();
  this.$$elementChildren.push( "Submitted" );
  this.Status = new xs_string();
  this.$$elementChildren.push( "Status" );
  this.SLAAgreementID = new xs_int();
  this.$$elementChildren.push( "SLAAgreementID" );
  this.Cost = new xs_decimal();
  this.$$elementChildren.push( "Cost" );
  this.Duration = new xs_duration();
  this.$$elementChildren.push( "Duration" );
  this.Quantity = new xs_int();
  this.$$elementChildren.push( "Quantity" );
  this.$$minOccurs[ "SLADeadline" ] = 0;
  this.SLADeadline = new xs_dateTime();
  this.$$elementChildren.push( "SLADeadline" );
  this.UnitCost = new xs_decimal();
  this.$$elementChildren.push( "UnitCost" );
  this.Currency = new xs_string();
  this.$$elementChildren.push( "Currency" );
  this.$$minOccurs[ "RequestTime" ] = 0;
  this.RequestTime = new xs_dateTime();
  this.$$elementChildren.push( "RequestTime" );
  this.$$minOccurs[ "StartTime" ] = 0;
  this.StartTime = new xs_dateTime();
  this.$$elementChildren.push( "StartTime" );
  this.ServiceCatalogID = new xs_int();
  this.$$elementChildren.push( "ServiceCatalogID" );
  this.ItemDescription = new xs_string();
  this.$$elementChildren.push( "ItemDescription" );
  this.PartNumber = new xs_string();
  this.$$elementChildren.push( "PartNumber" );
  this.RequestedFor = new xs_string();
  this.$$elementChildren.push( "RequestedFor" );
  this.options = new CreateFulfillmentRequest_OptionsType();
  this.$$elementChildren.push( "options" );
}

function xs_string( val ) 
{
  this.$$nsPrefix = "xsd";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
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
  this.$$nsPrefix = "xsd";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xsi_type = new String("xsd:dateTime");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function xs_int( val ) 
{
  this.$$nsPrefix = "xsd";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xsi_type = new String("xsd:int");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function xs_boolean( val ) 
{
  this.$$nsPrefix = "xsd";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xsi_type = new String("xsd:boolean");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function xs_decimal( val ) 
{
  this.$$nsPrefix = "xsd";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xsi_type = new String("xsd:decimal");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function xs_duration( val ) 
{
  this.$$nsPrefix = "xsd";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xsi_type = new String("xsd:duration");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function CreateFulfillmentRequest_OptionsType(  ) 
{
  this.$$nsPrefix = "ns";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "CreateFulfillmentRequest_OptionsType";
  this.$$xmlNames[ "CreateFulfillmentRequest_OptionsType" ] = "ns:options";
  this.option = new Array();  // of OptionsType_option
  this.option_newInstance = function()
  {
    var newLen = this.option.push( new OptionsType_option() );
    return this.option[ newLen-1 ];
  }
  this.$$elementChildren.push( "option" );
}

function CreateFulfillmentResponse(  ) 
{
  this.$$nsPrefix = "ns";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "CreateFulfillmentResponse";
  this.$$xmlNames[ "CreateFulfillmentResponse" ] = "ns:CreateFulfillmentResponse";
  this.status = new String();
  this.$$attributes.push( "status" );
  this.message = new String();
  this.$$attributes.push( "message" );
  this.returnCode = new Number();
  this.$$attributes.push( "returnCode" );
  this.ProviderRequestID = new xs_string();
  this.$$elementChildren.push( "ProviderRequestID" );
  this.RequesterRequestID = new xs_string();
  this.$$elementChildren.push( "RequesterRequestID" );
  this.messages = new CreateFulfillmentResponse_MessagesType();
  this.$$elementChildren.push( "messages" );
}

function CreateFulfillmentResponse_MessagesType(  ) 
{
  this.$$nsPrefix = "ns";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "CreateFulfillmentResponse_MessagesType";
  this.$$xmlNames[ "CreateFulfillmentResponse_MessagesType" ] = "ns:messages";
  this.message = new Array();  // of MessageType
  this.message_newInstance = function()
  {
    var newLen = this.message.push( new MessageType() );
    return this.message[ newLen-1 ];
  }
  this.$$elementChildren.push( "message" );
}

function xsd_string( val ) 
{
  this.$$nsPrefix = "xsd";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
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
  this.$$elementChildren.length = 0;
  this.$$elementChildren.push( obj.getName() );
  this[ obj.getName() ] = obj;
  if ( obj2 != undefined )
  {
    this.$$elementChildren.push( obj2.getName() );
    this[ obj2.getName() ] = obj2;
  }
}

function addContent( obj ) 
{
  this.$$elementChildren.push( obj.getName() );
  this[ obj.getName() ] = obj;
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