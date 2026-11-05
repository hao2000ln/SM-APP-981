
function AmazonSearchService( )
{
  this.location = new String( "http://soap.amazon.com/onca/soap2" );

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

  this.SOAPOperations[ "KeywordSearchRequest" ] = new soap_Operation( "KeywordSearchRequest", "http://soap.amazon.com", "rpc", "KeywordSearchRequest", "KeywordSearchResponse" );
  this.SOAPOperations[ "PowerSearchRequest" ] = new soap_Operation( "PowerSearchRequest", "http://soap.amazon.com", "rpc", "PowerSearchRequest", "PowerSearchResponse" );
  this.SOAPOperations[ "BrowseNodeSearchRequest" ] = new soap_Operation( "BrowseNodeSearchRequest", "http://soap.amazon.com", "rpc", "BrowseNodeSearchRequest", "BrowseNodeSearchResponse" );
  this.SOAPOperations[ "AsinSearchRequest" ] = new soap_Operation( "AsinSearchRequest", "http://soap.amazon.com", "rpc", "AsinSearchRequest", "AsinSearchResponse" );
  this.SOAPOperations[ "BlendedSearchRequest" ] = new soap_Operation( "BlendedSearchRequest", "http://soap.amazon.com", "rpc", "BlendedSearchRequest", "BlendedSearchResponse" );
  this.SOAPOperations[ "UpcSearchRequest" ] = new soap_Operation( "UpcSearchRequest", "http://soap.amazon.com", "rpc", "UpcSearchRequest", "UpcSearchResponse" );
  this.SOAPOperations[ "AuthorSearchRequest" ] = new soap_Operation( "AuthorSearchRequest", "http://soap.amazon.com", "rpc", "AuthorSearchRequest", "AuthorSearchResponse" );
  this.SOAPOperations[ "ArtistSearchRequest" ] = new soap_Operation( "ArtistSearchRequest", "http://soap.amazon.com", "rpc", "ArtistSearchRequest", "ArtistSearchResponse" );
  this.SOAPOperations[ "ActorSearchRequest" ] = new soap_Operation( "ActorSearchRequest", "http://soap.amazon.com", "rpc", "ActorSearchRequest", "ActorSearchResponse" );
  this.SOAPOperations[ "ManufacturerSearchRequest" ] = new soap_Operation( "ManufacturerSearchRequest", "http://soap.amazon.com", "rpc", "ManufacturerSearchRequest", "ManufacturerSearchResponse" );
  this.SOAPOperations[ "DirectorSearchRequest" ] = new soap_Operation( "DirectorSearchRequest", "http://soap.amazon.com", "rpc", "DirectorSearchRequest", "DirectorSearchResponse" );
  this.SOAPOperations[ "ListManiaSearchRequest" ] = new soap_Operation( "ListManiaSearchRequest", "http://soap.amazon.com", "rpc", "ListManiaSearchRequest", "ListManiaSearchResponse" );
  this.SOAPOperations[ "WishlistSearchRequest" ] = new soap_Operation( "WishlistSearchRequest", "http://soap.amazon.com", "rpc", "WishlistSearchRequest", "WishlistSearchResponse" );
  this.SOAPOperations[ "ExchangeSearchRequest" ] = new soap_Operation( "ExchangeSearchRequest", "http://soap.amazon.com", "rpc", "ExchangeSearchRequest", "ExchangeSearchResponse" );
  this.SOAPOperations[ "MarketplaceSearchRequest" ] = new soap_Operation( "MarketplaceSearchRequest", "http://soap.amazon.com", "rpc", "MarketplaceSearchRequest", "MarketplaceSearchResponse" );
  this.SOAPOperations[ "SellerProfileSearchRequest" ] = new soap_Operation( "SellerProfileSearchRequest", "http://soap.amazon.com", "rpc", "SellerProfileSearchRequest", "SellerProfileSearchResponse" );
  this.SOAPOperations[ "SellerSearchRequest" ] = new soap_Operation( "SellerSearchRequest", "http://soap.amazon.com", "rpc", "SellerSearchRequest", "SellerSearchResponse" );
  this.SOAPOperations[ "SimilaritySearchRequest" ] = new soap_Operation( "SimilaritySearchRequest", "http://soap.amazon.com", "rpc", "SimilaritySearchRequest", "SimilaritySearchResponse" );
  this.SOAPOperations[ "GetShoppingCartRequest" ] = new soap_Operation( "GetShoppingCartRequest", "http://soap.amazon.com", "rpc", "GetShoppingCartRequest", "ShoppingCartResponse" );
  this.SOAPOperations[ "ClearShoppingCartRequest" ] = new soap_Operation( "ClearShoppingCartRequest", "http://soap.amazon.com", "rpc", "ClearShoppingCartRequest", "ShoppingCartResponse" );
  this.SOAPOperations[ "AddShoppingCartItemsRequest" ] = new soap_Operation( "AddShoppingCartItemsRequest", "http://soap.amazon.com", "rpc", "AddShoppingCartItemsRequest", "ShoppingCartResponse" );
  this.SOAPOperations[ "RemoveShoppingCartItemsRequest" ] = new soap_Operation( "RemoveShoppingCartItemsRequest", "http://soap.amazon.com", "rpc", "RemoveShoppingCartItemsRequest", "ShoppingCartResponse" );
  this.SOAPOperations[ "ModifyShoppingCartItemsRequest" ] = new soap_Operation( "ModifyShoppingCartItemsRequest", "http://soap.amazon.com", "rpc", "ModifyShoppingCartItemsRequest", "ShoppingCartResponse" );
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
    lib.SOAP.deserialize( "AmazonSearchService", this.resultXML.getDocumentElement(), resultObj );
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
  this.xmlns_ns0 = new String("http://schemas.xmlsoap.org/soap/encoding/");
  this.$$attributes.push( "xmlns_ns0" );
  this.$$xmlNames["xmlns_ns0"] = "xmlns:ns0";
  this.$$objNames["xmlns:ns0"] = "xmlns_ns0";
  this.xmlns_ns1 = new String("http://soap.amazon.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  this.xmlns_ns2 = new String("http://schemas.xmlsoap.org/wsdl/");
  this.$$attributes.push( "xmlns_ns2" );
  this.$$xmlNames["xmlns_ns2"] = "xmlns:ns2";
  this.$$objNames["xmlns:ns2"] = "xmlns_ns2";
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

function ProductLineArray(  ) 
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
  this.$$name = "ProductLineArray";
  this.$$xmlNames[ "ProductLineArray" ] = "ProductLineArray";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.item = new Array();  // of ProductLine
  this.item.$$nsPrefix = "ns1"
 // method to create a new member of the item array
  this.item.newInstance = function( bDeserializing )
  {
    var newObj = new ProductLine( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.item_newInstance = function( bDeserializing )
  {
    var newLen = this.item.push( new ProductLine( bDeserializing ) );
    return this.item[ newLen-1 ];
  }
  this.length = function()
  {
    return this.item.length;
  }
  this.ProductLine = this.item;
  this.ProductLine_newInstance = this.item_newInstance;
  this.ProductLine.newInstance = this.item.newInstance;
  this.$$elementChildren.push( "item" );
}

function ProductLine(  ) 
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
  this.$$name = "ProductLine";
  this.$$xmlNames[ "ProductLine" ] = "ProductLine";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "Mode" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Mode = new xsd_string();
  }
  this.$$childElementFunctions[ "Mode" ] = xsd_string;
  this.$$elementChildren.push( "Mode" );
  this.$$minOccurs[ "ProductInfo" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ProductInfo = new ProductInfo();
  }
  this.$$childElementFunctions[ "ProductInfo" ] = ProductInfo;
  this.$$elementChildren.push( "ProductInfo" );
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

function ProductInfo(  ) 
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
  this.$$name = "ProductInfo";
  this.$$xmlNames[ "ProductInfo" ] = "ProductInfo";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "TotalResults" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.TotalResults = new xsd_string();
  }
  this.$$childElementFunctions[ "TotalResults" ] = xsd_string;
  this.$$elementChildren.push( "TotalResults" );
  this.$$minOccurs[ "TotalPages" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.TotalPages = new xsd_string();
  }
  this.$$childElementFunctions[ "TotalPages" ] = xsd_string;
  this.$$elementChildren.push( "TotalPages" );
  this.$$minOccurs[ "ListName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ListName = new xsd_string();
  }
  this.$$childElementFunctions[ "ListName" ] = xsd_string;
  this.$$elementChildren.push( "ListName" );
  this.$$minOccurs[ "Details" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Details = new DetailsArray();
  }
  this.$$childElementFunctions[ "Details" ] = DetailsArray;
  this.$$elementChildren.push( "Details" );
}

