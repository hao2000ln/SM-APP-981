---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.7.10.10 .. 1.7.10.10
printed_pages: 2287-2317
---

# 1.7.10.10 Record retrieval

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.7.10.10. Record retrieval

Service Manager allows you to search for and retrieve database records based on
particular user-provided search criteria (query). Searching is case-sensitive by
default, unless your database has been set up for case-insensitive searching. For
information on how to improve query speed, see the Help topic Tuning: Improving
query speed.

There are three methods of querying records from a Service Manager database:

     Simple queries are defined using the record list method.
     More complex queries are defined using the query window method.
     Other queries can be performed using IR Expert information retrieval.

Related topics

Relational operators
Logical operators
Wildcard characters
Record list
Queries
Retrieving records by using the record list method
Retrieving records using the Query window method
Perform IR Expert queries
Service Manager Programming
Tuning: Improving query speed


1.7.10.10.1. Open a record using Database
Manager

The Service Manager Database Manager utility runs in two modes, standard and
administrative.

     In standard mode, behavior is determined by whatever security you have in
     place. Request Management, for example, uses Request security while the
     standard database uses Format Control. In standard mode, an administrator
     doesn't necessarily see all options. Options that are potentially troublesome for
     Service Manager, mass-updates, regenerating keys, and so on, are kept out of
     sight to prevent accidental use.

     Administration Mode is similar to root privileges on Linux systems.
     Administration Mode is powerful, in that you can make changes that affect
     Service Manager as a whole. In Administration Mode, (with the Administration
     Mode checkbox selected), a System Administrator will have rights to ALL
     options unless a different displayscreen is used based on the value of the
     Administration Mode checkbox.

     The value of the Administration Mode checkbox affects which displayscreen is
     used for certain files. The link file will use the link.view displayscreen when
     Admin Mode is disabled and db.view when Admin Mode is enabled. The
     globallists file will use the global.view displayscreen when Admin Mode is
     disabled and db.view when Admin Mode is enabled. When Admin Mode is
     enabled for the link and globallists files, the SysAdmin no longer has access to
     the Select Line and Rebuild Global List options respectively.

Note: Do day-to-day administration in standard mode.

Two capability words control whether a user administrator can use standard or
administrative mode.

     Users with the SysAdmin capability word defined in their operator file will see
     the Administration Mode checkbox.
     Users with the AlwaysAdmin capability word defined in their operator file will be
     in Administration Mode by default.

To open a record using Database Manager:

   1. Click Tailoring > Database Manager.


     Note: Alternatively, you can open Database Manager from the command line, by
     typing db , and then pressing Enter or clicking Execute Command.
   2. Select a form or file by typing the name of a form in the Form field or the name
     of a file in the Table field.
     If one or both fields are left blank, the record list returns all records that match
     your criteria.
   3. Click Search.
   4. Enter your search criteria. For example, you can enter known information in key
     fields, such as names of operators, names of devices, or incident numbers.
     Note: Executing a search that includes a field that's not fully keyed slows
     response time.
   5. Click Search.

           If found, a record that matches your criteria opens.
           If more than one match is found, a record list opens.
           For multiple returns, click a record from the record list to display it.
           To update the record, edit the record and then click Save.

Note: A device is also referred to as a Configuration Item (CI).

Related topics

Record retrieval


1.7.10.10.2. Determining System Navigator
menu options

The function and contents of the items displayed in the More Actions menu for the
System Navigator are determined by a combination of the following:

     Additional Options
     Display settings
     Format Control
     The RAD application currently running

Additional options are only available in select applications. You can use Format
Control to create additional capabilities for users that allow extended user rights and
additional access to data gathering, such as additional views and use of the Find and
Fill functions.

Icons
     More Actions menu:
     Find function:
     Fill function:

For additional information about Additional Options and Format Control, see the
related topics.

Related topics

Format Control
Multiple-record functions
Single-record functions


1.7.10.10.3. Record list

