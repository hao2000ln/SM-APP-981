---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.4.5 .. 1.5.1.2
printed_pages: 1246-1281
---

# 1.4.5 Mobile Applications for Service Manager Process Designer

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.4.5. Mobile Applications for Service
Manager Process Designer

Multiple Mobile Applications forms are designed for Service Manager Codeless. Refer
to the following tables for detail.

Workflow   Phase                        Change module             Forms for Mobile
                                                                  Applications
                                                Display
                                                Option/Action/Tr
                                                ansition

Emergency  E-CAB Approval               Approve, Deny,            chm.emergency.a
                                        Retract, and Save         pproval.mobile

                                                                  chm.subform.acti
                                                                  vity.mobile

Standard   Authorization                Approve, Deny, chm.standard.app
Normal     CAB                          Retract, and Save roval.mobile

           T-CAB Approval               Approve, Deny,            chm.normal.dcab.
           D-CAB Approval               Retract, and Save         approval.mobile

                                                                  chm.normal.tcab.
                                                                  approval.mobile

Change Proposal Authorization           Approve, Deny, chm.proposal.tca
                       CAB              Retract, and Save b.approval.mobile


Workflow  Phase                         Incident module           Forms for Mobile
Incident                                                          Applications
                                                Display
                                                Option/Action/Tr
                                                ansition

          Categorization                Save and Close            im.incident.categ
          Investigation                                           orization.mobile
          Review
          Recovery                                                im.incident.investi
          Closure                                                 gation.mobile

                                                                  im.incident.recov
                                                                  ery.mobile

                                                                  im.incident.review
                                                                  .mobile

                                                                  im.incident.closur
                                                                  e.mobile

                                                                  im.incident.close.
                                                                  mobile


Workflow         Phase                  Interaction module         Forms for Mobile
Service Catalog                                                    Applications
                                                 Display
                                                 Option/Action/Tr
                                                 ansition

                 Categorization         Approve, Deny,             sd.interaction.svc
                 Work In Progress       Retract, Update,           .categorization.m
                 Review                 and Close                  obile
                 Closure
                                                                   sd.interaction.svc
                                                                   .workinprogress.
                                                                   mobile

                                                                   sd.interaction.svc
                                                                   .review.mobile

                                                                   sd.interaction.svc
                                                                   .closure.mobile

Service Desk     Categorization         Update, Close              sd.interaction.cat
                 Work In Progress                                  egorization.mobil
                 Review                                            e
                 Closure
                                                                   sd.interaction.clo
                                                                   sure.mobile

                                                                   sd.interaction.wor
                                                                   kinprogress.mobil
                                                                   e

                                                                   sd.interaction.revi
                                                                   ew.mobile

                                                                   sd.interaction.sub
                                                                   form.detail.mobile


Workflow         Phase                  Display           Forms for Mobile
                                        Option/Action/Tr  Applications
                                        ansition

Streamlined      Open                   Update, Close     sd.streamlined.de
Complaint        In Progress                              tail.mobile
or Compliment    Close
                 Canceled                                 sd.streamlined.cl
                                                          osure.mobile

Streamlined      Open                   Approve, Deny,    sd.streamlined.sv
Service Catalog  Pending Approval       Retract, Update,  c.detail.mobil
                 Work In Progress       and Close
                 Close                                    sd.streamlined.sv
                 Canceled                                 c.closure.mobile

Streamlined      Open                   Update, Close     sd.streamlined.itil.
Service Desk     Work In Progress                         detail.mobil
                 Close
                 Canceled                                 sd.streamlined.itil.
                                                          closure.mobile


Workflow  Phase                         Request module            Forms for Mobile
Request                                                           Applications
                                                Display
                                                Option/Action/Tr
                                                ansition

          Logging                       Update, Close,            rm.request.author
          Authorization                 Approve, and              ization.mobile
          Fulfillment                   Deny
          Review                                                  rm.request.close.
          Closure                                                 mobile

                                                                  rm.request.closur
                                                                  e.mobile

                                                                  rm.request.fulfill
                                                                  ment.mobile

                                                                  rm.request.loggin
                                                                  g.mobile

                                                                  rm.request.loggin
                                                                  g.subform.detail.
                                                                  mobile

                                                                  rm.request.review
                                                                  .mobile

                                                                  rm.request.review
                                                                  .subform.detail.m
                                                                  obile

