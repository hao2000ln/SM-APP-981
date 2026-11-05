---
source: Document/pdf/v981/Upgrade.pdf
version: 9.81
sections: 1.3.5.15 .. 1.3.8.1
printed_pages: 171-196
---

# 1.3.5.15 Step 15: Build a custom upgrade

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.3.5.15. Step 15: Build a custom upgrade

If you have followed all the steps to this point, you have already run the upgrade
against the duplicate system you created of your production system, and you have
performed reconciliation for that system. This section describes how to build a
custom upgrade, which is then applied to your test system and production system.

            Recommendation

           Before you begin to build the custom upgrade, ensure back up (see Step
           14: Back up the system) or duplicate (see Step 1: Duplicate the production
           environment) the current upgraded environment.

To build the custom upgrade, follow these steps:

  1. Sign in to the reconciled development system.

  2. (Optional) You may need to exclude certain records on the upgraded system
     from being built to the custom upgrade package. To do so, follow these steps:

         a. Click Tailoring > Differential Upgrade > Patch Records to open the Patch
         Maintenance page.

         b. Select UPGRADE from the drop-down list, and then press Enter.

         c. You can update the query definition as required. If removing an entry,
         ensure that you clear the Dbdict field, uncheck the Add Only checkbox, and
         delete the corresponding query.

         d. Save your changes.

  3. Create a folder for the custom upgrade on the Service Manager server. You can
     assign any name you like to this folder. However, for documentation purposes,
     this folder will be referred to as the CustomUpgrade folder. Ensure that the
     CustomUpgrade folder is empty.

                  Note

                If you are connecting to the Service Manager server from a client
                that's installed on a remote client computer, make sure that the folder
                is created on the Service Manager server instead of the client
                computer.


  4. From the System Navigator, click System Administration > Ongoing
     Maintenance > Upgrade Utility > Create Custom Upgrade.

  5. The Upgrade Utility automatically checks for duplicate records prefixed with
     "PRE", "NEW" or "OLD".

  6. The system displays the patch file name and all the supported languages that are
     installed on your Service Manager system. Review this information, and then
     click Next.

  7. Type a name for the custom upgrade package in the The name of the release
     field. For example, SM202210.

  8. Type the fully-qualified path to the folder where the Upgrade Utility should create
     files in the The path to export the upgrade files field. This should be the path to
     the empty CustomUpgrade folder that you created in step 3. For example,
      C:\OpenText\Service Manager\CustomUpgrade .

                  Note

                You must have read, write, and execute permission to the folder.

  9. Click Next.
10. The system displays Service Manager Upgrade Builder is now ready to build

     the upgrade. Click Next to continue.

11. When you receive a "Finished creating the transfer files for the upgrade"
     message, the Upgrade Utility has finished the data packaging.

            Note

           If you are upgrading from SM9.6x, you only need to type the fully-
          qualified path to the folder to create files from Step 6 to Step 9.

Upgrade Utility logs and error messages

When building the custom upgrade, the Upgrade Utility creates a set of log files,
which reside in the log directory. The following table describes the contents of the log
files during this step.


Log file                                List of upgrade logs
detail.log
                                                  Contents
transfer.log
                                        This file contains specific information
                                        about the upgrade, including the
                                        following:

                                            All information in transfer.log and
                                            upgrade.log
                                            Name of the file being purged. For
                                            example, "2022-09-20 13:58:32
                                            dbdict: upgradestatus is purged."
                                            Progress of signature creation. For
                                            example, "2022-09-20 14:47:36
                                            Created 100 signatures for Object
                                            on version SM202308"
                                            Building distribution information.
                                            For example, "2022-09-20 14:55:07
                                            Building Distribution object for
                                            Applications Cluster Action.run"

                                        This file contains information about the
                                        object being transferred by the
                                        upgrade. For example, “2022-09-20
                                        15:12:27 Initiating an export of
                                        scmessage on query "((class="error"
                                        and message.id isin {"10"})) and
                                        syslanguage~="xxx"""

Log file                                                                                        Service Manager 9.81
upgrade.log
                                        Contents

                                        This file contains information about
                                        where the upgrade is at any point,
                                        including the following:

                                            Starting and ending of each sub-
                                            phase. For example, "2022-09-20
                                            14:47:32 **** Start Phase [Pre
                                            Create Action Check] ****"
                                            Main activities during each sub-
                                            phase. For example, "2022-09-20
                                            14:47:35 Signaturing records."
                                            Name of the file being exported.
                                            For example, "2022-09-20 15:11:37
                                            Exporting: table = Object query =
                                            'true'"


