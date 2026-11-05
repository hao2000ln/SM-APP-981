---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.12 .. 1.12
printed_pages: 1624-1649
---

# 1.12 ALM Octane

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.12. ALM Octane

ALM Octane is a web-based application lifecycle management platform that enables teams to
collaborate easily, manage the product delivery pipeline, and visualize the impact of changes.
In the integration between Service Manager (SM) and ALM Octane in your release lifecycle,
Service Manager acts as the service provider and tightly couples defect/feature
management in ALM Octane with the Change Management capabilities in SM. ALM Octane
provides REST API and enables the users to retrieve and perform CRUD (create, read, update,
delete) operations on the entities available in the Octane graphical user interface. The record
creation and update between Service Manager and ALM Octane are synchronized through
Integration Manager (SMIS) tasks in Service Manager.

This integration synchronizes SM Change to ALM Octane defect/feature for record creation.
The following scenarios are included:

     SM Change -> ALM Octane defect
     SM Change -> ALM Octane feature

After record creation, this integration implements bidirectional record updates seamlessly
between SM Change and ALM Octane defect/feature.

The overall intent of this integration is:

     Leverages SM's position as the service provider and application with the most intimate
     contact with the customer
     Efficiently tracks, reconciles, and resolves the demands placed within SM

Sample use case

The following typical use cases shed some light on how you can use this integration in your
organization.

SM Change -> ALM Octane defect

A business owner creates a Normal Change request in Service Manager and later the Normal
Change enters the Build and Test phase. On the Octane tab of the Change request, this
business owner selects the Change To Defect action, and then selects the ALM Octane
workspace. After saving these updates, the system synchronizes the Change request to a
defect in ALM Octane. Developers and QA personnel can begin working on the defect in ALM
Octane, in which the key information is synchronized from Service Manager to ALM Octane.

The integration administrator has the responsibility of determining the key information and
specifying the information in the field mapping (using the Integration Manager) in order for the
business owner to view updated (scheduled) information in Service Manager. The information
includes the Change request's title, description, severity, Octane Phase, and so on.

For complete use cases, see Synchronize Service Manager Change to ALM Octane defect.


SM Change -> ALM Octane feature

A business owner creates a Normal Change request in Service Manager and later the Normal
Change enters the Build and Test phase. On the Octane tab of the Change request, this
business owner selects the Change To Feature action, and then selects the ALM Octane
workspace. After saving these updates, the system synchronizes the Change request to a
feature in ALM Octane. Developers and QA personnel can begin working on the feature in ALM
Octane, in which the key information is synchronized from Service Manager to ALM Octane.

Similar to the SM Change -> ALM Octane defect use case, the integration administrator has the
responsibility of determining the key information and specifying the information in the field
mapping (using the Integration Manager) in order for the business owner to view updated
(scheduled) information in Service Manager. The information includes the Change request's
title, description, severity, Octane Phase, and so on.

For complete use cases, see Synchronize Service Manager Change to ALM Octane feature.


1.12.1. Configure the settings in ALM Octane

User role: ALM Octane Administrator

See the following prerequisites that you must follow when setting up the integration between
Service Manager and ALM Octane. Ensure that you have working knowledge about ALM
Octane before you proceed.

Detailed instructions about ALM Octane administration are outside the scope of the OpenText
product suite and are hence not covered. For more information, see the ALM Octane
documentation.

Set up API access

You need to set up API access for Service Manager and grant Service Manager registered
access keys (Client ID and a Client secret) so that it can access ALM Octane. In the SM-Octane
integration, Service Manager uses the Client ID and Client secret for authentication when
synchronizing information with ALM Octane.

Follow these steps:

   1. Sign in to ALM Octane as a system administrator.
   2. Click Settings > Spaces > API ACCESS, and then click + API Access.
   3. Enter an appropriate name for the access.
   4. (Optional) Set an expiration date for the API key, and then enter a description if needed.
   5. Select the predefined roles of API and other user roles as required (for example, Team

     Member) for Service Manager to use when accessing ALM Octane.
     Select the relevant workspaces for each role. If additional relevant workspaces are
     created later, you will need to manually assign them.
   6. Click Add. A dialog displays with a Client ID and a Client secret.
     Click Copy to copy these keys to the clipboard so you can use them when configuring
     Service Manager that needs to access ALM Octane.
   7. Click OK. The access ID is added to the grid and its status is active.

