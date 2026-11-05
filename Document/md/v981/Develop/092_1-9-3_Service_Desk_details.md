---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.9.3 .. 1.9.4
printed_pages: 2419-2450
---

# 1.9.3 Service Desk details

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.9.3. Service Desk details

Service Manager uses its Service Desk application to enable the Service Desk Interaction Management process. The main
function of Service Manager is to monitor, track, and record calls and open incidents, as necessary.
In User Interaction Management, a Service Desk Agent receives a call and opens a new interaction. The Service Desk Agent fills
in the required fields, and then chooses to close the interaction or escalate it to an incident.
This section describes selected User Interaction Management fields in the out-of-box Service Manager system. Topics in this
section include:

     New interaction form
     Interaction form after escalation
     Service Desk Interaction Management form details
     Interaction categories


1.9.3.1. New interaction form

When a Service Desk Agent clicks Create a New Interaction, Service Desk displays the new interaction form. The required fields
in this form must be populated to register the new interaction. Service Desk fills in some of the fields automatically. The Service
Desk Agent must fill in the others.
A new interaction that has been filled in is illustrated in the following screenshot:


1.9.3.2. Interaction form after escalation

After the Service Desk Agent escalates the interaction, Service Desk displays new sections and fields.
The following screenshots illustrate the same interaction after escalation.


1.9.3.3. Service Desk Interaction Management form details

The following table identifies and describes some of the features on Service Desk’s Interaction Management forms.

Label                                                                                                                            Service Manager 9.81
Interaction ID
                                        Service Desk Interaction Management form details
Status
                                                              Description

                                                              Service Manager populates this field with a unique ID when a
                                                              Service Desk Agent registers a new interaction.

                                                              The options in this field have been revised to align with our
                                                              new best practices.

                                                                              Tip

                                                                         You may want to tailor these options to match
                                                                         your business needs.

                                                              These statuses are available out-of-box:

                                                                    Open — The interaction has been initially logged. For
                                                                    example, when the Service Desk Agent is still on the
                                                                    phone with the customer.
                                                                    Categorize — The interaction has been logged and
                                                                    saved by Service Desk Agent, or a request has been
                                                                    created by a self-service user. The categorization
                                                                    details will be provided with this status.
                                                                    Assign — The status is manually set by Service Desk
                                                                    Agent, or a service catalog request will stay in this
                                                                    status when it is created by self-service user or Service
                                                                    Desk Agent. The assignment will be made with this
                                                                    status.
                                                                    Suspended — The interaction can be suspended for a
                                                                    predefined duration at categorization or fulfillment. It
                                                                    will be worked upon only after it is unsuspended either
                                                                    manually or automatically.
                                                                    In Progress — The interaction has no incidents,
                                                                    changes, or other records related to it. It is fulfilled by
                                                                    Service Desk.
                                                                    Dispatched — The interaction has been escalated or
                                                                    the catalog request approved and the interaction is now
                                                                    related to another record, such as an incident, change,
                                                                    or request.
                                                                    Resolved — The interaction has been resolved with
                                                                    solution filled.
                                                                    Callback — There is an action pending for the
                                                                    interaction. The Service Desk Agent must now call the
                                                                    contact. If the Notify By field for that user is set to
                                                                    Telephone, the interaction is automatically set to
                                                                    Callback when the related record is closed.
                                                                    Closed — The interaction was closed by the help desk
                                                                    or automatically after the related record was closed.
                                                                    Withdrawal Requested — The user contacts the Service
                                                                    Desk Agent and ask for the interaction to be withdrawn
                                                                    on their behalf by providing appropriate information.

 Label                                                                                            Service Manager 9.81
 Phase
                                        Description
 Contact
 Service Recipient                           Logging - The interaction has been initially logged. For
                                             example, when the Service Desk Agent is still on the
 Location                                    phone with the customer.
                                             Categorization – The interaction is categorized and
