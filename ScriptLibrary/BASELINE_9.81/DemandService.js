
function DemandService( )
{
  this.location = new String("");

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

  this.SOAPOperations[ "setRequestRemoteReferenceStatus" ] = new soap_Operation( "setRequestRemoteReferenceStatus", "urn:setRequestRemoteReferenceStatus", "document", "setRequestRemoteReferenceStatus", "setRequestRemoteReferenceStatusResponse" );
  this.SOAPOperations[ "addRequestNotes" ] = new soap_Operation( "addRequestNotes", "urn:addRequestNotes", "document", "addRequestNotes", "addRequestNotesResponse" );
  this.SOAPOperations[ "createRequest" ] = new soap_Operation( "createRequest", "urn:createRequest", "document", "createRequest", "createRequestResponse" );
  this.SOAPOperations[ "deleteRequests" ] = new soap_Operation( "deleteRequests", "urn:deleteRequests", "document", "deleteRequests", "deleteRequestsResponse" );
  this.SOAPOperations[ "setRequestFields" ] = new soap_Operation( "setRequestFields", "urn:setRequestFields", "document", "setRequestFields", "setRequestFieldsResponse" );
  this.SOAPOperations[ "getRequests" ] = new soap_Operation( "getRequests", "urn:getRequests", "document", "getRequests", "getRequestsResponse" );
  this.SOAPOperations[ "executeWFTransitions" ] = new soap_Operation( "executeWFTransitions", "urn:executeWFTransitions", "document", "executeWFTransitions", "executeWFTransitionsResponse" );
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

function invoke( requestObj, headerObj, bEmitXsiTypeAttributes )
{
  var bEmitTypeAttrs = true;

  if ( bEmitXsiTypeAttributes != undefined && bEmitXsiTypeAttributes != null )
  {
    bEmitTypeAttrs = bEmitXsiTypeAttributes;
  }

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
 
  lib.SOAP.serialize( this.soapEnvelope, result, bEmitTypeAttrs );
 
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
    lib.SOAP.deserialize( "DemandService", this.resultXML.getDocumentElement(), resultObj );
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

function soap_Body( ) 
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

function soap_Envelope( ) 
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
  this.xmlns_ns0 = new String("http://mercury.com/ppm/dm/msg/1.0");
  this.$$attributes.push( "xmlns_ns0" );
  this.$$xmlNames["xmlns_ns0"] = "xmlns:ns0";
  this.$$objNames["xmlns:ns0"] = "xmlns_ns0";
  this.xmlns_ns1 = new String("http://mercury.com/ppm/dm/service/1.0");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  this.xmlns_ns2 = new String("http://schemas.xmlsoap.org/wsdl/http/");
  this.$$attributes.push( "xmlns_ns2" );
  this.$$xmlNames["xmlns_ns2"] = "xmlns:ns2";
  this.$$objNames["xmlns:ns2"] = "xmlns_ns2";
  this.xmlns_ns3 = new String("http://schemas.xmlsoap.org/wsdl/mime/");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
  this.xmlns_ns4 = new String("http://schemas.xmlsoap.org/wsdl/soap12/");
  this.$$attributes.push( "xmlns_ns4" );
  this.$$xmlNames["xmlns_ns4"] = "xmlns:ns4";
  this.$$objNames["xmlns:ns4"] = "xmlns_ns4";
  this.xmlns_ns5 = new String("http://www.w3.org/2006/05/addressing/wsdl");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
  this.xmlns_ns6 = new String("http://schemas.xmlsoap.org/wsdl/");
  this.$$attributes.push( "xmlns_ns6" );
  this.$$xmlNames["xmlns_ns6"] = "xmlns:ns6";
  this.$$objNames["xmlns:ns6"] = "xmlns_ns6";
  this.xmlns_ns7 = new String("http://mercury.com/ppm/common/1.0");
  this.$$attributes.push( "xmlns_ns7" );
  this.$$xmlNames["xmlns_ns7"] = "xmlns:ns7";
  this.$$objNames["xmlns:ns7"] = "xmlns_ns7";
  this.xmlns_ns8 = new String("http://mercury.com/ppm/dm/1.0");
  this.$$attributes.push( "xmlns_ns8" );
  this.$$xmlNames["xmlns_ns8"] = "xmlns:ns8";
  this.$$objNames["xmlns:ns8"] = "xmlns_ns8";
  this.xmlns_xsd = new String("http://www.w3.org/2001/XMLSchema");
  this.$$attributes.push( "xmlns_xsd" );
  this.$$xmlNames["xmlns_xsd"] = "xmlns:xsd";
  this.$$objNames["xmlns:xsd"] = "xmlns_xsd";
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

function soap_Fault( ) 
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

function soap_Header( ) 
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

function createRequest(  ) 
{
  this.$$nsPrefix = "ns1";
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
  this.$$name = "createRequest";
  this.$$xmlNames[ "createRequest" ] = "createRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://mercury.com/ppm/dm/service/1.0");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this.requestObj = new Request();
  }
  this.$$childElementFunctions[ "requestObj" ] = Request;
  this.$$elementChildren.push( "requestObj" );
}

