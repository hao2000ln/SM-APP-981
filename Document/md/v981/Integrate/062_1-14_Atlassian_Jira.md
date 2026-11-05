---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.14 .. 1.14
printed_pages: 1700-1728
---

# 1.14 Atlassian Jira

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.14. Atlassian Jira

Jira Software is a powerful work management tool for all kinds of use cases, from
requirements and test case management to agile software development. The SM-Jira
integration seamlessly incorporates Service Manager Incident/Change Management
into Jira capabilities of bug/new feature tracking and improves the efficiency of agile teams.
The overall intent of this integration is as follows.

     Automates bidirectional ticket information flow and eliminates dependency on manual
     updates between Service Manager and Jira
     Provides real-time visibility of ticket creation and status updates and ensures complete
     traceability of the tickets
     Increases collaboration across multiple Service Manager teams and Jira DevOps through
     the sharing of comments, attachments, and statuses in both applications
     Reconciles and resolves customer issues more efficiently and leverages the best
     functionalities of the delivery ecosystem

Out-of-the-box, this integration includes the following scenarios.

     Synchronize Service Manager Incident with Jira bug (SM Incident -> Jira bug)
     Synchronize Service Manager Change with Jira new feature (SM Change -> Jira new
     feature)

This section describes how to configure Service Manager and Jira for integration and how to
test the synchronization. The target readers include Consultants and Application
Administrators who must set up and maintain Jira to ensure that the synchronization meets all
user organization procedural requirements. Based on the assumption that the reader is an
experienced user of either Service Manager or Jira (but not necessarily of both), this section
describes only the basics of Service Manager and Jira.

Sample use case

The following typical use cases shed some light on how you can use this integration in your
organization.

SM Incident -> Jira bug

A business owner creates an Incident record in Service Manager. On the Jira tab of the
Incident record, this business owner selects the Incident To Bug action, and then selects the
Jira project. After saving these updates, the system synchronizes the Incident record to a bug
in Jira. Developers and QA personnel can begin working on the bug in Jira with the key
information synchronized from Service Manager.

The integration administrator has the responsibility of determining the key information and
specifying the information in the field mapping (using the Integration Manager) for the
business owner to view updated (scheduled) information in Service Manager. The information
includes but isn't limited to the Incident record's title, description, severity, and Jira Phase.


For a complete use case, see Synchronize Service Manager Incident to Jira bug.

SM Change -> Jira new feature

A business owner creates a Normal Change request in Service Manager. On the Jira tab of the
Change request, this business owner selects the Change To New Feature action, and then
selects the Jira project. After saving these updates, the system synchronizes the Change
request to a feature in Jira. Developers and QA personnel can begin working on the feature in
Jira with the key information synchronized from Service Manager.

Similar to the SM Incident -> Jira bug use case, the integration administrator has the
responsibility of determining the key information and specifying the information in the field
mapping (using the Integration Manager) for the business owner to view updated (scheduled)
information in Service Manager. The information includes but isn't limited to the Change
request's title, description, severity, and Jira Phase.

For a complete use case, see Synchronize Service Manager Change to Jira new feature.


1.14.1. Configure the settings in Jira

User role: Jira Project Administrator
See the following prerequisites that you must follow when setting up the integration between
Service Manager and Jira. Ensure that you have working knowledge of Jira before you
proceed.
Detailed instructions about Jira administration are outside the scope of the OpenText product
suite and are hence not covered. For more information, see the Jira documentation.

Set up API Token or Personal Access Token

In Jira Cloud, you need to set up API access for Service Manager and grant Service Manager a
registered API token so that it can access Jira;
In Jira DataCenter, you need to set up Personal Access Token for Service Manager and grant
Service Manager a registered Personal Access Token so that it can access Jira DataCetner.
In the integration, Service Manager uses the API token or Personal Access Token for
authentication when synchronizing information with Jira.
Follow these steps to set up API Token on Jira Cloud:

   1. Sign in to Jira as a project administrator.
   2. Click Your profile and settings > Manage account, and then click Security.
   3. Click Create and manage API tokens under API token, and then click Create API token.
   4. Enter an appropriate label for the token, and then click Create.
   5. Click Create. A dialog displays with a new API token.

     Click Copy to copy this token to the clipboard so you can use it when configuring Service
     Manager that needs to access Jira.
   6. Click Close. The system adds the API token to the list.

