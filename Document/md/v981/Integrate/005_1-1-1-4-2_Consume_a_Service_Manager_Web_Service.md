---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.1.1.4.2 .. 1.1.1.4.2.10
printed_pages: 113-141
---

# 1.1.1.4.2 Consume a Service Manager Web Service

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.1.4.2. Consume a Service Manager Web
Service

A Service Manager Web service can be consumed by a custom client or by an application that
directly consumes Web Services, such as Service Manager or Connect-It.

General Information

A Web Service development tool kit that can generate a complete Web service application
from a .wsdl file is required to create a custom client that can access the Service Manager
Web service. A good understanding of Web Services and SOAP versions 1.1 or 1.2 is also
recommended.

            Note

           Service Manager users and application designers can choose any third-party Web
           Services development tool kit. However, Service Manager publishes only the WSDL
           files for the Web Service. Troubleshooting the client application is the responsibility
           of the application developer, and outside the scope of Service Manager Customer
           Support.

Use the steps below as a guide to create your custom Web Service client.

   1. Publish the Service Manager tables that you want your client to access. You can use the
     Service Manager Web Services out-of-the-box or customize the extaccess records to
     meet your needs.

   2. Obtain a Web Services client development tool that can create a complete Web Service
     application, such as Microsoft .NET or Apache Axis, or obtain a tool that generates a
     complete Web Service application by evaluating the target WSDL file.

   3. Browse to the URL of your Service Manager server and download the WSDL files for the
     services you want your custom clients to use. Use your Web Services client development
     tool to browse the WSDL and determine which features you want your custom client to
     use. The URL of your server must include the port and the Web service name.
     For example:
     http://<Service Manager server>:<httpPort (use a dedicated port, don't use loadBalancer
     port)>/SM/9/PWS/IncidentManagement.wsdl connects to the Service Manager server
     host on the specified port and requests the IncidentManagement WSDL.

   4. Use your Web Services client development tool to generate the programming language
     client code (classes) that will invoke the Service Manager Web services. Tools such as
     .NET wsdl.exe or Axis wsdl2java generate client code that can be used to invoke the
     Service Manager Web service from the WSDL. Your custom Web Services client invokes
     the client code rather than the WSDL directly.

   5. Write a client application in the appropriate language of your client development tool. For
     example, .NET requires either Microsoft Visual C# or Visual Basic®, and Axis requires


Java.


1.1.1.4.2.1. Dynamic and static Web Services
clients

Tools such as Visual Studio or .NET allow for simple creation of Web Service clients from a
WSDL. These clients are static Web Service consumers and have to be rebuilt every time the
WSDL changes. To get around the tedious work of rebuilding the client code for every WSDL
change (new fields, new methods, new objects), you can create dynamic Web Services clients.
These clients read the WSDL each time they use it and dynamically refer to the objects and
methods within.

When an external client consumes Service Manager data, the client code can be written for
dynamic or static WSDL consumption. When Service Manager consumes external data, it uses
static consumption always.

What happens if an exposed table is changed?

The WSDL for a service doesn't change automatically as a result of making tailoring changes
such as adding a new field to a table. Only if you include the new field in the Web Services API
by adding it to the extaccess record will the new field be exposed.

If you change the caption (alias name) by which a field is exposed in a Web Service, you are
going to have to modify and recompile any SOAP client applications which reference this field.
You can rename the internal Service Manager field names, even for fields which are exposed
via Web Services, without impacting deployed Web Services, as long as you don't change the
alias name by which the field is known to Web Services.

Finally, if you add a new field, make the new field a required field and you have previously
deployed Web Services applications which don't populate this field, you must provide tailoring
in the server to generate a valid default value for the field when a value is not provided.
Otherwise, inserts and updates via Web Services will fail because the new field has not been
populated when the record goes through validation.


1.1.1.4.2.2. Updating Service Manager tables

By design, the Service Manager server expects that the client application will specify only
those fields to be updated. It ignores missing or empty elements in the update request. If you
specify a new value to update a field and that field is an array, ensure that you match the
number of new values for the array elements to the number of existing array elements;
otherwise, the number of elements in the array will dynamically resize to contain only the new
values.
You can code a global attribute on the request element called ignoreEmptyElements and set it
to true or false. If you specify ignoreEmptyElements=false, any missing or empty element in
the update request causes the named field to be cleared to null values.
If you want to clear a specific field, specify xsi:nil=true as an element attribute.


