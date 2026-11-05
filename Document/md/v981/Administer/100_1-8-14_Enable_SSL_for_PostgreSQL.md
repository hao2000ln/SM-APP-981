---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.8.14 .. 1.8.15
printed_pages: 2508-2531
---

# 1.8.14 Enable SSL for PostgreSQL

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.8.14. Enable SSL for PostgreSQL

If your PostgreSQL database requires SSL, you can enable SSL connections between the Service Manager server and the
PostgreSQL database server.
To do this, follow these steps:

Configure PostgreSQL connection in Service Manager server

   1. Prepare the required certification.
     Note: Customized file names and locations of the client certificate, client key, and root certificate are used in this
     example. You can also follow the PostgreSQL SSL documentation to use the default file names and locations.
        1. Prepare the root certificate. For example, if you use self-signed root certification:

                 openssl req -new -nodes -text -out pgroot.csr -keyout pgroot.key -subj
                 "/C=CN/ST=Shanghai/L=Shanghai/O=BTO/CN=root.<your domain name>"
                 openssl x509 -req -in pgroot.csr -text -days 3650 -extensions v3_ca -signkey pgroot.key
                 -out pgroot.crt

           Note: In a production environment, you are recommended to use your own certificate that's signed by your
           corporate CA or a third-party CA.
        2. Prepare the PostgreSQL database server certificate and server private key. For example:

                 openssl req -new -nodes -text -out pgserver.csr -keyout pgserver.key -subj
                 "/C=CN/ST=Shanghai/L=Shanghai/O=BTO/CN=<db server FQDN>"
                 openssl x509 -req -in pgserver.csr -text -days 365 -CA pgroot.crt -CAkey pgroot.key -
                 CAcreateserial -out pgserver.crt

        3. Prepare the client certificate and client private key. For example:

                 openssl req -new -nodes -text -out pgclient.csr -keyout pgclient.key -subj
                 "/C=CN/ST=Shanghai/L=Shanghai/O=BTO/CN=<Postgres DB User Name>"
                 openssl x509 -req -in pgclient.csr -text -days 365 -CA pgroot.crt -CAkey pgroot.key -
                 CAcreateserial -out pgclient.crt

           For details, see the PostgreSQL documentation.
   2. Configure PostgreSQL database files and restart postgreSQL.

        1. Configure pg_hba.conf by appending a line for hostssl. For example:

                 hostssl all all <SM Server FQDN> cert

           Note: If your Service Manager server is configured as horizontal scaling, you need to add each host as an entry in
           the pg_hba.conf file.
        2. Add the root certificate, PostgreSQL server certificate, and PostgreSQL server private key (created in step 1.a and
           step 1.b) to $PGDATA . For example, /var/lib/pgsql/16/data .
        3. Configure postgresql.conf by updating the following parameters:

                 ssl=on
                 ssl_ciphers=<cipher name>
                 ssl_cert_file=<server certificate file name>
                 ssl_key_file=<server private key file name>
                 ssl_ca_file=< root certificate file name>
                 ssl_min_protocol_version = 'TLSv1.2'
                 ssl_max_protocol_version = 'TLSv1.3'


        4. Restart the PostgreSQL service.
           Note: If you need to configure SSL between Service Manager Collaboration and PostgreSQL, you can restart the
           PostgreSQL service later after the step 8.

   3. Upload the following certificate files to the RUN folder of the Service Manager server.
           Root certificate
           Client certificate
           Client private key

     Notes:
           When Service Manager Server is on Linux, make sure that you set the file permission as 600 for certifications.
           Optionally, you can set Certificate Revocation List (CRL) file.

   4. Add the FQDN of the database server to the host file of the Service Manager server. Alternatively, you can add user
     mapping by following the PostgreSQL document.

   5. Configure the PostgreSQL settings in sm.ini. For example:

          sqldictionary:postgresql
          [postgresql]
          sqldb:host=<dbhost> port=5432 dbname=<dbname> sslmode=verify-full sslcert=pgclient.crt
          sslkey=pgclient.key sslrootcert=pgroot.crt

           sslmode: secure connections can be ensured by setting the parameter to verify-full or verify-ca
           sslcert: specifies the client certificate
           sslkey: specifies the client private key
           sslrootcert: specifies the root certificate
     Tip: For more information, see the PostgreSQL documentation: https://www.postgresql.org/docs/current/libpq-ssl.html

   6. Configure the pgsslEnableProtocols and pgsslEnableCiphers parameters in sm.ini.
           pgsslEnableProtocols: specifies the supported SSL protocols for PostgreSQL SSL connections. TLSv1.2, TLSv1.3
           is set by default. For details, see pgsslEnableProtocols.

           pgsslEnableCiphers: specifies an array of cipher suites used for PostgreSQL SSL connections. For details, see
           pgsslEnableCiphers.

   7. Restart the Service Manager server.

