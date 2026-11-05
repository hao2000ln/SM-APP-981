---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.3.1.5 .. 1.3.1.6
printed_pages: 660-692
---

# 1.3.1.5 Customizing Service Manager

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.3.1.5. Customizing Service Manager

This chapter describes the customization required for Service Manager for the SAP Solution
Manager integration.

            Note

           Some configuration topics are required only for PD environment or for non-PD
           environment, whereas some are required for both. Unless otherwise noted in the
           step heading, a topic is required for both.


1.3.1.5.1. Configuring the denyattachwithoutext
parameter

When the Service Manager attachment white list is enabled, you must add the
denyattachwithoutext startup parameter to the sm.ini file. Otherwise, if the web service
requests did not send the extension name of the attachement, the attachment is rejected and
the request fails.
For more information, see Startup parameter: denyattachwithoutext.


1.3.1.5.2. Importing Customizations Using
Unload

This section describes how to configure Service Manager using unload. Additional
customization of Service Manager is later required for the integration.

            Note

           Ignore this topic if you are working with Service Manager applications version 9.5x
           or above.

Core unload

Unloads are used to transfer customizations from one Service Manager installation to another
Service Manager installation. The Incident Exchange provides core unloads in <SMSSMEX1.30
Release Package>\unloads\SM9.34-9.4x\core.unl for Service Manager 9.34, 9.35, and 9.4x.
This unload contains new Service Manager records that are unique to Incident Exchange and
don't override any existing Service Manager records.
Follow these steps to import the unload do the following:

   1. On the Service Manager client select Tailoring > Database Manager.
   2. Select Import/Load from the menu.
   3. Select <SMSSMEX1.40 Release Package>\unloads\SM9.34-9.4x\core.unl for Service

     Manager 9.34, 9.35, and 9.4x.
   4. Click Load FG to start the import.

Contents

     1 Core unload


1.3.1.5.3. Enabling the Integration

Follow these steps to enable the Service Manager integration with SAP Solution Manager:

   1. Sign in to Service Manager Windows client as a system administrator.
   2. Type sl in the Service Manager command line field, and then press Enter.
   3. Type SMSAP_Enable in the Name field, and then click Search.

   4. (Optional) Locate the following codes:

          var incidentCategory = "incident";

          var isCustomizateSMFormat = true;

          var isGenerateIntegrationDemoData = true;

          var isGenerateIntegrationDemoUser = true;

     You can update the values as follows:

           The value of incidentCategory must be consistent with that in the
            ovictex.properties file.
           When setting isCustomizateSMFormat to true , the integration enablement script
           customizes the Service Manager forms and you can skip the steps as described in
           Configuring Incident form (Hybrid Only) and Configuring Incident Form (Codeless
           Only).
           When setting isGenerateIntegrationDemoData to true , the integration enablement
           script generates the sapinstance200 CI and the sapinstance300 CI, and two CI
           relationships, respectively.
           When setting isGenerateIntegrationDemoUser to true , the integration enablement
           script creates an operator named ovictex with the password of Ovictex123. You can
           skip the steps as described in Creating a Service Manager user for web service.
   5. Click Execute. When the process completes, the Messages tab displays the enable SM
     SAP integration done! message.
   6. Sign out and sign in again for the configuration to take effect.

            Note

           The integration enablement script creates a new workflow named Incident for
           SAP , and adds necessary rule sets, actions, and transitions.


1.3.1.5.4. Creating a Service Manager User for
Web Service

Incident Exchange uses one Service Manager user to connect to Service Manager web
services. The user and the user role are for the integration only. The user requires the following
permissions:

Do the following:

   1. Sign in to Service Manager with a System Administrator account.
   2. From the System Navigator, click System Administration > Ongoing Maintenance > User

     Roles.

   3. Search for system administrator .

                   Tip

                In case your database is case-sensitive, try to use all lowercase search
                keywords instead of all UPPERCASE ones, or vice versa.

   4. Enter OVICTEX as the User Role.
   5. Change Description to Automated Incident Exchange user role.
   6. Click Add.
   7. From the System Navigator, click System Administration > Ongoing Maintenance > User

     Quick Add Utility.
   8. Enter ovictex, INCIDENT EXCHANGE, Incident, Exchange, ovictex@microfocus.com .
   9. Click Next.
 10. Select falcon for User to clone.
 11. Click Finish.
 12. Click Save.


13. From the System Navigator, click System Administration > Ongoing Maintenance >
    Operators, enter ovictex in the Login Name field, then click Search.

14. Change User Role to OVICTEX .

15. On the Security tab:

       1. Enter the operator password for Password.
       2. Clear the Expire Password checkbox.
       3. Check Never Expire Password.
