---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.2.24 .. 1.2.24.11
printed_pages: 732-759
---

# 1.2.24 Servlet parameters

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.24. Servlet parameters

The following table lists the startup parameters you can set from the Service Manager
server's operating system command prompt or from the Service Manager initialization
file (sm.ini).
These parameters determine how a Service Manager server manages client
connections.

Servlet Parameter                                                                               Service Manager 9.81
Parameter: appthreadspersession
                                        Description
Parameter: asyncrefreshlbinterval
Parameter: attachedByName               Gives a site some control over the
checkdatetimevalue                      amount of server memory that a user
Parameter: disableXrs                   can consume by limiting the number of
Parameter:                              application tabs that can be opened
emailoutConfigFromSmisOnly              through the client

Parameter: fetchnotnullsystemp          Determines the interval (measured in
                                        seconds) at which the status of the
                                        loadbalancer is refreshed.

                                        Specifies whether the operator name
                                        or the contact name is displayed in the
                                        Attached By field from the attachment
                                        list in the web client.

                                        Determines whether Service Manager
                                        validates the date fields, such as the
                                        Planned Start and Planned End date
                                        fields.

                                        Enables and disables the -Xrs JVM
                                        option

                                        Set
                                        the emailoutConfigFromSmisOnly:1 se
                                        rver parameter to use SMIS to
                                        configure emailout settings. After this
                                        parameter is enabled, the parameters
                                        defined in the emailout process
                                        through sm.cfg and sm.ini won't work.
                                        Instead, those parameter values such
                                        as smtphost will only be get from SMIS
                                        configuration.

                                        Specifies whether or not to fully enable
                                        the template merge functionality for the
                                        operator table

Servlet Parameter                                                                               Service Manager 9.81
Parameter: GossipRouterhosts
                                        Description
Parameter: group
Parameter: groupbindaddress             provides a list of available
                                        GossipRouters. Service Manager nodes
Parameter: grouplicenseip               read this parameter to identify all
Parameter: groupmcastaddress            GossipRouters (this behavior requires
                                        the addition of command lines in the
Parameter: groupname                    sm.cfg file).
Parameter: groupport
                                        Shuts down or quiesces all Service
                                        Manager server members in a virtual
                                        group

                                        Defines the TCP/IP address of the
                                        network adapter you want servlet
                                        container processes to use to
                                        communicate with other processes in a
                                        virtual group

                                        Defines the TCP/IP address of the
                                        Service Manager host with a valid
                                        AutoPass license for the virtual group

                                        Defines the TCP/IP address that servlet
                                        container processes can use to
                                        communicate with the load balancer
                                        process in a horizontal scaling
                                        implementation

                                        Creates a virtual group that servlet
                                        container processes across multiple
                                        systems can join for horizontal scaling
                                        purposes

                                        Defines the communications port that
                                        servlet container processes can use to
                                        communicate with the load balancer
                                        process in a horizontal scaling
                                        implementation

Servlet Parameter                                                                               Service Manager 9.81
Parameter: groupsubnetaddress
Parameter: grouptcpbindport             Description

Parameter: groupudpjointimeout          Defines the subnet mask that the
Parameter: grouptcpjointimeout          multicasting IP address resides on in a
Parameter: grouptimeout                 horizontal scaling implementation
Parameter: host
Parameter: httpPort                     Specifies the bind port for each group
                                        member to communicate with each
                                        other. By default, Service Manager tries
                                        to assign port 7800 for each member. If
                                        this is impossible, it tries the next
                                        higher port (7801) and so on, until it
                                        finds an unused port.

                                        Determines the number of seconds
                                        within which a Service Manager node
                                        successfully joins a Jgroups cluster
                                        before the operation times out when
                                        using the UDP protocol.

                                        Determines the number of seconds
                                        within which a Service Manager node
                                        must successfully join a Jgroup before
                                        the operation times out.

                                        Defines the timeout value (in
                                        milliseconds) for Jgroups remote
                                        procedure calls

                                        Specifies the host name of the Service
                                        Manager server that you want to shut
                                        down or quiesce

                                        Defines the communications port that a
                                        servlet container process uses to
                                        communicate with clients using HTTP

 Servlet Parameter                                                                              Service Manager 9.81
 Parameter: httpsPort
 Parameter: idmsigningkey               Description
 Parameter: idmssoenabled
 Parameter: JVMOption                   Defines the communications port that a
 Parameter: jgroupstcp                  servlet container process uses to
 Parameter: keystoreFile                communicate with clients using HTTPS
 Parameter: keystorePass                (SSL-encrypted HTTP)
 Parameter: loadBalancer
 Parameter: logperprocess               Specifies a key that's used to
                                        sign Identity Manager (IdM) tokens.