1.3.6. Upgrade tasks on the test
environment

Step 1: Apply the custom upgrade to the test
environment

You need to apply the newly-created custom upgrade to your test system for user
acceptance testing.

            Note

           If you experience problems, such as a power failure or a network
           connection error while upgrading the system, you need to restore the
           database before attempting to run the upgrade again.

To upgrade the custom upgrade, follow these steps:

   1. On the test system, which is a copy of your production system, complete all the
     preparation tasks in Upgrade tasks on the development environment.

   2. Disable the Client side load/unload option from Window > Preferences >
     Service Manager.

   3. Load the preupg.bin file using Service Manager Database Manager, and then
     restart the client.

     Instead of using the file that you extracted from the product installation package,
     you must use the preupg.bin file in your CustomUpgrade folder.

                   Note

                The AppUpgVersion.txt file doesn't exist in the CustomUpgrade
                folder. Do not copy the file to this folder.

4. From the System Navigator, click System Administration > Ongoing
  Maintenance > Upgrade Utility > Apply Upgrade to launch the Upgrade Utility.

5. In the text box, type the fully qualified path to the CustomUpgrade folder, and
  then click Next.

  Instead of using the file that you extracted from the product installation package,
  you must use your CustomUpgrade folder.


  Example:

  Windows: c:\temp\upgrade\

  Linux: ~/upgrade/

               Note

                   You must have read, write, and execute permission to the
                   folder.
                   If you are upgrading from SM9.6x, the system displays the
                   parameter settings before this step. Review the settings and
                   then click Next to continue.

6. The loading process may take a long time. Wait until the file is loaded and the
  system displays the Transfer files loaded message.

7. The system displays a series of information for your verification, including
  Applications version upgrading from, Applications version upgrading to,
  Applications base version, Full path to the Upgrade Utility files and Language(s)
  to be upgraded. Verify this information and then click Next to continue.

               Note

             If this screen doesn't display the correct information, don't continue
             with the upgrade. Instead, contact Software Customer Support.

   8. When you are asked whether you want to proceed, click Yes.
   9. The Upgrade Utility displays the status when the upgrade is being processed.

 10. When you receive an "UPGRADE IS COMPLETE" message, the Upgrade Utility
     has finished the data processing and you can follow the instructions in the
     message to complete the next steps. After you click Finish, you are
     automatically logged out.

 11. Restart the server and log back into the client.
 12. Open the scversion table in the Database Manager, and verify that the

     Application Version field is 9.72.00xx. If this field displays a value other than
     9.72.00xx, check the log files to identify the issue that occurred.

Note how long it takes to apply the custom upgrade, so you will know how long the
production system will be unavailable during the production upgrade. You can check
the log file for an estimate.

Upgrade Utility logs and error messages


When applying the custom upgrade to the test system, the Upgrade Utility creates a
set of log files, which reside in the log directory.

The contents of these log files are similar to those in the log files when running an
out-of-box upgrade. See Upgrade Utility logs and error messages.

Tables and records that aren't upgraded by the Upgrade
Utility

The Upgrade Utility doesn't automatically upgrade all tables and records. The patches
record lists the tables and records that are packaged into the custom upgrade.
Customizations made to any other tables or records will not be part of the custom
upgrade. To make sure that the objects that you have reconciled are moved to the
production system, verify the following scenarios:

     If an object is in the patches record, and the Result field of its related
     “upgraderesults" record displays "Kept Customer” or “Kept Customer Non-
     OOB”, change the Result field to “Reconciled”.

     For example, follow these steps after you have modified the
     cm.open.display_newphase displayoption record:

        1. From the System Navigator, click System Administration > Ongoing
           Maintenance > Upgrade Utility > View/Merge Results.

        2. Type displayoption in the Object Type field, type
           cm.open.display_newphase in the Object Name field, and then click
           Search.

                         Note

                      Some object names consist of multiple key fields, you can find
                      the definitions in the signaturemake record.

        3. If the Result field in the search results is “Kept Customer” or “Kept
           Customer Non-OOB”, manually change the Result field to “Reconciled”

     If an object is in the patches record, and the Result field of its related
     “upgraderesults" record is not "Kept Customer” or “Kept Customer Non-OOB”,
     no additional task is needed.

     If an object is not in the patches record, do one of the following:

           Create an unload file containing those objects by adding them to an unload
           script or using the standard Service Manager Unload/Export Facility,


           Make the same changes manually by directly modifying the objects on the
           production system. For records that you might have deleted, you can either
           build a purge script for those records or delete the records manually on the
           production system.

