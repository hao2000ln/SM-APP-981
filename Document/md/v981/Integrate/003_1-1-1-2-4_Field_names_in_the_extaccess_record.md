---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.1.1.2.4 .. 1.1.1.2.11
printed_pages: 55-86
---

# 1.1.1.2.4 Field names in the extaccess record

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.1.2.4. Field names in the extaccess record

Implementers can change the field name and data type of a Service Manager field when they
publish the field as part of a Web Service. To change the field name and data type of a Service
Manager field, the implementer must specify the Service Manager field in the extaccess record
using one of the formats listed in the following table.


Type of Service Manager                 Format required to specify    Example field listing
field                                   field                         fromthe Web Services API

All primitive fields                    field.name                    initial.impact

array                                   field.name                    misc.array1

field

structure                               structure.name,field.name.1   header,agreement.id
field 1                                 structure.name,field.name.2   header,approval.status
field 2                                 structure.name,field.name.3   header,assigned.to
field 3

array                                   array.name[field.name.1]      affected.ci[ci.assign.group]
structure                               array.name[field.name.2]      affected.ci[ci.device.name]
field 1                                 array.name[field.name.3]      affected.ci[ci.device.type]
field 2
field 3

structure1                              structure.name.1,structure.n  <no example available>
structure2                              ame.2,field.name.1
field 1
field 2                                 structure.name.1,structure.n
field 3                                 ame.2,field.name.2

                                        structure.name.1,structure.n
                                        ame.2,field.name.3


Type of Service Manager                 Format required to specify Example field listing
field
                                        field                        fromthe Web Services API

structure 1                             structure.name.1,array.name  <no example available>
array                                   [field.name.1]
structure 2
field 1                                 structure.name.1,array.name
field 2                                 [field.name.2]
field 3
                                        structure.name.1,array.name
                                        [field.name.3]


1.1.1.2.5. Create dedicated Web Services
listeners

A Service Manager system configured for vertical or horizontal scaling uses a Load Balancer to
redirect client connection requests to an available Service Manager process. A system that
also has many Web Services may need a Load Balancer for multiple nodes. Service Manager's
Web Services don't support HTTP redirect, and will fail to clean up the resources on the
Service Manager loadBalancer process, if the loadBalancer port is used as the endpoint URL.
For this reason, we recommend creating one or more Service Manager processes dedicated to
Web Services requests. You can then configure any external Web service clients to connect
directly to the dedicated Service Manager processes. If your system needs a load balancer,
use a hardware load balancer to balance between a set of servlets with the debugnode
parameter.

   1. Sign in to the host running Service Manager with an administrator account.
   2. Stop the Service Manager server.

                   Note

                It's not necessary to stop and start the Service Manager server to add a new
                port. You can add the line to the sm.cfg file while the system is running and
                start that same port from a command prompt manually.

   3. Open the sm.cfg file, and create a dedicated Service Manager process to listen for Web
     Services requests using the -debugnode parameter. For example, the following entries
     create a dedicated process listening on ports 13085 and 13445.

          sm -httpPort:13080 -loadbalancer
          sm -httpPort:13081 -httpsPort:13443
          sm -httpPort:13083 -httpsPort:13444
          sm -httpPort:13085 -httpsPort:13445 -debugnode

                   Note

                The debugnode parameter tells the Service Manager Load Balancer not to
                forward any client connection requests to this Service Manager process. Only
                clients that directly connect to the process can access it.

   4. Restart the Service Manager server.
   5. Configure any external web service clients to connect directly to the Service Manager

     processes running in debugnode. For example, set the endpoint URL to http://<fully
     qualified host name>:13085/SM/7/<Service Name> for normal connections and set the


URL to https://<fully qualified host name>:13445/SM/7/<Service Name> for SSL-
encrypted connections.


1.1.1.2.6. Data conversion between Service
Manager and SOAP Web Services

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

For example, the Service Manager Web Services API publishes the Service Manager field
closed.time as ClosedTime in the IncidentManagement service. The Web Services API
converts the outbound Service Manager data into the appropriate ISO 8601 date format for
XML schema. When the Web Service responds, the Web Service API converts the ISO-
formatted date back into a Service Manager date format. Here is an example: the conversion
between 1994-11-05T08:15:30-05:00 and November 5, 1994, 8:15:30 am, US Eastern Standard
Time by the Web Services API.

