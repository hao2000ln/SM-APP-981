---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.6.1.5 .. 1.6.1.5
printed_pages: 881-897
---

# 1.6.1.5 Discovery Event Manager

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.6.1.5. Discovery Event Manager

The Discovery Event Manager tool provides you with information about configuration items
(CIs) in use by your organization. Discovery Event Manager collects data from associated Web
services, such as the Universal Configuration Management Database (UCMDB) for enterprise
IT organizations. UCMDB captures, documents, and stores information about CIs, service
dependencies, and relationships that support business services. The Discovery Event Manager
tool takes the information captured by UCMDB and compares the actual state of each incoming
CI record (both existing and new) to the managed field state of the CI record in Service
Manager.

If the actual state of an incoming UCMDB CI record differs from the managed field state of the
CI record in Service Manager, the Discovery Event Manager tool works with Configuration
Management and Change Management to perform any required changes to the incoming CI
record according to the rules you have set in the Discovery Event Manager tool.

Related topics

     Discovery Event Manager managed fields
     Discovery Event Manager rules
     Discovery Event Manager rule options
     Add a managed field in Discovery Event Manager
     Add a rule in Discovery Event Manager
     Customize Changes in Discovery Event Manager
     Customize Incidents in Discovery Event Manager
     View, modify, or delete a managed field in Discovery Event Manager
     View or modify rules in Discovery Event Manager


1.6.1.5.1. Discovery Event Manager rules

Discovery Event Manager (DEM) rules define DEM's actions when the actual state of an
incoming configuration item (CI) record differs from the CI's managed state in Service
Manager.

During initial configuration of Discovery Event Manager, you start with a basic set of rules for
Change Management. You can refine those rules as necessary. Each rule identifies a series of
checks that Discovery Event Manager processes whenever Service Manager receives a CI
record from Web services. Depending on the rule, Discovery Event Manager may add or delete
the record, open a change, log the information, or update the record's status.

Service Manager opens a change or incident based on the settings defined in the
populateChange or populateIncident function in the discoveryEvent ScriptLibrary record.
You can override the default settings by writing a custom JavaScript on the Change
Customization or Incident Customization tab.

Related topics

     Discovery Event Manager
     Discovery Event Manager managed fields
     Discovery Event Manager rule options
     Add a managed field in Discovery Event Manager
     Add a rule in Discovery Event Manager
     Customize changes in Discovery Event Manager
     Customize incidents in Discovery Event Manager
     View, modify, or delete a managed field in Discovery Event Manager
     View, modify, or delete rules in Discovery Event Manager


1.6.1.5.1.1. Discovery Event Manager rule
options

Rules help to automate the process of managing incoming configuration item (CI) records.
When you have rules set up, you can manage whether a record is added, updated, or deleted
to the CI records in Service Manager. The Discovery Event Manager tool checks the incoming
CI records and determines what to do when the actual state of the CI records doesn't match
the managed state of the CI records in Service Manager. When Discovery Event Manager finds
the rule that applies to an incoming CI record type, the server checks the rule, and then
updates the record according to the rules you have set up.

Example: If a user's machine has 4 GB of RAM added and the Discovery Event Manager tool
discovers that the actual state of the CI record doesn't match the Service Manager managed
state for that CI record type, the Discovery Event Manager tool opens an unplanned change.
This then gives the Change Manager the opportunity to review the CI record and determine
what tasks to complete.

Actions are required in the following cases:

     Records that don't exist.
     Records that contain unexpected data.
     Records are marked for deletion.

