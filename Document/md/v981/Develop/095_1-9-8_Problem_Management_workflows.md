---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.9.8 .. 1.9.9
printed_pages: 2506-2543
---

# 1.9.8 Problem Management workflows

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.9.8. Problem Management workflows

The problem management process includes the activities that are required to identify and classify problems, diagnose the root
cause of incidents, and determine resolutions to related problems. Problem management is responsible for ensuring that the
resolution is implemented through the appropriate control processes, such as change management.

Problem management includes the activities that are required to prevent the recurrence or replication of incidents. It enables you
to form recommendations for improvement, maintain problems, and review the status of corrective actions.

The problem management process consists of the following processes, which are included in this chapter:

     Problem Detection, Logging, and Categorization (process SO 4.1)
     Problem Investigation and Diagnosis (process SO 4.2)
     Problem Resolution (process SO 4.3)
     Problem Review and Closure (process SO 4.4)
     Problem and Known Error Monitoring (process SO 4.5)


1.9.8.1. Problem Detection, Logging, and Categorization
(process SO 4.1)

Problem Coordinator determines that a problem needs to be opened in order to investigate an existing or potential problem. This
process can be started in response to a single incident, a series of related incidents, or a single interaction. The process may
also result from the proactive investigation of a potential problem.
The Problem Detection, Logging, and Categorization process should include reference to information that assists analysis, such
as:

     Asset and configuration
     Change management
     Published workaround information from suppliers
     Historical information about similar problems
     Monitoring event logs and other data collected by system management tools

The incident(s) or interaction(s) that initiated the problem should be referenced, and relevant details copied from the incident(s)
or interaction(s) to the problem. If the Incident Analyst has identified a workaround or temporary fix, this should be included as
well.
A problem ticket is created. All relevant details of the problem must be recorded so that an accurate historic record exists. Other
details like impact and category of the problem are also identified.
The following figure illustrates the Problem Detection, Logging, and Categorization workflow:

                                        Problem Detection, Logging, and Categorization process           Service Manager 9.81

Process   Procedure or Decision         Description                                             Role
ID
          Review closed incidents       Periodically, the Problem                               Problem Coordinator
SO 4.1.1                                Coordinator must review the
                                        closed incidents to detect
                                        new problems or to match
                                        incidents to existing
                                        problems that have not been
                                        resolved. Analysis of
                                        incident data may reveal
                                        similar or reoccurring
                                        incidents, which means that
                                        a permanent fix must be
                                        found. Select incidents since
                                        the last review by using the
                                        following criteria:

                                        Major incidents (high
                                        impact)
                                        Incidents resolved
                                        through a workaround
                                        or a temporary fix
                                        that's not matched to a
                                        problem.
                                        Suspected problems
                                        (as identified by
                                        stakeholders)
                                        Candidates for
                                        problems

                                        All closed incidents that
                                        aren't resolved through a
                                        permanent fix, temporary
                                        fix, or workaround must be
                                        matched to existing
                                        problems. Or, a new problem
                                        must be created. Incident
                                        management staff may have
                                        linked incidents to existing
                                        problems already (for
                                        example, if a workaround
                                        has been applied).

Process   Procedure or Decision         Description                              Service Manager 9.81
ID
SO 4.1.2                                                                Role

SO 4.1.3  Incident caused by            If the incident is caused by    Problem Coordinator
          outstanding problem?          an outstanding problem, the
                                        workflow moves to SO 4.1.3.
          Relate incident to            If the incident is not caused
          outstanding problem           by an outstanding problem,
                                        the workflow moves to SO
                                        4.1.4. It is important to link
                                        incidents to existing
                                        problems to monitor the
                                        number of reoccurring
                                        incidents. This helps you to
                                        identify problems that aren't
                                        resolved. The incident count
                                        is the number of times that
                                        this particular problem has
                                        resulted in an incident, and
                                        is updated in the problem.
                                        The incident count
                                        influences the prioritization
                                        of problems by indicating
                                        the frequency of occurrence
                                        and thus the business
                                        impact of this issue.

                                        If the incident is caused by    Problem Coordinator
                                        an outstanding problem, the
                                        incident must be linked to
                                        the problem. If required, the
                                        problem is updated and the
                                        Problem Analyst is notified
                                        (for example, when a
                                        workaround has been
                                        applied).

Process   Procedure or Decision         Description                                 Service Manager 9.81
ID
SO 4.1.4                                                                   Role

SO 4.1.5  Create new problem ticket     Create a new problem ticket        Problem Coordinator
          Categorize problem            that captures all the relevant
                                        data, such as:

                                             User details
                                             Configuration Item (CI)
                                             details
                                             Date and time the
                                             problem was initially
                                             logged
                                             Description
                                             Details of all diagnostic
                                             or attempted recovery
                                             actions taken so far

                                        The Problem Coordinator
                                        can estimate the resources
                                        and costs that are required
                                        to resolve a problem during
                                        any stage of the Problem
                                        lifecycle. These details are
                                        entered in the problem
                                        record, and are used to
                                        decide the next course of
                                        action for the ticket.

                                        The Problem Coordinator            Problem Coordinator
                                        categorizes the problem into
                                        a specific domain (for
                                        example, hardware,
                                        software, or security).

                                        Problems can be
                                        categorized in the same way
                                        as incidents, so that the true
                                        nature of problems can be
                                        easily traced in the future,
                                        and meaningful
                                        management information
                                        can be obtained. Other
                                        information (such as the
                                        estimated cost and
                                        estimated effort) is entered,
                                        if it is available at this stage.
                                        These fields can be updated
                                        at a later stage if new
                                        information becomes
                                        available.

                                        If the problem is not
                                        categorized in the
                                        appropriate category, the
                                        Problem Coordinator can
                                        change the category, which
                                        initiates a new workflow.

