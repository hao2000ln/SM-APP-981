---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.6.3.5.2 .. 1.6.3.5.2.5
printed_pages: 1316-1346
---

# 1.6.3.5.2 Integration tailoring options

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.6.3.5.2. Integration tailoring options

The integration offers the following tailoring options.
How to enable ASM support
How to update the integration adapter configuration file (sm.properties)
How to add DEM reconciliation rules
Add Discovery Event Manager rules
How to add a CI attribute to the integration for data push
How to add a CI type to the integration for data push
How to add a CI type's relationship types to the integration for data push
How to add a CI attribute to the integration for population
How to add a CI type to the integration for population
How to add a CI type's relationship types to the integration for population
How to customize UCMDB ID pushback for a CI type
How to add custom queries to integration population jobs
How to add an attribute of a supported CI type for federation


1.6.3.5.2.1. How to enable ASM support

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


1.6.3.5.2.2. How to update the integration
adapter configuration File (sm.properties)

The integration uses a properties file (sm.properties) as a configuration file of the adapter. Out-
of-the-box, this file has been set up based on best practices. Usually you can keep the default
parameter values. Optionally, you can update the parameter values to better suit your needs.

To update the sm.properties file:

   1. Sign in to UCMDB as an administrator.
   2. Navigate to Data Flow Management > Adapter Management >

     ServiceManagerAdapter9.41 > Configuration Files.
   3. Click the properties configuration file: sm.properties .
   4. Update the parameter values as needed. For a list of the parameters, see the following

     table.


                                        Parameters in the sm.properties file

Parameter                               Default value                         Comment
timeout.minutes
                                        10                                    The integration

                                                                              connection timeout value

                                                                              (in minutes).

Parameter                               Default value                      Service Manager 9.81

number.of.concurent.send 6                             Comment
ing.threads
                                                       The number of concurrent
                                                       threads used for the data
                                                       push feature.

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

min.objects.for.concurent. 50                          Comment
sending
                                                       The minimum number of
number.of.chunks.per.thre 3                            Service Manager objects
ad                                                     that's required to use
                                                       concurrent sending
number.of.cis.per.request 1000                         instead of single thread
                                                       sending.

                                                                   Note

                                                                  It is used for
                                                                  the push
                                                                  feature.

                                                       The number of chunks per
                                                       thread used for the push
                                                       feature.

                                                       The maximum number of
                                                       objects retrieved from
                                                       Service Manager by ID.

                                                                   Note

                                                                  It is used for
                                                                  the population
                                                                  and federation
                                                                  features. Do
                                                                  not set it to a
                                                                  number
                                                                  greater than
                                                                  1000 in case
                                                                  the request
                                                                  has a 64K
                                                                  limit.

Parameter                               Default value                      Service Manager 9.81
use.global.id                           true
                                                       Comment
type.of.expand.enum                     2
                                                       If set to true, globalId is
                                                       used in the integration.

                                                       If set to false, ucmdbId is
                                                       used in the integration.

                                                       For more information
                                                       about the differences
                                                       between UcmdbID and
                                                       GlobalID, see the UCMDB
                                                       documentation.

                                                       It configures the value
                                                       mapping rule for the
                                                       UCMDB enum type.

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

Parameter                               Default value                      Service Manager 9.81
use.type.label                          true
                                                       Comment
op.pagination.switch                    on
                                                       It configures whether the
pop.pagination.recordcou 1000                          generated source XML
nt                                                     uses the real
                                                       CI/Relationship type
                                                       directly or uses the label
                                                       that's defined in the
                                                       query.
                                                       If set to false, the real
                                                       type is used directly
                                                       instead of the label.

                                                       It indicates if pagination
                                                       (client driven) is enabled.

                                                            on: Enabled.
                                                            off: Disabled.

                                                                   Note

                                                                  It is used for
                                                                  the population
                                                                  feature.

                                                       The maximum number of
                                                       records that are displayed
                                                       on each page when
                                                       pagination is enabled.

                                                                   Note

                                                                  It is used for
                                                                  the population
                                                                  feature.

Parameter                               Default value                              Service Manager 9.81
pop.createci.key                        sm_id
                                                               Comment

                                                               The UCMDB field of a CI
                                                               record that stores the
                                                               Service Manager CI ID.

                                                                           Note

                                                                          It is used for
                                                                          the population
                                                                          feature.

ucmdbid.pushback.reques UpdateucmdbID                          The web service request
                                                               for pushing the UCMDB ID
t                                       PushBackRequest        back to Service Manager.

                                                                           Note

                                                                          It is used for
                                                                          the population
                                                                          feature.

ucmdbid.pushback.xslt                   ucmdbid_pushback.xslt  The xslt configuration file
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


1.6.3.5.2.3. How to add DEM reconciliation
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


