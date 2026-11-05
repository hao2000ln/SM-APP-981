function WSCentralServiceService(ooservice_url, user, password)
{
  this.location = new String( ooservice_url );

  this.user = user;
  this.password = password;
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

  this.SOAPOperations[ "list" ] = new soap_Operation( "list", "", "rpc", "listRequest", "listResponse" );  
  this.SOAPOperations[ "getRunStatus" ] = new soap_Operation( "getRunStatus", "", "rpc", "getRunStatusRequest", "getRunStatusResponse" );
  this.SOAPOperations[ "getRunStatusEx" ] = new soap_Operation( "getRunStatusEx", "", "rpc", "getRunStatusExRequest", "getRunStatusExResponse" );
  this.SOAPOperations[ "getFlowDetails" ] = new soap_Operation( "getFlowDetails", "", "rpc", "getFlowDetailsRequest", "getFlowDetailsResponse" );
  this.SOAPOperations[ "runFlowEx" ] = new soap_Operation( "runFlowEx", "", "rpc", "runFlowExRequest", "runFlowExResponse" );

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
    lib.SOAP.deserialize( "WSCentralServiceService", this.resultXML.getDocumentElement(), resultObj );
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
  this.soap_encodingStyle = new String("http://schemas.xmlsoap.org/soap/encoding/");
  this.$$attributes.push( "soap_encodingStyle" );
  this.$$xmlNames["soap_encodingStyle"] = "soap:encodingStyle";
  this.$$objNames["soap:encodingStyle"] = "soap_encodingStyle";
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
  this.xmlns_ns0 = new String("http://xml.apache.org/xml-soap");
  this.$$attributes.push( "xmlns_ns0" );
  this.$$xmlNames["xmlns_ns0"] = "xmlns:ns0";
  this.$$objNames["xmlns:ns0"] = "xmlns_ns0";
  this.xmlns_ns2 = new String("http://schemas.xmlsoap.org/soap/encoding/");
  this.$$attributes.push( "xmlns_ns2" );
  this.$$xmlNames["xmlns_ns2"] = "xmlns:ns2";
  this.$$objNames["xmlns:ns2"] = "xmlns_ns2";
  this.xmlns_ns3 = new String("http://iconclude.com/webservices/rss/v2.0/soap");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
  this.xmlns_ns4 = new String("http://schemas.xmlsoap.org/wsdl/");
  this.$$attributes.push( "xmlns_ns4" );
  this.$$xmlNames["xmlns_ns4"] = "xmlns:ns4";
  this.$$objNames["xmlns:ns4"] = "xmlns_ns4";
  this.xmlns_ns5 = new String("http://schemas.xmlsoap.org/wsdl/soap/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
  this.xmlns_ns1 = new String("");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
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

function WSFlow(  ) 
{
  this.$$nsPrefix = "ns3";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "WSFlow";
  this.$$xmlNames[ "WSFlow" ] = "WSFlow";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.UUID = new xsd_string();
  }
  this.$$childElementFunctions[ "UUID" ] = xsd_string;
  this.$$elementChildren.push( "UUID" );
  if ( this.$$deserializing == undefined )
  {
  this.name = new xsd_string();
  }
  this.$$childElementFunctions[ "name" ] = xsd_string;
  this.$$elementChildren.push( "name" );
  if ( this.$$deserializing == undefined )
  {
  this.path = new xsd_string();
  }
  this.$$childElementFunctions[ "path" ] = xsd_string;
  this.$$elementChildren.push( "path" );
}

function xsd_string( val ) 
{
  this.$$nsPrefix = "xsd";
  this.$$elementFormDefault = "unqualified";
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

function WSFlowInputDef(  ) 
{
  this.$$nsPrefix = "ns3";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "WSFlowInputDef";
  this.$$xmlNames[ "WSFlowInputDef" ] = "WSFlowInputDef";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this.defaultValue = new xsd_string();
  }
  this.$$childElementFunctions[ "defaultValue" ] = xsd_string;
  this.$$elementChildren.push( "defaultValue" );
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this.defaultValues = new ArrayOf_xsd_string_defaultValues();
  }
  this.$$childElementFunctions[ "defaultValues" ] = ArrayOf_xsd_string_defaultValues;
  this.$$elementChildren.push( "defaultValues" );
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this.description = new xsd_string();
  }
  this.$$childElementFunctions[ "description" ] = xsd_string;
  this.$$elementChildren.push( "description" );
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this.encrypted = new xsd_boolean();
  }
  this.$$childElementFunctions[ "encrypted" ] = xsd_boolean;
  this.$$elementChildren.push( "encrypted" );
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this.isList = new xsd_boolean();
  }
  this.$$childElementFunctions[ "isList" ] = xsd_boolean;
  this.$$elementChildren.push( "isList" );
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this.list = new xsd_boolean();
  }
  this.$$childElementFunctions[ "list" ] = xsd_boolean;
  this.$$elementChildren.push( "list" );
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this.listType = new xsd_int();
  }
  this.$$childElementFunctions[ "listType" ] = xsd_int;
  this.$$elementChildren.push( "listType" );
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this.name = new xsd_string();
  }
  this.$$childElementFunctions[ "name" ] = xsd_string;
  this.$$elementChildren.push( "name" );
  if ( this.$$deserializing == undefined || this.$$deserializing )
  {
  this.required = new xsd_boolean();
  }
  this.$$childElementFunctions[ "required" ] = xsd_boolean;
  this.$$elementChildren.push( "required" );
}

function xsd_boolean( val ) 
{
  this.$$nsPrefix = "xsd";
  this.$$elementFormDefault = "unqualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xsi_type = new String("xsd:boolean");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function xsd_int( val ) 
{
  this.$$nsPrefix = "xsd";
  this.$$elementFormDefault = "unqualified";
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

function WSFlowDetails(  )
{
  this.$$nsPrefix = "ns3";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "WSFlowDetails";
  this.$$xmlNames[ "WSFlowDetails" ] = "WSFlowDetails";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined || this.$$deserializing)
  {
  this.UUID = new xsd_string();
  }
  this.$$childElementFunctions[ "UUID" ] = xsd_string;
  this.UUID.$$nsPrefix = "ns3"
  this.$$refs[ "UUID" ] = true;
  this.$$elementChildren.push( "UUID" );
  if ( this.$$deserializing == undefined || this.$$deserializing)
  {
  this.name = new xsd_string();
  }
  this.$$childElementFunctions[ "name" ] = xsd_string;
  this.name.$$nsPrefix = "ns3"
  this.$$refs[ "name" ] = true;
  this.$$elementChildren.push( "name" );
  if ( this.$$deserializing == undefined || this.$$deserializing)
  {
  this.path = new xsd_string();
  }
  this.$$childElementFunctions[ "path" ] = xsd_string;
  this.path.$$nsPrefix = "ns3"
  this.$$refs[ "path" ] = true;
  this.$$elementChildren.push( "path" );
  if ( this.$$deserializing == undefined || this.$$deserializing)
  {
  this.categories = new ArrayOf_xsd_string_categories();
  }
  this.$$childElementFunctions[ "categories" ] = ArrayOf_xsd_string_categories;
  this.$$elementChildren.push( "categories" );
  if ( this.$$deserializing == undefined || this.$$deserializing)
  {
  this.description = new xsd_string();
  }
  this.$$childElementFunctions[ "description" ] = xsd_string;
  this.$$elementChildren.push( "description" );
  if ( this.$$deserializing == undefined || this.$$deserializing)
  {
  this.domain = new xsd_string();
  }
  this.$$childElementFunctions[ "domain" ] = xsd_string;
  this.$$elementChildren.push( "domain" );
  if ( this.$$deserializing == undefined || this.$$deserializing)
  {
  this.lastModifiedBy = new xsd_string();
  }
  this.$$childElementFunctions[ "lastModifiedBy" ] = xsd_string;
  this.$$elementChildren.push( "lastModifiedBy" );
  if ( this.$$deserializing == undefined || this.$$deserializing)
  {
  this.lastModifiedTime = new xsd_long();
  }
  this.$$childElementFunctions[ "lastModifiedTime" ] = xsd_long;
  this.$$elementChildren.push( "lastModifiedTime" );
  if ( this.$$deserializing == undefined || this.$$deserializing)
  {
  this.parameters = new ArrayOf_tns1_WSFlowInputDef();
  }
  this.$$childElementFunctions[ "parameters" ] = ArrayOf_tns1_WSFlowInputDef;
  this.$$elementChildren.push( "parameters" );
  if ( this.$$deserializing == undefined || this.$$deserializing)
  {
  this.userCanRunFlow = new xsd_boolean();
  }
  this.$$childElementFunctions[ "userCanRunFlow" ] = xsd_boolean;
  this.$$elementChildren.push( "userCanRunFlow" );
  if ( this.$$deserializing == undefined || this.$$deserializing)
  {
  this.flowVersion = new xsd_string();
  }
  this.$$childElementFunctions[ "flowVersion" ] = xsd_string;
  this.$$elementChildren.push( "flowVersion" );
}

function xsd_long( val ) 
{
  this.$$nsPrefix = "xsd";
  this.$$elementFormDefault = "unqualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xsi_type = new String("xsd:long");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function WSFolderDetails(  ) 
{
  this.$$nsPrefix = "ns3";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "WSFolderDetails";
  this.$$xmlNames[ "WSFolderDetails" ] = "WSFolderDetails";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.lastModifiedBy = new xsd_string();
  }
  this.$$childElementFunctions[ "lastModifiedBy" ] = xsd_string;
  this.$$elementChildren.push( "lastModifiedBy" );
  if ( this.$$deserializing == undefined )
  {
  this.lastModifiedTime = new xsd_long();
  }
  this.$$childElementFunctions[ "lastModifiedTime" ] = xsd_long;
  this.$$elementChildren.push( "lastModifiedTime" );
  if ( this.$$deserializing == undefined )
  {
  this.name = new xsd_string();
  }
  this.$$childElementFunctions[ "name" ] = xsd_string;
  this.$$elementChildren.push( "name" );
  if ( this.$$deserializing == undefined )
  {
  this.path = new xsd_string();
  }
  this.$$childElementFunctions[ "path" ] = xsd_string;
  this.$$elementChildren.push( "path" );
}

function WSFolderContent(  ) 
{
  this.$$nsPrefix = "ns3";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "WSFolderContent";
  this.$$xmlNames[ "WSFolderContent" ] = "WSFolderContent";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.flows = new ArrayOf_tns1_WSFlow();
  }
  this.$$childElementFunctions[ "flows" ] = ArrayOf_tns1_WSFlow;
  this.$$elementChildren.push( "flows" );
  if ( this.$$deserializing == undefined )
  {
  this.folderFound = new xsd_boolean();
  }
  this.$$childElementFunctions[ "folderFound" ] = xsd_boolean;
  this.$$elementChildren.push( "folderFound" );
  if ( this.$$deserializing == undefined )
  {
  this.folderName = new xsd_string();
  }
  this.$$childElementFunctions[ "folderName" ] = xsd_string;
  this.$$elementChildren.push( "folderName" );
  if ( this.$$deserializing == undefined )
  {
  this.folders = new ArrayOf_tns1_WSFolderDetails();
  }
  this.$$childElementFunctions[ "folders" ] = ArrayOf_tns1_WSFolderDetails;
  this.$$elementChildren.push( "folders" );
}

function WSFlowInput(  ) 
{
  this.$$nsPrefix = "ns3";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "WSFlowInput";
  this.$$xmlNames[ "WSFlowInput" ] = "WSFlowInput";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.listValues = new ArrayOf_xsd_string();
  }
  this.$$childElementFunctions[ "listValues" ] = ArrayOf_xsd_string;
  this.$$elementChildren.push( "listValues" );
  if ( this.$$deserializing == undefined )
  {
  this.name = new xsd_string();
  }
  this.$$childElementFunctions[ "name" ] = xsd_string;
  this.$$elementChildren.push( "name" );
  if ( this.$$deserializing == undefined )
  {
  this.value = new xsd_string();
  }
  this.$$childElementFunctions[ "value" ] = xsd_string;
  this.$$elementChildren.push( "value" );
}

function WSRunParameters(  ) 
{
  this.$$nsPrefix = "ns3";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "WSRunParameters";
  this.$$xmlNames[ "WSRunParameters" ] = "WSRunParameters";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.async = new xsd_boolean();
  }
  this.$$childElementFunctions[ "async" ] = xsd_boolean;
  this.$$elementChildren.push( "async" );
  if ( this.$$deserializing == undefined )
  {
  this.flowInputs = new ArrayOf_tns1_WSFlowInput();
  }
  this.$$childElementFunctions[ "flowInputs" ] = ArrayOf_tns1_WSFlowInput;
  this.$$elementChildren.push( "flowInputs" );
  this.$$minOccurs[ "runName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.runName = new xsd_string();
  }
  this.$$childElementFunctions[ "runName" ] = xsd_string;
  this.$$elementChildren.push( "runName" );
  if ( this.$$deserializing == undefined )
  {
  this.startPaused = new xsd_boolean();
  }
  this.$$childElementFunctions[ "startPaused" ] = xsd_boolean;
  this.$$elementChildren.push( "startPaused" );
  if ( this.$$deserializing == undefined )
  {
  this.trackStatus = new xsd_boolean();
  }
  this.$$childElementFunctions[ "trackStatus" ] = xsd_boolean;
  this.$$elementChildren.push( "trackStatus" );
  if ( this.$$deserializing == undefined )
  {
  this.uuid = new xsd_string();
  }
  this.$$childElementFunctions[ "uuid" ] = xsd_string;
  this.$$elementChildren.push( "uuid" );
}

