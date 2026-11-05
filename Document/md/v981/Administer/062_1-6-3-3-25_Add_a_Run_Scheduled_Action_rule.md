---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.6.3.3.25 .. 1.6.3.4
printed_pages: 1507-1528
---

# 1.6.3.3.25 Add a Run Scheduled Action rule

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.6.3.3.25. Add a Run Scheduled Action
rule

Applies to User roles: System Administrator, Implementer
This rule automatically runs an action (defined by rule sets and/or backend
transitions) on records after a specified length of time has passed. For example, you
can use this rule to automatically close incident records that have been in a Resolved
state for a certain number of days.
To add a Run Scheduled Action rule, follow these steps:

   1. In the System Navigator, click Tailoring > Process Designer > Rule Sets.
   2. Click Search to open the Rule Set form, and then select the rule set to which you

     want to add the rule.

                   Note

                Out-of-box rule sets are labeled as Proprietary and you can edit
                user-defined rule sets only.

   3. Click Add Rule to open the Select Rule Type page, and then click Run
     Scheduled Action.

   4. Type a description in the Rule Description field.
   5. Click Edit to add conditions to the rule.

                   Note

                If you don't specify a condition, the value defaults to Always.

     When these conditions are met, a schedule instance is created and monitored by
     a backend scheduler.
   6. Select one of the following options to set the calculation method of the schedule
     instance:

          • Use field in record + interval: Enables you to configure when the rule is
          triggered by setting a time and an interval. To do this, you must specify a
          field in a record (to set the time) and a length of time (to set the interval).


        Enter the interval time in the Calc Interval field, and use the ddd hh:mm:ss
        time format:

                      Note

                   This option supports negative intervals. That is, you can specify
                   the length of time before a time that's set in a field.

        • Use javascript to set variable actionExecutionTime: Enables you to use
        JavaScript to set the time when the backend schedule is executed.
 7. Click Edit to set a further set of conditions that are applied once the time that's
    defined in the schedule instance is reached.
 8. In the Run Rule Set field, select the rule set that's applied to the current records
    when the backend schedule is executed.
 9. In the Action after Rule Set field, select the action that's performed on the
    current records after the rule set is applied. You can select to do nothing, save
    the record, or apply a backend transition. The list of available backend
    transitions is retrieved from the workflows of the current record's table name.
10. Click OK to add the new rule to the rule set.

          Note

         This rule takes locked records into account. If a record is locked when the
         rule is run, the action is automatically rescheduled.

            Caution

           A scheduled action is triggered based on the interval that's configured in
           the rule. If a user manually updates a field that the scheduled action will
           update later, the user's update will be overwritten by the scheduled
           action. For example, the im.schedule.unlinkAllChild Rule Set defines a
           scheduled action that will clear the Parent Incident field of all child
           incidents. If you click Unlink All in a parent incident, this scheduled action
           is triggered; before the scheduled action is completed, if a user manually
           changes the Parent Incident value of a child incident, the user's update
           will be cleared later.

Related topics


Process Designer
Process Designer security model
Adding a rule
Create a rule set


1.6.3.3.26. Group rules

Applies to User roles: System Administrator, Implementer
You can group multiple rules into a rule group with an overall condition. The system
runs all the rules in the rule group if the condition matches.
To group rules, follow these steps:

   1. Click Tailoring > Process Designer.
   2. Click Rule Sets > Search to open the Rule Set form.
   3. Select the rule set to which you want to add a group, and then click Add Group.
   4. Type a rule group name. For example, kmrules.
   5. Click Edit to add a condition.

                   Note

                If you don't enter a condition, it will default to Always

   6. Click OK to add the group name.
   7. Highlight the group by selecting it.
   8. Click Add Rule.
   9. Select a rule.
 10. Type the attributes in the Rule form.
 11. Repeat steps 8 to 11 if you want to add more rules.
 12. Click OKto create the rule group.

            Note

           You can add one or more rule groups within another rule group.

Related topics

Adding a rule
More Actions menu
Create a rule set


1.6.3.4. Using the Condition Editor

The Service Manager Condition Editor enables you to build a condition or set of
conditions without any programming language knowledge. Conditions always
evaluate to True or False. When a condition evaluates to True, the system runs the
rule or applies an action that the condition controls. For example, you can use
conditions to determine if a workflow transition should occur or if a rule should be
executed.

A condition item is an expression built from fields, operators, and values. A condition
item has a Left-Hand-Side (LHS) and a Right-Hand-Side (RHS), which are separated
by an operator. There can be a combination of variables, types, and values on either
side of the condition item. The Condition Editor uses a tabular format in which you
populate each element of the condition item (RHS, LHS, and operator) by using a
series of drop-down lists.

