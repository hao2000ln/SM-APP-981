---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.9.1.1 .. 1.9.1.1
printed_pages: 1554-1592
---

# 1.9.1.1 Incident Exchange (OBM - SM) integration setup

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.9.1.1. Incident Exchange (OBM - SM)
integration setup

The Incident Exchange (OBM-SM) integration requires you to complete the following
configuration tasks on the Service Manager and Operations Bridge Manager (OBM) systems.

            Note

           Configuring Service Manager web service integrations in a network environment
           using a firewall or proxy server requires additional configuration. For details, see
           Web Services with a proxy server.

   1. Create user accounts for the Incident Exchange (OBM - SM) integration.

     This task creates a user account on each product side for the two systems to connect to
     each other and synchronize data.

   2. Configure an event forwarding rule in OBM.

     This task configures a rule for the OBM server to forward events to the Service Manager
     server.

   3. Configure the Service Manager server as a connected server in OBM.
     This task configures the connection settings for the target Service Manager server. If you
     need to integrate Service Manager with more than one OBM server, perform this task on
     each of the OBM servers.

   4. (Optional) Add custom attributes and map to SM fields.

     This task adds your own custom attributes in the Groovy script selected for the SM server
     and maps the attributes to appropriate fields in SM.

   5. Enable event drill-down from Service Manager into OBM

     This task sets up Service Manager operators as valid users with appropriate permissions
     in OBM. These permissions are required for the users to perform event drill-down from
     Service Manager to OBM.
   6. Enable incident drill-down from the OBM Event Browser.

     This task configures the Service Manager web tier in the sm:ServiceManagerAdapter
     script in OBM.

   7. (Optional)Configure SSL for the Incident Exchange (OBM - SM) integration .

     This task is needed if your OBM server requires HTTPS connections. If SSL is not
     configured in this case, changes on incidents that are created from OBM will not be able
     to be synchronized back to OBM.


   8. Configure the Instance Count in the SMOBM integration template.

     This task is needed only when you use more than one OBM server. The Instance Count
     setting defines the allowed number of SM-OBM integration instances in Service Manager
     (default: 1).

   9. Add an integration instance for each OBM server.

     This task creates and enables an instance of this integration in Integration Manager
     (SMIS). A separate integration instance is required for each OBM server.

 10. (Optional) Enable LW-SSO for the Incident Exchange (OBM - SM) integration.

     Lightweight Single Sign-On (LW-SSO) is optional but recommended for the Incident
     Exchange (OBM - SM) integration. This task includes enabling LW-SSO in the Service
     Manager server and Web tier, as well as in OBM.

 11. (Optional) Configure automatic closure for OBM incidents.

     By default, automatic closure is disabled for OBM incidents. System administrators can
     enable automatic closure and further configure under what conditions OBM incidents can
     be automatically closed.

 12. (Optional) Change the default assignment group for OBM incidents.

     When created, OBM incidents are automatically assigned with an assignment group
     based on their certain field values and a predefined default assignment group. System
     Administrators can change the default assignment group setting ( Application).

 13. Test the connection

     This task sends an event to the OBM server that matches the filter you defined (in our
     example filter, the severity value is Critical), and then verifies that the event is forwarded
     to Service Manager as expected.

 14. (Optional) Synchronize attributes

     Not all attributes are synchronized back from SM to OBM by default. This task changes
     the out-of-box behavior regarding which attributes are synchronized upon change.

Related topics

Integrations
Integration Manager
Synchronization of incident changes back to Operations Bridge Manager (OBM)
Add an integration instance for each OBM server
Enable LW-SSO for the Incident Exchange (OBM - SM) integration
Configure automatic closure for OBM incidents
Mark an incident for automatic closure
Drill down to the OBM event details from an incident
Change the default assignment group for OBM incidents


1.9.1.1.1. Create user accounts for the Incident
Exchange (OBM-SM) integration

Applies to User roles: System Administrator

The Incident Exchange (OBM - SM) integration is bidirectional. Synchronizing events and
incidents between the Service Manager and OBM systems requires you to set up integration
accounts for the two systems to access each other.

   1. Create an operator record with system administration privileges in Service Manager. For
     details, see Creating operator records.

     This is the user account that the OBM server uses to access Service Manager and to
     forward events to Service Manager.

     Later, when configuring the Service Manager server as a connected server in OBM, you
     need to specify this operator's login name and password on the Outgoing Connection
     tab. See Configure the Service Manager server as a connected server in OBM.

   2. Create a user account with system administration privileges on each OBM server. For
     details, see the OBM online help.

     This is the user account that Service Manager uses to access the OBM server and to
     synchronize incident changes back.

     Later, when configuring the Service Manager server as a connected server in OBM, you
     must specify this user's login name as the Name of the Service Manager server on the
     General tab. Next, specify this user's password as the Password on the IncOBMng
     Connection tab. See Configure the Service Manager server as a connected server in
     OBM.

     Also, you need to specify the same user account when adding an SM - OBM integration
     instance for each OBM server (the username and Password parameters). See Add an
     integration instance for each OBM server.

