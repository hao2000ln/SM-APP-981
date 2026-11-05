---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.5.1.3 .. 1.5.1.7
printed_pages: 1281-1304
---

# 1.5.1.3 System reports

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.5.1.3. System reports

System reports provide information of the system at the very moment they are run.
A system report is started from the command line and its output is written to the
console. Use the reporttolog parameter to write system reports to the log file, or
redirect stdout by OS means.
Because every system report starts a new session, don't run system reports too
frequently.
Status report (reportstatus)
Servlet and session reports (reportlbstatus, reportLBInterval, and reportgroups)
Shared memory report (reportshm)
Shared memory cache report (reportcache)
Semaphore report (reportsem)
System lock report (reportlocks)
License report (reportlic)

Related topics

Service Manager maintenance tasks
Knowledge required for system maintenance
Special parameters: reporttolog


1.5.1.3.1. Status report (reportstatus)

The status report provides information about processes in Service Manager, as well
as related information.
To generate this report, in the Service Manager Server's RUN directory, run this
command from the OS command prompt:

  sm -reportstatus

            Tip

           For more information, see Special parameters: reportstatus.

Example output:


---- Shared Memory ----

Release : 9.50.0

Mapped at: 0x80000000

Size      : 0x05B8D800 - 96000000 bytes

Resource Name: Global\SM.SHRM.13080

Owner: BUILTIN\Administrators

Group: SMHOST\None

Grant: NT AUTHORITY\Authenticated Users rw-       ReadControl

WriteDacl WriteOwner

Grant: NT AUTHORITY\SYSTEM              rw-  ReadControl WriteDacl

WriteOwner

---- Semaphores ----

Semaphore Name: Global\SM.LOCK.13080.0

Owner: BUILTIN\Administrators

Group: SMHOST\None

Grant: NT AUTHORITY\Authenticated Users ---       ReadControl

WriteDacl WriteOwner

Grant: NT AUTHORITY\SYSTEM              ---  ReadControl WriteDacl

WriteOwner

---- Processes ----

Owner       User                        UID PTID  PID NTID Name

Idle      Command

Administrators Administrator 1 -1                 6932 7328

ThreadControllerId-13

080 30:11:18 sm -httpPort:13080

Administrators Administrator 2 9096               6932 9096

falcon

00:00:33 sm -httpPort:13080

Administrators Administrator 4 5728               6932 5728

TRCLIENT_LOCKHANDLER

28:50:30 sm -httpPort:13080

Administrators Administrator 5 6476               6932 6476 sync

00:00:09 sm -httpPort:13080

Administrators Administrator 13 -1                8948 8316

scstatus

00:00:00 sm -reportstatus

Related topics


Knowledge required for system maintenance
System reports
Special parameters: reportstatus


1.5.1.3.2. Servlet and session reports
(reportlbstatus, reportLBInterval, and
reportgroups)

Reportlbstatus and reportgroups display the status of ports, processes, and threads in
horizontal and vertical scaling servlet implementations.
The following are example commands that you can run from the OS command prompt
in the Service Manager Server's RUN directory:

  sm -reportgroup:60,10
  sm –reportlbstatus
  sm –loadbalancer –reportLBInterval:60

Related topics

Service Manager maintenance tasks
Knowledge required for system maintenance
Parameter: reportlbstatus
Parameter: reportLBInterval
Parameter: reportgroup


1.5.1.3.3. Shared memory report
(reportshm)

The shared memory report provides information about the shared memory size, the
available space, and the size of shared memory pools.
Shared memory exists once on each host on which Service Manager runs, and hence
running a shared memory report on each host is required to get a full picture. For
more information, see Special parameters: reportshm.
In the Service Manager Server's RUN directory, run this command from the OS
command prompt:

  sm -reportshm

Example output:


------ Shared Memory ------

Shared Memory Release                   9.63.2

Current Size                            256000000

Segment Allocation                       9346088
Large Block Allocation                  11288576

Unused Space                            235365336 (91%)
Free Space                              235542624 (92%)

Shared Memory Type Allocations Frees                        Allocated

------------------ ----------- ----------- -----------

Not named                               26               3  759744

User blocks                             24               3  43008

