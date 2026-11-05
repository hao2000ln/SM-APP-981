---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.7.4 .. 1.7.6
printed_pages: 1448-1485
---

# 1.7.4 Automated deployment of changes

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.7.4. Automated deployment of changes

Service Manager 9.30 or later provides an enhanced integration with Operations Orchestration
(OO) that allows users to link requests for change (RFCs) to OO flows. This enables users to
implement automated deployment of changes by manually or automatically launching OO
flows.

Before a change moves to the Change Approval phase, you can link OO flows to the Change.
Hence, Service Manager performs each of the change deployment steps and returns the
results. These OO flows originated from out-of-the-box content in OO intended to support
common Change use cases. These use cases including Database Script Execution,
Service/Server Restart, Running Batch Files, etc.

To run the automated flow, select the relevant OO flows and complete all required parameters
of the flows. These parameters can be either fixed or references to attributes of the Request
for Change (RFC) or Configuration Items (CIs) in the RFC. You also need to select when and
how to trigger the Change flows - upon Change approval, based on a schedule or manually.
When a Change moves to the predefined phase, you can manually launch the OO flows from
within Service Manager. Or, the OO flows are automatically executed based on the trigger
conditions you set.

            Note

           The following change categories don't support this feature.

                Subscription
                Unplanned Change

Related topics

     Operations Orchestration (OO)
     Add OO flow links to a new change record
     Add OO flow links to a new change record
     Add OO flow links to an existing change record
     Update OO flow links in a change record
     Remove OO flow links from a change record
     Manually launch change flows
     Automatically launch change flows upon approval
     Automatically launch change flows on a schedule (for a new change)
     Automatically launch change flows on a schedule (for an existing change)
     View execution results of change flows


1.7.4.1. Add OO flow links to a new change
record

User roles: Change Manager, Change Coordinator, and Release Manager
To add OO flow links to a new Change record:

   1. Sign in to the Service Manager Web client.
   2. Click Change Management > Changes > Create New Change.
   3. Select a change category other than Subscription and Unplanned Change.

                   Note

                Do not select any of these categories, because the OO Flow Links feature is
                unavailable for a change record with these change categories.

   4. Complete the form with all required and optional information.
   5. Go to the OO Flow Links section, select a path in the Select Path field, and click Add Link.

     The OO Flow Link Detail form is displayed.
   6. In the Sequence No field, type a number. This number defines the order in which the OO

     flow is automatically launched. Each OO flow link must have a unique Sequence No.
   7. In the Target CIs field, enter the target Configuration Items that will be used when the OO

     flow is launched.

                   Note

                If you are planning to launch the flow manually, you can skip this step.

   8. In the Parameters section, complete the fields listed in the following table as necessary.


Field                                   Value                        Description
Parameter Name                                                       An OO field
                                        Name of an input for the
Required?                               operation(s) of the OO
Mapped Change Field                     flow; can be entered by
                                        the user running the flow,
                                        or set to a specific value,
                                        or obtained from
                                        information gathered by
                                        another step of the OO
                                        flow

                                        true or false                An OO field that indicates
                                                                     whether the parameter is
                                                                     required or not

                                        Select one from the drop-    A custom field
                                        down list.
                                                                     This is a field from the
                                                                     change record used to
                                                                     launch the OO flow. The
                                                                     Change field value is
                                                                     populated when the OO
                                                                     flow is launched. The
                                                                     Change fields listed are
                                                                     defined in the "OO RFC
                                                                     Fields" global list.


Field                                   Value                      Description
Mapped CI Field
                                        Select one from the drop-  A custom field
Default Value                           down list.
                                                                   Useful CI field to launch
                                                                   the OO flow. If there is no
                                                                   Mapped Change Field
                                                                   configured for the
                                                                   parameter, or there is no
                                                                   Mapped Change Field
                                                                   value, the CI field value
                                                                   will be populated when
                                                                   launching the OO flow.
                                                                   The CI fields listed are
                                                                   defined in "OO Fields"
                                                                   global list.

                                        Default value of the       A custom field
                                        parameter
                                                                   If neither Mapped Change
                                                                   Field nor Mapped CI Field
                                                                   is configured for the
                                                                   parameter, or if no value is
                                                                   available in Mapped
                                                                   Change Field or Mapped
                                                                   CI Field, the default value
                                                                   is used when the OO flow
                                                                   is launched.

                                                                   NOTE: This field is not the
                                                                   same field in OO.

 9. Click Add. The OO flow link is added.
10. Click OK. You are returned to the Change form.

                 Note

               If you don't click OK to save and exit, your updates to the Mapped CI Field
               and Default Value fields might be lost.

11. Repeat the steps above to add more links as necessary.
12. Click Save to save the change record.


Related topics

