---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.14.6 .. 1.14.7
printed_pages: 3209-3241
---

# 1.14.6 Time period security areas and roles

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.14.6. Time period security areas and
roles

The following security areas and roles are used to ensure proper security in the Time
Period Management module.

Security areas

Out-of-the-box, the Time Period Management module has the following security
areas. To view their default rights and default settings, navigate to System
Administration > Security > Areas, and open these records by performing a search.

Area                                    Description
Timeperiod
                                        For security related actions in time
Timeperiod Configuration                period definitions, rules and
                                        occurrences.

                                        For security related actions in time
                                        period categories, approvals and
                                        workflows.

Note

For the Timeperiod Configuration security area, don't select When
assigned or When assigned to workgroup from the Update or
Delete/Close drop-down list since the objects related to this security area
have no assignee or assignment group fields.

Security rights and settings

The following table describes the security rights and settings used in the Time Period
Management module.

 Setting / Right                                                                                Service Manager 9.81
 View
 New                                    Description
 Update                                 Can view time period records
 Delete / Close                         Can create new time period records
 Expert                                 Can update time period records
 Admin                                  Can retire new time period records
 Modify Template                        Can activate/deactivate occurrences
 Can apply template                     Is admin
 Can approve                            Can create templates
 Can delegate approvals                 Can apply templates
                                        Can approve time period records
 Can override approvals                 Can delegate approvals for time period
 Can copy record                        records
 Can send notifications                 Can override approvals
                                        Can copy time period records
 Can set reminder                       Can send notifications from time period
                                        records
 Can change category / type             Can set a reminder for time period
                                        records
 Can create global inbox                Can change the category/type of a
 Initial Inbox                          time period record
 Manage format                          Can create global time period inboxes
                                        Initial inbox for the time period module
This PDF was generated on May 23, 2026  Sc manage format

                                                                                                                        Page 160 of 220

Setting / Right                         Description
Can create personal Inbox
Lock on Display                         Can create personal inboxes for time
                                        period records
New thread List -> Edit
                                        When displaying a record the user,
                                        Service Manager locks the record
                                        regardless of whether the user is
                                        modifying the record or not

                                        When the user accesses a record from
                                        a record list, Service Manager keeps
                                        the record list open and displays the
                                        record in a new tab window

New thread Search -> List               When the user searches in the Time
                                        Period area, Service Manager keeps
                                        the search form open and displays the
                                        search results in a new tab window

New thread View -> Edit                 When the user accesses a record from
                                        a Time Period view, Service Manager
                                        keeps the view form open and displays
                                        the record in a new tab window

New thread View -> Search               When the user runs a search from a
                                        Time Period view, Service Manager
                                        keeps the view form open and displays
                                        the search form in a new tab window

Un-retire                               Can unretire (reopen) time period
                                        records

Security roles

Out-of-the-box, the following security roles are available for the Time Period
Management module.


To access these rules, click System Administration > Security > Roles, and then
open the roles by performing a search.


Role           Description              Default            Default
                                        Rights/Setting in  Rights/Setting in
                                        the Timeperiod     the Timeperiod
                                        Area               Configuration
                                                           Area

Timeperiod     Full rights.             View               View
Administrator                           New                New
                                        Update             Update
                                        (Always)           (Always)
                                        Delete/Close       Delete/Close
                                        (Always)           (Always)
                                        Expert             Expert
                                        Admin              Admin
                                        Can apply
                                        Template
                                        Can approve
                                        Can
                                        delegate
                                        approvals
                                        Can override
                                        approvals
                                        Can copy
                                        record
                                        Can send
                                        Notifications
                                        Can set
                                        reminder
                                        Can change
                                        category /
                                        type
                                        Can create
                                        global Inbox
                                        Can create
                                        personal
                                        Inbox
                                        Unretire
                                        Allowed
                                        Categories:


Role        Description                 Default            Default
                                        Rights/Setting in  Rights/Setting in
