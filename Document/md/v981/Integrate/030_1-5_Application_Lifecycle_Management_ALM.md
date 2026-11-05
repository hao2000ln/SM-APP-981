---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.5 .. 1.5
printed_pages: 819-851
---

# 1.5 Application Lifecycle Management (ALM)

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.5. Application Lifecycle Management (ALM)

Application Lifecycle Management (ALM) empowers organizations to manage the core
application lifecycle and grants application teams the crucial visibility and collaboration needed
for the predictable, repeatable, and adaptable delivery of modern applications. The SM-ALM
integration provides a bi-directional interface to exchange defects and requirements between
Service Manager (SM) and ALM. The overall intent of this integration is as follows.

     Leverages Service Manager's position as the service provider and application with the
     most intimate contact with the customer.
     Efficiently reconciles and resolves the demands placed within Service Manager.
     Tightly couples the demands placed within Service Manager with the ALM requirement
     management and defect management capabilities within Service Manager.

Defects and Requirements Exchange with Service Manager includes the following scenarios:

     Synchronize Service Manager Changes with ALM defects (SM Change -> ALM Defect)
     Synchronize Service Manager Changes with ALM requirements (SM Change -> ALM
     Requirement)
     Synchronize Service Manager Problems with ALM defects (SM Problem <-> ALM Defect)

This section describes how to configure Service Manager and ALM for integration and how to
test the synchronization. The target readers include Consultants and Application
Administrators who must set up and maintain ALM to ensure that the synchronization meets all
user organization procedural requirements. Based on the assumption that the reader is an
experienced user of either Service Manager or ALM (but not necessarily of both), this section
describes only the basics of both Service Manager and ALM.

Sample use case

The following typical use cases shed some light on how you can use this integration in your
organization.

SM Change -> ALM Defect

A business owner creates a Normal Change request in Service Manager and later the Normal
Change enters the Build and Test phase. On the ALM tab of the Change request, this business
owner selects the Change To Defect action and then selects the ALM project. After saving
these updates, the system synchronizes the Change request to a defect in ALM. Developers
and QA personnel can begin working on the defect in ALM, in which the key information is
synchronized from Service Manager to ALM.

During the QA process, key information is synchronized between ALM and SM. The integration
administrator has the responsibility of determining the key information and specifying the
information in the field mapping (using the Integration Manager) in order for the business
owner to view updated (scheduled) information in SM. The information includes the Change
request's title, description, severity, and so on.


For a complete use case, see Synchronize Service Manager Change to ALM defect.

SM Change -> ALM Requirement

The requirement synchronization feature of this integration allows requirements found during
the Change Management process to be systematically tracked by SM and ALM.

A business owner creates a Normal Change request in Service Manager and later the Normal
Change enters the Build and Test phase. On the ALM tab of the Change request, this business
owner selects the Change To Requirement action and then selects the ALM project. After
saving these updates, the system synchronizes the Change request to a defect in ALM.
Developers and QA personnel can begin working on the defect in ALM, in which the key
information is synchronized from Service Manager to ALM.

During the QA process, key information is synchronized between ALM and SM. The integration
administrator has the responsibility of determining the key information and specifying the
information in the field mapping (using the Integration Manager) in order for the business
owner to view updated (scheduled) information in SM.

For a complete use case, see Synchronize Service Manager Change to ALM requirement.

SM Problem -> ALM Defect

After a Problem is created, if the CPE engineer determines that there is a bug with the Problem
after analyzing it, and the bug fixing work needs to be tracked, the CPE engineer
triggers/initiates the creation of the ALM CR ticket. On the ALM tab of the Problem record, the
CPE engineer selects the Problem To Defect action and then selects the ALM project. After
saving these updates, the system synchronizes the Problem record to a defect in ALM.

For a complete use case, see Synchronize Service Manager Problem to ALM defect.

ALM Defect -> SM Problem

The business process for defect management in ALM supports the creation of Problems in SM
based on information in ALM. However, in the current solution, the integration can only create a
Problem in SM from a defect in ALM.

Related topics

Defects and Requirements Exchange (SM <-> ALM)


1.5.1. Prerequisites

User role: Service Manager System Administrator

