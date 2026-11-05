
function IncidentManagement( )
{
  this.location = new String( "http://localhost:13080/SM/7/ws" );

  this.user = "falcon";
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

  this.SOAPOperations[ "RetrieveIncident" ] = new soap_Operation( "RetrieveIncident", "Retrieve", "document", "RetrieveIncidentRequest", "RetrieveIncidentResponse" );
  this.SOAPOperations[ "RetrieveIncidentKeysList" ] = new soap_Operation( "RetrieveIncidentKeysList", "RetrieveKeysList", "document", "RetrieveIncidentKeysListRequest", "RetrieveIncidentKeysListResponse" );
  this.SOAPOperations[ "RetrieveIncidentList" ] = new soap_Operation( "RetrieveIncidentList", "RetrieveList", "document", "RetrieveIncidentListRequest", "RetrieveIncidentListResponse" );
  this.SOAPOperations[ "CreateIncident" ] = new soap_Operation( "CreateIncident", "Create", "document", "CreateIncidentRequest", "CreateIncidentResponse" );
  this.SOAPOperations[ "CloseIncident" ] = new soap_Operation( "CloseIncident", "Close", "document", "CloseIncidentRequest", "CloseIncidentResponse" );
  this.SOAPOperations[ "ReopenIncident" ] = new soap_Operation( "ReopenIncident", "Reopen", "document", "ReopenIncidentRequest", "ReopenIncidentResponse" );
  this.SOAPOperations[ "ResolveIncident" ] = new soap_Operation( "ResolveIncident", "Resolve", "document", "ResolveIncidentRequest", "ResolveIncidentResponse" );
  this.SOAPOperations[ "UpdateIncident" ] = new soap_Operation( "UpdateIncident", "Update", "document", "UpdateIncidentRequest", "UpdateIncidentResponse" );
  this.SOAPOperations[ "RetrieveIncidentwithoutJournalUpdates" ] = new soap_Operation( "RetrieveIncidentwithoutJournalUpdates", "Retrieve", "document", "RetrieveIncidentwithoutJournalUpdatesRequest", "RetrieveIncidentwithoutJournalUpdatesResponse" );
  this.SOAPOperations[ "RetrieveIncidentwithoutJournalUpdatesKeysList" ] = new soap_Operation( "RetrieveIncidentwithoutJournalUpdatesKeysList", "RetrieveKeysList", "document", "RetrieveIncidentwithoutJournalUpdatesKeysListRequest", "RetrieveIncidentwithoutJournalUpdatesKeysListResponse" );
  this.SOAPOperations[ "RetrieveIncidentwithoutJournalUpdatesList" ] = new soap_Operation( "RetrieveIncidentwithoutJournalUpdatesList", "RetrieveList", "document", "RetrieveIncidentwithoutJournalUpdatesListRequest", "RetrieveIncidentwithoutJournalUpdatesListResponse" );
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
    lib.SOAP.deserialize( "IncidentManagement", this.resultXML.getDocumentElement(), resultObj );
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
  this.xmlns_ns0 = new String("http://schemas.hp.com/SM/7/Common");
  this.$$attributes.push( "xmlns_ns0" );
  this.$$xmlNames["xmlns_ns0"] = "xmlns:ns0";
  this.$$objNames["xmlns:ns0"] = "xmlns_ns0";
  this.xmlns_ns1 = new String("http://schemas.xmlsoap.org/wsdl/http/");
  this.$$attributes.push( "xmlns_ns1" );
  this.$$xmlNames["xmlns_ns1"] = "xmlns:ns1";
  this.$$objNames["xmlns:ns1"] = "xmlns_ns1";
  this.xmlns_ns2 = new String("http://schemas.xmlsoap.org/wsdl/mime/");
  this.$$attributes.push( "xmlns_ns2" );
  this.$$xmlNames["xmlns_ns2"] = "xmlns:ns2";
  this.$$objNames["xmlns:ns2"] = "xmlns_ns2";
  this.xmlns_ns3 = new String("http://schemas.hp.com/SM/7");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
  this.xmlns_ns4 = new String("http://www.w3.org/2005/05/xmlmime");
  this.$$attributes.push( "xmlns_ns4" );
  this.$$xmlNames["xmlns_ns4"] = "xmlns:ns4";
  this.$$objNames["xmlns:ns4"] = "xmlns_ns4";
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

function IncidentKeysType(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "IncidentKeysType";
  this.$$xmlNames[ "IncidentKeysType" ] = "IncidentKeysType";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.query = new String();
  this.$$attributes.push( "query" );
  this.$$minOccurs[ "IncidentID" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.IncidentID = new StringType();
  }
  this.$$childElementFunctions[ "IncidentID" ] = StringType;
  this.$$elementChildren.push( "IncidentID" );
}

function IncidentInstanceType(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "IncidentInstanceType";
  this.$$xmlNames[ "IncidentInstanceType" ] = "IncidentInstanceType";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.query = new String();
  this.$$attributes.push( "query" );
  this.uniquequery = new String();
  this.$$attributes.push( "uniquequery" );
  this.recordid = new String();
  this.$$attributes.push( "recordid" );
  this.$$minOccurs[ "IncidentID" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.IncidentID = new StringType();
  }
  this.$$childElementFunctions[ "IncidentID" ] = StringType;
  this.$$elementChildren.push( "IncidentID" );
  this.$$minOccurs[ "Category" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Category = new StringType();
  }
  this.$$childElementFunctions[ "Category" ] = StringType;
  this.$$elementChildren.push( "Category" );
  this.$$minOccurs[ "OpenTime" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.OpenTime = new DateTimeType();
  }
  this.$$childElementFunctions[ "OpenTime" ] = DateTimeType;
  this.$$elementChildren.push( "OpenTime" );
  this.$$minOccurs[ "OpenedBy" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.OpenedBy = new StringType();
  }
  this.$$childElementFunctions[ "OpenedBy" ] = StringType;
  this.$$elementChildren.push( "OpenedBy" );
  this.$$minOccurs[ "severity" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.severity = new StringType();
  }
  this.$$childElementFunctions[ "severity" ] = StringType;
  this.$$elementChildren.push( "severity" );
  this.$$minOccurs[ "UpdatedTime" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.UpdatedTime = new DateTimeType();
  }
  this.$$childElementFunctions[ "UpdatedTime" ] = DateTimeType;
  this.$$elementChildren.push( "UpdatedTime" );
  this.$$minOccurs[ "PrimaryAssignmentGroup" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.PrimaryAssignmentGroup = new StringType();
  }
  this.$$childElementFunctions[ "PrimaryAssignmentGroup" ] = StringType;
  this.$$elementChildren.push( "PrimaryAssignmentGroup" );
  this.$$minOccurs[ "ClosedTime" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ClosedTime = new DateTimeType();
  }
  this.$$childElementFunctions[ "ClosedTime" ] = DateTimeType;
  this.$$elementChildren.push( "ClosedTime" );
  this.$$minOccurs[ "ClosedBy" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ClosedBy = new StringType();
  }
  this.$$childElementFunctions[ "ClosedBy" ] = StringType;
  this.$$elementChildren.push( "ClosedBy" );
  this.$$minOccurs[ "ClosureCode" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ClosureCode = new StringType();
  }
  this.$$childElementFunctions[ "ClosureCode" ] = StringType;
  this.$$elementChildren.push( "ClosureCode" );
  this.$$minOccurs[ "AffectedItem" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.AffectedItem = new StringType();
  }
  this.$$childElementFunctions[ "AffectedItem" ] = StringType;
  this.$$elementChildren.push( "AffectedItem" );
  this.$$minOccurs[ "IncidentDescription" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.IncidentDescription = new IncidentInstanceType_IncidentDescription();
  }
  this.$$childElementFunctions[ "IncidentDescription" ] = IncidentInstanceType_IncidentDescription;
  this.$$elementChildren.push( "IncidentDescription" );
  this.$$minOccurs[ "Resolution" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Resolution = new IncidentInstanceType_Resolution();
  }
  this.$$childElementFunctions[ "Resolution" ] = IncidentInstanceType_Resolution;
  this.$$elementChildren.push( "Resolution" );
  this.$$minOccurs[ "AssigneeName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.AssigneeName = new StringType();
  }
  this.$$childElementFunctions[ "AssigneeName" ] = StringType;
  this.$$elementChildren.push( "AssigneeName" );
  this.$$minOccurs[ "Contact" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Contact = new StringType();
  }
  this.$$childElementFunctions[ "Contact" ] = StringType;
  this.$$elementChildren.push( "Contact" );
  this.$$minOccurs[ "JournalUpdates" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.JournalUpdates = new IncidentInstanceType_JournalUpdates();
  }
  this.$$childElementFunctions[ "JournalUpdates" ] = IncidentInstanceType_JournalUpdates;
  this.$$elementChildren.push( "JournalUpdates" );
  this.$$minOccurs[ "AlertStatus" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.AlertStatus = new StringType();
  }
  this.$$childElementFunctions[ "AlertStatus" ] = StringType;
  this.$$elementChildren.push( "AlertStatus" );
  this.$$minOccurs[ "ContactLastName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ContactLastName = new StringType();
  }
  this.$$childElementFunctions[ "ContactLastName" ] = StringType;
  this.$$elementChildren.push( "ContactLastName" );
  this.$$minOccurs[ "ContactFirstName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ContactFirstName = new StringType();
  }
  this.$$childElementFunctions[ "ContactFirstName" ] = StringType;
  this.$$elementChildren.push( "ContactFirstName" );
  this.$$minOccurs[ "Company" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Company = new StringType();
  }
  this.$$childElementFunctions[ "Company" ] = StringType;
  this.$$elementChildren.push( "Company" );
  this.$$minOccurs[ "BriefDescription" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.BriefDescription = new StringType();
  }
  this.$$childElementFunctions[ "BriefDescription" ] = StringType;
  this.$$elementChildren.push( "BriefDescription" );
  this.$$minOccurs[ "TicketOwner" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.TicketOwner = new StringType();
  }
  this.$$childElementFunctions[ "TicketOwner" ] = StringType;
  this.$$elementChildren.push( "TicketOwner" );
  this.$$minOccurs[ "UpdatedBy" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.UpdatedBy = new StringType();
  }
  this.$$childElementFunctions[ "UpdatedBy" ] = StringType;
  this.$$elementChildren.push( "UpdatedBy" );
  this.$$minOccurs[ "IMTicketStatus" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.IMTicketStatus = new StringType();
  }
  this.$$childElementFunctions[ "IMTicketStatus" ] = StringType;
  this.$$elementChildren.push( "IMTicketStatus" );
  this.$$minOccurs[ "Subcategory" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Subcategory = new StringType();
  }
  this.$$childElementFunctions[ "Subcategory" ] = StringType;
  this.$$elementChildren.push( "Subcategory" );
  this.$$minOccurs[ "SLAAgreementID" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.SLAAgreementID = new DecimalType();
  }
  this.$$childElementFunctions[ "SLAAgreementID" ] = DecimalType;
  this.$$elementChildren.push( "SLAAgreementID" );
  this.$$minOccurs[ "SiteCategory" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.SiteCategory = new StringType();
  }
  this.$$childElementFunctions[ "SiteCategory" ] = StringType;
  this.$$elementChildren.push( "SiteCategory" );
  this.$$minOccurs[ "ProductType" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ProductType = new StringType();
  }
  this.$$childElementFunctions[ "ProductType" ] = StringType;
  this.$$elementChildren.push( "ProductType" );
  this.$$minOccurs[ "ProblemType" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ProblemType = new StringType();
  }
  this.$$childElementFunctions[ "ProblemType" ] = StringType;
  this.$$elementChildren.push( "ProblemType" );
  this.$$minOccurs[ "ResolutionFixType" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ResolutionFixType = new StringType();
  }
  this.$$childElementFunctions[ "ResolutionFixType" ] = StringType;
  this.$$elementChildren.push( "ResolutionFixType" );
  this.$$minOccurs[ "UserPriority" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.UserPriority = new StringType();
  }
  this.$$childElementFunctions[ "UserPriority" ] = StringType;
  this.$$elementChildren.push( "UserPriority" );
  this.$$minOccurs[ "Location" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Location = new StringType();
  }
  this.$$childElementFunctions[ "Location" ] = StringType;
  this.$$elementChildren.push( "Location" );
  this.$$minOccurs[ "Solution" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Solution = new IncidentInstanceType_Solution();
  }
  this.$$childElementFunctions[ "Solution" ] = IncidentInstanceType_Solution;
  this.$$elementChildren.push( "Solution" );
  this.$$minOccurs[ "InitialImpact" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.InitialImpact = new StringType();
  }
  this.$$childElementFunctions[ "InitialImpact" ] = StringType;
  this.$$elementChildren.push( "InitialImpact" );
  this.$$minOccurs[ "folder" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.folder = new StringType();
  }
  this.$$childElementFunctions[ "folder" ] = StringType;
  this.$$elementChildren.push( "folder" );
  this.$$minOccurs[ "Service" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Service = new StringType();
  }
  this.$$childElementFunctions[ "Service" ] = StringType;
  this.$$elementChildren.push( "Service" );
  this.$$minOccurs[ "attachments" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.attachments = new AttachmentsType();
  }
  this.$$childElementFunctions[ "attachments" ] = AttachmentsType;
  this.$$elementChildren.push( "attachments" );
}

function IncidentInstanceType_IncidentDescription(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "IncidentInstanceType_IncidentDescription";
  this.$$xmlNames[ "IncidentInstanceType_IncidentDescription" ] = "IncidentDescription";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.type = new String("Array");
  this.$$attributes.push( "type" );
  this.IncidentDescription = new Array();  // of StringType
  this.IncidentDescription.$$nsPrefix = "ns3"
 // method to create a new member of the IncidentDescription array
  this.IncidentDescription.newInstance = function( bDeserializing )
  {
    var newObj = new StringType(  );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.IncidentDescription_newInstance = function( bDeserializing )
  {
    var newLen = this.IncidentDescription.push( new StringType(  ) );
    return this.IncidentDescription[ newLen-1 ];
  }
  this.$$elementChildren.push( "IncidentDescription" );
}

function IncidentInstanceType_Resolution(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "IncidentInstanceType_Resolution";
  this.$$xmlNames[ "IncidentInstanceType_Resolution" ] = "Resolution";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.type = new String("Array");
  this.$$attributes.push( "type" );
  this.Resolution = new Array();  // of StringType
  this.Resolution.$$nsPrefix = "ns3"
 // method to create a new member of the Resolution array
  this.Resolution.newInstance = function( bDeserializing )
  {
    var newObj = new StringType(  );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.Resolution_newInstance = function( bDeserializing )
  {
    var newLen = this.Resolution.push( new StringType(  ) );
    return this.Resolution[ newLen-1 ];
  }
  this.$$elementChildren.push( "Resolution" );
}

function IncidentInstanceType_JournalUpdates(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "IncidentInstanceType_JournalUpdates";
  this.$$xmlNames[ "IncidentInstanceType_JournalUpdates" ] = "JournalUpdates";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.type = new String("Array");
  this.$$attributes.push( "type" );
  this.JournalUpdates = new Array();  // of StringType
  this.JournalUpdates.$$nsPrefix = "ns3"
 // method to create a new member of the JournalUpdates array
  this.JournalUpdates.newInstance = function( bDeserializing )
  {
    var newObj = new StringType(  );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.JournalUpdates_newInstance = function( bDeserializing )
  {
    var newLen = this.JournalUpdates.push( new StringType(  ) );
    return this.JournalUpdates[ newLen-1 ];
  }
  this.$$elementChildren.push( "JournalUpdates" );
}

function IncidentInstanceType_Solution(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "IncidentInstanceType_Solution";
  this.$$xmlNames[ "IncidentInstanceType_Solution" ] = "Solution";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.type = new String("Array");
  this.$$attributes.push( "type" );
  this.Solution = new Array();  // of StringType
  this.Solution.$$nsPrefix = "ns3"
 // method to create a new member of the Solution array
  this.Solution.newInstance = function( bDeserializing )
  {
    var newObj = new StringType(  );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.Solution_newInstance = function( bDeserializing )
  {
    var newLen = this.Solution.push( new StringType(  ) );
    return this.Solution[ newLen-1 ];
  }
  this.$$elementChildren.push( "Solution" );
}

function IncidentModelType(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "IncidentModelType";
  this.$$xmlNames[ "IncidentModelType" ] = "IncidentModelType";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.query = new String();
  this.$$attributes.push( "query" );
  if ( this.$$deserializing == undefined )
  {
  this.keys = new IncidentModelType_IncidentKeysType();
  }
  this.$$childElementFunctions[ "keys" ] = IncidentModelType_IncidentKeysType;
  this.$$elementChildren.push( "keys" );
  if ( this.$$deserializing == undefined )
  {
  this.instance = new IncidentModelType_IncidentInstanceType();
  }
  this.$$childElementFunctions[ "instance" ] = IncidentModelType_IncidentInstanceType;
  this.$$elementChildren.push( "instance" );
  this.$$minOccurs[ "messages" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.messages = new MessagesType();
  }
  this.$$childElementFunctions[ "messages" ] = MessagesType;
  this.$$elementChildren.push( "messages" );
}

function IncidentModelType_IncidentKeysType(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "IncidentModelType_IncidentKeysType";
  this.$$xmlNames[ "IncidentModelType_IncidentKeysType" ] = "keys";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.query = new String();
  this.$$attributes.push( "query" );
  this.$$minOccurs[ "IncidentID" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.IncidentID = new StringType();
  }
  this.$$childElementFunctions[ "IncidentID" ] = StringType;
  this.$$elementChildren.push( "IncidentID" );
}

function IncidentModelType_IncidentInstanceType(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "IncidentModelType_IncidentInstanceType";
  this.$$xmlNames[ "IncidentModelType_IncidentInstanceType" ] = "instance";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.query = new String();
  this.$$attributes.push( "query" );
  this.uniquequery = new String();
  this.$$attributes.push( "uniquequery" );
  this.recordid = new String();
  this.$$attributes.push( "recordid" );
  this.$$minOccurs[ "IncidentID" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.IncidentID = new StringType();
  }
  this.$$childElementFunctions[ "IncidentID" ] = StringType;
  this.$$elementChildren.push( "IncidentID" );
  this.$$minOccurs[ "Category" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Category = new StringType();
  }
  this.$$childElementFunctions[ "Category" ] = StringType;
  this.$$elementChildren.push( "Category" );
  this.$$minOccurs[ "OpenTime" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.OpenTime = new DateTimeType();
  }
  this.$$childElementFunctions[ "OpenTime" ] = DateTimeType;
  this.$$elementChildren.push( "OpenTime" );
  this.$$minOccurs[ "OpenedBy" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.OpenedBy = new StringType();
  }
  this.$$childElementFunctions[ "OpenedBy" ] = StringType;
  this.$$elementChildren.push( "OpenedBy" );
  this.$$minOccurs[ "severity" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.severity = new StringType();
  }
  this.$$childElementFunctions[ "severity" ] = StringType;
  this.$$elementChildren.push( "severity" );
  this.$$minOccurs[ "UpdatedTime" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.UpdatedTime = new DateTimeType();
  }
  this.$$childElementFunctions[ "UpdatedTime" ] = DateTimeType;
  this.$$elementChildren.push( "UpdatedTime" );
  this.$$minOccurs[ "PrimaryAssignmentGroup" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.PrimaryAssignmentGroup = new StringType();
  }
  this.$$childElementFunctions[ "PrimaryAssignmentGroup" ] = StringType;
  this.$$elementChildren.push( "PrimaryAssignmentGroup" );
  this.$$minOccurs[ "ClosedTime" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ClosedTime = new DateTimeType();
  }
  this.$$childElementFunctions[ "ClosedTime" ] = DateTimeType;
  this.$$elementChildren.push( "ClosedTime" );
  this.$$minOccurs[ "ClosedBy" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ClosedBy = new StringType();
  }
  this.$$childElementFunctions[ "ClosedBy" ] = StringType;
  this.$$elementChildren.push( "ClosedBy" );
  this.$$minOccurs[ "ClosureCode" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ClosureCode = new StringType();
  }
  this.$$childElementFunctions[ "ClosureCode" ] = StringType;
  this.$$elementChildren.push( "ClosureCode" );
  this.$$minOccurs[ "AffectedItem" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.AffectedItem = new StringType();
  }
  this.$$childElementFunctions[ "AffectedItem" ] = StringType;
  this.$$elementChildren.push( "AffectedItem" );
  this.$$minOccurs[ "IncidentDescription" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.IncidentDescription = new IncidentInstanceType_IncidentDescription();
  }
  this.$$childElementFunctions[ "IncidentDescription" ] = IncidentInstanceType_IncidentDescription;
  this.$$elementChildren.push( "IncidentDescription" );
  this.$$minOccurs[ "Resolution" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Resolution = new IncidentInstanceType_Resolution();
  }
  this.$$childElementFunctions[ "Resolution" ] = IncidentInstanceType_Resolution;
  this.$$elementChildren.push( "Resolution" );
  this.$$minOccurs[ "AssigneeName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.AssigneeName = new StringType();
  }
  this.$$childElementFunctions[ "AssigneeName" ] = StringType;
  this.$$elementChildren.push( "AssigneeName" );
  this.$$minOccurs[ "Contact" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Contact = new StringType();
  }
  this.$$childElementFunctions[ "Contact" ] = StringType;
  this.$$elementChildren.push( "Contact" );
  this.$$minOccurs[ "JournalUpdates" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.JournalUpdates = new IncidentInstanceType_JournalUpdates();
  }
  this.$$childElementFunctions[ "JournalUpdates" ] = IncidentInstanceType_JournalUpdates;
  this.$$elementChildren.push( "JournalUpdates" );
  this.$$minOccurs[ "AlertStatus" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.AlertStatus = new StringType();
  }
  this.$$childElementFunctions[ "AlertStatus" ] = StringType;
  this.$$elementChildren.push( "AlertStatus" );
  this.$$minOccurs[ "ContactLastName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ContactLastName = new StringType();
  }
  this.$$childElementFunctions[ "ContactLastName" ] = StringType;
  this.$$elementChildren.push( "ContactLastName" );
  this.$$minOccurs[ "ContactFirstName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ContactFirstName = new StringType();
  }
  this.$$childElementFunctions[ "ContactFirstName" ] = StringType;
  this.$$elementChildren.push( "ContactFirstName" );
  this.$$minOccurs[ "Company" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Company = new StringType();
  }
  this.$$childElementFunctions[ "Company" ] = StringType;
  this.$$elementChildren.push( "Company" );
  this.$$minOccurs[ "BriefDescription" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.BriefDescription = new StringType();
  }
  this.$$childElementFunctions[ "BriefDescription" ] = StringType;
  this.$$elementChildren.push( "BriefDescription" );
  this.$$minOccurs[ "TicketOwner" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.TicketOwner = new StringType();
  }
  this.$$childElementFunctions[ "TicketOwner" ] = StringType;
  this.$$elementChildren.push( "TicketOwner" );
  this.$$minOccurs[ "UpdatedBy" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.UpdatedBy = new StringType();
  }
  this.$$childElementFunctions[ "UpdatedBy" ] = StringType;
  this.$$elementChildren.push( "UpdatedBy" );
  this.$$minOccurs[ "IMTicketStatus" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.IMTicketStatus = new StringType();
  }
  this.$$childElementFunctions[ "IMTicketStatus" ] = StringType;
  this.$$elementChildren.push( "IMTicketStatus" );
  this.$$minOccurs[ "Subcategory" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Subcategory = new StringType();
  }
  this.$$childElementFunctions[ "Subcategory" ] = StringType;
  this.$$elementChildren.push( "Subcategory" );
  this.$$minOccurs[ "SLAAgreementID" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.SLAAgreementID = new DecimalType();
  }
  this.$$childElementFunctions[ "SLAAgreementID" ] = DecimalType;
  this.$$elementChildren.push( "SLAAgreementID" );
  this.$$minOccurs[ "SiteCategory" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.SiteCategory = new StringType();
  }
  this.$$childElementFunctions[ "SiteCategory" ] = StringType;
  this.$$elementChildren.push( "SiteCategory" );
  this.$$minOccurs[ "ProductType" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ProductType = new StringType();
  }
  this.$$childElementFunctions[ "ProductType" ] = StringType;
  this.$$elementChildren.push( "ProductType" );
  this.$$minOccurs[ "ProblemType" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ProblemType = new StringType();
  }
  this.$$childElementFunctions[ "ProblemType" ] = StringType;
  this.$$elementChildren.push( "ProblemType" );
  this.$$minOccurs[ "ResolutionFixType" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ResolutionFixType = new StringType();
  }
  this.$$childElementFunctions[ "ResolutionFixType" ] = StringType;
  this.$$elementChildren.push( "ResolutionFixType" );
  this.$$minOccurs[ "UserPriority" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.UserPriority = new StringType();
  }
  this.$$childElementFunctions[ "UserPriority" ] = StringType;
  this.$$elementChildren.push( "UserPriority" );
  this.$$minOccurs[ "Location" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Location = new StringType();
  }
  this.$$childElementFunctions[ "Location" ] = StringType;
  this.$$elementChildren.push( "Location" );
  this.$$minOccurs[ "Solution" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Solution = new IncidentInstanceType_Solution();
  }
  this.$$childElementFunctions[ "Solution" ] = IncidentInstanceType_Solution;
  this.$$elementChildren.push( "Solution" );
  this.$$minOccurs[ "InitialImpact" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.InitialImpact = new StringType();
  }
  this.$$childElementFunctions[ "InitialImpact" ] = StringType;
  this.$$elementChildren.push( "InitialImpact" );
  this.$$minOccurs[ "folder" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.folder = new StringType();
  }
  this.$$childElementFunctions[ "folder" ] = StringType;
  this.$$elementChildren.push( "folder" );
  this.$$minOccurs[ "Service" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Service = new StringType();
  }
  this.$$childElementFunctions[ "Service" ] = StringType;
  this.$$elementChildren.push( "Service" );
  this.$$minOccurs[ "attachments" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.attachments = new AttachmentsType();
  }
  this.$$childElementFunctions[ "attachments" ] = AttachmentsType;
  this.$$elementChildren.push( "attachments" );
}

function RetrieveIncidentRequest(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "RetrieveIncidentRequest";
  this.$$xmlNames[ "RetrieveIncidentRequest" ] = "RetrieveIncidentRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.attachmentInfo = new Boolean();
  this.$$attributes.push( "attachmentInfo" );
  this.attachmentData = new Boolean();
  this.$$attributes.push( "attachmentData" );
  this.ignoreEmptyElements = new Boolean("true");
  this.$$attributes.push( "ignoreEmptyElements" );
  this.xmlns_ns3 = new String("http://schemas.hp.com/SM/7");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
  if ( this.$$deserializing == undefined )
  {
  this.model = new RetrieveIncidentRequest_IncidentModelType();
  }
  this.$$childElementFunctions[ "model" ] = RetrieveIncidentRequest_IncidentModelType;
  this.$$elementChildren.push( "model" );
}

function RetrieveIncidentRequest_IncidentModelType(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "RetrieveIncidentRequest_IncidentModelType";
  this.$$xmlNames[ "RetrieveIncidentRequest_IncidentModelType" ] = "model";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.query = new String();
  this.$$attributes.push( "query" );
  if ( this.$$deserializing == undefined )
  {
  this.keys = new IncidentModelType_IncidentKeysType();
  }
  this.$$childElementFunctions[ "keys" ] = IncidentModelType_IncidentKeysType;
  this.$$elementChildren.push( "keys" );
  if ( this.$$deserializing == undefined )
  {
  this.instance = new IncidentModelType_IncidentInstanceType();
  }
  this.$$childElementFunctions[ "instance" ] = IncidentModelType_IncidentInstanceType;
  this.$$elementChildren.push( "instance" );
  this.$$minOccurs[ "messages" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.messages = new MessagesType();
  }
  this.$$childElementFunctions[ "messages" ] = MessagesType;
  this.$$elementChildren.push( "messages" );
}

function RetrieveIncidentResponse(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "RetrieveIncidentResponse";
  this.$$xmlNames[ "RetrieveIncidentResponse" ] = "RetrieveIncidentResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.status = new String();
  this.$$attributes.push( "status" );
  this.message = new String();
  this.$$attributes.push( "message" );
  this.schemaRevisionDate = new Date();
  this.$$attributes.push( "schemaRevisionDate" );
  this.schemaRevisionLevel = new Number();
  this.$$attributes.push( "schemaRevisionLevel" );
  this.returnCode = new Number();
  this.$$attributes.push( "returnCode" );
  this.query = new String();
  this.$$attributes.push( "query" );
  if ( this.$$deserializing == undefined )
  {
  this.model = new RetrieveIncidentResponse_IncidentModelType();
  }
  this.$$childElementFunctions[ "model" ] = RetrieveIncidentResponse_IncidentModelType;
  this.$$elementChildren.push( "model" );
  this.$$minOccurs[ "messages" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.messages = new MessagesType();
  }
  this.$$childElementFunctions[ "messages" ] = MessagesType;
  this.$$elementChildren.push( "messages" );
}

function RetrieveIncidentResponse_IncidentModelType(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "RetrieveIncidentResponse_IncidentModelType";
  this.$$xmlNames[ "RetrieveIncidentResponse_IncidentModelType" ] = "model";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.query = new String();
  this.$$attributes.push( "query" );
  if ( this.$$deserializing == undefined )
  {
  this.keys = new IncidentModelType_IncidentKeysType();
  }
  this.$$childElementFunctions[ "keys" ] = IncidentModelType_IncidentKeysType;
  this.$$elementChildren.push( "keys" );
  if ( this.$$deserializing == undefined )
  {
  this.instance = new IncidentModelType_IncidentInstanceType();
  }
  this.$$childElementFunctions[ "instance" ] = IncidentModelType_IncidentInstanceType;
  this.$$elementChildren.push( "instance" );
  this.$$minOccurs[ "messages" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.messages = new MessagesType();
  }
  this.$$childElementFunctions[ "messages" ] = MessagesType;
  this.$$elementChildren.push( "messages" );
}

function RetrieveIncidentKeysListRequest(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "RetrieveIncidentKeysListRequest";
  this.$$xmlNames[ "RetrieveIncidentKeysListRequest" ] = "RetrieveIncidentKeysListRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.attachmentInfo = new Boolean();
  this.$$attributes.push( "attachmentInfo" );
  this.attachmentData = new Boolean();
  this.$$attributes.push( "attachmentData" );
  this.ignoreEmptyElements = new Boolean("true");
  this.$$attributes.push( "ignoreEmptyElements" );
  this.xmlns_ns3 = new String("http://schemas.hp.com/SM/7");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
  if ( this.$$deserializing == undefined )
  {
  this.model = new RetrieveIncidentKeysListRequest_IncidentModelType();
  }
  this.$$childElementFunctions[ "model" ] = RetrieveIncidentKeysListRequest_IncidentModelType;
  this.$$elementChildren.push( "model" );
}

function RetrieveIncidentKeysListRequest_IncidentModelType(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "RetrieveIncidentKeysListRequest_IncidentModelType";
  this.$$xmlNames[ "RetrieveIncidentKeysListRequest_IncidentModelType" ] = "model";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.query = new String();
  this.$$attributes.push( "query" );
  if ( this.$$deserializing == undefined )
  {
  this.keys = new IncidentModelType_IncidentKeysType();
  }
  this.$$childElementFunctions[ "keys" ] = IncidentModelType_IncidentKeysType;
  this.$$elementChildren.push( "keys" );
  if ( this.$$deserializing == undefined )
  {
  this.instance = new IncidentModelType_IncidentInstanceType();
  }
  this.$$childElementFunctions[ "instance" ] = IncidentModelType_IncidentInstanceType;
  this.$$elementChildren.push( "instance" );
  this.$$minOccurs[ "messages" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.messages = new MessagesType();
  }
  this.$$childElementFunctions[ "messages" ] = MessagesType;
  this.$$elementChildren.push( "messages" );
}

function RetrieveIncidentKeysListResponse(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "RetrieveIncidentKeysListResponse";
  this.$$xmlNames[ "RetrieveIncidentKeysListResponse" ] = "RetrieveIncidentKeysListResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.status = new String();
  this.$$attributes.push( "status" );
  this.message = new String();
  this.$$attributes.push( "message" );
  this.schemaRevisionDate = new Date();
  this.$$attributes.push( "schemaRevisionDate" );
  this.schemaRevisionLevel = new Number();
  this.$$attributes.push( "schemaRevisionLevel" );
  this.returnCode = new Number();
  this.$$attributes.push( "returnCode" );
  this.query = new String();
  this.$$attributes.push( "query" );
  this.keys = new Array();  // of RetrieveIncidentKeysListResponse_IncidentKeysType
  this.keys.$$nsPrefix = "ns3"
 // method to create a new member of the keys array
  this.keys.newInstance = function( bDeserializing )
  {
    var newObj = new RetrieveIncidentKeysListResponse_IncidentKeysType( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.keys_newInstance = function( bDeserializing )
  {
    var newLen = this.keys.push( new RetrieveIncidentKeysListResponse_IncidentKeysType( bDeserializing ) );
    return this.keys[ newLen-1 ];
  }
  this.$$elementChildren.push( "keys" );
  this.$$minOccurs[ "messages" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.messages = new MessagesType();
  }
  this.$$childElementFunctions[ "messages" ] = MessagesType;
  this.$$elementChildren.push( "messages" );
}

function RetrieveIncidentKeysListResponse_IncidentKeysType(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "RetrieveIncidentKeysListResponse_IncidentKeysType";
  this.$$xmlNames[ "RetrieveIncidentKeysListResponse_IncidentKeysType" ] = "keys";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.query = new String();
  this.$$attributes.push( "query" );
  this.$$minOccurs[ "IncidentID" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.IncidentID = new StringType();
  }
  this.$$childElementFunctions[ "IncidentID" ] = StringType;
  this.$$elementChildren.push( "IncidentID" );
}

function RetrieveIncidentListRequest(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "RetrieveIncidentListRequest";
  this.$$xmlNames[ "RetrieveIncidentListRequest" ] = "RetrieveIncidentListRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.attachmentInfo = new Boolean();
  this.$$attributes.push( "attachmentInfo" );
  this.attachmentData = new Boolean();
  this.$$attributes.push( "attachmentData" );
  this.ignoreEmptyElements = new Boolean("true");
  this.$$attributes.push( "ignoreEmptyElements" );
  this.xmlns_ns3 = new String("http://schemas.hp.com/SM/7");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
  this.keys = new Array();  // of RetrieveIncidentListRequest_IncidentKeysType
  this.keys.$$nsPrefix = "ns3"
 // method to create a new member of the keys array
  this.keys.newInstance = function( bDeserializing )
  {
    var newObj = new RetrieveIncidentListRequest_IncidentKeysType( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.keys_newInstance = function( bDeserializing )
  {
    var newLen = this.keys.push( new RetrieveIncidentListRequest_IncidentKeysType( bDeserializing ) );
    return this.keys[ newLen-1 ];
  }
  this.$$elementChildren.push( "keys" );
}

function RetrieveIncidentListRequest_IncidentKeysType(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "RetrieveIncidentListRequest_IncidentKeysType";
  this.$$xmlNames[ "RetrieveIncidentListRequest_IncidentKeysType" ] = "keys";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.query = new String();
  this.$$attributes.push( "query" );
  this.$$minOccurs[ "IncidentID" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.IncidentID = new StringType();
  }
  this.$$childElementFunctions[ "IncidentID" ] = StringType;
  this.$$elementChildren.push( "IncidentID" );
}

function RetrieveIncidentListResponse(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "RetrieveIncidentListResponse";
  this.$$xmlNames[ "RetrieveIncidentListResponse" ] = "RetrieveIncidentListResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.status = new String();
  this.$$attributes.push( "status" );
  this.message = new String();
  this.$$attributes.push( "message" );
  this.schemaRevisionDate = new Date();
  this.$$attributes.push( "schemaRevisionDate" );
  this.schemaRevisionLevel = new Number();
  this.$$attributes.push( "schemaRevisionLevel" );
  this.returnCode = new Number();
  this.$$attributes.push( "returnCode" );
  this.query = new String();
  this.$$attributes.push( "query" );
  this.instance = new Array();  // of RetrieveIncidentListResponse_IncidentInstanceType
  this.instance.$$nsPrefix = "ns3"
 // method to create a new member of the instance array
  this.instance.newInstance = function( bDeserializing )
  {
    var newObj = new RetrieveIncidentListResponse_IncidentInstanceType( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.instance_newInstance = function( bDeserializing )
  {
    var newLen = this.instance.push( new RetrieveIncidentListResponse_IncidentInstanceType( bDeserializing ) );
    return this.instance[ newLen-1 ];
  }
  this.$$elementChildren.push( "instance" );
  this.$$minOccurs[ "messages" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.messages = new MessagesType();
  }
  this.$$childElementFunctions[ "messages" ] = MessagesType;
  this.$$elementChildren.push( "messages" );
}

function RetrieveIncidentListResponse_IncidentInstanceType(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "RetrieveIncidentListResponse_IncidentInstanceType";
  this.$$xmlNames[ "RetrieveIncidentListResponse_IncidentInstanceType" ] = "instance";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.query = new String();
  this.$$attributes.push( "query" );
  this.uniquequery = new String();
  this.$$attributes.push( "uniquequery" );
  this.recordid = new String();
  this.$$attributes.push( "recordid" );
  this.$$minOccurs[ "IncidentID" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.IncidentID = new StringType();
  }
  this.$$childElementFunctions[ "IncidentID" ] = StringType;
  this.$$elementChildren.push( "IncidentID" );
  this.$$minOccurs[ "Category" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Category = new StringType();
  }
  this.$$childElementFunctions[ "Category" ] = StringType;
  this.$$elementChildren.push( "Category" );
  this.$$minOccurs[ "OpenTime" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.OpenTime = new DateTimeType();
  }
  this.$$childElementFunctions[ "OpenTime" ] = DateTimeType;
  this.$$elementChildren.push( "OpenTime" );
  this.$$minOccurs[ "OpenedBy" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.OpenedBy = new StringType();
  }
  this.$$childElementFunctions[ "OpenedBy" ] = StringType;
  this.$$elementChildren.push( "OpenedBy" );
  this.$$minOccurs[ "severity" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.severity = new StringType();
  }
  this.$$childElementFunctions[ "severity" ] = StringType;
  this.$$elementChildren.push( "severity" );
  this.$$minOccurs[ "UpdatedTime" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.UpdatedTime = new DateTimeType();
  }
  this.$$childElementFunctions[ "UpdatedTime" ] = DateTimeType;
  this.$$elementChildren.push( "UpdatedTime" );
  this.$$minOccurs[ "PrimaryAssignmentGroup" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.PrimaryAssignmentGroup = new StringType();
  }
  this.$$childElementFunctions[ "PrimaryAssignmentGroup" ] = StringType;
  this.$$elementChildren.push( "PrimaryAssignmentGroup" );
  this.$$minOccurs[ "ClosedTime" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ClosedTime = new DateTimeType();
  }
  this.$$childElementFunctions[ "ClosedTime" ] = DateTimeType;
  this.$$elementChildren.push( "ClosedTime" );
  this.$$minOccurs[ "ClosedBy" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ClosedBy = new StringType();
  }
  this.$$childElementFunctions[ "ClosedBy" ] = StringType;
  this.$$elementChildren.push( "ClosedBy" );
  this.$$minOccurs[ "ClosureCode" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ClosureCode = new StringType();
  }
  this.$$childElementFunctions[ "ClosureCode" ] = StringType;
  this.$$elementChildren.push( "ClosureCode" );
  this.$$minOccurs[ "AffectedItem" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.AffectedItem = new StringType();
  }
  this.$$childElementFunctions[ "AffectedItem" ] = StringType;
  this.$$elementChildren.push( "AffectedItem" );
  this.$$minOccurs[ "IncidentDescription" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.IncidentDescription = new IncidentInstanceType_IncidentDescription();
  }
  this.$$childElementFunctions[ "IncidentDescription" ] = IncidentInstanceType_IncidentDescription;
  this.$$elementChildren.push( "IncidentDescription" );
  this.$$minOccurs[ "Resolution" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Resolution = new IncidentInstanceType_Resolution();
  }
  this.$$childElementFunctions[ "Resolution" ] = IncidentInstanceType_Resolution;
  this.$$elementChildren.push( "Resolution" );
  this.$$minOccurs[ "AssigneeName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.AssigneeName = new StringType();
  }
  this.$$childElementFunctions[ "AssigneeName" ] = StringType;
  this.$$elementChildren.push( "AssigneeName" );
  this.$$minOccurs[ "Contact" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Contact = new StringType();
  }
  this.$$childElementFunctions[ "Contact" ] = StringType;
  this.$$elementChildren.push( "Contact" );
  this.$$minOccurs[ "JournalUpdates" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.JournalUpdates = new IncidentInstanceType_JournalUpdates();
  }
  this.$$childElementFunctions[ "JournalUpdates" ] = IncidentInstanceType_JournalUpdates;
  this.$$elementChildren.push( "JournalUpdates" );
  this.$$minOccurs[ "AlertStatus" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.AlertStatus = new StringType();
  }
  this.$$childElementFunctions[ "AlertStatus" ] = StringType;
  this.$$elementChildren.push( "AlertStatus" );
  this.$$minOccurs[ "ContactLastName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ContactLastName = new StringType();
  }
  this.$$childElementFunctions[ "ContactLastName" ] = StringType;
  this.$$elementChildren.push( "ContactLastName" );
  this.$$minOccurs[ "ContactFirstName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ContactFirstName = new StringType();
  }
  this.$$childElementFunctions[ "ContactFirstName" ] = StringType;
  this.$$elementChildren.push( "ContactFirstName" );
  this.$$minOccurs[ "Company" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Company = new StringType();
  }
  this.$$childElementFunctions[ "Company" ] = StringType;
  this.$$elementChildren.push( "Company" );
  this.$$minOccurs[ "BriefDescription" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.BriefDescription = new StringType();
  }
  this.$$childElementFunctions[ "BriefDescription" ] = StringType;
  this.$$elementChildren.push( "BriefDescription" );
  this.$$minOccurs[ "TicketOwner" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.TicketOwner = new StringType();
  }
  this.$$childElementFunctions[ "TicketOwner" ] = StringType;
  this.$$elementChildren.push( "TicketOwner" );
  this.$$minOccurs[ "UpdatedBy" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.UpdatedBy = new StringType();
  }
  this.$$childElementFunctions[ "UpdatedBy" ] = StringType;
  this.$$elementChildren.push( "UpdatedBy" );
  this.$$minOccurs[ "IMTicketStatus" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.IMTicketStatus = new StringType();
  }
  this.$$childElementFunctions[ "IMTicketStatus" ] = StringType;
  this.$$elementChildren.push( "IMTicketStatus" );
  this.$$minOccurs[ "Subcategory" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Subcategory = new StringType();
  }
  this.$$childElementFunctions[ "Subcategory" ] = StringType;
  this.$$elementChildren.push( "Subcategory" );
  this.$$minOccurs[ "SLAAgreementID" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.SLAAgreementID = new DecimalType();
  }
  this.$$childElementFunctions[ "SLAAgreementID" ] = DecimalType;
  this.$$elementChildren.push( "SLAAgreementID" );
  this.$$minOccurs[ "SiteCategory" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.SiteCategory = new StringType();
  }
  this.$$childElementFunctions[ "SiteCategory" ] = StringType;
  this.$$elementChildren.push( "SiteCategory" );
  this.$$minOccurs[ "ProductType" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ProductType = new StringType();
  }
  this.$$childElementFunctions[ "ProductType" ] = StringType;
  this.$$elementChildren.push( "ProductType" );
  this.$$minOccurs[ "ProblemType" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ProblemType = new StringType();
  }
  this.$$childElementFunctions[ "ProblemType" ] = StringType;
  this.$$elementChildren.push( "ProblemType" );
  this.$$minOccurs[ "ResolutionFixType" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ResolutionFixType = new StringType();
  }
  this.$$childElementFunctions[ "ResolutionFixType" ] = StringType;
  this.$$elementChildren.push( "ResolutionFixType" );
  this.$$minOccurs[ "UserPriority" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.UserPriority = new StringType();
  }
  this.$$childElementFunctions[ "UserPriority" ] = StringType;
  this.$$elementChildren.push( "UserPriority" );
  this.$$minOccurs[ "Location" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Location = new StringType();
  }
  this.$$childElementFunctions[ "Location" ] = StringType;
  this.$$elementChildren.push( "Location" );
  this.$$minOccurs[ "Solution" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Solution = new IncidentInstanceType_Solution();
  }
  this.$$childElementFunctions[ "Solution" ] = IncidentInstanceType_Solution;
  this.$$elementChildren.push( "Solution" );
  this.$$minOccurs[ "InitialImpact" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.InitialImpact = new StringType();
  }
  this.$$childElementFunctions[ "InitialImpact" ] = StringType;
  this.$$elementChildren.push( "InitialImpact" );
  this.$$minOccurs[ "folder" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.folder = new StringType();
  }
  this.$$childElementFunctions[ "folder" ] = StringType;
  this.$$elementChildren.push( "folder" );
  this.$$minOccurs[ "Service" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Service = new StringType();
  }
  this.$$childElementFunctions[ "Service" ] = StringType;
  this.$$elementChildren.push( "Service" );
  this.$$minOccurs[ "attachments" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.attachments = new AttachmentsType();
  }
  this.$$childElementFunctions[ "attachments" ] = AttachmentsType;
  this.$$elementChildren.push( "attachments" );
}

function CreateIncidentRequest(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "CreateIncidentRequest";
  this.$$xmlNames[ "CreateIncidentRequest" ] = "CreateIncidentRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.attachmentInfo = new Boolean();
  this.$$attributes.push( "attachmentInfo" );
  this.attachmentData = new Boolean();
  this.$$attributes.push( "attachmentData" );
  this.ignoreEmptyElements = new Boolean("true");
  this.$$attributes.push( "ignoreEmptyElements" );
  this.xmlns_ns3 = new String("http://schemas.hp.com/SM/7");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
  if ( this.$$deserializing == undefined )
  {
  this.model = new CreateIncidentRequest_IncidentModelType();
  }
  this.$$childElementFunctions[ "model" ] = CreateIncidentRequest_IncidentModelType;
  this.$$elementChildren.push( "model" );
}

function CreateIncidentRequest_IncidentModelType(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "CreateIncidentRequest_IncidentModelType";
  this.$$xmlNames[ "CreateIncidentRequest_IncidentModelType" ] = "model";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.query = new String();
  this.$$attributes.push( "query" );
  if ( this.$$deserializing == undefined )
  {
  this.keys = new IncidentModelType_IncidentKeysType();
  }
  this.$$childElementFunctions[ "keys" ] = IncidentModelType_IncidentKeysType;
  this.$$elementChildren.push( "keys" );
  if ( this.$$deserializing == undefined )
  {
  this.instance = new IncidentModelType_IncidentInstanceType();
  }
  this.$$childElementFunctions[ "instance" ] = IncidentModelType_IncidentInstanceType;
  this.$$elementChildren.push( "instance" );
  this.$$minOccurs[ "messages" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.messages = new MessagesType();
  }
  this.$$childElementFunctions[ "messages" ] = MessagesType;
  this.$$elementChildren.push( "messages" );
}

function CreateIncidentResponse(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "CreateIncidentResponse";
  this.$$xmlNames[ "CreateIncidentResponse" ] = "CreateIncidentResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.status = new String();
  this.$$attributes.push( "status" );
  this.message = new String();
  this.$$attributes.push( "message" );
  this.schemaRevisionDate = new Date();
  this.$$attributes.push( "schemaRevisionDate" );
  this.schemaRevisionLevel = new Number();
  this.$$attributes.push( "schemaRevisionLevel" );
  this.returnCode = new Number();
  this.$$attributes.push( "returnCode" );
  this.query = new String();
  this.$$attributes.push( "query" );
  if ( this.$$deserializing == undefined )
  {
  this.model = new CreateIncidentResponse_IncidentModelType();
  }
  this.$$childElementFunctions[ "model" ] = CreateIncidentResponse_IncidentModelType;
  this.$$elementChildren.push( "model" );
  this.$$minOccurs[ "messages" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.messages = new MessagesType();
  }
  this.$$childElementFunctions[ "messages" ] = MessagesType;
  this.$$elementChildren.push( "messages" );
}

function CreateIncidentResponse_IncidentModelType(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "CreateIncidentResponse_IncidentModelType";
  this.$$xmlNames[ "CreateIncidentResponse_IncidentModelType" ] = "model";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.query = new String();
  this.$$attributes.push( "query" );
  if ( this.$$deserializing == undefined )
  {
  this.keys = new IncidentModelType_IncidentKeysType();
  }
  this.$$childElementFunctions[ "keys" ] = IncidentModelType_IncidentKeysType;
  this.$$elementChildren.push( "keys" );
  if ( this.$$deserializing == undefined )
  {
  this.instance = new IncidentModelType_IncidentInstanceType();
  }
  this.$$childElementFunctions[ "instance" ] = IncidentModelType_IncidentInstanceType;
  this.$$elementChildren.push( "instance" );
  this.$$minOccurs[ "messages" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.messages = new MessagesType();
  }
  this.$$childElementFunctions[ "messages" ] = MessagesType;
  this.$$elementChildren.push( "messages" );
}

function CloseIncidentRequest(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "CloseIncidentRequest";
  this.$$xmlNames[ "CloseIncidentRequest" ] = "CloseIncidentRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.attachmentInfo = new Boolean();
  this.$$attributes.push( "attachmentInfo" );
  this.attachmentData = new Boolean();
  this.$$attributes.push( "attachmentData" );
  this.ignoreEmptyElements = new Boolean("true");
  this.$$attributes.push( "ignoreEmptyElements" );
  this.xmlns_ns3 = new String("http://schemas.hp.com/SM/7");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
  if ( this.$$deserializing == undefined )
  {
  this.model = new CloseIncidentRequest_IncidentModelType();
  }
  this.$$childElementFunctions[ "model" ] = CloseIncidentRequest_IncidentModelType;
  this.$$elementChildren.push( "model" );
}

function CloseIncidentRequest_IncidentModelType(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "CloseIncidentRequest_IncidentModelType";
  this.$$xmlNames[ "CloseIncidentRequest_IncidentModelType" ] = "model";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.query = new String();
  this.$$attributes.push( "query" );
  if ( this.$$deserializing == undefined )
  {
  this.keys = new IncidentModelType_IncidentKeysType();
  }
  this.$$childElementFunctions[ "keys" ] = IncidentModelType_IncidentKeysType;
  this.$$elementChildren.push( "keys" );
  if ( this.$$deserializing == undefined )
  {
  this.instance = new IncidentModelType_IncidentInstanceType();
  }
  this.$$childElementFunctions[ "instance" ] = IncidentModelType_IncidentInstanceType;
  this.$$elementChildren.push( "instance" );
  this.$$minOccurs[ "messages" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.messages = new MessagesType();
  }
  this.$$childElementFunctions[ "messages" ] = MessagesType;
  this.$$elementChildren.push( "messages" );
}

function CloseIncidentResponse(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "CloseIncidentResponse";
  this.$$xmlNames[ "CloseIncidentResponse" ] = "CloseIncidentResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.status = new String();
  this.$$attributes.push( "status" );
  this.message = new String();
  this.$$attributes.push( "message" );
  this.schemaRevisionDate = new Date();
  this.$$attributes.push( "schemaRevisionDate" );
  this.schemaRevisionLevel = new Number();
  this.$$attributes.push( "schemaRevisionLevel" );
  this.returnCode = new Number();
  this.$$attributes.push( "returnCode" );
  this.query = new String();
  this.$$attributes.push( "query" );
  if ( this.$$deserializing == undefined )
  {
  this.model = new CloseIncidentResponse_IncidentModelType();
  }
  this.$$childElementFunctions[ "model" ] = CloseIncidentResponse_IncidentModelType;
  this.$$elementChildren.push( "model" );
  this.$$minOccurs[ "messages" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.messages = new MessagesType();
  }
  this.$$childElementFunctions[ "messages" ] = MessagesType;
  this.$$elementChildren.push( "messages" );
}

function CloseIncidentResponse_IncidentModelType(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "CloseIncidentResponse_IncidentModelType";
  this.$$xmlNames[ "CloseIncidentResponse_IncidentModelType" ] = "model";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.query = new String();
  this.$$attributes.push( "query" );
  if ( this.$$deserializing == undefined )
  {
  this.keys = new IncidentModelType_IncidentKeysType();
  }
  this.$$childElementFunctions[ "keys" ] = IncidentModelType_IncidentKeysType;
  this.$$elementChildren.push( "keys" );
  if ( this.$$deserializing == undefined )
  {
  this.instance = new IncidentModelType_IncidentInstanceType();
  }
  this.$$childElementFunctions[ "instance" ] = IncidentModelType_IncidentInstanceType;
  this.$$elementChildren.push( "instance" );
  this.$$minOccurs[ "messages" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.messages = new MessagesType();
  }
  this.$$childElementFunctions[ "messages" ] = MessagesType;
  this.$$elementChildren.push( "messages" );
}

function ReopenIncidentRequest(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "ReopenIncidentRequest";
  this.$$xmlNames[ "ReopenIncidentRequest" ] = "ReopenIncidentRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.attachmentInfo = new Boolean();
  this.$$attributes.push( "attachmentInfo" );
  this.attachmentData = new Boolean();
  this.$$attributes.push( "attachmentData" );
  this.ignoreEmptyElements = new Boolean("true");
  this.$$attributes.push( "ignoreEmptyElements" );
  this.xmlns_ns3 = new String("http://schemas.hp.com/SM/7");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
  if ( this.$$deserializing == undefined )
  {
  this.model = new ReopenIncidentRequest_IncidentModelType();
  }
  this.$$childElementFunctions[ "model" ] = ReopenIncidentRequest_IncidentModelType;
  this.$$elementChildren.push( "model" );
}

function ReopenIncidentRequest_IncidentModelType(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "ReopenIncidentRequest_IncidentModelType";
  this.$$xmlNames[ "ReopenIncidentRequest_IncidentModelType" ] = "model";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.query = new String();
  this.$$attributes.push( "query" );
  if ( this.$$deserializing == undefined )
  {
  this.keys = new IncidentModelType_IncidentKeysType();
  }
  this.$$childElementFunctions[ "keys" ] = IncidentModelType_IncidentKeysType;
  this.$$elementChildren.push( "keys" );
  if ( this.$$deserializing == undefined )
  {
  this.instance = new IncidentModelType_IncidentInstanceType();
  }
  this.$$childElementFunctions[ "instance" ] = IncidentModelType_IncidentInstanceType;
  this.$$elementChildren.push( "instance" );
  this.$$minOccurs[ "messages" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.messages = new MessagesType();
  }
  this.$$childElementFunctions[ "messages" ] = MessagesType;
  this.$$elementChildren.push( "messages" );
}

function ReopenIncidentResponse(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "ReopenIncidentResponse";
  this.$$xmlNames[ "ReopenIncidentResponse" ] = "ReopenIncidentResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.status = new String();
  this.$$attributes.push( "status" );
  this.message = new String();
  this.$$attributes.push( "message" );
  this.schemaRevisionDate = new Date();
  this.$$attributes.push( "schemaRevisionDate" );
  this.schemaRevisionLevel = new Number();
  this.$$attributes.push( "schemaRevisionLevel" );
  this.returnCode = new Number();
  this.$$attributes.push( "returnCode" );
  this.query = new String();
  this.$$attributes.push( "query" );
  if ( this.$$deserializing == undefined )
  {
  this.model = new ReopenIncidentResponse_IncidentModelType();
  }
  this.$$childElementFunctions[ "model" ] = ReopenIncidentResponse_IncidentModelType;
  this.$$elementChildren.push( "model" );
  this.$$minOccurs[ "messages" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.messages = new MessagesType();
  }
  this.$$childElementFunctions[ "messages" ] = MessagesType;
  this.$$elementChildren.push( "messages" );
}

function ReopenIncidentResponse_IncidentModelType(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "ReopenIncidentResponse_IncidentModelType";
  this.$$xmlNames[ "ReopenIncidentResponse_IncidentModelType" ] = "model";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.query = new String();
  this.$$attributes.push( "query" );
  if ( this.$$deserializing == undefined )
  {
  this.keys = new IncidentModelType_IncidentKeysType();
  }
  this.$$childElementFunctions[ "keys" ] = IncidentModelType_IncidentKeysType;
  this.$$elementChildren.push( "keys" );
  if ( this.$$deserializing == undefined )
  {
  this.instance = new IncidentModelType_IncidentInstanceType();
  }
  this.$$childElementFunctions[ "instance" ] = IncidentModelType_IncidentInstanceType;
  this.$$elementChildren.push( "instance" );
  this.$$minOccurs[ "messages" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.messages = new MessagesType();
  }
  this.$$childElementFunctions[ "messages" ] = MessagesType;
  this.$$elementChildren.push( "messages" );
}

function ResolveIncidentRequest(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "ResolveIncidentRequest";
  this.$$xmlNames[ "ResolveIncidentRequest" ] = "ResolveIncidentRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.attachmentInfo = new Boolean();
  this.$$attributes.push( "attachmentInfo" );
  this.attachmentData = new Boolean();
  this.$$attributes.push( "attachmentData" );
  this.ignoreEmptyElements = new Boolean("true");
  this.$$attributes.push( "ignoreEmptyElements" );
  this.xmlns_ns3 = new String("http://schemas.hp.com/SM/7");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
  if ( this.$$deserializing == undefined )
  {
  this.model = new ResolveIncidentRequest_IncidentModelType();
  }
  this.$$childElementFunctions[ "model" ] = ResolveIncidentRequest_IncidentModelType;
  this.$$elementChildren.push( "model" );
}

function ResolveIncidentRequest_IncidentModelType(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "ResolveIncidentRequest_IncidentModelType";
  this.$$xmlNames[ "ResolveIncidentRequest_IncidentModelType" ] = "model";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.query = new String();
  this.$$attributes.push( "query" );
  if ( this.$$deserializing == undefined )
  {
  this.keys = new IncidentModelType_IncidentKeysType();
  }
  this.$$childElementFunctions[ "keys" ] = IncidentModelType_IncidentKeysType;
  this.$$elementChildren.push( "keys" );
  if ( this.$$deserializing == undefined )
  {
  this.instance = new IncidentModelType_IncidentInstanceType();
  }
  this.$$childElementFunctions[ "instance" ] = IncidentModelType_IncidentInstanceType;
  this.$$elementChildren.push( "instance" );
  this.$$minOccurs[ "messages" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.messages = new MessagesType();
  }
  this.$$childElementFunctions[ "messages" ] = MessagesType;
  this.$$elementChildren.push( "messages" );
}

function ResolveIncidentResponse(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "ResolveIncidentResponse";
  this.$$xmlNames[ "ResolveIncidentResponse" ] = "ResolveIncidentResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.status = new String();
  this.$$attributes.push( "status" );
  this.message = new String();
  this.$$attributes.push( "message" );
  this.schemaRevisionDate = new Date();
  this.$$attributes.push( "schemaRevisionDate" );
  this.schemaRevisionLevel = new Number();
  this.$$attributes.push( "schemaRevisionLevel" );
  this.returnCode = new Number();
  this.$$attributes.push( "returnCode" );
  this.query = new String();
  this.$$attributes.push( "query" );
  if ( this.$$deserializing == undefined )
  {
  this.model = new ResolveIncidentResponse_IncidentModelType();
  }
  this.$$childElementFunctions[ "model" ] = ResolveIncidentResponse_IncidentModelType;
  this.$$elementChildren.push( "model" );
  this.$$minOccurs[ "messages" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.messages = new MessagesType();
  }
  this.$$childElementFunctions[ "messages" ] = MessagesType;
  this.$$elementChildren.push( "messages" );
}

function ResolveIncidentResponse_IncidentModelType(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "ResolveIncidentResponse_IncidentModelType";
  this.$$xmlNames[ "ResolveIncidentResponse_IncidentModelType" ] = "model";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.query = new String();
  this.$$attributes.push( "query" );
  if ( this.$$deserializing == undefined )
  {
  this.keys = new IncidentModelType_IncidentKeysType();
  }
  this.$$childElementFunctions[ "keys" ] = IncidentModelType_IncidentKeysType;
  this.$$elementChildren.push( "keys" );
  if ( this.$$deserializing == undefined )
  {
  this.instance = new IncidentModelType_IncidentInstanceType();
  }
  this.$$childElementFunctions[ "instance" ] = IncidentModelType_IncidentInstanceType;
  this.$$elementChildren.push( "instance" );
  this.$$minOccurs[ "messages" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.messages = new MessagesType();
  }
  this.$$childElementFunctions[ "messages" ] = MessagesType;
  this.$$elementChildren.push( "messages" );
}

function UpdateIncidentRequest(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "UpdateIncidentRequest";
  this.$$xmlNames[ "UpdateIncidentRequest" ] = "UpdateIncidentRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.attachmentInfo = new Boolean();
  this.$$attributes.push( "attachmentInfo" );
  this.attachmentData = new Boolean();
  this.$$attributes.push( "attachmentData" );
  this.ignoreEmptyElements = new Boolean("true");
  this.$$attributes.push( "ignoreEmptyElements" );
  this.xmlns_ns3 = new String("http://schemas.hp.com/SM/7");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
  if ( this.$$deserializing == undefined )
  {
  this.model = new UpdateIncidentRequest_IncidentModelType();
  }
  this.$$childElementFunctions[ "model" ] = UpdateIncidentRequest_IncidentModelType;
  this.$$elementChildren.push( "model" );
}

function UpdateIncidentRequest_IncidentModelType(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "UpdateIncidentRequest_IncidentModelType";
  this.$$xmlNames[ "UpdateIncidentRequest_IncidentModelType" ] = "model";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.query = new String();
  this.$$attributes.push( "query" );
  if ( this.$$deserializing == undefined )
  {
  this.keys = new IncidentModelType_IncidentKeysType();
  }
  this.$$childElementFunctions[ "keys" ] = IncidentModelType_IncidentKeysType;
  this.$$elementChildren.push( "keys" );
  if ( this.$$deserializing == undefined )
  {
  this.instance = new IncidentModelType_IncidentInstanceType();
  }
  this.$$childElementFunctions[ "instance" ] = IncidentModelType_IncidentInstanceType;
  this.$$elementChildren.push( "instance" );
  this.$$minOccurs[ "messages" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.messages = new MessagesType();
  }
  this.$$childElementFunctions[ "messages" ] = MessagesType;
  this.$$elementChildren.push( "messages" );
}

function UpdateIncidentResponse(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "UpdateIncidentResponse";
  this.$$xmlNames[ "UpdateIncidentResponse" ] = "UpdateIncidentResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.status = new String();
  this.$$attributes.push( "status" );
  this.message = new String();
  this.$$attributes.push( "message" );
  this.schemaRevisionDate = new Date();
  this.$$attributes.push( "schemaRevisionDate" );
  this.schemaRevisionLevel = new Number();
  this.$$attributes.push( "schemaRevisionLevel" );
  this.returnCode = new Number();
  this.$$attributes.push( "returnCode" );
  this.query = new String();
  this.$$attributes.push( "query" );
  if ( this.$$deserializing == undefined )
  {
  this.model = new UpdateIncidentResponse_IncidentModelType();
  }
  this.$$childElementFunctions[ "model" ] = UpdateIncidentResponse_IncidentModelType;
  this.$$elementChildren.push( "model" );
  this.$$minOccurs[ "messages" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.messages = new MessagesType();
  }
  this.$$childElementFunctions[ "messages" ] = MessagesType;
  this.$$elementChildren.push( "messages" );
}

function UpdateIncidentResponse_IncidentModelType(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "UpdateIncidentResponse_IncidentModelType";
  this.$$xmlNames[ "UpdateIncidentResponse_IncidentModelType" ] = "model";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.query = new String();
  this.$$attributes.push( "query" );
  if ( this.$$deserializing == undefined )
  {
  this.keys = new IncidentModelType_IncidentKeysType();
  }
  this.$$childElementFunctions[ "keys" ] = IncidentModelType_IncidentKeysType;
  this.$$elementChildren.push( "keys" );
  if ( this.$$deserializing == undefined )
  {
  this.instance = new IncidentModelType_IncidentInstanceType();
  }
  this.$$childElementFunctions[ "instance" ] = IncidentModelType_IncidentInstanceType;
  this.$$elementChildren.push( "instance" );
  this.$$minOccurs[ "messages" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.messages = new MessagesType();
  }
  this.$$childElementFunctions[ "messages" ] = MessagesType;
  this.$$elementChildren.push( "messages" );
}

function IncidentwithoutJournalUpdatesKeysType(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "IncidentwithoutJournalUpdatesKeysType";
  this.$$xmlNames[ "IncidentwithoutJournalUpdatesKeysType" ] = "IncidentwithoutJournalUpdatesKeysType";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.query = new String();
  this.$$attributes.push( "query" );
  this.$$minOccurs[ "IncidentID" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.IncidentID = new StringType();
  }
  this.$$childElementFunctions[ "IncidentID" ] = StringType;
  this.$$elementChildren.push( "IncidentID" );
}

function IncidentwithoutJournalUpdatesInstanceType(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "IncidentwithoutJournalUpdatesInstanceType";
  this.$$xmlNames[ "IncidentwithoutJournalUpdatesInstanceType" ] = "IncidentwithoutJournalUpdatesInstanceType";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.query = new String();
  this.$$attributes.push( "query" );
  this.uniquequery = new String();
  this.$$attributes.push( "uniquequery" );
  this.recordid = new String();
  this.$$attributes.push( "recordid" );
  this.$$minOccurs[ "IncidentID" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.IncidentID = new StringType();
  }
  this.$$childElementFunctions[ "IncidentID" ] = StringType;
  this.$$elementChildren.push( "IncidentID" );
  this.$$minOccurs[ "Category" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Category = new StringType();
  }
  this.$$childElementFunctions[ "Category" ] = StringType;
  this.$$elementChildren.push( "Category" );
  this.$$minOccurs[ "OpenTime" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.OpenTime = new DateTimeType();
  }
  this.$$childElementFunctions[ "OpenTime" ] = DateTimeType;
  this.$$elementChildren.push( "OpenTime" );
  this.$$minOccurs[ "OpenedBy" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.OpenedBy = new StringType();
  }
  this.$$childElementFunctions[ "OpenedBy" ] = StringType;
  this.$$elementChildren.push( "OpenedBy" );
  this.$$minOccurs[ "severity" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.severity = new StringType();
  }
  this.$$childElementFunctions[ "severity" ] = StringType;
  this.$$elementChildren.push( "severity" );
  this.$$minOccurs[ "UpdatedTime" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.UpdatedTime = new DateTimeType();
  }
  this.$$childElementFunctions[ "UpdatedTime" ] = DateTimeType;
  this.$$elementChildren.push( "UpdatedTime" );
  this.$$minOccurs[ "PrimaryAssignmentGroup" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.PrimaryAssignmentGroup = new StringType();
  }
  this.$$childElementFunctions[ "PrimaryAssignmentGroup" ] = StringType;
  this.$$elementChildren.push( "PrimaryAssignmentGroup" );
  this.$$minOccurs[ "ClosedTime" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ClosedTime = new DateTimeType();
  }
  this.$$childElementFunctions[ "ClosedTime" ] = DateTimeType;
  this.$$elementChildren.push( "ClosedTime" );
  this.$$minOccurs[ "ClosedBy" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ClosedBy = new StringType();
  }
  this.$$childElementFunctions[ "ClosedBy" ] = StringType;
  this.$$elementChildren.push( "ClosedBy" );
  this.$$minOccurs[ "ClosureCode" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ClosureCode = new StringType();
  }
  this.$$childElementFunctions[ "ClosureCode" ] = StringType;
  this.$$elementChildren.push( "ClosureCode" );
  this.$$minOccurs[ "AffectedItem" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.AffectedItem = new StringType();
  }
  this.$$childElementFunctions[ "AffectedItem" ] = StringType;
  this.$$elementChildren.push( "AffectedItem" );
  this.$$minOccurs[ "IncidentDescription" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.IncidentDescription = new IncidentwithoutJournalUpdatesInstanceType_IncidentDescription();
  }
  this.$$childElementFunctions[ "IncidentDescription" ] = IncidentwithoutJournalUpdatesInstanceType_IncidentDescription;
  this.$$elementChildren.push( "IncidentDescription" );
  this.$$minOccurs[ "Resolution" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Resolution = new IncidentwithoutJournalUpdatesInstanceType_Resolution();
  }
  this.$$childElementFunctions[ "Resolution" ] = IncidentwithoutJournalUpdatesInstanceType_Resolution;
  this.$$elementChildren.push( "Resolution" );
  this.$$minOccurs[ "AssigneeName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.AssigneeName = new StringType();
  }
  this.$$childElementFunctions[ "AssigneeName" ] = StringType;
  this.$$elementChildren.push( "AssigneeName" );
  this.$$minOccurs[ "Contact" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Contact = new StringType();
  }
  this.$$childElementFunctions[ "Contact" ] = StringType;
  this.$$elementChildren.push( "Contact" );
  this.$$minOccurs[ "AlertStatus" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.AlertStatus = new StringType();
  }
  this.$$childElementFunctions[ "AlertStatus" ] = StringType;
  this.$$elementChildren.push( "AlertStatus" );
  this.$$minOccurs[ "ContactLastName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ContactLastName = new StringType();
  }
  this.$$childElementFunctions[ "ContactLastName" ] = StringType;
  this.$$elementChildren.push( "ContactLastName" );
  this.$$minOccurs[ "ContactFirstName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ContactFirstName = new StringType();
  }
  this.$$childElementFunctions[ "ContactFirstName" ] = StringType;
  this.$$elementChildren.push( "ContactFirstName" );
  this.$$minOccurs[ "Company" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Company = new StringType();
  }
  this.$$childElementFunctions[ "Company" ] = StringType;
  this.$$elementChildren.push( "Company" );
  this.$$minOccurs[ "BriefDescription" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.BriefDescription = new StringType();
  }
  this.$$childElementFunctions[ "BriefDescription" ] = StringType;
  this.$$elementChildren.push( "BriefDescription" );
  this.$$minOccurs[ "TicketOwner" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.TicketOwner = new StringType();
  }
  this.$$childElementFunctions[ "TicketOwner" ] = StringType;
  this.$$elementChildren.push( "TicketOwner" );
  this.$$minOccurs[ "UpdatedBy" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.UpdatedBy = new StringType();
  }
  this.$$childElementFunctions[ "UpdatedBy" ] = StringType;
  this.$$elementChildren.push( "UpdatedBy" );
  this.$$minOccurs[ "IMTicketStatus" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.IMTicketStatus = new StringType();
  }
  this.$$childElementFunctions[ "IMTicketStatus" ] = StringType;
  this.$$elementChildren.push( "IMTicketStatus" );
  this.$$minOccurs[ "Subcategory" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Subcategory = new StringType();
  }
  this.$$childElementFunctions[ "Subcategory" ] = StringType;
  this.$$elementChildren.push( "Subcategory" );
  this.$$minOccurs[ "SLAAgreementID" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.SLAAgreementID = new DecimalType();
  }
  this.$$childElementFunctions[ "SLAAgreementID" ] = DecimalType;
  this.$$elementChildren.push( "SLAAgreementID" );
  this.$$minOccurs[ "SiteCategory" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.SiteCategory = new StringType();
  }
  this.$$childElementFunctions[ "SiteCategory" ] = StringType;
  this.$$elementChildren.push( "SiteCategory" );
  this.$$minOccurs[ "ProductType" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ProductType = new StringType();
  }
  this.$$childElementFunctions[ "ProductType" ] = StringType;
  this.$$elementChildren.push( "ProductType" );
  this.$$minOccurs[ "ProblemType" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ProblemType = new StringType();
  }
  this.$$childElementFunctions[ "ProblemType" ] = StringType;
  this.$$elementChildren.push( "ProblemType" );
  this.$$minOccurs[ "ResolutionFixType" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ResolutionFixType = new StringType();
  }
  this.$$childElementFunctions[ "ResolutionFixType" ] = StringType;
  this.$$elementChildren.push( "ResolutionFixType" );
  this.$$minOccurs[ "UserPriority" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.UserPriority = new StringType();
  }
  this.$$childElementFunctions[ "UserPriority" ] = StringType;
  this.$$elementChildren.push( "UserPriority" );
  this.$$minOccurs[ "Location" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Location = new StringType();
  }
  this.$$childElementFunctions[ "Location" ] = StringType;
  this.$$elementChildren.push( "Location" );
  this.$$minOccurs[ "Solution" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Solution = new IncidentwithoutJournalUpdatesInstanceType_Solution();
  }
  this.$$childElementFunctions[ "Solution" ] = IncidentwithoutJournalUpdatesInstanceType_Solution;
  this.$$elementChildren.push( "Solution" );
  this.$$minOccurs[ "InitialImpact" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.InitialImpact = new StringType();
  }
  this.$$childElementFunctions[ "InitialImpact" ] = StringType;
  this.$$elementChildren.push( "InitialImpact" );
  this.$$minOccurs[ "folder" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.folder = new StringType();
  }
  this.$$childElementFunctions[ "folder" ] = StringType;
  this.$$elementChildren.push( "folder" );
  this.$$minOccurs[ "Service" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Service = new StringType();
  }
  this.$$childElementFunctions[ "Service" ] = StringType;
  this.$$elementChildren.push( "Service" );
  this.$$minOccurs[ "attachments" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.attachments = new AttachmentsType();
  }
  this.$$childElementFunctions[ "attachments" ] = AttachmentsType;
  this.$$elementChildren.push( "attachments" );
}

function IncidentwithoutJournalUpdatesInstanceType_IncidentDescription(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "IncidentwithoutJournalUpdatesInstanceType_IncidentDescription";
  this.$$xmlNames[ "IncidentwithoutJournalUpdatesInstanceType_IncidentDescription" ] = "IncidentDescription";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.type = new String("Array");
  this.$$attributes.push( "type" );
  this.IncidentDescription = new Array();  // of StringType
  this.IncidentDescription.$$nsPrefix = "ns3"
 // method to create a new member of the IncidentDescription array
  this.IncidentDescription.newInstance = function( bDeserializing )
  {
    var newObj = new StringType(  );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.IncidentDescription_newInstance = function( bDeserializing )
  {
    var newLen = this.IncidentDescription.push( new StringType(  ) );
    return this.IncidentDescription[ newLen-1 ];
  }
  this.$$elementChildren.push( "IncidentDescription" );
}

function IncidentwithoutJournalUpdatesInstanceType_Resolution(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "IncidentwithoutJournalUpdatesInstanceType_Resolution";
  this.$$xmlNames[ "IncidentwithoutJournalUpdatesInstanceType_Resolution" ] = "Resolution";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.type = new String("Array");
  this.$$attributes.push( "type" );
  this.Resolution = new Array();  // of StringType
  this.Resolution.$$nsPrefix = "ns3"
 // method to create a new member of the Resolution array
  this.Resolution.newInstance = function( bDeserializing )
  {
    var newObj = new StringType(  );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.Resolution_newInstance = function( bDeserializing )
  {
    var newLen = this.Resolution.push( new StringType(  ) );
    return this.Resolution[ newLen-1 ];
  }
  this.$$elementChildren.push( "Resolution" );
}

function IncidentwithoutJournalUpdatesInstanceType_Solution(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "IncidentwithoutJournalUpdatesInstanceType_Solution";
  this.$$xmlNames[ "IncidentwithoutJournalUpdatesInstanceType_Solution" ] = "Solution";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.type = new String("Array");
  this.$$attributes.push( "type" );
  this.Solution = new Array();  // of StringType
  this.Solution.$$nsPrefix = "ns3"
 // method to create a new member of the Solution array
  this.Solution.newInstance = function( bDeserializing )
  {
    var newObj = new StringType(  );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.Solution_newInstance = function( bDeserializing )
  {
    var newLen = this.Solution.push( new StringType(  ) );
    return this.Solution[ newLen-1 ];
  }
  this.$$elementChildren.push( "Solution" );
}

function IncidentwithoutJournalUpdatesModelType(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "IncidentwithoutJournalUpdatesModelType";
  this.$$xmlNames[ "IncidentwithoutJournalUpdatesModelType" ] = "IncidentwithoutJournalUpdatesModelType";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.query = new String();
  this.$$attributes.push( "query" );
  if ( this.$$deserializing == undefined )
  {
  this.keys = new IncidentwithoutJournalUpdatesModelType_IncidentwithoutJournalUpdatesKeysType();
  }
  this.$$childElementFunctions[ "keys" ] = IncidentwithoutJournalUpdatesModelType_IncidentwithoutJournalUpdatesKeysType;
  this.$$elementChildren.push( "keys" );
  if ( this.$$deserializing == undefined )
  {
  this.instance = new IncidentwithoutJournalUpdatesModelType_IncidentwithoutJournalUpdatesInstanceType();
  }
  this.$$childElementFunctions[ "instance" ] = IncidentwithoutJournalUpdatesModelType_IncidentwithoutJournalUpdatesInstanceType;
  this.$$elementChildren.push( "instance" );
  this.$$minOccurs[ "messages" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.messages = new MessagesType();
  }
  this.$$childElementFunctions[ "messages" ] = MessagesType;
  this.$$elementChildren.push( "messages" );
}

function IncidentwithoutJournalUpdatesModelType_IncidentwithoutJournalUpdatesKeysType(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "IncidentwithoutJournalUpdatesModelType_IncidentwithoutJournalUpdatesKeysType";
  this.$$xmlNames[ "IncidentwithoutJournalUpdatesModelType_IncidentwithoutJournalUpdatesKeysType" ] = "keys";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.query = new String();
  this.$$attributes.push( "query" );
  this.$$minOccurs[ "IncidentID" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.IncidentID = new StringType();
  }
  this.$$childElementFunctions[ "IncidentID" ] = StringType;
  this.$$elementChildren.push( "IncidentID" );
}

function IncidentwithoutJournalUpdatesModelType_IncidentwithoutJournalUpdatesInstanceType(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "IncidentwithoutJournalUpdatesModelType_IncidentwithoutJournalUpdatesInstanceType";
  this.$$xmlNames[ "IncidentwithoutJournalUpdatesModelType_IncidentwithoutJournalUpdatesInstanceType" ] = "instance";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.query = new String();
  this.$$attributes.push( "query" );
  this.uniquequery = new String();
  this.$$attributes.push( "uniquequery" );
  this.recordid = new String();
  this.$$attributes.push( "recordid" );
  this.$$minOccurs[ "IncidentID" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.IncidentID = new StringType();
  }
  this.$$childElementFunctions[ "IncidentID" ] = StringType;
  this.$$elementChildren.push( "IncidentID" );
  this.$$minOccurs[ "Category" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Category = new StringType();
  }
  this.$$childElementFunctions[ "Category" ] = StringType;
  this.$$elementChildren.push( "Category" );
  this.$$minOccurs[ "OpenTime" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.OpenTime = new DateTimeType();
  }
  this.$$childElementFunctions[ "OpenTime" ] = DateTimeType;
  this.$$elementChildren.push( "OpenTime" );
  this.$$minOccurs[ "OpenedBy" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.OpenedBy = new StringType();
  }
  this.$$childElementFunctions[ "OpenedBy" ] = StringType;
  this.$$elementChildren.push( "OpenedBy" );
  this.$$minOccurs[ "severity" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.severity = new StringType();
  }
  this.$$childElementFunctions[ "severity" ] = StringType;
  this.$$elementChildren.push( "severity" );
  this.$$minOccurs[ "UpdatedTime" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.UpdatedTime = new DateTimeType();
  }
  this.$$childElementFunctions[ "UpdatedTime" ] = DateTimeType;
  this.$$elementChildren.push( "UpdatedTime" );
  this.$$minOccurs[ "PrimaryAssignmentGroup" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.PrimaryAssignmentGroup = new StringType();
  }
  this.$$childElementFunctions[ "PrimaryAssignmentGroup" ] = StringType;
  this.$$elementChildren.push( "PrimaryAssignmentGroup" );
  this.$$minOccurs[ "ClosedTime" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ClosedTime = new DateTimeType();
  }
  this.$$childElementFunctions[ "ClosedTime" ] = DateTimeType;
  this.$$elementChildren.push( "ClosedTime" );
  this.$$minOccurs[ "ClosedBy" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ClosedBy = new StringType();
  }
  this.$$childElementFunctions[ "ClosedBy" ] = StringType;
  this.$$elementChildren.push( "ClosedBy" );
  this.$$minOccurs[ "ClosureCode" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ClosureCode = new StringType();
  }
  this.$$childElementFunctions[ "ClosureCode" ] = StringType;
  this.$$elementChildren.push( "ClosureCode" );
  this.$$minOccurs[ "AffectedItem" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.AffectedItem = new StringType();
  }
  this.$$childElementFunctions[ "AffectedItem" ] = StringType;
  this.$$elementChildren.push( "AffectedItem" );
  this.$$minOccurs[ "IncidentDescription" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.IncidentDescription = new IncidentwithoutJournalUpdatesInstanceType_IncidentDescription();
  }
  this.$$childElementFunctions[ "IncidentDescription" ] = IncidentwithoutJournalUpdatesInstanceType_IncidentDescription;
  this.$$elementChildren.push( "IncidentDescription" );
  this.$$minOccurs[ "Resolution" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Resolution = new IncidentwithoutJournalUpdatesInstanceType_Resolution();
  }
  this.$$childElementFunctions[ "Resolution" ] = IncidentwithoutJournalUpdatesInstanceType_Resolution;
  this.$$elementChildren.push( "Resolution" );
  this.$$minOccurs[ "AssigneeName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.AssigneeName = new StringType();
  }
  this.$$childElementFunctions[ "AssigneeName" ] = StringType;
  this.$$elementChildren.push( "AssigneeName" );
  this.$$minOccurs[ "Contact" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Contact = new StringType();
  }
  this.$$childElementFunctions[ "Contact" ] = StringType;
  this.$$elementChildren.push( "Contact" );
  this.$$minOccurs[ "AlertStatus" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.AlertStatus = new StringType();
  }
  this.$$childElementFunctions[ "AlertStatus" ] = StringType;
  this.$$elementChildren.push( "AlertStatus" );
  this.$$minOccurs[ "ContactLastName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ContactLastName = new StringType();
  }
  this.$$childElementFunctions[ "ContactLastName" ] = StringType;
  this.$$elementChildren.push( "ContactLastName" );
  this.$$minOccurs[ "ContactFirstName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ContactFirstName = new StringType();
  }
  this.$$childElementFunctions[ "ContactFirstName" ] = StringType;
  this.$$elementChildren.push( "ContactFirstName" );
  this.$$minOccurs[ "Company" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Company = new StringType();
  }
  this.$$childElementFunctions[ "Company" ] = StringType;
  this.$$elementChildren.push( "Company" );
  this.$$minOccurs[ "BriefDescription" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.BriefDescription = new StringType();
  }
  this.$$childElementFunctions[ "BriefDescription" ] = StringType;
  this.$$elementChildren.push( "BriefDescription" );
  this.$$minOccurs[ "TicketOwner" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.TicketOwner = new StringType();
  }
  this.$$childElementFunctions[ "TicketOwner" ] = StringType;
  this.$$elementChildren.push( "TicketOwner" );
  this.$$minOccurs[ "UpdatedBy" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.UpdatedBy = new StringType();
  }
  this.$$childElementFunctions[ "UpdatedBy" ] = StringType;
  this.$$elementChildren.push( "UpdatedBy" );
  this.$$minOccurs[ "IMTicketStatus" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.IMTicketStatus = new StringType();
  }
  this.$$childElementFunctions[ "IMTicketStatus" ] = StringType;
  this.$$elementChildren.push( "IMTicketStatus" );
  this.$$minOccurs[ "Subcategory" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Subcategory = new StringType();
  }
  this.$$childElementFunctions[ "Subcategory" ] = StringType;
  this.$$elementChildren.push( "Subcategory" );
  this.$$minOccurs[ "SLAAgreementID" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.SLAAgreementID = new DecimalType();
  }
  this.$$childElementFunctions[ "SLAAgreementID" ] = DecimalType;
  this.$$elementChildren.push( "SLAAgreementID" );
  this.$$minOccurs[ "SiteCategory" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.SiteCategory = new StringType();
  }
  this.$$childElementFunctions[ "SiteCategory" ] = StringType;
  this.$$elementChildren.push( "SiteCategory" );
  this.$$minOccurs[ "ProductType" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ProductType = new StringType();
  }
  this.$$childElementFunctions[ "ProductType" ] = StringType;
  this.$$elementChildren.push( "ProductType" );
  this.$$minOccurs[ "ProblemType" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ProblemType = new StringType();
  }
  this.$$childElementFunctions[ "ProblemType" ] = StringType;
  this.$$elementChildren.push( "ProblemType" );
  this.$$minOccurs[ "ResolutionFixType" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ResolutionFixType = new StringType();
  }
  this.$$childElementFunctions[ "ResolutionFixType" ] = StringType;
  this.$$elementChildren.push( "ResolutionFixType" );
  this.$$minOccurs[ "UserPriority" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.UserPriority = new StringType();
  }
  this.$$childElementFunctions[ "UserPriority" ] = StringType;
  this.$$elementChildren.push( "UserPriority" );
  this.$$minOccurs[ "Location" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Location = new StringType();
  }
  this.$$childElementFunctions[ "Location" ] = StringType;
  this.$$elementChildren.push( "Location" );
  this.$$minOccurs[ "Solution" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Solution = new IncidentwithoutJournalUpdatesInstanceType_Solution();
  }
  this.$$childElementFunctions[ "Solution" ] = IncidentwithoutJournalUpdatesInstanceType_Solution;
  this.$$elementChildren.push( "Solution" );
  this.$$minOccurs[ "InitialImpact" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.InitialImpact = new StringType();
  }
  this.$$childElementFunctions[ "InitialImpact" ] = StringType;
  this.$$elementChildren.push( "InitialImpact" );
  this.$$minOccurs[ "folder" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.folder = new StringType();
  }
  this.$$childElementFunctions[ "folder" ] = StringType;
  this.$$elementChildren.push( "folder" );
  this.$$minOccurs[ "Service" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Service = new StringType();
  }
  this.$$childElementFunctions[ "Service" ] = StringType;
  this.$$elementChildren.push( "Service" );
  this.$$minOccurs[ "attachments" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.attachments = new AttachmentsType();
  }
  this.$$childElementFunctions[ "attachments" ] = AttachmentsType;
  this.$$elementChildren.push( "attachments" );
}

function RetrieveIncidentwithoutJournalUpdatesRequest(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "RetrieveIncidentwithoutJournalUpdatesRequest";
  this.$$xmlNames[ "RetrieveIncidentwithoutJournalUpdatesRequest" ] = "RetrieveIncidentwithoutJournalUpdatesRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.attachmentInfo = new Boolean();
  this.$$attributes.push( "attachmentInfo" );
  this.attachmentData = new Boolean();
  this.$$attributes.push( "attachmentData" );
  this.ignoreEmptyElements = new Boolean("true");
  this.$$attributes.push( "ignoreEmptyElements" );
  this.xmlns_ns3 = new String("http://schemas.hp.com/SM/7");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
  if ( this.$$deserializing == undefined )
  {
  this.model = new RetrieveIncidentwithoutJournalUpdatesRequest_IncidentwithoutJournalUpdatesModelType();
  }
  this.$$childElementFunctions[ "model" ] = RetrieveIncidentwithoutJournalUpdatesRequest_IncidentwithoutJournalUpdatesModelType;
  this.$$elementChildren.push( "model" );
}

function RetrieveIncidentwithoutJournalUpdatesRequest_IncidentwithoutJournalUpdatesModelType(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "RetrieveIncidentwithoutJournalUpdatesRequest_IncidentwithoutJournalUpdatesModelType";
  this.$$xmlNames[ "RetrieveIncidentwithoutJournalUpdatesRequest_IncidentwithoutJournalUpdatesModelType" ] = "model";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.query = new String();
  this.$$attributes.push( "query" );
  if ( this.$$deserializing == undefined )
  {
  this.keys = new IncidentwithoutJournalUpdatesModelType_IncidentwithoutJournalUpdatesKeysType();
  }
  this.$$childElementFunctions[ "keys" ] = IncidentwithoutJournalUpdatesModelType_IncidentwithoutJournalUpdatesKeysType;
  this.$$elementChildren.push( "keys" );
  if ( this.$$deserializing == undefined )
  {
  this.instance = new IncidentwithoutJournalUpdatesModelType_IncidentwithoutJournalUpdatesInstanceType();
  }
  this.$$childElementFunctions[ "instance" ] = IncidentwithoutJournalUpdatesModelType_IncidentwithoutJournalUpdatesInstanceType;
  this.$$elementChildren.push( "instance" );
  this.$$minOccurs[ "messages" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.messages = new MessagesType();
  }
  this.$$childElementFunctions[ "messages" ] = MessagesType;
  this.$$elementChildren.push( "messages" );
}

function RetrieveIncidentwithoutJournalUpdatesResponse(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "RetrieveIncidentwithoutJournalUpdatesResponse";
  this.$$xmlNames[ "RetrieveIncidentwithoutJournalUpdatesResponse" ] = "RetrieveIncidentwithoutJournalUpdatesResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.status = new String();
  this.$$attributes.push( "status" );
  this.message = new String();
  this.$$attributes.push( "message" );
  this.schemaRevisionDate = new Date();
  this.$$attributes.push( "schemaRevisionDate" );
  this.schemaRevisionLevel = new Number();
  this.$$attributes.push( "schemaRevisionLevel" );
  this.returnCode = new Number();
  this.$$attributes.push( "returnCode" );
  this.query = new String();
  this.$$attributes.push( "query" );
  if ( this.$$deserializing == undefined )
  {
  this.model = new RetrieveIncidentwithoutJournalUpdatesResponse_IncidentwithoutJournalUpdatesModelType();
  }
  this.$$childElementFunctions[ "model" ] = RetrieveIncidentwithoutJournalUpdatesResponse_IncidentwithoutJournalUpdatesModelType;
  this.$$elementChildren.push( "model" );
  this.$$minOccurs[ "messages" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.messages = new MessagesType();
  }
  this.$$childElementFunctions[ "messages" ] = MessagesType;
  this.$$elementChildren.push( "messages" );
}

function RetrieveIncidentwithoutJournalUpdatesResponse_IncidentwithoutJournalUpdatesModelType(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "RetrieveIncidentwithoutJournalUpdatesResponse_IncidentwithoutJournalUpdatesModelType";
  this.$$xmlNames[ "RetrieveIncidentwithoutJournalUpdatesResponse_IncidentwithoutJournalUpdatesModelType" ] = "model";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.query = new String();
  this.$$attributes.push( "query" );
  if ( this.$$deserializing == undefined )
  {
  this.keys = new IncidentwithoutJournalUpdatesModelType_IncidentwithoutJournalUpdatesKeysType();
  }
  this.$$childElementFunctions[ "keys" ] = IncidentwithoutJournalUpdatesModelType_IncidentwithoutJournalUpdatesKeysType;
  this.$$elementChildren.push( "keys" );
  if ( this.$$deserializing == undefined )
  {
  this.instance = new IncidentwithoutJournalUpdatesModelType_IncidentwithoutJournalUpdatesInstanceType();
  }
  this.$$childElementFunctions[ "instance" ] = IncidentwithoutJournalUpdatesModelType_IncidentwithoutJournalUpdatesInstanceType;
  this.$$elementChildren.push( "instance" );
  this.$$minOccurs[ "messages" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.messages = new MessagesType();
  }
  this.$$childElementFunctions[ "messages" ] = MessagesType;
  this.$$elementChildren.push( "messages" );
}

function RetrieveIncidentwithoutJournalUpdatesKeysListRequest(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "RetrieveIncidentwithoutJournalUpdatesKeysListRequest";
  this.$$xmlNames[ "RetrieveIncidentwithoutJournalUpdatesKeysListRequest" ] = "RetrieveIncidentwithoutJournalUpdatesKeysListRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.attachmentInfo = new Boolean();
  this.$$attributes.push( "attachmentInfo" );
  this.attachmentData = new Boolean();
  this.$$attributes.push( "attachmentData" );
  this.ignoreEmptyElements = new Boolean("true");
  this.$$attributes.push( "ignoreEmptyElements" );
  this.xmlns_ns3 = new String("http://schemas.hp.com/SM/7");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
  if ( this.$$deserializing == undefined )
  {
  this.model = new RetrieveIncidentwithoutJournalUpdatesKeysListRequest_IncidentwithoutJournalUpdatesModelType();
  }
  this.$$childElementFunctions[ "model" ] = RetrieveIncidentwithoutJournalUpdatesKeysListRequest_IncidentwithoutJournalUpdatesModelType;
  this.$$elementChildren.push( "model" );
}

function RetrieveIncidentwithoutJournalUpdatesKeysListRequest_IncidentwithoutJournalUpdatesModelType(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "RetrieveIncidentwithoutJournalUpdatesKeysListRequest_IncidentwithoutJournalUpdatesModelType";
  this.$$xmlNames[ "RetrieveIncidentwithoutJournalUpdatesKeysListRequest_IncidentwithoutJournalUpdatesModelType" ] = "model";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.query = new String();
  this.$$attributes.push( "query" );
  if ( this.$$deserializing == undefined )
  {
  this.keys = new IncidentwithoutJournalUpdatesModelType_IncidentwithoutJournalUpdatesKeysType();
  }
  this.$$childElementFunctions[ "keys" ] = IncidentwithoutJournalUpdatesModelType_IncidentwithoutJournalUpdatesKeysType;
  this.$$elementChildren.push( "keys" );
  if ( this.$$deserializing == undefined )
  {
  this.instance = new IncidentwithoutJournalUpdatesModelType_IncidentwithoutJournalUpdatesInstanceType();
  }
  this.$$childElementFunctions[ "instance" ] = IncidentwithoutJournalUpdatesModelType_IncidentwithoutJournalUpdatesInstanceType;
  this.$$elementChildren.push( "instance" );
  this.$$minOccurs[ "messages" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.messages = new MessagesType();
  }
  this.$$childElementFunctions[ "messages" ] = MessagesType;
  this.$$elementChildren.push( "messages" );
}

function RetrieveIncidentwithoutJournalUpdatesKeysListResponse(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "RetrieveIncidentwithoutJournalUpdatesKeysListResponse";
  this.$$xmlNames[ "RetrieveIncidentwithoutJournalUpdatesKeysListResponse" ] = "RetrieveIncidentwithoutJournalUpdatesKeysListResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.status = new String();
  this.$$attributes.push( "status" );
  this.message = new String();
  this.$$attributes.push( "message" );
  this.schemaRevisionDate = new Date();
  this.$$attributes.push( "schemaRevisionDate" );
  this.schemaRevisionLevel = new Number();
  this.$$attributes.push( "schemaRevisionLevel" );
  this.returnCode = new Number();
  this.$$attributes.push( "returnCode" );
  this.query = new String();
  this.$$attributes.push( "query" );
  this.keys = new Array();  // of RetrieveIncidentwithoutJournalUpdatesKeysListResponse_IncidentwithoutJournalUpdatesKeysType
  this.keys.$$nsPrefix = "ns3"
 // method to create a new member of the keys array
  this.keys.newInstance = function( bDeserializing )
  {
    var newObj = new RetrieveIncidentwithoutJournalUpdatesKeysListResponse_IncidentwithoutJournalUpdatesKeysType( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.keys_newInstance = function( bDeserializing )
  {
    var newLen = this.keys.push( new RetrieveIncidentwithoutJournalUpdatesKeysListResponse_IncidentwithoutJournalUpdatesKeysType( bDeserializing ) );
    return this.keys[ newLen-1 ];
  }
  this.$$elementChildren.push( "keys" );
  this.$$minOccurs[ "messages" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.messages = new MessagesType();
  }
  this.$$childElementFunctions[ "messages" ] = MessagesType;
  this.$$elementChildren.push( "messages" );
}

function RetrieveIncidentwithoutJournalUpdatesKeysListResponse_IncidentwithoutJournalUpdatesKeysType(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "RetrieveIncidentwithoutJournalUpdatesKeysListResponse_IncidentwithoutJournalUpdatesKeysType";
  this.$$xmlNames[ "RetrieveIncidentwithoutJournalUpdatesKeysListResponse_IncidentwithoutJournalUpdatesKeysType" ] = "keys";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.query = new String();
  this.$$attributes.push( "query" );
  this.$$minOccurs[ "IncidentID" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.IncidentID = new StringType();
  }
  this.$$childElementFunctions[ "IncidentID" ] = StringType;
  this.$$elementChildren.push( "IncidentID" );
}

function RetrieveIncidentwithoutJournalUpdatesListRequest(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "RetrieveIncidentwithoutJournalUpdatesListRequest";
  this.$$xmlNames[ "RetrieveIncidentwithoutJournalUpdatesListRequest" ] = "RetrieveIncidentwithoutJournalUpdatesListRequest";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.attachmentInfo = new Boolean();
  this.$$attributes.push( "attachmentInfo" );
  this.attachmentData = new Boolean();
  this.$$attributes.push( "attachmentData" );
  this.ignoreEmptyElements = new Boolean("true");
  this.$$attributes.push( "ignoreEmptyElements" );
  this.xmlns_ns3 = new String("http://schemas.hp.com/SM/7");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
  this.keys = new Array();  // of RetrieveIncidentwithoutJournalUpdatesListRequest_IncidentwithoutJournalUpdatesKeysType
  this.keys.$$nsPrefix = "ns3"
 // method to create a new member of the keys array
  this.keys.newInstance = function( bDeserializing )
  {
    var newObj = new RetrieveIncidentwithoutJournalUpdatesListRequest_IncidentwithoutJournalUpdatesKeysType( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.keys_newInstance = function( bDeserializing )
  {
    var newLen = this.keys.push( new RetrieveIncidentwithoutJournalUpdatesListRequest_IncidentwithoutJournalUpdatesKeysType( bDeserializing ) );
    return this.keys[ newLen-1 ];
  }
  this.$$elementChildren.push( "keys" );
}

function RetrieveIncidentwithoutJournalUpdatesListRequest_IncidentwithoutJournalUpdatesKeysType(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "RetrieveIncidentwithoutJournalUpdatesListRequest_IncidentwithoutJournalUpdatesKeysType";
  this.$$xmlNames[ "RetrieveIncidentwithoutJournalUpdatesListRequest_IncidentwithoutJournalUpdatesKeysType" ] = "keys";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.query = new String();
  this.$$attributes.push( "query" );
  this.$$minOccurs[ "IncidentID" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.IncidentID = new StringType();
  }
  this.$$childElementFunctions[ "IncidentID" ] = StringType;
  this.$$elementChildren.push( "IncidentID" );
}

function RetrieveIncidentwithoutJournalUpdatesListResponse(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "RetrieveIncidentwithoutJournalUpdatesListResponse";
  this.$$xmlNames[ "RetrieveIncidentwithoutJournalUpdatesListResponse" ] = "RetrieveIncidentwithoutJournalUpdatesListResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.status = new String();
  this.$$attributes.push( "status" );
  this.message = new String();
  this.$$attributes.push( "message" );
  this.schemaRevisionDate = new Date();
  this.$$attributes.push( "schemaRevisionDate" );
  this.schemaRevisionLevel = new Number();
  this.$$attributes.push( "schemaRevisionLevel" );
  this.returnCode = new Number();
  this.$$attributes.push( "returnCode" );
  this.query = new String();
  this.$$attributes.push( "query" );
  this.instance = new Array();  // of RetrieveIncidentwithoutJournalUpdatesListResponse_IncidentwithoutJournalUpdatesInstanceType
  this.instance.$$nsPrefix = "ns3"
 // method to create a new member of the instance array
  this.instance.newInstance = function( bDeserializing )
  {
    var newObj = new RetrieveIncidentwithoutJournalUpdatesListResponse_IncidentwithoutJournalUpdatesInstanceType( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.instance_newInstance = function( bDeserializing )
  {
    var newLen = this.instance.push( new RetrieveIncidentwithoutJournalUpdatesListResponse_IncidentwithoutJournalUpdatesInstanceType( bDeserializing ) );
    return this.instance[ newLen-1 ];
  }
  this.$$elementChildren.push( "instance" );
  this.$$minOccurs[ "messages" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.messages = new MessagesType();
  }
  this.$$childElementFunctions[ "messages" ] = MessagesType;
  this.$$elementChildren.push( "messages" );
}

function RetrieveIncidentwithoutJournalUpdatesListResponse_IncidentwithoutJournalUpdatesInstanceType(  ) 
{
  this.$$nsPrefix = "ns3";
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
  this.$$name = "RetrieveIncidentwithoutJournalUpdatesListResponse_IncidentwithoutJournalUpdatesInstanceType";
  this.$$xmlNames[ "RetrieveIncidentwithoutJournalUpdatesListResponse_IncidentwithoutJournalUpdatesInstanceType" ] = "instance";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.query = new String();
  this.$$attributes.push( "query" );
  this.uniquequery = new String();
  this.$$attributes.push( "uniquequery" );
  this.recordid = new String();
  this.$$attributes.push( "recordid" );
  this.$$minOccurs[ "IncidentID" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.IncidentID = new StringType();
  }
  this.$$childElementFunctions[ "IncidentID" ] = StringType;
  this.$$elementChildren.push( "IncidentID" );
  this.$$minOccurs[ "Category" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Category = new StringType();
  }
  this.$$childElementFunctions[ "Category" ] = StringType;
  this.$$elementChildren.push( "Category" );
  this.$$minOccurs[ "OpenTime" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.OpenTime = new DateTimeType();
  }
  this.$$childElementFunctions[ "OpenTime" ] = DateTimeType;
  this.$$elementChildren.push( "OpenTime" );
  this.$$minOccurs[ "OpenedBy" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.OpenedBy = new StringType();
  }
  this.$$childElementFunctions[ "OpenedBy" ] = StringType;
  this.$$elementChildren.push( "OpenedBy" );
  this.$$minOccurs[ "severity" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.severity = new StringType();
  }
  this.$$childElementFunctions[ "severity" ] = StringType;
  this.$$elementChildren.push( "severity" );
  this.$$minOccurs[ "UpdatedTime" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.UpdatedTime = new DateTimeType();
  }
  this.$$childElementFunctions[ "UpdatedTime" ] = DateTimeType;
  this.$$elementChildren.push( "UpdatedTime" );
  this.$$minOccurs[ "PrimaryAssignmentGroup" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.PrimaryAssignmentGroup = new StringType();
  }
  this.$$childElementFunctions[ "PrimaryAssignmentGroup" ] = StringType;
  this.$$elementChildren.push( "PrimaryAssignmentGroup" );
  this.$$minOccurs[ "ClosedTime" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ClosedTime = new DateTimeType();
  }
  this.$$childElementFunctions[ "ClosedTime" ] = DateTimeType;
  this.$$elementChildren.push( "ClosedTime" );
  this.$$minOccurs[ "ClosedBy" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ClosedBy = new StringType();
  }
  this.$$childElementFunctions[ "ClosedBy" ] = StringType;
  this.$$elementChildren.push( "ClosedBy" );
  this.$$minOccurs[ "ClosureCode" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ClosureCode = new StringType();
  }
  this.$$childElementFunctions[ "ClosureCode" ] = StringType;
  this.$$elementChildren.push( "ClosureCode" );
  this.$$minOccurs[ "AffectedItem" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.AffectedItem = new StringType();
  }
  this.$$childElementFunctions[ "AffectedItem" ] = StringType;
  this.$$elementChildren.push( "AffectedItem" );
  this.$$minOccurs[ "IncidentDescription" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.IncidentDescription = new IncidentwithoutJournalUpdatesInstanceType_IncidentDescription();
  }
  this.$$childElementFunctions[ "IncidentDescription" ] = IncidentwithoutJournalUpdatesInstanceType_IncidentDescription;
  this.$$elementChildren.push( "IncidentDescription" );
  this.$$minOccurs[ "Resolution" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Resolution = new IncidentwithoutJournalUpdatesInstanceType_Resolution();
  }
  this.$$childElementFunctions[ "Resolution" ] = IncidentwithoutJournalUpdatesInstanceType_Resolution;
  this.$$elementChildren.push( "Resolution" );
  this.$$minOccurs[ "AssigneeName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.AssigneeName = new StringType();
  }
  this.$$childElementFunctions[ "AssigneeName" ] = StringType;
  this.$$elementChildren.push( "AssigneeName" );
  this.$$minOccurs[ "Contact" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Contact = new StringType();
  }
  this.$$childElementFunctions[ "Contact" ] = StringType;
  this.$$elementChildren.push( "Contact" );
  this.$$minOccurs[ "AlertStatus" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.AlertStatus = new StringType();
  }
  this.$$childElementFunctions[ "AlertStatus" ] = StringType;
  this.$$elementChildren.push( "AlertStatus" );
  this.$$minOccurs[ "ContactLastName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ContactLastName = new StringType();
  }
  this.$$childElementFunctions[ "ContactLastName" ] = StringType;
  this.$$elementChildren.push( "ContactLastName" );
  this.$$minOccurs[ "ContactFirstName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ContactFirstName = new StringType();
  }
  this.$$childElementFunctions[ "ContactFirstName" ] = StringType;
  this.$$elementChildren.push( "ContactFirstName" );
  this.$$minOccurs[ "Company" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Company = new StringType();
  }
  this.$$childElementFunctions[ "Company" ] = StringType;
  this.$$elementChildren.push( "Company" );
  this.$$minOccurs[ "BriefDescription" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.BriefDescription = new StringType();
  }
  this.$$childElementFunctions[ "BriefDescription" ] = StringType;
  this.$$elementChildren.push( "BriefDescription" );
  this.$$minOccurs[ "TicketOwner" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.TicketOwner = new StringType();
  }
  this.$$childElementFunctions[ "TicketOwner" ] = StringType;
  this.$$elementChildren.push( "TicketOwner" );
  this.$$minOccurs[ "UpdatedBy" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.UpdatedBy = new StringType();
  }
  this.$$childElementFunctions[ "UpdatedBy" ] = StringType;
  this.$$elementChildren.push( "UpdatedBy" );
  this.$$minOccurs[ "IMTicketStatus" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.IMTicketStatus = new StringType();
  }
  this.$$childElementFunctions[ "IMTicketStatus" ] = StringType;
  this.$$elementChildren.push( "IMTicketStatus" );
  this.$$minOccurs[ "Subcategory" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Subcategory = new StringType();
  }
  this.$$childElementFunctions[ "Subcategory" ] = StringType;
  this.$$elementChildren.push( "Subcategory" );
  this.$$minOccurs[ "SLAAgreementID" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.SLAAgreementID = new DecimalType();
  }
  this.$$childElementFunctions[ "SLAAgreementID" ] = DecimalType;
  this.$$elementChildren.push( "SLAAgreementID" );
  this.$$minOccurs[ "SiteCategory" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.SiteCategory = new StringType();
  }
  this.$$childElementFunctions[ "SiteCategory" ] = StringType;
  this.$$elementChildren.push( "SiteCategory" );
  this.$$minOccurs[ "ProductType" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ProductType = new StringType();
  }
  this.$$childElementFunctions[ "ProductType" ] = StringType;
  this.$$elementChildren.push( "ProductType" );
  this.$$minOccurs[ "ProblemType" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ProblemType = new StringType();
  }
  this.$$childElementFunctions[ "ProblemType" ] = StringType;
  this.$$elementChildren.push( "ProblemType" );
  this.$$minOccurs[ "ResolutionFixType" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ResolutionFixType = new StringType();
  }
  this.$$childElementFunctions[ "ResolutionFixType" ] = StringType;
  this.$$elementChildren.push( "ResolutionFixType" );
  this.$$minOccurs[ "UserPriority" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.UserPriority = new StringType();
  }
  this.$$childElementFunctions[ "UserPriority" ] = StringType;
  this.$$elementChildren.push( "UserPriority" );
  this.$$minOccurs[ "Location" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Location = new StringType();
  }
  this.$$childElementFunctions[ "Location" ] = StringType;
  this.$$elementChildren.push( "Location" );
  this.$$minOccurs[ "Solution" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Solution = new IncidentwithoutJournalUpdatesInstanceType_Solution();
  }
  this.$$childElementFunctions[ "Solution" ] = IncidentwithoutJournalUpdatesInstanceType_Solution;
  this.$$elementChildren.push( "Solution" );
  this.$$minOccurs[ "InitialImpact" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.InitialImpact = new StringType();
  }
  this.$$childElementFunctions[ "InitialImpact" ] = StringType;
  this.$$elementChildren.push( "InitialImpact" );
  this.$$minOccurs[ "folder" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.folder = new StringType();
  }
  this.$$childElementFunctions[ "folder" ] = StringType;
  this.$$elementChildren.push( "folder" );
  this.$$minOccurs[ "Service" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.Service = new StringType();
  }
  this.$$childElementFunctions[ "Service" ] = StringType;
  this.$$elementChildren.push( "Service" );
  this.$$minOccurs[ "attachments" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.attachments = new AttachmentsType();
  }
  this.$$childElementFunctions[ "attachments" ] = AttachmentsType;
  this.$$elementChildren.push( "attachments" );
}

function StringType( val ) 
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
  this.type = new String("String");
  this.$$attributes.push( "type" );
  this.mandatory = new Boolean();
  this.$$attributes.push( "mandatory" );
  this.readonly = new Boolean();
  this.$$attributes.push( "readonly" );
}

function DecimalType( val ) 
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
  this.type = new String("Decimal");
  this.$$attributes.push( "type" );
  this.mandatory = new Boolean();
  this.$$attributes.push( "mandatory" );
  this.readonly = new Boolean();
  this.$$attributes.push( "readonly" );
}

function BooleanType( val ) 
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
  this.type = new String("Boolean");
  this.$$attributes.push( "type" );
  this.mandatory = new Boolean();
  this.$$attributes.push( "mandatory" );
  this.readonly = new Boolean();
  this.$$attributes.push( "readonly" );
}

function DateTimeType( val ) 
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
  this.type = new String("DateTime");
  this.$$attributes.push( "type" );
  this.mandatory = new Boolean();
  this.$$attributes.push( "mandatory" );
  this.readonly = new Boolean();
  this.$$attributes.push( "readonly" );
}

function DateType( val ) 
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
  this.type = new String("Date");
  this.$$attributes.push( "type" );
  this.mandatory = new Boolean();
  this.$$attributes.push( "mandatory" );
  this.readonly = new Boolean();
  this.$$attributes.push( "readonly" );
}

function TimeType( val ) 
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
  this.type = new String("Time");
  this.$$attributes.push( "type" );
  this.mandatory = new Boolean();
  this.$$attributes.push( "mandatory" );
  this.readonly = new Boolean();
  this.$$attributes.push( "readonly" );
}

function DurationType( val ) 
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
  this.type = new String("Duration");
  this.$$attributes.push( "type" );
  this.mandatory = new Boolean();
  this.$$attributes.push( "mandatory" );
  this.readonly = new Boolean();
  this.$$attributes.push( "readonly" );
}

function IntType( val ) 
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
  this.type = new String("Int");
  this.$$attributes.push( "type" );
  this.mandatory = new Boolean();
  this.$$attributes.push( "mandatory" );
  this.readonly = new Boolean();
  this.$$attributes.push( "readonly" );
}

function ShortType( val ) 
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
  this.type = new String("Short");
  this.$$attributes.push( "type" );
  this.mandatory = new Boolean();
  this.$$attributes.push( "mandatory" );
  this.readonly = new Boolean();
  this.$$attributes.push( "readonly" );
}

function LongType( val ) 
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
  this.type = new String("Long");
  this.$$attributes.push( "type" );
  this.mandatory = new Boolean();
  this.$$attributes.push( "mandatory" );
  this.readonly = new Boolean();
  this.$$attributes.push( "readonly" );
}

function ByteType( val ) 
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
  this.type = new String("Byte");
  this.$$attributes.push( "type" );
  this.mandatory = new Boolean();
  this.$$attributes.push( "mandatory" );
  this.readonly = new Boolean();
  this.$$attributes.push( "readonly" );
}

function FloatType( val ) 
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
  this.type = new String("Float");
  this.$$attributes.push( "type" );
  this.mandatory = new Boolean();
  this.$$attributes.push( "mandatory" );
  this.readonly = new Boolean();
  this.$$attributes.push( "readonly" );
}

function DoubleType( val ) 
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
  this.type = new String("Double");
  this.$$attributes.push( "type" );
  this.mandatory = new Boolean();
  this.$$attributes.push( "mandatory" );
  this.readonly = new Boolean();
  this.$$attributes.push( "readonly" );
}

function Base64Type( val ) 
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
  this.type = new String("Base64");
  this.$$attributes.push( "type" );
  this.mandatory = new Boolean();
  this.$$attributes.push( "mandatory" );
  this.readonly = new Boolean();
  this.$$attributes.push( "readonly" );
}

function ArrayType( val ) 
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
  this.type = new String("Array");
  this.$$attributes.push( "type" );
}

function StructureType( val ) 
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
  this.type = new String("Structure");
  this.$$attributes.push( "type" );
}

function AttachmentType( val ) 
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
  this.contentType = new String();
  this.$$attributes.push( "contentType" );
  this.href = new String();
  this.$$attributes.push( "href" );
  this.contentId = new String();
  this.$$attributes.push( "contentId" );
  this.action = new String();
  this.$$attributes.push( "action" );
  this.name = new String();
  this.$$attributes.push( "name" );
  this.type = new String();
  this.$$attributes.push( "type" );
  this.len = new Number();
  this.$$attributes.push( "len" );
  this.charset = new String();
  this.$$attributes.push( "charset" );
  this.attachmentType = new String();
  this.$$attributes.push( "attachmentType" );
}

function AttachmentsType(  ) 
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
  this.$$name = "AttachmentsType";
  this.$$xmlNames[ "AttachmentsType" ] = "AttachmentsType";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.attachment = new Array();  // of AttachmentType
  this.attachment.$$nsPrefix = "ns0"
 // method to create a new member of the attachment array
  this.attachment.newInstance = function( bDeserializing )
  {
    var newObj = new AttachmentType(  );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.attachment_newInstance = function( bDeserializing )
  {
    var newLen = this.attachment.push( new AttachmentType(  ) );
    return this.attachment[ newLen-1 ];
  }
  this.$$elementChildren.push( "attachment" );
}

function MessageType( val ) 
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
  this.severity = new Number();
  this.$$attributes.push( "severity" );
  this.module = new String();
  this.$$attributes.push( "module" );
}

function MessagesType(  ) 
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
  this.$$name = "MessagesType";
  this.$$xmlNames[ "MessagesType" ] = "MessagesType";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.message = new Array();  // of MessageType
  this.message.$$nsPrefix = "ns0"
 // method to create a new member of the message array
  this.message.newInstance = function( bDeserializing )
  {
    var newObj = new MessageType(  );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.message_newInstance = function( bDeserializing )
  {
    var newLen = this.message.push( new MessageType(  ) );
    return this.message[ newLen-1 ];
  }
  this.$$elementChildren.push( "message" );
}

function StatusType( val ) 
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
  this.SUCCESS = new xs_string( "SUCCESS" );
  this.FAILURE = new xs_string( "FAILURE" );
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