16. Click Save.


1.3.1.5.5. Configuring Incident Form
(Classic/Hybrid Only)

Incident Exchange must be integrated into the incident management workflow. The operator
working on the incident must be able to control and trigger Incident Exchange. If more than one
external helpdesk is connected to Service Manager, then the target system must be selected.

            Note

           If you are working with SM 9.40 Classic, you must apply the
           QCCR1E127035_SM940_SM940.unl unload file to fix QCCR1E127035. The unload
           file is available in the %SMSSMEX_HOME%\unloads\SM9.34-9.4x directory.

Follow these steps to configure incident forms in non-PD environment:

   1. Open all Incident Forms that are parts of the Incident workflow.
      IM.open.incident
      IM.update.incident
      IM.close.incident

   2. Embed the created subform on the Incident form in a new Notebook tab (or in a new
     section on Service Manager 9.2x and above).

   3. Add a Notebook tab or section to the following forms:
      IM.open.incident
      IM.update.incident
      IM.close.incident

Property                                Value

Caption                                 Sap Solution Manager

Visible condition                       [$SMSAP]=true

4. Add a subform control to the SAP Solution Manager tab or section.


Property                                Value
X                                       1
Y
Width                                   0
Height
Format                                  151

                                        28

                                        hp.sap.solution.sub

Note

If multiple Language packs are applied to Service Manager, do the following to
update the incident related forms for other languages.

   1. Copy the hp.sap.solution.sub form from English to other languages and
     perform translation.

  2. Repeat step 3 and step 4 for IM.open.incident , IM.update.incident and
      IM.close incident for other languages.


1.3.1.5.6. Configuring Incident Form (Codeless
Only)

To configure the incident form in PD environment, follow these steps to add a SAP Solution
Manager tab for the following formats:
im.incident.categorization
im.incident.investigation
im.incident.recovery
im.incident.review
im.incident.closure

            Note

           If you are working with either SM 9.40 Codeless or SM 9.41 Hybrid, pay attention to
           the following items before adding add SAP Solution Manager tabs for various
           incident formats.

                If you are working with SM 9.40 Codeless, you must apply the
                QCCR1E127035_SM940_SM940.unl unload file to fix QCCR1E127035. The
                unload file is available in the %SMSSMEX_HOME%\unloads\SM9.34-9.4x
                directory.
                If you are upgrading SM 9.31 with PD3 to SM 9.41 Hybrid, you must apply a
                hotfix for QCCR1E128778 during the upgrade process. The hotfix is available
                from Software Support.

   1. Click Tailoring > Forms Designer.
   2. Type im.incident.categorization and click Search.
   3. Add a new notebook tab with the following configurations:

Property                                                                                   Service Manager 9.81
Name
                                        Value
                                        sapsolutionmanager

Visible                                 True

Visible condition                       [$SMSAP]=true

Caption                                 Sap Solution Manager

4. Add a subform control to the SAP Solution Manager tab.

Property                                Value

Format                                  hp.sap.solution.sub

5. Click Save.
6. Search for im.incident.investigation , im.incident.recovery , im.incident.review , and

   im.incident.closure respectively and repeat step 3 to step 5.


1.3.1.5.7. Configuring WSDL Mapping

Configure the IncidentManagement WSDL Mapping table in WSDL Configuration of Service
Manager as follow:

Field name                              Caption
action                                  Description
assignee.name                           Assignee
brief.description                       Title
initial.impact                          Impact
assignment                              AssignmentGroup
product.type                            ProductType
resolution                              Solution
subcategory                             SubCategory
severity                                Urgency


1.3.1.5.8. Adding Instance in SMIS and
Configuring Parameters

The SMSAP instance in SMIS integration is used to enable and disable the SMSAP integration.
By configuring the SMSAP instance, you can also specify the integration parameters such as
SMSSMEX accessing URL and SAP clients. After the SMSAP instance is enabled, the
customization to Incident is visible and you can select a SAP Solution Manager client for
Incident information exchange. If the SMSAP instance is disabled or removed, the Incident
form customization for Incident exchange with SAP Solution Manager will be invisible to the
end users. Note that the Incident information exchange from SAP SolMan to Service Manager
will not be affected by SMSAP SMIS configuration. For more information about SMIS, refer to
Integration Manager.

