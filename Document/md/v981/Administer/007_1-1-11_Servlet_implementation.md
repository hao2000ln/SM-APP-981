---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.1.11 .. 1.1.11
printed_pages: 148-174
---

# 1.1.11 Servlet implementation

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.11. Servlet implementation

Service Manager uses a servlet implementation to manage client connections to the
server. The servlet implementation uses a pre-configured embedded Java servlet that
doesn't require any additional installation or configuration of Java components.
Administrators can manage the servlet implementation using the Service Manager
configuration files and management procedures rather than Java interfaces.

A servlet implementation provides the following management features:

     The ability to specify the exact communications ports client connections use
     The ability to specify the maximum number of client connections Service
     Manager will accept
     Industry-standard resilience and scalability options
     Multithread processing capabilities

In a servlet implementation, administrators specify the communications ports the
system uses in advance. The total number of communication ports required for a
servlet implementation is based on the number of servlet container processes you
want the Service Manager host to support. Each servlet container process manages a
set number of client sessions as determined by the number of threads it contains.

Each servlet container process supports a set number of client connections over two
communications ports, one for HTTP communications and one for HTTPS
communications. Administrators set the number of client connections per process
using the threading parameters. Two communications ports is sufficient for up to
approximately 150 client connections (as determined by the Service Manager host's
memory requirements).

A servlet implementation is ideal for administrators who want to do capacity planning
and system resource management. The communications port and threading
parameters allow administrators to control the resources that client connections
consume. By specifying the communication ports and number of threads available for
client connections, administrators can set a limit on the total number of client
connections any one hardware resource supports. Setting connection limits prevent
client connections from consuming more system resources than desired and allows
administrators to set a server load threshold in advance. If a client attempts to
connect to a Service Manager system that has reached its connection limit, the server
refuses the connection and displays an error message that the server is unavailable.

Certain servlet implementations benefit from the native resilience and scalability
features of grouping Java servlets. In a horizontal scaling implementation,


administrators can create virtual groups where multiple Service Manager servers act
as a single system. Each member in a virtual group communicates its connection
availability and system resource usage to the other members of the group. Should a
group member fail, the other group members are unaffected by the outage and the
system can route any new client connection requests to another member in the virtual
group. If the client connection routing process fails, the existing client connections
are unaffected and an administrator can restart the client connection routing process.

Related topics

Server implementation options
Servlet implementation options
Servlet implementation processes
Startup options for servlet container processes


1.1.11.1. Servlet implementation options

The Service Manager server supports the following types of servlet implementation
options. You may combine these implementation options with other Service Manager
options to create your own system implementation.

     Single servlet implementation – a single host running a single servlet container
     implementation
     Vertical scaling implementation – a single host running multiple servlet
     containers implementation
     Horizontal scaling implementation – multiple hosts running multiple servlet
     containers implementation

A single servlet implementation doesn't require a load balancer process. Clients send
connection requests directly to the HTTP communications port of the servlet
container process. The servlet container's HTTP port becomes the single well-known
communications port for the Service Manager system. All clients send connection
requests to this one communications port. The servlet container process routes each
connection request to an available thread in the process. When the number of client
connections reaches the number of available threads the system has reached
capacity, and the servlet container refuses any additional client connection requests.
Each servlet container process can manage approximately one hundred and fifty
client connections (as determined by the Service Manager host's memory
requirements). Implementers can use the threadsperprocess parameter to set the
total number of client connections the servlet container process manages.

A vertical scaling implementation requires a load balancer process to route client
connection requests to an available servlet container process. Clients send
connection requests to the HTTP communications port of the load balancer process.
The load balancer's HTTP port becomes the single well-known communications port
for the Service Manager system. All clients send connection requests to this one
communications port. The load balancer process transparently routes client
connection requests to any available servlet container processes on the local host.
The end-user never sees the change in the communications port number from the
load balancer process to the servlet container process. When the number of client
connections reaches the total number of available threads on all servlet container
processes the system has reached capacity, and the load balancer refuses any
additional client connection requests. Implementers must use the threadsperprocess
parameter to set the total number of client connections each servlet container
process manages.


