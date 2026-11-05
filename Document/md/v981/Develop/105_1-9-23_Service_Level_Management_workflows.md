---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.9.23 .. 1.9.23.4
printed_pages: 2812-2842
---

# 1.9.23 Service Level Management workflows

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.9.23. Service Level Management
workflows

The Service Level Management process includes all necessary steps to create and
maintain Service offerings including the management of the following items:

     Service Level Agreements between business and IT
     Operational Level Agreements between IT and IT
     Underpinning contracts between IT and external providers.

In addition, Service Level Management process includes the activities such as:

     Service Level Reporting, including measurement of the service performance
     Production of service reports
     Conduction of service reviews with identification of improvement opportunities
     documented in the SIP or SQP
     The assessment of customer satisfaction with logging of complaints and
     compliments

The Service Level Management process can consist of the following activities:
Updating the Service Catalog (SD 2.1)
Create or Amend IT Services (SD 2.2)
SLRs and draft OLAs and UCs (SD 2.3)
Finalize SLRs/OLAs/UCs (SD 2.4)
Monitor Service Levels (SD 2.5)
Service Level Reporting (SD 2.6)
Perform Service Reviews (SD 2.7)
Service Improvement Plan (SD 2.8)
Review and Revise SLAs/OLAs/UCs (SD 2.9)



1.9.23.1. Updating the Service Catalog (SD
2.1)


Process ID  Procedure or                Description          Role
SD 2.1.1    Decision
                                        The Service Level    Service Level
SD 2.1.2    Evaluate request            Manager reviews      Manager
SD 2.1.3    to review the               the request and
            Service Catalog             any relevant
                                        information to
                                        determine
                                        whether or not
                                        the request is
                                        valid.

                                        Go to SD 2.1.2 to
                                        determine
                                        whether the
                                        request is valid.

            Is the request              If yes, go to SD     Service Level
            valid?                      2.1.3 to review the  Manager
                                        Service Catalog.
            Review Service              If no, go to SD
            Catalog                     2.1.9 to feedback
                                        to the Customer.

                                        Determine what       Service Level
                                        changes may be       Manager
                                        required to the
                                        Service Catalog
                                        and SDD. The
                                        Service Owner
                                        and Customer
                                        may be involved
                                        in the review.

                                        Go to SD 2.1.4 to
                                        collate updates to
                                        the SDD and
                                        Service Catalog.


Process ID  Procedure or                Description         Role
SD 2.1.4    Decision
SD 2.1.5                                                    Service Level
            Collate updates to          Compile updates     Manager
SD 2.1.6    SDD and Service             to the SDD and
            Catalog                     Service Catalog.

                                        Go to SD 2.1.5 to
                                        determine
                                        whether an RFC
                                        exists.

            Does an RFC                 If yes, go to SD    Service Level
            exist to update             2.1.6 to determine  Manager
            the Service                 whether the SLA /
            Catalog?                    OLA / UC need to
                                        be revised or
                                        reviewed.

                                        If no, go to
                                        Change Logging
                                        (ST 2.1.9) to
                                        create a new
                                        Change record.

            SLA / OLA / UC              If yes, go to SD    Service Level
                                        2.9.1 to identify   Manager
            Revision or                 any agreements
            review needed?              to be reviewed
                                        and/or revised.

                                        If no, go to SD
                                        2.1.7 to update
                                        the Service
                                        Catalog review
                                        date.


Process ID  Procedure or                Description        Role
SD 2.1.7    Decision
            Update Service              Update the         Service Level
SD 2.1.8    Catalog review              Service Catalog    Manager
            date                        to show that it
                                        has been
            Distribute                  reviewed and
            documentation               record the next
                                        scheduled review
                                        date.

                                        Go to SD 2.1.8 to
                                        distribute
                                        documentation.

                                        Once the RFC to    Service Level
                                        change the         Manager
                                        Service Catalog
                                        has been
                                        confirmed as
                                        successful, the
                                        new documents
                                        (including the
                                        SDD and Service
                                        Catalog) are
                                        circulated to the
                                        relevant
                                        stakeholders.

                                        The Maintain the
                                        Service Catalog
                                        process ends.

