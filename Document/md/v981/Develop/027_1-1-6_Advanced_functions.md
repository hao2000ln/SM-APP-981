---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.1.6 .. 1.1.6.2
printed_pages: 718-753
---

# 1.1.6 Advanced functions

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.6. Advanced functions

The system permits control of user interaction with the following utilities:

     Service Manager macros — invoke to do things like sending an email to a
     specific address when a specified event occurs.
     Publish and subscribe — display static or dynamic labels, marquees, and charts.
     Scripting — collect data by prompting users to enter specific information into
     their forms.

Related topics

Tailoring
Service Manager macros
Publish and subscribe
Scripting


1.1.6.1. Service Manager macros

Service Manager macros are discrete units of work a System Administrator invokes to
do things like sending emails to a specific address. These macros are more similar to
Microsoft Access macros than to Microsoft Word macros, which simply record and
play back keystrokes.

Macros are distinct actions, driven by predefined conditions, that execute when
saving a record in the database. Macro actions are associated with files and reflect
certain states in the records of those files. If a macro's condition evaluates to true
when saving a record, the macro's action executes. A typical condition is
priority.code in $L.new= "1" , causing that macro’s action to execute when a saved
incident record has a priority code of 1.

As a Service Manager System Administrator, you can create macros to run processes
automatically when specified events occur. For example, you can create a macro to
send an email to a manager when an incident record hits a deadline alert.

Related topics

Macro conditions
Create a macro
Definitions for macro forms
Macros provided with Service Manager


1.1.6.1.1. Macro conditions

Macro conditions are expressions written in Service Manager Rapid Application
Development (RAD) syntax that evaluate at run time. If the expression evaluates to
true, the macro executes. If the expression doesn't evaluate to true, the macro can't
proceed.
A macro’s condition can be very simple. For example, true or tod()< = ‘17:00:00’>.
Macro conditions often include a check against the record being saved. For example,
a macro condition can be expressed for an action or group of actions when a specific
set of incident records is saved.
The record currently being saved is identified to macro conditions as $L.new. This
variable can be used as $file in Format Control expressions. Macro expressions also
have $L.old available. This represents the state of the record before it was altered. All
the following expressions are valid:

     priority.code in $L.new=“1”

Executes whenever a priority 1 record is saved.

     assignment in $L.new~=assignment in $L.old

Executes whenever the assignment group changes.

     tod() <= ‘17:00:00’

Executes whenever a record is saved before 5:00 PM.
The variable $L.message can create evaluating expressions that gather certain
information about incident records. This data is then sent as a message to specific
users or groups defined in the Macro Parameters form. The $L.message is expressed
as an array, using the following syntax:

  $L.message={"Incident#" +number in $L.new, brief.description in
  $L.new}

The result is an array of the Incident ID and Incident Title in the record being saved
($L.new). The message might look like this:

  Incident # IM1012
  Phone is going dead intermittently.


Related topics

Service Manager macros
Create a macro
Definitions for macro forms
Macros provided with Service Manager


1.1.6.1.2. Accessing macro records

You can access macros from either of the following locations:

     Click Tailoring > Tailoring Tools > Macros.
     Incident Management Security Files.

Warning: Don't edit macros through the Database Manager. Certain processing
doesn't occur and your edits may lose.

You can select individual macro records from a list or search for groups of related
macros. For example, those associated with probsummary .

Note: You need System Administrator privileges to run the macro editor.

Access a macro record

   1. Click Tailoring > Tailoring Tools > Macros.

     The list of available macros opens. This is the access point for all your macro
     activities. You must go through this form to add, edit, or delete macro records.

     The macro list form displays the results of macro queries. You can use the
     option buttons on this form to view and process macros.
   2. To open an individual record, highlight an item in the list and then click Edit.

   3. Use the following procedure to display a list of related records:

     a. Click Search. The macro search form opens.

     b. Add optional search criteria in any field. For example:

          • ID: the number identifying the macro. The system assigns this number.
          • Filename: the Service Manager file associated with the macros.
          • Name: the unique name of the macro.
          • Type: the macro type for the macro(s) that you are searching for.
     c. Click OK. The system opens the macro list form, showing all the macros
     matching your search criteria.

     d. Select a macro record to edit.

          You can edit existing macros and create new ones. You can also select
          macro types and set conditions for their execution.


          The values selected in this form decide which fields show in the parameter
          form.
   4. If you make any changes, click OK.

