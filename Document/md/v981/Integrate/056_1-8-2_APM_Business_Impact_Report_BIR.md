---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.8.2 .. 1.9.1
printed_pages: 1524-1554
---

# 1.8.2 APM Business Impact Report (BIR)

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.8.2. APM Business Impact Report (BIR)

Application Performance Management (APM) includes a report that you can use to help
evaluate the impact of incidents on your business. A Business Impact report displays
information about how a CI impacts the Business Services it belongs to. Data about the
affected Business Service, Application, and Business Process CIs includes KPI data, over-time
data, and SLA data. For example, if a host CI has critical status, you can use the report to
display the status of the Business Service CIs to which the host CI is attached.

Incident Management users can launch an impact report from an incident in context with the
incident's affected configuration item (CI). Service Desk Agents can validate the updated
status of the business impact to categorize and prioritize the incident accordingly.

This integration also supports multi-tenancy. System Administrators can enable multi-tenancy
for the integration.

            Note

                This integration requires that both Service Manager and APM be integrated
                with Universal CMDB (UCMDB) so that configuration items (CIs) can be
                synchronized between the servers. For details about how to configure an
                integration from Service Manager or APM to UCMDB, see Universal CMDB
                (UCMDB) and refer to the Application Performance Management (APM)
                documentation.
                Only one instance of this integration is allowed.

Prerequisites:

     Before end-users can use this integration, System Administrators must add and enable an
     instance of this integration in Integration Manager (SMIS).
     Optionally, System Administrators can use Lightweight Single Sign-On (LW-SSO) to
     bypass the log-in prompts.

Related topics

Integration Manager
Application Performance Management (APM)
APM Business Impact Report integration setup
Add a APM Business Impact Reports integration
Enable LW-SSO for the Business Impact Report (BIR) integration
Enable multi-tenancy for the APM Business Impact Report integration
Launch a Business Impact Report from an incident


1.8.2.1. APM Business Impact Report
integration setup

To set up the APM Business Impact Report (BIR) integration in your environment, you need to
complete the following tasks:

   1. Add a APM Business Impact Reports integration

     This task creates and enables an instance of this integration in the Integration Manager
     (SMIS).

   2. Enable LW-SSO for the Business Impact Report (BIR) integration

     LW-SSO is optional but highly recommended for this integration. This task includes
     enabling LW-SSO in both the Service Manager Web tier and APM. Enabling LW-SSO for
     the integration enables Incident Management users to bypass the login prompts when
     launching a APM business impact report from an incident.

   3. Enable multi-tenancy for the APM Business Impact Report integration

     Perform this task only when your Service Manager environment is running in multi-
     company mode.

Related topics

Application Performance Management (APM)
APM Business Impact Report (BIR)
Launch a Business Impact Report from an incident


1.8.2.1.1. Add a Business Impact Report
integration

Applies to User Roles: System Administrator
To use the Service Manager to BIR integration, you must add and enable an instance of this
integration in Integration Manager. Optionally, you can enable Lightweight Single Sign-On (LW-
SSO) in APM and in Service Manager to bypass the log-in prompts.
To add and enable a Service Manager to BIR integration instance:

   1. Click Tailoring > Integration Manager. Integration Instance Manager opens.
   2. Click Add. The Integration Template Selection wizard opens.
   3. Select SMBIR from the Integration Template list. Ignore the Import Mapping checkbox,

     which has no effect on this integration.

                   Note

                Only one instance of this integration is allowed. If an instance of this
                integration already exists in Integration Manager, the SMBIR template is
                unavailable. You have to delete the existing integration instance before you
                can add a new one.

   4. Click Next. The Integration Instance Information page opens.
   5. Update the following fields:

                   Note

                Only Name and Version are required fields. This integration doesn't use the
                Interval Time (s) and Max Retry Times fields as it is UI-based.


Field                                   Value
Name
                                        (Required) The name of the integration
                                        instance.
                                        Default: SMBIR

Version                                 (Required) The version of the integration
                                        template.

                                        Default: 1.0