function createRequestResponse(  ) 
{
  this.$$nsPrefix = "ns1";
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
  this.$$name = "createRequestResponse";
  this.$$xmlNames[ "createRequestResponse" ] = "createRequestResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$xmlNames["_return"] = "return";
  this.$$objNames["return"] = "_return";
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this._return = new RemoteReference();
  }
  this.$$childElementFunctions[ "_return" ] = RemoteReference;
  this.$$elementChildren.push( "_return" );
}

function getRequests(  ) 
{
  this.$$nsPrefix = "ns1";
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
  this.$$name = "getRequests";
  this.$$xmlNames[ "getRequests" ] = "getRequests";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://mercury.com/ppm/dm/service/1.0");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  this.requestIds = new Array();  // of Identifier
  this.requestIds.$$nsPrefix = "ns1"
 // method to create a new member of the requestIds array
  this.requestIds.newInstance = function( bDeserializing )
  {
    var newObj = new Identifier( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.requestIds_newInstance = function( bDeserializing )
  {
    var newLen = this.requestIds.push( new Identifier( bDeserializing ) );
    return this.requestIds[ newLen-1 ];
  }
  this.$$elementChildren.push( "requestIds" );
}

function getRequestsResponse(  ) 
{
  this.$$nsPrefix = "ns1";
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
  this.$$name = "getRequestsResponse";
  this.$$xmlNames[ "getRequestsResponse" ] = "getRequestsResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$xmlNames["_return"] = "return";
  this.$$objNames["return"] = "_return";
  this._return = new Array();  // of Request
  this._return.$$nsPrefix = "ns1"
 // method to create a new member of the _return array
  this._return.newInstance = function( bDeserializing )
  {
    var newObj = new Request( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this._return_newInstance = function( bDeserializing )
  {
    var newLen = this._return.push( new Request( bDeserializing ) );
    return this._return[ newLen-1 ];
  }
  this.$$elementChildren.push( "_return" );
}

function addRequestNotes(  ) 
{
  this.$$nsPrefix = "ns1";
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
  this.$$name = "addRequestNotes";
  this.$$xmlNames[ "addRequestNotes" ] = "addRequestNotes";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://mercury.com/ppm/dm/service/1.0");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this.requestId = new Identifier();
  }
  this.$$childElementFunctions[ "requestId" ] = Identifier;
  this.$$elementChildren.push( "requestId" );
  this.notes = new Array();  // of Note
  this.notes.$$nsPrefix = "ns1"
 // method to create a new member of the notes array
  this.notes.newInstance = function( bDeserializing )
  {
    var newObj = new Note( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.notes_newInstance = function( bDeserializing )
  {
    var newLen = this.notes.push( new Note( bDeserializing ) );
    return this.notes[ newLen-1 ];
  }
  this.$$elementChildren.push( "notes" );
}

function addRequestNotesResponse(  ) 
{
  this.$$nsPrefix = "ns1";
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
  this.$$name = "addRequestNotesResponse";
  this.$$xmlNames[ "addRequestNotesResponse" ] = "addRequestNotesResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$xmlNames["_return"] = "return";
  this.$$objNames["return"] = "_return";
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this._return = new xs_int();
  }
  this.$$childElementFunctions[ "_return" ] = xs_int;
  this.$$elementChildren.push( "_return" );
}

function xs_int( val ) 
{
  this.$$nsPrefix = "xsd";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xsi_type = new String("xsd:int");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function deleteRequests(  ) 
{
  this.$$nsPrefix = "ns1";
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
  this.$$name = "deleteRequests";
  this.$$xmlNames[ "deleteRequests" ] = "deleteRequests";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://mercury.com/ppm/dm/service/1.0");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  this.requestIds = new Array();  // of Identifier
  this.requestIds.$$nsPrefix = "ns1"
 // method to create a new member of the requestIds array
  this.requestIds.newInstance = function( bDeserializing )
  {
    var newObj = new Identifier( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.requestIds_newInstance = function( bDeserializing )
  {
    var newLen = this.requestIds.push( new Identifier( bDeserializing ) );
    return this.requestIds[ newLen-1 ];
  }
  this.$$elementChildren.push( "requestIds" );
}

function deleteRequestsResponse(  ) 
{
  this.$$nsPrefix = "ns1";
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
  this.$$name = "deleteRequestsResponse";
  this.$$xmlNames[ "deleteRequestsResponse" ] = "deleteRequestsResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$xmlNames["_return"] = "return";
  this.$$objNames["return"] = "_return";
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this._return = new xs_int();
  }
  this.$$childElementFunctions[ "_return" ] = xs_int;
  this.$$elementChildren.push( "_return" );
}

function setRequestRemoteReferenceStatus(  ) 
{
  this.$$nsPrefix = "ns1";
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
  this.$$name = "setRequestRemoteReferenceStatus";
  this.$$xmlNames[ "setRequestRemoteReferenceStatus" ] = "setRequestRemoteReferenceStatus";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://mercury.com/ppm/dm/service/1.0");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this.receiver = new Identifier();
  }
  this.$$childElementFunctions[ "receiver" ] = Identifier;
  this.$$elementChildren.push( "receiver" );
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this.source = new Identifier();
  }
  this.$$childElementFunctions[ "source" ] = Identifier;
  this.$$elementChildren.push( "source" );
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this.status = new xs_string();
  }
  this.$$childElementFunctions[ "status" ] = xs_string;
  this.$$elementChildren.push( "status" );
  this.fields = new Array();  // of SimpleField
  this.fields.$$nsPrefix = "ns1"
 // method to create a new member of the fields array
  this.fields.newInstance = function( bDeserializing )
  {
    var newObj = new SimpleField( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.fields_newInstance = function( bDeserializing )
  {
    var newLen = this.fields.push( new SimpleField( bDeserializing ) );
    return this.fields[ newLen-1 ];
  }
  this.$$elementChildren.push( "fields" );
}

function xs_string( val ) 
{
  this.$$nsPrefix = "xsd";
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

function setRequestRemoteReferenceStatusResponse(  ) 
{
  this.$$nsPrefix = "ns1";
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
  this.$$name = "setRequestRemoteReferenceStatusResponse";
  this.$$xmlNames[ "setRequestRemoteReferenceStatusResponse" ] = "setRequestRemoteReferenceStatusResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$xmlNames["_return"] = "return";
  this.$$objNames["return"] = "_return";
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this._return = new xs_int();
  }
  this.$$childElementFunctions[ "_return" ] = xs_int;
  this.$$elementChildren.push( "_return" );
}

function setRequestFields(  ) 
{
  this.$$nsPrefix = "ns1";
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
  this.$$name = "setRequestFields";
  this.$$xmlNames[ "setRequestFields" ] = "setRequestFields";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://mercury.com/ppm/dm/service/1.0");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this.requestId = new Identifier();
  }
  this.$$childElementFunctions[ "requestId" ] = Identifier;
  this.$$elementChildren.push( "requestId" );
  this.fields = new Array();  // of SimpleField
  this.fields.$$nsPrefix = "ns1"
 // method to create a new member of the fields array
  this.fields.newInstance = function( bDeserializing )
  {
    var newObj = new SimpleField( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.fields_newInstance = function( bDeserializing )
  {
    var newLen = this.fields.push( new SimpleField( bDeserializing ) );
    return this.fields[ newLen-1 ];
  }
  this.$$elementChildren.push( "fields" );
}

function setRequestFieldsResponse(  ) 
{
  this.$$nsPrefix = "ns1";
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
  this.$$name = "setRequestFieldsResponse";
  this.$$xmlNames[ "setRequestFieldsResponse" ] = "setRequestFieldsResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$xmlNames["_return"] = "return";
  this.$$objNames["return"] = "_return";
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this._return = new xs_int();
  }
  this.$$childElementFunctions[ "_return" ] = xs_int;
  this.$$elementChildren.push( "_return" );
}

function executeWFTransitions(  ) 
{
  this.$$nsPrefix = "ns1";
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
  this.$$name = "executeWFTransitions";
  this.$$xmlNames[ "executeWFTransitions" ] = "executeWFTransitions";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://mercury.com/ppm/dm/service/1.0");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this.receiver = new Identifier();
  }
  this.$$childElementFunctions[ "receiver" ] = Identifier;
  this.$$elementChildren.push( "receiver" );
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this.transition = new xs_string();
  }
  this.$$childElementFunctions[ "transition" ] = xs_string;
  this.$$elementChildren.push( "transition" );
}

function executeWFTransitionsResponse(  ) 
{
  this.$$nsPrefix = "ns1";
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
  this.$$name = "executeWFTransitionsResponse";
  this.$$xmlNames[ "executeWFTransitionsResponse" ] = "executeWFTransitionsResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$xmlNames["_return"] = "return";
  this.$$objNames["return"] = "_return";
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this._return = new xs_string();
  }
  this.$$childElementFunctions[ "_return" ] = xs_string;
  this.$$elementChildren.push( "_return" );
}

function Request(  ) 
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
  this.$$name = "Request";
  this.$$xmlNames[ "Request" ] = "Request";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "id" ] = 0;
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this.id = new xs_string();
  }
  this.$$childElementFunctions[ "id" ] = xs_string;
  this.$$elementChildren.push( "id" );
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this.requestType = new xs_string();
  }
  this.$$childElementFunctions[ "requestType" ] = xs_string;
  this.$$elementChildren.push( "requestType" );
  this.simpleFields = new Array();  // of SimpleField
  this.simpleFields.$$nsPrefix = "ns8"
 // method to create a new member of the simpleFields array
  this.simpleFields.newInstance = function( bDeserializing )
  {
    var newObj = new SimpleField( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.simpleFields_newInstance = function( bDeserializing )
  {
    var newLen = this.simpleFields.push( new SimpleField( bDeserializing ) );
    return this.simpleFields[ newLen-1 ];
  }
  this.$$elementChildren.push( "simpleFields" );
  this.tables = new Array();  // of Table
  this.tables.$$nsPrefix = "ns8"
 // method to create a new member of the tables array
  this.tables.newInstance = function( bDeserializing )
  {
    var newObj = new Table( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.tables_newInstance = function( bDeserializing )
  {
    var newLen = this.tables.push( new Table( bDeserializing ) );
    return this.tables[ newLen-1 ];
  }
  this.$$elementChildren.push( "tables" );
  this.notes = new Array();  // of Note
  this.notes.$$nsPrefix = "ns8"
 // method to create a new member of the notes array
  this.notes.newInstance = function( bDeserializing )
  {
    var newObj = new Note( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.notes_newInstance = function( bDeserializing )
  {
    var newLen = this.notes.push( new Note( bDeserializing ) );
    return this.notes[ newLen-1 ];
  }
  this.$$elementChildren.push( "notes" );
  this.fieldChangeNotes = new Array();  // of FieldChangeNote
  this.fieldChangeNotes.$$nsPrefix = "ns8"
 // method to create a new member of the fieldChangeNotes array
  this.fieldChangeNotes.newInstance = function( bDeserializing )
  {
    var newObj = new FieldChangeNote( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.fieldChangeNotes_newInstance = function( bDeserializing )
  {
    var newLen = this.fieldChangeNotes.push( new FieldChangeNote( bDeserializing ) );
    return this.fieldChangeNotes[ newLen-1 ];
  }
  this.$$elementChildren.push( "fieldChangeNotes" );
  this.URLReferences = new Array();  // of URLReference
  this.URLReferences.$$nsPrefix = "ns8"
 // method to create a new member of the URLReferences array
  this.URLReferences.newInstance = function( bDeserializing )
  {
    var newObj = new URLReference( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.URLReferences_newInstance = function( bDeserializing )
  {
    var newLen = this.URLReferences.push( new URLReference( bDeserializing ) );
    return this.URLReferences[ newLen-1 ];
  }
  this.$$elementChildren.push( "URLReferences" );
  this.remoteReferences = new Array();  // of RemoteReference
  this.remoteReferences.$$nsPrefix = "ns8"
 // method to create a new member of the remoteReferences array
  this.remoteReferences.newInstance = function( bDeserializing )
  {
    var newObj = new RemoteReference( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.remoteReferences_newInstance = function( bDeserializing )
  {
    var newLen = this.remoteReferences.push( new RemoteReference( bDeserializing ) );
    return this.remoteReferences[ newLen-1 ];
  }
  this.$$elementChildren.push( "remoteReferences" );
}

function Identifier(  ) 
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
  this.$$name = "Identifier";
  this.$$xmlNames[ "Identifier" ] = "Identifier";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this.id = new xs_string();
  }
  this.$$childElementFunctions[ "id" ] = xs_string;
  this.$$elementChildren.push( "id" );
  this.$$minOccurs[ "serverURL" ] = 0;
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this.serverURL = new xs_string();
  }
  this.$$childElementFunctions[ "serverURL" ] = xs_string;
  this.$$elementChildren.push( "serverURL" );
}

function Reference(  ) 
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
  this.$$name = "Reference";
  this.$$xmlNames[ "Reference" ] = "Reference";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "addedBy" ] = 0;
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this.addedBy = new xs_string();
  }
  this.$$childElementFunctions[ "addedBy" ] = xs_string;
  this.$$elementChildren.push( "addedBy" );
  this.$$minOccurs[ "creationDate" ] = 0;
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this.creationDate = new xs_dateTime();
  }
  this.$$childElementFunctions[ "creationDate" ] = xs_dateTime;
  this.$$elementChildren.push( "creationDate" );
  this.$$minOccurs[ "description" ] = 0;
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this.description = new xs_string();
  }
  this.$$childElementFunctions[ "description" ] = xs_string;
  this.$$elementChildren.push( "description" );
  this.$$minOccurs[ "name" ] = 0;
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this.name = new xs_string();
  }
  this.$$childElementFunctions[ "name" ] = xs_string;
  this.$$elementChildren.push( "name" );
}

function xs_dateTime( val ) 
{
  this.$$nsPrefix = "xsd";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xsi_type = new String("xsd:");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function RemoteReference(  ) 
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
  this.$$name = "RemoteReference";
  this.$$xmlNames[ "RemoteReference" ] = "RemoteReference";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
/*
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
//*/
  this.$$minOccurs[ "addedBy" ] = 0;
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this.addedBy = new xs_string();
  }
  this.$$childElementFunctions[ "addedBy" ] = xs_string;
  this.addedBy.$$nsPrefix = "ns8"
  this.$$refs[ "addedBy" ] = true;
  this.$$elementChildren.push( "addedBy" );
  this.$$minOccurs[ "creationDate" ] = 0;
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this.creationDate = new xs_dateTime();
  }
  this.$$childElementFunctions[ "creationDate" ] = xs_dateTime;
  this.creationDate.$$nsPrefix = "ns8"
  this.$$refs[ "creationDate" ] = true;
  this.$$elementChildren.push( "creationDate" );
  this.$$minOccurs[ "description" ] = 0;
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this.description = new xs_string();
  }
  this.$$childElementFunctions[ "description" ] = xs_string;
  this.description.$$nsPrefix = "ns8"
  this.$$refs[ "description" ] = true;
  this.$$elementChildren.push( "description" );
  this.$$minOccurs[ "name" ] = 0;
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this.name = new xs_string();
  }
  this.$$childElementFunctions[ "name" ] = xs_string;
  this.name.$$nsPrefix = "ns8"
  this.$$refs[ "name" ] = true;
  this.$$elementChildren.push( "name" );
  this.$$minOccurs[ "displayURL" ] = 0;
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this.displayURL = new xs_string();
  }
  this.$$childElementFunctions[ "displayURL" ] = xs_string;
  this.$$elementChildren.push( "displayURL" );
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this.identifier = new RemoteReference_Identifier();
  }
  this.$$childElementFunctions[ "identifier" ] = RemoteReference_Identifier;
  this.$$elementChildren.push( "identifier" );
  this.$$minOccurs[ "status" ] = 0;
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this.status = new xs_string();
  }
  this.$$childElementFunctions[ "status" ] = xs_string;
  this.$$elementChildren.push( "status" );
}

