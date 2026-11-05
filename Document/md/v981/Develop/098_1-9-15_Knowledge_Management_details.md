---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.9.15 .. 1.9.16
printed_pages: 2615-2640
---

# 1.9.15 Knowledge Management details

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.9.15. Knowledge Management details

Service Manager uses the Knowledge Management application to enable the Knowledge Management process. The main
function of Knowledge Management is to record, store, update, and change Knowledge Documents for use throughout the
organization.
The following figure shows the Service Manager KM Contribute Knowledge form for the Problem/Solution document type. The
form is used to contribute knowledge (a new KM Document request). As with any new KM document, you must complete the
required fields before you can save the record. See the following table for a list and description of the fields on this form.
The Contribute Knowledge form is illustrated in the following screenshot:

The following table describes the Contribute Knowledge form for the Problem/Solution document type.


Label                                            Contribute Knowledge form field descriptions

                                                                     Description

Title                                            The title of the document. The title should accurately

                                                 describe the content of the document.

Summary                                          A summary of the document.

Expiration date                                  The date that the KM document will automatically expire.

Legislation                                      A drop-down field that you can modify to include specific
                                                 legislation and regional requirements. Out-of-box options are
                                                 listed as HIPAA, ISO/IEC 20,000, and SOX.

Confirmed legal rights to publish this material  A checkbox that you must select to confirm that you have
                                                 the legal rights to use the data contained within the
                                                 document. If this option is not selected, when you attempt to
                                                 publish the document, the system prompts you to confirm
                                                 your legal rights to publish this document.

Tags                                             Enter one or more free-form hashtags (keywords or terms)

                                                 of this document. The hashtags you enter are searchable

                                                 and can be used as keywords to highlight important

                                                 knowledge information.

                                                 For more information, see Working with tags.

Document ID                                      Service Manager creates the ID of the document
Document type                                    automatically.

Status                                           There are five Document Types: Error Message/Cause;
Locale                                           External; Question/Answer; Problem/Solution; and
Reason for Information                           Reference.
Associated Services
                                                 The KM document’s current state in the KM workflow.

                                                 The language used by the search engine when searching
                                                 and indexing. The default locale is English.

                                                 This text field can be used for describing the reason for this
                                                 document or for additional copyright information.

                                                 Click the Fill Field Associated Services icon to select one or
                                                 multiple business services that are associated with this
                                                 document. Specifying an associated service will cause this
                                                 knowledge document and the service record to be linked to
                                                 each other in their Related Records tab and Related
                                                 Documents respectively. Once this knowledge document is
                                                 published, it is listed in the Related Documents section of
                                                 the service records.

                                                 After you select the services, the Notify Service Subscribers
                                                 on Publish option is displayed. Select this option if you want
                                                 to notify users who have subscribed to this service once the
                                                 document is published.

                                                 To view subscribers to the services, click the View
                                                 Subscribers icon. A list of users and departments actively
                                                 subscribed to the selected services is displayed. Click the
                                                 subscription ID link of a department to see users in that
                                                 department.



1.9.16. Configuration Management
overview

The Service Manager Configuration Management application, referred to as
Configuration Management throughout this chapter, supports the Configuration
Management process. It enables you to define and control the components of
services and infrastructure, and to maintain accurate configuration information about
the historical, planned, and current state of services and infrastructure.

Configuration Management ensures that you identify, baseline, and maintain selected
components of a complete IT service, system, or product as Configuration Items and
that you control changes to them by requiring formal approvals. Configuration
Management also ensures that you control releases into your business environments.

This section describes how Configuration Management implements the best practice
guidelines for the Configuration Management processes. Topics in this section
include:

     Configuration Management within the ITIL framework
     Configuration Management application
     Universal Configuration Management Database
     Configuration Management process overview
     Input and output for Configuration Management
     Key performance indicators for Configuration Management
     RACI matrix for Configuration Management


1.9.16.1. Configuration Management within
the ITIL framework

Service Transition publication. The document describes Configuration Management
as the process responsible for managing services and assets to support the other
Service Management processes.