Note

Being widely used in PD forms, the Dynamic View Dependencies (DVD)
conditions for widgets aren't supported by Mobile Applications. On
the Mobile Applications client, errors may occur when you are updating a
record that uses PD forms with DVD conditions. The errors include a blank
title on the Related Records tab, some invisible fields in Service Manager
becoming visible on the Mobile Applications client, and so on. We
recommend that you use customized forms on the Mobile Applications
client and avoid the DVD conditions.


PD Change module

A typical usage of your Mobile Applications is to approve or deny a change on the
smartphone regardless of the change's category. Based on the phases and workflows
introduced by PD, a series of chm.*.mobile sample forms are designed for Mobile
Applications to address the Emergercy, Standard, Normal changes and the Change
Proposals. For Normal or Standard changes, or Emergency changes in a phase other
than E-CAB Approval , you need to define your own forms. Otherwise, the original PD
forms will be exposed on Mobile Applications client.

You need to move the created Emergency change to the E-CAB Approval phase in
Service Manager before utilizing them on Mobile Applications client. For any
Emergency change in the E-CAB Approval phase, Mobile Applications client displays
Change Main, Updates, and Approval groups as corresponding tabs in the Detail view.
You are able to approve, deny and update a change in this phase. In addition, you are
also able to search for any approved or denied change by using global search and
then retract the change.

PD Incident module

For a newly created incident in the Categorization phase, Incident Details,
Categorization and Assignment, Major & Escalation, Activities, Proposed Solution and
Related Records groups are displayed as corresponding tabs in the Detail view on
Mobile Applications client. You are able to update the incident in this phase.

Change the incident's status to Work in Progress, the incident moves to the
Investigation phase. You are able to update the incident in this phase.

After updating the proposed solutions and save the record, the incident moves to the
Recovery phase. You are able to update and close the incident in this phase.

After changing the incident's status to Resolved, the incident moves to the Review
phase. The Proposed Solution tab is renamed to Recovery Action and you are able to
update and close the incident in this phase.

After closing the incident on Mobile Applications client, the incident moves to the
Closure phase and all tabs become read-only.

PD Interaction module

If an interaction is ordered from the catalog or opened by Service Desk and includes
pending request level approvals, it is read-only on Mobile Applications client before
all approvals are approved. You are able to approve or deny the interaction in this


phase. In addition, you are also able to search for any approved or denied interaction
by using global search and then retract the interaction.

After approving all pending approvals, the interaction moves to the Work In Progress
phase. You are able to update and withdraw the interaction in this phase.

After updating the proposed solutions and save the record, the interaction moves to
the Review phase. You are able to update and close interaction in this phase.

After closing the interaction on Mobile Applications client, the interaction moves to the
Closure phase and all tabs become read-only.

            Note

           Streamlined Interaction is disabled by default in Service Manager. You
           need to manually enable it before accessing the interactions from the
           Mobile Applications client. After you adopted Streamlined Interaction, the
           workflow is slightly different after interaction approval. For more
           information, see Service Desk (Codeless).

PD Request module

For a newly created request in the Authorization phase, Request Details, Activities,
Approvals, Additional Properties, and Attachments are displayed as corresponding
tabs in the Detail view on Mobile Applications client. You are able to update, approve,
or deny the request in this phase.

After moving the request to the Fulfillment phase, you are still able to update the
request in this phase.

After reviewing and updating the information in the request, the request moves to the
Review phase. You are able to update and close the request in this phase.

After closing the request on Mobile Applications client, the request moves to the
Closure phase and all tabs become read-only.


1.5. Service Manager maintenance tasks

