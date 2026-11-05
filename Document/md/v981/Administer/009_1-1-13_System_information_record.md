---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.1.13 .. 1.1.15
printed_pages: 198-227
---

# 1.1.13 System information record

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.13. System information record

The system information record contains common information that all Service Manager
applications can use.
From the company record administrators can do the following.

            Note

           The information listed below is presented in the same order within the
           tabs displayed in this form.

Add company contact information
Select Service Manager portal
Add URL information for Service Manager clients such as web tier and self-
service
Set general login restrictions
Set user lockout conditions
Define the operator template to be applied to LDAP users
Set user account expiration conditions
Define default menu information
Set password reset restrictions
Enable password history
Set password format restrictions
Set password lifetime conditions
Set the time zone the system uses
Set the date format the system uses
Enable legacy print routines
Define the months of the year and the abbreviations the system uses
Enable or select miscellaneous settings

     Set the default language the system uses
     Set the default currency the system uses
     Set the maximum size for a file attachment
     Set the maximum number of inbox views that a user can create
     Set the maximum memory all file attachments can use
     Enable case sensitivity
     View the system start time


     Enable message queues
     Enable auditing in the system log
     Enable multi-company mode
     Enable learning for Service Manager Knowledge Bases
     Enable editing of the learning record
     Enable universal search
     Disable the pop-up window to reload records
     Enable Calendar and Time Period Management
     Enable Enhanced Query Hash
List message processors the system uses


1.1.13.1. Add company contact information

Applies to User Roles: System Administrator
To add company contact information:

   1. Click System Administration > Base System Configuration > Miscellaneous >
     System Information Record.

   2. Type the company contact information.
   3. Click Save.

Related topics

System information record


1.1.13.2. Select Service Manager portal

Applies to User roles: System Administrator

From System Information Record, you can specify which portal is the active end user
portal.

To select the active Service Manager end user portal, follow these steps:

   1. Click System Administration > Base System Configuration > Miscellaneous >
     System Information Record.

   2. Click the Active Integrations tab.
   3. In the SM Portal field, select one of the following portals from the drop-down

     list:
           ESS
           Service Portal

   4. Click Save.

Related topics

System information record


1.1.13.3. Add URLs for Service Manager
clients

Applies to User roles: System Administrator
You can add URLs for Service Manager clients to the system information record to
make them available as system variables.
To add URLs for Service Manager clients, follow these steps:

   1. Click System Administration > Base System Configuration > Miscellaneous >
     System Information Record.

   2. Click the Active Integrations tab.
   3. Type values for the Web Server URL, ESS URL, and Mobility URL fields as

     needed.

                   Note

                The ESS URL only takes effect if the corresponding option selected
                as the active SM portal.

   4. Click Save.

Related topics

System information record


1.1.13.4. Enable the enhanced query hash
algoritm

Applies to User roles: System Administrator
Starting with version 9.41, Service Manager provides an enhanced query hash
algorithm, which ensures a higher level of system security when the Service Manager
web client is handling URLs. By default, this functionality is disabled for backward
compatibility.

To enable the enhanced query hash algorithm, follow these steps:

   1. Click System Administration > Base System Configuration > Miscellaneous >
     System Information Record.

   2. Click the General tab.

   3. Configure the enhanced query hash functionality as described in the following
     table.

Option                                  Default value                      Service Manager 9.81
                                        false
Enable Enhanced                                        Description
Query Hash
                                                       When this option is set
                                                       to true (selected), the
                                                       Service Manager
                                                       server generates query
                                                       hashes based on the
                                                       enhanced query hash
                                                       algorithm. For security
                                                       considerations, we
                                                       recommend you to
                                                       enable this option.

                                                       By default, this option
                                                       is disabled so that your
                                                       system can continue to
                                                       use the legacy
                                                       algorithm and work as
                                                       before.

Option                                  Default value                      Service Manager 9.81
                                        true
Allow Legacy Query                                     Description
Hash
                                                       This option is available
                                                       only when the Enable
                                                       Enhanced Query Hash
                                                       option is enabled.

                                                       By default, this option
                                                       is enabled so that the
                                                       Service Manager web
                                                       client can accept URLs
                                                       with query hashes that
                                                       are generated based
                                                       on either the legacy or
                                                       the enhanced
                                                       algorithm.

                                                       If you deselect this
                                                       option, the client
                                                       displays an error
                                                       message when
                                                       processing URLs with a
                                                       legacy query hash,
                                                       indicating the hash
                                                       code is invalid.

