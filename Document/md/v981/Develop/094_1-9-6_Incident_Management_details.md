---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.9.6 .. 1.9.7
printed_pages: 2480-2506
---

# 1.9.6 Incident Management details

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.9.6. Incident Management details

Service Manager uses the Incident Management application to enable the Incident Management process. The main function of
Incident Management is to monitor, track, and record calls and open incidents as necessary.

In Incident Management, an Incident Analyst investigates, diagnoses, and proposes solutions for incidents. The Incident Analyst
escalates those incidents requiring a change to the Incident Coordinator.

This section describes selected Incident Management fields in the out-of-box Service Manager system. Topics in this section
include:

     Incident form after escalation from Service Desk
     Categorize incident form
     Investigate incident form
     Recover incident form
     Review incident form
     Incident Management form details


1.9.6.1. Incident form after escalation from Service Desk

The Incident Coordinator reviews incidents opened from the Service Desk and accepts or rejects each incident. The Incident
Coordinator then assigns the incident to an Incident Analyst for investigation and diagnosis.
Incident opened from Service Desk is illustrated in the following screenshot:

After saved, the incident enters Categorization phase, which is illustrated in the following screenshot:


1.9.6.2. Categorize incident form

The Incident Coordinator uses the incident categorization form to review the information, and then categorize the incident, set
expected resolution time, and assign the incident to an Incident Analyst in the appropriate support group.


1.9.6.3. Investigate incident form

The Incident Analyst uses the incident investigation form to analyze the issue and determine if the incident can be resolved, and
then updates the form accordingly. The Incident Manager uses the update incident form to monitor Service Level Agreement
(SLA) compliance, to initiate escalation actions, or to register an emergency change request. The fields and tabs available for
updating depend upon the assigned user role, assignment group, and the status of the incident.


1.9.6.4. Recover incident form

The Incident Analyst tries to apply the resolution to the incident after diagnosis. Based on the nature of the resolution, the
Incident Task, or the Change Management, Problem Management or vendor support is requested for assistance for the
resolution.


1.9.6.5. Review incident form

The Incident Coordinator verifies the incident resolution with the requester. If the requester is not satisfied with the resolution,
the Incident Coordinator can reassign, escalate or close the incident. If the requester is satisfied with the resolution, the Incident
Coordinator then close the Incident ticket after reviewing whether it is a problem candidate.


1.9.6.6. Incident Management form details

The following table identifies and describes some of the features on the Incident Management forms.

            Note

           When setting up events or web services to create incidents automatically, you must be sure to include all required
           fields for the incident.

Label                                                                                                                   Service Manager 9.81
Incident ID
Title                                   Incident Management form details

Tags                                                   Description

Description                                            The system-generated unique ID for this incident.

Phase                                                  A short description that summarizes the incident. This field is
                                                       prepopulated with data from an escalated interaction.
                                                       This is a required field.

                                                       Enter one or more free-form tags (keywords or terms) of this
                                                       incident. The tags you enter are searchable and can be used
                                                       as keywords to highlight important information.
                                                       For more information, see Working with tags.

                                                       A detailed description of the incident. This field is
                                                       prepopulated with data from an escalated interaction.
                                                       This is a required field.

                                                       This is a system-generated field.
                                                       These phases are available out-of-box:

                                                             Logging
                                                             Categorization
                                                             Investigation
                                                             Recovery
                                                             Review
                                                             Closure

 Label                                                                                            Service Manager 9.81
 Status
                                        Description
 Affected Service
 Affected CI                            Displays the status of the incident.
 CI is operational (no outage)          These statuses are available out-of-box:

