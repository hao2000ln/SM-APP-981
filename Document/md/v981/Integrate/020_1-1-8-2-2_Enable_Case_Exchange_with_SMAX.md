---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.1.8.2.2 .. 1.1.8.2.3
printed_pages: 516-552
---

# 1.1.8.2.2 Enable Case Exchange with SMAX

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.8.2.2. Enable Case Exchange with SMAX

This section provides detailed instructions on how to set up the Case Exchange integration for
the Incident Management module between Service Management Automation X (SMAX) and
Service Manager.

Before setting up the Case Exchange integration, refer to SMAX integration with Service
Manager (SM) and review the compatibility information between Service Manager and Service
Management Automation X.

Topics in this section include:

The Pull mechanism

Configure SSL between Service Manager and SMAX

Add and enable an integration instance

Create and invoke Rule Sets

Specify Service Manager as an external system in SMAX

Test the integration

Related topics

Service Manager Integration Suite (SMIS)
Case Exchange framework
Case Exchange framework features
Enable Case Exchange with another system
Incident exchange scenarios
Common user tasks
System administrator tasks


1.1.8.2.2.1. The Pull mechanism

The Case Exchange integration between Service Manager and SMAX uses the Pull mechanism.
This section explains the Pull mechanisms between Line of Business (LOB) and Central IT (CIT)
in the following typical ecosystem.

In the Pull mechanism, one system actively pulls data from and sends appropriate data to the
other system.

            Note

           In the following diagrams, the arrows between the two systems represent the
           direction of the request, rather than the direction of the data flow.
In the following diagram, the CIT's system pulls data from and sends the updated data back to
the LOB's system.

The following diagram shows the data flow of the Pull mechanism.



1.1.8.2.2.2. Configure SSL between Service
Manager and SMAX

Service Manager accesses SMAX through HTTPS URLs. Follow these steps to configure the
SSL settings between Service Manager and SMAX:

   1. Get a CA certificate from the SMAX suite. For example, smaxca.crt.
     For detailed instructions, see Get the suite CA certificate.

   2. Copy the cacerts (such as <Service Manager installation
     directory>\Server\RUN\jre\lib\security\cacerts) and smaxca.crt files to the <Service
     Manager installation directory>\Server\RUN\jre\bin directory.

   3. In the bin directory, run the following command to import smaxca to cacerts.
     keytool -import -alias smaxca -keystore cacerts -file smaxca.crt

   4. Copy the cacerts file from <Service Manager installation directory>\Server\RUN\jre\bin
     to <Service Manager installation directory>\Server\RUN.

   5. Open the sm.ini file with a text editor, and then add the following parameter:
      truststoreFile:cacerts
      truststorePass:<cacert's password>


1.1.8.2.2.3. Add and enable an integration
instance

Applies to User roles: System Administrator

The configuration of the Service Manager and SMAX integration is mainly done on the Service
Manager side. However, you must do some configuration in SMAX before records can be
exchanged between the two systems. The following subsections provide detailed instructions
for adding and enabling the integration instance.

            Note

           The following instructions assume that you use the out-of-box settings of the
           CaseExchangeSM_SAW integration template. However, you can customize these
           out-of-box settings according to your need. For more information about how to
           customize the settings in the integration instance, see the following sections:
           Add and enable a Case Exchange integration instance
           Integration Instance Mapping

Add an integration instance in Service Manager

