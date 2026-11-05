---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.3 .. 1.3.3
printed_pages: 1904-1936
---

# 1.3 Document Engine

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.3. Document Engine

The Document Engine comprises a set of tools and methodologies for developing and modifying Service
Manager workflows. The Document Engine was originally tasked to develop an underlying set of base
functionality that would support multiple modules inside Service Manager, improve consistency of the user
interface between modules and reduce the amount of code needed for any new module.

The Document Engine extends the display application capabilities with simplified and more extensive
actions especially those involving multiple application calls. In addition, the Document Engine supports the
use of joined tables and master format control calls. It is designed to meet the needs of most customers out
of the box, yet retain flexibility. The relationship between Objects, States, and Processes is hierarchical.

The Document Engine controls behavior with Objects. An Object is referenced whenever a form opens, and
the Object determines the behavior for the state of the form (open, list, search, etc.). Objects define overall
table behavior. Within the Object, a State describes where a record is in its lifecycle (open, list, search,
etc.). Within the State, different Processes are executed depending on the actions initiated by a user on the
record. States also define how the system displays a record and what options (actions) are available at
specific times or circumstances. For instance, States can determine an action, such as Save, given a user’s
access privileges.

Processes are called from States based on the user's action. The Process uses RAD expressions,
JavaScript, and calls to existing RAD applications to perform actions against the current record.


1.3.1. Document Engine overview

The Document Engine is a tailoring tool that includes the possibility to customize the system without the
need of RAD changes. It provides a centralized method for setting privileges and behavior for standard
actions, such as list, view, and search. It increases consistency across modules. The three main
components of the Document Engine are Objects, States, and Processes. Processes can be reused for
more modular programming and the integration is seamless, which can reduce development time.

Benefits of the Modular Approach

The advantages of the modular design include consistency in development, reduced development time,
and flexibility.

Consistency

The fact that the engine allows all applications to run using the same base RAD applications brings
consistency to the Service Manager application suite. Core functionality, such as locking, alerts, approvals,
and use of record list functionality, will work the same for any module, as they are all using the same code
base.

Reduced Development Times

The modularity of the Document Engine allows for reuse of existing code and Processes.

Flexibility

The Document Engine uses Process records as a mechanism to modify the behavior of modules inside of
Service Manager applications. You can create a new Process that has a different behavior than the base
system, without the need to change or remove the original Process from the system. Additionally, the
system’s base Processes can be overridden with your own Processes to give greater flexibility to the
system developer when tailoring Service Manager to meet an organization's specific requirements.

Accessing the Document Engine

To access the Document Engine, follow these steps:

   1. Start a Service Manager Client and log on as an administrator.
   2. In the Service Manager System Navigator, click Tailoring.
   3. Click Document Engine. From here, you can access the main three areas to define Objects, Processes

     or States. You can also set up Alerts and Approvals to be called from Objects or create Search
     Configuration Records, which are used by Objects.

Contents

     1 Benefits of the Modular Approach
           1.1 Consistency
           1.2 Reduced Development Times
           1.3 Flexibility

     2 Accessing the Document Engine


1.3.2. Objects

Objects are a base set of definitions that determine behavior of records and set the definitions and
governing rules. Objects correspond one-to-one with database dictionary (dbdict) records in Service
Manager. If a table doesn't have a dedicated Object record, the Document Engine applies the settings in the
DEFAULT Object. All Objects should have list and default States defined. If not otherwise supplied, the
default States are db.browse, db.list, db.search, and db.view.

            Note

           Do not modify or delete the DEFAULT Object Record as doing so will cause unpredictable
           results.

The Object record sets up the definitions and governing rules for the behavior of the table within the
Document Engine. For example these may include:

     The application used to create the users profile within this Object that determines what actions this
     user may take against any record of the table.
     The State records used in specific circumstances (see States for more details).
     The category, phase, and paging file names for the Object.
     The name of the number record to be used for this Object.
     How locking is to be used by this Object.
     Setup of revisions for records in the table.
     Which variables should be available to processes that run against this Object.
     Which global lists should always be available when using this Object.
     Use of activity records.
     How alerts are processed against this Object.
     How approvals are processed for this Object.
     Settings for the work queues.
     Ability to set up personal or global views and default templates.
     Notifications on add / update / delete of a record in this Object.
     Ability to configure additional search choices against this Object.

