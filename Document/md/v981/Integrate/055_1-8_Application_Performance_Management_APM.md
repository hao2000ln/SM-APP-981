---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.8 .. 1.8.1
printed_pages: 1489-1524
---

# 1.8 Application Performance Management (APM)

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.8. Application Performance Management
(APM)

Application Performance Management (APM) is an end-to-end management solution portfolio
that integrates network, server, application, and business transaction monitoring to help
improve IT operations efficiency while delivering high-quality services. APM Operations
Manager i (OMi) optimizes event management, identifies cause/symptom relationships
between events, and reduces operational expenditures. Refer to the Application Performance
Management (APM) documentation for more information.

     Incident Exchange (OMi - SM) integration
     APM Business Impact Report (BIR)
     SM - APM downtime synchronization

Related topics

     Integrations
     Integration Manager
     Incident Exchange (OMi - SM) integration
     Incident Exchange (OMi - SM) integration setup
     APM Business Impact Report (BIR)
     APM Business Impact Report integration setup
     SM - APM downtime synchronization setup
     Add an integration instance for each Operations Manager i (OMi) server
     Enable LW-SSO for the Incident Exchange (OMi - SM) integration
     Add an APM Business Impact Reports integration
     Enable LW-SSO for the Business Impact Report (BIR) integration
     Add an instance in Service Manager Integration Suite (SMIS)
     Tailor Service Manager to handle phase change
     Set up integration in APM
     Set up integration in Universal CMDB


1.8.1. Incident Exchange (OMi - SM) integration

The Incident Exchange (OMi - SM) integration is a bidirectional integration between incident
records in Service Manager and events in Application Performance Management (APM)
Operations Management provided by the Operations Manager i (OMi) license.

This integration requires configurations on both product sides. For details, see Incident
Exchange (OMi - SM) integration setup.

            Note

           Service Manager can integrate with multiple APM OMi servers. For details, see Add
           an integration instance for each Operations Manager i (OMi) server.

Service Manager can accept RESTful-based requests from OMi to create incidents in Service
Manager, based on events information in OMi. When Service Manager accepts an incident
creation request from a remote OMi server, it creates an incident record and automatically
assigns it to an existing group based on certain field values. Incident Management users can
view the details of the related OMi event by clicking the View OMi Event menu option from the
incident record. See View related OMi event details from an incident.

When an Incident Management user makes any changes to the incident record, Service
Manager automatically synchronizes the changes to the corresponding event in OMi, by
sending an update request to the OMi RESTful web service interface. In the event of a
synchronization failure, a queuing mechanism will re-synchronize the changes. See
Synchronization of incident changes back to Operations Manager i (OMi).

System administrators can configure global settings that determine whether and when incident
records opened from OMi events can be automatically closed. However, Incident Management
users can mark individual OMi incident records as eligible or ineligible for automatic closure.
See Configure automatic closure for OMi incidents and Mark an incident for automatic closure.

Related topics

Application Performance Management (APM)
Incident Exchange (OMi - SM) integration setup
Synchronization of incident changes back to Operations Manager i (OMi)
Add an integration instance for each Operations Manager i (OMi) server
Enable LW-SSO for the Incident Exchange (OMi - SM) integration
Configure automatic closure for OMi incidents
Mark an incident for automatic closure
View related OMi event details from an incident
Change the default assignment group for OMi incidents


1.8.1.1. Incident Exchange (OMi - SM)
integration setup

The Incident Exchange (OMi - SM) integration requires the following configuration tasks be
completed on the Service Manager and Application Performance Management (APM) systems.

   1. Create user accounts for the Incident Exchange (OMi - SM) integration.

     This task creates a user account on each product side for the two systems to connect to
     each other and to synchronize data.

   2. Configure an event forwarding rule in Operations Manager i (OMi) .

     This task configures a rule for the OMi server to forward events to the Service Manager
     server.

   3. Configure the Service Manager server as a connected server in Operations Manager i
     (OMi).

     Perform this task in APM OMi. If you need to integrate Service Manager with more than
     one OMi server, perform this task on each of the OMi servers.

   4. Enable incident drill-down from Operations Manager i (OMi) Event Browser.

     This task configures the Service Manager web tier in the sm:ServiceManagerAdapter
     script in OMi.

   5. Configure SSL for the Incident Exchange (OMi - SM) integration .

     This task is needed if your OMi server requires HTTPS connections. If SSL is not
     configured in this case, changes on incidents that are created from OMi will not be able to
     be synchronized back to OMi.

   6. Configure the Instance Count in the SMOMi integration template.

     This task is needed only when you have more than one OMi server. The Instance Count
     setting defines the allowed number of SMOMi integration instances in Service Manager
     (default: 1).

   7. Add an integration instance for each Operations Manager i (OMi) server.

     This task creates and enables an instance of this integration in Integration Manager
     (SMIS). A separate integration instance is required for each OMi server.

   8. Enable LW-SSO for the Incident Exchange (OMi - SM) integration.

     Lightweight Single Sign-On (LW-SSO is) optional but recommended for the Incident
     Exchange (OMi - SM) integration. This task includes enabling LW-SSO in the Service
     Manager server and Web tier, as well as in APM.

   9. (Optional) Configure automatic closure for OMi incidents.


     This task is optional. By default, automatic closure is disabled for OMi incidents. System
     administrators can enable automatic closure and further configure under what conditions
     OMi incidents can be automatically closed.

 10. (Optional) Change the default assignment group for OMi incidents.

     This task is optional. When created, OMi incidents are automatically assigned with an
     assignment group based on their certain field values and a predefined default assignment
     group. System Administrators can change the default assignment group setting (
     Application).