Resolve Process Designer related data

To resolve the Process Designer related data, follow these steps:

   1. From the System Navigator, click System Administration > Ongoing
     Maintenance > Upgrade Utility > View/Merge Results.

   2. Click the Expert Search button from the More Actions menu, type
     version.reconciled#"PD Enable" in the Query field, and then click Search.

   3. In the search result, resolve the data by following the actions described in the
     table below.

Reconciled Version                      Result  Action
                                        Any
PD Enable: Need to be                           Remove the objects
removed                                         manually.

Step 2: Perform additional manual tasks

This section lists changes that can't be automated by the Upgrade Utility and changes
that are required only for certain customers. Make these changes before testing and
backing up your system. For detailed instructions, refer to Step 10: Perform additional
manual tasks.

Step 3: Migrate Process Designer data

See Step11: Migrate Process Designer data for more information.

Step 4: Test the test environment

After you apply the custom upgrade on the test environment, perform user
acceptance testing and load testing for all features, especially customized
applications. Test the upgraded system with the new Service Manager client to verify
any changes you have made in reconciliation. If the upgrade process has any
problems, you need to contact Customer Support. After you complete testing of the
upgraded system, you can use it to upgrade your production system.

To test the test environment, follow these steps:


1. Return the system to a normal operating environment.
2. Install and configure the Service Manager client for the target version (see

  instructions in Service Manager Installation).
3. Use the new Service Manager client to log on.
4. Review the new features.
5. Use the new Service Manager client to thoroughly test the upgraded system.

  Test all features that your users will access. Pay particular attention to areas that
  were modified on your system.


1.3.7. Upgrade tasks on the production
environment

Step 1: Apply the custom upgrade to the production
environment

After you test the custom upgrade on the test system, you need to apply the newly-
created custom upgrade to your production system. This process is identical to the
one you followed when applying your upgrade to your test system.

            Note

           Do not apply an upgrade to your production system if it has not been
           thoroughly tested. If issues were found in the custom upgrade, we
           recommend that you fix the issues in the development system and re-
           create the customer upgrade.

To apply the custom upgrade to the production system, follow these steps:

   1. Make sure the production system is not available to users while you are applying
     the custom upgrade.

        1. Have all users sign out of the server.
        2. Prevent users from signing into your Service Manager server by running

           the sm -quiesce:1 quiesce command from the operating system’s
           command prompt.
   2. Ensure the upgrade files you created are accessible to the production system
     (the files are located on the same server).
   3. If you transfer the files to your production system by FTP, set FTP to binary
     mode.
   4. Complete all the preparation tasks in Upgrade tasks on the development
     environment.

   5. Apply the customer upgrade to the production system.

                   Note

                If you experience problems, such as a power failure or a network
                connection error while upgrading the system, you need to restore
                the database before attempting to run the upgrade again.


   6. Sign out from your Service Manager server, and then sign in again.
   7. Allow users to sign in to the server by running the sm -quiesce:0 quiesce

     command from the operating system’s command prompt.

Step 2: Perform additional manual tasks

This section lists changes that can't be automated by the Upgrade Utility and changes
that are required only for certain customers. Make these changes before testing and
backing up your system. For detailed instructions, refer to Step 10: Perform additional
manual tasks.

Step 3: Migrate Process Designer data

See Step11: Migrate Process Designer data for more information.

Step 4: Test the production environment

Test the upgraded environment and verify that it functions properly. If there are
problems that you can't resolve, contact Software Support.


1.3.8. Appendix A: Additional manual
migration tasks on Service Manager
Hybrid

After you have run the SM 9.80 Applications Upgrade Utility to migrate your system to
Service Manager Hybrid, you must complete a number of manual configuration tasks.
Some tasks are optional, depending on how you want to configure your Service
Manager Hybrid system.
Mandatory manual migration tasks
Optional manual migration tasks


1.3.8.1. Mandatory manual migration tasks

Note: Some manual migration tasks are only mandatory under certain conditions. See
each task for further information.

Review the migrated validity records

After you migrate to Service Manager Hybrid, validity records are validated against
the Process Designer category tables instead of the Classic category tables.
Therefore, a manual review of the validity records is required.

A Process Designer migration report that resembles the following is included in the
pdmigration.log file:

