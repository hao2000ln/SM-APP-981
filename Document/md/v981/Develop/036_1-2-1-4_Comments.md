---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.2.1.4 .. 1.2.1.7
printed_pages: 977-996
---

# 1.2.1.4 Comments

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.1.4. Comments

The RAD programming language supports full line, C++ style comments in RAD
statements. Comments may be indented, and are prefixed by a double slash ("//").

            Note

           Currently, comments in RAD expressions aren't supported.

Examples                                //comment

Valid comments
//comment
Invalid comment
$L.n = 1//comment

Contents

     1 Examples


1.2.1.5. Variables

A variable is a location in memory where a value can be stored. It is a named entity
that refers to data to which you can assign values. The data type and value of a
variable can be different at different times and can have a primitive or compound data
type as its value. Service Manager contains three types of variables:

     Local
     Global
     Thread

Local variables begin with $L. and persist only within the currently executing RAD
application. The server automatically cleans up local variables when it exits a RAD
application.

Global variables begin with $G. or $lo. and persist throughout a user session ( $lo.
is an abbreviation for logged on. These variables are set when the operator logs on).
The server automatically cleans up global variables when a user logs off the system.

Thread variables don't have a consistent naming scheme other than beginning with a
dollar sign ($). Thread variables are only valid for the current RAD thread. If the RAD
thread terminates, then the server automatically cleans up all thread variables.

Creating variables

The rules for creating variables are as follows:

     A variable name must begin with a dollar sign ( $ ) and an alphabetic character
     followed by zero or more alphanumeric characters that may include periods, but
     may not include blanks.
     A variable name can be any length.
     A variable's value is initialized to a null string.
     Data assigned to a variable has a data type. This data type becomes the
     variable's data type.
     Any variable can be set to a null value by assigning the value NULL to it. For
     example, $variable=NULL .
     Global variables are treated as global among all applications executed within the
     process or task with two exceptions:

           When the variable is designated local (or something other than global) by
           an initial identifier. For example, when the variable is created within a
           function.
           When the variable is a parameter variable.


Global variables

The following global variables are available when defining registration events.


Variable                                Description                   Comment
$axces
$axces.fields                           Represents the eventin
$axces.register                         record.
$axces.lock.interval
                                        Represents the evlist
$axces.debug                            field in the eventin
                                        record.

                                        Represents the event
                                        registration record.

                                        An interval of time before
                                        a retry occurs if Service
                                        Manager denies the
                                        attempt to update an
                                        incident because the
                                        record is locked. For
                                        example: '00:02:00' for
                                        two minutes.

                                        If true, the evlist array in  Use this feature with
                                        the eventin record is not     discretion.
                                        removed before
                                        attempting to update the
                                        record. If the size of the
                                        record exceeds 32KB,
                                        Event Services
                                        generates an error, the
                                        eventin record is not
                                        updated, and the event
                                        reprocesses because the
                                        evtime field is not
                                        removed.


Variable                                Description                  Comment

$axces.bypass.failed.vali               Used in events calling
dation                                  the application
                                        axces.apm. The default
                                        value is NOT true. If true,
                                        the application ignores
                                        any failed formatctrl
                                        validations. If false, the
                                        event status is error-fc.

List: Default variables

It is likely that the list of default variables varies from release to release. The out-of-
box system includes the following global and local variables.

 Variable                                                                                       Service Manager 9.81
 $G.profiles
 $G.pm.global.environment               Definition
 $G.assignment
                                        List of personal profiles.
 $G.categories
 $G.problem.inboxes                     Incident Management’s global
                                        environment record .
 $G.open.lists
 $G.icm.status                          List of assignment groups for Service
 $G.assignment.groups                   Desk, Incident Management, Problem
                                        Management and Change
 $G.prompt.for.save                     Management.

 $G.availability.maps                   List of categories.
 $G.pm.environment
 $G.pm.status                           List of Incident Management views
                                        available to all the users as well as the
This PDF was generated on May 23, 2026  views available to the logged on
                                        operator.

                                        List of all global lists built at login.

                                        List of Configuration Management
                                        statuses.

                                        List of assignment groups for Service
                                        Desk, Incident Management, Problem
                                        Management and Change
                                        Management.

                                        Global flag (Boolean) that determines
                                        whether or not to prompt you to save
                                        when you press OK or Cancel after you
                                        update a record.

                                        List of availability maps.

                                        The current user’s Incident
                                        Management personal profile record.

                                        List of Incident Management statuses.

                                                                                                                            Page 7 of 207
 Variable                                                                                       Service Manager 9.81
 $G.technicians
 $G.incident.inboxes                    Definition

 $L.filed                               List of technicians (operator table).
 $L.new
 $L.old                                 List of Service Desk views available to
                                        all the users as well as the views
 $lo.appl.name                          available to the logged on operator.

 $lo.appl.names                         This is the current file opened by the
 $lo.appl.values                        display application.
 $lo.cm.limit
 $lo.company.name                       The current file being updated when
                                        evaluating macro conditions.
 $lo.copyright
 $lo.date.order                         The pre-updated state of a file
                                        undergoing an update while evaluating
 $lo.db.limit                           macro conditions.

