---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.9 .. 1.9.2
printed_pages: 2393-2419
---

# 1.9 Service Manager processes and best practices

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.9. Service Manager processes and best
practices

Service Manager enables organizations to manage their IT infrastructures efficiently
and effectively. This document describes the best practice Process Designer
workflows that are standard with out-of-box Service Manager applications. It includes
high-level workflow diagrams and step-by-step guidelines for the following Process
Designer based modules: Change Management, Service Desk, Incident Management,
Problem Management, Request Fulfillment, Knowledge Management, and Service
Level Management.

The Service Manager best practice workflows are aligned with the Information
Technology Infrastructure Library (ITIL) standard, a widely recognized source of
guidelines for Information Technology Service Management (ITSM).

This document is based on the out-of-box implementation of Service Manager
Codeless. For customers on Service Manager Hybrid, we recommend that you also
implement the Codeless workflows described in this document by using the Process
Designer technology.


1.9.1. Service Desk overview

The Service Manager Service Desk application, referred to as Service Desk
throughout this chapter, supports the service desk function of the Information
Technology Infrastructure Library (ITIL) with its User Interaction Management
processes for the IT service and the customer base. The Service Desk application
provides a single point of entry to the other Service Manager applications and
enables you to document and track all calls received by the service desk.

Service Desk incorporates the essential concepts of ITIL to ensure that the best
practices of IT service management are applied to the service desk to aid end
customers, ensure data integrity, and streamline communication channels in the
organization.

This section describes how Service Desk implements the best practice guidelines for
the Service Desk Interaction Management processes.

            Note

           If you enable the Streamlined Interaction solution for Service Desk, see
           Service Desk (Streamlined Interaction).

Topics in this section include:

     Service Desk within the ITIL framework
     Service Desk application
     Service Desk process overview
     Input and output for Service Desk Interaction Management
     Key performance indicators for Service Desk Interaction Management
     RACI matrix for Service Desk Interaction Management


1.9.1.1. Service Desk within the ITIL
framework

Service Operation is one of five core publications from ITIL that covers the service
lifecycle. The purpose of service operation is to deliver agreed-on levels of service to
users and customers, and to manage the applications, technology, and infrastructure
that support delivery of the services.

The service desk is a key function of service operation. It provides a single, central
point of contact for all users of IT. The service desk’s goal is to restore normal service
to users as quickly as possible. Restoring normal service could involve fixing a
technical fault, fulfilling a service request, or answering a query — whatever is
needed to enable users to return to their work. The service desk logs and manages
customer interactions and provides an interface to other service operation processes
and activities.

ITIL 2011 notes these specific responsibilities of a service desk:

     Logging, categorizing, and prioritizing all calls
     Providing first-line investigation and problem diagnosis
     Resolving incidents or service requests to be handled at the service desk level
     Escalating incidents and service requests that can't be resolved within agreed-
     on time limits
     Closing resolved incidents, requests, and other calls
     Communicating with users to keep them informed of progress, impending
     changes, agreed-on outages, and other such notifications


1.9.1.2. Service Desk application

The Service Manager Service Desk application incorporates the ITIL best practices that are used by organizations worldwide to
establish and improve their capabilities in service management.

It provides a central Service Operation function, coordinating the efficient and effective delivery of services to end users and
enabling various improvements, including the following:

     Improved customer service and satisfaction
     Increased accessibility through a single point of contact and information
     Better quality and faster turnaround of customer or user requests
     Improved teamwork and communication
     Enhanced focus and a proactive approach to service provision
     Improved usage of IT resources and increased productivity of all users

The Service Desk application enables a Service Desk agent to document and track user interactions. Service Desk provides one-
click access to other Service Manager applications to automatically enter information received.

The Service Desk application covers:

     Direct interactions between a user and the service desk by phone or by email
     User activities that occur from use of the self-service Web portal (for example, searching the knowledge base, checking for
     status updates, or logging an interaction).

