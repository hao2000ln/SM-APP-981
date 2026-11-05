---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.2.27.15 .. 1.2.27.31
printed_pages: 910-932
---

# 1.2.27.15 Startup parameter: enableAnubisMonitor

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.27.15. Startup parameter:
enableAnubisMonitor

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

enableAnubisMonitor

Description

This parameter starts the anubis monitor to check the status of background scheduler threads.
By default, this parameter is disabled.

This parameter should be used in conjunction with the anubisPollInterval parameter, which
specifies the time interval (in seconds) at which the anubis monitor checks to see if any
registered scheduler is alive (default: 15 seconds).

The following table describes different system behaviors based on the value of this parameter.

Value                                   Description
1 or empty                              Enabled
0                                       Disabled

                                        Note

                                        By default, this parameter is not
                                        specified and a value of "0" is
                                        used.

Important: The ThreadControllerId-background thread, which can be started no matter whether
enableAnubisMonitor is enabled or not, has been modified to additionally include the anubis
monitor functionality and thus eliminated the need for the anubis process. You are recommended
to use the new anubis parameters instead of the old anubis process. If an anubis agent record
and anubis schedule record, which were used to restart stopped background processes
automatically, already exist in your system, before enabling enableAnubisMonitor you need to
disable the original anubis RAD applications. To do this, follow these steps:

   1. Delete the existing anubis agent record.
        1. Type info on the Service Manager command line, and then click Search.
        2. Delete the anubis agent record.

   2. Delete the existing anubis schedule record.
        1. Type sch on the Service Manager command line, and then click Search.


        2. Delete the anubis schedule record.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

0 (Disabled)

Possible values

0: Disabled
1 or empty: Enabled

Example usage

Command line: sm scheduler agent 30 4 -enableAnubisMonitor:1
Initialization file: enableAnubisMonitor:1

            Note

           To use this parameter in a horizontally scaled environment, you must add this
           parameter to all sm.ini files.

Related topics

System parameters
Enter a parameter in the sm.ini file
Enter a parameter in sm.cfg or the server’s OS command prompt
Restart stopped background processes automatically
System performance parameters
Startup parameter: anubisPollInterval


1.2.27.16. Startup parameter:
KMSearchEngineTimeout

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

KMSearchEngineTimeout

Description

This parameter defines a timeout value in seconds for all Knowledge Management search server
hosts (including indexing hosts, search hosts, and load balancer hosts). The default is 20
seconds, and the minimum is 10 seconds.

This parameter is used to prevent overloaded KM search servers from causing Service Manager
to hang. When a search server host hangs (for example, because of 100% CPU usage), the
Service Manager server tries to connect to the search server repeatedly until the timeout of the
connection. The Service Manager server then returns an error.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of Service Manager server?

Yes

Default value

20 (seconds)

Possible values

No less than 10 seconds (if you specify a value less than 10, 10 is used.)

Example usage

Command line: sm -httpPort:13080 -KMSearchEngineTimeout:25

Initialization file: KMSearchEngineTimeout:25

Related topics

System parameters
Enter a parameter in the sm.ini file
System performance parameters


1.2.27.17. Startup parameter:
maxgroupsperview

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

maxgroupsperview

Description

This parameter defines the maximum number of groups that can be used in a view. When a user
selects a view from the View list whose group count exceeds the limit, only the maximum allowed
number of groups are displayed in the view, and the following message displays in the client UI:

"Maximum number of groups (xxxx) exceeded. Please modify the view definition to reduce the
number of groups."

Note: This limit would be useful if a user runs a poorly created view that causes the servlets to
consume too much CPU and memory and terminate the servlets.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

5000 (groups)

Possible values

500 or greater. If a value less than 500 is specified, Service Manager will ignore the value and
use 500 instead. A warning message will also occur in the sm.log file: "A maxgroupsperview
value less than 500 specified and ignored. 500 is used."

Example usage

Command line: sm -httpPort:13080 -maxgroupsperview:6000

