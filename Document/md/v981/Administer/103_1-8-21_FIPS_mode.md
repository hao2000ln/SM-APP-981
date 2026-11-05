---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.8.21 .. 1.8.21.4
printed_pages: 2592-2624
---

# 1.8.21 FIPS mode

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.8.21. FIPS mode

FIPS (Federal Information Processing Standards) are a set of standards that describe document processing, encryption
algorithms and other information technology standards for use within U.S. non-military government agencies and by U.S.
government contractors and vendors who work with the agencies.

FIPS 140-2, “Security Requirements for Cryptographic Modules,” was issued by the U.S. National Institute of Standards and
Technology (NIST) in May, 2001. The standard specifies the security requirements for cryptographic modules utilized within a
security system that protects sensitive or valuable data.

For FIPS 140-2 compliance, Service Manager (SM) supports the implementation of FIPS validated AES-256 data encryption,
TLS connections and Lightweight Single Sign-On (LW-SSO), and FIPS compliant random number generation algorithms.

The following table describes two operation modes of the Service Manager server and clients.

Operation mode                          Description                             Notes

FIPS mode                               Supports FIPS 140-2 compliant
(FIPS 140-2 compliant mode)             cryptographic functions.

Non-FIPS mode                           Utilizes existing cryptography without
(Non-FIPS 140-2 compliant mode)         the 3rd-party FIPS 140-2 validated
                                        cryptographic modules.

In FIPS mode, Service Manager supports the same authentication methods as in non-FIPS mode. See the following table.

Authentication  Windows Client          Web Client   Mobility Client Chat Server       Chat Service
mechanism                               Yes                                            No

Password-based Yes                      Yes          Yes                        No
mechanism (local                        Yes
and LDAP)                               Yes

Trusted Sign-On Yes                     Yes          Yes                        No     No
(TSO)                                   Yes

LW-SSO          No                                   Yes                        Yes    Yes

X.509 certificate No                                 No                         No     No
authentication
(CAC)

SAML-based      No                                   Yes                        Yes    Yes

SSO

OIDC-based SSO No                                    Yes                        Yes    Yes

Service Manager provides a set of parameters or options that determine whether the SM Server and other components are
running in FIPS mode. See the following table.


Component                               Parameter or option                Description
SM Server                               fipsmode
                                                                           Must be set to one of the following
                                                                           values to indicate whether the
                                                                           SM Server runs in FIPS mode:

                                                                                0 (default): non-FIPS mode
                                                                                2: FIPS mode

Windows Client                          The FIPS Mode checkbox in the      Determines whether the Windows
                                        Preferences window                 Client runs in FIPS mode:

                                                                                Selected: FIPS mode
                                                                                Unselected (default): non-
                                                                                FIPS mode

Web Tier                                The "fipsMode" parameter in the    Must be set to one of the following
                                        <Web Tier>/WEB-                    values to indicate whether the Web
                                        INF/webtier.properties file        Tier runs in FIPS mode:

                                                                                false (default): non-FIPS mode
                                                                                true: FIPS mode

Mobility Client                         The "fipsMode" parameter in the    Must be set to one of the following
                                        <Mobility Client>/WEB-             values to indicate whether the
                                        INF/webtier.properties file        Mobility Client runs in FIPS mode:

                                                                                false (default): non-FIPS mode
                                                                                true: FIPS mode

Chat Server                             The "fipsmode" parameter in the    Must be set to true or false to indicate
                                        <Openfire_home>/conf/openfire.xml  whether the Chat Server runs in
                                        file                               FIPS mode:

                                                                                <fipsmode>false</fipsmode>:
                                                                                non-FIPS mode
                                                                                <fipsmode>true</fipsmode>:
                                                                                FIPS mode

Chat Service                            The securityConfig.fipsmode        Must be set to true or false to indicate
                                        parameter in the <chat             whether the Chat Service runs in
                                        service>\conf\app.properties file  FIPS mode:

                                                                                false (default): non-FIPS mode
                                                                                true: FIPS mode

FIPS validated AES-256 data encryption

Starting with version 9.32, Service Manager (SM) supports the implementation of FIPS validated AES-256 data encryption for
encrypted fields in the Service Manager database.

FIPS validated TLS connections

Starting with version 9.41p3, Service Manager supports the implementation of FIPS validated TLS connections, managed by a
FIPS validated cryptographic provider. The following table describes the cryptographic providers that Service Manager uses


in FIPS mode.

            Important

                To enable FIPS mode in Service Manager, all truststore files and keystore files must use BCFKS format.
                SM Smart Analytics uses an OEM-licensed version of IDOL, which doesn't support FIPS mode. For this
                reason, it is impossible to implement FIPS validated TLS connections between the SM Server and the IDOL
                Server. However, when the SM Server is running in FIPS mode, the IDOL Server can still connect to
                SM through standard SSL and Smart Analytics can still work correctly.

TLS connections between                               Cryptographic provider
                                                      Bouncy Castle FIPS-Java
SM Server and any of the following components:

     Windows Client
     Web Tier Client
     Mobility Client
     Chat Server
     Chat Service
     Web service integrations (when SM acts as a web
     services client or web services server)

SM Server                                             Bouncy Castle FIPS-Java

SM Server and LDAP/Directory Services Server          OpenSSL FIPS Object Module

FIPS validated LW-SSO

Service Manager supports FIPS validated LW-SSO. When FIPS mode is enabled on the Service Manager Server side, you
have the option to enable an LW-SSO framework that's implemented by using a FIPS 140-2 validated security provider, such
as the JsafeJCE provider or IBMJCEFIPS provider.

The LW-SSO configuration file (lwssofmconf.xml) in each of the following components has been updated to support LW-SSO
in FIPS mode:

     SM Server
     Web Tier
     Mobility Client
     Chat Server
     Chat Service
     Identity Manager (IdM) service

FIPS compliant random number generation algorithms

When running in FIPS mode, Service Manager uses FIPS compliant random number generation algorithms, as described in
the following table.

 Component                                                                                        Service Manager 9.81
 SM Server
 Windows Client                         Random number generation algorithm
 Web Tier, or Mobility Client           Uses RAND_bytes in OpenSSL.
                                        Is hardcoded to use CTRAES256.
 Chat Server or Chat Service
                                        Uses CTRAES256 by default. You can configure the JRE’s
Related topics                          java.security file to use another FIPS compliant algorithm.

