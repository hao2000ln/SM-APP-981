---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.1.1.2.12 .. 1.1.1.4.1
printed_pages: 86-113
---

# 1.1.1.2.12 Sample client for Web Services SM7 URL

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.1.2.12. Sample client for Web Services SM7
URL

The Service Manager server includes a sample Web Services client application for the
http://servername:port_number/SM/7/service_name.wsdl. The sample application was created
for Apache™ Axis2 (version 1.7.9). If you have Axis 1.7.9 and Apache™ Ant installed, you can
review and update the source code of the sample application as well as generate updated
proxy code to test the Service Manager Web Services functionality. The Apache Axis2 sample
is written in Java. The sample client application is included with the server installation in the
following folder:

<Service Manager server installation folder>\webservices\sample\sm7webservice

The sample includes the source code for the client applications as well as support files for the
Web Services development environment. The Apache Axis2 jar files are included and they are
located under the "lib" folder. A set of the batch files that you can use to run each class are
located under the "bin" folder and you can run each class from the Windows command prompt
after you have compiled the sample Java. You can use the sample application as an example of
how to create your own custom Web Services client applications.

            Note

           All the sample applications use a command line interface. To see the usage
           information for the command line interface, change to "bin" folder, type xxxSample
           where xxxSample is the batch file name of the sample application.

The Apache Axis2 sample client application assumes that you have a Service Manager server
instance running from the local host. If this is not the case, you can change the server host
name and port number using the sample's command line interface.

Each of the sample folders includes a readme file that contains valuable information about
using the sample application found in each of the sample folder.

The sample client application contains examples of how to send the MTOM attachments to the
Service Manager server.

Configuration Management sample

The sample client applications contain the following classes for Configuration Management.
Refer to the sample application source code for comments on the usage of each class.


Field                                   Description
ConfigurationManagementServiceUtility
                                             Provides the CreateService method to
                                             initialize an object for the service.
                                             Provides the InitServiceAuthentication
                                             method to send the host name,
                                             communications port, operator name,
                                             and operator password with each
                                             SOAP request.

CreateContactSample                     Creates a contact record with the supplied
DeleteContactSample                     parameters.
RetrieveContactSample
UpdateContactSample                     Deletes the contact record listed in the
                                        supplied parameters.

                                        Retrieves a single contact record matching
                                        the supplied parameters.

                                        Updates a contact record with the supplied
                                        parameters.

Incident Management sample

The sample client applications contain the following classes for Incident Management. Refer to
the sample application source code for comments on the usage of each class.

Class                                                                                            Service Manager 9.81
CloseIncidentSample
CreateIncidentSample                    Description
IncidentManagementServiceUtility
                                        Closes an incident record with the supplied
ResolveIncidentSample                   parameters.
RetrieveIncidentListSample
RetrieveIncidentSample                  Creates an incident record with the supplied
UpdateIncidentSample                    parameters.

                                             Provides the CreateService method to
                                             initialize an object for the service.
                                             Provides the InitServiceAuthentication
                                             method to send the host name,
                                             communications port, operator name,
                                             and operator password with each
                                             SOAP request.

                                        Resolves an incident record matching the
                                        supplied parameters.

                                        Retrieves multiple incident records
                                        matching the supplied parameters.

                                        Retrieves a single incident record matching
                                        the supplied parameters.

                                        Updates an incident record with the
                                        supplied parameters.


1.1.1.2.13. Command line arguments for the
Axis2 sample application

The Axis2 sample application runs from the command prompt using Java. After you have
compiled the Axis2 sample into an executable class files, you can perform configuration and
incident management tasks with the following arguments.

            Note

           To see the usage information for the Axis2 sample application, type ClassName
           where ClassName is the name of a sample application class.

Configuration Management

The following commands invoke Configuration Management functionality. These examples
assume you are using the batch files provided with the Axis2 sample application to
automatically set the class path and call the proper executable class.

Operation                               Command-line example
Create contact
Delete contact                          CreateContactSample -name "FALCON,
Retrieve contact                        MERLINE2" -fullname "MERLINE2 FALCON"

