
function DOTSAddressValidate( )
{
  this.location = new String( "http://ws2.serviceobjects.net/av/AddressValidate.asmx" );

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

  this.SOAPOperations[ "ValidateAddress" ] = new soap_Operation( "ValidateAddress", "http://www.serviceobjects.com/ValidateAddress", "document", "ValidateAddress", "ValidateAddressResponse" );
  this.SOAPOperations[ "ValidateAddressWithFragments" ] = new soap_Operation( "ValidateAddressWithFragments", "http://www.serviceobjects.com/ValidateAddressWithFragments", "document", "ValidateAddressWithFragments", "ValidateAddressWithFragmentsResponse" );
  this.SOAPOperations[ "ParseAddress" ] = new soap_Operation( "ParseAddress", "http://www.serviceobjects.com/ParseAddress", "document", "ParseAddress", "ParseAddressResponse" );
  this.SOAPOperations[ "ValidateAddressWithExtras" ] = new soap_Operation( "ValidateAddressWithExtras", "http://www.serviceobjects.com/ValidateAddressWithExtras", "document", "ValidateAddressWithExtras", "ValidateAddressWithExtrasResponse" );
  this.SOAPOperations[ "GetPossibleMatches" ] = new soap_Operation( "GetPossibleMatches", "http://www.serviceobjects.com/GetPossibleMatches", "document", "GetPossibleMatches", "GetPossibleMatchesResponse" );
  this.SOAPOperations[ "ValidateAddressType" ] = new soap_Operation( "ValidateAddressType", "http://www.serviceobjects.com/ValidateAddressType", "document", "ValidateAddressType", "ValidateAddressTypeResponse" );
  this.SOAPOperations[ "ValidateAddressSingleLine" ] = new soap_Operation( "ValidateAddressSingleLine", "http://www.serviceobjects.com/ValidateAddressSingleLine", "document", "ValidateAddressSingleLine", "ValidateAddressSingleLineResponse" );
  this.SOAPOperations[ "ValidateCityStateZip" ] = new soap_Operation( "ValidateCityStateZip", "http://www.serviceobjects.com/ValidateCityStateZip", "document", "ValidateCityStateZip", "ValidateCityStateZipResponse" );
  this.SOAPOperations[ "ValidateAddressWithDPV" ] = new soap_Operation( "ValidateAddressWithDPV", "http://www.serviceobjects.com/ValidateAddressWithDPV", "document", "ValidateAddressWithDPV", "ValidateAddressWithDPVResponse" );
  this.SOAPOperations[ "ValidateAddressWithSuiteLink" ] = new soap_Operation( "ValidateAddressWithSuiteLink", "http://www.serviceobjects.com/ValidateAddressWithSuiteLink", "document", "ValidateAddressWithSuiteLink", "ValidateAddressWithSuiteLinkResponse" );
  this.SOAPOperations[ "ValidateAddressWithRDI" ] = new soap_Operation( "ValidateAddressWithRDI", "http://www.serviceobjects.com/ValidateAddressWithRDI", "document", "ValidateAddressWithRDI", "ValidateAddressWithRDIResponse" );
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
    lib.SOAP.deserialize( "DOTSAddressValidate", this.resultXML.getDocumentElement(), resultObj );
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
  this.xmlns_xsd = new String("http://www.w3.org/2001/XMLSchema");
  this.$$attributes.push( "xmlns_xsd" );
  this.$$xmlNames["xmlns_xsd"] = "xmlns:xsd";
  this.$$objNames["xmlns:xsd"] = "xmlns_xsd";
  this.xmlns_ns3 = new String("http://schemas.xmlsoap.org/soap/encoding/");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
  this.xmlns_ns4 = new String("http://microsoft.com/wsdl/mime/textMatching/");
  this.$$attributes.push( "xmlns_ns4" );
  this.$$xmlNames["xmlns_ns4"] = "xmlns:ns4";
  this.$$objNames["xmlns:ns4"] = "xmlns_ns4";
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
  this.xmlns_ns6 = new String("http://schemas.xmlsoap.org/wsdl/");
  this.$$attributes.push( "xmlns_ns6" );
  this.$$xmlNames["xmlns_ns6"] = "xmlns:ns6";
  this.$$objNames["xmlns:ns6"] = "xmlns_ns6";
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

function ValidateAddress(  ) 
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
  this.$$name = "ValidateAddress";
  this.$$xmlNames[ "ValidateAddress" ] = "ValidateAddress";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
  this.$$minOccurs[ "Address" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Address = new s_string();
  }
  this.$$childElementFunctions[ "Address" ] = s_string;
  this.$$elementChildren.push( "Address" );
  this.$$minOccurs[ "City" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.City = new s_string();
  }
  this.$$childElementFunctions[ "City" ] = s_string;
  this.$$elementChildren.push( "City" );
  this.$$minOccurs[ "State" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.State = new s_string();
  }
  this.$$childElementFunctions[ "State" ] = s_string;
  this.$$elementChildren.push( "State" );
  this.$$minOccurs[ "PostalCode" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.PostalCode = new s_string();
  }
  this.$$childElementFunctions[ "PostalCode" ] = s_string;
  this.$$elementChildren.push( "PostalCode" );
  this.$$minOccurs[ "LicenseKey" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.LicenseKey = new s_string();
  }
  this.$$childElementFunctions[ "LicenseKey" ] = s_string;
  this.$$elementChildren.push( "LicenseKey" );
}

function s_string( val ) 
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

function ValidateAddressResponse(  ) 
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
  this.$$name = "ValidateAddressResponse";
  this.$$xmlNames[ "ValidateAddressResponse" ] = "ValidateAddressResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "ValidateAddressResult" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ValidateAddressResult = new Address();
  }
  this.$$childElementFunctions[ "ValidateAddressResult" ] = Address;
  this.$$elementChildren.push( "ValidateAddressResult" );
}

function Address(  ) 
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
  this.$$name = "Address";
  this.$$xmlNames[ "Address" ] = "Address";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "Address" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Address = new s_string();
  }
  this.$$childElementFunctions[ "Address" ] = s_string;
  this.$$elementChildren.push( "Address" );
  this.$$minOccurs[ "City" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.City = new s_string();
  }
  this.$$childElementFunctions[ "City" ] = s_string;
  this.$$elementChildren.push( "City" );
  this.$$minOccurs[ "State" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.State = new s_string();
  }
  this.$$childElementFunctions[ "State" ] = s_string;
  this.$$elementChildren.push( "State" );
  this.$$minOccurs[ "Zip" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Zip = new s_string();
  }
  this.$$childElementFunctions[ "Zip" ] = s_string;
  this.$$elementChildren.push( "Zip" );
  this.$$minOccurs[ "Address2" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Address2 = new s_string();
  }
  this.$$childElementFunctions[ "Address2" ] = s_string;
  this.$$elementChildren.push( "Address2" );
  this.$$minOccurs[ "BarcodeDigits" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.BarcodeDigits = new s_string();
  }
  this.$$childElementFunctions[ "BarcodeDigits" ] = s_string;
  this.$$elementChildren.push( "BarcodeDigits" );
  this.$$minOccurs[ "CarrierRoute" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.CarrierRoute = new s_string();
  }
  this.$$childElementFunctions[ "CarrierRoute" ] = s_string;
  this.$$elementChildren.push( "CarrierRoute" );
  this.$$minOccurs[ "CongressCode" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.CongressCode = new s_string();
  }
  this.$$childElementFunctions[ "CongressCode" ] = s_string;
  this.$$elementChildren.push( "CongressCode" );
  this.$$minOccurs[ "CountyCode" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.CountyCode = new s_string();
  }
  this.$$childElementFunctions[ "CountyCode" ] = s_string;
  this.$$elementChildren.push( "CountyCode" );
  this.$$minOccurs[ "CountyName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.CountyName = new s_string();
  }
  this.$$childElementFunctions[ "CountyName" ] = s_string;
  this.$$elementChildren.push( "CountyName" );
  this.$$minOccurs[ "Fragment" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Fragment = new s_string();
  }
  this.$$childElementFunctions[ "Fragment" ] = s_string;
  this.$$elementChildren.push( "Fragment" );
  this.$$minOccurs[ "Exception" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Exception = new s_string();
  }
  this.$$childElementFunctions[ "Exception" ] = s_string;
  this.$$elementChildren.push( "Exception" );
  this.$$minOccurs[ "Error" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Error = new Err();
  }
  this.$$childElementFunctions[ "Error" ] = Err;
  this.$$elementChildren.push( "Error" );
}

function Err(  ) 
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
  this.$$name = "Err";
  this.$$xmlNames[ "Err" ] = "Err";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "Desc" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Desc = new s_string();
  }
  this.$$childElementFunctions[ "Desc" ] = s_string;
  this.$$elementChildren.push( "Desc" );
  this.$$minOccurs[ "Number" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Number = new s_string();
  }
  this.$$childElementFunctions[ "Number" ] = s_string;
  this.$$elementChildren.push( "Number" );
  this.$$minOccurs[ "Location" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Location = new s_string();
  }
  this.$$childElementFunctions[ "Location" ] = s_string;
  this.$$elementChildren.push( "Location" );
}

function ValidateAddressWithFragments(  ) 
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
  this.$$name = "ValidateAddressWithFragments";
  this.$$xmlNames[ "ValidateAddressWithFragments" ] = "ValidateAddressWithFragments";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
  this.$$minOccurs[ "Address" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Address = new s_string();
  }
  this.$$childElementFunctions[ "Address" ] = s_string;
  this.$$elementChildren.push( "Address" );
  this.$$minOccurs[ "City" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.City = new s_string();
  }
  this.$$childElementFunctions[ "City" ] = s_string;
  this.$$elementChildren.push( "City" );
  this.$$minOccurs[ "State" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.State = new s_string();
  }
  this.$$childElementFunctions[ "State" ] = s_string;
  this.$$elementChildren.push( "State" );
  this.$$minOccurs[ "PostalCode" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.PostalCode = new s_string();
  }
  this.$$childElementFunctions[ "PostalCode" ] = s_string;
  this.$$elementChildren.push( "PostalCode" );
  this.$$minOccurs[ "LicenseKey" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.LicenseKey = new s_string();
  }
  this.$$childElementFunctions[ "LicenseKey" ] = s_string;
  this.$$elementChildren.push( "LicenseKey" );
}

function ValidateAddressWithFragmentsResponse(  ) 
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
  this.$$name = "ValidateAddressWithFragmentsResponse";
  this.$$xmlNames[ "ValidateAddressWithFragmentsResponse" ] = "ValidateAddressWithFragmentsResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "ValidateAddressWithFragmentsResult" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ValidateAddressWithFragmentsResult = new FragmentAddress();
  }
  this.$$childElementFunctions[ "ValidateAddressWithFragmentsResult" ] = FragmentAddress;
  this.$$elementChildren.push( "ValidateAddressWithFragmentsResult" );
}

function FragmentAddress(  ) 
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
  this.$$name = "FragmentAddress";
  this.$$xmlNames[ "FragmentAddress" ] = "FragmentAddress";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "Address" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Address = new s_string();
  }
  this.$$childElementFunctions[ "Address" ] = s_string;
  this.$$elementChildren.push( "Address" );
  this.$$minOccurs[ "City" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.City = new s_string();
  }
  this.$$childElementFunctions[ "City" ] = s_string;
  this.$$elementChildren.push( "City" );
  this.$$minOccurs[ "State" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.State = new s_string();
  }
  this.$$childElementFunctions[ "State" ] = s_string;
  this.$$elementChildren.push( "State" );
  this.$$minOccurs[ "Zip" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Zip = new s_string();
  }
  this.$$childElementFunctions[ "Zip" ] = s_string;
  this.$$elementChildren.push( "Zip" );
  this.$$minOccurs[ "Address2" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Address2 = new s_string();
  }
  this.$$childElementFunctions[ "Address2" ] = s_string;
  this.$$elementChildren.push( "Address2" );
  this.$$minOccurs[ "BarcodeDigits" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.BarcodeDigits = new s_string();
  }
  this.$$childElementFunctions[ "BarcodeDigits" ] = s_string;
  this.$$elementChildren.push( "BarcodeDigits" );
  this.$$minOccurs[ "CarrierRoute" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.CarrierRoute = new s_string();
  }
  this.$$childElementFunctions[ "CarrierRoute" ] = s_string;
  this.$$elementChildren.push( "CarrierRoute" );
  this.$$minOccurs[ "CongressCode" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.CongressCode = new s_string();
  }
  this.$$childElementFunctions[ "CongressCode" ] = s_string;
  this.$$elementChildren.push( "CongressCode" );
  this.$$minOccurs[ "CountyCode" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.CountyCode = new s_string();
  }
  this.$$childElementFunctions[ "CountyCode" ] = s_string;
  this.$$elementChildren.push( "CountyCode" );
  this.$$minOccurs[ "CountyName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.CountyName = new s_string();
  }
  this.$$childElementFunctions[ "CountyName" ] = s_string;
  this.$$elementChildren.push( "CountyName" );
  this.$$minOccurs[ "Fragment" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Fragment = new s_string();
  }
  this.$$childElementFunctions[ "Fragment" ] = s_string;
  this.$$elementChildren.push( "Fragment" );
  this.$$minOccurs[ "FragmentHouse" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentHouse = new s_string();
  }
  this.$$childElementFunctions[ "FragmentHouse" ] = s_string;
  this.$$elementChildren.push( "FragmentHouse" );
  this.$$minOccurs[ "FragmentPMBNumber" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentPMBNumber = new s_string();
  }
  this.$$childElementFunctions[ "FragmentPMBNumber" ] = s_string;
  this.$$elementChildren.push( "FragmentPMBNumber" );
  this.$$minOccurs[ "FragmentPMBPrefix" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentPMBPrefix = new s_string();
  }
  this.$$childElementFunctions[ "FragmentPMBPrefix" ] = s_string;
  this.$$elementChildren.push( "FragmentPMBPrefix" );
  this.$$minOccurs[ "FragmentPostDir" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentPostDir = new s_string();
  }
  this.$$childElementFunctions[ "FragmentPostDir" ] = s_string;
  this.$$elementChildren.push( "FragmentPostDir" );
  this.$$minOccurs[ "FragmentPreDir" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentPreDir = new s_string();
  }
  this.$$childElementFunctions[ "FragmentPreDir" ] = s_string;
  this.$$elementChildren.push( "FragmentPreDir" );
  this.$$minOccurs[ "FragmentStreet" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentStreet = new s_string();
  }
  this.$$childElementFunctions[ "FragmentStreet" ] = s_string;
  this.$$elementChildren.push( "FragmentStreet" );
  this.$$minOccurs[ "FragmentSuffix" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentSuffix = new s_string();
  }
  this.$$childElementFunctions[ "FragmentSuffix" ] = s_string;
  this.$$elementChildren.push( "FragmentSuffix" );
  this.$$minOccurs[ "FragmentUnit" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentUnit = new s_string();
  }
  this.$$childElementFunctions[ "FragmentUnit" ] = s_string;
  this.$$elementChildren.push( "FragmentUnit" );
  this.$$minOccurs[ "Source" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Source = new s_string();
  }
  this.$$childElementFunctions[ "Source" ] = s_string;
  this.$$elementChildren.push( "Source" );
  this.$$minOccurs[ "Error" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Error = new FragmentAddress_Err();
  }
  this.$$childElementFunctions[ "Error" ] = FragmentAddress_Err;
  this.$$elementChildren.push( "Error" );
}