function DetailsArray(  ) 
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
  this.$$name = "DetailsArray";
  this.$$xmlNames[ "DetailsArray" ] = "DetailsArray";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.item = new Array();  // of Details
  this.item.$$nsPrefix = "ns1"
 // method to create a new member of the item array
  this.item.newInstance = function( bDeserializing )
  {
    var newObj = new Details( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.item_newInstance = function( bDeserializing )
  {
    var newLen = this.item.push( new Details( bDeserializing ) );
    return this.item[ newLen-1 ];
  }
  this.length = function()
  {
    return this.item.length;
  }
  this.Details = this.item;
  this.Details_newInstance = this.item_newInstance;
  this.Details.newInstance = this.item.newInstance;
  this.$$elementChildren.push( "item" );
}

function Details(  ) 
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
  this.$$name = "Details";
  this.$$xmlNames[ "Details" ] = "Details";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "Url" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Url = new xsd_string();
  }
  this.$$childElementFunctions[ "Url" ] = xsd_string;
  this.$$elementChildren.push( "Url" );
  this.$$minOccurs[ "Asin" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Asin = new xsd_string();
  }
  this.$$childElementFunctions[ "Asin" ] = xsd_string;
  this.$$elementChildren.push( "Asin" );
  this.$$minOccurs[ "ProductName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ProductName = new xsd_string();
  }
  this.$$childElementFunctions[ "ProductName" ] = xsd_string;
  this.$$elementChildren.push( "ProductName" );
  this.$$minOccurs[ "Catalog" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Catalog = new xsd_string();
  }
  this.$$childElementFunctions[ "Catalog" ] = xsd_string;
  this.$$elementChildren.push( "Catalog" );
  this.$$minOccurs[ "KeyPhrases" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.KeyPhrases = new KeyPhraseArray();
  }
  this.$$childElementFunctions[ "KeyPhrases" ] = KeyPhraseArray;
  this.$$elementChildren.push( "KeyPhrases" );
  this.$$minOccurs[ "Artists" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Artists = new ArtistArray();
  }
  this.$$childElementFunctions[ "Artists" ] = ArtistArray;
  this.$$elementChildren.push( "Artists" );
  this.$$minOccurs[ "Authors" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Authors = new AuthorArray();
  }
  this.$$childElementFunctions[ "Authors" ] = AuthorArray;
  this.$$elementChildren.push( "Authors" );
  this.$$minOccurs[ "Mpn" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Mpn = new xsd_string();
  }
  this.$$childElementFunctions[ "Mpn" ] = xsd_string;
  this.$$elementChildren.push( "Mpn" );
  this.$$minOccurs[ "Starring" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Starring = new StarringArray();
  }
  this.$$childElementFunctions[ "Starring" ] = StarringArray;
  this.$$elementChildren.push( "Starring" );
  this.$$minOccurs[ "Directors" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Directors = new DirectorArray();
  }
  this.$$childElementFunctions[ "Directors" ] = DirectorArray;
  this.$$elementChildren.push( "Directors" );
  this.$$minOccurs[ "TheatricalReleaseDate" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.TheatricalReleaseDate = new xsd_string();
  }
  this.$$childElementFunctions[ "TheatricalReleaseDate" ] = xsd_string;
  this.$$elementChildren.push( "TheatricalReleaseDate" );
  this.$$minOccurs[ "ReleaseDate" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ReleaseDate = new xsd_string();
  }
  this.$$childElementFunctions[ "ReleaseDate" ] = xsd_string;
  this.$$elementChildren.push( "ReleaseDate" );
  this.$$minOccurs[ "Manufacturer" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Manufacturer = new xsd_string();
  }
  this.$$childElementFunctions[ "Manufacturer" ] = xsd_string;
  this.$$elementChildren.push( "Manufacturer" );
  this.$$minOccurs[ "Distributor" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Distributor = new xsd_string();
  }
  this.$$childElementFunctions[ "Distributor" ] = xsd_string;
  this.$$elementChildren.push( "Distributor" );
  this.$$minOccurs[ "ImageUrlSmall" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ImageUrlSmall = new xsd_string();
  }
  this.$$childElementFunctions[ "ImageUrlSmall" ] = xsd_string;
  this.$$elementChildren.push( "ImageUrlSmall" );
  this.$$minOccurs[ "ImageUrlMedium" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ImageUrlMedium = new xsd_string();
  }
  this.$$childElementFunctions[ "ImageUrlMedium" ] = xsd_string;
  this.$$elementChildren.push( "ImageUrlMedium" );
  this.$$minOccurs[ "ImageUrlLarge" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ImageUrlLarge = new xsd_string();
  }
  this.$$childElementFunctions[ "ImageUrlLarge" ] = xsd_string;
  this.$$elementChildren.push( "ImageUrlLarge" );
  this.$$minOccurs[ "ListPrice" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ListPrice = new xsd_string();
  }
  this.$$childElementFunctions[ "ListPrice" ] = xsd_string;
  this.$$elementChildren.push( "ListPrice" );
  this.$$minOccurs[ "OurPrice" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.OurPrice = new xsd_string();
  }
  this.$$childElementFunctions[ "OurPrice" ] = xsd_string;
  this.$$elementChildren.push( "OurPrice" );
  this.$$minOccurs[ "UsedPrice" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.UsedPrice = new xsd_string();
  }
  this.$$childElementFunctions[ "UsedPrice" ] = xsd_string;
  this.$$elementChildren.push( "UsedPrice" );
  this.$$minOccurs[ "RefurbishedPrice" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.RefurbishedPrice = new xsd_string();
  }
  this.$$childElementFunctions[ "RefurbishedPrice" ] = xsd_string;
  this.$$elementChildren.push( "RefurbishedPrice" );
  this.$$minOccurs[ "CollectiblePrice" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.CollectiblePrice = new xsd_string();
  }
  this.$$childElementFunctions[ "CollectiblePrice" ] = xsd_string;
  this.$$elementChildren.push( "CollectiblePrice" );
  this.$$minOccurs[ "ThirdPartyNewPrice" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ThirdPartyNewPrice = new xsd_string();
  }
  this.$$childElementFunctions[ "ThirdPartyNewPrice" ] = xsd_string;
  this.$$elementChildren.push( "ThirdPartyNewPrice" );
  this.$$minOccurs[ "NumberOfOfferings" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.NumberOfOfferings = new xsd_string();
  }
  this.$$childElementFunctions[ "NumberOfOfferings" ] = xsd_string;
  this.$$elementChildren.push( "NumberOfOfferings" );
  this.$$minOccurs[ "ThirdPartyNewCount" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ThirdPartyNewCount = new xsd_string();
  }
  this.$$childElementFunctions[ "ThirdPartyNewCount" ] = xsd_string;
  this.$$elementChildren.push( "ThirdPartyNewCount" );
  this.$$minOccurs[ "UsedCount" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.UsedCount = new xsd_string();
  }
  this.$$childElementFunctions[ "UsedCount" ] = xsd_string;
  this.$$elementChildren.push( "UsedCount" );
  this.$$minOccurs[ "CollectibleCount" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.CollectibleCount = new xsd_string();
  }
  this.$$childElementFunctions[ "CollectibleCount" ] = xsd_string;
  this.$$elementChildren.push( "CollectibleCount" );
  this.$$minOccurs[ "RefurbishedCount" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.RefurbishedCount = new xsd_string();
  }
  this.$$childElementFunctions[ "RefurbishedCount" ] = xsd_string;
  this.$$elementChildren.push( "RefurbishedCount" );
  this.$$minOccurs[ "ThirdPartyProductInfo" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ThirdPartyProductInfo = new ThirdPartyProductInfo();
  }
  this.$$childElementFunctions[ "ThirdPartyProductInfo" ] = ThirdPartyProductInfo;
  this.$$elementChildren.push( "ThirdPartyProductInfo" );
  this.$$minOccurs[ "SalesRank" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.SalesRank = new xsd_string();
  }
  this.$$childElementFunctions[ "SalesRank" ] = xsd_string;
  this.$$elementChildren.push( "SalesRank" );
  this.$$minOccurs[ "BrowseList" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.BrowseList = new BrowseNodeArray();
  }
  this.$$childElementFunctions[ "BrowseList" ] = BrowseNodeArray;
  this.$$elementChildren.push( "BrowseList" );
  this.$$minOccurs[ "Media" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Media = new xsd_string();
  }
  this.$$childElementFunctions[ "Media" ] = xsd_string;
  this.$$elementChildren.push( "Media" );
  this.$$minOccurs[ "ReadingLevel" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ReadingLevel = new xsd_string();
  }
  this.$$childElementFunctions[ "ReadingLevel" ] = xsd_string;
  this.$$elementChildren.push( "ReadingLevel" );
  this.$$minOccurs[ "NumberOfPages" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.NumberOfPages = new xsd_string();
  }
  this.$$childElementFunctions[ "NumberOfPages" ] = xsd_string;
  this.$$elementChildren.push( "NumberOfPages" );
  this.$$minOccurs[ "NumberOfIssues" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.NumberOfIssues = new xsd_string();
  }
  this.$$childElementFunctions[ "NumberOfIssues" ] = xsd_string;
  this.$$elementChildren.push( "NumberOfIssues" );
  this.$$minOccurs[ "IssuesPerYear" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.IssuesPerYear = new xsd_string();
  }
  this.$$childElementFunctions[ "IssuesPerYear" ] = xsd_string;
  this.$$elementChildren.push( "IssuesPerYear" );
  this.$$minOccurs[ "SubscriptionLength" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.SubscriptionLength = new xsd_string();
  }
  this.$$childElementFunctions[ "SubscriptionLength" ] = xsd_string;
  this.$$elementChildren.push( "SubscriptionLength" );
  this.$$minOccurs[ "DeweyNumber" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.DeweyNumber = new xsd_string();
  }
  this.$$childElementFunctions[ "DeweyNumber" ] = xsd_string;
  this.$$elementChildren.push( "DeweyNumber" );
  this.$$minOccurs[ "RunningTime" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.RunningTime = new xsd_string();
  }
  this.$$childElementFunctions[ "RunningTime" ] = xsd_string;
  this.$$elementChildren.push( "RunningTime" );
  this.$$minOccurs[ "Publisher" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Publisher = new xsd_string();
  }
  this.$$childElementFunctions[ "Publisher" ] = xsd_string;
  this.$$elementChildren.push( "Publisher" );
  this.$$minOccurs[ "NumMedia" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.NumMedia = new xsd_string();
  }
  this.$$childElementFunctions[ "NumMedia" ] = xsd_string;
  this.$$elementChildren.push( "NumMedia" );
  this.$$minOccurs[ "Isbn" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Isbn = new xsd_string();
  }
  this.$$childElementFunctions[ "Isbn" ] = xsd_string;
  this.$$elementChildren.push( "Isbn" );
  this.$$minOccurs[ "Features" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Features = new FeaturesArray();
  }
  this.$$childElementFunctions[ "Features" ] = FeaturesArray;
  this.$$elementChildren.push( "Features" );
  this.$$minOccurs[ "MpaaRating" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.MpaaRating = new xsd_string();
  }
  this.$$childElementFunctions[ "MpaaRating" ] = xsd_string;
  this.$$elementChildren.push( "MpaaRating" );
  this.$$minOccurs[ "EsrbRating" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.EsrbRating = new xsd_string();
  }
  this.$$childElementFunctions[ "EsrbRating" ] = xsd_string;
  this.$$elementChildren.push( "EsrbRating" );
  this.$$minOccurs[ "AgeGroup" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.AgeGroup = new xsd_string();
  }
  this.$$childElementFunctions[ "AgeGroup" ] = xsd_string;
  this.$$elementChildren.push( "AgeGroup" );
  this.$$minOccurs[ "Availability" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Availability = new xsd_string();
  }
  this.$$childElementFunctions[ "Availability" ] = xsd_string;
  this.$$elementChildren.push( "Availability" );
  this.$$minOccurs[ "Upc" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Upc = new xsd_string();
  }
  this.$$childElementFunctions[ "Upc" ] = xsd_string;
  this.$$elementChildren.push( "Upc" );
  this.$$minOccurs[ "Tracks" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Tracks = new TrackArray();
  }
  this.$$childElementFunctions[ "Tracks" ] = TrackArray;
  this.$$elementChildren.push( "Tracks" );
  this.$$minOccurs[ "Accessories" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Accessories = new AccessoryArray();
  }
  this.$$childElementFunctions[ "Accessories" ] = AccessoryArray;
  this.$$elementChildren.push( "Accessories" );
  this.$$minOccurs[ "Platforms" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Platforms = new PlatformArray();
  }
  this.$$childElementFunctions[ "Platforms" ] = PlatformArray;
  this.$$elementChildren.push( "Platforms" );
  this.$$minOccurs[ "Encoding" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Encoding = new xsd_string();
  }
  this.$$childElementFunctions[ "Encoding" ] = xsd_string;
  this.$$elementChildren.push( "Encoding" );
  this.$$minOccurs[ "Reviews" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Reviews = new Reviews();
  }
  this.$$childElementFunctions[ "Reviews" ] = Reviews;
  this.$$elementChildren.push( "Reviews" );
  this.$$minOccurs[ "SimilarProducts" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.SimilarProducts = new SimilarProductsArray();
  }
  this.$$childElementFunctions[ "SimilarProducts" ] = SimilarProductsArray;
  this.$$elementChildren.push( "SimilarProducts" );
  this.$$minOccurs[ "Lists" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Lists = new ListArray();
  }
  this.$$childElementFunctions[ "Lists" ] = ListArray;
  this.$$elementChildren.push( "Lists" );
  this.$$minOccurs[ "Status" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Status = new xsd_string();
  }
  this.$$childElementFunctions[ "Status" ] = xsd_string;
  this.$$elementChildren.push( "Status" );
}

function KeyPhraseArray(  ) 
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
  this.$$name = "KeyPhraseArray";
  this.$$xmlNames[ "KeyPhraseArray" ] = "KeyPhraseArray";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.item = new Array();  // of KeyPhrase
  this.item.$$nsPrefix = "ns1"
 // method to create a new member of the item array
  this.item.newInstance = function( bDeserializing )
  {
    var newObj = new KeyPhrase( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.item_newInstance = function( bDeserializing )
  {
    var newLen = this.item.push( new KeyPhrase( bDeserializing ) );
    return this.item[ newLen-1 ];
  }
  this.length = function()
  {
    return this.item.length;
  }
  this.KeyPhrase = this.item;
  this.KeyPhrase_newInstance = this.item_newInstance;
  this.KeyPhrase.newInstance = this.item.newInstance;
  this.$$elementChildren.push( "item" );
}

function KeyPhrase(  ) 
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
  this.$$name = "KeyPhrase";
  this.$$xmlNames[ "KeyPhrase" ] = "KeyPhrase";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "KeyPhrase" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.KeyPhrase = new xsd_string();
  }
  this.$$childElementFunctions[ "KeyPhrase" ] = xsd_string;
  this.$$elementChildren.push( "KeyPhrase" );
  this.$$minOccurs[ "Type" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Type = new xsd_string();
  }
  this.$$childElementFunctions[ "Type" ] = xsd_string;
  this.$$elementChildren.push( "Type" );
}

function ArtistArray(  ) 
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
  this.$$name = "ArtistArray";
  this.$$xmlNames[ "ArtistArray" ] = "ArtistArray";
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

function AuthorArray(  ) 
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
  this.$$name = "AuthorArray";
  this.$$xmlNames[ "AuthorArray" ] = "AuthorArray";
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

function StarringArray(  ) 
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
  this.$$name = "StarringArray";
  this.$$xmlNames[ "StarringArray" ] = "StarringArray";
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

function DirectorArray(  ) 
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
  this.$$name = "DirectorArray";
  this.$$xmlNames[ "DirectorArray" ] = "DirectorArray";
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

function BrowseNodeArray(  ) 
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
  this.$$name = "BrowseNodeArray";
  this.$$xmlNames[ "BrowseNodeArray" ] = "BrowseNodeArray";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.item = new Array();  // of BrowseNode
  this.item.$$nsPrefix = "ns1"
 // method to create a new member of the item array
  this.item.newInstance = function( bDeserializing )
  {
    var newObj = new BrowseNode( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.item_newInstance = function( bDeserializing )
  {
    var newLen = this.item.push( new BrowseNode( bDeserializing ) );
    return this.item[ newLen-1 ];
  }
  this.length = function()
  {
    return this.item.length;
  }
  this.BrowseNode = this.item;
  this.BrowseNode_newInstance = this.item_newInstance;
  this.BrowseNode.newInstance = this.item.newInstance;
  this.$$elementChildren.push( "item" );
}

function BrowseNode(  ) 
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
  this.$$name = "BrowseNode";
  this.$$xmlNames[ "BrowseNode" ] = "BrowseNode";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "BrowseId" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.BrowseId = new xsd_string();
  }
  this.$$childElementFunctions[ "BrowseId" ] = xsd_string;
  this.$$elementChildren.push( "BrowseId" );
  this.$$minOccurs[ "BrowseName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.BrowseName = new xsd_string();
  }
  this.$$childElementFunctions[ "BrowseName" ] = xsd_string;
  this.$$elementChildren.push( "BrowseName" );
}

function FeaturesArray(  ) 
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
  this.$$name = "FeaturesArray";
  this.$$xmlNames[ "FeaturesArray" ] = "FeaturesArray";
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

function TrackArray(  ) 
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
  this.$$name = "TrackArray";
  this.$$xmlNames[ "TrackArray" ] = "TrackArray";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.item = new Array();  // of Track
  this.item.$$nsPrefix = "ns1"
 // method to create a new member of the item array
  this.item.newInstance = function( bDeserializing )
  {
    var newObj = new Track( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.item_newInstance = function( bDeserializing )
  {
    var newLen = this.item.push( new Track( bDeserializing ) );
    return this.item[ newLen-1 ];
  }
  this.length = function()
  {
    return this.item.length;
  }
  this.Track = this.item;
  this.Track_newInstance = this.item_newInstance;
  this.Track.newInstance = this.item.newInstance;
  this.$$elementChildren.push( "item" );
}

function Track(  ) 
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
  this.$$name = "Track";
  this.$$xmlNames[ "Track" ] = "Track";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "TrackName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.TrackName = new xsd_string();
  }
  this.$$childElementFunctions[ "TrackName" ] = xsd_string;
  this.$$elementChildren.push( "TrackName" );
  this.$$minOccurs[ "ByArtist" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ByArtist = new xsd_string();
  }
  this.$$childElementFunctions[ "ByArtist" ] = xsd_string;
  this.$$elementChildren.push( "ByArtist" );
}

function AccessoryArray(  ) 
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
  this.$$name = "AccessoryArray";
  this.$$xmlNames[ "AccessoryArray" ] = "AccessoryArray";
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

function PlatformArray(  ) 
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
  this.$$name = "PlatformArray";
  this.$$xmlNames[ "PlatformArray" ] = "PlatformArray";
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

function Reviews(  ) 
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
  this.$$name = "Reviews";
  this.$$xmlNames[ "Reviews" ] = "Reviews";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "AvgCustomerRating" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.AvgCustomerRating = new xsd_string();
  }
  this.$$childElementFunctions[ "AvgCustomerRating" ] = xsd_string;
  this.$$elementChildren.push( "AvgCustomerRating" );
  this.$$minOccurs[ "TotalCustomerReviews" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.TotalCustomerReviews = new xsd_string();
  }
  this.$$childElementFunctions[ "TotalCustomerReviews" ] = xsd_string;
  this.$$elementChildren.push( "TotalCustomerReviews" );
  this.$$minOccurs[ "CustomerReviews" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.CustomerReviews = new CustomerReviewArray();
  }
  this.$$childElementFunctions[ "CustomerReviews" ] = CustomerReviewArray;
  this.$$elementChildren.push( "CustomerReviews" );
}

function CustomerReviewArray(  ) 
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
  this.$$name = "CustomerReviewArray";
  this.$$xmlNames[ "CustomerReviewArray" ] = "CustomerReviewArray";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.item = new Array();  // of CustomerReview
  this.item.$$nsPrefix = "ns1"
 // method to create a new member of the item array
  this.item.newInstance = function( bDeserializing )
  {
    var newObj = new CustomerReview( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.item_newInstance = function( bDeserializing )
  {
    var newLen = this.item.push( new CustomerReview( bDeserializing ) );
    return this.item[ newLen-1 ];
  }
  this.length = function()
  {
    return this.item.length;
  }
  this.CustomerReview = this.item;
  this.CustomerReview_newInstance = this.item_newInstance;
  this.CustomerReview.newInstance = this.item.newInstance;
  this.$$elementChildren.push( "item" );
}

function CustomerReview(  ) 
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
  this.$$name = "CustomerReview";
  this.$$xmlNames[ "CustomerReview" ] = "CustomerReview";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "Rating" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Rating = new xsd_string();
  }
  this.$$childElementFunctions[ "Rating" ] = xsd_string;
  this.$$elementChildren.push( "Rating" );
  this.$$minOccurs[ "Summary" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Summary = new xsd_string();
  }
  this.$$childElementFunctions[ "Summary" ] = xsd_string;
  this.$$elementChildren.push( "Summary" );
  this.$$minOccurs[ "Comment" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Comment = new xsd_string();
  }
  this.$$childElementFunctions[ "Comment" ] = xsd_string;
  this.$$elementChildren.push( "Comment" );
}

function SimilarProductsArray(  ) 
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
  this.$$name = "SimilarProductsArray";
  this.$$xmlNames[ "SimilarProductsArray" ] = "SimilarProductsArray";
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

function ListArray(  ) 
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
  this.$$name = "ListArray";
  this.$$xmlNames[ "ListArray" ] = "ListArray";
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