Option                                  Default value                      Service Manager 9.81

                                                       Description

                                                                   Note

                                                                  Use this
                                                                  option only
                                                                  during your
                                                                  transition
                                                                  from the
                                                                  legacy
                                                                  algorithm
                                                                  to the
                                                                  enhanced
                                                                  algorithm.
                                                                  Once no
                                                                  URLs with
                                                                  legacy
                                                                  query
                                                                  hashes
                                                                  exist in
                                                                  your
                                                                  system, we
                                                                  recommen
                                                                  d you to
                                                                  disable this
                                                                  option.

   4. Click Save.

Related topics

System information record
System Security
Generating Web tier URL queries


1.1.13.5. Set the default maximum number
of login attempts per session

Applies to User Roles: System Administrator

To set the default maximum number of login attempts per session:

   1. Click System Administration > Base System Configuration > Miscellaneous >
     System Information Record.

   2. Click the Logon Info tab.

   3. Move the slider in the Attempts Per Login Session field to an appropriate value.
     The system uses the number of login attempts as the company default.

     For more information about how to set the minimum and maximum value of the
     Attempts Per Login Session field, see Decimal control.

   4. Click Save.

The Windows client creates a new session for each login attempt. There will never be
more than one login attempt per session. To restrict login attempts from the Windows
client, enable the Use User Lockout option and set a value for the Attempts Until
Lockout field. Use the Attempts Per Login Session setting to control Web client login
attempts.

Related topics

System information record
Set the default maximum number of sessions per user
Set the default password reset
Set the default user expiration interval
Set the default user inactivation interval


1.1.13.6. Set the default maximum number
of sessions per user

Applies to User Roles: System Administrator
To set the default maximum number of sessions per user:

   1. Click System Administration > Base System Configuration > Miscellaneous >
     System Information Record.

   2. Click the Logon Info tab.

   3. Move the slider in the Max Logins Per User field to an appropriate value. The
     system uses the number of user sessions as the company default.

     For more information about how to set the minimum and maximum value of the
     Max Logins Per User field, see Decimal control.

   4. Click Save.

Related topics

System information record
Set the default maximum number of login attempts per session
Set the default user expiration interval
Set the default user inactivation interval


1.1.13.7. Set the default password reset

Applies to User Roles: System Administrator

To set the default password reset:

   1. Click System Administration > Base System Configuration > Miscellaneous >
     System Information Record.

   2. Click the Passwords tab.
   3. Click the Password Standards tab.
   4. Select one of the following options:

           Prevent Pwd Reset — select this option to disable the password reset
           option.
           Reset to User Name — select this option to reset passwords to the
           operator's login name.

           Prompt for Value — select this option to have Service Manager prompt the
           system administrator for a new password.

           Tip: For increased security, the system administrator can also select the
           password expired option in the operator record. Doing so requires reset
           users to change their passwords at the next login.

           Reset to Value — select this option to type a global password that applies
           to all reset users.
   5. Click Save.

Related topics

Lockout feature
System information record


1.1.13.8. Set the default user expiration
interval

Applies to User Roles: System Administrator

To set the default user expiration interval:

   1. Click System Administration > Base System Configuration > Miscellaneous >
     System Information Record.

   2. Click the Logon Info tab.

   3. In the Expiration Interval field, type the time period that a user can remain
     inactive until the user account expires.

     Type the time period in the following format: Dayshours:minutes:seconds. For
     example, 4 03:02:01 expires the user account after 4 days, 3 hours, 2 minutes,
     and 1 second of inactivity.
     Important: The system administrator can't reset an expired account. The system
     administrator must create a new operator record for the expired account.

   4. Click Save.

Related topics

System information record
Set the default maximum number of login attempts per session
Set the default maximum number of sessions per user
Set the default password reset
Set the default user inactivation interval


1.1.13.9. Set the default user inactivation
interval

Applies to User Roles: System Administrator

To set the default user inactivation interval:

   1. Click System Administration > Base System Configuration > Miscellaneous >
     System Information Record.

   2. Click the Logon Info tab.

   3. In the Inactivation Interval field, type the time period that a user can remain
     inactive until Service Manager locks out the account.

     Type the time period in the following format: Dayshours:minutes:seconds. For
     example, 4 03:02:01 locks out the user after 4 days, 3 hours, 2 minutes, and 1
     second of inactivity.

   4. Click Save.

Related topics