Process    Procedure or Decision        Description                             Service Manager 9.81
ID
SO 4.1.6                                                               Role
SO 4.1.7
SO 4.1.8   Link incidents to problem    The Problem Coordinator        Problem Coordinator
SO 4.1.9   record                       links all related incident
                                        records to the problem
SO 4.1.10  Prioritize problem and       record. The Problem
           identify major problem       Coordinator also captures
                                        other information, such as
           Problem investigation to be  the impact (from SLM),
           Deferred?                    urgency, and subcategory of
                                        the problem.
           Defer the problem
           investigation                The Problem Coordinator        Problem Coordinator
                                        identifies whether it is a
                                        major problem based on the
                                        impact and the
                                        organization’s priority.

                                        If the problem investigation   Problem Manager
                                        must be deferred, move the
                                        problem to the appropriate
                                        status. If the problem
                                        investigation doesn't need to
                                        be deferred, go to SO 4.1.9.

                                        The Problem Manager            Problem Manager
                                        defers the problem
                                        investigation for a specific
                                        period of time. The reason
                                        for deferring the problem is
                                        detailed in the ticket.
                                        Periodically, the Problem
                                        Manager reviews the
                                        deferred problems to
                                        determine the appropriate
                                        action.

                                        Reasons for deferring
                                        problem include the
                                        following:

                                             The likelihood of
                                             recurrence is low
                                             The cost of resolving
                                             the problem is very
                                             high
                                             There is currently no
                                             plan to investigate the
                                             problem

           Assign Resources             The Problem Coordinator        Problem Coordinator
                                        determines the skills and
                                        personnel that are required
                                        to resolve the problem, and
                                        assigns personnel to resolve
                                        the problem.


1.9.8.2. Problem Investigation and Diagnosis (process SO 4.2)

The Problem Investigation and Diagnosis process helps identify the root cause of the problem. Where appropriate, the problem
management process should develop and maintain workarounds that enable the incident management process to help service
restoration. Different specialists can be involved in this root cause analysis. If necessary, refer to external resources to verify
whether the problem has already been identified and published by vendors. Decide the target dates for the problem
investigation.
The following figure illustrates the Problem Investigation and Diagnosis workflow:


                                        Problem Investigation and Diagnosis process

Process ID  Procedure or Decision         Description                                Role
SO 4.2.1
SO 4.2.2    Coordinate investigation and  The Problem Coordinator                    Problem Coordinator
            diagnosis                     verifies the schedules of
SO 4.2.3                                  resources, and assigns the
                                          resources to the problem
SO 4.2.4                                  resolution. The assigned
                                          resource starts their
                                          investigation. The Problem
                                          Coordinator coordinates the
                                          tasks that required to
                                          resolve the problem, and
                                          maintains communication
                                          with all stakeholders.

            Schedule the problem and      The Problem Coordinator                    Problem Coordinator
            establish milestones          estimates the cost and effort
                                          required to resolve the
                                          problem, and determines the
                                          target dates for the problem
                                          resolution milestones. Target
                                          dates are determined by the
                                          priority of the problem and
                                          by the impact of the problem
                                          on affected services.
                                          Additionally, this phase of
                                          planning considers whether
                                          an effective workaround or
                                          fix is available.

            Validate the problem          The Problem Analyst                        Problem Analyst
                                          ensures that the problem
                                          record is valid. The Problem
                                          Analyst determines whether
                                          the problem record is a
                                          duplicate or new problem.
                                          Then, the Problem Analyst
                                          continues with root cause
                                          analysis. If the problem is a
                                          duplicate, it is linked to the
                                          problem that it is a
                                          duplicated of, and the
                                          workflow moves to SO 4.2.5.
                                          If the problem is not a
                                          duplicate, the workflow
                                          moves to SO 4.2.4.

            Close duplicate problem       The Problem Analyst closes                 Problem Analyst
                                          the problem as a duplicate,
                                          and enters the necessary
                                          closure comments into the
                                          ticket.


Process ID  Procedure or Decision        Description                     Role
SO 4.2.5    Perform root cause analysis                                  Problem Analyst
SO 4.2.6                                 The Problem Analyst
                                         performs root cause
SO 4.2.7                                 analysis of the problem.
                                         Root cause analysis can
                                         include the following
                                         methods:

                                              Chronological Analysis
                                              Pain Value Analysis
                                              Kepner and Tregoe
                                              Brainstorming
                                              Ishikawa Diagrams
                                              Pareto Analysis

            Investigate and diagnose     The Problem Analyst             Problem Analyst
                                         analyzes the known data to
                                         identify and isolate the root
                                         cause of the problem. If a
                                         potential root cause is
                                         identified, it is verified. If
                                         more resources are required
                                         to do this, they are
                                         requested through the
                                         Problem Coordinator, who
                                         requests them from the
                                         Problem Manager and
                                         Problem Coordinator.

                                         Additionally, the Problem
                                         Analyst tries to identify a
                                         workaround. Potential
                                         workarounds are tested to
                                         verify that they work. If
                                         successful, a workarounds
                                         is documented in the
                                         problem record. The same is
                                         intimated to Service Desk
                                         and Incident Analysts

            Create and assign            The Problem Analyst creates     Problem Analyst
            investigation tasks          and assigns problem tasks
                                         to the resource who is
                                         responsible for root cause
                                         analysis. The Problem
                                         Analyst enters the due date
                                         for the assigned task.
                                         Additional resources (for
                                         example, suppliers and other
                                         specialists) can be used for
                                         this analysis. The Problem
                                         Analyst monitors the
                                         outstanding problem tasks.


Process ID  Procedure or Decision       Description                     Role
SO 4.2.8    Root cause identified?
                                        If the root cause is not        Problem Analyst
