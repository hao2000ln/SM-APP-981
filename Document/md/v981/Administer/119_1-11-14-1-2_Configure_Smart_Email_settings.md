---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.11.14.1.2 .. 1.11.14.1.6
printed_pages: 3000-3028
---

# 1.11.14.1.2 Configure Smart Email settings

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.11.14.1.2. Configure Smart Email settings

Applies to User roles: System Administrator
System administrators can configure Smart Email global settings such as outbound
email archiving, one-time token, testing email, the number of acknowledge
documents and service offerings proposed by Smart Analytics, and so on.
To configure the Smart Email settings, follow these steps:

   1. Click System Administration > Ongoing Maintenance > Smart Email >
     Settings. The Smart Email Settings form is displayed.

   2. Specify the settings on the form, as described in the following table.


Setting                                 Description  Default Value

Activate HTML                           Enable or disable the True
template audit                          audit application to
                                        monitor field value
                                        changes in HTML
                                        templates.

                                        When this setting is set
                                        to true, the audit
                                        application monitors
                                        the following fields in
                                        the ltemplates” table:
                                        module, language,
                                        name, mail.title,
                                        content, active,
                                        expression, htmlcode,
                                        and cap.exec.

                                        Tip

                                        You can
                                        view the
                                        audit log
                                        from
                                        Tailoring >
                                        Audit >
                                        Audit Log.


Setting                                 Description               Default Value

Activate outbound                       Specify whether you       False
email archiving
                                        want to archive

                                        outbound emails.

                                        If you select this
                                        option, the system
                                        automatically stores all
                                        the outbound emails in
                                        the emailarchivingstore
                                        table.

                                        To view the archived
                                        email, you can also go
                                        to System
                                        Administration >
                                        Ongoing Maintenance
                                        > Smart Email > View
                                        Archived Emails.


Setting                                 Description                Default Value

Save the email                          Specify whether you        False
attachments to records                  want to save the

                                        attachments of a smart

                                        email to the

                                        corresponding record.

                                        If you select this
                                        option, the system
                                        automatically stores
                                        the attachments of a
                                        smart email to an
                                        interaction, an incident,
                                        or a change record that
                                        is created based on the
                                        initial email. In the
                                        meantime, these
                                        attachments will not be
                                        removed from the
                                        attached smart email in
                                        a record.

                                        Note: If the email
                                        attachment's size
                                        exceeds the Max
                                        Attachment Size or the
                                        total attachment size of
                                        a record exceeds the
                                        Total Attachment Size,
                                        Service Manager no
                                        longer stores the email
                                        attachments to the
                                        record regardless of
                                        this option's setting.


Setting                                 Description             Default Value
Use one-time token
                                        Specify whether you     False

                                        want to use a one-time

                                        token in smart emails.

                                        If you select this
                                        option, only the first
                                        reply that uses this
                                        token is valid. The
                                        system ignores any
                                        subsequent emails that
                                        use the same token.


Setting                                 Description  Default Value

Clean up temporary                      The system removes None
data store for emails                   the received emails
received before this                    earlier than the
date                                    specified date from the
                                        temporary data store in
                                        Service Manager. The
                                        selected date must be
                                        earlier than current day
                                        and in the YYYY-MM-
                                        DD hh:mm:ss format.


Setting                                 Description             Default Value

                                                    Note

                                                   If you use
                                                   the POP3
                                                   protocol,
                                                   make sure
                                                   that the
                                                   received
                                                   emails
                                                   older than
                                                   the
                                                   specified
                                                   date have
                                                   been
                                                   manually
                                                   deleted
                                                   from the
                                                   mailbox
                                                   before you
                                                   clean up
                                                   the email
                                                   store in
                                                   Service
                                                   Manager.
                                                   Otherwise,
                                                   the system
                                                   might
                                                   handle
                                                   these
                                                   emails
                                                   once again.


Setting                                 Description  Default Value

Number of SmartEmail                    Specify the number of 1
processors                              processors to process
                                        inbound emails. For
                                        example, you may want
                                        to specify more than
                                        one processor when
                                        your system is in a
                                        horizontal or vertical
                                        scaling
                                        implementation.

                                        Possible values: no
                                        less than 1


       Setting                          Description               Default Value

