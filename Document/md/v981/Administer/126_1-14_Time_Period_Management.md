---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.14 .. 1.14.5
printed_pages: 3179-3209
---

# 1.14 Time Period Management

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.14. Time Period Management

You can use Time Period Management to manage time period definitions for your
organization so that end users can see how their activities will be affected during
different time periods. A time period definition is a set of settings that defines a type
of time windows based on a set of recurrence rules, including its category, current
phase (based on a pre-configured workflow), approval status, scope, assignment
group, owner, affected services, affected departments, and affected locations. You
can define Local, Regional, or Global time periods that apply to a specific set of or all
locations (countries or regions) in your organization; you can further define which
departments, business services, environment type (for example, production or test)
the time periods apply to. In addition, you can define the scope of each time period to
indicate whether it will cause performance degradation or service outage to end
users or it will have no impact on end user's activities.

If integrated with another module in Service Manager, Time Period Management will
enable you to directly view time periods from that module. For example, if integrated
with Change Management, time period definitions will enable users to view time
periods and changes in a Calendar widget and view time periods and changes in the
context of a selected change. This is helpful for change planning.

            Note

           If you disable the Service Manager Calendar, Time Period Management is
           disabled simultaneously.

Related topics

Time Period Management concepts
Time Period Management process
Time period workflow
Time period occurrences
Time period recurrence rules
Time period security areas and roles
Working with time periods
Time period configuration tasks


1.14.1. Time Period Management concepts

The following table lists the concepts used in Time Period Management.

Concept                                                                                         Service Manager 9.81
Time Period Definition
Time Period Category                    Description

Time Period Rule                        A set of settings that defines a type of
Time Period Occurrence                  time period, including its category,
                                        current phase (based on a pre-
                                        configured workflow), approval status,
                                        scope, owning group, owner, affected
                                        services, affected departments and
                                        locations, and so on.

                                        Time period categories are templates
                                        for creating different kinds of time
                                        period definitions. Each time period
                                        category is associated with a workflow
                                        that defines a life cycle for time
                                        periods. When creating a new time
                                        period, users are prompted to select a
                                        category from a list. The list of
                                        categories are grouped by type so that
                                        users can easily find the one they
                                        want. Category grouping is defined in
                                        Time Period Settings.

                                        A rule is the central element in a time
                                        period to create time period
                                        occurrences. It reflects the recurrence
                                        of future start and end times of time
                                        period occurrences, and stores all the
                                        recurrence patterns.

                                        An occurrence is the real time (start
                                        and end) when a time period window
                                        happens. Each occurrence contains a
                                        start and end date/time. A time period
                                        definition can have many occurrences.

 Concept                                                                                        Service Manager 9.81
 Time Period Workflow
 Time Period Approval                   Description

 Time Period Notification               A time period workflow defines a life
 Time Period Security Area and Role     cycle for time periods. Each workflow
                                        is associated with a time period
Related topics                          category. Out-of-the-box, the
                                        Timeperiod workflow includes four
                                        phases: Planning, Approval, Published,
                                        and Retired.

                                        Administrators define approvals
                                        required for time periods using the
                                        Approval Definition utility. When the
                                        time period creator submits it for
                                        approval, the time period enters the
                                        Approval phase and goes through the
                                        pre-configured approvals. The Time
                                        Period Management module uses
                                        assignment groups and operators as
                                        approvers.

                                        For time period approvals, standard
                                        approval notifications are defined in the
                                        timeperiodDefinition object record
                                        (Tailoring > Document Engine >
                                        Objects). Notifications can be
                                        automatically triggered and sent to
                                        relevant approvers or owners based on
                                        configured conditions.

                                        The Time Period Management module
                                        uses security areas and roles to control
                                        user access to the module. By default,
                                        there are two areas (Timeperiod and
                                        Timeperiod Configuration), and four
                                        roles (Timeperiod Administrator,
                                        Timeperiod Analyst, Timeperiod
                                        Approver, and Timeperiod Manager).


