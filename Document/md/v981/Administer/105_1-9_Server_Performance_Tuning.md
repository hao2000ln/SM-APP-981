---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.9 .. 1.9.4
printed_pages: 2640-2662
---

# 1.9 Server Performance Tuning

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.9. Server Performance Tuning

The Service Manager server includes a number of performance tuning options you can configure after installation. The
following table lists the performance tuning options you can enable or configure from a new development environment
installation.

Feature                                 Description                             Default state in new installations
Shared memory
                                        A configuration option that allows you  Enabled
                                        to specify how much of the Service
                                        Manager host's system resources are
                                        available for processes and threads

Related topics

Example: response time monitoring (RTM) output
Example: semaphore reports
Shared memory storage report


1.9.1. Defining batch sizes in the counters file

Administrators can allocate blocks of record identifiers for each servlet in horizontal and vertical scaling implementations. By
allocating record IDs in advance, administrators can reduce traffic between the Service Manager server and the RDBMS,
which improves overall system performance.

Note: Setting a batch size value replaces the fastcounters parameter from previous versions.

Administrators allocate record IDs in batches from the counters file. When you define a batch size, Service Manager
retrieves that number of ID keys from the RDBMS and stores the keys in shared memory for later use. Each time someone
creates a new record, the system assigns it an ID key from shared memory until there are no more IDs available. Once the
system exhausts its supply of IDs, it requests the next batch of IDs from the RDBMS. Allocating IDs in advance improves
performance, because retrieving the reserved ID keys from shared memory is more efficient than connecting to the RDBMS
and requesting a new ID key with every new record.

Batch file size recommendation

We recommend you set the batch file size to the number of new records you expect users to create in an hour divided by the
number of servers in the implementation. For example, if you expect to generate 200 incident records an hour and have only
one server in your implementation, then set the Batch Size value to 200. If your system consists of multiple servers, such as
in a horizontal scaling implementation, then divide the total records per hour by the number of servers. For example, a
horizontal scaling implementation with four servers only needs a batch size of 50 for each server to equal 200 incidents per
hour.

Note: In a horizontally scaled system, each server requests its own batch of ID keys. Since new records may be created from
processes running on different servers in a horizontal scaling implementation, the ID numbers of new records may not be in
sequential order. For example, process A on server 1 has reserved ID keys 1-100 and process B on server 2 has reserved ID
keys 101-200. The first record a user creates on process A will have ID 1, but if the very next record created comes from
process B, then the ID will be 101, not 2.

If you don't specify a batch size value, Service Manager uses the default batch size of 1 and fetches a new ID from the
RDBMS for each new record you create.

Example data from a counters file

TABLE_NAME COLUMN_NAME CURRENT_VALUE BATCH_SIZE

schedule schedule.id 2587564            1000

Related topics

Defining record identifiers in batches using the numbers file


1.9.2. Defining record identifiers in batches using the
numbers file

Administrators can define record identifiers and allocate those identifiers in batches from the numbers file for new
interactions, incidents, and changes. By allocating record IDs in batches in advance, administrators can reduce traffic
between the Service Manager server and the RDBMS, which improves overall system performance.

            Note

Currently the counters file is used by administrators to define the table and field where a new record number is
going to be stored. However, the numbers file is still available for those who previously chose to define record
numbers using the numbers file and are upgrading. This file has been enhanced to work more like the counters
file. For more information on the counters file, see the related topics.

When using the numbers file, administrators define the following:

     Batch size.
     Starting number.
     Identifying prefix for each module. For example, IM for Incident Management records.
     Whether numbers are going to increment or decrement.
     The table and field where the new numbers are to be stored.

When you define a batch size, Service Manager retrieves that number of ID keys from the RDBMS and stores the keys in
shared memory for later use. Each time someone creates a new record, the system assigns it an ID key from shared memory
until there are no more IDs available. Once the system exhausts its supply of IDs, it requests the next batch of IDs from the
RDBMS.