Initialization file: maxgroupsperview:6000

Related topics

System parameters
Enter a parameter in the sm.ini file
System performance parameters


1.2.27.18. Startup parameter:
maxhttpreqresponse

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

maxhttpreqresponse

Description

This parameter defines the maximum response size (in bytes) for HTTP requests that are issued
by using the doHTTPRequest JavaScript global method. Huge HTTP responses may result in high
CPU utilization and memory consumption, and subsequently impact the performance of Service
Manager. If the response size exceeds the value of maxhttpreqresponse, the doHTTPRequest call
fails and an exception is generated.
A zero value disables the feature, which means there is no size limit.

            Note

           This parameter doesn't limit the response sizes of doSOAPRequest calls.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

20971520 (20MB)

Possible values

0: No size limit
Any size limit (in bytes)

Related topics

System parameters
Enter a parameter in the sm.ini file
JavaScript global method: doHTTPRequest
JavaScript global method: doSOAPRequest


1.2.27.19. Startup parameter:
maxKeepAliveRequests

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

maxKeepAliveRequests

Description

This parameter allows you to override the Apache Tomcat server limit of processing 100 requests
before ending a session. You can set a higher limit on the number of requests to be processed
before the Service Manager server closes the connection.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

100

Example usage

Command line: sm -maxKeepAliveRequests:250
Initialization file: maxKeepAliveRequests:250

Related topics

System parameters
Enter a parameter in the sm.ini file
System performance parameters


1.2.27.20. Startup parameter:
maxloginspercluster

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

maxloginspercluster

Description

In a horizontal scaling implementation, the maximum number of logins for operators is enforced
at the cluster level. This parameter allows administrators to turn off this feature. By default, this
parameter is set to 1, which means maximum number of logins for operators is enforced by
counting each operator's logins on all cluster hosts. When this parameter is set to 0, only logins
on the local host are counted.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of Service Manager server?

Yes

Default value

1

Possible values

0 (Disable Max Logins at the cluster level)

1 (Enable Max Logins at the cluster level)

Example usage

Command line: sm -httpPort:13080 -maxloginspercluster:0

Initialization file: maxloginspercluster:0

Related topics

System parameters
Enter a parameter in the sm.ini file
System performance parameters


1.2.27.21. Startup parameter:
maxmsgsharedmemory

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

maxmsgsharedmemory

Description

This parameter defines the maximum number of bytes of shared memory that the Service
Manager server can use for unviewed messages.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

Ten percent (10%) of the shared memory or 1 GB (1073741824), whichever is less.

Possible values

Size in bytes

Example usage

Command line: sm -httpPort:13080 -maxmsgsharedmemory:5120000
Initialization file: maxmsgsharedmemory:5120000

Related topics

System parameters
Enter a parameter in the sm.ini file
System performance parameters


1.2.27.22. Startup parameter: maxpagesize

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

maxpagesize

Description

This parameter defines the maximum number of records that the Windows client requests from
the server when the client displays a record list. This helps to avoid high memory consumption by
getList requests when the Record list request count option in the Windows client preferences is
set to a large value.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

No (only requires a re-login)

Default value

8000

Possible values

0: No size limit
8000 to 80,000

Example usage

Command line: sm -httpPort:13080 -maxpagesize:10000
Initialization file: maxpagesize:10000

Related topics

System parameters
Enter a parameter in the sm.ini file
System performance parameters


1.2.27.23. Startup parameter: memmanager

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

memmanager

Description

Specifies the memory manager to be used.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

utpool

Possible values

utpool, malloc

Example usage

Command line: sm -memmanager:utpool
Service Manager Initialization (sm.ini) file: memmanager:utpool

Related topics

System parameters
Enter a parameter in the sm.ini file
System performance parameters


1.2.27.24. Startup parameter: precision

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

precision

Description

This parameter defines the number of decimal places at which the Service Manager server
rounds numeric fields. By default, the Service Manager server rounds to six decimal places.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

6

Possible values

Number of decimal places at which to round

