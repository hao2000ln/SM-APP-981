---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.2.13.19 .. 1.2.13.31
printed_pages: 328-354
---

# 1.2.13.19 Web parameter: cookie.httpOnly

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.13.19. Web parameter: cookie.httpOnly

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

cookie.httpOnly

Description

This parameter determines whether to set the HttpOnly flag for HTTP cookies (such
as JSESSIONID, mode, and lang). We strongly recommend you to set the HttpOnly
flag for cookies.
Notes:

     For the LWSSO_COOKIE_KEY cookie, you need to set the HttpOnly flag in the
     lwssofmconf.xml file.
     For the JSESSIONID cookie in WebSphere, you need to set the HttpOnly flag in
     the WebSphere admin console.

Valid if set from

Web tier configuration file (webtier.properties)

Requires restart of the web applications server?

Yes

Default value

true

Possible values

true (Enabled)
false (Disabled)

Example usage

  cookie.httpOnly=true

Related topics


System parameters
Web tier parameters
Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Client parameters for web clients


1.2.13.20. Web parameter: cookie.secure

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

cookie.secure

Description

This parameter determines whether to set the Secure flag for HTTP cookies (such as
JSESSIONID, mode, and lang). We recommend you to set the Secure flag for cookies
if the users access the web tier by using the HTTPS protocol.
Notes:

     For the LWSSO_COOKIE_KEY cookie, you need to set the Secure flag in the
     lwssofmconf.xml file.
     For the JSESSIONID cookie in WebSphere, you need to set the Secure flag in the
     WebSphere admin console.

Valid if set from

Web tier configuration file (webtier.properties)

Requires restart of the web applications server?

Yes

Default value

false

Possible values

true (Enabled)
false (Disabled)

Example usage

  cookie.secure=false

Related topics


System parameters
Web tier parameters
Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Client parameters for web clients


1.2.13.21. Web parameter: customize-
folder

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

customize-folder

Description

This parameter specifies the absolute path to a folder in which your web client
branding files and web client custom webtier.properties file are stored. You must have
write access to this directory to rebrand the web client or configure the web client
custom webtier.properties file.
You need to place your branding image files in this folder. When you perform
branding in the branding interface, Service Manager saves your branding settings in a
branding.xml file and in a branding-images subfolder under this folder.
You can configure the customize-folder parameter by using either of the following:

     The default web.xml located in the <web tier>/WEB-INF folder
     The JVM option -Dhpe.sm.customizefolder in the application server

            Note

           The customize-folder parameter configured in the web.xml file has higher
           precedence.

            Caution

           This parameter is required to enable the branding interface. If it's not
           specified, when you click Tailoring > Branding, the branding interface is
           not launched and an error message is displayed instead.

Valid if set from

Web tier configuration file (web.xml)
JVM option -Dhpe.sm.customizefolder


Requires restart of the web applications server?

Yes

Default value

Empty

Possible values

An absolute directory

Example usage

Configure from web.xml:

  <context-param>

      <param-name>customize-folder</param-name>

      <param-value>C:/customize</param-value>

  </context-param>

Configure from JVM option:

Add -Dhpe.sm.customizefolder=C:/customize to the java options of the Tomcat
configuration.

Related topics

System parameters
Web tier parameters
Encryption of client keystore passwords
Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Client parameters for web clients


1.2.13.22. Web parameter:
detailViewMinWidth

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

detailViewMinWidth

Description

This parameter increases the min-width value of a web page if the system displays
some texts incompletely after you enlarge the browser text size or font size.

            Note

                Due to this min-width configuration, you may get the horizontal
                scroll bar in the detail view even if it is unnecessary.
                This parameter has no effect on the record list view and the pop-up
                view.

Valid if set from

The URL of the Service Manager web client accessible view
Requires restart of the Service Manager server?
No

Default value

None

Possible values

Any integer between 40 and 90

Example usage

When accessing the accessible view of the Service Manager web client, use the
following URL to set the min-width to 72em.
http://<servername>:<portnumber>/sm/accessible.do?detailViewMinWidth=72
The new value takes effect immediately after the page is reloaded.


Related topics

System parameters
Web tier parameters
Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Enter a parameter in the webtier.properties files
Client parameters for web clients


1.2.13.23. Web parameter:
disableJumpAddress

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

disableJumpAddress

Description

This parameter controls whether the Quick Jump component is displayed. The Quick
Jump component enables you to navigate to a group section quickly.

Valid if set from

Web tier configuration file (web.xml)

Requires restart of the web applications server?

Refer to your web server documentation

Default value

false

Possible values

true
false

Example usage

  <context-param>
      <param-name>disableJumpAddress</param-name>
      <param-value>false</param-value>

  </context-param>

Related topics

System parameters
Web tier parameters
Enter a parameter in the web client URL


Enter a parameter in the web.xml file
Client parameters for web clients
SSL parameters


1.2.13.24. Web parameter: disableKeyHelp

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

disableKeyHelp

Description

By default, Service Manager displays contextual help for each field on a form. This
parameter allows you to disable the contextual help.

Valid if set from

Web tier configuration file (web.xml and webtier.properties)

Requires restart of the web applications server?

Yes

Default value

false

Possible values

true (Disabled)
false (Enabled)

Example usage

  <context-param>
      <param-name>disableKeyHelp</param-name>
      <param-value>true</param-value>

  </context-param>

Related topics

System parameters
Web tier parameters
Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Client parameters for web clients



1.2.13.25. Web parameter:
disableLoginAutoComplete

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

disableLoginAutoComplete

Description

This parameter allows administrators to enable password auto-complete for the SM
web client login page.

By default, this parameter is set to true, which prevents the browser from saving the
user's Service Manager login password. Therefore, even if password auto-complete
is enabled in the browser, password auto-complete is disabled for the web client login
page.