Configure PostgreSQL connection for Chat

   1. If you use Service Manager Collaboration, configure the JDBC client for the Chat server.
        1. Run the following command to convert the private key created in step 1.c from the PEM format to the DER format,
           and then name it to pgclient.pk8 .

                 # openssl pkcs8 -topk8 -inform PEM -outform DER -in pgclient.key -out pgclient.pk8 -
                 nocrypt

        2. Copy certificates to the Chat server.

           On the Chat server, copy the root certificate (pgroot.crt), JDBC client certificate (pgclient.crt) and key
           (pgclient.pk8) to the <Chat Server Home>/bin folder.
        3. On the PostgreSQL server, open the pg_hba.conf file with a text editor, and then add a new line for SSL. For
           example:

                 hostssl all all <Chat server FQDN> cert

           Restart the PostgreSQL server after your update.

        4. Add the FQDN of the database server to the host file of the Chat server. Alternatively, you can add user mapping
           by following the PostgreSQL document.

        5. Construct the JDBC URL. When you log in to the PostgreSQL database by using the JDBC URL, you can use the
           following JDBC URL:


  jdbc:postgresql://<db server FQDN>:<PG DB Port>/<database name>?currentSchema=<Schema
  Name>&sslmode=verify-full&sslcert=<client certification>&sslkey=<client
  keystore.pk8>&sslrootcert=<root certificate>

Note: If Chat Server is deployed on Linux, use absolute path for sslcert, sslkey,sslrootcert parameters in above
JDBC URL.
For example:

jdbc:postgresql://dbserver.yourdomain.net:5432/smdb?currentSchema=smdb&sslmode=verify-
full&sslcert=pgclient.crt&sslkey=pgclient.pk8&sslrootcert=pgroot.crt

Configure PostgreSQL connection in the IdM service

To configure PostgreSQL connection in the IdM service, follow these steps:
   1. Open the <idm-service>/WEB-INF/spring/applicationContext.properties file with a text editor.
   2. Update the following database connection parameters.

Parameter                                Description
idm.persistence.flyway.type              Set it to postgresql.

hibernate.dialect                        Set it to org.hibernate.dialect.PostgreSQL9Dialect.
idm.persistence.dialect
idm.persistence.connection.driver.class  Set it to org.hibernate.dialect.PostgreSQL9Dialect.
idm.persistence.connection.url
                                         Set it to org.postgresql.Driver.

                                         Specify a value that uses the following format:

                                         jdbc:postgresql://<PostgreSQL database server host>:
                                         <port>/<IdM database name>?
                                         ssl=true&sslmode=verify-full&sslrootcert=C:\\apache-
                                         tomcat-9.0.80\\webapps\\idm-service\\WEB-
                                         INF\\spring\\pgroot.crt

                                         Example value:

                                         jdbc:postgresql://localhost:5432/IDM-SM?
                                         ssl=true&sslmode=verify-full&sslrootcert=C:\\apache-
                                         tomcat-9.0.80\\webapps\\idm-service\\WEB-
                                         INF\\spring\\pgroot.crt

idm.persistence.connection.username      Enter the login credentials that you created for the
idm.persistence.connection.password      PostgreSQL database.


1.8.15. Trusted sign-on

You can configure Service Manager clients to automatically log on using the same authentication information as users
entered when they logged onto their client workstation's operating system. When you enable trusted sign-on, users bypass
the Service Manager logon screen and directly enter the application.

In a trusted sign-on scenario the Service Manager server grants access to clients only if the following conditions are met.

     The user's logon credentials match an existing operator record in Service Manager or a valid LDAP source that Service
     Manager recognizes.
     A trusted authentication authority, such as the operating system, validates that the user's logon credentials are valid.
     The client (Service Manager Web Tier or Windows) must present a signed SSL certificate.

The following figure depicts the connection process between a Web server, a Web application server, and the Service
Manager application server:

     The Web server receives the user information from the client via the browser, and passes the user name and domain
     name to the Web application server.
     The Web application server (such as Tomcat) acts as a client, and communicates with the Service Manager application
     server.
     The Service Manager application server also checks whether the user was authenticated by a valid domain. Local
     machine authentication is not accepted; if attempted the Service Manager server will reject such a request.


1.8.15.1. Requirements for trusted sign-on

This configuration is intended for customers who have an Service Manager server running in a secured environment and
want users to be able to log on to the server without providing a user name and password.

Parameters required in the server configuration file (sm.ini)

  trustedsignon:1
  ssl:1
  ssl_reqClientAuth:2

Parameters required in the web tier configuration file (web.xml)

isCustomAuthenticationUsed - Set the value to false to make Service Manager send the current user name in the HTTP
header.

Other requirements

   1. Configure the web tier to use a trusted authentication source.
        1. Stop the web application server running the web tier.
        2. Navigate to the folder <web tier installation path>\WEB-INF\classes , and open the file application-context.xml in
           a text editor.
        3. Search for the following string:
            <sec:filter-chain pattern="/**" filters="securityContextPersistenceFilter,resourceFilter,anonymousAuthFilter"/>
        4. Add preAuthenticationFilter to use Microsoft Integrated Windows Authentication as your trusted authentication
           source:
            <sec:filter-
           chain pattern="/**" filters="securityContextPersistenceFilter,resourceFilter,preAuthenticationFilter,anonymousAuth
           Filter"/>
        5. Configure the parameters in the bean definition of preAuthenticationFilter according to the username format used
           in Service Manager.

                 keepDomain:
                 true, the login name of the Service Manager operators contains the domain name;
                 false (default), does not contain.

                 userPrincipalNameFormat:
                 true, User Principal Name (UPN) format - for example: UserName@DOMAIN is used;
                 false (default), Down-Level Logon Name format - for example: DOMAIN\UserName is used.

           In the example above, DOMAIN is the "Domain name (pre-Windows 2000)" of your Active Directory.
        6. Save the file and restart the web application server.
   2. Create an operator record for each Windows user that you want to log on to Service Manager. Format of the username
     must match the configuration in step 1 > e.
   3. Install and configure an external authentication source, such as Microsoft Integrated Windows Authentication, to ensure
     that Service Manager can use your private certificates.
   4. Refer to Example: Configuring the Web server for trusted sign-on to configure a web server for trusted sign-on.
   5. Beginning with Service Manager 9.30, Trusted Sign-On (TSO) requires the use of ssl_reqClientAuth:2 . You must create
     unique client SSL certificates for each Service Manager client that needs to access Service Manager with TSO. For
     example, if you have 20 Windows clients, you must create 20 unique client SSL certificates.


                   Tip

                If maintaining these unique client SSL certificates for Windows clients incurs unsustainable IT operation
                costs, you can consider the use of the acceptsharedcert:1 parameter. See Parameter: acceptsharedcert.