Automated deployment of changes
Add OO flow links to an existing change record
Update OO flow links in a change record
Remove OO flow links from a change record
Manually launch change flows
Automatically launch change flows upon approval
Automatically launch change flows on a schedule (for a new change)
Automatically launch change flows on a schedule (for an existing change)
View execution results of change flows


1.7.4.2. Add OO flow links to an existing
change record

User roles: Change Manager, Change Coordinator, and Release Manager

            Note

           You can update OO flow links only in a change record of a category other than
           either of the following:

                Subscription
                Unplanned Change

To add OO flow links to an existing change record:
   1. Sign in to the Service Manager Web client.
   2. Open an existing change record that meets the conditions previously mentioned.
   3. Go to the OO Flow Links section, select a path in the Select Path field, and click Add Link.
     The OO Flow Link Detail form is displayed.
   4. In the Sequence No field, type a number. This number defines the order in which the OO
     flow is automatically launched. Each OO flow link must have a unique Sequence No.
   5. In the Target CIs field, enter the target Configuration Items that will be used when the OO
     flow is launched.

                   Note

                If you are planning to launch the flow manually, you can skip this step.

   6. In the Parameters section, complete the fields listed in the following table as necessary.


Field                                   Value                        Description
Parameter Name                                                       An OO field
                                        Name of an input for the
Required?                               operation(s) of the OO
Mapped Change Field                     flow; can be entered by
                                        the user running the flow,
                                        or set to a specific value,
                                        or obtained from
                                        information gathered by
                                        another step of the OO
                                        flow

                                        true or false                An OO field that indicates
                                                                     whether the parameter is
                                                                     required or not

                                        Select one from the drop-    A custom field
                                        down list.
                                                                     This is a field from the
                                                                     change record used to
                                                                     launch the OO flow. The
                                                                     Change field value is
                                                                     populated when the OO
                                                                     flow is launched. The
                                                                     Change fields listed are
                                                                     defined in the "OO RFC
                                                                     Fields" global list.


Field                                   Value                      Description
Mapped CI Field
                                        Select one from the drop-  A custom field
Default Value                           down list.
                                                                   Useful CI field to launch
                                                                   the OO flow. If there is no
                                                                   Mapped Change Field
                                                                   configured for the
                                                                   parameter, or there is no
                                                                   Mapped Change Field
                                                                   value, the CI field value
                                                                   will be populated when
                                                                   launching the OO flow.
                                                                   The CI fields listed are
                                                                   defined in "OO Fields"
                                                                   global list.

                                        Default value of the       A custom field
                                        parameter
                                                                   If neither Mapped Change
                                                                   Field nor Mapped CI Field
                                                                   is configured for the
                                                                   parameter, or if no value is
                                                                   available in Mapped
                                                                   Change Field or Mapped
                                                                   CI Field, the default value
                                                                   is used when the OO flow
                                                                   is launched.

                                                                               Note

                                                                              This field is
                                                                              not the same
                                                                              field in OO.

7. Click Add. The OO flow link is added.
8. Click OK. You are returned to the Change form.

               Note

             If you don't click OK to save and exit, your updates to the Mapped CI Field
             and Default Value fields might be lost.


   9. Repeat the steps above to add more links as necessary.
 10. Click Save to save the change record.

Related topics

Automated deployment of changes
Add OO flow links to a new change record
Update OO flow links in a change record
Remove OO flow links from a change record
Manually launch change flows
Automatically launch change flows upon approval
Automatically launch change flows on a schedule (for a new change)
Automatically launch change flows on a schedule (for an existing change)
View execution results of change flows


1.7.4.3. Update OO flow links in a change
record

User roles: Change Manager, Change Coordinator, and Release Manager

            Note

           You can update OO flow links only in a Change record of a category other than
           either of the following:

                Subscription
                Unplanned Change

To update OO flow links in a change record:

   1. Sign in to the Service Manager web client.
   2. Open an existing change record that meets the conditions mentioned at the beginning of

     this topic.
   3. In the OO Flow Links section, click the Seq No of an OO flow link that you want to update.

     The OO Flow Link Detail form opens.
   4. Update the fields as necessary, and then click Save.
   5. Click Cancel. You are returned to the Change form.
   6. Click Save to save the change record.

Related topics

     Automated deployment of changes
     Add OO flow links to a new change record
     Add OO flow links to an existing change record
     Remove OO flow links from a change record
     Manually launch change flows
     Automatically launch change flows upon approval
     Automatically launch change flows on a schedule (for a new change)
     Automatically launch change flows on a schedule (for an existing change)
     View execution results of change flows


1.7.4.4. Remove OO flow links from a change
record

User roles: Change Manager, Change Coordinator, and Release Manager

