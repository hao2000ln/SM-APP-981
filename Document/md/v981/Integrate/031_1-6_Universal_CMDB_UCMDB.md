---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.6 .. 1.6.1.4
printed_pages: 851-881
---

# 1.6 Universal CMDB (UCMDB)

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.6. Universal CMDB (UCMDB)

Universal CMDB (UCMDB) is a Configuration Management database for enterprise IT
organizations to capture, document, and store information about configuration items (CIs),
service dependencies, and relationships that support business services. When integrated with
a Service Manager system, Universal CMDB stores the actual state of CIs and CI relationships,
while the Service Manager system stores the expected or managed state of the CIs. Service
Manager tracks any change requests, baselines, and historical updates CIs in the Universal
CMDB.

The integration is on the basis of an integration adapter. The following sections describe how
to establish a connection between UCMDB and Service Manager. Hence, this integration
synchronizes configuration items (CIs) and CI relationships between the two systems and
triggers appropriate actions in Service Manager.


1.6.1. Introduction

This section provides an overview of the Universal CMDB (UCMDB) - Service Manager (SM)
integration (also referred to as the Universal CMDB (UCMDB) integration or UCMDB-SM
integration in the Service Manager documentation).
Who should read the SM-UCMDB integration Documentation
Supported adapters
Purpose of the integration
How CI information is synchronized between UCMDB and Service Manager
Discovery Event Manager (DEM)


1.6.1.1. Who should read the SM-UCMDB
integration documentation

The documentation is intended for a system implementer or system administrator who will be
establishing and maintaining a connection between the UCMDB and Service Manager systems.
The documentation assumes that you have administrative access to both systems.


1.6.1.2. Supported adapters

Service Manager can integrate with UCMDB through the following adapters:
     An XSLT-based adapter (ServiceManagerAdapter9.41)

                   Note

                This adapter is supported for UCMDB 10.01 or later.

     An enhanced generic adapter (ServiceManagerEnhancedAdapter9.41)

                   Note

                This adapter is based on the generic adapter framework introduced in
                UCMDB 10.20, and is therefore supported for UCMDB 10.20 or later only.


1.6.1.3. Purpose of the integration

An integration between Universal CMDB (UCMDB) and Service Manager enables you to share
information about the actual state of a configuration item (CI) between your UCMDB system
and a Service Manager system. CIs commonly include IT services, hardware, and software.
Any organization that wants to implement the best practices Configuration Management and
Change Management ITIL processes can use this integration to verify that CIs actually have the
attribute values the organization has agreed to support.

You can use this integration to automate the creation of Service Manager change or incident
records to update or roll back CIs that have unexpected attribute values. Service Manager
allows you to programmatically define what actions you want to take whenever a CI’s actual
state doesn't match the expected state as defined in the CI record.

The integration offers several different ways for users to view CI actual state information:

     By default, the integration automatically updates the managed fields of Service Manager
     CI records as part of the regular UCMDB synchronization schedule. You can choose the
     option to configure the integration to automatically create change or incident records
     instead.
     A Service Manager user can view the current actual state of a CI by looking at the Actual
     State section in the CI record. When you open the Actual State section, Service Manager
     makes a web services request to UCMDB and displays all CI attributes the request
     returns. Service Manager only makes the web service call when you open this section.
     A Service Manager user can use the View in UCMDB UI option to view the current CI
     attributes from UCMDB.


1.6.1.3.1. Supported use cases

This section describes use cases that are supported by the UCMDB-SM integration. The
supported use cases provide the core business processes that are enabled by the UCMDB-SM
integration.

The following main business use cases are supported by the UCMDB-SM integration:

     Planned Change: A change created in Service Manager (SM) through the formal SM
     change process.
     Unplanned Change: A change or incident that occurred in SM and doesn't conform to the
     formal SM change process.
     Retrieving SM Incident, Change, and Problem record information: The ability to view SM
     Incident, Change and Problem record information in UCMDB.
     Actual State: The ability for SM users to view the actual state of UCMDB CIs.
     View CIs in UCMDB: The ability for SM users to view SM CI information in UCMDB or in
     UCMDB UI.
     Primary CI History in UCMDB: The ability for SM users to view UCMDB change history of
     the primary CI of a Problem record in SM for root cause investigation.
     Support of Automated Service Modeling (ASM) in UCMDB Browser: The ability that
     enables the integration to push consumer-provider relationships that are automatically
     discovered by ASM to SM, and enables SM users to access the ASM functionality of
     UCMDB Browser.
     Centralized VI visualization and impact analysis: The ability for SM users to access,
     directly from the SM user interface, the CI Visualization and Impact Analysis
     functionalities of UCMDB Browser.

