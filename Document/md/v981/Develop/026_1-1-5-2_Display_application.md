---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.1.5.2 .. 1.1.5.2
printed_pages: 681-718
---

# 1.1.5.2 Display application

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.5.2. Display application

The display application allows System Administrators to customize certain features of
their system without altering RAD code.

Data files within Display contain the individual records, or screens, in which options,
events, and window controls are defined. Each screen is attached to a particular
application and controls the features appearing on the forms associated with that
application. The information from these screens is stored in data tables and is not
embedded in the RAD code. A system administrator has ready access to all Display
features and may edit them freely.

Note: Because custom features are independent of RAD programming, Display
options are protected from conflict during the upgrade process.

Related topics

Displayoptions
Selecting display options
Access display records


1.1.5.2.1. Displayscreen definitions

The Display Application Screen Definition (displayscreen) record is the control point
for applying options to Service Manager forms using the Display application.
To access the Display Application Screen Definition form, click Tailoring > Tailoring
Tools > Display Screens.
The fields available to apply displayscreen options are described below.

Field Name (*Required)                  Field ID                              Service Manager 9.81
*Screen ID                              screen.id
                                                      Description
On option 0                             on.enter.key
                                                      The unique name,
This PDF was generated on May 23, 2026                identifying the record
                                                      whose display
                                                      characteristics are being
                                                      defined. The names of
                                                      screen IDs generally
                                                      reflect their function and
                                                      closely resemble the
                                                      names of the forms to
                                                      which they are attached.

                                                      The action to take when
                                                      the user presses Enter--
                                                      Option 0 (zero).

                                                           Redraw screen:
                                                           Refreshes the
                                                           screen. The cursor
                                                           remains in the same
                                                           field, but if this is a
                                                           multi-line field, the
                                                           focus resets to the
                                                           top of the field.
                                                           Do nothing: With
                                                           this action, the
                                                           display application
                                                           will execute any
                                                           statements and
                                                           RAD applications
                                                           defined in the
                                                           display option, and
                                                           then return to the
                                                           original screen.
                                                           Return to appl: Exits
                                                           the current screen
                                                           to the calling
                                                           application.

                                                                                                  Page 130 of 168
Field Name (*Required)                  Field ID                          Service Manager 9.81
Title                                   title
                                                  Description
Format                                  form
                                                  The title of the form. The
I/O (If RIO)                            io        value in this field can be
                                                  a variable or an
Time (if FDISP)                         time      expression.

Used only for Search? search.only                 The form to open for this
                                                  screen. The value in this
                                                  field can be a variable or
                                                  an expression.

                                                  Determines the user's
                                                  privileges for modifying
                                                  the displayed data.
                                                  Service Manager uses
                                                  this field only when the
                                                  displayed panel is
                                                  replacing an rio panel.

                                                  The date and time field
                                                  determining the length of
                                                  time a user may search
                                                  the database. Service
                                                  Manager uses this field
                                                  only when the displayed
                                                  panel is replacing an
                                                  fdisp panel. The value in
                                                  this field can be an
                                                  expression.

                                                  This option is selected
                                                  on screens that are used
                                                  only for searches (such
                                                  as db.search).

Field Name (*Required)                  Field ID                              Service Manager 9.81
User Options                            user.options
                                                      Description
Language                                language
                                                      If selected (set to true),
Main tab                                expressions   triggers functionality in
Initializations subtab                                the Display application.
                                                      Do not change this
Javascript subtab                       javascript    setting in the production
                                                      system.

                                                      The language used on
                                                      the form. The default is
                                                      English (EN).

                                                      Expressions that set the
                                                      initial values for variables
                                                      and fields. Service
                                                      Manager evaluates these
                                                      expressions before the
                                                      screen appears.

                                                      The JavaScript subtab is
                                                      executed after the
                                                      Initializations subtab. It is
                                                      used to set and initialize
                                                      variables, and run
                                                      expressions on the
                                                      screen being initialized.

Options tab

Field Name (*Required) Field ID                                             Service Manager 9.81

Option                                  gui.option  Description