function FragmentAddress_Err(  ) 
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
  this.$$name = "FragmentAddress_Err";
  this.$$xmlNames[ "FragmentAddress_Err" ] = "Error";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "Desc" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Desc = new s_string();
  }
  this.$$childElementFunctions[ "Desc" ] = s_string;
  this.$$elementChildren.push( "Desc" );
  this.$$minOccurs[ "Number" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Number = new s_string();
  }
  this.$$childElementFunctions[ "Number" ] = s_string;
  this.$$elementChildren.push( "Number" );
  this.$$minOccurs[ "Location" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Location = new s_string();
  }
  this.$$childElementFunctions[ "Location" ] = s_string;
  this.$$elementChildren.push( "Location" );
}

function ParseAddress(  ) 
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
  this.$$name = "ParseAddress";
  this.$$xmlNames[ "ParseAddress" ] = "ParseAddress";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
  this.$$minOccurs[ "Address" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Address = new s_string();
  }
  this.$$childElementFunctions[ "Address" ] = s_string;
  this.$$elementChildren.push( "Address" );
  this.$$minOccurs[ "City" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.City = new s_string();
  }
  this.$$childElementFunctions[ "City" ] = s_string;
  this.$$elementChildren.push( "City" );
  this.$$minOccurs[ "State" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.State = new s_string();
  }
  this.$$childElementFunctions[ "State" ] = s_string;
  this.$$elementChildren.push( "State" );
  this.$$minOccurs[ "PostalCode" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.PostalCode = new s_string();
  }
  this.$$childElementFunctions[ "PostalCode" ] = s_string;
  this.$$elementChildren.push( "PostalCode" );
  this.$$minOccurs[ "LicenseKey" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.LicenseKey = new s_string();
  }
  this.$$childElementFunctions[ "LicenseKey" ] = s_string;
  this.$$elementChildren.push( "LicenseKey" );
}

function ParseAddressResponse(  ) 
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
  this.$$name = "ParseAddressResponse";
  this.$$xmlNames[ "ParseAddressResponse" ] = "ParseAddressResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "ParseAddressResult" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ParseAddressResult = new ParseAddressResponse_FragmentAddress();
  }
  this.$$childElementFunctions[ "ParseAddressResult" ] = ParseAddressResponse_FragmentAddress;
  this.$$elementChildren.push( "ParseAddressResult" );
}

function ParseAddressResponse_FragmentAddress(  ) 
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
  this.$$name = "ParseAddressResponse_FragmentAddress";
  this.$$xmlNames[ "ParseAddressResponse_FragmentAddress" ] = "ParseAddressResult";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "Address" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Address = new s_string();
  }
  this.$$childElementFunctions[ "Address" ] = s_string;
  this.$$elementChildren.push( "Address" );
  this.$$minOccurs[ "City" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.City = new s_string();
  }
  this.$$childElementFunctions[ "City" ] = s_string;
  this.$$elementChildren.push( "City" );
  this.$$minOccurs[ "State" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.State = new s_string();
  }
  this.$$childElementFunctions[ "State" ] = s_string;
  this.$$elementChildren.push( "State" );
  this.$$minOccurs[ "Zip" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Zip = new s_string();
  }
  this.$$childElementFunctions[ "Zip" ] = s_string;
  this.$$elementChildren.push( "Zip" );
  this.$$minOccurs[ "Address2" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Address2 = new s_string();
  }
  this.$$childElementFunctions[ "Address2" ] = s_string;
  this.$$elementChildren.push( "Address2" );
  this.$$minOccurs[ "BarcodeDigits" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.BarcodeDigits = new s_string();
  }
  this.$$childElementFunctions[ "BarcodeDigits" ] = s_string;
  this.$$elementChildren.push( "BarcodeDigits" );
  this.$$minOccurs[ "CarrierRoute" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.CarrierRoute = new s_string();
  }
  this.$$childElementFunctions[ "CarrierRoute" ] = s_string;
  this.$$elementChildren.push( "CarrierRoute" );
  this.$$minOccurs[ "CongressCode" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.CongressCode = new s_string();
  }
  this.$$childElementFunctions[ "CongressCode" ] = s_string;
  this.$$elementChildren.push( "CongressCode" );
  this.$$minOccurs[ "CountyCode" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.CountyCode = new s_string();
  }
  this.$$childElementFunctions[ "CountyCode" ] = s_string;
  this.$$elementChildren.push( "CountyCode" );
  this.$$minOccurs[ "CountyName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.CountyName = new s_string();
  }
  this.$$childElementFunctions[ "CountyName" ] = s_string;
  this.$$elementChildren.push( "CountyName" );
  this.$$minOccurs[ "Fragment" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Fragment = new s_string();
  }
  this.$$childElementFunctions[ "Fragment" ] = s_string;
  this.$$elementChildren.push( "Fragment" );
  this.$$minOccurs[ "FragmentHouse" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentHouse = new s_string();
  }
  this.$$childElementFunctions[ "FragmentHouse" ] = s_string;
  this.$$elementChildren.push( "FragmentHouse" );
  this.$$minOccurs[ "FragmentPMBNumber" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentPMBNumber = new s_string();
  }
  this.$$childElementFunctions[ "FragmentPMBNumber" ] = s_string;
  this.$$elementChildren.push( "FragmentPMBNumber" );
  this.$$minOccurs[ "FragmentPMBPrefix" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentPMBPrefix = new s_string();
  }
  this.$$childElementFunctions[ "FragmentPMBPrefix" ] = s_string;
  this.$$elementChildren.push( "FragmentPMBPrefix" );
  this.$$minOccurs[ "FragmentPostDir" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentPostDir = new s_string();
  }
  this.$$childElementFunctions[ "FragmentPostDir" ] = s_string;
  this.$$elementChildren.push( "FragmentPostDir" );
  this.$$minOccurs[ "FragmentPreDir" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentPreDir = new s_string();
  }
  this.$$childElementFunctions[ "FragmentPreDir" ] = s_string;
  this.$$elementChildren.push( "FragmentPreDir" );
  this.$$minOccurs[ "FragmentStreet" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentStreet = new s_string();
  }
  this.$$childElementFunctions[ "FragmentStreet" ] = s_string;
  this.$$elementChildren.push( "FragmentStreet" );
  this.$$minOccurs[ "FragmentSuffix" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentSuffix = new s_string();
  }
  this.$$childElementFunctions[ "FragmentSuffix" ] = s_string;
  this.$$elementChildren.push( "FragmentSuffix" );
  this.$$minOccurs[ "FragmentUnit" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentUnit = new s_string();
  }
  this.$$childElementFunctions[ "FragmentUnit" ] = s_string;
  this.$$elementChildren.push( "FragmentUnit" );
  this.$$minOccurs[ "Source" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Source = new s_string();
  }
  this.$$childElementFunctions[ "Source" ] = s_string;
  this.$$elementChildren.push( "Source" );
  this.$$minOccurs[ "Error" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Error = new FragmentAddress_Err();
  }
  this.$$childElementFunctions[ "Error" ] = FragmentAddress_Err;
  this.$$elementChildren.push( "Error" );
}

function ValidateAddressWithExtras(  ) 
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
  this.$$name = "ValidateAddressWithExtras";
  this.$$xmlNames[ "ValidateAddressWithExtras" ] = "ValidateAddressWithExtras";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
  this.$$minOccurs[ "Address" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Address = new s_string();
  }
  this.$$childElementFunctions[ "Address" ] = s_string;
  this.$$elementChildren.push( "Address" );
  this.$$minOccurs[ "Address2" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Address2 = new s_string();
  }
  this.$$childElementFunctions[ "Address2" ] = s_string;
  this.$$elementChildren.push( "Address2" );
  this.$$minOccurs[ "City" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.City = new s_string();
  }
  this.$$childElementFunctions[ "City" ] = s_string;
  this.$$elementChildren.push( "City" );
  this.$$minOccurs[ "State" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.State = new s_string();
  }
  this.$$childElementFunctions[ "State" ] = s_string;
  this.$$elementChildren.push( "State" );
  this.$$minOccurs[ "PostalCode" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.PostalCode = new s_string();
  }
  this.$$childElementFunctions[ "PostalCode" ] = s_string;
  this.$$elementChildren.push( "PostalCode" );
  this.$$minOccurs[ "LicenseKey" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.LicenseKey = new s_string();
  }
  this.$$childElementFunctions[ "LicenseKey" ] = s_string;
  this.$$elementChildren.push( "LicenseKey" );
}

function ValidateAddressWithExtrasResponse(  ) 
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
  this.$$name = "ValidateAddressWithExtrasResponse";
  this.$$xmlNames[ "ValidateAddressWithExtrasResponse" ] = "ValidateAddressWithExtrasResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "ValidateAddressWithExtrasResult" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ValidateAddressWithExtrasResult = new ValidateAddressWithExtrasResponse_Address();
  }
  this.$$childElementFunctions[ "ValidateAddressWithExtrasResult" ] = ValidateAddressWithExtrasResponse_Address;
  this.$$elementChildren.push( "ValidateAddressWithExtrasResult" );
}

function ValidateAddressWithExtrasResponse_Address(  ) 
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
  this.$$name = "ValidateAddressWithExtrasResponse_Address";
  this.$$xmlNames[ "ValidateAddressWithExtrasResponse_Address" ] = "ValidateAddressWithExtrasResult";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "Address" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Address = new s_string();
  }
  this.$$childElementFunctions[ "Address" ] = s_string;
  this.$$elementChildren.push( "Address" );
  this.$$minOccurs[ "City" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.City = new s_string();
  }
  this.$$childElementFunctions[ "City" ] = s_string;
  this.$$elementChildren.push( "City" );
  this.$$minOccurs[ "State" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.State = new s_string();
  }
  this.$$childElementFunctions[ "State" ] = s_string;
  this.$$elementChildren.push( "State" );
  this.$$minOccurs[ "Zip" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Zip = new s_string();
  }
  this.$$childElementFunctions[ "Zip" ] = s_string;
  this.$$elementChildren.push( "Zip" );
  this.$$minOccurs[ "Address2" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Address2 = new s_string();
  }
  this.$$childElementFunctions[ "Address2" ] = s_string;
  this.$$elementChildren.push( "Address2" );
  this.$$minOccurs[ "BarcodeDigits" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.BarcodeDigits = new s_string();
  }
  this.$$childElementFunctions[ "BarcodeDigits" ] = s_string;
  this.$$elementChildren.push( "BarcodeDigits" );
  this.$$minOccurs[ "CarrierRoute" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.CarrierRoute = new s_string();
  }
  this.$$childElementFunctions[ "CarrierRoute" ] = s_string;
  this.$$elementChildren.push( "CarrierRoute" );
  this.$$minOccurs[ "CongressCode" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.CongressCode = new s_string();
  }
  this.$$childElementFunctions[ "CongressCode" ] = s_string;
  this.$$elementChildren.push( "CongressCode" );
  this.$$minOccurs[ "CountyCode" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.CountyCode = new s_string();
  }
  this.$$childElementFunctions[ "CountyCode" ] = s_string;
  this.$$elementChildren.push( "CountyCode" );
  this.$$minOccurs[ "CountyName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.CountyName = new s_string();
  }
  this.$$childElementFunctions[ "CountyName" ] = s_string;
  this.$$elementChildren.push( "CountyName" );
  this.$$minOccurs[ "Fragment" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Fragment = new s_string();
  }
  this.$$childElementFunctions[ "Fragment" ] = s_string;
  this.$$elementChildren.push( "Fragment" );
  this.$$minOccurs[ "Exception" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Exception = new s_string();
  }
  this.$$childElementFunctions[ "Exception" ] = s_string;
  this.$$elementChildren.push( "Exception" );
  this.$$minOccurs[ "Error" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Error = new Err();
  }
  this.$$childElementFunctions[ "Error" ] = Err;
  this.$$elementChildren.push( "Error" );
}

