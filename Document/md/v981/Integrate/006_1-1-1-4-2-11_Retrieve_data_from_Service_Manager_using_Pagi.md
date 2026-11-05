---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.1.1.4.2.11 .. 1.1.1.4.2.15
printed_pages: 141-168
---

# 1.1.1.4.2.11 Retrieve data from Service Manager using Pagination

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.1.4.2.11. Retrieve data from Service
Manager using Pagination

Retrieving a list of data objects may result in a very large XML response document that could
cause performance and memory utilization issues either on the client or the server. To avoid
these problems, Service Manager supports the use of pagination, the process of returning
pages of data instead of one large response.

To enable pagination, a Web service request can make use of these additional attributes:

     count – number of records/keys to return. By default all records are returned. This
     attribute indicates you want to use pagination. (Optional attribute)
     start – the starting record/key number. By default a retrieve request will start at record 0.
     (Optional attribute)
     handle – a record-list handle returned on a previous retrieve request that specified a
     count.

When pagination is used, the Web service does the following:

     If there is not a 'start' or 'count' attribute, the service returns all records or keys.
     With a valid 'start' value and 'no count' attribute, the service returns all records starting
     from the 'start' attribute.
     With a valid 'start' attribute and valid 'count' attribute, the service returns the number of
     keys or records starting from the 'start' attribute.
     With a negative 'start' attribute, the service returns records from the first record and
     creates a warning in log file.
     With a negative 'count' attribute, the service returns one record and creates a warning
     message in the log file.
     With the 'start' attribute greater than the total number of records or keys, the service
     returns no records and creates a message in the error log file.

Example: Use Web Service with pagination to retrieve
data from Service Manager

In the previous example the Web Service returned a list of eight Incident keys. To illustrate
pagination, this example limits the number of records to returned to four. This requires the use
of the additional attributes count and start.

For example to limit the response to a maximum of eight records starting at the first record:

Request with pagination


<?xml version="1.0" encoding="UTF-8" ?><soapenv:Envelope
xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
xmlns:pws="http://servicecenter.peregrine.com/PWS"
xmlns:com="http://servicecenter.peregrine.com/PWS/Common">

       <soapenv:Header/>
         <soapenv:Body>
              <pws:RetrieveIncidentKeysListRequest attachmentInfo="?"
                  attachmentData="?" ignoreEmptyElements="true" count=8

start=0>
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


</pws:Location>
<pws:IncidentDescription type="Array">
<pws:IncidentDescription type="String" mandatory="?"
readonly="?"></pws:IncidentDescription>
</pws:IncidentDescription>
<pws:Resolution type="Array">
<pws:Resolution type="String" mandatory="?"

   readonly="?"></pws:Resolution>
</pws:Resolution>
<pws:AssigneeName type="String" mandatory="?"
readonly="?">
</pws:AssigneeName>
<pws:Contact type="String" mandatory="?" readonly="?">
</pws:Contact>
<pws:JournalUpdates type="Array">
<pws:JournalUpdates type="String" mandatory="?"

   readonly="?"></pws:JournalUpdates>
</pws:JournalUpdates>
<pws:AlertStatus type="String" mandatory="?"
readonly="?">
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

   readonly="?">
</pws:TicketOwner>
<pws:UpdatedBy type="String" mandatory="?"

   readonly="?">falcon</pws:UpdatedBy>
<pws:IMTicketStatus type="String" mandatory="?"
readonly="?"></pws:IMTicketStatus>
<pws:Subcategory type="String" mandatory="?"
readonly="?">
</pws:Subcategory>
<pws:SLAAgreementID type="Decimal" mandatory="?"
readonly="?"></pws:SLAAgreementID>
<pws:SiteCategory type="String" mandatory="?"
readonly="?">
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

Response with pagination

The response indicates that eight records were returned (count=8). In addition the response
indicates that there are more records to retrieve (more=1).


  <?xml version="1.0" encoding="utf-16"?>
  <SOAP-ENV:Envelope xmlns:SOAPENV="
  http://schemas.xmlsoap.org/soap/envelope/">
  <SOAP-ENV:Body>
  <RetrieveIncidentKeysListResponse count=8 more=1
  handle=probsummary4d67db480000c0082000f1a0 message="Success" query=""
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
  </RetrieveIncidentKeysListResponse>
  </SOAP-ENV:Body>
  </SOAP-ENV:Envelope>

Next pagination request


