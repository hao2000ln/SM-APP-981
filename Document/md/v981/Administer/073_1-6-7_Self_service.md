---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.6.7 .. 1.6.8
printed_pages: 1787-1823
---

# 1.6.7 Self-service

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.6.7. Self-service

Self-service enables any user to connect with a Service Manager application to
request a service, provide information, or track previous requests. Self-service users
can also be granted approval capabilities that enable the user to approve change
requests. Typically, this capability is given to high-level managers with a need to
approve special requests who may otherwise have no need to use Service Manager
on a regular basis.

The self-service feature provides a way for administrators to grant access to
infrequent users, field personnel, or any other user outside of the IT organization
without consuming a user license. These users need no special training or software. If
users can connect to the Service Manager server using a supported browser, they
can open incidents or make service requests.

            Note

           Users that are logged in to the ESS client can only see records in which
           they are the service recipient, primary contact, or records for which they
           are an approver.

Related topics

Who uses self-service?
Self-service licenses
Self-service tailoring
Configuring the self-service working environment
Creating self-service users
Choosing a configuration item for self-service requests
Working with self-service requests


1.6.7.1. Working with self-service requests

Self-service has features that enable you to open, view, update, copy, resubmit, or
close service requests. Users are able to create new requests, using a supported
browser, that become service desk interaction records. Self-service users can review
their pending requests and make changes to them as needed. Self-service users can
also use the Service Catalog interface to order items and services from the service
catalog.


1.6.7.1.1. Visible updates for self-service
requests

In the Employee Self-Service User view, when a self-service user makes an update to
an open request, the user can view the update text in the Interaction record's History
section. When a Service Manager IT agent views the same record in the Power User
view, the Activities tab consists of two tabs that relate to updates.

     Record new activities in the Updates field and view journal entries in the Journal
     Updates field when the administrator enables Journal Updates in the
     Environment record on the Journal Updates tab
     View the list of updates on the Activity Logs tab

When the IT agent makes an update to an open self-service request, Service Desk
hides the update text from the self-service user. To show the update text to the self-
service user, the IT agent must select the Visible to Customer checkbox on the
Activities tab of the Interaction form.

            Note

           This option can be bypassed by setting the Bypass Visibility Option flag
           to true in the activityactions table. When this flag is set to true, automatic
           activities are invisible to customers, whether the Customer Visible option
           is selected or not. When the flag is set to false, all activities are visible to
           customers if the Customer Visible option is selected.

Related topics

Self-service
Who uses self-service?
Self-service licenses
Configuring the self-service working environment


1.6.7.2. Creating self-service users

There are different ways to create a self-service user:

     Manually create an operator and contact record for a single self-service user

     Service Manager has an out-of-box template record to assist you with this task.

     Create a self-service operator from a contact record with a single operation
     Create multiple self-service operators from a contact record list with a single
     operation

Related topics

Self-service
Who uses self-service?
Self-service licenses
Self-service tailoring
Configuring the self-service working environment
Self-service template record
What's a self-service power user?
Accessing Service Manager
Working with self-service requests
Add a user role record
Create a self-service user
Create a self-service user from an existing contact
Create multiple self-service users from a contact list
Grant self-service access


1.6.7.2.1. ESS and ESSM-Approval users

ESS users have a regular Service Desk profile that enables them to log on to Service
Desk only through a self-service web client URL. A user with an ESSM-Approval
profile (for example, a manager) can approve change requests specified by a dollar
amount or company. Typically, this capability is given to high-level managers with a
need to approve special requests who otherwise have no need to use Service
Manager on a regular basis.

Related topics

Creating self-service users
Grant self-service access


1.6.7.2.2. Self-service template record

Service Manager has an out-of-box operator template record, Template_SelfService,
that contains all required operator settings. The password field is null. Therefore, the
first time a registered user logs in, no password (or a blank password) appears.
Service Manager prompts the self-service user to create a password.

The self service out-of-box user role record lists thefollowing capability words:

     service desk
     svcCatEmployeeRequester
     service catalog
     change request

If you create self-service users manually, make sure that you include the applicable
settings in the out-of-box records.

Related topics

Self-service
Who uses self-service?
Self-service licenses
Self-service tailoring
Configuring the self-service working environment
Creating self-service users
What's a self-service power user?
Accessing Service Manager
Working with self-service requests
Add a user role record
Create a self-service user
Create a self-service user from an existing contact
Create multiple self-service users from a contact list
Grant self-service access