To view a list of the out-of-box Objects, click Search from the Object Definition form.

To view a list of the fields and field descriptions for the Object definitions see Object Definition form and
fields.


1.3.2.1. Create Objects

To create an Object, follow these steps:

   1. Navigate to the Document Engine. See the Accessing the Document Engine section in Document
     Engine overview.

   2. Double click Objects. The Objects form opens.
   3. Use the tabs on the Objects form, to fill in the fields required to create an Object that will perform the

     functions you desire. See the field descriptions for additional information.

To update an Object definition, follow these steps:

   1. Access the Document Engine. See the Accessing the Document Engine section in Document Engine
     overview

   2. Enter the name of the Object you want to update in the Object field or click Search to search for the
     Object.


1.3.2.2. Object Definition form and fields

The field descriptions for the Object Definition form are:

Field Name                              Description

File name                               Enter the dbdict name for the Object, that is, use
file.name                               the dbdict name that corresponds to this Object's
                                        name. (required)

Common name                             The system fills in this information from Data
message                                 Policy. It is a common name for the Object. The
                                        common name can be a simple name, such as
Unique key                              Work Order.
unique.field
                                        The system fills in this information from the
                                        dbdict. This is the unique key for the Object.

This form also includes the following tabs. The fields on these tabs are described in the field descriptions
tables for the respective tab.

     Object Info tab field descriptions - specifies the general properties and behavior of the Object.
     Locking tab field descriptions - determines the locking behavior for the Object.
     Revisions tab field descriptions - tracks revisions for the Object.
     Variable and Global Lists tab field descriptions - describes local variables and global variables used
     by the Object.
     Activities tab field descriptions - defines logging (activities).
     Alerts tab field descriptions - defines where to set alerts and the conditions for generating alerts.
     Approvals tab field descriptions - sets approval options for the Object.
     Manage Queues tab field descriptions - controls how queues display as well as threading, and who
     can create views (inboxes).
     Views and Templates tab field descriptions - defines whether or not a user can create global and
     personal views and templates on the Object.
     Notifications tab field descriptions - identifies notifications sent automatically for add, delete, or
     update activity for any record in the Object.
     Search Configuration tab field descriptions - controls the available options on the More Choices tab of
     the search screen.


1.3.2.2.1. Object Info tab field descriptions

This tab specifies the general properties and behavior of the Object.
The field descriptions for the Object Info tab are:

Field Name                                                                                       Service Manager 9.81
Description field
desc.field                              Description
Profile application
profile.appl                            Specifies a short description of the Object.

Profile variable                        Specifies the RAD application that creates the
profile.variable                        profile that determines if a user can perform
                                        certain functions, such as add and delete. For
Number record name                      example, db.environment. (required)
number.record
                                        Specifies a variable that can be accessed any
Category table name                     time this Object is called without accessing the
category.file.name                      environment record.For example, $L.env.
                                        (required)
Phase table name
phase.file.name                         Defines a number class for the Object, which can
                                        be accessed from a call to the getnumb
