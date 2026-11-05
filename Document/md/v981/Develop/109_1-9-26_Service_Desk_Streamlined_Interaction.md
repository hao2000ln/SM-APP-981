---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.9.26 .. 1.9.26.1
printed_pages: 2937-2951
---

# 1.9.26 Service Desk (Streamlined Interaction)

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.9.26. Service Desk (Streamlined
Interaction)

The following sections are based on the Streamlined Interaction solution, which is
introduced as of Service Manager 9.41. The Streamlined Interaction feature is optional
and is disabled by default. You need to manually enable it before you read the topics
in this section. To enable the Streamlined Interaction solution, see Service
Manager9.61 Help Center.

            Note

           For information about the previous Service Desk application (Codeless
           mode) that's not based on the new Streamlined Interaction solution, see
           Service Desk Overview.


1.9.26.1. Service Desk Overview
(Streamlined Interaction)

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

Topics in this section include:

     Service Desk within the ITIL framework
     Service Desk application
     Service Desk process overview
     Input and output for Service Desk Interaction Management
     Key performance indicators for Service Desk Interaction Management
     RACI matrix for Service Desk Interaction Management


1.9.26.1.1. Service Desk within the ITIL
framework

Service Operation is one of five core publications from ITIL that covers the service
lifecycle. The purpose of service operation is to deliver agreed-on levels of service to
users and customers, and to manage the applications, technology, and infrastructure
that support delivery of the services.

The service desk is a key function of service operation. It provides a single, central
point of contact for all users of IT. Service desk staff execute the incident
management and request fulfillment processes to restore normal service to users as
quickly as possible. Restoring normal service could involve fixing a technical fault,
fulfilling a service request, or answering a query — whatever is needed to enable
users to return to their work. The service desk logs and manages customer
interactions and provides an interface to other service operation processes and
activities.

ITIL 2011 notes these specific responsibilities of a service desk:

     Logging, categorizing, and prioritizing all calls
     Providing first-line investigation and problem diagnosis
     Resolving incidents or service requests when first contacted or whenever
     possible
     Escalating incidents and service requests that can't be resolved within agreed-
     on time limits
     Closing resolved incidents, requests, and other calls
     Communicating with users to keep them informed of progress, impending
     changes, agreed-on outages, and other such notifications


1.9.26.1.2. Service Desk application

The Service Manager Service Desk application incorporates the ITIL best practices
that are used by organizations worldwide to establish and improve their capabilities in
service management.

It provides a central Service Operation function, coordinating the efficient and
effective delivery of services to end users and enabling various improvements,
including the following:

     Improved customer service and satisfaction
     Increased accessibility through a single point of contact and information
     Better quality and faster turnaround of customer or user requests
     Improved teamwork and communication
     Enhanced focus and a proactive approach to service provision
     Improved usage of IT resources and increased productivity of all users

The Service Desk application enables a Service Desk agent to document and track
user interactions. Service Desk provides one-click access to other Service Manager
applications to automatically enter information received.

The Service Desk application covers:

     Direct interactions between a user and the service desk by phone or by email
     User activities that occur from use of the self-service web portal (for example,
     searching the knowledge base, checking for status updates, or logging an
     interaction).

One of the best practices that derives from ITIL’s service desk function is that user
interactions should not be saved and updated later. Therefore, the Service Desk
application requires resolving any new complaints or compliments within the agreed
upon time limits and then closed, or triggering fulfillment processes for the other
types of interactions. The information gathered during the customer interaction can
be used to open an incident, service request, or other fulfillment records. It can also
be added to a record in another Service Manager application such as Incident
Management.


1.9.26.1.3. Service Desk process overview

Every user contact with the service desk is logged as an interaction. User Interaction
Management is the process for handling all interactions with the service desk that are
received from self-service Web pages or directly by service desk personnel. These
interactions can include service disruptions, service requests, requests for
information (RFI), complaints, or compliments reported by users who communicate
with the service desk by using instant messages, phone, E-mail, or by self-service
Web pages. The User Interaction Management process enables you to easily log and
resolve simple user requests (such as complaints and compliments) and to escalate
others into fulfillment processes (such as Incident Management) requiring further
action.

A general overview of the User Interaction Management processes and workflows is
depicted below. They are described in detail in Service Desk Workflows (Streamlined
Interaction).


When a user contacts the service desk, the Service Desk agent uses the Service
Desk application to create an interaction record. The Service Desk agent records the
user name, the name of the component that the user is calling about, and a
description of the service request. After collecting this information, the Service Desk
agent performs the actions required to resolve the user request.

     If the user request is a complaint or compliment, the Service Desk manager can
     handle the interaction and close it.
     If the user request can be resolved by the Service Desk agent on first contact,
     the Service Desk agent will use the interaction to trigger an incident or a service
     request, and then close the incident or service request directly with the solution
     provided. Then, the interaction will be closed automatically.


     If the user request can't be resolved without escalation, the Service Desk agent
     can register a new record in a fulfillment process (such as the incident, service
     request, problem, or change fulfillment process) based on the Service Desk
     interaction. Service Desk copies information from the interaction record into the
     newly created fulfillment record.

For example, consider a user who can't print to a network printer:

     The user contacts the service desk for assistance.
     The Service Desk agent populates an interaction record with the relevant
     information.
     Because the issue can't be resolved immediately, the Service Desk agent opens
     an incident, and the incident is assigned to a technician.
     The technician discovers that the printer network connection is broken.
     The technician fixes the connection and closes the incident. The interaction is
     automatically closed accordingly.
     The Service Desk agent contacts the user and instructs the user to attempt
     printing to the network printer.
     If the user can successfully print, the Service Desk agent can send out survey
     based on the closed interaction. If the user still can't print, the Service Desk
     agent may register a new interaction and then escalate the interaction to a new
     incident.
     If the user wishes to report a related or new issue, the Service Desk agent opens
     a new interaction detailing the new issue that the user needs to report.