1.6.7.2.3. Create a self-service user

Applies to User roles: System Administrator

A new self-service user requires an operator record and a contact record. We
recommend that you also create a user role for all self-service users. Alternatively,
you can use the out-of-box self-service user role record.

Create self-service user contact record and
operator record in one operation

To create the contact record and the operator record in one operation, follow these
steps:

   1. Click System Administration > Base System Configuration > Contacts.

   2. Specify information for the new contact that you want to create. The following
     fields are required for a self-service user:

           Contact Name
           Full Name

           Email

           Service Manager uses the email address as the user's Service Manager ID
           when it creates the new operator record.

   3. (Optional) Choose the Primary Configuration Item to be associated with this
     user.

   4. Click Add.
   5. When the new contact record is created, click More or the More Actions icon,

     and then click Create Operator.
   6. Select Self Service User for the operator type, and then click Next.
   7. Click Save.
   8. Click OK.

Create self-service user manually

To create a self-service user manually, follow these steps:


          Note

         If you create the operator record manually, you can use the out-of-box
         template record (Template_SelfService) to create a self-service user. If
         you choose this method, you must also create a matching contact record.

 1. Click System Administration > Ongoing Maintenance > Operators.
 2. Type or select optional search criteria, and then click Search.
 3. Select Template_SelfService.
 4. Replace the Login Name and Full Name.
 5. Verify the following:

          User Role field contains SELF SERVICE.
          Service Profile field contains SELF SERVICE.
 6. Add optional information, such as Language and Default Company name.
 7. Click the Login/Contact Profiles tab and choose a resource type from the
    Resource Type list.
 8. Click the Notification tab and in the Email Addr. field, type the self-service
    user's email address.
 9. Click the Self Service tab:
          To limit the new user to only self-service requests, select the
          Self Service Access Only checkbox.
          Type the name of the Self Service Menu to display when the user logs on
          using a self-service URL. The out-of-box menus are ESSSM and ESSM-
          Approval. ESSM-Approval provides the Approval Request link to the
          Approval view on the self-service starting page for those users with
          approval capability.
          Click the list to choose the Self Service Starting Page to display when the
          user logs on using a self-service URL. For example, choose Submit a
          Request.
10. Add optional information to any tab.
11. Click Add.
12. Create a self-service user contact record:
       1. Click System Administration > Base System Configuration > Contacts.
       2. Type the new contact information.
       3. Click Add.


            Note

                The Service Manager ID field in the contact record must match the
                operator Login Name in the operator record.
                If you choose the User Quick Add Utility, Service Manager prompts
                you to create the contact record for the user if it doesn't exist.
                You can apply the Template_SelfService template to a new operator
                record.

Related topics

User roles
Self-service
Creating self-service users
What's a self-service power user?
Add a user role record
Delete a user role record
Search for a user role record
Create a self-service user from an existing contact
Create multiple self-service users from a contact list
Grant self-service access


1.6.7.2.4. Create a self-service user from
an existing contact

Applies to User roles: System Administrator

To create a self-service user from an existing contact, follow these steps:

   1. Click System Administration > Base System Configuration > Contacts.
   2. Use search or advanced search to find one or more records.
   3. Select a contact record.
   4. Click More or the More Actions icon above the form of the contact record, and

     then click Create Operator.
   5. Select Self Service User for the operator type, and then click Next.
   6. Click Save.
   7. Click OK.

            Note

           The self-service user name is the user's email address.

Related topics

User roles
Self-service
Creating self-service users
What's a self-service power user?
Add a user role record
Delete a user role record
Search for a user role record
Create a self-service user
Create multiple self-service users from a contact list
Grant self-service access


1.6.7.2.5. Create multiple self-service
users from a contact list

Applies to User roles: System Administrator

            Caution

           This function will fail if anyone in the contact list already has an operator
           record. At that point it stops and doesn't create operator records for any
           remaining contacts in the list.

To create multiple self-service users from a contact list, follow these steps:

   1. Click System Administration > Base System Configuration > Contacts.
   2. Use search or advanced search to find one or more records.
   3. Select the contacts for which you want to create self-service users.
   4. Click More or the More Actions icon, and then select Mass Create Operators.
   5. Select Self Service User for the operator type, and then click Next.
   6. Click OK.

Related topics

