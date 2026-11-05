---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.1.5 .. 1.1.5
printed_pages: 20-43
---

# 1.1.5 Common F5 hardware load balancer deployments

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.5. Common F5 hardware load balancer
deployments

The following topics describe some common F5 HWLB deployments.
     Access Service Manager through an F5 HWLB in HTTP mode
     Access Service Manager on a Windows client through an F5 HWLB in SSL
     Offloading mode
     Access Service Manager on a Windows client through an F5 HWLB in Full SSL
     mode
     Access Service Manager in Mixed mode


1.1.5.1. Access Service Manager through
an F5 HWLB in HTTP mode

The following figure illustrates a deployment in which users access Service Manager
through an F5 HWLB in HTTP mode:



1.1.5.1.1. Access Service Manager on a
Windows client through an F5 HWLB in
HTTP mode

This deployment is suited to test Service Request Catalog and Service Manager in a
development or non-production environment. As you can see from the figure in
Access Service Manager through an F5 HWLB in HTTP mode, this configuration
doesn't use HTTPS/SSL encrypted communication. This deployment should be used
for sand box, development, or demonstration (proof of concept) purposes.

This section describes how to access Service Manager on a Windows client through
an F5 HWLB in HTTP mode.

Step 1: Configure a Windows client to support an
external hardware load balancer

To configure a Windows client to support an external hardware load balancer, follow
these steps:

   1. Install a new Windows client.
   2. Start the Windows client, and then create a new network connection called

      hwlb_connect .
   3. Type the IP or host name of the virtual server as the connection's server

     address.
   4. Type the port of the HWLB virtual server as the connection's server port.
   5. On the Advanced tab, click to select the Connect to External Load Balancer

     option.
   6. Click Apply, and then click Connect.

Step 2: Enable an HWLB on a Service Manager
server

To enable an HWLB on a Service Manager server, follow these steps:

   1. Add the external_lb attribute to the sm.ini file on the Service Manager server.


                   Note

                The external_lb attribute is a system attribute, and every servlet
                node on the same host should use the same attribute setting. In
                most cases, this attribute needs to be configured in the sm.ini file
                when you start a servlet from the operating system command
                prompt.

                However, to prevent a servlet node from running in external load
                balancer mode, you can include -external_lb:0 in a command when
                you start a servlet from the operating system command prompt. As
                the servlet node doesn't work in external load balancer mode, it
                rejects any connections from a hardware load balancer.

                Only -external_lb:0 can be added to a command. -external_lb:1
                and external_lb aren't recognized in commands.

   2. Make sure that no Service Manager software load balancer (for example, sm -
     loadBalancer ) is configured or running on the Service Manager server.

Related topics

Access Service Manager through an F5 HWLB in HTTP mode
Access Service Manager on a web client through an F5 HWLB in HTTP mode
F5 HWLB Health Monitor


1.1.5.1.2. Access Service Manager on a
web client through an F5 HWLB in HTTP
mode

This deployment is suited to testing Service Request Catalog and Service Manager in
a development or non-production environment. As you can see from the figure in
Access Service Manager through an F5 HWLB in HTTP mode, this configuration
doesn't use HTTPS/SSL encrypted communication. This deployment should be used
for sand box, development, or demonstration (proof of concept) purposes.
This section describes how to access Service Manager on a web client through an F5
HWLB in HTTP mode.

Step 1: Configure a web client to support an
external load balancer

To configure a web client to support an external load balancer, follow these steps:
   1. Set the externalLB parameter in the web.xml file to true , as follows:

          <init-param>
                     <param-name>externalLB</param-name>
                     <param-value>true</param-value>

            </init-param>

   2. Set the host and port to match the HWLB virtual server IP and port. To do this,
     configure the web.xml file as follows:

          <init-param>
                     <param-name>serverHost</param-name>
                     <param-value><fully-qualified domain name of the HWLB

          virtual server></param-value>
            </init-param>
            <init-param>
                     <param-name>serverPort</param-name>
                     <param-value><Port of the HWLB virtual server></param-

          value>
            </init-param>


Step 2: Enable an HWLB on a Service Manager
server

To enable an HWLB on a Service Manager server, follow these steps:

   1. Add the external_lb attribute to the sm.ini file on the Service Manager server.

                   Note

                The external_lb attribute is a system attribute, and every servlet
                node on the same host should use the same attribute setting. In
                most cases, this attribute needs to be configured in the sm.ini file
                when you start a servlet from the operating system command
                prompt.

                However, to prevent a servlet node from running in external load
                balancer mode, you can include -external_lb:0 in a command when
                you start a servlet from the operating system command prompt. As
                the servlet node doesn't work in external load balancer mode, it
                rejects any connections from a hardware load balancer.

                Only -external_lb:0 can be added to a command. -external_lb:1
                and external_lb aren't recognized in commands.

   2. Make sure that no Service Manager software load balancer (for example, sm -
     loadBalancer ) is configured or running on the Service Manager server.

