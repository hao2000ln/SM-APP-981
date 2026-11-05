---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.6.3.6 .. 1.6.3.6
printed_pages: 1550-1587
---

# 1.6.3.6 Process Designer workflows

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.6.3.6. Process Designer workflows

A workflow is a collection of phases with transitions from one phase to another. Each
phase represents the state of the workflow linked to a form for data capture.
Transitions can connect phases in any manner such as creating parallel branches or
loop backs to previous branches.

A workflow enables an implementer to graphically layout the entire lifecycle of a
process or record without any programming knowledge. The end user of the
workflow views the same graphical workflow to see the current phase and past
transitions.

Before you create a new workflow, you must add rules and rule sets to the phases
and transitions of your intended workflow.

Related topics

Workflow phases
Workflow transitions
Add a phase


1.6.3.6.1. Create a workflow

Applies to User roles: System Administrator, Implementer

            Note

           You can create a workflow only in the web client.

After you have a basic workflow, you can then modify it by adding additional phases,
transitions, rules, and actions to match the business process.
You can click Zoom in or Zoom out in the toolbar either to zoom in or zoom out on the
workflow page.
To create a workflow, follow these steps:

   1. Click Tailoring > Process Designer > Workflows.
   2. Click New.
   3. Type a name for the workflow. For example, demo_Workflow.

                   Note

                You can't modify a workflow name once it is set.

   4. Type a description for the workflow.
   5. Select an Service Manager table from the drop-down list to associate the table

     with the new workflow, for example kmdocument.

                   Note

                You can use the kmdocument table to manage the Knowledge
                Management document process. You can use the WorkflowDemo
                table to explore Process Designer capabilities.

   6. Click OK. The new workflow demo_Workflow appears in the Workflows list.


            Note

                The Proprietary workflows are accompanied by a company logo in
                the workflow list. Non-proprietary workflows aren't accompanied by
                a logo.
                If you want to edit a Proprietary workflow or use it as a model,
                create a copy of this Proprietary workflow.

After you created a basic workflow, modify the Object record of the table for the new
workflow.

            Note

           Modifying the Object record is only required for the Knowledge
           Management module. All other modules that use Process Designer set the
           workflows in each of the Category records. For other modules using
           Process Designer, update the category record.

To modify the object record, follow these steps:

   1. Click Tailoring > Document Engine > Objects.
   2. Under File name, provide the table name of the associated workflow. For

     example, "kmdocument."
   3. Select In Object in Workflow Location drop-down list.
   4. Select the workflow name in Workflow drop-down list.
   5. Click Save.

Related topics

Workflow transitions
Workflow phases
Add a phase


1.6.3.6.2. Copy an existing workflow

Applies to User roles: System Administrator, Implementer

You can clone an existing workflow to use it in another business process or if you
need to make changes to a Proprietary workflow. You also have an option to copy the
rule sets of the existing workflow.

To copy an existing workflow, follow these steps:

   1. Click Tailoring > Process Designer > Copy Existing Workflow.
   2. In the Clone a Workflow form, select the workflow that you want to copy.
   3. Type a new workflow name.
   4. Click Copy rule sets checkbox if you want to copy rule sets.
   5. Type a rule set prefix.
   6. Click Next.
   7. Click Workflows . The newly-copied workflow is displayed.


1.6.3.6.3. Export a Workflow

You can export a workflow from Process Designer into a Service Manager unload file.
You can then use that unload file to import the workflow into another Process
Designer-based Service Manager system.

            Note

           The export only includes the related records in the Workflow,
           WorkflowPhase, and RuleSet tables. Processes and Java Scripts called
           from rules sets can't be exported.

To export a workflow to an unload file, follow these steps:

   1. Navigate Tailoring > Process Designer > Export Workflow.
   2. In the Export/Unload a Workflow tab, select a Process Designer Table from the

     Table drop-down.
   3. Select the workflow from the Workflow Name field.
   4. Enter an appropriate name in the External File Name box.
   5. Select or clear the Append to file checkbox as appropriate.

                   Note

                Note: If you wish to append this workflow to an existing unload file,
                enter the unload file name, and make sure that the Append to file
                checkbox is checked. You can use this mechanism to build a single
                unload file that contains multiple workflows that you can later import
                into another Process Designer-based Service Manager system.

   6. Click Ok.

