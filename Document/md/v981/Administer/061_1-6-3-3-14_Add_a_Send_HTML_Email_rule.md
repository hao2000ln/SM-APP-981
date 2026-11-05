---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.6.3.3.14 .. 1.6.3.3.24
printed_pages: 1478-1507
---

# 1.6.3.3.14 Add a Send HTML Email rule

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.6.3.3.14. Add a Send HTML Email rule

Applies to User roles: System Administrator, Implementer
This rule enables you to send a formatted HTML email to intended recipients using
pre-configured HTML templates. Recipients can be particular users or a group, either
explicitly named or based on data in the form. This rule is used to send emails at
specific points in a workflow as opposed to create a general Service Manager
notification outside of Process Designer that, for example, would apply for all Change
Requests.
To add a Send HTML Email rule, follow these steps:

   1. In the System Navigator, click Tailoring > Process Designer > Rule Sets.
   2. Click Search to open the Rule Set form, and then select the rule set to which you

     want to add the rule.

                   Note

                Out-of-the-box rule sets are labeled as Proprietary and you can edit
                user-defined rule sets only.

   3. Click Add Rule to open the Select Rule Type page, and then click Send HTML
     Email.

   4. In the Rule Description field, type a description of your new rule.
   5. Click Edit to add conditions to the rule.

                   Note

                If you don't specify a condition, the value defaults to Always.

   6. In the HTML Template field, enter an HTML template.
   7. On the Recipients To tab, select one of the four recipient options: Users, Group,

     Set Using JavaScript, or Current Record. Then, follow the appropriate steps to
     configure the recipient:

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

        Set Using JavaScript: In the script field that appears, set the recipients in
        the users array variable by using valid operator login names or contact
        names. For example, you type the following:

             var users = ["jennifer"];

        Current Record: Choose a field from the current record, and then specify if
        the field is the ID of an operator, contact, assignment, cm3groups,
        kmgroup, or ocmgroup in the Field Type drop-down list.

        If you select any field type apart from Operator or Contact, you have to
        select from Send To field. For example, if you select Assignment Group,
        you have to select Operators, Manager, Approvers, or All from the Send
        To drop-down list.

8. (Optional) On the Recipients Cc and Recipients Bcc tabs, select either of the
  two recipient options: Users or Group.

        Users: Select a user type (Operators or Contacts), and then select the
        operators or contacts accordingly.

        Group: Select one of the following group types: Assignment Group
        (assignment), or Knowledge Management Group (kmgroup). Then, follow
        the appropriate steps to configure the group:


                 Assignment Group: Enter a group name in the Group field, and then
                 select Operators, Manager, Approvers or All in the Send To drop-
                 down list.
                 Knowledge Management Group: Enter the group name in the Group
                 field, and then select Operators, Manager, or All in the Send To
                 drop-down list.

                   Note

                If a Smart Email consists of tokens, the Cc and Bcc functions don't
                work.

   9. Click OK to add the new rule to the rule set.

            Tip

           Suppose you have set a valid group email of members/approvers in the
           Assignment Groups definition and your selection meets either of the
           following combinations. In that case, the system sends emails to this
           group email address when sending notifications.

                Select Current Record as the Recipients option, and then select
                Assignment Group as the Field option.
                Select Group as the Recipients option, and then select Assignment
                Group as the Group Type option.

           Note that this group email function doesn't support all the Smart Emails
           with action buttons (such as the Approve, Deny, or Close buttons, and so
           on). The system separately sends the Smart Emails with action buttons to
           each member in the assignment group even though you have set a valid
           group email address in the Approver Group Email field.

Related topics

Process Designer
Process Designer security model
Create a rule set


1.6.3.3.15. Add a Start or Stop Clock rule