Paging table nam                        application either via a Process or FormatControl
paging.file                             or RAD call. It can be used to retrieve a sequential
                                        number as a unique key for the record. For
                                        example, EXWorkOrder.

                                        Specifies the table name that links with the
                                        category table associated with this Object's
                                        category value. When displaying a record of this
                                        type, if a field called category exists, then the
                                        Object will search the category table name and for
                                        the record with the corresponding name. If found,
                                        the system stores the Category File Name as a
                                        variable: $L.category.

                                        Specifies the table name that links with the phase
                                        table associated with this Object, if applicable.
                                        When the system displays a record of this type, if
                                        a field called phase exists, then the Object goes to
                                        the phase table name and selects a record with a
                                        corresponding name. If found, the system will
                                        store the phase table name as a variable:
                                        $L.phase.

                                        Specifies the name of the table used for storing
                                        pages. Pages are created as full copies of the
                                        current record prior to the latest updates being
                                        applied. This is done every time a record is
                                        updated, which creates a detailed audit trail.

 Field Name                                                                                      Service Manager 9.81
 Primary format control
 master.fc                              Description

 Joindef                                Specifies the name of the Primary Format Control
 joindef                                record, if one exists for the record Object. Primary
                                        Format Control allows you to define in one record
 Status field                           the Format Control statements that apply to all
 statusField                            phases in an area, for example Change
 Assigned to fields                     Management Request Phases. Typically, the name
 assignedToFields                       of the primary format control is the name of the
                                        dbdict or all categories in Incident Management,
 Workgroup fields                       Problem Management, or Service Desk.
 workgroupFields
                                        Specifies the name of the joindef record used to
 Open state                             join multiple tables, for example joincomputer, or
 open.state                             an expression that evaluates to a valid joindef
 Close state                            name, such as joindef in $L.category
 close.state
 List state                             Specifies the field name that contains the record's
 list.state                             status information.
 Default state
 default.state                          Specifies the field name that contains the
 Search state                           assignee name field for this Object. This field will
 search.state                           be referred to when Folder Entitlement verifies
                                        that the record is assigned to the logged in
This PDF was generated on May 23, 2026  operator.

                                        Specifies the field name that contains the
                                        assignment group field for this Object. This field
                                        will be referred to when Folder Entitlement verifies
                                        that the record is assigned to any of the logged in
                                        operator's work groups.

                                        Specifies the State definition record to use upon
                                        opening a new record.

                                        Specifies the State definition record to use for
                                        close processing of an existing record.

                                        Specifies the State definition record used to
                                        display a list of records.

                                        Specifies the name of the State used as default
                                        for the Object. To edit a record in this Object, the
                                        default State is used.

                                        Specifies the State definition record to use for
                                        searching.

                                                                                                                           Page 57 of 200
Field Name                                                                                       Service Manager 9.81
Browse state
browse.state                            Description

Manual states                           Defines the State definition record to use when
manual.states                           records use locking. Essentially, this field defines
                                        a read-only State when a record is currently
                                        locked by another user.

                                        Specifies the array of States that may be used
                                        with this Object other than the life-cycle states of
                                        open, close, list, view, search or browse.


1.3.2.2.2. Locking tab field descriptions

The Locking tab determines the locking behavior for the Object. This means that when someone is actively
updating a record the system doesn't allow another user to update the same record.

The field descriptions for the Locking tab are:

Field                                   Description
                                        Select this checkbox to enable locking.
Use locking
use.locking

Lock on display                         If true or a condition that evaluates to true,
lock.on.display                         Service Manager attempts to lock the record as
                                        soon as it is displayed. Use locking must be
Lock parent record                      enabled for this field to work.
lock.parent
                                        Locks the current record and the record’s parent.
Parent Id Field                         For example, when this field is checked and
parent.id                               someone is updating a change task, the change
                                        request for the task is also locked.

                                        Enter a field name in the current record that
                                        contains the ID of the parent to lock.

Parent Filename/Object                  The name of the table that contains the parent
parent.object                           record.

Watch Variables                         Watch Variables are used when the Document
watch.variables                         Engine checks to see if a record has been
                                        changed or not. Watch Variables must be NULL
                                        when the record is first displayed.


1.3.2.2.3. Revisions tab field descriptions

The Revisions tab determines the revision behavior for the Object
The field descriptions for the tab are:

Field Name                              Description

Revision table name                     Specifies the name of the table in which you want
revision.file                           to store revisions to this Object's records.

Max # of revisions                      Specifies the total number of revisions allowed for
max.revisions                           this Object. If left blank, then there is no upper
                                        limit.


1.3.2.2.4. Variable and Global Lists tab field
descriptions

The Variables/Global List tab describes local variables and global variables used by the Object.

            Note

           Global variables are built and stored in memory.