SO 4.2.9                                identified, the Problem
SO 4.2.10                               Analyst must determine
SO 4.2.11                               whether there is a
SO 4.2.12                               workaround for the problem.
SO 4.2.13
SO 4.2.14                               If a root cause is identified,
                                        the Problem Analyst updates
                                        the problem record with the
                                        details.

            Update problem record with  The Problem Analyst             Problem Analyst
            root cause                  updates the problem record
                                        to indicate that a root cause
            Workaround identified?      has been found. The
                                        problem record is updated
            Verify workaround           with any affected CIs.

            Workaround successful?      If a workaround is identified,  Problem Analyst
                                        the workflow moves to SO
            Update problem record with  4.2.11. If no workaround is
            workaround                  identified, the workflow
            Root cause or workaround    moves to SO 4.2.16.
            determined?
                                        The Problem Analyst creates     Problem Analyst
                                        a problem task and assigns
                                        it to the Investigation
                                        category in order to test the
                                        suitability of the identified
                                        workaround for resolving
                                        related incidents.

                                        If the workaround is            Problem Analyst
                                        successful, the workflow
                                        moves to SO 4.2.13. If the
                                        workaround is not
                                        successful, the workflow
                                        moves to SO 4.2.16.

                                        Update the workaround (in       Problem Analyst
                                        the known error and the
                                        problem) and inform
                                        stakeholders.

                                        The Problem Coordinator         Problem Coordinator
                                        validates the results of the
                                        problem task. If the root
                                        cause is determined, the
                                        workflow moves to SO
                                        4.2.15. If the root cause is
                                        not determined, the
                                        workflow moves to SO
                                        4.2.16, and then determine
                                        whether additional
                                        resources are needed or
                                        whether escalation is
                                        required.


Process ID  Procedure or Decision       Description                     Role
SO 4.2.15   Update any related open
            Incidents                   Review any related open         Problem Coordinator
SO 4.2.16                               incidents and advise the
            Caused by outstanding       assigned Incident Analyst
SO 4.2.17   known error?                that a root cause and/or
SO 4.2.18                               workaround has been
            Relate problem to           identified. (An update will be
            outstanding known error     made to the Activity Log in
                                        the incident record when the
            Verify whether to continue  problem record is saved with
            investigation               an updated workaround).

                                        Determine whether the root      Problem Coordinator
                                        cause for this problem is
                                        related to an outstanding
                                        known error. If yes, continue
                                        with SO 4.2.xx. If no,
                                        forward the problem to the
                                        Problem Resolution phase,
                                        and then create a new
                                        known error record .

                                        The problem is moved to the     Problem Coordinator
                                        Problem Resolution phase
                                        and linked to the existing
                                        known error record. The
                                        resolution of the problem is
                                        dependent on the resolution
                                        of this known error.

                                        The Problem Analyst             Problem Analyst
                                        determines whether to
                                        continue with the
                                        investigation, start problem
                                        resolution, or recommend
                                        abandonment.


Process ID  Procedure or Decision        Description                    Role
SO 4.2.19
            Continue, defer, or abandon  If the Problem Analyst         Problem Analyst
SO 4.2.20   investigation?               decides to continue the
SO 4.2.21                                investigation, the workflow
                                         moves to SO 4.2.6.

                                         If the Problem Analyst
                                         determines they don't have
                                         the capabilities to
                                         investigate and determine
                                         the root cause of the
                                         problem (that is, they don't
                                         have the skill level or the
                                         available time), the Problem
                                         Analyst documents the
                                         reason that a root cause is
                                         not found, the Problem
                                         Coordinator is informed, and
                                         the workflow moves to SO
                                         4.2.18.

                                         If the problem can be
                                         abandoned, the workflow
                                         moves to SO 4.2.19.

                                         If the problem can be
                                         deferred, the workflow
                                         moves to SO 4.2.20.

            Re-assign resources          The Problem Coordinator        Problem Coordinator
            Abandon the problem          needs to re-assigns the
                                         problem to other resource to
                                         continue the problem
                                         investigation. The problem is
                                         moved back to
                                         Categorization phase with
                                         the Assign status again, and
                                         the workflow moves to SO
                                         4.1.10.

                                         The Problem Analyst            Problem Analyst
                                         abandons the problem
                                         ticket.


Process ID  Procedure or Decision       Description                    Role
SO 4.2.22
            Defer the problem           The Problem Analyst defers     Problem Analyst
            investigation               the problem investigation for
                                        a specific period of time.
                                        The reason for deferring the
                                        problem is detailed in the
                                        ticket. Periodically, the
                                        Problem Manager reviews
                                        the deferred problems to
                                        determine the appropriate
                                        action.

                                        Reasons for deferring
                                        problem include the
                                        following:

                                             The likelihood of
                                             recurrence is low
                                             The cost of resolving
                                             the problem is very
                                             high
                                             There is currently no
                                             plan to investigate the
                                             problem


1.9.8.3. Problem Resolution (process SO 4.3)

After the Problem Management Investigation phase has identified the root cause of an incident, the Problem Resolution phase
starts. In collaboration with specialist staff, the Problem Analyst assesses the means of resolving the problem. If necessary, the
Problem Analyst requests for an RFC according to change management procedures, and links the RFC to the problem record.
The Problem Resolution phase comprises activities that identify and apply a solution to a problem.
The following figure illustrates the Problem Resolution workflow:


                                        Problem Resolution process

Process ID  Procedure or Decision       Description                      Role
SO 4.3.1
            Attempt to identify         The Problem Analyst              Problem Analyst