In earlier Service Manager versions, when setting up defects and requirements exchange
between Application Lifecycle Management (ALM) and Service Manager (SM), you need to
install the middleware of ALM Synchronizer with its add-in. As of version 9.80, the SM-ALM
integration is achievable through Integration Manager (SMIS) alone in Service Manager. As a
prerequisite, before setting up the new SM-ALM integration solution, new customers and
existing customers need to take different actions as follows.

New customers

If you have not configured the SM-ALM integration before, complete the following tasks to set
up the new SM-ALM integration.

   1. Configure the settings in ALM
   2. Configure the settings in Service Manager
   3. Manage mappings

Existing customers

If you have already worked with the SM-ALM integration with ALM Synchronizer and add-in
before, here are some hints.

     Service Manager no longer needs Web Service configuration and the original
     configuration is unaffected.

     Refer to the original field mappings in the ALM Synchronizer and reconfigure these
     mappings in SMIS.

     To reduce the impact, refer to Add custom fields and then create new fields in ALM, such
     as SM ID, SM Table, and Push to SM Problem.

Suppose you have synchronized some Change and Problem records before but the
synchronization is not completed yet. When switching to the new integration solution, follow
the steps below if you hope to continue synchronizing these Change and Problem records.

   1. Sign in to your Service Manager server as a system administrator.

  2. Complete the three tasks as described in the New customers section above to set up the
     new SM-ALM integration.

     Note: When configuring field mapping for SM Change to ALM requirement
     synchronization, the out-of-the-box value for Endpoint Default is 3 for the $Type field in
     SM. This value means that the default requirement type is Functional after
     synchronization. You need to match the requirement type by yourself.


SM Field Direction Endpoint SM                          Endpoint Value Descripti
                                                        Default Mapping on
                                        Field  Default
                                                                     Group
$Type ->                                Type
                                                        3

In addition, requirements in ALM are under the Requirements root folder. To synchronize
requirements to another root folder, add a new endpoint field parent-id for ALM and then
set its value to ID of the folder to be synchronized. See the following sample screenshots:

3. Create a ScriptLibrary and then add the following scripts.


  var createContext = lib.AlmMigration.createContext;
  var migrate = lib.AlmMigration.migrate;

  function run() {
         // lib.OctaneTask.setLogLevel('debug');

         // TODO change to the SMIS instance id for ALM project
         var smisIntId = 1;
         var context = createContext(smisIntId);

         // TODO change the find query to match the Change records which
  needs to migrate.

         var query1 = 'active=true and qcintegration.type>0 and not
  null(qcintegration.id) and qcintegration.project=:project';

         lib.c.$('!cm3r', true).find(query1,
  'ALM/HP/SM').each(function(item){

                 migrate(context, item);
         });

         // TODO change the find query to match the Problem records
  which needs to migrate.

         var query2 = 'open=true and qcintegration.type>0 and not
  null(qcintegration.id) and qcintegration.project=:project';

         lib.c.$('!rootcause', true).find(query2,
  'ALM/HP/SM').each(function(item){

                 migrate(context, item);
         });

         context.logout();
  }

  run();

The scripts above perform these steps.
   1. Create a context using the SMIS instance ID. Update it with your SM-ALM SMIS
     instance ID.
   2. Query the Change records in the current Project that still needs synchronization with
     the fields in ALM. Modify the query and the ALM/HP/SM parameter in the query as
     required.
   3. Call a migration method to migrate each Change record.
        1. Assign a value to the ALM Action field in each Change record.
        2. Create AlmInfo and AlmInfoMore records for the Change record.
        3. Update the SM ID and SM Table fields in ALM.


        4. Continue to follow step 2 and step 3 to perform similar operations on the Problem
           records.

   4. Click the Execute button.

Note: The legacy QC Integration tab still exists after migration and some legacy fields have
duplicate values with the new fields. To avoid duplication and misleading, you need to set the
following fields to read-only or invisible.

     In Service Manager: Server/Domain/Project, Synchronize with QC, and Forward to QC
     on the legacy QC Integration tab
     In ALM: Synchronize with SM Problem


1.5.2. Configure the settings in ALM

User role: ALM Project Administrator

Complete the configurations below when setting up the integration between Service Manager
and ALM. Ensure that you have working knowledge about ALM before you proceed. Detailed
instructions about ALM administration are outside the scope of Service Manager
documentation and are hence not covered. For more information, see the ALM documentation.

Set up API access