function GetPossibleMatches(  ) 
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
  this.$$name = "GetPossibleMatches";
  this.$$xmlNames[ "GetPossibleMatches" ] = "GetPossibleMatches";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
  this.$$minOccurs[ "Address" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Address = new s_string();
  }
  this.$$childElementFunctions[ "Address" ] = s_string;
  this.$$elementChildren.push( "Address" );
  this.$$minOccurs[ "Address2" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Address2 = new s_string();
  }
  this.$$childElementFunctions[ "Address2" ] = s_string;
  this.$$elementChildren.push( "Address2" );
  this.$$minOccurs[ "City" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.City = new s_string();
  }
  this.$$childElementFunctions[ "City" ] = s_string;
  this.$$elementChildren.push( "City" );
  this.$$minOccurs[ "State" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.State = new s_string();
  }
  this.$$childElementFunctions[ "State" ] = s_string;
  this.$$elementChildren.push( "State" );
  this.$$minOccurs[ "PostalCode" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.PostalCode = new s_string();
  }
  this.$$childElementFunctions[ "PostalCode" ] = s_string;
  this.$$elementChildren.push( "PostalCode" );
  this.$$minOccurs[ "LicenseKey" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.LicenseKey = new s_string();
  }
  this.$$childElementFunctions[ "LicenseKey" ] = s_string;
  this.$$elementChildren.push( "LicenseKey" );
}

function GetPossibleMatchesResponse(  ) 
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
  this.$$name = "GetPossibleMatchesResponse";
  this.$$xmlNames[ "GetPossibleMatchesResponse" ] = "GetPossibleMatchesResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "GetPossibleMatchesResult" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.GetPossibleMatchesResult = new ArrayOfFragmentAddress();
  }
  this.$$childElementFunctions[ "GetPossibleMatchesResult" ] = ArrayOfFragmentAddress;
  this.$$elementChildren.push( "GetPossibleMatchesResult" );
}

function ArrayOfFragmentAddress(  ) 
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
  this.$$name = "ArrayOfFragmentAddress";
  this.$$xmlNames[ "ArrayOfFragmentAddress" ] = "ArrayOfFragmentAddress";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.FragmentAddress = new Array();  // of ArrayOfFragmentAddress_FragmentAddress
  this.FragmentAddress.$$nsPrefix = "ns5"
 // method to create a new member of the FragmentAddress array
  this.FragmentAddress.newInstance = function( bDeserializing )
  {
    var newObj = new ArrayOfFragmentAddress_FragmentAddress( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.FragmentAddress_newInstance = function( bDeserializing )
  {
    var newLen = this.FragmentAddress.push( new ArrayOfFragmentAddress_FragmentAddress( bDeserializing ) );
    return this.FragmentAddress[ newLen-1 ];
  }
  this.$$elementChildren.push( "FragmentAddress" );
}

function ArrayOfFragmentAddress_FragmentAddress(  ) 
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
  this.$$name = "ArrayOfFragmentAddress_FragmentAddress";
  this.$$xmlNames[ "ArrayOfFragmentAddress_FragmentAddress" ] = "FragmentAddress";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "Address" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Address = new s_string();
  }
  this.$$childElementFunctions[ "Address" ] = s_string;
  this.$$elementChildren.push( "Address" );
  this.$$minOccurs[ "City" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.City = new s_string();
  }
  this.$$childElementFunctions[ "City" ] = s_string;
  this.$$elementChildren.push( "City" );
  this.$$minOccurs[ "State" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.State = new s_string();
  }
  this.$$childElementFunctions[ "State" ] = s_string;
  this.$$elementChildren.push( "State" );
  this.$$minOccurs[ "Zip" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Zip = new s_string();
  }
  this.$$childElementFunctions[ "Zip" ] = s_string;
  this.$$elementChildren.push( "Zip" );
  this.$$minOccurs[ "Address2" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Address2 = new s_string();
  }
  this.$$childElementFunctions[ "Address2" ] = s_string;
  this.$$elementChildren.push( "Address2" );
  this.$$minOccurs[ "BarcodeDigits" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.BarcodeDigits = new s_string();
  }
  this.$$childElementFunctions[ "BarcodeDigits" ] = s_string;
  this.$$elementChildren.push( "BarcodeDigits" );
  this.$$minOccurs[ "CarrierRoute" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.CarrierRoute = new s_string();
  }
  this.$$childElementFunctions[ "CarrierRoute" ] = s_string;
  this.$$elementChildren.push( "CarrierRoute" );
  this.$$minOccurs[ "CongressCode" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.CongressCode = new s_string();
  }
  this.$$childElementFunctions[ "CongressCode" ] = s_string;
  this.$$elementChildren.push( "CongressCode" );
  this.$$minOccurs[ "CountyCode" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.CountyCode = new s_string();
  }
  this.$$childElementFunctions[ "CountyCode" ] = s_string;
  this.$$elementChildren.push( "CountyCode" );
  this.$$minOccurs[ "CountyName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.CountyName = new s_string();
  }
  this.$$childElementFunctions[ "CountyName" ] = s_string;
  this.$$elementChildren.push( "CountyName" );
  this.$$minOccurs[ "Fragment" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Fragment = new s_string();
  }
  this.$$childElementFunctions[ "Fragment" ] = s_string;
  this.$$elementChildren.push( "Fragment" );
  this.$$minOccurs[ "FragmentHouse" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentHouse = new s_string();
  }
  this.$$childElementFunctions[ "FragmentHouse" ] = s_string;
  this.$$elementChildren.push( "FragmentHouse" );
  this.$$minOccurs[ "FragmentPMBNumber" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentPMBNumber = new s_string();
  }
  this.$$childElementFunctions[ "FragmentPMBNumber" ] = s_string;
  this.$$elementChildren.push( "FragmentPMBNumber" );
  this.$$minOccurs[ "FragmentPMBPrefix" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentPMBPrefix = new s_string();
  }
  this.$$childElementFunctions[ "FragmentPMBPrefix" ] = s_string;
  this.$$elementChildren.push( "FragmentPMBPrefix" );
  this.$$minOccurs[ "FragmentPostDir" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentPostDir = new s_string();
  }
  this.$$childElementFunctions[ "FragmentPostDir" ] = s_string;
  this.$$elementChildren.push( "FragmentPostDir" );
  this.$$minOccurs[ "FragmentPreDir" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentPreDir = new s_string();
  }
  this.$$childElementFunctions[ "FragmentPreDir" ] = s_string;
  this.$$elementChildren.push( "FragmentPreDir" );
  this.$$minOccurs[ "FragmentStreet" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentStreet = new s_string();
  }
  this.$$childElementFunctions[ "FragmentStreet" ] = s_string;
  this.$$elementChildren.push( "FragmentStreet" );
  this.$$minOccurs[ "FragmentSuffix" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentSuffix = new s_string();
  }
  this.$$childElementFunctions[ "FragmentSuffix" ] = s_string;
  this.$$elementChildren.push( "FragmentSuffix" );
  this.$$minOccurs[ "FragmentUnit" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentUnit = new s_string();
  }
  this.$$childElementFunctions[ "FragmentUnit" ] = s_string;
  this.$$elementChildren.push( "FragmentUnit" );
  this.$$minOccurs[ "Source" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Source = new s_string();
  }
  this.$$childElementFunctions[ "Source" ] = s_string;
  this.$$elementChildren.push( "Source" );
  this.$$minOccurs[ "Error" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Error = new FragmentAddress_Err();
  }
  this.$$childElementFunctions[ "Error" ] = FragmentAddress_Err;
  this.$$elementChildren.push( "Error" );
}

function ValidateAddressType(  ) 
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
  this.$$name = "ValidateAddressType";
  this.$$xmlNames[ "ValidateAddressType" ] = "ValidateAddressType";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
  this.$$minOccurs[ "Address" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Address = new s_string();
  }
  this.$$childElementFunctions[ "Address" ] = s_string;
  this.$$elementChildren.push( "Address" );
  this.$$minOccurs[ "Address2" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Address2 = new s_string();
  }
  this.$$childElementFunctions[ "Address2" ] = s_string;
  this.$$elementChildren.push( "Address2" );
  this.$$minOccurs[ "City" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.City = new s_string();
  }
  this.$$childElementFunctions[ "City" ] = s_string;
  this.$$elementChildren.push( "City" );
  this.$$minOccurs[ "State" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.State = new s_string();
  }
  this.$$childElementFunctions[ "State" ] = s_string;
  this.$$elementChildren.push( "State" );
  this.$$minOccurs[ "PostalCode" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.PostalCode = new s_string();
  }
  this.$$childElementFunctions[ "PostalCode" ] = s_string;
  this.$$elementChildren.push( "PostalCode" );
  this.$$minOccurs[ "LicenseKey" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.LicenseKey = new s_string();
  }
  this.$$childElementFunctions[ "LicenseKey" ] = s_string;
  this.$$elementChildren.push( "LicenseKey" );
}

function ValidateAddressTypeResponse(  ) 
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
  this.$$name = "ValidateAddressTypeResponse";
  this.$$xmlNames[ "ValidateAddressTypeResponse" ] = "ValidateAddressTypeResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "ValidateAddressTypeResult" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ValidateAddressTypeResult = new AddressType();
  }
  this.$$childElementFunctions[ "ValidateAddressTypeResult" ] = AddressType;
  this.$$elementChildren.push( "ValidateAddressTypeResult" );
}

function AddressType(  ) 
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
  this.$$name = "AddressType";
  this.$$xmlNames[ "AddressType" ] = "AddressType";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "AddressType" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.AddressType = new s_string();
  }
  this.$$childElementFunctions[ "AddressType" ] = s_string;
  this.$$elementChildren.push( "AddressType" );
  this.$$minOccurs[ "AddressTypeDescription" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.AddressTypeDescription = new s_string();
  }
  this.$$childElementFunctions[ "AddressTypeDescription" ] = s_string;
  this.$$elementChildren.push( "AddressTypeDescription" );
  this.$$minOccurs[ "Error" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Error = new AddressType_Err();
  }
  this.$$childElementFunctions[ "Error" ] = AddressType_Err;
  this.$$elementChildren.push( "Error" );
}

function AddressType_Err(  ) 
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
  this.$$name = "AddressType_Err";
  this.$$xmlNames[ "AddressType_Err" ] = "Error";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "Desc" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Desc = new s_string();
  }
  this.$$childElementFunctions[ "Desc" ] = s_string;
  this.$$elementChildren.push( "Desc" );
  this.$$minOccurs[ "Number" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Number = new s_string();
  }
  this.$$childElementFunctions[ "Number" ] = s_string;
  this.$$elementChildren.push( "Number" );
  this.$$minOccurs[ "Location" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Location = new s_string();
  }
  this.$$childElementFunctions[ "Location" ] = s_string;
  this.$$elementChildren.push( "Location" );
}

function ValidateAddressSingleLine(  ) 
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
  this.$$name = "ValidateAddressSingleLine";
  this.$$xmlNames[ "ValidateAddressSingleLine" ] = "ValidateAddressSingleLine";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
  this.$$minOccurs[ "Address" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Address = new s_string();
  }
  this.$$childElementFunctions[ "Address" ] = s_string;
  this.$$elementChildren.push( "Address" );
  this.$$minOccurs[ "LicenseKey" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.LicenseKey = new s_string();
  }
  this.$$childElementFunctions[ "LicenseKey" ] = s_string;
  this.$$elementChildren.push( "LicenseKey" );
}

function ValidateAddressSingleLineResponse(  ) 
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
  this.$$name = "ValidateAddressSingleLineResponse";
  this.$$xmlNames[ "ValidateAddressSingleLineResponse" ] = "ValidateAddressSingleLineResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "ValidateAddressSingleLineResult" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ValidateAddressSingleLineResult = new ValidateAddressSingleLineResponse_FragmentAddress();
  }
  this.$$childElementFunctions[ "ValidateAddressSingleLineResult" ] = ValidateAddressSingleLineResponse_FragmentAddress;
  this.$$elementChildren.push( "ValidateAddressSingleLineResult" );
}

