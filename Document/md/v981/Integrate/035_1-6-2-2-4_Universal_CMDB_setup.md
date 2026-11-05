---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.6.2.2.4 .. 1.6.2.2.6
printed_pages: 953-978
---

# 1.6.2.2.4 Universal CMDB setup

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.6.2.2.4. Universal CMDB setup

You must complete the following task from your UCMDB system to support the integration:
Create an integration point between UCMDB and Service Manager. See How to create an
integration point in UCMDB.


1.6.2.2.4.1. How to create an integration point
in UCMDB

A default UCMDB installation already includes the ServiceManagerEnhancedAdapter9.41
package. To use the integration package, you must create an integration point that lists the
connection properties for the integration.

            Caution

           For data population, this integration supports the use of only one probe for your
           Service Manager system. Don't run population jobs on different probes by setting
           up multiple integration points with different probes for your Service Manager
           system. The integration allows only one probe for one Service Manager system.

To create an integration point, follow these steps:

   1. Sign in to UCMDB as an administrator.
   2. Add the integration user account that you created in Service Manager.

        1. Click Security > Users and Groups.
        2. Click the New User button .
        3. For User Name and Password, type the user name and password that you created in

           Service Manager. See How to create an integration user account.
        4. Click Next, and then select Admin from the Role List.
        5. Click Finish to add the integration user account.
   3. Navigate to Data Flow Management > Integration Studio. UCMDB displays a list of
     existing integration points.

   4. Click the New Integration Point icon.

     UCMDB displays a New Integration Point properties window.

   5. Complete the integration and adapter property fields as described in the following table.

Field name                              Required?                      Service Manager 9.81
Integration Name                        Yes
                                                   Description
Integration Description                 No
                                                   Type the name (unique
Adapter                                 Yes        key) of the integration
                                                   point. For example,
Is Integration Activated Yes                       sm_integration.

Hostname/IP                             Yes        Type a description for the
                                                   integration point.
Port                                    Yes
                                                   Select OpenText Products
                                                   > Service Manager >
                                                   ServiceManagerEnhance
                                                   dAdapter9.41.

                                                   Enable this option to
                                                   indicate the integration
                                                   point is active.

                                                   Type the hostname or IP
                                                   address of the Service
                                                   Manager server.
                                                   For example, localhost.

                                                   Type the communications
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
                                                        HTTPS only. When
                                                        using HTTPS, you
                                                        may need to add the
                                                        Service Manager
                                                        server certificate to
                                                        the UCMDB JVM
                                                        Trusted Stores. See
                                                        the Add the Service
                                                        Manager server
                                                        certificate to UCMDB
                                                        when using HTTPS
                                                        connection section
                                                        below.
                                                        Connect to Service
                                                        Manager over both
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

                                                                                         Page 956 of 1727
Field name                              Required?                      Service Manager 9.81

Credentials ID                          Yes        Description

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
                                                   <port>/SM/9/rest

                                                   The following are two
                                                   example values of this
                                                   field:

                                                        https://localhost:134
                                                        43/SM/9/rest
                                                        http://localhost:1308
                                                        0/SM/9/rest;
                                                        https://localhost:134
                                                        43/SM/9/rest;
                                                        http://smfpe04:1308
                                                        0/SM/9/rest

                                                   Click Generic Protocol,
                                                   click the Add icon to add
                                                   the integration user
                                                   account that you created,
                                                   and then select it. This
                                                   account must exist in both
                                                   Service Manager and
                                                   UCMDB. See How to
                                                   create an integration user
                                                   account.


Field name                              Required?  Description
Data Flow Probe                         Yes
                                                   Select the name of the
                                                   Data Flow Probe used to
                                                   run population jobs. You
                                                   should have already
                                                   added the data flow probe
                                                   for the integration after
                                                   installing UCMDB. See
                                                   Integration requirements.

6. Click Test Connection to make sure that a connection is successfully established.
7. Click OK.

  The system creates the integration point and displays its details.
8. Click the Federation tab, and complete the following configuration.

Tip

To configure a direct link to the Service Manager system with the context of
the selected incident, problem, or change request, see Configure a direct link
to Service Manager for a selected Problem, Incident, or Change Request.