Time Period Management
Time Period Management process
Time period workflow
Time period occurrences
Time period recurrence rules
Time period security areas and roles


1.14.2. Time Period Management process

The following is an sample process for Time Period Management:

   1. A System Administrator configures time period global settings.
   2. A Time Period Administrator configures time period categories, workflows, and

     approvals.
   3. A Time Period Analyst creates the following time period definitions:

        1. Creates the rules.
        2. Sets the ownership.
        3. Sets the affected services, locations, and departments.
        4. Checks the time windows.
        5. Submits the time periods for approval.
   4. An approver (or an approval delegate) approves the time period definitions.
     Once approved, the time periods are automatically published.
   5. A Time Period Administrator/Manager updates time period categories and types.
   6. An owner updates, maintains, or retire the time period definitions assigned to the
     owner.
   7. A Time Period Administrator/Manager unretires time period definitions if needed.

Related topics

Time Period Management
Time Period Management concepts
Time period workflow
Time period occurrences
Time period recurrence rules
Time period security areas and roles


1.14.3. Time period workflow

Each time period has a workflow, which is defined in the time period category. Out-
of-the-box, a workflow (named Timeperiod) is available, which includes four phases.
This workflow drives the creation, approval, publication, and retirement of time period
definitions including their occurrences.

            Note

           You can create your own workflows if needed.

To view the name of a time period's workflow, open the time period's category record
(Time Period Management > Configuration > Time Period Categories), and then
locate the Workflow field.
To access a time period workflow, navigate to Time Period Management >
Configuration > Workflows.

Phases

The following table describes each phase in the Timeperiod workflow.


Phase                                   Description              Notes
Planning
                                        Planning a time period
Approval
                                             Create the rule
                                             Specify the
                                             ownership
                                             Specify the
                                             impacted services,
                                             locations, or
                                             departments
                                             Check the time
                                             windows

                                        Approve the time period  An automatic transition is
                                        based on the configured  configured from the
                                        approval rules.          Approval phase to each
                                                                 of these
                                                                 phases: Planning, and
                                                                 Published.

                                                                 The transition triggers
                                                                 are as follows:

                                                                      From Approval to
                                                                      Planning:

                                                                      ( Expression:
                                                                      approval.status in
                                                                      $L.file="denied" )

                                                                      From Approval to
                                                                      Published:

                                                                      ( Expression:
                                                                      approval.status in
                                                                      $L.file="approved"
                                                                      )


Phase                                   Description                 Notes

Published                               The time period, the
                                        rules and occurrences
                                        are displayed in read-
                                        only. Some occurrences
                                        can be manually
                                        canceled. In this phase
                                        the time period is
                                        approved and officially
                                        published.

Retired                                 The time period is retired
                                        and the record is inactive
                                        (closed).

Actions and activities in each phase

The following table summarizes the actions and activities available or allowed in each
phase of the workflow: Planning (P1), Approval (P2), Published (P3), and Retired (P4).
A cross mark indicates the item is available or allowed.


Item    Descriptio P1                   Button  P3  P4

        n                                   P2
                                            x
OK      Saves the x                             x   x
                                            x
        record and
                                            x
        exits.

Cancel  Exits the x                             x   x
        record
        without
        saving.

Save    Saves the x                             x

        record.

Submit for Moves the x
Approval record to

               the
               Approval
               phase.

Retire  Moves the x                             x
        record to
        the Retired
        phase and
        deletes all
        occurrenc
        es.


Item   Descriptio P1                    P2  P3  P4

       n

Change Changes x                        x   x   x

Time Zone the time

       zone to

       display

       date/time

       values

       from the

       user's

       time zone

       to a

       different

       one.

Apply  Applies a x

Template time

       period

       template.

Submit for Moves the                        x

Re-    record

planning back to

       the

       Planning

       phase.


                                        Menu Option (More >)

