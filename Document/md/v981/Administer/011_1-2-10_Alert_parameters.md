---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.2.10 .. 1.2.12
printed_pages: 249-270
---

# 1.2.10 Alert parameters

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.10. Alert parameters

The following table lists the startup parameters that you can set from the Service
Manager server's operating system command prompt or from the Service Manager
initialization file (sm.ini).
These parameters determine how the server handles alert messages.

 Startup parameter                                                                              Service Manager 9.81
 Startup parameter: alertcpulimit
                                        Description
 Startup parameter: alertfilters
 Startup parameter: alerthitratio       Defines the number of standard
                                        deviations from the mean CPU usage
 Startup parameter: alertholdlimit      that cause the Service Manager server
                                        to issue an alert message
 Startup parameter: alertquerylimit
                                        Defines the names of alerts that you
 Startup parameter: alertvirtuallimit   want the Service Manager server to
                                        filter out of alert messages
 Startup parameter: alertwaitlimit
                                        Defines the percentage of records
Related topics                          inspected to records selected that
                                        cause the Service Manager server
System parameters                       issues an alert message
Enter a parameter in the sm.ini file
                                        Defines the number of milliseconds
This PDF was generated on May 23, 2026  that a process can hold a lock on a
                                        system resource before the Service
                                        Manager server issues an alert
                                        message

                                        Defines the number of milliseconds
                                        that a query can run before the Service
                                        Manager server issues an alert
                                        message

                                        Defines the number of kilobytes of
                                        virtual memory used that cause the
                                        Service Manager server to issue an
                                        alert message

                                        Defines the number of milliseconds
                                        that a process can wait for a system
                                        resource before the Service Manager
                                        server issues an alert message

                                                                                                                          Page 33 of 208


1.2.10.1. Startup parameter: alertcpulimit

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

alertcpulimit

Description

This parameter defines the number of standard deviations from the mean CPU usage
that cause the Service Manager server to issue an alert message.

For example, suppose that a customer reports that they have set the
alertperoidicschedule record to expire every 5 minutes. This means that every 5
minutes we look at the amount of CPU consumed by each process in the last 5
minutes. We take all the values and we get an average. Given all the values that make
the average there is a statistical calculation called the standard deviation that returns
a number that represents how far from the average each deviation is. If all of the
users used between 5 and 7 cpu seconds then the standard deviation would be really
small. If all the users used between 5 and 100 cpu seconds (assume the values were
spread out across this range) then the standard deviation would be larger. So in the
last case lets assume the average was 50 and the standard deviation was 3, then we
would report on any user who used more than 65 seconds (50 + 5*3).

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

5

Possible values

Number of standard deviations

Example usage

Command line: sm -httpPort:13080 -alertcpulimit:2


Initialization file: alertcpulimit:2

Related topics

System parameters
Enter a parameter in the sm.ini file
Alert parameters


1.2.10.2. Startup parameter: alertfilters

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

alertfilters

Description

This parameter defines the names of alerts that you want the Service Manager server
to filter out of alert messages. The Service Manager server no longer posts alert
messages from alert categories you filter.

You can use an asterisk (*) at the end of the alert name to specify all alerts within that
category. For example, to filter out all performance alerts, type:
alertfilters:Performance*.

You can use a semicolon to list additional alert names. For example, to specify all
mapping alerts and a long running query alert against the contacts file, type:
alertfilters:Mapping*;Performance-5-contacts.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

None

Possible values

Names of alerts

Example usage

Command line: sm -httpPort:13080 -alertfilters:Mapping*;Performance-5-contacts

Initialization file: alertfilters:Mapping*;Performance-5-contacts

Related topics


System parameters
Enter a parameter in the sm.ini file
Alert parameters


1.2.10.3. Startup parameter: alerthitratio

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

alerthitratio

Description

This parameter defines the percentage of records inspected to records selected that
cause the Service Manager server issues an alert message. The lower hit ratio
percentage you define the more inefficient queries you allow.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

None

Possible values

Percentage of query records inspected to records selected

Example usage