One of the user roles within Service Manager is the System Administrator, who is
usually responsible for installing, configuring, and maintaining the Service Manager
system to ensure proper availability, performance, and security.

This section describes a set of tasks the System Administrator needs to perform to
ensure stability, performance, and security. The aim is to list typical Service Manager
maintenance tasks touching all system-relevant operations.

            Note

           Because Service Manager is typically run as a tailored and integrated
           system, the list of tasks provided can neither be complete nor fit every
           system in all details. The intention of this section is to assist
           administrators to get an overall picture of their routine work and refine
           their current practice.

Frequency or trigger events to run maintenance
tasks

In order to provide a complete concept for maintenance tasks, each task described in
this section is assigned a frequency or trigger event, assuming the task is run
manually. The frequency provided is only a suggestion to the System Administrator. If
a task can be automated, a higher frequency may be desirable. To ensure a concrete
Service Manager system, you may need to adjust these frequencies.

Automation of maintenance tasks

In order to effectively administrate a Service Manager system, the System
Administrator should automate repetitive tasks as much as possible by using tools
such as Application Performance Management (APM) or Operations Orchestrations
(OO), or by using shell scripts.

Automated tasks cause system load. Even when automation allows a higher
frequency for administrative tasks, the additional system load must be anticipated.

When automating a task using external tools or a scheduled operating system script,
be sure to handle the startup or shutdown of the Service Manager system or single
servlets for maintenance. Frequent monitoring requests that Service Manager
receives during shutdown or startup may cause instabilities. For example, switching


the schedule for OS scripts on or off as a part of the Service Manager startup or
shutdown script is recommended.

Reports and dashboards for the Service Manager
administrator

The Service Manager Reporting module allows scheduled queries to run on the data,
present the query results as dashboards, and send emails. Use this module to
automate monitoring tasks.

For more information, see Service Manager Reports introduction.

Related topics

Knowledge required for system maintenance
Areas of maintenance tasks
Document all automated administrative tasks
Service Manager Reports introduction


1.5.1. Knowledge required for system
maintenance

To maintain a Service Manager system, the System Administrator must have the
product knowledge described in this section.
Configuration files
Service Manager logs
System reports
Server side integrations
Queue dbdicts
Performance of dbdicts and tables
Sequential numbers

Related topics

Service Manager maintenance tasks


1.5.1.1. Configuration files

The following describes the Service Manager Server, web tier, and Windows Client
configuration files.

Server configuration files

The following table describes the server configuration files.

File                                    Location           Description
sm.ini                                  <SM server
                                        installation>/RUN  This file contains the
sm.cfg                                                     default values for all
                                        <SM server         servlet parameters.
                                        installation>/RUN
                                                           This is a batch file that's
                                                           executed at system
                                                           startup.

                                                           Enter all servlet and
                                                           background process
                                                           startup commands in this
                                                           file. The Service
                                                           Manager load balancer is
                                                           started unless a
                                                           hardware load balancer
                                                           is used.

                                                           Configuration
                                                           parameters set in the
                                                           sm.ini file can be
                                                           overwritten by this file.

lwssofmconf.xml                         <SM server         This is the file for
                                        installation>/RUN  configuring LW-SSO in
                                                           the Service Manager
                                                           server.

JGroups configuration files


The JGroups configuration files, udp.xml or udpcluster.xml or tcpcluster.xml, are
located under the <SM server installation>/RUN directory.
It is strongly recommended to not modify these files, unless advised by Software
Support.


Note