This PDF was generated on May 23, 2026
                                        Determines whether Identity
                                        Manager (IdM) Single Sign-On is
                                        enabled for the Service Manager
                                        Server.

                                        Specifies a JVM option.

                                        Determines whether Service Manager
                                        Jgroups run on Transmission Control
                                        Protocol (TCP) or on User Datagram
                                        Protocol (UDP) .

                                        Defines the path and file name to the
                                        Java keystore that contains the
                                        certificate of the Service Manager
                                        server

                                        Defines the password to the Java
                                        keystore that contains the certificate of
                                        the Service Manager server

                                        Creates a load balancer process that
                                        listens to incoming client requests on
                                        the communications port specified by
                                        the httpPort parameter

                                        Defines whether to create a log file for
                                        each vertical scaled Service Manager
                                        process.

                                                                                                                            Page 7 of 180
Servlet Parameter                                                                               Service Manager 9.81
Parameter: maxattachmentcount
Parameter: queryhashcode                Description
Parameter: reportgroup
Parameter: reportlbstatus               Specifies the maximum number of files
Parameter: sslConnector                 that can be attached to an individual
Parameter: threadsperprocess            record.
Parameter: ssl_trustedClientsJKS
                                        Enables all Service Manager processes
Parameter: ssl_trustedClientsPwd        to consistently generate a unique hash
                                        code, which can be accepted and
                                        properly decoded by the web tier

                                        Displays the status of ports, processes,
                                        and threads in horizontal and vertical
                                        scaling servlet implementations

                                        Displays information about available
                                        ports and threads in horizontal and
                                        vertical scaling servlet implementations

                                        Defines whether servlet container
                                        processes have an HTTPS (SSL-
                                        encrypted HTTP) communications port
                                        available

                                        Defines the number of threads that you
                                        want the Service Manager server to
                                        start when it starts a new process

                                        Defines the path and file name to the
                                        Java keystore that contains the list of
                                        trusted client certificates from which
                                        the Service Manager server allows
                                        connection requests

                                        Defines the password to the Java
                                        keystore that contains the list of trusted
                                        client certificates from which the
                                        Service Manager server allows
                                        connection requests

 Servlet Parameter                                                                              Service Manager 9.81
 Parameter: truststoreFile
                                        Description
 Parameter: truststorePass
                                        Defines the path and file name of the
Related topics                          Java keystore that contains the list of
                                        trusted certificate authorities
System parameters
Enter a parameter in the sm.ini file    Defines the password to the Java
                                        keystore that contains the list of trusted
                                        CA certificates


1.2.24.1. Parameter:
appthreadspersession

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

appthreadspersession

Description

This parameter gives a site some control over the amount of server memory that a
user can consume by limiting the number of application tabs that can be opened
through the client. If a user performs an action that will result in opening a new
application tab that exceeds the limit (for example, the maximum number of tabs is set
at three and the user performs an action that would open a fourth tab), a message is
displayed letting the user know that the maximum number of application tabs has
been exceeded and the action is denied.

This parameter can also be used during load tests to prevent a common problem
where a script that's recorded never closes the application tab, and then results in
out-of-memory errors.

            Note

           A user can't open the last allowed tab by executing a command via the
          command line. For example, the appthreadspersession parameter is set to
           5, a user has four open tabs (including the first tab). The user tries to
           open the fifth tab by executing a command (for example, the db
           command) via the command line. In this scenario, the fifth tab can't be
           opened. However, the user can open the fifth tab from the System
           Navigator.

           This is a known limitation caused by the mechanism that calculates the
           number of open tabs.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?


No

Default value

0 (Unlimited number of application tabs.)

            Note

           If you are running in scripting mode, the default value is 5.

Possible values

No maximum is enforced.

Example usage

Command line: sm -appthreadspersession:3
Initialization file: appthreadspersession:3

Related topics

System parameters
Enter a parameter in the sm.ini file


1.2.24.2. Parameter:
asyncrefreshlbinterval

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

asyncrefreshlbinterval

Description

This parameter determines the interval (measured in seconds) at which the status of
the loadbalancer is refreshed.

Valid if set from

Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

10 seconds