function MarketplaceSearch(  ) 
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
  this.$$name = "MarketplaceSearch";
  this.$$xmlNames[ "MarketplaceSearch" ] = "MarketplaceSearch";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.MarketplaceSearchDetails = new MarketplaceSearchDetailsArray();
  }
  this.$$childElementFunctions[ "MarketplaceSearchDetails" ] = MarketplaceSearchDetailsArray;
  this.$$elementChildren.push( "MarketplaceSearchDetails" );
}

function SellerProfile(  ) 
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
  this.$$name = "SellerProfile";
  this.$$xmlNames[ "SellerProfile" ] = "SellerProfile";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.SellerProfileDetails = new SellerProfileDetailsArray();
  }
  this.$$childElementFunctions[ "SellerProfileDetails" ] = SellerProfileDetailsArray;
  this.$$elementChildren.push( "SellerProfileDetails" );
}

function SellerSearch(  ) 
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
  this.$$name = "SellerSearch";
  this.$$xmlNames[ "SellerSearch" ] = "SellerSearch";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.SellerSearchDetails = new SellerSearchDetailsArray();
  }
  this.$$childElementFunctions[ "SellerSearchDetails" ] = SellerSearchDetailsArray;
  this.$$elementChildren.push( "SellerSearchDetails" );
}

function MarketplaceSearchDetails(  ) 
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
  this.$$name = "MarketplaceSearchDetails";
  this.$$xmlNames[ "MarketplaceSearchDetails" ] = "MarketplaceSearchDetails";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "NumberOfOpenListings" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.NumberOfOpenListings = new xsd_string();
  }
  this.$$childElementFunctions[ "NumberOfOpenListings" ] = xsd_string;
  this.$$elementChildren.push( "NumberOfOpenListings" );
  this.$$minOccurs[ "ListingProductInfo" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ListingProductInfo = new ListingProductInfo();
  }
  this.$$childElementFunctions[ "ListingProductInfo" ] = ListingProductInfo;
  this.$$elementChildren.push( "ListingProductInfo" );
}

function MarketplaceSearchDetailsArray(  ) 
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
  this.$$name = "MarketplaceSearchDetailsArray";
  this.$$xmlNames[ "MarketplaceSearchDetailsArray" ] = "MarketplaceSearchDetailsArray";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.item = new Array();  // of MarketplaceSearchDetails
  this.item.$$nsPrefix = "ns1"
 // method to create a new member of the item array
  this.item.newInstance = function( bDeserializing )
  {
    var newObj = new MarketplaceSearchDetails( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.item_newInstance = function( bDeserializing )
  {
    var newLen = this.item.push( new MarketplaceSearchDetails( bDeserializing ) );
    return this.item[ newLen-1 ];
  }
  this.length = function()
  {
    return this.item.length;
  }
  this.MarketplaceSearchDetails = this.item;
  this.MarketplaceSearchDetails_newInstance = this.item_newInstance;
  this.MarketplaceSearchDetails.newInstance = this.item.newInstance;
  this.$$elementChildren.push( "item" );
}

function SellerProfileDetails(  ) 
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
  this.$$name = "SellerProfileDetails";
  this.$$xmlNames[ "SellerProfileDetails" ] = "SellerProfileDetails";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "SellerNickname" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.SellerNickname = new xsd_string();
  }
  this.$$childElementFunctions[ "SellerNickname" ] = xsd_string;
  this.$$elementChildren.push( "SellerNickname" );
  this.$$minOccurs[ "OverallFeedbackRating" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.OverallFeedbackRating = new xsd_string();
  }
  this.$$childElementFunctions[ "OverallFeedbackRating" ] = xsd_string;
  this.$$elementChildren.push( "OverallFeedbackRating" );
  this.$$minOccurs[ "NumberOfFeedback" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.NumberOfFeedback = new xsd_string();
  }
  this.$$childElementFunctions[ "NumberOfFeedback" ] = xsd_string;
  this.$$elementChildren.push( "NumberOfFeedback" );
  this.$$minOccurs[ "NumberOfCanceledBids" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.NumberOfCanceledBids = new xsd_string();
  }
  this.$$childElementFunctions[ "NumberOfCanceledBids" ] = xsd_string;
  this.$$elementChildren.push( "NumberOfCanceledBids" );
  this.$$minOccurs[ "NumberOfCanceledAuctions" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.NumberOfCanceledAuctions = new xsd_string();
  }
  this.$$childElementFunctions[ "NumberOfCanceledAuctions" ] = xsd_string;
  this.$$elementChildren.push( "NumberOfCanceledAuctions" );
  this.$$minOccurs[ "StoreId" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.StoreId = new xsd_string();
  }
  this.$$childElementFunctions[ "StoreId" ] = xsd_string;
  this.$$elementChildren.push( "StoreId" );
  this.$$minOccurs[ "StoreName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.StoreName = new xsd_string();
  }
  this.$$childElementFunctions[ "StoreName" ] = xsd_string;
  this.$$elementChildren.push( "StoreName" );
  this.$$minOccurs[ "SellerFeedback" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.SellerFeedback = new SellerFeedback();
  }
  this.$$childElementFunctions[ "SellerFeedback" ] = SellerFeedback;
  this.$$elementChildren.push( "SellerFeedback" );
}

function SellerProfileDetailsArray(  ) 
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
  this.$$name = "SellerProfileDetailsArray";
  this.$$xmlNames[ "SellerProfileDetailsArray" ] = "SellerProfileDetailsArray";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.item = new Array();  // of SellerProfileDetails
  this.item.$$nsPrefix = "ns1"
 // method to create a new member of the item array
  this.item.newInstance = function( bDeserializing )
  {
    var newObj = new SellerProfileDetails( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.item_newInstance = function( bDeserializing )
  {
    var newLen = this.item.push( new SellerProfileDetails( bDeserializing ) );
    return this.item[ newLen-1 ];
  }
  this.length = function()
  {
    return this.item.length;
  }
  this.SellerProfileDetails = this.item;
  this.SellerProfileDetails_newInstance = this.item_newInstance;
  this.SellerProfileDetails.newInstance = this.item.newInstance;
  this.$$elementChildren.push( "item" );
}

function SellerSearchDetails(  ) 
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
  this.$$name = "SellerSearchDetails";
  this.$$xmlNames[ "SellerSearchDetails" ] = "SellerSearchDetails";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "SellerNickname" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.SellerNickname = new xsd_string();
  }
  this.$$childElementFunctions[ "SellerNickname" ] = xsd_string;
  this.$$elementChildren.push( "SellerNickname" );
  this.$$minOccurs[ "StoreId" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.StoreId = new xsd_string();
  }
  this.$$childElementFunctions[ "StoreId" ] = xsd_string;
  this.$$elementChildren.push( "StoreId" );
  this.$$minOccurs[ "StoreName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.StoreName = new xsd_string();
  }
  this.$$childElementFunctions[ "StoreName" ] = xsd_string;
  this.$$elementChildren.push( "StoreName" );
  this.$$minOccurs[ "NumberOfOpenListings" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.NumberOfOpenListings = new xsd_string();
  }
  this.$$childElementFunctions[ "NumberOfOpenListings" ] = xsd_string;
  this.$$elementChildren.push( "NumberOfOpenListings" );
  this.$$minOccurs[ "ListingProductInfo" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ListingProductInfo = new ListingProductInfo();
  }
  this.$$childElementFunctions[ "ListingProductInfo" ] = ListingProductInfo;
  this.$$elementChildren.push( "ListingProductInfo" );
}

function SellerSearchDetailsArray(  ) 
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
  this.$$name = "SellerSearchDetailsArray";
  this.$$xmlNames[ "SellerSearchDetailsArray" ] = "SellerSearchDetailsArray";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.item = new Array();  // of SellerSearchDetails
  this.item.$$nsPrefix = "ns1"
 // method to create a new member of the item array
  this.item.newInstance = function( bDeserializing )
  {
    var newObj = new SellerSearchDetails( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.item_newInstance = function( bDeserializing )
  {
    var newLen = this.item.push( new SellerSearchDetails( bDeserializing ) );
    return this.item[ newLen-1 ];
  }
  this.length = function()
  {
    return this.item.length;
  }
  this.SellerSearchDetails = this.item;
  this.SellerSearchDetails_newInstance = this.item_newInstance;
  this.SellerSearchDetails.newInstance = this.item.newInstance;
  this.$$elementChildren.push( "item" );
}

function ListingProductInfo(  ) 
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
  this.$$name = "ListingProductInfo";
  this.$$xmlNames[ "ListingProductInfo" ] = "ListingProductInfo";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.ListingProductDetails = new ListingProductDetailsArray();
  }
  this.$$childElementFunctions[ "ListingProductDetails" ] = ListingProductDetailsArray;
  this.$$elementChildren.push( "ListingProductDetails" );
}

function ListingProductDetailsArray(  ) 
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
  this.$$name = "ListingProductDetailsArray";
  this.$$xmlNames[ "ListingProductDetailsArray" ] = "ListingProductDetailsArray";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.item = new Array();  // of ListingProductDetails
  this.item.$$nsPrefix = "ns1"
 // method to create a new member of the item array
  this.item.newInstance = function( bDeserializing )
  {
    var newObj = new ListingProductDetails( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.item_newInstance = function( bDeserializing )
  {
    var newLen = this.item.push( new ListingProductDetails( bDeserializing ) );
    return this.item[ newLen-1 ];
  }
  this.length = function()
  {
    return this.item.length;
  }
  this.ListingProductDetails = this.item;
  this.ListingProductDetails_newInstance = this.item_newInstance;
  this.ListingProductDetails.newInstance = this.item.newInstance;
  this.$$elementChildren.push( "item" );
}

function ListingProductDetails(  ) 
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
  this.$$name = "ListingProductDetails";
  this.$$xmlNames[ "ListingProductDetails" ] = "ListingProductDetails";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "ExchangeId" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ExchangeId = new xsd_string();
  }
  this.$$childElementFunctions[ "ExchangeId" ] = xsd_string;
  this.$$elementChildren.push( "ExchangeId" );
  this.$$minOccurs[ "ListingId" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ListingId = new xsd_string();
  }
  this.$$childElementFunctions[ "ListingId" ] = xsd_string;
  this.$$elementChildren.push( "ListingId" );
  this.$$minOccurs[ "ExchangeTitle" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ExchangeTitle = new xsd_string();
  }
  this.$$childElementFunctions[ "ExchangeTitle" ] = xsd_string;
  this.$$elementChildren.push( "ExchangeTitle" );
  this.$$minOccurs[ "ExchangePrice" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ExchangePrice = new xsd_string();
  }
  this.$$childElementFunctions[ "ExchangePrice" ] = xsd_string;
  this.$$elementChildren.push( "ExchangePrice" );
  this.$$minOccurs[ "ExchangeAsin" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ExchangeAsin = new xsd_string();
  }
  this.$$childElementFunctions[ "ExchangeAsin" ] = xsd_string;
  this.$$elementChildren.push( "ExchangeAsin" );
  this.$$minOccurs[ "ExchangeEndDate" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ExchangeEndDate = new xsd_string();
  }
  this.$$childElementFunctions[ "ExchangeEndDate" ] = xsd_string;
  this.$$elementChildren.push( "ExchangeEndDate" );
  this.$$minOccurs[ "ExchangeTinyImage" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ExchangeTinyImage = new xsd_string();
  }
  this.$$childElementFunctions[ "ExchangeTinyImage" ] = xsd_string;
  this.$$elementChildren.push( "ExchangeTinyImage" );
  this.$$minOccurs[ "ExchangeSellerId" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ExchangeSellerId = new xsd_string();
  }
  this.$$childElementFunctions[ "ExchangeSellerId" ] = xsd_string;
  this.$$elementChildren.push( "ExchangeSellerId" );
  this.$$minOccurs[ "ExchangeSellerNickname" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ExchangeSellerNickname = new xsd_string();
  }
  this.$$childElementFunctions[ "ExchangeSellerNickname" ] = xsd_string;
  this.$$elementChildren.push( "ExchangeSellerNickname" );
  this.$$minOccurs[ "ExchangeStartDate" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ExchangeStartDate = new xsd_string();
  }
  this.$$childElementFunctions[ "ExchangeStartDate" ] = xsd_string;
  this.$$elementChildren.push( "ExchangeStartDate" );
  this.$$minOccurs[ "ExchangeStatus" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ExchangeStatus = new xsd_string();
  }
  this.$$childElementFunctions[ "ExchangeStatus" ] = xsd_string;
  this.$$elementChildren.push( "ExchangeStatus" );
  this.$$minOccurs[ "ExchangeQuantity" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ExchangeQuantity = new xsd_string();
  }
  this.$$childElementFunctions[ "ExchangeQuantity" ] = xsd_string;
  this.$$elementChildren.push( "ExchangeQuantity" );
  this.$$minOccurs[ "ExchangeQuantityAllocated" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ExchangeQuantityAllocated = new xsd_string();
  }
  this.$$childElementFunctions[ "ExchangeQuantityAllocated" ] = xsd_string;
  this.$$elementChildren.push( "ExchangeQuantityAllocated" );
  this.$$minOccurs[ "ExchangeFeaturedCategory" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ExchangeFeaturedCategory = new xsd_string();
  }
  this.$$childElementFunctions[ "ExchangeFeaturedCategory" ] = xsd_string;
  this.$$elementChildren.push( "ExchangeFeaturedCategory" );
  this.$$minOccurs[ "ExchangeCondition" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ExchangeCondition = new xsd_string();
  }
  this.$$childElementFunctions[ "ExchangeCondition" ] = xsd_string;
  this.$$elementChildren.push( "ExchangeCondition" );
  this.$$minOccurs[ "ExchangeConditionType" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ExchangeConditionType = new xsd_string();
  }
  this.$$childElementFunctions[ "ExchangeConditionType" ] = xsd_string;
  this.$$elementChildren.push( "ExchangeConditionType" );
  this.$$minOccurs[ "ExchangeAvailability" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ExchangeAvailability = new xsd_string();
  }
  this.$$childElementFunctions[ "ExchangeAvailability" ] = xsd_string;
  this.$$elementChildren.push( "ExchangeAvailability" );
  this.$$minOccurs[ "ExchangeOfferingType" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ExchangeOfferingType = new xsd_string();
  }
  this.$$childElementFunctions[ "ExchangeOfferingType" ] = xsd_string;
  this.$$elementChildren.push( "ExchangeOfferingType" );
  this.$$minOccurs[ "ExchangeSellerState" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ExchangeSellerState = new xsd_string();
  }
  this.$$childElementFunctions[ "ExchangeSellerState" ] = xsd_string;
  this.$$elementChildren.push( "ExchangeSellerState" );
  this.$$minOccurs[ "ExchangeSellerCountry" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ExchangeSellerCountry = new xsd_string();
  }
  this.$$childElementFunctions[ "ExchangeSellerCountry" ] = xsd_string;
  this.$$elementChildren.push( "ExchangeSellerCountry" );
  this.$$minOccurs[ "ExchangeSellerRating" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ExchangeSellerRating = new xsd_string();
  }
  this.$$childElementFunctions[ "ExchangeSellerRating" ] = xsd_string;
  this.$$elementChildren.push( "ExchangeSellerRating" );
}