To retrieve the next page of records the request would increment the start attribute by the
previous count and supply the handle returned on the previous response.
This request is for the next set of records.


<?xml version="1.0" encoding="UTF-8" ?>
<soapenv:Envelope
xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
xmlns:pws="http://servicecenter.peregrine.com/PWS"
xmlns:com="http://servicecenter.peregrine.com/PWS/Common">
<soapenv:Header/>
<soapenv:Body>
<pws:RetrieveIncidentKeysListRequest attachmentInfo="?"
attachmentData="?" ignoreEmptyElements="true" count=8 start=8 handle=
probsummary4d67db480000c0082000f1a0>
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
</pws:Location>
<pws:IncidentDescription type="Array">
<pws:IncidentDescription type="String" mandatory="?"
readonly="?"></pws:IncidentDescription>
</pws:IncidentDescription>
<pws:Resolution type="Array">
<pws:Resolution type="String" mandatory="?"
readonly="?"></pws:Resolution>
</pws:Resolution>
<pws:AssigneeName type="String" mandatory="?"
readonly="?">
</pws:AssigneeName>
<pws:Contact type="String" mandatory="?" readonly="?">
</pws:Contact>
<pws:JournalUpdates type="Array">
<pws:JournalUpdates type="String" mandatory="?"
readonly="?"></pws:JournalUpdates>
</pws:JournalUpdates>
<pws:AlertStatus type="String" mandatory="?"
readonly="?">
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
readonly="?">
</pws:TicketOwner>
<pws:UpdatedBy type="String" mandatory="?"
readonly="?">falcon</pws:UpdatedBy>
<pws:IMTicketStatus type="String" mandatory="?"
readonly="?"></pws:IMTicketStatus>
<pws:Subcategory type="String" mandatory="?"
readonly="?">
</pws:Subcategory>
<pws:SLAAgreementID type="Decimal" mandatory="?"
readonly="?"></pws:SLAAgreementID>
<pws:SiteCategory type="String" mandatory="?"
readonly="?">
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

Next pagination response

The response indicates that one record was returned (count=1). In addition, the response
indicates that there are no more records to retrieve (more=0).


<?xml version="1.0" encoding="utf-16"?>
<SOAP-ENV:Envelope xmlns:SOAPENV="
http://schemas.xmlsoap.org/soap/envelope/">
<SOAP-ENV:Body>
<RetrieveIncidentKeysListResponse count=1 more=0
handle=probsummary4d67db480000c0082000f1a0 message="Success" query=""
returnCode="0" schemaRevisionDate="2007-04-14"
schemaRevisionLevel="1" status="SUCCESS"
xsi:schemaLocation="http://servicecenter.peregrine.com/PWS
http://<sm server>.americas.hpqcorp.net:13701/sc62server/ws/
Incident.xsd" xmlns="http://servicecenter.peregrine.com/PWS"
xmlns:cmn="http://servicecenter.peregrine.com/PWS/Common"
xmlns:xsd="http://www.w3.org/2001/XMLSchema"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
<keys>
<IncidentID type="String">IM10061</IncidentID>
</keys>
</RetrieveIncidentKeysListResponse>
</SOAP-ENV:Body>
</SOAP-ENV:Envelope>


1.1.1.4.2.12. Retrieve data from Service
Manager for Optimistic Locking

You can retrieve data via a Web service for later use in an update using optimistic locking by
using an additional attribute:

     updatecounter – a boolean value specifying if the response should include the attribute
     updatecounter that can be used on a subsequent update request to optimistically lock the
     record. The value returned in the updatecounter attribute can be specified on a
     subsequent update request as the value of the updatecontraint attribute. If the value of
     the updateconstraint matches the value in the database the update is allowed. If the
     updateconstraint value doesn't match the value in the database the update is rejected
     with a return code of 51 and the message “Record modified since last retrieved”

For example to retrieve the data with the updatecounter.

Request with updatecounter

  <?xml version="1.0" encoding="UTF-8" ?>
    <soapenv:Envelope
    xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:pws="http://servicecenter.peregrine.com/PWS"
    xmlns:com="http://servicecenter.peregrine.com/PWS/Common">
    <soapenv:Header/>
    <soapenv:Body>
    <pws:RetrieveIncidentKeysListRequest attachmentInfo="?"
    attachmentData="?" ignoreEmptyElements="true">
    <pws:model query="" updatecounter=true>
    …
    …

  …