To add the Case Exchange integration between Service Manager and SMAX, follow these
steps:

   1. Click Tailoring > Integration Manager. Integration Instance Manager opens.

   2. Click Add. The Integration Template Selection wizard opens.

   3. Select CaseExchangeSM_SAW from the Integration Template list, select the Import
     Mapping checkbox, and then click Next.

   4. Complete the fields on the Integration Instance Information page as necessary, and then
     click Next.

   5. In the Integration Instance Parameters page, configure the following settings on the
     General tab, and use the default setup for all the other settings.

          • Base URL: The base URL of the SMAX API. The format of the URL is: https://<SMAX
          Server>.

          • Login URL: The login URL of SMAX. The format of the URL is: <Base
          URL>/auth/authentication-endpoint/authenticate/token

          • Tenant Id: The Tenant Id of the SMAX system.

          • User Name and Password: The credentials of the SMAX account for this
          integration.


   6. (Optional) Click the Inbound tab, and then configure the Time difference (s) setting in the
     integration instance if a time difference occurs between Service Manager and SMAX. For
     more information, see Time difference issue.

   7. Click Next. The Integration Instance Fields page opens.
   8. Modify the fields in the SM Fields and Endpoint Fields tabs as necessary. Otherwise, go

     to the next step.
   9. Click Next. The Integration Instance Mapping page opens.
 10. In the Post Script tab, update 10019 to the corresponding Service ID in SMAX in the

     following out-of-box code:

          if (context.outbound) {
          context.action = mapObj["ext_properties.Operation"];
          //set the default value of required Primary Data when create the
          ticket
          if(context.action=="Create") {
          mapObj["properties.RegisteredForActualService"]="10019";

                        //set the default service
          }

 11. Click Finish.

Enable an integration instance in Service Manager

To enable the integration instance, follow these steps:

   1. Click Tailoring > Integration Manager. Integration Instance Manager opens.
   2. Select the integration instance that you want to enable.
   3. Click Enable.
   4. Click Yes.

Configure an integration instance in SMAX

Before you can exchange records between Service Manager and SMAX, you must do the
following configuration in SMAX:

   1. Make sure your user account has the "SACM Integration" role assigned.
   2. Add an external system.

     In Service Manager Case Exchange SMIS instance, an external system named "SM" is
     used by default for SMAX integration.


                   Note

                For the external system defined in SMAX, if you use a name other than "SM",
                you must make the following changes in Service Manager when you add the
                integration instance:

                     • For the "Query" field on the Inbound tab, replace "SM" in "system=SM"
                     with your new name
                     • For the values of the "Additional path" column on the Outbound tab,
                     replace "SM" with your new name in "ExternalSystem":"SM"

   3. Assign the external system to a group by using the External system field on the Groups
     page. This makes the group an external group.

After this configuration, you can select the external group for an incident record in the Incident
Management module. Once an external group is selected, a new section, External
Assignment, is then added to the incident page. You can then use that section to configure the
record for data exchange.

For more information about the external systems, groups, or user account roles in SMAX, refer
to the corresponding sections in the SMAX documentation.


1.1.8.2.2.4. Create and invoke Rule Sets

Service Manager doesn't provide out-of-box Rule Sets for the Case Exchange integration
between Service Manager and SMAX, so you must create Rule Sets when you set up the
integration. See the following topics for how to create and invoke Rule Sets:

     Create a rule set

                   Note

                When you create a Rule Set for incident exchange between Service Manager
                and SMAX, set the Table name field to probsummary.

     Add a Case Exchange rule
     Using the Condition Editor
     Invoke Case Exchange Rule Sets

Example Rule Sets

The following table provides example outbound rules that work in the out-of-box Service
Manager system. You may modify these rules according to the workflow in your system.

Condition (RAD expression)                    Event    Service Manager 9.81
                                                                      Page 524 of 1727
assignment in $L.file="                       Create
<external_assignment_group>" and
sysmoduser in $L.file~="
<smis_scheduler_name>" and
jscall("CaseExchangeExternalReferencesDA
O.getExternalID",number in $L.file)=""

problem.status in $L.file= problem.status in  Update
$L.file.save and sysmoduser in $L.file~="
<smis_scheduler_name>" and
jscall("CaseExchangeExternalReferencesDA
O.isExternalActive","probsummary",number
in $L.file)=true

sysmoduser in $L.file="                       Update
<smis_scheduler_name>"

Note

This rule is used to
acknowledge the Update action.

assignment in $L.file="                       Resolve
<external_assignment_group>" and
problem.status in $L.file~= problem.status
in $L.file.save and resolution.code in
$L.file#"Solved by" and sysmoduser in
$L.file~="<smis_scheduler_name>" and
jscall("CaseExchangeExternalReferencesDA
O.isExternalActive","probsummary",number
in $L.file)=true

assignment in $L.file="                       Reject
<external_assignment_group>" and
problem.status in $L.file~= problem.status
in $L.file.save and resolution.code in
$L.file="Request Rejected" and sysmoduser
in $L.file~="<smis_scheduler_name>" and
jscall("CaseExchangeExternalReferencesDA
O.isExternalActive","probsummary",number
in $L.file)=true

This PDF was generated on May 23, 2026

Condition (RAD expression)                  Event

assignment in $L.file="                     Cancel
<external_assignment_group>" and
problem.status in $L.file~= problem.status
in $L.file.save and resolution.code in
$L.file="Withdrawn by User" and
sysmoduser in $L.file~="
<smis_scheduler_name>" and
jscall("CaseExchangeExternalReferencesDA
O.isExternalActive","probsummary",number
in $L.file)=true

For more information about the getExternalID and isExternalActive functions, see Functions
used in rule conditions.


1.1.8.2.2.5. Specify Service Manager as an
external system in SMAX

To enable the Case Exchange integration with SMAX, you also need to specify Service
Manager as an external system in the SMAX environment.
To do this, follow these steps:

   1. Sign in to SMAX as a system administrator.
   2. Click My Dashboards.
   3. From the main menu, navigate to Administration > Utilities and then click Integration.
   4. Select the External Systems tab, and then click New.
   5. On the external system details page, enter information as described in the following table.

Field                                                                                      Service Manager 9.81
System id
                                        Value

                                        SM

                                                    Note

                                                   This is the default value
                                                   that's defined in the
                                                   CaseExchangeSM_SAW
                                                   integration template in
                                                   Service Manager. To verify
                                                   this value ( &system=SM ),
                                                   locate the Query string on
                                                   the Inbound tab of the
                                                   Integration Instance
                                                   Parameters page of this
                                                   integration template. For
                                                   more information, see
                                                   Integration Instance
                                                   Parameters - Inbound. If you
                                                   have customized the Query
                                                   string, be sure to enter a
                                                   value that's consistent with
                                                   your customized Query
                                                   string.

Description                             A short description that identifies the
Authorized user                         Service Manager system

                                        Select your login account from the list of
                                        user accounts.

6. Click Save.
7. Create an Assignment Group for Service Manager.

       a. From the main menu, navigate to Administration > Master Data, and then click
       People.
       b. Click the Groups tab at the top of the page.
       c. Click New.
       d. On the new group page, enter information as described in the following table.


Field                                   Value
Name
                                        Enter Central IT as the name for the
User principal name                     group.
                                        This is a mandatory field.
Group type
Email                                   Enter Central IT for this field.
Owner                                   This field is mandatory and must be
                                        unique.

                                        Select Organizational.

                                        (Optional) Enter an email address for the
                                        group.

                                        (Optional) Open the drop-down search
                                        window and search for the required
                                        person.

Note

If you want Service Manager to pull the Incidents, set either the Expert
group or Service desk group value to Central IT. Additionally, when
creating a new Incident, you must complete the title, description, impact,
urgency, service, category, service desk group, and assignment group
fields in the SMAX Incident form.

       e. Click Save to add the new group to the list of groups.

8. Click the Central IT group from the list and then make the following edits.

       a. In the External system field, select SM.

       b. Locate the System use definitions section, and add the following group roles in
       the Group roles field: Incident Analyst, Incident Coordinator, Incident Manager, and
       Incident Process Owner.

       c. Click Save to save the group.


1.1.8.2.2.6. Test the integration

Once you have finished the above configurations in the Service Manager system, you can test
the Case Exchange integration. The following procedure is an example that you can follow to
test the basic functions of the integration:

   1. In SMAX, create a new Incident record.
   2. Wait for a while (depending on the value that's configured in the Interval Time field) and

     the Incident record should be exchanged to the Service Manager system.
   3. In Service Manager, update the Incident record so that the update can trigger the

     outbound rule that's configured in Create and invoke Rule Sets.
   4. The update to the Incident record should be exchanged to SMAX.

If all the above steps are successful, the integration between the two systems is properly
configured.
If any of the above steps is unsuccessful, the following checklist can help you to solve the
possible problems.


Symptoms                                  Checklist
In step 2, the Incident record doesn't
appear in Service Manager.                Check the following areas in Service
                                          Manager:
In step 4, the update in Service Manager
can't be exchanged to SMAX.                    Check the Service Manager
                                               Integration Suite (SMIS) task queue
                                               and task log.

                                               Check the integration instance.

                                                    • Is the integration instance
                                                    active?
                                                    • Is the information in the General
                                                    tab correct?
                                                    • Have you done any
                                                    customization when you set up
                                                    the integration instance?

                                               Check the log file. For more
                                               information, refer to Review log file.

                                          Check the following areas in Service
                                          Manager:

                                               Check the SMIS task queue and task
                                               log.

                                               Have you done any customization
                                               when you set up the integration
                                               instance?

                                               Check the outbound rule, and make
                                               sure that the update to the Incident
                                               record can trigger the outbound rule.
                                               See Create and invoke Rule Sets.

                                               Check the log file. For more
                                               information, refer to Review log file.

Consider the following tips when you test the Case Exchange integration:

     Incorrect configuration of the Base URL, User Name, and Password fields in the General
     tab usually causes authentication failure. In this scenario, 401 errors are recorded in the
     log file.


You can enable the error-handling feature when you configure the integration instance.
SMIS can automatically create a new Incident record if a Case Exchange task fails. The
Description field of this Incident record contains the details of the failed task record. For
more information about the error-handling feature, see Error handling.

Due to a known limitation, the error message in the SMIS task log may be insufficient to
identify the root cause of a failed task. For more information about this known limitation
and the workaround, see Insufficient message for a failed Case Exchange task.


1.1.8.2.3. Enable Case Exchange between two
Service Manager systems

This section provides detailed instructions on how to set up the Case Exchange integration for
the Incident Management module between two Service Manager systems.

Service Manager provides two integration templates for the Case Exchange integration
between two Service Manager systems: CaseExchangeSM_SM_Pull and
CaseExchangeSM_SM_Push. You can modify these template as necessary. To modify the
integration template, follow the instructions in Service Manager Integration Suite (SMIS).

Before you start to set up the Case Exchange integration, we highly recommend that you read
the following sections under Case Exchange framework:

     Case Exchange framework features: This section introduces the core features of the
     Case Exchange framework.
     Enable Case Exchange with another system : This section provides recommendations and
     general instructions on how to enable Case Exchange with another system.
     Incident exchange scenarios: This section introduces typical Case Exchange use cases.
     Common user tasks: This section introduces the common user tasks that apply to the
     Incident Management module in the Case Exchange integration.
     System administrator tasks: This section introduces the system administrator tasks in the
     Case Exchange integration.


1.1.8.2.3.1. Connection mechanisms

The Case Exchange integration between two Service Manager systems has two connection
mechanisms: Pull and Push.
This section explains the two connection mechanisms between Line of Business (LOB) and
Central IT (CIT) in the following typical ecosystem.

The Pull mechanism

In the Pull mechanism, one system actively pulls data from and sends appropriate data to the
other system. The latter system doesn't need an integration instance.

In the following diagram, the Central IT (CIT) pulls data from and sends the updated data back
to the Line of Business (LOB).

            Note

           In the following diagrams, the arrows between the two systems represent the
           direction of the request, rather than the direction of the data flow.

The Pull mechanism has the following advantages and disadvantages.


Advantages                            Disadvantages

Only one integration account is       The LOB has very little control over the
required. That is, an integration     pulled data.
account in the LOB's system.
You don't need to configure the Case
Exchange logic in the LOB's system.
The CIT's system manages all use
cases for Case Exchange.
Only the CIT's system needs
configurations of field mapping and
value mapping.

The following diagram shows the data flow of the Pull mechanism.

The Push mechanism

In the Push mechanism, both systems push data to each other. In this mechanism, both
systems need an active integration instance.

In the following diagram, the Line of Business (LOB) pushes data to the Central IT (CIT), and
the Central IT pushes the updates back to the Line of Business.

The Push mechanism has the following advantages and disadvantages.  Page 534 of 1727

This PDF was generated on May 23, 2026

Advantages                              Disadvantages

The LOB defines the criteria to send    Configuration is required in both
data to the CIT.                        systems.
The CIT receives data based on the      Field mapping and data mapping are
LOB's decision.                         required in both systems.
Every party manages its own
integration.
This mechanism provides flexibility on
both sides.
The LOB can integrate with other
Service Providers.

The following diagram shows the data flow of the Push mechanism.


1.1.8.2.3.2. Using the Pull mechanism

This section describes how to set up the Case Exchange integration between two Service
Manager systems (System 1 and System 2) by using the Pull mechanism.
In this mechanism, System 1 uses an integration instance that's based on the
CaseExchangeSM_SM_Pull template, and System 2 doesn't need an integration instance.

Configure System 1

In System 1, you need to perform the following tasks.

Add and enable an integration instance

Applies to User roles: System Administrator
To add an integration instance in System 1, follow these steps:

   1. Click Tailoring > Integration Manager. Integration Instance Manager opens.
   2. Click Add. The Integration Template Selection wizard opens.
   3. Select CaseExchangeSM_SM_Pull from the Integration Template list, select the Import

     Mapping checkbox, and then click Next.
   4. Complete the fields on the Integration Instance Information page as necessary, and then

     click Next.
     For more information about how to configure this page, see Integration Instance
     Information fields.
   5. In the Integration Instance Parameters page, configure the following settings in the
     General tab and use the default setup for all the other settings.

                   Note

                You can modify the other fields according to your needs. For more
                information about how to modify the fields in this page, see Configuration
                details

     Endpoint System runs Process Designer on the exchanged Object: Select this option if
     Process Designer is implemented in system 2. Otherwise, don't select this option.
     Base URL: The value of this field represents the base URL of the endpoint API. For
     example, http://{endpoint server}:13080/SM/9
     User Name and Password: The credentials of the integration account in system 2.


                   Note

                • The Password field must not be empty.
                • This account must be properly configured in system 2. For more
                information, see Configure the integration account.

   6. Click Next. The Integration Instance Fields page opens.
   7. Modify the default entries in the SM Fields and Endpoint Fields if you have customized

     fields. Otherwise, go to the next step.

                   Note

                Endpoint field names must be the same as the caption names in web service
                CEIncidentsPull. For more information about the caption names configured in
                CEIncidentsPull, click Tailoring > Web Service > Web Service Configuration
                in Service Manager. In addition, you can refer to the out-of-box settings of the
                Field Name field in the Endpoint Fields tab.

   8. Click Next. The Integration Instance Mapping page opens.
   9. Configure field and value mappings if you have customized fields. Otherwise, go to the

     next step.
     For more information about how to edit the settings on this page, see the topics under
     Integration Instance Mapping.
 10. Click Finish.

To enable the integration instance, follow these steps:

   1. Click Tailoring > Integration Manager. Integration Instance Manager opens.
   2. Select the integration instance that you want to enable.
   3. Click Enable.
   4. Click Yes.

Create and invoke outbound rules

This section introduces how to create and invoke outbound rules when you use the Pull
mechanism.
In Case Exchange, outbound rules implement business logic to drive a workflow or a process.
Rules can help perform calculations, validate fields based on data or Rule Sets, set required
fields, and more. A Rule Set uses role-based security.

Create outbound rules


The following screenshot shows an example outbound rule configuration for a Case Exchange
integration.

The following table provides example outbound rules that work in the out-of-box Service
Manager system. You may modify these rules according to the workflow in your system.

            Note

           When you create a Rule Set for Incident exchange, set the Table name field to
           probsummary .

Condition (RAD expression)                  Event    Service Manager 9.81
                                                                    Page 539 of 1727
assignment in $L.file="<assignment          Create
group>" and problem.status in $L.file isin
{"Pending Customer", "Pending Vendor"}
and sysmoduser in $L.file~="
<smis_scheduler_name>" and
jscall("CaseExchangeExternalReferencesDA
O.getExternalID",number in $L.file)=""

(not same(problem.status in $L.file,        Update
problem.status in $L.file.save) or
$apm.activity isin {"Communication with
customer","Communication with vendor"})
and not ( problem.status in $L.file isin
{"Rejected","Resolved","Closed"}) and
sysmoduser in $L.file~="
<smis_scheduler_name>" and
jscall("CaseExchangeExternalReferencesDA
O.isExternalActive","probsummary",number
in $L.file)=true

not same(problem.status in $L.file,         Resolve
problem.status in $L.file.save) and
problem.status in $L.file isin
{"Resolved","Closed"} and resolution.code
in $L.file~="Request Rejected" and
sysmoduser in $L.file~="
<smis_scheduler_name>" and
jscall("CaseExchangeExternalReferencesDA
O.isExternalActive","probsummary",number
in $L.file)=true

not same(problem.status in $L.file,         Reject
problem.status in $L.file.save) and
problem.status in $L.file isin
{"Rejected","Resolved","Closed"} and
resolution.code in $L.file="Request
Rejected" and sysmoduser in $L.file~="
<smis_scheduler_name>" and
jscall("CaseExchangeExternalReferencesDA
O.isExternalActive","probsummary",number
in $L.file)=true

This PDF was generated on May 23, 2026

Condition (RAD expression)                           Event
                                                     Acknowledge
(sysmoduser in $L.file="
<smis_scheduler_name>")

For more information about the getExternalID and isExternalActive functions, see Create a
rule set

Invoke Rule Sets

If Process Designer is implemented in Service Manager, you can invoke Rule Sets from
workflows. For more information, see Invoke Rule Sets from workflows.

If Process Designer is not implemented in Service Manager, you must invoke Rule Sets from
triggers. The following table contains example configurations for two triggers: Incident update
and Incident creation.

Trigger                                 Incident update              Incident creation
Trigger Name
Table Name                              case.exchange-update         case.exchange-creation
Trigger Type
Script                                  probsummary                  probsummary

                                        4 - After Update             2 - After Add

                                        lib.CaseExchange_RuleExec    lib.CaseExchange_RuleExec
                                        ute.executeSingleRuleSet(re  ute.executeSingleRuleSet(re
                                        cord,                        cord,
                                        oldrecord,"CERule4SM2SM"     oldrecord,"CERule4SM2SM"
                                        )                            )

Note

In this example, the Rule Set ID is CERule4SM2SM .

For more information about how to invoke Rule Sets from triggers, see Invoke Rule Sets from
triggers.

Configure System 2

In System 2, you only need to configure the account for the Case Exchange integration.

Configure the integration account

System 1 needs the credentials of an account in System 2 to successfully enable the
integration. This account must meet the following requirements:


     In case System 2 needs to control what data is pulled by System 1, System 2 can apply
     mandanten security on this account. For more information, see Mandanten file security.

     This account must have the RESTful API execution capability.

     For more information about how to configure this execution capability, see Configure the
     integration account.

     This account must have the rights to retrieve and update Incident records.

     This account must use the same Time Zone and Date Format settings as the endpoint
     Service Manager system. See also Time difference issue.

Test the integration

Once you have finished the above configurations in the Service Manager systems, you can test
the Case Exchange integration. The following procedure is an example that you can follow to
test the basic functions of the integration:

   1. In System 2, create a new Incident record that's accessible by the integration account
     that's configured in Configure the integration account.

   2. Wait for a while (depending on the value that's configured in the Interval Time field) and
     the Incident record should be exchanged to System 1.

   3. In System 1, update the Incident record so that the update can trigger the outbound rule
     that's configured in Create and invoke outbound rules.

   4. The update to the Incident record should be exchanged to System 2.

If all the above steps are successful, the integration between the two systems is properly
configured.

If any of the above steps is unsuccessful, the following checklist can help you to solve the
possible problems.


Symptoms                                    Checklist
In step 2, the Incident record doesn't
appear in System 1.                              In System 1, check the Service
                                                 Manager Integration Suite (SMIS) task
In step 4, the update in System 1 can't be       queue and task log.
exchanged to System 2.
                                                 In System 1, check the integration
                                                 instance.

                                                 • Is the integration instance active?
                                                 • Is the information in the General tab
                                                 correct?
                                                 • Have you done any customization
                                                 when you set up the integration
                                                 instance?

                                                 In System 1, check the log file. For
                                                 more information about how to check
                                                 the log file, see Review log file.

                                                 In System 2, check the account
                                                 setting, and make sure that the
                                                 Incident record is accessible by the
                                                 integration account. see Configure the
                                                 integration account.

                                                 In System 1, check the SMIS task
                                                 queue and task log.

                                                 In System 1, have you done any
                                                 customization when you set up the
                                                 integration instance?

                                                 In System 1, check the outbound rule,
                                                 and make sure that the update to the
                                                 Incident record can trigger the
                                                 outbound rule. See Create and invoke
                                                 outbound rules.

                                                 Check the log file. For more
                                                 information about how to check the
                                                 log file, see Review log file.

Consider the following tips when you test the Case Exchange integration:


Incorrect configuration of the Base URL, User Name, and Password fields in the General
tab usually causes authentication failure. In this scenario, 401 errors are recorded in the
log file.

You can enable the error-handling feature when you configure the integration instance.
SMIS can automatically create a new Incident record if a Case Exchange task fails. The
Description field of this Incident record contains the details of the failed task record. For
more information about the error-handling feature, see Error handling.

Due to a known limitation, the error message in the SMIS task log may be insufficient to
identify the root cause of a failed task. For more information about this known limitation
and the workaround, see Insufficient message for a failed Case Exchange task.


1.1.8.2.3.3. Using the Push mechanism

This section describes how to set up the Case Exchange integration between two Service
Manager systems (System 1 and System 2) by using the Push mechanism.

In this mechanism, both systems use an integration instance that's based on the
CaseExchangeSM_SM_Push template. You need to perform the following configurations in
both Service Manager systems:

Configure the integration account

Each system must have a properly configured account for the integration so that the other
system can connect by using this account. This account must meet the following requirements:

     This account must have the RESTful API execution capability.
     This account must have the rights to retrieve and update Incident records.
     This account must use the same Time Zone and Date Format settings as the Service
     Manager systems. See also Time difference issue.

Add and enable an integration instance

Applies to User roles: System Administrator

To add an integration instance, follow these steps:

   1. Click Tailoring > Integration Manager. Integration Instance Manager opens.

   2. Click Add. The Integration Template Selection wizard opens.
   3. Select CaseExchangeSM_SM_Push from the Integration Template list, select the Import

     Mapping checkbox, and then click Next.

   4. Complete the fields on the Integration Instance Information page as necessary, and then
     click Next.

     For more information on how to configure this page, see Integration Instance Information
     fields.

   5. On the Integration Instance Parameters page, configure the following settings and use
     the default setup for all the other settings.

                   Note

                You can modify the other fields according to your needs. For more
                information about how to modify the fields on this page, see Configuration
                details

          a. On the General tab, configure the following fields or options:


         Endpoint System runs Process Designer on the exchanged Object: Select this
         option if Process Designer is implemented in the endpoint system. Otherwise, don't
         select this option.
         Base URL: The value of this field represents the base URL of the endpoint API. For
         example, http://{endpoint server}:13080/SM/9
         User Name and Password: The credentials of the integration account in the
         endpoint system.

                       Note

                    • The Password field must not be empty.
                    • This account must be properly configured in the endpoint system. For
                    more information, see Configure the integration account.

       b. On the Outbound tab, set the <Endpoint_instance_ID> in all rows of the Additional
       path column:

      {"CEIncidentPush": {"InstanceID": "
      <Endpoint_instance_ID>","InternalID":"${context.externalId}",
      "ExternalID": "${context.internalId}",
      "IncidentID":"${context.externalId}",
      "ExternalStatus":"${context.internalObject['problem.status']}"}}

       <Endpoint_instance_ID> is the ID of the SMIS integration instance in the other Service
       Manager system. You can find this ID under the Id column when you open Integration
       Manager in the other Service Manager system.
       c. If you need to exchange attachments, select the Activate attachment exchange
       option on the Attachment Handling tab.
6. Click Next. The Integration Instance Fields page opens.
7. Modify the default entries in the SM Fields and Endpoint Fields if you have customized
  fields. Otherwise, go to the next step.

               Note

             Endpoint field names must be the same as the caption names in web service
             CEIncidentsPush. For more information about the caption names configured
             in CEIncidentsPush, click Tailoring > Web Service > Web Service
             Configuration in Service Manager. In addition, you can refer to the out-of-box
             settings of the Field Name field in the Endpoint Fields tab.

8. Click Next. The Integration Instance Mapping page opens.


   9. Configure field and value mappings if you have customized fields. Otherwise, go to the
     next step.

     For more information about how to edit the settings on this page, see the topics under
     Integration Instance Mapping.

 10. Click Finish.

To enable the integration instance, follow these steps:

   1. Click Tailoring > Integration Manager. Integration Instance Manager opens.
   2. Select the integration instance that you want to enable.

   3. Click Enable.

   4. Click Yes.

Create and invoke outbound rules

This section introduces how to create and invoke outbound rules when you use the Push
mechanism.

In Case Exchange, outbound rules implement business logic to drive a workflow or a process.
Rules can help perform calculations, validate fields based on data or Rule Sets, set required
fields, and more. A Rule Set uses role-based security.

Create outbound rules

The following table provides example outbound rules that work in the out-of-box Service
Manager system. You may modify these rules according to the workflow in your system.

For an example of the outbound rule configuration, see the screenshot in Create outbound
rules.

            Note

           When you create a Rule Set for Incident exchange, set the Table name field to
           probsummary .


Condition (RAD expression)                  Event

assignment in $L.file="<assignment          Create
group>" and problem.status in $L.file isin
{"Pending Customer", "Pending Vendor"}
and sysmoduser in $L.file~="
<smis_scheduler_name>" and sysmoduser
in $L.file~="<endpoint_integration_user>"
and
jscall("CaseExchangeExternalReferencesDA
O.getExternalID",number in $L.file)=""

(not same(problem.status in $L.file,        Update
problem.status in $L.file.save) or
$apm.activity isin {"Communication with
customer","Communication with vendor"})
and not ( problem.status in $L.file isin
{"Rejected","Resolved","Closed"}) and
sysmoduser in $L.file~="
<smis_scheduler_name>" and sysmoduser
in $L.file~="<endpoint_integration_user>"
and
jscall("CaseExchangeExternalReferencesDA
O.isExternalActive","probsummary",number
in $L.file)=true

not same(problem.status in $L.file,         Resolve
problem.status in $L.file.save) and
problem.status in $L.file isin
{"Resolved","Closed"} and resolution.code
in $L.file~="Request Rejected" and
sysmoduser in $L.file~="
<smis_scheduler_name>" and sysmoduser
in $L.file~="<endpoint_integration_user>"
and
jscall("CaseExchangeExternalReferencesDA
O.isExternalActive","probsummary",number
in $L.file)=true


Condition (RAD expression)                  Event

not same(problem.status in $L.file,         Reject
problem.status in $L.file.save) and
problem.status in $L.file isin
{"Rejected","Resolved","Closed"} and
resolution.code in $L.file="Request
Rejected" and sysmoduser in $L.file~="
<smis_scheduler_name>" and sysmoduser
in $L.file~="<endpoint_integration_user>"
and
jscall("CaseExchangeExternalReferencesDA
O.isExternalActive","probsummary",number
in $L.file)=true

(sysmoduser in $L.file="                    Acknowledge
<smis_scheduler_name>" or sysmoduser in
$L.file="<endpoint_integration_user>") and
(jscall("CaseExchangeExternalReferencesD
AO.getExternalID",number in $L.file)="" or
not same(problem.status in $L.file,
problem.status in $L.file.save))

            Note

           Be careful with the outbound conditions to avoid a loop between the integrated
           systems.

For more information about the getExternalID and isExternalActive functions, see Functions
used in rule conditions.

For more information about how to create Rule Sets, see the following topics:

     Create a rule set
     Add a Case Exchange rule
     Using the Condition Editor

Invoke Rule Sets

If Process Designer is implemented in Service Manager, you can invoke Rule Sets from
workflows. For more information, see Invoke Rule Sets from workflows.

If Process Designer is not implemented in Service Manager, you must invoke Rule Sets from
triggers. The following table contains example configurations for two triggers: Incident update
and Incident creation.


Trigger                                 Incident update              Incident creation
Trigger Name
Table Name                              case.exchange-update         case.exchange-creation
Trigger Type
Script                                  probsummary                  probsummary

                                        4 - After Update             2 - After Add

                                        lib.CaseExchange_RuleExec    lib.CaseExchange_RuleExec
                                        ute.executeSingleRuleSet(re  ute.executeSingleRuleSet(re
                                        cord,                        cord,
                                        oldrecord,"CERule4SM2SM"     oldrecord,"CERule4SM2SM"
                                        )                            )

Note

In this example, the Rule Set ID is CERule4SM2SM .

For more information about how to invoke Rule Sets from triggers, see Invoke Rule Sets from
triggers.

Test the integration

Once you have finished the above configurations in the two Service Manager systems, you can
test the Case Exchange integration. The following procedure is an example that you can follow
to test the basic functions of the integration:

   1. In System 2, create a new Incident record. This Incident record must be able to trigger the
     outbound rule that's configured in System 2. See Create and invoke outbound rules.

   2. The Incident record should be exchanged to System 1.

   3. In System 1, update the Incident record so that the update can trigger the outbound rule
     that's configured in System 1. See Create and invoke outbound rules.

   4. The update to the Incident record should be exchanged to System 2.

If all the above steps are successful, the integration between the two systems is properly
configured.

If any of the above steps is unsuccessful, the following checklist can help you to solve the
possible problems.

Symptoms                                                                                         Service Manager 9.81

In step 2, the Incident record doesn't  Checklist
appear in System 1.
                                             In System 2, check the Service
                                             Manager Integration Suite (SMIS) task
                                             queue and task log.

                                             In System 2, check the integration
                                             instance:

                                             • Is the integration instance active?
                                             • Is the information in the General tab
                                             correct?
                                             • Have you done any customization
                                             when you set up the integration
                                             instance?

                                             In System 2, check the log file. For
                                             more information about how to check
                                             the log file, see Review log file.

                                             In System 2, check the outbound rule,
                                             and make sure that the update to the
                                             Incident record can trigger the
                                             outbound rule. See Create and invoke
                                             outbound rules.

                                             In System 1, check the account
                                             setting. See Configure the integration
                                             account.


Symptoms                                    Checklist

In step 4, the update in System 1 can't be       In System 1, check the SMIS task
exchanged to System 2.                           queue and task log.

                                                 In System 1, have you done any
                                                 customization when you set up the
                                                 integration instance?

                                                 In System 1, check the outbound rule,
                                                 and make sure that the update to the
                                                 Incident record can trigger the
                                                 outbound rule. See Create and invoke
                                                 outbound rules.

                                                 In System 1, check the log file. For
                                                 more information about how to check
                                                 the log file, see Review log file.

                                                 In System 2, check the account
                                                 setting. See Configure the integration
                                                 account.

Consider the following tips when you test the Case Exchange integration:

     Incorrect configuration of the Base URL, User Name, and Password fields in the General
     tab usually causes authentication failure. In this scenario, 401 errors are recorded in the
     log file.

     You can enable the error-handling feature when you configure the integration instance.
     SMIS can automatically create a new Incident record if a Case Exchange task fails. The
     Description field of this Incident record contains the details of the failed task record. For
     more information about the error-handling feature, see Error handling.

     Due to a known limitation, the error message in the SMIS task log may be insufficient to
     identify the root cause of a failed task. For more information about this known limitation
     and the workaround, see Insufficient message for a failed Case Exchange task.
````
