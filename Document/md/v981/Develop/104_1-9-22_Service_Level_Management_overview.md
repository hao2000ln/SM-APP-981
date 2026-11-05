---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.9.22 .. 1.9.22
printed_pages: 2796-2812
---

# 1.9.22 Service Level Management overview

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.9.22. Service Level Management
overview

You can use Service Level Management (SLM) to improve the quality of services that
you provide to customers. You can also use Service Level Management to quantify
the financial benefits in reduced incidents, outages, and time invested in system
failures and downtime. Service Level Management collects performance information
automatically to track service guarantees. Service Level Management enables you to
achieve the following results:

     Ensure compliance with service and process targets set in the Service Level
     Agreement
     Report performance information to track the effectiveness and efficiency of
     managed services
     Detect and track failures of service guarantees
     Quantify costs associated with planned and unplanned service outages

Service Level Management uses the Service Level Targets (SLTs) to measure
operational activities in other Service Manager applications.

This section describes how Service Level Management implements the best practice
guidelines for the Service Level Management processes.

Topics in this section include:

Service Level Management within the ITIL Framework

Service Level Management Application

Input and output for Service Level Management

Key performance indicators for Service Level Management

Service Level Management Roles

RACI matrix for Service Level Management


1.9.22.1. Service Level Management
within the ITIL Framework

The Service Level Management process is described in ITIL’s Service Design
publication.

The document describes Service Level Management as a vital process for every IT
Service to document Service Level Targets and responsibilities within Service
Agreements. The purpose of the SLM process is to ensure that all IT Services are
delivered to agreed and achievable targets.

By using Service Level Management in Service Manager each IT Service Provider has
a consistent interface to the business for all service level related data. The business
gets up to date information about performance against the agreed service level
targets. The operational teams are aligned to the agreed service targets, which will
help to reduce breached targets. For breached targets, SLM provides the underlying
data to facilitate the analysis of the cause of breaches. SLM provides the required
tools to facilitate the prevention of breaches from re-occurrence. Furthermore, SLM
provides reliable documentation features to efficiently communicate with the business
.


1.9.22.2. Service Level Management
Application

The impetus for a robust Service Level Management system is delivering value to the
business by improving the quality of service , reduced number of incidents, and
increased customer satisfaction. Over time, you can quantify the financial benefits in
reduced incidents, outages, and time invested in system failures and downtime. The
time and money recovered can be invested in improved customer relationships, more
sophisticated monitoring, better training, and improved business efficiency.

Service management best practices describe the goals for Service Level
Management (SLM) as follows:

The goal for SLM is to maintain and improve IT Service quality, through a constant
cycle of agreeing, monitoring and reporting upon IT Service achievements and
instigation of actions to eradicate poor service–in line with business or cost
justification. Through these methods, a better relationship between IT and its
customers can be developed.

Service Manager supports these goals by providing a service management best
practices compliant application framework with a built-in workflow. The primary
Service Level Management goals are the following:

     Tracking of Service Targets for Service and CIs, which includes planned and
     unplanned outages
     Proactive tracking of Process Targets, which tracks the amount of time it takes
     for the incident, service desk interaction, or change request to advance to the
     next state (For example, the amount of time required for an incident record
     status to change from Open to Work in Progress.)

Configuring Service Level Targets within SLA, OLAs or UCs, are the supporting
elements which help Service Level Management to accomplish these goals.


1.9.22.3. Input and output for Service
Level Management

A number of sources are relevant for the Service Level Management process.


Input                                      Output

Business information: from the             Service reports: providing details of the
organization’s business strategy, plans,   service levels achieved in relation to
and financial plans and information on     the targets contained within SLAs.
their current and future requirements      These reports should contain details of
                                           all aspects of the service and its
                                           delivery, including current and
                                           historical performance, breaches and
                                           weaknesses, major events, changes
                                           planned, current and predicted
                                           workloads, customer feedback, and
                                           improvement plans and activities

Business Impact Analysis: providing        Service Improvement Plan (SIP): an
information on the impact, priority, risk  overall program or plan of prioritized
and number of users associated with        improvement actions, encompassing all
each service                               services and all processes, together
                                           with associated impacts and risks

Business requirements: details of any      The Service Quality Plan (SQP):
agreed, new or changed business            documenting and planning the overall
requirements                               improvement of service quality