The field descriptions for the Variable/Global List tab are:

Field Name                              Description
Local variables
local.variables                         Enter a list of local variables that can be used in
                                        Processes. Local variables are defined in the
Global lists                            application. Local variables are assigned to the
global.lists                            Object you are creating and are available to all
                                        Processes and States associated with the Object.
                                        Local variables aren't available to other Objects.

                                        Global lists, once created, are available to all
                                        Processes. Global lists can be built on login, if
                                        they are listed in the Startup list. Global lists are
                                        available every time you access the Object.


1.3.2.2.5. Activities tab field descriptions

The Activities tab defines update (Activity) logging for the Object.
The field descriptions for the Activities tab are:

Field Name                                   Description

Activity log table                           The name of the table to hold the activity log
activitylog.file.name                        entries for the Object.

Selection list variable                      The variable to use on an update form to display
activity.selection.var                       the types of activities the operator can select
                                             when performing an update on a record for a
Posting link                                 specific Object.
activity.post.link
                                             The name of the link used to post information.

Require update if an activity record is NOT  A checkbox to indicate that an activity update is
generated?                                   required when the selected.

activity.mandatory

Update field                                 The field or variable that contains the activity
update.field.var                             update on the form. This field appears only when
                                             Require update if an activity record is NOT
Display message                              generated? is present.
activity.mandatory.msg
                                             The message indicating that an activity update is
                                             required. This field appears only when Require
                                             update if an activity record is NOT generated? is
                                             present.


1.3.2.2.6. Alerts tab field descriptions

The Alerts tab defines where to set alerts and the conditions for generating alerts. Any Object that has a
unique key can use these alerts.
The field descriptions for the Alerts tab are:

 Field Name                                                                                      Service Manager 9.81
 Alert location
 alert.location                         Description

 Alert condition                        The Alert location defines where the name of the
 alert.condition                        Alert Definition to run is found or stored. Specify
 Alert field name                       where the Alert Definition is stored:
 alert.field.name                       Record: Store alerts in the record itself.
 Alert status field                     Category: Store alerts in the category file defined
 alert.status.field                     on the Object Info tab.
 Alert update process                   Phase: Store alerts in the Phase record defined on
 alert.update.process                   the Object Info tab.
 Log alerts?                            Object: Store alerts in the Object record. When
 log.alerts                             selected an Alerts array table will be displayed to
 Process alerts on parent?              enable you to fill in alert(s) to be used.
 alerts.against.parent                  Note: The Object's table needs to have a unique
                                        key for the Alerts to relate to. A table that contains
This PDF was generated on May 23, 2026  a no nulls key rather than a unique key can't use
                                        Alerts.

                                        Specify a condition to determine whether or not to
                                        process the alert. For example, open in
                                        $L.file~=false.

                                        Specify the field name that contains the actual
                                        alert name, as defined by Alert location.

                                        Specifies the field in the current record in which
                                        to put the alert status, after the alert is processed.

                                        Specifies the name of the Process record for
                                        additional functions that the system performs
                                        after the alert runs.

                                        If selected, the alerts are moved after processing
                                        to the Alertlog file to keep an Alert history.

                                        If you have selected the Locking Parent Record
                                        field on the Locking/Revisions tab and you select
                                        this checkbox, then the alert will register against
                                        the parent record as well, when it is activated.

                                                                                                                           Page 64 of 200
Field Name                                                                                       Service Manager 9.81

Recalculate alerts if                   Description
alert.recalc                            Specifies conditions that determine whether to
                                        recalculate conditions on existing alerts.
Reset alerts if
alert.reset                             Determines when to delete existing alerts and
                                        recalculate all conditions.


1.3.2.2.7. Approvals tab field descriptions

The Approvals tab sets approval options and their associated notifications for the Object. Approvals are
defined in the ApprovalDef file.
The field descriptions for the Approvals tab are:

Field Name                                                                                       Service Manager 9.81
Approval condition
approval.condition                      Description
                                        If the approval condition evaluates to true,
