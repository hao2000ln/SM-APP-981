---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.5.2 .. 1.5.2.4
printed_pages: 1304-1338
---

# 1.5.2 Areas of maintenance tasks

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.5.2. Areas of maintenance tasks

System maintenance tasks described in this section are categorized into reactive and
proactive areas.

Reactive areas

Reactive maintenance areas are described in the following table.

Area                                    Description
Availability monitoring
Performance monitoring                  Monitors the availability of the Service
Functional monitoring                   Manager system or a service that it
Queue monitoring                        provides

Web tier health monitoring              Monitors acceptable performance of
Operation                               the Service Manager system or a
                                        service that it provides

                                        Monitors the correct execution of
                                        functionalities

                                        Monitors queue tables: Queues may
                                        get into a stuck state, or be processed
                                        slowly. Also, queue items may fail to be
                                        processed.

                                        Monitors the Service Manager web tier
                                        health status.

                                        These are tasks for starting a Service
                                        Manager instance, shutting it down, or
                                        running it in quiescence mode for
                                        maintenance.

Proactive areas

Proactive maintenance areas are described in the following table.

 Area                                                                                           Service Manager 9.81
 Configuration
                                        Description
 Fallback strategy
 Documentation                          Setup and base configuration of the
 Change control                         Service Manager instance, including
 Capacity planning                      setup regarding performance and
 Cleanup                                security
 Online support
                                        Fallback strategies to address
Related topics                          situations of partial or total loss of
                                        service
Service Manager maintenance tasks
                                        Documentation of system
                                        configuration, changes, and fallback
                                        strategies

                                        Applying patches, hotfixes, and new
                                        tailoring

                                        The anticipation of changes in load or
                                        functionality enhancements

                                        Cleanup activities that guarantee an
                                        efficient and easy-to-maintain system

                                             Using the Software Support
                                             website
                                             Staying up to date with the
                                             company's security alerts and
                                             news
                                             Sharing knowledge with and
                                             learning from user communities


1.5.2.1. Availability monitoring tasks

The following table lists maintenance tasks that a System Administrator needs to
perform in the Availability Monitoring area. For information about other areas, see
Areas of maintenance tasks.

Event or frequency                      Task                       Automatable
Daily
                                        Monitor log information Yes
Daily                                   for availability related
                                        messages
Daily
Daily                                   Monitor background         Yes
Daily
Daily                                   processor activities

Daily                                   Monitor web tier health No
Weekly
Quarterly                               Check servlet utilization No

After web tier update                   Check system reports Yes

                                        Monitor background         Yes

                                        processor activities

                                        Check servlet utilization

                                        Check license expiration Yes

                                        Check SSL certificate      No

                                        expiration

                                        Check signatures           Yes

                                        expiration of web client

                                        jar files

Related topics

Areas of maintenance tasks


1.5.2.1.1. Monitor log information for
availability related messages

This section provides guidelines on how to monitor the server log and dbdicts
containing log information for availability related messages.

Monitor the server log for availability related
messages

Monitor the following types of messages:
     Alert messages
     Error messages about exhausted resources
     Proactive Memory pool messages

Alert messages

Service Manager writes configurable alert messages to the log file for availability
monitoring. For more information, see System alerts.

Error messages about exhausted resources

There are two kinds of memory related error messages:
     Out of memory error messages: A session requests memory inside one of the
     memory pools; however, as resources are exhausted, the request can't be
     served. This causes the RAD thread, the session, or the entire servlet to fail
     immediately.

       Shared memory

       RAD stack

       Java Heap

       Process Native Heap


     Proactive memory related messages. These messages are either pure
     informational or related to proactive mechanisms to prevent out of memory
     situations.

       Shared memory

       RAD stack

       Java Heap

       Process Native Heap

