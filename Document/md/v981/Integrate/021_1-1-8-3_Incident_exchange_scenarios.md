---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.1.8.3 .. 1.1.8.5
printed_pages: 552-578
---

# 1.1.8.3 Incident exchange scenarios

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.8.3. Incident exchange scenarios

This section describes various scenarios that are supported by Case Exchange in the Incident
Management module. The following diagram shows a typical Case Exchange environment.

The description of the following scenarios uses the following simplifications to keep the
scenarios generic:

     These scenarios refer to an Incident record in the target system as an "Incident".
     However, an Incident in Service Manager may correspond to an Incident, a Work Order, a
     Service Request, or something else in the connected system.
     The terminology used for the described scenarios is limited to the domain of Service
     Manager.

The following scenario diagrams in this section contain the following elements:

User actions:

                Actions that move a record from one stage to another. For example, open,
assign, solve, close, and so on.

                 Updates that don't move a record from one stage to another. For example, an
update to description or attachments.

Background system actions:

                      Updates transferred to the connected systems.

                       Always sent as soon data is exchanged (both directions).

Scenario 1

The Line of Business registers and assigns an Incident to the Central IT, who then solves the
Incident.


Scenario description

In this scenario, an end user creates an Incident. The Line of Business registers and assigns
the Incident to the Central IT. The Central IT solves the Incident.

Action                                  Description
1 New Incident
2 Assignment                            An end user calls the Line of Business to
                                        create a new Incident.
Updates
                                        The Line of Business assigns the Incident to
3 Solved                                the Central IT. With this assignment the
4 Closed                                Incident data is exchanged from the Line of
                                        Business to the Central IT.

                                        Updates can happen on either side. Case
                                        Exchange transfers the update to the other
                                        side when needed.

                                        The Central IT solves the Incident.

                                        The Line of Business confirms the solution
                                        with the end user and closes the Incident.

Background

Action                                  Description
Updates
                                        Updates in any of the systems are
Acknowledge                             transferred to the other side.

                                        Each time data is transferred, an
                                        Acknowledgment has to happen.

Scenario 2

The Line of Business registers and assigns an Incident to the Central IT, who then rejects the
Incident.


Scenario description

In this scenario, an end user creates an Incident. The Line of Business registers and assigns
the Incident to the Central IT. The Central IT rejects the Incident.

Action                                  Description
1 New Incident
2 Assignment                            An end user calls the Line of Business to
3 Reject                                create a new Incident.

                                        The Line of Business assigns the Incident to
                                        the Central IT.

                                        The Central IT sends a Reject update,
                                        which indicates the Incident is rejected
                                        (external Incident status).

                                        The responsibility is back to the Line of
                                        Business, who then solves the Incident
                                        internally.

 Updates                                Updates can happen on either side. Case
                                        Exchange transfers the update to the other
 4 Closed                               side when needed.
Background
                                        The Line of Business confirms the solution
 Action                                 with the end user and closes the Incident.
 Updates
 Acknowledge                            Description

                                        Updates in any of the systems are
                                        transferred to the other side.

                                        Each time data is transferred, an
                                        Acknowledgment has to happen.


Scenario 3

The Line of Business registers an Incident and the Central IT solves the Incident. The solution
doesn't satisfy the customer. The Central IT must solve the Incident again.

Scenario description
In this scenario, an end user creates an Incident. The Line of Business registers and assigns
the Incident to the Central IT. The Central IT solves the Incident. The Line of Business confirms
the solution with the end user, but the end user is not satisfied. Therefore, the Incident is
reassigned (re-opened or re-created) to the Central IT.

 Action                                                                                          Service Manager 9.81
 1 New Incident
 2 Assignment                           Description
 Updates
 3 Solved                               An end user calls the Line of Business to
 4 Resolve                              create a new Incident.
 5 Not satisfied
 6 Not solved                           The Line of Business assigns the Incident to
                                        the Central IT.
 7 Solved
 8 Closed                               The Central IT analyzes and updates the
Background                              Incident. Case Exchange transfers the
                                        update to the other side when needed.