Update Contact                          DeleteContactSample DeleteContactSample
                                        -name "FALCON, MERLINE2"

                                        RetrieveContactSample
                                        RetrieveContactSample -name "FALCON,
                                        MERLINE2"

                                        UpdateContactSample
                                        UpdateContactSample -name "FALCON,
                                        MERLINE2" -email
                                        "fmerline2@Advantage.com"

Incident Management

The following commands invoke Incident Management functionality. These examples assume
you are using the batch files provided with the Axis2 sample application to automatically set
the class path and call the proper executable class.


Operation                               Command-line example
Close incident
Create incident                         CloseIncidentSample -incidentId IM10136 -
                                        solution "Developer fix problem" -
Create incident with attachment(s)      closeCode "User Closure"

Resolve incident                        CreateIncidentSample -title "WS Sample
Retrieve incident list                  title" -category incident -area hardware -
Retrieve incident                       subArea "hardware failure" -description
Update incident                         "sample WS IM desc" -urgency 1 -impact 1
                                        -service Applications -assignmentGroup
                                        Application

                                        CreateIncidentSample -title "WS Sample
                                        title" -category incident -area hardware -
                                        subArea "hardware failure" -description
                                        "sample WS IM desc" -urgency 1 -impact 1
                                        -service Applications -assignmentGroup
                                        Application -attachment 101.jpg:README.txt

                                        ResolveIncidentSample -incidentId IM10136
                                        -solution "Developer fix problem"

                                        RetrieveIncidentListSample -incidentId
                                        IM10011:IM10021:IM10031

                                        RetrieveIncidentSample -incidentId IM10041

                                        UpdateIncidentSample -incidentId IM10060
                                        -journalUpdates "this is a update from SM
                                        webservice sample"

The CreateIncicentSample and UpdateIncidentSample classes can send MTOM attachments to
Service Manager server. The command line argument is -attachment file_01:file_02. You can
send more than one attachment to Service Manager server. Be sure to place the attachments in
the
<SM_installation_directory>\webservices\sample\sm7webservices\Axis2Sample\bin\resources
directory.


1.1.1.2.14. Add an external access action to the
Web Services

You must have the SysAdmin capability words to use this procedure.

   1. Click Tailoring > Web Services > External Access Actions. Service Manager displays
     the External Access Actions form.

   2. In External Action ID, type a unique ID name.
   3. In RAD/ScriptLibrary.function, type the name of the RAD or JavaScript function you want

     to make available as a custom action in the Web Services API.

                   Note

                To specify a script from the Script Library, use the following format:
                <script name>.<function name>
                For example, Approval.buildAllStatus.

   4. In Type, select RAD if your custom action is a RAD function or select JavaScript if your
     custom action is a JavaScript.

   5. In Description, type the name you want the custom action to have.

                   Note

                Service Manager displays the name you type here as the Custom Action to
                Perform in the External Access Defintion form.

     The type you select determines what Parameters array Service Manager displays. If you
     select RAD, Service Manager displays an array with Parameter Names and Parameter
     Values fields. If you select JavaScript, Service Manager displays an array with only the
     Parameter Values field.
   6. Type any required input parameters of the RAD function or JavaScript in the parameters
     array.
     RAD functions require values in both the Parameter Names and Parameter Values fields.
     Each RAD function has its own list of required RAD parameters names. RAD parameter
     values are typically system variables such as $L.file or$L.exit. You can type RAD function
     parameters in any order.
     JavaScript parameters only require the Parameter Values field, but require you to type
     them in the same order as the JavaScript function expects them. For example, the


  buildAllStatus function of the Approval script expects the following parameters in the
  following order:

  record
  fApprovalDef
  keepRoleOld
  keepRoleNew
  tokens
  tokenToDescription

7. Click Add to create your custom Web Services action.


1.1.1.3. Web services authentication

Both The RESTful and SOAP API framework support the following authentication methods:

     HTTP Basic Authentication
     CAC (Common Access Card)
     TSO (Trusted Sign On)

Implementing TSO for custom web services clients