To remove OO flow links from a change record

   1. Sign in to the Service Manager Web client.

   2. Open the change record from which you want to remove OO flow links.

   3. In the OO Flow Links section, click the Seq No of an OO flow link that you want to remove.
     The OO Flow Link Detail form opens.

   4. Click Delete, and then click YES to confirm the deletion.

     You are returned to the Change form with the OO flow link removed.

   5. Click Save to save the change record.

Related topics

     Automated deployment of changes
     Add OO flow links to a new change record
     Add OO flow links to an existing change record
     Update OO flow links in a change record
     Manually launch change flows
     Automatically launch change flows upon approval
     Automatically launch change flows on a schedule (for a new change)
     Automatically launch change flows on a schedule (for an existing change)
     View execution results of change flows


1.7.4.5. Manually launch change flows

User roles: Change Manager, Change Coordinator, and Release Manager

Once a change record is approved and advances to the pre-defined phase, you can select to
manually launch the OO flows linked to the change record.

            Note

           You can update OO flow links only in a change record of a category other than
           either of the following:

                Subscription
                Unplanned Change

To manually launch OO flows from a change record:

   1. Sign in to the Service Manager Web client.
   2. Open an existing change record that meets the conditions previously mentioned.

   3. Click More, and then select Execute OO Flow.

           If there is no OO flow linked to the change, an error message appears: "No related
           OO flows found."
           If there is only one OO flow linked to the change, the Select Affected CI for OO Flow
           page opens.
           If there are multiple OO flows linked to the change, the Select an OO Flow page
           opens. Select an OO flow from the table. The Select affected CI for OO flow page
           opens.

   4. Select an affected CI from the table or click Skip to go to the next page if there are no CIs
     related to this OO flow. The Set Parameters page opens.

           If the selected OO flow has a parameter with a Mapped Change Field (for example,
           Impact) and the change has a corresponding value for this Mapped Change Field,
           this Impact field value from the change will be automatically populated as the value
           of this OO flow parameter. If the Mapped Change Field is an array type field, the
           values of the array will be combined and separated by commas (,).
           If the selected OO flow has a parameter with a Mapped CI Field (for example, Ip
           Address) and the Affected CI of the change has a corresponding value (for example,
           an IP address) for this Mapped CI Field, this affected CI field value from the change
           will be automatically populated as the value of this OO flow parameter. If the
           mapped CI field is an array type field, the values of the array will be combined and
           separated by commas (,).
           If the selected OO flow has a parameter without a Mapped Change Field or Mapped
           CI Field, the value specified in its Default Value field will be populated.


   5. Provide all the required parameter values for the selected OO flow.

                   Note

                In some cases, you may need to add additional parameter names and specify
                their values.

   6. (Optional) If you want the OO flow to be executed asynchronously, select Asynchronous.

   7. Click Next. The selected OO flow is launched, and you are returned to the Select an OO
     Flow page when the change is linked to more than one OO flow.

                   Note

                If you don't want to launch more OO flows, click Finish instead of Next to
                launch the selected OO flow and return to the change form.

   8. Continue to launch more OO flows from the list on the Select an OO Flow page.
   9. Click Finish.

 10. Once an OO flow execution is complete, a dialog box opens, stating that the execution is
     done and asking if you want to view the execution result.

           Click Yes to view the execution result in Operations Orchestration.

           If LW-SSO is configured in both the Service Manager Web client and Operations
           Orchestration, the execution result in Operations Orchestration is displayed without
           any login prompt. If LW-SSO is not configured, an Operations Orchestration log-in
           page opens; after you sign in to Operations Orchestration, the execution result is
           displayed.

           Click No to close the dialog box.

Related topics

Automated deployment of changes
Automated deployment of changes
Add OO flow links to a new change record
Enable LW-SSO for the Operations Orchestration integration
Add OO flow links to a new change record
Add OO flow links to an existing change record
Update OO flow links in a change record
Remove OO flow links from a change record
Automatically launch change flows upon approval
Automatically launch change flows on a schedule (for a new change)
Automatically launch change flows on a schedule (for an existing change)
View execution results of change flows


1.7.4.6. Automatically launch change flows
upon approval

User roles: Change Manager, Change Coordinator, and Release Manager

You can set a change record so that the linked OO flows are executed automatically once it
gets approved and moved to the predefined phase.

   1. Sign in to the Service Manager Web client.

   2. Open a change in the Change Assessment & Planning phase (or in the Assess or the Plan
     and Design phase if the change has a category of Release Management).

   3. In the OO Flow Links section, select When approved as the Automation Type.

   4. Click Save to save the change record.

   5. Once an IT agent approves the change, click Close Phase to move the change to the
     predefined phase.

     Service Manager creates a scheduler of OO Flow Automation and starts it in 50 seconds,
     and the alert stage is SMOO Auto-Approval.

     The OO flows are automatically executed, and all the execution reports are saved in an
     activity log with an operator of smoo-automation.