We recommend you set the batch file size to the number of new records you expect users to create in an hour, divided by the
number of servers in the implementation. For example, if you expect to generate 200 incident records an hour and have only
one server in your implementation, then set the Batch Size value to 200. If your system consists of multiple servers, such as
in a horizontal scaling implementation, then divide the total records per hour by the number of servers. For example, a
horizontal scaling implementation with four servers only needs a batch size of 50 for each server to equal 200 incidents per
hour.

In a horizontally scaled system, each server requests its own batch of ID keys. Since new records may be created from
processes running on different servers in a horizontal scaling implementation, the ID numbers of new records may not be in
sequential order. For example, process A on server 1 has reserved ID keys 1-100 and process B on server 2 has reserved ID
keys 101-200. The first record a user creates on process A will have ID 1, but if the very next record created comes from
process B, then the ID will be 101, not 2.

If you don't specify a batch size value, Service Manager uses the default batch size of 1 and fetches a new ID from the
RDBMS for each new record you create.

Example data from a numbers file

TABLE_NAME COLUMN_NAME CURRENT_VALUE BATCH_SIZE

schedule schedule.id 2587564               1000

Related topics

Defining batch sizes in the counters file


1.9.3. Lock Management

The locking mechanism in versions of Service Manager (SM) prior to version 9.31 had a locking mechanism that used a
multicasting to request and obtain a lock on a resource in Service Manager. This locking mechanism was implemented using
a Peer Lock in the JGroups toolkit. However, there were several issues with this implementation, which are addressed with
the new locking mechanism introduced in this document.

Issues in Service Manager Multicast Communication

Service Manager’s previous multicast implementation suffers from the following limitations:

• All nodes must be contacted by the node that's requesting the resource. This leads to high overhead per request.

• All nodes must give approval to a request, regardless of whether a node is using a resource or not.

• A node that doesn't respond represents a single point of failure for the system, even if that node has no other connection to
the resource or the requesting node.
• If one node doesn't respond, the request must be re-issued by the originating node, which increases overhead even
further.

• Nodes that are slow to respond will eventually be removed from the node cluster.

• Scalability is very poor.

• The potential for netstorms is high (wherein every node is attempting to request permission from every other node, leading
to n^2 requests).

New Locking Mechanism Overview

The new locking mechanism consists of a record entry for each locked resource in a database table. The new Lock table (for
exclusive locks) and LockShared table (for shared locks) have been created to house these records. See the following tables
for details on the structure and fields of the Lock and LockShared tables.

Note: The only difference between these two tables is the value in the TYPE field, and the primary key for the LockShared
table is a combination of the LOCKID, pID, tID, and IP fields.


Field              Type                 Null  The Lock Table  Default  Extra
LOCKID
                   varchar(600)         N             Key              LockID is a hex
                                                                       value of
                                                      PK               ResourceName.
                                                                       This ensures
RESOURCENAME varchar(200)               N                              that the
                                                                       ResourceName
TYPE               char(1)                                             field can be
                                                                       either case-
PID                float                                               sensitive or
                                                                       case-insensitive.
TID                float
                                                                       Logic lock ID
RADTHREADID float
                                                                       Exclusive /
SESSIONID          float                                               Shared lock

REASON             VARCHAR2(60)                                        The Process ID
USER               VARCHAR2(60)                                        that holds the
                                                                       lock.
HOSTNAME           VARCHAR2(60)
IP                 VARCHAR2(60)                                        The Thread ID
                                                                       that holds the
DEVICENAME         VARCHAR2(60)                                        lock.

                                                                       The Rad Thread
                                                                       ID that holds the
                                                                       lock.

                                                                       The session ID
                                                                       that holds the
                                                                       lock.

                                                                       Application
                                                                       private

                                                                       SM login user
                                                                       (For example,
                                                                       "falcon")

                                                                       The host that
                                                                       holds the lock.

                                                                       The IP address of
                                                                       the host that
                                                                       holds the lock.

                                                                       The device that
                                                                       holds the lock.

For the bg
scheduler thread,
the devicename
is "SYSTEM"