Do the following to use TSO authentication for custom web services clients:

     Enable two-way SSL between the web service client and the Service Manager server, so
     that they trust each other.
     Add parameter trustedsignon:1 to the integration servlet.
     Create a dedicated integration account for the web service client to log in to the Service
     Manager server.
     Add a “Pragma: TrustedSignOn” header in the request

            Note

                You still need to use the Basic Authentication to pass the username of
                integration user to SM Server
                When the custom HTTP header “Pragma: TrustedSignOn” is present, the SM
                Server checks only the existence of the integration user on Service Manager
                side and skips password checking because the presence of the header
                indicates the client has been authenticated by an external source such as
                Active Directory, Kerberos, or a custom Single Sign-On third-party server.
                This document assumes that you have taken the necessary steps to ensure
                that your custom web services client has been successfully pre-
                authenticated before any transactions with the Service Manager web services
                API begin.


1.1.1.4. SOAP API

This chapter introduces the SOAP API used in Service Manager.


1.1.1.4.1. Web Services Description Language
(WSDL)

The W3C describes WSDL in the W3C Note 15 March 2001 as "WSDL is an XML format for
describing network services as a set of endpoints operating on messages containing either
document-oriented or procedure-oriented information. The operations and messages are
described abstractly, and then bound to a concrete network protocol and message format to
define an endpoint. Related concrete endpoints are combined into abstract endpoints
(services). WSDL is extensible to allow description of endpoints and their messages regardless
of what message formats or network protocols are used to communicate, however, the only
bindings described in this document describe how to use WSDL in conjunction with SOAP 1.1,
HTTP GET/POST, and MIME." In other words, the WSDL defines a URL endpoint that publishes
objects and methods usable against the publishing application. These objects and methods
can then be used to communicate to that application.


1.1.1.4.1.1. Basic operations in WSDL files

Each Web Service that Service Manager publishes has a set of valid operations that an
administrator can enable or disable for custom Web Services clients. The list of valid Web
Service operations comes from two sources:

     The Document Engine display actions defined for each Service Manager table
     The common operations available to all Web Services

The <Operation Name> is the alias name of the Service Manager display option as defined in
the Web Services Configuration Utility. The <Object Name> is the alias name of the Service
Manager table as published in the Web Service. Use a Request message to send SOAP
operations to the Service Manager server. The Service Manager server uses a Response
message to send its reply to the SOAP operation.

You can see the list of available Document Engine display actions for each table in the
extaccess table. The Service Manager server converts each published display action into a
separate <operation> element in the Web Services Definition Language (WSDL).

For example, the Resolve operation for the Incident object translates to the
ResolveIncidentRequest SOAP message. The Service Manager server replies with a
ResolveIncidentResponse SOAP message. Any custom Web Services client you create must be
able to generate these SOAP message requests and understand the SOAP message response.

In addition to application-specific display actions, there are common operations available to all
Service Manager Web Services objects. Just as with display options, the Service Manager
server converts each common operation into a separate <operation> element in the Web
Services Definition Language (WSDL). The following common messages are always available.

     Retrieve<Object>Request – retrieves a single record detail matching the value of the
     <keys> element or query attribute, for example an Incident record.
     Retrieve<Object>KeysList – retrieves a list of keys matching the value of query attribute.
     Retrieve<Object>List – retrieves a list of objects matching the value of query attribute.

The following common messages but aren't always available.

     Update<Object>Request – updates a single record matching the value of the <keys>
     element or query attribute with the new values defined in the <instance> element
     Delete<Object>Request * – deletes a single record matching the value of the <keys>
     element
     Create<Object>Request – adds a single record with the values defined in the <instance>
     element

     The IncidentManagement Web Service doesn't offer the delete operation. To retrieve a
     single incident record, you can use the RetrieveIncident operation.


For more information about Web Services and WSDL, see the W3C Web site.


1.1.1.4.1.2. Service Manager WSDL files

You can view the Web Services Description Language (WSDL) for any Service Manager Web
Service by navigating to one of the following URLs:

Version                                 URL                        Supports

Backwards compatibility for             http://<servername>:       MIME attachments
                                        <port_number>/sc62server/
