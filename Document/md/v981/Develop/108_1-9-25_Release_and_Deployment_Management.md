---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.9.25 .. 1.9.25
printed_pages: 2910-2937
---

# 1.9.25 Release and Deployment Management

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.9.25. Release and Deployment
Management

Service Manager uses the Release and Deployment Management application to
enable the Release and Deployment Management process.
The following sections shows how you can tailor Service Manager to support Release
and Deployment Management as a subset of Change Management.


1.9.25.1. Release and Deployment
Management Overview

The Service Manager Release and Deployment Management application, referred to
as Release and Deployment Management throughout this chapter, supports the
Release and Deployment Management process. It is implemented as a separate
category inside the Change Management application and supports and relies on the
Change Management process. It ensures that the Configuration Management
Database (CMDB) is kept up to date, that changes are appropriately managed, and
that all new software and hardware is stored in the Definitive Software Library (DSL)
and Definitive Hardware Store (DHS). After one or more changes are developed,
tested, and packaged into releases for deployment, Release and Deployment
Management is responsible for introducing these changes and managing their
release. Release and Deployment Management also contributes to the efficient
introduction of changes by combining them into one release and deploying them
together.

This section describes how Release and Deployment Management implements the
best practice guidelines for the Release and Deployment Management processes.

Topics in this section include:

     Release and Deployment Management within the ITIL framework
     Release and Deployment Management application
     Release and Deployment Management process overview
     Key performance indicators for Release and Deployment Management


1.9.25.1.1. Release and Deployment
Management within the ITIL framework

Release and Deployment Management is addressed in ITIL’s Service Transition
publication. The goal of Release and Deployment Management is to plan, schedule
and control the build, test and deployment of releases to deliver new or changed
functionality, its enabling systems, technology and organization while protecting the
integrity of existing IT and Business Services.

Release and Deployment Management includes the assembly and implementation of
new or changed services, from release planning through to early life support
transition for operational use. It includes, physical and virtual assets, applications and
software, training and communication

The purpose of Release and Deployment Management is to:

     Define and agree release and deployment plans with customers and
     stakeholders
     Ensure that each release package consists of a set of related assets and service
     components that are compatible with each other
     Ensure that integrity of a release package and its constituent components is
     maintained throughout the transition activities and recorded accurately in the
     CMS and stored in the DML
     Deploy release packages from the DML to the production environment following
     an agreed plan and schedule
     Ensure that all release and deployment packages can be tracked, installed,
     tested, verified, and/or uninstalled or backed out if appropriate
     Record and manage deviations, risks, issues related to the new or changed
     service and take necessary corrective action
     Ensure that there is knowledge transfer to enable the customers and users to
     optimise their use of the service to support their business activities
     Ensure that skills and knowledge are transferred to operations and support staff
     to enable them to effectively and efficiently deliver, support and maintain the
     service according to required warranties and service levels

The objective of Release and Deployment Management is to ensure that:

     There are clear and comprehensive release and deployment plans that enable
     the customer and business change projects to align their activities with these


plans
A release package can be built, installed, tested and deployed efficiently to a
deployment group or target environment successfully and on schedule
All aspects that are related within an IT service are considered when creating,
building and implementing a new or subsequent release of that service.
Release activities are repeatable, controllable, scalable and sustainable
There is minimal unpredicted impact on the production services, operations and
support organization


1.9.25.1.2. Release and Deployment
Management application

The Release and Deployment Management application ensures that the Configuration
Management Database (CMDB) is kept up to date, that changes are appropriately
managed, and that all new software and hardware is stored in the Definitive Software
Library (DSL) and Definitive Hardware Store (DHS). After one or more changes are
developed, tested, and packaged into releases for deployment, Release and
Deployment Management is responsible for introducing these changes and managing
their release. Release and Deployment Management also contributes to the efficient
introduction of changes by combining them into one release and deploying them
together.