#/Label/Action/Condition                            Click Search () to select
                                                    a Display Application
This PDF was generated on May 23, 2026              Option definition.

                                                         Detail options:
                                                         These numbers
                                                         also depend on the
                                                         display screen and
                                                         whether the option
                                                         will appear on the
                                                         detail options or list
                                                         options. For
                                                         example, the
                                                         display options
                                                         greater than 200
                                                         with Screen ID
                                                         apm.edit.problem
                                                         appear on the detail
                                                         options of an
                                                         incident.
                                                         List options: These
                                                         numbers also
                                                         depend on the
                                                         display screen and
                                                         whether the option
                                                         will appear on the
                                                         list options or detail
                                                         options. For
                                                         example, the
                                                         display options
                                                         greater than 200
                                                         with Screen ID
                                                         apm.list.problem
                                                         appear on the list
                                                         options of the
                                                         incident.

                                                                                                Page 133 of 168
Field Name (*Required)                  Field ID                          Service Manager 9.81
Events subtab                           event
Event/Action/Condition                            Description

                                                  Click Search () to select
                                                  a Display Application
                                                  Event definition.

Related topics

Display application


1.1.5.2.2. Display application option
definitions

The display application allows System Administrators to customize certain features of
their system without altering RAD code. You can select an option that performs an
important function in your system within the Display application option definitions
form. The following fields can be defined in the Display Application Option Definitions
( displayoption.g ) form.

Field Name (*Required)                  Field ID                               Service Manager 9.81
*Screen ID                              screen.id
                                                       Description
Modifies Record                         modify.record
                                                       The name of the
                                                       displayscreen record
                                                       that this option is
                                                       associated with.

                                                       If selected (set to true),
                                                       indicates that using this
                                                       display option may make
                                                       changes to the record.
                                                       The display routine
                                                       recognizes this and
                                                       locks the record before
                                                       executing the action
                                                       defined in the Action
                                                       field.

Field Name (*Required)                  Field ID                          Service Manager 9.81
*Action                                 action
                                                  Description
This PDF was generated on May 23, 2026
                                                  The display action,
                                                  which is a direct link to
                                                  the action in the states
                                                  record. Predefined
                                                  values include the
                                                  following:

                                                       Do Nothing: With
                                                       this action, the
                                                       display application
                                                       will execute any
                                                       statements and
                                                       RAD applications
                                                       defined in the
                                                       display option and
                                                       then return to the
                                                       original screen.
                                                       Redraw: Refreshes
                                                       the screen. The
                                                       cursor remains in
                                                       the same field, but
                                                       if this is a multi-line
                                                       field, the focus
                                                       resets to the top of
                                                       the field.
                                                       Close: Exits the
                                                       current screen to
                                                       the calling
                                                       application.
                                                       More: Selecting this
                                                       action has the same
                                                       effect as selecting
                                                       Do Nothing.
                                                       NULL: If the Action
                                                       field is blank,
                                                       Service Manager
                                                       assigns a value of

                                                                                              Page 137 of 168
 Field Name (*Required) Field ID                                Service Manager 9.81

This PDF was generated on May 23, 2026  Description

                                             NULL to the Action
                                             field.
                                             UNKNOWN: If no
                                             option has a true
                                             condition, Service
                                             Manager assigns a
                                             value of
                                             UNKNOWN to the
                                             Action field. This
                                             only occurs if the
                                             condition for the
                                             option has changed
                                             to false by user
                                             input.
                                             return:
                                             ok: Save and exit.
                                             cancel: Exit without
                                             save.
                                             skip: Skip execution
                                             of a script.
                                             views: Display a list
                                             of alternate viewing
                                             forms.
                                             extend:
                                             find: Find the
                                             related record
                                             detail.
                                             fill: Fill in
                                             information from a
                                             related record.
                                             validatefield:
                                             useroptions:
                                             Execute user
                                             options defined in
                                             Format Control.
                                             closeapplication:

                                                                                    Page 138 of 168