This PDF was generated on May 23, 2026
                                        The Central IT solves the Incident.

                                        The Line of Business confirms the solution
                                        with the end user for the closure of the
                                        Incident.

                                        The end user is not satisfied. The Incident
                                        needs to be re-opened or re-created.

                                        The Line of Business reassigns the Incident
                                        to the Central IT. In this case, Case
                                        Exchange handles the Incident as follows:

                                             In case the Incident is Closed in the
                                             Central IT:
                                             If the Central IT doesn't support the
                                             re-open of an Incident, Case
                                             Exchange recreates the Incident.
                                             If the Central IT supports the re-open
                                             of a Incident, Case Exchange sets the
                                             Incident status to Work in progress.
                                             In case the Incident is just Resolved in
                                             the Central IT, Case Exchange sets the
                                             status to Work in progress.

                                        The Central IT solves the Incident.

                                        The Line of Business confirms the solution
                                        with the end user and closes the Incident.

                                                                                                                      Page 556 of 1727

Action                                  Description

Updates                                 Updates in any of the systems are
                                        transferred to the other side.

Acknowledge                             Each time data is transferred, an
                                        Acknowledgment has to happen.

Scenario 4

The Line of Business registers and assigns an Incident to the Central IT. However, the Incident
is no longer relevant for a customer (cancel and withdrawal).

Scenario description

In this scenario, an end user creates an Incident. The Line of Business registers and assigns
the Incident to the Central IT. However, the end user indicates that the issue no longer exists
and cancels the Incident.

Action                                  Description
1 New Incident
2 Assignment                            An end user calls the Line of Business to
Updates                                 create a new Incident.

3 Cancel                                The Line of Business assigns the Incident to
4 Cancelled                             the Central IT.

5 Closed                                The Central IT analyzes and updates the
                                        Incident. Case Exchange transfers the
                                        update to the other side when needed.

                                        The end user cancels the Incident.

                                        The Line of Business cancels the Incident.
                                        Once cancelled, the Incident is directly
                                        closed.

                                        The Line of Business closes the Incident.


Background

Action                                  Description

Updates                                 Updates in any of the systems are
                                        transferred to the other side.

Acknowledge                             Each time data is transferred, an
                                        Acknowledgment has to happen.

Scenario 5

The Line of Business registers and assigns an Incident to the Central IT. The Central IT asks for
additional information (Pending Customer).

Scenario description

In this scenario, an end user creates an Incident. The Line of Business registers and assign the
Incident to the Central IT. The Central IT requests for missing information and sets the status to
Pending Customer. The Incident ownership is back to the Line of Business, who must collect
the missing information.

 Action                                                                                          Service Manager 9.81
 1 New Incident
 2 Assignment                           Description
 Updates
                                        An end user calls the Line of Business to
 3 Ask info                             create a new Incident.

 4 Ask info                             The Line of Business assigns the Incident to
 5 Provide info                         the Central IT.
 6 Submit info
                                        The Central IT analyzes and updates the
 Updates                                Incident. Case Exchange transfers the
                                        update to the other side when needed.
 7 Solved
 8 Closed                               The Central IT assigns the Incident back to
Background                              the Line of Business to request for
 Action                                 additional information. The Incident status
 Updates                                in the Central IT's system is Pending
 Acknowledge                            customer.

This PDF was generated on May 23, 2026  The Line of Business receives the update
                                        and contacts the end user.

                                        The end user provides the information.

                                        The Line of Business updates the Incident,
                                        and then re-assigns the Incident to the
                                        Central IT.

                                        Updates can happen on either side. Case
                                        Exchange transfers the update to the other
                                        side when needed.

                                        The Central IT solves the Incident.

                                        Service Desk confirms the solution with the
                                        end user and closes the Incident.

                                        Description

                                        Updates in any of the systems are
                                        transferred to the other side.

                                        Each time data is transferred, an
                                        Acknowledgment has to happen.

                                                                                                                      Page 559 of 1727

Scenario 6