Related topics

Example: Enabling trusted sign-on
Parameter: acceptsharedcert


1.8.15.2. Example: Enabling trusted sign-on

Trusted sign-on in Service Manager leverages Windows-integrated authentication that allows users on trusted clients who
have logged in to a Windows domain to log on to Service Manager without providing a user name and password. The
Windows client can directly retrieve the cached credentials from the Windows system to authenticate the operator.
For applications deployed on a Java EE application server, such as web tier and mobility, integration with a web server (such
as Windows Internet Information Services (IIS) or Apache HTTP server) is required for the authentication.

            Note

                Service Manager only supports trusted sign-on with SSL enabled and the ssl_reqClientAuth parameter set
                to "2".
                To use trusted sign-on, you must first add your web server and Windows clients to a domain.

This example assumes that you are using Tomcat as the web application server and Apache or IIS as the web server.
To enable trusted sign-on, perform the following tasks:

Task 1: Create an operator record for each Windows user

You need to create an operator record for each Windows user so that they can log in to Service Manager.
There are two account formats for a Windows user in an Active Directory:

     sAMAccountName format.
     For example, DOMAIN\UserName. Here DOAMIN is the "Domain name (pre-Windows 2000)" of your Active Directory.
     UserPrincipalName format.
     For example, UserName@xxx.com.

Note that when you are using Windows integrated authentication, the account name passed to the web server is different
based on the authentication type.

     For NTLM, the system always retrieves sAMAccountName as the account name even if you have logged on to the
     computer using the UserPrincipalName.
     For GSSAPI, the system returns the account name in the format of UserName@KerberosRealm. Usually the
     KerberosRealm is the same as the domain name.

The default configuration of trusted sign-on is to drop the domain part from the account name. Hence, when you create an
operator in Service Manager, the login name doesn't contain domain name.
Suppose your Service Manager operators are from multiple domains. When you create an operator in Service Manager, the
login name must contain domain name. You can use either the sAMAccountName format or the UserPrincipalName format.
Note that in both formats the domain part is as follows.

     For NTLM, it is from sAMAccountName - the "Domain name (pre-Windows 2000)" of your Active Directory.
     For GSSAPI, it is the KerberosRealm.

Task 2: Enable required SSL encryption and trusted clients.

For detailed steps, see Configure two-way SSL.

Task 3: Configure the web tier to use trusted sign-on.

If the web server connects to Tomcat by using the AJP protocol, please follow below steps:

   1. Stop the web application server running the web tier.
   2. In the web tier's web.xml file, set isCustomAuthenticationUsed to false.
   3. In the <Tomcat>/conf/server.xml file, insert tomcatAuthentication="false" in the following section as shown below.


      <Connector protocol="AJP/1.3"
         secret="MyT0mcAt"
         address="0.0.0.0"
         port="8009"
         tomcatAuthentication="false"
         redirectPort="8443" />

4. Edit the web application server's application-context.xml file to enable pre-authentication.
     1. Open <web tier installation path>\WEB-INF\classes\application-context.xml in a text editor, and search for the
        following string:
         <sec:filter-chain pattern="/**" filters="securityContextPersistenceFilter,resourceFilter,anonymousAuthFilter"/>
     2. Insert preAuthenticationFilter in the string:
         <sec:filter-
        chain pattern="/**" filters="securityContextPersistenceFilter,resourceFilter,preAuthenticationFilter,anonymousAuth
        Filter"/>
        Note: If you need to enable trusted sign-on for your web client users and also enable web tier lightweight single
        sign-on (LW-SSO) for integrations, add lwSsoFilter followed by preAuthenticationFilter , as shown in the
        following:
         <sec:filter-
        chain pattern="/**" filters="securityContextPersistenceFilter,resourceFilter,lwSsoFilter,preAuthenticationFilter,ano
        nymousAuthFilter"/>
        For information about how to enable LW-SSO in the web tier, see Configure LW-SSO in the Service Manager Web
        tier.
     3. Configure the parameters in the bean definition of preAuthenticationFilter according to the username format
        configured in Task 1.

             keepDomain:
             true, the login name of the Service Manager operators contains the domain name;
             false (default), does not contain.

             userPrincipalNameFormat:
             true, UserPrincipalName format;
             false (default), sAMAccountName format.

     4. If the web server connects to Tomcat by using the HTTPS protocol and passes the user name by a specific request
        header (for example, X-Remote-User ), you need to configure the web tier to get the remote user from the
        specific request header. Edit the <WEBTIER>/WEB-INF/classes/application-context.xml file to use the
         HttpHeaderPreAuthenticationFilter instead of the PreAuthenticationFilter for the preAuthenticationFilter bean.
        For example:

             <bean id="preAuthenticationFilter"
             class="com.hp.ov.cwc.security.spring.HttpHeaderPreAuthenticationFilter">

                 <property name="authenticationManager">
                     <ref bean="authenticationManager"/>

                 </property>
                 <property name="defaultRole">

                     <value>ROLE_PRE</value>
                 </property>
                 <property name="usernameHeaderKey">

                     <value>X-Remote-User</value>
                 </property>
             </bean>


   5. Restart the web application server.

