---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.9.12 .. 1.9.14
printed_pages: 2581-2615
---

# 1.9.12 Change Management details

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.9.12. Change Management details

Service Manager uses the Change Management application to enable the Change Management process. The main function of
Change Management is to standardize the methods and processes a business organization uses to plan and implement changes.
Change Management records all changes to service assets and configuration items in the Configuration Management System
(CMS).

In Change Management, the Change Manager sends the change requests to the appropriate approvers and coordinates
Emergency Change handling. The Change Approver and approves or denies the change request. The Change Coordinator plans
the change implementation and verifies if the change has been completed satisfactorily, and the Change Analyst implements the
change.

This section describes selected Change Management fields in the out-of-box Service Manager system. Topics in this section
include:

     Change Management form after escalation from a problem
     Change Management form details


1.9.12.1. Change Management form after escalation from a
problem

The following figure shows an example new change request that's created from a problem record in Problem Management. As
with any new change, you must provide the required fields before you can save it. See Change Management form details for a
list and description of the fields on this form.


1.9.12.2. Change Management form details

The following table identifies and describes some of the features on the Change Management forms.

Label                                                                                                                       Service Manager 9.81
Change ID
Change Model                            Change Management field descriptions

Phase                                                     Description
Approval Status
                                                          This is a system-generated field assigned when the change
Change Requester                                          is opened.
Assignment Group
                                                          A change model is a record that's used to predefine the
                                                          contents of a specific type of Request for Change (RFC),
                                                          including the information used to populate the RFC and the
                                                          tasks that are needed to complete the change. When you
                                                          open a change request using a change model, most of the
                                                          necessary information is added to the change automatically.

                                                          This is a system-generated field that specifies the name of
                                                          the current phase of the change.

                                                          This is a system-generated field that defines the global
                                                          approval status for the change, not for a single approval. The
                                                          system sets this field depending on current approvals and
                                                          the approval type defined for the module.

                                                          These approval statuses are available out-of-box:

                                                                Pending
                                                                Approved
                                                                Denied

                                                          The name of the user requesting the change.

                                                          This is a required field. This field includes a hover-over form
                                                          that displays full name, telephone, and email address if
                                                          available for the user requesting the change.

                                                          The group assigned to work on the change. For a description
                                                          of this field see the Assignment Group field description in
                                                         the Incident Management form details section in Service
                                                         Manager Processes and Best Practices as this field functions
                                                          similarly. The out-of-box data consists of default assignment
                                                          groups for use as examples of types of assignment groups.

                                                          You may want to change the sample assignment groups to
                                                          meet your own needs.

                                                          These assignment groups are available out-of-box:

                                                                Application
                                                                Email / Webmail
                                                                Field Support
                                                                Hardware
                                                                Intranet / Internet Support
                                                                Network
                                                                Office Supplies
                                                                Office Support
                                                                Operating System Support
                                                                SAP Support
                                                                Service Desk
                                                                Service Manager

 Label                                                                                            Service Manager 9.81
 Change Coordinator
 Service                                Description
 Affected CI
 Location                               The person responsible for coordinating the change
 Title                                  implementation. Each Change Coordinator may belong to
 Description                            several assignment groups. Each group must have only one
 Scope                                  Change Coordinator.
 Category
 Impact                                 Specifies the service affected by the change. This is a
                                        system-generated field and is prepopulated when a change
 Urgency                                request is created from an interaction.
                                        This is a required field.
This PDF was generated on May 23, 2026
                                        The list of Configuration Items (CIs) affected by the change.
                                        The system prepopulates this field when a change request is
                                        created from an incident or problem. Users can add
                                        additional CIs. This field includes a hover-over form that
                                        displays checkboxes for Critical CI and Pending Change.

                                        Specifies the location for the change. The system
                                        prepopulates this field when the change is created by
                                        escalating an interaction.

                                        Provides a short description or a gist of the change. This is a
                                        required field.

                                        Provides a detailed description of the change. This is a
                                        required field.

                                        Provides a detailed description of the change scope.

                                        This is a system-generated field that classifies the type of
                                        change.

                                        This field is prepopulated with data from an incident when a
                                        change is created from an incident. It specifies the impact
                                        the problem has on the business. The impact and the
                                        urgency are used to calculate the priority.
                                        These impacts are available out-of-box:

                                             1 - Enterprise
                                             2 - Site/Dept
                                             3 - Multiple Users
                                             4 - User
                                        The out-of-box data is the same as Interaction Management,
                                        Problem Management, and Incident Management.
                                        This is a required field.

                                        The urgency indicates how pressing the change is for the
                                        organization. The urgency and the impact are used to
                                        calculate the priority. This field functions similarly to the
                                        same field for interaction, incident, and problem tickets. For
                                        more information, see User Interaction Management form
                                        details in Service Manager Processes and Best Practices.
                                        This is a required field.

                                                                                                                          Page 190 of 222
Label                                                                                             Service Manager 9.81
Priority
Risk Assessment                         Description

