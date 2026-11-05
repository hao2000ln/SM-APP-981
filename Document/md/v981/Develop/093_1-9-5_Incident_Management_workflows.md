---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.9.5 .. 1.9.5
printed_pages: 2450-2480
---

# 1.9.5 Incident Management workflows

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.9.5. Incident Management workflows

The Incident Management process logs, investigates, diagnoses, and resolves incidents. Incidents can be initiated by the
escalation of Service Desk interactions or automatically detected and reported by event monitoring tools. The process includes
all necessary steps to log and resolve an incident, including any necessary escalations or reassignments.

The Incident Management process consists of the following processes, which are included in this chapter:

     Incident Logging and Categorization (process SO 2.1)
     Incident Assignment (process SO 2.2)
     Incident Investigation and Diagnosis (process SO 2.3)
     Incident Resolution and Recovery (process SO 2.4)
     Incident Review and Closure (process SO 2.5)
     Incident Escalation (process SO 2.6)
     SLA Monitoring (process SO 2.7)
     OLA and UC Monitoring (process SO 2.8)


1.9.5.1. Incident Logging and Categorization (process SO 2.1)

Incidents are initiated and logged as part of the Interaction Management or the Event Management process, depending on the
source and nature of the incident. All relevant information relating to incidents must be logged so that a full historical record is
maintained. By maintaining accurate and complete incidents, future assigned support group personnel are better able to resolve
recorded incidents.

     If the incident is logged by the Service Desk Agent, most incident details are already provided by the interaction record. The
     Service Desk Agent verifies the Assignment Group to make sure the selected group is the most suitable group to solve the
     incident.
     If an incident is logged by an Operator, usually by using a system management tool, the incident must be based on the
     applicable incident model.

Operators and Service Desk Agents can perform the following Incident Logging tasks:

     Create new incident from monitoring system notification (Operator)
     Create new incident from user interaction (Service Desk Agent)
     Review and update incident information (Service Desk Agent)

You can see the details of this process in the following figure and table.
The Incident Logging and Categorization workflow is illustrated in the following figure:


                                        Incident Logging and Categorization process

Process ID  Procedure or Decision         Description                                Role
SO 2.1.1
SO 2.1.2    Create new incident           A User interaction can't be                Service Desk Agent
SO 2.1.3                                  solved on first intake and is
SO 2.1.4                                  escalated to the
                                          Service Manager process.
SO 2.1.5                                  The interaction is
                                          automatically related to the
                                          newly created incident. The
                                          Service Desk Analyst
                                          creates an incident from an
                                          interaction.

            Complete Incident Details     Based on the categorization                Service Desk Agent
                                          and the affected services,
                                          the incident is automatically
                                          assigned to the responsible
                                          support group. The Service
                                          Desk Analyst verifies that
                                          the assignment is correct.

            Provide interaction number    The Service Desk Analyst                   Service Desk Agent
            and SLA target to User        provides the interaction
                                          number to the User. The
                                          User keeps the interaction
                                          number as a reference to the
                                          incident. The Service Desk
                                          Analyst also provides a
                                          target solution date based
                                          on the SLA.

            Create new Incident           An Incident is detected                    Operator
                                          when monitoring the IT
                                          infrastructure. The Operator
                                          (or Initiator) decides to
                                          create an Incident manually
                                          or an Incident is generated
                                          automatically, depending on
                                          tool settings.

                                          If a new service request is
                                          identified as an incident or
                                          an incident occurs related to
                                          fulfillment activities, the
                                          Operator creates an incident
                                          from a service request.

                                          Go to SO 2.1.10 to select an
                                          Incident template (if
                                          appropriate).

            Select Category and Priority  Select the suitable Category               Operator
                                          and Priority by selecting the
                                          applicable impact level and
                                          urgency.


Process ID  Procedure or Decision         Description                    Role
SO 2.1.6    Select Incident template (if
SO 2.1.7    appropriate)                  The Operator (or Initiator)    Operator
                                          selects an incident template
SO 2.1.8    Follow template instructions  from a list, or a template is
                                          selected automatically,
SO 2.1.9    Provide                       depending on the settings.
            Title/Description/Affected
            Service/Affected CI           The Operator (or Initiator)    Operator
                                          provides and records the
            Assign incident to group      incident details based on the
                                          instructions provided by the
                                          incident template. The
                                          template instructions may
                                          filled in by predefined
                                          scripts.

                                          Provide a suitable title and   Operator
                                          description for the incident.
                                          This might be based on the
                                          event text. If possible, the
                                          affected Service, affected
                                          Configuration Item should
                                          be selected.

                                          The incident is manually       Operator
                                          assigned to the responsible
                                          support group, based on the
                                          incident categorization and
                                          the associated affected
                                          services.