A horizontal scaling implementation requires a load balancer process to route client
connection requests to servlet containers on multiple hosts. Clients send connection
requests to the HTTP communications port of the load balancer process. The load
balancer's HTTP port becomes the single well-known communications port for the
Service Manager system. All clients send connection requests to this one
communications port. The load balancer process routes client connection requests to
any available servlet container process in the group. When the number of client
connections reaches the total number of available threads on all servlet containers on
all available hosts in the virtual group, the system has reached capacity, and the load
balancer refuses any additional client connection requests. Implementers must use
the threadsperprocess parameter to set the total number of client connections each
servlet container process manages. Implementers must also set the group parameters
and ensure there is a valid network connection among the group members.

Related topics

Horizontal scaling implementation
Servlet implementation
Servlet implementation processes
Single servlet implementation
Vertical scaling and required SSL implementation
Vertical scaling implementation


1.1.11.2. Servlet implementation processes

All Service Manager servlet implementations use multithreaded processes. To control
the client connections to these threads, you can configure the Service Manager
server to start one of two types of processes:

     One or more servlet container processes that accept direct HTTP and HTTPS
     client connections
     One load balancer process to be the master thread controller for all servlet
     container processes in a virtual group

A servlet container process is a Service Manager sm.exe process that includes a
multithreaded Java servlet container. Each servlet container process manages a pool
of child threads dedicated to handling Service Manager client transactions. The
Servlet container process listens for incoming client connection requests on a
predetermined HTTP port and routes the requests to an available thread in the
process. The thread then binds to the HTTP or HTTPS port of the parent servlet
container process for the duration of the client connection. The total number of
threads available determine the total number of client connections the servlet
container process can manage. Each active thread in the servlet container process
holds system locks and communicates this information to other servlet container
processes in the same virtual group.

A load balancer process is an Service Manager sm.exe process dedicated to routing
incoming client requests to servlet container processes in vertical and horizontal
scaling implementations. In either scaling implementation the virtual group only
requires one load balancer process. The Load balancer process doesn't have any
child threads of its own, nor does it maintain any system locks or hold system
resources. The load balancer listens for incoming client connection requests on a
predetermined HTTP port and routes them to an available servlet container. The
available servlet container may be on the same physical system or on another system
in the same virtual group depending on the implementation.


Property                                Servlet container  Load balancer process
                                        process

Routes client                           No                 Yes

connections to servlet

container processes?

Routes client                           Yes                No

connections to threads?

Creates child threads? Yes                                 No

Accepts client                          Yes                No

connections?

Uses an HTTP port?                      Yes                Yes

Uses an HTTPS port?                     Yes (optional)     No

Related topics

Parameter: httpPort
Parameter: httpsPort
Parameter: loadBalancer
Parameter: groupmcastaddress
Parameter: groupname
Parameter: groupport
Parameter: sslConnector
Managing multiple servlet container processes
Servlet implementation
Servlet implementation options
Quiesce all servlet container processes in a servlet implementation
Quiesce all servlet container processes on a host
Shut down all servlet container processes in a servlet implementation
Shutdown all servlet container processes on a host


1.1.11.3. Startup options for servlet
container processes

The only way you can start the servlet container processes in a servlet
implementation is to manually start all needed servlet container processes in
advance. We recommend that you start all needed servlet container processes in
advance because it ensures that the host dedicates sufficient system resources to
client connections, and because clients don't experience any connection delays while
a servlet container process starts up. Each servlet container process requests host
system resources when it first started. By starting all processes in advance you
ensure that the host has sufficient resources to run your servlet container processes,
and you can determine how much spare capacity, if any, the host has. In addition,
clients don't have to wait for a servlet container process to start before they can
connect. You can manually start servlet container processes requires using the
following parameters from the command line or Service Manager configuration file
(sm.cfg).

Implementation                          Command line parameters or
Single servlet implementation           configuration file entries

                                          sm -httpPort:13081
                                          httpsPort:13082

Horizontal or vertical scaling          sm -httpPort:13080 -
implementations                         loadBalancer
                                        sm -httpPort:13081 -
                                        httpsPort:13082

