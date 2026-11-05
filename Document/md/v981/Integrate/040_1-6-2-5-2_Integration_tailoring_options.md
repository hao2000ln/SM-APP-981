---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.6.2.5.2 .. 1.6.2.5.2.5
printed_pages: 1094-1118
---

# 1.6.2.5.2 Integration tailoring options

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.6.2.5.2. Integration tailoring options

The integration offers the following tailoring options:
How to enable ASM support
How to update the integration adapter configuration file (sm.properties)
How to add DEM reconciliation rules
How to add Discovery Event Manager rules
How to add a CI relationship type to the integration for data push
How to add a CI attribute to the integration for data push
How to add a CI type to the integration for data push
How to add a CI type, attribute, or relationship type to the integration for population
How to enable or disable UCMDB ID pushback for a CI Type
How to add an attribute of a supported CI type for federation
How to enable the automatic deletion of CI relationships from UCMDB


1.6.2.5.2.1. How to enable ASM support

As of version 9.41, Service Manager supports the Automated Service Modeling (ASM)
functionality in the UCMDB UI.

ASM can automatically discover Service CIs and the consumer-provider relationships between
the components of services. The Service Discovery process builds dependency graphs from
the consumer-provider components that make up a service.

            Note

           ASM is supported only for UCMDB 10.20 or later. To use ASM, the ASM Enhanced
           package must be deployed in UCMDB.

You can tailor Service Manager to integrate with Automated Service Modeling (ASM) of the
UCMDB Browser. See the following instructions.

How to integrate with ASM

ASM enables Service Manager users to view the accurate service trees that are discovered by
ASM and facilitates service modeling in Service Manager.

For example, to integrate the Service Manager Change Management module with ASM, you
can add a control that calls the us.launch.external RAD application by passing the following
URL:

http://[UCMDB browser server name]:[port]/ucmdb_browser.jsp?username=
<username>&password=<password>&server=Default%20Client&locale=en#view=[Service
Name];tab=service-modeling

Where:

     [UCMDB browser server name], [port], [username] and [password] are the
     UCMDB server host name, communications port, integration account user name and
     password, respectively. These parameters are configured in the UCMDB integration
     section in the System Information Record.
     [Service Name] is the display name of current service CI.


1.6.2.5.2.2. How to update the integration
adapter configuration File (sm.properties)

The integration uses a properties file (sm.properties) as a configuration file of the adapter. Out-
of-the-box, this file has been set up based on best practices, so usually you can keep the
default parameter values. Optionally, you can update the parameter values to better suit your
needs.

To update the sm.properties file:

   1. Sign in to UCMDB as an administrator.
   2. Navigate to Data Flow Management > Adapter Management >

     ServiceManagerEnhancedAdapter9.41 > Configuration Files.
   3. Click the properties configuration file: sm.properties .

   4. Update the parameter values as needed. For a list of the parameters, see the following
     table.


                                        Parameters in the sm.properties file

Parameter                               Default value                         Comment
timeout.minutes
                                        10                                    The integration

                                                                              connection timeout value

                                                                              (in minutes)

Parameter                               Default value                      Service Manager 9.81

number.of.concurrent.sen 6                             Comment
ding.threads
                                                       The number of concurrent
                                                       threads used for the data
                                                       push feature

                                                            1: Disabled
                                                            2 or higher: Enabled

                                                                   Note

                                                                  If you are
                                                                  connecting to
                                                                  multiple
                                                                  Service
                                                                  Manager
                                                                  instances to
                                                                  improve the CI
                                                                  data push
                                                                  performance
                                                                  (see the URL
                                                                  Override
                                                                  configuration
                                                                  in How to
                                                                  create an
                                                                  integration
                                                                  point in
                                                                  UCMDB), you
                                                                  are
                                                                  recommended
                                                                  to increase
                                                                  this value for
                                                                  optimized
                                                                  performance.
                                                                  For example,
                                                                  set it to 12 if
                                                                  you are
                                                                  connecting to
                                                                  two Service
                                                                  Manager
                                                                  instances.

