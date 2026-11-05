---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.1.4.3 .. 1.1.4.4
printed_pages: 326-358
---

# 1.1.4.3 Mapping events

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.4.3. Mapping events

After creating an eventregister record for an input or output event, a mapping record in the
eventmap table describes the process to manage the event. The event mapping record directs
the event and its associated data to create results that are used within Service Manager or in
an external application.

Mapping also allows complete flexibility of data manipulation during the mapping process.
Because Event Services runs as a background task, no input/output routines are available for
online validation with user feedback, but you can check field values and make substitutions
based on processing statements.

Related topics

Change Management input event registration
Change Management output events
Event Services
View event maps


1.1.4.3.1. Event mapping process

The eventmap table contains event mapping information. There are two types of maps: input
maps and output maps. Input maps have information about moving data from the External
Information String (evfields) field for the eventin record to the target table. Output maps have
information about moving data from the source file to the External Information String field for
the eventout record.

The purpose of event mapping is to relate elements in a list to fields in a record. An external
event, such as SCAutomate or SCAuto for NetView, passes data in the Service Manager
eventin file to a field called fields. Each element is separated from the others with a delimiter,
or separation character. In the following example, the ^ character separates the five fields.

  john@microfocus^falcon^toby;al;joe^Meeting today^Tue 12 Aug

Internally, Event Services converts this string to a list ($axces.fields).

  john@microfocus
  falcon
  toby;al;joe
  Meeting today
  Tue 12 Augcol

The event processor assumes that fields with a type of date/time are in the time zone of the
Service Manager system (that is, the time zone defined in the System Wide Company Record).
If the event background process has an operator record, that time zone for that operator is
used. For synchronous processing, the session processing the event handles the date/time in
the time zone where it is defined.

Mapping defines the link between the elements in the internal list (evlist) and fields in a Service
Manager file. The first field, john@microfocus, is mapped to the user.to field for the mail file.

Standard event maps

Out-of-box event maps describe standard events. Changing the relative position of data in the
information exchanged between Service Manager and the external applications may cause
standard events to fail. It is better to create new maps for non-standard events rather than
modifying existing maps.

Related topics

Change Management input events
Change Management output events
Event Services
Input event processing


Output event processing
Output events
Rules for building maps
View event maps
View registered events
Standard events


1.1.4.3.1.1. View event maps

Applies to User Roles: System Administrator

To view event maps:

   1. Click Tailoring > Event Services > Maps.
   2. Click Search.
   3. Select an event map.

Related topics

Mapping events
Event mapping process


1.1.4.3.2. Using event maps

Each record in the eventmap table describes a single field for an input or output event.

For an input event, Event Services uses information in the eventmap record to map data from
an external source that it can import into a Service Manager table.

For an output event, Event Services uses information in an eventmap record to map data in
Service Manager tables into a sequence of delimited fields that it can export to external
applications.

Example

When a Service Manager user sends e-mail, specific fields in the Service Manager mail file are
populated. These include user.to, user.from, user.array, subject and text. The event map
describes the information in these fields in a standard, defined sequence to ensure that the
SCAutomate mail application can translate it to external programs. When SCAutomate receives
mail from an external program and posts it to an eventin record, the Event Services event map
describes how to populate the required fields in the Service Manager mail file.

For example, the user.from field in the Service Manager mail record is in the second position.
Through mapping instructions, it becomes the second field in the delimited text string written
to the eventin record. For output, Event Services puts the contents of the user.from field in the
Service Manager mail record into the second position in the External Information String field of
the eventout record and changes the Type field to output.

If you have custom mapping records for e-mail and they are deleted, Service Manager uses the
out-of-box e-mail eventmap record.

Related topics

Event mapping process
Mapping events
Rules for building maps
Using expressions in event maps


1.1.4.3.2.1. Mapping an array of structures