SM Server                               The name of the Service Manager server
Endpoint Server                         machine.
Log Level
Log File Directory                      The name of the APM Server machine.

Description                             Select one from: DEBUG, INFO (default),
Run at system startup                   WARNING, ERROR, and OFF.

                                        A directory on the Service Manager
                                        Server machine in which log files will be
                                        stored.

                                        If you want, modify the default
                                        description of the instance.

                                        Select this checkbox only if you want this
                                        instance to be automatically enabled
                                        when the Service Manager Server is
                                        started.

 6. Click Next. The Integration Instance Parameters page opens.
 7. On the General Parameters tab, replace "APM_host" in the baseurl parameter with the

    hostname of the real APM server.

 8. Click Next twice and then click Finish. Leave the Integration Instance Mapping and
    Integration Instance Fields settings blank. This integration doesn't use these settings.

    Service Manager creates the instance. You can edit, enable, disable, or delete it in
    Integration Manager.

 9. Enable the integration instance.

10. (Optional) Configure LW-SSO in APM and then configure LW-SSO in Service Manager


Related topics

Integration Manager
Application Performance Management (APM)
APM Business Impact Report (BIR)
Incident Exchange (OMi - SM) integration
Enable LW-SSO for the Incident Exchange (OMi - SM) integration
Configure LW-SSO in the Service Manager Web tier
Edit an integration instance
Enable or disable an integration instance
Launch a Business Impact Report from an incident


1.8.2.1.2. Enable LW-SSO for the Business
Impact Report (BIR) integration

If you have enabled LW-SSO for the Business Impact Report (BIR) integration, you can launch a
business impact report in APM from a Service Manager incident.
To enable LW-SSO for the BIR integration, complete the following tasks:

     Configure LW-SSO in the Service Manager Web tier
     Configure LW-SSO in Application Performance Management (APM)

Related topics

Application Performance Management (APM)
APM Business Impact Report (BIR)
Launch a Business Impact Report from an incident


1.8.2.1.3. Enable multi-tenancy for the APM
Business Impact Report integration

Applies to User roles: System Administrator
The APM Business Impact Report integration provides multi-tenancy support. It allows an
Incident Management user to launch APM Business Impact Report (BIR) based on the UCMDB
Customer ID of the user's company.

To enable multi-tenancy for this integration, you need to complete the following tasks:

   1. Enable multi-tenancy in Service Manager.
   2. Synchronize companies between Service Manager and UCMDB.
   3. Synchronize companies between APM and UCMDB.

Suppose you have enabled multi-tenancy for the integration and a user launches a Business
Impact Report from an incident. Based on the Customer ID of the company record retrieved
from the user's contact information, the system displays BIR in the incident's related Business
Service or Affected CI.

            Note

           Note: You can click the Find icon for a user's Contact ID field to find information
           about the company associated to the user.

To enable multi-tenancy in Service Manager:

   1. Sign in to Service Manager.
   2. Go to System Administration >Base System Configuration > Miscellaneous > System

     Information Record.
   3. In the General tab, select Run in Multi-Company Mode.

   4. In the Active Integrations tab, do the following:

           Select Universal CMDB.

           In the Multi-tenant UCMDB webservice URL field, type the URL to the multi-tenant
           UCMDB Web Service API. The URL has the following format:

            <UCMDB server name>:<port>/axis2/services/ucmdbManagementService
           Replace <UCMDB server name> with the hostname of your UCMDB server, and
           replace <port> with the communications port your UCMDB server uses.

           In the UserId and Password fields, type the user ID and password of a UCMDB user
           account that has permission to access the multi-tenant UCMDB Web Service API.


                   Note

                The UCMDB webservice URL, UserID, and Password fields aren't required
                for enabling multi-tenancy.

   5. Log off and then log back on to Service Manager so that the configuration takes effect.

