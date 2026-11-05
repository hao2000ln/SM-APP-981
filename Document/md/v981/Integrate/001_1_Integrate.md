---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1 .. 1.1.1.1
printed_pages: 1-21
---

# 1 Integrate

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1. Integrate

You can extend the services available to your Service Manager installation by setting up
integration with other products. Out-of-the-box, Service Manager allows you to integrate the
following products without needing any additional integration software.

OpenText integrations

You can integrate Service Manager with the following OpenText products.

     Application Lifecycle Management (ALM)
     ALM Octane
     Application Performance Management (APM)
     Operations Bridge Manager (OBM)
     Operations Orchestration (OO)
     Project and Portfolio Management Center (PPM)
     Service Management Automation X (SMAX)
     UCMDB

Third-party integrations

You can integrate Service Manager with the following third-party products.

     Atlassian Jira
     SAP Solution Manager
     Microsoft Teams
     Third-party survey tools

You can also integrate data from other sources using tools such as Connect-It, SCAuto, Web
Services API, and Case Exchange. Contact the software support for information or instructions
on integrating data from sources outside of Service Manager.

Related topics

Integration Manager
UCMDB
Operations Orchestration (OO)
Application Performance Management (APM)
Computer Telephony Integration (CTI) with the Web client
Web Services
Dynamic Data Exchange (DDE)
Case Exchange framework


1.1. Service Manager integration methods and
tools

In addition to the integrations provided by Service Manager and other OpenText products, you
can use several utilities and methodologies to create your own Service Manager integrations.

Method or Tool                                                                                   Service Manager 9.81
Web Services
                                        Description
Connect-It (CIT)
ServiceCenter Automation (SCAuto)       Allows you to connect to and consume
Event Services                          external Web Services and to publish
Dynamic Data Exchange (DDE)             Service Manager tables as Web Services.
                                        For example, you might use web services to
                                        query external Web Services to validate an
                                        email address or a phone number when
                                        updating a contact record or automatically
                                        perform an Internet search using the brief
                                        description of the Service Desk interaction.

                                        Provides connectors that synchronize static
                                        data elements by simple data copying and
                                        by data transformation from source to
                                        destination. For example, you could use
                                        Connect-It to synchronize employee data
                                        from Asset Manager to Service Manager
                                        through Web Services.

                                        Consists of a collection of automation
                                        products that enable external applications
                                        to integrate with Service Manager. For
                                        example, you might use SCAuto to open
                                        records, notify someone that their record
                                        has closed, or manage email between
                                        external mail programs.

                                        Is a background processor that Service
                                        Manager uses to receive information
                                        generated from and to send information
                                        back to external systems. exchange of
                                        dynamic, "event-based" information. For
                                        example, you must use Event Services with
                                        JavaMail, Connect-It, SCMail, and SCAuto.

                                        Provides DDE client support in a Service
                                        Manager RAD (Rapid Application
                                        Development) application. For example, you
                                        might create a script to call Service
                                        Manager from a Windows application such
                                        as Microsoft® Excel.

 Method or Tool                                                                                  Service Manager 9.81
 BDM Mapping Management
                                        Description
Related topics
                                        Allows you to configure BTO Data Modle
Field Mapping                           (BDM) mapping records. BDM is intended to
Value Mapping                           be used as a standard data model for
Atom Mapping                            integrations between BTO products, for
                                        example, Service Manager and Application
                                        Performance Management (APM). In
                                        Service Manager, a BDM mapping is a
                                        mapping between a Service Manager object
                                        (associated with a file in Service Manager)
                                        and a BDM object (predefined in BDM). A
                                        BDM mapping consists of three parts: field
                                        mapping, value mapping, and atom
                                        mapping.


1.1.1. Web Services

Service Manager Web Services provide interoperability between software applications running
on disparate platforms. By using Simple Object Access Protocol (SOAP) technology to
establish a standard messaging framework, web services enable developers to access objects
within multiple and customized data fields. Open architecture allows for real-time integration
and exposure of objects to external applications.

