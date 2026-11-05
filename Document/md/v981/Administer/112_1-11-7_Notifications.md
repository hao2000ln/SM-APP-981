---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.11.7 .. 1.11.7.7
printed_pages: 2799-2830
---

# 1.11.7 Notifications

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.11.7. Notifications

You can configure Service Manager to send notifications whenever specific system
events occur. By default, Service Manager supports notifications for every type of
status change event in all applications. You can also define custom notifications that
Service Manager sends when specific events occur.

You can configure the following properties for notifications:

     Conditions under which Service Manager sends the notification
     Content of the notification

           Record ID of the triggering event
           Current phase of the triggering event
           Operator assigned to the triggering event
           E-mail formatting
     Delivery method of the notification
           Active Note
           E-mail
     Recipient list
           Contact name
           Group
           Operator
           Operator assigned to
           Operator coordinator
           Operator requested by

Related topics

Alerts
Message processors
Add a message record
Add a notification delivery method
Create a custom notification
Create a distribution group
Create an on-call schedule
Send a notification using Format Control
Default message classes
Default notifications


1.11.7.1. Default message classes

By default, Service Manager provides the following message classes.

     agent
     alert
     am
     approval
     cau
     cib
     cm
     cm3
     contract
     copyds
     ct
     da
     dbdict
     dcu
     dde
     de
     debug
     dewiz
     diffupg
     displayscreen
     doceng
     ds
     dt
     erd
     erp
     error
     es
     fc
     fin
     fm
     ga
     help
     icm
     ins
     ir
     itil

     kpak                               Service Manager 9.81
     macro                                               Page 135 of 384
     mail
     misc
     news
     ns
     object
     ocm
     patcort
     pm
     print
     ps
     queue
     rad
     rc
     rca
     rsm
     rw
     sap
     sc
     sc.email
     sc24x7
     scballon
     scbase
     scbutton
     sccaption
     scev
     scgui
     scir
     scjs
     scjsdesc
     scmenu
     scmenugroup
     scpolicy
     scrad
     scscd
     scsql
     sctitle
     scutility
     scxmlapi

This PDF was generated on May 23, 2026

     sla
     sm
     SmartEmail
     sql
     swcompliance
     trigger
     upg
     us
     validity
     wizard
     wm
     work

Related topics

Notifications
Add a message record
Add a notification delivery method
Create a custom notification
Create a distribution group
Create an on-call schedule
Send a notification using Format Control
Default notifications


1.11.7.2. Default notifications

By default, Service Manager includes the following notifications.

 Notification record                                                                            Service Manager 9.81
 Activity Added
 ChM Change Close                       Notification event
 ChM Change Open
 ChM Change Update                      Adding an activity update with the
                                        "Visible to Customer" option selected
 ChM Task Close
 ChM Task Open                          Closing a change phase in Change
 ChM Task Update                        Management

 ChM Retract All                        Opening a change phase in Change
 ChM Retract One                        Management
 Clone Relation
                                        Updating a change phase in Change
 IM Action Alert                        Management or opening a phase that
 IM Alert Reassign                      has been deferred

This PDF was generated on May 23, 2026  Closing a task phase in Change
                                        Management

                                        Opening a task phase in Change
                                        Management

                                        Updating a task phase in Change
                                        Management or opening a deferred
                                        phase

                                        Reversing approval for all levels of a
                                        change phase in Change Management

                                        Reversing approval for one level of a
                                        change phase in Change Management

                                        Copying associations of a cloned
                                        incident or service desk interaction
                                        record

                                        Updating the alert status of an incident
                                        in Incident Management

                                        Exceeding the reassignment limit for an
                                        incident in Incident Management

                                                                                                                        Page 138 of 384
 Notification record                                                                            Service Manager 9.81
 IM Close
 IM Edit Close Cascade                  Notification event

 IM Edit Close Linked                   Closing an incident in Incident
                                        Management
 IM Open
 IM Reopen                              Closing an incident and its related
 IM Resolved                            service desk interaction records in
 IM Save Relation                       Incident Management

 IM Updated                             Closing an incident but not its related
 RM Approval                            service desk interaction records in
 RM Denial                              Incident Management
 RM Final Approval
 RM Final Denial                        Opening an incident in Incident
                                        Management