1.1.1.4.2.3. Requirements for developing
custom Web Services clients

You can create custom Web Services clients to access the Service Manager Web Services API.
If you choose to create a custom Web Services client, ensure that you review the statement of
technical support for custom Web Services clients, and that you have the following skills and
tools:

     A good understanding of the W3C recommendation for SOAP version 1.1 or 1.2. Service
     Manager supports both versions, but recommends SOAP version 1.2.
     A Web Service development tool kit that can generate a complete Web service
     application from a .wsdl file.
     Familiarity with the debughttp server parameter and the HTTP.LOG it generates.

                   Note

                There are several Web services development tool kits that you can use to
                develop custom Web Services clients, such as Microsoft Visual Studio .NET™,
                Systinet WASP™, Glue™, Apache Axis™, or Sun Web Services Developer
                Pack™.

In order to support custom Web Services client connections to Service Manager you need:

     An installed Service Manager server instance (Your custom Web services clients can
     connect to the normal server listener port)
     A list of the Service Manager tables and actions you want to permit access to (you can
     grant or deny access from the extaccess table)


1.1.1.4.2.4. Checklist: Creating a custom Web
Services client

You can create custom Web Services client applications to connect and conduct transactions
with the Service Manager Web service. Any custom clients you create must be able to send
and receive from the Service Manager server valid SOAP messages.

   1. Publish the Service Manager tables to which you want the custom client to connect as
     Web Services. You can use Service Manager Web Services API out-of-the-box, or
     customize the Web Services to meet your business needs.

   2. Obtain a Web Services client development tool that can create a complete Web service
     application, such as Microsoft .NET™ or Apache Axis™, or obtain a tool that generates a
     complete Web Service application by evaluating the target WSDL file, such as
     GotDotNet™ WebServiceStudio™.

   3. Browse to the URL of your Service Manager server and download the WSDL files for the
     services you want your custom clients to use. Use your Web Services client development
     tool to browse the WSDL and determine which features you want your custom client to
     use.

                   Note

                The URL of your server must include the listener port and the Web service
                name. For example, http://smserver:13081/IncidentManagement.wsdl
                connects to the smserver host on port 13081 and requests the
                IncidentManagement WSDL.

                   Caution

                Do not use the Load Balancer listener port for all incoming Web Services
                requests. Instead, dedicate one or more Service Manager server processes to
                serve Web Services requests by adding the "debugnode" parameter to the
                process you wish to dedicate to serve Web Services requests.

   4. Use your Web Services client development tool to generate the programming language
     client code that invokes the Service Manager Web Services for the Service Manager Web
     Services. Tools such as .NET wsdl.exe or Axis wsdl2java can generate client code that
     can be used to invoke the Service Manager Web Service from the WSDL.

   5. Write a client application in the appropriate language of your client development tool. For
     example, .NET requires Microsoft C#™ or Visual Basic™; Axis requires Java.


                   Tip

                The Service Manager installation DVD contains source code for several
                sample Web Services client applications you can use as templates for your
                own custom clients. The source code includes Axis and .NET examples.

                   Note

                There are many Web Service application development tools available such as
                Microsoft Visual Studio .NET™, Systinet WASP™, Glue™, Apache Axis™, or Sun
                Web Services Developer Pack™. Service Manager users and application
                designers can choose any third-party tool with the understanding that the
                company publishes only the WSDL files for the web service. Troubleshooting
                the client application is the responsibility of the application developer, and
                outside the scope of Service Manager Customer Support.

Technical support for custom Web Services clients

Custom Web Services clients and any code or scripting that you add to interface with the
Service Manager products are outside the scope of the company's product suite and aren't
covered under maintenance and support contracts. Ensure that you have full access to the
appropriate resources to assist you with training, debugging, and maintaining any code that
you add to your Service Manager environment.

We provide a working example database and several sample Web Services clients that can
help you troubleshoot your custom clients and determine where errors occur.


1.1.1.4.2.5. Sample Web Services client for
sc62server PWS URL