function ValidateAddressSingleLineResponse_FragmentAddress(  ) 
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
  this.$$name = "ValidateAddressSingleLineResponse_FragmentAddress";
  this.$$xmlNames[ "ValidateAddressSingleLineResponse_FragmentAddress" ] = "ValidateAddressSingleLineResult";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "Address" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Address = new s_string();
  }
  this.$$childElementFunctions[ "Address" ] = s_string;
  this.$$elementChildren.push( "Address" );
  this.$$minOccurs[ "City" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.City = new s_string();
  }
  this.$$childElementFunctions[ "City" ] = s_string;
  this.$$elementChildren.push( "City" );
  this.$$minOccurs[ "State" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.State = new s_string();
  }
  this.$$childElementFunctions[ "State" ] = s_string;
  this.$$elementChildren.push( "State" );
  this.$$minOccurs[ "Zip" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Zip = new s_string();
  }
  this.$$childElementFunctions[ "Zip" ] = s_string;
  this.$$elementChildren.push( "Zip" );
  this.$$minOccurs[ "Address2" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Address2 = new s_string();
  }
  this.$$childElementFunctions[ "Address2" ] = s_string;
  this.$$elementChildren.push( "Address2" );
  this.$$minOccurs[ "BarcodeDigits" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.BarcodeDigits = new s_string();
  }
  this.$$childElementFunctions[ "BarcodeDigits" ] = s_string;
  this.$$elementChildren.push( "BarcodeDigits" );
  this.$$minOccurs[ "CarrierRoute" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.CarrierRoute = new s_string();
  }
  this.$$childElementFunctions[ "CarrierRoute" ] = s_string;
  this.$$elementChildren.push( "CarrierRoute" );
  this.$$minOccurs[ "CongressCode" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.CongressCode = new s_string();
  }
  this.$$childElementFunctions[ "CongressCode" ] = s_string;
  this.$$elementChildren.push( "CongressCode" );
  this.$$minOccurs[ "CountyCode" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.CountyCode = new s_string();
  }
  this.$$childElementFunctions[ "CountyCode" ] = s_string;
  this.$$elementChildren.push( "CountyCode" );
  this.$$minOccurs[ "CountyName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.CountyName = new s_string();
  }
  this.$$childElementFunctions[ "CountyName" ] = s_string;
  this.$$elementChildren.push( "CountyName" );
  this.$$minOccurs[ "Fragment" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Fragment = new s_string();
  }
  this.$$childElementFunctions[ "Fragment" ] = s_string;
  this.$$elementChildren.push( "Fragment" );
  this.$$minOccurs[ "FragmentHouse" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentHouse = new s_string();
  }
  this.$$childElementFunctions[ "FragmentHouse" ] = s_string;
  this.$$elementChildren.push( "FragmentHouse" );
  this.$$minOccurs[ "FragmentPMBNumber" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentPMBNumber = new s_string();
  }
  this.$$childElementFunctions[ "FragmentPMBNumber" ] = s_string;
  this.$$elementChildren.push( "FragmentPMBNumber" );
  this.$$minOccurs[ "FragmentPMBPrefix" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentPMBPrefix = new s_string();
  }
  this.$$childElementFunctions[ "FragmentPMBPrefix" ] = s_string;
  this.$$elementChildren.push( "FragmentPMBPrefix" );
  this.$$minOccurs[ "FragmentPostDir" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentPostDir = new s_string();
  }
  this.$$childElementFunctions[ "FragmentPostDir" ] = s_string;
  this.$$elementChildren.push( "FragmentPostDir" );
  this.$$minOccurs[ "FragmentPreDir" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentPreDir = new s_string();
  }
  this.$$childElementFunctions[ "FragmentPreDir" ] = s_string;
  this.$$elementChildren.push( "FragmentPreDir" );
  this.$$minOccurs[ "FragmentStreet" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentStreet = new s_string();
  }
  this.$$childElementFunctions[ "FragmentStreet" ] = s_string;
  this.$$elementChildren.push( "FragmentStreet" );
  this.$$minOccurs[ "FragmentSuffix" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentSuffix = new s_string();
  }
  this.$$childElementFunctions[ "FragmentSuffix" ] = s_string;
  this.$$elementChildren.push( "FragmentSuffix" );
  this.$$minOccurs[ "FragmentUnit" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentUnit = new s_string();
  }
  this.$$childElementFunctions[ "FragmentUnit" ] = s_string;
  this.$$elementChildren.push( "FragmentUnit" );
  this.$$minOccurs[ "Source" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Source = new s_string();
  }
  this.$$childElementFunctions[ "Source" ] = s_string;
  this.$$elementChildren.push( "Source" );
  this.$$minOccurs[ "Error" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Error = new FragmentAddress_Err();
  }
  this.$$childElementFunctions[ "Error" ] = FragmentAddress_Err;
  this.$$elementChildren.push( "Error" );
}

function ValidateCityStateZip(  ) 
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
  this.$$name = "ValidateCityStateZip";
  this.$$xmlNames[ "ValidateCityStateZip" ] = "ValidateCityStateZip";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
  this.$$minOccurs[ "City" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.City = new s_string();
  }
  this.$$childElementFunctions[ "City" ] = s_string;
  this.$$elementChildren.push( "City" );
  this.$$minOccurs[ "State" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.State = new s_string();
  }
  this.$$childElementFunctions[ "State" ] = s_string;
  this.$$elementChildren.push( "State" );
  this.$$minOccurs[ "PostalCode" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.PostalCode = new s_string();
  }
  this.$$childElementFunctions[ "PostalCode" ] = s_string;
  this.$$elementChildren.push( "PostalCode" );
  this.$$minOccurs[ "LicenseKey" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.LicenseKey = new s_string();
  }
  this.$$childElementFunctions[ "LicenseKey" ] = s_string;
  this.$$elementChildren.push( "LicenseKey" );
}

function ValidateCityStateZipResponse(  ) 
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
  this.$$name = "ValidateCityStateZipResponse";
  this.$$xmlNames[ "ValidateCityStateZipResponse" ] = "ValidateCityStateZipResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "ValidateCityStateZipResult" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ValidateCityStateZipResult = new AreaAddress();
  }
  this.$$childElementFunctions[ "ValidateCityStateZipResult" ] = AreaAddress;
  this.$$elementChildren.push( "ValidateCityStateZipResult" );
}

function AreaAddress(  ) 
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
  this.$$name = "AreaAddress";
  this.$$xmlNames[ "AreaAddress" ] = "AreaAddress";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "City" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.City = new s_string();
  }
  this.$$childElementFunctions[ "City" ] = s_string;
  this.$$elementChildren.push( "City" );
  this.$$minOccurs[ "State" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.State = new s_string();
  }
  this.$$childElementFunctions[ "State" ] = s_string;
  this.$$elementChildren.push( "State" );
  this.$$minOccurs[ "PostalCode" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.PostalCode = new s_string();
  }
  this.$$childElementFunctions[ "PostalCode" ] = s_string;
  this.$$elementChildren.push( "PostalCode" );
  this.$$minOccurs[ "PostalCodeFound" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.PostalCodeFound = new s_string();
  }
  this.$$childElementFunctions[ "PostalCodeFound" ] = s_string;
  this.$$elementChildren.push( "PostalCodeFound" );
  this.$$minOccurs[ "Error" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Error = new AreaAddress_Err();
  }
  this.$$childElementFunctions[ "Error" ] = AreaAddress_Err;
  this.$$elementChildren.push( "Error" );
}

function AreaAddress_Err(  ) 
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
  this.$$name = "AreaAddress_Err";
  this.$$xmlNames[ "AreaAddress_Err" ] = "Error";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "Desc" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Desc = new s_string();
  }
  this.$$childElementFunctions[ "Desc" ] = s_string;
  this.$$elementChildren.push( "Desc" );
  this.$$minOccurs[ "Number" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Number = new s_string();
  }
  this.$$childElementFunctions[ "Number" ] = s_string;
  this.$$elementChildren.push( "Number" );
  this.$$minOccurs[ "Location" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Location = new s_string();
  }
  this.$$childElementFunctions[ "Location" ] = s_string;
  this.$$elementChildren.push( "Location" );
}

function ValidateAddressWithDPV(  ) 
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
  this.$$name = "ValidateAddressWithDPV";
  this.$$xmlNames[ "ValidateAddressWithDPV" ] = "ValidateAddressWithDPV";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
  this.$$minOccurs[ "Address" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Address = new s_string();
  }
  this.$$childElementFunctions[ "Address" ] = s_string;
  this.$$elementChildren.push( "Address" );
  this.$$minOccurs[ "Address2" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Address2 = new s_string();
  }
  this.$$childElementFunctions[ "Address2" ] = s_string;
  this.$$elementChildren.push( "Address2" );
  this.$$minOccurs[ "City" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.City = new s_string();
  }
  this.$$childElementFunctions[ "City" ] = s_string;
  this.$$elementChildren.push( "City" );
  this.$$minOccurs[ "State" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.State = new s_string();
  }
  this.$$childElementFunctions[ "State" ] = s_string;
  this.$$elementChildren.push( "State" );
  this.$$minOccurs[ "PostalCode" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.PostalCode = new s_string();
  }
  this.$$childElementFunctions[ "PostalCode" ] = s_string;
  this.$$elementChildren.push( "PostalCode" );
  this.$$minOccurs[ "LicenseKey" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.LicenseKey = new s_string();
  }
  this.$$childElementFunctions[ "LicenseKey" ] = s_string;
  this.$$elementChildren.push( "LicenseKey" );
}

function ValidateAddressWithDPVResponse(  ) 
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
  this.$$name = "ValidateAddressWithDPVResponse";
  this.$$xmlNames[ "ValidateAddressWithDPVResponse" ] = "ValidateAddressWithDPVResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "ValidateAddressWithDPVResult" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ValidateAddressWithDPVResult = new DPVAddress();
  }
  this.$$childElementFunctions[ "ValidateAddressWithDPVResult" ] = DPVAddress;
  this.$$elementChildren.push( "ValidateAddressWithDPVResult" );
}

function DPVAddress(  ) 
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
  this.$$name = "DPVAddress";
  this.$$xmlNames[ "DPVAddress" ] = "DPVAddress";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "Address" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Address = new s_string();
  }
  this.$$childElementFunctions[ "Address" ] = s_string;
  this.$$elementChildren.push( "Address" );
  this.$$minOccurs[ "City" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.City = new s_string();
  }
  this.$$childElementFunctions[ "City" ] = s_string;
  this.$$elementChildren.push( "City" );
  this.$$minOccurs[ "State" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.State = new s_string();
  }
  this.$$childElementFunctions[ "State" ] = s_string;
  this.$$elementChildren.push( "State" );
  this.$$minOccurs[ "Zip" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Zip = new s_string();
  }
  this.$$childElementFunctions[ "Zip" ] = s_string;
  this.$$elementChildren.push( "Zip" );
  this.$$minOccurs[ "Address2" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Address2 = new s_string();
  }
  this.$$childElementFunctions[ "Address2" ] = s_string;
  this.$$elementChildren.push( "Address2" );
  this.$$minOccurs[ "BarcodeDigits" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.BarcodeDigits = new s_string();
  }
  this.$$childElementFunctions[ "BarcodeDigits" ] = s_string;
  this.$$elementChildren.push( "BarcodeDigits" );
  this.$$minOccurs[ "CarrierRoute" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.CarrierRoute = new s_string();
  }
  this.$$childElementFunctions[ "CarrierRoute" ] = s_string;
  this.$$elementChildren.push( "CarrierRoute" );
  this.$$minOccurs[ "CongressCode" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.CongressCode = new s_string();
  }
  this.$$childElementFunctions[ "CongressCode" ] = s_string;
  this.$$elementChildren.push( "CongressCode" );
  this.$$minOccurs[ "CountyCode" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.CountyCode = new s_string();
  }
  this.$$childElementFunctions[ "CountyCode" ] = s_string;
  this.$$elementChildren.push( "CountyCode" );
  this.$$minOccurs[ "CountyName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.CountyName = new s_string();
  }
  this.$$childElementFunctions[ "CountyName" ] = s_string;
  this.$$elementChildren.push( "CountyName" );
  this.$$minOccurs[ "Fragment" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Fragment = new s_string();
  }
  this.$$childElementFunctions[ "Fragment" ] = s_string;
  this.$$elementChildren.push( "Fragment" );
  this.$$minOccurs[ "FragmentHouse" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentHouse = new s_string();
  }
  this.$$childElementFunctions[ "FragmentHouse" ] = s_string;
  this.$$elementChildren.push( "FragmentHouse" );
  this.$$minOccurs[ "FragmentPMBNumber" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentPMBNumber = new s_string();
  }
  this.$$childElementFunctions[ "FragmentPMBNumber" ] = s_string;
  this.$$elementChildren.push( "FragmentPMBNumber" );
  this.$$minOccurs[ "FragmentPMBPrefix" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentPMBPrefix = new s_string();
  }
  this.$$childElementFunctions[ "FragmentPMBPrefix" ] = s_string;
  this.$$elementChildren.push( "FragmentPMBPrefix" );
  this.$$minOccurs[ "FragmentPostDir" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentPostDir = new s_string();
  }
  this.$$childElementFunctions[ "FragmentPostDir" ] = s_string;
  this.$$elementChildren.push( "FragmentPostDir" );
  this.$$minOccurs[ "FragmentPreDir" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentPreDir = new s_string();
  }
  this.$$childElementFunctions[ "FragmentPreDir" ] = s_string;
  this.$$elementChildren.push( "FragmentPreDir" );
  this.$$minOccurs[ "FragmentStreet" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentStreet = new s_string();
  }
  this.$$childElementFunctions[ "FragmentStreet" ] = s_string;
  this.$$elementChildren.push( "FragmentStreet" );
  this.$$minOccurs[ "FragmentSuffix" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentSuffix = new s_string();
  }
  this.$$childElementFunctions[ "FragmentSuffix" ] = s_string;
  this.$$elementChildren.push( "FragmentSuffix" );
  this.$$minOccurs[ "FragmentUnit" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentUnit = new s_string();
  }
  this.$$childElementFunctions[ "FragmentUnit" ] = s_string;
  this.$$elementChildren.push( "FragmentUnit" );
  this.$$minOccurs[ "Source" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Source = new s_string();
  }
  this.$$childElementFunctions[ "Source" ] = s_string;
  this.$$elementChildren.push( "Source" );
  this.$$minOccurs[ "DPV" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.DPV = new s_string();
  }
  this.$$childElementFunctions[ "DPV" ] = s_string;
  this.$$elementChildren.push( "DPV" );
  this.$$minOccurs[ "DPVDesc" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.DPVDesc = new s_string();
  }
  this.$$childElementFunctions[ "DPVDesc" ] = s_string;
  this.$$elementChildren.push( "DPVDesc" );
  this.$$minOccurs[ "DPVNotes" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.DPVNotes = new s_string();
  }
  this.$$childElementFunctions[ "DPVNotes" ] = s_string;
  this.$$elementChildren.push( "DPVNotes" );
  this.$$minOccurs[ "DPVNotesDesc" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.DPVNotesDesc = new s_string();
  }
  this.$$childElementFunctions[ "DPVNotesDesc" ] = s_string;
  this.$$elementChildren.push( "DPVNotesDesc" );
  this.$$minOccurs[ "Corrections" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Corrections = new s_string();
  }
  this.$$childElementFunctions[ "Corrections" ] = s_string;
  this.$$elementChildren.push( "Corrections" );
  this.$$minOccurs[ "CorrectionsDesc" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.CorrectionsDesc = new s_string();
  }
  this.$$childElementFunctions[ "CorrectionsDesc" ] = s_string;
  this.$$elementChildren.push( "CorrectionsDesc" );
  this.$$minOccurs[ "Error" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Error = new DPVAddress_Err();
  }
  this.$$childElementFunctions[ "Error" ] = DPVAddress_Err;
  this.$$elementChildren.push( "Error" );
}