Follow these steps to set up Personal Access Token on Jira Data Center:

   1. Sign in to Jira as a project administrator.
   2. Select your profile picture at the top right corner of the screen, and then choose Profile.
   3. Once you access your profile, select Personal Access Tokens in the left-hand menu.
   4. Select Create token.
   5. Give your new token a name.
   6. Optionally, for security reasons, you can set your token to automatically expire after a set

     number of days. The EXPIRES SOON status appears 5 days before the actual expiration


     date. Once the token expires, you can't reactivate it. You must create a new token.

   7. Click Create.

   8. Your personal access token is created. Copy the token and store it in a safe space. Once
     you click Close you won't be able to see your Token again.

Add custom fields

You need to manually add the SM ID and the SM Table fields to Jira. Hence, the synchronized
records in Jira can display the corresponding Service Manager ticket ID and the name of the
module table (for example, cm3r ). See the following screenshot as a sample display of these
two fields in Jira:

Follow these steps to add custom fields:

   1. Sign in to Jira as a project administrator.

   2. Click Settings > Issues, and then click Custom fields under FIELDS.

   3. Click Create custom field, and the Select a Field Type window opens.

   4. Select Text Field (read only), and then click Next.
   5. Enter a name for the custom field (for example, SM ID), and then click Create.

   6. Associate the SM ID field with the appropriate screens of your project. Select the required
     screens in the list, and then click Update.

  7. Continue to follow step 2 to step 6 to add the SM Table field and associate it with the
     appropriate screens.

   8. Obtain the ID of the SM ID and SM Table fields.

     Locate the SM ID field in the Custom fields list and then click the More (⋯) icon to the
     right of this field. Select the Edit details option and then observe the URL in your browser.
     This URL contains the ID of the field. For example, https://<Jira server


     name>.atlassian.net/secure/admin/EditCustomField!default.jspa?id=10009 . In this case,
     the ID of the SM ID field is 10009. Record this ID for later use when configuring Service
     Manager Integration Suite (SMIS) settings in Service Manager.
     Continue to follow this step and obtain the ID of the SM Table field.

Tip: To hide the custom fields, go to your project's Project settings and then edit the issue's
layout.


1.14.2. Configure the settings in Service
Manager

User role: Service Manager System Administrator
You must complete the following tasks from your Service Manager system to support the
integration.

Add an integration instance

To set up Jira integration, you must add and enable an instance of the Jira integration in
Service Manager Integration Manager.
To add and enable a Jira integration instance, follow these steps:

   1. Click Tailoring > Integration Manager to open Integration Instance Manager.
   2. Click Add. The Integration Template Selection wizard opens.
   3. Select SMJira from the Integration Template list, and then select Import Mapping.
   4. Click Next. The Integration Instance Information page opens.
   5. Complete the following settings on the Integration Instance Information page as

     necessary.

Setting                                 Value                                  Service Manager 9.81
ID                                      System-generated.
Name (required)                         User-defined.      Description

Version (required)                      1.0                ID of the integration
Interval Time (s)                       User-defined.      instance. Copy this ID for
(required)                                                 later use.
                                        User-defined.
Max Retry Times                                            Name of the integration
                                                           instance.

                                                           Default: SMJira.

                                                           Note: To integrate multiple
                                                           Jira projects, you can add
                                                           more integration instances
                                                           as necessary. Make sure
                                                           to use a unique name for
                                                           each SM-Jira integration
                                                           instance.

                                                           The version number of the
                                                           integration.

                                                           The interval time that the
                                                           integration background
                                                           schedule runs. For
                                                           example, if you set the
                                                           value to 300, the
                                                           background process tries
                                                           to execute the SMIS
                                                           integration task every 5
                                                           minutes.

                                                           Default: 60.

                                                           Maximum allowed number
                                                           of retries if the
                                                           background scheduler
                                                           fails to run.

                                                           Default: 5.

                                                           Note: The Jira integration
                                                           doesn't use this option.

