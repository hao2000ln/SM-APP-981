---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.9.26.3 .. 1.9.26.4
printed_pages: 2976-3012
---

# 1.9.26.3 Service Desk Details (Streamlined Interaction)

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.9.26.3. Service Desk Details
(Streamlined Interaction)

Service Manager uses its Service Desk application to enable the Service Desk
Interaction Management process. The main function of Service Desk is to monitor,
track, and record calls and toopen fulfillment records, as necessary.

In User Interaction Management, a Service Desk Agent receives a call and opens a
new interaction. The Service Desk Agent fills in the required fields, and then chooses
to close the interaction or escalate it to a fulfillment process.

This section describes selected User Interaction Management fields in the out-of-box
Service Manager system.

Topics in this section include:

     New interaction form
     Interaction form after escalation
     Service Desk Interaction Management form details
     Interaction categories


1.9.26.3.1. New interaction form

When a Service Desk Agent clicks Create Streamlined Interaction, Service Desk
displays the new interaction form. The required fields in this form must be populated
to register the new interaction. Service Desk fills in some of the fields automatically.
The Service Desk Agent must fill in the others.
A new interaction from that has been completed is illustrated in the following
screenshot:


1.9.26.3.2. Interaction form after
escalation

After the Service Desk Agent escalates the interaction, Service Desk displays new
sections and fields.
The same interaction after escalation is illustrated in the following screenshot:




1.9.26.3.3. Service Desk Interaction
Management form details

The following table identifies and describes some of the features on Service Desk’s
Interaction Management forms.

Label                                                                                                                   Service Manager 9.81
Interaction ID
                Service Desk Interaction Management form details

                                      Description

                                      Service Manager populates this field
                                      with a unique ID when a Service Desk
                                      Agent registers a new interaction.

 Label                                                                                          Service Manager 9.81
 Status
                                        Description
This PDF was generated on May 23, 2026
                                        The options in this field have been
                                        revised to align with our new best
                                        practices.

                                                    Tip

                                                   You may want to tailor
                                                   these options to match
                                                   your business needs.

                                        These statuses are available out-of-
                                        box:

                                             Open — The interaction has been
                                             initially logged. For example,
                                             when the Service Desk Agent is
                                             still on the phone with the
                                             customer.
                                             In Progress — The interaction has
                                             no incidents, changes, or other
                                             records related to it. It is fulfilled
                                             by Service Desk.
                                             Dispatched — The interaction has
                                             been escalated or the catalog
                                             request approved and the
                                             interaction is now related to
                                             another record, such as an
                                             incident, change, problem, or
                                             request.
                                             Pending Customer - The
                                             interaction is pending for User
                                             input to proceed its fulfillment
                                             process.
                                             Pending Approval - The service
                                             catalog request is pending for
                                             approval.
                                             Closed — The interaction is
                                             closed by the help desk or

                                                                                                                        Page 366 of 387
Label                                                                                           Service Manager 9.81
Contact
                                        Description

                                             automatically after the related
                                             record is closed.
                                             Canceled — The interaction is
                                             canceled by Service Desk Agent
                                             based on the user updates.
                                             Resolved — The interaction is
                                             resolved when the linked incident
                                             is move to the "Resolved" status.

                                        The Service Desk Agent populates this
                                        field with the person from whom the
                                        call was received. The contact person
                                        is not necessarily the same person as
                                        the service recipient. This field ensures
                                        that the correct person will be notified
                                        about updates to the interaction.

                                        This field includes a hover-over form
                                        that displays full name, telephone, and
                                        email address for the contact, if
                                        available.

                                        This is a required field.

Label                                                                                           Service Manager 9.81
Service Recipient
                                        Description

                                        The person who has the problem and
                                        needs it resolved. It's not necessarily
                                        the person who is calling to report the
                                        problem. Filling in this field
                                        automatically fills in the contact name
                                        from the contact record of who should
                                        be notified of the resolution.

                                        The Service Desk Agent populates this
                                        field with the person this issue is
                                        registered for. This field includes a
                                        hover-over form that displays full
                                        name, telephone, and email address if
                                        available for the service recipient.

                                        This is a required field.

