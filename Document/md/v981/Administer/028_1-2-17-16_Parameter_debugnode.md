---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.2.17.16 .. 1.2.17.29
printed_pages: 642-661
---

# 1.2.17.16 Parameter: debugnode

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.17.16. Parameter: debugnode

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

debugnode

Description

When a process is started, it registers itself through loadBalancer so that loadBalancer can forward
clients to the process. When System Administrators need to debug issues, they can start a process
in debug mode to register with loadBalancer that this process is being debugged. LoadBalancer
doesn't forward any clients to the process while debugnode is active.

The following table describes the behavior based on the value of this parameter.

Value                                   Behavior
1 or empty                              The process is in debug mode.
0                                       The process is not in debug mode.

                                        Note

                                        By default, this parameter is not
                                        specified and value "0" is used.

            Caution

           Do not add this parameter to the sm.ini file. If you do this, all the sm processes that
           share the same sm,ini file are set as a debug node.

Valid if set from

Server's operating system command prompt

Requires restart of the Service Manager server?

No

Default value

0 (this is the value used when this parameter is not specified)

Possible values

0, 1, or empty


Example usage

To set a process as a debug node: sm -httpPort:13081 -debugnode:1 (or sm -httpPort:13081 -
debugnode)

Related topics

System parameters
Enter a parameter in the sm.ini file
Debugging parameters


1.2.17.17. Parameter: debugprocesses

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

debugprocesses

Description

This parameter causes the Service Manager server to write process creation and termination
messages to the log file.

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

Command line: sm -httpPort:13080 -debugprocesses
Initialization file: debugprocesses

Related topics

System parameters
Enter a parameter in the sm.ini file
Debugging parameters


1.2.17.18. Parameter: debugrest

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

debugrest

Description

This parameter enables the Service Manager server to write detailed log trace for RESTful web
services diagnostics. by default, this feature is disabled.
To use this debugging parameter, set it to 1, then restart the Service Manager server and re-run the
RESTful web service application.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

0

Possible values

0: Disable
1: Enable

Example usage

Command line: sm -httpPort:13080 -debugrest:1
Initialization file: debugrest:1

Related topics

System parameters
Enter a parameter in the sm.ini file
Debugging parameters


1.2.17.19. Parameter: debugrs

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

debugrs

Description

This parameter causes the Service Manager server to write detailed messages about resource
locks to the log file. Service Manager only writes messages about resource locks that exceed the
lock time threshold you specify. Enabling this parameter can cause your log file to increase in size
very quickly. Only do so at the direction of Customer Support.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

None

Possible values

Number of milliseconds

Example usage

Command line: sm -httpPort:13080 -debugrs:1000

Initialization file: debugrs:1000

Related topics

System parameters
Enter a parameter in the sm.ini file
Debugging parameters


1.2.17.20. Parameter: debugscauto

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

debugscauto

Description

This parameter causes the Service Manager server to write detailed messages about SCAuto
connections to the log file.

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

Command line: sm -httpPort:12690 -debugscauto
Initialization file: debugscauto

Related topics

System parameters
Enter a parameter in the sm.ini file
Debugging parameters


1.2.17.21. Parameter: debugshutdown

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

debugshutdown

Description

This parameter causes the Service Manager server to write shutdown messages to the log file.

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

Command line: sm -httpPort:13080 -debugshutdown
Initialization file: debugshutdown

Related topics

System parameters
Enter a parameter in the sm.ini file
Debugging parameters


1.2.17.22. Parameter: debugstartup

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

debugstartup

Description

This parameter causes the Service Manager server to write start up messages to the log file.

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

Command line: sm -httpPort:13080 -debugstartup
Initialization file: debugstartup

Related topics

System parameters
Enter a parameter in the sm.ini file
Debugging parameters


1.2.17.23. Parameter: debugvmmap

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

debugvmmap

Description

This parameter causes Service Manager servers running on Windows operating systems to list the
following information in the sm.log file:

     a list of memory address ranges large enough to contain shared memory
     a map of virtual memory

