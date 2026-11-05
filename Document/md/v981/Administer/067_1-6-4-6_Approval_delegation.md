---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.6.4.6 .. 1.6.4.6
printed_pages: 1634-1672
---

# 1.6.4.6 Approval delegation

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.6.4.6. Approval delegation

Approval delegation is an optional feature that enables users with approval rights to
temporarily delegate their approval authority to another qualified operator. Operators
with the Delegate Approvals or Can Delegate Approvals option enabled in their
application profiles can delegate some or all their approvals by using the Approval
Delegation wizard.

Using the Approval Delegation wizard, an operator can grant another qualified
operator the right to temporarily view and act on items in that operator's approval
queue. The wizard offers the following delegation options:

     Delegate all approvals to another qualified operator

     Delegate approvals from a particular application to another qualified operator

          • Delegate approvals directly assigned to you as an operator
          • Delegate approvals assigned to you as a member of an approval group

     Delegate approvals from a specified start date to a specified end date

The Approval Delegation wizard enables an operator to create any number of
approval delegation combinations, including delegating the same approvals to
multiple operators at the same time. Delegators can also update an existing
approval delegation to change the delegation start/end dates and change the
delegate's name.

            Note

           Service Manager tracks all changes to approval delegations using the
           standard field auditing capability.

When delegates log on to Service Manager, they see both their own and any
delegated approvals in their approval list. For security reasons, delegates always
retain their original application profiles and operator records. Service Manager
determines what temporary rights delegates have when they view or act on an
approval.

For more information about the tasks that relate to approval delegation, refer to the
following topics:

What happens when I delegate approval authority?
Temporary rights of an approval delegate


What happens when I receive delegated approval authority?
Copy an approval delegation
Delegate approvals to another operator
Disable an active approval delegation
Update an active approval delegation
Global variables available for approval delegation
Views available for approval delegation


1.6.4.6.1. Administering approval
delegation

In the out-of-box system, Service Manager supports approval delegation for the
following applications :

     Change Management
     Request Fulfillment
     Service Catalog

To enable approval delegation for one of these applications, an Administrator must
edit one of the application's security role records and select the Can Delegate
Approvals option. Next, the Administrator must grant this security role to the
operators who will be given approval delegation authority.

            Note

           If you want to support approval delegation for an application that doesn't
           support approvals out-of-box, you must first enable approvals for the
           application. To enable approvals, see Enabling approvals.

Approval delegation never changes a delegate's original security role or operator
record. Service Manager only changes a delegate's approval groups in memory when
the following conditions occur.

     When the system notifies the delegate
     When a delegate views or acts on an approval

By default, Service Manager sends an email notification to the approval delegate
when the following conditions occur:

     A new approval delegation is assigned to the delegate
     A new approval arrives in the approval owner's queue

            Note

           Service Manager also sends an email notification to the approval owner
           when a new approval arrives in the owner's queue. System Administrators
           can change the notification behaviors for approval delegation directly
           from the notification engine.


A delegated approval always retains its original operator assignment. Service
Manager records the delegate's actions separately from the owner in the following
new fields:

Field name                              Label in approval record Description
approved.by
                                        Operator      The name of the
approved.for                                          operator who acted on
                                                      the approval.

                                        Approved For  The name of operator
                                                      who delegated the
                                                      approval.

Note

Delegators and delegates can view these fields from the approval record
and the approval log. However, in some cases, only a delegator may have
the approval group necessary to view the records in the approval log. A
delegate's temporary rights don't include viewing approvals in the log. In
order to view approvals in the approval log, a delegate's application
profile must include the required approval groups.

Related topics

Approval delegation
What happens when I receive delegated approval authority?
What happens when I delegate approval authority?
Enabling approval delegation
Delegate approvals to another operator
Disable an active approval delegation
Update an active approval delegation
Global variables available for approval delegation
Views available for approval delegation


1.6.4.6.1.1. Enabling approval delegation

The Can Delegate Approvals security role setting controls whether an operator can
view the Approval Delegation wizard.

            Note

           It is a best practice to only enable the Delegate Approvals or Can
           Delegate Approvals option for operators who can also view and approve
           objects in the application.

