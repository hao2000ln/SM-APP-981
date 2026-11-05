---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.1.4.5 .. 1.1.4.8
printed_pages: 358-391
---

# 1.1.4.5 Event agents

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.4.5. Event agents

Automatic monitors within Service Manager, known as agents, can be set to collect data and
create events appropriately within the system. You can use the Event Scheduler to set up these
agents, or you can activate them automatically or manually (by user input).

Related topics

Event scheduling
Event Services
View event schedules
View Event Services agent status
View registered events


1.1.4.5.1. Event scheduling

The schedule table contains a record for each SCAuto agent. It contains instructions indicating
how often the agent reads a queue and which application to execute if the read returns
records. You use the Event Schedule form to manage event agent operations.

When the event agent starts, the event schedule record must have a class of event (or the
name you specify for the event scheduler) and must have an expiration earlier than the current
time. Set the expiration to the current date and time before starting the scheduler.

Since the event scheduler is a serial process, you may want to have more than one scheduler
read events in the event queue, particularly when inventory activity is high, preventing incident
management activity.

Use the Query field to further define what type of event to select from the eventin file. The
user-specified query entered in the schedule record is appended automatically to the default
event scheduler query, evtime<=tod(), to form a more specific query. If the Query field is left
blank, only the default query is applied.

            Note

           The system always places the time portion of the query in front of the user-
           specified query.

If you define a query for use against the eventin file, ensure it is fully-keyed for maximum
performance.

The agent processor attempts to restart any applications that ended while running (that have a
status of application running). If you change for one of your agents, ensure there are no other
agents with the same schedule class and a status of application running.

Related topics

Agent status
Event agents
Filtering events
View event schedules


1.1.4.5.2. View event schedules

Applies to User Roles: System Administrator
To view event schedules:

   1. Click Tailoring> Event Services > Review Agents.
   2. Select an agent from the list to open the Event Scheduler for the agent.

Related topics

Event Services
Event scheduling


1.1.4.5.3. Agent status

From Event Services you can start and stop any SCAuto or event agent without respect to your
client status as long as the Service Manager problem agent is active. Using this feature, agents
are scheduled to start, and the problem agent is their activation agent. The specific agents
controlled from this option include:

     Event
     Axces
     SCAuto Server
     JavaMail

Related topics

Event scheduling
Event Services
View event schedules
View Event Services agent status


1.1.4.5.4. View Event Services agent status

Applies to User Roles: System Administrator
To view Event Services agent status:
Click Miscellaneous > System Status.
The event process shows a Last Expiration time and an Idle time. The Last Expiration time is
the initialization time for the agent; the Idle time is the amount of time elapsed since the agent
last woke up to check for work.
If an agent is inactive, there is no Last Expiration or Idle time, and the Start button is available.

Related topics

Agent status
Event Services


1.1.4.5.5. View system startup information

Applies to User Roles: System Administrator
To view system startup information:

   1. Click System Administration > Ongoing Maintenance > System > Startup Information.
   2. Type startup in the Type field.
   3. Click Search.

Related topics

System information record


1.1.4.6. Email solutions based on Event
Services

The following email solutions are based on Event Services:
     Smart Email outbound email (also known as JavaMail)
     SCAuto Mail

For more information on these email solutions, see Service Manager email solutions.


1.1.4.7. Format Control and eventout records

When incidents are opened, updated or closed by Event Services, a record is written to the
eventout file. This record contains information from the incident (described in the output
eventmap record for the event) that's passed to an external process via the SCAuto/IPAS
external interface. You can elect to write to the eventout file when Service Desk operators
open and close records so that the information is passed to the external interface.

The axces.write application creates a character string of fields from a structure and writes
them to eventout. An Event Registration record identifies the event type and the name of the
Event Map records used to define which fields will be selected from the record. The application
should be called as a Format Control Subroutine passing two parameters:

     The record from which data will be mapped.
     The Event Type, as defined in the Event Register.

To write to eventout on incident close, the Format Control record is attached to the
problem.equipment.close form using the following values:

Field                                   Value
Application                             axces.write
axces.write                             true

Name                                    Value
record                                  $file
name                                    pmc

Note: This procedure is not specific to Incident Management. You can write eventout records
for other applications, such as Configuration Management or Change Management.

Related topics

Format Control


1.1.4.7.1. Generating email messages