Parameter                               Default value                      Service Manager 9.81

min.objects.for.concurrent 50                          Comment
.sending
                                                       The minimum number of
number.of.chunks.per.thre 3                            Service Manager objects
ad                                                     that's required to use
                                                       concurrent sending
                                                       instead of single thread
                                                       sending

                                                                   Note

                                                                  It is used for
                                                                  the push
                                                                  feature.

                                                       The number of chunks per
                                                       thread used for the push
                                                       feature
                                                       Total of number of chunks
                                                       =
                                                       number.of.chunks.per.thre
                                                       ad *
                                                       number.of.concurrent.sen
                                                       ding.threads

Parameter                               Default value                      Service Manager 9.81

recommended.min.cis.per. 50                            Comment
chunk
                                                       The minimum allowed
max.running.hours.for.mul 20                           number of CIs per CI data
ti.threaded                                            chunk. This value is used
                                                       to mitigate the risk of
                                                       making your data chunks
                                                       too small.

                                                       For example, suppose
                                                       your system uses the
                                                       following settings:

                                                            number.of.chunks.pe
                                                            r.thread=3
                                                            number.of.concurren
                                                            t.sending.threads=3
                                                            recommended.min.ci
                                                            s.per.chunk=50

                                                       When pushing 1000 CIs,
                                                       the number of CIs in each
                                                       chunk is calculated as
                                                       1000/3/3. The calculated
                                                       value is greater than the
                                                       recommended.min.cis.per.
                                                       chunk value, so the
                                                       calculated value is used.
                                                       However, when pushing
                                                       270 CIs, the calculated
                                                       value is less than the
                                                       recommended.min.cis.per.
                                                       chunk value, so the
                                                       calculated value is used.

                                                       The maximum number of
                                                       hours before a push
                                                       request times out in a
                                                       multi-threaded
                                                       environment.

Parameter                               Default value                      Service Manager 9.81

number.of.cis.per.request 1000                         Comment

federation.request.paginat on                          The maximum number of
ion.switch                                             objects retrieved from
                                                       Service Manager by ID
federation.request.max.siz 2000
e                                                                  Caution

federation.isin.max.count 500                                     It is used for
                                                                  the population
use.global.id                           true                      and federation
                                                                  features. Do
                                                                  not set it to a
                                                                  number
                                                                  greater than
                                                                  1000 in case
                                                                  the request
                                                                  has a 64K
                                                                  limit.

                                                       size of query conditions
                                                       for federation

                                                       size of isin{} size

                                                       This parameter is obsolete
                                                       for the generic adapter
                                                       starting with SM9.41.

Parameter                               Default value                      Service Manager 9.81
type.of.expand.enum                     2
                                                       Comment
op.pagination.switch                    on
                                                       It configures the value
                                                       mapping rule for the
                                                       UCMDB enum type

                                                            0: The feature will be
                                                            disabled
                                                            1: The enum type will
                                                            expand to “{value}”
                                                            2: The enum type
                                                            will expand to
                                                            “{index}-{value}”

                                                                   Note

                                                                  It is used for
                                                                  the push
                                                                  feature.

                                                       It indicates if pagination
                                                       (client driven) is enabled

                                                            on: Enabled.
                                                            off: Disabled.

                                                                   Note

                                                                  It is used for
                                                                  the population
                                                                  feature.

Parameter                               Default value                        Service Manager 9.81

pop.pagination.recordcou 1000                            Comment
nt
                                                         The maximum number of
pop.createci.key                        sm_id            records displayed on each
                                                         page when pagination is
ucmdbid.pushback.reques UpdateucmdbID                    enabled.

t                                       PushBackRequest              Note

                                                                    It is used for
                                                                    the population
                                                                    feature.

                                                         The UCMDB field of a CI
                                                         record that stores the
                                                         Service Manager CI ID.

                                                                     Note

                                                                    It is used for
                                                                    UCMDB ID
                                                                    Push Back by
                                                                    the population
                                                                    feature.

                                                         The web service request
                                                         for pushing the UCMDB ID
                                                         back to Service Manager.

                                                                     Note

                                                                    It is used for
                                                                    the population
                                                                    feature.