A record list is a specific form displaying pertinent field values from each record
found in the search. If you have not created a customized record list form for this list,
Service Manager will create one (<filename>.qbe) based on key fields defined in the
database dictionary for the file.
Select a record from the list by positioning the cursor on the desired record and
double-clicking or pressing Enter.

     If the search criteria uniquely define only one record, that record opens using
     the form used to define the search or the one defined by a form name in the
     record, depending on format control.
     If the search criteria don't find any records, Database Manager returns the
     message: No records found to satisfy record list search argument(s).

Refresh a record list

Applies to User Roles: System Administrator

To refresh a record list:

   1. Open the More Actions menu.
   2. Select Refresh List.

Related topics

Relational operators
Logical operators
Wildcard characters
Retrieving records by using the record list method
Retrieving records using the Query window method
Using functions in a query
Stored queries
Format Control
Perform IR Expert queries


1.7.10.10.4. Multiple-record functions

Multiple-record functions allow you to perform add, update, delete, and print
functions on multiple records within a database. The Mass functions (Mass Add,
Mass Update, Mass Delete) become available whenever a query produces a record
list, that is, the desired function acts upon the records in the record list.

The topics below comprise an example of how to use multiple-record functions.
Follow the steps in this order. If you skip a step, the example will not work.

   1. Add multiple records using Mass Add with a literal value
   2. Add multiple records using Mass Add with a variable value
   3. Update multiple records using a literal value
   4. Update multiple records using a variable value
   5. Avoid invalid duplicate or null key errors
   6. Delete multiple records

            Note

           The Mass functions may require use of the Administration Mode
           checkbox when starting Database Manager.

Related topics

Adding multiple records
Updating multiple records
Print multiple records


1.7.10.10.4.1. Adding multiple records

After opening a record list from a Service Manager file, the Mass Add function allows
you to add a block of records to the database. The new records are exact duplicates
of those in the original record list. You can also run format control triggers and macros
by setting the add field to true. Mass Add processing statements use the $file
parameter to access fields on records in the current record list. For example, name in
the $file parameter or the number one (1) in the $file parameter.

You can choose to add exact duplicates only to databases where keys are defined as
Nulls & Duplicates or there are No Nulls in the database dictionary. Adding duplicate
records in any other manner causes Database Manager to issue an invalid duplicate
key error message for each record. To avoid this error when running a Mass Add
function against a file with Unique or No Duplicates keys, run processing statements
during the Mass Add function that will manipulate the contents of the new records.

Add multiple records using a literal value

Applies to User Roles: System Administrator

Example: Duplicate all contact records for advantage. Retain the same information in
each record, with the exception of changing the Location to North America. Since
Contact Name (contact.name) is a Unique key and Employee ID (user.id) is a No
Duplicates key in the contacts file, you must assign unique contact.name and user.id
values to the new records. For additional information about key type definitions, see
the related topics. In this example, append the value -NA to the contact.name and
user.id values to maintain uniqueness.

To mass add records using a literal value:

   1. Open the form in Database Manager. Ensure that you select the Administration
     Mode checkbox. In this example, open the following form: contacts . A blank
     contacts form opens.

   2. Enter the desired value in the Company input field. For this example, select
     advantage from the Company list.

     Click Fill. to open the list.

   3. Click Search.

     Database Manager performs the equal to search and displays the matching
     records, if any.


  If the query produces no matching records, Service Manager displays a
  message.

4. To display the Mass function buttons, use a query that returns more than one
  record.

  Select one of the listed records, and then select Mass Add. from the toolbar to
  start the process of duplicating the records shown in the list.

  Database Manager displays the Mass Add/Update Instruction screen.

5. Type the applicable statements in the input fields.

  • Statements in the first input field ( Instructions to be executed ONCE at the
  beginning of Mass Add/Update ) are executed once at the beginning of the add.
  • Statements in the subsequent input fields ( Instructions for action on EACH
  RECORD ) are executed against every record as it is added.

  For this example, leave the first input field blank and enter the following
  assignment statements in the Instructions for action on EACH RECORD input
  fields.