To synchronize a company between Service Manager and UCMDB:

   1. Sign in to System Administration > Base System Configuration > Companies.
   2. Open an existing company record or create a new one.

        1. To open an existing company record, click Search and select the record from the
           list.

        2. To create a new company record, type a Customer ID , Company Code , and
            Company Name for the new record, and then click Add.

   3. In the Company tab, complete the following fields:
           In the Customer ID field, type a unique ID number. For example, 2.
           In the Customer Code field, type a unique code name.
           In the Show Company in Multi-Company Lists field, select Yes.

   4. Click OK.
   5. When prompted to confirm if you want to synchronize this company with UCMDB, select

     Yes.

To synchronize a company between APM and UCMDB:

For information about how to synchronize a company between APM and UCMDB, refer to the
APM documentation.

Related topics

     Integrations
     Integration Manager
     APM Business Impact Report (BIR)
     Integration Instance Information fields
     Add a APM Business Impact Reports integration
     Edit an integration instance
     Enable or disable an integration instance
     Enable LW-SSO for the Incident Exchange (OMi - SM) integration
     Configure LW-SSO in the Service Manager Web tier


1.8.2.2. Launch a Business Impact Report from
an incident

Applies to User roles: Service Desk Agent

            Note

           Make sure to enable an SMBIR integration instance in Integration Manager before
           performing the steps below.

To launch a Business Impact Report from an incident:

   1. Sign in to the Service Manager Web client.

   2. From Incident Management, search for an incident record and open it.
   3. Click More and then select Launch Business Impact Report.

     If you have enabled LW-SSO in both SM and APM:

     The report displays the APM's summary information about business CIs that are impacted
     by the Incident's affected CI.

     If you have disabled LW-SSO:

     An APM login page displays, and the business impact summary information displays after
     you log on.

Related topics

     Integration Manager
     Application Performance Management (APM)
     APM Business Impact Report (BIR)
     Incident Exchange (OMi - SM) integration
     Add a APM Business Impact Reports integration
     Edit an integration instance
     Enable or disable an integration instance
     Enable LW-SSO for the Incident Exchange (OMi - SM) integration
     Configure LW-SSO in the Service Manager Web tier
     Enable multi-tenancy for the APM Business Impact Report integration


1.8.3. SM-APM downtime synchronization

The downtime entity plays a central role in many of the IT processes that are executed during
the normal operations of an IT group. Failing to correctly manage this entity across all IT
disciplines can:

     Cause misunderstandings about the state of a CI and as a result the state of a business
     service.
     Increase false positive events.
     Increase the mean time to restoration (MTTR).
     And overall negatively influence the perception of the business users about the SLA they
     get from IT.

The synchronization of downtime information between Service Manager and APM is to avoid
the above situations.

Application Performance Management (APM) includes a module that you can use to
synchronize the downtime which is generated in Service Manager. The runtime service model
(RTSM) will maintain the downtime as a scheduled downtime CI with its related configuration
items. If there is Universal CMDB (UCMDB) deployed between Service Manager and RTSM, the
integration will synchronize downtime information through UCMDB between the servers.

The Service Manager and APM integration supports two use cases of downtime management:

     Synchronize scheduled downtimes from Service Manager RFCs and tasks to APM in
     order to suppress events.

     For details about Service Manager configuration and adapter setup in APM or UCMDB for
     downtime management, see SM-APM downtime synchronization setup.

     Event management of APM to synchronize scheduled downtimes from APM to Service
     Manager incidents for the Service Desk’s attention.

     For details about how to create and close incidents in Service Manager from APM
     Operations Manager i (OMi), see Configure automatic closure for OMi incidents and
     Change the default assignment group for OMi incidents.

                   Note

                Note: The incoming incident created from APM downtime does impact CI
                Availability in Service Manager.

Related topics

Integration Manager
Application Performance Management (APM)
Add an instance in Service Manager Integration Suite (SMIS)


Tailor Service Manager to handle phase change
Set up integration in APM
Set up integration in Universal CMDB
Verify the SM-APM downtime synchronization setup


1.8.3.1. SM-APM downtime synchronization
setup

Prerequisite:

     To enable downtime synchronization between Service Manager and APM, you need to
     apply the latest Content Package and update to UCMDB or to RTSM.
     The SLA scheduler needs to be started in the System Status form.
     Make sure the related CI which downtime is scheduled on has already been synchronized
     between Service Manager and Universal CMDB.