System information record
Set the default maximum number of login attempts per session
Set the default maximum number of sessions per user
Set the default password reset
Set the default user expiration interval


1.1.13.10. Setting file attachment size limits

Setting attachment size limits

You can set the following two file attachment size limits:

     Maximum single attachment size

     This value limits the maximum size of a single attachment.

     Total attachment size

     This value limits the total size of all attachments in an attachment container,
     such as an incident record.

You can set these attachment size limits in the following ways:

     Specify the attachment size limit for the entire system in the system information
     record
     Specify the attachment size limit for a particular operator in their operator record
     Specify the attachment size limit for the attachment container on a form by using
     Forms Designer

     Specify the attachment size limit for individual attachments by using the
     MaxAttachUploadSize and MaxTotalAttachUploadSize parameters.

                   Note

                These parameters are located in the web.xml file. The default value
                of the MaxAttachUploadSize parameter is 10 MB, and the default
                value of the MaxTotalAttachUploadSize parameter is 50 MB.

If you don't specify a value in one of these places, there is no limit on the size of
attachments, and users can add attachments as large as the database record will
hold. If you specify the attachment size limits in more than one place, then the order
of precedence is:

   1. The value from the attachment container
   2. The value from the operator record
   3. The value from the company record
  4. The values of the MaxAttachUploadSize and MaxTotalAttachUploadSize

     parameters


As an example, for the maximum size of a single attachment, if the company record
limit is set to 1,000,000 bytes, the operator has a limit set to 2,000,000 bytes, and the
container has a limit of 3,000,000 bytes, the person will be able to store a 3,000,000
byte attachment in the container (the attachment container property overrides the
other two limits). A different operator without a limit, storing attachments in a different
container with no limit set, would only be able to save a 1,000,000 byte attachment.

            Note

           File size validation is not performed at the widget level on the web
           service. Therefore, it is possible to attach a file that exceeds the
           configured size limits by using the web service.

Setting attachment count limits

You can limit the number of individual files that can be attached to each record in
Service Manager. To do this, configure the maxattachmentcount parameter. By
default, the value of this parameter is 100 files.

Related topics

System information record
Parameter: maxattachmentcount
Set the maximum file attachment size for the entire company
Set the maximum file attachment size for an operator
Set the total file attachment size for the entire company
Set the total file attachment size for an operator


1.1.13.11. Set the maximum file attachment
size for the entire company

Applies to User Roles: System Administrator

To set the maximum file size of a single attachment for the entire company:

   1. Click System Administration > Base System Configuration > Miscellaneous >
     System Information Record.

   2. Click the General tab.
   3. In the Max Attachment Size field, type the number of bytes for the maximum file

     attachment size.
   4. Click Save.

You can define a file attachment maximum size limit for all users from the system
wide company record. The system wide company record file attachment size limit is
superseded by size limits defined in individual operator records and for attachment
containers defined in Forms Designer.

Related topics

Setting file attachment limits
Set the maximum file attachment size for an operator
Set the total file attachment size for the entire company
Set the total file attachment size for an operator


1.1.13.12. Set the total file attachment size
for the entire company

Applies to User Roles: System Administrator

To set the total attachment size in any attachment container for the entire company:

   1. Click System Administration > Base System Configuration > Miscellaneous >
     System Information Record.

   2. Click the General tab.
   3. In the Total Attachment Size field, type the number of bytes for the total file

     attachment size.
   4. Click Save.

You can define a total attachment size limit for all users from the system wide
company record. The total attachment size limit defined in system wide company
record file is superseded by size limits defined in individual operator records and for
attachment containers defined in Forms Designer.

Related topics

Set the total file attachment size for an operator
Set the maximum file attachment size for the entire company
Set the maximum file attachment size for an operator
Add company contact information
Add URLs for Service Manager clients


1.1.13.13. Set the maximum number of
inbox views

Applies to User Roles: System Administrator
To set the maximum number of inbox views that a user can create:

   1. Click System Administration > Base System Configuration > Miscellaneous >
     System Information Record.

   2. Select the General tab.
   3. In the Max Views Shown in the List field, type the maximum number of inbox

     views that users are allowed to create.
     Notes:

           The default number of allowable views is 100.
           There is no limit to the number of views that can be set.
   4. Click Save.

Related topics

System information record


1.1.13.14. Set the virtual group size for
inbox views

Applies to User roles: System Administrator

In inbox views, records are divided into virtual groups if there are too many records in
a group.