This PDF was generated on May 23, 2026       prioritized in this phase. Assignment is also made in
                                             this phase.
                                             Work In Progress – The interaction is under
                                             investigation, either by Service Desk or by other
                                             process, such as incident, change, or request.
                                             Review – The proposed solution of the interaction is
                                             reviewed in this phase.
                                             Closure – The interaction was closed by the help desk
                                             or automatically after the related record was closed.
                                             Withdrawal – The interaction is in this phase where the
                                             user contacts the Service Desk Agent and ask for the
                                             interaction to be withdrawn on their behalf by providing
                                             appropriate information.

                                        The Service Desk Agent populates this field with the person
                                        from which the call was received. The contact person is not
                                        necessarily the same person as the service recipient. This
                                        field ensures that the correct person will be notified about
                                        updates to the interaction.
                                        After filling in the contact name, the Service Desk Agent can
                                        use the Smart Indicator positioned at the end of the field to
                                        view open or closed interactions for this contact. This field
                                        includes a hover-over form that displays full name,
                                        telephone, and email address if available for the contact.
                                        This is a required field.

                                        The person who has the problem and needs it resolved. It's
                                        not necessarily the person who is calling to report the
                                        problem. Filling in this field automatically fills in the contact
                                        name from the contact record of who should be notified of
                                        the resolution.
                                        The Service Desk Agent populates this field with the person
                                        this issue is registered for. This field includes a hover-over
                                        form that displays full name, telephone, and email address if
                                        available for the service recipient.
                                        After filling in the service recipient, the Service Desk Agent
                                        can use the Smart Indicator positioned at the end of the field
                                        to view open or closed interactions for the service recipient.
                                        This is a required field.

                                        The location for which the interaction has been reported.
                                        The field is for informational purposes only.
                                        Location data is customer and implementation specific.

                                                                                                                           Page 29 of 222
Label                                                                                             Service Manager 9.81
Source
                                        Description
Notify By
                                        The source from which the record is created.

                                        The following out-of-box sources are available:

                                             1 - User
                                             2 - Group
                                             3 - Event
                                             4 - Chat
                                             5 - Email
                                             6 - Telephone

                                        To notify the customer when the issue has been resolved,
                                        Service Manager prepopulates this field with Email for user.
                                        User or the Service Desk Agent can change it to None or
                                        Telephone, if applicable.

                                        When the related incident or change is closed:

                                             Selecting Email sends email to the contact and closes
                                             the interaction
                                             Selecting None closes the interaction without notifying
                                             the contact
                                             Selecting Telephone sets the interaction to the status
                                             Callback, which tells the Service Desk Agent to call the
                                             contact. The Service Desk Agent asks the contact
                                             whether the solution is satisfactory and indicates the
                                             answer on the Required Actions tab. If the solution
                                             works for the customer, you close the interaction. If it
                                             doesn't work, then you must open a new incident.

                                        This is a required field.

Label                                                                                             Service Manager 9.81
Affected Service
                                        Description

                                        The Service Desk Agent populates this field with the
                                        business service affected by the registered issue. Only
                                        business services the service recipient has a subscription for
                                        can be selected. As a best practice, users should select the
                                        affected service before selecting the Affected CI because
                                        the Affected CI selection is limited by the service selected by
                                        a user. Selecting the service first prevents a mismatch
                                        between the service and the CI. ITIL 2011 is centered around
                                        services, so a service construct should always be defined
                                        for best practices. If you have not yet created a service
                                        construct, start with a catch-all service, such as My Devices.

                                                    Note

                                                   The out-of-box options in this field are based on
                                                   past Service Manager implementations. You
                                                   should tailor these options to match your
                                                   business needs.

                                        These business services are available out-of-box:

                                             Applications
                                             E-mail/Webmail
                                             Handheld PDA & Telephony
                                             Intranet
                                             Internet
                                             My Devices (The My Devices service represents all
                                             personal devices that the user would use.)
                                             Printing

                                        Selecting the service:

                                             May limit the list of affected CIs.
                                             Validates that it is a valid service.

                                        An end user is more likely to know that the e-mail service
                                        doesn't work than what part of the e-mail service doesn't
                                        work.

                                        This is a required field.

                                                    Tip

                                                   You can use the Smart Indicator, positioned at
                                                   the end of the field, to search for related
                                                   incidents or problems.

 Label                                                                                            Service Manager 9.81
 Affected CI
                                        Description
 Title
 Tags                                   The Service Desk Agent populates this field with the
 Description                            configuration item (CI). Click Fill to select from a list of the
                                        physical CIs that relate to the service. Other CIs can be
