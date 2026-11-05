---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.9.21 .. 1.9.21
printed_pages: 2759-2796
---

# 1.9.21 Request Fulfillment details

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.9.21. Request Fulfillment details

Service Manager uses the Request Fulfillment application to enable the Request
Fulfillment process. The main function of Request Fulfillment is to standardize the
methods and processes a business organization uses to log, approve, validate,
monitor, and escalate service requests as necessary.

This section describes selected Request Fulfillment fields in the out-of-box Service
Manager system. Topics in this section include:

     Request Fulfillment process flow
     Request Fulfillment forms
     Request Fulfillment form details
     Request task forms
     Request task form details


1.9.21.1. Request Fulfillment process flow

The Request Fulfillment process flow in Service Manager is as follows.
Generic Request workflow
This workflow addresses the request fulfillment process. Its associated request
category is “Generic Request.”

Order workflow
The order workflow is used for purchase and stock management in Request
Fulfillment application. Its associated request category is “Order.”

Request task workflows
The following is the request task workflow without CMDB update. Its associated
request task category is “Labor.”

The following is the request task workflow with CMDB update. Its associated request
task categories are “Purchase,” “Reservation,” “Installation,” and “Uninstallation.”


The following is the request task workflow for automation (OO flow execution). Its
associated request task category is “Automation.”


1.9.21.2. Request Fulfillment forms

Generic Request forms
The following figure shows the open request form that associated with the generic
request workflow.

The following figure shows the closed request form that associated with the generic
request workflow.


Order forms

The following figure shows the open order form that associated with the order
workflow.


The following figure shows the closed order form that associated with the order
workflow.



1.9.21.3. Request Fulfillment form details

The following table identifies and describes some of the features on the Request
Fulfillment form.

Label                                                                                                                           Service Manager 9.81
Request ID
Title                                   Request/Order field descriptions

Description                                            Description
Category
                                                       The system-generated unique ID for
                                                       this request/order.

                                                       A short description that summarizes
                                                       the request/order. It is a mandatory
                                                       field.

                                                       A detailed description of the
                                                       request/order. It is a mandatory field.

                                                       This field describes the type of Service
                                                       Request. In out-of-box, the following
                                                       categories are available:

                                                            Generic Request
                                                            Order

Label                                                                                           Service Manager 9.81
Subcategory
                                        Description
Request Model
                                        Specifies the second level of
                                        classifying a Service Request. In out-
                                        of-box, the following subcategories are
                                        available for the “Generic Request”
                                        category :

                                             Employee Off-boarding
                                             Employee On-boarding
                                             Hardware
                                             Others
                                             Request for Administration
                                             Request for Access
                                             Request for Information
                                             Software

                                        In out-of-box, the following
                                        subcategory is available for the “Order”
                                        category:

                                             Order

                                        A Request Model is a record that's
                                        used to predefine the contents of a
                                        specific type of Service Request,
                                        including the information used to
                                        populate the request/order and the
                                        tasks that are needed to complete the
                                        request/order.

                                        When you open a request/order using a
                                        Request Model, basic information is
                                        added to the request/order
                                        automatically.

Label                                                                                           Service Manager 9.81
Phase
                                        Description

                                        This is a system-generated field that
                                        specifies the name of the current
                                        phase of the request/order. The
                                        following phases are available in out-
                                        of-box “Generic Request” workflow:

                                             Logging
                                             Authorization
                                             Fulfillment
                                             Review
                                             Closure

                                        The following phases are available in
                                        out-of-box "Order" workflow:

                                             Order
                                             Closure

Label                                                                                           Service Manager 9.81
Status
                                        Description

                                        Displays the status of the
                                        request/order. The following statuses
                                        are available in out-of-box “Generic
                                        Request” workflow:

                                             Open - Request is logged and
                                             waiting for authorization.
                                             In Progress - Request is being
                                             fulfilled.
                                             Pending Customer - Additional
                                             information is required from
                                             user/requester.
                                             Suspended - Fulfillment activities
                                             for the request have been
                                             suspended for a pre-defined time
                                             period.
                                             Fulfilled - Request is fulfilled and
                                             being reviewed.
                                             Closed - Request is closed.

                                        The following statuses are available in
                                        out-of-box "Order" workflow:

                                             Ordering - Order is being handled.
                                             Closed - Order is closed.

 Label                                                                                          Service Manager 9.81
 Approval Status
                                        Description
 Requester
 Requested For                          Defines the approval status for the
 Delivery Date                          request/order. The system sets this
 Expected Finish Date                   field depending on current approvals
                                        and the approval type defined for the
