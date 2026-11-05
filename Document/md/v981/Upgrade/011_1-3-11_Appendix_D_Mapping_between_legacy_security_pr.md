---
source: Document/pdf/v981/Upgrade.pdf
version: 9.81
sections: 1.3.11 .. 1.3.11
printed_pages: 272-295
---

# 1.3.11 Appendix D: Mapping between legacy security profiles and current PD

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.3.11. Appendix D: Mapping between
legacy security profiles and current PD
security roles

This appendix describes the mapping relationships between legacy security profiles
and current PD security roles in Service Manager modules including Change
Management, Problem Management, Incident Management, Configuration
Management, Service Level Management, and Service Desk.
Topics in this appendix include:
Change Management security profiles mappings
Service Desk security profiles mappings
Problem Management security profiles mappings
Incident Management security profiles mappings
Service Level Management security profiles mappings
Configuration Management security profiles mappings


1.3.11.1. Change Management security
profiles mappings

If you have upgraded from a previous version of Change Management, which is not
Process Designer based, see the following tables for Change Management security
profiles mappings.

Mapping between previous security profiles and
current PD security roles

The following table lists the mapping relationship between previous Change
Management security profiles and current Process Designer security roles in the
Change Management module.

Change profile                          Security role
DEFAULT                                 default
SD agent/manager                        change requestor
change analyst change                   change owner
change analyst tasks                    change owner
change approver                         change advisory board (CAB)
change coordinator change               change coordinator
change coordinator tasks                change coordinator
change manager                          change manager
emergency group                         emergency CAB
Initiator                               change requestor
problem manager                         change requestor
Sysadmin                                system administrator


In many cases, change profile rights used in versions earlier than 9.40 have been
merged into much fewer security rights. For example, the Expert right represents
several change profile rights. The Process Designer Change Management workflows
reference security roles; after upgrade security roles that were converted from
change profiles are used if they exist with the same name. If a workflow uses a
security role that was not converted from a change profile, the system assigns default
rights to the security role. It is important to inspect the security roles and modify them
as appropriate for use in any of the Process Designer workflows.

Field mapping between security profiles settings
and PD security rights/settings

The following table outlines the field mapping between legacy change profile settings
and the current Process Designer security role rights and settings.


Change profile settings field names     Security roles settings field names

Copy and open                           New
New                                     New
Open                                    New
Alternate views                         View
Can count records                       View
Can notify                              View
Clear                                   View
fill                                    View
find                                    View
irquery                                 View
Show parent                             View
Tasks                                   View
View                                    View
Alerts                                  Expert
apprdism                                Expert
Can mass approve                        Expert
Complex Mass Update                     Expert
Duplicates                              Expert
Expert Search                           Expert
List Pages                              Expert


Change profile settings field names     Security roles settings field names

Template Mass Update                    Expert
Update when closed                      Expert
Change category                         Admin
Change phase                            Admin
Can override approvals                  Admin
Allowed categories                      Allowed categories
Allowed status                          Allowed Status
Append Query                            Append Query
Approval Groups                         approver.of in $G.myGroups
Area                                    Area
Can access approvals                    Can Approve
Can Delegate Approvals                  Can Delegate Approvals
Change Manage Format                    Change Manage Format
Close                                   Delete/Close
Default Change Category                 Default Category
Default Task Category                   Default Task Category
Inefficient Query                       Allow Inefficient Query
Initial Change View                     Initial Change View
Initial Format                          Initial Format
Initial Task View                       Initial Task View


Change profile settings field names     Security roles settings field names

Manager Group                           member.of in $G.myGroups
Modify Template                         Modify Template
Name                                    Role
QBE Format                              List Format
Reopen                                  Reopen
Skip Warning                            Skip Inefficient Query Warning
Task Manage Format                      Task Manage Format
Update                                  Update


1.3.11.2. Service Desk security profiles
mappings

