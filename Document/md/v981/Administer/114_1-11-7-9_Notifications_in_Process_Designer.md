---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.11.7.9 .. 1.11.7.9.3
printed_pages: 2835-2870
---

# 1.11.7.9 Notifications in Process Designer

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.11.7.9. Notifications in Process Designer

Process Designer includes the following notifications which are sent in response to
certain events.
Interaction Notifications
Incident Notifications
Problem Notifications
Incident Task and Problem Task Notifications
Request Notifications
Request Task Notifications


1.11.7.9.1. Interaction Notifications

The following Interaction Notifications are present in Process Designer.

New Interaction

Status                                  Open
Rule Set
                                        Notification is triggered when an
Recipients                              interaction is created
Subject
                                        Contact, Service Recipient
Format
                                        Interaction %S (Interaction number)
                                        has been created.

                                        Service Manager
                                        Interaction %s (hyper link of interaction
                                        number) has been created.
                                        Details
                                        Description:
                                        Status:
                                        Sent from Service Manager. Do not
                                        reply to this email.

Cancellation

 Status                                                                                         Service Manager 9.81
 Rule Set
 Recipients                             Canceled
 Subject
 Format                                 Notification is triggered when the
                                        status is changed to "Canceled"
Closure
                                        Contact, Service Recipient, Assignee
                                        (for complaint or compliment)

                                        Interaction %S (Interaction number)
                                        has been canceled.

                                        Service Manager
                                        Interaction %s (hyper link of interaction
                                        number) has been canceled.
                                        Details
                                        Description:
                                        Status:
                                        Sent from Service Manager. Do not
                                        reply to this email.

 Status                                                                                         Service Manager 9.81
 Rule Set
 Recipients                             Closed
 Subject
 Format                                 Notification is triggered when
                                        interaction status is changed to
Pending Approval                        "Closed"

                                        Contact, Service Recipient, Assignee
                                        (for complaint or compliment)

                                        Interaction %S (Interaction number)
                                        has been closed.

                                        Service Manager
                                        Interaction %s (hyper link of interaction
                                        number) has been closed.
                                        Details
                                        Description:
                                        Status:
                                        Sent from Service Manager. Do not
                                        reply to this email.

 Status                                                                                         Service Manager 9.81
 Rule Set
 Recipients                             Pending
 Subject
 Format                                 Notification is triggered when the
                                        approval status of a service catalog
Approved or Denied                      request is “pending”

                                        Approver

                                        Interaction %S (Interaction number) is
                                        pending on your approval.

                                        Service Manager
                                        Interaction %s (hyper link of interaction
                                        number) is pending on your approval.
                                        Details
                                        Description:
                                        Status:
                                        Sent from Service Manager. Do not
                                        reply to this email.

 Status                                                                                         Service Manager 9.81
 Rule Set
                                        Approved or denied
 Recipients
 Subject                                Notification is triggered when the
 Format                                 approval status of a service catalog
                                        request is changed from "pending" to
Contents                                "approved" or "denied"

     1 New Interaction                  Contact, Service Recipient
     2 Cancellation
     3 Closure                          Interaction %S (Interaction number)
     4 Pending Approval                 has been %S (Approval status).
     5 Approved or Denied
                                        Service Manager
                                        Interaction %s (hyper link of interaction
                                        number) has been {$approval.status}.
                                        Details
                                        Description:
                                        Status:
                                        Sent from Service Manager. Do not
                                        reply to this email.


1.11.7.9.2. Incident Notifications

The following Incident Notifications are present in Process Designer.

Assignment Group


Status                                  All

Rule Set                                Notification is triggered when only
                                        Assignment group is populated or
                                        updated and Assignee field is Blank

Notification name(notification definition Incident Assignment
table)

Recipients                              Assignment Group members

Subject                                 Incident %S (Incident number) has
                                        been Assigned to you

 Format                                                                                         Service Manager 9.81

Assignee                                NOTE: SYSTEM GENERATED EMAIL,
                                        PLEASE DO NOT REPLY. FOR MORE
                                        INFORMATION REFER TO THE
                                        INCIDENT RECORD IN THE SYSTEM.
                                        Dear Sir/Madam,
                                        Incident %S (Incident number) is
                                        assigned to %S (assignment group
                                        name) Group. Identify an assignee to
                                        work on the Incident.
                                        Incident details are as follows:
                                        Title:
                                        Status:
                                        Category:
                                        Subcategory:
                                        Priority:
                                        Description:
                                        Click here to go to the Incident Record
                                        (provide the link to Incident record)
                                        Thanks and regards,
                                        Service Manager