SO 4.3.2    permanent fix               attempts to identify a
SO 4.3.3                                permanent fix for the
SO 4.3.4                                problem record.
                                        Workarounds may be found
                                        at this point, if they were not
                                        found in the previous phase.
                                        The workarounds are tested
                                        and documented, if
                                        successful.

                                        Sometimes, other teams or
                                        vendors are involved in
                                        identifying the fix for the
                                        problem. The problem ticket
                                        may incorporate many tasks
                                        that are assigned to various
                                        analysts or teams who are
                                        working towards the
                                        problem resolution.

            Create Known Error          If needed, create a known        Problem Analyst
            Fix found?                  error record from the            Problem Analyst
                                        problem record for
                                        reference and to contribute
                                        to the known error
                                        knowledge base.

                                        If a permanent fix is
                                        identified, it is documented.

                                        If a permanent fix is not
                                        identified, it is verified for
                                        closure or deferral.

            Document permanent fix      The Problem Analyst              Problem Analyst
            details                     documents the permanent
                                        fix details in the problem
                                        record and updates the
                                        Knowledge Management
                                        Database with the
                                        permanent fix details. Then,
                                        the workflow moves to SO
                                        4.3.8.


Process ID  Procedure or Decision        Description                      Role
SO 4.3.5                                                                  Problem Analyst
            Verify whether to defer the  The Problem Analyst
SO 4.3.6    problem                      decides whether to defer or
SO 4.3.7                                 cancel the problem. If the
SO 4.3.8                                 problem is waiting for
                                         vendor resolution or for
SO 4.3.9                                 resource or budget
                                         approval, the problem is
SO 4.3.10                                deferred, and the workflow
                                         moves to SO 4.3.6.

                                         If the problem is canceled,
                                         the workflow moves to SO
                                         4.3.7.

            Defer the problem record     The Problem Analyst defers       Problem Analyst
            Cancel the problem           the problem record for a
            Resolve problem              period of time.

            Verify problem resolution    The Problem Analyst closes       Problem Analyst
                                         the problem ticket and
            Develop problem correction   marks it as canceled.
            plan
                                         In collaboration with            Problem Analyst
                                         specialist staff, the Problem
                                         Analyst assesses the means
                                         of resolving the problem. If
                                         necessary, they complete an
                                         RFC according to Change
                                         Management procedures,
                                         and link the RFC to the
                                         problem record.

                                         The Problem Manager              Problem Manager
                                         reviews the history of the
                                         problem and its resolution,
                                         and then makes a final
                                         decision as to whether or
                                         not the problem is
                                         corrected. If the problem is
                                         corrected, the workflow
                                         moves to SO 4.3.10.

                                         The Problem Analyst              Problem Analyst
                                         develops a plan that details
                                         all the corrective actions that
                                         must be performed to fix the
                                         problem.

                                         The Corrective Action Plan
                                         must include documenting
                                         the results of any monitoring
                                         that may have been
                                         implemented to monitor the
                                         problem resolution.


Process ID  Procedure or Decision         Description                   Role
SO 4.3.11
SO 4.3.12   Process corrective actions    The Problem Analyst           Problem Analyst
SO 4.3.13   for problem                   processes the problem
SO 4.3.14                                 record and prepares to
SO 4.3.15                                 implement the corrective
                                          actions. Problem tasks may
SO 4.3.16                                 be created and assigned to
                                          the Resolution category in
                                          order to execute the
                                          corrective actions.

            Implement corrective plan     The schedule to implement     Problem Analyst
                                          the fix is identified and
                                          updated in the correction
                                          plan. The correction plan is
                                          executed.

            Decide whether to rework      The Problem Analyst checks    Problem Analyst
                                          the implementation result
                                          and decides whether to
                                          rework the problem
                                          correction or abandon the
                                          problem fix.

            Rework on finding             If the plan must be           Problem Analyst
            permanent fix                 reworked, the Problem
                                          Analyst updates the problem
                                          status to Work In Progress.
                                          Then, the workflow moves
                                          to SO 4.3.1.

            RFCs required for corrective  The Problem Analyst           Problem Analyst
            actions?                      determines if any CIs must
                                          be modified in order to
                                          implement the resolution.

                                          If RFCs are required to
                                          resolve the problem, the
                                          Problem Manager is
                                          informed and the workflow
                                          moves to SO 4.3.16.

                                          If RFCs aren't required to
                                          resolve the problem, the
                                          Problem Analyst can apply
                                          non-CI or pre-approved
                                          changes, and the workflow
                                          moves to SO 4.3.17.

            Create RFCs to correct        The Problem Manager           Problem Manager
            problem                       creates RFCs, links them to
                                          the problem, and inform
                                          Change Manager if required.
                                          The Problem Manager
                                          monitors the RFCs that are
                                          required to correct the
                                          problem.


Process ID  Procedure or Decision       Description                     Role
SO 4.3.17   Apply corrective actions
SO 4.3.18                               Some Problem resolutions        Problem Analyst
SO 4.3.19   Check status of all         require both non-CI-related
            corrective actions          activities and activities that
SO 4.3.20   RFC successful?             affect CIs. The Problem
SO 4.3.21                               Analyst applies non-CI
SO 4.3.22   All corrective actions      corrective actions to fix the
            complete?                   error.
