---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.6.2.2.7 .. 1.6.2.3.3
printed_pages: 978-1013
---

# 1.6.2.2.7 Federating Service Manager Ticket Data to UCMDB

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.6.2.2.7. Federating Service Manager Ticket
Data to UCMDB

Federation doesn't physically copy data from Service Manager (SM) to UCMDB; it only
retrieves SM data for displaying in UCMDB. Out-of-the-box, the UCMDB-SM integration
supports federation for the following external CI types in UCMDB: Incident, Problem,
RequestForChange, and ChangeTask. If you have enabled these CI types for federation when
creating your integration point, in UCMDB you can retrieve Incident, Problem, Change, and
Change Task record data from SM.

Out-of-the-box, each of the CI types (Incident, Problem, Change, and Change Task) supports
federation of a subset of their attributes in Service Manager; however, the integration can
federate more attributes if tailored as such.

This section includes:

     Federation Queries
     Examples of Using Federation
     How to Add an Attribute of a Supported CI Type for Federation


1.6.2.2.7.1. Federation Queries

Federation uses queries to determine what data to retrieve from Service Manager. To retrieve
specific ticket data from Service Manager, you need to create a TQL query first.

The ServiceManagerEnhancedGenericAdapter9-x provides a bunch of sample federation
queries, which you can use as a reference. They are available from the following path in
UCMDB: Modeling > Modeling Studio > Resources > Integration > Service Manager
> Federation.


1.6.2.2.7.2. Examples of using federation

You can use the federation feature in many different ways. The following are only examples of
using the feature:

Example 1: Federate all SM Incident tickets

This example illustrates how you retrieve information of all Incident records that exist in Service
Manager.

   1. Sign in to UCMDB as an administrator.
   2. Navigate to Modeling > Modeling Studio > Resources.
   3. For Resource Type, select Queries from the list.
   4. Click New > Query.

   5. On the CI Types tab, navigate to ItProcessRecord > Incident, and drag it to the query
     pane on the right side.

6. Specify Service Manager as the data source for the Incident query node.
     1. Select the Incident query node, click the Data Sources tab on the lower right pane,
        and then click Edit.

     2. Select the Select integration points option, and then select your integration point
        name (for example, sm_integration). Click OK.


7. Click the Save icon , and then type a query name and select a location in which to
  save the query (for example, select the Root folder).

8. Select the Incident query node, and then click the Calculate Query Result Count icon
  .

  UCMDB returns the query result count. For example, the following figure shows that there
  are a total of 116 Incident records in Service Manager.


9. Right-click the Incident query node, and select Show Element Instances. UCMDB
  displays a list of all Incident records that exist in Service Manager.

10. Select an Incident record from the list, and click the Properties icon to view its
    details.


Example 2: Federate SM Incident records that affect a
UCMDB Business Service CI

The following example illustrates how to federate a list of Service Manager Incident records
whose Affected Service or Affected CI field contains a UCMDB Business Service CI.

In this example, IM10005 in SM has an affected service named bizservice1, which was pushed
from UCMDB.

   1. Sign in to UCMDB as an administrator.
   2. Navigate to Modeling > Modeling Studio > Resources.
   3. For Resource Type, select Queries from the list.
   4. Click New > Query.

   5. On the CI Type tab, navigate to ConfigurationItem > BusinessElement > Service >
     BusinessService, and drag it to the query pane on the right side.


6. Navigate to ItProcessRecord > Incident, and drag the icon to the query pane.

7. Click the Create Relationship icon .
8. Select the Incident query node, and drag the arrow from this node to the BusinessService

  node to create a regular relationship between the nodes.
     1. Select Regular Relationship, and click OK.
     2. Select Membership, and optionally enter a relationship name (for example,
        Membership). Click OK.


9. Specify UCMDB as the data source for the BusinessService query node. To do this, follow
  these steps:
     1. Select the BusinessService query node.
     2. On the lower right pane, click the Data Sources tab and then click Edit.

     3. Make sure that the Local data source (UCMDB only) option is selected.


       4. Click OK.

10. Repeat the steps above to specify your integration point as the data source for the
    Incident query node (for example, sm_integration).


11. Click the Calculate Query Result Count icon . The number of SM Incidents and the
    number of their affected UCMDB Business Service CIs are displayed.

 12. Click the Preview icon to view the query results .  Page 987 of 1727