Configuration Management is planned and implemented in conjunction with Change
Management and Release Management to ensure that the service provider can
manage its IT assets and configurations effectively. Configuration Management
enables enterprises to efficiently identify, control, maintain, and verify the versions of
CIs that exist in their infrastructure. Planning is an important part of Configuration
Management, because planning ahead enables you to understand the impact that an
incident or change could have on your infrastructure.

Responsibility for implementing controls can be delegated, but accountability remains
with the responsible manager. Those authorizing the change should provide the
manager with information on the cost, risks, and impact of a proposed change and a
list of resources required for its implementation.

Configuration Management defines and controls the components of services and
infrastructure and maintains accurate configuration information about the historical,
planned, and current state of services and infrastructure.

Effective Configuration Management provides the following benefits:

     Accommodates changes to and reuse of standards and best practices.
     Significantly reduces incident resolution time by using a central repository for
     critical infrastructure data that can be accessed by other applications.
     Includes configuration grouping and business relationships.
     Enables you to meet business and customer control objectives and
     requirements.
     Provides accurate configuration information to enable people to make decisions
     at the right time. For example, to authorize changes and releases or to resolve
     incidents and problems faster.
     Minimizes the number of quality and compliance issues caused by improper
     configuration of services and assets.
     Optimizes the use of service assets, IT configurations, capabilities, and
     resources.



1.9.16.2. Configuration Management
application

The Configuration Management application identifies, defines, and tracks an
organization’s CIs by creating and managing records for those items. Other
Service Manager applications can then access these records from a central
repository. For example, when you create an incident, you can access the hardware
component details from Configuration Management and populate the new incident
with that information. Access to Configuration Management significantly reduces the
time spent to resolve the incident, as well as alerts you to other potential incidents
due to component relationships and dependencies defined in the database.

Configuration Management assures you that releases into controlled environments
and operational use are performed on the basis of formal approvals. Configuration
Management also provides a configuration model of services, assets, and
infrastructure by recording relationships between service assets and configuration
items.

All CIs are defined in the device file, the foundation of Configuration Management.
Each CI record can include contact, location, vendor, and outage history. Other
Service Manager applications, such as Incident Management and Change
Management, access Configuration Management to populate fields on forms through
the use of link records.

Configuration Management enables you to do the following:

     Identify, control, record, report, audit, and verify service assets and CIs,
     including versions, baselines, constituent components, and their attributes and
     relationships.
     Account for, manage, and protect the integrity of service assets and CIs
     throughout the service lifecycle by ensuring that only authorized components
     are used and only authorized changes are made.

As new and updated services and systems are released and distributed, accurate
configuration information must be available to support the planning and control of
changes. Service Manager’s out-of-box Configuration Management workflow tracks
the IT assets and configurations that make up the infrastructure. These assets can be
hardware, software, and associated documentation. The inter-relationships between
these components are also monitored. Effective results integrate the service


provider's configuration information processes and those of its customers and
suppliers. All major assets and configurations must be accounted for and have a
responsible manager who ensures that protection and control is maintained.

User profiles determine the access level within Configuration Management.
Depending on your access level, you can do the following:

     Add, edit, and save CI records.
     Manage CIs using predefined views to find CIs quickly.
     View and modify software installation information.
     View the maintenance schedule for a CI.
     View and modify SLA information.
     Add CIs to a contract and manage existing contracts.


1.9.16.3. Universal Configuration
Management Database

An integration between Universal CMDB (UCMDB) and Service Manager enables you
to share information about the actual state of a configuration item (CI) between your
UCMDB system and Service Manager. Any organization that wants to implement the
best practices Configuration Management and Change Management ITIL processes
can use this integration to verify that CIs actually have the attribute values the
organization has agreed to support.

Service Manager allows you to programmatically define what actions you want to take
whenever a CI’s actual state doesn't match the expected state as defined in the CI
record. For example, you can use this integration to automate the creation of
Service Manager change or incidents to update or rollback CIs that have unexpected
attribute values.