Setting                                 Value                                        Service Manager 9.81
Log Level                               Select a level from the
                                        drop-down list.          Description
Log File Directory
                                        Specify a directory.     Level of diagnostic
                                                                 information that the
                                                                 Service Manager server
                                                                 logs to the log file
                                                                 directory. The possible log
                                                                 levels are DEBUG, INFO,
                                                                 WARNING, ERROR, and
                                                                 OFF.

                                                                 Default: INFO.

                                                                 This is a directory that
                                                                 exists on the Service
                                                                 Manager server host
                                                                 where log files are stored.
                                                                 The log includes
                                                                 information for receiving
                                                                 and processing
                                                                 messages.

                                                                 For example: c:\Jira_logs.

                                                                 If this field is empty, the
                                                                 system uses the Service
                                                                 Manager sever log
                                                                 ( sm.log ) for Jira
                                                                 integration.


Setting                                 Value           Description
Shared Scheduler                        User-defined.
                                                        The scheduler that the
                                                        integration instance uses
                                                        to schedule background
                                                        processes. Multiple
                                                        integration instances can
                                                        use a shared scheduler.

                                                        When you create an
                                                        integration template, you
                                                        can define a default
                                                        shared scheduler for the
                                                        instances that are based
                                                        on the template. All
                                                        instances that are based
                                                        on this template can use
                                                        the same shared
                                                        scheduler. However, if you
                                                        create an instance that
                                                        uses a different scheduler,
                                                        SMIS creates a new
                                                        scheduler accordingly.

                                                        If this field is empty, the
                                                        system uses <Jira
                                                        integration name +
                                                        instance ID> for Jira
                                                        integration.

Run at system startup                   True or false.  Automatically enable or
                                                        disable the integration
Description                             User-defined.   instance when the Service
                                                        Manager server starts.

                                                        Description of the
                                                        integration instance.

6. Click Next. The Integration Instance Parameters page opens.
7. Complete the following settings on the Connectivity tab as necessary.


Setting                                 Value                        Description
Deploy Type
Base URL                                Specify Jira deploy type     The type that Jira is
                                                                     deployed: Data Center or
Email / Username                                                     Cloud
Token
                                        Paste the base URL of the    The base URL of the Jira
                                        Jira server.                 server. The URL has the
                                                                     following format:

                                                                     https://<Jira server
                                                                     name>:<port>

                                                                     For
                                                                     example, https://<register
                                                                     ed site>.atlassian.net:443.

                                                                     Replace <Jira server
                                                                     name> with the IP address
                                                                     or fully-qualified domain
                                                                     name (FQDN) of the Jira
                                                                     server, and replace
                                                                     <port> with the
                                                                     communications port the
                                                                     Jira server uses.

                                        Type an email address if     The email address or user
                                        Jira is deployed on Cloud;   name that's used for the
                                                                     Jira account.
                                        Type the username
                                        if Deploy Type is Jira Data
                                        Center

                                        Paste a token string.        The token you received
                                                                     when setting up for
                                                                     Service Manager. If
                                                                     Deploy Type is Cloud,
                                                                     paste yor API Token; If
                                                                     Deploy Type is
                                                                     DataCenter, paste your
                                                                     Personal Access Token.


Setting                                 Value                     Description
Number of threads
                                        Specify the number of     The number of threads in
Proxy Host                              threads.                  a SMIS instance. You can
Proxy Port                                                        adjust the number of
Proxy User Name                                                   threads if a SMIS instance
Proxy Password                                                    needs to process many
                                                                  tasks. For more
                                                                  information, see Service
                                                                  Manager Jira Software
                                                                  (Jira) integration
                                                                  deployment sizing.

                                                                  The minimum number is 1
                                                                  and the maximum number
                                                                  is 4. For example, if the
                                                                  number of threads is 4,
                                                                  there are 4 background
                                                                  processes to process the
                                                                  task of this instance. All
                                                                  tasks distribute evenly to
                                                                  different background
                                                                  processes.

                                                                  Default: 1.

                                        Specify an IP address or  If you need to use a proxy
                                        domain name.              server to connect to the
                                                                  Jira server from the
                                        Specify a port number.    Service Manager server,
                                        Type an account name.     type the FQDN or IP
                                        Type a password.          address of the proxy
                                                                  server in this field.

                                                                  The port number of the
                                                                  proxy server.

                                                                  The user name that's used
                                                                  to connect to the proxy
                                                                  server.

                                                                  The password that's used
                                                                  to connect to the proxy
                                                                  server.


