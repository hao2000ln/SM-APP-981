---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.1.1.2 .. 1.1.1.2.3
printed_pages: 21-55
---

# 1.1.1.2 Publish Service Manager data using WS API

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.1.2. Publish Service Manager data using WS
API

To publish Service Manager data via Web Services, use the Web Service Configuration tool to
expose files and methods to add, update, or delete Service Manager records. The consumer of
this data can be a custom C# or Java program or an interface program such as Connect-It as
well as another Service Manager system.

To expose a set of Service Manager tables as a Web Service, click Tailoring > Web Services >
External Access Actions and create or update the related extaccess record for each of the
tables.


1.1.1.2.1. Things to consider prior to publishing
data

Before publishing Service Manager data via a Web Service, there are several things to
consider. When investigated thoroughly, each of the following items will serve to improve the
organization and performance of the Web Services.


1.1.1.2.1.1. Publishing Service Manager
applications as Web Services

You can publish Service Manager applications as Web Services and create new integration
points between the Service Manager server and external applications.

You can customize the Web Services that Service Manager publishes by adding or removing
tables, fields, and display options, from the list of objects available to the Web Services. In
addition, you can create alias names for each of these options that only appear in the Web
Services but we recommend that you don't do this. You can also specify the XML schema data
type you want the Service Manager server to use when publishing data to a SOAP Web
service.

For your custom Web Services client to access Service Manager Web Services, it must present
a valid operator record name and password with each request. Furthermore, the operator must
have the SOAP API or RESTful API capability word as part of the security profile.


1.1.1.2.1.2. When to use Web Services

Web Services enable user-driven integrations with any application that supports Web Services.
     Web Services can be used for any table and external applications that support the
     technology.
     Web Services can be used to view data from an external source or copy data from one
     system to another.


1.1.1.2.1.3. Can I use the out-of-box Web
Services?

The ITIL-standard Web Services provided with Service Manager should be used whenever
possible. They have been tested extensively and are well documented, which makes them
easier to use. If you are interested in using one of these Web Services, we recommend that
you don't modify the out-of-box extaccess records. Instead, always create your own copy if
you need to add actions or fields. If the changes are unique, create a copy of the extaccess
record(s) involved first and name the service differently; for example,
IncidentManagementForPortal rather than just IncidentManagement, and make your changes
against the new set of extaccess records.


1.1.1.2.1.4. What items do I need to expose?

Only expose required fields and fields that are necessary for the actions exposed. Expose only
those actions that are required for the consumer to perform their duty. All actions that are
exposed need to be able to run in background without user interaction.

Though an entire table and even an entire system can be exposed via Web Services, doing so
would affect performance and confuse users. Only the data that's needed by a client should be
exposed. This prevents excess traffic and decreases the amount of storage that your client
may need to use.

Publish a Document Engine display action in the Web
Services API

You must have the SysAdmin capability words to use this procedure.

The Service Manager Web Services API allows you to publish any Document Engine display
action as part of a Web Service.

   1. Sign on to Service Manager as a System Administrator.
   2. Click Tailoring > Web Services > Web Service Configuration. Service Manager displays

     the External Access Definition form.
   3. In the Name field, type the name of the Service Manager table or join file whose display

     actions you want to publish.
   4. Click Search. The External Access Definition record for the table opens.
   5. Double-click the applicable object name entry. The External Access Definition form

     opens.

   6. Click an empty cell from the Allowed Actions array and select the Document Engine
     display action you want to publish from the list.

                   Note

                If a join file is chosen, the allowed actions for the join file are controlled by the
                initialization expressions in the ext.init Process record (click Tailoring >
                Document Engine > Processes).

                   Note

                You must first have created the necessary Document Engine records, states,
                objects, and display actions, for a custom display action to appear in this list.

   7. In the Action Names field next to the allowed action, type the name you want Service
     Manager to display for the action in the Web Services API.


                   Note

                The name you type for this field becomes the alias name for the display
                action and becomes part of the Web Service WSDL. For example, if you type
                Create for the add action of the Incident object, then the WSDL operation
                becomes CreateIncident and the WSDL messages are CreateIncidentRequest
                and CreateIncidentResponse.

                   Caution

                Since this name becomes part of the WSDL, the name must consist of
                alphanumeric characters valid for XML. The name can't include XML-
                reserved characters such as brackets (< & >), colons (:), or quotation marks
                (" & ").

   8. In the Action Type field, select the conditions where this action will be valid.
           To limit the action to new records, select the Create only type.
           To limit the action to existing records, select the Update only type.
           To make the action available for both new and existing records, select the Merge
           type.

   9. Click Save.

