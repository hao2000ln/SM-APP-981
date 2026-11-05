---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.9.23.5 .. 1.9.23.8
printed_pages: 2842-2876
---

# 1.9.23.5 Monitor Service Levels (SD 2.5)

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.9.23.5. Monitor Service Levels (SD 2.5)


Process ID  Procedure or                Description         Role
SD 2.5.1    Decision
                                        The majority of     Service Level
            Monitor for SLA             day-to-day issues   Manager
            alerts                      will be handled by
                                        the Service Desk
                                        and those Service
                                        Providers
                                        involved in
                                        delivering the
                                        Service/s. The
                                        SLM team will be
                                        notified of
                                        significant
                                        breaches of
                                        Service Level
                                        targets,that is,
                                        urgent P1 and
                                        major Incidents.

                                        Go to SD 2.5.2 to
                                        validate SLA
                                        alerts.


Process ID  Procedure or                Description        Role
SD 2.5.2    Decision
            Validate SLA                Once an            Service Level
SD 2.5.3    alerts                      automated SLA      Manager
SD 2.5.4                                alert is received
            Is the SLA alert            its validity /
            valid?                      relevance is
                                        assessed with
                                        agreed escalation
                                        points contained
                                        within the SLA.

                                        Go to SD 2.5.3 to
                                        determine
                                        whether the SLA
                                        alert is valid.

                                        If yes, go to SD   Service Level
                                        2.5.5 to review    Manager
                                        the incoming SLA
                                        alert.

                                        If no, go to SD
                                        2.5.4 to record
                                        the SLA alert.

            Record SLA alert            The Service Level  Service Level
                                        Manager records    Manager
                                        the invalid SLA
                                        Alert for future
                                        review of alert
                                        criteria.

                                        The Monitor
                                        Service Levels
                                        process ends.


Process ID  Procedure or                Description          Role
SD 2.5.5    Decision
                                        The SLA alert is     Service Level
SD 2.5.6    Review incoming             reviewed to          Manager
            SLA alert                   determine:

                                        associated
                                        Service and
                                        SLA
                                        importance
                                        level of
                                        escalation
                                        Incident/Pro
                                        blem/Major
                                        Incident
                                        record
                                        number
                                        Support
                                        groups

                                        Go to SD 2.5.6 to
                                        determine
                                        whether SLA
                                        action is required.

            Is SLM action               If yes, go to SD     Service Level
            required?                   2.5.7 to identify    Manager
                                        the current SLA
                                        alert status.

                                        If no, go to SD
                                        2.5.4 to record
                                        the SLA alert.


Process ID  Procedure or                Description         Role
SD 2.5.7    Decision
                                        Gather additional   Service Level
            Identify current            information about   Manager
            status                      the current status
                                        of the Incident
                                        generating the
                                        alert.

                                        Go to SD 2.5.8 to
                                        participate in
                                        resolution
                                        decisions.

Process ID  Procedure or                Description               Service Manager 9.81
SD 2.5.8    Decision
                                                           Role
            Participate in
            resolution                  The Service Level  Service Level
            decisions                   Manager            Manager
                                        participates in
                                        decisions
                                        regarding the
                                        ongoing
                                        management of
                                        the Incident and
                                        possible
                                        resolution
                                        activities. This
                                        ensures that the
                                        Customer is kept
                                        informed of
                                        progress against
                                        the SLA and that
                                        the Service
                                        Owners and
                                        Service Providers
                                        are kept aware of
                                        the ongoing
                                        impact to the
                                        business.

                                        Go to SD 2.5.9 to
                                        monitor the
                                        Incident.

Process ID  Procedure or                Description                Service Manager 9.81
SD 2.5.9    Decision
            Monitor                                         Role
SD 2.5.10
            SLA Issue(s)                Periodically        Service Level
            resolved?                   review the          Manager
                                        Incident to ensure
                                        that progress is
                                        being made and
                                        that agreed
                                        actions have
                                        been completed.

                                        Go to SD 2.5.10 to
                                        determine
                                        whether the SLA
                                        issue(s) is
                                        resolved.

                                        If the reason for   Service Level
                                        the SLA alert has   Manager
                                        been resolved, go
                                        to SD 2.5.11 to
                                        confirm with the
                                        Customer (where
                                        appropriate).

                                        If no, go to SD
                                        2.5.12 to
                                        determine
                                        whether
                                        escalation is
                                        required.


Process ID  Procedure or                Description          Role
SD 2.5.11   Decision
SD 2.5.12                               Confirm the          Service Level
            Confirm to                  resolution with      Manager