Messages                                0                0  0

Database Services                       630              0  28848

Cache overhead                          26               3  42656

Application cache                       2158       703      1938832

DBDICT cache                            11630      1146 15424064

SQL descriptor cache                    530              0  1046432

Join/ERD/Type cache                     402              0  1032320

String Type cache                       1080       208      141472

Global cache                            0                0  0

Diagnostic Services                     0                0  0

The “Free Space” value should be monitored: For a stable system, it should always be
between 25 percent and 75 percent of the shared memory size. If this range is
exceeded, the shared_memory parameter should be adjusted in the sm.ini file.

            Note

           The percentage in this report is based the total shared memory size.

Related topics

Knowledge required for system maintenance
System reports


Shared memory
Startup parameter: shared_memory
Special parameters: reportshm


1.5.1.3.4. Shared memory cache report
(reportcache)

The shared memory cache report provides aggregated information about the shared
memory cache.

The shared memory exist once on each host on which Service Manager runs, hence
running a shared memory cache report on each host is required to get a full picture.
For more information, see Special parameters: reportcache.

In the Service Manager RUN directory, run this command from the OS command
prompt:

  sm -reportcache

Example output:

---------------------- Cache Statistics  -------------------

---

Slot use: 9%; Average Slot Depth: 1; Maximum Slot Depth: 3

The shared memory cache is organized as an array of slots containing a list of
cached objects. A hash function determines which slot an object uses.

The Average and Maximum slot depths are important for the system performance.

If the average slot depth exceeds 20, you need to increase the number of slots by
using the cache_slots parameter.

Related topics

Knowledge required for system maintenance
System reports
Startup parameter: cache_slots
Special parameters: reportcache


1.5.1.3.5. Semaphore report (reportsem)

A semaphore is an operating system provided mechanism to control concurrent
access to resources, and prevent race conditions.
In the Service Manager Server's RUN directory, run this command from the OS
command prompt:

  sm -reportsem

Related topics

Service Manager maintenance tasks
Knowledge required for system maintenance
System reports
Special parameters: reportsem


1.5.1.3.6. System lock report (reportlocks)

Service Manager manages locks in the LOCKM1 and LOCKSHAREDM1 tables in the
database management system, and therefore monitoring lock files can also be done
externally on these log files. Because the efficiency of access to these tables is
critical to Service Manager system performance, be sure to not run too frequent or
too complex selects.

In the Service Manager Server's RUN directory, run this command from the OS
command prompt:

  sm -reportlocks

Example output:

--- Resource Locks ---

HostName                                SID  PID   TID   Type
                                                         -------
Resource Name                                            Shared

-------------------- -------- ------------ ------------

-- ------------------------------

host03sm25                              3    7024  5020

agent:TEST

There are currently 1 lock(s).

--- Threads waiting for locks ---

No thread is waiting for locks

You can also monitor locks from the system navigator by clicking System Status >
Show Locks.

Related topics

Knowledge required for system maintenance
Lock management
System reports
Special parameters: reportlocks


1.5.1.3.7. License report (reportlic)

The License report provides information about application licenses, login licenses,
and the expiration date of the current license.
In the Service Manager Server's RUN directory, run this command from the OS
command prompt:

  sm -reportlic

Related topics

Service Manager maintenance tasks
System reports
Special parameters: reportlic
Check license expiration
Check license usage
AutoPass licensing


1.5.1.4. Server side integrations

Service Manager provides different technologies to integrate with external
applications. This section focuses on server-side integrations because they are
relevant to queue monitoring.

Web services

A Web service is an integration mechanism, where the service publisher publishes its
API as a Web Service Definition Language (WSDL) file in XML format. This file defines
the format of requests and responses, which are also sent as XML documents. The
service consumer must implement its requests according to the WSDL.

RESTful API

The Service Manager RESTful API works with different HTTP methods. Data for
requests may be included in the URL for requests using the GET method or as a JSON
document when using POST methods. Service Manager also responds with JSON
documents to REST requests.

Service Manager Integration Suite (SMIS)

SMIS provides a framework to implement scheduled-based or UI-based integrations
using the web services API or RESTful API.