One of the best practices that derives from ITIL’s service desk function is that user interactions should not be saved and updated
later. Therefore, the Service Desk application requires that any new interaction either be resolved within the agreed upon time
limits and then closed or, if it can't be resolved, escalated. The information gathered during the customer interaction can be used
to open an incident if a reported issue requires further action. It can also be added to a record in another Service Manager
application, such as Change Management.


1.9.1.3. Service Desk process overview

Every user contact with the service desk is logged as an interaction. User Interaction Management is the process for handling all
interactions with the service desk that are received from self-service Web pages or directly by service desk personnel. These
interactions can include service disruptions, service requests, requests for information (RFI), or complaints reported by users
who communicate with the service desk by using instant messages, phone, E-mail, or by self-service Web pages. The User
Interaction Management process enables you to easily log and resolve simple user requests and to escalate others into incidents
requiring further action.

Multiple user interactions can be linked to a single incident in the tool. User Interaction Management describes all the activities a
Service Desk agent needs to follow when registering a new incident or change. The Service Desk agent follows the necessary
steps and searches for related knowledge records, known error records, and existing incidents or changes. This process
streamlines service desk activities, thereby decreasing the workload for second line support teams.

A general overview of the User Interaction Management processes and workflows is depicted below. They are described in
detail in Service Desk Workflows.

When a user contacts the service desk, the Service Desk agent uses the Service Desk application to create an interaction
record. The Service Desk agent records the user name, the name of the component that the user is calling about, and a
description of the service request. After collecting this information, the Service Desk agent performs the actions required to
resolve the user request.

     If the service request is resolved without escalating it to an incident, the Service Desk agent can close the interaction
     record.

     If the service request can't be resolved without escalating it to an incident, the Service Desk agent searches for existing
     incidents, problems, or known errors that affect the same component or one of the parent assets of that component.

          • If an existing incident is found, the Service Desk agent can associate the current interaction with the existing incident.


          • If an existing incident is not found, the Service Desk agent can register a new incident based on the Service Desk
          interaction. Service Desk copies information from the interaction record into the newly-created incident.
For example, consider a user who can't print to a network printer:
     The user contacts the service desk for assistance.
     The Service Desk agent populates an interaction record with the relevant information.
     Because the issue can't be resolved immediately, the Service Desk agent opens an incident, and the incident is assigned to
     a technician.
     The technician discovers that the printer network connection is broken.
     The technician fixes the connection and closes the incident.
     The Service Desk agent contacts the user and instructs the user to attempt printing to the network printer.
     If the user can successfully print, the Service Desk agent can close the interaction. If the user still can't print, the Service
     Desk agent may create a new incident and then relate the unsolved interaction.
     If the user wishes to report a related or new issue, the Service Desk agent closes the interaction (as the original issue was
     resolved) and opens a new interaction detailing the new issue the user needs to report.

Interaction categories

Service Manager Categories classify and define the type of interaction. Each category could have its own workflow process. The
steps of the workflow are represented by the phases. Service Manager requires that every interaction has an interaction
category and phases.

Interaction phases

Service Manager uses phases to describe the steps needed to dispose an interaction. The phase also determines the forms
users see, the actions users can manually trigger.
The following figure shows the workflow phases for an Interaction.

Service Desk user roles

The following table describes the responsibilities of the User Interaction Management user roles.

Role                                                                                                                        Service Manager 9.81
User
Service Desk Agent                      User Interaction Management user roles

Service Desk Manager                                      Responsibilities

                                                                Report all IT-related requests to the service desk or use
                                                                the self-service Web pages.
                                                                Validate solutions and answers provided by the IT
                                                                department to a registered service request.

                                                                Register interactions based on contact with user.
                                                                Match user interaction to incidents, problems, known
                                                                errors, or knowledge document.
                                                                Solve and close interactions.
                                                                Provide status updates to users on request.
                                                                Register incident based on a user interaction and
                                                                assign to the correct support group.
                                                                Register Request for Change, based on a user
                                                                interaction.
                                                                Register Service Request, based on a user interaction.
                                                                Validate a solution provided by a support group.
                                                                Report and verify a solution to a user.
                                                                Monitor Service Level Agreement (SLA) targets of all
                                                                incidents registered and escalate, if required.
                                                                Communicate about service outages to all users.
                                                                Withdraw Interaction on behalf of a user.

                                                                Appoint people to the required roles.
                                                                Manage resources assigned to the service desk.
                                                                Manage service desk activities.
                                                                Attend CAB meetings
                                                                Report to senior managers on any issue that could
                                                                significantly impact the business.
                                                                Take overall responsibility for incident and service
                                                                request handling on the service desk.
                                                                Monitor and report on service desk performance.
                                                                Make improvements to the service desk.


