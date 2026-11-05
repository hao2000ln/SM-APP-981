---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.2.24.12 .. 1.2.24.25
printed_pages: 759-782
---

# 1.2.24.12 Parameter: groupsubnetaddress

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.24.12. Parameter:
groupsubnetaddress

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

groupsubnetaddress

Description

This parameter defines the subnet address of a Service Manager server node in a
horizontal scaling implementation. It is used to identify a cluster when the system
uses multiple network adapter cards.

Service Manager attempts to automatically compute the subnet address from the IP
address you provide in the groupbindaddress parameter and the subnet mask of any
currently running servlet container processes in the same group. However, if the
system can't automatically compute the subnet address, the server will fail to start
and fail to join the group. You can then use this parameter to provide the proper
subnet address.

            Caution

           Only provide the subnet address if one of your group members fails to
           start because the system could not automatically determine the proper
           subnet address.

            Note

           A subnet address is a computed value derived from a bitwise AND
           operation on the binary values of the IP address and the subnet mask.
           You can use an online calculator to compute this value if your network
           administrator can't provide it.

It is best practice to place this parameter in the Service Manager initialization file
rather than the command line.

Valid if set from

Server's operating system command prompt


Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

None

Possible values

A subnet address on the host system

Example usage

Initialization file:

  groupname:mygroup1
  groupbindaddress:192.168.1.2
  groupsubnetaddress:192.168.1.0
  groupport:13100

Related topics

Servlet implementation
System parameters
Enter a parameter in the sm.ini file
Connection parameters
Servlet parameters


1.2.24.13. Parameter: grouptcpbindport

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

grouptcpbindport

Description

This parameter specifies the bind port for each group member to communicate with
each other. By default, Service Manager tries to assign port 7800 for each member. If
this is impossible, it tries the next higher port (7801) and so on, until it finds an unused
port.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

7800

Possible values

None

Example usage

Initialization file:

  grouptcpbindport:7800

Related topics

Servlet implementation
System parameters
Enter a parameter in the sm.ini file
Servlet parameters


1.2.24.14. Parameter:
groupudpjointimeout

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

groupudpjointimeout

Description

This parameter determines the number of seconds within which a Service Manager
node successfully joins a Jgroups cluster before the operation times out when using
the UDP protocol.

Valid if set from

Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

2 (seconds)

Possible values

Number of seconds greater than 2

Example usage

groupudpjointimeout:3

Related topics

Servlet implementation
System parameters
Enter a parameter in the sm.ini file
Servlet parameters


1.2.24.15. Parameter: grouptcpjointimeout

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

grouptcpjointimeout

Description

This parameter determines the number of seconds within which a Service Manager
node must successfully join a Jgroup before the operation times out.

Valid if set from

Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

300 seconds

Possible values

1-Any

Example usage

grouptcpjointimeout:350

Related topics

Servlet implementation
System parameters
Enter a parameter in the sm.ini file
Servlet parameters


1.2.24.16. Parameter: grouptimeout

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

grouptimeout

Description

This parameter allows you to configure the timeout value (in milliseconds) for Jgroups
remote procedure calls. You can tune this value to keep the number of available
nodes stable.

It is recommended to set this parameter to a minimal value as long as it can keep the
number of the available nodes stable. Meanwhile, the network latency between the
web server and the Service Manager server should be small, otherwise the load
balancer may forward a request to a node that's not able to handle the request due to
network latency.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

5000 (milliseconds)

Possible values

Number of milliseconds from 300 to 10000

Example usage

Command line: sm -grouptimeout:1500

Initialization file: grouptimeout:1500

Related topics


System parameters
Enter a parameter in the sm.ini file
Servlet parameters


1.2.24.17. Parameter: idmsigningkey

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

idmsigningkey

Description

This parameter specifies a key that is used to sign Identity Manager (IdM) tokens
when SAML SSO is enabled for the Service Manager Server.

            Note

                This key must match the idm.encryptedSigningKey parameter value
                that you configure in the IdM service. For more information, see
                Install Identity Manager (IdM).
                When the Service Manager Server is started, this key is
                automatically encrypted. When you want to reset this key, remember
                to remove the asterisk (*) before the parameter name.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

None

Possible values

A text string

Example usage

Command line: sm -httpPort:13080 -idmsigningkey:1Qaz2wsx3edc
Initialization file: idmsigningkey:1Qaz2wsx3edc


Related topics

SAML Single Sign-On


1.2.24.18. Parameter: idmssoenabled

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

idmssoenabled

Description

This parameter determines whether Identity Manager (IdM) Single Sign-On is enabled
for the Service Manager Server. By default, IdM SSO is disabled. For more
information, see SAML-based Single Sign-On.

            Note

           If this parameter is set to 1, you need to additionally specify the
           idmsigningkey parameter.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

0

Possible values

0 (Disable)
1 (Enable)

Example usage

Command line: sm -httpPort:13080 -idmssoenabled:1
Initialization file: idmssoenabled:1

Related topics


SAML-based Single Sign-On


1.2.24.19. Parameter: jgroupstcp

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

jgroupstcp

Description

This parameter determines whether Service Manager Jgroups run on Transmission
Control Protocol (TCP) or on User Datagram Protocol (UDP) .

When the value of the parameter is set to 1, JGroups run on TCP. When the value is
set to 0, JGroups run on UDP.

Valid if set from

Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

0

Possible values