Response with updatecounter

The response indicates the updatecounter for each record returned.


<?xml version="1.0" encoding="utf-16"?>
 <SOAP-ENV:Envelope xmlns:SOAPENV="
 http://schemas.xmlsoap.org/soap/envelope/">
 <SOAP-ENV:Body>
 <RetrieveIncidentKeysListResponse count=8 more=1
 handle=probsummary4d67db480000c0082000f1a0 message="Success" query=""
 returnCode="0" schemaRevisionDate="2007-04-14"
 schemaRevisionLevel="1" status="SUCCESS"
 xsi:schemaLocation="http://servicecenter.peregrine.com/PWS
 http://<sm server>.americas.hpqcorp.net:13701/sc62server/ws/
 Incident.xsd"
 xmlns="http://servicecenter.peregrine.com/PWS"
 xmlns:cmn="http://servicecenter.peregrine.com/PWS/Common"
 xmlns:xsd="http://www.w3.org/2001/XMLSchema"
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
 <keys updatecounter=”7”>
 <IncidentID type="String">IM10001</IncidentID>
 </keys>
 <keys updatecounter =”45”>
 <IncidentID type="String">IM10004</IncidentID>
 </keys>
 <keys updatecounter =”9”>
 <IncidentID type="String">IM10009</IncidentID>
 </keys>
 <keys updatecounter =”13”>
 <IncidentID type="String">IM10016</IncidentID>
 </keys>
 …
 …

…


1.1.1.4.2.13. Web Services examples in the RUN
directory

All valid Web Services examples for Axis and .NET are contained in
the https://portal.microfocus.com/s/article/KM000003929 knowledge document.
Both the AxisSample and the DotNetSample directories contain documents with setup
instructions. In AxisSample this document is readme.txt. In DotNetSample the document is
WebServices README.doc.

The AxisSample\bin directory contains a selection of batch files that can be run directly, if JDK
1.4 or higher and Apache Ant are both installed on the machine. The DotNet samples have to
be compiled before running.

            Note

           Axis 1.x defaults to using its own httpSender class which is not compatible with
           HTTP 1.1 Keep-Alive. Axis 1.x must be configured to use the commons-httpclient jar
           file in order to get keep-alive behavior. Running the Web Service without Keep-
           Alive negatively impacts performance. The Web Service client needs to be Cookie
           aware so that the servlet container session is maintained. You need to use Axis 2
           that provides HTTP 1.1 keep-alive support and cookie-aware behavior.

Example: Retrieving Service Manager Release
Management changes into a text file using Connect-It

   1. Create the Service Manager Web Services Connector with the following connection
     parameter settings. (All other settings remain the defaults.)

     • Server name: <server>:<httpPort (use a dedicated port, not the loadBalancer port)>

     • Context Path: sc62server/PWS

     • Service name: Change Management

     • Enter the SysAdmin userID and password
   2. Click Test to verify that the connection works.
   3. Click Finish to save the changes made to the new connector.

   4. In our example, the Web Service simply fills information into a delimited text field. The
     settings for that connector are as follows:

     • Name: Changes

     • Processing Mode: write

     • Connection protocol: Local / network files


  • Enter a folder name and decide whether to create a separate file for each record
  retrieved or write all records into one file (recommended).

  • On the next screen, decide whether to append to the same file (recommended) or
  overwrite with each run, or how many files to keep.

  • Enter the path to the descriptor file (see below) or create a new descriptor file.