1.9.5.2. Incident Assignment (process SO 2.2)

Incidents are logged from an interaction by a Service Desk Agent or from an event by an Incident Coordinator monitors the
incident queue and reviews open status incidents. The Incident Coordinator verifies whether an incident is a major incident using
predefined criteria. If it is, the Incident Manager is informed about the incident arrival; otherwise, it is assigned to an Incident
Analyst for further investigation and diagnosis.
The Incident Analyst receives an assigned incident and determines whether the incident can be resolved with the tools and
knowledge available. If the incident can't be resolved, the Incident Analyst reassigns it to the Incident Coordinator.
You can see the details of this process in the following figure and table.
The Incident Assignment workflow is illustrated in the following figure:


                                        Incident Assignment process

Process ID  Procedure or Decision           Description                     Role
SO 2.2.1
SO 2.2.2    Review Incident information     The Incident Coordinator        Incident Coordinator
                                            monitors the incident queue
SO 2.2.3                                    and reviews all incoming
                                            Incidents.
SO 2.2.4
SO 2.2.5    Major Incident?                 The Incident Coordinator        Incident Coordinator
SO 2.2.6                                    verifies whether this incident
SO 2.2.7                                    is a major incident using
SO 2.2.8                                    predefined criteria.

                                            If yes, continue with SO
                                            2.2.3.

                                            If no, go to SO 2.2.4

            Inform Incident Manager         The Incident Coordinator        Incident Coordinator
                                            informs the Incident
                                            Manager about the major
                                            incident. The Major Incident
                                            checkbox is checked and
                                            the ticket is assigned to the
                                            manager.

                                            Automatic notifications
                                            about the Major Incident
                                            arrival are sent to Incident
                                            Manager.

                                            Then go to SO 2.2.9.

            Identify parent/child Incident  The operator identifies         Operator
                                            whether there is a need to
                                            create a parent-child record
                                            relationship to link multiple
                                            similar incidents together.

            Assign Incident to analyst      The Incident Coordinator        Incident Coordinator
                                            assigns it to an Incident
                                            Analyst from the Incident
                                            Coordinator's group for
                                            further investigation and
                                            diagnosis.

            Review Incident information     The Incident Analyst            Incident Analyst
                                            monitors the queue of
                                            incidents assigned to
                                            him/her and reviews the
                                            incoming incidents.

            Able to resolve Incident?       The Incident Analyst reviews    Incident Analyst
                                            the assigned incident to see
                                            if he/she can resolve it. If
                                            yes, continue with SO 2.2.7.
                                            If no, go to SO 2.2.8.

            Accept Incident                 The Incident Analyst            Incident Analyst
                                            accepts the incident.


Process ID  Procedure or Decision       Description                     Role
SO 2.2.9
            Reassign Incident to        The Incident Analyst            Incident Analyst
SO 2.2.10   coordinator                 reassigns the incident to the
                                        Incident Coordinator if no
                                        resolution can be found. The
                                        analyst also provides the
                                        information on the current
                                        status, work performed on
                                        the incident, and information
                                        on reassignment.

                                        The Incident Coordinator
                                        can decide whether to
                                        escalate the incident,
                                        reassign the incident, or
                                        close the incident.

            Create Major Incident Team  The Incident Manager            Incident Manager
                                        dynamically establishes a
                                        separate major incident
                                        team under the Incident
                                        Manager's direct leadership.
                                        The team is tasked to
                                        concentrate on this incident
                                        exclusively to ensure that
                                        adequate resources and
                                        focus are provided to find a
                                        swift resolution. The Incident
                                        Manager forms separate
                                        technical teams.
                                        Throughout, the Incident
                                        Coordinator and Service
                                        desk ensures that all
                                        activities are recorded and
                                        Users are kept updated and
                                        fully informed of the
                                        progress. A separate
                                        procedure with shorter
                                        timescales and greater
                                        urgency must be used for
                                        major incidents.


1.9.5.3. Incident Investigation and Diagnosis (process SO 2.3)

Each support group involved with handling incidents must perform investigation and diagnosis tasks to determine the
categorization of and solution to the incident. All actions performed by support group personnel are documented in the incident,
so that a complete historical record of all activities is maintained at all times.

Incident Investigation and Diagnosis includes the following actions:

     Establishing the exact cause of the incident
     Documenting user requests for information or for particular actions or outcomes
     Understanding the chronological order of events
     Confirming the full impact of the incident, including the number and range of users affected
     Identifying any events that could have triggered the incident (for example, a recent change or user action)
     Searching known errors or the knowledgebase for a workaround or resolution
     Discovering any previous occurrences, including previously logged incident or problems and known errors, the
     knowledgebase, and error logs and knowledgebases of associated manufacturers and suppliers
     Identifying and registering a possible resolution for the incident

