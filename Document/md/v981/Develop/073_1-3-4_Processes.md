---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.3.4 .. 1.3.6
printed_pages: 1936-1958
---

# 1.3.4 Processes

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.3.4. Processes

Processes are the smallest discrete units of work available to the Document Engine and are the level where
the data is manipulated. Users can create their own Process or use one of the over 700 Processes that ship
with Service Manager. The Process definition consists of initial expressions, RAD, and final expressions,
entered on the Initial Expressions, Initial Javascript, RAD, Final Expressions, Final Javascript, and Next
Process tabs, as well as an optional call to a next Process. Expressions are written using standard RAD
expressions and/or JavaScript.


1.3.4.1. Create and modify a Process

To create a Process, follow these steps:

   1. Access the Document Engine. See the Accessing the Document Engine section in Document Engine
     overview

   2. Using the tabs on the Process panel, fill in the fields required to create a Process that will perform the
     functions you desire. See Process Definition form and field descriptions for more information.

To modify a Process, follow these steps:

   1. Access the Document Engine. See the Accessing the Document Engine section in Document Engine
     overview

   2. Enter the name of the Process you want to modify in the Process Name field or click Search to search
     for the Process.


1.3.4.2. Process Definition form and field
descriptions

On the Process Definition form, you define new Processes or edit existing Processes. Processes run code
or expressions to perform the user selected actions

The field descriptions for the Process Definition form are:

Field Name                              Description
                                        Specifies the name of the process. (required)
Process Name
process

Save Cursor Position                    Select this box if you want to return to the same
save.cursor.position                    cursor position after the action (for example on a
                                        fill).

Run Standard Process when complete?     When selected, then the system runs a standard
run.standard                            process after completing the current action or
                                        Process. A standard Process such as save, for
Run in Window?                          example. If you have created a save Process and
run.in.window                           want to run the save Process that comes with the
                                        Document Engine after completing the save
                                        process you defined, check this box. A standard
                                        process is defined in the base functions sections
                                        of this document.

                                        When selected, the process runs in a separate
                                        window.

Window Title                            If the Run in Window? checkbox is selected,
window.name                             specify a title for the window. An scmsg
                                        expression can be used for localized window
                                        titles, such as scmsg(1980, "us").

In addition to the fields described above, there are also tabs on this form that allow you to further define the
Process. These tabs are:

     Initial Expressions tab
     Initial Javascript tab
     RAD tab
     Final Expressions tab
     Final Javascript tab
     Next Process tab


Initial Expressions tab

The Initial Expressions tab defines the initial expressions that run prior to the initial Javascript and prior to
the RAD calls defined on the RAD tab. The initial expressions are written using standard Service Manager
expressions.

Initial Javascript tab

The Initial Javascript tab defines the initial javaScript expressions that run before the RAD defined on the
RAD tab.

RAD tab

The RAD tab defines the pre-RAD expressions, RAD calls, and post-RAD expressions that run as part of the
Process.
The field descriptions for the RAD tab are:

            Note

           These fields are repeated for each RAD application defined on this tab.


Field Name                              Description
Expressions evaluated before RAD call
pre.rad.expressions                     Specify the expression to run prior to the RAD
                                        application defined in the RAD Application field.
RAD Application                         All parameter values passed to the RAD
application                             application must be in the form of variables or
                                        expressions. The variables must be assigned their
                                        values in the pre-RAD expressions; for example,
                                        $L.value.name="Test" .

                                        Specifies the name of the RAD application to run.

Condition                               Specify under which circumstances the RAD
rad.condition                           application should be executed (condition
                                        evaluates to true) or skipped (condition evaluates
Parameter Names                         to false).
names
                                        Specifies the parameter names passed to the
                                        RAD application

Parameter Values                        Specifies the parameter values passed to the RAD
values                                  application. These values must be in the form of
                                        variables or expressions. String values can be
