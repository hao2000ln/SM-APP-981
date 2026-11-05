---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.9.26.2 .. 1.9.26.2
printed_pages: 2951-2976
---

# 1.9.26.2 Service Desk Workflows (Streamlined Interaction)

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.9.26.2. Service Desk Workflows
(Streamlined Interaction)

Every time a user contacts the service desk, as an interaction is logged. User
interaction management is the process of handling all interactions with the service
desk that are received from self-service web pages or directly by service desk
personnel. These interactions can include service disruptions, service requests,
requests for information (RFI), complaints, or compliments reported by users who
communicate with the service desk by using instant messages, phone, email, or self-
service web pages.

The process enables Service Desk agents to easily log and resolve simple user
requests and to escalate others into fulfillment processes requiring further action. The
process streamlines service desk activities and decreases the workload for second-
line support teams.

The User Interaction Management process consists of the following processes, which
are included in this chapter:

     Self-Service by User (process SO 0.1)
     Interaction Handling (process SO 0.2)
     Interaction Escalation (process SO 0.3)
     Close Interaction (process SO 0.4)
     Cancel Interaction (process SO 0.5)


1.9.26.2.1. Self-Service by User
(process SO 0.1)

By using the self-service web environment, users can perform the following activities
without contacting the service desk:

     Search the knowledgebase to find an answer to a question or issue
     Monitor the status of previously reported interactions
     Log new interactions
     Order items from the service catalog

You can see the details of this process in the following figure and table.
Self-Service by User (SO 0.1) is illustrated in the following figure:


                                        Self-Service by User (SO 0.1) process

Process ID  Procedure or                Description                            Role
SO 0.1.1
            Decision
SO 0.1.2
SO 0.1.3    Log in to Self-             To gain access to User
SO 0.1.4    Service                     the Self-Service
                                        Web interface,
SO 0.1.5                                users must log on
SO 0.1.6                                by using their
                                        login credentials.

            Intend to register          If yes, continue User
            new interaction?            with SO 0.1.3. If
                                        no, go to SO 0.1.9.

            Order item from             If yes, log a                          User
            Service Request
            Catalog?                    service request. If

                                        no, go to SO 0.1.4.

            Submit query to To search for a User
            Knowledge Base knowledge

                                   document, users
                                   must complete a
                                   search.

            Satisfied with              If yes, stop. If not, User
            answer found?               go to SO 0.1.6.

            Open new                    Create a new                           User
            interaction
                                        interaction.


Process ID  Procedure or                Description       Role
SO 0.1.7
            Decision
SO 0.1.8
SO 0.1.9    Manually fill out To register a new User
            interaction details interaction, users

                                   must provide a
                                   title and a
                                   description of the
                                   request; select
                                   the urgency, and
                                   preferred contact
                                   method; and can
                                   optionally provide
                                   affected Service
                                   and add an
                                   attachment.

            Submit interaction When all                   User

                                        mandatory fields

                                        are completed,

                                        submit the form

                                        to send the

                                        request to the

                                        service desk.

            Validate solution           To validate the User
            of solved                   solution to a
            interaction?                previously
                                        reported
                                        interaction, go to
                                        SO 0.1.10. If no, go
                                        to SO 0.1.13.


Process ID  Procedure or                Description          Role
SO 0.1.10   Decision
            Validate solution           Use View Closed User
SO 0.1.11                               Requests to get
SO 0.1.12   Interaction                 an overview of all
            solved?                     solved
            Resubmit                    interactions.
            interaction and             Select the
            provide update              applicable
                                        interaction and
                                        validate the
                                        solution provided.

                                        If yes, stop. If not, User
                                        go to SO 0.1.12.

                                        When a user          User

                                        disagrees with

                                        the proposed

                                        solution, the user

                                        can resubmit the

                                        interaction and

                                        provide a reason

                                        for the

                                        disagreement.

                                        The newly-

                                        created

                                        interaction is sent

                                        to the service

                                        desk for further

                                        diagnosis.


Process ID  Procedure or                Description          Role
SO 0.1.13
            Decision
SO 0.1.14
            Check history and If a user wants to User