User roles
Self-service
Creating self-service users
What's a self-service power user?
Add a user role record
Delete a user role record
Search for a user role record
Create a self-service user
Create a self-service user from an existing contact
Grant self-service access


1.6.7.2.6. What's a self-service power
user?

A self-service power user has two ways to access Service Desk. The access method
depends on the task to complete:

     They have a Service Desk profile that enables them to log on to Service Desk (or
     other Service Manager applications) using the Windows client connection dialog
     or any valid Web client URL to view, add, update, or delete records. For example,
     the user has a Service Desk profile that enables the user to take service
     requests and provide services to a user community.
     They have a self-service profile that enables them to initiate service requests
     through a self-service URL. For example, a self-service user can use this feature
     to request services.

The following table shows how a user can access Service Manager in self-service or
power user mode.

URL                                     Description
http: //server_name:
port_number/SM/ess.do                   The standard Web client interface for
                                        self-service users. The viewrecordlist
http: //server_name:                    parameter is disabled.
port_number/SM/index.do
                                        The standard Web client interface for
http: //server_name:                    power users. Self-service mode using
port_number/SM/accessible_ess.do        the parameters set in the web.xml file.

                                        The accessible Web client in self-
                                        service mode. The viewrecordlist
                                        parameter is disabled because it
                                        doesn't conform to accessibility
                                        requirements.

Related topics

Self-service
Who uses self-service?
Creating self-service users
Self-service template record


Add a user role record
Delete a user role record
Search for a user role record
Create a self-service user
Create a self-service user from an existing contact
Create multiple self-service users from a contact list
Grant self-service access


1.6.7.2.7. Grant self-service access

Applies to User Roles: System Administrator

To grant self-service access, follow these steps:

   1. Click System Administration > Ongoing Maintenance > Operators.
   2. Type or select optional search criteria.
   3. Click Search.
   4. Select an existing operator record.

   5. On the General tab, click Fill to choose a Service Profile, or click Find to modify
     the existing profile.

     For example, you can add desired self-service privileges, such as Open, Update,
     or Close to the existing Service Profile.

   6. Click the Self Service tab. Make sure that the operator record has these
     settings:

           The Self Service Access Only checkbox must be cleared.

           Type the name of the Self Service Menu to display when the user logs on
           using a self-service URL. The out-of-box menus are ESSSM and ESSM-
           Approval.

           ESSM-Approval provides the Approval Request link to the Approval view on
           the self-service Starting page for those users with approval capability.

           Click the list to choose the Self Service Starting Page when the user logs
           on by using a self-service URL.

           For example, choose Submit a Request.

   7. Click Save.

            Note

           The Login Name in the operator record must match the Service Manager
           ID in the contact record.

Related topics

User roles
Self-service


Creating self-service users
What's a self-service power user?
Add a user role record
Delete a user role record
Search for a user role record
Create a self-service user
Create a self-service user from an existing contact
Create multiple self-service users from a contact list


1.6.7.3. Configuring the self-service
working environment

The self-service user experience requires special forms that the user sees, and
security settings that enable user access. You can use the out-of-box records and
forms created for self-service users, customize them, or create new ones. The
following table lists the records that you must configure to define a user's self-service
working environment.

Record            Content               Form                    Service Manager 9.81
                                        (if applicable)
                                                         Description
User role record  A template record
                  that combines a                        Click Tailoring >
                  collection of                          Database
                  application                            Manager.
                  profiles and                           Type userrole in
                  capability words                       the table field and
                  into a single                          click Search.
                  record.                                Select userrole fr
                                                         om the record list.
                                                         Place your cursor
                                                         in the User
                                                         role field and
                                                         click Search to
                                                         display a record
                                                         list of all out-of-
                                                         box user role
                                                         descriptions.


Record          Content                 Form                 Description
                                        (if applicable)