Related topics

Integrations
Integration Manager
Application Performance Management (APM)
APM Business Impact Report (BIR)
Synchronization of incident changes back to Operations Manager i (OMi)
Add an integration instance for each Operations Manager i (OMi) server
Enable LW-SSO for the Incident Exchange (OMi - SM) integration
Configure LW-SSO in the Service Manager Web tier
Edit an integration instance
Enable or disable an integration instance
Configure automatic closure for OMi incidents
Mark an incident for automatic closure
View related OMi event details from an incident
Change the default assignment group for OMi incidents


1.8.1.1.1. Create user accounts for the Incident
Exchange (OMi - SM) integration

Applies to User roles: System Administrator

The Incident Exchange (OMi - SM) integration is bidirectional. Synchronizing events and
incidents between the Service Manager and APM OMi systems requires you to set up
integration accounts for the two systems to access each other.

   1. Create an operator record with system administration privileges in Service Manager. For
     details, see Creating operator records.

     This is the user account that the OMi server uses to access Service Manager and to
     forward events to Service Manager.

     Later, when configuring the Service Manager server as a connected server in OMi, you
     need to specify this operator's the login name and password on the Outgoing
     Connection tab. See Configure the Service Manager server as a connected server in
     Operations Manager i (OMi).

   2. Create a user account with system administration privileges on each APM OMi server. For
     details, see the APM documentation.

     This is the user account that Service Manager uses to access the OMi server and to
     synchronize incident changes back to the OMi server.

     Later, when configuring the Service Manager server as a connected server in OMi, you
     must specify this user's login name as the Name of the Service Manager server on the
     General tab. Next, specify this user's password as the Password on the Incoming
     Connection tab. See Configure the Service Manager server as a connected server in
     Operations Manager i (OMi).

     Also, you need to specify the same user account when adding an SMOMi integration
     instance for each OMi server (the username and Password parameters). See Add an
     integration instance for each Operations Manager i (OMi) server.

Related topics

     Integration Manager
     Incident Exchange (OMi - SM) integration
     Incident Exchange (OMi - SM) integration setup
     Add or delete an integration instance
     Edit an integration instance
     Enable or disable an integration instance
     Enable LW-SSO for the Incident Exchange (OMi - SM) integration


1.8.1.1.2. Configure the Service Manager
server as a connected server in OMi

Synchronizing changes between Application Performance Management (APM) Operations
Management events and Service Manager incidents requires configuring a Connected Server
within OMi to identify the target Service Manager server instance correctly.

To configure the Service Manager server as a target-connected server, perform the following
steps:

   1. Sign in to Application Performance Management as a system administrator.

   2. Navigate to the Connected Servers manager in the Operations Management user
     interface:

     Admin > Operations Management > Setup > Connected Servers

   3. Click the New button to open the Create New Server Connection dialog box.

   4. In the Display Name field, enter a name for the Service Manager server.

     The Name field is filled automatically. If the auto-completed value is not the user name of
     the APM user account you created for Service Manager to access the OMi server, change
     the value to the correct user name. See Create user accounts for the Incident Exchange
     (OMi - SM) integration.

     Make a note of the Name of the new target server. You need to provide it later on as the
     username when configuring the Service Manager server to communicate with the OMi
     server. See Add an integration instance for each Operations Manager i (OMi) server.

     Optionally, enter a description for the new target server.

     Make sure that you check the Active checkbox.

     Click Next.

   5. Select External Event Processing to choose the server type suitable for an external
     incident manager like Service Manager.

     Click Next.

   6. Enter the Fully Qualified DNS Name of the target Service Manager server.

     Click Next.

   7. In the Integration Type dialog box, you can choose between using a Groovy script
     adapter, or the Event Synchronization Web Service.

        1. As a Service Manager Groovy script adapter is provided for integrating with Service
           Manager, select Call Script Adapter.


     2. In the Script Name field, select sm:ServiceManagerAdapter.

     3. Click Next.