Related topics

Add an integration instance for each OBM server
Configure the Service Manager server as a connected server in OBM


1.9.1.1.2. Configure the Service Manager
server as a connected server in OBM

To synchronize changes between OBM events and Service Manager incidents, you need to
configure a connected server within OBM to correctly identify the target Service Manager
server instance.
To configure the Service Manager server as a target connected server, perform the following
steps:

   1. Log on to OBM as a system administrator.

   2. Navigate to the Connected Servers user interface:

     Administration > Setup and Maintenance > Connected Servers

   3. Click the New button, and then select External Event Processing to open the Create New
     Server Connection dialog box.

   4. In the Display Name field, enter a descriptive name for the Service Manager server.
     In the Name field, enter the user name of the OBM user account you created for Service
     Manager to access the OBM server. See Create user accounts for the Incident Exchange
     (OBM - SM) integration.

     Make a note of the Name of the new target server. You need to provide it later on as the
     username when configuring the Service Manager server to communicate with the OBM
     server. See Add an integration instance for each OBM server.

     Optionally, enter a description for the new target server.

     Make sure that the Active checkbox is selected.

     Click Next.
   5. In the Server Properties pane, enter the following information:

     Fully Qualified DNS Name: The fully qualified domain name of the target Service
     Manager server.

     CI Type: Select Service Manager System from the list.

     Keep the Advanced Delivery Options as default.

     Click Next.
   6. In the Integration Type dialog box, you can choose between using a Groovy script

     adapter, or the Event Synchronization Web Service.

        1. As a Service Manager Groovy script adapter is provided for integrating with Service
           Manager, select Call Script Adapter.


     2. In the Script Name field, select sm:ServiceManagerAdapter.

     3. Click Next.

7. In the Outgoing Connection dialog, enter the credentials (user name, password, and port
  number) to connect to the Service Manager server and to forward events to that server.

     1. In the User Name and Password fields, enter the Service Manager user credentials
        you created for the integration. See Create user accounts for the Incident Exchange
        (OBM - SM) integration.

     2. Repeat the password entry in the Verify Password field.

     3. In the Port field, enter the communications port of the Service Manager server.

        The Service Manager server configuration file (sm.ini) defines the http and http
        ports. Enter the http port when Service Manager is running in http mode, or enter
        the https port when it is running in secure http mode.

                      Tip

                   If you click Set default port, the Port field is automatically populated
                   with the default port (13080 for http or 13443 for secure http). However,
                   your actual Service Manager ports may differ from the default values.

     4. If the Service Manager server uses secure http (SSL) mode, select the Use Secure
        HTTP checkbox. If it uses http mode, make sure the checkbox is not checked.

     5. If the Use Secure HTTP checkbox is selected, download and install a copy of the
        Service Manager server’s SSL certificate by clicking the link Retrieve from Server,
        or Import from File if the certificate is available in a local file.

     6. Make sure that the Enable Synchronize and Transfer Control checkbox is checked.

        When the Enable Synchronize and Transfer Control flag is set, an Operations
        Management operator is then able to transfer ownership of the event to the target
        connected server. If the flag is not set, then the option Synchronize and Transfer
        Control doesn't appear in the list of forwarding types when configuring forwarding
        rules.

        Also, note that if the Enable Synchronize and Transfer Control flag is not set for any
        target connected server, the Transfer Control to option doesn't appear at all in the
        Event Browser context menu.

        If a specific server is configured without the Enable Synchronize and Transfer
        Control flag set, then that server is unavailable in the Event Browser context menu
        as a server to which you can transfer ownership.

     7. Click Test Connection. A Success or ERROR hyperlink appears.


        If an error appears, click the link to get a more detailed message. Fix the problems
        and try again until the connection is successful.
     8. Click Next.
8. If, in addition to automatically generating Service Manager incidents from OBM events,
  you want to also be able to drill-down into Service Manager, you need to specify the fully
  qualified DNS name and port of the Service Manager web application server (for example,
  Tomcat).

               Note

             To enable incident drill-down to Service Manager, you must have the Service
             Manager web tier deployed on a web application server.

  In the Event Drilldown dialog box, configure the Fully Qualified DNS Name and Port of
  the web application server on which the Service Manager web tier is deployed.

               Note

             If you don't specify a server in the Event Drilldown dialog box, it is assumed
             that the web tier is deployed on the same host as the Service Manager server.

  If the web application server communicates with the browser over SSL (secure HTTP),
  select the Use Secure HTTP checkbox.
  Click Next.
9. The next thing to do is to enable event changes to be synchronized back from Service
  Manager to OBM. For this you need to provide credentials for the Service Manager server
  to access the OBM server in the IncOBMng Connection dialog box.

     1. Select the Accept event changes from external processing server checkbox.

                      Note

                   If Enable Synchronize and Transfer Control was previously selected,
                   the Accept event changes from external processing server option is
                   assumed, and can't be disabled.

     2. Enter the password of the OBM user account that you created for the Service
        Manager server to access the OBM server. See Create user accounts for the
        Incident Exchange (OBM - SM) integration.

     3. Make sure the User Name (auto-generated) matches the one of the OBM user
        account you created. If not, click the General tab, and change the Name field to the
        correct value.


        4. Click Finish. The target Service Manager server now appears in the list of
           Connected Servers.