The Service Manager server includes two sample Web Services client applications for the
http://servername:port_number/sc62server/PWS/service_name.wsdl. One was created for
Apache™ Axis and the other for Microsoft™ Visual Studio .NET. If you have one of these two
Web Services development tools installed, you can review and update the source code of the
sample applications as well as generate updated proxy code to test the Service Manager Web
Services functionality. The Apache Axis samples are written in Java while the Microsoft .NET
samples are written in C#. The sample client applications are included with the server
installation in the following folders:

     <Service Manager server installation folder>\webservices\sample\sc62webservices
           AxisSample
           DotNetSample

Each sample includes the source code for the client applications as well as support files for the
Web Services development environment. The Apache Axis sample also includes a library of
Axis jar files as well as batch files that you can use to run each class from the Windows
command prompt after you have compiled the sample Java. You can use the sample
applications as examples of how to create your own custom Web Services client applications.

            Note

           All the sample applications use a command line interface. To see the usage
           information for the command line interface, type: dotNetSample -example
           ClassName where ClassName is the name of the sample application class.

The Apache Axis sample client applications assume that you have a Service Manager server
instance running from the local host. If this is not the case, you can change the server host
name and port number using the sample's command line interface.

The Microsoft .Net sample client applications assume that you have a Service Manager server
instance running from the local host. If this is not the case, you can change the server host
name and port number using the sample's command line interface or from Visual Studio .NET's
Web reference URL.

            Caution

           To use attachments with .Net samples, you must install Microsoft Web Services
           Enhancements (WSE) 2.0 SP2. Be sure to select the "Visual Studio Developer"
           option during installation. If you add WSE2 after building the examples, you must
           delete the old reference files ("reference.cs" and "reference.map"), update the
           web references, and then rebuild the sample applications.


Each of the sample folders includes a readme file that contains valuable information about
using the sample application found in each of the sample folder.

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
                                             Provides the InitServiceforAttachments
                                             method to initialize the service to
                                             handle MIME attachments.

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
                                             Provides the InitServiceforAttachments
                                             method to initialize the service to
                                             handle MIME attachments.

                                        Resolves an incident record matching the
                                        supplied parameters.

                                        Retrieves multiple incident records
                                        matching the supplied parameters.

                                        Retrieves a single incident record matching
                                        the supplied parameters.

                                        Updates an incident record with the
                                        supplied parameters.


1.1.1.4.2.6. Command line arguments for the
.NET sample application

The .NET sample application runs from the Windows command prompt. After you have
compiled the .NET sample into an executable, you can perform configuration and incident
management tasks with the following arguments.

            Note

           To see the usage information for the .NET sample application, type dotNetSample -
           example ClassName where ClassName is the name of a sample application class.

The following commands invoke Configuration Management functionality.

Operation                               Command-line example
Create contact
                                        dotnetsample -example CreateContact -
Delete contact                          name sneveau -lastName Neveau -
Retrieve contact                        firstName Sophie -workPhone "(858) 481-
Update Contact                          5000" -extension 3573 -fullname "Sophie
                                        Neveau"

                                        dotNetSample -example DeleteContact -
                                        name sneveau -lastName Neveau -
                                        firstName Sophie

                                        dotNetSample -example RetrieveContact -
                                        name "FALCON, JENNIFER"

                                        dotNetSample -example UpdateContact -
                                        name "FALCON, JENNIFER" -workPhone "
                                        (858) 481-5000" -extension 3573

The following commands invoke Incident Management functionality.

Operation                                                                                        Service Manager 9.81
Close incident
Create incident                         Command-line example

Resolve incident                        dotNetSample -example CloseIncident -
Retrieve incident list                  incidentId IM10001 -closeCode "User
Retrieve incident                       Closer" -resolution "Problem disappeared"
Update incident
                                        dotNetSample -example CreateIncident -
                                        title ".NET sample brief description" -
                                        category incident -problemType "not
                                        specified" -description ".NET sample
                                        incident" -severity 1 -subCategory data -
                                        productType "storage limit exceeded" -
                                        initialImpact 1 -primaryAssignmentGroup
                                        "Operating System Support (South
                                        America)" -service "Printing (Africa)"

                                        dotNetSample -example ResolveIncident -
                                        incidentId IM10006 -resolution "Problem
                                        disappeared"

                                        dotNetSample -example
                                        RetrieveIncidentList -incidentId
                                        IM10001:IM10002

                                        dotNetSample -example RetrieveIncident -
                                        incidentId IM10001

                                        dotNetSample -example UpdateIncident -
                                        incidentId IM10006 -journalUpdates "User
                                        provided more information"