This PDF was generated on May 23, 2026  entered manually.
                                        If the business service doesn't contain any CIs, then the list
                                        shows only the CIs that the service recipient is subscribed to
                                        and the CIs that are assigned to the service recipient. If you
                                        choose an Applications service, you are presented with a list
                                        of CIs in the service, as well as those that you own. This field
                                        includes a hover-over form that displays Critical CI and
                                        Pending Change checkboxes to indicate whether or not
                                        these attributes apply to the CI.
                                        After filling in the affected CI, the Service Desk Agent can
                                        use the Smart Indicator positioned at the end of the field to
                                        search for open and closed incidents for this CI, and to view
                                        the details.

                                        The Service Desk Agent populates this field with a brief
                                        description that identifies the interaction.

                                                    Note

                                                   Service Manager searches this field when you
                                                   do an advanced or expert text search.

                                        This is a required field.

                                        Enter one or more free-form tags (keywords or terms) of this
                                        interaction. The tags you enter are searchable and can be
                                        used as keywords to highlight important information.
                                        For more information, see Working with tags.

                                        The Service Desk Agent populates this field with a detailed
                                        description of the interaction. When the location and
                                        telephone number differ from the contact details, the Service
                                        Desk Agent can record the correct information in the
                                        description field.
                                        Clicking Search Knowledge searches description fields
                                        across multiple Service Manager knowledgebases for the
                                        text entered. Depending on the permissions of the user,
                                        Service Manager may look in interactions, incidents,
                                        problems, known errors, and knowledge documents. The
                                        Service Desk Agent can use the solution from any returned
                                        document as the solution for the interaction.

                                                    Note

                                                   Service Managersearches this field when you do
                                                   an advanced or expert text search.

                                        This is a required field.

                                                                                                                           Page 32 of 222
Label                                                                                             Service Manager 9.81
Completion Code
                                        Description
Knowledge Source
Solution                                This field contains a predefined completion code, describing
                                        the way this issue has been solved. The out-of-box options
                                        in this field are based on Service Manager customer
                                        reference data.

                                                    Note

                                                   You may want to tailor these options to match
                                                   your business needs.

                                        These completion codes are available out-of-box:

                                             Automatically Closed
                                             Cancelled
                                             Fulfilled
                                             Invalid
                                             Not Reproducible
                                             Out of Scope
                                             Request Rejected
                                             Solved by Change/Service Request
                                             Solved by User Instruction
                                             Solved by Workaround
                                             Unable to solve
                                             Withdrawn by User

                                        This field contains the reference number of the document
                                        from the knowledge base document used to solve the issue.

                                        If you find a knowledge article by using Search Knowledge,
                                        and then click Use Solution in that article to provide the
                                        solution to your customer, this field is populated with the
                                        Document ID of the document you used.
                                        If you don't use a knowledge document or if you don't click
                                        Use Solution in the knowledge document, this field is left
                                        blank.

                                        This field contains a description of the solution used for this
                                        interaction.

                                                    Note

                                                   Service Managersearches this field when you do
                                                   an advanced or expert text search.

Label                                                                                             Service Manager 9.81
Category
                                        Description
