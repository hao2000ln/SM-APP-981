---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.10 .. 1.10.12
printed_pages: 2684-2709
---

# 1.10 Scheduled Maintenance

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.10. Scheduled Maintenance

Scheduled Maintenance enables you to create a scheduled maintenance system to
reduce unplanned outages and system failures. The objective is to service systems
before they fail rather than after they fail.

Scheduled Maintenance helps you administer, configure, and customize scheduled
maintenance. It installs without requiring an upgrade, and runs independent of
Service Manager upgrades. It integrates into a pre-existing Service Manager
installation without changing any tailoring and customization.

You should have an understanding of the Service Manager expression syntax and
Database Manager to administer Scheduled Maintenance successfully.

A user can do the following tasks:

     Establish a formalized Scheduled Maintenance system to reduce unplanned
     outages and system failures by servicing systems before they fail
     Define and schedule recurring maintenance tasks, including Incident records,
     change requests, and Request Fulfillment requests, using closed loop integration
     with Service Manager
     Store all Scheduled Maintenance tasks in a single repository, ensuring that
     important maintenance occurs regularly
     Automatically notify staff of all maintenance items as they become due
     Enable users to create and update Scheduled Maintenance tasks even when
     they are unfamiliar with Service Manager
     Create audit information
     Create sophisticated or detailed maintenance tasks
     Conform to existing Service Manager tailoring

Related topics

Administrative access to Scheduled Maintenance
Scheduled Maintenance features


1.10.1. What's a scheduled task?

Scheduled Maintenance supports different types of scheduling. Select the one that
best suits the task. Scheduled tasks run according to a defined schedule with no
dependencies. For example, you can schedule a task to run every Tuesday at 4:00
a.m., or on the first Monday in January. Demand-based tasks run when the task relies
on changes in the Configuration Management application. This can be defined by a
trigger. For example, you can schedule a task to run whenever:

     The available drive space on the file server drops below 10 GB.
     The printer prints 8,000 pages.
     The available disk space on a server drops below 2 GB, require a log dump
     The number of devices attached to a particular router approaches the number of
     ports it has available.

Scheduled task delays

There may be a delay between the time you select a task to run and the time that it
runs. Scheduled Maintenance checks for tasks to execute every minute. If it checked
at 11:59:30 and 12:00:30, then the incident record, change request, or Request
Fulfillment request would be opened at 12:00:30, not at 12:00:00.

There can be a few seconds delay as Scheduled Maintenance generates and saves
the incident record, change request, or Request Fulfillment request. You can change
the frequency of the Scheduled Maintenance Hook to balance the load.

If your server is disabled at the time a task is scheduled to run, the task executes at
the next scheduled time after the server resumes operation.

Related topics

Scheduled Maintenance
Running a Scheduled Maintenance task
Cost Estimate tool


1.10.2. Running a Scheduled Maintenance
task

When a Scheduled Maintenance task runs, Scheduled Maintenance generates an
incident record, change request, or Request Fulfillment request as though a
technician at your service desk created it. Scheduled Maintenance tracks the
execution of the incident record, change request, or Request Fulfillment request to
store a complete service history for each task.

Verifying a task

After you save a task, you can verify the task (or tasks) that Scheduled Maintenance
created using one of these techniques.

     Force a task to execute immediately
     Check the execution history
     Check the execution details of a task

Defining the effect and details of a Scheduled
Maintenance task

Scheduled Maintenance enables you to create several types of tasks. When you
create a task, Scheduled Maintenance respects all normal default values, sends
messages, adheres to Format Control rules, executes macros, and runs the usual
validations. If an automatically generated Incident record, change request, or Request
Fulfillment request doesn't match the validation rules, Scheduled Maintenance tries to
ignore the validation rules and save the record anyway.

Scheduled Maintenance also enables you to open a collection of Incident records,
change requests, or Request Fulfillment requests for every Configuration Item (CI) in
Configuration Management that meets certain predefined criteria, or matches a
specific user-defined query. Using one of these methods, you can create a
maintenance task for any arbitrary subset of Configuration Items.