Field Name (*Required)                  Field ID                          Service Manager 9.81
*Unique ID                              id
                                                  Description

                                                  The unique ID of the
                                                  option generated by the
                                                  system and made up of
                                                  the screen ID plus
                                                  action. If multiple
                                                  records for the same
                                                  action are required, the
                                                  GUI option is also
                                                  appended.

Field Name (*Required)                  Field ID                            Service Manager 9.81
*GUI option                             gui.option
                                                    Description
This PDF was generated on May 23, 2026
                                                    The following guidelines
                                                    should be adhered to
                                                    when entering a value
                                                    into the GUI option.

                                                         Tool tray: Enter
                                                         numbers less than
                                                         200.
                                                         Detail options:
                                                         Enter numbers
                                                         greater than 200.
                                                         List options: Enter
                                                         numbers greater
                                                         than 200.
                                                         Note: Option
                                                         numbers between
                                                         4001 and 4099 and
                                                         over 32,000 are
                                                         reserved for system
                                                         use.

                                                    To look up the ID
                                                    numbers for the GUI
                                                    options for buttons on
                                                    detail forms, go directly
                                                    to the form, using Forms
                                                    Designer, and look at the
                                                    property Button ID on the
                                                    buttons inside the form.
                                                    To find out the GUI
                                                    options for tool tray or
                                                    menu options, find the
                                                    default label or text
                                                    alternative that matches
                                                    the item.

                                                                                                Page 140 of 168
Field Name (*Required)                  Field ID                                 Service Manager 9.81
                                        balloon
Balloon Help (If Option                                  Description
greater than 200)
                                                         The text string that
Text Option                             txt.option       appears when the cursor
                                                         is held over a button to
*Default Label                          default          offer more information
                                                         about the button's
Bank                                    txt.bank         function.

Text Alternative                        txt.alternative  The number of this
                                                         option in the Text mode.
This PDF was generated on May 23, 2026                   The Text Option was
                                                         originally used for text-
                                                         based clients. This field
                                                         is no longer needed.

                                                         The default label for the
                                                         option, which is required
                                                         on GUI mode. You could
                                                         use this as a way to
                                                         identify display options,
                                                         such as Create
                                                         Template from Record.

                                                         Determines the set of
                                                         function keys with which
                                                         this option is grouped.
                                                         This field is required only
                                                         when 11 or more options
                                                         appear on a form. Option
                                                         12 is reserved for the
                                                         More button. This field is
                                                         no longer needed.

                                                         If not NULL, determines
                                                         the label used for the F-
                                                         key in a Text form. This
                                                         field is no longer
                                                         needed.

                                                                                                     Page 141 of 168
Field Name (*Required)                  Field ID                           Service Manager 9.81
*Condition                              condition
                                                   Description

                                                   This field has to either
                                                   contain true or false ,
                                                   or an expression that
                                                   when evaluated returns
                                                   true or false . It
                                                   defines the condition for
                                                   the option. If the field is
                                                   true or the expression
                                                   evaluates to true , the
                                                   option appears to the
                                                   user.

Field Name (*Required) Field ID                                 Service Manager 9.81

                                        Description

                                                    Note

                                                        The
                                                        out-of-
                                                        box
                                                        records
                                                        are
                                                        read-
                                                        only for
                                                        this
                                                        field.
                                                        It is
                                                        possibl
                                                        e to
                                                        have
                                                        two
                                                        display
                                                        option
                                                        records
                                                        with the
                                                        same
                                                        display
                                                        screen
                                                        and the
                                                        same
                                                        GUI
                                                        option,
                                                        but they
                                                        have to
                                                        have
                                                        mutuall
                                                        y
                                                        exclusiv
                                                        e
                                                        conditio
                                                        ns.

Field Name (*Required)                  Field ID                                  Service Manager 9.81
User Condition                          user.condition
                                                          Description
RAD tab                                 post.expressions
                                                          Same rules as the
PreRad Expressions                                        Condition field. This field
subtab                                                    has to either contain
                                                          true or false, or an
PreJavascript subtab                    javascript.pre    expression that when
                                                          evaluated returns true