LOCKAT             datetime                                            When the lock is
                                                                       obtained.
This PDF was generated on May 23, 2026
                                                                               Page 229 of 251

Field      Type                         Null  Key  Default  Extra

STARTAT    datetime                                         When the lock
                                                            was requested.

RETRYCOUNT float                                            Number of times
                                                            the lock was
                                                            requested.

HEARTBEAT  float                                            Updated
                                                            periodically by
                                                            the lock holder.

SUSPECTED  float                                            Indicates another
                                                            node suspects
                                                            the lock holder
                                                            has failed.

SYSRESTRICTED CHAR(1)                                       Indicates no
                                                            modification
                                                            allowed for end-
                                                            users

SYSMODCOUNT float

SYSMODUSER VARCHAR(60)

SYSMODTIME datetime


                                              The LockShared Table

Field              Type                 Null  Key                   Default  Extra
LOCKID             varchar(600)
                                        N     PK                             LockID is a hex
                                                                             value of
RESOURCENAME varchar(200)               N                                    ResourceName.
                                                                             This ensure that
TYPE               char(1)              N     PK                             the
                                                                             ResourceName
PID                float                      PK                             field can be
                                                                             either case-
TID                float                      PK                             sensitive or
                                                                             case-insensitive.
RADTHREADID float
                                                                             Logic lock ID
SESSIONID          float
                                                                             Shared lock
REASON             VARCHAR2(60)
USER               VARCHAR2(60)                                              The Process ID
                                                                             that holds the
HOSTNAME           VARCHAR2(60)                                              lock.
IP                 VARCHAR2(60)
                                                                             The Thread ID
DEVICENAME         VARCHAR2(60)                                              that holds the
                                                                             lock.

                                                                             The Rad Thread
                                                                             ID that holds the
                                                                             lock.

                                                                             The session ID
                                                                             that holds the
                                                                             lock.

                                                                             Application
                                                                             private

                                                                             SM login user
                                                                             (For example,
                                                                             "falcon")

                                                                             The host that
                                                                             holds the lock.

                                                                             The IP address of
                                                                             the host that
                                                                             holds the lock.

                                                                             The device that
                                                                             holds the lock.

For the bg
scheduler thread,
the devicename
is "SYSTEM"

LOCKAT             datetime                                                  When the lock is
                                                                             obtained.


Field      Type                         Null  Key  Default  Extra

STARTAT    datetime                                         When the lock
                                                            was requested.

RETRYCOUNT float                                            Number of times
                                                            the lock was
                                                            requested.

HEARTBEAT  float                                            Updated
                                                            periodically by
                                                            the lock holder.

SUSPECTED  float                                            Indicates another
                                                            node suspects
                                                            the lock holder
                                                            has failed.

SYSRESTRICTED CHAR(1)                                       Indicates no
                                                            modification
                                                            allowed for end-
                                                            users

SYSMODCOUNT float

SYSMODUSER VARCHAR(60)

SYSMODTIME datetime

Lock Behavior

Locks may be either shared locks or exclusive locks. A shared lock allows multiple nodes to read the data from a resource.
An exclusive lock may only be obtained if any shared locks on a resource have been released by the nodes that hold them.

Exclusive Lock

The process by which a node obtains an exclusive lock is as follows:

   1. A node that requests an exclusive lock tries to insert a record into the Lock database table to see whether a resource is
     available.

   2. If there is no record for this resource in the Lock table, the resource is available and the node holder obtains the lock
     and inserts a record into the Lock table.

   3. If there is a record in the Lock table, the node will fail to obtain a lock.

To unlock an exclusive lock, the corresponding lock record is removed from the Lock table.

Shared Lock

