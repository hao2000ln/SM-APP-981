---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.2.13.72 .. 1.2.13.85
printed_pages: 432-458
---

# 1.2.13.72 Web parameter: showHelp

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.13.72. Web parameter: showHelp

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

showHelp

Description

If you enable this parameter, the web client displays the Online Help option when you
click the Help button. You can click the Online Help option to open the Help Server
that you define in the helpServerHost and helpServerPort parameters. Web client
users can't access your Help Server unless you enable this parameter and also define
the help server host, port number, and context path.

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
      <param-name>showHelp</param-name>
      <param-value>true</param-value>

  </context-param>

Related topics

Web parameter: helpServerHost
Web parameter: helpServerPort


Web parameter: helpServerContext


1.2.13.73. Web parameter: showNavIcon

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

showNavIcon

Description

If this parameter is set to true, each System Navigator menu item will display an icon
that indicates the type of menu item. If the parameter is set to false or not present, the
navigator menu items don't display icons.

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
      <param-name>showNavIcon</param-name>
      <param-value>false</param-value>

  </context-param>

Related topics

System parameters
Web tier parameters
Enter a parameter in the web client URL


Enter a parameter in the web.xml file
Client parameters for web clients


1.2.13.74. Web parameter:
showReloadNavButton

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


1.2.13.75. Web parameter:
sideBarButtonNumberToCollapse

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

sideBarButtonNumberToCollapse

Description

This parameter defines the number of side bar buttons to be collapsed. If the number
of side bar buttons is bigger than or equal to this value, these buttons will be
collapsed.

Valid if set from

Web tier configuration file (web.xml and webtier.properties)

Requires restart of the web application server?

Yes

Default value

4

Possible values

1 to 100

            Note

           If you specify an invalid value, the default value is used.

Example usage

  <context-param>
      <param-name>sideBarButtonNumberToCollapse</param-name>
      <param-value>4</param-value>

  </context-param>

Related topics


System parameters
Web tier parameters
Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Client parameters for web clients
Web parameter: comfillAutoComplete
Web parameter: autoCompleteDelayTime
Web parameter: autoCompleteMinChars


1.2.13.76. Web parameter:
socketReadTimeout

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

socketReadTimeout

Description

The socketReadTimeout parameter prevents a thread on the web tier application
server from waiting infinitely for a socket IO operation. After the specified time is
reached, the socket read operation will terminate.

Valid if set from

Web tier configuration file (web.xml and webtier.properties)

Requires restart of the web applications server?

Yes

Default value

180 seconds

Possible values

Any value is valid. A value of less than or equal to 0 will indicate no time out.

Example usage

  <init-param>
      <param-name>socketReadTimeout</param-name>
      <param-value>180</param-value>

  </init-param>

Related topics

System parameters
Web tier parameters
Enter a parameter in the web client URL
Enter a parameter in the web.xml file


Client parameters for web clients
SSL parameters


1.2.13.77. Web parameter: sortNavItems

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

sortNavItems

Description

This parameter sets the sort order System Navigator menu items. By default, this
parameter is set to true, which means the System Navigator menu items are sorted in
ascending, alphabetical order. When this parameter is set to false, the menu items
display in the order they arrive from the server. If this parameter is deleted, System
Navigator menu items are sorted in ascending, alphabetical order.

Valid if set from

Web tier configuration file (web.xml and webtier.properties)

Requires restart of the web applications server?

Yes

Default value

true

Possible values

true (enabled)
false (disabled)

Example usage

  <context-param>
      <param-name>sortNavItems</param-name>
      <param-value>true</param-value>

  </context-param>

Related topics

System parameters
Web tier parameters


Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Client parameters for web clients


1.2.13.78. Web parameter:
sortNavFavorites

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

sortNavFavorites

Description

This parameter sets the sort order of favorites. By default, this parameter is set to
false . Hence, the system displays the private favorites section on top of the public
favorites section. Within each section, the folders are on top of the views. The folders
and views are sorted in ascending alphabetical order, respectively.
When this parameter is set to true , all private and public favorites folders and views
are mixed together in ascending alphabetical order. If this parameter is deleted, the
system displays the favorites the same as you set this parameter to false .

Valid if set from

Web tier configuration file (web.xml)

Requires restart of the web applications server?

Yes

Default value

false

Possible values

true (enabled)
false (disabled)

Example usage

  <context-param>
      <param-name>sortNavFavorites</param-name>
      <param-value>true</param-value>

  </context-param>


Related topics

System parameters
Web tier parameters
Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Client parameters for web clients


1.2.13.79. Web parameter: ssl

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

ssl

Description

Enabling this parameter causes all web clients to use SSL connections to the web tier.
You must also install a Certificate Authority (CA) certificate file on the Web tier server
and define the cacerts web parameter to enable SSL connections.

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

  <init-param>
      <param-name>ssl</param-name>
      <param-value>true</param-value>

  </init-param>

Related topics

System parameters
Web tier parameters
Enter a parameter in the web client URL
Enter a parameter in the web.xml file


Client parameters for web clients
SSL parameters


1.2.13.80. Web parameter: sslPort

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

sslPort

Description

This parameter defines the SSL port of the web application server. It is required only
when the secureLogin parameter is set to true.

Valid if set from

Web tier configuration file (web.xml and webtier.properties)

Requires restart of the web applications server?

Yes

Default value

8443

Possible values

SSL port number of the web application server

Example usage

  <context-param>
      <param-name>sslPort</param-name>
      <param-value>8443</param-value>

  </context-param>