The strategies, policies and constraints   Service Level Agreements (SLAs): a set
from Service Strategy                      of targets and responsibilities should
                                           be documented and agreed within an
                                           SLA for each operational service

The Service Portfolio and Service          Service Level Requirements (SLRs): a
Catalog                                    set of targets and responsibilities
                                           should be documented and agreed
                                           within an SLR for each proposed new
                                           or changed service.

Change information: from the Change        Operational Level Agreements (OLAs):
Management process with a forward          a set of targets and responsibilities
schedule of changes and a need to          should be documented and agreed
assess all changes for their impact on     within an OLA for each internal support
all services                               team


Input                                    Output

CMS: containing information on the       Reports on OLAs and underpinning
relationships between the business       contracts
services, the supporting services and
the technology

Customer and user feedback,              Service review meeting minutes and
complaints and compliments               actions: all meetings should be
                                         scheduled on a regular basis, with
                                         planned agendas and their discussions
                                         and actions recorded and progressed

Information and input from any of the    SLA review and service scope review
other processes (for example, Incident   meeting minutes: summarizing agreed
Management, Capacity Management,         actions and revisions to SLAs and
and Availability Management), together   service scope
with the existing SLAs, SLRs, and OLAs
and past service reports on the quality  Revised contracts: changes to SLAs or
of service delivered.                    new SLRs may require existing
                                         underpinning contracts to be changed,
                                         or new contracts to be negotiated and
                                         agreed.


1.9.22.4. Key performance indicators for
Service Level Management

The Key Performance Indicators (KPIs) in the following table are useful for evaluating
your indicators for Service Level Management. To visualize trend information, it is
useful to graph KPI data periodically. In addition to the data provided by Service
Manager, you may need additional tools to report on all of your KPI requirements.

Title                                   Description
% of SLAs / OLAs / UCs that meet
expectations                            This KPI gives the user the ability to
                                        review the SLAs, OLAs and UCs, which
% of breached SLAs / OLAs / UCs         met their target.

                                        This KPI gives the user the ability to
                                        review the SLAs, OLAs and UCs, which
                                        did not met their target.

ITIL recommended KPIs

     Percentage reduction in SLA targets missed
     Percentage reduction in SLA targets threatened
     Percentage increase in customer perception and Satisfaction of SLA
     achievements, via service reviews and Customer Satisfaction Survey responses
     Percentage reduction in SLA breaches caused because of third-party support
     contracts (underpinning contracts)
     Percentage reduction in SLA breaches caused because of internal Operational
     Level Agreements (OLAs).

Deliver service as previously agreed at affordable costs:

     Total number and percentage increase in fully documented SLAs in place
     Percentage increase in SLAs agreed against operational services being run
     Percentage reduction in the costs associated with service provision
     Percentage reduction in the cost of monitoring and reporting of SLAs
     Percentage increase in the speed of developing and agreeing appropriate SLAs
     Frequency of service review meetings.


Manage business interface:

     Increased percentage of services covered by SLAs
     Documented and agreed SLM processes and procedures are in place
     Reduction in the time taken to respond to and implement SLA requests
     Increased percentage of SLA reviews completed on time
     Reduction in the percentage of outstanding SLAs for annual renegotiation
     Reduction in the percentage of SLAs requiring corrective changes (for example,
     targets not attainable; changes in usage levels). Care needs to be taken when
     using this KPI
     Percentage increase in the coverage of OLAs and third-party contracts in place,
     whilst possibly reducing the actual number of agreements (consolidation and
     centralization)
     Documentary evidence that'ssues raised at service and SLA reviews are being
     followed up and resolved
     Reduction in the number and severity of SLA breaches
     Effective review and follow-up of all SLA, OLA and underpinning contract
     breaches.

Contents

     1 ITIL recommended KPIs


1.9.22.5. Service Level Management
Roles

Role                                                                                            Service Manager 9.81

Service Level Management Process        Responsibilities
Owner
                                             Accountable for the definition,
                                             management, governance and
                                             improvement of the Service Level
                                             Management Process
                                             Ensures that the Service Level
                                             Management process and
                                             working practices are effective
                                             and efficient
                                             Ensures that all stakeholders are
                                             sufficiently involved in the Service
                                             Level Management process
                                             Ensures that (business)
                                             management is sufficiently
                                             informed as to the volume, impact
                                             and cost of SLAs, OLAs and UCs
                                             Ensures tight linkage between the
                                             Service Level Management
                                             process and other related
                                             processes