Related topics

Service Manager macros
Macro conditions


1.1.6.1.3. Create a macro

When creating a macro, you must name and define the conditions of the macro
before setting the parameters for its execution.

   1. Click Tailoring > Tailoring Tools > Macros.

   2. Click Add.

   3. In the Macro Name field, type a name for the new macro.

   4. In the Applies When field, select an event option from the list indicating when
     you want the macro to execute.
     For example, select Incidents are Saved.

   5. In the Macro Type field, select an action you want the macro to execute. Options
     include mailing, starting and stopping clocks, executing a Rapid Application
     Development (RAD) function, or evaluating an expression.

   6. Type a Macro Condition that triggers the macro to execute. When this condition
     evaluates to true, Service Manager executes the action as defined in the Macro
     Type field.

     For example, you can inform a specific person when a new incident record has a
     priority of 1. The condition would look like this: priority in $L.new="1" .

   7. Click Set Parameters to establish the parameters for this macro.
     Note: The available fields in this form vary, depending on the value in the Macro
     Type field in the edit form for your new macro.

   8. Specify additional information where needed. For example, Construct Message
     By.

   9. Click Save.

     The macro edit form opens.

 10. Click OK.
     The macro record saves and you are returned to the macro list form. Updating a
     macro record uses the same edit forms as the creating process.

 11. Click Search from the macro list form to refresh the list of macros.

 12. Click OK in the search dialog box.


Related topics

Service Manager macros


1.1.6.1.4. Definitions for macro forms

Macros are distinct actions, driven by predefined conditions that execute when a
record is saved in the database. Definitions for macro forms are as follows:

     Macro list form
           Column headers
           Option buttons

     Macro editor
           Fields

Macro list form definition

Column Label                            Database field name  Description
Id                                      id
Filename                                filename             A unique number
                                                             assigned to the macro to
Name                                    name                 identify it.
Type                                    type
                                                             The Service Manager file
                                                             that the macro is
                                                             attached to. For
                                                             example, problem or
                                                             device.

                                                             The name you give the
                                                             macro.

                                                             The type of action the
                                                             macro takes when
                                                             activated.

 Button label                                                                                   Service Manager 9.81
 Add
 Edit                                   Description
 Delete
                                        Opens a blank macro editor form for
 Search                                 adding a new macro.
 Clear Filter
                                        Accesses the macro editor to change
 Back                                   the selected macro record.

Macro editor definition                 Deletes the selected macro record.
                                        Warning: When you delete a record, no
                                        warning is given and the record is
                                        simply deleted.

                                        Accesses a query form.

                                        Removes the current filter used for
                                        searching the macros and returns the
                                        list to its previous state.

                                        Returns to the previous process.

Field label                             Database field name                          Service Manager 9.81
Macro name                              name
                                                             Description
Applies When                            filename
                                                             System administrator
Macro Type                              type                 creates unique name for
Macro Condition                         condition            this macro.

                                                             Predefined event option
                                                             for execution of this
                                                             macro. Select an event
                                                             from the drop-down list.
                                                             For example, when a
                                                             change request is saved.

                                                             Predefined macro type
                                                             for this macro.

                                                             Define a condition for
                                                             when this macro should
                                                             execute. For example,
                                                             when a priority 1 incident
                                                             record is opened, email
                                                             the members of an
                                                             assignment group.

Contents

     1 Macro list form definition
     2 Macro editor definition


