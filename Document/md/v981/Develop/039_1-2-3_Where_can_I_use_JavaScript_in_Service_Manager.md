---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.2.3 .. 1.2.4.1
printed_pages: 1058-1093
---

# 1.2.3 Where can I use JavaScript in Service Manager?

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.3. Where can I use JavaScript in
Service Manager?

JavaScript can be used in several places throughout Service Manager. These areas
focus on providing maximum flexibility for users to tailor their environment through
the use of JavaScript in Service Manager.

            Note

           It is a best practice that you store JavaScript in the ScriptLibrary and refer
           to it from other places.

You can use JavaScript in these places in Service Manager.

     Cascade updates
     Display Screens
     Display Options
     Format Control
     Interoperability (the ioaction table)
     Links
     Processes (Document Engine)
     ScriptLibrary
     Scripts
     Triggers
     Wizards


1.2.3.1. What's the ScriptLibrary?

The ScriptLibrary is a file within Service Manager used to create, edit, compile, test,
and store scripts and functions. Service Manager can call and execute these scripts
and functions from anywhere within the system. The ScriptLibrary contains
JavaScript created by users. It's a central place for you to create, edit, compile, test,
and store scripts and functions.

You can use some of these stored JavaScript programs to interface with third-party
Web Services providers, such as real-time currency conversions. All these JavaScript
are identified as SOAP packages within the ScriptLibrary. Integrations are typically
performed through JavaScript stored in the Script Library as well.

            Note

           Do not use Administrative Mode when entering the ScriptLibrary because
           functions such as compile and execute aren't available in that mode.

You can access any script or function in the ScriptLibrary from any of the locations in
Service Manager that support JavaScript. To call one of these functions, use one of
the following statements:

system.library.<scriptname>.<functionname>( parameters )

or

lib.<scriptname>.<functionname>( parameters )


1.2.3.1.1. ScriptLibrary editing environment

The maximum size of a script allowed in the ScriptLibrary is 256K. The color codes
that the script editor uses are:

     Red: Keywords.
     Green: Objects, methods, and properties as well as function names.
     Teal: Comments.
     Magenta: Curly braces, operators, punctuation characters.
     Black: Default color.


1.2.3.1.2. Calling a function in the
ScriptLibrary

ScriptLibrary records contain functions that can be called from anywhere you can call
JavaScript. Using this technique allows for more effective management of user
JavaScript functions. Functions can use parameters as part of the calling structure,
and they can also return values.
First, you must establish a record in the ScriptLibrary that contains the function to be
called. Within the record you must know the name of the script as well as create a
properly-constructed function.

            Note

           A record can contain more than one function.

This is an example of using more than one function.

  /* Sample script lib.functionTest */
  function square(value)
  {

                 var ret_val = value * value;
                 return ret_val;
  }
  function cube(value)
  {
                 var ret_val = value * value * value;
                 return ret_val;
  }

To call the function use the following syntax:

  lib.<script name>.<function name>(<Comma separated list of
  parameters>)

The following is an example of calling the functions of lib.functionTest:


  var x = 3;
  var y = lib.functionTest.square(x);
  print(x, " squared = ", y);
  x = -2;
  y = lib.functionTest.square(x);
  print(x, " squared = ", y);
  x = 2;
  y = lib.functionTest.cube(x);
  print(x, " cubed = ", y);
  /*
  The function calls produce the following output:
  3 squared = 9
  -2 squared = 4
  2 cubed = 8
  */

When working with the ScriptLibrary, you can compile the JavaScript code to check
for syntax errors. Executing the script will compile the code and then run it. Before
executing the code, ensure that all inputs are available.
You can access any script or function in the ScriptLibrary from any tool within Service
Manager that supports JavaScript, by using the following syntax:

  lib.<scriptname>.<functionname>( parameters )

Within a ScriptLibrary record, you can call any function that's defined previously
within the same record by simply typing:

  <functionname>( parameters )

To call JavaScript from any RAD process panel, you can use the jscall RAD function.
The syntax for this function is:

  jscall( "script.function" , arg1 , arg2, ... , argN )