Statement                               Purpose
contact.name in $file=contact.name
in $file +"-NA"                         Appends -NA to the end of all
location in $file="North America"       contact.name values.

user.id in $file=user.id in $file +"-   Changes the location value to North
NA"                                     America.

                                        Appends -NA to the end of all user.id
                                        values.

6. Click Execute,

  Database Manager performs the Mass Add in the foreground. Your session is
  devoted to the add task until it is completed. If you are updating a large number
  of records, this can take a while.

  Upon completion, Service Manager returns terminal control to you and displays
  the following message:<nnn>records added to the contacts file where nnn is the
  number of records added.

7. Click View Messages to check the messages for errors.


     • A blue icon indicates a required action.
     • A yellow icon indicates an informational or warning message.
     • A red icon indicates an error message.

Close the Messages window to return to the contacts form.

     Click the More Actions icon and choose Refresh.

     In the new records, the Contact Name (contact.name) and Employee ID (user.id)
     values are the same as the original records with -NA appended. The Location
     (location) values are now North America.

     The original records listed before the Mass Add remain in the contacts file with
     no changes to the original data.

     Click OK. to return to the contacts form.

     On the contacts form, type North America in the Location field. Click advantage
     in the Company field. Type Search.

     Database Manager performs the equal to search and displays the matching
     record(s), if any, in the contacts.qbe form.

Add multiple records using a variable value

Applies to User roles: System Administrator

Example: Duplicate all "contacts" records with a company.name value of advantage.
Include the same information in each record, except for changing the Company to
NewAdvantage, creating sequential user.id values, and creating a Unique key for each
record.

Since Contact Name (contact.name) is a Unique key and Employee ID (user.id) is a No
Duplicates key in the contacts file, you must assign unique contact.name and user.id
values to the new records. For additional information about key type definitions, see
the related topics. For this example, suffix the user.id values in the new records with
sequential numbers, starting with 1000 (1000, 1001, and so on.)

Note: Mass Add processing statements reference $file to access fields on records in
the list. For example, name in $file or 1 in action in $file.

To add records using a variable value:

   1. Open the form in Database Manager. Ensure that you select the Administration
     Mode checkbox. For this example, open the following form: contacts . A blank
     contacts form opens.


2. Enter the desired value in the Location field.

  For this example, type North America, and then click Search.

  Database Manager performs the equal to search and displays the Record List of
  matching record(s), if any. If the query produces no matching records, Service
  Manager displays a message.
3. To display the Mass function buttons, use a query that returns more than one
  record.

  Select Mass Add from the toolbar to start the process of duplicating the records
  shown in the Record List.

  Database Manager displays the Mass Add/Update Instruction screen.

4. Type the following assignment statement in the Instructions to be executed
  ONCE at the beginning of Mass Add/Update input field.

Statement                               Purpose
$sequential.number=1000
                                        Sets the start point for the variable
                                        at 1000 and will be executed only
                                        once for the entire function.

5. Enter the following statements on the Instructions for action on EACH RECORD
  input fields:

Statement                               Purpose

user.id in                              Sets the User Id to NewAdvantage

$file="NewAdvantage"+str($sequen with a sequential number as a suffix.

tial.number)

$sequential.number+=1                   Causes one (1) to be added to all
                                        future numbers created from this
                                        variable.

contact.name in $file=first.name in     Makes the contact name the same
$file + " " + last.name in $file        as the first and last name.


   6. Click Execute.

     Database Manager performs the Mass Add function in the foreground. Your
     session is devoted to the add task until it is completed. If you are updating a
     large number of records, this can take a while.

     Upon completion, Service Manager returns terminal control to you and displays
     the following message:<nnn>records added to the contacts file where nnn is the
     number of records added.

   7. Click View Messages to check the messages for errors.

     • A blue icon indicates a required action.
     • A yellow icon indicates an informational or warning message.
     • A red icon indicates an error message.

   8. Close the Messages window to return to the contacts form.