The purpose of Release and Deployment Management is to ensure that all changes
are deployed successfully in the least disruptive manner. Release and Deployment
Management is responsible for the following functionality:

     Driving the release strategy, which is the overarching design, plan, and
     approach for deployment of a change into production in collaboration with the
     Change Advisory Board (CAB).
     Determining the readiness of each release based on release criteria (such as
     quality of release, release package and production environment readiness,
     training and support plans, rollout and back out plans, and risk management
     plan).

Release and Deployment Management offers these benefits for users:

     Provides a packaged release for all changes deployed into production and only
     deploys changes approved by change management.
     Provides two different types of releases: hardware and software. Once the
     release type is determined, the application provides the appropriate tasks.
     Ability to manage changes of groups such as Configuration Item (CI) groups and
     business services.
     Ability to terminate a release at any time except in the Training phase or once it
     has been installed or verified. At that point you have the ability to back-out the
     change.
     Availability of optional training phase.


1.9.25.1.3. Release and Deployment
Management process overview

The Release and Deployment Management process includes activities necessary to
control releases to service assets and configuration items across the entire service
lifecycle. It provides standard methods and procedures to use when implementing all
releases.

The purpose of Release and Deployment Management is to ensure that:

     Releases follow a set process
     Appropriate users are notified at key points in the process
     Progress of a release is monitored and notification are issued if deadlines are
     missed
     Releases are supported throughout a simple or complex lifecycle

Release types

Release and Deployment Management includes three release types: Emergency,
Major, and Minor. All three release types utilize the Release Management category
and workflow in the Change Management module. Additional categories and
workflows can be created if required. The steps of the workflow are represented by
the phases and tasks within the phase. Service Manager requires that every release
has a category and phase, but tasks are optional.

Release phases and transitions

Service Manager uses phases to describe the steps necessary to complete a release.
The phase also determine the release screens users see, the approvals required to
advance to the next phase, and the conditions that cause the system to issue
notification and alerts. Each phase has workflow transitions that control how the
release record will move through the workflow. When the work for a given phase has
been completed the user will advance it to the next phase. If the release has
encountered a failure condition then the release may be move back to an earlier
phase for rework or abandoned.

Release tasks

Release Management utilizes tasks to capture work that's necessary for the overall
release. This is work in addition to the Change specific tasks that are required to


complete the changes that are associated to the release. Examples of required
release activities are: determining if funding is available to support the release,
arranging for required contracts and licenses, building and delivering training,
evaluating the financial impact of the planned release, and performing knowledge
transfer after the release has been deployed. Release Models can be used to pre-
define task plans for Releases.

Integration with Change Management

In Service Manager the Release record and workflow control the overall process of
the release, including approvals for the release and the release specific activities
(tasks) that need to be complete. The release is related to multiple change requests
(RFCs) that have their own workflow, approvals, and tasks. The planning, assessment,
build, and deployment of each change is tracked and worked in the Change
Management module. The Release provides the higher level oversight and provides
visibility into the Change Management process through the Related Records section in
the release record.

Release roles

The following table describes the responsibilities of the Release and Deployment
Management user roles.


Role             Release and Deployment Management user roles
Release Manager
                                      Responsibilities

                                        Manages all aspects of the end-
                                        to-end release process
                                        Reviews and updates the release
                                        policy
                                        Facilitate the bundling of releases
                                        Coordinate planning and
                                        preparation for Deployment
                                        Coordinate creation of
                                        Deployment Plans
                                        Ensures coordination between the
                                        build and test environment team
                                        and release teams
                                        Ensures the teams follow the
                                        organization’s established policies
                                        and procedures
                                        Provides management reports on
                                        release progress
                                        Updates the Service Knowledge
                                        Management System


Role                                    Responsibilities
Release Coordinator
                                             Registers the release and applies
                                             the correct release model and
                                             release detail.
                                             Schedules the release according
                                             to the plan created previously.
                                             Creates the release tasks required
                                             for the release.
                                             Coordinates the Risk and Impact
                                             Analysis phase of the release and
                                             creates release plan based on the
                                             assessment information.
                                             Verifies if the release has passed
                                             the test criteria.
                                             Verifies if the release is
                                             implemented successfully in the
                                             production environment.
                                             After implementation, evaluates
                                             the change and closes the
                                             request.
                                             If a change implementation fails,
                                             the coordinator activates a back-
                                             out plan to return the system to its
                                             original state.