5. Click Finish to create and save the connector.

  To create a description file for the text output file (comma delimited text in our example),
  the following code is a sample .dsc file that can be used for retrieving change
  information:

          { TextFileFormat SMChange                        Service Manager 9.81
                        Extension=                                        Page 155 of 1727
                        FormatType=Delimited
                        EscapeChar="\\"
                        Quote="\""
                        Extracolumn=1
                        WriteColumn=1
                        Delimiter=,
                        { String "Change Number"
                                       UserType=Default
                        }
                        { String "Category"
                                       UserType=Default
                        }
                        { String "Status"
                                       UserType= Default
                        }
                        { String "Approval Status"
                                       UserType=Default
                        }
                        { String "Requested By"
                                       UserType=Default
                        }
                        { String "Assigned To"
                                       UserType= Default
                        }
                        { String "Coordinator"
                                       UserType=Default
                        }
                        { String "Coordinator Phone"
                                       UserType=Default
                        }
                        { TimeStamp "Planned Start Date"
                                       UserType=TimeStamp
                        }
                        { TimeStamp "Planned End Date"
                                       UserType=TimeStamp
                        }
                        { String "Reason"
                                       UserType=Default
                        }
                        { String "Current Phase"
                                       UserType= Default
                        }

This PDF was generated on May 23, 2026

                        { String "Risk Assessment"

                                       UserType=Default

                        }

          }

   6. Finally the source (Web Services) data and the target data (Delimited Text file) must be
     mapped, in this case based on the matching names.

   7. Because Web Services need to be prompted to produce output, another text file
     connector must be created that helps create the request sent to the Web service. This
     text file connector is defined as follows:

     • Processing Mode: read

     • Connection Protocol: Local/Network files

     • Location: Read files, file name: <path and filename>

     • Upon successful processing, leave the file in the folder.

     Use this .dsc file. Enter <path and filename> and click Find (magnifying glass) to create
     or modify a description file.

   8. Select a document type. Click the down arrow and enter SMChange.
   9. Click Next.
 10. Select a file for the preview. Accept the default <path and filename from step 6> and click

     Next.
 11. Select the appropriate delimiter.
 12. Enter the information on the screen:

           Write the column headers: checked
           Do not generate errors if a line contains... : checked
           Number of skipped lines: 0
           Quote character: "
           Start of the comment line: //
           Escape character: /
 13. Click Next.
 14. Enter the column names and type: for example, Change Number - text
 15. Click Finish to create and save the connector.
 16. Now create a mapping between this text file and the Service Manager Web Service by
     connecting the two.
 17. Click the first text connector and click Produce Now (the F5 button) to fill information
     from the cm3r file in Service Manager into a delimited text file via Web Services.

Example: Getting change information from another
Service Manager system

This example retrieves change information from the cm3r file and uses the Web Service to
create a new change.


1. Click Tailoring > Web Services > Run WSDL to JS.
2. In the “Please enter the URL for the WSDL file” field, enter the following:

  http://<serenade>:<port number>/sc62server/PWS/ChangeManagement.wsdl
