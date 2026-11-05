---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.2.27 .. 1.2.27.14
printed_pages: 885-910
---

# 1.2.27 System performance parameters

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.27. System performance parameters

These parameters determine how the server manages system memory and fail over.
You can set these parameters from the Service Manager server's operating system
command prompt or from the Service Manager initialization file (sm.ini).


Startup parameter                       Description

Startup parameter: agstackl             Defines the length of the stack the
                                        Service Manager server allocates to
                                        run RAD applications

Startup parameter: arraysizelimit       Defines the maximum number of
                                        entries in an array.

Parameter: attachmentsegmentsize        Determines the maximum number of
                                        bytes that each segment record in the
                                        SYSATTACHMENTS table can use

Startup parameter:                      Defines the interval that the Service
cache_clean_interval                    Manager server waits before clearing
                                        the cache of infrequently used entries

Startup parameter: cache_locks          Defines the number of locks that the
                                        Service Manager server allocates to
                                        the cache table

Startup parameter: cache_slots          Defines the number of hash slots that
                                        the Service Manager server allocates
                                        to the cache table

Startup parameter: dao_sessiontimeout Specifies the number of seconds that
                                              the Service Manager server waits
                                              before terminating RESTful threads

Startup parameter:                      Specifies the maximum number of
dao_threadsperprocess                   threads allowed to run concurrently in
                                        the process for a RESTful web service
                                        application

Startup parameter: anubisPollInterval   Specifies the time interval (in seconds)
                                        at which the anubis monitor checks to
                                        see if any registered scheduler is alive

Startup parameter:                      Starts the anubis monitor to check the
enableAnubisMonitor                     status of background scheduler
                                        threads


Startup parameter                       Description

Startup parameter:                      Defines a timeout value in seconds for
KMSearchEngineTimeout                   all Knowledge Management search
                                        server hosts

Startup parameter: maxgroupsperview Defines the maximum number of
                                              groups that can be used in a view

Startup parameter:                      Defines the maximum response size (in
maxhttpreqresponse                      bytes) for HTTP requests

Startup parameter:                      Allows you to override the Apache
maxKeepAliveRequests                    Tomcat server limit of processing 100
                                        requests before ending a session

Startup parameter: maxloginspercluster Enables or disables Max Logins at the
                                              cluster level

Startup parameter:                      Defines the maximum number of bytes
maxmsgsharedmemory                      of shared memory that the Service
                                        Manager server can use for unviewed
                                        messages

Startup parameter: maxpagesize          Defines the maximum number of
                                        records that the Windows client
                                        requests from the server when
                                        displaying a record list

Startup parameter: memmanager           Specifies the memory manager to be
                                        used

Startup parameter: precision            Defines the number of decimal places
                                        at which the Service Manager server
                                        rounds numeric fields

Startup parameter: recordlistcount      Sets the default number of records
                                        displayed in a record list.


Startup parameter                       Description
Startup parameter: shared_memory
Parameter: semaphoreWaitTime            Defines the amount of memory the
                                        Service Manager server sets aside for
Startup parameter:                      system caches and lock tables
shared_memory_address
Startup parameter: shutipc              Defines the number of seconds the
Parameter: strongtypecheck              Service Manager server waits for a
Startup parameter: tmpdirectory         semaphore before generating a core
                                        dump
Startup parameter: usealtsignalstack
Startup parameter: usemembar            Ensures that the shared memory
Parameter: vj_record_limit              allocation is kept in an area that will not
Parameter: vj_record_warning            interfere with other applications on the
                                        server or the operating system

                                        Causes the Service Manager server to
                                        remove all IPC shared memory and
                                        semaphores

                                        Specifies the strong type checking
                                        times for database records

                                        Defines the path where the Service
                                        Manager server can create and find
                                        temporary files for any file operation
                                        with Client Side Load/Unload and
                                        attachment handling

                                        Causes processes to handle
                                        StackOverFlow exceptions correctly

                                        Used by Service Manager to create a
                                        JVM

                                        Sets the maximum number of records a
                                        virtual join may return on a subform

                                        Specifies when the system writes a
                                        message to log file about virtual join
                                        record requests


Related topics

System parameters
Enter a parameter in the sm.ini file


1.2.27.1. Startup parameter: arraysizelimit

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

arraysizelimit

Description

Defines the maximum number of entries in an array (for example, a drop-down box).

Valid if set from

Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

About 171 millions (this is the value used when this parameter is not specified or
specified with an empty value)

Possible values

Any positive integer