This PDF was generated on May 23, 2026              Note

                                                   Before you
                                                   modify the
                                                   number for
                                                   this setting,
                                                   make sure
                                                   that you
                                                   have
                                                   terminated
                                                   all the
                                                   running
                                                   "SmartEmai
                                                   l_Processor
                                                   "
                                                   schedulers
                                                   from
                                                   Miscellane
                                                   ous >
                                                   System
                                                   Status.

                                                   After you
                                                   modify the
                                                   value and
                                                   click the
                                                   Save
                                                   button, you
                                                   need to log
                                                   in to
                                                   Service
                                                   Manager
                                                   with a
                                                   debug
                                                   node and
                                                   start the
                                                   Smart
                                                   Email
                                                   processors

                                                                                 Page 342 of 384

Setting                                 Description              Default Value

                                                   . For
                                                   details, see
                                                   Set up
                                                   inbound
                                                   email.


Setting                                 Description  Default Value

Number of schedules                     Specify the number of 1
per SmartEmail                          background schedules
processor                               for one SmartEmail
                                        processor.

                                        Possible values: 1 - 10

                                        Note

                                        You need
                                        to
                                        terminate
                                        all the
                                        running
                                        "SmartEmai
                                        l_Processor
                                        "
                                        schedulers
                                        before you
                                        modify the
                                        value here
                                        and restart
                                        the
                                        processors
                                        after you
                                        make the
                                        change.


Setting                                 Description              Default Value

                                                    Caution

                                                   If you are
                                                   using the
                                                   POP3 or
                                                   POP3S
                                                   protocol,
                                                   you must
                                                   set this
                                                   value to 1
                                                   to avoid the
                                                   concurrenc
                                                   y in Smart
                                                   Email.

Recipient email                         Specify an email         None
address for testing
                                        address with which the

                                        system replaces all the

                                        recipient email

                                        addresses, so that the

                                        system only send

                                        emails to this email

                                        address for testing

                                        purpose.


Setting                                 Description               Default Value

Reply with this number                  Specify the number of     5
of knowledge                            knowledge documents
documents proposed                      that you want to
by Smart Analytics                      include in a smart

                                        email. This option only

                                        takes effect when you

                                        enable Smart Analytics

                                        in your system.

                                        The knowledge
                                        documents are
                                        automatically
                                        suggested by the
                                        virtual agent Sage.
                                        Besides the internal
                                        KM library, the virtual
                                        agent Sage can also
                                        propose documents
                                        from external libraries
                                        such as a SharePoint
                                        repository, a file
                                        system, or a web site if
                                        the corresponding
                                        connectors are set up
                                        in Smart Analytics.

                                        Possible values: 0 - 5


Setting                                 Description              Default Value

Reply with this number                  Specify the number of    5
of service offerings                    service offerings that
proposed by Smart                       you want to include in
Analytics                               a smart email. The

                                        service offerings are

                                        automatically

                                        suggested by the by

                                        virtual agent Sage.

                                        This option only takes
                                        effect when you enable
                                        Smart Analytics in your
                                        system.

                                        Possible values: 0 - 5

Retention period for                    Specify how long the     7 00:00:00
archived emails                         system archives the
                                        emails. This setting
                                        takes effort for both
                                        inbound and outbound
                                        emails.

Token expiration period                 Specify the expiration   1 00:00:00
                                        period of the smart
                                        email token. If the
                                        token is expired, the
                                        system ignores the
                                        email that uses this
                                        token.

3. Click Save.


1.11.14.1.3. Automatic record creation

After a Service Manager user sends an email to the email account configured in the
Smart Email integration instance, Service Manager processes the email and
automatically creates an interaction, an incident, or a change record based on the
initial email.

The system administrator can configure the New Email Action setting in the Smart
Email integration instance from SMIS to determine if an interaction, an incident, or a
change is created automatically. For the system to successfully create the record, the
sender of the email must have the "New" security right for the corresponding module.

Service Manager creates the record in the system by completing the following:

     Service Manager automatically populates the fields of the new record according
     to the field mapping defined in the email integration instance. For example, the
     system populates the Title field and the Description field by using the content in
     the mail subject and the mail body respectively.
     Service Manager populates the Source field of the record as "5 - E-mail". If you
     enable Smart Analytics, the Source field is used as an advanced filter option in
     Hot Topic Analytics.
     If Smart Analytics is enabled and the "Enable Smart Ticketing" option is selected
     in SMIS, the smart classification and OCR take effect in the new record.
     The inbound email is saved as a .eml file under the Attachments tab from the
     record. If the email contains attachments, the attachments are also saved in the
     .eml file. However, the system ignores the inbound email if the total size of the
     email (including attachments) exceeds that size limit configured in the Smart
     Email integration instance.
     The system adds an activity log for each received email. The activity type is
     "Email Received" and the activity description is copied from the subject of the
     inbound email.