For more information, see Monitoring native heap and Java heap memory.
Resource exhaustion problems include the following:

     Shared memory resources exhausted
     When a block of shared memory is requested, there is no more shared memory
     available, the session can't continue and terminates. The sm.log file contains
     messages about the failed allocation and a shared memory report.
     For more information, see Special parameters: reportshm.
     Rad stack exhausted
     The Rad Stack is required by System Language and resides in process private
     memory. Each RAD thread (that relates to open tabs in the Service Manager
     Windows or Web client) maintains a RAD stack. The agstackl parameter controls
     the number of stack frames.
     When the Rad Stack is exhausted, the RAD thread is terminated. The cause is
     most probably a recursive implementation. Increasing the number of stack
     frames typically only causes the issue to appear less frequently, while removing
     the recursive implementation is required for a permanent fix.
     The log file is showing a message of the failed request and an RAD application
     stack trace.
     For more information, see Startup parameter: agstackl.


Process private memory exhausted
When a RAD application requests a block of memory, which can't be served, the
session terminates with RAD application stack trace.
When a JavaScript function running out of memory, the function is not reaching
the return statement, so the returned value is null. A message is printed to the
log file, including JavaScript and RAD stack. The session, however, is not
terminated.
Example:

  JS W Print ScriptTrace for OutOfMemory
  JS W MemWaster@'MemWaster':2,
  RAD W
  display:process.option:1,se.view.engine:display.go,se.list.e
  ngine:call.view.engine,se.search.engine:call.list.engine,dat
  abase.engine:call.search.engine.1,database:call.database.eng
  ine,

For more information, see the following help topics:
Service Manager Programming
Parameter: log4jDebug
Monitoring memory in Service Manager processes
Monitoring native heap and Java heap memory
Java Heap exhausted
When a Java heap memory request can't be served, the session terminates with
java exception stack.
The java heap is used by the servlet to communicate to clients, integrations, or
other servlets. The size of the request or response document is the biggest
driver for java heap memory requirements.
Resolving these issues requires analysis of the actual document and the
implementation. A typical cause is that huge requests or response documents
are required by integrations. A mechanism implemented to replace huge
requests is web services pagination.
For more information, see Retrieve data from Service Manager using Pagination.


Proactive Memory pool messages

Proactive memory pool messages include the following:

     Shared memory warnings
     When the first process of Service Manager is started on a host, it creates the
     shared memory. At this time, it compares the configured size in sm.ini with the
     minimum acceptable value of 8000000 (and automatically adjusts) and the
     recommended size.
     Example messages:

          RTE W Shared memory size of 4000000 too small, adjusted to
          8000000
          RTE W The shared memory size 8000000 is less than the
          recommended size 134217728

     RAD stack warnings
     Service Manager logs warning messages when the RAD stack allocation
     exceeds a threshold.
     Example:

          RTE I RAD stack is 72% used, please exit out of current
          application.

     Process private memory warnings
     Service Manager monitors the native heap memory allocation and writes
     proactive messages to the log file before all resources are exhausted. In
     addition, the servlet will switch to a low memory mode to avoid total exhaustion
     and the servlet from completely terminating.
     When a servlet moves into low memory mode and is no more accepting new
     sessions and application threads for native memory until the garbage collection
     has released memory again.
     When the allocation of native memory increases for a session, information about
     the allocated memory size is printed to the log file.
     Example:


  RTE I -Memory : S(392328) O(165668) MAX(1001004) - MALLOC's
  Total(4136)

Here, the MAX value is relevant: Average here is for typical user sessions below
20M; if 40M is exceeded by a single session, investigations should be started.
Possible causes are that users open a very large number of tabs in the client, or
memory-intensive JavaScript implementations, or other problems.
More frequent trace information is written to sm.log when trace parameter rtm:2
is turned on.

            Note

           Process native memory monitoring and the proactive messages
           aren't implemented in Service Manager running on unix operating
           system.

For more information, see Avoiding variable declaration inside a loop.
Java Heap warnings
Service Manager monitors the native heap memory allocation and writes
proactive messages to the log file before all resources are exhausted. In
addition, the servlet will switch to a low memory mode to avoid total exhaustion
and the servlet from completely terminating.
When a servlet moved into low memory mode and is no more accepting new
sessions and application threads for java heap memory until garbage collection
released memory again.
In order to monitor java heap for low memory, set the following parameter in
sm.ini:

  log4jdebug:com.hp.ov.sm.common.oom.LowMemoryHandler