Refer to the following example for how to enable approval delegation for Change
Management.

   1. Sign in to Service Manager as a System Administrator.
   2. Click System Administration > Security > Roles.
   3. In the Name field, type the name of the security role you want to grant

     approvals. For example, change approver.
   4. Click Search. The Security Roles form opens.
   5. Click Change in the Area column.
   6. Under Settings, select the Can Delegate Approvals checkbox.
   7. Click Save.

Related topics

Administering approval delegation
Approval delegation
What happens when I delegate approval authority?
What happens when I receive delegated approval authority?
Copy an approval delegation
Delegate approvals to another operator
Disable an active approval delegation
Update an active approval delegation
Global variables available for approval delegation
Views available for approval delegation


1.6.4.6.1.2. Global variables available for
approval delegation

Service Manager provides global variables for approval delegation. Administrators
can use these global variables to create their own custom queries or views.

Global variable                         Description
$G.delegated.cm3r.groups
                                        Stores the assignment groups that are
$G.delegated.cm3t.groups                associated with Change Management
                                        changes that the current operator can
$G.delegated.ocmq.groups                view and act on as an approval
$G.delegated.svc.groups                 delegate.

                                        Stores the assignment groups that are
                                        associated with Change Management
                                        tasks that the current operator can
                                        view and act on as an approval
                                        delegate.

                                        Stores the assignment groups that are
                                        associated with Request Management
                                        that the current operator can view and
                                        act on as an approval delegate.

                                        Stores the assignment groups that are
                                        associated with Service Catalog that
                                        the current operator can view and act
                                        on as an approval delegate.

Related topics

Approval delegation
What happens when I delegate approval authority?
What happens when I receive delegated approval authority?
Copy an approval delegation
Delegate approvals to another operator
Disable an active approval delegation


Update an active approval delegation
Views available for approval delegation


1.6.4.6.2. Enabling approval delegation for
custom approvals

If you want to enable approval delegations for an application that doesn't offer
approvals in the out-of-box system, you must first create and enable custom
approvals for the application. For more information, see related topics.

Enabling approvals and approval delegation requires administrative access to the
system database dictionary, the Forms Designer utility, application profiles, and the
script library. You should also know which tables and fields the application uses.

Refer to the following checklist for how to set up an application to enable approvals
and approval delegation for Problem Management.

            Note

                To complete this checklist, follow the step-by-step procedures
                described in the following examples found in the related topics.
                You must use the Windows client whenever you need to add a new
                field/key to a database dictionary table.

   1. Edit the object definition for the application to enable approvals by category.
   2. Edit the database dictionary for Problem Management to add an approval status

     field.
   3. Edit the database dictionary for the Problem Management categories to add an

     approval field.
   4. Edit the necessary forms to add the new approval fields.
   5. Edit the database dictionary for the Problem Management profile record to add

     to an approval groups field.
   6. Create a new approval definition record to manage the Problem Management

     approvals.
   7. Edit the Problem Management category definitions to add your new approval

     definition.
   8. Edit the Problem Management profile records that you want to have access to

     your custom approval group.
   9. Edit the script that controls the approval inbox to add your custom approvals to

     the list of approvals the system displays.
 10. Enable approval delegations for the custom approvals.


For more information, see Example: Enabling Approval Delegation for custom Problem
Management approvals and Example: Enabling custom approvals for Problem
Management.

Related topics

Approval delegation
Example: Enabling Approval Delegation for custom Problem Management approvals
Example: Enabling custom approvals for Problem Management
What happens when I delegate approval authority?
What happens when I receive delegated approval authority?
Copy an approval delegation
Delegate approvals to another operator
Disable an active approval delegation
Update an active approval delegation
Global variables available for approval delegation
Views available for approval delegation


1.6.4.6.2.1. Example: Enabling custom
approvals for Problem Management

