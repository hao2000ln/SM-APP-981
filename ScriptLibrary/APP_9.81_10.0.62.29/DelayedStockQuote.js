
function DelayedStockQuote( )
{
  this.location = new String( "http://ws.cdyne.com/delayedstockquote/delayedstockquote.asmx" );

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

  this.SOAPOperations[ "GetQuote" ] = new soap_Operation( "GetQuote", "http://ws.cdyne.com/GetQuote", "", "GetQuote", "GetQuoteResponse" );
  this.SOAPOperations[ "GetQuickQuote" ] = new soap_Operation( "GetQuickQuote", "http://ws.cdyne.com/GetQuickQuote", "", "GetQuickQuote", "GetQuickQuoteResponse" );
  this.SOAPOperations[ "GetQuoteDataSet" ] = new soap_Operation( "GetQuoteDataSet", "http://ws.cdyne.com/GetQuoteDataSet", "", "GetQuoteDataSet", "GetQuoteDataSetResponse" );
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
    lib.SOAP.deserialize( "DelayedStockQuote", this.resultXML.getDocumentElement(), resultObj );
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
  this.xmlns_ns3 = new String("http://schemas.xmlsoap.org/wsdl/soap12/");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
  this.xmlns_ns4 = new String("http://schemas.xmlsoap.org/soap/encoding/");
  this.$$attributes.push( "xmlns_ns4" );
  this.$$xmlNames["xmlns_ns4"] = "xmlns:ns4";
  this.$$objNames["xmlns:ns4"] = "xmlns_ns4";
  this.xmlns_ns5 = new String("http://microsoft.com/wsdl/mime/textMatching/");
  this.$$attributes.push( "xmlns_ns5" );
  this.$$xmlNames["xmlns_ns5"] = "xmlns:ns5";
  this.$$objNames["xmlns:ns5"] = "xmlns_ns5";
  this.xmlns_ns6 = new String("http://ws.cdyne.com/");
  this.$$attributes.push( "xmlns_ns6" );
  this.$$xmlNames["xmlns_ns6"] = "xmlns:ns6";
  this.$$objNames["xmlns:ns6"] = "xmlns_ns6";
  this.xmlns_ns7 = new String("http://schemas.xmlsoap.org/wsdl/");
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

function GetQuote(  ) 
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
  this.$$name = "GetQuote";
  this.$$xmlNames[ "GetQuote" ] = "GetQuote";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns6 = new String("http://ws.cdyne.com/");
  this.$$attributes.push( "xmlns_ns6" );
  this.$$xmlNames["xmlns_ns6"] = "xmlns:ns6";
  this.$$objNames["xmlns:ns6"] = "xmlns_ns6";
  this.$$minOccurs[ "StockSymbol" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.StockSymbol = new s_string();
  }
  this.$$childElementFunctions[ "StockSymbol" ] = s_string;
  this.$$elementChildren.push( "StockSymbol" );
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

function GetQuoteResponse(  ) 
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
  this.$$name = "GetQuoteResponse";
  this.$$xmlNames[ "GetQuoteResponse" ] = "GetQuoteResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.GetQuoteResult = new QuoteData();
  }
  this.$$childElementFunctions[ "GetQuoteResult" ] = QuoteData;
  this.$$elementChildren.push( "GetQuoteResult" );
}