SO 4.3.23   Verify the problem
                                        The Problem Analyst checks      Problem Analyst
            Cancel problem?             the status of all the
                                        corrective actions that are
            Cancel the problem and      applied to the problem
            resolution                  record.

                                        The Problem Manager             Problem Manager
                                        checks the RFCs from the
                                        Change Management
                                        process to verify that they
                                        are successful.

                                        If the RFCs are successful,
                                        the status of all corrective
                                        actions are checked.

                                        If the RFCs aren't
                                        successful, abandonment of
                                        the RFCs is recommended.

                                        If all corrective actions are   Problem Analyst
                                        complete, the Problem
                                        Analyst begins to monitor
                                        the resolution.

                                        The Problem Analyst verifies    Problem Analyst
                                        the resolution and the
                                        corrective actions to
                                        determine whether the
                                        problem can be abandoned
                                        or deferred.

                                        If the resolution to the        Problem Analyst
                                        problem needs to be
                                        canceled, the process
                                        moves to SO 4.3.23.

                                        If the resolution doesn't
                                        need to be canceled, the
                                        corrective action continues.

                                        The Problem Analyst closes Problem Analyst
                                        the problem ticket and sets it
                                        to the "canceled" state.


Process ID  Procedure or Decision       Description                     Role
SO 4.3.24   Review problem resolution
SO 4.3.25                               The Problem Analyst             Problem Analyst
SO 4.3.26   Confirm problem correction  reviews the history of the
                                        problem and its resolution,
SO 4.3.27   Problem corrected?          and then determines
SO 4.3.28                               whether the problem is
SO 4.3.29                               corrected.

                                        The Problem Analyst             Problem Analyst
                                        reviews the problem history
                                        and resolution data, and
                                        then confirms that the
                                        affected personnel no longer
                                        experience the problem.

                                        If the problem is not           Problem Analyst
                                        corrected, the problem is set
                                        to the "unresolved" state
                                        and closed. Then, the
                                        workflow moves to SO
                                        4.3.28.

                                        If the error is corrected, the
                                        workflow moves to SO
                                        4.3.27.

            Update problem record as    The Problem Analyst sets        Problem Analyst
            resolved                    the problem record to the
                                        “resolved” state. The
            Update known error with     Problem Analyst closes the
            resolution and close known  problem ticket, or sends it to
            error                       Problem Manager for review
                                        and closure.
            Close unresolved problem
                                        The Problem Analyst             Problem Analyst
                                        updates the related open
                                        known error record with the
                                        problem resolution, and then
                                        closes the known error.

                                        The Problem Analyst sets        Problem Analyst
                                        the problem record to the
                                        “unresolved” state and
                                        closes it.

                                        Sometimes, the problem
                                        record may be reworked. In
                                        such cases, the ticket is
                                        assigned to other teams, or
                                        the ticket's status is
                                        modified.


1.9.8.4. Problem Review and Closure (process SO 4.4)

After a problem has been resolved, it is automatically forwarded from the Problem Resolution phase to the Problem Review
phase. In this phase, the problem(s) must be reviewed to determine and validate whether it has been resolved.

After a problem has been reviewed and closed, it is forwarded from the Problem Review phase to the Problem Closure phase.
The problem record must be formally closed when any change has been completed and successfully reviewed, and the
resolution has been applied.

A problem review should be scheduled whenever an investigation into unresolved, unusual, or high-impact problems justifies it.
The purpose of the problem review is to seek improvements to the process, and to prevent the recurrence of incidents or
mistakes.

Problem reviews typically include the following elements:

     Reviews of individual incident levels and problem status against service levels
     Management reviews to highlight those problems that require immediate action
     Management reviews to determine and analyze trends, and to provide input for other processes, such as user education
     and training

Problem reviews should include identifying the following elements:

     Trends (for example, recurring problems and incidents)
     Recurring problems of a particular classification component or location
     Deficiencies caused by lack of resources, training, or documentation
     Non-conformance (for example, against standards, policies, and legislation)
     Problems identified as known errors in planned releases
     Staff resource commitment in resolving incidents and problems
     Recurrence of resolved incidents or problems
     Improvements to the service or to the problem management process should be recorded and entered into a service
     improvement plan. This information should be added to the problem management knowledge base. All relevant
     documentation should be updated (for example, user guides and system documentation).

The following figure illustrates the Problem Review and Closure workflow:


                                        Problem Review and Closure process

Process ID  Procedure or Decision       Description                         Role
SO 4.4.1
SO 4.4.2    Review the problem          The Problem Manager                 Problem Manager
SO 4.4.3                                reviews the problem to
                                        determine whether it can be
SO 4.4.5                                closed and to determine the
                                        reason for the closure.
SO 4.4.5
            All problem tasks closed?   The Problem Manager                 Problem Manager
                                        checks whether there any
                                        problem tasks aren't closed.
                                        If there are open tasks, the
                                        task owner is requested to
                                        close or to cancel it.

            Associated RFCs for known   The Problem Manager                 Problem Manager
            error closed?               checks whether there any
                                        associated RFCs aren't
                                        closed. If there are open
                                        RFCs, the RFC owner is
                                        requested to close or to
                                        cancel it.

            Major problem?              If the problem is major, a          Problem Manager
                                        formal major review is
                                        conducted.

                                        If the problem is not major, a
                                        regular review is conducted.

            Review major problem        After every major problem           Problem Manager
                                        (as determined by the
                                        organization’s priority
                                        system), a review must be
                                        conducted to determine the
                                        lessons learned.

                                        Specifically, the review
                                        should examine the
                                        following items:

                                             Actions correctly
                                             performed
                                             Actions incorrectly
                                             performed
                                             What can be done
                                             better in the future
                                             How to prevent
                                             recurrence of the
                                             problem
                                             Whether there has
                                             been any third-party
                                             responsibility
                                             Whether any follow-up
                                             actions are needed.


Process ID  Procedure or Decision       Description                    Role
SO 4.4.6    Create lessons learned
            document                    A “lessons learned”            Problem Manager
SO 4.4.7                                document is created and
            Conduct problem review      placed in SKMS, and all
