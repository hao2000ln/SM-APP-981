---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.6.4.10 .. 1.6.4.10
printed_pages: 1716-1748
---

# 1.6.4.10 License tracking

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.6.4.10. License tracking

Service Manager tracks floating and named licenses on the application level for
reporting purposes.

The logon process determines which applications are authorized for each user,
allocates a floating or named license for the duration of the session, and records
usage information in the stathistory file. When the user logs out or ends the session,
Service Manager deallocates the license. Because Service Manager tracks the
highest daily license usage for each application, administrators can use this
information to determine how many licenses are being used and when peak usage
times occur.

The license tracking feature tracks the named and floating licenses on an application
basis. Service Manager refreshes the license usage information whenever the user
logs out, or the session terminates by inactivity or administrator action.

Service Manager calculates license usage for all types of client connections,
including SOAP, Web Services, and REST. The calculation is based on the number of
login user names and the number of client IP addresses. For example:

     Two sessions that use the same login user name and two different client IP
     addresses consume two licenses.
     Two sessions that use the same login user name and the same client IP address
     consume one license.
     Two sessions that use two different login user names consume two licenses.

Authorized applications

The following applications monitor licenses:

     Contract Management
     Change Management
     Incident Management
     Configuration Management
     Request Fulfillment
     Problem Management
     Service Desk
     Knowledge Management
     Service Level Management
     Smart Analytics


1.6.4.10.1. License types

There are two types of licenses: login licenses (named or floating, which only control
initial logins), and application licenses (which control access to individual modules).

License type                            Description
Login licenses
                                        Control initial logins:

                                             Floating: Users aren't on the
                                             Named user list for the application
                                             and they have update capabilities.
                                             Named: Users are on the Named
                                             user list for the application and
                                             they have update capabilities.

Application licenses                    Control access to individual modules.

                                        Logging in as any user with update
                                        capacity for an application consumes a
                                        license for that application. Update
                                        capacity includes permission to add,
                                        update, or delete any record
                                        associated with the application.

Login licenses are tightly controlled so that the product will not allow you to log in if
you exceed your login licenses. Application licenses are lightly controlled, and you
can exceed the licenses with only a warning message.

If the Named Application field in the operator record is empty and the operator
logging in is a Named user, the user will consume one named login license and
floating licenses for application license. If the Named Application field in the operator
record is only filled with, for example, Incident Management, the same user will
consume one named login license, one floating license for each other
application/module, and one named license for the Incident Management
application/module. In other words, by default the Application Licenses are floating
licenses regardless of whether the operator is a named or floating user.


Login licensing has been separated from Module licensing to provide more flexibility.
It is possible to change the default behavior to ensure the Named user consumes a
Named license, instead of a Floating license for the Modules. To do so, follow these
steps:

   1. Open the Operator record.
   2. Click the Login Profiles tab, add the Modules required for the Named user in the

     Named Applications field.

Related topics

License tracking
Named users
Named users for applications
Stathistory table
Self-service licenses
Determine the number of named users available
Make an individual operator a named user
Define named users for applications
Generate a user license report
Profile fields for Contract Management license tracking
Profile fields for Knowledge Management license tracking


1.6.4.10.1.1. Security right fields for
Configuration Management license
tracking

Users who have the capability to update records in Configuration Management will
consume either a floating or a named license. Service Manager tracks these licenses
for reporting purposes.
Users who have update capabilities for any of the following fields in the Configuration
Management security rights will consume a Configuration Management license.

Area           Tab                      Label of      Value         Service Manager 9.81
                                        Settings      true
Configuration  Rights                                                Can do
Item                                    New                          New

Configuration
Management
Configuration

Configuration  Rights                   Update        Always/When   Update
Item                                                  assigned/Wh
                                                      en assigned
Configuration                                         to workgroup
Management
Configuration

Configuration  Rights                   Delete/Close  Always/When   Close/Inactiv
Item                                                  assigned/Wh   ate/Mass
                                                      en assigned   Inactivate
Configuration                                         to workgroup
Management
Configuration

Configuration  Rights                   Expert        true          Can
Item                                                                suspend/Can
                                                                    unsuspend/C
Configuration                                                       an Mass
Management                                                          Update/Can
Configuration                                                       Complex
                                                                    Update