Release Approver                           Uses the Service Manager tool to
                                           Change Advisory Board to
                                           approve or deny Releases when
                                           requested

Contents

     1 Release types
     2 Release phases and transitions
     3 Release tasks
     4 Integration with Change Management


5 Release roles


1.9.25.1.4. Key performance indicators for
Release and Deployment Management

The Key Performance Indicators (KPIs) in the following table are useful for evaluating
your Release and Deployment Management processes. To visualize trend information,
it is useful to graph KPI data periodically. In addition to the data provided by Service
Manager, you may need additional tools to report on all of your KPI requirements.

Title  Key performance indicators for Release and Deployment Management

                                     Description

% of release success rate               Percentage of the total number of
                                        closed releases successfully
                                        implemented in a given period.

% of release defect rate                Percentage of releases resulting in
                                        Incidents in a given period.

Number of known release errors          The number of known errors by
                                        category by release over time.

% of approved releases that don't       Percentage of approved releases that
result in an incident                   don't result in an Incident in a given
                                        period.

% of releases implemented in the        Percentage of releases that are
approved release implementation         completed within the approved
window                                  implementation window.


1.9.25.2. Release and Deployment
Management Workflows

The Release Management category includes twelve phases, which follows the
recommended Information Technology Infrastructure Library (ITIL) process by
providing you with a set of approvals and tasks that you can expand.
The Release and Deployment Management workflow is illustrated in the following
figure:

Release Registration and Assess

Releases may be raised either as the result of advanced planning activities, so they
are coordinated with planned maintenance windows, or in response to a change
request or group of change requests. The release should contain changes that are
planned to be executed together, either because they all affect the same service or
because they will be executed during the same release window. During the Assess
phase the importance and value of the release should be determined and
documented in the release record.

Plan and Design Authorization

In this phase the Release Manager works with the relevant stakeholders, such as
service owners or project managers to approve the Plan and Design phase of the
release. If unapproved the release is abandoned.

Release Plan and Design

Plan releases in line with requirements resulting from approved changes. Analyze all
the affected Configuration Items (CIs) and CI Groups, review what software or
hardware is needed to accomplish the plan, and determine the cost. This phase
requires the plan and design approval before going to the next step.

Build and Test Authorization


The Release Manager reviews the Planning and Design activities and discusses the
results with all relevant stakeholders to decide whether to approve the activities
required to build and test the release. In case the release is rejected the Release
Manager either initializes a rework of the plan and design steps or is abandoning the
release.

Release Build and Test

Build effective release packages for the deployment of one or many changes into
production. Test release mechanisms to ensure minimum disruption to the production
environment. During this phase the individual changes that make up the release will
be built and tested in isolation as part of the change management process and the
combined release package will be built and tested as well. This phase requires that
the build and testing of the release has been approved before going to the next
phase.

Release Training

Identify and fulfill training requirements for various users. This phase is optional and is
activated when you select high Impact Assessment and high Urgency for the release
change.

Release Distribution Authorization

All stakeholders of the release review the Build and Test results and approving /
abandoning / rejecting the planned activities. If the Build and Test results are
approved, the release manager updates the implementation schedule and authorizes
the release distribution to commence. In case the release is rejected the Release
Manager either initializes a rework of the build and test / training activities or is
abandoning the release.

Release Distribution

During the distribution phase of the release the individual changes that make up the
release will be implemented in a coordinated fashion in order to maximize the
likelihood of success while minimizing the required service disruption. The
implementation of each individual change is executed and tracked in the Change
Management process.

Release Remediation

The remediation phase is an optional phase that's entered if the release encounters
an issue during the deployment phase and the work done for the release must be


undone. The work required for back out will have been determined and recorded
during the build and test phase.

Release Verification and Closure