The process by which a node obtains a shared lock is as follows:

   1. A node that requests a shared lock tries to insert a record into the Lock database table to see whether a resource is
     available.

   2. If there is no record for this resource in the Lock table, the node holder inserts a record into the Lock table and proceeds
     to step 4.

   3. If there is a record in the Lock table, the TYPE field of that record is checked. If the TYPE field is “Exclusive” the lock
     requested is rejected. If the TYPE field is “Shared,” proceed to step 4.

   4. The node tries to insert a record into the LockShared table. If the insertion is successful, the shared lock request is
     granted. If the insertion fails, the shared lock request is rejected.

To unlock a shared lock, the corresponding lock record is removed from the LockShared table. Then, the corresponding lock
record is removed from the Lock table unless other records share the same resource ID.


Note: There is no mechanism to escalate a Shared lock to an Exclusive lock. To obtain an exclusive lock on a resource, all
shared locks must be released.

Lock Retry, Timeout, and Heartbeat

Each process that requires a lock has a dedicated LockHandler thread to handle all lock related operations. When a process
needs to execute a lock/unlock operation, the process places a request in queue. The LockHandler reads the queue and
attempts to insert the appropriate records in to the Lock or LockShared tables. Additionally, the LockHandler will also return
the response to the process that has requested the lock.

The LockHandler will attempt to retry a “wait” lock request every two seconds until the lock attempt succeeds. If a “no-wait”
lock request is specified, the LockHandler will reattempt lock acquisition immediately.

     It is possible that a node may obtain a lock, and then fail to release the lock for several reasons. For example, the node
     could fail, or a problem with the network may prevent communication between the nodes. To prevent other nodes from
     waiting for an unresponsive lock owner, the following heartbeat mechanism has been implemented:
     When a process requests a lock and finds the lock is already held and the heartbeat value has not been updated, it sets
     the “Suspected” flag of the lock record in the database table to 1.
     The lock owner updates the heartbeat and checks the “Suspected” flag of the lock record in the database table every
     60 seconds.
     If the “Suspected” flag is set to 1, the lock owner sets the “Suspected” flag back to 0 and then increases the heartbeat.
     If the lock owner has failed to update the “Suspected” flag and heartbeat, the process that's waiting will periodically
     recheck the “Suspected” flag. After 10 minutes (the default value specified in the deadnodelocktimeout parameter), the
     lock is forcibly removed by deleting the lock record from the database table.

New Parameter

This new locking mechanism implements the deadnodelocktimeout parameter. This parameter specifies the amount of time
that must elapse before a process forcibly removes a lock from the Lock or LockShared table. By default, this parameter is
set to 10, which indicates that 10 minutes must elapse before a record is forcibly removed. 10 minutes is also the minimum
value for this parameter.

This parameter is specified in the sm.ini file. Changing the value of this parameter doesn't require a restart of the server.

Contents

     1 Issues in Service Manager Multicast Communication
     2 New Locking Mechanism Overview
     3 Lock Behavior

           3.1 Exclusive Lock
           3.2 Shared Lock
           3.3 Lock Retry, Timeout, and Heartbeat
           3.4 New Parameter


1.9.4. Scheduled processes

You can start RAD applications, known as scheduled processes, as unattended background processes. Scheduled processes
are also known as background agents, schedulers, processors, and background tasks. Scheduled processes run at set
intervals and check for specific conditions before executing a RAD application. Each scheduled process has one or more
schedule records that determine the conditions that must be met for the RAD application to run. You can start scheduled
processes from the Scheduler form.

List of scheduled processes

By default, Service Manager provides the following scheduled processes:


Scheduler Name                          Runs as Process Name or Names  Description
KMUpdate                                KMUpdate
SLA                                     sla                            This process checks for update
Sync                                    sync                           records and sends them to the index

agent                                   agent                          This process monitors service level
alert.processor                         alert                          agreements and processes alerts.
availability.startup                    availability
change.startup                          change                         This process identifies orphan
contract                                contract                       processes that were shut down
event.startup                           event                          improperly and frees up any
gie.startup                             gie                            resources they are using before
inactive.startup                        inactive                       stopping them.

