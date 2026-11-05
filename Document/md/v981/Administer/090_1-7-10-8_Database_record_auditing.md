---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.7.10.8 .. 1.7.10.8
printed_pages: 2229-2256
---

# 1.7.10.8 Database record auditing

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.7.10.8. Database record auditing

Database record auditing allows you to check the Service Manager database for
modifications to specified fields within a file. When you update records in a file,
record auditing tracks the updates when Paging is unavailable, whereas Paging
creates a unique record or page for every update.

Database Manager detects field modifications by comparing the input values in fields
from the original version of a record to the values of the same fields in the updated
version. When a modification is detected, Database Manager generates an Audit Log
entry containing the following information:

     The name of the modified fields.
     The old and new version of the data.
     The date and time of the modification.
     The user ID of the operator who modified the record.

Related topics

Audit log file
Audit processing
Audit specifications file
Start database record auditing
Add an audit specifications record
Add lookup functionality to Format Control
Define an audit specifications entry
Invoke auditing
Open the audit specifications table
Set up event triggers
Test audit lookup functionality


1.7.10.8.1. Invoke auditing

Applies to User roles: System Administrator
You can invoke auditing from Format Control. If you are using the Change
Management application, you can invoke auditing from Database Manager.
Select one of the following options to invoke auditing:

     Invoke auditing from Format Control
     Invoke auditing from the file in Database Manager (Change Management only)


1.7.10.8.2. Invoke auditing from Format
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


1.7.10.8.3. Invoke auditing from the file in
Database Manager (Change Management
only)

Applies to User roles: System Administrator

The topics below comprise an example of how to use Database record auditing.
Follow the steps in this order. If you skip a step, the example will not work.

   1. Open the audit specifications table
   2. Add an audit specifications record
   3. Define an audit specifications entry
   4. Invoke auditing
   5. Set up event triggers
   6. Add lookup functionality to Format Control
   7. Test audit lookup functionality

This process is only valid for the Change Management application.

To invoke auditing from Database manager:

   1. Open the cm3rcatphase.main form in Database Manager. A blank
     cm3rcatphase.main form opens.

   2. Enter the name of any phase in the form. For this example, enter Analysis.
   3. Click Search.
   4. Set the Audit Records field value to true.
   5. Click Save.

Related topics

Database record auditing
Audit log file
Audit specifications file
Audit processing
Invoke auditing from Format Control
Start database record auditing
Determine if a file has audit processing


1.7.10.8.4. Start database record auditing

Applies to User Roles: System Administrator

This list is an example of the sequence of events that must occur prior to initiating
database record auditing. Each of these steps is required for auditing to function
properly.

To start database record auditing:

   1. Open the audit specifications table.
   2. Add an audit specifications record.
   3. Define an audit specifications entry.
   4. Invoke auditing
   5. Set up event triggers.
   6. Add lookup functionality to Format Control.
   7. Test audit lookup functionality

Related topics

Audit log file
Audit processing
Audit specifications file
Database record auditing
Add lookup functionality to Format Control
Add an audit specifications record
Define an audit specifications entry
Invoke auditing
Open the audit specifications table
Set up event triggers
Test audit lookup functionality
Key type definitions


1.7.10.8.5. Test Audit Lookup functionality

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


1.7.10.8.6. Audit processing

Maintenance of the Audit Specifications table used for audit processing follows
normal Service Manager file maintenance procedures. For some tables, such as the
contacts table, the out-of-box Format Control specifies that each time an update
occurs, the audit.compare application is called. If you invoke auditing for a table for
which Format Control was previously set up to invoke auditing, both
trigger.invoke.auditor and Format Control will generate audit records, resulting in two
audit records.

Note: If you are invoking Auditing from Format Control or a RAD call, ensure that you
invoke Auditing after Validity Table processing but before the record add or update.

For additional information about regenerating database keys or resetting a database
table, see the related topics.

Related topics

Audit log file
Audit specifications file
Database record auditing
Regenerating database keys
Resetting a database table
Add lookup functionality to Format Control
Determine if a file has audit processing
Invoke auditing
Invoke auditing from the file in Database Manager (Change Management only)
Invoke auditing from Format Control
Set up event triggers
Start database record auditing
Test audit lookup functionality


1.7.10.8.7. Determine if a file has audit
processing

Applies to User Roles: System Administrator

Some files may not be configured for Audit Lookup. In that case, you must add Audit
Lookup functionality before Audit Lookup will work.

To determine whether a file has audit processing:

   1. Open the triggers file in Database Manager.

   2. Click Search. A list of all files with triggers opens.

   3. Search for the filename on the list.

Related topics

