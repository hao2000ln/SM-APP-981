---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.2.15.26 .. 1.2.15.35
printed_pages: 542-557
---

# 1.2.15.26 Startup parameter: system

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.15.26. Startup parameter: system

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

system

Description

This parameter defines a numerical identifier for the Service Manager system that
becomes part of the unique identifer in a horizontal scaling implementation. This
parameter is typically set to the communications port that the Service Manager server
uses. You can set this parameter from the Configure server utility.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Configure server utility

Requires restart of the Service Manager server?

Yes

Default value

12670

Possible values

Port number

Example usage

Command line: sm -httpPort:13080 -system:13080
Initialization file: system:13080

Related topics

System parameters
Enter a parameter in the sm.ini file
Connection parameters


1.2.15.27. Parameter: threadTerminateWait

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

threadTerminateWait

Description

This parameter defines the length of time (in seconds) the Service Manager server
continues to handle a client request after the client session is closed (for example, the
client session is manually disconnected or is timed out). When the specified time is
reached, the server terminates the server thread that handles the client request.

If you specify a value of 0 (zero), the server immediately terminates the server thread
when the client session is closed (which is the same behavior as in versions 9.32
through 9.33).

This parameter gives the server an extra period of time to continue handling requests
to help prevent "Session already invalidated" errors from occurring. It works on
requests from all clients: Windows, web, and web services.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

No (Only requires a client re-login)

Default value

3 (seconds)

Possible values

Number of seconds no less than zero

Example usage

Command line: threadTerminateWait:24

Initialization file: threadTerminateWait:24


Rlated topics

System parameters
Enter a parameter in the sm.ini file
Connection parameters


1.2.15.28. Parameter: updatelicense

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

updatelicense

Description

This command automatically loads a new AutoPass license file into the existing one,
which is specified in the AutoPass licensing.

            Note

           The new license file must be in .txt format.

Valid if set from

Server's operating system command prompt

Requires restart of the Service Manager server?

Yes

Default value

None

Possible values

Path and file name of an AutoPass license file.
In the command line usage, if there is a space in the path name, you need to enclose
path names in quotation marks.

Example usage

Command line: sm -updatelicense:"c:/CommonFiles/NewLicFile.txt"

Related topics

System parameters
Parameter: licensefile


1.2.15.29. Parameter: useHostinWSDL

Parameter

useHostinWSDL

Description

When this parameter is enabled, the Service Manager server replaces the host name
in the schema location in the webservice response with the host name in the web
service request URL.

This parameter is required for web service requests when multiple HWLBs are located
before the Service Manager RTE.

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

Initialization file: useHostinWSDL

Command line: sm -useHostinWSDL

Related topics

System parameters
Web tier parameters
Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Client parameters for web clients
SSL parameters


1.2.15.30. Parameter: useIPinWSDL

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

useIPinWSDL

Description

Web Service Description Language (WSDL) is used to connect to external
applications, such as Asset Manager. By default, Service Manager builds a WSDL
endpoint location URL with a fully qualified domain name (host name). If the web
services client application can't reach the Service Manager server with the host
name, you can specify the useIPinWSDL parameter in the sm.ini file. Service Manager
then automatically gets the IP address from the local host, and uses that IP address
instead of the host domain name in the WSDL endpoint location URL.

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

Initialization file: useIPinWSDL:1

Related topics

System parameters
Enter a parameter in the sm.ini file
Connection parameters



1.2.15.31. Parameter: ws_endpoint

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

ws_endpoint

Description

This parameter specifies the web services end point. This parameter overwrites
useIPInWSDL and preferredFQHN.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

None

Possible values

https://<lbhost>:<lbport>
or
http://<lbhost>:<lbport>
For example, https://<FQDN of the HWLB virtual server>:<Port of HWLB virtual
server>/SM/7/ws/ChangeManagement.wsdl. In this example, the ws_endpoint
parameter refers to the boldface part.

Example usage

Command line: sm -ws_endpoint:https://mysite.com:13080
Initialization file: ws_endpoint:https://mysite.com:13080

Related topics


System parameters
Enter a parameter in sm.cfg or the server’s OS command prompt
Parameter: preferredFQHN
Connection parameters


1.2.15.32. Startup parameter:
webservices_sessiontimeout

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

webservices_sessiontimeout

Description

This parameter defines the number of seconds that the server waits for a WebService
API client request before the server assumes that the client session has timed out and
closes the connection. If a Service Manager connection is kept alive, a value that's 30
seconds shorter than the value of the connectionTimeout parameter is automatically
applied for the timeout limit of the web service session. Otherwise, the value set in
the webservices_sessiontimeout parameter is applied.

            Note

           If a Service Manager connection is kept alive, the minimum timeout limit
           (15 seconds) is then applied for the web service session when the timeout
           limit for the Service Manager connection is less than 45 seconds.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

1800

Possible values

For example, 3600

Example usage

Command line: sm -httpPort:13080 -webservices_sessiontimeout:1800


Initialization file: webservices_sessiontimeout:1800

Related topics

System parameters
Enter a parameter in the sm.ini file
Client parameters for Windows clients
Startup parameter: connectionTimeout


1.2.15.33. Startup parameter:
checkExtaccess

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

checkExtaccess

Description

This parameter enables field checking so that only the fields defined in the extaccess
record can be used in SOAP requests.

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

Command line: sm -checkExtaccess:1
Initialization file: checkExtaccess:1

Related topics

System parameters
Enter a parameter in the sm.ini file


1.2.15.34. Startup parameter:
connectionTimeout

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

connectionTimeout

Description

This parameter defines the number of milliseconds that the server waits for a Service
Manager client request before the server assumes that the client connection has
timed out and closes the connection.

            Note

                The timeout limit for the connectionTimeout parameter should be
                longer than that for the webservices_sessiontimeout parameter.
                Otherwise, the client session could not be reused. It is
                recommended that you set the value of the connectionTimeout
                parameter no less than 60000 milliseconds.
                A value that's 30 seconds shorter than the value of the
                connectionTimeout parameter is automatically applied for the
                timeout limit of a web service if the Service Manager connection is
                kept alive.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

60000

Possible values

At least 45000


Example usage

Command line: sm -httpPort:13080 -connectionTimeout:80000
Initialization file: connectionTimeout:80000

Related topics

System parameters
Enter a parameter in the sm.ini file
Client parameters for Windows clients
Startup parameter: webservices_sessiontimeout


1.2.15.35. Parameter: smartemailTimeout

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

smartemailTimeout

Description

This parameter defines the number of milliseconds that the Smart Email process waits
for a connection to the mail server to be established. When the defined timeout value
is reached, the Smart Email process stops trying to connect to the mail server until the
next time when the Service Manager Smart Email scheduler starts again.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

45000

Possible values

Number of milliseconds

Example usage

Command line: sm -smartemailTimeout:30000

Initialization file: smartemailTimeout:30000

Related topics

System parameters
Enter a parameter in the sm.ini file
Client parameters for Windows clients
Startup parameter: webservices_sessiontimeout
````
