---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.8.16 .. 1.8.17
printed_pages: 2531-2565
---

# 1.8.16 Common Access Card (CAC) sign-on

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.8.16. Common Access Card (CAC) sign-on

Starting with version 9.32, the Service Manager web client supports CAC sign-on. System Administrators can configure the
Service Manager server and web client to automatically log on using CAC authentication. CAC sign-on enables users to log in
to the web client directly with a smart card that stores a valid user certificate, and users only need to enter a card PIN,
instead of a user name and password.

            Note

           The Service Manager Windows client doesn't support CAC sign-on.

Supported smart cards

During CAC sign-on, the Service Manager web tier gets access to the user authentication public certificate and its
counterpart private key through the underlying client crypto architecture. In other words, Service Manager doesn't directly
communicate with the card reader. Technically, Service Manager supports any smart cards that store an X.509 user
authentication certificate and are designed to work with smart card middleware (such as ActivClient) that is installed on the
user's computer. The term "Common Access Card (CAC)" in its origin refers to the Unites States Department of Defense
(DoD) issued cards; however, in the Service Manager documentation the term CAC is used in a broader scope and refers to
any of the supported smart cards. Two examples of such smart cards are the Common Access Card issued by DoD and
Personal Identity Verification (PIV) cards issued by other US Government agencies.

CAC authentication

