---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.1.6 .. 1.1.6.4
printed_pages: 407-442
---

# 1.1.6 Integration Manager

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.6. Integration Manager

Integration Manager refers to a plug-in-based platform called Service Manager Integration
Suite (SMIS), which can provide centralized management and configuration of all instances of
integrations that are configurable in SMIS.

Accessing Integration Manager

To access the Service Manager Integration Manager, use the Windows or web client and open
Tailoring > Integration Manager from the System Navigator.

Integration Manager (SMIS) provides the following buttons or context menu options, which
enable integration delivery engineers and support engineers to manage integration instances:

     Add: Add a new integration instance.
     Edit: Edit an existing integration instance.
     Clone: Clone an existing integration instance.
     Refresh: Refresh the status of an integration instance.
     Enable: Enable an integration instance.
     Disable: Disable an integration instance.
     Delete: Delete an existing integration instance.
     Task: Monitor failover tasks of an integration instance during a specified period of time.
     Log: View task execution history.

Integration types

SMIS supports two types of integrations:

     Schedule-based: A schedule-based integration runs as a schedule in the background.
     When a schedule-based integration instance is enabled, a corresponding scheduler is
     started in Service Manager.
     UI-based: A UI-based integration can be invoked only in the UI.

Out-of-box integration templates

Out-of-box, SMIS comes with a set of predefined templates that you can use to set up
integrations to the following third-party products, OpenText products, or Service Manager
components:


Product                                  Template name

Another product that supports Case            CaseExchangeDefaultTemplate
Exchange                                      CaseExchangeSM_SAW (for
                                              integration to SMAX)
                                              CaseExchangeSM_SM_Pull
                                              CaseExchangeSM_SM_Push

Microsoft Teams                          MicrosoftTeams

Application Lifecycle Management (ALM)   SMALM

External email servers                   SmartEmail

Application Performance Management            SMBSM_DOWNTIME (for SM-
(APM)                                         APM downtime synchronization)
                                              SMOMi (for integration to Operations
                                              Manager i)
                                              SMBIR (for integration to Business
                                              Impact Report)

Smart Analytics                          SMIDOL
                                         SMIDOLAutoFill
                                         SMIDOLOCR

Atlassian Jira software                  SMJira
ALM Octane                               SMOctane
Operations Orchestration (OO)            SMOO
Project and Portfolio Management Center  SMPPM
(PPM)
SAP Solution Manager                     SMSAP
Third-party survey tools                 SMSurvey
                                         SMtoUCMDB
Universal CMDB


            Note

           The out-of-box templates aren't provided as sample interfaces. You need to
           access the Integration Manager, set up the integrations through the Integration
           Template Selection wizard, and configure your system to interface with the
           OpenText products listed above.

Developing custom integrations using SMIS

SMIS is also a development platform that enables you to develop new integration templates of
your own. You can then register these new integration templates in SMIS so that they are
configurable in SMIS. For more information, see Service Manager Integration Suite (SMIS).

Related topics

Integrations
Service Manager Integration Suite (SMIS)
Add or delete an integration instance
Add a APM Business Impact Reports integration
Add an integration instance for each Operations Manager i (OMi) server
Add an Operations Orchestration integration
Edit an integration instance
Enable or disable an integration instance
Monitor integration instance status
Monitor failover tasks
Configure a callback


1.1.6.1. Add or delete an integration instance