Example usage

Initialization file: arraysizelimit:20

Related topics

System parameters
Enter a parameter in the sm.ini file
System information parameters


1.2.27.2. Parameter:
attachmentsegmentsize

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

attachmentsegmentsize

Description

This parameter determines the maximum number of bytes that each segment record
in the SYSATTACHMENTS table can use. You can use this parameter to reduce the
number of segments that the Service Manager server divides attachments into when
it stores them in the SYSATTACHMENTS table. No single attachment can exceed
2147483647 bytes.

            Note

          If the size of an attachment is less than the attachmentsegmentsize value,
           the Service Manager server allocates memory based on the actual
          attachment size instead of the attachmentsegmentsize value.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

512,000 (bytes)

Possible values

Number of bytes up to 2147483647 (2 GB) maximum

Example usage

Command line: sm -httpPort:13080 -attachmentsegmentsize:65536


Initialization file: attachmentsegmentsize:65536

Related topics

System parameters
Enter a parameter in the sm.ini file
System performance parameters


1.2.27.3. Parameter: strongtypecheck

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

strongtypecheck

Description

This parameter specifies the strong type checking times for database records.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

0

Possible values

0, 1, 2, 3
The bigger value, the more checks.

Example usage

Command line: sm -strongtypecheck:3
Initialization file: -strongtypecheck:3

Related topics

System parameters
Enter a parameter in the sm.ini file
System performance parameters


1.2.27.4. Startup parameter:
anubisPollInterval

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

anubisPollInterval

Description

This parameter specifies the time interval (in seconds) at which the anubis monitor
checks to see if any registered scheduler is alive.

This parameter should be used in conjunction with the enableAnubisMonitor
parameter.

Important: The ThreadControllerId-background thread, which can be started no
matter whether enableAnubisMonitor is enabled or not, has been modified to
additionally include the anubis monitor functionality and thus eliminated the need for
the anubis process. You are recommended to use the new anubis parameters instead
of the old anubis process. If an anubis agent record and anubis schedule record,
which were used to restart stopped background processes automatically, already
exist in your system, before enabling enableAnubisMonitor you need to disable the
original anubis RAD applications as follows:

   1. Delete the existing anubis agent record.
        1. Type info on the Service Manager command line, and click Search.
        2. Delete the anubis agent record.

   2. Delete the existing anubis schedule record.
        1. Type sch on the Service Manager command line, and click Search.
        2. Delete the anubis schedule record.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value


15 (seconds)

Possible values

Number of seconds

Example usage

Command line: sm scheduler agent 30 4 -anubisPollInterval:15
Initialization file: anubisPollInterval:15

            Note

           To use this parameter in a horizontally scaled environment, you must add
           this parameter to all sm.ini files.

Related topics

System parameters
Enter a parameter in the sm.ini file
Enter a parameter in sm.cfg or the server’s OS command prompt
Restart stopped background processes automatically
System performance parameters
Startup parameter: enableAnubisMonitor


1.2.27.5. Startup parameter:
cache_clean_interval

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

cache_clean_interval

Description

This parameter defines the interval the Service Manager server waits before clearing
the cache of infrequently used entries. This parameter works in conjunction with the -
sync parameter.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

No. Requires a restart of the sm -sync process.

Default value

3600

Possible values

Number of seconds

Example usage

Command line: sm -sync -cache_clean_interval:4800
Initialization file: cache_clean_interval:4800

Related topics

System parameters
Enter a parameter in the sm.ini file
System performance parameters


1.2.27.6. Startup parameter: cache_locks

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

cache_locks

Description

This parameter defines the number of locks the Service Manager server allocates to
the cache table. By default, the lock granularity is one lock for each hash slot.
The lock count you specify must be bigger than zero (0) and no more than the
number of hash slots that's specified in Startup parameter: cache_slots. If you specify
an invalid value for this parameter, the default value is used.

            Note

           This parameter solves the performance issue in versions earlier than 9.33
           that the system may encounter slowness at peak load because earlier
           versions use the entire hash table as the lock granularity.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

9973

Possible values

Greater than 0 and no more than the number of hash slots

Example usage

Command line: sm -httpPort:13080 -cache_locks:2000
Initialization file: cache_locks:2000


Related topics

System parameters
Enter a parameter in the sm.ini file
System performance parameters


1.2.27.7. Startup parameter: cache_slots

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

cache_slots

Description