A CAC smart card enables two-factor authentication: the CARD being something you have, and the CAC PIN being something
you know. The CAC stores, in a secure way, the card holder's public certificates and its corresponding private keys. One of
those stored certificates with its private keys is used for user authentication. Service Manager uses SSL and CAC
authentication, which utilizes the certificate in the CAC card to identify the CAC card holder details and leverages the built-in
SSL user authentication abilities to ensure that the CAC owner possess the private key. The certificate key-pair proves that
this person is who the person claims to be. For example, if the certificate claims the public key is owned by userX and it was
signed by a Certificate Authority (CA), when the certificate is presented assuming Service Manager trusts the CA (which
means the CA public key is put in Service Manager's trusted CA store), Service Manager would trust the information and then
challenge the person presenting the certificate to prove the person owns the matching private key. If the person provides the
proper PIN, that private key is unlocked and then Service Manager authenticates the client as the one detailed in the
certificate.

Flexible mapping between distinguished name and login name

During CAC sign-on, a unique attribute in the user's certificate is retrieved as the user's Distinguished Name (DN) and sent to
the SM server as the user's login name.

Different organizations may have different definitions for the same attribute in the user's certificate. For example, your
organization may use employee ID for Subject.CN, while another may use user's full name for it. In addition, it is also possible
that an organization needs to use an Subject Alternative Name (SAN) sub-attribute as DN. For this reason, the Service
Manager web tier provides a configuration file ( <web tier installation path>\WEB-INF\classes\cacconf.properties ), which
contains two parameters (certificateFieldExtractDN and certificateOIDMapping) to allow flexible mapping between DN and
login name. For more information, see Example: enabling CAC sign-on.

Required configurations

CAC sign-on requires the following configurations:

     Both of the Service Manager server and web client have been configured to support CAC sign-on mode.

     Two-way SSL is configured between the web server (or the web application server if no web server) and browser.

     Two-way SSL is configured between the Service Manager server and all clients (the web and Windows clients, and web
     services clients such as Mobility, and other integrated products).


Note

Enabling CAC sign-on on the SM server side will affect all SM clients - all SM clients can only connect to the
server through two-way SSL.

     JDK 1.6 or above is installed on the host machine running the web tier.

Compatibility with other sign-on modes

The following table describes whether or not users can use other sign-on modes when CAC sign-on is enabled in the SM
server and web client.

Mode                                    Description
Basic Authentication
                                        Web client: Users can no longer log in to the web client by
                                        entering a user name and password (that is, using basic
                                        authentication). It is impossible that some web client users
                                        use CAC sign-on while some others use basic
                                        authentication. All users must use CAC sign-on.

                                        Windows client: Users can log in to the Windows client
                                        only with basic authentication, but two-way SSL
                                        authentication is required between the server and
                                        Windows client.

Trusted Sign-On (TSO)                   When both CAC sign-on and TSO are configured in the
Lightweight Single Sign-On (LW-SSO)     same web tier, CAC sign-on takes precedence. For this
                                        reason, don't enable CAC sign-on and TSO in the same
                                        web tier at the same time.

                                        The following discussion assumes a scenario where
                                        Product A (which doesn't support CAC access) is
                                        integrated with Service Manager and LW-SSO are enabled
                                        on both product sides.

                                        Outgoing LW-SSO: SM web client users can directly
                                        access product A through LW-SSO. In other words,
                                        outgoing LW-SSO from the web tier works well.

                                        Incoming LW-SSO: Incoming LW-SSO is ignored, and
                                        users can only access SM from product A with a CAC.

Conditions for CAC access

In a CAC sign-on scenario, the Service Manager server grants access to web clients only if the following conditions are met:

     The web browser from the client side sends the user certificate to the web server, and then the web server passes the
     certificate to the web application server.
     The user certificate passes the validation by the web tier.
     The user's logon credentials match an existing operator record in Service Manager or a valid LDAP source that Service
     Manager recognizes.
     The web client presents a signed SSL certificate.

                   Note

                Each Windows client must also present a signed SSL certificate to the server.


CAC connection process

The following figure depicts the connection process between a web server, a web application server, and the Service
Manager server in a CAC sign-on scenario.

The following describes how the process works:

   1. The user inserts a CAC into a card reader.
   2. The smart card middleware (such as ActivClient) automatically loads the user's personal certificate ("user certificate")

     from the CAC to the browser.
   3. The browser prompts the user to select an installed certificate to log in.
   4. The user selects the user certificate to log in.
   5. The browser prompts the user to enter the PIN of the user's CAC.
   6. The user enters the correct PIN.
   7. The web server passes the user certificate to the web application server for validation based on a pre-configured

     validation strategy, which can include any combinations of the following checks except that at least one of the following
     options must be included: using a local CRL, using an online CRL, and using the OCSP.

          • Check if the issuer is from a trusted CA (Certificate Authority)
          • Check if the certificate is revoked using a local Certificate Revocation List (CRL)
          • Check if the certificate is revoked using an online CRL
          • Check if the certificate is revoked using the Online Certificate Status Protocol (OCSP)
          • Check if the certificate has expired
          • Check if the certificate type is Smart Card
   8. The web application server extracts the Distinguished Name (DN) from the user certificate and sends the DN as the
     user's user name to the Service Manager server.


   9. The server verifies the DN against the name field in the operator table (when LDAP is not configured) or against the
     LDAP attribute mapped to this field (if LDAP is configured). If the DN value matches an operator name, the server logs
     the user in; otherwise the server rejects the login request.

Related topics

Example: enabling CAC sign-on


1.8.16.1. Requirements for CAC sign-on

This configuration is intended for customers who have an Service Manager server running in a secured environment and
want users to be able to log on to the server using a Common Access Card (CAC), without the need to enter a user name and
password.

Parameters required in sm.ini

Service Manager 9.32 or later supports CAC sign-on with two-way SSL enabled and you must set the value of the
ssl_reqClientAuth parameter to 2.
The server parameters required for CAC sign-on are listed as follows.

  cacsignon:1

  ssl:1
  sslConnector:1
  ssl_reqClientAuth:2
  keystoreFile:<servercert.keystore>
  keystorePass:<keystoreFile password>
  truststoreFile:cacerts
  truststorePass:<truststoreFile password>
  ssl_trustedClientsJKS:<trustedclients.jks>
  ssl_trustedClientsPwd:<ssl_trustedClientsJKS password>

Parameters required in web.xml

The following parameters are required in the web tier configuration file ( web.xml ):

      isCustomAuthenticationUsed=false
     Set the value to false to make Service Manager send the current user name in the HTTP header.
      CACLogin=true
     Set the value to true to enable the CAC logon mode in the web tier.

Other requirements

     Configure your web application server to enable CAC authentication. You do so by updating the web tier's application-
     context.xml file. For details, see Example: enabling CAC sign-on.
     When CAC logon is enabled in the server, you can set ssl_reqClientAuth:2 in the sm.ini file. You must then create
     unique client SSL certificates for each Service Manager client wanting to access Service Manager with CAC. For
     example, if you have 20 Service Manager Windows clients, you must create 20 unique client SSL certificates. If you
     have 4 Service Manager Web Tier servers, you must create 4 unique client SSL certificates for them. In addition, you
     need to configure SSL in the web tier configuration file ( web.xml ) and also in the Windows client Preferences setting.
     For details, see Configure two-way SSL.

                   Tip

                If maintaining these unique client SSL certificates incurs unsustainable IT operation costs, you can consider
                the use of the acceptsharedcert:1 parameter, which enables all clients to use a "shared certificate". For
                more information, see Parameter: acceptsharedcert

     CAC sign-on requires two-way SSL connections between the web server (or web application server if no web server)
     and the user's browser. You need to set up two-way SSL on the web server, or on the web application server (if you
     have no web server deployed).
     Each CAC user must have an operator record created in Service Manager.

Related topics


Parameter: acceptsharedcert


1.8.16.2. Example: enabling CAC sign-on

This example assumes that you are using Tomcat as your web application server and Apache as your web server.

Prerequisites

Before you proceed, make sure you have met the following prerequisites:

     Your organization has already a Common Access Card (CAC) security system in place; each Service Manager user
     owns a CAC card that stores the user's personal certificate ("user certificate") and you have downloaded your
     organization's CAC root CA certificate.

     Your CAC root CA certificate refers to the root CA certificate that signs the user certificates stored in the CACs. Later,
     you will need to:

           copy it to your web tier host and specify its location in the RootCertPath parameter. See Task 3: Configure the
           web tier to use CAC sign-on.
           let users import it to their web browser. See Task 7: Configure web browsers to enable web client users to use
           CAC.
     You have Keytool and OpenSSL installed on a machine on which you will generate SSL certificates.
     You have configured the web server and the web application server to use SSL. CAC sign-on requires two-way SSL
     authentication between the web server/web application server and the user's browser.For more information on
     configuring two-way SSL on your web server (Apache or IIS), see Configure two-way SSL.

Configuration Tasks

To enable CAC sign-on in your Service Manager system, complete the following tasks.

Task 1: Enable required SSL encryption and trusted clients.

Enable required SSL encryption between the SM server and Windows and web clients. For details, see Configure two-way
SSL.

When the configuration is complete, verify that you can log in to the web client as usual and log in to Windows client with SSL
encryption.

Task 2: Enable CAC sign-on in the SM server.

Set required parameters in the server configuration file ( sm.ini ). For details, see Requirements for CAC sign-on.

Task 3: Configure the web tier to use CAC sign-on.

   1. Stop the web application server running the web tier.
   2. Copy your CAC root certificate (s) to a directory on your web tier host. For example: <webtier>/WEB-INF/

   3. Set the following parameter values in the web tier's web.xml file.

Parameter                               Value
isCustomAuthenticationUsed              false
CACLogin                                true

4. Configure your web application server to use CAC as the trusted authentication source.
     1. Navigate to the <web tier installation direcotry>\WEB-INF\classes folder, and open the application-context.xml
        file in a text editor.

     2. Search for the following string:

         <sec:filter-chain pattern="/**" filters="securityContextPersistenceFilter,anonymousAuthFilter"/>

     3. Replace the search string with the following text to use CAC authentication as your trusted authentication source:

         <sec:filter-chain pattern="/**" filters="securityContextPersistenceFilter,cacFilter,

anonymousAuthFilter"/>


                      Note

                   If you also want to enable lightweight single sign-on (LW-SSO) for integrations, add cacFilter followed
                   by lwSsoFilter , as shown in the following:
                    <sec:filter-chain pattern="/**" filters="securityContextPersistenceFilter,cacFilter,

                             lwSsoFilter,anonymousAuthFilter"/>
                   Be aware that CAC sign-on can only work with outgoing LW-SSO (LW-SSO from SM to another
                   product). For information about how to enable LW-SSO in the web tier, see Configure LW-SSO in the
                   Service Manager Web tierauthenticationManager

                            <ref bean="authenticationManager"/>
                                   </property>
                                   <property name="defaultRole">
                                         <value>ROLE_PRE</value>
                                   </property>
                                   <property name="cacProps">
                                         <ref bean="cacConfiguration"/>
                                   </property>

                            </bean>
                            <bean id="cacConfiguration"
                            class="org.springframework.beans.factory.config.PropertiesFactoryBean">

                                   <property name="location"><value>classpath:cacconf.properties</value>
                            </property>
                            </bean>

     4. Save the file.
5. Configure CAC authentication in the web tier's cacconf.properties file.

     1. Open <web tier installation path>\WEB-INF\classes\cacconf.properties in a text editor.
     2. Specify the following parameters.

              Paramter: certificateFieldExtractDN
              Default: Subject.CN
              Description:
              This parameter specifies a unique attribute in the user certificate that the web application server extracts as a
              Distinguished Name (DN) and sends to the SM server as the user's user name.
              You can specify a Subject attribute in this parameter. By default, the Subject CN attribute (the certificate
              owner's Common Name) is extracted as the user's DN.
              You can also specify this parameter as one of the following Subject Alternative Name (SAN) sub-attributes:
              RFC822 Name, and Other Name (see the figure below).


     If using a sub-attribute of Other Name, specify the parameter in this format: SAN_OTHERNAME.
     <Alias> , where <Alias> is a name that you specify for the sub-attribute. The user certificate's SAN
     Other Name value that binds to the OID will be extracted as the DN. For example, if you use Other
     Name's Principal Name sub-attribute (also known as UPN, which should be mapped to OID
     "1.3.6.1.4.1.311.20.2.3"), you can specify the following value (where PrincipalName is an alias for Principal
     Name):
      certificateFieldExtractDN=SAN_OTHERNAME.PrincipalName

                   Tip

                As a best practice, avoid including white spaces in alias names. For example, for Principal
                Name, specify PrincipalName or PN as an alias.

                   Note

                Next, you will specify a mapping between the alias and object ID (OID) of the specified sub-
                attribute of SAN Other Name, by using the certificateOIDMapping parameter.

     If using the RFC822 Name sub-attribute, specify the following value:
      certificateFieldExtractDN=SAN.RFC822
Examples:

  certificateFieldExtractDN=Subject.E
  certificateFieldExtractDN=SAN_OTHERNAME.PrincipalName

Paramter: certificateOIDMapping
Default: (empty)
Description:
This parameter specifies a mapping between the <Alias> you specified in certificateFieldExtractDN and an
OID. Specify the parameter in this format: <Alias>:<OID> .
For example, for SAN's Principal Name, specify this mapping:

  certificateOIDMapping=PrincipalName:1.3.6.1.4.1.311.20.2.3

Paramter: validationStrategy
Default: (empty)
Description:


This parameter specifies how the web application server verifies each user certificate.
You can specify a combination of the following values, each of which represents a checking method:

      1 : Check the revocation status of the user certificate using a local Certificate Revocation List (CRL).
      2 : Check the revocation status of the user certificate using an online CRL.
      3 : Check the revocation status of the user certificate using the Online Certificate Status Protocol
     (OCSP).
      4 : Check if the user certificate is of the Smart Card type.
Pay attention to the following:
     You can't leave this parameter empty.
     If you specify more than one value, separate them with a comma. In this case, all specified checking
     methods are used in the sequence they are listed in the parameter.
     You must specify at least one of the following values: 1, 2, and 3. If you don't do so, users will not be
     able to log in; instead, they will see a message in their browser that states "An error has occurred"; in
     the meantime, an error message will occur in the web application server's sm.log file.
     Smart Card checking (value 4) is mandatory for CACs, because CACs are smart cards.
     You can configure CRL or OCSP checking either in your web server or in this parameter, but not in both.
Example:

  validationStrategy=3,4

Parameter: RootCertPath
Default: (empty)
Description:
This parameter specifies the file path (either absolute or relative) to the issuer's CA certificate.

            Note

           The issuer's CA certificate refers to the root CA certificate that signs the user certificates stored
           in the CACs (also referred to as the "CAC root CA certificate" in this document). If you need to
           specify multiple CAC root CA certificates, use a comma to separate them.

Example:

  RootCertPath=/WEB-INF/HPCAB.cer,/WEB-INF/HPCA.cer

Parameter: CRLDownloadURL
Default: (empty)
Description:
Specifies the URL that identifies the location of your online certificate revocation list (CRL).
You can leave this parameter empty, and then the CRL Distribution Point from the user certificate being
validated is retrieved at runtime, which might cause a slightly slower performance; however, if FIPS mode is
enabled in the web client (see FIPS mode), you must explicitly specify this parameter (can't leave it empty).
If your root CA has multi-level intermediate CAs:
If your root CA certificate specified in RootCertPath has multi-level intermediate CA certificates, you should
either specify the multi-level CRLs of the root CA and intermediate CA certificates (comma-separated), or
leave the parameter empty.
Examples:


             CRLDownloadURL=http://onsitecrl.example.com/LatestCRL.crl
             CRLDownloadURL=http://onsitecrl.example.com/LatestCRL.crl,http://onsitecrl.example.
             com/IntermediateCRL.crl

        Parameter: OCSPResponderURL
        Default: (empty)
        Description:
        Specifies the URL that identifies the location of the OCSP responder. By default, this parameter is not
        specified, and the OCSP responder location is retrieved from the user certificate being validated.
        If you specify multiple root CA certificates:
        If you specify multiple root CA certificates in RootCertPath , you must leave OCSPResponderURL empty. In
        this case, the OCSP Responder URL stored in the user certificate being validated is retrieved instead during
        runtime.
        Example:
         OCSPResponderURL=http://ocsp.example.net:80
        Parameter: CRLStoreLocation
        Default: (empty)
        Description:
        Specifies the location of your local CRL.

                      Note

                   This parameter also supports multi-level intermediate CRLs (comma-separated).

        Examples:

             CRLStoreLocation=/WEB-INF/classes/LatestCRL.crl
             CRLStoreLocation=/WEB-INF/classes/LatestCRL.crl,/WEB-
             INF/classes/IntermediateCRL.crl

3. Specify other parameters as needed.

               Note

             The validation strategy you specified determines which parameters are required, recommended, or
             optional (see the following table).


Method                                  How to Enable                        Parameters
Local CRL checking                      validationStrategy=1
Online CRL checking                     validationStrategy=2                       RootCertPath (Mandatory)
                                                                                   CRLStoreLocation
OCSP checking                           validationStrategy=3                      (Mandatory)

Smart Card checking                     validationStrategy=4                       RootCertPath (Mandatory)
                                                                                   CRLDownloadURL
                                                                                  (Recommended): If it's not
                                                                                  specified, the default URL
                                                                                  stored in the user certificate
                                                                                  is used.
                                                                                   CRLRefreshScheduler
                                                                                  (Optional): This parameter
                                                                                  specifies an interval at which
                                                                                  the online CRL stored in the
                                                                                  browser cache is refreshed.
                                                                                  The default is 1440 minutes.

                                                                                   RootCertPath (Mandatory)
                                                                                   OCSPResponderURL
                                                                                  (Recommended): If it's not
                                                                                  specified, the default URL
                                                                                  stored in the user certificate
                                                                                  is used.
                                                                                   OCSPServerCertPath
                                                                                  (Optional): This parameter
                                                                                  specifies the file path to the
                                                                                  OCSP server CA certificate. If
                                                                                  it's not specified, the
                                                                                   RootCertPath is used as the
                                                                                  certificate for the OCSP
                                                                                  server.

                                                                             No other parameters are required.

                                                                             To ensure greater security, Smart
                                                                             Card checking is required for CAC
                                                                             cards, which are smart cards.

4. Save the file.
  The following is an example configuration of the cacconf.properties file.

             certificateFieldExtractDN=Subject.CN
             certificateOIDMapping=PrincipalName:1.3.6.1.4.1.311.20.2.3
             validationStrategy=2
             RootCertPath=/WEB-INF/CA.cer
             CRLRefreshScheduler=1440
             CRLDownloadURL=http://onsitecrl.verisign.com/myCompany/LatestCRL.crl
             CRLStoreLocation=
             OCSPResponderURL=
             OCSPServerCertPath=

6. If a proxy is needed to access your OCSP responder URL or online CRL URL, configure a proxy in your web application
  server (in this example, Tomcat). You can use either of the following approaches depending on your Tomcat installation.
  To configure a proxy using the Configure Tomcat shortcut:


        1. From your operating system's Start menu, click All Programs > <Apache Tomcat> > Configure Tomcat.
        2. On the Java tab, append your proxy configuration lines to the Java Options text box. For example:

                 -Dhttp.proxyHost=<Proxy Server FQDN>
                 -Dhttp.proxyPort=<Proxy Server Port, for example, 8080>
                 -Dhttp.nonProxyHosts="<Service Manager Server Host FQDN>|<Tomcat Server Host FQDN>"

     To configure a proxy using the catalina.bat file:
        1. Open the <Tomcat>/bin/catalina.bat file in a text editor.
        2. Add the following lines:

                 set JAVA_OPTS=%JAVA_OPTS%
                 -Dhttp.proxyHost=<Proxy Server FQDN>
                 -Dhttp.proxyPort=<Proxy Server Port, for example, 8080>
                 -Dhttp.nonProxyHosts="<Service Manager Server Host FQDN>|<Tomcat Server Host FQDN>"

        3. Save the catalina.bat file.
   7. Configure Tomcat to get the client certificate from the specific request header SSL_CLIENT_CERT that's set by the

     Apache HTTP Server. Add SSLValve to the <Host> element in the <TOMCAT_HOME>/conf/server.xml file as follows.

          <Host name="localhost" ...>
             <Valve className="org.apache.catalina.valves.SSLValve" />
             ...

          </Host>

Task 4: Configure each Windows client to use SSL.

When CAC sign-on is enabled for the server and web client, the Windows client must run in SSL mode.
Do the following for each Windows client:

  1. Make sure that you have already configured SSL connection between the server and the Windows client. See Task 1:
     Enable required SSL encryption and trusted clients.

   2. Open a client connection.
   3. On the Advanced tab, select Use SSL Encryption, and click Apply.

Task 5: Connect your web application server to the web server.

First, connect Tomcat to Apache. Refer to Configure a web server to redirect requests to the web tier for detailed instructions.
Next, configure the web server and the web application server to use SSL. CAC sign-on requires two-way SSL authentication
between the web server/web application server and the user's browser. For more information on configuring two-way SSL on
your web server (Apache or IIS), see Configure two-way SSL.
If the Apache HTTP Server connects to Tomcat by using the AJP protocol, you need to configure the Apache HTTP Server to
require the client to present a valid certificate. For example, add the following additional settings to the
<APACHE24_HOME>/conf/extra/httpd-ahssl.conf file.

  <Location "/webtier">
      SSLVerifyClient require

  </Location>

If the Apache HTTP Server connects to Tomcat by using the HTTPS protocol, you need to configure the Apache HTTP Server
to require the client to present a valid certificate and configure the Apache HTTP Server to forward the client certificate to the
backend Tomcat through the SSL_CLIENT_CERT request header. For example, add the following additional settings to the
<APACHE24_HOME>/conf/extra/httpd-ahssl.conf file.


<Location "/webtier">
   SSLVerifyClient require
   SSLOptions +ExportCertData
   RequestHeader set SSL_CLIENT_CERT "%{SSL_CLIENT_CERT}s"
   ...

</Location>

Note: Make sure the mod_headers modules are loaded in the <APACHE24_HOME>/conf/httpd.conf file.

Task 6: Create operator records for CAC users.

The web server extracts information from the user certificate based on the certificateFieldExtractDN value defined in the
<web tier installation path>\WEB-INF\classes\cacconf.properties file.

You must create an operator record for each CAC user. The configuration varies depending on whether Lightweight Directory
Access Protocol (LDAP) is enabled on the SM server or not.

If LDAP is disabled for the SM server

For each CAC user certificate, create an operator record whose Login Name ( operator.name ) field has the same value as
the distinguished name (DN) value in the certificate.

See the following table for an example, which indicates that you need to create an operator record whose Login Name is the
email address stored in the user certificate.

In the cacconf.properties file          In the user certificate  In the operator record

certificateFieldExtractDN=Subject.E     Subject.E=jack.smith@mycompany.co Login
(DN=certificate owner's email
address)                                m                        Name=jack.smith@mycompany.com

If LDAP is enabled for the SM server

Configure LDAP mapping for the operator and contacts tables, and make sure that the operator.name and
contacts.operator.id fields are mapped to the same LDAP attribute that corresponds to the certificate attribute defined in
certificateFieldExtractDN .

The following table lists the fields in the operator and contacts tables that you must map to an LDAP attribute.

            Note

           The LDAP attribute names here are provided only as an example, which may differ from your actual mappings. In
           this example, both of the name field in the operator table and the operator.id field in the contacts table are
           mapped to the sAMAccountName attribute, which corresponds to the user certificate attribute defined in
           certificateFieldExtractDN .

Field Name                                 operator file
contact.name
full.name                                        LDAP Attribute Name
name                                              cn
                                                  cn
                                                  sAMAccountName


Field Name                                          contacts file
contact.name
first.name                                                 LDAP Attribute Name
full.name                                                  cn
last.name                                                  givenName
operator.id                                                cn
                                                           sn
                                                           sAMAccountName

For details about LDAP configuration, see the Service Manager LDAP Best Practices Guide.

Task 7: Configure web browsers to enable web client users to use CAC sign-on.

Before a user can log on with a CAC, the CAC root CA certificate(s), the root CA certificate generated during your web server
(or web application server) SSL configuration, as well as the user's personal certificate must be installed in the user's
browser.

When users insert their CACs, the browser automatically loads their personal certificates. Users only need to manually install
the root CA certificates to Windows Certificate Store.

Follow these steps:

   1. Right-click your CAC root CA certificate (CAC_ca.crt), and then click the Install Certificate menu to launch the
     certificate import wizard.

   2. Select the Local Machine option for the store location, then click the Next button.
   3. Select the Place all certificates in the following store option, and then click the Browse button. Sselect the Trusted

     Root Certification Authorities from the prompted dialog.
   4. Click the Next button, the click the Finish button to finish the wizard.

For Firefox, you need to perform the following additional steps to let Firefox use the Windows Trusted Root Certification
Authorities.

   1. Navigate to the about:config URL to open the settings editor page.
   2. Set the security.enterprise_roots.enabled option to true.

Task 8: Test your CAC sign-on setup.

   1. Start the Service Manager server, the web server and the web application server (in this example, Apache and Tomcat).

   2. Verify that you can log in to the web client with your CAC.

        1. Open the web tier login URL in your browser:

  http://<Your Apache Host FQDN>:<port>/<webtier>/index.do

or if you have no Apache but only Tomcat deployed:

      http://<Your Tomcat Host FQDN>:<port>/<webtier>/index.do

  The system prompts you to select a certificate from a list of the certificates installed in your browser.
2. Insert your CAC. The browser automatically loads your personal certificate.

               Note

             At your first CAC login, a browser refresh might be needed to make your personal certificate appear in
             the list.

3. Select your personal certificate from the list.


        4. Enter your CAC PIN when prompted.
           Service Manager automatically logs you in.

     CAC sign-on is now successfully set up in your web tier.
   3. Verify that you can log in to the Windows client through SSL encryption.

        1. Start the Windows client, and check that the Use SSL Encryption option is enabled.
        2. Enter a valid username and password to log in.

           Service Manager logs you in successfully. Two-way SSL is successfully set up in your Windows client.
Now, your CAC sign-on setup is complete.

Related topics

Common Access Card (CAC) sign-on
Requirements for CAC sign-on


1.8.17. Configure IdM authentication in Service Manager

To integrate with the IdM service, you must have an IdM service available.

     In the classic mode (a standalone Service Manager system without integrating with the SMA Service Portal), install a
     standalone IdM service first. For detailed instructions, see Install Identity Manager (IdM).
     In the mixed mode (SMA-SM, a Service Manager system that integrates with the SMA Service Portal), you don't need to
     install the standalone IdM service. Instead, leverage the IdM service deployed in the SMA suite and then integrate
     Service Manager with the IdM service.

Typically, you will deploy a reverse proxy (Apache HTTP Server or IIS) or a hardware load balancer on top of the IdM service
in the production environment. This section uses the Apache HTTP Server as an example for the reverse proxy and assumes
the reverse proxy URL is https://apache.yourdomain.net. The later tasks use this sample reverse proxy URL and you need to
replace it with the actual URL in your environment.

Compatibility with legacy LW-SSO

The IdM authentication is compatible with the legacy LW-SSO solution. If the IdM authentication is enabled in Service
Manager, and another legacy application has legacy LW-SSO enabled, users can access either product from the other
product without the need to enter a user name and password.

            Caution

                The IdM service generates a LWSSO_COOKIE_KEY cookie and can also authenticate a user using tokens in
                the cookie, which makes it compatible with the legacy LW-SSO solution. As a result of this, other web
                applications that have legacy LW-SSO enabled can still get integrated by using LW-SSO. Note that the web
                tier doesn't renew the LW-SSO cookie now when the IdM authentication is enabled. If you want to support
                LW-SSO compatibility with other products, you need to set the expiration period of the LW-SSO token to a
                long time in the global settings of the IdM admin console (for example, 480 minutes).
                The Service Manager Server can have both IdM authentication and LW-SSO enabled if needed. This allows
                other applications of the company to access the SM Server through LW-SSO when necessary.
                If both LW-SSO and the IdM authentication are enabled in the Service Manager server, you only need to
                enable the IdM authentication in the Service Manager web tier or Mobility client. Do not enable LW-SSO in
                these clients at the same time.

            Note

           The LW-SSO compatibility has the following limitations.

                For backend integration, legacy applications using legacy LW-SSO must share an LDAP server with Service
                Manager. Otherwise, you need to synchronize users between legacy applications and Service Manager by
                using external tools. Legacy applications may use a dedicated integration user to log in to Service Manager,
                and you can either add the integration user to the LDAP directory service or add the user to Service
                Manager directly.
                For UI-based SSO, legacy applications using legacy LW-SSO and Service Manager (server, web tier, and
                Mobility) must be in the same domain as the IdM service. This is because the IdM service needs to read the
                LW-SSO cookie written by the applications. Legacy applications and the IdP must share an LDAP server, or
                you need to synchronize users between legacy applications and the IdP by using external tools. Depending
                on the authentication type you configured in the IdM service, the IdP can be the IdM service itself for the DB
                authentication or the LDAP authentication, or ADFS for SAML-based SSO, or Keycloak for OIDC-based SSO.

Related topics

Configure IdM authentication in the Service Manager server
Configure IdM authentication in the Service Manager web tier
Configure IdM authentication in the Mobility client
Configure IdM authentication in Collaboration
Configure IdM parameters


1.8.17.1. Configure IdM authentication in the Service Manager
Server

To enable IdM authentication in the Service Manager Server, stop the Service Manager server and then add the IdM-related
parameters to the <SM_SERVER>/RUN/sm.ini file as follows.
If you set Signature Algorithm as HS256 in IdM administration console:

  idmssoenabled:1
  idmtenant:SM
  idmsigningkey:<your IdM signing key>

If you set Signature Algorithm as RS256 in IdM administration console:

  idmssoenabled:1
  idmtenant:SM
  idmendpoint:https://apache.yourdomain.net/idm-service
  idmhttpuser:idmTransportUser
  idmhttppassword:<your password of idmTransportUser>
  idmssltrustall:0
  idmtruststore:smrootca.p12
  idmtruststorepassword:<your password of smrootca.p12>
  idmtruststoretype:pkcs12

            Note

                For more details about the IdM-related parameters, see IdM parameters for the Service Manager server.
                For more information about how to set the appropriate values for common IdM parameters, see How to get
                IdM-related settings.

Next, set up user synchronization by using either IdM or LDAP.

            Caution

                Don't set up user synchronization from both IdM and LDAP. Otherwise, performance issues may occur
                during user login.
                If you configured SAML-based Single Sign-On and selected User-Principal-Name (instead of SAM-
                Account-Name documented in step 10.b of Create a trusted relying party in ADFS) as LDAP Attribute, you
                need to do the following:
                - Synchronize users from LDAP.
                - Set the ldapquerymapping:samAccountName=userPrincipalName parameter in sm.ini. See Startup
                parameter: ldapquerymapping for details.
                - Make sure that the user.principal.name field of operator is mapped to userPrincipalName when you
                Define file and field-level mappings to an LDAP server.

Synchronize users from IdM

Add IdM parameters

You need to add additional IdM parameters to connect to the IdM service. For example:


  idmsyncuser:1
  idmendpoint:https://apache.yourdomain.net/idm-service
  idmhttpuser:idmTransportUser
  idmhttppassword:<your password of idmTransportUser>
  idmssltrustall:0
  idmtruststore:smrootca.p12
  idmtruststorepassword:<your password of smrootca.p12>
  idmtruststoretype:pkcs12

Now start the Service Manager server and log on to the Windows client to perform the next tasks.

Create operator template

You need to create an operator template named "Template_IdM", which will be applied to the newly synced users.
See Create an operator template for detailed instructions.

            Note

                If you don't create the Template_IdM template, the newly synced users will be assigned with the self-service
                user role.
                The name of the operator template must be set as "Template_IdM".
                The "Template_IdM" template is not applicable for the existing users.
                See Create an operator record from a operator template for more information.

Configure attribute mapping

You need to define how to synchronize the IdM user attributes to Service Manager by configuring attribute mapping. Service
Manager provides the out-of-box mappings for some basic IdM user attributes. You can customize the attribute mappings
except the contact.name field.

   1. From the System Navigator, click System Administration > Ongoing Maintenance > System > IdM Mapping.
   2. The mappings for Operator table and Contact table are displayed.
   3. You may click on an existing attribute mapping to update the value, or add new mappings as required.
   4. Save the changes.

            Important

           Here is the priority order of the IdM mapping, the Template_IdM template, and the existing user attributes:
           IdM mapping > existing user attributes > Template_IdM template
           This means the IdM attributes mapped to Service Manager can overwrite the values defined in the Template_IdM
           template and the existing user attributes. Hence, you need to be careful when configuring the attribute mappings.


File                                    Field name     IdM attribute name
operator                                Contact Name   username
                                        Email          email
contacts                                Contact Name   username
                                        Email          email
                                        First Name     firstname
                                        Last Name      familyName
                                        Contact Phone  mobilePhoneNumber
                                        Postcode       code
                                        Language       language

IdM user attributes are populated from the external IdP (for example, Keycloak) and all user attributes in the userinfo (such as
defined by mappers in Keycloak) are synchronized to IdM. Some attributes are mapped by the IdM and get new names in
IdM, whereas other attributes keep their original names. For example:

Attribute name in userinfo  Mapped by IdM              IdM attribute name  IdM display name
preferred_username          Yes                        username            Username
given_name                  Yes                        firstName           First Name
family_name                 Yes                        lastName            Family Name
middle_name                 Yes                        middleName          Middle Name
phone_number                Yes                        mobilePhoneNumber   Mobile Phone Number
claims_locales              Yes                        language            Language
address                     Yes                        location            Location
email                       Yes                        email               User Email
custom_attr1                No                         custom_attr1

Synchronize users from LDAP

First, edit sm.ini to add necessary LDAP parameters. See LDAP parameters for more details.

Next, start the Service Manager server and log on to the Windows client to enable an integration to LDAP.

Related topics

SAML Single Sign-On
IdM parameters for the Service Manager server


1.8.17.2. Configure IdM authentication in the Service Manager
web tier

To enable Identity Manager (IdM) authentication in the web tier, you need to edit the <customize-
folder>/config/webtier.properties file if you have configured the customize-folder parameter, or edit the <WEBTIER>/WEB-
INF/webtier.properties if you haven't configured the customize-folder parameter. Add IdM related settings and set the
isCustomAuthenticationUsed parameter to false . For more information, see IdM parameters for the Service Manager web
tier and mobility client.
See the following configuration as an example:

  idm.sso.enabled=true
  idm.tenant=SM
  idm.token.signingKey=<your IdM signing key>
  idm.cookieName=IDM_AUTH_TOKEN

  idm.endpoint=https://apache.yourdomain.net/idm-service
  idm.http.user=idmTransportUser
  idm.http.password=<your password for the idmTransportUser user>

  idm.truststore=<customize-folder>/config/smrootca.p12 or /WEB-INF/smrootca.p12
  idm.truststore.password=<your password of smrootca.p12>
  idm.truststore.type=pkcs12

  idm.returnUri=https://apache.yourdomain.net/webtier

  isCustomAuthenticationUsed=false

For more information about how to set the appropriate values for common IdM parameters, see How to get IdM-related
settings.

            Note

                If there is no reverse proxy of load balancer exists on top of the web tier, you don't need to configure
                the idm.returnUri parameter.
                You MUST NOT enable LW-SSO at the same time. You need to revert the LW-SSO configuration if you have
                enabled LW-SSO before.

Related topics

SAML Single Sign-On


1.8.17.3. Configure IdM authentication in the Mobility Client

To enable Identity Manager (IdM) authentication in the Mobility client, you need to edit the <MOBILITY>/WEB-
INF/web.properties file and add IdM related settings. For more information, see IdM parameters for the Service Manager web
tier and mobility client.
See the following configuration as an example:

  idm.sso.enabled=true
  idm.tenant=SM
  idm.token.signingKey=<your IdM signing key>

  idm.endpoint=https://apache.yourdomain.net/idm-service
  idm.http.user=idmTransportUser
  idm.http.password=<your password for the idmTransportUser user>

  idm.ssl.trustAll=false

  idm.truststore=/WEB-INF/smrootca.p12
  idm.truststore.password=<your password of smrootca.p12>
  idm.truststore.type=pkcs12

  idm.returnUri=https://apache.yourdomain.net/mobility

  isCustomAuthenticationUsed=false

For more information about how to set the appropriate values for common IdM parameters, see How to get IdM-related
settings.

            Note

                If there is no reverse proxy of load balancer exists on top of the web tier, you don't need to configure
                the idm.returnUri parameter.
                You MUST NOT enable LW-SSO at the same time. You need to revert the LW-SSO configuration if you have
                enabled LW-SSO before.

Related topics

SAML Single Sign-On


1.8.17.4. Configure IdM authentication in Collaboration

You only need to update the chat server and chat service file to enable Identity Manager (IdM) authentication in Service
Manager Collaboration.

Enable IdM authentication in the chat server

To enable IdM authentication in the chat server, edit the <CHAT_SERVER>/conf/openfire.xml file. See the following
configuration as an example:

  <idmConfig>
      <ssoEnabled>true</ssoEnabled>
      <tokenSigningKey>your IdM signing key</tokenSigningKey>
      <cookieName>IDM_AUTH_TOKEN</cookieName>
      <tenant>SM</tenant>
      <endpoint>https://apache.yourdomain.net/idm-service</endpoint>
      <integrationUser>idmTransportUser</integrationUser>
      <integrationPassword>your password</integrationPassword>
      <trustAll>false</trustAll>
      <trustStorePath>../resources/security/smrootca.p12</trustStorePath>
      <trustStorePassword>caroot</trustStorePassword>
      <trustStoreType>pkcs12</trustStoreType>

  </idmConfig>

For more information, see IdM Parameters for Service Manager Collaboration.
For more information about how to set the appropriate values for common IdM parameters, see How to get IdM-related
settings.

Enable IdM authentication in the chat service

To enable IdM authentication in the chat service, edit the <CHAT_SERVICE>/conf/app.properties file. See the following
configuration as an example:

  idmConfig.ssoEnabled=true
  idmConfig.tokenSigningKey=<your IdM signing key>
  idmConfig.cookieName=IDM_AUTH_TOKEN
  idmConfig.tenant=SM
  idmConfig.endpoint=https://apache.yourdomain.net/idm-service
  idmConfig.integrationUser=idmTransportUser
  idmConfig.integrationPassword=<your password>
  idmConfig.trustAll=false
  idmConfig.trustStorePath=../conf/smrootca.p12
  idmConfig.trustStorePassword=caroot
  idmConfig.trustStoreType=pkcs12

For more information, see IdM Parameters for Service Manager Collaboration.

Related topics

SAML Single Sign-On
How to get IdM-related settings.


1.8.17.5. Configure IdM parameters

This topic describes the IdM-related parameters as well as where to get the IdM-related settings.

IdM parameters for the Service Manager server

For the Service Manager server, you can define the IdM parameters in the <SM_SERVER>/RUN/sm.ini file.

Parameter                                                  Idm parameters                           Service Manager 9.81
idmssoenabled
idmsigningkey                           Default value                      Description
                                        0
idmtenant                               N/A                                Specifies if IdM SSO is enabled for the
                                                                           Service Manager Server.
idmsyncuser                             N/A
idmendpoint                                                                Specifies the IdM signing key that is
                                        0                                  used to verify the IdM tokens. This
                                        N/A                                value must match the value that is
                                                                           configured in the IdM service.

                                                                                       Note

                                                                                      This value is automatically
                                                                                      encrypted after the Server
                                                                                      is started. If you need to
                                                                                      update the value later,
                                                                                      remove the asterisk
                                                                                      symbol (*) before the
                                                                                      parameter name.

                                                                           The tenant in which all Service
                                                                           Manager user accounts reside. This
                                                                           value must match the tenant you
                                                                           created for the Service Manager in the
                                                                           IdM service.

                                                                                       Note

                                                                                      If you don't specify this
                                                                                      value, the server will not
                                                                                      verify the tenant in the
                                                                                      IdM auth token.

                                                                           Specifies whether to sync user from
                                                                           IdM or not.
                                                                           To synchronize users from IdM, set
                                                                           this parameter to 1. Otherwise, keep
                                                                           the default value (0).

                                                                           This is the absolute URL of the IdM
                                                                           service.

Parameter                               Default value                           Service Manager 9.81
                                        N/A
idmhttpuser                                            Description
idmhttppassword
                                                       This is the integration user account
idmssltrustall                          0              used to access the IdM service.

idmtruststore                           N/A                        Note

idmtruststorepassword                                             The value of the
                                                                 idmhttppassword
idmtruststoretype                       N/A                       parameter is automatically
                                                                  encrypted after the
                                                                  Service Manager server
                                                                  starts. If you need to
                                                                  update the value later,
                                                                  remove the asterisk
                                                                  symbol (*) before the
                                                                  parameter name.

                                                       Indicates whether to verify that the
                                                       IdM server certificate is trusted. To
                                                       verify the IdM server certificate, keep
                                                       the default value (0).

                                                       This is the IdM client trust store and
                                                       password. The IdM client uses this
                                                       truststore to validate the IdM server
                                                       certificate.

                                                                   Note

                                                                  You must specify these
                                                                  two parameters if the
                                                                 idmssltrustall parameter is
                                                                  set to 0.

                                                                  The value of the
                                                                 idmtruststorepassword
                                                                  parameter is automatically
                                                                  encrypted after the
                                                                  Service Manager server
                                                                  starts. If you need to
                                                                  update the value later,
                                                                  remove the asterisk
                                                                  symbol (*) before the
                                                                  parameter name.

                                                       This is the IdM client trust store type.
                                                       Values for this parameter include JKS,
                                                       PKCS12, and BCFKS.

Parameter                               Default value                           Service Manager 9.81
                                        N/A
idmkeystore                                            Description
idmkeystorepassword
                                                       This is the IdM client keystore and
                                                       password. You must set a value for
                                                       this parameter if the IDM service
                                                       validates the client certificate.

                                                                   Note

                                                                  The value of the
                                                                 idmkeystorepassword
                                                                  parameter is automatically
                                                                  encrypted after the
                                                                  Service Manager server
                                                                  starts. If you need to
                                                                  update the value later,
                                                                  remove the asterisk
                                                                  symbol (*) before the
                                                                  parameter name.

idmkeystoretype                         N/A            This is the IdM client keystore type.
                                                       Values for this parameter include JKS,
                                                       PKCS12, and BCFKS.

IdM parameters for the Service Manager web tier and mobility client

For the Service Manager web tier, you can define the IdM parameters in the <customize-folder>/config/webtier.properties
file if you have configured the customize-folder parameter, or in the <WEBTIER>/WEB-INF/webtier.properties if you
haven't configured the customize-folder parameter.

For the Service Manager mobility client, you can define the IdM parameters in the <MOBILITY>/WEB-INF/web.properties
file.

Parameter                                                  IdM parameters                           Service Manager 9.81
idm.sso.enabled
                                        Default value                      Description
idm.authGroupName                       false
                                                                           Indicates if IdM SSO is enabled. To
                                        N/A                                enable IdM SSO, set this parameter to
                                                                           true.
idm.tenant                              N/A
                                                                           Specifies the authentication group to
idm.token.signingKey                    N/A                                authenticate users. If you don't
                                                                           specify this value, the system uses
idm.refreshBeforeExpiration             300000                             the default authentication group.
idm.cookieName                          IDM_AUTH_TOKEN                     It can be overwritten by the auth URL
                                                                           parameter, the precedence order is:
idm.endpoint                            N/A
                                                                                The auth URL parameter
This PDF was generated on May 23, 2026                                          The idm.authGroupName
                                                                                parameter
                                                                                The default authentication group

                                                                           For example, you can sign in to the
                                                                           web tier by using the
                                                                           https://apache.yourdomain.net/webtie
                                                                           r/index.do?auth=db URL. This URL
                                                                           uses the database authentication
                                                                           group even if the default
                                                                           authentication group is SAML or
                                                                           OAuth.

                                                                           The tenant in which all Service
                                                                           Manager user accounts reside. This
                                                                           parameter value must match the
                                                                           tenant configured on the IdM service
                                                                           side.
                                                                           You can find the tenant configuration
                                                                           in Install Identity Manager (IdM).

                                                                           Specifies the IdM signing key that is
                                                                           used to verify the IdM tokens. This
                                                                           value must match the value that is
                                                                           configured in the IdM service.

                                                                           Specifies when to refresh the token
                                                                           before it expires. The unit is
                                                                           millisecond.

                                                                           The cookie name of the IdM auth
                                                                           token.
                                                                           This parameter is only available for
                                                                           the web tier.

                                                                           This is the absolute URL of the IdM
                                                                           service.

                                                                                                                        Page 143 of 251
Parameter                               Default value                           Service Manager 9.81
idm.http.user                           N/A
idm.http.password                       false          Description
idm.ssl.trustAll
                                        N/A            This is the integration user account
idm.truststore                                         used to access the IdM service.
idm.truststore.password
                                                       Indicates whether to verify that the
idm.truststore.type                     N/A            IdM server certificate is trusted. To
                                                       verify the IdM server certificate, keep
idm.keystore                            N/A            the default value (false).

idm.keystore.password                                  This is the IdM client trust store and
                                                       password. The IdM client uses this
idm.keystore.type                       N/A            truststore to validate the IdM server
                                                       certificate.

                                                                   Note

                                                                  You must specify these
                                                                  two parameters if the
                                                                  idm.ssl.trustAll parameter
                                                                  is set to false.

                                                       This is the IdM client trust store type.
                                                       Values for this parameter include JKS,
                                                       PKCS12, and BCFKS.

                                                                   Note

                                                                  You can ignore this
                                                                  parameter if the IdM client
                                                                  trust store type is the
                                                                  same as the web client
                                                                  keystore type.

                                                       This is the IdM client key store and
                                                       password.

                                                       This is the IdM client key store type.
                                                       Values for this parameter include JKS,
                                                       PKCS12, and BCFKS.

                                                                   Note

                                                                  You can ignore this
                                                                  parameter if the IdM client
                                                                  key store type is the same
                                                                  as the web client keystore
                                                                  type.

Parameter                               Default value                           Service Manager 9.81
idm.returnUri                           N/A
                                                       Description

                                                       The absolute URL of the Web client to
                                                       which the IdM service will return after
                                                       successful authentication. It must not
                                                       contain the servlet path (*.do).

                                                       For example,
                                                       https://apache.yourdomain.net/webtie
                                                       r.

                                                                   Note

                                                                  You must configure this
                                                                  parameter if there is a
                                                                  reverse proxy or a load
                                                                  balancer on top of the
                                                                  web tier or mobility.

idm.backAppOnLogout                     true           Determines whether to return to the
                                                       Web client goodbye page after sign
                                                       out when SAML is enabled.

                                                                   Note

                                                                  This parameter is
                                                                  obsoleted from 9.80.p1.

IdM parameters for Service Manager Collaboration

For the chat server, you can define the IdM parameters in the <idmConfig> element in the
<CHAT_SERVER>/conf/openfire.xml file.


Parameter                                                  IdM parameters  Description
ssoEnabled
tokenSigningKey                         Default value                      Indicates if IdM SSO is enabled. To
                                        false                              enable IdM SSO, set this parameter to
cookieName                                                                 true .
                                        N/A
                                                                           Specifies the IdM signing key that is
                                        IDM_AUTH_TOKEN                     used to verify the IdM tokens. This
                                                                           value must match the value that is
                                                                           configured in the IdM service.

                                                                           The cookie name of the IdM auth
                                                                           token.

tenant                                  N/A                                The tenant in which all Service
                                                                           Manager user accounts reside.

                                                                           Note: If not specified, the chat server
                                                                           will not verify the tenant in the IdM
                                                                           auth token.

endpoint                                N/A                                Specifies the integration endpoint.
integrationUser                         N/A
integrationPassword                     N/A                                Specifies the integration user.
trustAll                                false
                                                                           Specifies the integration password.
trustStorePath                          N/A
trustStorePassword                      N/A                                Specifies whether to trust
                                                                           all certificates.
trustStoreType                          pkcs12
                                                                           Specifies the path to the keystore file.

                                                                           Specifies the password of the trust
                                                                           store.

                                                                           Specifies the type of the trust store.

For the chat service, you can define the IdM parameters in the <CHAT_SERVICE>/conf/app.properties file.


Parameter                                                  IdM parameters  Description
idmConfig.ssoEnabled
idmConfig.tokenSigningKey               Default value                      Indicates if IdM SSO is enabled. To
                                        false                              enable IdM SSO, set this parameter to
idmConfig.cookieName                                                       true .
                                        N/A
                                                                           Specifies the IdM signing key that is
                                        IDM_AUTH_TOKEN                     used to verify the IdM tokens. This
                                                                           value must match the value that is
                                                                           configured in the IdM service.

                                                                           The cookie name of the IdM auth
                                                                           token.

idmConfig.tenant                        N/A                                The tenant in which all Service
                                                                           Manager user accounts reside.

                                                                           Note: If not specified, the chat service
                                                                           will not verify the tenant in the IdM
                                                                           auth token.

idmConfig.endpoint                      N/A                                Specifies the integration endpoint.

idmConfig.integrationUser               N/A                                Specifies the integration user.

idmConfig.integrationPassword           N/A                                Specifies the integration password.

idmConfig.trustAll                      false                              Specifies whether to trust all
                                                                           certificates.

idmConfig.trustStorePath                ../conf/smrootca.p12               Specifies the path to the keystore file.

idmConfig.trustStorePassword            N/A                                Specifies the password of the trust
                                                                           store.

idmConfig.trustStoreType                PKCS12                             Specifies the type of the trust store.

How to get IdM-related settings

Classic mode

The classic mode refers to a standalone Service Manager system that doesn't integrate with the SMA Service Portal.

Get the tenant

Use the name of the CONSUMER tenant you created when installing the IdM service.

Get the signing key

The signing key is the value you specified for the idm.encryptedSigningKey in the
system_resource_config__1.0.0.1__update_signingKey_and_initString.json seeded file when installing the IdM service. You
can also get the signing key from the IdM Admin Console. Go to SYSTEM SETTINGS, double-click the Encrypted signing key
property, and then check the value in the edit dialog.

Get the cookie name of the auth token

Use the default cookie name IDM_AUTH_TOKEN .

Get the service endpoint

Use the URL exposed by the reverse proxy or the load balancer (for example, https://apache.yourdomain.net/idm-service). If
there is no reverse proxy or load balancer on top of the IdM service, use the URL exposed by Tomcat (for example,


https://idmservice.yourdomain.net:8443/idm-service).
Get the password of idmTransportUser
The password is the value you entered in the Password field for the integration user when you created the SM tenant in the
IdM service.
Get the client truststore
Import your corporate root CA that issues the server certificate for the reverse proxy or the load balancer to a truststore by
using the certificate generation toolkit (for example, corprootca.p12 ). Use this truststore as the IdM client truststore.

  import-cert.bat --alias corprootca --file <your corporate root CA cert file> --keystore
  certs/corprootca.p12 --storepass <your password for corprootca.p12>

If you use the Service Manager private root CA to sign the server certificate for the reverse proxy in the dev environment, or
there is no reverse proxy or load balancer on top of the IdM service, use the smrootca.p12 as the IdM client truststore.

Mixed mode (SMA-SM)

The mixed mode refers to a Service Manager system that integrates with the SMA Service Portal.
Get the tenant
Use the ID of the Service Manager tenant you created when installing the SMA Service Portal and setting up the integration.
Get the signing key
If your SMA version is before 2023.05:
Get the signing key from Suite Administration. Go to CONFIGURATIONS > Security, and then check the value of the Signing
key field under IDM configuration.

If your SMA version is 2023.05 or higher, follow the steps below to get the IDM signing key:
   1. Log in to a control plane node or a worker node of SMA as the root or a sudo user.
   2. Run the following command to get the name of the bo-config pod:

          BO_CONFIG_POD=$(echo `kubectl get pods -n <SMA namespace> | grep -m1 itom-bo-config- | head
          -1 | awk '{print $1}'`) && echo $BO_CONFIG_POD

   3. Run the following command to get the IdM signing key:

          SIGNING_KEY=$(kubectl exec -it $BO_CONFIG_POD -n <SMA namespace> -c itom-bo-config -- bash
          -c "/bin/get_secret idm_token_signingkey_secret_key" | awk -F= '{print$2}') && echo
          $SIGNING_KEY

Get the cookie name of the auth token
Use the same cookie name defined by the SMA suite. For example, SMAX_AUTH_TOKEN .
Get the service endpoint
Use the URL exposed by the SMA suite. For example, https://smax.yourdomain.net/idm-service.
Get the password of idmTransportUser
Follow these steps to get the password of idmTransportUser :

   1. Sign in to one control plane node of SMA as root or a sudo user.
   2. Run the following command to identify the pod name for IdM.

          kubectl get pod -n <namespace> | grep ^idm

   3. Run the following command to go into the IdM pod.


          kubectl exec -it <pod-name> -n <namespace> -c idm -- /bin/sh

   4. Run the following command to get the password of the transport user.

          get_secret idm_transport_user_password_secret_key

   5. Exit the pod.
Get the client truststore
Follow these steps to get the client truststore:

  1. Refer to the Get the suite CA certificate topic in the Service Management Automation - SM (SMA-SM) Help Center and
     get the SMA suite CA certificate ( <SMA cert file> ).

   2. Import the SMA suite CA certificate to a truststore by using the certificate generation toolkit (for example,
      suiterootca.p12 ), and then use this truststore as the IdM client truststore.

          import-cert.bat --alias suiterootca --file <SMA cert file> --keystore certs/suiterootca.p12
          --storepass <your password for suiterootca.p12>
````