You can use the list of memory address ranges to specify a value for the shared_memory_address
parameter. We recommend you only specify a shared_memory_address value if Service Manager
fails to automatically find one.
You can use the virtual memory map to troubleshoot shared memory problems and to identify a
potential address for the shared_memory_address parameter. The virtual memory map lists the
areas of free and used memory as well as the name of the resource using the address range.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

0

Possible values

0 (Disable)
1 (Enable)

Example usage

Command line: sm -httpPort:13080 -debugvmmap:1
Initialization file: debugvmmap:1
Example excerpt of available shared_memory_address values


2724( 3572) 03/05/2010 11:06:38 RTE I List of all possible

shared_memory_address parameter settings for a shared memory size of

67108864 (64 MB)

2724( 3572) 03/05/2010 11:06:38 RTE I # Free range 0x7FFF0000-0xFFFAD000

size=2147209216 (2047 MB)

2724( 3572) 03/05/2010 11:06:38 RTE I Preferred  :

shared_memory_address:0x80000000

2724( 3572) 03/05/2010 11:06:38 RTE I Lowest available :

shared_memory_address:0x80000000

2724( 3572) 03/05/2010 11:06:38 RTE I Highest available:

shared_memory_address:0xFBFA0000

2724( 3572) 03/05/2010 11:06:38 RTE D # Free range 0x122B5000-0x30000000

size= 500477952 ( 477 MB)

2724( 3572) 03/05/2010 11:06:38 RTE D

shared_memory_address:0x20000000

2724( 3572) 03/05/2010 11:06:38 RTE D Lowest available :

shared_memory_address:0x122D0000

2724( 3572) 03/05/2010 11:06:38 RTE D Highest available:

shared_memory_address:0x2C000000

...

2724( 3572) 03/05/2010 11:06:38 RTE D # Free range 0x77DF0000-0x7C360000

size= 72810496 ( 69 MB)

2724( 3572) 03/05/2010 11:06:38 RTE D

shared_memory_address:0x77E00000

2724( 3572) 03/05/2010 11:06:38 RTE D Lowest available :

shared_memory_address:0x77E00000

2724( 3572) 03/05/2010 11:06:38 RTE D Highest available:

shared_memory_address:0x78360000

2724( 3572) 03/05/2010 11:06:38 RTE D # Free range 0x039B0000-0x10000000

size= 207945728 ( 198 MB)

2724( 3572) 03/05/2010 11:06:38 RTE D

shared_memory_address:0x039C0000

2724( 3572) 03/05/2010 11:06:38 RTE D Lowest available :

shared_memory_address:0x039C0000

2724( 3572) 03/05/2010 11:06:38 RTE D Highest available:

shared_memory_address:0x0C000000

2724( 3572) 03/05/2010 11:06:38 RTE W !!! Use the preferred

shared_memory_address parameter above

2724( 3572) 03/05/2010 11:06:38 RTE W !!! or remove the

shared_memory_address parameter completely.

2724( 3572) 03/05/2010 11:06:38 RTE E HP Service Manager is unable to

start. Failed to initialize or attach to shared memory environment

Example excerpt of the virtual memory map