8. Click Verify Connection to verify the connection settings.
9. Complete the following settings on the Modules tab as necessary.

Option                                                                                     Service Manager 9.81
Jira Project
Project Alias                           Description

SM Table Field                          The key of the Jira project.

SM ID Field                             A unique alias of the Jira project. Later,
                                        when setting up an SM-Jira
Exclude Status                          synchronization, you need to select this
                                        alias of your Jira project on the Jira tab in
                                        a Change or an Incident record.

                                        Note: After cloning an SM-Jira
                                        integration instance in SMIS, make sure
                                        to update this field so that the project
                                        alias remains unique.

                                        The Jira field that displays the
                                        corresponding Service Manager table
                                        name.

                                        For example, if the SM Table field's ID in
                                        Jira is 10008, the value here is
                                        customfield_10008. For more information
                                        about how to get the ID of a custom field,
                                        see Add custom fields.

                                        The Jira field that displays the
                                        corresponding Service Manager ticket ID.

                                        For example, if the SM ID field's ID in Jira
                                        is 10009, the value here is
                                        customfield_10009. For more information
                                        about how to get the ID of a custom field,
                                        see Add custom fields.

                                        Review and update the Jira record's
                                        status for the selected options. Jira stops
                                        updating a bug or a new feature if it's in
                                        any of the listed statuses.


Option                                  Description
Enable Incident Module
                                        Select whether to enable the
Enable Change Module                    synchronization from SM Incident to Jira.
                                        The out-of-the-box SM-Jira integration
                                        synchronizes a Service Manager Incident
                                        to a Jira bug.

                                        Select whether to enable the
                                        synchronization from SM Change to Jira.
                                        The out-of-the-box SM-Jira integration
                                        synchronizes a Service Manager Change
                                        to a Jira new feature.

10. Click Next. The Integration Instance Fields page opens and displays the out-of-the-box
    fields available for both SM and Jira of the integration. You can review, update, or add
    more fields as required.

11. If you have selected more than one module in step 9, the Select Module page opens. You
    can either double-click a module or select a module from the list and then click Open
    Field Mapping to open the Integration Instance Fields page. Otherwise, if you have
    selected only one module in step 9, the Integration Instance Fields page opens directly.

    For your selected module, the system displays the out-of-the-box fields available for both
    SM and Jira of the integration. You can review, update, or add more fields as required.

12. Click Next. The Integration Instance Field Mappings page opens.

13. Review, update, or add more fields to the Field Mapping tab as necessary. For more
    information, see Manage mappings.

    To map fields:

       1. Select an SM field and a Jira endpoint field.
       2. Select a direction in the Direction column.
       3. (Optional) If an SM field to be mapped has multiple value selections (such as

          Urgency), specify a name in the Value Mapping Group column and then configure
          the value mappings on the Value Mapping tab.

14. Review, update, or add more fields to the Value Mapping tab as necessary. For more
    information, see Manage mappings.

    To map values:

       1. Enter a value mapping group name as you have specified on the Field Mapping tab.
       2. Enumerate the value mapping pairs between an SM field and a Jira endpoint field.
       3. Set the condition to true.

15. Click Finish. Service Manager creates the instance.


 16. Enable the integration instance. A processor for the Jira integration instance now runs in
     the background.

(Optional) Tailor the integration for more user scenarios

The out-of-the-box SM-Jira integration synchronizes a Service Manager Incident to a Jira bug.
Meanwhile, it also synchronizes a Normal Change request that's in the Build and Test phase in
Service Manager to a Jira new feature. To increase the usability and flexibility of this
integration, you can tailor the integration to work with more user scenarios.