1.1.6.1.5. Macros provided with Service
Manager


Macro Action                            Description
Call A RAD Routine *
                                        Executes a user-specified RAD routine
                                        and passes its parameters every time it
                                        executes.

                                        Warning: Macros don't work properly
                                        when calling a RAD application
                                        involving user interaction. For example,
                                        fill.recurse or validate.fields. Continue
                                        to use Format Control to call these
                                        types of applications.

Evaluate Expressions                    Executes a number of user-defined
                                        expressions whenever it fires.

Get a Sequential Number                 Fetches the next available sequential
                                        number of a specific class and stores it
                                        in a field in a file.

Mail 1 Person                           Sends e-mail to one person only. This
                                        person can be defined as an operator,
                                        a contact, or a simple “raw” email
                                        address.

Mail a Change Request to 1 Person       Sends e-mail of a change request to
                                        one person only. This person can be
                                        defined as an operator, a contact, or a
                                        simple “raw” email address.

Mail a Change Request to a Message      Sends e-mail of a change request to all
Group                                   the members of a Change Management
                                        Message Group.

Mail a Change Request to Many People    Sends an e-mail of a change request to
                                        an arbitrarily defined list of people.
                                        These people can be defined as
                                        operators, contacts, or “raw” phone
                                        numbers.


Macro Action                            Description
Mail a Change Task to 1 Person
                                        Sends e-mail of a change task to one
Mail a Change Task to Many People       person only. This person can be
                                        defined as an operator, a contact, or a
Mail 1 Assignment Group                 simple “raw” email address.
Mail Many People
                                        Sends an e-mail of a change task to an
Mail an Incident Ticket to 1 Person     arbitrarily defined list of people. These
                                        people can be defined as operators,
Mail an Incident Ticket to an           contacts, or “raw” phone numbers.
Assignment Group
Mail an Incident Ticket to Many People  Sends e-mail to an entire assignment
                                        group.
Mail an Incident Ticket to a Change
Management Message Group                Sends e-mail to an arbitrarily defined
Mail a Task to a Message Group          list of people. These people can be
                                        defined as operators, contacts, or
                                        “raw” email addresses.

                                        Mails an incident record to one person.
                                        This person can be defined as an
                                        operator, a contact, or a simple “raw”
                                        email address.

                                        Mails an incident record to all the
                                        members of an assignment group.

                                        Mails an incident record to an arbitrarily
                                        defined list of people. These people
                                        can be defined as operators, contacts,
                                        or “raw” email addresses.

                                        Mails an incident record to all the
                                        members of a Change Management
                                        Message Group.

                                        Mails a change task to all the members
                                        of a Change Management Message
                                        Group.


Macro Action                            Description
SC Mail 1 Person
                                        Sends Service Manager mail to one
SC Mail an Incident Ticket to Many      person only. This person can be
People                                  defined as an operator, a contact, or a
                                        simple “raw” phone number
SC Mail an Incident Ticket to a Change
Management Message Group                Sends an incident record to an
                                        arbitrarily defined list of people with
SC Mail Many People                     Service Manager mail. These people
                                        can be defined as operators, contacts,
Start a Clock                           or “raw” email addresses.
Stop a Clock
                                        Sends an incident record to all the
                                        members of a Change Management
                                        Message Group with Service Manager
                                        mail.

                                        Sends Service Manager mail to an
                                        arbitrarily defined list of people. These
                                        people can be defined as operators,
                                        contacts, or “raw” phone numbers.

                                        Starts a specified clock.

                                        Stops a specified clock


1.1.6.2. Publish and subscribe

You can present virtually any data generated by Service Manager to users. End users,
from first level support personnel to administrators, need current, updated information
about changing conditions across the system. Publish and Subscribe allows a system
administrator to select pertinent data and present it to user groups in a visual format.

Publish and Subscribe saves system resources by eliminating the need for individual
users to query the system every time they want an update. Desired system data is
gathered by automatic background processes at prescribed intervals and published to
subscriber groups.

