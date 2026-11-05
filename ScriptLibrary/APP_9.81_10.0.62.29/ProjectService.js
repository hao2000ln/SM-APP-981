
function ProjectService( )
{
  this.location = new String( "http://ppmsh03.hpeswlab.net:35300/itg/ppmservices/ProjectService" );

  this.user = null;
  this.password = null;
  this.connectTimeOut = 10;
  this.sendTimeOut = 10;
  this.recvTimeOut = 10;
  this.soapEnvelope = null;
  this.soapBody = null;
  this.soapHeader = null;
  this.acceptfastinfoset = true;
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
  
       if ( soapOp.requestObj === reqName )
         return soapOp;
    }
    throw( "Can't find SOAP Operation for " + reqName );
  }

  this.setAcceptfastinfoset = function( acceptfastinfoset )
  {
    this.acceptfastinfoset = acceptfastinfoset;
  }
  
  this.getAcceptfastinfoset = function()
  {
    return this.acceptfastinfoset;
  }

  this.SOAPOperations[ "createProject" ] = new soap_Operation( "createProject", "urn:createProject", "document", "createProject", "CreateProjectResponse" );
  this.SOAPOperations[ "updateProject" ] = new soap_Operation( "updateProject", "urn:updateProject", "document", "updateProject", "UpdateProjectResponse" );
  this.SOAPOperations[ "readTasks" ] = new soap_Operation( "readTasks", "urn:readTasks", "document", "readTasks", "ReadTasksResponse" );
  this.SOAPOperations[ "getProjectDetails" ] = new soap_Operation( "getProjectDetails", "urn:GetProjectDetails", "document", "getProjectDetails", "GetProjectDetailsResponse" );
  this.SOAPOperations[ "exportWorkPlanFromProject" ] = new soap_Operation( "exportWorkPlanFromProject", "urn:exportWorkPlanFromProject", "document", "exportWorkPlanFromProject", "ExportWorkPlanFromProjectResponse" );
  this.SOAPOperations[ "updateWorkPlanStatus" ] = new soap_Operation( "updateWorkPlanStatus", "urn:updateWorkPlanStatus", "document", "updateWorkPlanStatus", "UpdateWorkPlanStatusResponse" );
  this.SOAPOperations[ "searchProjects" ] = new soap_Operation( "searchProjects", "urn:searchProjects", "document", "searchProjects", "SearchProjectsResponse" );
  this.SOAPOperations[ "createWorkPlanFromTemplate" ] = new soap_Operation( "createWorkPlanFromTemplate", "urn:createWorkPlanFromTemplate", "document", "createWorkPlanFromTemplate", "CreateWorkPlanFromTemplateResponse" );
  this.SOAPOperations[ "searchTasks" ] = new soap_Operation( "searchTasks", "urn:searchTasks", "document", "searchTasks", "SearchTasksResponse" );
  this.SOAPOperations[ "importWorkPlanTasks" ] = new soap_Operation( "importWorkPlanTasks", "urn:importWorkPlanTasks", "document", "importWorkPlanTasks", "ImportWorkPlanTasksResponse" );
  this.SOAPOperations[ "updateTaskStatus" ] = new soap_Operation( "updateTaskStatus", "urn:updateTaskStatus", "document", "UpdateTaskStatus", "UpdateTaskStatusResponse" );
  this.SOAPOperations[ "updateTaskActuals" ] = new soap_Operation( "updateTaskActuals", "urn:updateTaskActuals", "document", "updateTaskActuals", "UpdateTaskActualsResponse" );
  this.SOAPOperations[ "bulkImportProjects" ] = new soap_Operation( "bulkImportProjects", "urn:bulkImportProjects", "document", "bulkImportProjects", "BulkImportProjectsResponse" );
  this.SOAPOperations[ "createBlankWorkPlan" ] = new soap_Operation( "createBlankWorkPlan", "urn:createBlankWorkPlan", "document", "createBlankWorkPlan", "CreateBlankWorkPlanResponse" );
  this.SOAPOperations[ "executeWorkflowTransition" ] = new soap_Operation( "executeWorkflowTransition", "urn:executeWorkflowTransition", "document", "executeWorkflowTransition", "ExecuteWorkflowTransitionResponse" );
  this.SOAPOperations[ "addTasksToExistingWorkPlan" ] = new soap_Operation( "addTasksToExistingWorkPlan", "urn:addTasksToExistingWorkPlan", "document", "addTasksToExistingWorkPlan", "AddTasksToExistingWorkPlanResponse" );
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
                              this.attachments, this.acceptfastinfoset );

  if ( soapOp.responseObj == "null" )  // one-way MEP ? 
  {
    return null;
  }
 
  var resultObj = new Object();
 
  resultObj.responseObj = soapOp.responseObj;
 
  try
  {
    lib.SOAP.deserialize( "ProjectService", this.resultXML.getDocumentElement(), resultObj );
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
  this.xmlns_ns2 = new String("http://mercury.com/ppm/pm/service/1.0");
  this.$$attributes.push( "xmlns_ns2" );
  this.$$xmlNames["xmlns_ns2"] = "xmlns:ns2";
  this.$$objNames["xmlns:ns2"] = "xmlns_ns2";
  this.xmlns_ns3 = new String("http://mercury.com/ppm/pm/msg/1.0");
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
  this.xmlns_xsd = new String("http://www.w3.org/2001/XMLSchema");
  this.$$attributes.push( "xmlns_xsd" );
  this.$$xmlNames["xmlns_xsd"] = "xmlns:xsd";
  this.$$objNames["xmlns:xsd"] = "xmlns_xsd";
  this.xmlns_ns8 = new String("http://mercury.com/ppm/pm/1.0");
  this.$$attributes.push( "xmlns_ns8" );
  this.$$xmlNames["xmlns_ns8"] = "xmlns:ns8";
  this.$$objNames["xmlns:ns8"] = "xmlns_ns8";
  this.xmlns_ns9 = new String("http://mercury.com/ppm/common/1.0");
  this.$$attributes.push( "xmlns_ns9" );
  this.$$xmlNames["xmlns_ns9"] = "xmlns:ns9";
  this.$$objNames["xmlns:ns9"] = "xmlns_ns9";
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

function bulkImportProjects(  ) 
{
  this.$$nsPrefix = "ns2";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "bulkImportProjects";
  this.$$xmlNames[ "bulkImportProjects" ] = "bulkImportProjects";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns2 = new String("http://mercury.com/ppm/pm/service/1.0");
  this.$$attributes.push( "xmlns_ns2" );
  this.$$xmlNames["xmlns_ns2"] = "xmlns:ns2";
  this.$$objNames["xmlns:ns2"] = "xmlns_ns2";
  this.projects = new Array();  // of projectType
  this.projects.$$nsPrefix = "ns2"
 // method to create a new member of the projects array
  this.projects.newInstance = function( bDeserializing )
  {
    var newObj = new projectType( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.projects_newInstance = function( bDeserializing )
  {
    var newLen = this.projects.push( new projectType( bDeserializing ) );
    return this.projects[ newLen-1 ];
  }
  this.$$elementChildren.push( "projects" );
}

function BulkImportProjectsResponse(  ) 
{
  this.$$nsPrefix = "ns2";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "BulkImportProjectsResponse";
  this.$$xmlNames[ "BulkImportProjectsResponse" ] = "BulkImportProjectsResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$xmlNames["_return"] = "return";
  this.$$objNames["return"] = "_return";
  this._return = new Array();  // of createProjectResultType
  this._return.$$nsPrefix = "ns2"
 // method to create a new member of the _return array
  this._return.newInstance = function( bDeserializing )
  {
    var newObj = new createProjectResultType( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this._return_newInstance = function( bDeserializing )
  {
    var newLen = this._return.push( new createProjectResultType( bDeserializing ) );
    return this._return[ newLen-1 ];
  }
  this.$$elementChildren.push( "_return" );
}

function createProject(  ) 
{
  this.$$nsPrefix = "ns2";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "createProject";
  this.$$xmlNames[ "createProject" ] = "createProject";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns2 = new String("http://mercury.com/ppm/pm/service/1.0");
  this.$$attributes.push( "xmlns_ns2" );
  this.$$xmlNames["xmlns_ns2"] = "xmlns:ns2";
  this.$$objNames["xmlns:ns2"] = "xmlns_ns2";
  if ( this.$$deserializing == undefined )
  {
  this.projectBean = new projectType();
  }
  this.$$childElementFunctions[ "projectBean" ] = projectType;
  this.$$elementChildren.push( "projectBean" );
}

function CreateProjectResponse(  ) 
{
  this.$$nsPrefix = "ns2";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "CreateProjectResponse";
  this.$$xmlNames[ "CreateProjectResponse" ] = "CreateProjectResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$xmlNames["_return"] = "return";
  this.$$objNames["return"] = "_return";
  if ( this.$$deserializing == undefined )
  {
  this._return = new createProjectResultType();
  }
  this.$$childElementFunctions[ "_return" ] = createProjectResultType;
  this.$$elementChildren.push( "_return" );
}

function getProjectDetails(  ) 
{
  this.$$nsPrefix = "ns2";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "getProjectDetails";
  this.$$xmlNames[ "getProjectDetails" ] = "getProjectDetails";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns2 = new String("http://mercury.com/ppm/pm/service/1.0");
  this.$$attributes.push( "xmlns_ns2" );
  this.$$xmlNames["xmlns_ns2"] = "xmlns:ns2";
  this.$$objNames["xmlns:ns2"] = "xmlns_ns2";
  if ( this.$$deserializing == undefined )
  {
  this.projectInput = new projectInputType();
  }
  this.$$childElementFunctions[ "projectInput" ] = projectInputType;
  this.$$elementChildren.push( "projectInput" );
}

function GetProjectDetailsResponse(  ) 
{
  this.$$nsPrefix = "ns2";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "GetProjectDetailsResponse";
  this.$$xmlNames[ "GetProjectDetailsResponse" ] = "GetProjectDetailsResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$xmlNames["_return"] = "return";
  this.$$objNames["return"] = "_return";
  if ( this.$$deserializing == undefined )
  {
  this._return = new projectType();
  }
  this.$$childElementFunctions[ "_return" ] = projectType;
  this.$$elementChildren.push( "_return" );
}

function updateProject(  ) 
{
  this.$$nsPrefix = "ns2";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "updateProject";
  this.$$xmlNames[ "updateProject" ] = "updateProject";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns2 = new String("http://mercury.com/ppm/pm/service/1.0");
  this.$$attributes.push( "xmlns_ns2" );
  this.$$xmlNames["xmlns_ns2"] = "xmlns:ns2";
  this.$$objNames["xmlns:ns2"] = "xmlns_ns2";
  if ( this.$$deserializing == undefined )
  {
  this.projectInput = new projectInputType();
  }
  this.$$childElementFunctions[ "projectInput" ] = projectInputType;
  this.$$elementChildren.push( "projectInput" );
  if ( this.$$deserializing == undefined )
  {
  this.projectBean = new projectType();
  }
  this.$$childElementFunctions[ "projectBean" ] = projectType;
  this.$$elementChildren.push( "projectBean" );
}

function UpdateProjectResponse(  ) 
{
  this.$$nsPrefix = "ns2";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "UpdateProjectResponse";
  this.$$xmlNames[ "UpdateProjectResponse" ] = "UpdateProjectResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
}

function searchProjects(  ) 
{
  this.$$nsPrefix = "ns2";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "searchProjects";
  this.$$xmlNames[ "searchProjects" ] = "searchProjects";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns2 = new String("http://mercury.com/ppm/pm/service/1.0");
  this.$$attributes.push( "xmlns_ns2" );
  this.$$xmlNames["xmlns_ns2"] = "xmlns:ns2";
  this.$$objNames["xmlns:ns2"] = "xmlns_ns2";
  if ( this.$$deserializing == undefined )
  {
  this.searchPreferences = new searchProjectPreferenceType();
  }
  this.$$childElementFunctions[ "searchPreferences" ] = searchProjectPreferenceType;
  this.$$elementChildren.push( "searchPreferences" );
}

function SearchProjectsResponse(  ) 
{
  this.$$nsPrefix = "ns2";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "SearchProjectsResponse";
  this.$$xmlNames[ "SearchProjectsResponse" ] = "SearchProjectsResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.projectIds = new Array();  // of xs_long
  this.projectIds.$$nsPrefix = "ns2"
 // method to create a new member of the projectIds array
  this.projectIds.newInstance = function( bDeserializing )
  {
    var newObj = new xs_long(  );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.projectIds_newInstance = function( bDeserializing )
  {
    var newLen = this.projectIds.push( new xs_long(  ) );
    return this.projectIds[ newLen-1 ];
  }
  this.$$elementChildren.push( "projectIds" );
}

function xs_long( val ) 
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
  this.xsi_type = new String("xsd:long");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function executeWorkflowTransition(  ) 
{
  this.$$nsPrefix = "ns2";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "executeWorkflowTransition";
  this.$$xmlNames[ "executeWorkflowTransition" ] = "executeWorkflowTransition";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns2 = new String("http://mercury.com/ppm/pm/service/1.0");
  this.$$attributes.push( "xmlns_ns2" );
  this.$$xmlNames["xmlns_ns2"] = "xmlns:ns2";
  this.$$objNames["xmlns:ns2"] = "xmlns_ns2";
  if ( this.$$deserializing == undefined )
  {
  this.projectInput = new projectInputType();
  }
  this.$$childElementFunctions[ "projectInput" ] = projectInputType;
  this.$$elementChildren.push( "projectInput" );
  if ( this.$$deserializing == undefined )
  {
  this.transition = new xs_string();
  }
  this.$$childElementFunctions[ "transition" ] = xs_string;
  this.$$elementChildren.push( "transition" );
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

function ExecuteWorkflowTransitionResponse(  ) 
{
  this.$$nsPrefix = "ns2";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "ExecuteWorkflowTransitionResponse";
  this.$$xmlNames[ "ExecuteWorkflowTransitionResponse" ] = "ExecuteWorkflowTransitionResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
}

function createBlankWorkPlan(  ) 
{
  this.$$nsPrefix = "ns2";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "createBlankWorkPlan";
  this.$$xmlNames[ "createBlankWorkPlan" ] = "createBlankWorkPlan";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns2 = new String("http://mercury.com/ppm/pm/service/1.0");
  this.$$attributes.push( "xmlns_ns2" );
  this.$$xmlNames["xmlns_ns2"] = "xmlns:ns2";
  this.$$objNames["xmlns:ns2"] = "xmlns_ns2";
  if ( this.$$deserializing == undefined )
  {
  this.projectInput = new workPlanInputType();
  }
  this.$$childElementFunctions[ "projectInput" ] = workPlanInputType;
  this.$$elementChildren.push( "projectInput" );
}

function CreateBlankWorkPlanResponse(  ) 
{
  this.$$nsPrefix = "ns2";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "CreateBlankWorkPlanResponse";
  this.$$xmlNames[ "CreateBlankWorkPlanResponse" ] = "CreateBlankWorkPlanResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
}

function createWorkPlanFromTemplate(  ) 
{
  this.$$nsPrefix = "ns2";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "createWorkPlanFromTemplate";
  this.$$xmlNames[ "createWorkPlanFromTemplate" ] = "createWorkPlanFromTemplate";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns2 = new String("http://mercury.com/ppm/pm/service/1.0");
  this.$$attributes.push( "xmlns_ns2" );
  this.$$xmlNames["xmlns_ns2"] = "xmlns:ns2";
  this.$$objNames["xmlns:ns2"] = "xmlns_ns2";
  if ( this.$$deserializing == undefined )
  {
  this.projectInput = new workPlanInputType();
  }
  this.$$childElementFunctions[ "projectInput" ] = workPlanInputType;
  this.$$elementChildren.push( "projectInput" );
  if ( this.$$deserializing == undefined )
  {
  this.templateName = new xs_string();
  }
  this.$$childElementFunctions[ "templateName" ] = xs_string;
  this.$$elementChildren.push( "templateName" );
}

function CreateWorkPlanFromTemplateResponse(  ) 
{
  this.$$nsPrefix = "ns2";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "CreateWorkPlanFromTemplateResponse";
  this.$$xmlNames[ "CreateWorkPlanFromTemplateResponse" ] = "CreateWorkPlanFromTemplateResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
}

function addTasksToExistingWorkPlan(  ) 
{
  this.$$nsPrefix = "ns2";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "addTasksToExistingWorkPlan";
  this.$$xmlNames[ "addTasksToExistingWorkPlan" ] = "addTasksToExistingWorkPlan";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns2 = new String("http://mercury.com/ppm/pm/service/1.0");
  this.$$attributes.push( "xmlns_ns2" );
  this.$$xmlNames["xmlns_ns2"] = "xmlns:ns2";
  this.$$objNames["xmlns:ns2"] = "xmlns_ns2";
  if ( this.$$deserializing == undefined )
  {
  this.workPlanInput = new workPlanInputType();
  }
  this.$$childElementFunctions[ "workPlanInput" ] = workPlanInputType;
  this.$$elementChildren.push( "workPlanInput" );
  this.tasks = new Array();  // of taskType
  this.tasks.$$nsPrefix = "ns2"
 // method to create a new member of the tasks array
  this.tasks.newInstance = function( bDeserializing )
  {
    var newObj = new taskType( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.tasks_newInstance = function( bDeserializing )
  {
    var newLen = this.tasks.push( new taskType( bDeserializing ) );
    return this.tasks[ newLen-1 ];
  }
  this.$$elementChildren.push( "tasks" );
  if ( this.$$deserializing == undefined )
  {
  this.anchors = new taskAnchors();
  }
  this.$$childElementFunctions[ "anchors" ] = taskAnchors;
  this.$$elementChildren.push( "anchors" );
}

function AddTasksToExistingWorkPlanResponse(  ) 
{
  this.$$nsPrefix = "ns2";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "AddTasksToExistingWorkPlanResponse";
  this.$$xmlNames[ "AddTasksToExistingWorkPlanResponse" ] = "AddTasksToExistingWorkPlanResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$xmlNames["_return"] = "return";
  this.$$objNames["return"] = "_return";
  this._return = new Array();  // of addTaskResultType
  this._return.$$nsPrefix = "ns2"
 // method to create a new member of the _return array
  this._return.newInstance = function( bDeserializing )
  {
    var newObj = new addTaskResultType( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this._return_newInstance = function( bDeserializing )
  {
    var newLen = this._return.push( new addTaskResultType( bDeserializing ) );
    return this._return[ newLen-1 ];
  }
  this.$$elementChildren.push( "_return" );
}

function importWorkPlanTasks(  ) 
{
  this.$$nsPrefix = "ns2";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "importWorkPlanTasks";
  this.$$xmlNames[ "importWorkPlanTasks" ] = "importWorkPlanTasks";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns2 = new String("http://mercury.com/ppm/pm/service/1.0");
  this.$$attributes.push( "xmlns_ns2" );
  this.$$xmlNames["xmlns_ns2"] = "xmlns:ns2";
  this.$$objNames["xmlns:ns2"] = "xmlns_ns2";
  if ( this.$$deserializing == undefined )
  {
  this.workPlanInput = new workPlanInputType();
  }
  this.$$childElementFunctions[ "workPlanInput" ] = workPlanInputType;
  this.$$elementChildren.push( "workPlanInput" );
  this.tasks = new Array();  // of taskType
  this.tasks.$$nsPrefix = "ns2"
 // method to create a new member of the tasks array
  this.tasks.newInstance = function( bDeserializing )
  {
    var newObj = new taskType( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.tasks_newInstance = function( bDeserializing )
  {
    var newLen = this.tasks.push( new taskType( bDeserializing ) );
    return this.tasks[ newLen-1 ];
  }
  this.$$elementChildren.push( "tasks" );
}

function ImportWorkPlanTasksResponse(  ) 
{
  this.$$nsPrefix = "ns2";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "ImportWorkPlanTasksResponse";
  this.$$xmlNames[ "ImportWorkPlanTasksResponse" ] = "ImportWorkPlanTasksResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$xmlNames["_return"] = "return";
  this.$$objNames["return"] = "_return";
  this._return = new Array();  // of addTaskResultType
  this._return.$$nsPrefix = "ns2"
 // method to create a new member of the _return array
  this._return.newInstance = function( bDeserializing )
  {
    var newObj = new addTaskResultType( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this._return_newInstance = function( bDeserializing )
  {
    var newLen = this._return.push( new addTaskResultType( bDeserializing ) );
    return this._return[ newLen-1 ];
  }
  this.$$elementChildren.push( "_return" );
}

function searchTasks(  ) 
{
  this.$$nsPrefix = "ns2";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "searchTasks";
  this.$$xmlNames[ "searchTasks" ] = "searchTasks";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns2 = new String("http://mercury.com/ppm/pm/service/1.0");
  this.$$attributes.push( "xmlns_ns2" );
  this.$$xmlNames["xmlns_ns2"] = "xmlns:ns2";
  this.$$objNames["xmlns:ns2"] = "xmlns_ns2";
  if ( this.$$deserializing == undefined )
  {
  this.searchPreferences = new searchTaskPreferenceType();
  }
  this.$$childElementFunctions[ "searchPreferences" ] = searchTaskPreferenceType;
  this.$$elementChildren.push( "searchPreferences" );
}

function SearchTasksResponse(  ) 
{
  this.$$nsPrefix = "ns2";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "SearchTasksResponse";
  this.$$xmlNames[ "SearchTasksResponse" ] = "SearchTasksResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.taskId = new Array();  // of xs_long
  this.taskId.$$nsPrefix = "ns2"
 // method to create a new member of the taskId array
  this.taskId.newInstance = function( bDeserializing )
  {
    var newObj = new xs_long(  );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.taskId_newInstance = function( bDeserializing )
  {
    var newLen = this.taskId.push( new xs_long(  ) );
    return this.taskId[ newLen-1 ];
  }
  this.$$elementChildren.push( "taskId" );
}

function exportWorkPlanFromProject(  ) 
{
  this.$$nsPrefix = "ns2";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "exportWorkPlanFromProject";
  this.$$xmlNames[ "exportWorkPlanFromProject" ] = "exportWorkPlanFromProject";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns2 = new String("http://mercury.com/ppm/pm/service/1.0");
  this.$$attributes.push( "xmlns_ns2" );
  this.$$xmlNames["xmlns_ns2"] = "xmlns:ns2";
  this.$$objNames["xmlns:ns2"] = "xmlns_ns2";
  if ( this.$$deserializing == undefined )
  {
  this.workPlanInput = new workPlanInputType();
  }
  this.$$childElementFunctions[ "workPlanInput" ] = workPlanInputType;
  this.$$elementChildren.push( "workPlanInput" );
}

function ExportWorkPlanFromProjectResponse(  ) 
{
  this.$$nsPrefix = "ns2";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "ExportWorkPlanFromProjectResponse";
  this.$$xmlNames[ "ExportWorkPlanFromProjectResponse" ] = "ExportWorkPlanFromProjectResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$xmlNames["_return"] = "return";
  this.$$objNames["return"] = "_return";
  this._return = new Array();  // of taskType
  this._return.$$nsPrefix = "ns2"
 // method to create a new member of the _return array
  this._return.newInstance = function( bDeserializing )
  {
    var newObj = new taskType( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this._return_newInstance = function( bDeserializing )
  {
    var newLen = this._return.push( new taskType( bDeserializing ) );
    return this._return[ newLen-1 ];
  }
  this.$$elementChildren.push( "_return" );
}

function readTasks(  ) 
{
  this.$$nsPrefix = "ns2";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "readTasks";
  this.$$xmlNames[ "readTasks" ] = "readTasks";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns2 = new String("http://mercury.com/ppm/pm/service/1.0");
  this.$$attributes.push( "xmlns_ns2" );
  this.$$xmlNames["xmlns_ns2"] = "xmlns:ns2";
  this.$$objNames["xmlns:ns2"] = "xmlns_ns2";
  this.taskId = new Array();  // of xs_long
  this.taskId.$$nsPrefix = "ns2"
 // method to create a new member of the taskId array
  this.taskId.newInstance = function( bDeserializing )
  {
    var newObj = new xs_long(  );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.taskId_newInstance = function( bDeserializing )
  {
    var newLen = this.taskId.push( new xs_long(  ) );
    return this.taskId[ newLen-1 ];
  }
  this.$$elementChildren.push( "taskId" );
}

function ReadTasksResponse(  ) 
{
  this.$$nsPrefix = "ns2";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "ReadTasksResponse";
  this.$$xmlNames[ "ReadTasksResponse" ] = "ReadTasksResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$xmlNames["_return"] = "return";
  this.$$objNames["return"] = "_return";
  this._return = new Array();  // of taskType
  this._return.$$nsPrefix = "ns2"
 // method to create a new member of the _return array
  this._return.newInstance = function( bDeserializing )
  {
    var newObj = new taskType( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this._return_newInstance = function( bDeserializing )
  {
    var newLen = this._return.push( new taskType( bDeserializing ) );
    return this._return[ newLen-1 ];
  }
  this.$$elementChildren.push( "_return" );
}

function updateTaskActuals(  ) 
{
  this.$$nsPrefix = "ns2";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "updateTaskActuals";
  this.$$xmlNames[ "updateTaskActuals" ] = "updateTaskActuals";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns2 = new String("http://mercury.com/ppm/pm/service/1.0");
  this.$$attributes.push( "xmlns_ns2" );
  this.$$xmlNames["xmlns_ns2"] = "xmlns:ns2";
  this.$$objNames["xmlns:ns2"] = "xmlns_ns2";
  this.assignments = new Array();  // of assignmentType
  this.assignments.$$nsPrefix = "ns2"
 // method to create a new member of the assignments array
  this.assignments.newInstance = function( bDeserializing )
  {
    var newObj = new assignmentType( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.assignments_newInstance = function( bDeserializing )
  {
    var newLen = this.assignments.push( new assignmentType( bDeserializing ) );
    return this.assignments[ newLen-1 ];
  }
  this.$$elementChildren.push( "assignments" );
}

function UpdateTaskActualsResponse(  ) 
{
  this.$$nsPrefix = "ns2";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "UpdateTaskActualsResponse";
  this.$$xmlNames[ "UpdateTaskActualsResponse" ] = "UpdateTaskActualsResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
}

function updateWorkPlanStatus(  ) 
{
  this.$$nsPrefix = "ns2";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "updateWorkPlanStatus";
  this.$$xmlNames[ "updateWorkPlanStatus" ] = "updateWorkPlanStatus";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns2 = new String("http://mercury.com/ppm/pm/service/1.0");
  this.$$attributes.push( "xmlns_ns2" );
  this.$$xmlNames["xmlns_ns2"] = "xmlns:ns2";
  this.$$objNames["xmlns:ns2"] = "xmlns_ns2";
  if ( this.$$deserializing == undefined )
  {
  this.workPlanInput = new workPlanInputType();
  }
  this.$$childElementFunctions[ "workPlanInput" ] = workPlanInputType;
  this.$$elementChildren.push( "workPlanInput" );
  if ( this.$$deserializing == undefined )
  {
  this.newStatus = new xs_string();
  }
  this.$$childElementFunctions[ "newStatus" ] = xs_string;
  this.$$elementChildren.push( "newStatus" );
}

function UpdateWorkPlanStatusResponse(  ) 
{
  this.$$nsPrefix = "ns2";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "UpdateWorkPlanStatusResponse";
  this.$$xmlNames[ "UpdateWorkPlanStatusResponse" ] = "UpdateWorkPlanStatusResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
}

function UpdateTaskStatus(  ) 
{
  this.$$nsPrefix = "ns2";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "UpdateTaskStatus";
  this.$$xmlNames[ "UpdateTaskStatus" ] = "UpdateTaskStatus";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns2 = new String("http://mercury.com/ppm/pm/service/1.0");
  this.$$attributes.push( "xmlns_ns2" );
  this.$$xmlNames["xmlns_ns2"] = "xmlns:ns2";
  this.$$objNames["xmlns:ns2"] = "xmlns_ns2";
  if ( this.$$deserializing == undefined )
  {
  this.taskId = new xs_long();
  }
  this.$$childElementFunctions[ "taskId" ] = xs_long;
  this.$$elementChildren.push( "taskId" );
  if ( this.$$deserializing == undefined )
  {
  this.newStatus = new taskStatusType();
  }
  this.$$childElementFunctions[ "newStatus" ] = taskStatusType;
  this.$$elementChildren.push( "newStatus" );
  if ( this.$$deserializing == undefined )
  {
  this.ignoreSummaryTask = new xs_boolean();
  }
  this.$$childElementFunctions[ "ignoreSummaryTask" ] = xs_boolean;
  this.$$elementChildren.push( "ignoreSummaryTask" );
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
  this.xsi_type = new String("xsd:boolean");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function UpdateTaskStatusResponse(  ) 
{
  this.$$nsPrefix = "ns2";
  this.$$elementFormDefault = "qualified";
  this.$$attributes = new Array();
  this.$$xmlNames = new Array();
  this.$$objNames = new Array();
  this.$$minOccurs = new Array();
  this.$$refs = new Array();
  this.getName = getName;
  this.getXmlName = getXmlName;
  this.setContent = setContent;
  this.addContent = addContent;
  this.getContent = getContent;
  this.isFault = isFault;
  this.$$elementChildren = new Array();
  this.$$name = "UpdateTaskStatusResponse";
  this.$$xmlNames[ "UpdateTaskStatusResponse" ] = "UpdateTaskStatusResponse";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
}

function projectType(  ) 
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
  this.$$name = "projectType";
  this.$$xmlNames[ "projectType" ] = "projectType";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "projectName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.projectName = new xs_string();
  }
  this.$$childElementFunctions[ "projectName" ] = xs_string;
  this.$$elementChildren.push( "projectName" );
  this.$$minOccurs[ "projectTypeName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.projectTypeName = new xs_string();
  }
  this.$$childElementFunctions[ "projectTypeName" ] = xs_string;
  this.$$elementChildren.push( "projectTypeName" );
  this.$$minOccurs[ "projectTypeId" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.projectTypeId = new xs_long();
  }
  this.$$childElementFunctions[ "projectTypeId" ] = xs_long;
  this.$$elementChildren.push( "projectTypeId" );
  this.projectManagerUserName = new Array();  // of xs_string
  this.projectManagerUserName.$$nsPrefix = "ns8"
 // method to create a new member of the projectManagerUserName array
  this.projectManagerUserName.newInstance = function( bDeserializing )
  {
    var newObj = new xs_string(  );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.projectManagerUserName_newInstance = function( bDeserializing )
  {
    var newLen = this.projectManagerUserName.push( new xs_string(  ) );
    return this.projectManagerUserName[ newLen-1 ];
  }
  this.$$elementChildren.push( "projectManagerUserName" );
  this.$$minOccurs[ "plannedStartPeriodFullName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.plannedStartPeriodFullName = new xs_string();
  }
  this.$$childElementFunctions[ "plannedStartPeriodFullName" ] = xs_string;
  this.$$elementChildren.push( "plannedStartPeriodFullName" );
  this.$$minOccurs[ "plannedFinishPeriodFullName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.plannedFinishPeriodFullName = new xs_string();
  }
  this.$$childElementFunctions[ "plannedFinishPeriodFullName" ] = xs_string;
  this.$$elementChildren.push( "plannedFinishPeriodFullName" );
  this.$$minOccurs[ "regionName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.regionName = new xs_string();
  }
  this.$$childElementFunctions[ "regionName" ] = xs_string;
  this.$$elementChildren.push( "regionName" );
  this.$$minOccurs[ "staffingProfileName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.staffingProfileName = new xs_string();
  }
  this.$$childElementFunctions[ "staffingProfileName" ] = xs_string;
  this.$$elementChildren.push( "staffingProfileName" );
  this.simpleFields = new Array();  // of simpleFields
  this.simpleFields.$$nsPrefix = "ns8"
 // method to create a new member of the simpleFields array
  this.simpleFields.newInstance = function( bDeserializing )
  {
    var newObj = new simpleFields( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.simpleFields_newInstance = function( bDeserializing )
  {
    var newLen = this.simpleFields.push( new simpleFields( bDeserializing ) );
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
  this.pmReferences = new Array();  // of pmReference
  this.pmReferences.$$nsPrefix = "ns8"
 // method to create a new member of the pmReferences array
  this.pmReferences.newInstance = function( bDeserializing )
  {
    var newObj = new pmReference( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.pmReferences_newInstance = function( bDeserializing )
  {
    var newLen = this.pmReferences.push( new pmReference( bDeserializing ) );
    return this.pmReferences[ newLen-1 ];
  }
  this.$$elementChildren.push( "pmReferences" );
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
  this.fieldChangeNotes = new Array();  // of fieldChangeNote
  this.fieldChangeNotes.$$nsPrefix = "ns8"
 // method to create a new member of the fieldChangeNotes array
  this.fieldChangeNotes.newInstance = function( bDeserializing )
  {
    var newObj = new fieldChangeNote( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.fieldChangeNotes_newInstance = function( bDeserializing )
  {
    var newLen = this.fieldChangeNotes.push( new fieldChangeNote( bDeserializing ) );
    return this.fieldChangeNotes[ newLen-1 ];
  }
  this.$$elementChildren.push( "fieldChangeNotes" );
  this.associatedProgram = new Array();  // of xs_long
  this.associatedProgram.$$nsPrefix = "ns8"
 // method to create a new member of the associatedProgram array
  this.associatedProgram.newInstance = function( bDeserializing )
  {
    var newObj = new xs_long(  );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.associatedProgram_newInstance = function( bDeserializing )
  {
    var newLen = this.associatedProgram.push( new xs_long(  ) );
    return this.associatedProgram[ newLen-1 ];
  }
  this.$$elementChildren.push( "associatedProgram" );
}

function createProjectResultType(  ) 
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
  this.$$name = "createProjectResultType";
  this.$$xmlNames[ "createProjectResultType" ] = "createProjectResultType";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "projectName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.projectName = new xs_string();
  }
  this.$$childElementFunctions[ "projectName" ] = xs_string;
  this.$$elementChildren.push( "projectName" );
  if ( this.$$deserializing == undefined )
  {
  this.projectId = new xs_long();
  }
  this.$$childElementFunctions[ "projectId" ] = xs_long;
  this.$$elementChildren.push( "projectId" );
  if ( this.$$deserializing == undefined )
  {
  this.requestId = new xs_integer();
  }
  this.$$childElementFunctions[ "requestId" ] = xs_integer;
  this.$$elementChildren.push( "requestId" );
}

function xs_integer( val ) 
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
  this.xsi_type = new String("xsd:integer");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function projectInputType(  ) 
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
  this.$$name = "projectInputType";
  this.$$xmlNames[ "projectInputType" ] = "projectInputType";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "projectName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.projectName = new xs_string();
  }
  this.$$childElementFunctions[ "projectName" ] = xs_string;
  this.$$elementChildren.push( "projectName" );
  this.$$minOccurs[ "projectId" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.projectId = new xs_long();
  }
  this.$$childElementFunctions[ "projectId" ] = xs_long;
  this.$$elementChildren.push( "projectId" );
  this.$$minOccurs[ "requestId" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.requestId = new xs_integer();
  }
  this.$$childElementFunctions[ "requestId" ] = xs_integer;
  this.$$elementChildren.push( "requestId" );
}

function workPlanInputType(  ) 
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
  this.$$name = "workPlanInputType";
  this.$$xmlNames[ "workPlanInputType" ] = "workPlanInputType";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.projectName = new xs_string();
  }
  this.$$childElementFunctions[ "projectName" ] = xs_string;
  this.$$elementChildren.push( "projectName" );
  if ( this.$$deserializing == undefined )
  {
  this.projectId = new xs_long();
  }
  this.$$childElementFunctions[ "projectId" ] = xs_long;
  this.$$elementChildren.push( "projectId" );
}

function taskAnchors(  ) 
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
  this.$$name = "taskAnchors";
  this.$$xmlNames[ "taskAnchors" ] = "taskAnchors";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.topAnchor = new anchorType();
  }
  this.$$childElementFunctions[ "topAnchor" ] = anchorType;
  this.$$elementChildren.push( "topAnchor" );
  this.$$minOccurs[ "bottomAnchor" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.bottomAnchor = new anchorType();
  }
  this.$$childElementFunctions[ "bottomAnchor" ] = anchorType;
  this.$$elementChildren.push( "bottomAnchor" );
}

function addTaskResultType(  ) 
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
  this.$$name = "addTaskResultType";
  this.$$xmlNames[ "addTaskResultType" ] = "addTaskResultType";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.taskSequenceNumber = new xs_long();
  }
  this.$$childElementFunctions[ "taskSequenceNumber" ] = xs_long;
  this.$$elementChildren.push( "taskSequenceNumber" );
  if ( this.$$deserializing == undefined )
  {
  this.taskId = new xs_long();
  }
  this.$$childElementFunctions[ "taskId" ] = xs_long;
  this.$$elementChildren.push( "taskId" );
}

function searchProjectPreferenceType(  ) 
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
  this.$$name = "searchProjectPreferenceType";
  this.$$xmlNames[ "searchProjectPreferenceType" ] = "searchProjectPreferenceType";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.startSearchPosition = new searchProjectPreferenceType_startSearchPosition();
  }
  this.$$childElementFunctions[ "startSearchPosition" ] = searchProjectPreferenceType_startSearchPosition;
  this.$$elementChildren.push( "startSearchPosition" );
  if ( this.$$deserializing == undefined )
  {
  this.maximumProjectsToShow = new searchProjectPreferenceType_maximumProjectsToShow();
  }
  this.$$childElementFunctions[ "maximumProjectsToShow" ] = searchProjectPreferenceType_maximumProjectsToShow;
  this.$$elementChildren.push( "maximumProjectsToShow" );
  this.$$minOccurs[ "projectNameContains" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.projectNameContains = new xs_string();
  }
  this.$$childElementFunctions[ "projectNameContains" ] = xs_string;
  this.$$elementChildren.push( "projectNameContains" );
  this.projectTypeNames = new Array();  // of xs_string
  this.projectTypeNames.$$nsPrefix = "ns8"
 // method to create a new member of the projectTypeNames array
  this.projectTypeNames.newInstance = function( bDeserializing )
  {
    var newObj = new xs_string(  );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.projectTypeNames_newInstance = function( bDeserializing )
  {
    var newLen = this.projectTypeNames.push( new xs_string(  ) );
    return this.projectTypeNames[ newLen-1 ];
  }
  this.$$elementChildren.push( "projectTypeNames" );
  this.projectRegionNames = new Array();  // of xs_string
  this.projectRegionNames.$$nsPrefix = "ns8"
 // method to create a new member of the projectRegionNames array
  this.projectRegionNames.newInstance = function( bDeserializing )
  {
    var newObj = new xs_string(  );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.projectRegionNames_newInstance = function( bDeserializing )
  {
    var newLen = this.projectRegionNames.push( new xs_string(  ) );
    return this.projectRegionNames[ newLen-1 ];
  }
  this.$$elementChildren.push( "projectRegionNames" );
  this.associatedProgramNames = new Array();  // of xs_string
  this.associatedProgramNames.$$nsPrefix = "ns8"
 // method to create a new member of the associatedProgramNames array
  this.associatedProgramNames.newInstance = function( bDeserializing )
  {
    var newObj = new xs_string(  );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.associatedProgramNames_newInstance = function( bDeserializing )
  {
    var newLen = this.associatedProgramNames.push( new xs_string(  ) );
    return this.associatedProgramNames[ newLen-1 ];
  }
  this.$$elementChildren.push( "associatedProgramNames" );
  this.projectHealth = new Array();  // of searchProjectPreferenceType_projectHealth
  this.projectHealth.$$nsPrefix = "ns8"
 // method to create a new member of the projectHealth array
  this.projectHealth.newInstance = function( bDeserializing )
  {
    var newObj = new searchProjectPreferenceType_projectHealth(  );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.projectHealth_newInstance = function( bDeserializing )
  {
    var newLen = this.projectHealth.push( new searchProjectPreferenceType_projectHealth(  ) );
    return this.projectHealth[ newLen-1 ];
  }
  this.$$elementChildren.push( "projectHealth" );
  this.projectManagerUserNames = new Array();  // of xs_string
  this.projectManagerUserNames.$$nsPrefix = "ns8"
 // method to create a new member of the projectManagerUserNames array
  this.projectManagerUserNames.newInstance = function( bDeserializing )
  {
    var newObj = new xs_string(  );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.projectManagerUserNames_newInstance = function( bDeserializing )
  {
    var newLen = this.projectManagerUserNames.push( new xs_string(  ) );
    return this.projectManagerUserNames[ newLen-1 ];
  }
  this.$$elementChildren.push( "projectManagerUserNames" );
  this.$$minOccurs[ "isIncludeFinishProject" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.isIncludeFinishProject = new xs_boolean();
  }
  this.$$childElementFunctions[ "isIncludeFinishProject" ] = xs_boolean;
  this.$$elementChildren.push( "isIncludeFinishProject" );
  this.$$minOccurs[ "plannedStartFrom" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.plannedStartFrom = new xs_dateTime();
  }
  this.$$childElementFunctions[ "plannedStartFrom" ] = xs_dateTime;
  this.$$elementChildren.push( "plannedStartFrom" );
  this.$$minOccurs[ "plannedStartTo" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.plannedStartTo = new xs_dateTime();
  }
  this.$$childElementFunctions[ "plannedStartTo" ] = xs_dateTime;
  this.$$elementChildren.push( "plannedStartTo" );
  this.$$minOccurs[ "plannedFinishFrom" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.plannedFinishFrom = new xs_dateTime();
  }
  this.$$childElementFunctions[ "plannedFinishFrom" ] = xs_dateTime;
  this.$$elementChildren.push( "plannedFinishFrom" );
  this.$$minOccurs[ "plannedFinishTo" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.plannedFinishTo = new xs_dateTime();
  }
  this.$$childElementFunctions[ "plannedFinishTo" ] = xs_dateTime;
  this.$$elementChildren.push( "plannedFinishTo" );
}

function searchProjectPreferenceType_startSearchPosition( val ) 
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
}

function searchProjectPreferenceType_maximumProjectsToShow( val ) 
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
}

function searchProjectPreferenceType_projectHealth( val ) 
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
  this.RED = new xs_string( "RED" );
  this.YELLOW = new xs_string( "YELLOW" );
  this.GREEN = new xs_string( "GREEN" );
  this.NONE = new xs_string( "NONE" );
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
  this.xsi_type = new String("xsd:dateTime");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function searchTaskPreferenceType(  ) 
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
  this.$$name = "searchTaskPreferenceType";
  this.$$xmlNames[ "searchTaskPreferenceType" ] = "searchTaskPreferenceType";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.startSearchPosition = new searchTaskPreferenceType_startSearchPosition();
  }
  this.$$childElementFunctions[ "startSearchPosition" ] = searchTaskPreferenceType_startSearchPosition;
  this.$$elementChildren.push( "startSearchPosition" );
  if ( this.$$deserializing == undefined )
  {
  this.maximumTasksToShow = new searchTaskPreferenceType_maximumTasksToShow();
  }
  this.$$childElementFunctions[ "maximumTasksToShow" ] = searchTaskPreferenceType_maximumTasksToShow;
  this.$$elementChildren.push( "maximumTasksToShow" );
  this.$$minOccurs[ "taskNamePrefix" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.taskNamePrefix = new xs_string();
  }
  this.$$childElementFunctions[ "taskNamePrefix" ] = xs_string;
  this.$$elementChildren.push( "taskNamePrefix" );
  this.projectNames = new Array();  // of xs_string
  this.projectNames.$$nsPrefix = "ns8"
 // method to create a new member of the projectNames array
  this.projectNames.newInstance = function( bDeserializing )
  {
    var newObj = new xs_string(  );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.projectNames_newInstance = function( bDeserializing )
  {
    var newLen = this.projectNames.push( new xs_string(  ) );
    return this.projectNames[ newLen-1 ];
  }
  this.$$elementChildren.push( "projectNames" );
  this.resourceUserNames = new Array();  // of xs_string
  this.resourceUserNames.$$nsPrefix = "ns8"
 // method to create a new member of the resourceUserNames array
  this.resourceUserNames.newInstance = function( bDeserializing )
  {
    var newObj = new xs_string(  );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.resourceUserNames_newInstance = function( bDeserializing )
  {
    var newLen = this.resourceUserNames.push( new xs_string(  ) );
    return this.resourceUserNames[ newLen-1 ];
  }
  this.$$elementChildren.push( "resourceUserNames" );
  this.$$minOccurs[ "includeFinishedTask" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.includeFinishedTask = new xs_boolean();
  }
  this.$$childElementFunctions[ "includeFinishedTask" ] = xs_boolean;
  this.$$elementChildren.push( "includeFinishedTask" );
  this.$$minOccurs[ "showOnlyExceptionTask" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.showOnlyExceptionTask = new xs_boolean();
  }
  this.$$childElementFunctions[ "showOnlyExceptionTask" ] = xs_boolean;
  this.$$elementChildren.push( "showOnlyExceptionTask" );
  this.$$minOccurs[ "showOnlyMileStone" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.showOnlyMileStone = new xs_boolean();
  }
  this.$$childElementFunctions[ "showOnlyMileStone" ] = xs_boolean;
  this.$$elementChildren.push( "showOnlyMileStone" );
  this.$$minOccurs[ "scheduledStartFrom" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.scheduledStartFrom = new xs_dateTime();
  }
  this.$$childElementFunctions[ "scheduledStartFrom" ] = xs_dateTime;
  this.$$elementChildren.push( "scheduledStartFrom" );
  this.$$minOccurs[ "scheduledStartTo" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.scheduledStartTo = new xs_dateTime();
  }
  this.$$childElementFunctions[ "scheduledStartTo" ] = xs_dateTime;
  this.$$elementChildren.push( "scheduledStartTo" );
  this.$$minOccurs[ "scheduledFinishFrom" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.scheduledFinishFrom = new xs_dateTime();
  }
  this.$$childElementFunctions[ "scheduledFinishFrom" ] = xs_dateTime;
  this.$$elementChildren.push( "scheduledFinishFrom" );
  this.$$minOccurs[ "scheduledFinishTo" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.scheduledFinishTo = new xs_dateTime();
  }
  this.$$childElementFunctions[ "scheduledFinishTo" ] = xs_dateTime;
  this.$$elementChildren.push( "scheduledFinishTo" );
}

function searchTaskPreferenceType_startSearchPosition( val ) 
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
}

function searchTaskPreferenceType_maximumTasksToShow( val ) 
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
}

function updateActualsInput(  ) 
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
  this.$$name = "updateActualsInput";
  this.$$xmlNames[ "updateActualsInput" ] = "updateActualsInput";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.taskId = new xs_long();
  }
  this.$$childElementFunctions[ "taskId" ] = xs_long;
  this.$$elementChildren.push( "taskId" );
  if ( this.$$deserializing == undefined )
  {
  this.assignment = new assignmentType();
  }
  this.$$childElementFunctions[ "assignment" ] = assignmentType;
  this.$$elementChildren.push( "assignment" );
}

function taskType(  ) 
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
  this.$$name = "taskType";
  this.$$xmlNames[ "taskType" ] = "taskType";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "taskId" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.taskId = new xs_long();
  }
  this.$$childElementFunctions[ "taskId" ] = xs_long;
  this.$$elementChildren.push( "taskId" );
  if ( this.$$deserializing == undefined )
  {
  this.taskName = new xs_string();
  }
  this.$$childElementFunctions[ "taskName" ] = xs_string;
  this.$$elementChildren.push( "taskName" );
  if ( this.$$deserializing == undefined )
  {
  this.taskSequence = new xs_long();
  }
  this.$$childElementFunctions[ "taskSequence" ] = xs_long;
  this.$$elementChildren.push( "taskSequence" );
  if ( this.$$deserializing == undefined )
  {
  this.outlineLevel = new xs_long();
  }
  this.$$childElementFunctions[ "outlineLevel" ] = xs_long;
  this.$$elementChildren.push( "outlineLevel" );
  this.$$minOccurs[ "taskStatus" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.taskStatus = new taskStatusType();
  }
  this.$$childElementFunctions[ "taskStatus" ] = taskStatusType;
  this.$$elementChildren.push( "taskStatus" );
  this.$$minOccurs[ "description" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.description = new xs_string();
  }
  this.$$childElementFunctions[ "description" ] = xs_string;
  this.$$elementChildren.push( "description" );
  this.$$minOccurs[ "priority" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.priority = new xs_long();
  }
  this.$$childElementFunctions[ "priority" ] = xs_long;
  this.$$elementChildren.push( "priority" );
  this.$$minOccurs[ "isMileStone" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.isMileStone = new xs_boolean();
  }
  this.$$childElementFunctions[ "isMileStone" ] = xs_boolean;
  this.$$elementChildren.push( "isMileStone" );
  this.$$minOccurs[ "isMajorMilestone" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.isMajorMilestone = new xs_boolean();
  }
  this.$$childElementFunctions[ "isMajorMilestone" ] = xs_boolean;
  this.$$elementChildren.push( "isMajorMilestone" );
  this.$$minOccurs[ "isMilestoneAutomaticallyCompletes" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.isMilestoneAutomaticallyCompletes = new xs_boolean();
  }
  this.$$childElementFunctions[ "isMilestoneAutomaticallyCompletes" ] = xs_boolean;
  this.$$elementChildren.push( "isMilestoneAutomaticallyCompletes" );
  this.$$minOccurs[ "ismilestoneManualConversion" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.ismilestoneManualConversion = new xs_boolean();
  }
  this.$$childElementFunctions[ "ismilestoneManualConversion" ] = xs_boolean;
  this.$$elementChildren.push( "ismilestoneManualConversion" );
  this.$$minOccurs[ "isRequired" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.isRequired = new xs_boolean();
  }
  this.$$childElementFunctions[ "isRequired" ] = xs_boolean;
  this.$$elementChildren.push( "isRequired" );
  this.$$minOccurs[ "activity" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.activity = new activityType();
  }
  this.$$childElementFunctions[ "activity" ] = activityType;
  this.$$elementChildren.push( "activity" );
  this.owners = new Array();  // of resourceType
  this.owners.$$nsPrefix = "ns8"
 // method to create a new member of the owners array
  this.owners.newInstance = function( bDeserializing )
  {
    var newObj = new resourceType( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.owners_newInstance = function( bDeserializing )
  {
    var newLen = this.owners.push( new resourceType( bDeserializing ) );
    return this.owners[ newLen-1 ];
  }
  this.$$elementChildren.push( "owners" );
  this.workUnits = new Array();  // of assignmentType
  this.workUnits.$$nsPrefix = "ns8"
 // method to create a new member of the workUnits array
  this.workUnits.newInstance = function( bDeserializing )
  {
    var newObj = new assignmentType( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.workUnits_newInstance = function( bDeserializing )
  {
    var newLen = this.workUnits.push( new assignmentType( bDeserializing ) );
    return this.workUnits[ newLen-1 ];
  }
  this.$$elementChildren.push( "workUnits" );
  this.$$minOccurs[ "actuals" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.actuals = new taskActualType();
  }
  this.$$childElementFunctions[ "actuals" ] = taskActualType;
  this.$$elementChildren.push( "actuals" );
  this.$$minOccurs[ "roleBean" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.roleBean = new roleInfo();
  }
  this.$$childElementFunctions[ "roleBean" ] = roleInfo;
  this.$$elementChildren.push( "roleBean" );
  if ( this.$$deserializing == undefined )
  {
  this.schedulingBean = new scheduleInfo();
  }
  this.$$childElementFunctions[ "schedulingBean" ] = scheduleInfo;
  this.$$elementChildren.push( "schedulingBean" );
  this.$$minOccurs[ "costBean" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.costBean = new costInfo();
  }
  this.$$childElementFunctions[ "costBean" ] = costInfo;
  this.$$elementChildren.push( "costBean" );
  this.predecessors = new Array();  // of dependencyInfo
  this.predecessors.$$nsPrefix = "ns8"
 // method to create a new member of the predecessors array
  this.predecessors.newInstance = function( bDeserializing )
  {
    var newObj = new dependencyInfo( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.predecessors_newInstance = function( bDeserializing )
  {
    var newLen = this.predecessors.push( new dependencyInfo( bDeserializing ) );
    return this.predecessors[ newLen-1 ];
  }
  this.$$elementChildren.push( "predecessors" );
  this.$$minOccurs[ "notificationSetupBean" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.notificationSetupBean = new notificationSetupInfo();
  }
  this.$$childElementFunctions[ "notificationSetupBean" ] = notificationSetupInfo;
  this.$$elementChildren.push( "notificationSetupBean" );
  this.$$minOccurs[ "userData" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData = new userDataInfo();
  }
  this.$$childElementFunctions[ "userData" ] = userDataInfo;
  this.$$elementChildren.push( "userData" );
  this.skillProficiencies = new Array();  // of skillProficiencyInfo
  this.skillProficiencies.$$nsPrefix = "ns8"
 // method to create a new member of the skillProficiencies array
  this.skillProficiencies.newInstance = function( bDeserializing )
  {
    var newObj = new skillProficiencyInfo( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.skillProficiencies_newInstance = function( bDeserializing )
  {
    var newLen = this.skillProficiencies.push( new skillProficiencyInfo( bDeserializing ) );
    return this.skillProficiencies[ newLen-1 ];
  }
  this.$$elementChildren.push( "skillProficiencies" );
  this.notes = new Array();  // of taskNoteInfo
  this.notes.$$nsPrefix = "ns8"
 // method to create a new member of the notes array
  this.notes.newInstance = function( bDeserializing )
  {
    var newObj = new taskNoteInfo( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.notes_newInstance = function( bDeserializing )
  {
    var newLen = this.notes.push( new taskNoteInfo( bDeserializing ) );
    return this.notes[ newLen-1 ];
  }
  this.$$elementChildren.push( "notes" );
  this.pmReferences = new Array();  // of pmReference
  this.pmReferences.$$nsPrefix = "ns8"
 // method to create a new member of the pmReferences array
  this.pmReferences.newInstance = function( bDeserializing )
  {
    var newObj = new pmReference( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.pmReferences_newInstance = function( bDeserializing )
  {
    var newLen = this.pmReferences.push( new pmReference( bDeserializing ) );
    return this.pmReferences[ newLen-1 ];
  }
  this.$$elementChildren.push( "pmReferences" );
}

function taskStatusType( val ) 
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
  this.$$xmlNames["in_progress"] = "in-progress";
  this.$$objNames["in-progress"] = "in_progress";
  this.in_progress = new xs_string( "in-progress" );
  this.completed = new xs_string( "completed" );
  this.$$xmlNames["in_planning"] = "in-planning";
  this.$$objNames["in-planning"] = "in_planning";
  this.in_planning = new xs_string( "in-planning" );
  this.ready = new xs_string( "ready" );
  this.$$xmlNames["on_hold"] = "on-hold";
  this.$$objNames["on-hold"] = "on_hold";
  this.on_hold = new xs_string( "on-hold" );
  this.active = new xs_string( "active" );
  this.cancelled = new xs_string( "cancelled" );
  this.$$xmlNames["pending_predecessor"] = "pending-predecessor";
  this.$$objNames["pending-predecessor"] = "pending_predecessor";
  this.pending_predecessor = new xs_string( "pending-predecessor" );
  this.$$xmlNames["completed_pending_predecessor"] = "completed-pending-predecessor";
  this.$$objNames["completed-pending-predecessor"] = "completed_pending_predecessor";
  this.completed_pending_predecessor = new xs_string( "completed-pending-predecessor" );
  this.$$xmlNames["completed_pending_request"] = "completed-pending-request";
  this.$$objNames["completed-pending-request"] = "completed_pending_request";
  this.completed_pending_request = new xs_string( "completed-pending-request" );
  this.$$xmlNames["pending_request"] = "pending-request";
  this.$$objNames["pending-request"] = "pending_request";
  this.pending_request = new xs_string( "pending-request" );
}

function taskProperty(  ) 
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
  this.$$name = "taskProperty";
  this.$$xmlNames[ "taskProperty" ] = "taskProperty";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
}

function activityType(  ) 
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
  this.$$name = "activityType";
  this.$$xmlNames[ "activityType" ] = "activityType";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.activityId = new xs_long();
  }
  this.$$childElementFunctions[ "activityId" ] = xs_long;
  this.$$elementChildren.push( "activityId" );
  this.$$minOccurs[ "activityName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.activityName = new xs_string();
  }
  this.$$childElementFunctions[ "activityName" ] = xs_string;
  this.$$elementChildren.push( "activityName" );
}

function resourceType(  ) 
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
  this.$$name = "resourceType";
  this.$$xmlNames[ "resourceType" ] = "resourceType";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.resourceId = new xs_long();
  }
  this.$$childElementFunctions[ "resourceId" ] = xs_long;
  this.$$elementChildren.push( "resourceId" );
  this.$$minOccurs[ "firstName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.firstName = new xs_string();
  }
  this.$$childElementFunctions[ "firstName" ] = xs_string;
  this.$$elementChildren.push( "firstName" );
  this.$$minOccurs[ "lastName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.lastName = new xs_string();
  }
  this.$$childElementFunctions[ "lastName" ] = xs_string;
  this.$$elementChildren.push( "lastName" );
}

function schedulingBean(  ) 
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
  this.$$name = "schedulingBean";
  this.$$xmlNames[ "schedulingBean" ] = "schedulingBean";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xsi_type = new String("ns8:scheduleInfo");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
  this.$$minOccurs[ "scheduledDuration" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.scheduledDuration = new xs_double();
  }
  this.$$childElementFunctions[ "scheduledDuration" ] = xs_double;
  this.$$elementChildren.push( "scheduledDuration" );
  this.$$minOccurs[ "scheduledEffort" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.scheduledEffort = new xs_double();
  }
  this.$$childElementFunctions[ "scheduledEffort" ] = xs_double;
  this.$$elementChildren.push( "scheduledEffort" );
  this.$$minOccurs[ "scheduledStart" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.scheduledStart = new xs_dateTime();
  }
  this.$$childElementFunctions[ "scheduledStart" ] = xs_dateTime;
  this.$$elementChildren.push( "scheduledStart" );
  this.$$minOccurs[ "scheduledFinish" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.scheduledFinish = new xs_dateTime();
  }
  this.$$childElementFunctions[ "scheduledFinish" ] = xs_dateTime;
  this.$$elementChildren.push( "scheduledFinish" );
  this.$$minOccurs[ "constraintType" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.constraintType = new scheduleInfo_constraintType();
  }
  this.$$childElementFunctions[ "constraintType" ] = scheduleInfo_constraintType;
  this.$$elementChildren.push( "constraintType" );
  this.$$minOccurs[ "constraintDate" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.constraintDate = new xs_dateTime();
  }
  this.$$childElementFunctions[ "constraintDate" ] = xs_dateTime;
  this.$$elementChildren.push( "constraintDate" );
}

function scheduleInfo(  ) 
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
  this.$$name = "scheduleInfo";
  this.$$xmlNames[ "scheduleInfo" ] = "scheduleInfo";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "scheduledDuration" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.scheduledDuration = new xs_double();
  }
  this.$$childElementFunctions[ "scheduledDuration" ] = xs_double;
  this.$$elementChildren.push( "scheduledDuration" );
  this.$$minOccurs[ "scheduledEffort" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.scheduledEffort = new xs_double();
  }
  this.$$childElementFunctions[ "scheduledEffort" ] = xs_double;
  this.$$elementChildren.push( "scheduledEffort" );
  this.$$minOccurs[ "scheduledStart" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.scheduledStart = new xs_dateTime();
  }
  this.$$childElementFunctions[ "scheduledStart" ] = xs_dateTime;
  this.$$elementChildren.push( "scheduledStart" );
  this.$$minOccurs[ "scheduledFinish" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.scheduledFinish = new xs_dateTime();
  }
  this.$$childElementFunctions[ "scheduledFinish" ] = xs_dateTime;
  this.$$elementChildren.push( "scheduledFinish" );
  this.$$minOccurs[ "constraintType" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.constraintType = new scheduleInfo_constraintType();
  }
  this.$$childElementFunctions[ "constraintType" ] = scheduleInfo_constraintType;
  this.$$elementChildren.push( "constraintType" );
  this.$$minOccurs[ "constraintDate" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.constraintDate = new xs_dateTime();
  }
  this.$$childElementFunctions[ "constraintDate" ] = xs_dateTime;
  this.$$elementChildren.push( "constraintDate" );
}

function xs_double( val ) 
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
  this.xsi_type = new String("xsd:double");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function scheduleInfo_constraintType( val ) 
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
  this.$$xmlNames["as_soon_as_possible"] = "as-soon-as-possible";
  this.$$objNames["as-soon-as-possible"] = "as_soon_as_possible";
  this.as_soon_as_possible = new xs_string( "as-soon-as-possible" );
  this.$$xmlNames["as_late_as_possible"] = "as-late-as-possible";
  this.$$objNames["as-late-as-possible"] = "as_late_as_possible";
  this.as_late_as_possible = new xs_string( "as-late-as-possible" );
  this.$$xmlNames["start_no_earlier_than"] = "start-no-earlier-than";
  this.$$objNames["start-no-earlier-than"] = "start_no_earlier_than";
  this.start_no_earlier_than = new xs_string( "start-no-earlier-than" );
  this.$$xmlNames["start_no_later_than"] = "start-no-later-than";
  this.$$objNames["start-no-later-than"] = "start_no_later_than";
  this.start_no_later_than = new xs_string( "start-no-later-than" );
  this.$$xmlNames["finish_no_earlier_than"] = "finish-no-earlier-than";
  this.$$objNames["finish-no-earlier-than"] = "finish_no_earlier_than";
  this.finish_no_earlier_than = new xs_string( "finish-no-earlier-than" );
  this.$$xmlNames["finish_no_later_than"] = "finish-no-later-than";
  this.$$objNames["finish-no-later-than"] = "finish_no_later_than";
  this.finish_no_later_than = new xs_string( "finish-no-later-than" );
  this.$$xmlNames["must_start_on"] = "must-start-on";
  this.$$objNames["must-start-on"] = "must_start_on";
  this.must_start_on = new xs_string( "must-start-on" );
  this.$$xmlNames["must_finish_on"] = "must-finish-on";
  this.$$objNames["must-finish-on"] = "must_finish_on";
  this.must_finish_on = new xs_string( "must-finish-on" );
}

function taskActualType(  ) 
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
  this.$$name = "taskActualType";
  this.$$xmlNames[ "taskActualType" ] = "taskActualType";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "actualDuration" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.actualDuration = new xs_double();
  }
  this.$$childElementFunctions[ "actualDuration" ] = xs_double;
  this.$$elementChildren.push( "actualDuration" );
  this.$$minOccurs[ "percentComplete" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.percentComplete = new xs_double();
  }
  this.$$childElementFunctions[ "percentComplete" ] = xs_double;
  this.$$elementChildren.push( "percentComplete" );
  this.$$minOccurs[ "actualEffort" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.actualEffort = new xs_double();
  }
  this.$$childElementFunctions[ "actualEffort" ] = xs_double;
  this.$$elementChildren.push( "actualEffort" );
  this.$$minOccurs[ "estimatedRemainingEffort" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.estimatedRemainingEffort = new xs_double();
  }
  this.$$childElementFunctions[ "estimatedRemainingEffort" ] = xs_double;
  this.$$elementChildren.push( "estimatedRemainingEffort" );
  this.$$minOccurs[ "actualStart" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.actualStart = new xs_dateTime();
  }
  this.$$childElementFunctions[ "actualStart" ] = xs_dateTime;
  this.$$elementChildren.push( "actualStart" );
  this.$$minOccurs[ "estimatedFinish" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.estimatedFinish = new xs_dateTime();
  }
  this.$$childElementFunctions[ "estimatedFinish" ] = xs_dateTime;
  this.$$elementChildren.push( "estimatedFinish" );
  this.$$minOccurs[ "actualFinish" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.actualFinish = new xs_dateTime();
  }
  this.$$childElementFunctions[ "actualFinish" ] = xs_dateTime;
  this.$$elementChildren.push( "actualFinish" );
}

function moneyInfo(  ) 
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
  this.$$name = "moneyInfo";
  this.$$xmlNames[ "moneyInfo" ] = "moneyInfo";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.localValue = new xs_decimal();
  }
  this.$$childElementFunctions[ "localValue" ] = xs_decimal;
  this.$$elementChildren.push( "localValue" );
  if ( this.$$deserializing == undefined )
  {
  this.localCurrencyCode = new xs_string();
  }
  this.$$childElementFunctions[ "localCurrencyCode" ] = xs_string;
  this.$$elementChildren.push( "localCurrencyCode" );
}

function xs_decimal( val ) 
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

function costBean(  ) 
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
  this.$$name = "costBean";
  this.$$xmlNames[ "costBean" ] = "costBean";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xsi_type = new String("ns8:costInfo");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
  this.$$minOccurs[ "actualCapLaborMoney" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.actualCapLaborMoney = new costInfo_moneyInfo();
  }
  this.$$childElementFunctions[ "actualCapLaborMoney" ] = costInfo_moneyInfo;
  this.$$elementChildren.push( "actualCapLaborMoney" );
  this.$$minOccurs[ "actualCapNonLaborMoney" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.actualCapNonLaborMoney = new costInfo_moneyInfo();
  }
  this.$$childElementFunctions[ "actualCapNonLaborMoney" ] = costInfo_moneyInfo;
  this.$$elementChildren.push( "actualCapNonLaborMoney" );
  this.$$minOccurs[ "actualOpLaborMoney" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.actualOpLaborMoney = new costInfo_moneyInfo();
  }
  this.$$childElementFunctions[ "actualOpLaborMoney" ] = costInfo_moneyInfo;
  this.$$elementChildren.push( "actualOpLaborMoney" );
  this.$$minOccurs[ "actualOpNonLaborMoney" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.actualOpNonLaborMoney = new costInfo_moneyInfo();
  }
  this.$$childElementFunctions[ "actualOpNonLaborMoney" ] = costInfo_moneyInfo;
  this.$$elementChildren.push( "actualOpNonLaborMoney" );
  this.$$minOccurs[ "plannedCapLaborMoney" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.plannedCapLaborMoney = new costInfo_moneyInfo();
  }
  this.$$childElementFunctions[ "plannedCapLaborMoney" ] = costInfo_moneyInfo;
  this.$$elementChildren.push( "plannedCapLaborMoney" );
  this.$$minOccurs[ "plannedCapNonLaborMoney" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.plannedCapNonLaborMoney = new costInfo_moneyInfo();
  }
  this.$$childElementFunctions[ "plannedCapNonLaborMoney" ] = costInfo_moneyInfo;
  this.$$elementChildren.push( "plannedCapNonLaborMoney" );
  this.$$minOccurs[ "plannedOpLaborMoney" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.plannedOpLaborMoney = new costInfo_moneyInfo();
  }
  this.$$childElementFunctions[ "plannedOpLaborMoney" ] = costInfo_moneyInfo;
  this.$$elementChildren.push( "plannedOpLaborMoney" );
  this.$$minOccurs[ "plannedOpNonLaborMoney" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.plannedOpNonLaborMoney = new costInfo_moneyInfo();
  }
  this.$$childElementFunctions[ "plannedOpNonLaborMoney" ] = costInfo_moneyInfo;
  this.$$elementChildren.push( "plannedOpNonLaborMoney" );
}

function costInfo(  ) 
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
  this.$$name = "costInfo";
  this.$$xmlNames[ "costInfo" ] = "costInfo";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "actualCapLaborMoney" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.actualCapLaborMoney = new costInfo_moneyInfo();
  }
  this.$$childElementFunctions[ "actualCapLaborMoney" ] = costInfo_moneyInfo;
  this.$$elementChildren.push( "actualCapLaborMoney" );
  this.$$minOccurs[ "actualCapNonLaborMoney" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.actualCapNonLaborMoney = new costInfo_moneyInfo();
  }
  this.$$childElementFunctions[ "actualCapNonLaborMoney" ] = costInfo_moneyInfo;
  this.$$elementChildren.push( "actualCapNonLaborMoney" );
  this.$$minOccurs[ "actualOpLaborMoney" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.actualOpLaborMoney = new costInfo_moneyInfo();
  }
  this.$$childElementFunctions[ "actualOpLaborMoney" ] = costInfo_moneyInfo;
  this.$$elementChildren.push( "actualOpLaborMoney" );
  this.$$minOccurs[ "actualOpNonLaborMoney" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.actualOpNonLaborMoney = new costInfo_moneyInfo();
  }
  this.$$childElementFunctions[ "actualOpNonLaborMoney" ] = costInfo_moneyInfo;
  this.$$elementChildren.push( "actualOpNonLaborMoney" );
  this.$$minOccurs[ "plannedCapLaborMoney" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.plannedCapLaborMoney = new costInfo_moneyInfo();
  }
  this.$$childElementFunctions[ "plannedCapLaborMoney" ] = costInfo_moneyInfo;
  this.$$elementChildren.push( "plannedCapLaborMoney" );
  this.$$minOccurs[ "plannedCapNonLaborMoney" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.plannedCapNonLaborMoney = new costInfo_moneyInfo();
  }
  this.$$childElementFunctions[ "plannedCapNonLaborMoney" ] = costInfo_moneyInfo;
  this.$$elementChildren.push( "plannedCapNonLaborMoney" );
  this.$$minOccurs[ "plannedOpLaborMoney" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.plannedOpLaborMoney = new costInfo_moneyInfo();
  }
  this.$$childElementFunctions[ "plannedOpLaborMoney" ] = costInfo_moneyInfo;
  this.$$elementChildren.push( "plannedOpLaborMoney" );
  this.$$minOccurs[ "plannedOpNonLaborMoney" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.plannedOpNonLaborMoney = new costInfo_moneyInfo();
  }
  this.$$childElementFunctions[ "plannedOpNonLaborMoney" ] = costInfo_moneyInfo;
  this.$$elementChildren.push( "plannedOpNonLaborMoney" );
}

function costInfo_moneyInfo(  ) 
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
  this.$$name = "costInfo_moneyInfo";
  this.$$xmlNames[ "costInfo_moneyInfo" ] = "plannedOpNonLaborMoney";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.localValue = new xs_decimal();
  }
  this.$$childElementFunctions[ "localValue" ] = xs_decimal;
  this.$$elementChildren.push( "localValue" );
  if ( this.$$deserializing == undefined )
  {
  this.localCurrencyCode = new xs_string();
  }
  this.$$childElementFunctions[ "localCurrencyCode" ] = xs_string;
  this.$$elementChildren.push( "localCurrencyCode" );
}

function roleInfo(  ) 
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
  this.$$name = "roleInfo";
  this.$$xmlNames[ "roleInfo" ] = "roleInfo";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.roleId = new xs_long();
  }
  this.$$childElementFunctions[ "roleId" ] = xs_long;
  this.$$elementChildren.push( "roleId" );
  this.$$minOccurs[ "roleName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.roleName = new xs_string();
  }
  this.$$childElementFunctions[ "roleName" ] = xs_string;
  this.$$elementChildren.push( "roleName" );
}

function predecessor(  ) 
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
  this.$$name = "predecessor";
  this.$$xmlNames[ "predecessor" ] = "predecessor";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xsi_type = new String("ns8:dependencyInfo");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
  this.$$minOccurs[ "taskName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.taskName = new xs_string();
  }
  this.$$childElementFunctions[ "taskName" ] = xs_string;
  this.$$elementChildren.push( "taskName" );
  this.$$minOccurs[ "taskId" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.taskId = new xs_string();
  }
  this.$$childElementFunctions[ "taskId" ] = xs_string;
  this.$$elementChildren.push( "taskId" );
  this.$$minOccurs[ "isExternalPredecessor" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.isExternalPredecessor = new xs_boolean();
  }
  this.$$childElementFunctions[ "isExternalPredecessor" ] = xs_boolean;
  this.$$elementChildren.push( "isExternalPredecessor" );
  if ( this.$$deserializing == undefined )
  {
  this.predTaskSeq = new xs_long();
  }
  this.$$childElementFunctions[ "predTaskSeq" ] = xs_long;
  this.$$elementChildren.push( "predTaskSeq" );
  if ( this.$$deserializing == undefined )
  {
  this.predRelationType = new dependencyInfo_predRelationType();
  }
  this.$$childElementFunctions[ "predRelationType" ] = dependencyInfo_predRelationType;
  this.$$elementChildren.push( "predRelationType" );
  this.$$minOccurs[ "lagInDays" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.lagInDays = new xs_double();
  }
  this.$$childElementFunctions[ "lagInDays" ] = xs_double;
  this.$$elementChildren.push( "lagInDays" );
}

function dependencyInfo(  ) 
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
  this.$$name = "dependencyInfo";
  this.$$xmlNames[ "dependencyInfo" ] = "dependencyInfo";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "taskName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.taskName = new xs_string();
  }
  this.$$childElementFunctions[ "taskName" ] = xs_string;
  this.$$elementChildren.push( "taskName" );
  this.$$minOccurs[ "taskId" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.taskId = new xs_string();
  }
  this.$$childElementFunctions[ "taskId" ] = xs_string;
  this.$$elementChildren.push( "taskId" );
  this.$$minOccurs[ "isExternalPredecessor" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.isExternalPredecessor = new xs_boolean();
  }
  this.$$childElementFunctions[ "isExternalPredecessor" ] = xs_boolean;
  this.$$elementChildren.push( "isExternalPredecessor" );
  if ( this.$$deserializing == undefined )
  {
  this.predTaskSeq = new xs_long();
  }
  this.$$childElementFunctions[ "predTaskSeq" ] = xs_long;
  this.$$elementChildren.push( "predTaskSeq" );
  if ( this.$$deserializing == undefined )
  {
  this.predRelationType = new dependencyInfo_predRelationType();
  }
  this.$$childElementFunctions[ "predRelationType" ] = dependencyInfo_predRelationType;
  this.$$elementChildren.push( "predRelationType" );
  this.$$minOccurs[ "lagInDays" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.lagInDays = new xs_double();
  }
  this.$$childElementFunctions[ "lagInDays" ] = xs_double;
  this.$$elementChildren.push( "lagInDays" );
}

function dependencyInfo_predRelationType( val ) 
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
  this.$$xmlNames["start_to_finish"] = "start-to-finish";
  this.$$objNames["start-to-finish"] = "start_to_finish";
  this.start_to_finish = new xs_string( "start-to-finish" );
  this.$$xmlNames["finish_to_finish"] = "finish-to-finish";
  this.$$objNames["finish-to-finish"] = "finish_to_finish";
  this.finish_to_finish = new xs_string( "finish-to-finish" );
  this.$$xmlNames["start_to_start"] = "start-to-start";
  this.$$objNames["start-to-start"] = "start_to_start";
  this.start_to_start = new xs_string( "start-to-start" );
  this.$$xmlNames["finish_to_start"] = "finish-to-start";
  this.$$objNames["finish-to-start"] = "finish_to_start";
  this.finish_to_start = new xs_string( "finish-to-start" );
}

function assignmentType(  ) 
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
  this.$$name = "assignmentType";
  this.$$xmlNames[ "assignmentType" ] = "assignmentType";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "taskId" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.taskId = new xs_long();
  }
  this.$$childElementFunctions[ "taskId" ] = xs_long;
  this.$$elementChildren.push( "taskId" );
  this.$$minOccurs[ "scheduledEffort" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.scheduledEffort = new xs_double();
  }
  this.$$childElementFunctions[ "scheduledEffort" ] = xs_double;
  this.$$elementChildren.push( "scheduledEffort" );
  this.$$minOccurs[ "resource" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.resource = new assignmentType_resourceType();
  }
  this.$$childElementFunctions[ "resource" ] = assignmentType_resourceType;
  this.$$elementChildren.push( "resource" );
  this.$$minOccurs[ "actualDuration" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.actualDuration = new xs_double();
  }
  this.$$childElementFunctions[ "actualDuration" ] = xs_double;
  this.$$elementChildren.push( "actualDuration" );
  this.$$minOccurs[ "percentComplete" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.percentComplete = new assignmentType_percentComplete();
  }
  this.$$childElementFunctions[ "percentComplete" ] = assignmentType_percentComplete;
  this.$$elementChildren.push( "percentComplete" );
  this.$$minOccurs[ "actualEffort" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.actualEffort = new xs_double();
  }
  this.$$childElementFunctions[ "actualEffort" ] = xs_double;
  this.$$elementChildren.push( "actualEffort" );
  this.$$minOccurs[ "estimatedRemainingEffort" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.estimatedRemainingEffort = new xs_double();
  }
  this.$$childElementFunctions[ "estimatedRemainingEffort" ] = xs_double;
  this.$$elementChildren.push( "estimatedRemainingEffort" );
  this.$$minOccurs[ "actualStart" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.actualStart = new xs_dateTime();
  }
  this.$$childElementFunctions[ "actualStart" ] = xs_dateTime;
  this.$$elementChildren.push( "actualStart" );
  this.$$minOccurs[ "estimatedFinish" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.estimatedFinish = new xs_dateTime();
  }
  this.$$childElementFunctions[ "estimatedFinish" ] = xs_dateTime;
  this.$$elementChildren.push( "estimatedFinish" );
  this.$$minOccurs[ "actualFinish" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.actualFinish = new xs_dateTime();
  }
  this.$$childElementFunctions[ "actualFinish" ] = xs_dateTime;
  this.$$elementChildren.push( "actualFinish" );
}

function assignmentType_resourceType(  ) 
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
  this.$$name = "assignmentType_resourceType";
  this.$$xmlNames[ "assignmentType_resourceType" ] = "resource";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.resourceId = new xs_long();
  }
  this.$$childElementFunctions[ "resourceId" ] = xs_long;
  this.$$elementChildren.push( "resourceId" );
  this.$$minOccurs[ "firstName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.firstName = new xs_string();
  }
  this.$$childElementFunctions[ "firstName" ] = xs_string;
  this.$$elementChildren.push( "firstName" );
  this.$$minOccurs[ "lastName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.lastName = new xs_string();
  }
  this.$$childElementFunctions[ "lastName" ] = xs_string;
  this.$$elementChildren.push( "lastName" );
}