Scenario 1: Use Jira integration with more Change categories

Regardless of the Change request's category, all you need to do is to add the Jira tab to a
target workflow phase of a Change request.

In the SM-Jira integration, Service Manager uses the Jira tab in a Change record to define the
Jira synchronization action and Jira project. This tab also displays a series of synchronization
information, including but isn't limited to the Jira Key, Synchronization Status, and Jira Issue
Type. Meanwhile, you can also select the attachments of a record on the Jira tab so as to
synchronize them to Jira. The following screenshot illustrates the Jira tab after Service
Manager synchronizes a Change record to a Jira new feature.

To display the Jira tab in any workflow phase of a Change request, you need to manually add
this tab to the corresponding form of that phase. Next, add the corresponding rule sets to the
target workflow phase. Refer to the following steps for some guidelines.

   1. Click Tailoring > Forms Designer.

   2. Search for the corresponding form of a phase. For example, to display the Jira tab when a
     Change enters the Validation phase, search for the chm.normal.registration form.

   3. Add a Notebook Tab widget to your Change format, and then set the following property of
     the Notebook Tab widget.


Property                                Value
Visible Condition                       [$smJira]

4. Add a subform to the Notebook Tab widget, and then set the following property of the
  subform control.

Property                                Value
Format                                  chm.subform.jira

   5. Save your changes.

Scenario 2: Synchronize a Normal Change request to Jira
improvement

You may hope to expand the SM-Jira integration to cover more synchronization cases, such as
synchronizing a Normal Change request that's in the Build and Test phase to Jira
improvement. In this case, you need to update the Jira issue types that the Change module
supports. Refer to the following steps for some guidelines.

   1. Click Tailoring > Script Library.

   2. Search for the SMJiraCustomerConfig JavaScript.

   3. Update function supportJiraTypes(module) as follows.

      function supportJiraTypes(module) {
             if (module == "cm3r") {
                    vars.$jiraActions = ["Improvement"];
                    vars.$jiraActionsDisplay = ["Change To Improvement"];
             } else if (module == "probsummary") {
                    vars.$jiraActions = ["Bug"];
                    vars.$jiraActionsDisPlay = ["Incident To Bug"];
             }

      }

  Hence, the Change To Improvement option appears in the Jira Action drop-down list on
  the Jira tab. You can select this option manually when synchronizing a Normal Change
  request that's in the Build and Test phase to Jira improvement.

4. For the system to select Change To Improvement option automatically when
  synchronizing a Normal Change request that's in the Build and Test phase to Jira
  improvement, update function changeAutoSync(file) as follows.


function changeAutoSync(file) {
       var assignmentGroup = file["assign.dept"];
       var projects =

jiraUtil.getAllEnabledInstance(funcs.filename(file));
       var isEnable = isInstanceEnable(projects);
       if (isEnable && assignmentGroup == "Application") {
              vars.$jiraProject = projects[0];
              vars.$jiraAction = "Improvement";
       }

}


1.14.3. Manage mappings

User role: Service Manager System Administrator, Jira Project Administrator
In the Service Manager and Jira integration, a mapping consists of field mapping and value
mapping.

Field Mapping

The Field Mapping tab defines the mapping between Jira fields and SM fields.

Field Mapping columns

The following table describes the columns on the Field Mapping tab.

 Column Name                                                                                     Service Manager 9.81
 SM Field
 Direction                              Description
 Endpoint Field
 SM Default                             The name of a field in Service Manager, and
                                        you can select a value from the list.
 Endpoint Default
                                        Indicates the mapping direction of a field
