---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.9.10 .. 1.9.11
printed_pages: 2543-2581
---

# 1.9.10 Change Management overview

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.9.10. Change Management overview

The Service Manager Change Management application, referred to as Change Management throughout this chapter, supports
the Change Management process. It controls the process to request, manage, approve, and control changes that modify your
organization’s infrastructure. This includes assets such as network environment, facilities, telephony, and resources. Change
Management enables you to control the changes to baseline service assets and configuration items across the entire service
lifecycle.

This section describes how Change Management implements the best practice guidelines for the Change Management
processes.

Topics in this section include:

     Change Management within the ITIL framework
     Change Management application
     Change Management process overview
     Input and output for Change Management
     Key performance indicators for Change Management
     RACI matrix for Change Management


1.9.10.1. Change Management within the ITIL framework

Change Management is addressed in ITIL’s Service Transition publication. The document describes Change Management as the
process responsible for ensuring that changes are recorded, evaluated, planned, tested, implemented, and reviewed in a
controlled manner.

Change Management enables you to meet the following business objectives:

     Use standardized methods and procedures to ensure efficient and prompt handling of all changes.
     Record all changes to service assets and configuration items (CIs) in the Configuration Management System (CMS).
     Minimize overall business risk.
     Respond to customers’ changing business requirements, maximize value and reduce the number of incidents, disruptions,
     and rework.
     Respond to business and IT requests for changes, aligns services with business needs.

The ITIL Change Management process model includes

     The steps to follow to handle a change
     The order in which the steps are to be followed
     Roles and responsibility of the stakeholders
     Scheduling and planning
     When and how to escalate a change


1.9.10.2. Change Management application

The primary objective of Change Management is to enable beneficial changes to be made with minimal disruption to IT Services.
Changes are recorded, evaluated, authorized, prioritized, planned, tested, implemented, documented, and reviewed in a
controlled manner. Change Management objectives are achieved by rigorous adherence to the process steps.

The Change Management application incorporates the essential change management concepts of ITIL to ensure that the best
practices of IT service management are applied to the application.

Differences between Change Management and Request Fulfillment

Change Management and Request Fulfillment are separate processes, but they are closely related. Change Management handles
any change to your business that modifies or disrupts the current state of that environment. Usually these modifications or
disruptions affect multiple users or business units. Request Fulfillment handles common user requests for products and services.
These requests usually affect only the person making the request, or a subordinate group of employees.

     Change Management
           Manages changes (implementations) that modify a business environment.
           Affects many users.
           Scope is often large, including large groups or multiple business units.

     Request Fulfillment
           Handles common requests for products and services.
           Affects a small or limited number of users.
           Scope is limited.

Contents

     1 Differences between Change Management and Request Fulfillment


1.9.10.3. Change Management process overview

The Change Management process includes the activities necessary to control changes to service assets and configuration items
across the entire service lifecycle. It provides standard methods and procedures to use when implementing all changes.
The purpose of Change Management is to ensure that:

     Changes follow a set process.
     Appropriate users are notified at key points in the process.
     Progress of a change is monitored and notifications are issued if deadlines are missed.
     Changes are supported throughout a simple or complex lifecycle.

The following figure is the process diagram for Change Management. For more information, see section Change Management
Workflows.


1.9.10.3.1. Change categories and phases

Change Management uses categories to classify the type of change requested. Out-of-box, each change type has its own
category that defines the workflow and phases needed to satisfy the change request. They are described in detail in the
following sections.
The best practice process flows shipped with the Process Designer framework introduce four processes: Change Proposal,
Standard, Normal and Emergency changes, which correspond to the "Change Proposal", "Standard Change", "Normal
Change"and "Emergency Change" categories. This is a change with previous releases of Service Manager where at the
category-level more specific changes were classified, such as Hardware or Software. They are added to any existing categories
including any previous out-of-box categories that may still exist in the system.
As an administrator of the Service Manager application, you can use the default categories shipped with the product, or create
new categories to match your business requirements.


1.9.10.3.2. Change Management categories

Service Manager Categories classify and define the type of change requested. Each category has its own workflow process.
The steps of the workflow are represented by the phases and tasks within the phase. Service Manager requires that every
change has a change category and phase, but tasks are optional.

Service Manager provides three out-of-box categories you can use to classify the changes in your business. The following table
describes the out-of-box Change Management categories.

Category                                Change Management categories

                                                       Description

Change Proposal                         A Change Proposal is a high-level description of the
                                        suggestion or request for a new or changed service, in order
                                        to ensure that potential conflicts for resources or other
                                        issues are identified. For example, major changes that
                                        involve significant cost, risk or organizational impact are
                                        usually initiated by a change proposal.

Emergency Change                        Emergency changes are the change processes to be applied
                                        in the production environment during emergency situations
                                        like service outage.

Normal Change                           A Normal Change is a change that's categorized, prioritized,
                                        planned and that follows all approvals before deployment.

                                        Normal Changes can be further categorized as Major RFC,
                                        Significant RFC, and Minor RFC.

Standard Change                         A Standard Change is a pre-authorized Change that's of low
                                        risk, relatively common and follows a standard procedure.


1.9.10.3.3. Change Management phases