Key features and benefits:

     Uses open standards and protocols
     Allows reuse of services and components
     Can combine multiple web services
     Uses HTTP/HTTPS to work through common firewall security measures without requiring
     changes to the firewall filtering rules
     Facilitates open integration to other systems
     Provides a standard framework with a consistent and dynamic application program
     interface (API) architecture for process-based integration

Related topics

Capability words


1.1.1.1. Service Manager Web Services

Service Manager Web Services provide the ability to communicate and integrate with
applications in an open and efficient manner. Web Services provide the ability to use a third-
party application inside Service Manager, manipulate Service Manager data inside your custom
application, or transfer data among separate Service Manager systems.


1.1.1.1.1. What's a Web Service?

The formal definition (according to www.w3c.org) is that a Web service is a software
application identified by a Uniform Resource Identifier (URI), whose interfaces and binding are
capable of being defined, described, and discovered by XML artifacts and supports direct
interactions with other software applications using XML-based messages via Internet-based
protocols.

A Web service is a software system designed to support interoperable application to
application interaction over a network. It has an interface described in a machine-processable
format (specifically WSDL). Other systems interact with Web Services in a manner prescribed
by its description using SOAP messages, typically conveyed using HTTP with an XML
serialization in conjunction with other Web-related standards.

There are two major classes of Web Services:

     REST-compliant Web Services: The primary purpose of the service is to manipulate XML
     representations of Web resources using a uniform set of "stateless" operations.
     Arbitrary Web Services: The service may expose an arbitrary set of operations.

Both these Web Services use URIs to identify resources and use Web protocols (such as HTTP
and SOAP) and XML data formats for messaging.


1.1.1.1.1.1. Understand the Service Manager
Web Services

Every Web service published by Service Manager is a document-literal service. The
documents which are used for the requests and replies are derived from the dbdict definition
of a single Service Manager file and published via the fields section of the extaccess record.

Each field in the Service Manager data model must be understood in the context of the
business logic for the application that defines the data. Before approaching any Web Services
consumption project, it is important to understand the data model that's implemented within
the Service Manager instance you are targeting. Because Service Manager allows you to add
new fields, change the validation of fields or make fields mandatory, every Service Manager
implementation will have a slightly different data model and business logic, and each difference
has to be reflected in the published Web Service to ensure successful processing.

Web service definitions are maintained in the Web Service Configuration Utility. In this utility,
you can see how file names such as probsummary are aliased to Incident, how fields within
files can be exposed for purposes of Web Services; and how they are aliased to more
appropriate names. Finally, the Web Service Configuration Utility is where XML schema data
types such as dateTime can be applied to individual fields. The default type is string, but
Service Manager fields can be mapped to various XML schema types if needed.


1.1.1.1.1.2. Web Services basics

The basic Web Services architecture includes the following:

     Publishing - Publishing a Web Service means enabling a Web Service user (consumer) to
     locate the service description and instructing the consumer how they should interact with
     the Web Service.
     Consuming (client) - A client is software that's able to use (consume) a Web Service. A
     service consumer issues one or more queries to the directory to locate a service and
     determine how to communicate with that service.
     Service - A collection of EndPoints that provides the servicing of the consumers request.
     EndPoint (port) - An EndPoint indicates a specific location for accessing a Web Service
     using a specific protocol and data format.


1.1.1.1.1.3. Add or change Web Services

Follow these steps:

   1. Modify an existing extaccess record if the Web Service connecting through it needs to
     get additional information or add a new extaccess record if you want to expose a table to
     a new Web Service and don't want to interfere with existing Web Service applications.

                   Note

                Writing expressions in extaccess: The extaccess tool uses the same file
                variables as the Document Engine. For example, a file variable that holds the
                current record is $L.file, and the copy of the record before modifications is
                $L.file.save.

   2. For SOAP, rebuild or build the Service Object by re-running WSDL2JS if Service Manager
     is the consumer.

   3. Modify the calling applications if actions, field names, or object name have changed, and
     a calling application refers to them.


