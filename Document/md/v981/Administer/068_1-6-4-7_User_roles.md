---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.6.4.7 .. 1.6.4.8
printed_pages: 1672-1696
---

# 1.6.4.7 User roles

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.6.4.7. User roles

The Service Management process can meet best practices when employees involved
in the process are assigned user roles in your IT organization. For information on the
Service Management organizational model of user roles for best practices, see
Service Manager Processes and Best Practices in the related topics.

A user role is a template that combines a collection of application profiles, security
roles, and capability words into a single record. Service Manager provides out-of-box
user role descriptions with appropriate capability words and application profiles that
define a variety of business functions or roles. By defining and assigning user role
descriptions, a System Administrator can grant an operator the capability words and
application profile required for a particular job.

The Service Management process consists of the following user roles:

Related topics

Add a user role record
Delete a user role record
Search for a user role record
Processes and Best Practices


1.6.4.7.1. Add a user role record

Applies to User roles: System Administrator
A user role defines a set of application profiles, capability words, and query groups
that you can apply to any operator record. For example, the self-service role enables
the self-service user to open, view, update, and close service requests.
To add a user role record, follow these steps:

   1. Click System Administration > Ongoing Maintenance > User Roles.
   2. Enter a User Role or click Search to select a role from a record list.
   3. Add optional information to the form. If necessary, press Ctrl + H to view help for

     each field.
   4. Click Add.

            Note

           Service Manager provides an out-of-box self-service user role record.

Related topics

Delete a user role record
Search for a user role record
Set the dashboard home page for a user role


1.6.4.7.2. Delete a user role record

Applies to User roles: System Administrator

To delete a user role record, follow these steps:

   1. Click System Administration > Ongoing Maintenance > User Roles.
   2. Type or select optional search criteria.
   3. Click Search.
   4. Select the user role that you want to delete.
   5. Click Delete.
   6. Click Yes to confirm the deletion.

Related topics

Add a user role record
Search for a user role record
Set the dashboard home page for a user role


1.6.4.7.3. Search for a user role record

Applies to User roles: System Administrator
To search for a user role record, follow these steps:

   1. Click System Administration > Ongoing Maintenance > User Roles.
   2. Click Search to select a role from a record list.

Related topics

Add a user role record
Delete a user role record


1.6.4.7.4. Set database access for a user
role

Applies to User roles: System Administrator

Database access is a feature that gives you the ability to limit or grant access to
database records, such as contacts, company, and regions. You can add or modify
the existing out-of-box database access settings per user role or operator.

To set database access for a user role, follow these steps:

   1. Click System Administration > Ongoing Maintenance > User Roles.
   2. Type or select optional search criteria, and then click Search.
   3. Select a user role from the record list.
   4. Select the Data Access tab.

   5. To add a new Data Access record, follow these steps:

        1. Click Data Access Records.

           The Database Manager Data Access form opens.

        2. Click Fill in the Database Table Name field to select a table.
        3. The user role you initially selected is in the User Role field. If you want to

           add access to a different user role than the one you selected, clear the field
           and click Fill to select a different user role.

        4. To set the database access, select one of the following:

                 Allow DB access: The user role specified is granted access to the
                 table specified.
                 Prohibit DB access: The user role specified is denied access to the
                 table specified.
        5. When access has been granted to a table, click Fill in the View Format field
           to select the table view.

        6. Click Add.

           The new database access record is added.

   6. To modify an existing database access record, follow these steps:

        1. Select the Data Access tab.


        2. Double-click the Table Name of the existing database access record you
           want to modify.
           The Database Manager Data Access form opens.

        3. Make the necessary edits.
        4. Click Save.

           Your changes are saved.
   7. Click OK.

Related topics

Add a user role record
Delete a user role record
Search for a user role record


1.6.4.7.5. Set the dashboard home page
for a user role

Setting a dashboard home page for a user role enables you to auto-fill operator
records with a dashboard home page, along with the other default settings for the
user role. If no dashboard home page is set, the user sees a To Do list upon login.

            Note

           Note: Specifying a dashboard home page in a user's operator record
           overrides the default To Do list and menus for that operator when they log
           in using the web client, even if the flag for menus has been set.

To set a dashboard home page for a user role, follow these steps:

   1. Click System Administration > Ongoing Maintenance > User Roles.
   2. Type or select optional search criteria.
   3. Click Search.
   4. Select a user role from the record list.
   5. Click the Startup tab.
   6. Select a dashboard home page from the drop-down list.
   7. Click Save.