Related topics

Servlet implementation
Servlet implementation options
Parameter: httpPort
Parameter: httpsPort
Parameter: threadsperprocess


1.1.11.4. Managing multiple servlet
container processes

In vertical and horizontal scaling implementations, administrators have the option of
managing multiple servlet container processes. Administrators can stop or quiesce
individual servlet container processes from the server's operating system command
line. This allows you to take servlet container processes offline for maintenance or to
manage system resources on the Service Manager host.

To quiesce multiple servlet container processes you must use the command line. The
quiesce form doesn't recognize servlet container implementations.

Additionally, you can set a process to monitory the heap memory and take action to
prevent memory overload on any one servlet.

Related topics

Servlet implementation
Servlet implementation processes
Monitoring memory in Service Manager processes
Monitoring native heap and Java heap memory
Logging memory monitoring
Quiesce all servlet container processes in a servlet implementation
Quiesce all servlet container processes on a host
Shut down all servlet container processes in a servlet implementation
Shutdown all servlet container processes on a host
Parameter: log4jDebug


1.1.11.4.1. Quiesce all servlet container
processes in a servlet implementation

Applies to User roles: System Administrator
You must have administrative access to the server operating system to use this
procedure.
To quiesce all servlet container processes in a servlet implementation:

   1. Open the server's operating system command line prompt.
     For example, to open the Windows command prompt:
     Click Start > Programs > Accessories > Command Prompt.

   2. Change directories to the RUN folder of your Service Manager installation. For
     example:

          cd C:\Program Files\OpenText\Service Manager\server\RUN

   3. Type the following command:

          sm -quiesce:2 -group

   4. Press Enter.
     The server quiesces all the servlet container processes in the virtual group.

Related topics

Managing multiple servlet container processes
Servlet implementation
Servlet implementation processes
Startup parameter: quiesce
Parameter: group


1.1.11.4.2. Quiesce all servlet container
processes on a host

Applies to User roles: System Administrator
You must have administrative access to the server operating system to use this
procedure.
To quiesce all servlet container processes on a host:

   1. Open the server's operating system command line prompt.
     For example, to open the Windows command prompt:
     Click Start > Programs > Accessories > Command Prompt.

   2. Change directories to the RUN folder of your Service Manager installation. For
     example:

          cd C:\Program Files\OpenText\Service Manager\server\RUN

   3. Type the following command:

          sm -quiesce:2 -host:<hostname>

   4. Press Enter.
     The server quiesces all the servlet container processes on the host.

Related topics

Managing multiple servlet container processes
Servlet implementation
Servlet implementation processes
Startup parameter: quiesce
Parameter: host


1.1.11.4.3. Shut down all servlet container
processes in a servlet implementation

Applies to User roles: System Administrator
You must have administrative access to the server operating system to use this
procedure.
To shut down all servlet container processes in a servlet implementation:

   1. Open the server's operating system command line prompt.
     For example, to open the Windows command prompt:
     Click Start > Programs > Accessories > Command Prompt.

   2. Change directories to the RUN folder of your Service Manager installation. For
     example:

          cd C:\Program Files\OpenText\Service Manager\server\RUN

   3. Type the following command:

          sm -shutdown -group

   4. Press Enter.
     The server shuts down all the servlet container processes in the virtual group.

Related topics

Managing multiple servlet container processes
Servlet implementation
Servlet implementation processes
Parameter: group
Startup parameter: shutdown


1.1.11.4.4. Shut down all servlet container
processes on a host

Applies to User roles: System Administrator
You must have administrative access to the server operating system to use this
procedure.
To shut down all servlet container processes on a host:

   1. Open the server's operating system command line prompt.
     For example, to open the Windows command prompt:
     Click Start > Programs > Accessories > Command Prompt.

   2. Change directories to the RUN folder of your Service Manager installation. For
     example:

          cd C:\Program Files\OpenText\Service Manager\server\RUN

   3. Type the following command:

          sm -shutdown -host:<host name>

   4. Press Enter.
     The server shuts down all the servlet container processes on the host.

Related topics