Service Desk
profile record  Specifies which         There should be a    Click Tailoring >
                form to display         form listed for      Database
                when the self-          each task            Manager.
                service user            enabled for a        Type smenv in the
                chooses different       self-service user.   table field and
                tasks.                  For example, the     click Search.
                                        form to display to   Select smenv fro
                You can change          open, update,        m the record list.
                the user                search, or display   Place your cursor
                experience by           a list of requests.  in the Profile
                creating a unique                            name field and
                profile for all self-   ESS Initial Format   click Search to
                service users in a      identifies the       display a record
                group,                  form to open a       list of all out-of-
                department, or          request.             box Service Desk
                company. Each                                environment
                profile identifies                           profile records.
                the forms that the
                user sees. For                               Click Tailoring >
                example, if you                              Forms Designer,
                create separate                              type ess.SD.ope
                company profiles,                            n in the Formfield,
                each form set                                and
                would have                                   click Search to
                unique corporate                             view the out-of-
                branding.                                    box form.

                You can view the
                Environment
                profile record by
                clicking System
                Administration >
                Ongoing
                Maintenance > Pr
                ofiles > Service
                Desk Profiles.


Record  Content                         Form               Description
                                        (if applicable)
        Click Search to
        generate a list of              ESS Edit           Click Tailoring >
        all existing                    Format identifies  Forms Designer,
        profiles.                       the form to        type ess.SD.upd
                                        update a request.  ate in
                                                           the Form field,
                                                           and
                                                           click Search to
                                                           view the out-of-
                                                           box form.

                                        ESS Search         Click Tailoring >
                                        Formatidentifies   Forms Designer,
                                        the form to        type ess.SD.sea
                                        search for a       rch in
                                        request.           the Form field,
                                                           and
                                                           click Search to
                                                           view the out-of-
                                                           box form.

                                        ESS List           Click Tailoring >
                                        Format identifies  Forms Designer,
                                        the form to        type ess.SD.qbe
                                        display a list of
                                        requests.          in the Formfield,
                                                           and
                                                           click Search to
                                                           view the out-of-
                                                           box form.

Record        Content                   Form                    Service Manager 9.81
                                        (if applicable)
Service Desk                                             Description
environment   Specify on this
record        record whether                             Click System
              self-service users                         Administration >
              see a blank list                           Ongoing
              screen when they                           Maintenance > Pr
              issue a pre-                               ofiles > Service
              defined search.                            Desk Profiles.
              This behavior is                           Place your cursor
              controlled at the                          in the Profile
              system level.                              name field and
                                                         click Search.
                                                         Select the profile
                                                         name for which
                                                         you would like to
                                                         restrict from
                                                         viewing records
                                                         lists. Click
                                                         the Security tab.
                                                         Click
                                                         the Rights tab.
                                                         Select
                                                         the View checkbo
                                                         x. Click Save and
                                                         then click OK.

Record        Content                   Form                    Service Manager 9.81
                                        (if applicable)
Operator                                                 Description
record(Self-  Self Service
Service tab)  Menu field:                                Describes the
                                                         actions available
              Specifies the                              to the user in the
              layout of the                              left navigation
              user's home page                           pane (ESSSM).
              when they log on
              as a self-service                          Identifies the
              user.                                      default start page
                                                         in the main
              Self Service                               browser window.
              Starting                                   For example, if
              Page field:                                you
                                                         select Display
              Specifies the first                        ESS Menu, the
              form that appears                          starting page
              in the main                                displays the same
              window.                                    menu items that
                                                         appear in the left
                                                         navigation pane.
                                                         If you
                                                         select Submit a
                                                         Request, the
                                                         starting page is
                                                         the form to open
                                                         a new request.


1.6.7.3.1. Create a Service Desk self-
service security role

Applies to User roles: System Administrator

The out-of-box self service security role is indented for self-service users. You can
create a security role for self-service users based on this one.
To create a Service Desk self-service security role, follow these steps:

   1. Navigate to System Administration > Security > Roles.
   2. Locate the self-service security role by performing a search. This security role

     has only View rights to some modules.
   3. Create a new security role from this role or update this role as needed.
Now, you can assign the new or updated security role to self-service users by using
the Mass Update feature.


1.6.7.3.2. Who uses self-service?

Self-service access is useful for all individuals in an organization. It enables them to
make requests through self-service Web pages. These requests include service
disruptions, service requests, catalog item requests, requests for information (RFI), or
complaints. Typically, these requests generate an interaction in Service Desk, or they
are a request for specific item or service in a service catalog. The following table
shows typical organizational roles and how different employees might use the self-
service feature.

 User name                                                                                      Service Manager 9.81
 Employee user
                                        Tasks
 Administrative assistant
                                        Uses self-service to make requests for
 Department Manager                     self and on behalf of other employees
                                        and managers.
 IT Technician                          Example, a user needs spreadsheet
 High level executive                   software upgraded to the newest
                                        version.