Related topics

To Do list
Add a user role record
Delete a user role record
Search for a user role record


1.6.4.8. Capability word model

Capability words provide a security mechanism to control access to Service Manager
applications by enabling or disabling parts of the interface. You can add capability
words to a user role or individual operator to control access to Service Manager. In
some cases capability words are redundant to the privileges and views that are
already provided by application profiles. In cases where capability words and
application profiles overlap, capability words take precedence.

Service Manager stores capability words in the capability table, which you can access
by opening the capability form in Database Manager, or by clicking System
Administration > Ongoing Maintenance > Capability Words. To limit access, choose
a subordinate capability word. To grant a broad range of permissions, choose a
parent capability word, such as SQLAdmin or SysAdmin. If you create your own
capability words or modify the default permissions, you can use the
checkPermission() JavaScript function that's available in the script library to
determine if an operator has a particular capability word. You must use this function
to enforce the capability word model.

Related topics

Application Setup
Capability words
Add a capability word
Delete a capability word
Search for capability words


1.6.4.8.1. Capability words

Service Manager provides a hierarchy of out-of-box capability words.

            Note

           Capability words are case-sensitive.


Capability    Primary                   Secondary    Application    Description
              subordinate               subordinate
                                                     Any            Enables
EditContacts                                         application    editing of
                                                     mainly for     contact
EditOperator                                         admins to      records.
s                                                    edit contacts
                                                     (Administrati  Enables
HTMLTempla                                           on)            editing of the
tesAdmin                                             Any            password in
                                                     application    operator
                                                     mainly for     records. If
                                                     admins to      you're not
                                                     edit           SysAdmin,
                                                     operators      without this
                                                     (Administrati  capability
                                                     on)            word even if
                                                                    you could
                                                     Applications   edit some
                                                     that use the   other
                                                     HTML email     operator
                                                     feature.       information
                                                                    you wouldn't
                                                                    be able to
                                                                    change the
                                                                    password.

                                                                    Enables a
                                                                    user to
                                                                    manage or
                                                                    create HTML
                                                                    templates.


Capability   Primary                    Secondary     Application Description
ODBC         subordinate                subordinate
RESTful API                                           Server        Grants
SOAP API     See the next               See the next  Access        access via
             table                      table                       ODBC32.DLL
SQLAdmin                                                            for reporting.
SysAdmin
                                                      Web Services  Enables a
                                                                    user to
                                                                    execute a
                                                                    RESTful API
                                                                    request.

                                                      Web Services  Enables the
                                                                    user to sign
                                                                    in to Service
                                                                    Manager and
                                                                    execute a
                                                                    SOAP API
                                                                    request.

                                                      SQL           Enables SQL

                                                                    administrator

                                                                    authority.

                                                      All           Enables
                                                      Applications  system
                                                      except ESS    administrator
                                                                    capability.

                                        SysAdmin (continued)         Service Manager 9.81

Primary       Secondary                 Application           Description
subordinate   subordinate
system.build                                                  Grants access to
                                        Administration        old binary text
programmer                                                    format unload
programmer    Debug                     RAD                   options. These
                                        Debugger              are used to create
AlwaysAdmin                                                   a Service
                                        Database              Manager file
                                        Manager               system from
                                                              scratch and must
                                                              always be
                                                              available to
                                                              someone.

                                                              Grants access to
                                                              the application
                                                              generator (ag).

                                                              Enables a non-
                                                              sysadmin user to
                                                              do debugging for
                                                              testing purposes.
                                                              Normal users
                                                              should not have
                                                              this capability
                                                              word unless there
                                                              is debugging
                                                              being done for
                                                              that user.

                                                              Defaults
                                                              administration
                                                              mode to true
                                                              when using the
                                                              Database
                                                              Manager.

Primary      Secondary                  Application         Service Manager 9.81
subordinate  subordinate
ChMAdmin                                Change       Description
ChMAdmin                                Management
ChMAdmin                                             Grants access to
ChMAdmin     change request             Change       Change
                                        Management   Management
GUIAdmin                                             administration.
GUIAdmin     change task                Change
                                        Management   Grants access to
