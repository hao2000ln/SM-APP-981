---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.11 .. 1.11.3
printed_pages: 2748-2765
---

# 1.11 Status and Notifications

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.11. Status and Notifications

The Service Manager server includes a number of status and notifications options
you can configure after installation. The following table lists the status and notification
options you can enable or configure from a new development environment
installation.

Feature                                 Description                Default state in new
Alerts                                                             installations
                                        The server can             Enabled
Broadcast messages                      automatically generate
Message processors                      messages when a            Disabled
Notifications                           system event meets         Disabled
System bulletins                        predefined criteria.
                                                                   Enabled
                                        Administrators can send
                                        messages to all logged     Disabled
                                        on users.

                                        A scheduled process
                                        dedicated to managing
                                        Service Manager
                                        messages.

                                        The server can
                                        automatically generate
                                        messages when status
                                        change events occur.

                                        A utility that allows you
                                        to post system
                                        information and status
                                        messages to your
                                        Service Desk operators.

Related topics

Alerts
Broadcast messages


Log switching
Message processors
Notifications
System bulletins
System status form


1.11.1. Alerts

An alert is a system event that occurs when the event meets predefined criteria. They
signal a checkpoint, warning, or reminder to keep an activity on schedule. Service
Manager calculates alert times by subtracting (or adding) a known interval from a
specified time.

Alert calculations depend on the work schedule, time zones, or other defined input. A
schedule might cover seven days a week and 24 hours a day. When Service Manager
processes alerts, it excludes scheduled holidays and break times in its calculations.
Service Manager can make the necessary adjustments to deliver alerts at the correct
time, regardless of time zone differences. For example:

     The work shift starts at 8:00 a.m. and ends at 5:00 p.m.
     The lunch break starts at 12:00 p.m. and ends at 1:00 p.m.

If you schedule an alert to occur four and a half hours after the start of the shift, then
the alert occurs at 1:30 p.m. because the system excludes the lunch break interval
when calculating the alert. If a holiday occurs, Service Manager postpones the alert
until the next regularly scheduled day. For example:

     Independence Day holiday starts at 07/04/2004–2005 00:00:00 and ends at
     07/05/2004–2005 00:00:00.
     If you schedule an alert at 5 p.m. July 3 to occur six hours later, the alert occurs
     at 3:00 p.m. on July 5. The alert ignores all nonscheduled hours outside of work
     shift, the July 4 holiday, and scheduled break times.

You can also set an alert as a TO-DO alert, which enables this alert to appear on your
home page.

Associated tables

Service Manager uses information from various tables to process alerts. The tables
vary, depending on whether Service Manager processes the alert from the AlertDef or
category table:

     AlertDef can use assignment, contacts, device, location, and myGroups
     category uses assignment (for Incident Management alerts)

Create an alert definition record

Applies to User roles: System Administrator, Change Manager, Problem Manager


To create an alert definition record, follow these steps:

   1. Change Management: Click Change Management > Configuration > Alerts.

     Incident Management: Click Incident Management > Configuration > Alerts
     Definitions.

     Problem Management: Click Problem Management > Administration > Alert
     Definitions.

     Request Fulfillment: Click Request Fulfillment > Configuration > Alert
     Definitions.

     The Alert Definition form opens.

   2. Type the alert name in the Alert Name field.
   3. Type the alert description in the Description field.

   4. Complete the remaining fields in the record form. If necessary, press Ctrl+H in
     the Windows client or F1 in the Web client for each field.

           The Scheduling tab describes the calculations that trigger when the alert
           occurs.
           The Update Info tab describes Format Control considerations and
           notification messages to be sent.

           The Work Schedule tab specifies the work schedule that the alert belongs
           to.

                 Holiday Group specifies the holiday group used when calculating an
                 interval. The holiday group defined here overrides the value of holiday
                 group in the work schedule.

           The Time Zone tab enables you to choose one of the following:

                 Define a specific time zone by choosing from the drop-down list
                 Define a RAD expression to set the time zone alert
                 Obtain the time zone from a table lookup

           The To-Do Alert tab enables you to set this alert as a To-Do alert.

   5. Click Add.