In Service Manager 9.70 release, the JGroups configuration file is
upgraded for 4.2.2. If you have modified this file in previous releases, you
can merge your customized configurations to the new file. Before you
merge the contents, see following changes of the JGroups configuration
file in 9.70 for your attention:

     RSVP protocol is removed. If you made customized configurations in
     previous releases, don't merge your configurations to the new file.
     UNICAST3 protocol is used to replace UNICAST2 or UNICAST.
     MERGE3 protocol is used to replace MERGE2.
     The following attributes of protocols are obsoleted. If you made
     customized configurations in previous releases, don't merge
     your configurations to the new file.
     <UDP

           loopback="true"
          max_bundle_timeout="30"
           enable_bundling="false"
           timer_type="new"
           timer.min_threads="2"
           timer.max_threads="4"
           timer.keep_alive_time="3000"
           timer.queue_max_size="500"
           thread_pool.queue_enabled="true"
           thread_pool.queue_max_size="100"
           thread_pool.rejection_policy="Run"
           oob_thread_pool.enabled="true"
           oob_thread_pool.min_threads="3"
           oob_thread_pool.max_threads="5"
           oob_thread_pool.keep_alive_time="5000"
           oob_thread_pool.queue_enabled="true"
           oob_thread_pool.queue_max_size="100"
           oob_thread_pool.rejection_policy="Run"/>
     <TCP
           max_bundle_timeout="30"
           use_send_queues="true"
           timer_type="new3"
           timer.min_threads="4"
           timer.max_threads="10"
           timer.keep_alive_time="3000"
           timer.queue_max_size="500"
           thread_pool.queue_enabled="true"


                      thread_pool.queue_max_size="10000"
                      thread_pool.rejection_policy="Run"
                      oob_thread_pool.enabled="true"
                      oob_thread_pool.min_threads="1"
                      oob_thread_pool.max_threads="8"
                      oob_thread_pool.keep_alive_time="5000"
                      oob_thread_pool.queue_enabled="true"
                      oob_thread_pool.queue_max_size="100"
                      oob_thread_pool.rejection_policy="Run"/>
                <PING timeout="5000" num_initial_members="100"/>
                <pbcast.NAKACK2 max_msg_batch_size="500"/>
                <UNICAST2 max_bytes="20M" stable_interval="2000"
                max_msg_batch_size="500"/>
                <UNICAST max_msg_batch_size="500"/>
                <pbcast.STABLE cap="0.1"/>
                <pbcast.GMS view_bundling="true"

                           max_bundling_time="1000"
                           resume_task_timeout="15000"/>

Web tier configuration files

The following table describes the web tier configuration files.

File                                    Location                                           Service Manager 9.81
web.xml                                 <context>/WEB-INF
webtier.properties                                                 Description

log4j2.properties                                                  Basic configuration file
                                                                   for the web tier.
                                                                   For more information,
                                                                   see Enter a parameter in
                                                                   the web.xml file.

                                        Depending on whether       This file overrides
                                        the customize-folder       web.xml parameters,
                                        parameter is specified in  such as for custom web
                                        the web.xml file:          client branding.

                                             If specified:         For more information,
                                             <customize-           see the following topics:
                                             folder>/config
                                             If not specified:          Web tier
                                             <context>/WEB-             parameters
                                             INF                        Enter a parameter
                                                                        in the
                                                                        webtier.properties
                                                                        files
                                                                        Web parameter:
                                                                        customize-folder

                                        Location as specified by   This file configures log
                                        the log4jConfiguration     parameters for the web
                                        parameter in the           tier.
                                        web.xml or
                                        webtier.properties file.   For more information,
                                                                   see the following topics:
                                        Default: <context>/WEB-
                                        INF                             Web parameter:
                                                                        log4jConfiguration
                                                                        Running traces on
                                                                        the Service
                                                                        Manager web client


Windows client configuration files

You can't edit Windows client configuration files directly; instead, you need to use the
Window > Preferences menu options in the Windows client application.
The Windows client stores the Windows client configuration in multiple files in the
following directory:

  %USERPROFILE%\ServiceManager\workspace

Related topics

Web client
Windows client
Running traces on the Service Manager web client
Web parameter: log.properties
Web parameter: customize-folder
Configure LW-SSO in the Service Manager server
Enter a parameter in the web.xml file
Enter a parameter in the webtier.properties files


1.5.1.2. Service Manager logs

Service Manager frequently logs information to the following places.
Server log files
Dbdicts containing log information
Client log files

Related topics

Service Manager maintenance tasks
Knowledge required for system maintenance