8. In the Outgoing Connection dialog, enter the credentials (user name, password, and port
  number) to connect to the Service Manager server and forward events to that server.

     1. In the User Name and Password fields, enter the Service Manager user credentials
        you created for the integration. See Create user accounts for the Incident Exchange
        (OMi - SM) integration.

     2. Repeat the password entry in the Password (Repeat) field.

     3. In the Port field, enter the communications port of the Service Manager server.

        The Service Manager server configuration file (sm.ini) defines the HTTP and HTTPS
        ports. Enter the HTTP port when Service Manager is running in HTTP mode, or enter
        the HTTPS port when it is running in secure HTTP mode.

                      Tip

                   Clicking Set default port automatically populates the Port field with the
                   default port (13080 for http or 13443 for secure http). However, your
                   actual Service Manager ports may differ from the default values.

     4. Select the Use Secure HTTP checkbox if the Service Manager server uses secure
        HTTP (SSL) mode. If it uses HTTP mode, make sure the checkbox is not checked.

     5. If the Use Secure HTTP checkbox is selected, download and install a copy of the
        Service Manager server’s SSL certificate by clicking the Retrieve from Server link,
        or Import from File if the certificate is available in a local file.

     6. Make sure that the Enable Synchronize and Transfer Control checkbox is checked.

        When the Enable Synchronize and Transfer Control flag is set, an Operations
        Management operator is then able to transfer ownership of the event to the target
        connected server. If the flag is not set, then the option Synchronize and Transfer
        Control doesn't appear in the list of forwarding types when configuring forwarding
        rules.

        Also, note that if the Enable Synchronize and Transfer Control flag is not set for any
        target-connected server, the Transfer Control to option doesn't appear at all in the
        Event Browser context menu.

        If a specific server is configured without the Enable Synchronize and Transfer
        Control flag set, then that server is unavailable in the Event Browser context menu
        as a server to which you can transfer ownership.

     7. Click Test Connection. A Success or ERROR hyperlink appears.

        Click the link to get a more detailed message.


        8. Click Next.
   9. If, in addition to automatically generating Service Manager incidents from OMi events, you

     want to also be able to drill-down into Service Manager, you need to specify the fully
     qualified DNS name and port of the Service Manager web application server (for example,
     Tomcat).

                   Note

                To enable incident drill-down to Service Manager, you must have the Service
                Manager web tier deployed on a web application server.

     In the Event Drilldown dialog box, configure the Fully Qualified DNS Name and Port of
     the web application server where the Service Manager web tier is deployed.

                   Note

                If you don't specify a server in the Event Drilldown dialog box, it is assumed
                that the web tier is deployed on the same machine as the Service Manager
                server.

     Click Next.
 10. The next thing to do is to enable event changes to be synchronized back from Service

     Manager to OMi. For this, you need to provide credentials for the Service Manager server
     to access the OMi server in the Incoming Connection dialog box.

        1. Select the Accept event changes from external processing server checkbox.

                         Note

                      If Enable Synchronize and Transfer Control was previously selected,
                      the Accept event changes from external processing server option is
                      assumed, and can't be disabled.

        2. Enter the password of the user account that you created for the Service Manager
           server to access the OMi server. See Create user accounts for the Incident
           Exchange (OMi - SM) integration.

        3. Make sure the User Name (auto-generated) matches the one of the user account
           you created. If not, click the General tab, and change the Name field to the correct
           value.

        4. Click Finish. The target Service Manager server appears in the list of Connected
           Servers.

Related topics


Integration Manager
Incident Exchange (OMi - SM) integration
Incident Exchange (OMi - SM) integration setup
Add or delete an integration instance
Edit an integration instance
Enable or disable an integration instance
Enable LW-SSO for the Incident Exchange (OMi - SM) integration


1.8.1.1.3. Configure an event forwarding rule in
OMi

Suppose you have configured the Service Manager server as a connected server in
Application Performance Management (APM) Operations Management i (OMi). You need to
configure an event forwarding rule for the OMi server to forward events to Service Manager.

   1. Sign in to APM as a system administrator.
   2. Navigate to Admin > Operations Management > Event Automation.

   3. Click the New Item button.

   4. In the Display Name field, enter a name for the rule. For example, smserver1 .

   5. In the Event Filter field, select Critical.

   6. In the Target Servers field, select the Service Manager server you configured as a
     connected server, and then click the Add button.
     The system displays details of the target server.

   7. In the Forwarding Type field, select Synchronize and Transfer Control.

   8. Click OK.

     The Event Forwarding Rules section displays the forwarding rule.

Related topics

     Integration Manager
     Incident Exchange (OMi - SM) integration
     Incident Exchange (OMi - SM) integration setup
     Add or delete an integration instance
     Edit an integration instance
     Enable or disable an integration instance
     Enable LW-SSO for the Incident Exchange (OMi - SM) integration


