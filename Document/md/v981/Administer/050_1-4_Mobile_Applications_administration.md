---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.4 .. 1.4.3
printed_pages: 1184-1212
---

# 1.4 Mobile Applications administration

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.4. Mobile Applications administration

This section provides details about how to tailor Service Manager Mobile Applications to support
your business processes.
This section includes:

     Tailoring Mobile Applications in Service Manager
     Protecting communications between Mobile Applications and the Service Manager server
     Mobile Applications Form Widgets
     Mobile Applications for Service Manager Process Designer


1.4.1. Tailoring Mobile Applications in Service
Manager

When you have finished installing Mobile Applications, you can tailor the following in Service
Manager:

     Set up email notifications to include URL links
     Configure the prefix of a record
     Add a view for Mobile Applications
     Add a form for Mobile Applications
     Customize the fields on Mobile Applications form
     Customize the action bar options
     Configure the maxRequestPerSecond parameter


1.4.1.1. Set up email notifications to include
URL links

A Service Manager System Administrator can set up email notifications to include the mobility
URL. Hence, when tickets are assigned, field engineers can receive email notifications and click
on the URL links in the emails to go directly to the assigned ticket.
Service Manager Mobile Applications automatically synchronizes users' mobile data with
information in the Service Manager database. After sending an email notification to a field
engineer, Service Manager Mobile Applications searches for the record by name and then
displays it. If the record isn't in the cached database, Mobile Applications queries Service
Manager to fetch the record.

To set up email notifications, follow these steps:

   1. Restart the Service Manager Mobile Applications server.

   2. Sign in to the Service Manager server as a System Administrator.

   3. Click System Administration > Base System Configuration > Miscellaneous > System
     Information Record.

   4. Select the Active Integrations tab.
   5. In the Mobility URL field, type the fully qualified URL to the Service Manager server from the

     Mobile Applications client.

     For example: http://<servername>:<portnumber>/<appname>/std/
     Where:
      servername is the host name or IP address of the Service Manager server.
      portnumber is the port number. For example, 8080.
      appname is the name of the deployed Service Manager Mobile Applications client WAR
     or EAR file. For example, webapp-x.xx.xxxx.war .
     The server stores the value of this field in the $L.mobility.url global variable.
   6. Save your changes.


1.4.1.2. Configure the prefix of a record

To configure the prefix of an incident record or a change request which already has a prefix,
follow these steps:

   1. Sign in to the Service Manager server as a System Administrator.
   2. Type gl in the Service Manager command line field, and then press Enter.
   3. Type UniSearch Types in the List Name field, and then click Search.
   4. Verify and configure the values in the Value List field and the Display List field. Refer to the

     following screenshot as an example:

   5. Click Save, and then click OK.

To configure the prefix of an incident record or a change request which doesn't have a prefix,
follow these steps:

   1. Sign in to the Service Manager server as a System Administrator.
   2. Type gl in the Service Manager command line field, and then press Enter.
   3. Type Universal Search Customize List in the List Name field, and then click Search.

   4. Add customized record type to the Value List field and then add the corresponding prefix to
     the Display List.

     Refer to the following screenshot as an example:


  The out-of-the-box record is svcCartItem with the prefix sci . When you search for sci1 ,
  the List view displays the svcCartItem record with the ID of 1.
5. Click Save, and then click OK.


1.4.1.3. Add a view for Mobile Applications

Service Manager Mobile Applications provides several out-of-box views to access
individual and group records. For example, the default views of Incidents are
Assigned to Me and Assigned to My Groups. As the system administrator, you can
add more views for the end-users. For example, if a group of users regularly searches
on the same query, you can provide them with a shared query view as their default
whenever they sign in to Service Manager from the Mobile Applications client.

