---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.6.4 .. 1.6.4.5
printed_pages: 1613-1634
---

# 1.6.4 Controlling user access and security

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.6.4. Controlling user access and
security

The System Administrator can control user access to Service Manager in the
following five ways:

   1. Setting individual access restrictions in operator records
           Assigning capability words to operators
           Assigning operators to application profiles
           Assigning roles to operators
           Assigning Security Roles to operators for Process Designer enabled
           modules
           Assigning operators to assignment groups
           Assigning operators to security groups
           Assigning operators to user role descriptions
           Creating a login profile
           Modifying field-level rights
           Enabling application time limits
           Enabling file attachment restrictions
           Enabling password requirements
           Enabling printing restrictions
           Enabling user session restrictions

   2. Setting access restrictions by tailoring the application layer
           Creating displayoptions and displayscreens
           Creating document engine objects, states, and processes
           Creating formatctrl
           Creating menus
           Defining DVD controls

   3. Setting global access restrictions in the System Wide Company record
           Enabling account expiration times
           Enabling active integrations to external applications
           Enabling application time limits
           Enabling login restrictions
           Enabling password requirements

   4. Setting global access restrictions to application tables in Mandanten
           Defining security group access to database tables
           Filtering records visible to users by security groups
           Limiting access to records by adding security group restricting queries

   5. Setting global access restrictions in the initialization file:


           Defining named users and restricting login to these named users only
           Enabling Secure socket layer (SSL) connections between the server and
           clients
           Enabling shared Mandanten file restrictions

In some cases, these five levels of access restrictions describe the same settings. In
such cases, Service Manager uses the following precedence to determine what
access restrictions apply:

   1. Settings in the initialization file override all other security settings
   2. Tailoring settings override security settings in individual operator records and

     the System Wide Company Record
   3. Settings in an individual operator records and Mandanten override security

     settings in the System Wide Company Record
   4. Settings in the System Wide Company Record apply to all operators that have no

     other security settings

Related topics

Application Setup
Adding users
Creating operator records
Defining named users
Operator passwords
Operator records
Operator templates


1.6.4.1. Proprietary records

Some proprietary records in Service Manager are identified by the words Proprietary
and are read-only. Having these records as read-only will help future Service
Manager upgrades.

Related topics

Tailoring
Create a form using the Form Wizard


1.6.4.2. Ongoing maintenance

The Ongoing Maintenance menu enables a System Administrator to access an
operator record to view user and contact information, application profile privileges,
and the Mandanten utility. If you use the ongoing maintenance menu and have
administrative rights, you can also access and control several users or a group from a
single application.

As an Application Administrator, you can add or edit users and manage user profiles
from within Service Manager applications. You can restrict certain user rights and
control the forms that users see when they access different parts of an application.


1.6.4.3. Environment record

Each application has an Environment record, which defines options that affect the
functionality of an application for all users. Some of the typical options stored in the
Environment record include:

     Relationship model
     Access rights
     Default category

Related topics

Application Setup
Application profiles


1.6.4.3.1. Service Manager record
relationship models

Service Manager Service Desk relationship models are methods to control the
relationships between records inside Service Manager. The Service Desk relationship
models affect four record types: Service Desk interaction records, Incident
Management incident records, Change Management change records, and Request
Fulfillment records. A Service Desk Agent can:

     Open an incident, complaint, or request for information in Incident Management
     Open a request for change in Change Management

     Open a Request Fulfillment record to order a product or service

     For example, if a user complains that a printer has stopped working and the
     Service Desk Agent determines that an older printer is not compatible with a
     new laptop, the agent can open a Request Fulfillment record to order a new
     printer for the user. Once the order is placed, the Service Desk Agent can close
     the interaction record and add the Request Fulfillment record number for the
     new printer to the resolution note of the interaction. The Request Fulfillment
     record is also associated to the interaction record, so that even though the
     interaction is at a closed status the agent can refer back to the closed interaction
     to check the status of the related Request Fulfillment record.

The following can be set in the Service Desk Environment Profile record and are
models for managing Service Desk record relationships:

     Full Service Desk Model: In this model, the state of a Service Desk interaction
     record changes when each related record closes. The closed state of an
     interaction record depends on the notification value chosen for the "Notify By"
     field in the interaction record. For example, if the notification value is
     "Telephone," the interaction record has a required action before it is closed. This
     action describes why the customer must be contacted. It also prevents the
     interaction record from closing until all required actions are complete. In this
     case, the interaction record goes into the Callback state before it is closed. For
     more information, see Full Service Desk model.
     All Records close Independently: In this model, all Service Desk interaction
     records close independently. The state of related records doesn't affect closing
     an interaction record, and closing the interaction record doesn't affect related
     records.


     Close Interactions when Related Record closes: In this model, when the last
     related record closes, the Service Desk interaction record closes.
     Cannot close Related Record until Interactions are closed: In this model,
     records related to a Service Desk interaction can't close until the interaction
     record is closed.
     Cannot close Interactions until Related Records are closed: In this model, a
     Service Desk interaction record can't close until all related Incident Management
     records, Change Management records, and Request Management records are
     closed.

