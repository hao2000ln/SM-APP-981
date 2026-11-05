---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.9.5 .. 1.9.5
printed_pages: 2662-2684
---

# 1.9.5 Shared memory

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.9.5. Shared memory

Service Manager shared memory is a pool of memory available to all processes on the server. You can control how the server
allocates and manages shared memory using system parameters in the Service Manager initialization file. Allocating too little
shared memory can degrade system performance, and allocating too much wastes system resources.

The shared memory storage report generates a snapshot of shared memory that enables you to monitor usage. If you are
trying to isolate a performance bottleneck, run a report at start-up and periodically throughout the monitoring period. As a
general rule, if Unused falls below 25%, consider increasing the amount of shared memory (see Startup parameters:
shared_memory). If you're not sure how to interpret the shared memory report, contact the customer support.

To run the shared memory report for a Linux or Windows system, issue the following command from a shell prompt (Linux) or
a command prompt (Windows):

  sm -reportshm

Related topics

Example: semaphore reports
Shared memory storage report
Debug a suspended or hung system
System performance parameters
Startup parameter: maxmsgsharedmemory
Special parameters: reportsem
Special parameters: reportshm
Special parameters: reportstatus
Startup parameter: shared_memory


1.9.5.1. Automatic selection of shared memory address

The Service Manager server can now automatically select a shared memory address based on your system's available
memory. This change makes allocating shared memory easier on Windows systems because you no longer have to specify
one particular address for your system's shared memory. The server automatically scans your system memory and selects
an address range large enough to support your system's shared memory. If for some reason your system has insufficient free
memory, the server will generate an error message telling you so.

The server will automatically select a shared memory address on Windows systems as long as you don't specify an address
with the shared_memory_address parameter. On all Linux systems, the server uses the default values of the
shared_memory_address parameter based on the operating system. If you previously specified a value for the
shared_memory_address parameter, you can remove it from the sm.ini file to have your system automatically select a shared
memory address.

Tip: We recommend you remove the shared_memory_address parameter on all Windows platforms so that the system
automatically selects your shared memory address. This minimizes the chance that your system will fail to start due to a
memory collision with a system resource assigned by Windows ASLR (Address space layout randomization).

Related topics

Shared memory
Enter a parameter in the sm.ini file
Startup parameter: shared_memory_address


1.9.5.2. Example: semaphore reports

The following illustrates the results of semaphore commands.

sm -reportsem


08/27/19 15:46:43 pid (22010) Service Manager diagnostic report follows:
Reporting pid = 22010

--- Mutexs ---

Name                Last pid Available Use Count

Application cache   22010               1      1283

Shared memory       22010               1      7065

Licensing           22010               1      1

User chain          22010               1      230

Database Services   22010               1      1

Counter Services (counters)             22010  1     0

Counter Services (number)               22010  1     0

Diagnostics DB Hashtable                22010  1     0

Diagnostics APP Hashtable               22010  1     0

Diagnostics Process Hashtable           22010  1     0

Global cache        22010               1      50

9973 mutexes for Cache Manager

--- Semaphores ---

Name                Last pid Available # Waiting

System              21718               2      0

Application cache   21637               1      0

Shared memory       21637               1      0

Licensing           21637               1      0

User chain          21637               1      0

Database Services   21637               1      0

Counter Services (counters)             21637  1     0

Counter Services (number)               21637  1     0

Diagnostics DB Hashtable                0      0     0


Diagnostics APP Hashtable                  0  0  0

Diagnostics Process Hashtable              0  0  0

Global cache                            0  0  0

Related topics

Shared memory
Shared memory storage report
Special parameters: reportshm


1.9.5.3. Debug a suspended or hung
system

Applies to User Roles: System Administrator
If Service Manager is unresponsive or appears hung, you can use the reportsem
command to determine if any semaphores are locked.
To run the semaphore report type the following command from a shell prompt (Linux)
or a command prompt (Windows):

  sm -reportsem

Related topics

Example: semaphore reports


1.9.5.4. Shared memory storage report

In the shared memory storage report, the top “Shared memory” section summarizes
shared memory allocation. The bottom “By type” section details areas of the system
that use shared memory.

Shared memory

Shared Memory                           Description
Current size
Occupied space                          The current size of shared memory as
                                        specified in the sm.ini parameter file.
Big alloc space
                                        The amount of shared memory
Unused                                  occupied by allocations less than 32K
                                        in size.

                                        The amount of shared memory
                                        occupied by allocations greater than
                                        32K in size.

                                        The amount of shared memory that has
                                        never been used.