Parameter: fipsmode                     Uses CTRAES256 by default when deployed with Oracle
                                        JRE or ZULU JRE. You can configure the JRE’s
                                        java.security file to use another FIPS compliant algorithm.


1.8.21.1. FIPS mode log messages

Service Manager writes FIPS mode related messages in the Server log and client log files.

Messages in the SM Server log

When FIPS mode is enabled on the Server side, the clients (Windows, Web Tier, Mobility, and Web Services) can connect to
the Server through https (either FIPS validated TLS or normal TLS); however, the recommended best security practice is to
run all of them in FIPS mode as well.
When FIPS mode is successfully enabled on the Server side, the following messages appear in the Server log
(Server\logs\sm.log):

  FIPS mode is set successfully.
  FIPS provider was initialized successfully.

Additionally, when FIPS mode is enabled on the Server side and the Windows Client is running in non-FIPS mode, the
following warning message appears in the Server log:

  Your Client is running in non-FIPS mode, but the Service Manager Server is running in FIPS
  mode. For the highest security, we recommend you enable FIPS mode for the Client.

            Note

           This message will also appear in the Windows Client user interface.

Messages in SM client logs

When FIPS mode is enabled successfully on the client sides, messages are written to the client logs. See the following table.


Client                                  Example messages                         Log file
Web Tier
                                        Examples:                                The sm.log file in the web application
Mobility Client                                                                  server installation directory. For
                                        2020-06-02 13:11:36,592 INFO [main]      example, <Tomcat>\bin\sm.log.
Chat Server                             [-]
                                        [com.hp.ov.sm.client.common.util.JCE
                                        ProviderHelper] JCE Provider has
                                        registered in java.security:BCFIPS

                                        2020-06-02 13:11:36,592 INFO [main]
                                        [-]
                                        [com.hp.ov.sm.client.common.util.JCE
                                        ProviderHelper] Fips mode enabled.

                                        Examples:                                The mobility.log file in the web
                                                                                 application server installation
                                        [main] (02/06/2020 13:11:52,764)         directory. For example,
                                        [INFO ] client.util.JCEProviderHelper -  <Tomcat>\bin\mobility.log.
                                        JCE Provider has registered in
                                        java.security:BCFIPS

                                        [main] (02/06/2020 13:11:52,764)
                                        [INFO ] client.util.JCEProviderHelper -
                                        Fips mode enabled.

                                        Examples:                                The info.log file in the chat server
                                                                                 installation directory. For example,
                                        2020.06.04 15:24:47                      <Chat Server>\logs\info.log.
                                        com.hp.ov.sm.client.common.util.JCE
                                        ProviderHelper - JCE provider BCFIPS
                                        has been initialized successfully.

                                        2020.06.04 15:24:47
                                        com.hp.ov.sm.client.common.util.JCE
                                        ProviderHelper - Adding the new
                                        SunJSSEProviderName provider
                                        which is configured in FIPS mode.

                                        2020.06.04 15:24:47
                                        com.hp.ov.sm.client.common.util.JCE
                                        ProviderHelper - FIPS JSSE provider
                                        has been initialized successfully.

                                        2020.06.04 15:24:47
                                        com.hp.ov.sm.client.common.util.JCE
                                        ProviderHelper - Fips mode enabled.

                                        2020.06.04 15:24:47
                                        org.jivesoftware.util.AesEncryptor -
                                        AesEncryptor initialized for FIPS
                                        mode.


 Client                                 Example messages                       Log file
 Chat Service
                                        Examples:                              Console
Related topics
                                        INFO [2020-06-04 15:56:28,419]
FIPS mode                               com.hp.ov.sm.client.common.util.JCE
Parameter: fipsmode                     ProviderHelper: JCE provider BCFIPS
                                        has been initialized successfully.

                                        INFO [2020-06-04 15:56:28,419]
                                        com.hp.ov.sm.client.common.util.JCE
                                        ProviderHelper: Adding the new
                                        SunJSSEProviderName provider
                                        which is configured in FIPS mode.

                                        INFO [2020-06-04 15:56:28,419]
                                        com.hp.ov.sm.client.common.util.JCE
                                        ProviderHelper: FIPS JSSE provider
                                        has been initialized successfully.

                                        INFO [2020-06-04 15:56:28,419]
                                        com.hp.ov.sm.client.common.util.JCE
                                        ProviderHelper: Fips mode enabled.

                                        INFO [2020-06-04 15:56:28,419]
                                        com.hp.ov.sm.chat.chatservice.util.Ae
                                        sEncryptor: AesEncryptor initialized
                                        for FIPS mode


1.8.21.2. Limitations of FIPS mode

The following limitation exist in the support of FIPS mode for Service Manager (SM).

Service Manager initialization might be slow in Linux environments

This issue may occur when fipsmode:2 is specified in the SM Server's sm.ini file. It is caused by a lack of entropy
(randomness) available on the system used for random number generation and can commonly occur on systems that aren't
receiving much direct user input, such as virtual machines.
As a workaround, you can direct the JVM to use /dev/urandom with the following directive:

     Add the following line to the Server's sm.ini file:

          JVMOption0:-Djava.security.egd=file:/dev/./urandom

     Alternatively, you can add the following line to the jre/lib/security/java.security file:

          securerandom.source=file:/dev/./urandom

For additional information, see the following important third-party information:
http://bugs.java.com/view_bug.do?bug_id=6521844
http://www.2uo.de/myths-about-urandom/

Related topics

FIPS mode


1.8.21.3. Server parameters for FIPS mode

The Service Manager Server uses the following parameters for enabling FIPS mode:
fipsmode
sslEnabledProtocols
ciphers
keystoreType
truststoreType


1.8.21.4. Configuring FIPS mode in Service Manager

For the best security, you can configure FIPS mode in Service Manager (SM) to implement FIPS 140-2 validated
TLS connections in the entire system.

            Note

           Once FIPS mode is enabled on the SM Server side (that is, fipsmode:2 is specified in the sm.ini file), clients
           running in non-FIPS mode are still allowed to connect to the SM Server through normal SSL. However, for the best
           security, this is not recommended.

To enable FIPS mode in Service Manager, perform the following steps in the listed order:

   1. Configure Java and web application servers for FIPS mode
   2. Generate FIPS validated certificates for the SM Server and other components
   3. Configure FIPS mode in the Server
   4. Configure FIPS mode in the Windows Client
   5. Configure FIPS mode in the Web Tier
   6. Configure FIPS mode in the Mobility Client
   7. Configure FIPS mode in the Chat Server
   8. Configure FIPS mode in the Chat Service
   9. Configure FIPS mode in the IdM Service