This PDF was generated on May 23, 2026  The name of the application
                                        responsible for managing the user’s
                                        menu (menu.manager)

                                        Application parameter names passed.

                                        Application parameter values passed.

                                        Partial-key time threshold for Change
                                        Management.

                                        The company name as defined in the
                                        System Information Record as Menu
                                        Title under the Menu Information tab.

                                        The company copyright (copyright())

                                        The number representing date order
                                        (mdy, dmy, ymd) in the operator
                                        record.

                                        Partial-key time threshold for Database
                                        Manager.

                                                                                                                            Page 8 of 207
 Variable                                                                                       Service Manager 9.81
 $lo.device
 $lo.groups                             Definition
 $lo.home
 $lo.i                                  Device ID (current.device())

 $lo.main                               List of query group names in operator
 $lo.month.abv                          record.
 $lo.month.ext
 $lo.msglog.lvl                         Name of Home menu for GUI.

 $lo.pm.limit                           Temporary variable that functions as a
 $lo.system.startup                     loop counter (variable is cleaned up in
                                        the login application).
 $lo.time.zone
 $lo.uallow.syslog                      Name of main menu for text.

This PDF was generated on May 23, 2026  List of abbreviated months (“Jan”,
                                        “Feb”, “Mar”).

                                        List of months (“January”, “February”,
                                        “March”).

                                        Level of messages to store in the
                                        message queue for the operator Level
                                        of messages to store in the message
                                        queue for the operator logged on.
                                        Message levels affect on-screen
                                        messages only.

                                        Partial-key time threshold for Incident
                                        Management .

                                        Set at login to value of the field called
                                        system.startup.time in Company
                                        Information record.

                                        User’s time zone.

                                        Determines whether syslog table is
                                        updated when processes start and end
                                        in the system.

                                                                                                                            Page 9 of 207
Variable                                                                                        Service Manager 9.81
$lo.uallow.timezone
                                        Definition
$lo.uapprovals                          Allows user to modify time zone based
$lo.ucapex                              on capability.
$lo.uchgrps                             List of change approval groups.
$lo.ufname                              List of user’s capability words.
$lo.ulogin.time                         List of change groups.
$lo.user.name                           User’s full name.
                                        User login time stamp.
                                        operator()


1.2.1.6. Variable pools

Variable pools are functional groupings of variables within Service Manager. There
are currently four variable pools:

     Global

     A global variable is visible to the entire system. It begins with $G. or $lo. .

     Local

     A local variable is only visible to the RAD application in which it was defined. It
     begins with $L. .

     Parameter

     A parameter variable is defined on a parameter command panel. It may contain a
     value passed in from another application. By convention, parameter variables
     are written in uppercase letters, such as $PHASE or $GROUP.LIST . Parameter
     variables are invisible to the debugger.

     Thread

     A thread variable is only visible to the thread in which it was defined. The same
     variable in different threads has different values, even when the threads are
     spawned by the same parent.

Variable pool                           Variable                             Service Manager 9.81
Global                                  $G.
Global                                  $lo.         Comments
Global                                  $MARQUEE.
Global                                  $SYSPUB.     There is only one local
Local                                   $L.          variable. It can contain
                                                     many pieces of data,
Parameter                               $PHASE       similar to the way a
                                        $GROUP.LIST  structure contains many
Thread                                  $file        pieces of information.
                                        $array       For example, $L.env
                                        $post        and $L.file are two
                                                     pieces of data that $L.
                                                     can contain.

                                                     These are just a few
                                                     examples, there are
                                                     many parameter
                                                     variables.

                                                     These are just a few
                                                     examples, there are
                                                     many thread variables.


1.2.1.7. Statements