Approval location                       approvals are used on the Object's records.
approval.location
                                        Indicates where the approval information is
Approval field name                     stored: record, phase, object, or category.
approval.field.name
                                        The field name that contains the actual Approval
Approval status field                   name within the table that's defined in the
approval.status.field                   Approval location.

Approval groups                         The field in the current record in which to store
approval.groups                         the approval status.

Approval type                           Stores a variable to contain the groups the current
appr.cond.type                          user must belong to in order to issue approvals for
                                        this Object.
Approval notification
single.notify.approval                  For a list of available approval types and their
                                        descriptions, see What's an approval type?.
Denial notification
single.notify.denial                    Select the notification to run if the request is
                                        approved.
Retraction notification
single.notify.retraction                Select the notification to run if one approver
                                        denies the request.
Final approval notification
final.notify.approval                   Select the notification to run when retracting a
                                        previous action.

                                        Select the notification to send once the final
                                        approval is granted.

 Field Name                                                                                      Service Manager 9.81
 Final denial notification
 final.notify.denial                    Description
 Approval FC                            Select the notification to send when the request is
 appr.fc                                denied.
 Approval process
 approval.process                       Specifies the name of the Format Control record
 Denial process                         to run upon approval.
 denial.process
 Preapprove on open                     Select the Process to run when the record is
 preapprove.cond                        approved.

 Log approvals?                         Select the Process that runs when the record is
 log.approvals                          denied.
 Require appr. comments
 approval.comments                      Determines whether the record should be
 Aggregate approvals?                   automatically approved.
 aggregate.approvals                    If the condition is true and the user belongs to one
 Recalculate approvals if               of the pending approval groups, the approval is
 approval.recalc                        processed automatically. If the user doesn't
                                        belong to one of the pending approval groups, the
This PDF was generated on May 23, 2026  approval doesn't occur automatically and must
                                        then go through the regular approval process.
                                        Defaults to true.

                                        Select this checkbox to log the history of
                                        approvals in the ApprovalLog table.

                                        If checked, approval comments are requested
                                        from the approver.

                                        If checked, approvals are cumulative.

                                        Specifies the conditions that determine whether
                                        or not to recalculate the conditions on the existing
                                        approvals.

                                                                                                                           Page 68 of 200
Field Name                                                                                       Service Manager 9.81

Reset approvals if                      Description
approval.reset                          Determines when to delete existing approvals and
                                        recalculate all conditions.


1.3.2.2.8. Manage Queues tab field descriptions

The Manage Queues tab controls how queues and views display as well as threading. These same fields
are available in Data Policy for files that don't have an associated Object record, or they are virtual joined
into the datadict record from the Object record if it exists.
The field descriptions for the Manage Queues tab are:

 Field Name                                                                                      Service Manager 9.81
 Manage condition
 scm.condition                          Description

 Manage display format                  Specifies a condition that allows only certain
 scm.manage.screen                      users to view the queues that display records of
                                        this Object. For example, browse in
 Manage default view                    $G.pm.environment.
 scm.inbox
                                        Select the format to use to display the view. The
 Manage default query                   out-of-box Service Manager has a default display
 scm.query                              format: sc.manage.generic that's used if no other
                                        form is chosen. We recommend that you don't
 Default query description              change the sc.manage.generic format.
 scm.query.name
                                        Select the default view for this queue. By
 Thread view -> search?                 specifying a user view for a particular user, a
 scm.thread.list.edit                   specific list of views can be set up for the Service
                                        Manager Manage Queues. If a user doesn't have a
 Search format (if necessary)           specific view defined , the default user view is
 scm.search.format                      used.
 Thread search -> list?
 scm.thread.search.list                 Specifies a default query to run if no default view
                                        is selected.
 Thread list -> edit?
 scm.thread.list.edit                   Specifies a name for the above field. You can
                                        associate a message with this field. For example,
 Thread view -> edit?                   scmsg(491, "us").
 scm.thread.inbox.edit
                                        Specifies true or an expression that evaluates to