1.1.1.1.2. Introduction to Web Services in
Service Manager

The published out-of-box ITIL®-based processes for Web Services are:

     Service Desk
     Incident Management
     Problem Management
     Knowledge Management
     Configuration Management
     Change Management
     Service Catalog
     Service Level Management
     Request Fulfillment

            Note

           Table-based Web services are still available in Service Manager when needed.
           Each Web Service application can have a “different view” of the defined services,
           but the underneath logical flow is still controlled by same Service Manager
           applications. To avoid validation failure, make sure all the required fields are always
           exposed.

To publish a Service Manager Web Service, you create one extaccess record per table that you
want to publish in that service. Each Web Service application can have a different view of the
defined services but the underneath logical flow is still controlled by same Service Manager
applications. To avoid validation failure, make sure all the required fields are always exposed
on all extaccess records for the table. To add or modify an extaccess record:

Click Tailoring > Web Services > Web Service Configuration.

For SOAP, you may need the allowwsdlretrieval parameter in the sm.ini to be able to view
Service Manager WSDL.

            Caution

           Changes to a specific extaccess record affect any client that's currently
           consuming the Web Service created by that record. If you modify this
           configuration, be sure to test all other applications that consume the same Web
           Service and address possible issues immediately. To avoid issues stemming from
           different applications using the same Web Service, create a unique extaccess
           record for each Web Service application, so that each application has a unique
           Web Service to consume. A single table can be represented in multiple extaccess
           records.


1.1.1.1.2.1. Web Services and Service Manager

A Web Service enables one application to access the functionality of another application using
SOAP operations (XML-based transactions) or RESTful operations, regardless of differences in
their operating system platform, application language, or tool set. Service Manager supports
two types of Web Services features:

     Connecting to and consuming external Web Services
     Publishing Service Manager fields and methods as Web Services

For SOAP, the Service Manager server now offers out-of-box functionality to connect to and
consume external Web Services. When you connect to an external Web service, Service
Manager retrieves the Web Service Description Language (WSDL) for the service. You can
then write custom JavaScript to use JavaScript functions generated by Web Services and send
and receive messages to the remote Web Services. For example, you might query external
Web Services to:

     Validate an email address or a phone number when updating a contact record.
     Automatically fill in the time zone of a contact in a Service Desk interaction based on the
     location given.
     Automatically perform a search for solutions using the brief description of the Service
     Desk interaction.

The out-of-box Service Manager includes a bundle of published tables, fields, and display
actions collectively known as the Service Manager Web Services. The Service Manager Web
Services includes Web Services for all the applications and uses an ITIL-compliant naming
convention to refer to the Web Service object. The use of ITIL-compliant service and object
names allows Web Services developers to create custom Web Services without needing to be
familiar with the Service Manager database layer. To consume Service Manager tables, fields,
and display actions, you must grant an operator the SOAP API or RESTful API capability word.

You can use the Service Manager Web Services to integrate applications and automate
transactions. For example, you might want to publish a Web Service that enables another
application or process to:

     Automatically open, update, escalate, resolve, or close Service Manager incidents.
     Automatically add or update a configuration item.

In addition to the tables, fields, and display actions available though the Service Manager Web
Services, you can customize the Web Services available from Service Manager by adding,
changing, or removing your own tables, fields, and display actions. When you customize the
Web Services, Service Manager creates a new version of the Service Manager Web Services.
Afterwards, any custom Web Services clients you create access this new version of the Web
Service.


1.1.1.1.2.2. Web Services naming conventions
for SOAP

The request and response names use the literal strings of the Action Name and Object Name
defined in the extaccess record. The name of the Request and Response methods within
Service Manager’s Web Services are constructed by combining the Action Name with the
Object Name and Request or Response.

            Note

           These names are case sensitive.

For example, the method to add a new incident to the system is:

Action Name  Object Name                Request                  Response
Create       Incident
                                        CreateIncidentRequ CreateIncidentResp

                                        est                      onse