Related topics

Format Control
Service Manager macros
Multiple-record functions
Updating multiple records
Key type definitions
Service Manager Programming


1.7.10.10.4.2. Updating multiple records

The Mass Update functions let you modify the contents of each selected record in the
list of records accessed from Database Manager. You enter one or more processing
statements, which Service Manager executes during adds, updates, and deletes.

Mass Update processing statements use the $file parameter to access fields on
records in the current record list. For example, name in $file or 1 in action in $file .

Update multiple records with Mass Update

Applies to User Roles: System Administrator

Mass Update enables a user (ADMIN or SYSADMIN) to update one or several fields in
a set of records. Mass Update consists of three related functions, template Mass
Update, Simple Mass Update, and Complex Mass Update. In a template Mass Update,
a template displays a list of fields that can be updated. The user enters a value for
each field to be updated to complete the process. In a Simple Mass Update, Service
Manager displays a record form in which the user can enter values for selected fields.
These values are then applied to all of the records selected for the Simple Mass
Update. In a Complex Mass Update, Service Manager displays a form in which the
user enters RAD expressions containing variables and concatenated fields to populate
another field in the selected records.

The Mass Update function can be used with the following applications:

     Change Management
     Configuration Management
     Incident Management
     Problem Management
     Service Desk

The Database Manager also uses Mass Update to update the following tables:

     contacts
     company
     department (dept)
     location
     operator

The Mass Update functions in Database Manager also let you modify the contents of
each record in the list of records accessed from Database Manager, by entering one
or more processing statements, which Service Manager executes during adds,


updates, and deletes. When add is set to true, Service Manager also executes Format
Control, triggers, and macros, if present for the form.

You can update multiple records with Mass Update by using the Mass Update
template form, Simple Update, or Complex Update. Choose one of the following
methods to update multiple records.

Options for Mass Update errors

The following are the available options for Mass Update if validations on format
control fail:

Option                                  Action
Retry
                                        Reruns the mass update function on
Skip                                    the selected records. Service Manager
Force                                   once again validates each record in the
                                        mass update against its format control.

                                        Skips the current record without
                                        making any changes.

                                        Updates the current record with
                                        whatever information that you entered,
                                        regardless of format control.

Update multiple records with Mass Update by using the Mass
Update template form

To update multiple records with Mass Update by using the Mass Update template
form:

   1. Click System Administration > Base System Configuration > Companies.
   2. Click Search.
   3. Select the records in the record list you want to update.
   4. Click Mass Update.

   5. Type the value for the field in the text box or use the Find feature to display a list
     of potential values for the field.

     Note: The value(s) you enter in the form are propagated to all of the records you
     selected.

   6. Click Next.


   7. Continue updating fields and click Execute when you complete your updates.

Note: If you exit the Mass Update template form or Complex Update form without
pressing Execute, all of your changes are cleared on the respective form.

Update multiple records with Mass Update by using Simple
Update

To update multiple records with Mass Update by using Simple Update:

   1. Click System Administration > Base Configuration > Companies.
   2. Click Search.
   3. Select the records in the list you want to update.
   4. Click Mass Update.
   5. Click Simple Update.
   6. Type new values into the appropriate fields on the form.
   7. Click Execute.

Update multiple records with Mass Update by using Complex
Update

To update multiple records with Mass Update by using Complex Update:

   1. Click System Administration > Base Configuration > Companies.
   2. Click Search.
   3. Select the records in the list you want to update.
   4. Click Mass Update.
   5. Click Complex Update.
   6. Type the RAD code in the Complex Update form.
   7. Click Execute.

Update multiple records using a literal value

Applies to User roles: System Administrator

Example: modifying the Service Contract field value to the company's VIP Service for
the contacts records for all advantage employees in North America.

