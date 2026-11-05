---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.8.2 .. 1.8.2
printed_pages: 2258-2295
---

# 1.8.2 Wizard fields

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.8.2. Wizard fields

Before beginning to create a wizard, you should have a basic plan for the wizard flow,
including the function that each wizard panel must perform. This requirement is
demonstrated for the example of planning the SLA wizard panels for a new
SLA wizard.

When you are ready to create the wizard, you use the Wizard tool to create each
successive panel of the complete wizard. Generally each panel represents a screen
or step of the wizard that the end user will see, although some panels aren't visible to
the user and instead perform background activities, such as calling a Document
Engine process.

To access the Wizard tool, click Tailoring > Wizards or type wizards in the Service
Manager command line field.

The Wizard tool displays ten tabs:

     Wizard Info
     File Selection
     Usage
     Actions
     Messaging
     Variables
     Next Wizard
     Comments
     Cancel Expressions
     Previous Wizard (only visible after you click Add)


1.8.2.1. Wizard order of execution

When a wizard is run, it executes in the order the tabs are displayed in the wizard tool
interface (Wizard Info, File Selection, Usage, and so on.)

On the Usage tab, the developer determines whether the wizard panel is displayed to
the end user. If the panel is displayed, the order of execution then depends on which
button the end user clicks, Next, Previous, Cancel, or Finish.

If the end user clicks the Previous button, the previous wizard panel is displayed, or
some other panel as set by the developer using the Previous Wizard tab in the wizard
tool.
The Finish button is intended to be used at the end of the workflow. If the user clicks
it in the middle of the workflow, the wizard will proceed through the rest of the
sequential wizard panels without prompting the user for further input.

The Comments tab is used for internal development comments, and has no effect on
the wizard processing flow.

Within the File Selection tab, the Initial Expressions and Javascript evaluate after the
Select $L.file by tab. The means that you can't populate a query variable in Initial
Expressions and then use it in "Select $L.file by."


1.8.2.2. About variables

It is best to use local variables in a wizard in order to eliminate the chance of a
variable collision between threads (or even in the same thread if the wizard calls an
external application). However, variables local to the wizard application can't be used
by the display application or in Process records called by the wizard.

Specifying a local variable as a wizard variable increases the scope of the variable to
include the display application and called Processes. The variable will automatically
be cleaned up by the server when the entire wizard flow is complete, so there is no
danger of namespace collisions with variables from other threads or processes.


1.8.2.3. Variables to avoid using in
wizards

When creating a wizard, you should not use local variables that are used by the
wizard.run RAD application. Using those variables could cause errors and
unexpected results.
The variables to avoid using when creating a wizard are listed below.

$L.action                               $L.action.file                              Service Manager 9.81
$L.action.save                          $L.addition
$L.allow.skip                           $L.base.format      $L.action.file.save
$L.category                             $L.disable.next     $L.allow.finish
$L.disable.previous                     $L.display.screen   $L.bitmap
$L.ds.junk                              $L.ds.nme           $L.disable.next.previous
$L.env                                  $L.eval             $L.ds.i
$L.fc                                   $L.field.line.is    $L.ds.var
$L.file                                 $L.file.save        $L.exit
$L.finish                               $L.first.parent     $L.field.name.is
$L.format.name                          $L.gen.ms           $L.filename
$L.link                                 $L.list.field.name  $L.format
$L.main.title                           $L.messages         $L.i
$L.ms                                   $L.msg              $L.lng
$L.msg.lvl                              $L.msg.type         $L.mode
$L.next.wizard                          $L.no.recs.msg      $L.msg.cond
$L.object.type                          $L.old.format.name  $L.mult.sub
$L.option                               $L.override.link    $L.object
$L.parent                               $L.parent.file      $L.old.subformat
$L.parent.object                        $L.pass.names       $L.par.lng
$L.passed.file                          $L.phase            $L.parent.id
                                                            $L.pass.values
                                                            $L.prev.wizard

$L.prompt                               $L.qbe                                         Service Manager 9.81
$L.same                                 $L.save.name
$L.selection                            $L.selection.filename  $L.qbe.format
$L.selection.sort                       $L.selection.sql       $L.selected
$L.start                                $L.sub.format          $L.selection.save
$L.var                                  $L.window.title        $L.sql
$L.wizard.bitmap                        $L.wizard.error.msg    $L.title
$L.wizard.name                          $L.wizard.names        $L.wizard
$L.wizard.sql                           $L.wizard.title        $L.wizard.format
$L.x                                    $exit                  $L.wizard.prompt
$error                                                         $L.wizard.values
                                                               $normal