Post RAD Expressions                    passed when enclosed in double quotes ( "Wizard
post.rad.expressions                    Name").

                                        Specifies any RAD expression that will run after
                                        the RAD application completes.

Final Expressions tab

The Final Expressions tab defines the final expressions that run after the RAD tab processing completes.
The final expressions are written using standard Service Manager expressions.

Final Javascript tab

The Javascript defined on this tab runs after the final expressions and after the RAD applications on the
RAD tab.

Next Process tab

This tab specifies the next Process or Processes to run when the current Process completes.

The field descriptions for the Next Process tab are:

 Field Name                                                                                      Service Manager 9.81

 Next Process                           Description
 next.process                           Specifies the name of the next Process to run.

 Condition                              Specifies a condition associated with the Process
 process.condition                      in the Next Process field that evaluates to true or
                                        false. For example, true for the sm.close
Contents                                Process.

     1 Initial Expressions tab
     2 Initial Javascript tab
     3 RAD tab
     4 Final Expressions tab
     5 Final Javascript tab
     6 Next Process tab


1.3.5. Document Engine resources

The Document Engine includes local variables and base functions that can be used by any Object. The
base functions are defined out-of-box to execute standard actions that are available to the user. For
example, when a user clicks the save button after updating a record, the Document Engine processes this
request and writes the changes to the database. A base function can be overwritten in the State record to
run a different Process.


1.3.5.1. Database Manager

Any file accessed by the Database Manager automatically uses the rules and processes defined for the
corresponding Object. If no Object has been defined for the file, it uses the DEFAULT Object. The DEFAULT
Object duplicates the functionality of the earlier versions of the Database Manager.

A System Administrator may also access a file that has a corresponding Object via the DEFAULT Object by
accessing the file through Database Manager with the “Administration Mode” checkbox marked. This
checkbox is available for System Administrators only.

The Document Engine uses environment profiles. In previous versions of the system, a System
Administrator was granted all rights (add, update, delete.), regardless of the format control settings. With
the Document Engine, the rights granted match those defined in the format control record. Administrators
that prefer the old method of granting rights can simply modify the “Profile Application” setting in the
DEFAULT Object record from “db.environment” to “db.environment.sysadmin”.


1.3.5.2. RAD applications

With a database driven application, a user may be working with any of the following three basic record
sets:

     Zero records – when searching for information.
     Many records – when looking at a list of information.
     One record – when making changes to a single record.

From a user perspective when working with data:

     you either view a blank form, where you can enter search information (or create a new record),
     or you are working on updating / viewing a single record,
     or you did a search and now have a set of multiple records displayed as a list.

The Document Engine uses three main RAD applications to mirror this idea. The RAD routine used is
determined by the number of records displayed at any time.

se.search.engine

The search engine is used when there are no records being viewed. The main purpose of this routine is to
formulate a query and select records from the correct table. This routine may also be used for the initial
entry of information into a blank record for the purpose of adding a new record to the database. The
Default State is db.search.

se.list.engine

The list engine displays multiple records. Using the list engine a user may select a specific record from the
list, or perform actions on the entire list of records. Default State is db.list.

se.view.engine

The view engine displays a single record. This application is used to perform actions against a specific
record, such as updates or deletes. Default State is db.view.

            Note

           When using Service Manager’s record list functionality, the view engine is used for both the list
           and single record information.


1.3.5.3. RAD applications flow

The following figure provides an overview of how the other tailoring tools interact with the Document
Engine.

Note

All RAD applications related to the Document Engine start with "se", such as se.view.engine.
The document engine treats every record as a document made available to the user.

When a file is displayed using the Document Engine it will always be using one of the three applications
specified earlier in this document. The display screen, display options, and format are determined by the
current State of the record. When a display option is triggered, after the standard display functionality is
performed, the engine checks the “action” of that option against the available processes defined in the
current State record. If there is a process defined that has a condition that evaluates to true, the engine
then performs that process against the current record (or record set). If the action is undefined in the State
record, the engine will then check to see if that action is defined as a “Base Process” in the current
application. If it is, then the system will perform that base process against the record. If not, no action is
taken.

Integration tips for display application

If a display screen doesn't have any display events associated to it, the system automatically uses the
se.default display event that performs se.lock.object in case of “OnFormModified”.

If a display option record has the “Modifies Record” checkbox activated, the record is locked when the
button is pressed.


Contents

     1 Integration tips for display application


1.3.5.4. Base functions in se.search.engine

 Display Action                                                                                  Service Manager 9.81
 back
 find                                   Description
 fill
 advanced                               Exits the record.

 clear                                  Displays detailed information from the record
 openinbox / inbox                      linked to the field.
 search
 add                                    Fills information from a linked record into a target
 restore                                record. Puts data from a source record field into a
 irquery                                target field.
 validitylookup
                                        Starts the Advanced Search process that gives
 expandarray                            the user more search options. Typically, this is
 reset                                  only available for system administrators, but this
 regen                                  option can be made available to other users.

This PDF was generated on May 23, 2026  Clears the current screen.

                                        Prompts the user to open a view associated with
                                        the current file. This is a predefined query that
                                        displays results as a view.

                                        Performs a standard search by creating a search
                                        query using the information provided and then
                                        displays the results in a record list.

                                        Performs “add” format control and attempts to
                                        add a record to the database.

                                        Restores the contents of the screen (after a
                                        “clear” is performed).

                                        Runs an IR Query text search.

                                        Performs Service Manager validity lookup. Validity
                                        lookup verifies via an entry in the validity table
                                        that a specific value is valid for the defined field.
                                        Using validity lookup, the system verifies that a
                                        user-entered value complies with the validation
                                        rules.

                                        Expand array provides additional functionality for
                                        editing arrays, such as insert line and delete line.

                                        Resets the current file. This action deletes ALL
                                        records in the database for the table.

                                        Regens the indexes of the current file. This action
                                        applies only to tables that have an IR Key, and it
                                        will perform only an IR regen.

                                                                                                                           Page 94 of 200
Display Action                                                                                   Service Manager 9.81
export/unload
                                        Description
views                                   Starts the “no records” export/unload process.
                                        Used for unloading empty DBDICT definitions
findrevision                            without data only.
initrevision                            When selected, the system presents to the user a
newsite                                 list of alternate forms in which to display the
newview                                 current record.
newTable                                Displays revisions for records in this object.
addFilter                               Creates a revision of a record in this object.
editFilter
addCompound                             Triggered by customer performing an Advanced
removeSelection                         Filter search in the standard search screen.
                                        Triggered by customer performing an Advanced
                                        Filter search in the standard search screen.
                                        Triggered by customer performing an Advanced
                                        Filter search in the standard search screen.
                                        Triggered by customer performing an Advanced
                                        Filter search in the standard search screen.


1.3.5.5. Base functions in se.view.engine

 Display Action                                                                                  Service Manager 9.81
 save
 add                                    Description
 ok
 reselect                               Performs update in Format Control and updates
 fill                                   the record in the database if the update is valid.

 find                                   Performs add in Format Control and adds a new
 next                                   record to the database if the new record is valid.
 previous
 back                                   If the record has changed, perform a save,
 menu                                   otherwise exit.
 delete
                                        Re-selects the current record from the database
 views                                  (in case it was changed).

 print                                  Fills information from a linked record into a target
 printlist*                             record. Puts information from a source field into a
 validitylookup                         target field.

 export/unload                          Displays detailed information from the record
                                        linked to the field.
This PDF was generated on May 23, 2026
                                        Move to next record in the list (after checking for
                                        changes).

                                        Move to previous record in the list (after checking
                                        for changes).

                                        Exit to list or search form.

                                        Exits to the calling menu.

                                        Performs delete Format Control and attempts to
                                        delete record from the database after validating
                                        the request.

                                        When selected, the system presents to the user a
                                        list of alternate forms in which to display the
                                        current record.

                                        Prints the current record.

                                        Prints the current list of records.

                                        Performs Service Manager validity lookup. Validity
                                        lookup verifies via an entry in the validity table
                                        that a specific value is valid for the defined field.
                                        Using validity lookup, the system verifies that a
                                        user entered value complies with the validation
                                        rules.

                                        Standard Service Manager export/unload
                                        functionality (multiple record).

                                                                                                                           Page 97 of 200
 Display Action                                                                                  Service Manager 9.81
 massunload*
 massadd*                               Description

 massupdate*                            Provides unload functionality for a list of records.
 massdelete*
 irquery                                Adds a new set of records that exactly duplicates
 expandarray                            an existing set of records except that new set of
 count*                                 records will have a unique key value updated with
 audithistory                           new data. At the end of the processing there will
                                        be twice as many records in the table.
 inbox.save / inbox*
 approval.log                           Provides the same updates to a set of specified
 alert.log                              fields in a list of records.
 alerts
 pagelist / listpages                   Deletes a specified set of records from a table.

 clocks                                 Runs an IR Query text search.
 xmlfill
 createTemplate                         Expand array provides additional functionality for
                                        editing arrays, such as insert line and delete line.
This PDF was generated on May 23, 2026
                                        Counts records in the record list and displays the
                                        total count.

                                        Calls the standard audit history routine. The audit
                                        history is determined by the fields to audit as
                                        defined in the auditdef table.

                                        Saves the current query as a view.

                                        Views the approval history for the current record.

                                        Views the alert history for the current record.

                                        Views the current and scheduled alerts for the
                                        current record.

                                        The page list shows a complete history of a
                                        record. When paging is enabled, every time an
                                        update is performed, a copy of the record is
                                        written to the page file. The page list shows the
                                        complete history of a record based on the paging
                                        file.

                                        Displays clock records associated with this
                                        record.

                                        Handles XML fields, such as the user options in
                                        Service Catalog.

                                        Creates a Template record out of the current
                                        record.

                                                                                                                           Page 98 of 200

Display Action                          Description
applyTemplate                           Applies an existing Template to the current record.

Note

* These commands only apply if the record list functionality is being used.


1.3.5.6. Base functions in se.list.engine

Display Action                          Description
exit (or back)
inbox.save / inbox                      Returns to the search (or calling) form.
count
refresh                                 Prompts the user to save the current query as a
big.green                               new view.
print
views                                   Performs standard count functionality and
                                        displays the total record count.
export/unload
massadd                                 Refreshes the list using the current query.

massupdate                              Completely exits the current module. “Big Green
massdelete                              Arrow”

                                        Prints the list of records displayed.

                                        When selected, the system presents to the user a
                                        list of alternate forms in which to display the
                                        current record.

                                        Standard Service Manager export/unload
                                        functionality (multiple records).

                                        Adds a new set of records that exactly duplicates
                                        an existing set of records except that new set of
                                        records will have a unique key value updated with
                                        new data. At the end of the processing there will
                                        be twice as many records in the table.

                                        Provides the same updates to a set of specified
                                        fields in a list of records.

                                        Deletes a specified set of records from a table.


1.3.5.7. Local variables

Local variables begin with $L. and persist only within the currently executing RAD application. The server
cleans up local variables automatically when it exits a RAD application.
The following is a list of Standard Variables used with the Document Engine:
$L.action - the display action value from the display option
$L.bg - Background flag
$L.category - The category record (if available)
$L.env - The current environment record
$L.exit - internal exit parameter
$L.file - The current file variable
$L.file.save - A copy of the record in its original state
$L.format – name of the format used to display the record
$irspread – determines the IR discovery options: 0=shallow search, 2=deep search, 4=complete match
$L.mode – the mode the viewed record is in, typically add to create a new record, update to modify an
existing record or close to finish processing of an existing record
$L.mult - Flag that's true if there are multiple records in the $L.file variable
$L.object - The object record
$L.phase - The phase record (if available)
$L.sql or $L.query- the current query
$L.sort - the current sort order
$L.state – The state record the system is using (=the state the record is in).
Variables that are available in View mode (when viewing a single record)
$L.fc – copy of the detail FormatControl record
$L.fc.master – copy of the master FormatControl record


1.3.6. Detect issues when using the Document
Engine

To successfully detect the issues when using the Document Engine, you need to gather the following
information:

     What dbdict and Object is being used
     What State is the record in
     What's the Process being called
     Steps followed to reproduce (STR) the problem

Research application path through the Document Engine

To detect the issues when using the Document Engine, enter RTM:3 and debugdbquery:999 in the
Service Manager sm.ini file and then start a new client connection. Unless this user process is the very first
to invoke the Document Engine processes to debug, it may not show the selection of the State or Process
records in the sm.log file when doing this trace, but it will give helpful hints as to which Process was being
invoked.

Find dbdict or Object used

To determine which dbdicts or Object is being used, search the log file.

Log sample:

1320 07/18/2006 11:00:36 RADTRACE 20 [ 1] se.get.object get.object select CPU( 0 1411 )

1320 07/18/2006 11:00:36 (0x0129AC08) DBACCESS - Cache Find against file Object found 1 record,
query: file.name="pcsoftware"

1320 07/18/2006 11:00:36 RADTRACE 20 [ 1] se.get.object set.access process CPU( 0 1411 )

Find State for the records

The next question to look at is which State the record is in. To find that information, search for the following
in the trace sm.log:

Log sample:

1320 07/18/2006 11:00:48 RADTRACE 10 [ 1] se.get.state select.state select CPU( 0 1491 )

1320 07/18/2006 11:00:48 (0x01292FB0) DBACCESS - Cache Find against file States found 1 record, query:
state="pcs.list"

1320 07/18/2006 11:00:48 RADTRACE 10 [ 1] se.get.state exit.normal process CPU( 0 1491 )

Find the name of the Process

The name of the Process can be found as well, by searching in the sm.log containing the trace shown in the
following example.

Log sample:

1320 07/18/2006 11:00:50 RADTRACE 20 [ 1] se.call.process select.process select CPU( 0 1542 )

1320 07/18/2006 11:00:50 (0x00B56810) DBACCESS - Cache Find against file Process found 1 record,
query: process="upgrade.pcs"


1320 07/18/2006 11:00:50 RADTRACE 20 [ 1] se.call.process run.pre.exp process CPU( 0 1542 )

Research application errors

Processes call a number of RAD applications and execute a number of expressions, with a possibility of
invoking more Processes afterwards. If any of the applications or expressions caused an error exit due to
wrong syntax or wrong logic, this information can be found in the sm.log file.
Log sample:

  Process panel run.pre.exp in RAD se.call.process encountered error in line 1
  (se.call.process,run.pre.exp)
  Cannot evaluate expression (se.call.process,run.pre.exp)
  Cannot evaluate expression (se.call.process,run.pre.exp)
  Bad arg(2) oper = (se.call.process,run.pre.exp)
  Cannot evaluate expression (se.call.process,run.pre.exp)
  Cannot evaluate expression (se.call.process,run.pre.exp)
  Bad arg(2) oper = (se.call.process,run.pre.exp)
  Cannot evaluate expression (se.call.process,run.pre.exp)
  Bad arg(2) oper nullsub (se.call.process,run.pre.exp)
  Cannot evaluate expression (se.call.process,run.pre.exp)
  Bad arg(2) oper in (se.call.process,run.pre.exp)
  Cannot evaluate expression (se.call.process,run.pre.exp)
  Unrecoverable error in application: se.search.objects on panel call.list.engine
  Unrecoverable error in application: se.list.engine on panel call.process.1
  Unrecoverable error in application: se.call.process on panel run.pre.exp

In this example (not out-of-box), the error occurred in se.call.process, run.pre.exp, or in other words, while
evaluating the initial expressions of the Process. To find out which Process was causing the issue, go
through the steps outlined above and note the process from the line:
DBACCESS - Cache Find against file Process found 1 record, query: process="upgrade.pcs"
Go to the Process record by the name of upgrade.pcs and check for any statements on the initial
expressions tab. In this specific case, the expression will include the word nullsub. For example, the
expression in question for this test may be
$L.icount=nullsub($L.icount, anynumberIwant)
The variable, anynumberIwant, is not a valid field, literal or variable, so it will have to be changed to prevent
this issue.

Print values of variables or results of expressions

In the Document Engine, the path through a work flow is often determined by the value assign to a field or
variable. To determine the value assigned to a field or variable that influences the work flow, use the
JavaScript print() function or use the log rtecall ($L.void=rtecall("log", $L.rc, "message" ) in the RAD
expressions. The message can be a concatenated string such as

  $L.message="The value of $L.test is " + $L.test

where $L.test is a variable that was assigned a character value.
````
