
function ucmdbSMService( )
{
  this.location = new String( "http://15.178.178.187:8080/axis2/services/ucmdbSMService" );

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

  this.SOAPOperations[ "getAllCIProperties" ] = new soap_Operation( "getAllCIProperties", "getAllCIProperties", "document", "getAllCIProperties", "getAllCIPropertiesResponse" );
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
    lib.SOAP.deserialize( "ucmdbSMService", this.resultXML.getDocumentElement(), resultObj );
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
  this.xmlns_ns0 = new String("http://schemas.xmlsoap.org/wsdl/http/");
  this.$$attributes.push( "xmlns_ns0" );
  this.$$xmlNames["xmlns_ns0"] = "xmlns:ns0";
  this.$$objNames["xmlns:ns0"] = "xmlns_ns0";
  this.xmlns_ns1 = new String("http://schemas.xmlsoap.org/wsdl/mime/");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  this.xmlns_ns2 = new String("http://schemas.hp.com/ucmdb/1/services/schema/ucmdb");
  this.$$attributes.push( "xmlns_ns2" );
  this.$$xmlNames["xmlns_ns2"] = "xmlns:ns2";
  this.$$objNames["xmlns:ns2"] = "xmlns_ns2";
  this.xmlns_ns3 = new String("http://schemas.xmlsoap.org/wsdl/soap12/");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
  this.xmlns_ns4 = new String("http://schemas.xmlsoap.org/soap/encoding/");
  this.$$attributes.push( "xmlns_ns4" );
  this.$$xmlNames["xmlns_ns4"] = "xmlns:ns4";
  this.$$objNames["xmlns:ns4"] = "xmlns_ns4";
  this.xmlns_ns5 = new String("http://schemas.hp.com/ucmdb/1/services/ucmdb");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
  this.xmlns_ns6 = new String("http://schemas.hp.com/ucmdb/1/types");
  this.$$attributes.push( "xmlns_ns6" );
  this.$$xmlNames["xmlns_ns6"] = "xmlns:ns6";
  this.$$objNames["xmlns:ns6"] = "xmlns_ns6";
  this.xmlns_ns7 = new String("http://www.w3.org/2006/05/addressing/wsdl");
  this.$$attributes.push( "xmlns_ns7" );
  this.$$xmlNames["xmlns_ns7"] = "xmlns:ns7";
  this.$$objNames["xmlns:ns7"] = "xmlns_ns7";
  this.xmlns_ns8 = new String("http://schemas.xmlsoap.org/wsdl/");
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

function ucmdbFault(  ) 
{
  this.$$nsPrefix = "ns6";
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
  this.$$name = "ucmdbFault";
  this.$$xmlNames[ "ucmdbFault" ] = "ucmdbFault";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.msg = new xs_string();
  }
  this.$$childElementFunctions[ "msg" ] = xs_string;
  this.$$elementChildren.push( "msg" );
  if ( this.$$deserializing == undefined )
  {
  this.stacktrace = new xs_string();
  }
  this.$$childElementFunctions[ "stacktrace" ] = xs_string;
  this.$$elementChildren.push( "stacktrace" );
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

function prop(  ) 
{
  this.$$nsPrefix = "ns6";
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
  this.$$name = "prop";
  this.$$xmlNames[ "prop" ] = "prop";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.type = new String();
  this.$$attributes.push( "type" );
  if ( this.$$deserializing == undefined )
  {
  this.name = new xs_string();
  }
  this.$$childElementFunctions[ "name" ] = xs_string;
  this.$$elementChildren.push( "name" );
  if ( this.$$deserializing == undefined )
  {
  this.value = new xs_string();
  }
  this.$$childElementFunctions[ "value" ] = xs_string;
  this.$$elementChildren.push( "value" );
}

function item(  ) 
{
  this.$$nsPrefix = "ns6";
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
  this.$$name = "item";
  this.$$xmlNames[ "item" ] = "item";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.prop = new Array();  // of item_prop
  this.prop.$$nsPrefix = "ns6"
 // method to create a new member of the prop array
  this.prop.newInstance = function( bDeserializing )
  {
    var newObj = new item_prop( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.prop_newInstance = function( bDeserializing )
  {
    var newLen = this.prop.push( new item_prop( bDeserializing ) );
    return this.prop[ newLen-1 ];
  }
  this.$$elementChildren.push( "prop" );
}

function item_prop(  ) 
{
  this.$$nsPrefix = "ns6";
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
  this.$$name = "item_prop";
  this.$$xmlNames[ "item_prop" ] = "prop";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.type = new String();
  this.$$attributes.push( "type" );
  if ( this.$$deserializing == undefined )
  {
  this.name = new xs_string();
  }
  this.$$childElementFunctions[ "name" ] = xs_string;
  this.$$elementChildren.push( "name" );
  if ( this.$$deserializing == undefined )
  {
  this.value = new xs_string();
  }
  this.$$childElementFunctions[ "value" ] = xs_string;
  this.$$elementChildren.push( "value" );
}

function complexProp(  ) 
{
  this.$$nsPrefix = "ns6";
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
  this.$$name = "complexProp";
  this.$$xmlNames[ "complexProp" ] = "complexProp";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.className = new String();
  this.$$attributes.push( "className" );
  this.size = new Number();
  this.$$attributes.push( "size" );
  this.item = new Array();  // of complexProp_item
  this.item.$$nsPrefix = "ns6"
 // method to create a new member of the item array
  this.item.newInstance = function( bDeserializing )
  {
    var newObj = new complexProp_item( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.item_newInstance = function( bDeserializing )
  {
    var newLen = this.item.push( new complexProp_item( bDeserializing ) );
    return this.item[ newLen-1 ];
  }
  this.length = function()
  {
    return this.item.length;
  }
  this.complexProp_item = this.item;
  this.complexProp_item_newInstance = this.item_newInstance;
  this.complexProp_item.newInstance = this.item.newInstance;
  this.$$elementChildren.push( "item" );
}

function complexProp_item(  ) 
{
  this.$$nsPrefix = "ns6";
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
  this.$$name = "complexProp_item";
  this.$$xmlNames[ "complexProp_item" ] = "item";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.prop = new Array();  // of item_prop
  this.prop.$$nsPrefix = "ns6"
 // method to create a new member of the prop array
  this.prop.newInstance = function( bDeserializing )
  {
    var newObj = new item_prop( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.prop_newInstance = function( bDeserializing )
  {
    var newLen = this.prop.push( new item_prop( bDeserializing ) );
    return this.prop[ newLen-1 ];
  }
  this.$$elementChildren.push( "prop" );
}

function CI(  ) 
{
  this.$$nsPrefix = "ns6";
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
  this.$$name = "CI";
  this.$$xmlNames[ "CI" ] = "CI";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.id = new String();
  this.$$attributes.push( "id" );
  this.type = new String();
  this.$$attributes.push( "type" );
  this.prop = new Array();  // of CI_prop
  this.prop.$$nsPrefix = "ns6"
 // method to create a new member of the prop array
  this.prop.newInstance = function( bDeserializing )
  {
    var newObj = new CI_prop( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.prop_newInstance = function( bDeserializing )
  {
    var newLen = this.prop.push( new CI_prop( bDeserializing ) );
    return this.prop[ newLen-1 ];
  }
  this.$$elementChildren.push( "prop" );
  this.complexProp = new Array();  // of CI_complexProp
  this.complexProp.$$nsPrefix = "ns6"
 // method to create a new member of the complexProp array
  this.complexProp.newInstance = function( bDeserializing )
  {
    var newObj = new CI_complexProp( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.complexProp_newInstance = function( bDeserializing )
  {
    var newLen = this.complexProp.push( new CI_complexProp( bDeserializing ) );
    return this.complexProp[ newLen-1 ];
  }
  this.$$elementChildren.push( "complexProp" );
}

function CI_prop(  ) 
{
  this.$$nsPrefix = "ns6";
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
  this.$$name = "CI_prop";
  this.$$xmlNames[ "CI_prop" ] = "prop";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.type = new String();
  this.$$attributes.push( "type" );
  if ( this.$$deserializing == undefined )
  {
  this.name = new xs_string();
  }
  this.$$childElementFunctions[ "name" ] = xs_string;
  this.$$elementChildren.push( "name" );
  if ( this.$$deserializing == undefined )
  {
  this.value = new xs_string();
  }
  this.$$childElementFunctions[ "value" ] = xs_string;
  this.$$elementChildren.push( "value" );
}

function CI_complexProp(  ) 
{
  this.$$nsPrefix = "ns6";
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
  this.$$name = "CI_complexProp";
  this.$$xmlNames[ "CI_complexProp" ] = "complexProp";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.className = new String();
  this.$$attributes.push( "className" );
  this.size = new Number();
  this.$$attributes.push( "size" );
  this.item = new Array();  // of complexProp_item
  this.item.$$nsPrefix = "ns6"
 // method to create a new member of the item array
  this.item.newInstance = function( bDeserializing )
  {
    var newObj = new complexProp_item( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.item_newInstance = function( bDeserializing )
  {
    var newLen = this.item.push( new complexProp_item( bDeserializing ) );
    return this.item[ newLen-1 ];
  }
  this.length = function()
  {
    return this.item.length;
  }
  this.complexProp_item = this.item;
  this.complexProp_item_newInstance = this.item_newInstance;
  this.complexProp_item.newInstance = this.item.newInstance;
  this.$$elementChildren.push( "item" );
}

function getAllCIProperties(  ) 
{
  this.$$nsPrefix = "ns6";
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
  this.$$name = "getAllCIProperties";
  this.$$xmlNames[ "getAllCIProperties" ] = "getAllCIProperties";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns6 = new String("http://schemas.hp.com/ucmdb/1/types");
  this.$$attributes.push( "xmlns_ns6" );
  this.$$xmlNames["xmlns_ns6"] = "xmlns:ns6";
  this.$$objNames["xmlns:ns6"] = "xmlns_ns6";
  if ( this.$$deserializing == undefined )
  {
  this.ID = new xs_string();
  }
  this.$$childElementFunctions[ "ID" ] = xs_string;
  this.$$elementChildren.push( "ID" );
  this.$$minOccurs[ "CustomerID" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.CustomerID = new xs_int();
  }
  this.$$childElementFunctions[ "CustomerID" ] = xs_int;
  this.$$elementChildren.push( "CustomerID" );
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

function getAllCIPropertiesResponse(  ) 
{
  this.$$nsPrefix = "ns6";
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
  this.$$name = "getAllCIPropertiesResponse";
  this.$$xmlNames[ "getAllCIPropertiesResponse" ] = "getAllCIPropertiesResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.CI = new getAllCIPropertiesResponse_CI();
  }
  this.$$childElementFunctions[ "CI" ] = getAllCIPropertiesResponse_CI;
  this.$$elementChildren.push( "CI" );
}

function getAllCIPropertiesResponse_CI(  ) 
{
  this.$$nsPrefix = "ns6";
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
  this.$$name = "getAllCIPropertiesResponse_CI";
  this.$$xmlNames[ "getAllCIPropertiesResponse_CI" ] = "CI";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.id = new String();
  this.$$attributes.push( "id" );
  this.type = new String();
  this.$$attributes.push( "type" );
  this.prop = new Array();  // of CI_prop
  this.prop.$$nsPrefix = "ns6"
 // method to create a new member of the prop array
  this.prop.newInstance = function( bDeserializing )
  {
    var newObj = new CI_prop( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.prop_newInstance = function( bDeserializing )
  {
    var newLen = this.prop.push( new CI_prop( bDeserializing ) );
    return this.prop[ newLen-1 ];
  }
  this.$$elementChildren.push( "prop" );
  this.complexProp = new Array();  // of CI_complexProp
  this.complexProp.$$nsPrefix = "ns6"
 // method to create a new member of the complexProp array
  this.complexProp.newInstance = function( bDeserializing )
  {
    var newObj = new CI_complexProp( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.complexProp_newInstance = function( bDeserializing )
  {
    var newLen = this.complexProp.push( new CI_complexProp( bDeserializing ) );
    return this.complexProp[ newLen-1 ];
  }
  this.$$elementChildren.push( "complexProp" );
}

function getAllCIPropertiesRequest(  ) 
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
  this.$$name = "getAllCIPropertiesRequest";
  this.$$xmlNames[ "getAllCIPropertiesRequest" ] = "getAllCIPropertiesRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns5 = new String("http://schemas.hp.com/ucmdb/1/services/ucmdb");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
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