---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.6.4.11 .. 1.6.5
printed_pages: 1748-1773
---

# 1.6.4.11 Folder entitlement

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.6.4.11. Folder entitlement

Folder entitlement isolates company information in folders, ensuring that the right
users have the right access to sensitive company data. For example, a company that
manages more than one organization could create separate security folders for each
organization. Users in organization A could be granted access to Folder A and users
in organization B could be granted access to Folder B. The information in an
organization is tied to a security folder when users open records, such as incident
records. Therefore, users in organization A could not access incidents, changes, or
requests made by organization B, and vice versa. When folder entitlement is enabled,
a new field appears when users open records. This field allows users to select the
security folder, allowing them to tie the information in the record to that security
folder. Users outside the organization who have not been granted permission to
access the data in the folder can't see the record. When users outside the
organization search incidents, changes, or requests, the records aren't found.

In Service Manager, a System Administrator enables or disables folder entitlement.
For more information on enabling and disabling folder entitlement, see the related
topics.

The available out-of-box company security folders on the Folder Entitlement tab are
DEFAULT and advantage. However, the System Administrator can add folders to meet
your business needs.

For each security folder added, a System Administrator must grant permissions to a
specific application security profile, thereby granting permissions to all operators
associated with that profile. Permission settings are selected for operators based on
roles that reflect their responsibilities. When defining roles, each role displays a top
level view for all folders. You can then click on each folder and set rights on individual
fields for a folder, or modify workgroups. If a user doesn't have specific rights defined
for a folder, the default rights from the user profile are assigned.

The System Administrator can set the default folder for an individual operator. This
setting allows the records opened by the operator to be automatically associated with
the default security folder selected.

Related topics

Disable folder entitlement
Enable folder entitlement
Delete a folder
Specify use of the default folder from the operator record



1.6.4.11.1. Enable folder entitlement

Applies to User Roles: System Administrator

To enable folder entitlement, follow these steps:

   1. Click System Administration > Base System Configuration > Miscellaneous >
     System Information Record.

   2. Click the General tab.
   3. Select the Enable Folder Entitlement checkbox.
   4. Click Save.
   5. Click OK.

   6. Log out of Service Manager and log back in.

     Folder Entitlement is now enabled.

Related topics

Folder entitlement
Disable folder entitlement
Add a security folder
Delete a folder


1.6.4.11.2. Disable folder entitlement

Applies to User Roles: System Administrator

To disable folder entitlement, follow these steps:

   1. Click System Administration > Base System Configuration > Miscellaneous >
     System Information Record.

   2. Click the General tab.
   3. Deselect the Enable Folder Entitlement checkbox.
   4. Click Save.
   5. Click OK.

   6. Log out of Service Manager and log back in.

     Folder entitlement has been disabled. There are no longer any security folders
     assigned to operators.

Related topics

Folder entitlement
Enable folder entitlement
Add a security folder
Delete a folder


1.6.4.11.3. Add a folder

Applies to User roles: System Administrator
To add a security folder, follow these steps:

   1. From the System Navigator, click System Administration > Ongoing
     Maintenance > Security Folders.
     The Folder Definition form opens.

   2. Type the name of the new folder in the Folder Name field.
   3. Type the Description of the security folder.
   4. Click Add.
   5. Click OK.

To use an existing security folder to add a new folder:

   1. From the System Navigator, click System Administration > Ongoing
     Maintenance > Security Folders.
     The Folder Definition form opens.

   2. Add optional search criteria, and then click Search.
   3. Select a folder from the list that most closely matches the new folder you want

     to add.
   4. Type the new name of the folder in the Folder Name field.
   5. Add or change the Description for this new security folder.
   6. Click Add.

                   Caution

                Make sure that you don't click Save because doing so will replace
                the existing folder with the new security folder you are attempting to
                add.

   7. Click OK.

Related topics

Folder entitlement
Delete a folder


Enable folder entitlement
Disable folder entitlement


1.6.4.11.4. Delete a folder

Applies to User Roles: System Administrator

To delete a folder, follow these steps:

   1. From the System Navigator, click System Administration > Ongoing
     Maintenance > Security Folders.

   2. Type the folder name, or click Search to select the folder name from a record
     list.

   3. Select the folder and click Delete.
   4. Click OK.

            Note

           You can't delete a folder that's currently in use. An error message
           displays if you attempt to delete a folder that's in use.

Related topics