function WSRunParametersEx(  ) 
{
  this.$$nsPrefix = "ns3";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "WSRunParametersEx";
  this.$$xmlNames[ "WSRunParametersEx" ] = "WSRunParametersEx";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.async = new xsd_boolean();
  }
  this.$$childElementFunctions[ "async" ] = xsd_boolean;
  this.$$elementChildren.push( "async" );
  if ( this.$$deserializing == undefined )
  {
  this.flowInputs = new ArrayOf_tns1_WSFlowInput();
  }
  this.$$childElementFunctions[ "flowInputs" ] = ArrayOf_tns1_WSFlowInput;
  this.$$elementChildren.push( "flowInputs" );
  this.$$minOccurs[ "runName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.runName = new xsd_string();
  }
  this.$$childElementFunctions[ "runName" ] = xsd_string;
  this.$$elementChildren.push( "runName" );
  if ( this.$$deserializing == undefined )
  {
  this.startPaused = new xsd_boolean();
  }
  this.$$childElementFunctions[ "startPaused" ] = xsd_boolean;
  this.$$elementChildren.push( "startPaused" );
  if ( this.$$deserializing == undefined )
  {
  this.trackStatus = new xsd_boolean();
  }
  this.$$childElementFunctions[ "trackStatus" ] = xsd_boolean;
  this.$$elementChildren.push( "trackStatus" );
  if ( this.$$deserializing == undefined )
  {
  this.uuid = new xsd_string();
  }
  this.$$childElementFunctions[ "uuid" ] = xsd_string;
  this.$$elementChildren.push( "uuid" );
  if ( this.$$deserializing == undefined )
  {
  this.primaryResultWanted = new xsd_boolean();
  }
  this.$$childElementFunctions[ "primaryResultWanted" ] = xsd_boolean;
  this.$$elementChildren.push( "primaryResultWanted" );
  if ( this.$$deserializing == undefined )
  {
  this.rawResultWanted = new xsd_boolean();
  }
  this.$$childElementFunctions[ "rawResultWanted" ] = xsd_boolean;
  this.$$elementChildren.push( "rawResultWanted" );
  if ( this.$$deserializing == undefined )
  {
  this.statusWanted = new xsd_boolean();
  }
  this.$$childElementFunctions[ "statusWanted" ] = xsd_boolean;
  this.$$elementChildren.push( "statusWanted" );
}

function WSRunStatusCursor(  ) 
{
  this.$$nsPrefix = "ns3";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "WSRunStatusCursor";
  this.$$xmlNames[ "WSRunStatusCursor" ] = "WSRunStatusCursor";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.cursorPosition = new xsd_int();
  }
  this.$$childElementFunctions[ "cursorPosition" ] = xsd_int;
  this.$$elementChildren.push( "cursorPosition" );
}

function WSRunHandle(  ) 
{
  this.$$nsPrefix = "ns3";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "WSRunHandle";
  this.$$xmlNames[ "WSRunHandle" ] = "WSRunHandle";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.runID = new xsd_string();
  }
  this.$$childElementFunctions[ "runID" ] = xsd_string;
  this.$$elementChildren.push( "runID" );
  if ( this.$$deserializing == undefined )
  {
  this.statusCursor = new WSRunHandle_WSRunStatusCursor();
  }
  this.$$childElementFunctions[ "statusCursor" ] = WSRunHandle_WSRunStatusCursor;
  this.$$elementChildren.push( "statusCursor" );
}

function WSRunHandle_WSRunStatusCursor(  ) 
{
  this.$$nsPrefix = "ns3";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "WSRunHandle_WSRunStatusCursor";
  this.$$xmlNames[ "WSRunHandle_WSRunStatusCursor" ] = "statusCursor";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.cursorPosition = new xsd_int();
  }
  this.$$childElementFunctions[ "cursorPosition" ] = xsd_int;
  this.$$elementChildren.push( "cursorPosition" );
}

function WSRunStepDetails(  ) 
{
  this.$$nsPrefix = "ns3";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "WSRunStepDetails";
  this.$$xmlNames[ "WSRunStepDetails" ] = "WSRunStepDetails";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.childRuns = new ArrayOf_tns1_WSRunHandle();
  }
  this.$$childElementFunctions[ "childRuns" ] = ArrayOf_tns1_WSRunHandle;
  this.$$elementChildren.push( "childRuns" );
  if ( this.$$deserializing == undefined )
  {
  this.endTime = new xsd_long();
  }
  this.$$childElementFunctions[ "endTime" ] = xsd_long;
  this.$$elementChildren.push( "endTime" );
  if ( this.$$deserializing == undefined )
  {
  this.flowName = new xsd_string();
  }
  this.$$childElementFunctions[ "flowName" ] = xsd_string;
  this.$$elementChildren.push( "flowName" );
  if ( this.$$deserializing == undefined )
  {
  this.name = new xsd_string();
  }
  this.$$childElementFunctions[ "name" ] = xsd_string;
  this.$$elementChildren.push( "name" );
  if ( this.$$deserializing == undefined )
  {
  this.runStepLevel = new xsd_int();
  }
  this.$$childElementFunctions[ "runStepLevel" ] = xsd_int;
  this.$$elementChildren.push( "runStepLevel" );
  if ( this.$$deserializing == undefined )
  {
  this.startTime = new xsd_long();
  }
  this.$$childElementFunctions[ "startTime" ] = xsd_long;
  this.$$elementChildren.push( "startTime" );
  if ( this.$$deserializing == undefined )
  {
  this.stepResponse = new xsd_string();
  }
  this.$$childElementFunctions[ "stepResponse" ] = xsd_string;
  this.$$elementChildren.push( "stepResponse" );
}

function WSRunStatus(  ) 
{
  this.$$nsPrefix = "ns3";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "WSRunStatus";
  this.$$xmlNames[ "WSRunStatus" ] = "WSRunStatus";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.runHandle = new WSRunStatus_WSRunHandle();
  }
  this.$$childElementFunctions[ "runHandle" ] = WSRunStatus_WSRunHandle;
  this.$$elementChildren.push( "runHandle" );
  if ( this.$$deserializing == undefined )
  {
  this.runReportUrl = new xsd_string();
  }
  this.$$childElementFunctions[ "runReportUrl" ] = xsd_string;
  this.$$elementChildren.push( "runReportUrl" );
  if ( this.$$deserializing == undefined )
  {
  this.runResponse = new xsd_string();
  }
  this.$$childElementFunctions[ "runResponse" ] = xsd_string;
  this.$$elementChildren.push( "runResponse" );
  if ( this.$$deserializing == undefined )
  {
  this.runResumeUrl = new xsd_string();
  }
  this.$$childElementFunctions[ "runResumeUrl" ] = xsd_string;
  this.$$elementChildren.push( "runResumeUrl" );
  if ( this.$$deserializing == undefined )
  {
  this.status = new xsd_int();
  }
  this.$$childElementFunctions[ "status" ] = xsd_int;
  this.$$elementChildren.push( "status" );
  if ( this.$$deserializing == undefined )
  {
  this.steps = new ArrayOf_tns1_WSRunStepDetails();
  }
  this.$$childElementFunctions[ "steps" ] = ArrayOf_tns1_WSRunStepDetails;
  this.$$elementChildren.push( "steps" );
}

function WSRunStatus_WSRunHandle(  ) 
{
  this.$$nsPrefix = "ns3";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "WSRunStatus_WSRunHandle";
  this.$$xmlNames[ "WSRunStatus_WSRunHandle" ] = "runHandle";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.runID = new xsd_string();
  }
  this.$$childElementFunctions[ "runID" ] = xsd_string;
  this.$$elementChildren.push( "runID" );
  if ( this.$$deserializing == undefined )
  {
  this.statusCursor = new WSRunHandle_WSRunStatusCursor();
  }
  this.$$childElementFunctions[ "statusCursor" ] = WSRunHandle_WSRunStatusCursor;
  this.$$elementChildren.push( "statusCursor" );
}

function WSStatusOptionsEx(  ) 
{
  this.$$nsPrefix = "ns3";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "WSStatusOptionsEx";
  this.$$xmlNames[ "WSStatusOptionsEx" ] = "WSStatusOptionsEx";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.primaryResultWanted = new xsd_boolean();
  }
  this.$$childElementFunctions[ "primaryResultWanted" ] = xsd_boolean;
  this.$$elementChildren.push( "primaryResultWanted" );
  if ( this.$$deserializing == undefined )
  {
  this.rawResultWanted = new xsd_boolean();
  }
  this.$$childElementFunctions[ "rawResultWanted" ] = xsd_boolean;
  this.$$elementChildren.push( "rawResultWanted" );
}

function WSRunStatusEx(  ) 
{
  this.$$nsPrefix = "ns3";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "WSRunStatusEx";
  this.$$xmlNames[ "WSRunStatusEx" ] = "WSRunStatusEx";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.runHandle = new WSRunStatus_WSRunHandle();
  }
  this.$$childElementFunctions[ "runHandle" ] = WSRunStatus_WSRunHandle;
  this.$$elementChildren.push( "runHandle" );
  if ( this.$$deserializing == undefined )
  {
  this.runReportUrl = new xsd_string();
  }
  this.$$childElementFunctions[ "runReportUrl" ] = xsd_string;
  this.$$elementChildren.push( "runReportUrl" );
  if ( this.$$deserializing == undefined )
  {
  this.runResponse = new xsd_string();
  }
  this.$$childElementFunctions[ "runResponse" ] = xsd_string;
  this.$$elementChildren.push( "runResponse" );
  if ( this.$$deserializing == undefined )
  {
  this.runResumeUrl = new xsd_string();
  }
  this.$$childElementFunctions[ "runResumeUrl" ] = xsd_string;
  this.$$elementChildren.push( "runResumeUrl" );
  if ( this.$$deserializing == undefined )
  {
  this.status = new xsd_int();
  }
  this.$$childElementFunctions[ "status" ] = xsd_int;
  this.$$elementChildren.push( "status" );
  if ( this.$$deserializing == undefined )
  {
  this.steps = new ArrayOf_tns1_WSRunStepDetails();
  }
  this.$$childElementFunctions[ "steps" ] = ArrayOf_tns1_WSRunStepDetails;
  this.$$elementChildren.push( "steps" );
  if ( this.$$deserializing == undefined )
  {
  this.primaryResult = new xsd_string();
  }
  this.$$childElementFunctions[ "primaryResult" ] = xsd_string;
  this.$$elementChildren.push( "primaryResult" );
  if ( this.$$deserializing == undefined )
  {
  this.rawResult = new xsd_string();
  }
  this.$$childElementFunctions[ "rawResult" ] = xsd_string;
  this.$$elementChildren.push( "rawResult" );
  if ( this.$$deserializing == undefined )
  {
  this.statusOptions = new WSRunStatusEx_WSStatusOptionsEx();
  }
  this.$$childElementFunctions[ "statusOptions" ] = WSRunStatusEx_WSStatusOptionsEx;
  this.$$elementChildren.push( "statusOptions" );
}

function WSRunStatusEx_WSStatusOptionsEx(  ) 
{
  this.$$nsPrefix = "ns3";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "WSRunStatusEx_WSStatusOptionsEx";
  this.$$xmlNames[ "WSRunStatusEx_WSStatusOptionsEx" ] = "statusOptions";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.primaryResultWanted = new xsd_boolean();
  }
  this.$$childElementFunctions[ "primaryResultWanted" ] = xsd_boolean;
  this.$$elementChildren.push( "primaryResultWanted" );
  if ( this.$$deserializing == undefined )
  {
  this.rawResultWanted = new xsd_boolean();
  }
  this.$$childElementFunctions[ "rawResultWanted" ] = xsd_boolean;
  this.$$elementChildren.push( "rawResultWanted" );
}