Task 4: Configure each Windows client to use trusted sign-on.

Do the following for each Windows client:
   1. Make sure SSL encryption is enabled for the Windows client. See task 1.
   2. Open a client connection, and on the Connection tab select Use Trusted Sign-on.
   3. Make selections to the Keep domain and User Principal Name format checkboxes according to the username format
     set in Task 1.
   4. Click Apply.

Task 5: Configure the Mobility client to use trusted sign-on.

If the web server connects to Tomcat by using the AJP protocol, please follow below steps:
   1. Stop the web application server running the web tier.
   2. In the web tier's web.xml file, set isCustomAuthenticationUsed to false.
   3. In the <Tomcat>/conf/server.xml file, insert tomcatAuthentication="false" in the following section as shown below.

          <Connector protocol="AJP/1.3"
             secret="MyT0mcAt"
             address="0.0.0.0"
             port="8009"
             tomcatAuthentication="false"
             redirectPort="8443" />

   4. Edit the <MOBILITY>/WEB-INF/spring/security.xml file to enable preAuthenticationFilter for both the standard and ESS
     modes. Next, comment out idmPreAuthFilter , lwSsoFilter , springSecurity2lwssoIntegrationFilter , and
      httpHeaderPreAuthenticationFilter . Refer to the following examples.

          <security:http pattern="/#{globalProps['standardModePath']}/**" use-expressions="true">
                        <security:access-denied-handler ref="smAccessDeniedHandler"/>
                        <security:custom-filter ref="logoutFilterStandard" position="LOGOUT_FILTER"/>
                        <!--<security:custom-filter ref="idmPreAuthFilter" position="PRE_AUTH_FILTER"/> -->
                        <security:custom-filter ref="preAuthenticationFilter"

          after="SECURITY_CONTEXT_FILTER"/>
                        <!--<security:custom-filter ref="lwSsoFilter" before="BASIC_AUTH_FILTER"/>
                        <security:custom-filter ref="springSecurity2lwssoIntegrationFilter"

          position="LAST"/> -->
                        <!--<security:custom-filter ref="httpHeaderPreAuthenticationFilter"

          after="SECURITY_CONTEXT_FILTER"/>-->
                        <security:intercept-url pattern="/#{globalProps['standardModePath']}/**"

          access="hasRole('STD_USER')"/>
                        <security:intercept-url pattern="/#{globalProps['standardModePath']}/auth"

          method="POST" access="hasRole('STD_USER')"/>
                        <security:form-login login-page="/#{globalProps['standardModePath']}/login"
                                                               login-processing-url="/#

          {globalProps['standardModePath']}/auth"
                                                               username-parameter="user.id" password-parameter="old.password"
                                                               authentication-details-source-ref="detailSource"
                                                               authentication-failure-handler-ref="stdFailureHandler"
                                                               authentication-success-handler-ref="stdSuccessHandler"
                                                               default-target-url="/#{globalProps['standardModePath']}/"
                                                               always-use-default-target="true"/>

                        <security:intercept-url pattern="/#{globalProps['standardModePath']}/logout"
          method="POST"/>
          </security:http>


  <security:http pattern="/#{globalProps['essModePath']}/**" use-expressions="true">
         <security:access-denied-handler ref="smAccessDeniedHandler"/>
         <security:custom-filter ref="logoutFilterEss" position="LOGOUT_FILTER"/>
         <!--<security:custom-filter ref="idmPreAuthFilter" position="PRE_AUTH_FILTER"/> -->
         <security:custom-filter ref="preAuthenticationFilter" after="SECURITY_CONTEXT_FILTER"/>
         <!--<security:custom-filter ref="lwSsoFilter" before="BASIC_AUTH_FILTER"/>
         <security:custom-filter ref="springSecurity2lwssoIntegrationFilter" position="LAST"/> -

  ->
         <security:intercept-url pattern="/#{globalProps['essModePath']}/**"

  access="hasRole('ESS_USER')"/>
         <security:intercept-url pattern="/#{globalProps['essModePath']}/auth" method="POST"

  access="hasRole('ESS_USER')"/>
         <security:form-login login-page="/#{globalProps['essModePath']}/login"
                                                       login-processing-url="/#{globalProps['essModePath']}/auth"
                                                       username-parameter="user.id" password-parameter="old.password"
                                                       authentication-details-source-ref="detailSource"
                                                       authentication-failure-handler-ref="essFailureHandler"
                                                       authentication-success-handler-ref="essSuccessHandler"/>
         <security:intercept-url pattern="/#{globalProps['essModePath']}/logout" method="POST"/>

  </security:http>