Managing multiple servlet container processes
Servlet implementation
Servlet implementation processes
Parameter: host
Parameter: group
Startup parameter: shutdown


1.1.11.4.5. Monitoring memory in Service
Manager processes

The Service Manager process embeds a Java Virtual Machine (JVM) so that the heap
memory provided by the operating system for any process is partitioned into a Java
Heap and a Native Heap. The Service Manager process self–monitors these heaps
and takes action to prevent a crash.

During startup of a Service Manager process, immediately after the JVM is created, a
memory monitor thread is started, which will poll for a low memory condition every 15
seconds. On every iteration, the memory monitoring thread fetches the current usage
of java heap (all platforms) and native heap (Windows only) and set the process
global flags lowMemoryOnJava and lowMemoryOnNative when the usage exceeds
90% of allocated memory in that category. These flags are unset again when the
usage of memory drops below 70%.

To prevent server crashes due to low available heap memory and to avoid disrupting
users who are logged on to a Service Manager process, the servletcontainer takes
the following actions when the low memory flags are set:

     Writes warning messages to sm.log .
     Notifies LoadBalancer not to send that servlet any new client connections.
     Denies new client sessions (Windows client, web client or web services client)
     for that servlet. They are sent to another one.
     Does not allow existing clients to open new tabs. However, they can trade the
     existing tabs for new ones. For example, if you close two tabs, you will be
     allowed to open two new tabs. If you can't operate without opening any new
     tabs you need to logoff and login again.

Normal processing is resumed when the heap usage drops below 70%. The
servletcontainer takes the following actions when the low memory flags are unset.

     Writes Info messages to the sm.log file indicating normal memory usage.
     Notifies LoadBalancer to resume sending of new client connections.

Related topics

Monitoring native heap and Java heap memory
Logging memory monitoring
Servlet parameters
Debugging parameters
Parameter: log4jDebug



1.1.11.4.5.1. Monitoring native heap and
Java heap memory

Java heap

When a Java Virtual Machine (JVM) is started in Service Manager process, the
Service Manager process defines the minimum and the maximum amount of memory
that's allocated for JVM. The minimum and maximnm vary for different kinds of
Service Manager processes.

     For processes with "sync", "reportlbstatus", "reportlocks" or "shutdown"
     parameters, the maximum value is defined as 96M;
     For processes with "load balancer" parameter, the maximum value is defined as
     1500M;
     For other processeS, the maximum amount of memory is depend on the value of
      threadsperprocess parameter: When the value of threadsperprocess
     parameter is greater than 250, the maximum value is defined as 1/4th of the
     computer's physical memory or 4096M (whichever is smaller); When the value
     of threadsperprocess parameter is same with or less than 250, the maximum
     value is defined as 1/4th of the computer's physical memory or 2048M
     (whichever is smaller).

You can override these default values by using the JVMOption parameters. For
example, you could set JVMOption0:-Xms128M, JVMOption1:-Xmx256M , to provide
minimum and maximum values of 128M and 256M for java heap memory.

Native heap

Windows: The Windows operating system has APIs that fetch the current memory
usage of a process and the maximum that can be allocated for that process. We
monitor the native heap using the API's monitoring thread, and turn the low memory
condition processes on or off accordingly.

Linux Systems: Not implemented.

Related topics

Monitoring memory in Service Manager processes
Logging memory monitoring
Servlet parameters


Debugging parameters
Parameter: log4jDebug


1.1.11.4.5.2. Logging memory monitoring