This PDF was generated on May 23, 2026

13. Select each SM Incident record from either the CI Selector pane or the query pane, and
    click the Properties icon to view its details .

14. Select each UCMDB CI record from the CI Selector pane, and click the Properties icon to
    view its details.

Example 3: Federate Incident, Change, and Problem
record data from Service Manager for UCMDB CIs


The following example illustrates how to retrieve information of Incident, Change and Problem
records in Service Manager that affect a UCMDB Business Service CI.

   1. Sign in to UCMDB as an administrator.
   2. Navigate to Modeling > Modeling Studio > Resources.
   3. For Resource Type, select Queries from the list.
   4. Click New > Query.
   5. On the CI Type tab, go to ConfigurationItem > BusinessElement > Service >

     BusinessService, and drag it to the query pane on the right side.
   6. Go to ItProcessRecord, and drag Incident, Problem, and RequestForChange to the

     query pane.

   7. Click the Create Relationship icon to create regular relationships between the
     BusinessService node and the other nodes, as shown in the following figure.

 8. Select each node and click the Data Sources tab to specify a data source for each node.
       1. For the BusinessService node, specify UCMDB as the data source.
       2. For the Incident, Problem, and RequestForChange nodes, specify your integration
          point as the data source (sm_integration in this example).

 9. Save the query.
10. Optionally, edit the BusinessService node properties as needed.

       1. Select the BusinessServic node, and click Edit on the lower right pane.

       2. Click the Cardinality tab. The default Cardinality setting is displayed.

3. If you wish, change either or both of the AND operators to OR. This will change the
  filter criteria and therefore the query results.


11. Click the Preview icon to view the query results.

 12. Select each SM Incident record from either the CI Selector pane or the query pane, and
     click the Properties icon to view its details.

 13. Select each UCMDB CI record from either the CI Selector pane or the query pane, and on
     the Related CIs tab click Show Related CIs to view its related CIs in both SM and UCMDB.

Example 4: Retrieve Service Manager records related to a
UCMDB CI

The following example illustrates how to retrieve Service Manager records related to a UCMDB
CI by using the Get Related CIs functionality.

   1. Sign in to UCMDB as an administrator.
   2. Navigate to Modeling > IT Universe Manager.

   3. On the Search CIs tab, search for a UCMDB CI that has related records in Service
     Manager. For example, enter bizservice1 in the CI Name field, click Search, and then
     double-click the CI to open it.


4. If the Get Related CIs pane is not displayed, click the Show Get Related CIs pane icon
  .

5. Click the Select target Integration Points for related CIs icon .
6. Select the Select integration points option, and then select both UCMDB and your

  integration point. Click OK.

7. Click Show Related CIs. The CI’s related SM records and UCMDB CIs are displayed.

8. Select each SM record from the query pane, and click the Properties icon to view its
  details.



1.6.2.3. Multi-tenancy (Multi-company) setup

The UCMDB-SM Integration supports a multi-tenancy configuration in which both the Service
Manager and UCMDB systems track Configuration Items (CIs) and Configuration Item
Relationships (CIRs) by company ID. In a multi-tenancy configuration, you can tailor the
integration so that each tenant only sees and works with the CIs and CIRs that match their
company ID. Multi-tenancy is intended for managed service providers (MSPs) who wish to
offer Configuration Management as a service to multiple tenants.
Multi-tenancy (Multi-company) support
Implementing multi-tenancy in the UCMDB-SM integration
Mandanten SM security layer
What multi-tenant information is stored in UCMDB
What multi-tenant information is stored in Service Manager
Synchronization of company records
Tenant-specific Discovery Event Manager (DEM) rules
Multi-tenancy requirements
Setting up the multi-tenancy integration in UCMDB
How to install a separate data flow probe for each tenant
How to start tenant-specific data flow probes
How to configure IP ranges for tenant-specific data flow probes
Setting up the multi-tenancy integration in Service Manager
How to start the schedule process
How to configure the Service Manager system information record
How to add tenant-specific UCMDB user ID and password values
How to add UCMDB customer ID values to existing companies
How to synchronize existing companies from Service Manager to UCMDB
How to view whether company information is in UCMDB
How to resynchronize an existing company with UCMDB
How to inactivate a synchronized company
How to reactivate an inactive company
How to add tenant-specific DEM rules