Incident records for scheduled maintenance tasks

Incident records can specify any of the following.

     Assignment group
     Category
     Expression


     Format control
     Incident description
     Incident title
     Maintained device
     Owner
     Priority code
     Status

Change requests for scheduled maintenance tasks

Change requests can specify any of the following.

     Expressions
     Format control
     Maintained device
     Assignee
     Category
     Coordinator
     Description
     Priority
     Work manager

Request Fulfillment requests for scheduled
maintenance tasks

Request Fulfillment requests can specify any of the following.

     Title
     Description
     Category
     Subcategory
     Request Model
     Requester
     Assignee
     Priority
     Coordinator
     Expressions
     Format control

The Scheduled Maintenance Advanced Query option has a built in anti-spam feature.
By default, the system generates 50 records, regardless of how many records the


advanced query returns. This threshold is user definable under the Administrative
Options section of the Scheduled Maintenance Menu.

Regular scheduling

Use this option to select a simple repeat interval or to make a task run at a certain
time of day. For example, starting at 11/30/01 00:00:00 execute this task every hour
on the hour.

To run a task run at the same time every day, set the start time and then a set a repeat
interval of 24 hours. Specify a 24-hour interval with 1 00:00:00, not 24:00:00.

Repeat criteria

Demand based maintenance supports three different types of repeat criteria in an
effort to model real-world maintenance activity as effectively as possible:

     Incremental repetition
     Quiescent repetition
     Manual repetition

Repeat criteria limitations

Many fields within Configuration Management that contain numeric values are
character fields. This enables you to store unit values with the numeric data. A typical
value can be 1,024 MB or 2,000 lbs. Scheduled maintenance can perform
comparative operations on these fields by removing non-numeric characters and
treating the result as a number. Thus 1,024 MB becomes 1024 when Service Manager
compares it to a threshold value.

Scheduled Maintenance doesn't consider the source of a change when it monitors
the requested field on a device. Scheduled Maintenance reacts to any change from
an interactive user, a background task, or a remote agent.

It is possible to have multiple demand maintenance tasks linked to the same device. If
a single update can trigger more than one demand task, then each task runs
independently. You can potentially create two or more maintenance tasks as a result
of a single change to a device.

Scheduled Maintenance reacts to changes in the device record, not changes in the
maintenance task. If you create or modify a maintenance task that depends on the
current state of a monitored record, the task doesn't run until there is a change to the
monitored device.


Task execution results

There are four potential results when you view the execution history of a task.

Error code                              Meaning
Success
Reject                                  Executed Successfully. Scheduled
                                        Maintenance generated an incident
Error                                   record, change request, or Request
Error                                   Fulfillment request. No errors occurred.
                                        This is the result you want to see.

                                        The incident record or change request
                                        was rejected by Format Control.
                                        Scheduled Maintenance populates
                                        fields in a record as a user would. If a
                                        field is required when a user creates an
                                        Incident record, change request, or
                                        Request Fulfillment request, it is also
                                        required when Scheduled Maintenance
                                        creates the same incident record,
                                        change request, or Request Fulfillment
                                        request. If the required information is
                                        unavailable by default, you can use
                                        expressions to populate it.

                                        Encountered an Error while executing
                                        task expressions. Although you
                                        completed the Expressions field on the
                                        Details tab of the task, one or more of
                                        the expressions did not execute
                                        properly. Identify and fix the error.

                                        Encountered an unknown error. An
                                        unhandled error occurred inside the
                                        Service Manager code, not Scheduled
                                        Maintenance Code. This is a very rare
                                        event.

Related topics


Scheduled Maintenance
What's a scheduled task?
Cost Estimate tool


1.10.3. Cost Estimate tool

The Cost Estimate tool enables you to select a subset of your maintenance tasks, and
then calculate the estimated cost to run those tasks within a specified time frame,
such as from 01/01/04 until 03/31/04.