1.6.3.5.2.4. Add Discovery Event Manager
rules

Service Manager uses the Discovery Event Manager (DEM) to define which actions the system
should perform when the actual state of an incoming configuration item (CI) record differs from
the managed state of a CI record in Service Manager. The DEM rules allow you to define
whether the Service Manager system adds, updates, or deletes CI records based on incoming
UCMDB data.

For CI records only, the DEM rules also allow you to define how Service Manager should
handle duplicated logical names.

DEM rules

Service Manager offers the following rules options:

Action if a matching record doesn't exist

You may want Service Manager to take this action if it can't find a matching CI record.

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

Action if a record exists but unexpected data discovered

This is the action you want Service Manager to perform if it doesn't find a matching CI attribute
value.

     Open a Change: (Default) Service Manager opens an unplanned change to review the
     actual state of the CI record. The change allows someone to investigate whether the new
     attribute value is compliant with your business practices. If the value is compliant, the
     change can be approved. If the value is not compliant, then the change can be denied
     and the CI attribute value reverted to its managed state.
     Log Results and update record: Service Manager logs the results of the actual state of
     the CI record, and then updates the CI record.
     Open an Incident:Service Manager opens an Incident to investigate the actual state of a
     CI record and determines what actions must be performed or initiated to bring the record
     into compliance with Service Manager.


Action if a record is to be deleted

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

Change                                  Search for records with the category
                                        unplanned change.

Incident                                Search for records using the generated by
                                        the UCMDB integration option.


1.6.3.5.2.5. How to add a CI attribute to the
integration for data push

You can use the following steps to add a CI attribute to the integration.

   1. Does the CI attribute already exist in the UCMDB class model?
     Yes. Go to Step 3.
     No. Go to Step 2.

   2. Add the CI attribute to the UCMDB class model.
     See How to add the CI attribute to the UCMDB class model below.

   3. Add the CI attribute to the query layout.
     See How to add a CI attribute to the query layout below.

   4. Add the CI attribute to the Service Manager table.
     See How to add the CI attribute to the Service Manager table below.

   5. Create a web service field to support the CI attribute.
     See How to Create a Web Service field to support the CI attribute below.

   6. Add a managed field to monitor changes in the CI attribute.
     See How to add a managed field to support the CI attribute below.

   7. Map the CI attribute to a web service field.
     See How to map the CI attribute to a Web Service field below.

How to add the CI attribute to the UCMDB class model

The integration only uses a subset of the CI attributes available from your UCMDB system.
Out-of-the-box, the integration consists of CI attributes that are typically managed from a
Service Manager system such as host name and host DNS name. Before creating a new
UCMDB CI attribute, you should determine if there are any existing CI attributes in your UCMDB
system that provide the data you want. In most cases, there is an existing attribute tracking the
data you want to add to the integration. For example, if you review the attributes of the Node CI
type, you see that there are many attributes available to be added to the integration.


The following steps illustrate how to add a new CI attribute to an existing CI type. This scenario
is not the expected typical case. Typically, you would add an existing CI attribute to the
integration.

            Note

           The integration doesn't require any special steps to add a CI attribute to the
           UCMDB class model. You can use the standard CI attribute creation procedures to
          add a CI attribute. For more information on CI attribute creation, see the Universal
          CMDB CI Attribute Customization Guide.

To add a CI attribute to the UCMDB class model:

   1. Sign in to UCMDB as an administrator.
   2. Navigate to Modeling > CI Type Manager.
   3. Select the CI type to which you want to add a new CI attribute from the CI Types

     navigation tree. For example, ConfigurationItem > InfrastructureElement >
     RunningSoftware > Database.
   4. Click the Attributes tab.

   5. Click the Add button.

     The Add Attribute window opens.

   6. In Attribute Name, type the unique name you want to use for the new CI attribute. For
     example, database_owner.

                   Caution

                The name can't include any of the following characters: ‘ / \ [ ] : | < > + = ; , ?
                *.


   7. In Display Name, type the name you want UCMDB to display in the interface. For example,
     Database Owner.

   8. In Description, type a description of the new CI attribute. This is an optional field. For
     example, a System user who owns the database.

   9. In Attribute Type, select either Primitive or Enumeration/List. For example, select Primitive
     and select string.

 10. In Value Size, type the maximum character length the attribute can have. For example,
     300.

 11. In Default Value, type the value to be used when no other value is available. For example,
     leave the default value blank.

 12. Click OK to save the attribute.

 13. Click the Save button to save attribute changes to the CI type.

How to add a CI attribute to the query layout

To add a CI attribute to the integration, you must add this attribute to the layout setting from the
query that synchronizes the CI type. You must know what CI type contains the CI attributes
you want to add to the integration.