1.8.2.4. Wizard Info tab field definitions

Use this tab to enter basic information such as the wizard name, description, window
title, and images to be included on the panels displayed to the end user.

Field                                                                                           Service Manager 9.81
Wizard Name
name                                    Description

Start Node?                             This field forms the unique key for the
start                                   wizard in the wizard dbdict. Enter a
                                        brief descriptive name for the wizard
                                        as the unique identifier for this wizard
                                        record. As a best practice, include the
                                        table (or module) for the wizard, the
                                        action the wizard panel performs, and
                                        other detail such as whether the wizard
                                        is the Start Node. For example, your
                                        first wizard panel name for creating a
                                        wizard panel for SLA could be
                                        something like "SLA Create 1 - Start -
                                        Type."

                                        This is a required field.

                                        Selecting this checkbox (setting it to
                                        true), indicates that this is the first in a
                                        series of wizard panels. When a wizard
                                        set as the Start Node also requests
                                        user input, the Previous button is
                                        automatically disabled when the wizard
                                        panel is displayed to the user.

                                                    Note

                                                   If the Start Node wizard is
                                                   not displayed to the user,
                                                   be sure to disable the
                                                   Previous button on the first
                                                   wizard panel that's
                                                   displayed.

Field                                                                                           Service Manager 9.81
Brief Description
brief.description                       Description
Window Title
window.title                            Enter a brief, meaningful description of
                                        the wizard, including any important
Title                                   identifying information.
title
                                        The window title is displayed on the tab
                                        that holds the wizard thread when
                                        displaying the wizard panel to the user.
                                        This field also takes a message number
                                        from the scmessage database. For
                                        example, scmsg(18,"wizard").

                                                    Note

                                                   If the wizard you are
                                                   creating will be localized
                                                   (translated to another
                                                   language or languages),
                                                   then using the scmessage
                                                   database is the preferred
                                                   method.

                                        The title of the wizard entered in this
                                        field appears in bold in the upper left of
                                        the wizard panel when displayed. The
                                        title can be entered as a message
                                        number from the scmessage database
                                        such as scmsg(18,"wizard"). Enter a
                                        title that makes indicates the purpose
                                        of the panel to the user, such as
                                        "Create SLA." If more detail is needed,
                                        you can enter something like "Create
                                        SLA - Enter Description."

 Field                                                                                          Service Manager 9.81
 Prompt
 prompt                                 Description

 Bitmap                                 Enter a prompt that instructs the end
 bitmap                                 user if this is a wizard panels that will
                                        be displayed to the user. Service
This PDF was generated on May 23, 2026  Manager displays this information in
                                        the center of the panel, between the
                                        title and the wizard subformat, to give
                                        the user more detailed instructions on
                                        what kind of information should be
                                        entered in the panel. The prompt
                                        should be in large type.

                                                    Note

                                                   Localizable messages,
                                                   such as
                                                   scmsg(18,"wizard"), can be
                                                   used for the titles and
                                                   prompt rather than hard-
                                                   coding the wizard with text.
                                                   This allows for localized
                                                   languages in a multi-lingual
                                                   environment.

                                        The image to display on the left side of
                                        the wizard panel. The default image is
                                        located in the Service Manager Install
                                        Directory at:

                                        Client\plugins\com.hp.ov.sm.client.common_<SM
                                        version and build
                                        number>\src\resources\icons\obj16\wizard<1,2,3>.gi
                                        f

                                        If you want to use a different image,
                                        add it to the installation path above and
                                        enter the image file name in this field.

                                                                                                                        Page 213 of 341
Field                                                                                           Service Manager 9.81

Global Lists                            Description
global.list
                                        Click Fill to select the global lists to be
                                        built or updated so that they are
                                        available when the wizard is run.


1.8.2.5. File Selection tab field definitions

Use this tab to designate system language or JavaScript code to be run before file
selection and determine the content of $L.file. The tab includes three subtabs,
described below. The Select $L.file by subtab includes four main options, listed from
top to bottom as they appear on the screen.

Field                                                                                           Service Manager 9.81
Initial Expressions subtab
init.expressions                        Description