function RemoteReference_Identifier(  ) 
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
  this.$$name = "RemoteReference_Identifier";
  this.$$xmlNames[ "RemoteReference_Identifier" ] = "identifier";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this.id = new xs_string();
  }
  this.$$childElementFunctions[ "id" ] = xs_string;
  this.$$elementChildren.push( "id" );
  this.$$minOccurs[ "serverURL" ] = 0;
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this.serverURL = new xs_string();
  }
  this.$$childElementFunctions[ "serverURL" ] = xs_string;
  this.$$elementChildren.push( "serverURL" );
}

function RequestRemoteReference(  ) 
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
  this.$$name = "RequestRemoteReference";
  this.$$xmlNames[ "RequestRemoteReference" ] = "RequestRemoteReference";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "displayURL" ] = 0;
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this.displayURL = new xs_string();
  }
  this.$$childElementFunctions[ "displayURL" ] = xs_string;
  this.displayURL.$$nsPrefix = "ns8"
  this.$$refs[ "displayURL" ] = true;
  this.$$elementChildren.push( "displayURL" );
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this.identifier = new RemoteReference_Identifier();
  }
  this.$$childElementFunctions[ "identifier" ] = RemoteReference_Identifier;
  this.identifier.$$nsPrefix = "ns8"
  this.$$refs[ "identifier" ] = true;
  this.$$elementChildren.push( "identifier" );
  this.$$minOccurs[ "status" ] = 0;
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this.status = new xs_string();
  }
  this.$$childElementFunctions[ "status" ] = xs_string;
  this.status.$$nsPrefix = "ns8"
  this.$$refs[ "status" ] = true;
  this.$$elementChildren.push( "status" );
  this.$$minOccurs[ "requestTypeName" ] = 0;
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this.requestTypeName = new xs_string();
  }
  this.$$childElementFunctions[ "requestTypeName" ] = xs_string;
  this.$$elementChildren.push( "requestTypeName" );
  this.$$minOccurs[ "relationType" ] = 0;
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this.relationType = new xs_string();
  }
  this.$$childElementFunctions[ "relationType" ] = xs_string;
  this.$$elementChildren.push( "relationType" );
}