Label                                                                                           Service Manager 9.81
Notify By
                                        Description

                                        To notify the customer when the issue
                                        has been resolved, Service Manager
                                        prepopulates this field as E-mail. The
                                        user or the Service Desk Agent can
                                        change it to None or Telephone, if
                                        applicable.

                                        When the related fulfillment record is
                                        closed:

                                             Selecting E-mail closes the
                                             interaction and sends an email to
                                             the contact
                                             Selecting None closes the
                                             interaction without notifying the
                                             contact
                                             Selecting Telephone tells the
                                             Service Desk Agent to ask the
                                             contact whether the solution is
                                             satisfactory. If the solution works
                                             for the customer, the Service
                                             Desk Agent closes the interaction.
                                             If it doesn't work, then the Service
                                             Desk Agent must open a new
                                             interaction.

                                        This is a required field.

 Label                                                                                          Service Manager 9.81
 Affected Service
                                        Description
This PDF was generated on May 23, 2026
                                        The Service Desk Agent populates this
                                        field with the business service affected
                                        by the registered issue. Only business
                                        services the service recipient has a
                                        subscription for can be selected. ITIL
                                        2011 is centered around services, so a
                                        service construct should always be
                                        defined for best practices. If you have
                                        not yet created a service construct,
                                        start with a catch-all service, such as
                                        My Devices.

                                                    Note

                                                   The out-of-box options in
                                                   this field are based on past
                                                   Service Manager
                                                   implementations. You
                                                   should tailor these options
                                                   to match your business
                                                   needs.

                                        These business services are available
                                        out-of-box:

                                             Applications
                                             Email/Webmail
                                             Handheld PDA & Telephony
                                             Intranet
                                             Internet
                                             My Devices (The My Devices
                                             service represents all personal
                                             devices that the user would use.)
                                             Printing

                                        Selecting the service:

                                             Validates that it is a valid service.

                                                                                                                        Page 370 of 387
 Label                                                                                          Service Manager 9.81
 Title
 Tags                                   Description
 Description                            An end user is more likely to know that
                                        the email service doesn't work than
This PDF was generated on May 23, 2026  what part of the email service doesn't
                                        work.
                                        This is a required field.

                                        A short description that summarizes
                                        the interaction. This is a required field.

                                        Enter one or more free-form tags
                                        (keywords or terms) of this interaction.
                                        The tags you enter are searchable and
                                        can be used as keywords to highlight
                                        important information.
                                        For more information, see Working with
                                        tags.

                                        The Service Desk Agent populates this
                                        field with a detailed description of the
                                        interaction. When the location and
                                        telephone number differ from the
                                        contact details, the Service Desk Agent
                                        can record the correct information in
                                        the description field.

                                                    Note

                                                   Service Manager searches
                                                   this field when you perform
                                                   an advanced or expert text
                                                   search.

                                        This is a required field.

                                                                                                                        Page 371 of 387
Label                                                                                           Service Manager 9.81
Closure Code
                                        Description

                                        This field contains a predefined closure
                                        code, describing the way this issue has
                                        been solved. The out-of-box options in
                                        this field are based on Service
                                        Manager customer reference data.

                                                    Note

                                                   You may want to tailor
                                                   these options to match
                                                   your business needs.

                                        These closure codes are available out-
                                        of-box:

                                             Automatically Closed
                                             Cancelled
                                             Denied Service Catalog Request
                                             Fulfilled
                                             Invalid
                                             Not Reproducible
                                             Out of Scope
                                             Request Rejected
                                             Solved by Change/Service
                                             Request
                                             Solved by User Instruction
                                             Solved by Workaround
                                             Unable to solve
                                             Withdrawn by User

Label                                                                                           Service Manager 9.81
Solution
                                        Description

                                        This field contains a description of the
                                        solution used for this interaction.

                                                    Note

                                                   Service Manager searches
                                                   this field when you perform
                                                   an advanced or expert text
                                                   search.

 Label                                                                                          Service Manager 9.81
 Category
                                        Description