All of the use cases provide important capabilities that enable the user to perform ITIL (IT
Infrastructure Library) processes. The ITIL processes refer to a set of best practices that
define and outline how organizations should manage their IT.


1.6.1.3.1.1. Enabling ITIL processes

By activating CI push from UCMDB to SM the user facilitates ITIL processes such as Incident,
Problem and Change Management in SM.

SM utilizes the data pushed from UCMDB in the following modules:

     Incident Management: the Service Desk operator (SD Agent) selects the “Service” and
     the “Affected CI” for the specific Incident record.
     Problem Management: the SD agent selects the “Service” and the “Primary CI” for the
     specific Problem record.
     Change Management: the SD agent selects the “Service” and the “Affected CI(s)” for the
     specific Change record.

In each of the previously mentioned ITIL processes, SM utilizes CI information for Service,
Affected CIs and Primary CIs that all originate in UCMDB.


1.6.1.3.1.2. Managing planned Changes

The purpose of the “planned Change” use case is to provide IT organizations a formal process
by which changes to the IT infrastructure are introduced after thorough review and analysis.
This is performed according to the “Change Management” process defined in ITIL v3.

A “planned Change” is initiated by the SM user through the formal “Change Management”
process module in SM. This is followed by the actual change implementation.

The actual changes are discovered by a discovery tool such as DDMA, and then updated in
UCMDB and the relevant modifications are pushed to SM. Once the user has validated the
change, the user closes the relevant planned change in SM.


1.6.1.3.1.3. Managing unplanned Changes

The purpose of the “unplanned Change” use case is to provide IT organizations a formal
process by which all changes that occur to the IT infrastructure are both logged and
conventionalized through the organizations formal approval process.

An “unplanned Change” is a change that's recognized by a Discovery tool such as DDMA. The
change is first updated and visible in UCMDB and then the data is pushed to SM. SM
recognizes the change and as a result an “Incident” or “Change” record is generated.

These Changes are seen also in the SM “Pending Changes” section in the Configuration Item
form, once approved they are moved to the SM “Historic Changes” section.


1.6.1.3.1.4. Retrieving Service Manager record
information

Retrieving record information from within UCMDB provides all Software applications users with
access to this information by using UCMDB's federation capabilities and supporting APIs.
These applications include Asset Manager (AM), Operations Orchestration (OO), and so on.
SM record data is accessed from within UCMDB using UCMDB federation capabilities. SM
record data includes Incident, Problem and Change records as well as a key set of their
attributes.

UCMDB enables users to create reports or views that combine the federated record data from
SM with CI information from UCMDB.


1.6.1.3.1.5. Retrieving the actual state of
UCMDB CIs

By default, Service Manager only stores and displays the expected or managed state of CIs.
The information Service Manager displays in the Configuration Management form is essentially
the definitive list of attributes that the CI should have. However, the actual state of the CI may
differ from the expected state.

The purpose of “Actual State” is to enable SM users insight into CIs’ current state as detected
by “Discovery Tools” and populated in UCMDB. This state provides up-to-date information that
may vary from the information displayed in SM both in content and in scope.

The “Actual State” of the CI is displayed in SM in order to enable the user to validate the
current state of the CI that resides in UCMDB or in another data repository.

SM users retrieve the Actual State of CIs from UCMDB or additional data sources by viewing
the CI's Actual State section in the SM Configuration Item form.

To view the actual state of the CI, you must first create an integration to a Universal CMDB
server. The Universal CMDB server periodically discovers the actual state of CIs and records
the actual state in the Configuration Management database. Service Manager accesses the
actual state information by using a Web services connection. Service Manager sends the CI ID
to the Universal CMDB server and receives a full list of the attributes for that CI. Service
Manager displays the CI attributes in the Actual State section of the Configuration Management
form.

If a Service Manager CI doesn't have a matching CI in the Universal CMDB server, Service
Manager doesn't display the Actual State section. For example, you may track office furnishing
CIs in Service Manager that can't be discovered and tracked in Universal CMDB.

