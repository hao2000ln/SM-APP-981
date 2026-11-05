---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.11.7.9.4 .. 1.11.7.9.6
printed_pages: 2870-2894
---

# 1.11.7.9.4 Incident Task and Problem Task Notifications

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.11.7.9.4. Incident Task and Problem Task
Notifications

The following Incident Task and Problem Task Notifications are present in Process
Designer.

Assignment Group


Status                                  All

Rule Set                                Notification is triggered when only
                                        Assignment Group is populated or
                                        updated and Assignee field is blank

Notification name(notfication definition Task Assignment
table)

Recipients                              Assignment Group members

Subject                                 Task %S (Task ID) has been assigned
                                        to you

Format                                  NOTE: SYSTEM GENERATED EMAIL,
                                        PLEASE DO NOT REPLY. FOR MORE
                                        INFORMATION REFER TO THE
                                        PROBLEM RECORD IN THE SYSTEM.

                                        Dear Sir/Madam,

                                        Task %S (Task ID) is assigned to %S
                                        (Assignment Group name) Group.
                                        Identify an assignee to work on the
                                        Problem.

                                        Problem details are as follows:

                                        Title:

                                        Description:

                                        Priority:

                                        Click here to go to the Task record
                                        (provide the link to Task record)

                                        Thanks and regards,

                                        Service Manager

Assignee


Status                                  Active

Rule Set                                Notification is triggered when Assignee
                                        field populated or updated

Notification name(notification definition Task Assignment
table)

Recipients                              Task Assignee

Subject                                 Task %S (Task ID) has been assigned
                                        to you

Format                                  NOTE: SYSTEM GENERATED EMAIL,
                                        PLEASE DO NOT REPLY. FOR MORE
                                        INFORMATION REFER TO THE
                                        PROBLEM RECORD IN THE SYSTEM.

                                        Dear Sir/Madam,

                                        Task %S (Task ID) is assigned to you

                                        Task details are as follows:

                                        Title:

                                        Description:

                                        Priority:

                                        Click here to go to the Task record
                                        (provide the link to Task record)

                                        Thanks and regards,

                                        Service Manager

Closure

 Status                                                                                         Service Manager 9.81
 Rule Set
 Notification name (notification        Closed
 definition table)
 Recipients                             Notification is triggered when the
 Subject                                status is moved to Closed
 Format
                                        Task Closure
Cancellation
                                        Task Assignee

                                        Task %S (Task ID) is closed

                                        NOTE: SYSTEM GENERATED EMAIL,
                                        PLEASE DO NOT REPLY. FOR MORE
                                        INFORMATION REFER TO THE
                                        PROBLEM RECORD IN THE SYSTEM.
                                        Dear Sir/Madam,
                                        Task %S (Task ID) is Closed.
                                        Task details are as follows:
                                        Title:
                                        Description:
                                        Priority:
                                        Task Outcome:
                                        Closure Code:
                                        Click here to go to the Task record
                                        (provide the link to Task record)
                                        Thanks and regards,
                                        Service Manager

Status                                                                                          Service Manager 9.81
Rule Set
                                        Cancelled
Notification name (notification
definition table)                       Notification is triggered when the
Recipients                              status is moved to Cancelled
Subject
Format                                  Task Cancellation

                                        Task Assignee

                                        Task %S (Task ID) is cancelled

                                        NOTE: SYSTEM GENERATED EMAIL,
                                        PLEASE DO NOT REPLY. FOR MORE
                                        INFORMATION REFER TO THE
                                        PROBLEM RECORD IN THE SYSTEM.
                                        Dear Sir/Madam,
                                        Task %S (Task ID) has been cancelled.
                                        Task details are as follows:
                                        Title:
                                        Description:
                                        Priority:
                                        Closure Code:
                                        Click here to go to the Task record
                                        (provide the link to Task record)
                                        Thanks and regards,
                                        Service Manager


1.11.7.9.5. Request Notifications

The following out-of-box Request Notifications are provided in the Request Fulfillment
module.