ServiceCenter 6.2 servlet               PWS/<service_name>.wsdl
mode

Service Manager                         http://<servername>:       MTOM attachments

                                        <port_number>/SM/7/<serv

                                        ice_name>.wsdl

For example, type http://myserver:13080/SM/7/IncidentManagement.wsdl to view the Incident
Management service WSDL from myserver.

The server also responds to requests with ?WSDL as the file extension. For example,
http://myserver:13080/SM/7/IncidentManagement?wsdl

The Service Manager server automatically generates a WSDL whenever it receives an HTTP
get request for WSDL. Service Manager WSDLs use XML Schema definitions to describe literal
Web Services. Service Manager is able to serve two different versions of the WSDL for a given
service:

     ServiceCenter 6.2 WSDL files for backwards compatibility. The API described in these
     WSDL files is deprecated. See the ServiceCenter 6.2 documentation for more information.
     Service Manager WSDL . New applications should use this WSDL.

         Note

         To avoid receiving the "Invalid XML schema: Element <xs:import> is not allowed at
         this location under element <xs:schema>" error when viewing any multiple object
         WSDL (for example, ConfigurationManagement.wsdl), disable the validation in the
         SOAP tool you are using before loading the WSDL and creating a Web Service
         request.

The XML document which describes a particular Service Manager record (such as a Change or
Incident) is wrapped in an outer document called a "model". The model is nothing more than a
container for separating the actual data (the “instance” part) from the "keys" part, which is
metadata about the fields that make up the primary key of the object.


1.1.1.4.1.3. Types of Web Services in Service
Manager

The types of Web Services supported by Service Manager are as follows:

     Service Manager 9.x URL supporting the W3C Message Transmission Optimization
     Mechanism (MTOM) attachments, which is a method of efficiently sending binary data to
     and from Web Services. MTOM is usually used with XML-binary Optimized Packaging
     (XOP).
     http://<SM Server>:<SM port>/SM/7/<service name>.wsdl

                   Note

                AXIS2 supports MTOM.

     Service Manager 9.x URL supporting Multipurpose Internet Mail Extensions (MIME),
     which is an Internet standard that extends the format of email to support MIME
     attachments. MIME's use has grown beyond describing the content of email to describing
     content type in general, including for the Web.
     http://<SM Server>:<SM port>/sc62server/PWS/<service name>.wsdl

Which URL to use depends on the consumer side. You also need to consider whether it
supports MTOM or MIME. For example, Microsoft applications tend to support MIME.


1.1.1.4.1.4. WSDL document structure

A WSDL document is simply a set of definitions. There is a definitions element at the root and
definitions inside. A WSDL document defines services as collections of network endpoints or
ports. In a WSDL document, the abstract definition of endpoints and messages is separated
from their concrete network deployment or data format bindings. This allows the reuse of
abstract definitions: messages, which are abstract descriptions of the data being exchanged,
and port types which are abstract collections of operations. The concrete protocol and data
format specifications for a particular port type constitutes a reusable binding. A port is defined
by associating a network address with a reusable binding. A collection of ports defines a
service.

A WSDL document uses the following elements in the definition of network services:

     Types: a container for data type definitions using some type system (such as XSD).
     Message: an abstract, typed definition of the data being communicated.
     Operation: an abstract description of an action supported by the service.
     Port Type: an abstract set of operations supported by one or more endpoints.
     Binding: a concrete protocol and data format specification for a particular port type.
     Port: a single endpoint defined as a combination of a binding and a network address.
     Service: a collection of related endpoints.

XML header

The XML header specifies the XML version number, and optionally the character encodings, as
part of a grammar document's XML declaration on the first line of the document.

  <?xml version="1.0" encoding="UTF-8" standalone="yes" ?>

Namespace definitions

XML namespaces are used for providing uniquely named elements and attributes in an XML
document