SO 0.1.15
            outstanding                 check the status

            Interactions?               or history of

                                        previously

                                        registered

                                        interactions, go to

                                        SO 0.1.14. If no,

                                        stop.

            Check status of             Use View Open User
            Interaction                 Requests to get
                                        an overview of all
                                        open interactions.
                                        Select the
                                        interaction and
                                        view the status
                                        with last updates.

            Provide update?             If a user has        User

                                        additional details

                                        to add to the

                                        previously-logged

                                        interaction that

                                        may be useful to

                                        know for the

                                        specialist, go to

                                        SO 0.1.16. If no,

                                        stop.

Process ID  Procedure or                Description              Service Manager 9.81
SO 0.1.16   Decision
                                                          Role
            Update
            Interaction                 There are two     User

                                        scenarios in

                                        which you may

                                        update an

                                        interaction and

                                        then require a

                                        Save button to

                                        save the updated

                                        information.

                                        The Save
                                        button
                                        appears
                                        when a self-
                                        service user
                                        selects the
                                        option View
                                        Open
                                        Requests,
                                        selects an
                                        interaction,
                                        and clicks
                                        the Update
                                        button.
                                        Once the
                                        information
                                        is updated,
                                        the self-
                                        service user
                                        clicks Save
                                        & Exit to
                                        save the
                                        updated
                                        information
                                        in the
                                        request.


Process ID  Procedure or                Description     Role
            Decision

                                        When you
                                        escalate an
                                        interaction,
                                        you can go
                                        back to the
                                        interaction
                                        to add more
                                        information
                                        or perform
                                        changes to
                                        it. You then
                                        have an
                                        Update
                                        button when
                                        you select
                                        an existing
                                        interaction.
                                        The
                                        interaction is
                                        also a status
                                        of
                                        Dispatched.
                                        Once you
                                        have added
                                        more
                                        information
                                        to the
                                        request or
                                        performed
                                        the
                                        changes,
                                        you can
                                        click Save &
                                        Exit.


1.9.26.2.2. Interaction Handling
(process SO 0.2)

The service desk is responsible for handling all user interactions received by the self-
service Web portal, email, or phone. The service desk attempts to resolve an
interaction of user complaints or compliments.
Handling user complaints or compliments is the process that the Service Desk
Manager is responsible for.
When the Service Desk Manager receives assigned interactions, the manager
investigates the cause of the complaint or compliment by evaluating the relevant
information and talking to the people involved. The manager searches for an answer
or solution to satisfy the user who filed the complaint, updates the interaction with the
agreed details, and then closes the interaction.
You can see the details of this process in the following figure and table.
Interaction Handling (SO 0.2) is illustrated in the following figure:



                                        Interaction Handling (SO 0.2) process

Process ID  Procedure or                Description                            Role
SO 0.2.1
SO 0.2.2    Decision

SO 0.2.3    Register new                If a new                               Service Desk
            Interaction?                interaction is                         Agent
                                        required, go to
                                        SO 0.2.2. If not,
                                        go to SO 0.2.4.

            Select Interaction          Select the                             Service Desk
            category and fill           appropriate                            Agent
            out Interaction             Interaction
            details                     category from the
                                        available
                                        category list and
                                        fill out the
                                        required
                                        Interaction details
                                        such as a full
                                        Description,
                                        Contact, Service
                                        Recipient, and so
                                        on.

            User complaint or           If the Interaction                     Service Desk
            compliment?                 is a user                              Agent
                                        complaint or
                                        compliment, go to
                                        SO 0.2.9. If not,
                                        go to SO 0.3.1 to
                                        determine what
                                        requirement of
                                        the user request
                                        is.


Process ID  Procedure or                Description            Role
SO 0.2.4    Decision
            Link User details           In Self-Service        Service Desk
SO 0.2.5    to Interaction              Interaction, fill in   Agent
SO 0.2.6    submitted from              the name of the
SO 0.2.7    Self-Service                caller in the
SO 0.2.8                                Contact field and
            Monitor for Self-           the name of the
            Service newly               User in the
            created                     Service Recipient
            Interactions                field (if different).

            Monitor for Self-           If there are new       Service Desk
            Service                     Interactions,          Agent
            Interaction                 follow the same
            updates                     Interaction
            Assess                      registration
            Interaction                 process.
            updates
                                        If Interactions are    Service Desk
            User requests to            updated, they          Agent
            cancel                      must be
            Interaction?                reassessed.

                                        Evaluate               Service Desk
                                        Interactions that      Agent
                                        have been
                                        updated or
                                        resubmitted.

                                        If the User            Service Desk
                                        requests to            Agent
                                        cancel
                                        Interaction, go to
                                        SO 0.5.1 to verify
                                        the Interaction to
                                        be cancelled. If
                                        not, go to SO
                                        0.2.3.