Financial Impact                        This is a system-generated field using the urgency and
Review Required                         impact of the change. This field functions similarly to the
Requested End Date                      same field for interaction, incident, and problem tickets. For
                                        additional information, see User Interaction Management
                                        form details in Service Manager Processes Processes and
                                        Best Practices.

                                        Specifies a code that indicates the risk incurred with the
                                        implementation of the change. This field becomes required
                                        in the Change Plan and Schedule phase.

                                        These risk assessments are available out-of-box:

                                             0 - No Risk
                                             1 - Low Risk
                                             2 - Some Risk
                                             3 - Moderate Risk
                                             4 - High Risk
                                             5 - Very High Risk

                                        After a user selects this field, the change may require
                                        additional approvals based on the risk. The approval is
                                        based on the risk number in the assessment approval record.
                                        This is a required field.

                                                    Note

                                                   This field becomes read-only if you have
                                                   selected the Enable Risk Assessment checkbox.
                                                   You need to click the Calculate Risk button to
                                                   calculate the risk.

                                        Specifies a code that indicates the financial impact of the
                                        change. These financial impact codes are available out-of-
                                        box:

                                             1 - High
                                             2 - Medium
                                             3 - Low

                                        This option specifies whether post-implementation review is
                                        required or not. By default, it is set to true for Emergency and
                                        Normal changes in the Risk and Impact Analysis phase, while
                                        false for Standard changes in the Plan and Schedule phase.
                                        This field can't be changed in subsequent phases.

                                        The system prepopulates this field if the change request is
                                        triggered from an interaction. This is the date the change
                                        initiator requests the change implementation. This is a
                                        required field if not prepopulated.

 Label                                                                                            Service Manager 9.81
 Alert Stage
                                        Description
 Scheduled Implementation Start
 Scheduled Implementation End           This is a system-generated field that lists the current Alert
 Scheduled Downtime Start               Stage of this request. Change Management updates this
 Scheduled Downtime End                 field automatically when processing alerts against this
 Configuration Item(s) Down             change. Do not update it manually. The alerts are processed
                                        against a change by using the phase definition. This field is
 Ex. Project Ref.                       not active in an out-of-box system and must be manually
 Implementation Plan                    enabled.
 Effect of not Implementing
 Change Owner                           This field specifies the date and time that the work to
 Subcategory                            implement the change should start. This field becomes
 Actual Implementation Start            required in the Plan and Schedule phase.
 Actual Implementation End
 Review Results                         This field specifies the date and time that the work to
                                        implement the change should end. This field becomes
This PDF was generated on May 23, 2026  required in the Plan and Schedule phase.

                                        The date and time when the change is scheduled to begin.
                                        Scheduled downtime only needs to be filled when the
                                        service is down, while implementing the change.

                                        The date and time when the change is scheduled to end.
                                        Scheduled downtime only needs to be filled when the
                                        service is down, while implementing the change.

                                        If selected (set to true), indicates that the Configuration
                                        Items (CIs) are currently not operational and the downtime is
                                        scheduled. The fields Scheduled Downtime Start and
                                        Scheduled Downtime End are used along with the field
                                        Configuration Item(s) Down to indicate the scheduled time to
                                        bring the CI down. These fields are never required and
                                        should only be populated if you plan to bring down the CIs as
                                        part of the change. The interval selected applies to all the
                                        CIs of the change and can't be specified by individual CI.
                                        When the change is closed, you may get the form confirming
                                        the outage times, and when you close the change, the CIs
                                        will be set as Up in Configuration Management.

                                        This field references an external project number.

                                        An assessment of the change, often generated by the
                                        Change Implementer, that the Change Coordinator uses to
                                        assess the impact of the change to services.

                                        The impact if not implementing the change. This is a
                                        required field.

                                        The name of the user owning the change. This is a required
                                        field.

                                        The subcategory is a breakdown of the category and
                                        describes the type of change in more detail.

                                        The time when the implementation actually began.

                                        The time when the implementation actually ended.

                                        Results of the review after Post Implementation Review, this
                                        is a required field.

                                                                                                                          Page 192 of 222

Label                                                      Description
Closure Code
                                                           The completion code indicates the way a change is closed.
Associated CIs section >
CMDB attributes need to be changed for CIs in the list     VALID VALUES
Completed/Cancelled CMDB attributes modifications
CMDB relationships need to be changed for CIs in the list       1 - Successful
Completed/Cancelled CMDB relationships modifications            Indicates the Change is completed successfully without
Affected Services section >                                     any issues.
Affected Services                                               2 - Successful (with problems)
Approvals section> Current Approvals                            Indicates the Change is closed but with some issues.

                                                                3 - Failed
                                                                Indicates the Change implementation is failed. The
                                                                Change is closed with a reason for the failure.

                                                                4 - Rejected
                                                                Indicates the Change is rejected by a Change
                                                                Coordinator or Change Owner.

                                                                5 - Withdrawn
                                                                Indicates the Change is withdrawn by the Change
                                                                Requester.

                                                                6 - Cancelled
                                                                Indicates the Change is cancelled by a Change
                                                                Coordinator or Change Owner.

                                                           The data in this section is used by the UCMDB integration
                                                           whenever there are past changes to the values registered for
                                                           the CI.

                                                           This provides a list of affected services. When a
                                                           configuration item for an incident is added or updated, a
                                                           schedule record is created that runs a routine to update the
                                                           list of affected services.

                                                           This section provides an overview of the current approvals
                                                           related to any changes for the CI, and important information
                                                           such as approval status, and approvers as well. This includes
                                                           a list of groups or operators who must acknowledge or
                                                           accept the risk, cost, and so on associated with the
                                                           implementation of a Change request or task. Approvals give
                                                           controlling authorities the ability to stop work and to control
                                                           when certain work activities can proceed.

                                                           The data displayed includes the following information:

                                                                Approval Type
                                                                Approval Status
                                                                # Approved
                                                                # Denied
                                                                # Pending

 Label                                                                                            Service Manager 9.81
 Approvals section> Approval Log
                                        Description
 Reason for Change
 Approval section > Pending Reviews     This subsection provides an overview of past approvals
 Cost section > Total Cost              related to the changes for the CI, as well as important
 Cost section > Currency                information such as approval status and approvers.
 Cost section > Parts table             The data displayed includes the following information:
 Cost section > Labor table
 Tasks                                       Action
                                             Approver/Operator
 Remediation Method                          By
 Remediation Comments                        Date/Time
                                             Phase