The integration offers several different ways for users to view CI actual state
information:

     By default, the integration automatically updates the managed fields of
     Service Manager CI records as part of the regular UCMDB synchronization
     schedule. You can choose the option to configure the integration to
     automatically create change or incidents instead.
     You can view the current actual state of a CI by looking at the Actual State
     section in the Service Manager CI record. For more information see Baselines,
     Managed state, and Actual state.
     You can use the Service Manager View in UCMDB UI option to view the current
     CI attributes from UCMDB.

You can specify CI relationships directly in Service Manager or define them in UCMDB
and push them to Service Manager like any other asset, by using web services. You
can also create UCMDB CI relationships from Service Manager CIs.


1.9.16.3.1. Baselines

Baselines are an optional feature of Configuration Management that allow you to
define a set of attributes that all instances of a configuration item (CI) should have. A
baseline is a template CI that defines the expected or authorized attributes of a CI.
Typically, a baseline only describes the attributes that you expect CIs to share in
common and doesn't include attributes that you expect to vary. For example, a
baseline describing PCs might require that all PC CIs be assigned the same model
number and operating system version but not the same owner or serial number. In this
example, the model number and the operating system would be authorized attributes
of the baseline, while the owner and the serial number would be individually-managed
attributes.

            Note

           Baseline records replace baseline configuration item groups from
           previous versions of Service Manager. The upgrade process converts
           existing baseline configuration item groups to query groups.

Baseline records are separate from the CI records they manage. You must first create
a baseline record before you can associate it with one or more CIs. All baseline
records must have a name, a list of authorized attributes, and a state. Baseline
records can optionally have a version number, which administrators can configure
from the Configuration Management environment record. A baseline record’s status
determines whether you can add or edit attributes, and whether you can associate
CIs to the baseline. After you authorize a baseline record, its attributes are locked and
you can only associate or remove CIs from the baseline.

It is up to a Configuration Management manager to determine whether a CI that's out
of compliance with its baseline is acceptable or requires a change. Keep in mind that
both the CI record and the baseline record describe the expected or managed state of
a CI. A baseline record is intended to describe the expected state across many similar
items. A CI record describes the expected state of an individual item.

There may be cases where it is acceptable for an individual CI to have a different
managed state than other CIs in the same baseline. For example, you might have a
baseline requiring that all application servers have 8 GB of RAM. However, you may
also want one of your application servers, the Web server, to have 16 GB of RAM. You


may want to authorize this exception to the baseline rather than creating a new
baseline record to describe just one CI.

Baselines only check for compliance against the managed state of the CI. The actual
state of the CI is irrelevant to a baseline compliance check. Continuing the example
above, the Web server CI record might list 16 GB of RAM as the managed state. This
makes it out of compliance with the baseline that requires all application servers to
have 8 GB of RAM. If a discovery process later reveals that the Web server actually
only has 12 GB of RAM, this might cause Service Manager to open an unplanned
change, but it will not cause a new violation of the baseline. Only differences between
the CI’s managed state (16 GB of RAM) and the baseline (8 GB of RAM) matter.

Baseline section

Each CI record has a baseline section that lists details about the baseline, if any, that's
currently managing the CI. The baseline section lists the name of the managing
baseline, its version, and a list of the attribute names and attribute values the baseline
expects. If the CI has a value other than the baseline value, Service Manager displays
a warning message stating that the Configuration Item is out of compliance with
Baseline.

Contents

     1 Baseline section


1.9.16.3.2. Managed state

In Service Manager, the managed state is the subset of CI attributes that have been
defined as critical enough to be closely managed by a formal change process and
have been approved by that process. You may add managed state information for a CI
in several ways:

     Automatically add CI attributes from an integration to Universal CMDB
     Automatically add CI attributes from an integration to Connect-It and Universal
     CMDB
     Manually add CI attributes

After you add the managed state information to a CI, any changes to the CI attributes
must go through a Change Management process.

Service Manager owns the managed state of a CI and acts as the definitive source of
what the CI attributes should be. The actual state of the CI may differ from the
managed state and may trigger actions in Service Manager such as an out of
compliance with baseline warning message or the opening of an unplanned change.

Managed State section