0 (UDP)

1 (TCP)

Example usage

jgroupstcp:1

Related topics

Servlet implementation
System parameters
Enter a parameter in the sm.ini file
Configure Jgroups to use TCP in a horizontally-scaled environment
Configure Jgroups to use TCP in a vertically-scaled environment
Servlet parameters


1.2.24.20. Parameter: JVMOption

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.
You can specify at most 48 JVM options.

Parameter

JVMOption

Description

This parameter specifies a JVM option.

Valid if set from

Server's operating system command prompt
Start up file (sm.cfg or smstart)

Requires restart of the Service Manager server?

Yes

Default value

JVM Option

Possible values

All JVM options

Example usage

Command line: SM -JVMOption0:-Xmx256M
Command line: SM -JVMOption1:-Djava.net.preferIPv4Stack=true
Initialization file: JVMOption0:-Xmx256M
Initialization file: JVMOption1:-Djava.net.preferIPv4Stack=true

Related topics

Servlet implementation
System parameters
Enter a parameter in the sm.ini file


Connection parameters
Servlet parameters


1.2.24.21. Parameter: keystoreFile

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

keystoreFile

Description

This parameter defines the path and file name to the Java keystore that contains the
certificate of the Service Manager server. Service Manager uses this keystore to
encrypt and decrypt messages sent to clients in servlet implementations. All servlet
implementation options require access to certificates stored in Java keystore formats.

Valid if set from

     Server's operating system command prompt
     Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

None

Possible values

Path and file name of the Java keystore containing the Service Manager server's
signed certificate

Example usage

Command line: sm -httpPort:13080 -httpsPort:13081 -keystoreFile:server.keystore
-keystorePass:changeit

Initialization file: keystoreFile:server.keystore

Related topics

System parameters
Enter a parameter in the sm.ini file
SSL parameters
Servlet parameters



1.2.24.22. Parameter: keystorePass

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

keystorePass

Description

This parameter defines the password to the Java keystore containing the certificate
of the Service Manager server. Service Manager uses this keystore to encrypt and
decrypt messages sent to clients in servlet implementations. All servlet
implementation options require access to certificates stored in Java keystore formats.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

None

Possible values

Password to the Java keystore containing the Service Manager server's signed
certificate

Example usage

Command line: sm -httpPort:13080 -httpsPort:13081 -keystoreFile:server.keystore
-keystorePass:changeit

Initialization file: keystorePass:changeit

Related topics

System parameters
Enter a parameter in the sm.ini file
SSL parameters
Servlet parameters



1.2.24.23. Parameter: logperprocess

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

logperprocess

Description

This parameter defines whether to create a log file for each vertical scaled Service
Manager process.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

0

Possible values

0 = all process will write to 1 log file
1 = Each process will write to its own log file

Example usage

Command line: sm –logperprocess:1
Initialization file: logperprocess:1

Related topics

System parameters
Enter a parameter in the sm.ini file
Servlet parameters


1.2.24.24. Parameter:
maxattachmentcount

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

maxattachmentcount

Description

This parameter specifies the maximum number of files that can be attached to an
individual record. If this limit is exceeded, the attachment upload process fails and the
following error is displayed in the user interface:

The total number of attachments in this record exceeds the maximum allowed number
for a single record.

The same error message is returned in the response if you attempt to add
attachments through a SOAP or RESTful call and the number of attachments exceeds
this limit.

            Note

           If an existing record has already more attachments than allowed by
          maxattachmentcount, the existing attachments are retained, but uploading
           of new attachments will fail.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

100

Possible values

0 to unlimited


Example usage

Command line: sm -httpPort:13080 -maxattachmentcount:100

Initialization file: maxattachmentcount:100

Related topics

System parameters
Web tier parameters
Setting file attachment limits
Web parameter: maxattachuploadsize
Web parameter: maxtotalattachuploadsize


1.2.24.25. Parameter: queryhashcode

Startup parameters change the behavior of the server.

Parameter

queryhashcode:hostname:port

Description

This parameter enables all Service Manager processes to consistently generate a
unique hash code, which can be accepted and properly decoded by the web tier. If
you provide the Fully Qualified Domain Name (FQDN) of a server host in the web.xml
file, you need to provide the same value in this parameter.
The value of this parameter should be the same on all your horizontally-scaled
systems.

            Note

           The value of this parameter is used only when the querysecurity
           parameter is enabled..

Valid if set from

Command line
Initialization file (sm.ini)

Requires restart of server?

All new connections will take the new value.
Sessions which are already running will continue to use the old value. In this case, we
recommend restarting the server.

Default value

None

Possible values

A valid Service Manager hostname and communication port

Example usage

If no FQDN is specified in the web.xml, the following example is valid:


No FQDN provided in web.xml:
<serverhost>hostname</serverhost>

<serverport>13080</serverport>
Enter the following in the Initialization (sm.ini) file:
queryhashcode:hostname:13080
When the FQDN of a server host is provided in the web.xml file, you need to provide
the same value in this parameter, as follows:
FQDN provided in web.xml:
<serverhost>hostname.com</serverhost>

<server port>13080</serverport>
Enter the following in the Initialization (sm.ini) file:
queryhashcode:hostname.com:13080

            Note

           You only need to provide one entry in the sm.ini file.

Related topics

System parameters
Enter a parameter in the sm.ini file
Servlet parameters
Parameter: querysecurity
````