This PDF was generated on May 23, 2026
                                        A code that indicates the primary reason for implementing
                                        the request.
                                        Examples of reason codes are Incident/Problem Resolution
                                        and Business Requirement.

                                        The name(s) of the groups or operator IDs that should review
                                        the change for the CI after it has been approved.

                                        This field indicates the system-calculated total cost of the
                                        Change, which is accumulated by the parts and labor cost of
                                        the Change itself and its related Change tasks.

                                        Specifies a currency code used by the system to calculate
                                        the total cost.

                                        Specifies the parts used by the Change with their part
                                        numbers from the product catalog and the quantity used.

                                        Specifies the technician who worked on the Change and the
                                        actual working hours.

                                        Whenever a change is in a phase where the user can
                                        generate tasks, Service Manager allows user a quick view of
                                        some of the most important fields in the task in the Tasks
                                        section.
                                        The data displayed includes the following information:

                                             Task No
                                             Phase
                                             Status
                                             Description
                                             Category

                                        Indicates the remediation method: Full, or Partial.

                                        Provides a detailed method for backing out the change if
                                        there is a problem implementing the change. This is a
                                        required entry for all changes while backing out a change. It
                                        is also required in the "Release back out" phase and for the
                                        Release Management category in order to close the "Release
                                        plan and design" phase.

                                                                                                                          Page 194 of 222

1.9.13. Knowledge Management overview

The Service Manager Knowledge Management application, referred to as Knowledge Management throughout this chapter,
supports the Knowledge Management process.

Knowledge Management provides the framework to help you manage information throughout your IT Service Management life
cycle. The primary purpose of Knowledge Management is to improve efficiency by reducing the need to rediscover knowledge.

Knowledge Management processes can interact with other Service Manager processes (in particular, Interaction Management,
Incident management, and Problem management). The scope of this document is limited to the Knowledge Library and its
contents

Topics in this section include:

     Knowledge Management Within The ITIL Framework
     Knowledge Management Application
     Knowledge Management Process Overview
     Key Interfaces with Other Processes
     Key performance indicators for Knowledge Management
     RACI Matrix For Knowledge Management


1.9.13.1. Knowledge Management Within The ITIL Framework

Knowledge Management (KM) was added to ITIL v3 as part of Service Transition – the ITIL process that addresses the
development and deployment of new or changed services. Prior to ITIL v3, the Incident and Problem Management processes
were responsible for addressing the management of knowledge. But with the development of a specific Knowledge Management
process, ITIL v3 now provides a detailed set of guidelines and workflows for the management of all knowledge in the Service
Management life cycle. ITIL v3 also calls for the integration of the Knowledge Management process with Service Desk
(Interaction Management), Incident Management, and Problem Management.

The goal of Knowledge Management is to enable your organization to efficiently access, update, and share all knowledge that
pertains to the Service Management life cycle. Benefits of Knowledge Management include, but aren't limited to, the following:

     more efficient handling of knowledge
     the reduced likelihood that multiple stakeholders will attempt to solve the same problem in isolation without first sharing
     knowledge
     the ability to control the access of sensitive information to certain people

Central to Knowledge Management is a repository known as the Service Knowledge Management System (SKMS). A typical
SKMS stores all knowledge in a Knowledge Base. The items in the Knowledge Base are referred to as Knowledge Documents,
which can also include a variety of attachment types such as text files and graphics files. It also provides tools for handling
important tasks such as generating reports.

Service Manager not only acts as the SKMS, but it also goes one step further by providing Knowledge Center Support (KCS)
methodologies out-of-the-box. KCS methodologies specify ways to capture information from incidents to be used by analysts in
problem-solving. It also specifies that knowledge must by definition evolve over time as additional stakeholders review and
modify knowledge content.

Processes and Best Practices describes Knowledge Management as the process responsible for providing knowledge to all
other IT Service Management processes. Because the number of processes involved is very large, the scope of this document is
restricted to those processes related to storing new KM documents and updating, archiving, and retiring existing KM documents.


1.9.13.2. Knowledge Management Application

The Service Manager Knowledge Management application helps you manage all knowledge related to Interactions, Incidents,
and Problems.


1.9.13.2.1. Types of Knowledge Documents in Service Manager