function QuoteData(  ) 
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
  this.$$name = "QuoteData";
  this.$$xmlNames[ "QuoteData" ] = "QuoteData";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "StockSymbol" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.StockSymbol = new s_string();
  }
  this.$$childElementFunctions[ "StockSymbol" ] = s_string;
  this.$$elementChildren.push( "StockSymbol" );
  if ( this.$$deserializing == undefined )
  {
  this.LastTradeAmount = new s_decimal();
  }
  this.$$childElementFunctions[ "LastTradeAmount" ] = s_decimal;
  this.$$elementChildren.push( "LastTradeAmount" );
  if ( this.$$deserializing == undefined )
  {
  this.LastTradeDateTime = new s_dateTime();
  }
  this.$$childElementFunctions[ "LastTradeDateTime" ] = s_dateTime;
  this.$$elementChildren.push( "LastTradeDateTime" );
  if ( this.$$deserializing == undefined )
  {
  this.StockChange = new s_decimal();
  }
  this.$$childElementFunctions[ "StockChange" ] = s_decimal;
  this.$$elementChildren.push( "StockChange" );
  if ( this.$$deserializing == undefined )
  {
  this.OpenAmount = new s_decimal();
  }
  this.$$childElementFunctions[ "OpenAmount" ] = s_decimal;
  this.$$elementChildren.push( "OpenAmount" );
  if ( this.$$deserializing == undefined )
  {
  this.DayHigh = new s_decimal();
  }
  this.$$childElementFunctions[ "DayHigh" ] = s_decimal;
  this.$$elementChildren.push( "DayHigh" );
  if ( this.$$deserializing == undefined )
  {
  this.DayLow = new s_decimal();
  }
  this.$$childElementFunctions[ "DayLow" ] = s_decimal;
  this.$$elementChildren.push( "DayLow" );
  if ( this.$$deserializing == undefined )
  {
  this.StockVolume = new s_int();
  }
  this.$$childElementFunctions[ "StockVolume" ] = s_int;
  this.$$elementChildren.push( "StockVolume" );
  if ( this.$$deserializing == undefined )
  {
  this.PrevCls = new s_decimal();
  }
  this.$$childElementFunctions[ "PrevCls" ] = s_decimal;
  this.$$elementChildren.push( "PrevCls" );
  this.$$minOccurs[ "ChangePercent" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ChangePercent = new s_string();
  }
  this.$$childElementFunctions[ "ChangePercent" ] = s_string;
  this.$$elementChildren.push( "ChangePercent" );
  this.$$minOccurs[ "FiftyTwoWeekRange" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FiftyTwoWeekRange = new s_string();
  }
  this.$$childElementFunctions[ "FiftyTwoWeekRange" ] = s_string;
  this.$$elementChildren.push( "FiftyTwoWeekRange" );
  if ( this.$$deserializing == undefined )
  {
  this.EarnPerShare = new s_decimal();
  }
  this.$$childElementFunctions[ "EarnPerShare" ] = s_decimal;
  this.$$elementChildren.push( "EarnPerShare" );
  if ( this.$$deserializing == undefined )
  {
  this.PE = new s_decimal();
  }
  this.$$childElementFunctions[ "PE" ] = s_decimal;
  this.$$elementChildren.push( "PE" );
  this.$$minOccurs[ "CompanyName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.CompanyName = new s_string();
  }
  this.$$childElementFunctions[ "CompanyName" ] = s_string;
  this.$$elementChildren.push( "CompanyName" );
  if ( this.$$deserializing == undefined )
  {
  this.QuoteError = new s_boolean();
  }
  this.$$childElementFunctions[ "QuoteError" ] = s_boolean;
  this.$$elementChildren.push( "QuoteError" );
}

function s_decimal( val ) 
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
  this.xsi_type = new String("xsd:decimal");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function s_dateTime( val ) 
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
  this.xsi_type = new String("xsd:dateTime");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function s_int( val ) 
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

function s_boolean( val ) 
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
  this.xsi_type = new String("xsd:boolean");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function GetQuickQuote(  ) 
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
  this.$$name = "GetQuickQuote";
  this.$$xmlNames[ "GetQuickQuote" ] = "GetQuickQuote";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns6 = new String("http://ws.cdyne.com/");
  this.$$attributes.push( "xmlns_ns6" );
  this.$$xmlNames["xmlns_ns6"] = "xmlns:ns6";
  this.$$objNames["xmlns:ns6"] = "xmlns_ns6";
  this.$$minOccurs[ "StockSymbol" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.StockSymbol = new s_string();
  }
  this.$$childElementFunctions[ "StockSymbol" ] = s_string;
  this.$$elementChildren.push( "StockSymbol" );
  this.$$minOccurs[ "LicenseKey" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.LicenseKey = new s_string();
  }
  this.$$childElementFunctions[ "LicenseKey" ] = s_string;
  this.$$elementChildren.push( "LicenseKey" );
}

function GetQuickQuoteResponse(  ) 
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
  this.$$name = "GetQuickQuoteResponse";
  this.$$xmlNames[ "GetQuickQuoteResponse" ] = "GetQuickQuoteResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.GetQuickQuoteResult = new s_decimal();
  }
  this.$$childElementFunctions[ "GetQuickQuoteResult" ] = s_decimal;
  this.$$elementChildren.push( "GetQuickQuoteResult" );
}