Related topics

Integration Manager
Incident Exchange (OBM - SM) integration
Incident Exchange (OBM - SM) integration setup
Add or delete an integration instance
Edit an integration instance
Enable or disable an integration instance
Enable LW-SSO for the Incident Exchange (OBM - SM) integration


1.9.1.1.3. Add custom attributes and map to
SM fields

You can add your own custom attributes in the Groovy script selected for the SM server in the
Connected Servers pane. Next, map these custom attributes to the appropriate fields in SM.
For details about groovy scripting, see the Operations Bridge Manager help center.
You can also change how attributes are mapped from OBM to SM. You can configure the
mapping in the BTO Data Model (BDM) Mapping Manager in SM:
System Administration > Ongoing Maintenance > BDM Mapping Management
For details about mapping attributes, see BDM Mapping Management.


1.9.1.1.4. Configure an event forwarding rule in
OBM

Suppose you have configured the Service Manager server as a connected server in
Application Performance Management (APM) Operations Bridge Manager (OBM). Next, you
need to configure an event forwarding rule for the OBM server to forward events to Service
Manager.

   1. Sign in to OBM as a system administrator.
   2. Navigate to Administration > Event Processing > Automation > Event Forwarding.
   3. Click the New Item button.
   4. In the Display Name field, enter a name for the rule. For example, smserver1 .
   5. Optionally, enter a description for the rule.
   6. In the Event Filter field, click the Manage Filters button.

     Click New, and then select New Simple Filter or New Advanced Filter.
     Follow the screen prompts to configure the rule. For example, for Severity, select Critical.
     Click OK.
   7. In the Target Servers field, select the Service Manager server you configured as a
     connected server, and then click the Add button.
     The details of the target server are displayed.
   8. Click OK.
     The Event Forwarding Rules list displays the forwarding rule.

Related topics

Integration Manager
Incident Exchange (OBM - SM) integration
Incident Exchange (OBM - SM) integration setup
Enable event drill-down from Service Manager into OBM


1.9.1.1.5. Enable event drill-down from Service
Manager into OBM

An OBM administrator must configure the operators as valid users with appropriate
permissions in OBM. Hence, these operators are able to perform event drill-down from SM into
the OBM user interface using a URL launch of the Event Browser,

            Note

           Without valid user names, or if a user doesn't have the required viewing
           permissions, trying to perform a URL launch of the OBM Event Browser from SM
           results in an empty browser window.

User account requirements

     If you have configured SM to use Single Sign-On (SSO) authentication, set up each user
     in OBM with the same user name that's used by the SM operator to sign in to SM and
     perform the URL call. (The password of each OBM user can be any string, but not empty.)
     After successfully logging on to SM, the OBM users can launch the OBM Event Browser
     without further authentication.

     For details on setting up SSO, see System Administration > Integrations > Service
     Manager integration methods and tools > Integration Manager > Using LW-SSO with
     integrations in the SM online help.

     If SM isn't configured to use SSO authentication, set up each user with the same user
     name that's used by the SM operator and specify a valid password. The users are
     required to enter their user name and password when launching the OBM Event Browser.

Required user permissions

You must grant the permission Events assigned to user including the required actions to each
OBM user.

To do this, follow these steps:

   1. Select Administration > Users > Users, Groups, and Roles.
   2. Select a role or create a new one. In the Permissions section, go to the Operations

     Console category, select Events and specify the actions users can perform on Events
     assigned to user.
   3. You can optionally grant the permission to view events not assigned to each user.

Related topics

Integration Manager
Incident Exchange (OBM - SM) integration


Incident Exchange (OBM - SM) integration setup
Enable incident drill-down from the OBM Event Browser


1.9.1.1.6. Enable incident drill-down from the
OBM Event Browser

Suppose you have configured the Service Manager server as a connected server in Operations
Bridge Manager (OBM). If you want to be able to drill down to Service Manager incidents from
the OBM Event Browser, you need to perform the following tasks.

   1. Configure the Service Manager web tier in the sm:ServiceManagerAdapter script in
     OBM

   2. Set the queryhashcode parameter in the Service Manager server configuration file

Configure the Service Manager web tier in the
sm:ServiceManagerAdapter script in OBM

To do this, follow these steps:
   1. Sign in to OBM as a system administrator.
   2. Navigate to Administration > Setup and Maintenance > Connected Servers.
   3. Click the Manage Scripts icon in the toolbar.
   4. Click the sm:ServiceManagerAdapter script, and then click the Edit icon.
   5. On the Script tab, locate the following string in the script:

          private static final String SM_WEB_TIER_NAME

   6. Change the value of this parameter to the name of your Service Manager web tier. For
     example, if your web tier file name is sm-9.xx.war, change the parameter value to:

          private static final String SM_WEB_TIER_NAME = 'sm-9.xx'

   7. Click OK to save the script.