Timeperiod                              the Timeperiod     the Timeperiod
Analyst                                 Area               Configuration
                                                           Area
                                             all
                                             categories

            Partial rights; can         View               No rights
            update only when            New
            assigned.                   Update
                                        (When
                                        assigned to
                                        workgroup)
                                        Update
                                        (When
                                        assigned to
                                        workgroup)
                                        Can apply
                                        Template
                                        Can copy
                                        record
                                        Can send
                                        Notifications
                                        Can set
                                        reminder
                                        Can create
                                        global Inbox
                                        Can create
                                        personal
                                        Inbox
                                        Allowed
                                        Categories:
                                        all
                                        categories


Role        Description                 Default            Default
                                        Rights/Setting in  Rights/Setting in
Timeperiod                              the Timeperiod     the Timeperiod
Approver                                Area               Configuration
                                                           Area

            Partial rights; can         View               No rights
            approve and                 Update
            delegate                    (Never)
            approvals.                  Delete/Close
                                        (Never)
                                        Can approve
                                        Can
                                        delegate
                                        approvals
                                        Can send
                                        Notifications
                                        Can set
                                        reminder
                                        Allowed
                                        Categories:
                                        all
                                        categories


Role        Description                 Default            Default
                                        Rights/Setting in  Rights/Setting in
Timeperiod                              the Timeperiod     the Timeperiod
Manager                                 Area               Configuration
                                                           Area

            Expert rights; can          View               View
            always update.              New                New
                                        Update             Update
                                        (Always)           (Always)
                                        Delete/Close       Delete/Close
                                        (Always)           (Always)
                                        Expert             Expert
                                        Can apply
                                        Template
                                        Can approve
                                        Can
                                        delegate
                                        approvals
                                        Can copy
                                        record
                                        Can send
                                        Notifications
                                        Can set
                                        reminder
                                        Can change
                                        category /
                                        type
                                        Unretire
                                        Allowed
                                        Categories:
                                        all
                                        categories

User roles

Out-of-the-box, four users (operators) were created for testing purposes based on
the security roles described above.

 Operator                                                                                       Service Manager 9.81
 Timeperiod.Admin
                                        Description
 Timeperiod.Analyst
                                        Can perform all Time Period
 Timeperiod.Approver                    Management tasks.

 Timeperiod.Manager                     Partial rights; can perform Time Period
                                        Analysis tasks.
Related topics
                                        Partial rights; can approve time
Time Period Management                  periods.
Time Period Management concepts
Time Period Management process          Expert rights; can perform all Time
Time period workflow                    Period Management tasks except for
Time period occurrences                 certain administration tasks.
Time period recurrence rules


1.14.7. Working with time periods

Users perform the following tasks when working with time periods that are in different
phases.

     Create a time period
     Submit a time period for approval
     Deactivate or activate a time period occurrence
     Deactivate a time period rule
     Delegate a time period approval
     Approve a time period
     Change the time zone of a time period
     Retire a time period
     Submit a time period for replanning


1.14.7.1. Create a time period

A time period must contain one or more rules in order to create occurrences. A time
period rule stores all the recurrence patterns, and reflects the recurrence of the future
start and end times of the time period occurrences. Rules are the central element in
the Time Period module to create time period occurrences.

            Tip

           You can create a time period from scratch or copy from an existing one.

To create a time period from scratch, follow these steps:

   1. Click Time Period Management > Create New Time Period.

     A list of time period categories is displayed. The categories are grouped by
     Type.

Time period type                        Description
Availability Hours
Maintenance Window                      A period of time in which a service
Neutral                                 should be available.

Freeze Period                           A period of time in which Change
                                        requests may be implemented.

                                        A period of time indicating an
                                        external event, such as a holiday,
                                        which has no direct bearing on
                                        request implementation.

                                        A period of time in which Change
                                        requests may not be implemented.

2. Select a category.

  The New Time Period form opens, with certain field values automatically
  populated.

3. Complete the fields in the Details and Applies to sections as necessary. The
  following tables describe the two sections, and the Activities section.


Attribute                                            Details       Notes
Id
Current Phase                           Description