The Managed State section uses subsections to display data about each CI. There are
three subsections for this purpose, The Network subsection and the Additional
subsection are used for all CI types. The third subsection depends upon the CI and CI
type selected. For example, the Adobe Reader is an application CI type and therefore
includes the Application subsection in the Managed State section.

Contents

     1 Managed State section


1.9.16.3.3. Actual state

The actual state of a CI is the current list of CI attributes. By default, Service Manager
only stores and displays the expected or managed state of CIs. Service Manager can
only receive actual state information if you set up an integration to Universal CMDB.
Service Manager uses the actual state to determine if a CI is in compliance with its
managed state. Service Manager compares the managed attribute values listed in the
CI record to the attributes values listed in Universal CMDB. If any of the managed
attribute values differ from the managed state, Service Manager takes action as
defined in the Discovery Event Manager (DEM) settings. By default, Service Manager
opens an unplanned change whenever the actual state of a CI attribute differs from
the managed state.

Actual State section

The Actual State section displays the list of CI attributes passed from an Universal
CMDB integration. The list of CI attributes varies from CI to CI and may not match
your list of managed attributes. That is, the Actual State section displays all the CI
attributes it receives from the Universal CMDB integration whether they are managed
fields in Service Manager or not.

To view the actual state of the CI, you must first create an integration to an Universal
CMDB server. The Universal CMDB server periodically discovers the actual state of
CIs and records the actual state in the Configuration Management database.
Service Manager accesses the actual state information by using a Web services
connection. Service Manager sends the CI ID to the Universal CMDB server and
receives a full list of the attributes for that CI. Service Manager displays the CI
attributes in the Actual State section of the Configuration Management form.

If a Service Manager CI doesn't have a matching CI in the Universal CMDB server,
then Service Manager doesn't display the Actual State section. For example, you may
track office furnishing CIs in Service Manager that can't be discovered and tracked in
the Universal CMDB.

Contents

     1 Actual State section


1.9.16.3.4. CI relationships

Service Manager tracks upstream and downstream relationships between CIs. A
relationship between CIs means that there is some dependency between CIs. If an
upstream CI has an interruption of service, Service Manager assumes that all CIs with
a downstream relationship to the affected CI also have an interruption of service. For
example, if a network router has an interruption of service, then all servers and PCs
that connect to that router also have an interruption of service.

Any given CI typically has one upstream relationship and one or more downstream
relationships. CIs can have logical or physical relationships based on the logical name
of the configuration item. CI relationships are independent of baseline, actual or
managed states.

CI Relationship section (CI visualization)

Each CI record has a section that graphically displays relationships between CIs and
the current state of each item in the configuration. (UCMDB has a similar relationship
diagram.) Service Manager gathers information from all available applications to
determine the current state of a CI. You can view, add, or update relationships using
the graphical interface. Service Manager uses smart indicators to tell you if there are
any current issues, related records, or breaches to availability SLAs for the CI.

Contents

     1 CI Relationship section (CI visualization)


1.9.16.4. Configuration Management
process overview

The Configuration Management process ensures that selected components of a
complete IT service, system, or product (the Configuration Item) are identified,
baselined, and maintained and that changes to them are controlled. It provides a
Configuration model of the services, assets, and infrastructure by recording the
relationships between service assets and Configuration Items. It also ensures that
releases into controlled environments and operational use are completed on the basis
of formal approvals. It provides a configuration model of the services, assets, and
infrastructure by recording the relationships between service assets and
Configuration Items (CIs).

Configuration Management may cover non-IT assets, work products used to develop
the services, and Configuration Items required to support the services that aren't
formally classified as assets. Any component that requires management to deliver an
IT Service is considered part of the scope of Configuration Management.

The asset management portion of this process manages service assets across the
whole service life cycle, from acquisition to disposal. It also provides a complete
inventory of assets and the associated owners responsible for their control.

The Configuration Management portion of this process maintains information about
any CI required to deliver an IT service, including its relationships. This information is
managed throughout the life cycle of the CI. The objective of Configuration
Management is to define and control the components of an IT service and its
infrastructure, and to maintain accurate configuration information.