This PDF was generated on May 23, 2026       Open — The incident has been opened but it's not
                                             currently being worked on.
                                             Categorize – The incident has been categorized
                                             Assign – The incident has been assigned to appropriate
                                             resource
                                             Work In Progress — The incident is being addressed.
                                             Pending Customer — You need more information from
                                             the customer
                                             Pending Vendor — You need something from the
                                             vendor
                                             Pending Evidence — You need evidence from the
                                             customer or vendor
                                             Pending Parent Incident — The incident has been linked
                                             to a parent incident and waiting for the resolution of the
                                             parent incident. This status is automatically set when
                                             an incident is linked to a parent incident.
                                             Pending Other — You need something from an outside
                                             source other than customer or vendor.
                                             Suspended — Customer has agreed to suspend the
                                             incident for a time; the incident will not appear in your
                                             Inbox for that period.
                                             Resolved — There is a resolution, but it has not yet
                                             been verified by the customer.
                                             Closed — The incident has been resolved and the
                                             customer agrees.

                                        The service affected by this incident. This field is populated
                                        with data from the interaction record.
                                        See Service Desk Interaction Management form details for
                                        additional information.
                                        This is a required field.

                                        The configuration item (CI) that's affecting the service
                                        negatively. This field is populated with data from the
                                        interaction record.
                                        See Service Desk Interaction Management form details for
                                        additional information.
                                        This field includes a hover-over form that displays Critical CI
                                        and Pending Change checkboxes to indicate whether or not
                                        these attributes apply to the CI.

                                        This field indicates that the item is currently operational and
                                        that there is no outage if selected (set to true). By default
                                        when you open an incident against a CI, the CI is flagged as
                                        down. If the CI is still working, you should mark this field.

                                                                                                                           Page 93 of 222
 Label                                                                                            Service Manager 9.81
 Outage Start
 Outage End                             Description
 Category
                                        The date and time when the outage started. The outage start
 Subcategory                            and outage end times are used to measure the availability for
                                        the Service Level Agreements (SLAs). If the CI is flagged as
This PDF was generated on May 23, 2026  down, availability SLAs start counting against the CI. The
                                        default availability value is the incident open and close times,
                                        but you should change this value to report the actual outage
                                        start and end times because it may be several minutes or
                                        hours before the incident is opened or closed. For example,
                                        the device may have gone down in the night and the incident
                                        is not opened until someone reports the problem. In this
                                        case, the default open time doesn't accurately reflect the
                                        outage time.

                                        The date and time when the outage ended. The outage start
                                        and outage end times are used to measure the availability for
                                        the SLAs. If the CI is flagged as down, availability SLAs start
                                        counting against the CI. The default availability value is the
                                        incident open and close times, but you should change this
                                        value to report the actual outage start and end times
                                        because it may be several minutes or hours before the
                                        incident is opened or closed. For example, the device may
                                        have gone down in the night and the incident is not opened
                                        until someone reports the problem. In this case, the default
                                        open time doesn't accurately reflect the outage time.

                                        This field describes the type of incident, based on ITIL
                                        service-centric processes. This field is prepopulated with
                                        data from the escalated interaction.

                                        This is a required field. A workflow is bound to a category.
                                        You must select a category before opening an incident form
                                        if the incident is not opened from an interaction and there is
                                        no default category specified.

                                        If required, the Incident Coordinator, Incident Manager, and
                                        Incident Analyst can update this field and the related
                                        subcategory and area fields for incidents assigned to them.
                                        This field is read-only, to update the category, they need to
                                        click More > Change Category menu option.

                                        The following categories are available for the out-of-box
                                        incidents:

                                             Complaint
                                             Incident
                                             Request for administration
                                             Request for information

                                        This field is prepopulated with the data from the interaction
                                        from which the incident is opened. The subcategory
                                        selections depend on the category.

                                        This is a required field when phase starts from
                                        Categorization.

                                        The out-of-box data is the same as in Interaction
                                        Management, but can be different. For additional
                                        information, see Service Desk Interaction Management form
                                        details and Interaction categories.

                                                                                                                           Page 94 of 222
 Label                                                                                            Service Manager 9.81
 Area
                                        Description
 Impact
                                        The third level of classifying an interaction, mainly used for
 Urgency                                reporting purposes. This field is prepopulated with the data
 Priority                               from the interaction from which the incident is opened.
 Major Incident                         Service Manager displays different lists of areas, depending
 Escalated                              on the subcategory selected. For more information on
 Requested By                           categories and the areas and subareas associated with
 Contact Person                         them, see Interaction categories.
                                        The out-of-box data is the same as in Interaction