function DPVAddress_Err(  ) 
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
  this.$$name = "DPVAddress_Err";
  this.$$xmlNames[ "DPVAddress_Err" ] = "Error";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "Desc" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Desc = new s_string();
  }
  this.$$childElementFunctions[ "Desc" ] = s_string;
  this.$$elementChildren.push( "Desc" );
  this.$$minOccurs[ "Number" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Number = new s_string();
  }
  this.$$childElementFunctions[ "Number" ] = s_string;
  this.$$elementChildren.push( "Number" );
  this.$$minOccurs[ "Location" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Location = new s_string();
  }
  this.$$childElementFunctions[ "Location" ] = s_string;
  this.$$elementChildren.push( "Location" );
}

function ValidateAddressWithSuiteLink(  ) 
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
  this.$$name = "ValidateAddressWithSuiteLink";
  this.$$xmlNames[ "ValidateAddressWithSuiteLink" ] = "ValidateAddressWithSuiteLink";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
  this.$$minOccurs[ "BusinessName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.BusinessName = new s_string();
  }
  this.$$childElementFunctions[ "BusinessName" ] = s_string;
  this.$$elementChildren.push( "BusinessName" );
  this.$$minOccurs[ "Address" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Address = new s_string();
  }
  this.$$childElementFunctions[ "Address" ] = s_string;
  this.$$elementChildren.push( "Address" );
  this.$$minOccurs[ "Address2" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Address2 = new s_string();
  }
  this.$$childElementFunctions[ "Address2" ] = s_string;
  this.$$elementChildren.push( "Address2" );
  this.$$minOccurs[ "City" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.City = new s_string();
  }
  this.$$childElementFunctions[ "City" ] = s_string;
  this.$$elementChildren.push( "City" );
  this.$$minOccurs[ "State" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.State = new s_string();
  }
  this.$$childElementFunctions[ "State" ] = s_string;
  this.$$elementChildren.push( "State" );
  this.$$minOccurs[ "PostalCode" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.PostalCode = new s_string();
  }
  this.$$childElementFunctions[ "PostalCode" ] = s_string;
  this.$$elementChildren.push( "PostalCode" );
  this.$$minOccurs[ "LicenseKey" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.LicenseKey = new s_string();
  }
  this.$$childElementFunctions[ "LicenseKey" ] = s_string;
  this.$$elementChildren.push( "LicenseKey" );
}

function ValidateAddressWithSuiteLinkResponse(  ) 
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
  this.$$name = "ValidateAddressWithSuiteLinkResponse";
  this.$$xmlNames[ "ValidateAddressWithSuiteLinkResponse" ] = "ValidateAddressWithSuiteLinkResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "ValidateAddressWithSuiteLinkResult" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ValidateAddressWithSuiteLinkResult = new ValidateAddressWithSuiteLinkResponse_DPVAddress();
  }
  this.$$childElementFunctions[ "ValidateAddressWithSuiteLinkResult" ] = ValidateAddressWithSuiteLinkResponse_DPVAddress;
  this.$$elementChildren.push( "ValidateAddressWithSuiteLinkResult" );
}

function ValidateAddressWithSuiteLinkResponse_DPVAddress(  ) 
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
  this.$$name = "ValidateAddressWithSuiteLinkResponse_DPVAddress";
  this.$$xmlNames[ "ValidateAddressWithSuiteLinkResponse_DPVAddress" ] = "ValidateAddressWithSuiteLinkResult";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "Address" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Address = new s_string();
  }
  this.$$childElementFunctions[ "Address" ] = s_string;
  this.$$elementChildren.push( "Address" );
  this.$$minOccurs[ "City" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.City = new s_string();
  }
  this.$$childElementFunctions[ "City" ] = s_string;
  this.$$elementChildren.push( "City" );
  this.$$minOccurs[ "State" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.State = new s_string();
  }
  this.$$childElementFunctions[ "State" ] = s_string;
  this.$$elementChildren.push( "State" );
  this.$$minOccurs[ "Zip" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Zip = new s_string();
  }
  this.$$childElementFunctions[ "Zip" ] = s_string;
  this.$$elementChildren.push( "Zip" );
  this.$$minOccurs[ "Address2" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Address2 = new s_string();
  }
  this.$$childElementFunctions[ "Address2" ] = s_string;
  this.$$elementChildren.push( "Address2" );
  this.$$minOccurs[ "BarcodeDigits" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.BarcodeDigits = new s_string();
  }
  this.$$childElementFunctions[ "BarcodeDigits" ] = s_string;
  this.$$elementChildren.push( "BarcodeDigits" );
  this.$$minOccurs[ "CarrierRoute" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.CarrierRoute = new s_string();
  }
  this.$$childElementFunctions[ "CarrierRoute" ] = s_string;
  this.$$elementChildren.push( "CarrierRoute" );
  this.$$minOccurs[ "CongressCode" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.CongressCode = new s_string();
  }
  this.$$childElementFunctions[ "CongressCode" ] = s_string;
  this.$$elementChildren.push( "CongressCode" );
  this.$$minOccurs[ "CountyCode" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.CountyCode = new s_string();
  }
  this.$$childElementFunctions[ "CountyCode" ] = s_string;
  this.$$elementChildren.push( "CountyCode" );
  this.$$minOccurs[ "CountyName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.CountyName = new s_string();
  }
  this.$$childElementFunctions[ "CountyName" ] = s_string;
  this.$$elementChildren.push( "CountyName" );
  this.$$minOccurs[ "Fragment" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Fragment = new s_string();
  }
  this.$$childElementFunctions[ "Fragment" ] = s_string;
  this.$$elementChildren.push( "Fragment" );
  this.$$minOccurs[ "FragmentHouse" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentHouse = new s_string();
  }
  this.$$childElementFunctions[ "FragmentHouse" ] = s_string;
  this.$$elementChildren.push( "FragmentHouse" );
  this.$$minOccurs[ "FragmentPMBNumber" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentPMBNumber = new s_string();
  }
  this.$$childElementFunctions[ "FragmentPMBNumber" ] = s_string;
  this.$$elementChildren.push( "FragmentPMBNumber" );
  this.$$minOccurs[ "FragmentPMBPrefix" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentPMBPrefix = new s_string();
  }
  this.$$childElementFunctions[ "FragmentPMBPrefix" ] = s_string;
  this.$$elementChildren.push( "FragmentPMBPrefix" );
  this.$$minOccurs[ "FragmentPostDir" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentPostDir = new s_string();
  }
  this.$$childElementFunctions[ "FragmentPostDir" ] = s_string;
  this.$$elementChildren.push( "FragmentPostDir" );
  this.$$minOccurs[ "FragmentPreDir" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentPreDir = new s_string();
  }
  this.$$childElementFunctions[ "FragmentPreDir" ] = s_string;
  this.$$elementChildren.push( "FragmentPreDir" );
  this.$$minOccurs[ "FragmentStreet" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentStreet = new s_string();
  }
  this.$$childElementFunctions[ "FragmentStreet" ] = s_string;
  this.$$elementChildren.push( "FragmentStreet" );
  this.$$minOccurs[ "FragmentSuffix" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentSuffix = new s_string();
  }
  this.$$childElementFunctions[ "FragmentSuffix" ] = s_string;
  this.$$elementChildren.push( "FragmentSuffix" );
  this.$$minOccurs[ "FragmentUnit" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentUnit = new s_string();
  }
  this.$$childElementFunctions[ "FragmentUnit" ] = s_string;
  this.$$elementChildren.push( "FragmentUnit" );
  this.$$minOccurs[ "Source" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Source = new s_string();
  }
  this.$$childElementFunctions[ "Source" ] = s_string;
  this.$$elementChildren.push( "Source" );
  this.$$minOccurs[ "DPV" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.DPV = new s_string();
  }
  this.$$childElementFunctions[ "DPV" ] = s_string;
  this.$$elementChildren.push( "DPV" );
  this.$$minOccurs[ "DPVDesc" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.DPVDesc = new s_string();
  }
  this.$$childElementFunctions[ "DPVDesc" ] = s_string;
  this.$$elementChildren.push( "DPVDesc" );
  this.$$minOccurs[ "DPVNotes" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.DPVNotes = new s_string();
  }
  this.$$childElementFunctions[ "DPVNotes" ] = s_string;
  this.$$elementChildren.push( "DPVNotes" );
  this.$$minOccurs[ "DPVNotesDesc" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.DPVNotesDesc = new s_string();
  }
  this.$$childElementFunctions[ "DPVNotesDesc" ] = s_string;
  this.$$elementChildren.push( "DPVNotesDesc" );
  this.$$minOccurs[ "Corrections" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Corrections = new s_string();
  }
  this.$$childElementFunctions[ "Corrections" ] = s_string;
  this.$$elementChildren.push( "Corrections" );
  this.$$minOccurs[ "CorrectionsDesc" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.CorrectionsDesc = new s_string();
  }
  this.$$childElementFunctions[ "CorrectionsDesc" ] = s_string;
  this.$$elementChildren.push( "CorrectionsDesc" );
  this.$$minOccurs[ "Error" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Error = new DPVAddress_Err();
  }
  this.$$childElementFunctions[ "Error" ] = DPVAddress_Err;
  this.$$elementChildren.push( "Error" );
}

function ValidateAddressWithRDI(  ) 
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
  this.$$name = "ValidateAddressWithRDI";
  this.$$xmlNames[ "ValidateAddressWithRDI" ] = "ValidateAddressWithRDI";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
  this.$$minOccurs[ "Address" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Address = new s_string();
  }
  this.$$childElementFunctions[ "Address" ] = s_string;
  this.$$elementChildren.push( "Address" );
  this.$$minOccurs[ "Address2" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Address2 = new s_string();
  }
  this.$$childElementFunctions[ "Address2" ] = s_string;
  this.$$elementChildren.push( "Address2" );
  this.$$minOccurs[ "City" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.City = new s_string();
  }
  this.$$childElementFunctions[ "City" ] = s_string;
  this.$$elementChildren.push( "City" );
  this.$$minOccurs[ "State" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.State = new s_string();
  }
  this.$$childElementFunctions[ "State" ] = s_string;
  this.$$elementChildren.push( "State" );
  this.$$minOccurs[ "PostalCode" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.PostalCode = new s_string();
  }
  this.$$childElementFunctions[ "PostalCode" ] = s_string;
  this.$$elementChildren.push( "PostalCode" );
  this.$$minOccurs[ "LicenseKey" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.LicenseKey = new s_string();
  }
  this.$$childElementFunctions[ "LicenseKey" ] = s_string;
  this.$$elementChildren.push( "LicenseKey" );
}

function ValidateAddressWithRDIResponse(  ) 
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
  this.$$name = "ValidateAddressWithRDIResponse";
  this.$$xmlNames[ "ValidateAddressWithRDIResponse" ] = "ValidateAddressWithRDIResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "ValidateAddressWithRDIResult" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ValidateAddressWithRDIResult = new RDIAddress();
  }
  this.$$childElementFunctions[ "ValidateAddressWithRDIResult" ] = RDIAddress;
  this.$$elementChildren.push( "ValidateAddressWithRDIResult" );
}