With the Integration Manager, SMIS provides a graphical user interface to manage
integrations.

A UI-based integration means synchronous execution when the user clicks a button
or menu option.

For each scheduled-based integration, a background process is assigned and a
record in the schedule dbdict is created, which is rescheduled after each execution.
The execution reads the expired integration tasks from the smisTaskQueue dbdict and
performs the required action.

Event services

An event service is an integration mechanism used by integrations such as SC
Automate, Connect-it, and JavaMail.

The eventin and eventout dbdicts contain incoming and outgoing events, respectively.


Events use an event code that refers to an event registration record containing all
information about how the event should be processed.

Unlike other queue dbdicts, eventin records may be processed synchronously or
asynchronously depending on the state of the Process input events synchronously?
flag in the eventregister record. Synchronous processing is implemented by the
“eventin.after.add” trigger.

            Note

           Changing the state of the “Process input events synchronously?” flag in
           the eventregister record is not effective immediately, but requires these
           global lists: “Sync Event Types” (variable $G.sync.events) and “Sync
           Event Types” (variable $G.sch.events).

Asynchronous events use the evtime field and therefore may be scheduled. Incoming
events can be configured to automatically create an outgoing event as the response.
Successfully processed events are automatically deleted (if not configured otherwise,
for example, for debugging purposes), while events that were not processed
successfully aren't deleted automatically to allow error analysis.

Related topics

Service Manager integration methods and tools
Valid URLs for Service Manager
RESTful API
Integration Manager
Event Services
Troubleshooting: Event Services


1.5.1.5. Queue dbdicts

Queue dbdicts contain records that are created by any session, and processed by a
dedicated background process, which finally deletes it. Queues implement
asynchronous task execution, and are also used to schedule task execution.

Queue dbdicts require monitoring in order to prevent system performance
degradation, and require background processes to process the queue records.

The out-of- box queue dbdicts are described in the following table.

Dbdict name                             Description
schedule
                                        Scheduled tasks of many different
eventin                                 kinds, such as output of on-screen
eventout                                messages, or sla processing.
SMISTaskQueue
                                        Queue for incoming events

                                        Queue for outgoing events

                                        Service Manager Integration Suite
                                        (SMIS) provides a management
                                        framework for schedule-based and UI-
                                        based integrations using the web
                                        services or RESTful API.
                                        With SMISTaskQueue, schedule-based
                                        integrations are realized.

reportscheduleTask                      Files for scheduled tasks of the
                                        Reporting module
spool
spoolheader                             These queue dbdicts were used for
mail                                    server-side printing and the internal
                                        mail system, and aren't used in most
                                        systems anymore.


Because some queue dbdicts have a high frequency of record creation and deletion,
efficient indexing of the tables on the RDBMS is important. Also, preparing for
temporary steep increases or decreases in the number of records is important.

            Note

           It is possible that multiple background processes work on the same queue
           file (for example, schedule or eventin). In this case, the sequence of
           processing is possibly no more identical to the sequence of creation. So
           additional design effort is required to prevent an update event for a record
           from being processed before its creation event.

Schedule dbdict

The schedule dbdict contains records that are tasks for most background processes
(the so-called “schedulers”). All schedulers execute the same main RAD application
named scheduler.process, while the schedule record contains the implementation.

Schedule records are used to achieve the following goals:

     Schedule a task into the future (for example, SLA alerting) using the expiration
     time field;
     Move time consuming processing from foreground sessions to background
     processes to increase response times, or
     Implement periodically interval-based rescheduled tasks

Other queue managers such as the event scheduler and the SMIS background tasks
are implemented as schedulers using periodically rescheduled schedule records.

Important fields in a schedule record are described in the following table.


Field                                   Description
Expiration time
Class                                   This field contains the time after which
                                        the schedule record is to be processed.
scheduled class
                                        This field contains the name of the
Status                                  background scheduler to process this
                                        schedule record when the task is
                                        scheduled. While a background
                                        process is processing it, however, it is
                                        empty.

                                        This field contains the name of the
                                        background scheduler while it
                                        processes the schedule record. For a
                                        rescheduled schedule record, this field
                                        is also filled even if the record is only
                                        scheduled.

                                        This is a free-text field used to provide
                                        status information about the schedule
                                        record by the scheduler.process RAD
                                        application.