function URLReference(  ) 
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
  this.$$name = "URLReference";
  this.$$xmlNames[ "URLReference" ] = "URLReference";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "addedBy" ] = 0;
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this.addedBy = new xs_string();
  }
  this.$$childElementFunctions[ "addedBy" ] = xs_string;
  this.addedBy.$$nsPrefix = "ns8"
  this.$$refs[ "addedBy" ] = true;
  this.$$elementChildren.push( "addedBy" );
  this.$$minOccurs[ "creationDate" ] = 0;
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this.creationDate = new xs_dateTime();
  }
  this.$$childElementFunctions[ "creationDate" ] = xs_dateTime;
  this.creationDate.$$nsPrefix = "ns8"
  this.$$refs[ "creationDate" ] = true;
  this.$$elementChildren.push( "creationDate" );
  this.$$minOccurs[ "description" ] = 0;
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this.description = new xs_string();
  }
  this.$$childElementFunctions[ "description" ] = xs_string;
  this.description.$$nsPrefix = "ns8"
  this.$$refs[ "description" ] = true;
  this.$$elementChildren.push( "description" );
  this.$$minOccurs[ "name" ] = 0;
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this.name = new xs_string();
  }
  this.$$childElementFunctions[ "name" ] = xs_string;
  this.name.$$nsPrefix = "ns8"
  this.$$refs[ "name" ] = true;
  this.$$elementChildren.push( "name" );
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this.refURL = new xs_string();
  }
  this.$$childElementFunctions[ "refURL" ] = xs_string;
  this.$$elementChildren.push( "refURL" );
}