To set up the SM-APM downtime synchronization in your environment, you need to complete
the following tasks:

     Add an instance in Service Manager Integration Suite (SMIS)

     To set up the integration from Service Manager to RTSM, this task creates the
     SMBSM_DOWNTIME instance in Service Manager Integration Suite (SMIS). Note that
     additional setup is required on the APM OMi side for integration from APM to Service
     Manager. For details, refer to the Business Service Management Operations Manager i
     Extensibility Guide.

     Tailor Service Manager to handle phase change

     In Change Management module, authorized users can manually change the phase of a
     change record. This will affect the validation of related scheduled downtime. This task
     tailors Service Manager to keep the scheduled downtime accurate after users manually
     changed the phase of related change.

     Set up integration in APM

     If you don't have UCMDB, perform this task to set up a new integration in RTSM to
     proactively pull the scheduled downtime from Service Manager.

     Set up integration in Universal CMDB

     This task sets up a new integration in Universal CMDB to proactively pull the scheduled
     downtime from Service Manager.

     Verify the SM-APM downtime synchronization setup

     Perform this task to check if you have successfully set up your SM-APM downtime
     synchronization.


            Note

           Notes:

              1. For Changes/Tasks that have final approval phases defined in Service
                Manager Integration Suite (SMIS), the downtimes will be synchronized after
                the Changes/Tasks get final approval.

              2. Only downtimes that end at a future time will be synchronized.
              3. Select the Configuration Item(s) Down checkbox when scheduling

                downtimes in Changes/Tasks.

Related topics

Application Performance Management (APM)
SM-APM downtime synchronization
Add an instance in Service Manager Integration Suite (SMIS)
Tailor Service Manager to handle phase change
Set up integration in APM
Set up integration in Universal CMDB
Verify the SM-APM downtime synchronization setup


1.8.3.1.1. Add an instance in Service Manager
Integration Suite (SMIS)

Applies to User roles: System Administrator

To set up the integration from Service Manager to RTSM, you must add an instance of this
integration in the Service Manager Integration Suite (SMIS). Note that additional setup is
required on the APM OMi side for integration from APM to Service Manager. For details, refer
to the Business Service Management Operations Manager i Extensibility Guide.

To add the SMBSM_DOWNTIME instance:

   1. Click Tailoring > Integration Manager. Integration Instance Manager opens.

   2. Click Add. The Integration Template Selection wizard opens.

   3. Select SMBSM_DOWNTIME from the Integration Template list. Ignore the Import
     Mapping checkbox, which has no effect on this integration.

   4. Click Next. The Integration Instance Information page opens.

   5. Do the following:

          • Modify the Name and Version fields to the exact values you need.

          • In the Interval Time(s) field, enter a value based on your business needs in regard
          to downtime exchange frequency. Note that a short interval time can be safe because
          the next scheduled task will not start until the previous task is completed and the
          interval time passed.

          • In the Max Retry Times field, enter a value. This is the maximum allowed number of
          retries (for example, 10) for each failed task.

          • In the Log File Directory field, specify a directory where log files of the integration
          will be stored. This must be a directory that already exists on the Service Manager
          server. By default, logging message is output to sm.log .

          • (Optional) In the SM Server field, specify a display name for the Service Manager
          server host. For example, my_local_SM.

          • (Optional) In the Endpoint Server field, specify a display name for the APM server
          host. For example, my_APM_1.

          • (Optional) In the Log Level field, change the log level from INFO (default) to another
          level. For example, WARNING.

          • (Optional) If you want this integration instance to be automatically enabled when
          the Service Manager Server service is started, select Run at system startup.

   6. Click Next. The Integration Instance Parameters page opens.


7. On the General Parameters tab, complete the following fields as necessary:


Name                                    Category  Value               Description
                                                  true/false