Add custom fields

You need to manually add the sm_id and the sm_table user-defined fields (UDFs) to ALM
Octane so that the defects in ALM Octane can display the corresponding Service Manager
Change ticket ID and the name of the module table (cm3r). See the following screenshot as a
sample display of these two fields in ALM Octane:

Follow these steps:                     Page 1626 of 1727

This PDF was generated on May 23, 2026

1. Sign in to ALM Octane as a system administrator.
2. Click Settings >Spaces, and then select the shared space or the workspace where you

  want to create user-defined fields.
3. Click the ENTITIES tab.
4. In the Entities list on the left side of the pane, select Defect.
5. Click the FIELDS tab, and then click + Field to add a user-defined field.
6. Enter the following relevant values.

Name                                    Description
Name
                                        A unique name that APIs will use to
                                        access this field. No uppercase letters or
                                        punctuation allowed. ALM Octane
                                        automatically adds the suffix _udf to the
                                        name of the field.

                                        Enter sm_id in this field.

                                        Note: UDFs can only be defined in
                                        English even if ALM Octane has been
                                        localized for a specific language. Labels,
                                        however, can be specified in other
                                        languages.

Label                                   A unique name for the field as you want it
                                        displayed in the UI. You can enter
Type                                    English, non-English, and special
Description                             characters.

                                        Select String field from the drop-down
                                        list.

                                        (Optional) Enter a description for the
                                        user-defined field.

                                        Note: The description text remains the
                                        same for all ALM Octane display
                                        languages.

7. Click Add. The sm_id_udf field is available in ALM Octane just like other predefined
  system fields.

8. Continue to follow step 5 and step 6 to add the sm_table_udf field. See the following
  screenshot as an example:


   9. In the Entities list on the left side of the pane, select Feature.
 10. Continue to follow step 5 to step 8 to add both the sm_id_udf field and the sm_table_udf

     field for ALM Octane features.

Add a rule to restrict the writing permission to the
custom fields

You can define a rule that triggers actions in ALM Octane when certain conditions are met. In
this task, you need to manually add a rule to restrict the writing permission to both the sm_id
and the sm_table user-defined fields. Both fields are read-only to all ALM Octane users and
can be updated by the background API only.

Follow these steps:

   1. Sign in to ALM Octane as a system administrator.
   2. Click Settings >Spaces, and then select the shared space or the workspace where you

     want to create user-defined fields.
   3. Click the ENTITIES tab.
   4. In the Entities list on the left side of the pane, select Defect.
   5. On the RULES tab, click + to add a rule.
   6. On the ACTION tab, enter the following relevant values.

Name                                    Description
Status
Action                                  Status of the rule.

Field                                   When conditions are met, the rule's
Remark                                  action is performed. Select Make read-
                                        only from the drop-down list.

                                        Select both the sm_id and the sm_table
                                        fields.

                                        (Optional) Enter a remark that describes
                                        the rule.


7. On the CONDITION tab, apply the following condition.

      Not("Current User Role" include "API")

  See the following screenshot as an example:

    In this example, both fields are read-only to all ALM Octane users and can be updated by
    the background API only. You can add your own rule as required to restrict the writing
    permission to these two fields.
 8. Click OK. The new rule is available in ALM Octane just like other predefined rules. See the
    following screenshot as an example:

 9. In the Entities list on the left side of the pane, select Feature.
10. Continue to follow step 5 to step 8 to add the rule for both the sm_id and the sm_table

    fields for ALM Octane features.


1.12.2. Configure the settings in Service
Manager

User role: Service Manager System Administrator
You must complete the following tasks from your Service Manager system to support the
integration.

Add an integration instance

To set up ALM Octane integration, you must add and enable an instance of the ALM Octane
integration in Service Manager Integration Manager.
To add and enable an ALM Octane integration instance, follow these steps:

   1. Click Tailoring > Integration Manager to open Integration Instance Manager.
   2. Click Add. The Integration Template Selection wizard opens.
   3. Select SMOctane from the Integration Template list, and then select Import Mapping.
   4. Click Next. The Integration Instance Information page opens.
   5. Complete the following settings on the Integration Instance Information page as

     necessary.