1.6.2.3.1. Multi-tenancy (Multi-company)
support

Multi-tenancy is when a single instance of software runs on a server, serving multiple client
organizations (also referred to as tenants). Multi-tenancy contrasts with a multi-instance
architecture where separate software instances or hardware systems are set up for different
client organizations.
When implementing a multi-tenant architecture, a software application is designed to virtually
partition its data and configuration so that each client organization works with a customized
virtual application instance. The following figure illustrates an example multi-tenant integration
deployment.

Every tenant configured in UCMDB works with the relevant tenant in SM. If UCMDB did not
configure tenants, the tenant configuration must be activated in order to transfer the
configuration from SM to UCMDB automatically. This function is performed once only by the
system administrator.
In the event that UCMDB tenant configuration already exists and the SM configuration doesn't
exist, SM tenants must be manually configured according to the UCMDB configuration.


1.6.2.3.1.1. Implementing multi-tenancy in the
UCMDB-SM integration

SM stores the company records that describe each tenant in the multi-tenant configuration.
The Service Manager system is the definitive source for company records and pushes all new
company IDs to the UCMDB system creating the equivalent entity in UCMDB.
SM tracks the company ID of each CI and relationship in a multi-tenant configuration. CI
records inherit the company ID of the UCMDB feeder that discovered them. Relationship
records inherit the company ID of the parent CI in the relationship.


1.6.2.3.1.2. Mandanten SM security layer

Mandanten is an SM software layer that's used to filter the customer ID from the CI
information. SM uses the Mandanten to ensure that operators only see CI and relationship
records where the CI's company ID matches the operator's company ID. If the view is
restricted with Mandanten, then Service Manager also restricts the view to all other related
records such as change requests and incidents.


1.6.2.3.1.3. What multi-tenant Information is
stored in UCMDB

Your UCMDB system stores a company ID attribute for each CI and CIR. The company ID
determines what adapter and synchronization schedule your UCMDB system uses to update CI
data. Each CI and relationship record can only have one company ID. The UCMDB system
obtains a company ID from the Service Manager system.

If more than one tenant (company) shares the same CI, each tenant has their own unique CI
record describing the CI. In effect, the UCMDB system creates multiple CI records to track one
managed asset. Each tenant’s CI record is unique to that tenant and lists the company's unique
company ID.


1.6.2.3.1.4. What multi-tenant information is
stored in Service Manager

Your Service Manager stores the company records that describe each tenant in the multi-
tenant configuration. The Service Manager system is the definitive source of company IDs and
pushes new and updated information to your UCMDB system.

Service Manager tracks the company ID of each CI and relationship in a multi-tenant
configuration. CI records inherit the company ID of the UCMDB feeder that discovered them.
Relationship records inherit the company ID of the parent CI in the relationship.

In a best practices implementation, Service Manager uses Mandanten to ensure that operators
only see CI and relationship records where the CI’s company ID matches the operator’s
company ID. If you restrict the view with Mandanten, then Service Manager also restricts the
view to all other related records such as change requests and incidents.


1.6.2.3.1.5. Synchronization of company
records

If your system meets all the conditions for multi-tenancy support, Service Manager creates a
schedule record to push the company ID of the company record to your UCMDB system.
Service Manager uses the following rules to determine whether to push the company ID to
your UCMDB system.


            Conditions where Service Manager synchronizes company ID with UCMDB

Conditions                              Tenant information  Schedule record created
                                        synchronized?       and action taken in UCMDB

                            Yes                             Synch Company with
UCMDB-SM                                                    UCMDB - <UCMDB
integration enabled                                         Company ID>
Multi-company mode
enabled in Service                                               Add new company ID
Manager
You create a new
company record in
Service Manager

                            Yes                             Synch Company with
UCMDB-SM                                                    UCMDB - <UCMDB
integration enabled                                         Company ID>
You update an existing
company record that                                              Add new company ID
has not been
synchronized with
UCMDB
Multi-company mode
enabled in Service
Manager

                            Yes                             Inactivate Company with
UCMDB-SM                                                    UCMDB - <UCMDB
integration enabled                                         Company ID>
Multi-company mode
enabled in Service                                               Inactivate existing
Manager                                                          company ID
You disable the option
to show a company in
multi-company lists on
a company
synchronized with
UCMDB

