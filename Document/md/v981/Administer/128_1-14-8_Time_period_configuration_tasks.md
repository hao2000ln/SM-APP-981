---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.14.8 .. 1.14.8
printed_pages: 3241-3271
---

# 1.14.8 Time period configuration tasks

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.14.8. Time period configuration tasks

Administrators can perform the following configuration tasks for the Time Period
module.

     Configure time period global settings

     Configure some global settings for the Time Period Management module. This
     configuration includes updating or deleting existing settings and adding new
     settings.

     Configure a time period workflow

     Define the workflow in the time period category.
     Configure time period categories

     Create new time periodcategories, and update or remove existing ones to
     manage the data structures of different kinds of time period definitions.

     Configure time period approvals

     Define approvals for the Time Period module using approval definitions. The
     Timeperiod approval definition is linked to the Approval phase.

     Configure time period approval notifications
     Define and trigger the time period approval notifications. When a time period is
     added or updated, notifications are generated.

     Calculate time period conflicts

     Calculate time period conflicts between the current changes record or change
     task record and the existing time period.

     Trigger an approval for time period conflicts

     Define an additional approval for a module and then associate the approval
     definition to the corresponding phase of a record.
     Configure time period conflict notifications for Change Management

     Configure time period conflict notifications for Change Management. When a
     change with the Conflict with Freeze Window conflict type is approved, a
     notification is sent to the owner of the conflicted time period.

Related topics


Time Period Management
Time Period Management concepts
Time Period Management process
Time period workflow
Time period occurrences
Time period recurrence rules
Time period security areas and roles
Working with time periods


1.14.8.1. Configure time period global
settings

Administrators can configure some global settings for the Time Period Management
module. This configuration includes updating or deleting existing settings and adding
new settings.
To configure time period settings, follow these steps:

   1. Click Time Period Management > Administration > Settings.
     The Time Period Settings form opens, in which the Module and Area fields are
     auto-populated with these values: Timeperiod, and Timeperiod Configuration.

   2. Specify the settings on the form, as described in the following table.


Attribute                               Description              Validation

Time period category                    The fields by which the  Maximum: 4 fields
group-by fields                         time period categories
(comma separated)                       are grouped when
                                        users creates a new
                                        time period definition.

Time period category                    The fields by which the  Maximum: 4 fields
sort-by fields (comma                   time period categories
separated)                              are sorted when users
                                        creates a new time
                                        period definition.

Link for copy                           The link record used to None
                                        copy the fields from
                                        the current record to
                                        the target. The default
                                        link is
                                        timeperiodDefinition.co
                                        py.

Copy options for Rules                  These are the options None
and Occurrences                         when users copy time
                                        period definitions:

                                             Do not copy
                                             Rules/Occurrence
                                             s
                                             Copy Rules only
                                             Copy
                                             Rules/Occurrence
                                             s


Attribute                               Description   Validation

Lock Rules once                         If this option is set to None
approved                                true, users can't edit or
                                        delete their rules
                                        anymore when time
                                        periods are approved
                                        and then return to the
                                        first phase of the
                                        workflow. Users can
                                        only deactivate or
                                        activate the rules.

                                        If this option is set to
                                        false, users can always
                                        edit or delete their
                                        rules as long as time
                                        periods are in the first
                                        phase.

                                        Note

                                        A time
                                        period rule
                                        reflects the
                                        recurrence
                                        of future
                                        start and
                                        end times
                                        of the time
                                        period
                                        occurrence
                                        s. A time
                                        period rule
                                        stores all
                                        the
                                        recurrence
                                        patterns.


Attribute                               Description               Validation

                                        For more information,
                                        see Time period
                                        recurrence rules.

Maximum number of                       The maximum allowed       No greater than 100
occurrences before a                    value for the Expires
rule expires                            after field in which the
                                        user enters the number
                                        of recurrences within a
                                        time period rule.

                                        For more information,
                                        see Create a time
                                        period.

Maximum number of                       The number of months      Maximum: 12 months
months for calculating                  to calculate future
future occurrences                      occurrences.              The default value (12)
                                                                  is recommended for
                                                                  best performance.

Number of                               The maximum number        Maximum: 100
occurrences for initial                 of occurrences that are
display                                 displayed when users
                                        view a time period
                                        definition.

Force activity entry for                If this option is         None
occurrence status
changes                                 selected, users are

                                        required to give an

                                        explanation when

                                        changing the status of

                                        an occurrence. The

                                        explanation is logged in

                                        the activity log.


Attribute                               Description               Validation
                                                                  None