Status                                  All

Rule Set                                Notification is triggered when Assignee
                                        field populated or updated

Notification name(notification definition Incident Assignment
table)

Recipients                              Incident Assignee

Subject                                 Incident %S (Incident number) has
                                        been Assigned to you

Format                                  NOTE: SYSTEM GENERATED EMAIL,
                                        PLEASE DO NOT REPLY. FOR MORE
                                        INFORMATION REFER TO THE
                                        INCIDENT RECORD IN THE SYSTEM.

                                        Dear Sir/Madam,
                                        Incident %S (Incident number) is
                                        Assigned to you

                                        Incident details are as follows:

                                        Title:

                                        Status:

                                        Category:

                                        Subcategory:

                                        Priority:

                                        Description:

                                        Click here to go to the Incident Record
                                        (provide the link to Incident record)

                                        Thanks and regards,

                                        Service Manager

Major Incident Arrival


Status                                  All

Rule Set                                Notification is triggered when Major
                                        Incident checkbox is checked and
                                        saved

Notification name(notification definition Major Incident Created
table)

Recipients                              Incident Manager

Subject                                 Major Incident %S (Incident number)
                                        has been created

Format                                  NOTE: SYSTEM GENERATED EMAIL,
                                        PLEASE DO NOT REPLY. FOR MORE
                                        INFORMATION REFER TO THE
                                        INCIDENT RECORD IN THE SYSTEM.

                                        Dear Sir/Madam,

                                        Major Incident %S (Incident number)
                                        has been created

                                        Incident details are as follows:

                                        Title:

                                        Status:

                                        Category:
                                        Subcategory:

                                        Priority:

                                        Description:

                                        Click here to go to the Incident Record
                                        (provide the link to Incident record)

                                        Thanks and regards,
                                        Service Manager


Escalation


Status                                  All

Rule Set                                Notification is triggered when
                                        Escalation checkbox is checked and
                                        saved

Notification name(notification definition Escalated Incident
table)

Recipients                              Incident Manager, Incident Assignee

Subject                                 Incident %S (Incident number) has
                                        been escalated

Format                                  NOTE: SYSTEM GENERATED EMAIL,
                                        PLEASE DO NOT REPLY. FOR MORE
                                        INFORMATION REFER TO THE
                                        INCIDENT RECORD IN THE SYSTEM.

                                        Dear Sir/Madam,
                                        Incident %S (Incident number) has
                                        been escalated

                                        Incident details are as follows:

                                        Title:

                                        Status:

                                        Category:

                                        Subcategory:

                                        Priority:

                                        Description:

                                        Click here to go to the Incident Record
                                        (provide the link to Incident record)

                                        Thanks and regards,
                                        Service Manager


Pending with Customer

Status                                  Pending Customer

Rule Set                                Notification is triggered when the
                                        status of the record is changed to
                                        “Pending Customer”

Notification name(notification definition Incident pending customer
table)

Recipients                              Requestor

Subject                                 Incident %S (Incident Number) pending
                                        for Requestor Input

Format                                  NOTE: SYSTEM GENERATED EMAIL,
                                        PLEASE DO NOT REPLY. FOR MORE
                                        INFORMATION REFER TO THE
                                        INCIDENT RECORD IN THE SYSTEM.

                                        Dear Sir/Madam,

                                        The Incident %S (Incident number) is
                                        pending for your inputs. Please find the
                                        reason below and provide necessary
                                        input to enable resolution

                                        Title:

                                        Priority:

                                        Description:

                                        Click here to go to the Incident Record
                                        (provide the link to Incident record)

                                        Thanks and regards,

                                        Service Manager

Suspension


Status                                  Suspended

Rule Set                                Notification is triggered when the
                                        status of the record is changed to
                                        “Suspended”

Notification name(notification definition Incident suspended
table)

Recipients                              Requestor, Incident Coordinator,
                                        Incident Assignee

Subject                                 Incident %S (Incident Number) has
                                        been Suspended