Related topics
                                        Uses self-service to make requests
This PDF was generated on May 23, 2026  primarily for others.
                                        Example: a manager directs an
                                        assistant to request a color printer for
                                        the office.

                                        Uses self-service to make requests for
                                        self and direct reports.
                                        Example: a manager requests new
                                        computer systems for each software
                                        developer in a group.

                                        Makes service requests for self.
                                        Example: a technician needs to change
                                        an address in an employee record.

                                        Makes approvals for high dollar catalog
                                        orders.
                                        Example: a senior manager needs to
                                        approve a request at the business
                                        executive level.

                                                                                                                          Page 81 of 191

Self-service
Self-service licenses
Self-service tailoring
Configuring the self-service working environment
Creating self-service users
Accessing Service Manager
Working with self-service requests


1.6.7.4. Choosing a configuration item for
self-service requests

Each self-service request can associate one Configuration Item (CI) with the request.
For example, the request might be for service on your computer, or to request a new
display device. To add a CI to a request, click Search to display a Search
Configuration Item form. You can specify filtering criteria first, or just click Search
again to view a list of available CIs.

Related topics

Self-service
Working with self-service requests


1.6.7.5. Self-service tailoring

A System Administrator can modify the look and feel of self-service forms to reflect
their corporate branding by using the Forms Designer or by modifying the display
options and menu selections. However, a self-service user is not able to customize
the self-service environment.

Because self-service is part of the Web tier, you can also customize the Web tier
presentation to include font changes, logos, graphics, or navigation pane alterations.
Customizations can affect the top header, navigation pane, or main page area.

Related topics

Self-service
Who uses self-service?
Self-service licenses
Configuring the self-service working environment
Creating self-service users
Accessing Service Manager
Working with self-service requests
Forms Designer best practices
Customize the self-service interface


1.6.7.5.1. Customize the self-service
interface

Applies to User Roles: System Administrator

You can customize the self-service interface by changing the menu and forms that
Service Manager displays to the user.

Task 1: Change the menu record

The self-service menu record contains option numbers, descriptions, and the RAD
application called by the option. If you change the contents of the menu record,
especially the options, change the corresponding forms to match.

To change the menu record, follow these steps:

   1. Click Tailoring > Database Manager.
   2. In the Form field, type menu.
   3. Click Search.
   4. Double-click the menu form.
   5. In the Menu Name field, type ESSSM.
   6. Click Search to display the self-service menu record.
   7. If you make changes, click Save.

Task 2: Change the forms

The self-service menu record contains option numbers that correspond to the Button
ID on the form. If you changed the options in the menu record, the Button ID on the
form must match the associated option number in the menu record.

To change the forms, follow these steps:

   1. Click Tailoring > Forms Designer.
   2. In the Form field, type menu.gui.ess.SD.
   3. Click Search.
   4. Click Design.
   5. After you make the changes, click OK.

Related topics

Self-service
Self-service tailoring


1.6.8. Views and favorites administration

A view uses a pre-defined query to display a set of records. As a system
administrator, you can use Views/Favorites to create a new view, edit an existing view,
or delete a view. A view includes the following elements, which can be specified or
modified when the view is created or edited.

     View definition:
           View Fields - fields displayed in the view.
           Group By - how the records are grouped.
           Sort By - how the records are sorted.

     Audience specifies which users can use the view.
     Ownership specifies who is allowed to manage the view and who is allowed to
     manage the content displayed by the view.

System administrators access the Views/Favorites function from the System
Administration menu:

System Administration > Base System Configuration > Miscellaneous >
Views/Favorites

Create a view

Applies to User roles: System Administrator

You can create a view for one or more users to customize the default log-on view. For
example, if a group of users regularly searches on the same query, you can provide
them with a shared query view as their default whenever they log on to Service
Manager.

This topic assumes that you are familiar with Service Manager table and field names.

To create a view, follow these steps:

   1. Click System Administration > Base System Configuration > Miscellaneous >
     Views/Favorites.

   2. Click New.

     The New View wizard opens.

   3. Select the Area to create the view in and then click Next.
   4. Specify the name and type for the view you wish to create, and whether it is a

     system view or personal view.


   5. Select who the view will be available to, and then click Next:
           Everyone
           Selected Groups
           Selected Roles

   6. Select the fields you want in your view:
        1. Click Fields.
        2. To add fields, select items from the table menu and click Add to List.

                         Note

                      If you select a field that has a link to another table, select from
                      the secondary menu to add fields you want in the view.

   7. Select view properties for Group By, Sort By, Filter, and Autoformat as desired.
   8. Click Finish.

     After the system adds the view, you can provide additional information for the
     view definition
   9. In the Audience tab, select an audience for the view and then click Save.
 10. You can also update or add additional properties for the view with the View
     definitions, Query definitions, and Ownership tabs.