Service Manager uses phases to describe the steps needed to complete a change request. The phase also determines the
change screens users see, the approvals required to advance to the next phase, and the conditions that cause the system to
issue alerts.
For example, the following figure shows the workflow phases for a Standard Change.


1.9.10.3.4. Change Management tasks

Service Manager lists the Change tasks necessary to complete a particular phase. Workflow can't proceed to the next phase
until all the associated tasks of the current phase are completed. Tasks can be either sequential or parallel. For example,
suppose you are in the Deployment phase of a normal Change, to replace a hard drive. The Change tasks listed may be to take a
backup of the old hard drive, remove the old drive, install a new hard drive, test the new hard drive, and restore the data on to the
new hard drive. In this example, the tasks are sequential because you can't restore data onto a new drive until you take a backup
of the data and install the new hard drive. Parallel tasks might include determining the backup software to be used, the hard drive
vendor to purchase from, and the effort and risk the hard drive Change might bring forth. Each phase can optionally have one
task, multiple tasks, or no tasks. Tasks include a description, the urgency and priority of the task, task scheduling, and
assignment information.

Change Management tasks include:

     Opening, assigning, and associating a task with a Change.
     Searching for a task.
     Managing task categories, environments, and phases.
     Using the task queue.

Change Task phases

This section describes the flow of a Change task as it progresses from the Waiting phase to the Closed phase in the Generic
Task workflow. This workflow is required to implement task dependencies.

The following figure shows the Generic Task workflow in Process Designer.

To Change the phases of a Change task in the Generic Task workflow:

   1. Sign in as a Change Coordinator, and then search for an open Change request.

   2. Click More > Open New Task from the menu to create a new Change task.

     Or

     Click the task number in the Tasks section to open an existing Change task.

   3. When a task is opened, it is in the Waiting phase. When the task is being executed, it is in the Active phase. The Change
     Implementer (assignee) Changes the status of task from Ready to Assigned and then to In Progress. Task status is
     Changed to Completed when the task is accomplished.

   4. If the Change task is not planned to be implemented or if it's not successful, select the task status Cancelled and the task
     will be moved to Cancelled phase.

   5. Change task can be closed directly from Active phase bypassing the Review Phase.

     • If the Risk Assessment value of the Change task is less than or equal to 2, then the Review phase is bypassed.

     • If the Risk Assessment value of the Change task is more than 2 (for example 3 or more), the task enters the Review
     phase.

   6. Sign in as Change Reviewer, retrieve the task, and review it. Type your comments in the Review Comments field.

   7. If the task completed is acceptable, close the task by selecting Successful from the Closure Code dropdown list and add
     closure comments, the task is now in the Closed phase. If the task is incompleted and needs to be reworked, click Reopen
     after adding review comments. The task moves back to the previous Active phase and to the Assigned status.

   8. Repeat the same steps from 2 to 7 if you want to create, implement and close the tasks at any phase of the Change
     request.


   9. A notification is sent to Change Owner on the successful completion of a task.
Change Task Status value and display list mapping is as follows:

Value                                   Status
0                                       Planned
1                                       Ready
2                                       Assigned
3                                       In Progress
4                                       Blocked
20                                      Completed
21                                      Completed with Problems
30                                      Cancelled
31                                      Withdrawn
32                                      Failed


1.9.10.3.5. Change Management user roles

The following table describes the responsibilities of the Change Management roles.

Role                                                                                                                   Service Manager 9.81
Change Approver
Change Coordinator                      Change Management user roles

Change Owner                                          Responsibilities

Change Manager                                              Uses the Service Management tool or Change Advisory
                                                            Board to approve or deny Change when requested.
                                                            Facilitates Emergency Change Advisory Board (E-CAB)
                                                            meetings.

                                                            Registers changes and applies the correct change
                                                            model and change detail.
                                                            Schedules changes according to the plan created
                                                            previously.
                                                            Creates the change tasks for building, testing, and
                                                            implementing a change.
                                                            Coordinates the Risk and Impact Analysis phase of the
                                                            change and creates change plan based on the
                                                            assessment information.
                                                            Verifies if the change has passed the test criteria.
                                                            Verifies if the change is implemented successfully in
                                                            the production environment.
                                                            After implementation, evaluates the change and closes
                                                            the request.
                                                            If a change implementation fails, the coordinator
                                                            activates a back-out plan to return the system to its
                                                            original state.

                                                            Assesses the validity of the RFC and involves in risk
                                                            assessment.
                                                            Performs post implementation review and responsible
                                                            for closure of change.
                                                            Responsible for convening the ECAB members for
                                                            Emergency Change approval.
                                                            Coordinates with the experts within change process for
                                                            Build and Test activities. Reviews, revises, and updates
                                                            schedule for Emergency and Standard Changes.
                                                            Plans, receives, and reviews RFC for approvals.
                                                            Generates CMDB updates to be submitted to Service
                                                            Asset and Configuration Management for processing.

                                                            Reviews all changes after the Plan and Schedule
                                                            phases and forwards them to the right Change
                                                            Approver.
                                                            Organizes Change Advisory Board meeting if
                                                            necessary.
                                                            Updates the change after approval.
                                                            Periodically reviews changes in a Post Implementation
                                                            Review; determines and executes follow-up actions.
                                                            Coordinates all activities in case the Emergency
                                                            Change Handling process is triggered.