This PDF was generated on May 23, 2026  mapping, and has only three values to
                                        select from.

                                             ->: from SM Field to Jira Field.
                                             <-: from Jira Field to SM Field.
                                             <->: in both directions.

                                        The name of a field in Jira. You can select a
                                        field from the list.

                                        Defines the default value of the SM Field if
                                        there is no value or there is a constant in
                                        the corresponding Jira Field when mapping
                                        a Jira Field to an SM Field.
                                        Note: If the value is a date type, the format
                                        must resemble either 2022-06-
                                        18T00:00:00Z or 2022-06-
                                        18T00:00:00+08:00 .

                                        Defines the default value of a Jira Field if
                                        there is no value or there is a constant in
                                        the corresponding SM Field when mapping
                                        an SM Field to a Jira Field.
                                        Note: Jira time types include date and
                                        datetime , and the SM-Jira integration
                                        supports synchronization between SM date
                                        and Jira datetime . If the value is a date
                                        type, the format must resemble either
                                        2022-06-18T00:00:00Z or 2022-06-
                                        18T00:00:00+08:00 . However, if the value
                                        in Jira is of date type, Jira and SM need to
                                        be in the same time zone.

                                                                                                                     Page 1718 of 1727

Column Name                             Description
Value Mapping Group
                                        The name of a value mapping group to
                                        which a Jira Field and an SM Field belong. A
                                        value mapping group contains a collection
                                        of enumerated Jira and SM value pairs. The
                                        Service Manager value and Jira value will
                                        map according to the configuration on the
                                        Value Mapping tab.

                                        Note: You must configure a value mapping
                                        group if the type of an SM Field is different
                                        from that of a Jira Field.

Description                             Enter a text description for this field
                                        mapping.

Value Mapping

The Value Mapping tab defines the value mapping between Jira and SM for those fields that
have multiple values.

The following describes the columns on this tab.


Column Name                             Description
Value Mapping Group
                                        The name of a value mapping group. A
SM Values                               value mapping group contains a collection
Endpoint Values                         of enumerated Jira/SM value pairs.
Description
Condition                               The values of the Service Manager fields.

                                        The values of the Jira fields.

                                        Description of the value mapping.

                                        SMIS enables you to configure conditions
                                        for value mappings. You can set the
                                        Condition field of a value mapping entry to
                                        one of the following strings:

                                              true : The value mapping defined in
                                             this entry is always effective.
                                              false : The value mapping defined in
                                             this entry is always ineffective.
                                             A string that uses placeholder: The
                                             value mapping defined in this entry is
                                             effective only when the condition is
                                             met. For more information about how
                                             to use placeholders, see Use
                                             placeholders.

                                        For more information about how to
                                        configure a condition, see Configure a
                                        condition.

For example, below is a value mapping named IncidentPriority, and there are five mapping
entries for this value mapping group.