Parameter                               Default value                      Service Manager 9.81

check.sm.connections                    false          Comment

                                                       It indicates whether to
                                                       check the SOAP
                                                       connections to Service
                                                       Manager instances before
                                                       running a job.

                                                       You can enable it under
                                                       any of the following
                                                       circumstances:

                                                            Your Service
                                                            Manager is running
                                                            in High Availability
                                                            mode (with load
                                                            balancing), and you
                                                            want to connect
                                                            UCMDB to multiple
                                                            Service Manager
                                                            instances.
                                                            You want UCMDB to
                                                            not run a job when
                                                            no integration
                                                            connections are
                                                            available, rather than
                                                            run the job and then
                                                            report a failure.


1.6.2.5.2.3. How to add DEM reconciliation
rules

It is possible that your Service Manager system already contains CI records that match CIs in
your UCMDB system. Rather than add duplicate CI records to your Service Manager system,
you can configure Service Manager to reconcile CI records between the two systems based on
specified Discovery Event Manager (DEM) reconciliation rules.

A DEM reconciliation rule record enables you to specify what Service Manager queries you
want to use to determine whether an existing CI record matches a CI in a UCMDB system. An
administrator typically specifies reconciliation rules prior to starting the integration to the
UCMDB system so that Service Manager will not create duplicate CI records.

When performing CI reconciliation between Service Manager and UCMDB, Service Manager
uses the ucmdb.id field to query the device table or a join table to determine whether an
Update or Create operation is needed. The reconciliation process is as follows:

   1. The UCMDB system sends a web service message containing the latest CI attribute data
     to Service Manager.

   2. Service Manager scans the web service message for the CI ucmdb.id value.

                   Note

                The ucmdb.id field is displayed in the Actual State Section of the CI form, with
                a label of Ucmdb ID.

   3. Service Manager searches for an existing CI record that has the same ucmdb.id value.
   4. If Service Manager finds a CI that has the ucmdb.id value, no reconciliation is needed.

     Service Manager compares the UCMDB CI attributes to the Service Manager managed
     fields and runs the appropriate Discovery Event Manager (DEM) rules as needed to
     update the CI record in Service Manager.
   5. If Service Manager can't find a CI that has the ucmdb.id value, it searches for a DEM
     reconciliation rule record that's defined for the CI type.
   6. If no DEM reconciliation rule record is found, Service Manager creates the CI record
     according to the appropriate DEM rules.

   7. If a DEM reconciliation rule record is found, Service Manager evaluates the rules and
     appends (ucmdb.id=NULL or ucmdb.id~=NULL and istatus=”XXXXXX”) to the
     reconciliation rules in the backend. The istatus value is retrieved from the DEM rule for
     deletion (for example, Retired/Consumed). If no istatus value is found in the DEM rule,
     Service Manager only appends ucmdb.id=NULL to the reconciliation rules in the backend.

   8. If no matching CI record is found by the reconciliation rules, Service Manager creates the
     CI record according to the appropriate DEM rules.


   9. If a matching CI record is found by the reconciliation rules, Service Manager updates the
     CI record according to the appropriate DEM rules

Multi-company mode
By default, Service Manager uses only the ucmdb.id field for CI reconciliation and the
company.id field is not used. You can manually add DEM reconciliation rules.
Using join tables for reconciliation
When setting reconciliation rules, if the CI type you are reconciling has a joindef definition (as
defined in the devtype table), use the join table name instead of the device table. For example,
if you want to reconcile computer CIs, use the joinnode table instead of the device table.
Sequence of reconciliation
By default, Service Manager executes the reconciliation rules in their listed order. To change
the order in which Service Manager reconciles CIs, you can add a numeric value to the
Sequence field.
Steps to add a DEM reconciliation rule record
To create a DEM reconciliation rule record, follow these steps:

   1. Click Tailoring > Web Services > DEM Reconciliation Rules.
     Service Manager displays the DEM Reconcile Record form.

   2. In the Table field, select a Service Manager table against which you want to run
     reconciliation queries.

                   Note

                Only tables that are specified in CI type records are displayed in the drop-
                down list. You can create only one DEM reconciliation record for one table.

   3. Click New.
   4. Enter expressions in the Expression column, and then enter a sequence number for each

     expression in the Sequence column. For example, you can add the following expressions
     for the device table. In this example, Service Manager looks for a matching record first
     based on the logical.name field, and then based on the sm.device.display.name field.