If you have upgraded from a previous version of Service Desk, which is not Process
Designer based, see the following tables for Service Desk security profiles mappings.

Mapping between previous security profiles and
current PD security roles

The following table lists the mapping relationship between previous Service Desk
security profiles and current PD security roles in the Service Desk module.

Security Profile                        Security Role/Area
DEFAULT                                 DEFAULT/Service Desk
approver                                approver/Service Desk
helpdesk tech                           helpdesk tech/Service Desk
initiator                               initiator/Service Desk
self service                            self service/Service Desk
service desk agent                      service desk agent/Service Desk
service desk manager                    service desk manager/Service Desk
sysadmin                                sysadmin/Service Desk
N/A                                     service desk analyst/service desk
                                        process owner/Service Desk

Field mapping between security profiles settings
and PD security rights/settings

The following table lists the mapping of fields in legacy Service Desk security profiles
and Process Designer security roles.

 Security profile settings                                                                      Service Manager 9.81

 New                                    Process Designer security rights and
 Close                                  settings
 Update                                 New
 View                                   Delete/Close
 Can notify                             Update
 Alternate views                        View
 Advanced Search                        View
 Template Mass Update                   View
 Complex Mass Update                    View
 Approval groups                        Expert
 Allowed Statuses                       Expert
 Can Create Personal Views              Approval Groups
 Can Create System Views                Allowed Statuses
 Lock on Display                        Can Create Personal Views
 Modify Templates                       Can Create System views
 Delegate Approvals                     Lock on Display
 Initial view                           Modify Templates
 Edit Format                            Can Delegate Approvals
 Search Format                          Initial View
 List Format                            Edit Format
                                        Search Format
This PDF was generated on May 23, 2026  List Format

                                                                                                                        Page 279 of 294
Security profile settings                                                                       Service Manager 9.81

Manage Format                           Process Designer security rights and
Print Format                            settings
ESS initial format                      Manage Format
ESS edit format                         Print Format
ESS search format                       ESS initial format
ESS list format                         ESS edit format
Default Template                        ESS search format
Append query                            ESS list format
New Thread: View -> Search              Default Template
New Thread: Search -> List              Append query
New Thread: List -> Edit                New Thread: View -> Search
New Thread: View -> Edit                New Thread: Search -> List
                                        New Thread: List -> Edit
                                        New Thread: View -> Edit


1.3.11.3. Problem Management security
profiles mappings

If you have upgraded from a previous version of Problem Management, which isn't
Process Designer based, see the following tables for Problem Management security
profiles mappings.

Mapping between previous security profiles and
current PD security roles

The following table lists the mapping relationship between previous Problem security
profiles and current PD security roles in the Problem module.

Security Profile                        Security Role/Area
DEFAULT                                 DEFAULT/Problem
initiator                               initiator/Problem
problem analyst                         problem analyst/Problem
problem coordinator                     problem coordinator/Problem
problem manager                         problem manager/Problem
reviewer                                reviewer/Problem
sysadmin                                systadmin/Problem
N/A                                     problem task assignee/Problem
N/A                                     problem process owner/Problem

Field mapping between security profiles and PD
security rights/settings

The following table lists the mapping of fields in legacy Problem security profiles and
Process Designer security roles.

 Security profile settings                                                                      Service Manager 9.81

 Allow Inefficient Query                Process Designer security rights and
 Allowed Statuses                       settings
 Append Query                           Allow Inefficient Query
 Assignment Groups                      Allowed Statuses
 Can Create Personal Views              Append Query
 Can Create System Views                Assignment Groups
 Create Known Error                     Can Create Personal Views
 Close                                  Can Create System views
 Edit Format                            Create Known Error
 Templates Mass Update                  Delete/Close
 Complex Mass Update                    Edit Format
 Initial Inbox                          Expert
 List Format                            Expert
 Lock on Display                        Initial View
 Manage Format                          List Format
 Change Phase                           Lock on Display
 Post to Knowledge                      Manage Format
 Initial Format                         N/A
 Open Script                            N/A
 Resolution Script                      N/A
                                        N/A