Role                                                                                               Service Manager 9.81
ECAB
                                         Responsibilities
Technical Change Advisory Board (TCAB)
Deployment Change Advisory Board (DCAB)       Validates that the Emergency Change is truly an
                                              emergency (based on emergency change criteria).
                                              Ensures the RFC for Emergency Change is complete.
                                              Ensures the RFC for Emergency Change receives
                                              appropriate approval (based on the Change
                                              Management Policy).
                                              Makes the final decision that the resolution being
                                              implemented to correct the production issue is the best
                                              option for the situation.
                                              Ensures the Emergency Change is reviewed by the
                                              CAB, post implementation.

                                              Responsible for analyzing and reviewing the risk and
                                              impact of change request.
                                              Authorizes, disapproves, or requests more information
                                              for each Normal Major change request.
                                              Ensures all Normal Major changes are adequately
                                              assessed and prioritized.
                                              When requested, participates in Change Post
                                              Implementation Reviews.

                                              Reviews the Build and Test results and approves,
                                              abandons, or rejects them. If the Build and Test results
                                              are approved, the DCAB reviews and updates the
                                              implementation schedule and authorizes the Normal
                                              Change implementation to begin.
                                              Participates in scheduling and coordination of the
                                              change.
                                              When requested, participates in Change Post
                                              Implementation Reviews.


1.9.10.4. Input and output for Change Management

Changes can be triggered and resolved in several ways. The following table outlines the input and output for the Change
Management process.

Input to Change Management              Input and output for Change Management process

                                                              Output from Change

       Policy and strategies for change and release           Rejected Request for Changes (RFCs)
       Request for change                                     Approved RFCs
       Change proposal                                        Change to a service or infrastructure
       Plans (change, transition, release, deployment, test,  New, changed, or disposed assets or CIs
       evaluation, and rendition)                             Change schedule
       Current change schedule and projected service outage   Revised PSO
       (PSO)                                                  Authorized change plans
       Current assets or configuration items                  Change decisions and actions
       As-planned configuration baseline                      Change documents and records
       Test results, test report, and evaluation report       Change Management reports

Key performance indicators for Change Management

The Key Performance Indicators (KPIs) in the following table are useful for evaluating a Change.

Title                                   Key Performance Indicators for Change Management

                                                               Description

% of unauthorized changes                                     Percentage of unauthorized implemented changes in a given
                                                              period. A change in the infrastructure without a registered
                                                              change request is considered unauthorized.

% of incidents caused by changes                              Percentage of incidents caused by the implementation of a
                                                              change in a given period.

% of emergency changes                                        Percentage of the total number of closed emergency
                                                              changes in a given period.

% of successful changes                                       Percentage of the total number of closed changes
                                                              successfully implemented in a given period.

% of backed out changes                                       Percentage of the total number of closed changes for which
                                                              a remedy plan is activated in a given period.

% of rejected changes                                         Percentage of the total number of closed changes rejected
                                                              in a given period.

Average time per phase                                        Average amount of time spent on each of the distinct change
                                                              phases in a given period.

                                                              Validation, Risk and Impact Analysis, TCAB Approval, Build
                                                              and Test, DCAB Approval, Deployment, Post Implementation
                                                              Review, CMDB Update, and Closure.

For completeness, the ITIL 2011 and COBIT 4.1 KPIs are included in the following sections.

ITIL 2011 Key Performance Indicators

The following are ITIL 2011 KPIs for Change Management:


     Number of changes implemented to services that met customer requirements (for example, quality/cost/time expressed as
     a percentage of all changes).
     Benefits of change expressed as the value of improvements made added to the value of negative impacts prevented or
     terminated as compared to the costs of the change process.
     Reduction in the number of disruptions to services, defects, rework caused by inaccurate specification, and poor or
     incomplete impact assessment.
     Reduction in the number of unauthorized changes.
     Reduction in the backlog of change requests.
     Reduction in the number and percentage of unplanned changes and emergency fixes.
     Change success rate (percentage of changes deemed successful at review, that is, the number of RFCs approved).
     Reduction in the number of changes in which remediation is required.
     Reduction in the number of failed changes.
     Average time to implement based on urgency/priority/change type.
     Incidents attributable to changes.
     Percentage accuracy in change estimate.

COBIT 4.1 Key Performance Indicators

The following are the COBIT 4.1 KPIs for Change Management:

     Number of disruptions or data errors caused by inaccurate specifications or incomplete impact assessment.
     Extent of application rework caused by inadequate change specifications.
     Minimum time and effort required to make changes.
     Percentage of emergency fixes.
     Percentage of unsuccessful changes to the infrastructure due to inadequate change specifications.
     Number of changes not formally tracked, reported, or authorized.
     Number of backlogged change requests.
     Percentage of changes recorded and tracked with automated tools.
     Percentage of changes that follow formal change control processes.
     Ratio of accepted and refused change requests.
     Number of different versions of each business application or infrastructure being maintained.
     Number and type of emergency changes to the infrastructure components.
     Number and type of patches to the infrastructure components.

Contents

     1 Key performance indicators for Change Management
     2 ITIL 2011 Key Performance Indicators
     3 COBIT 4.1 Key Performance Indicators


1.9.10.5. RACI matrix for Change Management