According to the username format configured in Task 1, you may also need to configure the keepDomain and
userPrincipalNameFormat parameters in the bean definition of preAuthenticationFilter .

  keepDomain:
  true, the login name of the Service Manager operators contains the domain name;
  false (default), does not contain.

  userPrincipalNameFormat:
  true, UserPrincipalName format;
  false (default), sAMAccountName format.

If the web server connects to Tomcat by using the HTTPS protocol and pass the user name by a specific request header
(for example, X-Remote-User ), you need to configure the mobility to get the remote user from the specific request
header. Edit the <MOBILITY>/WEB-INF/spring/security.xml file to enable the security
filter httpHeaderPreAuthenticationFilter instead of preAuthenticationFilter . For example:


          <security:http pattern="/#{globalProps['standardModePath']}/**" use-expressions="true">
                 ...
                 <security:custom-filter ref="httpHeaderPreAuthenticationFilter"

          after="SECURITY_CONTEXT_FILTER"/>
                 ...

          </security:http>

          <security:http pattern="/#{globalProps['essModePath']}/**" use-expressions="true">
                 ...
                 <security:custom-filter ref="httpHeaderPreAuthenticationFilter"

          after="SECURITY_CONTEXT_FILTER"/>
                 ...

          </security:http>

          <bean id="httpHeaderPreAuthenticationFilter"
          class="com.hp.sw.sm.client.web.auth.preauth.HttpHeaderPreAuthenticationFilter"
          parent="preAuthenticationFilter">

                 ...
                 <property name="principalRequestHeader" value="X-Remote-User" />
                 ...
          </bean>

Task 6: Install and configure the web server (Apache or IIS) to use trusted
sign-on.

To install and configure the web server, see Configure a web server to redirect requests to the web tier.
To configure the web server to use trusted sign-on, see Example: Configuring the web server for trusted sign-on.

Task 7: Configure web browsers to enable web client users to use trusted
sign-on

You need to enable Integrated Windows Authentication (IWA) for browsers to use trusted sign-on.
For Edge or Chrome, follow these steps to enable IWA.

   1. Open Control Panel > Network and Internet > Internet Options.
   2. On the Security tab, add the FQDN of the web server (for example, apache.yourdomain.net) to the Trusted sites or the

     Local intranet sites.
   3. Click the Custom level button of the Trusted sites or the Local intranet sites, scroll down to User Authentication \

     Logon. Select the Automatic logon with current user name and password option.

For Firefox, follow these steps to enable IWA.

   1. Open Firefox, navigate to the about:config URL, and then accept the warning page.
   2. Type trusted-uris in the search field to filter options.
   3. Add the FQDN of the web server (for example, apache.yourdomain.net) to each option of network.automatic-ntlm-

     auth.trusted-uris and network.negotiate-auth.trusted-uris, and then save your updates.

Task 8: Test your trusted sign-on setup

   1. Start the Service Manager server, the web server (Apache or IIS), and the web application server (in this example,
     Tomcat).

   2. Start a Windows client, and log in using trusted sign-on.
     Service Manager should automatically log you in with your NT account username.

   3. Start the browser, and open the web tier login URL: https://apache.yourdomain.net/webtier/index.do
     Service Manager should automatically log you in without displaying the login screen.

Related topics


Trusted sign-on
Using LW-SSO with integrations
Requirements for trusted sign-on
Configure LW-SSO in the Service Manager Web tier


1.8.15.2.1. Example: Configuring the Web server for trusted
sign-on

To enable trusted sign-on for web tier clients, you must install and configure a web server (for example, Microsoft Internet
Information Services (IIS) or Apache), which receives the user information from the client through the browser, and passes
the user name and domain name to the web application server.

            Note

           The following steps assume that the web server and web application server configurations are already
           established and that the only necessary changes to the configurations of these servers are those described
           below.

Apache configuration changes

            Note

           In this example, the mod_authn_ntlm module is used for Apache on Windows and the mod_auth_gssapi module is
           used for Apache on Linux.

Windows

   1. Obtain the mod_authn_ntlm module from a binary distribution. For example, from Apache Haus.
   2. Extract the downloaded *.zip file, and then add the mod_authn_ntlm.so file to the <APACHE_HOME>/modules

     directory.
   3. Load the mod_authn_ntlm module in the <APACHE_HOME>/conf/httpd.conf file.

          # Load mod_authn_ntlm module
          LoadModule auth_ntlm_module modules/mod_authn_ntlm.so

   4. Configure the authentication type for the web application (for example, web tier) by adding the following lines to the
     default virtual host.

          <Location "/webtier">
             AuthName "Service Manager Web Client"
             AuthType SSPI
             NTLMAuth On
             NTLMAuthoritative On
             NTLMOfferBasic Off
             NTLMOmitDomain On
             <RequireAll>
                 Require valid-user
                 Require not user "NT-AUTHORITY\ANONYMOUS-LOGON"
             </RequireAll>

          </Location>

     Notes:
     If the Apache HTTP Server connects to Tomcat by using the HTTPS protocol, you need to set the user name to a
     specific request header (for example, X-Remote-User ). For example:


          <Location "/webtier">
             ...
             RewriteEngine On
             RewriteCond %{LA-U:REMOTE_USER} (.+)
             RewriteRule .* - [E=RU:%1]
             RequestHeader set X-Remote-User %{RU}e

          </Location>

     Note:
           The name within the Location tag needs to be the path the user enters to open the Service Manager web client
           website. Usually, the name is taken from the *.war file of the web tier.
           On Windows, the default virtual host is <VirtualHost _default_:80> defined in the
            <APACHE_HOME>/conf/extra/httpd-vhosts.conf file or <VirtualHost _default_:443> defined in the
            <APACHE_HOME>/conf/extra/httpd-ssl.conf file, depending on whether you turn on SSL for the Apache HTTP
           Server.