Folder entitlement
Add a security folder
Enable folder entitlement
Disable folder entitlement


1.6.4.11.5. Specify use of the default folder
from the operator record

Applies to User Roles: System Administrator

The System Administrator can set the default folder for an individual operator. This
setting allows the records opened by the operator to be automatically associated with
the default folder set in the operator record.

To specify use of the default folder from the operator record, follow these steps:

   1. From the System Navigator, click System Administration > Ongoing
     Maintenance > Operators.

     The Operator search form opens.

   2. Type optional search criteria, and then click Search.
   3. Select the operator record to be edited.
   4. In the General tab, select the Folder Entitlement tab.
   5. In the Default Folder field, select a security folder as the default folder for this

     operator.
   6. Click Save.
   7. Click OK.

   8. Log out of Service Manager, and then log back in.

     The default folder selected will automatically be used the next time the operator
     opens a new record.

Related topics

Folder entitlement
Application profiles
Add a security folder
Delete a folder
Enable folder entitlement
Disable folder entitlement


1.6.4.11.6. Add folder permissions to a
security role

User Role: System Administrator

To add folder permissions to a security role:

   1. Click System Administration > Security > Roles.
   2. Click Search to select a security role from the record list.
   3. Click the security role to which you want to add folder permissions.
   4. Select a security area from the table in the security role details pane.
   5. In the Folder Rights section, click Add new folder to open the Add New Folder

     Rights wizard.
   6. Select a folder from the drop-down list, and then click Next.
   7. Specify the rights for the role in this folder, and then click Finish.

Related topics

Process Designer security model
Processes and Best Practices
Add security roles and settings


1.6.4.11.7. Modify the folder permissions
of a security role

User Role: System Administrator

To modify the folder permissions of a security role:

   1. Click System Administration > Security > Roles.
   2. Click Search to select a security role from the record list.
   3. Click the security role for which you want to modify the folder permissions.
   4. Select a security area from the table in the security role details pane.
   5. In the Folder Rights section, select the folder for which you want to modify the

     permissions.
   6. Modify the rights as required, click Save, and the click OK.

Related topics

Process Designer security model
Processes and Best Practices
Add security roles and settings
Add folder permissions to a security role


1.6.5. Calendars

The Service Manager calendar is an optional feature that enables the System
Administrator to define custom work schedules for each group in the organization.
These custom calendars determine when alerts and notifications occur for particular
groups.

By default, Service Manager uses a calendar with a 24-hour work day and a 7-day
work week to determine when alerts and notifications occur. In the default 24-hour, 7-
day calendar, Service Manager sends alerts and notifications without regard to
operator work shifts. For example, if an operator schedules a notification to occur in 6
hours, then Service Manager sends the notification after 6 hours have passed
regardless of whether any operator is present to receive it. A notification scheduled at
5:00 p.m. in the default calendar arrives at 11:00 p.m. the same day.

Using a custom calendar, however, the same 6-hour delay occurs only during the
defined work schedule. For example, a System Administrator can define an 8-hour
work day lasting from 8:00 a.m. to 5:00 p.m., which includes a 1-hour break from
12:00 p.m. to 1:00 p.m. If an operator then schedules a notification to occur 6 hours
after 5:00 p.m., the notification actually occurs at 3:00 p.m. the next work day, or 6
working hours after the notification start time.

System Administrators can create custom calendar records to use throughout Service
Manager. The caldutyhours table contains custom calendar records that a System
Administrator can assign to Service Manager activities:

     Change Management work schedule
     Change Management group definitions
     Incident Management assignment group definitions
     Incident Management deadline alert group definitions
     Request Management target order times
     Request Management target completion times
     Service Level Agreement service hours
     Service Level Agreement availability schedules
     Service Level Agreement response time schedules
     Service Desk on call times
     Vendor schedules

Related topics

Holiday records
On-call schedules


On-call schedule exceptions
Work schedules
Time zones
Create a holiday group
Create an on-call schedule


1.6.5.1. Holiday records

Service Manager includes out-of-box records for common holidays in the United
States. To add a holiday, you must create a new holiday record in the calholidays table
and associate that holiday with a group in calholtable.

Service Manager uses calholtable to organize holidays into different groups. For
example, one group of holidays might list all holidays observed in France. This group
would include worldwide holidays like Christmas and New Year's Day and those
unique to France. A second group might also list the worldwide holidays, but add
those unique to North America.

Associated tables