The services, objects, and fields published in the Service Manager Web Services API already
have the proper XML schema data mappings listed in the Web Services definition (extaccess
record). If the extaccess record doesn't list a data type mapping, then the Web Services API
treats the field data as a string field. Typically, you only need to add or change a Web Services
API data type mapping to publish custom fields you have added to Service Manager as Web
Services objects.

            Caution

           Changing the Web Services API data type mappings for existing fields in the
           Service Manager Web Services API may result in data mismatch errors.


1.1.1.2.7. Example: Publish the Terminate
Change functionality by using Web Services

In the default Service Manager system, the Terminate Change functionality is not published via
Web Services.
To publish the Terminate Change functionality, follow the steps described in this section.


1.1.1.2.7.1. Create a display option

Add a Display Option record to eliminate the prompt for a closure code and closing comments.

Field                                   Value
Screen ID                               cm.view.display
Modifies Record                         Leave blank
Action                                  terminatebg
Unique ID                               cm.view.display_terminatebg
GUI option                              6
Balloon Help (If Option < 200)          Terminate Change
Text Option                             6
Default Label                           Terminate Background
Bank                                    1
Text Alternative                        Leave blank
Condition                               evaluate($L.tableAccess.close) and open
                                        in $L.file=true and nullsub($G.ess,
User Condition                          false)=false and (category in
RAD tab                                 $L.file="Release Management" and
PreRad Expressions subtab               ($phasepntr=3 or $phasepntr=2 or
                                        $phasepntr=1))
                                        $G.bg=true

                                        $terminate.release=true


1.1.1.2.7.2. Create a new process

Enter the following values in the Process Definition record to create the terminate.release.bg
Process record.

Field                                   Value
Process Name                            terminate.release.bg
Run in Window?                          Select this option

RAD tab

Expressions evaluated before RAD call

$L.file.vars={$L.category, $L.phase, $L.fc, $L.fc.master}
if (index(current.phase in $L.file, phases in
$L.category)=lng(denull(phases in $L.category))) then ($L.last=true)
else ($L.last=false)

Field                                   Value

RAD Application                         sla.confirm.outage

Condition                               $L.last and enable in$G.sla.environment

Parameter Names                         file

Parameter Values                        $L.file

Expressions evaluated before RAD call

$L.terminated.parent.name=number in
$L.file;$terminate.ok=true;$terminate.
release=true


Field                                   Value

RAD Application                         cm3.close.child.tasks

Condition                               true

Parameter Names                         name

Parameter Values                        $L.terminated.parent.name

Expressions evaluated before RAD call

$phasepnt=7;current.phase in $L.file="Verification"
status in $file="terminated"

Field                                   Value
RAD Application
Condition                               cm.close
Parameter Names
                                        true
Parameter Values
                                        record
                                        second.file
                                        boolean.1
                                        prompt

                                        $L.file
                                        $L.object
                                        $L.bg
                                        $L.exit


1.1.1.2.7.3. Set up a State record

Add the following entries to the cm.view State record.

     Display Action: terminatebg
     Process Name: terminate.release.bg
     Condition: true
     Save First: (leave blank)


1.1.1.2.7.4. Set up an extaccess record

Follow these steps:

   1. Update the extaccess record to expose this function. Select the extaccess record with
     Name = cm3r. Type TerminateChange in Object Name and click Add.

   2. Add the following entries to the extaccess record:

           Allowed Actions: terminatebg
           Actions: Terminate
           Action Type(Leave Blank)

   3. If you want to use RESTful API, on RESTful tab, type the following:

Field                                   Value
RESTful Enabled
Attachment Enabled                      Checked

Resource Collection Name                Checked if you want to use attachment
Resource Name                           later.
Unique Keys
Max Records Returned in Query           terminatechanges
Query Authorization
                                        TerminateChange
Resource Collection Actions: POST
Resource Actions:POST                   header,number
Resource Actions:PUT
                                        1,000

                                        lioption("Change Management") and
                                        (index("SysAdmin", $lo.ucapex)>0 or
                                        index("ChMAdmin", $lo.ucapex)>0 or
                                        index("change request", $lo.ucapex)>0)

                                        Create

                                        Update

                                        Update