linker.startup                          linker                         This process manages charts from
                                                                       stored queries.

                                                                       This process manages Incident
                                                                       Management log messages and
                                                                       alerts.

                                                                       This process manages asset
                                                                       availability and updates outage
                                                                       statistics.

                                                                       This process manages change events.

                                                                       This process manages contract
                                                                       events.

                                                                       This process manages asynchronous
                                                                       incoming events from the Eventin
                                                                       Queue.

                                                                       This is a legacy process from earlier
                                                                       versions of Service Manager that
                                                                       manages incoming Prim Events.

                                                                       If using the SM applications earlier
                                                                       than version 9.32, this process
                                                                       automatically logs off users who are
                                                                       inactive for a period of time.

                                                                       If using the SM applications version
                                                                       9.32 or later, this process is obsolete.
                                                                       A new inactivity timer mechanism is
                                                                       used, which no longer requires this
                                                                       process. Note that this new
                                                                       mechanism requires your SM server,
                                                                       applications, and web client to
                                                                       upgrade to version 9.32 or later. As
                                                                       long as your applications is earlier
                                                                       than version 9.32, the old mechanism
                                                                       is used.

                                                                       This process manages related calls to
                                                                       closed incidents.


Scheduler Name                          Runs as Process Name or Names  Description
lister.startup                          lister
marquee                                 marquee                        This process manages global
ocm.startup                             ocm                            variables in the globallist file.
printer.startup                         despooler
problem                                 problem                        This process manages static marquee
report.startup                          report                         messages.

scauto.startup                          scautod                        This process manages request
                                                                       events.
schedule.monitor                        schedule.monitor
                                                                       This process manages server-side
                                                                       print requests.

                                                                       This process manages IM alerts and
                                                                       messages.

                                                                       This process manages Report Writer
                                                                       reports and importing and exporting
                                                                       of reports.

                                                                       This process manages incoming and
                                                                       outgoing ServiceCenter Automate
                                                                       connections.

                                                                       This process monitors the invalid
                                                                       locks, clear these locks regularly, and
                                                                       send notification emails when
                                                                       encountering exceptions.

Related topics

Add an agent to the startup agent record
Configure the alert periodic schedule record
Restart stopped background processes automatically
Start a scheduled process
Stop a process


1.9.4.1. Access the schedule file

Applies to User Roles: System Administrator
You can access the schedule file to see a list of outstanding scheduled tasks your Service Manager system will perform.
Scheduled tasks are created either from agent initialization records or from triggers.
To access the schedule file, type the following command into the Service Manager command line:

  sch

The schedule.looksee.g form opens.

Related topics

Scheduled processes
Add an agent to the startup agent record
Configure the alert periodic schedule record
Restart stopped background processes automatically
Start a scheduled process
Stop a process


1.9.4.2. Add an agent to the startup agent record

Applies to User Roles: System Administrator
Adding an agent to the startup agent record allows Service Manager to automatically start a background process on startup.
To add an agent to the startup agent record:

   1. Type the following command into the Service Manager command line:

      info

  The info.startup.g form opens.
2. In the Type field, type the following:

startup

3. Click Search.
  The startup agent record opens.

4. Scroll to the first available open record in the Processor Information section.

5. Type or select the following agent information.

Field                                              Description
Name
                                                   Type the name you want to use for the agent. For
RAD Application                                    example, message1 . This name appears in the System
Class                                              Status list of background processes.
Wakeup Interval (secs.)
                                                   Type scheduler .

                                                   Type the name for the type of objects this processor will
                                                   handle. For example, message .

                                                   Type the number of seconds that you want the message
                                                   processor to wait before checking for messages. For
                                                   example, 60 .

   6. Click Add.
     Service Manager adds the Information record.

Related topics

Start a scheduled process
Stop a process
Scheduled processes


1.9.4.3. Configure the alert periodic schedule record

Applies to User Roles: System Administrator

