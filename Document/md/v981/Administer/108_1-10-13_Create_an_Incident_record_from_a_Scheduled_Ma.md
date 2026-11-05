---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.10.13 .. 1.10.25
printed_pages: 2709-2732
---

# 1.10.13 Create an Incident record from a Scheduled Maintenance task

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.10.13. Create an Incident record from a
Scheduled Maintenance task

Applies to User roles: System Administrator

To create an Incident record from a Scheduled Maintenance task:

   1. Click System Administration > Base System Configuration > Scheduled
     Maintenance > Scheduled Maintenance Tasks.
     Service Manager displays a blank Scheduled Maintenance form.

   2. Specify the required information on the Description and Schedule tabs
   3. Click the Effect tab and select one of the following.

           Create One Incident Ticket
           Create one Incident Ticket for each Device of Class X at location Y.
   4. If you selected Create One Incident Ticket for each Device of Class X at location
     Y, do the following:
        1. Select the asset type in the Open for this Device Type field.
        2. Select the location in the At Location field.
        3. You can specify the selection of assets to be maintained. Click Use
           Advanced Query. Service Manager replaces the location and asset based
           selection boxes with All Devices Matching This Query.
        4. Type the query in the All Devices Matching This Query field. Scheduled
           Maintenance requires that you specify a query in All Devices Matching
           This Query if you select Use Advanced Query. It doesn't validate this
           value. It is recommended that you test all queries using Asset Management
           to ensure that the query returns the correct records in a production
           environment.

     Note: Unless you change Max Generation Count, Service Manager generates a
     maximum of 50 records.

   5. Click the Details tab to display a list of fields for the Incident records.
   6. Complete the following fields.

        1. Open Incident Tickets of Category
        2. Assign to
        3. Set Status to
        4. With Ticket Owner of
        5. With Priority Code of
        6. With a Company of
   7. If you are creating one Incident record, select the asset using the appropriate
     drop-down list. If you are creating a group of Incident records, Work on This


     Device is unavailable. Instead, Scheduled Maintenance automatically sets a
     value as it works its way though your Configuration Items (CIs) to create records
     for each relevant asset.
   8. Type optional Expressions for the record.
   9. Choose a Format Control record for the record.
 10. Click the Parts & Labor tab. When Service Desk generates the Incident record, it
     automatically copies any parts and labor estimates that you specify here. Cost
     estimating tools also use this information.

Related topics

Scheduled Maintenance
Access Scheduled Maintenance
Check the execution details of a task
Check the execution history of a task
Create a change request from a Scheduled Maintenance task
Create a Request Fulfillment request from a Scheduled Maintenance task
Create a schedule for a task
Create a Scheduled Maintenance task
Create a Scheduled Maintenance task for an asset?
Create a Scheduled Maintenance task from an open record
Define the effect and details of a Scheduled Maintenance task
Force a task to run immediately
Schedule intervals
Set the demand criteria for a task
Specify incremental repetition
Specify manual repetition
Specify quiescent repetition
Use expressions and Format Control only in a Scheduled Maintenance task
Use the Cost Estimate tool


1.10.14. Define the effect and details of a
Scheduled Maintenance task

Applies to User roles: System Administrator

To define the effect and details of a Scheduled Maintenance task:

   1. Click System Administration > Base System Configuration > Scheduled
     Maintenance > Scheduled Maintenance Tasks.

   2. Specify the required information on the Description and Schedule tabs
   3. Click the Effect tab.
   4. Specify the type of task you would like to create by selecting one of the

     following choices.
           Create One Incident Ticket
           Create One Change Request

           Create One RM Request

           Create one Incident Ticket for each Device of Class X at location Y
           Create one Change Request for each Device of Class X at location Y

           Create One RM Request for each Device of Class X at location Y

           Create Nothing: Only Execute Expressions and Format Control
     You can limit the creation of multiple tasks to only those assets at a particular
     location by filling in the Location field. If you don't specify a location, the task
     creates an Incident record, change request, or Request Fulfillment request for
     every Configuration Item (CI) of the appropriate type in your Configuration
     Management database, regardless of its location.
   5. Specify a title. This is the title on the Incident record, change request, or Request
     Fulfillment request.
   6. Type descriptive text. This is the description on the Incident record, change
     request, or Request Fulfillment request that Scheduled Maintenance creates.
   7. Click the Details tab.
   8. Specify the task details depending on whether you are creating an Incident
     record, change request, or Request Fulfillment request.