After the record is created, Service Manager generates an email to notify the email
sender that a new record is created based on the information in the initial email.
Within the email reply, the "Add a Comment" and "Mark as Solved" action buttons are
available for further interaction with the Service Manager user.

If Smart Analytics is enabled, the administrator can configure the Smart Email setting
to include links to knowledge documents and service offerings suggested by the
virtual agent Sage, which is empowered by Smart Analytics, in the email reply.
Depending on the configuration of Smart Analytics, the proposed knowledge


documents can be KM articles, SharePoint pages, documents on a file system, or web
pages.

In addition, if the corresponding assignment group is out of work schedule, the out-
of-office message will be displayed in the email.

            Note

                For the Smart Analytics features (including smart classification and
                recommendation of knowledge documents and service offerings) to
                take effect, the end user (that is, email sender) must have the
                RESTful API capability word. In the out-of-box system, the end users
                normally don't have this capability word assigned in their operator
                records.
                Smart Analytics and the related features (such as smart
                classification) are unnecessary for change creation.

Related topics

Smart Email actions in HTML templates
Set up inbound email
Configure Smart Email settings


1.11.14.1.4. Automatic record update

In the Smart Email solution, users can use the action buttons in an email to reply to the
system. Then, Service Manager automatically updates the record based on the
selected action and the email message.


Action in Smart Email                   Description

 Action in Smart Email                                                                          Service Manager 9.81
       Add a Comment
       Mark as Solved                   Description

This PDF was generated on May 23, 2026  If an IT agent performs a "visible to
                                        customer" activity update, Service
                                        Manager automatically sends out an
                                        email that contains the Add a Comment
                                        and Mark as Solved buttons in addition
                                        to the update message.

                                        When the user receives the email, the
                                        user can click Add a Comment, add
                                        comments in the email body, and then
                                        reply the email. Then, Service Manager
                                        automatically updates the
                                        corresponding record with the
                                        comments in the email.

                                                    Note

                                                   If the email content is
                                                   empty without any
                                                   comments, Service
                                                   Manager doesn't update
                                                   the record.

                                        Or, the user can click Mark as Solved
                                        and reply the email to inform the IT
                                        agent that the issue has been resolved.
                                        In this case, Service Manager
                                        automatically changes the status of
                                        record to "Resolved" and populates the
                                        solution field with the email content.

                                                    Note

                                                   If the email content is
                                                   empty, Service Manager
                                                   populates the Solution field
                                                   with a default value “Mark
                                                   as solved by end user”.

                                                                                                                        Page 352 of 384

Action in Smart Email                   Description

     Accept                             If an IT agent provides a solution in the
     Reject                             record, Service Manager automatically
                                        sends out an email that contains the
                                        Accept and Reject buttons in addition
                                        to the solution message.

                                        The user can click the Accept or Reject
                                        button to reply the email. Then, the
                                        system automatically updates the
                                        record as follows:

                                             If the user accepts the solution,
                                             Service Manager changes the
                                             status of the record to "Closed".
                                             If the user rejects the solution,
                                             Service Manager changes the
                                             status of the record to "Work In
                                             Progress".

Action in Smart Email                                                                           Service Manager 9.81

     Approve                            Description
     Deny
                                        If a service catalog request, a change,
                                        or a request is pending approval,
                                        Service Manager automatically sends
                                        out an email that contains the Approve
                                        and Deny buttons to the approver.

                                        The approver (or approval delegate)
                                        can click the Approve or Deny button
                                        to reply the email. Then, the system
                                        automatically updates the record as
                                        follows:

                                             If the approver approves the
                                             approval request, Service
                                             Manager changes the approval
                                             status of the record to "approved"
                                             and copies the email content to
                                             the approval log. If the email
                                             content is empty, a fixed string
                                             "Approved by email – [email
                                             subject line]" is added to the
                                             approval log.
                                             If the approver denies the
                                             approval request, Service
                                             Manager changes the status of
                                             the record to "denied" and copies
                                             the email content to the
                                             comments of approval log. If
                                             email content is empty, a fixed
                                             string “Denied by email – [email
                                             subject line]” is added to the
                                             approval log.