To retrieve the actual state of a configuration item in Service Manager, follow these steps:

   1. Click Configuration Management > Resources > Search CIs.

   2. Use search or advanced search to find one or more records.
   3. Select the CI with the actual state that you want to see.

   4. From the CI detail form, open the Actual State section. Service Manager displays the
     actual state of the CI, as well as its UCMDB Id value.

                   Note

                The Actual State section is visible only if your system has an active
                integration to a Universal CMDB server and the CI has a matching entry in the
                Configuration Management database. Service Manager doesn't display the
                Actual State section if there is no matching CI in the Universal CMDB server.


1.6.1.3.1.6. Accessing SM CI information in
UCMDB

When integrated with UCMDB UI, Service Manager (SM) displays a View in UCMDB UI button
and enables SM users to view CI information in UCMDB UI. You can click the View in UCMDB
UI button to open the UCMDB UI in the context of the current CI.


1.6.1.3.1.7. Retrieving UCMDB primary CI
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


1.6.1.3.1.8. Support of Automated Service
Modeling (ASM)

Service Discovery in UCMDB UI enables you to configure and run activities to discover your
business services and applications. The discovery process starts from a CI that represents the
URL of a specified service, and continues only with other CIs that can potentially be related to
the service. This functionality is also referred to as Automated Service Modeling (ASM).

            Note

           ASM is supported only for UCMDB 10.20 or later.

Starting with Service Manager version 9.41, the Service Manager adapters support data push
of consumer-provider relationships that are discovered by ASM. The adapters provide an ASM
TQL query for push.

            Note

           Only consumer-provider relationships directly pointing from a Business Element CI
           to a Running Software CI can be pushed. Consumer-provider relationships
           between a Business Element CI and a Cluster CI can't be pushed.

Additionally, Service Manager can integrate with ASM so that SM users can access ASM in the
context of an affected service in SM. This ability enables SM users to see the tree structure of
a service CI and facilitates service modeling in SM.

            Note

           To enable ASM support, you still need to manually tailor related forms in Service
          Manager. For more information, see the How to Enable ASM Support topic.


1.6.1.3.1.9. Centralized CI visualization and
impact analysis

Once Service Manager is integrated with UCMDB and UCMDB Browser, Service Manager users
can access UCMDB UI directly from within Service Manager to visualize CI relationships and
simulate the impact in the context of an affected service or configuration item (CI) in Service
Manager.

If light-weight single sign-on (LW-SSO) is disabled for the integration, Service Manager users
are prompted with UCMDB Browser login page; however, the integration provides a Use a
dedicated user account option, which enables you to configure a dedicated UCMDB UI user
account so that users bypass UCMDB UI login page.

Additionally, UCMDB Browser CI visualization and impact graphs are displayed according to
the user's SM login language, which is English by default.

            Important

           To view UCMDB UI CI visualization and impact graphs embedded in Service
           Manager, users are recommended to use the latest Firefox or Chrome.

CI visualization

Only if an SMtoUCMDB integration instance is enabled in Service Manager (Tailoring >
Integration Manager) and the Show UCMDB UI CI Visualization widget option is enabled,
Service Manager uses the Get Related widget from UCMDB UI to visualize CI relationships.
This enables users to use the same CI visualization on both product sides. For more
information about the Get Related widget in UCMDB UI, see UCMDB Browser Help Center
(version 4.10 or later).

            Note

                For CIs that aren't synchronized to UCMDB, for example, non-discoverable
                CIs, to show CI visualization using the embedded Get Related UCMDB UI
                widget, it is recommended to set up an appropriate TQL script in UCMDB and
                then synchronize this kind of CIs to UCMDB.
                If there is no SMtoUCMDB integration instance enabled or the Show UCMDB
                UI CI Visualization widget option is disabled in the integration instance,
                Service Manager uses its own CI visualization.

Service Manager users can access UCMDB UI Get Related widget as described in the following
table.


Module                                  How to access
Incident
                                           1. Open an incident record.