function RDIAddress(  ) 
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
  this.$$name = "RDIAddress";
  this.$$xmlNames[ "RDIAddress" ] = "RDIAddress";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "Address" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Address = new s_string();
  }
  this.$$childElementFunctions[ "Address" ] = s_string;
  this.$$elementChildren.push( "Address" );
  this.$$minOccurs[ "City" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.City = new s_string();
  }
  this.$$childElementFunctions[ "City" ] = s_string;
  this.$$elementChildren.push( "City" );
  this.$$minOccurs[ "State" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.State = new s_string();
  }
  this.$$childElementFunctions[ "State" ] = s_string;
  this.$$elementChildren.push( "State" );
  this.$$minOccurs[ "Zip" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Zip = new s_string();
  }
  this.$$childElementFunctions[ "Zip" ] = s_string;
  this.$$elementChildren.push( "Zip" );
  this.$$minOccurs[ "Address2" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Address2 = new s_string();
  }
  this.$$childElementFunctions[ "Address2" ] = s_string;
  this.$$elementChildren.push( "Address2" );
  this.$$minOccurs[ "IsResidential" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.IsResidential = new s_string();
  }
  this.$$childElementFunctions[ "IsResidential" ] = s_string;
  this.$$elementChildren.push( "IsResidential" );
  this.$$minOccurs[ "BarcodeDigits" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.BarcodeDigits = new s_string();
  }
  this.$$childElementFunctions[ "BarcodeDigits" ] = s_string;
  this.$$elementChildren.push( "BarcodeDigits" );
  this.$$minOccurs[ "CarrierRoute" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.CarrierRoute = new s_string();
  }
  this.$$childElementFunctions[ "CarrierRoute" ] = s_string;
  this.$$elementChildren.push( "CarrierRoute" );
  this.$$minOccurs[ "CongressCode" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.CongressCode = new s_string();
  }
  this.$$childElementFunctions[ "CongressCode" ] = s_string;
  this.$$elementChildren.push( "CongressCode" );
  this.$$minOccurs[ "CountyCode" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.CountyCode = new s_string();
  }
  this.$$childElementFunctions[ "CountyCode" ] = s_string;
  this.$$elementChildren.push( "CountyCode" );
  this.$$minOccurs[ "CountyName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.CountyName = new s_string();
  }
  this.$$childElementFunctions[ "CountyName" ] = s_string;
  this.$$elementChildren.push( "CountyName" );
  this.$$minOccurs[ "Fragment" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Fragment = new s_string();
  }
  this.$$childElementFunctions[ "Fragment" ] = s_string;
  this.$$elementChildren.push( "Fragment" );
  this.$$minOccurs[ "FragmentHouse" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentHouse = new s_string();
  }
  this.$$childElementFunctions[ "FragmentHouse" ] = s_string;
  this.$$elementChildren.push( "FragmentHouse" );
  this.$$minOccurs[ "FragmentPMBNumber" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentPMBNumber = new s_string();
  }
  this.$$childElementFunctions[ "FragmentPMBNumber" ] = s_string;
  this.$$elementChildren.push( "FragmentPMBNumber" );
  this.$$minOccurs[ "FragmentPMBPrefix" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentPMBPrefix = new s_string();
  }
  this.$$childElementFunctions[ "FragmentPMBPrefix" ] = s_string;
  this.$$elementChildren.push( "FragmentPMBPrefix" );
  this.$$minOccurs[ "FragmentPostDir" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentPostDir = new s_string();
  }
  this.$$childElementFunctions[ "FragmentPostDir" ] = s_string;
  this.$$elementChildren.push( "FragmentPostDir" );
  this.$$minOccurs[ "FragmentPreDir" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentPreDir = new s_string();
  }
  this.$$childElementFunctions[ "FragmentPreDir" ] = s_string;
  this.$$elementChildren.push( "FragmentPreDir" );
  this.$$minOccurs[ "FragmentStreet" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentStreet = new s_string();
  }
  this.$$childElementFunctions[ "FragmentStreet" ] = s_string;
  this.$$elementChildren.push( "FragmentStreet" );
  this.$$minOccurs[ "FragmentSuffix" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentSuffix = new s_string();
  }
  this.$$childElementFunctions[ "FragmentSuffix" ] = s_string;
  this.$$elementChildren.push( "FragmentSuffix" );
  this.$$minOccurs[ "FragmentUnit" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FragmentUnit = new s_string();
  }
  this.$$childElementFunctions[ "FragmentUnit" ] = s_string;
  this.$$elementChildren.push( "FragmentUnit" );
  this.$$minOccurs[ "Source" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Source = new s_string();
  }
  this.$$childElementFunctions[ "Source" ] = s_string;
  this.$$elementChildren.push( "Source" );
  this.$$minOccurs[ "DPV" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.DPV = new s_string();
  }
  this.$$childElementFunctions[ "DPV" ] = s_string;
  this.$$elementChildren.push( "DPV" );
  this.$$minOccurs[ "DPVDesc" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.DPVDesc = new s_string();
  }
  this.$$childElementFunctions[ "DPVDesc" ] = s_string;
  this.$$elementChildren.push( "DPVDesc" );
  this.$$minOccurs[ "DPVNotes" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.DPVNotes = new s_string();
  }
  this.$$childElementFunctions[ "DPVNotes" ] = s_string;
  this.$$elementChildren.push( "DPVNotes" );
  this.$$minOccurs[ "DPVNotesDesc" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.DPVNotesDesc = new s_string();
  }
  this.$$childElementFunctions[ "DPVNotesDesc" ] = s_string;
  this.$$elementChildren.push( "DPVNotesDesc" );
  this.$$minOccurs[ "Corrections" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Corrections = new s_string();
  }
  this.$$childElementFunctions[ "Corrections" ] = s_string;
  this.$$elementChildren.push( "Corrections" );
  this.$$minOccurs[ "CorrectionsDesc" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.CorrectionsDesc = new s_string();
  }
  this.$$childElementFunctions[ "CorrectionsDesc" ] = s_string;
  this.$$elementChildren.push( "CorrectionsDesc" );
  this.$$minOccurs[ "Error" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Error = new RDIAddress_Err();
  }
  this.$$childElementFunctions[ "Error" ] = RDIAddress_Err;
  this.$$elementChildren.push( "Error" );
  this.$$minOccurs[ "Debug" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Debug = new s_string();
  }
  this.$$childElementFunctions[ "Debug" ] = s_string;
  this.$$elementChildren.push( "Debug" );
}

function RDIAddress_Err(  ) 
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
  this.$$name = "RDIAddress_Err";
  this.$$xmlNames[ "RDIAddress_Err" ] = "Error";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "Desc" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Desc = new s_string();
  }
  this.$$childElementFunctions[ "Desc" ] = s_string;
  this.$$elementChildren.push( "Desc" );
  this.$$minOccurs[ "Number" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Number = new s_string();
  }
  this.$$childElementFunctions[ "Number" ] = s_string;
  this.$$elementChildren.push( "Number" );
  this.$$minOccurs[ "Location" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Location = new s_string();
  }
  this.$$childElementFunctions[ "Location" ] = s_string;
  this.$$elementChildren.push( "Location" );
}

function ValidateAddressSoapIn( val ) 
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
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
}

function ValidateAddressSoapOut( val ) 
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
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
}

function ValidateAddressWithFragmentsSoapIn( val ) 
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
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
}

function ValidateAddressWithFragmentsSoapOut( val ) 
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
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
}

function ParseAddressSoapIn( val ) 
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
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
}

function ParseAddressSoapOut( val ) 
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
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
}

function ValidateAddressWithExtrasSoapIn( val ) 
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
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
}

function ValidateAddressWithExtrasSoapOut( val ) 
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
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
}

function GetPossibleMatchesSoapIn( val ) 
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
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
}

function GetPossibleMatchesSoapOut( val ) 
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
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
}

function ValidateAddressTypeSoapIn( val ) 
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
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
}

function ValidateAddressTypeSoapOut( val ) 
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
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
}

function ValidateAddressSingleLineSoapIn( val ) 
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
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
}

function ValidateAddressSingleLineSoapOut( val ) 
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
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
}

function ValidateCityStateZipSoapIn( val ) 
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
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
}

function ValidateCityStateZipSoapOut( val ) 
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
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
}

function ValidateAddressWithDPVSoapIn( val ) 
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
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
}

function ValidateAddressWithDPVSoapOut( val ) 
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
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
}

function ValidateAddressWithSuiteLinkSoapIn( val ) 
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
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
}

function ValidateAddressWithSuiteLinkSoapOut( val ) 
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
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
}

function ValidateAddressWithRDISoapIn( val ) 
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
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
}

function ValidateAddressWithRDISoapOut( val ) 
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
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
}

function ValidateAddressHttpGetIn(  ) 
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
  this.$$name = "ValidateAddressHttpGetIn";
  this.$$xmlNames[ "ValidateAddressHttpGetIn" ] = "ValidateAddressHttpGetIn";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
  if ( this.$$deserializing == undefined )
  {
  this.Address = new s_string();
  }
  this.$$childElementFunctions[ "Address" ] = s_string;
  this.$$elementChildren.push( "Address" );
  if ( this.$$deserializing == undefined )
  {
  this.City = new s_string();
  }
  this.$$childElementFunctions[ "City" ] = s_string;
  this.$$elementChildren.push( "City" );
  if ( this.$$deserializing == undefined )
  {
  this.State = new s_string();
  }
  this.$$childElementFunctions[ "State" ] = s_string;
  this.$$elementChildren.push( "State" );
  if ( this.$$deserializing == undefined )
  {
  this.PostalCode = new s_string();
  }
  this.$$childElementFunctions[ "PostalCode" ] = s_string;
  this.$$elementChildren.push( "PostalCode" );
  if ( this.$$deserializing == undefined )
  {
  this.LicenseKey = new s_string();
  }
  this.$$childElementFunctions[ "LicenseKey" ] = s_string;
  this.$$elementChildren.push( "LicenseKey" );
}

function ValidateAddressHttpGetOut( val ) 
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
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
}

function ValidateAddressWithFragmentsHttpGetIn(  ) 
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
  this.$$name = "ValidateAddressWithFragmentsHttpGetIn";
  this.$$xmlNames[ "ValidateAddressWithFragmentsHttpGetIn" ] = "ValidateAddressWithFragmentsHttpGetIn";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
  if ( this.$$deserializing == undefined )
  {
  this.Address = new s_string();
  }
  this.$$childElementFunctions[ "Address" ] = s_string;
  this.$$elementChildren.push( "Address" );
  if ( this.$$deserializing == undefined )
  {
  this.City = new s_string();
  }
  this.$$childElementFunctions[ "City" ] = s_string;
  this.$$elementChildren.push( "City" );
  if ( this.$$deserializing == undefined )
  {
  this.State = new s_string();
  }
  this.$$childElementFunctions[ "State" ] = s_string;
  this.$$elementChildren.push( "State" );
  if ( this.$$deserializing == undefined )
  {
  this.PostalCode = new s_string();
  }
  this.$$childElementFunctions[ "PostalCode" ] = s_string;
  this.$$elementChildren.push( "PostalCode" );
  if ( this.$$deserializing == undefined )
  {
  this.LicenseKey = new s_string();
  }
  this.$$childElementFunctions[ "LicenseKey" ] = s_string;
  this.$$elementChildren.push( "LicenseKey" );
}

function ValidateAddressWithFragmentsHttpGetOut( val ) 
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
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
}

function ParseAddressHttpGetIn(  ) 
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
  this.$$name = "ParseAddressHttpGetIn";
  this.$$xmlNames[ "ParseAddressHttpGetIn" ] = "ParseAddressHttpGetIn";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
  if ( this.$$deserializing == undefined )
  {
  this.Address = new s_string();
  }
  this.$$childElementFunctions[ "Address" ] = s_string;
  this.$$elementChildren.push( "Address" );
  if ( this.$$deserializing == undefined )
  {
  this.City = new s_string();
  }
  this.$$childElementFunctions[ "City" ] = s_string;
  this.$$elementChildren.push( "City" );
  if ( this.$$deserializing == undefined )
  {
  this.State = new s_string();
  }
  this.$$childElementFunctions[ "State" ] = s_string;
  this.$$elementChildren.push( "State" );
  if ( this.$$deserializing == undefined )
  {
  this.PostalCode = new s_string();
  }
  this.$$childElementFunctions[ "PostalCode" ] = s_string;
  this.$$elementChildren.push( "PostalCode" );
  if ( this.$$deserializing == undefined )
  {
  this.LicenseKey = new s_string();
  }
  this.$$childElementFunctions[ "LicenseKey" ] = s_string;
  this.$$elementChildren.push( "LicenseKey" );
}

function ParseAddressHttpGetOut( val ) 
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
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
}

function ValidateAddressWithExtrasHttpGetIn(  ) 
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
  this.$$name = "ValidateAddressWithExtrasHttpGetIn";
  this.$$xmlNames[ "ValidateAddressWithExtrasHttpGetIn" ] = "ValidateAddressWithExtrasHttpGetIn";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
  if ( this.$$deserializing == undefined )
  {
  this.Address = new s_string();
  }
  this.$$childElementFunctions[ "Address" ] = s_string;
  this.$$elementChildren.push( "Address" );
  if ( this.$$deserializing == undefined )
  {
  this.Address2 = new s_string();
  }
  this.$$childElementFunctions[ "Address2" ] = s_string;
  this.$$elementChildren.push( "Address2" );
  if ( this.$$deserializing == undefined )
  {
  this.City = new s_string();
  }
  this.$$childElementFunctions[ "City" ] = s_string;
  this.$$elementChildren.push( "City" );
  if ( this.$$deserializing == undefined )
  {
  this.State = new s_string();
  }
  this.$$childElementFunctions[ "State" ] = s_string;
  this.$$elementChildren.push( "State" );
  if ( this.$$deserializing == undefined )
  {
  this.PostalCode = new s_string();
  }
  this.$$childElementFunctions[ "PostalCode" ] = s_string;
  this.$$elementChildren.push( "PostalCode" );
  if ( this.$$deserializing == undefined )
  {
  this.LicenseKey = new s_string();
  }
  this.$$childElementFunctions[ "LicenseKey" ] = s_string;
  this.$$elementChildren.push( "LicenseKey" );
}