SO 4.4.8                                stakeholders are informed.
SO 4.4.9    Close the problem record    The Problem Manager sends
SO 4.4.10                               necessary details for service
            Open Known Errors           or process improvement to
            associated?                 the Service Improvement
            Close the Known Error       Process, if required.
            records
                                        The Problem Manager            Problem Manager
                                        initiates problem review
                                        activities and coordinates
                                        the formal review process.
                                        All parties involved in the
                                        problem resolution are
                                        included in the review, which
                                        summarizes what went well,
                                        what could be done better
                                        next time, what went wrong,
                                        and why some things went
                                        wrong.

                                        The Problem Manager            Problem Manager
                                        closes the problem record
                                        by providing appropriate the
                                        closure code and
                                        comments.

                                        If there is an open known      Problem Manager
                                        error associated with the
                                        problem, choose whether to
                                        close the known error as
                                        well as closing the problem.

                                        The Problem Manager            Problem Manager

                                        closes the associated known

                                        error.


1.9.8.5. Problem and Known Error Monitoring (process SO 4.5)

Problem management monitors the continuing impact of problems and known errors on user services. In the Problem and Known
Error Monitoring process, the Problem Manager periodically reviews the problem and known error records and monitors the
progress of activities in those records against the target dates that are agreed with stakeholders.
Service Manager tracks individual problems and their associated known error activities. The Problem Manager evaluates the
progress of those activities against the plans and associated budget. In the event that the impact of a problem becomes severe,
the Problem Manager escalates the problem. In some cases, the Problem Manager may refer the escalated problem to an
appropriate board to increase the priority of the request for change or to implement an urgent change.
The Problem Manager monitors the progress of each problem resolution against service level agreements, and periodically
informs the stakeholders of that progress.
The following figure illustrates the Problem Monitoring workflow:


                                        Problem Monitoring process

Process ID  Procedure or Decision       Description                       Role
SO 4.5.1
            Monitor Problems and        The Problem Manager               Problem Manager
SO 4.5.2    Known Errors                reviews the problem and
SO 4.5.3                                known error records
SO 4.5.4                                periodically, and compiles a
                                        list or report of the problem
                                        records for review. This list
                                        or report includes the
                                        following items:

                                             Active problem records
                                             (to evaluate progress
                                             against the planned
                                             schedule and
                                             associated budget)
                                             Deferred problem
                                             records (to evaluate
                                             whether they should
                                             remain in deferred
                                             status)

                                        The review may also be
                                        triggered by new releases or
                                        by changes being
                                        implemented.

                                        The Problem Manager
                                        identifies the appropriate
                                        action for the records.
                                        Deferred records are
                                        activated or closed. Active
                                        records may be deferred or
                                        abandoned for various
                                        reasons.

            Action required?            If any action is required, it is  Problem Manager
                                        performed. If no action is
            Determine appropriate       required, the monitoring
            actions                     process continues.

                                        The Problem Manager               Problem Manager
                                        identifies the appropriate
                                        action for the record.
                                        Possible actions include the
                                        following:

                                             Record is closed as the
                                             problem is not relevant
                                             anymore
                                             Record is investigated
                                             Record is deferred

            Review record with          The actions for the records       Problem Manager
            stakeholders                are reviewed with the
                                        stakeholders.


Process ID  Procedure or Decision       Description                      Role
SO 4.5.5    Investigate/Defer/Close?
                                        Determine whether the            Problem Manager
SO 4.5.6    Defer the problem           problem is still relevant. If a
SO 4.5.7    Activate problems           deferred problem record
                                        needs to be worked on, it is
                                        activated.

                                        If the problem is not
                                        relevant, the problem record
                                        is checked for closure and
                                        deferring.

                                        The problem record is            Problem Manager
                                        deferred. The tentative          Problem Manager
                                        activation date is entered in
                                        the problem record. If a
                                        problem must be deferred,
                                        the activation dates may
                                        need to be modified.

                                        The Problem Manager
                                        updates a deferred problem
                                        record with scheduling and
                                        resource information. The
                                        manager also moves the
                                        problem record to the
                                        appropriate state for the
                                        resumption of work. The
                                        record is activated,
                                        coordinated by the Problem
                                        Coordinator, and worked
                                        upon by the assigned
                                        Problem Analyst.


1.9.9. Problem Management details

Service Manager uses the Problem Management application to enable the Problem Management process. The main function of
Problem Management is to identify and resolve problems.
In Problem Management, the Problem Manager categorizes and prioritizes problems. The Problem Coordinator manages root
cause analysis and resolution, and the Problem Analyst diagnoses the root cause of the problem and proposes and implements
solutions for them.
This section describes selected Problem Management fields in the out-of-box Service Manager system. This section includes
the following topics:

     Problem form for problems opened from an incident
     Problem form details


1.9.9.1. Problem form after escalation from incident

After a problem is opened from an incident, the problem enters the Logging phase.
The following screenshot illustrates a new problem form:

After you save the new problem form, the problem moves to the Problem Categorization phase. The Problem Manager
categorizes and prioritizes problems. The following screenshot illustrates this change:

The Problem Analyst uses the problem investigation form to diagnoses the root cause of the problem and proposes solution.
The following screenshot illustrates a problem investigation form:


The Problem Coordinator uses the form to create known error records once the root cause and workaround of the problem has
been found.
The following screenshot illustrates an open known error form:

The Problem Analyst uses the problem resolution form to implement the proposes solution to resolve the problems.
The following screenshot illustrates a problem resolution form:


The Problem Manager uses the problem review form to conduct problem reviews.
The following screenshot illustrates a problem reviewform:


1.9.9.2. Problem form details

The following table identifies and describes some of the features of problem forms:

Label                                                                                                           Service Manager 9.81
Problem ID
Title                                   Problem form details
Description
Affected Service                                  Description