Add a view for a new table

Applies to User roles: System Administrator
When you want to expand the list of views in a queue, you can use the New View
wizard. However, if the table doesn't yet exist, you need to first configure the table as
an object record. You can then add the view to the table.

            Note

           These procedures use the kmdocument table as an example for
           configuring and adding a Knowledge Documents view to a table.

To configure an object record for a new table, follow these steps:

   1. Click Tailoring > Document Engine > Objects.


   2. Type the file name (table name) in the File name field. For this example, type
     kmdocument.

   3. In the Manage Queues tab, type an expression in the Manage condition field
     that evaluates to true. For example, type lioption("Knowledge Management").

   4. Create a form to be used to display the view. Type your entry in the Manage
     default view field. For example, type Knowledge Documents.

   5. Click Fill in the Manage display format field and choose inbox.view.
   6. Click Add.
   7. Log out of Service Manager, and then log back in. This enables the new object

      kmdocument table that you configured to be added to the view list. You can
     now add the new view to the table.

To add a view to a table, follow these steps:

   1. Click System Administration > Base System Configuration > Miscellaneous >
     Views/Favorites.

   2. Click New. The New View wizard opens.
   3. Select an entry for Area (Knowledge Documents) and then click Next.
   4. Type the name of the view in the Name field and then click Next.
   5. Click Fields.
   6. Select Title in the Knowledge Documents list entries and then click Add to List.

     The Title entry appears in the Destination Fields box.

   7. Click Finish. You receive a message that states the view record was added. You
     also see the View Definition form to add additional properties to the view you
     created.

     The view appears under Favorites and Dashboards in the navigation pane.

Delete a view

Applies to User roles: System Administrator

To delete a system view, follow these steps:

   1. Click System Administration > Base System Configuration > Miscellaneous >
     Views/Favorites.

   2. Click Search to find a system view.
   3. Select a system view from the records list.
   4. Click Delete, and then click Yes to confirm.

Change fields in a view

Applies to User roles: System Administrator


You can add, delete, or change the order of fields in a system view. This topic
assumes that you are familiar with Service Manager table and field names.

            Note

           You can only change fields for views with a Table view type.

To change fields in a system view, follow these steps:

   1. Click System Administration > Base System Configuration > Miscellaneous >
     Views/Favorites.

   2. Click Search to find the view you want to change.
   3. Select the view from the records list.
   4. On the View definitions tab, click View Fields.
   5. To add fields, select items from the table menu and click Add to List.

                   Note

                If you select a field that has a link to another table, select from the
                secondary menu to add fields you want in the view.

   6. To delete fields, highlight the field you want to delete in the Destination Fields
     window and click Remove Field.

   7. To move a field location up, highlight the field you want to move in the
     Destination Fields window and click Move Field Up.

   8. To move a field location down, highlight the field you wan tot move in the
     Destination Fields window and click Move Field Down.

   9. Click Next.
 10. Click Save.

     Service Manager updates the View record.
 11. Click OK.

Change roles for a view

Applies to User roles: System Administrator
To change roles for a view, follow these steps:

   1. Click System Administration > Base System Configuration > Miscellaneous >
     Views/Favorites.


   2. Click Search to find a view.
   3. Select the view to updated from the records list.
   4. In the Audience tab, make the applicable updated.

   5. Click Save.

     Service Manager updates the View record.

   6. Click OK.

Add a new autoformatting rule

Applies to User roles: System Administrator

Autoformatting is part of a view in that it is a view that has been customized by a set
of rules that specify certain display conditions for records that satisfy the conditions.
For example, you can create a view that displays all incident records older than one
week and then in that view create an autoformatting rules that displays records as red
if their urgency is critical.

System administrators access autoformatting by selecting Customize Current View
from the More Actions menu for a view or queue.

