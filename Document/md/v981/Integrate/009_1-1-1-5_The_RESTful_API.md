---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.1.1.5 .. 1.1.1.8
printed_pages: 218-254
---

# 1.1.1.5 The RESTful API

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.1.5. The RESTful API

Service Manager also supports a Rest API Framework. You can use the Rest API Framework to
support lightweight queries and operations on Service Manager data via a single URI. Using
the Rest API Framework you can create an application that can perform Create, Read, Update,
and Delete actions on Service Manager objects.

The Rest API Framework re-implements most of the functionality that the Service Manager
SOAP implementation. Therefore, the Rest API Framework uses the same actions on objects as
the SOAP implementation, and the implementation methods are similar.

For more information on the available actions, see the Allowed Actions tab field definitions in
the Web Services Guide.


1.1.1.5.1. Service Document

Service Manager supports the automatic generation of RESTful Service Documents by
providing an HTML (textl) representation.

RESTful Service Documents represent server-defined group of Collections used to initialize the
process of creating and editing resources.

After RESTful Enabled is checked into Web Service Configuration for a Web service, its
description will be generated.

At the top of the document, there is a group of all of Service Manager RESTful services. You
can go to the detailed description of each service by clicking Service Name.

In the detail of the description, you can find the URI and supported HTTP Methods for each
Resource Type. You can also find the supported actions’ descriptions.

For example:


1.1.1.5.2. Consuming Service Manager RESTful
API

A Service Manager Restful Web service can be consumed by a custom client or by an
application that directly consumes Restful Web Services.


1.1.1.5.2.1. RESTful syntax

A RESTful query allows you to send a request or execute an operation by sending a single
Universal Resource Identifier (URI) space to Service Manager. In general, the format for the URI
resembles the following:

  http://{host}:{port}/{initialPath}

This example uses the following placeholders:

     The {host} placeholder indicates the host or domain name on which the service is
     available.
     The {port} placeholder indicates the TCP port number on which the service is available.
     The {initialPath} placeholder indicates any initial path that's part of the URI for a given
     deployment. This might be the path to the deployment point on the given server. This
     value should start with /SM/9/rest.

            Note

           If the URL contains "\", it should be replaced with "%5C" before encoding. For
           example, for Adobe\Reader , it should be replaced with Adobe%5CReader , and
           then be encoded as Adobe%255CReader .
           If the URL contains "/", it should be replaced with "%2F" first before encoding. For
           example, for Adobe/Reader , it should be replaced with Adobe%2FReader , and
           then be encoded as Adobe%252FReader .

Resource types

The Rest API Framework in Service Manager allows you to perform standard CRUD operations
on resources. URI endpoints for resources are roughly divided into the following resource
types:

     Resource Collection
     Resource Instance
     Resource with Actions
     Attachment Collection
     Attachment Instance

URI structure

The following table describes the structure of URIs that can be used in the Rest API
Framework.


URI                 Resource             Comments               Example
/
                    Service Document     This is the service    http://{host}:
/{resources}                             document for an        {port}/SM/9/rest
                                         entire business
/{resources}/{key}                       service. Only the
                                         GET method is
                                         supported.

                    Resource Collection  This is the            http://{host}:
                                         collection             {port}/SM/9/rest/inc
                                         resources. Only the    idents
                                         GET and POST
                                         methods are
                                         supported.

                    Resource Instance    This is an individual  http://{host}:
                                         resource.              {port}/SM/9/rest/inc
                                                                idents/IM10001

                                                                If with multiple keys,
                                                                it should be
                                                                {key1}/{key2}/{key3
                                                                }. If one of the key
                                                                value is null, it may
                                                                resemble:
                                                                {key1}/null/{key3}

/{resources}/{key}/ Attachments          This is the            http:/{host}:
                                         attachment list for    {port}/SM/9/rest/inc
attachments         Collection           an individual          idents/IM10001/atta
                                         resource.              chments

/{resources}/{key}/ Attachment           This is an individual  http://{host}:
attachments/{attach                      attachment.            {port}/SM/9/rest/inc
ment-id}                                                        idents/IM10002/atta
                                                                chments/cid:51dd0b
                                                                6d0002c0042075d
                                                                798