1.9.1.4. Input and output for Service Desk Interaction
Management

Interactions can be triggered and resolved in several ways. The following table outlines the inputs and outputs for the User
Interaction Management process.

                                        Input and output for Service Desk Interaction Management

Input to Service Desk Interaction Management                 Output from Service Desk Interaction Management

A user can contact the service desk and give input by using  Service desk personnel can handle an interaction in the
instant messages, phone, email, self-service web pages, or   following ways:
other means.
                                                                  If the interaction is related to a new or existing incident,
                                                                  the interaction is handled by using the Incident
                                                                  Management process.
                                                                  If the interaction involves a request, the interaction is
                                                                  sent to the Request Fulfillment process.
                                                                  If the interaction requires a change, the interaction is
                                                                  sent to the Change Management process.


1.9.1.5. Key performance indicators for Service Desk
Interaction Management

The Key Performance Indicators (KPIs) in the following table are useful for evaluating your indicators for Service Desk Interaction
Management processes. To visualize trend information, it is useful to graph KPI data periodically. In addition to the data provided
by Service Manager, you may need additional tools to report on all of your KPI requirements.

Title                                   Key Performance Indicators for Service Desk Interaction Management

                                                                      Description

First time fix                          Percentage of interactions closed by the Service Desk agent
                                        at first contact without reference to other levels of support
                                        and going through the whole service desk workflow

First line fix                          Percentage of interactions closed by the service desk
                                        without reference to other levels of support

Customer satisfaction                   Customer satisfaction measured by surveys completed by
                                        customers

For completeness, the ITIL 2011 and COBIT 4.1 KPIs are included below.

ITIL 2011 Key Performance Indicators

The following are ITIL 2011 KPIs for User Interaction Management:

     Percentage of incidents closed by the service desk without reference to other levels of support (that is, closed by first point
     of contact).
     Number and percentage of incidents processed by each Service Desk agent.

COBIT 4.1 Key Performance Indicators

The following are the COBIT 4.1 KPIs for User Interaction Management:

     Amount of user satisfaction with first-line support (service desk or knowledgebase)
     Percent of first-line resolutions based on total number of requests
     Call-abandonment rate
     Average speed to respond to telephone and email or Web requests
     Percent of incidents and service requests reported and logged using automated tools
     Number of days of training per service desk staff member per year
     Number of calls handled per service staff member per hour
     Number of unresolved queries

Contents

     1 ITIL 2011 Key Performance Indicators
     2 COBIT 4.1 Key Performance Indicators


1.9.1.6. RACI matrix for Service Desk Interaction Management

A Responsible, Accountable, Consulted, and Informed (RACI) diagram or RACI matrix is used to describe the roles and
responsibilities of various teams or people in delivering a project or operating a process. It is especially useful in clarifying roles
and responsibilities in cross-functional/departmental projects and processes. The RACI matrix for Service Desk Interaction
Management is shown in the following table.

                                        RACI matrix for Service Desk Interaction Management

Process ID  Activity                    User  Service Desk Agent                             Service Desk
                                                                                             Manager

SO 0.1      Self-Service by User R            I                                              A

SO 0.2      Interaction Handling R            R                                              A

SO 0.3      Interaction Matching R            R                                              A

            and Escalation

SO 0.4      Interaction Closure R/I           R                                              A

SO 0.5      Withdraw Interaction R/I          R                                              A


1.9.2. Service Desk workflows

Every time a user contacts the service desk it is logged as an interaction. User interaction management is the process of
handling all interactions with the service desk that are received from self-service Web pages or directly by service desk
personnel. These interactions can include service disruptions, service requests, requests for information (RFI), and complaints
reported by users who communicate with the service desk by using instant messages, phone, email, or self-service web pages.