function WSRunHandleEx(  ) 
{
  this.$$nsPrefix = "ns3";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "WSRunHandleEx";
  this.$$xmlNames[ "WSRunHandleEx" ] = "WSRunHandleEx";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.runID = new xsd_string();
  }
  this.$$childElementFunctions[ "runID" ] = xsd_string;
  this.$$elementChildren.push( "runID" );
  if ( this.$$deserializing == undefined )
  {
  this.statusCursor = new WSRunHandle_WSRunStatusCursor();
  }
  this.$$childElementFunctions[ "statusCursor" ] = WSRunHandle_WSRunStatusCursor;
  this.$$elementChildren.push( "statusCursor" );
  if ( this.$$deserializing == undefined )
  {
  this.runStatusEx = new WSRunHandleEx_WSRunStatusEx();
  }
  this.$$childElementFunctions[ "runStatusEx" ] = WSRunHandleEx_WSRunStatusEx;
  this.$$elementChildren.push( "runStatusEx" );
  if ( this.$$deserializing == undefined )
  {
  this.statusOptions = new WSRunHandleEx_WSStatusOptionsEx();
  }
  this.$$childElementFunctions[ "statusOptions" ] = WSRunHandleEx_WSStatusOptionsEx;
  this.$$elementChildren.push( "statusOptions" );
}

function WSRunHandleEx_WSRunStatusEx(  ) 
{
  this.$$nsPrefix = "ns3";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "WSRunHandleEx_WSRunStatusEx";
  this.$$xmlNames[ "WSRunHandleEx_WSRunStatusEx" ] = "runStatusEx";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.runHandle = new WSRunStatus_WSRunHandle();
  }
  this.$$childElementFunctions[ "runHandle" ] = WSRunStatus_WSRunHandle;
  this.$$elementChildren.push( "runHandle" );
  if ( this.$$deserializing == undefined )
  {
  this.runReportUrl = new xsd_string();
  }
  this.$$childElementFunctions[ "runReportUrl" ] = xsd_string;
  this.$$elementChildren.push( "runReportUrl" );
  if ( this.$$deserializing == undefined )
  {
  this.runResponse = new xsd_string();
  }
  this.$$childElementFunctions[ "runResponse" ] = xsd_string;
  this.$$elementChildren.push( "runResponse" );
  if ( this.$$deserializing == undefined )
  {
  this.runResumeUrl = new xsd_string();
  }
  this.$$childElementFunctions[ "runResumeUrl" ] = xsd_string;
  this.$$elementChildren.push( "runResumeUrl" );
  if ( this.$$deserializing == undefined )
  {
  this.status = new xsd_int();
  }
  this.$$childElementFunctions[ "status" ] = xsd_int;
  this.$$elementChildren.push( "status" );
  if ( this.$$deserializing == undefined )
  {
  this.steps = new ArrayOf_tns1_WSRunStepDetails();
  }
  this.$$childElementFunctions[ "steps" ] = ArrayOf_tns1_WSRunStepDetails;
  this.$$elementChildren.push( "steps" );
  if ( this.$$deserializing == undefined )
  {
  this.primaryResult = new xsd_string();
  }
  this.$$childElementFunctions[ "primaryResult" ] = xsd_string;
  this.$$elementChildren.push( "primaryResult" );
  if ( this.$$deserializing == undefined )
  {
  this.rawResult = new xsd_string();
  }
  this.$$childElementFunctions[ "rawResult" ] = xsd_string;
  this.$$elementChildren.push( "rawResult" );
  if ( this.$$deserializing == undefined )
  {
  this.statusOptions = new WSRunStatusEx_WSStatusOptionsEx();
  }
  this.$$childElementFunctions[ "statusOptions" ] = WSRunStatusEx_WSStatusOptionsEx;
  this.$$elementChildren.push( "statusOptions" );
}

function WSRunHandleEx_WSStatusOptionsEx(  ) 
{
  this.$$nsPrefix = "ns3";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "WSRunHandleEx_WSStatusOptionsEx";
  this.$$xmlNames[ "WSRunHandleEx_WSStatusOptionsEx" ] = "statusOptions";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.primaryResultWanted = new xsd_boolean();
  }
  this.$$childElementFunctions[ "primaryResultWanted" ] = xsd_boolean;
  this.$$elementChildren.push( "primaryResultWanted" );
  if ( this.$$deserializing == undefined )
  {
  this.rawResultWanted = new xsd_boolean();
  }
  this.$$childElementFunctions[ "rawResultWanted" ] = xsd_boolean;
  this.$$elementChildren.push( "rawResultWanted" );
}

function WSRunCtrlParams(  ) 
{
  this.$$nsPrefix = "ns3";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "WSRunCtrlParams";
  this.$$xmlNames[ "WSRunCtrlParams" ] = "WSRunCtrlParams";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.runID = new xsd_string();
  }
  this.$$childElementFunctions[ "runID" ] = xsd_string;
  this.$$elementChildren.push( "runID" );
  if ( this.$$deserializing == undefined )
  {
  this.sync = new xsd_boolean();
  }
  this.$$childElementFunctions[ "sync" ] = xsd_boolean;
  this.$$elementChildren.push( "sync" );
}

function WSRunCtrlResult(  ) 
{
  this.$$nsPrefix = "ns3";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "WSRunCtrlResult";
  this.$$xmlNames[ "WSRunCtrlResult" ] = "WSRunCtrlResult";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.errorMsg = new xsd_string();
  }
  this.$$childElementFunctions[ "errorMsg" ] = xsd_string;
  this.$$elementChildren.push( "errorMsg" );
  if ( this.$$deserializing == undefined )
  {
  this.success = new xsd_boolean();
  }
  this.$$childElementFunctions[ "success" ] = xsd_boolean;
  this.$$elementChildren.push( "success" );
}

function ScheduledFlowInfo(  ) 
{
  this.$$nsPrefix = "ns3";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "ScheduledFlowInfo";
  this.$$xmlNames[ "ScheduledFlowInfo" ] = "ScheduledFlowInfo";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.description = new string();
  }
  this.$$childElementFunctions[ "description" ] = string;
  this.$$elementChildren.push( "description" );
  if ( this.$$deserializing == undefined )
  {
  this.enabled = new _boolean();
  }
  this.$$childElementFunctions[ "enabled" ] = _boolean;
  this.$$elementChildren.push( "enabled" );
  if ( this.$$deserializing == undefined )
  {
  this.executing = new _boolean();
  }
  this.$$childElementFunctions[ "executing" ] = _boolean;
  this.$$elementChildren.push( "executing" );
  if ( this.$$deserializing == undefined )
  {
  this.lastRunReportURL = new string();
  }
  this.$$childElementFunctions[ "lastRunReportURL" ] = string;
  this.$$elementChildren.push( "lastRunReportURL" );
  if ( this.$$deserializing == undefined )
  {
  this.lastRunReturnCode = new string();
  }
  this.$$childElementFunctions[ "lastRunReturnCode" ] = string;
  this.$$elementChildren.push( "lastRunReturnCode" );
  if ( this.$$deserializing == undefined )
  {
  this.lastRunSuccessful = new _boolean();
  }
  this.$$childElementFunctions[ "lastRunSuccessful" ] = _boolean;
  this.$$elementChildren.push( "lastRunSuccessful" );
  if ( this.$$deserializing == undefined )
  {
  this.name = new string();
  }
  this.$$childElementFunctions[ "name" ] = string;
  this.$$elementChildren.push( "name" );
  if ( this.$$deserializing == undefined )
  {
  this.nextRuntime = new xsd_dateTime();
  }
  this.$$childElementFunctions[ "nextRuntime" ] = xsd_dateTime;
  this.$$elementChildren.push( "nextRuntime" );
  if ( this.$$deserializing == undefined )
  {
  this.prevRuntime = new xsd_dateTime();
  }
  this.$$childElementFunctions[ "prevRuntime" ] = xsd_dateTime;
  this.$$elementChildren.push( "prevRuntime" );
  if ( this.$$deserializing == undefined )
  {
  this.flowName = new string();
  }
  this.$$childElementFunctions[ "flowName" ] = string;
  this.$$elementChildren.push( "flowName" );
  if ( this.$$deserializing == undefined )
  {
  this.nextTriggerNames = new xsd_string();
  }
  this.$$childElementFunctions[ "nextTriggerNames" ] = xsd_string;
  this.$$elementChildren.push( "nextTriggerNames" );
  if ( this.$$deserializing == undefined )
  {
  this.prevTriggerNames = new xsd_string();
  }
  this.$$childElementFunctions[ "prevTriggerNames" ] = xsd_string;
  this.$$elementChildren.push( "prevTriggerNames" );
  if ( this.$$deserializing == undefined )
  {
  this.paused = new _boolean();
  }
  this.$$childElementFunctions[ "paused" ] = _boolean;
  this.$$elementChildren.push( "paused" );
}

function xsd_dateTime( val ) 
{
  this.$$nsPrefix = "xsd";
  this.$$elementFormDefault = "unqualified";
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

function WSScheduleType(  ) 
{
  this.$$nsPrefix = "ns3";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "WSScheduleType";
  this.$$xmlNames[ "WSScheduleType" ] = "WSScheduleType";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.description = new xsd_string();
  }
  this.$$childElementFunctions[ "description" ] = xsd_string;
  this.$$elementChildren.push( "description" );
  if ( this.$$deserializing == undefined )
  {
  this.type = new xsd_int();
  }
  this.$$childElementFunctions[ "type" ] = xsd_int;
  this.$$elementChildren.push( "type" );
}

function WSScheduleUnitType(  ) 
{
  this.$$nsPrefix = "ns3";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "WSScheduleUnitType";
  this.$$xmlNames[ "WSScheduleUnitType" ] = "WSScheduleUnitType";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.description = new xsd_string();
  }
  this.$$childElementFunctions[ "description" ] = xsd_string;
  this.$$elementChildren.push( "description" );
  if ( this.$$deserializing == undefined )
  {
  this.unit = new xsd_int();
  }
  this.$$childElementFunctions[ "unit" ] = xsd_int;
  this.$$elementChildren.push( "unit" );
}

function WSScheduleDetails(  ) 
{
  this.$$nsPrefix = "ns3";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "WSScheduleDetails";
  this.$$xmlNames[ "WSScheduleDetails" ] = "WSScheduleDetails";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.cronExpression = new xsd_string();
  }
  this.$$childElementFunctions[ "cronExpression" ] = xsd_string;
  this.$$elementChildren.push( "cronExpression" );
  if ( this.$$deserializing == undefined )
  {
  this.description = new xsd_string();
  }
  this.$$childElementFunctions[ "description" ] = xsd_string;
  this.$$elementChildren.push( "description" );
  if ( this.$$deserializing == undefined )
  {
  this.enabled = new xsd_boolean();
  }
  this.$$childElementFunctions[ "enabled" ] = xsd_boolean;
  this.$$elementChildren.push( "enabled" );
  if ( this.$$deserializing == undefined )
  {
  this.endTime = new xsd_long();
  }
  this.$$childElementFunctions[ "endTime" ] = xsd_long;
  this.$$elementChildren.push( "endTime" );
  if ( this.$$deserializing == undefined )
  {
  this.executing = new xsd_boolean();
  }
  this.$$childElementFunctions[ "executing" ] = xsd_boolean;
  this.$$elementChildren.push( "executing" );
  if ( this.$$deserializing == undefined )
  {
  this.flowUuid = new xsd_string();
  }
  this.$$childElementFunctions[ "flowUuid" ] = xsd_string;
  this.$$elementChildren.push( "flowUuid" );
  if ( this.$$deserializing == undefined )
  {
  this.name = new xsd_string();
  }
  this.$$childElementFunctions[ "name" ] = xsd_string;
  this.$$elementChildren.push( "name" );
  if ( this.$$deserializing == undefined )
  {
  this.nextRuntime = new xsd_long();
  }
  this.$$childElementFunctions[ "nextRuntime" ] = xsd_long;
  this.$$elementChildren.push( "nextRuntime" );
  if ( this.$$deserializing == undefined )
  {
  this.params = new xsd_string();
  }
  this.$$childElementFunctions[ "params" ] = xsd_string;
  this.$$elementChildren.push( "params" );
  if ( this.$$deserializing == undefined )
  {
  this.prevRuntime = new xsd_long();
  }
  this.$$childElementFunctions[ "prevRuntime" ] = xsd_long;
  this.$$elementChildren.push( "prevRuntime" );
  if ( this.$$deserializing == undefined )
  {
  this.repeatIntervalMilli = new xsd_long();
  }
  this.$$childElementFunctions[ "repeatIntervalMilli" ] = xsd_long;
  this.$$elementChildren.push( "repeatIntervalMilli" );
  if ( this.$$deserializing == undefined )
  {
  this.startTime = new xsd_long();
  }
  this.$$childElementFunctions[ "startTime" ] = xsd_long;
  this.$$elementChildren.push( "startTime" );
  if ( this.$$deserializing == undefined )
  {
  this.type = new WSScheduleDetails_WSScheduleType();
  }
  this.$$childElementFunctions[ "type" ] = WSScheduleDetails_WSScheduleType;
  this.$$elementChildren.push( "type" );
  if ( this.$$deserializing == undefined )
  {
  this.unit = new WSScheduleDetails_WSScheduleUnitType();
  }
  this.$$childElementFunctions[ "unit" ] = WSScheduleDetails_WSScheduleUnitType;
  this.$$elementChildren.push( "unit" );
}