/{resources}/{key}/ Resource With        Only the POST          POST http://{host}:
                                         method is              {port}/SM/9/rest/inc
action/{action}     Actions              supported.             idents/IM10134/acti
                                                                on/reopen


This table uses the following placeholders:

     The {resources} placeholder represents the resource key of the individual object.
     The {attachment-id} placeholder represents the ID of the attachment for an individual
     resource.
     The {key} placeholder represents any unique key specified in the extaccess record.
     The {action} placeholder represents any action specified in the Allowed Actions tab of the
     External Access Definition. It must be lowercase. For example, if the action in the Allowed
     Actions tab is "Reopen", the value of {action} should be "reopen".
     action, attachments and view are keywords that are used in the URI.


1.1.1.5.2.2. RESTful commands

The Rest API Framework supports the following HTTP commands:

      GET
      POST
      PUT
      DELETE
      PATCH

The functionality of these commands varies according to the type of object to which it's
applied and the actions that are associated with that object. The following table shows example
resources and illustrates how these commands are used:


Object                                  Example Commands     Result
Service Document                                             Returns all accessible URLs.
Query                                     GET /

Resources with Actions                                       Returns all Incidents

                                        GET/<incidents>

                                        GET/<incidents>/<id  Returns an Incident with the
                                        >                    specified ID.

                                        GET/<incidents>?     Returns a subset of
                                        query=<url-encoded-  Incidents as specified by
                                        string>&sort=number  the URL encoded string, in
                                        :ascending           ascending order.

                                                             Creates an Incident

                                        POST /<incidents>

                                        PUT                  Updates an specific
                                        /<incidents>/<id>    Incident

                                        POST                 Invokes a customized action
                                        /<incidents>/<id>/a  on a specific Incident
                                        ction/<action>

                                        PATCH                Updates an specific
                                        /<incidents>/<id>    Incident


1.1.1.5.2.3. RESTful queries

The Rest API Framework also supports several parameters to query resources to return
different views of a resource or to filter for desired entries in a list. You can run a query on all
resource types.

Example of a query:

      /incidents //Query to gather all incidents
      /incidents?field1=value1&field2=value2 //Simple Query
      /incidents?query=<url-encoded-string>&sort=number:ascending //Service Manager
     Native Query

            Note

                The query string must use UTF-8 Encoding.
                The query string must use HTML URL Encoding.
                Datetime fields must use ISO standard formats.
                If you want to specify a time zone, you need to add the time zone with the
                following format:
                 yyyy-MM-ddTHH:mm:ss+hh:mm
                For example: 2023-11-24T18:00:00+01:00
                Here is an example query:
                 /SM/9/rest/incidents?query=open.time%3E%272019-11-
                11T18:00:00%2B01%3A00%27%20and%20open.time%3C%272019-11-
                11T23:59:59%2B01%3A00%27
                Here is the example query string above being URL decoded for your
                reference:
                 /SM/9/rest/incidents?query=open.time>'2019-11-11T18:00:00+01:00' and
                open.time<'2019-11-11T23:59:59+01:00'

The following table describes the parameters you can use:

Parameter Name                          Type                                     Service Manager 9.81
query                                   native sm query
                                                         Description:

                                                         Field name could be either
                                                         "Caption" or "Field".
                                                         Examples:

                                                           Category="incident"
                                                           and (Title="Desktop
                                                           screen out of
                                                           order" or
                                                           Title="Network
                                                           logon failure")

                                                           Category="incident"
                                                           and
                                                           (brief.description=
                                                           "Desktop screen out
                                                           of order" or
                                                           brief.description="
                                                           Network logon
                                                           failure")

Parameter Name                          Type                            Service Manager 9.81
sort                                    string
                                                Description:
start                                   int
                                                Returns the collection
                                                members in sorted order
                                                according to the arguments
                                                specified. Arguments are
                                                listed in pairs where the first
                                                argument of the pair
                                                specifies the attribute name
                                                on which to base the sort,
                                                and the second argument of
                                                the pair indicates whether
                                                to sort ascending or
                                                descending. More than one
                                                attribute can be specified
                                                on the sort list. The
                                                attributes ascending and
                                                descending can be used
                                                as well.

                                                sort={primaryField}:
                                                {ascending|descending}[,
                                                {secondaryField}:

                                                {ascending|descending}...
                                                ]

                                                For example, sort=Urgency
                                                or sort=severity or
                                                sort=Urgency:ascending,fi
                                                eld2:descending

                                                By default, the sortorder is
                                                ascending.

                                                Indicates the index of the
                                                member that the collection
                                                response representation
                                                begins with.

Parameter Name                          Type                            Service Manager 9.81

count                                   int     Description:

view                                    string  Indicates the number of
                                                collection members to be
                                                included in the response.
                                                The minimum value for this
                                                parameter is 1. By default,
                                                its behavior is to return all
                                                members. The behavior is
                                                the same as
                                                view=summary if
                                                count=0 .

                                                Represents a collection.

                                                Supported values:

                                                  view=summary

                                                  view=condense
                                                  (default)

                                                  view=expand

                                                summary: It returns the
                                                number of members if there
                                                are any, it doesn't return the
                                                actual members.
                                                condense: Returns the
                                                value of unique key field, it
                                                doesn't return the whole
                                                record. This is the default
                                                behavior if the view query
                                                parameter is not specified.

                                                expand: It returns all the
                                                fields defined in the
                                                extaccess record.


1.1.1.5.2.4. Resource representations

The following sections describe the media types and supported commands for each resource.

Media types for an individual resource

The following table describes the supported commands and media types for an individual
resource.

Action  Supported?                      Supported Request Supported

GET     Ö                               Media Types       Response Media
POST    Ö
PUT     Ö                                                 Types
PATCH   -
DELETE  Ö                               -                 application/json

                                        application/json  application/json

                                        application/json  application/json

                                        -                 -

                                        -                 application/json

Resource collection media types

The following table describes the supported commands and media types for a resource
collection.

Action  Supported?                      Supported Request Supported

GET     Ö                               Media Types       Response Media
POST    Ö
PUT     -                                                 Types
PATCH   -
DELETE  -                               -                 application/json

                                        application/json  application/json

                                        -                 -

                                        -                 -

                                        -                 -

Media types for an individual attachment


The following table describes the supported commands and media types for an individual
attachment.

Action  Supported?                      Supported Request Supported

                                        Media Types     Response Media

                                                        Types

GET     Ö                               -               The attachment
                                                        binary

POST    -                               -               -

PUT     Ö                               The attachment  application/json
                                        binary

PATCH   -                               -               -

DELETE  Ö                               -               application/json

Attachment collection media types

The following table describes the supported commands and media types for an attachment
collection.

Action  Supported?                      Supported Request Supported

GET     Ö                               Media Types     Response Media
POST    Ö
PUT     -                                               Types
PATCH   -
DELETE  Ö                               -               application/json

                                        The attachment  application/json
                                        binary

                                        -               -

                                        -               -

                                        -               application/json


1.1.1.5.2.5. Enable a resource for REST

To enable a resource to use the RESTful API Framework, follow these steps:

   1. Navigate to Tailoring > Web Services > Web Service Configuration.
   2. If needed, enter the information in the Service Name, Name, or Object Name fields to

     specify the resource you want to enable for RESTful.
   3. Click Search, and then select the appropriate resource from the list.
   4. Under External Access Definition, click the RESTful API tab.
   5. Select the RESTful Enabled? checkbox.
   6. Specify the following required fields:

Field                                   Function
Resource Collection Name:
Resource Name:                          This is the name of the Resource
                                        Collection. For example, you may
Unique Keys                             specify the group of incidents from the
                                        probsummary table as "incidents".

                                        This is the name of the individual
                                        Resource. For example, you may specify
                                        that any individual incident from the
                                        probsummary table be referred to as an
                                        "Incident".

                                        This field specifies one or more fields
                                        that will function as a unique identifier for
                                        a Resource from the Resource Collection.

7. If needed, specify the following additional fields:

Field                                                                                      Service Manager 9.81

Resource Collection Action              Function
POST:
                                        This field represents the default action
Resource Actions                        for resource collection.
POST:
PUT:                                    This field specifies the action to take
DELETE:                                 when an individual resource is part of a
PATCH:                                  POST, PUT, DELETE command. These
                                        actions are specified in the Allowed
                                        Actions tab of the External Access
                                        Definition.
                                        Note: PATCH only support Update action


1.1.1.5.2.6. RESTful capability word

The Rest API Framework introduces the following capability word to Service Manager: RESTful
API.
You MUST add this capability word to a user's operator record for a user to be able to log in
and execute a RESTful API request.

            Note

           Existing OMi integration RESTful functions will not check it and keep unchanged.
           The rest actions go through document engine and follow the same permission
           process as normal client.


1.1.1.5.2.7. HTTP header

Request Header

Authorization:
Keep-Alive:
Connnection:
Accept-Language:
Content-Type: (Required for attachment POST/PUT action)
Content-Disposition: (Required for attachment POST/PUT action. Value is
attachment;filename=filename; Semicolon is reserved for character separator, so it's not
allowed in file name.)

            Note

                Accept-Language is used for l10n.
                In order to use non-ASCII characters in the content disposition HTTP header,
                the web service client must support the RFC 6266 standard. For example, the
                web service client must add an HTTP header that resembles the following:
                 Content-Disposition: attachment;filename*=UTF-
                8%E6%99%93%E6%B9%984.txt

Response Header

code&msg: 200, 201, 400, 401, 403, 404, 500
Content-Type:
Content-Length:


1.1.1.5.2.8. HTTP response codes

Unless otherwise specified, the system uses these HTTP status codes.

Code                                    Cause

200                                     Successful operation. Viewing a list or detail

                                        page will return this code if no error

                                        occurred.

201                                     Successful POST operations. Returned after

                                        a successful create or update of an object.

400                                     Bad request. This response code may

                                        indicate that the URI was formed

                                        incorrectly.

401                                     Unauthorized operations.

403                                     Request forbidden.

404                                     Page not found. The page or resource

                                        doesn't exist.

500                                     Internal server error. This response code

                                        may indicate a bug. Please contact

                                        Software Support.

Related topics

Network Working Group RFC 2616: Hypertext Transfer Protocol -- HTTP/1.1
Network Working Group RFC 2616 Section 10: Status Code Definitions


1.1.1.5.2.9. OOB resource reference example

The following topic provide detailed information on how specific resources are published (for
example, Incident).

Web Service: Incident

External access definition

Field                                           Value
Service Name:                                   IncidentManagement
Name:                                           probsummary
Object Name:                                    Incident

Default RESTful settings

Field                                           Value

RESTful Enabled:                                checked

Attachments Enabled:                            checked

Resource Collection Name:                       incidents

Resource Name:                                  Incident

Unique Keys:                                    number

HTTP resource collection actions

Command                                 Action             Result
GET                                     Create
POST                                                       Retrieves a list of Incidents

                                                           Creates a new collection of
                                                           resources

HTTP resource actions

Command                                 Action                          Service Manager 9.81
GET                                     -
                                                Result
PUT:                                    Update  Retrieves an individual
                                                Incident.
POST:                                   Update  Saves the changes to the
                                                Incident record.
DELETE:                                 -       Saves the changes to the
PATCH:                                  Update  Incident record.

                                                Saves the changes to the
                                                Incident record.

Samples

Return sample of single incident query


  {"Messages":[],
  "ReturnCode":0,
  "Incident":{
  "UpdatedBy":"falcon",
  "Status":"Closed",
  "SLAAgreementID":168,
  "Urgency":"3",
  "Area":"failure",
  "OpenTime":"2007-08-31T20:21:00+00:00",
  "Location":"advantage/North America",
  "ClosedTime":"2007-09-01T01:13:00+00:00",
  "Title":"Printer malfunction",
  "Subarea":"job failed",
  "Solution":["Reset printer queue."],
  "ClosedBy":"Incident.Analyst",
  "OpenedBy":"Servicedesk.Manager",
  "IncidentID":"IM10001",
  "Assignee":"Incident.Analyst",
  "Company":"advantage",
  "Description":["Printjob keeps pending."],
  "TicketOwner":"Servicedesk.Manager",
  "ProblemType":"incident",
  "AssignmentGroup":"Office Supplies (North America)",
  "UpdatedTime":"2008-08-04T12:53:21+00:00",
  "Service":"Printing (North America)",
  "Impact":"4",
  "ClosureCode":"Solved by Workaround",
  "Category":"incident",
  "AffectedCI":"adv-nam-printer-hr-5550"
  }
  }

            Note

           "Incident" is the Resource Name as defined in the extaccess record.

Return sample of the Incident list query


  {
  "@totalcount":136,
  "@start":1,
  "@count":10,
  "Messages":[],
  "content":[
  {"Incident":{"IncidentID":"IM10001"}},
  {"Incident":{"IncidentID":"IM10002"}},
  {"Incident":{"IncidentID":"IM10003"}},
  {"Incident":{"IncidentID":"IM10004"}},
  {"Incident":{"IncidentID":"IM10005"}},
  {"Incident":{"IncidentID":"IM10006"}},
  {"Incident":{"IncidentID":"IM10007"}},
  {"Incident":{"IncidentID":"IM10008"}},
  {"Incident":{"IncidentID":"IM10009"}},
  {"Incident":{"IncidentID":"IM10010"}}
  ],
  "ReturnCode":0,
  "ResourceName":"Incident"
  }

Request sample of creating an Incident


{
              "Incident":
              {
                  "AffectedCI" :"adv-nam-server-mail",

"AlertStatus" : "updated",
"Area" :"failure",
"Assignee" : "Incident.Analyst",
"AssignmentGroup": "Network",
"Category" : "incident",
"ClosureCode" : "Solved by Workaround",
"Company" : "advantage",
"Contact" : "FALCON, JENNIFER",
"ContactFirstName" :"FALCON",
"ContactLastName" : "JENNIFER",
"Description" : [ "test" ],
"Impact" : "2",
"JournalUpdates":

                     [ "08/04/08 12:54:14 US/Mountain (falcon):",
"test",
"08/04/08 12:54:14 US/Mountain (falcon):",
"test"
],
"Location":"advantage/North America",
"OpenTime" : "2007-09-02T07:51:00+00:00",
"OpenedBy":"Jurr.Fleijs",
"ProblemType" : "incident",
"ResolutionFixType" : "incident",
"SLAAgreementID" : 168,
"Service" : "E-mail / Webmail (North America)",
"SiteCategory" : "incident",
"Solution" : ["Solution by rest api"],
"Status" : "Work In Progress",
"Subarea" :"function or feature not working",
"TicketOwner" : "Jurr.Fleijs",
"Title" : "test",
"UpdatedBy" : "problem",
"UpdatedTime" : "2008-08-04T12:54:26+00:00",
"Urgency" : "3",
"UserPriority": "3 - Average",
"explanation" : ["test"],
"folder" :"advantage"

              }
}


1.1.1.5.3. Attachment operations using the
RESTful API

Service Manager supports all typical attachment operations using its web services (SOAP API)
or RESTful API. These operations include: get attachment information, get (single) attachment,
delete (single) attachment, insert attachment, and so on.

The following topics describes how to perform typical attachment operations by using the
RESTful API. It provides information about the services published by Service Manager, and
explains requests of an external application being sent to Service Manager, as well as the
responses to expect.

            Tip

           This topic describes attachment operations that you can perform using the Service
           Manager REST API. For information about attachment operations using the Service
           Manager web services, see Attachment operations using the SOAP API.

When an external system sends a RESTful request, you can first look at the service document:

http://<SM server>:<port>/SM/9/rest

Information of RESTful services of all available objects can be found in the document retrieved.
The following table contains the part returned for Incident.

Resource type                           Supported methods  URI
Resource Collection                     GET/POST
                                                           http://localhost:13080/SM/9
Single Resource                         GET/POST/PUT       /rest/incidents

Resource Attachment                     GET/POST/DELETE    http://localhost:13080/SM/9
Collection                                                 /rest/incidents/{number}

Resource Single Attachment GET/PUT/DELETE                  http://localhost:13080/SM/9
                                                           /rest/incidents/{number}/att
                                                           achments

                                                           http://localhost:13080/SM/9
                                                           /rest/incidents/{number}/att
                                                           achments/{id}

The target object of a request is determined by the URI, and the operation executed is
determined by the HTTP method of the request. The table above lists supported methods.


            Tip

           The Content-Disposition request header is required for attachment POST/PUT
           action. Value is attachment;filename=filename; . Note that the semicolon is
           reserved for character separator and it's not allowed in file name. For example:
           Content-Disposition: attachment;filename*=UTF-
          8%E6%99%93%E6%B9%984.txt

Examples:

     A GET request on the Resource Attachment Collection URI returns a JSON document with
     all the attachments IDs.
     A GET request on the Resource Single Attachment URI downloads the attached file
     identified by ID.
     A DELETE request on the Resource Single Attachment URI deletes the file attachment
     identified by ID.

            Tip

           You can enter a GET HTTP message in the address bar of the browser, which is
           comfortable for testing. In order that Service Manager accepts these requests,
           enable the restaccessviabrowser:1 parameter for the servlet. For REST requests
           using other HTTP methods such as GET, testing in the browser address bar is
           impossible. You can use tools for web services testing or use available browser
           plugins for testing.

Retrieve attachment information

Execute a GET request on the Resource Attachment Collection of an incident identified by
incident number.

http://localhost:13080/SM/9/rest/incidents/IM10003/attachments

The response received is a JSON document that resembles the following:


  {
  "@start": 1,
  "@count": 29,
  "ReturnCode": 0,
  "Messages": [],
  "ResourceName": "attachment",
  "@totalcount": 29,
  "content": [
  {"attachment": {
  "len": 2671,
  "name": "test.jpg",
  "href": "cid:676A50F922E10AC400006CC400003BA0",
  "type": "image/jpeg",
  "xmime:contentType": "image/jpeg"
  }},
  [ .. ]
  }

In this example, incident IM10003 has 29 attachments, and for each the JSON document
contains information such as the attachment id (href), length in bytes (len), file name (name),
file type (type), and xmime type (xmime:contentType).

Download an attached file

With the attachment information retrieved, you can find the attachment id (href attribute) and
then send a GET request to download the attachment file:
http://localhost:13080/SM/9/rest/incidents/IM10001/attachments/58ac7b3200242211802b29a8
If you test this using a browser, the browser should show that a file is being downloaded.

Delete an attachment

When sending the same URI with HTTP method DELETE instead of GET, the attachment is
deleted.
This is impossible by using the browser address bar, and therefore either a tool or plugin is
required, or implementation like HTML page with JavaScript implementation is required.
The following is a demonstration HTML page to demonstrate deleting an attachment by using a
REST request.

            Note

           Your browser may not allow access because of security restrictions. To learn more,
           you can search for online information about "Cross-Origin Resource Sharing".


<!DOCTYPEl>

<html>

<head>

<script language="javascript">

function sendrequest(method, url, contenttype, user, password, sync,

request, callback)

{

// Create a XMLHttpRequest object

var ajax = null;

if(window.XMLHttpRequest){              //Google Chrome, Mozilla Firefox,

Opera, Safari, IE 10

ajax = new XMLHttpRequest();

}

else

{

return;

}

// Add data to ajax object

ajax.open( method, url, sync, user, password );

if (contenttype) ajax.setRequestHeader("Content-Type", contenttype);

if (!sync)

{

// Define how response will be processed

ajax.onreadystatechange = function()

{

var result = {};

switch (this.readyState)

{

case 0: result.status = "ReadyState: " + this.readyState; break;

case 1: result.status = "ReadyState: " + this.readyState; break;

case 2: result.status = "ReadyState: " + this.readyState; break;

case 3: result.status = "ReadyState: " + this.readyState; break;

case 4:

{

var result = {};

result.status = ajax.status;

result.response = ajax.responseText;

if (callback) callback(result);

break;

}

}

updatePage(result.status, result.response);

return result;

}


}
// send the request
if (request) ajax.send( request );
else ajax.send();
if (sync)
{
var result = {};
result.status = ajax.status;
result.response = ajax.responseText;
updatePage(result.status, result.response);
if (callback) callback(result);
}
}
function updatePage(status, response)
{
document.getElementById("status").innerHTML=status;
document.getElementById("response").value=response;
}
</script>
</head>
<body>
<h1>Test SM RestfulAPI</h1>
Request: <textarea id="request" width="80" height="60"></textarea>
<p></p>
Status: <p id="status"></p>
Response: <textarea id="response" width="80" height="60"></textarea>
<script language="javascript">
// Defaults
var method = "GET"
var request = null;
var contenttype = null;
var sync = false;
// Credentials
var user = "falcon";
var password = "";
// TEST
var method = "DELETE";
var URL =
"http://localhost:13080/SM/9/rest/incidents/IM10001/attachments/58ac7b3
200242211802b29a8";
sendrequest(method, URL, contenttype, user, password, sync, request);
</script>
</body>
</html>


Attach a new file to an incident

Execute a POST request to attach a file to an incident identified by incident number.
Here is an example using ReadyAPI:
URL:
http://<server>:<port>/SM/9/rest/incidents/<incidentid>/attachments
Add a header:
Key: Content-Disposition
Value: attachment;filename=<filename.filetype>
Select a Media Type: <content type>
Attach a file to request.
If you have multiple attachments, add them one by one.


1.1.1.6. Web Services debugging parameters

Three parameters are most frequently used: debughttp:1, RTM:3, and debugdbquery:999. It
may be useful to use the msglog:1 parameter to have all messages written to the sm.log as
well, especially for Connect-It Web Services integrations. As a best practice, put these debug
parameters on the dedicated Web Services port such as shown below:

  sm -httpPort:13087 –debugnode –debughttp:1

The debughttp parameter

Add the debughttp in the server sm.ini file or in the dedicated servlet container line of the
sm.cfg file, restart the Service Manager server and rerun the Web service application to invoke
the debugging parameter.
For consuming Web Services, the debughttp parameter writes to two files in the Service
Manager server log directory, http.log and writes additional information into the sm.log file.
An excerpt of the http.log file follows. (To determine which areas of the log file are for the Web
service call, search for “sm7server/ws”. Regular client communication uses SOAP UI instead.)


POST /sm7webserver/ws HTTP/1.1
content-type: text/xml;charset=UTF-8
soapaction: "EnableNewEmployee"
user-agent: Jakarta Commons-HttpClient/3.0.1
host: <server>:<port>
content-length: 2033
<soapenv:Envelope
xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
xmlns:pws="http://servicecenter.peregrine.com/PWS" xmlns:com=
"http://servicecenter.peregrine.com/PWS/Common">
<soapenv:Header/>
<soapenv:Body>
<pws:EnableNewEmployeeRequestQuoteRequest attachmentInfo="?
attachmentData="?" ignoreEmptyElements="true">
<pws:model query="?">
<pws:keys query="?">
<!--Optional:-->
<pws:number type="String" mandatory="?"
readonly="?">?</pws:number>
</pws:keys>
<pws:instance query="?" uniquequery="?" recordid="?">
<!--Optional:-->
<pws:Priority type="String" mandatory="?"

 readonly="?">?</pws:Priority>
<!--Optional:-->
<pws:Reason type="String" mandatory="?" readonly="?"
?</pws:Reason>
<!--Optional:-->
<pws:RequestingDepartment type="String" mandatory="?"

 readonly="?">?</pws:RequestingDepartment>
<!--Optional:-->
<pws:Requestor type="String" mandatory="?" readonly="?">?
</pws:Requestor>
<!--Optional:-->
<pws:Location type="String" mandatory="?" readonly="?">?
</pws:Location>
<!--Optional:-->
<pws:HireType type="String" mandatory="?" readonly="?">?
</pws:HireType>
<!--Optional:-->
<pws:attachments>
<!--Zero or more repetitions:-->
<com:attachment
href="Service_Manager:9.61_Codeless/webservicesguide/reference/?"


  contentId="?" action="?
  name="?" type="?" len="attachmentType="?"/>
  </pws:attachments>
  </pws:instance>
  <!--Optional:-->
  <pws:messages>
  <!--1 or more repetitions:-->
  <com:message type="String" mandatory="?" readonly="?"
  severity="?" module="?">?</com:message>
  </pws:messages>
  </pws:model>
  </pws:EnableNewEmployeeRequestQuoteRequest>
  </soapenv:Body>
  </soapenv:Envelope>
  HTTP/1.1 401
  Set-Cookie: JSESSIONID=94DCC5F90495E0202B84EFB1F998195A;

    Path=/sc62server
  WWW-Authenticate: Basic realm="CASM"
  Connection: close
  Content-Type: textl;charset=utf-8
  Content-Length: 40
  Date: Wed, 21 May 2008 17:16:05 GMT

Interpreting the http.log

The http.log may contain encoded or compressed messages from the Windows or Web Client
communication. See below to turn off SOAP compression and FastInfoset encoding. Web
Services communications aren't encoded nor compressed.
The http.log contains information on all Processes/Threads that connect to the traced servlets.
If more than one Process/Thread is traced, information in the log may overlap from different
sessions, resulting in multiple POST or GET messages together rather than the POST – GET
pair you would expect.
To turn off FastInfoset and compression for the clients, follow these steps:

   1. On the shortcut starting the Windows client, add –DFastInfoset=false to the target.
   2. The command line argument for the Service Manager Windows client is:

     -vmargs -option1 -option2
   3. As an example, if -DFastInfoset=false is the only command line option ensure your

     command line is:
     -vmargs -DFastInfoset=false


   4. Turn off Compress SOAP Messages on the File - Connect – Connections screen’s
     Advanced tab.

   5. For the Web client, turn off FastInfoset by setting the JAVA Option -DFastInfoset=false. As
     an example, to turn off FastInfoset on Tomcat 5.5 or later, follow these steps:
        1. Go to the Apache Tomcat x.x folder on the Start Menu.
        2. Start the Configure Tomcat application.
        3. Select the Java tab in the configuration dialog.

   6. Turn off the Compress SOAP Messages by editing the ...\WEB-INF\web.xml file.

          <!-- Compress network communication between the application server
          and the HP Service Manager server -->
          <init-param>
          <param-name>compress_soap</param-name>
          <param-value>false</param-value>
          </init-param>

RTM:3 and debugdbquery:999

Sometimes the Web Service itself is working correctly, but actions performed by the Document
Engine within Service Manager aren't performing as expected. (Error Message: soap_serve -
Caught XML API exception scxmlapi(19) - Doc Engine call failed with cc -1)The RTM:3 and
debugdbquery:999 parameters can expose such issues that occur within the application layer
of Service Manager. The debugging information produced by these parameters can be found
in the sm.log file in the Service Manager server RUN directory. It's not necessary to restart
Service Manager to activate these debug parameters. Reconnecting the Web Service to
Service Manager triggers the use of these debug parameters.

The allowwsdlretrieval parameter

This parameter is used to allow retrieval of the WSDL without having the SOAP UI license.

Contents

     1 The debughttp parameter
     2 Interpreting the http.log
     3 RTM:3 and debugdbquery:999
     4 The allowwsdlretrieval parameter


1.1.1.7. Web Services special parameters

The internalURI parameter enables you to load Web Service (WSDL) when your server can't
access the Internet.

To work with Web Service without internet access, follow these steps:

   1. Stop the Service Manager server.
   2. Open the sm.ini file with a text editor. By default, the file is in the C:\Program

     Files\OpenText\Service Manager\Server\RUN folder on the Service Manager server.
   3. Add the internalURI parameter into sm.ini .
   4. Save your update.
   5. Restart the Service Manager server.

Related topics

Enter a parameter in the sm.ini file


1.1.1.8. Testing your WSDL with a SOAP UI

To read the WSDL, go to File > New Project and enter a project name as well as the initial
WSDL location and click on OK. The list of methods will be displayed on the left, the request is
in the middle, the response on the right.
To pass authentication information, enter the Username and Password. If the password is
blank, enter information and then remove the information again.

            Note

           SoapUI fills in each field value with a question mark symbol. For correct
           processing, remove these ? before submitting the request.
````