You need to set up API access for Service Manager and grant Service Manager registered
access keys (Client ID and a Client secret) so that it can access ALM. In the SM-ALM
integration, Service Manager uses the Client ID and Client secret for authentication when
synchronizing information with ALM.

Follow these steps:

  1. Visit https://<ALM server name>:<port>/qcbin and then click API Key. Sign in to ALM as a
     project administrator.

   2. Click API ACCESS, and then enter an appropriate name for the access.
   3. Select a user who has the create and update privileges for defects and requirements in

     the corresponding domain and project, and then enter a description if needed. Also, this
     user needs to be an independent user dedicated to SM-ALM integration and you should
     not use this user for other purposes.
   4. Click Create. A dialog displays with a Client ID and an API key secret.
     Click Copy to copy these keys to the clipboard so you can use them when configuring
     Service Manager that needs to access ALM.
   5. Click Close. The access ID is added to the grid and its status is active.

Add custom fields

You need to manually add the following user-defined fields (UDFs) to ALM.

   1. The SM ID field. The defects and requirements in ALM display the corresponding Service
     Manager ticket ID in this field.

   2. The SM Table field. The defects and requirements in ALM use this field to store the name
     of the SM module table and the SMIS instance ID (for example, cm3r-1).

   3. The Push to SM Problem field. You need to select the action Y in this field before pushing
     a defect to a new Problem in SM. ALM also displays the Done status in this field after a
     new Problem is created in SM.

See the following screenshot as a sample display of these fields in ALM:


Follow these steps:

   1. Sign in to ALM as a project administrator.

   2. Click Settings > Customize. The Application Lifecycle Management - Project
     Customization module opens.

   3. Click Project Entities > Defect > User Fields > New Field, and then add the following
     fields for the defect entity in Project Entities (XX, XY, and XZ are sequential numbers
     auto-generated by ALM).

Name        Label                                Type         Lookup List
BG_USER_XX  SM ID                                String       ---

BG_USER_XY  SM Table                             String       ---
BG_USER_XZ                                       Lookup List
            Push to SM                                        Click New List and
            Problem                                           then create a list
                                                              named
                                                              YesNoDone. Click
                                                              New Item and then
                                                              add Y, N, and
                                                              Done to the
                                                              project list.

     See the following screenshots as examples:               Page 826 of 1727

This PDF was generated on May 23, 2026

4. Click Requirement > User Fields > New Field, and then add the SM ID and SM Table
  fields for the requirement entity in Project Entities.

Name                                    Label     Type
RQ_USER_XX                              SM ID     String
RQ_USER_XY                              SM Table  String

See the following screenshots as an example:


5. Click Save to save your changes.

6. To functionalize the newly-added fields for the requirement entity, click Requirement
  Types > Functional > User Defined Fields, and then select In Type for both new fields.

     If you have other user-defined fields to be synchronized, select In Type for these fields as
     well.

     Note: The Functional requirement type is an example only. You can select another
     requirement type as required.

   7. Click Save to save your changes.

Add rules to restrict the writing permission to the custom
fields

You can define a rule that triggers actions in ALM when certain conditions are met. In this task,
you need to manually add rules to restrict the writing permission to the SM ID, SM Table, and
Push to SM Problem user-defined fields. Both the SM ID and SM Table fields are read-only to
all ALM users and can only be updated by the background API. The Push to SM Problem field
is read-only when the SM ID and SM Table fields have values.

Follow these steps:


1. Sign in to ALM as a project administrator.
2. Click Settings > Customize. The Application Lifecycle Management - Project

  Customization module opens.
3. Click Workflow > Script Editor. The Script Editor window opens.
4. Click Defects module script > Bug_New, and then update the subroutine as follows.

      Sub Bug_New
         On Error Resume Next

         On Error GoTo 0

      Bug_Fields.Field("BG_USER_01").IsReadOnly=True
      Bug_Fields.Field("BG_USER_02").IsReadOnly=True
      Bug_Fields.Field("BG_USER_02").IsVisible=False

      If Not Bug_Fields.Field("BG_USER_01").IsNull then
      Bug_Fields.Field("BG_USER_03").IsReadOnly=True
      End If

      End Sub

   BG_USER_01 , BG_USER_02 , and BG_USER_03 are the corresponding field names for
  SM ID, SM Table, and Push to SM Problem fields for ALM defects.