You can also build complex conditions with the Condition Editor. Complex conditions
are composed of groups of condition items that are connected by logical operators.

After you build a condition, Service Manager displays it in a user-readable form. See
the following example:


  ((description in Category = 100 OR display.name in Category =
  "Test") AND ((assoc.published.doc in CurrentFile
  !=true AND activity.mandatory.msg in Object <=20) OR error in
  SavedFile Starts With 101 OR ((the
  "edit.adaptive.learning" value in the "Knowledge Document"
  Security Area <= 123 AND the "update" value in the
  "Tailoring" Security Area = "always") OR test!=12)))

You can use the Condition Editor to perform the following tasks:

     Build a condition
     For more information, see Build a condition.
     Create a group of condition items
     For more information, see Create a group of condition items
     Edit a condition
     To do this, open the Condition Editor and click on the condition item that you
     want to edit. You can then edit the existing values.
     Delete a condition item or group of condition items
     To do this, open the Condition Editor, and then click the Delete Condition icon (-)
     beside the condition item or group of condition items that you want to delete.
     Clear all condition items and groups
     To do this, open the Condition Editor, click the More Actions icon (...), and then
     click Clear.

Related topics

Process Designer
Build a condition
Launch the Condition Editor from a rule
Launch the Condition Editor from a workflow


1.6.3.4.1. Launch the Condition Editor from
a rule

Applies to User roles: System Administrator, Implementer
The Condition Editor enables you to build a condition without any programming
language knowledge.

            Note

           You can launch the Condition Editor in the web client only.

To launch Condition Editor from a new rule, follow these steps:
   1. In the System Navigator, click Tailoring > Process Designer > Rule Sets.
   2. Click Search to open the Rule Set form, and then select the rule set to which you
     want to add the rule.

                   Note

                You can edit user-defined rule sets only. Out-of-box rule sets are
                labeled as Proprietary and can't be modified.

   3. Click Add Rule to open the Select Rule Type page, and then select the type of
     rule that you want to open.

   4. Type a description in the Rule Description field.
   5. Click Edit to open the Condition Editor and add conditions to the rule.

Related topics

Process Designer security model
Using the Condition Editor
Launch the Condition Editor from a workflow


1.6.3.4.2. Launch the Condition Editor
from a workflow

Applies to User roles: System Administrator, Implementer

The Condition Editor enables you to build a condition without any programming
language knowledge.

            Note

           You can launch the Condition Editor in the web client only.

To launch the Condition Editor from a workflow, follow these steps:

   1. Click Process Designer > Workflows in the System Navigator.
   2. Select an existing workflow or create a new workflow.
   3. You can launch the Condition Editor from workflow phases and workflows

     transitions.
           To launch the Condition Editor from a phase, select a phase, and then use
           one of the following methods:
                 In the Details tab, click the Form Edit Condition field.
                 In the Actions tab, click Add, and then click the Action Condition
                 field.
                 In the Approvals tab, click the Reset Condition or Recalculate
                 Condition field.
                 In the Alerts tab, click the Reset Condition or Recalculate Condition
                 field.
           To launch the Condition Editor from a transition, select a transition, and
           then click the Condition field in the Details tab.

            Note

           To close the Condition Editor, click Cancel.

Related topics

Process Designer security model
Using the Condition Editor
Launch the Condition Editor from a rule


1.6.3.4.3. Build a condition

Applies to User roles: System Administrator, Implementer

A condition has a Left-Hand-Side (LHS) and a Right-Hand-Side (RHS) that are
separated by an operator. There can be a combination of variables, types, and values
on either side of the condition.

            Note

           The data type in the RHS must match the data type in the LHS. For
           example, if you select a field that has a Boolean data type in the LHS, you
           must select a matching Boolean field in the RHS. Service Manager
           automatically validates the data types in conditions. If you don't enter
           matching data types, an error message is displayed in the appropriate
           drop-down list, and you can't save the condition until you correct the
           issue.

           If you decide to choose a value rather than a field in the RHS, Service
           Manager provides you with the option to type or select a value that's the
           same data type as the field in the LHS.

To build a condition, follow these steps:

   1. Open the Condition Editor.

     For example, click Edit in the Condition field to open the Condition Editor when
     you create or edit a rule.

   2. Click Match all of the following conditions, and then select the logical operator
     for the conditions. The following operators are available:

           Match all (this option corresponds to an AND operator)
           Match any (this option corresponds to an OR operator)
           Not match all (this option corresponds to negating all conditions)
           Not match any (this option corresponds to negating any of the specified
           conditions)

     Match all is selected by default.

   3. In the left-most drop-down list, select a data type for the LHS. The following
     table describes the available data types for the LHS.