To configure the alert periodic schedule record:

   1. Click Tailoring > Database Manager.
     The format.prompt.db.g form opens.

   2. In the Form field, type schedule.
   3. Click Search.

     Service Manager displays of a list of schedule forms.
   4. Click schedule. The schedule.g form opens.
   5. In the Name field, type Alert Periodic.
   6. Click Search.

     Service Manager opens the details for the Alert Periodic schedule record.
   7. In the Repeat Interval field, type the time interval you want Service Manager to wait between starting the alert periodic

     scheduled process.
     Type the time period in the following format: Dayshours:minutes:seconds. For example, 4 03:02:01 starts the alert
     periodic process every 4 days, 3 hours, 2 minutes, and 1 second.
   8. In the Application field, verify that Service Manager displays us.alert.periodic for the application name.
   9. Click Save
     Service Manager updates the schedule record updated.

Related topics

Scheduled processes
Add an agent to the startup agent record


1.9.4.4. Restart stopped background processes automatically

Applies to User Roles: System Administrator
You can use the following two parameters to restart stopped background processes automatically. Note that you must use
these two parameters in conjunction.

     Startup parameter: enableAnubisMonitor: Start Anubis monitor to check the status of the background scheduler thread.
     Startup parameter: anubisPollInterval: Specify the time interval for the Anubis thread to check whether any registered
     scheduler is alive. The default value is 15 and the unit is second.

            Note

           If the background scheduler is killed by either the system status or the operating system's Task Manager, this is
           considered as normal termination and Anubis will not take effect. Anubis will restart the background scheduler
           only when it terminates unexpectedly.

Related topics

Scheduled processes
Start a scheduled process


1.9.4.5. Start a scheduled process

Applies to User Roles: System Administrator
You can start a scheduled process from the system status scheduler. All scheduled processes run in the background at pre-
defined intervals.
To start a scheduled process:

   1. Click Miscellaneous > System Status. The system.status.list.g form opens.
   2. Click Start Scheduler. Service Manager displays a list of RAD applications that you can start.
   3. Double-click the RAD application you want to start.

     The system.status.lit.g form reopens, and Service Manager displays the message: System background scheduler:
     Process started at: DateTime.

Related topics

Scheduled processes
Restart stopped background processes automatically
Stop a process


1.9.4.6. Stop a process

Applies to User Roles: System Administrator
You can manually stop any running process from the system status form. If you want the server to automatically stop any
process after a pre-defined period of inactivity, use the Start Inactivity Timer form.
To stop a process:

   1. Click System Status. The system.status.list.g form opens.
   2. To stop a process, type k in the Command field.
   3. Click Execute Commands.

     Service Manager stops the selected process.
     Note: Service Manager stops the process without issuing a warning.

Related topics

Scheduled processes
Command line options for the system monitor
Inactivity timer
Restart stopped background processes automatically
Start a scheduled process


1.9.4.7. Unlock a deadlocked resource

Applies to User Roles: System Administrator
You can manually stop any running process from the System Status form. If you want the server to automatically stop any
process after a pre-defined period of inactivity, use the Start Inactivity Timer form.
To unlock a deadlocked resource:

   1. Click System Status > Show Locks.
   2. Review the list of system locks, and locate the deadlocked resource.
   3. To stop a process, type k in the Command field.
   4. Click Execute Commands.

     Service Manager stops the selected process.
     Note: Service Manager stops the process without issuing a warning.

Related topics

Inactivity timer
Stop a process


1.9.4.8. Set up background processes with high availability

Service Manager background processes support high availability and multiple Service Manager threads for a scheduled class
can work on multiple servers in parallel. With paralleled background processes, the Service Manager production system
processes the tasks in the scheduled queue more efficiently. In the event of server restart or server failure, the other servers
continue to work on the same class of tasks. For example, two SLA threads are running on background Server 1 and another
two SLA threads are running on background Sever 2. All SLA threads are processing the SLA Task Queue in parallel. If Server
1 is restarting or runs to error, Server 2 continues processing the SLA threads.

