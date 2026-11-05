---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.8.21.5 .. 1.8.22
printed_pages: 2624-2640
---

# 1.8.21.5 Configuring LW-SSO in FIPS mode

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.8.21.5. Configuring LW-SSO in FIPS mode

When running in FIPS mode, the Service Manager (SM) Server, Web Tier, Mobility Client, and Openfire Chat Server use a FIPS
validated cryptographic provider for Lightweight Single Sign-On (LW-SSO).
When Service Manager is running in FIPS mode, the following rules apply for web services clients (integrations):

     It is recommended to enable FIPS mode for the web service clients as well.
     Web service clients that don't support FIPS mode can still integrate with SM through normal TLS connections.
     LW-SSO will not work if the web service client doesn't support FIPS mode.

For more information about the support of FIPS mode for the products that can integrate with SM, see the documentation of
the specific products. This document covers only SM components.
The steps to configure LW-SSO in SM for FIPS mode are the same as for non-FIPS mode, except the cryptographic provider
configuration part. The steps are described in the following tasks:
Configure LW-SSO in the Server for FIPS mode
Configure LW-SSO in the Web tier for FIPS mode
Configure LW-SSO in the Mobility Client for FIPS mode
Configure LW-SSO in the Chat Server for FIPS mode
Configure LW-SSO in the Chat Service for FIPS mode


1.8.21.5.1. Configure LW-SSO in the Server for FIPS mode

Applies to User roles: System Administrator
Enabling LW-SSO in the Service Manager (SM) Server enables web service integrations from legacy HPE products to bypass
Service Manager authentication if the product user is already authenticated and a proper token is used; enabling LW-SSO in
both the Service Manager Server and Web Tier enables users to bypass the login prompts when launching the Service
Manager web client from legacy HPE applications.

            Caution

           To use LW-SSO, your Service Manager Web Tier and Server must be deployed in the same domain; therefore you
           should use the same domain name for the Web Tier and Server. If you fail to do so, users who log in from another
           application to the web tier can log in but may be forcibly logged out after a while.

Prerequisite:
Before you proceed, make sure you have enabled FIPS mode on the Service Manager Server side. For detailed instructions,
see Configure FIPS mode in the Server.
To configure LW-SSO in the Service Manager server for FIPS mode, follow these steps:

   1. Go to the <Service Manager server installation path>/RUN folder, and open lwssofmconf.xml in a text editor.
   2. Make sure that the enableLWSSOFramework attribute is set to true (default).
   3. Locate the following section.

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

   4. Update this section by doing the following:
           Comment out the ordinary crypoto configuration part.
           Uncomment the FIPS mode crypto configuration part.
           Configure the domain of the host.
           Update the default initString value to your own value, if needed.


                   Caution

                The initString value is shared among all parties that participate in LW-SSO. In FIPs mode, this value
                must be 32 characters long and contain no spaces; otherwise LW-SSO will not work in FIPS mode.

The following is an example:

  <lwssoValidation>
  <domain>myhostdomain.com</domain>
  <!--
  <crypto cipherType="symmetricBlockCipher"
  engineName="AES" paddingModeName="CBC" keySize="256"
  encodingMode="Base64Url"
  initString="This is a shared secret passphrase"/>
  -->
  <!-- When Service Manager is running in FIPS mode, the crypto configuration above needs to
  be replaced with the configuration below.
  The initString value must be 32 characters long and contain no spaces. -->
  <crypto cryptoSource="jce" cipherType="symmetricBlockCipher"
  engineName="AES" paddingModeName="CBC" keySize="256"
  pbeDigestAlgorithm="SHA1" encodingMode="Base64Url"
  jcePbeAlgorithmName="AES" jcePbeMacAlgorithmName="AES"
  macType="hmac"
  macAlgorithmName="SHA1" directKeyEncoded="true" directKeyEncoding="Base64Url"
  algorithmPaddingName="PKCS5Padding"
  pbeCount="20" macKeySize="256" macPbeCount="20"
  initString="1qaz2wsxfkvdvienfj4usldo9205mvid">
  </crypto>
  </lwssoValidation>

            Note

           Here, myhostdomain.com refers to the domain of the SM Server host.

      Note

           You're not recommended to modify the paddingModeName , keySize , encodingMode , engineName ,
           and cipherType attributes. If you need to modify them, be careful to ensure security and make sure that
           they are same with the LW-SSO settings of the other legacy HPE product that you want to integrate with
           Service Manager.
           Do not change the other configurations, such as the content in tag <restURLs> , and the attribute of tag
           <service> .


