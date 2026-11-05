---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.2.15.12 .. 1.2.15.25
printed_pages: 516-542
---

# 1.2.15.12 Parameter: httpPort

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.15.12. Parameter: httpPort

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

httpPort

Description

This parameter defines the communications port that a servlet container process
uses to communicate with clients using HTTP. A servlet container process can only
have one HTTP port open at a time.

It is best practice to use this parameter from the command line or configuration file
for each individual servlet container process you start. This practice makes it easy to
identify the HTTP communications port each servlet container uses.

Valid if set from

Server's operating system command prompt

Start up file (sm.cfg or smstart)

Requires restart of the Service Manager server?

No

Default value

None

Possible values

Any valid communications port number

Example usage

Command line: sm -httpPort:13081

Related topics

Servlet implementation
System parameters
Enter a parameter in the sm.ini file
Connection parameters
Servlet parameters



1.2.15.13. Parameter: httpsPort

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

httpsPort

Description

This parameter defines the communications port that a servlet container process
uses to communicate with clients using HTTPS (SSL-encrypted HTTP). A servlet
container process can only have one HTTPS port open at a time. Servlet container
processes can only use an HTTPS communications port if the sslConnector
parameter is enabled. This parameter requires the use of the sslConnector parameter.

It is best practice to use this parameter from the command line or configuration file
for each individual servlet container process you start. This practice makes it easy to
identify the HTTPS communications port each servlet container uses.

Valid if set from

Server's operating system command prompt

Start up file (sm.cfg or smstart)

Requires restart of the Service Manager server?

No

Default value

None

Possible values

Any valid communications port number

Example usage

Command line: sm -httpsPort:13081

Related topics

Servlet implementation
System parameters
Enter a parameter in the sm.ini file


Connection parameters
Servlet parameters


1.2.15.14. Parameter: licensefile

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

licensefile

Description

This parameter defines the path to the AutoPass license file containing the list of
enabled modules and features for your Service Manager server.

            Tip

           If you need to renew your license, you can use the updatelicense
           command to load a new license file into your existing one.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

Service Manager installation directory/RUN/LicFile.txt

Possible values

Path and file name of the AutoPass license file.
In the command line usage, if there is a space in the path name, you need to enclose
path names in quotation marks.

Example usage

Command line: sm -httpPort:13080 -httpsPort:13081 -
licensefile:"c:/CommonFiles/LicFile.txt"
Initialization file: licensefile:c:/CommonFiles/LicFile.txt


Related topics

System parameters
Enter a parameter in the sm.ini file
Parameter: updatelicense


1.2.15.15. Parameter: loadBalancer

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

loadBalancer

Description

This parameter creates a load balancer process that listens to incoming client
requests on the communications port specified by the httpPort parameter. The load
balancer process forwards client connection requests to an available thread on a
servlet container process. This parameter requires at least one servlet container
process to which to forward client requests. The servlet container process can be on
the local Service Manager system or on another system that's part of the same virtual
group.

Valid if set from

Server's operating system command prompt

Start up file ( sm.cfg or smstart )

Requires restart of the Service Manager server?

No

Default value

None

Possible values

None

Example usage

Command line: sm -loadBalancer -httpPort:13080

Related topics

Servlet implementation
System parameters
Enter a parameter in the sm.ini file


Connection parameters
Servlet parameters


1.2.15.16. Startup parameter: ntservice

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

ntservice

Description

This parameter defines the name of the Windows service you want to run Service
Manager. You can set this parameter from the Configure server utility.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)
Configure server utility

Requires restart of the Service Manager server?

Yes

Default value

None

Possible values

Name of the Windows service

Example usage

Command line: sm -httpPort:13080 -ntservice: Service Manager server
Initialization file: ntservice: Service Manager server

Related topics

System parameters
Enter a parameter in the sm.ini file
Connection parameters


1.2.15.17. Parameter: pid

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

pid

Description

This parameter terminates a Service Manager process with the given process ID. This
parameter must be used with the -shutdown command.

Valid if set from

Server's operating system command prompt

Requires restart of the Service Manager server?

No

Default value

None

Possible values

The ID of the process to terminate

Example usage

Command line: sm –shutdown –pid:12345

Related topics

System parameters
Enter a parameter in the sm.ini file
Connection parameters


1.2.15.18. Parameter: preferredFQHN

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

preferredFQHN

Description

This parameter allows you to specify the fully qualified host name you want Service
Manager clients to use when communicating with the server. You only need to set this
parameter if your Service Manager host is identified by multiple names on the
network.

During startup, the Service Manager process determines the host name and registers
it with the load balancer for later use. The load balancer process manages and routes
internal client connections to the host name, which is specified as
http://hostname:httpPort . When the load balancer receives a client request, it
redirects the client to the previously determined host name of the process.

