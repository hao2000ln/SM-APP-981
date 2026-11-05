---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.7.7 .. 1.7.10
printed_pages: 1868-1892
---

# 1.7.7 Purging out-of-the-box data

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.7.7. Purging out-of-the-box data

Before your system goes live, remove all testing data records and out-of-the-box
demonstration data records. It's advisable that you use the predefined
PurgeOutofBoxData unload script record to remove this data.

To purge the data, follow these steps:

   1. Go to Database Manager, and open the unload table.

   2. Select the PurgeOutofBoxData record.

   3. Make sure to purge all the listed tables.

          • To avoid purging a table, remove the line from the unload script record.

          • Add or modify a query (for example, add name="failsave" to the operator
          line) as needed.

          • Add more tables (such as knownerrortasks and rootcausetasks) to the
          list of tables to purge if you have entered information during testing.

   4. Click Proceed.

Related topics

Application Setup
Checklist: Adding a new user
Controlling user access and security
Creating operator records
Defining named users
Operator passwords
Operator records
Operator templates


1.7.8. Attachments

Service Manager stores each attachment as a set of separate records in the
SYSATTACHMENTS table. The SYSATTACHMENTS table stores each attachment as a
logical record consisting of:

     Unique identifier
     File name
     MIME type
     File size
     Application (the name of the table to which the attachment relates)
     Topic (the value of the primary key in the related table)

For example, Application would contain the name kmdocument for a Knowledge
Management document attachment.

Each logical record consists of one or more segments where the server stores
portions of the attachment. Administrators can set the attachment segment size with
the attachmentsegmentsize system parameter.

The SYSATTACHMENTS table allows administrators to easily identify all the
attachments stored in their system. In addition, it improves system performance since
the server can read information about each attachment individually. The server no
longer has to open all attachment records to generate a list of attachments. In
addition, the server no longer has to open all other attachments for a user to make a
change in any individual attachment.

Related topics

Parameter: attachmentsegmentsize


1.7.8.1. Support for allowing attachments
with certain file extensions

Starting from Service Manager 9.50, a new attachment allowlist feature is supported
for Service Manager clients (windows client, web client, and mobility client) and the
clients that connect to RTE by web services. You can configure this attachment
allowlist via Tailoring > Allowlist > Attachment Allowlist to allow only certain types
of attachments to be submitted to Service Manager.

If the Service Manager clients retrieve an existing attachment whose extension is not
in the allowlist or has no file extension, the attachment is appended with .UNSAFE
when displayed in the Service Manager clients or the clients which connect to RTE by
web services, so that the attachment is prevented from being automatically run on the
user’s machine.

            Note

                Attachment allowlist defined via Tailoring > allowlist > Attachment
                allowlist takes effect only when the version of your Service Manager
                applications is no earlier than 9.50.
                If you set the value of denyattachwithoutext to 0, the approved
                attachments without file extensions aren't appended with .UNSAFE
                when displayed in the clients which connect to RTE by web services.

To enable the Attachment allowlist and define a list of allowed file extensions, follow
these steps:

   1. Sign in to Service Manager as a system administrator.
   2. Click Tailoring > allowlist > Attachment allowlist.

   3. Define the list based on your business needs. In the out-of-box system, the
     attachment allowlist includes the following file types, which are considered safe:


File Extension                          Description
bmp                                     bitmap
jpg                                     jpg image
jpeg                                    jpeg image
png                                     portable network graphic
gif                                     graphical interchange format file
txt                                     plain text file
log                                     log file
unl                                     Service Manager unload file
csv                                     comma separated values file
eml                                     e-mail message saved

By default, the Enable Attachment allowlist checkbox is selected. If you clear
this checkbox, end-users can submit all types of attachments to Service
Manager.


                   Caution

                By selecting to change the allowed file types to be added to the
                system, you are disabling or bypassing security features, thereby
                exposing the system to increased security risks. By using this
                option, you understand and agree to assume all associated risks and
                hold the company harmless for the same.

                In case file types are changed from their default configuration, you
                may need to add relevant protection measures to protect against
                risks associated with these new file types, which is not provided by
                the company. By not implementing relevant protection measures you
                may be exposing the system to increased security risks. You
                understand and agree to assume all associated risks and hold the
                company harmless for the same. It remains at all times the
                Customer’s sole responsibility to assess its own regulatory and
                business requirements. The company doesn't represent or warrant
                that its products comply with any specific legal or regulatory
                standards applicable to Customers in conducting Customer's
                business.

   4. Click Save and OK.

   5. Log out and then log on to the Service Manager client to make the customized
     attachment allowlist effective.