Process ID  Procedure or                Description                Service Manager 9.81
SD 2.1.9    Decision
                                                            Role
            Feedback to
            Customer                    The customer is     Service Level
                                        advised that the    Manager
                                        request to amend
                                        the Service
                                        Catalog is invalid
                                        and provided with
                                        the reason.

                                        The Maintain the
                                        Service Catalog
                                        process ends.


1.9.23.2. Create or Amend IT Services (SD
2.2)

Process ID  Procedure or                Description               Service Manager 9.81
SD 2.2.1    Decision
                                                           Role
            Define SLRs
                                        Once a request is  Service Level
                                        received for a     Manager
                                        new or amended
                                        IT Service,
                                        determine and
                                        agree the main
                                        requirements of
                                        the business.

                                        Go to SD 2.2.2 to
                                        conduct a
                                        feasibility study
                                        for the Service
                                        Level
                                        Requirements.


Process ID  Procedure or                Description         Role
SD 2.2.2    Decision
            Conduct                     Initiate a          Service Level
SD 2.2.3    feasibility study           feasibility study,  Manager
            for SLRs                    ensuring that any
                                        existing OLAs and
            Feedback to                 UCs are taken
            Customer                    into
                                        consideration.
                                        The Supplier
                                        Manager may be
                                        involved with
                                        Service Providers
                                        if necessary. The
                                        study must
                                        consider all
                                        elements
                                        including
                                        technology, cost
                                        and
                                        Serviceability.

                                        Go to SD 2.2.3 to
                                        feedback to the
                                        Customer.

                                        The results of the  Service Level
                                        feasibility study   Manager
                                        are fed back to
                                        the Customer.

                                        Go to SD 2.2.4 to
                                        determine
                                        whether to
                                        continue with the
                                        Service creation
                                        or amendments.


Process ID  Procedure or                Description         Role
SD 2.2.4    Decision
                                        If yes, go to SD    Service Level
            Continue with               2.2.5 to draft the  Manager
            Service creation            SDD.
            or amendments?
                                        If no, go to
                                        Change
                                        Evaluation and
                                        Closure (ST 2.6.2)
                                        to close the
                                        Change.

Process ID  Procedure or                Description                Service Manager 9.81
SD 2.2.5    Decision
                                                            Role
            Draft the SDD
                                        Draft the SDD       Service Level
                                        based on the data   Manager
                                        gathered and
                                        validated in the
                                        requirements
                                        definition and
                                        feasibility study.
                                        The SDD covers:

                                        a
                                        description
                                        of the
                                        business
                                        process
                                        concerned
                                        a detailed
                                        description
                                        of the
                                        technology
                                        and support
                                        platforms
                                        links to
                                        related
                                        policies and
                                        Service
                                        Managemen
                                        t procedures
                                        plans to
                                        monitor and
                                        measure the
                                        Service

                                        Go to SD 2.2.6 to
                                        determine
                                        whether a Service
                                        Catalog update is
                                        required.


Process ID  Procedure or                Description         Role
SD 2.2.6
            Decision
SD 2.2.7
            Service Catalog             If yes, go to SD    Service Level
            update required?            2.1.10 to review    Manager
                                        the Service
                                        Catalog.

                                        If no, go to SD
                                        2.2.7 to sign-off
                                        the SDD.

            SDD sign-off                Validate the SDD    Service Level
                                        with the            Manager
                                        Customer and
                                        then sign-off with
                                        the Service
                                        Owner and
                                        Service Level
                                        Manager. Once
                                        signed off, update
                                        the Service
                                        Catalog to reflect
                                        the new or
                                        amended Service.

                                        Go to SD 2.2.8 to
                                        finalize the SLRs.

Process ID  Procedure or                Description                Service Manager 9.81
SD 2.2.8    Decision
                                                            Role
            Create SLRs
                                        The SLRs are        Service Level
                                        created by the      Manager
                                        Service Level
                                        Manager and the
                                        Customer and are
                                        then collated into
                                        the SLR
                                        document.


1.9.23.3. SLRs and draft OLAs and UCs
(SD 2.3)


Process ID  Procedure or                Description         Role
SD 2.3.1    Decision
                                        Compile             Service Level