This PDF was generated on May 23, 2026  record.

                                        These approval statuses are available
                                        out-of-box:

                                             pending
                                             approved
                                             denied

                                        The name of the person who submits
                                        the Service Request. It is a mandatory
                                        field.

                                        The name of the user for whom the
                                        requester submits this request/order.

                                        Indicates the target fulfillment time of
                                        request. It equals request creation time
                                        plus “Global Lead Time.”

                                        Indicates the expected finish date of
                                        request from user/requester
                                        perspective. If Delivery Target is
                                        selected when ordering is made from
                                        Service Catalog, the field value will be
                                        calculated by request creation time
                                        plus Delivery Target. If Delivery Target
                                        is unavailable for the request, the field
                                        value will leave blank when request is
                                        logged. In this case, Request
                                        Coordinator will manually input the
                                        expected date on behalf of
                                        user/requester. It is a mandatory field.

                                                                                                                        Page 154 of 387
Label                                                                                           Service Manager 9.81
Assignment Group
                                        Description
Assignee
                                        The support group assigned to work on
Request Coordinator                     this request/order. This field can be
                                        prepopulated by the data defined in
Global Lead Time                        assignment rule or manually set by
                                        Request Coordinator. It is a mandatory
                                        field.

                                        The person assigned to work on this
                                        request/order. This person is a member
                                        of the assignment group. This field can
                                        be prepopulated by the data defined in
                                        assignment rule or manually set by
                                        Request Coordinator.

                                        The name of the person responsible for
                                        coordinating the implementation of the
                                        request/order. Each Coordinator may
                                        belong to several assignment groups.
                                        Each group can have just one Request
                                        Coordinator.

                                        This field is the sum of the longest
                                        “Planned Lead Time” of all request
                                        tasks based on task plan definition in
                                        Request Model. It is read-only and
                                        copied from Request Model. The out-
                                        of-box request fulfillment SLT is
                                        measured based on the value of this
                                        field.

Label                                                                                           Service Manager 9.81
Impact
                                        Description
Urgency
                                        A measure of the effect of the
Priority                                request/order on business processes.
                                        Impact and urgency are used to assign
                                        priority. It is a mandatory field.

                                        These impacts are available out-of-
                                        box:

                                             Enterprise
                                             Site/Dept
                                             Multiple Users
                                             User

                                        A measure of how long it will be until a
                                        request/order has a significant impact
                                        on the business. Impact and urgency
                                        are used to assign priority. It is a
                                        mandatory field.

                                        These urgencies are available out-of-
                                        box:

                                             Critical
                                             High
                                             Average
                                             Low

                                        The order in which to address the
                                        request/order in comparison to others.
                                        The priority value is calculated using
                                        impact and urgency.

 Label                                                                                          Service Manager 9.81
 Reason
                                        Description
 Ship To Location
 Affected Service                       Select the reason for requesting the
 Affected CI                            request/order:
 Bill To Location
 Bill To Department                          Conversion
                                             Customer Request
 Project ID                                  Legal
                                             Maintenance
This PDF was generated on May 23, 2026       New
                                             Problem Resolution

                                        The destination location the requested
                                        items should be shipped to.

                                        Specifies the service that's affected by
                                        the request/order.

                                        Specifies the CI that's affected by the
                                        request/order. Affected CI is one of the
                                        children of affected service.

                                        The location where the invoice should
                                        be mailed for the items shipped.
                                        Available locations are defined in
                                        System Administration > Base System
                                        Configuration > Locations.

                                        The department where the invoice
                                        should be sent for the items shipped.
                                        The departments available for selection
                                        are defined in System Administration >
                                        Base System Configuration >
                                        Departments.

                                        The identification number given to the
                                        project.

                                                                                                                        Page 157 of 387

Label                                   Description
Escalated
Request Manager                         If selected (set to true), this field
                                        indicates that the request needs to be
Source                                  escalated to Request Manager.

                                        This field is only visible when
                                        “Escalated” is selected. It indicates the
                                        person who will handle the request
                                        escalation.

                                        The source from which the record is
                                        created.

                                        The following out-of-box sources are
                                        available:

                                             1 - User
                                             2 - Group
                                             3 - Event
                                             4 - Chat
                                             5 - Email
                                             6 - Telephone

Cost > Total Cost                       Total cost incurred by fulfillment
                                        activities, including cost of part items