After the file is created, save the file to an appropriate location. You can then import
the generated unload file to in another Process Designer-based Service Manager
system.


1.6.3.6.4. Workflow phases

Workflow phases show the state of a record in the workflow and provide processing
that must occur for the record to move to the next phase. Phases use transitions to
move from one phase to another phase. Some of this processing can be manual, or it
can be triggered by the rules or actions specified for that specific phase.

Within a workflow, you can specify a form to display when that phase is active. Use
different forms on different phases to allow different information to be displayed and
captured at various stages of the workflow.

Rule sets are defined in the phase or transition to enforce business logic, such as
checking if the user has entered the required data or has proper security to perform a
transition.

Related topics

Workflow transitions
Add a phase


1.6.3.6.4.1. Add a phase

Applies to User roles: System Administrator, Implementer
You can add a phase to an existing workflow by using the graphical interface of the
workflow editor.

            Note

           After you add a phase and click Save, you can't modify its name. You can
           modify only its display name.

To add a phase to a workflow, follow these steps:

   1. Click Tailoring > Process Designer > Workflows from the System Navigator to
     display the workflows list.

   2. Select the applicable workflow for which you want to add a phase.
   3. Click Add phase.
   4. Drag the mouse to add a new transition and a phase.
   5. Enter the details described in the tables.

Details

 Phase Order                                                                                    Service Manager 9.81

 Name                                   The Phase Order field gives a
 Display name                           numerical order number to each phase
 Table name                             of a workflow. These numbers are used
 Form Edit condition                    in calculations for Service Level
                                        Targets (SLTs) and similar metrics, so
This PDF was generated on May 23, 2026  that the number and timestamps of
                                        entries and exits from specific phases
                                        can be tracked. For example, an
                                        SLT calculation can determine the time
                                        of entry to the final phase and
                                        therefore determine whether a breach
                                        has occurred.
                                        As best practice, you should specify
                                        your starting phase as 1, and your
                                        closing phase as the highest number.
                                        We also recommend that these
                                        numbers should be roughly sequential
                                        from phase to phase. However, some
                                        workflows may loop multiple times
                                        through a sequence or take divergent
                                        paths.

                                        Type the name of the tab.

                                        Type the display name of the tab.

                                        The selected table name during
                                        workflow creation. You can't modify it.

                                        If the condition evaluates to true for a
                                        user, who will be able to edit the form.
                                        If it doesn't, the form will be read-only.

                                                                                                                          Page 16 of 188
Records in this phase are active                                                                Service Manager 9.81
Make this the first phase
Make this the default phase             Select the checkbox if you want the
                                        records in this phase to be active.

                                        Click Make this the first phase if you
                                        want it to be the first phase.

                                        Click Make this the default phase if
                                        you want it to be the default phase.
                                        Click Save.

                                                    Note

                                                   If the current phase of a
                                                   record is set to a phase that
                                                   doesn't exist in the current
                                                   workflow, it will be moved
                                                   to the default phase. This
                                                   may occur if a phase is
                                                   removed from a workflow
                                                   or if data is imported from
                                                   another source that did not
                                                   share the same workflow.

 Additional Phase Information                                                                   Service Manager 9.81

 Description                            Click Additional Phase Information to
Forms                                   open the Extended Phase Information
                                        page to modify phase information.

                                                    Note

                                                   Only the Change
                                                   Management module
                                                   supports this feature.

                                                   You can't edit or delete a
                                                   phase name from the
                                                   Extended Phase
                                                   Information page or the
                                                   cm3rcatphase.main form.

                                                   Change Management
                                                   workflows have unique
                                                   workflow phases but they
                                                   will share change phases if
                                                   the workflow phases have
                                                   the same name. For
                                                   example, if the Workflow1
                                                   and Workflow2 each have a
                                                   phase named ‘Build and
                                                   Test’ they will share the
                                                   same change phase
                                                   record.

                                        Enter a description of the workflow
                                        phase. This field supports hyperlinks.

 Display form                                                                                   Service Manager 9.81