You can turn on detailed messages of the memory monitoring thread by adding the
following parameter to the sm.ini file:
log4jdebug:com.hp.ov.sm.common.oom.LowMemoryHandler
Messages like these will be sent to the sm.log file when the parameter is turned on.
Warning messages are written to the log whether detailed messages are turned on or
not.

  2120( 2232) 02/04/2009 13:25:02 JRTE I Starting Memory
  Monitoring thread to check for memory every 15 seconds.
  2120( 5980) 02/04/2009 13:25:02 JRTE D JavaMemory
  Max(123928576) Used(1011872) %Used(0.0)
  2120( 5980) 02/04/2009 13:25:02 JRTE D NativeMemory
  Max(2147352576) Used(358121472) %Used(16.0)
  2120( 5980) 02/04/2009 13:28:32 JRTE W Process Low on Java
  Memory. Max(123928576) Used(119603800) PercentUsed(96.0)
  2120 02/04/2009 13:30:14 JRTE W Send error response: Server is
  running low on memory try again.
  2120 02/04/2009 13:30:16 JRTE W Send error response: Server is
  running low on memory try again.
  2120( 5980) 02/04/2009 13:30:47 RTE I Process Java Heap Memory
  is back to normal range.
  2120( 5980) 02/04/2009 13:30:47 JRTE I Process Java Memory.
  Max(123928576) Used(4256640) PercentUsed(3.0)

Related topics

Monitoring memory in Service Manager processes
Monitoring native heap and Java heap memory
Servlet parameters
Debugging parameters
Parameter: log4jDebug
Parameter: memorypollinterval


1.1.11.4.5.3. Example: response time
monitoring (RTM) output

The following sections show example output from each Response Time Monitoring
setting.

RTM:2

  248( 6112) 10/21/2013 11:09:59 RTE D Response-Total: 0.016 --

  RAD:0.016 JS:0.000 Log:0.000 Database:0.000 LoadBalancer:

  0.000 (CPU 0.781) Transaction - format:wizard-

  wiz.prompt.patchrel.unl application:display,show.rio option:0

  248( 6112) 10/21/2013 11:09:59 RTE D -Memory : D(261304)

  S(4011264) O(1212028) MAX(5387068) - MALLOC's Transaction(17425)

  Total(397602)

The debugging output includes:

     Process ID — lists the process identification number for the transaction
     Thread ID — lists the thread identification number for the transaction
     Date — lists the date the transaction occurred
     Time — lists the time the transaction occurred
     Response -Total — lists the number of seconds taken to complete the entire
     transaction
     RAD — lists the number of seconds taken for the RAD to complete the
     transaction
     JS — lists the number of seconds taken for the JavaScript to complete the
     transaction
     Log — lists the number of seconds taken for the log to complete the transaction
     Database — lists the number of seconds taken for the database to complete the
     transaction
     LoadBalancer — lists the number of seconds taken for the load balancer to
     complete the transaction
     (CPU n) — lists the cumulative number of seconds the process used on the CPU
     Transaction - format — lists the form displayed by the transaction
     Application — lists the application when the transaction is completed
     Option ID — lists the GUI option or button ID number used in this transaction
     D — lists the memory delta from the previous transaction. This value could be
     positive or negative.


     S — lists the storage (in bytes) currently allocated to this session by Service
     Manager. This doesn't include shared memory or memory that's not directly
     allocated by Service Manager.
     O — lists the overhead associated with the internal memory manager.
     MAX — lists the peak value of the storage (in bytes) allocated to this session by
     Service Manager.
     MALLOC's Transaction — lists the delta number of times of Service Manager
     called MALLOC to allocate memory from the previous transaction
     Total — lists the total number of times of Service Manager called MALLOC to
     allocate memory

RTM:3

248( 364) 10/21/2013 11:06:04 RTE D RADTRACE 2781 [ 1]

display                                 show.rio

rio            CPU( 0 874 )

248( 364) 10/21/2013 11:06:04 RTE D Response-Total: 3.047 --

RAD:3.031 JS:0.000 Log:0.000 Database:0.016 LoadBalancer:

0.000 (CPU 0.874) Transaction - format:wizard-

wiz.prompt.patchrel.unl application:display,show.rio option:0

248( 364) 10/21/2013 11:06:04 RTE D -Memory : D(272304)

S(3343528) O(945684) MAX(4440604) - MALLOC's Transaction(18643)

Total(409020)