Process ID  Procedure or                Description          Role
SO 0.2.9
SO 0.2.10   Decision
SO 0.2.11
            Review complaint            The Service Desk     Service Desk
SO 0.2.12   or compliment               Manager reviews      Manager
            information                 the detailed
                                        information.

            Is it a User                If it is a user      Service Desk
            complaint?                  complaint, go to     Manager
                                        SO 0.2.11. If not,
                                        go to SO 0.2.13.

            Investigate                 The Service Desk     Service Desk
            complaint cause             Manager              Manager
                                        investigates the
                                        cause of the
                                        complaint by
                                        looking at the
                                        relevant
                                        information and
                                        talking to the
                                        people involved.
                                        The Service Desk
                                        Manager also
                                        searches for an
                                        answer or
                                        solution to satisfy
                                        the User who
                                        filed the
                                        complaint.

            Take action to              The Service Desk     Service Desk
            conciliate the              Manager contacts     Manager
            User                        the User to solve
                                        the User’s issue
                                        and tries to reach
                                        an agreement.

Process ID  Procedure or                Description                Service Manager 9.81
SO 0.2.13   Decision
                                                            Role
            Update
            Interaction                 The Service Desk    Service Desk
                                        Manager updates     Manager
                                        the Interaction
                                        with the agreed
                                        solution, and then
                                        go to SO 0.4.1 to
                                        close the
                                        Interaction.


1.9.26.2.3. Interaction Escalation
(process SO 0.3)

When an Interaction is received, the Service Desk Agent first determines if the
Interaction is a service request, a request for change, a problem or an incident, and if
so, logs the request.
You can see the details of this process in the following figure and table.
Interaction Escalation (SO 0.3) is illustrated in the following figure:


                                        Interaction Escalation (SO 0.3) process

Process ID  Procedure or                Description                              Role
SO 0.3.1
            Decision
SO 0.3.2
SO 0.3.3    Determine                   After filling out                        Service Desk
SO 0.3.4    requirements                the Interaction                          Agent
                                        details, the
                                        Service Desk
                                        Agent determines
                                        what requirement
                                        of the user
                                        request is.

            Request for                 If a Change is                           Service Desk
            Change?                     required, go to ST                       Agent
                                        2.1.1 to log the
                                        RFC. If not, go to
                                        SO 0.3.3.

            Problem?                    If a Problem is                          Service Desk
                                        needed, go to SO                         Agent
                                        4.1.4 to create a
                                        new Problem. If
                                        not, go to SO
                                        0.3.4.

            Service Request?            If a Service                             Service Desk
                                        Request is                               Agent
                                        required, go to
                                        SO 0.3.5. If not,
                                        go to SO 0.3.11.

Process ID  Procedure or                Description                 Service Manager 9.81
SO 0.3.5    Decision
            Service Desk                                     Role
SO 0.3.6    Agent able to
SO 0.3.7    solve?                      If the Service       Service Desk
SO 0.3.8                                Desk Agent is        Agent
            Open Service                able to solve the
            Request and                 Service Request,
            document                    go to SO 0.3.6. If
            solution                    not, go to
                                        Request
            Implement                   Fulfillment
            solution                    process SO 3.1.1.

            Verify solution             The Service Desk     Service Desk
            with User                   Agent creates a      Agent
                                        new Service
                                        Request and
                                        documents the
                                        solution to be
                                        implemented.

                                        The Service Desk     Service Desk
                                        Agent then           Agent
                                        implements the
                                        solution for the
                                        User.

                                        The Service Desk     Service Desk
                                        Agent contacts       Agent
                                        the User and
                                        communicates
                                        the solution. The
                                        user should verify
                                        the solution and
                                        confirm that the
                                        Service Request
                                        is fulfilled or the
                                        Incident is
                                        resolved.


Process ID  Procedure or                Description            Role
SO 0.3.9    Decision
            User accepts                If the User            Service Desk