1. In Supported and Selected CI Types, select the following CI types as needed from
  ItProcessRecord:

        Incident
        Problem
        Request for Change
        Change Task

     2. For each CI type you selected, select Retrieve CIs of selected CI Type for CI Type
        Retrieval Mode.

9. Click the Population and Data Push tabs to view the default integration job details.


                   Note

                UCMDB creates several default population and data push jobs when creating
                an integration point. If needed, you can create a new job for the integration
                point. For information about creating integration jobs, see How to Define Data
                Push Jobs in UCMDB and How to Define Population Jobs in UCMDB.

 10. Click the Save Integration Point icon.

Add the Service Manager server certificate to UCMDB
when using HTTPS connection

Suppose you are working with HTTPS connection between UCMDB and Service Manager. If
the Service Manager server uses a certificate signed by a known certificate authority, you
need to type one or more Service Manager web services HTTPS URLs in the URL Override
field.
If not, add the Service Manager server certificate to the local UCMDB JVM Trusted Stores as
follows:

   1. Enable SSL on the Service Manager server. For more information, see Secure Sockets
     Layer (SSL) encryption.

  2. Copy the certificate smrootca.crt generated in the previous step to <UCMDB
     Server>\bin\jre\bin .

   3. Back up the following files:
           <UCMDB Server>\bin\jre\lib\security\cacerts
           <UCMDB Server>\integrations\conf\security\ProbeTrustStore.jk

   4. Open a command line window and run the following commands to import the certificates
     copied in step 2.

          cd <UCMDB Server>\bin\jre\bin
          keytool -import -keystore <UCMDB
          Server>\bin\jre\lib\security\cacerts -trustcacerts -storepass
          <truststore pass> -alias smrootca -file smrootca.crt
          keytool -import -keystore <UCMDB
          Server>integrations\conf\security\ProbeTrustStore.jks -trustcacerts
          -storepass <truststore pass> -alias smrootca -file smrootca.crt


               Note

             The default truststore pass of cacerts is changeit , and the default truststore
             pass of ProbeTrustStore.jks is logomania . If the default password for
             ProbeTrustStore.jks doesn't work, refer to Change probe keystore and
             truststore passwords to reset probe keystore and truststore passwords.

5. At the command line prompt "Trust this certificate?", enter yes.
6. Restart the UCMDB service and the UCMDB Integration service.
7. (Optional) If you have installed UCMDB Data Flow Probe, continue to follow step 2 to step

  5 to import the certificates to <UCMDB DataFlowProbe>\bin\jre\lib\security\cacerts and
  then restart the Data Flow Probe service.
8. Open the Integration Point properties window. Under Adapter properties, fill the URL
  Override field with https://<hostname>:13443/SM/9/rest and then save your changes.


1.6.2.2.5. Populating UCMDB with Service
Manager CI data

In addition to pushing CI data from UCMDB to Service Manager, this integration also supports
the population of CI data (including CIs and CI relationships) from Service Manager to UCMDB.
The integration can then update the list of CIs in UCMDB if new CIs or new attribute values are
found in Service Manager. The population of data from Service Manager to UCMDB is defined
in the Integration Studio in UCMDB. You can manually run the population jobs, however We
recommend that you schedule these jobs to keep your CIs and CI attributes up to date.
This task includes the following steps:

   1. Define CI/CI Relationship population jobs in UCMDB.
     See How to define population jobs in UCMDB.

   2. View the transferred CI/CI Relationship data in UCMDB.
     See View Service Manager CI data in UCMDB.

   3. Schedule CI population jobs to keep CIs and CI attributes up to date.
     See How to schedule CI population jobs.


1.6.2.2.5.1. How to define population jobs in
UCMDB

A CI or relationship population job copies certain types of CIs or relationships from Service
Manager to UCMDB.

To define a CI or CI relationship population job, follow these steps:

   1. Sign in to UCMDB as an administrator.
   2. Navigate to Data Flow Management > Integration Studio. UCMDB displays a list of

     existing integration points.
   3. Open the integration point that you created for Service Manager.
   4. Click the Population tab, and add a new job as follows.

                   Note

                UCMDB creates several default population and data push jobs when creating
                an integration point. The following table lists the default population jobs and
                their queries. If needed, you can create, update or remove queries for each
                job.


Integration Job                         Queries for CI / CI relationship population

                                                          Queries for CI / CI relationship
                                                          population