To display an existing view in the Mobile Applications client, follow these steps:

   1. Sign in to Service Manager using the Windows client as a System Administrator.
   2. From the System Navigator, click Favorites and Dashboards.
   3. Right-click the favorite that you want to edit, and then select Properties. The

     View Definition form opens.
   4. Select the Mobile Accessible checkbox.
   5. In the Audience tab, update the audience which is exposed to the view, and then

     click Save.

            Tip

           You may need to configure the access to browse for certain views:

              1. From the System Navigator, click System Administration > Base
                System Configuration > Miscellaneous > View/Favorites.

              2. Select the view and click the Audience tab.
              3. Select Selected Groups and update the Groups list.

To create a new view for the Mobile Applications client, follow these steps:

   1. Sign in to Service Manager using the Windows client as a System Administrator.
   2. Click System Administration > Base System Configuration > Miscellaneous >

     Views/Favorites.
   3. Click New. The New View wizard opens.
   4. Select the Area to create the view and then click Next.
   5. Specify the name and type for the view you wish to create, and then click Next.

   6. Select the fields you want in your view.

     Click Fields. To add fields, select items from the table menu and click Add to
     List.


                   Note

                If you select a field that has a link to another table, select from the
                secondary menu to add fields you want in the view.

   7. Select properties for Group By, Sort By, Filter, and Autoformat as desired.
   8. Click Finish.
   9. Select the Mobile Accessible checkbox.
 10. In the Audience tab, select an audience for the view and then click Save.
 11. Open the To Do Queue, select the area in the Queue field as you defined in step

     4 and check which form is used by the new view.
 12. Open Form Designer and search for the form.

 13. Click More Actions > Copy/Rename to copy the form with a mobile suffix.

                   Note

                When copying the forms, don't omit the .g suffix which is used by
                some forms. For example, you can copy sc.manage.cmr.g to
                sc.manage.cmr.g.mobile.

To remove a view from the Mobile Applications client, follow these steps:

   1. Sign in to Service Manager using the Windows client as a System Administrator.
   2. From the System Navigator, click Favorites and Dashboards.
   3. Right-click the favorite that you want to edit, and then select Properties. The

     View Definition form opens.
   4. In the Audience tab, update the audience which is to be excluded from the view;

     or you can clear the Mobile Accessible checkbox to remove the view from
     Mobile Applications.
   5. Click Save.


1.4.1.4. Add a form for Mobile Applications

After you added a new view that enables you to navigate through lists of records, you
need to add forms for these records in the List view.

To add a form for the Mobile Applications, follow these steps:

   1. Sign in to Service Manager using the Windows client as a System Administrator.
  2. Select the area in the Queue field as you defined in step 4 of To create a new

     view for the Mobile Applications client.
   3. Select the view you created in the View field.
   4. Open a record and check which form the record uses.
   5. Click Tailoring > Forms Designer and search for the form.

   6. Click More Actions > Copy/Rename to copy the form with a mobile suffix. For
     example, you can copy IM.close.incident to IM.close.incident.mobile.

                   Note

                The form used by a record may vary with different status or phases
                of that record. You need to add a form for each status or phase
                respectively. For example, the form associates with an Incident can
                be either IM.close.incident or IM.update.incident. If you have made
                any omissions, the Mobile Applications client will automatically
                synchronize data with the original form in the Service Manager
                database after you logged on to the system.


1.4.1.5. Customize the fields on Mobile
Applications form

For a better appearance of a record's Detail view on the screen of your smartphone,
you may need to add, rearrange or remove the fields on a Mobile Applications form.

For detailed information about the widgets on Service Manager Mobile Applications
forms, see Mobile Applications Form Widgets.

To customize the fields on a Mobile Applications form, follow these steps:

  1. Follow step 1 to step 4 as described in Add a form for Mobile Applications.
   2. Click Tailoring > Forms Designer and search for the form with the .mobile suffix.
   3. Click Design to open design mode.

   4. Remove the fields which aren't exposed to be displayed on the form. The field
     groups will be displayed as corresponding tabs in the Detail view on Mobile
     Applications client.

                   Note

                      Do not nest field groups.
                      For usability and performance issues, don't include more than
                      ten fields in a group.

                      If there is one field group defined on a form at a minimum, the
                      widgets which aren't included in this group will not be
                      displayed on a Mobile Applications form.

   5. Specify the Label for property of every lable to match with the Name property of
     the widget next to it.

     Take the IM.close.incident.mobile form for example. If the Name property of the
     Incident ID text box is id , the Label for property of the Incident ID lable must be
     specified to id .

   6. Before adding a field, make sure the field exists in the Database Dictionary.
     Otherwise, you must firstly add this new field to the Database Dictionary. See
     Add a field to a table for detailed steps.

   7. Click OK to save your customization.


