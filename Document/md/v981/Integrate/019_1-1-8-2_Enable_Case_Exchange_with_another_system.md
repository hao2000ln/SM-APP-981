---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.1.8.2 .. 1.1.8.2.1
printed_pages: 487-516
---

# 1.1.8.2 Enable Case Exchange with another system

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.8.2. Enable Case Exchange with another
system

This section introduces the tasks that you need to perform to set up a Case Exchange
integration between Service Manager and another system:
General procedure
Recommendations
Configure Incident environment
Create a new integration template
Add and enable a Case Exchange integration instance
Configure Case Exchange Rule Sets
Invoke Case Exchange Rule Sets
Enable Case Exchange with SMAX
The Pull mechanism
Add and enable an integration instance
Create and invoke Rule Sets
Specify Service Manager as an external system in SMAX
Test and troubleshoot the integration
Enable Case Exchange between two Service Manager systems
Connection mechanisms
Using the Pull mechanism
Using the Push mechanism


1.1.8.2.1. General procedure

The following topics describe the general procedure of enabling Case Exchange with another
system.
Recommendations
Configure Incident environment
Create a new integration template
Add and enable a Case Exchange integration instance
Configure Case Exchange Rule Sets
Invoke Case Exchange Rule Sets


1.1.8.2.1.1. Recommendations

Before you set up the Case Exchange integration, consider the following recommendations for
preparation and configuration:

     Decide about the general connection method, which can be either of the following:
          • Pull the data from the target system
          • The target system pushes the data into Service Manager

     Ensure that you have a clear picture about the workflows in the systems you want to
     integrate.
     Ensure that you know how to map the workflows for incoming and outgoing data.
     Ensure that the attachment settings are correctly configured.
     Ensure security settings are defined and correctly configured.
     Enable outbound events for easy usage in the Rule Sets.
     Test the configurations in a test environment before going live.
     Ensure the ownership of the records is clearly defined for each stage.
     Align on reopen, resolve, and closure rules, follow Processes and Best Practices .
     Perform enough performance tests, including test with attachments to ensure the system
     can handle the case exchange requirements of your environment.
     Don't underestimate the effort for the workflow and status mapping.


1.1.8.2.1.2. Configure Incident environment

We recommend that you enable the Use Resolved Status setting in the Service Manager
system.
To do this, follow these steps:

   1. Go to Incident Management > Administration > Environment.
   2. Select Use Resolved Status?.
   3. Click Save.
   4. Click OK.


1.1.8.2.1.3. Create a new integration template

Applies to User roles: System Administrator
An appropriate integration template must be ready before you integrate Service Manager with
another system. You can either create a new template, or use and modify an existing template
during integration.
To create a new integration template, refer to Developing an Integration Template.
Service Manager provides out-of-box templates for Case Exchange integrations, for more
information see Out-of-box integration templates.


1.1.8.2.1.4. Add and enable a Case Exchange
integration instance

Applies to User roles: System Administrator
To add a Case Exchange integration instance, follow these steps:

   1. Click Tailoring > Integration Manager. Integration Instance Manager opens.
   2. Click Add. The Integration Template Selection wizard opens.
   3. Select a Case Exchange template from the Integration Template list. For example, select

     CaseExchangeDefaultTemplate.
   4. If you want to use the field mappings provided with the template, select Import Mapping.

                   Note

                A template becomes unavailable when the number of integration instances
                based on this template reaches the maximum value predefined in the
                Instance Count filed in the template. For more information about how to add
                or edit an integration template, see Service Manager Integration Suite (SMIS).

   5. Click Next. The Integration Instance Information page opens. Verify or complete the
     fields as necessary. For the description of each field on this page, see the topics under
     Configuration details.

   6. Click Next. The Integration Instance Parameters page opens. This page contains all
     predefined parameters for the integration.

                   Note

                You can modify the predefined parameter values as necessary. However, it's
                not recommended to add new parameters, modify parameter names or
                categories.

   7. Click Next. The Integration Instance Fields page opens.
   8. Enter the Service Manager fields and the endpoint fields in the following two tabs:

          • SM Fields: Enter the fields of the Service Manager system side to map to endpoint
          fields.
          • Endpoint Fields: Enter the fields of the endpoint system to map to Service Manager
          server fields.
   9. Click Next. The Integration Instance Mapping page opens.


     This page contains all field mappings and value mappings between Service Manager
     server fields and endpoint fields. For more information about how to configure this page,
     see topics under Integration Instance Mapping.

 10. Click Finish to add the new integration instance.