A Responsible, Accountable, Consulted, and Informed (RACI) diagram or RACI matrix is used to describe the roles and
responsibilities of various teams or people in delivering a project or operating a process. It is especially useful in clarifying roles
and responsibilities in cross-functional/departmental projects and processes. The RACI matrix for Change Management is shown
in the following table.


                                        RACI matrix for Change Management

Process ID Activity    Change           Change  Change                     Change      Change     Change
                       Manager                                             Advisory    Approver   Owner
                                        Requestor Coordinator              Board(CAB)  (or ECAB)

ST 2.1     Register    A                R       R
ST 2.1.3
ST 2.1.5   RFC
ST 2.1.6
ST 2.2.1   Perform     A                I       R                                      C/I

ST 2.2.2   RFC
ST 2.2.3
           Assessment
ST 2.2.4
ST 2.2.6   Reject RFC C/I               R       R                          R

ST 2.3.1   Assign      R                R       R
ST 2.3.3
           Change
ST 2.3.5
ST 2.3.8   Owner
ST 2.3.10
           Identify    R/A              R       I                                                 I

           Standard

           Change

           Model and

           Change

           Owner

           Prioritize  R/A              C/I     I                                                 R

           Standard

           Change

           Plan and    R/A              I       R                                                 R

           Schedule

           Standard

           Change

           Execute     R/A              I       R                                                 R

           Standard

           Change

           Remove      R                I       I                                                 C/I

           Standard

           Change

           Model

           Assess      R/C              I       R                                                 R

           Change

           Determine R                  C/I     C/I                                               A
           Approval
           Requirement
           s

           TCAB        R/A              I       I                          R

           Approval

           Coordinate R.A               I       R                                                 R
           Build and
           Test

           Schedule for R/A             I       R                                                 R
           Normal
           Change


Process ID Activity   Change            Change     Change  Change  Change         Change
                      Manager           Requestor                                 Owner
                                                   Coordinator Advisory Approver
                                        I                                         R
                                                           Board(CAB) (or ECAB)

ST 2.3.12  Create and A                            R
           Submit
ST 2.3.13  Deployment
ST 2.3.15  Plan
ST 2.3.17
ST 2.3.19  DCAB       R/A               I          I       R
ST 2.3.21
           Approval
ST 2.3.23
ST 2.3.26  Decision on R/A                                 R
ST 2.4     Rebuild
ST 2.4.3
ST 2.4.4   Review RFC A                 I          R                              R
ST 2.4.6   after Rebuild
ST 2.4.8   Decision

ST 2.4.10  Review RFC A                 I          R                              R
           after DCAB
           Approval

           Coordinate R/A               I          R/C                            R
           and Monitor
           Change
           Implementat
           ion

           Provide    R/A               I          R                              R

           CMDB

           Updates

           Assess     R/A               I          R                              R

           Change

           Success

           Emergency R/A                C/I                R       R              R
           Change

           Convene    R/A                                          C/I            R

           ECAB

           Approve    A/C                                          R

           Emergency

           Change

           Plan and   R/A                          I                              R

           Design

           Solution

           Coordinate R/A               I          R                              R
           Emergency
           Change
           Build and
           Test

           Coordinate R/A                                                         R
           Emergency
           Change
           Implementat
           ion


Process ID Activity     Change          Change     Change  Change  Change         Change
                        Manager         Requestor                                 Owner
                                                   Coordinator Advisory Approver
                                        C                                         R
                                                           Board(CAB) (or ECAB)

ST 2.4.11  Abandon the R                           I
ST 2.5     Change
ST 2.5.3
           Review and R/A               C          R                              R/C
ST 2.5.4   Close
ST 2.5.5   Change

ST 2.5.6   Conduct      C/I             C          A/C                            R

           Formal

           Turnover to

           Support

           Perform PIR A                C/I        R                              R

           Notify       A/C             I          R                              R

           Requestor

           of Change

           Results

           Close RFC R/A                C          R                              R


1.9.11. Change Management workflows

Change Management controls the process to request, manage, approve, and control changes that modify your organization’s
infrastructure. This managed infrastructure includes assets such as, network environments, facilities, telephony, and resources.
For user requests for products and services, refer to Request Fulfillment.
Change Management automates the approval process and eliminates the need for memos, E-mail, and phone calls.

            Note

           The three change workflows (Standard, Normal, and Emergency) have an implementation phase but each are named
           differently: Execution, Deployment, and Implementation respectively. The names are by design and selected to
           match the types of activities for the flows as specified in ITIL. Because the activities aren't same, the implementation
           phase in each workflow is named differently.

The Change Management process consists of the following activities, which are included in this chapter:

            Note

           The following processes are depicted with a light blue border in each of the workflow diagrams in the following
           section.

     Change Proposal (process ST 2.0)
     Register RFC (process ST 2.1)
     Standard Change (process ST 2.2)
     Normal Change (process ST 2.3)
     Emergency Change (process ST 2.4)
     Review and Close Change (process ST 2.5)


1.9.11.1. Change Proposal (process ST 2.0)

Change proposals are submitted to change management before chartering new or changed services in order to ensure that
potential conflicts for resources or other issues are identified. Authorization of the change proposal doesn't authorize
implementation of the change but simply allows the service to be chartered so that service design activities can commence.
A change proposal is used to communicate a high-level description of a change. This change proposal is normally created by the
service portfolio management process and is passed to change management for authorization. In some organizations, change
proposals may be created by a programme management office or by individual projects.
The following figure depicts the Change Proposal workflow in Process Designer.