function SellerFeedback(  ) 
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
  this.$$name = "SellerFeedback";
  this.$$xmlNames[ "SellerFeedback" ] = "SellerFeedback";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.Feedback = new FeedbackArray();
  }
  this.$$childElementFunctions[ "Feedback" ] = FeedbackArray;
  this.$$elementChildren.push( "Feedback" );
}

function FeedbackArray(  ) 
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
  this.$$name = "FeedbackArray";
  this.$$xmlNames[ "FeedbackArray" ] = "FeedbackArray";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.item = new Array();  // of Feedback
  this.item.$$nsPrefix = "ns1"
 // method to create a new member of the item array
  this.item.newInstance = function( bDeserializing )
  {
    var newObj = new Feedback( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.item_newInstance = function( bDeserializing )
  {
    var newLen = this.item.push( new Feedback( bDeserializing ) );
    return this.item[ newLen-1 ];
  }
  this.length = function()
  {
    return this.item.length;
  }
  this.Feedback = this.item;
  this.Feedback_newInstance = this.item_newInstance;
  this.Feedback.newInstance = this.item.newInstance;
  this.$$elementChildren.push( "item" );
}

function Feedback(  ) 
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
  this.$$name = "Feedback";
  this.$$xmlNames[ "Feedback" ] = "Feedback";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "FeedbackRating" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FeedbackRating = new xsd_string();
  }
  this.$$childElementFunctions[ "FeedbackRating" ] = xsd_string;
  this.$$elementChildren.push( "FeedbackRating" );
  this.$$minOccurs[ "FeedbackComments" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FeedbackComments = new xsd_string();
  }
  this.$$childElementFunctions[ "FeedbackComments" ] = xsd_string;
  this.$$elementChildren.push( "FeedbackComments" );
  this.$$minOccurs[ "FeedbackDate" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FeedbackDate = new xsd_string();
  }
  this.$$childElementFunctions[ "FeedbackDate" ] = xsd_string;
  this.$$elementChildren.push( "FeedbackDate" );
  this.$$minOccurs[ "FeedbackRater" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.FeedbackRater = new xsd_string();
  }
  this.$$childElementFunctions[ "FeedbackRater" ] = xsd_string;
  this.$$elementChildren.push( "FeedbackRater" );
}

function ThirdPartyProductInfo(  ) 
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
  this.$$name = "ThirdPartyProductInfo";
  this.$$xmlNames[ "ThirdPartyProductInfo" ] = "ThirdPartyProductInfo";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.ThirdPartyProductDetails = new ThirdPartyProductDetailsArray();
  }
  this.$$childElementFunctions[ "ThirdPartyProductDetails" ] = ThirdPartyProductDetailsArray;
  this.$$elementChildren.push( "ThirdPartyProductDetails" );
}

function ThirdPartyProductDetailsArray(  ) 
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
  this.$$name = "ThirdPartyProductDetailsArray";
  this.$$xmlNames[ "ThirdPartyProductDetailsArray" ] = "ThirdPartyProductDetailsArray";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.item = new Array();  // of ThirdPartyProductDetails
  this.item.$$nsPrefix = "ns1"
 // method to create a new member of the item array
  this.item.newInstance = function( bDeserializing )
  {
    var newObj = new ThirdPartyProductDetails( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.item_newInstance = function( bDeserializing )
  {
    var newLen = this.item.push( new ThirdPartyProductDetails( bDeserializing ) );
    return this.item[ newLen-1 ];
  }
  this.length = function()
  {
    return this.item.length;
  }
  this.ThirdPartyProductDetails = this.item;
  this.ThirdPartyProductDetails_newInstance = this.item_newInstance;
  this.ThirdPartyProductDetails.newInstance = this.item.newInstance;
  this.$$elementChildren.push( "item" );
}

function ThirdPartyProductDetails(  ) 
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
  this.$$name = "ThirdPartyProductDetails";
  this.$$xmlNames[ "ThirdPartyProductDetails" ] = "ThirdPartyProductDetails";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "OfferingType" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.OfferingType = new xsd_string();
  }
  this.$$childElementFunctions[ "OfferingType" ] = xsd_string;
  this.$$elementChildren.push( "OfferingType" );
  this.$$minOccurs[ "SellerId" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.SellerId = new xsd_string();
  }
  this.$$childElementFunctions[ "SellerId" ] = xsd_string;
  this.$$elementChildren.push( "SellerId" );
  this.$$minOccurs[ "SellerNickname" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.SellerNickname = new xsd_string();
  }
  this.$$childElementFunctions[ "SellerNickname" ] = xsd_string;
  this.$$elementChildren.push( "SellerNickname" );
  this.$$minOccurs[ "ExchangeId" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ExchangeId = new xsd_string();
  }
  this.$$childElementFunctions[ "ExchangeId" ] = xsd_string;
  this.$$elementChildren.push( "ExchangeId" );
  this.$$minOccurs[ "OfferingPrice" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.OfferingPrice = new xsd_string();
  }
  this.$$childElementFunctions[ "OfferingPrice" ] = xsd_string;
  this.$$elementChildren.push( "OfferingPrice" );
  this.$$minOccurs[ "Condition" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Condition = new xsd_string();
  }
  this.$$childElementFunctions[ "Condition" ] = xsd_string;
  this.$$elementChildren.push( "Condition" );
  this.$$minOccurs[ "ConditionType" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ConditionType = new xsd_string();
  }
  this.$$childElementFunctions[ "ConditionType" ] = xsd_string;
  this.$$elementChildren.push( "ConditionType" );
  this.$$minOccurs[ "ExchangeAvailability" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ExchangeAvailability = new xsd_string();
  }
  this.$$childElementFunctions[ "ExchangeAvailability" ] = xsd_string;
  this.$$elementChildren.push( "ExchangeAvailability" );
  this.$$minOccurs[ "SellerCountry" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.SellerCountry = new xsd_string();
  }
  this.$$childElementFunctions[ "SellerCountry" ] = xsd_string;
  this.$$elementChildren.push( "SellerCountry" );
  this.$$minOccurs[ "SellerState" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.SellerState = new xsd_string();
  }
  this.$$childElementFunctions[ "SellerState" ] = xsd_string;
  this.$$elementChildren.push( "SellerState" );
  this.$$minOccurs[ "ShipComments" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ShipComments = new xsd_string();
  }
  this.$$childElementFunctions[ "ShipComments" ] = xsd_string;
  this.$$elementChildren.push( "ShipComments" );
  this.$$minOccurs[ "SellerRating" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.SellerRating = new xsd_string();
  }
  this.$$childElementFunctions[ "SellerRating" ] = xsd_string;
  this.$$elementChildren.push( "SellerRating" );
}

function KeywordRequest(  ) 
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
  this.$$name = "KeywordRequest";
  this.$$xmlNames[ "KeywordRequest" ] = "KeywordRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.keyword = new xsd_string();
  }
  this.$$childElementFunctions[ "keyword" ] = xsd_string;
  this.$$elementChildren.push( "keyword" );
  if ( this.$$deserializing == undefined )
  {
  this.page = new xsd_string();
  }
  this.$$childElementFunctions[ "page" ] = xsd_string;
  this.$$elementChildren.push( "page" );
  if ( this.$$deserializing == undefined )
  {
  this.mode = new xsd_string();
  }
  this.$$childElementFunctions[ "mode" ] = xsd_string;
  this.$$elementChildren.push( "mode" );
  if ( this.$$deserializing == undefined )
  {
  this.tag = new xsd_string();
  }
  this.$$childElementFunctions[ "tag" ] = xsd_string;
  this.$$elementChildren.push( "tag" );
  if ( this.$$deserializing == undefined )
  {
  this.type = new xsd_string();
  }
  this.$$childElementFunctions[ "type" ] = xsd_string;
  this.$$elementChildren.push( "type" );
  if ( this.$$deserializing == undefined )
  {
  this.devtag = new xsd_string();
  }
  this.$$childElementFunctions[ "devtag" ] = xsd_string;
  this.$$elementChildren.push( "devtag" );
  this.$$minOccurs[ "sort" ] = 0;
  this.$$xmlNames["_sort"] = "sort";
  this.$$objNames["sort"] = "_sort";
  if ( this.$$deserializing == undefined )
  {
  this._sort = new xsd_string();
  }
  this.$$childElementFunctions[ "_sort" ] = xsd_string;
  this.$$elementChildren.push( "_sort" );
  this.$$minOccurs[ "variations" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.variations = new xsd_string();
  }
  this.$$childElementFunctions[ "variations" ] = xsd_string;
  this.$$elementChildren.push( "variations" );
  this.$$minOccurs[ "locale" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.locale = new xsd_string();
  }
  this.$$childElementFunctions[ "locale" ] = xsd_string;
  this.$$elementChildren.push( "locale" );
}

function PowerRequest(  ) 
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
  this.$$name = "PowerRequest";
  this.$$xmlNames[ "PowerRequest" ] = "PowerRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.power = new xsd_string();
  }
  this.$$childElementFunctions[ "power" ] = xsd_string;
  this.$$elementChildren.push( "power" );
  if ( this.$$deserializing == undefined )
  {
  this.page = new xsd_string();
  }
  this.$$childElementFunctions[ "page" ] = xsd_string;
  this.$$elementChildren.push( "page" );
  if ( this.$$deserializing == undefined )
  {
  this.mode = new xsd_string();
  }
  this.$$childElementFunctions[ "mode" ] = xsd_string;
  this.$$elementChildren.push( "mode" );
  if ( this.$$deserializing == undefined )
  {
  this.tag = new xsd_string();
  }
  this.$$childElementFunctions[ "tag" ] = xsd_string;
  this.$$elementChildren.push( "tag" );
  if ( this.$$deserializing == undefined )
  {
  this.type = new xsd_string();
  }
  this.$$childElementFunctions[ "type" ] = xsd_string;
  this.$$elementChildren.push( "type" );
  if ( this.$$deserializing == undefined )
  {
  this.devtag = new xsd_string();
  }
  this.$$childElementFunctions[ "devtag" ] = xsd_string;
  this.$$elementChildren.push( "devtag" );
  this.$$minOccurs[ "sort" ] = 0;
  this.$$xmlNames["_sort"] = "sort";
  this.$$objNames["sort"] = "_sort";
  if ( this.$$deserializing == undefined )
  {
  this._sort = new xsd_string();
  }
  this.$$childElementFunctions[ "_sort" ] = xsd_string;
  this.$$elementChildren.push( "_sort" );
  this.$$minOccurs[ "variations" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.variations = new xsd_string();
  }
  this.$$childElementFunctions[ "variations" ] = xsd_string;
  this.$$elementChildren.push( "variations" );
  this.$$minOccurs[ "locale" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.locale = new xsd_string();
  }
  this.$$childElementFunctions[ "locale" ] = xsd_string;
  this.$$elementChildren.push( "locale" );
}

function BrowseNodeRequest(  ) 
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
  this.$$name = "BrowseNodeRequest";
  this.$$xmlNames[ "BrowseNodeRequest" ] = "BrowseNodeRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.browse_node = new xsd_string();
  }
  this.$$childElementFunctions[ "browse_node" ] = xsd_string;
  this.$$elementChildren.push( "browse_node" );
  if ( this.$$deserializing == undefined )
  {
  this.page = new xsd_string();
  }
  this.$$childElementFunctions[ "page" ] = xsd_string;
  this.$$elementChildren.push( "page" );
  if ( this.$$deserializing == undefined )
  {
  this.mode = new xsd_string();
  }
  this.$$childElementFunctions[ "mode" ] = xsd_string;
  this.$$elementChildren.push( "mode" );
  if ( this.$$deserializing == undefined )
  {
  this.tag = new xsd_string();
  }
  this.$$childElementFunctions[ "tag" ] = xsd_string;
  this.$$elementChildren.push( "tag" );
  if ( this.$$deserializing == undefined )
  {
  this.type = new xsd_string();
  }
  this.$$childElementFunctions[ "type" ] = xsd_string;
  this.$$elementChildren.push( "type" );
  if ( this.$$deserializing == undefined )
  {
  this.devtag = new xsd_string();
  }
  this.$$childElementFunctions[ "devtag" ] = xsd_string;
  this.$$elementChildren.push( "devtag" );
  this.$$minOccurs[ "sort" ] = 0;
  this.$$xmlNames["_sort"] = "sort";
  this.$$objNames["sort"] = "_sort";
  if ( this.$$deserializing == undefined )
  {
  this._sort = new xsd_string();
  }
  this.$$childElementFunctions[ "_sort" ] = xsd_string;
  this.$$elementChildren.push( "_sort" );
  this.$$minOccurs[ "locale" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.locale = new xsd_string();
  }
  this.$$childElementFunctions[ "locale" ] = xsd_string;
  this.$$elementChildren.push( "locale" );
}

function AsinRequest(  ) 
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
  this.$$name = "AsinRequest";
  this.$$xmlNames[ "AsinRequest" ] = "AsinRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.asin = new xsd_string();
  }
  this.$$childElementFunctions[ "asin" ] = xsd_string;
  this.$$elementChildren.push( "asin" );
  if ( this.$$deserializing == undefined )
  {
  this.tag = new xsd_string();
  }
  this.$$childElementFunctions[ "tag" ] = xsd_string;
  this.$$elementChildren.push( "tag" );
  if ( this.$$deserializing == undefined )
  {
  this.type = new xsd_string();
  }
  this.$$childElementFunctions[ "type" ] = xsd_string;
  this.$$elementChildren.push( "type" );
  if ( this.$$deserializing == undefined )
  {
  this.devtag = new xsd_string();
  }
  this.$$childElementFunctions[ "devtag" ] = xsd_string;
  this.$$elementChildren.push( "devtag" );
  this.$$minOccurs[ "offer" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.offer = new xsd_string();
  }
  this.$$childElementFunctions[ "offer" ] = xsd_string;
  this.$$elementChildren.push( "offer" );
  this.$$minOccurs[ "offerpage" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.offerpage = new xsd_string();
  }
  this.$$childElementFunctions[ "offerpage" ] = xsd_string;
  this.$$elementChildren.push( "offerpage" );
  this.$$minOccurs[ "locale" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.locale = new xsd_string();
  }
  this.$$childElementFunctions[ "locale" ] = xsd_string;
  this.$$elementChildren.push( "locale" );
}

function BlendedRequest(  ) 
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
  this.$$name = "BlendedRequest";
  this.$$xmlNames[ "BlendedRequest" ] = "BlendedRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.blended = new xsd_string();
  }
  this.$$childElementFunctions[ "blended" ] = xsd_string;
  this.$$elementChildren.push( "blended" );
  if ( this.$$deserializing == undefined )
  {
  this.tag = new xsd_string();
  }
  this.$$childElementFunctions[ "tag" ] = xsd_string;
  this.$$elementChildren.push( "tag" );
  if ( this.$$deserializing == undefined )
  {
  this.type = new xsd_string();
  }
  this.$$childElementFunctions[ "type" ] = xsd_string;
  this.$$elementChildren.push( "type" );
  if ( this.$$deserializing == undefined )
  {
  this.devtag = new xsd_string();
  }
  this.$$childElementFunctions[ "devtag" ] = xsd_string;
  this.$$elementChildren.push( "devtag" );
  this.$$minOccurs[ "locale" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.locale = new xsd_string();
  }
  this.$$childElementFunctions[ "locale" ] = xsd_string;
  this.$$elementChildren.push( "locale" );
}