Approval Status                         A system-generated         The ID is generated
Type                                    unique ID for the time     based on the number
Category                                period definition.         file.
Next Review Date
Scope                                   The phase that the         The workflow is
                                        time period definition is  defined in the time
                                        currently in, depending    period category.
                                        on the pre-configured
                                        workflow.

                                        The approval status of     Same approval states
                                        the time period            as in Change
                                        definition.                Management.

                                        The type of the            Read-only
                                        selected category.

                                        The selected category. Read-only

                                        Enter the next review Must be a future date.
                                        date of this time period
                                        definition.

                                        The acceptable scope       A Global List with three
                                        of the time period.        values:

                                                    Note                No Impact
                                                                        Degradation
                                                   This field is        Outage
                                                   available
                                                   only for a
                                                   time period
                                                   of the
                                                   Maintenanc
                                                   e Window
                                                   type.


Attribute                               Description              Notes
Owning Group
                                        The assignment group     Linked to the
Owner                                   that owns this time      assignment table.
Name                                    period.                  Values must be a valid
Description                                                      assignment group.

Attribute                               The owner (person) of    Must be a member of
New Update Type                         this time period.        the assignment group
                                                                 (Owning Group).
New Update                              A display name of the
Activity Logs                           time period definition.  Any name is
Activity Type filter                                             acceptable.
User filter                             A description of the
                                        time period definition.  Any textual description.

                                        Activities

                                             Description

                                             The type of the new update. The
                                             out-of-the-box types are Update,
                                             Communication with Stakeholders,
                                             and Communication with Service
                                             Owners.

                                             The description of the new update
                                             for the activity log.

                                             Lists all activities performed on the
                                             record.

                                             Allows a filtered view of the activity
                                             list per Activity Type.

                                             Allows a filtered view of the activity
                                             list per User.


Attribute                                          Applies to      Notes
Environments
Services                                Description

Locations                               An attribute to classify
Departments                             the time period
                                        definition even further.

                                        Services for which this    Must be a Business
                                        time period definition is  Service configuration
                                        created.                   item from the device
                                                                   file.

                                        The locations this time    Must be a valid record
                                        period applies to.         from the location file.

                                        The departments this       Must be a valid record
                                        time period applies to.    from the department
                                                                   file.

Note

By default, the time period is valid for all Locations, Departments,
Services, and Locations (these fields have a default value of <All> ).
When you specify a specific item, the <All> value is cleared and
replaced with your specified value.

4. Click Save.

               Note

             Before you can add a rule, you need to save the time period.

  The time period is added.
5. In the Rules section, continue to add rules to the time period.

     1. Click New. The New Time Period form opens.
     2. In the Rule Name field, type a descriptive name. For example, My Rule 1.


Note

The rule is Active by default. If you want to add an inactive rule,
deselect the Active option. Inactive rules will not create
occurrences for the time period.

3. In the Time period field, select a time zone. By default, the time zone
  defined in your operator record or the system time zone defined in the
  System Information Record is selected. If you are creating a time period
  definition for users located in another time zone, you may want to select
  their time zone. Occurrences will be generated based on the specified time
  zone.

4. Select a Recurrence Type. For example, Monthly.

5. Specify when the rule will start to take effect and when it will expire. For
  example, you can specify February 1, 2013 as the effective date, and the
  rule will expire after 10 occurrences.

               Note

             The maximum allowed value in the Expires after field is defined
             in the Time Period Settings. See Configure time period global
             settings. If you specify a value greater than the maximum, an
             error occurs.

6. Select a recurrence pattern. For example, you can specify the rule recurs
  every 1 month, on every fourth of the month or on every first Monday of the
  month.

               Note

             The value of the recurrence pattern has the following
             limitations:

                   Daily: 1 to 1000
                   Weekly: 1 to 100
                   Monthly: 1 to 25
                   Yearly: 1 to 3

7. Specify the start and end times of the rule. For example, you can specify
  the rule starts at 00:00 (hh:mm) and ends on the same day at 08:00
  (hh:mm).


        8. If you want to set an arbitrary schedule for the rule, select the On an
           arbitrary schedule checkbox, and then specify the start day and end date
           for each individual occurrence.

        9. Click Save.

           The rule is added.

       10. Click Save & Exit.

           You are returned to the time period record. The new rule now displays in
           the Rules section, and its occurrences during the specified effective period
           are listed in the Occurrences section. When there are a large number of
           occurrences, you can use the filters (Rule ID, Start Time, End Time, Status,
           and Activate) at the top of this section to view specific rules.

           The maximum allowed value in the Expire after field and the number of
           months to calculate future occurrences are defined in the time period
           global settings. See Configure time period global settings.

                         Note

                      The occurrences are displayed in your time zone or the system
                      time zone if yours is unavailable, instead of the time zone
                      specified in the rule. You can change the occurrence display
                      time zone only for this session by clicking the Change Time
                      Zone button (if you log off and then log back in, the time zone
                      change no longer takes effect). For details, see Change the
                      time zone of a time period.

   6. If needed, continue to add more rules as described above.

   7. Click Save.

     The time period is created.

     The Workflow section shows the workflow linked with the time period category
     you selected previously, and the current phase of the time period is Planning.

     The Approvals section is now empty. Next, you can further update the time
     period or submit it for approval.