function WSScheduleDetails_WSScheduleType(  ) 
{
  this.$$nsPrefix = "ns3";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "WSScheduleDetails_WSScheduleType";
  this.$$xmlNames[ "WSScheduleDetails_WSScheduleType" ] = "type";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.description = new xsd_string();
  }
  this.$$childElementFunctions[ "description" ] = xsd_string;
  this.$$elementChildren.push( "description" );
  if ( this.$$deserializing == undefined )
  {
  this.type = new xsd_int();
  }
  this.$$childElementFunctions[ "type" ] = xsd_int;
  this.$$elementChildren.push( "type" );
}

function WSScheduleDetails_WSScheduleUnitType(  ) 
{
  this.$$nsPrefix = "ns3";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "WSScheduleDetails_WSScheduleUnitType";
  this.$$xmlNames[ "WSScheduleDetails_WSScheduleUnitType" ] = "unit";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.description = new xsd_string();
  }
  this.$$childElementFunctions[ "description" ] = xsd_string;
  this.$$elementChildren.push( "description" );
  if ( this.$$deserializing == undefined )
  {
  this.unit = new xsd_int();
  }
  this.$$childElementFunctions[ "unit" ] = xsd_int;
  this.$$elementChildren.push( "unit" );
}

function Pair(  ) 
{
  this.$$nsPrefix = "ns3";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "Pair";
  this.$$xmlNames[ "Pair" ] = "Pair";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.first = new string();
  }
  this.$$childElementFunctions[ "first" ] = string;
  this.$$elementChildren.push( "first" );
  if ( this.$$deserializing == undefined )
  {
  this.second = new string();
  }
  this.$$childElementFunctions[ "second" ] = string;
  this.$$elementChildren.push( "second" );
}

function ScheduleInfo(  ) 
{
  this.$$nsPrefix = "ns3";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "ScheduleInfo";
  this.$$xmlNames[ "ScheduleInfo" ] = "ScheduleInfo";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.description = new string();
  }
  this.$$childElementFunctions[ "description" ] = string;
  this.$$elementChildren.push( "description" );
  if ( this.$$deserializing == undefined )
  {
  this.enabled = new _boolean();
  }
  this.$$childElementFunctions[ "enabled" ] = _boolean;
  this.$$elementChildren.push( "enabled" );
  if ( this.$$deserializing == undefined )
  {
  this.endTime = new xsd_dateTime();
  }
  this.$$childElementFunctions[ "endTime" ] = xsd_dateTime;
  this.$$elementChildren.push( "endTime" );
  if ( this.$$deserializing == undefined )
  {
  this.name = new string();
  }
  this.$$childElementFunctions[ "name" ] = string;
  this.$$elementChildren.push( "name" );
  if ( this.$$deserializing == undefined )
  {
  this.params = new ArrayOf_tns1_Pair();
  }
  this.$$childElementFunctions[ "params" ] = ArrayOf_tns1_Pair;
  this.$$elementChildren.push( "params" );
  if ( this.$$deserializing == undefined )
  {
  this.repeatCount = new xsd_int();
  }
  this.$$childElementFunctions[ "repeatCount" ] = xsd_int;
  this.$$elementChildren.push( "repeatCount" );
  if ( this.$$deserializing == undefined )
  {
  this.repeatIntervalMilli = new xsd_long();
  }
  this.$$childElementFunctions[ "repeatIntervalMilli" ] = xsd_long;
  this.$$elementChildren.push( "repeatIntervalMilli" );
  if ( this.$$deserializing == undefined )
  {
  this.startTime = new xsd_dateTime();
  }
  this.$$childElementFunctions[ "startTime" ] = xsd_dateTime;
  this.$$elementChildren.push( "startTime" );
  if ( this.$$deserializing == undefined )
  {
  this.units = new string();
  }
  this.$$childElementFunctions[ "units" ] = string;
  this.$$elementChildren.push( "units" );
  if ( this.$$deserializing == undefined )
  {
  this.type = new xsd_int();
  }
  this.$$childElementFunctions[ "type" ] = xsd_int;
  this.$$elementChildren.push( "type" );
  if ( this.$$deserializing == undefined )
  {
  this.executing = new _boolean();
  }
  this.$$childElementFunctions[ "executing" ] = _boolean;
  this.$$elementChildren.push( "executing" );
  if ( this.$$deserializing == undefined )
  {
  this.nextRuntime = new xsd_dateTime();
  }
  this.$$childElementFunctions[ "nextRuntime" ] = xsd_dateTime;
  this.$$elementChildren.push( "nextRuntime" );
  if ( this.$$deserializing == undefined )
  {
  this.prevRuntime = new xsd_dateTime();
  }
  this.$$childElementFunctions[ "prevRuntime" ] = xsd_dateTime;
  this.$$elementChildren.push( "prevRuntime" );
  if ( this.$$deserializing == undefined )
  {
  this.cronExpression = new string();
  }
  this.$$childElementFunctions[ "cronExpression" ] = string;
  this.$$elementChildren.push( "cronExpression" );
  if ( this.$$deserializing == undefined )
  {
  this.dayNumber = new xsd_int();
  }
  this.$$childElementFunctions[ "dayNumber" ] = xsd_int;
  this.$$elementChildren.push( "dayNumber" );
  if ( this.$$deserializing == undefined )
  {
  this.monthNumber = new xsd_int();
  }
  this.$$childElementFunctions[ "monthNumber" ] = xsd_int;
  this.$$elementChildren.push( "monthNumber" );
  if ( this.$$deserializing == undefined )
  {
  this.dayType = new xsd_int();
  }
  this.$$childElementFunctions[ "dayType" ] = xsd_int;
  this.$$elementChildren.push( "dayType" );
  if ( this.$$deserializing == undefined )
  {
  this.dayOrder = new xsd_int();
  }
  this.$$childElementFunctions[ "dayOrder" ] = xsd_int;
  this.$$elementChildren.push( "dayOrder" );
  if ( this.$$deserializing == undefined )
  {
  this.triggerName = new xsd_string();
  }
  this.$$childElementFunctions[ "triggerName" ] = xsd_string;
  this.$$elementChildren.push( "triggerName" );
  if ( this.$$deserializing == undefined )
  {
  this.paused = new _boolean();
  }
  this.$$childElementFunctions[ "paused" ] = _boolean;
  this.$$elementChildren.push( "paused" );
}

function WSInputValueAssignment(  ) 
{
  this.$$nsPrefix = "ns3";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "WSInputValueAssignment";
  this.$$xmlNames[ "WSInputValueAssignment" ] = "WSInputValueAssignment";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.assignFromConstantValue = new xsd_boolean();
  }
  this.$$childElementFunctions[ "assignFromConstantValue" ] = xsd_boolean;
  this.$$elementChildren.push( "assignFromConstantValue" );
  if ( this.$$deserializing == undefined )
  {
  this.assignFromDomainTerm = new xsd_boolean();
  }
  this.$$childElementFunctions[ "assignFromDomainTerm" ] = xsd_boolean;
  this.$$elementChildren.push( "assignFromDomainTerm" );
  if ( this.$$deserializing == undefined )
  {
  this.assignFromFlowVariableList = new xsd_boolean();
  }
  this.$$childElementFunctions[ "assignFromFlowVariableList" ] = xsd_boolean;
  this.$$elementChildren.push( "assignFromFlowVariableList" );
  if ( this.$$deserializing == undefined )
  {
  this.assignFromLoginCredentials = new xsd_boolean();
  }
  this.$$childElementFunctions[ "assignFromLoginCredentials" ] = xsd_boolean;
  this.$$elementChildren.push( "assignFromLoginCredentials" );
  if ( this.$$deserializing == undefined )
  {
  this.assignFromPreviousStepResult = new xsd_boolean();
  }
  this.$$childElementFunctions[ "assignFromPreviousStepResult" ] = xsd_boolean;
  this.$$elementChildren.push( "assignFromPreviousStepResult" );
  if ( this.$$deserializing == undefined )
  {
  this.assignFromSelectionList = new xsd_boolean();
  }
  this.$$childElementFunctions[ "assignFromSelectionList" ] = xsd_boolean;
  this.$$elementChildren.push( "assignFromSelectionList" );
  if ( this.$$deserializing == undefined )
  {
  this.assignFromSystemAccount = new xsd_boolean();
  }
  this.$$childElementFunctions[ "assignFromSystemAccount" ] = xsd_boolean;
  this.$$elementChildren.push( "assignFromSystemAccount" );
  if ( this.$$deserializing == undefined )
  {
  this.assignFromUserInput = new xsd_boolean();
  }
  this.$$childElementFunctions[ "assignFromUserInput" ] = xsd_boolean;
  this.$$elementChildren.push( "assignFromUserInput" );
  if ( this.$$deserializing == undefined )
  {
  this.constantValue = new xsd_string();
  }
  this.$$childElementFunctions[ "constantValue" ] = xsd_string;
  this.$$elementChildren.push( "constantValue" );
  if ( this.$$deserializing == undefined )
  {
  this.domainTermDescription = new xsd_string();
  }
  this.$$childElementFunctions[ "domainTermDescription" ] = xsd_string;
  this.$$elementChildren.push( "domainTermDescription" );
  if ( this.$$deserializing == undefined )
  {
  this.domainTermName = new xsd_string();
  }
  this.$$childElementFunctions[ "domainTermName" ] = xsd_string;
  this.$$elementChildren.push( "domainTermName" );
  if ( this.$$deserializing == undefined )
  {
  this.domainTermValues = new xsd_string();
  }
  this.$$childElementFunctions[ "domainTermValues" ] = xsd_string;
  this.$$elementChildren.push( "domainTermValues" );
  if ( this.$$deserializing == undefined )
  {
  this.flowVariableListDelimiter = new xsd_string();
  }
  this.$$childElementFunctions[ "flowVariableListDelimiter" ] = xsd_string;
  this.$$elementChildren.push( "flowVariableListDelimiter" );
  if ( this.$$deserializing == undefined )
  {
  this.flowVariableListName = new xsd_string();
  }
  this.$$childElementFunctions[ "flowVariableListName" ] = xsd_string;
  this.$$elementChildren.push( "flowVariableListName" );
  if ( this.$$deserializing == undefined )
  {
  this.multipleSelectionAllowed = new xsd_boolean();
  }
  this.$$childElementFunctions[ "multipleSelectionAllowed" ] = xsd_boolean;
  this.$$elementChildren.push( "multipleSelectionAllowed" );
  if ( this.$$deserializing == undefined )
  {
  this.postAssignFlowVariableName = new xsd_string();
  }
  this.$$childElementFunctions[ "postAssignFlowVariableName" ] = xsd_string;
  this.$$elementChildren.push( "postAssignFlowVariableName" );
  if ( this.$$deserializing == undefined )
  {
  this.postAssignToFlowVariable = new xsd_boolean();
  }
  this.$$childElementFunctions[ "postAssignToFlowVariable" ] = xsd_boolean;
  this.$$elementChildren.push( "postAssignToFlowVariable" );
  if ( this.$$deserializing == undefined )
  {
  this.preAssignFlowVariableName = new xsd_string();
  }
  this.$$childElementFunctions[ "preAssignFlowVariableName" ] = xsd_string;
  this.$$elementChildren.push( "preAssignFlowVariableName" );
  if ( this.$$deserializing == undefined )
  {
  this.preAssignFromFlowVariable = new xsd_boolean();
  }
  this.$$childElementFunctions[ "preAssignFromFlowVariable" ] = xsd_boolean;
  this.$$elementChildren.push( "preAssignFromFlowVariable" );
  if ( this.$$deserializing == undefined )
  {
  this.selectionListDescription = new xsd_string();
  }
  this.$$childElementFunctions[ "selectionListDescription" ] = xsd_string;
  this.$$elementChildren.push( "selectionListDescription" );
  if ( this.$$deserializing == undefined )
  {
  this.selectionListName = new xsd_string();
  }
  this.$$childElementFunctions[ "selectionListName" ] = xsd_string;
  this.$$elementChildren.push( "selectionListName" );
  if ( this.$$deserializing == undefined )
  {
  this.selectionListValues = new xsd_string();
  }
  this.$$childElementFunctions[ "selectionListValues" ] = xsd_string;
  this.$$elementChildren.push( "selectionListValues" );
  if ( this.$$deserializing == undefined )
  {
  this.systemAccountName = new xsd_string();
  }
  this.$$childElementFunctions[ "systemAccountName" ] = xsd_string;
  this.$$elementChildren.push( "systemAccountName" );
  if ( this.$$deserializing == undefined )
  {
  this.userInputPrompt = new xsd_string();
  }
  this.$$childElementFunctions[ "userInputPrompt" ] = xsd_string;
  this.$$elementChildren.push( "userInputPrompt" );
}