To update multiple records with a literal value:

   1. Sign in to the Service Manager Windows client.
   2. Open the contacts form in Database Manager. Ensure that you select the

     Administration Mode checkbox.


   3. Enter the desired value in the Company input field. For this example, select
     advantage from the list.

   4. Enter the desired value in the Location input field. For this example, type North
     America.

   5. Click Search.

     Service Manager displays all matching records in a record list. If the query
     produces no matching records, Service Manager displays a message. To display
     the Mass function buttons, use a query that returns more than one record.

   6. Select Mass Update from the tool bar to start the process of updating the
     records shown in the record list.
     Database Manager re-displays the initial form with new option buttons.

   7. Select Simple Update from the toolbar.
   8. Enter the desired changes. For this example, select VIP Service from the

     Service Contract drop-down list.

   9. Click Execute.

     The system returns terminal control to you and displays the newly updated
     records in the record list, along with the message nnn records updated in the
     contacts file , where nnn is the number of records updated.

Update multiple records using a variable value

Applies to User Roles: System Administrator

Example: Change the email address for all Advantage contacts records for people
located in North America to follow the pattern: firstname.lastname@advantage.com.

To update multiple records with a variable value:

   1. Open the contacts form in Database Manager. Ensure that you select the
     Administration Mode checkbox.

   2. Enter the desired value in the Company input field. For this example, select
     advantage from the Company list.

   3. Enter the desired value in the Location input field. For this example, type North
     America .

   4. Click Search.
     Database Manager performs the full search and displays the Record List of
     matching records, if any, in the contacts form.

   5. Select Mass Update from the tool bar to start the process of updating the
     records listed.


  Database Manager re-displays the initial form with different option buttons.
6. Do not enter values in any field. Click Complex Update.

  Database Manager displays the Mass Add/Update Instruction screen.
7. Enter the following assignment statement in the Instructions for action on EACH

  RECORD input field, as shown:

Statement                               Purpose

email in $file = first.name in $file +  Sets the email address to
"." + last.name in $file +              firstname.lastname@advantage.com
"@advantage.com"                        .

     The system executes this instruction for each record updated. Then it returns
     terminal control to you, and displays the message nnn records updated in the
     contacts file , where nnn is the number of records updated.

Template mass update and required fields

Template mass update processes one record at a time, updating the record with the
values that you enter in the template form. If a record is missing required fields, then
Service Manager asks for the missing field(s), one at a time.

For example, the change queue tasks out-of-box are missing required fields Initial
Impact Assessment and Urgency. When you use template mass update to modify
these records and you don't enter a value for Initial Impact Assessment and Urgency,
Service Manager displays "The Initial Impact Assessment is required". This message
pertains to the present record that's being updated. If you enter an Initial Impact
Assessment in the template form, then Service Manager prompts you for the missing
Urgency for that record.

If there are three out-of-box change queue task records to modify using template
mass update, and the second and third records are missing two required fields (for
example, the Initial Impact Assessment and Urgency field values) and you enter a new
Downtime End in the template form, Service Manager responds by:

   1. Updating the value of the Downtime End field you entered in the first record.
   2. Prompting for the missing field(s) for each record. When the Initial Impact

     Assessment and Urgency field values are entered in the template form, the
     second record is updated with the Downtime End, Initial Impact Assessment, and
     Urgency.


   3. Prompting for the missing fields for the next record. When the Initial Impact
     Assessment and Urgency are added to the template, the third record is updated
     with the Downtime End, Initial Impact Assessment, and Urgency.

In summary, the data you originally added, the Downtime End, is never lost. The third
record might have a different Initial Impact Assessment and Urgency from the second
record, and since you entered no Initial Impact Assessment and Urgency in the
template at first, Service Manager asks you for the Initial Impact Assessment and
Urgency for the second and for the third record, one at a time.

Avoid invalid or null key errors