The debugging output includes:

     Process ID — lists the process identification number for the transaction
     Thread ID — lists the thread identification number for the transaction
     Date — lists the date the transaction occurred
     Time — lists the time the transaction occurred
     RADTRACE # — lists the cumulative elapsed time for the transaction in
     milliseconds
     [ n] — lists the thread number of the process
     RAD application — lists the RAD application used in the transaction
     RAD panel — lists the name of the RAD panel
     CPU ( n m ) — lists the number of milliseconds that the CPU processed the RAD
     panel (n) and the total number of milliseconds since the RAD trace began (m)
     Response -Total — lists the number of seconds taken to complete the entire
     transaction


     RAD — lists the number of seconds taken for the RAD to complete the
     transaction
     JS — lists the number of seconds taken for the JavaScript to complete the
     transaction
     Log — lists the number of seconds taken for the log to complete the transaction
     Database — lists the number of seconds taken for the database to complete the
     transaction
     LoadBalancer — lists the number of seconds taken for the load balancer to
     complete the transaction
     (CPU n) — lists the cumulative number of seconds the process used on the CPU
     Transaction - format — lists the form displayed by the transaction
     Application — lists the application when the transaction is completed
     Option ID — lists the GUI option or button ID number used in this transaction
     D — lists the memory delta from the previous transaction. This value could be
     positive or negative.
     S — lists the number of bytes of storage allocated by Service Manager. This
     doesn't include shared memory or memory that's not directly allocated by
     Service Manager.
     O — lists the overhead associated with the internal memory manager.
     MAX — lists the peak value of the number of bytes of storage allocated by
     Service Manager.
     MALLOC's Transaction — lists the delta number of times of Service Manager
     called MALLOC to allocate memory from the previous transaction
     Total — lists the total number of times of Service Manager called MALLOC to
     allocate memory

RTM:4


3688( 5512) 10/21/2013 17:21:25 RTE D RADTRACE 219 [ 1]

display                                 show.rio

rio            CPU( 0 3108 )

3688( 5512) 10/21/2013 17:21:25 RTE D Response-Total: 0.328 --

RAD:0.187 JS:0.000 Log:0.125 Database:0.141 LoadBalancer:

0.000 (CPU 3.155) Transaction - format:wizard-

wiz.prompt.patchrel.unl application:display,show.rio option:0

3688( 5512) 10/21/2013 17:21:25 RTE D -Memory : D(272624)

S(3341592) O(943524) MAX(4440604) - MALLOC's Transaction(54547)

Total(879376)

3688( 5512) 10/21/2013 17:21:25 RTE D ... 88 calls made to

';' (1)

3688( 5512) 10/21/2013 17:21:25 RTE D ... 252 calls made to

'=' (2)

3688( 5512) 10/21/2013 17:21:25 RTE D ... 7 calls made to '

or ' (3)

3688( 5512) 10/21/2013 17:21:25 RTE D ... 38 calls made to '

and ' (4)

3688( 5512) 10/21/2013 17:21:25 RTE D ... 16 calls made to

'not ' (5)

3688( 5512) 10/21/2013 17:21:25 RTE D ... 1 calls made to

'<=' (7)

3688( 5512) 10/21/2013 17:21:25 RTE D ... 47 calls made to

'=' (8)

3688( 5512) 10/21/2013 17:21:25 RTE D ... 17 calls made to

'~=' (9)

3688( 5512) 10/21/2013 17:21:25 RTE D ... 10 calls made to

'>' (11)

3688( 5512) 10/21/2013 17:21:25 RTE D ... 72 calls made to

'+' (12)

3688( 5512) 10/21/2013 17:21:25 RTE D ... 61 calls made to

'if ' (19)

3688( 5512) 10/21/2013 17:21:25 RTE D ... 2 calls made to

'if ' (20)

3688( 5512) 10/21/2013 17:21:25 RTE D ... 8 calls made to

'for ' (22)

3688( 5512) 10/21/2013 17:21:25 RTE D ... 834 calls made to '

in ' (23)

3688( 5512) 10/21/2013 17:21:25 RTE D ... 32 calls made to

'decision' (28)