Cost > Currency                         and labor cost.
Cost > Date/Technician/Hours Worked
                                        Specifies the currency of the total cost.

                                        The table specifies when and who will
                                        work on the request/order for how
                                        many hours. The labor cost is
                                        calculated based on the hourly rate of
                                        the technician and the hours that
                                        he/she worked.

Label                                                                                           Service Manager 9.81
Summary > Closure Code
                                        Description
Summary > Closure Comments
Workflow section                        Specifies a predefined closure code to
                                        describe how the request/order has
                                        been fulfilled.

                                        These closure codes are available out-
                                        of-box:

                                             Successful
                                             Successful (with problems)
                                             Failed
                                             Rejected (financial)
                                             Rejected (technical)
                                             Rejected (security)
                                             Withdrawn
                                             Withdrawal requested by
                                             customer
                                             Cancelled
                                             Denied request fulfillment

                                        This field is to document additional
                                        comments to close the request/order.

                                        Displays a figure of generic request
                                        workflow/order workflow. It indicates
                                        the current phase which the
                                        request/order is in, and traces the
                                        phase transition history.

Label                                                                                           Service Manager 9.81
Activities section
                                        Description
Attachments section
Related Records section                 Records information that the operator
Approvals > Current Approvals           enters during the lifecycle of the
                                        request/order. Every time you update a
                                        request/order, you can fill in an update
                                        on the Activities section (New Update)
                                        with or without “Visible to Customer”
                                        flagged. A log of all the updates is
                                        stored on the Journal Updates and
                                        activities list. Updates from
                                        user/requester also display here with
                                        activity type “Update from customer.”

                                        You can use the Attachments section to
                                        attach documents to request/order.

                                        Contains a list of all related records for
                                        the request/order. The related records
                                        in request form include interactions,
                                        changes, incidents and requests. The
                                        related records in order form include
                                        interactions.

                                        This subsection provides an overview
                                        of the current approvals related to
                                        request/order.

                                        The data displayed includes the
                                        following information:

                                             Approval Type
                                             Approval Status
                                             # Approved
                                             # Denied
                                             # Pending

 Label                                                                                          Service Manager 9.81
 Approvals > Approval Log
                                        Description
 SLT section
 Tasks section                          This subsection provides an overview
                                        of the past approvals related to
This PDF was generated on May 23, 2026  request/order.

                                        The data displayed includes the
                                        following information:

                                             Action
                                             Approver/Operator
                                             By
                                             Date/Time
                                             Phase
                                             ID

                                        The SLT (Service Level Target) section
                                        displays SLAs related to the
                                        request/order. The Service Level
                                        Targets subsection defines the Process
                                        Target details, such as beginning and
                                        ending state, and time allowed
                                        between these states. The Upcoming
                                        Alerts subsection displays the alerts to
                                        generate when processing the Process
                                        Target.

                                        The planned/created request tasks are
                                        displayed in this section. Most of the
                                        tasks come from Request Model.
                                        However authorized operator (with
                                        “Edit Task Planner” right in “Request”
                                        area) is allowed to plan additional tasks
                                        via “Edit” button in the tasks section.

                                        To plan a new task, click the “Edit”
                                        button in tasks section, task editor is
                                        displayed for planning new tasks.

                                                                                                                        Page 161 of 387
Label                                                                                           Service Manager 9.81
Task Context section
                                        Description
History section
                                        Displays the input and output
                                        parameters of all request tasks defined
                                        for the request/order.

                                        Displays the timestamps and operators
                                        that the request/order record is opened
                                        or updated by.


1.9.21.4. Request task forms

The following figure shows the common task form.

The following figure shows the purchase task form.


The following figures show different CMDB update forms for different request task
categories.

CMDB update form in “Purchase” task:


CMDB update form in “Reservation” task:

CMDB update form in “Installation” task:  Page 165 of 387

This PDF was generated on May 23, 2026

CMDB update form in “Uninstallation” task:

The following figure shows the closed request task form.



1.9.21.5. Request task form details

The following table identifies and describes some of the features on the request task
form.

Label                                                                                                                          Service Manager 9.81
Request Task ID
Title                                   Request task field descriptions
Description
                                                      Description
Parent Request
Category                                              The system-generated unique ID for
                                                      this request task.

                                                      A short description that summarizes
                                                      the request task. It is a mandatory field.

                                                      A detailed description of the request
                                                      task. This field is prepopulated with
                                                      data from parent request/order. It is a
                                                      mandatory field.

                                                      Displays the unique ID of parent
                                                      request/order.

                                                      This field describes the type of request
                                                      task. In out-of-box, the following
                                                      categories are available:

                                                            Automation
                                                            Installation
                                                            Labor
                                                            Purchase
                                                            Reservation
                                                            Uninstallation

