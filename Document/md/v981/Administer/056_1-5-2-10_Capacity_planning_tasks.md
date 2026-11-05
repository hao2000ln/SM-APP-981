---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.5.2.10 .. 1.5.2.12
printed_pages: 1368-1394
---

# 1.5.2.10 Capacity planning tasks

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.5.2.10. Capacity planning tasks

The following table lists maintenance tasks that a System Administrator needs to
perform in the Capacity Planning area. For information about other areas, see Areas
of maintenance tasks.

Event or frequency                      Task                      Automatable
Before going to
production and ongoing                  Reserve and monitor       Yes
Before going to
production                              disc space for log files

Quarterly                               Reserve and monitor       Yes

Monthly                                 sufficient RDBMS size
Quarterly
                                        limits

                                        Setting up the inactivity No
                                        timer

                                        Check license usage       No

                                        Determine a list of       No

                                        named users and update

                                        their operator records

Related topics

Service Manager maintenance tasks


1.5.2.10.1. Reserve and monitor disc space
for log files

A system administrator needs to monitor the disc space, and reserve enough space
for the log files of the Service Manager Server and web tier.

Server log files

Plan the disc space for server log files when configuring the log files initially, or when
the configuration changes (for example, by starting more servlets). Using log rotation
guarantees a maximum size for log files so that the required space can be calculated.

When the system grows, more servlets may need to be started, and starting
temporary traces to generate traces for problem analysis should be possible. Be sure
to have more disc space available than needed by the initial configuration.

Web tier log files

The web tier log file configuration depends on the web application server. Refer to the
specific documentation for your web application server.

Related topics

Service Manager maintenance tasks
Log file configuration


1.5.2.10.2. Reserve and monitor sufficient
RDBMS size limits

When configuring Service Manager systems, consider the required database sizes for
a definite time frame and monitor the data growth.
The tailored implementation and large number of tables in a Service Manager system
make predictions on required database sizes difficult, and it is therefore very
important to monitor the trends.

Related topics

Service Manager maintenance tasks
Capacity planning tasks


1.5.2.10.3. Setting up the inactivity timer

The inactivity timer is used to terminate inactive user sessions after a specified idle
time. This is important to prevent inactive sessions from still consuming licenses and
important for security reasons.

The inactivity timer is controlled by the servlet itself. There is no background process
required to be started. This implementation avoids the need to request status update
by each servlet for idle time.

For for information, see Inactivity timer.

Related topics

Inactivity timer
Capacity planning tasks


1.5.2.10.4. Determine a list of named users
and update their operator records

If named user licenses have been purchased, determine which users should log into
the system as named users and update their operator records with the Named User
checkbox.

Related topics

Named users
Capacity planning tasks


1.5.2.10.5. Check license usage

For capacity planning, check your license usage in the following ways.

Monitor the license usage by the stathistory dbdict

Generate a Service Manager License report, especially during peak hours, and
analyze the usage patterns and trends in order to prepare for any needed license
increases.

Tracking of USER and SYSTEM connections in
stathistory

User connections and system connections are tracked in the stathistory table. The
following table provides an example.

Name       Exact                        Value  Month  Day    Year

           Time

Connected 09/04/16 23                          9      4      2016

System 06:22:51

Processes

Connected 09/04/16 1292                        9      4      2016

Users      06:22:51

Two schedule records come with the out-of-box installation:

     Count USER Connections
     Count SYSTEM Connections

       Tip

       If you don't need this information, rename the class field of these
       schedule records to “agentDISABLED” to assign them for processing to
       the nonexistent background scheduler “agentDISABLED”. This removes
       the execution of processes() function which queries information from all
       servlets over the network.

Tracking of module license usage in stathistory


Module licenses are tracked by updating stathistory during the login process of each
session.
The following table provides an example of a record list.

Name      Exact                         Value  Month  Day  Service Manager 9.81
          Time                          1      9
Asset     09/02/16 1                    213                    Year
Contract  4:17:51                       987
Managem                                 1131          2    2016
ent -     09/02/16                      312
Floating  14:17:50                      25     9      2    2016
                                        1292
Change    09/02/16                             9      2    2016
Managem   14:17:51
ent -                                          9      2    2016
Floating  09/02/16
          14:17:51                             9      2    2016
Incident
Managem   09/02/16                             9      2    2016
ent -     14:17:51
Floating                                       9      2    2016
          09/02/16
Knowledg  14:17:51
e
Managem   09/02/16
ent -     14:17:51
Floating

Problem
Managem
ent -
Floating

Request
Managem
ent -
Floating

Service
Desk -
Floating

Name      Exact                         Value  Month  Day  Service Manager 9.81
          Time                                 9
                                               9               Year