Keep a list of the attributes that you enable, because you will need to create a matching XSL
transformation for each attribute you enable.

To add a CI attribute to the query layout:

   1. Sign in to UCMDB as an administrator.
   2. Navigate to Modeling > Modeling Studio.
   3. For Resource Type, select Queries.
   4. From the Queries navigation tree, click Integration > SM Sync > 9.xx.
   5. Select the query that manages the CI type whose attributes you want to add to the

     integration. For example, SM Computer Push. UCMDB displays the TQL graph for the
     integration query.
   6. Select the node from the query layout that contains the CI attribute you want to add to the
     integration. For example, Root.
   7. Right-click the node and select Query Node Properties. The Query Node Properties
     window opens.
   8. Click Element layout tab. The Layout Settings tab opens.

   9. Select the CI attribute you want to include in the integration from the Available Attributes
     list, and click the Add button to add it to Specific Attributes list. For example, OsVendor.


 10. Click OK to save the node properties.

 11. Click the Save button to save the query.

How to add the CI attribute to the Service Manager table

The integration uses only a subset of the CI attributes available from your Service Manager
system. Before creating a new Service Manager CI attribute, you should determine if there are
any existing CI attributes in your Service Manager system that provide the data you want. In
most cases, there is an existing attribute tracking the data you want to add to the integration.
For example, if you review the attributes of the Computer CI type, you see that there are many
attributes available to be added to the integration.


The following steps illustrate how to add a new CI attribute to an existing CI type.

The integration doesn't require any special steps to add a CI attribute to the Service Manager
table. You can use the standard table attribute creation procedures to add a CI attribute. For
more information on table attribute creation, see Service Manager Help Center and Service
Manager Tailoring Best Practices.

To add a CI attribute to the Service Manager table:

   1. Sign in to Service Manager as a system administrator.
   2. Navigate to Tailoring > Database Dictionary.
   3. In File Name, type the name of the table where you want to add the new CI attribute. For

     example, node.

4. Click the Search button              .

The node dbdict record opens.

5. Click the Fields tab.

6. Click the New Field/Key button.


     The Add Attribute window opens.

   7. In Name, type the name you want to use for the new CI attribute. For example,
     os.manufacturer.

                   Caution

                The name can't include any of the following characters: ' / \ [ ] : | < > + = ; , ?
                *.

   8. In Type, select a type from the list. For example, select character.
   9. Click the Add Field button to save the attribute.
 10. Click the OK button to save attribute changes to the table.

How to create a Web Service field to support the CI
attribute

UCMDB uses the Service Manager ucmdbIntegration web service to send CI data. This web
service publishes the objects that match the out-of-the-box CI types and CI attributes provided
by the UCMDB-SM integration. For a list of the out-of-the-box web service fields and their
mappings to Service Manager tables, see Managed fields.

If you add a CI attribute to the integration on your UCMDB system, you must create a
corresponding web service field on your Service Manager system to receive the incoming CI
data from UCMDB. Each web service field must map to a valid Service Manager table and
column.

To create a web service field for the OSVendor attribute described in previous sections:

   1. Sign in to Service Manager with an administrator account.
   2. Navigate to Tailoring > Web Services > WSDL Configuration. The External Access

     Definition form opens.
   3. For Service Name, type ucmdbIntegration.
   4. Click Search. Service Manager displays a record list of the objects that make up the

     ucmdbIntegration web service.
   5. Select an existing web service object to which you want to add the CI attribute. For

     example, select ucmdbNode.
   6. Click the Fields tab. Service Manager displays the fields published as web service fields.
   7. Select an empty row in the Fields list.
   8. For Field, select the Service Manager column name where you want to store the incoming

     CI attribute values. For example, os.manufacturer.


                 Note

               Service Manager displays the fields from all join tables associated with the
               table listed in the Name field. For example, for joinnode Service Manager
               displays the fields from the device and node tables.

 9. For Caption, type the name you want Service Manager to use when publishing the field as
    a web service field. For example, OSVendor.

                 Caution

               The Caption name must match the object name you listed in the XSL
               transformation file in Universal CMDB, or Service Manager will not receive
               any CI updates from your Universal CMDB system.

10. Click Save.
    The new web service field is available immediately; you don't need to restart the Service
    Manager system.


How to add a managed field to support the CI attribute

In order for a CI attribute you add to the integration to trigger the automated Change
Management validation and verification processes, you must add a managed field for the CI
attribute. Service Manager managed fields are part of the Discovery Event Manager Rules. For
a list of fields that trigger Change Management validation and verification, see Service
Manager Discovery Event Manager rules.

