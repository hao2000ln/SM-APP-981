---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.11.9 .. 1.11.14.1
printed_pages: 2926-2955
---

# 1.11.9 System status form

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.11.9. System status form

The system status form allows administrators to view and manage user sessions and
processes.

Actions possible

From the system status form a user with system administrator capabilities can:

     View a list of users logged in to the server
     View a list of processes running on the server
     Schedule a process to run at a later date and time
     Broadcast a message to all connected users
     Display a list of users who are locked out of the system
     Filter the system events displayed in the status list

           View all tasks: users and processes
           View active processes only
           View inactive processes only
           View users only
           View system processes only
     View the System Monitor for information about the system resources consumed
     by and connection properties used by each user and process running on the
     server
     View the list of system status command line options
     View the system status summary form

            Note

           There can be only one kmupdate process running at any time. Starting
           more than one kmupdate process causes unpredictable behavior on the
           search engine server.

System status list

The system status list contains the following columns.


Column                                  Description

Command                                 The text field where you can enter the
                                        commands s for status or k for kill
                                        process.

User Name                               The login and process names currently
                                        running on the server.

PID                                     The unique numeric process

                                        identification Service Manager assigns

                                        to each user and process.

Device ID                               The type of client or process running
                                        on the server.

Login Time                              The date and time the user session or
                                        process started.

Idle Time                               The length of time in
                                        days hours:minutes:seconds since the
                                        user session or process was active.

Save system monitor information

Applies to User roles: System Administrator
You can create a schedule process that exports information from the system monitor
on a regular basis.
To save system monitor information, follow these steps:

   1. Click System Status.
     The system status form opens.

   2. Click System Monitor.
     The System Monitor - Main User Info form opens.

   3. Click Capture.
     The Schedule Monitor form opens.


   4. In the Begin Time field, type or select the date you want to start capturing
     system monitor information.

   5. In the Repeat Interval field, type or select the next date you want to repeat
     capturing system monitor information.

   6. In Schedule Class field, type the name of the schedule class under which you
     want the background process to run.

   7. Click Schedule to start the background process.

View all processes running on the server

Applies to User roles: System Administrator

To view all processes running on the server from another form, follow the step below:

     Click System Status. The system status form opens showing a list of all
     processes.

To view all processes running on the server from the system status form, follow these
steps:

   1. Click Display Options.

   2. Click All Tasks.
     Service Manager displays a list of all processes running on the server.

View process CPU usage

Applies to User roles: System Administrator

To view process CPU usage, follow these steps:

   1. Click System Status.

     The system status form opens.

   2. Click System Monitor.

     The System Monitor - Main User Info form opens.
   3. Click CPU Info.

     Service Manager displays CPU usage including:

           Process name
           Last active time
           CPU time in seconds


           Priority
           Application running
           Memory used in bytes
           Statements evaluated

View process input and output usage

Applies to User roles: System Administrator

To view process input and output usage, follow these steps:

   1. Click System Status.

     The system status form opens.
   2. Click System Monitor.

     The System Monitor - Main User Info form opens.

   3. Click IO Info.

     Service Manager displays input and output usage including:

           Process name
           Statements evaluated
           Physical reads
           Physical writes
           Non-keyed queries
           Screen input and output

View saved system monitor information

Applies to User roles: System Administrator
You can create a schedule process that exports information from the system monitor
on a regular basis.

To view saved system monitor information, follow these steps:

   1. Click System Status.

     The system status form opens.

   2. Click System Monitor.

     The System Monitor - Main User Info form opens.
   3. Click View Capture.


     A list of captured data opens.

View shared memory statistics

Applies to User roles: System Administrator
To view shared memory statistics, follow these steps:

   1. Click System Status.
     The system status form opens.

   2. Click System Monitor.
     The System Monitor - Main User Info form opens.

   3. Click Shared Memory Info.
     Service Manager displays shared memory statistics of the server:
           Current Size
           Segment Allocation
           Large Block Allocation
           Unused Space
           Free Space Percent

View the active processes running on the server

Applies to User roles: System Administrator
To view the active processes running on the server, follow these steps:

   1. Click System Status.
     The system status form opens.

   2. Click Display options.
   3. Click Active.

     Service Manager displays a list of active processes running on the server.