Here are some guidelines for your reference when setting up background processes with high availability:
   1. Add a set of backups of the original Service Manager servers that are running background process schedules.
   2. At a minimum, start each background process separately on two Service Manager servers (for example, Server 1 and
     Server 2) by using any methods as follows.
           Run the following command to start all background processes that are defined in the Background Process
           Initialization Registry with the name of startup. Go to System Administration > Ongoing Maintenance > System
           > Startup Information and then search for the startup schedule to view its contents.

                 sm -bg system.start

           Run the following command to start all background schedules that are defined in the Background Processor
           Initialization Registry with a specified name. Go to System Administration > Ongoing Maintenance > System >
           Startup Information to view all available schedules.

                 sm -bg scheduler.start <name of the Background Processor Initialization Registry>

           Run the following command to start a schedule of a specific class.

                 sm -bg scheduler <class of the background process> 60 0 -log:../logs/<class of the
                 background process>.log

   3. On any two servers, use the schedule.monitor scheduler to monitor the background processes.
     When multiple background processes are running in parallel, a schedule record may be locked during processing. If any
     error occurs in the background processes, the record lock can't be cleared and hence becomes invalid. The
     schedule.monitor scheduler can monitor the invalid locks, clear these locks regularly, and send notification emails when
     encountering exceptions.
     To start the schedule.monitor background processes, follow these steps:
        1. (Optional) Customize the email notification conditions by updating the ScheduleCustom Javascript. By default,
           the system sends an email notification to a recipient after completing each of the following actions.
                 Clean up a deadlocked schedule
                 Clean up schedule records which status is running
                 Clean up a schedule that incorrectly stops


  In addition, you can perform customizations to the EmailScheduleMonitor email template.
2. Click Ongoing Maintenance > System > Schedule Monitor to open the Schedule Monitor Configuration page.
3. Type or select the following information.

Field                                   Description
Notify Email
                                        Type an email address to which the system sends
                                        email notifications.

                                        Note: This function requires that you have an email
                                        infrastructure in place, including a properly
                                        configured SMTP server and configurations in some
                                        Service Manager files. See Email setup notes for more
                                        information.

Sleep Time                              Type or select a repeat interval. For example, type
Scheduled Class                         00:10:00 for a ten-minute repeat interval.
Next Run
                                        Type a name for the scheduled class. For example,
                                        sch-monitor .

                                        Next execution time of the schedule.

4. Click Save and OK.
5. Start the schedule.monitor scheduler by using any methods introduced in step 2.


1.9.4.9. Print background process information to log

Sometimes it's uneasy to troubleshoot background processes. Knowing the tasks that Service Manager processes is
important for trace reading. In this case, in addition to debugging with the rtm:3 parameter, you can use the ScheduleInfo
JavaScript to print background process information to log when the scheduler processing a schedule record.
By default, the content of the ScheduleInfo JavaScript may resemble the following.

  var log = getLog("ScheduleInfo");
  function print(scheduleFile){

      log.info("The scheduler begin to run.
  ScheduleName:"+scheduleFile["name"]+",ScheduleID:"+scheduleFile["schedule.id"]);
  }

By using this JavaScript, Service Manager prints the following background process information to the log file.

  $ cat sm.log|grep "The scheduler begin to run"
  1612239(1653063) 06/12/2023 03:36:17.362 JS I ScheduleInfo The scheduler begin to run.
  ScheduleName:Change Notify Sched,ScheduleID:6022090

To include more information, you can update the ScheduleInfo JavaScript by adding more field names from the schedule
table in the database dictionary. For example:

  var log = getLog("ScheduleInfo");
  function print(scheduleFile) {

         var vString=scheduleFile["strings"];
         log.info("The scheduler begin to run. ScheduleName:" + scheduleFile["name"] +
  ",ScheduleID:" + scheduleFile["schedule.id"]+ ", strings: " + vString.getText() );
  }

In this case, the printed background process information may resemble the following.

  1612239(1653061) 06/12/2023 05:19:17.701 JS I ScheduleInfo The scheduler begin to run.
  ScheduleName:message processor record,ScheduleID:6022113, strings: {"1", "email", , "", , ,
  "SOAP-Web", , "C10066"}
````