Related topics

Scheduled Maintenance
Access Scheduled Maintenance
Check the execution details of a task


Check the execution history of a task
Create a change request from a Scheduled Maintenance task
Create a Request Fulfillment request from a Scheduled Maintenance task
Create a schedule for a task
Create a Scheduled Maintenance task
Create a Scheduled Maintenance task for an asset?
Create a Scheduled Maintenance task from an open record
Create an Incident record from a Scheduled Maintenance task
Force a task to run immediately
Schedule intervals
Set the demand criteria for a task
Specify incremental repetition
Specify manual repetition
Specify quiescent repetition
Use expressions and Format Control only in a Scheduled Maintenance task
Use the Cost Estimate tool


1.10.15. Force a task to run immediately

Applies to User roles: System Administrator

To force a task to run immediately:

   1. Click System Administration > Base System Configuration > Scheduled
     Maintenance > Scheduled Maintenance Tasks.

   2. Click Search to run a query of Scheduled Maintenance tasks. Scheduled
     Maintenance displays a record list of Scheduled Maintenance tasks.

   3. Double-click the selected task.
   4. Locate Next Scheduled At:. This field contains a calculated time when

     Scheduled Maintenance will run the task.
   5. Change the date to an earlier date, such as 01/01/1990.
   6. If necessary, select the Active checkbox. (Only active tasks run.)
   7. Click Save.
   8. Click OK.

By default, Scheduled Maintenance checks for tasks to run every 60 seconds. You
might wait up to one minute before your task executes. After enough time elapses for
the task to run, repeat the steps to locate the Scheduled Maintenance task. If the task
ran, the Next Scheduled At field changes.

After a task runs, Scheduled Maintenance automatically reschedules it for the next
appropriate time.

Demand based tasks

   1. Click Configuration Management > Resources > Search CIs.
   2. Click Search.
   3. Select a record from the record list.
   4. Update the device record to meet the trigger criteria for the maintenance task.

     The maintenance task runs as soon as you update the record.

Related topics

Scheduled Maintenance
Access Scheduled Maintenance
Check the execution details of a task
Check the execution history of a task
Create a change request from a Scheduled Maintenance task
Create a Request Fulfillment request from a Scheduled Maintenance task


Create a schedule for a task
Create a Scheduled Maintenance task
Create a Scheduled Maintenance task for an asset?
Create a Scheduled Maintenance task from an open record
Create an Incident record from a Scheduled Maintenance task
Define the effect and details of a Scheduled Maintenance task
Schedule intervals
Set the demand criteria for a task
Specify incremental repetition
Specify manual repetition
Specify quiescent repetition
Use expressions and Format Control only in a Scheduled Maintenance task
Use the Cost Estimate tool


1.10.16. Schedule intervals

Applies to User roles: System Administrator

To schedule intervals:

   1. Click System Administration > Base System Configuration > Scheduled
     Maintenance > Scheduled Maintenance Tasks.

   2. Click Search to run a query of Scheduled Maintenance tasks. Scheduled
     Maintenance displays a record list of Scheduled Maintenance tasks.

   3. Double-click the selected task.
   4. Select the interval option you want to use:

           Regular repeat interval
              1. Click Regularly.
              2. Choose the date and time for the first occurrence in the Every field.

           Weekly repeat interval
              1. Click Weekly.
              2. Select the day of the week from the Every drop-down list.

           Monthly repeat interval
                 Date in the month
                    1. Click Monthly.
                    2. Select a date from the Every drop-down list.
                 Week and day of the month
                    1. Click Monthly.
                    2. Select a week of the month from the Every drop-down list.
                    3. Select a day of the week from the second drop-down list.

           Annual repeat interval
                 Date in the year
                    1. Click Annually.
                    2. Select the sequential day of the year from the Every drop-down
                       list.
                 Month and day of the year
                    1. Click Annually.
                    2. Select a month from the Every drop-down list.
                    3. Select a date from the second drop-down list.

           Arbitrary schedule
              1. Click On an Arbitrary Schedule.
              2. Click a row in the Recurrence Schedule: table. Choose a date and
                 time. You can repeat this step for each scheduled occurrence.


Related topics

