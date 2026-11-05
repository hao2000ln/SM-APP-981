---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.1.2.7 .. 1.1.2.8
printed_pages: 149-174
---

# 1.1.2.7 Help systems

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.2.7. Help systems

Service Manager has two Help systems:

     The online Help system explains Service Manager concepts and how to use
     Service Manager features. When you want to learn more about a feature or how
     to complete a task, online Help explains what you need to know.

     The field Help system contains a help on the fields in a form. When you are
     filling a form with data, field Help can tell you what information to input in any
     field.

                   Note

                In the web client, the disableKeyHelp parameter controls the field
                Help system.

Related topics

Online Help system
Field help editor
Creating field help
Preparing to create field help
Detect the help record to display
Add or edit help records
Access the help table
Review field help records


1.1.2.7.1. Online Help system

Service Manager has a web-based online help system that you can't customize. The
Help system describes features, concepts, resource information, and steps that you
can follow to perform Service Manager tasks.

Related topics

Help systems
Field help editor


1.1.2.7.2. Field help editor

The field Help system contains a help on the fields in a form. When you are filling a
form with data, field Help can tell you what information to provide in any field.

The Field help editor enables you to add and edit help for any Service Manager field,
form, table, term, or topic. Using it you can add a unique help record that describes
the data in any field.

Service Manager stores field help as records in the help table. The table has fields
that enable you to specify the brief description, detailed description, table name, form
name, field name, related information, term and topic for a help record.

You can add, edit, or delete individual help records through the Field help editor.
Alternatively, since the field help is stored in a standard Service Manager table, you
can use the standard table related functions to add, edit, or delete batches of help
records, including import, export, load, unload, and mass add, update, and delete.

You can run queries to find records in the help table, just as you would on any other
Service Manager table, using either the standard QBE search, or the Advanced search
functions.

Related topics

Creating field help
Preparing to create field help
Detect the help record to display
Online Help system
Add or edit help records
Access the help table
Review field help records


1.1.2.7.2.1. Creating field help

When creating field help, keep in mind that the forms you see as you step through a
process may not be the ones the user sees. What you are looking at is, most likely,
not the only place that displays the field.

     The forms displayed vary with the choices the user makes.
     The fields displayed on the forms vary with the choices the user makes and with
     the user's permissions.
     The use of the field varies depending on user permissions and where the field
     displays. (For example, if data gets entered into read-only fields.)

When creating field help, you may need to do any of these tasks:

     Access the help table.
     Add or edit field help records.
     Run a query through the help table.
     Export a batch of existing field help records and edit them.
     Import a batch of new or edited field help records.
     Perform a mass update on a list of help records.
     Unload a batch of field help records from your local machine and load them into
     the development machine.
     Review new or updated field help records.

Related topics

Preparing to create field help
Field help editor
Detect the help record to display
Online Help system
Add or edit help records
Access the help table
Review field help records


1.1.2.7.2.2. Preparing to create field help

To create field help efficiently, make these changes in your local Service Manager
system.

     Show the context-sensitive help debug information.
     Activate the command line for the System Administrator (or the operator you
     want to enable to create field help) on your local server.
     Set up the columns displaying the help record list.
     Turn on the Administration perspective.

Show context-sensitive help debug information

   1. Start the Service Manager client.
   2. Sign in or close the Connections dialog box.

   3. Click Window > Preferences.

     The Preferences dialog box opens.

   4. Click Service Manager > Appearance.

     The Appearance dialog box opens.
   5. Select Show context-sensitive help debug information.
   6. Click Apply.
   7. Click OK.

Exit the Service Manager client, and then restart it.

Service Manager now displays the file (table), form, and field information when you
press Ctrl+H for a field.

            Note

                You can use such field help information to add or edit field help
                records or identify field names to be used in stored queries.
                The Web client uses the viewcontexthelp=true URL parameter to
                display field help information.

Activate the command line

   1. Start the Service Manager client.


   2. Sin in to your local server as a System Administrator.

   3. Type operator on the command line and click Execute Command.

     Service Manager displays the operator form (operator.g).

   4. Type System.Admin as the sing-in name (or specify the operator you want to
     set the permissions for), and then click Search.

   5. Open the Startup tab and select Activate Command Line at Startup.
   6. Click Save.
   7. Click Ok to exit the record.
   8. Click Back to exit the form.

   9. Exit the Service Manager client, and then restart it.

     Service Manager now displays the Command Line to that operator.