This PDF was generated on May 23, 2026  Management, but can be different. For additional
                                        information, see Service Desk Interaction Management form
                                        details.

                                        This field is prepopulated with data from an escalated
                                        interaction. It specifies the impact the incident has on the
                                        business. The impact and the urgency are used to calculate
                                        the priority.
                                        These impacts are available out-of-box:

                                             Enterprise
                                             Site/Dept
                                             Multiple Users
                                             User

                                        This field is prepopulated with data from an escalated
                                        interaction. The urgency indicates how pressing the incident
                                        is for the organization. The urgency and the impact are used
                                        to calculate the priority. For additional information,
                                        seeService Desk Interaction Management form details.

                                        The order in which to address this incident in comparison to
                                        others. The priority value is calculated using initial impact
                                        and urgency. This field only appears for incidents being
                                        updated or escalated from interactions.

                                        If selected (set to true), this field indicates that the issue is a
                                        major issue, which requires informing the specified Incident
                                        Manager, and imputing review details under the Major
                                        Incident Review section.

                                        If selected (set to true), this field indicates that the incident
                                        needs to be escalated to Incident Manager, and possibly
                                        additional escalation teams also need to be aware of.

                                        The name of operator who opened the Incident ticket. This
                                        field is populated with the current operator.

                                        This field contains the contact name related to the company
                                        for this incident. This field ensures that the correct person
                                        will be notified about updates to the incident. This field is
                                        prepopulated with data from an interaction when a user
                                        opens an incident from an interaction.

                                                                                                                           Page 95 of 222
Label                                                                                             Service Manager 9.81
Location
Source                                  Description

Parent Incident                         The location for which the incident has been reported. This
Link to Parent Incident                 field is for informational purposes only.
                                        Location data is customer and implementation specific.

                                        The source from which the record is created.
                                        The following out-of-box sources are available:

                                             1 - User
                                             2 - Group
                                             3 - Event
                                             4 - Chat
                                             5 - Email
                                             6 - Telephone

                                        If selected (set to true), this field indicates that the incident is
                                        a parent incident, that allows other incidents link to it for
                                        issue classification, and the child incidents can be viewed
                                        under Child Incidents section. If unselected later after being
                                        selected, all the linked child incidents are unlinked. Once an
                                        incident is set as a parent incident, it can't be linked to a
                                        parent incident any longer.

                                        The ID of the parent incident. This field can be populated
                                        with incident ID based on predefined query for parent
                                        incidents. One incident can only be linked to one parent
                                        incident. Once linked to a parent incident, this incident can't
                                        be set as parent incident any longer.


Label                                                     Description

Categorization and Assignment section > Assignment Group  The support group assigned to work on this incident. The
                                                          affected service or CI specified in the interaction form
                                                          determines which default assignment group the system
                                                          assigns to incidents that were escalated from interactions.
                                                          An administrator assigns the default assignment group for a
                                                          service on the Configuration Item (CI) detail form for the CI.
                                                          When you search for the service in Configuration
                                                          Management (Configuration Management > Resources >
                                                          Search CIs), you see the default assignment group for the
                                                          service or CI specified in the Config admin group field. When
                                                          you escalate an interaction to an incident, the assignment
                                                          group is prepopulated, based on the CI or service (if no CI
                                                          selected, then based on selected service) selected in the
                                                          interaction. You can change the assignment group, if
                                                          necessary.

                                                          The out-of-box data consists of default assignment groups
                                                          for use as examples of types of assignment groups.

                                                          Tip

                                                          You may want to adapt the sample assignment
                                                          groups to meet your own needs.

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

                                                          This is a required field.

Categorization and Assignment section > Assignee          The name of the person assigned to work on this incident.
                                                          This person is a member of the assigned support group.
Categorization and Assignment section > Expected          Assignees may belong to one or multiple assignment groups,
Resolution Time                                           based on the needs of your company.
Workflow section
                                                          The Incident Coordinator can use this field to set an
                                                          expectation for incident resolution time.

                                                          Workflow section displays a figure of incident workflow. It
                                                          also indicates the current phase which the incident is in, and
                                                          traces the phase transition history.


Label                                                      Description
Tasks section
                                                           The user can add tasks whenever an incident is in a phase.
                                                           Every task has to be finished before close the incident. To
                                                           add a new task, click the Tasks section, and then click the
                                                           Link New Task button. Service Manager provides a quick
                                                           view of some of the most important fields in the task in the
                                                           Tasks section. The data displayed includes the following
                                                           information:

                                                                Task ID
                                                                Status
                                                                Phase
                                                                Priority
                                                                Title

Cost section                                               The user can add cost details of parts and labor for incident
                                                           handling. For parts cost, the user needs to add expense lines