1.5.1.2.1. Server log files

The Service Manager system is running as one or multiple servlets on one or multiple
hosts. All of the servlets share the same binaries, but may be configured differently.
Each servlet is configured to write information to a log file on its host, which it may
share with other servlets.

For different approaches to implementing custom logging, see Implementing custom
logging.

Server log file entries

Running traces on the Service Manager server

Trace parameters that can be proactively activated

Related topics

Service Manager maintenance tasks
Knowledge required for system maintenance
Client log files


1.5.1.2.1.1. Server log file entries

A server log file entry has the following format:

  PID (TID) date time component log-level message

The following is an example:

  2276( 8160) 11/10/2013 23:22:26 RTE I User xyz has logged out.

The following table explains each portion of a log entry.

Portion                                                                                         Service Manager 9.81
PID
TID                                     Description

date                                    The process id identifying the servlet
time
component                               The thread id identifying the session
                                        thread

                                        Date when the message was logged

                                        Time when the message was logged

                                        The binary component writing the
                                        message. Typically, these components
                                        are:

                                             RTE: The C-RTE of Service
                                             Manager. This component
                                             performs most internal
                                             processing.
                                             JRTE: The Java-RTE of Service
                                             Manager. This component is
                                             responsible for communication of
                                             the servlet with a client or other
                                             servlets.
                                             RAD: The RAD component. It is
                                             part of C-RTE and interprets code
                                             written in the system language
                                             code.
                                             JS: The JS engine. It is compiled
                                             as part of C-RTE and interprets
                                             JavaScript code.


Portion                                 Description
log level
                                        Information about the severity of the
                                        log message:

                                             F (Fatal) – fatal errors, which
                                             cause risk to the system
                                             E (Error) – Errors that may still
                                             allow the system to run
                                             W (Warning) – potential harmful
                                             situations
                                             I (Information) – informational
                                             messages only
                                             D (Debug) – fine-grained
                                             informational events that are most
                                             useful to debug the system;
                                             typically used only when a trace
                                             is enabled
                                             A (Alert) – hints to the
                                             administrator about a
                                             misconfiguration or corruption.
                                             See System alerts.

message                                 Any string, which is typically a single
                                        line.

                                        Java run-time messages (component:
                                        JRTE) may be multi-line (that is, JRTE
                                        stack trace messages), in contrast to
                                        RTE stack trace messages that are
                                        written as a sequence of single-line
                                        messages. If the length of a single
                                        message exceeds 8000 characters, the
                                        message will be truncated.

Related topics

Service Manager maintenance tasks
Knowledge required for system maintenance


System alerts


1.5.1.2.1.2. Running traces on the Service
Manager server

Service Manager provides parameters to produce detailed trace information for
different analysis requirements. The most used trace parameters are rtm,
debugdbquery, sqldebug, and debughttp.

When generating a trace in a production system, it should be limited to as few
sessions as possible in order to avoid system load and limit the size of the log data to
analyze to a minimum. In most cases, only tracing a single user session or
background scheduler is required.

Starting a servlet with trace parameters and
connecting to it for reproduction

When using the Service Manager load balancer (SMLB), use the debugnode
parameter to start a servlet for tracing purposes. This parameter prevents the SMLB
from assigning sessions to this servlet. Only when bypassing the SMLB and
connecting directly to the servlet port, the session is traced.

To bypass the SMLB with Windows client, simply specify the port of the traced servlet
instead of the SMLB port in the connection.

For the web client, the serverHost and serverPort parameters can also be specified in
the URL, and by doing this the load balancer is bypassed.

            Note

           By default, direct connection to a servlet by specifying the serverHost
           and serverPort parameters in the web client URL is not allowed; to allow
           direct connection, set the honorUrlHost and Web parameter: honorUrlPort
           parameters in the web.xml file to true.

When a hardware load balancer (HWLB) is used, it doesn't assign a servlet a port that
is not set up as the target in its configuration. However, typically a HWLB also uses a
network gateway, and hence direct access to the servlet bypassing the HWLB may
not be possible. In this case, additional configuration by the HWLB administrator is
required.