Set the queryhashcode parameter in the Service Manager
server configuration file

To do this, follow these steps:
   1. Stop the Service Manager server.
   2. Add the following parameter to the server configuration file ( sm.ini ):
      queryhashcode:<host>:<port>
     Where: <host>:<port> must be the same as the Service Manager hostname and port
     number that are configured in the Service Manager web tier configuration file ( web.xml ).


   3. Restart the Service Manager server.

Related topics

Integration Manager
Incident Exchange (OBM - SM) integration
Incident Exchange (OBM - SM) integration setup
Configure SSL for the Incident Exchange (OBM - SM) integration


1.9.1.1.7. Configure SSL for the Incident
Exchange (OBM - SM) integration

Applies to User roles: System Administrator

When Operations Bridge Manager (OBM) or Service Manager is configured to accept HTTPS
connections only, you must configure SSL for the integration. If you don't do so, changes on an
incident that's created from OBM can't be synchronized back to OBM.

            Note

           The following steps describe how you do so by using the built-in keytool in Service
           Manager, and the file paths are for Windows only. Be sure to change the file paths
           accordingly if your Service Manager system is running on Linux.

If OBM is configured to accept HTTPS connections only, do the following:

   1. Import the OBM root certificate to the Service Manager server trusted keystore.

     The following is an example of the command line:

      <SM Install path>\server\RUN\jre\bin\keytool -import -alias myCA -file <.pem file of your
     APM root certificate> -keystore <SM Install path>\Server\RUN\jre\lib\security\cacerts -
     storepass <changeit>

     Where: changeit is the default password of the trusted keystore. Change it to your own
     password if you changed it previously.

  2. Add the following parameters to the Service Manager server configuration file (<SM
     install path>\Server\RUN\sm.ini):

      truststoreFile:<SM install path>\Server\RUN\jre\lib\security\cacerts

      truststorePass:<changeit>

   3. Restart the Service Manager Server service.

For bidirectional SSL, you need to enable SSL in Service Manager first, and then import the SM
certs to the OBM trusted keystore. Follow these steps:

   1. Enable SSL on the Service Manager server. For more information, see Secure Sockets
     Layer (SSL) encryption.

   2. Run the following command to export the SM certs.

      <SM Install path>\server\RUN\jre\bin\keytool -export -alias smserver -file sm-
     certificate.crt -keystore <SM Install path>\server\RUN\smserver.p12 -storepass
     <serverkeystore>

   3. Run the following command to import the SM certs to the OBM trusted keystore.


      opr-cert-mgmt.bat -import smserver sm-certificate.crt

Related topics

Configure the Instance Count in the SMOMi integration template


1.9.1.1.8. Configure the Instance Count in the
SMOMi integration template

Applies to User roles: System Administrator
Service Manager can integrate with more than one Operations Bridge Manager (OBM) server.
However, this integration only allows one OBM server by default. If you need to integrate
Service Manager with more than one OBM server, you need to configure the Instance Count
setting in the SMOMi integration template, as described below.

   1. Sign in to Service Manager as a system administrator.

   2. Type db in the command line, and press Enter.

   3. In the Table field, type SMISRegistry , and click Search.
     The SMIS integration template form opens.

   4. Click Search.
     A list of SMIS integration templates opens.

   5. Select SMOMi from the list.

   6. In the Instance Count field, change the value of 1 to the number of OBM servers that you
     want to integrate with Service Manager. For example, if you need two OBM servers,
     change the value to 2.

   7. Click Save.

Related topics

Incident Exchange (OBM - SM) integration
Configure automatic closure for OBM incidents
Mark an incident for automatic closure
Change the default assignment group for OBM incidents


1.9.1.1.9. Add an integration instance for each
OBM server

Applies to User roles: System Administrator

Once you have completed your configuration in Operations Bridge Manager (OBM), and have
changed the Instance Count setting in the SMOMi integration template (which is needed only
when you have multiple OBM servers), you are ready to add and enable a separate integration
instance in Service Manager for each OBM server. For example, if you have two OBM servers,
you must configure two SMOMi integration instances.

Support of multiple OBM servers

As of version 9.34, Service Manager can integrate with multiple OBM servers. This is
implemented through the Instance Count setting and the omi.mgr.id parameter in the SMOMi
integration template.

By default, the SMOMi integration template supports only one integration instance. If you have
multiple OBM servers, before you proceed, make sure you have already updated the Instance
Count setting in the SMOMi integration template. For details, see Configure the Instance Count
in the SMOMi integration template.

When using the omi.mgr.id parameter, keep the following in mind:

     If you have only one OBM server (and hence need only one SMOMi integration instance),
     you must either correctly configure this parameter or clear the entire row of this
     parameter (both the parameter name and value) in the SMOMi integration instance,
     otherwise the integration will not work.
     If you have multiple OBM servers (and hence need multiple SMOMi integration instances),
     you must correctly configure this parameter in all SMOMi integration instances. Only
     those correctly configured integration instances will work. If none of the SMOMi
     integration instances are correctly configured, none of them will work.
     Users can view the OBM event details from an OBM incident record only when you
     specify the omi.mgr.id parameter correctly. If the value you specify in the corresponding
     SMOMi integration instance doesn't match the Universally Unique Identifier (UUID) which
     is automatically generated in the OBM server for the target Service Manager server and
     stored in the Incident record, users will not see the View OMi Event option from the
     Incident record.