5. Click Defects module script > Bug_MoveTo, and then update the subroutine as follows.

      Sub Bug_MoveTo
         On Error Resume Next

         On Error GoTo 0

      Bug_Fields.Field("BG_USER_01").IsReadOnly=True
      Bug_Fields.Field("BG_USER_02").IsReadOnly=True
      Bug_Fields.Field("BG_USER_02").IsVisible=False

      If Not Bug_Fields.Field("BG_USER_01").IsNull then
      Bug_Fields.Field("BG_USER_03").IsReadOnly=True
      End If

      End Sub


6. Click Requirements module script > Req_New, and then update the subroutine as
  follows.

      Sub Req_New
         On Error Resume Next

         On Error GoTo 0

      Req_Fields.Field("RQ_USER_01").IsReadOnly = True
      Req_Fields.Field("RQ_USER_02").IsReadOnly = True
      Req_Fields.Field("RQ_USER_02").IsVisible=False
      End Sub

   RQ_USER_01 and RQ_USER_02 are the corresponding field names for SM ID and SM
  Table fields for ALM requirements.
7. Click Requirements module script > Req_MoveTo, and then update the subroutine as
  follows.

      Sub Req_MoveTo
         On Error Resume Next

         On Error GoTo 0

      Req_Fields.Field("RQ_USER_01").IsReadOnly = True
      Req_Fields.Field("RQ_USER_02").IsReadOnly = True
      Req_Fields.Field("RQ_USER_02").IsVisible=False
      End Sub

8. Click Save to save your changes.


1.5.3. Configure the settings in Service
Manager

User role: Service Manager System Administrator
You must complete the following tasks from your Service Manager system to support the
integration.

Add an integration instance

To set up ALM integration, you must add and enable an instance of the ALM integration in
Service Manager Integration Manager.
To add and enable an ALM integration instance, follow these steps:

   1. Click Tailoring > Integration Manager to open Integration Instance Manager.
   2. Click Add. The Integration Template Selection wizard opens.
   3. Select SMALM from the Integration Template list, and then select Import Mapping.
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
                                                       Default: SMALM.
Max Retry Times                         User-defined.
                                                       Note: To integrate multiple
                                                       ALM projects, you can
                                                       add more integration
                                                       instances as necessary.
                                                       Make sure to use a unique
                                                       name for each SM-ALM
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

                                                       Default: 300.

                                                       Maximum allowed number
                                                       of retries if the
                                                       background scheduler
                                                       fails to run.

                                                       Default: 5.

                                                       Note: The ALM integration
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

                                                                 For example: c:\ALM_logs.

                                                                 If this field is empty, the
                                                                 system uses the Service
                                                                 Manager sever log
                                                                 (sm.log) for ALM
                                                                 integration.


Setting                                 Value                   Description
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
                                                                system uses <ALM
                                                                integration name +
                                                                instance ID> for ALM
                                                                integration.

Run at system startup                   True or false.          Automatically enable or
                                                                disable the integration
Description                             User-defined.           instance when the Service
                                                                Manager server starts.

                                                                Description of the
                                                                integration instance.

6. Click Next. The Integration Instance Parameters page opens.
7. Complete the following settings on the ALM Project tab.

Setting                                 Value                                       Service Manager 9.81
Domain                                  Paste the ALM domain.
Project                                 Paste the ALM project.  Description
Project Alias                           User-defined.
                                                                The ALM domain.

                                                                The ALM project.

                                                                A unique alias of the
                                                                ALM project. Later, when
                                                                setting up an SM-ALM
                                                                synchronization, you need
                                                                to select this alias of your
                                                                ALM project on the ALM
                                                                tab in a Change or a
                                                                Problem record.
                                                                Default: ALM-Default-
                                                                Project.
                                                                Note: After cloning
                                                                an SM-ALM
                                                                integration instance in
                                                                SMIS, make sure to
                                                                update this field so that
                                                                the project alias is unique.