Conditions                              Tenant information                          Service Manager 9.81
                                        synchronized?
                                                            Schedule record created
                            Yes                             and action taken in UCMDB
UCMDB-SM                                                    Synch Company with
integration enabled                                         UCMDB - <UCMDB
Multi-company mode                                          Company ID>
enabled in Service
Manager                                                          Add new company ID
You select the option
to resynchronize with                                       Synch Company with
UCMDB on an existing                                        UCMDB - <UCMDB
company record                                              Company ID>

                            Yes                                  Reactivate company ID
UCMDB-SM
integration enabled                                         None
Multi-company mode
enabled in Service
Manager
You enable the option
to show a company in
multi-company lists for
an inactivated
company

                            No
UCMDB-SM
integration disabled
Multi-company mode
enabled in Service
Manager
You update an existing
company record that
has already been
synchronized with
UCMDB


Conditions                              Tenant information  Schedule record created
                                        synchronized?       and action taken in UCMDB
     UCMDB-SM
     integration disabled               No                  None
     Multi-company mode
     enabled in Service
     Manager
     You create a new
     company record in
     Service Manager

UCMDB-SM                                No                  None

integration enabled

Multi-company mode

enabled in Service

Manager

You disable the option

to show a company in

multi-company lists on

a company not

synchronized with

UCMDB

UCMDB-SM                                No                  None

integration enabled

Multi-company mode

disabled in Service

Manager

You create a new

company record in

Service Manager

UCMDB Customer ID

When you enable the multi-tenancy integration, Service Manager displays a new field in each
company record called UCMDB Customer ID. In order to synchronize a company record with
UCMDB, you must first provide a value for this field. After you provide a UCMDB Customer ID
value this field becomes read-only. You can't change a company's UCMDB Customer ID after
you set it.


This field only accepts numeric data up to ten characters long. Service Manager requires the
field value to be a unique positive whole number. You can't enter duplicate values or use
decimals, negative numbers, or zero.

Your UCMDB system automatically uses the UCMDB customer ID of 1 when running in single
tenant mode. You can reuse this default value in your multi-tenant implementation by assigning
a Service Manager company to have this UCMDB customer ID value. Out-of-the-box, no
Service Manager company has the UCMDB customer ID of 1.

UCMDB User ID and Password

When you enable the multi-tenancy integration, Service Manager displays two new fields in
each company record called UCMDB UserId and UCMDB Password. These fields allow you to
specify the connection information you want Service Manager to use when requesting
information for the Actual State section. Any user name and password you enter in these fields
must be valid for your UCMDB system.

The user name and password you provide in the Company Information record takes
precedence over the user name and password you provide in the System Information record.
This allows managed service providers to control access to the UCMDB system on a tenant-
by-tenant basis. If you don't provide a company-specific UCMDB user name and password,
Service Manager uses the credentials you provided in the System Information record.

Company Code

The multi-tenancy integration requires that each company record has a unique Company Code
(company field) value. Since Company Code is a required field, your existing company records
should already have Company Code values. However, you should ensure that each company
record has a unique Company Code value.