Command line: sm -httpPort:13080 -alerthitratio:10

Initialization file: alerthitratio:10

Related topics

System parameters
Enter a parameter in the sm.ini file
Alert parameters


1.2.10.4. Startup parameter: alertholdlimit

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

alertholdlimit

Description

This parameter defines the number of milliseconds that a process can hold a lock on
a system resource before the Service Manager server issues an alert message. You
can use this parameter in conjunction with the alertwaitlimit parameter to determine
how the Service Manager server manages locks on system resources.

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

Command line: sm -httpPort:13080 -alertholdlimit:1500

Initialization file: alertholdlimit:1500

Related topics

System parameters
Enter a parameter in the sm.ini file
Alert parameters


1.2.10.5. Startup parameter:
alertquerylimit

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

alertquerylimit

Description

This parameter defines the number of milliseconds that a query can run before the
Service Manager server issues an alert message.

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

Command line: sm -httpPort:13080 -alertquerylimit:3000
Initialization file: alertquerylimit:3000

Related topics

System parameters
Enter a parameter in the sm.ini file
Alert parameters


1.2.10.6. Startup parameter:
alertvirtuallimit

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

alertvirtuallimit

Description

This parameter defines the number of kilobytes of virtual memory used that cause the
Service Manager server to issue an alert message.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

None

Possible values

Number of kilobytes of virtual memory

Example usage

Command line: sm -httpPort:13080 -alertvirtuallimit:1024
Initialization file: alertvirtuallimit:1024

Related topics

System parameters
Enter a parameter in the sm.ini file
Alert parameters


1.2.10.7. Startup parameter: alertwaitlimit

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

alertwaitlimit

Description

This parameter defines the number of milliseconds that a process can wait for a
system resource before the Service Manager server issues an alert message. You can
use this parameter in conjunction with the alertholdlimit parameter to determine how
the Service Manager server manages locks on system resources.

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

Command line: sm -httpPort:13080 -alertwaitlimit:1500

Initialization file: alertwaitlimit:1500

Related topics

System parameters
Enter a parameter in the sm.ini file
Alert parameters


1.2.11. Application development
parameters

The following table lists the startup parameters that you can set from the Service
Manager server's operating system command prompt or from the Service Manager
initialization file (sm.ini).

The following parameter sets a feature in the application development environment.

Startup parameter                       Description
Startup parameter: agstackl
                                        Defines the length of the stack that the
                                        Service Manager server allocates to
                                        run RAD applications

Related topics

System parameters
Enter a parameter in the sm.ini file


1.2.11.1. Startup parameter: agstackl

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

agstackl

Description

This parameter defines the length of the stack the Service Manager server allocates
to run RAD applications. Changing the value of this parameter has a small impact on
the memory allocation of the session and the process.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

1000

Possible values

Stack length from 1-2000

Example usage

Command line: sm -httpPort:13080 -agstackl:1000

Initialization file: agstackl:1000

Related topics

System parameters
Enter a parameter in the sm.ini file
Application development parameters


1.2.12. Background and scheduled
process parameters

The following table lists the startup parameters that you can set from the Service
Manager server's operating system command prompt or from the Service Manager
initialization file (sm.ini).

These parameters set features for background and scheduled processes.

Startup parameter                       Brief description
Special parameters: bg
Parameter: deadnodelocktimeout          Causes the Service Manager server to
                                        mark all background process as
Special parameters: sync                SYSTEM processes

Special parameters: synctime            Specifies the amount of time that must
                                        elapse before a process forcibly
                                        removes a lock from the Lock or
                                        LockShared table

                                        Starts the synchronization process,
                                        which identifies and removes locks
                                        owned by inactive processes and
                                        shared memory

                                        Defines the number of seconds the
                                        sync process waits before identifying
                                        and removing locks owned by defunct
                                        processes and shared memory

Related topics

System parameters
Enter a parameter in the sm.ini file


1.2.12.1. Special parameters: bg

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

bg

Description

This parameter causes the Service Manager Server to run RAD processes in
background mode (that is, no user interactions or messages are available).