When the background scheduler wakes up, it looks for expired schedule records
whose Class field contains its own name. It processes all these records, deletes each
of them after they are processed successfully, and goes to sleep again. The sleep
time is configured in its startup command (in the info dbdict using the info.startup
format, or the sm.cfg file). It is recommended to not set the sleep time to be less than
15 seconds. The default value for most schedulers is 60 seconds.

Only when the scheduler is started for the first time, it checks for all schedule records
that have a status of “application running” and a scheduled class that contains its own
name. This is to ensure the task that was processed by a scheduler is completed
before it is terminated prematurely. Because this is also the case for hanging
schedule records, the system administrator needs to edit the hanging schedule record
before restarting the background process.

Typical scenarios of failures in schedule record processing are described in the
following table.


Status                                   Description
scheduled or empty status field
                                         This is a normal state as long as the
                                         expiration time has not passed.
                                         If expiration time has passed,
                                         corrective actions are required.

application failed due to error - check  An error occurred while processing a
msglog for possible messages             schedule record and the schedule
locked                                   record gets into an “Application error”
                                         status. The background scheduler
application running                      continues to pick up the next schedule
                                         record and continues to process its
                                         tasks.

                                         A schedule record could not be
                                         processed because resources required
                                         were locked. The schedule record gets
                                         into a “locked” status and is
                                         rescheduled for a few minutes later.
                                         The background schedule continues to
                                         pick up the next schedule record and
                                         processes this record at the
                                         rescheduled time.

                                         This is a temporary state while the
                                         schedule record is being processed.

                                         If this temporary state persists, it is
                                         likely that the scheduler processing this
                                         record got into an endless loop, which
                                         is also referred to as “hanging”.

The background processes can be monitored by the status monitor. The important
column in the following table is Idle Time.


Idle Time                               Interpretation and administrative
> Sleep time                            action

00:00:00                                The scheduler is not running properly.
                                        Normally, killing and restarting the
                                        background process should resolve
                                        this issue.

                                        If the idle time is exactly 00:00:00,
                                        press the Refresh button several times
                                        and watch if the idle time is increasing.
                                        If not, the schedule record is very busy
                                        or hanging.

                                        To identify this, check schedule
                                        records with a status of "application
                                        running” for a Scheduled Class field
                                        value that contains the process name.

                                        If there is no hanging schedule record,
                                        while the idle time stays 00:00:00,
                                        there is a load issue. Inspect all
                                        schedule records for this background
                                        process (the Class field) to understand
                                        the root cause of the load and then
                                        take adequate actions.

Eventin dbdict

The eventin dbdict contains incoming events. Eventin records may be processed
synchronously or asynchronously depending on the state of the “Process input
events synchronously?” flag in the eventregister record.

Synchronous processing is implemented by the “eventin.after.add” trigger.

Asynchronous events use the evtime field. Eventin records are selected by the event
background process based on a query specified in the schedule record of the event
class, which is always rescheduled.


            Note

           Changing the state of the “Process input events synchronously?” flag in
           the eventregister record is not effective immediately, but requires these
           global lists: “Sync Event Types” (variable $G.sync.events), and “Sync
           Event Types” (variable $G.sch.events).

Incoming events can be configured to automatically create an outgoing event as the
response. Successfully processed events are automatically deleted (if not configured
otherwise, for example, for debugging purposes), while events that were not
processed successfully aren't deleted automatically to allow error analysis.

Eventout dbdict

The eventout dbdict contains outgoing events, which will be picked up by a
background processor and then sent to an external application such as an email
service.

SMISTaskQueue dbdict

When using Service Manager Integration Suite (SMIS), the queue of pending tasks
can be inspected using Integration Manager. Repeated inspections help identify if the
task queue is stuck and if a corrective action is required.

ReportscheduleTask and reportscheduleHistory
dbdicts

The Reporting module queues tasks in the reportscheduleTask dbdict, and moves
them into reportscheduleHistory after processing. The Reporting module also takes
care of the cleanup of old records.

The Reporting module has its own cleanup mechanism implemented.