Setting                                 Value                      Description
Base URL
                                        Paste the base URL of the  The base URL of the ALM
                                        ALM server.                server. The URL has the
                                                                   following format:

                                                                   https://<ALM server
                                                                   name>:<port>

                                                                   Replace <ALM server
                                                                   name> with the IP address
                                                                   or fully-qualified domain
                                                                   name (FQDN) of the ALM
                                                                   server, and replace
                                                                   <port> with the
                                                                   communications port the
                                                                   ALM server uses.

                                                                   Note: To set up an HTTPS
                                                                   connection, make sure to
                                                                   add the ALM server root
                                                                   CA certificate to the SM
                                                                   trust store so as to verify
                                                                   the connection. See the
                                                                   Add the ALM root CA
                                                                   certificate to the SM trust
                                                                   store section below.

Client ID                               Paste a client ID string.  The client ID you received
Client Secret                                                      in ALM when setting up
Version Enabled                         Paste a client secret      API access for Service
                                        string.                    Manager.

                                        False                      The client secret string
                                                                   you received in ALM when
                                                                   setting up API access for
                                                                   Service Manager.

                                                                   Select this checkbox if
                                                                   version control is enabled
                                                                   in an ALM project.

8. Complete the following settings on the Defect tab as necessary.


Option                                  Description
SM ID Field
                                        The ALM field that displays the
                                        corresponding Service Manager ticket ID.

                                        For example, if the SM ID field name for
                                        ALM defects is BG_USER_01, the value
                                        for ALM Field for SM ID is user-01.

SM Table Field                          The ALM field that displays the
                                        corresponding Service Manager table
                                        name.

                                        For example, if the SM Table field name
                                        for ALM defects is BG_USER_02, the
                                        value for ALM Field for SM Table is user-
                                        02.

Push to SM Problem Field                The ALM field that defines whether to
                                        push an ALM defect to SM and create a
                                        Problem record.

                                        For example, if the Push to SM Problem
                                        field name for ALM defects is
                                        BG_USER_03, the value for ALM Field for
                                        Push to SM Problem is user-03.

Exclude Status                          Review and update the ALM defect status
Enable SM Change to ALM Defect          for the selected options. ALM stops
Enable SM Problem to ALM Defect         updating a defect if it is in any of the
                                        listed status.

                                        Select whether to enable the
                                        synchronization from SM Change to ALM
                                        Defect.

                                        Select whether to enable the
                                        synchronization between SM Problem
                                        and ALM Defect.

9. Complete the following settings on the Requirement tab as necessary.


Option                                  Description
SM ID Field
                                        The ALM field that displays the
                                        corresponding Service Manager ticket ID.

                                        For example, if the SM ID field name for
                                        ALM requirements is RQ_USER_01, the
                                        value for ALM Field for SM ID is user-01.

SM Table Field                          The ALM field that displays the
                                        corresponding Service Manager table
                                        name.

                                        For example, if the SM Table field name
                                        for ALM requirements is
                                        RQ_USER_02, the value for ALM Field for
                                        SM Table is user-02.

Enable SM Change to ALM Requirement     Select whether to enable the
                                        synchronization from SM Change to ALM
                                        Requirement.

10. Click Verify Connection to verify the connection settings.

11. Click Next. The Integration Instance Fields page opens and displays the out-of-the-box
    fields available for both SM and ALM of the integration. You can review, update, or add
    more fields as required.

    Or, if you have selected more than one module in step 8 and step 9, the Select Module
    page opens. You can either double-click a module or select a module from the list and
    then click Open Field Mapping to open the Integration Instance Fields page. Otherwise, if
    you have selected only one module in step 8 or step 9, the Integration Instance Fields
    page opens directly.

    For your selected module, the system displays the out-of-the-box fields available for both
    SM and ALM of the integration. You can review, update, or add more fields as required.

12. Click Next. The Integration Instance Fields page opens. Review, update, or add more
    fields to the SM Fields tab and the Endpoint Fields tab as necessary.

13. Click Next. The Integration Instance Field Mappings page opens.

14. Review, update, or add more fields to the Field Mapping tab and the Value Mapping tab
    as necessary. For more information, see Manage mappings.

    To map fields:


        1. Select an SM field and an ALM endpoint field.
        2. Select a direction in the Direction column.
        3. (Optional) If an SM field to be mapped has multiple value selections (such as

           Impact), specify a name in the Value Mapping Group column and then configure the
           value mappings on the Value Mapping tab.
     To map values:
        1. Enter a value mapping group name as you have specified on the Field Mapping tab.
        2. Enumerate the value mapping pairs between an SM field and an ALM endpoint field.
        3. Set the condition to true.
 15. Click Finish. Service Manager creates the instance.
 16. Enable the integration instance. A processor for the ALM integration instance now runs in
     the background.

            Note

           If your ALM has multiple projects to be integrated, you can add more integration
           instances as necessary.

