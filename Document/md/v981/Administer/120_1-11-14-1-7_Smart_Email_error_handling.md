---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.11.14.1.7 .. 1.11.14.1.11
printed_pages: 3028-3049
---

# 1.11.14.1.7 Smart Email error handling

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.11.14.1.7. Smart Email error handling

During the Smart Email integration instance setup, the system administrator can
configure the error handling settings to define the error handling behaviors:

     Whether or not the system sends out an notification to the sender, or the
     predefined administrators or operators. The system uses the
     "SmartEmailErrorHandling" HTML template for the error handling notification.
     Whether or not the system creates an incident for the email processing error.

To modify the error handling configuration, see the step for error handling in Set up
inbound email.
The following table describes the default error cases in the out-of-box system.


Error Case                               Cause

Failed to process the email as it comes  The user's email address doesn't
from an unauthorized email domain.       belong to an authorized email domain.

Error Case                                                                                      Service Manager 9.81

Failed to create or update the record   Cause
due to validation error.
                                        The creation or update of a record fails
                                        due to validation errors. The system
                                        requires more information to recreate
                                        the record.

Error Case                                                                                      Service Manager 9.81

                                        Cause

                                                    Note

                                                   If you find a smart email
                                                   task log (in the
                                                   SMISTaskLog table) is in
                                                   the Error status but the
                                                   Internal Record ID is not
                                                   empty, it is likely that Smart
                                                   Analytics is enabled and
                                                   returns an obsolete
                                                   category or affected
                                                   service. In this case, the
                                                   system still creates the
                                                   record by using the default
                                                   category but the status of
                                                   the task is set to Error. You
                                                   can delete the obsolete
                                                   category or service by
                                                   using the following
                                                   workaround:

                                                      1. Search for this
                                                        obsolete category or
                                                        affected service in the
                                                        cate2idol2 table and
                                                        log its ID.

                                                      2. Run the saa
                                                        command.

                                                      3. Type http://<Smart
                                                        Analytics Server
                                                        host>:<Smart
                                                        Analytics Server
                                                        port>/action=Categor
                                                        yDelete&Category=
                                                        <id> in the field
                                                        before the Run button

                                                      4. Click Run.

Error Case                                                                                      Service Manager 9.81

Failed to create or update the record   Cause
due to insufficient user right.
                                        The creation or update of a record fails
                                        because a user doesn't have the
                                        correct permission to create or update
                                        a request.
                                        By default, the user should have the
                                        "New" or "Update" right in the "Service
                                        Desk", "Incident", or "Change" area.

Error Case                                                                                      Service Manager 9.81

