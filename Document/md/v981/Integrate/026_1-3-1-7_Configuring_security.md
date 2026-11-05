---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.3.1.7 .. 1.3.1.9
printed_pages: 692-713
---

# 1.3.1.7 Configuring security

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.3.1.7. Configuring security

This chapter describe the required security configuration settings.


1.3.1.7.1. Security between SAP Solution
Manager and Tomcat

This section describes the security configuration between SAP Solution Manager and Tomcat.


1.3.1.7.1.1. Configure SAP Solution Manager for
SSL

This section describes how to configure SAP Solution Manager for SSL.

Checking SAP SSL configuration

SAP WEB AS doesn't support or allow self-signed certificates for communication between
Solution Manager and the SMSSMEX Web Service. All certificates must be trusted against a
CA.

Before configuring SSL for the External Help Desk interface, check if the WEB AS that hosts
the SAP Solution Manager is configured for using SSL.

ICM (Internet Communication Manager) HTTPS service is required for SSL communication.
Check if SSL communication is possible in SAP transaction /nsmicm (select menu entry
GOTO and select Services or press SHIFT+F1).

If SSL communication is possible then an active HTTPS service that's listening to a port is
visible. In the example below, the HTTPS port is 8001. This port must be configured in the
SMSSMEX web service properties file.

If an HTTPS service in the ICM monitor is not visible, then check the SSL Server configuration
in Trust Manager. Start the Trust Manager with SAP transaction /nstrust .

If the PSE entries SSL Server and SSL Client (Standard) aren't shown in the Trust Manager
status section, then install and configure the SAP sapcryptolib library.

            Note

           Installing and configuring sapcryptolib requires a restart of the SAP WEB AS
           instance. The installation instructions are in the SAP online help. For more
           information, see Installing and configuring SAPCRYPLIB.

The following diagram shows the Trust Manager with the created PSE SSL Server and SSL
Client (Standard). The red X in front of the other PSE's indicates that the PSE's have not been
created. The PSE SSL Server and SSL Client (Standard) must be created.


In the next diagram the certificate of the PSE SSL Client (Standard) is Self Signed. Self-signed
certificates aren't supported for communication with Apache Tomcat (the certificate must be
signed against a CA). If the certificate is signed, the Self signed certificate text will disappear.

Check the certificate by double-clicking the Owner attribute. The certificate details are shown
in the Certificate section. If the Owner and Issuer have the same DN the certificate is self-
signed.

Creating a client PSE in Trust Manager  Page 695 of 1727

This PDF was generated on May 23, 2026

To create a client PSE in Trust Manager, do the following:
   1. Start the Trust Manager.
   2. Select the PSE SSL Client (Standard) in the status section of the Trust Manager.
   3. Click Create.

4. For the CN (Name) enter the fully qualified hostname of the SAP WEB AS system. All
  other entries must not be changed. The key length should be 1024.

5. Save the settings.
6. Double-click SSL Client (Standard) in the status section. The Own certificate in the Own

  Certificate section is shown.

7. Click Create Certificate Request.

8. The Certification Request is shown. Copy the request to the Clipboard.


9. Certify the request with a CA.

                 Note

               SAP offers a two-month test period for signed certificates in the SAP Service
               Marketplace at http://www.service.sap.com/ssltest.