For more information about how to enable an integration instance, see Enable or disable an
integration instance.

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


1.1.8.2.1.5. Configuration details

This section provides detailed explanation to each field you need to configure when you set up
the Case Exchange integration by using the out-of-box template:
CaseExchangeDefaultTemplate.

            Note

           Currently, Case Exchange only supports the data transaction through RESTful APIs.

Integration Instance Information

For details about how to configure the Integration Instance Information page, see Integration
Instance Information fields.

Integration Instance Parameters - General

The following table explains the fields under the General tab in the Integration Instance
Parameters page.

Fields                                  Value                                            Service Manager 9.81
Object                                  User-defined.
Timeout                                 For example, Incident .  Description
Base URL                                User-defined.
                                        For example: 30 .        The table name of the
Login URL                               User-defined.            object in Service Manager.

Tenant Id                               User-defined.            This value specifies the
User name                                                        time-out (in seconds) for
                                        User-defined.            each of these three
                                        User-defined.            activities: Connect, Send,
                                                                 and Receive.

                                                                 The base portion of the
                                                                 endpoint URL.
                                                                 The format of the URL is as
                                                                 follows:
                                                                 http(s)://<host>.<domain>
                                                                 For example, the Base URL
                                                                 for the Service Anywhere
                                                                 endpoint might be as
                                                                 follows:
                                                                 https://<host
                                                                 name>.saas.hpe.com

                                                                 The login URL of the
                                                                 endpoint.
                                                                 The format of the URL is as
                                                                 follows:
                                                                 <Base
                                                                 URL>/auth/authentication-
                                                                 endpoint/authenticate/login

                                                                 The Tenant Id of the
                                                                 endpoint system.

                                                                 The endpoint user name for
                                                                 the integration.

Fields                                  Value                                  Service Manager 9.81
Password                                User-defined.
                                                       Description

                                                       The password of the user
                                                       name.

                                                                   Note

                                                                  This field can't
                                                                  be blank. The
                                                                  endpoint user
                                                                  name must have
                                                                  a password.
                                                                  Otherwise, the
                                                                  connection
                                                                  verification may
                                                                  fail.

Integration Instance Parameters - Inbound

The following tables explain the fields under the Inbound tab on the Integration Instance
Parameters page.


Fields                                  Value          Description
External Id Field                       User-defined.
                                                       The relative path of the ID
External Status Field                   User-defined.  field in inbound JSON. This
                                                       path is relative to the List
Internal Id Field                       User-defined.  path.

                                                       The field name you entered
                                                       must be a valid reference in
                                                       the external system.

                                                       For example, properties.Id .

                                                       The relative path of the
                                                       Status field in inbound
                                                       JSON. This path is relative
                                                       to the List path.

                                                       The field name you entered
                                                       must be a valid reference in
                                                       the external system.

                                                       For example,
                                                       properties.Status .

                                                       The name of the unique
                                                       field of the Service Manager
                                                       object. For example, enter
                                                       number for the
                                                       probsummary table.

                                                       The field name you entered
                                                       must be a valid dbdict field
                                                       name in the selected
                                                       Service Manager object.

If you select the Activate Data Pulling option, Service Manager pulls the data of the inbound
tasks from the endpoint system. The following fields appear when you select this option.