Off-catalog Request Creation

Status                                  All

Rule Set                                Notification is triggered when off-
                                        catalog request is registered

Notification name(notification definition Request Open
table)

Recipients                              requestor

Subject                                 Request %s (hyper link of request
                                        number) has been registered.

Format                                  Service Manager
                                        Request %s (hyper link of request
                                        number) has been registered.
                                        Details
                                        Title (or Description):
                                        Category:
                                        Subcategory:
                                        Request Model:
                                        Status:
                                        Priority:
                                        Sent from Service Manager. Do not
                                        reply to this email.

Assignment Group


Status                                  All

Rule Set                                Notification is triggered when
                                        assignment group is populated but
                                        assignee is empty

Notification name(notification definition Request Assignment
table)

Recipients                              members of the assignment group

Subject                                 Request %s (hyper link of request
                                        number) has been assigned to you or
                                        your group.

Format                                  Service Manager

                                        Request %s (hyper link of request
                                        number) has been assigned to you or
                                        your group.
                                        Details

                                        Title (or Description):

                                        Category:

                                        Subcategory:

                                        Request Model:
                                        Status:

                                        Priority:

                                        Sent from Service Manager. Do not
                                        reply to this email.

Assignee


Status                                  All

Rule Set                                Notification is triggered when assignee
                                        is populated

Notification name(notification definition Request Assignment
table)

Recipients                              assignee

Subject                                 Request %s (hyper link of request
                                        number) has been assigned to you or
                                        your group.

Format                                  Service Manager

                                        Request %s (hyper link of request
                                        number) has been assigned to you or
                                        your group.
                                        Details

                                        Title (or Description):

                                        Category:

                                        Subcategory:

                                        Request Model:
                                        Status:

                                        Priority:

                                        Sent from Service Manager. Do not
                                        reply to this email.

Request Pending Approval


Status                                  All

Rule Set                                Notification is triggered when the
                                        request approval status is “pending”

Notification name(notification definition Request Pending Approval
table)

Recipients                              members of current.pending.groups

Subject                                 Request %s (hyper link of request
                                        number) is pending on your approval.

Format                                  Service Manager
                                        Request %s (hyper link of request
                                        number) is pending on your approval.
                                        Details
                                        Title (or Description):
                                        Category:
                                        Subcategory:
                                        Request Model:
                                        Status:
                                        Priority:
                                        Sent from Service Manager. Do not
                                        reply to this email.

Request is Approved or Denied


Status                                  All

Rule Set                                Notification is triggered when request
                                        approval status is changed from
                                        “pending” to “approved” or request
                                        approval status is “denied”

Notification name(notification definition Request is Approved or Denied
table)

Recipients                              requestor, request coordinator,
                                        assignee

Subject                                 Request %s (hyper link of request
                                        number) is {$approval.status}.

Format                                  Service Manager
                                        Request %s (hyper link of request
                                        number) is {$approval.status}.
                                        Details
                                        Title (or Description):
                                        Category:
                                        Subcategory:
                                        Request Model:
                                        Status:
                                        Priority:
                                        Sent from Service Manager. Do not
                                        reply to this email.

Request Escalation


Status                                  All

Rule Set                                Notification is triggered when the
                                        “Escalated” flag is selected and the
                                        “Escalation Manager” is specified.

Notification name(notification definition Request Escalation
table)

Recipients                              Request Manager, Assignee or
                                        members of Assignment Group if
                                        Assignee is null

Subject                                 Request %s (hyper link of request
                                        number) has been escalated.

Format                                  Service Manager
                                        Request %s (hyper link of request
                                        number) has been escalated.
                                        Details
                                        Title (or Description):
                                        Category:
                                        Subcategory:
                                        Request Model:
                                        Status:
                                        Priority:
                                        Sent from Service Manager. Do not
                                        reply to this email.

Request Suspension


Status                                  Suspended

Rule Set                                Notification is triggered when Request
                                        status is “Suspended”

Notification name(notification definition Request Suspension
table)