Applies to User roles: System Administrator, Implementer
This rule enables you to start or stop a Service Manager clock to measure elapsed
time. For example, suppose you hope to know the time taken for an Incident to move
from the Validation to the Risk and Impact Analysis phase. You can configure a rule to
start a clock when the record enters the Validation phase. Then, configure another
rule to stop the same clock when the incident record moves to the Risk and Impact
Analysis phase. The clocks table stores the time difference along with start and stop
times.
To add a Start or Stop Clock rule to start a clock, follow these steps:

   1. In the System Navigator, click Tailoring > Process Designer > Rule Sets.
   2. Click Search to open the Rule Set form, and then select the rule set to which you

     want to add the rule.

                   Note

                Out-of-the-box rule sets are labeled as Proprietary and you can edit
                user-defined rule sets only.

   3. Click Add Rule to open the Select Rule Type page, and then click Start or Stop
     Clock.

   4. In the Rule Description field, type a description of your new rule.
   5. Click Edit to add conditions to the rule.

                   Note

                If you don't specify a condition, the value defaults to Always.

   6. Select Start Clock, and then click Next.
   7. In the Name of Clock pane, choose one of the following methods to define the

     clock name:
          • Select the Fixed Name option to identify a specific clock. Type a clock
          name to add a new clock, or select an existing clock name from the drop-
          down list.


          • Select the Set Using JavaScript option to set a clock name by using
          JavaScript. For example, use the clockName = "New Clock"; JavaScript to
          set a clock.

   8. In the Use this schedule pane, select a predefined schedule or configure a
     schedule by using JavaScript.

   9. In the Using this time zone pane, select the time zone that the clock uses.
     Options include the location of the system server, technician, customer, or CI.
     You can also enter a fixed value (a specific time zone) or configure the time
     zone by using JavaScript.

 10. Click Finish to add the new rule to the rule set.

Once you have created a rule to start a clock, you can add another rule to stop the
clock. To do this, follow these steps:

   1. In the System Navigator, click Tailoring > Process Designer > Rule Sets.

   2. Click Search to open the Rule Set form, and then select the rule set to which you
     want to add the rule.

   3. Click Add Rule to open the Select Rule Type page, and then click Start or Stop
     Clock.

   4. In the Rule Description field, type a description of your new rule.

   5. Click Edit to add conditions to the rule.

                   Note

                If you don't specify a condition, the value defaults to Always.

   6. Select Stop Clock, and then click Next.

   7. In the Name of Clock pane, choose one of the following methods to define the
     clock name:

          • Select the Fixed Name option to identify a specific clock. Type a clock
          name to add a new clock, or select an existing clock name from the drop-
          down list.
          • Select the Set Using JavaScript option to set a clock name by using
          JavaScript.


                   Note

                The name of the stop clock rule should be the same as the
                corresponding start clock rule.

   8. Click Finish to update the rule.

Related topics

Process Designer
Process Designer security model
Adding a rule
Create a rule set


1.6.3.3.16. Add a Set Field rule

Applies to User roles: System Administrator, Implementer
This rule enables you to set a field with a value that's determined by a JavaScript.
From a rule set, you can select a common field from multiple tables and set its value
based on a JavaScript expression.

            Note

           Make sure that the field is set to the contents of the value variable. If it's
           not set to the value variable, the JavaScript can't be processed.

To configure a field based on a JavaScript, follow these steps:
   1. In the System Navigator, click Tailoring > Process Designer > Rule Sets.
   2. Click Search to open the Rule Set form, and then select the rule set to which you
     want to add the rule.

                   Note

                Out-of-box rule sets are labeled as Proprietary and you can edit
                user-defined rule sets only.

   3. Click Add Rule to open the Select Rule Type page, and then click Set a Field.
   4. In the Rule Description field, type a description of your new rule.
   5. Click Edit to add conditions to the rule.

                   Note

                If you don't specify a condition, the value defaults to Always.

   6. Select an applicable field name from the drop-down list.
   7. Type the JavaScript that sets the variable value to the desired value for the field

     in the text box.
   8. Click OK to add the new rule to the rule set.

Related topics


Process Designer
Process Designer security model
Adding a rule
Create a rule set


1.6.3.3.17. Add a Set Field from Number
rule

Applies to User roles: System Administrator, Implementer
This rule enables you to set a field based on an Service Manager number record.
When this rule is executed, unique sequential numbers for the records in the database
are generated.
When a new record is added, the unique sequential number is incremented or
decremented based on the prefix or suffix provided. For example, you can create a
number record for the cm3r class with Increment By as +1, Prefix as C, andLast
Number as 10. Whenever a new change request is added in the system, it assigns the
change request with a unique change ID C10, the next change request you add will
have the change ID C11.
To add a Set Field from Number rule, follow these steps:

   1. In the System Navigator, click Tailoring > Process Designer > Rule Sets.
   2. Click Search to open the Rule Set form, and then select the rule set to which you

     want to add the rule.

                   Note

                Out-of-box rule sets are labeled as Proprietary and you can edit
                user-defined rule sets only.

   3. Click Add Rule to open the Select Rule Type page, and then click Set Field from
     Number.

   4. In the Rule Description field, type a description of your new rule.
   5. Click Edit to add conditions to the rule.

                   Note

                If you don't specify a condition, the value defaults to Always.

   6. Select the field from the Field Name drop-down list.
   7. Select the class from the Class of Number Record drop-down list.


                   Note

                You can select the Overwrite When Record Is Saved checkbox to
                overwrite the number when you save a record.

   8. Click OK to add the new rule to the rule set.