This PDF was generated on May 23, 2026
                                        This field describes the type of
                                        interaction. The interaction type
                                        determines the process to escalate to
                                        when the interaction is not a user
                                        complaint or compliment.

                                        The categories are based on ITIL
                                        service-centric processes, and
                                        therefore focus on enabling
                                        assignment, reporting, and operational
                                        analysis for knowledge management
                                        purposes.

                                        From the category list:

                                             Incident > Continue — You can
                                             relate the interaction to a new
                                             incident.
                                             Request for Change > Continue —
                                             Service Manager creates a new
                                             change request.
                                             Service Request/Request for
                                             Administration/Request for
                                             Information > Continue - You can
                                             relate the interaction to a new
                                             service request.
                                             Problem > Continue - Service
                                             Manager creates a new problem.
                                             Support Catalog > Continue -
                                             Support Catalog opens, allowing
                                             you to place an order. After an
                                             order is submitted, the interaction
                                             is given the category configured
                                             in the ordered support catalog
                                             item and a related record is
                                             created as defined in the ordered
                                             support catalog item as well.
                                             Service Catalog > Continue —
                                             Service Catalog opens, allowing

                                                                                                                        Page 374 of 387
 Label                                                                                          Service Manager 9.81

 Subcategory                            Description
                                             you to place an order. The
This PDF was generated on May 23, 2026       interaction is given the category
                                             service catalog. Service Catalog
                                             interactions aren't escalated.
                                             When you approve the
                                             interaction, it opens the related
                                             record as defined in the service
                                             catalog connector.
                                             Complaint/Compliment >
                                             Continue - No related record is
                                             created. Service Desk handles
                                             such types of interactions.

                                                    Note

                                                   The Service Desk Agent
                                                   needs to have proper
                                                   permissions to open
                                                   corresponding fulfillment
                                                   records.

                                        For more information on categories and
                                        the subcategories and areas
                                        associated with them, see Interaction
                                        categories.

                                        This is a required field.

                                        The Service Desk Agent populates this
                                        field with the subcategory of concern.

                                        Service Manager displays different lists
                                        of subcategories, depending on the
                                        category you selected. For more
                                        information on categories and the
                                        subcategories and areas associated
                                        with them, see Interaction categories.

                                                                                                                        Page 375 of 387
Label                                                                                           Service Manager 9.81
Area
                                        Description

                                        The third level of classifying an
                                        interaction, mainly used for reporting
                                        purposes.

                                        Service Manager displays different lists
                                        of areas, depending on the
                                        subcategory you selected. For more
                                        information on categories and the
                                        subcategories and areas associated
                                        with them, see Interaction categories.

Label                                                                                           Service Manager 9.81
Assignment Group
                                        Description

                                        The group assigned to work on the
                                        user complaint or compliment. For a
                                        description of this field see the
                                        Assignment Group field description in
                                        the Incident Management form details
                                        section as this field functions similarly.
                                        The out-of-box data consists of default
                                        assignment groups for use as
                                        examples of types of assignment
                                        groups.

                                        You may want to change the sample
                                        assignment groups to meet your own
                                        needs.

                                        These assignment groups are available
                                        out-of-box:

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

Label                                                                                           Service Manager 9.81
Assignee
                                        Description
Approval Status
                                        The name of the person assigned to
                                        work on the user complaint or
                                        compliment. This person is a member
                                        of the assigned support group.
                                        Assignees may belong to one or
                                        multiple assignment groups, based on
                                        the needs of your company.

                                        This field is only used when you
                                        request something from the catalog.

                                        When you submit an order from the
                                        catalog, Service Manager automatically
                                        creates an interaction which, based on
                                        approval requirements, may have to be
                                        approved before it can be fulfilled.
                                        Service Manager populates this field
                                        with the current approval status for this
                                        interaction.

                                        These approval statuses are available
                                        out-of-box:

                                             pending — The request has not
                                             been approved or a prior approval
                                             or denial has been retracted.
                                             approved — All approval
                                             requirements are approved, or no
                                             approval necessary.
                                             denied — The request has been
                                             denied.

Label                                                                                           Service Manager 9.81
Activities
                                        Description
Related Records
                                        The Activities section records
                                        information that Service Desk enters
                                        during the lifecycle of a user complaint
                                        or compliment. Every time you update
                                        a user complaint or compliment, you
                                        can fill in an update on the Activities
                                        section (New Update). A log of all the
                                        updates is stored on the Journal
                                        Updates and activities list. Self-Service
                                        updates from users are also displayed
                                        here.

                                        The Related Records section contains a
                                        list of all related records for the
                                        interaction. These may include related
                                        incidents, problems, changes, and
                                        requests.