Display objects subscribing to Service Manager data are automatically updated with
current information in intervals defined by the System Administrator. Rapidly changing
features and slowly developing trends can be expressed with the same process.

Forms created for specific user groups (for example, Change Management personnel
or Incident Management administrators) provide the end user with dynamic system
data that requires no user interaction to extract data. The System Administrator
chooses the data to be published and defines display attributes, such as chart values,
marquee messages, and color.

Related topics

Publish and subscribe workflow


1.1.6.2.1. Publish and subscribe workflow

     Information is published in Service Manager when system data is associated
     with selected variables and stored in SYSPUB ( Service Manager’s publishing
     house). The System Administrator designates what information stored here is
     available to subscribers.
     Forms designed by the System Administrator for user groups that subscribe to
     the data by using published variables to populate display objects, such as charts
     and marquees.
     Charts display data in bar graph formats. For example, record activity for
     different categories, assignment groups, time periods, and priorities. Charts can
     be added to a form and updated automatically at scheduled intervals; colors can
     be set to reflect priorities; and button bars can be added to provide drill-down
     capabilities for viewing underlying data, such as individual records within
     categories.
     Marquees display messages in horizontal, scrolling banners on a user’s screen.
     This is an effective method of keeping users informed of the status of the
     system. Marquees are added to a form in Forms Designer and set by variables to
     subscribe to a particular message. They may be updated automatically at
     scheduled intervals.

Related topics

Publish and subscribe


1.1.6.2.2. Static messages

Simple static messages and marquees can be published to any form in Service
Manager. For example, you may want to attach a static message to a menu advising a
certain user group of the average time for resolution of an open record. The text of a
static message doesn't change until it is republished in Service Manager. This is the
simplest method of publishing and subscribing.

Related topics

Publish and subscribe
Modify the form for static messages
Publish the static message
Modify the form for a simple marquee
Publish the marquee


1.1.6.2.2.1. Publish the static message

Follow these steps:

   1. Click System Administration > Base System Configuration > Publishing
     Utilities > Publish Messages.

   2. Type the name of the variable from the Input field of the Forms properties Box
     ($SYSPUB.xxx) and the text of your message in the field provided. In this case,
     type: The average time for the resolution of an incident record is 8 hours.

   3. Click OK to publish your message to the Service Manager publishing house.
     The following message appears in the status bar:

          Your message has been published

Important: You can't delete SYSPUB messages. You must edit the label property on
the form you modified in order to remove the message.

Related topics

Static messages
Modify the form for static messages


1.1.6.2.2.2. Modify the form for static
messages

This process publishes a non-updating, text message to a user’s form. The message
remains unchanged until you edit it manually.

   1. Click Tailoring > Forms Designer.

   2. Type the name of the form (menu.gui.pm) in the Form field of the Forms
     Designer dialogue box, and then click Search.

     The Incident Management menu opens.

   3. Click Design to open the Properties Box and the Tool Palette.
   4. Use the Label tool to add a new label to the form. Ensure that the length of the

     label field is long enough to accommodate your message.
   5. In the Properties Box, erase Caption. Ensure this field is blank.
   6. Set Input to $SYSPUB.xxx, where xxx is your initials. The Label field is an empty

     box outlined with a dotted line in the Design mode.
   7. Click OK to save your changes. The label field is invisible in this mode.

Related topics

Static messages


1.1.6.2.2.3. Modify the form for a simple
marquee

This process publishes a non-updating marquee to a user’s form. The marquee
message remains unchanged until you edit it manually.

   1. Click Tailoring > Forms Designer.
   2. Type the name of the form (menu.gui.pm) in the Form field of the Forms

     Designer dialogue box.
   3. Click Design to open the Properties Box and the Tool Palette.
   4. Add a marquee to the form with the marquee tool.
   5. In the Properties Box, erase Caption. Ensure that this field is blank.
   6. Set Input to $MARQUEE.xxx, where xxx is your initials. The Label field appears

     as an empty box outlined with a dotted line in the Design mode.
   7. Click OK to save your changes.