Related topics

Full Service Desk model
Environment record


1.6.4.3.1.1. Full Service Desk model

In this model, the state of a Service Desk interaction record changes when each
related record closes, depending on the value of the Notify By field in the interaction
record. The following notification options are available.

Option                                  Description
None
E-mail                                  The interaction record closes.

Page                                    Service Desk sends an email to the
                                        contact listed in the interaction record.
Telephone                               The email informs the contact that the
                                        related record is closed. Service Desk
                                        closes the interaction record.

                                        Service Desk sends a page to the
                                        contact listed in the interaction record.
                                        Service Desk closes the interaction
                                        record.

                                        The interaction record has a required
                                        action. This action describes why the
                                        customer must be contacted. It also
                                        prevents the interaction record from
                                        closing until all required actions are
                                        complete. The interaction record goes
                                        into the Callback state.

Related topics

Configure the Service Desk environment


1.6.4.3.2. Status progression

Service Manager applications have a logical status progression as a Service Desk
Interaction, Change, Change Task, Problem, Problem Task, Request, or Request Task
moves through its individual life cycle. The following table describes the out-of-box
status values that Service Manager assigns to these applications.


Application                             Status progression
Change Management (Change)
                                        Initial
Change Management (Change Task)         Closed

                                        Planned
                                        Ready
                                        Assigned
                                        In Progress
                                        Completed
                                        Completed with Problems
                                        Canceled
                                        Withdrawn
                                        Failed
                                        Blocked

Incident Management                     Categorize
                                        Assign
                                        Work In Progress
                                        Pending Customer
                                        Pending Evidence
                                        Pending Vendor/Supplier
                                        Pending Other
                                        Resolved
                                        Suspended
                                        Closed


Application                             Status progression
Problem Management (Problem)
                                        Open
                                        Categorize
                                        Assign
                                        Work In Progress
                                        Deferred
                                        Pending
                                        Resolved
                                        Closed

Problem Management (Problem Task)       Planned
                                        Ready
                                        Assigned
                                        Work In Progress
                                        Pending
                                        Pending Review
                                        Closed

Application                                                                                     Service Manager 9.81
Service Desk
                                        Status progression
Request Fulfillment
                                        Open
                                        Categorize
                                        Assign
                                        In Progress
                                        Dispatched
                                        Resolved
                                        Suspended
                                        Withdrawal Requested
                                        Closed

                                        Open
                                        In Progress
                                        Pending Customer
                                        Suspended
                                        Fulfilled
                                        Closed
                                        Ordering
                                        Closed


Application                                 Status progression
Request Fulfillment (Request Task)
                                            Planned
                                            Ready
                                            In Progress
                                            Pending Customer
                                            Pending Vendor/Supplier
                                            CMDB Update
                                            Pending Review
                                            Canceled
                                            Closed

Related topics

Service Manager record relationship models


1.6.4.4. Application profiles

Application profiles are security settings that decide which features a user can
access from a particular Service Manager application. Each of the seven Service
Manager applications has a set of application profiles that decide which features a
user can see. An application profile defines the access settings that a particular
business function or role has to the application. Typically, System Administrators
assign application profiles as part of user role descriptions. However, the
administrator can also assign an individual application profile that overrides the
default settings of a user role.

Users must have an application profile in their operator record to access any
application. Each out-of-the-box application has a profile record named Default to use
when a profile doesn't exist. Each application also has a setting to enable access to
the application using only the Default profile.

For example, records in the smenv table store Service Desk rights and privileges
information, such as whether a user can close a service desk interaction record.
Profiles also store information that may affect the way an application looks and
behaves, such as defining a personal search form for a user.

            Note

           Application profiles aren't used for modules using Process Designer
           (other than Knowledge Management). For more information, see Process
           Designer security model.

Application profile authentication

When a user attempts to access one of the applications, Service Manager does the
following:

   1. Retrieves the profile name from the operator record and accesses the profile
     record for the specific application.

   2. If Service Manager can't find a user profile, it uses the Default profile.
   3. If Service Manager can't find a user profile and the setting to use the Default

     profile isn't enabled, it denies the user's access to the application.

Related topics

Application Setup
Environment record



1.6.4.5. Enabling approvals

Service Manager Codeless supports approvals in the out-of-box system for the
following objects:

     Interaction
     Change and Change Task
     Request
     Service Catalog Item
     Survey
     Time Period

For the applications based on these objects, you can directly use the approval related
features from the out-of-box system.

            Tip

           For more information on the out-of-box approval features for a specific
           application, see the help topics for the corresponding module.