GUIAdmin                                             Change
             expedite change Change                  Management
                                    Management       requests.

                                    User Interface   Grants access to
             chart.breakdown Charts                  Change
                                                     Management
             public.favorites Favorites              tasks.

                                                     RFC
                                                     management: this
                                                     person may
                                                     expedite
                                                     changes.

                                                     Grants access to
                                                     GUI
                                                     administration.

                                                     Enables the
                                                     charting
                                                     capability in the
                                                     Service Manager
                                                     client.

                                                     Enables public
                                                     favorites in the
                                                     Windows / and
                                                     Web client.

Primary        Secondary                Application           Service Manager 9.81
subordinate    subordinate              Favorites
                                                       Description
GUIAdmin       user.favorites           Command line
                                                       Enables the user
menu.commands                           Configuration  favorites in the
                                        Management     Windows / and
ICMAdmin                                               Web client.
                                        Configuration
inventory                               Management     Grants command
management                              Help           line access to
help                                                   functions from
                                        Incident       menu.
IncidentAdmin                           Management
                                                       Grants access to
IncidentAdmin  amend                    Incident       Configuration
               suspension               Management     Management
                                                       administration.

                                                       Grants access to
                                                       Configuration
                                                       Management.

                                                       Enables the user
                                                       to add or update
                                                       help records

                                                       Grants access to
                                                       Incident
                                                       Management
                                                       administration.

                                                       Enables the
                                                       capability to
                                                       amend the
                                                       Incident
                                                       Management
                                                       profile rights for
                                                       suspend/unsuspe
                                                       nd.

Primary        Secondary                Application         Service Manager 9.81
subordinate    subordinate              Incident
                                        Management   Description
IncidentAdmin  incident                 Knowledge
               management               Management   Grants access to
                                                     Incident
KMAdmin                                 IR Expert    Management.
                                        Mobile
knowledge                               Mobile       The KMAdmin
engineer                                             capability word
                                                     enables a user to
mobile.admin                                         perform all
                                                     Knowledge
mobile.admin   mobile.user                           Management and
                                                     Knowledge
                                                     Centered Support
                                                     (KCS) tasks for all
                                                     document
                                                     categories
                                                     including the
                                                     administrative
                                                     tasks associated
                                                     with maintaining
                                                     the Knowledge
                                                     Management
                                                     system.

                                                     Enables the
                                                     capability to
                                                     modify the
                                                     adaptive learning
                                                     records.

                                                     Grants access to
                                                     the Portal for
                                                     mobile user
                                                     administration.

                                                     Grants access to
                                                     the Portal for
                                                     mobile users.

Primary       Secondary                 Application         Service Manager 9.81
subordinate   subordinate
                                        Problem      Description
ProbAdmin                               Management
                                                     Grants access to
ProbAdmin     problem                   Problem      Problem
              management                Management   Management
                                                     administration.
query.window                            Queries
                                                     Grants access to
                                                     Problem
                                                     Management.

                                                     Grants access to
                                                     query window
                                                     function in
                                                     query.window
                                                     application.

Primary      Secondary                  Application         Service Manager 9.81
subordinate  subordinate                Queries
                                                     Description
QueryAdmin                              Queries
                                                     Enables query
QueryAdmin   partial.key                             administrator
                                                     capability. Full
                                                     access to query
                                                     options/maintena
                                                     nce. Includes:
                                                     query window,
                                                     stored query
                                                     usage and
                                                     editing, etc. This
                                                     is intended to be
                                                     used like
                                                     sysadmin, as an
                                                     administrator, not
                                                     for general usage.
                                                     Please use
                                                     caution assigning
                                                     this as it gives
                                                     access to
                                                     create/modify
                                                     stored queries,
                                                     which can
                                                     adversely affect
                                                     system
                                                     performance if
                                                     not done
                                                     correctly.

                                                     Enables the user
                                                     to execute a
                                                     partial key query
                                                     in Database
                                                     Manager or
                                                     Change
                                                     Management.

Primary      Secondary                  Application         Service Manager 9.81
subordinate  subordinate
                                                     Description
QueryAdmin   partial.key.msg.s Queries
             kip                                     Enables the user
                                                     to skip the partial
QueryAdmin   query.stored               Queries      key query
                                                     message in