Using the tool is a two-step process. First, you select a set of task records from within
scheduled maintenance. Second, invoke the tool and provide it the criteria it requires.

Cost Estimate tool limitations

The tool estimates the number of times a task runs by using a mathematical function.
These functions are fast and highly accurate. However, rounding errors or can cause
the estimate to be one more or one less than the actual number of runs.

The tool makes no provision for tasks that expire halfway through the listed time
frame. It assumes that all listed tasks continue throughout the time series.

If the tool uses a different currency conversion, it uses the current exchange rate or
the most recent exchange rate it has on file. Actual exchange rates fluctuate, and may
result in tasks later in the time frame performing under an actual exchange rate that's
different from the rate used in the estimation process.

The cost estimates are only as good as the parts and labor information provided.
Inaccurate or incomplete part and labor descriptions for maintenance tasks result in
inaccurate or incomplete cost estimates.

Related topics

Scheduled Maintenance
Running a Scheduled Maintenance task
What's a scheduled task?


1.10.4. Access Scheduled Maintenance

Applies to User roles: System Administrator

To access Scheduled Maintenance, click System Administration > Base System
Configuration > Scheduled Maintenance and then Select an activity.

     Administrative Options to select options for the template, or to generate
     Scheduled Maintenance tasks from Incident records, change requests, or
     Request Fulfillment requests.
     Automation Rules to select options for automatically running the predefined
     rules.
     Execution Details to display the results of a Scheduled Maintenance task’s
     execution. The result may generate an Incident record, Change Management
     request, or Request Fulfillment request that you can open and view.
     Execution History to display a schedule when Scheduled Maintenance task
     executes.
     Scheduled Maintenance Tasks to create and edit Scheduled Maintenance
     tasks.

Related topics

     Scheduled Maintenance
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
     Use the Cost Estimate tool



1.10.5. Check the execution details of a
task

Applies to User roles: System Administrator
To check the execution details of a task:

   1. Click System Administration > Base System Configuration > Scheduled
     Maintenance > Execution Details.

   2. Type or select the search criteria. You can search by one of the following.

    Field name                          Description
    ID
                                        A unique identifier that Scheduled
    Class                               Maintenance gives to every task it
    Number                              creates.

    Opened at                           One of three values: incident,
    Closed at                           change, or request.
    Task ID
                                        The incident number, change
    Logical Name                        number, or Request Fulfillment
                                        request number of the created task.
3. Click Find to locate the record.
                                        The time the task opened.

                                        The time the task closed.

                                        The Service Manager ID of an
                                        Incident record, change request or
                                        Request Fulfillment request.

                                        The Service Manager asset against
                                        which scheduled maintenance runs.
                                        For example, all maintenance history
                                        for the email server.


   4. If you don't have search criteria, insert the cursor in the field and click Search to
     locate the record, or use the drop-down calendar to specify a date.

If you have the task open in Scheduled Maintenance, you can click the History tab >
Execution Details.

Related topics

Scheduled Maintenance
Access Scheduled Maintenance
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
Use the Cost Estimate tool


1.10.6. Check the execution history of a
task

Applies to User roles: System Administrator

To check the execution history of a task:

   1. Click System Administration > Base System Configuration > Scheduled
     Maintenance > Execution History.

   2. Type the search criteria. You can search by Task ID, Event Date, Result, and
     Creation Count.
     Specify a value for one or more parameters.

   3. Click Search to locate the record.

   4. If you don't have search criteria, insert the cursor in the field and click Search to
     locate the record, or use the drop-down calendar to specify a date.

If you have the task open in Scheduled Maintenance, select the History tab and then
click Execution History.

Related topics

     Scheduled Maintenance
     Access Scheduled Maintenance
     Check the execution details of a task
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


Use the Cost Estimate tool


1.10.7. Create a change request from a
Scheduled Maintenance task

Applies to User roles: System Administrator