WithdrawDowntim General                                               Set this value to
e                                                                     true : When
                                                                      authorized users
                                                                      are manually
                                                                      changing the
                                                                      phase of a change
                                                                      record that has a
                                                                      "valid" outage, a
                                                                      window will open
                                                                      and provide
                                                                      choices of
                                                                      withdrawing the
                                                                      outage.

                                                                      Set this value to
                                                                      false : The pop-
                                                                      up window is
                                                                      disabled. This
                                                                      operation may
                                                                      cause some
                                                                      unapproved
                                                                      planned
                                                                      downtimes to be
                                                                      synchronized to
                                                                      APM.

                                                                      By default, this
                                                                      value is set to
                                                                      true .

Category or                             Change    The final approval  Set the final
workflow (Process                                 phase for changes   approval phase for
Designer) name of                                                     downtime, which
changes                                                               is the indication of
                                                                      valid downtime
                                                                      information.


Name                                    Category  Value               Description

Category or                             Task      The final approval  Set the final
                                                  phase for tasks     approval phase for
workflow (Process                                                     downtime, which
                                                                      is the indication of
Designer) name of                                                     valid downtime
                                                                      information.
tasks

sm.host                                 General   <sm server name     Set the Service
                                                  >                   Manager server
                                                                      hostname or DNS
                                                                      name to compose
                                                                      the External
                                                                      Process Reference
                                                                      and the Reference
                                                                      Number of
                                                                      Scheduled
                                                                      Downtime CI in
                                                                      UCMDB.

                                                                      Note

                                                                      Note:
                                                                      Do not
                                                                      include
                                                                      a colon
                                                                      in this
                                                                      field.
                                                                      Other
                                                                      wise,
                                                                      the
                                                                      logic
                                                                      will be
                                                                      broken
                                                                      .


Name                                    Category  Value             Description

sm.reference.prefi General                        urn:x-hp:2009:sm  Set the prefix to
x                                                                   compose the
                                                                    External Process
                                                                    Reference of
                                                                    Scheduled
                                                                    Downtime CI in
                                                                    UCMDB.

                                                                    Note

                                                                    Note:
                                                                    This
                                                                    field
                                                                    has a
                                                                    fixed
                                                                    value.
                                                                    Do not
                                                                    chang
                                                                    e it.

Notes:

    • Type category or workflow name of change/task in the Name column. This value is
    case-sensitive and it must match the record in Service Manager database.

    • Set the value to Change for changes in the Category column. Similarly, set the
    value to Task for tasks.

    • Type the final approval phase in the Value column. This value is case-sensitive and
    it must match the record in Service Manager database. You can separate multiple
    phases by semicolons, which must be the English character.

    • Detailed information will be displayed in the integration log if user input of
    categories/phases for the changes/tasks is not correct or the category and phase
    pair doesn't exist in the database.

    • For Change Management categories which don't have approval phase, the
    downtime integration will treat its downtime information as final approved once
    created. You don't need to define any phases in SMIS parameters.

    • For the category or workflow name of the changes and the tasks, the integration
    will ignore all the final phases defined for the redundant category or workflow.


   8. Click Next twice and then click Finish. Leave the Integration Instance Mapping and
     Integration Instance Fields settings blank. This integration doesn't use these settings.

     Service Manager creates the instance. You can edit, enable, disable, or delete it in
     Integration Manager.

   9. Enable the integration instance. SMIS will validate all the final phases you filled in the
     Integration Instance Parameters page and print warning messages if there are errors.

Related topics

Application Performance Management (APM)
SM-APM downtime synchronization
Tailor Service Manager to handle phase change
Set up integration in APM
Set up integration in Universal CMDB
Verify the SM-APM downtime synchronization setup


1.8.3.1.2. Tailor Service Manager to handle
phase change

Applies to User roles: System Administrator, Implementer

In the Service Manager Change Management module, authorized users can manually change
the phase of a change record. If the phase is changed to the one prior to the final approval
phase in the SMBSM_DOWNTIME instance, the system will check if there are existing planned
downtimes that have been set to Ready. If such downtimes exist, a window will open and
provide two options for the corresponding planned downtimes:

     Click Yes to withdraw the corresponding planned downtimes from UCMDB. The changes
     or tasks need to be approved again to synchronize with UCMDB at another time.
     Click No. There will be no change to the planned downtimes even if the actual status of
     the changes or tasks aren't approved.

            Note

           Note: To disable the pop-up window when withdrawing the planned downtimes,
           you need to set the WithdrawDowntime parameter to false in the
           SMBSM_DOWNTIME instance. This operation may cause some unapproved
           planned downtimes to be synchronized to APM.