This parameter affects three aspects in the RTE: the DBI (Database Interface) layer,
the APPs code, and message sending.

     In the DBI layer, once this parameter is set, the following db operations will not
     trigger any error messages to the client any more:

           delete:

           If DBI is trying to delete a record that was already deleted by others, the
           message "The record being deleted was already deleted" is not sent.

           If DBI is trying to delete a record that was already modified by others, the
           message "The record being deleted has been modified since read" is not
           sent.

           dbUpdate:

           If DBI is trying to update a record that was already deleted by others, the
           message "The record being updated has been deleted" is not sent.

           If DBI is trying to update a record that was modified by others, the message
           "The record being updated has been modified since read" is not sent.

     When "bg" is set, the following APPs functions will fail with an error as
     described below:

           fdisp: "FDISP panels can't be executed in the background."
           rio: "RIO panels can't be executed in the background."
           wopen: "WOPEN panels can't be executed in the background."
           wclose: "WCLOSE panels can't be executed in the background."
           wselect: "WSELECT panels can't be executed in the background."


     Once "bg" is set, all messages generated by RTE code and APPs code (via APPs
     function "scmsg") aren't sent to the client; instead, they are sent to the log files
     defined by the parameter "log" (by default, it is sm.log).

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

Command line: sm -httpPort:13080 -bg
Initialization file: bg

Related topics

System parameters
Enter a parameter in the sm.ini file
Background and scheduled process parameters


1.2.12.2. Special parameters: sync

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.
You can set a startup parameter from the server OS command prompt on the server
machine.

Parameter

sync

Description

This parameter starts the sync process, which identifies and removes locks owned by
inactive processes and shared memory. The sync process performs the following
tasks:

     Checks for and removes processes that are no longer active.
     Checks for and release semaphores that the server has held for more than 60
     seconds.
     Checks for and removes cached items in shared memory that are no longer in
     use.

The sync process checks Service Manager shared memory for processes that no
longer exist.

When a Service Manager process starts, it stores data structures in shared memory
indicating the process name and PID. You can see this information using the system
status utility. When a process terminates, the information is removed.

The sync process checks the user chain for processes that are still active but no
longer exist in the operating system. The process takes the PID and queries the
operating system to see if this process still exists. If it doesn't, it terminated
unexpectedly.

The sync process cleans all outstanding resource locks and semaphore locks and
removes the processes from the user thread. By doing so, semaphores and locks
become available again and other processes waiting for the resources begin to
respond.


            Note

           You must run the sm -sync command on every host in the clustering
           environment in order to clean user sessions. Thread level detection only
           occurs on the local host and each user runs as a thread. With no sync
           processing running, the local host is unable to terminate the expired user
           session.

Valid if set from

The server's operating system command prompt

Requires restart of the Service Manager server?

No

Default value

None

Possible values

None

Example usage

Command line: sm -sync

Related topics

System parameters
Enter a parameter in the sm.ini file
Background and scheduled process parameters


1.2.12.3. Special parameters: synctime

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

synctime

Description

This parameter defines the number of seconds the sync process waits before
identifying and removing locks owned by defunct processes and shared memory.

Valid if set from

Server's operating system command prompt

Requires restart of the Service Manager server?

No

Default value

1200 seconds

Possible values

Number of seconds

Example usage

Command line: sm -synctime:1300

Related topics

System parameters
Enter a parameter in the sm.ini file
Background and scheduled process parameters


1.2.12.4. Parameter: deadnodelocktimeout

Parameter

deadnodelocktimeout

Description

This parameter specifies the amount of time that must elapse before a process
forcibly removes a lock from the Lock or LockShared table. By default, this parameter
is set to 10, which indicates that 10 minutes must elapse before a record is forcibly
removed. 10 minutes is also the minimum value for this parameter.

Valid if set from

Initialization file (sm.ini)

Requires restart of server?

No

Default value

10 (minutes)

Possible values

>=10 (minutes); 10 minutes is also the minimum value.

Example usage

Initialization file: deadnodelocktimeout:10

Related topics

System parameters
Lock management
````