The Incident Analyst asks the following questions to determine how to resolve an incident:

     Is there a problem?
     Do I have the knowledge and tools to solve this problem?
     Can the incident be reproduced?
     Can the incident be related to an open problem or known error?
     Was the incident caused by the implementation of a change?
     Can a solution be found for this incident?

You can see the details of this process in the following figure and table.

The Incident Investigation and Diagnosis workflow is illustrated in the following figure:


                                        Incident Investigation and Diagnosis process

Process ID  Procedure or Decision        Description                                  Role
SO 2.3.1
SO 2.3.2    Review Incident              The Incident Analyst                         Incident Analyst
                                         monitors the queue of
SO 2.3.3                                 incidents assigned to
                                         him/her and reviews the
SO 2.3.4                                 incoming incidents.

SO 2.3.5    Request for information?     The Incident Analyst                         Incident Analyst
                                         evaluates the incident to see
                                         if it is categorized as a
                                         Request for Information (RFI)
                                         or if it is a service disruption.
                                         If it is a RFI, continue with
                                         SO 2.3.12. If it is a service
                                         disruption, go to SO 2.3.3.

            Investigate and Diagnose     The Incident Analyst starts                  Incident Analyst
            Incident                     to investigate and diagnose
                                         the cause of the incident.
                                         The status of the incident is
                                         set to Work in Progress.

                                         Tasks could be created for
                                         carrying out the
                                         investigation activities.

            Match to outstanding         The Incident Analyst                         Incident Analyst
            Problem/ Known Error/        searches the problem
            Incident?                    database to see if there is
                                         already a problem or known
            Relate incident to Problem/  error defined for this
            Known Error/ Incident        incident. If yes, continue
                                         with SO 2.3.5. If no, go to SO
                                         2.3.6.

                                         When an incident matches                     Incident Analyst
                                         an outstanding problem or
                                         known error, the incident is
                                         related to the problem or
                                         known error record.


Process ID  Procedure or Decision       Description                      Role
SO 2.3.6
            Incident caused by change?  The Incident Analyst             Incident Analyst
SO 2.3.7                                searches the changes
SO 2.3.8                                database to see if a recent
SO 2.3.9                                change may have caused
SO 2.3.10                               the service disruption. If the
                                        configuration item
                                        associated with the incident
                                        is listed, the Incident Analyst
                                        can also look at any
                                        changes that have recently
                                        been performed against this
                                        configuration item. The
                                        Incident Analyst can also
                                        view the configuration item
                                        tree to discover if related
                                        configuration items could
                                        have caused the incident. If
                                        yes, continue with SO 2.3.7.
                                        If no, go to SO 2.3.8.

            Relate incident to change   When the incident is caused      Incident Analyst
            (caused by)                 by a previous change, the
                                        incident is related to the
                                        change request. A solution
                                        still needs to be found to
                                        solve the incident.

            Resolution found?           The Incident Analyst checks      Incident Analyst
                                        the known
                                        error/knowledgebase for a
                                        workaround or resolution to
                                        this incident, or tries to find
                                        a solution. If yes, continue
                                        with SO 2.3.13. If no, go to
                                        SO 2.3.9.

            Reassignment Required?      If reassignment is required,     Incident Analyst
                                        go to SO 2.3.11. Otherwise,
                                        go to SO 2.3.10.

            Escalation Required         If a solution has not been       Incident Analyst
                                        identified review whether to
                                        escalate the Incident to the
                                        Incident Coordinator.

                                        If yes, go to SO 2.6.1 to
                                        determine how to resolve
                                        the Incident. If not, go to SO
                                        2.3.3.to continue
                                        investigation and diagnosis
                                        of the Incident.


Process ID  Procedure or Decision       Description                    Role
SO 2.3.11   Reassign Incident to
            Coordinator                 The Incident Analyst           Incident Analyst
SO 2.3.12                               reassigns the incident to the
SO 2.3.13   Search Collect information  Incident Coordinator if no
            Document                    resolution can be found. The
            Resolution/Workaround       analyst also provides
                                        information on the current
                                        status, work performed on
                                        the Incident, and information
                                        on reassignment. The
                                        Incident Coordinator can
                                        decide whether to escalate
                                        the incident, reassign the
                                        incident, or close the
                                        incident.

                                        The Incident Analyst           Incident Analyst
                                        searches for information to
                                        provide the requested
                                        information to the User.

                                        The Incident Analyst           Incident Analyst
                                        documents the solution or
                                        workaround in the incident.


