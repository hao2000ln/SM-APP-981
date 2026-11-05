---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.9.19 .. 1.9.20
printed_pages: 2722-2759
---

# 1.9.19 Request Fulfillment overview

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.9.19. Request Fulfillment overview

The Service Manager Request Fulfillment application, referred to as Request
Fulfillment throughout this chapter, supports the Request Fulfillment process. It
enables you to route and support all requests for non-standard operational services in
an effective way, and ensure that requests will not compromise day-to-day
operational activities.

This section describes how Request Fulfillment implements the best practice
guidelines for the Request Fulfillment processes. Topics in this section include:

     Request Fulfillment within the ITIL framework
     Request Fulfillment application
     Request Fulfillment process overview
     Input and output for Request Fulfillment
     Key performance indicators for Request Fulfillment
     RACI matrix for Request Fulfillment


1.9.19.1. Request Fulfillment within the ITIL
framework

Request Fulfillment is addressed in ITIL’s Service Operation publication. The
document describes Request Fulfillment as the process responsible for dealing with
Service Requests. Many of these are actually small-sized, low cost, frequently
performed, and low-risk, which means they are better handled by a separate process
rather than being allowed to congest and obstruct the normal incident and change
management processes.

Request Fulfillment enables you to meet the following business objectives:

     Maintain user and customer satisfaction through efficient and professional
     handling of all service requests.
     Provide a channel for users to request and receive standard services for which a
     pre-defined authorization and qualification process exists.
     Provide information to users and customers about the availability of services and
     the procedures for obtaining them.
     Source and deliver the components for requested standard services such as
     licenses and software media.
     Assist with some general information, complaints or comments.

Request Fulfillment includes the following key features:

     Request model, which defines the prerequisites, required authorizations, and
     sequenced or parallel standard tasks to fulfill the service request
     A detailed, customizable catalog of products
     Scheduling of service requests and tasks
     Automated request fulfillment
     Order and stock management
     Interaction with other Service Manager applications, such as Service Catalog,
     Configuration Management, Service Desk, Incident Management, Change
     Management, and Service Level Management
     Integration with other Service Manager applications, such as Configuration
     Management and Change Management.
     Integration with other products, including:

           Providing a common web service interface so that other products are able
           to access service requests and tasks
           Integration with Asset Manager for request fulfillment billing



1.9.19.2. Request Fulfillment application

Service Manager Request Fulfillment is an application used to manage user requests
for products and services. Requests affect only the person making the request, or a
subordinate group of employees. Examples include password resets, individual PC
upgrades, and new employee setup.

The Request Fulfillment application enables business staff to improve their
productivity or the quality of business services and products. It can also help reduce
the cost of providing services and reduce people effort involved in requesting and
receiving access to services. Moreover, the use of Request Fulfillment application can
increase the control level of an organization’s services and the number of fulfilled
requests.

Request Fulfillment includes the following key features:

     Request model, which defines the prerequisites, required authorizations, and
     sequenced or parallel standard tasks to fulfill the service request

     A detailed catalog of products that you can customize

     Scheduling of service requests and tasks

     Automated request fulfillment

     Order and stock management

     Interaction with other Service Manager applications, such as Service Catalog,
     Configuration Management, Service Desk, Incident Management, Change
     Management, and Service Level Management

     Integration with other products, including:

          • Providing a common web service interface so that other products are able
          to access service requests and tasks

          • Integration with Asset Manager for request fulfillment billing


1.9.19.2.1. Differences between Request
Fulfillment and Change Management

Request Fulfillment and Change Management are separate processes, but they are
closely related. Request Fulfillment handles common user requests for products and
services. These requests usually affect only the person making the request, or a
subordinate group of employees. Change Management handles any change to your
business that modifies or disrupts the current state of that environment. Usually these
modifications or disruptions affect multiple users or business units.

     Request Fulfillment
           Handles common requests for products and services.
           Affects a small or limited number of users.
           Scope is limited.

     Change Management
           Manages changes (implementations) that modify a business environment.
           Affects many users.
           Scope is often large, including large groups or multiple business units.