The Service Desk agent follows the necessary steps and searches for related knowledge records, known error records, problem
records, and existing incidents or changes. The process enables Service Desk agents to easily log and resolve simple user
requests and to escalate others into incidents requiring further action. The process streamlines service desk activities and
decreases the workload for second-line support teams.

The User Interaction Management process consists of the following processes, which are included in this chapter:

     Self-Service by User (process SO 0.1)
     Interaction Handling (process SO 0.2)
     Interaction Matching and Escalation (process SO 0.3)
     Interaction Closure (process SO 0.4)
     Withdraw Interaction (process SO 0.5)
     Complaint Handling (process SO 0.6)


1.9.2.1. Self-Service by User (process SO 0.1)

By using the self-service web environment, users can perform the following activities without contacting the service desk:
     Search the knowledgebase to find an answer to a question or issue
     Monitor the status of previously reported interactions
     Log new interactions
     Order items from the service catalog

You can see the details of this process in the following figure and table.
Self-Service by User (SO 0.1) is illustrated in the following figure:


                                        Self-Service by User (SO 0.1) process

Process ID  Procedure or Decision          Description                         Role
SO 0.1.1
SO 0.1.2    Log in to Self-Service         To gain access to the Self- User
SO 0.1.3                                   Service Web interface, users
SO 0.1.4                                   must log on by using their
SO 0.1.5                                   login credentials.
SO 0.1.6
SO 0.1.7    Intend to register new         If yes, continue with SO            User
            interaction?
SO 0.1.8                                   0.1.3. If no, go to SO 0.1.9.
SO 0.1.9
SO 0.1.10   Order item from Service        If yes, log a service request. User
            Request Catalog?               If no, go to SO 0.1.4.
SO 0.1.11
            Submit query to Knowledge To search for a knowledge User

            Base                           document, users must

                                           complete a search.

            Satisfied with answer found? If yes, stop. If not, go to SO User
                                               0.1.6.

            Open new interaction           To open a new interaction User
                                           from the knowledge search
                                           screen, users must create a
                                           New Interaction.

            Manually fill out interaction  To register a new                   User
            details
                                           interaction, users must

                                           provide a title and a

                                           description of the request;

                                           select the urgency, and

                                           preferred contact method;

                                           and can optionally provide

                                           affected Service and add an

                                           attachment.

            Submit interaction             When all mandatory fields User
                                           are completed, submit the
                                           form to send the request to
                                           the service desk.

            Validate solution of solved    To validate the solution to a User
            interaction?                   previously reported
                                           interaction, go to SO 0.1.10. If
                                           no, go to SO 0.1.13.

            Validate solution              Use View Closed Requests User
                                           to get an overview of all
                                           solved interactions. Select
                                           the applicable interaction
                                           and validate the solution
                                           provided.

            Interaction solved?            If yes, stop. If not, go to SO User
                                           0.1.12.


Process ID  Procedure or Decision        Description                      Role
SO 0.1.12   Resubmit interaction and
            provide update               When a user disagrees with User
SO 0.1.13                                the proposed solution, the
SO 0.1.14   Check history and            user can resubmit the
SO 0.1.15   outstanding Interactions?    interaction and provide a
                                         reason for the disagreement.
            Check status of Interaction  The newly-created
                                         interaction is sent to the
            Provide update?              service desk for further
                                         diagnosis.

                                         If a user wants to check the User
                                         status or history of
                                         previously registered
                                         interactions, go to SO 0.1.14.
                                         If no, stop.

                                         Use View Open Requests to User
                                         get an overview of all open
                                         interactions. Select the
                                         interaction and view the
                                         status with last updates.

                                         If a user has additional         User

                                         details to add to the

                                         previously-logged

                                         interaction that may be

                                         useful to know for the

                                         specialist, go to SO 0.1.16. If

                                         no, stop.