SLA -     09/02/16 1292                               2    2016
Floating  14:17:51

Smart     09/02/16 1292                               2    2016

Analytics - 14:17:51

Floating

Related topics

System information record
License tracking
Stathistory table
AutoPass licensing


1.5.2.11. Cleanup tasks

The following table lists maintenance tasks that a System Administrator needs to
perform in the Cleanup area. For information about other areas, see Areas of
maintenance tasks.

Event or frequency                      Task                   Automatable
Before going to
production                              Clean up out-of-box data No
Before going to                         records
production
Before going to                         Reset sequential       No
production
                                        numbers
Before going to
production                              Reset the “Times       No
Monthly
                                        updated” field in
Daily
Weekly                                  globalists
Before startup
                                        Disable unused         No
Weekly
                                        background processes
Weekly
                                        Purge or archive data  Yes

                                        records

                                        Purge queue records    Yes

                                        Purge logs             Yes

                                        Clean up server side log Yes
                                        files

                                        Purge dbdicts containing Yes
                                        log information

                                        Clean up AUDIT* records Yes
                                        if auditing backup is
                                        turned on

Related topics

Areas of maintenance tasks



1.5.2.11.1. Clean up out-of-the-box data
records

Before the system goes live, delete all test data records and out-of-the-box
demonstration data. It's advisable that you use the predefined PurgeOutofBoxData
unload script record to remove these data records.
To purge the data, follow these steps:

   1. Go to Database Manager.
   2. Open the unload table.
   3. Select the PurgeOutofBoxData record.
   4. Make sure to purge all the listed tables.

          • To avoid purging a table, remove the line from the unload script record.
          • You can add or modify a query (for example, add name="failsave" to the
          operator line) as needed.
     It's advisable that you add knownerrortasks and rootcausetasks to the list of
     tables to purge if you have entered information during testing.

Related topics

Cleanup tasks
Purging out-of-the-box data


1.5.2.11.2. Reset sequential numbers

Before going to production, when all demonstration and test data is purged, reset the
last number in the related number or counters dbdict.

Related topics

Cleanup tasks
Purging out-of-box data
Sequential numbers


1.5.2.11.3. Reset the “Times updated” field
in globalists

Global lists are records to specify value lists to be retrieved from the database and
stored in a global variable during run-time. By this, access to the database while
preparing data to display is reduced, and the response time is reduced. Global lists
require to be refreshed from time to time to ensure that the most current data is
displayed.

By resetting the “Times updated” field in a globalist record to 0 when setting up the
system, this field can be used to understand the frequency of updates.

Related topics

Cleanup tasks


1.5.2.11.4. Disable unused background
processes

Background processes that aren't being used should be removed from the
info.startup record. The “startup” record contains a list of all background processes
that are initiated by the sm system.start line in the sm.cfg file. For example, remove
the despooler, agent and marquee lines, because they are no longer being used.

            Caution

           Do not remove the Sync process, because it is very important for
           cleaning up sessions, memory, and so on.

Related topics

Cleanup tasks


1.5.2.11.5. Purge or archive data records

How to purge or archive data records depends on the requirements of your corporate
data retention policy or local laws. User data includes interactions, incidents,
problems, changes, and so on.

A typical purge or archive strategy is to archive and delete all incidents that were
closed more than <x> months ago.

Business data (for example, an incident) is stored in many tables: The main
information is stored in probsummary records; however, there are clock records, file
attachments in the SYSATTACHMENTS dbdict, and relation to interactions, change
requests, and problems in the screlation dbdict. Additionally, dbdicts as specified in
the Object record may also contain information, for example, for activities and so on.

There are multiple options to implement purging or archiving: the Purge/Archive utility,
custom implementation inside Service Manager, and custom implementation by an
RDBMS implementation. The Purge/Archive utility allows you to set up data maps to
archive records along with all of their related records.

Related topics

Cleanup tasks
Purging and archiving records
Archiving and viewing archived Service Manager data using RDBMS Methods


1.5.2.11.6. Purge queue records

Clean up old records from the dbdicts described in the following table.

Dbdict                                  Description
schedule
                                        Old schedule records that are in
                                        application error status and no longer
                                        required for issue analysis should be
                                        removed.

                                        Executing schedule records that were
                                        not processed with a longer delay may
                                        not be adequate, and they therefore
                                        should be purged. For example
                                        "message processor records"? are
                                        used to send on-screen messages to a
                                        user session. Other records, however,
                                        require to be executed still.

eventin, eventout                       Event services queue for email and
                                        some other integrations

Related topics

Cleanup tasks
Purging and archiving records
Archiving and viewing archived Service Manager data using RDBMS Methods