Example usage

Command line: sm -httpPort:13080 -precision:5
Initialization file: precision:5

Related topics

System parameters
Enter a parameter in the sm.ini file
System performance parameters


1.2.27.25. Startup parameter: recordlistcount

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

recordlistcount

Description

Set the default number of records displayed in a record list.

Valid if set from

Start up file (sm.ini)

Requires restart of server?

No

Default value

None

Possible values

Any positive integer

            Note

           You can only set the value to 25, 50 and 100 for the Service Manager web tier. Any
           value other than 25, 50 and 100 will be reset to 50.

Example usage

Start up file: recordlistcount:50

Related topics

Setting Windows client preferences from the server
Client parameters for Windows clients


1.2.27.26. Parameter: semaphoreWaitTime

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

semaphoreWaitTime

Description

This parameter defines the number of seconds the Service Manager server waits for a
semaphore before generating a core dump. The default is 0 (no core dump will be generated).

            Note

           This parameter takes effect on Windows servers only.

To use this functionality, be sure to set the enablecoredump parameter to 1. The following table
describes the server behavior when these two parameters are set to 1 or 0.

Enablecoredump value                    semaphoreWaitTime value  Behavior
1                                       n
                                                                 The server generates a core
0                                       n                        dump after waiting n
1 or 0                                  0                        seconds for a semaphore.

                                                                 The server doesn't generate
                                                                 a core dump.

                                                                 The server doesn't generate
                                                                 a core dump.

Valid if set from

Server's operating system command prompt
Initialization (sm.ini) file

Requires restart of the Service Manager server?

Yes

Default value

0

Possible values

0 or n seconds


Example usage

Command line: sm -enablecoredump:1 – semaphoreWaitTime:10

Initialization file: semaphoreWaitTime:10

Related topics

System parameters
Enter a parameter in the sm.ini file
Debugging parameters
Parameter: enablecoredump


1.2.27.27. Startup parameter: shared_memory

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's OS command prompt.

Parameter

shared_memory

Description

This parameter defines the amount of memory the Service Manager server sets aside for system
caches and lock tables. The Service Manager add-on product, IR Expert, also relies heavily upon
shared memory. You can set this parameter from the Configure server utility.

Notes:

     We recommend that you set this parameter to 268,435,456 (256 MB) or greater. If this
     parameter has a value less than 256 MB, a warning message occurs in the server log file
     (sm.log). To remove this warning, change the value to 256 MB or greater.

     You can read and use the sysctl.conf file to control this parameter. To set proper OS
     parameters, copy the <Service Manager server installation path>/RUN/97-sm-
     sysctl.conf file into /etc/sysctl.d directory.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of Service Manager server?

Yes

Default value

536,870,912 bytes (512 MB)

Possible values

Number of bytes

Example usage

Command line: sm -httpPort:13080 -shared_memory:536870912
Initialization file: shared_memory:536870912

Related topics

System parameters
Enter a parameter in the sm.ini file


System performance parameters
Shared memory


1.2.27.28. Startup parameter:
shared_memory_address

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

            Note

           You should only use this parameter when instructed to do so by the company's
           Customer Support.

Parameter

shared_memory_address

Description

This parameter can be used on all operating systems to ensure that shared memory allocation is
kept in an area that will not interfere with shared libraries, stacks, heaps or other memory related
data structures. You can use this parameter to specify a new address that has enough
contiguous memory for the Service Manager process.
If you encounter a shared memory allocation failure, the address that the Service Manager
process is using doesn't have enough contiguous memory. On Windows, the sm.log file lists
recommendations for possible shared_memory_address parameter values. If the debugvmmap
parameter is active, the log also contains a map of virtual memory at the time of the failure.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

On Linux: 0x50000000
On Windows: Dynamically determined

Possible values

A memory address in a decimal, hexadecimal, or octal format.

Example usage

Command line: sm -httpPort:13080 -shared_memory_address:0x80000000
Initialization file: shared_memory_address:0x80000000