For details of the Change Proposal process, see the following figure and table.


                                        Change Proposal (process ST 2.0)

Process ID  Procedure or Decision       Description                       Role
ST 2.0.1
ST 2.0.2    Register Change proposal    The change requester logs a       Change Requester
                                        change proposal with a
ST 2.0.3                                high-level description of the
ST 2.0.4                                proposed change.
ST 2.0.5
            Records Change proposal     The change owner records          Change Requester
            details                     details of the change
                                        proposal. The change
                                        proposal should include the
                                        following items:

                                             A high-level
                                             description of the new,
                                             changed or retired
                                             service, including
                                             business outcomes to
                                             be supported, and
                                             utility and warranty to
                                             be provided
                                             A full business case
                                             including risks, issues
                                             and alternatives, as
                                             well as budget and
                                             financial expectations
                                             An outline schedule for
                                             design and
                                             implementation of the
                                             change

            Assess and evaluate         The change owner assesses         Change Owner
            proposed Change             and evaluates the change
                                        proposal, including risks,
            Abandon?                    issues and alternatives, as
            Authorize Change proposal   well as budget and financial
                                        expectations.

                                        The change owner decides          Change Owner
                                        whether to abandon the
                                        proposal or not.

                                        CAB reviews the change            CAB

                                        proposal and the current

                                        change schedule, identifies

                                        any potential conflicts or

                                        issues and responds to the

                                        change proposal by either

                                        authorizing it or

                                        documenting the issues that

                                        need to be resolved.


Process ID  Procedure or Decision         Description                    Role
ST 2.0.6    Initiate a change or project
                                          After the new or changed       Change Manager
                                          service is chartered, RFCs
                                          will be used in the normal
                                          way to request authorization
                                          for specific changes. These
                                          RFCs will be associated with
                                          the change proposal so that
                                          change management has a
                                          view of the overall strategic
                                          intent and can prioritize and
                                          review these RFCs
                                          appropriately.


1.9.11.2. Register RFC (process ST 2.1)

An individual or organizational group that requires a change can initiate a Request for Change (RFC). Change requests can be
initiated as part of a variety of management processes, including User Interaction Management, Incident Management, and
Problem Management. Each RFC must be registered in an identifiable way. Service Manager provides change templates that
standardize and speed up the Change Registration process. RFCs are received from requestors. In some cases, RFCs are logged
on the requestor’s behalf. For example, a business unit may require additional facilities. Another scenario may be that the
Problem Management staff initiates solution for an error from several other sources. All RFCs are reviewed for completeness and
accuracy. There may be additional information that must be entered into the RFC log prior to further processing.
The following user roles can perform Change Registration:

     Change Requestor
     Change Coordinator
Details for this process can be seen in the following figure and table.


                                        Register RFC process

Process ID  Procedure or Decision       Description                              Role
ST 2.1.1
            Raise and Log RFC           All RFCs received are                    Change Requestor
ST 2.1.2                                logged, provided with a
ST 2.1.3                                unique identification
                                        number. Any other relevant
ST 2.1.4                                information about the
                                        change request is also
                                        recorded. If the change
                                        request is in response to a
                                        trigger, i.e., a resolution to a
                                        Problem Record (PR), then
                                        the reference number of the
                                        triggering document is
                                        retained for traceability. The
                                        change is categorized
                                        (Standard, Normal, or
                                        Emergency) at the time of
                                        logging.

            Change Category?            If this is a Standard Change,            Change Requestor
                                        it will follow the Standard
                                        Change processes.

                                        If this is a Normal Change, it
                                        will follow the Normal
                                        Change processes.

                                        If this is an Emergency
                                        Change, it will follow the
                                        Emergency Change
                                        processes.

            Perform RFC Assessment      The Change Coordinator                   Change Coordinator
                                        receives the RFC and
                                        assesses it to determine
                                        whether it is valid. The RFC
                                        is rejected if:

                                             The RFC is impractical
                                             The RFC is a duplicate

                                                              Note

                                                              The activities of
                                                              logging and
                                                              categorizing an
                                                              RFC may be
                                                              delegated to a
                                                              Change
                                                              Coordinator if
                                                              desired.

            Valid RFC?                  The Change Coordinator                   Change Coordinator

                                        determines whether the RFC

                                        is valid.


Process ID  Procedure or Decision       Description                    Role
ST 2.1.5    Reject RFC                                                 Change Coordinator
                                        The Change Coordinator
ST 2.1.6    Assign Change Owner         updates the RFC with an        Change Coordinator
                                        explanation of the rejection,
                                        and notifies the requestor.

                                        The Change Coordinator
                                        looks for resources and
                                        assigns a Change Owner.


1.9.11.3. Standard Change (process ST 2.2)

A Standard Change is a pre-authorized change that follows a standard procedure; for example, a password reset or the provision
of standard equipment to a new employee. Standard Change uses the Change Model configured in the system which can pre-
populate the information in the Change ticket on registering the Change.
For an activity to be accepted as a Standard Change, the following requirements must be met:

     The documented tasks must be commonly known and proven
     Authority will be given in advance based on predetermined criteria
     The chain of events can be initiated by a functional Service Desk
     Budgetary approval will typically be predetermined or within the control of the Change Requester