This PDF was generated on May 23, 2026  N/A

                                                                                                                        Page 282 of 294

Security profile settings               Process Designer security rights and
                                        settings
New                                     New
New Thread: Inbox -> Edit               New Thread: Inbox -> Edit
New Thread: Inbox -> Search             New Thread: Inbox -> Search
New Thread: List -> Edit                New Thread: List -> Edit
New Thread: Search -> List              New Thread: Search -> List
Print Format                            Print Format
Reopen                                  Reopen
Search Format                           Search Format
Skip Query Warning                      Skip Inefficient Query Warning
Update                                  Update
Change Category                         Update
View                                    View
Views                                   View
Count                                   View
Advanced Search                         View

Note

N/A means the previous fields are obsolete and aren't mapped to PD
security rights/settings.


1.3.11.4. Incident Management security
profiles mappings

If you have upgraded from a previous version of Incident Management, which isn't
Process Designer based, see the following tables for Incident Management security
profiles mappings.

Mapping between previous security profiles and
current PD security roles

The following table lists the mapping relationship between previous Incident security
profiles and current PD security roles in the Incident module.


Security Profile                        Security Role/Area

DEFAULT                                 DEFAULT/Incident

configuration auditor                   configuration auditor/Incident

incident analyst                        incident analyst/Incident

incident coordinator                    incident coordinator/Incident

incident manager                        incident manager/Incident

initiator                               initiator/Incident

operator                                operator/Incident

problem manager/coord                   problem manager/Incident
                                        problem coordinator/Incident

service desk agent                      service desk agent/Incident

service desk manager                    service desk manager/Incident

service tech                            service tech/Incident

sysadmin                                sysadmin/Incident

N/A                                     incident task assignee/Incident

N/A                                     incident process owner/Incident

Field mapping between security profiles and PD
security rights/settings

The following table lists the mapping of fields in legacy Incident security profiles and
Process Designer security roles.

 Security profile settings                                                                      Service Manager 9.81

 New                                    Process Designer security rights and
                                        settings
 Close                                  New
 Inactivate                             Delete/Close
 Mass inactivate
                                        Update
 Update                                 View
 Change category
                                        Reopen
 View                                   Expert
 Log
 Can notify                             Allow Inefficient Query
 Search for duplicates                  Skip Inefficient Query Warning
 Alternate views                        Can Create Personal Views
 Can use callback list                  Can Create System Views
 Advanced search                        Lock On Display
                                        Modify Template
 Reopen
                                                                                                                        Page 286 of 294
 Mark problem candidate
 Can suspend
 Can unsuspend
 Notes
 Override
 Template Mass Update
 Complex Mass Update

 Allow inefficient query

 Skip query warning

 Can create personal views

 Can create system views

 Lock on display

 Modify Template

This PDF was generated on May 23, 2026
Security profile settings                                                                       Service Manager 9.81

Allowed statuses                        Process Designer security rights and
QBE format                              settings
Search format                           Allowed Statuses
Manage format                           List Format
Initial view                            Search format
Auto-notify format                      Manage Format
                                        Initial View
Incident macro mail format
Default template                        Notify Template
Default category
Assignment groups                                   Note
Authorized categories
New thread: View -> Search                         Use this setting to
New thread: Search -> List                         configure the template
New thread: List -> Edit                           name for the Notify action.
New thread: View -> Edit
                                        N/A

                                        Assignment groups
                                        Allowed Categories
                                        New thread: View -> Search
                                        New thread: Search -> List
                                        New thread: List -> Edit
                                        New thread: View -> Edit


Note

N/A means the previous fields are obsolete and aren't mapped to PD
security rights/settings.


1.3.11.5. Service Level Management
security profiles mappings