SD 2.5.13   Customer (where             the Customer.
            appropriate)                The Monitor
                                        Service Levels
                                        process ends.

            Escalation                  If yes, go to SD     Service Level
            required?                   2.5.13 to perform    Manager
                                        Incident
                                        escalation.

                                        If no, go to SD
                                        2.5.9 to monitor
                                        the Incident.

            Escalation                  If the               Service Level
                                        performance is       Manager
                                        nearing its target,
                                        the Incident
                                        should be
                                        escalated via
                                        Incident
                                        Management.

                                        Go to Incident
                                        Escalation (SO
                                        2.6.1) to
                                        determine how to
                                        resolve the
                                        Incident.



1.9.23.6. Service Level Reporting (SD 2.6)


Process ID  Procedure or                Description         Role
SD 2.6.1
            Decision
SD 2.6.2
            Identify reporting          Reporting           Service Level
            type and produce            requirements are    Manager
            report                      identified and
                                        reports produced
                                        based on:

                                        Service
                                        metrics
                                        SLAs
                                        Service
                                        Catalog
                                        Service
                                        Improvemen
                                        t updates

                                        Go to SD 2.6.2 to
                                        review

            Review                      Review metrics      Service Level
            performance                 available for       Manager
                                        Service
                                        Performance,
                                        including Incident
                                        resolution and
                                        response times.
                                        The metrics are
                                        validated for
                                        accuracy.

                                        Go to SD 2.6.3 to
                                        evaluate
                                        divergence from
                                        agreed targets.


Process ID  Procedure or                Description         Role
SD 2.6.3    Decision
                                        The metrics are     Service Level
SD 2.6.4    Evaluate                    compared to the     Manager
            divergence from             service targets
            agreed targets              for each live SLA.

                                        Go to SD 2.6.4 in
                                        order for the
                                        Service Level
                                        Analyst to
                                        produce and
                                        collate the
                                        Service Reports
                                        pack.

            Produce and                 Record findings     Service Level
            collate Service             and document        Analyst
            Reports pack                within the Service
                                        Reports pack
                                        according to the
                                        structure agreed
                                        within the SLA.

                                        Go to SD 2.6.5 to
                                        distribute the
                                        Service Reports
                                        pack.


Process ID  Procedure or                Description         Role
SD 2.6.5    Decision
                                                            Service Level
            Distribute Service          The completed       Analyst
            Reports pack                Service Report
                                        packs are
                                        distributed to the
                                        Service Level
                                        Managers and
                                        Customers.

                                        Go to SD 2.7.1 in
                                        order for the
                                        Service Level
                                        Manager to
                                        determine the
                                        meeting type for
                                        the Service
                                        Review.



1.9.23.7. Perform Service Reviews (SD
2.7)

Process ID  Procedure or                Description               Service Manager 9.81
SD 2.7.1    Decision
                                                           Role
            Determine
            meeting type                Determine the      Service Level
                                        appropriate        Manager
                                        meeting type
                                        from the agreed
                                        meeting
                                        schedule.

                                        Go to SD 2.7.2 to
                                        collate the
                                        Service review
                                        pack.

Process ID  Procedure or                Description               Service Manager 9.81
SD 2.7.2    Decision
                                                           Role
            Collate the
            Service review              Collate the        Service Level
            pack                        Service review     Analyst
                                        pack, including:

                                        Meeting
                                        agenda
                                        Previous
                                        minutes and
                                        outstanding
                                        actions
                                        Service
                                        metrics
                                        SIP progress
                                        Informal and
                                        ad-hoc
                                        Customer
                                        feedback

                                        Key inputs should
                                        also be obtained
                                        from other
                                        Service
                                        Management
                                        processes and
                                        related
                                        documents.

                                        Go to SD 2.7.3 to
                                        plan the
                                        appropriate
                                        meeting.


Process ID  Procedure or                Description         Role
SD 2.7.3    Decision
                                        Determine           Service Level
            Plan appropriate            whether the         Analyst
            meeting                     Service review is
                                        a monthly,
                                        quarterly, annual
                                        or ad-hoc
                                        meeting. Set the
                                        date and location
                                        of meeting and
                                        circulate the
                                        agenda to the
                                        appropriate
                                        audience.

                                        Go to one of the
                                        appropriate steps:

                                        SD 2.7.4 to
                                        conduct a
                                        monthly
                                        Service
                                        Review
                                        meeting
                                        SD 2.7.5 to
                                        conduct a
                                        quarterly
                                        Service
                                        Review
                                        meeting
                                        SD 2.7.6 to
                                        conduct an
                                        annual
                                        Service
                                        Review
                                        meeting
                                        SD 2.7.7 to
                                        conduct an