SCAutomate supports a generic e-mail function. Use the Format Control RAD function,
message.fc, to write e-mail events to the eventout file.

Related topics

Event Services
Service Manager Programming


1.1.4.8. Out-of-box events

Service Manager delivers out-of-box events with the Event Services application. Service
Manager Event Services uses these events to open, update, and close incidents or requests.
They are also used to update configuration items or change requests. You can use event
registration to view the details of each registered event, which are stored in the eventregister
table.

Related topics

Change Management events
Configuration Management events
Incident Management events
Service Desk events
Service Level Management events
Standard events


1.1.4.8.1. Change Management events

Event                                   Event   Description
                                        type

cm3rin                                  input   Use this event for all
cm3rinac                                output  incoming change events.

cm3rout                                 output  This is sent if the write
cm3tin                                  input   eventout is set to true. This
cm3tinac                                output  returns failed events so the
                                                calling application receives
cm3tout                                 output  notification when an error
                                                occurs.

                                                This is created when a cm3
                                                message is created and you
                                                enter cm3rout in axces.out.

                                                Use this for all incoming
                                                change tasks.

                                                This is sent if the write
                                                eventout is set to true. This
                                                returns failed events so the
                                                calling application is
                                                notified when an error
                                                occurs.

                                                This is created when a cm3
                                                message fires and you
                                                enter cm3tout in axces.out.

You can use event registration to view the details of each registered event, which are stored in
the eventregister table.

Related topics

View registered events


1.1.4.8.2. Configuration Management events

Event                                   Event                          Service Manager 9.81
icma                                    type
ICMapplication                          input  Description
ICMcomputer
icmd                                    input  This event adds or updates
                                               inventory items to the
                                        input  device file if filter criteria
                                               are satisfied.
                                        input
                                               Service Manager inventory
ICMdevice                               input  regulation event when a
                                               device of this type is added
ICMdevicenode (1)                       input  to the system.

This PDF was generated on May 23, 2026         Service Manager inventory
                                               regulation event when a
                                               device of this type is added
                                               to the system.

                                               This event marks an
                                               inventory item for deletion if
                                               filter criteria are satisfied by
                                               placing inactive in the
                                               status field.

                                               Use this event type when
                                               you add data records to the
                                               device file. These events
                                               use the icm device
                                               eventmaps.

                                               Use this event type to add
                                               or update information about
                                               a network node (a device
                                               that appears as a discrete
                                               item in a network) to the
                                               Inventory Configuration
                                               Management application.
                                               These events use the icm
                                               networkcomponents
                                               mappings.

                                                                                         Page 370 of 1727
Event                                   Event                          Service Manager 9.81
ICMdevicenode (2)                       type
                                               Description
                                        input
                                               If you use the
ICMdisplaydevice                        input  ICMdevicenode event to
                                               send information to Service
ICMexample                              input  Manager, after the initial
                                               database operation
ICMfurnishings                          input  completes, this secondary
                                               event registration causes a
ICMhandhelds                            input  logging record to write to
                                               the eventout table.
ICMmainframe                            input
                                               Service Manager inventory
ICMnetworkcomp                          input  regulation event when a
                                               device of this type is added
This PDF was generated on May 23, 2026         to the system.

                                               Service Manager inventory
                                               regulation event when a
                                               device of this type is added
                                               to the system.

                                               Service Manager inventory
                                               regulation event when a
                                               device of this type is added
                                               to the system.

                                               Service Manager inventory
                                               regulation event when a
                                               device of this type is added
                                               to the system.

                                               Service Manager inventory
                                               regulation event when a
                                               device of this type is added
                                               to the system.

                                               Service Manager inventory
                                               regulation event when a
                                               device of this type is added
                                               to the system.

                                                                                         Page 371 of 1727
Event                                   Event                          Service Manager 9.81
ICMofficeelec                           type
ICMserver                               input  Description

                                        input  Service Manager inventory
                                               regulation event when a
ICMsoftwarelicense                      input  device of this type is added
                                               to the system.
ICMstorage                              input
                                               Use this event type to add
icmswa                                  input  or update information about
                                               a server to the Inventory
icmswd                                  input  Configuration Management
                                               application. These events