Audit log file
Database record auditing
Audit specifications file
Audit processing
Start database record auditing
Open a record using Database Manager
Invoke auditing from the file in Database Manager (Change Management only)
Invoke auditing
Add lookup functionality to Format Control
Set up event triggers
Test audit lookup functionality


1.7.10.8.8. Audit log file

The Audit Log File is the repository for data gathered during the audit. It displays the
old and new values of input field data, who made the revisions, and when. The log is a
record of all update transactions for the specified source file. The system adds one
log record per source record update when you update one or more of the source
record input fields defined in the Audit Specifications file.

Note: The following procedure displays a list of audit log records only if you have
made modifications to contacts records after creating the audit specifications record.
Otherwise, the log record is empty.

Open the audit log file

Applies to User Roles: System Administrator

To open the audit log file:

   1. Use one of the following methods to open the log file.

     • Type audlog from the command line and press Enter or click Execute
     Command.
     • Open the audit.summ form from Database Manager.
     • Click Tailoring > Audit > Audit Log.

     Service Manager displays a blank audit log form.

   2. Click Search. If log records exist, Service Manager displays them.

Related topics

Database record auditing
Audit specifications file
Audit processing
Invoke auditing
Define an audit specifications entry
Start database record auditing
Verify the field name
Verify the file name


1.7.10.8.9. Verify the field name

Applies to User Roles: System Administrator

The system validates all field names defined in the record (Unique A through D and all
Field Names) against the selected database dictionary file. When it finds an invalid
field name, Service Manager displays the following message: “The Field ‘field name’
is invalid. Select one from the list.”, and a pop-up window opens showing a list of
valid field names for the specified database dictionary.

To correct a field name:

   1. Double-click on the correct Field name in the fieldname window, and then click
     End.

The system copies selected field name to the appropriate field.
- or -
Copy the correct field name, click End, and paste the field name into the field.

Service Manager displays the following message: “Record added to the auditspecs
file”, which means that all fields have been validated and that the record has been
saved.

   1. Re-query the record before attempting to make any modifications.
   2. Exit the form.
   3. Re-open the auditspec form.
   4. Query for the contacts specifications record.

Related topics

Audit log file
Database record auditing
Audit specifications file
Audit processing
Invoke auditing
Define an audit specifications entry
Verify the file name


1.7.10.8.10. Verify the file name

Applies to User Roles: System Administrator

When defining an audit specifications entry, if the File Name value is invalid, Service
Manager displays the following message: The filename "filename" - is invalid. Select
one from the list.

A record list opens and displays the valid database dictionary file names.

To correct or modify a file name, select an entry from the list, and then press Enter.
The system copies the correct file name to the File Name field.

Related topics

Audit log file
Database record auditing
Audit specifications file
Audit processing
Define an audit specifications entry
Invoke auditing
Verify the field name


1.7.10.8.11. Add an audit specifications
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

            Note

          A device is also referred to as a Configuration Item (CI).

Related topics

Invoke auditing


1.7.10.8.12. Open the audit specifications
table

Applies to User Roles: System Administrator

Use one of the following methods to open the audit specifications table:

     From the System Navigator, click Tailoring > Audit and then double-click Audit
     Specifications.
     From the Command line, type audspec from the command line and press Enter
     or click Execute Command.
     From the System Navigator, click System Definition > Tables > auditspecs >
     forms and then double-click auditspecs.

Related topics

Audit log file
Audit specifications file
Audit specifications file description
Audit processing
Database record auditing
Open a record using Database Manager
Start database record auditing


1.7.10.8.13. Define an audit specifications
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
   3. Define an audit specifications entry.
   4. Invoke auditing.
   5. Set up event triggers.
   6. Add lookup functionality to Format Control.
   7. Test audit lookup functionality.

Related topics

Audit log file
Audit specifications file
Audit processing


1.7.10.8.14. Audit specifications file

The Audit Specifications (audspecs) file provides instructions on how and when to
perform an audit. Use it to define files and fields that you want the Audit application to
monitor. There is one specification record for each Service Manager database
dictionary (dbdict) record.

Related topics

Audit log file
Audit processing
Database record auditing
Start database record auditing
Invoke auditing
Open the audit specifications table
Audit specifications file description


1.7.10.8.15. Audit specifications file
description

The Format Control record associated with the auditspecs form runs a routine that
validates entries in the Filename and Field Name fields. Format Control runs this
validation routine when you add or update Audit Specification records. It prevents
users from entering invalid fields or file values and controls unpredictable run-time
results.

Field                                                                                           Service Manager 9.81
File Name
                                        Definition

                                        The name of a valid Service Manager
                                        database dictionary upon which Audit
                                        is to be performed. This is a required
                                        field on the table.

 Field                                                                                          Service Manager 9.81
 Unique A–D
                                        Definition