function SimpleField(  ) 
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
  this.$$name = "SimpleField";
  this.$$xmlNames[ "SimpleField" ] = "SimpleField";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined || this.$$deserializing || this.$$deserializing )
  {
  this.token = new xs_string();
  }
  this.$$childElementFunctions[ "token" ] = xs_string;
  this.token.$$nsPrefix = "ns7"
  this.$$refs[ "token" ] = true;
  this.$$elementChildren.push( "token" );
  this.stringValue = new Array();  // of xs_string
  this.stringValue.$$nsPrefix = "ns8"
 // method to create a new member of the stringValue array
  this.stringValue.newInstance = function( bDeserializing )
  {
    var newObj = new xs_string(  );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.stringValue_newInstance = function( bDeserializing )
  {
    var newLen = this.stringValue.push( new xs_string(  ) );
    return this.stringValue[ newLen-1 ];
  }
  this.$$elementChildren.push( "stringValue" );
  this.$$minOccurs[ "dateValue" ] = 0;
  if ( this.$$deserializing == undefined || this.$$deserializing || this.$$deserializing )
  {
  this.dateValue = new xs_dateTime();
  }
  this.$$childElementFunctions[ "dateValue" ] = xs_dateTime;
  this.$$elementChildren.push( "dateValue" );
}