Document types are templates for documents in Knowledge Management. Knowledge Management includes several default
document types:

     Question/Answer
     Problem-Solution
     Reference
     Error Message/Cause
     External


1.9.13.2.2. Knowledge Management Categories

All documents in the knowledge documents knowledge base are assigned to a document category. Categories for knowledge
documents are ordered into hierarchies. The document categories order documents into top-level categories and subcategories.
Each subcategory has a parent category that's the category immediately above it in the ordered list of categories. A top-level
category is also a parent category of the subcategory immediately below it in the ordered list of categories.


1.9.13.2.3. Knowledge Groups

Knowledge groups enable you to collect users into groups that have access to work with the same set of documents. A
knowledge group might be the user for a department, or a group of document authors, or a special group of users within your
organization such as subject matter experts.
You associate a knowledge group with at least one document category or subcategory to give the members of a knowledge
group access to documents in the category or subcategory and all subcategories below it. Access privileges can range from
search and view to publishing privileges depending upon what knowledge profile(s) you assign to the category.


1.9.13.2.4. Knowledge Management Profiles

The Knowledge Management profiles control access to knowledge documents as well as rights for creating, editing, and
administering documents.

Within each security profile, there is a direct association between a defined (named) profile and the categories and sub-
categories for which the selected capabilities apply. Each security profile maps to a document category or sub-category. A user
with that profile has access to the documents specified by the profile-to-category mapping and all subcategories in that branch
of the category tree.

Profiles can be modified to select only some of the available capabilities for a profile, effectively creating sub-profiles. For
example, some users may not be allowed to publish knowledge documents externally as well as internally.

The out-of-box KM security profiles are briefly described in the following table:

KM Profile                              Contribute And Approve Knowledge/Change Request Process

                                                                   Privileges

DEFAULT                                 With this profile, a user can search and view externally
                                        published knowledge documents for those documents in
                                        categories to which this profile has access. They can also
                                        submit feedback on these documents.

INTERNAL USER                           With this profile, a user can search and view externally
                                        published knowledge documents for those documents in
                                        categories to which this profile has access. They can also
                                        search and view internally approved knowledge documents
                                        for those documents in categories to which this profile has
                                        access. They can also submit feedback on these documents.

KCS I                                   Author and contribute knowledge documents.

KCS EDITOR                              Editor Author knowledge documents and edit working copy
                                        documents in the workflow for those categories to which this
                                        profile has access.

KCS II                                  Author knowledge documents, contribute knowledge
                                        documents, edit published documents without placing them
                                        in workflow (edit in place), and publish documents internally
                                        only. Also, view adaptive learning data when adaptive
                                        learning is enabled in the system.

KCS III                                 Author knowledge documents, contribute knowledge
                                        documents, edit published documents without placing them
                                        in workflow (edit in place), and publish documents internally
                                        and externally. Also, view adaptive learning data when
                                        adaptive learning is enabled in the system.

KM ADMIN                                Author knowledge documents, contribute knowledge
                                        documents, edit published documents without placing them
                                        in workflow (edit in place), and publish documents internally
                                        and externally. Also, view adaptive learning data when
                                        adaptive learning is enabled in the system.


1.9.13.2.5. Generic OOB Knowledge Management Document
Phases

KM documents pass through the following generic out-of-box phases:

   1. Draft
   2. Triage
   3. Revise
   4. Review
   5. Conclude

Draft

A Knowledge Contributor creates a draft document by first selecting one of the following document types:

     Error Message/Cause: a specific error message a user encountered and what the user was doing when the error occurred
     External: files, such as text or graphic files, that can be associated with incidents and problems

     Question/Answer: a general question and its corresponding answer

     Problem/Solution: a specific problem, including its probable cause, and a corresponding solution

     Reference: general information

     Once a draft is created, the Knowledge Document is said to be a Working copy. Note that in the Service Manager
     Knowledge Management application, a working copy of a published document has an "R" appended to the document ID. A
     new document submitted to be published is also considered a working copy while it is in workflow waiting to be published,
     but there is no "R" appended to the document ID.

Triage

After the contributor enters the relevant details and submits the draft document, it enters the Triage state. The purpose of the
Triage state is to allow a KM analyst to review the submission and determine if it would make an appropriate document. The
analyst can also perform minor modifications of the content to ensure stylistic quality. If the document is acceptable, the analyst
submits it to a specific KM expert for revision.

Revise

The purpose of the Revise state is to give a subject matter expert the chance to add or modify content that would improve the
document. After revising the document, the KM expert submits the document for review to the KM team.

Review

The purpose of the Review state is to give the KM team a chance to finally decide if the document is ready for publication. The
KM team can send the document back for further revision or to accept the document.

Conclude

            Note

           This is the Publish phase in the out-of-box KM workflow.

The purpose of the Conclude stage is to allow the assigned owner on the KM team to determine what to do with the document.
The owner has the following options:

     If the document is new, the owner can approve and publish the submission, or terminate the KM record to prevent
     publication of the document.
     If the document already exists and was resubmitted for revision and review, the owner can publish the revised version,
     revert to the original version, or retire the document.

Documents can also be retired when they are no longer useful. A retired document is a knowledge document that's no longer
searched during a knowledge base search.


1.9.13.3. Knowledge Management Process Overview