SM Configuration Item Population job    Out-of-the-box, the following queries are
                                        available for this job, which populates
                                        UCMDB with CI records from Service
                                        Manager:

                                             SM Business Service Population
                                             2.0: Populates UCMDB with CIs of
                                             the bizservice type.
                                             SM RunningSoftware Population
                                             2.0: Populates UCMDB with CIs of
                                             the RunningSoftware type.
                                             SM Computer Population:
                                             Populates UCMDB with CIs of the
                                             computer type.
                                             SM CLIP Down Time Population
                                             2.0: Populates UCMDB with CIs of
                                             the planned outage type.

       Integration Job                                                                     Service Manager 9.81
       SM Relations Population job
                                        Queries for CI / CI relationship
This PDF was generated on May 23, 2026  population

                                        Out-of-the-box, the following queries are
                                        defined for this job, which populates
                                        UCMDB with CI Relationship records
                                        from Service Manager:

                                             SM Biz To Biz With Containment
                                             2.0: Populates UCMDB with CI
                                             relationships in which a bizservice
                                             CI contains another.

                                             SM Biz To Biz With Usage 2.0:
                                             Populates UCMDB with CI
                                             relationships in which a bizservice
                                             CI uses another.

                                             SM Biz To Computer With
                                             Containment 2.0: Populates
                                             UCMDB with CI relationships in
                                             which a bizservice CI contains a
                                             computer CI.

                                             SM Biz To Computer With Usage
                                             2.0: Populates UCMDB with CI
                                             relationships in which a bizservice
                                             CI uses a computer CI.

                                             SM Computer To Computer With
                                             Connects 2.0: Populates UCMDB
                                             with CI relationships in which a
                                             computer CI connects to another.

                                             SM Biz To Software With
                                             Containment 2.0: Populates
                                             UCMDB with CI relationships in
                                             which a bizservice CI contains a
                                             software CI.

                                             SM Biz To Software With Usage
                                             2.0: Populates UCMDB with CI
                                             relationships in which a bizservice
                                             CI uses a software CI.

                                             SM Computer Composition
                                             Software 2.0: Populates UCMDB

                                                                                                                Page 964 of 1727
Integration Job                                                                            Service Manager 9.81

                                        Queries for CI / CI relationship
                                        population

                                             with CI relationships in which a
                                             computer CI connects to a software
                                             CI.

                                             SM CI Connection Down Time CI
                                             2.0: Populates UCMDB with CI
                                             relationships in which a CI connects
                                             to a down time CI.

        1. Click the New Integration Job icon .
        2. Type a Name for the integration job. For example, CI_Population_Job1.
        3. Click the Add Query icon to add existing queries to the job (see the Queries for

           CI / CI relationship population table).
        4. Select the Allow Integration Job to delete removed data checkbox for the query.
        5. Click OK to save the job.
   5. Run the job manually to see if the integration job works fine.
        1. To populate UCMDB with all relevant data for the job, click the icon.
        2. To populate UCMDB with only CI data changes since the job last ran, click the

           icon.
   6. Wait for the job to complete, and click the Refresh icon multiple times as needed until the

     job completes.

                   Note

                When the job completes, the job status becomes one of the following:
                Succeeded, Passed with failures, or Failed.

   7. Click the Statistics tab to view the results. If the job failed, click the Query Status tab and
     Job Errors tab for more information.

   8. Click OK.

If the job completes successfully, you can view the transferred CI data in UCMDB and
schedule the job so that it can run automatically.


1.6.2.2.5.2. View Service Manager CI data in
UCMDB

After a population job is successfully completed, you can search for the Service Manager CI
records in UCMDB, and verify that their attributes are correctly populated.
The Service Manager Display Name field is populated to the Name field on the Configuration
Item Properties pane in UCMDB.

            Note

           To see the entire attribute mappings of a CI type, you can open its population XML
           file (for example, SM Business Service Population.xml), where the UCMDB
           attribute field names and the mapped Service Manager web service field caption
           names are defined. For more information, see Tailoring the integration.


1.6.2.2.5.3. How to schedule CI population
jobs

You can schedule CI population jobs to match the discovery/maintenance schedule of your
Service Manager feeders. For example, if your Service Manager feeders send CI data updates
on a daily schedule, then the population jobs must also run on a daily schedule. By using a
matching schedule you can ensure that your UCMDB system always has the most current CI
data.