1.8.1.1.4. Enable incident drill-down from OMi
Event Browser

Suppose you have configured the Service Manager server as a connected server in
Application Performance Management (APM) Operations Management i (OMi). If you want to
be able to drill down to Service Manager incidents from the OMi Event Browser, you need to
configure the Service Manager web tier in the sm:ServiceManagerAdapter script in OMi.
To configure the Service Manager web tier name in the sm:ServiceManagerAdapter script in
OMi, follow these steps:

   1. Sign in to APM as a system administrator.
   2. Navigate to Admin > Operations Management > Setup > Connected Servers.
   3. Click the Manage Scripts icon in the toolbar.
   4. Click the sm:ServiceManagerAdapter field, and then click the Edit icon.
   5. On the Script tab, locate the following string in the script:

          private static final String SM_WEB_TIER_NAME

   6. Change the value of the parameter to the name of your Service Manager web tier. For
     example, if your web tier file name is sm-9.xx.war, change the parameter value to:

          private static final String SM_WEB_TIER_NAME=sm-9.xx

   7. Click OK to save the script.

Related topics

     Integration Manager
     Incident Exchange (OMi - SM) integration
     Incident Exchange (OMi - SM) integration setup
     Add or delete an integration instance
     Edit an integration instance
     Enable or disable an integration instance
     Enable LW-SSO for the Incident Exchange (OMi - SM) integration


1.8.1.1.5. Configure SSL for the Incident
Exchange (OMi - SM) integration

Applies to User roles: System Administrator
If you have configured Application Performance Management (APM) to accept
HTTPS connections only, you must configure SSL for the integration. If you don't do so, the
integration can't synchronize changes on an incident that's created from OMi back to
APM/OMi.

            Note

           The following steps describe how you do so by using the built-in key tool in
           Service Manager, and the file paths are for Windows only. Be sure to change the
           file paths if your Service Manager system is running on Linux.

To configure SSL for the integration, follow these steps:

   1. Import the APM root certificate to the Service Manager server trusted keystore.

     The following is an example of the command line:

      <SM Install path>\server\RUN\jre\bin\keytool -import -alias myCA -file <.pem file of your
     APM root certificate> -keystore <SM Install path>\Server\RUN\jre\lib\security\cacerts -
     storepass <changeit>

     Where: changeit is the default password of the trusted keystore. Change it to your own
     password if you have changed it.

  2. Add the following parameters to the Service Manager server configuration file ( <SM
     install path>\Server\RUN\sm.ini ):

      truststoreFile:<SM install path>\Server\RUN\jre\lib\security\cacerts
      truststorePass:<changeit>

   3. Restart the Service Manager Server service.

Related topics

     Application Performance Management (APM)
     SM - APM downtime synchronization
     Tailor Service Manager to handle phase change
     Set up integration in APM
     Set up integration in Universal CMDB
     Verify the SM - APM downtime synchronization setup


1.8.1.1.6. Configure the Instance Count in the
SMOMi integration template

Applies to User roles: System Administrator
Service Manager can integrate with more than one APM OMi server. However, the integration
allows only one OMi server by default. If you need to integrate Service Manager with more than
one OMi server, you need to configure the Instance Count setting in the SMOMi integration
template, as described below.

   1. Sign in to Service Manager as a system administrator.

   2. Type db in the command line and press Enter.

   3. In the Table field, type SMISRegistry , and click Search.

     The Service Manager Integration Suite (SMIS) integration template form opens.

   4. Click Search.
     A list of SMIS integration templates opens.

   5. Select SMOMi from the list.

   6. In the Instance Count field, change the value of 1 to the number of OMi servers that you
     want to integrate with Service Manager. For example, if you need two OMi servers,
     change the value to 2.

   7. Click Save.

Related topics

Application Performance Management (APM)
Incident Exchange (OMi - SM) integration
Configure automatic closure for OMi incidents
Mark an incident for automatic closure
Change the default assignment group for OMi incidents


1.8.1.1.7. Add an integration instance for each
OMi server

Applies to User roles: System Administrator

Once you have completed your configuration in Application Performance Management
Operations Management, and have changed the Instance Count setting in the SMOMi
integration template (which is needed only when you have multiple OMi servers), you are ready
to add and enable a separate integration instance in Service Manager for each OMi server. For
example, if you have two OMi servers, you must configure two SMOMi integration instances.

Support of multiple OMi servers

As of version 9.34, Service Manager can integrate with multiple OMi servers. This is
implemented through the Instance Count setting and the omi.mgr.id parameter in the SMOMi
integration template.