This PDF was generated on May 23, 2026  The display form is the primary method
                                        to capture and display data. If you
                                        don't specify a form, the system will
                                        look for a form that has the same name
                                        as the current table name.

                                        To add a display form, follow these
                                        steps:

                                           1. Select the display form from the
                                             Default Display form drop-down
                                             list.

                                           2. Click Save.

                                        To add a display form that's selected
                                        by a condition or set of conditions,
                                        follow these steps:

                                           1. In the Additional/Display forms
                                             section, click Add.

                                           2. In the Name drop-down list,
                                             select the form name.

                                           3. In the Description field, type a
                                             description of the form.

                                           4. Click the Form Condition field and
                                             use the condition editor to enter a
                                             condition.

                                           5. In the Type drop-down list, select
                                             Display Form.

                                           6. Click Update to add the additional
                                             form.

                                                    Note

                                                   You may also specify a
                                                   form in a RAD expression,
                                                   for example “display.form
                                                   in $L.category”.

                                                                                                                          Page 19 of 188
 Additional Forms                                                                               Service Manager 9.81
Rule sets
                                        You can add, edit, and delete additional
                                        forms for a workflow phase.

                                        To add an additional form to a workflow
                                        record, follow these steps:

                                           1. Click Add.
                                           2. In the Name drop-down list,

                                             select the table name.
                                           3. In the Description field, type a

                                             description of the form.
                                           4. Click the Form Condition field and

                                             enter a condition.
                                           5. In the Type drop-down list, select

                                             Additional Form.
                                           6. Click Update to add the additional

                                             form.


Add                                     To add rule sets at various stages:

                                        1. Click the On enter, After
                                          successful enter, On exit,
                                          Initialization, On display, On
                                          update, or After successful
                                          update tab. Form more
                                          information, see the note after
                                          step 4.

                                        2. Click Add.
                                        3. Select the appropriate rule sets

                                          checkbox you want to add.
                                        4. Click Save.

This PDF was generated on May 23, 2026                                   Service Manager 9.81

                                        Note

                                        You may also specify a
                                        form in a RAD expression,
                                        for example “display.form
                                        in $L.category”.

                                             On enter – Runs when
                                             the record tries to
                                             move from another
                                             phase into this phase.
                                             For example, the rule
                                             set can set the time at
                                             which the record first
                                             entered the phase or
                                             send notifications that
                                             the record has
                                             entered the phase.
                                             After successful
                                             enter – Runs after the
                                             record successfully
                                             moves from another
                                             phase into this phase.
                                             On exit – Runs when
                                             the record moves out
                                             of this phase. For
                                             example, the rule set
                                             can set the time at
                                             which the record left
                                             the phase or send
                                             notifications that the
                                             record has left the
                                             phase.
                                             Initialization – Runs
                                             once just before the
                                             record is displayed to
                                             the user. For
                                             example, the rule set
                                             can set up variables
                                             for display that aren't
                                             meant to change
                                             while the user is
                                             viewing the record.

                                                                                                Page 22 of 188
This PDF was generated on May 23, 2026                       Service Manager 9.81

                                        On display – Runs
                                        each time the record
                                        is displayed after a
                                        user action. For
                                        example, if the user
                                        uses the “fill” function
                                        to populate a field, the
                                        display rules will run
                                        after the action is
                                        completed and before
                                        the form is displayed.
                                        A possible use may be
                                        to populate a variable
                                        that's displayed on
                                        the form, which is
                                        calculated based on
                                        other values in the
                                        form.
                                        On update – Runs
                                        immediately before
                                        the record is updated
                                        in the database (or
                                        created if this is a new
                                        record). For example,
                                        the rule set can
                                        validate field data (the
                                        record will not be
                                        updated if validations
                                        fail), set default
                                        values, or perform
                                        calculations on
                                        existing fields.
                                        After successful
                                        update – Runs
                                        immediately after the
                                        record is updated in
                                        the database (or
                                        created if this is a new
                                        record). For example,
                                        the rule set can send
                                        notifications of the
                                        record update or
                                        update related

                                                                                   Page 23 of 188

                                        records based on
                                        changes to this
                                        record.