SD 2.3.2    Collate                     supporting          Manager
            documentation               documentation
                                        such as existing
                                        OLAs and UCs,
                                        the Service
                                        Catalog, the SDD
                                        and SLRs
                                        documents.

                                        Go to SD 2.3.2 to
                                        determine
                                        whether the
                                        Service Provider
                                        is required to
                                        support the
                                        Service.

            External Service            If yes, go to SD    Service Level
            Provider required           2.3.3 to negotiate  Manager
            to support                  with the Service
            Service?                    Provider and
                                        conduct a
                                        contract review.

                                        If no, go to SD
                                        2.3.6 to create
                                        the draft OLA.


Process ID  Procedure or                Description          Role
SD 2.3.3    Decision
                                        Contact the          Supplier Manager
SD 2.3.4    Negotiate and               Service
            conduct a                   Provider(s) to
            contract review.            discuss how the
                                        SLRs will be
                                        supported. If
                                        contracts are
                                        already in place it
                                        may not be
                                        possible to
                                        renegotiate, and
                                        this will need to
                                        be taken into
                                        account when the
                                        SLA is drafted.

                                        Go to SD 2.3.4 to
                                        create the draft
                                        UC.

            Create draft UC             The UC is drafted    Supplier Manager
                                        following the
                                        contract review
                                        and negotiation.

                                        Go to SD 2.3.5 to
                                        determine
                                        whether the UCs
                                        support the SLA.


Process ID  Procedure or                Description        Role
SD 2.3.5    Decision
                                        If the UCs do      Supplier Manager
SD 2.3.6    Do the UCs                  support the SLRs,
            support the SLA?            go to SD 2.3.6 to
                                        create the draft
                                        OLA.

                                        If no, go to SD
                                        2.3.3 to continue
                                        negotiation and
                                        contract review.

            Create draft OLA            Review the SLRs,   Service Level
                                        the SDD and the    Manager
                                        Service Catalog
                                        to determine the
                                        requirements for
                                        the OLA with the
                                        Service Owner or
                                        Supplier
                                        Manager.
                                        Determine the
                                        OLA intensive
                                        care start date
                                        and duration.

                                        Go to SD 2.3.7 to
                                        setup the OLA/UC
                                        in Service
                                        Manager.


Process ID  Procedure or                Description         Role
SD 2.3.7
            Decision
SD 2.3.8
            Setup OLA / UC in           The Service Level   Service Level
            Service Manager             Manager will        Manager
                                        ensure that the
                                        OLA / UC is set
                                        up in Service
                                        Manager by
                                        liaising with the
                                        Service Manager
                                        Admin team.

                                        Go to SD 2.3.8 to
                                        initiate the draft
                                        OLA / UC
                                        intensive care
                                        period.

            Initiate draft OLA /        Monitor the         Service Level
            UC intensive care           performance of      Manager
            period                      the OLA / UC
                                        against the draft
                                        OLA / UC metrics
                                        using data from
                                        other processes,
                                        such as Incident
                                        and Problem
                                        Management.

                                        Go to SD 2.3.9 to
                                        review the draft
                                        OLA / UC metrics.


Process ID  Procedure or                Description        Role
SD 2.3.9    Decision
                                        Once the OLA       Service Level
            Review draft OLA            intensive care     Manager
            / UC metrics                period is
                                        complete,
                                        conduct a Service
                                        Review meeting
                                        to:

                                        determine if
                                        achievement
                                        meets
                                        expectations
                                        of the draft
                                        OLA / UC
                                        determine
                                        whether the
                                        SLTs in the
                                        SLRs are
                                        achievable
                                        determine
                                        whether the
                                        draft OLA /
                                        UC are ‘fit
                                        for purpose’
                                        identify
                                        amendment
                                        s to the draft
                                        OLAs / UCs
                                        prior to
                                        converting
                                        these into
                                        formal OLA /
                                        UC metrics
                                        identify
                                        gaps
                                        between the
                                        required


Process ID  Procedure or                Description         Role
SD 2.3.10   Decision

                                             Service and
                                             current
                                             Service
                                             capabilities
                                             and
                                             consider
                                             additional
                                             resource
                                             requirement
                                             s to bridge
                                             them

                                        Go to SD 2.3.10 to
                                        review the draft
                                        OLA / UC.

            Review draft OLA            The drafts OLAs /   Service Level
            / UC                        UCs are reviewed    Manager
                                        to ensure they
                                        meet the
                                        requirements and
                                        support the new
                                        SLRs.

                                        Go to SD 2.3.11 to
                                        determine
                                        whether updates
                                        are required.