Configuration Rights                    Change CI true
Item                                    Type                        Can change
                                                                    CI Type


1.6.4.10.1.2. Profile fields for Knowledge
Management license tracking

Users who have the capability to update records in Knowledge Management will
consume either a Floating or Named license. Service Manager tracks these licenses
for reporting purposes.

Users who have update capabilities for any of the following fields in the Knowledge
Management security profile (kmprofile) will consume a Knowledge Management
license.

KCS I

Label                                   Field Name in kmprofile
                                        contribute
Contribute New Knowledge                save.draft
                                        edit.in.workflow
Save a Draft Copy

Edit working copy documents in
Knowledge Management

KCS II


Label                                   Field Name in kmprofile

Publish internal immediately            int.immediate

Retire / Archive a document             retire

Publish a working copy document         internal
internally

Unretire a retired document             unretire

Modify a published document             modify

Delete a retired document               delete.doc

Revert a working copy to the published revert
version

Delete Feedback                         delete.feedback

KCS III

 Label                                  Field Name in kmprofile
                                        ext.immediate
 Publish internal and external
 immediately                            external

 Publish a working copy document
 internally and externally

Admin


Label                                   Field Name in kmprofile

Manage document types and views         doctypes

Manage Categories                       manage.categories

Manage knowledgebases                   knowledgebases

Integration Mapping                     integration.mapping

Manage shared content                   shared.content

Configure hit list                      configure.hit.list

Manage environment and profiles         environment.profiles

Review/publish any draft                any.draft

Search in all categories                admin.search.all

Edit Adaptive Learning                  edit.adaptive.learning

Related topics

License tracking
Named users
Named users for applications
Stathistory table
Self-service licenses
Determine the number of named users available
Make an individual operator a named user
Define named users for applications
Generate a user license report


1.6.4.10.1.3. Profile fields for Contract
Management license tracking

Users who have the capability to update records in Contract Management will
consume either a Floating or Named license. Service Manager tracks these licenses
for reporting purposes.

Users who have update capabilities for any of the following fields in the Contract
Management security profile (ctenv) will consume a Contract Management license.

General Privileges

Label                                   Field Name
Mass Add                                mass.add
Mass Update                             mass.update
Mass Delete                             mass.delete

Contracts

Label                                   Field Name
Add Contract                            add.contract
Update Contract                         update.contract
Cancel Contract                         cancel.contract
Renew Contract                          renew

Payments

 Label                                                                                          Service Manager 9.81
 Schedule Payment
 Gen Payment Sched                      Field Name
 Update Payment                         sched.payment
 Submit Payment                         gen.payment.sched
 Cancel Payment                         update.payment
 Delete Payment                         submit.payment
                                        cancel.payment
Contract Templates                      delete.payment

 Label                                  Field Name
 Create Template                        create.template
 Update Template                        update.template
 Delete Template                        delete.template

Asset Allocation                        Field Name
                                        add.items
 Label                                  gen.item.allocation
 Add Asset                              update.items
 Gen Asset Allocation                   delete.items
 Update Asset
 Delete Asset

Software Counters


Label                                   Field Name
Create Counter                          add.counter
Update Counter                          update.counter
Delete Counter                          delete.counter
Compliance Check                        compliance.check

Terms and Conditions

Label                                   Field Name

Add Term/Condition                      add.term

Update Term/Condition                   update.term

Delete Term/Condition                   delete.term

Related topics

License tracking
Named users
Named users for applications
Stathistory table
Self-service licenses
Determine the number of named users available
Make an individual operator a named user
Define named users for applications
Generate a user license report


1.6.4.10.1.4. Security right fields for
Service Desk license tracking

Users who have the capability to update records in Service Desk will consume either
a floating or a named license. Service Manager tracks these licenses for reporting
purposes..

Users who have update capabilities for any of the following fields in the Service Desk
security rights will consume a Service Desk license.

Area          Tab                       Label of Settings Value
Service Desk  Rights
Service Desk  Rights                    New           true

                                        Update        Always/When
                                                      assigned/When
                                                      assigned to work
                                                      group

Service Desk  Rights                    Delete/Close  Always/When
                                                      assigned/When
                                                      assigned to work
                                                      group