Set up the columns displaying the help record list

   1. Open the help table in the Help Editor and click Search to display the help
     records.

   2. Click More or the More Actions icon.
   3. Click Modify Columns.

     Service Manager displays a form that enables you to edit the columns in the
     record list.
   4. Type or select the following, one per line in this order:

           topic
           file.name
           format.name
           field.name
           term
           brief
           detail
           Pending Review
           sysmodtime
   5. Click Proceed.

Service Manager displays the record list with the columns you selected.

Turn on the Administration perspective

You can turn on the Administration perspective by doing one of the following:

   1. Click Window > Open Perspective > Other, and then select Administration.


   2. In the Service Manager System Navigator on the left side of the window, click
     Administration Perspective.

Service Manager now displays Administration tabs at the bottom of your forms.

Related topics

Creating field help
Field help editor
Detect the help record to display
Online Help system
Add or edit help records
Access the help table
Review field help records


1.1.2.7.2.3. Access the help table

Use one of the following procedures to access the help table:

     Type help on the Service Manager command line and press Enter.

     Use Database Manager.
     Click Tailoring > Database Manager. Type help in the Form field, and then
     click Search. Service Manager displays the Help Description tab of the help
     form (help.g). Use this form to add or edit help records.

Note: If you don't see the command line, you must activate it for the operator you are
using.

Related topics

Creating field help
Preparing to create field help
Field help editor
Detect the help record to display
Online Help system
Add or edit help records
Review field help records


1.1.2.7.2.4. Access field help from the
System Navigator

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


1.1.2.7.2.5. Check the fields that a form
contains

   1. Make sure you have the Administration Perspective open. To do this, do one of
     the following:
           Click Window > Open Perspective > Other, and then select
           Administration.
           In the Service Manager System Navigator on the left side of the window,
           click Administration Perspective.
           This turns on the Administration Perspective, which allows you to see the
           administration tabs at the bottom of the form.

   2. Open the form using Database Manager.
     Note: Don't use the System Navigator as it will open the form in Forms Designer,
     which won't give you the data you need.

   3. Select the Detail Data tab.
     The Detail Data tab contains the XML that generates the form.

The sample XML below describes two fields:

     Contact for this interaction: A comfill for the callback.contact field.
     Notify By: A selection list for the callback.type field, containing the options
     None, Email, Telephone, and other.


  <label x="2" scType="Label" id="Label13" width="32" height="2"
  forecolor="0" y="2">Contact for this interaction:</label>
  <comfill ref="instance/callback.contact" x="36" scType="ComFill"
  id="comfill1109271071725" mandatory="1" idFill="9" width="36"
  idFind="8" arraylength="1" tabindex="1"
  foreignkeyref="Links/LinkLine[@SourceField='callback.contact']"
  scComboButtonVisible="0" height="2" y="2" dataType="string" />
  <label x="2" scType="Label" id="" width="32" height="2"
  forecolor="0" y="6">Notify By:</label>
  <select ref="instance/callback.type" BoxLines="4" x="36" id=""
  mandatory="1" width="36" arraylength="1" selectonly="1"
  height="2" y="6" dataType="string">
  <option value="None">None</option>
  <option value="Email">Email</option>
  <option value="Telephone">Telephone</option>
  <option value="Other">Other</option>
  </select>

Note: You can copy and paste the data from this form into another file, and edit it
down to something easier to read.

Related topics

     Creating field help
     Preparing to create field help
     Field help editor
     Detect the help record to display
     Add or edit help records
     Access the help table
     Check the fields that a table contains
     Check whether help exists for a field


1.1.2.7.2.6. Check the fields that a table
contains

The System Navigator displays the fields in a table, along with many other table
features.

To see the fields in the System Navigator:

  1. Click System Definition > Tables > tablename.
   2. Select Fields to see fields.
   3. Select keys to see the keys.

Related topics

     Creating field help
     Preparing to create field help
     Field help editor
     Detect the help record to display
     Add or edit help records
     Access the help table
     Check the fields that a form contains
     Check whether help exists for a field


1.1.2.7.2.7. Check whether help exists for a
field