Note: In Endpoint Values, if the string is of object type, the value must be in a {"id":"<id
number>"} format. See the Example: Add value mappings for an SM field of Boolean type


section below for more information about how to get the endpoint values in Jira.
You can fill the name IncidentPriority in the Value Mapping Group column on the Field
Mapping tab.

This means when mapping the Priority field between a Service Manager Incident and a Jira
bug, if the value of the Urgency field in Service Manager is 3 , the value 3 maps to 3 for the
Priority field in Jira, and vice versa.

Example: Add value mappings for an SM field of Boolean
type

The following steps provide some guidelines about how to manage the mapping for an SM field
of boolean type.

   1. On the Field Mapping tab, fill in the name of the boolean field and define the
     synchronization direction.

   2. Define a custom field in Jira.

        1. Click Settings > Issues, and then click Custom fields under FIELDS.

        2. Click Create custom field, and the Select a Field Type window opens.

        3. Select Select List (single choice), and then click Next.

        4. Enter a name for the custom field (for example, Booleantest), add two options True
           and False, and then click Create.

   3. Fill in the Endpoint Field column with Booleantest.

   4. In Jira, locate the Booleantest field in the Custom fields list and then click the More (⋯)
     icon to the right of this field. Select the Contexts and default value option and then click
     Edit Options.

     Click Edit for the True option and then observe the URL in your browser. This URL
     contains a value of the option. For example, https://<Jira server
     name>.atlassian.net/secure/admin/EditCustomFieldOptions!edit.jspa?
     fieldConfigId=xxxx&atl_token=xxxx&selectedValue=10113 . In this case, the value of the
     True option is 10113. Record this value.

     Similarly, find and record the value of the False option. For example, 10114.


5. Specify a name in the Value Mapping Group column and then configure the value
  mapping as follows on the Value Mapping tab.

Value Mapping Group                     SM Values  Endpoint Values
                                        true       {"id":"10113"}
<Value mapping group
name>                                   false      {"id":"10114"}

<Value mapping group
name>

6. Save your changes.


1.14.4. Verify the integration

User role: Service Manager system administrator

The following synchronization tasks describe how to verify the SM-Jira integration. Pay
attention to the following notes before proceeding with these tasks.

   1. Attachments and new updates synchronization

     The synchronization process for attachments and new updates is unidirectional and
     incremental. That is, you can only synchronize attachments and new updates from
     Service Manager to Jira only. Meanwhile, if you remove attachments and new updates
     from Service Manager after synchronization, the attachments and comments in Jira aren't
     affected.

   2. Formatting synchronization

     New Update

     You can enter notes in the New Update field with standard HTML formatting. However,
     when synchronizing the New Update field from Service Manager to Jira, the HTML
     formatting of the notes is lost by design and these notes appear as plain text in Jira
     comments.

     Description

     Out-of-the-box, the synchronization process for the Description field is bidirectional. It's
     notable that your input in the Description field in Service Manager is plain text, whereas
     the Description field in Jira supports formatting. By design, Service Manager doesn't
     process the formatting from Jira when synchronizing the Description field. As a result,
     descriptions with formatting from Jira may have unreadable or data loss issues after
     synchronization. Hence, keep your input in the Description field in Jira as plain text. If you
     configure other formatted fields in Jira as the Endpoint Field in field mapping, keep the
     content in such fields in plain text as well.

SM Incident -> Jira bug

The following example verifies the integration by synchronizing an SM Incident to a Jira bug.

   1. Synchronize an SM Incident to a Jira bug.

        1. Navigate to Incident Management, and then open an Incident whose status isn't
           Closed.

        2. Click the Jira tab. The background synchronization tasks start after filling in the Jira
           synchronization action and the Jira project. There are two ways: manually or
           automatically.

           To automatically fill the Jira synchronization action and the Jira project, check that
           the SMJiraCustomerConfig JavaScript exists in Script Library. The automatic


Incident synchronization function in this script may resemble the following.

/**

* Update the conditions for automatic synchronization of

Incident

* vars.$jiraProject: The integration instance ID

* vars.$jiraAction: The type of the Jira issue

* Example: If the assignment of the Incident is "Application",

   *                                    The current Incident record will be synchronized to

Jira's SMBT project as a Bug.

*/

function incidentAutoSync(file) {

      var assignment = file["assignment"];

      var projects =

jiraUtil.getAllEnabledInstance(funcs.filename(file));

      var isEnable = isEnstanceEable(projects);

      if (isEnable && assignment == "Application") {

          vars.$jiraProject = projects[0];

          vars.$jiraAction = "Bug";

      }

}

  You can update the parameters for isEnable && assignment , vars.$jiraProject , and
   vars.$jiraAction as required to redefine the conditions for automatic Incident
  synchronization.

  Otherwise, manually select Incident To Bug in the Jira Action drop-down list, and
  select the Jira project (project alias) in the Jira Project drop-down list. Save this
  Incident to commence the synchronization process.

3. After Service Manager runs the integration background process, Jira creates a bug.
  In Service Manager, the Jira Key, Jira Phase, Synchronization Status, Jira Issue
  Type, and Last Synchronization Time fields on the Jira tab have read-only values
  that are populated automatically.


Field                                   Description
Jira Key                                The bug's ID in Jira.
Jira Phase                              The bug's status in Jira.
Synchronization Status                  The synchronization status.
Jira Issue Type                         Bug.
Last Synchronization Time               The last synchronization time between
                                        SM and Jira.

   2. Update some fields, add attachments, and then perform synchronization again from the
     SM Incident to the Jira bug.

        1. Open the Incident record again and then update the title, description, and urgency
           information.

        2. Click the Activities tab. Select Update to external service in the Update Type drop-
           down list, and then enter some notes in the Update field.

        3. Click the Attachments tab and add some attachments to the Incident record. Save
           your updates.

        4. Click the Jira tab and then click Add to select the attachments from the current
           Incident record for Jira synchronization.

        5. Click Save and then wait for the next synchronization.

   3. View the synchronization result in the Jira bug.

     Click View in Jira. Sign in to Jira and open the bug record. Check that your updates to the
     title, description, and urgency in the SM Incident record are synchronized to the
     corresponding fields in the Jira bug record. Meanwhile, your notes in the SM Update field
     now appear as comments in the Jira bug record. Your selected attachments in the SM
     Incident record now appear as the Jira bug record's attachments as well.

For a complete use case, see Synchronize Service Manager Incident to Jira bug.

SM Change -> Jira new feature

The following example verifies the integration by synchronizing an SM Change to a Jira new
feature.

   1. Synchronize an SM Change to a Jira new feature.

        1. Open the workflow of a Normal Change and click the Build And Test phase. Make
           sure that the chm.jira.enter rule set exists in On enter and the
           chm.jira.assignproject rule set exists in On update.


2. Navigate to Change Management, and then open a Normal Change record that's in
  the Build and Test phase.

3. Click the Jira tab. The background synchronization tasks start after filling in the Jira
  synchronization action and the Jira project. There are two ways: manually or
  automatically.

  To automatically fill the Jira synchronization action and the Jira project, check that
  the SMJiraCustomerConfig JavaScript exists in Script Library. The automatic
  Change synchronization function in this script may resemble the following.

/**

* Update the conditions for automatic synchronization of Change

* vars.$jiraProject: The integration instance ID

* vars.$jiraAction: The type of the Jira issue

* Example: If the assignmentGroup of the Change is

"Application",

   *                                    The current Change record will be synchronized to

Jira's SC project as a New Feature

*/

function changeAutoSync(file) {

      var assignmentGroup = file["assign.dept"];

      var projects =

jiraUtil.getAllEnabledInstance(funcs.filename(file));

      var isEnable = isEnstanceEable(projects);

      if (isEnable && assignmentGroup == "Application") {

         vars.$jiraProject = projects[0];

         vars.$jiraAction = "New Feature";

      }

}

  You can update the parameters for isEnable && assignment , vars.$jiraProject , and
   vars.$jiraAction as required to redefine the conditions for automatic Change
  synchronization.

  Otherwise, manually select Change To New Feature in the Jira Action drop-down
  list, and select the Jira project (project alias) in the Jira Project drop-down list. Save
  this Change to commence the synchronization process.

4. After Service Manager runs the integration background process, Jira creates a new
  feature. The Jira Key, Jira Phase, Synchronization Status, Jira Issue Type, and Last
  Synchronization Time fields on the Jira tab have read-only values that are populated
  automatically.


Field                                   Description
Jira Key                                The new feature's ID in Jira.
Jira Phase                              The new feature's status in Jira.
Synchronization Status                  The synchronization status.
Jira Issue Type                         New feature.
Last Synchronization Time               The last synchronization time between
                                        SM and Jira.

   2. Update some fields, add attachments, and then perform synchronization again from the
     SM Change to the Jira new feature.

        1. Open the Change record again and then update the title and description information.

        2. Click the Activities tab. Select Update to external service in the New Update Type
           drop-down list, and then enter some notes in the New Update field.

        3. Click the Attachments tab and add some attachments to the Change record. Save
           your updates.

        4. Click the Jira tab and then click Add to select the attachments from the current
           Change record for Jira synchronization.

        5. Click Save and then wait for the next synchronization.

   3. View the synchronization result in the Jira new feature.

     Click View in Jira. Sign in to Jira and then open the new feature record. Check that your
     updates to the title and description in the SM Change record are synchronized to the
     corresponding fields in the Jira new feature record. Meanwhile, your notes in the SM New
     Update field now appear as comments in the Jira new feature. Your selected attachments
     in the SM Change record now appear as the Jira new feature record's attachments as
     well.

For a complete use case, see Synchronize Service Manager Change to Jira new feature.

            © Copyright 2026 Open Text
For more info, visit https://docs.microfocus.com
````