To add a managed field to the integration:

   1. Sign in to Service Manager with an administrator account.
   2. Navigate to Tailoring > Web Services > Discovered Event Manager Rules. Service

     Manager displays a record search/creation form.
   3. Click Search to display a list of all Discovery Event Manager rules.

   4. Select the rule ID that matches the web services object where you mapped the
     incoming CI attribute. For example, ucmdbNode. See How to create a Web Service field
     to support the CI attribute.

     Service Manager displays the rules for this web service object.

   5. Click the Managed Fields tab. Service Manager displays the list of fields that trigger
     Change Management validation and verification.

   6. Select an empty row in the Managed Fields list.
   7. For Field Name, select the caption name of the Service Manager column that you

     previously selected to store the incoming CI attribute values. For example, Os
     Manufacturer.

                   Note

                Service Manager displays the fields from all join tables associated with the
                table listed in the Table Name field. For example, joinnode displays fields from
                the device and computer tables.

                   Tip

                If you want to add all fields that are exposed in the WSDL definition, you can
                click the Load Fields button. For more information, see How do I use the Load
                Fields button to add multiple managed fields.

   8. If the field you use to store the incoming CI attribute is an array of structure, use the
     Structure field to select the name of the array of structure where the column can be
     found. For example, Os Manufacturer is a primitive character field and therefore doesn't
     need to identify an array of structure name.

   9. If the field you use to store the incoming CI attribute is an array of structure, use the Index
     field to select the index number that identifies the column in the array of structure. For


     example, Os Manufacturer is a primitive character field and therefore doesn't need to
     identify an array of structure index.
 10. Click Save.

How to map the CI attribute to a Web Service field

The integration uses an adapter to transform UCMDB CI attributes to web services objects
recognized by Service Manager. The adapter in turn specifies what XSL transformation files
the integration should use to convert UCMDB queries into properly formatted Service Manager
web services messages.

Out-of-the-box, each integration query has a corresponding XSL transformation file that maps
to a particular CI type in UCMDB. In addition, each attribute for which you enabled calculation
requires its own entry in the XSL transformation file. Without an XSL transformation entry,
Service Manager can't receive any CI attribute updates from your UCMDB system.

If you want to add a new attribute to the integration, you must edit the XSL transformation file
for the parent CI type and add an entry for the CI attribute. For information about which CI
types each query manages, see Queries for push. In order to create a proper XSL mapping,
you must be familiar with the service and object names Service Manager publishes as web
services. For information on publishing tables and columns as web service objects, see
Service Manager Web Services available from the Service Manager help.

The following steps illustrate how to map a UCMDB CI attribute called host_vendor to a Service
Manager web service object called OSVendor.

To map a CI attribute to a web service field:

   1. Sign in to UCMDB as an administrator.
   2. Navigate to Data Flow Management > Adapter Management >

     ServiceManagerAdapter9.41 > Configuration Files.
   3. Double-click the XSL transformation file that manages the parent CI type of your CI

     attribute. For example, open computer_push.xslt to add an attribute to the SM Computer
     Push query.
   4. Find the element that defines the Service Manager table name where the integration will
     store CI attribute values. For example, the element <file.device> will store CI attributes
     in the Service Manager device table.

   5. Within the table naming element (<file.device>), you will see an element of the following
     format that defines how to transform each UCMDB CI attribute into a web service object:

          <xsl:for-each select="@CI_attribute_name">

               <SMAttributeName><xsl:value-of select="."/></SMAttributeName>

          </xsl:for-each>

      @CI_attribute_name is the name of attribute in the UCMDB system.


SMAttributeName is the name of a web service attribute published by the Service
Manager system.

            Caution

           The web service attribute name is case-sensitive.

CI attributes in the computer_push.xslt XSL transformation file are illustrated in the
following screenshot:

CI attributes in the sm_node_attributes.xslt XSL transformation file are illustrated in the
following screenshot:


Matching CI attributes in the ucmdbNode web service are illustrated in the following
screenshot:

To push a custom string list value (the attribute type is string_list ) from UCMDB to an
array field in SM, you need to add the following line to web service expressions.


      $L.void=jscall("discoveryEvent.formatUcmdbStringList", $L.file, "sm
      field name")

6. Copy an existing XSL transformation element to use it as a template to create a new
  transformation entry.

7. Paste the new XSL transformation element within the proper table naming element. For
  example, <file.node> .

8. Update the CI attribute name and web service object name within the new element to
  match the attribute you want to add to the integration. For example, create the following
  XSL transformation element to add an attribute to the integration.

      <xsl:for-each select="@os_vendor">
      <OSVendor><xsl:value-of select="."/></OSVendor>
      </xsl:for-each>

  New attribute in the computer_push.xslt XSL transformation file is illustrated in the
  following screenshot:


9. Save the XSL transformation file.

               Note

             When you create/edit and then save a configuration file in Adapter
             Management, UCMDB automatically restarts the adapter with the new
             configuration file.
````