Process ID  Procedure or Decision       Description  Role
SO 0.1.16   Update Interaction
                                        There are two scenarios to User
                                        update an interaction and
                                        have a Save button to save
                                        the updated information.

                                             The Save button
                                             appears when a self-
                                             service user selects
                                             the option View Open
                                             Requests, selects an
                                             interaction, and clicks
                                             the Update button.
                                             Once the information is
                                             updated, the self-
                                             service user clicks
                                             Save & Exit to save the
                                             updated information in
                                             the request.
                                             When you escalate an
                                             interaction, you can go
                                             back to the interaction
                                             to add more
                                             information or perform
                                             changes to it. You then
                                             have an Update button
                                             when you select an
                                             existing interaction.
                                             The interaction is also
                                             a status of Dispatched
                                             or Callback. Once you
                                             have added more
                                             information to the
                                             request or performed
                                             the changes, you can
                                             click Save & Exit.


1.9.2.2. Interaction Handling (process SO 0.2)

The service desk is responsible for handling all user interactions received by the self-service Web portal, email, or phone. The
service desk attempts to resolve an interaction when the user makes first contact with the service desk. Interaction Handling
includes the registration and preliminary investigation of interactions including the matching against open incidents, problems,
known errors, and the knowledgebase to maximize the first-line solving ratio.
When the service desk can't close an interaction on first contact, the Service Desk agent escalates it to Incident Management,
Change Management, or Request Fulfillment.
You can see the details of this process in the following figure and table.
Interaction Handling (SO 0.2) is illustrated in the following figure:


                                        Interaction Handling (SO 0.2) process

Process ID  Procedure or Decision          Description                         Role
SO 0.2.1
SO 0.2.2    Register New Interaction?      If the interaction is new, go       Service Desk Agent
SO 0.2.3                                   to SO 0.2.5. If not, go to SO
SO 0.2.4                                   0.2.2.
SO 0.2.5
SO 0.2.6    Link User details to           Fill in the name of the caller      Service Desk Agent
            Interaction submitted from     in the Contact Person field
SO 0.2.7    Self-Service                   and the name of the user in
SO 0.2.8                                   the Service Recipient field (if
                                           different).
SO 0.2.9
            Determine affected service     In the Affected Service field,      Service Desk Agent
                                           select the service that
                                           matches the user request.
                                           Then, go to SO 0.2.9.

            Monitor for Self-Service       If there are new Interactions, Service Desk Agent
            newly created Interactions     follow the same Interaction
                                           registration process.

            Select Interaction category    Select the appropriate              Service Desk Agent
                                           Interaction category from
                                           the available category list,
                                           and then go to SO 0.2.6.

            Apply Interaction Template     If there is an interaction          Service Desk Agent
            (if appropriate)               model available, apply the
                                           model to quickly define the
                                           interaction. If no model
                                           exists, the default interaction
                                           settings are shown.

            Follow Template instructions The predefined fields are             Service Desk Agent
                                               filled in from the model.

            Manually fill out Interaction  Fill out the required               Service Desk Agent
            details                        interaction details such as
                                           short title, a full description,
                                           Contact, Service Recipient,
                                           and Affected Service. In
                                           addition, select the
                                           applicable impact and
                                           urgency. The assignment
                                           group is automatically filled
                                           in, based on the Service
                                           Desk Group configured in
                                           the Service Desk
                                           environment record.

            Provide update details to      Inform the user of recent           Service Desk Agent
            User                           updates made by Analysts,
                                           and then update the
                                           interaction by stating that
                                           the user requested an
                                           update.


Process ID  Procedure or Decision       Description                     Role
SO 0.2.10
SO 0.2.11   Monitor for Self-Service    If Interactions are updated,    Service Desk Agent
SO 0.2.12   Interaction Updates         they must be reassessed
                                        and a new incident may
SO 0.2.13                               need to be opened.

SO 0.2.14   Assess Interaction Update   Evaluate Interactions that      Service Desk Agent
                                        have been updated or