1.4.1.6. Customize the action bar options

To customize the action bar options on the Mobile Applications client, follow these
steps:

   1. Sign in to Service Manager using the Windows client as a System Administrator.
  2. Select the area in the Queue field as you defined in step 4 of To create a new

     view for the Mobile Applications client.
   3. Open a record and check which display screen the record uses. For example,

     cm.view.display.
   4. From the System Navigator, click Tailoring > Tailoring Tools > Display Screens

     and search for the display screen.
   5. Click Show in Mobility.
   6. Select the area in the File Name field.
   7. Select Mobile in the Client Type field, and then click Search. IDs of the action

     bar options are displayed in the Button Ids field.
   8. Refer to the option IDs and the actions listed in the Options tab, add or remove

     the IDs.
   9. Click Save to save your customization.


1.4.1.7. Configure the
maxRequestPerSecond parameter

The maxRequestPerSecond parameter in the Service Manager Mobile Applications
configuration file (web.xml) defines the maximum allowed request per second for one
user session from the Service Manager Mobile Applications client. The default value
for this parameter is 10. To allow unlimited requests, set the value to -1.


1.4.2. Localize Service Manager Mobile
Applications

The officially supported languages of Service Manager can meet most localization
requirements. However, if you need to localize Mobile Applications to support
additional languages, follow these steps:

   1. Service Manager configurations.

        1. Localize the Service Manager server (including messages and formats) to
           the new language.

        2. Refer to Add a form for Mobile Applications to add new forms for Mobile
           Applications.

   2. Service Manager Mobile Applications configurations.

        1. Copy <mobile web application directory>\WEB-
           INF\classes\appLoginBundle.properties and save this file as <mobile web
           application directory>\WEB-INF\classes\appLoginBundle_<Service
           Manager language ID>.properties.

                         Tip

                      Refer to the Service Manager language table for a list of
                      language IDs. For example, if the new language is Malay,
                      change appLoginBundle_<Service Manage Language
                      ID>.properties to appLoginBundle_z3.properties.

        2. Translate each text string in appLoginBundle_<Service Manager language
           ID>.properties to the new language and then save this file.

        3. Using native2ascii or other tools to convert appLoginBundle_<Service
           Manager language ID>.properties to one with ASCII and/or Unicode
           escapes.

                         Tip

                      For detailed usage of native2ascii, refer to the following Oracle
                      web page:
                      http://docs.oracle.com/javase/7/docs/technotes/tools/windows
                      /native2ascii.html.


4. Copy <mobile web application directory>\WEB-
  INF\classes\appMainBundle.properties and save this file as <mobile web
  application directory>\WEB-INF\classes\appMainBundle_<Service Manager
  language ID>.properties.

5. Translate each text string in appMainBundle_<Service Manager language
  ID>.properties to the new language and then save this file.

6. Using native2ascii or other tools to convert appMainBundle_<Service
  Manager language ID>.properties to one with ASCII and/or Unicode
  escapes.

7. Restart the web applications server and launch Service Manager Mobile
  Applications again.


1.4.3. Protecting communications
between Mobile Applications and the
Service Manager server

To protect communications between Mobile Applications and the Service Manager
server, you can perform the following tasks:

     Set up Secure Sockets Layer (SSL)
     Set up trusted sign-on (TSO)
     Set up Lightweight Single Sign-On (LW-SSO)


1.4.3.1. Set up Secure Sockets Layer (SSL)