View the inactive processes running on the server

Applies to User roles: System Administrator
To view the inactive processes running on the server, follow these steps:

   1. Click System Status.


     The system status form opens.

   2. Click Display options.

   3. Click Inactive.
     Service Manager displays a list of inactive processes running on the server.

View the status of a process

Applies to User roles: System Administrator

To view the status of a process, follow these steps:

   1. Click System Status.

     The system status form opens.

   2. Type the letter s in the Command field of the process whose status you want to
     see.

   3. Click Execute Commands.
     The operator status display form (operator.status.g) opens.

View the system monitor

Applies to User roles: System Administrator

To view the system monitor, follow these steps:

   1. Click System Status.

     The system status form opens.

   2. Click System Monitor.

     The system monitor opens displaying the following information:
           Process name
           Process identification
           Device name – displays the type of client connection or process
           Idle Time
           Application running
           Network address of the server
           Percent usage of physical memory
           Percent usage of CPU
           Thread identification


           Session identification
           License type

View the system processes running on the server

Applies to User roles: System Administrator
To view the system processes running on the server, follow these steps:

   1. Click System Status.
     The system status form opens.

   2. Click Display options.
   3. Click System.

     Service Manager displays a list of system processes running on the server.

View the total server usage

Applies to User roles: System Administrator
To view the total server usage, follow these steps:

   1. Click System Status.
     The system status form opens.

   2. Click System Monitor.
     The System Monitor - Main User Info form opens.

   3. Click Grand Totals.
     Service Manager displays total server usage of:
           CPU time
           Memory
           Statements evaluated
           Non-keyed query reads
           Physical Reads
           Physical writes
           Records retrieved
           C Code Strcpys (C Code string copies)

View the users logged into the server


Applies to User roles: System Administrator
To view the users logged into the server, follow these steps:

   1. Click System Status.
     The system status form opens.

   2. Click Display options.
   3. Click User.

     Service Manager displays a list of users logged into the server.

Related topics

Status and Notifications


1.11.10. Scorecard

Scorecard can provide administrators an overview of the in-time and visualized
Service Manager Server health information.
From the scorecard interface, a user with system administrator capabilities can view
the following information:

Landing page

The landing page is available for Web Client only.

Possible actions:

     Click Servlet Status to view the detailed system scaling structure and the health
     information

           Click a specific host name to view the detailed information of Server
           Instances and System Processes for the selected host
     Click License Status to view the detailed information of license usage and total
     available licenses for each license type
           Click a specific license type to view the user login history with the selected
           license type


Click User Information to view the detailed information of online user
distributions and user login history

     Click a specific client type to view the user login history with the selected
     client type
Switch between the view data table and the bar charts by clicking the and
icon (for Web Client only)

Click the   Cancel icon to exit
Click the   Refresh icon to synchronize the latest data and information

Click the   Export icon to export the servlet information as a formatted report

Click the   Settings icon to configure the Scorecard settings
Click the   icon to print the current page
Click the  icon or the icon to enlarge or reduce the size of the area

Scorecard settings

     For Web Client, you can click the Settings icon in the landing page to access
     the Scorecard settings.
     For Windows Client, you can click Settings in the Servlet status page to access
     the Scorecard settings.

You can configure the following settings for Scorecard:

Enable scorecard auto-refresh for audience
When enabled, the system automatically refreshes the data at certain minutes of the
interval.
By default, this setting is disabled.

Auto-refresh interval (minutes)
Set the refresh interval for the system to automatically refresh the data.
The default value is set as 10 (minutes).

Max number of records displayed in History of Online Users
Set the maximum number of records that can be displayed in History of Online Users.
The default value is set as 12.

Auto-save interval for User Information snapshot (minutes)
Set the save interval for the system to automatically save the User Information
snapshot.
The default value is set as 30 (minutes).

Auto-save interval for Servlet/License Status snapshot (minutes)
Set the save interval for the system to automatically save the Servlet/License Status


snapshot.
The default value is set as 60 (minutes).

Alarm threshold for floating license usage (%)
If the floating licenses consumed exceed the set threshold value, the Floating license
State value will be highlighted in red.
The default value is set as 80 (%).