A general overview of the Knowledge Management processes and workflows is depicted in the following figure. Workflows are
described in detail in Knowledge Management Workflows.

Knowledge Management User Roles

The following table describes the responsibilities of the Knowledge Management roles.

Role                                                                                                                     Service Manager 9.81
Knowledge Management Process Owner
                                        Knowledge Management User Roles
Knowledge Manager
                                                        Responsibilities
Knowledge Expert
Knowledge Analyst                                             Accountable for the definition, management,
                                                              governance and improvement of the KM Process
                                                              Ensures that the KM process and working practices are
                                                              effective and efficient
                                                              Ensures that all stakeholders are sufficiently involved in
                                                              the KM process
                                                              Ensures that (business) management is sufficiently
                                                              informed as to the volume, impact and cost of
                                                              Knowledge
                                                              Ensures tight linkage between the KM process and
                                                              other related processes

                                                              Implementation and ongoing management of the
                                                              Knowledge Management process
                                                              Championing the Knowledge Management process with
                                                              people at all levels
                                                              Management of Knowledge Analysts
                                                              Ensuring process efficiency and consistency
                                                              Final QA and approval of all Knowledge Submissions
                                                              Deciding the scope of publishing (external and / or
                                                              internal)
                                                              Continual improvement of the Knowledge Library and
                                                              process
                                                              Fast tracking urgent 'Hot News' notices through the KM
                                                              process
                                                              Reviewing KM reports
                                                              Identifying, allocating and tracking continual
                                                              improvement actions and maintenance activities

                                                              Reviewing and amending Knowledge Submissions
                                                              Rejecting Knowledge Submissions based on technical
                                                              content
                                                              Assisting with reviews of Knowledge Documents for
                                                              currency and relevance

                                                              Administering the KM process
                                                              Reviewing Knowledge Candidates for basic content,
                                                              spelling, format, readability, duplication and editing to
                                                              achieve a consistent quality level
                                                              Rejecting inappropriate or duplicated Knowledge
                                                              Submissions
                                                              Co-ordinating Knowledge Expert reviews and reviewing
                                                              Knowledge Document feedback and identifying
                                                              improvements
                                                              Producing and distributing KM reports
                                                              Driving periodic reviews of Knowledge and co-
                                                              ordinating and / or performing improvement actions
                                                              Retiring Knowledge Documents no longer deemed
                                                              relevant

Role                                                                                              Service Manager 9.81
Knowledge Contributor
                                        Responsibilities
Knowledge User
                                             Identifying Knowledge Submissions
                                             Identifying changes required to existing Knowledge
                                             Documents
                                             Submitting new or revised Knowledge Submissions
                                             Assisting with reviews of Knowledge Documents for
                                             currency and relevance

                                             Maintaining awareness of the KM facilities
                                             Searching the Knowledge Base for solutions
                                             Providing feedback on Knowledge Documents

                                                    Note

                                                        Self-Service will only access the
                                                        Knowledge Library
                                                        Operator record search will access
                                                        Interaction, Incident, Known Error and
                                                        Knowledge libraries


1.9.13.4. Key Interfaces with Other Processes

The following table shows how Knowledge Management is linked with other Service Manager processes.

Process                                 Input and output for Knowledge Management

                                                            Description

SO 0 – Interaction Management           Knowledge documents may be used in the resolution of
                                        Incidents, either via the Service Desk or self-service.
                                        Feedback on the knowledge documents will feed in to the
                                        Knowledge Management process.

SO 2 – Incident Management              During the Incident resolution process, KM documents can
                                        be submitted that specify how an analyst found a resolution
                                        or workaround.

SO 4 – Problem Management               Information on Known Errors and workarounds may be used
                                        to create Knowledge Documents.


1.9.13.5. Key performance indicators for Knowledge
Management

The Key Performance Indicators (KPIs) in the following table are useful for evaluating your Knowledge Management processes.
To visualize trend information, it is useful to graph KPI data periodically. In addition to the data provided by Knowledge
Management, you may need additional tools to report on all of your KPI requirements.

Title                                   Key Performance Indicators for Knowledge Management

                                                                Description

Number of KM documents created                       The total number of KM documents in your organization will
                                                     grow over time; however, older KM documents will gradually
                                                     become outdated and should be retired. Monitor the number
                                                     of newly created documents to determine the optimal rate of
                                                     growth over a period of time.

Number of times a KM document is accessed            A useful document is accessed frequently. Use this indicator
                                                     to figure out which documents are the most and least useful.

Number of KM documents used to resolve Interactions  KM documents should ultimately lead to resolutions. Monitor
                                                     the number of KM documents that lead to resolutions of
                                                     Interactions to help determine how successfully your Service
                                                     Desk is able to access and reuse knowledge.

Number of KM documents used to resolve Incidents     Monitor the number of KM documents that lead to
                                                     resolutions of Incidents to help determine how successfully
                                                     KM documents help resolve serious issues that have been
                                                     escalated to Incidents.

Number of KM documents with an expired review date   To ensure the efficiency of the document publication
                                                     process, monitor the number of documents that have not
                                                     been reviewed in a timely manner.


1.9.13.6. RACI Matrix For Knowledge Management