Disable the Pop-up                      If this option is set to
Window to warn time                     true, the time period
period conflicts                        conflicts warning is
                                        displayed in system
                                        message.

                                        If this option is set to
                                        false, a window is
                                        opened to warn time
                                        period conflicts.

Send an email                           If this option is         None

notification to the time selected, an email will

period owner when the be sent to the time

conflicting change is period owner of a

approved                                freeze window when

                                        the conflicting change

                                        is approved.

   3. Click Save.
To add a new time period setting, follow these steps:

   1. Click Time Period Management > Administration > Settings.
     The Time Period Settings form opens.

   2. Click More or the More Actions menu, and select Add New Setting.
     The New Setting Information wizard opens.

   3. Compete the following fields, and click Next.

Field Name                              Description                                 Service Manager 9.81
Setting Id
                                        Specify an ID for the   Example Value
Display Label                           setting.                categoryGroupBy
Description
                                                    Note

                                                   Once
                                                   saved, the
                                                   setting ID
                                                   becomes
                                                   non-
                                                   editable.

                                        Enter a display name of Time period category

                                        the setting.            sort-by fields

                                        Enter a description of
                                        the setting.


Field Name                              Description               Example Value
Setting Type
                                        Select a type from the    String
Mandatory                               list:

                                             Number: a
                                             numeric field.
                                             String: a String
                                             field.
                                             Date/Time: a
                                             Date/Time field.
                                             Boolean: a
                                             Boolean field. A
                                             checkbox will
                                             appear before the
                                             display label.
                                             Manual List: a list
                                             of options.
                                             Global List: a
                                             global list.
                                             Record
                                             Condition

                                        Indicates if this setting Not selected
                                        is mandatory.

   4. If the setting requires validation, enter a validation script; otherwise leave it
     empty.

   5. Click Finish.
   6. Open Time Period Settings from the navigator. The new setting now appears on

     the form.

To edit or remove an existing time period setting, follow these steps:

   1. Click Time Period Management > Administration > Settings.

   2. Click More or the More Actions menu, and select Edit Settings.

     A wizard opens.

   3. Click the Setting Id of the setting you want to edit or remove.
   4. Update the field values as needed, and click Finish.


   5. If you want to remove the setting, click Remove This Setting.

Related topics

Time Period Management
Time Period Management concepts
Time Period Management process
Time period workflow
Time period occurrences
Time period recurrence rules
Time period security areas and roles
Configure a time period workflow
Configure time period categories
Configure time period approvals
Configure time period approval notifications
Calculate time period conflicts
Trigger an approval for time period conflicts
Configure time period conflict notifications for Change Management


1.14.8.2. Configure a time period workflow

Each time period has a workflow, which is defined in the time period category.

You can find one OOB workflow (named Timeperiod) from Time Period Management
> Configuration > Workflows.

            Note

           The workflow phases contain special rule sets to ensure that occurrences
           and rules are managed correctly.

To configure your own time period workflow, follow these steps:

   1. Navigate to Tailoring > Process Designer > Workflows.
   2. Click New.
   3. Type a name and description for the workflow, and in the Table name field

     select timeperiodDefinition.
   4. Click OK.
   5. Define the phases and transitions for the workflow.
   6. Save the workflow.

Related topics

Time Period Management
Time Period Management concepts
Time Period Management process
Time period workflow
Time period occurrences
Time period recurrence rules
Time period security areas and roles
Configure time period global settings
Configure time period categories
Configure time period approvals
Configure time period approval notifications
Calculate time period conflicts
Trigger an approval for time period conflicts
Configure time period conflict notifications for Change Management


1.14.8.3. Configure time period categories

You use time period categories to manage the data structures of different kinds of
time period definitions. You can create new categories, and update or remove existing
ones.

Category types

All categories fall into a set of types defined in globallist timeperiodCategoryTypes
based on the codes table. The out-of-the-box types are described in the following
table. You can configure the types to suit your needs.

Type                                    Description
Maintenance Window                      Maintenance period.
Neutral                                 Information period.
Freeze Period                           Blackout period.

Category workflows

Each category has an associated workflow, which is created for the
timeperiodDefinition table. Before creating a time period, make sure you have
already created a workflow for it. For details, see Configure a time period workflow.

Category configuration

To create a new time period category, follow these steps:

   1. Click Time Period Management > Configuration > Time Period Categories.

     The Time Period Categories search form opens.

   2. Click New.

     An ID is automatically assigned to the new category.
   3. Complete the following fields.


Attribute                               Description                  Notes
Id
Type                                    An automatically
                                        generated unique ID.
Name
                                        Select one from the          This is a