Related topics

Process Designer
Create a rule set
Build a condition


1.6.3.3.18. Add a Validate Date rule

Applies to User roles: System Administrator, Implementer
This rule enables you to perform validation between a date field and an absolute date
or a range of relative dates. For example, you can add a rule to validate whether a
document expiration date is greater than or equal to the document creation date.
To add a Validate Date rule, follow these steps:

   1. In the System Navigator, click Tailoring > Process Designer > Rule Sets.
   2. Click Search to open the Rule Set form, and then select the rule set to which you

     want to add the rule.

                   Note

                Out-of-the-box rule sets are labeled as Proprietary and you can edit
                user-defined rule sets only.

   3. Click Add Rule to open the Select Rule Type page, and then click Validate Date.
   4. In the Rule Description field, type a description of your new rule.
   5. Click Edit to add conditions to the rule.

                   Note

                If you don't specify a condition, the value defaults to Always.

   6. Select the error message type: Pop-up or Screen to display during validation.
   7. Select the field to validate from the drop-down list.

                   Note

                The drop-down list displays all fields with the Date data type from
                the current table.

   8. Select the comparison operator from the drop-down list.
   9. Select the Not option if you want to negate the comparison.
 10. Click Relative Date/Time or Absolute Date/Time to validate the date field.


Note

                • If you select Relative Date/Time, select a date field or Current
                Date/Time from the drop-down list.

                • You can add or subtract an offset time of days, hours, and
                minutes from the relative date/time by selecting + or -. For instance,
                an offset +04:03:02 indicates the relative date/time is ahead by 4
                days, 3 hours, and 2 minutes.

                • If you select Absolute Date/Time, click the Calendar icon to select
                the date and time.

 11. Click OK to add the new rule to the rule set.

Related topics

Adding a rule
Create a rule set
Build a condition


1.6.3.3.19. Add a Validate against List rule

Applies to User roles: System Administrator, Implementer
This rule enables you to select a field to validate with a list of values. This list may be
global or manually defined.
To add a Validate against List rule, follow these steps:

   1. In the System Navigator, click Tailoring > Process Designer > Rule Sets.
   2. Click Search to open the Rule Set form, and then select the rule set to which you

     want to add the rule.

                   Note

                Out-of-the-box rule sets are labeled as Proprietary and you can edit
                user-defined rule sets only.

   3. Click Add Rule to open the Select Rule Type page, and then click Validate
     against List.

   4. In the Rule Description field, type a description of your new rule.
   5. Click Edit to add conditions to the rule.

                   Note

                If you don't specify a condition, the value defaults to Always.

   6. Select Pop-up or Screen to set the type of error message that's displayed
     during validation.

   7. In the Field to Validate drop-down list, select the field to validate.
     If you select Global List, select the global list from the drop-down list.
     If you select Manual List, type the manual list names in the Value table.

   8. Click OK to add the new rule to the rule set.


            Note

           If the field value doesn't match a value in the specified list, the system
           displays a message and sets the cursor to that field when the rule isn't
           followed.

Related topics

Process Designer
Process Designer security model
Adding a rule
Create a rule set


1.6.3.3.20. Add a Validate against Table
rule

Applies to User roles: System Administrator, Implementer
This rule enables you to validate a field against a field in another table and fill data
into other fields. You can also filter the data you are validating against, and fill data
into other fields.

            Note

           The Validate against Table rule doesn't include the Set Mandatory Fields
           rule, so that you can't use the Validate against Table rule to verify whether
           a field is empty or not. Before you create a Validate against Table rule, it is
           recommended that you first add a Set Mandatory Fields rule to verify
           whether the field is empty or not.