Expression                              Sequence               Notes
                                        1
logical.name=logical.nam                                       Checks to see if the CI
e in $L.file                                                   Identifier matches the
                                                               logical.name value of an
sm.device.display.name=s 2                                     existing CI in Service
m.device.display.name in                                       Manager. If no matching
$L.file                                                        record is found, go to the
                                                               next expression.

                                                               Checks to see if the CI
                                                               Display Name matches
                                                               the display.name value of
                                                               an existing CI in Service
                                                               Manager.

5. Click Add.
  Service Manager creates the DEM reconciliation rule record.


1.6.2.5.2.4. How to add Discovery Event
Manager rules

Service Manager uses Discovery Event Manager (DEM) to define the actions the system
should perform when the actual state of an incoming configuration item (CI) record differs from
the managed state of a CI record in Service Manager. The DEM rules allow you to define
whether the Service Manager system adds, updates, or deletes CI records based on incoming
UCMDB data.

For CI records only, the DEM rules also allow you to define how Service Manager should
handle duplicate logical names.

To access DEM rules in Service Manager, navigate to Tailoring > Web Services > Discovered
Event Manager Rules, and then click Search to view existing rules or click New to create new
rules.

DEM rules

Service Manager offers the following rules options:

Action if the matching record doesn't exist

This is the action you want Service Manager to take if it can't find a matching CI record.

     Add the record:(Default) Service Manager will add a CI record when it can't find a
     matching record. See How to add DEM reconciliation rules to define what fields Service
     Manager uses to match CI records.
     Add the record, and set dependency as true: This option is available only for
     synchronization of CI relationship data. Service Manager adds the CI relationship record
     and enables outage dependency for the record by doing the following:

           Checks the Outage Dependency checkbox;

           Sets the number of dependent downstream CIs to 1. This is because UCMDB only
           supports one-to-one CI relationships.


     Open an Incident:Service Manager opens an incident for someone to review the new CI
     record. The incident enables someone to investigate whether the new CI record is
     compliant with your business practices.
     Open a Change:Service Manager opens an unplanned change for someone to review the
     new CI record. The change allows you to investigate whether the new CI record is
     compliant with your business practices. If the CI record is compliant, the change can be
     approved. If the CI record is not compliant, then the change can be denied and the CI
     record removed. The change record lists both the current and proposed attribute values.

Action if record exists but unexpected data discovered

This is the action you want Service Manager to perform if it doesn't find a matching CI attribute
value.

     Open a Change: (Default) Service Manager opens an unplanned change to review the
     actual state of the CI record. The change allows someone to investigate whether the new
     attribute value is compliant with your business practices. If the value is compliant, the
     change can be approved. If the value is not compliant, then the change can be denied
     and the CI attribute value reverted to its managed state.
     Log Results and update record:Service Manager logs the results of the actual state of
     the CI record, and then updates the CI record.
     Open an Incident:Service Manager opens an Incident to investigate the actual state of a
     CI record and determines what actions must be performed or initiated to bring the record
     into compliance with Service Manager.


Action if record is to be deleted