Possible values

1-Any

Example usage

asyncrefreshlbinterval:25

Related topics

Servlet implementation
System parameters
Enter a parameter in the sm.ini file
Servlet parameters


1.2.24.3. Parameter: attachedByName

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

attachedByName

Description

This parameter specifies whether the operator name or the contact name is displayed
in the Attached By field from the attachment list in a record. By default, this
parameter is set to 0, and the operator name is used for the Attached By field. If you
want to use the contact name instead of the operator name for the Attached By field,
set this parameter to 1.

            Note

           This parameter takes effect in the web client only.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

0

Possible values

0 (Display the operator name in the Attached By field)
1 (Display the contact name in the Attached By field)

Example usage

Command line: sm -attachedByName:1
Initialization file: attachedByName:1


Related topics

System parameters
Enter a parameter in the sm.ini file
Debugging parameters


1.2.24.4. Parameter: checkdatetimevalue

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

checkdatetimevalue

Description

This parameter determines whether Service Manager validates the date fields, such
as the Planned Start and Planned End date fields.

     If the value of checkdatetimevalue is 1, the system checks the date/time value.
     The system doesn't allow time-only values and displays an error message (for
     example, the value is invalid ). Meanwhile, the system accepts date-only values
     and adds default time 00:00:00 to the date.

                   Note

                The date format is strictly followed. For example, if the date format is
                YYYY/MM/DD, the system doesn't accept either 18/04/24 or
                2018/04. In this case, the correct time value is 2018/04/24.

     If the value of checkdatetimevalue is 0, the system doesn't check the date/time
     value. Both date-only and time-only values are accepted.

Valid if set from

Initialization file (sm.ini)

Requires restart of the Service Manager server?

No. Re-login Service Manager after you update the parameter value.

Default value

0

Possible values