The Configuration Management process manages service assets to support other
Service Management processes. Effective Configuration Management facilitates
greater system availability, minimizes production issues, and resolves issues more
efficiently.

The Configuration Management process ensures that selected components of a
complete IT service, system, or product (the Configuration Item) are identified,
baselined, and maintained and that changes to them are controlled. It also ensures
that releases into controlled environments and operational use are completed on the
basis of formal approvals.

Configuration Management comprises five basic activities. The Configuration
Management process encompasses all of these activities and ensures that assets are


tracked and monitored effectively. The basic activities within the scope of
Configuration Management are:

     Configuration Management Planning (process ST 3.1) - includes the activities
     that enable you to plan the function, scope, and objectives of Service Manager
     for your organization.

     Configuration Identification (process ST 3.2) - includes the activities that enable
     you to identify and label all of your company’s existing IT components. The
     information you track includes asset identification, contact, asset network
     relationship, and model or version data. Enter this information into the database.

     Inventory maintenance

          • Configuration Control (process ST 3.3) - includes the activities that enable
          you to ensure that all information regarding your IT components is kept up to
          date and accurate. Components can be added, modified, or removed only
          through controlling documentation, such as an approved Request for
          Change (RFC).

          • Master data management (process ST 3.6) - includes the activities that
          enable you to reconcile master reference data managed in other
          administrations.

     Configuration Status Accounting and Reporting (process ST 3.4) - includes the
     activities that enable you to run reports of the current and historical data that's
     concerned with each IT component throughout its life cycle. Status accounting
     makes changes to components that can be tracked.
     Configuration Verification and Audit (process ST 3.5) — includes the activities
     that enable you to check and verify physical existence of IT components and
     ensure that they are correctly recorded in the database.

A general overview of the Configuration Management processes and workflows is
depicted in the figure below. They are described in detail in Configuration
Management Workflows.


Configuration Management user roles


The following figure describes the responsibilities of the Configuration Management
user roles.


                                        Configuration Management user roles

Role                                    Responsibilities

Configuration Administrator             Reviews proposed updates to the
                                        Configuration Management
                                        system (CMS)
                                        Evaluates the pre-modification
                                        and post-modification
                                        configuration states.
                                        Verifies that CI information is
                                        correct and complete and
                                        contains a description of
                                        attributes to be modified.
                                        Verifies that proposed
                                        modifications comply with
                                        Configuration Management
                                        policies.
                                        Verifies that Configuration details
                                        are updated in the Configuration
                                        Management database.

Configuration Auditor                   Reviews and validates CMS
                                        updates and creates exception
                                        reports, if needed.
                                        Conducts configuration audits
                                        and performs appropriate actions,
                                        if an unregistered component is
                                        detected or if a component is
                                        missing.
                                        Ensures that information in
                                        Configuration Management is
                                        correct and that all CIs are
                                        accurately and completely
                                        recorded.

Role                                                                                            Service Manager 9.81
Configuration Manager
                                        Responsibilities
CMS/Tools Administrator
                                             Manages the Configuration
                                             Management plan and policies.
                                             Evaluates any task that requests a
                                             change to the CMS data model
                                             before the manager releases the
                                             task for implementation. For
                                             example, the introduction of a
                                             new CI into the IT infrastructure
                                             would require a request for
                                             change and a review of that
                                             request prior to implementation of
                                             the change.
                                             Verifies that there is no existing CI
                                             type that meets the needs of the
                                             change and that the proposed
                                             data model change doesn't
                                             conflict with other parts of the
                                             model.

                                             Configures the data model,
                                             policies, and CI types in
                                             Configuration Management.


1.9.16.5. Input and output for
Configuration Management

Configuration activities can be triggered and resolved in several ways. The following
table outlines the inputs and outputs for the Configuration Management process.

                                        Input and output for Configuration Management

Input to Configuration Management       Output from Configuration
                                        Management