Label                                                                                           Service Manager 9.81
Phase
                                        Description

                                        This is a system-generated field that
                                        specifies the name of the current
                                        phase of the request task. These
                                        phases are available in out-of-box
                                        workflows:

                                             Waiting
                                             Active
                                             Review
                                             Closure
                                             Cancelled
                                             CMDB Update (only available in
                                             “Purchase”/“Reservation”/”Installa
                                             tion”/”Uninstallation” task
                                             workflow)
                                             Execution (only available in
                                             “Automation” task workflow)
                                             Completion (only available in
                                             “Automation” task workflow)

Label                                                                                           Service Manager 9.81
Status
                                        Description

                                        Displays the status of the request task.
                                        These statuses are available in out-of-
                                        box workflows:

                                             Planned – Request task is opened
                                             but not activated.
                                             Ready – Request task is activated.
                                             In Progress – Request task is
                                             being handled by Request
                                             Analyst.
                                             Pending Customer – Additional
                                             information is required from
                                             user/requester.
                                             Pending Vendor/Supplier –
                                             Vendor/Supplier will handle this
                                             request task.
                                             CMDB Update (Only available in
                                             “Purchase”/“Reservation”/”Installa
                                             tion”/”Uninstallation” task
                                             workflow) – CMDB is being
                                             updated.
                                             Pending Review – High priority
                                             request task will be reviewed.
                                             Cancelled – Request task is
                                             cancelled.
                                             Closed – Request task is closed.

 Label                                                                                          Service Manager 9.81
 Impact
                                        Description
 Urgency
                                        A measure of the effect of the request
 Priority                               task on business processes. Impact
                                        and urgency are used to assign priority.
This PDF was generated on May 23, 2026  These impacts are available out-of-
                                        box:

                                             Enterprise
                                             Site/Dept
                                             Multiple Users
                                             User

                                        This field is prepopulated with data
                                        from parent request/order. It is a
                                        mandatory field.

                                        A measure of how long it will be until a
                                        request task has a significant impact
                                        on the business. Impact and urgency
                                        are used to assign priority.
                                        These urgencies are available out-of-
                                        box:

                                             Critical
                                             High
                                             Average
                                             Low

                                        This field is prepopulated with data
                                        from parent request/order. It is a
                                        mandatory field.

                                        The order in which to address the
                                        request task in comparison to others.
                                        The priority value is calculated using
                                        impact and urgency.

                                                                                                                        Page 172 of 387
Label                                                                                           Service Manager 9.81
Assignment Group
                                        Description
Assignee
                                        The support group assigned to work on
Request Coordinator                     this request task. This field can be
                                        prepopulated by the data defined in
Planned Start                           assignment rule or manually set by
                                        Request Coordinator. It is a mandatory
                                        field.

                                        The person assigned to work on this
                                        request task. This person is a member
                                        of the assignment group. This field can
                                        be prepopulated by the data defined in
                                        assignment rule or manually set by
                                        Request Coordinator.

                                        The name of the person responsible for
                                        coordinating the implementation of the
                                        parent request/order. Each Coordinator
                                        may belong to several assignment
                                        groups. Each group can have just one
                                        Request Coordinator.

                                        If “Global Lead Time” is not zero in
                                        request or order, this field will be
                                        calculated starting from request
                                        “Delivery Date” and upstream from the
                                        last task to the first one in task planner,
                                        task dependency and planned lead
                                        time will be considered. In case “Global
                                        Lead Time” is zero in request or order,
                                        this field will be calculated from the
                                        “Expected Finish Date” instead of
                                        “Delivery Date”. This field is read-only
                                        in the request task form.

Label                                                                                           Service Manager 9.81
Planned End
                                        Description
Planned Lead Time
Actual Start                            If “Global Lead Time” is not zero in
Actual End                              request or order, this field will be
Contractual Lead Time                   calculated starting from request
                                        “Delivery Date” and upstream from the
                                        last task to the first one in task planner,
                                        task dependency and planned lead
                                        time will be considered. In case “Global
                                        Lead Time” is zero in request or order,
                                        this field will be calculated from the
                                        “Expected Finish Date” instead of
                                        “Delivery Date”. This field is read-only
                                        in the request task form.

                                        Defines the duration time that the
                                        request task will spend. Data is
                                        prepopulated by the value defined in
                                        task planner of Request Model. This
                                        field is read-only.

                                        It will be auto-populated when task is
                                        activated.

                                        It will be manually filled by Request
                                        Analyst when request task is done.

                                        By default it equals to “Planned Lead
                                        Time”. However it is allowed to be
                                        adjusted by authorized operator
                                        according to real situation. Once it is
                                        changed, the “Planned Start” and
                                        “Planned End” will be re-calculated
                                        accordingly. The out-of-box request
                                        task SLT is still measured based on
                                        “Planned Lead Time”.