The following example illustrates how to enable approvals for Problem Management.
At the end of this example, you will be able to:

     Create a problem record that requires an approval
     Assign the problem record to the approval queue
     View and act upon the problem approval

            Note

           In order to enable custom approvals for Problem Management, you must
           perform the entire sequence of example tasks. You must be a System
           Administrator, or have equivalent system privileges, to perform the steps
           in this example. Also, you must use the Windows client whenever you
           need to add a new field/key to a database dictionary table.

Task 1: Edit the object definition for the application
to enable approvals by category.

   1. Sign in to Service Manager with a System Administrator account.
   2. Click Tailoring > Document Engine > Objects.
   3. Type rootcause in the File Name field, and then click Search.

     The Object Definition form opens.
   4. Click the Approvals tab, and then type the following field values.


Field                                   Value
Approval condition                      true
Approval location                       Category
Approval field name                     approvals
Approval status field                   approval.status
Approval type                           All must approve
Approval process                        rootcause.save
Preapprove on open                      false

Note

The fields approvals and approval.status fields don't yet exist. You
will add the field name to the Problem Management database
dictionary in a later step.

   5. Click Save.

Task 2: Edit the database dictionary for the
application to add an approval status field.

   1. Click Tailoring > Database Dictionary.
   2. Type rootcause in the File Name field, and then click Search.
   3. Select the descriptor row in the Fields tab, and then click New Field/Key.

   4. Type the following field attributes.

Field attribute                         Value
Name                                    approval.status
Type                                    character

5. Click Add Field.


6. Click OK to save the database dictionary.
  Service Manager prompts you to confirm how you want to change the tables in
  the RDBMS.

7. If Service Manager has write permissions to the RDBMS, click SM Alters.
  Otherwise, click User Alters.
  Service Manager displays the database dictionary.

               Note

             Check your DDL output folder for DDL text you can use to update
             your RDBMS manually.

Task 3: Edit the database dictionary for the
application's categories to add an approval field.

   1. Click Tailoring > Database Dictionary.
   2. Type rootcausecat in the File Name field, and then click Search.
   3. Select the descriptor row in the Fields tab, and then click New Field/Key.

   4. Type the following field attributes.

Field attribute                         Value
Name                                    approvals
Type                                    array

5. Click Add Field. Service Manager prompts you to select the array's data type.
6. Select character, and then click Add Field.

7. Click OK to save the database dictionary.

  Service Manager prompts you to confirm how you want to change the tables in
  the RDBMS.

8. If Service Manager has write permissions to the RDBMS, click SM Alters.
  Otherwise, click User Alters.

  Service Manager displays the database dictionary.


Note

Check your DDL output folder for DDL text you can use to update
your RDBMS manually.

Task 4: Edit the necessary forms to add the new
approval fields.

   1. Click Tailoring > Forms Designer.

   2. Type problemcat in the Form field, and then click Search.

     The Problem Control Category Definition form opens.

   3. Click Design.
   4. Click Group.
   5. Click on an empty space on the form to add the group.
   6. Edit the properties of the group as follows.

Property                                Value
Caption                                 Approval Requirements
Width                                   152

7. Click Comfill, and then click within the Approval Requirements group.
8. Edit the properties of the combo fill field as follows.

Property                                Value
Input                                   approvals
Array Length                            5

 9. Position the Approval Requirements group as desired.

    For example, you may want to position the group between the Active? checkbox
    and the Phase name table.

10. Click OK to exit design mode.
11. Click OK to save the form and return to the Forms Designer search screen.


12. Type PM.pc.investigate.and.diag in the Formfield, and then click Search.

    The Problem Control - Problem Investigation and Diagnosis form opens.

13. Click Design.
14. Click Label, and then click in the open space beneath the Record Number label.
15. Edit the properties of the label as follows.

Property                                Value
Caption                                 Approval Status:
X                                       2
Y                                       5
Width                                   34

16. Click Text, and then click to the right of the Approval Status: label.
17. Edit the properties of the text field as follows.

Property                                Value
X                                       36
Y                                       5
Width                                   36
Input                                   approval.status
Read-Only                               Selected

 18. Click OK to exit design mode.
 19. Click OK to save the form and return to the Forms Designer search screen.