function WSInputValueReporting(  ) 
{
  this.$$nsPrefix = "ns3";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "WSInputValueReporting";
  this.$$xmlNames[ "WSInputValueReporting" ] = "WSInputValueReporting";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.domainTermName = new xsd_string();
  }
  this.$$childElementFunctions[ "domainTermName" ] = xsd_string;
  this.$$elementChildren.push( "domainTermName" );
  if ( this.$$deserializing == undefined )
  {
  this.recordAsDomainTerm = new xsd_boolean();
  }
  this.$$childElementFunctions[ "recordAsDomainTerm" ] = xsd_boolean;
  this.$$elementChildren.push( "recordAsDomainTerm" );
  if ( this.$$deserializing == undefined )
  {
  this.recordInHistory = new xsd_boolean();
  }
  this.$$childElementFunctions[ "recordInHistory" ] = xsd_boolean;
  this.$$elementChildren.push( "recordInHistory" );
}

function WSInputValueType(  ) 
{
  this.$$nsPrefix = "ns3";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "WSInputValueType";
  this.$$xmlNames[ "WSInputValueType" ] = "WSInputValueType";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.listDelimiter = new xsd_string();
  }
  this.$$childElementFunctions[ "listDelimiter" ] = xsd_string;
  this.$$elementChildren.push( "listDelimiter" );
  if ( this.$$deserializing == undefined )
  {
  this.typeId = new xsd_int();
  }
  this.$$childElementFunctions[ "typeId" ] = xsd_int;
  this.$$elementChildren.push( "typeId" );
}

function WSInputValueEvaluation(  ) 
{
  this.$$nsPrefix = "ns3";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "WSInputValueEvaluation";
  this.$$xmlNames[ "WSInputValueEvaluation" ] = "WSInputValueEvaluation";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.evaluatorDescription = new xsd_string();
  }
  this.$$childElementFunctions[ "evaluatorDescription" ] = xsd_string;
  this.$$elementChildren.push( "evaluatorDescription" );
  if ( this.$$deserializing == undefined )
  {
  this.evaluatorName = new xsd_string();
  }
  this.$$childElementFunctions[ "evaluatorName" ] = xsd_string;
  this.$$elementChildren.push( "evaluatorName" );
  if ( this.$$deserializing == undefined )
  {
  this.evaluatorText = new xsd_string();
  }
  this.$$childElementFunctions[ "evaluatorText" ] = xsd_string;
  this.$$elementChildren.push( "evaluatorText" );
  if ( this.$$deserializing == undefined )
  {
  this.evaluatorType = new xsd_int();
  }
  this.$$childElementFunctions[ "evaluatorType" ] = xsd_int;
  this.$$elementChildren.push( "evaluatorType" );
  if ( this.$$deserializing == undefined )
  {
  this.ignoreCase = new xsd_boolean();
  }
  this.$$childElementFunctions[ "ignoreCase" ] = xsd_boolean;
  this.$$elementChildren.push( "ignoreCase" );
  if ( this.$$deserializing == undefined )
  {
  this.regexMatchWholeInput = new xsd_boolean();
  }
  this.$$childElementFunctions[ "regexMatchWholeInput" ] = xsd_boolean;
  this.$$elementChildren.push( "regexMatchWholeInput" );
  if ( this.$$deserializing == undefined )
  {
  this.regexMultiLine = new xsd_boolean();
  }
  this.$$childElementFunctions[ "regexMultiLine" ] = xsd_boolean;
  this.$$elementChildren.push( "regexMultiLine" );
}

function WSInputDescriptor(  ) 
{
  this.$$nsPrefix = "ns3";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "WSInputDescriptor";
  this.$$xmlNames[ "WSInputDescriptor" ] = "WSInputDescriptor";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.encrypted = new xsd_boolean();
  }
  this.$$childElementFunctions[ "encrypted" ] = xsd_boolean;
  this.$$elementChildren.push( "encrypted" );
  if ( this.$$deserializing == undefined )
  {
  this.error = new xsd_boolean();
  }
  this.$$childElementFunctions[ "error" ] = xsd_boolean;
  this.$$elementChildren.push( "error" );
  if ( this.$$deserializing == undefined )
  {
  this.errorMessage = new xsd_string();
  }
  this.$$childElementFunctions[ "errorMessage" ] = xsd_string;
  this.$$elementChildren.push( "errorMessage" );
  if ( this.$$deserializing == undefined )
  {
  this.inputName = new xsd_string();
  }
  this.$$childElementFunctions[ "inputName" ] = xsd_string;
  this.$$elementChildren.push( "inputName" );
  if ( this.$$deserializing == undefined )
  {
  this.operationUuid = new xsd_string();
  }
  this.$$childElementFunctions[ "operationUuid" ] = xsd_string;
  this.$$elementChildren.push( "operationUuid" );
  if ( this.$$deserializing == undefined )
  {
  this.required = new xsd_boolean();
  }
  this.$$childElementFunctions[ "required" ] = xsd_boolean;
  this.$$elementChildren.push( "required" );
  if ( this.$$deserializing == undefined )
  {
  this.valueAssignmentPolicy = new WSInputDescriptor_WSInputValueAssignment();
  }
  this.$$childElementFunctions[ "valueAssignmentPolicy" ] = WSInputDescriptor_WSInputValueAssignment;
  this.$$elementChildren.push( "valueAssignmentPolicy" );
  if ( this.$$deserializing == undefined )
  {
  this.valueReportingPolicy = new WSInputDescriptor_WSInputValueReporting();
  }
  this.$$childElementFunctions[ "valueReportingPolicy" ] = WSInputDescriptor_WSInputValueReporting;
  this.$$elementChildren.push( "valueReportingPolicy" );
  if ( this.$$deserializing == undefined )
  {
  this.valueType = new WSInputDescriptor_WSInputValueType();
  }
  this.$$childElementFunctions[ "valueType" ] = WSInputDescriptor_WSInputValueType;
  this.$$elementChildren.push( "valueType" );
  if ( this.$$deserializing == undefined )
  {
  this.valueValidationPolicy = new WSInputDescriptor_WSInputValueEvaluation();
  }
  this.$$childElementFunctions[ "valueValidationPolicy" ] = WSInputDescriptor_WSInputValueEvaluation;
  this.$$elementChildren.push( "valueValidationPolicy" );
}

function WSInputDescriptor_WSInputValueAssignment(  ) 
{
  this.$$nsPrefix = "ns3";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "WSInputDescriptor_WSInputValueAssignment";
  this.$$xmlNames[ "WSInputDescriptor_WSInputValueAssignment" ] = "valueAssignmentPolicy";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.assignFromConstantValue = new xsd_boolean();
  }
  this.$$childElementFunctions[ "assignFromConstantValue" ] = xsd_boolean;
  this.$$elementChildren.push( "assignFromConstantValue" );
  if ( this.$$deserializing == undefined )
  {
  this.assignFromDomainTerm = new xsd_boolean();
  }
  this.$$childElementFunctions[ "assignFromDomainTerm" ] = xsd_boolean;
  this.$$elementChildren.push( "assignFromDomainTerm" );
  if ( this.$$deserializing == undefined )
  {
  this.assignFromFlowVariableList = new xsd_boolean();
  }
  this.$$childElementFunctions[ "assignFromFlowVariableList" ] = xsd_boolean;
  this.$$elementChildren.push( "assignFromFlowVariableList" );
  if ( this.$$deserializing == undefined )
  {
  this.assignFromLoginCredentials = new xsd_boolean();
  }
  this.$$childElementFunctions[ "assignFromLoginCredentials" ] = xsd_boolean;
  this.$$elementChildren.push( "assignFromLoginCredentials" );
  if ( this.$$deserializing == undefined )
  {
  this.assignFromPreviousStepResult = new xsd_boolean();
  }
  this.$$childElementFunctions[ "assignFromPreviousStepResult" ] = xsd_boolean;
  this.$$elementChildren.push( "assignFromPreviousStepResult" );
  if ( this.$$deserializing == undefined )
  {
  this.assignFromSelectionList = new xsd_boolean();
  }
  this.$$childElementFunctions[ "assignFromSelectionList" ] = xsd_boolean;
  this.$$elementChildren.push( "assignFromSelectionList" );
  if ( this.$$deserializing == undefined )
  {
  this.assignFromSystemAccount = new xsd_boolean();
  }
  this.$$childElementFunctions[ "assignFromSystemAccount" ] = xsd_boolean;
  this.$$elementChildren.push( "assignFromSystemAccount" );
  if ( this.$$deserializing == undefined )
  {
  this.assignFromUserInput = new xsd_boolean();
  }
  this.$$childElementFunctions[ "assignFromUserInput" ] = xsd_boolean;
  this.$$elementChildren.push( "assignFromUserInput" );
  if ( this.$$deserializing == undefined )
  {
  this.constantValue = new xsd_string();
  }
  this.$$childElementFunctions[ "constantValue" ] = xsd_string;
  this.$$elementChildren.push( "constantValue" );
  if ( this.$$deserializing == undefined )
  {
  this.domainTermDescription = new xsd_string();
  }
  this.$$childElementFunctions[ "domainTermDescription" ] = xsd_string;
  this.$$elementChildren.push( "domainTermDescription" );
  if ( this.$$deserializing == undefined )
  {
  this.domainTermName = new xsd_string();
  }
  this.$$childElementFunctions[ "domainTermName" ] = xsd_string;
  this.$$elementChildren.push( "domainTermName" );
  if ( this.$$deserializing == undefined )
  {
  this.domainTermValues = new xsd_string();
  }
  this.$$childElementFunctions[ "domainTermValues" ] = xsd_string;
  this.$$elementChildren.push( "domainTermValues" );
  if ( this.$$deserializing == undefined )
  {
  this.flowVariableListDelimiter = new xsd_string();
  }
  this.$$childElementFunctions[ "flowVariableListDelimiter" ] = xsd_string;
  this.$$elementChildren.push( "flowVariableListDelimiter" );
  if ( this.$$deserializing == undefined )
  {
  this.flowVariableListName = new xsd_string();
  }
  this.$$childElementFunctions[ "flowVariableListName" ] = xsd_string;
  this.$$elementChildren.push( "flowVariableListName" );
  if ( this.$$deserializing == undefined )
  {
  this.multipleSelectionAllowed = new xsd_boolean();
  }
  this.$$childElementFunctions[ "multipleSelectionAllowed" ] = xsd_boolean;
  this.$$elementChildren.push( "multipleSelectionAllowed" );
  if ( this.$$deserializing == undefined )
  {
  this.postAssignFlowVariableName = new xsd_string();
  }
  this.$$childElementFunctions[ "postAssignFlowVariableName" ] = xsd_string;
  this.$$elementChildren.push( "postAssignFlowVariableName" );
  if ( this.$$deserializing == undefined )
  {
  this.postAssignToFlowVariable = new xsd_boolean();
  }
  this.$$childElementFunctions[ "postAssignToFlowVariable" ] = xsd_boolean;
  this.$$elementChildren.push( "postAssignToFlowVariable" );
  if ( this.$$deserializing == undefined )
  {
  this.preAssignFlowVariableName = new xsd_string();
  }
  this.$$childElementFunctions[ "preAssignFlowVariableName" ] = xsd_string;
  this.$$elementChildren.push( "preAssignFlowVariableName" );
  if ( this.$$deserializing == undefined )
  {
  this.preAssignFromFlowVariable = new xsd_boolean();
  }
  this.$$childElementFunctions[ "preAssignFromFlowVariable" ] = xsd_boolean;
  this.$$elementChildren.push( "preAssignFromFlowVariable" );
  if ( this.$$deserializing == undefined )
  {
  this.selectionListDescription = new xsd_string();
  }
  this.$$childElementFunctions[ "selectionListDescription" ] = xsd_string;
  this.$$elementChildren.push( "selectionListDescription" );
  if ( this.$$deserializing == undefined )
  {
  this.selectionListName = new xsd_string();
  }
  this.$$childElementFunctions[ "selectionListName" ] = xsd_string;
  this.$$elementChildren.push( "selectionListName" );
  if ( this.$$deserializing == undefined )
  {
  this.selectionListValues = new xsd_string();
  }
  this.$$childElementFunctions[ "selectionListValues" ] = xsd_string;
  this.$$elementChildren.push( "selectionListValues" );
  if ( this.$$deserializing == undefined )
  {
  this.systemAccountName = new xsd_string();
  }
  this.$$childElementFunctions[ "systemAccountName" ] = xsd_string;
  this.$$elementChildren.push( "systemAccountName" );
  if ( this.$$deserializing == undefined )
  {
  this.userInputPrompt = new xsd_string();
  }
  this.$$childElementFunctions[ "userInputPrompt" ] = xsd_string;
  this.$$elementChildren.push( "userInputPrompt" );
}

function WSInputDescriptor_WSInputValueReporting(  ) 
{
  this.$$nsPrefix = "ns3";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "WSInputDescriptor_WSInputValueReporting";
  this.$$xmlNames[ "WSInputDescriptor_WSInputValueReporting" ] = "valueReportingPolicy";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.domainTermName = new xsd_string();
  }
  this.$$childElementFunctions[ "domainTermName" ] = xsd_string;
  this.$$elementChildren.push( "domainTermName" );
  if ( this.$$deserializing == undefined )
  {
  this.recordAsDomainTerm = new xsd_boolean();
  }
  this.$$childElementFunctions[ "recordAsDomainTerm" ] = xsd_boolean;
  this.$$elementChildren.push( "recordAsDomainTerm" );
  if ( this.$$deserializing == undefined )
  {
  this.recordInHistory = new xsd_boolean();
  }
  this.$$childElementFunctions[ "recordInHistory" ] = xsd_boolean;
  this.$$elementChildren.push( "recordInHistory" );
}