When using Service Manager Enhanced Generic Adapter for UCMDB-SM integration, you must
define your company codes in the
ServiceManagerEnhancedAdapter9.41/mappings/scripts/SMUtils.groovy file using the
following format (where a comma is used to separate mapping entries):

  ["<UCMDB Company 1 Code>":"<SM Company 1 Code>", "<UCMDB Company 2

  Code>":"<SM Company 2 Code>"]

For example: ["1":"microfocus", "2":"sap"]

            Caution

           You should not change the Company Code value after you have enabled the multi-
           tenancy integration because this will cause your Service Manager data to become
           out of synch.

CI Reconciliation Rules


CIs that are pushed from UCMDB are identified only by their global.id value in UCMDB. By
default, only the ucmdb.id field in the device table is used in CI reconciliation (the company.id
field is not used).

You can add reconciliation rules manually through Tailoring > Web Services > DEM
Reconciliation Rules. For details, see How to add DEM Reconciliation Rules.

Company information pushed to CI and CI relationship
records

When you enable the multi-tenancy integration, Service Manager inserts the SM Company
Code value in CI and relationship records during data push. Service Manager uses the UCMDB
Customer ID to look up the matching SM Company Code value.

Company information replicated to Incident records

When you enable the multi-tenancy integration and select the option to create incidents when
UCMDB discovers new, updated, or deleted CIs, Service Manager inserts the SM Company
Code value in the incident record during replication. Service Manager uses the UCMDB
Customer ID to look up the matching SM Company Code value.

Schedule records

Service Manager uses the problem schedule process to manage the synchronization of
company IDs to your UCMDB system. You can manually enable the problem schedule process
from the System Status form.

When the synchronization criteria are met as described in Table Conditions where Service
Manager synchronizes company ID with UCMDB, Service Manager creates a “Synch Company
with UCMDB - <UCMDB Company ID>” schedule record (for example, “Synch Company with
UCMDB - 1234567890”). If you inactivate a company, Service Manager creates an “Inactivate
Company with UCMDB - <UCMDB Company ID>” schedule record (for example, “Inactivate
Company with UCMDB - 1234567890”). The problem schedule process processes the new
schedule record on the next background process iteration.

If your Service Manager system can't connect to your UCMDB system for some reason, it will
reschedule the company synchronization at the next scheduled interval (the out-of-the-box
interval is 5 minutes). The problem schedule process updates the schedule record with the
status rescheduled. If the Service Manager system receives any other error message while
connecting to the UCMDB system, it updates the schedule record with the status “application
failed due to error - check msglog for possible messages.”


1.6.2.3.1.6. Tenant-specific Discovery Event
Manager (DEM) rules

You can implement the condition field function in order to create SM DEM rules that are
specific to a particular tenant in a multi-tenancy UCMDB-SM integration.

Tenant rules vary according to SM tenant configuration requirements, for each record
information type pushed from UCMDB to SM different tenants can configure different DEM
tenant rules.

Each tenant can have its own set of unique requirements and therefore may implement
different processes through the integration.

One tenant may require the addition of CIs directly to SM while another tenant may require
opening changes for each CI.

The following table shows a sample set of DEM rules that illustrate how to accomplish this.

DEM rule ID                                   Tenant-specific DEM rules  Condition

                                        Action on new CI

ucmdbNode_advantage                     Add CI                           company in
                                                                         $L.file=”advantage”

ucmdbNode_hp                            Create change                    company in $L.file=”HP”

            Note

           When creating DEM rules, be sure to create separate DEM rules for each tenant.

Multi-tenancy use cases

The following table describes the necessary actions to perform in various deployment
situations to address multi-tenancy issues.


Deployment Integration Type             Multi-tenancy use cases

                                                   Description

UCMDB with multi-tenancy rules          When implementing a UCMDB-SM
SM without multi-tenancy rules          deployment that has existing multi-tenancy
                                        rules in UCMDB and doesn't have multi-
                                        tenancy rules configured in SM, the user
                                        creates multi-tenancy rules in SM manually
                                        and according to the rules in UCMDB.

SM with multi-tenancy rules             When implementing a UCMDB-SM
UCMDB without multi-tenancy rules       deployment that has existing multi-tenancy
                                        rules in configured SM and doesn't have
                                        multi-tenancy rules configured in UCMDB,
                                        the user creates multi-tenancy rules in
                                        UCMDB manually as well as according to
                                        the rules previously configured in SM.

UCMDB without multi-tenancy rules       When implementing a UCMDB-SM
SM without multi-tenancy rules          deployment that doesn't have multi-tenancy
                                        rules configured in UCMDB or in SM, the
                                        user configures the rules in SM.

                                        During the configuration process using the
                                        SM multi-tenancy wizard, the user can
                                        create a corresponding tenancy
                                        configuration in UCMDB. By creating
                                        corresponding tenancy configurations in
                                        SM the user also creates a corresponding
                                        tenant in UCMDB.


1.6.2.3.2. Multi-tenancy requirements

Your system must meet the following requirements in order for the integration to support multi-
tenancy.

     Integration enabled between UCMDB and Service Manager
     Multi-company mode enabled on the Service Manager system
     Problem schedule process running on the Service Manager system

For additional information about the multi-tenancy integration, you can visit Software Support
Online or refer to the Service Manager Help Center.


1.6.2.3.3. Setting up the multi-tenancy
integration in UCMDB

You need to perform the following tasks in UCMDB to set up the multi-tenancy integration.
   1. Install a separate data flow probe for each tenant the integration will support.
     See How to install a separate data flow probe for each tenant.
   2. Start tenant-specific data flow probes.
     See How to start tenant-specific data flow probes.
   3. Configure IP address ranges for tenant-specific data flow probes.
     See How to configure IP ranges for tenant-specific data flow probes.

            Caution

           Multi-tenancy is unsupported for population when the integration uses the Service
           Manager Enhanced Generic Adapter.


1.6.2.3.3.1. How to install a separate data flow
probe for each tenant

If you plan to support a multi-tenant configuration, you must install a separate data probe for
each tenant. Out-of-the-box, the UCMDB installer only installs one data flow probe and
service.

To install additional data flow probes and start them from your operating system command
prompt:

   1. Sign in to the host of your UCMDB system as an administrator.
   2. Insert the Universal CMDB Setup Windows DVD into the system disc drive.
   3. Start the Data Flow Probe installer (HPUCMDB_DataFlowProbe_x.xx.exe).

   4. Follow the on-screen instructions to complete the wizard, but use the following values for
     each data flow probe you wish to install.

        1. Type a unique path for each installation folder.
        2. Use the same UCMDB application server address for each data flow probe.
        3. Type a valid data flow probe address.
        4. Type a unique name for each data flow probe identifier.
        5. Create a unique customer Data Flow Probe domain for each probe (Clear the Use

           Default CMDB Domain option).
        6. Use the same probe gateway and probe manager settings for each probe (for

           example, use combined or separate processes).

     See the Universal CMDB Deployment Guide for complete installation instructions.

  5. Repeat step 3 and step 4 for each data flow probe you wish to install.
   6. Open the probe’s DiscoveryProbe.properties file in a text editor. By default, this file is

     located in the following folder:

      <UCMDB installation folder>\<data flow probe installation folder>\conf

     For example, C:\UCMDB\DataFlowProbe\conf .

                   Note

                The <data flow probe installation folder> must be unique for each tenant.

   7. Edit the following properties in the configuration file.

Property                                                                                                                           Service Manager 9.81
serverName
customerId                              Discovery Probe properties set for each tenant

                                                            Value
                                                            Verify the name of the UCMDB server

                                                            Type the customer ID for the tenant this
                                                            data flow probe supports

appilog.collectors.probe.name           Verify the probe name is unique such as
                                        server + tenant ID

applilog.collectors.domain              Verify the domain name of the data flow
                                        probe
appilog.collectors.local.ip
appilog.collectors.probe.ip             Verify the data flow probe gateway name
appilog.collectors.rmi.port
appilog.collectors.rmi.gw.port          Verify the data flow probe manager name
.port
.port                                   Type a unique port for each probe

appilog.collectors.ProbeUseSpecific     Type a unique port for each probe
RMIPortFrom
                                        Type a unique port for each probe

                                        Type a unique port for each probe

                                        Type a unique port for each probe or
                                        type 0 to have the system automatically
                                        select it

appilog.collectors.bigBrother.port      Type a unique port for each probe

8. Save the configuration file.
9. Repeat step 6 to step 8 for the data flow probe of each tenant.


1.6.2.3.3.2. How to start tenant-specific data
flow probes

To start tenant-specific data flow probes:
   1. Open the OS command prompt and navigate to the probe’s bin folder. For example,
      C:\UCMDB\DataFlowProbe1\bin .
   2. Type gateway console.
  3. Repeat step 1 to step 2 for each data flow probe you want to start.


1.6.2.3.3.3. How to configure IP ranges for
tenant-specific data flow probes

To configure IP ranges for tenant-specific data flow probes:
   1. Sign in to UCMDB as an administrator using the company ID of the tenant whose data
     flow probe you want to configure.
   2. Navigate to Data Flow Management > Data Flow Probe Setup.
   3. Expand the data flow probe domain containing the probe you want to start. For example,
     Customer2.
   4. Expand the Probe node and select the data flow probe you want to start. For example,
     Probe2Customer2.

   5. Click the Add IP range icon .
   6. Type an IP range you want the Data Flow Probe to scan. Optionally, add any IP ranges you

     want to exclude.
   7. Click OK to save the IP range.
  8. Continue to follow step 1 to step 7 for each data flow probe you want to configure.
````