Related topics

Access Service Manager through an F5 HWLB in HTTP mode
Access Service Manager on a Windows client through an F5 HWLB in HTTP mode
F5 HWLB Health Monitor


1.1.5.2. Access Service Manager through
an F5 HWLB in SSL offloading mode

The following figure illustrates a deployment in which users access Service Manager
through an F5 HWLB in SSL offloading mode:


1.1.5.2.1. Access Service Manager on a
Windows client through an F5 HWLB in
SSL Offloading mode

This section describes how to access Service Manager on a Windows client through
an F5 HWLB in SSL Offloading mode.

Prerequisites

Before you begin this process, you must create the client certificates and private
keys, as described in Configure an HWLB for SSL offloading.

            Note

           You don't need to configure SSL on the server.

Configure the Windows client to use SSL

To access Service Manager on a Windows client through an F5 HWLB in SSL
Offloading mode, you must configure the Windows client to use SSL. To do this,
follow these steps:

   1. Click Windows > Preference >Service Manager > Security.
   2. Click Browse to fill the Client Keystore file.
   3. Type clientkeystore as the password.
   4. Select the cacerts CA Certificates file that you created earlier, and then click

     OK.
   5. Restart Windows.

Related topics

Access Service Manager through an F5 HWLB in SSL Offloading mode
Access Service Manager on a web client through an F5 HWLB in SSL Offloading
mode
Access Service manager on a web service client through an F5 HWLB in SSL
Offloading mode


1.1.5.2.2. Access Service Manager on a
web client through an F5 HWLB in SSL
Offloading mode

This section describes how to access Service Manager on a web client through an F5
HWLB in SSL Offloading mode.

Prerequisites

Before you begin this process, you must create the client certificates and private
keys, as described in Configure an HWLB for SSL offloading.

            Note

           You don't need to configure SSL on the Service Manager server.

Modify the web.xml file

To access Service Manager on a web client through an F5 HWLB in SSL Offloading
mode, configure the following parameters in the web.xml file, and then restart
Tomcat:

     ssl

          <init-param>
          <param-name>ssl</param-name>
          <param-value>true</param-value>
          </init-param>

     externalLB

          <init-param>
          <param-name>externalLB</param-name>
          <param-value>true</param-value>
          </init-param>

     keystore


          <!-- If this is a relative path, it will be relative to the
          web application's deploy directory,
          but still needs a leading slash -->
          <init-param>
          <param-name>keystore</param-name>
          <param-value>/WEB-INF/<FQDN of This Host>.keystore </param-
          value>
          </init-param>
          <!-- Specify the password for the client's private keystore
          -->
          <init-param>
          <param-name>keystorePassword</param-name>
          <param-value>clientkeystore</param-value>
          </init-param>

Related topics

Access Service Manager through an F5 HWLB in SSL Offloading mode
Access Service Manager on a Windows client through an F5 HWLB in SSL Offloading
mode
Access Service manager on a web service client through an F5 HWLB in SSL
Offloading mode


1.1.5.2.3. Access Service Manager on a
web service client through an F5 HWLB in
SSL Offloading mode

This section describes how to access Service Manager on a web service client
through an F5 HWLB in SSL Offloading mode.

Prerequisites

Before you begin this process, you must create the client certificates and private
keys, as described in Configure an HWLB for SSL offloading.

            Note

           You don't need to configure SSL on the server.

Create a new project in SoapUI

To access Service Manager on a web service client through an F5 HWLB in SSL
Offloading mode, follow these steps:

   1. Start the SoapUI tool and click New project.
   2. Type a name for the project in the Project Name field.
  3. In the Initial WSDL/WADL field, type http://<SM Server IP>:<SM Server

     Port>/SM/7/ChangeManagement.wsdl.
   4. Click to select the Create Requests option, and then click OK.
   5. Right-click RetrieveChangeList and select New request.
   6. Type a name for the request.
   7. Click File > Preference > SSL Settings.
   8. Navigate to the <client FQDN>.keystore file.

   9. Type clientkeystore as the password, and then click OK.
 10. Modify the request as follows:


          <soapenv:Envelope
          xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
          xmlns:ns="http://schemas.hp.com/SM/7">
          <soapenv:Header/>
          <soapenv:Body>
          <ns:RetrieveChangeListRequest attachmentInfo="?"
          attachmentData="?" ignoreEmptyElements="true" count="2"
          start="0">
          <!--1 or more repetitions:-->
          <ns:keys query="planned.start=NULL">
          </ns:keys>
          </ns:RetrieveChangeListRequest>
          </soapenv:Body>
          </soapenv:Envelope>

 11. Click Authenticate.
 12. Type falcon as the user name.
 13. Replace http in the URL with https. For example, set the following URL:

     https://<FQDN of the HWLB virtual server>:<Port of HWLB virtual
     server>/SM/7/ws.