This PDF was generated on May 23, 2026
                                        Reopening an incident in Incident
                                        Management

                                        Resolving an incident in Incident
                                        Management

                                        Opening a related incident for a service
                                        desk interaction and linking the record
                                        to an existing incident

                                        Updating an incident in Incident
                                        Management

                                        Approving a request or order in
                                        Request Management

                                        Denying request or order in Request
                                        Management

                                        sent when the request is completely
                                        approved in Request Management

                                        Denying a request in Request
                                        Management

                                                                                                                        Page 139 of 384
Notification record                                                                             Service Manager 9.81
RM Line Item Change Category
RM Line Item Close                      Notification event
RM Line Item Drop Avail
RM Line Item Mark Avail                 Manually changing the category of a
RM Line Item Open                       line item in Request Management
RM Line Item Reopen
RM Line Item Update                     Manually closing a line item in Request
RM Order Change Category                Management
RM Order Close
RM Order Open                           Marking a line item as unavailable in
RM Order Update                         Request Management
RM Request Change Category
RM Request Close                        Marking a line item as available to order
                                        in Request Management

                                        Opening a new line item in Request
                                        Management

                                        Reopening a line item in Request
                                        Management

                                        Updating a line item in Request
                                        Management

                                        Manually changing the category of the
                                        order in Request Management

                                        Closing an order in Request
                                        Management

                                        Opening an order in Request
                                        Management

                                        Updating an order in Request
                                        Management

                                        Manually changing the request
                                        category in Request Management

                                        Closing an request in Request
                                        Management

 Notification record                                                                            Service Manager 9.81
 RM Request Deferred
 RM Request Open                        Notification event
 RM Request Open Next Phase
 RM Request Phase Change                Deferring a request in Request
 RM Request Reopen                      Management
 RM Request Update
 Request Late Notice                    Opening a request in Request
 Request Not Ordered                    Management

 SM Add                                 Moving a quote to the next phase in
                                        Request Management
 SM Close
 SM Save                                Manually changing the phase of the
                                        request in Request Management
 SM Update
                                        Reopening a request in Request
This PDF was generated on May 23, 2026  Management

                                        Updating a request in Request
                                        Management

                                        Expired due date in Request
                                        Management

                                        Too much elapsed time between the
                                        date that the first line item is ordered
                                        and moving to the ordering phase

                                        Opening a service desk interaction
                                        record in an active state in Service
                                        Desk

                                        Closing a service desk interaction
                                        record in Service Desk

                                        Opening a service desk interaction
                                        record in an inactive state in Service
                                        Desk

                                        Updating a service desk interaction
                                        record in Service Desk

                                                                                                                        Page 141 of 384

Notification record                       Notification event

Save Association                          Linking two associated records

Save Relation                             Opening a related record

Related topics

Notifications
Add a message record
Add a notification delivery method
Create a custom notification
Create a distribution group
Create an on-call schedule
Send a notification using Format Control
Default message classes


1.11.7.3. Add a message record

Applies to User Roles: System Administrator
To add a message record, follow these steps:

   1. Click Tailoring > Notifications > Messages. The Search Message Records
     form opens.

   2. Type or select the following information.

       Field                                                                              Service Manager 9.81
       Language Code
                                        Description
       Class
                                        You can leave this field blank to have
       Message Number                   Service Manager use the language
                                        code defined in the company record.
       Severity                         To display the message in another
       Text                             language, type the ISO code of that
                                        language.
       Comments
                                        Type a name or label to describe the
   3. Click Add.                        Service Manager applications to
                                        which this notification applies. For
Related topics                          example, you can make a message
                                        relating to Change Management part
Notifications                           of the cm3 class.
Add a notification delivery method
Create a custom notification            Type a unique ID to identify this
Create a distribution group             message. For more information
                                        about how to set this ID, see RAD
This PDF was generated on May 23, 2026  function: scmsg.

                                        This field is reserved for future use
                                        and can be ignored.

                                        Type the text of the message to
                                        display. You can use the arguments
                                        %S and %S[n] to include information
                                        from the triggering event.

                                        This is an optional field you can use
                                        to type a description of the
                                        message.

                                                                                                                 Page 144 of 384