JavaScript subtab                       Enter expressions using system
javascript.init                         language syntax that will be evaluated
Select $L.file by subtab                after the $L.file is initialized. Use these
                                        expressions to initialize variables.
No $L.file (use typecheck)
file.selection                          Enter the JavaScript code that will run
                                        after the $L.file is initialized. Use this
                                        section to initialize variables or select
                                        values from related tables.

                                        You must choose one of the four main
                                        options listed below to designate how
                                        the wizard will select the $L.file
                                        variable.

                                        This option means that the wizard
                                        should not expect a file variable to be
                                        passed in from wherever the wizard is
                                        called; in fact, if one is passed in, it will
                                        be ignored. Instead it creates $L.file by
                                        initializing it as a record in the
                                        "typecheck" table, which is an internal
                                        table that contains fields
                                        corresponding to different field types
                                        supported by the system.

                                        This is often used in simple wizards
                                        that require only a small amount of
                                        input that doesn't need to be saved into
                                        the database.

Field                                                                                           Service Manager 9.81
$L.file passed in
file.selection                          Description

Create a record                         Selecting this option indicates that the
file.selection                          file variable ($L.file) was passed into
                                        this wizard as a parameter from the
of type (for Create a record)           calling application or wizard. If a wizard
create.record.filename                  is called as a next wizard, the file
Select records                          variable is automatically passed on.
file.selection                          This option should be selected if you
of type (for Select records)            plan to continue to work on the current
select.record.filename                  record stored in $L.file.

                                        Selecting this option indicates that the
                                        wizard will create a new record. You
                                        must enter or select the dbdict name in
                                        the record of type field. This initializes
                                        $L.file with the structure of the record
                                        from the table selected in the "of type"
                                        option.

                                        Click Fill to select the dbdict that
                                        defines the record to be created.

                                        Select this option to use a query
                                        statement to select one or many
                                        records.

                                        This field determines the record type
                                        for a query. Enter the dbdict name of
                                        the table from which the records
                                        should be selected, such as location.
                                        Click Fill to select a name from a list of
                                        all dbdict names.

Field                                                                                           Service Manager 9.81
using query
select.query                            Description