The Line of Business registers an Incident, which is then assigned to the Central IT. The
Central IT then assigns the Incident to Service Provider 1.

Scenario description

In this scenario, an end user creates an Incident. The Line of Business registers and assigns
the Incident to the Central IT. The Central IT then assigns the record to Service Provider 1.
Service Provider 1 solves the record.

Action                                  Description
1 New Incident
2 Assignment                            An end user calls the Line of Business to
3 Assignment                            create a new Incident.
Updates
                                        The Line of Business assigns the Incident to
4 Solved                                the Central IT.

                                        The Central IT assigns the Incident to
                                        Service Provider 1.

                                        Updates can happen on any side. Case
                                        Exchange transfers the update to other
                                        sides when needed.

                                        Service Provider 1 solves the Incident.
                                        The responsibility is back to the Central IT,
                                        who reviews the resolution.

 5 Solved                               The Central IT passes the Incident back to
 6 Closed                               the Line of Business.
Background
                                        The Line of Business confirms the solution
                                        with the end user and closes the Incident.


Action                                  Description

Updates                                 Updates in any of the systems are
                                        transferred to the other side.

Acknowledge                             Each time data is transferred, an
                                        Acknowledgment has to happen.

Scenario 7

The Line of Business registers and assigns an Incident to the Central IT. The Central IT then
assigns the Incident to Service Provider 1. However, the Incident is no longer relevant for
customer.

Scenario description

In this scenario, an end user creates an Incident. The Line of Business registers and assigns
the Incident to the Central IT. The Central IT then assigns the Incident to Service Provider 1.
However, the end user indicates that the issue no longer exists and cancels the Incident.


Action                                  Description
1 New Incident
2 Assignment                            A user calls the Line of Business to create a
3 Assignment                            new Incident.
Updates
                                        The Line of Business assigns the Incident to
4 Cancel                                the Central IT.
5 Cancelled
6 Cancelled                             The Central IT assigns the Incident to
7 Closed                                Service Provider 1.

                                        Updates can happen on any side. Case
                                        Exchange transfers the update to other
                                        sides when needed.

                                        The end user cancels the Incident.

                                        The Line of Business sends the cancellation
                                        to the Central IT.

                                        The Central IT sends the cancellation to
                                        Service Provider 1.

                                        The Line of Business closes the Incident.

Background

Action                                  Description
Updates
                                        Updates in any of the systems are
Acknowledge                             transferred to the other side.

                                        Each time data is transferred, an
                                        Acknowledgment has to happen.

Scenario 8

The Line of Business registers and assigns an Incident to the Central IT. The Central IT assigns
the Incident to the Service Provider 1. Service Provider 1 solves the Incident. The solution
doesn't satisfy the customer, Service Provider 1 must solve the Incident again.


Scenario description
In this scenario, an end user creates an Incident. The Line of Business registers and assigns
the Incident to the Central IT. The Central IT then assigns the Incident to Service Provider 1.
Service Provider 1 solves the Incident and the solution is passed to the Line of Business. The
Line of Business confirms the solution with the customer, but the customer is not satisfied.
Therefore, the Incident is reassigned (re-opened or re-created) to the Service Provider 1.

 Action                                                                                          Service Manager 9.81
 1 New Incident
 2 Assignment                           Description
 3 Assignment
 Updates                                An end user calls the Line of Business to
                                        create a new Incident.
 4, 5 Solved
                                        The Line of Business assigns the Incident to
 6 Resolve                              the Central IT.

 7 Not satisfied                        The Central IT assigns the Incident to
 8, 9 Not solved                        Service Provider 1.
 10, 11 Solved
                                        Updates can happen on any side. Case
 12 Closed                              Exchange transfers the update to other
Background                              sides when needed.

 Action                                 Service Provider 1 solves the Incident, and
 Updates                                the solution is passed to the Line of
 Acknowledge                            Business.