This PDF was generated on May 23, 2026  true to open a new thread when conducting a
                                        search.

                                        Select a default search format.

                                        Specifies true or an expression that evaluates to
                                        true for a new thread when a user finds a list of
                                        records to view.

                                        Specifies true or an expression that evaluates to
                                        true for a new thread when a user selects a record
                                        to view out of a list of records.

                                        Specifies true or an expression that evaluates to
                                        true to open a new thread when the user views an
                                        existing record out of the queue.

                                                                                                                           Page 71 of 200
Field Name                                                                                       Service Manager 9.81
Allow add condition
scm.add.condition                       Description
                                        Specifies an expression that evaluates an
Add/open application                    operator’s ability to add a record.
scm.add.appl
                                        Specifies the name of the application to call when
Parameter Names                         a record is added or opened.
scm.add.names
                                        Specifies the parameter names to pass to the
Parameter Values                        application specified in the Add/open application
scm.add.values                          field.

                                        Specifies the parameter values to pass to the
                                        application specified in the Add/open application
                                        field


1.3.2.2.9. Views and Templates tab field
descriptions

The Views/Templates tab defines whether or not a user can create global and personal views as well as
template support.

The field descriptions for the tab are:

Field Name                              Description

Can create personal views               Specifies a condition that evaluates to true or
personal.inbox                          false. True allows the user to create personal
                                        views.

Can create system views                 Specifies a condition that evaluates to true or
global.inbox                            false to determine if the user can create global
                                        views.

Default Template                        Specifies the name of the default template to use
default.template                        for records in this table.

Supports Templates?                     Select this checkbox to enable support for
supportTemplates                        templates for the Object.


1.3.2.2.10. Notifications tab field descriptions

The Notification tab identifies notifications sent automatically for add, update, or delete activity for the
Object.

The field descriptions for the Notifications tab are:

Field Name                              Description

Add                                     Select the notification that's sent automatically
notification.add                        when a record is added to the table.

Update                                  Select the notification that's sent automatically
notification.update                     when a record is updated in the table.

Delete                                  Select the notification that's sent automatically
notification.delete                     when a record is deleted from the table.


1.3.2.2.11. Search Configuration tab field
descriptions

The Search Configuration tab controls the available choices on the More Choices tab of the search screen.
The field descriptions for the Search Configuration tab are:

Field Name                              Description
                                        The name of the table that will be queried.
Table Name
tablename

Search Format                           The name of the sub-format used for the More
searchFormat                            Choices tab.

Initialization Process                  The name of a Process that will be run before
init.process                            displaying the search form.

Allow Advanced Find                     Defines the conditions that determine whether or
allowAdvAccess                          not to allow Advanced Find.


1.3.2.2.12. Defined Queries tab

The Defined Queries tab defines the query statements and labels to use on the More Choices tab of the
search screens (for example, More Choices on the Search Incidents form). The fields are defined in the
SearchConfig table.

The field descriptions for the Defined Queries tab are:

Field Name                              Description

Id                                      Provides the unique ID for the query and can't
id                                      include special characters including spaces.

Query                                   A query expression using system language
query                                   syntax. For example, assignee.name=operator() .

Description                             Provides the label for the checkbox on the More
description                             Choices tab.


1.3.2.2.13. Ranges tab

The Ranges tab allows you to easily set up a search for begin and end date ranges. To do so click the
Modify Configuration link, to define a variable each for begin and end to use as input in the form. Enter this
variable in the Variable 1 column and use the Field and Operator 1 columns to define the query that will be
executed. Modify Configuration is also how modifications are made on the Defined Queries tab as well.

The field descriptions for the Ranges tab are:

Field Name                              Description
                                        Specifies the field in the table to use in the query.
Field
fieldName

Operator 1                              The comparison operator in the query. (for
operator1                               example: >=)

Variable 1                              Specifies the variable used as input on the form.
variable1

Special Type                            Not used at this time.
specialType


1.3.3. States

States are called by Objects and are defined by Processes. The State record contains information about
how a record looks and acts at a specific period in time.

