---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.1.2.5 .. 1.1.2.6
printed_pages: 124-149
---

# 1.1.2.5 Global lists

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.2.5. Global lists

The global initer and global lists work together to generate lists for the Service
Manager system.

Global lists are stored in the system and are available to any application. Use the
global lists tool to add a combo box to a form that displays a list of values, based on a
table in your database. For example, set your combo box DisplayList value to
$G.time.zones, and the system displays a drop-down list of time zones from the tzfile
file.

The global initer builds lists of records from the database. Generally, these lists are
used to fill the drop-down lists in combo boxes on display forms. Examples of
common lists include a list of all operators in the system, all Incident categories in the
system, or all assignment groups on file.

The Startup Lists global list stores all the global lists where the build.startup field
equals true. The global list is in the listrepository file. During logon, the system checks
the listrepository entry and builds all global lists in this file. If the global list file
changes, the Startup Lists global list is marked as expired and rebuilds the next time
the lister background process runs. This updates the listrepository record.

Note: Since the lister background process doesn't run continually, there may be a
slight delay between the time a global list changes and when it appears in the
listrepository record.

The global initer consists of two parts:

     A server side element which generates and packages lists according to a user-
     defined schedule.
     A client-side requester which queries lists from the server and places them into
     client-side memory.

Lister

The background scheduler (lister) wakes up every sixty seconds to rebuild expired
lists, which are then stored in the record.

Note: Lister variables can be defined for scalar type fields only and not for array
fields.

Global initer considerations


     For performance considerations of the Service Manager server, a global list
     should contain no more than 2800 individual elements. Exceeding this limit may
     degrade the server performance.
     The total size of the globallist record, which contains the full lists, can't exceed
     the logical file limit set for the system.
     The sort field must be a key on the table which is used to generate the list.
     No matter what you set as the reset time, the server initer can only refresh the
     lists once every time its scheduler wakes up. Thus, if you have a list with reset
     time = 5 seconds and the scheduler runs every 60 seconds then the list will
     actually refresh every 60 seconds.

Returning a list to your client

Use one of the following methods to return a particular list, or set of lists, to an
Service Manager client:

     Build a list on startup.
     Configure the lists with Format Control.

Configuring lists with Format Control

Use Format Control to ask for a list only when a specific form is displayed. This
procedure is most efficient when the form defined is not displayed frequently.

Access a list record

   1. Click Tailoring > Tailoring Tools > Global Lists.

   2. Enter optional search criteria, and then click Search.

     A global list of definitions opens.

   3. To create a new list, click Add.
   4. If you edit an existing list, click Save.
   5. Click OK.

Bind a list to a form

Lists are bound to the forms they serve. The global variables are applied in Forms
Designer.

   1. Click Tailoring > Forms Designer.

   2. Type the name of the form you wish to modify in the Form field of the Forms
     Designer dialog box.


  For example, type: contact.detail.subform. This is the name of the subform
  used by problem.template.open.g , problem.template.update.g , and
   problem.template.close.g to display contact information.

3. Click Search.

  The contact detail subform opens.

4. Click Design.
5. Add a combo box with a label called Time Zones to the form, using the following

  values:

Field                                   Value
Input                                   time.zones
ValueList                               $G.time.zones
DisplayList                             $G.time.zones

   6. Wait for lister to refresh the time.zones global list, or go to the list definition
     panel ( Tailoring > Tailoring Tools > Global Lists) and reset the refresh time.

     Note: If you leave the DisplayList value blank, the contents of the ValueList will
     be used for both lists.

Build lists on startup

The Build List on Startup option, if enabled for a global list, doesn't initiate a "rebuild"
of the list at user login, but simply makes the current list available to a new logged-in
user.

Note

     Prior to version Service Manager 9.41, all global lists with the Build
     List on Startup option enabled were loaded at user login by
     applications, which might cause significant login delays. As of
     version 9.41, this functionality is optimized so that these global lists
     aren't loaded into memory unless they are needed.
     For a newly added global list, a restart of the Service Manager
     Server is required unless the name of the list variable starts with
     "$G.gl.".


If a global list has a "Filename" and "Limiting SQL" defined, to automatically rebuild
the list when something is changed in the source file, the lister background process
must be running.