function assignmentType_percentComplete( val ) 
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
}

function notificationSetupBean(  ) 
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
  this.$$name = "notificationSetupBean";
  this.$$xmlNames[ "notificationSetupBean" ] = "notificationSetupBean";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xsi_type = new String("ns8:notificationSetupInfo");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
  this.$$minOccurs[ "isNotifyResourcesBeforeStart" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.isNotifyResourcesBeforeStart = new xs_boolean();
  }
  this.$$childElementFunctions[ "isNotifyResourcesBeforeStart" ] = xs_boolean;
  this.$$elementChildren.push( "isNotifyResourcesBeforeStart" );
  this.$$minOccurs[ "isNotifyResourcesIfLate" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.isNotifyResourcesIfLate = new xs_boolean();
  }
  this.$$childElementFunctions[ "isNotifyResourcesIfLate" ] = xs_boolean;
  this.$$elementChildren.push( "isNotifyResourcesIfLate" );
  this.$$minOccurs[ "isNotifyIfLate" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.isNotifyIfLate = new xs_boolean();
  }
  this.$$childElementFunctions[ "isNotifyIfLate" ] = xs_boolean;
  this.$$elementChildren.push( "isNotifyIfLate" );
  this.$$minOccurs[ "isNotifyOnMilestone" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.isNotifyOnMilestone = new xs_boolean();
  }
  this.$$childElementFunctions[ "isNotifyOnMilestone" ] = xs_boolean;
  this.$$elementChildren.push( "isNotifyOnMilestone" );
  this.$$minOccurs[ "isNotifyOnException" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.isNotifyOnException = new xs_boolean();
  }
  this.$$childElementFunctions[ "isNotifyOnException" ] = xs_boolean;
  this.$$elementChildren.push( "isNotifyOnException" );
  this.$$minOccurs[ "notifyResourcesDaysBeforeStart" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.notifyResourcesDaysBeforeStart = new xs_int();
  }
  this.$$childElementFunctions[ "notifyResourcesDaysBeforeStart" ] = xs_int;
  this.$$elementChildren.push( "notifyResourcesDaysBeforeStart" );
  this.$$minOccurs[ "notifyResourcesIfLateFrequency" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.notifyResourcesIfLateFrequency = new frequencyInfo();
  }
  this.$$childElementFunctions[ "notifyResourcesIfLateFrequency" ] = frequencyInfo;
  this.$$elementChildren.push( "notifyResourcesIfLateFrequency" );
  this.$$minOccurs[ "notifyIfLateByDays" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.notifyIfLateByDays = new xs_int();
  }
  this.$$childElementFunctions[ "notifyIfLateByDays" ] = xs_int;
  this.$$elementChildren.push( "notifyIfLateByDays" );
  this.$$minOccurs[ "notifyIfLateFrequency" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.notifyIfLateFrequency = new frequencyInfo();
  }
  this.$$childElementFunctions[ "notifyIfLateFrequency" ] = frequencyInfo;
  this.$$elementChildren.push( "notifyIfLateFrequency" );
  this.notifyIfLateResources = new Array();  // of notificationSetupInfo_resourceType
  this.notifyIfLateResources.$$nsPrefix = "ns8"
 // method to create a new member of the notifyIfLateResources array
  this.notifyIfLateResources.newInstance = function( bDeserializing )
  {
    var newObj = new notificationSetupInfo_resourceType( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.notifyIfLateResources_newInstance = function( bDeserializing )
  {
    var newLen = this.notifyIfLateResources.push( new notificationSetupInfo_resourceType( bDeserializing ) );
    return this.notifyIfLateResources[ newLen-1 ];
  }
  this.$$elementChildren.push( "notifyIfLateResources" );
  this.notifyIfLateSecurityGroups = new Array();  // of securityGroupInfo
  this.notifyIfLateSecurityGroups.$$nsPrefix = "ns8"
 // method to create a new member of the notifyIfLateSecurityGroups array
  this.notifyIfLateSecurityGroups.newInstance = function( bDeserializing )
  {
    var newObj = new securityGroupInfo( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.notifyIfLateSecurityGroups_newInstance = function( bDeserializing )
  {
    var newLen = this.notifyIfLateSecurityGroups.push( new securityGroupInfo( bDeserializing ) );
    return this.notifyIfLateSecurityGroups[ newLen-1 ];
  }
  this.$$elementChildren.push( "notifyIfLateSecurityGroups" );
  this.notifyOnMilestoneResources = new Array();  // of notificationSetupInfo_resourceType
  this.notifyOnMilestoneResources.$$nsPrefix = "ns8"
 // method to create a new member of the notifyOnMilestoneResources array
  this.notifyOnMilestoneResources.newInstance = function( bDeserializing )
  {
    var newObj = new notificationSetupInfo_resourceType( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.notifyOnMilestoneResources_newInstance = function( bDeserializing )
  {
    var newLen = this.notifyOnMilestoneResources.push( new notificationSetupInfo_resourceType( bDeserializing ) );
    return this.notifyOnMilestoneResources[ newLen-1 ];
  }
  this.$$elementChildren.push( "notifyOnMilestoneResources" );
  this.notifyOnMilestoneSecurityGroups = new Array();  // of securityGroupInfo
  this.notifyOnMilestoneSecurityGroups.$$nsPrefix = "ns8"
 // method to create a new member of the notifyOnMilestoneSecurityGroups array
  this.notifyOnMilestoneSecurityGroups.newInstance = function( bDeserializing )
  {
    var newObj = new securityGroupInfo( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.notifyOnMilestoneSecurityGroups_newInstance = function( bDeserializing )
  {
    var newLen = this.notifyOnMilestoneSecurityGroups.push( new securityGroupInfo( bDeserializing ) );
    return this.notifyOnMilestoneSecurityGroups[ newLen-1 ];
  }
  this.$$elementChildren.push( "notifyOnMilestoneSecurityGroups" );
  this.notifyOnExceptionResources = new Array();  // of notificationSetupInfo_resourceType
  this.notifyOnExceptionResources.$$nsPrefix = "ns8"
 // method to create a new member of the notifyOnExceptionResources array
  this.notifyOnExceptionResources.newInstance = function( bDeserializing )
  {
    var newObj = new notificationSetupInfo_resourceType( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.notifyOnExceptionResources_newInstance = function( bDeserializing )
  {
    var newLen = this.notifyOnExceptionResources.push( new notificationSetupInfo_resourceType( bDeserializing ) );
    return this.notifyOnExceptionResources[ newLen-1 ];
  }
  this.$$elementChildren.push( "notifyOnExceptionResources" );
  this.notifyOnExceptionSecurityGroups = new Array();  // of securityGroupInfo
  this.notifyOnExceptionSecurityGroups.$$nsPrefix = "ns8"
 // method to create a new member of the notifyOnExceptionSecurityGroups array
  this.notifyOnExceptionSecurityGroups.newInstance = function( bDeserializing )
  {
    var newObj = new securityGroupInfo( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.notifyOnExceptionSecurityGroups_newInstance = function( bDeserializing )
  {
    var newLen = this.notifyOnExceptionSecurityGroups.push( new securityGroupInfo( bDeserializing ) );
    return this.notifyOnExceptionSecurityGroups[ newLen-1 ];
  }
  this.$$elementChildren.push( "notifyOnExceptionSecurityGroups" );
  if ( this.$$deserializing == undefined )
  {
  this.notifyIfLateParticipants = new participantInfo();
  }
  this.$$childElementFunctions[ "notifyIfLateParticipants" ] = participantInfo;
  this.$$elementChildren.push( "notifyIfLateParticipants" );
  if ( this.$$deserializing == undefined )
  {
  this.notifyOnMilestoneParticipants = new participantInfo();
  }
  this.$$childElementFunctions[ "notifyOnMilestoneParticipants" ] = participantInfo;
  this.$$elementChildren.push( "notifyOnMilestoneParticipants" );
  if ( this.$$deserializing == undefined )
  {
  this.notifyOnExceptionParticipants = new participantInfo();
  }
  this.$$childElementFunctions[ "notifyOnExceptionParticipants" ] = participantInfo;
  this.$$elementChildren.push( "notifyOnExceptionParticipants" );
}

function notificationSetupInfo(  ) 
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
  this.$$name = "notificationSetupInfo";
  this.$$xmlNames[ "notificationSetupInfo" ] = "notificationSetupInfo";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "isNotifyResourcesBeforeStart" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.isNotifyResourcesBeforeStart = new xs_boolean();
  }
  this.$$childElementFunctions[ "isNotifyResourcesBeforeStart" ] = xs_boolean;
  this.$$elementChildren.push( "isNotifyResourcesBeforeStart" );
  this.$$minOccurs[ "isNotifyResourcesIfLate" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.isNotifyResourcesIfLate = new xs_boolean();
  }
  this.$$childElementFunctions[ "isNotifyResourcesIfLate" ] = xs_boolean;
  this.$$elementChildren.push( "isNotifyResourcesIfLate" );
  this.$$minOccurs[ "isNotifyIfLate" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.isNotifyIfLate = new xs_boolean();
  }
  this.$$childElementFunctions[ "isNotifyIfLate" ] = xs_boolean;
  this.$$elementChildren.push( "isNotifyIfLate" );
  this.$$minOccurs[ "isNotifyOnMilestone" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.isNotifyOnMilestone = new xs_boolean();
  }
  this.$$childElementFunctions[ "isNotifyOnMilestone" ] = xs_boolean;
  this.$$elementChildren.push( "isNotifyOnMilestone" );
  this.$$minOccurs[ "isNotifyOnException" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.isNotifyOnException = new xs_boolean();
  }
  this.$$childElementFunctions[ "isNotifyOnException" ] = xs_boolean;
  this.$$elementChildren.push( "isNotifyOnException" );
  this.$$minOccurs[ "notifyResourcesDaysBeforeStart" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.notifyResourcesDaysBeforeStart = new xs_int();
  }
  this.$$childElementFunctions[ "notifyResourcesDaysBeforeStart" ] = xs_int;
  this.$$elementChildren.push( "notifyResourcesDaysBeforeStart" );
  this.$$minOccurs[ "notifyResourcesIfLateFrequency" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.notifyResourcesIfLateFrequency = new frequencyInfo();
  }
  this.$$childElementFunctions[ "notifyResourcesIfLateFrequency" ] = frequencyInfo;
  this.$$elementChildren.push( "notifyResourcesIfLateFrequency" );
  this.$$minOccurs[ "notifyIfLateByDays" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.notifyIfLateByDays = new xs_int();
  }
  this.$$childElementFunctions[ "notifyIfLateByDays" ] = xs_int;
  this.$$elementChildren.push( "notifyIfLateByDays" );
  this.$$minOccurs[ "notifyIfLateFrequency" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.notifyIfLateFrequency = new frequencyInfo();
  }
  this.$$childElementFunctions[ "notifyIfLateFrequency" ] = frequencyInfo;
  this.$$elementChildren.push( "notifyIfLateFrequency" );
  this.notifyIfLateResources = new Array();  // of notificationSetupInfo_resourceType
  this.notifyIfLateResources.$$nsPrefix = "ns8"
 // method to create a new member of the notifyIfLateResources array
  this.notifyIfLateResources.newInstance = function( bDeserializing )
  {
    var newObj = new notificationSetupInfo_resourceType( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.notifyIfLateResources_newInstance = function( bDeserializing )
  {
    var newLen = this.notifyIfLateResources.push( new notificationSetupInfo_resourceType( bDeserializing ) );
    return this.notifyIfLateResources[ newLen-1 ];
  }
  this.$$elementChildren.push( "notifyIfLateResources" );
  this.notifyIfLateSecurityGroups = new Array();  // of securityGroupInfo
  this.notifyIfLateSecurityGroups.$$nsPrefix = "ns8"
 // method to create a new member of the notifyIfLateSecurityGroups array
  this.notifyIfLateSecurityGroups.newInstance = function( bDeserializing )
  {
    var newObj = new securityGroupInfo( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.notifyIfLateSecurityGroups_newInstance = function( bDeserializing )
  {
    var newLen = this.notifyIfLateSecurityGroups.push( new securityGroupInfo( bDeserializing ) );
    return this.notifyIfLateSecurityGroups[ newLen-1 ];
  }
  this.$$elementChildren.push( "notifyIfLateSecurityGroups" );
  this.notifyOnMilestoneResources = new Array();  // of notificationSetupInfo_resourceType
  this.notifyOnMilestoneResources.$$nsPrefix = "ns8"
 // method to create a new member of the notifyOnMilestoneResources array
  this.notifyOnMilestoneResources.newInstance = function( bDeserializing )
  {
    var newObj = new notificationSetupInfo_resourceType( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.notifyOnMilestoneResources_newInstance = function( bDeserializing )
  {
    var newLen = this.notifyOnMilestoneResources.push( new notificationSetupInfo_resourceType( bDeserializing ) );
    return this.notifyOnMilestoneResources[ newLen-1 ];
  }
  this.$$elementChildren.push( "notifyOnMilestoneResources" );
  this.notifyOnMilestoneSecurityGroups = new Array();  // of securityGroupInfo
  this.notifyOnMilestoneSecurityGroups.$$nsPrefix = "ns8"
 // method to create a new member of the notifyOnMilestoneSecurityGroups array
  this.notifyOnMilestoneSecurityGroups.newInstance = function( bDeserializing )
  {
    var newObj = new securityGroupInfo( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.notifyOnMilestoneSecurityGroups_newInstance = function( bDeserializing )
  {
    var newLen = this.notifyOnMilestoneSecurityGroups.push( new securityGroupInfo( bDeserializing ) );
    return this.notifyOnMilestoneSecurityGroups[ newLen-1 ];
  }
  this.$$elementChildren.push( "notifyOnMilestoneSecurityGroups" );
  this.notifyOnExceptionResources = new Array();  // of notificationSetupInfo_resourceType
  this.notifyOnExceptionResources.$$nsPrefix = "ns8"
 // method to create a new member of the notifyOnExceptionResources array
  this.notifyOnExceptionResources.newInstance = function( bDeserializing )
  {
    var newObj = new notificationSetupInfo_resourceType( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.notifyOnExceptionResources_newInstance = function( bDeserializing )
  {
    var newLen = this.notifyOnExceptionResources.push( new notificationSetupInfo_resourceType( bDeserializing ) );
    return this.notifyOnExceptionResources[ newLen-1 ];
  }
  this.$$elementChildren.push( "notifyOnExceptionResources" );
  this.notifyOnExceptionSecurityGroups = new Array();  // of securityGroupInfo
  this.notifyOnExceptionSecurityGroups.$$nsPrefix = "ns8"
 // method to create a new member of the notifyOnExceptionSecurityGroups array
  this.notifyOnExceptionSecurityGroups.newInstance = function( bDeserializing )
  {
    var newObj = new securityGroupInfo( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.notifyOnExceptionSecurityGroups_newInstance = function( bDeserializing )
  {
    var newLen = this.notifyOnExceptionSecurityGroups.push( new securityGroupInfo( bDeserializing ) );
    return this.notifyOnExceptionSecurityGroups[ newLen-1 ];
  }
  this.$$elementChildren.push( "notifyOnExceptionSecurityGroups" );
  if ( this.$$deserializing == undefined )
  {
  this.notifyIfLateParticipants = new participantInfo();
  }
  this.$$childElementFunctions[ "notifyIfLateParticipants" ] = participantInfo;
  this.$$elementChildren.push( "notifyIfLateParticipants" );
  if ( this.$$deserializing == undefined )
  {
  this.notifyOnMilestoneParticipants = new participantInfo();
  }
  this.$$childElementFunctions[ "notifyOnMilestoneParticipants" ] = participantInfo;
  this.$$elementChildren.push( "notifyOnMilestoneParticipants" );
  if ( this.$$deserializing == undefined )
  {
  this.notifyOnExceptionParticipants = new participantInfo();
  }
  this.$$childElementFunctions[ "notifyOnExceptionParticipants" ] = participantInfo;
  this.$$elementChildren.push( "notifyOnExceptionParticipants" );
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

function notificationSetupInfo_resourceType(  ) 
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
  this.$$name = "notificationSetupInfo_resourceType";
  this.$$xmlNames[ "notificationSetupInfo_resourceType" ] = "notifyOnExceptionResources";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.resourceId = new xs_long();
  }
  this.$$childElementFunctions[ "resourceId" ] = xs_long;
  this.$$elementChildren.push( "resourceId" );
  this.$$minOccurs[ "firstName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.firstName = new xs_string();
  }
  this.$$childElementFunctions[ "firstName" ] = xs_string;
  this.$$elementChildren.push( "firstName" );
  this.$$minOccurs[ "lastName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.lastName = new xs_string();
  }
  this.$$childElementFunctions[ "lastName" ] = xs_string;
  this.$$elementChildren.push( "lastName" );
}

function frequency( val ) 
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
  this.xsi_type = new String("ns8:frequencyInfo");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
}

function frequencyInfo( val ) 
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
  this.$$xmlNames["Notify_daily"] = "Notify daily";
  this.$$objNames["Notify daily"] = "Notify_daily";
  this.Notify_daily = new xs_string( "Notify daily" );
  this.$$xmlNames["Notify_hourly"] = "Notify hourly";
  this.$$objNames["Notify hourly"] = "Notify_hourly";
  this.Notify_hourly = new xs_string( "Notify hourly" );
  this.$$xmlNames["Notify_immediately"] = "Notify immediately";
  this.$$objNames["Notify immediately"] = "Notify_immediately";
  this.Notify_immediately = new xs_string( "Notify immediately" );
}

function participants(  ) 
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
  this.$$name = "participants";
  this.$$xmlNames[ "participants" ] = "participants";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xsi_type = new String("ns8:participantInfo");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
  this.participantType = new Array();  // of participantType
  this.participantType.$$nsPrefix = "ns8"
 // method to create a new member of the participantType array
  this.participantType.newInstance = function( bDeserializing )
  {
    var newObj = new participantType( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.participantType_newInstance = function( bDeserializing )
  {
    var newLen = this.participantType.push( new participantType( bDeserializing ) );
    return this.participantType[ newLen-1 ];
  }
  this.$$elementChildren.push( "participantType" );
}

function participantInfo(  ) 
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
  this.$$name = "participantInfo";
  this.$$xmlNames[ "participantInfo" ] = "participantInfo";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.participantType = new Array();  // of participantType
  this.participantType.$$nsPrefix = "ns8"
 // method to create a new member of the participantType array
  this.participantType.newInstance = function( bDeserializing )
  {
    var newObj = new participantType( bDeserializing );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.participantType_newInstance = function( bDeserializing )
  {
    var newLen = this.participantType.push( new participantType( bDeserializing ) );
    return this.participantType[ newLen-1 ];
  }
  this.$$elementChildren.push( "participantType" );
}

function participantType( val ) 
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
  this.StakeHolders = new xs_string( "StakeHolders" );
  this.ProjectManagers = new xs_string( "ProjectManagers" );
  this.SummaryTaskOwners = new xs_string( "SummaryTaskOwners" );
}

function securityGroupInfo(  ) 
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
  this.$$name = "securityGroupInfo";
  this.$$xmlNames[ "securityGroupInfo" ] = "securityGroupInfo";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.groupId = new xs_long();
  }
  this.$$childElementFunctions[ "groupId" ] = xs_long;
  this.$$elementChildren.push( "groupId" );
  if ( this.$$deserializing == undefined )
  {
  this.groupName = new xs_string();
  }
  this.$$childElementFunctions[ "groupName" ] = xs_string;
  this.$$elementChildren.push( "groupName" );
}

function userData(  ) 
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
  this.$$name = "userData";
  this.$$xmlNames[ "userData" ] = "userData";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xsi_type = new String("ns8:userDataInfo");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
  this.$$minOccurs[ "userData1" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData1 = new xs_string();
  }
  this.$$childElementFunctions[ "userData1" ] = xs_string;
  this.$$elementChildren.push( "userData1" );
  this.$$minOccurs[ "userData2" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData2 = new xs_string();
  }
  this.$$childElementFunctions[ "userData2" ] = xs_string;
  this.$$elementChildren.push( "userData2" );
  this.$$minOccurs[ "userData3" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData3 = new xs_string();
  }
  this.$$childElementFunctions[ "userData3" ] = xs_string;
  this.$$elementChildren.push( "userData3" );
  this.$$minOccurs[ "userData4" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData4 = new xs_string();
  }
  this.$$childElementFunctions[ "userData4" ] = xs_string;
  this.$$elementChildren.push( "userData4" );
  this.$$minOccurs[ "userData5" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData5 = new xs_string();
  }
  this.$$childElementFunctions[ "userData5" ] = xs_string;
  this.$$elementChildren.push( "userData5" );
  this.$$minOccurs[ "userData6" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData6 = new xs_string();
  }
  this.$$childElementFunctions[ "userData6" ] = xs_string;
  this.$$elementChildren.push( "userData6" );
  this.$$minOccurs[ "userData7" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData7 = new xs_string();
  }
  this.$$childElementFunctions[ "userData7" ] = xs_string;
  this.$$elementChildren.push( "userData7" );
  this.$$minOccurs[ "userData8" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData8 = new xs_string();
  }
  this.$$childElementFunctions[ "userData8" ] = xs_string;
  this.$$elementChildren.push( "userData8" );
  this.$$minOccurs[ "userData9" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData9 = new xs_string();
  }
  this.$$childElementFunctions[ "userData9" ] = xs_string;
  this.$$elementChildren.push( "userData9" );
  this.$$minOccurs[ "userData10" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData10 = new xs_string();
  }
  this.$$childElementFunctions[ "userData10" ] = xs_string;
  this.$$elementChildren.push( "userData10" );
  this.$$minOccurs[ "userData11" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData11 = new xs_string();
  }
  this.$$childElementFunctions[ "userData11" ] = xs_string;
  this.$$elementChildren.push( "userData11" );
  this.$$minOccurs[ "userData12" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData12 = new xs_string();
  }
  this.$$childElementFunctions[ "userData12" ] = xs_string;
  this.$$elementChildren.push( "userData12" );
  this.$$minOccurs[ "userData13" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData13 = new xs_string();
  }
  this.$$childElementFunctions[ "userData13" ] = xs_string;
  this.$$elementChildren.push( "userData13" );
  this.$$minOccurs[ "userData14" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData14 = new xs_string();
  }
  this.$$childElementFunctions[ "userData14" ] = xs_string;
  this.$$elementChildren.push( "userData14" );
  this.$$minOccurs[ "userData15" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData15 = new xs_string();
  }
  this.$$childElementFunctions[ "userData15" ] = xs_string;
  this.$$elementChildren.push( "userData15" );
  this.$$minOccurs[ "userData16" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData16 = new xs_string();
  }
  this.$$childElementFunctions[ "userData16" ] = xs_string;
  this.$$elementChildren.push( "userData16" );
  this.$$minOccurs[ "userData17" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData17 = new xs_string();
  }
  this.$$childElementFunctions[ "userData17" ] = xs_string;
  this.$$elementChildren.push( "userData17" );
  this.$$minOccurs[ "userData18" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData18 = new xs_string();
  }
  this.$$childElementFunctions[ "userData18" ] = xs_string;
  this.$$elementChildren.push( "userData18" );
  this.$$minOccurs[ "userData19" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData19 = new xs_string();
  }
  this.$$childElementFunctions[ "userData19" ] = xs_string;
  this.$$elementChildren.push( "userData19" );
  this.$$minOccurs[ "userData20" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData20 = new xs_string();
  }
  this.$$childElementFunctions[ "userData20" ] = xs_string;
  this.$$elementChildren.push( "userData20" );
  this.$$minOccurs[ "visUserData1" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData1 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData1" ] = xs_string;
  this.$$elementChildren.push( "visUserData1" );
  this.$$minOccurs[ "visUserData2" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData2 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData2" ] = xs_string;
  this.$$elementChildren.push( "visUserData2" );
  this.$$minOccurs[ "visUserData3" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData3 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData3" ] = xs_string;
  this.$$elementChildren.push( "visUserData3" );
  this.$$minOccurs[ "visUserData4" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData4 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData4" ] = xs_string;
  this.$$elementChildren.push( "visUserData4" );
  this.$$minOccurs[ "visUserData5" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData5 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData5" ] = xs_string;
  this.$$elementChildren.push( "visUserData5" );
  this.$$minOccurs[ "visUserData6" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData6 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData6" ] = xs_string;
  this.$$elementChildren.push( "visUserData6" );
  this.$$minOccurs[ "visUserData7" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData7 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData7" ] = xs_string;
  this.$$elementChildren.push( "visUserData7" );
  this.$$minOccurs[ "visUserData8" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData8 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData8" ] = xs_string;
  this.$$elementChildren.push( "visUserData8" );
  this.$$minOccurs[ "visUserData9" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData9 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData9" ] = xs_string;
  this.$$elementChildren.push( "visUserData9" );
  this.$$minOccurs[ "visUserData10" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData10 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData10" ] = xs_string;
  this.$$elementChildren.push( "visUserData10" );
  this.$$minOccurs[ "visUserData11" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData11 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData11" ] = xs_string;
  this.$$elementChildren.push( "visUserData11" );
  this.$$minOccurs[ "visUserData12" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData12 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData12" ] = xs_string;
  this.$$elementChildren.push( "visUserData12" );
  this.$$minOccurs[ "visUserData13" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData13 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData13" ] = xs_string;
  this.$$elementChildren.push( "visUserData13" );
  this.$$minOccurs[ "visUserData14" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData14 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData14" ] = xs_string;
  this.$$elementChildren.push( "visUserData14" );
  this.$$minOccurs[ "visUserData15" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData15 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData15" ] = xs_string;
  this.$$elementChildren.push( "visUserData15" );
  this.$$minOccurs[ "visUserData16" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData16 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData16" ] = xs_string;
  this.$$elementChildren.push( "visUserData16" );
  this.$$minOccurs[ "visUserData17" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData17 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData17" ] = xs_string;
  this.$$elementChildren.push( "visUserData17" );
  this.$$minOccurs[ "visUserData18" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData18 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData18" ] = xs_string;
  this.$$elementChildren.push( "visUserData18" );
  this.$$minOccurs[ "visUserData19" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData19 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData19" ] = xs_string;
  this.$$elementChildren.push( "visUserData19" );
  this.$$minOccurs[ "visUserData20" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData20 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData20" ] = xs_string;
  this.$$elementChildren.push( "visUserData20" );
}

function userDataInfo(  ) 
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
  this.$$name = "userDataInfo";
  this.$$xmlNames[ "userDataInfo" ] = "userDataInfo";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "userData1" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData1 = new xs_string();
  }
  this.$$childElementFunctions[ "userData1" ] = xs_string;
  this.$$elementChildren.push( "userData1" );
  this.$$minOccurs[ "userData2" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData2 = new xs_string();
  }
  this.$$childElementFunctions[ "userData2" ] = xs_string;
  this.$$elementChildren.push( "userData2" );
  this.$$minOccurs[ "userData3" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData3 = new xs_string();
  }
  this.$$childElementFunctions[ "userData3" ] = xs_string;
  this.$$elementChildren.push( "userData3" );
  this.$$minOccurs[ "userData4" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData4 = new xs_string();
  }
  this.$$childElementFunctions[ "userData4" ] = xs_string;
  this.$$elementChildren.push( "userData4" );
  this.$$minOccurs[ "userData5" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData5 = new xs_string();
  }
  this.$$childElementFunctions[ "userData5" ] = xs_string;
  this.$$elementChildren.push( "userData5" );
  this.$$minOccurs[ "userData6" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData6 = new xs_string();
  }
  this.$$childElementFunctions[ "userData6" ] = xs_string;
  this.$$elementChildren.push( "userData6" );
  this.$$minOccurs[ "userData7" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData7 = new xs_string();
  }
  this.$$childElementFunctions[ "userData7" ] = xs_string;
  this.$$elementChildren.push( "userData7" );
  this.$$minOccurs[ "userData8" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData8 = new xs_string();
  }
  this.$$childElementFunctions[ "userData8" ] = xs_string;
  this.$$elementChildren.push( "userData8" );
  this.$$minOccurs[ "userData9" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData9 = new xs_string();
  }
  this.$$childElementFunctions[ "userData9" ] = xs_string;
  this.$$elementChildren.push( "userData9" );
  this.$$minOccurs[ "userData10" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData10 = new xs_string();
  }
  this.$$childElementFunctions[ "userData10" ] = xs_string;
  this.$$elementChildren.push( "userData10" );
  this.$$minOccurs[ "userData11" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData11 = new xs_string();
  }
  this.$$childElementFunctions[ "userData11" ] = xs_string;
  this.$$elementChildren.push( "userData11" );
  this.$$minOccurs[ "userData12" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData12 = new xs_string();
  }
  this.$$childElementFunctions[ "userData12" ] = xs_string;
  this.$$elementChildren.push( "userData12" );
  this.$$minOccurs[ "userData13" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData13 = new xs_string();
  }
  this.$$childElementFunctions[ "userData13" ] = xs_string;
  this.$$elementChildren.push( "userData13" );
  this.$$minOccurs[ "userData14" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData14 = new xs_string();
  }
  this.$$childElementFunctions[ "userData14" ] = xs_string;
  this.$$elementChildren.push( "userData14" );
  this.$$minOccurs[ "userData15" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData15 = new xs_string();
  }
  this.$$childElementFunctions[ "userData15" ] = xs_string;
  this.$$elementChildren.push( "userData15" );
  this.$$minOccurs[ "userData16" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData16 = new xs_string();
  }
  this.$$childElementFunctions[ "userData16" ] = xs_string;
  this.$$elementChildren.push( "userData16" );
  this.$$minOccurs[ "userData17" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData17 = new xs_string();
  }
  this.$$childElementFunctions[ "userData17" ] = xs_string;
  this.$$elementChildren.push( "userData17" );
  this.$$minOccurs[ "userData18" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData18 = new xs_string();
  }
  this.$$childElementFunctions[ "userData18" ] = xs_string;
  this.$$elementChildren.push( "userData18" );
  this.$$minOccurs[ "userData19" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData19 = new xs_string();
  }
  this.$$childElementFunctions[ "userData19" ] = xs_string;
  this.$$elementChildren.push( "userData19" );
  this.$$minOccurs[ "userData20" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData20 = new xs_string();
  }
  this.$$childElementFunctions[ "userData20" ] = xs_string;
  this.$$elementChildren.push( "userData20" );
  this.$$minOccurs[ "visUserData1" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData1 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData1" ] = xs_string;
  this.$$elementChildren.push( "visUserData1" );
  this.$$minOccurs[ "visUserData2" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData2 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData2" ] = xs_string;
  this.$$elementChildren.push( "visUserData2" );
  this.$$minOccurs[ "visUserData3" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData3 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData3" ] = xs_string;
  this.$$elementChildren.push( "visUserData3" );
  this.$$minOccurs[ "visUserData4" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData4 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData4" ] = xs_string;
  this.$$elementChildren.push( "visUserData4" );
  this.$$minOccurs[ "visUserData5" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData5 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData5" ] = xs_string;
  this.$$elementChildren.push( "visUserData5" );
  this.$$minOccurs[ "visUserData6" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData6 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData6" ] = xs_string;
  this.$$elementChildren.push( "visUserData6" );
  this.$$minOccurs[ "visUserData7" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData7 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData7" ] = xs_string;
  this.$$elementChildren.push( "visUserData7" );
  this.$$minOccurs[ "visUserData8" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData8 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData8" ] = xs_string;
  this.$$elementChildren.push( "visUserData8" );
  this.$$minOccurs[ "visUserData9" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData9 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData9" ] = xs_string;
  this.$$elementChildren.push( "visUserData9" );
  this.$$minOccurs[ "visUserData10" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData10 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData10" ] = xs_string;
  this.$$elementChildren.push( "visUserData10" );
  this.$$minOccurs[ "visUserData11" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData11 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData11" ] = xs_string;
  this.$$elementChildren.push( "visUserData11" );
  this.$$minOccurs[ "visUserData12" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData12 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData12" ] = xs_string;
  this.$$elementChildren.push( "visUserData12" );
  this.$$minOccurs[ "visUserData13" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData13 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData13" ] = xs_string;
  this.$$elementChildren.push( "visUserData13" );
  this.$$minOccurs[ "visUserData14" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData14 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData14" ] = xs_string;
  this.$$elementChildren.push( "visUserData14" );
  this.$$minOccurs[ "visUserData15" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData15 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData15" ] = xs_string;
  this.$$elementChildren.push( "visUserData15" );
  this.$$minOccurs[ "visUserData16" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData16 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData16" ] = xs_string;
  this.$$elementChildren.push( "visUserData16" );
  this.$$minOccurs[ "visUserData17" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData17 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData17" ] = xs_string;
  this.$$elementChildren.push( "visUserData17" );
  this.$$minOccurs[ "visUserData18" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData18 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData18" ] = xs_string;
  this.$$elementChildren.push( "visUserData18" );
  this.$$minOccurs[ "visUserData19" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData19 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData19" ] = xs_string;
  this.$$elementChildren.push( "visUserData19" );
  this.$$minOccurs[ "visUserData20" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData20 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData20" ] = xs_string;
  this.$$elementChildren.push( "visUserData20" );
}

function skillProficiencyInfo(  ) 
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
  this.$$name = "skillProficiencyInfo";
  this.$$xmlNames[ "skillProficiencyInfo" ] = "skillProficiencyInfo";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.proficiencyLevel = new xs_int();
  }
  this.$$childElementFunctions[ "proficiencyLevel" ] = xs_int;
  this.$$elementChildren.push( "proficiencyLevel" );
  if ( this.$$deserializing == undefined )
  {
  this.skill = new skillInfo();
  }
  this.$$childElementFunctions[ "skill" ] = skillInfo;
  this.$$elementChildren.push( "skill" );
}

function skill(  ) 
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
  this.$$name = "skill";
  this.$$xmlNames[ "skill" ] = "skill";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xsi_type = new String("ns8:skillInfo");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
  if ( this.$$deserializing == undefined )
  {
  this.skillId = new xs_long();
  }
  this.$$childElementFunctions[ "skillId" ] = xs_long;
  this.$$elementChildren.push( "skillId" );
}

function skillInfo(  ) 
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
  this.$$name = "skillInfo";
  this.$$xmlNames[ "skillInfo" ] = "skillInfo";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.skillId = new xs_long();
  }
  this.$$childElementFunctions[ "skillId" ] = xs_long;
  this.$$elementChildren.push( "skillId" );
}

function anchor(  ) 
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
  this.$$name = "anchor";
  this.$$xmlNames[ "anchor" ] = "anchor";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xsi_type = new String("ns8:anchorType");
  this.$$attributes.push( "xsi_type" );
  this.$$xmlNames["xsi_type"] = "xsi:type";
  this.$$objNames["xsi:type"] = "xsi_type";
  if ( this.$$deserializing == undefined )
  {
  this.taskSequeceNumber = new xs_int();
  }
  this.$$childElementFunctions[ "taskSequeceNumber" ] = xs_int;
  this.$$elementChildren.push( "taskSequeceNumber" );
  if ( this.$$deserializing == undefined )
  {
  this.outLineLevel = new xs_long();
  }
  this.$$childElementFunctions[ "outLineLevel" ] = xs_long;
  this.$$elementChildren.push( "outLineLevel" );
}

function anchorType(  ) 
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
  this.$$name = "anchorType";
  this.$$xmlNames[ "anchorType" ] = "anchorType";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.taskSequeceNumber = new xs_int();
  }
  this.$$childElementFunctions[ "taskSequeceNumber" ] = xs_int;
  this.$$elementChildren.push( "taskSequeceNumber" );
  if ( this.$$deserializing == undefined )
  {
  this.outLineLevel = new xs_long();
  }
  this.$$childElementFunctions[ "outLineLevel" ] = xs_long;
  this.$$elementChildren.push( "outLineLevel" );
}

function taskNoteInfo(  ) 
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
  this.$$name = "taskNoteInfo";
  this.$$xmlNames[ "taskNoteInfo" ] = "taskNoteInfo";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.noteText = new xs_string();
  }
  this.$$childElementFunctions[ "noteText" ] = xs_string;
  this.$$elementChildren.push( "noteText" );
}

function pmReference(  ) 
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
  this.$$name = "pmReference";
  this.$$xmlNames[ "pmReference" ] = "pmReference";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.targetTypeCode = new xs_int();
  }
  this.$$childElementFunctions[ "targetTypeCode" ] = xs_int;
  this.$$elementChildren.push( "targetTypeCode" );
  if ( this.$$deserializing == undefined )
  {
  this.relBehaviorCode = new pmReference_relBehaviorCode();
  }
  this.$$childElementFunctions[ "relBehaviorCode" ] = pmReference_relBehaviorCode;
  this.$$elementChildren.push( "relBehaviorCode" );
  this.$$minOccurs[ "targetId" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.targetId = new xs_int();
  }
  this.$$childElementFunctions[ "targetId" ] = xs_int;
  this.$$elementChildren.push( "targetId" );
  this.$$minOccurs[ "refRelationshipId" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.refRelationshipId = new xs_int();
  }
  this.$$childElementFunctions[ "refRelationshipId" ] = xs_int;
  this.$$elementChildren.push( "refRelationshipId" );
  this.$$minOccurs[ "referenceName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.referenceName = new xs_string();
  }
  this.$$childElementFunctions[ "referenceName" ] = xs_string;
  this.$$elementChildren.push( "referenceName" );
  this.$$minOccurs[ "refDescirption" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.refDescirption = new xs_string();
  }
  this.$$childElementFunctions[ "refDescirption" ] = xs_string;
  this.$$elementChildren.push( "refDescirption" );
}

function pmReference_relBehaviorCode( val ) 
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
  this.INFORMATIONAL = new xs_string( "INFORMATIONAL" );
  this.SUCCESSOR = new xs_string( "SUCCESSOR" );
  this.PREDECESSOR = new xs_string( "PREDECESSOR" );
  this.FF_PREDECESSOR = new xs_string( "FF_PREDECESSOR" );
  this.AUTO_UPDATE = new xs_string( "AUTO_UPDATE" );
  this.UPDATED_BY_STEP = new xs_string( "UPDATED_BY_STEP" );
}

function field(  ) 
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
  this.$$name = "field";
  this.$$xmlNames[ "field" ] = "field";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.token = new xs_string();
  }
  this.$$childElementFunctions[ "token" ] = xs_string;
  this.$$elementChildren.push( "token" );
}

function simpleFields(  ) 
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
  this.$$name = "simpleFields";
  this.$$xmlNames[ "simpleFields" ] = "simpleFields";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.token = new xs_string();
  }
  this.$$childElementFunctions[ "token" ] = xs_string;
  this.$$elementChildren.push( "token" );
  this.stringValues = new Array();  // of xs_string
  this.stringValues.$$nsPrefix = "ns8"
 // method to create a new member of the stringValues array
  this.stringValues.newInstance = function( bDeserializing )
  {
    var newObj = new xs_string(  );
    this.push( newObj );
    return newObj;
  }
 // _newInstance syntax (deprecated) for backward compatibility
  this.stringValues_newInstance = function( bDeserializing )
  {
    var newLen = this.stringValues.push( new xs_string(  ) );
    return this.stringValues[ newLen-1 ];
  }
  this.$$elementChildren.push( "stringValues" );
  if ( this.$$deserializing == undefined )
  {
  this.dateValue = new xs_dateTime();
  }
  this.$$childElementFunctions[ "dateValue" ] = xs_dateTime;
  this.$$elementChildren.push( "dateValue" );
}

function fieldChangeNote(  ) 
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
  this.$$name = "fieldChangeNote";
  this.$$xmlNames[ "fieldChangeNote" ] = "fieldChangeNote";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "author" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.author = new xs_string();
  }
  this.$$childElementFunctions[ "author" ] = xs_string;
  this.$$elementChildren.push( "author" );
  this.$$minOccurs[ "creationDate" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.creationDate = new xs_dateTime();
  }
  this.$$childElementFunctions[ "creationDate" ] = xs_dateTime;
  this.$$elementChildren.push( "creationDate" );
  this.$$minOccurs[ "content" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.content = new xs_string();
  }
  this.$$childElementFunctions[ "content" ] = xs_string;
  this.$$elementChildren.push( "content" );
  if ( this.$$deserializing == undefined )
  {
  this.fieldPrompt = new xs_string();
  }
  this.$$childElementFunctions[ "fieldPrompt" ] = xs_string;
  this.$$elementChildren.push( "fieldPrompt" );
  if ( this.$$deserializing == undefined )
  {
  this.oldValue = new xs_string();
  }
  this.$$childElementFunctions[ "oldValue" ] = xs_string;
  this.$$elementChildren.push( "oldValue" );
  if ( this.$$deserializing == undefined )
  {
  this.newValue = new xs_string();
  }
  this.$$childElementFunctions[ "newValue" ] = xs_string;
  this.$$elementChildren.push( "newValue" );
}

function AuditHeader(  ) 
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
  if ( this.$$deserializing == undefined )
  {
  this.audit_note = new xs_string();
  }
  this.$$childElementFunctions[ "audit_note" ] = xs_string;
  this.$$elementChildren.push( "audit_note" );
  this.$$minOccurs[ "audit-origin" ] = 0;
  this.$$xmlNames["audit_origin"] = "audit-origin";
  this.$$objNames["audit-origin"] = "audit_origin";
  if ( this.$$deserializing == undefined )
  {
  this.audit_origin = new xs_string();
  }
  this.$$childElementFunctions[ "audit_origin" ] = xs_string;
  this.$$elementChildren.push( "audit_origin" );
  this.$$minOccurs[ "audit-transaction-name" ] = 0;
  this.$$xmlNames["audit_transaction_name"] = "audit-transaction-name";
  this.$$objNames["audit-transaction-name"] = "audit_transaction_name";
  if ( this.$$deserializing == undefined )
  {
  this.audit_transaction_name = new xs_string();
  }
  this.$$childElementFunctions[ "audit_transaction_name" ] = xs_string;
  this.$$elementChildren.push( "audit_transaction_name" );
}

function Note(  ) 
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
  this.$$name = "Note";
  this.$$xmlNames[ "Note" ] = "Note";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "author" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.author = new xs_string();
  }
  this.$$childElementFunctions[ "author" ] = xs_string;
  this.$$elementChildren.push( "author" );
  this.$$minOccurs[ "creationDate" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.creationDate = new xs_dateTime();
  }
  this.$$childElementFunctions[ "creationDate" ] = xs_dateTime;
  this.$$elementChildren.push( "creationDate" );
  this.$$minOccurs[ "content" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.content = new xs_string();
  }
  this.$$childElementFunctions[ "content" ] = xs_string;
  this.$$elementChildren.push( "content" );
}

function Field(  ) 
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
  this.$$name = "Field";
  this.$$xmlNames[ "Field" ] = "Field";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.token = new xs_string();
  }
  this.$$childElementFunctions[ "token" ] = xs_string;
  this.$$elementChildren.push( "token" );
}

function Table(  ) 
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
  this.$$name = "Table";
  this.$$xmlNames[ "Table" ] = "Table";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.token = new xs_string();
  }
  this.$$childElementFunctions[ "token" ] = xs_string;
  this.$$elementChildren.push( "token" );
  this.columns = new Array();  // of Column
  this.columns.$$nsPrefix = "ns9"
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
  this.$$name = "Column";
  this.$$xmlNames[ "Column" ] = "Column";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  if ( this.$$deserializing == undefined )
  {
  this.token = new xs_string();
  }
  this.$$childElementFunctions[ "token" ] = xs_string;
  this.$$elementChildren.push( "token" );
  this.values = new Array();  // of xs_string
  this.values.$$nsPrefix = "ns9"
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
  this.dates.$$nsPrefix = "ns9"
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
  this.$$name = "FieldMetaData";
  this.$$xmlNames[ "FieldMetaData" ] = "FieldMetaData";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "description" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.description = new xs_string();
  }
  this.$$childElementFunctions[ "description" ] = xs_string;
  this.$$elementChildren.push( "description" );
  this.$$minOccurs[ "prompt" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.prompt = new xs_string();
  }
  this.$$childElementFunctions[ "prompt" ] = xs_string;
  this.$$elementChildren.push( "prompt" );
  if ( this.$$deserializing == undefined )
  {
  this.required = new xs_boolean();
  }
  this.$$childElementFunctions[ "required" ] = xs_boolean;
  this.$$elementChildren.push( "required" );
  this.$$minOccurs[ "token" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.token = new xs_string();
  }
  this.$$childElementFunctions[ "token" ] = xs_string;
  this.$$elementChildren.push( "token" );
}

function UserLocaleHeader(  ) 
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
  this.$$name = "UserLocaleHeader";
  this.$$xmlNames[ "UserLocaleHeader" ] = "UserLocaleHeader";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "LanguageLocale" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.LanguageLocale = new xs_string();
  }
  this.$$childElementFunctions[ "LanguageLocale" ] = xs_string;
  this.$$elementChildren.push( "LanguageLocale" );
}

function User(  ) 
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
  this.$$name = "User";
  this.$$xmlNames[ "User" ] = "User";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "id" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.id = new xs_integer();
  }
  this.$$childElementFunctions[ "id" ] = xs_integer;
  this.$$elementChildren.push( "id" );
  this.$$minOccurs[ "userName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userName = new xs_string();
  }
  this.$$childElementFunctions[ "userName" ] = xs_string;
  this.$$elementChildren.push( "userName" );
  this.$$minOccurs[ "fullName" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.fullName = new xs_string();
  }
  this.$$childElementFunctions[ "fullName" ] = xs_string;
  this.$$elementChildren.push( "fullName" );
}

function UserData(  ) 
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
  this.$$name = "UserData";
  this.$$xmlNames[ "UserData" ] = "UserData";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.$$minOccurs[ "userData1" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData1 = new xs_string();
  }
  this.$$childElementFunctions[ "userData1" ] = xs_string;
  this.$$elementChildren.push( "userData1" );
  this.$$minOccurs[ "userData2" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData2 = new xs_string();
  }
  this.$$childElementFunctions[ "userData2" ] = xs_string;
  this.$$elementChildren.push( "userData2" );
  this.$$minOccurs[ "userData3" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData3 = new xs_string();
  }
  this.$$childElementFunctions[ "userData3" ] = xs_string;
  this.$$elementChildren.push( "userData3" );
  this.$$minOccurs[ "userData4" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData4 = new xs_string();
  }
  this.$$childElementFunctions[ "userData4" ] = xs_string;
  this.$$elementChildren.push( "userData4" );
  this.$$minOccurs[ "userData5" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData5 = new xs_string();
  }
  this.$$childElementFunctions[ "userData5" ] = xs_string;
  this.$$elementChildren.push( "userData5" );
  this.$$minOccurs[ "userData6" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData6 = new xs_string();
  }
  this.$$childElementFunctions[ "userData6" ] = xs_string;
  this.$$elementChildren.push( "userData6" );
  this.$$minOccurs[ "userData7" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData7 = new xs_string();
  }
  this.$$childElementFunctions[ "userData7" ] = xs_string;
  this.$$elementChildren.push( "userData7" );
  this.$$minOccurs[ "userData8" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData8 = new xs_string();
  }
  this.$$childElementFunctions[ "userData8" ] = xs_string;
  this.$$elementChildren.push( "userData8" );
  this.$$minOccurs[ "userData9" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData9 = new xs_string();
  }
  this.$$childElementFunctions[ "userData9" ] = xs_string;
  this.$$elementChildren.push( "userData9" );
  this.$$minOccurs[ "userData10" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData10 = new xs_string();
  }
  this.$$childElementFunctions[ "userData10" ] = xs_string;
  this.$$elementChildren.push( "userData10" );
  this.$$minOccurs[ "userData11" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData11 = new xs_string();
  }
  this.$$childElementFunctions[ "userData11" ] = xs_string;
  this.$$elementChildren.push( "userData11" );
  this.$$minOccurs[ "userData12" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData12 = new xs_string();
  }
  this.$$childElementFunctions[ "userData12" ] = xs_string;
  this.$$elementChildren.push( "userData12" );
  this.$$minOccurs[ "userData13" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData13 = new xs_string();
  }
  this.$$childElementFunctions[ "userData13" ] = xs_string;
  this.$$elementChildren.push( "userData13" );
  this.$$minOccurs[ "userData14" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData14 = new xs_string();
  }
  this.$$childElementFunctions[ "userData14" ] = xs_string;
  this.$$elementChildren.push( "userData14" );
  this.$$minOccurs[ "userData15" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData15 = new xs_string();
  }
  this.$$childElementFunctions[ "userData15" ] = xs_string;
  this.$$elementChildren.push( "userData15" );
  this.$$minOccurs[ "userData16" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData16 = new xs_string();
  }
  this.$$childElementFunctions[ "userData16" ] = xs_string;
  this.$$elementChildren.push( "userData16" );
  this.$$minOccurs[ "userData17" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData17 = new xs_string();
  }
  this.$$childElementFunctions[ "userData17" ] = xs_string;
  this.$$elementChildren.push( "userData17" );
  this.$$minOccurs[ "userData18" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData18 = new xs_string();
  }
  this.$$childElementFunctions[ "userData18" ] = xs_string;
  this.$$elementChildren.push( "userData18" );
  this.$$minOccurs[ "userData19" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData19 = new xs_string();
  }
  this.$$childElementFunctions[ "userData19" ] = xs_string;
  this.$$elementChildren.push( "userData19" );
  this.$$minOccurs[ "userData20" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.userData20 = new xs_string();
  }
  this.$$childElementFunctions[ "userData20" ] = xs_string;
  this.$$elementChildren.push( "userData20" );
  this.$$minOccurs[ "visUserData1" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData1 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData1" ] = xs_string;
  this.$$elementChildren.push( "visUserData1" );
  this.$$minOccurs[ "visUserData2" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData2 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData2" ] = xs_string;
  this.$$elementChildren.push( "visUserData2" );
  this.$$minOccurs[ "visUserData3" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData3 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData3" ] = xs_string;
  this.$$elementChildren.push( "visUserData3" );
  this.$$minOccurs[ "visUserData4" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData4 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData4" ] = xs_string;
  this.$$elementChildren.push( "visUserData4" );
  this.$$minOccurs[ "visUserData5" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData5 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData5" ] = xs_string;
  this.$$elementChildren.push( "visUserData5" );
  this.$$minOccurs[ "visUserData6" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData6 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData6" ] = xs_string;
  this.$$elementChildren.push( "visUserData6" );
  this.$$minOccurs[ "visUserData7" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData7 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData7" ] = xs_string;
  this.$$elementChildren.push( "visUserData7" );
  this.$$minOccurs[ "visUserData8" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData8 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData8" ] = xs_string;
  this.$$elementChildren.push( "visUserData8" );
  this.$$minOccurs[ "visUserData9" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData9 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData9" ] = xs_string;
  this.$$elementChildren.push( "visUserData9" );
  this.$$minOccurs[ "visUserData10" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData10 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData10" ] = xs_string;
  this.$$elementChildren.push( "visUserData10" );
  this.$$minOccurs[ "visUserData11" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData11 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData11" ] = xs_string;
  this.$$elementChildren.push( "visUserData11" );
  this.$$minOccurs[ "visUserData12" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData12 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData12" ] = xs_string;
  this.$$elementChildren.push( "visUserData12" );
  this.$$minOccurs[ "visUserData13" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData13 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData13" ] = xs_string;
  this.$$elementChildren.push( "visUserData13" );
  this.$$minOccurs[ "visUserData14" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData14 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData14" ] = xs_string;
  this.$$elementChildren.push( "visUserData14" );
  this.$$minOccurs[ "visUserData15" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData15 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData15" ] = xs_string;
  this.$$elementChildren.push( "visUserData15" );
  this.$$minOccurs[ "visUserData16" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData16 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData16" ] = xs_string;
  this.$$elementChildren.push( "visUserData16" );
  this.$$minOccurs[ "visUserData17" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData17 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData17" ] = xs_string;
  this.$$elementChildren.push( "visUserData17" );
  this.$$minOccurs[ "visUserData18" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData18 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData18" ] = xs_string;
  this.$$elementChildren.push( "visUserData18" );
  this.$$minOccurs[ "visUserData19" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData19 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData19" ] = xs_string;
  this.$$elementChildren.push( "visUserData19" );
  this.$$minOccurs[ "visUserData20" ] = 0;
  if ( this.$$deserializing == undefined )
  {
  this.visUserData20 = new xs_string();
  }
  this.$$childElementFunctions[ "visUserData20" ] = xs_string;
  this.$$elementChildren.push( "visUserData20" );
}

function createProjectMessage(  ) 
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
  this.$$name = "createProjectMessage";
  this.$$xmlNames[ "createProjectMessage" ] = "createProjectMessage";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns3 = new String("http://mercury.com/ppm/pm/msg/1.0");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
}

function createProjectResponseMessage(  ) 
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
  this.$$name = "createProjectResponseMessage";
  this.$$xmlNames[ "createProjectResponseMessage" ] = "createProjectResponseMessage";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns3 = new String("http://mercury.com/ppm/pm/msg/1.0");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
}

function updateProjectMessage(  ) 
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
  this.$$name = "updateProjectMessage";
  this.$$xmlNames[ "updateProjectMessage" ] = "updateProjectMessage";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns3 = new String("http://mercury.com/ppm/pm/msg/1.0");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
}

function updateProjectResponseMessage(  ) 
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
  this.$$name = "updateProjectResponseMessage";
  this.$$xmlNames[ "updateProjectResponseMessage" ] = "updateProjectResponseMessage";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns3 = new String("http://mercury.com/ppm/pm/msg/1.0");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
}

function readTasksMessage(  ) 
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
  this.$$name = "readTasksMessage";
  this.$$xmlNames[ "readTasksMessage" ] = "readTasksMessage";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns3 = new String("http://mercury.com/ppm/pm/msg/1.0");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
}

function readTasksResponseMessage(  ) 
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
  this.$$name = "readTasksResponseMessage";
  this.$$xmlNames[ "readTasksResponseMessage" ] = "readTasksResponseMessage";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns3 = new String("http://mercury.com/ppm/pm/msg/1.0");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
}

function getProjectDetailsMessage(  ) 
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
  this.$$name = "getProjectDetailsMessage";
  this.$$xmlNames[ "getProjectDetailsMessage" ] = "getProjectDetailsMessage";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns3 = new String("http://mercury.com/ppm/pm/msg/1.0");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
}

function getProjectDetailsResponseMessage(  ) 
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
  this.$$name = "getProjectDetailsResponseMessage";
  this.$$xmlNames[ "getProjectDetailsResponseMessage" ] = "getProjectDetailsResponseMessage";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns3 = new String("http://mercury.com/ppm/pm/msg/1.0");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
}

function exportWorkPlanFromProjectMessage(  ) 
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
  this.$$name = "exportWorkPlanFromProjectMessage";
  this.$$xmlNames[ "exportWorkPlanFromProjectMessage" ] = "exportWorkPlanFromProjectMessage";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns3 = new String("http://mercury.com/ppm/pm/msg/1.0");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
}

function exportWorkPlanFromProjectResponseMessage(  ) 
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
  this.$$name = "exportWorkPlanFromProjectResponseMessage";
  this.$$xmlNames[ "exportWorkPlanFromProjectResponseMessage" ] = "exportWorkPlanFromProjectResponseMessage";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns3 = new String("http://mercury.com/ppm/pm/msg/1.0");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
}

function updateWorkPlanStatusMessage(  ) 
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
  this.$$name = "updateWorkPlanStatusMessage";
  this.$$xmlNames[ "updateWorkPlanStatusMessage" ] = "updateWorkPlanStatusMessage";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns3 = new String("http://mercury.com/ppm/pm/msg/1.0");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
}

function updateWorkPlanStatusResponseMessage(  ) 
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
  this.$$name = "updateWorkPlanStatusResponseMessage";
  this.$$xmlNames[ "updateWorkPlanStatusResponseMessage" ] = "updateWorkPlanStatusResponseMessage";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns3 = new String("http://mercury.com/ppm/pm/msg/1.0");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
}

function searchProjectsMessage(  ) 
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
  this.$$name = "searchProjectsMessage";
  this.$$xmlNames[ "searchProjectsMessage" ] = "searchProjectsMessage";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns3 = new String("http://mercury.com/ppm/pm/msg/1.0");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
}

function searchProjectsResponseMessage(  ) 
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
  this.$$name = "searchProjectsResponseMessage";
  this.$$xmlNames[ "searchProjectsResponseMessage" ] = "searchProjectsResponseMessage";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns3 = new String("http://mercury.com/ppm/pm/msg/1.0");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
}

function createWorkPlanFromTemplateMessage(  ) 
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
  this.$$name = "createWorkPlanFromTemplateMessage";
  this.$$xmlNames[ "createWorkPlanFromTemplateMessage" ] = "createWorkPlanFromTemplateMessage";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns3 = new String("http://mercury.com/ppm/pm/msg/1.0");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
}

function createWorkPlanFromTemplateResponseMessage(  ) 
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
  this.$$name = "createWorkPlanFromTemplateResponseMessage";
  this.$$xmlNames[ "createWorkPlanFromTemplateResponseMessage" ] = "createWorkPlanFromTemplateResponseMessage";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns3 = new String("http://mercury.com/ppm/pm/msg/1.0");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
}

function searchTasksMessage(  ) 
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
  this.$$name = "searchTasksMessage";
  this.$$xmlNames[ "searchTasksMessage" ] = "searchTasksMessage";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns3 = new String("http://mercury.com/ppm/pm/msg/1.0");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
}

function searchTasksResponseMessage(  ) 
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
  this.$$name = "searchTasksResponseMessage";
  this.$$xmlNames[ "searchTasksResponseMessage" ] = "searchTasksResponseMessage";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns3 = new String("http://mercury.com/ppm/pm/msg/1.0");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
}

function importWorkPlanTasksMessage(  ) 
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
  this.$$name = "importWorkPlanTasksMessage";
  this.$$xmlNames[ "importWorkPlanTasksMessage" ] = "importWorkPlanTasksMessage";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns3 = new String("http://mercury.com/ppm/pm/msg/1.0");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
}

function importWorkPlanTasksResponseMessage(  ) 
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
  this.$$name = "importWorkPlanTasksResponseMessage";
  this.$$xmlNames[ "importWorkPlanTasksResponseMessage" ] = "importWorkPlanTasksResponseMessage";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns3 = new String("http://mercury.com/ppm/pm/msg/1.0");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
}

function updateTaskStatusMessage(  ) 
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
  this.$$name = "updateTaskStatusMessage";
  this.$$xmlNames[ "updateTaskStatusMessage" ] = "updateTaskStatusMessage";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns3 = new String("http://mercury.com/ppm/pm/msg/1.0");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
}

function updateTaskStatusResponseMessage(  ) 
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
  this.$$name = "updateTaskStatusResponseMessage";
  this.$$xmlNames[ "updateTaskStatusResponseMessage" ] = "updateTaskStatusResponseMessage";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns3 = new String("http://mercury.com/ppm/pm/msg/1.0");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
}

function updateTaskActualsMessage(  ) 
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
  this.$$name = "updateTaskActualsMessage";
  this.$$xmlNames[ "updateTaskActualsMessage" ] = "updateTaskActualsMessage";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns3 = new String("http://mercury.com/ppm/pm/msg/1.0");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
}

function updateTaskActualsResponseMessage(  ) 
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
  this.$$name = "updateTaskActualsResponseMessage";
  this.$$xmlNames[ "updateTaskActualsResponseMessage" ] = "updateTaskActualsResponseMessage";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns3 = new String("http://mercury.com/ppm/pm/msg/1.0");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
}

function bulkImportProjectsMessage(  ) 
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
  this.$$name = "bulkImportProjectsMessage";
  this.$$xmlNames[ "bulkImportProjectsMessage" ] = "bulkImportProjectsMessage";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns3 = new String("http://mercury.com/ppm/pm/msg/1.0");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
}

function bulkImportProjectsResponseMessage(  ) 
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
  this.$$name = "bulkImportProjectsResponseMessage";
  this.$$xmlNames[ "bulkImportProjectsResponseMessage" ] = "bulkImportProjectsResponseMessage";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns3 = new String("http://mercury.com/ppm/pm/msg/1.0");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
}

function createBlankWorkPlanMessage(  ) 
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
  this.$$name = "createBlankWorkPlanMessage";
  this.$$xmlNames[ "createBlankWorkPlanMessage" ] = "createBlankWorkPlanMessage";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns3 = new String("http://mercury.com/ppm/pm/msg/1.0");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
}

function createBlankWorkPlanResponseMessage(  ) 
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
  this.$$name = "createBlankWorkPlanResponseMessage";
  this.$$xmlNames[ "createBlankWorkPlanResponseMessage" ] = "createBlankWorkPlanResponseMessage";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns3 = new String("http://mercury.com/ppm/pm/msg/1.0");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
}

function executeWorkflowTransitionMessage(  ) 
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
  this.$$name = "executeWorkflowTransitionMessage";
  this.$$xmlNames[ "executeWorkflowTransitionMessage" ] = "executeWorkflowTransitionMessage";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns3 = new String("http://mercury.com/ppm/pm/msg/1.0");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
}

function executeWorkflowTransitionResponseMessage(  ) 
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
  this.$$name = "executeWorkflowTransitionResponseMessage";
  this.$$xmlNames[ "executeWorkflowTransitionResponseMessage" ] = "executeWorkflowTransitionResponseMessage";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns3 = new String("http://mercury.com/ppm/pm/msg/1.0");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
}

function addTasksToExistingWorkPlanMessage(  ) 
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
  this.$$name = "addTasksToExistingWorkPlanMessage";
  this.$$xmlNames[ "addTasksToExistingWorkPlanMessage" ] = "addTasksToExistingWorkPlanMessage";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns3 = new String("http://mercury.com/ppm/pm/msg/1.0");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
}

function addTasksToExistingWorkPlanResponseMessage(  ) 
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
  this.$$name = "addTasksToExistingWorkPlanResponseMessage";
  this.$$xmlNames[ "addTasksToExistingWorkPlanResponseMessage" ] = "addTasksToExistingWorkPlanResponseMessage";
  this.$$childElementFunctions = new Array();
  this.getChildFunc = getChildFunc; 
  if ( arguments.length > 0 )
  {
    this.$$deserializing = arguments[0];
  }
  this.xmlns_ns3 = new String("http://mercury.com/ppm/pm/msg/1.0");
  this.$$attributes.push( "xmlns_ns3" );
  this.$$xmlNames["xmlns_ns3"] = "xmlns:ns3";
  this.$$objNames["xmlns:ns3"] = "xmlns_ns3";
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