Applies to User roles: System Administrator
Before you can use an integration that's configurable in Integration Manager, you must add
(and then enable) an instance of this integration.
To add an integration instance:

   1. Click Tailoring > Integration Manager. Integration Instance Manager opens.
   2. Click Add. The Integration Template Selection wizard opens.
   3. Select a template from the Integration Template list.
   4. If you want to use the field mappings provided with the template, select Import Mapping.

                   Note

                A template becomes unavailable when the number of integration instances
                based on this template reaches a maximum value predefined in the template.

   5. Click Next. The Integration Instance Information page opens. Verify or complete the fields
     as necessary. For the description of each field on this page, see the related topics.

                   Note

                Some fields are automatically populated with the information from the
                integration template. However, you can modify their values as necessary.

   6. Click Next. The Integration Instance Parameters page opens. This page contains all
     predefined parameters for the integration: General Parameters and Secure Parameters.
     You may set confidential parameters on the Secure Parameters tab, and the parameter
     values will appear as asterisks (*) for data security.

                   Note

                You can modify the predefined parameter values as necessary. However, it's
                not recommended to add new parameters, modify parameter names or
                categories.

   7. Click Next. The Integration Instance Fields page opens. This page contains all predefined
     fields available for the integration:
     • SM Fields: Contains a list of fields at the Service Manager server side and you can map
     these fields to endpoint fields.


     • Endpoint Fields: Contains a list of fields at the endpoint side and you can map these
     fields to Service Manager server fields.

   8. Click Next. The Integration Instance Mapping page opens. This page contains all field
     mappings and value mappings between Service Manager server fields and endpoint
     fields. Review the mappings and make modifications to suit your needs if necessary.

                   Note

                The field mappings are available if you selected Import Mapping in step 4.
                Otherwise, the Field Mapping tab is empty. You may need to add field
                mappings manually. For detailed instructions about how to configure
                mappings, see the related topics.

   9. Click Finish. The system adds the new integration instance.

To delete an integration instance:

            Note

           You can only delete integration instances that are in Disabled status.

   1. Click Tailoring > Integration Manager. Integration Instance Manager opens.

   2. Select the integration instance you want to delete.

   3. Click Delete. This will delete the integration instance record, the corresponding Field
     Mapping records, and the scheduler record (for schedule-based integrations only).

Related topics

     Integration Manager
     Service Manager Integration Suite (SMIS)
     Integration Instance Mapping
     Integration Instance Information fields
     Edit an integration instance
     Add or delete field mappings
     Edit field mappings
     Configure value mappings
     Enable or disable an integration instance
     Monitor integration instance status
     Monitor failover tasks
     Configure a callback


1.1.6.1.1. Integration Instance Information fields

When you add or edit an integration instance, you must verify or complete the following fields
on the Integration Instance Information page. The sample values below are given for an
instance of the Service Manager to Operations Orchestration integration.

Field                                   Sample Value                          Service Manager 9.81
Name (required)                         SMOO
                                                      Description
Version (required)                      1.0
                                                      Name of the integration
Interval Time (s) (required) 300                      instance. This field is
                                                      automatically populated
Max Retry Times (required) 3                          with the information from
                                                      the integration template and
SM Server                               localhost     can be modified to suit your
                                                      needs.

                                                      Version of the integration.
                                                      This field is automatically
                                                      populated.

                                                      Enter an interval (in
                                                      seconds) at which the
                                                      integration instance is
                                                      scheduled to run.

                                                      Note: This field is required
                                                      only when Category is
                                                      Schedule-based.

                                                      Enter a maximum allowed
                                                      number of retries when a
                                                      scheduled run of the
                                                      instance fails.

                                                      Note: This field is required
                                                      only when Category is
                                                      Schedule-based

                                                      Enter a display name that
                                                      identifies the Service
                                                      Manager server machine
                                                      you are using.

Field                                   Sample Value                          Service Manager 9.81
Endpoint Server                         OO2-SRV
                                                      Description

                                                      Enter a display name that
                                                      identifies the endpoint
                                                      server machine. For
                                                      example, the display name
                                                      of the Operations
                                                      Orchestration server
                                                      machine for the SM to OO
                                                      integration.

Field                                   Sample Value                          Service Manager 9.81
Log Level                               INFO
                                                      Description

                                                      Level of diagnostic
                                                      information that the Service
                                                      Manager server logs to the
                                                      log file directory. The
                                                      possible log levels are as
                                                      follows:

                                                           DEBUG: Designates
                                                           fine-grained
                                                           informational events
                                                           that are most useful to
                                                           debug the integration
                                                           instance.
                                                           INFO (default):
                                                           Designates
                                                           informational
                                                           messages that
                                                           highlight the progress
                                                           of the integration
                                                           instance at coarse-
                                                           grained level.
                                                           WARNING: Designates
                                                           potentially harmful
                                                           situations.
                                                           ERROR: Designates
                                                           error events that might
                                                           still allow the
                                                           integration instance to
                                                           continue running.
                                                           OFF: Turns off logging
                                                           of the integration
                                                           instance.

                                                      The log hierarchy is DEBUG
                                                      < INFO < WARNING <
                                                      ERROR. Selecting a log of a
                                                      higher level can render logs
                                                      of lower levels invalid.