Subcategory
Area                                    This field describes the type of interaction. The interaction
                                        type determines the process to escalate to when the
                                        interaction can't be solved on first intake.

                                        The categories are based on ITIL service-centric processes,
                                        and therefore focus on enabling assignment, reporting, and
                                        operational analysis for knowledge management purposes.

                                        From the category list:

                                             Complaint/Incident/Request for Information/Request for
                                             Administration > Escalate — You can relate the
                                             interaction to an existing incident, an existing known
                                             error, an existing problem, or create a new incident.
                                             Request for Change > Escalate — Service Manager
                                             creates a new change request.
                                             More or More Actions icon > Order From Catalog —
                                             Service Catalog opens, allowing you to place an order.
                                             The interaction is given the category service catalog.
                                             Service Catalog interactions aren't escalated. When
                                             you approve the interaction, it opens the related record
                                             as defined in the service catalog connector.

                                        For more information on categories and the subcategories
                                        and areas associated with them, see Interaction categories.

                                        This is a required field.

                                        The Service Desk Agent populates this field with the
                                        subcategory of concern.

                                        Service Manager displays different lists of subcategories,
                                        depending on the category you selected. For more
                                        information on categories and the subcategories and areas
                                        associated with them, see Interaction categories.

                                        This is a required field.

                                        The third level of classifying an interaction, mainly used for
                                        reporting purposes.

                                        Service Manager displays different lists of areas, depending
                                        on the subcategory you selected. For more information on
                                        categories and the subcategories and areas associated with
                                        them, see Interaction categories.

                                        This is a required field.

Label                                                                                             Service Manager 9.81
Assignment Group
                                        Description
Assignee
Impact                                  The group assigned to work on the interaction. For a
                                        description of this field see the Assignment Group field
                                        description in the Incident Management form details section
                                        as this field functions similarly. The out-of-box data consists
                                        of default assignment groups for use as examples of types
                                        of assignment groups.

                                        You may want to change the sample assignment groups to
                                        meet your own needs.

                                        These assignment groups are available out-of-box:

                                             Application
                                             Email / Webmail
                                             Field Support
                                             Hardware
                                             Incident Managers
                                             Intranet / Internet Support
                                             Network
                                             Office Supplies
                                             Office Support
                                             Operating System Support
                                             Problem Coordinators
                                             Problem Managers
                                             SAP Support
                                             Service Desk
                                             Service Desk Analysts
                                             Service Manager

                                        The name of the person assigned to work on this interaction.
                                        This person is a member of the assigned support group.
                                        Assignees may belong to one or multiple assignment groups,
                                        based on the needs of your company.

                                        The Service Desk Agent populates this field with the impact
                                        the interaction has on the business. The impact and the
                                        urgency are used to calculate the priority. The impact is
                                        based on how much of the business is affected by the issue.

                                        The stored value can be 1-4, as follows.

                                             1 - Enterprise
                                             2 - Site/Dept
                                             3 - Multiple Users
                                             4 - User

                                        This is a required field.

 Label                                                                                            Service Manager 9.81
 Urgency
 Priority                               Description

 Approval Status                        The urgency indicates how pressing the issue is for the
                                        service recipient. The urgency and the impact are used to
 Activities                             calculate the priority.
 Related Records                        The stored value can be 1-4, as follows.

This PDF was generated on May 23, 2026       1 - Critical
                                             2 - High
                                             3 - Average
                                             4 - Low
                                        This is a required field.

                                        This field describes the order in which to address this
                                        interaction in comparison to others. It contains a priority
                                        value calculated by (impact + urgency)/2. Decimals are
                                        truncated.
                                        The stored value based on that calculation can be 1-4, as
                                        follows:

                                             1 - Critical
                                             2 - High
                                             3 - Average
                                             4 - Low

                                        This field is only used when you request something from the
                                        catalog.
                                        When you submit an order from the catalog,
                                        Service Manager automatically creates an interaction which,
                                        based on approval requirements, may have to be approved
                                        before it can be fulfilled. Service Manager populates this
                                        field with the current approval status for this interaction.
                                        These approval statuses are available out-of-box:

                                             pending — The request has not been approved or a
                                             prior approval or denial has been retracted.
                                             approved — All approval requirements are approved, or
                                             no approval necessary.
                                             denied — The request has been denied.

                                        The Activities section records information that the Service
                                        Desk Agent enters during the lifecycle of the Interaction.
                                        Every time you update an interaction, you can fill in an
                                        update on the Activities section (New Update). A log of all
                                        the updates is stored on the Journal Updates and activities
                                        list. Activities from related records that are flagged as
                                        customer visible also display here.

                                        The Related Records section contains a list of all related
                                        records for the interaction. These may include related
                                        incidents, known errors, problems, changes, and quotes.

                                                                                                                           Page 36 of 222
 Label                                                                                            Service Manager 9.81
 SLT
                                        Description
 SLT View
 Escalate button                        The SLT (Service Level Target) section displays SLAs related
                                        to the interaction.