Related topics

     Automated deployment of changes
     Add OO flow links to a new change record
     Add OO flow links to an existing change record
     Update OO flow links in a change record
     Remove OO flow links from a change record
     Manually launch change flows
     Automatically launch change flows on a schedule (for a new change)
     Automatically launch change flows on a schedule (for an existing change)
     View execution results of change flows


1.7.4.7. Automatically launch change flows on
a schedule (for a new Change)

User roles: Change Manager, Change Coordinator, and Release Manager
You can select to trigger the automatic execution of Change flows at a scheduled time: either a
specific date and time, or a future time based on a field value of a Change, such as Planned
Start, Planned End, and Requested End Date. Once the Change is approved and advances to
the pre-defined phase, the OO flows linked to this Change record will be automatically
launched at the scheduled time.
To set an automatic execution time for OO flows of a new Change:

   1. Sign in to the Service Manager Web client.
   2. From Change Management, click Create New Change.
   3. Select a Change category other than Subscription and Unplanned Change.

                   Note

                The OO Flow Links feature is unavailable for a Change record with any of
                these Change categories.

   4. Complete the form with all required and optional information.
   5. In the OO Flow Links section, do either of the following:

     Select Use a fixed date as the Automation Type. The Scheduled Time field is displayed.
     Select a date and specify a time, for example, 06/04/10 10:00:00 .

                   Note

                The date/time format is determined by your profile date/time format.

     Or
     Select Use a field in the record + interval as the Automation Type. The Change Field and
     Interval fields are displayed. Select a field in the Change Field list as the base time, and
     then enter a value in the Interval field using the +/-ddd hh:mm:ss format. Note that a
     space is required between ddd and hh , and you can omit the plus sign ( + ) for positive
     intervals.
     For example, if you select Requested End Date in Change Field and enter -1 02:30:10 in
     Interval, the OO flows of the Change will be automatically launched one day, two hours,
     thirty minutes, and ten seconds before the Requested End Date.


            Note

                The automation execution time should be a future time between the Planned
                Start and Planned End.
                The automation execution time you selected is invalidated now. Instead, the
                time will be validated when the Change moves to the pre-defined phase. If
                the validation fails, you will receive a warning and the Change can't advance
                to implementation. In this case, you have to reset the execution time. To do
                so, click Cancel and move the Change back to a phase prior to Change
                Approval (or back to Assess or Plan and Design), reset the automation
                execution time, and then go through the Change phases again.

Related topics

Automated deployment of Changes
Add OO flow links to a new Change record
Add OO flow links to an existing Change record
Update OO flow links in a Change record
Remove OO flow links from a Change record
Manually launch Change flows
Automatically launch Change flows upon approval
Automatically launch Change flows on a schedule (for an existing Change)
View execution results of Change flows


1.7.4.8. Automatically launch change flows on
a schedule (for an existing change)

User roles: Change Manager, Change Coordinator, and Release Manager

            Note

           You can update OO flow links only in a change record of a category other than
           either of the following:

                Subscription
                Unplanned Change

To set an automatic execution time for OO flows of an existing change:
   1. Sign in to the Service Manager Web client.
   2. Open an existing change record that meets the conditions previously mentioned.
   3. In the OO Flow Links section, do either of the following:
     Select Use a fixed date as the Automation Type. The Scheduled Time field is displayed.
     Select a date and specify a time, such as 06/04/10 10:00:00 .

                   Note

                The date/time format is determined by your profile date/time format.

     Or
     Select Use a field in the record + interval as the Automation Type. The Change Field and
     Interval fields are displayed. Select a field in the Change Field list as the base time, and
     then enter a value in the Interval field using the +/-ddd hh:mm:ss format. Note that a
     space is required between ddd and hh , and you can omit the plus sign ( + ) for positive
     intervals.
     For example, if you select Requested End Date in Change Field and enter -1 02:30:10 in
     Interval, the OO flows of the change will be automatically launched one day, two hours,
     thirty minutes, and ten seconds before the Requested End Date.


            Note

                The automation execution time should be a future time between the Planned
                Start and Planned End.
                The automation execution time you selected is invalidated now. Instead, the
                time will be validated when the change moves to the pre-defined phase. If the
                validation fails, you will receive a warning and the change can't advance to
                implementation. In this case, you have to reset the execution time. To do so,
                click Cancel and move the change back to a phase prior to Change Approval
                (or back to Assess or Plan and Design), reset the automation execution time,
                and then go through the change phases again.

Related topics

Automated deployment of changes
Add OO flow links to a new change record
Add OO flow links to an existing change record
Update OO flow links in a change record
Remove OO flow links from a change record
Manually launch change flows
Automatically launch change flows upon approval
Automatically launch change flows on a schedule (for a new change)
View execution results of change flows