1.9.19.2.2. Key elements of Request
Fulfillment

Request Fulfillment includes the following key elements.

Request Model

A repeatable model of handling a particular category of service request. A request
model defines specific agreed tasks that need to be followed to fulfill the service
request of this category. Request models can be very simple, with no requirement for
authorization (for example, password reset), or can be complex with many sequential
or parallel tasks that require authorization (for example, provision of an existing IT
service).

Product Catalog

The product catalog is a predefined catalog of products (hardware, software, or
called parts). The product catalog defines the models of independent items that may
be requested or ordered.

The product catalog supports general information of parts, including part number,
description, cost, and manufacturer. The inventory of the specific item is also
available in the product catalog portal. The receiving details of the purchased items
can be pre-defined in the product catalog.

Catalog items are represented as records in the productCatalog table.

Vendors

Vendors are internal or external providers of parts. Vendors have a many-to-many
relationship with catalog items, and may or may not directly interact with
Service Manager.

Vendors are represented as records in the vendor table. The terms under which a
specific vendor will provide a specific catalog item are stored in the modelvendor
table.

Requests

A request is a high level record that defines the basic request information such as
requester, required dates, coordinator, and description. Request records are the
"tickets" that trace the workflow of a request from the user perspective, data entry
and request task addition, through authorizations, fulfillment, and follow-up.


Request records are stored in the request table.

Request Tasks

A request task is a low level record that defines one of the steps to fulfill the service
request. Request tasks can be created automatically according to the request model
definition or manually by the authorized users. After creation, request tasks are
assigned to internal workgroups or external vendors.

Request tasks are stored in the requestTask table.

Orders

Order records are the "tickets" that trace the workflow of an actual order of a part
item or several part items from the ordering and receiving perspective. Orders are
created manually by authorized users or by automated background processes when
the reorder rules defined for stock management are satisfied.

Order records are stored in the request table, with a particular "Order" category.

Authorization processing

The authorization process automates and formalizes the technical and business
evaluation by the appropriate levels of management of requests. Authorizations
control accepts risk, cost, and responsibility of a request and its tasks. Authorizations
create "chains" of groups who may be required to approve requests before they can
advance within their lifecycle. Authorizations can have conditions attached, such as
total cost, lead time requirements, and impact.

Authorizations can be defined either in request model or in the dedicated
Authorization phase of the request fulfillment workflow.


1.9.19.3. Request Fulfillment process
overview

The Request Fulfillment process includes the activities required to select items from
service catalog and submit a service request, to give financial and business
approvals, to provision, and to fulfill service requests. It is responsible for ensuring
that an IT support is offered for self-help practices and requests can be effectively
fulfilled after needed authorizations.

A general overview of the Request Fulfillment processes and workflows is depicted in
the figure below. These workflows are described in detail in Request Fulfillment
Workflows.


Request Fulfillment user roles

The following table describes the responsibilities of Request Fulfillment user roles.


Role                                    Request Fulfillment user roles
Request Process Owner
                                                     Responsibilities

                                        Designs request fulfillment
                                        models and workflows.
                                        Ensures process technicians have
                                        the required knowledge and the
                                        required technical and business
                                        understanding to deliver the
                                        process, and understand their role
                                        in the process.
                                        Communicates process
                                        information or changes as
                                        appropriate to ensure awareness.
                                        Reviews opportunities for process
                                        enhancements and for improving
                                        the efficiency and effectiveness
                                        of the process.
                                        Works with other process owners
                                        to ensure there is an integrated
                                        approach to the design and
                                        implementation of request
                                        fulfillment, incident management,
                                        event management, access
                                        management, and problem
                                        management.

User
                                                    Uses Self Service or the Service
                                                    Desk to log appropriate Service
                                                    Requests.

Requester                               Initiates a Service Request
                                        through the Request Fulfillment
                                        portal on behalf of users.

 Role                                                                                           Service Manager 9.81
 Request Coordinator
                                        Responsibilities
 Request Analyst
 Request Approver                            Provides a single point of contact
                                             and end-to-end responsibility to
