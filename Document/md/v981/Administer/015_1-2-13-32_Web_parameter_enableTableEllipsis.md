---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.2.13.32 .. 1.2.13.44
printed_pages: 354-380
---

# 1.2.13.32 Web parameter: enableTableEllipsis

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.13.32. Web parameter:
enableTableEllipsis

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

enableTableEllipsis

Description

For the following read-only controls in record details area, you can enable this
parameter to display '...' at the end of the text fields when the value is too long to be
shown completely:

     tables
     comfill with array
     combobox with array
     text fileds with array

Valid if set from

Web tier configuration file (web.xml and webtier.properties)

Requires restart of the web applications server?

Yes

Default value

false

Possible values

true, false

Example usage

  <context-param>
      <param-name>enableTableEllipsis</param-name>
      <param-value>true</param-value>

  </context-param>


Related topics

System parameters
Web tier parameters
Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Client parameters for web clients


1.2.13.33. Web parameter:
enableTableMagnify

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

enableTableMagnify

Description

This parameter specifies whether the Magnify button is visible for editable tables in
the web client. If this value is set to true, the Magnify button appears on the top-right
corner of editable tables in the web client. If this value is set to false, the Magnify
button doesn't appear in the web client.

Valid if set from

Web tier configuration file (web.xml and webtier.properties)

Requires restart of the web applications server?

Yes

Default value

true

Possible values

true, false

Example usage

  <init-param>
      <param-name>enableTableMagnify</param-name>
      <param-value>true</param-value>

  </init-param>

Related topics

System parameters
Web tier parameters
Enter a parameter in the web client URL


Enter a parameter in the web.xml file
Client parameters for web clients


1.2.13.34. Web parameter:
encryptPasswordInBrowser

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

encryptPasswordInBrowser

Description