1.1.1.4.2.7. Command line arguments for the
Axis sample application

The Axis sample application runs from the command prompt using Java. After you have
compiled the Axis sample into an executable class file, you can perform configuration and
incident management tasks with the following arguments.

            Note

           To see the usage information for the Axis sample application, type ClassName
           where ClassName is the name of a sample application class.

Configuration Management

The following commands invoke Configuration Management functionality. These examples
assume you are using the batch files provided with the Axis sample application to automatically
set the class path and call the proper executable class.

Operation                               Command-line example
Create contact
Delete contact                          CreateContactSample -name sneveau -
Retrieve contact                        fullname "Sophie Neveau"
Update Contact
                                        DeleteContactSample -username falcon -
                                        name "sneveau"

                                        RetrieveContactSample -name "FALCON,
                                        JENNIFER"

                                        UpdateContactSample -name "FALCON,
                                        JENNIFER"

Incident Management

The following commands invoke Incident Management functionality. These examples assume
you are using the batch files provided with the Axis sample application to automatically set the
class path and call the proper executable class.

Operation                                                                                        Service Manager 9.81
Close incident
Create incident                         Command-line example

Resolve incident                        CloseIncidentSample -incidentId IM10001 -
Retrieve incident list                  closeCode "User Closer" -resolution
Retrieve incident                       "Problem disappeared"
Update incident
                                        CreateIncidentSample -briefDescription
                                        "Java sample brief description" -category
                                        incident -incidentDescription "This is a
                                        description" -severity 1 -subCategory
                                        hardware -productType "missing or stolen"
                                        -initialImpact 1 -service Applications -
                                        primaryAssignmentGroup Network

                                        ResolveIncidentSample -incidentId IM10006
                                        -resolution "Problem disappeared"

                                        RetrieveIncidentListSample -incidentId
                                        IM10001:IM10002

                                        RetrieveIncidentSample -incidentId IM1001

                                        UpdateIncidentSample -incidentId IM10006
                                        -journalUpdates "User provided more
                                        information"


1.1.1.4.2.8. Using query syntax

As shown in the example above, Service Manager supports queries using a special query
syntax with special characters such as # ("starts with"), or relational operators such as > or <
preceding an actual data value. With Web Services this syntax is available for string data as
well. If the field is of a type other than string (for example an integer or dateTime type) and you
are using a strongly typed programming language such as Java or C# to write your client code,
you will not be able to leverage this feature, since the special characters would not be
acceptable data types for these fields. To generate queries with this syntax on all types of
fields, fill in the query=”xxx” section as shown below.

The request


<soapenv:Envelope
xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"

 xmlns:pws="http://servicecenter.peregrine.com/PWS"
 xmlns:com="http://servicecenter.peregrine.com/PWS/Common">

     <soapenv:Header/>
     <soapenv:Body>

          <pws:RetrieveIncidentKeysListRequest attachmentInfo="?"
            attachmentData="?" ignoreEmptyElements="true">
                <pws:model query="">
                     <pws:keys query=" update.time>'05/01/08'">
                           <pws:IncidentID type="String" mandatory="?"

readonly="?">
                           </pws:IncidentID>

                     </pws:keys>
                     <pws:instance query=" " uniquequery="?" recordid="?">

                           <pws:IncidentID type="String" mandatory="?"
readonly="?">

                           </pws:IncidentID>
                           <pws:Category type="String" mandatory="?" readonly="?">
                           </pws:Category>
                           <pws:OpenTime type="DateTime" mandatory="?"
readonly="?">
                           </pws:OpenTime>
                           <pws:OpenedBy type="String" mandatory="?" readonly="?">
                           </pws:OpenedBy>
                           <pws:severity type="String" mandatory="?" readonly="?">
                           </pws:severity>
                           <pws:UpdatedTime type="DateTime" mandatory="?"

                             readonly="?"></pws:UpdatedTime>
                           <pws:PrimaryAssignmentGroup type="String" mandatory="?"

                             readonly="?"></pws:PrimaryAssignmentGroup>
                           <pws:ClosedTime type="DateTime" mandatory="?"

                             readonly="?"></pws:ClosedTime>
                           <pws:ClosedBy type="String" mandatory="?" readonly="?">
                           </pws:ClosedBy>
                           <pws:ClosureCode type="String" mandatory="?"