function UpcRequest(  ) 
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
  this.$$name = "UpcRequest";
  this.$$xmlNames[ "UpcRequest" ] = "UpcRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.upc = new xsd_string();
  }
  this.$$childElementFunctions[ "upc" ] = xsd_string;
  this.$$elementChildren.push( "upc" );
  if ( this.$$deserializing == undefined )
  {
  this.mode = new xsd_string();
  }
  this.$$childElementFunctions[ "mode" ] = xsd_string;
  this.$$elementChildren.push( "mode" );
  if ( this.$$deserializing == undefined )
  {
  this.tag = new xsd_string();
  }
  this.$$childElementFunctions[ "tag" ] = xsd_string;
  this.$$elementChildren.push( "tag" );
  if ( this.$$deserializing == undefined )
  {
  this.type = new xsd_string();
  }
  this.$$childElementFunctions[ "type" ] = xsd_string;
  this.$$elementChildren.push( "type" );
  if ( this.$$deserializing == undefined )
  {
  this.devtag = new xsd_string();
  }
  this.$$childElementFunctions[ "devtag" ] = xsd_string;
  this.$$elementChildren.push( "devtag" );
  this.$$minOccurs[ "sort" ] = 0;
  this.$$xmlNames["_sort"] = "sort";
  this.$$objNames["sort"] = "_sort";
  if ( this.$$deserializing == undefined )
  {
  this._sort = new xsd_string();
  }
  this.$$childElementFunctions[ "_sort" ] = xsd_string;
  this.$$elementChildren.push( "_sort" );
  this.$$minOccurs[ "variations" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.variations = new xsd_string();
  }
  this.$$childElementFunctions[ "variations" ] = xsd_string;
  this.$$elementChildren.push( "variations" );
  this.$$minOccurs[ "locale" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.locale = new xsd_string();
  }
  this.$$childElementFunctions[ "locale" ] = xsd_string;
  this.$$elementChildren.push( "locale" );
}

function ArtistRequest(  ) 
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
  this.$$name = "ArtistRequest";
  this.$$xmlNames[ "ArtistRequest" ] = "ArtistRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.artist = new xsd_string();
  }
  this.$$childElementFunctions[ "artist" ] = xsd_string;
  this.$$elementChildren.push( "artist" );
  if ( this.$$deserializing == undefined )
  {
  this.page = new xsd_string();
  }
  this.$$childElementFunctions[ "page" ] = xsd_string;
  this.$$elementChildren.push( "page" );
  if ( this.$$deserializing == undefined )
  {
  this.mode = new xsd_string();
  }
  this.$$childElementFunctions[ "mode" ] = xsd_string;
  this.$$elementChildren.push( "mode" );
  if ( this.$$deserializing == undefined )
  {
  this.tag = new xsd_string();
  }
  this.$$childElementFunctions[ "tag" ] = xsd_string;
  this.$$elementChildren.push( "tag" );
  if ( this.$$deserializing == undefined )
  {
  this.type = new xsd_string();
  }
  this.$$childElementFunctions[ "type" ] = xsd_string;
  this.$$elementChildren.push( "type" );
  if ( this.$$deserializing == undefined )
  {
  this.devtag = new xsd_string();
  }
  this.$$childElementFunctions[ "devtag" ] = xsd_string;
  this.$$elementChildren.push( "devtag" );
  this.$$minOccurs[ "sort" ] = 0;
  this.$$xmlNames["_sort"] = "sort";
  this.$$objNames["sort"] = "_sort";
  if ( this.$$deserializing == undefined )
  {
  this._sort = new xsd_string();
  }
  this.$$childElementFunctions[ "_sort" ] = xsd_string;
  this.$$elementChildren.push( "_sort" );
  this.$$minOccurs[ "variations" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.variations = new xsd_string();
  }
  this.$$childElementFunctions[ "variations" ] = xsd_string;
  this.$$elementChildren.push( "variations" );
  this.$$minOccurs[ "locale" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.locale = new xsd_string();
  }
  this.$$childElementFunctions[ "locale" ] = xsd_string;
  this.$$elementChildren.push( "locale" );
}

function AuthorRequest(  ) 
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
  this.$$name = "AuthorRequest";
  this.$$xmlNames[ "AuthorRequest" ] = "AuthorRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.author = new xsd_string();
  }
  this.$$childElementFunctions[ "author" ] = xsd_string;
  this.$$elementChildren.push( "author" );
  if ( this.$$deserializing == undefined )
  {
  this.page = new xsd_string();
  }
  this.$$childElementFunctions[ "page" ] = xsd_string;
  this.$$elementChildren.push( "page" );
  if ( this.$$deserializing == undefined )
  {
  this.mode = new xsd_string();
  }
  this.$$childElementFunctions[ "mode" ] = xsd_string;
  this.$$elementChildren.push( "mode" );
  if ( this.$$deserializing == undefined )
  {
  this.tag = new xsd_string();
  }
  this.$$childElementFunctions[ "tag" ] = xsd_string;
  this.$$elementChildren.push( "tag" );
  if ( this.$$deserializing == undefined )
  {
  this.type = new xsd_string();
  }
  this.$$childElementFunctions[ "type" ] = xsd_string;
  this.$$elementChildren.push( "type" );
  if ( this.$$deserializing == undefined )
  {
  this.devtag = new xsd_string();
  }
  this.$$childElementFunctions[ "devtag" ] = xsd_string;
  this.$$elementChildren.push( "devtag" );
  this.$$minOccurs[ "sort" ] = 0;
  this.$$xmlNames["_sort"] = "sort";
  this.$$objNames["sort"] = "_sort";
  if ( this.$$deserializing == undefined )
  {
  this._sort = new xsd_string();
  }
  this.$$childElementFunctions[ "_sort" ] = xsd_string;
  this.$$elementChildren.push( "_sort" );
  this.$$minOccurs[ "variations" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.variations = new xsd_string();
  }
  this.$$childElementFunctions[ "variations" ] = xsd_string;
  this.$$elementChildren.push( "variations" );
  this.$$minOccurs[ "locale" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.locale = new xsd_string();
  }
  this.$$childElementFunctions[ "locale" ] = xsd_string;
  this.$$elementChildren.push( "locale" );
}

function ActorRequest(  ) 
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
  this.$$name = "ActorRequest";
  this.$$xmlNames[ "ActorRequest" ] = "ActorRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.actor = new xsd_string();
  }
  this.$$childElementFunctions[ "actor" ] = xsd_string;
  this.$$elementChildren.push( "actor" );
  if ( this.$$deserializing == undefined )
  {
  this.page = new xsd_string();
  }
  this.$$childElementFunctions[ "page" ] = xsd_string;
  this.$$elementChildren.push( "page" );
  if ( this.$$deserializing == undefined )
  {
  this.mode = new xsd_string();
  }
  this.$$childElementFunctions[ "mode" ] = xsd_string;
  this.$$elementChildren.push( "mode" );
  if ( this.$$deserializing == undefined )
  {
  this.tag = new xsd_string();
  }
  this.$$childElementFunctions[ "tag" ] = xsd_string;
  this.$$elementChildren.push( "tag" );
  if ( this.$$deserializing == undefined )
  {
  this.type = new xsd_string();
  }
  this.$$childElementFunctions[ "type" ] = xsd_string;
  this.$$elementChildren.push( "type" );
  if ( this.$$deserializing == undefined )
  {
  this.devtag = new xsd_string();
  }
  this.$$childElementFunctions[ "devtag" ] = xsd_string;
  this.$$elementChildren.push( "devtag" );
  this.$$minOccurs[ "sort" ] = 0;
  this.$$xmlNames["_sort"] = "sort";
  this.$$objNames["sort"] = "_sort";
  if ( this.$$deserializing == undefined )
  {
  this._sort = new xsd_string();
  }
  this.$$childElementFunctions[ "_sort" ] = xsd_string;
  this.$$elementChildren.push( "_sort" );
  this.$$minOccurs[ "variations" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.variations = new xsd_string();
  }
  this.$$childElementFunctions[ "variations" ] = xsd_string;
  this.$$elementChildren.push( "variations" );
  this.$$minOccurs[ "locale" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.locale = new xsd_string();
  }
  this.$$childElementFunctions[ "locale" ] = xsd_string;
  this.$$elementChildren.push( "locale" );
}

function DirectorRequest(  ) 
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
  this.$$name = "DirectorRequest";
  this.$$xmlNames[ "DirectorRequest" ] = "DirectorRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.director = new xsd_string();
  }
  this.$$childElementFunctions[ "director" ] = xsd_string;
  this.$$elementChildren.push( "director" );
  if ( this.$$deserializing == undefined )
  {
  this.page = new xsd_string();
  }
  this.$$childElementFunctions[ "page" ] = xsd_string;
  this.$$elementChildren.push( "page" );
  if ( this.$$deserializing == undefined )
  {
  this.mode = new xsd_string();
  }
  this.$$childElementFunctions[ "mode" ] = xsd_string;
  this.$$elementChildren.push( "mode" );
  if ( this.$$deserializing == undefined )
  {
  this.tag = new xsd_string();
  }
  this.$$childElementFunctions[ "tag" ] = xsd_string;
  this.$$elementChildren.push( "tag" );
  if ( this.$$deserializing == undefined )
  {
  this.type = new xsd_string();
  }
  this.$$childElementFunctions[ "type" ] = xsd_string;
  this.$$elementChildren.push( "type" );
  if ( this.$$deserializing == undefined )
  {
  this.devtag = new xsd_string();
  }
  this.$$childElementFunctions[ "devtag" ] = xsd_string;
  this.$$elementChildren.push( "devtag" );
  this.$$minOccurs[ "sort" ] = 0;
  this.$$xmlNames["_sort"] = "sort";
  this.$$objNames["sort"] = "_sort";
  if ( this.$$deserializing == undefined )
  {
  this._sort = new xsd_string();
  }
  this.$$childElementFunctions[ "_sort" ] = xsd_string;
  this.$$elementChildren.push( "_sort" );
  this.$$minOccurs[ "variations" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.variations = new xsd_string();
  }
  this.$$childElementFunctions[ "variations" ] = xsd_string;
  this.$$elementChildren.push( "variations" );
  this.$$minOccurs[ "locale" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.locale = new xsd_string();
  }
  this.$$childElementFunctions[ "locale" ] = xsd_string;
  this.$$elementChildren.push( "locale" );
}

function ExchangeRequest(  ) 
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
  this.$$name = "ExchangeRequest";
  this.$$xmlNames[ "ExchangeRequest" ] = "ExchangeRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.exchange_id = new xsd_string();
  }
  this.$$childElementFunctions[ "exchange_id" ] = xsd_string;
  this.$$elementChildren.push( "exchange_id" );
  if ( this.$$deserializing == undefined )
  {
  this.tag = new xsd_string();
  }
  this.$$childElementFunctions[ "tag" ] = xsd_string;
  this.$$elementChildren.push( "tag" );
  if ( this.$$deserializing == undefined )
  {
  this.type = new xsd_string();
  }
  this.$$childElementFunctions[ "type" ] = xsd_string;
  this.$$elementChildren.push( "type" );
  if ( this.$$deserializing == undefined )
  {
  this.devtag = new xsd_string();
  }
  this.$$childElementFunctions[ "devtag" ] = xsd_string;
  this.$$elementChildren.push( "devtag" );
  this.$$minOccurs[ "locale" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.locale = new xsd_string();
  }
  this.$$childElementFunctions[ "locale" ] = xsd_string;
  this.$$elementChildren.push( "locale" );
}

function ManufacturerRequest(  ) 
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
  this.$$name = "ManufacturerRequest";
  this.$$xmlNames[ "ManufacturerRequest" ] = "ManufacturerRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.manufacturer = new xsd_string();
  }
  this.$$childElementFunctions[ "manufacturer" ] = xsd_string;
  this.$$elementChildren.push( "manufacturer" );
  if ( this.$$deserializing == undefined )
  {
  this.page = new xsd_string();
  }
  this.$$childElementFunctions[ "page" ] = xsd_string;
  this.$$elementChildren.push( "page" );
  if ( this.$$deserializing == undefined )
  {
  this.mode = new xsd_string();
  }
  this.$$childElementFunctions[ "mode" ] = xsd_string;
  this.$$elementChildren.push( "mode" );
  if ( this.$$deserializing == undefined )
  {
  this.tag = new xsd_string();
  }
  this.$$childElementFunctions[ "tag" ] = xsd_string;
  this.$$elementChildren.push( "tag" );
  if ( this.$$deserializing == undefined )
  {
  this.type = new xsd_string();
  }
  this.$$childElementFunctions[ "type" ] = xsd_string;
  this.$$elementChildren.push( "type" );
  if ( this.$$deserializing == undefined )
  {
  this.devtag = new xsd_string();
  }
  this.$$childElementFunctions[ "devtag" ] = xsd_string;
  this.$$elementChildren.push( "devtag" );
  this.$$minOccurs[ "sort" ] = 0;
  this.$$xmlNames["_sort"] = "sort";
  this.$$objNames["sort"] = "_sort";
  if ( this.$$deserializing == undefined )
  {
  this._sort = new xsd_string();
  }
  this.$$childElementFunctions[ "_sort" ] = xsd_string;
  this.$$elementChildren.push( "_sort" );
  this.$$minOccurs[ "variations" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.variations = new xsd_string();
  }
  this.$$childElementFunctions[ "variations" ] = xsd_string;
  this.$$elementChildren.push( "variations" );
  this.$$minOccurs[ "locale" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.locale = new xsd_string();
  }
  this.$$childElementFunctions[ "locale" ] = xsd_string;
  this.$$elementChildren.push( "locale" );
}

function ListManiaRequest(  ) 
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
  this.$$name = "ListManiaRequest";
  this.$$xmlNames[ "ListManiaRequest" ] = "ListManiaRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.lm_id = new xsd_string();
  }
  this.$$childElementFunctions[ "lm_id" ] = xsd_string;
  this.$$elementChildren.push( "lm_id" );
  if ( this.$$deserializing == undefined )
  {
  this.page = new xsd_string();
  }
  this.$$childElementFunctions[ "page" ] = xsd_string;
  this.$$elementChildren.push( "page" );
  if ( this.$$deserializing == undefined )
  {
  this.tag = new xsd_string();
  }
  this.$$childElementFunctions[ "tag" ] = xsd_string;
  this.$$elementChildren.push( "tag" );
  if ( this.$$deserializing == undefined )
  {
  this.type = new xsd_string();
  }
  this.$$childElementFunctions[ "type" ] = xsd_string;
  this.$$elementChildren.push( "type" );
  if ( this.$$deserializing == undefined )
  {
  this.devtag = new xsd_string();
  }
  this.$$childElementFunctions[ "devtag" ] = xsd_string;
  this.$$elementChildren.push( "devtag" );
  this.$$minOccurs[ "locale" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.locale = new xsd_string();
  }
  this.$$childElementFunctions[ "locale" ] = xsd_string;
  this.$$elementChildren.push( "locale" );
}

