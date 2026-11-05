---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.6.3.2.4 .. 1.6.3.2.7
printed_pages: 1195-1231
---

# 1.6.3.2.4 Universal CMDB Setup

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.6.3.2.4. Universal CMDB Setup

You must complete the following tasks from your UCMDB system to support the integration.
   1. Create an integration point between UCMDB and Service Manager.
     See How to Create an Integration Point in UCMDB.
   2. Update the configuration files of the adapter.
     See How to Update the Time Zone and Date Format for the Integration Adapter.


1.6.3.2.4.1. How to create an integration point
in UCMDB

A default UCMDB installation already includes the ServiceManagerAdapter9.41 package. To
use the integration package, you must create an integration point listing the connection
properties for the integration.

            Caution

           For the data population, this integration supports the use of only one probe for your
           Service Manager system. Don't run population jobs on different probes by setting
           up multiple integration points with different probes for your Service Manager
           system. This integration allows only one probe for one Service Manager system.

To create an integration point:

   1. Sign in to UCMDB as an administrator.
   2. Add the integration user account that you created in Service Manager.

        1. Click Security > Users and Groups.
        2. Click the New User button .
        3. For User Name and Password, type the user name and password you created in

           Service Manager. See How to create an integration user account.
        4. Click Next, and then in the Role List select Admin.
        5. Click Finish to add the integration user account.
   3. Navigate to Data Flow Management > Integration Studio. UCMDB displays a list of
     existing integration points.

   4. Click the New Integration Point button .

     UCMDB displays a New Integration Point properties window.

   5. Complete the integration and adapter property fields as described in the following table.


Field name                              Integration and adapter properties  Description
Integration Name
Integration Description                 Required?
Adapter
                                        Yes                                 Type the name (unique
Is Integration Activated
                                                                            key) of the integration
Hostname/IP
                                                                            point. For example,
Port
                                                                            sm_integration.

                                        No                                  Type a description of the

                                                                            current integration point.

                                        Yes                                 Select OpenText Products

                                                                            > Service Manager >

                                                                            ServiceManagerAdapter9

                                                                            .41.

                                        Yes                                 Enable this option to

                                                                            indicate the integration

                                                                            point is active.

                                        Yes                                 Type the hostname or IP

                                                                            address of the Service

                                                                            Manager server.

                                                                            For example, localhost.

                                        Yes                                 Type the communications

                                                                            port of the Service

                                                                            Manager server. For

                                                                            example, 13080.

Field name                              Required?                      Service Manager 9.81
URL Override                            No
                                                   Description
This PDF was generated on May 23, 2026
                                                   This field value (if any)
                                                   supersedes the previous
                                                   Hostname/IP and Port
                                                   settings descriptions.

                                                   Use this field If you want
                                                   UCMDB to connect to
                                                   Service Manager in any
                                                   combinations of the
                                                   following ways:

                                                        Connect to Service
                                                        Manager over
                                                        HTTPS or over both
                                                        HTTP and HTTPS
                                                        Connect to multiple
                                                        Service Manager
                                                        server nodes
                                                        (horizontally scaled
                                                        environment)
                                                        Connect to one
                                                        single Service
                                                        Manager server
                                                        node through
                                                        multiple ports
                                                        (vertically scaled
                                                        environment)

                                                   For more information, see
                                                   Push in clustered
                                                   environments.

                                                   Type one or more Service
                                                   Manager web services
                                                   URLs (separated by a
                                                   semicolon) in this field.

                                                   Each URL must use this
                                                   format:

                                                   http(s)://<hostname>:
                                                   <port>/sc62server/ws

                                                   The following are two
                                                   example values of this

                                                                                       Page 1198 of 1727

Field name                              Required?  Description

Credentials ID                          Yes        field:

                                                         https://localhost:134
                                                        43/sc62server/ws
                                                         http://localhost:1308
                                                        0/sc62server/ws;
                                                        https://localhost:134
                                                        43/sc62server/ws;
                                                        http://smfpe04:1308
                                                        0/sc62server/ws

                                                   Click Generic Protocol,
                                                   click the Add button to
                                                   add the integration user
                                                   account you created, and
                                                   then select it. This
                                                   account must exist in both
                                                   Service Manager and
                                                   UCMDB. See How to
                                                   create an integration user
                                                   account.

Data Flow Probe                         Yes        Select the name of the
                                                   Data Flow Probe used to
                                                   run population jobs. You
                                                   should have already
                                                   added the data flow probe
                                                   for the integration after
                                                   installing UCMDB. See
                                                   Integration requirements.