To create a time period from an existing one, follow these steps:

   1. Click Time Period Management > Search Time Periods.


   2. Open the existing time period by performing a search.
   3. Click More or the More Actions menu, and select Copy.

     The new time period is created, populated with data from the original time
     period, except for the Impact and Current Phase field values. The new record
     always has an empty Scope and a Current Phase of planning.
   4. Click Save.

                   Note

                The Copy options for Rules and Occurrences setting specified in
                the Time Period Settings determines whether or not and how rules
                and occurrences are copied. When you click Save, rules and
                occurrences are copied regardless of their state (active or inactive).

   5. Update the time period as needed, and click Save.

Update a time period

You can't update an existing time period unless it is in the Planning phase.
To update a time period, follow these steps:

   1. Navigate to Time Period Management > Search Time Periods.
   2. Click Search, or enter several fields on the search form and then click Search.

                   Note

                An entry in the ID field must include the prefix TP. For example,
                TP000003.

   3. Locate the time period record you want to update, and update it as needed.
   4. Save the record.

Related topics

Submit a time period for approval
Deactivate or activate a time period occurrence
Deactivate a time period rule
Delegate a time period approval
Approve a time period


Change the time zone of a time period
Retire a time period
Submit a time period for replanning
Time period configuration tasks


1.14.7.2. Submit a time period for approval

Once you have finalized a time period definition, you can submit it for approval. By
default each time period will go through the time period approvals defined in the
Timeperiod approval definition, which is a global definition that takes effect on all time
periods. Your administrator can create their own approval definitions and associate
them to different time period categories.

To submit a time period for approval, follow these steps:

   1. Navigate to Time Period Management > Search Time Periods, and open the
     time period by performing a search.

   2. Click Submit for Approval.

     The time period moves to the approval phase, and its Approval Status changes
     to pending.

     The Approvals section now lists all currently required approvals. Once an
     approval is completed, the approval activity will be displayed in the Approval
     Log.

Related topics

Create a time period
Deactivate or activate a time period occurrence
Deactivate a time period rule
Delegate a time period approval
Approve a time period
Change the time zone of a time period
Retire a time period
Submit a time period for replanning
Time period configuration tasks


1.14.7.3. Activate or deactivate a time
period occurrence

Once you have added rules to a time period, the occurrences are automatically
calculated and displayed in the record. By default, all occurrences are automatically
activated after the time period is approved; however you can manually deactivate an
individual occurrence and activate it later if needed.
To cancel an occurrence in a time period, follow these steps:

   1. Navigate to Time Period Management > Search Time Periods, to open the time
     period record.

   2. In the Occurrences section, locate an occurrence and do the following
     according to the current phase of the time period:

Phase                                                                                     Service Manager 9.81

Planning                                In the Activate after approval
or                                      column, click Yes or No to change to
Approval                                the opposite value.
                                        Yes means the occurrence is
                                        activated after approval while No
                                        means the occurrence stays inactive
                                        after approval.

Phase                                                                                     Service Manager 9.81
Published
                                        In the Status column, click Active to
                                        deactivate or click Inactive to
                                        activate, and then enter an
                                        explanation about the status change
                                        if required. The value now changes
                                        from Active to Inactive or from
                                        Inactive to Active.

                                                    Note

                                                   After approval the
                                                   Activate after approval
                                                   column is no longer
                                                   displayed. Instead the
                                                   Status column is
                                                   displayed as a link.
                                                   Clicking the Active or
                                                   Inactive link deactivates
                                                   or activates the
                                                   occurrence.

       Phase                                                       Service Manager 9.81

