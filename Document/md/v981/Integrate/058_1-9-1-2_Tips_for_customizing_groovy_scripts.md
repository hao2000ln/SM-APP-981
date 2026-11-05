---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.9.1.2 .. 1.11
printed_pages: 1592-1624
---

# 1.9.1.2 Tips for customizing groovy scripts

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.9.1.2. Tips for customizing groovy scripts

This section provides some tips about customizing Groovy scripts. It contains a few selected
examples of what you can customize. To see further items that can be modified, see the
configuration section of a Groovy script.
In the configuration section of the Groovy script, you can define and modify the attributes that
are to be synchronized between OBM and SM. The configuration section of the Groovy script
also contains the default value mappings for lifecycle state, severity, and priority. You can also
modify these, and it is possible to define the mappings for in-going and out-going requests
differently.
More advanced configuration can be done in other parts of the Groovy script if required.
The beginning and the end of the configuration section of the Groovy script is marked as
follows:

  //
  // configuration section to customize the Groovy script
  // BEGIN
  ...
  ...
  //
  // configuration section to customize the Groovy script
  // END

            Note

           Modifications to Groovy scripts aren't overwritten by patches and hotfixes. Your
           customized version of a script will remain after an update or a patch. If you want to
           use the newer version of a script, make a copy of your version, revert back to the
           predefined version, and then reapply your changes.

The mapping from OBM to SM is compliant to BDM 1.1 incident web service specifications. The
mapping of the BDM 1.1 incident web service to SM is specified in SM in the BDM Mapping
Manager. For more information about the BDM Mapping Manager, see the BDM Mapping
Manager section of the Service Manager online help.

Controlling attribute synchronization

You can control how updates to certain attributes are synchronized between OBM and SM by
setting some Boolean variables to true or false .
Examples:


      SyncAllProperties variable. By default, it is false . If you set it to true , all properties will
     be synchronized in both directions. The other variables will be ignored.

      private static final SyncTitleToSMOnUpdate = false;

     This line of the Groovy script disables the synchronization of changes to the title made in
     OBM to SM.

      private static final Boolean SyncTitleToOPROnUpdate = false;

     This line of the Groovy script disables the synchronization changes to the title made in
     SM to OBM.

The title is a required attribute in SM, and it is set, independently of the flags above, using the
title given in OBM during the creation of the incident.

Mapping OPR Lifecycle States to BDM Lifecycle States

Individual OPR event state and SM incident status changes may be selected for
synchronization. Out of the box, only the "closed" state is synchronized in both directions. To
change this behavior, add the desired states to the appropriate list, SyncOPRStatesToSM or
SyncSMStatusToOPR .

Examples:

      private static final Set SyncOPRStatesToSM = ["closed", "in_progress", "resolved"]
      private static final Set SyncSMStatusToOPR = ["closed", "resolved"]

In the example, the OPR event lifecycle states closed , in_progress , and resolved are
synchronized to the SM incident status, and SM incident statuses closed and resolved are
synchronized to the OPR event state.

            Note

           The special state "*" denotes all states, so to synchronize all OPR event states to
           the SM incident status property, specify the following:
           private static final Set SyncOPRStatesToSM = ["*"]

Additionally, two maps are used to specify the mapping of the OPR event lifecycle state to the
BDM incident status. The maps are named MapOPR2SMStatus and MapSM2OPRState . Out
of the box, all possible states have a mapping.