Resolve Variables                       Enter a query, using system language
resolve.variables                       syntax, to search for records that will
No Records Message                      be used to select records. For example:
select.no.records                       "agreement.id="+$G.new.sla

                                                    Note

                                                   The quotes (") are required.

                                        Select this box (set to true) to ensure
                                        that any variables entered in the Select
                                        Records field are evaluated before
                                        running the query.

                                        The text to display to the user if the
                                        query returns no records. This field
                                        also takes a message number from the
                                        message database.
                                        For example: scmsg(111,"wizard")


1.8.2.6. Usage tab field definitions

Use this tab to set wizard usage options, such as whether and which subformat will
be displayed to the user and which buttons will be available on the panel displayed.

Field                                                                                           Service Manager 9.81
Wizard Usage
section                                 Description

Select one record from list             Determines the action that Service
wizard.type                             Manager should take when the wizard
Selection Criteria                      is run. You must select one of the five
                                        main options presented on the screen.
Use $L.file as $L.selection
use.file.as.selection                   Choose from the Selection Criteria
Query for records                       listed below.
query.for.records
                                        When you choose to Select one record
of type                                 from list, selecting one of the following
query.for.records.filename              options allows you to select a record
                                        from a list. The list is formed based on
using query                             the options selected.
query.for.records.query
                                        This option uses the $L.file variable to
                                        form the list of records where the
                                        selection is to be performed.

                                        This option allows you to specify a
                                        query to form the list of records. The
                                        fields that are needed for the query
                                        aren'ted below.

                                        Enter the name of the table (dbdict
                                        name) that the query should run
                                        against. Check that the dbdict for field
                                        names is valid for the query.

                                        This option is used in conjunction with
                                        the options "Query for Records" and
                                        "of type." Enter the query using Service
                                        Manager system language syntax.

 Field                                                                                          Service Manager 9.81
 sort by
 query.for.records.sort                 Description
 If no records
 query.select.no.records                This option allows you to present the
                                        list, sorted in order, based on the fields
 No records message                     specified in this option. Enter field
 query.no.records.msg                   names that are valid for the selected
 If one record                          dbdict and sorted in ascending order.
 query.select.one.record
                                        This option allows you to specify an
 Allow "Skip" option?                   action if there are no records on the
 allow.skip                             list. The actions are as follows:

This PDF was generated on May 23, 2026  return: Returns to the previous wizard
                                        panel if there is one, or to the place
                                        from which the wizard was called (if
                                        this is the first panel).
                                        continue: Shows the empty list and
                                        allows you to continue.

                                        skip display: Skips the wizard panel
                                        and goes to the following panel, if
                                        applicable.

                                        This option allows you to display a
                                        message to present if there are no
                                        records in the list. An scmessage
                                        record can be used to construct the
                                        message.

                                        This option allows you to specify an
                                        action if there is just one record in the
                                        list. The one record can be displayed in
                                        a list, or it can be used as the current
                                        file variable without being presented to
                                        the user for selection.

                                        If selected (set to true), enables users
                                        to skip the panel.

                                                                                                                        Page 221 of 341
Field                                                                                           Service Manager 9.81
Request user input
wizard.type                             Description

Skip Display                            This field indicates that the user will be
wizard.type                             prompted for information. When this
                                        option is selected, the Sub Format to
Cancel Immediately                      display entry becomes required and a
wizard.type                             prompt with instructions needs to be
                                        entered in the Wizard Info tab.
Select multiple records from list
wizard.type                             Skip Display should be used when the
                                        current wizard manipulates the current
                                        record without the need for user input.
                                        Typically, a wizard that's not displayed
                                        to the user is part of a complex wizard
                                        workflow.

                                        This option is used to cancel a process
                                        immediately if a wizard is started by a
                                        user type who is not intended to use
                                        the wizard.

                                        For example: A company creates a
                                        wizard to gather information from top-
                                        level management customers. Let us
                                        say that a user who doesn't fit the
                                        criteria chooses to start the wizard and
                                        navigate through the wizard panels.
                                        The Cancel Immediately option causes
                                        the process to immediately end when it
                                        becomes clear that the information
                                        doesn't need to be gathered from that
                                        user.

                                        Selecting this option displays a list and
                                        allows the user to select multiple
                                        records from the list. The list is formed
                                        based on the options selected in the
                                        "Selection Criteria" section.

Field                                                                                           Service Manager 9.81

Multiple Selection field                Description
mult.field.name
                                        This option determines which field in
Sub Format to Display                   the list becomes available for the user
sub.format                              to select multiple records from.

                                        Enter the name of the format for user
                                        input to display within the wizard
                                        format.

 Field                                                                                          Service Manager 9.81
 Main Format
 (Defaults to Medium)                   Description
 form.Name
                                        The wizard creation tool offers several
This PDF was generated on May 23, 2026  format choices that effect the size of
                                        the wizard and the placement of
                                        buttons. Service Manager offers the
                                        following wizard format options. If no
                                        format is selected, the default is
                                        "Medium."

                                        Small (wizard.small) - This wizard
                                        offers the least amount of space for
                                        text and options, but also requires the
                                        least amount of screen space. This
                                        wizard is ideal for clients running in low
                                        resolution environments. It allows only
                                        a small space for the subformat, so the
                                        subformats need to be kept small.
                                        Buttons available are Previous, Next,
                                        Finish, and Cancel, and placement is
                                        horizontally-aligned along the bottom.

                                        Medium (wizard) - This wizard offers
                                        sufficient space for most wizard tasks.
                                        Buttons available are Previous, Next,
                                        Finish, and Cancel, and placement is
                                        horizontally-aligned along the bottom.

                                        Large (wizard.large) - This wizard
                                        offers the most amount of space for
                                        text and options, but also requires the
                                        most amount of screen space. This
                                        wizard is ideal for clients running with
                                        high screen resoltuions. It offers the
                                        most amount of space for the
                                        subformat to display, allowing for more
                                        complex subforms. Buttons available
                                        are Previous, Next, Finish, and Cancel,
                                        and placement is horizontally-aligned
                                        along the bottom.

                                                                                                                        Page 224 of 341
Field                                                                                           Service Manager 9.81

Display Screen (Defaults to             Description
wizard.display)
display.screen                          OK Only - Small (wizard.okonly.small)
                                        - Uses the small wizard size and limits
                                        the buttons available to navigate
                                        through the task. Buttons available are
                                        OK and Cancel, and placement is
                                        horizontally-aligned along the bottom.

                                        OK Only - Medium (wizard.okonly) -
                                        Uses the medium wizard size and limits
                                        the buttons available to navigate
                                        through the task. Buttons available are
                                        OK and Cancel, and placement is
                                        horizontally-aligned along the bottom.

                                        Buttons on Top (wizard.buttonsOnTop)
                                        - Uses the medium wizard size and
                                        places the buttons along the top of the
                                        wizard. Buttons available are Previous,
                                        Next, Finish, and Cancel, and
                                        placement is horizontally-aligned along
                                        the top.

                                        Buttons on Side
                                        (wizard.buttonsOnSide) - Uses the
                                        medium wizard size and places the
                                        buttons along the right edge of the
                                        wizard. Buttons available are Previous,
                                        Next, and Finish, and placement is
                                        vertically-aligned along the right side.

                                        Enter a display screen, if you want to
                                        customize the button and menu options
                                        available within the wizard. The default
                                        display screen is wizard.display.

Field                                                                                           Service Manager 9.81

Activate "Finish" option?               Description
allow.finish
                                        Use this option for the final wizard in
                                        the series. Selecting this checkbox
                                        makes a Finish button appear on the
                                        wizard panel.

                                                    Note

                                                   It is possible to have the
                                                   Finish button available prior
                                                   to the last wizard in the
                                                   workflow, if the wizard
                                                   panels displayed after this
                                                   wizard only provide
                                                   optional information. The
                                                   Finish button can't be
                                                   activated before all
                                                   required information can be
                                                   collected from the user.

Turn off Next and Previous buttons?     Selecting this checkbox makes the
disable.next.previous                   Next and Previous buttons unavailable
                                        in the wizard, so the user can't click
                                        "Next" or "Previous" to move forward
                                        or backward in the wizard.

                                                    Note

                                                   This selection should only
                                                   be made on the very last
                                                   wizard panel in the
                                                   workflow. Also, the Finsih
                                                   button needs to be
                                                   activated if the Next and
                                                   Previous buttons are
                                                   disabled.

Field                                                                                           Service Manager 9.81
Turn off Next button only?
disable.next                            Description
Turn off Previous button only?
disable.previous                        Selecting this checkbox makes the
                                        Next button unavailable in the wizard,
Use Conditional Previous Exits?         so the user can't click "Next" to move
previous.cond                           forward in the wizard.
Never prompt on cancel?
                                        Selecting this checkbox makes the
                                        Previous button unavailable in the
                                        wizard, so the user can't click
                                        "Previous" to move backward in the
                                        wizard.

                                                    Note

                                                   This option should be used
                                                   if the first displayed panel
                                                   of the wizard is not the
                                                   Start Node. Selecting
                                                   Previous in such a case
                                                   would exit the wizard
                                                   without going through
                                                   proper cancel processing.

                                        When you select this option, the
                                        Previous Wizard tab appears on the
                                        form. In the Previous Wizard tab, you
                                        define the different possible exits when
                                        the Previous button is clicked.

                                        Determines whether the user is
                                        prompted when canceling out of the
                                        wizard. The Return prompt can send
                                        the user back to the panel.


1.8.2.7. Actions tab field definitions

Use this tab to set wizard actions, including defining which Process or Format Control
will be executed and on which file variable or record they will be performed.

 Field                                                                                          Service Manager 9.81
 Initial Process
 initial.process                        Description
 Perform Actions On
 section                                This option lets you specify a process
                                        definition to be executed prior to the
This PDF was generated on May 23, 2026  actions to be performed. For
                                        information on process definitions, see
                                        the Document Engine documentation.

                                        You must select one of the three
                                        options to specify which record(s) will
                                        be affected by the action you are going
                                        to perform. The file is either the current
                                        file, the whole list selected, or an action
                                        to be performed on every single record
                                        selected. Actions are defined in the
                                        wizard, and define what will happen
                                        when a user clicks Next on a wizard.

                                                    Note

                                                   Depending on what you
                                                   selected in the File
                                                   Selection tab, you can
                                                   choose whether the actions
                                                   performed when a user
                                                   clicks Next will be
                                                   performed on the current
                                                   file or a record selection.
                                                   Record selection
                                                   ($L.selection) must only be
                                                   chosen if the $L.selection
                                                   file variable was filled when
                                                   you chose Select Records
                                                   on the File Selection tab,
                                                   and if you chose either
                                                   "select one" or "select
                                                   multiple records" from the
                                                   list on the Usage tab.

                                                                                                                        Page 229 of 341
Field                                                                                            Service Manager 9.81

Current File ($L.file)                   Description
perform.action.on
                                         The actions will be performed on the
                                         single record represented by the $L.file
                                         file variable. The current file may have
                                         been passed in, created, or selected
                                         with a query returning only a single
                                         record.

                                                     Note

                                                    The actions defined in the
                                                    Actions to Perform section
                                                    apply to the current file
                                                    selected in the File
                                                    Selection tab and/or Usage
                                                    tab.

Selection ($L.selection)                 The actions defined in the Actions to
perform.action.on                        Perform section apply to the group of
                                         records selected in the File Selection
Each record in selection ($L.selection)  tab.
perform.action.on
                                         The actions defined in the Actions to
                                         Perform block apply to each record
                                         selected.

Actions to                               Use the three subtabs in this section to
Perform                                  indicate the actions to perform on the
                                         selected file.
section

Field                                                                                           Service Manager 9.81

Expressions subtab                      Description
expressions
                                        Enter any expressions that should be
                                        run as part of the wizard after the initial
                                        process, before the JavaScript and
                                        Format Control (or process). These
                                        expressions use Service Manager
                                        system language syntax, such as:

                                          name in $L.file="Test"

                                        These expressions are evaluated
                                        before the Reset Current File to
                                        Selection action is performed.
                                        Therefore, actions performed here
                                        should use $L.selection rather than
                                        $L.file if they are intended to
                                        manipulate the user selected record.

                                                    Note

                                                   These expressions can use
                                                   the record(s) selected,
                                                   such as storing information
                                                   in a field.

JavaScript subtab                       The JavaScript expressions will run as
javascript.actions                      part of the wizard and are executed
                                        after the initial process and
Format Control/Process Name subtab      expressions, but before the Format
                                        Control or process entered on the next
                                        subtab. These JavaScript language
                                        expressions can be used to manipulate
                                        the current file variable or initialize
                                        variables.

Field                                                                                           Service Manager 9.81
Format Control
format.control                          Description

of type                                 The Format Control record to use. You
format.control.type                     can enter a Format Control record to
                                        execute queries, calculations,
on bad validation                       validations, or subroutines after
bad.validation.action                   running through the expressions and
                                        JavaScript, and before calling the
                                        process.

                                        The Format Control type to use for this
                                        wizard to evaluate the applicable
                                        conditions, so that Format Control can
                                        be executed on the action (Add,
                                        Update, or Delete) that's evaluated in
                                        the Format Control record.

                                        When data validation in Format Control
                                        fails, choose to return the user to the
                                        current wizard panel to enter the
                                        correct information, or choose to let
                                        the wizard continue to the next panel,
                                        ignoring the failed validation.

                                             Return sends the user back to the
                                             panel. Should only be used if the
                                             user has the opportunity to fix the
                                             failed validation. If the wizard
                                             doesn't request information from
                                             the user by displaying a
                                             subformat to enter information,
                                             selecting Return will end up in an
                                             infinite loop.

                                             Continue lets the user continue.

Field                                                                                           Service Manager 9.81
Process Name
process.name                            Description

Reset Current File to Selections?       Enter the name of a process to execute
reset.to.selections                     on this wizard panel. For more
                                        information, refer to the Document
                                        Engine documentation.

                                        If selected (set to true), replaces the
                                        current file variable ($L.file) with the
                                        value selected by the user
                                        ($L.selection).

                                                    Note

                                                   This field depends on the
                                                   selections in the Usage tab.
                                                   If "Select one record from
                                                   list" or "Select multiple
                                                   records from list" are
                                                   chosen, those options
                                                   generate $L.selection.

Restart Panel if                        Under some circumstances it may be
restart.condition                       necessary to run the wizard panel
                                        again. For example, an expected field
Display Record(s) when complete?        may not have been filled in correctly, or
display.when.complete                   an error code may have been returned
                                        from Format Control or the process.
                                        Enter a condition that evaluates to true
                                        or false to determine if this panel needs
                                        to be rerun.

                                        Determines whether to display the
                                        record to the user when the wizard
                                        completes. If the condition is true,
                                        Service Manager displays the record to
                                        the user when complete. If the
                                        condition is false, no record is
                                        displayed.

Field                                                                                           Service Manager 9.81
Mode
display.mode                            Description

Return Current File to calling          This field determines how a record will
application?                            be displayed to the user.
reset.current.file
                                             Browse: (This is the default.)
                                             Browse mode doesn't have any
                                             buttons to store a modified
                                             record.

                                             Add: The Add button becomes
                                             available.

                                             Update: The Save button
                                             becomes available.

                                        This option returns the current record
                                        to the application that called the wizard
                                        for further processing.


1.8.2.8. Messaging tab field definitions

Use this tab to set any messages to be displayed to the end user when specified
conditions occur.

Field                                   Description

Message                                 Message to be displayed when a
message                                 certain condition occurs. This field will
                                        also take a message number from the
                                        scmessage database. For example:
                                        scmsg(106,"fc").

Condition                               Enter a condition for the message that
message.cond                            evaluates to true or false to determine
                                        if the message should be issued. For
                                        example:

                                        not nullsub($L.finish,false)

Type                                    Select the format of the message to
message.type                            display to users (pop-up or on-
                                        screen). The default is on-screen.

Level                                   Select the level of severity of the
message.level                           message:

                                             Info: Informational only (default)

                                             Action needed

                                             Error message: The error
                                             message issued to the user when
                                             a serious error is encountered.


1.8.2.9. Variables tab field definitions

Use this tab to document the variables used in the wizard workflow.

Field                                   Description

Wizard variables                        Use this tab to define variables for use
wizard.variables                        within the wizard. Variables can be
                                        passed to applications or formats being
                                        created by the wizard, but must be
                                        assigned. For example, a variable such
                                        as $L.return.action must be defined
                                        here, if it will be used within the wizard.
                                        The data type and value of a variable
                                        can be different at different times, and
                                        can have a primitive or compound data
                                        type as its value. Service Manager
                                        contains three types of variables: 1)
                                        local, 2) global, and 3) thread. Local
                                        variables begin with $L and persist only
                                        within the currently executing RAD
                                        application. The server automatically
                                        cleans up local variables when it exits a
                                        RAD application.