Additionally, if you need to use LW-SSO, you can configure Service Manager to use FIPS validated LW-SSO. For detailed
instructions, see Configuring LW-SSO in FIPS mode.


1.8.21.4.1. Configure Java and web application servers for
FIPS mode

The Service Manager web tier, mobility, and IdM service are deployed on web application servers. You need to first configure
Java security providers and web application servers for FIPS mode, and then configure FIPS mode for individual SM
components.

            Note

           You don't need to manually configure Java security providers for the SM server, chat server, chat service, and
           Windows client. These components will automatically configure Java security providers when you enable FIPS
           mode for them.

Prerequisites

Before you proceed, make sure of the following:

   1. You have installed Java 17 and web application servers.
   2. You have already generated a server certificate file for web application servers. For details, see Generate FIPS validated

     certificates for the SM Server and other components.

Configure Java security provider

You need to configure the java security properties file to use the BCFIPS security provider as the default security provider.

   1. Create a folder to store FIPS-related files (for example, C:\FIPS ). This topic refers to this folder as <FIPS_HOME> in
     later steps.

   2. Copy the bc-fips-<version>.jar file from the <TOMCAT_HOME>/webapps/<appname>/WEB-INF/lib folder to the
      <FIPS_HOME> folder. Note that the <appname> may be webtier , mobility , or idmservice .

   3. Copy the java.security file from the <JAVA_HOME>/conf/security folder to the <FIPS_HOME> folder.
   4. Edit the <FIPS_HOME>/java.security file.

        1. Add BCFIPS provider as the first security provider, and update provider ID for subsequent providers.
        2. Enable FIPS mode for SunJSSE by specifying a BCFIPS crypto provider for it.
        3. Set the default keystore type to bcfks .
     For example:

          ...
          security.provider.1=BCFIPS C:DEFRND[CTRAES256];ENABLE{ALL};
          security.provider.2=SUN
          security.provider.3=SunRsaSign
          security.provider.4=SunEC
          security.provider.5=SunJSSE BCFIPS
          security.provider.6=SunJCE
          security.provider.7=SunJGSS
          security.provider.8=SunSASL
          security.provider.9=XMLDSig
          security.provider.10=SunPCSC
          security.provider.11=JdkLDAP
          security.provider.12=JdkSASL
          security.provider.13=SunMSCAPI
          security.provider.14=SunPKCS11
          ...
          keystore.type=bcfks
          ...

Configure Tomcat

You need to configure Tomcat to use the customized java.security file by setting appropriate JVM options.


If you start Tomcat by running the script file ( startup.bat or startup.sh ), you need to first create the setenv.bat or
setenv.sh file in the <TOMCAT_HOME>/bin folder, and then add JVM options to the setenv.bat or setenv.sh file. For
example:
Windows ( setenv.bat ):

  set FIPS_HOME=<FIPS_HOME>
  set FIPS_OPTS=--module-path=%FIPS_HOME% --add-
  opens=java.base/sun.security.internal.spec=org.bouncycastle.fips.core
  set FIPS_OPTS=%FIPS_OPTS% -Djava.security.properties==%FIPS_HOME%\java.security -
  Dorg.bouncycastle.fips.approved_only=true
  set JAVA_OPTS=%JAVA_OPTS% %FIPS_OPTS%

Linux ( setenv.sh ):

  #!/bin/sh
  FIPS_HOME=<FIPS_HOME>
  FIPS_OPTS="--module-path=${FIPS_HOME} --add-
  opens=java.base/sun.security.internal.spec=org.bouncycastle.fips.core"
  FIPS_OPTS="${FIPS_OPTS} -Djava.security.properties==${FIPS_HOME}/java.security -
  Dorg.bouncycastle.fips.approved_only=true"
  JAVA_OPTS="${JAVA_OPTS} ${FIPS_OPTS}"

If you install Tomcat as a Windows service, start the tomcat9w.exe, switch to the Java tab, and then add the following JVM
options to the Java Options list. For example:

  --module-path=<FIPS_HOME>
  --add-opens=java.base/sun.security.internal.spec=org.bouncycastle.fips.core
  -Djava.security.properties==<FIPS_HOME>\java.security
  -Dorg.bouncycastle.fips.approved_only=true

Next, copy the cacerts file and the Tomcat server certificate keystore file from cert-utils to the <TOMCAT_HOME>/conf
folder. Edit the <TOMCAT_HOME>/conf/server.xml file to configure the truststore and the keystore for the https connector.
For example:

  ...
  <Connector port="8443" protocol="org.apache.coyote.http11.Http11NioProtocol"

                      maxThreads="150" SSLEnabled="true">

         <SSLHostConfig truststoreFile="conf/cacerts"
                                     truststorePassword="changeit"
                                     truststoreType="bcfks">

                 <Certificate certificateKeystoreFile="conf/tomcat.bcfks"
                                        certificateKeystorePassword="serverkeystore"
                                        certificateKeystoreType="bcfks" />

         </SSLHostConfig>
  </Connector>
  ...


Note

You need to use the appropriate Tomcat server certificate keystore file for different SM components and then
change the certificateKeystoreFile attribute accordingly. For example:

SM component                            certificateKeystoreFile
web tier                                conf/tomcat.bcfks
mobility                                conf/mobilitytomcat.bcfks
idmservice                              conf/idmservice.bcfks

Configure WebSphere Application Server Liberty

            Important

           The following sample configuration assumes that you are working with Open JDK or Oracle JDK. If you are
           working with IBM SDK, skip this section and refer to Setting up Liberty for FIPS compliance for more information.

You need to create jvm.options in the ${wlp.user.dir}/servers/serverName folder, and then update this file by adding
configurations that are related to FIPS mode.

  --module-path=<FIPS_HOME>
  --add-opens=java.base/sun.security.internal.spec=org.bouncycastle.fips.core
  -Djava.security.properties==<FIPS_HOME>\java.security
  -Dorg.bouncycastle.fips.approved_only=true