1.7.4.9. View execution results of change
flows

User roles: Change Manager, Change Coordinator, and Release Manager

OO flow execution results are saved in Service Manager in different ways depending on how
they're executed: manually or automatically.

To view OO flow execution results from a change record:

   1. Sign in to the Service Manager Web client.
   2. From Change Management, search for a change record and open it.

   3. In the Activities section, do one of the following:

           Select an activity of the OO Response type from the activities list. The Activity Log -
           Change Management page opens, displaying the execution details of an OO flow
           manually launched from this change.
           Select an activity that has a type of OO Response and an operator of smoo-
           automation. The execution results of all the OO flows automatically executed are
           saved in this log as separate links.

   4. Click Open Report.

                   Note

                For automatically executed OO flows, clicking Open Report opens only the
                report link of the first OO flow. You can view the reports of the other OO flows
                directly in OO.

     If you have configured Lightweight Single Sign-On (LW-SSO) in both the SM web client
     and Operations Orchestration, SM displays execution results in Operations
     Orchestration without any login prompt. If you haven't configured LW-SSO, an Operations
     Orchestration login page opens, and displays the execution result after you sign in.

Related topics

     Automated deployment of changes
     Add OO flow links to a new change record
     Add OO flow links to an existing change record
     Update OO flow links in a change record
     Remove OO flow links from a change record
     Manually launch change flows
     Automatically launch change flows upon approval
     Automatically launch change flows on a schedule (for a new change)
     Automatically launch change flows on a schedule (for an existing change)


1.7.5. Automated implementation of change
tasks

Service Manager provides an enhanced integration with Operations Orchestration (OO) that
allows users to link change tasks to OO flows. This enables users to implement automated
fulfillment of change tasks by manually or automatically launching OO flows.

You can add OO flow links to the "Automation" tasks planned in change models. Depending on
your configuration, when the change tasks are opened in change records, the OO flows are
automatically executed or you can manually launch the OO flows. Or, you can add an OO flow
to a change task directly from a change record via record level task planner.

            Note

           In the out-of-the-box environment, this feature is only supported for the tasks in
           the Automation task category.

Related topics

     Operations Orchestration (OO)
     Add an Operations Orchestration integration
     Enable OO flow automation for change tasks
     Add an OO flow link to a change task
     Execute an OO flow from a change task


1.7.5.1. Enable OO flow automation for change
tasks

Applies to User Roles: System Administrators

To enable OO flow automation for change tasks, follow these steps:

   1. Make sure that the Operations Orchestration integration is set up. For details, see Add an
     Operations Orchestration integration.

   2. Navigate to Tailoring > Process Designer > Configuration > Task Planner Mapping, and
     then click Search.

   3. Locate and open the "cm3r" task planner mapping record, which contains the status
     mapping information between change task and task planner.

   4. Select the Enable OO Flow for Automation checkbox.
   5. Click Save.
   6. Navigate to Miscellaneous > System Status, click the Start Scheduler button, and then

     click AutomationTaskUpdate to start this schedule. When this schedule is started, the
     status of the change task can be automatically updated after the OO flow execution.

Related topics

Automated implementation of change tasks
Add an Operations Orchestration integration
Add an OO flow link to a change task
Execute an OO flow from a change task


1.7.5.2. Add an OO flow link to a change task

User roles: Change Manager, Change Coordinator

Before you can add an OO flow link to a change task, make sure that you have already enabled
the OO flow automation for change tasks. For details, see Enable OO flow automation for
change tasks.

You can add OO flow links to the change tasks by planning tasks in change models or directly
in change records. Then, the changes will contain the change tasks associated with the OO
flows that you defined.

To add an OO flow link to a change task in a change model, follow these steps:

            Note

           If you want to add an OO flow link directly to a change task from a change record
           instead of change model, open the task planner from the change record.

   1. Sign in to the Service Manager Web client.
   2. Click Change Management > Configuration > Change Models.
   3. Search for and open the change model record that you want to modify.
   4. Go to the Task Information section, and then click OO Flow Configuration. The OO Flow

     Configuration form is displayed.

   5. Select an OO flow in the Select Path field, and then click Add Link. The OO Flow Details
     form is displayed.

   6. Type a name for the OO flow link.
   7. Select the Execute Automatically checkbox if you want to execute the OO flow

     automatically. Otherwise, clear the checkbox so that you can manually execute the OO
     flow by clicking Execute OO Flow from the change task records.

   8. In the General Parameters section and the Secure Parameters section, complete the
     fields listed in the following table for each parameter as necessary.


Field                                   Value                        Description
Parameter Name
Required?                               Name of an input for the     An OO field.
Default Value                           operations of the OO flow;
                                        can be entered by the