The following section of the Service Manager IncidentManagement wsdl shows the
namespace definitions.


  - <definitions targetNamespace="http://servicecenter.peregrine.com/PWS"
  xmlns="http://schemas.xmlsoap.org/wsdl/"
  xmlns:cmn="http://servicecenter.peregrine.com/PWS/Common"
  xmlns:http="http://schemas.xmlsoap.org/wsdl/http/"
  xmlns:mime="http://schemas.xmlsoap.org/wsdl/mime/"
  xmlns:ns="http://servicecenter.peregrine.com/PWS"
  xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
  xmlns:xsd="http://www.w3.org/2001/XMLSchema"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://schemas.xmlsoap.org/wsdl/
  http://schemas.xmlsoap.org/wsdl/">

Operation section

The following section of the example Service Manager IncidentManagement wsdl shows the
operation section used to define each individual action supported by the service.

  - <operation name="RetrieveIncident">
  <documentation />
  <input message="ns:RetrieveIncidentRequest" />
  <output message="ns:RetrieveIncidentResponse" />
  </operation>
  </portType>

Messages section

The following section of the example Service Manager IncidentManagement wsdl shows the
messages section used to define the data being communicated.

  - <message name="RetrieveIncidentRequest">
  <part element="ns:RetrieveIncidentRequest"
  name="RetrieveIncidentRequest" />
  </message>
  - <message name="RetrieveIncidentResponse">
  <part element="ns:RetrieveIncidentResponse"
  name="RetrieveIncidentResponse" />
  </message>
  </message>

Types section

The following section of the example Service Manager IncidentManagement wsdl shows the
definition of the data, including data types, that's being communicated between the consumer


and Service Manager.


- <types>
- <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"
attributeFormDefault="unqualified" elementFormDefault="qualified"
targetNamespace="http://servicecenter.peregrine.com/PWS"
version="2007-04-14 Rev 1"
xmlns="http://servicecenter.peregrine.com/PWS"
xmlns:cmn="http://servicecenter.peregrine.com/PWS/Common">
<xs:import namespace="http://servicecenter.peregrine.com/PWS/Common"
schemaLocation="http://server:13080/sc62server/PWS/Common.xsd" />
- <xs:complexType name="IncidentKeysType">
- <xs:sequence>
<xs:element minOccurs="0" name="IncidentID" nillable="true"
type="cmn:StringType" />
</xs:sequence>
<xs:attribute name="query" type="xs:string" use="optional" />
</xs:complexType>
- <xs:complexType name="IncidentInstanceType">
- <xs:sequence>
<xs:element minOccurs="0" name="IncidentID" nillable="true"
type="cmn:StringType" />
- <xs:element minOccurs="0" name="IncidentDescription">
- <xs:complexType>
- <xs:complexContent>
- <xs:extension base="cmn:ArrayType">
- <xs:sequence>
<xs:element maxOccurs="unbounded" minOccurs="0"
name="IncidentDescription" type="cmn:StringType" />
</xs:sequence>
</xs:extension>
</xs:complexContent>
</xs:complexType>
</xs:element>
- <xs:complexType name="IncidentModelType">
- <xs:sequence>
<xs:element name="keys" type="IncidentKeysType" />
<xs:element name="instance" type="IncidentInstanceType" />
<xs:element minOccurs="0" name="messages" type="cmn:MessagesType" />
</xs:sequence>
<xs:attribute name="query" type="xs:string" use="optional" />
</xs:complexType>
- <xs:element name="RetrieveIncidentRequest">
- <xs:complexType>
- <xs:sequence>
<xs:element name="model" type="IncidentModelType" />


  </xs:sequence>
  <xs:attribute name="attachmentInfo" type="xs:boolean" use="optional" />
  <xs:attribute name="attachmentData" type="xs:boolean" use="optional" />
  <xs:attribute default="true" name="ignoreEmptyElements"
  type="xs:boolean" use="optional" />
  </xs:complexType>
  </xs:element>
  - <xs:element name="RetrieveIncidentResponse">
  - <xs:complexType>
  - <xs:sequence>
  <xs:element name="model" type="IncidentModelType" />
  <xs:element minOccurs="0" name="messages" type="cmn:MessagesType" />
  </xs:sequence>
  <xs:attribute name="status" type="cmn:StatusType" use="required" />
  <xs:attribute name="message" type="xs:string" use="required" />
  <xs:attribute name="schemaRevisionDate" type="xs:date" use="required"
  />
  <xs:attribute name="schemaRevisionLevel" type="xs:int" use="required"
  />
  <xs:attribute name="returnCode" type="xs:decimal" use="optional" />
  <xs:attribute name="query" type="xs:string" use="optional" />
  </xs:complexType>
  </xs:element>
  </types>