This PDF was generated on May 23, 2026       ensure submitted Service
                                             Requests have been processed.
                                             Provides initial triage of Service
                                             Requests to determine which IT
                                             resources should be engaged to
                                             fulfill them.
                                             Assigns a Service Request to the
                                             correct group.
                                             Communicates Service Requests
                                             to other IT resources that will be
                                             involved in fulfilling them.
                                             Escalates Service Requests in line
                                             with established Service Level
                                             Targets.

                                             Carries out one or more activities
                                             in the fulfillment of Service
                                             Requests.
                                             Updates the records to show that
                                             activities have been carried out
                                             correctly.
                                             Responsible for the provisioning
                                             of Service Requests within the
                                             agreed SLA.

                                             Reviews Service Request details.
                                             Confirms Service Request details
                                             are correct.
                                             Approves/Rejects Service
                                             Requests.

                                                                                                                        Page 115 of 387
Role                                                                                            Service Manager 9.81
Request Manager
                                        Responsibilities
Stock Manager
                                             Plans and manages support for
                                             request fulfillment tools and
                                             processes.
                                             Handles staff, customer and
                                             management concerns, requests,
                                             issues and enquiries.
                                             Involved in Service Request
                                             escalation.
                                             Ensures request fulfillment
                                             activities operate in line with
                                             service level targets.

                                             Responsible for managing stock
                                             and defining reorder rules for
                                             different stockrooms.


1.9.19.4. Input and output for Request
Fulfillment

Requests can be triggered and resolved in several ways. The following table outlines
the inputs and outputs for the Request Fulfillment process.

                                        Input and output for Request Fulfillment

Input to Request Fulfillment            Output from Request Fulfillment

Service Requests                        Authorized/rejected service
RFCs                                    requests
Requests from various sources           Request fulfillment status reports
such as phone calls, web                Fulfilled service requests
interfaces, or emails                   Incidents (rerouted)
Request for information                 RFCs/standard changes
                                        Asset/CI updates
                                        Updated request records
                                        Closed service requests


1.9.19.5. Key performance indicators for
Request Fulfillment

The Key Performance Indicators (KPIs) in the following table are useful for evaluating
your Request Fulfillment processes. To visualize trend information, it is useful to graph
KPI data periodically. In addition to the data provided by Service Manager, you may
need additional tools to report on all of your KPI requirements.

Title                  Key Performance Indicators for Request Fulfillment

                                             Description

Number of service requests              The total number of Service Requests.
                                        The indicator is used as a control
                                        measure.

Size of backlog                         The size of current backlog of
                                        outstanding service.

Elapsed time                            The mean elapsed time for handling
                                        each type of Service Requests.

Average cost                            The average cost per type of Service
                                        Request.

Customer satisfaction                   The level of user satisfaction with the
                                        handling of Service Requests (as
                                        measured in some form of satisfaction
                                        survey).

For completeness, the ITIL 2011 CSFs and KPIs are included below.

ITIL 2011 Critical Success Factors and Key
Performance Indicators