This PDF was generated on May 23, 2026         use the icm computer
                                               mappings (since servers are
                                               a subtype of computers,
                                               you can reuse the
                                               mappings.

                                               Service Manager inventory
                                               regulation event when a
                                               device of this type is added
                                               to the system.

                                               Service Manager inventory
                                               regulation event when a
                                               device of this type is added
                                               to the system.

                                               This event adds or updates
                                               inventory items (that
                                               ServerView or StationView
                                               discovers) to the device file
                                               if filter criteria are satisfied.

                                               This event marks an
                                               inventory item (that
                                               ServerView or StationView
                                               discovers) for deletion in
                                               the pcfiles file if filter
                                               criteria are satisfied.

                                                                                         Page 372 of 1727

Event                                   Event  Description
                                        type

ICMtelecom                              input  Service Manager inventory
                                               regulation event when a
icmu                                    input  device of this type is added
                                               to the system.
IND                                     input
                                               This event updates
prgma                                   input  inventory items if filter
                                               criteria are satisfied.
prgmd                                   input
                                               An event that adds or
                                               updates inventory items to
                                               the device file.

                                               This adds or updates a
                                               software inventory item to
                                               the pcfiles file that an
                                               external agent (other than
                                               ServerView or StationView)
                                               discovers if filter criteria are
                                               satisfied.

                                               This deletes a software
                                               inventory item from the
                                               pcfiles file that an external
                                               agent (other than
                                               ServerView or StationView)
                                               discovers if filter criteria are
                                               satisfied. The default
                                               updates the estatus field as
                                               deleted rather than
                                               removing the record from
                                               the database.

You can use event registration to view the details of each registered event, which are stored in
the eventregister table.

Related topics

View registered events


1.1.4.8.3. Incident Management events

Event                                   Event   Description
                                        type

epmosmu                                 input   This event opens an
epmosmu                                 output  incident from a call.
pmc                                     input
                                                This event writes the record
pmc                                     output  after an incident opens from
pmo                                     input   a call.

pmo                                     output  This event closes an
pmu                                     input   incident if filter criteria are
                                                met. It uses the same path
pmu                                     output  as manually closing the
                                                operation.

                                                This event writes after an
                                                incident is closed.

                                                This event opens an
                                                incident if filter criteria are
                                                met. It uses the same path
                                                as manually opening the
                                                incident.

                                                This event writes after an
                                                incident is opened.

                                                This event updates an
                                                incident if filter criteria are
                                                met. It uses the same path
                                                as manually updating the
                                                incident.

                                                This event writes after an
                                                incident is updated.

You can use event registration to view the details of each registered event, which are stored in
the eventregister table.

Related topics


View registered events


1.1.4.8.4. Service Desk events

Event                                   Event   Description
                                        type

esmin                                   input   This event opens a call in
esmin                                   output  Service Desk.
smin                                    input
smout                                   output  This event writes a record
                                                once a call opens in Service
                                                Desk.

                                                Service Desk incoming
                                                service request or help
                                                issue.

                                                This event writes once an
                                                incoming request or help
                                                issue enters the system.

You can use event registration to view the details of each registered event, which are stored in
the eventregister table.

Related topics

View registered events


1.1.4.8.5. Service Level Management events

Event                                   Event   Description
                                        type

outageend                               input   This event performs
outagestart                             input   updates to outage records,
slaresponse                             output  which are part of the
                                                service level agreement
                                                (SLA) application.

                                                This event performs
                                                updates to outage records,
                                                which are part of the SLA
                                                application.

                                                This is a request from an
                                                external application to enter
                                                a response time metric
                                                against a device with an
                                                SLA.

You can use event registration to view the details of each registered event, which are stored in
the eventregister table.

Related topics

View registered events


1.1.4.8.6. Standard events

Service Manager event registration currently supports events enabling integration with ERP,
SAP, and other external system interfaces. The events listed in the following table provide a
brief description of the event.

Standard event                          Event                           Service Manager 9.81
approval                                type
approval                                input   Description
CTSCPY (1)
                                        output  This event processes
                                                approvals for Request
                                        output  Management and Change
                                                Management.
CTSCPY(2)                               input
                                                This event sends approvals
CTSIMP (1)                              output  for Request Management
                                                and Change Management.
CTSIMP (2)                              input
                                                This event to SAP uses
CTSIMP2                                 output  eventmap cm3tctsc. It is a
                                                generated message to SAP
This PDF was generated on May 23, 2026          to copy a CTS Transport
                                                from one system to another.

                                                This event from SAP uses
                                                eventmap cm3tctsc. It
                                                processes the
                                                acknowledgment of SAP
                                                CTS Copy messages.

                                                This event to SAP uses
                                                eventmap cm3tctsi. It builds
                                                a message to request a
                                                specific SAP Instance
                                                perform an Import of a
                                                given Transport.

                                                This event from SAP uses
                                                eventmap cm3tctsi. It
                                                processes the Input
                                                acknowledge message from
                                                SAP regarding Import of
                                                Transport.

                                                This event handles
                                                scheduling of Output Import
                                                events to SAP using
                                                eventmap cm3tctsi.

                                                                                          Page 379 of 1727
Standard event                          Event                           Service Manager 9.81
CTSRQCLS (1)                            type
                                                Description
                                        input
                                                This event to SAP uses
CTSRQLS (2)                             output  eventmap cm3rcts. It sends
                                                a message to a SAP
CTSRQOPN (1)                            output  instance instructing it to
                                                release a transport.
CTSRQOPN (2)                            input
                                                This event from SAP uses
                                                eventmap cm3rcts. It is a
                                                message received message
                                                from SAP acknowledging a
                                                transport release.

                                                This system event sent to
                                                SAP uses the cm3rcts
                                                eventmap. It sends a
                                                message to a SAP instance
                                                instructing it to open a SAP
                                                Transport Request with
                                                specific Service Manager-
                                                supplied data.

                                                This event from SAP uses
                                                eventmap cm3rcts. It is a
                                                received message from SAP
                                                acknowledging Transport
                                                Request creation. It closes
                                                the first phase of the
                                                Change and updates fields
                                                with data returned from
                                                SAP.

Standard event                          Event                           Service Manager 9.81
CTSRQOPN (3)                            type
                                                Description
                                        input
                                                This input event from SAP
CTSRQUPD (1)                            output  uses eventmap cm3rctso. It
                                                is a received message from
CTSRQUPD (2)                            input   SAP sent when a Transport
                                                Request opens on the SAP
CTSTKCLS (1)                            output  side without first opening
                                                within Service Manager. It
                                                causes a Change to open
                                                within Service Manager with
                                                data received from SAP.

                                                This event to SAP uses
                                                eventmap cm3rcts. It sends
                                                a message to a SAP
                                                Instance to update specific
                                                Transport Request data
                                                elements.

                                                This is an Input event from
                                                SAP. It uses eventmap
                                                cm3rcts. It is a received
                                                message from SAP sent
                                                when a Transport Request
                                                has been updated on the
                                                SAP side. It is either an
                                                acknowledgment of a
                                                Service Manager originated
                                                request or a notification of a
                                                SAP originated action.

                                                This event to SAP uses
                                                eventmap cm3tcts. It sends
                                                a message to SAP to close a
                                                Transport Task within SAP.

Standard event                          Event                           Service Manager 9.81
CTSTKCLS (2)                            type
                                                Description
                                        input
                                                This event from SAP uses
CTSTKOPN (1)                            output  eventmap cm3tcts. It is a
                                                received message from SAP
CTSTKOPN (2)                            input   that a Transport Task closed
                                                on the SAP side. It is either
CTSTKOPN (3)                            input   an acknowledgment of a
                                                Service Manager-originated
CTSTKUPD (1)                            output  request or a notification on
                                                a SAP-originated action.
This PDF was generated on May 23, 2026
                                                This is event to SAP uses
                                                eventmap cm3tcts. It sends
                                                a message to SAP
                                                indicating that a Transport
                                                Task opened within SAP.

                                                This event from SAP uses
                                                eventmap cm3tcts. It is an
                                                acknowledgment message
                                                from SAP indicating that a
                                                Transport Task closed on
                                                the SAP side.

                                                This event from SAP uses
                                                eventmap cm3tctso. This
                                                message indicates that a
                                                Transport Task opened on
                                                the SAP side within the
                                                Change Management
                                                application using data
                                                supplied from the SAP
                                                system.

                                                This event to SAP uses
                                                eventmap cm3tcts. It is sent
                                                from Service Manager to
                                                SAP to update a Transport
                                                Task on the SAP side to
                                                match changes on the
                                                Service Manager side.

                                                                                          Page 382 of 1727
Standard event                          Event                           Service Manager 9.81
CTSTKUPD (2)                            type
                                                Description
                                        input
                                                This event from SAP uses
dbadd                                   input   eventmap cm3tcts. It is a
                                                message received from SAP
dbdel                                   input   when a Transport Task
dbupd                                   input   update on the SAP side. It
email                                   output  can either be an
email                                   input   acknowledgment of a
                                                Service Manager-
This PDF was generated on May 23, 2026          originated update or
                                                notification of a SAP-
                                                originated update.

                                                This adds an item to a
                                                specified Service Manager
                                                file when you satisfy the
                                                filter criteria. It updates the
                                                file if the item already
                                                exists.

                                                This deletes an item from a
                                                specified Service Manager
                                                file if the filter criteria are
                                                satisfied.

                                                This updates an item to a
                                                specified Service Manager
                                                file when you satisfy the
                                                filter criteria.

                                                This is the standard
                                                interface to convert Service
                                                Manager mail to standard e-
                                                mail format.

                                                This is the standard
                                                interface to receive external
                                                e-mail and convert to
                                                Service Manager mail.

                                                                                          Page 383 of 1727
Standard event                          Event                           Service Manager 9.81
ERPHR (1)                               type
                                        input   Description
ERPHR (2)
ERPSTATES (1)                           output  This event establishes
ERPSTATES (2)                           input   contact with the ERP
gie                                     input   system using eventmap
HotNews                                 input   contactserp.
opera                                   output
                                        input   This event uses eventmap
operd                                           contactserp.
operu                                   input
                                        input   This event determines the
page                                            state of the ERP system
                                        output  using eventmap stateerp.

This PDF was generated on May 23, 2026          This event uses eventmap
                                                stateerp.

                                                Both Asset Manager and
                                                Service Manager use the
                                                Generic Input Event (GIE).

                                                HotNews defines an
                                                eventout type of HotNews.

                                                This event adds or updates
                                                a new user to Service
                                                Manager if filter criteria are
                                                satisfied.

                                                This event deletes a user
                                                from Service Manager if
                                                filter criteria are satisfied.

                                                This event updates items
                                                specified in a Service
                                                Manager file if filter criteria
                                                are satisfied.

                                                This event registration
                                                allows Service Manager to
                                                create eventout records
                                                with the evtype=page.

                                                                                          Page 384 of 1727
Standard event                          Event                           Service Manager 9.81
pageclose                               type
pageresp                                input   Description

                                        input   This event uses a condition
                                                statement (evfiends in
pcsoftware                              input   $axces)#"pm".
PSSDELETE                               input
SALESQUOTE                              input   This event updates an
SAPGRT                                  output  incident with an
                                                acknowledgment or
SAPGRT                                  input   message received as
SAPGTE                                  input   response to a page. It uses
                                                a condition statement
This PDF was generated on May 23, 2026          (evfiends in $axces)#"pm".

                                                This event allows desktop
                                                inventory products to
                                                update Service Manager.

                                                This event deletes selected
                                                records from a Service
                                                Manager file.

                                                This event moves an
                                                eventin record to the
                                                eventout file and changes
                                                the evtype.

                                                This goods receipt Output
                                                event calls no application. It
                                                submits receipt notification
                                                to SAP system for
                                                processing.

                                                This goods receipt event
                                                calls submits receipt
                                                notification to SAP system
                                                for processing.

                                                This event updates existing
                                                line items.

                                                                                          Page 385 of 1727
Standard event                          Event                           Service Manager 9.81
SAPHR (1)                               type
                                                Description
                                        input
                                                Event processing edits to
SAPHR (2)                               output  contact file originating in
SAPHRMD                                 input   Service Manager, routed
SAPORD                                  input   through SAP, and returned
                                                to Service Manager.
SAPORD                                  output
                                                This event routes contact
sapordl (1)                             output  file changes to SAP.
sapordl (2)                             input
SAPORDQ                                 input   This event processes SAP-
SAPQTE                                  input   originating contacts file
                                                changes.
This PDF was generated on May 23, 2026
                                                This sales order event from
                                                SAP breaks events into
                                                appropriate constituent
                                                parts.

                                                This sales order event to
                                                SAP calls no application. It
                                                routes order information to
                                                SAP for processing.

                                                This event routes order
                                                information to SAP for
                                                processing.

                                                This event routes order
                                                information to SAP for
                                                processing.

                                                This is the header
                                                component of the SAPORD
                                                event.

                                                This sales quote event from
                                                SAP breaks events into
                                                constituent parts.

                                                                                          Page 386 of 1727
Standard event                          Event                           Service Manager 9.81
SAPQTE                                  type
sapqtel (1)                             output  Description

                                        output  This sales quote event from
                                                Service Manager calls no
sapqtel (2)                             input   routine.
SAPQTEQ                                 input
saprecl (1)                             output  This event is the Output
                                                quote line item component
SAPREQ                                  input   of the SAPQTE event. It
SAPREQ                                  output  uses this registration to
                                                identify which eventmap to
sapreql (1)                             output  use for message formatting.

This PDF was generated on May 23, 2026          This event is the detail
                                                portion of the SAPQTE
                                                event.

                                                This is the header
                                                component of the SAPQTE
                                                sales quote.

                                                This event is the output
                                                goods receipt line item
                                                component of the SAPQTE
                                                event. It uses this
                                                registration to identify
                                                which eventmap to use for
                                                message formatting.

                                                This purchase requisition
                                                event is from SAP.

                                                This purchase requisition
                                                event from Service
                                                Manager calls no
                                                application.

                                                This event is the output
                                                request line item
                                                component of SAPREQ. It
                                                uses this registration to
                                                identify which eventmap to
                                                use for message formatting.

                                                                                          Page 387 of 1727
Standard event                          Event                          Service Manager 9.81
sapreql (2)                             type
SAPREQO                                 input  Description
ScAcBrand
                                        input  This event is the detail
                                        input  portion of the SAPREQ
                                               event.
ScAcCompany                             input
                                               This event is a SAPREQ
ScAcContacts                            input  component from SAP.

ScAcDept                                input  This event allows Service
                                               Manager and Asset
This PDF was generated on May 23, 2026         Manager to integrate data
                                               from the Service Manager
                                               vendor file to the
                                               corresponding Asset
                                               Manager file.

                                               This event allows Service
                                               Manager and Asset
                                               Manager to integrate data
                                               from the Service Manager
                                               company file to the
                                               corresponding Asset
                                               Manager file.

                                               This event allows Service
                                               Manager and Asset
                                               Manager to integrate data
                                               from the Service Manager
                                               contacts file to the
                                               corresponding Asset
                                               Manager file.

                                               This event allows Service
                                               Manager and Asset
                                               Manager to integrate data
                                               from the Service Manager
                                               department file to the
                                               corresponding Asset
                                               Manager file.

                                                                                         Page 388 of 1727
Standard event                          Event                          Service Manager 9.81
ScAcDevice                              type
                                               Description
                                        input
                                               This event allows Service
ScAcLocation                            input  Manager and Asset
                                               Manager to integrate data
ScAcModel                               input  from the Service Manager
                                               device file to the
ScAcModelBundle                         input  corresponding Asset
                                               Manager file.
ScAcModelVendor                         input
                                               This event allows Service
This PDF was generated on May 23, 2026         Manager and Asset
                                               Manager to integrate data
                                               from the Service Manager
                                               location file to the
                                               corresponding Asset
                                               Manager file.

                                               This event allows Service
                                               Manager and Asset
                                               Manager to integrate data
                                               from the Service Manager
                                               model file to the
                                               corresponding Asset
                                               Manager file.

                                               This event allows Service
                                               Manager and Asset
                                               Manager to integrate data
                                               from the Service Manager
                                               model file to the
                                               corresponding Asset
                                               Manager file.

                                               This event allows Service
                                               Manager and Asset
                                               Manager to integrate data
                                               from the Service Manager
                                               modelvendor file to the
                                               corresponding Asset
                                               Manager file.

                                                                                         Page 389 of 1727

Standard event                          Event   Description
                                        type

ScAcVendor                              input   This event allows Service
                                                Manager and Asset
ScAcVendorBACK                          input   Manager to integrate data
                                                from the Service Manager
submit                                  output  vendor file to the
sysbull                                 input   corresponding Asset
                                                Manager file.

                                                This event allows Service
                                                Manager and Asset
                                                Manager to integrate data
                                                from the Service Manager
                                                vendor file to the
                                                corresponding Asset
                                                Manager file.

                                                This event submits a job for
                                                processing.

                                                This event adds a new
                                                System Bulletin to Service
                                                Manager if filter criteria are
                                                satisfied.

You can use event registration to view the details of each registered event, which are stored in
the eventregister table.

Related topics

View registered events
````