This PDF was generated on May 23, 2026  SLAs in interactions are customer-related and selected,
                                        based on the customer contact or department and service
                                        related to the issue. The Service Level Objective (SLO)
                                        defines the details, such as beginning and ending state, and
                                        time allowed between these states. SLA selection takes
                                        place when a Service Desk Agent escalates the interaction.
                                        The best practice is that the Service Desk Agent should
                                        communicate the time of the next breach to the customer at
                                        this point. If SLAs are configured to be handled in the
                                        background, the information in this section may not display
                                        immediately.

                                                    Note

                                                   The out-of-box system is set up to run SLAs in
                                                   the foreground. Tailoring the system to run SLAs
                                                   in the background complicates communicating
                                                   with the customer and should be avoided.

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

                                        The Service Desk Agent clicks this button to create an
                                        incident or change from this interaction. The customer's
                                        issue could not be solved immediately.
                                        When research time is required, the Interaction should be
                                        escalated to an incident or a change, not saved as an
                                        interaction. There is no monitoring on saved interactions,
                                        other than self-service interactions.
                                        If the Service Desk has a role in the Incident Management
                                        process, this incident may be assigned to the Service Desk,
                                        and the Service Desk Agent can still work on it.
                                        Clicking Escalate starts the Escalate Interaction solution
                                        matching.
                                        For more information on the Escalate Interaction solution
                                        matching, see Escalate Interaction solution matching.

                                                                                                                           Page 37 of 222
Label                                                                                             Service Manager 9.81
Image to Text button
                                        Description
Withdraw button
Close Interaction button                The Service Desk Agent clicks this button to extract texts
Close Invalid Request button            from attached images and then put the text into the
                                        description field on the interaction records.

                                                    Note

                                                   The condition for the action in the Service Desk
                                                   workflow is
                                                   (Expression: lioption("Smart Analytics") and
                                                   $lo.idol.img.enabled and not ($G.ess) and
                                                   jscall("IDOL_Utilities.getAttachmentLength",
                                                   $L.file)>0) .

                                        The Service Desk Agent clicks this button to withdraw the
                                        interaction on behalf of the user.

                                        The Service Desk Agent clicks this button to close the
                                        interaction. The customer's issue was resolved and requires
                                        no further action.

                                        If the interaction is invalid, click this button to close it as an
                                        invalid interaction in the Categorization phase.


1.9.3.4. Interaction categories

The category hierarchy was designed to support the ITIL 2011 model of service-centric support. It is a natural-language-based
hierarchy meant to enable the Service Desk Agent to easily classify the Interaction. The three-level hierarchy (category,
subcategory, and area) creates a “sentence” that clearly and uniquely defines the issue without ambiguity.
The category determines which process the record belongs to. Combined with the subcategory and area, it also is used for to
report results and to determine the knowledgebase assignment for the event.

            Note

           Since the category values represent best practices, customizing this data is not expected. The subcategory and area
           fields can be customized; however, they should cover the scope of the IT Service provisioning in natural language
           definition and should remain unmodified. If you choose to customize the subcategories and areas, be sure to set
           them up in a natural easy-to-follow hierarchy.

The categories, subcategories, and areas that come with Service Desk out-of-box are captured in this table.