Related topics

Access Service Manager through an F5 HWLB in SSL Offloading mode
Access Service Manager on a Windows client through an F5 HWLB in SSL Offloading
mode
Access Service Manager on a web client through an F5 HWLB in SSL Offloading
mode


1.1.5.3. Access Service Manager through
an F5 HWLB in Full SSL mode

The following figure illustrates a deployment in which users access Service Manager
through an F5 HWLB in Full SSL mode:


1.1.5.3.1. Access Service Manager on a
Windows client through an F5 HWLB in
Full SSL mode

This section describes how to access Service Manager on a Windows client through
an F5 HWLB in Full SSL mode.

Prerequisites

Before you begin this process, verify that the following conditions are true:

     To maintain session persistence, SSL must be configured between the F5 HWLB
     and the Windows client. For more information about how to configure SSL, see
     Configure an HWLB for SSL offloading.
     SSL is configured between the F5 HWLB and the SM server. For more
     information about how to do this, see Configure an HWLB for SSL between an F5
     load balancer and an Service Manager server .

Modify the sm.ini file

To access Service Manager on a Windows client through an F5 HWLB in Full SSL
mode, configure the following parameters in the sm.ini file:

  ssl:1
  ssl_reqClientAuth:2
  keystoreFile:server.keystore
  keystorePass:serverkeystore
  ssl_trustedClientsJKS:trustedclients.keystore
  ssl_trustedClientsPwd:trustedclients
  truststoreFile:cacerts
  truststorePass:changeit
  external_lb
  sslConnector:1

Related topics

Access Service Manager through an F5 HWLB in Full SSL mode
Access Service Manager on a web client through an F5 HWLB in Full SSL mode


Access Service Manager on a web service client through an F5 HWLB in Full SSL
mode


1.1.5.3.2. Access Service Manager on a
web client through an F5 HWLB in Full SSL
mode

This section describes how to access Service Manager on a web client through an F5
HWLB in Full SSL mode.

Prerequisites

Before you begin this process, verify that the following conditions are true:

     To maintain session persistence, SSL must be configured between the F5 HWLB
     and the web client. For more information about how to configure SSL, see
     Configure an HWLB for SSL offloading.
     SSL is configured between the F5 HWLB and the SM server. For more
     information about how to do this, see Configure an HWLB for SSL between an F5
     load balancer and an Service Manager server .

Step 1: Modify the sm.ini file

Configure the following parameters in the sm.ini file:

  ssl:1
  ssl_reqClientAuth:2
  keystoreFile:server.keystore
  keystorePass:serverkeystore
  ssl_trustedClientsJKS:trustedclients.keystore
  ssl_trustedClientsPwd:trustedclients
  truststoreFile:cacerts
  truststorePass:changeit
  external_lb
  sslConnector:1

Step 2: Modify the web.xml file

On the Service Manager web tier, locate the web.xml file, and then configure the
following parameters:


  <init-param>
  <param-name>ssl</param-name>
  <param-value>true</param-value>
  </init-param>
  <init-param>
  <param-name>cacerts</param-name>
  <param-value>/WEB-INF/cacerts</param-value>
  </init-param>
  <init-param>
  <param-name>keystore</param-name>
  <param-value>/WEB-INF/<webtier FQDN>.keystore</param-value>
  </init-param>
  <init-param>
  <param-name>keystorePassword</param-name>
  <param-value>clientkeystore</param-value>
  </init-param>
  <init-param>
  <param-name>externalLB</param-name>
  <param-value>true</param-value>
  </init-param>

Related topics

Access Service Manager through an F5 HWLB in Full SSL mode
Access Service Manager on a Windows client through an F5 HWLB in Full SSL mode
Access Service Manager on a web service client through an F5 HWLB in Full SSL
mode


1.1.5.3.3. Access Service Manager on a
web service client through an F5 HWLB in
Full SSL mode

This section describes how to access Service Manager on a web service client
through an F5 HWLB in Full SSL mode.

Prerequisites

Before you begin this process, verify that the following conditions are true:

     To maintain session persistence, SSL must be configured between the F5 HWLB
     and SoapUI. For more information about how to configure SSL, see Configure an
     HWLB for SSL offloading.
     SSL is configured between the F5 HWLB and the SM server. For more
     information about how to do this, see Configure an HWLB for SSL between an F5
     load balancer and an Service Manager server .

Step 1: Modify the sm.ini file