1.1.1.2.7.5. Execute a request via SOAP Web
Services

Execute the following request by using SOAP Web Services.

            Note

           The change number has to be a change of the Release Management category.
           ClosingComments and ClosureCode are required fields for terminating a Release
           Management change.


<soapenv:Envelope
xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
xmlns:pws="http://servicecenter.peregrine.com/PWS"
xmlns:com="http://servicecenter.peregrine.com/PWS/Common">
<soapenv:Header/>
<soapenv:Body>
<pws:TerminateChangeRequest attachmentInfo="?" attachmentData="?"
ignoreEmptyElements="true">
<pws:model query="">
<pws:keys query="">
<!--Optional:-->
<pws:ChangeNumber type="String" mandatory="?"
readonly="?">C10027</pws:ChangeNumber>
</pws:keys>
<pws:instance query="" uniquequery="?" recordid="?">
<pws:header type="Structure">
<!--Optional:-->
<pws:ChangeNumber type="String" mandatory="?"
readonly="?"></pws:ChangeNumber>
<!--Optional:-->
<pws:Category type="String" mandatory="?"
readonly="?"></pws:Category>
<!--Optional:-->
<pws:Status type="String" mandatory="?"
readonly="?">terminated</pws:Status>
<!--Optional:-->
<pws:ApprovalStatus type="String" mandatory="?"
readonly="?"></pws:ApprovalStatus>
<!--Optional:-->
<pws:RequestedBy type="String" mandatory="?"
readonly="?"></pws:RequestedBy>
<!--Optional:-->
<pws:AssignedTo type="String" mandatory="?"
readonly="?"></pws:AssignedTo>
<!--Optional:-->
<pws:Coordinator type="String" mandatory="?"
readonly="?"></pws:Coordinator>
<!--Optional:-->
<pws:CoordinatorPhone type="String" mandatory="?"
readonly="?"></pws:CoordinatorPhone>
<!--Optional:-->
<pws:PlannedStartDate type="DateTime" mandatory="?"
readonly="?"></pws:PlannedStartDate>
<!--Optional:-->

  <pws:PlannedEndDate type="DateTime" mandatory="?"   Service Manager 9.81
  readonly="?"></pws:PlannedEndDate>                                   Page 69 of 1727
  <!--Optional:-->
  <pws:Reason type="String" mandatory="?"
  readonly="?"></pws:Reason>
  <!--Optional:-->
  <pws:CurrentPhase type="String" mandatory="?"
  readonly="?"></pws:CurrentPhase>
  <!--Optional:-->
  <pws:RiskAssessment type="String" mandatory="?"
  readonly="?"></pws:RiskAssessment>
  <!--Optional:-->
  <pws:Priority type="String" mandatory="?"
  readonly="?"></pws:Priority>
  <!--Optional:-->
  <pws:DateEntered type="DateTime" mandatory="?"
  readonly="?"></pws:DateEntered>
  <!--Optional:-->
  <pws:Open type="Boolean" mandatory="?"
  readonly="?"></pws:Open>
  <!--Optional:-->
  <pws:BackoutDuration type="Duration" mandatory="?"
  readonly="?"></pws:BackoutDuration>
  <!--Optional:-->
  <pws:CloseTime type="DateTime" mandatory="?"
  readonly="?"></pws:CloseTime>
  <!--Optional:-->
  <pws:ForeignID type="String" mandatory="?"
  readonly="?"></pws:ForeignID>
  <!--Optional:-->
  <pws:RFCType2 type="String" mandatory="?"
  readonly="?"></pws:RFCType2>
  <!--Optional:-->
  <pws:Company type="String" mandatory="?"
  readonly="?"></pws:Company>
  <!--Optional:-->
  <pws:BriefDescription type="String" mandatory="?"
  readonly="?"></pws:BriefDescription>
  <!--Optional:-->
  <pws:Subcategory type="String" mandatory="?"
  readonly="?"></pws:Subcategory>
  <!--Optional:-->
  <pws:SLAAgreementID type="Int" mandatory="?"
  readonly="?"></pws:SLAAgreementID>
  </pws:header>