Publish a Service Manager field in the Web Services API

You must have the SysAdmin capability words to use this procedure.

   1. Sign in to Service Manager as a System Administrator.
   2. Click Tailoring > Web Services > Web Service Configuration. Service Manager displays

     the External Access Definition form.
   3. In the Service Name field, select the name of the Service Manager table or join file in

     which you want to rename fields.

                   Note

                If a join file is chosen, the Fields tab lists all of the fields for all of the files in
                the join file.

   4. Click Search. The web services record for that table opens.
   5. Click the Fields tab.
   6. In the Field field, type the name of the field for which you want to create an alias.


               Note

             To specify a compound field type such as an array of structure or an array of
             characters, you must use a special syntax.

7. In the Caption field, type the name (alias) you want the field to have in the Web Services
  API.

               Caution

             Since this name becomes part of the WSDL the name must consist of
             alphanumeric characters valid for XML. The name can't consist of XML
             reserved characters such as brackets (< & >), colons (:), or quotation marks (“
             & ”).

8. In the Type column, select a data type override, if any, you want the field to have in the
  Web Services API.

               Note

             If you leave the Type field blank, Service Manager uses the default mapping
             to determine the data type. Any data type you select overrides the default
             mapping. The default is StringType.

9. Click Save.


1.1.1.2.1.5. What data types should I use for
SOAP?

Service Manager has a more lenient data typing policy than the XML schema data typing policy
used for Web Services. Certain field types in Service Manager can correspond to multiple data
types in the XML schema data type policy. For example, the Service Manager data type
decimal could be a decimal, a floating number, or an integer in the XML schema data type
policy.

In addition, the actual formatting of data varies between Service Manager and XML schema
data types. This is especially true of Service Manager date/time fields that use a different order
than XML schema dates. Because some Web Services may require changes to field data
format, you can now define the XML Schema data type you want Service Manager to convert
the field's data to when you publish the field as part of a web service.

For outbound data, the Service Manager server automatically converts Service Manager data
to the format you select in the data policy record for the Service Manager field. For inbound
data, the Service Manager server automatically converts the XML schema data to the Service
Manager field's listed data type format.

The services, objects, and fields published in the Service Manager Web Services API already
have the proper XML schema data mappings listed in the Web Services definition (extaccess
record). If the extaccess record doesn't list a data type mapping, then the Web Services API
treats the field data as a string.

The following table lists the available SOAP API data types and their Service Manager
equivalents.


SOAP API Data Type                      Service Manager Data Type
Base64Type                              used for binary data
BooleanType                             Boolean
ByteType                                Decimal
DateTimeType                            Date/Time
DateType                                Date/Time
TimeType                                Date/Time
DurationType                            Date/Time
DecimalType                             Decimal
DoubleType                              Decimal
IntType                                 Decimal
LongType                                Decimal
ShortType                               Decimal
FloatType                               Decimal
StringType                              Text

Caution

     Always map Service Manager date/time fields to the XML schema dateTime
     or to one of the related XML schema date or time types.
     Do not map a Service Manager logic field which is an expression or evaluate
     type like 'null(assigned.to in $L.file)' to any SOAP API data type in the Web
     Services definition.

Otherwise, these fields will cause errors when you consume the service.


            Caution

           When integrating with Service Manager, array data should be broken into multi-
           elements by separator "\r." This is because Service Manager uses "\r" as the
           separator between array elements. When a string that contains "\r" is retrieved
           from the Service Manager system, it is decoded as an array with multiple elements
           separated by "\r". For this reason, when integrating other applications (for example,
           UCMDB) with Service Manager through web services, array data should be broken
           into multi-elements by separator "\r" before the data is encoded and sent to the
           Service Manager system. For example, if an array contains elements "aabb" and
           "ccdd", it should be sent to Service Manager as the following:

                 <ns:Comments type=\"Array\">
                 <ns:Comments mandatory=\"\" readonly=\"\">aabb</ns:Comments>
                 <ns:Comments mandatory=\"\" readonly=\"\">ccdd</ns:Comments>
                 </ns:Comments>