0 (The system doesn't check the date/time value)
1 (The system checks the date/time value)


Example usage

Initialization file: checkdatetimevalue:1

Related topics

System parameters
Enter a parameter in the sm.ini file


1.2.24.5. Parameter: disableXrs

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

disableXrs

Description

The Service Manager process creates a JVM and provides default option of -Xrs on
startup to reduce the signals to be handled by the JVM. However, you may want to
generate thread dumps for debugging purposes, and then you would want the JVM to
receive these signals. Use the -disableXrs parameter in sm.ini, so that the Service
Manager process will not provide this option to JVM.

Notes:

     This parameter is honored only in Windows environment for debugging
     purposes.
     If you use Remote Desktop and start a Service Manager process using
     disableXrs:1, and then close the session or log off, the Service Manager process
     will be shutdown.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

0

Possible values

0 = enable JVM option -Xrs

1 = disable JVM option –Xrs

Example usage

Command line: sm -httpPort:13080 -disableXrs:1


Initialization file: disableXrs:1

Related topics

System parameters
Enter a parameter in the sm.ini file
Debugging parameters


1.2.24.6. Parameter:
emailoutConfigFromSmisOnly

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

emailoutConfigFromSmisOnly

Description

The Emailout instance is available in SMIS integration from Service Manager 9.81.

The existing email out settings in sm.ini configured through Startup parameter:
emailout are still available.

If you choose to use SMIS to configure emailout settings, you need set
the emailoutConfigFromSmisOnly:1 server parameter. After this parameter is
enabled, the parameters defined in the emailout process through sm.cfg and sm.ini
won't work. Instead, those parameter values such as smtphost will only be get from
SMIS configuration.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes.

Once SMIS configurations are changed, you need to restart the whole SM Server
Cluster to apply the updates. Restarting SMIS instance only won't take effect.
Restarting one host will apply the new changes on this host only, while other hosts
won't get the updated values.

Default value

0

Possible values

0 (Use Startup parameter: emailout to configure emailout settings)

1 (Use SMIS to configure emailout settings)


Example usage

Command line: sm -emailout -emailoutConfigFromSmisOnly:1

Initialization file: emailoutConfigFromSmisOnly:1

Related topics

System parameters
Enter a parameter in sm.cfg or the server’s OS command prompt


1.2.24.7. Parameter: fetchnotnullsystemp

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

fetchnotnullsystemp

Description

Prior to version 9.31, records that have a non-NULL systemplate field were passed to
the query condition filter before they merged the template, and were thus incorrectly
filtered out. As of version 9.31, these records will merge the template record before
they are passed to the query condition filter. You need to set it to
fetchnotnullsystemp:1 to fully enable the template merge functionality. However, it
may cause performance issues if the table has more than 10K records whose
systemplate field is not NULL.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

0

Possible values

0 (Do not fully enable the template merge functionality)
1 (Fully enable the template merge functionality)

Example usage

Command line: sm -fetchnotnullsystemp:1

Initialization file: fetchnotnullsystemp:1

Related topics


System parameters
Enter a parameter in sm.cfg or the server’s OS command prompt


1.2.24.8. Parameter: GossipRouterhosts

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

GossipRouterhosts

Description

This parameter provides a list of available GossipRouters. Service Manager nodes
read this parameter to identify all GossipRouters (this behavior requires the addition
of command lines in the sm.cfg file).

Valid if set from

Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

None

Possible values

Any comma-delimited list of GossipRouters.

Example usage

GossipRouterhosts:HostA[12001],HostB[12001]

In this example, there are two GossipRouters (one on host A and one on host B), both
at port 12001.

Related topics

Servlet implementation
System parameters
Enter a parameter in the sm.ini file
Servlet parameters


1.2.24.9. Parameter: group

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

group

Description

This parameter is intended for horizontal scaled implementations where there are
multiple servers. This parameter allows the System Administrator to shut down or
quiesce all Service Manager server members of the horizontal scaled group.

Valid if set from

Server's operating system command prompt

Requires restart of the Service Manager server?

Yes

Default value

None

Possible values

None

Example usage

The System Administrator can run the following commands to shut down or quiesce
Service Manager server members in the horizontal scaled group.
Example: To shut down the default host (localhost) in the horizontal scaled group:
Command line: sm -shutdown
Example: To shut down a specific host (not the default host) in the horizontal scaled
group:
Command line: sm -shutdown -host:otherhost
Example: To shut down all hosts in the horizontal scaled group:
Command line: sm -shutdown -group


Example: To restrict Service Manager processes to administrators only on the local
host.

Command line: sm -quiesce:1

Example: To restrict Service Manager processes for all users in the entire cluster.

Command line: sm -quiesce:2 -group

Example: To bring the system back to running mode (unquiesce). All users can now
connect to the processes.

Command line: sm -quiesce:0 -group

Related topics

Servlet implementation
System parameters
Enter a parameter in the sm.ini file
Connection parameters
Servlet parameters
Startup parameter: quiesce


1.2.24.10. Parameter: groupbindaddress

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

groupbindaddress

Description

This parameter defines the TCP/IP address of the network adapter you want servlet
container processes to use to communicate with other processes in a virtual group.
You only need to define this parameter if the Service Manager host contains more
than one network adapter.
It is best practice to place this parameter in the Service Manager initialization file so
that all servlet container processes started on the same host share the TCP/IP
address specified by this parameter.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

None

Possible values

Any TCP/IP address

Example usage

Initialization file:

  groupbindaddress:10.0.0.124

Related topics


Servlet implementation
System parameters
Enter a parameter in the sm.ini file
Servlet parameters


1.2.24.11. Parameter: grouplicenseip

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

grouplicenseip

Description

Service Manager uses the AutoPass software to validate the license. This parameter
defines the TCP/IP address of the Service Manager host with a valid AutoPass license
for the virtual group. This parameter contains the TCP/IP address of the Service
Manager primary host, or a list of comma-seperated IP addresses of the primary and
backup hosts for license verification. When you request a license, AutoPass prompts
you for the IP address of the system where you are going to install the software. Use
this IP address as the value for the grouplicenseip parameter. During startup, Service
Manager needs the grouplicenseip parameter for the following conditions:

     You are running Service Manager on a system with multiple Network Interface
     Cards (NICs) and multiple IP addresses.
     You are running Service Manager in a horizontally-scaled system and the
     primary host has multiple NICs and multiple IP addresses.
     You are running Service Manager in a horizontally-scaled system and you are
     configuring the sm.ini file on a secondary host.

It is best practice to place this parameter in the Service Manager initialization (sm.ini)
file, so that all servlet container processes started on the same host share the TCP/IP
address specified by this parameter.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

None

Possible values


Any TCP/IP address

Example usage

Example 1: Initialization file:

  grouplicenseip:10.0.0.135

Example 2: Initialization file:

  grouplicenseip:10.0.0.135,10.0.0.137,10.0.0.139

Related topics

Horizontal scaling implementation
System parameters
Enter a parameter in the sm.ini file
Servlet parameters
````