Additional protection

To provide additional protection, you can use Tika to analyze content by detecting
and extracting metadata and text from attachments of various file types (such as PPT,
XLS, and PDF). To learn about the formats from which Tika is able to extract metadata
and textual content, visit https://tika.apache.org in your browser. Click your version of
Tika, and then click the Supported Formats link. To determine the version of Tika in
use by your SM Server, look up the JAR filename in your RUN/lib directory. For
example, /RUN/lib/tika-core-<version>.jar.

For file types that are not listed in the Apache Tika Supported Formats
documentation, you need to configure both custom-mimetypes.xml files under the
web tier and the server installation directories if you want Tika to extract metadata
and textual content from such file types:


     For Service Manager web tier, go to <web tier installation path>\WEB-
     INF\classes\custom-mimetypes.xml and configure as needed.

     For Service Manager server to to <server installation path>\RUN\custom-
     mimetypes.xml and configure as needed.

For more information, see https://tika.apache.org/<Tika
version>/parser_guide#Add_your_MIME-Type. By default, file type UNL is already
configured in custom-mimetypes.xml.

Related topics

Attachments
Startup parameter: denyattachwithoutext
Enter a parameter in the sm.ini file
Security parameters


1.7.8.2. View the attachment history

Every time that a user adds or deletes an attachment in Service Manager, the action is
recorded in the activityactions table.

            Note

           If a file doesn't have a related object file or if the activity log table is
           undefined, the action is not logged.

To view the attachment history of a specific record, open that record and browse to
the "Activity" section. If an attachment has been added to or deleted from the record,
the following information is displayed in the "Activity" section.

Field Name                              Values
Number                                  Record ID number
Type
                                             Attachment added
                                             attachment deleted

Datestamp                               Current date
Operator                                Current operator
Description
                                             <Attached file name> added
                                             <Attachment file name> deleted

Customer visible                        FALSE

Related topics

Attachments


1.7.9. System Definition

The System Definition section of the System Navigator is an administrative tool that
enables you to view and modify system tables and their components:

     Fields
     Keys
     Links
     Forms
     Records

You can use the System Definition section if you have the Admin plug-in installed and
the SysAdmin capability word enabled in your user profile. If you have SysAdmin
rights, but the Admin plug-in is not installed, you can view the System Definition
section but you can't change it.

Administrators can do the following:

     View, add, change, or delete forms, links, records, triggers, and Data Policy
     records.
     Use the System Definition utility to add help or create an alias for any field.
     View, add, change, or delete database dictionary definitions.
     View, add, change, or delete SQL mappings to a back-end RDBMS.
     Open, reset, regenerate, and copy database dictionary definitions.
     Add, change, copy, and delete keys and fields.
     Count the number of records in logical tables

Each time you right-click a node in the System Definition section, the System
Navigator displays a Context menu of available actions.

System Definition utility

The System Definition utility is a graphic view of existing table elements and
properties and a quick way to define new tables. It enables you to accomplish the
tasks traditionally handled by the database dictionary utility. The System Definition
utility has two tabs: tables and fields. Service Manager displays SQL mapping
information only when mapping information is available. Each time you double-click
any table in the System Definition area of the System Navigator, the System Definition
utility displays the Table tab first. You can access the other tabs by clicking the
labeled tabs or links in the Editor.


If you change a table element, an asterisk marks the table and the element in the
System Navigator until you click Save.

            Note

           The System Definition utility is disable by default. You can enable this
           feature by adding the following line to the
           {workspace}\.metadata\.plugins\org.eclipse.core.runtime\.settings\com.h
           p.ov.sm.client.eclipse.base.prefs preference setting file:

                 showsystemdefinition=true

Access the System Definition utility

Applies to User Roles: System Administrator
To access the System Definition utility:

   1. From the System Navigator, click System Definition.
   2. Expand the name of any table in the record list.

                   Note

                You can type the first letter of a table name to jump to that
                alphabetic section. For example, type o to jump to the oncall table.

Related topics

Editing System Definition nodes
Access field help from the System Navigator


1.7.9.1. Table tab

The Table tab summarizes the properties of an Service Manager table, provides links
to other table-related objects, and allows you to map a database dictionary record to
an RDBMS.

The Table overview contains these sections:

     Table definition
     Table management
     SQL Properties
     Associated objects

           Forms
           Links
           Triggers

Table definition

The Table definition section contains the following information:


Field                                   Contents                     Notes
Caption
                                        Optional. Caption            An administrator can