Nillable attribute

The nillable attribute specifies whether or not an explicit NULL value can be assigned to the
element. True enables an instance of the element to have the NULL attribute set to true. The
NULL attribute is defined as part of the XML Schema namespace for instances. The default is
false. This attribute is optional.
The nillable attribute is analogous to the SQL concept of NULL and is useful for dealing with
the ambiguity that may otherwise surround an empty XML element value. With SQL there is a
difference between a NULL value and a column containing a varchar of length zero. Similarly,
in an XML schema there is a difference between an XML element containing no text value and
one which is explicitly marked with xsi:nil=”true”.
Unless the XML schema indicates that an XML element is nillable, you can't specify the nillable
attribute for the element.
The following sample code with the nillable attribute can be found in the schema definition
section:


  <xs:element minOccurs="0" name="IncidentID" nillable="true"
  type="cmn:StringType" />

Port type

The port defines the connection point to a Web Service. The follow section of the example
Service Manager IncidentManagement WSDL shows the port type section, which includes the
set of operations allowed by the endpoint.

  - <portType name="IncidentManagement">

Binding section

The following section of the example Service Manager IncidentManagement WSDL shows the
binding section used to define a protocol and defined data formats for a particular port type.

  - <binding name="IncidentManagement" type="ns:IncidentManagement">
  <soap:binding style="document"
  transport="http://schemas.xmlsoap.org/soap/http" />
  - <operation name="RetrieveIncident">
  <soap:operation soapAction="Retrieve" style="document" />
  - <input>
  <soap:body use="literal" />
  </input>
  - <output>
  <soap:body use="literal" />
  </output>
  </operation>
  - <operation name="RetrieveIncidentKeysList">
  <soap:operation soapAction="RetrieveKeysList" style="document" />
  - <input>
  <soap:body use="literal" />
  </input>
  - <output>
  <soap:body use="literal" />
  </output>
  </operation>
  </binding>

Service section

The Service section describes one or more concrete endpoints where the functionality of the
service can be found.


The following example Service Manager IncidentManagement WSDL shows the service
section, which is a collection of endpoints (In this example, just IncidentManagement).

  - <service name="IncidentManagement">

Port section

The following section of the example Service Manager IncidentManagement WSDL shows the
port section, which is a single endpoint defined as a combination of a binding and a network
address.

  - <port binding="ns:IncidentManagement" name="IncidentManagement">
  <soap:address location="http://server:13080/sc62server/ws" />
  </port>
  </service>
  </definitions>


1.1.1.4.1.5. Change example to use the cookie

To change the Keep-Alive example to use the cookie, you can modify the following methods.
The createService() method in the IncidentManagementServiceUtility.java file:

  public static IncidentManagementStub createService(Map arguments)
  throws Exception
  {
  String host = (String) arguments.get(ARGUMENT_HOST);
  String port = (String) arguments.get(ARGUMENT_PORT);
  String address = "http://" + host + ":" + port + "/SM/7/ws";
  IncidentManagementStub stub = new IncidentManagementStub(address);
  stub._getServiceClient().getOptions().setManageSession(true);
  stub._getServiceClient().getOptions().setProperty
  (HTTPConstants.REUSE_HTTP_CLIENT,true);
  // set connection: close
  //Header hdr = new Header(HTTPConstants.HEADER_CONNECTION,
  HTTPConstants.HEADER_CONNECTION_CLOSE);
  //ArrayList<Header> headers = new ArrayList<Header>();
  //headers.add(hdr);
  //stub._getServiceClient().getOptions().setProperty
  (HTTPConstants.HTTP_HEADERS, headers);
  stub._getServiceClient().getOptions().setProperty
  (Constants.Configuration.ENABLE_MTOM,
  Constants.VALUE_TRUE);
  ServiceUtility.initServiceAuthentication(stub, arguments);
  return stub;
  }