readonly="?">
                           </pws:ClosureCode>
                           <pws:ConfigurationItem type="String" mandatory="?"

                             readonly="?"></pws:ConfigurationItem>
                           <pws:Location type="String" mandatory="?" readonly="?">
                           </pws:Location>
                           <pws:IncidentDescription type="Array">

                                <pws:IncidentDescription type="String" mandatory="?"


readonly="?">         readonly="?"></pws:IncidentDescription>
               </pws:IncidentDescription>
readonly="?">  <pws:Resolution type="Array">

readonly="?">       <pws:Resolution type="String" mandatory="?"
readonly="?">         readonly="?"></pws:Resolution>
readonly="?">
readonly="?">  </pws:Resolution>
               <pws:AssigneeName type="String" mandatory="?"

               </pws:AssigneeName>
               <pws:Contact type="String" mandatory="?" readonly="?">
               </pws:Contact>

                <pws:JournalUpdates type="Array">
                    <pws:JournalUpdates type="String" mandatory="?"
                      readonly="?"></pws:JournalUpdates>

               </pws:JournalUpdates>
               <pws:AlertStatus type="String" mandatory="?"

               </pws:AlertStatus>
               <pws:ContactLastName type="String" mandatory="?"

                readonly="?"></pws:ContactLastName>
               <pws:ContactFirstName type="String" mandatory="?"

                readonly="?"></pws:ContactFirstName>
               <pws:Company type="String" mandatory="?" readonly="?">
               </pws:Company>
               <pws:BriefDescription type="String" mandatory="?"

                readonly="?"></pws:BriefDescription>
               <pws:TicketOwner type="String" mandatory="?"

               </pws:TicketOwner>
               <pws:UpdatedBy type="String" mandatory="?" readonly="?">
               </pws:UpdatedBy>
               <pws:IMTicketStatus type="String" mandatory="?"

                readonly="?"></pws:IMTicketStatus>
               <pws:Subcategory type="String" mandatory="?"

               </pws:Subcategory>
               <pws:SLAAgreementID type="Decimal" mandatory="?"

                readonly="?"></pws:SLAAgreementID>
               <pws:SiteCategory type="String" mandatory="?"

               </pws:SiteCategory>
               <pws:ProductType type="String" mandatory="?"

               </pws:ProductType>
               <pws:ProblemType type="String" mandatory="?"


  readonly="?">
                             </pws:ProblemType>
                             <pws:ResolutionFixType type="String" mandatory="?"
                               readonly="?"></pws:ResolutionFixType>
                             <pws:UserPriority type="String" mandatory="?"

  readonly="?">
                             </pws:UserPriority>
                             <pws:Solution type="Array">
                                   <pws:Solution type="String" mandatory="?"

  readonly="?">
                                   </pws:Solution>

                             </pws:Solution>
                             <pws:InitialImpact type="String" mandatory="?"

                               readonly="?"></pws:InitialImpact>
                             <pws:folder type="String" mandatory="?" readonly="?">
                             </pws:folder>
                        </pws:instance>
                        <pws:messages>

                               <com:message type="String" mandatory="?"
                                 readonly="?" severity="?" module="?">?</com:message>

                        </pws:messages>
                   </pws:model>
             </pws:RetrieveIncidentKeysListRequest>
        </soapenv:Body>
  </soapenv:Envelope>

The response