Field                                   Sample Value                                 Service Manager 9.81
Log File Directory
                                        C:\ Service          Description
                                        Manager\server\logs
                                                             Enter an absolute path that
Category                                Schedule-based       exists on the Service
                                                             Manager server, where log
Shared Scheduler                                             files will be stored. Note: If
                                                             you enter a directory that
Run at system startup                   selected             doesn't exist, the log files
                                                             will get lost.
This PDF was generated on May 23, 2026
                                                             Indicates whether the
                                                             integration instance is
                                                             Schedule-based or UI-
                                                             based.

                                                             The scheduler that the
                                                             integration instance uses to
                                                             schedule background
                                                             processes. Multiple
                                                             integration instances can
                                                             use a shared scheduler.

                                                             When you create an
                                                             integration template, you
                                                             can define a default shared
                                                             scheduler for the instances
                                                             that are based on the
                                                             template. All instances that
                                                             are based on this template
                                                             can use the same shared
                                                             scheduler. However, if you
                                                             create an instance that uses
                                                             a different scheduler, SMIS
                                                             creates a new scheduler
                                                             accordingly.

                                                             Indicates whether the
                                                             integration instance runs at
                                                             system startup. If selected,
                                                             the current integration
                                                             instance automatically runs
                                                             when the Service Manager
                                                             server is started.

                                                                                                       Page 416 of 1727

Field                                   Sample Value           Description
Description
                                        OO flows linked to SM  Description of the
                                        Knowledge Management.  integration instance. You
                                                               can modify the pre-
                                                               populated text to suit your
                                                               needs.

Related topics

Integration Manager
Integration Instance Mapping
Edit an integration instance


1.1.6.1.2. Edit an integration instance

Applies to User roles: System Administrator

            Note

           You can only edit integration instances in the Disabled status. Enabled integration
           instances (in Running or Sleeping status) can be viewed only.

To edit an integration instance:

   1. Click Tailoring > Integration Manager. Integration Instance Manager opens.

   2. Select an integration instance with a Status of Disabled, and click Edit.

           In the Windows client, click an integration instance to select it.
           In the Web client, hold down the Shift key as you click an integration instance to
           select it.

     The Integration Instance Information wizard opens.

   3. Make changes to the field values as necessary, and then click Next. The Integration
     Instance Parameters wizard opens.

   4. Update the parameter values with your real data if necessary. However, it's not
     recommended to add a new parameter, or modify parameter names or category.

   5. Click Next. The Integration Instance Fields page opens, displaying all the fields
     predefined in the integration template:

           SM Fields: A list of fields in the Service Manager server side that can be mapped to
           endpoint fields.
           Endpoint Fields: A list of fields in the endpoint side that can be mapped to Service
           Manager server fields.
   6. If necessary, on the SM Fields and Endpoint Fields tabs, add new fields and specify a
     field type for each of them: string, date, number, or boolean.
   7. Click Next. The Integration Instance Mapping page opens. Make changes to the field
     mappings and value mappings to suit your needs.
   8. Click Finish. Changes made to the integration instance are saved.

Related topics

Integration Manager
Service Manager Integration Suite (SMIS)
Integration Instance Mapping
Integration Instance Information fields
Add or delete an integration instance
Add or delete field mappings
Edit field mappings


Configure value mappings
Enable or disable an integration instance
Monitor integration instance status
Monitor failover tasks
Configure a callback


1.1.6.1.3. Integration Instance Mapping

The mapping functionality of an integration instance converts values between Service
Manager and the other product automatically. It is based on the following settings:

     Value mapping - Each value mapping is based on the value mapping group table.
     Field mapping - Map the value of a source field to the value of a target field and define
     the direction of the mapping.
     Default value - Default value is used in the following situations:

           No value mapping group is defined for this field and the source field value is empty.
           A value mapping group is defined for this field but the value can't be mapped within
           the value mapping group.
     Callback - SMIS provides four callbacks for complicated field mappings, which provide
     the flexibility to implement corresponding business logic.
     Condition - SMIS supports conditional value mappings and enables you to configure
     conditions.
     Pre Script - The pre script can initialize variables so that succeeding processes can use
     these variables.
     Post Script - If all the previous processes can't fulfill your need, you can use the post
     script to perform additional process and store results into the mapObj object.