Setting                                 Value                              Service Manager 9.81
Name (required)                         User-defined.
                                                       Description
Version (required)                      1.0
                                        User-defined.  Name of the integration
Interval Time (s)                                      instance.
(required)
                                                       Default: SMOctane.
Max Retry Times                         User-defined.
                                                       Note: If your ALM Octane
                                                       has multiple workspaces
                                                       to be integrated, you can
                                                       add more integration
                                                       instances as necessary.
                                                       Make sure to use a unique
                                                       name for each SM-Octane
                                                       integration instance.

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

                                                       Note: The ALM Octane
                                                       integration doesn't use
                                                       this option.

Setting                                 Value                                        Service Manager 9.81
Log Level                               Select a level from the
                                        drop-down list.          Description
Log File Directory
                                        Specify a directory.     Level of diagnostic
                                                                 information that the
                                                                 Service Manager server
                                                                 logs to the log file
                                                                 directory. The possible log
                                                                 levels are DEBUG, INFO
                                                                 (default), WARNING,
                                                                 ERROR, and OFF.

                                                                 Default: INFO.

                                                                 This is a directory that
                                                                 exists on the Service
                                                                 Manager server host
                                                                 where log files are stored.
                                                                 The log includes
                                                                 information for receiving
                                                                 and processing
                                                                 messages.

                                                                 For example:
                                                                 c:\Octane_logs.

                                                                 If this field is empty, the
                                                                 system uses the Service
                                                                 Manager sever log
                                                                 (sm.log) for ALM Octane
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
                                                        system uses <Octane
                                                        integration name +
                                                        instance ID> for ALM
                                                        Octane integration.

Run at system startup                   True or false.  Automatically enable or
                                                        disable the integration
Description                             User-defined.   instance when the Service
                                                        Manager server starts.

                                                        Description of the
                                                        integration instance.

6. Click Next. The Integration Instance Parameters page opens.
7. Complete the following settings on the Workspace tab as necessary.


Setting                                 Value                     Description
Name                                    User-defined.
Sharespace                              Paste the sharespace ID.  Name of the workspace.

Workspace                                                         The ID of the sharespace.

                                                                  For example, if the ALM
                                                                  Octane URL is
                                                                  https://<Octane server
                                                                  name>:<port>/ui/?
                                                                  p=1001/1002#/product-
                                                                  overview/hierarchy/defect
                                                                  s, the ID of the
                                                                  sharespace is 1001.

                                        Paste the workspace ID.   The ID of the workspace.

                                                                  For example, if the ALM
                                                                  Octane URL is
                                                                  https://<Octane server
                                                                  name>:<port>/ui/?
                                                                  p=1001/1002#/product-
                                                                  overview/hierarchy/defect
                                                                  s, the ID of the workspace
                                                                  is 1002.


Setting                                 Value                      Description
Base URL
                                        Paste the base URL of the  The base URL of the ALM
                                        ALM Octane server.         Octane server. The URL
                                                                   has the following format:

                                                                   https://<Octane server
                                                                   name>:<port>

                                                                   Replace <Octane server
                                                                   name> with the IP address
                                                                   or fully-qualified domain
                                                                   name (FQDN) of the ALM
                                                                   Octane server, and
                                                                   replace <port> with the
                                                                   communications port the
                                                                   ALM Octane server uses.

                                                                   Note

                                                                   To set up an
                                                                   HTTPS
                                                                   connection,
                                                                   make sure to
                                                                   add the ALM
                                                                   Octane server
                                                                   root CA
                                                                   certificate to
                                                                   the SM trust
                                                                   store so as to
                                                                   verify the
                                                                   connection.
                                                                   See the Add
                                                                   the ALM
                                                                   Octane root
                                                                   CA certificate
                                                                   to the SM trust
                                                                   store section
                                                                   below.


Setting                                 Value                      Description
Client Id                               Paste a client ID string.
                                                                   The client ID you received
Client Secret                           Paste a client secret      when setting up API
                                        string.                    access for Service
                                                                   Manager.
Ahead of Octane Time (s) User-defined.
                                                                   The client secret string
                                                                   you received when setting
                                                                   up API access for Service
                                                                   Manager.

                                                                   The time difference
                                                                   between the Service
                                                                   Manager server and the
                                                                   ALM Octane server. The
                                                                   value can be either
                                                                   positive or negative. For
                                                                   example, if the SM server
                                                                   time is 12:02:00 and the
                                                                   ALM Octane server time is
                                                                   12:00:00, the value is 120.

