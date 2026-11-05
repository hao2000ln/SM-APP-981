---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.2.13.86 .. 1.2.13.94
printed_pages: 458-476
---

# 1.2.13.86 Web parameter: useJavaDynamicVersioning

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.13.86. Web parameter:
useJavaDynamicVersioning

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

useJavaDynamicVersioning

Description

Enables use of the system registry to locate the latest version of Java installed on a
user's system.

Valid if set from

Web tier configuration file (web.xml and webtier.properties)

Requires restart of the web applications server?

Yes

Default value

false

Possible values

true (Enabled)
false (Disabled)

Example usage

  <context-param>
      <param-name>useJavaDynamicVersioning</param-name>
      <param-value>true</param-value>

  </context-param>

Related topics

System parameters
Web tier parameters
Enter a parameter in the web client URL


Enter a parameter in the web.xml file
Client parameters for web clients


1.2.13.87. Web parameter: useServertabs

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

useservertabs

Description

This parameter causes web clients to display tabs in the order that the server has
them saved on the form. By default, this parameter is disabled, and web clients
display tabs from right to left and top to bottom.

Valid if set from

Web browser URL
Web tier configuration file (web.xml and webtier.properties)

Requires restart of the web applications server?

Yes

Default value

false

Possible values

false
true

Example usage

  <init-param>
      <param-name>useservertabs</param-name>
      <param-value>false</param-value>

  </init-param>

Related topics

System parameters
Web tier parameters


Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Client parameters for web clients


1.2.13.88. Web parameter:
viewactivenotes

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

viewactivenotes

Description

Enabling this parameter causes web clients to display messages in a message box as
well as in the status bar. Enabling this parameter from the web tier configuration file
forces all web clients to display messages. Enabling this parameter from the web
browser URL only displays messages on that particular web client.

Valid if set from

Web browser URL
Web tier configuration file (web.xml and webtier.properties)

Requires restart of the web applications server?

Yes

Default value

false

Possible values

true (Enabled)
false (Disabled)

Example usage

  <init-param>
      <param-name>viewactivenotes</param-name>
      <param-value>true</param-value>

  </init-param>

Related topics


System parameters
Web tier parameters
Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Client parameters for web clients


1.2.13.89. Web parameter:
viewcontexthelp

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

viewcontexthelp

Description

This parameter enables the web client to display the same context-sensitive help
debug information (field) in field help as the Windows client. To enable this feature,
append viewcontexthelp=true to the web client URL for current user or set it in the
web tier configuration files (web.xml or webtier.properties) for all users.

            Note

           This feature is only supported for the Power User mode (index.do).

Valid if set from

Web browser URL
Web tier configuration file (web.xml and webtier.properties)

            Note

           When this parameter is defined using all of the three methods, the one set
           from web browser URL takes the highest precedence. However, if set
           from web browser, this parameter is valid only when set at login, and once
           set at login it remains valid until you log out or the session times out.

Requires restart of the web applications server?

No if set from the login URL (only requires a re-login)
Yes if set from the web tier configuration file

Default value

false


Possible values

true or false

Example usage

http://<your web tier host>:<port>/<web tier>index.do?viewcontexthelp=true

Related topics

System parameters
Web tier parameters
Client parameters for web clients


1.2.13.90. Web parameter:
viewpromptforsave

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

viewpromptforsave

Description

Enabling this parameter causes web clients to display a warning message when users
cancel records with unsaved changes. Enabling this parameter from the web tier
configuration file forces all web clients to display the save warning message. Enabling
the this parameter from the web browser URL only displays the save warning
message on that particular web client.

Valid if set from

Web browser URL
Web tier configuration file (web.xml and webtier.properties)

Requires restart of the web applications server?

Yes

Default value

true

Possible values

true (Enabled)
false (Disabled)

Example usage

  <init-param>
      <param-name>viewpromptforsave</param-name>
      <param-value>false</param-value>

  </init-param>


Related topics

System parameters
Web tier parameters
Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Client parameters for web clients


1.2.13.91. Web parameter: viewrecordlist

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

viewrecordlist

Description

Enabling this parameter causes web clients to display the record list/detail view for
search results. Enabling this parameter from the web tier configuration file forces all
web clients to display the record list/detail view. Enabling the this parameter from the
web browser URL only displays the record list/detail view on that particular web
client.

Valid if set from

Web browser URL
Web tier configuration file (web.xml and webtier.properties)

Requires restart of the web applications server?

Yes

Default value

true

Possible values

true (Enabled)
false (Disabled)

Example usage

  <init-param>
      <param-name>viewrecordlist</param-name>
      <param-value>false</param-value>

  </init-param>

Related topics


System parameters
Web tier parameters
Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Client parameters for web clients


1.2.13.92. Web parameter:
virtualGroupSize

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

virtualGroupSize

Description

In inbox views, records are divided into virtual groups if there are too many records in
a group. This parameter defines the number of records that are displayed as one
virtual group in inbox views.

            Note

                You can set the value from 25 to 500. In addition, make sure that this
                group size is not greater than the value of the sqlfetchs parameter if
                you have specified one.
                The virtual group size set in the system information record takes
                precedence over this parameter.
                Make sure that you do performance testing before you set a big
                number in your production environment.

Valid if set from

Web tier configuration file (webtier.properties)

Requires restart of the web application server?

Yes

Default value

100

Possible values

25 to 500

Example usage


  virtualGroupSize=200

Related topics

System parameters
Web tier parameters
Enter a parameter in the web client URL
Enter a parameter in the web.xml file


1.2.13.93. Web parameter: webtierFullUrl

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

webtierFullUrl

Description

This parameter describes the full URL used to access the web tier. For example,
https://smwebtier.yourdomain.net/webtier-9.x .
Suppose you have deployed the web tier behind a reverse proxy or a load balancer
and used the form - based authentication. In this case, you must set this property if
the reverse proxy or the load balancer doesn't pass the appropriate X-Forwarded-*
HTTP headers to the web tier.
Note: The webtierFullUrl parameter takes precedence over the X-Forwarded-*
headers. If you choose to use the X-Forwarded-* headers, don't configure this
parameter.

Valid if set from

Web tier configuration file ( webtier.properties )

Requires restart of the web applications server?

Yes

Default value

N/A

Possible values

Full URL of the web tier

Example usage

  webtierFullUrl=https://smwebtier.yourdomain.net/webtier-9.x

Related topics


System parameters
Web tier parameters
Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Client parameters for web clients


1.2.13.94. Web parameter:
xff.trusted.proxies

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

xff.trusted.proxies

Description

You can add your trusted proxy IPs (separated by comma) in the xff.trusted.proxies
parameter.
If the value in xff.trusted.proxies is not empty and the X-Forwarded-For header in the
request is not empty, the X-Forwarded-For header will be searched to find the original
end user IP, removing the matched trusted proxies. Then, the system can store the
original end user IP instead of the proxy IP in the syslog table when you use proxies
or have a load balancer environment.
F​ or example, with the following configuration, the value "192.168.2.2, 192.168.0.10" in
the X-Forwarded-For header returns the end user IP as "192.168.2.2".
xff.trusted.proxies=192.168.3.3,192.168.0.10

Valid if set from

Web tier configuration file (webtier.properties)

Requires restart of the web applications server?

Yes

Default value

Empty

Possible values

IP addresses (separated by comma)

Example usage

  xff.trusted.proxies=192.168.3.3,192.168.0.10


Related topics

System parameters
Web tier parameters
Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Client parameters for web clients
````