SO 0.2.15                               resubmitted.
SO 0.2.16
SO 0.2.17   Open new Incident?          If the user is unhappy with a   Service Desk Agent
SO 0.2.18                               solution provided and a new
SO 0.2.19                               incident must be opened, go
SO 0.2.20                               to SO 0.2.13. If not, go to SO
                                        0.2.16.

            Open new Incident allowed?  If opening a new incident is    Service Desk Agent
                                        allowed due to a user
                                        request during a specific
                                        period after solution
                                        notification, go to SO 0.2.14.
                                        If not, go to SO 0.2.6.

            Open new Incident           Because the previously          Service Desk Agent
                                        registered incident was
                                        solved incorrectly, open a
                                        new incident and provide an
                                        update that states the
                                        reason that the incident was
                                        created.

            Complete/Update Interaction Relate the interaction to the Service Desk Agent
            details & Relate to Incident open incident.

            User requesting closure?    If the user is requesting the Service Desk Agent
                                        incident be closed, go to SO
                                        0.2.17. If not, go to SO 0.2.19.

            Update/Close related        Update the related record as Service Desk Agent
            records                     needed and close it.

            Withdraw Interaction if     Withdraw the interaction if     Service Desk Agent
            appropriate                 this registration is not
                                        needed anymore.

            Review/Manage records       Review the records and take Service Desk Agent
                                        action accordingly.

            Withdraw Interaction if     Withdraw the interaction if     Service Desk Agent
            appropriate                 this registration is not
                                        needed anymore.


1.9.2.3. Interaction Matching and Escalation (process SO 0.3)

When an Interaction is received, the Service Desk Agent first determines if the Interaction is a service request or a request for
change, and if so, logs the request. If the Service Desk Agent is not able to resolve the issue, the incident can either be related to
an existing incident or logged as a new incident.
You can see the details of this process in the following figure and table.
Interaction Matching and Escalation (SO 0.3) is illustrated in the following figure:


                                        Interaction Matching and Escalation (SO 0.3) process

Process ID  Procedure or Decision        Description                                          Role
SO 0.3.1
            Determine Requirements       After filling out the                                Service Desk Agent
SO 0.3.2                                 Interaction details, the
SO 0.3.3                                 Service Desk Agent
SO 0.3.4                                 determines what
SO 0.3.5                                 requirements of the request
SO 0.3.6                                 are.
SO 0.3.7
            Service Request?             If a service request is                              Service Desk Agent
SO 0.3.8                                 needed, the Service Desk
SO 0.3.9                                 agent logs the request. If
                                         not, proceed to SO 0.3.3.
SO 0.3.10
            Request for Change?          If a change is required, log                         Service Desk Agent
                                         the change request. If not,
                                         proceed to SO 0.3.4.

            Service Desk Agent able to   If the Service Desk agent is                         Service Desk Agent
            solve?                       able to solve the request,
                                         proceed to SO 0.3.5. If not,
                                         proceed to SO 0.3.6.

            Document solution in         The Service Desk agent                               Service Desk Agent
            Interaction                  documents the solution
                                         implemented.

            Solution found in Knowledge  If the solution is already                           Service Desk Agent
            Base?                        documented in the
                                         Knowledge Base, proceed to
                                         SO 0.3.7. If not, proceed to
                                         SO 0.3.9.

            Relate Interaction to        The Service Desk Agent                               Service Desk Agent
            Knowledge record             selects “use solution” in the
                                         knowledge record to record
                                         this as the knowledge
                                         source and auto populate
                                         details of the solution in the
                                         Interaction record solution
                                         field.

            Implement Solution           The Service Desk Agent                               Service Desk Agent

                                         then implements the solution

                                         for the User.

            Match to open Incident?      The Service Desk Agents                              Service Desk Agent
                                         checks to see whether
                                         another open incident is
                                         similar to the new request,
                                         and if a match can be made.
                                         If a match can be made,
                                         proceed to SO 0.3.10. If not,
                                         log the incident.

            Relate Interaction to Incident If an open incident matches Service Desk Agent
                                               the new request, the Service
                                               Desk Agent relates the two.


Process ID  Procedure or Decision         Description                     Role
SO 0.3.11
            Save and Provide Interaction  The Service Desk Agent          Service Desk Agent
            ID to User                    saves the incident and
                                          provides the Interaction ID to
                                          the User.