Format                                  NOTE: SYSTEM GENERATED EMAIL,
                                        PLEASE DO NOT REPLY. FOR MORE
                                        INFORMATION REFER TO THE
                                        INCIDENT RECORD IN THE SYSTEM.

                                        Dear Sir/Madam,

                                        The Incident %S (Incident number) is
                                        suspended. Please find the reason and
                                        duration of suspension.

                                        The Incident may be unsuspended
                                        manually before the suspension
                                        duration ends.

                                        Title:

                                        Description:

                                        Click here to go to the Incident Record
                                        (provide the link to Incident record)

                                        Thanks and regards,

                                        Service Manager

Un-suspension


Status                                  Any status other than Suspended

Rule Set                                Notification is triggered when the
                                        status of the record is changed from
                                        “Suspended” to previous status

Notification name(notification definition Incident Unsuspended
table)

Recipients                              Requestor, Incident Coordinator,
                                        Incident Assignee

Subject                                 Incident %S (Incident Number) has
                                        been Resumed

Format                                  NOTE: SYSTEM GENERATED EMAIL,
                                        PLEASE DO NOT REPLY. FOR MORE
                                        INFORMATION REFER TO THE
                                        INCIDENT RECORD IN THE SYSTEM.

                                        Dear Sir/Madam,

                                        The Incident %S (Incident number) is
                                        now unsuspended. The status has
                                        been moved to %S (status).

                                        Title:

                                        Description:

                                        Status:

                                        Click here to go to the Incident Record
                                        (provide the link to Incident record)

                                        Thanks and regards,

                                        Service Manager

Recovery


Status                                  Status other than Resolved

Rule Set                                Notification is triggered when Phase is
                                        moved to Recovery

Notification name(notification definition Incident Recovery
table)

Recipients                              Incident Coordinator

Subject                                 Incident %S (Incident number) has
                                        moved to Recovery phase

Format                                  NOTE: SYSTEM GENERATED EMAIL,
                                        PLEASE DO NOT REPLY. FOR MORE
                                        INFORMATION REFER TO THE
                                        INCIDENT RECORD IN THE SYSTEM.

                                        Dear Sir/Madam,

                                        The Incident %S (Incident number) has
                                        been moved to Recovery Phase.

                                        Incident details are as follows:

                                        Title:

                                        Status:

                                        Description:

                                        Solution:

                                        Thanks and regards,

                                        Service Manager

Resolution


Status                                  Resolved

Rule Set                                Notification is triggered when Status is
                                        Resolved

Notification name(notification definition Incident Resolution
table)

Recipients                              To: Requestor
                                        cc: Incident Coordinator

Subject                                 Incident %S (Incident number) has
Format                                  been Resolved

                                        NOTE: SYSTEM GENERATED EMAIL,
                                        PLEASE DO NOT REPLY. FOR MORE
                                        INFORMATION REFER TO THE
                                        INCIDENT RECORD IN THE SYSTEM.

                                        Dear Sir/Madam,

                                        Incident %S (Incident number) is
                                        Resolved. Please verify the resolution
                                        and update the Incident record.

                                        Incident details are as follows:
                                        Title:

                                        Status:

                                        Description:

                                        Solution:

                                        Click here to go to the Incident Record
                                        (provide the link to Incident record)
                                        Thanks and regards,

                                        Service Manager


Closure


Status                                  Closed

Rule Set                                Notification is triggered when Status is
                                        closed

Notification name(notification definition Incident Closure
table)

Recipients                              Incident Assignee, Requestor

Subject                                 Incident %S (Incident number) has
                                        been Closed

Format                                  NOTE: SYSTEM GENERATED EMAIL,
                                        PLEASE DO NOT REPLY. FOR MORE
                                        INFORMATION REFER TO THE
                                        INCIDENT RECORD IN THE SYSTEM.

                                        Dear Sir/Madam,
                                        Incident %S (Incident number) is
                                        Closed

                                        Incident details are as follows:

                                        Title:

                                        Status:

                                        Category:
                                        Subcategory:

                                        Priority:

                                        Description:

                                        Closure Code:

                                        Click here to go to the Incident Record
                                        (provide the link to Incident record)
                                        Thanks and regards,

                                        Service Manager



1.11.7.9.3. Problem Notifications

The following Problem Notifications are present in Process Designer.

New Problem


Status                                  Categorize

Rule Set                                Notification is triggered when a new
                                        problem record is created and saved

Notification name(notification definition Problem record created
table)

Recipients                              Problem Manager, Problem Coordinator

Subject                                 Problem record %S (Problem number)
                                        has been created

