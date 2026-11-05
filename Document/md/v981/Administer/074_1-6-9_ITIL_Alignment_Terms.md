---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.6.9 .. 1.6.11
printed_pages: 1823-1836
---

# 1.6.9 ITIL Alignment: Terms

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.6.9. ITIL Alignment: Terms

Service Manager is fully aligned with ITIL terms and definitions. The following
features of Service Manager are good examples of alignment with ITIL:

     Detailed descriptions of the focus of each ITIL process and supporting module
     in Service Manager. This includes the scope of the function or process, the
     goals, the roles and thus profiles typically required to deliver the function and
     their responsibilities. This information is included in the help server.
     Process diagrams that define the out-of-box process flows to deliver the
     function are included in the help server.
     The screens, work flows, profiles and system logic is pre-defined in the Service
     Manager system to deliver the functions as described in the help server.


1.6.9.1. Access Control

Authorized users can create, modify, and close records through the different Service
Manager modules. Service Manager security utilities govern access to functionality
within each module and define access based on role. For example, one user may be
able to create and modify, but not close, records.

Service Manager security utilities govern access to modules, functionality within
modules, and underlying data.

Related topics

Controlling user access and security
Application profiles
Capability word model


1.6.9.2. Mandatory Fields

Service Manager provides two basic methods for setting field-level controls including
making a field mandatory. The system provides two methods to indicate that a field is
mandatory in the user interface.

If the field is only required to be mandatory on a screen-by-screen basis, the field can
be set as mandatory using the format control validations. This control can be visually
indicated by a property in Forms Designer.

If the field needs to be set as mandatory for all access points throughout the system,
a data policy for the field can be set using the supplied configuration tools. In this
case the visual indication is automatic.

On screen, Service Manager identifies mandatory fields with a red asterisk indicator.

Related topics

Fields and Keys tab
Access Data Policy
Add a Set Mandatory Fields rule


1.6.9.3. Reporting

Service Manager includes two options for generating management reports using key
performance indicators: Service Manager Dashboard queries and charts, Reporting,
and Database Reports. These tools allow you to generate predefined and ad hoc
reports to display any information. The following describes these tools.

Service Manager Reports

The Service Manager Reports module provides reports and dashboards to enable
faster analysis and improved time to resolution. These reports organize data into
various chart formats, and the dashboards display one or more reports to provide
global information about critical activities or metrics. These reports display
relationships among categories of data. For example, one report might display the
number of incidents per customer, while another displays the number of incidents by
priority. Viewing these reports together as a dashboard enables you to make better
business decisions, such as assigning resources to close incidents. Report Managers
can share a report or dashboard.

The Service Manager Reports module aims to provide a lightweight reporting feature
for active operational data, and the reports are therefore designed to retrieve,
represent and visualize up to 100,000 active records out of millions. To define
analytical reports against the entire data set, you need to use a third-party business
intelligence tool.

Database Reports

Service Manager provides built-in report views in the database for operational
reporting or regularly scheduled reporting requirements. You can either review the
sample report views to determine which tables, fields, and filters are used for the
development of the report or create your own management reports using these
details. After your customization, you need to use a third-party reporting tool (such as
Microsoft Power BI) to access the Service Manager database and then generate the
reports as required.


1.6.9.4. Audit Trail

For all records in Service Manager, a date time stamp and a user stamp are updated in
the record when it is created or saved.

Service Manager provides an audit trail capability that identifies each step taken in
the resolution of a record. Each time the record is updated (whether manually or
automatically), a separate historical activity is created for the record. An authorized
user may review each historical activity to develop a comprehensive understanding of
the history of the record and its resolution, including which operators took what
actions at what times. These updates are displayed into an aggregated journal of all
updates.

Service Manager also provides an auditing feature that records modifications to fields
within the Service Manager database. Field modifications are detected by comparing
the fields in the original version of a record to the updated version. When
modifications are detected, an Audit Log entry is recorded for each changed field
showing the name of the modified field, the old and new version of the data, the
current date/time, and the current operator’s user ID.

Related concepts

Audit processing
Invoke auditing from Format Control


1.6.9.5. Archiving

Closure of processed problems, incidents, changes, interactions, and other records is
a standard part of the workflow for each module. Typically, the closure action not only
supports saving the record but separates validations, rules, and possibly even
separate forms to help ensure business success.

The most typical approach for archiving records is to leverage the chosen RDMS tools
from Oracle or MS SQL to perform database administration for purging and archiving.

