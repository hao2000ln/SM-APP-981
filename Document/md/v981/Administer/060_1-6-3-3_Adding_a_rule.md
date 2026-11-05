---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.6.3.3 .. 1.6.3.3.13
printed_pages: 1453-1478
---

# 1.6.3.3 Adding a rule

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.6.3.3. Adding a rule

A rule defines a singular piece of functionality, such as making a field mandatory. A
rule can perform calculations, validate fields based on data or lists, set required
fields, and more. Rules can also specify conditions that determine when the rule
should execute or who can execute rules run in the order they appear in the rule set.
The order can be changed using the Move Up and Move Down buttons. If there is an
error executing a rule, rule processing will stop. It is important to order the rules such
that validation rules come first in the list, and then any rules that will perform actions.
For example, to validate data and send an HTML email, place rules to validate data
first and then the rule to send an HTML email. If the rules were reversed, the HTML
email will be sent with invalid data or an invalid workflow state if the rules are part of a
transition.

All rule sets in a phase, except the "On Enter" and "On Exit" rule sets, run before a
record proceeds from one phase to another. The "On Exit" rule sets run before a
transition occurs. "On Enter" rule sets run when a record moves to that phase.

The "On Exit" rules are the best place for notifications when a record leaves a phase
especially when multiple transitions are used or when integration notifications are
triggered. Transitions are used to add validations that are required before leaving to
the current phase. For example, in a change phase, the start date and end date are
entered before proceeding to the Approval phase and no input is required if you are
abandoning the change. In this case, if the "On Exit" rules are run before the transition
rules, you will be sending out notifications but the actual transition would not have
happened. Therefore, the order of execution of rule is Transition > On Exit > On Enter.

For example, rules may run in the following situations:

     When a record enters or exits a specific phase of the workflow
     When a record is created, updated, or deleted in a certain phase of the workflow
     because a workflow action is invoked
     When a workflow transition occurs
     When a workflow action is invoked

The following rule types are available in out-of-box Service Manager deployments.

 Rule type                                                                                      Service Manager 9.81
 Assignment
                                        Description
 Call a process
 Case Exchange                          Automatically distribute records (such
 Clear Fields                           as tasks or records) to the groups and
 JavaScript Validation                  individuals who are most able to
 Launch a Script                        process them
 Launch a URL
 Mandatory Fields                       Call a Service Manager process record
 Mandatory Variables
 Popup Message Box                      Trigger certain activities for the Case
 Run Action                             Exchange integration

 Run JavaScript                         Clear the specified field and related
 Run Scheduled Action                   fields
 Run a Wizard
                                        Use JavaScript to perform actions and
This PDF was generated on May 23, 2026  validations

                                        Launch a Service Manager script

                                        Call a URL to launch a web page

                                        Set fields as mandatory

                                        Set variables as mandatory

                                        Create and configure popup message
                                        boxes that appear to end users

                                        Run actions on records that have a
                                        specified relationship to the record that
                                        triggers the rule

                                        Use JavaScript to perform actions and
                                        validations

                                        Run actions on the current record after
                                        a specified length of time has passed

                                        Run a Service Manager wizard

                                                                                                                          Page 75 of 162

Rule type                               Description
Send HTML Email
                                        Send an HTML Email to users or a
Send Notifications                      group
Send Teams Message
                                        Send Service Manager notifications
Set Field
Set Field from Number                   Send a Microsoft Teams message to
Start or Stop Clock                     users or a group
Validate against List
                                        Set a field value using JavaScript
Validate against Table
                                        Set field based on a number record
Validate Date
Validate Text/Number                    Start and stop a Service Manager clock

                                        Validate a field against a list (global or
                                        defined)

                                        Validate a field against a field in
                                        another table

                                        Validate a date against a date range

                                        Validate a field against a range of text
                                        or a number in another field of the
                                        same table

Note

     Out-of-box rule sets are labeled as Proprietary and you can edit
     user-defined rule sets only.
     Many rules have a default description that contains tokens. The
     tokens are replaced with values when you define the rule. For
     example, the default description of the Set Mandatory Fields rule is
     <fields> are Mandatory. When you define the rule, the <fields>
     token is replaced by the fields that you select in the rule. You can
     edit the default description.
     If you don't specify a condition, rules are always triggered to
     perform the action specified in the rule.