To create a change request from a Scheduled Maintenance task:

   1. Click System Administration > Base System Configuration > Scheduled
     Maintenance > Scheduled Maintenance Tasks.
     Service Manager displays a blank Scheduled Maintenance form.

   2. Specify the required information on the Description and Schedule tabs
   3. Click the Effect tab.
   4. Specify the type of task you would like to create by selecting a task effect.

           If you select the fourth, fifth, or sixth option (one ending with for each
           Device of Class X at location Y you will also need to:

                 Select the asset type in the Open for this Device Type field.
                 Select the location in the At Location field.
                 You can specify the selection of assets to be maintained. Click Use
                 Advanced Query. Service Manager replaces the location and asset
                 based selection boxes with All Devices Matching This Query.
                 Type the query in the All Devices Matching This Query field.
                 Scheduled Maintenance requires that you specify a query in All
                 Devices Matching This Query if you select Use Advanced Query. It
                 doesn't validate this value. It is recommended that you test all queries
                 using Asset Management to ensure that the query returns the correct
                 records in a production environment.

     Note: Unless you change Max Generation Count, Service Manager generates a
     maximum of 50 records.

   5. Click the Details tab and complete the following fields:
           Open Change of Category
           Coordinator
           Work Manager
           Set Priority to
           Assign to
           With a Company of

   6. If you are creating one change request, select the asset using the appropriate
     drop-down list. If you are creating a group of change requests, Work on This
     Device is unavailable. Instead, Scheduled Maintenance automatically sets a


     value as it works its way though your Configuration Items (CIs) to create a
     change request for each relevant asset.
   7. Type optional Expressions for the record.
   8. Choose a Format Control record for the record.
   9. Click the Parts & Labor tab. When Service Desk generates the change request, it
     automatically copies any parts and labor estimates that you specify here. Cost
     estimating tools also use this information.

Related topics

Scheduled Maintenance
Access Scheduled Maintenance
Check the execution details of a task
Check the execution history of a task
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
Use the Cost Estimate tool


1.10.8. Create a Request record from a
Scheduled Maintenance task

Applies to User roles: System Administrator

To create a Request Fulfillment request from a Scheduled Maintenance task:

   1. Click System Administration > Base System Configuration > Scheduled
     Maintenance > Scheduled Maintenance Tasks.
     Service Manager displays a blank Scheduled Maintenance form.

   2. Specify the required information on the Description and Schedule tabs
   3. Click the Effect tab.
   4. Specify the type of task you would like to create by selecting one of the

     following choices.

           Create One RM Request

           Create One RM Request for each Device of Class X at location Y

   5. If you selected Create One RM Request for each Device of Class X at location Y,
     do the following
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

   6. Click the Details tab to display a list of fields for the Request Fulfillment request.
   7. Complete the following fields.

           Open RM Request of Category

           Open RM Request of Subcategory


           Open RM Request of Request Model

           Requestor Name
           Assign to
           Set Priority to
           Coordinator
           With a Company of
   8. Type optional Expressions for the request.
   9. Choose a Format Control record for the request.

Related topics

Scheduled Maintenance
Access Scheduled Maintenance
Check the execution details of a task
Check the execution history of a task
Create a change request from a Scheduled Maintenance task
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
Use the Cost Estimate tool


1.10.9. Create a schedule for a task

Applies to User roles: System Administrator

To create a schedule for a task:

   1. Create a new Scheduled Maintenance task or locate an existing task.
   2. Click the Schedule tab.
   3. From Execute Task at:, select the date and time, then choose the correct time

     zone. If you omit the time zone, the default value is your current time zone.
   4. Choose a repeat interval in the Repeat Task frame.

           Regularly schedules a simple repeat interval
           Weekly schedules a weekly interval
           Monthly by date
           Monthly by day
           Annually
           Annually
           An Arbitrary Schedule (user defined)
     The available settings change depending on the interval you select.
   5. Select one of the following duration options in the Range of Recurrence frame.
           No end date for a task that should recur forever.
           End After nn Occurrences where nn is a numeric value.
           End By date where you select an end date from the calendar

Related topics

Scheduled Maintenance
Access Scheduled Maintenance
Check the execution details of a task
Check the execution history of a task
Create a change request from a Scheduled Maintenance task
Create a Request Fulfillment request from a Scheduled Maintenance task
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
Use the Cost Estimate tool


1.10.10. Create a Scheduled Maintenance
task

Applies to User roles: System Administrator

To create a Scheduled Maintenance task:

   1. Click System Administration > Base System Configuration > Scheduled
     Maintenance > Scheduled Maintenance Tasks. Service Manager displays a
     blank Scheduled Maintenance Tasks form.

   2. Type a name for the task in the Name field. The name you select can offer some
     insight into what the task does and you may use any naming convention, as long
     as each task name is unique.

   3. Select Active? to activate the task. Every task must be active or inactive.
     Inactive tasks are in the system, but don't create any work orders or take any
     other action.

   4. Select Demand Based? when the task relies on changes in the Configuration
     Management application. For example, you can schedule a task to run whenever
     the available drive space on the file server drops below 10 Gigabytes (GB), or
     every time the printer prints 8,000 pages. If the task is not demand based, don't
     check this box.

   5. Click the Description tab. Type a description for the task in the text box. A
     description is optional, but it can be useful to document the task.

   6. Click the Schedule tab to create a schedule for the task.
   7. Click the Effect tab to create one or more Incident records, change requests, or

     Request Fulfillment requests.
   8. Click the Details tab to add expressions to the task.
   9. Click the History tab to view the history of the task.
 10. Click Add.

If this is a scheduled task, Scheduled Maintenance calculates the next time this task
should run and displays it in the Next Scheduled at field. The task runs according to
this schedule; you may want to run the task immediately to verify that it works
properly. If this is a demand based task, it runs as soon as an update causes it to
meet the trigger criteria.

You can also create a Scheduled Maintenance task from:

     A record in Incident Management, Change Management, or Request
     Management.
     A CI in Configuration Management.


Related topics

Scheduled Maintenance
Access Scheduled Maintenance
Check the execution details of a task
Check the execution history of a task
Create a change request from a Scheduled Maintenance task
Create a Request Fulfillment request from a Scheduled Maintenance task
Create a schedule for a task
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
Use the Cost Estimate tool


1.10.11. Create a Scheduled Maintenance
task for an asset

Applies to User roles: System Administrator, Configuration Manager, Configuration
Administrator

To create a Scheduled Maintenance task for an asset:

   1. Click Configuration Management > Resources > Search CIs. Service Manager
     displays a blank Configuration Item record.

   2. To generate a record list of CIs, click Search.
   3. Click a CI to select it.
   4. Open the More Actions menu.
   5. Click Scheduled Maintenance > Generate Recurring > Incidents, Changes, or

     Requests.

Service Manager displays a new Scheduled Maintenance task and imports data from
the CI record and the template record.

Related topics

Scheduled Maintenance
More Actions menu
Access Scheduled Maintenance
Check the execution details of a task
Check the execution history of a task
Create a change request from a Scheduled Maintenance task
Create a Request Fulfillment request from a Scheduled Maintenance task
Create a schedule for a task
Create a Scheduled Maintenance task
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
Use the Cost Estimate tool



1.10.12. Create a Scheduled Maintenance
task from an open record

Applies to User roles: System Administrator

To create a Scheduled Maintenance task from an open record:

   1. Open a new record, or locate an existing record, in Incident Management,
     Change Management, or Request Management.

   2. Open the More Actions menu and choose Generate Maintenance.

Service Manager displays a new Scheduled Maintenance record with some data
automatically filled in from the original record and from the template record.

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
Create an Incident record from a Scheduled Maintenance task
Define the effect and details of a Scheduled Maintenance task
Force a task to run immediately
Schedule intervals
Set the demand criteria for a task
Specify incremental repetition
Specify manual repetition
Specify quiescent repetition
Use expressions and Format Control only in a Scheduled Maintenance task
Use the Cost Estimate tool
````