The following are ITIL 2011 CSFs and KPIs for Request Fulfillment:


     CSF - Requests must be fulfilled in an efficient and timely manner that's aligned
     to agreed service level targets for each type of request

           KPI - The mean elapsed time for handling each type of service request
           KPI - The number and percentage of service requests completed within
           agreed target times
           KPI - Breakdown of service requests at each stage (e.g. logged, work in
           progress, closed etc.)
           KPI - Percentage of service requests closed by the service desk without
           reference to other levels of support (often referred to as "first point of
           contact")
           KPI - Number and percentage of service requests resolved remotely or
           through automation, without the need for a visit
           KPI - Total numbers of requests (as a control measure)
           KPI - The average cost per type of service request
     CSF - Only authorized requests should be fulfilled
           KPI - Percentage of service requests fulfilled that were appropriately
           authorized
           KPI - Number of incidents related to security threats from request
           fulfillment activities
     CSF - User satisfaction must be maintained
           KPI - Level of user satisfaction with the handling of service requests (as
           measured in some form of satisfaction survey)
           KPI - Total number of incidents related to request fulfillment activities
           KPI - The size of current backlog of outstanding service requests.

Contents

     1 ITIL 2011 Critical Success Factors and Key Performance Indicators


1.9.19.6. RACI matrix for Request
Fulfillment

A Responsible, Accountable, Consulted, and Informed (RACI) diagram or RACI matrix
is used to describe the roles and responsibilities of various teams or people in
delivering a project or operating a process. It is especially useful in clarifying roles
and responsibilities in cross-functional/departmental projects and processes. The
RACI matrix for Request Fulfillment is shown in the following table.

                                        RACI matrix for Request Fulfillmen

Process  Activity                       User/Re  Request  Request           Request Request
ID                                      quester  Coordin  Analyst
                                                 ator                       Approve Manage

                                                                            r  r

SO 3.1 Receive R                                 R                             A

         Request

SO 3.2 Request                                   R                             A

         Logging

SO 3.3 Request I                                 C                          R  A

         Authoriz

         ation

SO 3.4 Request I                                 R        R                    A/C

         Fulfillme

         nt

SO 3.5 Request                                   C                             A/R

         Review

SO 3.6 Request I                                 R                             A

         Closure


1.9.20. Request Fulfillment workflows

The Request Fulfillment process includes the activities required to select items from
service catalog and submit a service request, to give financial and business
approvals, to provision, and to fulfill service requests. It is responsible for ensuring
that an IT support is offered for self-help practices and requests can be effectively
fulfilled after needed authorizations.

The Request Fulfillment process consists of the following processes, which are
included in this chapter:

     Receive Request (process SO 3.1)
     Request Logging (process SO 3.2)
     Request Authorization (process SO 3.3)
     Request Fulfillment (process SO 3.4)
     Request Review (process SO 3.5)
     Request Closure (process SO 3.6)


1.9.20.1. Receive Request (process SO 3.1)

Fulfillment work on service requests should not begin until a formalized request is
received.The Receive Request process starts when a User or Requester uses Self
Service or the Service Desk to log appropriate Service Requests. It is also usual to
have requests that come in from other sources such as RFCs, emails, web interfaces,
or phone calls. A Service Request submitted by the User or Requester can be a
request for existing Service Catalog, a request for a new service, or an amendment to
the Service Catalog. The Request Coordinator needs to triage and analyze the
request, and then decide what to do next. As a result of the Receive Request process,
a Service Request will be logged.
The following user roles can perform Receive Request:

     User or Requester
     Request Coordinator

Details for this process can be seen in the following figure and table.
The Receive Request workflow is illustrated in the following figure:


                                        Receive Request process

Process ID  Procedure or                Description              Role
SO 3.1.1
            Decision
SO 3.1.2
            Triage and                  New Service              Request
            analyze the new             Requests mostly          Coordinator
            Service Request             come from the
                                        Service Desk or
                                        Service Catalog.
                                        It is also usual to
                                        have requests
                                        that come in from
                                        RFCs, emails,
                                        web interfaces or
                                        phone calls.

                                        Based on the
                                        information
                                        provided by User
                                        or Requester,
                                        Request
                                        Coordinator will
                                        triage and
                                        analyze the new
                                        Service Request
                                        from different
                                        sources.

            Is this really a            Initially, it must be    Request
            Service Request?            determined               Coordinator
                                        whether the
                                        request is really a
                                        Service Request
                                        or not. If yes, go
                                        to SO 3.2.1 to log
                                        the Service
                                        Request. If no, go
                                        to SO 3.1.3.

Process ID  Procedure or                Description                  Service Manager 9.81
SO 3.1.3    Decision
                                                              Role
            Is this an
            Incident?                   In some cases, an     Request
                                        Incident has          Coordinator
                                        taken place, but a
                                        Service Request
                                        is reported. If this
                                        is the case, go to
                                        SO 2.1.8 to create
                                        a new Incident.
                                        The Service
                                        Request and any
                                        related
                                        information
                                        should be
                                        forwarded to
                                        Incident
                                        Management. If
                                        not, go to SO
                                        3.1.4.


Process ID  Procedure or                Description           Role
SO 3.1.4    Decision
                                        In other cases,       Request
            Request for new             the request may       Coordinator
            or changed                  actually be a
            service?                    request for new
                                        or changed
                                        service features.
                                        If this is the case,
                                        the Service
                                        Request will be
                                        passed to the
                                        Service Portfolio
                                        Management
                                        processes to
                                        properly review
                                        the need and
                                        business case for
                                        the service
                                        change. If not, go
                                        to SO 3.2.1 to log
                                        the Service
                                        Request.


1.9.20.2. Request Logging
(process SO 3.2)

All Service Requests must be fully logged and date/time stamped, regardless of
whether they are raised through a Service Desk, RFC, telephone call, or email.
Allocating suitable request categorization code should take place at the very
beginning of the logging process, so that the exact type of the request is recorded.
Besides the categorization code, allocating appropriate prioritization code and
determining assignment group/person to fulfill the request are also the important
steps in the Request Logging process.

The following user roles can perform Request Logging:

     Request Coordinator

Details for this process can be seen in the following figure and table.

The Request Logging workflow is illustrated in the following figure:


                                        Request Logging process

Process ID  Procedure or                Description              Role
SO 3.2.1
            Decision
SO 3.2.2
            Request                     Before request           Request
            Categorization              details are              Coordinator
                                        recorded, the
                                        appropriate
                                        request model
                                        (grouped by
                                        request
                                        category/sub-
                                        category) or
                                        request category
                                        should be chosen
                                        based on the type
                                        of request being
                                        fulfilled.

            Request Logging             All relevant             Request
                                        information of the       Coordinator
                                        request must be
                                        logged so that a
                                        full historical
                                        record is
                                        maintained. The
                                        information
                                        needed for a
                                        Service Request
                                        is listed in the
                                        "Request
                                        Fulfillment
                                        Details" section.

Process ID  Procedure or                Description                 Service Manager 9.81
SO 3.2.3    Decision
            Request                                          Role
SO 3.2.4    Prioritization
                                        Appropriate          Request
            Request                     prioritization code  Coordinator
            Assignment                  helps to
                                        determine how
                                        the Service
                                        Request is
                                        handled by
                                        support tools and
                                        support staff.
                                        Prioritization can
                                        normally be
                                        determined by
                                        both the urgency
                                        of the request
                                        (how quickly the
                                        business needs to
                                        have it fulfilled)
                                        and the level of
                                        impact it is
                                        causing.

                                        In the request       Request
                                        logging stage, the   Coordinator
                                        assignment
                                        group/person of
                                        the Service
                                        Request is
                                        determined either
                                        by a pre-defined
                                        assignment rule
                                        or Request
                                        Coordinator.


1.9.20.3. Request Authorization
(process SO 3.3)

No work should take place to fulfill a request until it has been properly authorized.
Simple requests can be pre-authorized, while a more rigorous authorization may be
needed for other requests before any work can proceed.
A Service Request that can't be properly authorized should be returned to the
Request Logging phase.
The following user roles can perform Request Authorization:

     Request Approver
Details for this process can be seen in the following figure and table.
The Request Authorization workflow is illustrated in the following figure:


                                        Request Authorization process

Process ID  Procedure or                Description                    Role
SO 3.3.1
            Decision
SO 3.3.2
            Simple request              If it is a simple              Request Approver
            that's pre-                 request that
            authorized?                 doesn't require a
                                        dedicated
                                        authorization, go
                                        to SO 3.4.1 to
                                        execute the
                                        request model. If
                                        a more rigorous
                                        authorization is
                                        required, go to
                                        SO 3.3.2 for
                                        request
                                        authorization.

            Authorize                   Request Approver               Request Approver
            request?                    reviews the
                                        Service Request
                                        details and
                                        decide to approve
                                        or deny the
                                        request. If
                                        request is
                                        approved, go to
                                        SO 3.4.1 to
                                        execute the
                                        request model. If
                                        request is denied,
                                        go to SO 3.3.3.


1.9.20.4. Request Fulfillment
(process SO 3.4)

In the Request Fulfillment process, the process steps and activities indicated in the
request model are executed by the assignment group/person to fulfill the request. The
process steps and activities are created as request tasks.

The following user roles can perform Request Fulfillment:

     Request Coordinator
     Request Analyst
     Request Manager

Details for this process can be seen in the following figure and table.

The Request Fulfillment workflow is illustrated in the following figure:


                                        Request Fulfillment process

Process ID  Procedure or                Description                  Role
SO 3.4.1
            Decision
SO 3.4.2
            Request Model               The request tasks            Request Analyst
            Execution                   defined in the
                                        request model are
                                        executed by the
                                        Request Analyst
                                        who is the task
                                        assignee. In some
                                        cases, additional
                                        tasks out of the
                                        request model
                                        may be added
                                        and executed in a
                                        request record if
                                        necessary.

            Does any request            During request               Request Analyst
            task need                   fulfillment,
            additional                  Request Analyst
            information from            checks whether
            user/requester?             the information
                                        provided to fulfill
                                        the request is
                                        enough or not. If
                                        yes, go to SO
                                        3.4.3. If no, go to
                                        SO 3.4.4.


Process ID  Procedure or                Description         Role
SO 3.4.3    Decision                                        Request Analyst
            Waiting for                 Request task
SO 3.4.4    information                 status is set as    Request Analyst
SO 3.4.5    provided from               “Pending            Request Analyst
            user/requester              Customer” and a
                                        “Visible to
            Continue request            Customer”
            task execution              update is added,
                                        so that User or
            Any CI impacted?            Requester will be
                                        informed.

                                        Request Analyst
                                        continues task
                                        execution with
                                        sufficient
                                        information
                                        provided by User
                                        or Requester.

                                        Request Analyst
                                        checks whether
                                        CIs are impacted
                                        during request
                                        fulfillment
                                        process. If yes,
                                        go to SO 3.4.6. If
                                        no, go to SO
                                        3.4.7.


Process ID  Procedure or                Description          Role
SO 3.4.6    Decision
            Will CI status be           If only CI status    Request Analyst
SO 3.4.7    updated?                    needs to be
                                        updated or new
            Any incident                CIs are going to
            occurred?                   be created, go to
                                        the Service Asset
                                        & Configuration
                                        Management
                                        process (ST 3.3.1)
                                        to review and
                                        update the CIs. If
                                        no, go to the
                                        Change
                                        Management
                                        process (ST 2.1.1)
                                        to raise and log
                                        RFC.

                                        If an incident       Request Analyst
                                        occurs during
                                        request fulfillment
                                        process, the new
                                        incident will be
                                        created by the
                                        Incident
                                        Management
                                        process (SO 2.1.8)
                                        and related to the
                                        request. If no
                                        incident occurs,
                                        go to SO 3.4.8.


Process ID  Procedure or                Description          Role
SO 3.4.8
            Decision
SO 3.4.9
SO 3.4.10   Is SLT going to be          In the whole         Request
            breached?                   request fulfillment  Coordinator
                                        process, Request
                                        Coordinator
                                        keeps monitoring
                                        the Service Level
                                        Target. If SLT is
                                        going to be
                                        breached,
                                        Request
                                        Coordinator will
                                        escalate the
                                        request in time
                                        (SO 3.4.9). If no,
                                        go to SO 3.4.11.

            Escalate the                Request              Request
            request                     Coordinator          Coordinator
                                        indicates the
                                        responsible
                                        Request Manager
                                        whom the Service
                                        Request will be
                                        escalated to.

            Execute                     The Request          Request Manager
            escalation actions          Manager
                                        determines the
                                        actions to be
                                        performed to
                                        fulfill the request
                                        within the target
                                        time and
                                        designates the
                                        persons to
                                        execute the
                                        actions.

Process ID  Procedure or                Description                 Service Manager 9.81
SO 3.4.11   Decision
                                                             Role
            Request is
            fulfilled?                  Request              Request
                                        Coordinator looks    Coordinator
                                        up the execution
                                        progress of
                                        request tasks and
                                        if all tasks are
                                        finished, go to SO
                                        3.5.1 to review the
                                        fulfillment result.
                                        If some tasks
                                        aren't closed, go
                                        to SO 3.4.1 to
                                        continue task
                                        execution in
                                        request model.


1.9.20.5. Request Review
(process SO 3.5)

After a request is fulfilled, the accountable person should review the fulfillment result
including the fulfillment costs, whether the fulfillment activities are in line with Service
Level Target, and so on.

The following user role can perform Request Review:

     Request Manager

Details for this process can be seen in the following figure and table.

The Request Review workflow is illustrated in the following figure:


                                        Request Review process

Process ID  Procedure or                Description             Role
SO 3.5.1
            Decision
SO 3.5.2
            Review request              The Request             Request Manager
            fulfillment result          Manager reviews
                                        the request
                                        fulfillment result,
                                        including the
                                        costs for the
                                        fulfillment
                                        activities,
                                        whether Service
                                        Level Target has
                                        been achieved,
                                        and so on.

            Is the fulfillment          Request Manager         Request Manager
            result satisfying?          decides whether
                                        the fulfillment
                                        result is
                                        satisfying. If yes,
                                        go to SO 3.6.1. If
                                        no, go to SO 3.4.1
                                        to re-fulfill the
                                        request.


1.9.20.6. Request Closure
(process SO 3.6)

Once the Service Request activities are completed, the Financial Management
process might be involved for fulfillment cost billing. When the closure action
happens, request categorization should be checked and confirmed. When a request
is closed, Service Desk will be notified of the completion status, and the Service Desk
will communicate with User or Requester on the fulfillment result. User satisfaction
survey can also be carried out for some requests.

The following user role can perform Request Closure:

     Request Coordinator

Details for this process can be seen in the following figure and table.

The Request Closure workflow is illustrated in the following figure:


                                        Request Closure process

Process ID  Procedure or                Description              Role
SO 3.6.1
            Decision
SO 3.6.2
            Fulfillment cost            The Financial            Request
            billing                     Management               Coordinator
                                        process will need
                                        to be notified of
                                        any costs
                                        incurred by the
                                        fulfillment
                                        activities.

            Closure                     When the closure         Request
            categorization              action happens,          Coordinator
                                        request
                                        categorization will
                                        be checked and
                                        confirmed. If the
                                        categorization
                                        subsequently
                                        turns out to be
                                        incorrect,
                                        Request
                                        Coordinator will
                                        update the
                                        request record so
                                        that a correct
                                        closure
                                        categorization is
                                        recorded for the
                                        request. Request
                                        Coordinator can
                                        ask for advice or
                                        guidance from
                                        the fulfillment
                                        groups as
                                        necessary.


Process ID  Procedure or                Description          Role
SO 3.6.3    Decision
            Service request             When the Service     Request
SO 3.6.4    closure                     Request is           Coordinator
                                        formally closed,
            User satisfaction           Service Desk will
            survey                      be notified of the
                                        completion status
                                        and the related
                                        Interaction will be
                                        updated
                                        accordingly (SO
                                        0.4.1). Service
                                        Desk then
                                        communicates
                                        with User or
                                        Requester on the
                                        fulfillment result.
                                        In case User or
                                        Requester is
                                        unsatisfied with
                                        the fulfillment
                                        result, the request
                                        record may be re-
                                        opened.

                                        A user               Request
                                        satisfaction         Coordinator
                                        survey can be
                                        carried out for the
                                        agreed
                                        percentage of
                                        closed requests.
````