Example of low memory handler log messages:


          JRTE I Starting Memory Monitoring thread to check for memory
          every 15 seconds.
          JRTE D JavaMemory Max(123928576) Used(1011872) %Used(0.0)
          JRTE D NativeMemory Max(2147352576) Used(358121472)
          %Used(16.0)
          JRTE W Process Low on Java Memory. Max(123928576)
          Used(119603800) PercentUsed(96.0)
          JRTE W Send error response: Server is running low on memory
          try again.
          JRTE W Send error response: Server is running low on memory
          try again.
          RTE I Process Java Heap Memory is back to normal range.
          JRTE I Process Java Memory. Max(123928576) Used(4256640)
          PercentUsed(3.0)

            Note

           For detailed explanation of Garbage collection and Memory Pools, refer to
           the Oracle documentation:
           https://www.oracle.com/java/technologies/javase/javase-core-
           technologies-apis.html

Monitor dbdicts with log information for availability
related messages

Review on a daily basis the following dbdicts, which contain log information, for error
messages:

     msglog
     syslog
     SMISlog
For more information, see Dbdicts containing log information.

Related topics

Availability monitoring tasks
Introduction
Monitoring memory in Service Manager processes


Monitoring native heap and Java heap memory
Parameter: log4jDebug
Dbdicts containing log information


1.5.2.1.2. Monitor background processor
activities

When checking which system processes are active in System Status, it is a good idea
to maintain a list of those background processes that should always be running. If one
of these processes is not running, check the sm.log file to see if there are any
messages as to what caused the interruption.

The background processes can be monitored by the status monitor.

The important column in the following table is Idle time.

Idle time                               Interpretation and administrative
> Sleep time                            action

00:00:00                                The process is not continuing after its
                                        sleep interval. Normally, killing and
                                        restarting the background process
                                        should resolve this issue.

                                        If the idle time is exactly 00:00:00,
                                        press the Refresh button several times
                                        to see if the idle time is increasing. If
                                        not, the process is very busy or
                                        hanging.

Background processes executing the tasks specified in records of the schedule
dbdict are called background schedulers. For more information, see Monitor the
schedule dbdict and background schedulers.

Note

The background process called “sync” is especially important for
availability: It deallocates resources of other sessions when they
terminate. If this process is not running, Service Manager will still run for a
while, resource requests can't be served anymore as all resources are
allocated. Exactly one instance of the “sync” process should be running
on each host of the Service Manager system.

Related topics


Availability monitoring tasks
Scheduled processes


1.5.2.1.3. Monitor web tier health

The following table lists the API URLs that a System Administrator can use to monitor
the web tier health status.

API URL                                 Task  Automatable
/api/healthz
                                        Use this URL to return No
/api/healthz/profile                    the health status of the
/api/healthz/profile/html               Service Manager web
                                        tier. The HTTP Status
                                        200 message indicates
                                        that the services are
                                        ready. If you have
                                        deployed a load balancer
                                        (such as the F5 HWLB)
                                        for the web tier, you can
                                        use this URL to monitor
                                        the web tier health
                                        status.

                                        Use this URL to return No
                                        the web tier profile in the
                                        *.json format. A system
                                        administrator can access
                                        this URL only after
                                        he/she logs in to Service
                                        Manager.

                                        Use this URL to return No
                                        the web tier profile in the
                                        *.html format. The
                                        content automatically
                                        refreshes in every five
                                        seconds. A system
                                        administrator can access
                                        this URL only after
                                        he/she logs in to Service
                                        Manager.


Related topics

Service Manager maintenance tasks


1.5.2.1.4. Monitor server health

The following table lists the API URLs that a System Administrator can use to monitor
the Service Manager server health status.


API URL                                 Task                       Automatable

/mbeanclient-                           Use this URL to check      No
<version>/Action?
getattribute=AcceptNew                  whether Service
Connection
                                        Manager can accept new

                                        connections or not.

                                        When returning true ,

                                        Service Manager can

                                        accept a new

                                        connection.

                                        Sample usage:
                                        /mbeanclient-
                                        <version>/Action?
                                        getattribute=AcceptNew
                                        Connection

                                        Note: This API only
                                        checks the connection
                                        status of the node that
                                        the URL is connecting to.
                                        Do not connect to the
                                        load balancer node.