1.9.5.4. Incident Resolution and Recovery (process SO 2.4)

As part of the Incident Resolution and Recovery process, the Incident Analyst identifies and evaluates potential resolutions
before those resolutions are applied and escalates incidents as necessary. The Incident Analyst may escalate an incident to the
Incident Coordinator, including those incidents that require a change. If the Incident Analyst doesn't have the required level of
permissions to implement a change, the Incident Analyst reassigns the incident to another group that can implement the
resolution. As soon as it becomes clear that the assigned support group is unable to resolve the incident or if the target time
period for first-point resolution is exceeded, the incident must be immediately escalated.

The objectives of the Incident Resolution and Recovery process are to ensure that:

     Recorded incidents include a resolution or workaround and information is complete.
     Incidents that require a change are escalated to the Incident Coordinator.
     Incidents for which the Incident Analyst has the required level of permissions are tested and implemented by the Incident
     Analyst in a production environment.
     Any incidents that the Incident Analyst doesn't have permissions to implement are reassigned to the applicable group for
     resolution implementation.
     Any implementation errors that occur during incident resolution correctly trigger resolution reversal and reinvestigation and
     diagnosis of the incident.
     The Incident Analyst initiates all required escalations.

You can see the details of this process in the following figure and table.

The Incident Resolution and Recovery workflow is illustrated in the following figure:


                                        Incident Resolution and Recovery process

Process ID  Procedure or Decision       Description                               Role
SO 2.4.1
SO 2.4.2    Review Incident             The Incident Analyst reviews              Incident Analyst
                                        the incident information for
SO 2.4.3                                the supplied resolution or
SO 2.4.4                                workaround.
SO 2.4.5
            Change/ Service Request     The Incident Analyst                      Incident Analyst
SO 2.4.6    required to Resolve?        determines whether the
                                        resolution provided needs to
                                        be implemented by using a
                                        Change or Service Request.

                                        If yes, go to SO 2.6.1 for the
                                        Incident Coordinator to
                                        determine how to resolve
                                        the Incident. If not, go to SO
                                        2.4.3 to determine whether
                                        the Analyst is entitled to
                                        implement the resolution.

            Analyst entitled to         The Incident Analyst must                 Incident Analyst
            implement resolution?       judge if he/she has the                   Incident Analyst
                                        permissions to implement
            Implement resolution        the resolution. If yes,
                                        continue with SO 2.4.4. If
                                        no, go to SO 2.4.7.

                                        The Incident Analyst tests
                                        the resolution and
                                        implements it in the
                                        production environment.

                                        Incident tasks can be
                                        created for resolution
                                        implementation if required.

            Errors occurred?            When there are errors                     Incident Analyst
            Escalation required?        during the implementation of
                                        a resolution, the Incident
                                        Analyst reverses the solution
                                        and the incident is returned
                                        to the investigation and
                                        diagnosis phase. If yes, go
                                        to SO 2.4.6. If no, continue
                                        with SO 2.5.1.

                                        Determine if escalation to                Incident Analyst
                                        the Incident Coordinator is
                                        required at this point in the
                                        resolution process. If yes, go
                                        to the Incident Escalation
                                        process. If no, go to SO
                                        2.3.3.


Process ID  Procedure or Decision       Description                    Role
SO 2.4.7    Reassign to other group
                                        When the Incident Analyst is   Incident Analyst
                                        not entitled to implement the
                                        solution, the analyst must
                                        reassign the incident to a
                                        support group or applicable
                                        vendor that can implement
                                        the solution.


1.9.5.5. Incident Review and Closure (process SO 2.5)

The Incident Review and Closure process includes many steps to verify the success of implemented solutions and to verify that
incidents are accurate and complete.
After a solution is implemented for an incident, the solution must be verified, typically by the group that implemented the
solution. If necessary, the user can be contacted to verify the solution. The resolving group closes the incident and notifies the
Service Desk to close the related interaction. When closing an incident, the likelihood of the incident recurring is determined and
Problem Candidate is selected accordingly.
You can see the details of this process in the following figure and table.
The Incident Review and Closure workflow is illustrated in the following figure:


                                        Incident Review and Closure process

Process ID  Procedure or Decision        Description                         Role
SO 2.5.1
SO 2.5.2    Review incident              The Incident Analyst reviews Incident Analyst
                                         the incident resolution
SO 2.5.3                                 description.
SO 2.5.4
            Verify and confirm           The Incident Analyst verifies       Incident Analyst