This PDF was generated on May 23, 2026  The Line of Business confirms the solution
                                        with the end user for the closure of the
                                        Incident.

                                        The end user is not satisfied.

                                        The Incident is reassigned to Service
                                        Provider 1.

                                        Service Provider 1 solves the Incident, and
                                        the solution is passed to the Line of
                                        Business.

                                        The Line of Business confirms the solution
                                        with the end user and closes the Incident.

                                        Description

                                        Updates in any of the systems are
                                        transferred to the other side.

                                        Each time data is transferred, an
                                        Acknowledgment has to happen.

                                                                                                                      Page 564 of 1727

Scenario 9

The Line of Business registers and assigns an Incident to the Central IT. The Central IT assigns
the Incident to Service Provider 1. Service Provider 1 asks for additional information (Pending
Customer).

Scenario description
In this scenario, an end user creates an Incident. The Line of Business registers and assigns
the Incident to the Central IT. The Central IT assigns the Incident to Service Provider 1. Service
Provider 1 requests for missing information and sets the status to Pending Customer. The
Incident ownership is then back to the Central IT and then back to the Line of Business, who
must collect the missing information.

 Action                                                                                          Service Manager 9.81
 1 New Incident
 2 Assignment                           Description
 3 Assignment
 4, 5 Ask info                          An end user calls the Line of Business to
                                        create a new Incident.
 6 Ask info
 7 Provide info                         The Line of Business assigns the Incident to
 8, 9 Submit info                       the Central IT.
 Updates
                                        The Central IT assigns the Incident to
 10, 11 Solved                          Service Provider 1.

 12 Closed                              The Service Provider 1 assigns the Incident
Background                              back to the Central IT to request for
                                        additional information. The Incident is
 Action                                 passed back to the Line of Business.
 Updates
 Acknowledge                            The Line of Business receives the update
                                        and contacts the end user.
This PDF was generated on May 23, 2026
                                        The end user provides the information.

                                        The Incident is updated and re-assigned to
                                        Service Provider 1.

                                        Updates can happen on any side. Case
                                        Exchange transfers the update to other
                                        sides when needed.

                                        Service Provider 1 solves the Incident, and
                                        the solution is passed back to the Line of
                                        Business.

                                        The Line of Business confirms the solution
                                        with the end user and closes the Incident.

                                        Description

                                        Updates in any of the systems are
                                        transferred to the other side.

                                        Each time data is transferred, an
                                        Acknowledgment has to happen.

                                                                                                                      Page 566 of 1727

Scenario 10

The Line of Business registers and assigns an Incident to the Central IT. The Central IT should
assign the Incident to Service Provider 2, but incorrectly assigns the Incident to Service
Provider 1.

Scenario description
In this scenario, an end user creates an Incident. The Line of Business registers and assigns
the Incident to the Central IT. The Central IT incorrectly assigns the Incident to Service
Provider 1, who is not responsible for the Incident and then rejects the Incident. The Central IT
then assigns the Incident to Service Provider 2.


Action                                  Description
1 New Incident
2 Assignment                            A user calls the Line of Business to create a
3 Assignment                            new Incident.
4 Reject
                                        The Line of Business assigns the Incident to
                                        the Central IT.

                                        The Central IT assigns the Incident to
                                        Service Provider 1.

                                        Service Provider 1 rejects the Incident.
                                        The Incident ownership is back to the
                                        Central IT, who reviews the update from
                                        Service Provider 1.

5 Assignment                            The Central IT assigns the Incident to
6,7 Solved                              Service Provider 2.
Updates
8 Closed                                Service Provider 2 solves the Incident, and
                                        the solution is passed to the Line of
                                        Business.

                                        Updates can happen on either side. Case
                                        Exchange transfers the update to the other
                                        side when needed.

                                        Line of Business confirms the solution with
                                        the end user and closes the Incident.

Background

Action                                  Description
Updates
                                        Updates in any of the systems are
Acknowledge                             transferred to the other side.

                                        Each time data is transferred, an
                                        Acknowledgment has to happen.

Scenario 11

The Line of Business registers and assigns an Incident to the Central IT. The Central IT assigns
the Incident to Service Provider 1. Service Provider 1 provides an unsatisfactory solution. The


Central IT then assigns the Incident to Service Provider 2.

