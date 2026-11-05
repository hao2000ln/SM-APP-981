---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.7 .. 1.7.1
printed_pages: 2095-2129
---

# 1.7 Process Designer Tailoring Best Practices

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.7. Process Designer Tailoring Best
Practices

Basic concepts

Service Manager Process Designer is a graphical interface that enables you to
develop the workflows that control the flow of a single record throughout its lifecycle
within Service Manager.

Process Designer enables you to perform the following tasks without being an expert
in RAD programming:

     Graphically create and update a workflow
     Define a workflow process in a graphical editor
     Create business rules to drive the workflow logic in a user-friendly interface
     Model complex processes that require branching and looping
     Lower the Total Cost of Ownership of Service Manager by enabling an intuitive
     and simplified configuration
     Simplify future upgrades by enabling standardization and clarity of business
     logic

Process Designer includes the following components:

     Workflow designer

     A graphic interface used to design and update a workflow

     Rules editor

     Used to create rules to enforce business logic in workflows and in forms

     Security model

     Provides a common role-based security model

     Task Planner

     A graphical interface used to design and update planned tasks

A workflow is a collection of phases, and the transitions between those phases. Each
phase represents the current state of the workflow and is linked to a form for data
capture.

Transitions


Transitions can connect phases in any manner to create a workflow that includes
many branches and loops back to previous phases. Transitions can be triggered
manually, automatically, or by default. A manual transition requires the workflow user
to make a manual decision to move to the next workflow phase. An automatic
transition moves the workflow to another phase based on data in the workflow record.
A default transition is a special case that moves the workflow automatically, when no
other automatic transition condition applies.

Rule sets

The rules editor enables administrators (such as business process owners,
implementers, and developers) to add or remove the out-of-box rules and actions of a
workflow to match particular business requirements. You can group individual rules
into a rule set to allow their re-use within the process. You can configure a rule set to
run when certain events occur, such as when a record is saved or updated. Rules can
also be set up to run when a workflow transition occurs.

Actions

You can also configure rules as actions, which allows operators to run rules on
demand rather than wait for specific events in the workflow. When an operator
initiates an action, the system runs the rule sets that are associated with that phase of
the workflow.

The Condition Editor

The Condition Editor enables you to apply conditions to rules, form conditions,
actions, alert and approval in phases, and the conditional Task Planner. When a
condition is met, the rule or action runs. You can also edit conditions by using the
Condition Editor.

The Process Designer security model

The Process Designer security model provides a consistent method to assign
permissions to users across all areas of the system. You can use the security model
to configure out-of-box rights for a specific role within an area. The security model
also provides standardized methods to manage user rights.

Service Manager Codeless modules

Process Designer features are implemented in the Knowledge Management, Change
Management, Request Fulfillment, Service Level Management, and Help Desk


(comprised of Service Desk, Incident Management, and Problem Management)
modules, as well as Time Period and Survey Integration.

To access the Process Designer features from the system navigator, click Tailoring >
Process Designer.

A typical Process Designer flow broadly comprises the following major tasks:

     Enforce business logic on traditional Service Manager forms by creating rule
     sets with rules that use out-of-box rule types
     Build a process flow by creating a workflow with phases and transitions
     Implementing your business process by associating forms, rule sets, approvals,
     and alerts in workflow phases and transitions.


1.7.1. Best practices for configuring rule
sets

This section describes the best practices and recommendations for configuring some
of the rule sets. Rules sets can enable Service Manager to perform tasks
automatically. For example, Service Manager can automatically assign a record to the
most applicable group based on a preset rule set.


1.7.1.1. Configure assignment rules

Service Manager uses assignment rules to automatically distribute records, such as
tasks, to the most appropriate groups or individuals for processing. You can configure
the assignment rules with different conditions. For example, you can set a rule so that
a record is automatically assigned to a group that handles the associated service, or
you can set a rule so that a record is automatically assigned to an individual who has
the lightest workload.