SMIS processes the above settings in the following sequence:

Field mapping > Pre Script > Value mapping > Default Value > Callback > Post Script

If you selected Import Mapping when adding an integration instance, the mapping template
with out-of-box lists of predefined field mappings and value mappings become available.

The out-of-box field mappings and value mappings can be regarded as the minimum default
settings for an integration instance to run. However, you can configure these default settings
as necessary to suit your needs.

Related topics

Integration Manager
Service Manager Integration Suite (SMIS)
Integration Instance Information fields
Pre script
Post script
Add or delete an integration instance
Edit an integration instance
Add or delete field mappings
Edit field mappings
Configure value mappings
Enable or disable an integration instance
Monitor integration instance status


Monitor failover tasks
Configure a callback
Configure a condition


1.1.6.1.3.1. Add or delete field mappings

Applies to User roles: System Administrator

To add a new row of field mapping, follow these steps:

   1. Click Tailoring > Integration Manager. Integration Instance Manager opens.
   2. Select an integration instance with a status of Disabled. The Integration Instance

     Information wizard opens.
   3. Click Next to get to the Integration Instance Mapping page in the wizard.
   4. Select the Field Mapping tab.
   5. In the SM Field column, click the first blank cell, and select a field from the list.
   6. In the Direction column, select a direction from the list.
   7. In the Endpoint Field column, click the first blank cell, and select a field from the list.

   8. In the SM Default or EP Default column, enter a default value or use a place holder
     expression.

     For more information about place holder, see Use placeholders.

   9. In the SM Callback or EP Callback column, enter a callback function.
 10. In the Value Mapping Group column, specify a value mapping group if necessary.
 11. Click Finish.

To delete a row of field mapping, follow these steps:

   1. Click Tailoring > Integration Manager. Integration Instance Manager opens.
   2. Select an integration instance with a status of Disabled. The Integration Instance

     Information wizard opens.
   3. Click Next to get to the Integration Instance Mapping page in the wizard.
   4. Select the Field Mapping tab.
   5. Clear all the fields in the row you want to delete.
   6. Click Finish.

Related topics

Integration Manager
Integration Instance Mapping
Use placeholders
Edit an integration instance
Configure a callback
Edit field mappings
Configure a condition
Integration Instance Information fields


1.1.6.1.3.2. Edit field mappings

Applies to User roles: System Administrator

To edit a field mapping of an integration instance, follow these steps:

   1. Click Tailoring > Integration Manager. Integration Instance Manager opens.
   2. Select an integration instance with a status of Disabled. The Integration Instance

     Information wizard opens.
   3. Click Next to get to the Integration Instance Mapping page in the wizard.
   4. Select the Field Mapping tab.

   5. In the SM Field column or Endpoint Field column, click an entry you wish to edit or
     configure, and select a field from the list.

                   Note

                If you want to add a new field that's unavailable in the list, you must first go to
                the Integration Instance Fields page, add this field, and specify a field type for
                it. There are four field types available: string, number, date, and boolean.

   6. If necessary, click in the Direction field, and select a new direction from the list. A
     bidirectional direction means two mappings actually.

   7. After you have finished modifying the field mappings, click Finish.

Related topics

Integration Manager
Service Manager Integration Suite (SMIS)
Integration Instance Mapping
Integration Instance Information fields
Add or delete an integration instance
Edit an integration instance
Add or delete field mappings
Configure value mappings
Enable or disable an integration instance
Monitor integration instance status
Monitor failover tasks
Configure a callback
Configure a condition


1.1.6.1.3.3. Configure a callback

Applies to User roles: System Administrator

A callback is a piece of executable code that's passed as a parameter to other code. The
Service Manager Integration Suite (SMIS) provides the following four callback functions:

Callback Function                       Description
lookup
                                        Looks up a record from a Service Manager
                                        table matching the query condition. If a
                                        matching record is found, the lookup
                                        callback returns the value of the specified
                                        field; if not, it either returns an empty value
                                        or ignores the current mapping.

                                        Note

                                        Multiple conditions should be
                                        separated with "||".

combine                                 Concatenates an array of values with a
setValue                                specified delimiter.

when                                    Sets values when the current action is
                                        among any combinations of Insert, Update,
                                        and Close. Otherwise, the setValue
                                        callback either returns an empty value or
                                        ignores the current mapping.

                                        Return the value if any condition is met. In
                                        both the condition and value fields, use
                                        "${sm.field}" to get the value of SM field or
                                        use "${ep.field}" to get the value of the end
                                        point field.

Note

For more information about how to use placeholders (for example, ${sm.field} and
${ep.field}), see Use placeholders.

You configure callbacks for an integration instance from the Integration Instance Mapping
page. You can edit or clear callbacks.


To edit a callback, follow these steps:

   1. Click Tailoring > Integration Manager. Integration Instance Manager opens.
   2. Select an integration instance. The Integration Instance Information wizard opens.
   3. Click Next to get to the Integration Instance Mapping page in the wizard.
   4. On the Field Mapping tab, select a cell in the SM Callback or EP Callback column.
   5. Click Edit Callback. The Callback Editor window opens.
   6. Select a value from the Callback Function list. The parameters that display in the window

     vary with the callback function you selected: lookup, combine, setValue, or when.
   7. Provide values for all the parameters. Click OK to save the callback.

   8. Click Finish.

                   Note

                The changes you made to the integration instance aren't saved until you click
                Finish.

To delete a callback, follow these steps:

   1. Click Tailoring > Integration Manager. Integration Instance Manager opens.
   2. Select an integration instance. The Integration Instance Information wizard opens.
   3. Click Next to get to the Integration Instance Mapping page in the wizard.
   4. On the Field Mapping tab, select a cell in the SM Callback or EP Callback column.
   5. Click Clear Callback.
   6. Click Yes to confirm the deletion.
   7. Click Finish.

Related topics

Integration Manager
Service Manager Integration Suite (SMIS)
Integration Instance Mapping
Integration Instance Information fields
Add or delete an integration instance
Edit an integration instance
Add or delete field mappings
Edit field mappings
Configure value mappings
Enable or disable an integration instance
Monitor integration instance status
Monitor failover tasks
Configure a condition


1.1.6.1.3.4. Configure value mappings

Applies to User roles: System Administrator

You configure value mappings for an integration instance from the Integration Instance
Mapping page.

            Note

           JavaScript is unsupported in the SM Values and End Point Values columns of the
           Value Mapping section. If JavaScript calculations are required, you have to add the
           JavaScript code into the Pre Script or Post Script section.

To edit a value mapping, follow these steps:

   1. Click Tailoring > Integration Manager. Integration Instance Manager opens.
   2. Select an integration instance. The Integration Instance Information wizard opens.
   3. Click Next to get to the Integration Instance Mapping page in the wizard.
   4. Select the Value Mapping tab.
   5. Click the entry you want to edit, and enter a new value.
   6. Click Finish.

To add a value mapping, follow these steps:

   1. Click Tailoring > Integration Manager. Integration Instance Manager opens.
   2. Select an integration instance. The Integration Instance Information wizard opens.
   3. Click Next to get to the Integration Instance Mapping page in the wizard.
   4. On the Value Mapping tab, click the fields in the first blank row, and enter values for the

     fields.
   5. Click Finish.

To delete a value mapping, follow these steps:

   1. Click Tailoring > Integration Manager. Integration Instance Manager opens.
   2. Select an integration instance. The Integration Instance Information wizard opens.
   3. Click Next to get to the Integration Instance Mapping page in the wizard.
   4. On the Value Mapping tab, clear all the fields in the row you want to delete.
   5. Click Finish.

For more information about how to configure conditions for value mappings, see Configure a
condition.

Related topics

Integration Manager
Service Manager Integration Suite (SMIS)
Integration Instance Mapping


