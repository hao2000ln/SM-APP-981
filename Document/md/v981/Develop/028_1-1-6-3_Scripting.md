---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.1.6.3 .. 1.1.6.3
printed_pages: 753-775
---

# 1.1.6.3 Scripting

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.6.3. Scripting

Rapid Application Development (RAD) code controls the screen flow within Service
Manager applications. Scripting enables you to interrupt the normal screen flow to
display a series of forms or execute decision-tree processing without modifying the
original RAD code. Scripting doesn't affect the RAD screen flow.

When scripting is useful

Scripting is useful for any process that requires an operator to supply prerequisite
information. For example, during the incident determination cycle you can create a
script flow for operator-entered data. Based on how a caller replies to questions
regarding the incident, your script determines which screen the operator sees next.
While the script is executing, the operator-entered data is accumulated in a file
variable which is returned to the calling application when the script is complete.

When a script displays a form

During execution when a script displays a form, it has the look and feel of a
customized RAD application and can be used in place of most RAD routines designed
to gather data from a caller. Each script can display a standard form and execute its
Format Control record. The instructions in the Format Control record where there is a
condition on "display" that evaluates to true will be executed before the form opens,
and the instructions where there is a condition on "add" that evaluates to true will be
executed after the user clicks OK. If a Format Control definition fails (an error
condition is detected), the user returns to the last script form.

When multiple complex decisions must be made

Scripting is also beneficial when multiple complex decisions must be made in order to
reach a conclusion. For example, Change Management approval requirement
conditions are normally based on the data contents of one field in the change record.
Such a condition might be expressed as header,risk.assessment in $cm3r>4.
However, there may be circumstances where the approval requirement condition is
based on the values of several different fields. For instance, there may be three fields
that affect the approval requirements: division, area, and department. Hard coding all
the possible combinations of these field values into condition statements in RAD
involves a great amount of work and would be nearly impossible to maintain. You can
define these conditions in scripting records which don't display forms but that allow
you to call a RAD subroutine or execute standard Service Manager processing
statements (similar to Format Control calculation statements). These options allow for


the manipulation of record data. At run time, the script is a decision-tree which results
in significant processing reductions over the original method of RAD coding.

Related topics

Script flow
Scripting processing flow
Diagramming the script flow
Using fill boxes in script forms
Executing scripts
Script reports


1.1.6.3.1. Scripts

A script is a series of instructions run from an option. These may include a
progression of screens, requesting information or user-specific responses, or
instructions to perform certain computations with existing record data. Since the
script call is set up and performed at the displayoptions application level, it doesn't
need to be hard-coded into the RAD of the application. This allows for easier
maintenance and modification.

Script display calls often employ the script.execute application, specifying the
progression of forms to appear for the user. An example of this form of display call is
seen in Service Manager Request Management, where the New button option forces
the user through a script at open time. The script calls a preliminary information
screen which requests certain data that's later populated into a new Request
Management record. The screen displayed serves as an organized and user-specific
entrance point into the application.

Related topics

Stored queries
Using stored queries in display objects
Menu option searches


1.1.6.3.2. Script forms

You can create unique displayoptions for your script forms which are unrelated to
those appearing in the application that executes the script. Changes to the RAD code
are unnecessary when creating displayscreen records for this purpose; the
appropriate variables have been hard coded into the script.execute application and
need only be applied correctly.

Format variable

The format variable for script.execute is $L.script.format and is hard coded into the
RAD layer of the application. Enter this variable into the Format field of any
displayscreen record to bind its options to multiple script forms. This local variable is
bound to the display form you entered in the Format field on the script definition
record.

To apply unique options to a single form in a script, name the form in the Format field
of the displayscreen record rather than use the local variable.

Display actions

Actions for displayoptions in scripts are defined on a decision panel in the RAD code
of the script.execute application. Unless you possess a RAD license and are capable
of programming in RAD, you are limited to the following, hard coded actions:

     do nothing
     back
     close
     more
     redraw

Related topics

Display application
Creating displayscreen records
Displayoptions


1.1.6.3.3. Script flow

Script flow defines the order in which script panels execute. Scripts can move in a
straight line from start to finish, or branch into several possible processing flows.

Condition statements that must evaluate to true before certain scripts can execute,
control more complex script flows. If none of the specified conditions evaluates to
true, the script flow is considered complete, and control passes back to the calling
application.

Related topics