Activities > Vendor/Supplier                               with the part number from product catalog and the quantity
Activities > Vendor/Supplier Record                        that have been used during the incident handling. For labor
Related Records section > Link Type                        cost, the user needs to add technicians who have been
                                                           working on the incident with the working hours. Select a
                                                           currency for cost calculation, then the total cost of the
                                                           incident will be calculated by the system.

                                                           The name of the vendor/supplier the incident is assigned to.
                                                           Used when a vendor/supplier needs to be involved in fixing
                                                           the incident.

                                                           This number refers to the incident number from the
                                                           vendor/supplier logging system. This is an informational field
                                                           for reference only. This field is only visible when incident
                                                           status is Pending Vendor/Supplier.

                                                           Specify a relation type between problem and target ticket.

                                                           These link type groups are available out-of-box:

                                                                Caused By Incidents
                                                                Caused Incidents
                                                                Caused By Changes
                                                                Related Interactions
                                                                Related Problems
                                                                Related Known Errors
                                                                Related Requests

Related Records section > Link Existing/New Record button  After select a link type, uses these two buttons to associate
                                                           the incident with target ticket, or create a new target ticket
                                                           and associate with this incident.

Label                                                                                                           Service Manager 9.81
Related Records section > All Related Records table
                                                      Description
Related Records section > Unlink Record button
Proposed Solution/Recovery Action section > Solution  Information of all related records of this problem is displayed
Proposed Solution/Recovery Action section > Problem   in this table.
Candidate
                                                      The data displayed includes the following information:
Closure Code
                                                           ID
Completion Comments                                        (Relation) Type
                                                           Phase
                                                           Status
                                                           Title

                                                      If you want to disassociate the incident with another ticket,
                                                      select the related ticket from All Related Records table, and
                                                      click this button to unlink these two tickets.

                                                      Provides a description of the solution for the incident.

                                                      If selected (set to true), this field indicates that the issue that
                                                      caused the incident is most likely a problem. When selected,
                                                      either a problem should have been created, or the incident
                                                      should have been associated with other problems. This field
                                                      is only enabled for users who have Expert rights. This
                                                      capability is specified on the Incident Management Security
                                                      Role area. When the Problem Management Candidate field is
                                                      checked for the incident, the incident appears in the Problem
                                                      Manager default view for incidents. The Problem Manager
                                                      can then review the incident to decide whether or not to
                                                      open a related problem. Examples of problem candidates
                                                      include cases where several customers report the same
                                                      issue or where an issue recurs repeatedly.

                                                      Specifies a predefined closure code to describe how the
                                                      incident has been resolved. The out-of-box options in this
                                                      field are based on customer reference data.

                                                                  Tip

                                                                 You may want to tailor these options to match
                                                                 your business needs.

                                                      These closure codes are available out-of-box:

                                                           Not Reproducible
                                                           Out of Scope
                                                           Request Rejected
                                                           Solved by Change/Service Request
                                                           Solved by User Instruction
                                                           Solved by Workaround
                                                           Unable to Solve
                                                           Withdrawn by User
                                                           No Fault Found
                                                           No User Response
                                                           Resolved Successfully
                                                           Diagnosed Successfully

                                                      This field is to document additional comments to close the
                                                      incident.

Label                                                                                             Service Manager 9.81
Affected Services
                                        Description
SLT >
Process Targets                         This section provides a list of affected services for the
SLT >                                   incident. When a configuration item for the incident is added
Uptime Targets                          or updated, a schedule record is created that runs a routine
                                        to update the list of affected services. If the incident is
SLT >                                   locked, the routine reschedules the schedule record for 5
Max Duration Targets                    minutes later.

                                        This subsection provides a list of process SLTs related to the
                                        incident. The information includes Agreement name, status,
                                        SLT name, From and To specifications for the Agreement,
                                        and Expiration. Similar information is available for
                                        interactions, problems, and changes.

                                        This subsection displays uptime availability data for the SLTs
                                        related to the incident.

                                        The data displayed includes the following information:

                                             Status
                                             SLT name
                                             Required Monthly Uptime (%)
                                             Withdrawn by User
                                             Current Uptime this Month (%)
                                             Next Expiration
                                             Affected CI
                                             SLT ID

                                        Similar information is available for interactions, problems,
                                        and changes.

                                        This subsection displays duration availability data for the
                                        SLTs related to the incident.

                                        The data displayed includes the following information:

                                             Status
                                             SLT name
                                             Total outages this month
                                             Average outage duration
                                             Next expiration
                                             Affected CI
                                             SLT ID

                                        Similar information is available for interactions, problems,
                                        and changes.