Applies to User Roles: System Administrator

Records can't have duplicate Unique or No Duplicates keys. This example shows one
such error and how to fix it.

To handle an invalid duplicate of NULL key error:

   1. Open the form in Database Manager. For this example, open the following
     form: contacts . Be sure to select the Administration Mode checkbox.

     A blank contacts form opens.

   2. Type NewAdvantage in the Employee ID field., and then click Search.

   3. Select Mass Update. from the toolbar to begin updating the records shown in
     the Record List.

     Database Manager displays the initial form again.

   4. On the displayed form, type NewAdvantage in the Contact Name field.

   5. Click Simple Update.

           The system accepts the first update, because the contact name is unique.
           The system rejects the second update, since changing it would create a
           duplicate contact name.

     Database Manager opens the record for modification and displays an error
     message.

   6. Click View Messages to check the messages for errors.

           A blue icon indicates a required action.
           A yellow icon indicates an informational or warning message.
           A red icon indicates an error message.


7. At this point, there are several options concerning the outcome of this process.

        Enter a unique key and click Retry for each item on the list separately, to
        cause Service Manager to reexecute everything, including the Format
        Control.
        Click Skip to cause Service Manager to skip the record.
        Click Force to cause Service Manager to update the record with the
        information you entered, regardless of Format Control.

  For this example, modify the Contact Name field value to make it unique for
  each item. (NewAdvantage2, NewAdvantage3, NewAdvantage4, and so on.)

  If the update was successful, Service Manager displays the following message:
   <n>records updated in the contacts file.

8. Type NewAdvantage in the Employee ID (user.id) field, and then click Search.

  Database Manager displays the records you have just added in a record list.

  The Employee ID values consist of Advantage + 1000, 1001, and so on, and the
  Contact Name values the first and the last names. The original records listed
  before the Mass Add remain in the contacts file, with no changes to the original
  data.


1.7.10.10.4.3. Delete multiple records

Applies to User Roles: System Administrator

Example: Delete the contacts for advantage with a variant of NewAdvantage as the
contact name.

To delete all records with a specified value:

   1. Click Tailoring > Database Manager.
   2. Select Administration mode.
   3. For this example, open the contacts form.
   4. Enter the desired value. For this example, type NewAdvantage* in the Contact

     Name field.

   5. Click Search.

     Database Manager performs the search and displays the record list of matching
     records, if any, in the contacts.qbe form.

     If the query produces no matching records or only one matching record, then
     Service Manager doesn't display a record list.

     Note: To display the Mass function buttons, use a query that returns more than
     one record.

   6. Select Mass Delete from the tool bar to remove the records shown in the record
     list from the database.

     Database Manager confirms the delete request with a prompt screen.

   7. Do one of the following:
           To cancel the delete, click No.

           To confirm the delete, click Yes.

           Database Manager deletes all records in the list.

           Note: Service Manager performs the Mass Delete function in the
           foreground, which means your terminal is devoted to this function until
           complete. If you are deleting a large number of records, this can take a
           while.

Upon completion, Service Manager returns terminal control to you. A blank contacts
form opens with the message: “nnn records deleted from the contacts file”, where
nnn is the number of records deleted.


Related topics

Multiple-record functions
Open a record using Database Manager


1.7.10.10.4.4. View multiple records using
an alternate form

Applies to User Roles: System Administrator

Windows client:

To view a list of records using a predefined alternate form:

   1. From the Window Menu select Preferences....
   2. Select Service Manager > Appearance.
   3. Verify that the option Show detail pane with record list is unchecked. If it isn't,

     uncheck it. Log out and log back in.
   4. From a list of records click the More Actions menu.
   5. Select Alternate Forms.
   6. Select a form to use to display the list.

Note: This option will be available only when there are additional forms specified for
the list of records on the formatcontrol and the condition(s) specified are met.

Web client:

To view a list of records using an predefined alternate form:

   1. Locate the web.xml document belonging to your Service Manager installation.
     For example:

C:\Program Files\Apache Software Foundation\[tomcat directory]\webapps\
[ServiceManager web directory]\WEB-INF\web.xml

   1. Open it for edit.
   2. Set the parameter "viewrecordlist" to false.
   3. Restart the Apache Tomcat service ( Windows Control Panel > Administrative

     Tools > Services)
   4. From a list of records click the More Actions menu.
   5. Select Alternate Forms.
   6. Select a form to use to display the list.

Note: This option will be available only when there are additional forms specified for
the list of records on the formatcontrol and the condition(s) specified are met.

On the Web client, you can also:

   1. Logout.


   2. Add the following parameter to the end of the URL:
      ?viewrecordlist=false

   3. Example:

          http://localhost:8080/ [ServiceManager web
          directory]/index.do?viewrecordlist=false

Related topics

Multiple-record functions
Adding multiple records
Open a record using Database Manager


1.7.10.10.4.5. Mass close interaction
records

Applies to User roles: System Administrator

The Mass Close function enables a user to select and then close a set of incident or
interaction records simultaneously. For the out-of-box systems, the ADMIN and
SYSADMIN profiles include the Mass Close capability. In Service Desk, you can use
Mass Close for interaction lists and interaction queues. In Incident Management, you
can close multiple incident records.

For the out-of-box systems, the ADMIN and SYSADMIN profiles include the Mass
Close capability. You can use Mass Close for interaction lists and interaction queues.
Choose one of the following methods to mass close interactions.

Mass close interaction records after searching for
interactions

To mass close interaction records after searching for interactions:

   1. Click Service Desk > Search Interaction Records.
   2. Use Search to display a list of interaction records.
   3. Select the records in the record list you want to close.
   4. Click Mass Close.
   5. Edit the text present for the resolution of the interaction or accept the text.
   6. Click Finish.

Mass close interaction records from the Interaction
Queue

To mass close interaction records from the Interaction Queue:

   1. Click Service Desk > Interaction Queue.
   2. Specify the Queue and the View.
   3. Select the records in the record list you want to close.
   4. Click Mass Close in the More Actions menu.
   5. Specify the Resolution Code. Use the Fill icon to display a list of available codes.
   6. Click Next.


7. Accept or edit the text in the Resolution text box.
8. Click Finish.

Related topics

Contents

     1 Mass close interaction records after searching for interactions
     2 Mass close interaction records from the Interaction Queue
     3 Related topics


1.7.10.10.4.6. Determine the number of
records in a record list

To determine the number of records in a record list:

   1. Open the contacts form in Database Manager.
   2. Select the contacts file from the record list.

     A blank contacts record opens.
   3. Click Search.

     The contacts format opens with a record list at the top and the Count option in
     the toolbar and in the More Actions menu.
   4. From the More Actions menu, choose Count to get the record count.
     Service Manager displays the record count on the Count button.
     Note: If you select Count from the tool bar, a prompt opens asking whether all
     records in the list should be counted. Confirm by clicking Yes.
     The system counts the records and displays the following message: “There
     are<n>records in this list”.

Related topics

Multiple-record functions
Open a record using Database Manager


1.7.10.10.4.7. Print multiple records

Applies to User roles: System Administrator
Example: Print all contact records.
Open the contacts form in Database Manager, don't enter any values and then click
Search. Database Manager performs the true search and displays a complete list of
all the contact records.

            Note

           If the query produces no matching records or only one matching record,
           then Service Manager doesn't display a record list.

Follow the instructions in Print options to print in the windows client or the web client.

Related topics

Multiple-record functions
Print options
Open a record using Database Manager


1.7.10.10.5. Single-record functions

Single-record functions include adding, updating, deleting, and printing individual
records within a database.

Add a record

Applies to User roles: System Administrator

Example: Add a record for the new contact, Bob Hoskins, to the contacts file.