function WSInputDescriptor_WSInputValueType(  ) 
{
  this.$$nsPrefix = "ns3";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "WSInputDescriptor_WSInputValueType";
  this.$$xmlNames[ "WSInputDescriptor_WSInputValueType" ] = "valueType";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.listDelimiter = new xsd_string();
  }
  this.$$childElementFunctions[ "listDelimiter" ] = xsd_string;
  this.$$elementChildren.push( "listDelimiter" );
  if ( this.$$deserializing == undefined )
  {
  this.typeId = new xsd_int();
  }
  this.$$childElementFunctions[ "typeId" ] = xsd_int;
  this.$$elementChildren.push( "typeId" );
}

function WSInputDescriptor_WSInputValueEvaluation(  ) 
{
  this.$$nsPrefix = "ns3";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "WSInputDescriptor_WSInputValueEvaluation";
  this.$$xmlNames[ "WSInputDescriptor_WSInputValueEvaluation" ] = "valueValidationPolicy";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.evaluatorDescription = new xsd_string();
  }
  this.$$childElementFunctions[ "evaluatorDescription" ] = xsd_string;
  this.$$elementChildren.push( "evaluatorDescription" );
  if ( this.$$deserializing == undefined )
  {
  this.evaluatorName = new xsd_string();
  }
  this.$$childElementFunctions[ "evaluatorName" ] = xsd_string;
  this.$$elementChildren.push( "evaluatorName" );
  if ( this.$$deserializing == undefined )
  {
  this.evaluatorText = new xsd_string();
  }
  this.$$childElementFunctions[ "evaluatorText" ] = xsd_string;
  this.$$elementChildren.push( "evaluatorText" );
  if ( this.$$deserializing == undefined )
  {
  this.evaluatorType = new xsd_int();
  }
  this.$$childElementFunctions[ "evaluatorType" ] = xsd_int;
  this.$$elementChildren.push( "evaluatorType" );
  if ( this.$$deserializing == undefined )
  {
  this.ignoreCase = new xsd_boolean();
  }
  this.$$childElementFunctions[ "ignoreCase" ] = xsd_boolean;
  this.$$elementChildren.push( "ignoreCase" );
  if ( this.$$deserializing == undefined )
  {
  this.regexMatchWholeInput = new xsd_boolean();
  }
  this.$$childElementFunctions[ "regexMatchWholeInput" ] = xsd_boolean;
  this.$$elementChildren.push( "regexMatchWholeInput" );
  if ( this.$$deserializing == undefined )
  {
  this.regexMultiLine = new xsd_boolean();
  }
  this.$$childElementFunctions[ "regexMultiLine" ] = xsd_boolean;
  this.$$elementChildren.push( "regexMultiLine" );
}

function WSRunHistoryQueryParams(  ) 
{
  this.$$nsPrefix = "ns3";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "WSRunHistoryQueryParams";
  this.$$xmlNames[ "WSRunHistoryQueryParams" ] = "WSRunHistoryQueryParams";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.endTime = new xsd_long();
  }
  this.$$childElementFunctions[ "endTime" ] = xsd_long;
  this.$$elementChildren.push( "endTime" );
  if ( this.$$deserializing == undefined )
  {
  this.flowUuid = new xsd_string();
  }
  this.$$childElementFunctions[ "flowUuid" ] = xsd_string;
  this.$$elementChildren.push( "flowUuid" );
  if ( this.$$deserializing == undefined )
  {
  this.startAtRowIndex = new xsd_int();
  }
  this.$$childElementFunctions[ "startAtRowIndex" ] = xsd_int;
  this.$$elementChildren.push( "startAtRowIndex" );
  if ( this.$$deserializing == undefined )
  {
  this.startTime = new xsd_long();
  }
  this.$$childElementFunctions[ "startTime" ] = xsd_long;
  this.$$elementChildren.push( "startTime" );
}

function WSRunHistoryDetails(  ) 
{
  this.$$nsPrefix = "ns3";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "WSRunHistoryDetails";
  this.$$xmlNames[ "WSRunHistoryDetails" ] = "WSRunHistoryDetails";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.duration = new xsd_long();
  }
  this.$$childElementFunctions[ "duration" ] = xsd_long;
  this.$$elementChildren.push( "duration" );
  if ( this.$$deserializing == undefined )
  {
  this.flowRevision = new xsd_string();
  }
  this.$$childElementFunctions[ "flowRevision" ] = xsd_string;
  this.$$elementChildren.push( "flowRevision" );
  if ( this.$$deserializing == undefined )
  {
  this.numSteps = new xsd_int();
  }
  this.$$childElementFunctions[ "numSteps" ] = xsd_int;
  this.$$elementChildren.push( "numSteps" );
  if ( this.$$deserializing == undefined )
  {
  this.runId = new xsd_long();
  }
  this.$$childElementFunctions[ "runId" ] = xsd_long;
  this.$$elementChildren.push( "runId" );
  if ( this.$$deserializing == undefined )
  {
  this.startTime = new xsd_long();
  }
  this.$$childElementFunctions[ "startTime" ] = xsd_long;
  this.$$elementChildren.push( "startTime" );
  if ( this.$$deserializing == undefined )
  {
  this.status = new xsd_string();
  }
  this.$$childElementFunctions[ "status" ] = xsd_string;
  this.$$elementChildren.push( "status" );
  if ( this.$$deserializing == undefined )
  {
  this.userId = new xsd_string();
  }
  this.$$childElementFunctions[ "userId" ] = xsd_string;
  this.$$elementChildren.push( "userId" );
}

function WSFlowGraph(  ) 
{
  this.$$nsPrefix = "ns3";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "WSFlowGraph";
  this.$$xmlNames[ "WSFlowGraph" ] = "WSFlowGraph";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.imageBinaryData = new xsd_base64Binary();
  }
  this.$$childElementFunctions[ "imageBinaryData" ] = xsd_base64Binary;
  this.$$elementChildren.push( "imageBinaryData" );
  if ( this.$$deserializing == undefined )
  {
  this.imageName = new xsd_string();
  }
  this.$$childElementFunctions[ "imageName" ] = xsd_string;
  this.$$elementChildren.push( "imageName" );
  if ( this.$$deserializing == undefined )
  {
  this.imageSize = new xsd_long();
  }
  this.$$childElementFunctions[ "imageSize" ] = xsd_long;
  this.$$elementChildren.push( "imageSize" );
  if ( this.$$deserializing == undefined )
  {
  this.imageType = new xsd_string();
  }
  this.$$childElementFunctions[ "imageType" ] = xsd_string;
  this.$$elementChildren.push( "imageType" );
}