This task includes the following steps:

   1. Sign in to UCMDB as an administrator.
   2. Navigate to Data Flow Management > Integration Studio. UCMDB displays a list of

     integration points.
   3. Open the integration point for Service Manager.
   4. Click the Population tab, and select a population job from the list.
   5. Click the Edit Integration Job icon.
   6. Select the Scheduler enabled option.
   7. Select the scheduling options that you want to use. For example, select Repeat every:

     Day and Ends: Never.
   8. Select a Time Zone.
   9. Click OK.


1.6.2.2.6. Pushing UCMDB CI data to Service
Manager

The integration requires a one-time transfer of CIs from UCMDB to Service Manager to
populate the Service Manager system with CIs. The integration will then update the list of CIs
in Service Manager when UCMDB discovers new CIs or new attribute values. The integration
accomplishes the push of CI data using data push jobs in the UCMDB system. We recommend
that you schedule these jobs to keep your CIs and CI attributes up-to-date.
This task includes the following steps:

   1. Define CI/CI Relationship data push jobs.
     See How to define data push jobs in UCMDB.

   2. View the CI/CI Relationship data pushed from UCMDB.
     See How to view UCMDB CI data in Service Manager.

   3. Schedule data push jobs to keep CI/CI Relationship data up to date.
     See How to schedule data push jobs.


1.6.2.2.6.1. How to define data push jobs in
UCMDB

Data push jobs copy CI or CI Relationship records from your UCMDB system to your Service
Manager system.

To define a CI or CI relationship push job, follow these steps:

   1. Sign in to UCMDB as an administrator.
   2. Navigate to Data Flow Management > Integration Studio. UCMDB displays a list of

     existing integration points.
   3. Select the Integration Point that you created for Service Manager. For example,

     sm_integration.
   4. Click the Data Push tab.
   5. Follow these steps to add a new data push job:

        1. Click the New Integration Job icon .

                         Note

                      UCMDB creates a default data push job when creating an integration
                      point. The following table lists the default data push job and its queries.
                      If needed, you can create, update, or remove queries for the push job.
                      To access these out-of-the-box queries for push, go to Modeling >
                      Modeling Studio > Resources, select Queries for Resource Type, and
                      then navigate to Root > Integration > Service Manager > Push. For
                      information about tailoring data push queries, see How to create a query
                      to synchronize the CI type.


Integration job                         Queries for CI / CI Relationship Push
Integration job
                                                        Queries

                                                        Queries

             Integration job                                                          Service Manager 9.81
             SM Push job
                                        Queries
This PDF was generated on May 23, 2026
                                        Out-of-the-box, the following queries
                                        are available for this job, which pushes
                                        CI records from UCMDB to Service
                                        Manager:

                                             SM Mainframe Push 2.0: pushes
                                             CIs of the mainframe type.

                                             SM Business Element Push 2.0:
                                             pushes CIs of the business
                                             application, and infrastructure
                                             service types

                                             SM Network Component Push
                                             2.0: pushes CIs of the network
                                             component type.
                                             SM Running Software Push 2.0:
                                             pushes CIs of the running
                                             software type.
                                             SM Business Service Push 2.0:
                                             pushes CIs of the business
                                             service type.
                                             SM Computer Push 2.0: pushes
                                             CIs of the computer type.
                                             SM Storage Push 2.0: pushes
                                             CIs of the storage type.
                                             SM Switch Push 2.0: pushes CIs
                                             of the switch type.
                                             SM Net Printer Push 2.0: pushes
                                             CIs of the net printer type.
                                             SM Cluster Push 2.0: pushes CIs
                                             of the cluster type.
                                             SM Mobile Device Push 2.0:
                                             pushes CIs of the mobile device
                                             type.
                                             SM Local Printer Push 2.0:
                                             pushes CIs of the local printer
                                             type.

                                        Out-of-the-box, the following queries
                                        are available for this job, which pushes
                                        CI Relationship records from UCMDB
                                        to Service Manager:

                                                                                                          Page 971 of 1727