2388( 5572) 02/16/2010 15:23:34         RTE D Heap#00 Extension#0 - 0x00580598-
0x00680000 (0x000FFA68)                 RTE D Heap#01 Extension#0 - 0x00940590-
2388( 5572) 02/16/2010 15:23:34         RTE D Heap#01 Extension#1 - 0x023C0048-
0x00950000 (0x0000FA70)                 RTE D Heap#02 Extension#0 - 0x00B40590-
2388( 5572) 02/16/2010 15:23:34         RTE D Heap#03 Extension#0 - 0x003D0590-
0x024C0000 (0x000FFFB8)                 RTE D Heap#03 Extension#1 - 0x007B0048-
2388( 5572) 02/16/2010 15:23:34         RTE D Heap#04 Extension#0 - 0x02270598-
0x00B80000 (0x0003FA70)                 RTE D Heap#04 Extension#1 - 0x02110050-
2388( 5572) 02/16/2010 15:23:34         RTE D Heap#05 Extension#0 - 0x023B0590-
0x003E0000 (0x0000FA70)                 RTE D Heap#05 Extension#1 - 0x02280048-
2388( 5572) 02/16/2010 15:23:34         RTE D Heap#06 Extension#0 - 0x02600598-
0x008B0000 (0x000FFFB8)                 RTE D Heap#07 Extension#0 - 0x02800590-
2388( 5572) 02/16/2010 15:23:34         RTE D Heap#07 Extension#1 - 0x024C0048-
0x02280000 (0x0000FA68)                 RTE D Heap#08 Extension#0 - 0x02770578-
2388( 5572) 02/16/2010 15:23:34         RTE D Heap#09 Extension#0 - 0x00500580-
0x02210000 (0x000FFFB0)                 RTE D Heap#10 Extension#0 - 0x008F0580-
2388( 5572) 02/16/2010 15:23:34         RTE D Heap#11 Extension#0 - 0x026E0580-
0x023C0000 (0x0000FA70)                 RTE D Heap#12 Extension#0 - 0x029E0578-
2388( 5572) 02/16/2010 15:23:34         RTE D Heap#13 Extension#0 - 0x02BD0578-
0x02380000 (0x000FFFB8)                 RTE D Heap#14 Extension#0 - 0x02DD0580-
2388( 5572) 02/16/2010 15:23:34         RTE D Heap#15 Extension#0 - 0x02880578-
0x02640000 (0x0003FA68)                 RTE D Heap#16 Extension#0 - 0x02960578-
2388( 5572) 02/16/2010 15:23:34         RTE D Heap#17 Extension#0 - 0x02680578-
0x02810000 (0x0000FA70)
2388( 5572) 02/16/2010 15:23:34
0x025C0000 (0x000FFFB8)
2388( 5572) 02/16/2010 15:23:34
0x027B0000 (0x0003FA88)
2388( 5572) 02/16/2010 15:23:34
0x00540000 (0x0003FA80)
2388( 5572) 02/16/2010 15:23:34
0x00930000 (0x0003FA80)
2388( 5572) 02/16/2010 15:23:34
0x02720000 (0x0003FA80)
2388( 5572) 02/16/2010 15:23:34
0x02A20000 (0x0003FA88)
2388( 5572) 02/16/2010 15:23:34
0x02C10000 (0x0003FA88)
2388( 5572) 02/16/2010 15:23:34
0x02E10000 (0x0003FA80)
2388( 5572) 02/16/2010 15:23:34
0x028C0000 (0x0003FA88)
2388( 5572) 02/16/2010 15:23:34
0x029A0000 (0x0003FA88)
2388( 5572) 02/16/2010 15:23:34
0x026C0000 (0x0003FA88)


2388( 5572) 02/16/2010 15:23:34 RTE D Heap#18 Extension#0 - 0x03000578-

0x03040000 (0x0003FA88)

2388( 5572) 02/16/2010 15:23:34 RTE D Heap#19 Extension#0 - 0x035D0590-

0x035E0000 (0x0000FA70)

2388( 5572) 02/16/2010 15:23:34 RTE D Heap#20 Extension#0 - 0x02950590-

0x02960000 (0x0000FA70)

2388( 5572) 02/16/2010 15:23:34 RTE D Heap#21 Extension#0 - 0x03540598-

0x03580000 (0x0003FA68)

2388( 5572) 02/16/2010 15:23:34 RTE D Heap#22 Extension#0 - 0x02840598-

0x02880000 (0x0003FA68)

2388( 5572) 02/16/2010 15:23:34 RTE D **Process Memory Map** - User

address space extends from 0x00010000 to 0xFFFEFFFF

2388( 5572) 02/16/2010 15:23:34 RTE D Start          End     (Size

) Name

2388( 5572) 02/16/2010 15:23:34 RTE D 0x00010000-0x00020000

(0x00010000) rw- s [UNKNOWN]

2388( 5572) 02/16/2010 15:23:34 RTE D 0x00020000-0x00030000