Interaction                                2. Click the Smart Indicator icon for the
Configuration
Change or Change Task                        following fields:
                                                   Primary Affected Service
                                                   Affected CI

                                           3. On the Context Details form, click
                                             Visualize CI.

                                             The following figure shows an
                                             example CI visualization graph from
                                             UCMDB browser.

                                           1. Open an interaction record.
                                           2. Click the Smart Indicator icon for the

                                             Affected Service field.
                                           3. On the Context Details form, click

                                             Visualize CI.

                                           1. Open a configuration item record.
                                           2. Click the Relationship Graph tab, or

                                             click More > Visualize CI.

                                             The following figure shows an
                                             example CI visualization graph from
                                             UCMDB browser.

                                           1. Open a Change or Change Task
                                             record.

                                           2. Click More > Visualize CI.
                                           3. Select the affected service or an

                                             affected CI of the change record, and
                                             then click Finish.

Impact analysis

If an SMtoUCMDB integration instance is enabled in Service Manager (Tailoring > Integration
Manager) and the Show UCMDB UI Impact widget option is enabled, Service Manager users


can access the Impact Simulation widget of UCMDB UI, as described in the following table. Pay
attention to the following:

     The Impact Simulation widget uses a default impact severity that's defined in the
     SMtoUCMDB integration instance. The out-of-box value is Critical. For more information,
     see How to add UCMDB connection information.
     UCMDB UI uses blue lines and black lines to indicate different types of relationships. For
     more information, refer to the Service Modeling section in the Universal CMDB Browser
     Help Center.

            Note

           If there is no SMtoUCMDB integration instance enabled or if the Show UCMDB UI
           Impact widget option is disabled in the integration instance, the Visualize Impact
           button and Run Impact Analysis icon and menu option described in the following
           table aren't displayed.

Module                                                                                           Service Manager 9.81
Incident
                                        How to access
Interaction
                                           1. Open an incident record.
                                           2. Click the Smart Indicator icon for the

                                             following fields:
                                                   Primary Affected Service
                                                   Affected CI

                                           3. On the Context Details form, click
                                             Visualize Impact .

                                           1. Open an interaction record.
                                           2. Click the Smart Indicator icon for the

                                             Affected Service field.
                                           3. On the Context Details form, click

                                             Visualize Impact.

Module                                                                                           Service Manager 9.81
Change or Change Task
                                        How to access

                                           1. Open a Change or Change Task
                                             record.

                                           2. Click the Run Impact Analysis icon for
                                             the Service field or click More > Run
                                             Impact Analysis.

                                           3. If a Next button appears, click Next to
                                             view the next impact analysis graph.

                                                           Note

                                                        Because a Change or
                                                        Change Task record may
                                                        have a number of affected
                                                        CIs, the Impact Simulation
                                                        result may need to be
                                                        displayed on more than
                                                        one page depending on
                                                        the Maximum Trigger CIs
                                                        per Impact Graph setting
                                                        that's defined in the
                                                        integration instance. If
                                                        more than one page is
                                                        needed, a Next button
                                                        appears at the top of each
                                                        impact graph page before
                                                        the last one.


1.6.1.3.2. Core features

This section explains the rudimentary concepts behind the Federation, Push, and Population
features as they pertain to the integration.
Topics in this section include:
Push
Federation
Population


1.6.1.3.2.1. Push

UCMDB can automatically discover most types of CIs available in Service Manager. This
integration enables you to push these types of CIs from UCMDB to Service Manager.
The following figure shows how data is pushed from UCMDB to Service Manager (SM). The
data is physically pushed (copied) from UCMDB to SM. Once the data is physically located in
SM, the data is utilized by the SM user that consumes this information in various SM
processes.

            Note

           CI Type and Attribute Push
           Only information that's physically present in UCMDB can be pushed to SM.


1.6.1.3.2.2. Federation

With the federation feature, UCMDB pulls various ticket information (for example, Incident,
Problem, Change, and Change Task ticket information) from SM. This enables users to see
ticket information in UCMDB as ticket CIs that are connected to the relevant Nodes.

            Note

           Change Task federation is supported only when the
           ServiceManagerEnhancedAdapter9.41 is used.

When data is federated (reflected or mirrored) from SM to UCMDB, the data is not physically
present in UCMDB, instead it is passed over to UCMDB through Web Services.


1.6.1.3.2.3. Population

You can also use this integration to populate those types of CIs that UCMDB can't
automatically discover or CIs that have been created in Service Manager before you have a
UCMDB system deployed.
Population is the reverse of Push. The following figure shows how data is populated from SM
to UCMDB. One SM CI record with multiple attributes is transferred to UCMDB as multiple CI
records.