You can define the data type you want Service Manager to convert field data to when
publishing it as a Web Service. These data types are consistent with XML schema data types.

   1. Click Tailoring > Database Manager.
   2. In the Table field, type extaccess and click Search. The External Access Definition record

     opens.
   3. In the Name field, select the name of the Service Manager table whose exposed field you

     want to define datatypes for.
   4. Click Search. The External Access Definition record for the table opens.
   5. On the Fields tab, find the field that you want to define the data type for.
   6. In the Type column for that field, either type the data type or select a data type from the

     predefined list in the drop-down list.

                   Note

                The data type you select for this field becomes an XML schema data type in
                the web services WSDL.

                   Caution

                You must also specify a Field name in API value when you set a data type
                value. Data type validation depends upon the existence of an alias name.

   7. Click Save.


1.1.1.2.1.6. What methods do I need?

By default, any operation that's a part of the Document Engine for a table can be made
available in the table’s Web service. If you need additional methods, add them to the Document
Engine first so that Service Manager has a process to follow when performing them. If you
have methods in the Document Engine that you don't want exposed, delete them from the
allowed actions array in the extaccess table.

            Note

           All actions performed from Web Services have to run without user interaction in
           Service Manager. It's not possible to prompt the user for more information when
           that user is a Web Services consumer.


1.1.1.2.1.7. Manage records with Web Services
requests

An implementer can send a Web Services request to Service Manager that will create a new
record, update an existing record, or merge two records. These actions are defined by
selecting a value in the Action Type field on the Allowed Actions tab of the extaccess record.
The following is a description of the expected behavior for each of the values in the drop-down
list.

Create only

The server uses Create Semantics to initialize the file variable, fill it with the data from the Web
Services request, and pass it to the se.external.action RAD application.

Update only

The server uses Update Semantics to select the matching record before calling the
se.external.action RAD application. The server returns an error if it doesn't find a matching
record.

Merge

The server attempts to select the record. If it finds the record, it changes the action to Update
and calls the se.external.action RAD application. If the server fails to find the record, it changes
the action to Create and calls the se.external.action RAD application. If either the Update or
Create action is missing, the se.external.action returns a 70 – invalid action error message.

If there is no value specified in the Action Type field, the server uses Update Semantics. The
only exception is when the Action Name specified is Create, in which case the server uses
Create Semantics.


1.1.1.2.1.8. Are there any security
considerations?

After you have exposed data by using Web Services, any client consuming the Web Service
you are publishing has access to that data. If there are certain fields that you want to restrict
from specific clients, create a different Web Service with those fields removed and have these
clients consume that data.


1.1.1.2.1.9. What are released Web Services?

The Web Services delivered out-of-box with Service Manager are read-only and marked with
the released option in the external access definition form. You should consider any Web
Service with the released option selected as the supported version of the Web Service in
Service Manager. While it is possible to clear the released option and edit or delete the Web
Service, we recommend that you instead work on a copy of the Web Service that you give it a
different name. While the released option is selected the external access definition remains
read-only.


1.1.1.2.1.10. Enable SSL encryption for
published Web Services

If you want external Web Services clients to use an SSL connection with the Service Manager
server, you must provide them with the CA certificate for the Service Manager server. If you
purchased a server certificate, copy the CA certificate from the CA certificate keystore
provided with your purchased certificate. If you generated your own server certificate by using
a self-signed private CA certificate, copy the CA certificate from your private CA certificate
keystore instead.

            Note

           We recommend that you don't use the Service Manager sample server CA
           certificate because the sample certificate uses a common name (CN) for the
           server which will not match your actual server name. The best practice is to
           purchase or create a valid certificate for the Service Manager server in order to
           establish an SSL-encrypted connection with external web service clients.

   1. Copy the keystore that contains the CA certificate that signed your server's certificate
     and send it to the systems running the external Web Services clients. Out-of-box, Service
     Manager uses a sample CA certificates keystore as part of the Web tier.

                   Note

                We recommend using a CA certificate that you created or purchased instead
                of the default Service Manager CA certificate.

   2. Import the CA certificate of the Service Manager system into the CA certificate keystore
     of the external Web Services client. You may use a tool like keytool to import the Service
     Manager CA certificate.

   3. Configure the external Web Services client to use the updated CA certificate keystore.
     Follow the instructions for your Web Services client to set the path to the CA certificate
     keystore.

   4. Update the endpoint URL that the external Web Services client uses to include the HTTPS
     protocol.

     For example, https://myserver.mydomain.com:13443/SM/7/ws for SOAP and
      https://myserver.mydomain.com:13443/SM/9/rest for RESTful.

     Follow the instructions for your Web Service client to update the endpoint URL.