function GetQuoteDataSet(  ) 
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
  this.$$name = "GetQuoteDataSet";
  this.$$xmlNames[ "GetQuoteDataSet" ] = "GetQuoteDataSet";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns6 = new String("http://ws.cdyne.com/");
  this.$$attributes.push( "xmlns_ns6" );
  this.$$xmlNames["xmlns_ns6"] = "xmlns:ns6";
  this.$$objNames["xmlns:ns6"] = "xmlns_ns6";
  this.$$minOccurs[ "StockSymbols" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.StockSymbols = new s_string();
  }
  this.$$childElementFunctions[ "StockSymbols" ] = s_string;
  this.$$elementChildren.push( "StockSymbols" );
  this.$$minOccurs[ "LicenseKey" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.LicenseKey = new s_string();
  }
  this.$$childElementFunctions[ "LicenseKey" ] = s_string;
  this.$$elementChildren.push( "LicenseKey" );
}

function GetQuoteDataSetResponse(  ) 
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
  this.$$name = "GetQuoteDataSetResponse";
  this.$$xmlNames[ "GetQuoteDataSetResponse" ] = "GetQuoteDataSetResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "GetQuoteDataSetResult" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.GetQuoteDataSetResult = new GetQuoteDataSetResponse_GetQuoteDataSetResult();
  }
  this.$$childElementFunctions[ "GetQuoteDataSetResult" ] = GetQuoteDataSetResponse_GetQuoteDataSetResult;
  this.$$elementChildren.push( "GetQuoteDataSetResult" );
}

function GetQuoteDataSetResponse_GetQuoteDataSetResult(  ) 
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
  this.$$name = "GetQuoteDataSetResponse_GetQuoteDataSetResult";
  this.$$xmlNames[ "GetQuoteDataSetResponse_GetQuoteDataSetResult" ] = "GetQuoteDataSetResult";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$refs[ "schema" ] = true;
  if ( this.$$deserializing == undefined )
  {
  this.schema = new schema();
  }
  this.$$childElementFunctions[ "schema" ] = schema;
  this.$$elementChildren.push( "schema" );
}

function decimal( val ) 
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
  this.xsi_type = new String("xsd:decimal");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function DataSet(  ) 
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
  this.$$name = "DataSet";
  this.$$xmlNames[ "DataSet" ] = "DataSet";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$refs[ "schema" ] = true;
  if ( this.$$deserializing == undefined )
  {
  this.schema = new schema();
  }
  this.$$childElementFunctions[ "schema" ] = schema;
  this.$$elementChildren.push( "schema" );
}

function GetQuoteSoapIn( val ) 
{
  this.$$nsPrefix = "ns6";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xmlns_ns6 = new String("http://ws.cdyne.com/");
  this.$$attributes.push( "xmlns_ns6" );
  this.$$xmlNames["xmlns_ns6"] = "xmlns:ns6";
  this.$$objNames["xmlns:ns6"] = "xmlns_ns6";
}

function GetQuoteSoapOut( val ) 
{
  this.$$nsPrefix = "ns6";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xmlns_ns6 = new String("http://ws.cdyne.com/");
  this.$$attributes.push( "xmlns_ns6" );
  this.$$xmlNames["xmlns_ns6"] = "xmlns:ns6";
  this.$$objNames["xmlns:ns6"] = "xmlns_ns6";
}

function GetQuickQuoteSoapIn( val ) 
{
  this.$$nsPrefix = "ns6";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xmlns_ns6 = new String("http://ws.cdyne.com/");
  this.$$attributes.push( "xmlns_ns6" );
  this.$$xmlNames["xmlns_ns6"] = "xmlns:ns6";
  this.$$objNames["xmlns:ns6"] = "xmlns_ns6";
}

function GetQuickQuoteSoapOut( val ) 
{
  this.$$nsPrefix = "ns6";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xmlns_ns6 = new String("http://ws.cdyne.com/");
  this.$$attributes.push( "xmlns_ns6" );
  this.$$xmlNames["xmlns_ns6"] = "xmlns:ns6";
  this.$$objNames["xmlns:ns6"] = "xmlns_ns6";
}

function GetQuoteDataSetSoapIn( val ) 
{
  this.$$nsPrefix = "ns6";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xmlns_ns6 = new String("http://ws.cdyne.com/");
  this.$$attributes.push( "xmlns_ns6" );
  this.$$xmlNames["xmlns_ns6"] = "xmlns:ns6";
  this.$$objNames["xmlns:ns6"] = "xmlns_ns6";
}