function FieldChangeNote(  ) 
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
  this.$$name = "FieldChangeNote";
  this.$$xmlNames[ "FieldChangeNote" ] = "FieldChangeNote";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "author" ] = 0;
  if ( this.$$deserializing == undefined || this.$$deserializing || this.$$deserializing )
  {
  this.author = new xs_string();
  }
  this.$$childElementFunctions[ "author" ] = xs_string;
  this.author.$$nsPrefix = "ns7"
  this.$$refs[ "author" ] = true;
  this.$$elementChildren.push( "author" );
  this.$$minOccurs[ "creationDate" ] = 0;
  if ( this.$$deserializing == undefined || this.$$deserializing || this.$$deserializing )
  {
  this.creationDate = new xs_dateTime();
  }
  this.$$childElementFunctions[ "creationDate" ] = xs_dateTime;
  this.creationDate.$$nsPrefix = "ns7"
  this.$$refs[ "creationDate" ] = true;
  this.$$elementChildren.push( "creationDate" );
  this.$$minOccurs[ "content" ] = 0;
  if ( this.$$deserializing == undefined || this.$$deserializing || this.$$deserializing )
  {
  this.content = new xs_string();
  }
  this.$$childElementFunctions[ "content" ] = xs_string;
  this.content.$$nsPrefix = "ns7"
  this.$$refs[ "content" ] = true;
  this.$$elementChildren.push( "content" );
  if ( this.$$deserializing == undefined || this.$$deserializing || this.$$deserializing )
  {
  this.fieldPrompt = new xs_string();
  }
  this.$$childElementFunctions[ "fieldPrompt" ] = xs_string;
  this.$$elementChildren.push( "fieldPrompt" );
  if ( this.$$deserializing == undefined || this.$$deserializing || this.$$deserializing )
  {
  this.oldValue = new xs_string();
  }
  this.$$childElementFunctions[ "oldValue" ] = xs_string;
  this.$$elementChildren.push( "oldValue" );
  if ( this.$$deserializing == undefined || this.$$deserializing || this.$$deserializing )
  {
  this.newValue = new xs_string();
  }
  this.$$childElementFunctions[ "newValue" ] = xs_string;
  this.$$elementChildren.push( "newValue" );
}

function AuditHeader(  ) 
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
  this.$$name = "AuditHeader";
  this.$$xmlNames[ "AuditHeader" ] = "AuditHeader";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "audit-note" ] = 0;
  this.$$xmlNames["audit_note"] = "audit-note";
  this.$$objNames["audit-note"] = "audit_note";
  if ( this.$$deserializing == undefined || this.$$deserializing || this.$$deserializing )
  {
  this.audit_note = new xs_string();
  }
  this.$$childElementFunctions[ "audit_note" ] = xs_string;
  this.$$elementChildren.push( "audit_note" );
  this.$$minOccurs[ "audit-origin" ] = 0;
  this.$$xmlNames["audit_origin"] = "audit-origin";
  this.$$objNames["audit-origin"] = "audit_origin";
  if ( this.$$deserializing == undefined || this.$$deserializing || this.$$deserializing )
  {
  this.audit_origin = new xs_string();
  }
  this.$$childElementFunctions[ "audit_origin" ] = xs_string;
  this.$$elementChildren.push( "audit_origin" );
  this.$$minOccurs[ "audit-transaction-name" ] = 0;
  this.$$xmlNames["audit_transaction_name"] = "audit-transaction-name";
  this.$$objNames["audit-transaction-name"] = "audit_transaction_name";
  if ( this.$$deserializing == undefined || this.$$deserializing || this.$$deserializing )
  {
  this.audit_transaction_name = new xs_string();
  }
  this.$$childElementFunctions[ "audit_transaction_name" ] = xs_string;
  this.$$elementChildren.push( "audit_transaction_name" );
}