Fields                                  Value                                  Service Manager 9.81
Pulling From                            User-defined.
                                                       Description
Time difference (s)                     User-defined.
Relative URL                            Default: 0 .   The integration instance
                                                       pulls all the records that are
                                        User-defined.  updated later than the time
                                                       specified in this field from
Query                                   User-defined.  the end point. If you don't
                                                       specify a time, the system
                                                       uses the current time.

                                                       The time difference (in
                                                       seconds) between Service
                                                       Manager and the endpoint
                                                       system.

                                                       The relative URL specifies
                                                       the resource to be
                                                       exchanged in the endpoint
                                                       system.

                                                       The string in this field is
                                                       directly appended after the
                                                       string you configured in the
                                                       Base URL field under the
                                                       General tab.

                                                       The additional query
                                                       parameters.

                                                       The string in this field is
                                                       directly appended after the
                                                       Relative URL that's
                                                       configured in the previous
                                                       field.

                                                       For more information on
                                                       how to edit the Query
                                                       strings, see Edit the query
                                                       and pagination query
                                                       strings

Fields                                  Value                                           Service Manager 9.81
List path                               User-defined.
                                                                Description
Pagination                              Selected/not selected.
Page Size                               User-defined.           The root path of the list
First Record Offset                     User-defined.           result in the JSON response
                                                                from the endpoint for a
                                                                pulling request.
                                                                For example, the list path is
                                                                entities in the following
                                                                JSON response:

                                                                  {
                                                                  "entities": [
                                                                  {
                                                                  "entity_type":
                                                                  "Incident",
                                                                  "properties": {
                                                                  "Id": "***",
                                                                  ...
                                                                  }
                                                                  },
                                                                  ...
                                                                  ]
                                                                  }

                                                                When you select this option,
                                                                the result list from the
                                                                endpoint is transferred in
                                                                pages.

                                                                Specify the maximum
                                                                number of records in a
                                                                page.

                                                                This value defines the index
                                                                of the first record in each
                                                                page. Usually the value is
                                                                0 or 1 .


Fields                                  Value                   Description
Pagination Query                        User-defined.
                                                                Pagination parameters.

                                                                The string in this field is
                                                                directly appended after the
                                                                query parameters that are
                                                                configured under the
                                                                Inbound tab.

                                                                For more information on
                                                                how to edit the Pagination
                                                                Query strings, see Edit the
                                                                query and pagination query
                                                                strings

If you select the Activate Data Pushing option, the endpoint Service Manager system pushes
the data of the inbound task to the native Service Manager system. This option only works for
the integration between two Service Manager systems. The following fields appears when you
select this option.

Fields                                  Value                   Description

Incoming WebService                     User-defined.           The action name in the
Action                                  For example, Create or  RESTful API of the endpoint
                                        Update .                Service Manager system.

                                                                In an out-of-box Service
                                                                Manager system, the action
                                                                names are Create and
                                                                Update.

SM Action to execute                    User-defined.           The action to be executed in
                                                                the native Service Manager
                                        For example, add or     system for the
                                        save .                  corresponding incoming
                                                                action.

                                                                Possible values for this field
                                                                are add and save .


            Note

           By default, the integration template uses the Web Service: CaseExchange. To view
           this Web Service, go to the following location in Service Manager and search for
           "CaseExchange":
           Tailoring > Web Service > Web Service Configuration
           Case Exchange only supports the Web Service inbound push call that Action Type
           is Application Pass Through and Customer Action to Perform is
           CaseExchange.Pushing. Any other type of inbound push features for Case
           Exchange via SMIS aren't supported.

Integration Instance Parameters - Outbound

The following table explains the fields under the Outbound tab in the Integration Instance
Parameters page.

Fields                                  Value                                           Service Manager 9.81
Asynchronous Processing                 Selected/not selected.
                                                                Description
Event                                   User-defined.
Action Type                             User-defined.           If you select this option, the
                                                                outbound tasks work in