This PDF was generated on May 23, 2026
  <pws:description.structure type="Structure">        Service Manager 9.81
  <!--Optional:-->                                                     Page 70 of 1727
  <pws:Description type="Array">
  <!--Zero or more repetitions:-->
  <pws:Description type="String" mandatory="?"
  readonly="?"></pws:Description>
  </pws:Description>
  <!--Optional:-->
  <pws:Justification type="Array">
  <!--Zero or more repetitions:-->
  <pws:Justification type="String" mandatory="?"
  readonly="?"></pws:Justification>
  </pws:Justification>
  <!--Optional:-->
  <pws:BackoutMethod type="Array">
  <!--Zero or more repetitions:-->
  <pws:BackoutMethod type="String" mandatory="?"
  readonly="?"></pws:BackoutMethod>
  </pws:BackoutMethod>
  </pws:description.structure>
  <pws:middle type="Structure">
  <!--Optional:-->
  <pws:ConfigurationItem type="String" mandatory="?"
  readonly="?"></pws:ConfigurationItem>
  <!--Optional:-->
  <pws:Location type="String" mandatory="?"
  readonly="?"></pws:Location>
  <!--Optional:-->
  <pws:Misc1 type="String" mandatory="?"
  readonly="?"></pws:Misc1>
  <!--Optional:-->
  <pws:Misc2 type="String" mandatory="?"
  readonly="?">pass</pws:Misc2>
  <!--Optional:-->
  <pws:Misc3 type="String" mandatory="?"
  readonly="?"></pws:Misc3>
  <!--Optional:-->
  <pws:Misc4 type="String" mandatory="?"
  readonly="?"></pws:Misc4>
  <!--Optional:-->
  <pws:Misc5 type="String" mandatory="?"
  readonly="?"></pws:Misc5>
  <!--Optional:-->
  <pws:Misc6 type="String" mandatory="?"
  readonly="?"></pws:Misc6>

This PDF was generated on May 23, 2026

<!--Optional:-->
<pws:Misc7 type="String" mandatory="?"
readonly="?"></pws:Misc7>
<!--Optional:-->
<pws:Misc8 type="String" mandatory="?"
readonly="?"></pws:Misc8>
<!--Optional:-->
<pws:Misc9 type="String" mandatory="?"
readonly="?"></pws:Misc9>
<!--Optional:-->
<pws:Misc10 type="String" mandatory="?"
readonly="?"></pws:Misc10>
<!--Optional:-->
<pws:OutageStart type="DateTime" mandatory="?"
readonly="?"></pws:OutageStart>
<!--Optional:-->
<pws:OutageEnd type="DateTime" mandatory="?"
readonly="?"></pws:OutageEnd>
<!--Optional:-->
<pws:ScheduledOutageStart type="DateTime" mandatory="?"
readonly="?"></pws:ScheduledOutageStart>
<!--Optional:-->
<pws:ScheduledOutageEnd type="DateTime" mandatory="?"
readonly="?"></pws:ScheduledOutageEnd>
<!--Optional:-->
<pws:ActualOutageStart type="DateTime" mandatory="?"
readonly="?"></pws:ActualOutageStart>
<!--Optional:-->
<pws:ActualOutageEnd type="DateTime" mandatory="?"
readonly="?"></pws:ActualOutageEnd>
<!--Optional:-->
<pws:MiscArray1 type="Array">
<!--Zero or more repetitions:-->
<pws:MiscArray1 type="String" mandatory="?"
readonly="?"></pws:MiscArray1>
</pws:MiscArray1>
<!--Optional:-->
<pws:MiscArray2 type="Array">
<!--Zero or more repetitions:-->
<pws:MiscArray2 type="String" mandatory="?"
readonly="?"></pws:MiscArray2>
</pws:MiscArray2>
<!--Optional:-->
<pws:MiscArray3 type="Array">
<!--Zero or more repetitions:-->