Related topics                          Caution

Create a time period                    As a normal user (with
Submit a time period for approval       only update rights), you
Deactivate a time period rule           can always deactivate
Delegate a time period approval         occurrences, but you
Approve a time period                   can't reactivate
Change the time zone of a time period   occurrences once the
Retire a time period                    record is published; to
Submit a time period for replanning     reactivate an occurrence
Time period configuration tasks         after the approval phase,
                                        you must have Expert or
                                        Approval rights to a time
                                        period record. Normal
                                        users are disallowed to
                                        play with the status of
                                        the occurrences.


1.14.7.4. Deactivate a time period rule

By default, time period rules are active when created. If a time period rule no longer
works for you, you can permanently remove it from the time period, or you can
temporarily deactivate it. You can do so only when the time period is in the first phase
of the workflow.

To deactivate a time period rule, follow these steps:

   1. Navigate to Time Period Management > Search Time Periods, and then open
     the time period record that contains the rule.

   2. In the Rules section, click the rule and then deselect the Active option.

                   Note

                 : If the time period was approved and back to the first phase, the
                existing rules are read-only, and you should click the Deactivate
                Rule button instead.

   3. Click Save to save the rule, and then click Save & Exit.

     In the Occurrences section of the time period, all future occurrences based on
     this inactive rule are now removed.

Related topics

Create a time period
Submit a time period for approval
Deactivate or activate a time period occurrence
Delegate a time period approval
Approve a time period
Change the time zone of a time period
Retire a time period
Submit a time period for replanning
Time period configuration tasks


1.14.7.5. Delegate a time period approval

Approval Delegation is possible for time periods in the same way as for other modules
in Service Manager. Before you can delegate your approvals to other users, your
system administrator should have given you the rights to delegate approvals. For
information about how to grant approval delegation rights, see Time period security
areas and roles.

To delegate approvals, follow these steps:

   1. Navigate to Miscellaneous > Approval Delegation.

     The List Delegates wizard opens.

   2. Click Add New Delegation.
     The Delegate Selected Approvals option is selected by default.

   3. Click Next.
   4. Select the Timeperiod module, and click Next.
   5. Select your group (for example, Service Manager) or operator (for example,

     Timeperiod.Approver), move it into the right pane, and then click Next.

   6. Complete the following fields, and click Next.

Field                                                                                     Service Manager 9.81
Delegate to
                                        Description

                                        The user to whom the approvals will
                                        be delegated. Click Fill to select a
                                        user from the list.

                                                    Note

                                                   If a desired user is not in
                                                   the list, the user doesn't
                                                   have the rights to access
                                                   or approve time periods.
                                                   Contact your system
                                                   administrator for
                                                   assistance. If your
                                                   Service Manager system
                                                   has a Process Designer
                                                   Content Pack applied,
                                                   the desired user must be
                                                   a member of the ChM
                                                   Membership group.

Valid From                              The delegation start time.
Valid To                                The delegation end time.

   7. Click Finish.

Related topics

Create a time period
Submit a time period for approval
Deactivate or activate a time period occurrence
Deactivate a time period rule
Approve a time period
Change the time zone of a time period
Retire a time period
Submit a time period for replanning
Time period configuration tasks


1.14.7.6. Approve a time period

If you are the approver or a member of the approval group, or a delegate of a time
period approval, you receive a notification when a time period is pending your
approval. You can then complete your approval. Once all approvals of the time period
are complete, the time period automatically advances to the published phase, and the
approval status changes from pending to approved. If a time period is denied during
an approval, it needs to be resubmitted for approval.

            Note

           You can Deny a pending approval or Retract a completed approval.

If you are the approver or a member of the approval group, follow these steps to
approve or reject a time period:

   1. Navigate to Time Period Management > Search Time Periods, to open the time
     period record.

   2. In the Approvals section, click the Timeperiod approval in the Currently
     Approvals subsection.

   3. Put the cursor in your approval, and click More > Approval > Approve/Deny to
     approve or reject the record.

     If you're not the approver but have approval override rights, you can also
     approve by clicking More > Override > Approve Current.

     • To approve, click Approve. If you want to redo your approval, click Retract.
     • To reject, click Deny.

   4. Enter your approval comments, and click OK.

     If denied, the time period then returns to the planning phase, and its approval
     status becomes denied.

     If there are still pending approvals, the time period remains in the approval phase
     with an approval status of pending; otherwise, it advances to the published
     phase with an approval status of approved.