Alarm threshold for named license usage (%)
If the named licenses consumed exceed the set threshold value, the Named License
State value will be highlighted in red.
The default value is set as 95 (%).

Alarm threshold for session usage (%):
If the sessions consumed exceed the set threshold value, the Used/Total Sessions
value will be highlighted in red.
The default value is set as 85 (%).

Servlet status

Web Client                              Page 270 of 384

This PDF was generated on May 23, 2026

Windows Client

You can have an overview of the system scaling structure and the health information
for each host in the Servlet Status tab:

     Host number
     Used/Total Sessions
     Load Balancer

     Hosts
     If you have multiple hosts, there will be multiple host cards displayed under the
     Hosts section. You can select and switch between different hosts. The Server
     Instances and System Processes information for the selected host are
     displayed.

           In the Web Client view, you can single-click to switch the host card. The
           selected host card is displayed with white background color and the other
           host cards are displayed with grey background color.
           In the Windows Client view, you can double-click the host card. The Server
           Instances and System Processes information will be refreshed upon your
           selection.


            Tip

           Here are some detailed definitions for your reference:

                CPU Cores: The number of CPU Cores for the current host
                CPU Usage (on host card): The percentage of CPU usage which
                indicates how much CPU capacity is in use by the current host
                Available/Total Memory(GB): Available memory refers to how much
                memory is not already being used by the host; Total memory refers
                to the total amount of memory that can be used by the host
                CPU Usage (on instances/processes): The percentage of CPU usage
                which indicates how much CPU capacity is in use by the current
                instance or process
                Memory Used: The memory usage of the current instance or
                process
                Note: The external load balancers aren't monitored or included in
                SM processes.

Possible actions:

     You can find out the number of available sessions for each instance

     Click the Cancel icon to exit
     Click the Refresh icon to synchronize the latest data and information
     Click the Export icon to export the servlet information as a formatted report
     Click the icon to print the current page

License status


Web Client

Windows Client                          Page 273 of 384

This PDF was generated on May 23, 2026

     You can have an overview of applied license information under the License
     Status tab.

           Current license usage for each license type
           Total number of available license for each license type
     Possible actions:

           Click the Cancel icon to exit
           Click the Refresh icon to synchronize the latest data and information
           Click the Export icon to export the license information as a formatted
           report
           Click the icon to print the current page
           Switch between the view data table and the bar charts by clicking the
           and icon (for Web Client only)

User information

Web Client                              Page 274 of 384

This PDF was generated on May 23, 2026

Windows Client

     You can have an overview of online user distributions and user login history
     under the User Information tab.

           Client type: The number of users that logged in to the system based on
           each client type
           History of online users: The total number of users logged in at particular
           point of time

                 When you click a specific record, the data of Client type will display
                 the online user distributions at the selected point of time
           User login history: When any user logs in, the information will be recorded
           in the login history for tracking purposes
     Possible actions:
           Use fuzzy search to filter the user login history by selecting:
                 Host name


     Process ID
     License type
     Client type
     Username
Select one or multiple login records and kill the processes

Click the Cancel icon to exit
Click the Refresh icon to synchronize the latest data and information
Click the Export icon to export the license information as a formatted
report
Click the icon to print the current page
Switch between the view data table and the bar charts by clicking the
and icon (for Web Client only)


1.11.11. Command line options for the
system monitor

Users with the system administrators capability word can use the system monitor
form to stop or view additional information about any running process on the server.
The system monitor command line has the following options:

Command line option                     Description
k
s                                       Use this command to stop a process.

                                        Use this command to view status
                                        information about the process or user.
                                        You can also use this command to
                                        broadcast a message to a particular
                                        user.

Related topics

Stop a process
Broadcast messages


1.11.12. System alerts

System alerts are system events that have passed a pre-defined threshold and that
Service Manager writes to the server log (default: sm.log). System alerts contain
information about the health and performance of the Service Manager installation.
System administrators can define the conditions that trigger system alerts from the
Service Manager initialization file.