Phase                                             Specifies the unique ID of the problem. This is a system-
                                                  generated field.

                                                  A short description that summarizes the problem. This field
                                                  is pre-populated with data from an incident when a user
                                                  opens a problem from the incident.
                                                  This is a required field.

                                                  A detailed description of the problem. This field is pre-
                                                  populated with data from an incident when a user creates a
                                                  problem from the incident.
                                                  This is a required field.

                                                  Specifies the service that is affected by the problem. This
                                                  field is pre-populated with data from an incident when a user
                                                  opens a problem from the incident.
                                                  For more information about this field, see the "Affected
                                                  service" section of the table in Service Desk Interaction
                                                  Management form details.
                                                  This is a required field.

                                                  This is a system-generated field.
                                                  The following phases are available out-of-box:

                                                        Problem Logging
                                                        Problem Categorization
                                                        Problem Investigation
                                                        Problem Resolution
                                                        Problem Review
                                                        Problem Closure
                                                        Problem Abandonment

Label                                                                                             Service Manager 9.81
Status
                                        Description
Category
Subcategory                             Specifies the status of the problem. This field may affect the
Area                                    phase of the problem. All status changes must be performed
                                        manually. When the status changes, the problem phase may
                                        change automatically. There are several reasons to change
                                        the status of a problem (for example, when you are waiting
                                        for information from a vendor).

                                        The following statuses are available out-of-box:

                                             Open — The problem has been opened, but it's not
                                             currently being worked on.
                                             Categorize — The problem is being categorized.
                                             Assign — The problem is being assigned to the
                                             appropriate resource.
                                             Work In Progress — The problem is being addressed.
                                             Pending — The problem is pending for a period of time.
                                             The Problem Coordinator has contacted the vendor for
                                             information or for a part, or the Problem Coordinator
                                             has contacted the user for more information.
                                             Deferred — Because of several possible constraints,
                                             the resolution of this problem must be postponed.
                                             Resolved — A permanent fix is identified, and the
                                             problem is resolved.
                                             Closed — The problem is closed or canceled.
                                             Abandoned — The problem is abandoned (this only
                                             occurs in the Abandonment phase).

                                        This field is pre-populated with the default category. If a
                                        default category is undefined, you must select a category
                                        before open a new problem form.

                                        The out-of-box data is only “problem”. The problem category
                                        can be shared by Service Desk or Incident categories. You
                                        can also define new categories according to your needs.

                                        The second level of categorization. This field is pre-
                                        populated with data from an escalated incident.

                                        Service Manager displays different lists of subcategories,
                                        depending on the category that you selected. The
                                        subcategories are defined on a category.

                                        The third level of classification, mainly used for reporting
                                        purposes. This field is pre-populated with data from an
                                        escalated incident.

                                        Service Manager displays different lists of areas, depending
                                        on the category and subcategory that you selected. The
                                        areas are defined on a subcategory.

Label                                                                                             Service Manager 9.81
Impact
                                        Description
Urgency
Major Problem                           This field is pre-populated with data from an incident. It
Major Problem Review section            specifies the impact that the problem has on the business.
Source                                  The impact and the urgency are used to calculate the
                                        priority.
Contact Person
Categorization > Priority               The following impacts are available out-of-box:

                                             1 - Enterprise
                                             2 - Site/Dept
                                             3 - Multiple Users
                                             4 - User

                                        The out-of-box data is the same as Interaction Management
                                        and Incident Management.

                                        This field is pre-populated with data from the incident. The
                                        urgency indicates how pressing the problem is for the
                                        organization. The urgency and the impact are used to
                                        calculate the priority. For more information about this field,
                                        see Service Desk Interaction Management form details.

                                        If selected (set to true), it indicates the problem is a major
                                        problem, then the Problem Manager needs to specified and
                                        notified.

                                        This section is only visible when Major Problem is selected.
                                        Review details for this major problem can be documented
                                        under this section.

                                        The source from which the record is created.

                                        The following out-of-box sources are available:

                                             1 - User
                                             2 - Group
                                             3 - Event
                                             4 - Chat
                                             5 - Email
                                             6 - Telephone
                                             7 - Incident

                                        This field is pre-populated with data from the interaction or
                                        incident when the problem is opened from an interaction or
                                        incident. It specified the contact person for the reported
                                        problem.

                                        The order in which to address this problem in relation to
                                        other problems. The priority value is calculated by using the
                                        initial impact and urgency. This field only appears when
                                        problems that are being updated or escalated from incidents.


Label                                                       Description
Categorization > Assignment Group
                                                            The group that is assigned to work on the problem. For more
Categorization > Assignee                                   information about this field, see Incident Management form
Workflow section                                            details.
Affected Configuration Items section > Primary CI
Affected Configuration Items section > Affected CIs’ table  The out-of-box data consists of default assignment groups
                                                            for use as examples of types of assignment groups.

                                                                        Tip

                                                                       You may want to change the sample assignment
                                                                       groups to meet your own needs.

                                                            The following assignment groups are available out-of-box:

                                                                 Application
                                                                 Email / Webmail
                                                                 Field Support
                                                                 Hardware
                                                                 Intranet / Internet Support
                                                                 Network
                                                                 Office Supplies
                                                                 Office Support
                                                                 Operating System Support
                                                                 SAP Support
                                                                 Service Desk
                                                                 Incident Manager
                                                                 Problem Coordinators
                                                                 Problem Managers
                                                                 Service Manager

                                                            This is a required field when status starts from Assign and
                                                            phase starts from Categorization.

                                                            The name of the person who is assigned to work on this
                                                            problem. If the Assignment Group field is filled in, the system
                                                            will populate this field with the pre-defined Problem
                                                            Coordinator for that group. This person can be changed to
                                                            any other member of that group using the Fill function. The
                                                            operator that you select should be a member of the
                                                            Assignment Group.

                                                            Displays a figure of the problem workflow. Also indicates the
                                                            phase that the problem is currently in, and traces the phase
                                                            transition history.

                                                            Specifies the name of the failing Configuration Item (CI). The
                                                            primary CI identifies the CI that causes the service to go
                                                            down or become unavailable. The affected CIs in the related
                                                            incidents and interactions are all of the CIs affected by the
                                                            service. It is the primary CI that must be fixed to restore the
                                                            service. For example, if a mail service goes down because of
                                                            a disk error on the server, the mail server is the primary CI.
                                                            Every CI that connects to the mail service (that is, that has
                                                            Microsoft Outlook installed) is an affected CI.

                                                            The affected CIs are CIs that will have an issue when the
                                                            primary CI has an issue. These fields must be filled in
                                                            manually and are for information only. This data doesn't
                                                            drive any action and is not required.