This parameter applies to both horizontally-scaled and vertically-scaled
environments. In a horizontally-scaled environment, this parameter specifies the
preferred host name of the local system for client connections. For example, your
system manages two concurrent client connections, prodhost.corp.com and
prodhost.emea.corp.net. You need the load balancer process to manage and route
internal client connections through prodhost.emea.corp.net. Set the parameter in the
initialization file as follows:

preferredFQHN:prodhost.emea.corp.net

Valid if set from

Server's operating system command prompt

Start up file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

None


Possible values

None

Example usage

Command line: preferredFQHN:prodhost.emea.corp.net

Related topics

Servlet implementation
System parameters
Enter a parameter in the sm.ini file
Parameter: loadBalancer
Connection parameters
Servlet parameters


1.2.15.19. Startup parameter: quiesce

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

quiesce

Description

This parameter sets login restrictions to prevent users from logging on to Service
Manager processes. This gives System Administrators a way to stop users from
logging on to Service Manager processes, and wait for existing users to gracefully log
off before starting system maintenance or testing tailoring activities.

There are three levels of login restrictions. Quiesce level 1 restricts all users, except
System Administrators, from logging on to Service Manager processes. Quiesce level
2 restricts all users from logging on to Service Manager processes. Quiesce level 0
(zero) sets Service Manager processes to allow user logins. In the vertical scaled or
horizontal scaled environment, Service Manager loadBalancer doesn't forward any
client connection requests to Service Manager processes that are in quiesce level 1 or
2. If System Administrators want to connect to a Service Manager process in quiesce
level 1, they must connect directly to the Service Manager process without
connecting through Service Manager loadBalancer.

For detailed information on when quiesce mode can be set and how logins are
restricted in a vertical scaled environment and a horizontal scaled environment, see
the related topics.

            Note

           If the "-group" or "-host" option is not specified, the quiesce command
           applies to all Service Manager processes on the local host.

Valid if set from

Server's operating system command prompt

Requires restart of the Service Manager server?

No

Default value


0

Possible values

0 (Allows all users, no restrictions)

1 (Restricts all user logins, except System administrators)

2 (Restricts all user logins)

Example usage

Example 1: The System Administrator runs the following command to set quiesce
mode 1 on all Service Manager processes on the local host. All users are restricted
from these processes, except the System Administrator.

Command line: sm -quiesce:1

Example 2: The System Administrator runs the following command to set quiesce
mode 1 on the host whose IP address is 15.28.113.121 in the horizontal scaled group.

Command line: sm -quiesce:1 -host:15.28.113.121

Example 3: The System Administrator runs the following command to set quiesce
mode 2 for all Service Manager processes in the horizontal scaled group. This
restricts all users from accessing Service Manager processes in the entire cluster.

Command line: sm -quiesce:2 -group

Example 4: The System Administrator has completed system maintenance and runs
the following command to bring the system back to non-quiesce mode. All Service
Manager processes in the horizontal scaled group that were quiesced can now
accept user logins.

Command line: sm -quiesce:0 -group

Example 5: The System Administrator runs the following command to set Service
Manager processes on host 15.28.113.121 to non-quiesce mode. Service Manager
processes on host 15.28.113.121 now accept user logins.

Command line: sm -quiesce:0 -host:15.28.113.121

Related topics

System quiesce: Login restrictions
Enter a parameter in the sm.ini file
Connection parameters


1.2.15.20. Parameter: reportlbstatus

Parameter

reportlbstatus

Description

This parameter displays information about available ports and threads in horizontal
and vertical scaling servlet implementations. You can capture the output of this report
in a text file using standard output (stdout) parameters appropriate to your operating
system.
The following example shows connection statistics for a vertical scaling servlet
implementation on one host.

            Note

                This example report has been reformatted for print display.
                The output in this example has been truncated (this is not the full
                output from the command).


Load Balancer Status:Sat Jun 23 09:58:52 PDT 2012

HP Service Manager LoadBalancer Running on

Host:myhost.myserver.com Port:34567

List of Hosts:

HostName: myhost.myserver.com

----------------------------------------------------------------

---Server Instances

ProcessID  ClusterAddress               HttpPort HttpsPort Sessions

DbgMode QMode LB

7872    15.178.177.72:33285 34568                    0                 (3/50)

N       N  N

7881    15.178.177.72:33283 34569                    0                 (1/50)

N       N  N

7837    15.178.177.72:33278 34567                    0                 (0/50)

N       N  Y

---------------------------------------------------

State      LowMem                       JAVA_USED/MAX/PERCENT

WR[6d22h39m] N                          (4404408/238616576/1.8458097)

QR[9m]     N                            (2983152/238616576/1.2501864)

RUN        N                            (2601080/238616576/1.0900668)

------------------------------------------------------------Non

Server Instances---

ProcessID  ClusterAddress               State                  LowMem

JAVA_USED/MAX/PERCENT

8510    15.178.177.72:33329             RUN                    N

(0/89522176/0.0)

7931    15.178.177.72:33299             RUN                    N

(1502256/59703296/2.5162027)