With Process Designer (PD) Content Pack 2 applied in Service Manager, you can tailor the
process to transit changes or tasks from one phase that's after the final approval phase in the
SMBSM_DOWNTIME instance to another that's prior to the final approval phase.To withdraw
the related planned downtime for this kind of transition, you need to add a rule set for the
transition in the Closed Loop Incident Process (CLIP) solution. Refer to the following steps:

   1. Go to the target workflow that needs tailoring.
   2. Select the transition that moves a phase from before the final approval phase to after the

     final approval phase.
   3. In the Rule Sets section, click Add and select the clip.downtime.withdraw rule set.
   4. Click OK to save the workflow.

Related topics

Application Performance Management (APM)
SM-APM downtime synchronization
Add an instance in Service Manager Integration Suite (SMIS)
Set up integration in APM
Set up integration in Universal CMDB
Verify the SM-APM downtime synchronization setup


1.8.3.1.3. Set up integration in APM

If you have Universal CMDB (UCMDB) between Service Manager and APM, you can use
UCMDB to maintain downtime CIs that are populated from Service Manager, and APM will
consume them through UCMDB. There is no need to set up an integration in APM (RTSM).

If you don't have UCMDB between Service Manager and APM, you need to set up a new
integration in APM (RTSM) to proactively pull the scheduled downtime from Service Manager.

Being an instance of UCMDB, RTSM embeds in APM and performs the expected functions of a
CMDB. RTSM reconciles and stores configuration items (CIs) that represent the IT environment
components and helps organizations understand the relationships between these components
and track their configuration.

Make sure you have applied the latest content package and update to RTSM. For instructions
on how to set up a downtime integration in RTSM, refer to the Data Flow Management Guide.

Related topics

     Application Performance Management (APM)
     SM-APM downtime synchronization
     Add an instance in Service Manager Integration Suite (SMIS)
     Tailor Service Manager to handle phase change
     Set up integration in Universal CMDB
     Verify the SM-APM downtime synchronization setup


1.8.3.1.4. Set up integration in Universal CMDB

This task sets up a new integration in Universal CMDB (UCMDB) to proactively pull the
scheduled downtime from Service Manager. Make sure you have applied the latest Content
Package and update to your UCMDB.

To set up the Universal CMDB adapter:

   1. Sign in to your UCMDB system as an administrator.
   2. Create an integration point that connects to your Service Manager server. For example,

     SM980. Make sure this integration point uses the latest ServiceManager Adapter 9-x.
   3. Click Managers > Data Flow Management > Integration Studio. UCMDB displays a list of

     integration points.
   4. Select sm931 in the Integration Point list. Make sure the SM Configuration Items

     Population job and the SM Relations Population job run first.

   5. Create two integration jobs in the integration point.

        1. Create a new job including the CLIP Down Time Population job definition. Under
           Scheduler Definition, select the Scheduler enabled checkbox and set the Repeat
           Interval to 1 Minute. Click OK to save the job.

        2. Create another new job including the CI To Down Time CI With Connection job
           definition. Under Scheduler Definition, select the Scheduler enabled checkbox and
           set the Repeat Interval to 1 Minute. Click OK to save the job.

     Pay attention to the running order and run the CLIP Down Time Population job first. You
     can set the two jobs as schedule-based and set the schedule interval according to your
     needs.

   6. After the two jobs have finished successfully, go back to the Modeling section and check
     the CIs with the type ScheduledDowntime. Make sure their relationships are created.

            Note

           Note: If no related CIs exist in UCMDB when creating relationships, the population
           will fail or succeed with a warning. To disable the warning, remove the downtime CI
           that doesn't have related CIs in UCMDB.

Related topics