Next, check whether the ${wlp.user.dir}/servers/serverName/resources/security folder exists or not. If not, create this folder
and then copy the WebSphere Application Server Liberty certificate keystore file for the SM components (such as
mobilitywasliberty.bcfks or wasliberty.bcfks) from cert-utils to it. Refer to the following example to update the
${wlp.user.dir}/servers/serverName/server.xml file.


  <!-- Enable features -->
         <featureManager>
                      <feature>servlet-6.0</feature>
                      <feature>ssl-1.0</feature>
                      <feature>pages-3.1</feature>
         </featureManager>

  <httpSession idLength="128" useContextRootAsCookiePath="true"/>

  <!-- To access this server from a remote client add a host attribute to the following element,
  e.g. host="*" -->
  <httpEndpoint id="defaultHttpEndpoint"

                                     enabled="true"
                                     host="*"
                          httpPort="9080"
                          httpsPort="9443" />

  <!-- default SSL configuration is defaultSSLSettings -->
         <sslDefault sslRef="defaultSSLSettings"/>
         <ssl id="defaultSSLSettings"
                   keyStoreRef="defaultKeyStore"/>
         <keyStore id="defaultKeyStore"
                            location="wasliberty.bcfks"
                            password="serverkeystore"
                            type="bcfks"/>

The example above only specifies the default SSL certificate, keystore, and configuration in Liberty. For more detailed
instructions about how to enable SSL communication in Liberty, see Enabling SSL communication in Liberty.
Next step:
Generate FIPS validated certificates for the SM Server and other components


1.8.21.4.2. Generate FIPS validated certificates for the
SM Server and other components

Before you can enable FIPS mode in the Service Manager (SM) system, you must obtain a CA certificates file and keystore
files in BCFKS format (with the .bcfks file extension) for the SM Server and other components. These certificates are used for
FIPS validated TLS connections between the SM Server and other components.

            Note

           In a production environment, you are recommended to use digital security certificates issued by a certificate
           authority provider, such as Verisign, Thawte, or your corporate certificate authority. The digital certificate
           contains a public key, the identity of the owner, and a matching private key. The certificate is required to encrypt
           data sent and received in a “trusted” environment. If you don't have a digital certificate from a provider listed
           above, you have the option of generating your own certificates to enable encrypted data transfer between the
           Service manager Server and the trusted clients, as described in the following.

     Existing customers need to either convert your existing certificates to BCFKS format or regenerate new BCFKS
     certificates.

                   Caution

                The SM Server truststore and trusted clients keystore don't contain a private key, and can work correctly in
                FIPS mode after conversion to BCFKS format. However, the SM server keystore and client keystores contain
                a private key. Before converting them to BCFKS format, make sure their private key was created using either
                "keytool -genkey -keyalg RSA" or "keytool -genkeypair -keyalg RSA"; otherwise they can't work correctly in
                FIPS mode after conversion to BCFKS format. Before you proceed, make sure the private key of the existing
                JKS file was created as noted above. If not, you will need to generate a new BCFKS certificate.

     New customers need to generate BCFKS certificates for the SM Server and clients (Windows, Web Tier, and Mobility).

As a courtesy, we provide a certificate generation toolkit to help you generate certificates for a Service Manager deployment
in an automated way. For details, see Work with the certificate generation toolkit.
Next step:
Configure FIPS mode in the Server


1.8.21.4.3. Configure FIPS mode in the Server

By default, FIPS mode is disabled, and Service Manager uses the 64-bit DES data encryption algorithm and supports non-
FIPS validated SSL/TLS connections. To run Service Manager in FIPS mode, you need to enable FIPS validated data
encryption and TLS connections.

Prerequisites

Before you proceed, make sure you have already generated the following certificate files for the SM Server. For details, see
Work with the certificate generation toolkit.

     The CA certificates file: \certs\cacerts
     The Server's trusted clients keystore file: \certs\trustedclients.bcfks
     The Server keystore file: \certs\smserver.bcfks
To enable FIPS mode in the SM Server, complete the following tasks.

            Caution

           To enable FIPS mode in a scaling environment, you must configure FIPS mode in each of the SM server nodes.

Steps to enable FIPS mode for data encryption

After enabling FIPS mode, you must upgrade your database's encryption algorithm from DES to AES by running the sm -
upgradeencralg command.

   1. Make a backup of your database.

                   Caution

                FIPS mode requires the database to upgrade to the 256-bit AES encryption algorithm. Because the upgrade
                is irreversible, you need to make a backup of your database.

   2. Check the length of each encrypted field in your database, and increase the length if needed.

                   Tip

                Use the following formula to determine a safe length for an AES encrypted field (in bytes):

                        Safe_Length=32 + 2 * source_string_length

                Where: source_string_length is the length of the source string (for example, if you enter an 8-character
                password, the source string length is 8 bytes).

   3. Upgrade your applications to the AES data encryption algorithm.
     FIPS mode requires the use of the 256-bit AES data encryption algorithm for the database. By default, the Service
     Manager applications uses the 64-bit Data Encryption Standard (DES) encryption algorithm. You must upgrade the
     database from the DES encryption algorithm to AES by running the sm -upgradeencralg command.

                   Caution

                This algorithm upgrade is required only when you want to enable FIPS mode.

          a. Make sure you can connect to the server successfully.
          b. Make sure all Service Manager server processes are stopped.
          c. Check that the server's configuration file ( sm.ini ) doesn't include the fipsmode parameter.


          d. From <Servcie Manager installation directory>/Server/Run, run the sm -upgradeencralg command.

                        Note

                     If you have many tables with encrypted fields, running this command may take quite a while; if you have
                     already run this command on the database, running it again will have no effect and do no harm to the
                     database.

                        Tip

                     You can specify a 32-character alphanumeric value for this parameter, as the new encryption key; if you
                     don't specify any value, a default 32-character (256-bit) encryption key is used. You can also change
                     your encryption key later using the changeencrkey parameter.

          e. Check the server log (sm.log) for any errors.

Steps to enable FIPS mode for TLS connections