Recipients                              requestor, request coordinator,
                                        assignee

Subject                                 Request %s (hyper link of request
                                        number) is suspended. The request
                                        may be unsuspended manually before
                                        the suspension duration ends.

Format                                  Service Manager

                                        Request %s (hyper link of request
                                        number) is suspended. The request
                                        may be unsuspended manually before
                                        the suspension duration ends.

                                        Details

                                        Title (or Description):

                                        Category:

                                        Subcategory:

                                        Request Model:

                                        Status:

                                        Priority:

                                        Sent from Service Manager. Do not
                                        reply to this email.

Request Unsuspension


Status                                  All except “Suspended”

Rule Set                                Notification is triggered when Request
                                        status is changed from “Suspended” to
                                        previous status

Notification name(notification definition Request Unsuspension
table)

Recipients                              requestor, request coordinator,
                                        assignee

Subject                                 Request %s (hyper link of request
                                        number) is unsuspended. Now the
                                        status moves to {$status}.

Format                                  Service Manager

                                        Request %s (hyper link of request
                                        number) is unsuspended. Now the
                                        status moves to {$status}.
                                        Details

                                        Title (or Description):

                                        Category:

                                        Subcategory:

                                        Request Model:
                                        Status:

                                        Priority:

                                        Sent from Service Manager. Do not
                                        reply to this email.

Request Pending Customer


Status                                  Pending Customer

Rule Set                                Notification is triggered when Request
                                        status is “Pending Customer”

Notification name(notification definition Request Pending Customer
table)

Recipients                              requestor, request coordinator

Subject                                 Request %s (hyper link of request
                                        number) is pending customer’s input.
                                        Please contact customer to get
                                        required information.

Format                                  Service Manager

                                        Request %s (hyper link of request
                                        number) is pending customer’s input.
                                        Please contact customer to get
                                        required information.

                                        Details

                                        Title (or Description):

                                        Category:

                                        Subcategory:

                                        Request Model:

                                        Status:

                                        Priority:

                                        Sent from Service Manager. Do not
                                        reply to this email.

Request Resolution


Status                                  Resolved

Rule Set                                Notification is triggered when Request
                                        status is “Resolved”

Notification name(notification definition Request Resolution
table)

Recipients                              requestor, request coordinator

Subject                                 Request %s (hyper link of request
                                        number) has been resolved.

Format                                  Service Manager
                                        Request %s (hyper link of request
                                        number) has been resolved.
                                        Details
                                        Title (or Description):
                                        Category:
                                        Subcategory:
                                        Request Model:
                                        Status:
                                        Priority:
                                        Sent from Service Manager. Do not
                                        reply to this email.

Request Withdrawal


Status                                  Closed

Rule Set                                Notification is triggered when Request
                                        status is “Closed” and closure code is
                                        “Withdrawal requested by customer”

Notification name(notification definition Request Withdrawal
table)

Recipients                              requestor, request coordinator,
                                        assignee

Subject                                 Request %s (hyper link of request
                                        number) has been withdrawn by
                                        customer.

Format                                  Service Manager
                                        Details
                                        Title (or Description):
                                        Category:
                                        Subcategory:
                                        Request Model:
                                        Status:
                                        Priority:
                                        Sent from Service Manager. Do not
                                        reply to this email.

Request Closure


Status                                  Closed

Rule Set                                Notification is triggered when Request
                                        status is “Closed” and closure code is
                                        not “Withdrawal requested by
                                        customer”

Notification name(notification definition Request Closure
table)

Recipients                              requestor, request coordinator,
                                        assignee

Subject                                 Request %s (hyper link of request
                                        number) has been closed. The closure
                                        code is {$closure.code}.

Format                                  Service Manager
                                        Request %s (hyper link of request
                                        number) has been closed. The closure
                                        code is {$closure.code}.
                                        Details
                                        Title (or Description):
                                        Category:
                                        Subcategory:
                                        Request Model:
                                        Status:
                                        Priority:
                                        Closure Comments:
                                        Sent from Service Manager. Do not
                                        reply to this email.