By type


Allocation                              Description

Not named                               System overhead.

User blocks                             Service Manager allocates a storage
                                        block for each logged on user.

Messages                                Messages sent from one user to
                                        another.

Resource locks                          Record locks.

Cache overhead                          Overhead for the five cache categories
                                        (Application cache, DBDICT, Format,
                                        SQL descriptor, IR Expert).

Application cache                       (Cache category.) RAD applications
                                        that have been read by users and that
                                        are in use.

DBDICT cache                            (Cache category.) Database
                                        definitions.

SQL descriptor cache                    (Cache category.) SQL definitions.

Join/ERD/Type cache                     ERD and JOINDEFS definitions.

String Type Cache                       Area in which formats, links and other
                                        definitions are stored.

Example: Shared Memory report

The following sections illustrates the results of the sm -reportshm command:


08/21/19 15:34:23 pid (20002) Service Manager diagnostic
report follows:
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

Type statistics

The following are definitions for the type statistics of a shared memory report.

 Type                                                                                           Service Manager 9.81
 Allocations
                                        Definition
 Frees
 Allocated                              The number of times that shared
                                        memory for this type has been
Related topics                          allocated.

Shared memory                           The number of times that shared
                                        memory for this type has been freed.

                                        The amount in bytes that's currently
                                        allocated for this type.


1.9.5.5. Shared memory sizing
considerations

Service Manager shared memory is divided into three main areas:

     User-related memory
     System table cache

The following topics explain how Service Manager uses shared memory as well as
how each area must be included in the sizing calculation.
Creation and use of shared memory
Shared memory sizing
Horizontal scaling: special considerations
Shared memory related parameters


1.9.5.5.1. Creation and use of shared
memory

Shared memory is a common area of storage that's used by all Service Manager
server processes on a host machine. Using shared memory is an efficient means of
sharing data between processes. For example, when a user or background process
first executes a RAD application, Service Manager loads the application into shared
memory. This allows other user processes to execute the same application without
the overhead of storing a copy of their own into memory. Subsequent executions of
the RAD application will result in Service Manager retrieving the application from
shared memory thus decreasing the IO required by each process. This behavior of
sharing certain data, such as applications, table definitions, and forms between all
users significantly increases program performance because reading data from
memory is more efficient than reading from disk memory. The total amount of
memory used is additionally decreased because one copy of the application, dbdict
or form is shared between all users.

The first process that initiates during the startup of Service Manager on the host
machine creates the shared memory block in the size defined by the shared_memory
parameter in the sm.ini file. The syntax of this parameter is:

  shared_memory:<value>

Where <value> is the amount of memory in bytes Service Manager should allocate.
This shared memory will be held in the machines virtual memory and thus should not
be larger than the virtual memory the machine has available. Information about this
allocation can be seen in the sm.log file by locating the line that reads “Creating
Resources for system xxxxx with key 0xyyyyyyyyy” (where xxxxx represents the port
number you are using and 0xyyyyyyyyy is a system key identifying the shared
memory). Every process that connects afterwards attaches to the shared memory
that was created by the first process. Information about this attachment can be seen
in the sm.log file by locating the line that reads “Attaching to resources for system
xxxxx with key 0xyyyyyyyyy.”. However, execution of some reports, like sm
–reportsem, sm -reportshm and sm –reportlic, will not create shared memory because
they are designed to only read data from existing shared memory.

Example: Shared Memory involvement during the
login process


The login application is called. Service Manager will check shared memory, find that
the login application is not currently stored there, retrieves the code record for the
application from the database, and then loads it into shared memory. At this point,
Service Manager will begin to execute the login application. Once it determines that
the login.prompt form needs to be displayed, it will check shared memory for the
form, find that it's not currently stored there, retrieve the login.prompt form from the
database and load it into shared memory. Once the form is displayed, the user enters
their userid and password, the application then attempts to validate this information
against Service Manager’s operator file. This method of checking shared memory,
retrieving the item from the database, and storing it into shared memory continues
throughout the life of the process. For this reason, the first user to log into Service
Manager is responsible for loading most of the contents of shared memory, which
allows each subsequent user to benefit.

Shared Memory Management