3688( 5512) 10/21/2013 17:21:25 RTE D ... 29   calls made to
'process' (42)                                calls made to
3688 5512) 10/21/2013 17:21:25 RTE D ... 1
'rio' (48)                                     calls made to
3688( 5512) 10/21/2013 17:21:25 RTE D ... 5    calls made to
'select' (50)                                  calls made to
3688( 5512) 10/21/2013 17:21:25 RTE D ... 23   calls made to
'str' (51)                                     calls made to
3688( 5512) 10/21/2013 17:21:25 RTE D ... 6    calls made to
'userdefn' (53)                                calls made to
3688( 5512) 10/21/2013 17:21:25 RTE D ... 9    calls made to
'lng' (54)                                     calls made to
3688( 5512) 10/21/2013 17:21:25 RTE D ... 14   calls made to
'filename' (55)                                calls made to
3688( 5512) 10/21/2013 17:21:25 RTE D ... 1    calls made to
'operator' (56)                                calls made to
3688( 5512) 10/21/2013 17:21:25 RTE D ... 11   calls made to
'rinit' (58)                                   calls made to
3688( 5512) 10/21/2013 17:21:25 RTE D ... 17   calls made to
'currec' (59)                                  calls made to
3688( 5512) 10/21/2013 17:21:25 RTE D ... 11   calls made to
'#' (60)
3688( 5512) 10/21/2013 17:21:25 RTE D ... 1
'val' (72)
3688( 5512) 10/21/2013 17:21:25 RTE D ... 1
'index' (78)
3688( 5512) 10/21/2013 17:21:25 RTE D ... 29
'null' (88)
3688( 5512) 10/21/2013 17:21:25 RTE D ... 7
'denull' (113)
3688( 5512) 10/21/2013 17:21:25 RTE D ... 1
'contents' (117)
3688( 5512) 10/21/2013 17:21:25 RTE D ... 1
'loop' (119)
3688( 5512) 10/21/2013 17:21:25 RTE D ... 17
'parse' (122)
3688( 5512) 10/21/2013 17:21:25 RTE D ... 39
'evaluate' (123)
3688( 5512) 10/21/2013 17:21:25 RTE D ... 12
'type' (124)


3688( 5512) 10/21/2013 17:21:25         RTE D ... 67  calls made to
'nullsub' (125)                         RTE D ... 2   calls made to
3688( 5512) 10/21/2013 17:21:25         RTE D ... 8   calls made to
'cleanup' (127)                         RTE D ... 8   calls made to
3688( 5512) 10/21/2013 17:21:25         RTE D ... 6   calls made to
'+=' (128)                              RTE D ... 4   calls made to
3688( 5512) 10/21/2013 17:21:25         RTE D ... 1   calls made to
'same' (133)                            RTE D ... 9   calls made to
3688( 5512) 10/21/2013 17:21:25         RTE D ... 14  calls made to
'param2' (134)
3688( 5512) 10/21/2013 17:21:25
'gui' (155)
3688( 5512) 10/21/2013 17:21:25
'sysinfo.get' (169)
3688( 5512) 10/21/2013 17:21:25
'strrep' (188)
3688( 5512) 10/21/2013 17:21:25
'scmsg' (238)