If you want to enable approval for a Process Designer based object that doesn't offer
approvals in the out-of-box system, such as problem, you need to configure approval
from the Process Designer workflow, and then manually add the approval.status field
to the related forms. After the approval enablement, users who have the required
privileges can use the approval features for the application based on the approval
enabled object. The following table describes the approval features available after the
approval enablement and the privileges that are required for using the corresponding
approval features.


Approval feature                        Required security privileges for users
Approve/deny/retract records in the     in a security area
record menu
                                        Users who have the "Can Approve”
Mass approve records in the list view   right or are delegated with the approval
Approval Inbox                          authority can approve, deny, and
                                        retract records.

                                        Users who have the "Expert” right can
                                        mass approve records in the list view.

                                        Users who are in the approver list and
                                        have the "Can Approve” right or are
                                        delegated with the approval authority
                                        can see the record list for an area and
                                        perform approval actions from the
                                        Approval Inbox.

                                                    Note

                                                   Users must also have the
                                                   privilege to run Approval
                                                   Inbox.

Approval delegation                     User who have the “Can Delegate
                                        Approvals” right can delegate their
                                        approval rights to other qualified
                                        operators.

For instructions on enabling approval for a Process Designer based object that
doesn't offer approvals in the out-of-box system, see Enable approval for a Process
Designer based object.

Related topics

Approval delegation Enable approval for a Process Designer based object
Delegate approvals to another operator
Disable an active approval delegation
Update an active approval delegation


1.6.4.5.1. Enable approval for a Process
Designer based object

To enable approval for a Process Designer based object that doesn't offer approvals
in the out-of-the-box system, follow these steps:

   1. Configure approval in the workflow that's associated with a Process Designer
     based object.

        1. Sign in to Service Manager with a System Administrator account from the
           web client.

        2. Click Tailoring > Process Designer > Workflows from the System
           Navigator to display the workflows list.

        3. Open the workflow associated with the object for which you want to enable
           the approval related features.

                         Note

                      The out-of-the-box workflows are Proprietary. You can clone
                      the out-of-the-box workflows, and then make changes as
                      necessary.

        4. Select a phase, and then go to the Approval tab.
        5. Click Add, select one or more approval definitions, and then click OK.
        6. (Optional) Configure the approval reset condition and the recalculate

           condition if necessary.

        7. Click Save.

           Suppose you have configured approval from the workflow associated with
           a Process Designer based object that doesn't offer approvals in the out-of-
           the-box system. The system automatically creates or updates the following
           items to enable the approval related features for the records based on the
           object:

Item                                                                                Service Manager 9.81
Menu items
Approval Inbox                          Changes after enabling approval

Approval delegation wizard              Menu items are created in record
                                        menu options, such as Approve,
                                        Deny, Retract, and Mass
                                        Approve.

                                        Approval Inbox can display the
                                        pending approvals for the records
                                        corresponding to the approval
                                        enabled object.

                                        SM adds the module associated
                                        with the object to the approval
                                        delegation wizard.

Item                                                                                Service Manager 9.81
Security area
                                        Changes after enabling approval

                                             Security settings

                                             The "Can Approve" and
                                             "Can Delegate Approval"
                                             security settings are added
                                             for the security area that's
                                             associated with the object.

                                             With the "Can Approve" right
                                             for an area, an operator can
                                             see the approval records in
                                             the Approval Inbox for all the
                                             Service Manager tables that
                                             are associated with the area.

                                             With the "Can Delegate
                                             Approvals" right for an area,
                                             an operator can delegate
                                             approvals from the approval
                                             delegation wizard for all the
                                             Service Manager tables that
                                             are associated with the area.

                                             Security folder

                                             SM creates a new folder
                                             right with the name of
                                             <Record module name>
                                             approver for this security
                                             area. The system sets the
                                             folder to “DEFAULT” with the
                                             view authority only.


Item                                    Changes after enabling approval
Security role and security rights
                                        SM creates a new security role in
                                        the name of <Record module
                                        name> approver. The system also
                                        sets default security rights (such
                                        as "Expert") and default settings
                                        (such as "Can Approve" and "Can
                                        Delegate Approvals") to this role.

   2. Edit the necessary forms to add the new approval field ("approval.status").

        1. Sign in to Service Manager with a System Administrator account from the
           Windows client.

        2. Click Tailoring > Forms Designer from the System Navigator.

        3. Search for and open a form in which you want to display the approval
           status.

        4. Add the "approval.status" to the form as appropriate.
        5. Click Save.
        6. Repeat this task to modify other forms as needed.

   3. Assign the new security role ("<Record module name> approver") to operators
     who need to perform the approval tasks for the new approval enabled module.
     To do this, see Assign a role or roles to an operator.

     Now the operators with the security role can use the approval features as
     described in Enabling approvals.

Related topics

Enabling approvals
Approval delegation
Delegate approvals to another operator
````