Request Reopen


Status                                  Fulfilled

Rule Set                                Notification is triggered when the
                                        request is re-opened.

Notification name(notification definition Request Re-open
table)

Recipients                              Requestor, Request Coordinator,
                                        members of Assignment Group if
                                        Assignee is null, otherwise Assignee

Subject                                 Request %s (hyper link of request
                                        number) has been re-opened.

Format                                  Service Manager
                                        Request %s (hyper link of request
                                        number) has been re-opened.
                                        Details
                                        Title (or Description):
                                        Category:
                                        Subcategory:
                                        Request Model:
                                        Status:
                                        Priority:
                                        Sent from Service Manager. Do not
                                        reply to this email.

Contents

     1 Off-catalog Request Creation
     2 Assignment Group
     3 Assignee
     4 Request Pending Approval
     5 Request is Approved or Denied


6 Request Escalation
7 Request Suspension
8 Request Unsuspension
9 Request Pending Customer
10 Request Resolution
11 Request Withdrawal
12 Request Closure
13 Request Reopen


1.11.7.9.6. Request Task Notifications

The following out-of-box Request Task Notifications are provided in the Request
Fulfillment module.

Assignment Group

Status                                  All

Rule Set                                Notification is triggered when
                                        assignment group is populated but
                                        assignee is empty

Notification name(notification definition Request Task Assignment
table)

Recipients                              members of the assignment group

Subject                                 Request task %s (hyper link of request
                                        task number) has been assigned to you
                                        or your group.

Format                                  Service Manager

                                        Request task %s (hyper link of request
                                        task number) has been assigned to you
                                        or your group.

                                        Details

                                        Title (or Description):
                                        Category:

                                        Status:

                                        Priority:

                                        Sent from Service Manager. Do not
                                        reply to this email.

Assignee


Status                                  All

Rule Set                                Notification is triggered when assignee
                                        is populated

Notification name(notification definition Request Assignment
table)

Recipients                              assignee

Subject                                 Request task %s (hyper link of request
                                        task number) has been assigned to you
                                        or your group.

Format                                  Service Manager

                                        Request task %s (hyper link of request
                                        task number) has been assigned to you
                                        or your group.

                                        Details

                                        Title (or Description):

                                        Category:

                                        Status:

                                        Priority:

                                        Sent from Service Manager. Do not
                                        reply to this email.

Cancellation

 Status                                                                                         Service Manager 9.81
 Rule Set
 Notification name (notification        Cancelled
 definition table)
 Recipients                             Notification is triggered when request
 Subject                                task status is “Cancelled”
 Format
                                        Request Task Cancellation
Closure
                                        assignee

                                        Request task %s (hyper link of request
                                        task number) has been cancelled.

                                        Service Manager
                                        Request task %s (hyper link of request
                                        task number) has been cancelled.
                                        Details
                                        Title (or Description):
                                        Category:
                                        Status:
                                        Priority:
                                        Sent from Service Manager. Do not
                                        reply to this email.

 Status                                                                                         Service Manager 9.81
 Rule Set
 Notification name (notification        Closed
 definition table)                      Notification is triggered when request
 Recipients                             task status is “Closed”
 Subject                                Request Task Closure
 Format
                                        assignee
Contents                                Request task %s (hyper link of request
                                        task number) has been closed. The
     1 Assignment Group                 closure code is {$closure.code}.

This PDF was generated on May 23, 2026  Service Manager
                                        Request task %s (hyper link of request
                                        task number) has been closed. The
                                        closure code is {$closure.code}.
                                        Details
                                        Title (or Description):
                                        Category:
                                        Status:
                                        Priority:
                                        Closure Comments:
                                        Task output data
                                        <Task output data, e.g. CI information
                                        will be provided when ordering task is
                                        closed>
                                        Sent from Service Manager. Do not
                                        reply to this email.

                                                                                                                        Page 226 of 384

2 Assignee
3 Cancellation
4 Closure
````