Related topics

Static messages


1.1.6.2.2.4. Publish the marquee

Follow these steps:

   1. Click System Administration > Base System Configuration > Publishing
     Utilities > Modify Marquees.

   2. Type the variable from the Input field of the Forms properties Box
     ($MARQUEE.xxx) in the Name field.

   3. Select a display color from the drop-down list in the Color field.
   4. Type in the text of your message in the Text field. For example: The average time

     for the resolution of an incident record is 8 hours.
   5. Click Add to add your marquee to the Marquee Table. The marquee is published

     by the marquee background agent.
     Service Manager automatically adds the date and time of day to the Update
     Time field.
     The following message is displayed in the status bar: Record added to the
     marquee file.
   6. Return to the system administrator’s home menu.
   7. Click Incident Management to check the marquee you created.

Important: You may have to wait a minute until the background agent publishes the
data.

Related topics

Static messages
Modify the form for static messages
Modify the form for a simple marquee


1.1.6.2.3. Stored queries for management
view publishing

Stored queries define the search parameters for data acquisition. The agents
responsible for updating messages must query the database and report back with the
current information. To publish a message that monitors alert status or counts records
of a certain priority, queries must be created and stored.

The easiest method to generate a stored query is to select the information you want
using normal search methods, and then open the Advanced Search window and store
your query directly. By following these steps you can ensure that the query is
optimized for best performance.

Select the queries you want to use for your published message from the stored query
list.

Related topics

Agent records for publishing


1.1.6.2.4. Agent records for publishing

Agents are special background processes used to perform certain tasks for the user.
In the case of Publish and Subscribe, they count information in your database, such
as the number of open incident records in a specified alert status, or the number of
records assigned to a certain group. Agent Records are the resources used by these
background processes to reference stored queries, define messages and colors, and
select display options. These records are published to the Service Manager
publishing house and used by agents to update a subscriber’s charts and marquees.

Related topics

Stored queries for management view publishing
Create an agent record for publishing


1.1.6.2.4.1. Create an agent record for
publishing

Follow these steps:

   1. Click System Administration > Base System Configuration > Publishing
     Utilities > Define Agents.

   2. Click Search to open the agent records list in your database.
   3. Select pm.category from the record list. This agent publishes records by

     category.
   4. Select pm.priority to open the agent record for publishing priority status

     reports.
   5. Refer to the field help if you have any questions about the main tab fields.
   6. Click Save to save your changes.

Related topics

Agent records for publishing


1.1.6.2.5. Scheduling background
processes for publishing

A schedule record is required for every agent that runs in Service Manager. In order
for a subscriber to receive dynamic data, an agent background processor must be
running to process agent records. Publish and Subscribe requires two background
agents, marquee and agent, to be running in order to display data in marquees or
charts.

These background agents are set to read records at specified intervals.

There are two methods for running these agents:

     Register them at startup.
     Start and stop them during a session from the system.status.list form.

Related topics

Load agents into the startup record for my system
Start background processes
Stop background processes


1.1.6.2.5.1. Establish the publishing
interval in the schedule file

   1. Click System Administration > Base System Configuration > Publishing
     Utilities > Modify Schedule.

   2. From the record list, select a record for the type of display object you want to
     create. For example, select Agent-Priority, which retrieves priority status data.
     Tip: The entry in the Query field in the Description tab must relate to the agent
     record. For example, the Agent-Priority record's query entry is pm.pri.1.

   3. Reset the counter in the Repeat Interval structure to the desired update interval.
   4. Click Save.


1.1.6.2.5.2. Load agents into the startup
record for my system