1.6.4.10.1.5. Security right fields for
Incident Management license tracking

Users who have the capability to update records in Incident Management will
consume either a floating or a named license. Service Manager tracks these licenses
for reporting purposes.

Users who have update capabilities for any of the following fields in the Incident
Management security rights will consume an Incident Management license.

Area      Tab                           Label of      Value         Can do
          Rights                        Settings      true          New
Incident
Incident                                New
Tasks

Incident  Rights                        Update        Always/When   Update
                                                      assigned/Wh
Incident                                              en assigned
Tasks                                                 to workgroup

Incident  Rights                        Delete/Close  Always/When   Close/Inactiv
                                                      assigned/Wh   ate/Mass
Incident                                              en assigned   Inactivate
Tasks                                                 to workgroup

Incident  Rights                        Expert        true          Can
                                                                    suspend/
Incident                                                            Can
Tasks                                                               unsuspend


1.6.4.10.1.6. Security right fields for
Problem Management license tracking


Users who have the capability to update records in Problem Management will
consume either a floating or a named license. Service Manager tracks these licenses
for reporting purposes.

Users who have update capabilities for any of the following fields in the Problem
Management security rights will consume a Problem Management license.

Area           Tab                      Label of Settings Value
               Rights
Problem                                 New           true
Problem Tasks

Problem        Rights                   Create Known  true
                                        Error
Problem        Rights                   Update        Always/When
Problem Tasks                                         assigned/When
                                        Delete/Close  assigned to
Problem        Rights                                 workgroup
Problem Tasks
                                                      Always/When
                                                      assigned/When
                                                      assigned to
                                                      workgroup


1.6.4.10.1.7. Security right fields for
Change Management license tracking

Users who have the capability to update records in Change Management will
consume either a floating or a named license. Service Manager tracks these licenses
for reporting purposes.

Users who have update capabilities for any of the following fields in the Change
Management security rights will consume a Change Management license.

Area  Tab                               Label of      Value         Can do
                                        Settings
Change/Chan Rights                      New           true          Copy and
ge Task                                 Expert
                                                                    Open/New
Change/Chan Rights                      Admin
ge Task                                               true          Update when
                                        Update
                                        Delete/Close                closed/Can
                                        Reopen/Can
                                        Approve                     Mass

                                                                    Approve

Change/Chan Rights                                    true          Change
ge Task
                                                                    Category/Cha

                                                                    nge

                                                                    Phase/Can

                                                                    override

                                                                    Approvals

Change/Chan Rights                                    Always/When   Update/delet
ge Task                                               assigned/Wh   e/Close
                                                      en assigned
Change/Chan Settings                                  to workgroup
ge Task
                                                      true          Reopen/Can

                                                                    Approve


1.6.4.10.1.8. Security right fields for
Request Fulfillment license tracking

Users who have the capability to update records in Request Fulfillment will consume
either a floating or a named license. Service Manager tracks these licenses for
reporting purposes.

Users who have update capabilities for any of the following fields in the Request
Fulfillment security rights will consume a Request Fulfillment license.

Area         Tab                        Label of      Value         Can do
                                        Settings      true
Request/Req  Rights                     New           true          New
uest Tasks   Rights
                                        Expert                           Update
Request/Req                                                              Mass
uest Tasks                                                               Approve

Request/Req Rights                      Admin         true          Override
                                                                    (Approve.Ove
uest Tasks                                                          rride)

Request/Req Rights                      Update        Always/When   Close
uest Tasks                              Delete/Close  assigned/Wh
                                                      en assigned
                                                      to workgroup

Request      Settings                   Can Approve true            Can Approve

Request      Settings                   Reopen        true          Reopen

Related topics

Security
Request Fulfillment security areas


1.6.4.10.1.9. Security right fields for
Service Level Management license
tracking

Users who have the capability to update records in Service Level Management will
consume either a floating or a named license. Service Manager tracks these licenses
for reporting purposes.

Users who have update capabilities for any of the following fields in the Service Level
Management security rights will consume a Service Level Management license.

Area           Tab                      Label of Settings Value
               Rights
Service Level                           New              true
Management     Rights
                                        Update           Always/When