Application Performance Management (APM)
SM-APM downtime synchronization
Add an instance in Service Manager Integration Suite (SMIS)
Tailor Service Manager to handle phase change
Set up integration in APM
Verify the SM-APM downtime synchronization setup


1.8.3.1.5. Verify the SM-APM downtime
synchronization setup

Applies to User roles: System Administrator

When you have set up the Downtime integration, you can perform the following tasks to see if
you have successfully set up your downtime synchronization.

Task 1: Open a new change of a category that has the
final approval phase defined in SMIS

   1. Click Change Management > Changes > Create New Change.
   2. Select Hardware for example.
   3. In the Affected CI field, set the name of the CI to be synchronized. For example: adv-afr-

     desk-101 .
   4. Set Scheduled Downtime Start and Scheduled Downtime End to a future time.
   5. Select the Configuration Item(s) Down checkbox.
   6. Set other required fields.
   7. Click Save&Exit.

Task 2: Approve the change at the final approval phase

   1. Click Change Management > Changes > Search Change and search for the change
     opened in Task 1.

   2. Move the Change to the Change Approval phase.
   3. Sign in to Service Manager with user account Change.Approver .
   4. Search for the change and approve it.

Task 3: Create new format for the intClipDownTime table

   1. Click Tailoring > Forms Designer.
   2. Create a new format for the intClipDownTime table by using the Form Wizard.
   3. Add all fields to this format.

Task 4: Check the corresponding intClipDownTime
record

   1. From Database Manager, open the format of the intClipDownTime table.
   2. Click Search to see the record created for this downtime.

   3. Check the External Status field:


External Status values                  Description
NULL
                                        The downtime is waiting for final
0 (Canceled)                            approval, or the scheduler has not
1 (Ready)                               proceeded this record yet.

2 (Withdrawn)                           The downtime is canceled before being
                                        implemented.

                                        The downtime has been approved and is
                                        ready to be synchronized to UCMDB or
                                        APM (RTSM).

                                        The downtime is approved first and then
                                        the approval is retracted (withdrawn).

                   Note

                Notes:

                   1. Only downtime records with External Status 1 can be synchronized.
                   2. If the External Status is not 1 , wait some time for background

                      schedulers SLA and SMBSM_DOWNTIME to process this record.

Task 5: Populate downtime from Service Manager to
UCMDB

   1. From UCMDB, run the CLIP Down Time Population job and the CI To Down Time CI With
     Connection job in a fixed order.

   2. Search for the adv-afr-desk-101 CI in UCMDB. Check that a corresponding Scheduled
     Downtime CI is created, and a relationship between the Scheduled Downtime CI and the
     affected CI is created.

            Note

           Note: If any of the aforementioned tasks fails, refer to SM-APM downtime
           synchronization setup and check if all the system prerequisites are met.

Related topics

Integration Manager
Application Performance Management (APM)
Add an instance in Service Manager Integration Suite (SMIS)
Tailor Service Manager to handle phase change


Set up integration in APM
Set up integration in Universal CMDB


1.9. Operations Bridge Manager (OBM)

Note: Operations Bridge Manager (OBM) was known as OMi before version 2018.05.
There are two variations of integrating Service Manager (SM) with OBM. One case uses the
RTSM contained in OBM as the CMDB, and needs only one data flow probe (DFP1), which is
installed in the OBM deployment. The other case uses a UCMDB, and needs two data flow
probes (DFP1 installed on the UCMDB server and DFP2 in the OBM deployment).

Point-to-point integration

OBM is integrated with Service Manager directly, using OBM's Run Time Service Model
(RTSM) as CMDB, as shown in the following figure.

We recommend installing the Data Flow Probe 1 (DFP1) in the OBM deployment.

Integration using a Universal Configuration Management
Database (UCMDB)

OBM is set up using an external UCMDB, as shown in the following figure.


We recommend installing the Data Flow Probe 1 (DFP1) on the UCMDB server and the Data
Flow Probe 2 (DFP2) in the OBM deployment.

Data flow probes