The following sections provide detailed information about the best practices of
configuring assignment rules:

Configure assignment rules for groups

You can configure group assignment rules so that a record can be automatically
assigned to a specific group or a group that handles the associated service, or based
on location, department, language, or company. The assignment rules can be
configured either by using the Assignment form or by using JavaScript.

Assign to a predefined or fixed group

You can use the Predefined or Fixed assignment rule to enable Service Manager to
automatically assign a record to a group.

If you use a predefined assignment rule, you can specify whether the assignment is
based on service, location, department, language, or company. You can also add
additional query to filter the assignment groups.

For example, in the out-of-box configuration, an assignment rule is configured in the
"sd.init.assignment.set" rule set of the Service Desk workflow. Based on the
predefined assignment rule, the system assigns the records based service and
location, as shown in the following screenshot.


Assign to a group that handles the associated service

In Service Manager, a record is usually associated with a service, so you can usually
assign the record to the Config Admin group or the Support Groups of the service.

Service Manager follows the following logic to decide the assignment group:

     If the service has only the Config Admin group, and no Support Groups are set,
     the Config Admin group of the service is used.
     If the service has both the Config Admin group and the Support Groups, then the
     assignment depends on the assignment type you specify for the rule:

           If the assignment type is Automatic - take first, the Config Admin group of
           the service is used.
           If the assignment type is Manual - let the user choose, a list that combines
           the Config Admin group and the Support Groups of the service is shown to
           the operator for selection.


            Note

           Note: If this rule is triggered by the system, the assignment type
           Automatic - take first is used even when you have selected Manual - let
           the user choose as the assignment type. This means that the Config
           Admin group of the system is used.

Use JavaScript to configure assignment rules for groups

In addition to using the configuration forms to configure assignment rules for groups,
you have the flexibility to use JavaScript to implement your assignment rules. In
JavaScript, you can use the groupValue variable to specify an assignment group or
a combination of groups.

In addition, when you assignment rules for groups, you use the Consider
Workschedule of Groups checkbox to specify whether the work schedule is
considered or not for the assignment.

Configure assignment rules for individuals

You can configure assignment rules for individuals so that a record can be
automatically assigned to a specific individual for processing. The assignment rules
can be configured either by using the Assignment form or by using JavaScript.

You can configure the assignment rules so that a record can be automatically
assigned to the following individuals:

     None: Do not assign to any individual
     A member of the assigned group: The member can be decided in a round robin
     manner or based on the workload of the group members
     Coordinator of the assigned group
     A specific assignee

Assign in a round robin manner

In the round robin manner, the system checks the latest assignment time of the
members in a group, and then assigns the record to the member who has the earliest
assignment time.

If you have a huge number of records to be assigned in Service Manager, follow these
guidelines to avoid possible performance issues:

     Only take recent assignments into account. By default, the value of 60 days is
     set while you add assignment rules in the round robin manner. You can adjust


the value based on your needs. If this value is set to 60 days, it means that only
assignments within the most recent 60 days are considered; assignments before
60 days are ignored. If the value is set to 0, it means there is no assignment time
restriction; all the assignments of the members are considered.

     Create index on the assignment time field and the assignee field of the
     corresponding table. This can avoid full table scans and thus can increase the
     query speed. At run time, the calculation SQL is as follows:

select [assignee field], max([assign time field]) time from [ticket file] where [assign
time field] >= [assigned time restriction] and [assignee field] isin [members in group]
group by [assignee field] order by time

Assign based on workload

You can use the "Number of Assigned Records" member type to configure the
assignment rules so that a record can be assigned based on people's workload. The
system checks the number of working records of all the members in a group and then
assigns the record to the member who has least working records.

To avoid possible performance issues for this assignment type, follow these
guidelines:


Only take open records into account. Usually you need to append the query
that filters out records other than the open records. You can use the Query
Editor to edit the query string. In the example below, the query string Status !=
"Closed" is appended.