Service Manager provides an archive and purge tool that can be configured by table
and criteria for archiving. This is a facility only the administrator would use. This
capability allows the ability to archive either manually or on a scheduled basis.

One new capability in this area is the ability to take advantage of the company's
archive tool suite. These tools allow data to be archived out of Service Manager into a
system-accessible file system. The production or alternative instance of Service
Manager can then be used to access these data records. See the link below for
additional details.

Related topics

Revision control
Archive records


1.6.9.6. Notification and Escalation

Service Manager provides alerts and escalations in the following ways:

     Notifications

     Service Manager provides a broad and deep solution to deliver notifications to
     stakeholders whenever a record is opened, updated or closed. The notification
     engine allows administrators complete control over the following:

     • What notification vehicle and format to deliver
     • What conditions on which to send the notification
     • To whom the notification should be sent

     Alerts

     Modules include the ability to set criteria for the generation of alerts. For
     example, the administrator can set rules for three stages of alert and a deadline
     condition. When these targets are met, specified users receive alerts and
     notifications through the Service Manager tool, email, etc.

     Escalations

     Business rules can be used to trigger automated escalations of records under
     various conditions. Examples include: should the status remain unchanged for
     too long; the record reassigned too often between assignment groups; or for
     other rules as defined. In addition, to document the violation of these rules the
     administrator can configure Service Manager to act in certain ways should these
     rules be breached. For example, if a record remains in open state for too long,
     reassign it to the assigned user’s manager.

     Service Level monitoring

     Alerts and escalations can be triggered through evaluation of Service levels as
     defined in the Service Level Management module. This approach is used to set
     Service Level Objectives and Service Level Agreements with associated actions
     should service levels approach breach conditions. In this way, escalation is
     accomplished proactively to avoid breach rather than react to breach.


1.6.10. Native release control for Service
Manager

Release Control (RC) ties the change planning and analysis process with automated
change execution and validation to help reduce the risk of service downtime and to
increase the change success rate. It provides the means for accurate planning and
approval decisions during the review process, as well as real-time visibility and cross-
team communication to prevent service disruptions that occur due to unplanned
changes, schedule delays, collisions, or failures during change execution. Teams can
coordinate hand-offs and sharing of information between the Change Advisory Board
(CAB) and the implementation team.

Now, Service Manager has a comprehensive collection of native built-in release
control functionality and provides extended change management support without the
need to integrate with the former product known as Release Control.

Risk assessment and calculation (new with version
9.62)

Service Manager provides out-of-box (OOB) risk assessment and calculation. After
you enable the Risk Assessment function, click the Calculate Risk button or click
More > Calculate Risk to calculate the risk involved of each Change based on the risk
factors that you defined in Service Manager.

After the calculation is completed, the system opens the Risk Result Report and
displays the latest version of the risk result. This report provides an overall summary
of the risk analysis for the selected change request, including the total score, risk
assessment result, all related risk factors and the corresponding answers, collision
status, and individual score for each risk factor in this report. This information enables
you to pinpoint the most significant factors contributing to the risk level of the
selected change request. If there are any collisions, the system documents these
details in the Change record, which is also visualized in the Change Calendar.

For more information, see Calculate risks.

CI visualization and impact analysis (provided since
version 9.50)

The integration between Service Manager and UCMDB enables users to see the
visualized CI relationships and impact results directly inside the Service Manager UI in


the context of an affected service or configuration item (CI) in the Change,
Configuration, Incident, Problem, and Interaction modules.

For more information, see Centralized CI Visualization and Impact Analysis.

Unplanned Change Management

The integration between Service Manager and UCMDB enables users to track
unplanned Changes. Modifications to the infrastructure are detected and exposed to
Service Manager. Service Manager receives the modified data, and in case
differences to the planned values are recognized an event like a Change record or
Incident record can be automatically created.

The purpose of Unplanned Change management is to provide IT organizations a
formal process by which all modification that occur to the IT infrastructure are tracked
and exposed to the organizations formal review process.

For more information, see Managing Unplanned Changes.

Time Period Management (provided since version
9.34)

You can use Time Period Management to manage time period definitions for your
organization so that users have a better support in planning their changes in times
with the least impact. If integrated with another module in Service Manager, Time
Period Management will enable you to directly view time periods from that module.
For example, if integrated with Change Management, time period definitions will
enable users to view time periods and changes in a Calendar widget and view time
periods and changes in the context of a selected change.