QueryAdmin   query.stored.mo Queries                 Database
             d                                       Manager.

                                                     Enable user to
                                                     execute stored
                                                     queries when F6
                                                     (query) key is
                                                     pressed, from any
                                                     application. The
                                                     user will be able
                                                     to perform any
                                                     stored query
                                                     assigned to
                                                     him/her or a
                                                     group he/she
                                                     belongs to
                                                     (allowable groups
                                                     in operator
                                                     record).

                                                     Enable user
                                                     execute/modify
                                                     access of stored
                                                     queries when F6
                                                     (query) key is
                                                     pressed from any
                                                     application.

Primary      Secondary                  Application         Service Manager 9.81
subordinate  subordinate                Request
                                        Fulfillment  Description
OCMAdmin
                                        Request      Allows access to
OCMAdmin     OCML                       Fulfillment  Request
                                                     Fulfillment
OCMAdmin     OCMO                       Request      administration,
                                        Fulfillment  such as the
                                                     approval
                                                     delegation
                                                     application.

                                                     Allows access to
                                                     the legacy
                                                     Request
                                                     Management Line
                                                     Item applications.
                                                     Since Line Item is
                                                     unsupported in
                                                     Request
                                                     Fulfillment in
                                                     Server Manager
                                                     Codeless mode, it
                                                     can be
                                                     considered
                                                     obsolete if you
                                                     don't use it
                                                     anywhere else.

                                                     Allows access to
                                                     Request
                                                     Fulfillment order
                                                     records.


Primary      Secondary                  Application  Description
subordinate  subordinate
OCMAdmin                                Request      Allows access to
             OCMQ                       Fulfillment  Request
svcCatAdmin                                          Fulfillment
svcCatAdmin                         Service Catalog  request records in
svcCatAdmin                                          the approval
svcCatAdmin  service catalog Service Catalog         delegation
svcCatAdmin                                          application.
svcCatAdmin  svcCatDeptRequ Service Catalog
             ester                                   Grants access to
                                                     Service Catalog
             svcCatEmployee Service Catalog          administration.
             Requester
                                                     Enables users to
             svcCatManagerR Service Catalog          request items
             equester                                from catalog.

             svcCatTechRequ Service Catalog          Enables a
             ester                                   department to
                                                     request items
                                                     from catalog.

                                                     Enables an
                                                     employee to
                                                     request items
                                                     from catalog.

                                                     Enables a
                                                     manager to
                                                     request items
                                                     from catalog.

                                                     Enables a
                                                     technician to
                                                     request items
                                                     from catalog.


Primary        Secondary                Application      Description
subordinate    subordinate              Service Catalog
svcCatAdmin                                              Enables an
               svcCatRequestO                            employee self-
SDAdmin        nBehalf                                   service (ESS)
SDAdmin                                                  user to submit a
data                                    Service Desk     service catalog
administrator                                            request on behalf
               service desk             Service Desk     of another user.
user
                                        Service Desk,    Grants access to
                                        Incident         Service Desk
                                        Management       administration.

                                        User             Grants access to
                                                         Service Desk.

                                                         Enables save, add
                                                         and update on
                                                         supporting tables
                                                         from within
                                                         Service
                                                         Management and
                                                         Incident
                                                         Management.

                                                         Grants basic
                                                         access to an end
                                                         user but doesn't
                                                         grant the ability to
                                                         add, delete, or
                                                         reset.


1.6.4.8.2. Add a capability word

Applies to User roles: System Administrator

To add a capability word, follow these steps:

   1. Click System Administration > Ongoing Maintenance > Capability Words.
   2. Type the information for your new capability word.
   3. Click Add.

Related topics

Application Setup
Capability word model
Capability words
Delete a capability word
Search for capability words


1.6.4.8.3. Delete a capability word

Applies to User roles: System Administrator

To delete a capability word, follow these steps:

   1. Click System Administration > Ongoing Maintenance > Capability Words.
   2. Type or select optional search criteria.
   3. Click Search.
   4. Select the capability word that you want to delete.
   5. Click Delete.
   6. Click Yes to confirm the deletion.

Related topics

Application Setup
Capability word model
Capability words
Add a capability word
Search for capability words


1.6.4.8.4. Search for capability words

Applies to User roles: System Administrator

To search for capability words, follow these steps:

   1. Click System Administration > Ongoing Maintenance > Capability Words.
   2. Type or select optional search criteria.
   3. Click Search.

Related topics

Capability word model
Capability words
Add a capability word
Delete a capability word
````