Changes required in the                 Configuration Management plan
Configuration Management                Configuration Management
System (CMS)                            policies
Tasks initiated from changes or         Configuration Management data
service requests to create or           model (defining CI types and
modify Configurations Items (CIs)       attributes)
and relationships                       Configuration reports (for
                                        example, overview of CIs,
                                        subscriptions, license reports,
                                        stock reports, or configuration
                                        utilization reports)

                                             Configuration audit report
                                        Incidents reported due to
                                        discrepancies or unauthorized
                                        changes detected
                                        Creation and modification of CIs
                                        and configuration data


1.9.16.6. Key performance indicators for
Configuration Management

The Key Performance Indicators (KPIs) in the following table are useful for evaluating
your Configuration Management processes. To visualize trend information, it is useful
to graph KPI data periodically. Note that some KPIs can't be reported by using only
the data from Service Manager.

Title  Key Performance Indicators for Configuration Management

                                Description

% of CIs related to Services            Number of CIs that are related to one
                                        or more IT services as a percentage of
                                        the total number of registered CIs that
                                        can be related to IT services, in a given
                                        time period.

% of CIs related to other CIs           Number of CIs related to one or more
                                        other CIs as a percentage of the total
                                        number of registered CIs that can be
                                        related to other CIs, in a given time
                                        period.

% of inaccurate CIs                     Number of CIs in the CMS that are
                                        registered with inaccurate information
                                        as a percentage of the total number of
                                        registered CIs, in a given time period.

For completeness, the ITIL V3 and COBIT 4.1 KPIs are included below.

ITIL V3 key performance indicators

The following are ITIL V3 KPIs for Configuration Management:

     Percentage improvement in maintenance scheduling over the life of an asset
     Degree of alignment between provided maintenance and business support
     Assets identified as the cause of service failures
     Improved speed for Incident Management to identify faulty CIs and restore
     service


     Impact of incidents and errors affecting particular CI types, for example, from
     particular suppliers or development groups, for use in improving the IT service
     Percentage reuse and redistribution of under-utilized resources and assets
     Degree of alignment of insurance premiums with business needs
     Ratio of used licenses against paid for licenses (should be close to 100%)
     Average cost per user for licenses (that is, more effective charging options
     achieved)
     Achieved accuracy in budgets and charges for the assets utilized by each
     customer or business unit
     Percentage reduction in business impact of outages and incidents caused by
     Configuration Management
     Improved audit compliance

COBIT 4.1 key performance indicators

The following are the COBIT 4.1 KPIs for Configuration Management:

     Number of business compliance issues caused by improper configuration of
     assets
     Number of deviations identified between the configuration repository and actual
     asset configurations
     Percent of licenses purchased and not accounted for in the repository
     Average lag time period between identifying a discrepancy and rectifying it
     Number of discrepancies relating to incomplete or missing configuration
     information
     Percent of configuration items meeting specified service levels for performance,
     security, and availability

Contents

     1 ITIL V3 key performance indicators
     2 COBIT 4.1 key performance indicators


1.9.16.7. RACI matrix for Configuration
Management

A Responsible, Accountable, Consulted, and Informed (RACI) diagram or RACI matrix
is used to describe the roles and responsibilities of various teams or people in
delivering a project or operating a process. It is especially useful in clarifying roles
and responsibilities in cross-functional/departmental projects and processes. The
RACI matrix for Configuration Management is shown in the following table.


                                        RACI matrix for Configuration Management

Process  Activity                       Configu  CMS/To   Configu                 Configu  Change
ID                                      ration   ols      ration                  ration   Coordin
                                        Manage   Adminis  Adminis                 Auditor  ator
                                        r        trator   trator

ST 3.1 Configur A/R                              R

         ation

         Manage

         ment

         Planning

ST 3.2 Configur A/C                                       R                                C/I

         ation

         Identific

         ation

ST 3.3 Configur A/C                                       R                                C/I

         ation

         Control

ST 3.4   Configur A/I                                     R                       R
         ation
         Status
         Accounti
         ng and
         Reportin
         g

ST 3.5   Configur A/C                                     R                       R
         ation
         Verificati
         on and
         Audit

ST 3.6 Manage A                                           R

         Master

         Data
````