To add and enable an Incident Exchange (OBM - SM) integration instance:

   1. Sign in to Service Manager as a system administrator.

   2. Click Tailoring > Integration Manager.

   3. Click Add.

     The Integration Template Selection wizard opens.


4. Select SMOMi from the Integration Template list.

               Note

             Ignore the Import Mapping checkbox, which has no effect on this integration.

5. Click Next.

6. Complete the integration instance information:

        Modify the Name and Version fields to the exact values you need.
        In the Interval Time (s) field, enter a value. For example: 600. If an OBM opened
        incident fails to be synchronized back to OBM, Service Manager will retry the failed
        task at the specified interval (for example, 600 seconds).
        In the Max Retry Times field, enter a value. For example: 10. This is the maximum
        allowed number of retries for each failed task.
        (Optional) In the SM Server field, specify a display name for the Service Manager
        server host. For example, my_Local_SM.
        (Optional) In the Endpoint Server field, specify a display name for the APM server
        host. For example, my_APM_1.
        (Optional) In the Log File Directory field, specify a directory where log files of the
        integration will be stored. This must be a directory that already exists on the Service
        Manager server host.
        (Optional) In the Log Level field, change the log level from INFO (default) to another
        level. For example, WARNING.
        (Optional) If you want this integration instance to be automatically enabled when the
        Service Manager Server service is started, select Run at system startup.
7. Click Next. The Integration Instance Parameters page opens.

8. On the General Parameters tab, complete the following fields as necessary:


Field                                   Sample Value               Description
omi.server.url
http.conn.timeout                       http://<servername>:       This is the URL address of
                                        <port>/opr-                the OBM server's RESTful
http.rec.timeout                        gateway/rest/synchronizat  web service. Replace
                                        ion/event                  <servername> and <port>
                                                                   with the fully qualified
                                                                   domain name and port
                                                                   number of your OBM
                                                                   server.

                                        30                         The HTTP connection

                                                                   timeout setting in

                                                                   seconds.

                                                                             Note

                                                                             The out-of-
                                                                             box value is
                                                                             30 (seconds),
                                                                             and 15
                                                                             (seconds) is
                                                                             used if this
                                                                             field is empty.

                                        30                         The HTTP receive timeout

                                                                   setting in seconds.

                                                                             Note

                                                                             The out-of-
                                                                             box value is
                                                                             30 (seconds),
                                                                             and 15
                                                                             (seconds) is
                                                                             used if this
                                                                             field is empty.

Field                                   Sample Value                             Service Manager 9.81
http.send.timeout                       30
                                                             Description
sm.mgr.id
                                                             The HTTP send timeout
                                                             setting in seconds.

                                                                         Note

                                                                        The out-of-
                                                                        box value is
                                                                        30 (seconds),
                                                                        and 15
                                                                        (seconds) is
                                                                        used if this
                                                                        field is empty.

                                        55436DBE-F81E-4799-  The Universally Unique
                                        BA05-65DE9404343B    Identifier (UUID)
                                                             automatically generated
                                                             for this instance of
                                                             Service Manager.

                                                                         Note

                                                                        This field is
                                                                        automatically
                                                                        completed
                                                                        each time
                                                                        when you add
                                                                        an SMOMi
                                                                        integration
                                                                        instance. Do
                                                                        not change it,
                                                                        otherwise the
                                                                        integration will
                                                                        not work
                                                                        properly.

Field                                   Sample Value                            Service Manager 9.81
omi.reference.prefix                    urn:x-hp:2009:opr:
                                                            Description
sm.reference.prefix                     urn:x-hp:2009:sm:
                                                            The prefix of the BDM
                                                            External Process
                                                            Reference field, which will
                                                            be present in incoming
                                                            synchronization requests
                                                            from the OBM server.

                                                                        Note

                                                                       This field is
                                                                       automatically
                                                                       completed
                                                                       and has a
                                                                       fixed value.
                                                                       Do not change
                                                                       it.

                                                            The prefix of the BDM
                                                            External Process
                                                            Reference field, which will
                                                            be present in outgoing
                                                            synchronization requests
                                                            from Service Manager.

                                                                        Note

                                                                       This field is
                                                                       automatically
                                                                       completed
                                                                       and has a
                                                                       fixed value.
                                                                       Do not change
                                                                       it.


Field                                   Sample Value           Description
omi.eventdetail.baseurl
                                        http://<servername>:   The basic URL address of
                                        <port>/opr-            the event detail page in
                                        web/eventDetails/app?  OBM. Replace
                                        eventId=               <servername> with the
                                                               fully qualified domain
                                                               name of your OBM server.