URL                                     User-defined.           asynchronous mode.
                                                                If you don't select this
HTTP method                             User-defined.           option, the creation or
Entity path                             User-defined.           update of an object triggers
                                                                the outbound task
                                                                immediately.

                                                                The name of the outbound
                                                                action.

                                                                The action type of this
                                                                event in the endpoint. The
                                                                available options for this
                                                                field are Create only and
                                                                Update only.

                                                                The relative URL.
                                                                The string in this field is
                                                                directly appended after the
                                                                base URL in the outbound
                                                                request URL.

                                                                Specify the HTTP method.

                                                                Specify the root path of the
                                                                list result in the JSON
                                                                response from the endpoint.
                                                                For more information about
                                                                entity path, see Entity path.


Fields                                  Value          Description
Parameter                               User-defined.
                                                       Additional parameters.
Additional path                         User-defined.
                                                       The string in this field is
                                                       directly appended after the
                                                       relative URL in the outbound
                                                       request URL. For example, if
                                                       you specify the parameter
                                                       as ?entitytype=incident ,
                                                       the outbound request URL
                                                       will be: <BaseURL><URL>?
                                                       entitytype=incident

                                                       This field is needed if the
                                                       endpoint only accepts
                                                       parameters in the URL.

                                                       Additional paths or
                                                       elements that are
                                                       mandatory in outbound
                                                       JSON but aren't defined in
                                                       field mapping or entity path.

                                                       For more information about
                                                       how to configure this field,
                                                       see Specify additional path.

Integration Instance Parameters - Error Handling

The following table explains the fields under the Error Handling tab in the Integration Instance
Parameters page.


Fields                                  Value                   Description
                                        Selected/not selected.
Activate incident creation                                      Enable or disable the error
for Errors                                                      handling feature, which can
                                                                automatically create an
Title                                   User-defined.           Incident record for a failed
                                                                SMIS task.

                                                                The title of the Incident
                                                                records for error handling.

                                        Default: SMIS Error .

Assignment Group                        User-defined.           Specify the Assignment
                                                                Group of the Incident
                                                                records for error handling.

Impact / Urgency                        User-defined.           Specify the Impact and
                                                                Urgency of the Incident
                                                                records for error handling.

Category                                User-defined.           Specify the Category of the
                                                                Incident records for error
                                                                handling.

Area                                    User-defined.           Specify the Area of the

                                                                Incident records for error

                                                                handling.

Subarea                                 User-defined.           Specify the Subarea of the
                                                                Incident records for error
                                                                handling.

Affected Service                        User-defined.           Specify the Affected
                                                                Service of the Incident
                                                                records for error handling.

Integration Instance Parameters - Attachment Handling

The following table explains the fields under the Attachment Handling tab in the Integration
Instance Parameters page.

All the parameters in this tab apply to inbound pull and outbound processes.


Fields                                  Value                       Description
Activate attachment                     Selected/not selected.
exchange                                                            Enable or disable
Attachment REST URL                     User-defined.               attachment exchange.
Unsupported File
Extensions                              User-defined.               The REST API URL for
                                        For example: exe;rar;iso .  endpoint attachments.
Timeout (s)
                                        User-defined.               Specify unsupported file
Size Limitation (kb)                    Default: 20 .               types in the endpoint. Split
                                                                    multiple file types by using
                                                                    semicolons (;).

                                                                    This value specifies the
                                                                    time-out (in seconds) for
                                                                    each of these three
                                                                    attachment activities:
                                                                    Connect, Send, and
                                                                    Receive.

                                        User-defined.               The endpoint limitation on
                                        Default: 1024               the attachment size.

                                                                    This value is useful only
                                                                    when an attachment is sent
                                                                    to the endpoint.

Integration Instance Parameters - Additional Script

The following table explains the fields under the Additional Script tab on the Integration
Instance Parameters page.