Task 5: Edit the database dictionary for the
application's profile record to add to an approval
groups field.

   1. Click Tailoring > Database Dictionary.


2. Type rcenv in the File Name field, and then click Search.
3. Select the descriptor row in the Fields tab, and then click New Field/Key.

4. Type the following field attributes.

Field attribute                         Value
Name                                    approval.groups
Type                                    array

   5. Click Add Field. Service Manager prompts you to select the array's data type.
   6. Select character.
   7. Click Add Field.

   8. Click OK to save the database dictionary.

     Service Manager displays the database dictionary.

Task 6: Create a new approval definition record to
manage the application's approvals.

   1. Click Tailoring > Forms Designer.

   2. Type rc.profile.g in the Form field, and then click Search.

     The Problem Management Security Profile form opens.

   3. Click Design.
   4. Click Label, and then click in the open space beneath the Complex Mass

     Update checkbox.

   5. Edit the properties of the label as follows.

Property                                Value
Caption                                 Approval Groups:
X                                       2
Y                                       31
Width                                   28


6. Click Comfill, and then click to the right of the Approval Groups: label.
7. Edit the properties of the combo fill field as follows.

Property                                Value
X                                       31
Y                                       31
Input                                   approval.groups
Array Length                            5
Value List Condition                    select("name", "assignment",
                                        "name", "*")

   8. Click OK to exit design mode.
   9. Click OK to save the form and return to the Forms Designer search screen.

Task 7: Edit the application's category definitions to
add your new approval definition.

   1. Click Tailoring > Tailoring Tools > Links.
   2. Type rc.profile in the Name field, and then click Search.

   3. Add the following link entry at the end of the list of links.

Property                                Value
Source Field name                       approval.groups
Target File name                        assignment
Target Field name                       name

4. Click Save.
5. Click Change Management > Maintenance > Approvals.


Note

You are using a Change Management menu link because by default,
Problem Management doesn't have a menu item for Approvals.

6. Type the following field values.     Value
    Field                               Problem Approval
    Name                                true
    Approval Condition                  HELPDESK
    Group/Oper                          1
    Sequence                            true
    Condition

Caution

The Group/Oper field is case sensitive.

 7. Click Add.

 8. Click Problem Management > Administration > Problem Control Categories.

    Your customized problemcat form opens.

 9. In the Name field, type the name of a Problem Management category that you
    want to trigger your custom approval process. For example, ITIL.
    Note: You can repeat this step for each Problem Management category you
    want to trigger approvals.

10. Click Search.

    Service Manager displays the current ITIL category definition.

11. In the Approval Requirements array, type Problem Approval.
12. Click Save.


Task 8: Edit the application profile records that you
want to have access to your custom approval
group.

   1. Click System Administration > Ongoing Maintenance > Profiles > Problem
     Management Profiles.

     The Problem Management Security Profile form opens.

   2. In the Profile Name field, type the name of a profile you want to grant approvals.
     For example, SYSADMIN.

   3. Click Search.

     Service Manager displays the current Problem Management Security Profile.

   4. In the Approval Groups array, type the name of the approval group you defined
     to manage approvals. For example, HELPDESK.

   5. Click Save.
   6. Sign out of the current operator and sign in to Service Manager with an operator

     account that has the SYSADMIN Problem Management profile. For example,
     System.Admin.
   7. Click Problem Management > Problem Control > Create New Problem.

   8. Create a new problem record and note the record number. For example,
     PM0002.

                   Note

                The Category field on the Problem Control form maps to the
                Incident Management category, not the Problem Management
                category. Since there is only one approval category for ITIL Problem
                Management, any problem you create will automatically be part of
                the ITIL Problem Management category.

Task 9: Edit the script that controls the approval
inbox to add your custom approvals to the list of
approvals the system displays.

   1. Click Tailoring > Database Manager.
   2. Type Approvals in the Table field, and then click Search.
   3. Select the Approval form from the list.


   4. In the Id field, type the record number for the problem you created. For example,
     PM0002.

   5. Click Search to display the pending approval.
   6. Click Tailoring > Script Library.
   7. Type ApprovalCustomPlugin in the Name field, and then click Search.
   8. Locate the appendCustomApprovalSql() function.
   9. Remove the comment lines /* and */ at lines 49 and 55 to enable the function.
 10. Click Save.
 11. Click Compile.

 12. Click Service Catalog > Approve Requests.

     Service Manager displays the list of pending approvals. Check the list for your
     custom approval. For example, PM0002.