Value Type                              user running the flow, or
                                        set to a specific value, or
                                        obtained from information
                                        gathered by another step
                                        of the OO flow

                                        true or false                An OO field that indicates
                                                                     whether the parameter is
                                                                     required or not.

                                        Default value of the         A custom field.
                                        parameter
                                                                     If the Value field is not
                                                                     configured for the
                                                                     parameter, or if no value is
                                                                     available in the Value field,
                                                                     the default value is used
                                                                     when the OO flow is
                                                                     launched.

                                                                                 Note

                                                                                This field is
                                                                                not the same
                                                                                field in OO.

                                        Available Types are:         A custom field.

                                        • Additional Properties      The value type defines
                                        • Parent File                where the OO flow
                                        • Current File               parameter value can be
                                        • User Options               retrieved when the OO
                                        • JavaScript                 flow is launched.

                                        Select one from the drop-
                                        down list.


Field                                   Value                       Description
Value
                                        The available fields based  A custom field.
Join?                                   on the selected value
Join Table                              type. Select one from the   The value of the selected
                                        drop-down list.             field will be used to launch
                                                                    the OO flow.

                                                                    Note

                                                                    If Join Table is
                                                                    set to true,
                                                                    this "Value" is
                                                                    used to match
                                                                    the "Join Table
                                                                    Field" to
                                                                    identify the
                                                                    corresponding
                                                                    value for the
                                                                    specified
                                                                    "Select Field",
                                                                    which is then
                                                                    used to launch
                                                                    the OO flow.

                                        true or false               A custom field.

                                                                    If it is set to true, Join
                                                                    Table name is required.

                                        All available table names.  A custom field.
                                        Select one from the drop-
                                        down list.                  Select the join table name.
                                                                    For example, if the value
                                                                    type is "Parent File" (in
                                                                    change task planner, the
                                                                    Parent File is "change")
                                                                    and the value is "Affected
                                                                    Service", when the Join
                                                                    Table is selected, you may
                                                                    select the Join Table
                                                                    Name as "device".


Field                                   Value                        Description
Join Table Field
                                        Available fields based on    A custom field.
Select Field                            the selected Join Table.
                                        Select one from the drop-    The field list of the
                                        down list.                   selected Join Table. The
                                                                     value of this field should
                                                                     match the value of the
                                                                     "Value" field. For example,
                                                                     "CI Identifier" should be
                                                                     selected in Join Table
                                                                     Field if "Affected Service"
                                                                     is selected as the "Value"
                                                                     of the Parent File value
                                                                     type.

                                        A field other than the Join  A custom field.
                                        Table Field in the Join
                                        Table.                       The value of the selected
                                                                     field will be used to launch
                                        Select one from the drop-    the OO flow when Join
                                        down list.                   Table is used.

               Note

             If you want the change task to be performed on all Affected Configuration
             Items of the change record when the OO flow is launched, click the parameter
             links to configure the Value Type field as Parent File and the Value field as
             Affected Configuration Item.

9. In the Secure Parameters section, complete the fields for security parameters as
  necessary.

Field                                   Value                                     Service Manager 9.81
Field Name                              Name of the security
                                        parameter             Description
Required?                               true or false
                                                              An OO field.
Default Value                           Default value of the
                                        parameter             An OO field that indicates
                                                              whether the parameter is
                                                              required or not.

                                                              A custom field.
                                                              If the Value field is not
                                                              configured for the
                                                              parameter, or if no value is
                                                              available in the Value field,
                                                              the default value is used
                                                              when the OO flow is
                                                              launched.

                                                                          Note

                                                                         This field is
                                                                         not the same
                                                                         field in OO.

 10. Click Save and Exit, and then go back to the Task Information section in the change
     model.

 11. Click Edit to open the task planner.
 12. Select or create a change task that's in the "Automation" task category.
 13. In the OO Flow Link drop-down list, select the OO flow link that you added.
 14. Click Save. The OO flow link is now added to the change task of the change model. The

     changes that use this change model will contain the change task with the OO flow link
     that you defined.

Related topics

Automated implementation of change tasks
Add an Operations Orchestration integration
Enable OO flow automation for change tasks
Execute an OO flow from a change task


1.7.5.3. Execute an OO flow from a change task

Security roles: Change Coordinator, Change Analyst

Suppose you have selected the Execute Automatically checkbox in the OO flow link
configuration. Once a change task linked to that OO flow moves to the Execution phase, the
associated OO flow will execute automatically. Otherwise, you need to manually execute the
OO flow from the change task record.

To manually launch an OO flow from a change record, follow these steps:

   1. Sign in to the Service Manager Web client.
   2. Click Change Management > Search Tasks, and then search for and open the change

     task that requires a manual execution of the OO flow link.
   3. From the change task record, click the Execute OO Flow button.
   4. Verify the OO flow configuration, and then click OK to execute the OO flow.