Label                                                                                             Service Manager 9.81
SLT >
Upcoming Alerts                         Description

SLT View                                This subsection displays all upcoming Agreement alerts to
                                        help users prioritize the incidents needing attention.
                                        The data displayed includes the following information:

                                             Alert name
                                             SLT name
                                             Alert time

                                                    Note

                                                   For additional information, see Service Level
                                                   Agreement alerts.

                                        If you set the View Type property of the Calendar control to
                                        Calendar or leave this property blank, this tab displays a
                                        normal view of the embedded Service Manager calendar.
                                        You can view the time period records and associated
                                        business records in a graphic and intuitive user interface. For
                                        more information about the Service Manager Calendar, see
                                        Calendar control and Calendar Administration.
                                        If you set the View Type property of the Calendar control to
                                        SLM, this tab visualizes the operation status for all related
                                        SLA, OLA, and UC of the current record. For more
                                        information about SLM visualization, see Visualize Service
                                        Level Management.


1.9.7. Problem Management overview

The Service Manager Problem Management application (Problem Management) supports the entire problem management
process. Problem Management provides comprehensive problem management that enables you to find, fix, and prevent
problems in the IT infrastructure, processes, and services.

Problem Management prevents problems and their resulting incidents, eliminates recurring incidents, and minimizes the impact
of those incidents that can't be prevented. It maximizes system availability, improves service levels, reduces costs, and improves
customer convenience and satisfaction.

This section describes how to implement the best practice guidelines for the problem management process in Problem
Management. This section includes the following topics:

     Problem Management within the ITIL framework
     The Problem Management application
     Problem management process overview
     Input and output of Problem Management
     Key Performance Indicators for Problem Management
     RACI matrix for Problem Management


1.9.7.1. Problem Management within the ITIL framework

Service Operation document. The document describes problem management as the process by which the lifecycle of all
problems is managed.
The main benefits of problem management are improved service quality and reliability. As incidents are resolved, information
about their resolution is captured. This information is used to identify and quickly resolve similar incidents in the future, and then
to identify and fix the root cause of those incidents.
Problem management functions both reactively and proactively.

     Reactive problem management resolves situations related to incidents. Reactive problem management is generally
     executed as part of the service operation process, and is based on incident history.
     Proactive problem management identifies and solves issues and known errors before incidents occur. Reactive problem
     management is generally driven as part of the continual service improvement process.

By actively preventing incidents, instead of reacting to them, an organization provides better service and operates more
efficiently.

Differences between Problem Management and Incident Management

Incident Management and Problem Management are separate, but closely-related, processes. Incident Management enables you
to restore service to users, whereas Problem Management manages the lifecycle of all problems and enables you to identify and
remove the underlying causes of incidents.

Contents

     1 Differences between Problem Management and Incident Management


1.9.7.2. Problem Management application

Problem Management helps you to minimize the effects of incidents caused by errors in the IT infrastructure. Problem
Management helps you to prevent these errors from recurring. With Problem Management, the appropriate people can identify
known errors, implement workarounds, and provide permanent solutions. Additionally, Problem Management enables you to
identify errors in IT infrastructure, record them, track the history, find resolutions for them, and prevent their recurrence.

Problem Management helps your personnel to record resolutions and make them easily available to affected user groups, to
react more quickly to issues related to incidents, and to proactively resolve issues before incidents occur. Over the long term, the
use of Problem Management reduces the volume of incidents, and saves time and money.

Problem Management workflows and categories