8. Select the options on the Modules tab as necessary. Review and update the Octane
  phases under the selected options. Service Manager stops updating an ALM Octane
  defect or feature if it is in any of the listed phases.

Option                                  Value                      Description
                                        User-selected.
Enable SM Change to                                                Select whether to enable
Octane Defect                                                      the synchronization from
                                                                   SM Change to ALM
Enable SM Change to                     User-selected.             Octane Defect.
Octane Feature
                                                                   Select whether to enable
                                                                   the synchronization from
                                                                   SM Change to ALM
                                                                   Octane Feature.

 9. Click Verify Connection to verify the connection settings.

10. Click Next. The Integration Instance Fields page opens and displays the out-of-the-box
    fields available for both SM and ALM Octane of the integration. You can review, update, or
    add more fields as required.


 11. If you have selected more than one module in step 8, the Select Module page opens. You
     can either double-click a module or select a module from the list and then click Open
     Field Mapping to open the Integration Instance Fields page. Otherwise, if you have
     selected only one module in step 8, the Integration Instance Fields page opens directly.

     For your selected module, the system displays the out-of-the-box fields available for both
     SM and ALM Octane of the integration. You can review, update, or add more fields as
     required.

 12. Click Next. The Integration Instance Field Mappings page opens.

 13. Review, update, or add more fields to the Field Mapping tab as necessary. For more
     information, see Manage mappings.

     To map fields:

        1. Select an SM field and an ALM Octane endpoint field.
        2. Select a direction in the Direction column.
        3. (Optional) If an SM field to be mapped has multiple value selections (such as

           Impact), specify a name in the Value Mapping Group column and then configure the
           value mappings on the Value Mapping tab.

 14. Review, update, or add more fields to the Value Mapping tab as necessary. For more
     information, see Manage mappings.

     To map values:

        1. Enter a value mapping group name as you have specified on the Field Mapping tab.
        2. Enumerate the value mapping pairs between an SM field and an ALM Octane

           endpoint field.
        3. Set the condition to true.

 15. Click Finish. Service Manager creates the instance.

 16. Enable the integration instance. A processor for the ALM Octane integration instance now
     runs in the background.

            Note

           If your ALM Octane has multiple workspaces to be integrated, you can add more
           integration instances as necessary.

Add the ALM Octane root CA certificate to the SM trust
store

If you are setting up an HTTPS connection, follow these steps to add the ALM Octane server
root CA certificate to the SM trust store by using the certificate generation toolkit.

   1. Export ALM Octane root CA certification to a file. For example, octaneca.crt.


   2. Import octaneca.crt to the SM trust store. See the following sample commands.
     Non-FIPS mode:

          import-cert.bat --alias octaneca --file certs/octaneca.crt --
          keystore certs/cacerts --storepass changeit

     FIPS mode:

          import-cert.bat --alias octaneca --file certs/octaneca.crt --
          keystore certs/cacerts --storetype bcfks --storepass changeit

   3. Copy cacerts to the <SM_SERVER_HOME>/RUN folder.
   4. Update sm.ini by adding the following lines:

          truststoreFile:cacerts
          truststorePass:changeit

   5. Restart the SM server.

(Optional) Tailor the integration for more Change
categories and workflow phases

The out-of-the-box SM-Octane integration synchronizes a Normal Change request that is in
the Build and Test phase in Service Manager to an ALM Octane defect/feature. You can tailor
the integration to work with more Change category and more workflow phases so as to
increase the usability and flexibility of this integration. Regardless of the Change request's
category, all you need to do is to add the Octane tab to a target workflow phase of a Change
request.
In the SM-Octane integration, Service Manager uses the Octane tab in a Change record to
define the Octane synchronization action and Octane workspace. This tab also displays a
series of synchronization information, including Octane Id, Octane Type, Octane Phase, Octane
Last Update Time, and so on. Meanwhile, you can also select the attachments of a record on
the Octane tab so as to synchronize them to Octane. The following screenshot illustrates
the Octane tab after Service Manager synchronizes a Change record to an ALM Octane Defect.