SO 2.5.5    Resolution                   that the resolution is correct
                                         and complete and confirms
SO 2.5.6                                 the resolution. If required,
SO 2.5.7                                 the Incident Analyst is
SO 2.5.8                                 entitled to contact the User
                                         (see SO 2.7.3) to validate the
                                         resolution.

            Incident solved?             Is the incident solved with         Incident Analyst
                                         the offered resolution? If
                                         yes, continue with SO 2.5.4.
                                         If no, go to SO 2.3.3.

            Is it a major Incident?      Major incident requires             Incident Analyst
                                         additional review at the
                                         stage. If it is a major
                                         incident, problem
                                         management activities may
                                         need to be undertaken to
                                         identify the root cause and
                                         take appropriate actions and
                                         plans to prevent future major
                                         incidents from occurring.

            Is it a possible Problem?    If the incident can be a            Incident Analyst
                                         possible problem, it is
                                         marked as possible problem
                                         and closed. Else the incident
                                         is closed without being
                                         marked as a possible
                                         problem.

            Submit Incident as possible  The Incident Analyst submits        Incident Analyst
            Problem                      the incident to Problem
                                         Management as a possible
                                         problem by checking the
                                         option to mark the Incident
                                         as a problem candidate.

            Close Incident               The Incident Analyst closes         Incident Analyst
                                         the incident and selects the
                                         applicable resolution code.

            Incident initiated by an     Was the incident initiated by       Incident Analyst
            Event?                       an event? If yes, then the
                                         event must be confirmed by
                                         using the event
                                         management process. If no,
                                         go to SO 2.5.8.


Process ID  Procedure or Decision          Description                    Role
SO 2.5.9                                                                  Incident Analyst
            Incident initiated through an  Was the incident initiated by
            Interaction?                   an interaction? If yes,
                                           continue with the Interaction
                                           Closure process. If no, then
                                           stop.


1.9.5.6. Incident Escalation (process SO 2.6)

When an Incident Analyst is unable to solve an assigned incident within the target time, the analyst escalates the incident to the
Incident Coordinator. The Incident Coordinator determines how the incident can best be resolved by consulting the Incident
Analyst and, if needed, other Incident Analysts. If an incident is severe (for example, designated as Priority 1), the appropriate IT
managers must be notified so that they can anticipate and prepare for an escalation.
Incidents are escalated when the Incident Investigation and Diagnosis process or Incident Resolution and Recovery process
exceeds SLA targets or if these targets are likely not to be met. If the steps to resolve an incident are taking too long or proving
too difficult, the Incident Coordinator determines the following:

     Whether an Incident Analyst can be given the necessary resources to solve the incident
     Whether a change needs to be implemented
     Whether a request for service is needed

When an incident is escalated, the escalation should continue up the management chain. Senior managers are notified of the
situation so that they can prepare to take any necessary actions, such as allocating additional resources or involving suppliers.
You can see the details of this process in the following figure and table.
The Incident Escalation workflow is illustrated in the following figure:


                                        Incident Escalation process

Process ID  Procedure or Decision         Description                     Role
SO 2.6.1
            Determine how to resolve      The Incident Coordinator        Incident Coordinator
SO 2.6.2    Incident                      gathers information from the
SO 2.6.3                                  Incident Analyst(s) about the
SO 2.6.4                                  status of the incident
SO 2.6.5                                  resolution and determines
                                          how the incident can best be
SO 2.6.6                                  resolved.
SO 2.6.7
                                          The Incident Coordinator
                                          verifies that the expected
                                          resolution time matches any
                                          agreed on level, such as that
                                          specified in an SLA.

            Problem Management            Is problem management           Incident Coordinator
            required?                     required to solve the
                                          incident? If yes, continue
            Escalate to Problem           with SO 2.6.3. If no, go to SO
            Change Management             2.6.4.
            required?
            Escalation required?          Go to SO 2.6.1 to determine Incident Coordinator
                                          how to resolve the Incident.
            Determine expected
            resolution time               Is a change is required to      Incident Coordinator
            Mark Incident for Escalation  solve the incident? If yes,
                                          continue with SO 2.6.5. If no,
                                          go to SO 2.6.11.

                                          Determine whether               Incident Coordinator
                                          escalation is required to the
                                          Incident Manager to review
                                          what action to take with the
                                          Change Request. If yes go to
                                          SO 2.6.7 to mark the
                                          Incident for escalation. If
                                          not, go to SO 2.6.9 to
                                          Register Emergency Change

                                          The Incident Manager            Incident Manager
                                          verifies that the expected
                                          resolution time meets SLA
                                          targets.

                                          Mark Incident for Escalation    Incident Coordinator
                                          The Incident Coordinator
                                          checks the Escalation
                                          checkbox in the incident
                                          record and marks the
                                          Incident for Escalation. A
                                          notification is sent to the
                                          Incident Manager informing
                                          him/her of escalation.