1.6.1.4. How CI information is synchronized
between UCMDB and Service Manager

This section explains how CI information is transferred between the UCMDB and Service
Manager systems.
This section includes:

     CI information usage
     High-level components of the integration
     Relationships between integration components
     What information is stored in UCMDB
     What information is stored in Service Manager


1.6.1.4.1. CI display name field in Service
Manager

Prior to version 9.41, Service Manager used the CI Identifier field (logical.name field in the
device table) to store Configuration Item (CI) names, and used the CI Name field (id field in the
device table) to store CI identification numbers. When CIs were pushed from UCMDB to
Service Manager, their names in UCMDB were synchronized to the logical.name field in
Service Manager, and duplicate CI names were renamed because logical.name values must be
unique in Service Manager.

Starting with version 9.41, Service Manager uses the logical.name field to store CI identification
numbers, and a new field named Display Name (display.name in the device table) to store CI
names. The original CI Name field (id field in the device table) is removed from the CI form (but
still kept in the dbdict). CI display names must follow these rules:

     Duplicate Display Names are always allowed for CIs that are created from UCMDB.
     Duplicate Display Names aren't allowed for CIs that are created from Service Manager,
     unless they belong to different CI types.

            Note

           Because Service Manager 9.41 or later allows duplicate CI names (as long as the
           CIs belong to different CI types), the automatic CI renaming mechanism is removed
           since Service Manager 9.41. After upgrading to Service Manager 9.41 or later, if
           you still need to push CI data to the CI Identifier (logical.name) field in Service
           Manager, you need to enable logical.name support first and make sure that each
           value to be pushed is unique. Otherwise, Service Manager can't create the CIs.


1.6.1.4.2. CI information usage

When referring to the concept of CI information it is important to make the distinction between
a UCMDB CI and a Service Manager (SM) CI. The UCMDB model represents a topology that
contains a number of CI types and relationships.
The UCMDB topology can be represented in Service Manager as a single entity. Multiple CIs
from UCMDB and their attributes are merged into a single record in SM and the relevant
UCMDB attributes are mapped to their appropriate counterparts in the SM record.

The above figure shows the correlation between the UCMDB topological model and its
representation of the Computer Instance together with its parallel representation in SM. The
SM computer CI contains all of the UCMDB information that's passed through the integration.

In the push flow, in the UCMDB topological view several CIs such as Node, IP, Interface,
Location, File System, CPU, Disk Device and their Relationships are converted into a single SM
computer record with the IP, MAC Address and Location, File System, CPU, and Disk Device
attributes.

In the population flow, the conversion is reversed.


1.6.1.4.3. High-level components of the
integration

The following diagram shows the high-level components of the UCMDB integration, and
illustrates the interactions between UCMDB and Service Manager.


1.6.1.4.4. Relationships between integration
components

The following figure illustrates the relationships between the Service Manager Adapter
components in UCMDB and the associated components in Service Manager.
The Service Manager Adapter includes configuration files, which are used to map UCMDB
entities to their counterparts in Service Manager during data push, as well as map Service
Manager CIs to UCMDB entities during population.
The configuration files utilize UCMDB queries that define a superset of data relevant for the
integration.


1.6.1.4.5. What information is stored in UCMDB

Your UCMDB system stores the actual state of CIs and CI relationships as CI attributes.
Typically, UCMDB uses one or more integrations and discovery mechanisms (feeders) to
automatically detect CI attribute values. The UCMDB-SM integration only uses a subset of the
CI attributes available in a UCMDB system.


1.6.1.4.6. What information is stored in Service
Manager

Your Service Manager system stores the managed or expected state of CIs and CI
relationships as attribute values in a CI record. To be part of the integration, a CI attribute in
your UCMDB system must map to a managed field in the Service Manager CI record. You can
add, remove, or update the managed fields that are part of the integration by tailoring the
Service Manager web services that manage the integration.

Service Manager runs according to a set of rules that define what actions you want the system
to take whenever a CI’s actual state doesn't match the expected state as defined in the CI
record. You define these rules from the Discovery Event Manager (DEM) in Service Manager
where you can do the following:

     Automatically update a CI record to match the attribute values listed in the actual state
     (This is the default behavior)
     Automatically create a change record to review the differences between the actual state
     and the managed state
     Automatically create an incident record to review the differences between the actual state
     and the managed state
````