A global list is rebuilt on either of these actions:

     A user clicks the Rebuild Global List option (the current and new user sessions
     get the new list)
     The lister process is running against this global list (whose expiration time must
     be in the past)

            Caution

           If you have created a Global List variable without the Build List on Startup
           option enabled, you need to manually rebuild the contents of the variable
           to make the variable ready for use. For example, if you create a global list
           $G.test without selecting the Build List on Startup option and you don't
           rebuild it manually, when you go to the RAD Debugger and type d $G.test,
           the RAD Debugger returns a NULL value.

            Tip

           To avoid memory problems, you are recommended to enable the Build
           List on Startup option only for global lists that have less than 250 items.

Use the following procedure to set the globallists record to build on startup.

   1. Click Tailoring > Tailoring Tools > Global Lists.
   2. In the List Name field, type the name of the list you want to view. For this

     example, type time.zones.

   3. Click Search.

     The time.zones file opens.
   4. Select Build List on Startup?.
   5. Click Save.
   6. Open an incident record to view the new field.

Configure lists with Format Control

   1. Determine the base name of the form, which you added to your list.
   2. Click Tailoring > Format Control.


3. Type the base name of the form in the Name field.

  For this example, create a new record for the form problem.template.update .

  Note: If you add a combo box to a subform, attach the Format Control record to
  any base form using that subform. (Do not attach the Format Control record to
  the subform itself.)

4. Click Search.
5. If a Format Control record doesn't exist for your form, create one. Click New.
6. Click Subroutines in the form, or select it from the More Actions menu.
7. Select Show Expanded Form from the More Actions menu.
8. Scroll to the first empty section and set up a Subroutine call using the following

  values:

Parameter                               Value
Application name                        apm.global.initer
Names/Values                            See next table
Before                                  true
Display                                 true

Names                                   Values          Definition
names                                   {"time.zones"}
                                                        Array of lists to be
name                                    create          moved

                                                        Action to perform
                                                        (create lists)

 9. Click Save to save changes to an existing record.

    Caution: If you are attempting to add a new record from an existing record,
    make sure that you don't click Save because doing so will replace the existing
    record with the new record. If you are adding a new record, click Add.

10. Click Add to add a new record.


This Format Control record returns the time.zones list to all incident records
displaying the Contact Detail tab, regardless of mode.

Calling the apm.global.initer several times from Format Control will not slow the
system appreciably. The system automatically keeps track of what lists are already on
the client and will not recover them unnecessarily; however, if you want the Global
Initer to reassemble the list regardless, invoke it with the refresh parameter (rather
than the create value listed in the above). called with the refresh parameter, the Global
Initer returns all the lists passed to the names array, even if they are already in client
memory.

Determine if a scheduler record exists

   1. Click Tailoring > Database Manager.
   2. Type schedule in the Form field of the Database Manager dialog box.
   3. Press Enter or click Search.
   4. Open schedule from the record list (double-click the record or click Enter). A

     blank Schedule File record is displayed.
   5. Type List Runner in the Name field.
   6. Click Search.

If a record is found, it will open for viewing and editing.

Determine if the regen cycle is realistic

   1. Click Tailoring > Tailoring Tools > Global Lists.
   2. Click Search.

     A blank record from the globallists file is displayed.
   3. Click Search.
   4. Select the list you want to regenerate from the Record list.
   5. Check the value in the Regen Every field.

Use a short time interval for lists that change frequently and a longer interval for lists
that change only occasionally.

Determine when a list was last regenerated

   1. Click Tailoring > Tailoring Tools > Global Lists.
   2. Click Search.

     A blank record from the globallists file opens.
   3. Click Search.
   4. Select the list you want to regenerate from the Record list displayed.
   5. Check the value in the Expiration field to see when the list was last regenerated.


Move a Global List to a client

To move a global list into client side memory, you call a routine called
apm.global.initer.

This routine accepts two parameters:

     An array containing the name of the lists that you want.
     A keyword, either create or refresh.

When apm.global.initer is invoked with the refresh parameter, it collects the newest
version of its list from the server, whether that list already exists in the client's
memory space. If invoked with the create parameter, it collects a list from the server
only if a copy doesn't already exist.

If you are programming in RAD, you can invoke apm.global.initer directly from your
code. If you are using the Global Initer to fill combo boxes for display on a form, you
can invoke the Global Initer as a subroutine using Format Control for the format in
question.

Regenerate all lists