Action in Smart Email                   Description
     Close
                                        Service Manager automatically sends
                                        out an email that contains the Close
                                        button to the assignee when either of
                                        the following conditions are met:

                                             When the Close button is already
                                             available in a Change task ticket,
                                             an operator updates the value in
                                             the Assignee field.
                                             When the Close button is
                                             unavailable in a Change task
                                             ticket, an operator updates the
                                             phase of a Change task ticket so
                                             that the Close button becomes
                                             available.

                                        If the assignee closes the Change task,
                                        Service Manager changes the status of
                                        the record to Closed and copies the
                                        email content together with the “Closed
                                        from email” string to the Closure
                                        Comments field. If the email content is
                                        empty, only the fixed string “Closed
                                        from email” is added to the Closure
                                        Comments field. The Closure Code is
                                        “1-Successful”.

In addition, when the system automatically updates the record, it also completes the
following tasks:

     In the activity log, the system adds an update with a specific activity type such
     as "Accepted from Email" or "Rejected from Email". The activity description is
     copied from the subject of the inbound email.


                   Note

                If the Add a Comment button is clicked and the email content is not
                empty, the activity description will be the email content.

     The entire email is saved as a .eml file under the Attachments tab from the
     record.
     If the record is associated with other records, the system also updates the status
     of the related records accordingly.

Reply email address

After the user clicks an action button, the reply email address is automatically
populated. Likely the reply email address is different from the email account that the
administrator set in the Smart Email SMIS instance, because the reply email address is
calculated for each email receiver (end user) as follows:

   1. The system looks for the location of the contact that's associated with the email
     receiver and uses the Service Desk Email field of location as the reply email
     address.

                   Note

                Locations are hierarchical. The loop starts from the contact's current
                location and checks whether there's an email address or not. If not,
                the loop goes to the parent level and performs a check again. This
                cycle continues till the loop reaches the top level of the hierarchy
                and will stop the loop as soon a location has the Service Desk Email
                field populated.

   2. If the Service Desk Email field is always empty in locations, the system looks for
     the company of the contact and uses the Service Desk Email field in company
     record of the contact as the reply email address.

   3. If Service Desk Email is also empty in company, the system uses the “Service
     Desk Email” documented in Service Desk Environment.

Related topics

Smart Email actions in HTML templates
Set up inbound email
Configure Smart Email settings


1.11.14.1.5. Automatic record fields update

After a Service Manager user sends an email to the email account configured in the
Smart Email integration instance, Service Manager processes the email and
automatically updates the record based on the email message.

The system administrator can configure the New Email Action setting in the Smart
Email integration instance from SMIS to determine whether an interaction, an incident,
or a change is updated automatically based on an incoming email. Meanwhile, a
system administrator must set the Allow to update records by incoming emails
option to true. For more information about the inbound email configuration, see Set up
inbound email.

Permission settings

For the system to successfully update the record, the sender of the email must have
the "Update" permission. If the system administrator has enabled folder entitlement in
System Information Definition, the sender of the email must have the folder update
permission. In addition, after folder entitlement is enabled, the System Administrator
security role must have the "New", "View", and "Update" security rights for the
folders in the interaction, incident, and change modules. Hence, the
SmartEmail_Processor background process is authorized to update the tickets in the
corresponding folders.

Inbound email format

For the system to successfully update the record, you must define the email format as
follows:

Subject

The email subject must be [Update <ticket ID>] <Description> . The system
processes the content in the square brackets only and the <Description> section is
optional.

Content

The email content must be [Field name]=<value> . [Field name] is the name of the
field that's defined in the database dictionary and only the character, boolean,
number, datetime, simple array types (such as array-character, array-boolean, array-
number, and array-datetime) are supported.

You can clear a field by setting the <value> to NULL . For example, [Field
name]=NULL . If you set the value to an empty string, the field is not updated.