Scheduled Maintenance
Access Scheduled Maintenance
Check the execution details of a task
Check the execution history of a task
Create a change request from a Scheduled Maintenance task
Create a Request Fulfillment request from a Scheduled Maintenance task
Create a schedule for a task
Create a Scheduled Maintenance task
Create a Scheduled Maintenance task for an asset?
Create a Scheduled Maintenance task from an open record
Create an Incident record from a Scheduled Maintenance task
Define the effect and details of a Scheduled Maintenance task
Force a task to run immediately
Set the demand criteria for a task
Specify incremental repetition
Specify manual repetition
Specify quiescent repetition
Use expressions and Format Control only in a Scheduled Maintenance task
Use the Cost Estimate tool


1.10.17. Set the demand criteria for a task

Applies to User roles: System Administrator

Demand-based tasks run when the rask relies on a change in the Configuration
Management application. You define the criteria, or trigger, that causes the task to be
executed.

To set the demand criteria for a task:

   1. Click System Administration > Base System Configuration > Scheduled
     Maintenance > Scheduled Maintenance Tasks.

   2. Type a name for the task in the Name field. Every task needs a unique name.
     This name can offer some insight into what the task does, but you may use any
     naming convention, as long as each name is unique.

   3. Select Active? to activate the task. Every task must be active or inactive.
     Inactive tasks are still in the system, but create no work orders or take any other
     action.

   4. Select Demand Based?.
   5. Type a description of the task.
   6. Click the Demand Trigger tab.
   7. Choose the device you want to monitor. Click Fill to display a list of available

     devices. Double-click the device name. Ensure that the name you specify is an
     exact match to the device name in the database.
   8. Define the criteria which triggers this task. Type the name of the field to monitor
     in the Trigger When this Field: text box. This name must match a field name for
     the device you chose in the previous step.
   9. Specify a threshold symbol, such as greater than (>), less than (<), or equal (=).
 10. Specify a numeric trigger value that triggers this maintenance task when the
     value is true in the This Value: text box.

The combination of a field name, a sign, and a threshold value can be viewed as a
simple equation:
Execute task if field name is symbolthreshold.

Related topics

Scheduled Maintenance
Access Scheduled Maintenance
Check the execution details of a task
Check the execution history of a task
Create a change request from a Scheduled Maintenance task


Create a Request Fulfillment request from a Scheduled Maintenance task
Create a schedule for a task
Create a Scheduled Maintenance task
Create a Scheduled Maintenance task for an asset?
Create a Scheduled Maintenance task from an open record
Create an Incident record from a Scheduled Maintenance task
Define the effect and details of a Scheduled Maintenance task
Force a task to run immediately
Schedule intervals
Specify incremental repetition
Specify manual repetition
Specify quiescent repetition
Use expressions and Format Control only in a Scheduled Maintenance task
Use the Cost Estimate tool


1.10.18. Specify incremental repetition

Applies to User roles: System Administrator

Some demand-based maintenance activities depend on a steadily increasing (or
decreasing) value. For example, you want to change the oil in your car every 3,000
miles. Therefore, you expect a maintenance task to trigger when your car reaches
3,000 miles, then again at 6,000 miles, and again at 9,000 miles.

To specify incremental repetition:

   1. Click System Administration > Base System Configuration > Scheduled
     Maintenance > Scheduled Maintenance Tasks.

   2. Follow the procedure for setting the demand criteria for a task, as described in
     the related topics.

   3. In the Determine when to run next by: field, select Adding to the previous
     trigger value or Subtracting from the previous trigger value from the drop-
     down list.

   4. Specify a value in the Repeat Increment field.

The system automatically recalculates a new threshold value by adding or subtracting
your repeat increment from the previous threshold value when your task runs.

Related topics

Scheduled Maintenance
Access Scheduled Maintenance
Check the execution details of a task
Check the execution history of a task
Create a change request from a Scheduled Maintenance task
Create a Request Fulfillment request from a Scheduled Maintenance task
Create a schedule for a task
Create a Scheduled Maintenance task
Create a Scheduled Maintenance task for an asset?
Create a Scheduled Maintenance task from an open record
Create an Incident record from a Scheduled Maintenance task
Define the effect and details of a Scheduled Maintenance task
Force a task to run immediately
Schedule intervals
Set the demand criteria for a task
Specify manual repetition
Specify quiescent repetition


Use expressions and Format Control only in a Scheduled Maintenance task
Use the Cost Estimate tool


1.10.19. Specify manual repetition

Applies to User roles: System Administrator

Use manual repetition when your demand based task doesn't fit into quiescent or
incremental repetition categories.