Item      Descriptio P1                 P2                    P3  P4

          n

Set       Calls the x                   x                     x

Reminder out-of-

          the-box

          reminder

          feature.

Copy      Copies the x                  x                     x   x

          record.

Change    Changes x
Type /    the
Category  category
          and type
          of the
          current
          record.
          Works
          only in the
          first
          phase.

Create    Creates a x                   x                     x

Template new time

from      period

Record    template

          from the

          record.

Notify    Sends a x                     x                     x

          notificatio

          n.


Item  Descriptio P1                     P2  P3  P4

      n

Approval > Approve:                     x

Approve/D Approves

eny/Retrac the record.

t     Once

      approved,

      the

      record's

      approval

      status

      changes

      to

      approved,

      and the

      record

      automatic

      ally moves

      to the

      Published

      phase.

      Deny:
      Denies the
      record.
      Once
      denied,
      the
      record's
      approval
      status
      changes
      to denied,
      and the
      record
      automatic
      ally
      returns to
      the


Item  Descriptio P1                     P2  P3  P4

      n

      Planning
      phase.

      Retract:
      Retracts a
      denial of
      the record.
      Once
      retracted,
      the record
      moves
      back to
      pending
      approval
      status.

Unretire Moves the                              x

      record to

      the first

      phase and

      activates it

      again.


Item        Descriptio P1                  User Action  P3  P4

            n                                    P2
                                                 x
View rules  Allows                                      x
            users to                             x
            view the                             x
            existing
            rule(s) of
            the record.

Create /    Allows                      x
Modify
rules       users to

            create

            new rules

            and

            modify the

            existing

            rule(s).

Filter      Allows                      x               x
                                                        x
activities users to

            filter the

            activities

            of the

            record.

Filter      Allows                      x

occurrenc users to

es          filter the

            occurrenc

            es of the

            record.


Item  Descriptio P1                     P2  P3  P4

      n

Deactivate Allows                           x

a single users to

occurrenc deactivate

e     one single

      occurrenc

      e, when

      the date is

      no longer

      required.

                                           System Background Activity      Service Manager 9.81

Item        Descriptio P1                  P2                          P3      P4
                                                                               x
            n
                                                                               x
Write       As soon as x                   x                           x

activities activities

            are

            created.

Update      Updates x                                                  x

occurrenc occurrenc

es          es

            according

            to the

            defined

            rules.

Set         Set the                     x

create/upd created by

ate fields / updated

            by and

            related

            time

            stamps.

            These

            values are

            saved in

            the Rules.

            The form

            is fully

            editable.

Set update  Sets the                       x                           x
fields      updated
            by and
            related
            time
            stamps.


Item  Descriptio P1                     P2  P3  P4

      n

Move to If the                          x

previous/n record is

ext phase denied,

      the system

      automatic

      ally moves

      the record

      back to

      the

      Planning

      phase. If

      the record

      is

      approved,

      the system

      automatic

      ally moves

      the record

      to the next

      phase.

Related topics

Time Period Management
Time Period Management concepts
Time Period Management process
Time period occurrences
Time period recurrence rules
Time period security areas and roles


1.14.4. Time period recurrence rules

A time period rule reflects the recurrence of future start and end times of the time
period occurrences. The time period rule stores all the recurrence patterns. The
occurrences are created based on the rule.

There are five rule types available: Arbitrary, Daily, Weekly, Monthly, and Yearly. All
types, except for Arbitrary, can be configured with several recurrence rules. Arbitrary
allows the configuration of specific start and end times, in case some occurrences
don't follow a specific rule.

Principles of Rules

The following principles apply to time period rules.

Time Period Phase                                                                               Service Manager 9.81
Planning
                                        Principles