Process ID  Procedure or Decision        Description                     Role
SO 2.6.8
            Determine and execute        The Incident Manager            Incident Manager
SO 2.6.9    escalation actions           determines the actions to be
                                         performed to solve the
SO 2.6.10                                incident within target times
SO 2.6.11                                and designates escalation
SO 2.6.12                                personnel to contact in the
SO 2.6.13                                event of an escalation. This
                                         can include determining that
SO 2.6.14                                the Service Desk is required
                                         to send an information
                                         bulletin to the affected users
                                         and stakeholders.

            Register emergency change    The Incident Coordinator        Incident Coordinator
                                         registers an emergency
                                         change request and
                                         contacts the Change
                                         Manager to inform the
                                         manager about the request,
                                         thereby starting the
                                         Emergency Change
                                         Handling process.

            Emergency change needed? If yes, go to SO 2.6.9. If no, Incident Manager
                                               go to SO 2.6.1.

            Service Request required?    If yes, close the Incident. If Incident Coordinator
                                         not, go to SO 2.6.12.

            Reassignment required?       Is it necessary to reassign     Incident Coordinator
                                         the incident to a different
                                         support group with more
                                         knowledge (that is, a
                                         functional escalation)? If
                                         yes, continue with SO 2.6.14.
                                         If no, go to SO 2.6.13.

            Enable Incident Analysts to  The Incident Coordinator        Incident Coordinator
            solve incident               enables the Incident
                                         Analyst(s) to focus solely on
                                         the resolution of the incident
                                         and provides the Incident
                                         Analyst(s) with all means
                                         necessary to speed up the
                                         resolution. Go to SO 2.4.4.

            Incident Manager required?   Escalation may be required      Incident Coordinator
                                         for the Incident Manager to
                                         agree the appropriate
                                         assignment for the Incident.
                                         This may be required where
                                         there is a dispute over which
                                         group should take
                                         ownership of the Incident. If
                                         the Incident Manager must
                                         get involved, go to SO 2.6.15.
                                         If not, go to SO 2.6.16.


Process ID  Procedure or Decision         Description                   Role
SO 2.6.15   Mark Incident for Escalation
                                          The Incident Coordinator      Incident Coordinator
SO 2.6.16   Reassign incident             checks the Escalation
SO 2.6.17   Determine/ Agree              checkbox in the incident
            appropriate assignment        record and marks the
SO 2.6.18                                 Incident for Escalation. A
            Reassign incident             notification is sent to the
                                          Incident Manager informing
                                          him/her of escalation. Then
                                          go to SO 2.6.17.

                                          The Incident Coordinator      Incident Coordinator
                                          reassigns the incident to
                                          another 2nd-line or 3rd-line
                                          support group.

                                          The Incident Manager          Incident Manager
                                          reviews the Incident to
                                          determine the appropriate
                                          Assignment Group based on
                                          the skills/ knowledge or
                                          permissions required to
                                          resolve the Incident.

                                          The Incident Manager          Incident Manager
                                          reassigns the incident to
                                          another 2nd-line or 3rd-line
                                          support group.


1.9.5.7. SLA Monitoring (process SO 2.7)

Service level agreements (SLAs) contain standards for incident resolution performance. This process describes the activities to
monitor all interactions related to incidents from initialization to resolution. SLA Monitoring also determines whether time targets
for incident resolution are met, and indicates whether escalation is required to meet the target resolution date according to the
associated SLA. SLA Monitoring is an ongoing process performed by the Service Desk.
You can see the details of this process in the following figure and table.
The SLA Monitoring workflow is illustrated in the following figure:


                                        SLA Monitoring process

Process ID  Procedure or Decision         Description                      Role
SO 2.7.1
SO 2.7.2    Monitor SLA                   The Service Desk Agent           Service Desk Agent
SO 2.7.3                                  monitors the SLA.
SO 2.7.4
SO 2.7.5    SLA breached?                 Has the SLA target date/time     Service Desk Agent
SO 2.7.6                                  been exceeded for this
SO 2.7.7                                  interaction? If yes, go to SO
                                          2.7.10, and then start the