After the release is completed, the results must be report for evaluation to those
responsible for managing releases and then presented for stakeholder agreement.
This process involves analyzing the results for the changes that make up the release
and the closing of related user interactions, incidents, and known errors. The
verification phase is performed to confirm that:

     The release met it objectives
     The release requestor and stakeholders are satisfied with the results
     Lessons learnt are incorporated in future releases

Abandoned

You can abandon a release in any phase before the distribution phase was approved.
Prior distribution the release is still in planning and design steps hence not widely
used by an audience. In these phases the release might be abandoned due to various
reasons. When the release is abandoned, the release process should ensure that the
reasons for this decision are properly documented. Once abandoned, the release is
closed. It’s not foreseen to reopen an abandoned release.

Contents

     1 Release Registration and Assess
     2 Plan and Design Authorization
     3 Release Plan and Design
     4 Build and Test Authorization
     5 Release Build and Test
     6 Release Training
     7 Release Distribution Authorization
     8 Release Distribution
     9 Release Remediation
     10 Release Verification and Closure
     11 Abandoned


1.9.25.3. Release and Deployment
Management Details

Service Manager uses the Release and Deployment Management application to
enable the Release and Deployment Management process.
The following table identifies and describes some of the features on the Release and
Deployment Management forms.

Label                                                                                                                          Service Manager 9.81
Release ID
                 Release and Deployment Management field descriptions
Phase
                                          Description

                                          This is a system-generated unique
                                          value assigned when the release is
                                          opened.

                                          This is a system-generated field that
                                          specifies the name of the current
                                          phase of the change.
                                          For a list of the phases, see Release
                                          and Deployment Management
                                          Workflow.

Status                                  The status of the release within the
Approval Status                         release phase. The status is either
                                        initial (the phase has started) or closed
                                        (the phase has ended)

                                        This is a system-generated field that
                                        defines the global approval status for
                                        the change, not for a single approval.
                                        The system sets this field depending
                                        on current approvals and the approval
                                        type defined for the module.

                                        These approval statuses are available
                                        out-of-box:

                                             Pending
                                             Approved
                                             Denied

 Label                                                                                          Service Manager 9.81
 Reason for Release
 Assigned To                            Description
 Release Type
                                        A code that indicates the primary
 Release Coordinator                    reason for implementing the release.
 Initiated By                           Examples of reason codes are
                                        Incident/Problem Resolution and
This PDF was generated on May 23, 2026  Business Requirement.

                                        The name of the person the release is
                                        assigned to.

                                        This field indicated the type of release.
                                        The release types available out-of-box
                                        are:

                                             Major
                                             Minor
                                             Emergency
                                        This is a required field.

                                        The person responsible for
                                        coordinating the release
                                        implementation. Each Release
                                        Coordinator may belong to several
                                        assignment groups. Each group must
                                        have only one Release Coordinator.

                                        The name of the user requesting the
                                        release.
                                        This is a required field. This field
                                        includes a hover-over form that
                                        displays full name, telephone, and
                                        email address if available for the user
                                        requesting the release.

                                                                                                                        Page 309 of 387
Label                                                                                           Service Manager 9.81
Alert Stage
                                        Description
Planned Start
Planned End                             This is a system-generated field that
Downtime Start                          lists the current Alert Stage of this
                                        request. This field is updated
Downtime End                            automatically when alerts are
                                        processed against the release. Do not
                                        update it manually. The alerts are
                                        processed against a release by using
                                        the phase definition.

                                        This field specifies the date and time
                                        that the work to implement the release
                                        should start.

                                        This field specifies the date and time
                                        that the work to implement the release
                                        should end.

                                        The date and time when the release is
                                        scheduled to begin. Scheduled
                                        downtime only needs to be filled when
                                        the service is down, while
                                        implementing the release.

                                        The date and time when the release is
                                        scheduled to end. Scheduled downtime
                                        only needs to be filled when the
                                        service is down, while implementing
                                        the release.

 Label                                                                                          Service Manager 9.81
 Configuration Item(s) Down
                                        Description
 Risk Assessment
                                        If selected (set to true), indicates that