9. On the General Parameters and Secure Parameters tabs, enter three parameter values
  that you specified when configuring the Service Manager server as a connected server in
  APM OBM. The following table lists the parameters, whose values you can copy from
  your APM OBM server.

  To copy the parameter values from APM OBM, follow these steps:

     1. Sign in to APM as a system administrator.
     2. Navigate to Admin > Operations Management > Setup > Connected Servers.
     3. Locate your Service Manager server configuration entry and double-click anywhere

        on the entry pane.
     4. On the General tab, copy the ID string at the bottom into the omi.mgr.id field in

        Service Manager.
     5. On the Incoming Connection tab, copy the User Name and Password to the

        username and Password fields in Service Manager, respectively.

Field                                   Sample Value                             Service Manager 9.81

omi.mgr.id (on the                      f3832ff4-a6b9-4228-  Description
General Parameters tab)                 9fed-b79105afa3e4
                                                             The Universally Unique
                                                             Identifier (UUID)
                                                             automatically generated in
                                                             OBM for the target
                                                             Service Manager server.


Field                                   Sample Value  Description

                                                      Note

                                                      This
                                                      parameter
                                                      was
                                                      introduced to
                                                      support
                                                      multiple OBM
                                                      servers.
                                                      Service
                                                      Manager uses
                                                      the UUID to
                                                      identify from
                                                      which OBM
                                                      server an
                                                      incident was
                                                      opened. Be
                                                      aware that if
                                                      you delete the
                                                      connected
                                                      server
                                                      configuration
                                                      for the Service
                                                      Manager
                                                      server in OBM
                                                      and then
                                                      recreate the
                                                      same
                                                      configuration,
                                                      OBM
                                                      generates a
                                                      new UUID.
                                                      You need to
                                                      reconfigure
                                                      the integration
                                                      instance by
                                                      changing the
                                                      old UUID to
                                                      the new one.


Field                                   Sample Value  Description

                                                      Tip

                                                      If you have
                                                      only one OBM
                                                      server, you
                                                      can simply
                                                      remove this
                                                      parameter
                                                      (remove both
                                                      the parameter
                                                      name and
                                                      value) from
                                                      the integration
                                                      instance. See
                                                      Support of
                                                      multiple OBM
                                                      servers.

username omi.mgr.id (on                 SM_Server     This is the user name that
the General Parameters                                the Service Manager
tab)                                                  server uses to
                                                      synchronize incident
Password (on the Secure SM_Server_Password            changes back to the OBM
Parameters tab)                                       server.

                                                      This is the password that
                                                      the Service Manager
                                                      server uses to
                                                      synchronize incident
                                                      changes back to the OBM
                                                      server.

10. Click Verify Connection.
    If everything is fine, the following message is displayed: Verification succeeded .

11. Click Next twice, and then click Finish.


                   Note

                Leave the Integration Instance Mapping and Integration Instance Fields
                settings blank. This integration doesn't use these settings.

     Service Manager creates the instance. You can edit, enable, disable, or delete it in
     Integration Manager.
 12. Enable the integration instance.
 13. If you have multiple OBM servers, repeat the steps above for the rest of your OBM
     servers.

Next, you can optionally enable Lightweight Single Sign-On (LW-SSO) in both OBM and
Service Manager so that users can bypass the log-in prompts. For details, see Enable LW-SSO
for the Incident Exchange (OBM - SM) integration.

Related topics

Integration Manager
Incident Exchange (OBM - SM) integration
Incident Exchange (OBM - SM) integration setup
Enable LW-SSO for the Incident Exchange (OBM - SM) integration


1.9.1.1.10. Enable LW-SSO for the Incident
Exchange (OBM - SM) integration

Applies to User roles: System Administrator

Lightweight Single Sign-On (LW-SSO) is optional but recommended for the Incident Exchange
(OBM - SM) integration. You have different LW-SSO configuration choices depending on your
needs. The following describes how LW-SSO can be used in the Incident Exchange (OBM -
SM) integration workflow.

When OBM creates an incident from an OBM event
record

OBM creates an incident from an OBM event record by sending RESTful-based requests to
Service Manager. The incident ID is then stored in the event record.

LW-SSO is NOT needed in this process. A dedicated Service Manager user account was
specified when configuring the Service Manager integration in OBM. OBM uses this dedicated
user account when calling the Service Manager RESTful Web Service to create the incident.

When an OBM user views the incident details

The user can log in to Service Manager and view the incident details using the incident ID
stored in the event record.

If the user wants to view the incident details by clicking the incident link from the event record,
LW-SSO can be used; otherwise a Service Manager login prompt will appear.

LW-SSO is optional for this process. To enable LW-SSO for this process, configure LW-SSO in
both the Service Manager server and Web tier (because the server needs to trust the Web
tier), as well as in OBM.

When Service Manager synchronizes the OBM incident
status back to OBM

When a user has updated the OBM incident, Service Manager calls the OBM server's RESTful
Web Service to update the incident changes to the OBM event record.