If you are a delegate, follow these steps to approve or reject a time period:

   1. In the To Do Queue, select Approval Delegation from the Queue list, and Active
     approval delegations assigned to me from the View list.


   2. Click the approval for the time period.

   3. Click Approve or Deny.

Related topics

Create a time period
Submit a time period for approval
Deactivate or activate a time period occurrence
Deactivate a time period rule
Delegate a time period approval
Change the time zone of a time period
Retire a time period
Submit a time period for replanning
Time period configuration tasks


1.14.7.7. Change the time zone of a time
period

When you are viewing or updating a time period definition, its occurrences are
displayed in your time zone or the system time zone if yours is undefined. In some
cases, for example, if a time period is created for users in another time zone, you may
want to change the current display time zone to that one.

            Note

           The time zone change takes effect only for your current session (it will no
           longer take effect if you log off and then log back in).

To change the time zone of a time period, follow these steps:

   1. Navigate to Time Period Management > Search Time Periods, and then open
     the time period record you want to update.

   2. Click Change Time Zone.

   3. In the New session's Time Zone field, select another time zone.

   4. Click Finish.

     The occurrences are now displayed in the new time zone.

Related topics

Create a time period
Submit a time period for approval
Deactivate or activate a time period occurrence
Deactivate a time period rule
Delegate a time period approval
Approve a time period
Retire a time period
Submit a time period for replanning
Time period configuration tasks


1.14.7.8. Retire a time period

Once a time period is no longer needed, you can retire it. When retired, the time
period record is inactive and closed.

            Note

           You can retire a time period only when it is in the planning or published
           phase.

To retire a time period, follow these steps:
   1. Navigate to Time Period Management > Search Time Periods, and then open
     the time period record you want to retire.
   2. Make sure the record is in the planning or published phase.
   3. Click Retire.
     The time period advances to the retired phase, and becomes read-only. All
     occurrences in the Occurrences section have been removed.

To unretire a time period, follow these steps:

            Note

           To unretire a retired time period, you need one of the following security
           roles: system administrator, Timeperiod Administrator, or Timeperiod
           Manager. These roles have the rights to unretire time periods.

   1. Open the time period.
   2. Click More or the More Actions menu, and then select Unretire.

     The time period returns to the planning phase.

                   Note

                Although the rules are active at this time, the occurrences aren't
                automatically added back. You need to manually save the rules to
                get them back.

   3. In the Rules section, open each rule, and click Save and then Save & Exit.


     The occurrences now display in the Occurrences section.

Related topics

Create a time period
Submit a time period for approval
Deactivate or activate a time period occurrence
Deactivate a time period rule
Delegate a time period approval
Approve a time period
Change the time zone of a time period
Submit a time period for replanning
Time period configuration tasks


1.14.7.9. Submit a time period for
replanning

Once a time period is published, its rules and occurrences become read-only. You
can only manually cancel an individual rule. If you need to update the rules or
occurrences, you can submit it for replanning. Doing so returns the time period back
to the planning phase.

To submit a time period for re-planning, follow these steps:

   1. Navigate to Time Period Management > Search Time Periods, to open the time
     period record.

   2. Click Submit for Replanning.

                   Note

                      Existing rules are read-only if the Lock Rules once approved
                      global setting is enabled, and therefore you can no longer
                      update them, but you can still deactivate/activate them using
                      the Deactivate Rule or Activate Rule button that appears on
                      the top of the rule detail form; if Lock Rules once approved is
                      disabled (set to false), you can still update existing rules.
                      Deactivating a rule will trigger the deletion of all future
                      occurrences based on the rule; activating a rule triggers the
                      creation of the occurrences as of today.
                      The system will display a warning message if any existing
                      changes conflict with the submitted time period.

Related topics

Create a time period
Submit a time period for approval
Deactivate or activate a time period occurrence
Deactivate a time period rule
Delegate a time period approval
Approve a time period
Change the time zone of a time period
Retire a time period
Time period configuration tasks
````