The server log lists all the system events that have passed a pre-defined threshold.
System administrators can review the server log to determine the health and
performance of their Service Manager installation. By default, the server log is
located in the <Service Manager>\Server\logs folder. System administrators can
change what information Service Manager writes to the server log as well as the
location of the log from the Service Manager initialization file.

System alert message format

Service Manager writes system alerts to the server log using the following format:

[Process ID] [Date and time] [Alert category]-[Alert type]-[Alert item], [Alert text]


Alert format                            Description

[Process ID]                            This is the unique numerical
                                        identification of the process that
                                        generated the system event.

[Date and time]                         This is the date and time that Service
                                        Manager recorded the system alert.

[Alert category]                        This is one of the four basic alert
                                        categories. For more information about
                                        alert categories see the list of system
                                        alerts.

[Alert type]                            This is a numerical value that describes
                                        the exact conditions that caused
                                        Service Manager to record the system
                                        alert. For more information about alert
                                        types see the list of system alerts.

[Alert item]                            This is the application, resource, or
                                        user that generated the system event.

[Alert text]                            This is a text description of the user
                                        and actions that generated the system
                                        event.

Sample system alert messages

The following are sample system alert messages:

1712 11/03/2003 07:59:00 Performance-1-company, Full File Scan
for
query involving fields {show.company} ; user(falcon),
application(display), panel(show.rio)
1712 11/03/2003 07:59:06 Performance-2-cm3t, Partial File Scan
for query
involving fields {header,parent.change, header,open} ;
user(falcon),
application(display), panel(show.rio)


Set a system alert parameter

Applies to User roles: System Administrator
To set a system alert parameter, follow these steps:

   1. Stop the Service Manager server.
   2. Open the sm.ini file in a text editor.

     This file is in your Service Manager RUN directory.
   3. Type the system alert parameters you want to add.
   4. Save your changes.
   5. Restart Service Manager.

     Service Manager uses your new system alert parameters.

List of system alerts

Service Manager uses the following alert categories.

     Limits
     Mapping
     Performance
     Stalled

Each alert category has a list of alert types that describe what system event
conditions triggered the system alert.

Limits

 Alert type                                                                                     Service Manager 9.81
 Limits-1
                                        Description
 Limits-2
 Limits-3                               The database pool is nearly full. The
 Limits-4                               alert item lists the pool number. This
                                        alert type is obsolete in Service
Mapping                                 Manager.

                                        A user's virtual memory usage exceeds
                                        the alertvirtuallimit parameter. The alert
                                        item lists the name of the user.

                                        A user's CPU usage exceeds the
                                        alertcpulimit parameter. The alert item
                                        lists the name of the user.

                                        The system shared memory is critically
                                        close to full.

 Alert type                                                                                     Service Manager 9.81
 Mapping-1
 Mapping-2                              Description

 Mapping-3                              A database field has been truncated
                                        and mapped in a compressed format.
 Mapping-4                              The alert item lists the truncated file
                                        and field names.
Performance
                                        There is a duplicate mapping for a
                                        single SQL field. The alert item lists the
                                        file name with the duplicate mapping.
                                        The alert text lists the field names with
                                        the duplicate mapping.

                                        A query could not be translated into
                                        SQL. The alert item lists the file name.
                                        The alert text lists the query and the
                                        function that could not be translated
                                        into SQL.

                                        There is a field that can't be used in an
                                        SQL query because of its data type.
                                        The alert item lists the file and field
                                        names.

Alert type                                                                                      Service Manager 9.81
Performance-1
Performance-2                           Description

Performance-3                           There has been a non-keyed query
Performance-4                           request that exceeds the alertquerylimit
Performance-5                           parameter. The alert item lists the name
                                        of the file that was the target of the
                                        query. You can avoid this alert by
                                        creating a key to satisfy the query.

                                        There has been a partially keyed query
                                        request. The alert item lists the name of
                                        the file that was the target of the query.
                                        You can avoid this alert by creating a
                                        key to satisfy the query or set a
                                        reasonable value of environment
                                        parameter alertquerylimit.

                                        The system has been waiting for a
                                        query to return a result but the query
                                        has exceeded the alertwaitlimit
                                        parameter. The alert item lists the name
                                        of the lock.

                                        The system has been waiting for a lock
                                        to release a resource but the lock has
                                        exceeded the alertholdlimit parameter.
                                        The alert item lists the name of the
                                        lock.

                                        There has been a query request that
                                        exceeds the alertquerylimit parameter.
                                        The alert item lists the name of the file
                                        that was the target of the query. You
                                        can avoid this alert by creating a key to
                                        satisfy the query.