This PDF was generated on May 23, 2026
                                        Used to parallel data records in the
                                        Audit File to data records in the source
                                        file. Under most circumstances, the
                                        fields specified in Unique A through D
                                        are the same fields that are defined as
                                        Unique keys in the specified database
                                        dictionary file. These values need to be
                                        unique identifiers for the specific file.
                                        Unique A is the only required entry.
                                        Additional entries for Unique B through
                                        D are optional.

                                        Do not use Nulls & Duplicates keys to
                                        define Unique A through D, because if
                                        the fields in the key are NULL, then
                                        Service Manager creates Audit records
                                        that don't relate to any records in the
                                        Source File.

                                        You don't need to define the fields
                                        Unique A through D as keys in the
                                        Source File. However, you must ensure
                                        that any non-key fields are defined as
                                        unique identifiers, in order to avoid
                                        these errors.

                                        When defining Audit Specifications for
                                        the Incident and Change Management
                                        files, parallel the number field.

                                        It is unnecessary to parallel the last or
                                        page fields. See database dictionary
                                        for information on identifying fields in
                                        files.

                                                                                                                          Page 23 of 188
Field                                                                                           Service Manager 9.81
Field Name
                                        Definition

                                        Defines the name of the field to be
                                        checked for modifications. The fields
                                        specified for Auditing can be of any
                                        data type except arrayed structures or
                                        fields within arrayed structures. You
                                        can specify any number of fields;
                                        however, Auditing overhead increases
                                        as the number of fields increase. Do
                                        not specify all fields within a file for
                                        Auditing. Rather, analyze the fields
                                        within the file to determine which are
                                        critical for the management of data
                                        records in the file.
                                        The critical fields in the contacts file
                                        are:

                                             contact.name
                                             first.name
                                             last.name
                                             dept.name
                                             email
                                             location

                                        The recommended maximum number
                                        of fields to audit is 20. Auditing more
                                        than 20 fields causes performance
                                        degradation. Under most
                                        circumstances, the recommended
                                        maximum will not impair the
                                        management of a file.

 Field                                                                                          Service Manager 9.81
 Alias
                                        Definition
Related topics
                                        Defines the alias of a field name used
Audit specifications file               in the audit log. When Service Manager
Database record auditing                records entries in the audit log
Audit log file                          (audit.summ.g form), the default is to
Audit processing                        record the actual field name. You can
Add an audit specifications record      override the default by specifying an
Define an audit specifications entry    alias. For example, if the widgets file
Invoke auditing                         has a field named fd.ast.no, it may be
Open the audit specifications table     more meaningful to define the alias
Start database record auditing          field name fixed asset (configuration
Verify the field name                   item) number.

                                        A one-to-one correlation exists
                                        between the Field Name and Alias input
                                        fields. Due to processing
                                        considerations, these are independent
                                        arrays. Therefore, you scroll one; you
                                        must also scroll the other to keep the
                                        definitions synchronized.


1.7.10.8.16. The Subroutines form

Consider each field in the Subroutines form in terms of the outcome you are seeking.
The following fields are contained in the Subroutines form:

Field                                                                                           Service Manager 9.81
Add
Upd                                     Definition
Del
Dis                                     This field needs to be true, since you
Before                                  want audit data to be written whenever
                                        a new record is added.
Application
Error Message                           (update) This field needs to be true to
                                        allow audit data to be written whenever
                                        there is a modification to an existing
                                        record.

                                        (delete) This field is empty, as that
                                        would write an audit record whenever a
                                        record is deleted.

                                        (display) This field is empty.

                                        This setting on the subroutine call can
                                        be set to true or false.

                                             If it is true, and the audit detects a
                                             key error, then an Audit record
                                             exists, but the update never
                                             occurs.
                                             If it is false, then you receive the
                                             Record Updated message before
                                             the Audit Recorded message.

                                        This field states the application that
                                        compares the fields in the old and new
                                        data records, and if necessary, adds a
                                        record to the Audit Log file.

                                        This field provides the error message,
                                        which is displayed if the process can't
                                        be completed as planned.


Field                                       Definition
Names
                                            This field states which files are handled
                                            by the subroutine.
                                            Activate the Save Copy option on the
                                            Format Control Maintenance form to
                                            make this file variable available

                                                 Pass the Old (or original) version
                                                 of the data record to the file
                                                 parameter.
                                                 Pass the New (or updated)
                                                 version of the data record to the
                                                 second.file parameter.

Values                                      Values in this field correspond to each
                                            parameter. These values state to which
                                            variables Service Manager passes the
                                            data.

Related topics

Database record auditing
Audit specifications file
Audit log file
Audit processing
Add lookup functionality to Format Control
Invoke auditing
````