In addition, you can further narrow down the filter result. For example, if you plan to
take only the open and critical records into account, you can append to the query
string as shown below:


     Create index on the assignee field and the fields of the appended query. This
     can avoid full table scans and can thus increase the query speed. At run time,
     the calculation SQL is as follows:

select [assignee field], count(*) ncnt from [ticket file] where [assignee field] isin
[members in group] and [the appended query string] group by [assignee field] order
by ncnt

Use Javascript to configure assignment rules for individuals

In addition to using the configuration forms to configure assignment rules for
individuals, you have the flexibility to use JavaScript to implement your assignment
rules. In JavaScript, you can use the assigneeValue variable to specify an assignee.

Contents

     1 Configure assignment rules for groups
           1.1 Assign to a predefined or fixed group
           1.2 Assign to a group that handles the associated service
           1.3 Use JavaScript to configure assignment rules for groups

     2 Configure assignment rules for individuals
           2.1 Assign in a round robin manner
           2.2 Assign based on workload
           2.3 Use Javascript to configure assignment rules for individuals


1.7.1.2. Run action rules

You can use the Run Action rules to enable Service Manager to perform automatic
cross table or module operations. For example, you can set the rules so that the
solution of an incident can be copied to the interaction from which the incident is
escalated.

Service Manager supports three types of the Run Action rules:

     Run Action rules on related records
     Run Action rules on other records
     Run Action rules on the current record


1.7.1.2.1. Configure Run Action rules on
related records

You can configure the Run Action rules to enable Service Manager to perform
automatic operations on related records. The relationship of the related records is
usually maintained by the Related Records functionality.

For example, when an incident is resolved, you might want to copy the incident
resolution to the related interaction from which the incident is escalated. In this case,
you can configure the Run Action rules with these steps:

   1. Define a rule set on the source table
   2. Define a rule set on the target table
   3. Configure the rule set on the source table into an appropriate workflow

Define a rule set on the source table

To copy the incident resolution, you can define a rule set on the source table
“probsummary” that stores incident records. The rule set definition form is as follows:

In addition to the above configuration, you also need to perform the following tasks:

     Select Related Records for the "Run Action on" field
     Select Escalate From Interaction for the "Relation Type" field. This means the
     target related record is the interaction from which the current incident is
     escalated.


     Select sd.copyIncidentSolution for the "Run Rule Set" field. This rule set is
     executed against the related interaction.
     Select Save for the "Action after Rule Set" field. The rule set is saved for the
     related interaction.

            Note

           Note: You can select "Do nothing", "save" or one of the back end
           transitions for this field.

                The back end transition list is retrieved from all the workflows of the
                current related record file based on your selected relation type. At
                run time, if some of the workflows don't have your selected back
                end transition, the corresponding transition is not run.

                For example, suppose you have a Change file "cm3r" and it meets
                the following conditions:

                      Relation type: You have selected "Caused Changes" as the
                      relation type.
                      Workflows: Based on the selected relation type, there are two
                      workflows for the Change file: "Normal Change" and "Standard
                      Change".
                      Back end transitions: The "Normal Change" workflow has the
                      back end transition "event.close", whereas the "Standard
                      Change" workflow doesn't.

                In this case, if you select the action "Backend Transition:
                event.close", and if at run time there are two related caused
                changes: One for "Normal Change" and the other for "Standard
                Change", the back end transition is only run on the "Normal Change"
                workflow, not on the "Standard Change" workflow.

                You are suggested to use the same back end transition name in
                different workflows if these backend transitions follow the same
                business logic.
                While a back end transition is selected from the list, the interface is
                updated to indicate to which workflows the transition applies and to
                which it doesn't apply.

The form on which you can perform these tasks is shown below:


Define a rule set on the target table

You need to define a rule set on the target table. This rule set is used as the value of
the "Run Rule Set" field when you define the rule set on the source table. In this
example, you define the rule set “sd.copyIncidentSolution” on the target table
“incidents” that stores the interaction records.