Approval
Published                               You can create, change, or remove a
                                        rule when the time period was never
                                        approved before, and the following
                                        happens:

                                             As soon as you create a rule, the
                                             occurrences are created in
                                             Inactive state.
                                             As soon as you change a rule, the
                                             occurrences are deleted and new
                                             ones recreated in Inactive state.
                                             As soon as you remove a rule, the
                                             occurrences are removed.

                                        Once the time period was approved, its
                                        rules are locked and can't be changed
                                        anymore if it's not in the first phase.

                                             When the global LOCK setting is
                                             set to true, a locked rule allows
                                             only activation/deactivation in the
                                             Planning phase, and all its future
                                             occurrences are deleted.
                                             When the global LOCK setting is
                                             set to false, a locked rule allows
                                             deletion / modification of the rule
                                             only in the Planning phase.

                                        Rules are displayed in read-only.

                                        Rules are displayed in read-only.


Time Period Phase                       Principles
Retired
                                        When a Time Period is retired, the
                                        associated rules are set to Inactive.

                                        In case a Time Period is unretired, the
                                        associated rules remain Inactive and
                                        need to be reactivated manually if the
                                        rules are still valid.

Once a rule is configured, various actions are started to prevent users from
unauthorized editing, as shown in the following figure.

Global lock setting

The time period global settings contains this option: Lock Rules once approved. This
global lock setting allows administrators to decide whether or not users can edit,
delete, activate, or deactivate rules after approval. By default, this global lock is
disabled.

The following table describes the behaviors when this option is enabled (set to true)
and disabled (set to false).


Global Lock Setting                     Behavior

 Global Lock Setting                                                                            Service Manager 9.81
 false
                                        Behavior
This PDF was generated on May 23, 2026
                                        Update Rules

                                        Updating rules is only possible in the
                                        first phase of the workflow. To update a
                                        rule, access an existing time period in
                                        the “planning” phase, click the Rule Id
                                        in the Rules section, and then update
                                        the rule. When your edits are complete,
                                        click Save.

                                        The following functionality is
                                        implemented in case a rule was
                                        changed:

                                             If the time period was NOT
                                             approved before, all occurrences
                                             are recalculated.
                                             If the time period was approved
                                             before, all future occurrences are
                                             recalculated.

                                        Delete Rules

                                        Deleting rules is only possible in the
                                        first phase of the workflow. Delete is
                                        only possible when the time period was
                                        not approved before. To delete a rule,
                                        access an existing time period in the
                                        “planning” phase, click the Rule Id in
                                        the Rules section, and then click
                                        Delete.

                                        When a rule is deleted, all occurrences
                                        for this rule are deleted.

                                        Add Rules

                                        Adding rules is only possible in the first
                                        phase of the workflow. To add a rule,
                                        open a time period and click New in the
                                        Rules section.

                                                                                                                        Page 151 of 220

 Global Lock Setting                    Behavior
 true
                                        Update Rules
Rule security
                                        Updating rules is only possible in the
This PDF was generated on May 23, 2026  first phase of the workflow if the time
                                        period was NOT approved. To update a
                                        rule, follow the steps described above.

                                        Once the time period was approved
                                        and the time period is again in the first
                                        phase, the rules are displayed in read-
                                        only, but a Deactivate Rule or Activate
                                        Rule button is available on the top of
                                        the screen to allow you to deactivate or
                                        activate the rule.

                                        Delete Rules

                                        Deleting rules is only possible in the
                                        first phase of the workflow if the time
                                        period was NOT approved. Once the
                                        time period was approved and the time
                                        period is again in the first phase, you
                                        can't delete its rules anymore. To
                                        delete a rule, access an existing time
                                        period in the “planning” phase, click
                                        the Rule Id in the Rules section, and
                                        then click Delete.

                                        When a rule is deleted, all occurrences
                                        for this rule are deleted.

                                        Add Rules

                                        Adding rules is possible only in the first
                                        phase of the workflow. To add a rule,
                                        open a time period and click New in the
                                        Rules section.

                                                  Page 152 of 220