Create a To-Do alert definition record

Applies to User roles: System Administrator, Change Manager, Problem Manager,
Incident Manager, Request Manager


To create a To-Do alert definition record, follow these steps:

   1. Change Management: Click Change Management > Configuration > Alerts.

     Incident Management: Click Incident Management > Configuration > Alerts
     Definitions.

     Problem Management: Click Problem Management > Administration > Alert
     Definitions.

     Request Fulfillment: Click Request Fulfillment > Configuration > Alert
     Definitions.

     The Alert Definition form opens.

   2. Type the alert name in the Alert Name field.
   3. Type the alert description in the Description field.

   4. Complete the remaining fields in the record form. If necessary, press Ctrl+H in
     the Windows client or F1 in the Web client for each field.

           The Scheduling tab describes the calculations that trigger when the alert
           occurs.
           The Update Info tab describes Format Control considerations and
           notification messages to be sent.

           The Work Schedule tab specifies the work schedule that the alert belongs
           to.

                 Holiday Group specifies the holiday group used when calculating an
                 interval. The holiday group defined here overrides the value of holiday
                 group in the work schedule.

           The Time Zone tab enables you to choose one of the following:

                 Define a specific time zone by choosing from the drop-down list
                 Define a RAD expression to set the time zone alert
                 Obtain the time zone from a table lookup

           The To-Do Alert tab enables you to choose one of the following:

                 Define this alert as a To-Do alert

                 Assign an alert group


                                Note

                            We provide four out-of-box alert groups and you can add
                            new alert groups in the To-Do Alert Type global list.
                            These groups are used to show the types of alerts when
                            you look at your To-Do Alerts window.

                                Note

                            For the SLT Alert group, the response target is supported
                            in the out-of-box system, whereas the service target is
                            unsupported.

                 Specify the alert message template for this alert group

                 The message content is displayed in the To-Do Alerts window. You
                 can use fixed or dynamic expressions as the message template. For
                 example, the 1 in action in $L.file expression means that the
                 information of the ticket description is displayed.

   5. Click Add.

Enable a To-Do alert for an operator

Applies to User roles: System Administrator, Change Manager, Problem Manager,
Incident Manager, Request Manager

To enable To-Do alert for an operator, follow these steps:

   1. Click System Administartion > Ongoing maintenance > Operators.
   2. Open an operator record.
   3. From the To-Do Alert tab, select the checkbox to enable To-Do alert for this

     operator.
   4. Complete the remaining fields in the record form. If necessary, press Ctrl+H to

     view help for each field.

           The Display records from previous days field specifies the days for the
           records to be displayed since the alert occurs.

           The Maximum number of records in the list field specifies the maximum
           number of the records to be displayed on the To-Do alert window.


           The Display records assigned to field specifies the assigned group for the
           records displayed on the To-Do alert page. There are two available fields:
           Me and My Group.

           The Display records reported by the selected companies field specifies
           the company for the records to be reported. You can select and add the
           available company names from the company list on the left panel.

                         Note

                            If no company is specified on the right panel, Service
                            Manager applies all the companies available by default.
                            This field is only available when the multi-company mode
                            has been enabled. To enable the multi-company mode,
                            click System Administration > Base System
                            Configuration > Miscellaneous > System Information
                            Record.

           The Display records from the selected folders field specifies the folder for
           the records to be reported. You can select and add the available folder
           names from the folder list on the left panel.

                         Note

                            If no folder is specfied on the right panel, Service
                            Manager applies all the folders available by default.
                            This field is only available when the folder entitlement has
                            been enabled. To enable the folder entitlement, click
                            System Administration > Base System Configuration >
                            Miscellaneous > System Information Record.

   5. Click Save.

            Note

           Out-of-box, To-Do alert is enabled for Incident, Incident Task, Request,
           Request Task, and Change Approval.