The following validity records are updated to perform validation against Process
Designer-based category tables (such as category, subcategory, and producttype)
instead of legacy category tables. Backups of the original validity records (identified
by the suffix "_disabled") have been created. Unique ID:BP;Field
Name:category;Sequence:1 Unique ID:BP;Field Name:category;Sequence:3 Unique
ID:BP;Field Name:incident.category;Sequence:3 Unique ID:BP;Field
Name:product.type;Sequence:1 Unique ID:BP;Field Name:product.type;Sequence:2
Unique ID:BP;Field Name:product.type;Sequence:3 Unique ID:BP;Field
Name:product.type;Sequence:5 Unique ID:BP;Field Name:product.type;Sequence:7
Unique ID:BP;Field Name:product.type;Sequence:10 Unique ID:BP;Field
Name:product.type;Sequence:13 Unique ID:BP;Field Name:subcategory;Sequence:1
Unique ID:BP;Field Name:subcategory;Sequence:2 Unique ID:BP;Field
Name:subcategory;Sequence:3 Unique ID:BP;Field Name:subcategory;Sequence:5
Unique ID:BP;Field Name:subcategory;Sequence:11 Unique ID:BP;Field
Name:subcategory;Sequence:12

The number of updated validity records depends on your system configuration. If you
have not customized any validity records, you can ignore this step.

            Note

           If you have added dbdict fields to the category tables and if you use the
           validity table to validate against these fields, you must manually change
           the validation logic for these fields.

Review the category-based alerts migration

Stage 1, 2, and 3 alerts and deadline alerts


The Applications Upgrade Utility migrates the Classic Stage 1, Stage 2, Stage 3, and
Deadline alerts and Deadline Alert Group configurations from Classic categories to
the workflow phases of the automatically-generated Incident workflow.

The migrated alerts are named according to their source. For example, "Incident Alert
Stage 1 for complaint" indicates that the alert is converted from stage 1 configuration
of the complaint category. The following types of alert are created:

     Incident alert stage 1 for <category name>. This alert updates the incident alert
     status to "alert stage 1" if the category has a stage 1 interval or expression
     specified.
     Incident alert stage 2 for <category name>. This alert updates the incident alert
     status to "alert stage 2."
     Incident alert stage 3 for <category name>. This alert updates incident alert
     status to "alert stage 3."
     Incident Deadline for <category name>. This alert updates the incident alert
     status to "DEADLINE ALERT."

The migrated alerts are located in the alerts tab of each workflow phase.

Gap and limitations

The migrated alerts implement the main functionality of the Classic alerts; however,
there are some gaps and limitations.

     In Classic category-based alert expressions, "$file" represents the incident. The
     Applications Upgrade Utility automatically modifies "$file" to "$L.file" for
     compatibility with the migrated alerts. If you use other variables in your Classic
     system, you must manually modify the expression in the migrated alerts.

     The timing for the generation of stage 2 and 3 alerts is different. In the Classic
     Incident module, the schedule for stage 2 is generated after the schedule for
     stage 1 is executed and the incident alert status is updated to stage 1. Likewise,
     the schedule for stage 3 is generated after the schedule for stage 2 is executed
     and the incident alert status is updated to stage 2. In Hybrid mode, however, all
     schedule records for stage 1, stage 2, stage 3, and deadline alerts are generated
     or re-generated at the same time, when the incident record is updated.

     Therefore, if you are using an expression that uses the content of the current
     record ($file) as either the condition or the calculation for the alert time in stage
     2, stage 3, or deadline alerts, issues may occur because the content of the
     current record can differ when the schedule is generated.


     The migrated alerts are moved to the alerts list of the "In Progress" phase of the
     migrated Incident workflow. If you add new phases, you need to also add these
     alerts to new phases so that the alerts can work for incident in the new phases.

     The alert reset and recalculation conditions in objects are changed in Hybrid
     mode. Therefore your original alerts may not work. For example, the out-of-box
     alert reset condition in the Classic probsummary object is category in
     $L.file="incident" and not (null(1 in external.process.reference in $L.file)) . If you
     use this condition, alerts only work for incidents that are assigned to the incident
     category. In the migrated probsummary object, the condition is
      evaluate(nullsub(parse(str(alertsReset in $L.wfPhase), 2), false)) or not
     (same(current.phase in $L.file, current.phase in $L.file.save)) , and the alert
     reset condition of the "In Progress" phase is set to "true." Therefore, all alerts
     configured in the phase will work for all incidents rather than only for incidents
     that are assigned to the incident category.

     In this case, you can modify the schedule condition and the alert condition in the
     existing alert definition of the Incident Management module by appending the
     original reset condition that's configured in the Classic object.