Problem Management comes with out-of-box workflows for problems (the “Problem” workflow) and known errors (the "Known
Error" workflow). These workflows are associated respectively with the out-of-box "problem" and "known error" categories. The
workflows ensure that the problem workflow automatically conforms to the ITIL workflow.

If your business needs require changes to the out-of-box workflow, you can define new workflows. To do this, copy the out-of-
box “Problem” workflow, add your own phases and transitions, and then associate the new workflow with the out-of-box
“problem” category (or a new category). Each new category that you define enables you to associate a different workflow with a
problem. If you define new categories, you can select one to be the default category for problems.

Problem tasks

Problem tasks have a single out-of-box task workflow (the “Problem Task” workflow) and four out-of-box task categories (the
“Categorization,” “Investigation,” “Resolution,” and “Review” task categories). The four problem task categories are associated
with that single workflow. You can define new workflows for problem tasks by copying and modifying the out-of-box workflow.
You can also change the task categories or add other task categories. You can define unique task categories for the tasks that
you assign to a problem.

            Note

           There are no out-of-box tasks for Known Error records.

Problem Management alerts

Problem Management creates automatic notifications. For example, it creates notifications when a problem or task opens, when
the owner changes, or when the status changes. It also escalates problems automatically when they're not addressed on pre-
agreed schedules. The expected resolution date is based on several elements, including discussion with the stakeholders.

Contents

     1 Problem Management workflows and categories
     2 Problem tasks
     3 Problem Management alerts


1.9.7.3. Problem Management process overview

The problem management process includes the activities that are required to identify and classify problems, diagnose the root
cause of incidents, and determine resolutions to related problems. The process ensures that the resolution is implemented
through the appropriate control processes, such as change management.

Problem Management includes the activities that are required to prevent the recurrence or replication of incidents. It enables you
to form recommendations for improvement, maintain problems, and review the status of corrective actions.

Proactive problem management encompasses problem prevention, ranging from the prevention of individual incidents (for
example, repeated difficulties with a particular system feature) to the formation of higher-level strategic decisions. The latter may
require major expenditures to implement, such as investment in a better network. At this level, proactive problem management
merges into availability management. Problem prevention also includes the information that's given to customers for future use.
This information reduces future information requests and helps to prevent incidents caused by lack of user knowledge and
training.

The following figure provides a general overview of the problem management processes and workflows. These workflows are
described in detail in Problem Management Workflows.

Problem management phases

Service Manager uses phases to describe the steps needed to resolve a problem. The phase also determines the forms users
see, the actions users can manually trigger. In an out-of-box system, most of the phase transitions are triggered by change to
the problem status.

The following figure shows the workflow phases for a problem.


The out-of-box known error workflow uses only two phases to differentiate the open and closed known error records. A known
error is opened with a documented root cause and workaround, and closed when a permanent solution is found.
The following figure shows the workflow phases for a known error:

Problem Management user roles

The following table describes the responsibilities of the Problem Management user roles.

Role                                                                                                                   Service Manager 9.81
Problem Manager
                                        Problem Management user roles
Problem Coordinator
                                                       Responsibilities
Problem Analyst
                                                            Communicate with stakeholders if required
                                                            Inform the Change Manager if required
                                                            Defer problems if needed
                                                            Decide on investigation of problems
                                                            Register Request for Changes or Service Requests to
                                                            solve problems
                                                            Validate proposed solutions to problems
                                                            Validate the outcome of closed changes and close
                                                            problem
                                                            Validate that a problem is solved
                                                            Conduct problem review and document lessons learned
                                                            Close problem and inform stakeholders
                                                            Monitor the problem resolution progress and perform
                                                            the required action

                                                            Periodically perform analysis to see if new problems
                                                            need to be registered
                                                            Register problems

                                                            Categorize and prioritize problems

                                                            Assign work to the Problem Analysts

                                                            Schedule the problem resolution

                                                            Coordinate root cause analysis and diagnosis

                                                            Identify and raise known errors

                                                            Investigate and diagnose assigned problems for
                                                            workarounds and/or root causes
                                                            Review and accept or reject assigned errors problems
                                                            or problem tasks
                                                            Investigate and diagnose assigned problems and
                                                            propose solutions and workarounds
                                                            Identify major problems and ensure problem manager
                                                            is notified
                                                            Implement corrective actions


1.9.7.4. Input and output for Problem Management

Problems can be triggered and resolved in several ways. The following table outlines the input and output of the Problem
Management process.

Input to Problem Management             Input and output for Problem Management

                                                           Output from Problem Management

Incidents for which the cause is not known and/or              Problems
incidents that are likely to recur (from incident              Known errors
management)                                                    Workarounds
Incidents that reveal that an underlying problem exists        Problem reports
(for example, an application error or bug)
Notification from a supplier or a product manager that a  (for example, status updates, trends, and performance)
problem exists (for example, from a development team
or supplier known error database)                              RFCs (to remove infrastructure errors)
Potential security breaches of products deployed in the
IT environment (for example, from suppliers or security               Note
analysts)
Analysis of incident trends and history (that is,                    Information on workarounds, permanent fixes, or
proactive problem management)                                        the progress of problems should be
Incident Management                                                  communicated to those who are affected and
                                                                     those who are required in order to support the
     Incidents classified as problem candidates                      affected services.
     Trend analysis and review of closed incidents (for
     which a workaround has been used to resolve the
     incident)
     Incident reports (trends, summary)
     Suspicion or detection of a cause of one or more
     incidents by the Service Desk, resulting in the
     creation of a problem record.
Event management
     Trend analysis and review of events (for example,
     performance events)
     Error logs
Configuration management
     Configuration details and relationships (service
     model)
Change management
     RFC and change request status, approval and
     closure.
Security management
     Notification of potential security breaches that
     require resolution
Suppliers (external providers)
Notification of problems from suppliers/vendors


1.9.7.5. Key performance indicators for Problem Management

The Key Performance Indicators (KPIs) in the following table are useful for evaluating your Problem Management processes. In
addition to the data provided by Service Manager, you may need additional tools to report all of your KPIs. To visualize trend
information, it is useful to display KPI data in graph form.

                                        Problem Management KPIs

Title                                   Description

Average time to diagnose                The average time to diagnose problems and to pinpoint the
                                        root cause in a given time period.

Average time to fix                     The average time to fix problem(s).

Number of new problems                  The total number of problems recorded in a given time
                                        period.

Number of solved problems               The total number of problems solved in a given time period.

Incidents caused by problems            The number of incidents occurring before the problem is
                                        resolved in a given time period.

For completeness, the ITIL 2011 and COBIT 4.1 KPIs are included below.

ITIL 2011 Key Performance Indicators

The following are ITIL 2011 KPIs for Problem Management:

     The total number of problems recorded in a given period (as a control measure)
     The percentage of problems resolved within the SLA targets; also the percentage not resolved within the SLA targets
     The number and percentage of problems that exceed target resolution times
     The backlog of existing problems, and the growth trend of the backlog (that is, static, reducing, or increasing)
     The average cost of handling a problem
     The number of major problems, including opened, closed, and backlogged
     The percentage of major problem reviews successfully performed
     The number of known errors added to the known error Database (KEDB)
     The percentage accuracy of the KEDB (from audits of the database)
     The percentage of major problem reviews that were completed successfully and on time

COBIT 4.1 Key Performance Indicators

The following are the COBIT 4.1 KPIs for Problem Management:

     Number of recurring problems that have a business impact
     Number of business disruptions caused by operational problems
     Percentage of problems recorded and tracked
     Percentage of problems that recur (within a time period), ranked by severity
     Percentage of problems resolved within the required time period
     Number of open, new, and closed problems, ranked by severity
     Average and standard deviation of the time lag between problem identification and resolution
     Average and standard deviation of the time lag between problem resolution and closure
     Average duration between the logging of a problem and the identification of the root cause
     Percentage of problems for which root cause analysis was completed
     Frequency of reports or updates to an ongoing problem, based on the problem severity

Contents

     1 ITIL 2011 Key Performance Indicators
     2 COBIT 4.1 Key Performance Indicators


1.9.7.6. RACI matrix for Problem Management

A Responsible, Accountable, Consulted, and Informed (RACI) diagram (or RACI matrix) is used to describe the roles and
responsibilities of the various teams or people that are responsible for delivering a project or operating a process.The matrix is
especially useful for clarifying roles and responsibilities in cross-functional/departmental projects and processes.The following
table displays the RACI matrix for Problem Management.

                                             RACI matrix for Problem Management

Process ID  Activity                    Problem  Problem                         Problem  Change

                                        Manager  Coordinator                     Analyst  Coordinator

SO 4.1      Problem                     A/I      R                               I

            Detection,

            Logging, and

            Categorization

SO 4.2      Problem                     A        C                               R

            Investigation and

            Diagnosis

SO 4.3      Problem                     A        C                               R        R

            Resolution

SO 4.4      Problem Review A/R                   C

            and Closure

SO 4.5      Problem                     A/R      C

            Monitoring
````