A Responsible, Accountable, Consulted, and Informed (RACI) diagram or RACI matrix is used to describe the roles and
responsibilities of various teams or people in delivering a project or operating a process. It is especially useful in clarifying roles
and responsibilities in cross-functional/departmental projects and processes. The RACI matrix for Knowledge Management is
shown in the following table.

                                        RACI Matrix For Knowledge Management

Process ID  Activity                    Knowledge    Knowledge  Knowledge     Knowledge  Knowledge
                                        Contributor  Analyst    Expert        Manager    User

ST 7.1      Contribute and R                         R          C             A/R

            Approve

            Knowledge

ST 7.2      Search, View                                                      A          R
            and Utilise
            Knowledge

ST 7.3      Maintain and R                           R          R             A/R

            Continually

            Improve

            Knowledge


1.9.14. Knowledge Management workflows

The Knowledge Management process collects, organizes, structures, and distributes knowledge for ongoing use. It is
responsible for ensuring that an organization can archive and retrieve knowledge in an efficient manner.
The Knowledge Management process consists of the following processes that are included in this chapter.

     Contribute and Approve Knowledge Document (process ST 7.1)
     Search, View and Utilize Knowledge Document (Process ST 7.2)
     Maintain and Continually Improve Knowledge (Process ST 7.3)


1.9.14.1. Contribute and Approve Knowledge Document
(process ST 7.1)

The Contribute and Approve Knowledge Document process starts with the submission of a KM document. You can contribute a
knowledge document by authoring knowledge articles or using external documents that are uploaded into a knowledge base.
You can use the rich-text editor to author documents, and you can add documents as attachments that can include images, text
files, Word files, or PDFs.

     The process begins when a contributor creates a new submission or revising an existing knowledge document. The
     contributor selects a documentation type, enters basic details, selects a category type, and submits the draft for review by
     a Knowledge Analyst.
     The analyst can edit, accept, or reject the document. If necessary, the document can be passed to a Knowledge Expert,
     who can also edit, accept, or reject it. The Knowledge Expert is typically a subject-matter expert with more in depth
     understand of a give topic and the ability to determine the accuracy and currency of the KM document.
     The Knowledge Manager makes the final decision about whether to accept the document or return it for further revision. If
     the document meets all KM publication criteria, the Knowledge Manager accepts and publishes the document.

The Contribute And Approve KM Doc/Change Request Workflow is illustrated in the following figure:


                                        Contribute And Approve Knowledge/Change Request Process

Process ID  Procedure or Decision          Description                                           Role
ST 7.1.1
            Populate Knowledge details     Enter details of the                                  Knowledge Contributor
ST 7.1.2                                   Knowledge Submission into
ST 7.1.3                                   Service Manager.
ST 7.1.4                                   Suggestions for new or
                                           improved KM documents
ST 7.1.5                                   can be received from a
                                           number of areas including
                                           Incident and Problem
                                           Management. Go to ST 7.1.2
                                           to select the appropriate
                                           Knowledge category.

            Select Knowledge category      Select the appropriate                                Knowledge Contributor
                                           category from those
                                           available within Service
                                           Manager. Go to ST 7.1.3 to
                                           submit the Knowledge
                                           Submission.

            Submit for approval            Submit the Knowledge                                  Knowledge Contributor
                                           Submission for approval by
                                           the Knowledge team.

                                           Go to ST 7.1.4 in order for
                                           the Knowledge Analyst to
                                           perform an initial review and
                                           check for duplicates.

            Initial review and duplicates  The Knowledge Submission                              Knowledge Analyst
            check                          is reviewed to ensure all
                                           required information has
            Reject Knowledge               been provided and in the
            Submission?                    correct format. A check is
                                           also done against other
                                           recent Knowledge
                                           Submissions to avoid
                                           duplication of effort. Go to
                                           ST 7.1.5 to determine
                                           whether to reject the
                                           Knowledge Submission.

                                           The Knowledge Submission                              Knowledge Analyst
                                           will be rejected if the
                                           Knowledge Analyst feels it's
                                           not valid or if it is a
                                           duplication of another
                                           existing proposal. If yes, go
                                           to ST 7.1.6 to inform the
                                           Knowledge Contributor of
                                           the reasons for rejection. If
                                           no, go to ST 7.1.7 to edit the
                                           Knowledge Submission.


Process ID  Procedure or Decision       Description                      Role
ST 7.1.6    Retire Knowledge
ST 7.1.7    Submission and inform       Inform the Knowledge             Knowledge Analyst
            Contributor of reason(s)    Contributor of the reasons
ST 7.1.8    Edit Knowledge Submission   for the Knowledge
            and notify Contributor      Submission being rejected.