By default, the SMOMi integration template supports only one integration instance. If you have
multiple OMi servers, before you proceed, make sure you have already updated the Instance
Count setting in the SMOMi integration template. For details, see Configure the Instance Count
in the SMOMi integration template.

When using the omi.mgr.id parameter, keep the following in mind:

     If you have only one OMi server (and hence need only one SMOMi integration instance),
     you must either correctly configure this parameter or clear the entire row of this
     parameter (both the parameter name and value) in the SMOMi integration instance,
     otherwise the integration will not work.

     If you have multiple OMi servers (and hence need multiple SMOMi integration instances),
     you must correctly configure this parameter in all SMOMi integration instances. Only
     those correctly configured integration instances will work. If none of the SMOMi
     integration instances are correctly configured, none of them will work.

     Users can view the OMi event details from an OMi incident record only when you specify
     the omi.mgr.id parameter correctly. If the value you specify in the corresponding SMOMi
     integration instance doesn't match the Universally Unique Identifier (UUID) which is
     automatically generated in the OMi server for the target Service Manager server and
     stored in the Incident record, users will not see the View OMi Event option from the
     Incident record.

To add and enable an Incident Exchange (OMi-SM) integration instance:

   1. Sign in to Service Manager as a system administrator.

   2. Click Tailoring > Integration Manager.

   3. Click Add.


  The Integration Template Selection wizard opens.
4. Select SMOMi from the Integration Template list.

               Note

             Ignore the Import Mapping checkbox, which has no effect on this integration.

5. Click Next.
6. Complete the integration instance information:

       • Modify the Name and Version fields to the exact values you need.
       • In the Interval Time (s) field, enter a value. For example, 600. If an OMi opened
       incident fails to be synchronized back to OMi, Service Manager will retry the failed
       task at the specified interval (for example, 600 seconds).
       • In the Max Retry Times field, enter a value. For example, 10. This is the maximum
       allowed number of retries for each failed task.
       • (Optional) In the SM Server field, specify a display name for the Service Manager
       server host. For example, my_Local_SM.
       • (Optional) In the Endpoint Server field, specify a display name for the APM server
       host. For example, my_APM_1.
       • (Optional) In the Log File Directory field, specify a directory where log files of the
       integration will be stored. This must be a directory that already exists on the Service
       Manager server host.
       • (Optional) In the Log Level field, change the log level from INFO (default) to another
       level. For example, WARNING.
       • (Optional) If you want this integration instance to be automatically enabled when
       the Service Manager Server service is started, select Run at system startup.
7. Click Next. The Integration Instance Parameters page opens.
8. On the General Parameters tab, complete the following fields as necessary:


Field                                   Sample Value               Description
omi.server.url
http.conn.timeout                       http://<servername>:opr-   This is the URL address of
                                        gateway/rest/synchronizat  the OMi server's RESTful
http.rec.timeout                        ion/event                  web service. Replace
                                                                   <servername> with the
                                                                   fully qualified domain
                                                                   name of your OMi server.

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
                                                            from the OMi server.

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


Field                                   Sample Value              Description
omi.eventdetail.baseurl
                                        http://<servername>/opr-  The basic URL address of
                                        console/opr-evt-          the event detail page in
                                        details.jsp?eventId=      OMi. Replace
                                                                  <servername> with the
                                                                  fully qualified domain
                                                                  name of your OMi server.

9. On the General Parameters and Secure Parameters tabs, enter three parameter values
  that you specified when configuring the Service Manager server as a connected server in
  APM OMi. The following table lists the parameters, whose values you can copy from your
  APM OMi server.

  To copy the parameter values from APM OMi, follow these steps:

       a. Sign in to APM as a system administrator.

       b. Navigate to Admin > Operations Management > Setup > Connected Servers.

       c. Locate your Service Manager server configuration entry and double-click
       anywhere on the entry pane.

       d. On the General tab, copy the ID string at the bottom into the omi.mgr.id field in
       Service Manager.

       e. On the Incoming Connection tab, copy the User Name and Password to the
       username and Password fields in Service Manager, respectively.

Field                                   Sample Value                             Service Manager 9.81

omi.mgr.id (on the                      f3832ff4-a6b9-4228-  Description
General Parameters tab)                 9fed-b79105afa3e4
                                                             The Universally Unique
                                                             Identifier (UUID)
                                                             automatically generated in
                                                             OMi for the target Service
                                                             Manager server.


Field                                   Sample Value  Description

                                                      Note

                                                      This
                                                      parameter
                                                      was
                                                      introduced to
                                                      support
                                                      multiple OMi
                                                      servers.
                                                      Service
                                                      Manager uses
                                                      the UUID to
                                                      identify from
                                                      which OMi
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
                                                      server in OMi
                                                      and then
                                                      recreate the
                                                      same
                                                      configuration,
                                                      OMi generates
                                                      a new UUID.
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
                                                      only one OMi
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
                                                      the Support of
                                                      multiple OMi
                                                      servers
                                                      section above.