Service Manager may not display help that's available for a field when you press
Ctrl+H in the Windows client or press F1 in the Web client.
To check the complete list of help records for a field, if there are any, you must search
the help table.

   1. Type help in the Service Manager command line and press Enter.
   2. Specify your search criteria.

           To search for help on a field in a table, specify the Field Name and the
           Table Name.
           To search for help on all fields in a table, specify the Table Name.
           To search for help on a field in a form, or if you don't know the table,
           specify the Field Name.
   3. Click Search or press Enter.

Service Manager returns records that match your query, if there are any.

Related topics

     Creating field help
     Preparing to create field help
     Field help editor
     Detect the help record to display
     Add or edit help records
     Access the help table
     Check the fields that a table contains
     Check the fields that a form contains
     Review field help records


1.1.2.7.2.8. Detect the help record to
display

A field help record must have a field name and either a table name or a form name for
display.

     The default record for a field must have the field name and the table name, but
     no form name. Service Manager displays the default help record for a field for all
     forms that use the field, excluding those that have a form specific help record.
     A form specific help record for a field includes the form name. Service Manager
     only displays that particular help record when it displays that particular form.

If there is no help record for a field, Service Manager displays No Description.

If there is no form name or table name in a help record, Service Manager will not
display that record as help on a field. However, you can still search for the record and
open it using the Field help editor. This is useful if you want to create a glossary of
terms, for example.

Best practice

To ensure consistent field descriptions on all forms, omit the form name from the field
help record.

If you add a form name to a field help record, the text displays only when Service
Manager displays that form. Adding a form name can be a useful technique for
documenting special forms, but may increase the number of help records to maintain.

Related topics

Creating field help
Preparing to create field help
Field help editor
Add or edit help records
Access the help table


1.1.2.7.2.9. Add or edit help records

The user can also click "Accept" instead of Add/Save after editing the help. This will
immediately publish the help topic with no additional review.

   1. Click Tailoring > Database Manager.
   2. Type help in the Form field, and then click Search.
   3. Double-click the help (help.g) form.

     Service Manager displays the Help Description tab of the help form (help.g). Use
     this form to add or edit help records.
   4. Type a Brief Description.
   5. Type the Detailed Help information, if necessary.
   6. Select the Keywords tab.
   7. Specify the Field Name.
   8. Specify the Table Name.
   9. (Optional) You can add the following in the Keywords tab:

          • Specify the Form Name - Use this field to create form-specific help.
          • Specify Related Information - Use this field to create a link to field help for
          related fields.
          • Specify the Term - Use this field to define glossary terms.
 10. (Optional) You can specify the Topic in the Help Description tab. Use this field to
     input help on specific areas of Service Manager.
 11. Click Add or Save to create new or revise existing field help.
     The help topic is now marked Pending Review. The help topic is not published
     until it is reviewed and accepted. For more information, see Review field help
     records.

                   Tip

                You can click Accept instead to immediately publish the help topic
                without additional review.


Related topics

Creating field help
Preparing to create field help
Field help editor
Detect the help record to display
Online Help system
Access the help table
Review field help records


1.1.2.7.2.10. Review field help records

New or revised help topics must be reviewed before they can be published. If you
don't complete this step, the help records will not be visible to users.

To review field help records, follow these steps:

   1. Connect to the server that contains the help you want to review.
   2. Run this query against the help table.

      pending.review="true"
     Service Manager displays the records that currently need review.

   3. Use one of the following procedures:

           Click Accept to indicate that you have reviewed an individual record.
           Use the following Mass Update to indicate that you have reviewed the list
           of records.
            pending.review in $file=false

                         Note

                       If more than one person has input field help, you will need to
                      refine your query to find the specific records you want to
                      review.


1.1.2.8. Sequential number setup

The Sequential Number file is used in conjunction with Format Control to generate
sequence numbers for records in a database. The sequence number is automatically
incremented or decremented when a new record is added. For instructions on
creating a Format Control record with sequential numbering, refer to Format Control
Help.

Related topics

Sequential number file
Access the sequential number file
Create a simple number counter
Use decrement in sequential numbers
Use prefix and suffix in sequential numbers
Update a sequential number record
Delete a sequential number record


1.1.2.8.1. Sequential number file

The Subroutines process of Format Control creates a Sequential Number File record
when the application getnumb.fc is called. The parameters passed to the application
from within Subroutines define the values in the number file fields. These values
determine how the sequential number opens and what other information it contains.
You can define number file values either directly in the number file or via parameters
passed from Format Control. However, if you use the number file to change values
also defined in the Format Control subroutines process, they are overridden by the
Format Control values.