Activating dynamic debugging options in Status
Monitor


Another option is to activate dynamic debugging for already running sessions or
schedulers using the status monitor. By this method, a message is sent to the target
session to start tracing, and the tracing becomes active as soon as the target session
is in a state to receive the message.

Starting with Service Manager 9.50, dynamic debugging can also be activated
programmatically for the current session by using rtecall(“setdebug”). This allows
conditional activation of dynamic debugging, that is, for web service integrations from
expressions in the extaccess dbdict.

Activating traces of the current session in RAD
Debugger

The rtm, sqldebug, and debugadhocsql trace parameters can be activated for the
current session using the RAD Debugger. This is convenient during online debugging.

Related topics

Dynamic debugging of user sessions or schedulers
Hardware load balancers
RAD Debugger
Debugging parameters
Parameter: debugnode
Web parameter: honorUrlHost
Web parameter: honorUrlPort
Parameter: loadBalancer
rtecall ("setdebug") function
Enter a parameter in the web client URL


1.5.1.2.1.3. Trace parameters that can be
proactively activated

Activating a trace parameter in a production system causes additional load and
causes log files to grow quickly, and therefore reduces the time interval covered by
log rotation.
The following trace parameters can be activated in production environments even for
a long time.

Parameter                                                                                       Service Manager 9.81
msglog:1
sqllimit:2 (or higher)                  Description
debugdbquery:2 (or higher)
                                        Writes all on-screen messages to the
rtm:2                                   log file as well

                                        Writes a message about the slow
                                        execution of any SQL statement
                                        (SELECT, INSERT, UPDATE, DELETE or
                                        others)

                                        Writes a message about slow SM
                                        queries taking longer than the specified
                                        number of seconds. The adding,
                                        updating, or deleting of records is NOT
                                        logged.

                                                    Caution

                                                   Do not set it to 999
                                                   because this is a special
                                                   and verbose trace.

                                        Writes information about how long a
                                        user transaction took. This is basically
                                        the time from a user action until the
                                        next format is displayed.

                                        This parameter also causes information
                                        about native heap consumption to be
                                        printed to the log file so that sessions
                                        consuming a lot of memory can be
                                        identified.


Parameter                               Description

log4jdebug:                             The log4jdebug parameter is used to
com.hp.ov.sm.common.oom.LowMemo         enable debugging messages for
ryHandler                               different java modules. The
                                        LowMemoryHandler module may be
                                        activated during production to monitor
                                        for a low memory situation of the
                                        servlets.

dbmonitorfiles:<dbdict1>[,<dbdict2>..]  Logs a message whenever a record of
                                        the listed dbdicts is inserted, updated
                                        or deleted. The message contains the
                                        following information:

                                        The application that'ssued the
                                        update request
                                        A list of records that were
                                        updated
                                        The user who initiated the update

The following are examples of verbose trace parameters that must NOT be activated
by default in a production system:

     rtm:3|4|5
     debugdbquery:999
     sqldebug:1|2
     debughttp

Activate these trace parameters only for special case analysis. It is recommended to
contact Software Support if an issue can't be analyzed otherwise. Refer to Running
traces on the Service Manager server to identify the method to activate these
parameters that creates the least additional system load and log file size.

Related topics

Server log files
Logging memory monitoring
Log switching
Dynamic debugging of user sessions or schedulers


Parameter: debugdbquery
Parameter: rtm
Special parameters: msglog
SQL parameters: sqllimit
Parameter: debugnode


1.5.1.2.2. Dbdicts containing log
information

Log information for background processes, or integrations that are implemented in
Service Manager applications is often written into dbdicts. There are log dbdicts in an
out-of-box Service Manager system, and tailored implementations may also create
such dbdicts.

Maintenance tasks include reviewing these log files for availability monitoring,
capacity planning, and performance monitoring, as well as cleaning up old records so
that the amount of records has no negative impact on the system performance.

Dbdicts with log information that serves different purposes are described in the
following table.