Service Manager supports Secure Hypertext Transfer Protocol (HTTPS), which
encrypts and decrypts message requests and responses. Service Manager uses
Secure Sockets Layer (SSL) for encryption only and relies on the server to
authenticate each operator's user name and password. Service Manager supports
SSL for the following connections:

     SSL on the Service Manager server to encrypt all communications between
     clients and the server
     SSL on the Mobile Applications client to verify the client's identity and limit
     server connections to these identified clients

For detailed information about how to enable SSL in Service Manager, refer to
Configure two-way SSL.

Enable SSL on the Service Manager server

Service Manager clients send the operator’s user name and password in each request
as part of an HTTP Basic Authorization header. In order to protect these operators’
user names and passwords, you can enable SSL on the Service Manager server.

Enabling SSL on the Service Manager server includes three major steps:

   1. Purchase a certificate for the Service Manager server from a certificate
     authority, or create a certificate by yourself.

   2. Create a server keystore. For detailed steps, refer to Configure two-way SSL.

   3. Add SSL parameters to the sm.ini file.

                   Note

                Ignore the SSO parameters in the table at this point.

Enable SSL on the Mobile Applications client

In order to restrict access to the server to only clients that are known and identified by
the server, you can enable SSL on Service Manager clients. Enabling SSL on clients
requires creating or purchasing signed certificates for each Service Manager client.
Service Manager Mobile Applications can share a single signed certificate for all
handset connections. If you enable SSL on the client, we recommend that you also


enable SSL on the server to encrypt all communications between clients and the
server.

To enable SSL on the Mobile Applications client, follow these steps:

   1. Purchase a certificate for the Mobile Applications client host from the same
     certificate authority for the Service Manager server certificate, or create a
     certificate by yourself.

   2. Create a client keystore. For detailed steps, refer to Configure two-way SSL.
   3. Import the client certificate to a trusted clients keystore. For example,

     trustedclients.keystore.
   4. Copy the trusted clients keystore (trustedclients.keystore) to the Service

     Manager server's RUN folder.
   5. Open webapp-9.70.xxxx.war in an archive management program.
   6. Copy the cacerts file to the WEB-INF directory.
   7. Extract the web.properties file from the WEB-INF directory to your local system,

     and then open this file in a text editor.

   8. Locate the following codes and configure the parameters as follow:

          endpoint=https://full.qualified.domain.name:13443/SM/ui

          cacerts=

          keystore=

          keystorePassword=

          cacertsPassword=


              Required parameters for Mobile Applications client SSL configurations

9. Parameter                            Default value              Description

endpoint                                https://full.qualified.do  Change
                                        main.name:13443/SM/        full.qualified.domain.n
                                        ui                         ame to the domain
                                                                   name of your Service
                                                                   Manager server.

                                                                   Change 13443 to
                                                                   your SSL port number.

cacerts                                 The default value is       The keystore that
keystore                                null.                      contains your server's
                                                                   certificate authority.
                                        The default value is       For example, /WEB-
                                        null.                      INF/cacerts.

                                                                   The keystore that
                                                                   contains your
                                                                   mobility's signed
                                                                   certificate. For
                                                                   example, /WEB-
                                                                   INF/smmobile.p12.

Parameter                               Default value                             Service Manager 9.81
keystorePassword
                                        The default value is  Description
                                        null.
                                                              The password of the
                                                              keystore file. We
                                                              recommend adding a
                                                              strong password for
                                                              the keystore. After you
                                                              restart the Mobile
                                                              Applications client, the
                                                              keystore password is
                                                              encrypted and the
                                                              original
                                                              keystorePassword=
                                                              code is automatically
                                                              updated to
                                                              *keystorePassword=
                                                              <encrypted string> .

Parameter                               Default value                      Service Manager 9.81

                                                       Description

                                                                   Note

                                                                  The
                                                                  preceding
                                                                  asterisk (*)
                                                                  implies that
                                                                  the
                                                                  keystore
                                                                  password
                                                                  is
                                                                  encrypted.
                                                                  To change
                                                                  the
                                                                  password,
                                                                  remove the
                                                                  asterisk
                                                                  and
                                                                  replace the
                                                                  encrypted
                                                                  string with
                                                                  the new
                                                                  password.