The SM-SAP integration operates only when the SMSAP instance in SMIS is enabled. Do the
following to add a new instance in SMIS and configure the parameters:

   1. Sign in to Service Manager with a System Administrator account.
   2. Select Tailoring > Integration Manager. Integration Manager opens.
   3. Click Add to open the wizard.
   4. Select SMSAP, click Next.

   5. Click Next to configure the parameters.

        1. Configure the baseurl for connection to SMSSMEX.

           Replace <host> and <port> according to the middleware installation.

        2. Configure SAP Solution Manager clients.

           Add general parameters for each of your SAP Solution Manager clients configured in
           SMSSMEX ovictex.properties . For example, exthd.instances.id.1 ,
            exthd.instances.id.2 and so on.

           Note: Be sure to set your SAP Solution Manager client instance ID in the Name field,
           and SolutionManager in the Category field of each record. Value of each SAP
           Solution Manager client instance ID is the reference in Service Manager.


6. Click Next twice at the end of the wizard and click Finish to save the configurations.
7. Select the SMSAP instance and click Enable to enable the SM-SAP integration.


1.3.1.6. Configuring SAP Solution Manager

This chapter describes how to configure the SAP Solution Manager.


1.3.1.6.1. Prerequisites

The prerequisites are:

     SAP Solution Manager 7.0 SP 12 (or higher) or SAP Solution Manager 7.1
     SAP Solution Manager SP12 if copying of business transaction SLFN for customization in
     a customer name space (for example ZLFN) is required
     SAP Solution Manager SP12. Required to copy a business transaction into a customer
     name space for customization (for example, to copy business transaction SLFN into
     customer name space ZLFN )
     Configured SAP Solution Manager Service Desk

Configured SAP Solution Manager Service Desk SSL encryption between SAP Solution
Manager and Apache Tomcat requires:

     Sapcryptolib 5.5.5C or higher
     SSL Server and SSL Client PSE
     SSL Server and SSL Client certificates trusted against a CA

Integration with Service Manager requires implementation of the latest SAP notes (SAP
application area SV-SMG-SUP-IFA) for the SP level stack of SAP Solution Manager. The
following diagram shows the search results of SAP notes in the SAP Support Portal.



1.3.1.6.2. Configuring SAP Solution Manager
External Service Desk interface

SAP provides the Implementation Guide “External Service Desk” for configuring the external
help interface. The Implementation Guide is located in SAP transaction /nspro under path
\SAP Solution Manager ImplementationGuide\SAP Solution Manager\Capabilities
(Optional)\Application Incident Management (Service Desk)\External Integration\ External
Service Desk . The following diagrams show the Implementation Guide for configuring the
connection to the external Service Desk.


Click the leftmost text sign to view configuration steps. Click the clock sign to enter the
corresponding transaction and edit the configuration.


1.3.1.6.2.1. Release Web Service

The Incident Exchange Web Service is deactivated by default. It is required to release the
WEB-Service in the Internet Communication Manager Service tree.

   1. The transaction to release a Web Service is /nwsconfig . After the Web Service is
     released the WS is in SAP transaction /nwsadmin .

2. To determine the logon procedure of the Web Service for incoming requests, go to SAP
  transaction /nsicf .

3. Enter ICT_SERVICE_DESK_API as the service name.
4. Click Execute to execute the search.
5. Double-click the Service to edit or navigate to the path /default_host/sap/bc/srt/rfc/sap/

  and select ICT_SERVICE_DESK_API.

6. In the Logon tab of Create/Change a Service dialog , select Standard.


Note

The security section of this manual contains additional information for setting up
SSL communications. Adding a user is not required. The Incident Exchange Web
Service will use the user and password that's configured in the properties file for
HTTP Basic authentication. This user must exist as an SAP user. It's not
recommended to use a dialog user for this purpose.


1.3.1.6.2.2. Assign Roles to the Communication
User

Configure an SAP user with permission to manage incidents in SAP Solution Manager Service
Desk. Follow the instruction in the Implementation Guide and add the roles
SAP_SUPPDESK_PROCESS and SAP_SUPPDESK_INTERFACE to the user. Exchanging a
business partner with a default configuration interface requires the additional role
SAP_CRM_BUSINESS_PARTNER .
To configure a user:

   1. Select transaction /nsu01 .
   2. Input the name of the user.
   3. Click Display. The user configuration transaction appears.

                   Note

                      A person who is assigned to an incident in Service Manager but doesn't
                      exist in Solution Manager will be created as a Business Partner when the
                      incident is forwarded to Solution Manager. Without the business partner
                      role SAP_CRM_BUSINESS_PARTNER the incident can't be created or
                      updated in Solution Manager and the error code 99 appears.
                      A communication user is recommended, but not necessary.