If none of the troubleshooting steps to this point have succeeded in regenerating your
list, you should regenerate all the lists in the system. This procedure makes all the lists
in the system obsolete and enables you to update the entire file.

   1. Click Tailoring > Database Manager.
   2. Select Administration Mode.
   3. Type apm.global.list.entry in the Form field.

   4. Click Search.

     A blank search form from the globallists file opens.

   5. Click Search to display a list of lists.
   6. Click Mass Update.

   7. Click Simple Update.

     A blank form opens. This form is identical in appearance to the lister record, but
     contains different option buttons.

   8. In the Expiration field, change the date to any date in the past. You can either
     type the date and time, or select a date from the calendar.

   9. Click Execute.


     The expiration date of all the lists in the globallists file is reset.

 10. Return to the home menu.
 11. Type *aapm.server.initer in the command line.
 12. Press Enter.

 13. Log off Service Manager, and then log back on.

     All the lists in the system are regenerated whether they are actually obsolete.

Regenerate obsolete lists

If you perform all the troubleshooting steps and the system still doesn't display the
most current version of your list, regenerate all the obsolete lists in the system. For a
large system with numerous obsolete lists, this procedure may take a few minutes.

You can change the expiration date of a list to a date in the past prior to regenerating,
in order to force regeneration.

Note: If the expiration date of your list has not passed, the list will not be flagged as
obsolete, and therefore not regenerated.

To regenerate obsolete lists:

   1. Type *aapm.server.initer in the command line.
     Running this application will force the system to regenerate all obsolete lists.

   2. Log off Service Manager, and then log back on.

Start the server side component of the global initer

The server side component of the Global Initer consists of a routine called
apm.server.initer. A background scheduler called lister has been defined to run
apm.server.initer.

If lister did not start with the system:

   1. Click System Status on the System Navigator.

     The System Status utility opens.

   2. Click Start Scheduler.

   3. Double-click lister.startup.

     Every sixty seconds, lister checks and refreshes any global lists that have
     passed their reset time.


See a complete list of all the global lists on my
system

   1. Click Tailoring > Tailoring Tools > Global Lists.
   2. Click Search.

     A blank search form from the globallists file is displayed.
   3. Click Search.

     A list of all the global lists opens. You can scroll through the complete list of
     records.

Verify lister status and configuration

   1. Click System Status in the System Navigator.
   2. Check to see if lister appears in the list of processes running on your system.
   3. If lister in not on the list, click Start Scheduler.
   4. Double-click lister.startup in the Startup Record list to start the program.

     Note: Double-click startup to start all processes.

View changes to a list

   1. Click Tailoring > Tailoring Tools > Global Lists.
   2. Click Search.

     A blank record from the globallists file is displayed.
   3. Click Search.
   4. Select the list you want to view from the Record list.
   5. Check that the changes appear.


1.1.2.6. Record tag localization utility

The record tag localization utility allows for the localization of fields used to identify
records in a given table. Users may use this feature to translate such tags so that they
display in their appropriate translations when a user logs into a localized version of
Service Manager. This allows the fields to appear in the language of the session
associated with the user rather than in their true saved form

Related topics

Localization process
Codes
Message maintenance with record tag localization


1.1.2.6.1. Localization process

Before you begin the localization process, make sure that all desired languages are
activated in the language table.

The localization process consists of four steps:

     Enabling the table for tag localization by modifying the corresponding data
     policy record.
     Updating all corresponding message records to contain the correct translations.
     Creating global lists for the table that utilize these message records.
     Invoking the localization utility to define the fields that will use these new global
     list values.

Related topics

Accessing and localizing message records for a codes-based global list
Invoking the localization utility
Enable a table for tag localization
Create localized global lists


1.1.2.6.1.1. Enable a table for tag
localization

To enable a table for localization:

   1. Access the data policy record for the table.
   2. On the General tab, check the Localized Table checkbox, which then makes the

     Localized Tag Field available.
   3. Set Localized Tag Field to the name of the field whose values you wish to

     localize. This provides the localized record tag.
   4. Save your changes.

For example: Use the following inputs to enable localization for the name field in the
category table.

Field Name                              Value
Localized Table                         checked
Localized Tag Field                     name

Wait for the lister process to rebuild the localizedTables global list. When this is done,
view the global list to ensure that it includes the table you enabled for tag localization.

Related topics

Localization process
Data Policy
Global lists
Accessing and localizing message records for a codes-based global list
Invoking the localization utility
Access Data Policy
Create localized global lists


1.1.2.6.1.2. Access and localize message
records