Note

The endpoint URL must use the Service Manager server's common name
(CN) as defined in the server certificate. For example, if the server certificate
uses the name myserver.mydomain.com, then the endpoint URL must also
use the name myserver.mydomain.com.

Note

If you want external Web Services clients to download the Service Manager
Web Services WSDL, point them to a URL using the following format:
https://myserver.mydomain.com:13443/SM/7/<Service Name>.wsdl


1.1.1.2.2. Example: Publishing request
processes for the PPM integration

In this example, we prepare the data from the ocmq file to integrate to Project and Portfolio
Management (PPM) by using Web Services. We will assume that as part of a project, a new
employee needs to be hired and the hiring process (approvals and workflow) will be done
within the Service Manager Request Management Module.

Since Request Management is not published as a Web Service, we will need to start by
creating some customized Display options and Processes. Once these work in the Windows
client, we will include them in the newly-created extaccess record.

Since the goal is to publish just the possibility to start the new hire process, a lot of the
required information will be hard-coded in the request creation, to minimize overhead.


1.1.1.2.2.1. Create the display option

To create the display option, follow these steps:

   1. Sign in to Service Manager as a System Administrator.
   2. Click Tailoring > Database Manager and open the displayoption table.
   3. Search for an available display option for the rmq.main.display display screen in the

     range from 200 to 2000.
   4. Create a new display option with the following values:

Field                                   Value
Screen ID                               rmq.main.display
Action                                  CreateNewHire
Unique ID                               rmq.main.display_CreateNewHire
GUI option                              500
Text Option                             500
Default Label                           Create New Hire Request
Bank                                    3
Condition                               true

5. Add the new record.

    Field                                                                                  Service Manager 9.81
    Screen ID
    Action                              Value
    Unique ID                           rmq.main.display
    GUI option                          CreateNewHire
    Text Option                         rmq.main.display_CreateNewHire
    Default Label                       500
    Bank                                500
    Condition                           Create New Hire Request
6. Add the new record.                  3
                                        true


1.1.1.2.2.2. Set up the Request Management
category

For the background processing to work correctly, the category has to have Assign Number
Before Commit selected, so the flag is set to true.

            Note

           In this example, set the hr category flag to true .

Field                                   Value
Name                                    hr
Description                             Human Resources
Availability                            true
Assign Number Before Commit?            Select this option
Phases - Phase Name                     Condition
Initial Quote                           true
Quote Approval                          true
Working                                 true
Customer follow-up                      true


1.1.1.2.2.3. Create the new Process

The new rmq.open.newhire Process will first prepare the ocmcowork record, and then open
the new quote with a single line item for the New Employee bundle.
The new Process will need the following Initial JavaScript:

  system.vars.$L_work=new SCFile("ocmcowork");

On the RAD tab, enter the following information:
Expressions before 1st RAD:

  $L.part.no={100};$L.quantities={1};$L.item.quantity=1

1st RAD:

–  svcCat.build.work.file.sub                     –   Condition: true

–  names                                          –    $L.part.no
                                                       $L.work
–  record                                         –    $L.quantities
                                                       $L.item.quantity
–  numbers                                        –

–  number1                                        –

Expressions before 2nd RAD:

  if (filename($L.file)="ocmq") then ($fileq=$L.file)

2nd RAD:

–  rmq.open                             –  Condition: true

–  file                                 –  $L.file

–  second.file                          –  $L.object

–  text                                 –  $L.exit

–  boolean1                             –  true

–  cond.input                           –  false

–  record                               –  $L.work


1.1.1.2.2.4. Set up the State record

The rmq.view State record has to link the new display option to the new Process record. Add
the following line:

  – CreateNewHire – rmq.open.newhire – true –false


1.1.1.2.2.5. Update the format control record

Disable the ocml.bld.smry subroutine call on the ocmq format control record that runs on
display.