Label                                                                                           Service Manager 9.81
SLT
                                        Description

                                        The SLT (Service Level Target) section
                                        displays SLAs related to the interaction.

                                        SLAs in interactions are customer-
                                        related and selected, based on the
                                        customer contact or department and
                                        service related to the issue. The
                                        Process Targets define the details,
                                        such as beginning and ending state,
                                        and time allowed between these states.
                                        SLA selection takes place when a
                                        Service Desk Agent escalates the
                                        interaction. The best practice is that
                                        the Service Desk Agent should
                                        communicate the time of the next
                                        breach to the customer at this point. If
                                        SLAs are configured to be handled in
                                        the background, the information in this
                                        section may not display immediately.

                                                    Note

                                                   The out-of-box system is
                                                   set up to run SLAs in the
                                                   foreground. Tailoring the
                                                   system to run SLAs in the
                                                   background complicates
                                                   communicating with the
                                                   customer and should be
                                                   avoided.

 Label                                                                                          Service Manager 9.81
 SLT View
                                        Description
 Continue button
 Cancel Interaction button              If you set the View Type property of
                                        the Calendar control to Calendar or
This PDF was generated on May 23, 2026  leave this property blank, this tab
                                        displays a normal view of the
                                        embedded Service Manager calendar.
                                        You can view the time period records
                                        and associated business records in a
                                        graphic and intuitive user interface. For
                                        more information about the Service
                                        Manager Calendar, see Calendar
                                        control and Calendar Administration.

                                        If you set the View Type property of
                                        the Calendar control to SLM, this tab
                                        visualizes the operation status for all
                                        related SLA, OLA, and UC of the
                                        current record. For more information
                                        about SLM visualization, see Visualize
                                        Service Level Management.

                                        The Service Desk Agent clicks this
                                        button to create an incident, problem,
                                        request, or change from this
                                        interaction.

                                        If the Service Desk has a role in the
                                        Incident Management process, this
                                        incident may be assigned to the
                                        Service Desk, and the Service Desk
                                        Agent can still work on it.

                                        The Service Desk Agent clicks this
                                        button to cancel the interaction on
                                        behalf of the user.

                                                                                                                        Page 381 of 387
Label                                                                                           Service Manager 9.81
Close button
                                        Description
Fulfill button
More > Send Survey                      The Service Desk clicks this button to
                                        close the user complaint or
                                        compliment. The customer's issue was
                                        resolved and requires no further action.

                                        The Service Desk handles the user
                                        complaint or compliment.

                                        After interaction is closed, the Service
                                        Desk Agent can carry out a user
                                        satisfaction survey.


1.9.26.3.4. Interaction categories

The category hierarchy was designed to support the ITIL 2011 model of service-
centric support. It is a natural-language-based hierarchy meant to enable the Service
Desk Agent to easily classify the Interaction. The three-level hierarchy (category,
subcategory, and area) creates a “sentence” that clearly and uniquely defines the
issue without ambiguity.
The category determines which process the record belongs to. Combined with the
subcategory and area, it also is used for to report results and to determine the
knowledgebase assignment for the event.

            Note

           Since the category values represent best practices, customizing this data
           is not expected. The subcategory and area fields can be customized;
           however, they should cover the scope of the IT Service provisioning in
           natural language definition and should remain unmodified. If you choose
           to customize the subcategories and areas, we recommend that you set
           them up in a natural easy-to-follow hierarchy.

The categories, subcategories, and areas that come with Service Desk out-of-box are
captured in this table.


                                        Categories, subcategories, and areas

Category                                Subcategory                           Area
complaint
complaint                               service delivery                      availability
complaint
complaint                               service delivery                      functionality

complaint                               service delivery                      performance
complaint
compliment                              support                               incident resolution
compliment                                                                    quality
compliment
compliment                              support                               incident resolution time

compliment                              support                               person
compliment
incident                                service delivery                      availability
incident
incident                                service delivery                      functionality
incident
incident                                service delivery                      performance
incident
incident                                support                               incident resolution
                                                                              quality

                                        support                               incident resolution time

                                        support                               person

                                        access                                authorization error

                                        access                                login failure

                                        data                                  data or file corrupted

                                        data                                  data or file incorrect

                                        data                                  data or file missing

                                        data                                  storage limit exceeded

                                        facilities                            hardware failure