When this parameter is set to false, as long as password auto-complete is enabled in
the browser, the browser will save the user's login password and automatically
complete it at login.

            Caution

           Be aware that setting this parameter to false may increase the risk of
           allowing unauthorized access to Service Manager through the exploitation
           of stored passwords.


            Note

           Due to a known issue in web browsers, if a user has already enabled
           password auto-complete and saved the password in the web browser
           before an administrator changes this parameter to true, the user needs to
           manually remove the saved password; otherwise the password will still be
           auto-completed even if this parameter is set to true.
           For example, to remove a saved password in Firefox, do the following:

              1. Click Tools > Options > Security, and click the Saved Password
                button.

              2. Select the password, and then click Remove. Note that clicking the
                Remove All button will remove all saved passwords for all accessed
                web sites.

Valid if set from

Web tier configuration file (web.xml and webtier.properties)

Requires restart of the web applications server?

Yes

Default value

true

Possible values

true: Disable password auto-complete
false: Enable password auto-complete

Example usage

  <context-param>
      <param-name>disableLoginAutoComplete</param-name>
      <param-value>true</param-value>

  </context-param>

Related topics

System parameters
Web tier parameters


Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Client parameters for web clients


1.2.13.26. Web parameter:
enableExitConfirmMessage

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

enableExitConfirmMessage

Description

If this parameter is enabled (set to "true"), when the user clicks the Close ("x") button
of the Service Manager web client page or manually refreshes the entire web client
page, a confirmation message is displayed that indicates the user might have unsaved
data. The message asks the user to confirm whether to stay on the current page or
leave the page.

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
      <param-name>enableExitConfirmMessage</param-name>
      <param-value>true</param-value>

  </context-param>

Related topics


System parameters
Web tier parameters
Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Client parameters for web clients


1.2.13.27. Web parameter:
enableGetOriginalUrl

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

enableGetOriginalUrl

Description

When this parameter is enabled, the webtier obtains the original URL from the
browser before a user logs in (in TSO or LWSSO mode).
This enables backend servers to identify and use the original URL when a firewall,
proxy, or redirect has altered it. For example, when a client connects to the web tier
through a hardware load balancer.

Valid if set from

Web tier configuration file (web.xml and webtier.properties)

Requires restart of the web applications server?

Yes

Default value

False

Possible values

True, False

Example usage

  <init-param>
      <param-name>enableGetOriginalUrl</param-name>
      <param-value>True</param-value>

  </init-param>

Related topics


Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Client parameters for web clients


1.2.13.28. Web parameter:
enableListFrameStateRetain

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

enableListFrameStateRetain

Description

This parameter enables the list detail page to retain the expand-collapse state of the
List Pane when the list detail page refreshes. If you set this parameter to false, the List
Pane is always in expanded state once the list detail page refreshes.

            Note

           With enableListFrameStateRetain enabled, if you open a page
           ("destination page") from an existing page ("source page") and the two
           pages have the same file name (for example, ocmq ), the
           expand/collapse state of the list frame in the source page is not retained
           when you return to it.

Valid if set from

Web tier configuration file (web.xml and webtier.properties)

Requires restart of the web applications server?

Yes

Default value

false

Possible values

true (Retain the expand-collapse state of the List Pane)
false (Do not retain the expand-collapse state of the List Pane)

Example usage


  <context-param>
      <param-name>enableListFrameStateRetain</param-name>
      <param-value>false</param-value>

  </context-param>

Related topics

System parameters
Web tier parameters
Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Client parameters for web clients
SSL parameters


1.2.13.29. Web parameter:
enableMoreContextMenu

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

enableMoreContextMenu

Description

When this parameter is enabled, a contextual "More" menu is displayed when you
right-click lists on the details pane of a record in the web client.

            Note

           If you right-click in an area outside of a list or the details pane, the
           browser's contextual menu is displayed instead.

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
      <param-name>enableMoreContextMenu</param-name>
      <param-value>true</param-value>

  </context-param>


Related topics

System parameters
Web tier parameters
Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Client parameters for web clients
SSL parameters


1.2.13.30. Web parameter:
enableRecordlistOddEvenRowStyle

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

enableRecordlistOddEvenRowStyle

Description

This parameter determines if the odd and even rows in the record list have a different
background color.

Valid if set from

Web tier configuration file (web.xml and webtier.properties)

Requires restart of the web applications server?

Yes

Default value

false (odd and even rows in the record list have the same background color)

Possible values

true or false

Example usage

  <context-param>
      <param-name>enableRecordlistOddEvenRowStyle</param-name>
      <param-value>false</param-value>

  </context-param>

Related topics

Enter a parameter in the web.xml file
Web parameter: message display properties
Client parameters for web clients


1.2.13.31. Web parameter:
enableSidebarMenu

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

enableSidebarMenu

Description

This parameter specifies if the System Navigator of the web client can use the
sidebar mode and icons.

The icons in the System Navigator require the 9.40 version of the Service Manager
application and Run-Time Environment (RTE). When you use an earlier version of the
Service Manager application or RTE, we recommend that you set the
Enablesidebarmenu parameter to false to disable the icons and the sidebar mode of
the System Navigator. Otherwise, the Service Manager web client uses the default
icon for all the menu items in the System Navigator.

Valid if set from

Web tier configuration file (web.xml and webtier.properties)

Requires restart of the web applications server?

Yes

Default value

true

Possible values

true (Enabled)

false (Disabled)

Example usage


  <context-param>

      <param-name>enableSidebarMenu</param-name>

      <param-value>true</param-value>

  </context-param>

Related topics

System parameters
Web tier parameters
Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Client parameters for web clients
````