Related topics

Integration Manager
Service Manager Reports introduction
IR Expert
Event Services


1.5.1.6. Performance of dbdicts and tables

The definitions of dbdicts in Service Manager have a huge impact to system
performance and response time. The following are the aspects in a dbdict definition:

     Mapping of the dbdict to tables in the relational database management system
     (RDBMS)
     Indexes on the tables in the RDBMS
     The number of fields in the dbdict. This increases the size of messages
     exchanged between the client and server.

The mapping of the dbdict to tables defines how many tables the dbdict is mapped to,
and whether the fields are mapped to SQL column types interpretable by the RDBMS
(such as VARCHAR, NUMBER, and FLOAT) or not (such as IMAGE, and CLOB).

Using non-interpretable fields may improve the performance mildly for reading and
writing records, and they can be used neither by the index on a table, nor in the
WHERE clause of a SQL SELECT statement. Service Manager relaxes queries that use
these fields by replacing this clause with “(1=1)” and re-selects among the records in
its own memory. Using non-interpretable fields in queries therefore causes the
RDBMS to fetch more records and send them over the network, and causes Service
Manager to load more records into its own memory for reselection.

Dbdicts support array and structure-type fields. These fields can't be natively
mapped to SQL column types, and must be mapped either to non-interpretable
column types or as tables for the array elements using the primary key (or the first
unique key) fields and the RECORD_NUMBER field (which contains the position of
each element in the array).

Array fields mapped as tables of interpretable column types can be used efficiently in
queries , because Service Manager is then translating the queries into a SELECT
statement on the join of multiple tables.

            Note

           Arrays nested in others can't be mapped to tables, and need to be
           mapped to non-interpretable column types.

As the database operations are executed at the RDBMS, dbdict keys have no direct
impact on database performance. Their relevance is as follows:


     The primary (first unique) key is relevant as the record identifier during query
     processing: Service Manager first selects a list of key values that match the
     query, before selecting the fields displayed in the record list view or all fields for
     the record displayed in the detail format.
     The primary (first unique) key is relevant for the mapping of array fields.
     All dbdict keys are translated into indexes on the RDBMS when a dbdict is
     initially mapped to tables or remapped. Because remapping means creating new
     tables according to the modified mapping and replacing the existing tables, all
     modifications of the tables on the RDBMS side aren't maintained.
     When a new key is created in the dbdict, an index is automatically created on the
     table.

Indexing all fields used in queries that are executed frequently by the out-of-box
implementation or a tailored implementation is required for an efficient system. User-
defined queries that are executed from search formats, view definitions or reports
typically can't be all indexed. Training and highlighting indexed fields in a search
format (that is, by using bold font for field labels) will enable the user to formulate
queries efficiently and achieve short response times.

            Note

           The debugdbquery trace parameter can be turned on during the
           prototyping of Service Manager to verify that user and background
           queries are well supported with the corresponding keys. For more
           information, see Trace parameters that can be proactively activated.

Related topics

Keys and indexes in Service Manager
Trace parameters that can be proactively activated


1.5.1.7. Sequential numbers

Sequential numbers refer to the sequential identifiers assigned to the records of a
dbdict, such as an interaction or incident number. Sequential numbers are controlled
by the numbers or counters dbdict.

Call the system language function named rtecall(“getnumber”) to increase and update
the last number in these dbdicts and get the number returned.

Both the numbers and counters dbdicts contain a batch size setting, which allows
the Service Manager Server to reduce the number of SELECT and UPDATE operations
on these dbdicts. The mechanism is that a servlet doesn't request one sequential
number, but a batch of sequential numbers. It then assigns the numbers in this batch
to any request for a number by its sessions and accesses the sequential number
dbdict only when all numbers have been assigned. This mechanism allows high-
frequency assignment of numbers without a huge load at the RDBMS side.

            Note

           When using the batch size feature, a number being requested is not
           necessarily larger than a number requested before by another servlet.
           Additionally, when a servlet is terminated, unassigned numbers in its
           current batch will not be assigned anymore.

Related topics

Service Manager maintenance tasks
Knowledge required for system maintenance
Reset sequential numbers
Define a batch size for sequential number records
````