Because the memory in the allocated shared memory area is not released until the
Service Manager server processes are stopped, the initial overhead of allocating
doesn't depend on users logging in and out of Service Manager. It is assumed that
while the server is operating, users will be logging in and out routinely and they will
require continuous access to shared memory. Depending on the information, memory
is released for reuse within the shared memory area at different times. For example,
User Blocks are freed when the user logs out, and cached items are released when
they are no longer needed. Cached information that has changed is flagged obsolete
and a copy of the changed record is loaded into shared memory with the first user
requesting the record after the change. The obsolete record is freed when the use
count of the record is at 0, meaning all user processes using this record have
released it from use.

For example, when a RAD application has changed, the old version is flagged
obsolete if it is still in use and the new version is loaded into shared memory by the
next user requesting the RAD application. This occurs because the system can't find
a current copy of the record in shared memory at that time. The obsolete record is
freed when the last user still using the old code record releases it.

Shared memory in Service Manager is divided into various size blocks of storage. The
sizes available (in bytes) are 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, and
BIG_ALLOC. Any request for shared storage greater than 8192 bytes is satisfied from
the BIG_ALLOC pool. Smaller sized blocks aren't allocated one at a time, but instead,
come from a pool of similar sized requests. For example, when a request is made for
16 bytes of shared storage and there is no 16 byte block free, Service Manager will
allocate a 32K byte block from the lower end of shared memory and divide that 32K


area into 16 byte blocks. The first 16 byte block would be returned to the requestor
and the remaining 16 byte blocks would remain on the 16 byte block free chain for
later allocation. BIG ALLOC starts at the end of the allocated shared memory. When
both ends (<8K and BIG ALLOC) meet, Service Manager is out of shared memory.

Contents

     1 Example: Shared Memory involvement during the login process
     2 Shared Memory Management


1.9.5.5.2. Shared memory sizing

Because the storage area of shared memory is not directly related to the number of
users in the system, the per-user shared memory requirement can only be estimated.
The user’s total shared memory depends on the number of modules used, and the
number of forms, dbdict records, links, format controls, and code records they
access. The estimated amount of shared memory per user will be higher for a smaller
user base, because the cached information in the system is usually relatively static
and doesn't depend on the number of users in the system.
A sample calculation for shared memory is:

  48 MB + 1MB per 10 users

            Note

           Shared memory in a horizontally scaled environment must be calculated
           per machine based on how many users this machine handles during peak
           times.

Shared Memory Adjustments

These suggestions offer a good baseline for most customer systems. However, it may
still be necessary to periodically adjust the amount of shared memory. The amount of
free storage should be monitored regularly using the Service Manager Shared
Memory Report, sm –reportshm.
We recommend never letting the amount of free space fall below 25%. If continuous
monitoring of the shared memory report indicates that free space is constantly above
75%, the shared_memory parameter in the sm.ini file can be set to a lower number to
ensure memory is being used efficiently.

            Note

           Adjustments to the shared_memory parameter must not be made when
           the Service Manager server is running.

Cache Sizing


Cache is stored in slots. By default Service Manager uses 9973 cache slots. The
cache report (sm -reportcache) shows the cache slots used and average and
maximum depths.

C:\scs\sm7\server\RUN>sm -reportcache    -------------------
---------------------- Cache Statistics
---

Slot use: 42%; Average Slot Depth: 1; Maximum Slot Depth: 13

The average slot depth should be below 3 and the maximum should be below 10. If
the average slot depth is too deep, increase the cache_slots parameter to a larger
prime number, such as 11001. Prime numbers are most efficient for cache_slots. This
is due to the fact that we calculate a hash for each item in the cache resulting in
numbers between 0 and 2 32 -1 (32-bit integer). These hash numbers have to be
distributed – if possible evenly – between the available cache slots. This is done with
a modulus function against the cache_slots. Using a prime number has a higher
probability of distributing the cache items evenly amongst the cache slots.

Unused items are removed from cache by the sync process. During the
cache_clean_interval, the sync process enters a timestamp into all cache items that
have a use count of 0. During the next cache_clean_interval, if it still shows the
timestamp the item will be removed from cache. If the cache item was used after the
first interval, the use count overwrites the timestamp indicating the item has been
recently used. Thus cache items that were unused for cache_clean_interval (seconds)
* 2 will be removed from the cache.

Shared Memory Reports

You can monitor the allocation and growth of shared memory by using the Service
Manager Shared Memory Report, sm –reportshm. The following figure is an example
of a shared memory report. The report contains a list of all the items currently stored
in shared memory in addition to the amount of storage each item is using.


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

Current Size is the amount of shared memory allocated in bytes as defined by the
shared_memory parameter in the sm.ini file.