function WishlistRequest(  ) 
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
  this.$$name = "WishlistRequest";
  this.$$xmlNames[ "WishlistRequest" ] = "WishlistRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.wishlist_id = new xsd_string();
  }
  this.$$childElementFunctions[ "wishlist_id" ] = xsd_string;
  this.$$elementChildren.push( "wishlist_id" );
  if ( this.$$deserializing == undefined )
  {
  this.page = new xsd_string();
  }
  this.$$childElementFunctions[ "page" ] = xsd_string;
  this.$$elementChildren.push( "page" );
  if ( this.$$deserializing == undefined )
  {
  this.tag = new xsd_string();
  }
  this.$$childElementFunctions[ "tag" ] = xsd_string;
  this.$$elementChildren.push( "tag" );
  if ( this.$$deserializing == undefined )
  {
  this.type = new xsd_string();
  }
  this.$$childElementFunctions[ "type" ] = xsd_string;
  this.$$elementChildren.push( "type" );
  if ( this.$$deserializing == undefined )
  {
  this.devtag = new xsd_string();
  }
  this.$$childElementFunctions[ "devtag" ] = xsd_string;
  this.$$elementChildren.push( "devtag" );
  this.$$minOccurs[ "locale" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.locale = new xsd_string();
  }
  this.$$childElementFunctions[ "locale" ] = xsd_string;
  this.$$elementChildren.push( "locale" );
}

function MarketplaceRequest(  ) 
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
  this.$$name = "MarketplaceRequest";
  this.$$xmlNames[ "MarketplaceRequest" ] = "MarketplaceRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.marketplace_search = new xsd_string();
  }
  this.$$childElementFunctions[ "marketplace_search" ] = xsd_string;
  this.$$elementChildren.push( "marketplace_search" );
  if ( this.$$deserializing == undefined )
  {
  this.tag = new xsd_string();
  }
  this.$$childElementFunctions[ "tag" ] = xsd_string;
  this.$$elementChildren.push( "tag" );
  if ( this.$$deserializing == undefined )
  {
  this.type = new xsd_string();
  }
  this.$$childElementFunctions[ "type" ] = xsd_string;
  this.$$elementChildren.push( "type" );
  if ( this.$$deserializing == undefined )
  {
  this.devtag = new xsd_string();
  }
  this.$$childElementFunctions[ "devtag" ] = xsd_string;
  this.$$elementChildren.push( "devtag" );
  if ( this.$$deserializing == undefined )
  {
  this.page = new xsd_string();
  }
  this.$$childElementFunctions[ "page" ] = xsd_string;
  this.$$elementChildren.push( "page" );
  this.$$minOccurs[ "keyword" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.keyword = new xsd_string();
  }
  this.$$childElementFunctions[ "keyword" ] = xsd_string;
  this.$$elementChildren.push( "keyword" );
  this.$$minOccurs[ "keyword_search" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.keyword_search = new xsd_string();
  }
  this.$$childElementFunctions[ "keyword_search" ] = xsd_string;
  this.$$elementChildren.push( "keyword_search" );
  this.$$minOccurs[ "browse_id" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.browse_id = new xsd_string();
  }
  this.$$childElementFunctions[ "browse_id" ] = xsd_string;
  this.$$elementChildren.push( "browse_id" );
  this.$$minOccurs[ "zipcode" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.zipcode = new xsd_string();
  }
  this.$$childElementFunctions[ "zipcode" ] = xsd_string;
  this.$$elementChildren.push( "zipcode" );
  this.$$minOccurs[ "area_id" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.area_id = new xsd_string();
  }
  this.$$childElementFunctions[ "area_id" ] = xsd_string;
  this.$$elementChildren.push( "area_id" );
  this.$$minOccurs[ "geo" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.geo = new xsd_string();
  }
  this.$$childElementFunctions[ "geo" ] = xsd_string;
  this.$$elementChildren.push( "geo" );
  this.$$minOccurs[ "sort" ] = 0;
  this.$$xmlNames["_sort"] = "sort";
  this.$$objNames["sort"] = "_sort";
  if ( this.$$deserializing == undefined )
  {
  this._sort = new xsd_string();
  }
  this.$$childElementFunctions[ "_sort" ] = xsd_string;
  this.$$elementChildren.push( "_sort" );
  this.$$minOccurs[ "listing_id" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.listing_id = new xsd_string();
  }
  this.$$childElementFunctions[ "listing_id" ] = xsd_string;
  this.$$elementChildren.push( "listing_id" );
  this.$$minOccurs[ "locale" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.locale = new xsd_string();
  }
  this.$$childElementFunctions[ "locale" ] = xsd_string;
  this.$$elementChildren.push( "locale" );
  this.$$minOccurs[ "index" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.index = new xsd_string();
  }
  this.$$childElementFunctions[ "index" ] = xsd_string;
  this.$$elementChildren.push( "index" );
}

function SellerProfileRequest(  ) 
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
  this.$$name = "SellerProfileRequest";
  this.$$xmlNames[ "SellerProfileRequest" ] = "SellerProfileRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.seller_id = new xsd_string();
  }
  this.$$childElementFunctions[ "seller_id" ] = xsd_string;
  this.$$elementChildren.push( "seller_id" );
  if ( this.$$deserializing == undefined )
  {
  this.tag = new xsd_string();
  }
  this.$$childElementFunctions[ "tag" ] = xsd_string;
  this.$$elementChildren.push( "tag" );
  if ( this.$$deserializing == undefined )
  {
  this.type = new xsd_string();
  }
  this.$$childElementFunctions[ "type" ] = xsd_string;
  this.$$elementChildren.push( "type" );
  if ( this.$$deserializing == undefined )
  {
  this.devtag = new xsd_string();
  }
  this.$$childElementFunctions[ "devtag" ] = xsd_string;
  this.$$elementChildren.push( "devtag" );
  if ( this.$$deserializing == undefined )
  {
  this.page = new xsd_string();
  }
  this.$$childElementFunctions[ "page" ] = xsd_string;
  this.$$elementChildren.push( "page" );
  this.$$minOccurs[ "locale" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.locale = new xsd_string();
  }
  this.$$childElementFunctions[ "locale" ] = xsd_string;
  this.$$elementChildren.push( "locale" );
}

function SellerRequest(  ) 
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
  this.$$name = "SellerRequest";
  this.$$xmlNames[ "SellerRequest" ] = "SellerRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.seller_id = new xsd_string();
  }
  this.$$childElementFunctions[ "seller_id" ] = xsd_string;
  this.$$elementChildren.push( "seller_id" );
  if ( this.$$deserializing == undefined )
  {
  this.tag = new xsd_string();
  }
  this.$$childElementFunctions[ "tag" ] = xsd_string;
  this.$$elementChildren.push( "tag" );
  if ( this.$$deserializing == undefined )
  {
  this.type = new xsd_string();
  }
  this.$$childElementFunctions[ "type" ] = xsd_string;
  this.$$elementChildren.push( "type" );
  if ( this.$$deserializing == undefined )
  {
  this.devtag = new xsd_string();
  }
  this.$$childElementFunctions[ "devtag" ] = xsd_string;
  this.$$elementChildren.push( "devtag" );
  if ( this.$$deserializing == undefined )
  {
  this.offerstatus = new xsd_string();
  }
  this.$$childElementFunctions[ "offerstatus" ] = xsd_string;
  this.$$elementChildren.push( "offerstatus" );
  if ( this.$$deserializing == undefined )
  {
  this.page = new xsd_string();
  }
  this.$$childElementFunctions[ "page" ] = xsd_string;
  this.$$elementChildren.push( "page" );
  this.$$minOccurs[ "seller_browse_id" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.seller_browse_id = new xsd_string();
  }
  this.$$childElementFunctions[ "seller_browse_id" ] = xsd_string;
  this.$$elementChildren.push( "seller_browse_id" );
  this.$$minOccurs[ "keyword" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.keyword = new xsd_string();
  }
  this.$$childElementFunctions[ "keyword" ] = xsd_string;
  this.$$elementChildren.push( "keyword" );
  this.$$minOccurs[ "locale" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.locale = new xsd_string();
  }
  this.$$childElementFunctions[ "locale" ] = xsd_string;
  this.$$elementChildren.push( "locale" );
  this.$$minOccurs[ "index" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.index = new xsd_string();
  }
  this.$$childElementFunctions[ "index" ] = xsd_string;
  this.$$elementChildren.push( "index" );
}

function SimilarityRequest(  ) 
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
  this.$$name = "SimilarityRequest";
  this.$$xmlNames[ "SimilarityRequest" ] = "SimilarityRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.asin = new xsd_string();
  }
  this.$$childElementFunctions[ "asin" ] = xsd_string;
  this.$$elementChildren.push( "asin" );
  if ( this.$$deserializing == undefined )
  {
  this.tag = new xsd_string();
  }
  this.$$childElementFunctions[ "tag" ] = xsd_string;
  this.$$elementChildren.push( "tag" );
  if ( this.$$deserializing == undefined )
  {
  this.type = new xsd_string();
  }
  this.$$childElementFunctions[ "type" ] = xsd_string;
  this.$$elementChildren.push( "type" );
  if ( this.$$deserializing == undefined )
  {
  this.devtag = new xsd_string();
  }
  this.$$childElementFunctions[ "devtag" ] = xsd_string;
  this.$$elementChildren.push( "devtag" );
  this.$$minOccurs[ "locale" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.locale = new xsd_string();
  }
  this.$$childElementFunctions[ "locale" ] = xsd_string;
  this.$$elementChildren.push( "locale" );
}

function ItemIdArray(  ) 
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
  this.$$name = "ItemIdArray";
  this.$$xmlNames[ "ItemIdArray" ] = "ItemIdArray";
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

function ItemArray(  ) 
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
  this.$$name = "ItemArray";
  this.$$xmlNames[ "ItemArray" ] = "ItemArray";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.item = new Array();  // of Item
  this.item.$$nsPrefix = "ns1"
 // method to create a new member of the item array
  this.item.newInstance = function( bDeserializing )
  {
    var newObj = new Item( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.item_newInstance = function( bDeserializing )
  {
    var newLen = this.item.push( new Item( bDeserializing ) );
    return this.item[ newLen-1 ];
  }
  this.length = function()
  {
    return this.item.length;
  }
  this.Item = this.item;
  this.Item_newInstance = this.item_newInstance;
  this.Item.newInstance = this.item.newInstance;
  this.$$elementChildren.push( "item" );
}

function Item(  ) 
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
  this.$$name = "Item";
  this.$$xmlNames[ "Item" ] = "Item";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.ItemId = new xsd_string();
  }
  this.$$childElementFunctions[ "ItemId" ] = xsd_string;
  this.$$elementChildren.push( "ItemId" );
  if ( this.$$deserializing == undefined )
  {
  this.ProductName = new xsd_string();
  }
  this.$$childElementFunctions[ "ProductName" ] = xsd_string;
  this.$$elementChildren.push( "ProductName" );
  if ( this.$$deserializing == undefined )
  {
  this.Catalog = new xsd_string();
  }
  this.$$childElementFunctions[ "Catalog" ] = xsd_string;
  this.$$elementChildren.push( "Catalog" );
  this.$$minOccurs[ "Asin" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Asin = new xsd_string();
  }
  this.$$childElementFunctions[ "Asin" ] = xsd_string;
  this.$$elementChildren.push( "Asin" );
  this.$$minOccurs[ "ExchangeId" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ExchangeId = new xsd_string();
  }
  this.$$childElementFunctions[ "ExchangeId" ] = xsd_string;
  this.$$elementChildren.push( "ExchangeId" );
  if ( this.$$deserializing == undefined )
  {
  this.Quantity = new xsd_string();
  }
  this.$$childElementFunctions[ "Quantity" ] = xsd_string;
  this.$$elementChildren.push( "Quantity" );
  this.$$minOccurs[ "ListPrice" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ListPrice = new xsd_string();
  }
  this.$$childElementFunctions[ "ListPrice" ] = xsd_string;
  this.$$elementChildren.push( "ListPrice" );
  if ( this.$$deserializing == undefined )
  {
  this.OurPrice = new xsd_string();
  }
  this.$$childElementFunctions[ "OurPrice" ] = xsd_string;
  this.$$elementChildren.push( "OurPrice" );
}

function ItemQuantityArray(  ) 
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
  this.$$name = "ItemQuantityArray";
  this.$$xmlNames[ "ItemQuantityArray" ] = "ItemQuantityArray";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.item = new Array();  // of ItemQuantity
  this.item.$$nsPrefix = "ns1"
 // method to create a new member of the item array
  this.item.newInstance = function( bDeserializing )
  {
    var newObj = new ItemQuantity( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.item_newInstance = function( bDeserializing )
  {
    var newLen = this.item.push( new ItemQuantity( bDeserializing ) );
    return this.item[ newLen-1 ];
  }
  this.length = function()
  {
    return this.item.length;
  }
  this.ItemQuantity = this.item;
  this.ItemQuantity_newInstance = this.item_newInstance;
  this.ItemQuantity.newInstance = this.item.newInstance;
  this.$$elementChildren.push( "item" );
}

function ItemQuantity(  ) 
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
  this.$$name = "ItemQuantity";
  this.$$xmlNames[ "ItemQuantity" ] = "ItemQuantity";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.ItemId = new xsd_string();
  }
  this.$$childElementFunctions[ "ItemId" ] = xsd_string;
  this.$$elementChildren.push( "ItemId" );
  if ( this.$$deserializing == undefined )
  {
  this.Quantity = new xsd_string();
  }
  this.$$childElementFunctions[ "Quantity" ] = xsd_string;
  this.$$elementChildren.push( "Quantity" );
}

function AddItemArray(  ) 
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
  this.$$name = "AddItemArray";
  this.$$xmlNames[ "AddItemArray" ] = "AddItemArray";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.item = new Array();  // of AddItem
  this.item.$$nsPrefix = "ns1"
 // method to create a new member of the item array
  this.item.newInstance = function( bDeserializing )
  {
    var newObj = new AddItem( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.item_newInstance = function( bDeserializing )
  {
    var newLen = this.item.push( new AddItem( bDeserializing ) );
    return this.item[ newLen-1 ];
  }
  this.length = function()
  {
    return this.item.length;
  }
  this.AddItem = this.item;
  this.AddItem_newInstance = this.item_newInstance;
  this.AddItem.newInstance = this.item.newInstance;
  this.$$elementChildren.push( "item" );
}

function AddItem(  ) 
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
  this.$$name = "AddItem";
  this.$$xmlNames[ "AddItem" ] = "AddItem";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "Asin" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Asin = new xsd_string();
  }
  this.$$childElementFunctions[ "Asin" ] = xsd_string;
  this.$$elementChildren.push( "Asin" );
  this.$$minOccurs[ "ExchangeId" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ExchangeId = new xsd_string();
  }
  this.$$childElementFunctions[ "ExchangeId" ] = xsd_string;
  this.$$elementChildren.push( "ExchangeId" );
  if ( this.$$deserializing == undefined )
  {
  this.Quantity = new xsd_string();
  }
  this.$$childElementFunctions[ "Quantity" ] = xsd_string;
  this.$$elementChildren.push( "Quantity" );
}