To add a Validate against Table rule, follow these steps:
   1. In the System Navigator, click Tailoring > Process Designer > Rule Sets.
   2. Click Search to open the Rule Set form, and then select the rule set to which you
     want to add the rule.

                   Note

                Out-of-box rule sets are labeled as Proprietary and you can edit
                user-defined rule sets only.

   3. Click Add Rule to open the Select Rule Type page, and then click Validate
     against Table.

   4. In the Rule Description field, type a description of your new rule.
   5. Click Edit to add a condition.

                   Note

                If you don't specify a condition, it will default to Always.

   6. Select Pop-up or Screen to set the type of error message that's displayed
     during validation.


   7. Select the field to validate from the drop-down list.
   8. Select the name of the table you want to validate against.
   9. Select the name of the field you want to validate against.
 10. You can filter the data that you are validating against by using a standard RAD

     query.
     For example, the following field entries will validate only for cm3r with the
     current field name ("Demo String2," in this example) of the workflow:
     Current Field Name field: Demo String2
     Validate Against Table field: ModuleStatus
     Validate Against Field field: Status
     Filter field: module="cm3r"
 11. Click Click Here to Add Fill Information to enter Fill From and Fill To fields.

                   Note

                The Fill From field represents the fields of the validation table
                against which it validates. The Fill To field represents the fields in the
                current table being validated.

 12. (Optional) If you want the field to be validated whether its value changes or not,
     select the Always Check Validity checkbox.
     If this option is not selected, the system validates the field only when its value
     changes.

 13. Click OK to add the new rule to the rule set.

Related topics

Process Designer
Create a rule set


1.6.3.3.21. Add a Validate Text/Number
rule

Applies to User roles: System Administrator, Implementer
This rule enables you to validate a field against a range of text or a number in another
field of same table. You can define fixed values or select a field from the current table
to validate against a field. For example, the field to validate is Demo Number, field to
validate against is Demo String 1, and the comparison operator is Is greater than or
equal to.

            Note

           If the field to validate against is blank, the rule is ignored. If you need to
           enforce the rule, then use a Set Mandatory Fields rule on the filed you
           need to validate against.

To add a Validate Text/Number rule, follow these steps:
   1. In the System Navigator, click Tailoring > Process Designer > Rule Sets.
   2. Click Search to open the Rule Set form, and then select the rule set to which you
     want to add the rule.

                   Note

                Out-of-box rule sets are labeled as Proprietary and you can edit
                user-defined rule sets only.

   3. Click Add Rule to open the Select Rule Type page, and then click Validate
     Text/Number.

   4. In the Rule Description field, type a description of your new rule.
   5. Click Edit to add conditions to the rule.

                   Note

                If you don't specify a condition, the value defaults to Always.

   6. Select Pop-up or Screen to set the type of error message that's displayed
     during validation.


   7. Select the field to validate from the drop-down list.
   8. Select the comparison operator from the drop-down list.
   9. Select the Not checkbox if you want to negate the comparison.

 10. To validate against a field or manually defined value, follow the appropriate
     steps:

     To validate against a field, select Field under Values, and then select the field
     you want to validate against from the drop-down list.

     To validate against a manually defined value, select Custom under Values, and
     then type the value to validate against the selected field. For example, to validate
     whether the “Risk Assessment” value is between 1 and 5, select the Is between
     comparison operator, and then type 1 and 5 in the Custom text box.

 11. Click OK to add the new rule to the rule set.

Related topics

Process Designer
Process Designer security model
Adding a rule
Create a rule set


1.6.3.3.22. Add a Popup Message Box rule

Applies to User roles: System Administrator, Implementer
This rule enables you to create and configure popup message boxes that appear to
end users.
To add a Popup Message Box rule, follow these steps:

   1. In the System Navigator, click Tailoring > Process Designer > Rule Sets.
   2. Click Search to open the Rule Set form, and then select the rule set to which you

     want to add the rule.

                   Note

                Out-of-the-box rule sets are labeled as Proprietary and you can edit
                user-defined rule sets only.

   3. Click Add Rule to open the Select Rule Type page, and then click Popup
     Message Box.

   4. In the Rule Description field, type a description of your new rule.
   5. Click Edit to add conditions to the rule.

                   Note

                If you don't specify a condition, the value defaults to Always.

   6. In the Using this message section, select whether you want to set a fixed
     message or configure the message text by using JavaScript. Then, enter the
     message or JavaScript in the relevant text box.


Note

If you select a fixed message, you can additionally enter localized
versions of the message. If you select to set the message text by
using JavaScript, the JavaScript implementation handles the
message localization.

To localize a fixed message, first save the rule, and then open it for
editing. An Edit localized labels button is now displayed next to the
Fixed Message field. Click the button to configure the language
code, message ID, and text of the localized message.

7. Select the message box type. The following options are available.

Option                                  Description
OK only
                                        This type of message box provides