function ValidateAddressWithExtrasHttpGetOut( val ) 
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
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
}

function GetPossibleMatchesHttpGetIn(  ) 
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
  this.$$name = "GetPossibleMatchesHttpGetIn";
  this.$$xmlNames[ "GetPossibleMatchesHttpGetIn" ] = "GetPossibleMatchesHttpGetIn";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
  if ( this.$$deserializing == undefined )
  {
  this.Address = new s_string();
  }
  this.$$childElementFunctions[ "Address" ] = s_string;
  this.$$elementChildren.push( "Address" );
  if ( this.$$deserializing == undefined )
  {
  this.Address2 = new s_string();
  }
  this.$$childElementFunctions[ "Address2" ] = s_string;
  this.$$elementChildren.push( "Address2" );
  if ( this.$$deserializing == undefined )
  {
  this.City = new s_string();
  }
  this.$$childElementFunctions[ "City" ] = s_string;
  this.$$elementChildren.push( "City" );
  if ( this.$$deserializing == undefined )
  {
  this.State = new s_string();
  }
  this.$$childElementFunctions[ "State" ] = s_string;
  this.$$elementChildren.push( "State" );
  if ( this.$$deserializing == undefined )
  {
  this.PostalCode = new s_string();
  }
  this.$$childElementFunctions[ "PostalCode" ] = s_string;
  this.$$elementChildren.push( "PostalCode" );
  if ( this.$$deserializing == undefined )
  {
  this.LicenseKey = new s_string();
  }
  this.$$childElementFunctions[ "LicenseKey" ] = s_string;
  this.$$elementChildren.push( "LicenseKey" );
}

function GetPossibleMatchesHttpGetOut( val ) 
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
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
}

function ValidateAddressTypeHttpGetIn(  ) 
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
  this.$$name = "ValidateAddressTypeHttpGetIn";
  this.$$xmlNames[ "ValidateAddressTypeHttpGetIn" ] = "ValidateAddressTypeHttpGetIn";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
  if ( this.$$deserializing == undefined )
  {
  this.Address = new s_string();
  }
  this.$$childElementFunctions[ "Address" ] = s_string;
  this.$$elementChildren.push( "Address" );
  if ( this.$$deserializing == undefined )
  {
  this.Address2 = new s_string();
  }
  this.$$childElementFunctions[ "Address2" ] = s_string;
  this.$$elementChildren.push( "Address2" );
  if ( this.$$deserializing == undefined )
  {
  this.City = new s_string();
  }
  this.$$childElementFunctions[ "City" ] = s_string;
  this.$$elementChildren.push( "City" );
  if ( this.$$deserializing == undefined )
  {
  this.State = new s_string();
  }
  this.$$childElementFunctions[ "State" ] = s_string;
  this.$$elementChildren.push( "State" );
  if ( this.$$deserializing == undefined )
  {
  this.PostalCode = new s_string();
  }
  this.$$childElementFunctions[ "PostalCode" ] = s_string;
  this.$$elementChildren.push( "PostalCode" );
  if ( this.$$deserializing == undefined )
  {
  this.LicenseKey = new s_string();
  }
  this.$$childElementFunctions[ "LicenseKey" ] = s_string;
  this.$$elementChildren.push( "LicenseKey" );
}

function ValidateAddressTypeHttpGetOut( val ) 
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
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
}

function ValidateAddressSingleLineHttpGetIn(  ) 
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
  this.$$name = "ValidateAddressSingleLineHttpGetIn";
  this.$$xmlNames[ "ValidateAddressSingleLineHttpGetIn" ] = "ValidateAddressSingleLineHttpGetIn";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
  if ( this.$$deserializing == undefined )
  {
  this.Address = new s_string();
  }
  this.$$childElementFunctions[ "Address" ] = s_string;
  this.$$elementChildren.push( "Address" );
  if ( this.$$deserializing == undefined )
  {
  this.LicenseKey = new s_string();
  }
  this.$$childElementFunctions[ "LicenseKey" ] = s_string;
  this.$$elementChildren.push( "LicenseKey" );
}

function ValidateAddressSingleLineHttpGetOut( val ) 
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
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
}

function ValidateCityStateZipHttpGetIn(  ) 
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
  this.$$name = "ValidateCityStateZipHttpGetIn";
  this.$$xmlNames[ "ValidateCityStateZipHttpGetIn" ] = "ValidateCityStateZipHttpGetIn";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
  if ( this.$$deserializing == undefined )
  {
  this.City = new s_string();
  }
  this.$$childElementFunctions[ "City" ] = s_string;
  this.$$elementChildren.push( "City" );
  if ( this.$$deserializing == undefined )
  {
  this.State = new s_string();
  }
  this.$$childElementFunctions[ "State" ] = s_string;
  this.$$elementChildren.push( "State" );
  if ( this.$$deserializing == undefined )
  {
  this.PostalCode = new s_string();
  }
  this.$$childElementFunctions[ "PostalCode" ] = s_string;
  this.$$elementChildren.push( "PostalCode" );
  if ( this.$$deserializing == undefined )
  {
  this.LicenseKey = new s_string();
  }
  this.$$childElementFunctions[ "LicenseKey" ] = s_string;
  this.$$elementChildren.push( "LicenseKey" );
}

function ValidateCityStateZipHttpGetOut( val ) 
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
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
}

function ValidateAddressWithDPVHttpGetIn(  ) 
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
  this.$$name = "ValidateAddressWithDPVHttpGetIn";
  this.$$xmlNames[ "ValidateAddressWithDPVHttpGetIn" ] = "ValidateAddressWithDPVHttpGetIn";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
  if ( this.$$deserializing == undefined )
  {
  this.Address = new s_string();
  }
  this.$$childElementFunctions[ "Address" ] = s_string;
  this.$$elementChildren.push( "Address" );
  if ( this.$$deserializing == undefined )
  {
  this.Address2 = new s_string();
  }
  this.$$childElementFunctions[ "Address2" ] = s_string;
  this.$$elementChildren.push( "Address2" );
  if ( this.$$deserializing == undefined )
  {
  this.City = new s_string();
  }
  this.$$childElementFunctions[ "City" ] = s_string;
  this.$$elementChildren.push( "City" );
  if ( this.$$deserializing == undefined )
  {
  this.State = new s_string();
  }
  this.$$childElementFunctions[ "State" ] = s_string;
  this.$$elementChildren.push( "State" );
  if ( this.$$deserializing == undefined )
  {
  this.PostalCode = new s_string();
  }
  this.$$childElementFunctions[ "PostalCode" ] = s_string;
  this.$$elementChildren.push( "PostalCode" );
  if ( this.$$deserializing == undefined )
  {
  this.LicenseKey = new s_string();
  }
  this.$$childElementFunctions[ "LicenseKey" ] = s_string;
  this.$$elementChildren.push( "LicenseKey" );
}

function ValidateAddressWithDPVHttpGetOut( val ) 
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
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
}

function ValidateAddressWithSuiteLinkHttpGetIn(  ) 
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
  this.$$name = "ValidateAddressWithSuiteLinkHttpGetIn";
  this.$$xmlNames[ "ValidateAddressWithSuiteLinkHttpGetIn" ] = "ValidateAddressWithSuiteLinkHttpGetIn";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
  if ( this.$$deserializing == undefined )
  {
  this.BusinessName = new s_string();
  }
  this.$$childElementFunctions[ "BusinessName" ] = s_string;
  this.$$elementChildren.push( "BusinessName" );
  if ( this.$$deserializing == undefined )
  {
  this.Address = new s_string();
  }
  this.$$childElementFunctions[ "Address" ] = s_string;
  this.$$elementChildren.push( "Address" );
  if ( this.$$deserializing == undefined )
  {
  this.Address2 = new s_string();
  }
  this.$$childElementFunctions[ "Address2" ] = s_string;
  this.$$elementChildren.push( "Address2" );
  if ( this.$$deserializing == undefined )
  {
  this.City = new s_string();
  }
  this.$$childElementFunctions[ "City" ] = s_string;
  this.$$elementChildren.push( "City" );
  if ( this.$$deserializing == undefined )
  {
  this.State = new s_string();
  }
  this.$$childElementFunctions[ "State" ] = s_string;
  this.$$elementChildren.push( "State" );
  if ( this.$$deserializing == undefined )
  {
  this.PostalCode = new s_string();
  }
  this.$$childElementFunctions[ "PostalCode" ] = s_string;
  this.$$elementChildren.push( "PostalCode" );
  if ( this.$$deserializing == undefined )
  {
  this.LicenseKey = new s_string();
  }
  this.$$childElementFunctions[ "LicenseKey" ] = s_string;
  this.$$elementChildren.push( "LicenseKey" );
}

function ValidateAddressWithSuiteLinkHttpGetOut( val ) 
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
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
}

function ValidateAddressWithRDIHttpGetIn(  ) 
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
  this.$$name = "ValidateAddressWithRDIHttpGetIn";
  this.$$xmlNames[ "ValidateAddressWithRDIHttpGetIn" ] = "ValidateAddressWithRDIHttpGetIn";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
  if ( this.$$deserializing == undefined )
  {
  this.Address = new s_string();
  }
  this.$$childElementFunctions[ "Address" ] = s_string;
  this.$$elementChildren.push( "Address" );
  if ( this.$$deserializing == undefined )
  {
  this.Address2 = new s_string();
  }
  this.$$childElementFunctions[ "Address2" ] = s_string;
  this.$$elementChildren.push( "Address2" );
  if ( this.$$deserializing == undefined )
  {
  this.City = new s_string();
  }
  this.$$childElementFunctions[ "City" ] = s_string;
  this.$$elementChildren.push( "City" );
  if ( this.$$deserializing == undefined )
  {
  this.State = new s_string();
  }
  this.$$childElementFunctions[ "State" ] = s_string;
  this.$$elementChildren.push( "State" );
  if ( this.$$deserializing == undefined )
  {
  this.PostalCode = new s_string();
  }
  this.$$childElementFunctions[ "PostalCode" ] = s_string;
  this.$$elementChildren.push( "PostalCode" );
  if ( this.$$deserializing == undefined )
  {
  this.LicenseKey = new s_string();
  }
  this.$$childElementFunctions[ "LicenseKey" ] = s_string;
  this.$$elementChildren.push( "LicenseKey" );
}

function ValidateAddressWithRDIHttpGetOut( val ) 
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
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
}

function ValidateAddressHttpPostIn(  ) 
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
  this.$$name = "ValidateAddressHttpPostIn";
  this.$$xmlNames[ "ValidateAddressHttpPostIn" ] = "ValidateAddressHttpPostIn";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
  if ( this.$$deserializing == undefined )
  {
  this.Address = new s_string();
  }
  this.$$childElementFunctions[ "Address" ] = s_string;
  this.$$elementChildren.push( "Address" );
  if ( this.$$deserializing == undefined )
  {
  this.City = new s_string();
  }
  this.$$childElementFunctions[ "City" ] = s_string;
  this.$$elementChildren.push( "City" );
  if ( this.$$deserializing == undefined )
  {
  this.State = new s_string();
  }
  this.$$childElementFunctions[ "State" ] = s_string;
  this.$$elementChildren.push( "State" );
  if ( this.$$deserializing == undefined )
  {
  this.PostalCode = new s_string();
  }
  this.$$childElementFunctions[ "PostalCode" ] = s_string;
  this.$$elementChildren.push( "PostalCode" );
  if ( this.$$deserializing == undefined )
  {
  this.LicenseKey = new s_string();
  }
  this.$$childElementFunctions[ "LicenseKey" ] = s_string;
  this.$$elementChildren.push( "LicenseKey" );
}

function ValidateAddressHttpPostOut( val ) 
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
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
}

function ValidateAddressWithFragmentsHttpPostIn(  ) 
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
  this.$$name = "ValidateAddressWithFragmentsHttpPostIn";
  this.$$xmlNames[ "ValidateAddressWithFragmentsHttpPostIn" ] = "ValidateAddressWithFragmentsHttpPostIn";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
  if ( this.$$deserializing == undefined )
  {
  this.Address = new s_string();
  }
  this.$$childElementFunctions[ "Address" ] = s_string;
  this.$$elementChildren.push( "Address" );
  if ( this.$$deserializing == undefined )
  {
  this.City = new s_string();
  }
  this.$$childElementFunctions[ "City" ] = s_string;
  this.$$elementChildren.push( "City" );
  if ( this.$$deserializing == undefined )
  {
  this.State = new s_string();
  }
  this.$$childElementFunctions[ "State" ] = s_string;
  this.$$elementChildren.push( "State" );
  if ( this.$$deserializing == undefined )
  {
  this.PostalCode = new s_string();
  }
  this.$$childElementFunctions[ "PostalCode" ] = s_string;
  this.$$elementChildren.push( "PostalCode" );
  if ( this.$$deserializing == undefined )
  {
  this.LicenseKey = new s_string();
  }
  this.$$childElementFunctions[ "LicenseKey" ] = s_string;
  this.$$elementChildren.push( "LicenseKey" );
}