Parameter                               Default value                             Service Manager 9.81
cacertsPassword
                                        The default value is  Description
                                        null.
                                                              The password of the
                                                              cacerts file. We
                                                              recommend adding a
                                                              strong password for
                                                              the cacerts. After you
                                                              restart the Mobile
                                                              Applications client, the
                                                              password is encrypted
                                                              and the original
                                                              cacertsPassword=
                                                              code is automatically
                                                              updated to
                                                              *cacertsPassword=
                                                              <encrypted string> .

                                                                          Note

                                                                         The
                                                                         preceding
                                                                         asterisk (*)
                                                                         implies that
                                                                         the cacerts
                                                                         password
                                                                         is
                                                                         encrypted.
                                                                         To change
                                                                         the
                                                                         password,
                                                                         remove the
                                                                         asterisk
                                                                         and
                                                                         replace the
                                                                         encrypted
                                                                         string with
                                                                         the new
                                                                         password.


 10. Save the file and add the updated file back to the WEB-INF directory of the
     webapp-9.61.xxxx.war archive.

 11. Restart the Service Manager Mobile Applications client.

Set up SSL between the smartphone browser and
Mobile Applications

You can set up SSL to allow smartphone browsers and web servers to communicate
over a secure connection. The data being sent is encrypted by one side, and
decrypted by the other side before processing. This is a two-way process, meaning
that both the server and the browser encrypt all traffic before sending out the data.

After SSL is set up on the web servers, browsers which support secure flag only send
cookies with the secure flag when the request is going to an HTTPS page, that is, the
browser doesn't send a cookie with the secure flag set over an unencrypted HTTP
request.

You need to set up SSL on the web server or web application server where the Mobile
Applications client is deployed, and update the port number mapping for the Mobile
Applications client as necessary.

Set up SSL on you web server

For details, refer to the documentation of your web server.

            Note

           It is recommended to enable HTTPOnly and Secure cookies on your web
           application server to help prevent malicious JavaScript injection and make
           the browser (or other http clients) only send cookies over SSL
           connections. For more information, see
           https://softwaresupport.softwaregrp.com/km/KM02233778.

Set up SSL on Tomcat

Configuring Tomcat to use SSL is only necessary when Tomcat is run as a stand-
alone web server. When Tomcat is primarily run as a Servlet/JSP container behind
another web server, such as Apache or Microsoft IIS, it is necessary to configure the
primary web server to handle the SSL connections from users. Typically, this server
negotiates all SSL-related functionality, and then pass on any requests destined for
the Tomcat container only after decrypting those requests. Likewise, Tomcat returns
cleartext responses that are encrypted before being returned to the user's browser. In
this case, Tomcat knows that communications between the primary web server and


the client are taking place over a secure connection, but it doesn't participate in the
encryption and decryption processes.
For information about how to set up SSL on Tomcat, refer to Apache Tomcat SSL
Configuration HOW-TO document.

            Note

           Since you have already got your certificates for the server as described in
          the previous step in the Enable SSL on the Mobile Applications client
           section, you only need to perform the steps in the Edit the Tomcat
           Configuration File section in Apache Tomcat SSL Configuration HOW-TO
           document.

Update the port number mapping for the Mobile Applications client
To update the port number mapping for the Mobile Applications client, follow these
steps:

   1. Go to Tomcat webapps directory of Mobile Applications.
   2. Open WEB-INF\spring\security.xml with a text editor.
   3. Locate the following codes, and then update the default security ports as

     necessary.

          <security:http auto-config='true'>
          <security:port-mappings>
          <security:port-mapping http="8080" https="8443"/>
          </security:port-mappings>
          <security:intercept-url pattern="/**" requires-
          channel="https"/>
          </security:http>

                   Note

                Remember to update the port number to the same as the
                configuration in your web server or web application server.

   4. Save the changes.