<pws:MiscArray3 type="String" mandatory="?"
readonly="?">test passed</pws:MiscArray3>
</pws:MiscArray3>
<!--Optional:-->
<pws:Assets type="Array">
<!--Zero or more repetitions:-->
<pws:Assets type="String" mandatory="?"
readonly="?"></pws:Assets>
</pws:Assets>
<!--Optional:-->
<pws:EstimateDescription type="String" mandatory="?"
readonly="?"></pws:EstimateDescription>
<!--Optional:-->
<pws:EstimatePrice type="String" mandatory="?"
readonly="?"></pws:EstimatePrice>
<!--Optional:-->
<pws:ActualCost type="String" mandatory="?"
readonly="?"></pws:ActualCost>
<!--Optional:-->
<pws:ActualPrice type="String" mandatory="?"
readonly="?"></pws:ActualPrice>
</pws:middle>
<pws:close type="Structure">
<!--Optional:-->
<pws:CompletionCode type="Decimal" mandatory="?"
readonly="?">1</pws:CompletionCode>
<!--Optional:-->
<pws:ClosingComments type="Array">
<!--Zero or more repetitions:-->
<pws:ClosingComments type="String" mandatory="?"
readonly="?">Terminating Change</pws:ClosingComments>
</pws:ClosingComments>
</pws:close>
<!--Optional:-->
<pws:Urgency type="String" mandatory="?"
readonly="?"></pws:Urgency>
<!--Optional:-->
<pws:InitialAssessment type="String" mandatory="?"
readonly="?"></pws:InitialAssessment>
<!--Optional:-->
<pws:attachments>
<!--Zero or more repetitions:-->
<com:attachment
href="Service_Manager:9.61_Codeless/webservicesguide/concepts/?"
contentId="?" action=""


name="?" type="?" len="?" charset="?" attachmentType="?"/>
</pws:attachments>
</pws:instance>
<!--Optional:-->
<pws:messages>
<!--1 or more repetitions:-->
<com:message type="String" mandatory="?" readonly="?"
severity="?" module="?"></com:message>
</pws:messages>
</pws:model>
</pws:TerminateChangeRequest>
</soapenv:Body>
</soapenv:Envelope>


1.1.1.2.7.6. Response to a request via SOAP
Web Services

The response to a request by using SOAP Web Services is as follows:


<SOAP-ENV:Envelope xmlns:SOAP
-ENV="http://schemas.xmlsoap.org/soap/envelope/">
<SOAP-ENV:Body>
<TerminateChangeResponse message="Success" returnCode="0"
schemaRevisionDate="2008-05-21" schemaRevisionLevel="5"
status="SUCCESS"
xsi:schemaLocation="http://servicecenter.peregrine.com/PWS http://<sm
server>.americas.hpqcorp.net:13701/sc62server/ws/Change.xsd"
xmlns="http://servicecenter.peregrine.com/PWS"
xmlns:cmn="http://servicecenter.peregrine.com/PWS/Common"
xmlns:xsd="http://www.w3.org/2001/XMLSchema"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
<model>
<keys>
<ChangeNumber type="String">C10027</ChangeNumber>
</keys>
<instance recordid="C10027 - test"
uniquequery="header,number=&quot;C10027&quot;">
<header type="Structure">
<ChangeNumber type="String">C10027</ChangeNumber>
<Category type="String">Release Management</Category>
<Status type="String">terminated</Status>
<ApprovalStatus type="String">approved</ApprovalStatus>
<RequestedBy type="String">ALSTON, LOU</RequestedBy>
<Coordinator type="String">CM 3</Coordinator>
<Reason type="String">problem</Reason>
<CurrentPhase type="String">Verification</CurrentPhase>
<Priority type="String">1</Priority>
<DateEntered type="DateTime">2008-05-
27T16:34:26+00:00</DateEntered>
<Open type="Boolean">false</Open>
<BackoutDuration
type="Duration">P0DT0H0M0S</BackoutDuration>
<CloseTime type="DateTime">2008-05-
27T16:34:26+00:00</CloseTime>
<Company type="String">advantage</Company>
<BriefDescription type="String">test</BriefDescription>
</header>
<description.structure type="Structure">
<Description type="Array">
<Description type="String">test</Description>
</Description>
</description.structure>
<middle type="Structure">


