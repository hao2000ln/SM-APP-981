---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.1.4 .. 1.1.4.2
printed_pages: 302-326
---

# 1.1.4 Event Services

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.4. Event Services

Service Manager Event Services is an interface between Service Manager and external
systems. It is the preferred mechanism for interfacing Service Manager to external systems. It
runs on Microsoft Windows and Linux platforms, doesn't require an existing client session to
operate, and can be configured to run as a background processor.

Related topics

Event blocking
Event mapping process
Event scheduling
Event Services and Change Management
Generating email messages
Event Services and Service Manager e-mail
Event Services operations
Event Services routing
Event Services tables
Event Services workflow
View event schedules
View Event Services agent status
View Event Services input events
View Event Services output events
View registered events
Standard events


1.1.4.1. Event Services overview

Event Services provides standard applications to:

     Open, update, and close Service Manager incidents
     Open, update, and close Service Manager calls
     Add, update, and delete Configuration Items
     Open, update, approve, and close changes

Standard applications are available within Service Manager to generate outbound information,
such as e-mails. Standard applications come with out-of-box forms, or you can tailor both
forms and operations to meet your needs. You can also modify Event Services to perform any
Service Manager operation on any Service Manager table.

Related topics

Input event processing
Output events
Output event processing


1.1.4.1.1. Supported external products

Service Manager Event Services interfaces with other internal and external products which
include:

     Service Manager Mail (JavaMail), which sends Service Manager e-mail to other mail
     systems
     SCMail (for Unix) and SCMapi (for Windows), which supports bi-directional e-mail with
     other e-mail systems
     SCAutomate, which links Service Manager to external products such as IBM Tivoli® and
     Network Node Manager
     Customized SCAutomate applications
     Connect-It, which uses Event Services for input events and Service Manager for output
     events

Related topics

Communication with external systems
Event Services
Integrations
Synchronizing with an external system


1.1.4.1.2. Communication with external
systems

To accomplish the communication between products, you must establish a connection
between Service Manager and the external system. Some type of TCP/IP connection is
required, depending on the product and environment. The connection may also involve the sm
listener.

Related topics

Event Services
Integrations


1.1.4.1.3. Event Services routing

Event Services routes Events entering and exiting Service Manager differently depending on
the external system communicating with Service Manager. For some products, Event Services
routes information in one direction only. For others, events flow in both directions.

Related topics

Event Services
Routing events with internal and external products


1.1.4.1.4. Routing events with external products

The following table describes how the following products route events using Event Services.


Product     Internal/External           Routing direction Description
            product

Service Manager e- Internal             Outbound events      Service Manager
mail (JavaMail)                         only                 uses an eventout
                                                             record to route
                                                             information to
                                                             JavaMail. JavaMail
                                                             connects directly to
                                                             the server,
                                                             responds to, and
                                                             processes only
                                                             email eventout
                                                             records.

Connect-It  External                    Inbound events only  Connect-It
                                                             establishes a client
                                                             connection to the
                                                             Service Manager
                                                             server through a
                                                             listener (sm) and
                                                             information is
                                                             routed bi-
                                                             directionally
                                                             through the
                                                             connection.
                                                             Connect-It requires
                                                             inbound information
                                                             to go through Event
                                                             Services. However,
                                                             outbound
                                                             information can be
                                                             read directly.
                                                             Connect-It can read
                                                             the outbound data
                                                             from the eventout
                                                             queue.


Product           Internal/External     Routing direction  Description
                  product
                                        Inbound and        These products
SCMail            External              outbound events    establish a client
                                                           connection to the
SCMap                                                      Service Manager
                                                           server through a
SCAutomate produ                                           listener (sm) and
cts                                                        information is
                                                           routed bi-
                                                           directionally
                                                           through the
                                                           connection.

Related topics

Communication with external systems
Event Services routing
Output events


1.1.4.1.5. Event Services tables

Event Services uses the following tables.