<SOAP-ENV:Envelope
 xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
     <SOAP-ENV:Body>
          <RetrieveIncidentKeysListResponse message="Success"
            query="" returnCode="0" schemaRevisionDate="2007-04-14"
            schemaRevisionLevel="1" status="SUCCESS"
            xsi:schemaLocation="http://servicecenter.peregrine.com/PWS
            http://<sm server>.americas.hpqcorp.net:13701/sc62server/ws/
            Incident.xsd"
            xmlns="http://servicecenter.peregrine.com/PWS"
            xmlns:cmn="http://servicecenter.peregrine.com/PWS/Common"
            xmlns:xsd="http://www.w3.org/2001/XMLSchema"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
                <keys>
                     <IncidentID type="String">IM10055</IncidentID>
                </keys>
                <keys>
                     <IncidentID type="String">IM10063</IncidentID>
                </keys>
                <keys>
                     <IncidentID type="String">IM10070</IncidentID>
                </keys>
                <keys>
                     <IncidentID type="String">IM10077</IncidentID>
                </keys>
                <keys>
                     <IncidentID type="String">IM10090</IncidentID>
                </keys>
                <keys>
                     <IncidentID type="String">IM10115</IncidentID>
                </keys>
                <keys>
                     <IncidentID type="String">IM10116</IncidentID>
                </keys>
                <keys>
                     <IncidentID type="String">IM10117</IncidentID>
                </keys>
                <keys>
                     <IncidentID type="String">IM10118</IncidentID>
                </keys>
                <keys>
                     <IncidentID type="String">IM10119</IncidentID>
                </keys>
                <keys>


                     <IncidentID type="String">IM10120</IncidentID>
                </keys>
                <keys>

                     <IncidentID type="String">IM10121</IncidentID>
                </keys>
                <keys>

                     <IncidentID type="String">IM10122</IncidentID>
                </keys>
                <keys>

                     <IncidentID type="String">IM10123</IncidentID>
                </keys>
                <keys>

                     <IncidentID type="String">IM10124</IncidentID>
                </keys>
                <keys>

                     <IncidentID type="String">IM10125</IncidentID>
                </keys>
          </RetrieveIncidentKeysListResponse>
     </SOAP-ENV:Body>
</SOAP-ENV:Envelope>

          Note

         The field names in such directly entered query strings reflect either the actual field
         names (such as update.time) or the Caption (such as UpdateTime). Clients who
         want to submit an expert/advanced query should use either the query attribute on
         the <keys> element or the query attribute on the <instance> element. Both are
         provided because some requests don't define any <instance> element. During
         SOAP API request processing, the server will look first at the <keys> element and,
         if there is no query attribute there, will look at the <instance> element. Query
         attributes defined on any other element are never consulted during inbound SOAP
         request processing.


1.1.1.4.2.9. Retrieving data from Service
Manager

Retrieval methods aren't defined in the extaccess record. The following list shows the methods
for retrieval that are available and under which circumstances to use each one:

      Retrieve<FileName> - Used if only one record will be returned. Throws a fault if multiple
     records are returned.
      Retrieve<FileName>KeysList - Retrieves the list of unique keys (which doesn't have to
     be the unique key of the Service Manager dbdicts). The list can either be passed as an
     array to the Retrieve<FileName>List method, or looped through to pass to the
      Retrieve<FileName> method.
      Retrieve<FileName>List - Retrieves a list of records with information that was gathered
     either in the Retrieve<FileName>KeysList method or by passing in a query directly
     through the instance block. This method expects an array of keys unless the query
     approach is used.

            Note

           When retrieving data from a single table rather than a Service such as the contacts
           table, request the WSDL for the alias name defined in extaccess , such as
           "Contact" (singular form, upper-case "C") rather than for contacts (the actual file
           name).

There are different approaches to retrieving a list of records. When developing a custom client
there are actually two separate methods that can be used to retrieve list data.

The first approach uses the following steps:

   1. Send the data query (such as <open.time>&gt;6/30/05</open.time> ) to the
      RetrieveKeysList method.

   2. The result is a list of records where each record contains only the "primary key" (such as
     Incident ID) for those records that match the query.

   3. You can either provide the list to the RetrieveList method and receive all records defined
     by the list in a single XML document, or loop through the list, one record at a time, calling
      Retrieve once for each record by key.

The second approach uses these steps:

   1. Send the data query (such as < open.time>&gt;6/30/05</open.time> ) directly to the
      RetrieveList method.

   2. This single method call returns the entire result set (all fields for all records matching the
     query) in a single XML response.


Note

The second approach returns the entire query result set in one method call. If the
result set is large, use the first approach to increase performance.


1.1.1.4.2.10. Example: Retreiving data from
Service Manager via a Web service

The simplest way to perform retrieval operations is via Query-by-example (QBE). This is done
by creating an instance of a particular kind of object (such as an Incident) and populating one
or more fields with values to determine the result set. You have to only supply values for the
fields on which you wish to select.

