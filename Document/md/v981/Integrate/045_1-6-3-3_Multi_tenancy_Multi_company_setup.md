---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.6.3.3 .. 1.6.3.3
printed_pages: 1231-1252
---

# 1.6.3.3 Multi-tenancy (Multi-company) setup

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.6.3.3. Multi-tenancy (Multi-company) setup

The UCMDB-SM Integration supports a multi-tenancy configuration in which both the Service
Manager and UCMDB systems track Configuration Items (CIs) and Configuration Item
Relationships (CIRs) by company ID. In a multi-tenancy configuration, you can tailor the
integration so that each tenant only sees and works with the CIs and CIRs that match their
company ID. Multi-tenancy is intended for managed service providers (MSPs) who wish to
offer Configuration Management as a service to multiple tenants.
Multi-tenancy (Multi-company) support
Multi-tenancy requirements
Setting up the multi-tenancy integration in UCMDB
Setting up the multi-tenancy integration in Service Manager


1.6.3.3.1. Multi-tenancy (Multi-company)
support

Multi-tenancy is when a single instance of software runs on a server, serving multiple client
organizations (also referred to as tenants).
Multi-tenancy is contrasted with a multi-instance architecture where separate software
instances or hardware systems are set up for different client organizations.
When implementing a multi-tenant architecture, a software application is designed to virtually
partition its data and configuration so that each client organization works with a customized
virtual application instance. The following figure illustrates an example of multi-tenant
integration deployment.

Explanation
Every tenant configured in UCMDB works with the relevant tenant in SM. If UCMDB did not
configure tenants, the tenant configuration must be activated in order to transfer the
configuration from SM to UCMDB automatically. This function is performed once only by the
system administrator.
In the event that UCMDB tenant configuration already exists and the SM configuration doesn't
exist, SM tenant must be manually configured according to the UCMDB configuration.


1.6.3.3.1.1. Implementing multi-tenancy in the
UCMDB-SM integration

SM stores the company records that describe each tenant in the multi-tenant configuration.
The Service Manager system is the definitive source for company records and pushes all new
company IDs to the UCMDB system creating the equivalent entity in UCMDB.
SM tracks the company ID of each CI and relationship in a multi-tenant configuration. CI
records inherit the company ID of the UCMDB feeder that discovered them. Relationship
records inherit the company ID of the parent CI in the relationship.


1.6.3.3.1.2. Mandanten SM security layer

Mandanten is an SM software layer that's used to filter the customer ID from the CI
information. SM uses the Mandanten to ensure that operators only see CI and relationship
records where the CI's company ID matches the operator's company ID. If the view is
restricted with Mandanten, then Service Manager also restricts the view to all other related
records such as change requests and incidents.


1.6.3.3.1.3. What multi-tenant Information is
stored in UCMDB

Your UCMDB system stores a company ID attribute for each CI and CIR. The company ID
determines what adapter and synchronization schedule your UCMDB system uses to update CI
data. Each CI and relationship record can only have one company ID. The UCMDB system
obtains a company ID from the Service Manager system.

If more than one tenant (company) shares the same CI, each tenant has their own unique CI
record describing the CI. In effect, the UCMDB system creates multiple CI records to track one
managed asset. Each tenant’s CI record is unique to that tenant and lists the company's unique
company ID.


1.6.3.3.1.4. What multi-tenant information is
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


1.6.3.3.1.5. Synchronization of company
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
     UCMDB-SM                                               None
     integration disabled               No
     Multi-company mode                                     None
     enabled in Service
     Manager                                                None
     You create a new
     company record in
     Service Manager

                            No
UCMDB-SM
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

                            No
UCMDB-SM
integration enabled
Multi-company mode
disabled in Service
Manager
You create a new
company record in
Service Manager

UCMDB customer ID

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

UCMDB user ID and password

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

Company code

The multi-tenancy integration requires that each company record has a unique Company Code
(company field) value. Since Company Code is a required field, your existing company records
should already have Company Code values. However you should ensure that each company
record has a unique Company Code value.

            Caution

           You should not change the Company Code value after you have enabled the multi-
           tenancy integration because this will cause your Service Manager data to become
           out of synch.

CI reconciliation rules

CIs that are pushed from UCMDB are identified only by their global.id value in UCMDB. By
default, only the ucmdb.id field in the device table is used in CI reconciliation (the company.id
field is not used).

You can add reconciliation rules manually through Tailoring > Web Services > DEM
Reconciliation Rules. For details, see How to add DEM reconciliation rules.

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

Service Manager uses the problem schedule processor to manage the synchronization of
company IDs to your UCMDB system. You can manually enable the problem schedule
processor from the System Status form.

When the synchronization criteria are met as described in Table Conditions where Service
Manager synchronizes company ID with UCMDB, Service Manager creates a “Synch Company
with UCMDB - <UCMDB Company ID>” schedule record (for example, “Synch Company with
UCMDB - 1234567890”). If you inactivate a company, Service Manager creates a “Inactivate
Company with UCMDB - <UCMDB Company ID>” schedule record (for example, “Inactivate
Company with UCMDB - 1234567890”). The problem schedule processor processes the new
schedule record on the next background process iteration.

If your Service Manager system can't connect to your UCMDB system for some reason, it will
reschedule the company synchronization at the next scheduled interval (the out-box interval is
5 minutes). The problem schedule processor updates the schedule record with the status
rescheduled. If the Service Manager system receives any other error message while
connecting to the UCMDB system, it updates the schedule record with the status “application
failed due to error - check msglog for possible messages.”