To add a new autoformatting rule, follow these steps:

   1. From the System Navigator, click Service Desk > Interaction Queue.
   2. From the Queue menu, select Approval to open the Approval Queue.

   3. Click More or the More Actions icon, and then Customize Current View.

     The Configure View Properties wizard opens.

   4. Click the Autoformat button.

   5. Click the Add Rule button to open a new autoformat rule.

        1. Type a name in the name field.
        2. Select a color from the list in the Color field.
        3. Select a field for your new rule in the Field list.
        4. Select an operator in the Operator field, such as starts with .
        5. In the next field, select a comparison value, such as a to establish the rule

            starts with the letter a .

   6. Click Next to view a list of current rule definitions. The Configure Autoformat
     Rules form opens.

     You can use this form to perform the following operations:


           Add, edit, or remove autoformatting rules
           Move the order of rules up or down; the first in the order overrides the
           others
           Return to the main Configure View Properties wizard form
   7. Click Next to return to Configure View Properties.

   8. Click Next for the new rule to take effect.

     The records that match your rule criteria now display in the color selected for
     this rule.

Adjust the order of an autoformatting rule

Applies to User roles: System Administrator
To adjust the order of an autoformatting rule, follow these steps:

   1. From the System Navigator, click Service Desk > Interaction Queue.
   2. From the Queue menu, select Approval to display the Approval Queue.
   3. From the next Queue menu, select Incident to view the Incident queue.

   4. From the View menu, select a view, such as Autoformat date view.

     Note the existing autoformatting rules defined.

   5. Click More or the More Actions icon, then Customize Current View.

     The Configure View Properties wizard opens.
   6. Click Autoformat.

   7. Select a rule to adjust the order of and click the Move Up or Move Down button
     to adjust the order of the rule.

     Note that the first rule in the order overrides all others in the record list.

   8. Click Finish to return to the Incident queue.

Edit an autoformatting rule

Applies to User Roles: System Administrator

To edit an autoformatting rule, follow these steps:

   1. From the System Navigator, click Service Desk > Interaction Queue.
   2. From the Queue list, click Approval to open the Approval Queue.
   3. From the next Queue menu, click Incident to view the Incident queue.


   4. From the next View menu, select a view, such as Autoformat date view.

     Note the existing autoformatting rules defined.

   5. Click More or the More Actions icon, then Customize Current View.

     The Configure View Properties wizard opens.

   6. Click the Autoformat button.

   7. Select a rule to edit and click the Edit button.

     The Autoformat Rule wizard opens.

   8. In the name field, you can optionally change the name of the rule.
   9. For the rule to be active, select the Is Active checkbox. For the rule to be

     inactive, clear the Is Active checkbox.
 10. In the Color field, you can optionally modify the color in which the rule appears

     in the queue by using the color selections.
 11. Optionally modify the field name by using the field selections.

 12. In the Operator field, you can optionally modify the operator to use for this rule.

     Valid options for operators in autoformatting rules are:

           On
           On or After
           On or Before
           Is Between
 13. You can optionally modify the date in the date field by selecting a date using the
     calendar widget or by manually typing in a new date.
 14. Click Next to view your modified rule definition.
 15. Click Finish.
 16. From Specify View Type, select Save as a system view or Save as a personal
     view.
 17. Click Finish to return to the Incident queue and view your changes.

Remove an autoformatting rule

Applies to User Roles: System Administrator

To remove an autoformatting rule, follow these steps:

   1. From the System Navigator, click Service Desk > Interaction Queue.
   2. From the Queue menu, select Approval to open the Approval Queue.

   3. Click More or the More Actions icon, then Customize Current View.


     The Configure View Properties wizard opens.

   4. Click the Autoformat button.
   5. Select the rule to remove.
   6. Click Remove Rule.
   7. Click Yes to confirm your choice.

Customize current view

System administrators use the Customize Current View feature to modify the
properties of an existing view. In this case, a view is a query that has been saved to
generate a list of records. The out-of-box system provides a set views that may
include My tasks or All my open request. The View field in an application lists the
views available for the user.

System administrators can access Customize Current View from the More Actions
menu on any of the display views, queues, or record lists for any of the applications.
The system provides a wizard to configure the view properties.

Contents

     1 Create a view
     2 Add a view for a new table
     3 Delete a view
     4 Change fields in a view
     5 Change roles for a view
     6 Add a new autoformatting rule
     7 Adjust the order of an autoformatting rule
     8 Edit an autoformatting rule
     9 Remove an autoformatting rule
     10 Customize current view
````