Follow these steps:
   1. Copy the certificate files listed in the previous step to the SM Server's RUN directory:
          • The CA certificates file: \certs\cacerts
          • The Server's trusted clients keystore file: trustedclients.bcfks
          • The Server keystore file: smserver.bcfks
   2. Add the following parameters to the sm.ini file in the Server's RUN folder.

                   Caution

                The example certificate file names and passwords used in the following lines are the default ones specified
                in the certificate generation batch files provided by the company. For details, see Generate FIPS validated
                certificates for the SM Server and other components. If you use different file names or passwords when
                generating your certificates, be sure to replace them with your own values.

                   Tip

                The ciphers and sslEnabledProtocols parameters are specified here with their default values. Since
                Service Manager will use their default values when the two parameters aren't present in the sm.ini file, you
                can omit them safely. These parameters are provided just in case you don't want to use their default values.

          fipsmode:2
          ssl:1
          sslConnector:1
          ssl_reqClientAuth:2
          keystoreFile:smserver.bcfks
          keystorePass:serverkeystore
          ssl_trustedClientsJKS:trustedclients.bcfks
          ssl_trustedClientsPwd:trustedclients
          truststoreFile:cacerts
          truststorePass:changeit
          ciphers:TLS_AES_256_GCM_SHA384,TLS_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA3
          84,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_
          RSA_WITH_AES_128_GCM_SHA256
          sslEnabledProtocols:TLSv1.2,TLSv1.3
          JVMOption1:-Djdk.tls.ephemeralDHKeySize=2048


                   Note

                When running under JDK 8, the JDK's SunJSSE TLS implementation is unable to negotiate a TLS handshake
                when using an ECDHE cipher suite.

   3. Go to the <Service Manager server installation path>/RUN folder, and open lwssofmconf.xml in a text editor.
   4. Locate the following section:

          <lwssoValidation>
          <domain>yourdomain.net</domain>
          <crypto cipherType="symmetricBlockCipher"
          engineName="AES" paddingModeName="CBC" keySize="256"
          encodingMode="Base64Url"
          initString="This is a shared secret passphrase"/>
          <!-- When Service Manager is running in FIPS mode, the crypto configuration above needs to
          be replaced with the configuration below. The initString value must be 32 characters long
          and contain no spaces. -->
          <!--
          <crypto cryptoSource="jce" cipherType="symmetricBlockCipher"
          engineName="AES" paddingModeName="CBC" keySize="256"
          pbeDigestAlgorithm="SHA1" encodingMode="Base64Url"
          jcePbeAlgorithmName="AES" jcePbeMacAlgorithmName="AES"
          macType="hmac"
          macAlgorithmName="SHA1" directKeyEncoded="true" directKeyEncoding="Base64Url"
          algorithmPaddingName="PKCS5Padding"
          pbeCount="20" macKeySize="256" macPbeCount="20"
          initString="rqa9mkdmfkvdvienfj4usldo9205mvid">
          </crypto>
          -->
          </lwssoValidation>

     Comment out the ordinary crypto configuration part, and then uncomment the FIPS mode crypto configuration part.
     Note: Please make sure that the value of initString is complied with the encoding rule defined for directKeyEncoding
     in the section above.
     When Service Manager starts, the system loads the LW-SSO related jar files and verifies the algorithms that are related
     to LW-SSO configuration. Based on the verification result, the system judges whether Service Manager is running in
     FIPS mode or not. Hence, to ensure Service Manager is running in FIPS mode, you must switch the crypto configuration
     in lwssofmconf.xml to the one as FIPS mode required.
     Note: Do not change the domain setting in this file unless you are configuring LW-SSO.

          <domain>yourdomain.net</domain>

   5. Restart the SM Server.
     Next, you need to enable FIPS mode in the Windows Client to verify that your FIPS mode is successfully enabled on the
     Server side.

Next step:
Configure FIPS mode in the Windows Client


1.8.21.4.4. Configure FIPS mode in the Windows Client

Once you have enabled FIPS mode on the Service Manager (SM) Server side, you need to enable FIPS mode in the Windows
Client and test if the Windows Client can connect to the SM Server successfully.

Prerequisites

Before you proceed, make sure of the following:

   1. You have already generated a CA certificates file and a client keystore for the Windows Client host. For details, see
     Generate FIPS validated certificates for the SM Server and other components.
           The CA certificates file: \certs\smrootca.bcfks
           The Windows Client keystore file: \certs\<Windows Client alias defined in certs.conf>.bcfks (for example,
           james.jones.bcfks)

   2. You have enabled FIPS mode on the SM Server side. For details, see Configure FIPS mode in the Server.

Steps to enable FIPS mode in the Windows Client

To configure FIPS mode in the Windows Client, follow these steps:

   1. Copy the CA certificates file and client keystore file to a directory on the Windows Client host:
           smrootca.bcfks
           james.jones.bcfks

   2. Configure the Windows Client preferences.
        1. Start the Windows client, and click Window > Preferences > Service Manager > Security.
        2. Select the FIPS Mode checkbox.
           A message appears, indicating that you need to restart the Windows Client to continue.
           Click OK to exit the message window.
           Because the Windows Client is hardcoded to use the RSA BSAFE JsafeJCE provider for FIPS mode, you no longer
           need to specify a cryptographic provider. For this reason, the following parameters are disabled (grayed out) when
           the FIPS Mode option is selected:
                 JCE provider name
                 JCE provider class name

                         Tip

                      These parameters are used to specify a third-party Java Cryptography Extension (JCE) provider when
                      the Windows Client is running in non-FIPS mode (that is, when the FIPS Mode checkbox is not
                      selected).

           Note that the following parameters are also disabled at this point, because a restart of the Windows Client is
           needed after the FIPS Mode option is enabled. After a restart, these parameters will be available to configure in the
           Preferences window.

                 CA certificates password
                 Client keystore password
           The following screenshot illustrates the Preferences window when FIPS Mode is selected.


        Click OK again to exit the Preferences window.
        Close the Windows Client.
3. Restart the Windows Client.
4. Click Window > Preferences > Service Manager > Security.
5. Configure the parameters as described in the following.
  Click Browse to enter the CA certificates file, and then enter the password in the CA certificates password field.
  Click Browse to enter the client keystore file, and then enter the password in the Client keystore password field.
  Click Apply, and then click OK twice.

6. Click File to open your client connection, and do the following to verify the SM Server and Windows Client have
  FIPS mode enabled correctly:

     1. Select the Use Login/Password option on the Connection tab.

     2. Check that the Use SSL Encryption option on the Advanced tab is selected and grayed out.


                         Note

                      When the FIPS Mode option is enabled, the Windows Client is forced to use SSL encryption.

        3. Enter your user name and password.
        4. In the Server host name field, enter the fully qualified domain name (FQDN) of the SM Server.
        5. In the Server port number field, enter the HTTP port (for example, 13080) of the SM Server.
        6. Click Connect.
     If FIPS mode has been successfully enabled in the SM Server and Windows Client, you should be successfully logged
     in.
Next step:
Configure FIPS mode in the Web Tier


1.8.21.4.5. Configure FIPS mode in the Web Tier

Once you have enabled FIPS mode on the Service Manager (SM) Server side, you need to enable FIPS mode in the Web Tier.