To specify manual repetition:

   1. Click System Administration > Base System Configuration > Scheduled
     Maintenance > Scheduled Maintenance Tasks.

   2. Follow the procedure for setting the demand criteria for a task, as described in
     the related topics.

   3. From the Determine when to run next by: field, select Do Not Run Again.

This task runs once when conditions satisfy the trigger criteria. The task remains
inactive until you activate it manually . You can use this model for one-time
maintenance events or tasks that require human intervention to recalculate the trigger
conditions.

Related topics

Scheduled Maintenance
Access Scheduled Maintenance
Check the execution details of a task
Check the execution history of a task
Create a change request from a Scheduled Maintenance task
Create a Request Fulfillment request from a Scheduled Maintenance task
Create a schedule for a task
Create a Scheduled Maintenance task
Create a Scheduled Maintenance task for an asset?
Create a Scheduled Maintenance task from an open record
Create an Incident record from a Scheduled Maintenance task
Define the effect and details of a Scheduled Maintenance task
Force a task to run immediately
Schedule intervals
Set the demand criteria for a task
Specify incremental repetition
Specify quiescent repetition
Use expressions and Format Control only in a Scheduled Maintenance task
Use the Cost Estimate tool


1.10.20. Specify quiescent repetition

Applies to User roles: System Administrator

Choosing quiescent repetition creates a pause interval. For example, a maintenance
task that runs whenever the available disk space on a file server drops below 10 GB
can be set to pause for a week to enable IT to put a new drive on the server. Within
this one week window, if the available space on the server continues to fall below the
threshold value, the task doesn't run. At the end of the pause interval, if the available
space is still beneath the threshold, the task runs again to create another change
request.

Quiescent repetition creates a pause that enables you to resolve the issue that
triggered the maintenance without creating multiple maintenance tasks on the issue.

To specify quiescent repetition:

   1. Click System Administration > Base System Configuration > Scheduled
     Maintenance > Scheduled Maintenance Tasks.

   2. Follow the procedure for setting the demand criteria for a task, as described in
     the related topics.

   3. From the Determine when to run next by: field, select Stop monitoring device
     for a specified time.

   4. Choose a beginning date and time in the Pause For: field.
   5. Choose an ending date and time in the Currently Paused Until: field.

Related topics

Scheduled Maintenance
Access Scheduled Maintenance
Check the execution details of a task
Check the execution history of a task
Create a change request from a Scheduled Maintenance task
Create a Request Fulfillment request from a Scheduled Maintenance task
Create a schedule for a task
Create a Scheduled Maintenance task
Create a Scheduled Maintenance task for an asset?
Create a Scheduled Maintenance task from an open record
Create an Incident record from a Scheduled Maintenance task
Define the effect and details of a Scheduled Maintenance task
Force a task to run immediately
Schedule intervals


Set the demand criteria for a task
Specify incremental repetition
Specify manual repetition
Use expressions and Format Control only in a Scheduled Maintenance task
Use the Cost Estimate tool


1.10.21. Use expressions and Format
Control only in a Scheduled Maintenance
task

Applies to User roles: System Administrator

To use expressions and format control in a Scheduled Maintenance task:

   1. Click System Administration > Base System Configuration > Scheduled
     Maintenance > Scheduled Maintenance Tasks. Service Manager displays a
     blank Scheduled Maintenance form.

   2. Specify the required information on the Description and Schedule tabs
   3. Click the Effect tab.
   4. Click Create Nothing: Only execute expressions and Format Control.
   5. Click the Details tab.
   6. Complete With a Company of.
   7. Type optional Expressions for the record.
   8. Choose a Format Control record for the record.

Related topics

Scheduled Maintenance
Access Scheduled Maintenance
Check the execution details of a task
Check the execution history of a task
Create a change request from a Scheduled Maintenance task
Create a Request Fulfillment request from a Scheduled Maintenance task
Create a schedule for a task
Create a Scheduled Maintenance task
Create a Scheduled Maintenance task for an asset?
Create a Scheduled Maintenance task from an open record
Create an Incident record from a Scheduled Maintenance task
Define the effect and details of a Scheduled Maintenance task
Force a task to run immediately
Schedule intervals
Set the demand criteria for a task
Specify incremental repetition
Specify manual repetition
Specify quiescent repetition
Use the Cost Estimate tool



1.10.22. Use the Cost Estimate tool

Applies to User roles: System Administrator