Related topics

Process Designer
Create a rule set


1.6.3.3.1. Add a Launch a URL rule

Applies to User roles: System Administrator, Implementer
This rule enables you to launch a remote web address by using its uniform resource
locator (URL). This rule helps you to integrate Service Manager with other products.
To add a Launch a URL rule, follow these steps:

   1. In the System Navigator, click Tailoring > Process Designer > Rule Sets.
   2. Click Search to open the Rule Set form, and then select the rule set to which you

     want to add the rule.

                   Note

                Out-of-box rule sets are labeled as Proprietary and you can edit
                user-defined rule sets only.

   3. Click Add Rule to open the Select Rule Type page, and then click Launch a URL.
   4. Type a description in the Rule Description field.
   5. Click Edit to add conditions to the rule.

                   Note

                If you don't specify a condition, the value defaults to Always.

   6. In the URL field, type the URL address of the remote resource that you want to
     launch, and then click OK.

Related topics

Process Designer
Process Designer security model
Create a rule set


1.6.3.3.2. Add a Run a Macro rule

Applies to User roles: System Administrator, Implementer
This rule enables you to run a Service Manager macro that performs a distinct action.
Service Manager macros are specific actions driven by predefined conditions. For
example, if you want to configure a macro to send an email, select the Service
Manager macro type Mail 1 Person. You can configure this rule to send an email to an
intended recipient when an incident record moves from one phase to another.
To add a Run a Macro rule, follow these steps:

   1. In the System Navigator, click Tailoring > Process Designer > Rule Sets.
   2. Click Search to open the Rule Set form, and then select the rule set to which you

     want to add the rule.

                   Note

                Out-of-box rule sets are labeled as Proprietary and you can edit
                user-defined rule sets only.

   3. Click Add Rule to open the Select Rule Type page, and then click Run a Macro.
   4. Type the description in the Rule Description field.
   5. Click Edit to add a condition.

                   Note

                If you don't specify a condition, it will default to Always.

   6. Select a macro name from the drop-down list.

                   Note

                The drop-down list has macros related to the current table of the
                rule set.

   7. Click OK to add the new rule to the rule set.

Related topics


Process Designer
Create a rule set


1.6.3.3.3. Add a Call a Process rule

Applies to User roles: System Administrator, Implementer
This rule enables users to call a Service Manager process. You have to specify the
process name and the conditions that call the process.

            Caution

           You can't call a Service Manager process that expects an input, because
           there is no provision to pass the input through the rule. Calling a process
           that requires an input causes the rule functionality to fail and may
           generate an unrecoverable error message.

To add a Call a Process rule type, follow these steps:
   1. In the System Navigator, click Tailoring > Process Designer > Rule Sets.
   2. Click Search to open the Rule Set form, and then select the rule set to which you
     want to add the rule.

                   Note

                Out-of-box rule sets are labeled as Proprietary and you can edit
                user-defined rule sets only.

   3. Click Add Rule to open the Select Rule Type page, and then click Call a
     Process.

   4. In the Rule Description field, type a description of your new rule.
   5. Click Edit to add conditions to the rule.

                   Note

                If you don't specify a condition, the value defaults to Always.

   6. Click Fill Field Process, and then select the process that you want to call.
   7. Click OK to add the new rule to the rule set.

Related topics


Process Designer
Process Designer security model
Adding a rule
Create a rule set


1.6.3.3.4. Add a Case Exchange rule

Applies to User roles: System Administrator, Implementer
This rule enables you to trigger certain activities for the Case Exchange integration.
To add a Case Exchange rule, follow these steps:

   1. In the System Navigator, click Tailoring > Process Designer > Rule Sets.
   2. Click Search to open the Rule Set form, and then select the rule set to which you

     want to add the rule.

                   Note

                Out-of-box rule sets are labeled as Proprietary and you can edit
                user-defined rule sets only.

   3. Click Add Rule to open the Select Rule Type page, and then click Case
     Exchange.

   4. In the Rule Description field, type a description of your new rule.
   5. Click Edit to add conditions to the rule.

                   Note

                If you don't specify a condition, the value defaults to Always.

   6. In the rule from the Instance Name drop-down list, select the Case Exchange
     integration instance that you want to apply.

   7. In the Event drop-down list, select an event from, and then select the fields you
     want to add.

   8. Click Finish to add the new rule to the rule set.