SO 2.7.8                                  Incident Escalation process.
                                          If no, go to SO 2.7.3.

            SLA breach within 1 hour      Does the interaction need to     Service Desk Agent
                                          be solved within 1 hour to
                                          reach the SLA target
                                          date/time? If yes, go to SO
                                          2.7.8. If no, go to SO 2.7.4.

            SLA breach within 4 hours?    Does the interaction need to     Service Desk Agent
                                          be solved within 4 hours to
                                          reach the SLA target
                                          date/time? If yes, go to SO
                                          2.7.7. If no, go to SO 2.7.5.

            SLA breach within 1 day?      Does the interaction need to     Service Desk Agent
                                          be solved within 1 day to
                                          reach the SLA target
                                          date/time? If yes, go to SO
                                          2.7.7. If no, go to SO 2.7.6.

            Related incident closed?      If yes, no further action is     Service Desk Agent
                                          required. If no, go to SO
                                          2.7.1.

            Request further action?       Review the Incident and          Service Desk Agent
                                          determine whether further
                                          action is required to ensure
                                          that it will be resolved within
                                          the SLA target date/time.

                                          If yes, go to SO 2.7.8 to work
                                          with the Incident
                                          Coordinators) to check the
                                          Incident will be resolved on
                                          time. If not, go to SO 2.7.1 to
                                          continue to monitor the SLA.

            Work with Incident            Contact the Incident             Service Desk Agent
            Coordinator(s) to see if      Coordinator with the related
            incident can still be solved  incident assigned to his/her
            on time                       group. Determine whether
                                          the group is able to solve the
                                          incident on time without
                                          further support.


Process ID  Procedure or Decision            Description                      Role
SO 2.7.9
            Will related incident be         If yes, the Incident             Service Desk Agent
SO 2.7.10   solved on time?                  Coordinator of the assigned
SO 2.7.11                                    group estimates that the
                                             related incident can still be
                                             solved on time, go to SO
                                             2.7.11. If no, go to SO 2.7.10,
                                             and then escalate the
                                             incident.

            Communicate SLA breach to        Identify which Users or user     Service Desk Agent
            affected Users                   groups are affected by the
                                             SLA breach. Send a
                                             communication bulletin to
                                             inform all affected Users.

            Communicate related              Identify which Users or user     Service Desk Agent
            incident status to all affected  groups are affected by the
            Users                            related incident. Send a
                                             communication bulletin to
                                             inform all affected Users of
                                             the incident status and
                                             expected resolution time.


1.9.5.8. OLA and UC Monitoring (process SO 2.8)

One measure of the successful resolution of incidents is the performance of the individual support groups and applicable
vendors. The performance of support groups is measured by targets set up within Operation Level Agreements (OLAs). The
performance of vendors is measured by targets set up in the Underpinning Contracts (UCs).
The Incident Coordinator monitors all incidents assigned to the support group and applicable vendors. Performance is tracked
until incidents are resolved or escalated to meet targeted agreement dates and times. The target date of an OLA and UC usually
depends on the priority and category of the incident. The Incident Coordinator can escalate an incident to the Incident Manager
if the target time has been or is about to be exceeded.
You can see the details of this process in the following figure and table.
The OLA and UC Monitoring workflow is illustrated in the following figure:


                                        OLA and UC Monitoring process

Process ID  Procedure or Decision        Description                      Role
SO 2.8.1
            Check status and progress    Check status and progress        Incident Coordinator
SO 2.8.2    of Incident resolution       of incident resolution. Verify
                                         that the incident will be
SO 2.8.3                                 resolved before the target
SO 2.8.4                                 date and time specified in
SO 2.8.5                                 applicable Operation Level
SO 2.8.6                                 Agreement (OLA) and
                                         Underpinning Contract (UC).
SO 2.8.7
            Assigned Incident Analyst    External circumstances (for      Incident Coordinator
SO 2.8.8    available?                   example, end of work shift,
SO 2.8.9                                 illness, or holiday) could
                                         cause an assigned Incident
                                         Analyst to become
                                         unavailable. If the Incident
                                         need to be assigned, SO
                                         2.8.3. If not, go to SO 2.8.4.

            Reassignment required?       If yes, go to SO 2.2.4. If no, Incident Coordinator
                                         go to SO 2.8.4.

            OLA or UC breached?          If yes, start the Incident       Incident Coordinator
                                         Escalation process (SO
                                         2.6.6). If no, go to SO 2.8.5.

            OLA/UC breach within 1       If yes, go to SO 2.8.6. If no, Incident Coordinator
            hour?                        go to SO 2.8.8.

            Get status update from       Contact the assigned             Incident Coordinator
            Incident Analyst and Vendor  Incident Analyst to receive a
            (if applicable)              status update of the
                                         incident. If the incident is
                                         reported to a vendor,
                                         contact the vendor for a
                                         status update.

            Will the incident be solved  The Incident Coordinator         Incident Coordinator
            on time?                     estimates whether or not the
                                         incident can still be resolved
                                         on time. If yes, go to SO
                                         2.8.1. If no, go to SO 2.6.6 to
                                         determine the expected
                                         resolution time.

            OLA/UC breach within 4       Does the incident need to be     Incident Coordinator
            hours?                       resolved within 4 hours to
                                         reach the OLA/UC target
                                         date/time? If yes, go to SO
                                         2.8.9. If no, go to SO 2.8.11.

            Get status update from       Contact the assigned             Incident Coordinator
            Incident Analyst and vendor  Incident Analyst to receive a
            (if applicable)              status update of the
                                         incident. If the incident is
                                         reported to a vendor,
                                         contact the vendor for a
                                         status update.