The following example shows an event string that maps information into an existing Change
Management task. The last portion of the string maps data to the parts and labor array of
structures fields in the cm3t table. The vertical bar (|) array separator delimits each array. Each
portion of the array with the | delimiter has another subdivision using the grave accent
structure separator (`).

  T^^update^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  ^^^THIS IS A TEST^^^^^^^^^^^^^^^^^^^20^01/01/0112:41:23`AAAA`
  11111`|```|02/02/02``22222`^03/01/02` falcon`3.5`DEFAULT US`

Related topics

Change Management input event registration
Change Management output events
Mapping events
View event maps


1.1.4.3.2.2. Mapping to multiple tables

Event Services also handles mapping to multiple tables. For example, SCAutomate for NetView
and SCAutomate can send inventory information that's stored in more than one table.
Configuration Management applications use two tables to describe each device: the entity
table and the attribute table. The entity table is named device; the attribute file depends upon
the device type, and is identified by the type field in the entity table. When Configuration
Management information is gathered using discovery processes in external applications, Event
Services passes the data to Service Manager using SCAutomate and updates both tables.

Example: Mapping to multiple tables

This example describes how to map to the device and attribute tables. Remember the roles of
these Event Services tables:

     The eventregister table: Contains one record for every pre-defined event.
     The eventmap table: There are several out-of-box event maps for adding a new device
     named inventory add. Each inventory add map contains the instructions to map data for
     one field.

To view the inventory add map records:

   1. Click Tailoring > Event Services > Maps.
   2. Type inventory add in the blank Map Name field.

   3. Click Search.

     Service Manager displays a list of out-of-box event maps named inventory add.

   4. Select the inventory add event map record where the Position is 9 and the Field Name is
     type.

   5. Click the Expressions tab. The following expression in the Post Map Instructions
     identifies the attribute table.

      $attribute.file=type in $axces.target

     This instruction sets the variable $attribute.file to the value in the type field of the device
     record.

If you view the first inventory add event map records, The Sequence is 1, and the File Name in
the map record is device. Notice that each record identifies a different field to be mapped. Until
all fields are mapped to the device file, the Sequence remains 1 and File Name remains device.

After the last field for the initial file is mapped, the record is added or updated and a new file is
initialized based on the value of $attribute.file.

While $axces.target and$axces.field have special meaning within Event Services, $attribute.file
is an arbitrary global variable name.


When all fields are mapped into the device file, the next map record has a Sequence of 2, the
File Name is different and a Query is supplied.

     File Name now contains the value assigned to the $attribute.file variable.
     Query tells Event Services how to select the record to update from the file identified by
     $attribute.file. The query can be either a literal statement (as shown in the previous
     example) or a variable set in previous Post Map Instruction or Initialization fields.

The first mapping for the new file is logical.name, which is stored in Position 1 (as shown in the
previous example) of the evfields array field, which is represented by the $axces.fields variable
in the eventin record.

Subsequent map records move data from the eventin record to the new file. When updating an
existing record, Event Services substitutes the value in the original record for a null value
passed from the eventin record.

Build an event map

Applies to User Roles: System Administrator

To build an event map:

   1. Click Tailoring > Event Services > Build New Map to open the Build Event Mapping form.
   2. Type the map name and source table name, and click Next.

     Once you have selected a table, Service Managerdisplays a screen that allows you to
     build the event map for the table you selected. A list of field names and data types for the
     table you selected is displayed.

   3. To delete a field before building the map, select the field from the list, and click Remove
     Field.

                   Note

                If an array field is part of your mapping, delete the second instance of the
                field in the list presented when building a new map, leaving only the array
                field.

   4. To view the details of the event map, click Select Map.

   5. Click one of the following options to build a map:

           Build Input: Builds the records that map information from the eventin file to the
           selected Service Manager table.
           Build Output: Builds the records to map information from the selected file to a
           formatted string to be passed to SCAuto using the eventout table.

Related topics


Change Management input event registration
Change Management output events
Event Services
Mapping events
View event maps


1.1.4.3.2.3. Using expressions in event maps

You can check field values and make substitutions based on processing statements.

For example you can use the following expression to check field values and make substitutions
based on processing.

if (logical.name in $axces.target="UNKNOWN")
then (logical.name in $axces.target=network.name in $axces.target)
or
if (logical.name in $axces.target=NULL
then (logical.name in $axces.target="?"+str(tod()))

In this example, the value the value in network.name replaces logical.name if logical.name is
UNKNOWN. The second statement sets logical.name to a constant if it is NULL.

Other common uses for expressions are to set the value of a field to the current date and time
and to calculate a value based on information in the record. Event Services applications
handles data type and case conversions as long as the Field Type field is correctly identified
and the data is written to the descriptor structure.

You can use a single Format Control record named login.event to establish initial global
variables (such as lists of valid operators) when the event agent is started, just as you can for
users when they log into Service Manager.

If you are writing data to a field whose name exists in more than one structure in a record, you
must explicitly name the field. For example, if you add a field named assignment to the middle
structure of your incident database dictionary record and you want to manipulate that field, you
must identify it as middle,assignment. The field must exist in the target file before any
instruction can manipulate it. Ensure the data type is correctly identified.

Related topics

Event mapping process
Mapping events
Rules for building maps
Using event maps


1.1.4.3.2.4. Mapping and Configuration
Management

While Service Manager provides both an entity file (device) and attribute files (for example,
server), it is unnecessary that both files exist to represent the characteristics of every device
type. You can often fully describe a device using only the fields in the device file.

The map record for the type field (field #9 in standard events) defines how Service Manager
selects and displays information about a device once the data is added. The type field in the
device file refers directly to the associated attribute file of each device. If no attribute file
associated with a device, the type field must contain device or be empty (NULL).

Similarly, the format.name field in the device record defines the name of the form that displays
the device within Service Manager and, by extension, the name of the join file that temporarily
stores information for review and update. The formatctrl record for the format name stored in
the device record must contain device as the file name for all device types that don't have
associated attribute files.

If an external agent detects an unknown device type, Service Manager processes the event,
updating the device file with the information provided. If no attribute file exists for that device
type, a Warning message is written to the Message list for the event but the device is still
added or updated in the Service Manager data repository. If event mapping indicates
processing in more than one table, but the number of fields passed to the event is less than the
position of the first field in the second table, there is no attempt to open the second table.

Related topics

Considerations for Configuration Management maps
View event maps


1.1.4.3.2.5. Considerations for Configuration
Management maps

While Service Manager provides both an entity file (device) and attribute files (for example,
server), it's not necessary that both files exist to represent the characteristics of every device
type. You can often fully describe a device using only the fields in the device file.

The map record for the type field (field #9 in standard events) defines how Service Manager
selects and displays information about a device once the data is added. The type field in the
device file refers directly to the associated attribute file of each device. If no attribute file
associated with a device, the type field must contain device or be empty (NULL).

Similarly, the format.name field in the device record defines the name of the form that displays
the device within Service Manager and, by extension, the name of the join file that temporarily
stores information for review and update. The formatctrl record for the format name stored in
the device record must contain device as the file name for all device types that don't have
associated attribute files.

If an external agent detects an unknown device type, Service Manager processes the event,
updating the device file with the information provided. If no attribute file exists for that device
type, a Warning message is written to the Message list for the event but the device is still
added or updated in the Service Manager data repository. If event mapping indicates
processing in more than one table, but the number of fields passed to the event is less than the
position of the first field in the second table, there is no attempt to open the second table.

Related topics

Change Management input event registration
Change Management output events


1.1.4.3.2.6. Rules for building maps

For best results when building new maps that use array fields, follow these guidelines.

     Select the first instance of any array fields (such as user.array in the mail file) so the
     proper type is built for the field.
     Only scalar and array fields can be directly mapped; all other types must be manipulated
     using expressions.

If possible, build maps first and then design external applications to use the maps.

Related topics

Event mapping process
Event Services
View event maps


1.1.4.3.3. Filtering events

Event filtering information is stored in the eventfilter file. This file instructs SCAuto when to
block incoming events. If an event is not blocked, filters also can prevent opening incident
records based on recurrence intervals and counts, and on incident intervals.

The number of filters available for external blocking is unlimited. The external process
(SCAuto) reads the eventfilter file to select records with the same Event Code and User Name
(or User Name=NULL) and with Block Events?=true until it finds one that satisfies the criteria
for the event being processed. If none is found, the event is inserted in the eventin file.

Once records are added to the eventin file, Event Services assumes the filtering task using
Internal Filters. Event Services first selects the filter with the same Event Code as that of the
event being processed and with a Network Name of SCAuto. This filter must contain all internal
blocking conditions. If an eventin record satisfies one of the Block Conditions, it is updated to
reflect a Status of blocked. The event action (for example, incident open or inventory add)
doesn't take place.

With incident open event types (pmo), the Additional incident Filters take effect if no blocking
condition exists. This filtering mechanism is available only when opening new incidents.

Related topics

Event Services
Selecting filters


1.1.4.3.3.1. View event filters

Applies to User Roles: System Administrator
To view event filters:

   1. Click Tailoring > Event Services > Filters.
   2. Click Search.
   3. Use the External Filters, Internal Filters, or Additional Incident Filters tab to view the

     appropriate filter types.

Related topics

Filtering events


1.1.4.3.3.2. Event blocking

The external SCAuto application use the External Filters tab of the filter record to prevent the
insertion of eventin records in the Service Manager database. The contents of the User Name
field must either match that of the external process or be empty (NULL).

The Block Events? condition must be set to true to prevent records from being added to the
eventin file. The Start Blocking at and End Blocking at values are optional. However, they allow
for a block to be placed over a specified time frame allowing a more customized
administration.

Event blocking with conditions

You can also prevent the insertion of events for specific network devices, domain names and
error types by using the Index, Value, and Condition fields. Use these fields independently or in
conjunction with the Start Blocking at and End Blocking at fields to populate other fields on the
form.

     Index refers to the position of the data in the event message.
     Value refers to the actual data contained at that position.

For example, a pmo event contains the following message:

hp^hp^^6 58916865^Node Down^^^^SNMP
Trap(IPAS)^net.hware^^^^^^^^^^^

The caret (^) character separates fields in the message. The first field, which references the
logical name of the device, contains hp. To block the insertion of all incident open events
reported for the device hp, type pmo in the Event Type field, 2 in the first Index field and hp in
the first Value field.

            Note

           Only Index values of 2 or 3 are supported for incident open actions.

Example: Event blocking with conditions

This is an example of event blocking from two servers, microfocus and falcon.

To block incident open events from both microfocus and another server named dolphin, select
or in the Condition field, 2 in the second Index field and dolphin in the second Value field on
the External Filters tab. If you specify a condition (AND or OR), then you must complete both
Index and both Value fields.

To prevent insertion of records in the eventin file, the Block Events? field must be true
(checked).


To specify a time range for blocking, set the Start Blocking at and End Blocking at fields. In this
example, use 08:00 for start blocking and 17:00 for end blocking.

With these settings, all inventory add (icma) events are blocked between 08:00 and 17:00 if
they come from either the microfocus or dolphin server. This action avoids unnecessary adds
and updates if installation activity is scheduled to occur on the network during this time.

Related topics

Event scheduling
Event Services
View event schedules
View Event Services agent status
View registered events


1.1.4.3.3.3. Selecting filters

Filters are selected using the following search criteria and in the order listed:

     The Event Type is the same as that of the event being processed . The Network Name is
     the same as the network name specified in the eventin record. The Cause Code is the
     same as the cause code specified in the eventin record.
     The Event Type is the same as that of the event being processed. and the Network Name
     is the same as the network name specified in the eventin record.
     The Event Type is the same as that of the event being processed and the Network Name
     is AXCES and the Cause Code is the same as the cause code specified in the eventin
     record.
     The Event Type is the same as that of the event being processed and the Network Name
     is AXCES.

Example: Selecting filters

This example demonstrates how you can set up filters on the Additional Incidents Filter tab to
block events.
The following is the event example:

  hp^hp^^6 58916865^Node Down^^^^SNMP
  Trap(IPAS)^net.hware^^^^^^^^^^^

The queries are:

  evtype="pmo" and evnetnm="hp" and evcode="6 58916865"
  evtype="pmo" and evnetnm="hp"
  evtype="pmo" and evnetnm="AXCES" and evcode="6 58916865"
  evtype="pmo" and evnetnm="AXCES"

You can permanently block problem open by entering a Network Name or Cause Code. This
has the same effect as a Block Condition except that the status in the eventin record is filtered
rather than blocked.
For example, using hp for Network Name and SNMP 2.0 for Cause Code. This prevents any
events from server hp with cause code of SNMP 2.0 from opening a problem.
You can further refine the filter by entering an Event Interval and Recurrence Count. For
example, if you set Event Interval to ten minutes and Recurrence Count to 3, the filter prevents
any events from server hp with cause code of SNMP 2.0 from opening a problem unless three
events are received within a ten minute interval.

Related topics


Event Services
Filtering events


1.1.4.4. Event Services and Change
Management

The Change Management application of Service Manager is fully supported by Event Services.
This allows users outside of the Service Manager system to perform all standard functionality
of Change Management from an external system, for example, SAP or PeopleSoft. The Event
Services implementation is bidirectional, allowing external systems to synchronize with the
Service Manager system.

With Event Services, Service Manager uses input and output events to transfer data in and out
of Change Management.

You should have an administrator level of knowledge of Change Management and Event
Services to use Event Services with Change Management.

Related topics

Change Management eventin fields
Change Management input event registration
Change Management input events
Change Management output events
Event Services
Event Services tables
View event schedules
View Event Services agent status
View registered events


1.1.4.4.1. Change Management input events

A correctly formatted eventin record must be created within Service Manager to use an
external system to produce an action within the Service Manager Change Management
application. You can format the eventin record with an SCAutomate product.

Related topics

Change Management eventin fields


1.1.4.4.1.1. Change Management eventin fields

The eventin record fields specific to the Change Management implementation are:

Field                                   Description
Event Code (evtype)
                                        Name of the corresponding Event
User Name (evuser)                      Registration record to use for this event.
                                        This must always be cm3rin for changes
External Information String (evfields)  and cm3tin for tasks.

                                        User name in this field is interpreted as the
                                        operator for this event. The Change
                                        Management environment used depends on
                                        which user is entered in this field.

                                        Delimited data fields that correspond to a
                                        specific event mapping.

Related topics

Event Services
Event Services and Change Management
Synchronizing with an external system
View event maps


1.1.4.4.1.2. Change Management input event
registration

Change Management uses events cm3rin and cm3tin for input events. One of these two event
codes must appear in the eventin record, depending on whether the event is related to a
change or a task.
Change Management events


1.1.4.4.2. External information string

The external information string, or EIS, is the evfields field of the eventin record. This field
carries the specific data of the change or task into the Service Manager system. These fields
are placed in a single string with a user-specified separation character (the default is the ^
character). The first four fields contain specific functions that determine which change/task is
being processed and what action the system should take. These fields are passed in a specific
order.

Sequence                                Field Description
1
2                                       Change/Task number of the object to be
                                        acted upon. This field is blank when
3                                       opening a change or task.
4
                                        The foreign ID. This field is the identifier of
                                        the change or task used by the external
                                        system. This field is used if a different
                                        number is used outside of Service Manager.

                                        Action Token indicates which logical action
                                        to take, either: open, update, close, reopen,
                                        approve, unapprove, disapprove.

                                        The Change Group or operator performing
                                        an approval action. It is only used for
                                        approve, unapprove, or disapprove.

The data fields in the EIS contain field-level data that Event Services uses to populate the
change or task record being processed. If the action performed is not an open, these fields
write over any existing data in the change or task. If a field in the EIS is blank, the existing data
in the change or task is used. The exact field that each piece of data corresponds to can be
determined by examining the proper input event map for changes (cm3r) or tasks (cm3t).

Related topics

Event Services
External information string actions
External information string fields


1.1.4.4.2.1. External information string fields

The first two external information string (EIS) fields determine the unique identifier of the
change or task both in Service Manager and in an external system (if applicable).

The first field contains the unique number that corresponds to the number field in the cm3r or
cm3t database dictionary. This field is blank if the action is open.

The second field of the EIS corresponds to the foreign.id field of the change or task. This field
specifies the unique identifier of the change or task in the external system that's sending the
request. If the Service Manager number is not specified, the system attempts to find the
correct record by comparing the foreign.id to this field.

Related topics

Event Services
External information string
External information string actions


1.1.4.4.2.2. External information string actions

Event Services uses the third field of the external information string (EIS) to determine what
type of action to perform on the specific change or task specified by one of the first two fields.
The following table describes the supported actions.

Action                                  Description
approve                                 Approve a change or task.
disapprove                              Disapprove a change or task.
unapprove                               Unapprove a change or task.
open                                    Create a new change or task.
update                                  Update an existing change or task.
close                                   Close current phase and advance to the
                                        next phase, if applicable.
reopen                                  Reopen a change or task in the current
                                        phase.

When the action is an approval action (either an approve, disapprove, or unapprove), the
Change Management Group or Operator Name that's performing the approval action must be
specified in the fourth field of the EIS. The group or operator specified must match one of the
approval groups specified in the change or task record for the approval action to complete
properly.

Related topics

Event Services
External information string
External information string fields


1.1.4.4.3. Synchronizing with an external
system

When Service Manager is used with a separate external system, the changes and tasks must
be synchronized between the two systems. Event Services supplies two methods of sending
output to the external system for this task.

First, a simple acknowledgment can be sent to the external system. This acknowledgment
contains enough data to map the Service Manager change or task number to the unique ID
used in the external system, along with enough messages to determine if the input event was
successful.

Alternatively, a complete output event may be sent to an external system in order to
synchronize every piece of data between the two systems.

Related topics

Communication with external systems
Event Services
Integrations
Supported products


1.1.4.4.3.1. Acknowledgement events

The cm3rinac and cm3tinac event registrations are used as acknowledgement events to
synchronize the unique numbers of each system when Service Manager is used with an
external system.

Event Code  Input/Output                Event Map  Application  Description
cm3rinac    Output                      cm3ack     axces.write
                                                                Used for
cm3tinac    Output                      cm3ack     axces.write  changes.

                                                                Used for tasks.

Both event types use the cm3ack event map definition. The following table shows the mapping
passes the fields in the external information string (EIS) of the eventout record.

Sequence                                        Field description
1
2                                               The change or task number of the object
                                                being acknowledged.
3
4                                               The foreign ID. This is the identifier of the
                                                change or task used by the external system.
5                                               This field is used if a different number is
                                                used outside of Service Manager.

                                                Action Token indicating which action was
                                                performed on this object (open or update,
                                                for example).

                                                The status of the eventin record created by
                                                the original event. This field may be used to
                                                determine if there were any errors
                                                encountered when processing the original
                                                event.

                                                An array of up to five messages sent during
                                                the original event (example: Change 15
                                                updated, Location XXX is invalid). These
                                                messages can be used to determine if a
                                                Format Control or validation error occurred
                                                during the original event.


The acknowledgment events can be turned on or off in the cm3rin or cm3tin Event Registration
records by modifying the value associated with the boolean1 parameter on the application tab.
When this parameter value is set to true an acknowledgment event is sent out each time an
input event is processed, while a setting of false keeps the acknowledgment event from being
sent.

Related topics

Change Management output events
Event Services
Output events
View Event Services output events
View registered events


1.1.4.4.4. Change Management output events

The standard output events for Change Management are triggered by the cm3messages file.
When the change scheduler processes a cm3message, the value is checked in the Event
Services Reg (axces.out) field in the corresponding cm3message record. If the value matches
an output event (most likely cm3rout or cm3tout), that event is processed and an eventout
record is written. This gives an administrator great flexibility when deciding what types of
events (opens or alerts, for example) cause the output event to be written.

The output maps used for these events are cm3r and cm3t. These maps correspond to their
related input maps with the exception of the third and fourth fields. The third field contains the
name of the event that caused the event to process (for example, cm3r open or cm3t update).
The fourth field is used as a place-holder to keep the data fields of the input and the output
event synchronized and always contains the words not used.

Related topics

Change Management eventin fields


1.1.4.4.5. Example: Open a change

This example uses the following parameters:
     category for adv-nam-desk-101 - Hardware
     external foreign ID - CM01
     requested by - System.Administrator
     assigned to - Servicedesk.Agent

The change contains a simple description while letting all other fields use default values.
The event register has the following specific fields:

     evtype is cm3rin
     evuser is System.Administrator
The external information string (EIS) is:

  ^CM01^open^^^Hardware^^^System.Administrator^^^^Servicedesk.Agent^^^^^^
  ^^^^^^^^^^^^^^^^
  ^^^^^^^^Move HP Pavilion M9160Elite to Mike's
  office.^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  ^^adv-nam-desk-101^^^···

The field positions correspond to the cm3r input event map as follows:

Position                                Field name    Value
2                                       foreign.id    CM01
3                                       actiondummy   Open
6                                       category      Hardware
9                                       requested.by  System.Administrator
13                                      assigned.to   Servicedesk.Agent
42                                      description   Move HP Pavilion
                                                      M9160Elite to Mike's office.
76                                      logical.name  adv-nam-desk-101

Related topics


Change Management eventin fields
Change Management input event registration
Change Management input events
Change Management output events
Considerations for Configuration Management maps
Event Services
Event Services and Change Management
Change Management events
````