7880    15.178.177.72:33280             RST                    N

(1539248/59703296/2.5781624)

7930    15.178.177.72:33291             SHT                    N

(1514024/59703296/2.5359137)

---------------------------------------

Command Line parameters

-reportlbstatus

-sync -log:../logs/sm.sync.log

system.start -log:../logs/sm.start.log

The State column lists one of the following values:


State                                   Description
RUN
WR[<time>]                              The process is currently running.

QR[<time>]                              The process is in restart waiting
                                        interval. The value in brackets is the
RST                                     remaining waiting interval expressed in
SHT                                     d days, h hours, and m minutes.

                                        The process is in quiesce mode prior to
                                        restarting. The value in brackets is the
                                        time remaining until the process
                                        restarts expressed in d days, h hours,
                                        and m minutes.

                                        The process is currently restarting.

                                        The process is currently shutting down.

The report output will appear in the log directory with a file name of
sm.log_datetime.log, where datetime is in the format mmddyyhhmmss and represent
the time at which the command was submitted.

Valid if set from

Server's operating system command prompt

Requires restart of the Service Manager server?

Yes

Default value

None

Possible values

The number of seconds in which the report should execute again

Example usage

Command line: sm -reportlbstatus status.txt

Related topics


Monitoring native heap and Java heap memory
Servlet implementation
System parameters
Enter a parameter in the sm.ini file
Connection parameters
Servlet parameters


1.2.15.21. Parameter: requestviaproxy

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

requestviaproxy

Description

This parameter specifies if the Service Manager Windows client is allowed to connect
to the server through a proxy. Enable this parameter only if, for security reasons, your
production environment requires each Windows client to connect to the server
through a proxy. This functionality works as described in the following:

     When requestviaproxy is enabled, the Windows client can connect to the server
     either with or without a proxy.
     When requestviaproxy is disabled, the Windows client can connect to the
     server successfully only if the client is not behind a proxy. An error message
     pops up when the Windows client is attempting to connect to the server through
     a proxy.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

0 (Disabled)

Possible values

0 (Disabled)

1 (Enabled)

Example usage

Command line: sm -httpPort:13080 -requestviaproxy:1

Initialization file: requestviaproxy:1


Related topics

Enter a parameter in the sm.ini file
Connection parameters
Servlet parameters
Startup parameter: quiesce


1.2.15.22. Parameter: scauto

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

scauto

Description

This parameter specifies the SCAuto service name.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

12690

Possible values

A user-provided service name when starting “scautod”.
If this CR is not specified, the system uses 12690.

Example usage

Command line: sm –scauto:myservice
Initialization file: scauto:myservice

Related topics

System parameters
Enter a parameter in the sm.ini file
Connection parameters


1.2.15.23. Parameter: scautolistener

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

scautolistener

Description

Defining this parameter causes the Service Manager server to listen for connections
requests from the legacy SCAuto integration on the communications port specified.

Important: The SCAuto listener can't accept connection requests from Windows or
web clients. You must start a client listener to manage client connections.

Valid if set from

Server's operating system command prompt

Requires restart of the Service Manager server?

Yes

Default value

12690

Possible values

Communications port number

Example usage

Command line: sm -scautolistener:12690

Related topics

System parameters
Enter a parameter in the sm.ini file
Connection parameters


1.2.15.24. Startup parameter: shutdown

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

shutdown

Description

Use this parameter at the operating system command prompt to perform the following
actions:

     Immediately shut down the Service Manager server.
     Shut down a specific Service Manager process by specifying the hostname of
     the Service Manager server and system process (PID) that you want to shut
     down.

            Note

           If the host is not specified, the default is localhost.

Warning: Using the shutdown parameter immediately shuts down the Service
Manager server without any warning to connected users and could result in data loss
or corruption. We recommend you first quiesce a system before shutting it down.

Valid if set from

Server's operating system command prompt

Requires restart of the Service Manager server?

No

Default value

None

Possible values

None

Example usage

Shut down the local Service Manager server.


Command line: sm -shutdown
Shut down a specific Service Manager process.
Command line: sm -shutdown -host:myhost.myserver.com -PID:1234

Related topics

System parameters
Enter a parameter in the sm.ini file
Connection parameters


1.2.15.25. Parameter: sslConnector

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

sslConnector

Description

This parameter defines whether servlet container processes have an HTTPS (SSL-
encrypted HTTP) communications port available. A servlet container process can
only have one HTTPS port open at a time. Servlet container processes can only use
an HTTPS communications port if the sslConnector parameter is enabled. This
parameter requires the use of the httpsPort parameter.

It is best practice to place this parameter in the Service Manager initialization file so
that you enable or disable the HTTPS port for all servlet containers on the same
system.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

1

Possible values

0 (Disable)

1 (Enable)

Example usage

Initialization file: -sslConnector:0

Related topics


Servlet implementation
System parameters
Enter a parameter in the sm.ini file
Connection parameters
Servlet parameters
````