Workflow                                pre-defined types. For       mandatory field.
Active                                  example:                     Cannot be
Color                                                                changed as long
                                             Maintenance             as there are
                                             Window                  active time
                                             Neutral                 periods related to
                                             Freeze Period           the category.

                                        A display name for the       This is a
                                        time period category.        mandatory field.
                                                                     Cannot be
                                                                     changed as long
                                                                     as there are
                                                                     active time
                                                                     periods related to
                                                                     the category.

                                        The workflow that's          A workflow
                                        associated with this         created for the
                                        category. Time periods       timeperiodDefinit
                                        of this category will        ion table.
                                        use this workflow.

                                        Active flag. If the flag is
                                        set to false, the
                                        category will not be
                                        selectable when users
                                        create a new time
                                        period.

                                        The color in which this      Global List with
                                        time period category is      predefined values
                                        displayed in the             as HTML color
                                        calendar.                    code


Attribute                               Description              Notes
Usage Condition
                                        A condition that allows       Any RAD
                                        the user an additional        condition is
                                        filtering on the              acceptable.
                                        categories. When a            Whether a user
                                        time period is created        can use a
                                        and this condition            category or not is
                                        evaluates to false, the       also dependent
                                        category is not               on the Allowed
                                        selectable.                   Categories setting
                                                                      in the user's
                                        To add a usage                Security Role. For
                                        condition, Click Edit         more information,
                                        and then add a RAD            see Time period
                                        expression in the             security areas
                                        Condition Editor.             and roles.

Description                             A description of the
                                        category.

   4. Click Save.
     The new category is created.

To update an existing category, follow these steps:

Note

You can't rename a category if there are active time period definitions
linked with it.

1. Navigate to Time Period Management > Configuration > Time Period
  Categories.

  The Time Period Categories search form opens.

2. Complete some fields to narrow down your search results or leave the fields
  empty, and then click Search.

3. Select the category, and update its field values.


   4. Click Save.

To delete an existing category, follow these steps:

            Note

           You can delete a category only when there are no active time period
           definitions linked with it.

   1. Navigate to Time Period Management > Configuration > Time Period
     Categories, and open the category.

   2. Click Delete.

Related topics

Time Period Management
Time Period Management concepts
Time Period Management process
Time period workflow
Time period occurrences
Time period recurrence rules
Time period security areas and roles
Configure time period global settings
Configure a time period workflow
Configure time period approvals
Configure time period approval notifications
Calculate time period conflicts
Trigger an approval for time period conflicts
Configure time period conflict notifications for Change Management


1.14.8.4. Configure time period approvals

You define approvals for the Time Period module using approval definitions. The out-
of-box approval definition is Timeperiod, which contains sample configurations only
for testing purposes. The Timeperiod approval definition is linked to the Approval
phase.

You can update the Timeperiod approval definition according to your needs; you can
also create your own approval definitions and link them with their corresponding
phase in the workflow.

To configure time period approvals, follow these steps:

   1. Navigate to Time Period Management > Configuration > Approval Definitions.

     The timeperiod Approval Definition form is displayed. You can update this
     definition according to your needs. The following example shows how you
     create a new approval definition and link it to the Approval phase in the
     workflow.

   2. Change the name of the Timeperiod definition, for example, change it to
     Timeperiod1.

   3. Click Add.
   4. In the Approval Condition field, enter a condition expression. For example, a

     true condition means the approval definition takes effect on all time periods.


5. In the Approval Type field, select an approval type.

               Note

             For a list of available approval types and their descriptions, see
             What's an approval type?.

6. In the Approval Description field, enter a description of the approval definition.
7. Enter one or more approval groups/operators, as well as their sequence and

  condition.


Column                                  Description             Example
Group/Oper
                                        Enter the name of an    Service Manager
                                        assignment group or     or
                                        operator.               Change.Coordinator

                                                    Note

                                                   A member
                                                   of the
                                                   assignment
                                                   group will
                                                   be able to
                                                   perform
                                                   the
                                                   approval.
                                                   Change
                                                   Approval
                                                   and
                                                   Request
                                                   Approval
                                                   groups
                                                   can't
                                                   perform
                                                   time period
                                                   approvals.

Sequence                                The sequence of the 1
Condition                               approval.

                                        The condition for the true
                                        approval.

   8. Save the approval definition.
   9. Navigate to Tailoring > Process Designer, and associate the approval definition

     to the Approval phase of a time period workflow. For example, associate it to the
     out-of-box Timeperiod workflow.

Related topics