Category                                Subcategory                          Service Manager 9.81
incident                                facilities
incident                                facilities   Area
incident                                failure      miscellaneous
incident                                failure      supplies
                                                     error message
incident                                failure      function or feature not
incident                                failure      working
incident                                hardware     job failed
incident                                hardware     system down
incident                                performance  hardware failure
                                                     missing or stolen
incident                                performance  performance
                                                     degradation
incident                                security     system or application
incident                                security     hangs
incident                                security     security breach
problem                                 access       security event/message
problem                                 access       virus alert
problem                                 data         authorization error
problem                                 data         login failure
problem                                 data         data or file corrupted
problem                                 data         data or file incorrect
                                                     data or file missing
This PDF was generated on May 23, 2026               storage limit exceeded

                                                                                                 Page 385 of 387
Category                                Subcategory                             Service Manager 9.81
problem                                 facilities
problem                                 facilities      Area
problem                                 facilities      hardware failure
problem                                 failure         miscellaneous
problem                                 failure         supplies
                                                        error message
problem                                 failure         function or feature not
problem                                 failure         working
problem                                 hardware        job failed
problem                                 hardware        system down
problem                                 performance     hardware failure
                                                        missing or stolen
problem                                 performance     performance
                                                        degradation
problem                                 security        system or application
problem                                 security        hangs
problem                                 security        security breach
request for                             grant access    security event/message
administration                                          virus alert
request for                             other           grant access
administration
request for                             password reset  other
administration
                                                        password reset
This PDF was generated on May 23, 2026
                                                                                                    Page 386 of 387

Category                                Subcategory              Area
request for change                      service portfolio        new service
request for change                      service portfolio        upgrade / new release
request for information                 general information      general information
request for information                 how to                   how to
request for information                 status                   status
service catalog                         service catalog          service catalog
service request                         Employee Off-boarding
service request                         Employee On-boarding     support catalog
service request                         Hardware
service request                         Request for
                                        Administration
service request                         Request for Information
service request                         Software
support catalog                         support catalog


1.9.26.3.5. Escalate Interaction

Depending on your selection, the Continue button opens different fulfillment records
as follows:

     Escalate Interaction - Incident

     You can escalate Interactions in the following category to Incident:

           incident

     Escalate Interaction - RFC

     You can escalate Interactions in the following category to RFC:

           request for change

     Option 1: If change is open on Category in settings, when escalating an
     interaction to an RFC, a list of change categories is displayed from which the
     category for the new change request can be selected.

     Option 2: If change is open on Change Model in settings, when escalating an
     interaction to an RFC, a list of Change Models is displayed from which the
     Change Model for the new change request can be selected.

     Escalate Interaction - Request

     You can escalate Interactions in the following categories to Request:

           service request

           request for information
           request for administration

     Option 1: If request is open on Category in settings, when escalating an
     interaction to a request, a list of request categories is displayed from which the
     category for the new request can be selected.

     Option 2: If request is open on Request Model in settings, when escalating an
     interaction to a request, a list of Request Models is displayed from which the
     Request Model for the new request can be selected.

     Escalate Interaction - Problem

     You can escalate Interactions in the problem category to Problem.



1.9.26.4. Changes in other modules

The section describes the process changes in other modules if you use the
Streamlined Interaction solution.

SO 2 Incident Management

     The figure in Incident Management Overview is updated as follows:

The figure in Incident Logging and Categorization (process SO 2.1) is updated as
follows:


The figure in Incident Assignment (process SO 2.2) is updated as follows:


     The Complaint Handling (process SO 2.9) section doesn't apply to the
     Streamlined Interaction solution.

SO 4 Problem Management

     The figure in Problem Review and Closure (process SO 4.4) is updated as
     follows:

ST 2 Change Management

     The figure in Review and Close Change (process ST 2.5) is updated as follows:


SO 3 Request Fulfillment

     The figure in Receive Request (process SO 3.1) is updated as follows:


The figure in Request Review (process SO 3.5) is updated as follows:
````