A State record definition can include the following:

     The State name.
     The display screen to use in order to display the record or records.
     The initialization process used when a list is first displayed.
     The format to use to display the data.
     The input condition to indicate whether or not a user can modify the record.
     The Process to run when a user triggers a specific display option (Display Action).

The State record used depends on how many records the user views. There are out-of-box State records
for searching for records, viewing a list, viewing a single record, and browsing a record.

Searching

When there are no records in the current file variable, it is assumed that the user is in “search” mode. The
State that's used is the “Search State” defined in the table’s Object record. The default search state is
“db.search”.

Record Lists

When viewing a list of records, the “List State” defined in the table’s Object record is used. The default list
state is “db.list”.

            Note

           In some earlier versions of Service Manager, record lists are referred to as QBE lists.

Viewing a single record

When viewing a single record, the record is first checked to see if it includes a “State” field in the dbdict. If
the field exists and is populated, the contents of that field will be used as the current State of the record. If
this field doesn't exist or is NULL, the “Default State” defined in the table’s Object record is used. The
default value for the default state is “db.view”.

Browsing a record

When browsing a record in read-only mode, the “Browse State” defined in the table’s Object record is used.
Note that only files that use locking need a browse State. Although viewing a record without having update
rights looks similar to the browse screen, it is using the default State, not the browse State. There is no
default browse state.

Integration tips for display application

If a display screen doesn't have any display events associated with it, the system automatically uses the
se.default display event that performs se.lock.object in case of “OnFormModified”. If a display option
record has the “Modifies Record” checkbox activated, the record is locked when the button is pressed.

Create and update States


To create a new State, follow these steps:

   1. Access the Document Engine. See the Accessing the Document Engine section in Document Engine
     overview

   2. On the State Definition form, fill in the fields required to create a State to perform the functions you
     desire.

To modify an existing State, follow these steps:

   1. Access the Document Engine. See the Accessing the Document Engine section in Document Engine
     overview

   2. Enter the name of the State you want to modify in the State field or click Search to search for the
     State.

State Definition field descriptions

The State definition record defines the behavior and display specifications for a record at a specific period
in time.

In the State record non-base methods can be defined or the behavior of base methods can be modified.
Base methods are described in the sections Base functions in se.search.engine, Base functions in
se.view.engine, and Base functions in se.list.engine. They include functions such as save, find, fill, OK,
Cancel, and Search.

See the following tables for the field descriptions of the State Definition form.

 Field Name                                                                                                       Service Manager 9.81
 State
 state                                           Description
 Display Screen                                  Specifies the name of the State. (required)
 display.screen
 Initialization Process                          The display screen to associate with the State.
 init.process
 Format                                          The name of a Process to run prior to entering the
 format.name                                     State.

 Input Condition                                 Specifies the format in which the State record
 input.condition                                 opens. This form is stored in a record, and it can
                                                 be a variable or hard-coded. The name of the
 Field Name                                      format can be hard-coded or be contained in a
 Display Action                                  variable or retrieved from a record via a system
 process.label                                   language expression.
                                                 The input condition is evaluated for view States
 Process Name                                    and determines whether or not the record is read-
 valid.process                                   only. Specify false for read-only or true for
 Condition                                       editable. You may also enter an expression that
 process.condition                               evaluates to true or false.otherwise, enter true or
 Save First                                      enter an expression that evaluates to true or false.
 run.save.before
                                        Non-base methods
This PDF was generated on May 23, 2026
                                                 Description
                                                 Specifies the action parameter that comes from a
                                                 display action after input from a user. The display
                                                 action comes from the action field in the display
                                                 option of a button or menu item clicked by a user.
                                                 Specifies the name of the Process run as a result
                                                 of the action.

                                                 Specifies an expression that evaluates to true for
                                                 the Process specified in the Process Name to be
                                                 called.

                                                 Choose to run the save Process before you run
                                                 this Process. Type true to save first; otherwise,
                                                 enter false. The default is false.

                                                                                                                                             Page 80 of 200
````