1.8.21.5.2. Configure LW-SSO on the web tier for FIPS mode

Applies to User roles: System Administrator
If Lightweight Single Sign-On (LW-SSO) is enabled on the Service Manager web tier, integrations from legacy HPE products
will bypass Service Manager authentication when launching the Service Manager Web client, provided that the user of the
legacy HPE product is already authenticated and a proper token is used.

            Note

                To enable users to launch the Web client from another legacy HPE product using LW-SSO, you must also
                enable LW-SSO in the Service Manager server.
                Once you have enabled LW-SSO in the web tier, web client users should use the web tier server's fully-
                qualified domain name (FQDN) in the login URL: http://<myWebtierHostName>.<myDomain>:
                <port>/webtier-x.xx/index.do
                The following procedure is provided as an example, assuming that the Service Manager web tier is deployed
                on Tomcat.

Prerequisite

     Before you proceed, make sure you have enabled FIPS mode on the web tier. For detailed instructions, see Configure
     FIPS mode on the web tier.

Steps to configure LW-SSO on the Service Manager web tier for FIPS mode

To configure LW-SSO on the Service Manager web tier for FIPS mode:
   1. Open the <Tomcat>\webapps\< Service Manager web tier>\WEB-INF\web.xml file in a text editor.
   2. Modify the web.xml file as follows:
        1. Set the <serverHost> parameter to the fully-qualified domain name of the Service Manager server.

                         Note

                      This is required to enable LW-SSO from the web tier to the server.

        2. Set the <serverPort> parameter to the communications port of the Service Manager server.
        3. Change the value of context parameter isCustomAuthenticationUsed to false.

                 <context-param>
                 <param-name>isCustomAuthenticationUsed</param-name>
                 <param-value>false</param-value>
                 </context-param>

        4. Remove the comment tags (<!-- and -->) enclosing the following elements to enable LW-SSO authentication.


             <!--
             <filter>
             <filter-name>LWSSO</filter-name>
             <filter-class>com.hp.sw.bto.ast.security.lwsso.LWSSOFilter</filter-class>
             </filter>
             -->
             ......
             <!--
             <filter-mapping>
             <filter-name>LWSSO</filter-name>
             <url-pattern>/*</url-pattern>
             </filter-mapping>
             -->

     5. Save the web.xml file.
3. Open the <Tomcat>\webapps\<Service Manager web tier>\WEB-INF\classes\lwssofmconf.xml file in a text editor.
4. Update the lwssofmconf.xml file as described in the following steps.

     1. Set the value of enableLWSSOFramework to true (default is false).

             <enableLWSSO
             enableLWSSOFramework="true"
             enableCookieCreation="true"
             cookieCreationType="LWSSO"/>

     2. Locate the following section.

             <lwssoValidation>
             <domain>yourdomain.net</domain>
             <crypto cipherType="symmetricBlockCipher"
             engineName="AES" paddingModeName="CBC" keySize="256"
             encodingMode="Base64Url"
             initString="This is a shared secret passphrase"/>
             <!-- When Service Manager is running in FIPS mode, the crypto configuration above needs
             to be replaced with the configuration below. The initString value must be 32 characters
             long and contain no spaces. -->
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

     3. Update this section by doing the following:
              Comment out the ordinary crypoto configuration part.
              Uncomment the FIPS mode crypto configuration part.
              Configure the domain of the host.
              Update the default initString value to your own value, if needed.


                      Caution

                   The initString value is shared among all parties that participate in LW-SSO. In FIPs mode, this
                   value must be 32 characters long and contain no spaces; otherwise LW-SSO will not work in
                   FIPS mode.

  The following is an example:

      <lwssoValidation>
      <domain>myhostdomain.com</domain>
      <!--
      <crypto cipherType="symmetricBlockCipher"
      engineName="AES" paddingModeName="CBC" keySize="256"
      encodingMode="Base64Url"
      initString="This is a shared secret passphrase"/>
      -->
      <!-- When Service Manager is running in FIPS mode, the crypto configuration above needs
      to be replaced with the configuration below.
      The initString value must be 32 characters long and contain no spaces. -->
      <crypto cryptoSource="jce" cipherType="symmetricBlockCipher"
      engineName="AES" paddingModeName="CBC" keySize="256"
      pbeDigestAlgorithm="SHA1" encodingMode="Base64Url"
      jcePbeAlgorithmName="AES" jcePbeMacAlgorithmName="AES"
      macType="hmac"
      macAlgorithmName="SHA1" directKeyEncoded="true" directKeyEncoding="Base64Url"
      algorithmPaddingName="PKCS5Padding"
      pbeCount="20" macKeySize="256" macPbeCount="20"
      initString="1qaz2wsxfkvdvienfj4usldo9205mvid">
      </crypto>
      </lwssoValidation>

4. In the <multiDomain> element, set the trusted hosts connecting through LW-SSO. If the Service Manager web tier
  server and other application servers connecting through LW-SSO are in the same domain, you can ignore the
   <multiDomain> element; If the servers are in multiple domains, for each server, you must set the correct
   DNSDomain (domain name), NetBiosName (server name), IP (IP address), and FQDN (fully-qualified domain
  name) values. The following is an example.

      <DNSDomain>yourdomain.net</DNSDomain>
      <NetBiosName>myserver</NetBiosName>
      <IP>1.23.456.789</IP>
      <FQDN>yourserver.yourdomain.net</FQDN>

               Note

             As of version 9.30, Service Manager uses <multiDomain> instead of <protectedDomains>, which is
             used in earlier versions. The multi-domain functionality is relevant only for UI LW-SSO (not for web
             services LW-SSO). This functionality is based on the HTTP referrer. Therefore, LW-SSO supports links
             from one application to another and doesn't support typing a URL in a browser window, except when
             both applications are in the same domain.

5. Check the secureHTTPCookie value (default: true).


                      Note

                         If you set secureHTTPCookie to true (default), you must also set secureLogin in the web tier
                         configuration file ( web.xml ) to true (default); if you set secureHTTPCookie to false , you can
                         set secureLogin to either true or false . In a production environment, you are recommended to
                         set both parameters to true .
                         If you don't want to use SSL, set both secureHTTPCookie and secureLogin to false .

     6. Save the lwssofmconf.xml file.
5. Open the <Tomcat>\webapps\<Service Manager web tier>\WEB-INF\classes\application-context.xml in a text editor.
6. Modify the application-context.xml as follows:

     1. Add lwSsoFilter to the filterChainProxy bean:

             <sec:filter-chain pattern="/**"
             filters="securityContextPersistenceFilter,resourceFilter,lwSsoFilter,anonymousAuthFilte
             r"/>

                      Note

                   If you need to enable web tier LW-SSO for integrations and also enable trusted sign-on for your web
                   client users, add lwSsoFilter followed by preAuthenticationFilter, as shown in the following:

                            <sec:filter-chain pattern="/**"
                            filters="securityContextPersistenceFilter,resourceFilter,lwSsoFilter,preAuthen
                            ticationFilter,anonymousAuthFilter"/>

        For information about how to enable trusted sign-on in Service Manager, see Example: Enabling trusted sign-on.
     2. Uncomment the lwSsoFilter bean by removing the comment tags:

             <bean id="lwSsoFilter"
             class="com.hp.ov.sm.client.webtier.lwsso.LwSsoPreAuthenticationFilter">
             <property name="authenticationManager">
             <ref bean="authenticationManager"/>
             </property>
             <property name="defaultRole">
             <value>ROLE_PRE</value>
             </property>
             </bean>

     3. Save the application-context.xml file.
7. Restart Tomcat so that the configuration takes effect.


1.8.21.5.3. Configure LW-SSO in the Mobility Client for FIPS
mode

If Lightweight Single Sign-On (LW-SSO) is enabled on both the Service Manager (SM) server and the Mobility Client, Service
Manager authentication will be bypassed if you have signed into another web application that also has LW-SSO enabled. The
detailed bypass criteria includes both the protected domain/IP/DNS name and the initial LW-SSO string.

Prerequisites

Before you proceed, make sure of the following:
     You have already enabled FIPS mode in the SM Server. For detailed steps, see Configure FIPS mode in the Server.
     You have already configured LW-SSO for FIPS mode in both the SM Server and Web Tier. For detailed steps, see
     Configure LW-SSO in the Server for FIPS mode and Configure LW-SSO in the Web tier for FIPS mode.
     You have enabled FIPS mode in the Mobility Client. For detailed steps, see Configure FIPS mode in the Mobility Client.

As an example, the following procedure assumes that you are deploying the Mobility Client on Tomcat.
To enable LW-SSO on the Mobility Client for FIPS mode, follow these steps:

   1. Extract the webapp-9.xx.xxxx.war file in an archive management program to the <Tomcat>/webapps directory.
   2. Open the web.properties file located in the <Tomcat>/webapps/<Mobility>/WEB-INF directory in a text editor.
   3. Update the web.properties file.

        1. Change the value of context parameter isCustomAuthenticationUsed to false.

                 isCustomAuthenticationUsed=false

        2. Save the file.
   4. Open the security.xml file located in the <Tomcat>/webapps/<Mobility>/WEB-INF/spring directory in a text editor.
   5. Update the security.xml file.

        1. Locate the following scripts:

                 <security:custom-filter ref="idmPreAuthFilter" position="PRE_AUTH_FILTER"/>
                 <!-- <security:custom-filter ref="preAuthenticationFilter"
                 after="SECURITY_CONTEXT_FILTER"/>
                 <security:custom-filter ref="lwSsoFilter" before="BASIC_AUTH_FILTER"/>
                 <security:custom-filter ref="springSecurity2lwssoIntegrationFilter" position="LAST"/> -
                 ->

        2. Comment out the first line, and then uncomment the third and fourth lines to enable LW-SSO, as shown in the
           following:

                 <!-- <security:custom-filter ref="idmPreAuthFilter" position="PRE_AUTH_FILTER"/>-->
                 <!-- <security:custom-filter ref="preAuthenticationFilter"
                 after="SECURITY_CONTEXT_FILTER"/> -->
                 <security:custom-filter ref="lwSsoFilter" before="BASIC_AUTH_FILTER"/>
                 <security:custom-filter ref="springSecurity2lwssoIntegrationFilter" position="LAST"/>

        3. Save the file.
   6. Open the lwssofmconf.xml file located in the <Tomcat>/webapps/<Mobility>/WEB-INF/classes directory in a text editor.
   7. Update the lwssofmconf.xml file.

        1. Change the enableLWSSOFramework parameter to true (default: false).

                 <enableLWSSO enableLWSSOFramework="true" enableCookieCreation="true"
                 cookieCreationType="LWSSO" enableSAML2Support="false"/>


2. Locate the following section.

      <lwssoValidation>
      <domain>yourdomain.net</domain>
      <crypto cipherType="symmetricBlockCipher"
      engineName="AES" paddingModeName="CBC" keySize="256"
      encodingMode="Base64Url"
      initString="This is a shared secret passphrase"/>
      <!-- When Service Manager is running in FIPS mode, the crypto configuration above needs
      to be replaced with the configuration below. The initString value must be 32 characters
      long and contain no spaces. -->
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

3. Update this section by doing the following:
        Comment out the ordinary crypoto configuration part.
        Uncomment the FIPS mode crypto configuration part.
        Configure the domain of the host.
        Update the default initString value to your own value, if needed.

                      Caution

                   The initString value is shared among all parties that participate in LW-SSO. In FIPs mode, this
                   value must be 32 characters long and contain no spaces; otherwise LW-SSO will not work in
                   FIPS mode.

  The following is an example:


               <lwssoValidation>
               <domain>myhostdomain.com</domain>
               <!--
               <crypto cipherType="symmetricBlockCipher"
               engineName="AES" paddingModeName="CBC" keySize="256"
               encodingMode="Base64Url"
               initString="This is a shared secret passphrase"/>
               -->
               <!-- When Service Manager is running in FIPS mode, the crypto configuration above needs
               to be replaced with the configuration below.
               The initString value must be 32 characters long and contain no spaces. -->
               <crypto cryptoSource="jce" cipherType="symmetricBlockCipher"
               engineName="AES" paddingModeName="CBC" keySize="256"
               pbeDigestAlgorithm="SHA1" encodingMode="Base64Url"
               jcePbeAlgorithmName="AES" jcePbeMacAlgorithmName="AES"
               macType="hmac"
               macAlgorithmName="SHA1" directKeyEncoded="true" directKeyEncoding="Base64Url"
               algorithmPaddingName="PKCS5Padding"
               pbeCount="20" macKeySize="256" macPbeCount="20"
               initString="1qaz2wsxfkvdvienfj4usldo9205mvid">
               </crypto>
               </lwssoValidation>

                        Note

                     Here, myhostdomain.com refers to the domain of the Mobility Client host. Beginning from the
                     <creation> section to the end of the lwssofmconf.xml file, the variables are subject to change
                     according to your actual deployment.

       4. Save the file.
 8. Restart the Mobility Client's web application server (in this example, Tomcat).
 9. Make sure the SM Server is started.
10. Make sure the Web Tier's web application server is started.
11. Launch the Mobility Client URL in a browser.

    The URL resembles the following: https://myMobilityHostFQDN:8443/Mobility/std/
12. Sign in to the Mobility Client and verify that LW-SSO from the Mobility Client to the Web Tier works correctly.


1.8.21.5.4. Configure LW-SSO in the Chat Server for FIPS
mode

Service Manager Collaboration uses LW-SSO to access and authenticate users. Service Manager Collaboration requires that
you configure LW-SSO for the Service Manager web tier and the Openfire Chat Server. When FIPS mode is enabled on the
SM Server, you need to configure LW-SSO in the Chat Server for FIPS mode.

Prerequisites

Before you proceed, make sure of the following:

   1. You have already successfully enabled FIPS mode on the SM Server side. For details, see Configure FIPS mode in the
     Server.

   2. You have already configured LW-SSO in the SM Server for FIPS mode. For details, see Configure LW-SSO in the Server
     for FIPS mode.

   3. You have already configured LW-SSO in the SM Web Tier for FIPS mode. For details, see Configure LW-SSO in the Web
     tier for FIPS mode.

To configure LW-SSO in the Chat Server for FIPS mode, follow these steps:

   1. Go to the <Openfire_home>\plugins\lwssoplugin folder, and open the lwssofmconf.xml file in a text editor.
   2. Make configuration as follows:

        1. Comment out or delete the <crypto> element in line 15.
        2. Uncomment the <crypto> element in line 23, and then update the default initString value to the same as you used

           in the SM server and web tier.
        3. Configure the domain of the host. See the following example:

                     <lwssoValidation>
                         <domain>mycompany.net</domain>
                                <crypto cryptoSource="jce" cipherType="symmetricBlockCipher"
                                engineName="AES" paddingModeName="CBC" keySize="256"
                                pbeDigestAlgorithm="SHA1" encodingMode="Base64Url"
                                jcePbeAlgorithmName="AES" jcePbeMacAlgorithmName="AES"
                                macType="hmac"
                                macAlgorithmName="SHA1" directKeyEncoded="true" directKeyEncoding="Base64Url"
                                algorithmPaddingName="PKCS5Padding"
                                pbeCount="20" macKeySize="256" macPbeCount="20"
                                initString="rqa9mkdmfkvdvienfj4usldo9205mvid"></crypto>

                 </lwssoValidation>

   3. Save your changes and close this file.
   4. Restart the Chat Server.
   5. Verify that SM Collaboration can work correctly. For more information, see Install Service Manager Collaboration.


1.8.21.5.5. Configure LW-SSO in the Chat Service for FIPS
mode

Service Manager Collaboration uses LW-SSO to access and authenticate users. Service Manager Collaboration requires that
you configure LW-SSO for the Service Manager web tier and the Openfire Chat Service. When FIPS mode is enabled on the
SM Server side, you need to configure LW-SSO in the Chat Service for FIPS mode.

Prerequisites

Before you proceed, make sure of the following:

   1. You have already successfully enabled FIPS mode on the SM Server side. For details, see Configure FIPS mode in the
     Server.

   2. You have already configured LW-SSO in the SM Server for FIPS mode. For details, see Configure LW-SSO in the Server
     for FIPS mode.

   3. You have already configured LW-SSO in the SM Web Tier for FIPS mode. For details, see Configure LW-SSO in the Web
     tier for FIPS mode.

   4. You have already configured LW-SSO in the Chat Server for FIPS mode. For details, see Configure LW-SSO in the Chat
     Server for FIPS mode.

To configure LW-SSO in the Chat Service for FIPS mode, follow these steps:

   1. Go to the <Chat Service_home>\conf folder, and open the lwssofmconf.xml file in a text editor.
   2. Make configuration as follows:

        1. Comment out or delete the <crypto> element in line 15.
        2. Uncomment the <crypto> element in line 23, and then update the default initString value to the same as you used

           in the SM server and web tier.
        3. Configure the domain of the host. See the following example:

                 <lwssoValidation>
                                <domain>mycompany.net</domain>
                                <crypto cryptoSource="jce" cipherType="symmetricBlockCipher"
                                engineName="AES" paddingModeName="CBC" keySize="256"
                                pbeDigestAlgorithm="SHA1" encodingMode="Base64Url"
                                jcePbeAlgorithmName="AES" jcePbeMacAlgorithmName="AES"
                                macType="hmac"
                                macAlgorithmName="SHA1" directKeyEncoded="true" directKeyEncoding="Base64Url"
                                algorithmPaddingName="PKCS5Padding"
                                pbeCount="20" macKeySize="256" macPbeCount="20"
                                initString="rqa9mkdmfkvdvienfj4usldo9205mvid"></crypto>

                 </lwssoValidation>

   3. Save your changes and close this file.
   4. Restart the Chat Service.
   5. Verify that SM Collaboration can work correctly. For more information, see Install Service Manager Collaboration.


1.8.22. Tokenization

The Service Manager web tier has tokenization enabled by default. Enabling tokenization helps safeguard sensitive data.
When tokenization is enabled, the web tier appends a token to URLs and checks requested URLs that contain any predefined
actions or match any predefined patterns to see if they have the token appended; if the token is not found, the web tier
returns an error.
Administrators can also disable this feature by turning off a parameter in the web tier configuration file ( web.xml ).

Related parameters

Three web.xml parameters are used for tokenization (see the following table). Out-of-the-box, the simpleURLs and
patterns parameters aren't present in the web.xml file. If you don't add them, their default values take effect.

            Note

           To enable tokenization, enabling the antiCSRFEnabled parameter is enough. Adding the other parameters is
           unnecessary unless you need to change their values from the default ones.


Parameter Name   Parameter Value             Default Value                  Description
antiCSRFEnabled  true or false
                                             true                           Set it to true to enable
simpleURLs       A list of comma-separated
                 servlet actions that a URL                                 token validation or false to
                 can contain.
                                                                            disable the feature.

                                             <![CDATA[service.do,           This parameter takes effect
                                             detail.do, list.do,            only when
                                             mashup.do, frames.do,          antiCSRFEnabled is set to
                                             printList.do, printDetail.do,  true . If a requested URL
                                             uim.do, nav.menu, wf, ce,      contains any of the listed
                                             cm, /upload, /imageupload,     actions and also has no
                                             /attachmentupload,             token appended, the
                                             /uniqueupload]]>               SM web tier returns a 403
                                                                            error.

                                                                            When antiCSRFEnabled is
                                                                            set to false , the web tier
                                                                            neither checks for a token
                                                                            in the requested URLs, nor
                                                                            appends a token to any
                                                                            URLs.

                                                                            Note

                                                                            We recommend
                                                                            that you use the
                                                                            default list. If
                                                                            needed, you
                                                                            can remove
                                                                            actions from
                                                                            the default list,
                                                                            but can't add
                                                                            new ones.

                                                                            Note

                                                                            Token
                                                                            validation is
                                                                            skipped for the
                                                                            following
                                                                            actions:
                                                                            index.do ,
                                                                            ess.do ,
                                                                            accessible.do ,
                                                                            and
                                                                            accessible_ess
                                                                            .do .


Parameter Name  Parameter Value            Default Value               Description
patterns
                A comma separated list of  <![CDATA[attachments/,      This parameter takes effect
                patterns                   /download/, /colla/api/]]>  only when
                                                                       antiCSRFEnabled is set to
                                                                       true , and is ignored when
                                                                       the simpleURLs validation
                                                                       has passed.

                                                                       If a requested URL matches
                                                                       any of the listed patterns,
                                                                       the web tier performs token
                                                                       validation on it.

                                                                                   Note

                                                                                  We recommend
                                                                                  that you use the
                                                                                  default list. If
                                                                                  you want, you
                                                                                  can remove a
                                                                                  pattern from the
                                                                                  default list, but
                                                                                  can't add new
                                                                                  ones.

Enable or disable tokenization in the web client

By default, tokenization is enabled in the web client. You can customize the tokenization settings or disable tokenization.
To customize tokenization settings:

   1. In the web.xml file, locate the following filter and check that antiCSRFEnabled is set to true:

          <filter>
                 <filter-name>antiCSRFFilter</filter-name>
                 <filter-class>com.hp.ov.web.csrf.AntiCSRFFilter</filter-class>
                 <init-param>
                        <param-name>antiCSRFEnabled</param-name>
                        <param-value>true</param-value>
                 </init-param>

          </filter>

   2. Add the other two parameters if you want to assign them a custom value.

                   Note

                We recommend that you use the default values for the two parameters; however, you are allowed to remove
                values from the default action/pattern list, but you can't add new ones.

                   Tip

                Ignore this step if you want to use the default values.

     You should add the parameters as shown in the following.


          <filter>
                 <filter-name>antiCSRFFilter</filter-name>
                 <filter-class>com.hp.ov.web.csrf.AntiCSRFFilter</filter-class>
                 <init-param>
                        <param-name>antiCSRFEnabled</param-name>
                        <param-value>true</param-value>
                 </init-param>
                 <init-param>
                        <param-name>simpleURLs</param-name>
                        <param-value><your custom URL action list></param-value>
                 </init-param>
                 <init-param>
                        <param-name>patterns</param-name>
                        <param-value><your custom pattern list></param-value>
                 </init-param>

          </filter>

   3. Save the web.xml file.
   4. If you want to disable tokenization, set antiCSRFEnabled to false.
   5. Restart your web application server.

To disable tokenization:

   1. Set antiCSRFEnabled to false.
   2. Save the web.xml file.
   3. Restart your web application server.

Related topics

Web parameter: antiCSRFEnabled
````