The following options are available when configuring rules to meet your business needs:

     Action if matching record doesn't exist: If a CI record doesn't exist in Service Manager.
           Add the record: (Default) When the information received from Web services through
           Discovery Event Manager doesn't bring up a matching record in Service Manager,
           add the record.
           Add the record, and set dependency as true: This option is available only for
           synchronization of CI relationship data. Service Manager will add the CI relationship
           record and enable outage dependency for the record by checking its Outage
           Dependency checkbox and setting its number of dependent downstream CIs to 1.
           Open an Incident: Open an incident to investigate a new CI record that currently
           doesn't exist in Service Manager to determine if it is compliant with Service
           Manager.
           Open a Change: Open an unplanned change to review the new CI record, because it
           currently doesn't exist in Service Manager. This change gives the Service Manager
           Administrator an opportunity to deny the Change Management request and back it
           out by using the change management process or to accept the actual state of the
           new CI record and assign tasks accordingly.

     Action if record exists but unexpected data discovered: Changes to the information in
     an existing CI record raise a flag for the Discovery Event Manager tool. Some of the
     information is not part of the managed state in Service Manager. The unexpected data in
     the CI record must be logged or reviewed.


           Open a Change: (Default) Open an unplanned change to review the actual state of
           the CI record. This change gives the Service Manager Administrator an opportunity
           to deny the Change Management request and back it out by using the change
           management process, or to accept the actual state of the existing CI record and
           assign tasks accordingly.
           Log Results and update record: Log the results of the actual state of the CI record,
           and then update the record.
           Open an Incident: Open an Incident to investigate the actual state of a CI record and
           determine what actions must be performed or initiated to bring the record into
           compliance with Service Manager.
     Action if record is to be deleted: If an external event specifies that the record needs to be
     deleted.
           Delete record: (Default for CI relationship records) This option is available for
           synchronization of both CI and CI relationship records. Service
           Manager automatically deletes the record.
           Open an Incident: This option is available only for synchronization of CI relationship
           records. Service Manager opens an incident to investigate the deleted record and
           determines which actions must be performed or initiated to bring the record into
           compliance with Service Manager.
           Open a Change: This option is available only for synchronization of CI relationship
           records. Service Manager opens an unplanned change to review the deleted record.
           The change allows someone to investigate whether the deleted record is compliant
           with your business practices. If the record is compliant, the change can be
           approved. If the record is not compliant, then the change can be denied and the
           record added back to the system.
           Update record to the selected status: (Default) This option is available only for
           synchronization of CI records. Service Manager updates the status of the CI record
           to a value selected from the drop-down list (for example, Retired/Consumed),
           instead of deleting the record permanently.
           Open an Incident to update record to the selected status: This option is available
           only for synchronization of CI records. Service Manager opens an incident to update
           the record’s status to a value selected from the drop-down list (for
           example,Retired/Consumed). Once the incident has been closed, Service Manager
           automatically updates the CI record to the selected status.
           Open a Change to update record to the selected status: This option is available
           only for synchronization of CI records. Service Manager opens an unplanned
           change to update the CI record’s status to a value selected from the drop-down list
           (for example, Retired/Consumed). The change allows someone to investigate
           whether the requested status change is compliant with your business practices.
           Once the change has been approved and closed, Service Manager automatically
           changes the CI record to the selected status. If the change has been denied, Service
           Manager makes no changes to the CI record.

Related topics


Discovery Event Manager
Discovery Event Manager change open process
Discovery Event Manager managed fields
Discovery Event Manager rules
Add a managed field in Discovery Event Manager
Add a rule in Discovery Event Manager
Customize changes in Discovery Event Manager
Customize incidents in Discovery Event Manager
View, modify, or delete a managed field in Discovery Event Manager
View, modify, or delete rules in Discovery Event Manager


1.6.1.5.1.2. Add a rule in Discovery Event
Manager

Applies to User roles: System Administrator

Rules are the core of Discovery Event Manager processing. Based on your organization's
requirements, you can refine the basic set of rules that are configured with the Discovery Event
Manager tool by adding rules.