function ShoppingCart(  ) 
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
  this.$$name = "ShoppingCart";
  this.$$xmlNames[ "ShoppingCart" ] = "ShoppingCart";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.CartId = new xsd_string();
  }
  this.$$childElementFunctions[ "CartId" ] = xsd_string;
  this.$$elementChildren.push( "CartId" );
  if ( this.$$deserializing == undefined )
  {
  this.HMAC = new xsd_string();
  }
  this.$$childElementFunctions[ "HMAC" ] = xsd_string;
  this.$$elementChildren.push( "HMAC" );
  if ( this.$$deserializing == undefined )
  {
  this.PurchaseUrl = new xsd_string();
  }
  this.$$childElementFunctions[ "PurchaseUrl" ] = xsd_string;
  this.$$elementChildren.push( "PurchaseUrl" );
  this.$$minOccurs[ "Items" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Items = new ShoppingCart_ItemArray();
  }
  this.$$childElementFunctions[ "Items" ] = ShoppingCart_ItemArray;
  this.$$elementChildren.push( "Items" );
}

function ShoppingCart_ItemArray(  ) 
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
  this.$$name = "ShoppingCart_ItemArray";
  this.$$xmlNames[ "ShoppingCart_ItemArray" ] = "Items";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.item = new Array();  // of Item
  this.item.$$nsPrefix = "ns1"
 // method to create a new member of the item array
  this.item.newInstance = function( bDeserializing )
  {
    var newObj = new Item( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.item_newInstance = function( bDeserializing )
  {
    var newLen = this.item.push( new Item( bDeserializing ) );
    return this.item[ newLen-1 ];
  }
  this.length = function()
  {
    return this.item.length;
  }
  this.Item = this.item;
  this.Item_newInstance = this.item_newInstance;
  this.Item.newInstance = this.item.newInstance;
  this.$$elementChildren.push( "item" );
}

function GetShoppingCartRequest(  ) 
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
  this.$$name = "GetShoppingCartRequest";
  this.$$xmlNames[ "GetShoppingCartRequest" ] = "GetShoppingCartRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://soap.amazon.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  if ( this.$$deserializing == undefined )
  {
  this.tag = new xsd_string();
  }
  this.$$childElementFunctions[ "tag" ] = xsd_string;
  this.$$elementChildren.push( "tag" );
  if ( this.$$deserializing == undefined )
  {
  this.devtag = new xsd_string();
  }
  this.$$childElementFunctions[ "devtag" ] = xsd_string;
  this.$$elementChildren.push( "devtag" );
  if ( this.$$deserializing == undefined )
  {
  this.CartId = new xsd_string();
  }
  this.$$childElementFunctions[ "CartId" ] = xsd_string;
  this.$$elementChildren.push( "CartId" );
  if ( this.$$deserializing == undefined )
  {
  this.HMAC = new xsd_string();
  }
  this.$$childElementFunctions[ "HMAC" ] = xsd_string;
  this.$$elementChildren.push( "HMAC" );
  this.$$minOccurs[ "locale" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.locale = new xsd_string();
  }
  this.$$childElementFunctions[ "locale" ] = xsd_string;
  this.$$elementChildren.push( "locale" );
}

function ClearShoppingCartRequest(  ) 
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
  this.$$name = "ClearShoppingCartRequest";
  this.$$xmlNames[ "ClearShoppingCartRequest" ] = "ClearShoppingCartRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://soap.amazon.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  if ( this.$$deserializing == undefined )
  {
  this.tag = new xsd_string();
  }
  this.$$childElementFunctions[ "tag" ] = xsd_string;
  this.$$elementChildren.push( "tag" );
  if ( this.$$deserializing == undefined )
  {
  this.devtag = new xsd_string();
  }
  this.$$childElementFunctions[ "devtag" ] = xsd_string;
  this.$$elementChildren.push( "devtag" );
  if ( this.$$deserializing == undefined )
  {
  this.CartId = new xsd_string();
  }
  this.$$childElementFunctions[ "CartId" ] = xsd_string;
  this.$$elementChildren.push( "CartId" );
  if ( this.$$deserializing == undefined )
  {
  this.HMAC = new xsd_string();
  }
  this.$$childElementFunctions[ "HMAC" ] = xsd_string;
  this.$$elementChildren.push( "HMAC" );
  this.$$minOccurs[ "locale" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.locale = new xsd_string();
  }
  this.$$childElementFunctions[ "locale" ] = xsd_string;
  this.$$elementChildren.push( "locale" );
}

function AddShoppingCartItemsRequest(  ) 
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
  this.$$name = "AddShoppingCartItemsRequest";
  this.$$xmlNames[ "AddShoppingCartItemsRequest" ] = "AddShoppingCartItemsRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://soap.amazon.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  if ( this.$$deserializing == undefined )
  {
  this.tag = new xsd_string();
  }
  this.$$childElementFunctions[ "tag" ] = xsd_string;
  this.$$elementChildren.push( "tag" );
  if ( this.$$deserializing == undefined )
  {
  this.devtag = new xsd_string();
  }
  this.$$childElementFunctions[ "devtag" ] = xsd_string;
  this.$$elementChildren.push( "devtag" );
  this.$$minOccurs[ "CartId" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.CartId = new xsd_string();
  }
  this.$$childElementFunctions[ "CartId" ] = xsd_string;
  this.$$elementChildren.push( "CartId" );
  this.$$minOccurs[ "HMAC" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.HMAC = new xsd_string();
  }
  this.$$childElementFunctions[ "HMAC" ] = xsd_string;
  this.$$elementChildren.push( "HMAC" );
  if ( this.$$deserializing == undefined )
  {
  this.Items = new AddShoppingCartItemsRequest_AddItemArray();
  }
  this.$$childElementFunctions[ "Items" ] = AddShoppingCartItemsRequest_AddItemArray;
  this.$$elementChildren.push( "Items" );
  this.$$minOccurs[ "locale" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.locale = new xsd_string();
  }
  this.$$childElementFunctions[ "locale" ] = xsd_string;
  this.$$elementChildren.push( "locale" );
}

function AddShoppingCartItemsRequest_AddItemArray(  ) 
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
  this.$$name = "AddShoppingCartItemsRequest_AddItemArray";
  this.$$xmlNames[ "AddShoppingCartItemsRequest_AddItemArray" ] = "Items";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.item = new Array();  // of AddItem
  this.item.$$nsPrefix = "ns1"
 // method to create a new member of the item array
  this.item.newInstance = function( bDeserializing )
  {
    var newObj = new AddItem( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.item_newInstance = function( bDeserializing )
  {
    var newLen = this.item.push( new AddItem( bDeserializing ) );
    return this.item[ newLen-1 ];
  }
  this.length = function()
  {
    return this.item.length;
  }
  this.AddItem = this.item;
  this.AddItem_newInstance = this.item_newInstance;
  this.AddItem.newInstance = this.item.newInstance;
  this.$$elementChildren.push( "item" );
}

function RemoveShoppingCartItemsRequest(  ) 
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
  this.$$name = "RemoveShoppingCartItemsRequest";
  this.$$xmlNames[ "RemoveShoppingCartItemsRequest" ] = "RemoveShoppingCartItemsRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://soap.amazon.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  if ( this.$$deserializing == undefined )
  {
  this.tag = new xsd_string();
  }
  this.$$childElementFunctions[ "tag" ] = xsd_string;
  this.$$elementChildren.push( "tag" );
  if ( this.$$deserializing == undefined )
  {
  this.devtag = new xsd_string();
  }
  this.$$childElementFunctions[ "devtag" ] = xsd_string;
  this.$$elementChildren.push( "devtag" );
  if ( this.$$deserializing == undefined )
  {
  this.CartId = new xsd_string();
  }
  this.$$childElementFunctions[ "CartId" ] = xsd_string;
  this.$$elementChildren.push( "CartId" );
  if ( this.$$deserializing == undefined )
  {
  this.HMAC = new xsd_string();
  }
  this.$$childElementFunctions[ "HMAC" ] = xsd_string;
  this.$$elementChildren.push( "HMAC" );
  if ( this.$$deserializing == undefined )
  {
  this.Items = new RemoveShoppingCartItemsRequest_ItemIdArray();
  }
  this.$$childElementFunctions[ "Items" ] = RemoveShoppingCartItemsRequest_ItemIdArray;
  this.$$elementChildren.push( "Items" );
  this.$$minOccurs[ "locale" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.locale = new xsd_string();
  }
  this.$$childElementFunctions[ "locale" ] = xsd_string;
  this.$$elementChildren.push( "locale" );
}

function RemoveShoppingCartItemsRequest_ItemIdArray(  ) 
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
  this.$$name = "RemoveShoppingCartItemsRequest_ItemIdArray";
  this.$$xmlNames[ "RemoveShoppingCartItemsRequest_ItemIdArray" ] = "Items";
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

function ModifyShoppingCartItemsRequest(  ) 
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
  this.$$name = "ModifyShoppingCartItemsRequest";
  this.$$xmlNames[ "ModifyShoppingCartItemsRequest" ] = "ModifyShoppingCartItemsRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://soap.amazon.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  if ( this.$$deserializing == undefined )
  {
  this.tag = new xsd_string();
  }
  this.$$childElementFunctions[ "tag" ] = xsd_string;
  this.$$elementChildren.push( "tag" );
  if ( this.$$deserializing == undefined )
  {
  this.devtag = new xsd_string();
  }
  this.$$childElementFunctions[ "devtag" ] = xsd_string;
  this.$$elementChildren.push( "devtag" );
  if ( this.$$deserializing == undefined )
  {
  this.CartId = new xsd_string();
  }
  this.$$childElementFunctions[ "CartId" ] = xsd_string;
  this.$$elementChildren.push( "CartId" );
  if ( this.$$deserializing == undefined )
  {
  this.HMAC = new xsd_string();
  }
  this.$$childElementFunctions[ "HMAC" ] = xsd_string;
  this.$$elementChildren.push( "HMAC" );
  if ( this.$$deserializing == undefined )
  {
  this.Items = new ModifyShoppingCartItemsRequest_ItemQuantityArray();
  }
  this.$$childElementFunctions[ "Items" ] = ModifyShoppingCartItemsRequest_ItemQuantityArray;
  this.$$elementChildren.push( "Items" );
  this.$$minOccurs[ "locale" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.locale = new xsd_string();
  }
  this.$$childElementFunctions[ "locale" ] = xsd_string;
  this.$$elementChildren.push( "locale" );
}

function ModifyShoppingCartItemsRequest_ItemQuantityArray(  ) 
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
  this.$$name = "ModifyShoppingCartItemsRequest_ItemQuantityArray";
  this.$$xmlNames[ "ModifyShoppingCartItemsRequest_ItemQuantityArray" ] = "Items";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.item = new Array();  // of ItemQuantity
  this.item.$$nsPrefix = "ns1"
 // method to create a new member of the item array
  this.item.newInstance = function( bDeserializing )
  {
    var newObj = new ItemQuantity( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.item_newInstance = function( bDeserializing )
  {
    var newLen = this.item.push( new ItemQuantity( bDeserializing ) );
    return this.item[ newLen-1 ];
  }
  this.length = function()
  {
    return this.item.length;
  }
  this.ItemQuantity = this.item;
  this.ItemQuantity_newInstance = this.item_newInstance;
  this.ItemQuantity.newInstance = this.item.newInstance;
  this.$$elementChildren.push( "item" );
}

function KeywordSearchRequest(  ) 
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
  this.$$name = "KeywordSearchRequest";
  this.$$xmlNames[ "KeywordSearchRequest" ] = "KeywordSearchRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://soap.amazon.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  if ( this.$$deserializing == undefined )
  {
  this.KeywordSearchRequest = new KeywordRequest();
  }
  this.$$childElementFunctions[ "KeywordSearchRequest" ] = KeywordRequest;
  this.$$elementChildren.push( "KeywordSearchRequest" );
}

function KeywordSearchResponse(  ) 
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
  this.$$name = "KeywordSearchResponse";
  this.$$xmlNames[ "KeywordSearchResponse" ] = "KeywordSearchResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://soap.amazon.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  this.$$xmlNames["_return"] = "return";
  this.$$objNames["return"] = "_return";
  if ( this.$$deserializing == undefined )
  {
  this._return = new ProductInfo();
  }
  this.$$childElementFunctions[ "_return" ] = ProductInfo;
  this.$$elementChildren.push( "_return" );
}

function PowerSearchRequest(  ) 
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
  this.$$name = "PowerSearchRequest";
  this.$$xmlNames[ "PowerSearchRequest" ] = "PowerSearchRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://soap.amazon.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  if ( this.$$deserializing == undefined )
  {
  this.PowerSearchRequest = new PowerRequest();
  }
  this.$$childElementFunctions[ "PowerSearchRequest" ] = PowerRequest;
  this.$$elementChildren.push( "PowerSearchRequest" );
}

function PowerSearchResponse(  ) 
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
  this.$$name = "PowerSearchResponse";
  this.$$xmlNames[ "PowerSearchResponse" ] = "PowerSearchResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://soap.amazon.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  this.$$xmlNames["_return"] = "return";
  this.$$objNames["return"] = "_return";
  if ( this.$$deserializing == undefined )
  {
  this._return = new ProductInfo();
  }
  this.$$childElementFunctions[ "_return" ] = ProductInfo;
  this.$$elementChildren.push( "_return" );
}

function BrowseNodeSearchRequest(  ) 
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
  this.$$name = "BrowseNodeSearchRequest";
  this.$$xmlNames[ "BrowseNodeSearchRequest" ] = "BrowseNodeSearchRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://soap.amazon.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  if ( this.$$deserializing == undefined )
  {
  this.BrowseNodeSearchRequest = new BrowseNodeRequest();
  }
  this.$$childElementFunctions[ "BrowseNodeSearchRequest" ] = BrowseNodeRequest;
  this.$$elementChildren.push( "BrowseNodeSearchRequest" );
}

function BrowseNodeSearchResponse(  ) 
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
  this.$$name = "BrowseNodeSearchResponse";
  this.$$xmlNames[ "BrowseNodeSearchResponse" ] = "BrowseNodeSearchResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://soap.amazon.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  this.$$xmlNames["_return"] = "return";
  this.$$objNames["return"] = "_return";
  if ( this.$$deserializing == undefined )
  {
  this._return = new ProductInfo();
  }
  this.$$childElementFunctions[ "_return" ] = ProductInfo;
  this.$$elementChildren.push( "_return" );
}

function AsinSearchRequest(  ) 
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
  this.$$name = "AsinSearchRequest";
  this.$$xmlNames[ "AsinSearchRequest" ] = "AsinSearchRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://soap.amazon.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  if ( this.$$deserializing == undefined )
  {
  this.AsinSearchRequest = new AsinRequest();
  }
  this.$$childElementFunctions[ "AsinSearchRequest" ] = AsinRequest;
  this.$$elementChildren.push( "AsinSearchRequest" );
}