Dbdict                                  Area                     Description
msglog                                  Availability monitoring
syslog                                  Availability monitoring  The msglog file gives
                                                                 helpful hints when a
SMISTaskLog                             Availability monitoring  scheduled application
reportLog                               Performance monitoring   fails, as well as provides
                                                                 other information.

                                                                 The syslog file contains
                                                                 sign in and sign out
                                                                 information for all users,
                                                                 and information about
                                                                 the start and termination
                                                                 of background
                                                                 processes.

                                                                 The SMIS log contains
                                                                 messages regarding
                                                                 integrations using the
                                                                 Service Manager
                                                                 Integration Suite (SMIS).

                                                                 This is an internal log for
                                                                 report execution.

                                                                 When using the
                                                                 Reporting module,
                                                                 reporting tasks create
                                                                 reports and dashboards,
                                                                 and send notifications.
                                                                 Because these tasks are
                                                                 executed in the
                                                                 background, long
                                                                 running tasks may not be
                                                                 observed by users, but
                                                                 slow down the system
                                                                 unnoticed.


Dbdict                                  Area                    Description
stathistory
                                        Capacity planning       This is for daily tracking
systemperform                                                   of module license usage.
systemtotals
                                        Performance monitoring  This is for system load
                                                                tracking.

                                                                This is started and
                                                                stopped from System
                                                                Status > System Monitor
                                                                > Capture.

                                                                Caution

                                                                If the
                                                                Capture
                                                                functionality
                                                                is activated
                                                                for a long
                                                                time, slow
                                                                system
                                                                performance
                                                                may occur.

Related topics

Stathistory table


1.5.1.2.3. Client log files

Each Service Manager client writes a log file. For more information, see Client log file.
As the Windows client is executed on each client computer, no constant monitoring is
possible. The client log file is mainly used to troubleshoot functional misbehavior only.
The web client log file resides on the web application server. It contains information
for all client sessions, and is therefore relevant for availability and performance
monitoring.

Related topics

Client log file
Running traces on the Service Manager web client


1.5.1.2.3.1. Running traces on the Service
Manager web client

Specify trace parameters in the log4j2.properties file. This allows flexible
configuration according to analysis requirements. In order to activate the
modifications, the web application server must be restarted.
Example: A standard web tier trace configuration referred to as “sm debug trace”


log4j.logger.com.peregrine.eclipse.web=DEBUG
log4j.logger.com.hp.ov.cwc=DEBUG

appender.console.type=Console
appender.console.name=STDOUT
appender.console.layout.type=PatternLayout
# Pattern to output the caller's file name and line number.
appender.console.layout.pattern=%5p [%t] (%F:%L) - %m%n

appender.R.type=RollingFile
appender.R.name=RollingFile
appender.R.fileName= sm.log
appender.R.filePattern=sm-%i.log
appender.R.layout.type=PatternLayout
appender.R.layout.pattern=%d %-5p [%t] [%X{username}-
%X{sessionHash}] [%c] %m%n
appender.R.policies.type=Policies
appender.R.policies.size.type=SizeBasedTriggeringPolicy
appender.R.policies.size.size=5000KB
appender.R.strategy.type=DefaultRolloverStrategy
# Keep backup file
appender.R.strategy.max=9
#log for trace soap message, don't modify it.
loggers=TraceSoap
logger.TraceSoap.name=TraceSoap
logger.TraceSoap.level=debug
logger.TraceSoap.additivity=true
logger.TraceSoap.appenderRef.TraceSoap.ref=RollingFile
rootLogger.level=debug
rootLogger.appenderRefs=R
#uncomment next line to output to console
#rootLogger.appenderRef.console.ref=STDOUT
rootLogger.appenderRef.R.ref=RollingFile

There is rarely the need for a web tier trace. However, in these cases, typically it is
required to also trace browser communications using third-party tools (such as
Fiddler and Wireshark) and the Service Manager server.

Related topics


Web tier configuration files
Client log files
Knowledge required for system maintenance
````
