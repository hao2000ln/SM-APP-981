---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.7.5.9 .. 1.8.1
printed_pages: 2228-2258
---

# 1.7.5.9 Migrate legacy code to Process Designer

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.7.5.9. Migrate legacy code to Process
Designer

If you are upgrading to Service Manager Codeless from Service Manager Classic, all
the legacy coding technologies (format control, display option, and so on) are
supported by the Process Designer framework, and you can run your system in a
hybrid mode. You can also migrate your legacy technology code to Process Designer
technology, which is easier to maintain.


1.7.5.9.1. Enable a workflow

In a Service Manager Classic module, a workflow is usually configured in the
category, and the category table name and phase table name are configured in the
object.

To enable the workflow, you must configure the workflow location in the object
definition. If you set the location to "By Category," the workflow defined in the
category record is used. If you set the location to "In Object," you must set the
workflow in the object definition.



1.7.5.9.2. Configure the workflow

In a Service Manager Classic module, workflow phases are stored in the object-
specific phase table, and the workflow logic is defined in the category by using the
phases in sequence.

In Service Manager Codeless module, the workflow is configured graphically by using
the Workflow Designer in the web UI. You can use this to define more complex logic
between phases.


If your workflow location is set by category, the workflow name is specified in the
category record:


1.7.5.9.3. Enable Process Designer role-
based security

Service Manager Classic modules use the profile-based security model. This is
enabled by using the module-specific application (for example, rca.setup.globals for
Problem Management) in the object record, and set by the user in the operator table.
The settings are stored in module-specific tables (for example, rcenv for Problem
Management).

Process Designer provides a common role-base security model. This is enabled by
using the secRoleBasedAccess application in the object record, and set by the user in
the operator table.

The settings are stored in the secArea, secRights, and secRole tables. The security
area is specified in the datadict record.



1.7.5.9.4. Migrate the Format Control to
rule sets

In Service Manager Classic, business logic is mainly configured in Format Control.
Process Designer uses rule sets.

Format Control still works in Service Manager Codeless, but we suggest that you
move all logic from Format Control to the workflow rule sets, as follows.

Format Control                          Rule set
Primary Format Control "Add"
Primary Format Control "Update"         Object or workflow-based rule sets
Primary Format Control "Display"        "On add"
Primary Format Control "Initial"
Primary Format Control "Delete"         Object or workflow-based rule sets
Form level Format Control "Add"         "On update"
Form level Format Control "Update"
Form level Format Control "Display"     Object or workflow-based rule sets
Form level Format Control "Initial"     "On display"
Form level Format Control "Delete"
                                        Object or workflow-based rule sets
                                        "Initialization"

                                        Object or workflow-based rule sets
                                        "On update"

                                        Workflow phase-based rule sets "On
                                        Enter"

                                        Workflow phase-based rule sets "On
                                        update"

                                        Workflow phase-based rule sets "On
                                        display"

                                        Workflow phase-based rule sets
                                        "Initialization"

                                        Workflow phase-based rule sets "On
                                        update"



1.7.5.9.4.1. Mandatory validation

You can define Format Control validations on the master format control or the format
level format control.

To migrate validation to rule sets, you must:

   1. Define a rule set.
   2. Set the rule set to the corresponding workflow or phase rule sets.
   3. Add the Set Mandatory Fields rule to this rule set.




1.7.5.9.4.2. Validation against a table

To validate a field against another field in a table, you must define queries in master
format control or in format level format control. You must write the code for the
queries, manually create the scmessage, and indicate the ID if the message needs to
be localized.

To do this in Service Manager Codeless, you can define a Validate Against Table rule.



1.7.5.9.4.3. Set a field value

To set a field value by using Format Control, you must define the calculations in
master format control or in format level format control. Additionally, you must use a
RAD expression to write the field set statement (and the condition, if necessary).

To achieve this by using a Process Designer rule set, you can define a rule set and
assign it to the desired workflow or phase, and then add a Set Field rule to this rule
set.



1.7.5.9.4.4. Run a Wizard

In Service Manager Classic, wizards are run by calling the wizard.run RAD application.