Statements are the smallest executable entities within Service Manager. A statement
is governed by the following rules.

     A statement doesn't have a value.
     A statement is comprised of expressions combined with key words.
     The following BASIC language statements perform processing and looping: IF,
     WHILE and FOR. They can be nested. For example,
     for...to...if...then...else...if...then.
     The following assignment statements are used: assign, increment, and
     decrement.
     RAD functions can be used in statements to further define selection criteria
     and/or execute commands, initialize values, and perform calculations. Service
     Manager syntax rules must be followed. The result of a RAD function can be
     assigned to a variable using the assign (=) assignment statement. For example,
      $string.length=lng($string) .

The following table lists all of the statements available in Service Manager.

Type        Name                        Character         Service Manager 9.81
Assignment  Assign                      =
                                                   Description and
Assignment  Increment                   +=         Examples

                                                   Assigns the value
                                                   of the right hand
                                                   operand to the
                                                   left hand
                                                   operand.
                                                   Example:

                                                     $x=1
                                                     assigns 1
                                                     to $x

                                                   Increment the left
                                                   hand operand by
                                                   the right hand
                                                   operand.
                                                   Example:

                                                     traditional
                                                     : $x=$x+1
                                                     increments
                                                     $x by 1
                                                     shortcut:
                                                     $x += 1
                                                     increments
                                                     $x by 1

Type        Name                        Character         Service Manager 9.81
Assignment  Decrement                   -=
                                                   Description and
                                                   Examples

                                                   Decrement the
                                                   left hand operand
                                                   by the right hand
                                                   operand.
                                                   Example:

                                                     traditional
                                                     : $x=$x-1
                                                     decrements
                                                     $x by 1
                                                     shortcut:
                                                     $x -= 1
                                                     decrements
                                                     $x by 1

Type  Name                              Character         Service Manager 9.81

Processing and lo FOR                              Description and
oping                                              Examples

                                                   Allows you to
                                                   perform a loop.
                                                   You can set a
                                                   variable, perform
                                                   a statement, and
                                                   increment the
                                                   variable until the
                                                   variable is greater
                                                   than a maximum
                                                   value. Format this
                                                   statement as
                                                   follows:

                                                     FOR
                                                     variable
                                                     name =
                                                     initial
                                                     value TO
                                                     maximum
                                                     value [DO]
                                                     statement

                                                   The brackets ([ ])
                                                   indicate that the
                                                   DO keyword is
                                                   optional.
                                                   Example:

                                                     for $I = 1
                                                     to 10 do
                                                     ($J=$I*$I+$
                                                     J)

Type  Name                              Character         Service Manager 9.81

Processing and lo IF                               Description and
oping                                              Examples

This PDF was generated on May 23, 2026             Specifies a
                                                   condition to be
                                                   tested and a
                                                   statement to be
                                                   executed if the
                                                   condition is
                                                   satisfied and a
                                                   statement to be
                                                   executed if the
                                                   condition is not
                                                   satisfied. Format
                                                   these statements
                                                   as follows:

                                                     IF Boolean

                                                     condition

                                                     THEN

                                                     statements

                                                     [ELSE

                                                     statements]

                                                   Example:

                                                   if
                                                   ($location="Seattl
                                                   e") then
                                                   ($x=$x+1) else
                                                   ($x=$x - 1)

                                                   If Boolean
                                                   condition
                                                   evaluates to
                                                   UNKNOWN, then
                                                   neither statement
                                                   is executed;
                                                   therefore, we
                                                   recommend using
                                                   a default value

                                                                              Page 17 of 207

Type  Name                              Character  Description and

                                                   Examples

                                                   when the
                                                   condition
                                                   evaluates to
                                                   UNKNOWN.

                                                   Example:

                                                   if
                                                   (nullsub($location
                                                   ,"Chicago")="Sea
                                                   ttle") then
                                                   ($x=$x+1) else
                                                   ($x=$x - 1)


Type  Name                              Character  Description and
                                                   Examples
Processing and lo WHILE
oping                                              Specifies a
                                                   condition to be
                                                   tested and a
                                                   statement to be
                                                   executed when
                                                   the condition is
                                                   TRUE. Format
                                                   these statements
                                                   as follows:

                                                     WHILE
                                                     (expression
                                                     ) [DO]
                                                     statement

                                                   Example:

                                                     while
                                                     ($x>6) do
                                                     ($x=$x -
                                                     1;$y=$y -
                                                     1)

                                                   The brackets ([ ])
                                                   indicate that the
                                                   DO keyword is
                                                   optional.

An assignment statement assigns a value to a variable. The order for the assignment
statements when read left to right is the destination variable first, then the assignment
operator, then the expression. It usually consists of three elements:

     An assignment operator (typically an =).
     An expression to be assigned.
     A destination variable.


On execution, Service Manager evaluates the expression and stores the resulting
value in the variable.
````
