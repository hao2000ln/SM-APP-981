---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.10.26 .. 1.10.31
printed_pages: 2732-2748
---

# 1.10.26 Scheduled Maintenance commands in Configuration Management

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.10.26. Scheduled Maintenance
commands in Configuration Management

Service Manager integrates Scheduled Maintenance with Configuration Management.
You can find these commands on the More Actions menu that you access from an
asset record.

Command                                                                                         Service Manager 9.81
Maintenance Tasks
                                        Description
Maintenance History
                                        Show any maintenance tasks that are
                                        bound to a specified device. Scheduled
                                        Maintenance doesn't display any task
                                        that references a range of devices,
                                        such as routine maintenance for every
                                        server in a geographic area.

                                        List how many incidents, changes, or
                                        requests generated when a
                                        maintenance task runs. From this list,
                                        you can view the individual incident
                                        records, change requests and Request
                                        Fulfillment requests in detail.
                                        Maintenance tasks that create one
                                        incident, change, or request are a
                                        single entry. Maintenance tasks that
                                        create a collection of incidents,
                                        changes, or requests for every
                                        Configuration Item (CI) matching
                                        certain parameters can generate
                                        different information each time the task
                                        runs.

                                        For example, on May 1, there might be
                                        two servers in a geographic area, but
                                        by June 1, there might be a third server
                                        installed. Therefore, a task that
                                        generates a change for every server in
                                        a geographic area would generate two
                                        changes in May and three changes in
                                        June.


Command                                 Description

Generate Recurring >Incidents           Generate a Scheduled Maintenance
                                        task for the current device, which
                                        creates an Incident record. This
                                        Scheduled Maintenance task uses a
                                        template Incident record and other
                                        information from Configuration
                                        Management.

Generate Recurring >Changes             Generate a Scheduled Maintenance
                                        task for the current device, which
                                        creates a change request. This
                                        Scheduled Maintenance task uses a
                                        template change request and other
                                        information from Configuration
                                        Management.

Generate Recurring >Requests            Generate a Scheduled Maintenance
                                        task for the current device, which
                                        creates a Request Fulfillment request.
                                        This Scheduled Maintenance task uses
                                        a template Request Fulfillment request
                                        and other information from
                                        Configuration Management.

Record limitations

The Scheduled Maintenance Advanced Query has a built in anti-spam feature. By
default, Scheduled Maintenance can generate a maximum of 50 records, regardless
of how many records the advanced query returns. This is to prevent accidentally
creating a Scheduled Maintenance task that would open a record for every
Configuration Item (CI) listed in your Configuration Management database. However,
if you want to generate a larger number of records, you can increase that number.

Access Scheduled Maintenance from Configuration
Management

Applies to User roles: System Administrator, Configuration Manager, Configuration
Administrator


To access Scheduled Maintenance from Configuration Management:

   1. Click Configuration Management > Resources > Search CIs (or Configuration
     Management > Search CIs if you don't have the Resources folder in your
     System Navigator).

   2. Click Search to generate a record list.
   3. Click a record to display it in the Manage CI Types information form
   4. Open the More Actions menu.
   5. Click Scheduled Maintenance.
   6. Click one of the following:

           Maintenance Tasks
           Maintenance History
           Generate Recurring > Incidents, Changes, or Requests

Access Scheduled Maintenance from Configuration
Management

Applies to User roles: System Administrator, Configuration Manager, Configuration
Administrator

To access Scheduled Maintenance from Configuration Management:

   1. Click Configuration Management > Resources > Search CIs (or Configuration
     Management > Search CIs if you don't have the Resources folder in your
     System Navigator).

   2. Click Search to generate a record list.
   3. Click a record to display it in the Manage CI Types information form
   4. Open the More Actions menu.
   5. Click Scheduled Maintenance.
   6. Click one of the following:

           Maintenance Tasks
           Maintenance History
           Generate Recurring > Incidents, Changes, or Requests

Change the maximum number of records to be
generated by Scheduled Maintenance

   1. Click System Administration > Base System Configuration > Scheduled
     Maintenance > Administrative Options.

   2. The Scheduled Maintenance Administrative Options form appears. Change the
     Max Generation Count field to a new value.

   3. Click OK.


   4. Click System Administration > Base System Configuration > Scheduled
     Maintenance.

   5. Click Search.
   6. Click the selected task to view it in the Scheduled Maintenance Tasks form.
   7. If there are any Scheduled Maintenance tasks running, stop and restart them

     using the System Scheduler. This ensures that these tasks use the new Max
     Generation Count value.

Contents

     1 Record limitations
     2 Access Scheduled Maintenance from Configuration Management
     3 Access Scheduled Maintenance from Configuration Management
     4 Change the maximum number of records to be generated by Scheduled
     Maintenance


1.10.27. Scheduled Maintenance exception
models