Related topics

System parameters
Web tier parameters
Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Client parameters for web clients
Web parameter: secureLogin


1.2.13.81. Web parameter:
sso.failure.httpStatus

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

sso.failure.httpStatus

Description

This parameter specifies the HTTP status code to be returned when TSO, LW-SSO,
IdM or CAC fails.

Valid if set from

Web tier configuration file (webtier.properties)

Requires restart of the web applications server?

Yes

Default value

403

Possible values

401
403

Example usage

  sso.failure.httpStatus=403

Related topics

System parameters
Web tier parameters
Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Client parameters for web clients


1.2.13.82. Web parameter:
startDayOfWeek

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

startDayOfWeek

Description

This parameter defines the first day of the week in the date picker. However, if you
configure the First Day of Week field in the Login Profiles for an operator, then this
parameter is not used for that user. For more information, see Set the first day of
week for an operator.

Valid if set from

Web tier configuration file (web.xml and webtier.properties)

Requires restart of the web applications server?

Yes

Default value

0

Possible values

0 (Sunday)
1 (Monday)
2 (Tuesday)
3 (Wednesday)
4 (Thursday)
5 (Friday)
6 (Saturday)

Example usage


  <context-param>

      <param-name>startDayOfWeek</param-name>

      <param-value>0</param-value>

  </context-param>

Related topics

System parameters
Web tier parameters
Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Client parameters for web clients


1.2.13.83. Web parameter: tooltipAutoHide

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

tooltipAutoHide

Description

This parameter controls whether to automatically hide a tooltip after the pointer
leaves the target element. Only the tooltip that is triggered by pointer hover and is not
controlled by the browser (that is, not the tooltip created through use of the HTML
title attribute) is controlled by this parameter.

By default, after you move the pointer out of a target element, the tooltip is not
dismissed if the pointer is moving toward the tooltip. The tooltip is dismissed if the
pointer is not moving toward the tooltip. After you move the pointer out of the tooltip,
the tooltip is dismissed.

If you set this parameter to false , the web client displays a close button (X) on the
top right corner of the tooltip. You can either manually click the close button or press
the ESC key to dismiss the tooltip if the keyboard focus is in the same iframe as the
target element of the tooltip.

Valid if set from

Web browser URL

Web tier configuration file (manually add this parameter into web.xml or
webtier.properties )

            Note

           When you define this parameter using all three methods, the one set from
           the web browser URL takes the highest precedence. However, if you set
           this parameter from the web browser URL, it takes effect immediately
           after reloading the page and requires no re-login.

Requires restart of the web applications server?

No if set from the browser URL

Yes if set from the web tier configuration file


Default value

true

Possible values

true or false

Example usage

  http://<your web tier host>:<port>/<web tier>index.do?

  tooltipAutoHide=true

Related topics

System parameters
Web tier parameters
Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Enter a parameter in the webtier.properties files
Client parameters for web clients


1.2.13.84. Web parameter: tracesoap

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

tracesoap

Description

This parameter defines whether to log SOAP traffic in the web tier. If you add the
tracesoap=true parameter to the web browser URL when you log in, all
request/response SOAP messages during the current session are logged until you log
out or the session expires.

The SOAP information is logged in the web tier. By default, it is logged in the sm.log
file located in the current working directory of the application server process. For
example, C:\Program Files\Apache Software Foundation\Tomcat 9.0\sm.log if the
Tomcat is run as a service. The SOAP message logging is defined in WEB-
INF / log4j2.properties as follows:

  logger.TraceSoap.level=debug

            Note

           By default, the logging level is DEBUG. It is recommended that you NOT
           change this setting. The root logger level setting in log4j.properties has
           no effect on the SOAP logging level. For example, no matter whether the
           root logger level is info , warn , or error , Service Manager always logs
           SOAP messages in the web tier.

SOAP messages are logged with a DEBUG prefix, as in the following examples:

  DEBUG http-8080-4 TraceSoap - request:
  DEBUG http-8080-4 TraceSoap - response:

Valid if set from

Web browser URL
Web tier configuration file (web.xml or webtier.properties)


            Note

           When this parameter is defined using all of the three methods, the one set
           from web browser URL takes the highest precedence. However, if set
           from web browser, this parameter is valid only when set at login, and once
           set at login it remains valid until you log out or the session times out.

Requires restart of the web applications server?

No if set from the login URL
Yes if set from the web tier configuration file

Default value

false

Possible values

true or false

Example usage

  http://localhost:8080/webtier/index.do?tracesoap=true

Related topics

System parameters
Web tier parameters
Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Enter a parameter in the webtier.properties files
Client parameters for web clients


1.2.13.85. Web parameter:
unmaskDeferMillis

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

unmaskDeferMillis

Description

Defer the unmasking of a browser window after an unmask request is issued. This
parameter relates to how much time the client browser needs to finish rendering after
a page is loaded. The client user may feel low application performance if set it to a
value greater than 2000. Additionally, this value should not be set to less than 550
milliseconds unless system performance is well characterized.

Valid if set from

Web tier configuration file (web.xml and webtier.properties)

Requires restart of the web applications server?

Yes

Default value

750 milliseconds

Possible values

350-3000 milliseconds

Example usage

  <context-param>
      <param-name>unmaskDeferMillis</param-name>
      <param-value>750</param-value>

  </context-param>

Related topics

System parameters
Web tier parameters


Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Client parameters for web clients
SSL parameters
````