Service Manager uses information in these tables:

     calholidays contains a record for each holiday observed by your company.
     calholtable contains a record with the name of each group of holidays.

Create a holiday group

Applies to User Roles: System Administrator

To create a holiday group:

   1. Click Tailoring > Database Manager.
   2. Type calholtable in the Form field.
   3. Click Search.
   4. Type the name of the new holiday group in the Holiday Group Name field.
   5. Click Add.

Related topics

Calendars
On-call schedule exceptions
On-call schedules
Time zones
Work schedules
Add, delete, or update a primary data record
Create an on-call schedule


1.6.5.2. On-call schedules

On-call schedules help managers or administrators determine whether they have
enough resources on call to cover all shifts for each day. The on-call schedule
specifies who is to be notified, when, and the notification method. An administrator
must complete the On Call Information form to identify individual operator or contact
assignments before Service Manager can create an on-call schedule record.

At midnight, the problem background processor generates the on-call schedule for
the next day. The background processor uses information in these tables to produce
the on-call schedule for the next 24 hours:

     caldutyhours contains shift definition records.
     operator and contacts provide information about the operator.
     oncallsched defines on call assignments, notification methods, and time zone
     variations.
     tzfile defines time zones.

Time zones

The On Call Information form has a time zone field where you can note deviations
from the server time zone for any operator. For example, consider this scenario:

     A European company has headquarters in London, where the corporate server is
     located.
     The company record specifies that Western European Time (WET) is the default
     time zone.
     Teresa Thompson is an employee who works remotely from California.
     The manager notes that Teresa Thompson's Local Time in the on-call schedule
     form is Pacific Standard Time (PST).
     When the manager sends Teresa Thompson to Chicago for two weeks of on-site
     customer support, the manager makes an entry in the Exception Time Zone field
     that temporarily changes Teresa Thompson's location to Central Standard Time
     (CST).
     When Teresa Thompson returns to California, the manager removes this
     exception entry from the on-call schedule form before Service Manager
     generates the next day's record.

Related topics

Calendars
Holiday records


On-call schedule exceptions
Work schedules
Time zones
Create a holiday group


1.6.5.2.1. On-call schedule exceptions

The On Call Information form enables you to define exceptions to the standard
notifications and time intervals in the daily schedule. There is an Exceptions tab
where you can note deviations from the server time zone and notification method for
any operator. For example, consider this scenario and how the Exceptions tab
captures schedule variations.

     A European company has headquarters in London, where the corporate server is
     located.
     The company record specifies that Western European Time (WET) is the default
     time zone.
     Teresa Thompson is an employee who works remotely from California.
     The manager notes that Teresa Thompson's Local Time in the On Call
     Information form is Pacific Standard Time (PST).
     When the manager sends Teresa Thompson to Chicago for two weeks of on-site
     customer support, the manager makes an entry in the Exception Time Zone field
     that temporarily changes Teresa Thompson's location to Central Standard Time
     (CST).
     When Teresa Thompson returns to California, the manager removes this
     exception entry from the on-call schedule form before Service Manager
     generates the next day's record.

Daily Schedule

Service Manager displays daily schedule information for regular on call dates and
times using a relative date and time format that's not dependent on a specific time
zone. The relative time format is dd hh:mm:ss. For example, the Servicedesk Agent
always begins work at 8:00:00 and stops work at 17:00:00.

Exceptions

Service Manager displays on call exception dates and times using an absolute date
and time format. The absolute date and time are for the time zone specified in the On
Call Information form. If you omit a time zone, the default value is the time zone in the
company record. The absolute time format is mm/dd/yyyy hh:mm:ss. For example,
Teresa Thompson worked in the Central time zone only one day. Teresa Thompson
began work on 03/14/2009 08:00:00, and stopped work on 03/14/2009 at 17:00:00.

Related topics


Calendars
Holiday records
On-call schedules
Work schedules


1.6.5.2.2. Create an on-call schedule

Applies to User Roles: System Administrator
To create an on-call schedule:

   1. Click Tailoring > Notifications > Daily On Call Records.
   2. Specify the name of the group in the Group Name field.
   3. Fill in the following fields.


       Daily Schedule tab: Use this tab to type the schedule for each contact in the group.

Field                                   Description

Contact                                 Type the contact or operator name
                                        of the person to receive the
                                        notification.

Start Time                              Type the time that the person starts
                                        being on call. Type the time in the
                                        24-hour time format. By
                                        default, Service Manager treats a
                                        blank start time as equivalent to
                                        00:00:00 or midnight.