Related topics

Sequential number setup
Access the sequential number file
Create a simple number counter
Use decrement in sequential numbers
Use prefix and suffix in sequential numbers
Update a sequential number record
Delete a sequential number record
Service Manager Programming


1.1.2.8.2. Access the sequential number
file

The Sequential Number file is used in conjunction with Format Control to generate
sequence numbers for records in a database.

To access the sequential number file:

Click Tailoring > Tailoring Tools > Sequential Numbers.

The sequential number file opens.

Related topics

Sequential number file
Sequential number setup
Create a simple number counter
Use decrement in sequential numbers
Use prefix and suffix in sequential numbers
Update a sequential number record
Delete a sequential number record


1.1.2.8.3. Create a simple number counter

The following example illustrates how to create a record called employee in the
Sequential Number File to automatically increment employee numbers starting with 1.

   1. Access the Sequential number file.
   2. Create a new file. Type employee in the Class field for this example.
   3. Type 0 in the Last Number field to begin incrementing from zero.
   4. Type a short description for the number class.

     For example: Employee ID number counter.
   5. Type 1000 in the Reset Point field.
   6. Type 1 for the Increment/Decrement field value.

     Since the Decrement field was left blank, each number will increase by one.
   7. Click Add.

The new sequential number record is added to the sequential number file.

Related topics

Sequential number file
Sequential number setup
Access the sequential number file
Use decrement in sequential numbers
Use prefix and suffix in sequential numbers
Update a sequential number record
Delete a sequential number record


1.1.2.8.4. Use decrement in sequential
numbers

You can use sequential numbers to decrement a starting value. For example, you can
decrement a quantity field when deleting stock from inventory. This example shows
you how to decrement a value starting at 1000.

   1. For this example, type active.devices in the Class field.
   2. Type 1000 in the Last Number field.
   3. Type a short description for the number class.

     For example, type Number of devices available .
   4. Type true in the Decrement field.
   5. Type 0 in the Reset Point field.
   6. Type 1 for the Increment/Decrement field value.

     Since the Decrement field is set to true, each number decreases by one.
   7. Click Add.

The new sequential number record is added to the sequential number file.

Related topics

Sequential number file
Sequential number setup
Access the sequential number file
Create a simple number counter
Use prefix and suffix in sequential numbers
Update a sequential number record
Delete a sequential number record


1.1.2.8.5. Use prefix and suffix in
sequential numbers

This example uses prefixes and suffixes to assign character type ID numbers to
workstation devices. The format of the ID is: DEV<number>T where DEV is a fixed
character prefix, <number > is a sequential number starting with 1, and T is a fixed
character suffix.

   1. For this example, type devices in the Class field.
   2. Type 0 in the Last Number field.
   3. Type a short description for the number class.

     For example, enter Workstation device ID counter.
   4. Leave the Decrement field blank.
   5. Type 1000 in the Reset Point field.
   6. Type 1 for the Increment/Decrement field value.
   7. Type 5 in the Length field.
   8. Type DEV in the Prefix field.
   9. Type T in the Suffix field.
 10. Click Add.

The new sequential number record is added to the sequential number file. The first
sequential number for the devices class is DEV00001T.

Related topics

Sequential number file
Sequential number setup
Access the sequential number file
Create a simple number counter
Use decrement in sequential numbers
Update a sequential number record
Delete a sequential number record


1.1.2.8.6. Update a sequential number
record

Follow these steps:

   1. Access the sequential number record. Use the search function or select the
     record from a record list.

   2. Enter changes to the fields you want to update.
   3. Click Save.

Related topics

Sequential number file
Sequential number setup
Access the sequential number file
Create a simple number counter
Use decrement in sequential numbers
Use prefix and suffix in sequential numbers
Delete a sequential number record


1.1.2.8.7. Delete a sequential number
record

Follow these steps:

   1. Access the sequential number record that you want to delete. Use the search
     function or select the record from a record list.

   2. Click Delete.
   3. Click Yes to confirm that you want to delete the record.

The form opens with the message: Record deleted from the number file.

Related concepts

Sequential number file
Sequential number setup
Access the sequential number file
Create a simple number counter
Use decrement in sequential numbers
Use prefix and suffix in sequential numbers
Update a sequential number record
````