Description                             information may appear       customize this field. For
SQL base name                           as a label in the data       example, you can display
                                        policy rules for the table.  the name of table.
Revision number                         Service Manager uses
Add, delete, or                         some Caption fields to
edit fields and keys                    specify an index value
                                        for a table of localized
                                        text.

                                        Optional. The                An administrator can
                                        Knowledgebase uses the       customize this field. For
                                        first line of the table      example, you can
                                        description.                 specify information
                                                                     about the table.

                                        SQL mapping uses a           To avoid future upgrade
                                        unique base name for         conflicts, it is helpful to
                                        each table. The              specify a base name that
                                        maximum length is            doesn't overlap Service
                                        13 alphanumeric              Manager out–of–box
                                        characters. When you         table names.
                                        create a new table,
                                        Service Manager creates
                                        a valid SQL base name
                                        and assigns it to the new
                                        table.

                                        Specifies the cumulative     Read only.
                                        number of changes to
                                        the table.

                                        Click to advance to the
                                        Fields and Keys tab.

If you make any changes to the table definition fields or other table information, click
Save.


Table management

Use the Table management section to complete routine maintenance activities. When
you select the action, the System Definition utility prompts you for the next response
required to complete the task. You can:

     Delete the table
     Rename the table
     Copy the table definition (only)
     Copy the table definition and data
     Regenerate the table
     Reset the table data

Service Manager always asks for confirmation before you complete a task that makes
irreversible changes. For example, you must confirm when you try to delete,
regenerate, or reset a table.

Related topics

System Definition
Forms, triggers, and links
Fields and Keys tab
Add a field to a table
Edit a field in a table
Edit a record key


1.7.9.2. Editing System Definition nodes

When you double-click any node in System Definition:

     The System Definition utility displays fields, keys, links, and triggers.
     Forms Designer displays forms.
     Service Manager displays records collections in a record list or a single record in
     the associated display form.

Related topics

System Definition
Access field help from the System Navigator


1.7.9.3. Access field help from the System
Navigator

Applies to User roles: System Administrator
To access field help from the System Navigator:

  1. Click System Definition > Tables > tablename.

   2. Double-click a table name to view information about that table.

   3. Click the Fields and Keys tab.

   4. Select any field in the Fields section.

   5. Select one of these links to create or edit the default help record.
     • Create default help on this field. This link appears when no field help exists
     for this field. Click this link to create field help.

     • Edit default help on this field. This link appears when field help already exists
     for this field. Click this link to edit existing field help.

   6. Click Search for specific help on this field in forms to open and edit existing
     form specific help for this field.

   7. If you make changes, click Save.

   8. Click OK.

Related topics

Editing System Definition nodes
System Definition
Creating field help
Field help editor
Add or edit help records
Access the help table


1.7.9.4. Forms, triggers, and links

When you choose one of these components associated with the table, Service
Manager opens the appropriate form or application to edit the component.

     If you double-click a form, Forms Designer displays the selected form.
     If you double-click a trigger, Service Manager displays the related trigger record.
     If you double-click a link, Service Manager displays the related link record.

Edit the form, trigger, or link. If you make any changes to forms, triggers, or links, click
Save.

Related topics

System Definition
Table tab
Fields and Keys tab


1.7.9.4.1. Update a form

Applies to User roles: System Administrator

To update a form:

   1. Click Tailoring > Forms Designer in the System Navigator, or type fd on the
     Service Manager command line and then press Enter.

   2. Type a form name and click Search.

     Service Manager opens a list of forms. Click the form you want to update to
     open it.

   3. Click Design to open design mode.

   4. Add controls in any of the following ways:

           Drag and drop the control from the toolbar to the drawing canvas to create
           a default–sized object.
           Select a control in the toolbar and then click anywhere on the drawing
           canvas to create a default–sized object.
           Drag and drop field(s) from a table in the System Definition onto the
           drawing canvas.
           Cut, copy, or paste a control within the same form, from a different form, or
           from different Service Manager client.

     The properties for the control you selected appear in the properties view.

   5. Specify the name of the form in the Value text box of the Name property.
   6. Specify the database field to access in the Value text box of the Input property.
   7. Specify the height, width, and other properties as desired.
   8. To delete a control from the drawing canvas, select the control and press

     Delete.
   9. Click Web Preview to see what the form will look like in the Web client.
 10. Click OK to see what the form will look like in the Windows client.
 11. Click OK to save your changes.
 12. Open the form using Database Manager to test your changes:

        1. Click Tailoring > Database Manager.
        2. Click Search. Service Manager opens a list of forms.
        3. Click the form you just created to open it.