LW-SSO is NOT needed in this process. A dedicated OBM user account was specified when
the Incident Exchange (OBM - SM) integration was set up in SMIS, and Service Manager uses
this user account when calling the OBM server's RESTful Web Service to synchronize the
incident status back to the OBM event record.

When a user views the event details from the OBM
incident

The user clicks the View OBM Event option from the incident to view the event details.


LW-SSO is optional for this process. If you enable LW-SSO in the Service Manager Web tier
and in OBM, the OBM login prompt is bypassed.

Related topics

Incident Exchange (OBM - SM) integration
Incident Exchange (OBM - SM) integration setup
Using LW-SSO with integrations
Add an integration instance for each OBM server
Drill down to the OBM event details from an incident


1.9.1.1.11. Configure automatic closure for OBM
incidents

Applies to User Roles: System Administrator

OBM incidents can be automatically closed after a predefined amount of time since they were
last updated (or resolved if they have not been updated after being resolved).

The workflow is as follows:

   1. An incident is opened from OBM.
   2. If the Schedule Condition is met, the system creates a schedule record for the incident.

     The schedule record will expire at a future time based on the Calc Expression.
   3. A user updates the incident and saves the changes.
   4. The Reset alerts if expression on the Alerts tab of the probsummary object definition is

     evaluated. If it evaluates to true, the Expiration time of the schedule record is updated
     based on the Calc Expression. By default, the expiration time of the schedule record is
     updated only when the incident has a category of incident.
   5. When the schedule record expires, the Alert Condition is evaluated. If it evaluates to true,
     the incident is automatically closed.

To enable automatic closure for OBM incidents:

   1. Configure the global settings in the Incident Management Environment record.
        1. Click System Administration > Ongoing Maintenance > Environment Records >
           Incident Management Environment.
        2. Change the following settings as necessary.


Field                                   Value
Close Incident Automatically?
                                        This option disables or enables the
Closure Code                            automatic closure of OBM incidents at
Solution                                the global level.

                                             If this option is not selected, no
                                             incidents will be automatically
                                             closed.
                                             If this option is selected,
                                             incidents will be automatically
                                             closed under specified
                                             conditions.

                                        Default: Not selected

                                        This value will be copied to the
                                        Closure Code field of incidents when
                                        they are automatically closed.

                                        Default: Automatically Closed

                                        This description will be appended to
                                        the end of the Solution field of
                                        incidents when they are automatically
                                        closed.

                                        Default: This incident which belongs to
                                        OBM has been closed automatically.

3. lick Save.
4. Restart the Service Manager server.

               Note

             If you have made any changes to any of the configuration options in the
             Incident Management Environment record, the Service Manager server
             must be restarted for the changes to take effect.

2. Configure the alert definition that determines when an incident should be closed.


         Note

        The alert and problem processes must be running to enable the successful
        closure of OBM incidents.

1. Click Tailoring > Document Engine > Alerts.
2. In the Alert Name field, enter: OBM Auto-Close.
3. Click Search. The OBM Auto-Close alert definition detail form opens.

               Caution

             These fields in the alert definition are used to control automatic closure
             of OBM incidents. You can change the default values of these fields.
             However, you must be aware of the risk that automatic closure of OBM
             incidents will not work properly if the Schedule Condition and Alert
             Condition fields aren't configured correctly.

             Field                                                                    Service Manager 9.81
             Schedule Condition
                                        Value
             Alert Condition
                                        This expression is used to determine if