To set the number of records that are displayed as one virtual group in inbox views,
follow these steps:

   1. Click System Administration > Base System Configuration > Miscellaneous >
     System Information Record.

   2. Select the General tab.
   3. In the Virtual Group Size field, type the number of records that you want the

     system to display as one group in inbox views.
           If the value is 0 or empty, the virtual group size is determined by the client,
           which is 100 by default.
           You can set the value from 25 to 500. In addition, make sure that this group
           size is not greater than the value of the sqlfetchs parameter if you have
           specified one.
           Make sure that you do performance testing before you set a big number in
           your production environment.

   4. Click Save.

Related topics

System information record


1.1.13.15. Set the menu prompt

Applies to User Roles: System Administrator

The menu prompt is the text Service Manager displays in the first workspace tab. To
set the menu prompt:

   1. Click System Administration > Base System Configuration > Miscellaneous >
     System Information Record.

   2. Click the Menu Information tab.
   3. In the Menu Prompt field, type the text or variable to display in the first

     workspace tab.
   4. Click Save.

Related topics

System information record


1.1.13.16. Activate the command/search
line toggle button

Applies to User Roles: System Administrator

To activate the command/search line toggle button:

   1. Follow the steps in Enable an operator to see the command line.
   2. Click System Administration > Base System Configuration > Miscellaneous >

     System Information Record.
   3. Click the General tab.
   4. Mark the Enable Universal Search checkbox.
   5. Click Save.
   6. Restart your web applications server.
   7. Click System Status and verify the lister background process is running. If not,

     click Start Scheduler and double-click lister.startup in the list to launch this
     process.
   8. Log out of Service Manager and then log in again. The command/search line
     toggle button is enabled for the operator.

Related topics

Display application
Displayoptions
Selecting display options


1.1.13.17. Enable editing of Knowledge
learning records

Applies to User Roles: System Administrator
To enable editing of Knowledge learning records:

   1. Click System Administration > Base System Configuration > Miscellaneous >
     System Information Record.

   2. Click the General tab.
   3. Select the Allow Editing of Learning Record option.
   4. Click Save.

Service Manager displays the message: Information record updated.

Related topics

Adaptive learning


1.1.13.18. Enable learning for Knowledge
records

Applies to User Roles: System Administrator
Enabling learning for Knowledge records grants users access to the Use Resolution
option when adding a solution to a knowledge record.

To enable learning for Knowledge records:

   1. Click System Administration > Base System Configuration > Miscellaneous >
     System Information Record. The info.company.g form opens.

   2. Click the General tab.
   3. Select the Use learning for Knowledge Engineering option.
   4. Click Save.

Service Manager displays the message: Information record updated.

Related topics

Adaptive learning
Enable editing of Knowledge learning records


1.1.14. Time zones

A time zone is Greenwich Mean Time (GMT) plus or minus the required offset for
geographic location. Service Manager uses time zone information to display local
time correctly, and calculate the correct escalation time for alerts. Service Manager
uses time zone information for:

     Work schedules
     Alerts
     Request Management lead time calculations
     Service Level Agreements (SLAs) and service contracts
     Clocks
     Reminders

System administrators can define a system-wide default time zone and date format in
the company record. Individual operator records can contain individual time zone
values that override the system-wide default time zone.

Service Manager contains out-of-box time zone records for most regions of the
world. System administrators can also create their own time zone records. Each time
zone record contains:

     Local GMT offset
     Local time switch over definitions
     Local date format

Associated tables

Service Manager uses information in these tables to track time zone information.

     tzfile
     contact
     location
     device
     assignment
     cm3groups
     ocmgroups

Set the default system time zone

To set the default system time zone:


   1. Click System Administration > Base System Configuration > Miscellaneous >
     System Information Record.

   2. Click the Date Info tab.
   3. In the Time Zone field, type or select the default system time zone.
   4. Click Save.
   5. Click More or the More Actions icon, and then select Set Parms.
   6. Stop and restart the Service Manager server.

Add a time zone record