Related topics

Using the Condition Editor
Launch the Condition Editor from a rule
Launch the Condition Editor from a workflow


1.6.3.3.5. Add a Run a Wizard rule

Applies to User roles: System Administrator, Implementer
This rule enables you to run a Service Manager wizard. The form helps you to specify
the wizard to run when the rule executes.
To add a Run a Wizard rule, follow these steps:

   1. In the System Navigator, click Tailoring > Process Designer > Rule Sets.
   2. Click Search to open the Rule Set form, and then select the rule set to which you

     want to add the rule.

                   Note

                Out-of-box rule sets are labeled as Proprietary and you can edit
                user-defined rule sets only.

   3. Click Add Rule to open the Select Rule Type page, and then click Run a Wizard.
   4. In the Rule Description field, type a description of your new rule.
   5. Click Edit to add conditions to the rule.

                   Note

                If you don't specify a condition, the value defaults to Always.

   6. Click Fill Field Wizard to run, and then select the wizard to run when the rule is
     executed.

   7. Click OK to add the new rule to the rule set.

Related topics

Process Designer
Process Designer security model
Adding a rule
Create a rule set


1.6.3.3.6. Add a Clear Fields rule

Applies to User roles: System Administrator
From a rule set, you can clear the value of specified fields in a record. Optionally, the
rule can also clear the value in fields related to the specified fields.
To add a Clear Fields rule, follow these steps:

   1. In the System Navigator, click Tailoring > Process Designer > Rule Sets.
   2. Click Search to open the Rule Set form, and then select the rule set to which you

     want to add the rule.

                   Note

                Out-of-box rule sets are labeled as Proprietary and you can edit
                user-defined rule sets only.

   3. Click Add Rule to open the Select Rule Type page, and then click Clear Fields.
   4. In the Rule Description field, type a description of your new rule.
   5. Click Edit to add conditions to the rule.

                   Note

                If you don't specify a condition, the value defaults to Always.

   6. In the Field Name column, select the fields to clear when the rule is executed.
   7. In the Clear Related Fields column, select whether to clear the value of related

     fields of the specified fields.
   8. Click OK to add the new rule to the rule set.

Related topics

Process Designer
Process Designer security model
Adding a rule
Create a rule set


1.6.3.3.7. Add a JavaScript Validation rule