Prerequisites

     You have configured Java security providers and web application servers for FIPS mode. For details, see Configure
     Java and web application servers for FIPS mode.
     You have already generated a CA certificates file and a client keystore for the Web Tier host. For details, see Work with
     the certificate generation toolkit.
     You have enabled FIPS mode on the SM Server side. For details, see Configure FIPS mode in the Server.

Steps to enable FIPS mode in the Web Tier

To configure FIPS mode in the web client, follow these steps:
   1. Copy the smrootca.bcfks and smwebtier.bcfks files to <Customize-Folder>/config folder if the customize-folder
     parameter is set in the web.xml, and then append the following scripts to the <Customize-Folder>/config
     /webtier.properties file.

          fipsMode=true
          ssl=true
          keystore=<Customize-Folder>/config/smwebtier.bcfks
          keystorePassword=clientkeystore
          cacerts=<Customize-Folder>/config/smrootca.bcfks
          cacertsPassword=caroot
          cookie.secure=true

     Copy the smrootca.bcfks and smwebtier.bcfks files to <WEBTIER>/WEB-INF folder if the customize-folder parameter
     is not set in the web.xml, and then append the following scripts to the <WEBTIER>/WEB-INF/webtier.properties file.

          fipsMode=true
          ssl=true
          keystore=/WEB-INF/smwebtier.bcfks
          keystorePassword=clientkeystore
          cacerts=/WEB-INF/smrootca.bcfks
          cacertsPassword=caroot
          cookie.secure=true

   2. Go to the <web tier root>/WEB-INF/classes folder, and open lwssofmconf.xml in a text editor.
   3. Locate the following section:


          <lwssoValidation>
          <domain>yourdomain.net</domain>
          <crypto cipherType="symmetricBlockCipher"
          engineName="AES" paddingModeName="CBC" keySize="256"
          encodingMode="Base64Url"
          initString="This is a shared secret passphrase"/>
          <!-- When Service Manager is running in FIPS mode, the crypto configuration above needs to
          be replaced with the configuration below. The initString value must be 32 characters long
          and contain no spaces. -->
          <!--
          <crypto cryptoSource="jce" cipherType="symmetricBlockCipher"
          engineName="AES" paddingModeName="CBC" keySize="256"
          pbeDigestAlgorithm="SHA1" encodingMode="Base64Url"
          jcePbeAlgorithmName="AES" jcePbeMacAlgorithmName="AES"
          macType="hmac"
          macAlgorithmName="SHA1" directKeyEncoded="true" directKeyEncoding="Base64Url"
          algorithmPaddingName="PKCS5Padding"
          pbeCount="20" macKeySize="256" macPbeCount="20"
          initString="rqa9mkdmfkvdvienfj4usldo9205mvid">
          </crypto>
          -->
          </lwssoValidation>

     Comment out the ordinary crypto configuration part, and then uncomment the FIPS mode crypto configuration part.
     Note: Please make sure that the value of initString is complied with the encoding rule defined for directKeyEncoding
     in the section above.
     When Service Manager starts, the system loads the LW-SSO related jar files and verifies the algorithms that are related
     to LW-SSO configuration. Based on the verification result, the system judges whether Service Manager is running in
     FIPS mode or not. Hence, to ensure Service Manager is running in FIPS mode, you must switch the crypto configuration
     in lwssofmconf.xml to the one as FIPS mode required.
     Note: Do not change the domain setting in this file unless you are configuring LW-SSO.

          <domain>yourdomain.net</domain>

   4. Restart your web application server for your configuration to take effect.
   5. Launch your Web Tier client URL in a browser, and log in with your user account.

     If FIPS mode has been successfully enabled in the Web Tier, you should be successfully logged in.
Next step:
Configure FIPS mode in the Mobility Client


1.8.21.4.6. Configure FIPS mode in the Mobility Client

Once FIPS mode is enabled on the SM Server side, you need to enable FIPS-validated data encryption and TLS connections
between the Service Manager Server and Mobility Client.
This topic provides both prerequisites and sample steps about how to enable FIPS mode in the Mobility Client if you have
deployed the Mobility Client on Tomcat.

Prerequisites

Before you proceed, make sure of the following:
     You have configured Java security providers and web application servers for FIPS mode. For details, see Configure
     Java and web application servers for FIPS mode.
     You have already generated a CA certificates file and a client keystore for the Web Tier host. For details, see Work with
     the certificate generation toolkit.
     You have enabled FIPS mode on the SM Server side. For details, see Configure FIPS mode in the Server.

Steps to enable FIPS mode in the Mobility Client

To enable FIPS mode in the Mobility Client, follow these steps:
   1. Copy the certificate files to the Mobility Client's WEB-INF folder (webapp-9.xx.xxxx.war\WEB-INF\):
          • The CA certificates file: smrootca.bcfks
          • The Mobility Client keystore file: smmobility.bcfks
   2. Open the web.properties file in the Mobility Client's WEB-INF folder in a text editor.
   3. Configure the following parameters in the file and then save the file:

          endpoint=https://smserver.mycompany.net:13443/SM/ui
          fipsMode=true
          cacerts=/WEB-INF/smrootca.bcfks
          keystore=/WEB-INF/smmobility.bcfks
          keystorePassword=clientkeystore
          cacertsPassword=caroot

   4. Go to the Mobility Client's WEB-INF/classes folder, and open lwssofmconf.xml in a text editor.
   5. Locate the following section:


          <lwssoValidation>
          <domain>yourdomain.net</domain>
          <crypto cipherType="symmetricBlockCipher"
          engineName="AES" paddingModeName="CBC" keySize="256"
          encodingMode="Base64Url"
          initString="This is a shared secret passphrase"/>
          <!-- When Service Manager is running in FIPS mode, the crypto configuration above needs to
          be replaced with the configuration below. The initString value must be 32 characters long
          and contain no spaces. -->
          <!--
          <crypto cryptoSource="jce" cipherType="symmetricBlockCipher"
          engineName="AES" paddingModeName="CBC" keySize="256"
          pbeDigestAlgorithm="SHA1" encodingMode="Base64Url"
          jcePbeAlgorithmName="AES" jcePbeMacAlgorithmName="AES"
          macType="hmac"
          macAlgorithmName="SHA1" directKeyEncoded="true" directKeyEncoding="Base64Url"
          algorithmPaddingName="PKCS5Padding"
          pbeCount="20" macKeySize="256" macPbeCount="20"
          initString="rqa9mkdmfkvdvienfj4usldo9205mvid">
          </crypto>
          -->
          </lwssoValidation>

     Comment out the ordinary crypto configuration part, and then uncomment the FIPS mode crypto configuration part.
     Note: Please make sure that the value of initString is complied with the encoding rule defined for directKeyEncoding
     in the section above.
     When Service Manager starts, the system loads the LW-SSO related jar files and verifies the algorithms that are related
     to LW-SSO configuration. Based on the verification result, the system judges whether Service Manager is running in
     FIPS mode or not. Hence, to ensure Service Manager is running in FIPS mode, you must switch the crypto configuration
     in lwssofmconf.xml to the one as FIPS mode required.
     Note: Do not change the domain setting in this file unless you are configuring LW-SSO.

          <domain>yourdomain.net</domain>

   6. Restart the Mobility Client's web application server.
   7. Make sure the SM Server is started.
   8. Sign in to the Mobility Client.

     If FIPS mode has been enabled correctly in the Mobility Client, you should be signed in successfully.