This PDF was generated on May 23, 2026  an incident should be scheduled for
                                        automatic closure.

                                        Default:
                                        jscall("SMOBM.isAutoCloseAndResolv
                                        ed") .

                                        An incident is scheduled for automatic
                                        closure when the following conditions
                                        are met.

                                             The Close Incident
                                             Automatically? option in the
                                             Incident Management
                                             Environment record is selected.
                                             In the incident record, the Do not
                                             close this incident automatically
                                             option is not selected.
                                             The incident has a status of
                                             Resolved.

                                        This expression is evaluated when an
                                        incident is about to be automatically
                                        closed. If it evaluates to true, the
                                        incident is closed.

                                        Default:
                                        jscall("SMOBM.isAutoCloseEnabled")
                                        .

                                        An incident is closed when the
                                        following conditions are met.

                                             The Close Incident
                                             Automatically? option in the
                                             Incident Management
                                             Environment record is selected.
                                             In the incident record, the Do not
                                             close this incident automatically
                                             option is not selected.

                                                                                                        Page 1585 of 1727

Field                                   Value
Calc Expression
                                        This expression is used to determine
                                        how much time will elapse before an
                                        incident is automatically closed.

                                        Default: $L.alert.time=update.time in
                                        $L.file+'7 00:00:00' .

                                        The default value means the amount
                                        of time elapsed is equal to seven days
                                        since the incident was last updated.

   3. Configure alert information in the probsummary object.

     The OBM autoclose alert definition is configured to only be used by OBM incidents. The
     closure time is reset each time the incident is updated. If the closure time is reached
     without the incident being updated then Service Manager will automatically close the
     incident.

        1. Click Tailoring > Document Engine > Objects.
        2. In the File name field, enter probsummary and press ENTER. The probsummary

           object definition is displayed.

        3. Select the Alerts tab.

           The Reset alerts if expression is used to reset the automatic closure time of OBM
           incidents.

           Default: category in $L.file="incident" and not null(1 in external.process.reference
           in $L.file) .

Related topics

Incident Exchange (OBM - SM) integration
Mark an incident for automatic closure
Drill down to the OBM event details from an incident
Change the default assignment group for OBM incidents


1.9.1.1.12. Change the default assignment
group for OBM incidents

Applies to User roles: System Administrator
Service Manager can accept REST based requests from Operations Bridge Manager (OBM) to
create incidents based on events information in OBM. An incident opened from an OBM event
is automatically assigned to an existing group based on the following field values, listed from
the highest to lowest priority:

     The Affected Service of the incident
     The Category of the incident
     The Affected CI of the incident

However, if none of these field values is available, the system assigns the incident to a default
group named Application. If necessary, you can change this default group setting by
using BTO Data Model (BDM) Mapping Management as follows:

   1. Navigate to System Administration > Ongoing Maintenance > BDM Mapping
     Management. The BDM mapping configuration search page opens.

   2. Enter incident in the BDM Name field, select 1.1 in the Version field, and then click
     Search. The BDM mapping record incident opens. The Incident Exchange (OBM - SM)
     integration uses this BDM mapping record when creating an incident from an OBM event.

   3. Select the Field Mapping tab, scroll down to the assignment field in the SM Object Field
     column, and click the SM Callback field in the same row.

   4. Change Application in the following code to the name of another assignment group:

          4) A default assignment group if no other criteria is met
                        if( ! $result ) {
                                       $result = "Application";
                        }

   5. Click Save. The default assignment group is now changed.

Related topics

Incident Exchange (OBM - SM) integration
BDM Mapping Management


1.9.1.1.13. Test the connection

To test the connection, send an event to the server hosting OBM that matches the filter you
defined (in the example filter, the severity value is Critical ). Next, verify that OBM forwards
the event to SM as expected.

To test the connection, do the following:

   1. On the Gateway Server system running OBM, open an Event Browser.

   2. On the system running OBM, open a command prompt and change to the following
     directory:

      <OBM_HOME>\opr\support

   3. Send an event using the following command:

      sendevent -s critical -t test111-1

   4. Verify that the event appears in the OBM Event Browser.

   5. Select the Forwarding tab.

   6. In the External Id field, you should see a valid SM incident ID.

   7. Verify that the incident appears in the Incident Management in Service Manager:

     If the event drill-down connection is correctly configured, click the hyperlink created with
     the incident ID. A browser window opens, which takes you directly to the incident in
     Service Manager.

     If you haven't configured the event drill-down connection, do the following:

        1. In the Forwarding tab in the OBM Event Browser, copy or note the incident ID from
           the External Id field.

        2. In the Service Manager user interface, navigate to Incident Management > Search
           Incidents.

        3. Paste or enter the incident ID in the Incident Id field.

        4. Click the Search button. This takes you to the incident in the Incident Details.

   8. Close the incident in Service Manager.

   9. Verify that Service Manager synchronizes the change in the state of the incident (it's now
      closed ) back to OBM. You shouldn't be able to see the closed event in SM in the active
     Event Browser, but it should now be in the History Browser.

Related topics

Incident Exchange (OBM - SM) integration
Synchronize attributes



1.9.1.1.14. Synchronize attributes

Not all attributes are synchronized back from SM to OBM by default. When the SM incident is
initially created from an OBM event, event attributes are mapped to the corresponding SM
incident attribute. Out of the box, after the initial incident creation, whenever the incident or
event subsequently changes, only a subset of the changed event and incident attributes are
synchronized. The following describes how to customize the list of attributes to synchronize
upon change.

Unidirectional synchronization: OBM to SM

OBM transfers the following attributes to SM when the event was initially created, and you have
configured the transfer of control of the event in the Connected Servers manager.

These attributes support bidirectional synchronization, but are disabled out-of-the-box.

     Title
     Severity
     Priority
     Operator: the operator assigned to the event who forwarded the event
     Category
     Subcategory
     Related CI

OBM event annotations are synchronized to SM activity log and there is no back
synchronization from SM to OBM.

Bidirectional synchronization

Attributes that support bidirectional synchronization between OBM and SM are:

     Description
     Lifecycle state (the state is only updated when the state changes to closed)
     Solution
     Contents under the Forwarding tab in the Event Details

Attribute synchronization using Groovy scripts

To change the out-of-the-box behavior regarding which attributes are updated, you can
specify this in the Groovy script used on the OBM side for synchronization or incident creation.
In the Groovy script, you can specify which fields are updated in SM, and which fields are
updated in OBM. You can also specify custom attributes in the Groovy script.

For more information, see Tips for customizing groovy scripts.

Related topics


Incident Exchange (OBM - SM) integration
Tips for customizing groovy scripts
````