1.4.3.2. Set up trusted sign-on (TSO)

Trusted sign-on (TSO) or Single sign-on is an optional Mobile Applications
configuration that relies on a working SSL configuration, and integration with a trusted
authentication source such as CA SiteMinder, IBM Webseal, and Integrated Windows
Authentication. It also requires a web server to accept the pre-authenticated HTTP
header information from your authentication source.
For more information, refer to Example: Configuring Single Sign-on with third party
authentication on the web tier.
When you enable trusted sign-on (TSO), Mobile Applications will used the username
of the user represented by the Principal to bypass the Service Manager log-on
screen, and then enter the application directly.

Enable TSO on the Service Manager server

In the sm.ini file, add the following parameter:

  trustedsignon:1

Enable TSO on the Mobile Applications client

To enable TSO on the Mobile Applications client, follow these steps:

   1. Open webapp-x.xx.xxxx.war in an archive management program.
   2. Extract the web.properties file from the WEB-INF directory to your local system,

     and then open this file in a text editor.
   3. Locate the isCustomAuthenticationUsed script and set the value to false :

          # Set false to enable Trusted Sign-on
          isCustomAuthenticationUsed=false

   4. Save the file and add the updated file back to the WEB-INF directory of the
     webapp-x.xx.xxxx.war archive.

   5. Extract the security.xml file from the WEB-INF/spring directory to your local
     system, and then open this file in a text editor.

   6. Locate the following scripts:


      <!-- <security:custom-filter ref="preAuthenticationFilter"
      after="SECURITY_CONTEXT_FILTER"/>
      <security:custom-filter ref="lwSsoFilter"
      before="BASIC_AUTH_FILTER"/>
      <security:custom-filter
      ref="springSecurity2lwssoIntegrationFilter"
      position="LAST"/> -->

  Uncomment the first line as follows to enable TSO:

      <security:custom-filter ref="preAuthenticationFilter"
      after="SECURITY_CONTEXT_FILTER"/>
      <!-- <security:custom-filter ref="lwSsoFilter"
      before="BASIC_AUTH_FILTER"/>
      <security:custom-filter
      ref="springSecurity2lwssoIntegrationFilter"
      position="LAST"/> -->

  Or,
  For HTTP header pre-authentication, locate the following scripts and
  uncomment it:

      <!--<security:custom-filter
      ref="httpHeaderPreAuthenticationFilter"
      after="SECURITY_CONTEXT_FILTER"/>-->

7. Locate the httpHeaderPreAuthenticationFilter bean definition, and then at least
  change the principalRequestHeader setting, corresponding to the Header your
  Identity Management solution uses. For Webseal, iv-user is used as the value of
  principalRequestHeader, Siteminder often uses sm_user or sm_universalid. Note
  that this setting is case sensitive.

8. Save the file and add the updated file back to the WEB-INF/spring directory of
  the webapp-x.xx.xxxx.war archive.

9. Configure the deployment environment to support the mobile system to receive
  the customized user information for authentication.


1.4.3.3. Set up Lightweight Single Sign-On
(LW-SSO)

If Lightweight Single Sign-On (LW-SSO) is enabled on both the Service Manager
server and the Mobile Applications, Service Manager authentication will be bypassed
if you have logged into another web application which also has LW-SSO enabled. The
detailed bypass critieria includes both the protected domain/IP/DNS name and the
initial LW-SSO string.

Enable LW-SSO on the Service Manager server

For detailed information about how to enable LW-SSO on Service Manager server,
refer to the Configure LW-SSO in the Service Manager server topic in the help center.

Enable LW-SSO on the Mobile Applications client