(0x00010000) rw- s [UNKNOWN]

2388( 5572) 02/16/2010 15:23:34 RTE D 0x00030000-0x00031000

(0x00001000) r-- s [UNKNOWN]

2388( 5572) 02/16/2010 15:23:34 RTE D 0x00031000-0x00040000

(0x0000F000)                            [FREE]

2388( 5572) 02/16/2010 15:23:34 RTE D 0x00040000-0x00041000

(0x00001000) r-- i

\Device\HarddiskVolume2\Windows\System32\apisetschema.dll

2388( 5572) 02/16/2010 15:23:34 RTE D 0x00041000-0x00050000

(0x0000F000)                            [FREE]

2388( 5572) 02/16/2010 15:23:34 RTE D 0x00050000-0x00089000

(0x00039000)                            [RESERVED]

2388( 5572) 02/16/2010 15:23:34 RTE D 0x00089000-0x0008C000

(0x00003000) rw- g [UNKNOWN]

2388( 5572) 02/16/2010 15:23:34 RTE D 0x0008C000-0x00090000

(0x00004000) rw-                        [UNKNOWN]

2388( 5572) 02/16/2010 15:23:34 RTE D 0x00090000-0x0016D000

(0x000DD000)                            *** HP Service Manager stack: thread#5572 ***

Related topics

System parameters
Automatic selection of shared memory address
Enter a parameter in the sm.ini file
Debugging parameters


1.2.17.24. Parameter: dryrun

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

dryrun

Description

This parameter enables Service Manager administrators to run a load test script or test case to
assess the usage of shared memory and process memory for a typical user. You can use this
parameter for capacity planning during the development or test phases of implementation. This
parameter creates a log file in the server's RUN folder.

Valid if set from

Server's operating system command prompt
Initialization (sm.ini) file

Requires restart of the Service Manager server?

No

Default value

None

Possible values

None

Example usage

Command line: sm -dryrun -httpPort:13080

Sample dry run report


1572( 5900) 06/20/2008 15:18:11 RTE D ####### Dry Run Report #######

1572( 5900) 06/20/2008 15:18:11 RTE I ------ Shared Memory ------

1572( 5900) 06/20/2008 15:18:11 RTE I

1572( 5900) 06/20/2008 15:18:11 RTE I Shared Memory Release   7.10

1572( 5900) 06/20/2008 15:18:11 RTE I

1572( 5900) 06/20/2008 15:18:11 RTE I Current Size            64000000

1572( 5900) 06/20/2008 15:18:11 RTE I

1572( 5900) 06/20/2008 15:18:11 RTE I Segment Allocation            2886304

1572( 5900) 06/20/2008 15:18:11 RTE I Large Block Allocation        4255744

1572( 5900) 06/20/2008 15:18:11 RTE I

1572( 5900) 06/20/2008 15:18:11 RTE I Unused Space            56857952

(88%)

1572( 5900) 06/20/2008 15:18:11 RTE I Free Space              57071600

(89%)

1572( 5900) 06/20/2008 15:18:11 RTE I

1572( 5900) 06/20/2008 15:18:11 RTE I

1572( 5900) 06/20/2008 15:18:11 RTE I Shared Memory Type Allocations

Frees  Allocated

1572( 5900) 06/20/2008 15:18:11 RTE I ------------------ ----------- ---

-------- -----------

1572( 5900) 06/20/2008 15:18:11 RTE I Not named                     11

0      2832

1572( 5900) 06/20/2008 15:18:11 RTE I User blocks                   3

0      6144

1572( 5900) 06/20/2008 15:18:11 RTE I Messages                      0

0      0

1572( 5900) 06/20/2008 15:18:11 RTE I Resource locks                1

0      16

1572( 5900) 06/20/2008 15:18:11 RTE D Sessions PeakMemoryUsage: 5416720,

MemoryUsage: 203581, MemoryOverhead:11232, TotalAllocations:405289

1572( 5900) 06/20/2008 15:18:11 RTE D Memory Leak Report is available in

file memdebug.1572.5900.log