3. Click Proceed and then Add to create the ChangeManagement JavaScript record in the

  ScriptLibrary.

               Note

             Service Manager always uses the user name and password you provided to
             access the remote Web Service unless you override the values at run time.
             For example, create custom JavaScript to use the currently logged in user's
             credentials instead of the user name and password you provided to access
             the remote Web Service.

              function ChangeManagement( )
              {
              this.location = new String(
"http://hostname:13080/sc62server/ws" );
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
              […]

               Note

             The namespace specified in “this.location” doesn't have to be resolvable.

  The user can be filled in here (this.user), or in the invoking script. As a best practice, fill in
  the user in the invoking script.
4. Now that the Script has been added to the ScriptLibrary, you need to write another
  JavaScript that can be used to retrieve the change or create a new change. Enter the
  JavaScript code as listed below:


function RetrieveChangeKeysList(query)

{

try

{

var ChangeMgmtService=new system.library.ChangeManagement.

ChangeManagement();

/////////////////////////////////////////////////////////

//                                      set Connection information (optional)

/////////////////////////////////////////////////////////

ChangeMgmtService.user = "falcon";

ChangeMgmtService.password = "";

/////////////////////////////////////////////////////////

//     create the request object

/////////////////////////////////////////////////////////

var RetrieveChangeListRequest = new system.library.

ChangeManagement.RetrieveChangeKeysListRequest();

/////////////////////////////////////////////////////////

//                                      Request Data Fill Section

///////////////////////////////////////////////////////////////////

/////

if (query!=null)

{

RetrieveChangeListRequest.model.instance.query=query;

}

else

print("Please enter a valid Query statement.")

///////////////////////////////////////////////////////////////////

/////

//     Invoke and final processing

///////////////////////////////////////////////////////////////////

/////

var RetrieveChangesResponse = ChangeMgmtService.invoke(

RetrieveChangeListRequest );

if ( RetrieveChangesResponse.isFault() )
{
print( RetrieveChangesResponse.messages.getContent() );
return(-1);
}
else
{
print("Success")
print(RetrieveChangesResponse.keys[0].ChangeNumber.getValue())
print(RetrieveChangesResponse.keys[1].ChangeNumber.getValue())


return(RetrieveChangesResponse.keys);
}

}
catch( e )
{
print( e );
}

}

function RetrieveChange(number)

{

try

{

var ChangeMgmtService=new

system.library.ChangeManagement.ChangeManagement();

///////////////////////////////////////////////////////////////////

/////

//                                      set Connection information (optional)

///////////////////////////////////////////////////////////////////

/////

ChangeMgmtService.user = "falcon";

ChangeMgmtService.password = "";

///////////////////////////////////////////////////////////////////

/////

//                                      create the request object

///////////////////////////////////////////////////////////////////

/////

var RetrieveChangeRequest = new system.library.ChangeManagement.


RetrieveChangeRequest();

///////////////////////////////////////////////////////////////////

/////

//     Request Data Fill Section

///////////////////////////////////////////////////////////////////

/////

if (number!=null)

{

RetrieveChangeRequest.model.instance.header.ChangeNumber.setValue(n

umber);

}

else

print("Please pass in a valid Change Number.");

///////////////////////////////////////////////////////////////////

/////

//     Invoke and final processing

///////////////////////////////////////////////////////////////////

/////

var RetrieveChangeResponse = ChangeMgmtService.invoke(

RetrieveChangeRequest );

if ( RetrieveChangeResponse.isFault() )
{
print( RetrieveChangeResponse.messages.getContent() );
return(-1);
}
else
{
print("Success")
return(RetrieveChangeResponse.model.instance);
}

}
catch( e )
{
print( e );
}

}

5. Create a JavaScript in the same ScriptLibrary record that reads a change record and then
  creates a new record in the other Service Manager system. Enter the Java Script shown
  below:


function CreateChangeFromChange(change)
 {
              try
              {
                             var ChangeMgmtService=new

system.library.ChangeManagement.
                             ChangeManagement();

///////////////////////////////////////////////////////////////////

//////

//                                      set Connection information (optional)

///////////////////////////////////////////////////////////////////
//////

                             ChangeMgmtService.user = "falcon";
                             ChangeMgmtService.password = "";

///////////////////////////////////////////////////////////////////

//////

//                                      create the request object

///////////////////////////////////////////////////////////////////
//////

                             var CreateChangeRequest = new
system.library.ChangeManagement.

                             CreateChangeRequest();

///////////////////////////////////////////////////////////////////

//

//      Request Data Fill Section

///////////////////////////////////////////////////////////////////
//

                                        if (change!=null)
                                        {

CreateChangeRequest.model.instance.header.Category.

setValue(change.header.Category.getValue());


CreateChangeRequest.model.instance.header.RequestedBy.

setValue(change.header.RequestedBy.getValue());

CreateChangeRequest.model.instance.header.Reason.
                                           setValue(change.header.Reason.getValue());

CreateChangeRequest.model.instance.header.Coordinator.

setValue(change.header.Coordinator.getValue());

CreateChangeRequest.model.instance.InitialAssessment.

setValue(change.InitialAssessment.getValue());
                                           CreateChangeRequest.model.instance.Urgency.
                                           setValue(change.Urgency.getValue());

CreateChangeRequest.model.instance.ReleaseType.
                                           setValue(change.ReleaseType.getValue());

                                           for (var i=0;
i<change.description_structure.

                                           Description.Description.length; i++)
                                           {

CreateChangeRequest.model.instance.description_structure.
                                           Description.Description_newInstance().

setValue(change.description_structure.Description.
                                           Description[i].getValue());
                                           }

                             }
                             else

                                           print("Please pass in a valid Change
Request.");

///////////////////////////////////////////////////////////////////

///

//   Invoke and final processing

///////////////////////////////////////////////////////////////////
///


                             var CreateChangeResponse = ChangeMgmtService.
                             invoke( CreateChangeRequest );

                             if ( CreateChangeResponse.isFault() )
                             {
                       print( CreateChangeResponse.messages.getContent() );
                       return(-1);
                             }
                             else
                             {

                                           print("Success")

return(CreateChangeResponse.model.instance.header.
                                           ChangeNumber.getValue());

                             }

              }
              catch( e )
              {

                             print( e );
              }
 }

///////////////////////////////////////////////////////////////////
////

 // Test Call

///////////////////////////////////////////////////////////////////
////

 var rc_Code_List=RetrieveChangeKeysList("category=\"" + "Release
Management"

                + "\"" + "and number <=\"" + "C10027" + "\"");

 //var rc_Code_List=RetrieveChangeKeysList("number>=\"" + "C10026"
+ "\"");

 if (rc_Code_List != -1)
 {

              for (var i = 0; i < rc_Code_List.length; i+=1)
              {

                             var
rc_Code=RetrieveChange(rc_Code_List[i].ChangeNumber.

                             getValue());
                             var rc_Create=CreateChangeFromChange(rc_Code);


                        }
          }

Example to close an existing incident record

To run an example of closing an existing Incident Record from the Axis2Sample directory,
follow these steps:

   1. Follow the instructions in the Axis README.txt file located in the Axis2Sample\resources
     directory.

   2. Enter the following in the DOS command prompt to close an incident:

          C:\scs\sm920\server\webservices\sample\sm7webservices\
          Axis2Sample\bin>CloseIncidentSample -host <sm server>
          -port <sm port> -username falcon -incidentId IM10001
          -closeCode Fault -resolution "It works now"

            Note

           If the username and password aren't entered, they default to “falcon” with no
           password.


1.1.1.4.2.14. Special considerations for using
Keep-Alive with Service Manager

A Service Manager user session starts when the Service Manager server receives the first
request from a SOAP client and ends when the SOAP client closes the HTTP connection. The
user login process is performed in the first SOAP client request and the user logout process is
performed when the SOAP client ends this Service Manager session. A SOAP client can reduce
the login and logout overhead by enabling HTTP persistent connections, also called HTTP
keep-alive. If you want to use HTTP 1.1 Keep-Alive connections with a SOAP API client, the
SOAP API client must support cookies. When Service Manager responds to the first POST
request from the SOAP API client, it includes a Set Cookie header that conveys the servlet
container sessionid to the client.

     Configure the SOAP stack with which the SOAP API client is written to support cookies.
     Axis and .NET can both be configured to do this.
     If the SOAP toolkit supports HTTP 1.1 Keep-Alive but not cookies, you can arrange for the
     application to echo back the JSESSIONID value in a Cookie header by adding code to the
     client application to manually create the HTTP header on the second and subsequent
     requests

            Note

                In HTTP/1.1, persistent connections are the default behavior of any
                connection.
                If you use HTTP 1.0 you have to manually set the HTTP header “connection”
                to keep-alive.
                A SOAP client ends a Service Manager session by sending a request with the
                HTTP header “connection” set to “close”. If a close request is never received
                by the Service Manager server then this session is terminated by the Service
                Manager server when the webservices_sessiontimeout time is reached.

Keep-Alive example for Service Manager

The following shows an example of the code for using Keep-Alive with Service Manager.

            Note

           In Keep-Alive: timeout=60 , the unit is second.


  ================================================================
  client request:
  POST /SM/9/ws HTTP/1.1
  accept: application/xop+xml, text/xml image/gif, image/jpeg, *; q=.2,
  */*; q=.2
  authorization: Basic ZmFsY29uOg==
  soapaction: "Create"
  connection: Keep-Alive
  .....
  SM server response:
  HTTP/1.1 200
  Set-Cookie: JSESSIONID=ED61093038F9FF8CE9CF44E34C9366AC; Path=/SM
  Keep-Alive: timeout=60, max=100
  Connection: Keep-Alive
  Content-Type: text/xml;charset=utf-8
  Content-Length: 2112
  .....

Then you need to echo back the JSESSIONID for each client use the following:

  POST /SM/9/ws HTTP/1.1
  accept: application/xop+xml, text/xml image/gif, image/jpeg, *; q=.2,
  */*; q=.2
  authorization: Basic ZmFsY29uOg==
  soapaction: "Retrieve"
  connection: Keep-Alive
  cookie: JSESSIONID=ED61093038F9FF8CE9CF44E34C9366AC; Path=/SM;
  ....
  ================================================================

            Note

           If you use Axis2 to implement the client then Axis2 can maintain the session by
           calling the setManageSession(true).
           There is an Axis2 example in SM 9.x installation directory:
           (...\Server\webservices\sample\sm9webservices\Axis2Sample)


1.1.1.4.2.15. Use SSL to consume Service
Manager Web Services

Provide the client keystore and the client keystore password to the Web Service consumer.
This consumer will need to enter this information into the proper location on the client. For
example, in SOAPUI, you can enter this information in the File > Preferences > SSL Settings
section. To find out how to create the client keystore, refer to the Service Manager Trusted
Sign-on White paper. Ensure that the client’s cacerts file contains the information on the
authority that signed the keystore.
````