Scenario description

In this scenario, an end user creates an Incident. The Line of Business registers and assigns
the Incident to the Central IT. The Central IT assigns the Incident to Service Provider 1, who
then provides a solution that doesn't satisfy the end user. The Central IT then assigns the
Incident to Service Provider 2.

 Action                                                                                          Service Manager 9.81
 1 New Incident
 2 Assignment                           Description
 3 Assignment
 Updates                                A user calls the Line of Business to create a
                                        new Incident.
 4,5 Solve
                                        The Line of Business assigns the Incident to
 6 Resolve                              the Central IT.

 7 Not satisfied                        The Central IT assigns the Incident to
 8,9 Assignment                         Service Provider 1.
 10,11 Solved
                                        Updates can happen on any side. Case
 12 Closed                              Exchange transfers the update to other
Background                              sides when needed.

 Action                                 Service Provider 1 solves the Incident, and
 Updates                                the solution is passed to the Line of
 Acknowledge                            Business.

This PDF was generated on May 23, 2026  The Line of Business confirms the solution
                                        with the end user for the closure of the
                                        Incident.

                                        The end user is not satisfied.

                                        The Incident is assigned to Service Provider
                                        2.

                                        Service Provider 2 solves the Incident, and
                                        the solution is passed to the Line of
                                        Business.

                                        The Line of Business confirms the solution
                                        with the end user and closes the Incident.

                                        Description

                                        Updates in any of the systems are
                                        transferred to the other side.

                                        Each time data is transferred, an
                                        Acknowledgment has to happen.

                                                                                                                      Page 570 of 1727

Scenario 12

The Central IT detects and solves an Incident, and sends the Incident to the Line of Business.

Scenario description

In this scenario, the Central IT creates and solves an Incident, which affects the Line of
Business. The Central IT sends the Incident to the Lind of Business for informational purposes.
The Line of Business confirms the resolution of the Incident.

Action                                  Description
1 New Incident
2 Solved                                The Central IT creates a new Incident and
                                        forward the Incident to the Line of Business.
3 Closed
                                        The Central IT solves the Incident and
                                        sends a Solved update to the Line of
                                        Business.

                                        Service Desk confirms the solution to close
                                        the Incident.

Background

Action                                  Description
Updates
                                        Updates in any of the systems are
Acknowledge                             transferred to the other side.

                                        Each time data is transferred, an
                                        Acknowledgment has to happen.

Scenario 13

The Central IT creates an Incident that must be solved by the Line of Business.


Scenario description

In this scenario, the Central IT creates an Incident, which has to be solved by the Line of
Business.

Action                                  Description
1 New Incident
Updates                                 The Central IT creates a new Incident and
2 Solved                                assigns the Incident to the Line of Business.

                                        Updates are transferred between both
                                        systems.

                                        The Line of Business solves the Incident.

Background

Action                                  Description
Updates
                                        Updates in any of the systems are
Acknowledge                             transferred to the other side.

                                        Each time data is transferred, an
                                        Acknowledgment has to happen.

Scenario 14

Two Line of Business systems are connected to the Central IT.


Scenario description
In this scenario, two Line of Business systems connect to the Central IT. The actions in the
above scenarios (for example, pending customer, reject, customer dissatisfaction, and so on)
are still valid.


1.1.8.4. Common user tasks

This section introduces the common user tasks that apply to the Incident Management module
in the Case Exchange integration:

Update an incident

When Service Manager owns an Incident record, you can directly make any update you want.
The configuration of the Case Exchange integration determines whether to transfer the
update to the endpoint.

When the endpoint system owns a record, the Incident record isn't editable in Service
Manager. However, you can still add additional information to the record, and Case Exchange
can transfer the information to the record in the endpoint system. To do this, follow these
steps:

   1. Open the Incident record.
   2. Click the Activities tab.
   3. Choose an appropriate value in the Update type field, and then enter some information in

     the Update field.
   4. Make sure the Take back control checkbox isn't selected.
   5. Click Finish.

Case Exchange then transfers the information to the record in the endpoint. In Service
Manager, you can view the information in the Journal Updates field.