The instance is then passed into a RetrieveXXXKeysList request. In a program, such as the
sample programs provided with Service Manager, you would be assigning values to properties
or calling setter methods on various Java or C# or other objects. In the following example, we
submit a RetrieveIncidentKeysList object, supplying a value for OpenedBy and UpdatedBy. In
this example, we will use Service Manager query syntax to find all incidents where the
OpenedBy element starts with “fal” as well as pass a literal value for the UpdatedBy field.

We get back a RetrieveIncidentKeysListResponse object listing the primary keys of the
matching Incident objects.

Combining multiple values in this QBE style selection connects the query terms with AND. To
create a query using OR, supply an expert query as a string in the <pws:instance query="xxx"
…> area.

The request


<?xml version="1.0" encoding="UTF-8" ?>
<soapenv:Envelope
xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
xmlns:pws="http://servicecenter.peregrine.com/PWS"
xmlns:com="http://servicecenter.peregrine.com/PWS/Common">

     <soapenv:Header/>
     <soapenv:Body>

          <pws:RetrieveIncidentKeysListRequest attachmentInfo="?"
          attachmentData="?" ignoreEmptyElements="true">

                <pws:model query="">
                     <pws:keys query="">
                           <pws:IncidentID type="String" mandatory="?"

readonly="?">
                           </pws:IncidentID>

                     </pws:keys>
                     <pws:instance query="" uniquequery="?" recordid="?">

                           <pws:IncidentID type="String" mandatory="?"
readonly="?">

                           </pws:IncidentID>
                           <pws:Category type="String" mandatory="?" readonly="?">
                           </pws:Category>
                           <pws:OpenTime type="DateTime" mandatory="?"
readonly="?">
                           </pws:OpenTime>
                           <pws:OpenedBy type="String" mandatory="?"
readonly="?">#fal
                           </pws:OpenedBy>
                           <pws:severity type="String" mandatory="?" readonly="?">
                           </pws:severity>
                           <pws:UpdatedTime type="DateTime" mandatory="?"
                           readonly="?"></pws:UpdatedTime>
                           <pws:PrimaryAssignmentGroup type="String" mandatory="?"
                           readonly="?"></pws:PrimaryAssignmentGroup>
                           <pws:ClosedTime type="DateTime" mandatory="?"
readonly="?">
                           </pws:ClosedTime>
                           <pws:ClosedBy type="String" mandatory="?" readonly="?">
                           </pws:ClosedBy>
                           <pws:ClosureCode type="String" mandatory="?"
readonly="?">
                           </pws:ClosureCode>
                           <pws:ConfigurationItem type="String" mandatory="?"
                           readonly="?"></pws:ConfigurationItem>
                           <pws:Location type="String" mandatory="?" readonly="?">


readonly="?">  </pws:Location>
readonly="?">  <pws:IncidentDescription type="Array">