This PDF was generated on May 23, 2026  the Configuration Items (CIs) are
                                        currently not operational and the
                                        downtime is scheduled. The fields
                                        Downtime Start and Downtime End are
                                        used along with the field Configuration
                                        Item(s) Down to indicate the scheduled
                                        time to bring the CI down. These fields
                                        are never required and should only be
                                        populated if you plan to bring down the
                                        CIs as part of the change. The interval
                                        selected applies to all the CIs of the
                                        change and can't be specified by
                                        individual CI. When the change is
                                        closed, you may get the form
                                        confirming the outage times, and when
                                        you close the change, the CIs will be
                                        set as Up in Configuration
                                        Management.

                                        Specifies a code that indicates the risk
                                        incurred with the implementation of the
                                        change. These risk assessments are
                                        available out-of-box:

                                             0 - No Risk
                                             1 - Low Risk
                                             2 - Some Risk
                                             3 - Moderate Risk
                                             4 - High Risk
                                             5 - Very High Risk

                                        After a user selects this field, the
                                        release may require additional
                                        approvals based on the risk. The
                                        approval is based on the risk number in
                                        the assessment approval record.

                                                                                                                        Page 311 of 387
Label                                                                                           Service Manager 9.81
Impact Assessment
                                        Description
Urgency
                                        This field specifies the impact the
                                        release has on the business. The
                                        impact and the urgency are used to
                                        calculate the priority.

                                        These impacts are available out-of-
                                        box:

                                             1 - Enterprise
                                             2 - Site/Dept
                                             3 - Multiple Users
                                             4 - User

                                        The out-of-box data is the same as
                                        Interaction Management, Problem
                                        Management, Incident Management,
                                        and Change Management.

                                        This is a required field.

                                        The urgency indicates how pressing
                                        the release is for the organization. The
                                        urgency and the impact are used to
                                        calculate the priority. This field
                                        functions similarly to the same field for
                                        interaction, incident, problem, and
                                        change tickets. For more information,
                                        see Service Desk Interaction
                                        Management form details.

                                        This is a required field.

 Label                                                                                          Service Manager 9.81
 Priority
                                        Description
 Policy / Regulation
 Description                            This is a system-generated field using
 Overall Assessment                     the urgency and impact of the release.
 Closure Code                           This field functions similarly to the
                                        same field for interaction, incident,
 Closing Comments                       problem, and change tickets. For
 Associated CIs                         additional information, see Service
                                        Desk Interaction Management form
This PDF was generated on May 23, 2026  details.

                                        This field is used to indicate if the
                                        release must follow specific policies or
                                        regulations.

                                        Provides a detailed description of the
                                        release. This is a required field.

                                        A detailed description of the reasons to
                                        implement the release. It should be as
                                        detailed as possible.

                                        The completion code indicates the way
                                        a release is closed.
                                        VALID VALUES

                                             1 - Successful
                                             2 - Successful (with problems)
                                             3 - Failed
                                             4 - Rejected
                                             5 - Withdrawn
                                             6 - Cancelled

                                        This field contains comments about the
                                        status of the release when it is closed.

                                        The list of Configuration Items (CIs)
                                        affected by the release.

                                                                                                                        Page 313 of 387
Label                                                                                           Service Manager 9.81
Release Information
                                        Description
Backout Method
                                        The Release Information section
                                        records the Products being affected by
                                        the Release along with the Package
                                        Version of the release.

                                        Provides a detailed method for backing
                                        out the release if there is a problem
                                        during the deployment phase. This is a
                                        required entry during the Plan and
                                        Design phase.

 Label                                                                                          Service Manager 9.81
 Approvals
                                        Description