Category                                        Categories, subcategories, and areas                           Service Manager 9.81
complaint
complaint                               Subcategory                                   Area
complaint                               service delivery                              availability
complaint                               service delivery                              functionality
complaint                               service delivery                              performance
complaint                               support                                       incident resolution quality
incident                                support                                       incident resolution time
incident                                support                                       person
incident                                access                                        authorization error
incident                                access                                        login failure
incident                                data                                          data or file corrupted
incident                                data                                          data or file incorrect
incident                                data                                          data or file missing
incident                                data                                          storage limit exceeded
incident                                facilities                                    hardware failure
incident                                facilities                                    miscellaneous
incident                                facilities                                    supplies
incident                                failure                                       error message
incident                                failure                                       function or feature not working
incident                                failure                                       job failed
incident                                failure                                       system down
incident                                hardware                                      hardware failure
incident                                hardware                                      missing or stolen
incident                                performance                                   performance degradation
incident                                performance                                   system or application hangs
incident                                security                                      security breach
request for administration              security                                      security event/message
request for administration              security                                      virus alert
request for administration              grant access                                  grant access
request for change                      other                                         other
request for change                      password reset                                password reset
                                        service portfolio                             new service
                                        service portfolio                             upgrade / new release

Category                                Subcategory                                   Service Manager 9.81
request for information                 general information
request for information                 how to               Area
request for information                 status               general information
service catalog                         service catalog      how to
                                                             status
                                                             service catalog


1.9.3.5. Escalate Interaction solution matching

Depending on your selection, the Escalate Interaction wizard opens one of the following wizards:

     Escalate Interaction - Incident
     Escalate Interaction - RFC
     Escalate Interaction - Request
     Escalate Interaction - Problem

Escalate Interaction - Incident

You can escalate Interactions in the following categories to Incident:

When you escalate an interaction, you can use queries to search for known errors, incidents, or problems matching the title, CI or
service value of the interaction. If you find matching records, you can link the records to the interaction.

     compliant
     incident
     request for information
     request for administration

Escalate Interaction - RFC

You can escalate Interactions in the request for change category to RFC:

Option 1: If change is open on Category in settings, when escalating an interaction to an RFC, a list of change categories is
displayed from which the category for the new change request can be selected.

Option 2: If change is open on Change Model in settings, when escalating an interaction to an RFC, a list of Change Models is
displayed from which the Change Model for the new change request can be selected.

Escalate Interaction - Request

You can escalate Interactions in the following categories to Request:

     Request for information
     Request for administration

Escalate Interaction - Problem

You can escalate Interactions in the Problem category to Problem.


1.9.4. Incident Management overview

The Service Manager Incident Management application, referred to as Incident Management throughout this chapter, supports
the Incident Management process. It provides comprehensive Incident Management that allows you to restore normal service
operations as quickly as possible and minimize the adverse impact on business operations.

Incident Management enables you to categorize and track various types of incidents (such as service unavailability or
performance issues and hardware or software failures) and to ensure that incidents are resolved within agreed-on service level
targets.

This section describes how Incident Management implements the best practice guidelines for the Incident Management
processes. Topics in this section include:

     Incident Management within the ITIL framework
     Incident Management application
     Incident Management process overview
     Input and output for Incident Management
     Key performance indicators for Incident Management
     RACI matrix for Incident Management


1.9.4.1. Incident Management within the ITIL framework

Service Operation publication. The document describes Incident Management as the process responsible for restoring normal
service operation as quickly as possible.
The ITIL publication points out that Incident Management is highly visible to the business, and therefore it is often easier to
demonstrate its value in comparison to other areas of Service Operation. These values include:

     the ability to detect and resolve incidents, resulting in lower downtime and higher service availability
     the ability to align IT activity to real-time business priorities
     the ability to identify potential improvements to services, and additional service or training requirements


1.9.4.2. Incident Management application

The Incident Management application automates reporting and tracking of a single incident or a group of incidents associated
with a business enterprise. It enables you to categorize types of incidents, and keep track of their resolution.

With Incident Management, the appropriate people can escalate and reassign incidents. Incident Management can also escalate
an incident to properly meet the agreed-upon terms of the service contract. For example, if a network printer is disabled, a
technician or manager can escalate the incident to a higher priority to ensure that the incident is fixed quickly.