Next step:
Configure FIPS mode in the Chat Server


1.8.21.4.7. Configure FIPS mode in the Chat Server

Note: The instructions here are supplementary to the steps that are provided in configure the chat server in HTTPS mode.
Before you proceed, make sure of the following:

   1. You have already generated two CA certificate files and a keystore file for the Chat Server. For details, see Work with
     the certificate generation toolkit.
          • The CA certificates file for connections from other servers: \certs\smrootca.bcfks
          • The CA certificates file for connections from clients: \certs\smrootca.bcfks
          • The Server keystore file: \certs\smchatserver.bcfks

   2. You have enabled FIPS mode on the SM Server side. For details, see Configure FIPS mode in the Server.
   3. If you are configuring FIPS mode in an existing Chat Server, that is, the Chat Server ran in non-FIPS mode before, you

     must perform the following extra steps before you configure the chat server in HTTPS mode.
          a. Open the Openfire Administration Console in non-FIPS mode, and then click System Properties. Remove the
          following encrypted configuration items:
             activemq.auth.password

                 activemq.auth.userName

                 admin.web.ssl.keypass

                 admin.web.ssl.trustpass

                 passwordKey

                 xmpp.bosh.ssl.client.keypass

                 xmpp.bosh.ssl.client.trustpass

                 xmpp.component.keypass

                 xmpp.component.trustpass

                 xmpp.multiplex.keypass

                 xmpp.multiplex.trustpass

                 xmpp.socket.ssl.client.keypass

                 xmpp.socket.ssl.client.trustpass

                 xmpp.socket.ssl.keypass

                 xmpp.socket.ssl.trustpass
          b. Stop the Chat Server.
          c. Open <chat server>\conf\openfire.xml with a text editor. Update all the encrypted items with plain text values,
          and then update the value of setup to false: <setup>false</setup> .
Next, follow these steps to enable FIPS mode in the Chat Server:
Note: For a new installation, these are the prerequisite steps before you do further configurations through the Administration
Console.
   1. Copy the CA certificate files and keystore file (smrootca.bcfks and smchatserver.bcfks) to the <chat
     server>\resources\security folder.


   2. Open the chat server configuration file (<chat server>\conf\openfire.xml) in a text editor.
   3. Locate the <securityConfig> section, and then set the fipsmode parameter to true (default: false), as shown in the

     following.

          <securityConfig>
                        <ssl>
                            <keyStoreType>BCFKS</keyStoreType>
                            <keyStorePath>resources/security/smchatserver.bcfks</keyStorePath>
                            <keyStorePassword>serverkeystore</keyStorePassword>
                            <trustStorePath>resources/security/smrootca.bcfks</trustStorePath>
                            <trustStorePassword>caroot</trustStorePassword>
                            <clientTrustStorePath>resources/security/smrootca.bcfks</clientTrustStorePath>
                            <clientTrustStorePassword>caroot</clientTrustStorePassword>
                        </ssl>

                     ...
                        <fipsmode>true</fipsmode>

          ...
          </securityConfig>

   4. Save your changes and close this file.
   5. Start the Chat Server.
   6. Open the Openfire Administration Console and follow the setup process in configure the chat server in HTTPS mode.

     Note: If you are using Microsoft SQL server, be sure to select Microsoft SQL server (legacy) as the database driver.
   7. Open the Openfire Administration Console, re-encrypt other encrypted items in System Properties if any.
   8. In the Openfire Administration Console, delete all users except admin and publishadmin.
Next step:
Configure FIPS mode in the Chat Service


1.8.21.4.8. Configure FIPS mode in the Chat Service

Note: The instructions here are supplementary to the steps that are provided in configure the chat service in HTTPS mode.
Before you proceed, make sure of the following:

   1. You have already generated a CA certificates file and a keystore file for the Chat Service. For details, see Work with the
     certificate generation toolkit.
          • The CA certificates file: \certs\smrootca.bcfks
          • The Chat Service server keystore file: \certs\smchatservice.bcfks
          • The Chat Service client keystore file: \certs\smchatserviceclient.bcfks

   2. You have enabled FIPS mode on the SM Server side. For details, see Configure FIPS mode in the Server.
   3. If you are configuring FIPS mode in an existing Chat Service, that is, the Chat Service ran in non-FIPS mode before, you

     must decrypt all the encrypted items first.
          a. Stop the Chat Service.
          b. Open <chat service>\conf\app.properties with a text editor, empty app.encryptionKey and then update all the
          encrypted items with plain text values.

Follow these steps to enable FIPS mode in the Chat Service:
   1. Copy the CA certificate file and keystore file (smrootca.bcfks, smchatserviceclient.bcfks, and smchatservice.bcfks) to
     the <chat service>\conf folder.
   2. Open the Chat Service configuration file (<chat service>\conf\app.properties) in a text editor.
   3. Make configurations as shown below:

          securityConfig.fipsmode=true
          …
          app.clientKeyStoreType=BCFKS
          app.clientKeyStorePath=../conf/smchatserviceclient.bcfks
          app.clientKeyStorePassword=clientkeystore

          app.keyStoreType=BCFKS
          app.keyStorePath=../conf/smchatservice.bcfks
          app.keyStorePassword=serverkeystore

          app.trustStoreType=BCFKS
          app.trustStorePath=../conf/smrootca.bcfks
          app.trustStorePassword=caroot

   4. Save your changes and close this file.
   5. Start the Chat Service for your configuration to take effect.
Next step:
Configure FIPS mode in the IdM Service


1.8.21.4.9. Configure FIPS mode in the IdM Service