readonly="?">       <pws:IncidentDescription type="String" mandatory="?"
readonly="?">       readonly="?"></pws:IncidentDescription>
readonly="?">  </pws:IncidentDescription>
               <pws:Resolution type="Array">
                    <pws:Resolution type="String" mandatory="?"
                    readonly="?"></pws:Resolution>
               </pws:Resolution>
               <pws:AssigneeName type="String" mandatory="?"

               </pws:AssigneeName>
               <pws:Contact type="String" mandatory="?" readonly="?">
               </pws:Contact>

                <pws:JournalUpdates type="Array">
                    <pws:JournalUpdates type="String" mandatory="?"
                    readonly="?"></pws:JournalUpdates>

               </pws:JournalUpdates>
               <pws:AlertStatus type="String" mandatory="?"

               </pws:AlertStatus>
               <pws:ContactLastName type="String" mandatory="?"
               readonly="?"></pws:ContactLastName>
               <pws:ContactFirstName type="String" mandatory="?"
               readonly="?"></pws:ContactFirstName>
               <pws:Company type="String" mandatory="?" readonly="?">
               </pws:Company>
               <pws:BriefDescription type="String" mandatory="?"
               readonly="?"></pws:BriefDescription>
               <pws:TicketOwner type="String" mandatory="?"

               </pws:TicketOwner>
               <pws:UpdatedBy type="String" mandatory="?"
               readonly="?">falcon</pws:UpdatedBy>
               <pws:IMTicketStatus type="String" mandatory="?"
               readonly="?"></pws:IMTicketStatus>
               <pws:Subcategory type="String" mandatory="?"

               </pws:Subcategory>
               <pws:SLAAgreementID type="Decimal" mandatory="?"
               readonly="?"></pws:SLAAgreementID>
               <pws:SiteCategory type="String" mandatory="?"

               </pws:SiteCategory>
               <pws:ProductType type="String" mandatory="?"


  readonly="?">
                             </pws:ProductType>
                             <pws:ProblemType type="String" mandatory="?"

  readonly="?">
                             </pws:ProblemType>
                             <pws:ResolutionFixType type="String" mandatory="?"
                             readonly="?"></pws:ResolutionFixType>
                             <pws:UserPriority type="String" mandatory="?"

  readonly="?">
                             </pws:UserPriority>
                             <pws:Solution type="Array">
                                   <pws:Solution type="String" mandatory="?"

  readonly="?">
                                   </pws:Solution>

                             </pws:Solution>
                             <pws:InitialImpact type="String" mandatory="?"
                            readonly="?"></pws:InitialImpact>
                             <pws:folder type="String" mandatory="?" readonly="?">
                             </pws:folder>
                        </pws:instance>
                        <pws:messages>

                               <com:message type="String" mandatory="?" readonly="?"
                               severity="?" module="?">?</com:message>
                        </pws:messages>
                   </pws:model>
             </pws:RetrieveIncidentKeysListRequest>
  </soapenv:Envelope>

The response


<?xml version="1.0" encoding="utf-16"?>
<SOAP-ENV:Envelope xmlns:SOAP-
ENV="http://schemas.xmlsoap.org/soap/envelope/">

     <SOAP-ENV:Body>
          <RetrieveIncidentKeysListResponse message="Success" query=""
            returnCode="0" schemaRevisionDate="2007-04-14"
            schemaRevisionLevel="1" status="SUCCESS"
            xsi:schemaLocation="http://servicecenter.peregrine.com/PWS
            http://<sm server>.americas.hpqcorp.net:13701/sc62server/ws/
            Incident.xsd" xmlns="http://servicecenter.peregrine.com/PWS"
            xmlns:cmn="http://servicecenter.peregrine.com/PWS/Common"
            xmlns:xsd="http://www.w3.org/2001/XMLSchema"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
                <keys>
                     <IncidentID type="String">IM10001</IncidentID>
                </keys>
                <keys>
                     <IncidentID type="String">IM10004</IncidentID>
                </keys>
                <keys>
                     <IncidentID type="String">IM10009</IncidentID>
                </keys>
                <keys>
                     <IncidentID type="String">IM10016</IncidentID>
                </keys>
                <keys>
                     <IncidentID type="String">IM10027</IncidentID>
                </keys>
                <keys>
                     <IncidentID type="String">IM10038</IncidentID>
                </keys>
                <keys>
                     <IncidentID type="String">IM10049</IncidentID>
                </keys>
                <keys>
                     <IncidentID type="String">IM10060</IncidentID>
                </keys>
                <keys>
                     <IncidentID type="String">IM10061</IncidentID>
                </keys>
          </RetrieveIncidentKeysListResponse>

     </SOAP-ENV:Body>
</SOAP-ENV:Envelope>


Having retrieved a list of <keys> elements we can now retrieve these Incidents using a
RetrieveIncidentList request, by supplying the collection of keys elements in that request.

You can submit a variable number of <keys> elements in a RetrieveXXXList request, subject
only to your program’s ability to handle large XML responses. Java client programs can
sometimes run out of memory if the server returns very large responses.

To help prevent the RetrieveXXXListRequest Web Service from causing a Java Heap Space
out-of-memory error when retrieving a list of records, the following applies for the response of
a RetrieveXXXList request:

     When there is neither a start attribute nor a count attribute, return all records/keys.
     When there is a valid start value but no count attribute, return all records starting from the
     start attribute.
     When there is a valid start attribute and valid count attribute, return the number of
     keys/records starting from the start attribute.
     When there is a negative start attribute, return from the first record.
     When there is a negative count attribute, return one record.
     When the start attribute is bigger than the total number of records/keys, no record is
     returned.
````