username omi.mgr.id (on                 SM_Server     This is the user name that
the General Parameters                                the Service Manager
tab)                                                  server uses to
                                                      synchronize incident
Password (on the Secure SM_Server_Password            changes back to the OMi
Parameters tab)                                       server.

                                                      This is the password that
                                                      the Service Manager
                                                      server uses to
                                                      synchronize incident
                                                      changes back to the OMi
                                                      server.

10. Click Next twice, and then click Finish.

                 Note

               Leave the Integration Instance Mapping and Integration Instance Fields
               settings blank. This integration doesn't use these settings.


     Service Manager creates the instance. You can edit, enable, disable, or delete it in
     Integration Manager.

 11. Enable the integration instance.

 12. If you have multiple OMi servers, repeat the steps above for the rest of your OMi servers.

Next, you can optionally enable Lightweight Single Sign-On (LW-SSO) in both APM and Service
Manager so that users can bypass the log-in prompts. For details, see Enable LW-SSO for the
Incident Exchange (OMi - SM) integration.

Related topics

Integration Manager
Incident Exchange (OMi - SM) integration
Incident Exchange (OMi - SM) integration setup
Add or delete an integration instance
Edit an integration instance
Enable or disable an integration instance
Enable LW-SSO for the Incident Exchange (OMi - SM) integration


1.8.1.1.8. Enable LW-SSO for the Incident
Exchange (OMi - SM) integration

Applies to User roles: System Administrator

Lightweight Single Sign-On (LW-SSO) is optional but recommended for the Incident Exchange
(OMi - SM) integration. You have different LW-SSO configuration choices depending on your
needs. The following describes how LW-SSO can be used in the Incident Exchange (OMi - SM)
integration workflow.

When OMi creates an incident from an OMi event record

OMi creates an incident from an OMi event record by sending RESTful-based requests to
Service Manager. The incident ID is then stored in the event record.

LW-SSO is NOT needed in this process. A dedicated Service Manager user account was
specified when configuring the Service Manager integration in OMi. OMi uses this dedicated
user account when calling the Service Manager RESTful Web Service to create the incident.

When an OMi user views the incident details

The user can log in to Service Manager and view the incident details using the incident ID
stored in the event record. For more information, refer to the APM documentation.

If the user wants to view the incident details by clicking the incident link from the event record,
LW-SSO can be used; otherwise a Service Manager login prompt will appear.

LW-SSO is optional for this process. To enable LW-SSO for this process, configure LW-SSO in
both the Service Manager server and Web tier (because the server needs to trust the Web
tier), as well as in APM.

     Configure LW-SSO in the Service Manager server
     Configure LW-SSO in the Service Manager Web tier
     Configure LW-SSO in Application Performance Management (APM)

When Service Manager synchronizes the OMi incident
status back to OMi

When a user has updated the OMi incident, Service Manager calls the OMi server's RESTful
Web Service to update the incident changes to the OMi event record.

LW-SSO is NOT needed in this process. A dedicated OMi user account was specified when the
Incident Exchange (OMi - SM) integration was set up in SMIS, and Service Manager uses this
user account when calling the OMi server's RESTful Web Service to synchronize the incident
status back to the OMi event record.


When a user views the event details from the OMi
incident

The user clicks the View OMi Event option from the incident to view the event details.

LW-SSO is optional for this process. If you enable LW-SSO in the Service Manager Web tier
and in APM, the APM login prompt is bypassed.

     Configure LW-SSO in the Service Manager Web tier
     Configure LW-SSO in Application Performance Management (APM)

Related topics

Application Performance Management (APM)
Incident Exchange (OMi - SM) integration
Incident Exchange (OMi - SM) integration setup
Using LW-SSO with integrations
Add an integration instance for each Operations Manager i (OMi) server
View related OMi event details from an incident


1.8.1.1.9. Configure automatic closure for OMi
incidents

Applies to User Roles: System Administrator

OMi incidents can be automatically closed after a predefined amount of time since they were
last updated (or resolved if they have not been updated after being resolved).

The workflow is as follows:

   1. An incident is opened from OMi.
   2. If the Schedule Condition is met, the system creates a schedule record for the incident.

     The schedule record will expire at a future time based on the Calc Expression.
   3. A user updates the incident and saves the changes.
   4. The Reset alerts if expression on the Alerts tab of the probsummary object definition is

     evaluated. If it evaluates to true, the Expiration time of the schedule record is updated
     based on the Calc Expression. By default, the expiration time of the schedule record is
     updated only when the incident has a category of incident.
   5. When the schedule record expires, the Alert Condition is evaluated. If it evaluates to true,
     the incident is automatically closed.