You need to configure a Set Field rule in this rule set to append the resolution of the
incident to the resolution field of the interaction. To do this, you can use JavaScript, in
which you can refer to the current source record as srcRecord and the original copy
of the source record (before any changes are made by the user) as oldSrcRecord .
The system only supports invoking the current rule from the Run Action rule at run
time. The JavaScript of this example is as follows:

value = record.resolution.toArray().concat( ["Copy resolution from Incident " +
srcRecord.number + " on " + new Date() + ":"], srcRecord.resolution.toArray());

In JavaScript, the current record and the original copy of the record are also referred
as record and oldRecord . In this example, they are the current interaction record
and original interaction record.

Configure the rule set on the source table into an
appropriate workflow

In this example, you can configure the rule set into the After successful enter event
of the Review phase of the Incident workflow. This means only after the incident
record is resolved, the rule set is triggered.


Note

Note: The Run Action rule is executed in a sequential manner, which
means the configured rule sets and actions of each related record are
called one after another. If one of the rule sets and actions fails, for
example, one of the related record is locked by another user, the whole
execution stops and returns with a failure result. If you want the system to
handle the failed execution on related records caused by record locking,
you can combine the Run Action rules and the Run Scheduled Action
rules. For details, see Combine the Run Action rules and the Run
Scheduled Action rules.


1.7.1.2.2. Configure Run Action rules on
other records

You can configure the Run Action rules to enable Service Manager to perform
automatic operations on other records. The relationship of the records is built by
manually defined query string. For example, you might want to sync up the status of
an incident to its relevant incident tasks, that's to say, if the incident is suspended, the
relevant incident tasks should be suspended as well.

To configure Run Action rules on other records, follow these steps:

   1. Define a rule set on the source table
   2. Define a rule set on the target table
   3. Configure the rule set on the source table into an appropriate workflow

Define a rule set on the source table

In this example, you can define the rule set on the source table “probsummary” that
stores incident records:

In addition to the above configuration, you also need to configure the Run Action rules
in the rule set as follows:


Select Other Records for the "Run Action on" field.
Select imTask for the "Table Name" field. This means the target records are
incident tasks.
Use the Query Editor to configure the Filter Record as shown below. The only
incident task that belongs to current incident record is included.

     Select im.task.syncSuspendFromParent for the Run Rule Set field. This rule set
     is executed against the related incident task.
     Select Save for the "Action after Rule Set" field. The save action is executed
     against the related incident task.

            Note

           NoteYou can select Do nothing, Save, or one of the back-end transitions
           for this field.

                The back-end transition list is retrieved from all the workflows of the
                selected record file. Similar to Configure Run Action rules on related
                records, at run time, if some of the other records don't have your
                selected back-end transition, the corresponding transition is not run.
                You are suggested to use the same back-end transition name in
                different workflows if these back-end transitions follow the same
                business logic.
                While a back-end transition is selected from the list, the interface is
                updated to indicate to which workflows the transition applies and to
                which it doesn't apply.

The form on which you can perform these tasks is shown below:


Define a rule set on the target table

You need to define a rule set on the target table. This rule set is used as the value of
the "Run Rule Set" field when you define the rule set on the source table. In this
example, you define the rule set “im.task.syncSuspendFromParent” on the target
table “imTask” that stores the incident task records.


You need to configure a Set Field rule to change the status of the incident task to the
value of “Suspended”. To do this, you can use JavaScript, in which you can refer to
the current source record as srcRecord and the original copy of the source record
(before any changes are made by the user) as oldSrcRecord . The system only
supports invoking the current rule from the Run Action rule at run time.


In JavaScript, the current record and the original copy of the record are also referred
as record and oldRecord . In this example, they are the current incident task record
and original incident task record.

Configure the rule set on the source table into an
appropriate workflow

In this example, you can configure the rule set into the After successful update event
of the incident workflow, which means when the status of the incident record is
changed to “Suspended”, the rule set is triggered.