Field                                                                                     Service Manager 9.81
Category
                                        Description
CurrentRecord
CurrentRecord Authorization             A field in the associated category
                                        definition of the current record
CurrentWorkflowPhase
Object                                              Note

                                                   Only displayed when the
                                                   category table is defined
                                                   in the object record.

                                        A field in the name of the current
                                        record

                                        A field in the name of the current
                                        record

                                                    Note

                                                   Only listed in the
                                                   condition editor in the
                                                   workflow editor.

                                        A field in the associated workflow
                                        phase definition of the current
                                        workflow

                                        A field in the Object definition of the
                                        current record

Field                                                                                     Service Manager 9.81
Phase
                                        Description
SavedRecord
SavedWorkflowPhase                      A field in the associated phase
                                        definition of the current record

                                                    Note

                                                   Only displayed when the
                                                   phase table is defined in
                                                   the object record.

                                        A field in the original copy of the
                                        current record (before the user
                                        made any changes)

                                        A field in the associated workflow
                                        phase definition of the original copy
                                        of the current workflow (before the
                                        user made any changes)

       Field                                                                              Service Manager 9.81
       RAD
       Expression                       Description

       Security                         Evaluates a RAD expression typed in
                                        the text area. For example:
This PDF was generated on May 23, 2026  evaluate(cls.control in $L.phase)
                                        and evaluate($L.tableAccess.delete)
                                        and open in $L.file=true and
                                        nullsub($G.ess, false)=false and
                                        approval.status in
                                        $L.file="approved" and (category in
                                        $L.file~="KM Document" or
                                        category in $L.file="KM Document"

                                                    Note

                                                   You can't combine this
                                                   condition with any other
                                                   type of condition.
                                                   Therefore, once you
                                                   enter a RAD expression,
                                                   click Done to build the
                                                   condition. You can
                                                   ignore all remaining
                                                   steps.

                                        An operator's security rights. You
                                        can choose rights from the drop-
                                        down list of defined values, such as:
                                        Change, Change Management
                                        Configuration, Change Tasks,
                                        Knowledge Management,
                                        Knowledge Administration, Security,
                                        or Tailoring.

                                                                                                                 Page 139 of 162
    Field                                                                                 Service Manager 9.81
    UserOption
                                        Description
    Variable
4. Select the field for comparison.     A user-selectable option for a
                                        Service Catalog item

                                                    Note

                                                        You must type the
                                                        name of the user
                                                        option.
                                                        The User Options
                                                        field only supports
                                                        string and boolean
                                                        values.

                                        Evaluates the value of a global, local,
                                        or thread variable condition. For
                                        example:
                                        $G.test
                                        $L.testNumber


Note

                   If a "one to one" or "many to one" cross table relationship is
                   defined for a field, the cross table fields are available for
                   selection in a second-level drop-down list. If relationships are
                   defined with more than one field in the same table, the second-
                   level drop-down enables you to specify the relationship, and a
                   third-level drop-down list enables you to select the field.
                   To quickly navigate to a field, move the focus to the field drop-
                   down list, and then type the name of the desired field. To
                   quickly navigate to a field in a second-level list, move the focus
                   to the first-level item in the drop-down list, and then type the
                   name of the desired field.

5. Select an operator. The following operators are available:

        Equals
        Not Equals
        Greater Than
        Greater Than or Equals
        Less Than
        Less Than or Equals
        Starts With

               Note

             For Boolean conditions that evaluate to !=true , you can use the
             following RAD expression:

                    ( nullsub(Boolean in $L.file,false) != true)

6. Select a value type for the RHS. The following table describes the available
  value types for the RHS.

Field                                                                                     Service Manager 9.81
Blank/NULL
Category                                Description
CurrentUser                             A blank or null value
CurrentRecord
CurrentWorkflowPhase                    A field in the associated category
                                        definition of the current record
Object
Phase                                   The user currently logged in to
SavedRecord                             Service Manager

SavedWorkflowPhase                      A field in the name of the current
                                        record

                                        A field in the associated workflow
                                        phase definition of the current
                                        workflow

                                        A field in the Object definition of the
                                        current record

                                        A field in the associated phase
                                        definition of the current record

                                        A field in the original copy of the
                                        current record (before the user
                                        made any changes)

                                        A field in the associated workflow
                                        phase definition of the original copy
                                        of the current workflow (before the
                                        user made any changes)

       Field                                                                              Service Manager 9.81
       Security
                                        Description
       UserOption
                                        An operator's security rights. You
This PDF was generated on May 23, 2026  can choose rights from the drop-
                                        down list of defined values, such as:
                                        Change, Change Management
                                        Configuration, Change Tasks,
                                        Knowledge Management,
                                        Knowledge Administration, Security,
                                        or Tailoring.

                                                    Note

                                                   The Knowledge
                                                   Management value is
                                                   displayed as
                                                   “Knowledge Document”
                                                   in the back-end RDBMS
                                                   and after you build the
                                                   condition.

                                        A user-selectable option for a
                                        Service Catalog item

                                                    Note

                                                        You must type the
                                                        name of the user
                                                        option.
                                                        The User Options
                                                        field only supports
                                                        string and boolean
                                                        values.

                                                                                                                 Page 143 of 162
Field                                                                                     Service Manager 9.81
Value
                                        Description

                                        Allows you to type a value that's
                                        appropriate for the data type on the
                                        LHS.

                                                    Note

                                                   If a Global List is defined
                                                   for the field that you
                                                   specified on the LHS, a
                                                   drop-down list of values
                                                   is available for selection
                                                   on the RHS. These
                                                   values are defined in the
                                                   Value List field of the
                                                   Global List.

Variable                                Evaluates the value of a global, local,
                                        or thread variable condition.

7. Select the field for comparison.

               Note

             To quickly navigate to a field, move the focus to the field drop-down
             list, and then type the caption of the desired field. To quickly
             navigate to a field in a second-level list, move the focus to the first-
             level item in the drop-down list, and then type the caption of the
             desired field.

8. Click Done to create the condition. Once you add a condition, Service Manager
  displays a user readable version.


            Note

                To edit an existing condition, open the condition by using the
                Condition Editor, and then click anywhere in the Condition Editor to
                enable editing.
                To delete an existing condition, click the Delete Condition icon (-)
                beside the condition that you want to delete.
                To cancel the creation of a condition, click Cancel to exit the
                Condition Editor.

Related topics

Process Designer
Launch the Condition Editor from a rule
Launch the Condition Editor from a workflow
Create a group of condition items


1.6.3.4.4. Create a group of condition
items

Applies to User roles: System Administrator, Implementer
You can create complex conditions by grouping condition items. A separate logical
operator applies to each group. You can add child and sibling groups to a complex
condition.

To add a group of condition items, click the Add Condition Group icon in the Condition
Editor. To add a child group of condition items, click the Add Condition Group icon in
the parent group.

To remove a group of condition items, click the Delete Condition icon (-) in the group.

            Note

           This action deletes all condition items within the group.

You can easily edit complex conditions by dragging groups and condition items. You
can drag a condition item into any group within the complex condition. You can drag a
group into any other group, apart from its own child.

Related topics

Process Designer
Launch the Condition Editor from a rule
Launch the Condition Editor from a workflow
Build a condition
Copy a condition


1.6.3.4.5. Copy a condition

Applies to User roles: System Administrator, Implementer

You can copy and paste conditions between Condition Editors. This saves you time if
you have a complex condition that you need to use multiple times within your
environment.

To copy a condition, follow these steps:

   1. Open the Condition Editor in the rule or workflow that contains the condition that
     you want to copy.

   2. Click the More Actions icon (...), and then select Copy.
   3. Close the Condition Editor, and then open the Condition Editor in the rule or

     workflow in which you want to paste the condition.
   4. Click the More Actions icon (...), and then select Paste to copy the condition into

     the rule or workflow.

            Note

           You can copy whole conditions only. You can't copy the individual simple
           conditions or groups of conditions that comprise a complex condition.

Related topics

Process Designer
Launch the Condition Editor from a rule
Launch the Condition Editor from a workflow
Create a group of condition items
Build a condition


1.6.3.4.6. Enable deprecated fields and
system fields in the Condition Editor

User Roles: System Administrator

A deprecated field is a field that's assigned the Deprecated usage type in the data
policy. A system field is a field that's assigned the System data type in the data
policy.

To display deprecated fields and system fields in the Condition Editor, follow these
steps:

   1. Click Tailoring > Process Designer > Configuration> Settings to display the
     Condition Editor Settings screen.

   2. Select the Display Deprecated Fields in Current Record checkbox if you want to
     display deprecated fields in Current Record. This option is selected by default.

   3. Select the Display System Fields in Current Record checkbox if you want to
     display system fields in Current Record. This option is selected by default.

   4. Click Save.

The selected field types will now appear in the drop-down lists in the Condition Editor.

Related topics

Process Designer
Launch the Condition Editor from a rule
Launch the Condition Editor from a workflow
````