/mbeanclient-                           Use this URL to return     No
<version>/Action?
getattribute=State                      the health status of the

                                        Service Manager

                                        services. RUN indicates

                                        that the services are

                                        ready.

                                        Sample usage:
                                        /mbeanclient-
                                        <version>/Action?
                                        getattribute=State


            Note

           To make the mbeanclient API URL effective, you must add the
          JVMOption999:../../lib/mbeanclient-<version>.war parameter to the
           sm.ini file.

Related topics

Service Manager maintenance tasks
Configure an HWLB Health Monitor for the Service Manager server


1.5.2.1.5. Check servlet utilization

Review the sm.log file or system status from time to time to check the number of
concurrent users or connected processes and the servlet utilization. If necessary, add
another servlet to the group dynamically or add another servlet line to the sm.cfg file
for the next recycle of Service Manager. On the Windows operating system, when
starting a servlet dynamically from a DOS prompt, it's imperative to not sign out of the
server machine. The reason is that this would stop the servlet that you just started.
Ensure you have set the system to lock the desktop and requires authentication to
unlock.

Related topics

Availability monitoring tasks


1.5.2.1.6. Check system reports

The System Administrator should execute these system reports multiple times a day
or use a scheduled OS script to execute them, to monitor the current system status:

     sm -reportshm: Verify that the “Free Space” doesn't fall below 25 percent to
     avoid shared memory related outage.
     sm -reportcache

Related topics

Availability monitoring tasks
System reports
Special parameters: reportshm
Special parameters: reportcache


1.5.2.1.7. Check license expiration

The license expiration of the Service Manager server may cause issues when
restarting the system.
At any time, the license report provides information about license expiration:

  sm -reportlic

When the expiration date is approaching, Service Manager proactively sends warning
messages at user login to warn for this situation:

Related topics

Availability monitoring tasks
License report (reportlic)


1.5.2.1.8. Check SSL certificate expiration

An expired SSL certificate can cause outage. The administrator should periodically
verify that the certificate is not about to expire in order to take proactive actions.

Related topics

Availability monitoring tasks


1.5.2.1.9. Check signatures expiration of
web client jar files

The code files of the Service Manager web client (jar files) are code signed.
Depending on the security level for java in the browser, jar files with expired signature
certification can't run. The recommended fix for this issue is to upgrade the web
client to the latest version.
For that reason, the Service Manager administrator should proactively get a list of
these expiration dates.
You can use the jarsigner tool of the Java JDK to display the expiration date of a jar
file.

  <JDK directory>\bin\jarsigner.exe -certs -verify -verbose <web
  application server directory>\webapps\webtier-9.80\ext\<jar
  file>

Only the first listed certificate expiration date is relevant.
For information on how to verify whether a Java certificate has expired or not, refer to
the Oracle documentation.

Related topics

Availability monitoring tasks


1.5.2.2. Performance monitoring tasks

The following table lists maintenance tasks that a System Administrator needs to
perform in the Performance Monitoring area. For information about other areas, see
Areas of maintenance tasks.

Event or frequency                      Task                 Automatable
Daily
Daily                                   Review the server log for Yes
                                        performance messages
Weekly
Weekly                                  Analyze dbdicts      Yes

Daily                                   containing log

Daily                                   information
Quarterly
                                        Check view and favorite No
                                        creation

                                        Check the usergrid table Yes
                                        for changes to user’s
                                        record lists

                                        Monitor system reports Yes
                                        for performance related
                                        information

                                        Performance monitoring Yes
                                        tasks

                                        Monitor the dbdicts  Yes

                                        purging progress

Review logs for performance messages

This task includes the following subtasks.

Review the server log for performance messages

The Service Manager server log files contain a lot of information about system
availability and performance.


Review the output produced by alert messages and proactively activated trace
parameters. The alert log messages provide information about potential performance
issues, or other specific situations that require attention.

Analyze dbdicts containing log information

Service Manager maintains multiple dbdicts with log information for different
purposes. Among them, the reportLogs dbdict is important for performance
monitoring.

It is important for the System Administrator to review the performance log file and see
if a task is slow. Each reporting query may take a different amount of time to execute,
and therefore manual review is required.