10. Request an SSL Server Test Certificate as shown in the following diagram (select the
    PKCS#7 chain format).

11. Click Continue. The SSL Server Certificate is created.


12. Copy the Certificate response to your client PSE.

The certificate is now trusted against a CA. The required steps are different for other CA's.
Contact the Trust Center for details. A certificate for the SSL Server PSE is also required.

Setting up an outgoing connection in SAP Solution
Manager


The outgoing connection from SAP Solution Manager to Apache Tomcat must be configured in
SAP transaction /nsm59 . Add a new or change an existing HTTP RFC destination with type G.

   1. In SAP transaction /nsm59 configure the HTTPS port of the Tomcat Server. A redirect
     from the HTTP port to the HTTPS port of Apache Tomcat will not work with the SAP WEB
     AS. The HTTPS port is defined in the server.xml configuration file of the Tomcat Server.

   2. The SSL configuration of Apache Tomcat is switched off by default. Enable the
     configuration.

   3. In the settings for the SSL HTTP connector, set the Tomcat default port for SSL
     communication to 8443 .

   4. The diagram below shows the example configuration of the RFC Destination (in the
      Target Host field enter the server name (case sensitive) instead of the IP address).

5. In the Logon&Security tab of the RFC configuration define the logon procedure and the
  security protocol. Basic authorization with SSL communication and certificates is
  unsupported by Apache Tomcat. Set the Logon Procedure to No Logon .

6. In the security protocol status enable SSL and select a PSE from the certification list. SAP
  provides PSE ANONYM SSL Client and DFAULT SSL Client (Standard).


   7. Check with the SAP Basis Administrator what client PSE should be used. In most cases
     this will be the PSE SAP Client (Standard).

   8. After assigning a client Certificate to the RFC destination, save the settings. The RFC
     destination is configured for using SSL with Apache Tomcat. A connection test will fail if
     the Server certificate in Apache Tomcat is not trusted against a CA.

   9. Create a logical port (see Create a logical port).
 10. Configure the interface between SAP Solution Manager Service Desk and Service

     Manager for the SSL outgoing connection (see Configure interface to SAP Solution
     Manager Service Desk).

Set up an incoming connection in SAP Solution Manager

Configure the incoming connection in the ICF Service tree in SAP transaction /nsicf .

   1. In SAP transaction /nsicf , enter ICT_SERVICE_DESK_API as service name.
   2. Execute the search of the service.
   3. Double-click the Service to edit (or navigate to /default_host/sap/bc/srt/rfc/sap/ and

     select ICT_SERVICE_DESK_API).
   4. Open the Create/Change a Service dialog.
   5. In the Logon tab, select Required with client Certificates (SSL).


6. Save the settings. Service ICT_SERVICE_DESK_API is configured for SSL connection
  only. In this procedure, the lowest possible security level is specified. If Required with
  Logon Data is configured, then connecting via SSL and the client certificate is allowed.

                 Note

               For SSL communication, ensure that the ICM uses HTTPS.

    Define the user mapping to the DN of the Certificate. The different ways of mapping are
    described in the SAP online help. Defining a user mapping to a DN is described below.

 7. In SAP transaction /nse16 , open the view VUSREXTID (enter VUSREXTID in the table
     Name field).

 8. Select the Work Area DN of Certificate X.500.

 9. In the user mapping dialog, as an external ID add the DN of the client certificate of
    Apache Tomcat (see Create keystore and truststore). Specify the exact DN of the
    certificate. For example:

     CN=helen2006.asiapacific.hpqcorp.net, OU=TEST, O=GDCC, L=SH, SP=CN, C=CN

10. For Seq. No , enter 000, 001… (for internal use only).

11. Assign the SAP user for the Web Service. This user has all the required permissions for
    managing incidents in SAP Solution Manager.



1.3.1.7.1.2. Set up SSL between SAP and
SMSSMEX

This section describes how to setup SSL between SAP and SMSSMEX.

Create keystore and truststore

SMSSMEX requires:

     Two separate stores that contain the certificates used to authenticate and encrypt
     communication.
     The following certificates:

           Signed certificate with the long hostname of the SMSSMEX server in the CN section
           (for example, CN="server.hp.com" ). This certificate must be mapped to an SAP
           user in SAP Solution Manager.
           Certificate of the root CA used to sign the certificate of the SAP Solution Manager.
           Certificate of the root CA used to sign the certificate of the SMSSMEX certificate.

The keystore must contain the following certificates:

     Root CA certificate used to sign the SMSSMEX certificate
     SMSSMEX certificate

The truststore must contain the root certificate used to sign the certificate of the SAP Solution
Manager.

Any tool can be used to create and manage the key- and truststores. The following examples
use the Java JDK tool keytool to create and import a signed certificate.

   1. Create a self-signed certificate. The keypass and the storepass must be identical.

      keytool -genkey -alias <alias> -keyalg RSA -keystore <keystorefile> -storepass
     <password> -keypass <password> -dname "CN=<serverhost>, OU=<MYOU>, O=
     <MYORG>, L=<MYCITY>, ST=<MYSTATE>, C=<MY>"

     For example:

      keytool -genkey -alias ovictex -keyalg RSA -keystore "C:\Program Files\Micro
     Focus\SMSSMEX\config\certs\ovictex.keystore" -storepass ovictex -keypass ovictex -
     dname "CN=helen2006.asiapacific.hpqcorp.net, OU=TEST, O=GDCC, L=SH, ST=CN,
     C=CN"

   2. Create a certificate request:

      keytool -certreq -keystore <keystorefile> -alias <alias> -storepass <password>

     For example:


      keytool -certreq -keystore "C:\Program Files\Micro
     Focus\SMSSMEX\config\certs\ovictex.keystore" -alias ovictex -storepass ovictex

   3. Use the resulting certificate request to acquire a signed certificate from SAP Web
     (https://websmp102.sap-ag.de/SSLTest) with chain PKCS#7. Copy the signed response
      <filename>.p7b (for example, sap_rp.p7b ).

   4. Download the root certificate file from https://tcs.mysap.com/invoke/tc/getCert?
     SAPServerCA.der.

   5. Import the root certificate from the Certificate Authority (CA) into the keystore.

      keytool -import -v -alias <alias2> -keystore <keystorefile> -storepass <password> -file
     <rootcertificatefile>

     For example:

      keytool -import -v -alias saproot -keystore "C:\Program Files\Micro
     Focus\SMSSMEX\config\certs\ovictex.keystore" -storepass ovictex -file "C:\Program
     Files\Micro Focus\SMSSMEX\config\certs\getCert.cer"

   6. Import the answer from the Certificate Authority into the keystore. Use the same keystore
     file and alias the request was created from.

      keytool -import -v -alias <alias> -keystore <keystorefile> -storepass <password> -file
     <certificatefile>

     For example:

      keytool -import -v -alias ovictex -keystore "C:\Program Files\Micro
     Focus\SMSSMEX\config\certs\ovictex.keystore" -storepass ovictex -file "C:\Program
     Files\Micro Focus\SMSSMEX\config\certs\sap.p7b"

     To import the certificates into the truststore, use the same command as in the step above,
     but instead of <keystorefile> use the filename of the truststore (if it doesn't exist, it will
     be created automatically). For example:

      keytool -import -v -alias saproot -keystore "C:\Program Files\Micro
     Focus\SMSSMEX\config\certs\ovictex.truststore" -storepass ovictex -file "C:\Program
     Files\Micro Focus\SMSSMEX\config\certs\getCert.cer"

Configure Tomcat SSL

To enable SSL with Tomcat, configure a new connector in the server.xml configuration file.
The standard server.xml contains a connector definition that has been commented out. The
following attributes are required:


  port=<port>
  scheme="https"
  secure="true"
  clientAuth="false"
  sslProtocol = "TLS"
  keystoreFile=<keystorefile>
  keystorePass=<keystorepass>
  truststoreFile=<truststorefile>
  truststorePass=<truststorepass>

For example:

  <Connector port="8443"
  maxThreads="150" minSpareThreads="25" maxSpareThreads="75"
  enableLookups="false" disableUploadTimeout="true"
  acceptCount="100" debug="0" scheme="https" secure="true"
  clientAuth="false" sslProtocol="TLS"
  keystoreFile="C:/Program Files/Micro
  Focus/SMSSMEX/config/certs/ovictex.keystore"
  keystorePass="password"
  truststoreFile="C:/Program Files/Micro
  Focus/SMSSMEX/config/certs/ovictex.truststore"
  truststorePass="password"
  />

Configure property files

Follow these steps:
   1. Modify exthd.properties .
        1. In the SAP configuration files in property exthd.webservice.endpoint specify the
           new port (default is 8443) and use https:// as the protocol. For example:
            exthd.webservice.endpoint =
           https://watermelon.chn.hp.com:8001/sap/bc/srt/rfc/sap/ICT_SERVICE_DESK_API?
           sap-client=300
        2. Set the exthd.webservice.authentication.scheme to HTTPS.
   2. Add the following configuration entries in ovictex.properties :
      <saphostname>.keystore=C:/Program Files/Micro
     Focus/SMSSMEX/certs/ovictex.keystore
      <saphostname>.keystore.password=~X1~H+7JAOrcX/R6kO5diPxV0w==
      <saphostname>.truststore=C:/Program Files/Micro


Focus/SMSSMEX/certs/ovictex.truststore
<saphostname>.truststore.password=~X1~H+7JAOrcX/R6kO5diPxV0w==

For example:

watermelon.chn.hp.com.keystore= C:/Program Files/Micro
Focus/SMSSMEX/certs/ovictex.keystore
watermelon.chn.hp.com.keystore.password=~X1~H+7JAOrcX/R6kO5diPxV0w==
watermelon.chn.hp.com.truststore= C:/Program Files/Micro
Focus/SMSSMEX/certs/ovictex.truststore
watermelon.chn.hp.com.truststore.password=~X1~H+7JAOrcX/R6kO5diPxV0w==


1.3.1.7.2. Security Between Service Manager
and SMSSMEX

This section describes how to configure security between Service Manager and SMSSMEX.


1.3.1.7.2.1. Configure Service Manager for SSL

For more information about how to configure Service Manager for SSL, refer to the Service
Manager Help Center documentation.


1.3.1.7.2.2. Configure SMSSMEX for SSL
Communication with Service Manager

To configure SMSSMEX for SSL communications with Service Manager, do the following:
   1. Import the root CA into the trust keystore.
      keytool -import -trustcacerts -alias <alias> -keystore <keystorefile> -file
     <certificatefile>
     For example:
      keytool -import -trustcacerts -alias scca -keystore ovictex.truststore -file mycacert.pem
   2. Configure ovictex.properties .
        1. Set sc.webservice.endpoint .
            sc.webservice.endpoint = http://<smhostname>:<port>/sc62server/PWS
        2. Add the following configuration entries in ovictex.properties .
            <smhostname>.keystore=<ovictex keystore file>
           <smhostname>.keystore.password=<keystore password>
           <smhostname>.truststore=<ovictex truststore file>
           <smhostname>.truststore.password=<truststore password>
           For example:

                 sc.webservice.endpoint =
                 http://SMCI02.chn.hp.com:13080/sc62server/PWS
                 ……
                 SMCI02.chn.hp.com.keystore=C:/Program Files/Micro
                 Focus/SMSSMEX/config/certs/ovictex.keystore
                 SMCI02.chn.hp.com.keystore.password=~X1~eD+6cy6OMNxdK9tcCQVBww=
                 =
                 SMCI02.chn.hp.com.truststore=C:/Program Files/Micro
                 Focus/SMSSMEX/config/certs/ovictex.truststore
                 SMCI02.chn.hp.com.truststore.password=~X1~eD+6cy6OMNxdK9tcCQVBw
                 w==

                         Note

                      The keystore.password and truststore.password should use
                       <SMSSMEX_installDir>/bin/encryptPasswords.bat to encrypt. For
                      usage of encryptPasswords.bat , refer to Tools.


1.3.1.8. Licensing

This chapter describes licensing.

License Types

The following license types are available:

     InstantOn license provides full access to all features for 90 days.
     Permanent license is node-locked (restricted to a range of IP addresses).

License Management

Follow these steps to manage the license:

   1. Rename the license file to LicFile.txt.

   2. Copy and paste LicFile.txt to the SMSSMEX installation path, such as C:\Program Files
     (x86)\Micro Focus\SMSSMEX.

                   Note

                The Instance On license is installed during SMSSMEX installation. However,
                considering the Windows 2012 Security Right Control feature, the Instance On
                license may not be successfully installed during installation. In this case, you
                must manually run the InstantOn.bat batch script in the bin folder to add the
                Instance On license to SMSSMEX or to replace the license file with the
                existing license data.

Contents

     1 License Types
     2 License Management


1.3.1.9. Status Page

The Incident Management Service provides a comprehensive overview of the status of the
incident exchange systems and services and provides extensive information for
troubleshooting. The URL of the status page is

http://<hostname>:<port>/ovictex/servlet/OvHDTrigger?status

The following is an example status page.

When a service becomes unavailable, the status changes from Alive to Dead .
````