Integration Instance Information fields
Add or delete an integration instance
Edit an integration instance
Add or delete field mappings
Edit field mappings
Enable or disable an integration instance
Monitor integration instance status
Monitor failover tasks
Configure a callback
Configure a condition


1.1.6.1.3.5. Configure a condition

Applies to User roles: System Administrator
SMIS enables you to configure conditions for value mappings. You can set the Condition field
of a value mapping entry to one of the following strings:

      true : The value mapping defined in this entry is always effective.
      false : The value mapping defined in this entry is always ineffective.
     A string that uses place holder: The value mapping defined in this entry is effective only
     when the condition is met.
     For more information about how to use place holder, see Use placeholders.

            Note

        If the value for a mapping condition is blank, the value is set as true by
        default.
        JavaScript is unsupported in the Condition field of the value mapping. In case
        JavaScript calculations are required, you have to add the JavaScript code into

        the Pre Script or Post Script section.

When you configure value mappings and set conditions, make sure logic conflicts don't occur.
If several conditions of a value mapping are met but a logic conflict occurs, only the last value
mapping is effective. As in the following example, the value mapping result for the Status field
in Service Manager is Pending rather than Open.

Value Mapping SM Values                 End Point  Description Condition
Group                                   Values
                                                                       ${context.inbo
Status  Open                            Pending                        und} &&
                                                                       ${context.new
Status  Pending                         Pending                        SMIncident}

                                                                       ${context.inbo
                                                                       und} &&
                                                                       ${context.new
                                                                       SMIncident}

To add or edit a condition, follow these steps:
   1. Click Tailoring > Integration Manager. Integration Instance Manager opens.


   2. Select an integration instance. The Integration Instance Information wizard opens.
   3. Click Next to get to the Integration Instance Mapping page in the wizard.
   4. On the Value Mapping tab, select a cell in the Condition column.
   5. Provide or edit the value for the condition.
   6. Click Finish to save your changes.

To delete a condition, follow these steps:

   1. Click Tailoring > Integration Manager. Integration Instance Manager opens.
   2. Select an integration instance. The Integration Instance Information wizard opens.
   3. Click Next to get to the Integration Instance Mapping page in the wizard.
   4. On the Value Mapping tab, select a cell in the Condition column.
   5. Remove the condition value.
   6. Click Finish to save your changes.

Related topics

Integration Manager
Service Manager Integration Suite (SMIS)
Integration Instance Mapping
Integration Instance Information fields
Add or delete an integration instance
Edit an integration instance
Add or delete field mappings
Edit field mappings
Configure a callback
Configure value mappings
Enable or disable an integration instance
Monitor integration instance status
Monitor failover tasks


1.1.6.1.3.6. Pre script

Service Manager Integration Suite (SMIS) executes the pre script after field mapping and
before value mapping. You can use the pre script to initialize variables so that SMIS can use
these variables in value mapping, or execute additional calculations to influence the value
mapping. You can follow normal Javascript syntax to compose the pre script. For the objects
that the pre script can use, see Placeholder objects.
For example, the following pre script first verifies if the properties.Description field in the
endpoint is not empty. If the field is not empty, the script calls a function and assigns the result
of the function back to the properties.Description field.

  if(ep['properties.Description']) ep['properties.Description'] =
  lib.CaseExchange_SAWUtil.processHtmlText(param, context, 'description',
  ep['properties.Description']);

It is unsupported to update the affected record by using JavaScript statements in the Pre
Script section. Only the update of the record itself via the running SMIS instance is supported.

Related topics

Post script
Integration Instance Mapping


1.1.6.1.3.7. Post script

If all previous processes can't fulfill your need, you can write the post script to perform
additional process and store results into the mapObj object. You can follow normal Javascript
syntax to compose the post script. For the object that the post script can use, see Placeholder
objects.

It is unsupported to update the affected record by using JavaScript statements in the Post
Script section. Only the update of the record itself via the running SMIS instance is supported.

Related topics

Pre script
Integration Instance Mapping


1.1.6.1.3.8. Use placeholders

You can use placeholders in the following fields when you configure an integration instance:

     In field mapping: Callback, SM Default, and EP Default
     In value mapping: Condition