Service Level                                            assigned/When
Management                              Delete/Close     assigned to
                                                         workgroup
Service Level  Rights                   Manage SLT
Management                              Catalog Records  Always/When
                                                         assigned/When
Service Level  Settings                                  assigned to
Management                                               workgroup

                                                         true


1.6.4.10.1.10. Fields for Self-service
license tracking

Users who have following fields in the Service Desk security rights and users who
have the capability to Order from Service Catalog via ESS portal (added with service
catalog capability word) will consume a Service Catalog ESS license.

Area          Tab                       Label of Settings Value
Service Desk  Rights
                                        New  true


1.6.4.10.1.11. Capability words for Smart
Analytics license tracking

Users who have the capability to update records in Smart Analytics will consume
either a floating or a named license. Service Manager tracks these licenses for
reporting purposes.
Users who have the SysAdmin or idol.assistant capability word will consume a Smart
Analytics license. If there is no Help Desk license, Smart Analytics can't work.


1.6.4.10.2. Named users

Service Manager uses the software license agreement, which provides for two types
of licensed users: named users and floating users.

Named users are users who are always authorized to sign in to the Service Manager
system when either floating user licenses or named user licenses are available.
Floating users are limited to a maximum number of concurrent logins as defined by
the floating user license. The Service Manager license key password file encodes the
number of named users and floating users in the system as separate values. You can
define as many named users as you want. If the number of named users signed in
exceeds the limit of named user licenses, the surplus named users consume floating
licenses to sign in to the Service Manager system. Floating users also consume
floating licenses when they sign in. If all of your floating licenses have been used,
Service Manager denies access to any additional unique floating users. Unique-
named users will still be able to sign in if Named licenses are available. If all named
licenses and floating licenses are used, no additional unique users (named or floating)
will be able to connect.

Related topics

License tracking
Named users for applications
Stathistory table
Self-service licenses
Determine the number of named users available
Make an individual operator a named user
Define named users for applications
Generate a user license report
License types
Profile fields for Contract Management license tracking


1.6.4.10.2.1. Defining named users

You can use the following method to define named users on your Service Manager
system:

     Define each named user in the user's operator record

Related topics

Application Setup
Adding users
Checklist: Adding a new user
Controlling user access and security
Creating operator records
Operator passwords
Operator records
Operator templates


1.6.4.10.2.2. Determine the number of
named users available

Applies to User Roles: System Administrator
You must have access to the Service Manager server to perform this procedure.

To determine the number of named users available, follow these steps:

   1. Open a Windows command prompt window.
   2. Change directories to the RUN folder of your Service Manager installation.

   3. Type the following command:

          sm -reportlic

   4. Press Enter.

Service Manager displays a report of your licensed features and your current usage.
The Named Users field lists the number of named users that are active and inactive
on your system.

Related topics

License tracking
Named users
Named users for applications
Stathistory table
Self-service licenses
Make an individual operator a named user
Define named users for applications
Generate a user license report
License types
Profile fields for Contract Management license tracking


1.6.4.10.2.3. Make an individual operator a
named user

Applies to User roles: System Administrator

To make an individual operator a named user:

   1. Click System Administration > Ongoing Maintenance > Operators.
   2. Type or select optional search criteria.
   3. Click Search.
   4. Select the operator record from the record list.
   5. Click the Login Profiles tab.
   6. Select the Named User option.
   7. Click Save.

Related topics

License tracking
Named users
Named users for applications
Stathistory table
Self-service licenses
Determine the number of named users available
Define named users for applications
Generate a user license report
License types
Profile fields for Contract Management license tracking


1.6.4.10.3. Named users for applications

Service Manager tracks floating and named licenses for each application based on
the number of users with the ability to update records in the application.
Administrators can define a user as a named User for the application in the operator
record or in the nameduser table.

Triggers keep the operator records and named user records synchronized. When you
update the named.modules field in the operator record, Service Manager also
updates the respective named user record.If you update a named user record;
Service Manager updates the corresponding operator record.

            Note

           The out of box SM Reports module includes license utilization reports.

Related topics

License tracking
Named users
Stathistory table
Self-service licenses
Determine the number of named users available
Make an individual operator a named user
Define named users for applications
Generate a user license report
License types
Profile fields for Contract Management license tracking