Create an on-call schedule
Send a notification using Format Control
Default message classes
Default notifications


1.11.7.4. Add a notification definition
record

Applies to User roles: System Administrator

The Notification Engine is primarily responsible for sending messages that are
generated by Service Manager events, such as opening or closing a quote or order.
System Administrators can edit these messages, add new messages, change the
conditions under which the messages will be sent out, and select who will receive the
messages.

To add a notification definition record, click Tailoring > Notifications >
Notifications to open the Notification Definition form. Type or select the following
information and then Click Add.

Field                                                                                           Service Manager 9.81
Name
Condition                               Description

Message tab                             Type the name of the notification
Msg Class                               record.
Msg No
                                        Type true to enable the notification in
                                        all conditions. Type an expression
                                        that's true or false to specify a
                                        condition when Service Manager
                                        should send the notification. Type false
                                        to disable the notification in all
                                        conditions. By default, Service
                                        Manager treats a blank entry as true.

                                        Use this tab to define the message
                                        type, delivery method, and conditions
                                        under which Service Manager should
                                        send the notification.

                                        Type the message class for the
                                        notification. This value must match a
                                        message class definition in the
                                        message record.

                                        Type the message number for the
                                        notification. This value must match a
                                        message number definition in the
                                        message record.

 Field                                                                                          Service Manager 9.81
 Arguments
                                        Description
 Condition
 Format                                 Type any RAD expressions to display
                                        information from the record or event
This PDF was generated on May 23, 2026  that triggered the notification. Service
                                        Manager displays this information in
                                        the text of the notification. You can
                                        enter an array of arguments by
                                        enclosing all arguments in brackets and
                                        separating each argument with a
                                        comma. For example:
                                        {argument1,argument2,argument3}

                                                    Note

                                                   Arguments typically take
                                                   the following form:

                                                         <field name> in
                                                         $L.file

                                                   where <field name> is the
                                                   name of a field in the
                                                   record that triggered the
                                                   notification.

                                        Type true to enable the notification in
                                        all conditions. Type an expression that
                                        can be true or false to define a
                                        condition when Service Manager
                                        should send the notification. Type false
                                        to disable the notification in all
                                        conditions. By default, Service
                                        Manager treats a blank entry as true.

                                        Type the format control record used to
                                        display the triggering record as part of
                                        the notification.

                                                                                                                        Page 148 of 384