The following figure depicts the Standard Change workflow in Process Designer.

For details of the Standard Change process, see the following figure and table.



                                        Standard Change process

Process ID  Procedure or Decision       Description                    Role
ST 2.1
ST 2.2.1    Register RFC                The change requester logs      Change Requester
                                        an RFC and reviews the
ST 2.2.2                                RFCs for completeness and
ST 2.2.3                                accuracy.
ST 2.2.4
ST 2.2.5    Identify Standard Change    The Standard change model      Change Requester
ST 2.2.6    Model and Change Owner      that has to be requested is
ST 2.2.7                                first identified and then the
ST 2.5                                  Change Owner is decided. In
                                        many cases the change
                                        owner is documented with
                                        the change model. If this is
                                        not the case, a Change
                                        Owner is decided manually.

            Prioritize Standard Change  Standard change is             Change Owner
                                        prioritized as High, Medium,
                                        or Low depending on the
                                        impact and urgency.

            Plan and Schedule Standard  The Change Owner plans         Change Owner
            Change                      the resources required, and
                                        also reviews revises and
                                        updates the schedule for
                                        Standard Changes as
                                        needed.

            Authorize Plan and Schedule The Change Advisory Board CAB
                                               (CAB) reviews and
                                               authorizes the resource plan
                                               and change schedule. If not
                                               authorized, the change
                                               returns to process ST 2.2.3.

            Execute Standard Change     The Change Owner               Change Owner
                                        executes the Standard
                                        Change. The CMDB is
                                        updated according to the
                                        changes performed.

            Successful?                 The Change Owner checks        Change Owner
                                        whether the Change is
                                        successful.

            Remove Standard Change      If a Change Implementation     Change Manager
            Model                       is unsuccessful, the
                                        Standard Change Model
                                        may need to be slightly
                                        modified or removed from
                                        the database.

            Review and Close Change     The Change Owner reviews       Change Owner
                                        the change implementation
                                        and closes it if successful.


1.9.11.4. Normal Change (process ST 2.3)

Normal Change is a change that's categorized, prioritized, planned and that follows all approvals before deployment. The Normal
Change activities describe the steps necessary to process a Normal Change by coordinating work effort. A Normal Change can
be further categorized as Major, Significant, and Minor. All Major, Significant, and Minor changes go through the same workflow
except that, for a Normal Major RFC or a Normal Significant RFC the Build Authorization phase is a manual transition and the
change has to be approved manually by Change Advisory Board (CAB) members. In a Normal Minor RFC the Build Authorization
phase is auto approved. The Build Authorization phase is optional in a Minor RFC but it is still configured in the out-of-box
system. The Change must be appropriately reviewed, approved, and executed successfully through the Normal Change process
at least once prior to acceptance.
The following figure depicts the Normal Change workflow in Process Designer.

For details of the Normal Change process, see the following figure and table.
Error creating thumbnail: File missing


                                        Normal Change process

Process ID  Procedure or Decision        Description                    Role
ST 2.1
ST 2.3.1    Register RFC                 RFCs are logged by the         Change Coordinator
                                         Change Requestors. All
ST 2.3.2                                 RFCs are reviewed for
ST 2.3.3                                 completeness and accuracy.
ST 2.3.4
            Assess Change                Assessing a change             Change Owner
ST 2.3.5                                 includes determining the risk
ST 2.3.6                                 and impact and identifying if
ST 2.3.7                                 the change requires a
                                         release to be generated. If a
                                         release is required, a
                                         Release and Deployment
                                         Manager is identified.

            Is a Release Required?       The Change Owner               Change Owner
                                         determines whether a
                                         release is required to
                                         implement the change.

            Determine Approval           The Change Manager             Change Manager
            Requirements                 reviews the change and
                                         decides whether a TCAB
                                         needs to be convened.

            Build Authorization Needed?  If Build Authorization is not  Change Manager
                                         needed, the Change
                                         Manager determines
                                         whether the change should
                                         be approved or rejected.

                                         If Build Authorization is
                                         needed, members are
                                         identified and change is
                                         submitted for approval.

            Build Authorization          Change Manager works with CAB
            Review RFC                   CAB and approves the
            Approval Received?           Change.

                                         The Change Owner reviews Change Owner
                                         the RFC for approvals.

                                         Upon approvals, build and      Change Owner
                                         test is performed either by
                                         Release and Deployment
                                         process or Change
                                         Management process.

                                         If unapproved, the RFC is
                                         closed.


Process ID  Procedure or Decision       Description                      Role
ST 2.3.8    Coordinate Build and Test
                                        The Change Owner initiates       Change Owner