Yes, No                                 end users with the option to click
Yes, No, Cancel                         "OK" only. When you select this rule
                                        type, you must select the message
                                        level and set the behavior when the
                                        user clicks "OK."

                                        This type of message box provides
                                        end users with the option to click
                                        "Yes" or "No." When you select this
                                        rule type, you must set the behavior
                                        when the user clicks "Yes" or "No."

                                        This type of message box provides
                                        end users with the option to click
                                        "Yes," "No," or "Cancel." When you
                                        select this rule type, you must set
                                        the behavior when the user clicks
                                        "Yes," "No," or "Cancel."

   8. Click OK to add the new rule to the rule set.

Related topics


Process Designer
Process Designer security model
Adding a rule
Create a rule set


1.6.3.3.23. Add an Assignment rule

Applies to User roles: System Administrator, Implementer
This rule enables you to automatically distribute records (such as tasks or records) to
the groups and assignees who are most able to process them.
To add an Assignment rule, follow these steps:

   1. In the System Navigator, click Tailoring > Process Designer > Rule Sets.
   2. Click Search to open the Rule Set form, and then select the rule set to which you

     want to add the rule.

                   Note

                Out-of-box rule sets are labeled as Proprietary and you can edit
                user-defined rule sets only.

   3. Click Add Rule to open the Select Rule Type page, and then click Assignment.
   4. In the Rule Description field, type a description of the rule.
   5. Click Edit to add conditions to the rule.

                   Note

                If you don't specify a condition, the value defaults to Always.

   6. In the Group Field Name, specify the field that stores the group name when a
     record is assigned according to the assignment rules.

   7. In the Default Group field, specify the group to which the record is assigned if
     the remaining rules don't return a specific group.

   8. In the Service Field Name field, specify the field that contains the related
     service of the record.

   9. In the Contact Field Name field, specify the field that contains the contact
     information of the record.

 10. From the Group Assignment tab, configure the group to whom the record is
     assigned when the rule is triggered (that is, the value that is inserted into the
     field which you specified in the Group Field Name field).
     To do this, follow these steps:


1. Select one of the following assignment types:

        Automatic - take first: Service Manager automatically assigns the
        record to the first group that is identified.
        Manual - let the user choose: Service Manager presents a list of
        potential assignment groups to the user who has triggered the rule.

               Note

             The system uses Automatic - take first by default for the
             backend processes. The Manual - let the user choose option
             only takes effect for the UI processes.

2. Select the Consider Workschedule of Group checkbox if you want to
  assign the record only to the groups that are available according to the
  calendar defined in the assignment groups.

               Note

             If the calendar is not specified in the assignment group
             definition, the system uses "24x7" by default.

             In addition, the system also uses the time zone defined in the
             assignment group definition. If the time zone is empty in the
             assignment group definition, the system time zone defined in
             system information record (System Information Record > Date
             Info) is used instead.

3. In the Assignment Rule pane, select one of the following options to
  configure the assignment rule:

        Predefined: Select the following options to define the assignment
        rule.

              Service Based
              Location Based
              Department Based
              Language Based
              Company Based (Only available when the multi-company mode
              is enabled.)

        The system returns groups by matching the information in the record
        and the information in the definitions of assignment groups. If multiple


options are selected, only the groups that match all the selected
options are returned.

In addition, you can click Edit Query to add additional query to further
filter the assignment groups.

Fixed: Specify a specific group in the Group field. The system
automatically inserts this group into the field that you specified in the
Group Field Name field.

Set Using JavaScript: Determines the group to whom the record is
assigned based on a JavaScript.

Tip

For more information about configuring assignment rules for groups,
see Configure assignment rules.

11. From the Individual Assignment tab, configure the assignee to whom the record
    is assigned when the rule is triggered.

                 Note

               Assigning tasks or records to specific assignees is optional. If you
               want to assign records to a group only, select the None option.

To do this, follow these steps:

   1. In the Assignee Field Name drop-down list, select the field in which the
     name of the assignee to whom you want to assign the record is stored.

   2. Select one of the following options to configure the assignment rule:
           None: Do not assign to any individual.

           Fixed: Automatically inserts a fixed value into the field that you
           specified in the Assignee Field Name field.

           Group Member: Automatically assigns the record to a member of the
           configured group. Records can be assigned on a round robin basis or
           to the assignee who is currently assigned the lowest number of
           records. To do this, select an option from the Member Type drop-
           down list.

                 If you select the Round robin option, enter the field in which the
                 time used for the calculation is stored in the Assignment Time


                       Field Name field. Then, select the number of days that are taken
                       into consideration when the assignment is calculated. The
                       default value is 60 days.
                       If you select the Number of Assigned Tickets option, click Edit
                       Query to open the condition editor and create the filter that
                       determines the assignee.

                 Coordinator: Assigns the record to a coordinator of your choice in the
                 specified group.

                 JavaScript: Determines the assignee to whom the record is assigned
                 based on a JavaScript.

                   Tip

                For more information about configuring assignment rules for
                individuals, see Configure assignment rules.

 12. Click OK to add the new rule to the rule set.