RAD subtab                              application       or false. The User
Rad Application                                           Condition expression
                                                          overrides the Condition
                                                          expression.

                                                          RAD expressions
                                                          evaluated when this
                                                          option is selected, but
                                                          before the RAD
                                                          application is executed.

                                                          JavaScript expressions
                                                          evaluated when this
                                                          option is selected, but
                                                          before the RAD
                                                          application is executed.

                                                          The RAD application to
                                                          call when an operator
                                                          selects this option. Note:
                                                          The RAD application,
                                                          us.launch.external,
                                                          doesn't support
                                                          launching a URL that
                                                          contains a semi-colon.

Field Name (*Required)                  Field ID                                      Service Manager 9.81
Separate Thread?                        new.thread
                                                              Description
Names                                   names
                                                              This field indicates
Values                                  values                whether or not the RAD
                                                              application is executed in
Post Rad Expressions                    post.rad.expressions  a new application thread.
subtab
                                                              The parameters to pass
Post Javascript subtab javascript.post                        to the RAD application.
                                                              Optional, unless required
Comments tab                            comments              by the RAD routine being
                                                              executed.

                                                              The value of each
                                                              parameter to pass to the
                                                              RAD application.
                                                              Optional, unless required
                                                              by the RAD routine being
                                                              executed.

                                                              RAD expressions to be
                                                              evaluated when this
                                                              option is selected, but
                                                              after the RAD application
                                                              is executed.

                                                              JavaScript expressions
                                                              evaluated when this
                                                              option is selected, but
                                                              after the RAD application
                                                              is executed.

                                                              Additional comments on
                                                              this displayoption.

Related topics

Display application


1.1.5.2.3. Restricting access to display
options

As a system administrator, you may wish to restrict users’ access to certain display
options based on their system rights. This is accomplished by creating an expression
in a displayoption record that determines who may use the option. This expression is
constructed with capability words found in a user’s operator record. You may use
existing capability words or create new ones that more narrowly define the
restrictions.

To restrict access to a display option, perform the following steps:

     Identify the option and the group to whom you want to deny access.
     Define a capability word unique to the option.
     Add your capability word to the operator records of all users to whom you wish
     to grant access to the option.
     Create a condition expression in the displayoption record using your new
     capability word.

Related topics

Display application
Displayoptions
Selecting display options


1.1.5.2.4. Selecting display options

Select an option that performs an important function in your system.

     Is this option part of a broader functionality?
     Should all users with rights to this functionality have access to this option?

For example, should all users with access to Incident Records in Incident
Management be able to close a record?

By using a condition expression in a displayoption record, a system administrator
can limit a user’s right to close record without restricting rights to the other features of
Incident Management or incident record options.

Note: Users with SysAdmin capability will be able to view, update and save existing
incident records, but will not be allowed to close records.

Related topics

Display application
Displayoptions
Example: Adding a URL link to a menu
Adding and changing the image icon for menu and toolbar items
Restricting access to display options
Access display records
Define display conditions
Access menu records
Create a displayscreen record
Create a displayoption record
Add or change the image icon for options menu and toolbar items
Define display conditions
Add a capability word
Displayevent database dictionary keys
Displayoption database dictionary keys
Common option icon names


1.1.5.2.5. Calling an application

Display panels allow the system administrator to set up a series of actions that
otherwise would have to be hard-coded into each individual application. Among the
added functionality is the ability to call separate applications from within the current
application.

An example of this is calling the build.list application from a combo box on the
problem.initial form.

The call to build.list recreates a list of viable subcategory, location, or other options,
based on the information already appearing on the problem.initial form. When calling
an application, several options are available, including threaded windows and
scripting.

Related topics

Display application
Displayoptions
Selecting display options
Example: Adding a URL link to a menu
Adding and changing the image icon for menu and toolbar items
Restricting access to display options
Access display records
Define display conditions
Access menu records
Create a displayscreen record
Create a displayoption record
Add or change the image icon for options menu and toolbar items
Define display conditions
Add a capability word
Displayevent database dictionary keys
Displayoption database dictionary keys
Common option icon names


1.1.5.2.6. Custom RAD