Scheduled Maintenance includes a system of exception models that enables an
administrator to schedule tasks around weekends or holidays. You can choose one of
these models:

Model                                   Restrictions
No Exceptions model
                                        Scheduled Maintenance tasks run
Only Calendars model                    whenever they are scheduled,
Except Calendars model                  regardless of weekends or holidays.
                                        After the task runs, it immediately
                                        reschedules for the next occurrence.
                                        For example, the task runs every hour
                                        on the half hour at 8:30 AM, 9:30,
                                        10:30, ... 5:30 PM and so on.

                                        Scheduled Maintenance tasks run only
                                        if the assigned time occurs within a
                                        specific calendar. For example, a task
                                        scheduled to run only during the day
                                        shift (9:00AM - 5:00PM) can run at
                                        2:00 PM, but not at 7:00 PM.

                                        Scheduled Maintenance tasks run
                                        according to schedule unless the
                                        designated time falls within a specific
                                        calendar. For example, a task
                                        scheduled to run at any time, except
                                        during the day shift, can't run between
                                        9:00AM and 5:00PM, but can run at all
                                        other times.

Exceptions do not stop a task from recalculating normally, but if its scheduled time
falls within an exception window, the task doesn't run. Scheduled Maintenance


displays a message in the task history log to indicate that the task triggered, but did
not run because it occurred during an exception window.

Notes:

     Exceptions apply only to calendar-based tasks. They do not apply to demand-
     based maintenance tasks.
     Exceptions apply to any type of scheduled task. Tasks with weekly, monthly, or
     yearly schedules can use exception calendars. As a practical matter, they're
     probably most useful for tasks with simple recurrence schedules, but the system
     will support their use with any schedule you set up.
     All tasks default to the No Exceptions model.
     Tasks which expire and attempt to run during an exception window do not
     "push" to the next available acceptable execution time. They simply do nothing
     and reschedule.

Examples: Scheduled Maintenance exception
models

Assume that you have a Day Shift calendar that specifies 9AM – 5PM, Monday –
Friday. Saturday and Sunday aren't included in the calendar. There is a scheduled
task that runs every hour beginning at 8:30 AM.


Model                                   Result

No Exceptions model                     The task runs every hour on the half-
                                        hour 8:30 AM, 9:30, 10:30, ... 5:30 PM
                                        and so on.

Only Calendars model                    The task runs only during the Day Shift.
                                        The task runs every hour on the half-
                                        hour 8:30 AM, 9:30, 10:30, … 4:30 PM.
                                        The task triggers again at 5:30 PM, but
                                        doesn't run because it can't run
                                        outside of the defined calendar hours.

Except Calendars model                  The task run at any time except during
                                        the Day Shift. The task triggers at
                                        8:30 AM, 9:30, 10:30, … 4:30 PM, but it
                                        doesn't run until the Day Shift ends.
                                        When the task triggers at 5:30 PM, it
                                        runs normally.

Contents

     1 Examples: Scheduled Maintenance exception models


1.10.28. Using a Scheduled Maintenance
template

Scheduled Maintenance follows a series of steps when it applies a default template to
a new maintenance task.

     A user selects Generate Recurring Incidents, Changes, or Requests from the
     More Actions menu in Incident Management, Change Management, or Request
     Management.
     Scheduled Maintenance uses the default incident template specified in the
     Scheduled Maintenance Administration form.
     Scheduled Maintenance creates a Scheduled Maintenance task. When the task
     runs, it creates a new Incident record that looks like the template record.
     A user can subsequently modify the record.

The new record doesn't copy the template exactly. The default template record may
reference another piece of hardware. Scheduled Maintenance overrides the template
record category with the default Incident Management category for the Configuration
Item (CI) as it appears in the Configuration Management record. It also replaces the
device ID with the correct device ID.

Specify Scheduled Maintenance template records

Applies to User roles: System Administrator

To specify Scheduled Maintenance template records:

   1. Click System Administration > Base System Configuration > Scheduled
     Maintenance > Administrative Options.

   2. The Scheduled Maintenance Administrative Options form appears with a list of
     default templates. A template is an existing record that can be reused with
     different data. Replace any default template name with a different record name.

   3. Click Save.
   4. Click OK.

Contents

     1 Specify Scheduled Maintenance template records


1.10.29. Adding Scheduled Maintenance
data using expressions

You can use expression syntax to auto-fill fields in the Incident record, change
request, or Request Fulfillment request generated by a Scheduled Maintenance task.

Expressions run to populate data fields after Scheduled Maintenance supply simple
information in the Incident record, change request, or Request Fulfillment request.
You can use expressions to override the category, assignee, or another field.

Add data using expression syntax

Applies to User roles: System Administrator

