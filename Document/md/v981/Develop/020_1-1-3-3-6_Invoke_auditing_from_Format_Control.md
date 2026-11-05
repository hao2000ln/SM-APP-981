---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.1.3.3.6 .. 1.1.3.3.11
printed_pages: 526-551
---

# 1.1.3.3.6 Invoke auditing from Format Control

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.3.3.6. Invoke auditing from Format
Control

Applies to User roles: System Administrator

The topics below comprise an example of how to use Database record auditing. The
steps in these topics must be followed in order. If you skip a step, Database record
auditing may not work.

   1. Open the audit specifications table.
   2. Add an audit specifications record.
   3. Define an audit specifications entry.
   4. Invoke auditing.
   5. Set up event triggers.
   6. Add lookup functionality to Format Control.
   7. Test audit lookup functionality.

To invoke auditing from Format Control, perform the following steps:

   1. Create an Audit Specifications record for a particular file.
   2. Open the Format Control record associated with the form and the file for which

     you created the audit specifications record in step 1.
   3. Select the Save Copy option.
   4. Click Subroutines to display the Subroutines form.

     The Subroutines panel opens.
   5. Enter the desired format control. For this example, enter:


Field                                      Enter
Add                                        true
Upd                                        true
Before                                     true
Application                                audit.compare
Error Message                              Audit Processing could not
                                           complete.
Names
                                           file
Values                                     second.file

                                           $file0
                                           $file

Related topics

Database record auditing
Audit log file
Audit specifications file
Audit processing
Tools to use for promoting customizations
Environment configuration
The Subroutines form


1.1.3.3.6.1. Open the audit specifications
table

Applies to User roles: System Administrator

Use one of the following methods to open the audit specifications table:
     From the System Navigator, click Tailoring > Audit and then double-click Audit
     Specifications.
     From the Command line, type audspec from the command line and press Enter
     or click Execute Command.
     From the System Navigator, click System Definition > Tables > auditspecs >
     forms and then double-click auditspecs.


1.1.3.3.6.2. Test Audit Lookup
functionality

Applies to User roles: System Administrator
Some files may not be configured for Audit Lookup. In that case, you must add Audit
Lookup functionality before Audit Lookup will work.
Service Manager invokes Audit Processing using the definitions provided in the
Format Control, when a record is added or updated in a file for which auditing has
been set up.
Note: Before using Audit Lookup, be sure that the Audit Specifications include all
fields that need auditing.
To test Audit Lookup functionality:

   1. Add a record to the contacts file using the values in the table below.

Field                                   Value
Contact Name                            MILLER, JOHN
Employee ID                             NEW00003
Last Name                               Miller
First Name                              John
Company                                 advantage
Email                                   john.miller@Advantage.com
Dept Name                               Documentation

Note: Service Manager displays the following message: “Contact Information
record added.” The audit process is invoked. Service Manager doesn't open an
audit record until a user changes the current field values.

Service Manager has recorded all fields specified in the Audit Specifications
record. All Old values are NULL or contain no data because there is no previous


  version of the record; this is a new record.

  Note: Audit Log entries are created in response to any changes made to the
  current values in this record. These audit records are displayed in the
  audit.summ form, when accessed using the Format Control option created
  earlier.

  If you check Audit Lookup now, a message informing you that there are no audit
  records.

2. To complete the example, modify the record created in the previous steps by
  entering new values in the fields of the form that were specified as Unique A-D
  fields in the audit specifications file. For this example, change the Employee ID
  to NEW00004.

3. Click Save to commit the changes to the database.

  Service Manager displays the following message: “Record updated in the
  contacts file. Audit Record successfully recorded and added.” when the record
  is saved and an Audit Log is created.

4. Open the More Actions menu and select Audit Lookup.
  A record list opens.

  Note: The updates you see may vary, depending on how you have your triggers
  set up for the file.

5. Select the desired record from the list.

  Note: Only those fields which were modified are recorded. Service Manager
  displays both the Old and the New versions of each modified field in the audit
  log record. If none of the fields defined in the Audit Specifications Table have
  been modified, then Service Manager doesn't generate an audit log entry for
  that database dictionary file.

6. For further information regarding the modifications to the contacts file, click
  Show detail.

  The same record is re-displayed in an expanded form audit.g), which shows
  more detailed information for the arrayed fields, as well as scrollable fields.

7. Click End to return to the summary form.
8. From the summary form, click the Prev and Next buttons to review any

  additional audit records in the log for this contacts record.
9. Click End to return to the Contacts record.