When the OO flow is successfully executed, the change task moves to the Completion phase
automatically. If additional properties are defined, the change analyst or change coordinator
needs to manually fill in the OO execution results in the additional properties. Hence, the
remaining tasks can benefit from the output of the current automation task.

If the OO flow execution fails, the change task moves to the Review phase automatically. After
review, you can launch the OO flow again manually, or you can cancel or close the change
task.

To view the execution result of the OO flow, follow these steps:

   1. Open a change task record.
   2. From the Activities tab, you can find the OO execution result shown as activity logs.
   3. Click the Show Report button if you want to check the execution result in OO.

Related topics

Automated implementation of change tasks
Add an Operations Orchestration integration


Enable OO flow automation for change tasks
Add an OO flow link to a change task


1.7.6. Automated fulfillment of request tasks

Service Manager 9.40 or later provides an enhanced integration with Operations Orchestration
(OO) that allows users to link request tasks to OO flows. This enables users to implement
automated fulfillment of request tasks by manually or automatically launching OO flows.

You can add OO flow links to the "Automation" tasks planned in request models. Then, when
the request tasks are opened in request records, the OO flows are automatically executed or
you can manually launch the OO flows, depending on the configuration of the OO flow links.
Or, you can add an OO flow to a request task directly from a request record.

            Note

           In the out-of-the-box environment, this feature is only supported for the tasks in
           the Automation category.

Related topics

     Operations Orchestration (OO)
     Add an Operations Orchestration integration
     Enable OO flow automation for request tasks
     Add an OO flow link to a request task
     Execute an OO flow from a request task


1.7.6.1. Enable OO flow automation for request
tasks

User roles: System Administrators

To enable OO flow automation for request tasks, follow these steps:

   1. Make sure that the Operations Orchestration integration is set up. For details, see Add an
     Operations Orchestration integration.

   2. Navigate to Tailoring > Process Designer > Configuration > Task Planner Mapping, and
     then click Search.

   3. Locate and open the "request" task planner mapping record, which contains the status
     mapping information between request task and task planner.

   4. Select the Enable OO Flow for Automation checkbox.
   5. Click Save.
   6. Navigate to Miscellaneous > System Status, click the Start Scheduler button, and then

     click AutomationTaskUpdate to start this schedule. When this schedule is started, the
     status of the request task can be automatically updated after the OO flow execution.

Related topics

Automated fulfillment of request tasks
Add an Operations Orchestration integration
Add an OO flow link to a request task
Execute an OO flow from a request task


1.7.6.2. Add an OO flow link to a request task

User roles: Request Manager, Request Coordinator

Before you can add an OO flow link to a request task, make sure that you have already enabled
the OO flow automation for request tasks. For details, see Enable OO flow automation for
request tasks.

You can add OO flow links to the request tasks by planning tasks in request models or directly
in request records. Then, the requests will contain the request tasks associated with the OO
flows that you defined.

To add an OO flow link to a request task in a request model, follow these steps:

            Note

           If you want to add an OO flow link directly to a request task from a request record
           instead of request model, open the task planner from the request record.

   1. Sign in to the Service Manager Web client.
   2. Click Request Fulfillment > Configuration > Request Models.
   3. Search for and open the request model record that you want to modify.
   4. Go to the Task Information section, and then click OO Flow Configuration. The OO Flow

     Configuration form is displayed.

   5. Select an OO flow in the Select Path field, and then click Add Link. The OO Flow Details
     form is displayed.

   6. Type a name for the OO flow link.
   7. Select the Execute Automatically checkbox if you want to execute the OO flow

     automatically. Otherwise, clear the checkbox so that you can manually execute the OO
     flow by clicking Execute OO Flow from the request task records.

   8. In the General Parameters section and the Secure Parameters section, complete the
     fields listed in the following table for each parameter as necessary.


Field                                   Value                        Description
Parameter Name
Required?                               Name of an input for the     An OO field.
Default Value                           operations of the OO flow;
                                        can be entered by the
Value Type                              user running the flow, or
                                        set to a specific value, or
                                        obtained from information
                                        gathered by another step
                                        of the OO flow

                                        true or false                An OO field that indicates
                                                                     whether the parameter is
                                                                     required or not.

                                        Default value of the         A custom field.
                                        parameter
                                                                     If the Value field is not
                                                                     configured for the
                                                                     parameter, or if no value is
                                                                     available in the Value field,
                                                                     the default value is used
                                                                     when the OO flow is
                                                                     launched.

                                                                                 Note

                                                                                This field is
                                                                                not the same
                                                                                field in OO.

                                        Available Types are:         A custom field.

                                        • Additional Properties      The value type defines
                                        • Parent File                where the OO flow
                                        • Current File               parameter value can be
                                        • User Options               retrieved when the OO
                                        • JavaScript                 flow is launched.

                                        Select one from the drop-
                                        down list.