1.6.3.3.1.6. Tenant-specific Discovery Event
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

Multi-tenancy functional use cases

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


1.6.3.3.2. Multi-tenancy requirements

Your system must meet the following requirements in order for the integration to support multi-
tenancy.

     Integration enabled between UCMDB and Service Manager
     Multi-company mode enabled on the Service Manager system
     Problem schedule process running on the Service Manager system

For additional information about the multi-tenancy integration, you can visit Software Support
Online or refer to the Service Manager Help Center.


1.6.3.3.3. Setting up the multi-tenancy
integration in UCMDB

You need to perform the following tasks in UCMDB to set up the multi-tenancy integration.

   1. Install a separate data flow probe for each tenant the integration will support.

     See How to install separate data flow probes for each tenant below.

   2. Start tenant-specific data flow probes.

     See How to start tenant-specific data flow probes below.

   3. Configure IP address ranges for tenant-specific data flow probes.

     See How to configure IP ranges for tenant-specific data flow probes below.

   4. Configure multi-tenancy for population.

     See How to configure multi-tenancy for population below.

How to install separate data flow probes for each tenant

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


6. Open the probe's DiscoveryProbe.properties file in a text editor. By default, this file is
  located in the following folder:
   <UCMDB installation folder>\<data flow probe installation folder>\conf
  For example, C:\UCMDB\DataFlowProbe\conf .

               Note

             The <data flow probe installation folder> must be unique for each tenant.

7. Edit the following properties in the configuration file.

Property                                Discovery Probe properties set for each tenant

                                                            Value

serverName                              Verify the name of the UCMDB server

customerId                              Type the customer ID for the tenant this
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
  9. Repeat step 6 to step 8 for each tenant's data flow probe.

How to start tenant-specific data flow probes

To start tenant-specific data flow probes:

   1. Open the OS command prompt and navigate to the probe's bin folder. For example,
      C:\UCMDB\DataFlowProbe1\bin .

   2. Type gateway console.
  3. Repeat step 1 to step 2 for each data flow probe you want to start.

How to configure IP ranges for tenant-specific data flow
probes

To configure IP ranges for tenant-specific data flow probes:

   1. Sign in to UCMDB as an administrator using the company ID of the tenant whose data
     flow probe you want to configure.

   2. Navigate to Data Flow Management > Data Flow Probe Setup.
   3. Expand the data flow probe domain containing the probe you want to start. For example,

     Customer2.

   4. Expand the Probe node and select the data flow probe you want to start. For example,
     Probe2Customer2.

   5. Click the Add IP range button .
   6. Type an IP range you want the Data Flow Probe to scan. Optionally, add any IP ranges you

     want to exclude.
   7. Click OK to save the IP range.
   8. Repeat step 1 to step 7 for each data flow probe you want to configure.

How to configure multi-tenancy for population

To support multi-tenancy for population, you need to configure the basicQueryCondition
setting for each query defined in the population configuration file ( smPopConfFile.xml ).

To configure multi-tenancy for population:

   1. Sign in to UCMDB as an administrator.
   2. Navigate to Data Flow Management > Adapter Management >

     ServiceManagerAdapter9.41 > Configuration Files.


3. Click the smPopConfFile.xml file.
4. For each query defined in this file, update the basicQueryCondition setting by adding the

  following:
   and company= &quot;{customerId}&quot;
  For example:
   basicQueryCondition="type=&quot;bizservice&quot;and company= &quot;
  {customerId}&quot;"
5. Save the configuration file.

               Note

             When you create or edit and then save a configuration file in Adapter
             Management, UCMDB automatically restarts the adapter with the new
             configuration file.


1.6.3.3.4. Setting up the multi-tenancy
integration in Service Manager

You need to perform the following tasks in Service Manager to set up the multi-tenancy
integration.
Multi-tenancy support is an optional feature of the integration intended for Managed Service
Providers (MSPs) who want to offer Configuration Management as a service to their tenants. In
a multi-tenancy configuration, each CI and CIR record has a corresponding company ID. Out-
of-the-box, Service Manager allows all operators to view CI data regardless of the company ID.
If you wish to restrict access to CI data by company ID, you must enable Mandanten and use
the company ID field as a restricting query. See the Service Manager help for more information
about multi-company mode and Mandanten.
You must complete the following tasks from your Service Manager system to enable multi-
tenancy support for the integration.

   1. Start the process schedule.
     See How to start the process schedule.

   2. Configure the Service Manager System Information Record and Integration Manager.
     See How to configure the Service Manager System Information Record and Integration
     Manager.

   3. Add tenant-specific UCMDB ID and password values to company records (optional).
     See How to add tenant-specific UCMDB user ID and password values.

   4. Add UCMDB Customer ID values to existing company records.
     See How to add UCMDB customer ID values to existing companies.

   5. Synchronize existing company records with UCMDB.
     See How to synchronize existing companies from Service Manager to UCMDB.

   6. Verify that Service Manager synchronized company records with UCMDB (optional).
     See How to view whether company information is in UCMDB.

   7. Resynchronize existing company records with UCMDB (as needed).
     See How to resynchronize an existing Ccompany with UCMDB.

   8. Inactivate company records you don't want to be part of the integration (as needed).
     See How to inactivate a synchronized company.

   9. Reactivate inactive company records you want to be part of the integration (as needed).


    See How to reactivate an inactive company
10. Add tenant-specific DEM rules.

    See How to add tenant-specific DEM rules.
````