1.6.4.10.3.1. Define named users for
applications

Applies to User Roles: System Administrator

You can grant access and update rights to named users.

To define named users for applications by using the Named Applications method,
follow these steps:

   1. Click System Administration > Ongoing Maintenance > Operators.
   2. Type or select optional search criteria.
   3. Click Search.
   4. Select the operator record to update.
   5. Click the Login Profiles tab.
   6. In the Named Applications field, type or select the application for which you

     want to enable operator access.
   7. Click Save.

            Note

           If you want to grant access and update rights for multiple named users in
           a specific application, you can do this using the Named User method in
           Database Manager.

To define named users for applications by using the Named User method, follow
these steps:

   1. Click Tailoring > Database Manager.
   2. In the Form field, type "nameduser".
   3. Type or select optional search criteria.
   4. Click Search.
   5. In the Application field, specify the application to be accessed by the operator.
   6. In the Named users field, type or select the operators to be assigned update

     rights for the specified application.
   7. Click Save.

Related topics

License tracking
Named users


Named users for applications
Stathistory table
Self-service licenses
Determine the number of named users available
Make an individual operator a named user
Generate a user license report
License types
Profile fields for Contract Management license tracking


1.6.4.10.4. Generate a user license report

Applies to User roles: System Administrator

You must have administrative access to the server operating system to perform this
procedure.

To generate a user license report, follow these steps:

   1. Change directories to the RUN folder of your Service Manager installation.

   2. Type the following command:

     sm -reportlic:1

   3. Press Enter.

Related topics

License tracking
Named users
Named users for applications
Stathistory table
Self-service licenses
Determine the number of named users available
Make an individual operator a named user
Define named users for applications
License types
Profile fields for Contract Management license tracking


1.6.4.10.5. Stathistory table

The stathistory table updates every time a user logs on to the system. A stathistory
record tracks the named and floating licenses on an application basis.

The application creates a new stathistory record daily. If a stathistory record already
exists, the record updates. If one doesn't exist, the application creates a new record.
The stathistory record names are:

Application                             License type
Application name                        - named
Application name                        - Floating

For example, to search for floating license Configuration Management records, type:

Configuration Management - Floating

Each stathistory record updates with the number of named or Floating licenses used
at that moment. The number updates only when it is greater than the number already
in the table. This enables the administrator to keep track of the highest number of
licenses used at any time. Here is a scenario to further explain the logic:


Scenario                                Stathistory record value Remark
User A logs into SM
User B logs into SM                     1
User A logs out of SM
User C logs into SM                     2

                                        2

                                        2           Only User B and C are

                                                    logged in SM at this

                                                    moment.

                                                    The number is not
                                                    increased to 3 as there
                                                    are only two concurrent
                                                    users logged into SM.

User D logs into SM                     3

User B logs out of SM 3                             The number updates
                                                    only when it is greater
                                                    than the number already
                                                    in the table, so the
                                                    number is not decreased
                                                    to 2.

To view the stathistory table, follow these steps:

   1. Click Tailoring > Database Manager.
   2. In the File field, type: stathistory.
   3. Click Search.
   4. Select any record to view it.

Related topics

License tracking
Named users
Named users for applications
Self-service licenses
Determine the number of named users available
Make an individual operator a named user


Define named users for applications
Generate a user license report
License types
Profile fields for Contract Management license tracking


1.6.4.10.6. Self-service licenses

The number of licenses that are active depends on the number of users signed in who
can access an application to add or update records. Self-service users can sign in to
an ess.do URL to perform certain activities (such as, searching the knowledgebase to
find an answer or logging new interactions) without contacting the Service Desk.

Users who have the capability to Order from Service Catalog via ESS portal (added
with service catalog capability word) will consume a Service Catalog ESS license.
Service Manager tracks these licenses for reporting purposes. You will receive a
warning message in the sm.log file if the Service Catalog ESS licenses are exceeded.

            Note

           License utilization reports are included out-of-box in the Service Manager
           SM Reports module.

Related topics

License tracking
Named users
Named users for applications
Stathistory table
Determine the number of named users available
Make an individual operator a named user
Define named users for applications
Generate a user license report
License types
Profile fields for Contract Management license tracking
````