Determine whether your display screen record should apply to a single form or be
available to all the forms within your application. If applying to a single form, consider
using Format Control. If you want to apply the display options to a single form, enter
the name of that form in the Format field in the displayscreen record. If you want the
same display options to be available on multiple forms, you must bind the Format field
to the appropriate local variable. This is the variable you have defined in the Array of
local variables field of the display panel in your RAD application.

When you are creating your displayoptions, the values you enter in the Action field of
the displayoption record must be defined on a decision panel in your RAD application
as $L.action=“<action type>”

Related topics

Menus
Display application
Displayoptions
Selecting display options


1.1.5.2.7. Creating displayscreen records

Your system contains a number of displayscreen records that have been predefined
in the RAD code. Some of these records bind their options to a specific form, while
others bind the options to local variables for use with multiple forms. If you edit an
option in a displayscreen record used by more than one form, every form that uses
that Screen ID is affected. If you need option combinations that don't exist in the
displayscreen records provided with the standard system and don't wish to edit any
of the existing Screen IDs, you must create your own unique displayscreen record.
You might choose to do this when:

     Writing custom RAD applications
     Creating script forms

Displayscreen records are created and hard-coded into RAD applications, which
search for the appropriate Screen ID when called.

     RAD programmers who write custom applications for their enterprise can create
     new displayscreen records.
     Non-RAD licensee's can add display screens to support specific scripts because
     the display screen name is specified within the script record and is not hard
     coded in RAD.

Related topics

Menus
Display application
Displayoptions
Selecting display options
Create a displayscreen record


1.1.5.2.8. Displayoption Database
Dictionary keys

These keys control how the data is placed and retrieved from the file. Use values
based on these keys when issuing queries on the displayoption file.

Field                                   Key               Description
                                        unique
unique.id                                                 Ensures record numbers
                                        unique            are unique
screen.id
language                                                  This key ensures that no
gui.option                                                two GUI options can
gui.sig                                                   have the same screen ID,
                                                          language, or condition.

screen.id                               unique            This key ensures that no
                                                          two text options can
language                                                  have the same screen ID,
txt.bank                                                  language, text bank, or
txt.option                                                condition.
txt.sig

action                                  nulls&duplicates  Useful when querying by
                                                          action.
screen.id
language
gui.option

Related topics

Display application
Displayoptions
Selecting display options


1.1.5.2.9. Displayevent Database
Dictionary keys

Field                                   Key               Description
unique.id                               unique
                                        unique            Ensures record numbers
screen.id                                                 are unique.
language                                nulls&duplicates
event                                                     This key ensures that no
event.sig                                                 two Events records can
                                                          have the same screen ID,
actions                                                   language, event.name,
screen.id                                                 object.name, or
language                                                  condition.
event
                                                          Useful when querying by
                                                          action.

Related topics

Display application
Display functions
Selecting display options


1.1.5.2.10. Access display records

Applies to User Roles: System Administrator
The Display application reads data from the following data files:

 File name                                                                                      Service Manager 9.81
 displaymaster
 displayscreen                          Description

This PDF was generated on May 23, 2026  The displaymaster file contains the
                                        general controls for Display. There is
                                        one record per supported language.
                                        The default is ENG for English.

                                        A displayscreen record defines the
                                        attributes of a screen and provides the
                                        user with access to the individual
                                        records for options and events. Use the
                                        vertical scroll bar to view the entire
                                        form.

                                        All Service Manager applications using
                                        rio or fdisp panels have been
                                        converted with the display.cv utility
                                        before being shipped to you. The
                                        displayscreen records have been
                                        created and hard-coded into RAD
                                        applications, which search for the
                                        applicable Screen ID when called.

                                        RAD programmers who write custom
                                        applications for their enterprise will
                                        need to create new displayscreen
                                        records. Non-RAD licensee's can add
                                        display screens to support specific
                                        scripts because the display screen
                                        name is specified within the script
                                        record and is not hard coded in RAD.

                                        The existing displayscreen records are
                                        powerful tools for controlling the
                                        display attributes of certain forms
                                        within your system. Knowing which
                                        Screen ID is attached to a form is vital
                                        if you are to take full advantage of the
                                        features offered by the Display
                                        application.

                                                                                                                        Page 154 of 168