To add a rule:

   1. Click Tailoring > Web Services > Discovered Event Manager Rules. The Discovery Event
     Manager form opens.

   2. Click New. The new rule form opens.
   3. Enter the new rule name.
   4. Select a table to associate with the rule from the Table Name list, and then click Next.
   5. Enter the condition for the rule. The system adds the rule to the records table.

                   Note

                • The condition must ensure that only one rule applies when processing the
                web service request.
                • An empty condition evaluates to true by default.

   6. Click Save.
   7. Click OK.

Related topics

     Discovery Event Manager
     Discovery Event Manager change open process
     Discovery Event Manager managed fields
     Discovery Event Manager rules
     Discovery Event Manager rule options
     Add a managed field in Discovery Event Manager
     Customize changes in Discovery Event Manager
     Customize incidents in Discovery Event Manager
     View, modify, or delete a managed field in Discovery Event Manager
     View, modify, or delete rules in Discovery Event Manager


1.6.1.5.1.3. View, modify, or delete rules in
Discovery Event Manager

Applies to User roles: System Administrator

Rules help you to automate the change control process and update the incoming configuration
item (CI) records to comply with the CI record fields in Service Manager. As you reevaluate
your organization's requirements, you may view the rules that are set up and make changes as
you see fit. In addition, when the existing rules settings for a CI type are no longer valid, you
can replace the existing rules settings with a new set of rules.

Warning: Make sure you delete the rules for the CI ID type you want to delete. If you delete the
wrong set of rules, you have to add the CI ID type and set up the rules for each action as
necessary.

To view or modify existing rules:

   1. Click Tailoring > Web Services > Discovered Event Manager Rules. The Discovery Event
     Manager form opens.

   2. Click Search to retrieve a list of CI ID types.
   3. Select the ID type for the rules you want to view.
   4. Select the Rules tab. The existing rules settings for the selected CI type are displayed.
   5. If you want to edit the rule, do the following:

           Make the necessary changes. For example, if you choose to select a different action
           step for records that don't exist, make your change.
           Click Save.
   6. Click OK.

To delete a set of rules:

   1. Click Tailoring > Web Services > Discovered Event Manager Rules. The Discovery Event
     Manager form opens.

   2. Click Search to retrieve a list of CI ID types.
   3. Select the CI ID type, and then select the Rules tab. Existing rules settings for the

     selected CI type are displayed.
   4. Delete the rules for this CI type as required.
   5. Click OK.

Related topics

     Discovery Event Manager
     Discovery Event Manager managed fields
     Discovery Event Manager rules
     Discovery Event Manager rule options
     Add a managed field in Discovery Event Manager
     Add a rule in Discovery Event Manager


Customize changes in Discovery Event Manager
Customize incidents in Discovery Event Manager
View, modify, or delete a managed field in Discovery Event Manager


1.6.1.5.1.4. Customize Changes in Discovery
Event Manager

Applies to User roles: System Administrator

You may have an incoming configuration item (CI) record that isn't compliant with the managed
state of that CI record in Service Manager go through the Change Management process. If this
is your best practice, you can customize how you want the Discovery Event Manager tool to
process those incoming CI records.

To customize the way changes are handled within Discovery Event Manager:

   1. Click Tailoring > Web Services > Discovered Event Manager Rules. The Discovery Event
     Manager form opens.

   2. Click Search to retrieve a list of Configuration Item (CI) ID types.
   3. Select the ID type for the customization you want to make, and then select the Change

     Customization tab.
   4. Enter the customized script you want to override the default values set by the

      discoveryEvent ScriptLibrary record (You may refer to the change record as "change").
   5. Click Save.
   6. Click OK.

Related topics

     Discovery Event Manager
     Discovery Event Manager managed fields
     Discovery Event Manager rules
     Discovery Event Manager rule options
     Add a managed field in Discovery Event Manager
     Add a rule in Discovery Event Manager
     Customize Incidents in Discovery Event Manager
     View, modify, or delete a managed field in Discovery Event Manager
     View, modify, or delete rules in Discovery Event Manager