Note

Note: The Run Action rule is executed in a sequential manner, which
means the configured rule sets and actions of each related record are
called one after another. If one of the rule sets and actions fails, for
example, one of the related record is locked by another user, the whole
execution stops and returns with a failure result. If you want the system to
handle the failed execution on related records caused by record locking,
you can combine the Run Action rules and the Run Scheduled Action
rules. For details, see Combine the Run Action rules and the Run
Scheduled Action rules.


1.7.1.2.3. Configure Run Action rules on
the current record

You can configure the Run Action rules to enable Service Manager to perform
automatic operations on the current record. Usually this rule type can be used to
easily expose a back end transition call as an action. To expose a back end transition
configured in a workflow, you can use JavaScript or RAD calls as well. However, that
approach is not quite user-friendly. By using the Run Action rules, you can easily
expose the back end transitions. For details about calling back end transitions, see
the Workflow back end transitions section in Configure a workflow.
For example, in the out-of-box incident workflow, there is a back end transition
“close.any.time” that can move the incident to the Closure phase whatever current
phase is. The back end transition is shown as follows:

To be able to invoke the transition, you need to first add a rule set that contains the
Run Action rule, and then mark this rule set as Available as action, as shown below:


In addition, you also need to configure the Run Action rules in rule set as follows:

     Select Current Record for the "Run Action on" field
     Keep the "Run Rule Set" field empty
     Select Backend Transition:close.any.time for the "Action after Rule Set" field.
     The save action is executed against the current incident record.

            Note

           Note: You can select Do nothing, Save, or one of the back-end
           transitions.

                The back-end transition list is retrieved from all the workflows of the
                selected record file. Similar to Configure Run Action rules on related
                records, at run time, if some of the other records don't have your
                selected back-end transition, the corresponding transition is not run.
                You are suggested to use the same back-end transition name in
                different workflows if these back-end transitions follow the same
                business logic.
                While a back-end transition is selected from the list, the interface is
                updated to indicate to which workflows the transition applies and to
                which it doesn't apply.


The form on which you can perform these tasks is shown below:

Upon completing all the above configurations, you can expose the rule set as an
action by adding it to the workflow level actions:

            Note

           Note: Only expose such actions to specific persons or operations. For
           example, you can expose it to the person who has the Expert permission
           on the Incident area by setting the security level with the Action
           Condition. If you want to make it available only to a Web Service call, set
           your Action Condition accordingly.


1.7.1.2.4. Configure Run Scheduled Action
rules

You can configure the Run Scheduled Action rules to enable Service Manager to
perform scheduled automatic operations on the current record. This rule can be used
in situations like automatic record closure.

For example, you might want the system to automatically close the incidents that were
resolved seven days ago. To do that, first define a rule set with the Run Scheduled
Action rules. You can define the rule set on the table “probsummary” that stores
incident records, as shown below:

In addition to the above configurations, you also need to configure the Run Scheduled
Action rules in this rule set as follows:

     Set the conditions as follows. This only takes the low priority incidents into
     account.


At run time, only when the condition is matched, this rule is executed to generate
a scheduled record with the class of “scheduledAction”. Note that this rule type
introduces a new back end scheduler process named “Scheduled Action
processor”, which checks for the schedule records and executes them.
Select Use field in record + interval for the Calculation Type field
Select Resolved Time for the Calc Field field

            Note

           Note: Make sure the resolve time of the incident is set correctly
           while the incident is resolved, because the schedule execution time
           is calculated based on the value of that field.

Set 7 00:00:00 for the Calc Interval field. This means the scheduled action is
executed after seven days.
Set the Action Condition as follows. The condition is checked when the
scheduled time arrives. In this example, it is seven days after the incident is
resolved. Only when the status of the incident is still Resolved, and the priority is
still low at the time, the action is executed; otherwise the action is ignored.

     Keep the Run Rule Set field empty  Page 67 of 341