Scripting
Scripting processing flow
Diagramming the script flow


1.1.6.3.4. Scripting processing flow

Each script can execute a Service Manager form, display options, a RAD subroutine,
and condition statements. Note that each script can use all of these options. The
sequence of this processing is:

   1. Execute any display Format Control processing associated with the script’s form.
   2. Display the script form.
   3. Execute any add Format Control processing associated with the script’s form.
   4. Execute statements defined in the script.
   5. Execute the RAD application defined in the script.

Related topics

Scripting
Script flow
Diagramming the script flow


1.1.6.3.5. Diagramming the script flow

Develop a map of the entire flow showing the name of the form (if any) displayed by
each panel and the conditions controlling the flow from panel to panel. Follow the
map throughout the scripting process to avoid simple errors that could prevent your
script from executing properly.

The first panel of this script provides an incident record number for your incident. The
second panel displays a form requesting category and asset information. Depending
upon the category selected, the third panel displays a category-specific form before
exiting back into the common flow. Successive forms gather the remainder of the
information needed to open the record: assignments, details, service agreements, and
contacts. When the script exits, the new record containing all the data you
accumulate opens and is added to the database.

Notice that the two conditional script panels for the hw.desktop and hw.mainframe
categories display the same form. You can write a single condition statement to
include all the categories using that form.

Related topics

Scripting
Script flow


1.1.6.3.6. Using fill boxes in script forms

For a Fill box to function properly on a script form, you must create the following
additional records:

     Link record: Select Link from the Options menu in Forms Designer and establish
     a link between the field in your script form and the field in the source file.
     Format Control record: Select Format Control from the Options menu in Forms
     Designer and add a Format Control record granting Fill privileges.
     Displayscreen record: The displayscreen controls the options that are displayed
     with a form. Create a displayscreen record in which you define displayoptions
     for your script forms, including a Fill button. Enter the Screen ID of your new
     record in the Display Screen field of each script definition that displays a form in
     which a Fill box appears. You can create unique displayscreen records for each
     form in the script flow or associate a single record with all the forms.

Note: You can use a combination of displayscreen records and Format Control to
activate Fill buttons in your script.

Displayscreen record options

If you create a displayscreen record and want to bind its options to more than one
script form, you must enter the local variable $L.script.format in the Format field of
the displayscreen record. This variable is hard coded into the script.execute
application.

Defining displayoptions for script forms

When defining displayoptions for your script forms, refer to the following list of
possible actions that are hard coded into the script.execute application. Your choice
of options in the Action field is limited to the values in this list:

     ok
     back
     cancel
     skip
     views
     extend
     find
     fill
     validatefield
     redraw


     re draw
     closeapplication

Note: Use the ok action when defining a Continue option.

Related topics

Scripting


1.1.6.3.7. Executing scripts

After you have created your forms and the script definitions to display them, you must
decide how you want to execute the script. You have several choices:

     Incident Management (using profile records)
     Display option (from within an application)
     Format Control
     Stored query

Access the scripts file

You can access the scripts file using one of the following methods:

     Menu button
     Database Manager

Executing a script from Incident Management

Profile records within Incident Management allow you to specify the script to execute
when a user opens a new incident record. You can design a script that displays forms
containing only those fields necessary for recording the particulars of an incident. For
example, if the technician taking the call selects hw.network as the incident category,
a condition statement in the script exits to a panel that displays a network hardware
related form. When the script finishes, the record carrying all the necessary
information is created and the technician is ready to work on another issue.

Executing a script from displayoption

Use a displayoption to create a button, the Options menu and the Context menu
selections on a Service Manager form from which to execute your script. For
information on the Display application, see the related topics.

Executing a script from Format Control

Scripting can be called from the routines process of Format Control. It is important to
place the script call as the last item on the routine call list when executing a script
from Format Control.

Executing a script from a stored query

A script executed from a stored query searches for records by allowing the user to
select precise search parameters. The Service Manager standard system contains an


inactive script that can execute from a stored query to display a list of key words
relating to previous incidents. The stored query then uses the key word selected to
search for similar incidents.

This stored query runs from an open incident record using either Format Control or a
displayoption (Screen ID: apm.edit.problem ). In this example, a displayoption has
been created that adds an option called Probable Cause to the More Actions menu of
an open incident record. This option runs the stored query called probcause.user.

The stored query, probcause.user, executes the script called probcause.user.1.