You can use the following placeholder syntax:

      ${(sm|ep|param|context|vars).fieldName} if fieldName doesn't contain a "."
      ${(sm|ep|param|context|vars)["fieldName"]} if fieldName contains a "."

You can use the sm , ep , param , context , and vars objects in a placeholder, see
Placeholder objects below for details.

Placeholder allows you to use any Javascript syntax, or to call a function from the
ScriptLibrary, for example, lib.scriptlib.function .

The following examples are some common use of placeholder:

      ${(sm.AssignmentGroup)} represents the value of the AssignmentGroup field in
     Service Manager.
      ${(ep["AssignedGroup.Name"])} represents the AssignedGroup.Name field in the end
     point.
     If you use ${context.inbound==true} && (!${context.newSMIncident}) in a condition, the
     condition is "The value of the context.inbound field is true and the value of the
     context.newSMIncident field is false ."
      ${vars.$L_file.assignment} refers to the field assignment of variable vars.$L_file .
     Use ${lib.<scriptlib>.<func>()} to call a Java script.

Placeholder objects

You can use the following objects in a placeholder:

      sm : Refers to the value of a field in Service Manager. You can use either fieldName or
      alias to refer to the value of a Service Manager field.
      ep : Refers to the value of a field in the end point. You can use either fieldName or
      alias to refer to the value of an end point field.
      param : Refers to the value of a parameter that's defined in SMIS configuration.

      context : Refers to the task information as in the following table. context can store
     shared variable that you can use in other places, for example, callback, condition in value
     mappings, and post script.

Task information                                                                           Service Manager 9.81
internalId
externalId                              Description
object                                  The ID of the record in Service Manager.
                                        The ID of the record in the end point.
action                                  The table name of the object in Service
                                        Manager.
direction                               The action of an inbound or outbound
                                        request.
                                        The direction of the action: inbound or
                                        outbound.