6. Click Test Connection to make sure the connection is successfully created.

7. Click OK.

  The system creates the integration point and displays its details.

8. Click the Federation tab, and complete the following configuration.

     1. In Supported and Selected CI Types, select the following CI types as needed from
        Managed Object > ItProcessRecord:

              Incident
              Problem
              Request for Change


       2. For each CI type you selected (Incident, Problem, or Request for Change), in CI Type
          Retrieval Mode select Retrieve CIs of selected CI Type.

 9. Click the Population and Data Push tabs, to view the default integration job details.

                 Note

               UCMDB creates several default population and data push jobs when creating
               an integration point. If needed, you can create a new job for the integration
               point. For information about creating integration jobs, see How to define data
               push jobs in UCMDB and How to define population jobs in UCMDB.

10. Click the Save Integration Point icon .


1.6.3.2.4.2. How to update the time zone and
date format for the integration adapter

The integration uses an integration user account to connect UCMDB to Service Manager. You
specified this user account in the Credentials ID setting when creating an integration point. See
How to create an integration point in UCMDB. You must make sure that this integration user
account uses the same time zone and date format in both Service Manager and UCMDB. To do
so, you define the same time zone and date format in the integration adapter configuration file
and in the integration user's operator record in Service Manager.

To update the time zone and date format for the integration adapter:

   1. Check or change the time zone and date format of the integration user in Service
     Manager.
        1. Sign in to Service Manager as a system administrator.
        2. Navigate to System Administration > Ongoing Maintenance > Operators. The
           Operators form opens.
        3. For Login Name, type the integration user name (for example, ucmdb ) you set in
           the integration point (the Credentials ID field).
        4. Click Search. Service Manager displays the record of the operator.
        5. Click the Login Profiles tab.
        6. View or change the operator's Time Zone and Data Format field values.

   2. Set the time zone and date format for the adapter in UCMDB.   Page 1201 of 1727
        1. Sign in to UCMDB as an administrator.
        2. Navigate to Data Flow Management > Adapter Management >
           ServiceManagerAdapter9.41 > Configuration Files >
           serviceDeskConfiguration.xml.

This PDF was generated on May 23, 2026

3. At the bottom of the file, locate the elements <date_pattern> and <time_zone> ,
  and update the values according to the integration user's time zone/date format
  setting in Service Manager.

         Note

        The date pattern and time zone are in Java format pattern used by
        java.text.SimpleDateFormat . Out-of-the-box, the date format and time zone
        values in serviceDeskConfiguration.xml are: MM/dd/yy HH:mm:ss , and
        US/Mountain .


1.6.3.2.5. Populating UCMDB with Service
Manager CI data

In addition to pushing CI data from UCMDB to Service Manager, this integration also supports
the population of CI data (including CIs and CI relationships) from Service Manager to UCMDB.
The integration can then update the list of CIs in UCMDB if new CIs or new attribute values are
found in Service Manager. The population of data from Service Manager to UCMDB is defined
in the Integration Studio in UCMDB. You can manually run the population jobs, however, we
recommend that you schedule these jobs to keep your CIs and CI attributes up to date.
This task includes the following steps:

   1. Define CI/CI Relationship population jobs in UCMDB.
     See How to define population jobs in UCMDB.

   2. View the transferred CI/CI Relationship data in UCMDB.
     See View Service Manager CI data in UCMDB.

   3. Schedule CI population jobs to keep CIs and CI attributes up to date.
     See How to schedule CI population jobs.


1.6.3.2.5.1. How to define population jobs in
UCMDB

A CI/CI relationship population job copies certain types of CIs/CI relationships from Service
Manager to UCMDB.

To define a CI or CI relationship population job:

   1. Sign in to UCMDB as an administrator.
   2. Navigate to Data Flow Management > Integration Studio. UCMDB displays a list of

     existing integration points.
   3. Open an integration point.
   4. Click the Population tab, and add a new job as follows.

                   Note

                UCMDB creates several default population and data push jobs when creating
                an integration point. The following table lists the default population jobs and
                their queries. If needed, you can create, update or remove queries for each
                job. For information about tailoring population queries, see Create a query to
                populate the CI type.


Integration Job                         Queries for CI / CI relationship population

                                                          Queries for CI / CI relationship
                                                          population