Field                                   Value                       Description
Value
                                        The available fields based  A custom field.
Join Table?                             on the selected value
Join Table Name                         type. Select one from the   The value of the selected
                                        drop-down list.             field will be used to launch
                                                                    the OO flow.

                                                                    Note

                                                                    If Join Table is
                                                                    set to true,
                                                                    this "Value" is
                                                                    used to match
                                                                    the "Join Table
                                                                    Field" to
                                                                    identify the
                                                                    corresponding
                                                                    value for the
                                                                    specified
                                                                    "Select Field",
                                                                    which is then
                                                                    used to launch
                                                                    the OO flow.

                                        true or false               A custom field.

                                                                    If it is set to true, Join
                                                                    Table Name is required.

                                        All available table names.  A custom field.
                                        Select one from the drop-
                                        down list.                  Select the join table name.
                                                                    For example, if the value
                                                                    type is "Parent File" (in
                                                                    request task planner, the
                                                                    Parent File is "request")
                                                                    and the value is "Affected
                                                                    Service", when the Join
                                                                    Table is selected, you may
                                                                    select the Join Table
                                                                    Name as "device".


Field                                   Value                        Description
Join Table Field
                                        Available fields based on    A custom field.
Select Field                            the selected Join Table
                                        Name. Select one from        The field list of the
                                        the drop-down list.          selected Join Table. The
                                                                     value of this field should
                                                                     match the value of the
                                                                     "Value" field. For example,
                                                                     "CI Identifier" should be
                                                                     selected in Join Table
                                                                     Field if "Affected Service"
                                                                     is selected as the "Value"
                                                                     of the Parent File value
                                                                     type.

                                        A field other than the Join  A custom field.
                                        Table Field in the Join
                                        Table.                       The value of the selected
                                                                     field will be used to launch
                                        Select one from the drop-    the OO flow when Join
                                        down list.                   Table is used.

9. In the Secure Parameters section, complete the fields for security parameters as
  necessary.

Field                                   Value                                     Service Manager 9.81
Field Name                              Name of the security
                                        parameter             Description
Required?                               true or false
                                                              An OO field.
Default Value                           Default value of the
                                        parameter             An OO field that indicates
                                                              whether the parameter is
                                                              required or not.

                                                              A custom field.
                                                              If the Value field is not
                                                              configured for the
                                                              parameter, or if no value is
                                                              available in the Value field,
                                                              the default value is used
                                                              when the OO flow is
                                                              launched.

                                                                          Note

                                                                         This field is
                                                                         not the same
                                                                         field in OO.

 10. Click Add. The OO flow link is added.

 11. Click Save and Exit, and then go back to the Task Information section in the request
     model.

 12. Click Edit to open the task planner.
 13. Select or create a request task that's in the "Automation" task category.
 14. In the OO Flow Link drop-down list, select the OO flow link that you added.
 15. Click Save. The OO flow link is now added to the request task of the request model. The

     requests that use this request model will contain the request task with the OO flow link
     that you defined.

Related topics

Automated fulfillment of request tasks
Add an Operations Orchestration integration
Enable OO flow automation for request tasks
Execute an OO flow from a request task


1.7.6.3. Execute an OO flow from a request
task

Security roles: Request Coordinator, Request Analyst

Suppose you have selected the Execute Automatically checkbox in the OO flow link
configuration. Once a request task linked to that OO flow moves to the Active phase, the
associated OO flow will execute automatically. Otherwise, you need to manually execute the
OO flow from the request task record.

To manually launch an OO flow from a request record, follow these steps:

   1. Sign in to the Service Manager Web client.
   2. Click Request Fulfillment > Search Request Tasks, and then search for and open the

     request task that requires a manual execution of the OO flow link.
   3. From the request task record, click the Execute OO Flow button.
   4. Verify the OO flow configuration, and then click OK to execute the OO flow.

When the OO flow is successfully executed, the request task moves to the Completion phase
automatically. If additional properties are defined, the request analyst or request coordinator
needs to manually fill in the OO execution results in the additional properties. Hence, the
remaining tasks can benefit from the output of the current automation task.

If the OO flow execution fails, the request task moves to the Review phase automatically. After
review, you can launched the OO flow manually again, or you can cancel or close the request
task.

To view the execution result of the OO flow, follow these steps:

   1. Open a request task record.
   2. From the Activities tab, you can find the OO execution result shown as activity logs.
   3. Click the Show Report button if you want to check the execution result in OO.

Related topics


Automated fulfillment of request tasks
Add an Operations Orchestration integration
Enable OO flow automation for request tasks
Add an OO flow link to a request task
````