To use the Cost Estimate tool:

   1. Click System Administration > Base System Configuration > Scheduled
     Maintenance > Scheduled Maintenance Tasks.

     Service Manager displays a blank Scheduled Maintenance form.

   2. Click Search to run a query of Scheduled Maintenance tasks. Scheduled
     Maintenance displays a record list of Scheduled Maintenance tasks.

   3. From the record list More Actions menu, choose Estimate Costs. Scheduled
     Maintenance displays a form where you can specify the cost estimate
     parameters.

   4. Specify a start and an end date for your estimation period using the drop-down
     calendars.

   5. The default currency value is US Dollar. Click the row to choose a different value
     from the drop-down list.

   6. Click Proceed.

Scheduled Maintenance calculates the number of times that each task will run within
the time frame you specified and the cost to run each task once. The results of these
calculations display in a spreadsheet.

Related topics

Scheduled Maintenance
Access Scheduled Maintenance
Check the execution details of a task
Check the execution history of a task
Create a change request from a Scheduled Maintenance task
Create a Request Fulfillment request from a Scheduled Maintenance task
Create a schedule for a task
Create a Scheduled Maintenance task
Create a Scheduled Maintenance task for an asset?
Create a Scheduled Maintenance task from an open record
Create an Incident record from a Scheduled Maintenance task
Define the effect and details of a Scheduled Maintenance task
Force a task to run immediately
Schedule intervals


Set the demand criteria for a task
Specify incremental repetition
Specify manual repetition
Specify quiescent repetition
Use expressions and Format Control only in a Scheduled Maintenance task


1.10.23. Administrative access to
Scheduled Maintenance

As an application administrator, you can create Scheduled Maintenance templates
and manage task limits. You can access Scheduled Maintenance administration by
clicking System Administration > Base System Configuration > Scheduled
Maintenance > Administrative Options.

Related topics

Scheduled Maintenance
Scheduled Maintenance features


1.10.24. Scheduled Maintenance features

Scheduled Maintenance enables you to create and store as many maintenance tasks
as you need for your organization. You can:

     Create and schedule recurring maintenance tasks, including Incident records,
     change requests and Request Fulfillment requests, using closed loop integration
     with Service Manager.
     Keep all scheduled maintenance tasks in a central repository to ensure that
     important maintenance occurs on time. Stored maintenance tasks automatically
     generate Incident records, change requests, or Request Fulfillment requests as
     they become due.
     Automatically use Service Manager to notify users about maintenance tasks as
     they are due.
     Create and update Scheduled Maintenance tasks even if you are unfamiliar with
     Service Manager.
     Make audit information available as necessary. The maintenance history and the
     auditing information for each task is available for review.
     Create sophisticated and detailed maintenance tasks.
     Maintain existing Service Manager customization and tailoring.
     Track scheduled maintenance tasks.

Related topics

Scheduled Maintenance
Administrative access to Scheduled Maintenance


1.10.25. Automated task generation

There are two ways that Scheduled Maintenance automatically generates tasks.

     Create the scheduled maintenance task from an existing incident record, change
     request, or Request Fulfillment request.
     Create the scheduled maintenance task from a default incident, change, or
     request template identified in Administrative Options for a Configuration Item
     (CI) in Configuration Management.

Generating tasks from an existing record

Generating scheduled maintenance tasks can be tedious, especially if you must
generate a large number of tasks to do approximately the same thing. For example,
you might want to generate 10 scheduled maintenance tasks to back up 10 servers.
When tasks are similar, you can use a standard template. For example, you can create
a default Change Management template for server backups.

Scheduled Maintenance enables you to access Incident Management, Change
Management, or Request Management, find a record, and generate a scheduled
maintenance task. Therefore, instead of creating 10 scheduled maintenance tasks
manually that are variations on the default template, you can access the template
from Change Management and select Generate Maintenance 10 times.

You must create a separate recurrence schedule for each task, but Scheduled
Maintenance automatically copies many of the details from the change request. The
following table lists the fields that migrate to the maintenance task.


Incidents                               Changes         Requests
category*                               description     description
brief.description                       category        category
assignment                              logical.name**  requestor.name
logical.name**                          coordinator     assigned.to
ticket.owner                            work.manager    coordinator
priority.code                           assigned.to     priority
problem.status                          priority        action

* Override if the device has a default Incident Management category.
** Override with the device name of the selected item in the Configuration
Management application when you choose this option.

Contents

     1 Generating tasks from an existing record
````