SM Configuration Item Population job    Out-of-the-box, the following queries are
                                        available for this job, which populates CI
                                        records from Service Manager to
                                        UCMDB:

                                             SM Business Service Population:
                                             Populates CIs of the bizservice
                                             type.
                                             SM RunningSoftware Population:
                                             Populates CIs of the
                                             RunningSoftware type.
                                             SM Computer Population:
                                             Populates CIs of the computer type.

SM Relations Population job             Out-of-the-box, the following queries are
                                        defined for this job, which populates CI
                                        Relationship records from Service
                                        Manager to UCMDB:

                                             SM Biz To Biz With Containment:
                                             Populates CI relationships in which
                                             a bizservice CI contains another.
                                             SM Biz To Biz With Usage:
                                             Populates CI relationships in which
                                             a bizservice CI uses another.
                                             SM Biz To Computer With
                                             Containment: Populates CI
                                             relationships in which a bizservice
                                             CI contains a computer CI.
                                             SM Biz To Computer With Usage:
                                             Populates CI relationships in which
                                             a bizservice CI uses a computer CI.
                                             SM Computer To Computer With
                                             Connects: Populates CI
                                             relationships in which a computer CI
                                             connects to another.

1. Click the New Integration Job button .
2. Type a Name for the integration job. For example, CI_Population_Job1.


        3. Click the Add Query button to add existing queries to the job (see the above
           table).

        4. Select the Allow Integration Job to delete removed data checkbox for the query.
        5. Click OK to save the job.
   5. Run the job manually to see if the integration job works properly.
        1. To populate all relevant data for the job, click the button.
        2. To populate only CI data changes since the job last ran, click the button.
   6. Wait for the job to complete, and click the Refresh button multiple times as needed until
     the job is completed.

                   Note

                When the job is completed, the job status becomes one of the following:
                Succeeded, Passed with failures, or Failed.

   7. Click the Statistics tab to view the results, and if the job failed, click the Query Status tab
     and Job Errors tab for more information.

   8. Click OK.

If the job is completed successfully, you can view the transferred CI data in UCMDB and
schedule the job so that it can run automatically.


1.6.3.2.5.2. View Service Manager CI data in
UCMDB

After a population job is successfully completed, you can search for the Service Manager CI
records in UCMDB, and verify that their attributes are correctly populated.
The Service Manager Display Name field is populated to the Name field on the Configuration
Item Properties pane in UCMDB.

            Note

           To see the entire attribute mappings of a CI type, you can open the CI type’s
           population XSLT file (for example, business_service_population.xslt) and the root
           population xslt file (cmdb_root_attributes_population.xslt), where the UCMDB
           attribute field names and the mapped Service Manager web service field caption
           names are defined. For more information, see Tailoring the integration.


1.6.3.2.5.3. How to schedule CI population
jobs

You can schedule CI population jobs to match the discovery/maintenance schedule of your
Service Manager feeders. For example, if your Service Manager feeders send CI data updates
on a daily schedule, then the population jobs should also run on a daily schedule. By using a
matching schedule you can ensure that your UCMDB system always has the most current CI
data.

This task includes the following steps:

   1. Sign in to UCMDB as an administrator.
   2. Navigate to Data Flow Management > Integration Studio. UCMDB displays a list of

     integration points.
   3. Open an integration point.
   4. Click the Population tab, and select a population job from the list.
   5. Click the Edit Integration Job button.
   6. Select the Scheduler enabled option.
   7. Select the scheduling options you want to use. For example, select Repeat every: Day

     and Ends: Never.
   8. Select a Time Zone.
   9. Click OK.


1.6.3.2.6. Pushing UCMDB CI data to Service
Manager

The integration requires a one-time transfer of CIs from UCMDB to Service Manager to
populate the Service Manager system with CIs. The integration will then update the list of CIs
in Service Manager when UCMDB discovers new CIs or new attribute values. The integration
accomplishes the push of CI data using data push jobs in the UCMDB system. We recommend
that you schedule these jobs to keep your CIs and CI attributes up to date.
This task includes the following steps:

   1. Define CI/CI Relationship data push jobs.
     See How to define data push jobs in UCMDB.

   2. View the CI/CI Relationship data pushed from UCMDB.
     See How to view UCMDB CI data in Service Manager.

   3. Schedule data push jobs to keep CI/CI Relationship data up to date.
     See How to schedule data push jobs.


1.6.3.2.6.1. How to define data push jobs in
UCMDB

Data push jobs copy CI or CI Relationship records from your UCMDB system to your Service
Manager system.