This PDF was generated on May 23, 2026
                                        The Current Approvals section
                                        provides an overview of the current
                                        approvals related to release and
                                        important information such as approval
                                        status, and approvers as well. This
                                        includes a list of groups or operators
                                        who must acknowledge or accept the
                                        risk, cost, and so on associated with
                                        the implementation of the release.
                                        Approvals give controlling authorities
                                        the ability to stop work and to control
                                        when certain work activities can
                                        proceed.

                                        The data displayed includes the
                                        following information:

                                             Approval Type
                                             Approval Status
                                             # Approved
                                             # Denied
                                             # Pending

                                        The Approval Log section provides an
                                        overview of past approvals related to
                                        the release as well as important
                                        information such as approval status
                                        and approvers. The data displayed
                                        includes the following information:

                                             Action
                                             Approver/Operator
                                             By
                                             Date/Time

                                        The Pending Reviews section provides
                                        the name(s) of the groups or operator
                                        IDs that should review the release after
                                        it has been approved.

                                                                                                                        Page 315 of 387

Label                                   Description
Tasks
                                        Whenever a release is in a phase
                                        where the user can generate tasks,
                                        Service Manager allows user a quick
                                        view of some of the most important
                                        fields in the task in the Tasks section.

                                        The data displayed includes the
                                        following information:

                                             Task No
                                             Status
                                             Approval Status
                                             Assigned To
                                             Description
                                             Category

 Label                                                                                          Service Manager 9.81
 Activities
                                        Description
This PDF was generated on May 23, 2026
                                        The Activities section allows users to
                                        enter new updates for the record or
                                        view journal updates and historic
                                        activities for the record.

                                        Journal Updates tab

                                             New Update Type
                                             Specifies or categorizes the
                                             activity update; for example,
                                             communication with the customer.

                                             Visible to Customer?

                                             A checkbox that a user can select
                                             to make the update visible to a
                                             customer.

                                             New Update

                                             This field is used to enter notes to
                                             explain and describe updates
                                             made for the record. If Journaling
                                             is enabled, the text entered here
                                             displays in Journal Updates. If
                                             Activities is enabled, the text
                                             entered in this field displays as an
                                             activity record for the selected
                                             activity type.

                                                           Note

                                                        The System
                                                        Administrator is
                                                        responsible for
                                                        enabling Journaling
                                                        and Activities.

                                             Journal Updates

                                                                                                                        Page 317 of 387
Label                                                                                           Service Manager 9.81
Test Results
                                        Description

                                             Journal Updates shows text
                                             entered in the New Update field
                                             along with the operator's name
                                             and a timestamp for the update.
                                             This field displays information
                                             when Journaling is enabled.

                                        Activity Logs tab

                                        Select an activity type from the Activity
                                        Type drop-down list or select a user
                                        from the User drop-down list to filter
                                        the activity logs.

                                        The activity log lists activities for the
                                        current record in order of occurrence,
                                        with the newest at the beginning of the
                                        list. Each activity log displays the
                                        following information:

                                             Date/Time
                                             Operator
                                             Description
                                             Type
                                             Visible to Customer icon (if you
                                             have selected the Visible to
                                             Customer checkbox)

                                        The Test Results section allows you to
                                        record the planned release testing
                                        activities along with an indicator of
                                        whether the test passed or failed and a
                                        description of the results of the test.

Label                                                                                           Service Manager 9.81
Attachments
                                        Description

                                        You can use the Attachments section to
                                        attach documents to releases.

                                        To attach a document to a release:

                                           1. Click Add File... in the
                                             Attachments section.

                                           2. Use the Specify File Location
                                             window to browse for the file.

                                           3. Click OK. The selected file
                                             appears in the Attachments
                                             section.

                                        Additional methods to attach files to an
                                        incident record with a Windows client
                                        include:

                                        You can cut or copy a file from a file
                                        management utility, or your desktop,
                                        and paste it into the Attachments
                                        section of a record. You can also cut or
                                        copy an attachment from one Service
                                        Manager record into the Attachments
                                        section of another record.

                                        Use a file management utility to open
                                        the folder containing the document you
                                        want to attach, or select a file from
                                        your desktop. Make sure that the
                                        Attachments section is open on your
                                        screen. Drag the selected file to the
                                        Attachments section.
````