1.5.2.11.7. Purge logs

Log information in server and client log files, dbdicts containing log information, and
web tier log files require to be cleaned up frequently to prevent log files from growing
to an unmanageable size, and to avoid Disc Full situations or performance impacts
because of huge tables on the relational database system.

The cleanup of web tier log files is managed by the web application server.

Clean up server side log files

It is good practice to remove the log files completely or move them to a separate
folder or even another network location before every startup of Service Manager.

            Note

           Some countries have laws regarding which information may be captured
           in log files and how long log files may by stored before they need to be
           destroyed. The Service Manager Administrator shall assume responsibility
           to comply with the local rules.

Purge dbdicts containing log information

Old records in dbdicts containing log information should be cleaned up frequently.
The following table describes out-of-box dbdicts containing log information.

Dbdict                                                                                          Service Manager 9.81
msglog, syslog
stathistory                             Description

systemperform, systemtotals             Internal log files

                                        Used for daily tracking of module
                                        license usage

                                        Used for system load tracking.
                                        This is started and stopped from
                                        System Status > System Monitor >
                                        Capture.

                                                    Caution

                                                   Keeping this activated for a
                                                   long time may cause slow
                                                   performance.

The dbdicts can be purged automatically by scheduling an archive or purge. The out-
of-box system provides a background purge to clear the msglog and syslog records
that are over 7 days old. Modify the purge interval if needed. To do this, go to the
schedule table from the Database Manager and search for “background
purge/archive”. You can modify the purge/archive parameters on the Strings tab.

Related topics

Cleanup tasks
Purging and archiving records
Dbdicts containing log information
Purge the SMIS task log records


1.5.2.11.7.1. Clean up AUDIT* records if
auditing backup is turned on

If you have backups turned on for auditing changes, clean up all AUDIT* forms, links,
format controls, and so on.

            Note

           To turn on auditing backup, go to Tailoring > Audit > Turn Auditing
           On/Off, and then select the Do you want to keep backups of Changes
           option.

            Important

           We strongly recommend turning off “keep backups of changes” in a
           production system. You can use this feature on development, but should
           purge the AUDIT* records there at the end of each development cycle.

Related topics

Cleanup tasks
Purging and archiving records
Dbdicts containing log information
Purge the SMIS task log records


1.5.2.12. Online support tasks

The following table lists maintenance tasks that a System Administrator needs to
perform in the Online Support area. For information about other areas, see Areas of
maintenance tasks.

Event or frequency                      Task                   Automatable
Before going to                                                No
production                              Register to Software   No
Weekly                                  Support                No

Before going to                         Subscribe to Service   No
production                              Manager product news
                                                               No
Before going to                         Bookmark the Service
production                              Manager security
                                        bulletins
Before going to
production                              Bookmark the Service
                                        Manager Document
                                        Matrix

                                        Check for news on the
                                        Support web site and
                                        community

Related topics

Areas of maintenance tasks


1.5.2.12.1. Register to Software support

The Software Support web site is a communication channel to Software Support to
log support requests, research the knowledge base, download software, and join
the community.
Register for a Software Passport and enter your Support Agreement IDs (SAID).
Additionally, bookmark the Software Support Site Reference and User Guides:
https://softwaresupport.softwaregrp.com/site-reference-user-guides

Related topics

Online support tasks
Contact support


1.5.2.12.2. Subscribe to Service Manager
product news

The Software Support web site allows you to subscribe to product news sent through
email notifications. Use the link below to configure the notification service according
to your requirements.
https://portal.microfocus.com/s/subscriberproduct

Related topics

Online support tasks
Software Support


1.5.2.12.3. Bookmark the Service Manager
security bulletins

In order to keep informed about security alerts for the Service Manager product, be
sure to bookmark the Service Manager security bulletins:
https://www.microfocus.com/en-us/support/security/

Related topics

Online support tasks
Service Manager Security Bulletins
Service Manager Document Matrix


1.5.2.12.4. Bookmark the Service Manager
Document Matrix

Bookmark the Service Manager Document Matrix for quick access to all Service
Manager related documentation:
https://portal.microfocus.com/s/article/KM000002518

Related topics

Online support tasks
Service Manager Security Bulletins


1.5.2.12.5. Check for news on the Support
web site and community

Administering a Service Manager installation is a daily routine for many
administrators. Participating in a forum to learn experiences and best practices from
the community is a great opportunity to grow.

We provide an internet forum where administrators can discuss issues and share
knowledge:

https://community.softwaregrp.com/t5/SMA-Service-Manager-Suite/ct-p/sws-SMgr

Related topics

Online support tasks
Service Manager Support Customer Forum
Service Manager Security Bulletins
Service Manager Document Matrix
````