Related topics

Approval delegation
Enabling approval delegation for custom approvals
Example: Enabling Approval Delegation for custom Problem Management approvals
What happens when I delegate approval authority?
What happens when I receive delegated approval authority?
Delegate approvals to another operator
Disable an active approval delegation
Update an active approval delegation
Global variables available for approval delegation
Views available for approval delegation


1.6.4.6.2.2. Example: Enabling Approval
Delegation for custom Problem
Management approvals

The following example shows how to delegate the custom Problem Management
approvals you created in a previous example. At the end of this example, you will be
able to:

     Delegate Problem Management approvals to another operator
     View Problem Management approvals in a delegate's approval queue

            Note

           In order to enable approval delegation for custom Problem Management
           approvals, you must perform the entire sequence of example tasks. You
           must be a System Administrator, or have equivalent system privileges, to
           perform the steps in this example. Also, you must use the Windows client
           whenever you need to add a new field or key to a database dictionary
           table.

Task 1: Add a new approval delegation field to the
database dictionary.

   1. Sign in to Service Manager with a System Administrator account.
   2. Click Tailoring > Database Dictionary.
   3. Type rcenv in the File Name field, and then click Search.
   4. Select the descriptor row in the Fields tab, and then click New Field/Key.

   5. Type the following field attributes.

Field attribute                               Value
Name                                          can.delegate
Type                                          logical

6. Click Add Field.
7. Click OK to save the database dictionary.


Task 2: Edit the Problem Management Security
Profile form.

   1. Click Tailoring > Forms Designer.
   2. Type rc.profile.g in the Form field, and then click Search.

     The Problem Management Security Profile form opens.
   3. Click Design.
   4. Select the assig.groups comfill, and change its property as follows.

Property                                Value
Y                                       23

5. Select the Assignment Groups label, and change its property as follows.

Property                                Value
Y                                       21

6. Click Checkbox.
7. Click on the empty space between the Assignment Groups label and the Skip

  Query Warning checkbox.

8. Edit the properties of the checkbox.

Property                                Value
X                                       80
Y                                       19
Caption                                 Can Delegate?
Input                                   can.delegate

 9. Click OK to exit the design mode.
10. Click OK to save the form and return to the Forms Designer search screen.


Task 3: Edit the custom Problem Management
Profile form.

   1. Click System Administration > Ongoing Maintenance > Profiles > Problem
     Management Profiles.

     The Problem Management Security Profile form opens.

   2. Type the name of a profile you want to grant approval delegation rights in the
     Profile Namefield. For example, SYSADMIN.

   3. Click Search.

     Service Manager displays the current Problem Management Security Profile.

   4. Click Can Delegate? to enable it.
   5. Click Save.

Task 4: Edit the ApprovalCustomPlugin functions in
the script library.

   1. Click Tailoring > Script Library.
   2. In the Name field, type ApprovalCustomPlugin, and then click Search.

   3. Locate the checkProfileForModule(filename, operator) function, and then
     remove the /* and */comment lines at lines 6 and 17 to enable the function.

     This function makes problem records a valid choice in the approval type list of
     the Approval Delegation wizard.

   4. Locate the getCustomApprovalGroups(module, operator) function, and then do
     the following:

        1. Delete the // comment characters at line 25 to activate the line.
        2. Remove the /* and */ comment lines at lines 27 and 40 to enable the

           function.

     This function returns all the approvals groups defined for the profile of the
     current application.

   5. Locate the getAllCustomGroups(aDele) function, and then do the following:

        1. Verify that the line 100 lists profile_rootcause as the profile definition.

           To change the profile type, type a different profile definition.

        2. Verify that line 113 lists SCFile("rcenv") as the type.


           To use another application, type a different profile table name between the
           quotation marks.

        3. Verify that line 143 lists "Problem" as the module condition.

           To use another application, type a different approval module name.

        4. Verify that line 161 lists \"rootcause\" as the file name.

           To use another application, type a different file name.

   6. Click Save.
   7. Click Compile.
   8. Click OK to return to the Script Library search screen.