Add the ALM root CA certificate to the SM trust store

If you are setting up an HTTPS connection, follow these steps to import the ALM server root
CA certificate to the SM trust store.

   1. Export ALM root CA certification to a file. For example, almca.crt.
   2. Import almca.crt to the SM trust store by using the keytool in your JDK. See the following

     sample commands.

          keytool -import -trustcacerts -alias almca -file almca.crt -
          keystore cacerts -storepass changeit

   3. Copy cacerts to the <SM_SERVER_HOME>/RUN folder.
   4. Update sm.ini by adding the following lines:

          truststoreFile:cacerts
          truststorePass:changeit

   5. Restart the SM server.

(Optional) Tailor the integration


The out-of-the-box SM-ALM integration synchronizes a Normal Change request that is in the
Build and Test phase in Service Manager to an ALM defect/requirement. It also synchronizes a
Service Manager Problem record to an ALM defect. You can tailor the integration to work with
more Change categories and more Change/Problem workflow phases so as to increase the
usability and flexibility of this integration. All you need to do is to add the ALM tab to a target
workflow phase of a Change request regardless of the Change request's category, or add the
ALM tab to a target workflow phase of a Problem.

In the SM-ALM integration, Service Manager uses the ALM tab in a Change/Problem record to
define the ALM synchronization action and ALM project. This tab also displays a series of
synchronization information, including ALM Id, ALM Type, ALM Status, ALM Last Update Time,
and so on. Meanwhile, you can also select the attachments of a record on the ALM tab so as to
synchronize them to ALM. The following screenshot illustrates the ALM tab after Service
Manager synchronizes a Change record to an ALM Defect.

The following screenshot illustrates the ALM tab after Service Manager synchronizes a
Problem record to an ALM Defect.

To display the ALM tab in any workflow phase of a Change request or a Problem, you need to
manually add this tab to the corresponding form of that phase. Refer to the following steps for
some guidelines.

For Changes:


1. Click Tailoring > Forms Designer.

2. Search for the corresponding form of a phase. For example, to display the ALM tab when
  a Change enters the Validation phase, search for the chm.normal.registration form.

3. Add a Notebook Tab widget to your Change format, and then set the following property of
  the Notebook Tab widget.

Property                                Value
Visible Condition                       [$G.alm.change.module.enabled]

4. Add a subform to the Notebook Tab widget, and then set the following property of the
  subform control.

Property                                Value
Format                                  alm.info

   5. Save your changes.

For Problems:

   1. Click Tailoring > Forms Designer.
   2. Search for the corresponding form of a phase. For example, to display the ALM tab when

     a Problem enters the Resolution phase, search for the pbm.problem.resolution form.

   3. Add a Notebook Tab widget to your Problem format, and then set the following property
     of the Notebook Tab widget.

Property                                Value
Visible Condition                       [$G.alm.problem.module.enabled]

4. Add a subform to the Notebook Tab widget, and then set the following property of the
  subform control.

Property                                Value
Format                                  pbm.alm.info

5. Save your changes.


1.5.4. Manage mappings

User role: Service Manager System Administrator, ALM Project Administrator
In the Service Manager and ALM integration, a mapping consists of field mapping and value
mapping.

Field Mapping

The Field Mapping tab defines the mapping between ALM fields and SM fields.
The following table describes the columns on this tab.

Column Name                                                                                      Service Manager 9.81
SM Field
Direction                               Description

Endpoint Field                          The name of a field in Service Manager, and
SM Default                              can be selected from the list.

                                        Indicates the mapping direction of a field
                                        mapping, and has only three values to
                                        select from.

                                             ->: from SM Field to ALM Field.
                                             <-: from ALM Field to SM Field.
                                             <->: in both directions.

                                        The name of a field in ALM. You can select
                                        a field from the list.

                                        Defines the default value of the SM Field if
                                        there is no value or there is a constant in
                                        the corresponding ALM Field when
                                        mapping an ALM Field to an SM Field.

                                                    Note

                                                   If the field is of date type, the
                                                   value's format must resemble
                                                   either 2023-03-18T00:00:00Z
                                                   or 2023-03-
                                                   18T00:00:00+08:00 .
                                                   If the field is of boolean type,
                                                   the value can be true or
                                                   false .