1.6.1.5.1.5. Customize Incidents in Discovery
Event Manager

Applies to User roles: System Administrator

You may have an incident logged when an incoming configuration item (CI) record
isn't compliant with the managed state of a CI record in Service Manager. If this is your best
practice, you can customize the rules you set for automatically opening an incident record.

To customize the JavaScript for opening an incident record:

   1. Click Tailoring > Web Services > Discovered Event Manager Rules. The Discovery Event
     Manager form opens.

   2. Click Search to retrieve a list of Configuration Item (CI) ID types.
   3. Select the ID type for the customization you want to make to incidents, and then select

     the Incident Customization tab.
   4. Enter the customized script you have created to override the default values set by the

      discoveryEventScriptLibrary record ( You may refer the incident record as "incident").
   5. Click Save.
   6. Click OK.

Related topics

     Discovery Event Manager
     Discovery Event Manager managed fields
     Discovery Event Manager rules
     Discovery Event Manager rule options
     Add a managed field in Discovery Event Manager
     Add a rule in Discovery Event Manager
     Customize Changes in Discovery Event Manager
     View, modify, or delete a managed field in Discovery Event Manager
     View, modify, or delete rules in Discovery Event Manager


1.6.1.5.2. Discovery Event Manager managed
fields

Managed fields are key fields in the Service Manager configuration item (CI) record types that
the Discovery Event Manager tool uses to validate the incoming CI records from Web services.
By default, the fields of the incoming CI records should match the key fields in the Service
Manager CI records.

Suppose Discovery Event Manager has discovered some discrepancies between the actual
state of the incoming CI record fields and the Service Manager managed fields. In this case,
Change Management handles these discrepancies by default. Rules define what to do with a CI
record to make it compliant with the CI record types in Service Manager.

Related topics

     Discovery Event Manager
     Discovery Event Manager rules
     Discovery Event Manager rule options
     Add a managed field in Discovery Event Manager
     Add a rule in Discovery Event Manager
     Customize changes in Discovery Event Manager
     Customize incidents in Discovery Event Manager
     View, modify, or delete a managed field in Discovery Event Manager
     View, modify, or delete rules in Discovery Event Manager


1.6.1.5.2.1. Add a managed field in Discovery
Event Manager

Managed fields are key fields in Service Manager configuration item (CI) record types. They
are important to helping the Discovery Event Manager tool to discover differences between the
data in the incoming CI records from Web services versus what Service Manager is expecting
to receive in those records. If the incoming records don't match the managed key fields in
Service Manager, the rules set in the Discovery Event Manager tool determine what will
happen to those incoming CI records.
For example: If the joinbizservice table has three fields in the Managed Fields tab in Discovery
Event Manager and some of the expected information is different or missing from any of those
fields, the Discovery Event Manager tool will deal with that incoming CI record that's not
compliant with the Service Manager managed fields for that CI record type.

If you determine that a necessary field is not included in the existing discovery process, you
can add a managed field to the applicable table using the settings on the Managed Fields tab.

            Note

           If a managed field doesn't exist in an incoming CI record, the Discovery Event
           Manager tool is not able to find discrepancies based on that field.

            Tip

           The following steps describe how to manually add a managed field. If you want to
           automatically add multiple or all fields from a table as managed fields, you can
           click the Load Fields button on the Managed Fields tab.

To add a managed field:

   1. Click Tailoring > Web Services > Discovered Event Manager Rules. The Discovery Event
     Manager rules form is displayed.

   2. Click Search to retrieve a list of CI ID types.

   3. Select the ID type for the fields you want to view, and then select the Managed
     Fields tab. You can see which fields are being managed for this CI type.

   4. To select a new field you want managed, do the following:

          a. Select the drop-down arrow in the next blank Field Name field. You will see the list
          of fields related to this CI type.

          b. Select the field you want to add to the Managed Fields tab for this CI type.


          c. For a field that's part of an array of structures, choose a Structure and specify the
          field's Index value. For example, the CI type computer contains array elements, such
          as ports, printers, and scanners. Choose an array element within the structure, and
          then choose the corresponding index number.

          d. Click Save.

   5. Repeat this process to add a managed field for another ID type.

   6. Click OK.