Format                                  NOTE: SYSTEM GENERATED EMAIL,
                                        PLEASE DO NOT REPLY. FOR MORE
                                        INFORMATION REFER TO THE
                                        PROBLEM RECORD IN THE SYSTEM.

                                        Dear Sir/Madam,

                                        A Problem record %S (Problem
                                        number) has been created

                                        Problem details are as follows:

                                        Title:

                                        Category:

                                        Description:

                                        Priority:

                                        Click here to go to the Problem record
                                        (provide the link to Problem record)

                                        Thanks and regards,

                                        Service Manager

Known Error Created


Status                                  All

Rule Set                                Notification is triggered when Known
                                        Error checkbox is checked

Notification name(notification definition KE created
table)

Recipients                              To: Problem Manager, Problem
                                        Coordinator, Assignee, Requestor
                                        (Opened By)

Subject                                 Known Error %S (Problem number) has
                                        been created

Format                                  NOTE: SYSTEM GENERATED EMAIL,
                                        PLEASE DO NOT REPLY. FOR MORE
                                        INFORMATION REFER TO THE
                                        PROBLEM RECORD IN THE SYSTEM.

                                        Dear Sir/Madam,

                                        A Known Error record %S (Problem
                                        number) has been created

                                        Known Error details are as follows:

                                        Title:

                                        Category:

                                        Description:

                                        Root Cause:

                                        Workaround:

                                        Click here to go to the Known Error
                                        record (provide the link to Problem
                                        record)

                                        Thanks and regards,

                                        Service Manager


Assignment Group


Status                                  All

Rule Set                                Notification is triggered when only
                                        Assignment Group is populated or
                                        updated and Assignee field is blank

Notification name(notification definition Problem Assignment
table)

Recipients                              Assignment Group members

Subject                                 Problem %S (Problem number) has
                                        been assigned to you

 Format                                                                                         Service Manager 9.81

Assignee                                NOTE: SYSTEM GENERATED EMAIL,
                                        PLEASE DO NOT REPLY. FOR MORE
                                        INFORMATION REFER TO THE
                                        PROBLEM RECORD IN THE SYSTEM.
                                        Dear Sir/Madam,
                                        Problem %S (Problem number) is
                                        assigned to %S (Assignment Group
                                        name) Group. Identify an assignee to
                                        work on the Problem.
                                        Problem details are as follows:
                                        Title:
                                        Phase:
                                        Category:
                                        Subcategory:
                                        Priority:
                                        Description:
                                        Click here to go to the Problem record
                                        (provide the link to Problem record)
                                        Thanks and regards,
                                        Service Manager


Status                                  All

Rule Set                                Notification is triggered when Assignee
                                        field populated or updated

Notification name(notification definition Problem Assignment
table)

Recipients                              Problem Assignee

Subject                                 Problem %S (Problem number) has
                                        been assigned to you

Format                                  NOTE: SYSTEM GENERATED EMAIL,
                                        PLEASE DO NOT REPLY. FOR MORE
                                        INFORMATION REFER TO THE
                                        PROBLEM RECORD IN THE SYSTEM.

                                        Dear Sir/Madam,
                                        Problem %S (Problem number) is
                                        assigned to you

                                        Problem details are as follows:

                                        Title:

                                        Phase:

                                        Category:
                                        Subcategory:

                                        Priority:

                                        Description:

                                        Click here to go to the Problem record
                                        (provide the link to Problem record)

                                        Thanks and regards,

                                        Service Manager

Workaround Found


Status                                  All

Rule Set                                Notification is triggered when
                                        Workaround field is populated

Notification name(notification definition Workaround Identified
table)

Recipients                              To: Problem Coordinator, Requestor
                                        (Opened By)

Subject                                 Workaround has been identified for
                                        Problem %S (Problem number)

Format                                  NOTE: SYSTEM GENERATED EMAIL,
                                        PLEASE DO NOT REPLY. FOR MORE
                                        INFORMATION REFER TO THE
                                        PROBLEM RECORD IN THE SYSTEM.

                                        Dear Sir/Madam,

                                        Workaround has been identified for the
                                        Problem %S (Problem number).

                                        Problem and Workaround details are as
                                        follows:

                                        Title:

                                        Category:

                                        Description:

                                        Root Cause:

                                        Workaround:

                                        Click here to go to the Problem record
                                        (provide the link to Problem record)

                                        Thanks and regards,

                                        Service Manager


Root Cause Found

Status                                  All

Rule Set                                Notification is triggered when Root
                                        Cause field is populated