To define a CI or CI relationship push job:

   1. Sign in to UCMDB as an administrator.
   2. Navigate to Data Flow Management > Integration Studio. UCMDB displays a list of

     existing integration points.
   3. Select the Integration Point you created for Service Manager. For example,

     sm_integration.
   4. Click the Data Push tab.
   5. Follow these steps to add a new data push job:

                   Note

                UCMDB creates a default data push job when creating an integration point.
                The following table lists the default data push job and its queries. If needed,
                you can create, update or remove queries for the push job. To access these
                out-of-the-box queries for push, go to Modeling > Modeling Studio >
                Resources, select Queries for Resource Type, and then navigate to Root >
                Integration > SM Sync > 9.xx. For information about tailoring data push
                queries, see How to create a query to synchronize the CI type.


Integration job                         Queries for CI / CI relationship push

                                                        Queries

       Integration job                                                                     Service Manager 9.81
       SM Push job
                                        Queries
This PDF was generated on May 23, 2026
                                        Out-of-the-box, the following queries are
                                        available for this job, which pushes CI/CI
                                        Relationship records from UCMDB to
                                        Service Manager:

                                             SM Mainframe Push: pushes CIs of
                                             the mainframe type.
                                             SM Network Component Push:
                                             pushes CIs of the network
                                             component type.
                                             SM Running Software Push: pushes
                                             CIs of the running software type.
                                             SM Business Service Push: pushes
                                             CIs of the business service type.
                                             SM Computer Push: pushes CIs of
                                             the computer type.
                                             SM Storage Push: pushes CIs of the
                                             storage type.
                                             SM Switch Push: pushes CIs of the
                                             switch type.
                                             SM Net Printer Push: pushes CIs of
                                             the net printer type.
                                             SM Cluster Push: pushes CIs of the
                                             cluster type.
                                             SM Mobile Device Push: pushes CIs
                                             of the mobile device type.
                                             SM Local Printer Push: pushes CIs
                                             of the local printer type.

                                        Out-of-the-box, the following queries are
                                        available for this job, which pushes CI
                                        Relationship records from UCMDB to
                                        Service Manager:

                                             SM Layer2 Topology Relations
                                             Push: pushes compound CI
                                             relationships between nodes.
                                             SM Business Service Relations
                                             Push: pushes CI relationships
                                             whose upstream CI type is business
                                             service.
                                             SM CRG Relations Push: pushes CI
                                             relationships whose upstream CI

                                                                                                              Page 1212 of 1727

Integration job                         Queries

                                             type is cluster.
                                             SM Node Relations Push: pushes
                                             direct CI relationships whose
                                             upstream CI type is node.

     1. Click the New Integration Job button .
     2. In the Name field, type a unique name for the job. For example, CI_Push_Job1.
     3. Click the Add Query button to add existing queries to the job.
     4. Select the Allow Integration Job to delete removed data option for each query.
     5. Click OK to save the job.
6. Run the job manually to verify that the integration job works fine.

               Caution

             If you have a huge amount of CI data in your UCMDB system, and this is your
             first time to push CI /CI Relationship data to Service Manager, it's advisable to
             select the Add the record option instead of Open a change or Open an
             incident for Action if matching record doesn't exist in each Discovery Event
             Manager Rules definition. Otherwise, unnecessary performance problems
             might occur. For details, see Add Discovery Event Manager rules.

     1. To push all relevant data for the job, click the button.
     2. To push only the updated data since the job last ran, click the button.

               Tip

             You can stop a running push job by pressing the Stops the selected job
             button .

7. Wait for the job to complete, and click the Refresh button multiple times as needed until
  the job completes.

               Note

             When the job completes, the job status becomes one of the following
             depending on the results: Succeeded , Passed with failures , or Failed .

8. Click the Statistics tab to view the results; if any errors occur click the Query Status tab
  and Job Errors tab for more information.

9. Click OK.


If the job completes successfully, you can view the UCMDB CI data in Service Manager, and
schedule the job so that it can run automatically.


1.6.3.2.6.2. How to schedule data push jobs

It's a best practice to schedule the data push jobs to match the discovery schedule of your
Service Manager feeders. For example, if your Service Manager feeders send CI data updates
on a daily schedule, the data push jobs should also run on a daily schedule. By using a
matching schedule you can ensure that your Service Manager system always has the most
current CI data.