Field                                                                                           Service Manager 9.81
Notify Method
                                        Description

                                        Type or select the delivery method to
                                        be used to send the notification. This
                                        value must match a delivery method
                                        defined in the msgtype table.

                                                    Note

                                                        The notification
                                                        applications listed
                                                        below must be
                                                        defined in RAD code
                                                        and exist in Service
                                                        Manager to work.
                                                        The message type
                                                        must be enabled
                                                        (true) by selecting
                                                        "Active?" in the
                                                        msgtype table.

                                        See the following list for valid message
                                        types.

                                             connect: Send a message to an
                                             external device.
                                             email: Send an email.
                                             log: Create a log entry for a
                                             message.
                                             mail: Send internal mail.
                                             msg: Send an internal message to
                                             a user's current Service Manager
                                             session (for example, "Incident
                                             IM1011 has been assigned to your
                                             monitor list since...").

Field                                                                                           Service Manager 9.81
Recipients
Group File                              Description

                                                           Note

                                                        If the user is not
                                                        currently connected
                                                        to a Service Manager
                                                        session, the message
                                                        is not sent.

                                             print: Print message.
                                             teams: Send a Teams message.

                                        Type one of the following to identify
                                        who should receive the notification:

                                             A contact name
                                             An operator name
                                             Array of approval group names
                                             A RAD expression that gathers a
                                             contact or operator name from
                                             some field in the triggering record

                                        Type the name of the group receiving
                                        the notification. You can specify the On
                                        Call group to send the notification to
                                        for those operators who meet the On
                                        Call criteria.

Field                                                                                           Service Manager 9.81
Group Area
                                        Description

                                        Type the name of the group area
                                        receiving the notification. You can use
                                        this field only with ocmgroups and
                                        cm3groups group tables. Valid choices
                                        include:

                                             ocmgroups: All, Line
                                             Items, Orders, and Quotes
                                             cm3groups: All, Changes,
                                             and Tasks

 Field                                                                                          Service Manager 9.81
 Subgroup
                                        Description
This PDF was generated on May 23, 2026
                                        Type the name of the subgroup area
                                        receiving the notification. You can use
                                        this field with assignment, ocmgroups,
                                        and cm3groups tables. Valid choices
                                        include All, Approvers, and Members.

                                                    Note

                                                   If you have set a valid
                                                   group email of
                                                   members/approvers in the
                                                   Assignment Groups
                                                   definition and then select
                                                   Members/Approvers here,
                                                   the system only sends
                                                   emails to this group email
                                                   address when sending
                                                   notifications. Otherwise,
                                                   the system separately
                                                   sends the emails to each
                                                   member in the assignment
                                                   group.

                                                   However, this group email
                                                   function doesn't support all
                                                   the Smart Emails with
                                                   action buttons (such as the
                                                   Approve, Deny, or Close
                                                   buttons, and so on). The
                                                   system separately sends
                                                   the Smart Emails with
                                                   action buttons to each
                                                   member in the assignment
                                                   group even though you
                                                   have set a valid group
                                                   email address in the
                                                   Approver Group Email
                                                   field.

                                                                                                                        Page 152 of 384
Field                                                                                           Service Manager 9.81
Email/Mail Subject Line tab
Msg Class                               Description

Msg No                                  Use this tab to type any custom
                                        information that should appear in e-
                                        mail notifications.

                                        Type the message class for the subject
                                        of the notification. This value must
                                        match a message class definition in the
                                        message record.

                                        Type the message number to use as
                                        the subject of the notification. This
                                        value must match a message number
                                        definition in the message record.

Field                                                                                           Service Manager 9.81
Arguments
                                        Description
Email Cc/Bcc tab
                                        Type any RAD expressions used to
                                        display information from the record or
                                        event that triggered the notification.
                                        Service Manager displays this
                                        information in the subject of the
                                        notification. You can enter an array of
                                        arguments by enclosing all arguments
                                        in brackets and separating each
                                        argument with a comma. For example:
                                        {argument1,argument2,argument3}

                                                    Note

                                                   Arguments typically take
                                                   the following form:

                                                         <field name> in
                                                         $L.file

                                                   where <field name> is the
                                                   name of a field in the
                                                   record that triggered the
                                                   notification.

                                        Use this tab to define the email Cc and
                                        Bcc recipients. Configurations on this
                                        tab apply only if you select email as the
                                        Notify Method.
                                        Note: If a Smart Email consists of
                                        tokens, the Cc and Bcc functions don't
                                        work.

Field                                                                                           Service Manager 9.81
Recipient(s) (Cc)
Recipient(s) (Bcc)                      Description

Group File (Cc)                         Type one of the following to identify
Group File (Bcc)                        the email Cc and Bcc recipients.

                                             A contact name
                                             An operator name
                                             Array of approval group names
                                             A RAD expression that gathers a
                                             contact or operator name from
                                             some field in the triggering record

                                        Type the name of the Cc and Bcc
                                        groups receiving the notification.

 Field                                                                                          Service Manager 9.81
 Subgroup (Cc)
 Subgroup (Bcc)                         Description

This PDF was generated on May 23, 2026  Type the name of the Cc and Bcc
                                        subgroups area receiving the
                                        notification. Valid choices
                                        include All, Approvers, and Members.

                                                    Note

                                                   If you have set a valid
                                                   group email of
                                                   members/approvers in the
                                                   Assignment Groups
                                                   definition and then select
                                                   Members/Approvers here,
                                                   the system only sends
                                                   emails to this group email
                                                   address when sending
                                                   notifications. Otherwise,
                                                   the system separately
                                                   sends the emails to each
                                                   member of the assignment
                                                   group.

                                                   However, this group email
                                                   function doesn't support all
                                                   the Smart Emails with
                                                   action buttons (such as the
                                                   Approve, Deny, or Close
                                                   buttons, and so on). The
                                                   system separately sends
                                                   the Smart Emails with
                                                   action buttons to each
                                                   member in the assignment
                                                   group even though you
                                                   have set a valid group
                                                   email address in the
                                                   Approver Group Email
                                                   field.

                                                                                                                        Page 156 of 384
 Field                                                                                          Service Manager 9.81
 Email Attachment tab
                                        Description
 Condition
                                        Use this tab to define the conditions
 Query Filter                           and query filters under which Service
                                        Manager should add attachments from
Related topics                          the original record to the notification.
                                        When the condition is evaluated as
Notifications                           true, the system filters the attachments
Add a message record                    in a record and then sends the
Add a notification delivery method      attachments that match the query filter
Create a custom notification            along with the notification email.

This PDF was generated on May 23, 2026  Type true to add attachments to the
                                        notification in all conditions. Type
                                        false to disable the attachments in all
                                        conditions. Alternatively, type an
                                        expression to define a condition when
                                        Service Manager should add the
                                        attachments. For example, severity in
                                        $L.file=2 and not same(severity in
                                        $L.file, severity in $L.file.save) .

                                        Type true to add all types and sizes of
                                        attachments to the notification. Type
                                        false to disable attachments of all
                                        types and sizes. Alternatively, type
                                        query criteria for the allowed
                                        attachment types and sizes. For
                                        example, size<10000000 and not
                                        (filename like "*.eml") and (filename
                                        like "*.pdf" or filename#"High Severity
                                        Notification") .

                                                                                                                        Page 157 of 384

Create a distribution group
Create an on-call schedule
Send a notification using Format Control
Default message classes
Default notifications


1.11.7.5. Add a notification delivery method

Applies to User Roles: System Administrator
To add a notification delivery method, follow these steps:

   1. Click Tailoring > Notifications > Message Types. The Message Type File form
     opens.

   2. Type or select the following information.

       Field                              Description
       Type
                                          Type a name or label to describe the
       Description                        notification method. For example, to
                                          send an e-mail message, you can
       Application                        create a type called e-mail.

       Active?                            This is an optional field you can use
                                          to type a description of the
   3. Click Add.                          notification method.

Related topics                            Type the name of the RAD
                                          application that sends the
Notifications                             notification.
Add a message record
Create a custom notification              Select this option to enable the
Create a distribution group               notification method for use by
Create an on-call schedule                notification records.
Send a notification using Format Control


Default message classes
Default notifications


1.11.7.6. Create a custom notification

Applies to User Roles: System Administrator

To create a custom notification, follow these steps:

   1. Create the custom message for the notification.
   2. Define the delivery methods available for notifications.
   3. Define the on call schedules for the groups in your organization.
   4. Create a notification definition record.
   5. Configure your Service Manager applications to use your notification.

Related topics

Notifications
Add a message record
Add a notification delivery method
Create a distribution group
Create an on-call schedule
Send a notification using Format Control
Default message classes
Default notifications


1.11.7.7. Create a distribution group

Applies to User roles: System Administrator

You can create distribution groups that the Report Exerciser and Event Services
applications can use to send reports to pre-defined group of users, or to
automatically open change and incident records. Service Manager saves changes
that you make to distribution groups in the distgroup table.

To create a distribution group, follow these steps:

   1. Click System Administration > Base System Configuration > Miscellaneous >
     Distribution.

     The Distribution Group File form opens.

   2. In the Group Name field, type the name of the group.

   3. Select the type of distribution group.

Type                                    Description
Change
Email                                   Creates a change request and
Print                                   assigns it to the distribution group
Problem
                                        Sends an e-mail message to the
                                        distribution group

                                        Sends a print job to the printer on
                                        behalf of the distribution group

                                        Creates an incident and assigns it to
                                        the distribution group

   4. In the Operators/Contacts field, type the operator name or names of contacts
     who belong to the distribution group.

   5. Click Add.

     Service Manager adds the distribution group record.

Related topics


Notifications
Add a message record
Add a notification delivery method
Create a custom notification
Create an on-call schedule
Send a notification using Format Control
Default message classes
Default notifications
````