1.1.1.2.2.6. Set up the extaccess record

In the default Service Manager system, Request Management tables aren't published as a Web
Service.

            Note

           Enter all fields that need to be exposed, and then create field captions for those
           fields. The field captions can't be XML-reserved characters and can't contain
           spaces. Use of mixed case is supported.

To create a new Web Service, do the following:
   1. Sign in to Service Manager as a System Administrator.
   2. Click Tailoring > Web Services > Web Service Configuration.
   3. To publish Request Management Quotes, create a new record with the following
     information:

Field                                                                                      Service Manager 9.81
Service Name
                                        Value
Name
                                        RequestManagement

                                                    Note

                                                   Type the name of the web
                                                   service that you want to use
                                                   to publish this table may be
                                                   comprised of multiple
                                                   Service Manager tables. The
                                                   name you type in this field
                                                   becomes the alias name for
                                                   the service and it becomes
                                                   part of the web service URL.
                                                   For example, when you type
                                                   RequestManagement as the
                                                   service name, then the WSDL
                                                   you publish will be called
                                                   RequestManagement.wsdl.
                                                   The name can't contain URL-
                                                   reserved characters, such as
                                                   spaces, slashes, or colons.

                                        ocmq

Field                                                                                      Service Manager 9.81
Object Name
                                        Value

                                        Quote

                                                    Note

                                                   Type the name you want to
                                                   use to identify the table. This
                                                   name becomes the alias
                                                   name for the table, and then
                                                   becomes part of the web
                                                   service WSDL. For example,
                                                   when you type Quote as the
                                                   object name, then the SOAP
                                                   operations for this table
                                                   include Quote as part of the
                                                   WSDL element, such as
                                                   UpdateQuote, CreateQuote,
                                                   and DeleteQuote.

                                                   The name can't consist of
                                                   XML-reserved characters,
                                                   such as brackets (< and >),
                                                   colons (:), or quotation marks
                                                   (" and '). Never use
                                                   "CamelCase" (mixed case)
                                                   notation in the Object name,
                                                   as this creates an incorrect
                                                   or missing filename when
                                                   calling the web service via
                                                   Service Manager. As a
                                                   workaround, you can use a
                                                   tool that lets you modify the
                                                   XML to include the filename
                                                   in the SOAP body request.
                                                   However, Service Manager
                                                   and some other tools don't
                                                   allow modifications.

       Field                                                                               Service Manager 9.81
       Allowed Actions
                                        Value
       1st entry
       2nd entry                        The Allowed Actions have to match the
       Action Names                     action field in the Display Option, and in
                                        the display action field in the State
       1st entry                        record. Only options that have a true
       2nd entry                        condition will be available through the
       Action Type                      web service interface. Operator
       1st entry                        privileges will be checked to ensure
                                        security.
This PDF was generated on May 23, 2026
                                        save

                                        GenNewHire

                                        Type the name you want to use in the
                                        Web Services application program
                                        interface (API) to identify the Document
                                        Engine display actions for this table. The
                                        name you type for this field becomes the
                                        alias name for the display action, and
                                        then becomes part of the web service
                                        WSDL. The only action that can be used
                                        to add a record to a Service Manager
                                        table is Create. Updating actions can be
                                        named to fit the action. Foe example, if
                                        you type Create for the add action of the
                                        Quote object, then the WSDL operation
                                        becomes CreateQuote and the WSDL
                                        message is CreateQuoteRequest. The
                                        name can't consisit of XML-reserved
                                        characters, such as brackets(< and >),
                                        colons (:), or quotation marks (" and ').

                                        Update

                                        Create

                                        Merge

                                               Page 48 of 1727

Field                                      Value
2nd entry
Expressions tab                            Create only

                                           if null(number in $L.file) then
                                           ($L.mode="add")

4. On the Fields tab, type the following:

Field                                   Caption               Type
priority                                Priority              StringType
requested.for                           Requestor             StringType
requestor.dept                          RequestingDepartment  StringType
reason                                  Reason                StringType
location                                Location              StringType
hire.type                               HireType              StringType
requested.date                          StartDate             DateTimeType
requestor.fname                         NewEmployeeFirstName  StringType
requestor.lname                         NewEmployeeLastName   StringType
category                                Category              StringType
current.phase                           Phase                 StringType
number                                  Number                StringType

5. If you want to use RESTful API, on the RESTful tab, type the following:


Field                                   Value
RESTful Enabled                         Checked
Attachment Enabled                      Checked if you want to use attachment
                                        later.
Resource Collection Name                quotes
Resource Name                           Quote
Unique Keys                             number
Max Records Returned in Query           1000
Query Authorization                     true
Resource Collection Actions: POST       Create
Resource Actions:POST                   Update
Resource Actions: PUT                   Update

When your Web service is set up, it is ready to be consumed by a custom client. Windows and
Web clients are unaffected by changes you make to the extaccess table. The operator's
application profile is used to determine which tables the user can access, and which actions
the user can perform.


1.1.1.2.3. List: Web Services available in the
Service Manager Web Services API

The Service Manager Web Services includes ITIL-compliant Web Services. The following table
lists some of those web services. To see all the Web Services that are ITIL-compliant, use Web
Service Configuration in Tailoring (Tailoring > Web Services > Web Service Configuration)
and then do a true search. This will list all of the out-of-box services.

            Note

           This is the out-of-box list for SOAP.


Web Service                             URL to access WSDL        Service Manager objects
Change Management                       ChangeManagement.wsdl     (tables) published
Configuration Management                ConfigurationManagement.
                                        wsdl                      Change (cm3r),
Incident Management                                               ChangeTask (cm3t)
Problem Management                      IncidentManagement.wsdl
                                        ProblemManagement.wsdl    Company (company),
                                                                  Contact (contacts),
                                                                  Department (dept), Device
                                                                  (device), DeviceParent
                                                                  (deviceparent), Computer
                                                                  (joincomputer),
                                                                  DisplayDevice
                                                                  (joindisplaydevice),
                                                                  Furnishing (joinfurnishings),
                                                                  HandHeldDevice
                                                                  (joinhandhelds), MainFrame
                                                                  (joinmainframe),
                                                                  NetworkDevice
                                                                  (joinnetworkcomponents),
                                                                  OfficeElectronic
                                                                  (joinofficeelectronics),
                                                                  SoftwareLicense
                                                                  (joinsoftwarelicense),
                                                                  StorageDevice
                                                                  (joinstorage),
                                                                  TelecommunicationDevice
                                                                  (jointelecom), Location
                                                                  (location), Model (model),
                                                                  InstalledSoftware
                                                                  (pcsoftware), Vendor
                                                                  (vendor)

                                                                  Incident (probsummary),
                                                                  Incident Task (imTask)

                                                                  Problem (rootcause)

Web Service                             URL to access WSDL                          Service Manager 9.81
Service Desk                            ServiceDesk.wsdl
                                                            Service Manager objects
                                                            (tables) published

                                                            Interaction (incidents)

                                                                        Note

                                                                       As of Service
                                                                       Manager 9.41,
                                                                       the "Continue"
                                                                       action is
                                                                       introduced and
                                                                       it only applies to
                                                                       the standalone
                                                                       streamlined
                                                                       interactions. If
                                                                       you apply
                                                                       "Continue" to a
                                                                       streamlined
                                                                       interaction
                                                                       that's already
                                                                       related to a
                                                                       fulfillment
                                                                       record, the
                                                                       action will fail
                                                                       with an error
                                                                       message.

                                                                       The
                                                                       “add.escalate.in
                                                                       cident" action
                                                                       supports both
                                                                       the
                                                                       “Streamlined
                                                                       Service Desk”
                                                                       workflow and
                                                                       other previous
                                                                       interaction
                                                                       workflows.


Web Service                             URL to access WSDL        Service Manager objects
Service Level Management                                          (tables) published

Request Fulfillment                     ServiceLevelManagement.w  ServiceEntry (serviceent),
                                        sdl                       SLA (sla), ActiveSLA
                                                                  (slaactive), AssignedSLA
                                                                  (slaassigned), SLA Control
                                                                  (slacontrol), MonthlySLA
                                                                  (slamonthly),
                                                                  MonthlySLALag
                                                                  (slamonthlylag),
                                                                  SLAResponse (slaresponse)

                                        RequestManagement.wsdl Request (request), Request
                                                                          Task (requestTask)

For RESTful, you can find the out-of-box list from the Service Document, http://<server>:
<port>/SM/9/rest .
````