Column Name                                                                                      Service Manager 9.81
Endpoint Default
                                        Description

                                        Defines the default value of an ALM Field if
                                        there is no value or there is a constant in
                                        the corresponding SM Field when mapping
                                        an SM Field to an ALM Field.

                                                    Note

                                                   If the field is of date type, the
                                                   value's format must
                                                   resemble 2023-03-18 .
                                                   If the field is a boolean type, the
                                                   value can be Y or N .

Value Mapping Group                     The name of a value mapping group to
                                        which an ALM Field and an SM Field belong.
                                        A value mapping group contains a
                                        collection of enumerated ALM and SM value
                                        pairs. The Service Manager value and ALM
                                        value will be mapped according to the
                                        configuration on the Value Mapping tab.

Description                             Enter a text description for this field
                                        mapping.

Value Mapping

The Value Mapping tab defines the value mapping between ALM and SM for those fields that
have multiple values.

The following table describes the columns on this tab.


Column Name                             Description
Value Mapping Group
                                        The name of a value mapping group. A
SM Values                               value mapping group contains a collection
Endpoint Values                         of enumerated ALM/SM value pairs.
Description
Condition                               The values of the Service Manager fields.

                                        The values of the ALM fields.

                                        Description of the value mapping.

                                        SMIS enables you to configure conditions
                                        for value mappings. Set the value to true
                                        so that the value mapping defined in this
                                        entry is always effective.

For example, below is a value mapping named ChangeDefectSeverity, and there are five
mapping entries for this value mapping group.

The name ChangeDefectSeverity can be filled in the Value Mapping Group column on the
Field Mapping tab.

This means when mapping the Severity field between a Service Manager Change and an ALM
Defect, if the value of the Severity field in Service Manager is 3, the value 3 will be mapped to
medium for the Severity field in ALM, and vice versa.


1.5.5. Verify the integration

User role: Service Manager system administrator

            Note

           The synchronization process for attachments and new updates is unidirectional
           and incremental. That is, you can only synchronize attachments and new updates
           from SM to ALM. Meanwhile, if you remove attachments and new updates from SM
           after synchronization, the attachments and comments in ALM are not affected.

SM Change -> ALM defect/requirement

The following example verifies the integration by synchronizing an SM Change to an ALM
defect/requirement.

   1. Synchronize an SM Change to an ALM defect/requirement.

        1. Navigate to Change Management, and then open a Normal Change record that is in
           the Build and Test phase.

        2. Click the ALM tab.

        3. To synchronize an SM Change to an ALM defect, select Change To Defect in the
           ALM Action drop-down list, and then select your ALM project (project alias) in the
           ALM Project drop-down list.

           To synchronize an SM Change to an ALM requirement, select Change To
           Requirement in the ALM Action drop-down list, and then select your ALM project
           (project alias) in the ALM Project drop-down list.

        4. Click Save and then wait for the background schedule to synchronize the Change
           record to ALM. After synchronization, the ALM Id, ALM Type, ALM Status, ALM Last
           Update Time, Synchronization Status, and Last Synchronization Time fields on the
           ALM tab have read-only values that are populated automatically.


Field                                   Description
ALM Id
ALM Type                                The defect/requirement ID in ALM.
ALM Status
                                        Defect/Requirement.
ALM Last Update Time
                                        The defect's or requirement's status in
                                        ALM.

                                        The time when the defect/requirement
                                        is created in ALM for the first-time
                                        synchronization.
                                        Note: For the later synchronizations,
                                        this field displays the last time when
                                        the defect/requirement is updated by a
                                        user in ALM.

Synchronization Status                  The synchronization status.
Last Synchronization Time
                                        The last synchronization time between
                                        SM and ALM.

        Note: A requirement doesn't have status in ALM. Hence, the ALM Status field is not
        available for requirement synchronization.

2. Update some fields, add attachments, and then perform synchronization again from the
  SM Change to the ALM defect/requirement.

     1. Open the Change record again and then click the Change Details tab. Update the
        title, description, and severity information.

     2. Click the Activities tab. Select Update to external service in the New Update Type
        drop-down list, and then enter some notes in the New Update field.

     3. Click the Attachments tab and add some attachments to the Change record. Next,
        click the ALM tab and then click Add to select the attachments from the current
        Change record for ALM synchronization.

     4. Click Save and then wait for the next synchronization.