The following statements illustrate a JavaScript call to the system library and a call to
the script library by using jscall(), respectively:


  lib.tzfunctions.getTZforOperator(“falcon”);
  jscall("tzfunctions.getTZforOperator", “falcon”);

To call a JavaScript function from the operating system's command prompt, you can
use the us.js.call RAD routine. The syntax for the command is:

  sm us.js.call script.function arg1 arg2

As an example, the following command calls the
UpdateAllInteractions.updateInteractionFields function, which needs the {"abc",
"def"} arguments:

  sm us.js.call UpdateAllInteractions.updateInteractionFields
  {\\\"abc\\\",\\\"def\\\"} NULL


1.2.3.1.3. Example: Function to control
close button label in Change Management

Change Management uses the getCloseLabel() function to control what label to
display on the Close button. The labels are Close Task, Close Change, or Close
Phase. Included in this function is code to process a special case, Unplanned
Changes, in the out-of-box system. This code can serve as an example for
Administrators who need to customize the Close button label for other special cases.

The function is getCloseLabel(filename, currentPhase, file) in the ScriptLibrary file
changeManagement. The details are as follows:

     function getCloseLabel(filename, currentPhase, file)
     filename: name of the table we are currently on, cm3r for Change record, cm3t
     for Task
     currentPhase: current phase of the change or task
     file: the file record

This function is currently called from the cm.view.display display screen.

Example:
$L.close.label=jscall("changeManagement.getCloseLabel", filename($L.filed),
current.phase in $L.file, $L.filed)


1.2.3.1.4. The log4js script

The log4js is a logger type script similar to log4j. It provides a lightweight but useful
script to log events in a Service Manager script that you want to debug . It provides a
means to trace information in the Message view while controlling the level of detail
being logged. It allows developers to turn in-line debugging on and off.

The log4js script allows developers to set the following logging levels.

log4js log level                        Description
OFF                                     Nothing is logged.
ALL                                     Everything is logged.
DEBUG                                   Debug information is logged.
INFO                                    Information messages are logged
                                        (default).
WARN                                    Warning messages are logged.
ERROR                                   Error messages are logged.
FATAL                                   Fatal error messages are logged.

API Details

The log4js should be initialized before it is used.

Constructor syntax

  var samplelog = new lib.log4js($loglevel, $prefix);

You can also use the following method to create an instance of the logger:

  var myLogger=new lib log4js.Log(lib.log4js.Log.INFO);

Sample code snippets


  myLogger.info("an info");
  myLogger.warn("a warning");
  myLogger.error("an error");

You can change the log level or turn off logging with:

  myLogger.setLevel(lib.log4js.Log.WARN);
  myLogger.setLevel(lib.log4js.Log.OFF);

You can also change the log level or turn off logging with this format:

  myLogger.setLevel("WARN");
  myLogger.setLevel("OFF");

The log4js script supports appending a prefix to each message. For example:

  var myLogger=new lib.log4js.Log("INFO","my prefix");

Type of Logger

Logger                                  Description
alertLogger
                                        Output information to Service Manager
                                        Message view or the server log file
                                        (default: <SM server installation
                                        directory>\logs\sm.log), depending on
                                        whether a background or foreground
                                        process calls the log4j functions.

                                        background: server log

                                        foreground: Message view


API methods

The following table lists the API methods for log4js.

Method                                  Description
$log.debug                              Write a debug message.
$log.info                               Write an information message.
$log.warn                               Write a warning message.
$log.error                              Write an error message.
$log.fatal                              Write a fatal message.
$log.setLevel                           Set a log level.
$log.getLevel                           Retrieve the log level.
$log.setPrefix                          Set the prefix information.
$log.getPrefix                          Get the prefix information.
$log.getLogger                          Get logger information.
$log.setLogger                          Set the logger information.

Script name: log4js

Package name: null

Performance impact

The log4js uses the standard Service Manager print method to write the Service
Manager server log file or the Messages view, which is useful for debugging your
JavaScript, but keep in mind that when logging is turned on there is a performance
impact so log4js should be used carefully.


1.2.3.2. Examples of calling JavaScript
from different Service Manager tools

The following examples offer suggestions about using JavaScript in some of the
tailoring tools that support this functionality. Additional JavaScript examples can be
found in section JavaScript and Service Manager reference.


1.2.3.2.1. FormatControl

The following example can be used to verify whether or not the operator who was just
entered in the assignee.name field in an incident record is currently logged in.
Otherwise, validation will fail.

   1. In the Calculations section of Format Control, enter a condition of true in the
     initial column. Then add the following codes in the calculation column.

          $assignee.old = nullsub(assignee.name in $file, “no
          assignee”)

   2. Click the JavaScript tab, enter true for Add and Update, and then enter the
     following statements.

          var usersXML = system.users;
          var usersString = usersXML.toXMLString();
          var file = system.vars.$file;
          var newAssignee = file.assignee_name;
          system.vars.$IsUser=usersString.indexOf(newAssignee);

   3. In the Validation section, enter the following codes in the Add and Update
     column respectively.

          assignee.name in $file~=$assignee.old;

   4. And the following expression in the Validation column.

          $IsUser > 0

   5. Enter the following in the Validation message field.
     The new assignee is not logged in at this time. Please try another assignee.

This example uses the standard indexOf method for the String Object, and the
toXMLString() function, to search for the user who was entered as the new assignee
in the XML object containing all logged-in users.


Any RAD variable can be set and used by preceding it with system.vars. This lets
variable values be exchanged between JavaScript and RAD expressions.


1.2.3.2.2. Links

This example shows how to query a record from within Service Manager, and how to
update fields in that record. Additionally, it shows how to transfer an array from
Service Manager to JavaScript. An array from Service Manager can't be directly
copied into a JavaScript array, because the syntax of Service Manager {“IM1001”,
“IM1002”} doesn't work in JavaScript. Properties such as the length property assume
that the value is a function if it is enclosed in curly braces {}. To successfully convert
a Service Manager array into a JavaScript array, you can either use the
SCFile.toArray method, or create a while loop or a for loop to move through the
elements and do an element-by-element transfer, as shown above.

            Note

           In JavaScript, it is very important that you handle null values. Functions
           such as length may not work on null values.

In this example, the JavaScript code performs the following functions:

     Queries the configuration item that was previously selected from a fill.
     Increases a counter in that configuration item called num.issues.on.CI (this new
     field has to be added in the device file).
     Adds the new record number to an array of issues in the device file called
     array.incidents.
     Updates the device record.
     Issues an error message if the configuration item doesn't exist.
     Sends an alert to the person who is opening the record if the item is currently
     down.


var CI_Record=new SCFile("device"); /* opens the device file */
var CIName=system.vars.$File.logical_name; /* passes in the
logical name from $File */
/* Selects the configuration item to update */
function getConfigurationItem( CIName )
{
var findCI_RC = CI_Record.doSelect( "logical.name=\""+ CIName +
"\"" );
if (findCI_RC==RC_SUCCESS)
{
return CI_Record;
}
else
{
print( "Could not find configuration Item. " +
RCtoString( findCI_RC ) );
return null;
}
}
/* Increases the use counter that counts how often this item was
affected by an incident ticket and enters the incident ticket
number into the array of incidents */
function increaseUseCounter(CI)
{
if (CI.is_down == true)
{
print("The configuration item is down at the moment. Please
check
existing tickets if the cause for this issue is related to the
down
system.");
}
CI.num_issues_on_CI++; /* increase counter */
var incNumber = system.vars.$File.number; /* get the incident
ticket
number */
var array_incidents = new Array();
var ind = 0;
while(CI.array_incidents[ind] != null) /* convert the SC array
into a


JS array (see paragraph below) */
{
array_incidents[ind]=CI.array_incidents[ind];
ind++;
}
var j=0;
var temp_string = array_incidents.toString();
var i = temp_string.indexOf(incNumber);
if (i < 0) /* Check if incident is already in the list */
{ /* If not, enter the incident number to the list */
if (array_incidents == null)
{
j=0;
}
else
{
j=array_incidents.length;
}
array_incidents[j] = incNumber;
CI.array_incidents = array_incidents;
}
CI.doUpdate();
}
/* Call previously defined functions to execute code */
CI=getConfigurationItem(CIName);
increaseUseCounter(CI);


1.2.3.2.3. Trigger scripts

The triggers.g form contains a field for entering JavaScript (Script). We recommend
that the Script field contain single statements that invoke functions in the
ScriptLibrary. For example, system.library.myTriggers.triggerXYZ( ); .

Click the Compile icon in the ScriptLibrary to verify the syntax of your trigger script
function. A trigger script only needs to return a value if the trigger fails. The user can
indicate the failure of a trigger by returning the value of -1. Trigger scripts can access
the value of the current record in memory using the global object called
system.record, and they can access the value of the same record on disk using the
global object called system.oldrecord. For example,
system.library.myTriggers.triggerXYZ( system.record, system.oldrecord ); .

Triggers example

In this example, a trigger sends a message to the assignment group identified in an
incident record that the record has been updated and to whom it is assigned. It then
adds an activity note that the message has been sent.


var NewRecord=system.vars.$L_new; /* This is the $L.new record
passed in from the trigger */
var incNumber=NewRecord.number;
var incAssignee=NewRecord.assignee_name;
if (incAssignee==null)
{

              incAssignee="no one at the moment";
}
/* Insert a message schedule record into the schedule file */
function insertSchedule( incNumber, incAssignee, Adressees)
{

              var newSchedule = new SCFile( "schedule" );
              var today=new Date();
              newSchedule.application= "message.bg";
              newSchedule._class = "problem";
              newSchedule.name= "message processor record";
              newSchedule.expiration= today;
              newSchedule.strings[1]="1";
              newSchedule.strings[2]="problem update";
              newSchedule.strings[3]="Problem " + incNumber + " has
been
              updated. It is assigned to " + incAssignee + ".";
              newSchedule.strings[5]="pm.main";
              newSchedule.strings[6]=" Soap-Windows XP";
              newSchedule.strings1=Adressees;
              var rc = newSchedule.doInsert();
}
/* Selects the operators that are members of the assignment
group to return to the calling function */
function selectAddressees(assignmentGroup)
{
              var assignment = new SCFile( "assignment" );
              var findAssignee = assignment.doSelect( " name=\""+
assignmentGroup +
              "\"" );
              if ( findAssignee == RC_SUCCESS )
              {

                             addressList=assignment.operators;
                             return addressList;
              }


              else
              {

                             print( "Could not find assignment group. " +
                             RCtoString( findAssignment ) );
                             return null;
              }
}
/* Inserts an activity with the information that the email
notification
to the assignment group members has been sent */
function addActivity(incNumber)
{
              var newActivity = new SCFile( "activity" );
              var today=new Date();
              newActivity.number= incNumber;
              newActivity.datestamp= today;
              newActivity.type= "Update";
              newActivity.description[0]= "Notification email on the
update has been
              sent to all members of the assignment group.";
              var result = newActivity.doAction("add");
              if (result == RC_CANT_HAVE || result == 51 )
              {

system.library.activityUpdates.scheduleActivityUpdate
                             ( newActivity, newActivity.type,

newActivity.description );
              }

}
/* Selects the operators to send the message to */
Addressees = selectAddressees( NewRecord.assignment );
if (Addressees != null)
{
/* adds the message to the schedule file for sending */
insertSchedule( incNumber, incAssignee, Addressees);
/* adds an activity to inform the user of the email being sent*/
addActivity(incNumber);
}


The example also shows (among other things) how to call a Document Engine Action,
how to call a function from the Script Library, and how to insert a new record. In
addition, it shows how to use several functions within a single JavaScript and how to
call them.

            Note

           Because the class field name in the schedule file is in conflict with the
           class keyword used in JavaScript, it must be preceded by an underscore
           (_).


1.2.3.3. Using RAD functions in JavaScript

You can use most RAD functions in JavaScript. To use a RAD function in a JavaScript,
simply prefix the function with system.functions and replace any periods (.) in the
function name with an underscore (_).
For an example of how to do this, compare the following functions:

     RAD function: parse
     RAD function: evaluate
     JavaScript function: parse_evaluate()

Refer to List: RAD functions for a list of other RAD functions.


1.2.3.3.1. JavaScript function:
parse_evaluate()

Returns the value of a given expression.
Syntax

  system.functions.parse_evaluate( exp , 10 );

            Note

           The data is the character string to parse and the parse type is the numeric
           value normally passed into the parse function.

Example
If there is an $lo.username="Sys.Admin" expression in the useroptions table, this
example returns the value of that expression.

  if (system.functions.parse_evaluate(expression in $l.file, 10 ))
  userIsSysAdmin = true;

            Note

           The expression works when the statement being evaluated and parsed
           contains thread or global variables. It doesn't work for local variables.
           However, you can transfer local variables to thread variables before
           calling the parse_evaluate expressions.


1.2.3.3.2. RAD function: parse.evaluate

Returns the value of a given expression.
Syntax

  evaluate(parse(exp, 10 )

            Note

           The data is the character string to parse and the parse type is the numeric
           value normally passed into the parse function.

Example
If there is an expression $lo.username="Sys.Admin" in the useroptions table, this
example returns the value of that expression.

  if (evaluate(parse(expression in $l.file, 10)))
  $userIs.Sys.Admin = true

            Note

           The expression works when the statement being evaluated and parsed
           contains thread or global variables. It doesn't work for local variables.
           However, you can transfer local variables to thread variables before
           calling the parse and evaluate expressions.


1.2.3.4. JavaScript global properties

Global properties are predefined properties that aren't part of any object. They are
names representing values that are globally defined. The core JavaScript language
has several global properties, such as NaN (Not a Number), and Service Manager has
a number of additional global properties.
There are two categories of Service Manager-defined global properties:

     Query operators
     JavaScript return code properties

Query operators

These operators are used solely for constructing query expressions using the Query
object.

            Note

           The Query object has been deprecated, but older JavaScript code within
           the ScriptLibrary still uses the object.


 Query operator                         Description
 EQ                                     Equals to
 LIKE                                   Starts with
 NEQ                                    Not equal to
 GT                                     Greater than
 GE                                     Greater or equal to
 LT                                     Lower than
 LE                                     Lower or equal to
 ISIN                                   Is an element in the array
Example:

  var q=new SCFile("probsummary")
  q.doSelect(new QueryCond("number", EQ, "IM10002"));

JavaScript return code properties

Use these properties (which are represented internally as integer values) to test the
values returned by object methods such as SCFile. To print the error message rather
than the return code, use the RCtoString function.

 Return code                                                                                    Service Manager 9.81
 RC_ERROR
 RC_SUCCESS                             Description
 RC_CANT_HAVE
                                        Some other error occurred. Examine
 RC_NO_MORE                             the contents of the Messages view or
 RC_DUPLICATE_KEY                       the sm.log file for more information.
 RC_MODIFIED
 RC_DELETED                             The operation succeeded.
 RC_BAD_QUERY
 RC_NOT_AUTHORIZED                      The operation failed because the
                                        resource is unavailable because some
 RC_VALIDATION_FAILED                   other user or process has the resource
                                        locked.
This PDF was generated on May 23, 2026
                                        No more records are available in the
                                        result set.

                                        The insert operation failed because the
                                        file already contains a record with this
                                        unique key value.

                                        The update operation failed because
                                        the record was modified by another
                                        user or process since you read it.

                                        The operation failed because the
                                        record was deleted by another user or
                                        process.

                                        The query failed due to incorrect query
                                        syntax.

                                        The request operation was not
                                        performed due to an authorization
                                        failure. Check the permissions
                                        associated with the user who
                                        submitted the request.

                                        The operation failed because the data
                                        supplied in a field or the record did not
                                        pass validity checks performed by the
                                        application.

                                                                                                                        Page 108 of 207

 Return code                            Description
 RC_UNABLE_TO_WRITE_TO_FILE
 RC_UNABLE_TO_CLOSE_FILE                The operation failed. Check to make
 RC_UNABLE_TO_DELETE_FILE               sure the file name is correct, that the
 RC_INVALID_FILENAME                    file exists, and that it's not read-only.
Example:
                                        The operation failed. Check to make
                                        sure the file name is correct, that the
                                        file exists, and that it's not read-only.

                                        The operation failed. Check to make
                                        sure the file name is correct, that the
                                        file exists, and that it's not read-only.

                                        The operation failed because the file
                                        name is invalid.

  var rc = mySCFile.doInsert();
  if ( rc == RC_SUCCESS )
  {

                 print( "Insert succeeded" );
  }
  else

                 throw( "Error " + RCtoString(rc) + " occurred trying to
  insert a

                 record" );

Contents

     1 Query operators
     2 JavaScript return code properties


1.2.3.5. Order of execution of JavaScript
versus RAD language

This section lists all tailoring tools in which JavaScript can be directly entered and
describes at what point in the process the JavaScript code will be executed.

     Format Control: The JavaScript is executed after calculations and before
     validations. JavaScript code in Format Control is executed via the
     format.cjavascript RAD.
     Links: JavaScript in links is executed after the (initial) expressions, but before the
     fill or find is executed. This is done in us.link on evaluate.expressions.
     The post JavaScript is executed after the fill or find was performed, immediately
     after the post expressions. This happens in us.fill or us.find, respectively, on the
     eval.post.expressions panel.
     Triggers: The JavaScript in the triggers file is executed after the RAD application.
     This is controlled by the server binaries and not by RAD code.
     Cascade updates: The JavaScript in cascade updates is executed from the RAD
     application process.update.config.record. The evaluate expressions panel is
     executed before the evaluate.javascript panel, so that expressions take
     precedence over JavaScript.
     Scripts: In script.execute on panel exec.statements, RAD expressions are
     processed before JavaScript expressions.
     Wizards: Wizards use JavaScript in three different areas: During File Selection,
     Actions, and Cancel Expressions.

           File Selection: The Select $L.file by information is processed first, followed
           by the Initial Expressions and then the JavaScript.
           Actions: In the Actions tab, the Expressions are run first, then the
           JavaScript, followed by the information on the Format Control / Process
           Name tab.
           Cancel Expressions: First the Expressions Executed on Cancel are
           processed, followed by Javascript Executed on Cancel.
     Interoperability (ioaction file) : The ioaction file executes only JavaScript and not
     RAD expressions. The JavaScript code is executed in the
     ioevents.process.action application on the process.action panel .
     Display screens: In the display application on the panel prep.screen, the
     JavaScript expressions are executed after the RAD expressions.
     Display options: Display options have pre- and post-JavaScript and RAD
     expressions that are executed in the following order:


   1. Pre-RAD expression
   2. Pre-JavaScript
   3. RAD application
   4. Post-RAD expression
   5. Post-JavaScript
   6. Display Action

Processes: Process records have initial and final JavaScript and RAD
expressions executed in the following order:

   1. Initial RAD expression
   2. Initial JavaScript
   3. Pre-RAD expressions
   4. RAD application(s)
   5. Post-RAD expressions
   6. Final RAD expression
   7. Final JavaScript
   8. Next Process (if applicable)

Schedule: JavaScript in the schedule record is executed after the RAD
application is called and before the check for deleting or rescheduling the
schedule record.


1.2.3.6. Corresponding JavaScript syntax
for RAD language tasks

Most Service Manager tasks can be translated from RAD language to JavaScript by
using the JavaScript expressions identified in the following table. In the JavaScript
expression, the ObjectName is the name of a Service Manager object such as a table.

Service Manager task RAD panel / expression JavaScript expression

Create a file variable                  rinit                new SCFile(“filename”)

Select a record                         select               RC=ObjectName.doSele
                                                             ct(“Query”)

Update a record                         rupdate              RC=ObjectName.doUpda
                                                             te()

Add a record                            radd                 RC=ObjectName.doInser
                                                             t()

Delete a record                         rdelete              RC=ObjectName.doRem
                                                             ove()

Refer to a field in a file              result=fieldname in  result=ObjectName.field
                                        filevariable         name

Access an element of an result=rownumer in                   result=ObjectName.array

array                                   arrayname in filevariable name[rownumber]

Send a message to                       call message application print(“message”)
screen

Convert a field / Object str()                               RC=ObjectName.getText
to string                                                    ()


1.2.4. System Language reference

This is the reference section for the system language. In this section you will find a list
of the RAD functions, a list of the rtecalls, and a list of RAD routines.


1.2.4.1. Deleted RAD applications

The following RAD applications have been deleted from Service Manager because the
functionality they provided is no longer supported by Service Manager, or it has been
replaced with updated capabilities.


add.bigroup                             apm.get.incident.query cm.open.scm7
adl.initial.setup
ag.editor.backup                        apm.get.initial.query  cm3r.group.assign.totals

agmap.flow                              apm.get.parts          cm3r.group.request.total
                                                               s
agmap.flow.panels
                                        apm.get.probassign.quer cm3t.group.assign.totals
agmap.panel.xref                        y
agmap.print.arrays
agmap.print.condense                    apm.get.problem.query cm3t.group.request.total
agmap.print.condense.o                                                 s
nly
agmap.print.fields                      apm.get.values         convert.db2mvs

agmap.process.reports                   apm.inbox              convert.oracle

am.cigroup.bulkupdate2                  apm.initial            convert.sqlserver
am.search.related.SAV
                                        apm.launch.update      convert.sybase
apm.add.assign.group
apm.add.group                           apm.monthly.downtime.j create category
apm.add.parts                           ob
apm.add.profile
apm.add.user                            apm.open.inbox         db2mvs.template.to.sqlb
                                                               asename

                                        apm.post.cost.save     display.backup

                                        apm.remove.membershi display.pass.file.position
                                        p

                                        apm.remove.record      encl.appl.fla

                                        apm.rename.group       find.alias.fields

                                        apm.repair.problem     find.illegal.fc

                                        apm.set.assignment     fix.form.graph

                                        apm.tapi.header        get.serno


apm.admin                               apm.thread.stub      isg.check.pm.contract

apm.agi.main                            apm.user.to.group    isg.decide.contract

apm.assign.clean                        append.to.related    isg.delete.sm.warnings

apm.build.child.list                    appl.copy.rename     isg.set.warnings

apm.build.screlate                      big.green.arrow      label.display

apm.build.screlate.sub category.delete                       login.saf.msgs

apm.cascade.problem.cl cau.add.profile                       pm.close.pending
ose

apm.cp.send                             cau.add.profile2     pm.log

apm.create.group                        cau.add.user         pmc.sql.repair

apm.create.record                       cau.add.user.backup  rca.add.group

apm.delete.group                        cau.check.group      rca.add.profile

apm.delete.membership cau.edit.profile                       rca.add.user

apm.delete.profile                      cau.get.rm.profiles  rca.admin

apm.delete.record                       cau.main.2           rca.create.group

apm.delete.user                         cau.remove.from.groups rca.delete.group

apm.done.link                           cau.remove.from.msg.gr rca.delete.profile
                                        oups

apm.dt.process.demon cau.remove.profile                      rca.delete.user

apm.edit.assign.group cc.add.group                           rca.edit.group

apm.edit.group                          cc.add.profile       rca.edit.profile

apm.edit.operator                       cc.add.user          rca.edit.user


apm.edit.profile                        cc.admin              rca.fill.profile
apm.edit.record                         cc.create.group       system.nls
apm.edit.user                           cc.delete.group       trigger.counter
apm.email.problem                       cc.delete.profile     trigger.problem.homesite
apm.end.user                            cc.delete.user        trigger.problem.shadows
                                                              ite
apm.expand.downtime                     cc.edit.group         unconvert.qbe.lists
apm.fill.profile                        cc.edit.profile       us.calc.delta
apm.find.next.event                     cc.edit.user          us.gen.message
apm.fix.call                            cc.end.user           us.load.errmsg
apm.fix.shell                           cc.remove.membership  us.make.text
apm.fix.stored.queries                  cc.required.text      xanadu.timezone.set
apm.get.assignments                     cc.user.to.group
````