Linux

   1. On a Linux system, install the mod_auth_gssapi module and the mod_session module. For example:

          $ sudo yum install mod_auth_gssapi
          $ sudo yum install mod_session

   2. Create a user account named apache in the Active Directory (AD) and use this account as the Service Principal for the
     Apache HTTP server (httpd).
     Note: The user logon name is the hostname (without the domain part) where the Apache HTTP server is installed. On
     the Account tab, select User password never expires and This account supports kerberos AES 256 bit encryption
     options.

   3. Open a command prompt in the Windows system of the AD and generate the keytab file for the Apache HTTP server
     with the following command.

          > ktpass -princ HTTP/apache.yourdomain.net@YOURDOMAIN.NET -mapuser apache -crypto AES256-
          SHA1 -ptype KRB5_NT_PRINCIPAL -pass +rndPass -out c:/auth_apachehost_kerb.keytab

   4. Configure the Apache HTTP server to use mod_auth_gssapi with the keytab generated.
     Copy the keytab generated in step 3 from the Windows system to /etc/httpd/conf in the Linux system where the
     Apache HTTP server is installed and set appropriate file permission. For example:

          $ sudo chmod 755 /etc/httpd/conf/auth_apachehost_kerb.keytab

          $ sudo klist -e -k /etc/httpd/conf/auth_apachehost_kerb.keytab
          Keytab name: FILE:/etc/httpd/conf/auth_apachehost_kerb.keytab
          KVNO Principal
          ---- --------------------------------------------------------------------------

               6 HTTP/apache.yourdomain.net@YOURDOMAIN.NET (aes256-cts-hmac-sha1-96)

   5. Configure the authentication type for the SM web tier by adding the following lines to the default virtual host in
      /etc/httpd/conf.d/ssl.conf .


          <Location "/webtier">
                 AuthType GSSAPI
                 AuthName "Service Manager Web Client"
                 GssapiCredStore keytab:/etc/httpd/conf/auth_apachehost_kerb.keytab
                 GssapiUseSessions On
                 Session On
                 SessionCookieName gssapi_session path=/webtier;httponly;secure;
                 Require valid-user

          </Location>

     Notes:
     If the Apache HTTP Server connects to Tomcat by using the HTTPS protocol, you need to set the user name to a
     specific request header (for example, X-Remote-User ). For example:

          <Location "/webtier">
             ...
             RewriteEngine On
             RewriteCond %{LA-U:REMOTE_USER} (.+)
             RewriteRule .* - [E=RU:%1]
             RequestHeader set X-Remote-User %{RU}e

          </Location>

   6. Check the configuration and restart the Apache HTTP server.

          $ sudo apachectl configtest
          Syntax OK
          $ sudo systemctl restart httpd

IIS configuration changes

            Note

           You need to use either the BonCode AJP 1.3 connector or the Apache JK connector for TSO.

   1. Open the Internet Information Services (IIS) Manager.
   2. Select Default Web Site, and then double-click Authentication. Disable Anonymous Authentication, and then enable

     Windows Authentication. Edit the providers of the Windows Authentication by moving NTLM to the top of the enabled
     providers.


Your IIS web server configuration changes are completed. You can continue to configure the web browser's security settings
to enable trusted sign-on for web clients.

Related topics

Trusted sign-on
Example: Enabling trusted sign-on
Configure a web server to redirect requests to the web tier


1.8.15.2.2. Example: Configuring Single Sign-on with third
party authentication on the web tier