For more information, see Time Period Management.

Service Manager Calendar (provided since version
9.34)

Service Manager Calendar displays time period and other records in a graphic and
intuitive user interface, and enables users in different locations and departments of
your organization to perform the following tasks and optimize their task planning
accordingly:

     To view time conflicts of object records from either conflict icon tooltips and
     shadow bars.
     To view the business records such as Change and Incident. See Display records
     from an application module in the calendar for detailed instructions.


     To easily see how their activities will be affected in a specific time range.
     To easily see which records are scheduled for or associated with a specific time
     range.
     To directly view important details of time period records and associated records
     from tooltips.
     To directly open records from the calendar to view their details.

For more information, see Working with the calendar.

Alerting

You can configure Service Manager to send notifications whenever specific system
events occur. For example, you can receive notifications when certain modifications
are made to the change requests. By default, Service Manager supports notifications
for every type of status change event in all applications.

For more information, see Notifications and Configuring Change Management
notifications.


1.6.11. Supporting tags in Service Manager

Service Manager and later versions provides out-of-the-box tag fields to Knowledge
Management, Interaction, and Incident and enables you to add one or more keywords
or terms to a record. However, to use the tags function in other modules such as
Request, you may refer to the following sample tasks.

If you are working with earlier applications versions from 9.50 to 9.70, Service
Manager doesn't provides the tag feature for all modules by default. To use the tags
function, you need to refer to the following sample tasks and perform customizations
to the corresponding Service Manager modules such as Interaction, Incident, and
Knowledge Management.

            Important

           Important: If you want to enable tag in more Service Manager modules or
           work with earlier applications versions, make sure to upgrade the
           Windows client to version or later so that you can manually update your
           forms to support tags.

Task 1: Update the database dictionary for the
Request module

Follow these steps to update the database dictionary for the Request module:

   1. Click Tailoring > Database Dictionary. Type request in the File Name field, and
     then click Search.

   2. Click New Field/Key, and then add an array character tags field as follows:

Name Type Level                         Index  SQL   SQL  SQL
                                               Name
                                        114          Type Table
                                        1      TAGS
tags  array 1                                             a2

tags  charact 2                                      VARCH a2
                                                     AR(100)
      er

You need to map both array and character fields to the alias table. Note that the
Index values and the SQL Table values may vary depending on your actual
implementation.


   3. Click OK to save your changes.
   4. Click SM Alters.

Task 2: Update the related formats for the Request
module

You need to add the tag field to the related formats for the Request module. For
example, to display the tag field when creating a new Request, you need to access
Forms Designer, open the rm.request.logging.subform.detail format, and then add the
tag control to this format. As another example, to search for a request by using its
tags, you need to open the rm.advFind.search format and then add the tag control to
this format.

Note: Service Manager provides the rm.request.logging.subform.detail and
rm.advFind.search formats by default. The format's names may vary depending on
your customization. A Request has several related formats and
rm.request.logging.subform.detai is only one of these formats that can be used to
create a Request.

(Optional) Task 3: Enable tag search in Knowledge
Management search engine

You may need to search for records that are related to tags by using Smart Search.
Follow these steps to enable the tag search in Knowledge Management search
engine:

   1. Click Knowledge Management > Configuration > Knowledgebases.

   2. Type Request_Library in the Knowledgebase Name field, and then click
     Search.

     Note: The Request_Library record exists only if you have enabled IDOL.

   3. Add the tags field to the Field Definitions list. See the following example:

Field Name Alias                        Type    Hitlist  Doc Body
                                        String  false    true
tags  tags

   4. Click Save and Full Reindex.

(Optional) Task 4: Enable the tag auto-suggestion
list


When you are typing a tag, the system automatically opens the auto-suggestion list
as long as your input matches one or more tags that are commonly used. Follow these
steps to enable the tag auto-suggestion feature:

   1. (Optional) Load the QCCR1E157823_SM964_SM950.unl unload file to your
     Service Manager server. This file is shipped in the Service Manager release
     package.

     Note: Apply this unload file only if you are working with earlier applications
     versions from 9.50 to .

   2. Click Tailoring > Document Engine > Objects to open the Object Definition
     form.

   3. Type request in the File name field, and then click Search.
   4. Click Configure Object Based Rule Sets and Actions .
   5. Click the Object Based Rule Sets tab, and then add the common.taghints.sync

     rule set to the After successful add and the After successful update tabs,
     respectively.
   6. Click Save to save your changes.
````