Task information                        Description
internalObject
                                        Refers to a specific record in Service
                                        Manager. You can perform the following
                                        operations with internalObject :

                                             Directly modify internalObject to
                                             update the record. This operation is
                                             usually used for inbound tasks. For
                                             example, the following code in
                                             Additional Script can directly
                                             specify the value of a field:

                                              context.internalObject["resolution.c
                                             ode"]="Request Rejected"

                                             It's not recommended that you
                                             directly modify the value of a field
                                             by manipulating internalObject ,
                                             because this action causes an
                                             inconsistency between the activity
                                             log and the actual result. Therefore,
                                              internalObject is usually used to
                                             perform operations that doesn't
                                             change the record itself, for
                                             example, creating activity log, or
                                             building relationship with another
                                             record.

                                             Retrieve certain record information
                                             through internalObject in the pre
                                             script or post script. For example,
                                             the following code retrieves the
                                             value of the Resolution Code field
                                             through internalObject :

                                              if(context.action=="Cancel" &&
                                             context.internalObject['resolution.c
                                             ode']=="Withdrawn by User")
                                             context.cancelledBySM = true;

vars : Refers to a global variable.
mapObj : Refers to the last map object, which contains the final result of field mapping,
pre script, and value mapping. You can only use mapObj in the post script. If you modify
mapObj in the post script, your modification will overwrite the result of field mapping


     and value mapping. That is, the value of the corresponding field in the record will be what
     you specified in the post script.

The following example scenario helps you understand the use of the sm , ep , and mapObj
objects:

     Assume that you configure the field mapping between the following SM and endpoint
     fields:

           SM field: resolution.code
           Endpoint field: properties.CompletionCode

     Some of the value mapping configurations for these two fields are as follows:

SM field ( resolution.code )            Endpoint field
                                        ( properties.CompletionCode )
Automatically Closed
Not Reproducible                        NoUserResponse

                                        NotReproducible

     In an inbound task, the value of the properties.CompletionCode field is
      NoUserResponse in the endpoint.

In this scenario, after the field mapping (and before the execution of the pre script), the sm
and ep objects are initialized as follows:

     ep["properties.CompletionCode"]="NoUserResponse"
     sm["resolution.code"]="NoUserResponse"

You can manipulate these objects in the pre script.

After the value mapping, the mapObj object is initialized as follows (if you don't change these
objects in the pre script):

mapObj["resolution.code"]="Automatically Closed"

This is the result of the field mapping and value mapping. If you don't modify this result in the
post script, the Resolution Code field of the record will be Automatically Closed.

However, if you modify the result by adding the following code in the post script:

mapObj["resolution.code"]="Not Reproducible"

The previous field mapping and value mapping result will be overwritten, and the Resolution
Code field of the record will be Not Reproducible.

Related topics

Configure a condition
Edit field mappings



1.1.6.2. Enable or disable an integration
instance

Applies to User Roles: System Administrator
To enable an integration instance, follow these steps:

   1. Click Tailoring > Integration Manager. Integration Instance Manager opens.
   2. Select an integration instance with a Status of Disabled, and click Enable.
   3. In the prompt window, click Yes. The integration instance is enabled.

     If the integration instance is successfully enabled, its status changes to Running.
     However, if the integration instance is schedule-based, its status switches between
     Running and Sleeping:

           Running indicates that the integration instance is processing data at a scheduled
           time interval.
           Sleeping indicates that the integration instance has finished the data processing at a
           scheduled time interval. When a subsequent scheduled time interval is triggered, the
           integration instance status changes from Sleeping to Running.

To disable an integration instance, follow these steps:

            Note

           A schedule-based integration instance can be disabled only when it is in the
           Sleeping status.

   1. Click Tailoring > Integration Manager. Integration Instance Manager opens.
   2. Select an integration instance with a Status of Running (UI-based) or Sleeping (schedule-

     based), and then click Disable.
   3. In the prompt window, click Yes. The integration instance is disabled.

                   Note

                Disabling a schedule-based integration instance terminates the
                corresponding scheduler of the integration instance. If the scheduler is not
                terminated immediately, wait for a while and click Refresh (Refresh
                Integration instance) to check the status. If the integration instance is still not
                disabled, repeat the Disable operation or go to System Status to manually
                terminate the corresponding process named after the integration instance and
                its ID.

Related topics


Integration Manager
Service Manager Integration Suite (SMIS)
Integration Instance Mapping
Integration Instance Information fields
Add or delete an integration instance
Edit an integration instance
Add or delete field mappings
Edit field mappings
Configure value mappings
Monitor integration instance status
Monitor failover tasks
Configure a callback


1.1.6.3. Monitor integration instance status

Applies to User roles: System Administrator

To monitor integration instance status:

   1. Click Tailoring > Integration Manager. Integration Instance Manager opens.
   2. Select an integration instance.
   3. Click Refresh. The status of the selected integration instance refreshes.

Related topics

Integration Manager
Service Manager Integration Suite (SMIS)
Add or delete an integration instance
Edit an integration instance
Enable or disable an integration instance
Monitor failover tasks


1.1.6.4. Monitor failover tasks

Applies to User roles: System Administrator

The Task Manager window lists all failed tasks of an integration instance. You can check to see
whether a task failed or has expired, as well as its retry times. A task expires if the scheduler
has performed the maximum number of retries for it. If a task has expired, Service Manager no
longer processes it until you reset it or manually rerun it.

To monitor a failover task, follow these steps:

   1. Click Tailoring > Integration Manager. Integration Instance Manager opens.
   2. Select an integration instance.
   3. Click Task. The Task Manager window opens.
   4. To filter tasks by time range, select a date range in the From and To fields, and click

     Filter.
   5. Double-click a record in the task list. The task details are shown.

   6. (Optional) If the task is unexpired, click Reset to set Retry Times to 0 and Expired to
     false.

     Or

     If the task is expired, click Run Now to rerun it.

     Or

     For an outbound task, if the record is out-of-date (for example, the Incident has been
     updated after the task is created), click Merge to merge the latest field value of the
     record to the task.

            Note

           When a failed task is successfully done, it is removed from the task queue.

Related topics

Integration Manager
Service Manager Integration Suite (SMIS)
Integration Instance Mapping
Integration Instance Information fields
Add or delete an integration instance
Edit an integration instance
Add or delete field mappings
Edit field mappings
Configure value mappings
Enable or disable an integration instance


Monitor integration instance status
Configure a callback
````