Task 5: Edit the ApprovalDelegationGroups
functions in the Script Library.

   1. Click Tailoring > Script Library.
   2. In the Name field, type ApprovalDelegationGroups , and then click Search.
   3. Locate the getDelegationSql function.
   4. Delete the // comment characters on line 29 to activate the line.
   5. Delete the // comment characters on line 31 to activate the line.
   6. Type the // comment characters at the beginning of line 32 to deactivate the line.
   7. Click Save.
   8. Click Compile.
   9. Click OK to return to the Script Library search screen.

Task 6: Add a new approval delegation for the new
Problem Management custom approvals.

   1. Click Approval Delegation.

     The Approval Delegation wizard opens.

   2. Add a new delegation with the following properties.


Property                                Value
Delegated modules                       Selected
Modules delegated                       Problem Management
Assignment Groups and Operator          HELPDESK, System.Admin
delegated
Delegate                                Problem.Manager
Delegate from and to dates              From today to tomorrow

   3. Sign out of the current operator and sign in to Service Manager as the delegate.
     For example, Problem.Manager.

   4. Click Approval Inbox.

     You should see the Problem approval you created previously. For example,
     PM0002.

Related topics

Approval delegation
Enabling approval delegation for custom approvals
Example: Enabling custom approvals for Problem Management
What happens when I delegate approval authority?
What happens when I receive delegated approval authority?
Delegate approvals to another operator
Disable an active approval delegation
Update an active approval delegation
Global variables available for approval delegation
Views available for approval delegation


1.6.4.6.3. What happens when I receive
delegated approval authority?

If operators delegate their approval authority to you, Service Manager sends an email
to notify you of the new approval delegation. You are also notified when a new
approval arrives in your approval queue.

Viewing approvals

When you log on to Service Manager, you will see both your own and any delegated
approvals in your approval queue.

     To view approvals that another operator has delegated to you, you can use the
     Active approval delegations assigned to me view.
     To view approvals delegated to you in the past, you can use the Past approval
     delegations assigned to me view.
     To see which items in the approval queue are due to an active approval
     delegation, you can open the Approve Requests view from the System
     navigator. In this view, Service Manager indicates which approvals are in the
     queue due to an active delegation by displaying a value of YES in the As
     Delegate? column. You can use this view to view, approve, or deny approval
     requests.

Tracking approval actions

As a delegate, when you act on an approval, Service Manager tracks your actions by
adding both your operator name and the delegator's operator name to the approval
record.

     Service Manager lists your name in the Operator column of the Completed
     Approval Actions table.
     Service Manager lists the delegator's name in the Approve For column of the
     Completed Approval Actions table.

After the approval delegation expires

When an approval delegation expires, you are no longer considered a temporary
member of the delegator's approval groups. This means that you can no longer view
or act on items that belong exclusively to the delegator's approval groups.The
restriction includes any approvals that you previously acted on during the delegation


period. In some cases, this may mean that only the delegator can see a particular
approval record.

Related topics

What happens when I delegate approval authority?
Delegate approvals to another operator
Disable an active approval delegation
Update an active approval delegation
Global variables available for approval delegation
Views available for approval delegation


1.6.4.6.3.1. Temporary rights of an
approval delegate

An approval delegate temporarily gains the rights for the assignment group of the
delegating operator while the approval delegation is active. After the approval
delegation period ends, the delegate's temporary rights for the assignment group
revert to their original status.

Approval delegation never changes a delegate's original application profile or
operator record. Service Manager only changes a delegate's assignment group rights
in memory when the following conditions occur.

     When the system notifies the delegate
     When a delegate views or acts on an approval

For example, a manager wants to delegate approval authority to a technician. When
the manager delegates approval authority to the technician, the technician
temporarily becomes a member of all of the assignment groups that the manager is
an approver of.

