---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.2.14 .. 1.2.14
printed_pages: 476-490
---

# 1.2.14 Client parameters for Windows clients

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.14. Client parameters for Windows
clients

These parameters override Windows client preferences. Any client parameter that
you set on the server overrides the local client preference and prevents users from
changing it. You can set these parameters from the Service Manager server's
operating system command prompt or from the Service Manager initialization file
(sm.ini).


Startup parameter                       Description

Startup parameter: chartrefresh         Specifies the length of time that
                                        Service Manager waits between
                                        refreshing charts

Startup parameter: clientformcache      Enables Windows clients to cache
                                        forms

Startup parameter: clientsideunload     Enables client-side unloading of
                                        Service Manager files

Parameter:                              Removes the Print and Print Preview
servicemanager.disableclientprinting    menu items from the menu in Windows
                                        client

Parameter: heartbeatinterval            Controls the client heartbeat frequency

Startup parameter: sessiontimeout       Defines the number of minutes that the
                                        server waits for a client heartbeat
                                        signal before the server assumes that
                                        the client session has timed out and
                                        closes the connection

Startup parameter: useservertabs        Causes Service Manager clients to
                                        display tabs in the order the server has
                                        them saved on the form

Startup parameter: viewactivenotes      Causes Service Manager clients to
                                        display server messages in the
                                        Messages view

Startup parameter: viewpromptforsave    Causes Service Manager clients to
                                        prompt the user to save changes when
                                        they close forms

Startup parameter: viewrecordlist       Causes Service Manager clients to
                                        display the record list and record
                                        details simultaneously

Related topics


System parameters
Enter a parameter in the sm.ini file


1.2.14.1. Startup parameter: chartrefresh

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

chartrefresh

Description

This parameter specifies the interval Service Manager waits between refreshing
charts. More frequent intervals increase network traffic, less frequent intervals delay
the updated chart information. Windows client users can also set this parameter on
their local clients from Windows > Preferences.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

None

Possible values

Number of seconds

Example usage

Command line: sm -httpPort:13080 -chartrefresh:60

Initialization file: chartrefresh:60

Related topics

System parameters
Enter a parameter in the sm.ini file
Client parameters for Windows clients


1.2.14.2. Startup parameter:
clientformcache

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

clientformcache

Description

Enabling this parameter causes the Windows client to cache forms. Form caching
improves server responsiveness by reducing the need to load forms.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

1

Possible values

0 (Disable)
1 (Enable)

Example usage

Command line: sm -httpPort:13080 -clientformcache:1
Initialization file: clientformcache:1

Related topics

System parameters
Enter a parameter in the sm.ini file
Client parameters for Windows clients


1.2.14.3. Startup parameter:
clientsideunload

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter====

clientsideunload

Description

Enabling this parameter allows client-side unloading of Service Manager files.
Windows client users can also set this parameter on their local clients from
Windows > Preferences.

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

Command line: sm -httpPort:13080 -clientsideunload:1

Initialization file: clientsideunload:1

Related topics

System parameters
Enter a parameter in the sm.ini file
Client parameters for Windows clients


1.2.14.4. Parameter: disableclientprinting

This parameter overrides Windows client preferences. Any client parameter you set
on the server overrides the local client preference and prevents users from changing
it.

Parameter

servicemanager.disableclientprinting

Description

Enabling this parameter removes the Print and Print Preview menu items.

Valid if set from

Client configuration file ({SM_HOME}\Client\configuration\config.ini)

Requires restart of server?

Yes

Default value

false

Possible values

     true (Disable client side printing)
     false (Enable client side printing)

Example usage

Client configuration file: servicemanager.disableclientprinting:true

Related topics

Setting Windows client preferences from the server
Client parameters for Windows clients


1.2.14.5. Startup Parameter:
heartbeatinterval

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

heartbeatinterval

Description

This parameter controls the client heartbeat frequency. If the server doesn't receive a
heartbeat from the client within the time-out limit as defined by the sessiontimeout
parameter, the server terminates the client. All unsaved data is lost and the client
must establish a new connection.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

15 seconds

Possible values

Number of seconds

Example usage

Command line: sm -httpPort:13080 -heartbeatinterval:60
Initialization file: heartbeatinterval:60

Related topics

System parameters
Enter a parameter in the sm.ini file
Client parameters for Windows clients


1.2.14.6. Startup Parameter:
sessiontimeout

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

sessiontimeout

Description

This parameter defines the number of minutes that the server waits for a client
heartbeat signal before the server assumes that the client session has timed out and
closes the connection.

The client sends a heartbeat signal to the server every 15 seconds or as defined by
the heartbeatinterval parameter.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

30

Possible values

Number of minutes

Example usage

Command line: sm -httpPort:13080 -sessiontimeout:30

Initialization file: sessiontimeout:30

Related topics

System parameters
Enter a parameter in the sm.ini file


Client parameters for Windows clients


1.2.14.7. Startup parameter: useservertabs

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

useservertabs

Description

Enabling this parameter causes Service Manager clients to display tabs in the order
the server has them saved on the form. By default, this parameter is disabled and
Service Manager clients display tabs from right to left and top to bottom. Windows
client users can also set this parameter on their local clients from Windows >
Preferences.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

false

Possible values

true (Enabled)
false (Disabled)

Example usage

Command line: sm -httpPort:13080 -useservertabs:1

Initialization file: useservertabs:1

Related topics

System parameters
Enter a parameter in the sm.ini file
Client parameters for Windows clients


1.2.14.8. Startup parameter:
viewactivenotes

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

viewactivenotes

Description

Enabling this parameter causes Service Manager clients to display server messages
in the Messages view. Windows client users can also set this parameter on their local
clients from Windows > Preferences.

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

Command line: sm -httpPort:13080 viewactivenotes:1

Initialization file: viewactivenotes:1

Related topics

System parameters
Enter a parameter in the sm.ini file
Client parameters for Windows clients


1.2.14.9. Startup parameter:
viewpromptforsave

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

viewpromptforsave

Description

Enabling this parameter causes Service Manager clients to prompt the user to save
changes when they close forms. Windows client users can also set this parameter on
their local clients from Windows > Preferences.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

1

Possible values

0 (Disable)

1 (Enable)

Example usage

Command line: sm -httpPort:13080 -viewpromptforsave:1

Initialization file: viewpromptforsave:1

Related topics

System parameters
Enter a parameter in the sm.ini file
Client parameters for Windows clients


1.2.14.10. Startup parameter:
viewrecordlist

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

viewrecordlist

Description

Enabling this parameter causes Service Manager clients to display the record list and
record details simultaneously. Windows client users can also set this parameter on
their local clients from Windows > Preferences.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

1

Possible values

0 (Disable)

1 (Enable)

Example usage

Command line: sm -httpPort:13080 -viewrecordlist:1

Initialization file: viewrecordlist:1

Related topics

System parameters
Enter a parameter in the sm.ini file
Client parameters for Windows clients
````