UCMDB allows you to schedule updates directly from a data push job. This task includes the
following steps:

   1. Sign in to UCMDB as an administrator.
   2. Navigate to Data Flow Management > Integration Studio. UCMDB displays a list of

     integration points.
   3. Select the integration point you created for the UCMDB - SM integration. For example, SM

     Integration.
   4. Click the Data Push tab.
   5. Select a push job. For example, SM Configuration Item Push Job.
   6. Click the Edit Integration Job button .

                   Tip

                UCMDB allows you to define two different schedules for two types of data
                push: Changes Sync, and All Data Sync. For recommendations on push
                scheduling, see Push Scheduling recommendations.

   7. Define a schedule for Changes Sync.

        1. Click the Changes Sync tab.
        2. Select the Scheduler enabled option.
        3. Select the scheduling options you want to use.


 8. Click All Data Sync tab, and select the scheduling options you want to use.
 9. Click OK to save the data push job.
10. Continue to follow step 6 to step 9 for the rest of data push jobs of the integration point.
11. Save the integration point.


1.6.3.2.6.3. How to view UCMDB CI data in
Service Manager

After a push job is successfully completed, you can search for and verify the pushed CI/CI
relationship data in Service Manager.
CI records pushed from UCMDB contains a View in UCMDB UI button, which enables you to
access the UCMDB UI to view the CI information.

            Note

                To display the View in UCMDB UI button, you need to specify the UCMDB
                UI URL in the System Information Record in SM.
                The UCMDB UI is a lightweight UI designed for simple access to UCMDB
                configuration information. This is a tool for searching, locating, and
                consuming data that relates to configuration. It's an optional add-on to
                UCMDB. For more information, refer to the CMS documentation.

To view UCMDB CI data in Service Manager:

   1. Sign in to Service Manager as a system administrator.
   2. Navigate to Configuration Management > Search CIs.
   3. Open a CI record pushed from UCMDB.
   4. If the View in UCMDB UI button is available, click this button to view the CI record in the

     UCMDB UI.
   5. Open the Actual State section.

     Service Manager sends a web services request to UCMDB and displays all CI attributes
     that the request returns.

                   Note

                The web services request uses the UCMDB webservice URL and account (for
                example, admin/admin) defined in the SMtoUCMDB integration instance in
                Service Manager. See How to add UCMDB connection information.


1.6.3.2.7. Federating Service Manager ticket
data to UCMDB

Federation doesn't physically copy data from Service Manager (SM) to UCMDB; it only
retrieves SM data for displaying in UCMDB. Out-of-the-box, the UCMDB-SM integration
supports federation for the following external CI types in UCMDB: Incident, Problem, and
RequestForChange. If you have enabled these CI types for federation when creating your
integration point, in UCMDB you can retrieve Incident, Problem, and Change record data from
SM.

Out-of-the-box, each of the CI types (Incident, Problem, and Change) supports federation of a
subset of their attributes in Service Manager; however, the integration can federate more
attributes if tailored as such.

This section includes:

     Federation queries
     Examples of using federation
     How to add an attribute of a supported CI type for federation


1.6.3.2.7.1. Federation queries

Federation uses queries to determine what data to retrieve from Service Manager. To retrieve
specific ticket data from Service Manager, you need to create a query first. Out-of-the-box,
sample federation queries are available from UCMDB: Modeling > Modeling Studio >
Resources > View > Service Desk.


1.6.3.2.7.2. Examples of using federation

You can use the federation feature in many different ways. The following are only examples of
using the feature:

Example 1: Federate all SM Incident tickets

This example illustrates how you retrieve information of all Incident records that exist in Service
Manager.

   1. Sign in to UCMDB as an administrator.
   2. Navigate to Modeling > Modeling Studio > Resources.
   3. For Resource Type, select Queries from the list.
   4. Click New > Query.

   5. On the CI Types tab, go to ItProcessRecord > Incident, and drag it to the query pane on
     the right side.

6. Specify Service Manager as the data source for the Incident query node.

     1. Select the Incident query node, click the Data Sources tab on the lower right pane,
        and then click Edit.

     2. Select the Select integration points option, and then select your integration point
        name (for example, sm_integration). Click OK.


7. Click the Save button , and then type a query name and select a location in which to
  save the query (for example, select the Root > Integration > SM Query folder).

8. Select the Incident query node, and then click the Calculate Query Result Count button
      .

  UCMDB returns the query result count. For example, the following figure shows that there
  are a total of 131 Incident records in Service Manager.