Free Space is the amount of shared memory that's available for use by processes.
Free Space is gained when previously used Shared Memory areas are made available
again. Also, Free Space is the sum of "Unused Space" (memory never before
allocated) and "Freed Space" (memory in the free list chain that was previously
allocated) Free Space is shown as total bytes and as an overall percentage.

Unused Space represents available shared memory that has not yet been allocated.
When Service Manager starts, the entire amount of memory defined by the
shared_memory parameter is allocated, and blocks may then be allocated from within


that shared memory as needed. Unused Space is shown in total bytes and as an
overall percentage.

Using sm -reportshm:1 to generate the Service Manager Shared Memory Report will
produce a more detailed listing of shared memory allocation.

Messages

Every message that's sent from one user to another is put into the message block
section of shared memory. The amount of shared memory allocated per message
depends on the size of the message.

Database Services

Tuning statistics regarding executed queries and database access are stored in this
area. Statistics indicating possible performance issues are written to the sc.alert.log.

Cache Overhead

Contains operators and other system information; It also contains overhead or
miscellaneous items that need to be stored for multi-process access

Application Cache

This area in shared memory holds code records, pre-parsed and split up by panel.

DBDict Cache

This area contains cached Table Definitions (dbdict records) as well as other cached
data records such as: format, link, format control, category, scmessage.

SQL Descriptor Cache

This area in shared memory is used by the RDBMS mapping engine and contains the
mapping information between the dbdict and the RDBMS table definitions.

JOIN/ERD/TYPE Cache

This area contains records from joindef, erddef, scaccess, scmandant and
sctypecheck

String Type Cache

This contains the fastcounters data structure, files and fields using counters, cascade
delete definitions, cached charts, list of defined triggers, JavaScript triggers that for
ease of Shared Memory storage are wrapped into a STRING.

JavaScript Members


This area contains information used by or required for JavaScript applications. It
doesn't contain JavaScript code, but rather information on the current version of the
Script member.

IR Expert and Shared Memory

Starting from version 9.62, IR no longer uses any shared memory.


1.9.5.5.3. Horizontal scaling: special
considerations

Each horizontally scaled host machine has its own shared memory calculated based
on the amount of users supposed to be running on that machine.

  48 MB + 1 MB per 10 users

In the horizontally scaled system messages to users as well as Cache updates on
changed cached records are communicated to all shared memory sections of all host
machines in the group.
Locks aren't held in shared memory at all in horizontally scaled systems. Locks are
handled differently depending on your version of Service Manager. For versions of
Service Manager earlier than Service Manager 9.31, locks are communicated by using
UDP Multicasting between the systems and the locking information is held in the JVM.
For Service Manager 9.31 and later versions, locks are stored in the central RDBMS.
For more information on how locks are managed in Service Manager 9.31, see the
Lock Management topic in the Service Manager Help Server.


1.9.5.5.4. Shared memory related
parameters

As soon as less than 25% of shared memory is unused, it is recommended that the
amount of shared memory be increased by modifying the shared_memory parameter
in the sm.ini file. Unused shared memory is the amount of memory that has never
been allocated. The real percentage of available memory is always higher than what
the unused percentage in the Service Manager Shared Memory Report depicts.

Because shared memory can become fragmented, leaving at least 25% of free space
is recommended. This will ensure that fragmentation doesn't prevent new space from
being allocated within the shared memory area.

The shared_memory_address:<memory address> parameter can be used on all
operating systems to ensure that shared memory allocation is kept in an area that will
not interfere with shared libraries, stacks, heaps or other memory related data
structures. You can use this parameter to specify a new address that has enough
contiguous memory for the Service Manager process.

If you encounter a shared memory allocation failure, the address that the Service
Manager process is using doesn't have enough contiguous memory. On Windows, the
sm.log file lists recommendations for possible shared_memory_address parameter
values. If the debugvmmap parameter is active, the log also contains a map of virtual
memory at the time of the failure.

For more details, see the following Service Manager online help topics:

     Startup parameter: shared_memory_address
     Failed to initialize or attach to shared memory environment (Windows only)

            Note

           The defaults should be working for all platforms. You should only use this
           parameter when instructed to do so by Customer Support.

Shared Memory Support Information

Shared memory problems can be some of the most difficult to resolve. However, if
problems with shared memory arise, you can contact Customer Support with the
following information ready to help expedite a satisfactory solution:

     Detailed description of the issue


Copies of all Service Manager log files
Copies of any core files that were generated
Service Manager Shared Memory Report
Service Manager Semaphore Report
````