Configure the sm.ini file as follows:

  ssl:1
  ssl_reqClientAuth:2
  keystoreFile:server.keystore
  keystorePass:serverkeystore
  ssl_trustedClientsJKS:trustedclients.keystore
  ssl_trustedClientsPwd:trustedclients
  truststoreFile:cacerts
  truststorePass:changeit
  external_lb
  sslConnector:1

Step 2: Create a new project in SoapUI

To create a new project in SoapUI, follow these steps:

   1. Start the SoapUI tool and click New project.
   2. Type a name for the project in the Project Name field.


  3. In the Initial WSDL/WADL field, type http://<HWLB virtual server
     IP>:13080/SM/7/ChangeManagement.wsdl.

   4. Click to select the Create Requests option, and then click OK.
   5. Right-click RetrieveChangeList and select New request.
   6. Type a name for the request.
   7. Click File > Preference > SSL Settings.
   8. Navigate to the <client FQDN>.keystore file.
   9. Type clientkeystore as the password, and then click OK.
 10. Modify the request as follows:

          <soapenv:Envelope
          xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
          xmlns:ns="http://schemas.hp.com/SM/7">
          <soapenv:Header/>
          <soapenv:Body>
          <ns:RetrieveChangeListRequest attachmentInfo="?"
          attachmentData="?" ignoreEmptyElements="true" count="2"
          start="0">
          <!--1 or more repetitions:-->
          <ns:keys query="planned.start=NULL">
          </ns:keys>
          </ns:RetrieveChangeListRequest>
          </soapenv:Body>
          </soapenv:Envelope>

 11. Click Authenticate.
 12. Type falcon as the user name.
 13. Replace http in the URL with https. For example, set the following URL:

     https://<FQDN of the HWLB virtual server>:<Port of HWLB virtual
     server>/SM/7/ws.

Related topics

Access Service Manager through an F5 HWLB in Full SSL mode
Access Service Manager on a Windows client through an F5 HWLB in Full SSL mode
Access Service Manager on a web client through an F5 HWLB in Full SSL mode


1.1.5.4. Access Service Manager in Mixed
mode

The following figure illustrates a deployment in which users access Service Manager
through an F5 HWLB in Mixed mode:


1.1.5.4.1. Sign in to a Service Manager
server by using TSO when a HWLB is
located between the browser and the
webtier

This section describes how to sign in to Service Manager by using Trusted sign-on
(TSO) when a HWLB is located between the browser and the web tier.

Prerequisites

Before you begin this process, you must access Service Manager on a web client
through an F5 HWLB in Full SSL mode, as described in Access Service Manager on a
web client through an F5 HWLB in Full SSL mode.

Configure the HWLB virtual server

To sign in to a Service Manager server by using TSO, you must configure the HWLB
virtual server. To do this, follow these steps:

   1. Click Local Traffic > Virtual Servers > Virtual Server List.
   2. Select the virtual server that you want to configure.
   3. In the HTTP Profile field, select TEST_HTTP.
   4. In the OneConnect Profile field, select oneconnect.
   5. In the NTLM Conn Pool field, select ntlm.
   6. Click Update.
   7. Add the HWLB domain URL to your browser's trusted sites list.

You can now log on to the Service Manager web tier through the HWLB. For example,
type the following URL into the address bar of your browser:

http://<FQDN of HWLB virtual server>/<sm980>/index.do

Related topics

Access Service Manager in Mixed mode
Sign in to a Service Manager server by using LW-SSO when a HWLB is located
between the browser and the webtier


1.1.5.4.2. Sign in to a Service Manager
server by using LW-SSO when a HWLB is
located between the browser and the
webtier

This section describes how to sign in to Service Manager by using Lightweight Single
Sign-On (LW-SSO) when an HWLB is located between the browser and the web tier.

Prerequisites

Before you begin this process, verify that the following conditions are true:

     The HWLB is configured to accept client requests, as described in Configure an
     HWLB to accept client requests in HTTP mode.
     A pool contains the members that point to the web application server (for
     example, Tomcat).
     The server and the web tier share the same initString setting.
     LW-SSO works without the HWLB.

                   Note

                If the domain name of the HWLB is not the same as the domain
                name of the web tier, you must set the value of the domain
                parameter in the lwssofmconf.xml file on the web tier to the domain
                name of the HWLB.

Enable LW-SSO

   1. Enable LW-SSO on the Service Manager server. For more information about how
     to do this, see Configure LW-SSO in the Service Manager server.

   2. Enable LW-SSO on the web tier. For more information about how to do this, see
     Configure LW-SSO in the Service Manager Web tier.

Related topics

Access Service Manager in Mixed mode
Sign in to Service Manager by using TSO when an HWLB is located between the
browser and the web tier
````