To add a contact:

   1. Open a form in Database Manager. For this example, open the contacts form.
   2. Select the contacts file from the record list, and then click Search.
   3. Enter the required values in the Business Information section of the Business

     tab, and other values as needed. In this example, enter the following values.

Field                                   Record value
Contact Name                            HOSKINS,BOB
Company                                 Advantage

   4. Click Add.

Database Manager adds the record, retains the input from the screen displayed, and
responds with the following message: Contact Information record added.

Clear an initial record

Applies to User roles: System Administrator

If you need to redo an incorrect record or need otherwise to clear all data from an
initial record form, you can remove this data quickly and completely using the Clear
command.

To clear all data from an initial screen:

   1. Open the form in Database Manager. For this example, open the contacts form.
   2. Select the record from the record list.
   3. Open the More Actions menu.
   4. Select Clear.


Delete a record

Applies to User roles: System Administrator
Example: Delete the contact record you added for Richard Butler.
To delete a record:

   1. Open a form in Database Manager. In this example, open the =contacts form.
   2. Search for the existing record by entering BUTLER, RICHARD in the Contact

     Name field and clicking Search.
   3. Click Delete. Confirm the action at the prompt.
   4. Click Yes to continue with the record deletion. If successful, the system displays

     the following message: Contact Information record deleted .

Duplicate an existing record

Applies to User roles: System Administrator
Example: Add a new record to the contacts table that's a near duplicate of an existing
record. For this example, all information except the Primary Configuration item (CI)
and Contact Name will be the same.
To duplicate an existing record:

   1. Open the form in Database Manager. For this example, open the contacts form.
   2. Select the contacts file from the record list.

     A blank contacts record opens.
   3. Click Search.
   4. Select CHAN, TERESA from the returned list.
   5. Select the Business tab.
   6. Type a new name in the Contact Name field.

     For this example, type BUTLER, RICHARD.
   7. Enter a new Primary Configuration Item for this record.
   8. Delete the Employee ID.

     Add your own at this point, or leave this field blank.
   9. Click Add.


Database Manager adds the record, retains the input from the screen displayed, and
responds with the following message: Contact Information record added .

Print a record

Applies to User roles: System Administrator

Example: Printing an existing contacts record for Richard Butler.

To print a record:

   1. Open the contacts form in Database Manager.
   2. Select the contacts file from the record list, and then press Enter. A blank

     contacts file opens.
   3. Click Search.
   4. Select Richard Butler from the returned list.

Search for newly added records

Applies to User Roles: System Administrator

To search for newly added records:

   1. Click Tailoring > Database Manager.
   2. Place the cursor in the Table field, and then click Search.
   3. Click the Last Updated column header to sort the table of records returned by

     date and time.

Update an existing record

Applies to User roles: System Administrator

Example: Update the existing contacts record for Teresa Chan, whose primary
Configuration Item (CI) has an identification number of 167, and change the value to
adv-nam-desk-267.

In this example, we use the contacts form to change the identification number of
Teresa Chan's primary CI, from adv-nam-desk-167 to adv-nam-desk-267.

Note: Audit Specification Records must be defined for Configuration Items prior to
modifying.

To update an existing record:

   1. Click Tailoring > Database Manager.
   2. Type =contacts in the Form field, and then click Search.


   3. On the Contact Information form, place the cursor in the Contact Name field, and
     then click Search.

   4. Select CHAN, TERESA from the record list returned and select the Business tab.
   5. In the Primary Configuration Item field, type adv-nam-desk-267 to replace the

     current value.
   6. Click Save.

View a single record using an alternate form

Applies to User Roles: System Administrator

To view a record using predefined alternate form:

   1. From a detail record click the More Actions menu.
   2. Select Alternate Forms.
   3. Select a form to use to display the record.

Note: This option will be available only when there are additional forms specified for
the record on the formatcontrol and the condition(s) specified is met.

Related topics

Determining System Navigator menu options
Multiple-record functions
````