To add data using expression syntax:

   1. Click System Administration > Base System Configuration > Scheduled
     Maintenance > Scheduled Maintenance Tasks..
     Service Manager displays a blank Scheduled Maintenance form.

   2. Click Search.
   3. Click the selected task to view it in the Scheduled Maintenance Tasks form.
   4. Click the Details tab.

   5. In the text box labeled Use These Expressions to Fill the Task....., type
     expressions that set selected fields to new values. The Incident record, change
     request, or Request Fulfillment request are referred to as $L.file in these
     expressions. For example, to set the subcategory and priority code on incident
     records, add these two lines of expression code:

          subcategory in $L.file="application"
          priority.code in $L.file="4"

     where application is the name of the subcategory and 4 is the priority code.
   6. Click Save.

Contents

     1 Add data using expression syntax



1.10.30. Scheduled Maintenance overhead

Scheduled Maintenance relies on the problem background scheduler to call into the
Scheduled Maintenance code at regularly scheduled intervals. If the problem
scheduler is not running, no Scheduled Maintenance tasks run. When a Scheduled
Maintenance task runs, it increases the load on the problem scheduler by a marginal
amount.

Scheduled Maintenance doesn't put a large load on your system unless you are using
the Scheduled Maintenance system to generate extraordinarily large numbers of
incident records, change requests, or Request Fulfillment requests. If Scheduled
Maintenance creates twenty tasks a day, the impact is approximately identical to one
user opening twenty tasks a day.

If a Scheduled Maintenance task creates 20,000 Incident records at 2:00 AM, the task
would slow the Service Manager system down somewhat. Scheduled Maintenance
creates all 20,000 records consecutively, as though one user were opening 20,000
incident records consecutively. The increased load may be noticeable, but it will not
be crippling.

Load balancing

You should not notice any change in your system load when you use Scheduled
Maintenance. However, if you have an unusually large number of tasks opening every
day, such as 1000 each day, or over 100 in a 10-minute period, consider creating a
private scheduler that runs only Scheduled Maintenance tasks. When you create and
run this scheduler, change the class on the Scheduled Maintenance Hook record to
match your new scheduler. You can also change the repeat interval on the inhook
schedule record.

Access the Scheduled Maintenance Hook record

Applies to User Roles: System Administrator

To access the Scheduled Maintenance Hook record:

   1. Click Tailoring > Database Manager.
   2. Type schedule.looksee in the Form field.
   3. Type schedule in the Table field.
   4. Click the large Search icon.
   5. Click Search.


   6. Click the Scheduled Maintenance Hook record to view it in the Schedule File
     form.

Note: The minimum effective repeat interval is one minute. This interval causes the
server to check for tasks every minute. With adjustment, you can reduce this to about
10 seconds. You can't reduce the interval to less than 10 seconds because of the
internal structure of the Service Manager scheduling system.

Contents

     1 Load balancing
     2 Access the Scheduled Maintenance Hook record


1.10.31. Running an extra Format Control
record

Scheduled Maintenance includes a hook to enable you to run a particular Format
Control record before it transfers control to the Service Manager application code.
The Format Control record associated with an Incident record, change request, or
Request Fulfillment request always runs. However, you can add an additional Format
Control record. If the Format Control field on the Details tab of the Scheduled
Maintenance Tasks form is blank, only the normal Format Control runs. If you specify
a Format Control record on the Details tab, all normal Format Control runs after the
named Format Control runs.
Adding a Format Control record enables you to manage Format Control, calculations,
validations, or calls to subroutines before the normal Format Control record passes
into the regular Service Manager incident, change or request processing.

            Note

           Task expressions can accomplish many of the same calculation tasks.

Specify an extra Format Control record

Applies to User roles: System Administrator

To specify an extra Format Control record:

   1. Click System Administration > Base System Configuration > Scheduled
     Maintenance > Scheduled Maintenance Tasks.

   2. Click Search.
   3. Click the selected task to view it in the Scheduled Maintenance Tasks form.
   4. Click the Details tab.
   5. Click Fill on the text box labeled Call out to this format control record.
   6. Choose a format control from the Related Records list.
   7. Click Save.


The Add processes on this extra Format Control record will execute after the
expressions are parsed, but before the regular incident record, change request, or
Request Fulfillment request code.

Contents

     1 Specify an extra Format Control record


1.10.31.1. Specify an extra Format Control
record

Applies to User roles: System Administrator

To specify an extra Format Control record:

   1. Click System Administration > Base System Configuration > Scheduled
     Maintenance > Scheduled Maintenance Tasks.

   2. Click Search.
   3. Click the selected task to view it in the Scheduled Maintenance Tasks form.
   4. Click the Details tab.
   5. Click Fill on the text box labeled Call out to this format control record.
   6. Choose a format control from the Related Records list.
   7. Click Save.

The Add processes on this extra Format Control record will execute after the
expressions are parsed, but before the regular incident record, change request, or
Request Fulfillment request code.

Related topics

Running an extra Format Control record
````