This is the action you want Service Manager to perform if an external event specifies that the
record needs to be deleted.

     Delete record: (Default for CI Relationship records) This option is available for
     synchronization of both CI and CI Relationship records. Service Manager automatically
     deletes the CI/CI Relationship record.
     Open an Incident: This option is available only for synchronization of CI Relationship
     records. Service Manager opens an incident to investigate the deleted record and
     determines which actions must be performed or initiated to bring the record into
     compliance with Service Manager.
     Open a Change: This option is available only for synchronization of CI Relationship
     records. Service Manager opens an unplanned change to review the deleted record. The
     change allows someone to investigate whether the deleted record is compliant with your
     business practices. If the record is compliant, the change can be approved. If the record
     is not compliant, then the change can be denied and the record added back to the
     system.
     Update record to the selected status: (Default for CI records) This option is available
     only for synchronization of CI records. Service Manager updates the status of the CI
     record to a value selected from the drop-down list (for example, Retired/Consumed),
     rather than deletes the record permanently.

                   Note

                Values available from the drop-down list are defined in the ICM Status global
                list.

     Open a Change to update record to the selected status: This option is available only for
     synchronization of CI records. Service Manager opens an unplanned change to update
     the CI record’s status to a value selected from the drop-down list (for example,
     Retired/Consumed). The change allows someone to investigate whether the requested
     status change is compliant with your business practices. Once the change has been
     approved and closed, Service Manager automatically changes the CI record to the
     selected status. If the change has been denied, Service Manager makes no changes to
     the CI record.
     Open an Incident to update record to the selected status: This option is available only
     for synchronization of CI records. Service Manager opens an incident to update the
     record’s status to a value selected from the drop-down list (for example,
     Retired/Consumed). Once the incident has been closed, Service Manager automatically
     updates the CI record to the selected status.

CI attributes displayed in Change and Incident records

Service Manager displays a Change Details section on the corresponding change or a CMDB
Changes section on the corresponding incident when you configure DEM to open either


change records or incident records when it discovers CI attribute changes through the
UCMDB-SM integration. Service Manager only displays a tab for CI attributes when the
UCMDB-SM integration is enabled and you have defined a rule in the Discovery Event Manager
to create a change or incident record when a CI is added, updated, or deleted.

Both the Change Details and CMDB Changes sections display the current CI attribute values
alongside the actual attribute values discovered by UCMDB. You can use this information to
approve or deny a change or escalate an incident to the proper assignment group.

Searching for Change and Incident records opened by
the integration

You can use the following search criteria to find change and incident records opened by the
UCMDB-SM integration.

Record type  Search options available for change and incident records

                                      Search option available

Change                                  Search for records with the unplanned
                                        change category.

Incident                                Search for records using the Generated by
                                        UCMDB Integration option.


1.6.2.5.2.5. How to add a CI relationship type
to the integration for data push

Suppose you have added a new CI type to the integration and have created relationships
between it and other CI types in UCMDB. For each of these relationship types, you need to
perform the following tasks so that UCMDB can push each type of relationship to Service
Manager.
As an example, the following steps illustrate how you add a relationship type named
Ownership (between the Cost and CostCategory CI types) to the integration for data push.

            Note

           These steps assume that you have already added the Cost and CostCategory CI
           types to the integration.

   1. Create a query to push the relationship type.
     See How to create a query to push a relationship type below.

   2. Map the relationship query to a Service Manager Web Service object.
     See How to map a relationship type query to the Service Manager Web Service object
     below.

   3. Create an XML configuration file for the new relationship type.
     See How to create an XML configuration file for a relationship type below.

How to create a query to push a relationship type

Once you have created a relationship between two CI types, you must create a query to push
the relationship to Service Manager.

            Note

           Any query you create must conform to the Query requirements.

To create a new query called Cost CostCategory Ownership Relations for Ownership
relationships between the Cost and CostCategory CI types:

   1. Sign in to UCMDB as an administrator.
   2. Navigate to Modeling > Modeling Studio.
   3. Click New > Query. The system displays the Query Definition pane.
   4. From the CI Type Selector, drag the Cost and CostCategory CI types to the query pane.