1.8.2.10. Next Wizard tab field definitions

Use this tab to specify the next wizard panel (if any) to be called.

Field                                   Description

Wizard Name                             Name of the next wizard to execute
next.wizard                             within the workflow (series of wizard
                                        panels).

Condition                               Enter a condition that evaluates to true
next.wizard.cond                        or false. The next wizard in the
                                        workflow is determined by the first
                                        condition that evaluates to true,
                                        regardless of the conditions that follow
                                        (even if they evaluate to true as well). If
                                        all conditions evaluate to false, the
                                        wizard workflow will exit and finish.


1.8.2.11. Previous Wizard tab field
definitions

This tab is displayed when you check the Use Conditional Previous Exits? checkbox
in the Usage tab.

Field                                   Description

Wizard Name                             Specify the name of the wizard to
prev.wizard                             which the user should exit.

Condition                               Set the condition for when the user
prev.wizard.cond                        should be taken to this previous wizard.
                                        The condition must evaluate to true or
                                        false.


1.8.2.12. Comments tab field definitions

Use this tab to enter internal development comments about the wizard. These
comments have no effect on the wizard workflow itself.

Field                                   Description

Comments                                Enter any developer comments
comments                                concerning the wizard here. As a best
                                        practice, use the Comments tab to
                                        describe details, such as the purpose
                                        of the wizard panel, the settings
                                        selected to implement that purpose,
                                        variables used, wizard workflow, and
                                        exit conditions.


1.8.2.13. Cancel Expressions tab field
definitions

Enter system language expressions or JavaScript code that will execute if the end
user clicks the Cancel button. This cleans up variables that were used in the wizard to
ensure correct behavior the next time the wizard is executed.

Field                                   Description
Expressions Executed on Cancel
subtab                                  Enter any expressions that will execute
cancel.expressions                      when a user cancels the wizard
                                        process. This provides the wizard
JavaScript Executed on Cancel subtab    creator an opportunity to reset values
javascript.cancel                       or clean up variables initialized in the
                                        wizard.

                                        Enter any JavaScript code that should
                                        be used to reset values and clean up
                                        variables that were initialized in the
                                        wizard.
````