Time Period Management
Time Period Management concepts
Time Period Management process
Time period workflow
Time period occurrences
Time period recurrence rules
Time period security areas and roles
Configure time period global settings
Configure a time period workflow
Configure time period categories
Configure time period approval notifications
Calculate time period conflicts
Trigger an approval for time period conflicts
Configure time period conflict notifications for Change Management


1.14.8.5. Configure time period approval
notifications

Notifications are generated when a Time Period is added or updated. The time period
approval notifications are defined in the timeperiodDefinition Object record, and are
triggered through the standard approval workflow in Service Manager. You can
customize the notifications as needed.
To configure time period approval notifications, follow these steps:

   1. Navigate to Tailoring > Document Engine > Objects.
   2. In the File name field, type timeperiodDefinition.
   3. Click Search.

     The object record opens.
   4. Click the Approvals tab. Refer to the following table for the default notifications

     configuration.


Notification Name                       Notification Record  Description
Approval notification                   Timeperiod Approval
                                                             Executed when a time
Denial notification                     Timeperiod Denial    period approval
                                                             happened.
Retraction notification Timeperiod Retract
                                                                  An approval
                                                                  message is
                                                                  displayed in the
                                                                  client.
                                                                  Emails are sent to
                                                                  the owner,
                                                                  owning group,
                                                                  delegates and
                                                                  next pending
                                                                  approval group.

                                                             Executed when a time
                                                             period denial
                                                             happened.

                                                                  An approval
                                                                  message is
                                                                  displayed in the
                                                                  client.
                                                                  Emails are sent to
                                                                  the owner, and
                                                                  owning group.

                                                             Executed when a time
                                                             period approval /
                                                             denial was retracted

                                                                  An approval
                                                                  message is
                                                                  displayed in the
                                                                  client.
                                                                  Emails are sent to
                                                                  the owner, and
                                                                  owning group.


Notification Name                       Notification Record Description

Final approval                          Timeperiod Final         Executed when a time
notification                            Approval                 period was fully
                                                                 approved.

                                                                      An approval
                                                                      message is
                                                                      displayed in the
                                                                      client.
                                                                      Emails are sent to
                                                                      the owner, and
                                                                      owning group.

Final denial notification               Timeperiod Final Denial  Executed when a time
                                                                 period was fully
                                                                 denied.

                                                                      An approval
                                                                      message is
                                                                      displayed in the
                                                                      client.
                                                                      Emails are sent to
                                                                      the owner, and
                                                                      owning group.

   5. Navigate to Tailoring > Notifications > Notifications, and click Search.
   6. Update the notifications listed above as necessary.

Related topics

Time Period Management
Time Period Management concepts
Time Period Management process
Time period workflow
Time period occurrences
Time period recurrence rules
Time period security areas and roles
Configure time period global settings
Configure a time period workflow


Configure time period categories
Configure time period approvals
Calculate time period conflicts
Trigger an approval for time period conflicts
Configure time period conflict notifications for Change Management


1.14.8.6. Calculate time period conflicts

Out-of-the-box, Service Manager only calculates time period conflicts for changes or
change tasks of certain categories, including Emergency, Normal and Standard. If the
start date and the end date are specified or updated without null, the system will
calculate the conflicts between the current record and existing time periods when you
trigger the save operation. Time period conflict calculation has the following five
results available.

     0: The time period conflict calculation is completed without conflicts.
     1: The current record conflicts with a Freeze window.
     2: The current record misses a Maintenance window.
     3: The current record exceeds a Maintenance window.
     null: The time period conflict calculation is not performed.

You can type d tpconflict in $file in the RAD Debugger and then press Enter to view
the time period conflict result on a change form or a change task form.

Calculate time period conflicts automatically

The Change Management module is used as an example in the sample task. To
calculate the conflicts between a change and a time period, follow these steps:

   1. Refer to Enable or disable the calendar to enable the calendar.
   2. Refer to Display records from an application module in the calendar to configure

     the calendar mapping for a change.
   3. Refer to Create a time period to create a new time period, and then refer to

     Approve a time period to approve the newly created time period.
   4. Create a change with a category that can be used for time period conflict

     calculation. Fill in the Scheduled Implementation Start date and Scheduled
     Implementation End date if the two fields are null. The two date fields are
     configured in calendar mappings.

   5. Fill in all mandatory fields, and then click Save. If the change conflicts with an
     existing time period, the system automatically selects the Time Period Conflict
     checkbox in the change record and displays the following warning message.

      The Change you scheduled conflicts with the existing freeze period or
     maintenance period.


                   Note

                If you don't select the Disable the Pop-up Window to warn time
                period conflicts, the time period conflict warning message is
                displayed in a pop-up window. See Configure time period global
                settings for more information.

   6. Locate and click the calendar to locate the change record, which is displayed
     with a red or yellow conflict icon. Hover your mouse over the conflict icon of the
     change record to view the detailed time conflict information.