function Note(  ) 
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
  this.$$name = "Note";
  this.$$xmlNames[ "Note" ] = "Note";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "author" ] = 0;
  if ( this.$$deserializing == undefined || this.$$deserializing || this.$$deserializing )
  {
  this.author = new xs_string();
  }
  this.$$childElementFunctions[ "author" ] = xs_string;
  this.$$elementChildren.push( "author" );
  this.$$minOccurs[ "creationDate" ] = 0;
  if ( this.$$deserializing == undefined || this.$$deserializing || this.$$deserializing )
  {
  this.creationDate = new xs_dateTime();
  }
  this.$$childElementFunctions[ "creationDate" ] = xs_dateTime;
  this.$$elementChildren.push( "creationDate" );
  this.$$minOccurs[ "content" ] = 0;
  if ( this.$$deserializing == undefined || this.$$deserializing || this.$$deserializing )
  {
  this.content = new xs_string();
  }
  this.$$childElementFunctions[ "content" ] = xs_string;
  this.$$elementChildren.push( "content" );
}

function Field(  ) 
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
  this.$$name = "Field";
  this.$$xmlNames[ "Field" ] = "Field";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined || this.$$deserializing || this.$$deserializing )
  {
  this.token = new xs_string();
  }
  this.$$childElementFunctions[ "token" ] = xs_string;
  this.$$elementChildren.push( "token" );
}

function Table(  ) 
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
  this.$$name = "Table";
  this.$$xmlNames[ "Table" ] = "Table";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined || this.$$deserializing || this.$$deserializing )
  {
  this.token = new xs_string();
  }
  this.$$childElementFunctions[ "token" ] = xs_string;
  this.token.$$nsPrefix = "ns7"
  this.$$refs[ "token" ] = true;
  this.$$elementChildren.push( "token" );
  this.columns = new Array();  // of Column
  this.columns.$$nsPrefix = "ns7"
 // method to create a new member of the columns array
  this.columns.newInstance = function( bDeserializing )
  {
    var newObj = new Column( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.columns_newInstance = function( bDeserializing )
  {
    var newLen = this.columns.push( new Column( bDeserializing ) );
    return this.columns[ newLen-1 ];
  }
  this.$$elementChildren.push( "columns" );
}

function Column(  ) 
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
  this.$$name = "Column";
  this.$$xmlNames[ "Column" ] = "Column";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined || this.$$deserializing || this.$$deserializing )
  {
  this.token = new xs_string();
  }
  this.$$childElementFunctions[ "token" ] = xs_string;
  this.token.$$nsPrefix = "ns7"
  this.$$refs[ "token" ] = true;
  this.$$elementChildren.push( "token" );
  this.values = new Array();  // of xs_string
  this.values.$$nsPrefix = "ns7"
 // method to create a new member of the values array
  this.values.newInstance = function( bDeserializing )
  {
    var newObj = new xs_string(  );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.values_newInstance = function( bDeserializing )
  {
    var newLen = this.values.push( new xs_string(  ) );
    return this.values[ newLen-1 ];
  }
  this.$$elementChildren.push( "values" );
  this.dates = new Array();  // of xs_dateTime
  this.dates.$$nsPrefix = "ns7"
 // method to create a new member of the dates array
  this.dates.newInstance = function( bDeserializing )
  {
    var newObj = new xs_dateTime(  );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.dates_newInstance = function( bDeserializing )
  {
    var newLen = this.dates.push( new xs_dateTime(  ) );
    return this.dates[ newLen-1 ];
  }
  this.$$elementChildren.push( "dates" );
}

function FieldMetaData(  ) 
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
  this.$$name = "FieldMetaData";
  this.$$xmlNames[ "FieldMetaData" ] = "FieldMetaData";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "description" ] = 0;
  if ( this.$$deserializing == undefined || this.$$deserializing || this.$$deserializing )
  {
  this.description = new xs_string();
  }
  this.$$childElementFunctions[ "description" ] = xs_string;
  this.$$elementChildren.push( "description" );
  this.$$minOccurs[ "prompt" ] = 0;
  if ( this.$$deserializing == undefined || this.$$deserializing || this.$$deserializing )
  {
  this.prompt = new xs_string();
  }
  this.$$childElementFunctions[ "prompt" ] = xs_string;
  this.$$elementChildren.push( "prompt" );
  if ( this.$$deserializing == undefined || this.$$deserializing || this.$$deserializing )
  {
  this.required = new xs_boolean();
  }
  this.$$childElementFunctions[ "required" ] = xs_boolean;
  this.$$elementChildren.push( "required" );
  this.$$minOccurs[ "token" ] = 0;
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this.token = new xs_string();
  }
  this.$$childElementFunctions[ "token" ] = xs_string;
  this.$$elementChildren.push( "token" );
}

function xs_boolean( val ) 
{
  this.$$nsPrefix = "xsd";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xsi_type = new String("xsd:");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function setRequestRemoteReferenceStatusMessage( val ) 
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
  this.xmlns_ns0 = new String("http://mercury.com/ppm/dm/msg/1.0");
  this.$$attributes.push( "xmlns_ns0" );
  this.$$xmlNames["xmlns_ns0"] = "xmlns:ns0";
  this.$$objNames["xmlns:ns0"] = "xmlns_ns0";
}