To display the Octane tab in any workflow phase of a Change request, you need to manually
add this tab to the corresponding form of that phase. Refer to the following steps for some
guidelines.

   1. Click Tailoring > Forms Designer.

   2. Search for the corresponding form of a phase. For example, to display the Octane tab
     when a Change enters the Validation phase, search for the chm.normal.registration
     form.

   3. Add a Notebook Tab widget to your Change format, and then set the following property of
     the Notebook Tab widget.

Property                                Value
Visible Condition                       [$G.octane.enable]

4. Add a subform to the Notebook Tab widget, and then set the following property of the
  subform control.

Property                                Value
Format                                  octane.info

5. Save your changes.


1.12.3. Manage mappings

User role: Service Manager System Administrator, ALM Octane System Administrator
In the Service Manager and ALM Octane integration, a mapping consists of field mapping and
value mapping.

Field Mapping

The Field Mapping tab defines the mapping between ALM Octane fields and SM fields.

Field Mapping columns

The following table describes the columns on the Field Mapping tab.

Column Name                                                                                      Service Manager 9.81
SM Field
Direction                               Description

Endpoint Field                          The name of a field in Service Manager, and
SM Default                              can be selected from the list.

                                        Indicates the mapping direction of a field
                                        mapping, and has only three values to
                                        select from.

                                             ->: from SM Field to ALM Octane Field.
                                             <-: from ALM Octane Field to SM Field.
                                             <->: in both directions.

                                        The name of a field in ALM Octane, and can
                                        be selected from the list.

                                        Defines the default value of the SM Field if
                                        there is no value or there is a constant in
                                        the corresponding ALM Octane Field when
                                        mapping an ALM Octane Field to an SM
                                        Field.

                                                    Note

                                                   If the value is a date type, the
                                                   format must resemble either
                                                   2022-06-18T00:00:00Z or
                                                   2022-06-18T00:00:00+08:00 .

Column Name                                                                                      Service Manager 9.81
Endpoint Default
                                        Description

                                        Defines the default value of an ALM Octane
                                        Field if there is no value or there is a
                                        constant in the corresponding SM Field
                                        when mapping an SM Field to an ALM
                                        Octane Field.
                                        Example 1: Suppose you have defined the
                                        create_from field in Octane and then
                                        configure the field mapping as follows.

This PDF was generated on May 23, 2026  ALM Octane automatically fills the Create
                                        From field with the value of Create from SM

                                                                                                                     Page 1642 of 1727
Column Name                                                                                      Service Manager 9.81

                                        Description

                                        when creating this defect from an SM
                                        Change.

                                        Example 2: If you enter a constant
                                        $detectedBy in SM Field and then enter
                                        {"type":"workspace_user","id":"1001"} in
                                        Endpoint Default, ALM Octane
                                        automatically fills the Detected by field with
                                        the name of a workspace user whose ID is
                                        1001 when creating this defect from an SM
                                        Change.

                                                    Note

                                                   If the value is a date type, the
                                                   format must resemble either
                                                   2022-06-18T00:00:00Z or
                                                   2022-06-18T00:00:00+08:00 .

Value Mapping Group                     The name of a value mapping group to
                                        which an ALM Octane Field and an SM Field
                                        belong. A value mapping group contains a
                                        collection of enumerated ALM Octane and
                                        SM value pairs. The Service Manager value
                                        and ALM Octane value will be mapped
                                        according to the configuration on the Value
                                        Mapping tab.

Description                             Enter a text description for this field
                                        mapping.

Value Mapping

The Value Mapping tab defines the value mapping between ALM Octane and SM for those
fields that have multiple values.

The following describes the columns on this tab.


Column Name                             Description
Value Mapping Group
                                        The name of a value mapping group. A
SM Values                               value mapping group contains a collection
Endpoint Values                         of enumerated ALM Octane/SM value pairs.

Description                             The values of the Service Manager fields.
Condition
                                        The values of the ALM Octane fields. For
                                        more information about how to get the
                                        endpoint values, see the Get the endpoint
                                        values in ALM Octane section below.

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
                                             to use place holder, see Use
                                             placeholders.

                                        For more information about how to
                                        configure condition, see Configure a
                                        condition.

For example, below is a value mapping named ChangeSeverity, and there are five mapping
entries for this value mapping group.