Actions

 Add                                                                                            Service Manager 9.81

This PDF was generated on May 23, 2026  Actions perform a task for the phase. In
                                        Knowledge Management, Actions are
                                        used to preview the document. Actions
                                        refer to rule sets that are marked as
                                        Available as Action.

                                           1. Click Add to add an action, which
                                             runs associated rule sets for that
                                             phase of the workflow.

                                           2. Type the identification name,
                                             which is how the action will
                                             appear in the Tray, More Options
                                             List, or on the button.

                                           3. Select the action from the drop-
                                             down list.

                                           4. Select the location of the action:
                                             Tray, More Options List, or
                                             Button.

                                                           Note

                                                        If you select Button,
                                                        then manually add a
                                                        button to the form
                                                        with the option
                                                        number of the action
                                                        specified.

                                           5. Click Action Condition to add a
                                             condition if required.

                                           6. Select Add, Save, or Delete for
                                             action when complete.

                                           7. Select Requires lock checkbox if
                                             you want to lock the record
                                             before the action can be
                                             performed.

                                                                                                                          Page 25 of 188
Approvals                                                                                 Service Manager 9.81
 Reset condition or Recalculate
 condition                                             Note

 Add approvals                                       If another user has
                                                     the record locked, you
Alerts                                               will not be able to
 Reset condition or Recalculate                      perform the action.
 condition
                                        8. Click Save.

                                                 Note

                                                You can add up to 30
                                                phase actions of the same
                                                type.

                                        1. Click Reset Condition or
                                          Recalculate Condition.

                                        2. Click Save.

                                        1. Click Add to add approvals.
                                        2. Select desired approvals for the

                                          phase.
                                        3. Click Save.

                                        1. Click Reset Condition or
                                          Recalculate Condition.

                                        2. Click Save.


Note

     To reposition the phase, select the phase, hover your mouse until
     you see a crosshairs symbol, and then move the phase to the
     desired location on the workflow page.
     To delete a phase, select the phase and either click the trashcan
     symbol next to the phase or Delete from the toolbar. You can't delete
     the default or first phases.
     To move multiple phases at the same time, press Ctrl and select
     multiple phases, and then move the phases or section of the
     workflow to a new location.
     In the Rule Sets tab, select a rule set and either double-click the rule
     set or click the View icon to open the rule set page.
     In the Approvals tab, select an approval name and either double-
     click the approval name or click the View icon to open the Approval
     Definition page.
     In the Alerts tab, select an alert name and either double-click the
     alert name or click the View icon to open the Alert Definition page.


1.6.3.6.4.2. Copy a phase

Applies to User roles: System Administrator, Implementer

You can copy a phase in an existing workflow by using the graphical interface of the
workflow editor. Every attribute of the phase is copied, apart from the name and
display name. This feature enables you to create workflow phases that have similar
attributes quickly.

To copy a phase in a workflow, follow these steps:

   1. Click Tailoring > Process Designer > Workflows from the System Navigator to
     display the workflows list.

   2. Open the workflow in which you want to copy a phase.

   3. Select the phase that you want to copy, click Copy in the toolbar, and then click
     Paste. Alternatively, you can press Ctrl+C and Ctrl+V after you select the phase
     to copy.

     The duplicate phase appears overlapping the copied phase. By default, the
     name of the new phase is "<copied phase name>_copy."

   4. Modify the attributes of the phase as required.
   5. Drag the copied phase to a convenient location in the workflow, and then add

     the necessary transitions.
   6. Click Save to save your changes.


1.6.3.6.5. Workflow Viewer

The following sections explain the workflow viewer and how to integrate it into a
knowledge document.


1.6.3.6.5.1. View a workflow in Workflow
Viewer

Applies to User roles: System Administrator, Implementer
The Workflow Viewer enables you to view a graphical layout of the entire lifecycle of
a process or record. The phases and transitions of the workflow are color-coded as
follows.

 Phase/transition

 Current phase

 Past phase

 Future phase

 Inactive phase

 Past transition

 Future transition