Table name                                 Description
eventregister
eventin                                    Defines the events that exist in the system.
eventout                                   Event registration records also specify the
eventmap                                   eventmaps used to process events and
eventfilter                                defines the RAD application used for
                                           processing.

                                           Table used to move information into Service
                                           Manager from an external system. If a
                                           corresponding input eventregister record
                                           exists, external or internal applications can
                                           write records to the eventin table.

                                           Table used to move information from
                                           Service Manager into an external system. A
                                           specific type of an eventout record can be
                                           written only if a corresponding output
                                           eventregister record exists.

                                           Defines how information is parsed.
                                           Eventmaps define individual fields and
                                           create condition statements for eventin and
                                           eventout records. Many eventmap records
                                           can exist for each eventregistration record.

                                           Prevents duplicate events. Filters block
                                           incoming events based on defined criteria
                                           to prevent external systems from creating
                                           many eventin records for the same item in a
                                           short amount of time. Filters can block
                                           events by time frame, item, or location.

Related topics

Event Services
Event Services and Change Management
Generating email messages
Event Services and Service Manager e-mail
Event Services operations


Event Services routing
Event Services workflow


1.1.4.1.6. Event Services workflow

Service Manager Event Services has the following workflow:

 Phase                                                                                           Service Manager 9.81
 1
                                        Details related to the phase
 2
                                        Event Services (ES) uses a scheduler called
 3                                      event. You start and stop the event
                                        scheduler like any other Service Manager
 4                                      scheduler and process events in
 5                                      background or asynchronously.

 6                                      The event registration file contains all of the
                                        information Event Services needs to
 7                                      determine what to do with each event.

Related topics                          Mapping records contain instructions to
                                        move data from the eventin record to fields
Event scheduling                        in Service Manager files.
Event Services
Mapping events                          Based on instructions in the mapping
Event Services tables                   records, a data structure is built.

                                        A multi-purpose call routine is issued to the
                                        application named in the registration record,
                                        along with any necessary variables.

                                        When the application has completed, an
                                        output event is created and added to the
                                        queue, if instructed by the registration.

                                        If Event Services has nothing left to do, it
                                        sleeps for an interval, then reawakens to
                                        look for more work.


1.1.4.2. Event Services operations

Event Services has the following actions.

Action                                  Description
Review Agents
                                        Opens the Event Scheduler and displays the
Send Email                              details of scheduled system events.
Write an Output Event
                                        Initiates an e-mail event.

                                        Initiates the event create script and prompts
                                        you to select the type of external event:
                                        Incident, Inventory or Generic (message).

Related topics

Agent status
E-mail events
Event Services


1.1.4.2.1. Registered events

Each event has a record in the eventregister table. Each event record includes a unique event
code and a sequence number. A single event can start a series of applications. Each event
record also contains initialization statements, mapping information and instructions for calling
the Service Manager application. Registration is necessary for all input events that external
applications process.

Example

Records in the eventregister table contain unique identification codes. The pmo code identifies
opening an incident. When a pmo event occurs, Event Services calls the axces.apm application
if the condition is true. The event parameters are passed by name and value. The Map Name
identifies the event map to use when mapping the information into Service Manager tables.

The event registration record contains expression statements that create different queries,
depending on the source of data. For example:

$ax.query.passed=nullsub("flag=true and network.name=\""+2 in $axces.fields+"\"", "false")
if (index("axmail", evuser in $axces)>0) then ($ax.query.passed=nullsub("flag=true and
logical.name=\""+1 in $axces.fields+"\"", "false"))

The query uses network.name to select open incidents for update. The SCAuto mail incident
event uses logical.name.

The pmo event registration record instructs Event Services to:

     Select a record from the probsummary file (based on the query in $ax.query.passed).
     Map data from the eventin record ($axces) based on the incident open (evmap in
     $axces.register) map record.
     Open an incident.

In most standard Event Services input applications, the first two parameters passed are the
event record and the name of the event map. An exception in standard Service Manager
SCAuto applications is e-mail, which passes the mail record and the delimiter character.

Related topics

Event Services
Generating email messages
Input events
Mapping events
View registered events


1.1.4.2.1.1. View registered events

Applies to User Roles: System Administrator