SO 0.3.10   solution?                   accepts the            Agent
SO 0.3.11                               solution, go to SO
SO 0.3.12   Close Service               0.3.10. If not, go
            Request or                  to Request
            Incident directly           Fulfillment
                                        process SO 3.1.1
            Incident?                   for Service
                                        Request or
            Service Desk                Incident
            Agent able to               Management
            solve?                      process SO 2.2.1
                                        for Incident
                                        assignment.

                                        The Service Desk       Service Desk
                                        Agent closes the       Agent
                                        Service Request
                                        or Incident on
                                        first intake.

                                        If it is an Incident,  Service Desk
                                        go to SO 0.3.12. If    Agent
                                        not, go to SO
                                        0.3.1.

                                        If the Service         Service Desk
                                        Desk Agent is          Agent
                                        able to solve the
                                        Incident, go to SO
                                        0.3.13. If not, go
                                        to Incident
                                        Management
                                        process SO 2.1.1.

Process ID  Procedure or                Description              Service Manager 9.81
SO 0.3.13   Decision
                                                          Role
            Open Incident
            and document                The Service Desk  Service Desk
            solution                    Agent creates a   Agent
                                        new Incident and
                                        documents the
                                        solution to be
                                        implemented.
                                        Then go to SO
                                        0.3.7.


1.9.26.2.4. Close Interaction
(process SO 0.4)

When an interaction is solved by a related incident, change, request, or problem that's
resolved, the interaction is closed. Based on user preferences, the Service Desk
communicates the solution to the user by phone or email.

You can see the details of this process in the following figure and table.

Close Interaction (SO 0.4) is illustrated in the following figure:


                                        Interaction Closure (SO 0.4) process

Process ID  Procedure or                Description                           Role
SO 0.4.1
            Decision
SO 0.4.2
SO 0.4.3    Close Interaction           The Interaction Tool
SO 0.4.4    from linked                 closure is caused
            record                      by the closure of
                                        an Incident,
                                        Change, Problem
                                        or Service
                                        Request, or the
                                        submission of a
                                        User complaint or
                                        compliment.

            Notify by phone?            If the Notify By Tool
                                        method states
                                        that the User
                                        wants to be
                                        notified by phone,
                                        go to SO 0.4.6. If
                                        not, go to SO
                                        0.4.3.

            Notify by email?            If the Notify By Tool
                                        method states
                                        that the User
                                        wants to be
                                        notified by email,
                                        go to SO 0.4.4. If
                                        not, go to SO
                                        0.4.5.

            Send email                  Email notification Tool
            notification to             is sent to User.
            User


Process ID  Procedure or                Description           Role
SO 0.4.5    Decision
            User satisfaction           A user                Tool
SO 0.4.6    survey
                                        satisfaction
SO 0.4.7    First call
SO 0.4.8    resolution?                 survey that's

            Check solution              automatically
            completeness
                                        generated by the
            Verify solution
            with User                   system can be

                                        sent out.

                                        If the related        Service Desk
                                        Service Request       Agent
                                        or Incident is
                                        closed by Service
                                        Desk Agent on
                                        first contact, go
                                        to SO 0.4.5. If not,
                                        go to SO 0.4.7.

                                        The Service Desk      Service Desk
                                        Agent checks the      Agent
                                        solution provided
                                        by fulfillment
                                        team.

                                        The Service Desk      Service Desk
                                        Agent contacts        Agent
                                        the User and
                                        communicates
                                        the solution. The
                                        user should verify
                                        the solution and
                                        confirm that the
                                        incident is solved,
                                        the question or
                                        complaint is
                                        answered, or the
                                        Service Request
                                        is fulfilled.

Process ID  Procedure or                Description                  Service Manager 9.81
SO 0.4.9    Decision
                                                              Role
            User accepts
            solution?                   If the User           Service Desk
                                        accepts the           Agent
                                        solution, go to SO
                                        0.4.5. If not, go to
                                        SO 0.2.1 to
                                        register new
                                        Interaction.


1.9.26.2.5. Cancel Interaction (process SO
0.5)

The Cancel Interaction process identifies the steps to cancel an interaction.
You can see the details of this process in the following figure and table.
Cancel Interaction (process SO 0.5) is illustrated in the following figure:

                                        Cancel Interaction (SO 0.5) process

Process ID  Procedure or                Description                          Role
SO 0.5.1
            Decision
SO 0.5.2
            Verify the                  The Service Desk                     Service Desk
            Interaction to be           Agent verifies the                   Agent
            cancelled                   User updates to
                                        check whether
                                        the Interaction
                                        can be cancelled
                                        or not.

            Cancel the                  The Service Desk                     Service Desk
            Interaction                 Agent cancels the                    Agent
                                        Interaction based
                                        on User updates.
````