The debugging output includes:

     Process ID — lists the process identification number for the transaction
     Thread ID — lists the thread identification number for the transaction
     Date — lists the date the transaction occurred
     Time — lists the time the transaction occurred
     RADTRACE # — lists the cumulative elapsed time for the transaction in
     milliseconds
     [ n] — lists the thread number of the process
     RAD application — lists the RAD application used in the transaction
     RAD panel — lists the name of the RAD panel
     CPU ( n m ) — lists the number of milliseconds that the CPU processed the RAD
     panel (n) and the total number of milliseconds since the RAD trace began (m)
     Response -Total — lists the number of seconds taken to complete the entire
     transaction
     RAD — lists the number of seconds taken for the RAD to complete the
     transaction
     JS — lists the number of seconds taken for the JavaScript to complete the
     transaction
     Log — lists the number of seconds taken for the log to complete the transaction


     Database — lists the number of seconds taken for the database to complete the
     transaction
     LoadBalancer — lists the number of seconds taken for the load balancer to
     complete the transaction
     (CPU n) — lists the cumulative number of seconds the process used on the CPU
     Transaction - format — lists the form displayed by the transaction
     Application — lists the application when the transaction is completed
     Option ID — lists the GUI option or button ID number used in this transaction
     D — lists the memory delta from the previous transaction. This value could be
     positive or negative.
     S — lists the number of bytes of storage allocated by Service Manager. This
     doesn't include shared memory or memory that's not directly allocated by
     Service Manager.
     O — lists the overhead associated with the internal memory manager.
     MAX — lists the peak value of the S
     MALLOC's Transaction — lists the delta number of times of Service Manager
     called MALLOC to allocate memory from the previous transaction
     Total — lists the total number of times of Service Manager called MALLOC to
     allocate memory
     # of calls made to ‘x’ — lists the number of times Service Manager called the
     function, panel, or operator x from the last format response to this one
     (#) — lists the function identification number for the function, panel, or operator
     from the last format response to this one

RTM:5


3688( 3952) 10/21/2013 17:22:45 RTE D RADTRACE 203 [ 1]

display                                 show.rio

rio            CPU( 0 2827 )

3688( 3952) 10/21/2013 17:22:45 RTE D Response-Total: 0.281 --

RAD:0.281 JS:0.000 Log:0.265 Database:0.000 LoadBalancer:

0.000 (CPU 2.843) Transaction - format:wizard-

wiz.prompt.patchrel.unl application:display,show.rio option:0

3688( 3952) 10/21/2013 17:22:45 RTE D -Memory : D(261512)

S(3330480) O(950540) MAX(4440604) - MALLOC's Transaction(54063)

Total(878892)

3688( 3952) 10/21/2013 17:22:45 RTE D ... 595 calls made to '

in ' (23)

3688( 3952) 10/21/2013 17:22:45 RTE D ... 1 calls made to

'rio' (48)

3688( 3952) 10/21/2013 17:22:45 RTE D ... 1 calls made to

'evaluate' (123)

3688( 3952) 10/21/2013 17:22:45 RTE D ... 2 calls made to

'nullsub' (125)

3688( 3952) 10/21/2013 17:22:45 RTE D ... 2 calls made to

'gui' (155)

The debugging output includes:

     Process ID — lists the process identification number for the transaction
     Thread ID — lists the thread identification number for the transaction
     Date — lists the date the transaction occurred
     Time — lists the time the transaction occurred
     RADTRACE # — lists the cumulative elapsed time for the transaction in
     milliseconds
     [ n] — lists the thread number of the process
     RAD application — lists the RAD application used in the transaction
     RAD panel — lists the name of the RAD panel
     CPU ( n m ) — lists the number of milliseconds that the CPU processed the RAD
     panel (n) and the total number of milliseconds since the RAD trace began (m)
     Response -Total — lists the number of seconds taken to complete the entire
     transaction
     RAD — lists the number of seconds taken for the RAD to complete the
     transaction
     JS — lists the number of seconds taken for the JavaScript to complete the
     transaction


     Log — lists the number of seconds taken for the log to complete the transaction
     Database — lists the number of seconds taken for the database to complete the
     transaction
     LoadBalancer — lists the number of seconds taken for the load balancer to
     complete the transaction
     (CPU n) — lists the cumulative number of seconds the process used on the CPU
     Transaction - format — lists the form displayed by the transaction
     Application — lists the application when the transaction is completed
     Option ID — lists the GUI option or button ID number used in this transaction
     D — lists the memory delta from the previous transaction. This value could be
     positive or negative.
     S — lists the number of bytes of storage allocated by Service Manager. This
     doesn't include shared memory or memory that's not directly allocated by
     Service Manager.
     O — lists the overhead associated with the internal memory manager.
     MAX — lists the peak value of the S
     MALLOC's Transaction — lists the delta number of times of Service Manager
     called MALLOC to allocate memory from the previous transaction
     Total — lists the total number of times of Service Manager called MALLOC to
     allocate memory
     # of calls made to ‘x’ — lists the number of times Service Manager called the
     function, panel, or operator x from the last panel response to this one
     (#) — lists the function identification number for the function, panel, or operator
     from the last panel response to this one

Related topics

Debugging parameters
````