5. Create an Ownership relationship from Cost to CostCategory.
     1. Click the Create Relationship icon.
     2. Select the Cost node, and drag the arrow from it to the CostCategory node.
     3. Select Regular Relationship, and click OK.
     4. Select Connection > Ownership, enter Ownership for Relationship Name, and click
        OK. The system creates an Ownership relationship between the CI types.

6. Right-click the relationship arrow, and select Relationship Properties.

7. Change the element name from Ownership to Root (or a name starting with Root_), and
  then click OK.


   8. Click the Save icon, and save the query as described in the following.
        1. Enter a query name. For example, Cost CostCategory Ownership Relations Push .
        2. Select the Integration > Service Manager > Push folder.
        3. Click OK.

The query is now created. You are ready to add this query to the push configuration file
( smPushConf.xml ).

How to map a relationship type query to the SM Web
Service object

Once you have created a query for a relationship type, you need to map the query to the
Relationship web service object in Service Manager as described in the following steps.

   1. Navigate to Data Flow Management > Adapter Management >
     ServiceManagerEnhancedAdapter9.41 > Configuration Files.

   2. Click the smPushConf.xml file.
   3. Add a mapping entry by copying an existing one for relationship push. For example, add

     the following mapping entry.

          <tql name="SM Layer2 Topology Relations Push 2.0"
          resourceCollectionName="Relationships" resourceName="Relationship"
          />


   4. Change the TQL query name to the name of the query you created for the relationship
     type. For example, Cost CostCategory Ownership Relations Push .

          <tql name="Cost CostCategory Ownership Relations Push"
          resourceCollectionName="Relationships" resourceName="Relationship"
          />

   5. Click Save to save the configuration file.

How to create an XML configuration file for a relationship
type

To create an XML configuration file for a relationship type:
   1. Sign in to UCMDB with an administrator account.
   2. Navigate to Data Flow Management > Adapter Management >
     ServiceManagerEnhancedAdapter9.41, and select the adapter.
   3. Click the Create New Resource icon.
   4. Select New Configuration File.
  5. Enter the full file name: <AdapterID>/mappings/push/<filename> . For example,
      ServiceManagerEnhancedAdapter9.41/mappings/push/SM Cost CostCategory
     Ownership.xml .
   6. Click OK to save to the new file. The new file appears in the list of configuration files.
   7. Open the new file in the XML Editor of the Visual Mapping interface.
   8. Copy the content from an existing mapping file to overwrite the content of the new file in
     the XML Editor pane, and update the query name to the name of the query you created
     ( Cost CostCategory Ownership Relations Push ).


<?xml version="1.0" encoding="UTF-8"?>

<integration xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"

xsi:noNamespaceSchemaLocation="../mappings_schema.xsd">

<info>

<source name="UCMDB"                    version="10.20" vendor="HP"/>

<target name="SM"                       version="9.40" vendor="HP"/>

</info>

<import>

<scriptFile path="mappings.scripts.SMPushFunctions"/>

</import>

<!--

Push Cost to Cost Category Relations.

-->

<target_entities>

<source_instance query-name="Cost CostCategory Ownership Relations

Push" root-element-name="Root">

<target_entity name="Relationship">

<target_mapping name="RelationshipType" datatype="STRING"

value="SMPushFunctions.getDisplayName(Root['element_type'],ClassMod

el)"/>

<target_mapping name="ParentCI" datatype="STRING"

value="SMPushFunctions.getEndId(OutputCI.getExternalId().getEnd1Id(

))"/>

<target_mapping name="ChildCIs" datatype="STRING_LIST" value="

[SMPushFunctions.getEndId(OutputCI.getExternalId().getEnd2Id())]"/>

</target_entity>

</source_instance>

</target_entities>

</integration>

   9. Click the Save icon to save the new configuration file.

Now, you have added the new relationship type to the integration. Next, you need to add the
new relationship query to a data push job, as shown in the following figure. For detailed steps,
see How to add a custom query to an integration job.


Caution

Before you run the relationship push job, make sure you have already added the
relevant CI types (Cost and CostCategory in this example) to the integration and
pushed the relevant CIs to Service Manager.
````