The createIncidents() method in the CreateIncidentSample.java file:


  public void createIncidents() throws Exception, IOException
  {
  /* Open a port to the Incident Management Web Service */
  IncidentManagementStub stub =
  IncidentManagementServiceUtility.createService(arguments);
  int totalIM = 10;
  /* Create details about the new incident */
  for (int i = 1; i <= totalIM; i++)
  {
  if (i == totalIM)
  {
  // close the connection if this is the last request
  Header hdr = new Header(HTTPConstants.HEADER_CONNECTION,
  HTTPConstants.HEADER_CONNECTION_CLOSE);
  ArrayList<Header> headers = new ArrayList<Header>();
  headers.add(hdr);
  stub._getServiceClient().getOptions().setProperty
  (HTTPConstants.HTTP_HEADERS, headers);
  }
  createIncident(stub);
  }
  return;
  }

The client is responsible for echoing back this value in a Cookie header in all subsequent POST
requests. If the client fails to do this, the servlet container will quickly run out of sessions.
If a client request causes any Service Manager Server error or exception then this session will
be terminated by the Service Manager Server. Once this happens the current JSESSIONID
becomes invalid and a new JSESSIONID will be returned on the following client request. The
SOAP client should echo back the new JSESSIONID for the subsequent requests to avoid the
user login/logout overhead and dangling sessions saturation.


1.1.1.4.1.6. Example: Use Keep-Alive with .Net
Web Services Studio

To use Keep-Alive with .Net Web Services Studio, perform the following actions.
First, make the following configurations:

     set "AllowWriteStreamBuffering" to True
     set "BasicAuthUsername" to falcon
     set "KeepAlive" to True
     set "UserCookieContainer" to True

Next, execute a RetrieveIncident action and search for the incident with the number IM1001.

     When you click Send, the "Set-Cookie" and "Connection" headers can be seen in the
     response window.
     Click Send again, only the "Connection" header can be seen in the response.

In the sm.log, these two requests (one per send) will belong to one session, meaning they have
the same Process ID (Thread ID) combination.


  2052( 6096) 05/05/2008 15:30:31 RTE I Using "utalloc" memory manager
  2052( 6096) 05/05/2008 15:30:31 RTE I Process sm 7.01.048
  System: 13080 (0x784dfb00) on PC running Windows
  XP Professional (5.1 Build 2600) from server (127.0.0.1)
  2052( 6096) 05/05/2008 15:30:31 RTE I Connected to SOAP client
  at 127.0.0.1
  2052( 6096) 05/05/2008 15:30:31
  RTE I Attaching to resources with key 0x784dfb00
  2052( 6096) 05/05/2008 15:30:31
  RTE I Info: SQL State: 01000-5701
  Message: [Microsoft][SQL Native Client][SQL Server]Changed database
  context to 'sm701'.
  2052( 6096) 05/05/2008 15:30:31 RTE I Info: SQL State: 01000-5703
  Message: [Microsoft][SQL Native Client][SQL Server]Changed language
  setting
  to us_english.
  2052( 6096) 05/05/2008 15:30:31 RTE I sqmssqlExec info statement= SQL
  CONNECT
  2052( 6096) 05/05/2008 15:30:31 RTE I Connection established to
  dbtype 'sqlserver' database 'sm701' user 'sm7'
  2052( 6096) 05/05/2008 15:30:31 RTE I Connected to Data source
  'sm701' SQL server 'server\SQLEXPRESS' version: 9.0.3042
  Using database 'sm701' as user 'sm7'
  2052( 6096) 05/05/2008 15:30:31 RTE I MS SQL Server collation
  'Latin1_General_BIN', varchar codepage 1252, comparison 0:
  case sensitive, accent sensitive
  2052( 6096) 05/05/2008 15:30:31 RTE I Thread
  912DAAD51D1B0A53B251147F6665B7EE initialization done.