Take back an incident

When the endpoint system owns a record, the related Incident record isn't editable in Service
Manager. In case the endpoint system doesn't respond or something unforeseen happens, you
may want to take back the ownership of the record. To take back the ownership of an Incident
record, follow these steps:

   1. Open the Incident record.
   2. Click the Activities tab.
   3. Choose an appropriate value in the Update type field, and then enter some information in

     the Update field.
   4. Select the Take back control checkbox.
   5. Click Next.

The ownership of the record then returns to Service Manager.

Check activity logs of an Incident record

You can view the log of the activities that occurred to an Incident record in two sections:

     The Activity Logs tab: This tab displays the log of all the activities that occurred to the
     Incident record, including the Case Exchange tasks.


     The Case Exchange tab: This tab only displays the log of all the Case Exchange tasks.
     This section is available only when a Case Exchange integration instance is active and the
     Incident record has a Case Exchange task.

     For more information about the Case Exchange tab, see Audit and logging.

To check the activity log of an Incident record, follow these steps:

   1. Click Incident Management > Search Incidents.
   2. Use search or advanced search to find one or more records.
   3. Click the Activity Logs tab and check the activity log.

To check the log of Case Exchange tasks, follow these steps:

   1. Click Incident Management > Search Incidents.
   2. Use search or advanced search to find one or more records.
   3. Click the Case Exchange tab, expand the Log subsection, and then check the log of the

     Case Exchange tasks.

Restart an unsuccessful task

Once a Case Exchange task occurs to an Incident record, the Incident record has a Case
Exchange section that displays the history of all Case Exchange tasks. You can restart an
unsuccessful Case Exchange task from the Case Exchange section. To do this, follow these
steps:

            Note

           If you want to restart an unsuccessful Case Exchange task of an Incident record,
           you must have the Update right on that Incident record.

   1. Click Incident Management > Search Incidents.
   2. Use search or advanced search to find one or more records.
   3. Select the Incident record.
   4. Expand the Case Exchange section, and then expand Log.
   5. Click the link on the date and time link of the unsuccessful Case Exchange task. The

     Integration Task Log page opens.
   6. Click the View button after the Task ID field. The Integration Failover Task Queue page

     opens.
   7. Click Run Now.


1.1.8.5. System administrator tasks

This section introduces the system administrator tasks in the Case Exchange integration:

Review log file

The standard Service Manager log file contains detailed information about the actions of a
Case Exchange integration instance.
When you create the Case Exchange integration instance, you can define the following settings
for the Service Manager log file:

     Log Level: Level of diagnostic information that the Service Manager server logs to the log
     file directory.
     Log File Directory: The location where log files will be stored. If you don't configure this
     option, the default log for this integration instance is <Server home
     directory>/logs/sm.log .

For more information, see Integration Instance Information fields.

Handle long-running tasks

Follow these steps to identify a "long-running" task:

   1. Sign in to Service Manager as a system administrator.
   2. Click Tailoring > Integration Manager.
   3. Click Log, set the Status field to In Progress, and then click Filter.

If a task remains in the In Progress status for a long time, then this task is a "long-running"
task.
Follow these steps to handle a "long-running" task:

   1. Sign in to Service Manager as a system administrator.
   2. Click Tailoring > Integration Manager.
   3. Select the integration instance to which the "long-running" task belongs, and then click

     Disable.
   4. Click Miscellaneous > System Status, and then wait until the scheduler for the

     integration instance disappears.

                   Note

                You need to click the Refresh Display button to see the latest system status.


5. Go back to Integration Manager, select the corresponding integration instance, and then
  click Task.

6. Open the "long-running" task.
7. Perform one of the following actions according to your needs:

       • Click the Merge button and then manipulate the data in the task.
         This action only applies to the outbound tasks.

       • Select the Expired checkbox.
         In this way, the task will not be processed.

       • Click the Delete button to delete the task.
         In this way, you may have to ask the integration partner to resend the record. Be
         careful when you delete a task, this action may result in data loss.
````