Prioritizing assignment rules

Service Manager supports prioritizing multiple assignment rules by introducing a new
return variable "$isDefaultGroupAssigned". You need to define multiple assignment
rules in the same rule set. Then, after the first assignment rule, use the
$isDefaultGroupAssigned as the condition in the subsequent assignment rules for the
system to decide whether or not it continues to execute the latter assignment rules:

     If the returned value of $isDefaultGroupAssigned is false, it means there are
     groups identified by the current assignment rule.
     If the returned value of $isDefaultGroupAssigned is true, it means there is no
     group identified by the current assignment rule.

The system executes the latter rule only if no assignment group is identified in the
previous assignment rule.

Use the following instructions when you want to use the $isDefaultGroupAssigned
variable to prioritize multiple assignment rules in a combined rule set:

     The first assignment rule in the rule set is the most specific one to identify the
     best fit.
     The subsequent rules in this rule set may contain assignment logic with less
     specific queries to ensure records are assigned.


If the system identifies groups in the former rules (not default group), the latter
rules will be ignored.


1.6.3.3.24. Add a Run Action rule

Applies to User roles: System Administrator, Implementer
This rule automatically runs actions (defined by rule sets and/or backend transitions)
on records that have a specified relationship to the record that triggers the rule. For
example, you can use this rule to change the workflow phase of related records under
specific conditions.
To add a Run Action rule, follow these steps:

   1. In the System Navigator, click Tailoring > Process Designer > Rule Sets.
   2. Click Search to open the Rule Set form, and then select the rule set to which you

     want to add the rule.

                   Note

                Out-of-box rule sets are labeled as Proprietary and you can edit
                user-defined rule sets only.

   3. Click Add Rule to open the Select Rule Type page, and then click Run Action.
   4. Type a description in the Rule Description field.
   5. Click Edit to add conditions to the rule.

                   Note

                If you don't specify a condition, the value defaults to Always.

   6. Select the type of record on which you want to run the action.
           Select Related Records to change the workflow status of records related to
           the record that triggers the rule.
           Select Other Records to change the workflow status of records that have a
           relationship with the current record that's built by a manually-defined query
           string.
           Select Current Record to change the workflow status of the record that
           triggers the rule.


                      Note

                   This option enables you to run a backend transition directly on
                   the current record.

7. Configure the relationship between the records on which you want to run the
  action and the record that triggers the rule.
        If you selected the Related Records option, select a relationship type from
        the Relation Type drop-down list.
        If you selected the Other Records option, select a table from the Table
        Name drop-down list.
        If you selected the Current Record option, there is no need to define a
        relationship.

8. Click Edit Query if you want to define a subset of the related records on which
  the actions will be run.

               Note

                   If you select the Other records option but don't specify a
                   query, no records are queried. This prevents the rule from
                   running the action on every record in the defined table.
                   This step doesn't apply if you selected to run the actions on the
                   current record only.
                   The Query Editor widget functions similarly to the Condition
                   Editor. However, note the following differences:

                         In the left-hand side (LHS) of the query, you can only
                         select a field in the record on which you want to run the
                         action. Cross table fields aren't supported.
                         Only the following data types are supported on the right-
                         hand side of the query:

                               Blank/Nul
                               Value
                               Variable
                               Current Record
                               Saved Record

9. In the Run Rule Set field, select the rule set that's applied to the target records
  when this rule is triggered.


 10. In the Action after Rule Set field, select the action that's performed on the target
     records after the rule set is applied. You can select to do nothing, save the
     record, or apply a backend transition. The list of available backend transitions is
     retrieved from the workflows of the target record's table name (depending on
     the Relation Type that you selected).

 11. Click OK to add the new rule to the rule set.

            Note

           This rule doesn't take locked records into account. If a record is locked
           when the rule is run, the action is not automatically rescheduled.

Related topics

Process Designer
Process Designer security model
Adding a rule
Create a rule set
````