<Location type="String">North America</Location>
<Misc2 type="String">pass</Misc2>
<MiscArray3 type="Array">
<MiscArray3 type="String">test passed</MiscArray3>
</MiscArray3>
</middle>
<close type="Structure">
<CompletionCode type="Decimal">1</CompletionCode>
<ClosingComments type="Array">
<ClosingComments type="String">Terminating
Change</ClosingComments>
</ClosingComments>
</close>
<Urgency type="String">1</Urgency>
<InitialAssessment type="String">1</InitialAssessment>
</instance>
</model>
<messages>
<cmn:message type="String">Audit Record successfully recorded
and added.</cmn:message>
<cmn:message type="String">Change C10027 Phase Verification
Closed by System Administrator.</cmn:message>
</messages>
</TerminateChangeResponse>
</SOAP-ENV:Body>
</SOAP-ENV:Envelope>END


1.1.1.2.7.7. Execute a request via RESTful Web
Services

Execute the following request by using RESTful Web Services.

            Note

           The change number must be a change of the Release Management category.
           ClosingComments and ClosureCode are required fields for terminating a Release
           Management change.

POST an action terminate to a change which is in Evaluation & Change Closure phase. The
json data resembles:

  { "TerminateChange": {
  "close":{
  "ClosingComments":"closureComments tested",
  "ClosureCode":"1"
  }
  }
  }


1.1.1.2.7.8. Response to a request by using
RESTful Web Services

The response to a request by using RESTful Web Services resembles the following:


{

"Messages": [],

"ReturnCode": 0,

"TerminateChange": {

"Impact": "4",

"RequestedEndDate": "2007-10-23T21:06:00+00:00",

"Service": "Applications",

"Urgency": "1",

"close":        {

"ClosingComments": ["closureComments tested"],

"ClosureCode": 1

},

"description.structure": {"Description": ["Check and clean system on

virusses."]},

"header":        {

"ApprovalStatus": "approved",

"AssignmentGroup": "Application",

"BackoutDuration": "P0DT0H0M0S",

"Category": "Maintenance",

"ChangeCoordinator": "Change.Coordinator",

"ChangeID": "C10019",

"Company": "advantage",

"DateEntered": "2013-07-02T09:16:29+00:00",

"InitiatedBy": "BERRY, ELLIS",

"Open": true,

"Phase": "Evaluation & Change Closure",

"PlannedEnd": "2008-10-19T18:00:00+00:00",

"PlannedStart": "2008-10-12T18:00:00+00:00",

"Priority": "2",

"RiskAssessment": "5",

"Status": "initial",

"Subcategory": "Maintenance",

"Title": "Multiple virusses"

},

"middle":        {

"Assets": ["Norton Anti-Virus"],

"ConfigurationItem": "Norton Anti-Virus",

"Location": "North America"

}

}

}


1.1.1.2.8. Publish a table as a Web Service

You must have the SysAdmin capability words to use this procedure.
   1. Login to Service Manager as a System Administrator.
   2. Click Tailoring > Database Manager.
   3. In the Table field, type extaccess.
   4. Click Search.
   5. In the Name field, select the name of the Service Manager table or join file you want to
     publish as a Web Service.

                   Caution

                Type the name of the table as it is defined in the database dictionary.

                   Note

                Only valid Service Manager table names appear in the list. This list includes
                the names of tables that don't physically reside in the database, but are
                defined in memory at run time based on join definitions and relationship
                information in joindef and erddef records respectively.

   6. In the Service Name field, type the name of the Web Service you want to use to publish
     this table. You can reuse the same Web Service name to publish multiple tables, as long
     the combination of Service Name and Object Name is unique.

                   Caution

                Since this name becomes part of a URL, the name must consist of
                alphanumeric characters that are valid for URLs. The name can't consist of
                URL reserved characters such as spaces, slashes, or colons.

                   Note

                The name you type in this field becomes the alias name for service and
                becomes part of the Web Service URL. For example, if you type
                IncidentManagement for the service name, then SOAP applications must
                include IncidentManagement.wsdl in the URL to access this service.

   7. In the Object Name field, type the name you want to use to identify this table.


               Note

             The name is unique and can't be used by other Web Services definitions.

               Note

             The name you type in this field becomes the alias name for the table and
             becomes part of the Web Service WSDL. For example, if you type Incident for
             the object name, then the SOAP operations for this table include Incident as
             part of the WSDL element (such as RetrieveIncident, CreateIncident, and
             ResolveIncident).

               Caution

             Since this name becomes part of the WSDL, the name must consist of
             alphanumeric characters valid for XML. The name can't consist of XML
             reserved characters such as brackets (< & >), colons (:), or quotation marks
             (" & ’).

8. In the Allowed Actions array, select the Service Manager Document Engine display
  actions you want to globally enable for this table.

               Note

             Each table has its own set of display actions allowed as defined in the Service
             Manager Document Engine. Enabling or disabling the display actions from this
             field only determines whether the display action is available through the Web
             Services API. Service Manager still validates the operator credentials supplied
             with each Web Service request to ensure that the operator has sufficient
             privileges to perform the display action. Click the array field to see a list of
             allowable display actions for the table you select.

               Note

             If a join file is chosen, the allowed actions for the join file come from the
             primary table of the join.

9. In the Action Names field, type the name you want to use in the Web Services API to
  identify the Document Engine display actions for this table.


                   Note

                The name you type for this field becomes the alias name for the display
                action and becomes part of the Web Service WSDL. For example, if you type
                Create for the add action of the Incident object, then the WSDL operation
                becomes CreateIncident and the WSDL messages are CreateIncidentRequest
                and CreateIncidentResponse.

                   Caution

                Since this name becomes part of the WSDL, the name must consist of
                alphanumeric characters valid for XML. The name can't consist of XML
                reserved characters such as brackets (< & >), colons (:), or quotation marks
                (" & ’).

 10. If you want to use RESTful API, you need to configure RESTful tab field too. Type the
     name of Resource Collection and Resource you want to use, and set the Unique Key and
     default actions.

 11. Click Add.

Users can now access this Service Manager table from a custom or third-party Web Service
client and use the actions you have enabled.


1.1.1.2.9. Expose a table with more than one
Web Service

User role: System Administrator
An implementer can define multiple Web Service definition records with different names for a
given table or join file, and have different fields and actions exposed for each.

   1. Click Tailoring > Web Services > Web Service Configuration Utility.
   2. In the Table field, type extaccess, and then click Search. The External Access Definition

     form opens.
   3. In the Name field, select or type the name of the table or join file for which you want to

     create a copy of the extaccess record, and then click Search. The record opens.
   4. Change the Service Name to the name of the Web Service you want to use to publish the

     Service Manager table.

                   Note

                The combination of Service Name and Object Name must be unique to this
                record. The combination can't exist anywhere else in the system.

   5. Change the Object Name to the name you want to use to identify the Service Manager
     table in the Web Services API.

   6. On the Fields tab, change the fields that are exposed and modify the Caption and Type
     information, if necessary.

                   Note

                If a join file is chosen, the Fields tab lists all the fields for all the files in that
                join file.

   7. On the Allowed Actions tab, change the actions, if necessary.
   8. On the Expressions tab, add expressions, if necessary.
   9. On the RESTful tab, add RESTful API configurations, if necessary.
 10. Click Add.

The new extaccess record is added to the system. When you view the exposed Object (for
example, WSDL for SOAP) for both Web Services, they should display with the applicable
actions and fields, as defined in each extaccess record.


1.1.1.2.10. Remove a Document Engine display
action from the Web Services API

You must have the SysAdmin capability word to use this procedure.

The Service Manager Web Services Configuration Utility allows you to remove any Document
Engine display action you published as part of a Web service.

   1. Click Tailoring > Web Services > Web Service Configuration.
   2. In the Service Name field, type the name of the service.
   3. In the Name field, type the name of the Service Manager table whose display actions you

     want to remove.
   4. From the Allowed Actions array, select the Document Engine display action you want to

     remove from the list.
   5. Clear the Allowed Actions field with the Backspace key.
   6. Click Save.


1.1.1.2.11. Remove a Service Manager field from
the Web Services API

You must have the SysAdmin capability words to use this procedure.

   1. Click Tailoring > Web Services > Web Service Configuration Utility.
   2. In the Table field, type extaccess and click Search. The External Access Definition record

     opens.
   3. In the Name field, select the name of the Service Manager table in which you want to

     remove fields.
   4. Click Search. The Web Services record for that table opens.
   5. On the Fields tab, find the fields you want to remove and make the value that's currently

     there NULL.
   6. In the Caption column, make the value NULL for the field you want to remove.
   7. In the Type column, make the value NULL for the field you want to remove.
   8. Click Save.
````