function ValidateAddressWithFragmentsHttpPostOut( val ) 
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
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
}

function ParseAddressHttpPostIn(  ) 
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
  this.$$name = "ParseAddressHttpPostIn";
  this.$$xmlNames[ "ParseAddressHttpPostIn" ] = "ParseAddressHttpPostIn";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
  if ( this.$$deserializing == undefined )
  {
  this.Address = new s_string();
  }
  this.$$childElementFunctions[ "Address" ] = s_string;
  this.$$elementChildren.push( "Address" );
  if ( this.$$deserializing == undefined )
  {
  this.City = new s_string();
  }
  this.$$childElementFunctions[ "City" ] = s_string;
  this.$$elementChildren.push( "City" );
  if ( this.$$deserializing == undefined )
  {
  this.State = new s_string();
  }
  this.$$childElementFunctions[ "State" ] = s_string;
  this.$$elementChildren.push( "State" );
  if ( this.$$deserializing == undefined )
  {
  this.PostalCode = new s_string();
  }
  this.$$childElementFunctions[ "PostalCode" ] = s_string;
  this.$$elementChildren.push( "PostalCode" );
  if ( this.$$deserializing == undefined )
  {
  this.LicenseKey = new s_string();
  }
  this.$$childElementFunctions[ "LicenseKey" ] = s_string;
  this.$$elementChildren.push( "LicenseKey" );
}

function ParseAddressHttpPostOut( val ) 
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
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
}

function ValidateAddressWithExtrasHttpPostIn(  ) 
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
  this.$$name = "ValidateAddressWithExtrasHttpPostIn";
  this.$$xmlNames[ "ValidateAddressWithExtrasHttpPostIn" ] = "ValidateAddressWithExtrasHttpPostIn";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
  if ( this.$$deserializing == undefined )
  {
  this.Address = new s_string();
  }
  this.$$childElementFunctions[ "Address" ] = s_string;
  this.$$elementChildren.push( "Address" );
  if ( this.$$deserializing == undefined )
  {
  this.Address2 = new s_string();
  }
  this.$$childElementFunctions[ "Address2" ] = s_string;
  this.$$elementChildren.push( "Address2" );
  if ( this.$$deserializing == undefined )
  {
  this.City = new s_string();
  }
  this.$$childElementFunctions[ "City" ] = s_string;
  this.$$elementChildren.push( "City" );
  if ( this.$$deserializing == undefined )
  {
  this.State = new s_string();
  }
  this.$$childElementFunctions[ "State" ] = s_string;
  this.$$elementChildren.push( "State" );
  if ( this.$$deserializing == undefined )
  {
  this.PostalCode = new s_string();
  }
  this.$$childElementFunctions[ "PostalCode" ] = s_string;
  this.$$elementChildren.push( "PostalCode" );
  if ( this.$$deserializing == undefined )
  {
  this.LicenseKey = new s_string();
  }
  this.$$childElementFunctions[ "LicenseKey" ] = s_string;
  this.$$elementChildren.push( "LicenseKey" );
}

function ValidateAddressWithExtrasHttpPostOut( val ) 
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
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
}

function GetPossibleMatchesHttpPostIn(  ) 
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
  this.$$name = "GetPossibleMatchesHttpPostIn";
  this.$$xmlNames[ "GetPossibleMatchesHttpPostIn" ] = "GetPossibleMatchesHttpPostIn";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
  if ( this.$$deserializing == undefined )
  {
  this.Address = new s_string();
  }
  this.$$childElementFunctions[ "Address" ] = s_string;
  this.$$elementChildren.push( "Address" );
  if ( this.$$deserializing == undefined )
  {
  this.Address2 = new s_string();
  }
  this.$$childElementFunctions[ "Address2" ] = s_string;
  this.$$elementChildren.push( "Address2" );
  if ( this.$$deserializing == undefined )
  {
  this.City = new s_string();
  }
  this.$$childElementFunctions[ "City" ] = s_string;
  this.$$elementChildren.push( "City" );
  if ( this.$$deserializing == undefined )
  {
  this.State = new s_string();
  }
  this.$$childElementFunctions[ "State" ] = s_string;
  this.$$elementChildren.push( "State" );
  if ( this.$$deserializing == undefined )
  {
  this.PostalCode = new s_string();
  }
  this.$$childElementFunctions[ "PostalCode" ] = s_string;
  this.$$elementChildren.push( "PostalCode" );
  if ( this.$$deserializing == undefined )
  {
  this.LicenseKey = new s_string();
  }
  this.$$childElementFunctions[ "LicenseKey" ] = s_string;
  this.$$elementChildren.push( "LicenseKey" );
}

function GetPossibleMatchesHttpPostOut( val ) 
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
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
}

function ValidateAddressTypeHttpPostIn(  ) 
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
  this.$$name = "ValidateAddressTypeHttpPostIn";
  this.$$xmlNames[ "ValidateAddressTypeHttpPostIn" ] = "ValidateAddressTypeHttpPostIn";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
  if ( this.$$deserializing == undefined )
  {
  this.Address = new s_string();
  }
  this.$$childElementFunctions[ "Address" ] = s_string;
  this.$$elementChildren.push( "Address" );
  if ( this.$$deserializing == undefined )
  {
  this.Address2 = new s_string();
  }
  this.$$childElementFunctions[ "Address2" ] = s_string;
  this.$$elementChildren.push( "Address2" );
  if ( this.$$deserializing == undefined )
  {
  this.City = new s_string();
  }
  this.$$childElementFunctions[ "City" ] = s_string;
  this.$$elementChildren.push( "City" );
  if ( this.$$deserializing == undefined )
  {
  this.State = new s_string();
  }
  this.$$childElementFunctions[ "State" ] = s_string;
  this.$$elementChildren.push( "State" );
  if ( this.$$deserializing == undefined )
  {
  this.PostalCode = new s_string();
  }
  this.$$childElementFunctions[ "PostalCode" ] = s_string;
  this.$$elementChildren.push( "PostalCode" );
  if ( this.$$deserializing == undefined )
  {
  this.LicenseKey = new s_string();
  }
  this.$$childElementFunctions[ "LicenseKey" ] = s_string;
  this.$$elementChildren.push( "LicenseKey" );
}

function ValidateAddressTypeHttpPostOut( val ) 
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
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
}

function ValidateAddressSingleLineHttpPostIn(  ) 
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
  this.$$name = "ValidateAddressSingleLineHttpPostIn";
  this.$$xmlNames[ "ValidateAddressSingleLineHttpPostIn" ] = "ValidateAddressSingleLineHttpPostIn";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
  if ( this.$$deserializing == undefined )
  {
  this.Address = new s_string();
  }
  this.$$childElementFunctions[ "Address" ] = s_string;
  this.$$elementChildren.push( "Address" );
  if ( this.$$deserializing == undefined )
  {
  this.LicenseKey = new s_string();
  }
  this.$$childElementFunctions[ "LicenseKey" ] = s_string;
  this.$$elementChildren.push( "LicenseKey" );
}

function ValidateAddressSingleLineHttpPostOut( val ) 
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
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
}

function ValidateCityStateZipHttpPostIn(  ) 
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
  this.$$name = "ValidateCityStateZipHttpPostIn";
  this.$$xmlNames[ "ValidateCityStateZipHttpPostIn" ] = "ValidateCityStateZipHttpPostIn";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
  if ( this.$$deserializing == undefined )
  {
  this.City = new s_string();
  }
  this.$$childElementFunctions[ "City" ] = s_string;
  this.$$elementChildren.push( "City" );
  if ( this.$$deserializing == undefined )
  {
  this.State = new s_string();
  }
  this.$$childElementFunctions[ "State" ] = s_string;
  this.$$elementChildren.push( "State" );
  if ( this.$$deserializing == undefined )
  {
  this.PostalCode = new s_string();
  }
  this.$$childElementFunctions[ "PostalCode" ] = s_string;
  this.$$elementChildren.push( "PostalCode" );
  if ( this.$$deserializing == undefined )
  {
  this.LicenseKey = new s_string();
  }
  this.$$childElementFunctions[ "LicenseKey" ] = s_string;
  this.$$elementChildren.push( "LicenseKey" );
}

function ValidateCityStateZipHttpPostOut( val ) 
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
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
}

function ValidateAddressWithDPVHttpPostIn(  ) 
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
  this.$$name = "ValidateAddressWithDPVHttpPostIn";
  this.$$xmlNames[ "ValidateAddressWithDPVHttpPostIn" ] = "ValidateAddressWithDPVHttpPostIn";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
  if ( this.$$deserializing == undefined )
  {
  this.Address = new s_string();
  }
  this.$$childElementFunctions[ "Address" ] = s_string;
  this.$$elementChildren.push( "Address" );
  if ( this.$$deserializing == undefined )
  {
  this.Address2 = new s_string();
  }
  this.$$childElementFunctions[ "Address2" ] = s_string;
  this.$$elementChildren.push( "Address2" );
  if ( this.$$deserializing == undefined )
  {
  this.City = new s_string();
  }
  this.$$childElementFunctions[ "City" ] = s_string;
  this.$$elementChildren.push( "City" );
  if ( this.$$deserializing == undefined )
  {
  this.State = new s_string();
  }
  this.$$childElementFunctions[ "State" ] = s_string;
  this.$$elementChildren.push( "State" );
  if ( this.$$deserializing == undefined )
  {
  this.PostalCode = new s_string();
  }
  this.$$childElementFunctions[ "PostalCode" ] = s_string;
  this.$$elementChildren.push( "PostalCode" );
  if ( this.$$deserializing == undefined )
  {
  this.LicenseKey = new s_string();
  }
  this.$$childElementFunctions[ "LicenseKey" ] = s_string;
  this.$$elementChildren.push( "LicenseKey" );
}

function ValidateAddressWithDPVHttpPostOut( val ) 
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
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
}

function ValidateAddressWithSuiteLinkHttpPostIn(  ) 
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
  this.$$name = "ValidateAddressWithSuiteLinkHttpPostIn";
  this.$$xmlNames[ "ValidateAddressWithSuiteLinkHttpPostIn" ] = "ValidateAddressWithSuiteLinkHttpPostIn";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
  if ( this.$$deserializing == undefined )
  {
  this.BusinessName = new s_string();
  }
  this.$$childElementFunctions[ "BusinessName" ] = s_string;
  this.$$elementChildren.push( "BusinessName" );
  if ( this.$$deserializing == undefined )
  {
  this.Address = new s_string();
  }
  this.$$childElementFunctions[ "Address" ] = s_string;
  this.$$elementChildren.push( "Address" );
  if ( this.$$deserializing == undefined )
  {
  this.Address2 = new s_string();
  }
  this.$$childElementFunctions[ "Address2" ] = s_string;
  this.$$elementChildren.push( "Address2" );
  if ( this.$$deserializing == undefined )
  {
  this.City = new s_string();
  }
  this.$$childElementFunctions[ "City" ] = s_string;
  this.$$elementChildren.push( "City" );
  if ( this.$$deserializing == undefined )
  {
  this.State = new s_string();
  }
  this.$$childElementFunctions[ "State" ] = s_string;
  this.$$elementChildren.push( "State" );
  if ( this.$$deserializing == undefined )
  {
  this.PostalCode = new s_string();
  }
  this.$$childElementFunctions[ "PostalCode" ] = s_string;
  this.$$elementChildren.push( "PostalCode" );
  if ( this.$$deserializing == undefined )
  {
  this.LicenseKey = new s_string();
  }
  this.$$childElementFunctions[ "LicenseKey" ] = s_string;
  this.$$elementChildren.push( "LicenseKey" );
}

function ValidateAddressWithSuiteLinkHttpPostOut( val ) 
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
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
}

function ValidateAddressWithRDIHttpPostIn(  ) 
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
  this.$$name = "ValidateAddressWithRDIHttpPostIn";
  this.$$xmlNames[ "ValidateAddressWithRDIHttpPostIn" ] = "ValidateAddressWithRDIHttpPostIn";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
  if ( this.$$deserializing == undefined )
  {
  this.Address = new s_string();
  }
  this.$$childElementFunctions[ "Address" ] = s_string;
  this.$$elementChildren.push( "Address" );
  if ( this.$$deserializing == undefined )
  {
  this.Address2 = new s_string();
  }
  this.$$childElementFunctions[ "Address2" ] = s_string;
  this.$$elementChildren.push( "Address2" );
  if ( this.$$deserializing == undefined )
  {
  this.City = new s_string();
  }
  this.$$childElementFunctions[ "City" ] = s_string;
  this.$$elementChildren.push( "City" );
  if ( this.$$deserializing == undefined )
  {
  this.State = new s_string();
  }
  this.$$childElementFunctions[ "State" ] = s_string;
  this.$$elementChildren.push( "State" );
  if ( this.$$deserializing == undefined )
  {
  this.PostalCode = new s_string();
  }
  this.$$childElementFunctions[ "PostalCode" ] = s_string;
  this.$$elementChildren.push( "PostalCode" );
  if ( this.$$deserializing == undefined )
  {
  this.LicenseKey = new s_string();
  }
  this.$$childElementFunctions[ "LicenseKey" ] = s_string;
  this.$$elementChildren.push( "LicenseKey" );
}

function ValidateAddressWithRDIHttpPostOut( val ) 
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
  this.xmlns_ns5 = new String("http://www.serviceobjects.com/");
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