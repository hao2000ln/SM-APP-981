
function EntityNotification( )
{
  this.location = new String( "http://127.0.0.1:18080/EntityNotificationService/" );

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

  this.SOAPOperations[ "CreateNotification" ] = new soap_Operation( "CreateNotification", "http://schemas.hp.com/ism/Actions/1/CreateNotification", "document", "CreateNotification", "null" );
  this.SOAPOperations[ "SelectNotification" ] = new soap_Operation( "SelectNotification", "http://schemas.hp.com/ism/Actions/1/SelectNotification", "document", "SelectNotification", "null" );
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
 
  if ( soapOp.responseObj == "null" )  // one-way MEP ?
  {
    return null;
  }
  
    resultObj.responseObj = soapOp.responseObj;
 
    try
    {
      lib.SOAP.deserialize( "EntityNotification", this.resultXML.getDocumentElement(), resultObj );
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
  this.xmlns_ns0 = new String("http://schemas.hp.com/ism-pws/Common/EntityObserver/1/EntityNotification");
  this.$$attributes.push( "xmlns_ns0" );
  this.$$xmlNames["xmlns_ns0"] = "xmlns:ns0";
  this.$$objNames["xmlns:ns0"] = "xmlns_ns0";
  this.xmlns_ns1 = new String("http://schemas.hp.com/ism-pws/Common/EntityObserver/1/EntityNotificationServiceSpecification");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  this.xmlns_ns2 = new String("http://schemas.hp.com/ism-pws/Common/EntityObserver/1/EntityNotificationService");
  this.$$attributes.push( "xmlns_ns2" );
  this.$$xmlNames["xmlns_ns2"] = "xmlns:ns2";
  this.$$objNames["xmlns:ns2"] = "xmlns_ns2";
  this.xmlns_ns3 = new String("http://schemas.xmlsoap.org/wsdl/soap/");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
  this.xmlns_ns4 = new String("http://schemas.xmlsoap.org/wsdl/");
  this.$$attributes.push( "xmlns_ns4" );
  this.$$xmlNames["xmlns_ns4"] = "xmlns:ns4";
  this.$$objNames["xmlns:ns4"] = "xmlns_ns4";
  this.xmlns_xsd = new String("http://www.w3.org/2001/XMLSchema");
  this.$$attributes.push( "xmlns_xsd" );
  this.$$xmlNames["xmlns_xsd"] = "xmlns:xsd";
  this.$$objNames["xmlns:xsd"] = "xmlns_xsd";
  this.xmlns_ns6 = new String("http://schemas.xmlsoap.org/ws/2004/08/addressing");
  this.$$attributes.push( "xmlns_ns6" );
  this.$$xmlNames["xmlns_ns6"] = "xmlns:ns6";
  this.$$objNames["xmlns:ns6"] = "xmlns_ns6";
  this.xmlns_ns7 = new String("http://schemas.hp.com/ism-pws/Common/1/Common");
  this.$$attributes.push( "xmlns_ns7" );
  this.$$xmlNames["xmlns_ns7"] = "xmlns:ns7";
  this.$$objNames["xmlns:ns7"] = "xmlns_ns7";
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

function OutcomeCodeType( val ) 
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
  this.Success = new xs_string( "Success" );
  this.Cancel = new xs_string( "Cancel" );
  this.Fault = new xs_string( "Fault" );
}

function OutcomeCode( val ) 
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
  this.xsi_type = new String("ns0:OutcomeCodeType");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function EntityNotificationHeader(  ) 
{
  this.$$nsPrefix = "ns0";
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
  this.$$name = "EntityNotificationHeader";
  this.$$xmlNames[ "EntityNotificationHeader" ] = "EntityNotificationHeader";
  this.xsi_type = new String("ns0:EntityNotificationHeaderType");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
  this.ToSystem = new xs_string();
  this.$$elementChildren.push( "ToSystem" );
  this.Subject = new xs_string();
  this.$$elementChildren.push( "Subject" );
}

function EntityNotificationHeaderType(  ) 
{
  this.$$nsPrefix = "ns0";
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
  this.$$name = "EntityNotificationHeaderType";
  this.$$xmlNames[ "EntityNotificationHeaderType" ] = "EntityNotificationHeaderType";
  this.ToSystem = new xs_string();
  this.$$elementChildren.push( "ToSystem" );
  this.Subject = new xs_string();
  this.$$elementChildren.push( "Subject" );
}

function xs_string( val ) 
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

function EntityNotificationBody(  ) 
{
  this.$$nsPrefix = "ns0";
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
  this.$$name = "EntityNotificationBody";
  this.$$xmlNames[ "EntityNotificationBody" ] = "EntityNotificationBody";
  this.xsi_type = new String("ns0:EntityNotificationBodyType");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
  this.$$refs[ "OutcomeCode" ] = true;
  this.OutcomeCode = new OutcomeCode();
  this.$$elementChildren.push( "OutcomeCode" );
  this.$$minOccurs[ "FaultDescription" ] = 0;
  this.FaultDescription = new xs_string();
  this.$$elementChildren.push( "FaultDescription" );
  this.$$refs[ "EntityReference" ] = true;
  this.$$minOccurs[ "EntityReference" ] = 0;
  this.EntityReference = new EntityReference();
  this.$$elementChildren.push( "EntityReference" );
}

function EntityNotificationBodyType(  ) 
{
  this.$$nsPrefix = "ns0";
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
  this.$$name = "EntityNotificationBodyType";
  this.$$xmlNames[ "EntityNotificationBodyType" ] = "EntityNotificationBodyType";
  this.$$refs[ "OutcomeCode" ] = true;
  this.OutcomeCode = new OutcomeCode();
  this.$$elementChildren.push( "OutcomeCode" );
  this.$$minOccurs[ "FaultDescription" ] = 0;
  this.FaultDescription = new xs_string();
  this.$$elementChildren.push( "FaultDescription" );
  this.$$refs[ "EntityReference" ] = true;
  this.$$minOccurs[ "EntityReference" ] = 0;
  this.EntityReference = new EntityReference();
  this.$$elementChildren.push( "EntityReference" );
}

function EntityNotificationType(  ) 
{
  this.$$nsPrefix = "ns0";
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
  this.$$name = "EntityNotificationType";
  this.$$xmlNames[ "EntityNotificationType" ] = "EntityNotificationType";
  this.$$refs[ "EntityNotificationHeader" ] = true;
  this.EntityNotificationHeader = new EntityNotificationHeader();
  this.$$elementChildren.push( "EntityNotificationHeader" );
  this.$$refs[ "EntityNotificationBody" ] = true;
  this.EntityNotificationBody = new EntityNotificationBody();
  this.$$elementChildren.push( "EntityNotificationBody" );
}

function CreateNotification(  ) 
{
  this.$$nsPrefix = "ns0";
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
  this.$$name = "CreateNotification";
  this.$$xmlNames[ "CreateNotification" ] = "CreateNotification";
  this.xsi_type = new String("ns0:EntityNotificationType");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
  this.xmlns_ns0 = new String("http://schemas.hp.com/ism-pws/Common/EntityObserver/1/EntityNotification");
  this.$$attributes.push( "xmlns_ns0" );
  this.$$xmlNames["xmlns_ns0"] = "xmlns:ns0";
  this.$$objNames["xmlns:ns0"] = "xmlns_ns0";
  this.$$refs[ "EntityNotificationHeader" ] = true;
  this.EntityNotificationHeader = new EntityNotificationHeader();
  this.$$elementChildren.push( "EntityNotificationHeader" );
  this.$$refs[ "EntityNotificationBody" ] = true;
  this.EntityNotificationBody = new EntityNotificationBody();
  this.$$elementChildren.push( "EntityNotificationBody" );
}

function SelectNotification(  ) 
{
  this.$$nsPrefix = "ns0";
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
  this.$$name = "SelectNotification";
  this.$$xmlNames[ "SelectNotification" ] = "SelectNotification";
  this.xsi_type = new String("ns0:EntityNotificationType");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
  this.xmlns_ns0 = new String("http://schemas.hp.com/ism-pws/Common/EntityObserver/1/EntityNotification");
  this.$$attributes.push( "xmlns_ns0" );
  this.$$xmlNames["xmlns_ns0"] = "xmlns:ns0";
  this.$$objNames["xmlns:ns0"] = "xmlns_ns0";
  this.$$refs[ "EntityNotificationHeader" ] = true;
  this.EntityNotificationHeader = new EntityNotificationHeader();
  this.$$elementChildren.push( "EntityNotificationHeader" );
  this.$$refs[ "EntityNotificationBody" ] = true;
  this.EntityNotificationBody = new EntityNotificationBody();
  this.$$elementChildren.push( "EntityNotificationBody" );
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

function CreateNotificationMessage( val ) 
{
  this.$$nsPrefix = "ns1";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xmlns_ns1 = new String("http://schemas.hp.com/ism-pws/Common/EntityObserver/1/EntityNotificationServiceSpecification");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
}

function SelectNotificationMessage( val ) 
{
  this.$$nsPrefix = "ns1";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xmlns_ns1 = new String("http://schemas.hp.com/ism-pws/Common/EntityObserver/1/EntityNotificationServiceSpecification");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
}

function xsd_string( val ) 
{
  this.$$nsPrefix = "ns1";
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