1.7.9.4.2. Triggers

A trigger monitors a file for certain types of activity, such as Adds, Updates, or
Deletes, and launches a specified JavaScript or RAD application when the appropriate
conditions occur. You can supply custom JavaScript or RAD code to launch a specific
action when the trigger conditions apply.

Create a Trigger record

Applies to User Roles: System Administrator

To create a trigger record:

   1. From the System Navigator, click System Definition > Tables > triggers.
   2. From the Keys sections, click New.
   3. From the General section, select the trigger type from the More Actions menu.
   4. Click Add.
   5. From the Fields section, modify the properties of the available fields to define

     the trigger. You can use the table below as a general guideline for the most
     commonly-used parameters.

Property                                                                                  Service Manager 9.81
trigger.name
table.name                              Description
                                        Any unique, meaningful name.
                                        Select the file to be monitored by
                                        this trigger.

Property                                                                                  Service Manager 9.81
trigger.type
                                        Description

                                        Select the specific activity to react
                                        to:

                                        1 - Before Add - When adding a new
                                        record to this file, launch the
                                        application prior to committing the
                                        addition.

                                        2 - After Add - When adding a new
                                        record to this file, launch the
                                        application after committing the
                                        addition.

                                        3 - Before Update - When modifying
                                        a record in this file, launch the
                                        application prior to committing the
                                        change.

                                        4 - After Update - When modifying a
                                        record in this file, launch the
                                        application after committing the
                                        change.

                                        5 - Before Delete - When deleting a
                                        record in this file, launch the
                                        application prior to performing the
                                        deletion.

                                        6 - After Delete - When deleting a
                                        record in this file, launch the
                                        application after performing the
                                        deletion.

                                        Note: Only triggers of type 4 (After
                                        Update), and type 6 (After Delete)
                                        are supported by Cascade Updates.


Property                                Description
application.name
                                        The RAD application to launch.

                                        Note: The RAD application may not
                                        require parameters and will only
                                        have access to $L.old, the record
                                        prior to the change, and $L.new, the
                                        post-change record.

                                        Note: For most Cascade Updates,
                                        set to cascade.update.wrapper. The
                                        only exception is if the file you are
                                        monitoring is the device file or a
                                        related device attribute file, such as
                                        joincomputer. In those cases, set to
                                        am.cascade.update.wrapper.

Edit a trigger

Applies to User Roles: System Administrator

To edit a trigger:

   1. Click Tailoring > Database Manager.
   2. Type triggers in the Table field, and then click Search.

   3. Click Search again.

     A list of records opens.

   4. Select a record to edit.
   5. Update the following information about the trigger:

           Trigger Name
           Table Name
           Trigger Type
           Application
           Script
   6. If you make changes, click Save.

Related topics

Cascade Updates



1.7.9.4.3. Modify an existing link

User Role: System Administrator

To modify an existing link.

   1. Click Tailoring > Tailoring Tools > Links.
   2. Type optional search criteria, and then click Search.

   3. Double-click a link to view or change it. If necessary, press Ctrl+H to view help
     for each field.

     When the link record opens, the following options are available from the More
     Actions menu:

Option                                  Value
Insert Line
                                        Opens a window to prompt for the
Delete Line                             number of lines to insert, then
                                        inserts them above the cursor
Select Line                             position.
Check Field
                                        Opens a window to prompt for the
                                        number of lines to delete, then
                                        deletes them beginning with the line
                                        the cursor is on.

                                        Allows advanced link processing.

                                        When the cursor is positioned on a
                                        Source Field Name or Target Field
                                        Name, prompts for a file name and
                                        then checks the database dictionary
                                        of the file to determine whether a
                                        field of that name exists. If invalid,
                                        allows selection of a valid field.

   4. If you make changes, click Save.

Related topics


Understanding links
Advanced link editing features
Specifying a link query
Copying fields by name during fill operations
Scalar/non-scalar field links
Keeping changes
Link dependencies within Service Desk
Specifying a link query
Add a new link file
Test a link
Delete a link
Access advanced link maintenance


1.7.10. Data persistence

Service Manager requires a relational database management system (RDBMS) for
data persistence. See the support web site for a list of supported RDBMS vendors.

You can format and manage the data in your RDBMS from the database dictionary.
Service Manager uses the database dictionary to keep a logical version of your
RDBMS database dictionary and index.

Related topics

Database dictionary
Create a database dictionary record by importing RDBMS columns
Create an active database dictionary record
Create an inactive database dictionary record
````