function AsinSearchResponse(  ) 
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
  this.$$name = "AsinSearchResponse";
  this.$$xmlNames[ "AsinSearchResponse" ] = "AsinSearchResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://soap.amazon.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  this.$$xmlNames["_return"] = "return";
  this.$$objNames["return"] = "_return";
  if ( this.$$deserializing == undefined )
  {
  this._return = new ProductInfo();
  }
  this.$$childElementFunctions[ "_return" ] = ProductInfo;
  this.$$elementChildren.push( "_return" );
}

function BlendedSearchRequest(  ) 
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
  this.$$name = "BlendedSearchRequest";
  this.$$xmlNames[ "BlendedSearchRequest" ] = "BlendedSearchRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://soap.amazon.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  if ( this.$$deserializing == undefined )
  {
  this.BlendedSearchRequest = new BlendedRequest();
  }
  this.$$childElementFunctions[ "BlendedSearchRequest" ] = BlendedRequest;
  this.$$elementChildren.push( "BlendedSearchRequest" );
}

function BlendedSearchResponse(  ) 
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
  this.$$name = "BlendedSearchResponse";
  this.$$xmlNames[ "BlendedSearchResponse" ] = "BlendedSearchResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://soap.amazon.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  this.$$xmlNames["_return"] = "return";
  this.$$objNames["return"] = "_return";
  if ( this.$$deserializing == undefined )
  {
  this._return = new ProductLineArray();
  }
  this.$$childElementFunctions[ "_return" ] = ProductLineArray;
  this.$$elementChildren.push( "_return" );
}

function UpcSearchRequest(  ) 
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
  this.$$name = "UpcSearchRequest";
  this.$$xmlNames[ "UpcSearchRequest" ] = "UpcSearchRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://soap.amazon.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  if ( this.$$deserializing == undefined )
  {
  this.UpcSearchRequest = new UpcRequest();
  }
  this.$$childElementFunctions[ "UpcSearchRequest" ] = UpcRequest;
  this.$$elementChildren.push( "UpcSearchRequest" );
}

function UpcSearchResponse(  ) 
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
  this.$$name = "UpcSearchResponse";
  this.$$xmlNames[ "UpcSearchResponse" ] = "UpcSearchResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://soap.amazon.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  this.$$xmlNames["_return"] = "return";
  this.$$objNames["return"] = "_return";
  if ( this.$$deserializing == undefined )
  {
  this._return = new ProductInfo();
  }
  this.$$childElementFunctions[ "_return" ] = ProductInfo;
  this.$$elementChildren.push( "_return" );
}

function AuthorSearchRequest(  ) 
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
  this.$$name = "AuthorSearchRequest";
  this.$$xmlNames[ "AuthorSearchRequest" ] = "AuthorSearchRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://soap.amazon.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  if ( this.$$deserializing == undefined )
  {
  this.AuthorSearchRequest = new AuthorRequest();
  }
  this.$$childElementFunctions[ "AuthorSearchRequest" ] = AuthorRequest;
  this.$$elementChildren.push( "AuthorSearchRequest" );
}

function AuthorSearchResponse(  ) 
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
  this.$$name = "AuthorSearchResponse";
  this.$$xmlNames[ "AuthorSearchResponse" ] = "AuthorSearchResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://soap.amazon.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  this.$$xmlNames["_return"] = "return";
  this.$$objNames["return"] = "_return";
  if ( this.$$deserializing == undefined )
  {
  this._return = new ProductInfo();
  }
  this.$$childElementFunctions[ "_return" ] = ProductInfo;
  this.$$elementChildren.push( "_return" );
}

function ArtistSearchRequest(  ) 
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
  this.$$name = "ArtistSearchRequest";
  this.$$xmlNames[ "ArtistSearchRequest" ] = "ArtistSearchRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://soap.amazon.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  if ( this.$$deserializing == undefined )
  {
  this.ArtistSearchRequest = new ArtistRequest();
  }
  this.$$childElementFunctions[ "ArtistSearchRequest" ] = ArtistRequest;
  this.$$elementChildren.push( "ArtistSearchRequest" );
}

function ArtistSearchResponse(  ) 
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
  this.$$name = "ArtistSearchResponse";
  this.$$xmlNames[ "ArtistSearchResponse" ] = "ArtistSearchResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://soap.amazon.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  this.$$xmlNames["_return"] = "return";
  this.$$objNames["return"] = "_return";
  if ( this.$$deserializing == undefined )
  {
  this._return = new ProductInfo();
  }
  this.$$childElementFunctions[ "_return" ] = ProductInfo;
  this.$$elementChildren.push( "_return" );
}

function ActorSearchRequest(  ) 
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
  this.$$name = "ActorSearchRequest";
  this.$$xmlNames[ "ActorSearchRequest" ] = "ActorSearchRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://soap.amazon.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  if ( this.$$deserializing == undefined )
  {
  this.ActorSearchRequest = new ActorRequest();
  }
  this.$$childElementFunctions[ "ActorSearchRequest" ] = ActorRequest;
  this.$$elementChildren.push( "ActorSearchRequest" );
}

function ActorSearchResponse(  ) 
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
  this.$$name = "ActorSearchResponse";
  this.$$xmlNames[ "ActorSearchResponse" ] = "ActorSearchResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://soap.amazon.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  this.$$xmlNames["_return"] = "return";
  this.$$objNames["return"] = "_return";
  if ( this.$$deserializing == undefined )
  {
  this._return = new ProductInfo();
  }
  this.$$childElementFunctions[ "_return" ] = ProductInfo;
  this.$$elementChildren.push( "_return" );
}

function DirectorSearchRequest(  ) 
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
  this.$$name = "DirectorSearchRequest";
  this.$$xmlNames[ "DirectorSearchRequest" ] = "DirectorSearchRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://soap.amazon.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  if ( this.$$deserializing == undefined )
  {
  this.DirectorSearchRequest = new DirectorRequest();
  }
  this.$$childElementFunctions[ "DirectorSearchRequest" ] = DirectorRequest;
  this.$$elementChildren.push( "DirectorSearchRequest" );
}

function DirectorSearchResponse(  ) 
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
  this.$$name = "DirectorSearchResponse";
  this.$$xmlNames[ "DirectorSearchResponse" ] = "DirectorSearchResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://soap.amazon.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  this.$$xmlNames["_return"] = "return";
  this.$$objNames["return"] = "_return";
  if ( this.$$deserializing == undefined )
  {
  this._return = new ProductInfo();
  }
  this.$$childElementFunctions[ "_return" ] = ProductInfo;
  this.$$elementChildren.push( "_return" );
}

function ExchangeSearchRequest(  ) 
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
  this.$$name = "ExchangeSearchRequest";
  this.$$xmlNames[ "ExchangeSearchRequest" ] = "ExchangeSearchRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://soap.amazon.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  if ( this.$$deserializing == undefined )
  {
  this.ExchangeSearchRequest = new ExchangeRequest();
  }
  this.$$childElementFunctions[ "ExchangeSearchRequest" ] = ExchangeRequest;
  this.$$elementChildren.push( "ExchangeSearchRequest" );
}

function ExchangeSearchResponse(  ) 
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
  this.$$name = "ExchangeSearchResponse";
  this.$$xmlNames[ "ExchangeSearchResponse" ] = "ExchangeSearchResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://soap.amazon.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  this.$$xmlNames["_return"] = "return";
  this.$$objNames["return"] = "_return";
  if ( this.$$deserializing == undefined )
  {
  this._return = new ListingProductDetails();
  }
  this.$$childElementFunctions[ "_return" ] = ListingProductDetails;
  this.$$elementChildren.push( "_return" );
}

function ManufacturerSearchRequest(  ) 
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
  this.$$name = "ManufacturerSearchRequest";
  this.$$xmlNames[ "ManufacturerSearchRequest" ] = "ManufacturerSearchRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://soap.amazon.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  if ( this.$$deserializing == undefined )
  {
  this.ManufacturerSearchRequest = new ManufacturerRequest();
  }
  this.$$childElementFunctions[ "ManufacturerSearchRequest" ] = ManufacturerRequest;
  this.$$elementChildren.push( "ManufacturerSearchRequest" );
}

function ManufacturerSearchResponse(  ) 
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
  this.$$name = "ManufacturerSearchResponse";
  this.$$xmlNames[ "ManufacturerSearchResponse" ] = "ManufacturerSearchResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://soap.amazon.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  this.$$xmlNames["_return"] = "return";
  this.$$objNames["return"] = "_return";
  if ( this.$$deserializing == undefined )
  {
  this._return = new ProductInfo();
  }
  this.$$childElementFunctions[ "_return" ] = ProductInfo;
  this.$$elementChildren.push( "_return" );
}

function MarketplaceSearchRequest(  ) 
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
  this.$$name = "MarketplaceSearchRequest";
  this.$$xmlNames[ "MarketplaceSearchRequest" ] = "MarketplaceSearchRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://soap.amazon.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  if ( this.$$deserializing == undefined )
  {
  this.MarketplaceSearchRequest = new MarketplaceRequest();
  }
  this.$$childElementFunctions[ "MarketplaceSearchRequest" ] = MarketplaceRequest;
  this.$$elementChildren.push( "MarketplaceSearchRequest" );
}

function MarketplaceSearchResponse(  ) 
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
  this.$$name = "MarketplaceSearchResponse";
  this.$$xmlNames[ "MarketplaceSearchResponse" ] = "MarketplaceSearchResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://soap.amazon.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  this.$$xmlNames["_return"] = "return";
  this.$$objNames["return"] = "_return";
  if ( this.$$deserializing == undefined )
  {
  this._return = new MarketplaceSearch();
  }
  this.$$childElementFunctions[ "_return" ] = MarketplaceSearch;
  this.$$elementChildren.push( "_return" );
}

function ListManiaSearchRequest(  ) 
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
  this.$$name = "ListManiaSearchRequest";
  this.$$xmlNames[ "ListManiaSearchRequest" ] = "ListManiaSearchRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://soap.amazon.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  if ( this.$$deserializing == undefined )
  {
  this.ListManiaSearchRequest = new ListManiaRequest();
  }
  this.$$childElementFunctions[ "ListManiaSearchRequest" ] = ListManiaRequest;
  this.$$elementChildren.push( "ListManiaSearchRequest" );
}

function ListManiaSearchResponse(  ) 
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
  this.$$name = "ListManiaSearchResponse";
  this.$$xmlNames[ "ListManiaSearchResponse" ] = "ListManiaSearchResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://soap.amazon.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  this.$$xmlNames["_return"] = "return";
  this.$$objNames["return"] = "_return";
  if ( this.$$deserializing == undefined )
  {
  this._return = new ProductInfo();
  }
  this.$$childElementFunctions[ "_return" ] = ProductInfo;
  this.$$elementChildren.push( "_return" );
}

function WishlistSearchRequest(  ) 
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
  this.$$name = "WishlistSearchRequest";
  this.$$xmlNames[ "WishlistSearchRequest" ] = "WishlistSearchRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://soap.amazon.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  if ( this.$$deserializing == undefined )
  {
  this.WishlistSearchRequest = new WishlistRequest();
  }
  this.$$childElementFunctions[ "WishlistSearchRequest" ] = WishlistRequest;
  this.$$elementChildren.push( "WishlistSearchRequest" );
}

function WishlistSearchResponse(  ) 
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
  this.$$name = "WishlistSearchResponse";
  this.$$xmlNames[ "WishlistSearchResponse" ] = "WishlistSearchResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://soap.amazon.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  this.$$xmlNames["_return"] = "return";
  this.$$objNames["return"] = "_return";
  if ( this.$$deserializing == undefined )
  {
  this._return = new ProductInfo();
  }
  this.$$childElementFunctions[ "_return" ] = ProductInfo;
  this.$$elementChildren.push( "_return" );
}

function SellerProfileSearchRequest(  ) 
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
  this.$$name = "SellerProfileSearchRequest";
  this.$$xmlNames[ "SellerProfileSearchRequest" ] = "SellerProfileSearchRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://soap.amazon.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  if ( this.$$deserializing == undefined )
  {
  this.SellerProfileSearchRequest = new SellerProfileRequest();
  }
  this.$$childElementFunctions[ "SellerProfileSearchRequest" ] = SellerProfileRequest;
  this.$$elementChildren.push( "SellerProfileSearchRequest" );
}

function SellerProfileSearchResponse(  ) 
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
  this.$$name = "SellerProfileSearchResponse";
  this.$$xmlNames[ "SellerProfileSearchResponse" ] = "SellerProfileSearchResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://soap.amazon.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  this.$$xmlNames["_return"] = "return";
  this.$$objNames["return"] = "_return";
  if ( this.$$deserializing == undefined )
  {
  this._return = new SellerProfile();
  }
  this.$$childElementFunctions[ "_return" ] = SellerProfile;
  this.$$elementChildren.push( "_return" );
}

function SellerSearchRequest(  ) 
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
  this.$$name = "SellerSearchRequest";
  this.$$xmlNames[ "SellerSearchRequest" ] = "SellerSearchRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://soap.amazon.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  if ( this.$$deserializing == undefined )
  {
  this.SellerSearchRequest = new SellerRequest();
  }
  this.$$childElementFunctions[ "SellerSearchRequest" ] = SellerRequest;
  this.$$elementChildren.push( "SellerSearchRequest" );
}

function SellerSearchResponse(  ) 
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
  this.$$name = "SellerSearchResponse";
  this.$$xmlNames[ "SellerSearchResponse" ] = "SellerSearchResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://soap.amazon.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  this.$$xmlNames["_return"] = "return";
  this.$$objNames["return"] = "_return";
  if ( this.$$deserializing == undefined )
  {
  this._return = new SellerSearch();
  }
  this.$$childElementFunctions[ "_return" ] = SellerSearch;
  this.$$elementChildren.push( "_return" );
}

function SimilaritySearchRequest(  ) 
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
  this.$$name = "SimilaritySearchRequest";
  this.$$xmlNames[ "SimilaritySearchRequest" ] = "SimilaritySearchRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://soap.amazon.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  if ( this.$$deserializing == undefined )
  {
  this.SimilaritySearchRequest = new SimilarityRequest();
  }
  this.$$childElementFunctions[ "SimilaritySearchRequest" ] = SimilarityRequest;
  this.$$elementChildren.push( "SimilaritySearchRequest" );
}

function SimilaritySearchResponse(  ) 
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
  this.$$name = "SimilaritySearchResponse";
  this.$$xmlNames[ "SimilaritySearchResponse" ] = "SimilaritySearchResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://soap.amazon.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  this.$$xmlNames["_return"] = "return";
  this.$$objNames["return"] = "_return";
  if ( this.$$deserializing == undefined )
  {
  this._return = new ProductInfo();
  }
  this.$$childElementFunctions[ "_return" ] = ProductInfo;
  this.$$elementChildren.push( "_return" );
}

function ShoppingCartResponse(  ) 
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
  this.$$name = "ShoppingCartResponse";
  this.$$xmlNames[ "ShoppingCartResponse" ] = "ShoppingCartResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns1 = new String("http://soap.amazon.com");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  if ( this.$$deserializing == undefined )
  {
  this.ShoppingCart = new ShoppingCart();
  }
  this.$$childElementFunctions[ "ShoppingCart" ] = ShoppingCart;
  this.$$elementChildren.push( "ShoppingCart" );
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