If a phase in a workflow contains approvals, an Approvals icon is displayed in the
phase in the Workflow Viewer.
You can view information about specific parts of the workflow by hovering the mouse
over that component in the Workflow Viewer. For example, hover the mouse over a
transition between two phases to display the description of that transition. Or, hover
the mouse over the Approvals icon to display the approval definition list (in future
phases), the approvals information in the Approval table (in the current phase), or the
approval history (in past phases).
To view a workflow, open a record, and then click the Workflow tab.


            Note

           In order to view a workflow in the Workflow Viewer, you must integrate a
           Workflow widget into any form that's associated with a Process Designer-
           enabled table. This is currently available for Knowledge Management
           ( kmdocument ), Change Management ( cm3r and cm3t ), and
           WorkflowDemo , Service Desk ( incidents ), Incident Management
           ( probsummary and imTask ), Problem Management ( rootcause and
           rootcausetask ), and Request Fulfillment ( request and requestTask .
           The procedure to integrate the viewer into each module is very similar.

Related topics

Add a phase


1.6.3.6.5.2. View the Workflow Properties

Applies to User roles: System Administrator, Implementer

You can use the Workflow Properties button to view the properties that are related to
an entire workflow. You can see all the workflow-based Rule Sets, Actions, and
Backend Transitions that are related to that workflow.

To view the Workflow properties, follow these steps:

   1. Click Tailoring > Process Designer > Workflows. Or, from within a
     Process Designer module, click Configuration and then Workflows.

   2. Double-click on any workflow.
   3. After the Workflow tab opens, click the Workflow Properties button.
   4. Click on any of the following tabs:

           Workflow Properties
           Workflow Based Rule Sets
           Workflow Based Actions
           Workflow Backend Transitions

            Caution

           Caution: If you modify a rule set that you have accessed through the
           Workflow Properties button, those changes are applied to the rule set
           directly. Therefore, any other workflow that also uses this rule set will also
           be affected.


1.6.3.6.5.3. Integrate Workflow Viewer
into a new form

Applies to User roles: System Administrator, Implementer
The Workflow Viewer icon is available in Forms Designer. The following example will
help you integrate the Workflow Viewer widget into the kmdocument.document
form. After the integration, you can see a graphical view of the workflow in the
Contribute Knowledge > External > Workflow tab. Using similar steps, you can
integrate the Workflow Viewer with other forms.

Follow these steps to integrate the Workflow Viewer widget into the kmdocument
form.

   1. Sign in as a System Administrator. In the System Navigator, click Tailoring >
     Forms Designer to open Forms Designer in the Windows client.
     For information on accessing Forms Designer and updating a form, see Access
     Forms Designer and Update a form.

   2. In the Form field, type kmdocument.external and click Search. The Contribute
     Knowledge form opens with the External Document Upload tab selected.

   3. Add the Workflow tab on the form.

   4. Set the visible condition to [$showWF]=true in the Workflow tab.

                   Note

                The condition hides the tab in the Windows client, but is visible in
                the web client.

   5. Add the Workflow Viewer component to the new Workflow tab.

   6. In the Workflow Viewer component, set the following variables in the properties.

      Workflow Name: $L.wfgWFName
      Workflow Table: $L.wfgWFTable

      Workflow RecordID: $L.wfgWFRecId

      Workflow Current Phase: $L.wfgWFPhase
   7. Add four text boxes at the bottom of the Workflow Viewer.

   8. Set their input values in the properties to:


     $L.wfgWFName
     $L.wfgWFTable
     $L.wfgWFRecId
     $L.wfgWFPhase

                 Note

               The four text boxes display workflow name, table name, document
               id, and phase of the record.

 9. Set the Workflow Viewer variables in the Main > Initialization tab of display
    screens for kmdocFlow.open and kmdocFlow.view :
     $L.wfgWFName=workflowName in $L.wfPhase
     $L.wfgWFTable=tableName in $L.wfPhase
     $L.wfgWFPhase=phaseName in $L.wfPhase
     $L.wfgWFRecId=id in $L.file
     if (sysinfo.get("environment")~="scguiwswt") then ($showWF="true") else
    ($showWF="false")

                 Note

               To go to the display screen, type ds in Service Manager command
               prompt and search for the kmdocument.document form.

10. Continue to follow step 1 through step 7 to add Workflow View in the other
    Knowledge Management forms: kmdocuments ( kmdocument.probsol ,
     kmdocument.howto , kmdocument.reference , and kmdocument.errormsg )


1.6.3.6.6. Workflow-based rule sets,
actions, and transitions

Applies to User roles: System Administrator, Implementer
Process Designer allows you to apply rule sets, actions and transitions to a workflow
as a unit, which are collectively referred to as workflow-based rule sets, actions and
transitions. You can access the workflow-based rule sets, actions, or transitions by
following the steps in View the workflow properties.
The following sections describe special considerations when you apply a rule sets,
actions or transitions to an entire workflow.


1.6.3.6.6.1. Workflow-based rule sets

Applies to User roles: System Administrator, Implementer
You can add workflow-based rule sets to an entire workflow by viewing the Workflow
Properties.
A workflow-based rule set is invoked on each phase of the workflow as long as the
triggering events are triggered in the back-end.
A workflow-based rule set is comprised of six sub-rule sets.


Sub-rule set                            Triggering action        Execution Order
On Add
                                        Record Creation (Adding  1. Add (before record
                                        Record)                    is created in the
                                                                   database)

                                                                 2. After Successful
                                                                   Add (after record is
                                                                   created in the
                                                                   database)

                                                                 3. Initialize
                                                                 4. On Display

After Successful Add                    Record Creation (Adding  1. Update (before
                                        Record)                    record is updated in
                                                                   the database)

                                                                 2. After Successful
                                                                   Add (after record is
                                                                   created in the
                                                                   database)

                                                                 3. Initialize
                                                                 4. On Display

On Enter                                Phase Change             1. From phase On Exit
                                                                 2. To phase On Enter
                                                                 3. To phase After

                                                                   successful Enter

After Successful Enter Phase Change                              1. From phase On Exit
                                                                 2. To phase On Enter
                                                                 3. To phase After

                                                                   successful Enter


Sub-rule set                            Triggering action            Execution Order
On Exit                                 Phase Change
                                                                        1. From phase On Exit
                                                                        2. To phase On Enter
                                                                        3. To phase After

                                                                          successful Enter

Initialization                          Search and access            1. Initialize
                                        existing record              2. On Display

On display                              Current page refresh         1. On Display
On Update                               (caused by link
                                        execution or other action    1. Update (before
                                        that still keeps at current    record is updated in
                                        format)                        the database)

                                        Record Update                2. After Successful
                                                                       Update

                                                                     3. Initialize
                                                                     4. On Display

After Successful Update Record Update                                1. Update (before
                                                                       record is updated in
                                                                       the database)

                                                                     2. After Successful
                                                                       Update

                                                                     3. Initialize
                                                                     4. On Display


1.6.3.6.6.2. Workflow-based actions

Applies to User roles: System Administrator, Implementer
In earlier versions of Process Designer, actions were applied to individual phases. In
certain circumstances, the same actions had to be duplicated in each phase. For
example, in cases where a certain button needed to be present in each phase, the
workflow designer had to add the button manually to each phase.
In the current version of Process Designer, you can add workflow-based actions to an
entire workflow by viewing the Workflow Properties.
A workflow-based action appears in each phase of the workflow when its condition is
satisfied.

            Note

           You can add up to 30 workflow-based actions of the same type.


1.6.3.6.6.3. Workflow transitions

Process Designer workflow transitions occur when a record moves from one phase to
another phase. Transitions can happen manually, automatically, or by default. An
automatic transition is taken when its condition is met. For example, the condition
might check if a field value is a specific value. In this case, the transition is taken
automatically when the record is saved. An example of a manual transition is when an
operator clicks the “Request Validation” button in the toolbar of a form. A default
transition is a special transition type that moves the workflow automatically only when
no other automatic transition conditions are satisfied.

            Note

           Transitions govern the flow of the workflow. However, in Change
           Management processes, an operator with Administrator rights can use the
           “Change Phase” menu option to bypass the workflow and jump to any
           phase.

After you add a transition, you can reposition it to avoid transitions overlapping with
phases or other transitions. To reposition the transition, select the transition and move
the green rectangular dot to achieve a desired layout.

You can also move a transition from one phase to another. To move the transition,
select the transition, hover your mouse near the blue rectangular dot to see a hand
symbol, and then move it to another phase.

            Tip

           Workflow phases are connected by transitions to move from one phase to
           another phase. However, if you want to move to another phase from the
           current phase, you can use backend transitions. For more information,
           see the Process Designer Tailoring Best Practices.

Create a default workflow transition

Applies to User roles: System Administrator, Implementer

A default transition moves the workflow automatically only when no other transition
conditions are satisfied.


Note

You can add rule sets to the default transition.

To create a default workflow transition, follow these steps:

   1. Click Tailoring > Process Designer > Workflows.
   2. Open the applicable workflow from the Workflows list.
   3. Click the phase where the default transition will begin.
   4. Hover your mouse until you see a hand symbol and then drag the mouse to add

     another phase.
   5. Enter the following information.

Field                                   Description
Transition Type
                                        Evaluates to one of the following
Description                             transition types: Manual, Automatic,
                                        or Default. Select the Default
Rule Sets                               transition type.

                                        Type a description of the transition.
                                        This description is displayed when
                                        you hover the mouse over the
                                        transition in the Workflow Viewer.

                                        Evaluates to the rule sets you
                                        created for the transition.

                                           1. Click Add and then select the
                                             ID of the rule set you want to
                                             add.

                                           2. Click OK.

   6. Click Save.

You have added a default transition.

Create an automatic workflow transition

Applies to User roles: System Administrator, Implementer


An automatic transition moves the workflow to another phase based on data in the
workflow record.

            Note

           You can add a condition and rule sets to the automatic transition.

To create an automatic workflow transition, follow these steps:

   1. Click Tailoring > Process Designer > Workflows.
   2. Open the applicable workflow from the Workflows list .
   3. Click the phase where the automatic transition will begin.
   4. Hover your mouse until you see a hand symbol and then drag the mouse to add

     another phase.
   5. Enter the following information.

Field                                   Description
Transition Type
                                        Evaluates to one of the following
Description                             transition types: Manual, Automatic,
                                        or Default. Select the Automatic
Condition                               transition type.
Rule Sets
                                        Type a description of the transition.
                                        This description is displayed when
                                        you hover the mouse over the
                                        transition in the Workflow Viewer.

                                        Evaluates to a condition that you can
                                        add to the transition.

                                        Evaluates to the rule sets you
                                        created for the transition.

                                           1. Click Add and then select the
                                             ID of the rule set you want to
                                             add.

                                           2. Click OK.

6. Click Save.


You have added an automatic transition.

Create a manual workflow transition

Applies to User roles: System Administrator, Implementer

When you set up a workflow, you can require an operator action to move a record
from one phase to another. This type of transition, in which an operator must press a
button or otherwise trigger an action, is a manual transition.

To create a manual workflow transition, follow these steps:

   1. Click Tailoring > Process Designer > Workflows.
   2. Open the applicable workflow from the Workflows list.
   3. Click the phase where the manual transition will begin.
   4. Hover your mouse until you see a hand symbol and then drag the mouse to add

     another phase.
   5. Enter the following information.


Field                                   Description
Transaction Type
                                        Evaluates to one of the following
Command Name                            transition types: Manual, Automatic,
Description                             or Default. Select the Manual
                                        transition type.
Condition
Rule Sets                               Evaluates to command location:
                                        Tray, More Options List, or Button.
Save record prior executing the
transition                              Type a description of the transition.
                                        This description is displayed when
                                        you hover the mouse over the
                                        transition in the Workflow Viewer.

                                        Evaluates to a condition that you can
                                        add to the transition.

                                        Evaluates to the rule sets you
                                        created for the transition.

                                           1. Click Add and then select the
                                             ID of the rule set you want to
                                             add.

                                           2. Click OK.

                                        Select this option if you want the
                                        record to be saved before the
                                        transition occurs.

   6. Click Save.
You have added a manual transition.

Note

Click the Localize Command Label icon in the Command Name text box
to open the Service Manager Message form of a transition. On this page,
you can add a message record for a new transition or view the message
record of an existing transition.


Related topics

Workflow phases
````