Reassignment threshold

The reassignment interval and expression and the reassignment count threshold in
the Classic categories aren't migrated automatically.

If you still need reassignment threshold functionality, you can add the relevant fields
to the new Process Designer-based category file and form, and then copy the
configuration to the new Process Designer categories. The following table lists the
fields that you will need to add.

Field name in dbdict                    Data type   Label in
count                                   number      form/description
reassign                                date/time
reass.expression                        expression  Reassign Count
                                                    Threshold

                                                    Reassignment Interval

                                                    Reassignment
                                                    Expression

Review Change Management processes


Note

The following step applies only to customers who upgrade to Service
Manager Hybrid from a system that doesn't have PDCP3 installed.

Renamed processes

The following two Classic processes in DocEngine are renamed by the Applications
Upgrade Utility. The old Classic names are now used for Codeless processes.

Process name in Classic mode            Process name in Hybrid mode
cm.open                                 cm.open.classic
cm.open.save                            cm.open.save.classic

Therefore, if you have made any customizations to the processes, a conflict with the
new name will be reported in the upgrade results (for example, if you customized
"cm.open", this process will be renamed to "cm.open.classic" and will conflict with
the out-of-box "cm.open.classic".) Additionally, if you have made any customizations
that call the Classic processes, you must update these to call the new process names.

Review "Close Phase"

In the migrated Change Management workflow, the "Close Phase" functionality is
moved to transitions between phases. In Classic versions of Service Manager, the
"close" display option closes intermediate phases and closes the change or change
task in the last phase. In the migrated Change Management workflow, the "close"
display option closes only changes or change tasks in the last phase in the workflow.

The following condition is added to the original condition of the
"cm.view.display_close" display option:

($G.pd.change.enabled=false or index(current.phase in $L.file, phases in
$L.category)=lng(denull(phases in $L.category)) or category in $L.file="Unplanned
Change" and current.phase in $L.file="Discovery Assessment") and

If you have tailored this display option, or if you have configured other display options
to perform the "close" action, you must make equivalent modifications to ensure that
the close action only works for last phase.

In Hybrid versions of Service Manager, display options aren't called during the
"close" phase. Therefore, the "cm.view.display_close" display option code is migrated


to the "cm.save.wrapper" process, as illustrated by the following image. If you have
tailored this display option, you must make equivalent changes to the process.

In out-of-box Hybrid versions of Service Manager, the transition between phases is
named "Close Phase". However, you can modify the label to suit your needs by using
the localization functionality in the Workflow Editor.

Modify $L.env to $G
.cm3r.environment/$G.cm3t.environment

In the Classic Change module, $L.env is a "cm3profile" record, whereas in Hybrid
Change it is a "tableAccess" record. Therefore, references to $L.env are updated to
refer to $G.cm3r.environment/$G.cm3t.environment, in case a "cm3profile" record is
required (the $G.cm3r.environment/$G.cm3t.environment global environment variable
contains the same content as the Classic version of the $L.env record).

In out-of-box Hybrid versions of Service Manager, all the related display screens,
display options, and processes in the Change Management module are updated. For
example, in "cm.view.display_reopen", evaluate(reopen in $L.env) is updated to
(filename($L.file)="cm3r" and evaluate(reopen in $G.cm3r.environment) or
filename($L.file)="cm3t" and evaluate(reopen in $G.cm3t.environment)) .

However, you must make equivalent updates for any tailoring you have made that
uses $L.env as a "cm3rprofile" record.

Revert to status-based SLM for Change Tasks

            Note

           The following step applies only to customers who upgrade to Service
           Manager Hybrid from a system that doesn't have PDCP3 installed.


Service Level Management (SLM) for Change Tasks in Codeless versions of Service
Manager is based on phases, whereas in Classic versions it is based on statuses.
Therefore, you must revert to status-based SLM for Change Tasks in order for your
existing SLAs to work with the migrated workflows.

To do this, follow these steps:

   1. In the System Navigator, click Service Level Management > Administration >
     Configure Application.

   2. In the Table Name drop-down list, select cm3t.
   3. In the Process Target Information section, click to clear the Use Phases option,

     and then configure the Process Target State Progression and Standard Alerts
     fields as required.

Review the "form edit" condition in workflow
phases

The "form edit" condition in Process Designer-based workflows determines whether
a form is editable when a user views a record. In Service Manager Classic, this
control condition may be located different places. When the Applications Upgrade


Utility creates the migrated workflows for Hybrid mode, the condition settings are
migrated from the default location of the condition in Service Manager Classic:

     Service Desk: The condition is copied from the state input condition
     Change: The condition is copied from the legacy change phase

If you have configured the condition in any other location, it will not be automatically
migrated. In this situation, you must manually combine the Classic condition settings
into the "form edit" condition.

            Note

           Whilst we recommend that you use the "form edit" condition in workflow
           phases in Service Manager Hybrid and Codeless, the "IO control"
           condition for the display screen still works. If you set both conditions, the
           form is editable only when both condition are met.

Merge the status lists

The Applications Upgrade Utility implements the Process Designer search form and
the Process Designer status list. Therefore, you must merge the Classic status list into
the Process Designer-based status list.

The following table describes the table in each module that you must update, along
with information about the Globallist, the Globalvariables, and where the data comes
from.

We recommend that you modify the data in the ModuleStatus database according to
your needs. For example, you must update the ModuleStatus list for the Incident
module to add or remove statuses according to your requirements.


Module        Global list name          Process Designer Details
Incident                                statuses global
Service Desk  Incident Local            list variable
Problem       Statuses
Problem                                 $G.imStatuses    Retrieve from file
              Interaction Local                          ModuleStatus
              Statuses                                   with Limiting SQL
                                                         module="probsu
              Problem Local                              mmary"
              Statuses
                                        $G.sdStatuses    Retrieve from file
              Problem Task                               ModuleStatus
              Local Statuses                             with Limiting SQL
                                                         module="incident
                                                         s"

                                        $G.pbmStatuses   Retrieve from file
                                                         ModuleStatus
                                                         with Limiting SQL
                                                         module="
                                                         rootcause"

                                        $G.pbmTaskStatu  Retrieve from file
                                        ses              ModuleStatus
                                                         with Limiting SQL
                                                         module="
                                                         rootcausetask"

Note

Both the Process Designer-based and Classic Change modules use the
same status list.

Update the eventin service

If you use the eventin service to create Incidents, and if the RAD applications of your
Event Register for creating the Incidents is set to "axces.apm," you must check
whether the "add" action in the document engine's state records action blocks
externally-created Incidents.


To do this, first identify which process maps to the "add" action in the Classic Open
State. The following illustration uses the im.first process as an example from an out-
of-box system.

In out-of-box systems earlier than Service Manager 9.41, only the "problem" and
"EXTERNAL" operators have permission to add Incident records from the backend.


Make sure that the User IDs of your eventin services are configured as demonstrated
in the following image.

Alternatively, make sure the User IDs of your eventin services aren't blocked. To do
this, you can change your code to allow all backend operations, as illustrated by the
following image.


If you use the following applications in your event register, the relevant eventin
services are now allowed to trigger the Process Designer rule sets.

RAD applications                        File                                 Service Manager 9.81
axces.apm                               probsummary
                                                     Out-of-box event
axces.apm.epmosmu                       probsummary  registers

axces.sm                                incidents    pmu: problem update
                                                     pmr: problem reopen
axces.cm3                               cm3r         pmo: problem open
                                                     pmm: problem mibile
                                        cm3t         checkout/in
                                                     pmc: problem close
                                                     ...
                                                     (total 19 eventregisters)

                                                     epmosmu: e problem
                                                     open smu

                                                     esmin: e service
                                                     management
                                                     smin: service
                                                     management

                                                     cm3rin
                                                     cm3tin
                                                     ...
                                                     (total 14 eventregisters)


            Note

                The Change module eventin services (such as eventregister cm3rin
                and cm3tin) can already trigger Process Designer rule sets.
                If you use the axces.database RAD applications (the behavior of
                which is not changed by the Process Designer migration) as the
                eventregister application, the eventin services will not trigger the
                Process Designer rule sets.

Replace the environmental variables

In Service Manager Classic, the $L.env variable stores the profile record. However,
in Service Manager Codeless, the $L.env variable stores the tableAccess record.
Therefore, all code in the Change Management module that uses the $L.env variable
(mostly, this relates to Display Options) must be updated to use the
$G.cm3r.environment or $G.cm3t.environment variables.

For example, the display condition of the cm.view.display_approve display option
must be updated as follows:

Original:

evaluate(approvals in $L.env)

After update:

evaluate(approvals in $G.cm3r.environment) or evaluate(approvals in
$G.cm3t.environment)
````