Calculate time period conflicts manually

Sometimes when you are adding, retiring or updating time periods, or invoking other
process, the time period conflicts may be out of synchronization because these
updates don't trigger the save operation of a change.
To get the latest conflict status on a change form, click More or the More Actions
icon and then select Calculate Time Period Conflicts. After the manual recalculation,
the tpconflict flag in $file in the RAD Debugger is updated accordingly.

            Note

           The Calculate Time Period Conflicts option is available only when all the
           following requirements are met:

                The Service Manager Calendar is enabled.
                The current change is configured for time period conflict calculation.
                Refer to Display records from an application module in the calendar
                for more information.
                The current change is in not closed.

            Note

           Manual time period conflict calculation is not applicable to Problem
           Management, Incident Management and Interaction.

Related topics

Time Period Management
Time Period Management concepts


Time Period Management process
Time period workflow
Time period occurrences
Time period recurrence rules
Time period security areas and roles
Configure time period global settings
Configure a time period workflow
Configure time period categories
Configure time period approvals
Configure time period approval notifications
Trigger an approval for time period conflicts
Configure time period conflict notifications for Change Management


1.14.8.7. Trigger an approval for time
period conflicts

You can define an additional approval for a module which has time period conflicts
and also has the approval functionality. The default approval definition is Approval
Depending on Timeperiod Conflict, which is linked to the Approval phase. You can
either update the approval definition as necessary or create your own approval
definitions and link them to their corresponding phases.

The Change Management module is used as an example in the sample task. Follow
these steps to trigger an additional approval for a change record.

   1. Click Change Management > Configuration > Change Workflows.

     The workflow list opens.

   2. Select a workflow to view its detail. For example, Normal.
   3. Click the Approvals tab.

   4. Add the Approval Depending on Time period Conflict approval definition to the
     corresponding approval phase.

   5. Click Save.

            Note

           In the Approval Depending on Time period Conflict approval definition,
           the tpconflict in $L.file>0 condition indicates that an approval is triggered
           when there is a conflict between a change and an existing time period.
           You can customize this condition as necessary.

Related topics

Time Period Management
Time Period Management concepts
Time Period Management process
Time period workflow
Time period occurrences
Time period recurrence rules
Time period security areas and roles
Configure time period global settings
Configure a time period workflow


Configure time period categories
Configure time period approvals
Configure time period approval notifications
Calculate time period conflicts
Configure time period conflict notifications for Change Management


1.14.8.8. Configure time period conflict
notifications for Change Management

When a change with the Conflict with Freeze Window conflict type is approved, a
notification is sent to the owner of the conflicted time period (type=”Freeze Period”)
to inform that there is a change scheduled in the freeze period.

The steps to configure time period conflict notifications may vary, depending on the
type of change category for which you want to configure.

For legacy change categories such as Hardware and Networks, follow these steps to
configure time period conflict notifications:

   1. Type db in the Service Manager command line, and then press Enter.
   2. Type Object, and then press Enter to open the Search Object Records form.
   3. Type cm3r in the File name field, and then click Search to open the object

     record.
   4. On the Approvals tab, click Find Related Information in the Approval process

     field to open the change.approved Process Definition form.
   5. On the Final Javascript tab, find the JS function that's called by Final Javascript.
   6. Update this JS function.
   7. Click Save.

            Note

           Alternatively, you can directly update
           lib.timeperiodConflict.processTpConflictNotification to configure time
           period conflict notifications.

For new change categories such as Standard, Normal, and Emergency, follow these
steps to configure time period conflict notifications:

   1. Click Change Management > Configuration > Change Workflows.
   2. Select a workflow. For example, Hardware.
   3. Select a transition which leads to the approval process, and then add the

     chm.notificiton.freeze.timeperiod rule set to the transition.
   4. Click Save.


            Note

           If you don't select Send an Email notification to the time period owner
           when the conflicting change is approved, the system will not send email
           notification to the time period owner of the conflicted time period
           (type=”Freeze Period”). See Configure time period global settings for
           more information.

Related topics

Time Period Management
Time Period Management concepts
Time Period Management process
Time period workflow
Time period occurrences
Time period recurrence rules
Time period security areas and roles
Configure time period global settings
Configure a time period workflow
Configure time period categories
Configure time period approvals
Configure time period approval notifications
Calculate time period conflicts
Trigger an approval for time period conflicts

            © Copyright 2026 Open Text
For more info, visit https://docs.microfocus.com
````