The name ChangeSeverity can be filled in the Value Mapping Group column on the Field
Mapping tab.

This means when mapping the Severity field between a Service Manager Change and an ALM
Octane Defect, if the value of the Severity field in Service Manager is 3, the value 3 will be
mapped to medium for the Severity field in ALM Octane, and vice versa.

Get the endpoint values in ALM Octane

The following example uses Google Chrome as an example. Follow these steps to get the
endpoint values in ALM Octane:

   1. Click Settings > Spaces > LISTS, and then select a list. For example, Severity.
     ALM Octane lists contain values for list type fields. For example, the Severity list contains
     a list of possible severity values, including Low, Medium, High, Very High, and Critical.

   2. Open the Web Developer Tools in your browser, and then click the Network tab.
   3. In the Name list on the left side of the pane, select the name that begins with list_nodes?

     fields=... .
   4. Click the Preview tab on the right side of the pane, and then expand the data node to

     display all data on the list. See the following screenshot as an example:

The value for the EndPoint Values field includes both the type and id sections. For
example, {"type":"list_node","id":"list_node.severity.urgent"} .


1.12.4. Verify the integration

User role: Service Manager system administrator

SM Change -> ALM Octane defect/feature

The following example verifies the integration by synchronizing an SM Change to an ALM
Octane defect/feature.

   1. Synchronize an SM Change to an ALM Octane defect/feature.

        1. Navigate to Change Management, and then open a Normal Change record that is in
           the Build and Test phase.

        2. Click the Octane tab.

        3. To synchronize an SM Change to an ALM Octane defect, select Change To Defect in
           the Octane Action drop-down list, and then select your ALM Octane workspace in
           the Octane Workspace drop-down list.

           To synchronize an SM Change to an ALM Octane feature, select Change To Feature
           in the Octane Action drop-down list, and then select your ALM Octane workspace in
           the Octane Workspace drop-down list.

        4. Click Save and then wait for the background schedule to synchronize the Change
           record to ALM Octane. After synchronization, the Octane Id, Octane Type, Octane
           Phase, Octane Last Update Time, Synchronization Status, and Last Synchronization
           Time fields on the Octane tab have read-only values that are populated
           automatically.


Field                                   Description
Octane Id
Octane Type                             The defect ID in Octane.
Octane Phase
                                        Defect.
Octane Last Update Time
                                        The defect's or feature's phase in
                                        Octane.

                                        The time when the defect/feature is
                                        created in ALM Octane for the first-
                                        time synchronization.
                                        Note: For the later synchronizations,
                                        this field displays the last time when
                                        the defect/feature is updated by a user
                                        in ALM Octane.

Synchronization Status                  The synchronization status.
Last Synchronization Time
                                        The last synchronization time between
                                        SM and ALM Octane.

2. Update some fields, add attachments, and then perform synchronization again from the
  SM Change to the ALM Octane defect/feature.

     1. Open the Change record again and then click the Change Details tab. Update the
        title, description, and severity information.

     2. Click the Activities tab. Select Update to external service in the New Update Type
        drop-down list, and then enter some notes in the New Update field.

     3. Click the Attachments tab, and then add some attachments to the Change record.
        Next, click the Octane tab and then click Add to select the attachments from the
        current Change record for Octane synchronization.

     4. Click Save and then wait for the next synchronization.

3. View the synchronization result in the ALM Octane defect/feature.

     1. Click the View in Octane button. The browser opens a new tab and then displays
        the ALM Octane login page.

     2. Sign in to ALM Octane and the system opens the defect/feature record
        automatically. Check that your updates to the title, description, and severity in the
        SM Change record are synchronized to the corresponding fields in the ALM Octane
        defect/feature record. Meanwhile, your notes in the SM New Update field now


           appear as comments in the ALM Octane defect/feature record. Your selected
           attachments in the SM Change record now appear as the ALM Octane
           defect/feature record's attachments as well.

            Note

           The synchronization process for attachments and new updates is unidirectional
           and incremental. That is, you can only synchronize attachments and new updates
           from SM to ALM Octane only. Meanwhile, if you remove attachments and new
           updates from SM after synchronization, the attachments and comments in ALM
           Octane are not affected.

For a complete use case, see Synchronize Service Manager Change to ALM Octane defect and
Synchronize Service Manager Change to ALM Octane feature.
````