function setRequestRemoteReferenceStatusResponseMessage( val ) 
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
  this.xmlns_ns0 = new String("http://mercury.com/ppm/dm/msg/1.0");
  this.$$attributes.push( "xmlns_ns0" );
  this.$$xmlNames["xmlns_ns0"] = "xmlns:ns0";
  this.$$objNames["xmlns:ns0"] = "xmlns_ns0";
}

function addRequestNotesMessage( val ) 
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
  this.xmlns_ns0 = new String("http://mercury.com/ppm/dm/msg/1.0");
  this.$$attributes.push( "xmlns_ns0" );
  this.$$xmlNames["xmlns_ns0"] = "xmlns:ns0";
  this.$$objNames["xmlns:ns0"] = "xmlns_ns0";
}

function addRequestNotesResponseMessage( val ) 
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
  this.xmlns_ns0 = new String("http://mercury.com/ppm/dm/msg/1.0");
  this.$$attributes.push( "xmlns_ns0" );
  this.$$xmlNames["xmlns_ns0"] = "xmlns:ns0";
  this.$$objNames["xmlns:ns0"] = "xmlns_ns0";
}

function createRequestMessage( val ) 
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
  this.xmlns_ns0 = new String("http://mercury.com/ppm/dm/msg/1.0");
  this.$$attributes.push( "xmlns_ns0" );
  this.$$xmlNames["xmlns_ns0"] = "xmlns:ns0";
  this.$$objNames["xmlns:ns0"] = "xmlns_ns0";
}

function createRequestResponseMessage( val ) 
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
  this.xmlns_ns0 = new String("http://mercury.com/ppm/dm/msg/1.0");
  this.$$attributes.push( "xmlns_ns0" );
  this.$$xmlNames["xmlns_ns0"] = "xmlns:ns0";
  this.$$objNames["xmlns:ns0"] = "xmlns_ns0";
}

function deleteRequestsMessage( val ) 
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
  this.xmlns_ns0 = new String("http://mercury.com/ppm/dm/msg/1.0");
  this.$$attributes.push( "xmlns_ns0" );
  this.$$xmlNames["xmlns_ns0"] = "xmlns:ns0";
  this.$$objNames["xmlns:ns0"] = "xmlns_ns0";
}

function deleteRequestsResponseMessage( val ) 
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
  this.xmlns_ns0 = new String("http://mercury.com/ppm/dm/msg/1.0");
  this.$$attributes.push( "xmlns_ns0" );
  this.$$xmlNames["xmlns_ns0"] = "xmlns:ns0";
  this.$$objNames["xmlns:ns0"] = "xmlns_ns0";
}

function setRequestFieldsMessage( val ) 
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
  this.xmlns_ns0 = new String("http://mercury.com/ppm/dm/msg/1.0");
  this.$$attributes.push( "xmlns_ns0" );
  this.$$xmlNames["xmlns_ns0"] = "xmlns:ns0";
  this.$$objNames["xmlns:ns0"] = "xmlns_ns0";
}

function setRequestFieldsResponseMessage( val ) 
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
  this.xmlns_ns0 = new String("http://mercury.com/ppm/dm/msg/1.0");
  this.$$attributes.push( "xmlns_ns0" );
  this.$$xmlNames["xmlns_ns0"] = "xmlns:ns0";
  this.$$objNames["xmlns:ns0"] = "xmlns_ns0";
}

function getRequestsMessage( val ) 
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
  this.xmlns_ns0 = new String("http://mercury.com/ppm/dm/msg/1.0");
  this.$$attributes.push( "xmlns_ns0" );
  this.$$xmlNames["xmlns_ns0"] = "xmlns:ns0";
  this.$$objNames["xmlns:ns0"] = "xmlns_ns0";
}

function getRequestsResponseMessage( val ) 
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
  this.xmlns_ns0 = new String("http://mercury.com/ppm/dm/msg/1.0");
  this.$$attributes.push( "xmlns_ns0" );
  this.$$xmlNames["xmlns_ns0"] = "xmlns:ns0";
  this.$$objNames["xmlns:ns0"] = "xmlns_ns0";
}

function executeWFTransitionsMessage( val ) 
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
  this.xmlns_ns0 = new String("http://mercury.com/ppm/dm/msg/1.0");
  this.$$attributes.push( "xmlns_ns0" );
  this.$$xmlNames["xmlns_ns0"] = "xmlns:ns0";
  this.$$objNames["xmlns:ns0"] = "xmlns_ns0";
}

function executeWFTransitionsResponseMessage( val ) 
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
  this.xmlns_ns0 = new String("http://mercury.com/ppm/dm/msg/1.0");
  this.$$attributes.push( "xmlns_ns0" );
  this.$$xmlNames["xmlns_ns0"] = "xmlns:ns0";
  this.$$objNames["xmlns:ns0"] = "xmlns_ns0";
}

function xsd_string( val ) 
{
  this.$$nsPrefix = "xsd";
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

function getChildFunc( childElemName ) 
{
 return this.$$childElementFunctions[ childElemName ];
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