ST 2.3.9                                the Release and Deployment
ST 2.3.10                               Management process to
ST 2.3.11                               perform build and test. The
ST 2.3.12                               Service Validation Testing
                                        process is involved in
                                        validating and testing the
                                        build created by release.

                                        In case the build and test is
                                        unsuccessful, it is
                                        recommended to abandon
                                        the change to RDM which in
                                        turn is informed to the
                                        Change Owner.

                                        The Change Owner
                                        coordinates between the
                                        experts within Change
                                        process for building and
                                        testing activities. The
                                        change is built and tested
                                        thoroughly and validated.

            Build and Test Result       If the Build and Test result is  Change Owner
            Acceptable?                 acceptable, deployment is
                                        scheduled; else the RFC is
                                        sent for closure.

            Schedule for Normal Change  Change Owner involves the        Change Owner
                                        RDM and prepares the
                                        schedule for normal change.
                                        This schedule is based on
                                        the draft deployment plan
                                        obtained from the Release
                                        and Deployment
                                        Management process
                                        received.

            Release Related?            If release is related, the       Change Owner
                                        detailed deployment plan is
                                        created by the RDM
                                        process; else, Change
                                        Owner creates the same.

            Create and Submit           The Change Owner creates         Change Owner
            Deployment Plan             the Deployment plan and
                                        submits it to CAB approval.
                                        The same is also received
                                        from RDM and is sent for
                                        CAB’s review.


Process ID  Procedure or Decision       Description                    Role
ST 2.3.13   Deployment Authorization
                                        CAB reviews the Build and CAB
ST 2.3.14   Rejected?                   Test results and approves /
ST 2.3.15   Decision on Rebuild         abandons / rejects as
ST 2.3.16   Rebuild?                    deemed fit. If the Build and
ST 2.3.17   Review RFC after Rebuild    Test results are approved,
            Decision                    CAB reviews and updates
ST 2.3.18                               the implementation schedule
            Release Related?            and authorizes the Normal
ST 2.3.19                               Change implementation to
ST 2.3.20   Review RFC after            commence.
            Deployment Authorization
            Release Related?            If the deployment plan is      CAB

                                        rejected, the change moves

                                        back to Build and Test.

                                        If CAB decides on              CAB

                                        rebuilding, the change is

                                        rebuilt and tested again.

                                        If a rebuild is required, the CAB
                                        Change Owner is informed;
                                        else, the change is
                                        deployed.

                                        The Change Owner reviews       Change Owner
                                        the RFC to check whether
                                        the rebuild will be performed
                                        by RDM or within change.
                                        Also a decision is made on
                                        what modules to be rebuilt
                                        and the timeline.

                                        If the rebuild is related to   Change Owner
                                        RDM, the request is sent to
                                        RDM for rebuilding and
                                        testing; if not, these are
                                        performed within the
                                        Change Management
                                        process.

                                        The Change Owner reviews       Change Owner
                                        the RFC to go ahead with
                                        the deployment.

                                        If RDM is involved for         Change Owner
                                        deployment, RDM carries
                                        out the deployment
                                        activities;

                                        else it is carried out by the
                                        Change Management.


Process ID  Procedure or Decision       Description                     Role
ST 2.3.21   Coordinate and Monitor
            Change Implementation       The Change Owner                Change Owner
ST 2.3.22                               coordinates and monitors
ST 2.3.23   Remediation Required?       the Normal Change
ST 2.3.24                               implementation. Various
ST 2.3.25   Provide CMDB Updates        tasks are created for
ST 2.3.26                               carrying out the deployment
ST 2.3.27   Determine if implemented    activities as mentioned in
            RFC Is a Release            the deployment plan.

            Implemented RFC for a       After the deployment, the
            Release?                    Change owner verifies
                                        whether the deployment
            Assess Change Success       was successful or not.
            Remediation Required?
                                        If the change is                Change Owner
                                        unsuccessful it is backed
                                        out and moved to closure;
                                        else CMDB is updated for
                                        successful changes.

                                        Change Owner generates          Change Owner
                                        CMDB updates that are to be
                                        submitted to Service Asset
                                        and Configuration
                                        Management for processing.

                                        If the implemented change       Change Owner
                                        involves a release, control is
                                        returned to Release and
                                        Deployment Management
                                        for further review and
                                        closure.

                                        If the RFC was for a release,   Change Owner
                                        the post-deployment
                                        activities will take place in
                                        the Release and Deployment
                                        Management process; else
                                        move on to PIR.

                                        The Change Manager              Change Manager
                                        determines whether the
                                        change implementation is
                                        successful.

                                        If a release needs to be        Change Manager
                                        backed out, this is done in
                                        the Release and Deployment
                                        Management process.


1.9.11.5. Emergency Change (process ST 2.4)

Emergency changes can also be initiated in the Incident Management process. They should be used only to repair an IT service
error that's negatively impacting the business at a high level of severity. Changes that are intended to make an immediately
required business improvement are handled as normal changes, although they may be assigned a high priority based on the
urgency of the required business improvement.
The emergency change process follows the normal change process, except for the following:

     Approval is given by the Emergency Change Approval Board (E-CAB) instead of waiting for a regular CAB meeting.
     Testing may be reduced, or in extreme cases eliminated, if doing so is considered necessary to deliver the change
     immediately.
     Updating of the change request and configuration data may be deferred, till normal working hours.
If the E-CAB decides to handle an emergency change as a normal change, the emergency change is recategorized and
implemented using the normal change process.
The following user roles are involved in Emergency Change Handling:
     Change Manager
     E-CAB
     Change Owner
The following figure depicts the Emergency Change workflow in Process Designer.

For details of the Emergency Change process, see the following figure and table.


                                        Emergency Change process

Process ID  Procedure or Decision       Description                     Role
ST 2.1
            Register RFC                Emergency Change                Change Requestor