Related topics

What happens when I delegate approval authority?
What happens when I receive delegated approval authority?
Copy an approval delegation
Delegate approvals to another operator
Disable an active approval delegation
Update an active approval delegation
Global variables available for approval delegation
Views available for approval delegation


1.6.4.6.4. What happens when I delegate
approval authority?

When you delegate approval authority to a qualified operator, the delegate receives
an email notification. Delegates are also notified when a new approval arrives in their
approval queues.

As a delegator, you always retain your normal approval authority. Both you and any
delegates you authorize have the ability to approve items while an approval
delegation is active.

Viewing approvals

As a delegator, when you log on to Service Manager, you will see both your own and
any delegated approvals in your approval queue.

     To view your active approval delegations, you can use the Approval Delegation
     wizard or the My active approval delegations view.
     To view your past delegations, you can use the Copy Approval Delegation
     wizard or the My past approval delegations view.

Tracking approval actions

When a delegate acts on an approval, Service Manager tracks the delegate's actions
by adding both the delegate's operator name and your operator name to the approval
record.

     Service Manager lists the delegate's name in the Operator column of the
     Completed Approval Actions table.
     Service Manager lists the delegator's name in the Approve For column of the
     Completed Approval Actions table.

After the approval delegation expires

When an approval delegation expires, a delegate is no longer considered a temporary
member of your approval groups. This means that the delegate can no longer see or
act on items that belong exclusively to your assignment groups. The restriction
includes any approvals that the delegate previously acted on during the delegation
period. In some cases, this may mean that only you as delegator can see a particular
approval record.

Related topics


What happens when I receive delegated approval authority?
Delegate approvals to another operator
Disable an active approval delegation
Update an active approval delegation
Global variables available for approval delegation
Views available for approval delegation


1.6.4.6.4.1. Delegate approvals to another
operator

Applies to User roles: System Administrator and other users with approval delegation
authority
You can only delegate approvals to another operator if a System Administrator
enables the Delegate Approvals or Can Delegate Approvals option for you in your
security role.
To delegate approvals to another operator, follow these steps:

   1. Click Approval Delegation. The Approval Delegation wizard opens and displays
     any active approval delegations assigned to you.

   2. To create a new approval delegation, click Add New Delegation.
   3. Select whether to delegate all your approvals or to select approvals.
   4. If you are selecting approvals, make the following choices:

        1. Choose which application's approvals you want to delegate.
        2. Choose how you want delegate approvals assigned to you:

                 Assigned as part of an assignment group
                 Assigned directly to you as an operator

                   Note

                You can select multiple assignment groups or operators as needed.

   5. Select the delegate to whom you want to grant approval authority.

                   Note

                Service Manager only displays operators who are eligible approval
                delegates. If you don't see a particular operator listed as a potential
                delegate, it means that the operator doesn't have one or more of the
                rights required to be eligible for approval delegation. Consult your
                System Administrator if you want to assign additional rights to a
                particular operator.

   6. Select the date range during which the approval delegation will be active.


Related topics

What happens when I delegate approval authority?
What happens when I receive delegated approval authority?
Copy an approval delegation
Disable an active approval delegation
Update an active approval delegation
Global variables available for approval delegation
Views available for approval delegation


1.6.4.6.4.2. Update an active approval
delegation

Applies to User roles: System Administrator and other users with approval delegation
authority

You can change the delegate, the start date, or the end date of any currently active
approval delegation by using the Approval Delegation wizard. If you want to use a
delegation as a template for a new delegation, use the Copy Approval Delegation
wizard.

            Note

           To change approvals delegated by a specified assignment
           group or operator name, you must disable the current
           delegation and create a new one with the new assignment
           groups and operator names. Service Manager requires a
           new delegation in order to determine which operators are
           qualified to be delegates.

