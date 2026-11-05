---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.7.5.7 .. 1.7.5.7
printed_pages: 2174-2194
---

# 1.7.5.7 Configure a workflow

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.7.5.7. Configure a workflow

To create a new workflow, you can create one from scratch or copy an existing
workflow.

If you copy an existing workflow, you must enter the information that's described in
the following table.

Field                                   Description
New workflow name
Copy rule sets?                         The name of the new workflow

                                        Determines whether to copy the rule
                                        set that is used by the workflow. Out-
                                        of-box rule sets are marked as
                                        Proprietary and are read-only.
                                        However, copied rule sets are editable.

                                             Select this option if you want to
                                             customize rule sets.
                                             Do not select this option if you
                                             want to use the out-of-box logic.

                                        Note

                                        We recommend that you
                                        use the out-of-box rule
                                        sets as far as possible, as
                                        this facilitates the upgrade
                                        process and enables you to
                                        benefit from any future
                                        enhancements to out-of-
                                        box rule sets.

Rule set prefix                         If you copy the rule sets, you must
                                        specify a prefix for the copied rule
                                        sets. The format new rule set name is
                                        <prefix>.<the original rule set name>


1.7.5.7.1. Workflow Properties

We recommend that you add a description of the workflow in the Workflow properties
tab of the workflow editor, as this provides guidance to operators when they work on
records that follow the workflow.

When a description is entered into this field, that description is displayed when
operators hover the mouse over the workflow in the workflow viewer of a record.


1.7.5.7.2. Workflow-based rule sets and
actions

Workflow-based rules and actions help to reduce duplicated definitions. Instead of
defining them for each workflow phase, you can define them at the workflow level,
and they will apply to all workflow phases.
For more information, see Configure rule sets and actions.


1.7.5.7.3. Workflow backend transitions

Workflow phases are connected by transitions to move from one phase to another
phase, however if you want to move to one phase from whatever current phase is,
you can use backend transition to achieve it.
For example, the Incident workflow in out-of-box systems includes a backend
transition that moves an Incident record to the Closure phase.

You can invoke backend transitions by using the following methods:
     By using the Run Action rule (for more information, see Perform automatic
     operations with Run Action rules)
     By using the Run Scheduled Action rule (for more information, see Configure
     Run Scheduled Action rules)
     By using the se.view.engine , RAD application, as demonstrated by the following
     image.

     By using a JavaScript, as demonstrated by the following image.


1.7.5.7.4. Configure workflow phases

Workflow phases show the state of a record in the workflow and enforce the business
logic that must occur in order for the record to move to the next phase. Transitions are
used to move from one phase to another phase.
The workflow editor graphical interface enables you to add a phase to an existing
workflow. You can add a phase and configure its properties from scratch, or you can
clone an existing phase if you want to create a phase that has similar information
(such as same form name, rule sets, or other attributes) to an existing phase.

Phase properties

When you create or configure a phase, you must configure the following properties.

Field                                                                                           Service Manager 9.81
Phase Order
                                        Description
Name
                                        The Phase Order field provides each
                                        phase with a numerical order within a
                                        workflow. These numbers are used in
                                        calculations for Response Service
                                        Level Targets (SLTs) and similar
                                        metrics, so that the number and
                                        timestamps of entries and exits from
                                        specific phases can be tracked. For
                                        example, a Process Target calculation
                                        can determine the time of entry to the
                                        final phase, and therefore determine
                                        whether a breach has occurred.

                                        As a best practice, you should specify
                                        your starting phase as 1, and your
                                        closing phase as the highest number.
                                        We also recommend that these
                                        numbers should be roughly sequential
                                        from phase to phase. However, some
                                        workflows may loop multiple times
                                        through a sequence or take divergent
                                        paths.

                                        The name of the phase.

                                        You can't modify it after you save
                                        current workflow.

 Field                                                                                          Service Manager 9.81
 Display name
                                        Description
 Table name
                                        The display name of the phase.