ST 7.1.9                                The ‘Contribute and Approve
ST 7.1.10   Expert Review Required?     Knowledge’ process ends.

            Perform Expert review       Add any comments /               Knowledge Analyst
                                        additional information to the
            Reject Knowledge            Knowledge Submission
            Submission?                 ready for further review and
                                        approval, and notify the
                                        Knowledge Contributor. Go
                                        to ST 7.1.8 to determine
                                        whether an expert review is
                                        required.

                                        Some Knowledge                   Knowledge Analyst
                                        Submissions can be
                                        managed by the Knowledge
                                        team only. If the Knowledge
                                        Submission refers to a
                                        specialised area, an expert
                                        will be asked to review and
                                        approve it. If yes, go to ST
                                        7.1.9 for the Knowledge
                                        Expert to review the
                                        Knowledge Submission. If
                                        no, go to ST 7.1.12 for the
                                        Knowledge Manager to
                                        perform a QA review.

                                        Review the Knowledge             Knowledge Expert
                                        Submission. Go to ST 7.1.10
                                        to determine whether to
                                        reject the Knowledge
                                        Submission.

                                        If the Knowledge Expert          Knowledge Expert
                                        believes the Knowledge
                                        Submission is invalid, they
                                        can decide to reject it and
                                        provide reasons which will
                                        be provided to the
                                        Knowledge Contributor. If
                                        yes, go to ST 7.1.6 to inform
                                        the Knowledge Contributor
                                        of the rejection reason. If no,
                                        go to ST 7.1.11 to edit the
                                        Knowledge Submission.


Process ID  Procedure or Decision       Description                      Role
ST 7.1.11   Edit Knowledge Submission
            and notify Contributor      Add comments / additional        Knowledge Expert
ST 7.1.12                               information to the
ST 7.1.13   Perform QA Review           Knowledge Submission
                                        ready for further review and
ST 7.1.14   Approve                     approval. Notify the
ST 7.1.15   Publication?                Knowledge Contributor if
                                        any amendments have been
            Confirm publication         made. Go to ST 7.1.12 in
            audience and dates          order for the Knowledge
            Publish                     Manager to perform a QA
                                        review.

                                        The Knowledge Manager            Knowledge Manager
                                        performs a final review of
                                        the Knowledge Submission
                                        to ensure that it is consistent
                                        with the quality and format
                                        of the rest of the Knowledge
                                        Documents. Go to ST 7.1.13
                                        to decide whether or not to
                                        approve the Knowledge
                                        Submission for publication.

                                        Once the Knowledge               Knowledge Manager
                                        Manager is sure that the
                                        Knowledge Submission has
                                        had the necessary checks
                                        and approvals, they will
                                        decide whether or not to
                                        publish it. If yes, go to ST
                                        7.1.14 to confirm the correct
                                        audience & dates for
                                        publication. If no, go to ST
                                        7.1.6 for the Knowledge
                                        Analyst to inform the
                                        Knowledge Contributor of
                                        the rejection reason.

                                        Confirm the appropriate          Knowledge Manager
                                        audience for the Knowledge
                                        Submission and if there are
                                        any restrictions or deadlines
                                        associated with its
                                        publication. Go to ST 7.1.15 to
                                        publish.

                                        Publish the Knowledge            Knowledge Manager
                                        Submission to the
                                        Knowledge Base. The
                                        ‘Contribute and Approve
                                        Knowledge’ process ends.


1.9.14.2. Search, View and Utilize Knowledge Document
(Process ST 7.2)

The Knowledge Base is the central repository of the Knowledge Management system. Service Manager provides powerful
search and retrieval functionality for accessing, retrieving, and displaying knowledge documents. Searches can be performed
using Filters and even Boolean searches are allowed.
Each type of Knowledge Bases has different fields that are indexed for searching, so specific search parameters that match the
fields in the knowledge base must be provided. For example, the knowledge articles have a title and author field. When you view
an incident, the out-of-box system displays the incident number, incident description, and solution for closed incidents.
Search, View and Utilize Knowledge process is illustrated in the following figure:


                                        Search, View And Utilize Knowledge Process

Process ID  Procedure or Decision       Description                                 Role
ST 7.2.1
            Search Knowledge Base       Enter search criteria into the              Knowledge User
ST 7.2.2                                tool. Search queries can be
ST 7.2.3                                entered by users through
                                        the Self Service functionality
ST 7.2.4                                or by Operators from the
ST 7.2.5                                Interaction, Incident and
                                        Problem Management
ST 7.2.6                                modules (this is shown in
                                        grey on the process flow as
                                        they're not always present
                                        when this process is
                                        followed.). Go to ST 7.2.2 to
                                        review items found.

            Review Items Found          Review search results and                   Knowledge User
                                        determine whether any are
                                        appropriate. Go to ST 7.2.3
                                        to refine or amend the
                                        search, if necessary.

            Refine or change search     If appropriate Knowledge                    Knowledge User
                                        Documents have not been
                                        returned, the search criteria
                                        can be amended to obtain
                                        better results. If yes, go to
                                        ST 7.2.1 to search the
                                        Knowledge Base again. If
                                        no, go to ST 7.2.4 to
                                        determine whether relevant
                                        Knowledge has been found.

            Relevant Knowledge Found?   Has a Knowledge Document                    Knowledge User
                                        been returned that's helpful
                                        and relevant to the query? If
                                        yes, go to ST 7.2.6 to Utilize
                                        Knowledge where
                                        appropriate. If no, go to ST
                                        7.2.5 to determine whether
                                        to log an Interaction.

            Log Interaction?            If a suitable Knowledge                     Knowledge User
                                        Document was not found, an
                                        Interaction may need to be
                                        raised to deal with the issue
                                        that was being researched.
                                        If yes, go to Interaction
                                        Management (SO 0.1.1). If
                                        no, the ‘Search, View and
                                        Utilize Knowledge’ process
                                        ends.

            Utilize Knowledge (where    Apply the Knowledge where                   Knowledge User
            appropriate)                appropriate. Go to ST 7.2.7
                                        to determine whether to
                                        provide feedback on the
                                        Knowledge Document.