Follow these steps:

   1. Click System Administration > Ongoing Maintenance > System > Startup
     Information.

   2. Type startup in the Type field, and then click Search.
   3. Using the scroll bar in the Processor Information structure and looking at the

     Name field for each process, make sure the agent and marquee names are
     listed here.
     Note: To run at startup, agent and marquee must be listed.
   4. If necessary, you can edit the Wakeup Interval in which the agent background
     process reads the records.

Note: The startup registry functions separately from the registry for individual agents.
To change the settings for an agent, be sure to change both records.
Important: Background processes must be started from the server.

Related topics

Scheduling background processes for publishing


1.1.6.2.5.3. Start background processes

Agent background processes can be started from the System Status form
(system.status.list.g).

   1. Click the System Status button in the system administrator’s home menu.
     The System Status form opens, listing all current background processing agents.

   2. Click Start Scheduler to open a list of background processes to start.
     A list of all the available processes opens.

   3. Double-click on the agent you want to start.
     Note: Click startup to start all agent background processes.


1.1.6.2.5.4. Stop background processes

Agent background processes can be stopped from the System Status form
(system.status.list.g).

   1. Click the System Status button in the System Administrator's home menu.

     The System Status form opens, listing all current background processing agents.

   2. Type S in the Command field beside the process.
   3. Click Execute Commands. The Background Scheduler Status form opens.
   4. Click Stop schd. The Schedule Stop window opens.
   5. In the Schedule Stop Time field, type the date and time you want the

     background process to stop.
   6. Select one of the following options:

           Click Schedule to stop the process.
           Click Cancel to return to the system status form without stopping the
           process.
           Click Menu to return to the System Administrator’s home menu without
           stopping the process.


1.1.6.2.5.5. Define which system
processes manage message traffic

Applies to User roles: System Administrator

To define which system processes manage message traffic:
   1. Click System Administration > Base System Configuration > Miscellaneous >
     System Information Record.
   2. Click the Message Processors tab.
   3. In the Processor Name field, type the names of the background or scheduler
     processes that are to manage message traffic. The processor name must match
     the class name specified for the message class processor.
   4. Click Save.
   5. Start the message processors.

Service Manager rotates messages among all the processes you define. If you don't
define any message processors, then Service Manager uses the problem processor
to manage all message traffic.


1.1.6.2.6. Marquee processor

If you have selected the Add marquee to table function in the agent record, your
marquees aren't published immediately, but are added to the marquee table. To
publish them from the table, you must schedule a publishing interval with the
marquee processor.

Establish the publishing interval in the marquee
processor

   1. Click System Administration > Base System Configuration > Publishing
     Utilities > Modify Schedule.

   2. Select Marquee processor from the record list.
   3. Schedule the time interval for publishing your marquee in the Repeat Interval

     structure.
   4. Click Save to save the record. The following message is displayed in the status

     bar: Record updated in the schedule file.

Contents

     1 Establish the publishing interval in the marquee processor


1.1.6.2.7. Schedule file

Once you have created your Agent Record, you must schedule it to be run by the
background agent. The Schedule File enables you to establish the interval in which
your background processing agents refresh your charts and marquees.


1.1.6.2.8. Subscribing

Subscribing to Management View data published in Service Manager requires the use
of display objects whose fields are identified by selected variables. These variables,
stored in Service Manager’s publishing house (SYSPUB), return the data published by
the Agent Record.

View published data

There are several ways in which to view published data:

     Startup screens for user groups: Startup screens are created with each user’s
     system rights in mind. Custom menus with automatically-updating display
     objects provide end users with applicable system tools.
     Display objects added to another form: Existing forms and menus can be
     modified to display Basic or Management View data.
     Button access to a custom form: Add a button in any Service Manager form to
     access a custom form containing automatically-updating display objects.

Related topics

Publish and subscribe


1.1.6.2.9. Publishing in the RAD
environment

The following is a list of Rapid Application Development (RAD) routines that you can
call from Format Control to display Publish and Subscribe messages:

     publish
     marquee.publish
     marquee.send

Related topics

Service Manager Programming
````