If a field name doesn't exist in the database dictionary, or the system can't resolve the
value, or the value doesn't match the type, the system ignores this line in the email.

     If the field is array type, don't wrap the lines but use \n instead to separate
     multiple array elements. For example, [Field name]=
     <value1>\n<value2>\n<value3> .
     If the field is character type and there are double quotation marks at the
     beginning and end of the value, the system automatically filters out the double
     quotation marks.

     If the field is character type in the database dictionary but has the number type
     in the SMIS Integration Instance Fields setting, the system processes this field as
     the number type.

     For example, the severity (Urgency) field in a Change record is defined as the
     character type in the database dictionary, whereas the Smart Email Instance
     Fields setting defines this field as the number type. In this case, the system
     processes the severity (Urgency) field as the number type when updating this
     field. You must use the actual value instead of the display value. For example,
     use [severity]=3 instead of [severity]= 3 - Average .

     If the field is boolean type, <value> can be true , t , false , or f . Your input
     is case-insensitive.
     If the field is datetime type, the system processes the value according to the
     time format and time zone setting in the corresponding operator profile of the
     email sender in Service Manager. Meanwhile, if the value is an offset duration,
     the format must be +'NN hh:mm:ss' or -'NN hh:mm:ss' . For example, if you
     set the value to +'1 00:00:00' , the system will set the time value by adding one
     day forward when the mail is processed.

After the value of a field is updated by an email, Service Manager may automatically
set the value of the field based on certain mechanisms. Consequently, when you
open the updated ticket, the value you see is the one that's automatically set instead
of the value as you defined in the email.

After the record is updated, Service Manager generates an email to notify the email
sender that the corresponding record is updated based on the information in the initial
email. Within the email reply, the Service Manager user is able to review the list of
updated fields and values.

Inbound email example


See the following example for an inbound email. The user requests to update the
Change record C10066.
Subject: [Update C10066] Request to upgrade SAP Kernel
Content:

  [brief.description]= SAP Kernel Upgrade - Hasn't upgraded yet
  [description]= Hello,\n I request the change to upgrade SAP
  Kernel on adv-Server-106 and adv-Server-108
  servers from patch level 23 to patch level 69 during the CPU
  replacement maintenance window on Oct 25th

    from 6 AM to 6 PM one week ago. But the current status is that
  still on Patch 23 which hasn't been
  upgraded. And our project is blocked. Please provide the reason
  and the next step action. \n Best Regards
  [initial.impact]= 1
  [severity]=2
  [requestedDate]= 20/11/23 11:58:34
  [assigned.to]= Change.Manager

Service Manager email notification example

See the following email notification example after Service Manager updates the
C10066 record.
Subject: Your email has updated the ticket successfully.
Content:


You have updated the ticket via email successfully.

The originating email information:

Subject         [Update C10066]

Module          Change

ID                                      C10066

Action          Update

You have requested to update the following fields:

Field                                           Value

brief.description                                  SAP Kernel Upgrade - Hasn't

upgraded yet

description                                        Hello,\n I request the change to

upgrade SAP Kernel on adv-Server-106 and adv-Server-108

                                        servers from patch level 23 to patch

level 69 during the CPU replacement maintenance window

                                        on Oct 25th from 6 AM to 6 PM one week

ago. But the current status is that still on Patch 23

                                        which hasn't been upgraded. And our

project is blocked. Please provide the reason and the next

                                        step action. \n Best Regards

initial.impact                                  1

severity                                           2

assigned.to                                        Change.Manager

Note that the system skips the requestedDate field because the format doesn't match
the user's time format. Hence, the system neither updates this field nor lists this field
in the email notification.


1.11.14.1.6. Email archiving

In the Smart Email solution, inbound and outbound emails can be archived for a
specified period of time. If email archiving is enabled, the system stores the email in
the emailarchivingstore table after an email is received or sent out.

The system administrator can enable or disable email archiving for inbound or
outbound email separately:

     To enable email archiving for the inbound emails, select the Enable email
     archiving checkbox in the Smart Email integration instance.
     To enable email archiving for the outbound emails, select the Activate outbound
     email archiving checkbox in the Smart Email settings (System Administration >
     Ongoing Maintenance > Smart Email > Settings).

The system administrator can also specify how long the system stores the archived
emails by configuring Retention period for archived emails in the Smart Email
settings (System Administration > Ongoing Maintenance > Smart Email > Settings).
This configuration takes effect for both the inbound and outbound emails.

View archived emails

If email archiving is enabled, users can click More > View Archived Emails from a
record to view the archived emails related with this specific record. In addition, you
can also view all the archived emails from System Administration > Ongoing
Maintenance > Smart Email > View Archived Emails.

Contents

     1 View archived emails
````