Integration job                         Queries

                                             SM Layer2 Topology Relations
                                             Push 2.0: pushes compound CI
                                             relationships between nodes.
                                             SM Business Service Relations
                                             Push 2.0: pushes CI relationships
                                             whose upstream CI type is
                                             business service.
                                             SM CRG Relations Push 2.0:
                                             pushes CI relationships whose
                                             upstream CI type is cluster.
                                             SM Node Relations Push 2.0:
                                             pushes direct CI relationships
                                             whose upstream CI type is node.

     2. In the Name field, type a unique name for the job. For example, CI_Push_Job1.
     3. Click the Add Query icon to add existing queries to the job.
     4. Select the Allow Integration Job to delete removed data option for each query.
     5. Click OK to save the job.
6. Run the job manually to verify that the integration job works fine.

Caution

If you have a huge amount of CI data in your UCMDB system, and this is your
first time to push CI /CI Relationship data to Service Manager, it's advisable to
select the Add the record option instead of Open a change or Open an
incident for Action if matching record doesn't exist in each Discovery Event
Manager Rules definition. Failure to do so may cause unnecessary
performance problems. For details, see How to add Discovery Event Manager
rules.

     1. To push all relevant data for the job, click the icon.
     2. To push only the updated data since the job last ran, click the icon.

               Tip

             You can stop a running push job by pressing the Stops the selected job icon
                .

7. Wait for the job to complete, and click the Refresh icon multiple times as needed until the
  job completes.


                   Note

                When the job completes, the job status becomes one of the following
                depending on the results: Completed successfully , Completed , or Failed .

   8. Click the Statistics tab to view the results; if any errors occur click the Query Status tab
     and Job Errors tab for more information.

   9. Click OK.
If the job completes successfully, you can view the UCMDB CI data in Service Manager, and
schedule the job so that it can run automatically.


1.6.2.2.6.2. How to schedule data push jobs

It's a best practice to schedule the data push jobs to match the discovery schedule of your
Service Manager feeders. For example, if your Service Manager feeders send CI data updates
on a daily schedule, the data push jobs must also run on a daily schedule. By using a matching
schedule you can ensure that your Service Manager system always has the most current CI
data.

UCMDB allows you to schedule updates directly from a data push job. This task includes the
following steps:

   1. Sign in to UCMDB as an administrator.
   2. Navigate to Data Flow Management > Integration Studio. UCMDB displays a list of

     integration points.
   3. Select the integration point that you created for Service Manager. For example, SM

     Integration.
   4. Click the Data Push tab.
   5. Select a push job. For example, SM Configuration Item Push Job 2.0.
   6. Click the Edit Integration Job icon .

                   Tip

                UCMDB allows you to define two different schedules for two types of data
                push: Delta Sync, and Full Sync. For recommendations on push scheduling,
                see Push scheduling recommendations.

   7. Define a schedule for Delta Sync. Click the Delta Synchronization tab. Select the
     Scheduler enabled option. Select the scheduling options that you want to use.

8. Click the Full Synchronization tab, and select the scheduling options that you want to
  use.


 9. Click OK to save the data push job.
10. Continue to follow step 6 to step 9 for the rest of data push jobs of the integration point.
11. Save the integration point.


1.6.2.2.6.3. How to view UCMDB CI data in
Service Manager

After a push job is successfully completed, you can search for and verify the pushed CI/CI
relationship data in Service Manager.
CI records pushed from UCMDB contains a View in UCMDB UI button, which enables you to
access the UCMDB UI to view the CI information.

            Note

                You need to specify the UCMDB UI URL in the System Information Record in
                SM to display the View in UCMDB UI button.
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

                The web services request uses the UCMDB web service URL and account
                (for example, admin/admin) defined in the SMtoUCMDB integration instance
                in Service Manager. See How to add UCMDB connection information.


1.6.2.2.6.4. Retrieving UCMDB primary CI
change history in SM

When integrated with UCMDB UI, Service Manager displays a Primary CI History in UCMDB
section in a Problem record whose primary CI is from UCMDB synchronization. You can view
the CI changes on that primary CI for root cause investigation.
For information about how to enable an integration with UCMDB UI, see How to add UCMDB
connection information.

To view the primary CI change history, follow these steps:

   1. Sign in to Service Manager.
   2. Navigate to Problem Management, and perform a search to open a Problem record

     whose Primary CI is from UCMDB synchronization.
   3. Click the Primary CI History in UCMDB tab.
````