Related topics

Discovery Event Manager
Discovery Event Manager managed fields
Discovery Event Manager rules
Discovery Event Manager rule options
Add a rule in Discovery Event Manager
Customize changes in Discovery Event Manager
Customize incidents in Discovery Event Manager
View, modify, or delete a managed field in Discovery Event Manager
View, modify, or delete rules in Discovery Event Manager


1.6.1.5.2.2. View, modify, or delete a managed
field in Discovery Event Manager

Applies to User roles: System Administrator

Managed fields are important to ensure that the Discovery Event Manager tool can process
incoming configuration item (CI) data from Web services. When the inventory of your
organization changes, you can add or update the CI types based on your new inventory
requirements. You can also review the managed fields for existing CI types to decide if the
necessary fields exist and add, modify, or delete managed fields.

Warning: If you are deleting a field, make sure you select the field you want to delete. If you
delete the wrong field, you must add the field back into the Managed Fields tab.

To view, modify, or delete a managed field:

   1. Click Tailoring > Web Services > Discovered Event Manager Rules. The Discovery Event
     Manager form opens.

   2. Click Search to retrieve a list of CI ID types.
   3. Select the ID type for the fields you want to view, and then select the Managed Fields

     tab. The system displays a list of managed fields for the selected CI type.
   4. Select the field you want to edit or delete. Make any necessary changes or delete a field

     that's no longer valid. Click Save.
   5. Click OK.

Related topics

     Discovery Event Manager
     Discovery Event Manager managed fields
     Discovery Event Manager rules
     Discovery Event Manager rule options
     Add a managed field in Discovery Event Manager
     Add a rule in Discovery Event Manager
     Customize changes in Discovery Event Manager
     Customize incidents in Discovery Event Manager
     View, modify, or delete rules in Discovery Event Manager


1.6.1.5.3. Discovery Event Manager change
open process

You can use the Discovery Event Manager tool to automate the change open process. When a
change is needed to address issues for review or tasks to be performed, the change open
process begins. The change goes through phases that drive the unplanned change through the
necessary tasks to update the managed fields of a CI or to determine if the change is
necessary or desired. To see an Unplanned Change flow diagram, see the related topics.

The change phases are as follows:

Discovery Assessment phase: Assess whether or not an unplanned change is allowed.
Comments can be added and updated in this phase, as needed. The CCB Approver must
confirm that the change is desired.

     If the change is approved, update the managed field and close the change.
     If the change is denied, move it to the Discovery Backout phase to undo the change.

Discovery Backout phase: Back out a change after determining that the change is
unnecessary or desired. Comments can be added and updated in this phase, as needed,
including updates to modified data. If the backout of the change is complete, move it to the
Discovery Verification phase.

     If the denied change is verified, close the change.
     If the denied change is not verified, return to the Discovery Backout phase.

Discovery Implementation phase: The change requires further consideration before it is
closed.

     If the backout of the change fails verification, return to the Discovery Implementation
     phase for further consideration.
     If verification of the change succeeds, close the change.

Discovery Verification phase: Verify that the change is successfully implemented.

     If verification of the change fails, return to the Discovery Implementation phase.
     If verification of the change succeeds, close the change.

Related topics

Discovery Event Manager
Discovery Event Manager managed fields
Discovery Event Manager rules
Discovery Event Manager rule options
Add a managed field in Discovery Event Manager
Add a rule in Discovery Event Manager
Customize changes in Discovery Event Manager


Customize incidents in Discovery Event Manager
View, modify, or delete a managed field in Discovery Event Manager
View, modify, or delete rules in Discovery Event Manager
````