function GetQuoteDataSetSoapOut( val ) 
{
  this.$$nsPrefix = "ns6";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xmlns_ns6 = new String("http://ws.cdyne.com/");
  this.$$attributes.push( "xmlns_ns6" );
  this.$$xmlNames["xmlns_ns6"] = "xmlns:ns6";
  this.$$objNames["xmlns:ns6"] = "xmlns_ns6";
}

function GetQuoteHttpGetIn(  ) 
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
  this.$$name = "GetQuoteHttpGetIn";
  this.$$xmlNames[ "GetQuoteHttpGetIn" ] = "GetQuoteHttpGetIn";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns6 = new String("http://ws.cdyne.com/");
  this.$$attributes.push( "xmlns_ns6" );
  this.$$xmlNames["xmlns_ns6"] = "xmlns:ns6";
  this.$$objNames["xmlns:ns6"] = "xmlns_ns6";
  if ( this.$$deserializing == undefined )
  {
  this.StockSymbol = new s_string();
  }
  this.$$childElementFunctions[ "StockSymbol" ] = s_string;
  this.$$elementChildren.push( "StockSymbol" );
  if ( this.$$deserializing == undefined )
  {
  this.LicenseKey = new s_string();
  }
  this.$$childElementFunctions[ "LicenseKey" ] = s_string;
  this.$$elementChildren.push( "LicenseKey" );
}

function GetQuoteHttpGetOut( val ) 
{
  this.$$nsPrefix = "ns6";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xmlns_ns6 = new String("http://ws.cdyne.com/");
  this.$$attributes.push( "xmlns_ns6" );
  this.$$xmlNames["xmlns_ns6"] = "xmlns:ns6";
  this.$$objNames["xmlns:ns6"] = "xmlns_ns6";
}

function GetQuickQuoteHttpGetIn(  ) 
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
  this.$$name = "GetQuickQuoteHttpGetIn";
  this.$$xmlNames[ "GetQuickQuoteHttpGetIn" ] = "GetQuickQuoteHttpGetIn";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns6 = new String("http://ws.cdyne.com/");
  this.$$attributes.push( "xmlns_ns6" );
  this.$$xmlNames["xmlns_ns6"] = "xmlns:ns6";
  this.$$objNames["xmlns:ns6"] = "xmlns_ns6";
  if ( this.$$deserializing == undefined )
  {
  this.StockSymbol = new s_string();
  }
  this.$$childElementFunctions[ "StockSymbol" ] = s_string;
  this.$$elementChildren.push( "StockSymbol" );
  if ( this.$$deserializing == undefined )
  {
  this.LicenseKey = new s_string();
  }
  this.$$childElementFunctions[ "LicenseKey" ] = s_string;
  this.$$elementChildren.push( "LicenseKey" );
}

function GetQuickQuoteHttpGetOut( val ) 
{
  this.$$nsPrefix = "ns6";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xmlns_ns6 = new String("http://ws.cdyne.com/");
  this.$$attributes.push( "xmlns_ns6" );
  this.$$xmlNames["xmlns_ns6"] = "xmlns:ns6";
  this.$$objNames["xmlns:ns6"] = "xmlns_ns6";
}

function GetQuoteDataSetHttpGetIn(  ) 
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
  this.$$name = "GetQuoteDataSetHttpGetIn";
  this.$$xmlNames[ "GetQuoteDataSetHttpGetIn" ] = "GetQuoteDataSetHttpGetIn";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns6 = new String("http://ws.cdyne.com/");
  this.$$attributes.push( "xmlns_ns6" );
  this.$$xmlNames["xmlns_ns6"] = "xmlns:ns6";
  this.$$objNames["xmlns:ns6"] = "xmlns_ns6";
  if ( this.$$deserializing == undefined )
  {
  this.StockSymbols = new s_string();
  }
  this.$$childElementFunctions[ "StockSymbols" ] = s_string;
  this.$$elementChildren.push( "StockSymbols" );
  if ( this.$$deserializing == undefined )
  {
  this.LicenseKey = new s_string();
  }
  this.$$childElementFunctions[ "LicenseKey" ] = s_string;
  this.$$elementChildren.push( "LicenseKey" );
}

function GetQuoteDataSetHttpGetOut( val ) 
{
  this.$$nsPrefix = "ns6";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xmlns_ns6 = new String("http://ws.cdyne.com/");
  this.$$attributes.push( "xmlns_ns6" );
  this.$$xmlNames["xmlns_ns6"] = "xmlns:ns6";
  this.$$objNames["xmlns:ns6"] = "xmlns_ns6";
}