Once localization is enabled, message records for each active language are created
for every existing record in the table. If English and French are enabled for your
system, then English and French message records exist for every category record
once the category table is marked for localization. These messages contain the
following values:

     Class: local:<TABLE>, where <TABLE> refers to the name of the table.
     Message ID: <UNIQUE>, this refers to the values that make up the unique key
     of the record.
     Text: <LOCALIZED VALUE>, this refers to the value of the localized field. This is
     the value that needs to be modified to contain the correct translation.

To access and localize these message records:

   1. Access the table itself and bring up a record.

   2. Click More or the More Actions icon and then select View Localized Record
     Tags. This lists every message that corresponds to the record.

     Note: The View Localized Record Tags action is available only for enabled tables
     that utilize the db.view displayscreen. To make this option available for a table
     that uses a different displayscreen, you need to create a similar displayoption
     record for that displayscreen.

   3. Drill into each message record and modify the Text field so that it contains the
     correct translation for the localized field.

   4. Repeat these steps for the remaining records in the table.

Related topics

Localization process
Accessing and localizing message records for a codes-based global list
Message maintenance with record tag localization
Enable a table for tag localization
Create localized global lists
Invoking the localization utility


1.1.2.6.1.3. Create localized global lists

The record tag localization utility makes it possible to localize a query-based list. You
can use this utility to localize lists that are defined by a query.

To localize a query-based global list:

Note: You must sign out and then sign in again for the global list change to take
effect.

   1. Create or access an existing global list record that's based on the Limiting SQL
     field.

   2. Check Use Localized Values?.
   3. Ensure that List Variable and Display Variable are set to different variable names.
   4. Save your changes.
   5. Wait for the lister process to build the list.

Example: use the following inputs for Global List Definition:categories.active to return
a list of all active categories.

Field Label                             Value
List Name                               categories.active
Build List on Startup?                  checked
List Variable                           $G.categories.active
Display Variable                        $G.categories.active.local
Limiting SQL                            active=true or active=NULL
Use Localized Values?                   checked

After the list is built, the localized lists for all active languages display in the table
under the Value List field on the Global List Definition form.

These lists are based on the contents of the message records that were updated in
Accessing localizing message records (Accessing and localizing message records for
a codes-based global list). The display variable will be bound to the display list for the
language associated with the user session.


Related topics

Localization process
Global lists
Accessing and localizing message records for a codes-based global list
Creating localized codes-based global lists
Enable a table for tag localization
Associate a field with a codes-based global list


1.1.2.6.1.4. Invoking the localization utility

Once the global lists are defined and built, you may invoke the localization utility to
define the format fields to utilize the global lists.

Note: To access the localization utility, click Tailoring > Localization Utility.

The localization utility is comprised of the following fields:

     Table Name: the table containing the fields you wish to localize.
     Field Name: a list of fields to localize.
     Global List: a list of global lists to be bound to those fields.
     Formats: a list of formats on which to apply each field-global list association.

Example: Use the following inputs to bind the Category (category) field in the
probsummary table to the categories.active global list created in Create localized
global lists. This example is set up to take effect on the IM.update.incident format.

Field Label                             Value
Table Name                              probsummary
Field Name                              Category
Global List                             categories.active
Formats                                 IM.update.incident

After defining your requirements, you must save the record and click More or the
More Actions icon and then select Run Localization Utility to run the utility.

The localization utility:

     Updates the corresponding data policy record so that each specified field is set
     to the associated global list in the Global List field.
     Updates all the listed formats containing these fields to use the display list
     values of the associated global list.

The Messages pane of the localization utility screen displays a list of the updated
data policy record and all updated formats.

Note: Once the formats are updated by the localization utility, removing them from the
Formats list and rerunning the utility does not reverse the changes. The utility is


designed to be a one-way process so any reversions need to be made manually
inside Forms Designer. Likewise, all data policy changes are not reversed and will
need to be reverted manually.

Once the localization process completes, all the defined fields should appear
localized when displayed using one of the converted formats. Instead of English, they
display in the language associated with the user session.

Related topics

Localization process
Global lists
Accessing and localizing message records for a codes-based global list
Enable a table for tag localization
Create localized global lists
Associate a field with a codes-based global list


1.1.2.6.2. Codes

The codes table is a repository for storing user-defined values that you wish to
localize. Enabled for localization, codes leverage the record tag localization utility and
may be used for localizing lists of codes or status values. It offers an alternative to
defining localized user-defined global lists without the difficulties of having to
hardcode and to maintain the values inside the global list definition record.

To access codes, click Tailoring > Codes.

Codes are comprised of the following fields:

     Type: a name by which to classify a set of values.
     Value: a value to be localized.
     Sort Order: a number indicating the sort order of this value.