ST 2.4.1                                activities provide the
ST 2.4.2                                expedited Change
ST 2.4.3                                Management process, which
                                        implements changes to the
ST 2.4.4                                production environment due
ST 2.4.5                                to an emergency occurring
ST 2.4.6                                by a service outage.

                                        RFCs are logged by the
                                        Change Requestors.

            Assign a Change Owner       The Change Coordinator          Change Coordinator
                                        assigns the Emergency
                                        change to the Change
                                        Owner.

            Assess the RFC              The Change Owner receives       Change Owner
                                        the RFC and assesses it to
                                        determine whether it is valid.
                                        It is recategorized as Normal
                                        if it doesn't qualify as
                                        Emergency Change. Risk
                                        and Impact Analysis is done
                                        at this stage.

            Convene ECAB                The Change Owner                Change Owner
                                        convenes Emergency
                                        Change Advisory Board
                                        (ECAB) members to
                                        authorize the change. The
                                        E-CAB members are
                                        authorized to make
                                        decisions about high impact
                                        emergency changes.

            Approve Emergency Change    ECAB reviews the                Emergency CAB (ECAB)
                                        Emergency Change and
                                        assesses its urgency,
                                        impact, and risk. Based on
                                        their review the ECAB
                                        members either approve or
                                        deny the change.

            Emergency Change            If ECAB approves, the           Emergency CAB (ECAB)
            Approved?                   change is implemented.

                                        Else the change is denied by
                                        the Change Approver and
                                        re-categorized as a Normal
                                        Change.

            Plan and Design Solution    The Change Owner plans          Change Owner
                                        the resources required,
                                        designs the solution to
                                        implement Emergency
                                        Change.


Process ID  Procedure or Decision       Description                      Role
ST 2.4.7    Build and Test Required?
                                        If Build and Test is required,   Change Owner
ST 2.4.8    Coordinate Emergency        Change Owner performs the
ST 2.4.9    Change Build and Test       building and testing
ST 2.4.10   Schedule Emergency          activities by creating change
            Change                      tasks at this phase of the
ST 2.4.11   Coordinate Emergency        change.
ST 2.5      Change Implementation
                                        If build and test is not
            Abandon the Change          required the change is
            Review and Close Change     scheduled for
                                        implementation.

                                        The Change Owner                 Change Owner
                                        coordinates the Build and
                                        Test activities for
                                        Emergency Change.

                                        The Change Owner reviews,        Change Owner
                                        revises and updates the
                                        schedule as needed for
                                        Emergency Change.

                                        The Change Owner                 Change Owner
                                        coordinates the activities for
                                        implementing the
                                        Emergency Change.
                                        Successful change
                                        implementation is followed
                                        by update of the CMDB and
                                        formal turnover to support.

                                        If an Emergency change is        Change Owner
                                        denied by the ECAB, the
                                        RFC is abandoned. Go to 2.5
                                        to close the change.

                                        The Change Owner reviews         Change Owner
                                        the change implemented
                                        and closes if it is successful.
                                        Unsuccessful change is
                                        backed out and the
                                        emergency RFC is closed
                                        after PIR (Post
                                        Implementation Review).
                                        Change tasks are created to
                                        roll back the change and to
                                        bring the environment to
                                        agreed stable state.


1.9.11.6. Review and Close Change (process ST 2.5)

After a change is completed, the results must be reported for evaluation to those responsible for managing changes, and then
presented for stakeholder agreement. This process includes the closing of related user interactions, incidents, and known errors.
The Change Owner and Change Manager review the change implementation and close it if successful.
Post-implementation review of the change (or PIR) is performed to confirm the following:

     The change meets its objectives
     The change Requester and stakeholders are satisfied with the results
     Unanticipated effects have been avoided.
     Lessons learned are incorporated in future changes.
By default, an Emergency Change or a Normal Change requires PIR, while a Standard Change doesn't.
Details for this process can be seen in the following figure and table.


                                        Review and Close Change process

Process ID  Procedure or Decision       Description                      Role
ST 2.5.1
ST 2.5.2    Review RFC for Success      The Change Owner checks          Change Owner
                                        whether the RFC deployed
ST 2.5.3                                by Release and Deployment
                                        Management process is
ST 2.5.4                                successful.

ST 2.5.5    RFC Successful?             If the release is successful,    Change Owner
ST 2.5.6                                it is handed over to the
ST 2.5.7                                support staff.

                                        If the release is
                                        unsuccessful, it is subject to
                                        a Post-Implementation
                                        Review (PIR).

            Conduct Formal Turnover to  The Change Owner ensures         Change Owner
            Support                     that all the functionality
                                        changes are documented
                                        and performs the tasks
                                        required to hand over the
                                        change to the support staff.

            Perform PIR                 The Change Owner and             Change Owner
                                        Change Manager perform a
                                        Post-Implementation Review
                                        (PIR) to ensure that the
                                        change is reviewed and
                                        lessons learned from the
                                        change are implemented.

            Notify Requestor of Change  The Change Requestor is          Change Owner
            Results                     notified of the success or
                                        failure of the change.

            Reject RFC                  The Change Coordinator           Change Coordinator
                                        rejects the RFC.

            Close RFC                   The Change Requestor is          Change Owner
                                        notified of the success or
                                        failure of the change.
````