Incident Management restores normal service operation as quickly as possible and minimizes the adverse impact on business
operations, thus ensuring that the best possible levels of service quality and availability are maintained. It includes events that
are communicated directly by Users, either through the Service Desk or through an automated interface between Event
Management and Incident Management tools.
Incident Management defines normal service operation as service performance to meet Service Level Agreement (SLA),
Operation Level Agreement (OLA), and Underpinning Contract (UC) targets.

Incidents can be reported and logged by support staff, who may notify the Service Desk if they notice an issue. Not all events are
logged as incidents. Many classes of events aren't related to disruptions at all, but are indicators of normal operation or are
simply informational.

The new Incident Management best practices make some changes you may want to take into consideration when implementing
your updated system.

Incident Closure process

Service Manager includes the Service Desk application to perform user interaction activities. Service Manager is configured out-
of-box to use a one-step Incident Closure process. Therefore, incident personnel can close the incident directly after resolving it.
The Service Desk takes care of notifying the end user and closing the interaction that initiated the incident.

Legacy Service Manager customers who did not activate Service Desk and used a two-step incident close will find that this is no
longer necessary, because the Service Desk application is now included.

Contents

     1 Incident Closure process


1.9.4.3. Incident Management process overview

The Incident Management process includes all necessary steps to log and resolve an incident, including any necessary
escalations or reassignments. Monitoring of Service Level Agreements (SLAs), Operation Level Agreements (OLAs), and
Underpinning Contracts (UCs) are also part of the overall process.
When an incident is opened, the associated SLA starts tracking the time that elapses. The Incident Coordinator assigns the
incident to an Incident Analyst for investigation and diagnosis. If necessary, the incident can be reassigned to a different
assignment group.
A general overview of the Incident Management processes and workflows is depicted in the figure below. They are described in
detail in Incident Management Workflows.


1.9.4.3.1. Incident Management categories

Service Manager Categories classify and define the type of incident. Each category could have its own workflow process. The
steps of the workflow are represented by the phases and tasks within the phase. Service Manager requires that every incident
has an incident category and phases, but tasks are optional.


1.9.4.3.2. Incident Management phases

Service Manager uses phases to describe the steps needed to resolve an incident. The phase also determines the forms users
see, the actions users can manually trigger.
The following figure shows the workflow phases for an Incident.


1.9.4.3.3. Incident Management tasks

Service Manager supports incident tasks to resolve an incident. Incident can't be closed if there are open Incident tasks
underneath it. Except Incident Logging and Closure, each phase can optionally have one or multiple tasks, or no tasks. Each task
includes a description, and information about urgency, priority, and assignment.
Incident Management tasks include:

     Opening, assigning a task from an incident.
     Searching for a task.
     Managing task categories, status and phases.
     Using the task queue.


1.9.4.3.4. Incident Task phases

This section describes the flow of an incident task as it progresses from the ‘Waiting’ phase to the ‘Closed’ phase in the Generic
Task workflow.
The following figure shows the Incident Task workflow in Process Designer.


1.9.4.3.5. Incident Management user roles

The following table describes the responsibilities of the Incident Management user roles.

                                        Incident Management User Roles and Responsibilities

Role                                    Responsibilities

Operator                                Registers incidents based on an event and assigns them to
                                        the correct support group.

Service Desk Agent                      Register interactions based on contact with user.
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

Incident Analyst                        Reviews assigned incidents.
                                        Investigates and diagnoses incidents.
                                        Create incident tasks to investigate and diagnose
                                        incidents.
                                        Documents incident resolutions or workarounds in the
                                        Service Management application.
                                        Implements incident resolutions.
                                        Verifies that incidents are resolved and closes them.
                                        Create Incident tasks to implement incident resolutions.

Incident Coordinator                    Reviews incidents assigned to the support group.
                                        Handles incidents escalated by an Incident Analyst of
                                        the support group.
                                        Monitors Operational Level Agreements (OLA) and
                                        Underpinning Contracts (UC) targets of the support
                                        group.

Incident Manager                        Handles incidents escalated by the Incident
                                        Coordinator or by the Service Desk Agent.
                                        Determines and executes the appropriate escalation
                                        actions.
                                        Requests an Emergency Change, if required.