Rules aren't secured by a separate area or role, and therefore the security of a rule is
closely tied to the security of its time period definition. Basically, if you can update a
time period, you can also update its rules.

            Note

           The security of the rules is implemented in function
           getEditRights(record) in the timeperiodRule ScriptLibrary record.

Related topics

Time Period Management
Time Period Management concepts
Time Period Management process
Time period workflow
Time period occurrences
Time period security areas and roles


1.14.5. Time period occurrences

An occurrence is the real time when a time period window happens. Each occurrence
contains a start and end time. When you add an active rule to a time period,
occurrences are automatically created based on the rule.

Occurrence details

In the Occurrences section of a time period, you can view the details of each
occurrence as described in the following table.


Label                                   Description
Rule Id
Start Date                              The ID of the rule associated with the
End Date                                occurrence.
Time Zone
                                        The start time of the occurrence.
Status
                                        The end time of the occurrence
Activate after approval
                                        The time zone of the occurrence Start
                                        Date and End Date. See Change the
                                        time zone of a time period for more
                                        information.

                                        The status of the occurrence: Active,
                                        or Inactive.

                                        You can change the status only when
                                        the time period is in the Published
                                        phase.

                                        Indicates whether or not the
                                        occurrence will be activated after
                                        approval: Yes, or No.

                                        In the first phase or in case the time
                                        period is pending approval, an
                                        occurrence can be marked to stay
                                        inactive after approval. This allows
                                        users or approvers to disable specific
                                        occurrences and approve the rest of
                                        the occurrences for a time period.

Number of occurrences for initial display

The global setting Number of occurrences for initial display defines the maximum
number of occurrences that can be displayed in the Occurrences section. When the
number of occurrences exceeds this limit, the following note displays at the top of the
Occurrences section:


Not all occurrences are displayed. You can use the filter functions to locate specific
occurrences.

When this happens, you can use the following fields to filter occurrences: Rule Id,
Start Date, End Date, Status, and Activate. Use the little magnifying glass to search for
records, and use the little button with a red cross to clear the filter.

            Note

           The actual number of occurrences that are displayed is also limited by
           another global setting: Maximum number of months for calculation of
           future occurrences. The recommended value is 12 (months).

For information about these two settings, see Configure time period global settings.

Occurrence state

Time period occurrences store the calculated start and end times of time period
definitions based on their configured rules. Occurrences are accessible as long as the
time period definitions are active.

Each occurrence record contains a checkbox to indicate whether it is active or
inactive, as described in the following table.


Condition                               Occurrence State

When an occurrence is created           A new occurrence is created as
                                        inactive (false).

When a time period is created (in the   Occurrences are inactive.
planning phase)

When a time period definition moves to  All future occurrences are set to
the published phase                     active, while occurrences in the
                                        past remain inactive.

When a time period definition moves     Future occurrences become
back to the planning phase              inactive, while occurrences in the
                                        past remain active.

When a time period definition moves to  Past occurrences remain active,
the retired phase                       while future occurrences are
                                        removed.

 When a time period definition is directly All occurrences are removed.
 retired (was never approved)

Occurrence security

The following security rules apply to time period occurrences:


Time Period Phase                       Security Rule
Planning
                                             Users can't activate or deactivate
                                             an occurrence, but can check
                                             whether or not an occurrence
                                             should be kept active after
                                             approval.

Published                               All users with update rights to the
                                        time period can deactivate
                                        occurrences, but can't reactivate
                                        them. Only users with Approval
                                        and Expert rights to the time
                                        period can reactivate
                                        occurrences.

Occurrence persistence

To ensure that customers can easily link changes and time periods together, the time
stamps on a time period are made persistent. This allows the implementation of
validations and additional reporting to ensure changes are linked with the right time
period.

Related topics

Time Period Management
Time Period Management concepts
Time Period Management process
Time period workflow
Time period recurrence rules
Time period security areas and roles
````