1572( 5900) 06/20/2008 15:18:11 RTE D ####### End DryRun Report #######

Related topics

System parameters
Startup parameter: shutdown
Enter a parameter in the sm.ini file


1.2.17.25. Parameter: log4jdebug

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

log4jDebug:com.hp.ov.sm.common.oom.LowMemoryHandler

Description

This parameter enables certain java packages to be started in debug mode.

Valid if set from

Server's operating system command prompt

Start up file (sm.ini or smstart)

Requires restart of Service Manager server

Yes

Default value

None -- By default none of the java packages will be run in debug mode.

Possible values

com.hp.ov.sm.common.oom.LowMemoryHandler

Example usage

Command line: sm -httpPort:13080 -
log4jDebug:com.hp.ov.sm.common.oom.LowMemoryHandler

Related topics

Monitoring memory in Service Manager processes
Monitoring native heap and Java heap memory
Logging memory monitoring
Servlet parameters
Debugging parameters


1.2.17.26. Parameter: log4jError

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

log4jError

Description

This parameter specifies a list of comma-delimited packages to set the log level to Error.

Valid if set from

Server's operating system command prompt
Start up file (sm.ini or smstart)

Requires restart of Service Manager server

No

Default value

Package List.

Possible values

Any comma-delimited Service Manager JRTE class names.
log4jError:com.hp.ov.sm.server.utility.Scheduler,com.hp.ov.sm.server.utility.GenericThreadManager
log4jError:com.hp.ov.sm.server.utility.SoapServer,com.hp.ov.sm.server.appserver.servlet
log4jError:com.hp.ov.sm.common.utility.DAOThread
log4jError:com.hp.ov.sm.common.resource.ResourceBase

Example usage

Command line: SM -log4jError:com.hp.ov.sm.common.utility.DAOThread
Initialization file: log4jError:com.hp.ov.sm.common.utility.DAOThread

Related topics

System parameters
Servlet parameters
Debugging parameters


1.2.17.27. Parameter: logdebuglevel

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

logdebuglevel

Description

This parameter defines the log level of the JRTE codes. If the value of this parameter equals to or
larger than 1, all JVM options are logged in sm.log when the Service Manager server is starting.

Valid if set from

Server's operating system command prompt
Start up file (sm.ini or smstart)

Requires restart of Service Manager server

Yes

Default value

1

Possible values

0 = DEBUG
1 = INFO (default)
2 = WARN
3 = ERROR
4 = FATAL

Example usage

Command line: SM -logdebuglevel:1
Initialization file: logdebuglevel:1

Related topics

System parameters
Servlet parameters
Debugging parameters


1.2.17.28. Parameter: rtm

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

rtm

Description

This parameter causes the Service Manager server to write Response Time Monitor (RTM)
performance statistics to the log file.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

None

Possible values

Logging level

     2 (Displays the response and transaction times)
     3 (Displays the same information as rtm:2, and also provides a panel by panel trace of the
     RAD application)
     4 (Displays the same information as rtm:2 and rtm:3, and also provides details about the
     usage of each RAD operator and command panel from the last format response to this one)
     5 (Displays the same information as rtm:2 and rtm:3, and also provides details about the
     usage of each RAD operator and command panel from the last panel response to this one)

Example usage

Command line: sm -httpPort:13080 -rtm:2

Initialization file: rtm:2

Related topics

System parameters
Example: response time monitoring (RTM) output
Enter a parameter in the sm.ini file
Debugging parameters


1.2.17.29. Parameter: tracememerror

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's OS command prompt.

Parameter

tracememerror

Description

This parameter specifies whether to print memory trace information in the sm.log file and generate
coredump when the memory is handled incorrectly.

Valid if set from

Server's operating system command prompt
Initialization (sm.ini) file

Requires restart of the Service Manager server?

No

Default value

0

Possible values

0 (Disable)
1 (Print call stack)
2 (Print call stack and generate coredump)

Example usage

Command line: sm -tracememerror:1
Initialization file: tracememerror:1

Related topics

System parameters
Enter a parameter in the sm.ini file
Debugging parameters
````