1.9.4.4. Input and output for Incident Management

Incidents can be triggered and resolved in several ways. The following table outlines the inputs and outputs for the Incident
Management process.

Input to Incident Management            Input and output for Incident Management

                                                           Output from Incident Management

Customer interactions with the Service Desk, which can       Resolved incidents
be triggered to incidents                                    Documented workarounds, solutions, or knowledge
Event management tool, which automatically opens             articles
incidents                                                    New problems, changes, or incidents
Support staff
                                                        Incidents can also trigger several other Service Manager
                                                        processes, as described in the next section.


1.9.4.5. Key performance indicators for Incident Management

The Key Performance Indicators (KPIs) in the following table are useful for evaluating your Incident Management processes. To
visualize trend information, it is useful to graph KPI data periodically. In addition to the data provided by Service Manager, you
may need additional tools to report on all of your KPI requirements.

Title                                   Key Performance Indicators for Incident Management

                                                               Description

% of incidents closed within SLA target time  The number of incidents closed within the SLA target time,
                                              relative to the number of all incidents closed, in a given time
                                              period.

Backlog of incidents                          The number of incidents that aren't yet closed, in a given
                                              time period.

Total number of incidents                     Total number of new reported incidents, in a given time
                                              period.

For completeness, the ITIL 2011 and COBIT 4.1 KPIs are included below.

ITIL 2011 Key Performance Indicators

The following are ITIL 2011 KPIs for Incident Management:

     Total number of incidents (as a control measure)
     Breakdown of incidents at each stage (for example, logged, work in progress, and closed)
     Size of current incident backlog
     Number and percentage of major incidents
     Mean elapsed time to achieve incident resolution or circumvention, separated by impact code
     Percentage of incidents handled within target response time; incident response-time targets may be specified in SLAs, for
     example, by impact and urgency codes
     Average cost per incident
     Number of incidents reopened and as a percentage of the total
     Number and percentage of incidents incorrectly assigned
     Number and percentage of incidents incorrectly categorized
     Number and percentage of incidents resolved remotely, without the need for a visit
     Number of incidents handled by each incident model
     Breakdown of incidents by time of day, which helps pinpoint peaks and ensure matching of resources

COBIT 4.1 Key Performance Indicators

The following are the COBIT 4.1 KPIs for Incident Management:

     Percent of incidents resolved within the time period specified
     Percent of incidents reopened
     Average duration of incidents by severity
     Percent of incidents that require local support (that is, field support or a personal visit)

Contents

     1 ITIL 2011 Key Performance Indicators
     2 COBIT 4.1 Key Performance Indicators


1.9.4.6. RACI matrix for Incident Management

A Responsible, Accountable, Consulted, and Informed (RACI) diagram or RACI matrix is used to describe the roles and
responsibilities of various teams or people in delivering a project or operating a process. It is especially useful in clarifying roles
and responsibilities in cross-functional/departmental projects and processes. The RACI matrix for Incident Management is shown
in the following table.

                                             RACI Matrix for Incident Management

Process ID Activity  Incident           Incident Incident Incident                Service  Service User
                     Manager                                                      Desk     Desk
                                        Coordinat Analyst  Operator
                                        or                                        Agent    Manager

SO 2.1  Incident A                      I                  R                      R

        Logging

        and

        Categoriza

        tion

SO 2.2  Incident A                      R    R

        Assignme

        nt

SO 2.3  Incident A                      C/I  R                                                C/I

        Investigati

        on and

        Diagnosis

SO 2.4  Incident A                      C/I  R                                                C/I

        Resolution

        and

        Recovery

SO 2.5  Incident A                      C/I  R             I                      I           I

        Review

        and

        Closure

SO 2.6  Incident R/A                    R    I

        Escalation

SO 2.7  SLA          A/I                I    I                                    R

        Monitoring

SO 2.8  OLA and A/I                     R    I

        UC

        Monitoring

SO 2.9  Complaint A/I                                                                      R  C/I
        Handling
````