File name                               Description
displayoption
                                        Set the various display options in the
                                        displayoption file. Display options can
                                        appear in the More Actions menu, as
                                        buttons in the toolbar, and as F–keys.
                                        Option numbers less than (<) 200 in
                                        GUI mode appear as buttons. Option
                                        numbers greater than(>) 200 appear in
                                        the More Actions menu.

                                        Note: Option numbers between 4001
                                        and 4099 and over 32,000 are
                                        reserved for system use.

                                        RAD applications can be called from
                                        Options Definition records. Access the
                                        Options Definition record from any
                                        displayscreen record:

                                             Click on the Ellipses button for a
                                             record list of all options.
                                             Click on a numbered option
                                             button for individual displayoption
                                             records.

displayevent                            The displayevent file defines the events
                                        a screen will handle. Access the form
                                        by clicking an Event button in a
                                        displayscreen record.

To access display records:

   1. Click Tailoring > Database Manager.
   2. Type display in the Form field of the Database Manager form.
   3. Click Search. A record list of data file records opens.
   4. To configure the Display application, open the displaymaster file first. Or select

     another file from the record list, and double–click the name to open it.

Related concepts


Display application
Displayoptions
Selecting display options


1.1.5.2.11. Create a displayscreen record

Applies to User roles: System Administrator

The displayscreen record is the control point for applying options to Service Manager
forms using the Display application. You must create the displayscreen record first,
then create the individual options in the displayoption file.

You can create a display screen record from scratch, or base your new record on an
existing record.

To create a new displayscreen record:

   1. Access the displayscreen file.
   2. Type a unique name in the Screen ID field of the blank displayscreen record

     form. This name should identify the file involved and describe the process to
     which the options are attached. For example, a displayscreen record created for
     a script that opens incident records might be called pm.script.open.

   3. In the Format field, type the name of the form on which the new options should
     appear.

                   Note

                Type the appropriate format variable if you want the display options
                to appear on more than one form.

   4. Complete any other applicable fields.
   5. Click Add. The system creates the displayscreen record and displays the

     message “Record Added.”

To create a displayscreen record based on an existing displayscreen record:

   1. Access the displayscreen file.
   2. Open the displayscreen you want to use as a base. For the example, select

     approval.view.
   3. Change the Screen ID to a unique name. For the example, change the name to

     new.approval.view and then click Add. The Include displayoption/displayevent
     prompt opens.
   4. Specify whether to add any associated displayoption or displayevent records
     when the new displayscreen record is added by checking the applicable box.


           If you check Include displayoption records, new.approval.view records will
           be created from the approval.view records in the displayoption file.
           If you check Include displayevent records, new.approval.view records will
           be created from the approval.view records in the displayevent file.
   5. Click Next. The system creates the displayscreen record and any optional files
     you chose and displays the message “Record Added.”

Related topics

Display application
Displayoptions
Selecting display options
Access display records


1.1.5.2.12. Create a displayoption record

Applies to User roles: System Administrator

Data files within Display contain the individual records, or screens, in which options,
events, and window controls are defined. Each screen is attached to a particular
application and controls the features appearing on the forms associated with that
application. For example, you can create a Validity lookup option in the More Actions
menu by creating a displayoption record.

To create a displayoption record:

   1. In the Service Manager command line, type do and then click the Excecute
     Command icon.

   2. In the Screen ID field of the blank displayoption record form, type the name of
     the screen ID you created for the displayscreen record.

   3. Enter the applicable action for your option in the Action field.

   4. Complete the displayoption record.

     Important Notes:

           If you create a displayoption by copying an existing record, you must
           change the screen ID and leave the Unique ID field blank; the system will
           assign a unique ID to your option.
           If you are defining a Fill option, be sure that the value in the GUI option field
           matches the Button ID value of the field in the form.
   5. Click Add to add the record to the database.

   6. Open the displayscreen record for your screen ID and select the Options tab to
     make sure your new option appears there.

                   Tip

                The maximum number of displayoptions for a displayscreen is 300.