Examples:

      private static final Map MapOPR2SMStatus = ["open": "open", "in_progress": "work-in-
     progress", "resolved": "resolved", "closed": "closed"]

      private static final Map MapSM2OPRState = ["accepted": "open", "assigned": "open",
     "open": "open", "reopened": "open",


      "pending-change": "in_progress", "pending-customer": "in_progress", "pending-other":
     "in_progress",

      "pending-vendor": "in_progress", "referred": "in_progress", "suspended": "in_progress",

      "work-in-progress": "in_progress", "rejected": "resolved", "replaced-problem":
     "resolved",

      "resolved": "resolved", "cancelled": "resolved", "closed": "closed"]

Avoiding Errors with Large TQL Queries

If the Groovy script executes a TQL query that produces a large number of results, an error
message appears informing you about the TQL query result exceeding the size limit. As a
consequence, the integration event is not sent. It is possible, however, to increase this limit by
modifying the value of the tql.compound.link.max.visited.objects setting.

            Note

           To check the default value of the tql.compound.link.max.visited.objects setting,
           from the JMX console, select UCMDB:service=Settings Services, and then locate
           the showSettingsByCategory method and enter TQL Settings as the category
           name.

To modify the value of the tql.compound.link.max.visited.objects setting, follow these steps:

   1. From the JMX console, select UCMDB:service=Settings Services.
   2. Click setSettingValue.
   3. Enter tql.compound.link.max.visited.objects as the name of the setting you want to

     modify and a new value for it.

            Caution

           Increasing the value of the tql.compound.link.max.visited.objects setting also
           increases the load on the RTSM. Therefore, be sure to carefully consider how
           much to increase this value.

Syntax Errors

If you get a syntax error when customizing your Groovy scripts, you will get an event in the
event browser with a detailed description of the error. In addition, you may view the opr-
event-sync-adapter.log log file for information about how to resolve the error. You can find
this log file at the following location:

<Gateway Server root directory>/log/opr-event-sync-adapter.log

Related topics


Incident Exchange (OBM - SM) integration
Synchronize attributes


1.9.1.3. Synchronization of incident changes
back to Operations Bridge Manager (OBM)

After OBM opens an incident in Service Manager, Service Manager will synchronize the
incident changes back to OBM.

Operations Bridge Manager (OBM) can forward an event record to Service Manager as an
incident by calling a Service Manager Web Service. The incident ID is then stored in the event
record.

When a user has updated the incident opened from OBM, Service Manager calls an OBM
server RESTful Web Service to update the incident changes to the OBM event record.

If Service Manager fails to synchronize the incident changes back to OBM for some reasons
(for example, because of a network problem), Service Manager behaves as follows:

     Displays a warning message, indicating that Service Manager fails to synchronize the
     incident to OBM.
     Saves the failed task in the Service Manager Integration Suite (SMIS) task queue, and
     retries the task to synchronize the changes again to OBM based on an interval time and a
     maximum retry times configured when adding the Incident Exchange (OBM - SM)
     integration in SMIS. When the synchronization is successfully completed, the system
     removes the failed task from the task queue.

System Administrators can monitor failed tasks, and reset their retry times or rerun expired
tasks. For more information, see Monitor failover tasks.

Related topics

     Integration Manager
     Incident Exchange (OBM - SM) integration
     Incident Exchange (OBM - SM) integration setup
     Add an integration instance for each OBM server
     Enable LW-SSO for the Incident Exchange (OBM - SM) integration
     Drill down to the OBM event details from an incident
     Monitor failover tasks


1.9.1.4. Working with the Incident Exchange
(OBM - SM) integration

After setting up the integration, Service Manager Incident Management users with the right
permissions can perform the following tasks.

     View event details from OBM incidents
     Mark individual OBM incidents as eligible or ineligible for automatic closure (if their
     system administrator has enabled automatic closure for OBM incidents)

Related topics

     Integration Manager
     Incident Exchange (OBM - SM) integration
     Incident Exchange (OBM - SM) integration setup
     Add an integration instance for each OBM server
     Enable LW-SSO for the Incident Exchange (OBM - SM) integration
     Drill down to the OBM event details from an incident
     Monitor failover tasks


1.9.1.4.1. Drill down to the OBM event details
from an incident

If all of the following conditions are met, you can view the related Operations Bridge Manager
(OBM) event details from an OBM incident:

     You are accessing the incident through the Service Manager standard Web client (not the
     employee self-service (ESS) interface).
     One or more SMOMi integration instances are set up and enabled in Integration Manager.
     You are also an OBM user who has been granted the permission Events assigned to user
     including the required actions.

To drill down to the OBM event details from an OBM incident, follow these steps:

   1. Sign in to the Service Manager Web client.
   2. From Incident Management, search for the incident record created from OBM.
   3. Click More and then select View OMi Event.

                   Note

                The View OMi Event option is displayed only when the omi.mgr.id parameter
                in the corresponding SMOMi integration instance is set correctly.

     If Lightweight Single Sign-On (LW-SSO) is enabled in both the Service Manager Web
     client and OBM, the OBM event detail page opens in a new browser window, displaying
     the details of the related event in OBM. If LW-SSO is disabled, an OBM login page opens,
     and the related OBM event detail page is displayed after you sign in to OBM.

Related topics

Incident Exchange (OBM - SM) integration
Add an integration instance for each OBM server


1.9.1.4.2. Mark an incident for automatic
closure

Applies to User roles: Incident Coordinator
You can mark an OBM incident as eligible or ineligible for automatic closure after a predefined
amount of time since it was last updated.
To mark an incident as ineligible or eligible for automatic closure:

   1. From Incident Management, search for an incident record opened from OBM.
   2. Select or deselect the Do not close this incident automatically checkbox to mark this

     incident as ineligible or eligible for automatic closure.

                   Note

                By default, this checkbox isn't selected.

Related topics

Incident Exchange (OBM - SM) integration
Configure automatic closure for OBM incidents
Drill down to the OBM event details from an incident
Change the default assignment group for OBM incidents


1.9.2. Downtime exchange between OBM and
Service Manager

Operations Bridge Manager (OBM) enables you to forward downtimes (also known as
outages) from OBM to Service Manager (SM), and from SM to OBM. The downtime defined in
OBM is converted to an incident in SM, and vice versa.

Integration overview

The downtime integration between OBM and SM includes information exchanges in both of the
following directions:

     SM > OBM. When you create a downtime RfC (request for change) in SM, the RfC
     includes the CI that's under change and a start and end date/time of the downtime. If you
     don't want to waste effort with false alarms in your operations center, and don't want to
     have these times included in service availability reports, you can set up the integration so
     that these RfCs are translated to downtimes in OBM.

     In this scenario, you install a data flow probe on the CMDB:

           If you use OBM's RTSM as CMDB, install the data flow probe provided on the OBM
           installation media.

           If you use UCMDB as CMDB, install the data flow probe as described in the UCMDB
           documentation. In this case, the synchronization must also be done from UCMDB to
           OBM, additionally to synchronizing SM with UCMDB. The RfC creates a planned
           downtime CI in the CMDB, and the data flow probe DFP1 sends the planned
           downtime CI to OBM to create a downtime.

     OBM > SM. When you define downtimes using OBM , the help desk should be aware of
     such operational downtimes: After you set up the integration, downtimes in OBM trigger
     events, which create corresponding incidents in SM.

     In this scenario, when a downtime starts, OBM generates an event. Using the event
     forwarding mechanism, the event generates an incident in SM. When the downtime ends,
     an event is sent to close the downtime incident.

A single downtime can be defined on more than one CI. In the case of OBM > SM, a separate
event is sent for each CI in downtime.

Prerequisites

Supported platforms

To set up the downtime integration, you must meet the following prerequisites:

     Service Manager 9.31 and higher.
     UCMDB 10.01 or higher with content pack 12 or higher.


     Before deploying the adapter, verify that CP11 or higher is installed. If it's not, install the
     content pack.
     If the adapter is installed on the RTSM, and the adapter is working behind a reverse proxy,
     the DPS must have the correct certificates installed to send requests to the reverse proxy.

If you are using a UCMDB as a CMS, make sure that the CMS integration is set up. When it is
set up, it serves as the global ID generator.

Global ID generator

If you are using OBM's RTSM you need to configure the RTSM to be the global ID generator, to
enable the downtime integration:

   1. Access the following location with your browser: http://<DPS name>:21212/jmx-
     console/HtmlAdaptor?action=inspectMBean&name=UCMDB:service=Multiple CMDB
     Instances Services

   2. In the setAsGlobalIdGenerator() method, fill the customerID parameter with the value of
     1, and click Invoke.

Step 1: Send OBM downtime events to SM

To enable OBM to send downtime definitions to SM, follow these steps:

   1. Access the following location in OBM:

     Administration > Setup and Maintenance > Infrastructure Settings > Foundations >
     Downtime

   2. Change the value of the Downtime Send Event parameter to true.
   3. Restart your OBM services on all Gateway Servers and Data Processing Servers.

This procedure generates events in OBM. After performing it, make sure you edit and enable
the Automatically forward "downtime started" and "downtime ended" events to Trouble
Ticket System event forwarding rule to forward downtime-start and downtime-end events to
the SM server that should be specified in the alias connected server called "Trouble Ticket
System". For details on event forwarding and connected servers, see the OBM Administration
Guide.

Downtime events use the following formats:

     Downtime Start

Event field                                                                                      Service Manager 9.81
Severity
Category                                OBM Downtime
Title                                   Normal
                                        Downtime Notification
Key                                     Downtime for <CI Type><Affected CI
                                        Name>started at <Downtime Start Time>
SubmitCloseKey                          <OBM Downtime ID>:<Affected CI
OutageStartTime                         ID>:downtime-start
OutageEndTime                           False
CiName                                  <Downtime Start Time>
CiId                                    <Downtime End Time>
CiHint                                  <Affected CI Name>
HostHint                                <Affected CI Global ID>
EtiHint                                 UCMDB:<Affected CI ID>
                                        UCMDB:<Related Host ID>
   Downtime End                         downtime:start


Event field                             OBM Downtime

Severity                                Normal

Category                                Downtime Notification

Title                                   Downtime for <CI Type><Affected CI

                                        Name> ended at < Downtime End Time>

Key                                     <OBM Downtime ID>:<Affected CI

                                        ID>:downtime-stop

SubmitCloseKey                          true

CloseKeyPattern                         <OBM Downtime ID>:<Affected CI
                                        ID>:downtime-start

EtiHint                                 downtime:end

LogOnly                                 true

Step 2: Integrate SM downtimes with OBM

To enable downtimes defined in SM to be sent to OBM, again, you need to distinguish between
the two cases of where the CMDB is:

If you are using OBM's RTSM as CMDB, no further steps are required. See also Point to point
integration.

If you are using an external UCMDB, you need to install the DFP2 in the OBM deployment. See
also Integration using a Universal Configuration Management Database (UCMDB)

Important:

     Following the initial integration, a large amount of data may be communicated from SM to
     OBM. It is highly recommended that you perform this procedure during off-hours, to
     prevent negative impact on system performance.
     The integration consists of two parts: SM > CMS/UCMDB, and CMS/UCMDB > OBM
     adapter. You should configure both parts of the integration as one flow, without a
     significant time lag between setting up the two parts. If you set up the SM > CMSUCMDB
     part, and then wait a long time before setting up the CMS/UCMDB > OBM adapter part,
     the number of downtimes communicated to OBM initially may be extremely high.


Note

                The following procedure doesn't describe the SM > CMS/UCMDB connection
                setup. SM should be configured to create its CIs in the CMS. This procedure
                connects the adapter between the CMS/UCMDB and OBM.
                The default job synch frequency is one minute.

Create a new integration point as follows:

   1. Create the integration point credentials:

        1. Access the Data Flow Probe Setup on your OBM or UCMDB depending on whether
           you use OBM's RTSM or use a CMS.

                         Note

                      You don't need a probe to perform this integration. Nevertheless you
                      create credentials using the Data Flow Probe Setup tab.

        2. Click Add domain or probe, and enter a name and description of your choice.

        3. Expand the submenus and select HTTP protocol.

        4. Click the + sign (Add new connection details) and enter the OBM Gateway
           hostname, Port 80, and the OBM username and password. Leave the Trust fields
           blank. When you are done, click OK to save the credentials.

   2. Create a new integration point:

        1. If you have OBM, do the following on your OBM. If you use a CMS, do the following
           on your CMS:

           Navigate to Administration > RTSM Administration > Data Flow Management >
           Integration Studio

        2. Click New Integration Point, enter a name and description of your choice, and
           select BSMDowntimeAdapter/SM scheduled Downtime Integration into BSM.

        3. Enter the following information for the adapter: OBM Gateway hostname and port,
           the integration point credentials you just created, communication protocol, and the
           context root (if you have a non-default context root).

        4. Click OK, then click the Save button above the list of the integration points.

   3. You can use the Statistics tab in the lower pane to track the number of downtimes that
     are created or updated. By default, the integration job runs every minute. If a job has
     failed, you can open the Query Status tab and double-click the failed job to see more
     details on the error.


If there is an authentication error, verify the OBM credentials entered for the integration
point.
If you receive an unclear error message with error code, this generally indicates a
communication problem. Check the communication with OBM. If no communication
problem is found, restart the MercuryAS process.
A failed job will be repeated until the problem is fixed.


1.9.2.1. Downtime Exchange integration setup

To set up the downtime exchange integration between Operations Bridge Manager (OBM) and
Service Manager (SM), you need to perform the following tasks.

            Note

           Configuring Service Manager web service integrations in a network environment
           using a firewall or proxy server requires additional configuration. For details, see
           Web Services with a proxy server.

   1. Enable OBM to send downtime events to Service Manager.
   2. Integrate Service Manager downtime with OBM.
   3. Add an integration instance in Service Manager.
   4. Tailor Service Manager to handle phase change.
   5. Verify the OBM - SM downtime synchronization setup.

Related topics

OBM - Service Manager integration overview
Downtime Exchange between OBM and Service Manager


1.9.2.1.1. Enable OBM to send downtime events
to Service Manager

Downtime events use the formats listed in the following tables.

Event field                             Downtime Start

                                                OBM Downtime

Severity                                Normal

Category                                Downtime Notification

Title                                   Downtime for <CI Type><Affected CI

                                        Name>started at <Downtime Start Time>

Key                                     <OBM Downtime ID>:<Affected CI

                                        ID>:downtime-start

SubmitCloseKey                          False

OutageStartTime                         <Downtime Start Time>

OutageEndTime                           <Downtime End Time>

CiName                                  <Affected CI Name>

CiId                                    <Affected CI Global ID>

CiHint                                  UCMDB:<Affected CI ID>

HostHint                                UCMDB:<Related Host ID>

EtiHint                                 downtime:start


Event field                             Downtime End
Severity
Category                                       OBM Downtime
Title
                                               Normal
Key
                                               Downtime Notification
SubmitCloseKey
CloseKeyPattern                                Downtime for <CI Type><Affected CI
                                               Name> ended at < Downtime End Time>
EtiHint
LogOnly                                        <OBM Downtime ID>:<Affected CI
                                               ID>:downtime-stop

                                               true

                                               <OBM Downtime ID>:<Affected CI
                                               ID>:downtime-start

                                               downtime:end

                                               true

To enable OBM to send downtime definitions to Service Manager (SM), follow these steps:

   1. Access the following location in OBM:

     Administration > Setup and Maintenance > Infrastructure Settings > Foundations >
     Downtime

   2. Change the value of the Downtime Send Event parameter to true.
   3. Restart your OBM services on all Gateway Servers and Data Processing Servers.

This procedure generates events in OBM. After performing it, make sure you edit and enable
the Automatically forward "downtime started" and "downtime ended" events to Trouble
Ticket System event forwarding rule to forward downtime-start and downtime-end events to
the SM server that should be specified in the alias connected server called "Trouble Ticket
System". For details on event forwarding and connected servers, see the OBM Administration
Guide.


1.9.2.1.2. Integrate Service Manager downtime
with OBM

To enable SM to send the defined downtime to OBM, again, you need to distinguish between
the two cases of where the CMDB is:

If you are using OBM's RTSM as CMDB, no further steps are required. See also Point to point
integration.

If you are using an external UCMDB, you need to install DFP2 in the OBM deployment. See also
Integration using a Universal Configuration Management Database (UCMDB)

Important:

     Following the initial integration, SM may communicate a large amount of data to OBM. It's
     highly recommended that you perform this procedure during off-hours, to prevent a
     negative impact on system performance.
     The integration consists of two parts: SM > CMS/UCMDB, and CMS/UCMDB > OBM
     adapter. You should configure both parts of the integration as one flow, without a
     significant time lag between setting up the two parts. If you set up the SM > CMS/UCMDB
     part, and then wait a long time before setting up the CMS/UCMDB > OBM adapter part,
     the number of downtime communicated to OBM initially may be extremely high.

            Note

                The following procedure doesn't describe the SM > CMS/UCMDB connection
                setup. You should configure SM to create its CIs in the CMS. This procedure
                connects the adapter between the CMS/UCMDB and OBM.
                The default job synchronization frequency is one minute.

Create a new integration point as follows:
   1. Create the integration point credentials:
        1. Access the Data Flow Probe Setup on OBM or UCMDB depending on whether you
           use the OBM's RTSM or use a CMS.

                         Note

                      You don't need a probe to perform this integration. Nevertheless you
                      create credentials using the Data Flow Probe Setup tab.

        2. Click Add domain or probe, and enter a name and description of your choice.
        3. Expand the submenus and select HTTP protocol.


     4. Click the + sign (Add new connection details) and enter the OBM Gateway
        hostname, Port 80, and the OBM username and password. Leave the Trust fields
        blank. When you are done, click OK to save the credentials.

2. Create a new integration point:

     1. Access the Integration Studio on your OBM or UCMDB depending on whether you
        use OBM or use a CMS.

     2. Click New Integration Point, enter a name and description of your choice, and
        select BSMDowntimeAdapter/SM scheduled Downtime Integration into BSM.

     3. Enter the following information for the adapter: OBM Gateway hostname and port,
        the integration point credentials you just created, communication protocol, and the
        context root (if you have a non-default context root).

     4. Click OK, then click the Save button on top of the integration points list.

3. You can use the Statistics tab in the lower pane to track the number of downtime that are
  created or updated. By default, the integration job runs every minute. If a job has failed,
  you can open the Query Status tab and double-click the failed job to see more details on
  the error.

  If there is an authentication error, verify the OBM credentials entered for the integration
  point.

  If you receive an unclear error message with error code, this generally indicates a
  communication problem. Check the communication with OBM. If there is no
  communication problem, restart the MercuryAS process.

  The system repeats a failed job until the problem become fixed.


1.9.2.1.3. Add an integration instance in
Service Manager

Applies to User roles: System Administrator

To set up the downtime exchange integration, you must add an instance of this integration in
the Service Manager Integration Suite (SMIS).

To add the SMBSM_DOWNTIME instance, follow these steps:

   1. Click Tailoring > Integration Manager. Integration Instance Manager opens.
   2. Click Add. The Integration Template Selection wizard opens.
   3. Select SMBSM_DOWNTIME from the Integration Template list. Ignore the Import

     Mapping checkbox, which has no effect on this integration.
   4. Click Next. The Integration Instance Information page opens.

   5. Do the following:

           Modify the Name and Version fields to the exact values you need.
           In the Interval Time(s) field, enter a value based on your business needs in regard
           to downtime exchange frequency. Note that a short interval time can be safe
           because the next scheduled task will not start until the previous task is completed
           and the interval time passed.
           In the Max Retry Times field, enter a value. This is the maximum allowed number of
           retries (for example, 10) for each failed task.
           In the Log File Directory field, specify a directory where log files of the integration
           will be stored. This must be a directory that already exists on the Service Manager
           server. By default, logging message is output to sm.log .
           (Optional) In the SM Server field, specify a display name for the Service Manager
           server host. For example, my_local_SM.
           (Optional) In the Endpoint Server field, specify a display name for the APM server
           host. For example, my_APM_1.
           (Optional) In the Log Level field, change the log level from INFO (default) to another
           level. For example, WARNING.
           (Optional) If you want this integration instance to be automatically enabled when the
           Service Manager Server service is started, select Run at system startup.
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
                                                                      record which has
                                                                      'valid' outage, a
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
                                                                      downtimes be
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
                                                                      host name or DNS
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


                   Note

                Notes:

                   1. Type category or workflow name of change/task in the Name column.
                      This value is case-sensitive and it must match the record in Service
                      Manager database.

                   2. Set the value to Change for changes in the Category column. Similarly,
                      set the value to Task for tasks.

                   3. Type the final approval phase in the Value column. This value is case-
                      sensitive and it must match the record in Service Manager database.You
                      can separate multiple phases by semicolons, which must be the English
                      character.

                   4. Detailed information will be displayed in the integration log when the
                      following errors occur:
                            User input of categories/phases for the changes/tasks is not
                            correct.
                            The category and phase pair doesn't exist in the database.

                   5. For Change Management categories which don't have approval phase,
                      the downtime integration will treat its downtime information as final
                      approved once created. You don't need to define any phases in SMIS
                      parameters.

                   6. For the category or workflow name of the changes and the tasks, the
                      integration will ignore all the final phases defined for the redundant
                      category or workflow.

   8. Click Next twice and then click Finish. Leave the Integration Instance Mapping and
     Integration Instance Fields settings blank. This integration doesn't use these settings.

     Service Manager creates the instance. You can edit, enable, disable, or delete it in
     Integration Manager.

   9. Enable the integration instance. SMIS will validate all the final phases you filled in the
     Integration Instance Parameters page and print warning messages if there are errors.

Related topics

Downtime Exchange between OBM and Service Manager
Tailor Service Manager to handle phase change
Verify the OBM-SM downtime synchronization setup


1.9.2.1.4. Tailor Service Manager to handle
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

           To disable the pop-up window when withdrawing the planned downtimes, you
           need to set the WithdrawDowntime parameter to false in the
           SMBSM_DOWNTIME instance. This operation may cause some unapproved
           planned downtimes to be synchronized to Operations Bridge Manager (OBM).

With Process Designer (PD) Content Pack 2 or later applied in Service Manager, you can tailor
the process to transit changes or tasks from one phase that's after the final approval phase in
the SMBSM_DOWNTIME instance to another that's prior to the final approval phase.To
withdraw the related planned downtime for this kind of transition, you need to add a rule set for
the transition in the Closed Loop Incident Process (CLIP) solution.

To do this, follow these steps:

   1. Go to the target workflow that needs tailoring.
   2. Select the transition that moves a phase from before the final approval phase to after the

     final approval phase.
   3. In the Rule Sets section, click Add and select the clip.downtime.withdraw rule set.
   4. Click OK to save the workflow.

Related topics

Add an integration instance in Service Manager
Verify the OBM-SM downtime synchronization setup


1.9.2.1.5. Verify the OBM-SM downtime
synchronization setup

Applies to User roles: System Administrator

When you have set up the Downtime Exchange integration, you can perform the following
tasks to see if you have successfully set up your downtime synchronization.

Task 1: Open a new change of a category that has the
final approval phase defined in SMIS

   1. Click Change Management > Changes > Create New Change.
   2. Select Hardware for example.
   3. In the Affected CI field, set the name of the CI to be synchronized. For example: adv-afr-

     desk-101 .
   4. Set Scheduled Downtime Start and Scheduled Downtime End to a future time.
   5. Select the Configuration Item(s) Down checkbox.
   6. Set other required fields.
   7. Click Save & Exit.

Task 2: Approve the change at the final approval phase

   1. Click Change Management > Changes > Search Change and search for the change
     opened in Task 1.

   2. Move the Change to the Change Approval phase.
   3. Log on to Service Manager with user account Change.Approver .
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
                                        OBM (RTSM).

                                        The downtime is approved firstly and
                                        then the approval is retracted
                                        (withdrawn).

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

           Note: If any of the aforementioned tasks fails, refer to and check if all the system
           prerequisites are met.

Related topics

Integration Manager
Add an integration instance in Service Manager
Tailor Service Manager to handle phase change


1.10. Service Management Automation X
(SMAX)

Service Manager provides a Case Exchange framework to exchange data between Service
Management Automation X (SMAX) and Service Manager. The Case Exchange framework
enables you to define Service Manager as an external system with which information will be
exchanged. Hence, Service Manager has the ability to create and update records in SMAX as
well as to relate those records to records in Service Manager.

Use cases

The integration with SMAX is designed to support use cases involving a Line of Business IT
organization that's supported by a Central IT organization. It also supports use-cases involving
Central IT and other IT suppliers.

The integration enables you to exchange incidents and requests between SMAX and Service
Manager. Incident or request records created in SMAX can be assigned to a group that has
been registered to a Service Manager system. This sends the record to Service Manager for
investigation and resolution. Additional information that's added to the record, including
comments and attachments, is also exchanged with Service Manager. Updates done in Service
Manager, including activities and attachments, are sent to SMAX. It's also possible to create an
incident or request in Service Manager and exchange it with SMAX. In this case as well,
updates on either side are exchanged with the other system.

The exchanged record includes only the data necessary to create the incident or request in the
Service Manager system. The workflow phases and statuses of the record in the two systems
are independent of each other. Instead, the integration uses the concept of Operations.
Operations are additional (bi-directional) information provided on the update of a record. They
tell the receiving system what needs to be done with the record, and the system can determine
which workflow steps or data modifications need to be implemented.

Defining possible operations for the actual exchange reduces the need to perform complex
workflow mapping between the two systems. The operations are interpreted by the receiving
system and may be mapped to their existing workflow and business rules without affecting the
sending system.

Set up the integration

Implement the Case Exchange framework

For details, see General procedure.

Configure the integration

For detailed instructions, see Enable Case Exchange with SMAX.

Related topics


SMAX integration with Service Manager (SM)


1.11. Asset Manager

When ITAM and ITSM applications share common reference data related to the management
and support of IT-related Configuration Items (CIs) and these references are not available
through the CMDB, the data must be reconciled through other methods. Examples of these
references include a variety of common entities, such as employees who use CIs and the
supervisors responsible for managing them; the operating business units (that is, departments)
and physical locations where "in-service" CIs are deployed; the suppliers and service
providers of hardware and software Assets, supporting Application or Service CIs. The list
continues. A simple way to categorize this wide array of references is "People, Places and
Things."

In the case of Asset Manager (AM) and Service Manager (SM), the two repositories utilize
"synchronization type" replication to maintain the integrity of these shared common
references. Connect-It synchronizes the "People, Places and Things" between AM and SM and
provides bi-directional mapping scenarios to perform all insert and update-related transactions
in the target application. (Delete transactions must be managed within each respective
application for audit and data integrity purposes.) The following table describes related
scenarios depending on what will be synchronized and in which direction.


Integration direction                   Integration technology  Replicated Data
                                        Connect-It
From Asset Manager to                                                amsm-ppt.scn:
Service Manager
                                                                     • Companies
From Service Manager to                 Connect-It                   • Vendors
Asset Manager                                                        • Locations
                                                                     • Departments
                                                                     • Contacts
                                                                     • Models
                                                                     • Stock rooms
                                                                     • Links between CIs
                                                                     and Contact, Model,
                                                                     Vendor, Location,
                                                                     Department

                                                                     amsm-ci-ppt-link.scn:

                                                                     • Links between CIs
                                                                     and Contact, Model,
                                                                     Vendor, Location,
                                                                     Department

                                                                     smam-ppt.scn:

                                                                     Companies
                                                                     • Vendors
                                                                     • Locations
                                                                     • Departments
                                                                     • Contacts
                                                                     • Models
                                                                     • Stock rooms

                                                                     smam-wo.scn:

                                                                     • Changes and tasks

Note: This integration doesn't synchronize "IT Equipment" CIs between Asset Manager and
Service Manager, such as desktops, laptops, servers, network components, and so on.

After synchronization, this integration provides Asset Manager (AM) users with the Service
Manager (SM) interface that can be used to carry out requests. With this integration, you can:

     Describe in AM the catalog to publish in SM self-service
     Export AM models as categories in the SM catalog


     Export AM requests, products, and off-catalog products to the SM catalog
     Create requests using the SM catalog self-service
     View the status of your requests in AM

Set up the integration

For detailed instructions, see the Asset Manager Help Center.

Related topics

Reference Data Synchronization via Connect-It (AM <-> SM)
Employee Self-Service Catalog for Asset Manager (AM - SM)
````