Process ID  Procedure or Decision       Description                     Role
SO 2.8.10   Take follow-up actions if                                   Incident Coordinator
            required                    The Incident Coordinator
SO 2.8.11                               determines whether follow-      Incident Coordinator
SO 2.8.12   OLA/UC breach within 1      up actions are required to      Incident Coordinator
            day?                        resolve the incident
            Incident closed?            according to the OLA/UC. If
                                        required, the Incident
                                        Coordinator performs the
                                        required actions.

                                        If yes, go to SO 2.8.9. If no,
                                        go to SO 2.8.12.

                                        If yes, no further action is
                                        required. If no, go to SO
                                        2.8.1.


1.9.5.9. Complaint Handling (process SO 2.9)

Complaint Handling is the process by which the Service Desk Manager handles complaints. The Complaint category is typically
used to indicate less than satisfactory service received by a user in the support or service delivery categories.
When the Service Desk Manager receives assigned incidents in the Incident or To Do queue, the manager accepts the incident.
The manager investigates the cause of the complaint by evaluating the relevant information and talking to the people involved.
The manager searches for an answer or solution to satisfy the user who filed the complaint, updates the incident with the agreed
on details, and then closes the incident. You can see the details of this process in the following figure and table.
The Complaint Handling workflow is illustrated in the following figure:


                                        Complaint Handling process

Process ID  Procedure or Decision        Description                     Role
SO 2.9.1
SO 2.9.2    Review complaint             The Service Desk Manager        Service Desk Manager
SO 2.9.3    information                  monitors the incident queue
                                         and reviews assigned
SO 2.9.4                                 incidents. The Service Desk
SO 2.9.5                                 Manager checks the
                                         contents of the complaint.
SO 2.9.6
SO 2.9.7    Accept complaint             The Service Desk Manager        Service Desk Manager
SO 2.9.8                                 accepts the incident to
                                         investigate the cause of the
                                         complaint.

            Investigate complaint cause  The Service Desk Manager        Service Desk Manager
                                         investigates the cause of the
                                         complaint by looking at the
                                         relevant information and
                                         talking to the people
                                         involved. The Service Desk
                                         Manager also searches for
                                         an answer or solution to
                                         satisfy the user who filed the
                                         complaint.

            Assess/ Relate associated    The Service Desk Manager        Service Desk Manager
            records                      assesses the associated
                                         records and relates them to
                                         existing records if
                                         necessary.

            Escalate to company          The Service Desk Manager        Service Desk Manager
            complaints process?          assesses the complaint and
                                         determines whether it is
                                         within the scope of the
                                         Company Complaints
                                         Process. If escalation is
                                         necessary, go to SO 2.9.6. If
                                         not, go to SO 2.9.10.

            Company complaints           The Service Desk Manager        Service Desk Manager
            process                      escalates to have the
                                         complaint registered in the
                                         Company Complaints
                                         process and updates the
                                         Incident record.

            Monitor company complain     The Service Desk Manager        Service Desk Manager
            record                       monitors the complaint
                                         through the company
                                         complaint process.

            Complaint resolved?          If the complaint is resolved,   Service Desk Manager
                                         continue to SO 2.9.9. If not,
                                         go to SO 2.9.7.


Process ID  Procedure or Decision          Description                      Role
SO 2.9.9    Action required?
                                           If the complaint has been        Service Desk Manager
SO 2.9.10   Take action to conciliate the  resolved but further action
SO 2.9.11   user                           must be taken, go to SO
                                           2.9.10. If no further action is
            Update and close complaint     required, go to SO 2.9.11.

                                           The Service Desk Manager         Service Desk Manager
                                           contacts the user to solve
                                           the user's issue and tries to
                                           reach an agreement.

                                           The Service Desk Manager         Service Desk Manager
                                           updates the incident with the
                                           agreed on details and closes
                                           the incident.
````