Process ID  Procedure or                Description          Service Manager 9.81
            Decision
                                             ad-hoc   Role
                                             Service
                                             Review
                                             meeting


Process ID  Procedure or                Description         Role
SD 2.7.4    Decision
                                        The purpose of      Service Level
            Conduct a                   this meeting is to  Manager
            monthly Service             understand and
            review meeting              manage
                                        operational
                                        issues. The
                                        Customer and
                                        Service Level
                                        Manager will
                                        discuss:

                                             requests for
                                             new and
                                             amended
                                             Services
                                             updates to
                                             existing
                                             Service
                                             provision
                                             progress on
                                             ongoing
                                             SIPs
                                             Changing
                                             business
                                             requirement
                                             s which may
                                             impact the
                                             current IT
                                             Services
                                             provided

                                        Go to SD 2.7.8 to
                                        document the
                                        meeting and
                                        initiate actions.


Process ID  Procedure or                Description         Role
SD 2.7.5    Decision
                                        This meeting        Service Level
            Conduct a                   follows the same    Manager
            quarterly Service           agenda as the
            review meeting              monthly Service
                                        Review meeting
                                        but with an
                                        additional item to
                                        cover more
                                        strategic issues.

                                        Go to SD 2.7.8 to
                                        document the
                                        meeting and
                                        initiate actions.


Process ID  Procedure or                Description         Role
SD 2.7.6    Decision
                                        This meeting is     Service Level
            Conduct an                  specifically        Manager
            annual Service              designed to
            review meeting              review the overall
                                        operation of the
                                        IT Service
                                        Management
                                        process in
                                        conjunction with
                                        the Customer.
                                        This will be an
                                        opportunity to
                                        review the SLAs
                                        that are included
                                        in the Service
                                        review pack
                                        allowing all
                                        parties to re-
                                        confirm that the
                                        IT Services are
                                        meeting the
                                        Customer’s
                                        requirements and
                                        to discuss any
                                        future SLRs.

                                        Go to SD 2.7.8 to
                                        document the
                                        meeting and
                                        initiate actions.


Process ID  Procedure or                Description          Role
SD 2.7.7    Decision
                                        Both the Service     Service Level
            Conduct an                  Level Manager        Manager
            adhoc Service               and Customer are
            review meeting              entitled to call an
                                        ad-hoc Service
                                        Review meeting
                                        without having to
                                        wait for the next
                                        scheduled
                                        Service Review, in
                                        order to cover
                                        specific issues
                                        that may have
                                        arisen.

                                        Go to SD 2.7.8 to
                                        document the
                                        meeting and
                                        initiate actions.


Process ID  Procedure or                Description          Role
SD 2.7.8    Decision
                                        Document and         Service Level
SD 2.7.9    Document                    issue minutes.       Manager
            meeting & initiate          There are 2
            actions                     parallel activities
                                        from this activity.

                                        Go to SD 2.7.9 to
                                        determine
                                        whether a Service
                                        Improvement Plan
                                        (SIP) is required.

                                        Go to SD 2.7.10 to
                                        determine
                                        whether a Service
                                        Catalog review is
                                        required.

            Is an SIP/SQP               If yes, go to SD     Service Level
            required?                   2.8.1 to identify    Manager
                                        Service
                                        improvement
                                        requirements.

                                        If no, the Perform
                                        Service Reviews
                                        process ends.


Process ID  Procedure or                Description         Role
SD 2.7.10   Decision
                                        If yes, go to SD    Service Level
            Service Catalog             2.1.1 to evaluate   Manager
            review required?            the request to
                                        review the
                                        Service Catalog.

                                        If no, the Perform
                                        Service Reviews
                                        process ends.


1.9.23.8. Service Improvement Plan (SD
2.8)


Process ID  Procedure or                Description         Role
SD 2.8.1    Decision
                                        Various inputs are  Service Level
            Identify Service            used to establish   Manager
            improvement                 the underlying
            requirements                requirement, such
                                        as:

                                        Service
                                        Review data
                                        Process
                                        Review data
                                        Service and
                                        process
                                        reports
                                        SLA
                                        monitoring
                                        Problem
                                        Managemen
                                        t
                                        Customer
                                        Satisfaction

                                        The Service Level
                                        Manager will
                                        create a team to
                                        assist with
                                        requirement
                                        identification
                                        which includes
                                        Service Level
                                        Management,
                                        Problem
                                        Management,
                                        Customer
                                        satisfaction
                                        results and any
                                        relevant technical