To enable LW-SSO on the Mobile Applicationsclient, follow these steps:

   1. Open webapp-x.xx.xxxx.war in an archive management program.
   2. Extract the web.properties file from the <Tomcat>/webapps/<Mobility>/WEB-

     INF directory to your local system, and then open this file in a text editor.
   3. Update the web.properties file.

        1. Change the value of context parameter isCustomAuthenticationUsed to
           false.

                 isCustomAuthenticationUsed=false

        2. Save the file.
   4. Extract the security.xml file from the WEB-INF/spring directory to your local

     system, and then open this file in a text editor.

   5. Locate the following scripts:


      <!-- <security:custom-filter ref="preAuthenticationFilter"
      after="SECURITY_CONTEXT_FILTER"/>
      <security:custom-filter ref="lwSsoFilter"
      before="BASIC_AUTH_FILTER"/>
      <security:custom-filter
      ref="springSecurity2lwssoIntegrationFilter"
      position="LAST"/> -->

  Uncomment the second line and the third line as follows to enable LW-SSO:

      <!-- <security:custom-filter ref="preAuthenticationFilter"
      after="SECURITY_CONTEXT_FILTER"/> -->
      <security:custom-filter ref="lwSsoFilter"
      before="BASIC_AUTH_FILTER"/>
      <security:custom-filter
      ref="springSecurity2lwssoIntegrationFilter"
      position="LAST"/>

6. Save the file and add the updated file back to the WEB-INF/spring directory of
  the webapp-x.xx.xxxx.war archive.

7. Extract the lwssofmconf.xml file from the WEB-INF/classes directory to your
  local system, and then open this file in a text editor.

8. Configure the parameters as follows:


<?xml version="1.0" encoding="UTF-8"?>
<lwsso-config
xmlns="http://www.hp.com/astsecurity/idmenablmentfw/lwsso/2.
0">
<enableLWSSO enableLWSSOFramework="true"
enableCookieCreation="true"
cookieCreationType="LWSSO" enableSAML2Support="false"/>
<webui>
<validation>
<in-ui-lwsso>
<lwssoValidation id="ID000001">
<domain>yourdomain.net</domain>
<crypto cipherType="symmetricBlockCipher"
engineName="AES" paddingModeName="CBC" keySize="256"
encodingMode="Base64Url"
initString="Please put your string here"></crypto>
</lwssoValidation>
</in-ui-lwsso>
</validation>
<creation>
<lwssoCreationRef id="ID000002">
<lwssoValidationRef refid="ID000001"/>
<expirationPeriod>60</expirationPeriod>
</lwssoCreationRef>
</creation>
<logoutURLs>
<url>.*/std/logout</url>
<url>.*/std/goodbye</url>
</logoutURLs>
<multiDomain>
<trustedHosts>
<!-- <DNSDomain>companydomain1.com</DNSDomain>
<DNSDomain>companydomain2.com</DNSDomain>
<NetBiosName>myserver1</NetBiosName>
<NetBiosName>myserver2</NetBiosName>
<IP>192.168.12.13</IP>
<IP>192.168.12.14</IP>
<FQDN>myserver1.companydomain1.com</FQDN>
<FQDN>myserver2.companydomain2.com</FQDN> -->
</trustedHosts>


</multiDomain>
</webui>
</lwsso-config>

            Required parameters for Mobile Applications client LW-SSO configurations

Parameter                               Default value           Description

enableLWSSOFramewo false                                        Change this value to
rk                                                              true to enable the
                                                                LW-SSO framework.

domain                                  yourdomain.net          Change
initString                                                      yourdomain.net to the
                                                                domain name of the
                                                                server host where you
                                                                deploy your Mobile
                                                                Applications client.

                                        Please put your string  Enter your initial string.
                                        here                    This initial string must
                                                                be same as the
                                                                initString value in the
                                                                Service Manager LW-
                                                                SSO configuration
                                                                (minimum length: 12
                                                                characters). For
                                                                example,
                                                                smintegrationlwsso.

               Note

             Beginning from the <creation> section to the end of the
             lwssofmconf.xml file, the variables are subject to change according
             to your actual deployment.

9. Save the file and add the updated file back to the WEB-INF/classes directory of
  the webapp-x.xx.xxxx.war archive.
````