Process ID  Procedure or                Description                 Service Manager 9.81
SD 2.3.11   Decision
            Updates                                          Role
SD 2.3.12   required?
                                        If updates are       Service Level
            Are the SLTs                required to the      Manager
            achievable?                 draft agreements
                                        based on the
                                        review, go to SD
                                        2.3.2 to repeat
                                        the process

                                        If no, go to SD
                                        2.3.12 to
                                        determine
                                        whether the SLTs
                                        in the SLRs are
                                        achievable.

                                        If yes, go SD 2.4.1  Service Level
                                        to circulate the     Manager
                                        draft agreements.

                                        If no, go to SD
                                        2.2.3 to feedback
                                        to the customer.



1.9.23.4. Finalize SLRs/OLAs/UCs (SD
2.4)


Process ID  Procedure or                Description         Role
SD 2.4.1    Decision
                                        The SLRs, OLAs      Service Level
SD 2.4.2    Circulate SLRs /            and UCs are         Manager
            OLAs / UCs                  circulated to the
                                        relevant audience
                                        as pre-reading
                                        before the final
                                        confirmation and
                                        sign off meeting.

                                        Go to SD 2.4.2 to
                                        determine
                                        whether the
                                        Service will be
                                        supported by a
                                        Service Provider.

            Service                     If yes, go to SD    Service Level
            supported by an             2.4.3 finalize and  Manager
            external Service            sign off the UC.
            Provider?
                                        If no, go to SD
                                        2.4.4 to finalize
                                        the SLR and OLA,
                                        and sign off.


Process ID  Procedure or                Description         Role
SD 2.4.3    Decision
                                        The UCs are         Supplier Manager
            Finalize UC and             finalized to
            sign off                    ensure they can
                                        support the SLR
                                        and are signed off
                                        by the Supplier
                                        Manager and the
                                        Service Provider.

                                        Go to SD 2.4.4 to
                                        finalize and sign-
                                        off the SLR and
                                        OLA.


Process ID  Procedure or                Description         Role
SD 2.4.4    Decision
                                        The Service Level   Service Level
            Finalize SLR &              Manager finalizes   Manager
            OLA and sign-off            and signs off the
                                        SLR and OLA with
                                        the Customer,
                                        Service Owner
                                        and Supplier
                                        Manager. As part
                                        of the SLR
                                        discussion a
                                        launch date for
                                        the Service is
                                        agreed which
                                        takes into
                                        account how
                                        much time is
                                        needed to update
                                        the Service and
                                        the Service
                                        Manager.

                                        Go to Change
                                        Assessment and
                                        Planning (ST
                                        2.3.8) to plan and
                                        schedule the SLA
                                        and OLA Change.

                                        The Finalize SLRs
                                        / OLAs / UCs
                                        process is
                                        temporarily
                                        stopped pending
                                        implementation of
                                        the Change.


Process ID  Procedure or                Description         Role
SD 2.4.5    Decision
                                        Once the Change     Service Level
SD 2.4.6    Validate                    has been            Manager
            monitoring                  confirmed as
            systems                     successful, the
                                        monitoring
                                        systems are re-
                                        validated to
                                        ensure they
                                        accurately
                                        monitor and
                                        manage the
                                        service level
                                        targets.

                                        Go to SD 2.4.6 to
                                        launch
                                        communications.

            Launch                      Initiate            Service Level
            communications              communications      Manager
                                        to the end-user
                                        community and
                                        the delivery
                                        teams, including
                                        the Service Desk.

                                        Go to SD 2.4.7 to
                                        raise a request to
                                        update the CMS.


Process ID  Procedure or                Description         Role
SD 2.4.7
            Decision
SD 2.4.8
            Raise a request to          Raise a request to  Service Level
            update the CMS              update the CMS      Manager
                                        for the new or
                                        amended Service.

                                        Go to SD 2.4.8 to
                                        launch the
                                        Service.

            Launch Service              The Service is      Service Level
                                        launched and the    Manager
                                        following
                                        elements become
                                        "Live":

                                             Agreed
                                             Service
                                             Level
                                             parameters
                                             automated
                                             in the
                                             Service
                                             Managemen
                                             t system
                                             Monitoring
                                             of Service
                                             delivery
                                             through the
                                             Service
                                             Managemen
                                             t system

                                        The Finalize
                                        SLAs/OLAs/UCs
                                        process ends.
````