Look for report queries that are often more complex than other queries and are
expected to take more time for execution. It is therefore not possible to define a one-
fits-all threshold.

It is important to identify long-running reports, and learn their business requirements
and implementation. Based on this knowledge, the System Administrator can decide
on how to act on excessive report execution times or the trends that are identified.

Check view and favorite creation

If users are given the ability to create views and favorites (public or private), the
System Administrator will need to put into place a process where the administrator
can check the records in the inbox table regularly to ensure that the queries and sort
sequences used in the views and favorites are properly indexed. If a sort sequence is
specified, the fields used in the sort sequence should be part of the index.

Additionally, if the administrator finds multiple users creating the same private inbox,
the administrator needs to consider creating a public inbox for all users in a query
group (all users that have this inbox created). By doing this, the administrator will be
able to keep the number of records in the inbox table under control. For performance
tuning of queries, refer to Performance of dbdicts and tables.

Knowledge required for system maintenance > Performance of dbdicts and tables.

Check the usergrid table for changes to user’s
record lists

Check the usergrid table to see what users are saving as their qbe formats. If you find
that many users have added the same field to a particular QBE, you may want to
consider adding the field to the default QBE format. Remember to delete the
appropriate records from the usergrid file once you have modified the format.


Monitor system reports for performance related
information

Monitor the following system report on a daily basis.

Parameter                               Description
sm - reportcache
                                        If the average slot depth exceeds 20,
                                        consider reconfiguring the shared
                                        memory cache size by the cache_slots
                                        parameter. For more information, see
                                        Startup parameter: cache_slots.

Monitor the server’s performance statistics

Check for memory usage and CPU usage peaks to ensure smooth operation. Over
time, with more concurrent users logging in, it may be necessary to add more
memory or more CPU, or adding more servlets to serve the increasing user
community.

Monitor the dbdicts purging progress

Data, queue, or log dbdicts containing a large number of records can impact system
performance, and therefore archiving and purging should be configured.

Monitor the number of records in these dbdicts frequently to supervise cleanup
activities.

Related topics

System alerts
Trace parameters that can be proactively activated
Dbdicts containing log information
Activate proactive trace parameters
Purge or archive data records
Purge queue records
Purge logs


1.5.2.3. Functional monitoring tasks

The following table lists maintenance tasks that a System Administrator needs to
perform in the Functional Monitoring area. For information about other areas, see
Areas of maintenance tasks.

Event or frequency                      Task                    Automatable
Quarterly                                                       No
Quarterly                               See Validate timezone   No
Weekly                                  records below           No

                                        See Update the
                                        calholiday table below

                                        See Review the
                                        reportscheduleHistory
                                        dbdict below

Validate timezone records

Review and update timezone records for approaching changes to the start or end
dates of daylight savings. Additionally, verify that the tzfile records for your time zone
are built far enough into the future.

Update the calholiday table

Verify that the holidays table (the calholiday dbdict) is maintained. As holidays are
used to calculate SLA alerts and breaches, make sure this table is always maintained
at a minimum from now until the longest SLA agreement.

Review the reportscheduleHistory dbdict

When using the Reporting Module, reporting tasks create reports and dashboards and
send notifications. All these tasks are recreated in the reportscheduleTasks dbdict
and after execution moved into the reportscheduleHistory dbdict.

Review this dbdict for tasks that were not executed successfully. It is helpful to add
the “Succeed” field by using the Modify Columns option to the record list view. After
review, decide on corrective actions and cleanup.

Related topics


Areas of maintenance tasks
Time zones
Holiday records


1.5.2.4. Queue Monitoring tasks

The following table lists maintenance tasks that a System Administrator needs to
perform in the Queue Monitoring area. For information about other areas, see Areas
of maintenance tasks.

Event or frequency                      Task                     Automatable
Daily
                                        Monitor the schedule     Yes
Daily
Daily                                   dbdict and background
Daily
                                        schedulers

                                        Monitor the eventin and Yes
                                        eventout dbdicts

                                        Monitor the SMIS task Yes
                                        queue

                                        Monitor                  Yes

                                        reportscheduleTasks and

                                        reportscheduleHistory

Related topics

Service Manager maintenance tasks
Areas of maintenance tasks