Process ID  Procedure or                Description         Role
SD 2.8.2    Decision

                                        or process
                                        personnel.

                                        The Complaints
                                        and Compliments,
                                        Problem and
                                        Known Error
                                        database is
                                        checked to
                                        ensure the issues
                                        aren't being dealt
                                        with already.

                                        Go to SD 2.8.2 to
                                        determine
                                        whether a
                                        Problem record
                                        exists.

            Does a Problem              If yes, go to       Service Level
            record exist?               Problem             Manager
                                        Detection,
                                        Logging and
                                        Categorization
                                        (SO 4.1.14) to
                                        determine the
                                        related
                                        outstanding
                                        Problem.

                                        If no, go to SD
                                        2.8.3 to develop
                                        an SIP/SQP plan.


Process ID  Procedure or                Description        Role
SD 2.8.3    Decision
                                        The creation of    Service Level
            Create / Update             an SIP/SQP must    Manager
            an SIP/SQP                  include CSFs and
                                        measurement
                                        KPIs to assess
                                        whether targets
                                        are being met.

                                        The following
                                        people should be
                                        involved in
                                        discussion and
                                        agreement of the
                                        SIP/SQP:

                                             Customer
                                             Service
                                             Owner
                                             Service
                                             Level
                                             Manager
                                             Relevant
                                             support
                                             groups

                                        An SIP/SQP
                                        Program Board
                                        may be created
                                        and includes the
                                        following people:

                                             Service
                                             Owner
                                             Service
                                             Level
                                             Manager
                                             Delivery
                                             team senior


Process ID  Procedure or                Description          Role
SD 2.8.4    Decision
                                             managemen
            Create an RFC                    t

                                        The Program
                                        Board agrees on
                                        the composition
                                        of the team and
                                        appoints an
                                        SIP/SQP Program
                                        Manager.

                                        Go to SD 2.8.4 to
                                        create an RFC.

                                        There are 2          Service Level
                                        parallel activities  Manager
                                        following this
                                        process step.

                                        An RFC should be
                                        submitted to
                                        support the new
                                        SIP.

                                        Go to Change
                                        Logging (ST 2.1.8)
                                        to create a new
                                        Change and go to
                                        SD 2.8.5 to
                                        deliver the SIP
                                        and monitor
                                        progress.


Process ID  Procedure or                Description         Role
SD 2.8.5
            Decision

            Deliver SIP/SQP &           SIP/SQP Delivery    Service Level
            monitor                     is the              Manager
                                        responsibility of
                                        the SIP Program
                                        Manager and
                                        follows Change
                                        Management and
                                        project
                                        management
                                        processes. While
                                        Service Level
                                        Management is a
                                        key stakeholder in
                                        the SIP/SQP
                                        process, the team
                                        is not responsible
                                        for actual
                                        delivery.

                                        The SIP/SQP
                                        Program Board is
                                        responsible for
                                        monitoring the
                                        progress of the
                                        SIP/SQP through
                                        regular progress
                                        reports. Service
                                        Level
                                        Management
                                        monitors all
                                        ongoing
                                        SIPs/SQPs
                                        ensuring they
                                        remain focused
                                        on business
                                        objectives and to
                                        provide input to


Process ID  Procedure or                Description         Role
SD 2.8.6    Decision

                                        Service Review
                                        meetings.

                                        Go to SD 2.8.6 to
                                        review the
                                        SIP/SQP.

            Review SIP/SQP              Change              Service Level
                                        Management          Manager
                                        feeds into this
                                        activity advising
                                        that the Change
                                        record has been
                                        closed. When the
                                        SIP/SQP is
                                        nearing
                                        completion, the
                                        SIP/SQP Program
                                        Board assesses
                                        the likely success
                                        against the CSFs
                                        and
                                        accompanying
                                        KPIs.

                                        A short evaluation
                                        report is
                                        produced which
                                        provides
                                        recommendations
                                        for closure or
                                        further actions

                                        Go to SD 2.8.7 to
                                        determine
                                        whether to close
                                        the SIP/SQP.


Process ID  Procedure or                Description         Role
SD 2.8.7    Decision
                                        If yes, go to SD    Service Level
SD 2.8.8    Close SIP/SQP?              2.8.8 to monitor    Manager
                                        SIP/SQP
                                        requirements.

                                        If no, go to SD
                                        2.8.1 to identify
                                        Service
                                        improvement
                                        requirements.

            Close & Monitor             Once the SIP/SQP    Service Level
            SIP/SQP                     is closed, monitor  Manager
                                        for a period of
                                        time to allow the
                                        benefits of the
                                        project to take
                                        effect. The
                                        SIP/SQP Program
                                        Board retains
                                        responsibility for
                                        the monitoring
                                        period and will
                                        determine when it
                                        can end.

                                        The Service
                                        Improvement
                                        Program process
                                        ends.
````