View the To-Do alerts

If the administrator has set To-Do alerts for you, the To-Do Alerts floating window
appears on the top immediately after you log in. To view all the To-Do alerts in a
Service Manager session, click the alerts icon to open the To-Do Alerts window.


Note

     The language of To-Do alert list refers to the operator's preferred
     language (the Language settings in the operator record). However,
     the login language is also referred when the operator logs in to the
     system. If the login language and operator's language setting aren't
     the same value, there might be two different languages displayed in
     the To-Do alert list.
     The To-Do alerts feature is disabled for the users who log in to
     Service Manager ESS portal.

 Field                                                                                          Service Manager 9.81
 Alert category
                                        Description
 Record ID
                                        Displays the alert group for the current
This PDF was generated on May 23, 2026  To-Do alert. The To-Do Alerts window
                                        displays four alert groups.

                                             Approval: Lists the tickets that are
                                             pending on the approval of the
                                             current operator for more than 1
                                             day.
                                             Reminder: Lists the high priority (1
                                             or 2) In Progress tickets which
                                             aren't updated for 6 hours.
                                             Follow Up: Lists the tickets which
                                             are pending for customer actions
                                             for more than 1 day.
                                             SLT: Lists the tickets whose SLT
                                             will breach within 30 minutes.

                                        Click the record ID to open this record
                                        in the main window. You can check the
                                        record details and perform required
                                        actions without closing the To-Do
                                        Alerts window.

                                                    Note

                                                   When you click the record
                                                   ID link in a non-Approval
                                                   alert, the alert that you
                                                   selected and all other non-
                                                   Approval alerts linked to
                                                   the same record are
                                                   automatically
                                                   acknowledged and
                                                   removed from the alert
                                                   window.

                                                                                                                          Page 90 of 384
 Field                                                                                          Service Manager 9.81
 Acknowledge
                                        Description
 Display
 Total                                  Click this button to acknowledge this
 Close                                  alert, which removes this alert from the
                                        alert window. If there are more alerts
Related topics                          than the maximum number set by the
                                        administrator, a new alert in the system
Clocks                                  will be added to the bottom of the list.
Notifications
Time zones                                          Note

                                                   Once the alert is
                                                   acknowledged, the Ack flag
                                                   is marked as true in the
                                                   corresponding record of
                                                   TodoAlertList table.

                                        Shows the number of alerts displayed
                                        in the list.

                                        Shows the number of total alerts in the
                                        system.

                                        Click this button to close the To-Do
                                        Alerts floating window.


1.11.2. Broadcast messages

As a system administrator, you can broadcast messages to the users currently logged
on to the server from the System Status form. This form allows you to broadcast
messages to all users or to pick which users you want to send a message to.
Broadcast messages appear in the message bar and message view of the user's
client.

Broadcast a message to a particular user

Applies to User Roles: System Administrator
To broadcast a message to a particular user, follow these steps:

   1. Click System Status. The system status form opens.
   2. Type the following command in the Command field for the user process to which

     you want to send a message:

          s

   3. Click Execute Commands.
     The operator status display form (operator.status.g) opens.

   4. Click Send Msg.
   5. Type the message you want to broadcast.
   6. Click Send Msg.

     Service Manager sends your message to the selected user.

Broadcast a message to all users

Applies to User Roles: System Administrator
You can broadcast a message to all users from the system status form.
To broadcast a message to all users, follow these steps:

   1. Click System Status. The system status form opens.
   2. Click Broadcast. The system.status.broadcast.g form opens.
   3. Type the text of your message in the field provided.
   4. Click Send Msg.


     Service Manager broadcasts your message to all currently logged on users.

Related topics

System bulletins


1.11.3. Dynamic debugging of user
sessions or schedulers