Label                                                      Description
Affected Configuration Items section > Affected CI Count
                                                           A system-generated count of the number of CIs that are
Tasks section                                              affected by the outage. The count doesn't include the
                                                           primary CI. The affected CI count is based on the number of
                                                           items entered in theAffected Configuration Items section.The
                                                           affected CI count is calculated based on the Assessment
                                                           section in the Affected CIs table.

                                                           The user can add tasks during any phase of a problem.
                                                           Every task must be finished before the problem can be
                                                           closed. To add a new task, click the Tasks section, and then
                                                           click the Link New Task button. Service Manager provides
                                                           users with a quick view of some of the most important fields
                                                           in the task in the Tasks section. The data displayed includes
                                                           the following information:

                                                                Task ID
                                                                Status
                                                                Phase
                                                                Priority
                                                                Title

Related Records section > Link Type                        Specifies a relationship type between the problem and the
                                                           target ticket. The following groups of link types are available
                                                           out-of-box:

                                                                Related Incidents
                                                                Caused Changes
                                                                Solved By Changes
                                                                Related Problems
                                                                Related Known Errors

Related Records section > Link Existing/New Record button  After you select a link type, use these two buttons to
Related Records section > All Related Records table        associate the problem with a target ticket, or to create a new
                                                           target ticket and associate it with this problem.

                                                           Displays information on all the records that are related to this
                                                           problem. The data displayed includes the following
                                                           information:

                                                                ID
                                                                (Relation) Type
                                                                Phase
                                                                Status
                                                                Title

Related Records section > Duplicate of Problem             Verifies whether this problem is a duplicate of another
Related Records section > Duplicate Problems               problem. If the problem is a duplicate, enter the duplicate
                                                           problem ID in this field. Then, manually close the problem by
                                                           clicking More > Close Duplicate Problem.

                                                           Identifies problems that are duplicates of this problem. This
                                                           field can be populated manually, or automatically, when
                                                           other problems are verified as duplicates of this problem.


Label                                                       Description
Related Records section > Related Incident Count
                                                            This is a system-generated field. The related incident count
Investigation and Resolution section > Expected Resolution  is the number of incidents that are related to the problem, as
Date                                                        recorded in the screlation table. To relate an incident to a
                                                            problem, click the Related Records section, select Link Type
Investigation and Resolution section > Expected Root Cause  as Related Records, and then click the Link Existing Record
Identified Date                                             button.

Investigation and Resolution section > Solution Identified  The expected problem resolution date should be
Date                                                        approximately the same as the SLT Target date. The
Investigation and Resolution > Root Cause                   expected problem resolution date is the date when you plan
                                                            to close the record. This should be done before the SLT
Investigation and Resolution > Workaround                   Target date. This field has the Problem Management past
Investigation and Resolution section > Estimated Man Days   due alert attached to it. This field appears when the problem
Investigation and Resolution > Estimated Cost               enters Investigation phase. It becomes a required field in the
Investigation and Resolution > Solution                     “Work In Progress” and “Investigation” phases.
Closure Code
                                                            Specifies the date by which the identification of the root
Closure Comments                                            cause of the problem is expected. You should base the date
                                                            on the target date and on the identified dates in the SLT. This
                                                            field appears in the “Investigation” phase to assist
                                                            prioritization and planning in problem management
                                                            processing. The field becomes a required field when the
                                                            status changes to “Work In Progress” and the phase
                                                            changes to “Investigation”.

                                                            The date when you identify the solution. This field appears
                                                            when the problem enters the “Investigation” phase, and
                                                            becomes required when the status changes to “Resolved”.

                                                            A detailed description of the cause of the problem. You can't
                                                            move on from the Problem Investigation phase until you have
                                                            entered a description in this field. That phase is incomplete
                                                            until the cause of the problem is known.

                                                            Describes a temporary solution or workaround.

                                                            Specifies a resource estimate to diagnose and resolve the
                                                            problem. This data doesn't drive any action and is not
                                                            required.

                                                            Provides a resource (cost) estimate to diagnose and resolve
                                                            the problem. This data doesn't drive any action and is not
                                                            required.

                                                            Describes a permanent solution to the problem. This field is
                                                            required when the problem status changes to “Resolved”.

                                                            Uses a pre-defined closure code to specify the way in which
                                                            the problem was closed. The out-of-box data is defined in
                                                            the probcause table. This field is required when a problem is
                                                            closed or abandoned. This field is populated in the closure
                                                            wizard, and then automatically populated in the Summary
                                                            section of the problem form.

                                                            Comments to close the problem. This field is populated in
                                                            the closure wizard, and then automatically populated in the
                                                            Summary section of the problem form.

Label                                                                                             Service Manager 9.81
Cost section
                                        Description
                                        The user can add cost details of parts and labor for this
                                        incident handling. For more information about this field, see
                                        Incident Management form details.
````