Role                                                                                            Service Manager 9.81
Service Level Manager
                                        Responsibilities

                                             Ensures that the customer’s
                                             current and future Service
                                             requirements are identified,
                                             understood and documented in
                                             SLAs and SLRs
                                             Drafts and ensures sign off of the
                                             SDD
                                             Negotiates and agrees on the
                                             levels of Service to be delivered
                                             with the customer (either internal
                                             or external); formally
                                             documenting these levels of
                                             Service in SLAs
                                             Negotiates and agrees to OLAs
                                             and, in some cases, other SLAs
                                             and agreements that underpin the
                                             SLAs
                                             Ensures that targets agreed to
                                             within Underpinning Contracts are
                                             aligned with SLA and SLR targets
                                             Ensures that Service Performance
                                             Reviews are regularly performed,
                                             and any required actions are
                                             performed
                                             Ensures that improvement
                                             initiatives identified in Service
                                             Reviews are acted on and
                                             progress reports are provided to
                                             customers

Role                                                                                            Service Manager 9.81
Service Owner
                                        Responsibilities
Supplier Manager
                                             Provides the correct relationship
                                             information for the Services and
                                             CIs in the Service Catalog
                                             Reports any discrepancies in the
                                             Service Catalog details and the
                                             actual environment into the
                                             Service Catalog maintenance
                                             process
                                             Provides input for Service Catalog
                                             maintenance process
                                             improvement

                                             Produces requests for proposal in
                                             cooperation with all the
                                             stakeholders (Service Level
                                             Manager, Business Manager, etc)
                                             Selects suppliers based on the
                                             evaluation of proposal they supply
                                             and feedback from stakeholders
                                             Drafts and negotiates SLAs,
                                             Contracts, Agreements or any
                                             other documents for Third-Party
                                             Suppliers
                                             Ensures the targets agreed within
                                             contracts are aligned with SLR
                                             targets
                                             Ensures that SLA breaches of
                                             each supplier are highlighted,
                                             investigated and action(s) taken
                                             to prevent their recurrence

Role                                                                                            Service Manager 9.81
Service Level Analyst
                                        Responsibilities
Support Groups
Customer                                     Ensures that Service reports are
User                                         produced for each customer
                                             Service
                                             Performs gap analysis to highlight
                                             breaches of SLA targets,
                                             investigating reasons and
                                             recommending actions to prevent
                                             their recurrence
                                             Plans and schedules the Service
                                             Performance Review meetings
                                             and document the results and
                                             actions

                                        Implement improvement initiatives
                                        identified in Service Reviews

                                        Responsible for the purchase of goods
                                        or Services

                                        Consumes goods or services


1.9.22.6. RACI matrix for Service Level
Management

A Responsible, Accountable, Consulted, and Informed (RACI) diagram or RACI matrix
is used to describe the roles and responsibilities of various teams or people in
delivering a project or operating a process. The RACI matrix for Service Level
Management is shown in the table below.


Proces  Activit  Servic                 Suppli  Servic  Custo  Servic   Resolv
s ID    y        e Level                er      e       mer    e Level  er
                 Manag                  Manag   Owner          Analys   Group
                 er                     er                     t        s

SD 2.1  Maintai A/R                             C       C
        n the
        Servic
        e
        Catalo
        g

SD 2.2 Create A/R                       R       R       C

        or

        Amend

        IT

        Servic

        es

SD 2.3 Draft A/R                        R       R

        Suppor

        ting

        Agree

        ments

SD 2.4 Finalis A/R                      R       R       C/I

        e SLAs

        / OLAs

        / UCs

SD 2.5 Monito A/R                       I       I       C

        r

        Servic

        e

        Levels

SD 2.6 Servic A/R                                              R
           e Level
           Reporti
           ng


Proces  Activit  Servic                 Suppli  Servic  Custo  Servic   Resolv
s ID    y        e Level                er      e       mer    e Level  er
                 Manag                  Manag   Owner          Analys   Group
                 er                     er                     t        s

SD 2.7 Perfor A/R                                       C      R

        m

        Servic

        e

        Review

        s

SD 2.8 Servic A/R                               R       C               R
           e
           Improv
           ement
           Progra
           mme

SD 2.9 Review A/R                                              R
           /
           Revise
           SLA /
           OLA /
           UC
````