The topics below comprise an example of how to use Database record auditing.
Follow the steps in this order. If you skip a step, the example will not work.

To use Audit Lookup:

   1. Open the audit specifications table.
   2. Add an audit specifications record.
   3. Define an audit specifications entry.
   4. Invoke auditing.
   5. Set up event triggers.
   6. Add lookup functionality to Format Control.
   7. Test audit lookup functionality.

Related topics

Audit log file
Database record auditing
Audit specifications file
Audit processing


1.1.3.3.6.3. Add an audit specifications
record

Applies to User roles: System Administrator

To add an audit specification record:

   1. Click Tailoring > Audit > Audit Specifications.

   2. Type a file name in the Filename field.

     In this example, type contacts.

   3. Enter unique keys in the Unique A, B, C, or D field.

     The Unique key for the contacts file is contact.name. In this example, type
     contact.name in the Unique A field and leave Unique B through D as NULL.

   4. Click Add.

When Service Manager records an Audit Log record, for example, the contact name
Teresa Chan, the Filename field is recorded in the Audit Log as contacts and the
Unique A field is recorded as TERESA CHAN.

The contacts Audit Log record then has a unique association with a contacts record.
You can generate new Audit Logs based on the data found in the previous log record
for a specific device.

Note: A device is also referred to as a Configuration Item (CI).

Related topics

Audit log file
Audit processing
Audit specifications file
Database record auditing
Invoke auditing
Key type definitions


1.1.3.3.6.4. Define an audit specifications
entry

Applies to User roles: System Administrator

The system validates Filename and Field Name values every time you update an
existing record or add a new record. The Audit utility safeguard system prevents
records with misspelled and incorrect file names or field names from being
processed. Such errors potentially could cause faulty communication within the
database.

Note: The name of the file and one field name of this example have been entered
incorrectly to illustrate error-correction process built into the Audit utility.

To enter data in the Audit Specifications file:

   1. Click Tailoring > Audit > Audit Specifications.

     A blank Audit Specifications Table form opens.

   2. To select the file to create the specifications for.

     Enter information in the Filename field and Unique A through Unique D fields, as
     necessary, to parallel the Unique key in the source file with the Audit Log.

     Note: see the related topics and read the topic "Audit specifications file
     description" for more information on input fields.

     For this example, enter contacts in the Filename field, and then click Search.

     Caution: Making changes to the contacts file to cause it to invoke auditing will
     cause two audit records to be generated when a file is updated. To prevent this,
     use a backup, and restore the original file when finished with the example, or
     create a different file to practice on.

   3. Define those fields you want Service Manager to audit and any aliases. If a field
     name is invalid, a list will open up allowing you to copy a valid name and use it to
     replace the invalid name.

     For this example, enter:


Field Name                              Alias
contact.name                            Contact Name
user.id                                 Employee ID
first.name                              First Name
last.name                               Last Name
dept.name                               Department
email                                   Email Address
location                                Location

   4. Click Add. to retain this record and commit it to the database.

The topics below comprise an example of how to use Database record auditing.
Follow the steps in this order. If you skip a step, the example will not work.

   1. Open the audit specifications table.
   2. Add an audit specifications record.
   3. Define an audit specifications entry
   4. Invoke auditing.
   5. Set up event triggers
   6. Add lookup functionality to Format Control.
   7. Test audit lookup functionality.

Related topics

Database record auditing
Audit log file
Audit specifications file
Audit processing
Start database record auditing
Invoke auditing
Open the audit specifications table
Start database record auditing
Verify the field name
Verify the file name
Audit specifications file description



1.1.3.3.6.5. Invoke auditing

Applies to User roles: System Administrator

You can invoke auditing from Format Control. If you are using the Change
Management application, you can invoke auditing from Database Manager.

Select one of the following options to invoke auditing:

     Invoke auditing from Format Control
     Invoke auditing from the file in Database Manager (Change Management only)

Related topics

Database record auditing
Audit specifications file
Audit log file
Audit processing
Invoke auditing from Format Control
Invoke auditing from the file in Database Manager (Change Management only)


1.1.3.3.6.6. Invoke auditing for joindefs
tables

Applies to User roles: System Administrator

To use the database record auditing functionality, you need to invoke auditing for
joindefs tables, as described in the following tasks.

Task 1: Temporarily disable the auditspecs.check Subroutine on the auditspecs
Format Control record.

   1. Sign in to the Windows client.
   2. In Format Control, open the auditspecs record (Name: auditspecs).
   3. Click Subroutines, and from the More Actions menu select Show Expanded

     Form.

   4. For each of the conditions Add, Update, and Before, append the following
     expression: and false.

     The conditions for each should be: true and false.

   5. Click Save.

     Note: Re-enable the Subroutine after performing Task 2.