To add a time zone record:

   1. Click Tailoring > Database Manager.
   2. In the Form field, type tzfile .
   3. Click Search.
   4. Specify information for the following fields:

           Time Zone Name identifies the time zone.
           Description specifies the locations where the time zone applies.
           Default Date Format is one of these date formats:

                 mm/dd/yy — standard U.S. date format
                 dd/mm/yy — standard European date format
                 yy/mm/dd — optional date format
                 mm/dd/yyyy — standard U.S. date format
                 dd/mm/yyyy — standard European date format
                 yyyy/mm/dd — optional date format
           The value you enter in this field overrides the default date format in the
           company record.
           Date Separator is the character that separates the year, month, and date.
           Only "/","-", or "." is allowed.
           Time Change Definitions defines every possible time offset that can occur
           within the time zone:
                 Name (abbr) is the abbreviation for a particular time offset.
                 Offset from GMT is the number of hours, minutes, and seconds the
                 time zone is ahead or behind Greenwich Mean Time (GMT) in this
                 format:
                plus or minushours:minutes:seconds.
                 For example, +04:03:02 is ahead of Greenwich Mean Time by 4
                 hours, 3 minutes, and 2 seconds.
           Time Change Dates/Indexes defines when time changes occur:
                 Switchover Date is the date and time when the offset begins.
                Type the date and time in this format: date hour:minute:second. In


                addition, the date must be in the mm/dd/yy format.
                 For example, 04/15/04 02:00:00 switches over on April 15, 2004 at 2
                 AM.
                 Index of Definition is the index number of the time offset used on the
                 switch over date.
                 The index number matches the position the offset has in the Time
                 Change Definitions. The first offset is index 0, the second offset is
                 index 1, and so on.
   5. Click Add.

Your user profile must include the system administration capability word to add this
record.

Delete a time zone record

To add a time zone record:

   1. Click Tailoring > Database Manager
   2. In the Form field, type tzfile.
   3. Click Search
   4. Type or select optional search criteria.
   5. Click Search.
   6. Select the time zone to delete.
   7. Click Delete.
   8. Click Yes to confirm the deletion.

Update a time zone record

To update a time zone record:

   1. Click Tailoring > Database Manager.
   2. In the Form field, type tzfile .
   3. Click Search.
   4. Update one or more of these fields:

           Time Zone Name identifies the time zone.
           Description specifies the locations where the time zone applies.
           Default Date Format is one of these date formats:

                 mm/dd/yy — standard U.S. date format
                 dd/mm/yy — standard European date format
                 yy/mm/dd — optional date format
                 mm/dd/yyyy — standard U.S. date format
                 dd/mm/yyyy — standard European date format


                 yyyy/mm/dd — optional date format
           The value you enter in this field overrides the default date format in the
           company record.
           Time Change Definitions defines every possible time offset that can occur
           within the time zone:

                 Name (abbr) is the abbreviation for a particular time offset.
                 Offset from GMT is the number of hours, minutes, and seconds the
                 time zone is ahead or behind Greenwich Mean Time (GMT) in this
                 format:
                plus or minushours:minutes:seconds.
                 For example, +04:03:02 is ahead of Greenwich Mean Time by
                 4 hours, 3 minutes, and 2 seconds.
           Time Change Dates/Indexes defines when time changes occur:
                 Switchover Date is the date and time when the offset begins.
                Type the date and time in this format: date hour:minute:second. In
                addition, the date must be in the mm/dd/yy format.
                 For example, 04/15/04 02:00:00 switches over on April 15, 2004 at
                 2 AM.
                 Index of Definition is the index number of the time offset to use when
                 it reaches the switch-over date.
                 The index number matches the position the offset has in the Time
                 Change Definitions. The first offset is index 0, the second offset is
                 index 1, and so on.
   5. Click Save.

Related topics

Regional settings
System information record


1.1.15. UTF-8 (Unicode) support

UTF-8 is part of the Unicode standard, which enables you to encode text in
practically any script and language. Service Manager supports UTF-8 as the
encoding method for new or existing data. It can support multiple languages that
adhere to the Unicode standard on the same server.

Service Manager can also convert data to UTF-8 on-demand, thus eliminating system
outages.

Prior to Unicode, languages were grouped into sets often referred to as Latin 1
(Western European language such as English, French, German), Latin 2 (Eastern
European languages such as Czech, Polish, Slovak), Latin 5 (Turkish) and so on.
Earlier ServiceCenter versions supported multiple languages only within a language
group. Therefore, a single server instance could support French and German, English
and Turkish, English and Japanese, but not Turkish and Czech, or Polish and
Japanese. The ability to display data in disparate languages from a single server is
attractive to any Service Manager user with an international customer base.

Consider the following point to ensure successful Unicode support:

     Ensure that your RDBMS is correctly configured for UTF-8 support. For more
     information, see your local Database Administrator.
````