Two different data flow probes need to be installed. They have different purposes.

     DFP1 is needed for the following:

           Populating the RTSM with CIs (Data Population)
           Federation

           Topology synchronization (CIs) between RTSM and SM in the case of a point-to-
           point integration

           OR

           Topology synchronization (CIs) between UCMDB and OBM and between UCMDB
           and SM in case of using an external UCMDB


     DFP2 is needed for federation only.

Prerequisites

If you are using a standalone CMDB, you need to do the following before continuing with the
OBM-SM integration:

     Set up the integration between OBM and UCMDB.
     Integrate UCMDB with SM to synchronize CIs from UCMDB to SM.

For details, see Universal CMDB.

Integration options

     Incident exchange between SM and OBM. OBM enables you to forward events from
     OBM to SM. Forwarded events and subsequent event changes are synchronized back
     from SM to OBM. You can also drill down from OBM events to SM incidents. For details,
     see Incident Exchange (OBM - SM) integration.

     Downtime exchange between OBM and SM. OBM enables you to forward downtimes
     (also known as outages) from OBM to SM, and from SM to OBM. The downtime defined in
     OBM is directed to SM as an incident, and vice versa. For details, see Downtime
     Exchange between OBM and Service Manager.

     View planned changes and incident details in Service Health. This integration enables
     you to view planned changes and incident details in the Changes and Incidents tab on the
     360° View page in Service Health. For details, see OBM - Service Manager integration
     overview.

     The Business Impact Report integration is part of the Closed Loop Incident Process
     (CLIP) solution. When deployed as part of the OBM solution, Incident Management users
     can launch an impact report from an incident in context with the incident's affected CI.
     Service desk agents can validate the updated status of the business impact to categorize
     and prioritize the incident accordingly.

     For details, see the CLIP page in the APM Business Impact Report (BIR).


Note

      Service Manager Query Security: If you have set up an integration from OBM
      to SM, there is a CI context menu that enables you to access SM from
      OBM Service Health. This drill-down option is unavailable if you have enabled

      Service Manager query security.
      Troubleshooting Multiple Domains: If OBM and SM are in different domains,

      and you are using Internet Explorer as your browser, you may need to add the
      domains to the list of allowed domains in the Privacy tab (Internet Options
      > Privacy > Sites).


1.9.1. Incident Exchange (OBM - SM)
integration

The Incident Exchange (OBM - SM) integration is a bidirectional integration between incident
records in Service Manager and events in Operations Bridge Manager (OBM).

This integration requires configurations on both product sides. For details, see Incident
Exchange (OBM - SM) integration setup.

            Note

           Service Manager can integrate with multiple OBM servers. For details, see Add an
           integration instance for each OBM server.

Service Manager can accept requests that based on RESTful from OBM to create Incidents in
Service Manager, based on events information in OBM. When Service Manager accepts an
incident creation request from a remote OBM server, it creates an incident record and
automatically assigns it to an existing group based on certain field values. Incident
Management users can view the details of the related OBM event by clicking the View OBM
Event menu option from the incident record. See Drill down to the OBM event details from an
incident.

When an Incident Management user makes any changes to the incident record, Service
Manager sends an update request to the OBM RESTful web service interface. Hence, it
automatically synchronizes the changes to the corresponding event in OBM. In the event of a
synchronization failure, a queuing mechanism will synchronize the changes again. See
Synchronization of incident changes back to Operations Bridge Manager (OBM).

System administrators can configure global settings to decide whether and when incident
records opened from OBM events can be automatically closed. However, Incident Management
users can mark individual OBM incident records as eligible or ineligible for automatic closure.
See Configure automatic closure for OBM incidents and Mark an incident for automatic closure.

Related topics

     Incident Exchange (OBM - SM) integration setup
     Synchronization of incident changes back to Operations Bridge Manager (OBM)
     Add an integration instance for each OBM server
     Enable LW-SSO for the Incident Exchange (OBM - SM) integration
     Configure automatic closure for OBM Incidents
     Mark an incident for automatic closure
     Drill down to the OBM event details from an incident
     Change the default assignment group for OBM incidents
````