Applies to User roles: System Administrator, Implementer
This rule allows you to validate any JavaScript code a user enters.
To add a JavaScript Validation rule, follow these steps:

   1. In the System Navigator, click Tailoring > Process Designer > Rule Sets.
   2. Click Search to open the Rule Set form, and then select the rule set to which you

     want to add the rule.

                   Note

                Out-of-the-box rule sets are labeled as Proprietary and you can edit
                user-defined rule sets only.

   3. Click Add Rule to open the Select Rule Type page, and then click JavaScript
     Validation.

   4. In the Rule Description field, type a description of your new rule.
   5. Click Edit to add conditions to the rule.

     • If you don't specify a condition, it will default to Always.
     • You may reference the current record as record in the JavaScript. For
     example, if the field in a form is a category, Service Manager may referred to it
     as follows: record.category=="xyz"
     • You may reference the original copy of the record (before the user make any
     changes) as oldRecord in the JavaScript (that's oldRecord.category ).
     • You may set the returnCode variable in the JavaScript to specify whether this
     rule was successful or whether the system should treat this rule as a failed
     validation. A return code of 0 (zero) means successful (it's the default), any
     other code is unsuccessful. The return code must be a numeric value.
     • You may set the message variable in the JavaScript to specify a message that
     displays to the user if the rule is unsuccessful (returns a code that isn't zero).
     • You may set the cursorPosition variable in the JavaScript to specify a field on
     the current form where the cursor locates if the rule is unsuccessful.


   6. Enter the JavaScript in the text box.

   7. Click OK to add the new rule to the rule set.

Related topics

Process Designer
Process Designer security model
Create a rule set


1.6.3.3.8. Add a Run JavaScript rule

Applies to User roles: System Administrator, Implementer
This rule enables you to perform actions and validations by using JavaScript.
To add a run JavaScript rule:

   1. Click Tailoring > Process Designer in the System Navigator.
   2. Click Rule Sets > Search to open the Rule Set page.
   3. Select the Rule Set to which you want to add the rule.
   4. Click Add Rule to open the Select Rule Type page.
   5. Click Run JavaScript.
   6. Type the Rule Description.
   7. Click Edit to add a condition.

                   Note

                If you don't specify a condition, it will default to Always.

   8. Type the JavaScript to run in the text box.
   9. Click OK to add the rule.

Related topics

Process Designer
Create a rule set


1.6.3.3.9. Add a Set Mandatory Fields rule

Applies to User roles: System Administrator, Implementer
This rule enables you to make one or more fields mandatory and to specify a default
value for each field, which will be set if the mandatory fields are empty.
To add a JavaScript Validation rule, follow these steps:

   1. In the System Navigator, click Tailoring > Process Designer > Rule Sets.
   2. Click Search to open the Rule Set form, and then select the rule set to which you

     want to add the rule.

                   Note

                Out-of-box rule sets are labeled as Proprietary and you can edit
                user-defined rule sets only.

   3. Click Add Rule to open the Select Rule Type page, and then click Set
     Mandatory Fields.

   4. In the Rule Description field, type a description of your new rule.
   5. Click Edit to add conditions to the rule.

                   Note

                If you don't specify a condition, the value defaults to Always.

   6. Select the error message type (Pop-up or Screen) that's displayed during
     validation.

   7. Click the Show All Error Messages Together checkbox if you want to display all
     error messages together during validation.

   8. Select the field name you want to set as mandatory.
   9. You can choose a default value, which will be set if the mandatory fields are

     empty.
 10. Click OK to add the new rule to the rule set.

Related topics

Process Designer
Process Designer security model


Adding a rule
Create a rule set


1.6.3.3.10. Add a Set Mandatory Variables
rule

Applies to User roles: System Administrator, Implementer
This rule enables you to set global and thread variables as mandatory. If mandatory
variables are empty, then a default value is set if specified in the Rule.
Global or thread variables begin with the $ symbol. However, the rule doesn't accept
local variables beginning with $L. Global variables are set when the operator logs on
and the server automatically cleans them up when the session ends.
Thread variables don't have a consistent naming scheme. They are only valid for the
current RAD thread. If the RAD thread terminates, the server automatically cleans up
all thread variables.
To add a Mandatory Variables rule, follow these steps:

   1. In the System Navigator, click Tailoring > Process Designer > Rule Sets.
   2. Click Search to open the Rule Set form, and then select the rule set to which you

     want to add the rule.

                   Note

                Out-of-box rule sets are labeled as Proprietary and you can edit
                user-defined rule sets only.

   3. Click Add Rule to open the Select Rule Type page, and then click Set
     Mandatory Variables.

   4. In the Rule Description field, type a description of your new rule.
   5. Click Edit to add conditions to the rule.

                   Note

                If you don't specify a condition, the value defaults to Always.

   6. Select the error message type (Pop-up or Screen) that's displayed during
     validation.


   7. Click the Show All Error Messages Together checkbox if you want to display all
     error messages together during validation.

   8. Select a global or thread variable.

                   Note

                If a mandatory variable is empty, then the rule sets it to a default
                value.

   9. Type the variable of the default value.
 10. Click OK to add the new rule to the rule set.

Related topics

Process Designer
Process Designer security model
Adding a rule
Create a rule set


1.6.3.3.11. Add a Send Notifications rule

Applies to User roles: System Administrator, Implementer
This rule enables you to send notifications using a Service Manager notification
record. The rule is typically mapped to a workflow or workflow phase. For example,
you can use the rule to send a notification when a phase is entered. The rule type
links to an existing notification record.
To configure a notification, follow these steps:

   1. In the System Navigator, click Tailoring > Process Designer > Rule Sets.
   2. Click Search to open the Rule Set form, and then select the rule set to which you

     want to add the rule.

                   Note

                Out-of-box rule sets are labeled as Proprietary and you can edit
                user-defined rule sets only.

   3. Click Add Rule to open the Select Rule Type page, and then click Send
     Notifications.

   4. In the Rule Description field, type a description of your new rule.
   5. Click Edit to add conditions to the rule.

                   Note

                If you don't specify a condition, the value defaults to Always.

   6. Click Fill Field Notification Name, and then select the existing notification record
     that you want to send when this rule is executed.

   7. Click OK to add the new rule to the rule set.

Related topics

Process Designer
Process Designer security model
Adding a rule
Create a rule set


1.6.3.3.12. Add a Send Teams Message
rule

Applies to User roles: System Administrator, Implementer
This rule enables you to send Teams messages using pre-configured Teams message
templates. Recipients can be particular users or a group, either explicitly named or
based on data on the form. The rule is typically mapped to a workflow or workflow
phase. You can use this rule to send a Teams message at specific points in a
workflow.
To add a Send Teams Message rule, follow these steps:

   1. In the System Navigator, click Tailoring > Process Designer > Rule Sets.
   2. Click Search to open the Rule Set form, and then select the rule set to which you

     want to add the rule. Alternatively, you can create a new rule set as well.

                   Note

                Out-of-box rule sets are labeled as Proprietary and you can edit
                user-defined rule sets only.

   3. Click Add Rule to open the Select Rule Type page, and then click Send Teams
     Message.

   4. In the Rule Description field, type a description of your new rule.
   5. Click Edit to add conditions to the rule.

                   Note

                If you don't specify a condition, the value defaults to Always.

   6. In the Message Template field, enter a Teams message template.
   7. Select one of the four recipient options: Users, Group, Set Using JavaScript, or

     Current Record. Then, follow the appropriate steps to configure the recipient:
           Users: Select a user type (Operators or Contacts), and then select the
           operators or contacts accordingly.


           Group: Select one of the following group types: Assignment Group
           (assignment), Change Management Group (cm3groups), Knowledge
           Management Group (kmgroup), or Request Management Group
           (ocmgroups). Then, follow the appropriate steps to configure the group:

                 Assignment Group: Enter a group name in the Group field, and then
                 select Operators, Manager, Approvers or All in the Send To drop-
                 down list.
                 Change Management Group: Enter the group name in the Group
                 field, and then select Members, Approvers, or All in the Send To
                 drop-down list.
                 Knowledge Management Group: Enter the group name in the Group
                 field, and then select Operators, Manager, or All in the Send To
                 drop-down.
                 Request Management Group: Enter the group name in the Group
                 field. Also, select Members, Approvers, or All in the Send To drop-
                 down list.

           The system separately sends Teams messages to each member as
           specified in the Send To drop-down list of a selected group.

           Set Using JavaScript: In the script field that appears, set the recipients in
           the users array variable by using valid operator login names or contact
           names. For example, you type the following:

                 var users = ["jennifer"];

           Current Record: Choose a field from the current record, and then specify if
           the field is the ID of an operator, contact, assignment, cm3groups,
           kmgroup, or ocmgroup in the Field Type drop-down list.

           If you select any field type apart from Operator or Contact, you have to
           select from Send To field. For example, if you select Assignment Group,
           you have to select Operators, Manager, Approvers or All from the Send
           To drop-down list.

   8. Click OK to add the new rule to the rule set.

Related topics

Process Designer
Process Designer security model


Create a rule set
Set up Teams notification


1.6.3.3.13. Add a Launch a Script rule

Applies to User roles: System Administrator, Implementer
This rule enables you to launch a Service Manager script. Scripts enable you to
interrupt the normal screen flow and gather the prerequisites before the form is
displayed. For example, you can use a script to automatically close an incident in five
days. The script closes the incident.
To add a Launch a Script rule, follow these steps:

   1. In the System Navigator, click Tailoring > Process Designer > Rule Sets.
   2. Click Search to open the Rule Set form, and then select the rule set to which you

     want to add the rule.

                   Note

                Out-of-box rule sets are labeled as Proprietary and you can edit
                user-defined rule sets only.

   3. Click Add Rule to open the Select Rule Type page, and then click Launch a
     Script.

   4. In the Rule Description field, type a description of your new rule.
   5. Click Edit to add conditions to the rule.

                   Note

                If you don't specify a condition, the value defaults to Always.

   6. Click the Fill Field Script icon in the Script text box to select a Service Manager
     script.

                   Note

                If you type an invalid script name, an error message appears.

   7. Click OK to add the new rule to the rule set.

Related topics


Process Designer
Adding a rule
Create a rule set
Build a condition
````