If your Object Name for the Incident object starts with a lower case “i” (incident) the request is
CreateincidentRequest and the response is CreateincidentResponse.


1.1.1.1.2.3. Web Services security
considerations

The Service Manager server requires that each Web Service request provide a valid operator
name and password combination. These must be supplied in a standard HTTP Basic
Authorization header. The Web Service toolkits universally support this authentication
mechanism. Use SSL if you are concerned about the possibility of someone using a network
monitoring tool to discover passwords. Basic Authorization by itself doesn't encrypt the
password; it simply encodes it using Base 64.

            Note

           Only ASCII operator names are supported in Service Manager Web Service
           integrations. When Service Manager is handling an incoming Web Service request,
           the authorization string is decoded by BASE64Decoder. Service Manager uses the
           decoded string value to construct a UTF-8 string that's used in the RTE. However,
           the authorization string is in the header and Service Manager doesn't know the
           charset or encoding of the underling string value, which is BASE64 encoded.
           Therefore, if the underlying string value is not UTF-8, Web Service clients will fail
           to connect to Service Manager. In Service Manager, when fetching an operator
           from the database, no matter what collation the database uses, the operator finally
           will get a UTF-8 operator value. However, even if users put the same value in the
           authorization header, the operator name may differ because of the
           charset/encoding issue.

In addition to having a valid login, the operator must have the SOAP API or RESTful API
capability word to access the Web Services. If the Web Service request doesn't contain valid
authorization information, then the server sends a response message containing 401
(Unauthorized) . If the request is valid, then the server sends a response message containing
the results of your Web Services operation. The response message contains only the
information the operator is allowed to see. The security settings of the user's profile,
Mandanten security settings, and conditions defined in the Document Engine are maintained
by all Web Services.


1.1.1.1.2.4. Valid URLs for Service Manager

The Service Manager publishes two different URLs for SOAP:
http://<server>:<port>/SM/7
This URL contains similar functionality as sc62server/PWS, except that it uses MTOM
attachments.
http://<server>:<port>/sc62server/PWS
This URL provides complete functionality and despite the name sc62server, it is a fully
implemented Service Manager7 Web Services interface using MIME attachments.
The Service Manager also publishes below URLs for REST:
http://<server>:<port>/SM/9/rest


1.1.1.1.2.5. Service Manager Web Services
URLs

Service Manager support the Web Services at both URLs for SOAP API. If you already use the
SC62 server , continue to use it. If you are starting to create a new Web service, use the SM/7
server. You can continue to use the methods, which are still applicable other than the following.

     Any new objects added to Service Manager 9.61, such as the new required fields in
     Incident Management, will not be available to existing Web Services.
     If you have an SOA broker application, BPEL orchestration engine, or Web Services
     middleware application configured between the deployed SOAP client application and
     ServiceCenter or Service Manager application. If so, the orchestration scenario or
     middleware can be modified to work as a mediator between the old and the new version
     of the IncidentManagement WSDL.
     MIME – If you use the legacy Web Services URL, then the server uses MIME to encode
     attachments.
     MTOM/XOP – If you use the Service Manager Web Services URL, then the server uses
     MTOM/XOP to encode attachments.

Service Manager also supports one URL for RESTful API.


1.1.1.1.2.6. Configure the WSDL field definitions

Use the Web Service Configuration Utility to define the fields that will be passed from Service
Manager to the Web Service. The Service Manager fields are taken directly from the database
dictionary.

Field                                   Description
Service Name
                                        The name of the Web Service you want to
Released                                use to publish theService Manager table.
                                        You can reuse the same Web Service name