Complete the following tasks o enable automatic closure for OMi incidents.

   1. Configure the global settings in the Incident Management Environment record
   2. Configure the alert definition that determines when an incident should be closed
   3. Configure alert information in the probsummary object

Configure the global settings in the Incident
Management Environment record

   1. Click System Administration > Ongoing Maintenance > Environment Records >
     Incident Management Environment.

   2. Change the following settings as necessary.


Field                                   Value
Close Incident Automatically?
                                        This option disables or enables the
Closure Code                            automatic closure of OMi incidents at the
Solution                                global level.

                                            • If this option is not selected, no
                                            incidents will be automatically
                                            closed.
                                            • If this option is selected, incidents
                                            will be automatically closed under
                                            specified conditions.
                                        Default: Not selected

                                        This value will be copied to the Closure
                                        Code field of incidents when they are
                                        automatically closed.
                                        Default: Automatically Closed

                                        This description will be appended to the
                                        end of the Solution field of incidents
                                        when they are automatically closed.
                                        Default: This incident which belongs to
                                        OMi has been closed automatically.

3. Click Save.
4. Restart the Service Manager server.

               Note

             If you have made any changes to any of the configuration options in the
             Incident Management Environment record, the Service Manager server must
             be restarted for the changes to take effect.

Configure the alert definition that determines when an
incident should be closed


         Note

        The alert and problem processes must be running to enable the successful
        closure of OMi incidents.

1. Click Tailoring > Document Engine > Alerts.
2. In the Alert Name field, enter: OMI Auto-Close.
3. Click Search. The OMI Auto-Close alert definition detail form opens.

               Caution

             These fields in the alert definition are used to control automatic closure of
             OMi incidents. You can change the default values of these fields. However,
             you must be aware of the risk that automatic closure of OMi incidents will not
             work properly if the Schedule Condition and Alert Condition fields aren't
             configured correctly.

       Field                                                                               Service Manager 9.81
       Schedule Condition
                                        Value
       Alert Condition
                                        This expression is used to determine if
This PDF was generated on May 23, 2026  an incident should be scheduled for
                                        automatic closure.
                                        Default:
                                        jscall("SMOMi.isAutoCloseAndResolved"
                                        ).
                                        An incident is scheduled for automatic
                                        closure when the following conditions are
                                        met.

                                            • The Close Incident Automatically?
                                            option in the Incident Management
                                            Environment record is selected.
                                            • In the incident record, the Do not
                                            close this incident automatically
                                            option is not selected.
                                            • The incident has a status of
                                            Resolved.

                                        This expression is evaluated when an
                                        incident is about to be automatically
                                        closed. If it evaluates to true, the incident
                                        is closed.
                                        Default:
                                        jscall("SMOMi.isAutoCloseEnabled") .
                                        An incident is closed when the following
                                        conditions are met.

                                            • The Close Incident Automatically?
                                            option in the Incident Management
                                            Environment record is selected.
                                            • In the incident record, the Do not
                                            close this incident automatically
                                            option is not selected.

                                                                                                              Page 1517 of 1727

Field                                   Value
Calc Expression
                                        This expression is used to determine how
                                        much time will elapse before an incident
                                        is automatically closed.

                                        Default: $L.alert.time=update.time in
                                        $L.file+'7 00:00:00' .

                                        The default value means the amount of
                                        time elapsed is equal to seven days since
                                        the incident was last updated.

Configure alert information in the probsummary object

The OMi autoclose alert definition is configured to only be used by OMi incidents. The closure
time is reset each time the incident is updated. If the closure time is reached without the
incident being updated then Service Manager will automatically close the incident.

   1. Click Tailoring > Document Engine > Objects.

   2. In the File name field, enter probsummary and press ENTER. The probsummary object
     definition is displayed.

   3. Select the Alerts tab.

     The Reset alerts if expression is used to reset the automatic closure time of OMi
     incidents.

     Default: category in $L.file="incident" and not null(1 in external.process.reference in
     $L.file) .

Related topics

Application Performance Management (APM)
Incident Exchange (OMi - SM) integration
Mark an incident for automatic closure
View related OMi event details from an incident
Change the default assignment group for OMi incidents


1.8.1.1.10. Change the default assignment
group for OMi incidents

Applies to User Roles: System Administrator

Service Manager can accept REST based requests from APM Operations Manager i (OMi) to
create incidents based on events information in OMi. An incident opened from an OMi event is
automatically assigned to an existing group based on the following field values, listed from the
highest to lowest priority:

     The Affected Service of the incident
     The Category of the incident
     The Affected CI of the incident