Label                                   Description
Cost > Total Cost
                                        Total cost incurred by fulfillment
Cost > Currency                         activities. This field in “Purchase” task
Cost > Date/Technician/Hours Worked     indicates the cost of received part
                                        items. This field in other tasks indicates
Purchase > Part No.                     the labor cost.
Purchase > Vendor
Purchase > Ship To Location             Specifies the currency of the total cost.
Purchase > Ordered Quantity
Purchase > Received Quantity            The table specifies when and who will
Purchase > Balance                      work on the request task for how many
                                        hours. The labor cost is calculated
                                        based on the hourly rate of the
                                        technician and the hours spent by the
                                        technician.

                                        The part no. of the purchased item
                                        listed in product catalog. This is a
                                        required field.

                                        The vendor of the specified part item
                                        which is defined in the modelvendor
                                        table. This is a required field.

                                        The destination location the purchased
                                        items should be shipped to. This is a
                                        required field.

                                        The number of part items requested or
                                        ordered. This is a required field.

                                        The number of received part items.

                                        Equals “Ordered Quantity” minus
                                        “Received Quantity”.


Label                                   Description

CI Update History > button Submit to    The Request Analyst clicks this button
CMDB/Update CMDB                        to execute actual CI creation or CI
                                        status update. A confirmation message
                                        box will be displayed once this button
                                        is clicked. If “Yes” is selected in the
                                        message box, CI will be created or CI
                                        status will be updated. Otherwise,
                                        CMDB update action is abandoned.

CI Update History > CI Name/Old         Shows the CMDB update result. New
Status/New Status/Operation             created CIs will be shown in
Time/Whether Updated?/Receipts          “Purchase” task. Status updated CIs
Number                                  will be shown in
                                        “Reservation”/“Installation”/”Uninstallati
                                        on” task.

Request Information > CartItem Id/Cart  Displays the request information
Item/Requested                          provided by user/requester. The
For/Quantity/Status/User Selection      request information includes the items
                                        ordered from Service Catalog, the user
                                        selection details of the ordered items.
                                        The information in this table will be
                                        referenced by the operator who
                                        performs CMDB update.

Label                                                                                           Service Manager 9.81
Summary > Closure Code
                                        Description
Summary > Closure Comments
Workflow section                        Specifies a predefined closure code to
Activities section                      describe how the request task has
                                        been fulfilled.

                                        These closure codes are available out-
                                        of-box:

                                             Successful
                                             Successful (with problems)
                                             Failed
                                             Rejected (financial)
                                             Rejected (technical)
                                             Rejected (security)
                                             Withdrawn
                                             Withdrawal requested by
                                             customer
                                             Cancelled
                                             Denied request fulfillment

                                        This field is to document additional
                                        comments to close the request task.

                                        Displays a figure of request task
                                        workflow. It indicates the current phase
                                        which the request task is in, and traces
                                        the phase transition history.

                                        Records information that the operator
                                        enters during the lifecycle of the
                                        request task. Every time you update a
                                        request task, you can fill in an update
                                        on the Activities section (New Update)
                                        with or without “Visible to Customer”
                                        flagged. A log of all the updates is
                                        stored on the Journal Updates and
                                        activities list.

Label                                                                                           Service Manager 9.81
Attachments section
Related Records section                 Description
SLT section
                                        You can use the Attachments section to
Task Context section                    attach documents to request task.
History section
                                        Contains a list of all related records for
                                        the request task. The related records in
                                        request task form only include
                                        changes.

                                        The SLT (Service Level Target) section
                                        displays SLAs related to the request
                                        task. The Service Level Targets
                                        subsection defines the Process Target
                                        details, such as beginning and ending
                                        state, and time allowed between these
                                        states. The Upcoming Alerts
                                        subsection displays the alerts to
                                        generate when processing the Process
                                        Target.

                                        Displays the input and output
                                        parameters of the request task.

                                        Displays the timestamps and operators
                                        that the request task is opened or
                                        updated by.
````