The dynamic debugging feature enables administrators to enable or disable the
debugging or tracing information for a user/scheduler session, without the need to
restart the server. When enabled, relevant debugging information of that
session/scheduler will be written to the server log (sm.log). Once you have finished
troubleshooting, you can then disable some debugging information for that user
session or scheduler, using dynamic debugging; however some debugging
information can't be disabled using dynamic debugging, and in this case the user
needs to reconnect to the server or an administrator needs to manually stop and then
restart the scheduler, to disable such debugging information.

            Caution

           If multiple sessions exist for one user account or scheduler (for example,
           one user logs in simultaneously from different clients or multiple instances
           of one scheduler have been started), the dynamic debugging settings
           specified for one of these sessions will take effect for all of the sessions
           of this user account or scheduler.

Dynamic debugging supported parameters

The following table lists the debugging parameters that can be enabled and disabled
or can only be enabled in dynamic debugging.


Parameters can be enabled and           Parameters can be enabled but can't
disabled in dynamic debugging           be disabled in dynamic debugging
dbmonitorfiles: [file1],[file2]…        dbtriggertrace
debugca:n                               dbstats
debughttp                               debugattachments
debugdiagnostics                        debugjni
debugscauto                             debugjavascript
debugvmmap                              debugadhocsql
debuglk                                 debugfileio
debugstartup                            debugshutdown
debugrs                                 debugprocesses
ir_trace                                debugdbtypes
rtm                                     debugdbquery
sqldebug

Note

Once you have completed debugging of a user session or scheduler
using any of those parameters that can't be disabled in dynamic
debugging, you are recommended to re-connect the session or restart the
scheduler to disable the parameters.

Set debugging parameters using dynamic
debugging

Applies to User roles: System Administrator


            Note

           Some debugging parameters can be enabled and disabled using the
           dynamic debugging feature, while some can be enabled but can't be
           disabled using this feature.

To set debugging parameters for a user session or scheduler, follow these steps:
   1. Click System Status. The system status form opens.
   2. Type the following command in the Command field for the user session or
     scheduler:

          s

   3. Click Execute Commands.
     The Operator Status Display form (operator.status.g) opens.

   4. Click Send Debug Msg. The Send Debug Message form opens.
   5. Set debugging parameters as needed. The following figure shows an example.

6. Click Send Debug Message. A message is displayed: Message sent to all users
  specified .

7. Click End to exit.


   8. Check the server log file for relevant debugging information of the session or
     scheduler.

   9. Once you have completed troubleshooting, you are recommended to disable the
     debugging parameters for the user session or scheduler. To do this, repeat the
     steps above and disable the parameters.

                   Note

                Some parameters can't be disabled using dynamic debugging. To
                disable such debugging information, disconnect the user session or
                manually restart the scheduler.

Alternatively, you can send the dynamic debugging message using Service Manager
JavaScript. To do this, follow these steps:

   1. Click Tailoring > Script Library.
   2. Add a new debugging JavaScript using the following format:

          var debugmsg="<parameter> log:<directory and log file
          name>";
          var rc=system.functions.rtecall("setdebug",vars.$L_rc,
          debugmsg );

     You can specify one or more space-delimited parameters in debugmsg . In
     addition, you can also customize the output directory and the log file name for
     the debugging messages. If log:<directory and log file name> is omitted, the
     system outputs the debugging messages to the default server log file (sm.log).
     In the following example, the system writes debug messages about RDBMS
     connections of the current session and prints this information to the mysm.log
     file:

          var debugmsg="sqldebug:1 log:../logs/mysm.log";
          var rc=system.functions.rtecall("setdebug",vars.$L_rc,
          debugmsg );
          print(rc)

     In the following example, the system writes debug messages about RDBMS
     connections and Response Time Monitor (RTM) performance statistics of the


  current session and prints this information to the sm.log file.

      var debugmsg="sqldebug:1 rtm:3";
      var rc=system.functions.rtecall("setdebug",vars.$L_rc,
      debugmsg );
      print(rc)

3. Click Execute, and then click OK to exit.

               Note

             Your changes affect the current session only. The debugging
             process starts immediately after you executed the JavaScript.

4. Check the log file for relevant debugging information of the session or
  scheduler.
````