To do this in Service Manager Codeless, you can simply use the Run Wizard rule.


1.7.5.9.4.5. Run Javascript

To run a JavaScript by using Format Control, you must define the JavaScript in master
format control or format level format control.

To do this in Service Manager Codeless, you can define a Run Java Script rule.



1.7.5.9.4.6. Additional supported rule
types

The following rule types are available in out-of-box Service Manager deployments.

 Rule type                                                                                      Service Manager 9.81
 Launch a URL
 Call a process                         Description
 Case Exchange                          Call a URL to launch a web page
                                        Call a Service Manager process record
 Run a wizard                           Trigger certain activities for the Case
 Clear Fields                           Exchange integration
                                        Run a Service Manager wizard
 JavaScript Validation                  Clear the specified field and related
                                        fields
 Run JavaScript                         Use JavaScript to perform actions and
                                        validations
 Mandatory Fields                       Use JavaScript to perform actions and
 Mandatory Variables                    validations
 Send Notifications                     Set fields as mandatory
 Launch a Script                        Set variables as mandatory
 Send HTML Email                        Send Service Manager notifications
                                        Launch a Service Manager script
 Start or Stop Clock                    Send an HTML Email to users or a
 Set Field                              group
 Set Field from Number                  Start and stop a Service Manager clock
 Validate Date                          Set a field value using JavaScript
 Field Validation Against a List        Set field based on a number record
                                        Validate a date against a date range
This PDF was generated on May 23, 2026  Validate a field against a list (global or
                                        defined)

                                                                                                                        Page 194 of 341
Rule type                                                                                       Service Manager 9.81
Validate against Table
Validate Text/Number                    Description
Field Validation Against a Table
Popup Message Box                       Validate a field against a field in
Assignment                              another table and fill data into other
                                        fields
Run Action
                                        Validate a field against a range of text
Run Scheduled Action                    or a number in another field of same
Group rules                             table

                                        Validate a field against a different table

                                        Create and configure popup message
                                        boxes that appear to end users

                                        Automatically distribute records (such
                                        as tasks or records) to the groups and
                                        individuals who are most able to
                                        process them

                                        Run actions (defined by rule sets) on
                                        records that have a specified
                                        relationship to the record that triggers
                                        the rule

                                        Run actions (defined by rule sets) on
                                        records after a specified length of time
                                        has passed

                                        Group multiple rules into a rule group
                                        with an overall condition.


1.7.5.9.5. Migrate the display options to
actions

In Service Manager Classic, you must use display options to configure the buttons in
a tray, more options list, or form.

In Service Manager Codeless, you can use actions to do this. Workflow actions and
Manual workflow transitions appear in trays and more options lists as "virtual" display
options, or on forms as buttons.

Display options still work in Service Manager Codeless, but we recommend that you
move all display options to workflow actions. To do this, follow these steps:

   1. Identify your custom actions in the legacy states.
   2. Examine the Display Screen field of each state to identify how the action is used

     in display options.
   3. For each of your new custom actions, create a new rule set that calls the

     process (mapped to the action in the state definition) directly. The "Available as
     action" option in the rule sets must be selected.
   4. Add the new actions to the workflows.

The mapping between the display action and the process is set in the state definition.

The definition of the display option that uses the action contains the following
settings:


     The value in the GUI option field indicates where the display option is located
     (tray, more option list, or button).
     The Default Label field defines the display name.
     The Condition field contains a RAD Expression that definesthe security control.

To do this by using a Process Designer action, you must first define a rule set in which
the "Available as action" option is selected.


Then, you must add a Call a Process rule to this rule set.

You can use this "action-type" rule set at the workflow or phase levels.


The Location column indicates where the display option is located (tray, more
option list, or button)
The ID column is set to the display name
You can use the condition editor to set security controls


1.8. Wizards

This document describes the Wizard tool that you use to create custom wizards, and
defines and describes each of the fields the tool includes. A detailed example walks
you through all of the steps involved in planning and building a sample wizard that
creates a new Service Level Agreement. For more troubleshooting information and
common errors, see Troubleshoot Service Manager Wizard.


1.8.1. Wizards Overview