1.5.2.4.1. Monitor the schedule dbdict and
background schedulers

Background processes that execute the tasks specified in records of the schedule
dbdict are called background schedulers.

Monitor the schedule dbdict and the background schedulers multiple times a day, and
take appropriate actions.

Idle time                               Administrative action
> Sleep time
00:00:00                                Restart the background process.

                                        The scheduler is very busy or hanging.

                                        To identify the schedule record
                                        processed, check schedule records
                                        with a status of "application running"
                                        for a Scheduled Class field that
                                        contains the process name. Rerun the
                                        query a few times and see if the
                                        schedule record returned is varying.

                                        If varying, this is a load issue. If not, the
                                        background process was hanging
                                        during the processing of this schedule
                                        record.

Monitor the schedule records as described in the following table.


Status                                   Administrative action

Scheduled                                If a schedule record is not picked up
or                                       although the expiration time has
empty status field                       passed, the problem may be caused by
                                         any of the following:

                                              The assigned scheduler is not
                                              running, or
                                              There is too much load for the
                                              assigned scheduler, or
                                              The scheduler is hanging on
                                              another record (see the
                                              application running status below).

application failed due to error - check  The System Administrator is required to
msglog for possible messages             analyze what made the processing of
                                         this task fail, decide if corrective
                                         actions are required to data records not
                                         being updated correctly, and take
                                         proactive actions to prevent this from
                                         happening to other similar tasks.

                                         Schedule records in this status aren't
                                         automatically removed for error
                                         analysis.

                                         Over time, these records may have
                                         negative impact to system
                                         performance, and need to be removed
                                         either manually by the administrator or
                                         by a scheduled purging task. See
                                         Purge queue records

 Status                                                                                         Service Manager 9.81
 locked
                                        Administrative action
 application running
                                        This is typically a state during normal
Related topics                          operations. However, if a schedule
                                        record stays in this state for a long
Schedule dbdict                         time, the System Administrator is
Queue Monitoring tasks                  required to analyze and resolve this
                                        situation.

                                        Refresh the search for schedule
                                        records in “application running” state
                                        and verify by field ID, if always the
                                        same record is displayed.

                                        If a background scheduler hangs, kill it
                                        from the status monitor and modify the
                                        Scheduled Class field of the schedule
                                        record that's not matching any
                                        background process name: This record
                                        requires to be analyzed later. Then
                                        restart the background scheduler, so
                                        that it continues to process other
                                        scheduled tasks assigned to it.


1.5.2.4.2. Monitor the eventin and
eventout dbdicts

Monitoring eventin or eventout records is mainly to ensure the number of records is
small and not constantly increasing. Old records should be reviewed because they are
artifacts of failure, and then removed.

If the number of eventin records is large, verify that the event background scheduler
is running and not hanging. As a large number of eventin records means large load,
the idle time is expected to be 00:00:00. So it is important to understand whether it is
running well or hanging under this load (see Monitor the schedule dbdict and
background schedulers).

If Service Manager requires a longer time to process an event, the external
application sending the eventin record may time out and resend the request. Service
Manager is then completing the initial request and the resent one, and then causes
another timeout. Depending on the timeout or resending configuration of the external
application, this may increase the load for the event background scheduler so much
that it can't handle it.

Related topics

Queue Monitoring tasks
Event Services
Eventin dbdict
Eventout dbdict


1.5.2.4.3. Monitor the SMIS task queue

The task queue for integrations using the Service Manager Integration Suite (SMIS)
framework is written to the smisTaskQueue dbdict. Monitor this dbdict to identify
potential issues during task execution.

Related topics

Queue Monitoring tasks
Service Manager Integration Suite (SMIS)
Monitor failover tasks


1.5.2.4.4. Monitor reportscheduleTasks
and reportscheduleHistory

When using the Reporting module, reporting tasks create reports and dashboards and
send notifications. All these tasks are recreated in the reportscheduleTasks dbdict
and moved into the reportscheduleHistory dbdict after execution.

Review this dbdict for tasks that were not executed successfully. It also helps to add
the Succeed field to the record list view by using the Modify Columns option. After
review, decide on corrective and cleanup actions.

Related topics

Queue Monitoring tasks
Report schedule and distribution
````