Task 2: Add an Audit Specifications record for joinbizservice and each of the other
"join" files being used.

   1. Click Tailoring > Audit > Audit Specifications.

   2. Enter field data as follows:

Field                                   Value
Filename
Unique A                                joinbizservice
Field Name
                                        logical.name

                                        logical.name (and any other fields
                                        you want in the list)

3. Click Add.
4. Repeat for each additional "join" table desired.


Related topics

Database record auditing
Audit log file
Audit specifications file
Audit processing
Tools to use for promoting customizations
Environment configuration
The Subroutines form


1.1.3.3.6.7. Set up event triggers

Applies to User roles: System Administrator

The topics below comprise an example of how to use Database record auditing.
Follow the steps in this order. If you skip a step, the example will not work.

   1. Open the audit specifications table.
   2. Add an audit specifications record.
   3. Define an audit specifications entry.
   4. Invoke auditing.
   5. Set up event triggers.
   6. Add lookup functionality to Format Control.
   7. Test audit lookup functionality.

Event triggers are part of the Service Manager auditing function. A trigger can be set
up to invoke the auditing application, audit.compare.

Note: If an audit is needed for Configuration Management, don't use triggers. Instead,
use Format Control to invoke the audit.compare application.

To set up the audit.compare trigger:

   1. Open the triggers form in Database Manager.

   2. Enter the name of the new trigger. For this example, type:
      example.trigger.audit.update .

     Note: Each trigger performs one action; therefore, when naming the trigger, you
     may want to incorporate the trigger type (when the trigger is to execute) into the
     name of the trigger. For example, trigger.audit.add could be the name of a
     trigger that executes whenever a record is added.

   3. Enter the name of the file you want Service Manager to audit in the Table Name
     field. For this example, type: contacts .

   4. Select the type of trigger, according to the number legend displayed beside the
     field. For this example, select: 4

   5. Enter the application name in the Application field. For this example,
     type: trigger.invoke.auditor .

   6. Click Add. when ready to add the record to the file.

     Service Manager displays the following message: “Trigger record added.”


Related topics

Database record auditing
Audit log file
Audit specifications file
Audit processing
Start database record auditing
Determine if a file has audit processing
Invoke auditing
Invoke auditing from Format Control
Open a record using Database Manager


1.1.3.3.6.8. Add lookup functionality to
Format Control

Applies to User roles: System Administrator

The topics below comprise an example of how to use Database record auditing. The
steps in these topics must be followed in order. If you skip a step, Database record
auditing may not work.

   1. Open the audit specifications table.
   2. Add an audit specifications record.
   3. Define an audit specifications entry.
   4. Invoke auditing.
   5. Set up event triggers.
   6. Add lookup functionality to Format Control.
   7. Test audit lookup functionality.

Note: Before using Audit Lookup, be sure that the Audit Specifications include all
fields that need auditing.

To add Lookup Functionality, perform the following steps:

   1. Access the Format Control record associated with the form or file.
   2. Select the Save Copy.
   3. Click Additional Options.
   4. Select Additional Options.

     The Additional Options panel opens.
   5. Activate Lookup Functionality by adding the following specifications:

       Field                                                                              Service Manager 9.81
       Option
       Desc                             Contents
       Condition                        1
       Application                      Audit Lookup
       Comment                          true
       Message                          audit.lookup
                                        Audit Lookup
       Names                            Could not call Audit Lookup
       Values                           application.
                                        file
Related topics                          $file

Database record auditing
Audit log file
Audit specifications file
Audit processing


1.1.3.3.7. Special processing
considerations: Incident Management

In Incident Management, each action taken on an incident record has the option of
adding an additional page; therefore, update and delete operations aren't truly
performed. Even though there is a Save button, the application is really adding a new
record to the problem table. When you close an incident, a page can be added to the
file with a status of closed. Consequently, when using Format Control on Incident
Management, the add field must evaluate to true.

Format Control records are only executed on the initial, browse, open, update, and
close forms for Incident Management.

Format Control can be placed on the following forms, or by using the master Format
Control called probsummary .

      IM.open.incident
      IM.update.incident
      IM.close.incident
      IM.browse

Related topics

Format Control
Special processing considerations: Change Management


1.1.3.3.8. Special processing
considerations: Change Management

Change Management enables you to define three types of Format Control records:

     Detail
     Primary
     Approval