Wizards provide a powerful way to gather user input and help your users quickly and
efficiently accomplish many different tasks within Service Manager. The Service
Manager applications include many out-of-box wizards, and the Service Manager
tailoring tools include a Wizard creation tool that enables you to design and build your
own custom wizards that can be called from the various Service Manager
applications and modules.

Prerequisites

Using the Wizard tool requires a solid understanding of the following areas, which are
covered in other parts of the Service Manager tailoring documentation:

     Designing and creating forms
     Using the syntax of the Service Manager system language
     Performing traces for debugging purposes
     Creating processes and using the Document Engine

About creating a wizard

The Wizard tool enables implementers and administrators to add wizards within
Service Manager that assist users with certain tasks, such as adding contacts to a
database, escalating a Service Desk record to the applicable Service Manager
module, and creating a new configuration item type for Configuration Management.

Functionality in a wizard record can include any or all of the following functionality:

     Creating records
     Selecting records from a database
     Modifying the current record
     Executing expressions (RAD or JavaScript), processes, and format control
     Asking for user input
     Stacking wizards to run in succession

You may find it helpful to review the embedded, out-of-box wizards. These wizards
offer a variety of functionality, such as:

     Create a User (the User Quick Add Utility)
     Escalate an Interaction
     Reject a Change


     Add a CI Type
     Add a Contract

You can view these wizards by clicking Tailoring > Wizards, and then clicking the
Search button.

In addition to simplifying repetitive user tasks, Wizards are very useful for processes
that require the user to supply prerequisite information. For example, during the
interaction creation cycle you could present a wizard panel flow for the operator to
enter data. Based on how the caller replies to questions regarding the problem, the
wizard determines which panels the operator sees next. While the wizard is
executing, the operator-entered data may be accumulated in a file variable that's
returned to the calling application when the wizard is complete.

The wizard can display a form and execute a Format Control record or process. The
instructions in the Format Control record where there is a condition on “initial” that
evaluates to true will be executed before the form opens. The instructions where
there is a condition on “add” that evaluates to true will be executed after the user
clicks OK.

Wizards are also very helpful when multiple complex decisions must be made in order
to reach a conclusion. For example, Change Management approval requirement
conditions are normally based on the data contents of one field in the change record.
An example of such a condition is risk.assessment in $L.file="1." However, there
may be circumstances where the approval requirement condition is based on the
values of several different fields. For instance, there may be three fields that affect the
approval requirements: division, area, and department. Hard coding all the possible
combinations of these field values into condition statements requires a great deal of
work and would be difficult to maintain. You can define these conditions in wizard
records that don't display forms but that allow you to call a subroutine or execute
standard Service Manager processing statements (similar to Format Control
calculation statements). These options allow for the manipulation of record data. At
runtime, the wizard acts as a decision tree that results in significant processing
reductions compared to that involved in the original method of coding.

Wizard flow

Wizard flow defines the order in which wizard panels execute. Wizard panels can
move in a straight line from start to finish, or branch into several different process
flows.

The more complex wizard flows use condition statements that must evaluate to true
before certain wizard panels can execute. If none of the specified conditions evaluate


to true, the wizard flow is considered complete, and control passes back to the calling
application.

It is very helpful to develop a map of the entire flow showing the name of the form (if
any) displayed by each wizard panel and the conditions controlling the flow from
panel to panel. You can follow the map throughout the wizard creation process to
avoid simple errors that could prevent your wizard from operating properly.

Wizards versus scripts

Service Manager wizards have much in common with the Service Manager scripts
utility, a legacy tool that has been part of the system tailoring utilities for many
releases. Wizards go beyond scripting, enabling much greater functionality and
flexibility.

A major advantage of wizards over scripts is security. Wizards are more robust and
ensure data integrity, which scripts can't do.

Unlike scripts, wizards allow you to specify the format control and display screen;
you're not limited to the format control for a particular form, or to a particular display
screen.

In addition, wizards themselves can call Format Control records and processes.
Wizards don't allow direct calls to RAD applications.

Contents

     1 Prerequisites
     2 About creating a wizard
     3 Wizard flow
     4 Wizards versus scripts
````