Process ID  Procedure or Decision       Description                   Role
ST 7.2.7    Provide feedback on                                       Knowledge User
            Knowledge Use?              Feedback is monitored for
ST 7.2.8                                key aspects such as quality
            Populate Knowledge          and availability of the
            feedback                    Knowledge Documents. If
                                        yes, go to ST 7.2.8 to
                                        populate Knowledge
                                        feedback.

                                        If no, the ‘Search, View and
                                        Utilize Knowledge’ process
                                        ends.

                                        Populate feedback on the      Knowledge User
                                        Knowledge Document used.
                                        The ‘Search, View and
                                        Utilize Knowledge’ process
                                        ends.


1.9.14.3. Maintain and Continually Improve Knowledge (Process
ST 7.3)

The Maintain And Continually Improve Knowledge process:
     Records the details of new knowledge (documents)
     Updates existing knowledge (documents) where there is any inaccuracy or incompleteness
     Removes obsolete knowledge (documents)

The process is performed by the Knowledge Contributor, Knowledge Analyst, Knowledge Expert, or Knowledge Manager.
Details for this process can be seen in the following figure and table.
The Maintain and Continually Improve Knowledge Workflow is illustrated in the following figure:


                                        Maintain and Continually Approve Knowledge

Process ID  Procedure or Decision         Description                               Role
ST 7.3.1
ST 7.3.2    Produce / distribute KM       Produce and distribute KM                 Knowledge Analyst
ST 7.3.3    reports                       reports to the Knowledge
ST 7.3.4                                  Manager. Go to ST 7.3.2 for
                                          the Knowledge Manager to
ST 7.3.5                                  review the KM reports.
ST 7.3.6
ST 7.3.7    Review KM reports             Review the reports for any                Knowledge Manager
ST 7.3.8                                  issues with the tool or
                                          process. Go to ST 7.3.3 to
                                          determine required actions.

            Actions required?             Identify whether any                      Knowledge Manager
                                          additional actions need to be
                                          taken. If yes, go to ST 7.3.4
                                          to co-ordinate / perform
                                          actions. If no, the ‘Maintain
                                          and Continually Improve
                                          Knowledge’ process ends.

            Co-ordinate / perform         Review the identified actions             Knowledge Analyst
            actions                       and resolve any that don't
                                          need Knowledge Contributor
                                          or Knowledge Expert
                                          involvement. Go to ST 7.3.5
                                          to determine whether action
                                          is required by the
                                          Knowledge Contributor.

            Contributor action required?  If yes, go to ST 7.3.6 for the            Knowledge Analyst
                                          Knowledge Contributor to
                                          perform the required
                                          actions. If no, go to ST 7.3.7
                                          to determine whether action
                                          is required by a Knowledge
                                          Expert.

            Perform required actions      Implement appropriate                     Knowledge Contributor
                                          actions to resolve the issue
                                          identified in the KM report.
                                          Go to ST 7.3.7 to determine
                                          whether action is required
                                          by a Knowledge Expert.

            Expert action required?       If yes, go to ST 7.3.8 for the            Knowledge Analyst
                                          Knowledge Expert to
                                          perform the required
                                          actions. If no, go to ST 7.3.9
                                          to determine whether to
                                          revise the Knowledge
                                          Document.

            Perform required actions      Implement appropriate                     Knowledge Expert
                                          actions to resolve the issue
                                          identified in the KM report.
                                          Go to ST 7.3.9 to determine
                                          whether to revise the
                                          Knowledge Document.


Process ID  Procedure or Decision       Description                        Role
ST 7.3.9
            Revise Knowledge            If yes, go to ST 7.1.1 for the     Knowledge Analyst
ST 7.3.10   Document?                   Knowledge Contributor to
ST 7.3.11                               populate Knowledge details.
ST 7.3.12                               Note: The Knowledge
ST 7.3.13                               Analyst is the Knowledge
                                        Contributors role in this
                                        scenario. If no, go to ST
                                        7.3.10 to determine whether
                                        to retire the Knowledge
                                        Document.

            Archive Knowledge           If yes, go to ST 7.3.11 to retire  Knowledge Analyst
            Document?                   the Knowledge Document. If
                                        no, go to ST 7.3.12 to report
                                        on progress against actions.

            Retire Knowledge Document   Archive the Knowledge              Knowledge Analyst
                                        Document in order for it to
                                        be no longer available in
                                        searches of the Knowledge
                                        Base. Go to ST 7.3.12 to
                                        report on progress.

            Report on progress          Provide the Knowledge              Knowledge Analyst
                                        Manager with a progress
                                        report on any outstanding
                                        actions. Go to ST 7.3.13 in
                                        order for the Knowledge
                                        Manager to review
                                        progress/success.

            Review progress/success     Review progress on actions         Knowledge Manager
                                        identified and determine
                                        whether any additional
                                        actions are required. Go to
                                        ST 7.3.3 determine whether
                                        additional actions are
                                        required.
````