If you have upgraded from a previous version of Service Level Management, which is
not Process Designer based, see the following tables for Service Level Management
security profiles mappings.

Mapping between previous security profiles and
current PD security roles

The following table lists the mapping relationship between previous Service Level
Management security profiles and current PD security roles in the Service Level
Management module.

Security Profile                        Security Role/Area
DEFAULT
administrator                           DEFAULT/Service Level Management

sysadmin                                administrator/Service Level
                                        Management

                                        sysadmin/Service Level Management

Field mapping between security profiles and PD
security rights/settings

Note

In the following two tables, AND and OR relate to whether a mapped
security role has the corresponding right. For example, if any of the
Service Level Agreement, Response Objectives, or Availability Objective
has the "New" security profile setting, then the Process Designer security
rights and settings will also be "New."

For Service Level Agreements, Response Objectives and Availability Objectives

Security profile settings                                            Service Manager 9.81

New                                     OR   Process Designer
                                             security rights and
Delete                                  OR   settings
                                             New
Update                                  OR   Delete/Close
                                             Update
View                                    OR   View
                                             Allowed Statuses
Allowed Statuses                        AND
                                             Process Designer
SLT Catalog Records                          security rights and
                                             settings
Security profile settings                    Manage SLT Catalog
                                             Records
New                                     OR

Delete

Update

View

Settings


Security profile settings               Process Designer security rights and
                                        settings
View Monthly Aggregate Results          View Monthly Aggregate Results
View Monthly Response Time Results      View Monthly Process Time Results
View Response Detail Records            View Process Detail Records
View SLA Active Records                 View SLM Active Records
View Monthly Availability Results       View Monthly Service Results
View Outage Detail Records              View Outage Detail Records
View Outage Event Records               View Outage Event Records


1.3.11.6. Configuration Management
security profiles mappings

If you have upgraded from a previous version of Configuration Management, which is
not Process Designer based, see the following tables for Configuration Management
security profiles mappings.

Mapping between previous security profiles and
current PD security roles basic rights

The following table lists the mapping relationship between previous Configuration
Management security profiles and current Process Designer security roles basic
rights in the Configuration Management module.

Configuration profile settings field                                                            Service Manager 9.81
names
New                                     Security roles basic rights settings
Delete                                  field names
Update                                  New
View                                    Delete/Close
Allowed statuses                        Update
Template Mass Update                    View
Complex Mass Update                     Allowed statuses
Mass Delete                             Expert
Advanced search                         Expert
Allow inefficient query                 Mass Delete
Skip query warning                      View
Alternate views                         Allow Inefficient Query
Change CI type                          Skip Inefficient Query Warning
Open incident                           View
Request change                          Change CI type
Export                                  Open incident
Required password                       Request change
Confirm on end                          View
Audit                                   N/A
                                        N/A
                                        Audit


Note

N/A means the previous fields are obsolete and aren't mapped to PD
security rights/settings.

Field mapping between security profiles settings
and PD security roles additional rights/settings

The following table outlines the field mapping between legacy Configuration profile
settings and the current Process Designer security roles additional rights and
settings.

Configuration profile settings field    Security roles additional rights
names                                   settings field names
Search format                           Search format
Threading View -> Search                New thread: View -> Search
Threading Search -> List                New thread: Search -> List
Threading List -> Edit                  New thread: List -> Edit
Threading View -> Edit                  New thread: View -> Edit

Field mapping between security profiles settings
and PD security roles basic rights

The following table lists the mapping relationship between previous Configuration
Management security profiles and current Process Designer security roles basic
rights in the Configuration Management module.

Configuration profile settings field    Security roles basic rights settings
names                                   field names

Restrict to these types                 Allowed Category, which includes all
                                        other CI Types that aren't in the
                                        Restricted to these types list.

            © Copyright 2026 Open Text
For more info, visit https://docs.microfocus.com
````