function GetQuoteHttpPostIn(  ) 
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
  this.$$name = "GetQuoteHttpPostIn";
  this.$$xmlNames[ "GetQuoteHttpPostIn" ] = "GetQuoteHttpPostIn";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns6 = new String("http://ws.cdyne.com/");
  this.$$attributes.push( "xmlns_ns6" );
  this.$$xmlNames["xmlns_ns6"] = "xmlns:ns6";
  this.$$objNames["xmlns:ns6"] = "xmlns_ns6";
  if ( this.$$deserializing == undefined )
  {
  this.StockSymbol = new s_string();
  }
  this.$$childElementFunctions[ "StockSymbol" ] = s_string;
  this.$$elementChildren.push( "StockSymbol" );
  if ( this.$$deserializing == undefined )
  {
  this.LicenseKey = new s_string();
  }
  this.$$childElementFunctions[ "LicenseKey" ] = s_string;
  this.$$elementChildren.push( "LicenseKey" );
}

function GetQuoteHttpPostOut( val ) 
{
  this.$$nsPrefix = "ns6";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xmlns_ns6 = new String("http://ws.cdyne.com/");
  this.$$attributes.push( "xmlns_ns6" );
  this.$$xmlNames["xmlns_ns6"] = "xmlns:ns6";
  this.$$objNames["xmlns:ns6"] = "xmlns_ns6";
}

function GetQuickQuoteHttpPostIn(  ) 
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
  this.$$name = "GetQuickQuoteHttpPostIn";
  this.$$xmlNames[ "GetQuickQuoteHttpPostIn" ] = "GetQuickQuoteHttpPostIn";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns6 = new String("http://ws.cdyne.com/");
  this.$$attributes.push( "xmlns_ns6" );
  this.$$xmlNames["xmlns_ns6"] = "xmlns:ns6";
  this.$$objNames["xmlns:ns6"] = "xmlns_ns6";
  if ( this.$$deserializing == undefined )
  {
  this.StockSymbol = new s_string();
  }
  this.$$childElementFunctions[ "StockSymbol" ] = s_string;
  this.$$elementChildren.push( "StockSymbol" );
  if ( this.$$deserializing == undefined )
  {
  this.LicenseKey = new s_string();
  }
  this.$$childElementFunctions[ "LicenseKey" ] = s_string;
  this.$$elementChildren.push( "LicenseKey" );
}

function GetQuickQuoteHttpPostOut( val ) 
{
  this.$$nsPrefix = "ns6";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xmlns_ns6 = new String("http://ws.cdyne.com/");
  this.$$attributes.push( "xmlns_ns6" );
  this.$$xmlNames["xmlns_ns6"] = "xmlns:ns6";
  this.$$objNames["xmlns:ns6"] = "xmlns_ns6";
}

function GetQuoteDataSetHttpPostIn(  ) 
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
  this.$$name = "GetQuoteDataSetHttpPostIn";
  this.$$xmlNames[ "GetQuoteDataSetHttpPostIn" ] = "GetQuoteDataSetHttpPostIn";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns6 = new String("http://ws.cdyne.com/");
  this.$$attributes.push( "xmlns_ns6" );
  this.$$xmlNames["xmlns_ns6"] = "xmlns:ns6";
  this.$$objNames["xmlns:ns6"] = "xmlns_ns6";
  if ( this.$$deserializing == undefined )
  {
  this.StockSymbols = new s_string();
  }
  this.$$childElementFunctions[ "StockSymbols" ] = s_string;
  this.$$elementChildren.push( "StockSymbols" );
  if ( this.$$deserializing == undefined )
  {
  this.LicenseKey = new s_string();
  }
  this.$$childElementFunctions[ "LicenseKey" ] = s_string;
  this.$$elementChildren.push( "LicenseKey" );
}

function GetQuoteDataSetHttpPostOut( val ) 
{
  this.$$nsPrefix = "ns6";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getValue = getValue;
  this.setValue = setValue;
  this.$$value = val;
  this.xmlns_ns6 = new String("http://ws.cdyne.com/");
  this.$$attributes.push( "xmlns_ns6" );
  this.$$xmlNames["xmlns_ns6"] = "xmlns:ns6";
  this.$$objNames["xmlns:ns6"] = "xmlns_ns6";
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