End Time                                Type the time that the person ends
                                        being on call. Type the time in the
                                        24-hour time format. By
                                        default, Service Manager treats a
                                        blank end time as equivalent to
                                        23:59:59 or one second until
                                        midnight.

Days of the week                        Type true for any day that the
                                        person is on call, and type false for
                                        days the person in not on call. By
                                        default, Service Manager treats a
                                        blank entry as false.

Notify Method                           Specify the name of the message
                                        class used to notify this person.

Condition                               Type true to enable the notification
                                        in all conditions. Type an expression
                                        that's true or false to define the
                                        condition for notification.
                                        Type false to disable the
                                        notification in all conditions. By
                                        default, Service Manager treats a
                                        blank entry as true.

Field                                                                                     Service Manager 9.81
Local Time Zone
                                        Description

                                        Click the drop-down list to select the
                                        local time zone where the contact
                                        resides. This is optional if all
                                        contacts are in the time zone
                                        specified in the company record.


Exceptions tab: Use this tab to define alternative notification methods and conditions during exception
                                   dates such as holidays and vacations.

Field                                   Description

Contact                                 Type the contact or operator name
                                        of the person receiving the
                                        notification.

Start Date                              Type the date and time on which the
                                        exception schedule begins. Type the
                                        time in the 24-hour time format. By
                                        default, Service Manager treats a
                                        blank start time as equivalent to
                                        00:00:00 or midnight.

End Date                                Type the date and time on which the
                                        exception schedule ends. Type the
                                        time in the 24-hour time format. By
                                        default, Service Manager treats a
                                        blank end time as equivalent to
                                        23:59:59 or one second until
                                        midnight.

Notify Method                           Specify the name of the alternate
                                        message class used to notify the
                                        operator during the exception
                                        schedule.

Condition                               Type true to enable notification in
                                        all conditions. Type an expression
                                        that's true or false to define the
                                        condition when notification occurs.
                                        Type false to disable notification in
                                        all conditions. By default, Service
                                        Manager treats a blank entry as true.

       Field                                                                              Service Manager 9.81
       Replace Daily
                                        Description
       Exception Time Zone
                                        Type true to use notification
   4. Click Add.                        conditions defined only on
                                        the Exception tab. Type false to
Related topics                          use notification conditions defined
                                        on the Daily Schedule and Exception
Work schedules                          tab. By default, Service
Time zones                              Manager treats a blank entry as
Create a holiday group                  false.

                                        Click the drop-down list to select an
                                        exception time zone if the contact is
                                        in a different location temporarily.
                                        For example, an operator might be
                                        deployed to a customer site for a
                                        week.


1.6.5.3. Work schedules

A work schedule defines the work hours for one or more operators. Service Manager
can generate a complex 24x7 schedule that spans multiple time zones, includes all
shift and break information, accommodates any regional shift to Daylight Savings
time, and automatically accounts for local or national holidays. Service Manager uses
the following information to create a work schedule:

     Shift and break information
     Holiday information (optional)

Service Manager uses work schedule information in various calculations. One of the
more important calculations is when to trigger an alert that an incident should
escalate to the next level.

The caldutyhours table

The caldutyhours table contains records that identify the time to start and stop work,
and the time to start and stop a break. The caldutyhours table contains the following
out-of-box records.


Shift name                              Holiday table  Duration
Long                                    standard
Short                                   standard       50-hour week with no
Day shift                               standard       breaks
Day shift 2                             standard
Graveyard shift                         none           42.5-hour week with no
Managers                                none           breaks
Ops graveyard                           none
Second shift                            none           40-hour week with one
Standard                                none           hour breaks
Swing shift                             none
                                                       40-hour week with one
                                                       hour breaks

                                                       40-hour week with no
                                                       breaks

                                                       40-hour week with no
                                                       breaks

                                                       40-hour week with no
                                                       breaks

                                                       50-hour week with no
                                                       breaks

                                                       40-hour week with no
                                                       breaks

                                                       50-hour week with no
                                                       breaks

Work schedules can apply to a group, such as an assignment group, or to an
individual named in the operator or contacts table. When you create schedule
records, start and stop times must not overlap, and breaks must occur within the
defined work shift.

Related topics

Calendars
Holiday records
On-call schedules


On-call schedule exceptions
Time zones
Create a holiday group
Create an on-call schedule
````