First execution of .Net Web Services Studio

The following codes show an example of the first execution of code when using Keep-Alive
with .Net Web Services Studio.


2052( 6096) 05/05/2008 15:30:31 RTE D Parsing request document:
<?xml version="1.0" encoding="utf-8"?><soap:Envelope
xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
xmlns:xsd="http://www.w3.org/2001/XMLSchema"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
<soap:Body>
<RetrieveIncidentRequest
xmlns="http://servicecenter.peregrine.com/PWS">
<model query="">
<keys query="">
<IncidentID/>
</keys>
<instance query="" recordid="" uniquequery="">
<IncidentID>IM1001</IncidentID>
</instance>
<messages>
<message xmlns="http://sc62server/PWS/Common"
module=""/>
</messages>
</model>
</RetrieveIncidentRequest>
</soap:Body>
</soap:Envelope>
2052( 6096) 05/05/2008 15:30:31 RTE D Done parsing request document
2052( 6096) 05/05/2008 15:30:31 RTE D doCardinalOperation entered for
SOA Mode 2 operation 1 - Retrieve
2052( 6096) 05/05/2008 15:30:31 RTE D Calling loginAuthenticate
with user=falcon and password=########
2052( 6096) 05/05/2008 15:30:31 RTE D Authentication succeeded
2052( 6096) 05/05/2008 15:30:31 RTE D Calling agend()
2052( 6096) 05/05/2008 15:30:31 RTE D Calling agstart()
2052( 6096) 05/05/2008 15:30:31 RTE D Calling login with user=falcon
and password=########
2052( 6096) 05/05/2008 15:30:32 RTE I User falcon logged in.
Already licensed
2052( 6096) 05/05/2008 15:30:32 RTE D Login succeeded
2052( 6096) 05/05/2008 15:30:32 RTE D Setting uname to falcon
2052( 6096) 05/05/2008 15:30:32 RTE D Operation will be carried out
on
file probsummary
2052( 6096) 05/05/2008 15:30:32 RTE D doQuery using query string
number="IM1001"
2052( 6096) 05/05/2008 15:30:33 RTE D doGet query returned 1


  2052( 6096) 05/05/2008 15:30:33 RTE D SOA revision time is 2005-03-15
  2052( 6096) 05/05/2008 15:30:33 RTE D SOA revision level is 0

Second execution of .Net Web Services Studio

The following codes show an example of the second execution of code when using Keep-Alive
with .Net Web Services Studio.

  2052( 6096) 05/05/2008 15:33:40 RTE D Parsing request document:
  <?xml version="1.0" encoding="utf-8"?><soap:Envelope
  xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:xsd="http://www.w3.org/2001/XMLSchema"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <soap:Body>
  <RetrieveIncidentRequest
  xmlns="http://servicecenter.peregrine.com/PWS">
  <model query="">
  <keys query="">
  <IncidentID/>
  </keys>
  <instance query="" recordid="" uniquequery="">
  <IncidentID>IM1001</IncidentID>
  </instance>
  <messages>
  <message xmlns="http://servicecenter.peregrine.com/PWS/Common"
  module=""/>
  </messages>
  </model>
  </RetrieveIncidentRequest>
  </soap:Body>
  </soap:Envelope>
  2052( 6096) 05/05/2008 15:33:40 RTE D Done parsing request document
  2052( 6096) 05/05/2008 15:33:40 RTE D doCardinalOperation entered for
  SOA Mode 2 operation 1 - Retrieve
  2052( 6096) 05/05/2008 15:33:40 RTE D User falcon is already logged
  in for this process - skipping login processing
  2052( 6096) 05/05/2008 15:33:40 RTE D Operation will be carried out
  on file probsummary
  2052( 6096) 05/05/2008 15:33:40 RTE D doQuery using query string
  number="IM1001"
  2052( 6096) 05/05/2008 15:33:40 RTE D doGet query returned 1
  2052( 6096) 05/05/2008 15:33:41 RTE D SOA revision time is 2005-03-15
  2052( 6096) 05/05/2008 15:33:41 RTE D SOA revision level is 0
````