Fields                                        The Authentication section                          Service Manager 9.81
Set the HTTP header
                                        Value                             Description

                                        User-defined.                     Specify an additional
                                                                          JavaScript function to set
Login to the external system User-defined.                                the HTTP header.

                                                                          If you don't specify this
                                                                          field, the default HTTP
                                                                          header only provides Basic
                                                                          Authentication and Content-
                                                                          Type.

                                                                          Specify additional
                                                                          JavaScript function for login
                                                                          if the endpoint requires
                                                                          special login process.

                                                                          If you don't specify this
                                                                          field, Case Exchange
                                                                          doesn't perform any login
                                                                          process and only sets the
                                                                          authentication information
                                                                          into the HTTP header

Fields                                           The Inbound section                          Service Manager 9.81
Validate inbound response
                                        Value                         Description

                                        User-defined.                 Specify an additional
                                                                      JavaScript function to
Inbound & Push post                     User-defined.                 validate the response body
processing activities                                                 of an inbound request.

                                                                      When the data comes in,
                                                                      this script validates the data
                                                                      before the data is pushed
                                                                      into the SMIS task queue. If
                                                                      you don't specify this field,
                                                                      Case Exchange only
                                                                      validates the response
                                                                      HTTP code and doesn't
                                                                      validate the response body.

                                                                      Specify an additional
                                                                      JavaScript function to
                                                                      perform post process for
                                                                      inbound tasks.

                                                                      This script performs post
                                                                      processing after SMIS
                                                                      processes the inbound task.
                                                                      If you don't specify this
                                                                      field, Case Exchange
                                                                      doesn't perform any post
                                                                      process for inbound tasks.

Fields                                          The Outbound section                          Service Manager 9.81

Validate & Parse outbound               Value                         Description
response
                                        User-defined.                 Specify an additional
                                                                      JavaScript function to
Outbound post processing User-defined.                                validate and parse the
activities                                                            response body of outbound
                                                                      request. The function works
                                                                      in the following way:

                                                                           If the validation
                                                                           succeeds, the function
                                                                           returns the parsed
                                                                           external ID.
                                                                           If the validation fails,
                                                                           the function returns
                                                                           "False".

                                                                      If you don't specify this
                                                                      field, Case Exchange only
                                                                      validates the HTTP code
                                                                      and retrieves the ID
                                                                      according to the definitions
                                                                      in the Inbound tab.

                                                                      Specify an additional
                                                                      JavaScript function to
                                                                      perform post process for
                                                                      outbound tasks.

                                                                      This script performs post
                                                                      processing after SMIS
                                                                      processes the outbound
                                                                      task. If you don't specify
                                                                      this field, Case Exchange
                                                                      doesn't perform any post
                                                                      process for outbound tasks.

Fields                                         The Attachment section                          Service Manager 9.81
Set the HTTP header
                                        Value                          Description

                                        User-defined.                  Specify an additional
                                                                       JavaScript function to set
Set header string for the               User-defined.                  the HTTP header for
HTTP body                                                              attachment.

Retrieve and parse                      User-defined.                  If you don't specify this
Attachment Info                                                        field, the default HTTP
                                                                       header only provides Basic
Parse response of                       User-defined.                  Authentication and Content-
attachment creation                                                    Type.

                                                                       Specify an additional
                                                                       JavaScript function to
                                                                       assemble the header of the
                                                                       attachment request if the
                                                                       attachment exchange uses
                                                                       the multipart/form-data
                                                                       transfer.

                                                                       Specify an additional
                                                                       JavaScript function to
                                                                       retrieve attachment
                                                                       information, such as
                                                                       attachment name, type,
                                                                       size, and so on.

                                                                       Specify an additional
                                                                       JavaScript function to parse
                                                                       the response body of an
                                                                       outbound attachment
                                                                       request.

Fields                                  Value                                  Service Manager 9.81
                                        User-defined.