Related topics

Defining a set of values for a codes-based global list
Accessing and localizing message records for a codes-based global list
Creating localized codes-based global lists
Associate a field with a codes-based global list


1.1.2.6.2.1. Defining a set of values for a
codes-based global list

When defining a set of values, a record needs to be created for each value and must
be assigned to the same type.

For example: Use the Codes function to create (define) a series of codes for the
Boolean values true and false.

Type                                    Value
Boolean                                 false
Boolean                                 true

Once all the codes are defined, proceed to Accessing and localizing message records
for a codes-based global list of the localization process.

Related topics

Accessing and localizing message records for a codes-based global list
Creating localized codes-based global lists
Codes
Associate a field with a codes-based global list


1.1.2.6.2.2. Accessing and localizing
message records for a codes-based
global list

As with any table that's enabled for localization, the corresponding messages may be
accessed from each codes record by clicking More or the More Actions icon and then
selecting the View Localized Record Tags.

Once all the messages are updated to contain the correct translations, proceed with
Creating localized codes-based global lists.

Related topics

Creating localized codes-based global lists
Codes
Message maintenance with record tag localization
Defining a set of values for a codes-based global list
Invoking the localization utility


1.1.2.6.2.3. Creating localized codes-
based global lists

To define a global list for a set of codes, the global list definition must contain the
following values:

     List Field: value
     Filename: codes
     Limiting SQL: type="<TYPE>", where <TYPE> refers to the type of codes you
     wish to localize.

In addition, you must:

     Check the Use Localized Values? checkbox.
     Ensure the List Variable and Display Variable fields are set to different variable
     names.
     Wait for the lister process to build the list.

Example: use the following inputs for Global List Definition:Boolean Values to create a
localized list of Boolean Values.

Note: that the example references records that were created in the example found in
Defining a set of values for a codes-based global list.

Field Label                             Value
List Name                               Boolean Values
Build List on Startup?                  checked
List Variable                           $G.booleans
Display Variable                        $G.booleans.local
Limiting SQL                            type="Boolean"
Use Localized Values?                   checked

Related topics


Defining a set of values for a codes-based global list
Codes
Global lists
Accessing and localizing message records for a codes-based global list
Associate a field with a codes-based global list
Create localized global lists


1.1.2.6.2.4. Associate a field with a codes-
based global list

To associate a field with a codes-based global list, you map the field to the global list
in the same way you would with any other list.

Example: In the localization utility, use the following inputs to bind the Visible to
Customer (cust.visible) field to the Boolean Values global list. It will take effect on the
probsummary.qbe.g format.

Field                                   value
Table Name                              probsummary
Formats                                 probsummary.qbe.g

Use the following values for the Field Name and Global List entries.

Field Name                              Global List
Visible to Customer                     Boolean Values

As a result of this operation, when you display a list of incidents, the column values
for cust.visible appear localized if the probsummary.qbe.g format contains that field.

Related topics

Codes
Defining a set of values for a codes-based global list
Accessing and localizing message records for a codes-based global list
Creating localized codes-based global lists Create localized global lists
Enable a table for tag localization


1.1.2.6.3. Message maintenance with
record tag localization

The messages utilized by the localization process are maintained in the following
manner:

     If a record is added to the localized table, corresponding message records are
     created for it.
     If a record in the localized table is updated so that the localized field is changed,
     its message records are deleted and recreated to reflect this. The Message ID of
     the new message records contains the new unique ID and the Text field is set to
     the new localized tag field value.
     If a record is deleted from the localized table, its message records are removed
     from the system.
     If the data policy for a localized table is deleted, all corresponding message
     records are removed from the system.
     If an enabled table is then disabled for localization, all corresponding message
     records are removed from the system.

Update message records for activated or
deactivated languages

If a language is made active, new message records don't get created for it. However,
rather than having to create these records from scratch you can perform the following
steps.

To update messages for activated languages:

   1. Access the data policy record for each localized table.
   2. Click More or the More Actions icon and then select Update for Active

     Languages.
     This creates message records for every active language that don't already exist.
   3. Ensure that the new messages are properly translated.
   4. Rebuild all applicable global lists to reflect the new changes.

Any languages that are deactivated or activated after launching the localization
process aren't automatically accounted for. If a language is made inactive, none of
the corresponding message records are removed. The records are left in the system
in case the language is reactivated in the future. Hence, they will need to be manually
deleted if desired.


Related topics

Record tag localization utility
Localization process
````