Alert type                              Description
Performance-6
                                        There has been a query request that
Performance-7                           exceeds the alerthitratio parameter.
                                        The alert item lists the name of the file
                                        that was the target of the query. You
                                        can avoid this alert by creating a key to
                                        satisfy the query.

                                        When building a global list, the system
                                        displays an information message if the
                                        global list contains more than 500
                                        items.

Stalled

Alert type                              Description
Stalled-1
                                        Obsolete alert. This functionality has
Stalled-4                               been removed.

                                        Obsolete alert. This functionality has
                                        been removed.

System alert filters

System administrators can create system alert filters to hide alert messages about
system events that they deem aren't detrimental to the system. System administrators
can define system alert filters from the Service Manager initialization file. To filter out
a system event, system administrators can add the alertfilters parameter to the
particular event in the initialization file.

Related topics

Server log file


1.11.13. System events

Service Manager continually monitors its performance and uses the server log
(default: sm.log) to track events. These events include information about the following
activities and databases:

     SQL database
     Locked resources
     Virtual or shared storage

Service Manager writes information about system events to the server log. Each
system event has its own condition that triggers Service Manager to write a message
to the server log. System administrators can configure these system event conditions
from the Service Manager initialization file. In addition, system administrators can also
define how often Service Manager checks for system events by configuring the alert
periodic schedule record.

Related topics

System alerts
Configure the alert periodic schedule record


1.11.14. Service Manager email solutions

The following table describes how the Smart Email solution handles Service Manager
emails.

Smart    Interna  Runnin                Conne     Routin   Operat  Fetch    Suppo
Email    l/Exter  g                     ction     g        ing     data     rted
         nal      enviro                to SM     directi  syste   from     email
         Produc   nment                 server    on       m                format
         t

Inboun   Interna  In                    Conne     Receiv   Windo   Extern   Plain
d email  l        Servic                cts       es       ws and  al mail  text,
                  e                     directly  emails   Linux   server   HTML
                  Manag                 to the    to               s        email
                  er                    SM        other            throug
                  Server                server    mail             h
                                                  server           Servic
                                                  s                e
                                                                   Manag
                                                                   er
                                                                   Integra
                                                                   tion
                                                                   Suite
                                                                   (SMIS)

Outbou   Interna  In                    Conne     Sends    Windo   event    Plain
nd       l        Servic                cts       SM       ws and  out      text,
email             e                     directly  emails   Linux   table    HTML
( Java            Manag                 to the    to                        email
Mail )            er                    SM        other
                  Server                server    email
                                                  system
                                                  s


1.11.14.1. Smart Email Overview

The Smart Email solution provides the ability for users to interact with Service
Manager through email messages. The supported features are as follows:

     Automatic record creation based on an inbound email
     Automatic reply with links to solutions suggested by virtual agent Sage
     Email-based approval for service catalog items
     Email-based commenting
     Integrating with Smart Ticket
     Supporting Hot Topic Analytics for interactions or incidents created from email

The following diagram provides an overview of the Smart Email solution.

As shown in the diagram, users can interact with Service Manager by using emails:

     When a user sends an email to Service Manager, the email is regarded as an
     inbound email to the system. Based on the inbound email, Service Manager can
     create or update a record. If Smart Analytics is enabled, the system
     automatically categorizes and assigns the record, and then the virtual agent
     replies to the user with the suggested solutions. For more information, see
     Automatic record creation.
     When Service Manager sends an email to a user, the email is regarded as an
     outbound email from the system. In the outbound email, suggested solutions and


     action buttons are embedded for the user to perform any appropriate task by
     replying the email. For more information, see Automatic record update.

The following diagram is an example about how the smart email solution is configured
and how it works:

Related topics

Automatic record creation
Automatic record update
Smart Email best practices
Set up inbound email
Configure Smart Email settings
````