Update outbound                                        Description
Attachment Info
                                                       Specify an additional
                                                       JavaScript function to
                                                       update the attachment
                                                       information to the record in
                                                       the endpoint. The
                                                       information can link the
                                                       attachment with the record.
                                                       You don't need to specify
                                                       this field if the endpoint
                                                       system can automatically
                                                       update the attachment
                                                       information.


1.1.8.2.1.6. Configure Case Exchange Rule Sets

Before you start to configure a Case Exchange Rule Set, make sure the configuration of the
fields mapping in the related integration instance is complete.
The Case Exchange Rule Set is introduced so that customers can easily trigger Case Exchange
outbound events.
It is unsupported to trigger Case Exchange activities by using Rule Sets that aren't provided.
For more information about how to configure Case Exchange Rule Sets, see the following
topics:

     Create a rule set
     Add a Case Exchange rule


1.1.8.2.1.7. Invoke Case Exchange Rule Sets

This section introduces how to invoke Rule Sets to trigger automated data exchange for the
Case Exchange integration.

Invoke Rule Sets from workflows

Applies to User roles: System Administrator

On a Service Manager system that has Process Designer implemented, you can invoke a Rule
Set from a workflow phase.

To invoke a Rule Set from a workflow phase, follow these steps:

   1. Click Tailoring > Process Designer > Workflows from the System Navigator. The
     workflows list opens.

   2. Select the workflow in which you want to invoke a Rule Set.
   3. Select the phase in which you want to invoke a Rule Set.
   4. Add the Rule Set in the following tabs according to your needs:

     • The On enter, On exit, Initialization, On display, On update, or After successful
     update tab under the Rule Sets tab.
     • The Actions tab.
   5. Save the workflow.

Invoke Rule Sets from triggers

Applies to User roles: System Administrator

If Process Designer is not implemented in Service Manager, you must invoke a Rule Set from a
Service Manager trigger, by adding the following API in the trigger's script:

lib.CaseExchange_RuleExecute.executeSingleRuleSet(record,oldrecord,RuleSetID)

The following table explains the meaning of each parameter in this API.

Parameter                               Description
record                                  The new record.
oldrecord                               The old record.
RuleSetID
                                        The ID of the Case Exchange Rule Set.
                                        For example, CE_CREATE_INCIDENT .

To add a trigger that invokes a Rule Set, follow these steps:


1. Click Tailoring > Database Manager. The Database Manager page opens.
2. Type triggers in the Table field, and then click Search. The Search Trigger Records page

  opens.
3. Complete the following fields:

Field                                                                                      Service Manager 9.81
Trigger Name
Table Name                              Description
Trigger Type
                                        The name of the trigger.
Application
                                        The file to be monitored by this trigger.

                                        Select the specific activity to react to:

                                        1 - Before Add - When adding a new
                                        record to this file, launch the application
                                        prior to committing the addition.

                                        2 - After Add - When adding a new
                                        record to this file, launch the application
                                        after committing the addition.

                                        3 - Before Update - When modifying a
                                        record in this file, launch the application
                                        prior to committing the change.

                                        4 - After Update - When modifying a
                                        record in this file, launch the application
                                        after committing the change.

                                        5 - Before Delete - When deleting a
                                        record in this file, launch the application
                                        prior to performing the deletion.

                                        6 - After Delete - When deleting a record
                                        in this file, launch the application after
                                        performing the deletion.

                                        Note: Only triggers of type 4 (After
                                        Update), and type 6 (After Delete) are
                                        supported by Cascade Updates.

                                        The RAD application to be launch by this
                                        trigger. If you only intend to invoke a Rule
                                        Set by using this trigger, leave this field
                                        empty.

    Field                                                                                  Service Manager 9.81
    Script
                                        Description
4. Click Add.
                                        Call the following API by using the
                                        appropriate parameters:
                                        lib.CaseExchange_RuleExecute.execute
                                        SingleRuleSet(record,oldrecord,RuleSetI
                                        D)
````