This PDF was generated on May 23, 2026
                                                    Note

                                                   When you create or update
                                                   a phase's display name, the
                                                   display name is also
                                                   updated in the Description
                                                   field of the corresponding
                                                   record in the cm3rcatphase
                                                   table. However, only one
                                                   entry for the phase is
                                                   stored in the cm3rcatphase
                                                   table. Therefore, if you
                                                   assign the same phase
                                                   different display names in
                                                   different workflows, only
                                                   the display name that was
                                                   modified last is recorded in
                                                   the cm3rcatphase table.

                                                   Similarly, only one entry for
                                                   the phase is stored in the
                                                   globallist of localized phase
                                                   names. Therefore, if you
                                                   assign the same phase
                                                   different localized names in
                                                   different workflows, only
                                                   one localized phase name
                                                   string is recorded in the
                                                   globallist. In this situation,
                                                   functionality that uses the
                                                   globallist (for example,
                                                   search forms) will not work
                                                   as expected.

                                        The selected table name during
                                        workflow creation. You can't modify it.

                                                                                                                        Page 126 of 341
Field                                                                                           Service Manager 9.81
Form Edit condition
Records in this phase are active        Description

Make this the first phase               If the condition evaluates to true for a
Make this the default phase             user, that user can edit the form. If it
                                        doesn't, the form is read-only.

                                        Select the checkbox if you want the
                                        records in this phase to be active. The
                                        "record.active" record field is set to
                                        "true" when the record is moved to this
                                        phase. Usually, this option is not
                                        selected for end phases (such as
                                        "Closure," "Cancel," or "Withdraw," and
                                        is selected for all other phases.

                                        Select this option if you want this
                                        phase to be the first phase. Usually you
                                        set the "Logging" phase as the first
                                        phase.

                                        Select this option if you want this
                                        phase to be the default phase.

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

                                                   Or, if you change the
                                                   category of a record, this
                                                   record will be moved to the
                                                   default phase.

Field                                                                                           Service Manager 9.81
Additional Phase Information
                                        Description

                                        Select this option to open the Extended
                                        Phase Information page to modify the
                                        phase information.

                                                    Note

                                                   Only the Change
                                                   Management module
                                                   supports this feature. You
                                                   can't edit or delete a phase
                                                   name from the Extended
                                                   Phase Information page or
                                                   the cm3rcatphase.main
                                                   form.

                                                   Change Management
                                                   workflows have unique
                                                   workflow phases but they
                                                   will share change phases if
                                                   the workflow phases have
                                                   the same name. For
                                                   example, if Workflow 1 and
                                                   Workflow 2 each have a
                                                   phase named "Build and
                                                   Test," they will share the
                                                   same change phase
                                                   record.

Phase-based rule sets and actions

Phase-based rules and actions apply only to the current phase. For more information,
see

Configure rule sets and actions.

Alerts

You can use alerts to configure phases, however we recommend that you use the Run
Scheduled Action rule instead.


For more information about the Run Scheduled Action rule, see Configure Run
Scheduled Action rules.


1.7.5.7.5. Configure transitions between
workflow phases

Process Designer workflow transitions occur when a record moves from one phase to
another phase. Transitions can happen manually, automatically, or by default.

Automatic transitions

An automatic transition moves the workflow to another phase based on data in the
workflow record. The transition occurs when the configured condition is met.
Usually, if your workflow is status driven, you can use automatic transitions and
configure the status as the condition of this transition.

In the following example, when the record is in the "Active" phase and its status is set
to "Pending Review," the record moves automatically to the "Review" phase when the
record is saved.

We recommend that you add descriptions to automatic transitions. These are
displayed to the operator to help guide their work.

Manual transitions

A manual transition requires the operator to perform an action to move a record from
one phase to another. This type of transition, in which an operator must press a
button or otherwise trigger an action, is a manual transition.


Usually, if your workflow is actions driven, you can use manual transitions so that
operators move the workflow phase manually. You can also use manual transitions in
a status-driven workflow if you still want to move to a specific phase manually.

We recommend that you add descriptions to manual transitions. These are displayed
to the operator to help guide their work.

You can configure whether the record is saved before the transition occurs by
selecting the "Save record prior executing the transition" option. Usually, if a manual
transition needs to trigger the same events as a save operation (for example, to
perform the same validation of a save operation), and if you don't want to configure
duplicate validation Rule Set on this manual transition, you select this option.

For example, the following image shows a typical manual transition in which the target
phase is the "Closure" phase. Therefore, the "Save record prior executing the
transition" option is selected.

This transition uses the following rule set:

     The "im.task.close.field.validation" rule set is needed specifically for this close
     operation.
     These common mandatory and validation rules are triggered when the record is
     saved before the transition occurs.


Only configure rule sets in transitions if they are absolutely necessary to move
from one phase to another. Common mandatory rules and validation rules are
already configured for the beginning phase (the "Review" phase in the following
image), and don't need to be configured in the transition. We don't recommened
that you configure rules that are triggered in the different "events."

The following image shows an example manual transition in which the target phase is
the "Canceled" phase. Therefore, the "Save record prior executing the transition"
option is cleared.


This transition uses the following rule sets:

     The only common field validation used is the "im.task.fields.validation" rule set.
     The "im.task.cancel.field.validation" rule set is needed specifically for this close
     operation.


Use Default Transition

A default transition is a special case that moves the workflow automatically only when
no other automatic transition conditions are satisfied.

If your "Logging" (or first) and default phases aren't the same phase, you can use a
default transition between the "Logging" phase and the default phase.


Forms

You can configure workflows so that a specified form is displayed when that a record
moves to a specified phase.

You can user the following methods to specify the form that's displayed:

     In the Forms tab in the workflow editor, set the form that's displayed by default
     in the Default Display form field. This form is used when no conditional display
     forms are displayed.

     In the Forms tab in the workflow editor, configure forms that are displayed when
     certain conditions are met by clicking Add in the Conditional/Additional Forms
     section, and selecting Display Form in the Type drop-down list.

Note

     Display forms that you specify for phases by using this method
     take precedence over the format setting in State and Display
     Screen. We recommend that you set the display form in the
     phase settings in the workflow editor, and that you use different
     forms for different phases to allow different information to be
     displayed and captured at various stages of the workflow.
     The name field supports JavaScripts, the jscall RAD
     expression, and RAD variables.


In the Forms tab in the workflow editor, configure additional forms by clicking
Add in the Conditional/Additional Forms section, and selecting Additional Form
in the Type drop-down list. Additional forms are available as alternate forms
when users view a record.

Approvals

You can define approvals for a specific phase in the Approvals tab of the workflow
editor if you require an approval when a record moves to this phase.

To do this, make the following configurations in the Approvals tab of the object
definition record:


To determine whether the document engine triggers the approval mechanism,
set the value of the Approval condition field to "true," or set a specific
condition.
To set the file that contains the approval status, type the file name in the
Approval status field.

To set the conditions under which all existing approvals for a record are deleted
and regenerated, enter a condition in the Reset condition field.

To set the conditions under which the approvals are recalculated without first
deleting the existing approvals, enter a condition in the Recalculate condition
field.

            Note

           The reset condition takes priority over the recalculate condition.

Note

Usually, the recalculate and reset conditions in the object record are
configured as follows:


For more information about making further changes to approvals, see the Service
Manager Help.

Configure the Approval/Denial process:

Usually, transitions from phases that require approvals to move to the next phase use
automatic transitions. For example, you can configure a condition that the
approval.status field must equal "approved" for an approved record and "denied" for
denied record.

In order to trigger the automatic transition after the record is approved or denied, you
must configure the approval/denial process to call the se.view.engine RAD script
together with the "save" action. This triggers the Process Designer record save
operation, and then triggers the automatic transition which matches the condition.


Contents

     1 Automatic transitions
     2 Manual transitions
     3 Use Default Transition
     4 Configure the Approval/Denial process:
````