This parameter defines the number of hash slots the Service Manager server
allocates to the cache table. You can use the reportcache parameter to gauge the
effectiveness of your cache allocation.

            Note

           If this parameter is not set or set to be greater than 100,000 or less than
           300, the default value (9973) is used; if it is set to a non-prime number,
           the smaller one of its neighboring prime numbers is used instead.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

9973

Possible values

300 - 100000

Example usage

Command line: sm -httpPort:13080 -cache_slots:2000
Initialization file: cache_slots:2000

Related topics


System parameters
Enter a parameter in the sm.ini file
System performance parameters


1.2.27.8. Startup parameter:
dao_sessiontimeout

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

dao_sessiontimeout

Description

This parameter specifies the seconds Service Manager server to wait before
terminating RESTful threads. Unless the client sends subsequent requests within the
timeout, the Service Manager server will recycle the session for re-use and re-
allocate it on demand.
If there is large divergence, we recommend that you connect several servlets with
different thresholds.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

15 (seconds)

            Note

           Change this default value to another proper value according to the Restful
           API call interval. For example, if the Restful API call interval is 30 seconds,
           set this value to a little bigger than 30.

Possible values

Number of seconds

Example usage


Command line: sm -httpPort:13080 -dao_sessiontimeout:20

Initialization file: dao_sessiontimeout:20

Related topics

System parameters
Enter a parameter in the sm.ini file
System performance parameters


1.2.27.9. Startup parameter:
dao_threadsperprocess

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

dao_threadsperprocess

Description

This parameter specifies the maximum number of threads allowed to run concurrently
in the process for a RESTful Web Service application.

It is good to start enough server threads to handle requests. We recommend that you
maintain a buffer of 30% to 40% spare capacity.

            Note

           The dao_threadsperprocess parameter is limited by the
           threadsperprocess parameter (default value: 240). If you use the
           dao_threadsperprocess parameter, make sure that you also update the
           threadsperprocess parameter to a value not less than the value of
           dao_threadsperprocess. For example, you need to change the value of
           threadsperprocess to 250 when you enable dao_threadsperprocess with
           its default value.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

240

Possible values

Number of threads


Example usage

Command line: sm -httpPort:13080 -dao_threadsperprocess: 240
Initialization file: dao_threadsperprocess:240

Related topics

System parameters
Enter a parameter in the sm.ini file
System performance parameters


1.2.27.10. Startup parameter:
dashboard_export_path

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

dashboard_export_path

Description

This parameter specifies the path to export the generated report and dashboard files.

            Note

           To export the generated reports, you must start a background schedule
           process by running the sm report.export command.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

None

Possible values

A directory on the Service Manager Server host

Example usage

Initialization file: dashboard_export_path:C:\Reports

Related topics

System parameters
Enter a parameter in the sm.ini file
Database parameters


1.2.27.11. Startup parameter:
dashboardquerycache_enable

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

dashboardquerycache_enable

Description

This parameter defines whether caching query results in the database is enabled or
disabled.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

1 (enabled)

Possible values

0 (disabled)

Example usage

Command line: sm -httpPort:13080 -dashboardquerycache_enable:1
Initialization file: dashboardquerycache_enable:1

Related topics

System parameters
Enter a parameter in the sm.ini file
Database parameters


1.2.27.12. Startup parameter:
dashboardquerycache_dbtime

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

dashboardquerycache_dbtime

Description

This parameter defines the time threshold in milliseconds for queries against the
database when a report is generated. If the time exceeds this threshold, Service
Manager saves the query results to the reporting cache.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

100

Possible values

Number of milliseconds

Example usage

Command line: sm -httpPort:13080 -dashboardquerycache_dbtime:100
Initialization file: dashboardquerycache_dbtime:100

Related topics

System parameters
Enter a parameter in the sm.ini file
Database parameters


1.2.27.13. Startup parameter:
dashboardquerycache_expire

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

dashboardquerycache_expire

Description

This parameter defines the expiration time in minutes of one database query in
reporting cache.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

10

Possible values

Number of minutes

Example usage

Command line: sm -httpPort:13080 -dashboardquerycache_expire:10
Initialization file: dashboardquerycache_expire:10

Related topics

System parameters
Enter a parameter in the sm.ini file
Database parameters


1.2.27.14. Startup parameter:
dashboardonreplicatedb

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

dashboardonreplicatedb

Description

This parameter defines whether queries against a replicated database for dashboard
reporting are enabled.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

None

Possible values

None

Example usage

Initialization file: dashboardonreplicatedb

Related topics

System parameters
Enter a parameter in the sm.ini file
Database parameters
````