Interaction categories

Service Manager categories classify and define the type of interaction. Each category
could have its own workflow process. The steps of the workflow are represented by
the phases. Service Manager requires that every interaction has an interaction
category and phases.

Interaction phases

Service Manager uses phases to describe the steps needed to complete an
interaction. The phase also determines the forms that users see, and the actions that
users can trigger manually.

The following figure shows the workflow phases for an interaction (complaint or
compliment).


Service Desk user roles

The following table describes the responsibilities of the User Interaction Management
user roles.


Role                                    User Interaction Management user roles
User
                                                          Responsibilities
Service Desk Agent
                                        Report all IT-related requests to
                                        the service desk or use the self-
                                        service web pages.
                                        Validate solutions and answers
                                        provided by the IT department to
                                        a registered service request.

                                        Register interactions based on
                                        contact with users.
                                        Solve and close interactions.
                                        Provide status updates to users
                                        on request.
                                        Register incidents based on user
                                        interactions and assign them to
                                        the correct support groups.
                                        Register requests for change,
                                        based on user interactions.
                                        Register service requests, based
                                        on user interactions.
                                        Register problems, based on user
                                        interactions.
                                        Validate solutions provided by
                                        support groups.
                                        Report and verify solutions to
                                        users.
                                        Monitor Service Level Agreement
                                        (SLA) targets of all interactions.
                                        Communicate about service
                                        outages to all users.

Role                                                                                            Service Manager 9.81
Service Desk Manager
                                        Responsibilities

                                             Appoint people to the required
                                             roles.
                                             Manage resources assigned to
                                             the service desk.
                                             Manage service desk activities.
                                             Attend CAB meetings.
                                             Report any issue that could
                                             significantly impact the business
                                             to senior managers.
                                             Take overall responsibility for
                                             incident and service request
                                             handling on the service desk.
                                             Monitor and report on service
                                             desk performance.
                                             Make improvements to the
                                             service desk.


1.9.26.1.4. Input and output for Service
Desk Interaction Management

Interactions can be triggered and resolved in several ways. The following table
outlines the input and output for the User Interaction Management process.

Input and output for Service Desk Interaction Management

Input to Service Desk Interaction       Output from Service Desk Interaction
Management                              Management

A user can contact Service Desk and     Service Desk personnel can handle an
give input by using instant messages,   interaction in the following ways:
phone, email, self-service web pages,
or other means.                              If the interaction is a user
                                             complaint or compliment, the
                                             interaction is handled by Service
                                             Desk.
                                             If the interaction can be resolved
                                             by Service Desk when first
                                             contacted, the interaction will be
                                             triggered to either an incident or a
                                             service request and closed by
                                             Service Desk directly with a
                                             solution provided.
                                             If the interaction requires an
                                             incident, service request,
                                             problem, or change, the
                                             interaction is sent to different
                                             fulfillment processes.


1.9.26.1.5. Key performance indicators for
Service Desk Interaction Management

The Key Performance Indicators (KPIs) in the following table are useful for evaluating
your indicators for Service Desk Interaction Management processes. To visualize
trend information, it is useful to graph KPI data periodically. In addition to the data
provided by Service Manager, you may need additional tools to report on all of your
KPI requirements.

Title           Key Performance Indicators for Service Desk Interaction Management

                                              Description

First time fix                          Percentage of interactions closed by
                                        the Service Desk agent at first contact
                                        without reference to other levels of
                                        support

First line fix                          Percentage of records closed by the
                                        service desk without reference to other
                                        levels of support

Customer satisfaction                   Customer satisfaction measured by
                                        surveys completed by customers

For completeness, the ITIL 2011 and COBIT 4.1 KPIs are included below.

ITIL 2011 Key Performance Indicators

The following are ITIL 2011 KPIs for User Interaction Management:

     Percentage of incidents closed by the service desk without reference to other
     levels of support (that is, closed by first point of contact).
     Number and percentage of incidents processed by each Service Desk agent.

COBIT 4.1 Key Performance Indicators

The following are the COBIT 4.1 KPIs for User Interaction Management:

     Amount of user satisfaction with first-line support (service desk or
     knowledgebase)


     Percent of first-line resolutions based on total number of requests
     Call-abandonment rate
     Average speed to respond to telephone and email or Web requests
     Percent of incidents and service requests reported and logged using automated
     tools
     Number of days of training per service desk staff member per year
     Number of calls handled per service desk staff member per hour
     Number of unresolved queries

Contents

     1 ITIL 2011 Key Performance Indicators
     2 COBIT 4.1 Key Performance Indicators


1.9.26.1.6. RACI matrix for Service Desk
Interaction Management

A Responsible, Accountable, Consulted, and Informed (RACI) diagram or RACI matrix
is used to describe the roles and responsibilities of various teams or people in
delivering a project or operating a process. It is especially useful for clarifying roles
and responsibilities in cross-functional/departmental projects and processes. The
RACI matrix for Service Desk Interaction Management is shown in the following table.

            RACI matrix for Service Desk Interaction Management

Process ID  Activity                    User  Service Desk       Service Desk
                                              Agent              Manager

SO 0.1      Self-Service R                    I                  A

            by User

SO 0.2      Interaction R                     R/I                A/R
            Handling

SO 0.3      Interaction R                     R                  A

            Escalation

SO 0.4      Close                       R/I   R                  A

            Interaction

SO 0.5      Cancel                      R/I   R                  A

            Interaction
````