3. View the synchronization result in the ALM defect/requirement.

  Sign in to the ALM Desktop Client and open the defect/requirement record. Check that
  your updates to the title, description, and severity in the SM Change record are
  synchronized to the corresponding fields in the ALM defect/requirement record.
  Meanwhile, your notes in the SM New Update field now appear as comments in the ALM


     defect/requirement record. Your selected attachments in the SM Change record now
     appear as the ALM defect/requirement record's attachments as well.

For complete use cases, see Synchronize Service Manager Change to ALM defect and
Synchronize Service Manager Change to ALM requirement.

SM Problem -> ALM defect

The following example verifies the integration by synchronizing an SM Problem to an ALM
defect.

   1. Synchronize an SM Problem to an ALM defect.

        1. Navigate to Problem Management, and then open a problem record.

        2. Click the ALM tab.

        3. To synchronize an SM Problem to an ALM defect, select Problem To Defect in the
           ALM Action drop-down list, and then select your ALM project (project alias) in the
           ALM Project drop-down list.

        4. Click Save and then wait for the background schedule to synchronize the Problem
           record to ALM. After synchronization, the ALM Id, ALM Type, ALM Status, ALM Last
           Update Time, Synchronization Status, and Last Synchronization Time fields on the
           ALM tab have read-only values that are populated automatically.

Field                                   Description
ALM Id
ALM Type                                The defect ID in ALM.
ALM Status
ALM Last Update Time                    Defect.

                                        The defect's status in ALM.

                                        The time when the defect is created in
                                        ALM for the first-time synchronization.
                                        Note: For the later synchronizations,
                                        this field displays the last time when
                                        the defect is updated by a user in
                                        ALM.

Synchronization Status                  The synchronization status.
Last Synchronization Time
                                        The last synchronization time between
                                        SM and ALM.


   2. Update some fields, add attachments, and then perform synchronization again from the
     SM Problem to the ALM defect.

        1. Open the Problem record again and then update the title and description
           information.

        2. Click the Activities tab. Select Update to external service in the New Update Type
           drop-down list, and then enter some notes in the New Update field.

        3. Click the Attachments tab and add some attachments to the Problem record. Next,
           click the ALM tab and then click Add to select the attachments from the current
           Problem record for ALM synchronization.

        4. Click Save and then wait for the next synchronization.

   3. View the synchronization result in the ALM defect.

     Sign in to the ALM Desktop Client and then open the defect record. Check that your
     updates to the title and description in the SM Problem record are synchronized to the
     corresponding fields in the ALM defect record. Meanwhile, your notes in the SM New
     Update field now appear as comments in the ALM defect record. Your selected
     attachments in the SM Problem record now appear as the ALM defect record's
     attachments as well.

For a complete use case, see Synchronize Service Manager Problem to ALM defect.

ALM defect -> SM Problem

The following example verifies the integration by synchronizing an ALM defect to Service
Manager and creating an SM Problem.

   1. Create an SM Problem from an ALM defect.

        1. Sign in to the ALM Desktop Client and create a new defect record. Fill in the required
           fields, and then select Y in the Push to SM Problem drop-down list.

        2. Click Submit and then wait for the background schedule to synchronize the defect
           record to Service Manager. After synchronization, Service Manager creates a new
           Problem record.

        3. In Service Manager, click the ALM tab and then check that the ALM Action, ALM
           Project, ALM Id, ALM Type, ALM Status, ALM Last Update Time, Synchronization
           Status, and Last Synchronization Time fields have read-only values that are
           populated automatically.

        4. In ALM, check that the Push to SM Problem drop-down list in the defect record
           becomes read-only and displays Done. The SM ID and SM Table fields have read-
           only values that are populated automatically.

   2. Update some fields and then perform synchronization again from the ALM defect to the
     SM Problem.


     1. Open the defect record again and then update the summary, description, and
        severity information.

     2. Save your updates and then wait for the next synchronization.
3. View the synchronization result in the SM Problem.

  In Service Manager, check that your updates to the summary, description, and severity
  information in the ALM defect record are synchronized to the corresponding fields in the
  Problem record.
````