function xsd_base64Binary( val ) 
{
  this.$$nsPrefix = "xsd";
  this.$$elementFormDefault = "unqualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xsi_type = new String("xsd:base64Binary");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}


function ArrayOf_tns1_WSFlow(  ) 
{
  this.$$nsPrefix = "ns1";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "ArrayOf_tns1_WSFlow";
  this.$$xmlNames[ "ArrayOf_tns1_WSFlow" ] = "ArrayOf_tns1_WSFlow";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.flows = new Array();  // of WSFlow
  this.flows.$$nsPrefix = "ns1"
 // method to create a new member of the item array
  this.flows.newInstance = function( bDeserializing )
  {
    var newObj = new WSFlow( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.flows_newInstance = function( bDeserializing )
  {
    var newLen = this.flows.push( new WSFlow( bDeserializing ) );
    return this.flows[ newLen-1 ];
  }
  this.length = function()
  {
    return this.flows.length;
  }
  this.WSFlow = this.flows;
  this.WSFlow_newInstance = this.flows_newInstance;
  this.WSFlow.newInstance = this.flows.newInstance;
  this.$$elementChildren.push( "flows" );
}

function ArrayOf_tns1_WSFlowInputDef(  ) 
{
  this.$$nsPrefix = "ns1";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "ArrayOf_tns1_WSFlowInputDef";
  this.$$xmlNames[ "ArrayOf_tns1_WSFlowInputDef" ] = "ArrayOf_tns1_WSFlowInputDef";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.parameters = new Array();  // of WSFlowInputDef
  this.parameters.$$nsPrefix = "ns1"
 // method to create a new member of the item array
  this.parameters.newInstance = function( bDeserializing )
  {
    var newObj = new WSFlowInputDef( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.parameters_newInstance = function( bDeserializing )
  {
    var newLen = this.parameters.push( new WSFlowInputDef( bDeserializing ) );
    return this.parameters[ newLen-1 ];
  }
  this.length = function()
  {
    return this.parameters.length;
  }
  this.WSFlowInputDef = this.parameters;
  this.WSFlowInputDef_newInstance = this.parameters_newInstance;
  this.WSFlowInputDef.newInstance = this.parameters.newInstance;
  this.$$elementChildren.push( "parameters" );
}

function ArrayOf_tns1_WSFlowDetails(  ) 
{
  this.$$nsPrefix = "ns1";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "ArrayOf_tns1_WSFlowDetails";
  this.$$xmlNames[ "ArrayOf_tns1_WSFlowDetails" ] = "ArrayOf_tns1_WSFlowDetails";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.getFlowDetailsReturn = new Array();  // of WSFlowDetails
  this.getFlowDetailsReturn.$$nsPrefix = "ns1"
 // method to create a new member of the item array
  this.getFlowDetailsReturn.newInstance = function( bDeserializing )
  {
    var newObj = new WSFlowDetails( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.getFlowDetailsReturn_newInstance = function( bDeserializing )
  {
    var newLen = this.getFlowDetailsReturn.push( new WSFlowDetails( bDeserializing ) );
    return this.getFlowDetailsReturn[ newLen-1 ];
  }
  this.length = function()
  {
    return this.getFlowDetailsReturn.length;
  }
  this.WSFlowDetails = this.getFlowDetailsReturn;
  this.WSFlowDetails_newInstance = this.getFlowDetailsReturn_newInstance;
  this.WSFlowDetails.newInstance = this.getFlowDetailsReturn.newInstance;
  this.$$elementChildren.push( "getFlowDetailsReturn" );
}

function ArrayOf_tns1_WSFolderDetails(  ) 
{
  this.$$nsPrefix = "ns1";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "ArrayOf_tns1_WSFolderDetails";
  this.$$xmlNames[ "ArrayOf_tns1_WSFolderDetails" ] = "ArrayOf_tns1_WSFolderDetails";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.folders = new Array();  // of WSFolderDetails
  this.folders.$$nsPrefix = "ns1"
 // method to create a new member of the item array
  this.folders.newInstance = function( bDeserializing )
  {
    var newObj = new WSFolderDetails( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.folders_newInstance = function( bDeserializing )
  {
    var newLen = this.folders.push( new WSFolderDetails( bDeserializing ) );
    return this.folders[ newLen-1 ];
  }
  this.length = function()
  {
    return this.folders.length;
  }
  this.WSFolderDetails = this.folders;
  this.WSFolderDetails_newInstance = this.folders_newInstance;
  this.WSFolderDetails.newInstance = this.folders.newInstance;
  this.$$elementChildren.push( "folders" );
}

function ArrayOf_xsd_string_categories(  ) 
{
  this.$$nsPrefix = "ns1";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "ArrayOf_xsd_string";
  this.$$xmlNames[ "ArrayOf_xsd_string" ] = "ArrayOf_xsd_string";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.categories = new Array();  // of xsd_string
  this.categories.$$nsPrefix = "ns1"
 // method to create a new member of the item array
  this.categories.newInstance = function( bDeserializing )
  {
    var newObj = new xsd_string(  );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.categories_newInstance = function( bDeserializing )
  {
    var newLen = this.categories.push( new xsd_string(  ) );
    return this.categories[ newLen-1 ];
  }
  this.length = function()
  {
    return this.categories.length;
  }
  this.xsd_string = this.categories;
  this.xsd_string_newInstance = this.categories_newInstance;
  this.xsd_string.newInstance = this.categories.newInstance;
  this.$$elementChildren.push( "categories" );
}

function ArrayOf_xsd_string(  ) 
{
  this.$$nsPrefix = "ns1";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "ArrayOf_xsd_string";
  this.$$xmlNames[ "ArrayOf_xsd_string" ] = "ArrayOf_xsd_string";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.item = new Array();  // of xsd_string
  this.item.$$nsPrefix = "ns1"
 // method to create a new member of the item array
  this.item.newInstance = function( bDeserializing )
  {
    var newObj = new xsd_string(  );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.item_newInstance = function( bDeserializing )
  {
    var newLen = this.item.push( new xsd_string(  ) );
    return this.item[ newLen-1 ];
  }
  this.length = function()
  {
    return this.item.length;
  }
  this.xsd_string = this.item;
  this.xsd_string_newInstance = this.item_newInstance;
  this.xsd_string.newInstance = this.item.newInstance;
  this.$$elementChildren.push( "item" );
}

function ArrayOf_tns2_WSAttribute(  ) 
{
  this.$$nsPrefix = "ns1";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "ArrayOf_tns2_WSAttribute";
  this.$$xmlNames[ "ArrayOf_tns2_WSAttribute" ] = "ArrayOf_tns2_WSAttribute";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.item = new Array();  // of WSAttribute
  this.item.$$nsPrefix = "ns1"
 // method to create a new member of the item array
  this.item.newInstance = function( bDeserializing )
  {
    var newObj = new WSAttribute( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.item_newInstance = function( bDeserializing )
  {
    var newLen = this.item.push( new WSAttribute( bDeserializing ) );
    return this.item[ newLen-1 ];
  }
  this.length = function()
  {
    return this.item.length;
  }
  this.WSAttribute = this.item;
  this.WSAttribute_newInstance = this.item_newInstance;
  this.WSAttribute.newInstance = this.item.newInstance;
  this.$$elementChildren.push( "item" );
}

function ArrayOfArrayOf_xsd_string(  ) 
{
  this.$$nsPrefix = "ns1";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "ArrayOfArrayOf_xsd_string";
  this.$$xmlNames[ "ArrayOfArrayOf_xsd_string" ] = "ArrayOfArrayOf_xsd_string";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.item = new Array();  // of xsd_string
  this.item.$$nsPrefix = "ns1"
 // method to create a new member of the item array
  this.item.newInstance = function( bDeserializing )
  {
    var newObj = new xsd_string(  );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.item_newInstance = function( bDeserializing )
  {
    var newLen = this.item.push( new xsd_string(  ) );
    return this.item[ newLen-1 ];
  }
  this.length = function()
  {
    return this.item.length;
  }
  this.xsd_string = this.item;
  this.xsd_string_newInstance = this.item_newInstance;
  this.xsd_string.newInstance = this.item.newInstance;
  this.$$elementChildren.push( "item" );
}

function ArrayOf_tns1_WSFlowInput(  ) 
{
  this.$$nsPrefix = "ns1";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "ArrayOf_tns1_WSFlowInput";
  this.$$xmlNames[ "ArrayOf_tns1_WSFlowInput" ] = "ArrayOf_tns1_WSFlowInput";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.item = new Array();  // of WSFlowInput
  this.item.$$nsPrefix = "ns1"
 // method to create a new member of the item array
  this.item.newInstance = function( bDeserializing )
  {
    var newObj = new WSFlowInput( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.item_newInstance = function( bDeserializing )
  {
    var newLen = this.item.push( new WSFlowInput( bDeserializing ) );
    return this.item[ newLen-1 ];
  }
  this.length = function()
  {
    return this.item.length;
  }
  this.WSFlowInput = this.item;
  this.WSFlowInput_newInstance = this.item_newInstance;
  this.WSFlowInput.newInstance = this.item.newInstance;
  this.$$elementChildren.push( "item" );
}

function ArrayOf_tns1_WSRunHandle(  ) 
{
  this.$$nsPrefix = "ns1";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "ArrayOf_tns1_WSRunHandle";
  this.$$xmlNames[ "ArrayOf_tns1_WSRunHandle" ] = "ArrayOf_tns1_WSRunHandle";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.item = new Array();  // of WSRunHandle
  this.item.$$nsPrefix = "ns1"
 // method to create a new member of the item array
  this.item.newInstance = function( bDeserializing )
  {
    var newObj = new WSRunHandle( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.item_newInstance = function( bDeserializing )
  {
    var newLen = this.item.push( new WSRunHandle( bDeserializing ) );
    return this.item[ newLen-1 ];
  }
  this.length = function()
  {
    return this.item.length;
  }
  this.WSRunHandle = this.item;
  this.WSRunHandle_newInstance = this.item_newInstance;
  this.WSRunHandle.newInstance = this.item.newInstance;
  this.$$elementChildren.push( "item" );
}

function ArrayOf_tns1_WSRunStepDetails(  ) 
{
  this.$$nsPrefix = "ns1";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "ArrayOf_tns1_WSRunStepDetails";
  this.$$xmlNames[ "ArrayOf_tns1_WSRunStepDetails" ] = "ArrayOf_tns1_WSRunStepDetails";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.item = new Array();  // of WSRunStepDetails
  this.item.$$nsPrefix = "ns1"
 // method to create a new member of the item array
  this.item.newInstance = function( bDeserializing )
  {
    var newObj = new WSRunStepDetails( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.item_newInstance = function( bDeserializing )
  {
    var newLen = this.item.push( new WSRunStepDetails( bDeserializing ) );
    return this.item[ newLen-1 ];
  }
  this.length = function()
  {
    return this.item.length;
  }
  this.WSRunStepDetails = this.item;
  this.WSRunStepDetails_newInstance = this.item_newInstance;
  this.WSRunStepDetails.newInstance = this.item.newInstance;
  this.$$elementChildren.push( "item" );
}

function ArrayOf_tns1_ScheduledFlowInfo(  ) 
{
  this.$$nsPrefix = "ns1";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "ArrayOf_tns1_ScheduledFlowInfo";
  this.$$xmlNames[ "ArrayOf_tns1_ScheduledFlowInfo" ] = "ArrayOf_tns1_ScheduledFlowInfo";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.item = new Array();  // of ScheduledFlowInfo
  this.item.$$nsPrefix = "ns1"
 // method to create a new member of the item array
  this.item.newInstance = function( bDeserializing )
  {
    var newObj = new ScheduledFlowInfo( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.item_newInstance = function( bDeserializing )
  {
    var newLen = this.item.push( new ScheduledFlowInfo( bDeserializing ) );
    return this.item[ newLen-1 ];
  }
  this.length = function()
  {
    return this.item.length;
  }
  this.ScheduledFlowInfo = this.item;
  this.ScheduledFlowInfo_newInstance = this.item_newInstance;
  this.ScheduledFlowInfo.newInstance = this.item.newInstance;
  this.$$elementChildren.push( "item" );
}

function ArrayOf_tns1_WSScheduleDetails(  ) 
{
  this.$$nsPrefix = "ns1";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "ArrayOf_tns1_WSScheduleDetails";
  this.$$xmlNames[ "ArrayOf_tns1_WSScheduleDetails" ] = "ArrayOf_tns1_WSScheduleDetails";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.item = new Array();  // of WSScheduleDetails
  this.item.$$nsPrefix = "ns1"
 // method to create a new member of the item array
  this.item.newInstance = function( bDeserializing )
  {
    var newObj = new WSScheduleDetails( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.item_newInstance = function( bDeserializing )
  {
    var newLen = this.item.push( new WSScheduleDetails( bDeserializing ) );
    return this.item[ newLen-1 ];
  }
  this.length = function()
  {
    return this.item.length;
  }
  this.WSScheduleDetails = this.item;
  this.WSScheduleDetails_newInstance = this.item_newInstance;
  this.WSScheduleDetails.newInstance = this.item.newInstance;
  this.$$elementChildren.push( "item" );
}

function ArrayOf_tns1_Pair(  ) 
{
  this.$$nsPrefix = "ns1";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "ArrayOf_tns1_Pair";
  this.$$xmlNames[ "ArrayOf_tns1_Pair" ] = "ArrayOf_tns1_Pair";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.item = new Array();  // of Pair
  this.item.$$nsPrefix = "ns1"
 // method to create a new member of the item array
  this.item.newInstance = function( bDeserializing )
  {
    var newObj = new Pair( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.item_newInstance = function( bDeserializing )
  {
    var newLen = this.item.push( new Pair( bDeserializing ) );
    return this.item[ newLen-1 ];
  }
  this.length = function()
  {
    return this.item.length;
  }
  this.Pair = this.item;
  this.Pair_newInstance = this.item_newInstance;
  this.Pair.newInstance = this.item.newInstance;
  this.$$elementChildren.push( "item" );
}

function ArrayOfArrayOf_tns1_WSInputDescriptor(  ) 
{
  this.$$nsPrefix = "ns1";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "ArrayOfArrayOf_tns1_WSInputDescriptor";
  this.$$xmlNames[ "ArrayOfArrayOf_tns1_WSInputDescriptor" ] = "ArrayOfArrayOf_tns1_WSInputDescriptor";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.item = new Array();  // of WSInputDescriptor
  this.item.$$nsPrefix = "ns1"
 // method to create a new member of the item array
  this.item.newInstance = function( bDeserializing )
  {
    var newObj = new WSInputDescriptor( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.item_newInstance = function( bDeserializing )
  {
    var newLen = this.item.push( new WSInputDescriptor( bDeserializing ) );
    return this.item[ newLen-1 ];
  }
  this.length = function()
  {
    return this.item.length;
  }
  this.WSInputDescriptor = this.item;
  this.WSInputDescriptor_newInstance = this.item_newInstance;
  this.WSInputDescriptor.newInstance = this.item.newInstance;
  this.$$elementChildren.push( "item" );
}

function ArrayOf_tns1_WSRunStatus(  ) 
{
  this.$$nsPrefix = "ns1";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "ArrayOf_tns1_WSRunStatus";
  this.$$xmlNames[ "ArrayOf_tns1_WSRunStatus" ] = "ArrayOf_tns1_WSRunStatus";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.item = new Array();  // of WSRunStatus
  this.item.$$nsPrefix = "ns1"
 // method to create a new member of the item array
  this.item.newInstance = function( bDeserializing )
  {
    var newObj = new WSRunStatus( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.item_newInstance = function( bDeserializing )
  {
    var newLen = this.item.push( new WSRunStatus( bDeserializing ) );
    return this.item[ newLen-1 ];
  }
  this.length = function()
  {
    return this.item.length;
  }
  this.WSRunStatus = this.item;
  this.WSRunStatus_newInstance = this.item_newInstance;
  this.WSRunStatus.newInstance = this.item.newInstance;
  this.$$elementChildren.push( "item" );
}

function ArrayOf_tns1_WSRunHistoryQueryParams(  ) 
{
  this.$$nsPrefix = "ns1";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "ArrayOf_tns1_WSRunHistoryQueryParams";
  this.$$xmlNames[ "ArrayOf_tns1_WSRunHistoryQueryParams" ] = "ArrayOf_tns1_WSRunHistoryQueryParams";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.item = new Array();  // of WSRunHistoryQueryParams
  this.item.$$nsPrefix = "ns1"
 // method to create a new member of the item array
  this.item.newInstance = function( bDeserializing )
  {
    var newObj = new WSRunHistoryQueryParams( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.item_newInstance = function( bDeserializing )
  {
    var newLen = this.item.push( new WSRunHistoryQueryParams( bDeserializing ) );
    return this.item[ newLen-1 ];
  }
  this.length = function()
  {
    return this.item.length;
  }
  this.WSRunHistoryQueryParams = this.item;
  this.WSRunHistoryQueryParams_newInstance = this.item_newInstance;
  this.WSRunHistoryQueryParams.newInstance = this.item.newInstance;
  this.$$elementChildren.push( "item" );
}

function ArrayOf_tns1_WSRunHistoryDetails(  ) 
{
  this.$$nsPrefix = "ns1";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "ArrayOf_tns1_WSRunHistoryDetails";
  this.$$xmlNames[ "ArrayOf_tns1_WSRunHistoryDetails" ] = "ArrayOf_tns1_WSRunHistoryDetails";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.item = new Array();  // of WSRunHistoryDetails
  this.item.$$nsPrefix = "ns1"
 // method to create a new member of the item array
  this.item.newInstance = function( bDeserializing )
  {
    var newObj = new WSRunHistoryDetails( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.item_newInstance = function( bDeserializing )
  {
    var newLen = this.item.push( new WSRunHistoryDetails( bDeserializing ) );
    return this.item[ newLen-1 ];
  }
  this.length = function()
  {
    return this.item.length;
  }
  this.WSRunHistoryDetails = this.item;
  this.WSRunHistoryDetails_newInstance = this.item_newInstance;
  this.WSRunHistoryDetails.newInstance = this.item.newInstance;
  this.$$elementChildren.push( "item" );
}

function ArrayOf_tns2_WSClusterNodeDetails(  ) 
{
  this.$$nsPrefix = "ns1";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "ArrayOf_tns2_WSClusterNodeDetails";
  this.$$xmlNames[ "ArrayOf_tns2_WSClusterNodeDetails" ] = "ArrayOf_tns2_WSClusterNodeDetails";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.item = new Array();  // of WSClusterNodeDetails
  this.item.$$nsPrefix = "ns1"
 // method to create a new member of the item array
  this.item.newInstance = function( bDeserializing )
  {
    var newObj = new WSClusterNodeDetails( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.item_newInstance = function( bDeserializing )
  {
    var newLen = this.item.push( new WSClusterNodeDetails( bDeserializing ) );
    return this.item[ newLen-1 ];
  }
  this.length = function()
  {
    return this.item.length;
  }
  this.WSClusterNodeDetails = this.item;
  this.WSClusterNodeDetails_newInstance = this.item_newInstance;
  this.WSClusterNodeDetails.newInstance = this.item.newInstance;
  this.$$elementChildren.push( "item" );
}

function WSAttribute(  ) 
{
  this.$$nsPrefix = "ns4";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "WSAttribute";
  this.$$xmlNames[ "WSAttribute" ] = "WSAttribute";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.name = new xsd_string();
  }
  this.$$childElementFunctions[ "name" ] = xsd_string;
  this.$$elementChildren.push( "name" );
  if ( this.$$deserializing == undefined )
  {
  this.value = new xsd_string();
  }
  this.$$childElementFunctions[ "value" ] = xsd_string;
  this.$$elementChildren.push( "value" );
}

function WSClusterNodeDetails(  ) 
{
  this.$$nsPrefix = "ns4";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "WSClusterNodeDetails";
  this.$$xmlNames[ "WSClusterNodeDetails" ] = "WSClusterNodeDetails";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.url = new xsd_string();
  }
  this.$$childElementFunctions[ "url" ] = xsd_string;
  this.$$elementChildren.push( "url" );
  if ( this.$$deserializing == undefined )
  {
  this.state = new xsd_string();
  }
  this.$$childElementFunctions[ "state" ] = xsd_string;
  this.$$elementChildren.push( "state" );
  if ( this.$$deserializing == undefined )
  {
  this.studioSessions = new xsd_long();
  }
  this.$$childElementFunctions[ "studioSessions" ] = xsd_long;
  this.$$elementChildren.push( "studioSessions" );
  if ( this.$$deserializing == undefined )
  {
  this.centralSessions = new xsd_long();
  }
  this.$$childElementFunctions[ "centralSessions" ] = xsd_long;
  this.$$elementChildren.push( "centralSessions" );
  if ( this.$$deserializing == undefined )
  {
  this.activeRuns = new xsd_long();
  }
  this.$$childElementFunctions[ "activeRuns" ] = xsd_long;
  this.$$elementChildren.push( "activeRuns" );
  if ( this.$$deserializing == undefined )
  {
  this.pendingRuns = new xsd_long();
  }
  this.$$childElementFunctions[ "pendingRuns" ] = xsd_long;
  this.$$elementChildren.push( "pendingRuns" );
}

function WSListDetails(  ) 
{
  this.$$nsPrefix = "ns4";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "WSListDetails";
  this.$$xmlNames[ "WSListDetails" ] = "WSListDetails";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.uuid = new xsd_string();
  }
  this.$$childElementFunctions[ "uuid" ] = xsd_string;
  this.$$elementChildren.push( "uuid" );
  if ( this.$$deserializing == undefined )
  {
  this.name = new xsd_string();
  }
  this.$$childElementFunctions[ "name" ] = xsd_string;
  this.$$elementChildren.push( "name" );
  if ( this.$$deserializing == undefined )
  {
  this.description = new xsd_string();
  }
  this.$$childElementFunctions[ "description" ] = xsd_string;
  this.$$elementChildren.push( "description" );
  if ( this.$$deserializing == undefined )
  {
  this.values = new xsd_string();
  }
  this.$$childElementFunctions[ "values" ] = xsd_string;
  this.$$elementChildren.push( "values" );
  if ( this.$$deserializing == undefined )
  {
  this.version = new xsd_string();
  }
  this.$$childElementFunctions[ "version" ] = xsd_string;
  this.$$elementChildren.push( "version" );
  if ( this.$$deserializing == undefined )
  {
  this.comment = new xsd_string();
  }
  this.$$childElementFunctions[ "comment" ] = xsd_string;
  this.$$elementChildren.push( "comment" );
  if ( this.$$deserializing == undefined )
  {
  this.lastModifiedBy = new xsd_string();
  }
  this.$$childElementFunctions[ "lastModifiedBy" ] = xsd_string;
  this.$$elementChildren.push( "lastModifiedBy" );
  if ( this.$$deserializing == undefined )
  {
  this.lastModified = new xsd_string();
  }
  this.$$childElementFunctions[ "lastModified" ] = xsd_string;
  this.$$elementChildren.push( "lastModified" );
}

function SchedulerException(  ) 
{
  this.$$nsPrefix = "ns5";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "SchedulerException";
  this.$$xmlNames[ "SchedulerException" ] = "SchedulerException";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.clientError = new xsd_boolean();
  }
  this.$$childElementFunctions[ "clientError" ] = xsd_boolean;
  this.$$elementChildren.push( "clientError" );
  if ( this.$$deserializing == undefined )
  {
  this.configurationError = new xsd_boolean();
  }
  this.$$childElementFunctions[ "configurationError" ] = xsd_boolean;
  this.$$elementChildren.push( "configurationError" );
  if ( this.$$deserializing == undefined )
  {
  this.errorCode = new xsd_int();
  }
  this.$$childElementFunctions[ "errorCode" ] = xsd_int;
  this.$$elementChildren.push( "errorCode" );
  if ( this.$$deserializing == undefined )
  {
  this.jobListenerError = new xsd_boolean();
  }
  this.$$childElementFunctions[ "jobListenerError" ] = xsd_boolean;
  this.$$elementChildren.push( "jobListenerError" );
  if ( this.$$deserializing == undefined )
  {
  this.persistenceError = new xsd_boolean();
  }
  this.$$childElementFunctions[ "persistenceError" ] = xsd_boolean;
  this.$$elementChildren.push( "persistenceError" );
  if ( this.$$deserializing == undefined )
  {
  this.threadPoolError = new xsd_boolean();
  }
  this.$$childElementFunctions[ "threadPoolError" ] = xsd_boolean;
  this.$$elementChildren.push( "threadPoolError" );
  if ( this.$$deserializing == undefined )
  {
  this.triggerListenerError = new xsd_boolean();
  }
  this.$$childElementFunctions[ "triggerListenerError" ] = xsd_boolean;
  this.$$elementChildren.push( "triggerListenerError" );
  if ( this.$$deserializing == undefined )
  {
  this.underlyingException = new xsd_anyType();
  }
  this.$$childElementFunctions[ "underlyingException" ] = xsd_anyType;
  this.$$elementChildren.push( "underlyingException" );
}

function xsd_anyType( val ) 
{
  this.$$nsPrefix = "xsd";
  this.$$elementFormDefault = "unqualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xsi_type = new String("xsd:anyType");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function getRunStatusExRequest(  ) 
{
  this.$$nsPrefix = "ns1";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "getRunStatusEx";
  this.$$xmlNames[ "getRunStatusEx" ] = "getRunStatusEx";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://wscentralservice.services.dharma.iconclude.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  if ( this.$$deserializing == undefined )
  {
  this.runHandle = new WSRunHandle();
  }
  this.$$childElementFunctions[ "runHandle" ] = WSRunHandle;
  this.$$elementChildren.push( "runHandle" );
  if ( this.$$deserializing == undefined )
  {
  this.options = new WSStatusOptionsEx();
  }
  this.$$childElementFunctions[ "options" ] = WSStatusOptionsEx;
  this.$$elementChildren.push( "options" );
}

function listRequest(  ) 
{
  this.$$nsPrefix = "ns1";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "list";
  this.$$xmlNames[ "list" ] = "list";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://wscentralservice.services.dharma.iconclude.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  if ( this.$$deserializing == undefined )
  {
  this.basePath = new xsd_string();
  }
  this.$$childElementFunctions[ "basePath" ] = xsd_string;
  this.$$elementChildren.push( "basePath" );
}

function listResponse(  ) 
{
  this.$$nsPrefix = "ns1";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "listResponse";
  this.$$xmlNames[ "listResponse" ] = "listResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://wscentralservice.services.dharma.iconclude.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  if ( this.$$deserializing == undefined )
  {
  this.listReturn = new WSFolderContent();
  }
  this.$$childElementFunctions[ "listReturn" ] = WSFolderContent;
  this.$$elementChildren.push( "listReturn" );
}

function getFlowDetailsRequest(  ) 
{
  this.$$nsPrefix = "ns1";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "getFlowDetails";
  this.$$xmlNames[ "getFlowDetails" ] = "getFlowDetails";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://wscentralservice.services.dharma.iconclude.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  if ( this.$$deserializing == undefined ||this.$$deserializing )
  {
  this.flowUuids = new ArrayOf_xsd_string();
  }
  this.$$childElementFunctions[ "flowUuids" ] = ArrayOf_xsd_string;
  this.$$elementChildren.push( "flowUuids" );
}

function runFlowExResponse(  ) 
{
  this.$$nsPrefix = "ns1";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "runFlowExResponse";
  this.$$xmlNames[ "runFlowExResponse" ] = "runFlowExResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://localhost:8080/PAS/services/WSCentralService");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  if ( this.$$deserializing == undefined )
  {
  this.runFlowExReturn = new WSRunHandleEx();
  }
  this.$$childElementFunctions[ "runFlowExReturn" ] = WSRunHandleEx;
  this.$$elementChildren.push( "runFlowExReturn" );
}


function getRunStatusResponse(  ) 
{
  this.$$nsPrefix = "ns1";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "getRunStatusResponse";
  this.$$xmlNames[ "getRunStatusResponse" ] = "getRunStatusResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://localhost:8080/PAS/services/WSCentralService");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  if ( this.$$deserializing == undefined )
  {
  this.getRunStatusReturn = new WSRunStatus();
  }
  this.$$childElementFunctions[ "getRunStatusReturn" ] = WSRunStatus;
  this.$$elementChildren.push( "getRunStatusReturn" );
}

function runFlowExRequest(  ) 
{
  this.$$nsPrefix = "ns1";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "runFlowExRequest";
  this.$$xmlNames[ "runFlowExRequest" ] = "runFlowExRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://wscentralservice.services.dharma.iconclude.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  if ( this.$$deserializing == undefined )
  {
  this.paramsEx = new WSRunParametersEx();
  }
  this.$$childElementFunctions[ "paramsEx" ] = WSRunParametersEx;
  this.$$elementChildren.push( "paramsEx" );
}

function getRunStatusRequest(  ) 
{
  this.$$nsPrefix = "ns1";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "getRunStatus";
  this.$$xmlNames[ "getRunStatus" ] = "getRunStatus";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://wscentralservice.services.dharma.iconclude.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  if ( this.$$deserializing == undefined )
  {
  this.runHandle = new WSRunHandle();
  }
  this.$$childElementFunctions[ "runHandle" ] = WSRunHandle;
  this.$$elementChildren.push( "runHandle" );
}


function getFlowDetailsResponse(  ) 
{
  this.$$nsPrefix = "ns1";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "getFlowDetailsResponse";
  this.$$xmlNames[ "getFlowDetailsResponse" ] = "getFlowDetailsResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://wscentralservice.services.dharma.iconclude.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  if ( this.$$deserializing == undefined )
  {
  this.getFlowDetailsReturn = new ArrayOf_tns1_WSFlowDetails();
  }
  this.$$childElementFunctions[ "getFlowDetailsReturn" ] = ArrayOf_tns1_WSFlowDetails;
  this.$$elementChildren.push( "getFlowDetailsReturn" );
}


function getRunStatusExResponse(  ) 
{
  this.$$nsPrefix = "ns1";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "getRunStatusExResponse";
  this.$$xmlNames[ "getRunStatusExResponse" ] = "getRunStatusExResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://localhost:8080/PAS/services/WSCentralService");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  if ( this.$$deserializing == undefined )
  {
  this.getRunStatusExReturn = new WSRunStatusEx();
  }
  this.$$childElementFunctions[ "getRunStatusExReturn" ] = WSRunStatusEx;
  this.$$elementChildren.push( "getRunStatusExReturn" );
}

function getChildFunc( childElemName ) 
{
if(childElemName=="parameters"){
	print(this.$$childElementFunctions["isList"].name);
}
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

function ArrayOf_xsd_string_defaultValues	(  ) 
{
  this.$$nsPrefix = "ns1";
  this.$$elementFormDefault = "unqualified";
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
  this.$$name = "ArrayOf_xsd_string";
  this.$$xmlNames[ "ArrayOf_xsd_string" ] = "ArrayOf_xsd_string";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.defaultValues = new Array();  // of xsd_string
  this.defaultValues.$$nsPrefix = "ns1"
 // method to create a new member of the item array
  this.defaultValues.newInstance = function( bDeserializing )
  {
    var newObj = new xsd_string(  );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.defaultValues_newInstance = function( bDeserializing )
  {
    var newLen = this.defaultValues.push( new xsd_string(  ) );
    return this.defaultValues[ newLen-1 ];
  }
  this.length = function()
  {
    return this.defaultValues.length;
  }
  this.xsd_string = this.defaultValues;
  this.xsd_string_newInstance = this.defaultValues_newInstance;
  this.xsd_string.newInstance = this.defaultValues.newInstance;
  this.$$elementChildren.push( "defaultValues" );
}

// Ensure that material in lib.SOAP is available

lib.SOAP.init();
/// End ----------------