Related topics

Display application
Displayoptions
Selecting display options
Access display records


1.1.5.2.13. Define display conditions

Applies to User roles: System Administrator

Access to an option is controlled by the Condition field in a displayoption record. This
field may evaluate to true or contain an expression defining a condition for display.

In the following example, you restrict access to the Close button in the toolbar of
Incident Management incident records to only users with SecClose capabilities.

To define display conditions:

   1. Select Tailoring > Tailoring Tools > Display Options.
   2. Enter the screen ID of the update form, apm.edit.problem , and press Enter.
   3. Locate the Close option from the record list. The User Condition field is empty

     by default. The User Condition is processed after the Conditions field and
     operates at the user-specific level.
   4. Add the following condition statement to the User Condition field:
      index("SecClose", $lo.ucapex)>0

     Where SecClose is the name of the capability word you created.
   5. Click Save to record the modification to the record.
   6. Click OK to back out and return to the home menu.
   7. Test the new display option, as follows:

        1. Open the Incident Management Queue and view an incident record. The
           Close button should appear.

        2. Open a new client as an operator who does not have the capability word
           defined in the operator record.

        3. Go to the Incident Management Queue and view the same record as you
           did above. The Close button should not appear for the operator whose
           record did not contain the capability word.

Related topics

Display application
Displayoptions
Selecting display options
Access display records
Access menu records
Define display conditions
Create a displayscreen record
Create a displayoption record


Add or change the image icon for options menu and toolbar items
Define display conditions
Add a capability word
Displayevent database dictionary keys
Displayoption database dictionary keys
Common option icon names


1.1.5.2.14. Enable the Merge Conflicted
Updates function for customized user
operations

Applies to User Roles:System Administrator
The Merge Conflicted Updates feature is out-of-box for Service Manager 9.61 default
user operations. However, to apply the Merge Conflicted Updates function to a record
with customized operations, you need to tailor your customized operations first.
The following example describes how to enable the Merge Conflicted Updates
function for all operations on Service Desk. In this example, you need to:

   1. Enable manual merge operation for Service Desk.
   2. Enable auto merge operation for all operations.

Task 1: Add a display option for the Merge Conflicted
Updates function

   1. Click Tailoring > Tailoring Tools > Display Options.
   2. As listed in the table below, fill in the required fields to add the display option:


Field                                   Value
Screen ID
                                        The display screen you are using to
Unique ID                               display Service Desk records. For
Action                                  example, cc.edit.incident.
GUI option
                                        cc.edit.incident_merge
Text option
                                        merge
Bank
Balloon Help                            Unused number under the display
Default Label                           screen. For example, 5.
Text Alternative
Condition                               Unused number under the display
                                        screen. For example, 5.

                                        1

                                        Merge

                                        Merge

                                        Merge

                                        updatestatus($L.file)=$G.RC.MODIFI
                                        ED and gui() and $L.mode~#"add"

   3. Click Add.

Task 2: Add process call in the State record of a Service Desk
Object.

   1. Click Tailoring > Document Engine > States.
   2. Search for the state that you use to view a Service Desk record. For example,

     sm.view.

   3. As listed in the table below, add the values to the last line of the Non-base
     methods table:


Column                                  Value
Display Action                          merge
Process Name                            record.update.conflicts
Condition                               true

   4. Click Save.

By completing the first two tasks, you have enabled the manual merge function for
Service Desk. If the record being updated has been modified since being read, the
Merge button appears on the option toolbar.

Task 3: Enable auto merge operation for all operations.

   1. Click Tailoring > Tailoring Tools > Display Screens.
   2. Search for the sd.view record.

   3. On the Javascript tab, append the following code in the text box:

      var mergeResult = lib.recordUpdateConflicts.autoMerge();

   4. Click Save.

By completing the third task, you enable the auto merge function for all operations. If
there are conflicted updates of the same field, the auto merge process doesn't merge
this record. Instead, you must perform a manual merge operation.

Note

In some scenarios, the auto merge operation won't be properly triggered.
For example, if some background SLA operation is triggered to update the
record, then the auto merge operation may not work.
````
