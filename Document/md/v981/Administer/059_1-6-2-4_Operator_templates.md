---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.6.2.4 .. 1.6.3.2
printed_pages: 1445-1453
---

# 1.6.2.4 Operator templates

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.6.2.4. Operator templates

System Administrators can design operator templates for creating operator records
for users that share common information and settings. For example, you can design
one operator template for managers and another template for first-level Service Desk
Agents. An operator template is an operator record containing all the common
information that applies to operator records created from the template. Typically, this
includes information such as:

     Application profile
     Default Company
     Date Information
     Time Limits
     User Session Information
     LDAP Information
     Security Groups
     Security Roles

To distinguish the operator template from a user's operator record, select the
Template Operator option in the template. Users aren't attached to templates and,
therefore, can't log in to Service Manager using an operator template.

When you have created the new operator template with all the desired settings, you
can then create the operator records you need, based on that new template. When
you create operator records, fill in the Template field with the name of the template
from the operator template, and then all the information in the template will be applied
to the new operator records.

Any changes you make to an operator template automatically apply to all operator
records you created from the template. If you later decide to change a setting in the
template, you modify the template, and then the setting will automatically be applied
to all the operator records that use the template.

Related topics

Adding users
Checklist: Adding a new user
Controlling user access and security
Creating operator records
Defining named users
Operator passwords
Operator records


Create an operator record from an operator template
Create an operator template
Define the operator template applied to LDAP users


1.6.3. ProcessDesigner

Process Designer provides a graphical interface to develop workflows that you can
use to control the flow of a single record throughout its lifecycle within Service
Manager. The Process Designer enables an implementer to graphically create or
update a workflow without being an expert in RAD programming.

     Define a workflow process in a graphical editor.
     Create business rules in a user-friendly interface to drive the workflow logic.
     Provide a platform to model complex processes that require branching and
     looping.
     Lower Total Cost of Ownership of Service Manager by enabling an intuitive and
     simplified configuration.
     Simplify future upgrades by enabling standardization and clarity of business
     logic.

Process Designer includes the following components:

     Workflow designer: Design and update a workflow using a graphical user
     interface.
     Rules editor: Create rules to enforce business logic in workflows and forms.
     Security model: Provide a common role-based security model.

A workflow is a collection of phases with transitions from one phase to another. Each
phase represents the state of the workflow linked to a form for data capture.

Transitions

Transitions can connect phases in any manner to create a workflow with many
branches and loops back to previous phases. Transitions may be manual, automatic,
or default. A manual transition requires the workflow user to make a manual decision
to move to the next workflow phase. An automatic transition moves the workflow to
another phase based on data in the workflow record. A default transition is a special
case that moves the workflow automatically, when no other automatic transition
condition applies.

Rule sets

The rules editor enables administrators, such as business process owners,
implementers, and developers, to add or remove the out-of-box rules and actions of a
workflow to match particular business requirements. You can group individual rules
into a rule set to allow their re-use within the process. You can configure a rule set to


execute on events, such as saving or updating a business table record. Rules can also
be set up to run on a workflow transition.

Actions

You can also configure rules as actions, which allows operators to run rules on
demand rather than wait for workflow processing. When an operator initiates an
action (such as pressing a button in the system tray), the system runs the associated
rule sets for that phase of the workflow. The following diagram shows the relationship
between rules, rule sets, actions, and transitions:

Condition Editor

With the Condition Editor, you can apply conditions to rules. When a rule condition is
met, the rule executes. You can also edit conditions for a rule.

Process Designer security model

The Process Designer security model provides a consistent method of assigning
permissions to users across all areas of the system. You can use security model to
configure out-of-box rights for a specified role within an area. It also provides
standardized methods to manage user rights.

Process Designer modules

Process Designer features are implemented for Knowledge Management, , Change
Management, Request Fulfillment, Help Desk (which is comprised of Service Desk,
Incident Management, and Problem Management) and Service Level Management. To
access the Process Designer features from the system navigator, click Tailoring >


Process Designer. A typical Process Designer flow broadly comprises the following
major tasks:

     Create rule sets with rules using out-of-the-box rule types to enforce business
     logic on traditional Service Manager forms.
     Create a workflow with phases and transitions to build a process flow.
     From workflow phases and transitions, associate forms, rule sets, approvals, and
     alerts to implement your business process.


1.6.3.1. Create a rule set

Applies to User roles: System Administrator, Implementer
A rule set contains a list of rules that you may run against a record. Rules implement
business logic to drive a workflow or a process. Rules can help perform calculations,
validate fields based on data or rule sets, set required fields, and more. A rule set
uses role-based security.
You can re-use rule sets in many processes when you require the same rules in many
places. rule sets simplify the effort of implementing business logic. You can apply rule
sets based on conditions, or configure them to run during an action. rule sets are
most often associated with specific phases of a workflow.
To create a rule set, follow these steps:

   1. Click Tailoring > Process Designer > Rule Sets > New.
   2. Type a unique ID for the rule set. For example, kmdocument_draft.

                   Note

                The name must be unique within the rule sets records.

   3. Select Available as action if you want to offer this rule set as an action within a
     workflow phase. For example, Service Manager interaction with an external
     system.

   4. Type the display name for the rule set, for example, Saving a draft.
   5. Select the table(s) from the Table name list that you want the rule sets to apply

     to, for example, select kmdocument.

                   Note

                If the list is blank, the rule set can be applied to all tables.

   6. Click Save to add the rule set.


                   Note

                If you want to edit a Proprietary rule set, create a copy of
                this Proprietary rule set. To add Rules to a rule set, you must first
                save the rule set.

Related topics

Adding a rule
Clone an existing Rule Set


1.6.3.2. Clone an existing rule set

Applies to User roles: System Administrator, Implementer

You can create an editable copy of an existing Rule Set by using the cloning option.
Cloning a read-only Rule Set marked as Proprietary creates an editable copy of the
Rule Set.

To clone an existing Rule Set, follow these steps:

   1. In the System Navigator, click Tailoring > Process Designer > Rule Sets.
   2. Click Search.
   3. Select the Rule Set you want to clone.
   4. Click More > Clone. A copy of the Rule Sets with both the ID and Name prefixed

     <CLONE> is displayed.
   5. Rename both the ID and Name prefixed <CLONE> fields by typing something

     unique.
   6. Click Save.

Related topics

Process Designer security model
Create a rule set
````