Failed to update the record because     Cause
the record is no longer in a phase or
status that allows the update.          This error occurs when a user attempts
                                        to execute an action from an email
                                        when the record is no longer in the
                                        correct phase. For example: a user
                                        adds a comment after the record has
                                        been closed.

                                                    Note

                                                   If this error handling
                                                   doesn't work, you may be
                                                   using a customized or
                                                   localized phase name in
                                                   your workflow. In this case,
                                                   you need to change the
                                                   following phase names in
                                                   the SmartEmailSMHelper
                                                   script library to the actual
                                                   phase names in your
                                                   workflow:

                                                         if
                                                         (scfile['current.p
                                                         hase'] ==

                                                         'Closure' ||
                                                         scfile['current.ph

                                                         ase'] ==
                                                         'Abandonment') {
                                                         promise.rejectProm

                                                         ise(ReturnCode.ACT
                                                         ION_ERROR);

                                                         return promise;
                                                         }

The token is expired.                   SM fails to process an email action
                                        because the token contained in the
                                        email has expired.


Error Case                               Cause

The token has already been used.         SM fails to process an email action
                                         because the token contained in the
                                         email has already been used (the user
                                         already performed the action).

The token is invalid.                    SM fails to process an email action
                                         because the token is invalid or may
                                         have been altered.

The email address is not associated      A user with the sender's email address
with any registered user in the system.  is not recognized as a registered SM
                                         user.

The email address doesn't match the      The sender of the email and the user in
original address in the token.           the email's token don't match. This
                                         might occur if a user forwarded the
                                         email containing a token to someone
                                         else.

Failed to process the email due to email There might be problems with the email

integration error.                       integration.

A task to process is expired in the SMIS A task to process is expired in the SMIS

task queue.                              task queue.

Failed to connect to the mail server.    The connection to the mail server can't
                                         be established.

The total email size exceeds the limit.  The total email size (including email
                                         body and all attachments) exceeds the
                                         limit configured in the SMIS instance.


1.11.14.1.8. Spam filtering in mail server

As most of the email servers provide the anti-spam feature, the SM Smart Email
solution doesn't include an extra spam filter for inbound emails. Instead, system
administrators are encouraged to configure spam filters in their own email servers.

The following is an example for how to set up the anti-spam protection in Office 365:

Connection filtering checks the reputation of the sender before allowing a message
to get through. You can create an allow list, or safe sender list, to make sure you
receive every message sent to you from a specific IP address or IP address range.
You can also create a list of IP addresses from which to block messages, called a
block list.

Spam filtering checks for message characteristics consistent with spam. You can
change what actions to take on messages identified as spam, and choose whether to
filter messages written in specific languages, or sent from specific countries or
regions. You can also turn on advanced spam filtering options if you want to pursue
an aggressive approach to spam filtering. Additionally, you can configure end-user
spam notifications to inform users when messages intended for them were sent to the
quarantine instead. (Sending messages to the quarantine is one of the configurable
actions.) From these notifications, end users can release false positives and report
them to Microsoft for analysis.

For more details, refer to the Microsoft Office help.

If you are using an email server other than Office 365, refer to the official guide of
your email server to set up the spam filters.


1.11.14.1.9. Smart Email best practices

This topic describes some best practices when you implement the Smart Email
solution.

Resolution email

You can either enable resolution email for interaction only or for fulfillment record
only. Smart Email may not work properly if the resolution email is enabled for both the
interaction and fulfillment records.

When multiple interactions are related to one fulfillment record, we highly recommend
that you disable the resolution email to end user in fulfillment record and enable the
resolution email in interaction only. By doing this, multiple end users recorded in the
interactions can be informed by email instead of just the end user in the fulfillment
record.

For the ordering from catalog use case (that is, one interaction are associated with
multiple fulfillment records), it is recommended that the system sends out the email
from the fulfillment records only. This is because in such case, the fulfillment records
provide more details than the interaction record.

Auto-closure of resolved records

When auto-closure is configured in a workflow, the interaction or fulfillment record is
automatically closed when the condition is met. In this case, it is possible that an end
user is out-of-office and is not able to reply a resolution email in time before the
record is automatically closed. Therefore, we recommend that you add an auto-
closure notification email along with commenting and a RESUBMIT action button in
the email to remind the end user to open a new interaction if the user is unsatisfied
with the provided solution.

Performance consideration

For better performance on processing inbound emails, the administrator can adjust
the following two settings in System Administration > Ongoing Maintenance >
Smart Email > Settings to specify the number of SmartEmail processors and
background schedules.

     Number of SmartEmail processors
     Number of schedules per SmartEmail processor

For benchmark information and recommendations, see Sizing.



1.11.14.1.10. Smart Email actions in HTML
templates

If a record is initially created from a user email (that is, the Source field is "5 - E-
mail"), Service Manager uses the HTML templates that contain Smart Email actions.
The following Smart Email actions can be embedded in the HTML templates for
different modules.

Action button                                                                                   Service Manager 9.81

     Add a Comment                      Modules of the HTML templates that
     Mark as Solved                     can embed the action buttons

     Approve                            Interaction, Incident, Request, Problem
     Deny
                                        Interaction, Change, Request

                                                    Note

                                                   Even if a Change is not
                                                   created from a user email,
                                                   Service Manager uses the
                                                   HTML template that contain
                                                   the Approve actions for a
                                                   Change when this Change
                                                   is pending approval.
                                                   Meanwhile, you must
                                                   enable the Smart Email
                                                   instance in SMIS.
                                                   Otherwise, Service
                                                   Manager will not send out
                                                   approval or denial emails
                                                   for a Change that is
                                                   pending approval.

Accept                                  Interaction, Incident, Request, Problem
Reject                                  Change task

Close

In the out-of-box system, the following Smart Email actions aren't enabled for the
Incident, Request, and Problem modules:

     "Add a Comment" and "Mark as Solved" actions when an incident, request, or
     problem is updated.


     "Accept" and "Reject" actions when the status of an incident, request, or
     problem is set as Resolved.

For the system to send out an email with these actions, you need to tailor your system
and enable the feature manually. For instructions, see Enable Smart Email actions for
incident, problem, and request.

            Note

                If you use the HTML templates with action buttons, be sure to enable
                SmartEmail in SMIS. Otherwise, after users click an action button
                and reply the email, Service Manager can't process the email so that
                the action will not take effect.
                When an end user clicks an action button from a mail client (such as
                Outlook, Gmail, and Office365), normally a new email window
                appears with the predefined information including email recipient,
                subject, and authentication token. However, some mail clients might
                fail to open the new email window or miss the token information in
                the mail body because these mail clients handle the mailto tag in
                their own ways. In this case, you need to use other mail clients such
                as Outlook.
                If an end user uses Gmail, the images such as the company logo in
                the SM HTML templates may not be displayed in the Gmail mail
                client.

Out-of-box HTML templates with action buttons

The following tables list the HTML templates that contain action buttons in the out-of-
box system.

     Add a Comment and Mark as Solved buttons


Embedded in HTML                        Defined in ruleset        Defined in notification
template

incident.open.for.smart incident.notification.op

.email                                  en

sd.registered.for.smart.                sd.notification.register
email                                   ed

                                        sd.svc.notification.regi
                                        stered

sd.steamlined.open.for. sd.streamlined.notificat

smart.email                             ion.open

sd.require.comment                                                Activity Added

Approve and Deny buttons

Embedded in HTML                        Defined in ruleset        Defined in notification
template
                                                                  Approval Added
sd.pending.approval                                               Approval Added

cart.item.pending.appr                                            Approval Added
oval                                                              Approval Updated

cm3r.pending.notificati
on.for.smart.email

request.pending.notific                                           Approval Added
ation.for.smart.email                                             Approval Updated

Accept and Reject buttons


Embedded in HTML                        Defined in ruleset           Defined in notification
template
                                        sd.notification.fullfilled.
sd.fulfilled.with.action                resolved

Close button

Embedded in HTML                        Defined in ruleset           Defined in notification
template
                                        chm.task.notification.p      ChM Task Pending
ChM Task Pending                        ending.close                 Close
Close
                                        chm.task.notification.p
                                        ending.close.risk

Tip

To access HTML templates, from the system navigator, click Tailoring >
Notifications > HTML Templates, and then search for the templates.


1.11.14.1.10.1. Enable Smart Email actions
for incident, problem, and request

Applies to User roles: Administrator

In the out-of-box system, the following Smart Email actions aren't enabled for the
Incident, Request, and Problem modules:

     "Add a Comment" and "Mark as Solved" actions when an incident, request, or
     problem is updated.
     "Accept" and "Reject" actions when an incident, request, or problem is set as
     Resolved.

However, you can tailor your system to manually enable these Smart Email actions for
incident, problem, and request.

To enable the "Add a Comment" and "Mark as Solved" actions, follow these steps:

   1. Add an HTML template for incident, problem, or request with the action buttons
     embedded. You can refer to the sd.require.comment template for interaction as
     an example.

   2. In the notification table, add a notification. You can refer to the "Activity Added"
     notification for interaction. You at least need to modify the Arguments and
     Activity Added field.

   3. In the activityactions table, add the notification that you created in the previous
     step to the "Update Activities" record for a module:
        1. Open the activityactions table, search for the "Update Activities" record for
           the corresponding module (the probsummary, rootcause, or request table).
        2. Locate the Name field as $apm.activity(for probsummary) or
           $pm.activity(for problem or request) and the Condition field as "Condition:
           not ($G.bg) …"
        3. Add the new notification to the Notification field and save your changes.

To enable the "Accept" and "Reject" actions, follow these steps:

   1. Add a new rule set for incident, problem, or request.

   2. Add a rule for the rule set and set the rule type as Send HTML Email.

   3. Edit the condition for the rule. For example:

      Source in CurrentRecord = "5" AND Status in CurrentRecord = "Resolved"


4. Select the following HTML template for the rule:

        incident: IM.Resolution.with.action
        problem: PM.Resolution.with.action
        request: RM Fulfilled with Action

5. Select the Recipients field as Current Record and Select Field and Filed Type to
  define the people who will receive emails with the Accept/Reject buttons.

6. Save the rule and the rule set.

7. Add the new rule set to the incident, problem, or request workflow under the
  Rule Sets tabs, and then save the workflow. For example, you can add the new
  incident rule set in the transition between the Recovery and Review phase of the
  Incident workflow.

               Note

             If you can't save the workflow, you may need to copy the workflow
             (Tailoring >Process Designer >Copy Existing Workflow), add the
             new rule set, and then save. Also you need to change the workflow
             for the incident, problem, or request category to the new copied
             workflow.


1.11.14.1.10.2. Add a custom action in email

Applies to User roles: Administrator

In the out-of-box system, predefined Smart Email actions can be embedded in the
HTML templates for different modules. In addition, you can tailor the system to add a
new custom action for Smart Email.

To add a custom action (for example, an action called ABC) in the HTML template,
follow these steps:

   1. Open the HTML template.

   2. In the Expressions tab of the HTML template, add the following line. This is the
     action display name.
      var ABC_action_label = localscmsg(null, "SmartEmail", "ABC_action_label");

   3. In the HTML Source tab of the HTML template, add the following line:

      email_action(ABC,{ABC_action_label},{$RECORD.number},
     {$RECORD.brief_description},color:#ffffff;font-weight:semibold;text-
     decoration:none;)

                   Note

                Among the code, the color:#ffffff;font-weight:semibold;text-
                decoration:none; part is optional as it is for the display style of the
                custom action.

   4. In the MailService._genReplyBody() JavaScript, add the following line to the
     "default_action_body" array:

      "ABC": _localscmsg(lang, "SmartEmail", "ABC_default_body")
  5. Add the corresponding scmessage record used in step 2 and step 4.
   6. Modify the MailUtil.calcReplyTo() JavaScript if the logic of the reply email

     address needs to be changed. See Reply email address for the default "reply to"
     logic.

   7. Implement the logic of the new custom action as needed. You need to add the
     action to the SmartEmailSMAdapter function sendRecord.


1.11.14.1.11. View Smart Email reports

Applies to User roles: IT manager
The Reporting tool in Service Manager provides four out-of-box reports for Smart
Email. You can view these reports through a dashboard named Smart Email Overview
(Global).
To view the Smart Email reports, follow these steps:

   1. Click System Administration > Ongoing Maintenance > Smart Email > Smart
     Email Overview. The Smart Email Overview dashboard is displayed.

   2. View the reports on the dashboard. The following table describes the out-of-box
     reports for Smart Email.


Report                                  Description               Chart type

Email interactions                      This report compares      Vertical bar
resolved using email                    the number of email
vs. email interactions                  interactions that are
resolved using SM                       resolved through email
client                                  and by using SM client
                                        during within six
                                        months.

Average resolution time                 This report compares      Line
for email interactions                  the resolution time for
vs. average resolution                  email interactions and
time for other                          the resolution time for
interactions                            other interactions

                                        within six months.

Customer satisfaction                   This report indicates     Line
of email interactions
within 6 months                         customer satisfaction

                                        of email interactions

                                        within six months

                                        based on the analysis

                                        of the surveys from

                                        email records. It shows

                                        the average score of

                                        each survey questions

                                        for the surveys.

First-contact resolution                This report shows the     Number
rate of email                           rate of email
interactions                            interactions that are
                                        closed at first contact.

In the dashboard, a "Hot Topic Analytics for Email Interactions" section is also
displayed. You can view the hot topics for email interactions if Smart Analytics is
enabled.
````