This parameter determines whether to encrypt the user password in the web browser
before the system sends it to the web tier.

            Note

           This parameter has a limitation in the Chrome browser. The encryption
           leverages the WebCrypto API, whereas Chrome restricts the access to
           the WebCrypto API to secure origins (the https:// pages). This parameter
           takes effect in Chrome only if you access the Web client using the secure
           scheme (such as https://smwebtier.yourdomain.net/webtier/index.do ). If
           you access the Web client using a non - secure scheme (such as
           http://smwebtier.yourdomain.net/webtier/index.do ) in Chrome, the
           system still sends the password to the web tier as clear text.

Valid if set from

Web tier configuration file ( webtier.properties )

Requires restart of the web applications server?

Yes

Default value

false

Possible values

true (enabled)
false (disabled)


Example usage

  encryptPasswordInBrowser=true

Related topics

System parameters
Web tier parameters
Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Client parameters for web clients


1.2.13.35. Web parameter:
externalForgotPasswordUrl

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

externalForgotPasswordUrl

Description

This parameter defines an external forgot password URL for the Forgot Password link
on the Service Manager web client login page.
When the Service Manager server uses an authentication method other than
database authentication and it has the forgot password function, you can configure
this parameter to redirect the users to an external forgot password page.

Valid if set from

Web tier configuration file (webtier.properties)

Requires restart of the web applications server?

Yes

Default value

empty

Possible values

A valid URL

Example usage

  externalForgotPassword=https://ldap.yourdomain.net/forgotpasswor
  d

Related topics

System parameters
Web tier parameters
Enter a parameter in the web client URL


Enter a parameter in the web.xml file
Client parameters for web clients


1.2.13.36. Web parameter:
expandComnandLine

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

expandCommandLine

Description

This parameter specifies whether to expand the command/search line by default on
the top right area in the web client. If you set this parameter to true, the
command/search line is expanded by default when you log on to the web client, and
you don't need to click on the command/search line icon to expand it.

Valid if set from

Web tier configuration file (webtier.properties)

Requires restart of the web applications server?

Yes

Default value

false

Possible values

true (the command/search line is expanded by default)
false (the command/search line is not expanded by default)

Example usage

  expandCommandLine=true

Related topics

System parameters
Web tier parameters
Enter a parameter in the web client URL


Enter a parameter in the web.xml file
Client parameters for web clients


1.2.13.37. Web parameter:
expandSmartSearch

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

expandSmartSearch

Description

This parameter specifies whether to expand the Smart Search field by default on the
top right area in the web client. If you set this parameter to true, the Smart Search
field is expanded by default when you log on to the web client, and you don't need to
click the Smart Search field icon to expand it.

Valid if set from

Web tier configuration file (webtier.properties)

Requires restart of the web applications server?

Yes

Default value

false

Possible values

true (the Smart Search field is expanded by default)
false (the Smart Search field is not expanded by default)

Example usage

  expandSmartSearch=true

Related topics

System parameters
Web tier parameters
Enter a parameter in the web client URL


Enter a parameter in the web.xml file
Client parameters for web clients


1.2.13.38. Web parameter:
helpServerContext

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

helpServerContext

Description

This parameter defines the context path when the Service Manager help center is
published on a web server. Service Manager will launch the help center using this
URL: http://<helpServerHost>:<helpServerPort>/<helpServerContext>, where
<helpServerContext> refers to the context path.

            Important

           The Service Manager help center is published at the following web site:
           https://docs.microfocus.com . No help server installation package is
           available for you to deploy the help center on your own server. To enable
           your end users to access the help center from the web client UI, you must
           set this parameter to the context path part of the help center home page
           URL. First, find this URL from the https://docs.microfocus.com website.
           For example, if the help center home page URL is
           /itom/Service_Manager:9.xx/Home , set this parameter to
           itom/Service_Manager:9.xx/Home.

            Note

           By default, this parameter is not included in the web.xml file, and Service
           Manager will directly open this URL: http://<helpServerHost>:
           <helpServerPort>/help.

Valid if set from

Web tier configuration file (web.xml and webtier.properties)

Requires restart of the web applications server?


Yes

Default value

help

Possible values

Context path part of the help center home page URL

Example usage

In the web.xml file:

  <init-param>
      <param-name>helpServerContext</param-name>
      <param-value>itom/Service_Manager:9.xx/Home</param-value>

  </init-param>

In the webtier.properties file:

  helpServerContext=itom/Service_Manager:9.xx/Home

Related topics

Web parameter: showHelp
Web parameter: helpServerHost
Web parameter: helpServerPort


1.2.13.39. Web parameter: helpServerHost

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

helpServerHost

Description

This parameter defines the name of the Help server host that listens for client
requests. You must define this parameter if your end users need to access the
Service Manager help center from the web client.

            Important

           The Service Manager help center is published at the following web site:
           https://docs.microfocus.com . No help server installation package is
           available for you to deploy the help center on your own server. To enable
           your end users to access the help center from the web client UI, you must
           set this parameter to docs.microfocus.com .

Valid if set from

Web browser URL
Web tier configuration file (web.xml and webtier.properties)

Requires restart of the web applications server?

Yes

Default value

None

Possible values

Host name of Help Server

Example usage


  <init-param>
      <param-name>helpServerHost</param-name>
      <param-value>docs.microfocus.com</param-value>

  </init-param>

Related topics

Web parameter: showHelp
Web parameter: helpServerPort
Web parameter: helpServerContext


1.2.13.40. Web parameter: helpServerPort

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

helpServerPort

Description

This parameter defines the communications port number on which the Help server
listens to client requests. You must define this parameter if your end users need to
access the Service Manager help center from the web client.

            Important

           The Service Manager help center is published at the following web site:
           https://docs.microfocus.com . No help server installation package is
           available for you to deploy the help center on your own server. Since the
           help center website uses the default port, you must leave this parameter
           empty or set it to 80.

Valid if set from

Web browser URL
Web tier configuration file (web.xml and webtier.properties)

Requires restart of the web applications server?

Yes

Default value

None

Possible values

Communications port number

Example usage


  <init-param>
      <param-name>helpServerPort</param-name>
      <param-value></param-value>

  </init-param>

Related topics

Web parameter: showHelp
Web parameter: helpServerHost
Web parameter: helpServerContext


1.2.13.41. Web parameter: honorUrlHost

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

honorUrlHost

Description

This parameter determines whether web client users can specify the name of the
Service Manager server from the URL. Setting this parameter to false prevents web
client users from changing the value of the serverHost parameter from the URL.

Valid if set from

Web tier configuration file (web.xml and webtier.properties)

Requires restart of the web applications server?

Yes

Default value

false

Possible values

true
false

Example usage

  <init-param>
      <param-name>honorUrlHost</param-name>
      <param-value>true</param-value>

  </init-param>

Related topics

System parameters
Web tier parameters
Enter a parameter in the web client URL


Enter a parameter in the web.xml file
Client parameters for web clients


1.2.13.42. Web parameter: honorUrlPort

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

honorUrlPort

Description

This parameter determines whether web client users can specify the communications
port of the Service Manager server from the URL. Setting this parameter to false
prevents web client users from changing the value of the serverPort parameter from
the URL.

Valid if set from

Web tier configuration file (web.xml and webtier.properties)

Requires restart of the web applications server?

Yes

Default value

false

Possible values

true
false

Example usage

  <init-param>
      <param-name>honorUrlPort</param-name>
      <param-value>true</param-value>

  </init-param>

Related topics

System parameters
Web tier parameters
Enter a parameter in the web client URL


Enter a parameter in the web.xml file
Client parameters for web clients


1.2.13.43. Web parameter:
isCustomAuthenticationUsed

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

isCustomAuthenticationUsed

Description

By default, Service Manager authenticates web client users by comparing the user
name and password that the user enters on the Service Manager login page to a
matching operator record in the system.

To enable single sign-on (Trusted Sign-On, LW-SSO, or SAML SSO) and CAC Sign-
On), you must disable the default authentication method by setting this parameter to
false.
For example, for trusted sign-on, this causes Service Manager to send the current
user name in the HTTP header. Trusted sign-on uses the user name to determine if a
web client is already authenticated or not.

            Caution

           You should only disable this parameter if you are using any of the above-
           described sign-on configurations. Disabling this parameter without such a
           sign-on configuration will prevent your web client users from logging in to
           Service Manager.

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

      <param-name>isCustomAuthenticationUsed</param-name>

      <param-value>false</param-value>

  </context-param>

Related topics

System parameters
Web tier parameters
Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Client parameters for web clients


1.2.13.44. Web parameter:
JCEProviderClassName

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

JCEProviderClassName

Description

This parameter specifies the class name of a third-party Java Cryptography
Extension (JCE) provider when the web tier is running in non-FIPS mode (that is,
when the fipsMode parameter is set to false in the webtier.properties file).

            Note

           In FIPS mode, this parameter is ignored.

Valid if set from

Web tier configuration file (web.xml and webtier.properties)

Requires restart of the web applications server?

Yes

Default value

None

Possible values

JCE provider class names

Example usage

  <init-param>
      <param-name>JCEProviderClassName</param-name>
      <param-value>com.rsa.jsafe.provider.JsafeJCE</param-value>

  </init-param>

Related topics


System parameters
Web tier parameters
Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Client parameters for web clients
````