Notification name(notification definition Root Cause Identified
table)

Recipients                              To: Problem Coordinator, Requestor
                                        (Opened By)

Subject                                 Root Cause has been identified for
                                        Problem %S (Problem number)

Format                                  NOTE: SYSTEM GENERATED EMAIL,
                                        PLEASE DO NOT REPLY. FOR MORE
                                        INFORMATION REFER TO THE
                                        PROBLEM RECORD IN THE SYSTEM.

                                        Dear Sir/Madam,

                                        Root Cause has been identified for the
                                        Problem %S (Problem number).

                                        Problem and Root Cause details are as
                                        follows:

                                        Title:

                                        Category:

                                        Description:

                                        Root Cause:

                                        Click here to go to the Problem record
                                        (provide the link to Problem record)

                                        Thanks and regards,

                                        Service Manager


Resolution


Status                                  Resolved

Rule Set                                Notification is triggered when the
                                        status is moved to Resolved

Notification name(notification definition Problem Resolution
table)

Recipients                              To: Problem Coordinator, Requestor
                                        (Opened By)

Subject                                 Problem %S (Problem number) is
                                        resolved

Format                                  NOTE: SYSTEM GENERATED EMAIL,
                                        PLEASE DO NOT REPLY. FOR MORE
                                        INFORMATION REFER TO THE
                                        PROBLEM RECORD IN THE SYSTEM.

                                        Dear Sir/Madam,

                                        The Problem %S (Problem number) has
                                        been resolved. Kindly verify the same
                                        to confirm.

                                        Problem details are as follows:

                                        Title:

                                        Category:

                                        Description:

                                        Root Cause:

                                        Solution:

                                        Click here to go to the Problem record
                                        (provide the link to Problem record)

                                        Thanks and regards,

                                        Service Manager


Abandonment

Status                                  Abandoned

Rule Set                                Notification is triggered when the
                                        status is moved to Abandoned

Notification name(notification definition Problem Abandonment
table)

Recipients                              Problem Coordinator, Requestor
                                        (Opened By)

Subject                                 Problem %S (Problem number) is
                                        abandoned

Format                                  NOTE: SYSTEM GENERATED EMAIL,
                                        PLEASE DO NOT REPLY. FOR MORE
                                        INFORMATION REFER TO THE
                                        PROBLEM RECORD IN THE SYSTEM.

                                        Dear Sir/Madam,

                                        The Problem %S (Problem number) has
                                        been abandoned.

                                        Problem details are as follows:

                                        Title:

                                        Category:

                                        Phase:

                                        Description:

                                        Click here to go to the Problem record
                                        (provide the link to Problem record)

                                        Thanks and regards,

                                        Service Manager

Deferred


Status                                  Deferred

Rule Set                                Notification is triggered when the
                                        status is moved to Deferred

Notification name(notification definition Problem Deferral
table)

Recipients                              Problem Coordinator, Requestor
                                        (Opened By)

Subject                                 Problem %S (Problem number) is
                                        deferred

Format                                  NOTE: SYSTEM GENERATED EMAIL,
                                        PLEASE DO NOT REPLY. FOR MORE
                                        INFORMATION REFER TO THE
                                        PROBLEM RECORD IN THE SYSTEM.

                                        Dear Sir/Madam,

                                        The Problem %S (Problem number) has
                                        been deferred.

                                        Problem details are as follows:

                                        Title:

                                        Category:

                                        Phase:

                                        Description:

                                        Click here to go to the Problem record
                                        (provide the link to Problem record)

                                        Thanks and regards,

                                        Service Manager

Closure


Status                                  Closed

Rule Set                                Notification is triggered when the
                                        status is moved to Closed

Notification name(notification definition Problem Closure
table)

Recipients                              Problem Coordinator, Requestor

Subject                                 Problem %S (Problem number) is
                                        closed

Format                                  NOTE: SYSTEM GENERATED EMAIL,
                                        PLEASE DO NOT REPLY. FOR MORE
                                        INFORMATION REFER TO THE
                                        PROBLEM RECORD IN THE SYSTEM.

                                        Dear Sir/Madam,

                                        The Problem %S (Problem number) has
                                        been Closed.

                                        Problem details are as follows:

                                        Title:

                                        Category:

                                        Description:

                                        Solution:

                                        Closure Code:

                                        Click here to go to the Problem record
                                        (provide the link to Problem record)

                                        Thanks and regards,

                                        Service Manager
````