To enable the FIPS mode in the IdM service, you need to make some additional configurations when you install the IdM
service. Content in this topic is supplementary to Install Identity Manager (IdM).

Prerequisites

Before you proceed, make sure that you have configured Java security providers and Tomcat for FIPS mode. For details, see
Configure Java and web application servers for FIPS mode.

Task 1: Configure the IdM Service

You need to configure the IdM service to use the BCFIPS security provider and configure the default truststore.
   1. Edit the WEB-INF/classes/idm-security.properties file to enable FIPS mode and set the truststore. For example:

          useExternalProvider=true
          sslTruststore=<TOMCAT_HOME>/conf/cacerts
          sslTruststorePassword=changeit

   2. Edit the WEB-INF/classes/security/key-configuration.properties file to use the BCFIPS security provider. For example:

          enckeytype.local.profile=strong256bit
          enckeytype.local.jce=BCFIPS
          enckeytype.local.keyfile=key-local-strong256.bin
          enckeytype.local.passphrase.name=local strong256 passphrase
          enckeytype.local.passphrase.provider=file
          enckeytype.local.passphrase.file=key-local-strong256-passphrase.txt
          enckeytype.local.passphrase.deleteFile=false

          enckeytype.network.profile=strong256bit
          enckeytype.network.jce=BCFIPS
          enckeytype.network.keyfile=key-network-strong256.bin
          enckeytype.network.passphrase.name=network strong256 passphrase
          enckeytype.network.passphrase.provider=file
          enckeytype.network.passphrase.file=key-network-strong256-passphrase.txt
          enckeytype.network.passphrase.deleteFile=false

   3. Add more LW-SSO settings to the system_resource_config__1.0.0.1__update_signingKey_and_initString.json seeded
     json file.
     For example:


[
   {
       "operation": "UPDATE",
       "type": "systemResourceConfig",
       "names":{
          "systemResourceConfigName":"idm.encryptedSigningKey"
       },
       "attributes": {
          "value": "<your IdM signing key, 32 characters>"
       }
   }, {
       "operation": "UPDATE",
       "type": "systemResourceConfig",
       "names":{
          "systemResourceConfigName":"lwssoConfig.domain"
       },
       "attributes": {
          "value": "microfocus.com"
       }
   }, {
       "operation": "UPDATE",
       "type": "systemResourceConfig",
       "names":{
          "systemResourceConfigName":"lwssoConfig.initString"
       },
       "attributes": {
          "value": "<your LWSSO init string, 32 characters, base64

-encoded>"
       }

   }, {
       "operation": "UPDATE",
       "type": "systemResourceConfig",
       "names":{
          "systemResourceConfigName":"lwssoConfig.crypto.cryptoSource"
       },
       "attributes": {
          "value": "jce"
       }

   }, {
       "operation": "UPDATE",
       "type": "systemResourceConfig",
       "names":{
          "systemResourceConfigName":"lwssoConfig.crypto.macAlgorithmName"
       },
       "attributes": {
          "value": "SHA256"
       }

   }, {
       "operation": "UPDATE",
       "type": "systemResourceConfig",
       "names":{
          "systemResourceConfigName":"lwssoConfig.crypto.directKeyEncoded"
       },
       "attributes": {
          "value": "TRUE"
       }

   }, {
       "operation": "UPDATE",


                 "type": "systemResourceConfig",
                 "names":{

                     "systemResourceConfigName":"lwssoConfig.crypto.directKeyEncoding"
                 },
                 "attributes": {

                     "value": "Base64"
                 }
             }
          ]

     Note: Please make sure that the lwssoConfig.crypto.directKeyEncoded , lwssoConfig.crypto.directKeyEncoding , and
      lwssoConfig.initString setings are consistent with the settings defined in lwssofmconf.xml for Server, Web Tier, and
     Mobility Client.

     The lwssoConfig.initString must be base64-encoded and its original value must be 32 characters. Run the following
     commands to encode a value to base64:

           Windows (PowerShell)

                 [convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes('your LWSSO init string, 32
                 characters'))

           Linux

                 echo -n 'your LWSSO init string, 32 characters' | base64

   4. If the server certificate of the reverse proxy or the load balancer is issued by your corporate root CA, you need to import
     your corporate root CA certificate (PEM-encoded, such as corprootca.crt ) to the truststore cacerts by using the
     certificate generation toolkit, then copy it to the <TOMCAT_HOME>/conf folder. For example:

          import-cert.bat --alias corprootca --file certs/corprootca.crt --keystore certs/cacerts --
          storetype bcfks --storepass changeit

Task 2: Configure the IdM admin console

Edit the WEB-INF/classes/conf/IdmConfig.xml file to use the bcfks truststore for the IdM client configuration. For example:

  <client trustAll="false" ...>
      ...
      <trustStoreFile>WEB-INF/classes/conf/smrootca.bcfks</trustStoreFile>
      <trustStoreType>bcfks</trustStoreType>
      <trustStorePass>your encrypted password for the client truststore</trustStorePass>
      ...

  </client>

If the server certificate of the reverse proxy or the load balancer is issued by your corporate root CA, you need to import your
corporate root CA certificate (PEM-encoded, such as corprootca.crt ) to a truststore by using the certificate generation
toolkit (for example, corprootca.bcfks ) and then use it as the IdM client truststore. For example:

  import-cert.bat --alias corprootca --file certs/corprootca.crt --keystore
  certs/corprootca.bcfks -storetype bcfks --storepass <your password for the client truststore>

Task 3: Encrypt the passwords

Before encrypting the password, you need to set the JVM options to use the customized java.security file. For example:


  set FIPS_HOME=<FIPS_HOME>
  set FIPS_OPTS=--module-path=%FIPS_HOME% --add-
  opens=java.base/sun.security.internal.spec=org.bouncycastle.fips.core
  set FIPS_OPTS=%FIPS_OPTS% -Djava.security.properties==%FIPS_HOME%\java.security -
  Dorg.bouncycastle.fips.approved_only=true

Run the following commands from the appropriate locations to encrypt the passwords by adding the JVM options.
     Encrypt the password for the IdM service

          java %FIPS_OPTS% -jar dataprotection-passwordtool-1.0.5-standalone.jar --encrypt --conf "
          <TOMCAT_HOME>\webapps\idm-service\WEB-INF\classes\security" local <your password>

     Encrypt the password for the IdM admin console

          java %FIPS_OPTS% -jar idm-client-core-1.10.37-41.jar crypto -e -a AES -m <your password> -f
          ..\classes\conf\IdmConfig.key
````