This PDF was generated on May 23, 2026

     Select Backend Transition:close.any.time for the "Action after Rule Set" field.
     The save action is executed against the current record by the back end
     scheduler process when the scheduled time arrives.

            Note

           Note: You can select Do nothing, Save, or one of the back-end
           transitions.

                The back-end transition list is retrieved from all the workflows of the
                selected record file. Similar to Configure Run Action rules on related
                records, at run time, if some of the other records don't have your
                selected back-end transition, the corresponding transition is not run.
                You are suggested to use the same back-end transition name in
                different workflows if these back-end transitions follow the same
                business logic.
                While a back-end transition is selected from the list, the interface is
                updated to indicate to which workflows the transition applies and to
                which it doesn't apply.

The form on which you can perform these tasks is shown below:


            Note

           Note: The Run Scheduled Action rule doesn't support selecting work
           schedule and time zone in this release.

To make the Run Scheduled Action rules work at run time, make sure the back end
processor “Scheduled Action processor” is started, as shown below:


1.7.1.2.5. Combine the Run Action rules
and the Run Scheduled Action rules

In Service Manager, the Run Action rules are executed in a sequential manner. Take
the related records as an example, if one of the rules sets or actions against the
related records fails, the whole execution stops and returns a failure result. To ensure
successful execution, you can combine the Run Action rules and the Run Scheduled
Action rules, so that the execution can be scheduled if it fails due to record locking.

In the out-of-box configuration, when the status of an incident changes, the status of
the related interaction also changes accordingly. To achieve this, a rule set
im.sync.status.to.interaction is configured in the After successful update event of
the Incident workflow, as shown below.

This rule set is configured on the "probsummary" table that stores incident records:


In addition, you also need to configure the Run Action rules in the rule set as follows:

     Name the condition something like "Sync Interaction Status", which makes it
     easy for you to understand the purpose of the condition

     Select Related Records for the "Run Action on" field

     Select Escalate From Interaction for the "Relation Type" field. This means the
     target related record is the interaction from which incident is escalated.

     Select sd.sync.status.from.escalation for the "Run Rule Set" field. This rule set
     is executed against the related interaction. To handle the operation failure on
     locked interaction, this rule set must contain the Run Scheduled Action rule.

     Select Do nothing for the "Action after Rule Set" field. Actions like the save
     operation on target records are configured in the
     sd.sync.status.from.escalation rule set.

The form on which you can perform these tasks is shown below:


After defining the rule set on the source table, you need to define the rule set on the
target table. The rule set on the target table is used as the value of the "Run Rule Set"
field when you define the rule set for the source table. In this example, you define the
rule set sd.sync.status.from.escalation on the target table "incidents" that stores the
interaction records:

In this rule set, a Scheduled Action rule is configured to sync up the status of the
incident and the status of the interaction. The configuration is as follows:


Specify the scheduled execution time as the current time by using JavaScript.
This ensures the schedule is executed as early as possible, that is, it is executed
the next time the back end scheduler "Scheduled Action processor" is activated.

Select Escalate From Interaction as the Relation Type. This means the target-
related record is the interaction from which the incident is escalated.

Specify the Action condition to call a JavaScript method
StatusSyncServiceBeanWrapper.callBeanMethod("setSyncStatus",$L.file) . All
the main logic is included in this JavaScript method.

    • If status synchronization is needed and successful, this method returns
    true, and then the Save action is executed.

    • If status synchronization is not needed, this method returns false, and then
    the Save action is ignored automatically.

Keep the Run Rule Set field empty.

Select Save for the "Action after Rule Set" field. While the record is saved, if it is
locked, the saving operation fails, and a schedule record is rescheduled instead
of being deleted.

      Note

     Note: Variables, which are referred to as srcRecord for the current
     source record and as oldSrcRecord for the original source record in
     JavaScript, aren't supported if the Run Scheduled Action rules are used.
````