Sending support messages to SAP AGS requires assigning an SAP Support Portal contact to
Solution Manager users who will communicate with the SAP Support Portal via RFC
connections. The contact maintained corresponds to the S-user in the SAP Support Portal
without “S”. See SAP Note 834534 and the SAP Solution Manager configuration guide for
details of Solution Manager roles and authorizations.


1.3.1.6.2.3. Create HTTP Connection

Define the endpoint of the SMSSMEX Web-Service for communication between SAP Solution
Manager and Apache Tomcat.

   1. Select transaction /nsm59 .
   2. Create an RFC destination of type G (HTTP connection to external server).
   3. Go to the Technical settings tab and specify the endpoint of the SMSSMEX Web-Service.

     The default is:

          Target Host: <host>
          Service No: <port>
          Path Prefix: /ovictex/services/ICT_SERVICE_DESK_APISoapBinding

   4. Add the endpoint in the RFC destination. Your network configuration may require
     specification of a proxy. The following example shows the RFC destination for host
      itsamqavm130 .


5. In the Logon & Security tab, define the security settings for outgoing requests. Select
  Basic Authentication for HTTP basic authentication. Add the user and password
  specified in ovictex.properties for HTTP basic authentication. The more secure SSL
  communication configuration is described in the security chapter of the manual. You can
  also select No Logon which is the default selection for “Logon&Security”.

The following diagram shows the SMSSMEX Web service returning error 500. This result
indicates the connection between SAP and SMSSMEX is established.


1.3.1.6.2.4. Create a Logical Port

The logical port is the container that encapsulates the outgoing requests. Define the logical
port as specified in the Implementation Guide instructions.

   1. Go to transaction /nlpconfig .
   2. Select CO_PCICT_SERVICE_DESK_API as the Proxy Class name.

   3. In Call Parameters tab add the HTTP destination configured in the previous chapter.


Note

The port must be activated. Click Active to activate the logical port.


1.3.1.6.2.5. Configure Interface to SAP Solution
Manager Service Desk

This activity configures the interface between the SAP Solution Manager service desk and
Service Manager. Follow the instructions in the Implementation Guide. The configuration
requires that Apache Tomcat and the web service are configured and running. In this
implementation step the SMSSMEX web service must deliver a unique Service Desk ID. If the
Service Desk ID is changed, then the configuration must be repeated.

Use the Check button to verify the configuration. Any error message will be displayed in the
output window. Use transaction /nictconf to jump to configuration transactions.

            Note

           Do not select the Keep in sync checkbox when configuring the interface to SAP
           Solution Manager service desk.

            Note

           If the check fails, try Generate Default Mapping > Overwrite Old Values and then
           run the check again. After configuration, click Save to save the configured
           interface.


1.3.1.6.2.6. Define Value Mapping for the
Service Desk Interface

This IMG activity configures the value mapping between SAP Solution Manager Service Desk
and SMSSMEX for ingoing and outgoing requests. Changing the default value mapping of the
SAP Solution Manager is not required. If changes are necessary, use the field mapping file of
the SMSSMEX configuration file. To change the default Mapping of the SAP Solution Manager,
consult the instructions in the implementation guide.


1.3.1.6.2.7. Define Extended Interface Mapping
for Service Desk

If SAP Solution Manager Service Desk is highly customized (not using standard SAP objects)
then it might be necessary to change the interface mapping. The IMG activity instructions
provide more information.


1.3.1.6.2.8. Get SAP Solution Manager Service
Port

Go to SAP transaction /nsmicm . Select Goto > Services.

This transaction shows the host and the port required for access to the SAP Solution Manager
Service Desk web service. Specify in ovictex.properties the host/port as the endpoint entry.


1.3.1.6.3. Solution Manager tracing

SolutionManager is able to trace incoming and outgoing web-service XML messages. The
messages can be downloaded and used for failure analysis.


1.3.1.6.3.1. Enable tracing

To enable tracing, implement a SolutionManager Implementation Guide in transaction /nspro .

  spro -> SAP Reference IMG ->
  SAP SolutionManager Implementation Guide ->
  SAP SolutionManager ->
  Configuration ->
  Scenario-Specific Settings ->
  Service Desk ->
  Connecting an External Service Desk ->
  Define Extended Interface Mapping for Service Desk Customizing

Add new entries to enable tracing for incoming and outgoing calls:
      Activate/Deactivate Trace for Inbound Calls = X
      Activate/Deactivate Trace for Outbound Calls = X


1.3.1.6.3.2. Download Trace File

To download the trace file, run ict_download_snapshot in transaction /nse38 . Enter the
Solution Manager incident id in the field Transaction Number and run the program ( F8 ). The
trace file will be downloaded to the local computer (for example, incident 4711 traces will be
downloaded to C:/TEMP).
````