The detail and primary records execute during standard add, update, and close
processing. The approval record executes during Change Management approval
processing.
Change Management uses the four processing functions as follows:

     Add

Processed at open time.

     Update

Processed at update time (update, reopen).

     Delete

Processed at close time.

     Display

Processed when an item is displayed.

The Format Control components executes after the process invokes but before the
record permanently updates. For instance, the add function executes after the user
clicks on the Open button in either the Request or Task structure, but before the
Request/Task saves to the database. The display function executes after a record is
selected from the record list but before the record opens.

You can execute both a primary Format Control record and a detail Format Control
record for each Request/Task process. The primary Format Control record executes
before the detail Format Control Record. If any of the Format Control components fail
for any reason, the user always returns to the previously open screen with the
appropriate error messages.


Special processing considerations: primary Format
Control record

Change Management supports a primary Format Control record that enables you to
define in one record the Format Control statements that apply to all Change
Management Request Phases. The name of the primary Format Control record is
cm3r (cm3t for Tasks). The options on this Format Control record execute during all
Request/Task processing (including background processing) except approval
processing. The primary format control record processes before the detail Format
Control record.

Special processing considerations: detail Format
Control record

To enforce processing rules that are unique to a Phase, define a format control record
that's the same name as the default View of that Phase. The add, update, delete, and
display features process just as they are with detail Format Control definitions.

Special processing considerations: approval Format
Control record

The Change Management approval process checks for a Format Control record that
associates with the approvals view of the Phase.

     The add features are processed when a Request is approved.
     The update features are processed when a Request is disapproved.
     The delete features are processed when a Request is unapproved.

The primary Format Control record doesn't execute during approval processing.

Related topics

Format Control
Special processing considerations: Incident Management


1.1.3.3.9. Format Control and eventout
records

When incidents are opened, updated or closed by Event Services, a record is written
to the eventout file. This record contains information from the incident (described in
the output eventmap record for the event) that's passed to an external process via the
SCAuto/IPAS external interface. You can elect to write to the eventout file when
Service Desk operators open and close records so that the information is passed to
the external interface.

The axces.write application creates a character string of fields from a structure and
writes them to eventout. An Event Registration record identifies the event type and the
name of the Event Map records used to define which fields will be selected from the
record. The application should be called as a Format Control Subroutine passing two
parameters:

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

Note: This procedure is not specific to Incident Management. You can write eventout
records for other applications, such as Configuration Management or Change
Management.

Related topics


Format Control


1.1.3.3.9.1. Generating email messages

SCAutomate supports a generic e-mail function. Use the Format Control RAD
function, message.fc, to write e-mail events to the eventout file.

Related topics

Event Services
Service Manager Programming


1.1.3.3.10. Format Control error messages

There are several error messages you receive if you enter an incorrect expression
into a Format Control record. These errors take several forms:

     If any syntax errors are present when the system attempts to parse (evaluate) an
     expression field (for example, Calculation, Initialization) in a Format Control
     record, the following message opens in the Status Bar at the bottom of the
     screen when you click on the Back button or attempt to select another function
     from the More Actions menu:
     Field contains an invalid expression.
     In the case of incorrect syntax in a Calculation expression, the system doesn't
     let you exit the Format Control record until the error is resolved. If you can't
     resolve it, delete the line and re-enter the desired input when the correct syntax
     is determined.
     In the case of incorrect syntax in an Initialization Expression, the system doesn't
     let you access additional Format Control functions (Subroutines, Additional
     Options, etc.) from the More Actions menu.

     The system will accept a properly constructed Initialization Expression in a
     Format Control record that may not be accepted by the called application at run
     time. When an application can't recognize an Initialization Expression, the
     Format Control function fails, and Service Manager displays this message:
     Cannot evaluate initialization expression #:1
     Format Control accepts properly constructed but conflicting expressions within
     a record.
     For example:
     Initialization expression: $x=“ibm”
     Calculation expression: $x+=1
     When Format Control attempts to perform this calculation on a non-numeric field
     at run time, the system displays the following error message:
     Wrong or mismatched type in increment or decrement

Related topics

Format Control


1.1.3.3.11. Common routines called from
Format Control

The following is a list of RAD routines that have a specific function within Format
Control:

     as.copy
     as.delete
     as.get.name
     as.insert
     as.move
     as.options
     as.sort
     axces.write
     database
     fill.fc
     fingerprint
     getnumb.fc
     marquee.publish
     marquee.send
     message.fc
     post.fc
     publish
     sort.array
     query.stored
     validate.fields

Related topics

Determine parameters without using the RAD Editor
Service Manager Programming
````