To view registered events:

   1. Click Tailoring > Event Services > Registration.
   2. Click Search.
   3. Select an event registration record to view its details.

Related topics

Event Services
Registered events
Add a registered event


1.1.4.2.1.2. Add a registered event

Applies to User Roles: System Administrator
To add a registered event:

   1. Click Tailoring > Event Services > Registration.
   2. Complete the top-portion of the Event Registration form.
   3. Provide the appropriate information on each tab: Expressions, Basics, Application.
   4. Click Add.

            Note

           You can delete any registered events added by administration users, but you can't
           delete any out-of-box events.

Related topics

Registered events
Mapping events
View registered events


1.1.4.2.2. Input events

The eventin table contains input event log records. It contains a record for every event
detected, but not filtered, by SCAutomate external applications. Each record contains the event
code, a unique system ID and a time stamp. During the input event, data passes to Service
Manager in a character string using a delimiter character to separate fields.

Related topics

View Event Services input events


1.1.4.2.2.1. Input event processing

An external application inserts all records in the eventin table and external programs
manipulate the eventin records. For example, SCAutomate supports an event named email.
External sources can send electronic mail and pass it to Service Manager mail. The sources for
electronic mail can be external e-mail systems, alert monitors, or other programs that can send
messages. The external SCAutomate application packages the data in a standard format and
stores it in the eventin file. Eventmap records specify the format of the data.

Processed records in the eventin table don't contain a First Expiration value. Normally, Event
Services deletes event records after they are processed unless they are filtered or an
exception occurs during processing. There is a condition set in the eventregister table that
controls the delete flag.

If an error occurs due to Format Control processing, event processing terminates for that event
and Event Services writes the specific error message to the eventin Messages log and to the
Service Manager msglog file.

After you install and test SCAutomate, do one of the following:

     Set all delete flags in the eventregister records to true.
     Use the Service Manager purge/archive routines to schedule cleaning up the eventin
     table on a regular basis.

Related topics

Input events
View Event Services input events


1.1.4.2.2.2. View Event Services input events

Applies to User Roles: System Administrator
To view Event Services input events:

   1. Click Tailoring > Event Services > Input Events.
   2. Click Search.
   3. Select an input event record.

Related topics

Event Services
Input events
Input event processing


1.1.4.2.3. Output events

The eventout table contains output event log records. It contains one record for each event
processed by Event Services applications and instructions that the external software uses.
This type of data passes to external applications in a character string with a delimiter character
to separate fields.

Related topics

Output event processing
View Event Services output events


1.1.4.2.3.1. Output event processing

External programs manipulate the eventout records.

Expired events

Processed records in the eventout table don't contain an expiration date. Normally, Event
Services deletes events from the eventout table after processing unless an error occurs. You
can manipulate a flag in the external IPAS or SCAutomate software to cause record deletion
after a read operation; however, because multiple SCAutomate processes can read the same
record, it's not always feasible to delete the record after each read operation. We recommend
that you use scheduled Service Manager purge/archive routines to clean up the eventout table
on a regular basis.

Related topics

Output events
View Event Services output events


1.1.4.2.3.2. View Event Services output events

Applies to User Roles: System Administrator
To view Event Services output events:

   1. Click Tailoring > Event Services > Output Events.
   2. Click Search.
   3. Select an output event record.

Related topics

Event Services
Output events
Output event processing


1.1.4.2.4. Generic events

Generic event options enable you to manage outgoing event records into Connect-It, including:

     Editing eventout information generation
     Exporting configuration records
     Exporting database dictionary structures

Related topics

E-mail events
Event Services
Input events
Mapping events
Out-of-box events
Output events
Registered events
Troubleshooting: Event Services


1.1.4.2.5. E-mail events

A standard e-mail event that Service Manager creates is the opening of a problem with a valid
Contacts field. This event can notify individuals of a problem in their area of expertise. You also
can create e-mail events using the User Services Send Mail function.
In addition to the standard creation of e-mail events in Service Manager, any RAD application
can create an event. An example of this is implementing e-mail notification for problems that
reach a specified status.

Related topics

Event Services
````