The script probcause.user.1 has a single panel that displays the probcause.user.1
form. The condition for exit (null($key.words)) requires the user to choose a key word
before allowing the script to exit.

Important: Scripts executed from stored queries typically set values into the same
fields used by the query to retrieve records. In this example, the common field is
key.words.

The script is executed before the form from the query (probable.cause.user) opens.
The form opened by the script is called probcause.user.1 and supplies the query form
with a key word for searching.

When the user selects a key word and clicks OK, the script exits. The stored query
then uses the key word to search the probcause file for matching entries. If more than
one match is found, the system displays a record list of possible causes for your
incident.

Click a selection to view the details with the probable.cause.user form. When you
have finished viewing all the choices, click Cancel to return to the incident record.


1.1.6.3.8. Script reports

Script reports display the entire flow with different views. You can view the entire flow
or just a part of it. You can display and print the details of each panel for comparison
or troubleshooting. There are three script reports you can print:

     Script Flow — generates a summary report of all possible script flow paths
     based on the assumption that the currently displayed script panel is the starting
     point of the flow. This report enables you to isolate each separate branch within
     the script.
     Script Detail — lists all the fields in the script definition record and the values
     you have entered for the currently displayed script panel.
     Script Tree — generates a summary report showing the logical flow of the script
     panels in an outline form. The currently displayed script panel is used as the
     starting point. This report enables you to see the relationships of panels to one
     another at a glance.

Each report has the same header and prints in the default printer font.

Related topics

Scripting
Print a report on a script


1.1.6.3.9. Access a script record from a
menu

Follow these steps:
   1. Click Tailoring > Scripts.
   2. Click Search.
     A record list of scripts opens.
   3. Select the target record.

Related topics

Scripting
Executing scripts


1.1.6.3.10. Access a script record from the
Database Manager

Accessing scripting from the Database Manager gives you additional options for
manipulating the data. For example, you can perform a mass update to change the
cluster name for each panel in your script flow or you can unload selected records to
an external file.

   1. Click Tailoring > Database Manager.
   2. Type scripts in the Form field, and then click Search.
   3. Click Search again.

     A record list of existing script records opens.

   4. Select the target record.
   5. Make any necessary changes, and then click Save to save your changes.

Related topics

Scripting
Executing scripts


1.1.6.3.11. Create a script

Rapid Application Development (RAD) code controls the screen flow within Service
Manager applications. Scripting enables you to interrupt the normal screen flow to
display a series of forms or execute decision-tree processing without modifying the
original RAD code. Scripting doesn't affect the RAD screen flow. To learn more about
scripting, see Scripting.

To create a script:

   1. Design and diagram the script flow showing the names of all script panels and
     forms. For information, see Diagramming the script flow, Script reports, and
     Define the scripts.

   2. If your script requires special forms, create them using the Forms Designer
     utility. Be sure to follow the naming conventions defined in your map. Create any
     support links and Format Control that are necessary for your forms. See
     Tailoring Best Practices for aids in creating forms.

   3. Create the script definition records. For information, see Using fill boxes in script
     forms, and Script forms.

   4. Add your script to the Service Manager application, Format Control record, or
     stored query record that will execute it. See Executing scripts.

Note: If you include expressions in your script, take care to use good naming
conventions to ensure unique names for any local variables you define. This helps
you to avoid potential naming conflicts and achieve desired tailoring results.

Related topics

Scripting
Creating and editing forms
Format Control


1.1.6.3.12. Define the scripts

After diagramming the flow, the next step is to create each panel in the script flow. Be
sure to follow the naming conventions for scripts and forms you have established in
your script map.

   1. Access a blank script definition record. For more information, see Executing
     scripts.

   2. Complete the definition for the first script in your flow.
     For example, enter the following values:

Field                                   Value       Parameter
Name                                                Values/Conditions
Start                                   pm.number
Application                             true        $script
Name                                    getnumb.fc  number
                                        record      string
Next Script                             prompt      Incident Management
                                        text        PM
                                        name        true
                                        string1

                                        pm.open.1

  Note: The value for Start is true, indicating that this is the first panel in the script
  flow.

  This panel associates a properly incremented incident record number with the
  data you are going to accumulate from the caller. This panel calls a RAD
  application only and doesn't display a form.
3. Click New to add your panel to the scripts database.
4. Click Back to return to a blank script definition form.
5. Complete the definition for the second script in your flow.
  In this example, we would enter the following values:


Field                                   Value               Parameter
                                                            Values/Conditions
Name                                    pm.number
Format                                  pm.select.category  category in
Skip Display                            false               $script="hw.desktop"
Bypass Cond                             false               or
Next Script                             pm.hw1              category in
                                        pm.hw2              $script="hw.mainframe
                                                            "
                                                            category in
                                                            $script="hw.network"

   6. Click New to add your panel to the scripts database.
   7. Create the remainder of the script definitions in your flow.

In this example, we must create specific definitions for each category (pm.hw1 and
pm.hw2) as well as the remainder of the scripts in the common flow (pm.open.2
through pm.open.5). Make sure that each panel except the last panel in the flow has
the name of the next panel to execute in the Next Script field.

In this example, panel pm.open.5 displays a form and calls the RAD application
apm.edit.problem. This application displays any information you have gathered in an
incident record and enables you to abandon the incident or add it to the database.

Related topics

Scripting


1.1.6.3.13. Define an initial script in an
Incident Management profile record

Follow these steps:

   1. Click System Administration > Ongoing Maintenance > Profiles > Incident
     Management Profiles.

   2. Click Search. A list of Incident Management profile records opens.
   3. Select a profile record.
   4. Select the Forms tab.
   5. Select Initial Script and enter the name of the first panel of your script in the

     adjacent field.
   6. Click Save to save your changes.

Related topics

Scripting


1.1.6.3.14. Execute a script from a
displayoption

1. Determine the screen ID of the form for which you want to define the option.
2. Open a blank displayoption record using one of these methods:

        Type do in the command line and press Enter.
        Type displayoption in the Form field of the Database Manager dialog box.
        Click Tailoring > Tailoring Tools > Display Options.
3. In the Screen ID field, type the screen ID for the form.

4. Click Search.

  The displayoption records for that form are listed.

5. Scan the list of options to determine an available number for your new option.

  Remember: Option numbers < 200 appear as buttons in the toolbar, and option
  numbers > 200 appear as Options menu items.

6. Create the record from scratch or modify an existing record.
7. Type script.execute in the RAD Application field and enter the following values:

Name                                    Value
file
name                                    $L.filed

                                        Name of the first script panel in the
                                        flow

8. Click Add.


1.1.6.3.15. Execute a script from Format
Control

1. Click Tailoring > Format Control.
2. In the Name field, type the name of the Format Control record you want to edit.

  For example, type apm.quick .
3. Click Search.
4. Click Subroutines, or click Subroutines from the Options menu.
5. In the Application Name field, type script.execute and enter the following

  values:

Name                                    Value
file
name                                    $file

                                        Name of the first script panel in the
                                        flow

6. In the Before field, type true or type an expression for a condition that evaluates
  to true to execute the script before any other processing takes place.

7. In the Dis field (Display field), type true or type an expression for a condition that
  evaluates to true to execute the script before apm.quick opens.

8. Click Save to save your changes.
9. Click OK.


1.1.6.3.16. Delete a script

You can delete script panels and the related forms manually or allow the system to
delete all the elements of a script flow automatically.

   1. Select the first script in the flow. To access scripts, see Executing scripts.
     Note: If you select any other script panel in the flow, you may be given a partial
     listing only. Partial lists stop at any script panel in the flow whose display is
     controlled by a conditional statement. This feature enables you to isolate a single
     conditional branch of a script flow for deletion.

   2. Click Delete.
     A confirmation prompt opens asking if you want to delete the related forms as
     well.

   3. Select the Delete associated forms checkbox if you want to automatically delete
     all related forms.

   4. Click Delete.
     All the script panels in the flow and all the associated forms are listed. Scripts or
     forms used elsewhere in the system aren't listed.

   5. Click Delete to delete all the items listed in the form.
     If the deletion procedure is successful, the following message displays in the
     status bar: The Script/Format delete process is complete. Check for error
     messages.

   6. Click Cancel to exit the delete routine and return to the last form.

Related topics

Scripting


1.1.6.3.17. Print a report on a script

Follow these steps:

   1. Access a script definition record. For more information, see Executing scripts.
     You can report on any script panel in the flow. If you want to view the entire flow,
     run the report from the first panel.

   2. Click File >Print or the Print icon.
     A prompt asks you to select a report type.

   3. Select one of the radio buttons.
   4. Click Print.

Related topics

Script reports
````