9. Right-click the Incident query node, and select Show Element Instances. UCMDB
  displays a list of all Incident records that exist in Service Manager.

10. Select an Incident ticket from the list, and click the Properties button to view its
    details.


Example 2: Federate SM Incident tickets that affect a
UCMDB Business Service CI

The following example illustrates how to federate a list of Service Manager Incident records
whose Affected Service or Affected CI field contains a UCMDB Business Service CI.

   1. Sign in to UCMDB as an administrator.
   2. Navigate to Modeling > Modeling Studio > Resources.
   3. For Resource Type, select Queries from the list.
   4. Click New > Query.

   5. On the CI Type tab, go to ConfigurationItem > BusinessElement > Service >
     BusinessService, and drag it to the query pane on the right side.


6. Go to ItProcessRecord > Incident, and drag the icon to the query pane.

7. Click the Create Relationship button .
8. Select the Incident query node, and drag the arrow from this node to the BusinessService

  node to create a regular relationship between the nodes.
     1. Select Regular Relationship, and click OK.

     2. Select Membership, and optionally enter a relationship name (for example,
        Membership_1). Click OK.


9. Specify UCMDB as the data source for the BusinessService query node.
     1. Select the BusinessService query node.
     2. On the lower right pane, click the Data Sources tab and then click Edit.
     3. Make sure that the Local data source (UCMDB only) option is selected.
     4. Click OK.

10. Similarly, specify your integration point as the data source for the Incident query node (for
    example, sm_integration).


11. Click the Calculate Query Result Count button . The number of SM Incidents and the
    number of their affected UCMDB Business Service CIs are displayed.

12. Click the Preview button to view the query result .


13. Select each SM Incident record from either the CI Selector pane or the query pane, and
    click the Properties button to view its details .

14. Select each UCMDB CI record from either the CI Selector pane or the query pane, and on
    the Related CIs tab click Show Related CIs.

Example 3: Federate SM Incident, Change, and Problem
ticket data of UCMDB CIs

The following example illustrates how you retrieve information of SM Incident, Change and
Problem tickets that affect a UCMDB Business Service CI.

   1. Sign in to UCMDB as an administrator.
   2. Navigate to Modeling > Modeling Studio > Resources.
   3. For Resource Type, select Queries from the list.
   4. Click New > Query.
   5. On the CI Type tab, go to ConfigurationItem > BusinessElement > Service >

     BusinessService, and drag it to the query pane on the right side.
   6. Go to ItProcessRecord, and drag Incident, Problem, and RequestForChange to the

     query pane.


7. Click the Create Relationship button to create regular relationships between the
  BusinessService node and the other nodes as shown in the following figure.

 8. For the BusinessService node, specify UCMDB as the data source.
 9. For the Incident, Problem, and RequestForChange nodes, specify your integration point as

    the data source.
10. Save the query.
11. Optionally, edit the BusinessService node properties as needed.

       1. Select the BusinessServic node, and click Edit on the lower right pane.

       2. Click the Cardinality tab. The default Cardinality setting is displayed.

3. If you wish, change either or both of the AND operators to OR.
4. This will change the filter criteria and therefore the query result.

 12. Click the Preview button to view the query result.                  Page 1228 of 1727

This PDF was generated on May 23, 2026

 13. Select each SM Incident record from either the CI Selector pane or the query pane, and
     click the Properties button to view its details.

 14. Select each UCMDB CI record from either the CI Selector pane or the query pane, and on
     the Related CIs tab click Show Related CIs to view its related CIs in both SM and UCMDB.

Example 4: Get related SM ticket data of a UCMDB CI

The following example illustrates how you retrieve SM ticket data related to a UCMDB CI by
using the Get Related CIs functionality.

   1. Sign in to UCMDB as an administrator.
   2. Navigate to Modeling > IT Universe Manager.

   3. On the Search CIs tab, search for a UCMDB CI that has associated ticket(s) in Service
     Manager. For example, enter bs1327232399 in the CI Name field, click Search, and
     double-click the CI to open it.

   4. Click the Show Get Related CIs pane button .  Page 1229 of 1727
     The Get Related CIs pane is displayed.

This PDF was generated on May 23, 2026

5. Click the Select target Integration Points for related CIs button .
6. Select the Select integration points option, and then select both UCMDB and your

  integration point. Click OK.

7. Click Show Related CIs. The CI’s related SM tickets and UCMDB CIs are displayed.

8. Select each SM ticket record from the query pane, and click the Properties button to
  view its details.
````