Example sm.log file that's generated when you encounter a shared memory allocation failure

6116( 2716) 03/05/2010 11:06:41 RTE E shmat: MapViewOfFileEx failed

6116( 2716) 03/05/2010 11:06:41 RTE E Error 487 in call MapViewOfFileEx

- Attempt to access invalid address.

6116( 2716) 03/05/2010 11:06:41 RTE E sm_init: shmat( 516, 0x73000000,

0 ) failed for size 67108864 and key 0x2A02E500

6116( 2716) 03/05/2010 11:06:41 RTE I List of possible

shared_memory_address parameter settings for a shared memory size of

67108864 (64 MB)

6116( 2716) 03/05/2010 11:06:41 RTE I # Free range 0x7FFF0000-

0xFFFAD000 size=2147209216 (2047 MB)

6116( 2716) 03/05/2010 11:06:41 RTE I Preferred         :

shared_memory_address:0x80000000

6116( 2716) 03/05/2010 11:06:41 RTE I Lowest available :

shared_memory_address:0x80000000

6116( 2716) 03/05/2010 11:06:41 RTE I Highest available:

shared_memory_address:0xFBFA0000

6116( 2716) 03/05/2010 11:06:41 RTE I For a complete list of available

shared_mempory_address settings, run with the debugvmmap parameter.

6116( 2716) 03/05/2010 11:06:41 RTE W !!! Use the preferred

shared_memory_address parameter above

6116( 2716) 03/05/2010 11:06:41 RTE W !!! or remove the

shared_memory_address parameter completely.

6116( 2716) 03/05/2010 11:06:41 RTE E HP Service Manager is unable to

start. Failed to initialize or attach to shared memory environment

Related topics

System parameters
Enter a parameter in the sm.ini file
System performance parameters
Shared memory


1.2.27.29. Startup parameter: shutipc

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

shutipc

Description

Using this parameter at the operating system command prompt causes the Service Manager
server to remove all IPC shared memory and semaphores.

            Note

           This command is only for Linux systems. On a Windows system this command
           doesn'thing and is not needed.

Valid if set from

Server's operating system command prompt

Requires restart of the Service Manager server?

No

Default value

None

Possible values

None

Example usage

Command line: sm -shutipc

Related topics

System parameters
Enter a parameter in the sm.ini file
System performance parameters


1.2.27.30. Startup parameter: tmpdirectory

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

tmpdirectory

Description

This parameter defines the path where the Service Manager server can create and find
temporary files for any file operation with Client Side Load/Unload and attachment handling.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

Linux: /var/tmp

Windows: The possible existence of environment variables are:

     The path specified by the TMP environment variable.
     The path specified by the TEMP environment variable.
     The path specified by the USERPROFILE environment variable.
     The Windows directory.

For more information about the tmpdirectory parameter, see GetTempPath.

Possible values

Path to temporary files

Example usage

Command line: sm -httpPort:13080 -tmpdirectory:temp
Initialization file: tmpdirectory:temp

Related topics

System parameters
Enter a parameter in the sm.ini file
System performance parameters


1.2.27.31. Startup parameter: unlockdatabase

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

unlockdatabase

Description

When a system is started either in a vertically-scaled implementation or in a horizontally-scaled
implementation, a unique key is generated and saved in the database as a lock record. The lock
record prevents another Service Manager system starting, so as not to use the same database.
However, this causes the backup server to fail to start when the primary server is abruptly
brought down. This parameter allows the System Administrator to clean up the database lock
record by issuing the sm -unlockdatabase command, and then starting the backup server.

            Note

           The unlock database functionality is needed only when you are switching the Service
           Manager product from one host to another host.

Valid if set from

Server's operating system command prompt

Requires restart of the Service Manager server?

Yes

Default value

None

Possible values

None

Example usage

Command line: sm -unlockdatabase

            Note

           Do not add this parameter to the sm.ini file.

Related topics

System parameters
Enter a parameter in the sm.ini file


System performance parameters
````