However, if none of these field values is available, the system assigns the incident to a default
group named Application. If necessary, you can use BTO Data Model (BDM) Mapping
Management to change this default group setting as follows:

   1. Navigate to System Administration > Ongoing Maintenance > BDM Mapping
     Management. The BDM mapping configuration search page opens.

   2. Enter incident in the BDM Name field, select 1.1 in the Version field, and then click
     Search. The BDM mapping record incident opens. The Incident Exchange (OMi - SM)
     integration uses this BDM mapping record when creating an incident from an OMi event.

   3. Select the Field Mapping tab, scroll down to the assignment field in the SM Object Field
     column, and click the SM Callback field in the same row.

   4. Change Application in the following code to the name of another assignment group:

          4) A default assignment group if no other criteria is met
                        if( ! $result ) {
                                       $result = "Application";
                        }

   5. Click Save. The default assignment group is now changed.

Related topics

Application Performance Management (APM)
Incident Exchange (OMi - SM) integration
BDM Mapping Management


1.8.1.2. Synchronization of incident changes
back to OMi

After OMi opens an incident in Service Manager, Service Manager will synchronize the incident
changes back to OMi.

Operations Manager i (OMi) can forward an event record to Service Manager as an incident by
calling a Service Manager Web Service. The incident ID is then stored in the event record.

When a user has updated the incident opened from OMi, Service Manager calls an OMi server
RESTful Web Service to update the incident changes to the OMi event record.

If Service Manager fails to synchronize the incident changes back to OMi for some reasons (for
example, because of a network problem), Service Manager behaves as follows:

     Displays a warning message, indicating that the incident failed to be synchronized to OMi.
     Saves the failed task in the SMIS task queue, and retries the task to re-synchronize the
     changes to OMi based on an interval time and a maximum retry times configured when
     adding the Incident Exchange (OMi - SM) integration in SMIS. When the re-
     synchronization is successfully completed, the failed task is removed from the task
     queue.

System Administrators can monitor failed tasks, and reset their retry times or rerun expired
tasks. For more information, see Monitor failover tasks.

Related topics

Integration Manager
Incident Exchange (OMi - SM) integration
Incident Exchange (OMi - SM) integration setup
Add an integration instance for each Operations Manager i (OMi) server
Enable LW-SSO for the Incident Exchange (OMi - SM) integration
View related OMi event details from an incident
Monitor failover tasks


1.8.1.3. Working with the Incident Exchange
(OMi - SM) integration

Once the integration is set up, Service Manager Incident Management users with the right
permissions can view event details from OMi incidents and mark individual OMi incidents as
eligible or ineligible for automatic closure (if their system administrator has enabled automatic
closure for OMi incidents).

Related topics

Integration Manager
Incident Exchange (OMi - SM) integration
Incident Exchange (OMi - SM) integration setup
Add an integration instance for each Operations Manager i (OMi) server
Enable LW-SSO for the Incident Exchange (OMi - SM) integration
View related OMi event details from an incident
Monitor failover tasks


1.8.1.3.1. View related OMi event details from
an incident

If all of the following conditions are met, you can view the related Operations Manager i (OMi)
event details from an OMi incident:

     You are accessing the incident through the Service Manager standard Web client (not the
     employee self-service (ESS) interface).
     One or more SMOMi integration instances are set up and enabled in Integration Manager.
     You are also a Application Performance Management (APM) user who has been granted
     the permission Events assigned to user including the required actions.

To view related OMi event details from an OMi incident:

   1. Sign in to the Service Manager Web client.

   2. From Incident Management, search for the incident record created from OMi.

   3. Click More and then select View OMi Event.

                   Note

                The View OMi Event option displays only when the omi.mgr.id parameter in
                the corresponding SMOMi integration instance is set correctly.

     If Lightweight Single Sign-On (LW-SSO) is enabled in both the Service Manager Web
     client and Application Performance Management (APM), the OMi event detail page opens
     in a new browser window, displaying the details of the related event in OMi. If LW-SSO is
     disabled, a APM login page opens, and the related OMi event detail page displays after
     you sign in to APM.

Related topics

Application Performance Management (APM)
Incident Exchange (OMi - SM) integration
Configure automatic closure for OMi incidents
Mark an incident for automatic closure
Change the default assignment group for OMi incidents


1.8.1.3.2. Mark an incident for automatic
closure

Applies to User Roles: Incident Coordinator
You can mark an OMi incident as eligible or ineligible for automatic closure after a predefined
amount of time since it was last updated.
To mark an incident as ineligible or eligible for automatic closure:

   1. From Incident Management, search for an incident record opened from OMi.
   2. Select or deselect the Do not close this incident automatically checkbox to mark this

     incident as ineligible or eligible for automatic closure.

                   Note

                By default, this checkbox isn't selected.

Related topics

     Application Performance Management (APM)
     Incident Exchange (OMi - SM) integration
     Configure automatic closure for OMi incidents
     View related OMi event details from an incident
     Change the default assignment group for OMi incidents
````