Configuring the Web Client for third-party authentication

   1. To activate single sign-on in Service Manager’s web tier, navigate to the <path to Web application>/WEB-INF/classes/
     directory.

   2. Open the application-context.xml file with a text editor. Update
      /**=httpSessionContextIntegrationFilter,anonymousProcessingFilter to
      /**=httpSessionContextIntegrationFilter,preAuthenticationFilter, anonymousProcessingFilter as described in the
     comment in the application-context.xml file.

   3. Save your changes and restart the web server on the Service Manager web tier.
   4. When using IIS you need to configure an ISAPI connector for your Web application server, and you need to modify the

     virtual directory to use Integrated Windows Authentication.

See the Customer Support Web site for Knowledge Base articles about configuring Integrated Windows Authentication on
common Web application servers or refer to Example: Configuring the Web server for trusted sign-on.

Defining a JavaBean® to handle authentication

All modifications for the single or trusted sign-on settings in the Service Manager Web Tier are done in the <path to web
application>/WEB-INF/classes directory in the application-context.xml file.

For Windows-based authentication, out-of-box Service Manager ships with a JavaBean called preAuthenticationFilter, which
is defined as follows:

  <bean id="preAuthenticationFilter"
  class="com.hp.ov.cwc.security.spring.PreAuthenticationFilter">
  <property name="authenticationManager">

      <ref bean="authenticationManager"/>
  </property>
  <property name="defaultRole">

      <value>ROLE_PRE</value>
  </property>
  </bean>

To use another authentication source that passes the username in the HTTP header, you add or replace the
preAuthenticationFilter block with code such as the following.

The following example shows how to add a new filter. To replace the filter, set the bean ID to preAuthenticationFilter (rather
than SiteminderPreAuthenticationFilter as shown below).


  <bean id="SingleSignOnpreAuthenticationFilter"
  class="com.hp.ov.cwc.security.spring.SiteminderPreAuthenticationFilter">
  <property name="authenticationManager">

      <ref bean="authenticationManager"/>
  </property>
  <property name="defaultRole">

      <value>ROLE_PRE</value>
  </property>
  <property name="keepDomain">

      <value>true</value>
  </property>
  <property name="siteminderUsernameHeaderKey">

      <value>USERNAME</value>
  </property>
  <property name="siteminderPasswordHeaderKey">

      <value>PASSWORD</value>
  </property>
  </bean>

In this definition, the siteminderUsernameHeaderKey property passes the user name value from the single sign-on tool to
Service Manager. To successfully pass the user name value, set the <value> element to the name of the property in the
HTTP header that stores the user name in the third-party authentication tool's configuration.
If the HTTP header is as follows, replace <USERNAME> with REMOTE_USER .

  POST /sc61server/ws HTTP/1.1
  Content-Type: text/xml; charset=utf-8
  SOAPAction: "Retrieve"
  Content-Length: 1474
  Expect: 100-continue
  […]
  REMOTE_USER: falcon
  Cookie: $Version=1; SessionId=127.0.0.1:4819

To activate the sign-on filters, modify the following line in the application-context.xml file.

  /**=httpSessionContextIntegrationFilter,
  SingleSignOnpreAuthenticationFilter,preAuthenticationFilter, anonymousProcessingFilter

The SingleSignOnpreAuthenticationFilter has to match the bean ID from above. If you want multiple sign-on filters, add them
in order to the filter chain. If you do this, the first to succeed will provide the authenticated username.
Note: The httpSessionContextIntegrationFilter always needs to be in the first position within the chain.

Integrating Custom Java Classes into the Java Bean

In Service Manager, it is possible to develop and use a custom Java class for third party authentication as well. You can either
write a new custom Java class or modify the existing Java class to fit the new requirements for Service Manager. The
requirements for the new Java class are described in the example of integrating an old Java class into the Service Manager
system. The modified Java class then needs to be put into the web-inf/classes directory, or as a jar file into web-inf/lib.
In the <path to web application>/WEB-INF/classes directory in the application-context.xml file, your bean will then look as
follows:


<bean id="preAuthenticationFilter"
class="com.hp.ov.cwc.security.spring.<custom java class>">
<property name="authenticationManager">

   <ref bean="authenticationManager"/>
</property>
<property name="defaultRole">

   <value>ROLE_PRE</value>
</property>
</bean>

The main modification you have to do to the old Java code is to remove all mention of the user object, which is not passed
into the class in Service Manager any longer. Instead, we return the user name, if authentication succeeded, or return null if it
failed. This username has to be returned after a successful run of the class.

Example: Creating a custom Java Class for Single-Sign-On using LDAP

This is an example of how to create a custom Java class for Single Sign-On using LDAP authentication. Actual implementation
will vary from system to system, depending on the LDAP server, setup and configuration.

The following classes are required to compile this example:

Class jar file                            Comments
jasypt-1.9.2.jar                          Part of the jasypt package. Copy the jar to <web-inf>\lib
commons-lang-2.6.jar                      Part of SM9 web client
commons-codec-1.4.jar                     Part of SM9 web client
com.ibm.icu_4.4.2.v20110208.jar           From the full client plugins folder
cwc-9.x.jar                               Part of SM9 web client
spring-core-3.2.15.RELEASE.jar            Part of SM9 web client
spring-beans-3.2.15.RELEASE.jar           Part of SM9 web client
spring-security-core-3.2.9.RELEASE.jar    Part of SM9 web client
spring-aop-3.2.15.RELEASE.jar             Part of SM9 web client
spring-context-3.2.15.RELEASE.jar         Part of SM9 web client
spring-expression-3.2.15.RELEASE.jar      Part of SM9 web client
spring-security-config-3.2.9.RELEASE.jar  Part of SM9 web client
spring-security-web-3.2.9.RELEASE.jar     Part of SM9 web client
spring-web-3.2.15.RELEASE.jar             Part of SM9 web client
servlet-api.jar                           Copied from Tomcat, only required for compilation.


package com.hp.ov.cwc.security.spring;
// servlet-api.jar

import javax.servlet.http.HttpServletRequest;
import java.util.Hashtable;
import javax.naming.Context;
import javax.naming.NamingEnumeration;
import javax.naming.NamingException;
import javax.naming.directory.Attributes;
import javax.naming.directory.SearchControls;
import javax.naming.directory.SearchResult;
import javax.naming.ldap.InitialLdapContext;
import javax.naming.ldap.LdapContext;
// defined in jasypt-1.9.2.jar
// should copy to app-lib folder
import org.jasypt.util.text.*;

// require spring jars in classpath
public class LDAPPreAuthenticationFilter extends PreAuthenticationFilter {

   public LDAPPreAuthenticationFilter() {
       keepDomain = false;
       credentialProvider = null;

//implements upn lookup if set to true can bbe overridden in application-context.xml
       useUPN = true;
       ldapBindDn = "";

//for example CN=adm2hartley,OU=Admins,OU=Users and Groups,OU=GC
CTR,OU=CTR,OU=Organizations,DC=company,DC=com";

       ldapBindPassword = "";
       ldapBaseDn = ""; //OU=Admins,OU=Users and Groups,OU=GC
CTR,OU=CTR,OU=Organizations,DC=company,DC=com";
       ldapServerURL = ""; //ldap://ldap.company.com:389";
//to implement - the filter would be iserted in an AND clause
//ldapExcludeFilter = (!(dn=*Contractors*))
   }

   protected String getAuthenticatedUsername(HttpServletRequest request) {
       String username = null;
       if (credentialProvider == null || credentialProvider.getUserName(request) != null &&

credentialProvider.getUserName(request).equals("")) {
          username = request.getRemoteUser();
          System.out.println("Default remote user : " + username);
          if (username != null)
              if (username.length() == 0)
                  username = null;
              else if (!keepDomain) {
                  int i = username.indexOf('\\');
                  username = username.substring(i + 1);
              }

       } else {
          username = credentialProvider.getUserName(request);

       }
       if (useUPN) {

          System.out.println("Using UPN. SamAcctName : " + username);
          String userUPNname = lookupUPN(username);
          System.out.println("Found this UPN : " + userUPNname);
          return userUPNname;
       } else {
          System.out.println("Not using UPN. Username : " + username);


       return username;
   }
}

public boolean useUPN() {
   return useUPN;

}

public void setuseUPN(boolean useUPN) {
   this.useUPN = useUPN;

}

public void setCredentialProvider(CredentialProvider credentialProvider) {
   this.credentialProvider = credentialProvider;

}

public String getldapBindDn() {
   return ldapBindDn;

}

public void setldapBindDn(String ldapBindDn) {
   this.ldapBindDn = ldapBindDn;

}

public String getldapBindPassword() {
   return ldapBindPassword;

}

public void setldapBindPassword(String ldapBindPassword) {
   this.ldapBindPassword = ldapBindPassword;

}

public String getldapBaseDn() {
   return ldapBaseDn;

}

public void setldapBaseDn(String ldapBaseDn) {
   this.ldapBaseDn = ldapBaseDn;

}

public String getldapServerURL() {
   return ldapServerURL;

}

public void setldapServerURL(String ldapServerURL) {
   this.ldapServerURL = ldapServerURL;

}

protected String lookupUPN(String samUserName)

String myUPNuser = "";

{
   try {
       Hashtable env = new Hashtable();
       String adminName = ldapBindDn;
       String adminPassword = ldapBindPassword;
       String ldapURL = ldapServerURL;
       env.put(Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.ldap. LdapCtxFactory");


             //set security credentials, note using simple cleartext authentication
             env.put(Context.SECURITY_AUTHENTICATION, "simple");
             env.put(Context.SECURITY_PRINCIPAL, adminName);
             //decrypt the password if it starts with *** else it is clear text, use as is.
             if (adminPassword.indexOf("***") == 0) {

                 adminPassword = adminPassword.substring(3);
                 BasicTextEncryptor textEncryptor = new BasicTextEncryptor();
                 // this password the same as that used to encrypt the adminpassword with FilterEncrypt
                 textEncryptor.setPassword("PssWrd");
                 adminPassword = textEncryptor.decrypt(adminPassword);
             }
             env.put(Context.SECURITY_CREDENTIALS, adminPassword);
             //connect to my domain controller
             env.put(Context.PROVIDER_URL, ldapURL);
             //Create the initial directory context
             LdapContext ctx = new InitialLdapContext(env, null);
             //Create the search controls
             SearchControls userSearchCtls = new SearchControls();
             //Specify the search scope
             userSearchCtls.setSearchScope(SearchControls.SUBTREE_SCOPE);
             //specify the LDAP search filter to find the user in question
             String userSearchFilter = "(&(objectClass=user)(sAMAccountName=" + samUserName + "))";
             //Specify the Base for the search
             String userSearchBase = ldapBaseDn;
             //Specify the attributes to return
             String userReturnedAtts[] = {"userPrincipalName"};
             userSearchCtls.setReturningAttributes(userReturnedAtts);
             //Search for objects using the filter
             NamingEnumeration userAnswer = ctx.search(userSearchBase, userSearchFilter,
  userSearchCtls);
             //Loop through the search results
             while (userAnswer.hasMoreElements()) {
                 SearchResult sr = (SearchResult) userAnswer.next();
                 Attributes attrs = sr.getAttributes();
                 if (attrs != null) {

                    myUPNuser = attrs.get("userPrincipalName").get().toString();
                 }
             }
         } catch (Exception e) {
             System.err.println("Problem searching directory: " + e);
             System.out.println("Problem searching directory: " + e);
         }
         return myUPNuser;
      }

      // added for UPNLookup
      boolean useUPN;
      String ldapBindDn;
      String ldapBindPassword;
      String ldapBaseDn;
      String ldapServerURL;
  }

This class contains a reference to FilterEncrypt, which is shown below:


import org.jasypt.util.text.*;
public class FilterEncrypt
{

   public static void main(String arg[])
   {

       try
       {

              String GivenPwd = arg[0];
              BasicTextEncryptor textEncryptor = new BasicTextEncryptor();
              textEncryptor.setPassword("PssWrd");
              String myEncryptedText = "***" + textEncryptor.encrypt(GivenPwd );
              System.out.println("here is the encrypted : " + myEncryptedText);
       }
   catch (Exception e)
   {
       e.printStackTrace();
   }
}
}
````