To update an active approval delegation, follow these steps:

   1. Click Approval Delegation. The Approval Delegation wizard opens and displays
     any active approval delegations assigned by you.

   2. Select the approval you want to edit from the list of active delegations.
   3. Click Edit Current Delegation.

   4. Select the new start and end dates for the approval delegation.

                   Note

                Service Manager dates always default to midnight (00: 00: 00) of the
                selected day. If you want to set a different start time, manually type
                in the new start time using the twenty-four hour: minute: second
                format notation. For example 23: 59: 59 represents 11: 59 PM and 59
                seconds.

   5. Click Next to save your changes and close the wizard.

Related topics


What happens when I delegate approval authority?
What happens when I receive delegated approval authority?
Copy an approval delegation
Delegate approvals to another operator
Disable an active approval delegation
Global variables available for approval delegation
Views available for approval delegation


1.6.4.6.4.3. Disable an active approval
delegation

Applies to User roles: System Administrator and other users with approval delegation
authority

You can disable any currently active approval delegation. You can't disable an
inactive past delegation.

To disable an active approval delegation, follow these steps:

   1. Click Approval Delegation.

     The Approval Delegation wizard opens and displays any active approval
     delegations assigned by you.

   2. Select the approval you want to disable from the list of active delegations.
   3. Click Edit Current Delegation.
   4. Clear the Enabled checkbox.
   5. Click Next to save your changes and close the wizard.

            Note

           To view your past delegations or delegations assigned to you, use one of
           the default approval delegation views.

Related topics

What happens when I delegate approval authority?
What happens when I receive delegated approval authority? Copy an approval
delegation
Delegate approvals to another operator
Update an active approval delegation
Global variables available for approval delegation
Views available for approval delegation


1.6.4.6.4.4. Copy an approval delegation

Applies to User roles: System Administrator and other users with approval delegation
authority

You can use an existing approval delegation as a template to create a new approval
delegation. The wizard copies the values from the existing delegation and allows you
to change the delegate and the delegation dates. You can't change the application
module, delegated approval groups, or operator when copying an approval
delegation. If you want to change these values, you must create a new approval
delegation.

To copy an approval delegation, follow these steps:

   1. From the To Do view, select Approval Delegation from the Queue list. Service
     Manager displays the Approval Delegation view.

   2. From the View list, select either My active approval delegations or My past
     approval delegations.

   3. Select the approval you want to copy from the list of approval delegations.
   4. Click Copy Approval Delegation. Service Manager displays the Copy Approval

     Delegation wizard and automatically fills in the delegate name, the delegated
     module, approval groups, and operator.
   5. Select the new delegate if needed.
   6. Select the new delegation start and end dates.
   7. Select Enabled.
   8. Click Next to create a new approval delegation.

Related topics

Delegate approvals to another operator
Disable an active approval delegation
Update an active approval delegation Global variables available for approval
delegation
Views available for approval delegation


1.6.4.6.5. Views available for approval
delegation

Service Manager provides default views for delegators and delegates to manage
approval delegations. Administrators can also view approval delegation records
directly from the Database Manager by viewing the ApprovalDelegation table.


View                                    Description                Available Actions
My active approval
delegations                             A list of the currently    Start the Approval
                                        active approvals that you  Delegation wizard
My past approval                        delegated to other         Export
delegations                             operators. This view       Print
                                        doesn't display future
                                        delegations because
                                        they're not currently
                                        active.

                                        A list of the inactive     Start the Copy
                                        approvals that you         Approval
                                        delegated to other         Delegation wizard
                                        operators in the past.     Export
                                                                   Print

Active approvals                        A list of the currently    Export
assigned to me                          active approvals           Print
                                        delegated to you. This
Past approvals assigned                 view only displays         Export
to me                                   approvals where you are    Print
                                        the active delegate. Use
                                        the other views to
                                        display your past or
                                        pending delegations.

                                        A list of the inactive
                                        approvals that other
                                        operators have
                                        delegated to you in the
                                        past.

Note

If you create or update an approval delegation record you may need to
use the Service Manager Refresh option in order for the views listed
above to display the new delegation record.


Related topics

Approval delegation
What happens when I receive delegated approval authority?
What happens when I delegate approval authority?
Copy an approval delegation
Delegate approvals to another operator
Disable an active approval delegation
Update an active approval delegation
````