1.9.2.4. Interaction Closure (process SO 0.4)

When an interaction is resolved by the Service Desk on first intake, or solved by a related incident, change, or request that's
resolved, the interaction is closed. Based on user preferences, the Service Desk communicates the solution to the user by phone
or email.
You can see the details of this process in the following figure and table.
Interaction Closure (SO 0.4) is illustrated in the following figure:


                                        Interaction Closure (SO 0.4) process

Process ID  Procedure or Decision       Description                           Role
SO 0.4.1
SO 0.4.2    Update Interaction from     The Interaction could involve         Service Desk Agent
SO 0.4.3    linked record               the closure of an incident,
SO 0.4.4                                change request, or service
SO 0.4.5                                request, or the submission
SO 0.4.6                                of a complaint.
SO 0.4.7
            Notify by phone?            If the Notify By method               Service Desk Agent
SO 0.4.8                                states that the user wants to
SO 0.4.9                                be notified by phone, go to
SO 0.4.10                               SO 0.4.5. If not, go to SO
                                        0.4.3.
SO 0.4.11
            Notify by email?            If the Notify By method               Service Desk Agent
                                        states that the user wants to
                                        be notified by email, go to
                                        SO 0.4.4. If not, the User
                                        doesn't need to be notified.

            Send email notification to  Send the email notification. Service Desk Agent
            User

            Check solution              The Service Desk agent                Service Desk Agent
            completeness
                                        checks the solution provided

                                        for all Callback interactions.

            Service Desk Agent accepts If yes, go to SO 0.4.7. If not, Service Desk Agent

            solution?                   go to SO 0.4.11.

            Verify solution with the    The Service Desk Agent                Service Desk Agent
            User(s)                     contacts the user and
                                        communicates the
                                        resolution. The user should
                                        verify the solution and
                                        confirm that the incident is
                                        solved and that the question
                                        or complaint is answered, or
                                        the Service Request is
                                        fulfilled.

            User accepts solution?      If yes, go to SO 0.4.9. If no, Service Desk Agent
                                        go to SO 0.4.10.

            Close interaction           The Service Desk Agent                Service Desk Agent
                                        closes the interaction.

            Reopen or Create new        The solution provided may             Service Desk Agent
            Incident                    not solve the issue for all
                                        users. If the solution doesn't
                                        solve the issue for all users,
                                        the Service Desk Agent
                                        must either reopen the
                                        existing record or log the
                                        incident.

            Reopen relevant record      The Service Desk agent                Service Desk Agent
                                        reopens the incident for
                                        further investigation and
                                        diagnosis.



1.9.2.5. Withdraw Interaction (process SO 0.5)

The Withdraw Interaction process identifies the steps to withdraw an interaction.
You can see the details of this process in the following figure and table.
Withdraw Interaction (process SO 0.5) is illustrated in the following figure:

                                        Withdraw Interaction (SO 0.5) process

Process ID  Procedure or Decision       Description                                Role
SO 0.5.1
            Request for withdrawal      The user contact the Service               Service Desk Agent
SO 0.5.2                                Desk Agent and ask for the
SO 0.5.3                                interaction to be withdrawn
SO 0.5.4                                on their behalf by providing
SO 0.5.5                                appropriate information.
SO 0.5.6
            Verify the withdrawal       The Service Desk Agent                     Service Desk Agent
            request                     verifies the request to check
                                        whether the Interaction can
                                        be withdrawn or not.

            Perform withdrawal          The Service Desk Agent                     Service Desk Agent
            activities                  performs withdrawal
                                        activities for the request.

            Withdrawal successful?      If the withdrawal is                       Service Desk Agent

                                        successful, go to SO 0.5.5. If

                                        not, go to SO 0.5.6.

            Update and close the        The user is informed about                 Service Desk Agent
            Interaction                 the Interaction withdrawal
                                        and go to SO 0.4.9 to close
                                        the Interaction.

            Update the user             The user is communicated                   Service Desk Agent
                                        on the reason why the
                                        Interaction can't be
                                        withdrawn. The Interaction
                                        moves to the previous status
                                        and the provisioning
                                        continues.
````