Name                                    to publish multiple tables. Since this name
Deprecated                              becomes part of a URL, the name must
Object Name                             consist of alphanumeric characters valid for
                                        URLs. The name can't consist of URL
                                        reserved characters such as spaces,
                                        slashes, or colons.

                                        You should consider any web service with
                                        the Released option selected as the
                                        supported version of the Web Service in
                                        Service Manager. While it is possible to
                                        clear the Released option and edit or delete
                                        the Web Service, we recommend that you
                                        assign the service a different name and
                                        work on that copy of the web service
                                        instead. When the Released option is
                                        selected, the external access definition
                                        remains read-only.

                                        The name of the Service Manager table that
                                        will be published as a Web Service.

                                        Web Services marked as deprecated aren't
                                        supported.

                                        The name you want to use to identify the
                                        Service Manager table in the Web service.
                                        Since this name becomes part of the WSDL,
                                        the name must consist of alphanumeric
                                        characters valid for XML. The name can't
                                        consist of XML reserved characters such as
                                        brackets (<) and (>), colons (:), or quotation
                                        marks (").


Allowed Actions tab field definitions

Use this tab to enter the Service Manager Document Engine display actions you want to
globally enable for this table.

Field                                   Description
Allowed Actions
Action Names                            Click to see the list of allowable display
                                        actions for the Service Manager table you
Action Type                             have selected for the Web Service.

                                        The name used to identify the display action
                                        in the Web service as an operation. Since
                                        this name becomes part of the WSDL, the
                                        name must consist of alphanumeric
                                        characters valid for XML. The name can't
                                        consist of XML reserved characters such as
                                        brackets (<) and (>), colons (:), or quotation
                                        marks (").

                                        The type for each of the Document Engine
                                        display actions that are defined for this
                                        table. Click the drop-down icon to see a list
                                        of valid type values.

                                             Create only actions will only create
                                             new records.
                                             Update only actions will only update
                                             existing records.
                                             Merge actions will update the record if
                                             it exists and create it if it doesn't exist.
                                             Application Pass Through actions will
                                             perform custom actions defined in
                                             External Access Actions.

Custom Action To...                     Create a custom action for the Service
                                        Manager table you have selected for the
                                        Web Service.

Expressions tab field definitions

Use this tab to enter system language expressions that run before the display action that runs
as part of the Web Service.


Field                                   Description
Expressions
                                        Call a custom action created in External
                                        Access Actions.

Fields tab definitions

Use this tab to set the fields, captions, and field types.

Field                                   Description
Field
                                        The Service Manager field name that's
Caption                                 published by the Web Services
Type                                    Configuration Utility.

                                        The name that Service Manager displays for
                                        the associated Field in the Web Service.

                                        The data type that the Web Services API
                                        will convert field data to for Web Services
                                        access.

RESTful tab field definitions

Use this tab to enter the RESTful API related configurations.

Field                                                                                            Service Manager 9.81
RESTful Enabled
Attachment Enabled                      Description
Resource Collection Name
Resource Name                           If it is selected, RESTful API is available for
Unique Keys                             this service. If it's not selected, RESTful API
                                        is unavailable for this service.
Max Records Returned in Query
Query Authorization                     If it is selected, attachment is supported by
Resource Collection Action              RESTFful API for this service. If it's not
Resource Actions                        selected, attachment is unsupported by
                                        RESTful API for this service.

                                        This is the name of the Resource Collection.
                                        For example, you may specify the group of
                                        incidents from the probsummary table as
                                        "incidents".

                                        This is the name of the individual Resource.
                                        For example, you may specify that any
                                        individual incident from the probsummary
                                        table be referred to as an "Incident".

                                        This field specifies one or more fields that
                                        will function as a unique identifier for a
                                        Resource from the Resource Collection. For
                                        example, {ID} in single resource query URI,
                                        http://<server>:
                                        <port>/SM/9/rest/incidents/{ID}

                                        This is the max number of records returned
                                        in every single query when the number of
                                        records is huge. By default, the value is
                                        1000.

                                        This is the query privilege for this service.

                                        This field represents the default action for
                                        resource collection.

                                        This field specifies the action to take when
                                        an individual resource is part of a
                                        POST, PUT, DELETE command. These
                                        actions are specified in the Allowed Actions
                                        tab of the External Access Definition.
````
