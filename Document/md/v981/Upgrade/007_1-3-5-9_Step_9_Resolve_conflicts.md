---
source: Document/pdf/v981/Upgrade.pdf
version: 9.81
sections: 1.3.5.9 .. 1.3.5.14
printed_pages: 140-171
---

# 1.3.5.9 Step 9: Resolve conflicts

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.3.5.9. Step 9: Resolve conflicts

In this step, you are going to resolve the conflicts between your tailored objects and
the new objects provided in the upgrade package.

Standard conflict resolution process

The standard process of resolving conflicts are listed as follows:

   1. To view the conflicts, click System Administration > Ongoing Maintenance >
     Upgrade Utility > View/Merge Results.

   2. (Optional) Select View Upgrade Results and Merge Conflicts, and then click
     Next.

                   Note

                This screen appears only after Process Designer Hybrid migration.

   3. Search for records with a status of "Renamed."
   4. For each renamed object, you can choose one of the following options.

           Option 1: Use your customized object instead of the new object.
           In this case, delete the new object that's prefixed with NEW980 and the
           copied object that's prefixed with PRE<version_number>.
           Option 2: Use the new object instead of your customized object.
           In this case, delete your customized object and the copied object that's
           prefixed with PRE<version_number> and then rename the new object by
           removing the NEW980 prefix, or you can select Choose Upgrade to
           replace the object with the new object that's prefixed with NEW980.
           The Mass Choose Upgrade feature can help you replace multiple
           customized objects with new objects that are prefixed with NEW980. For
           more information, see Using the Mass Choose Upgrade feature below.
           Option 3: Merge the changes shipped with the new object into your
           customized object.
           In this case, find out what changes the new object includes, manually apply
           those changes to your customized object, and then delete the new object


           that's prefixed with NEW980 and the copied object that's prefixed with
           PRE<version_number>.

                   Note

                The Merge tool, Auto-Merge and Revert options, and third-party
                three-way compare and merge tools can assist you in comparing the
                objects and merging the code during the out-of-box upgrade. See
                Using the Merge tool and Using the Auto Merge and Revert options
                below for more information.

   5. After resolving each conflict, you must mark the object as "Reconciled." Marking
     an object as reconciled will remove it from the current conflict list and provide
     the version with which the object was last reconciled.

                   Note

                The Mark as Reconciled feature can assist you to mark the object as
                Reconciled. For more information, see Using the Mass Mark as
                Reconciled feature below.

For more specific guidelines and examples for conflict resolution, see the Conflict
Resolution for Upgrade to Service Manager (SM) 9.3x white paper.

Display components

The Upgrade Results list also includes conflicts in display components. You can follow
the standard conflict resolution process to resolve these conflicts. However, you must
pay special attention to following types of display components:

     displayscreen records
     displayoption records
     displayevent records

Display screen records

Display screens are individual records identified by a unique screen ID. The
displayscreen records define the attributes of a screen and provide access to the
individual records for options and events. A display screen is not the same as a form.


            Caution

           There are triggers attached to the displayscreen file. Changes to the
           records in this file affect their associated display options and events.

If any displayscreen objects appear in your upgrade results list, perform conflict
resolution on those records by following the standard conflict resolution process.

Display options and display events

The Upgrade Utility upgrades the display components in the same manner as all other
components. The displayoption table and the displayevent table have a unique
identifier, stored in the ID field. The upgrade process assigns an ID to every display
option following the pattern: <screen id>_<action>_<number>, where the screen ID
and action are from the display option (or event), and the number is an optional field
added when multiple options have the same screen ID and action.

If options that have been added to your system have the same action as others in the
same display screen, the upgrade process assigns a <number> in the order of the
options' GUI option number.

If an added option was not the last option in terms of GUI option number, the upgrade
process doesn't add the additional numbers in the ID field in the same order as they
would have for an out-of-box system. The upgrade process renames the added
option and any option after it (in GUI option order), it doesn't upgrade them
automatically.

To ensure that this type of renaming doesn't happen in future upgrades, when
performing conflict resolution on these options, use the ID of the renamed option,
NEW980<screen id>_<action>_<number> and manually change the identifier of the
added options. Rename all other options to match the ID of the renamed ones.

When renaming an option, use an identifier to specify that this is a customized option,
added for your installation. For example, an ID might look like:
“apm.edit.problem_don'thing_ACME1”.

This table gives an example of part of the display screen conflict resolution for
apm.edit.problem.


           Example conflict resolution for the apm.edit.problem display option

Screen ID  GUI Action                   Upgrade Action
300
           do nothing                   update          Name:
400                                                     apm.edit.problem
                                                        _do_nothing_1

                                                        Result: This item
                                                        was updated
                                                        correctly.

                                                        User Action: No
                                                        action necessary.

           do nothing                   update          Name:
                                                        apm.edit.problem
                                                        _do_nothing_2

                                                        Result: This item
                                                        was updated
                                                        correctly.

                                                        User Action: No
                                                        action necessary.


Screen ID          GUI Action           Upgrade Action  Name:
                   do nothing           rename          apm.edit.problem
450                                                     _do_nothing_3
This is an option
you added.                                              Result: This item
                                                        was renamed. It is
                                                        your customized
                                                        option.

                                                        User Action:
                                                        Rename this
                                                        object to give it a
                                                        unique new
                                                        name, such as:
                                                        apm.edit.problem
                                                        _do_nothing_ACM
                                                        E1

                                                        Name:
                                                        NEW980apm.edit
                                                        .problem_do_noth
                                                        ing_3

                                                        Result: This is the
                                                        new SM 9.80
                                                        option.

                                                        User Action:
                                                        Perform conflict
                                                        resolution.

                                                        To perform
                                                        conflict
                                                        resolution, open
                                                        apm.edit.problem
                                                        and look at the
                                                        options. Compare
                                                        this option with
                                                        apm.edit.problem
                                                        _do_nothing_3


Screen ID  GUI Action                   Upgrade Action
500        do nothing
                                                        and
                                                        NEW980apm.edit
                                                        .problem_do_noth
                                                        ing_3

                                        The upgrade     Result: This
                                        ignores this    option doesn't
                                        option.         appear in the
                                                        reports.

                                                        User Action:
                                                        Perform conflict
                                                        resolution.

                                                        To perform
                                                        conflict
                                                        resolution, open
                                                        apm.edit.problem
                                                        and look at the
                                                        options. Compare
                                                        this option with
                                                        apm.edit.problem
                                                        _do_nothing_3
                                                        and
                                                        NEW980apm.edit
                                                        .problem_do_noth
                                                        ing_3

Using the Merge tool

For each object marked as "Renamed" in the Upgrade Results list, the Upgrade Utility
generates XML objects for the three versions of the object: base, customer, and
upgrade.


Version                                 Location              Description
base
                                        Upgrade\3waymerge\wo  An XML representation
customer                                rk\base               of every object that has
                                                              been signatured in the
upgrade                                                       pre-upgrade out-of-box
                                                              version.

                                        Upgrade\3waymerge\wo  An XML representation
                                        rk\customer           of all objects that were
                                                              tailored in the customer
                                                              version and resulted in a
                                                              conflict during the
                                                              upgrade.

                                        Upgrade\3waymerge\wo  An XML representation
                                        rk\upgrade            of the object provided by
                                                              the upgrade package of
                                                              all objects resulted in a
                                                              conflict.

Each of the three folders described above contains a sub-folder for each signatured
table. You can find the XML representations of the objects in the table within these
sub-folders.

The built-in, Two-Way/Three-Way Merge tool allows you to examine the upgrade and
customer versions of a record in a side-by-side view as well as the base, upgrade,
and customer versions of a record in a three-way view. This will help you to determine
which changes to include in the final record.

This tool assists the conflict resolution process in these two ways:

     It allows you to identify where changes are located before you can visually
     compare the objects and to make changes manually, such as in format records.
     It allows you to identify and merge changes directly between objects, such as
     ScriptLibrary records.

To use the Merge tool, follow these steps:

   1. From the System Navigator, click System Administration > Ongoing
     Maintenance > Upgrade Utility > View/Merge Results.


2. In the Result drop-down list, select Renamed.

               Note

             The Two-way/Three-way Merge tool is also available for "Previous
             Reconciled", "Kept Customer Non-OOB", "Auto Merged" and
             "Replaced" records.

3. Click Search.
4. A list is returned that displays all the result records of the “Renamed” type.

  Select a record that you want to examine, and then click Merge on the toolbar.

5. The current default merge mode is Three-Way Merge mode. The merge option is
  unavailable for format records. Instead, you can click Compare option from the
  More Actions menu to start the merge tool in read-only mode. You can use this
  mode to identify the differences in the side-by-side view or three-way view and
  then merge records manually in Forms Designer.

1. In Three-Way Merge mode, click the Show Ancestor Pane button to show
  the base record reference. Click the button again to hide the base record
  reference.


2. In Three-Way Merge mode, if the records of base, upgrade, and customer
  versions are all different, the background color is red. If you put the cursor
  into the records with the red background and then click the Copy Current
  Change from Left to Right button, the selected records from the left pane
  will be appended to selected records in the right pane.

3. In Three-Way Merge mode, if the records of the customer version are
  identical to the base version, but different from the upgrade version, the
  background color is blue. If you put the cursor into the records with the
  blue background, and then click the Copy Current Change from Left to
  Right button the selected records from the right pane will be replaced by
  the selected records from the left pane.


     4. In Three-Way Merge mode, if the records on the left contain red
        background records, and you then click the Copy All from Left to Right
        button, the records in the right pane with blue background will be replaced
        with selected records from the left pane.

                      Note

                   The right records with red background will not be changed. To
                   do this, you will need to switch to Two-Way Merge mode to use
                   Copy All from Left to Right feature.

6. To enter Two-Way Merge mode, click the Two-Way Compare (Ignore Ancestor)
  button. In this mode, the Show Ancestor Pane button is disabled.
  When you do this, the button label changes to Three-Way Compare. Click this
  again to revert to Three-Way Compare mode.

     1. In Two-Way-Merge mode, if one record differs upgrade and customer
        versions, you can click Copy Current Change from Left to Right button to
        replace a selected record from the left pane to the right pane.

     2. In Two-Way-Merge mode, click Copy All from Left to Right button to
        replace all records in the right pane with the records from the left pane.


Note

There is a Field-Level Merge mode for some simple structure records.
This field compare mode displays either Two-Way-Merge or Three-Way-
Merge. You can select the value you want to keep. Refer to the following
screenshots:

The field compare mode displays Two-Way-Merge by default if there is no
related out-of-box xml file in the <Upgrade Utility root
folder>/3waymerge/oob/<base version>/<dbdict name> folder.
Otherwise, the field compare mode displays Three-Way-Merge.

           To switch between the field merge mode and the XML merge mode, click
           XML Merge.

Using a third party tool to visually compare objects

You may also visually compare the three versions of each object using a three-way
compare and merge tool outside Service Manager, and then merge them manually in
Service Manager. For example, you can use a tool, such as KDiff3 for Windows, to
compare and merge objects.

To download and learn about KDiff3, visit the KDiff3 Web site.

A brief example of using KDiff3 to compare the three versions of an object is provided
in the following steps:

   1. Install KDiff3 on the Service Manager server host.
   2. Open KDiff3. For more information, refer to the KDiff3 documentation.
   3. For the A(Base) parameter, specify the path to the

     Upgrade\3waymerge\work\base folder.


   4. For the B parameter, specify the path to the Upgrade\3waymerge\work\customer
     folder.

   5. For the C parameter, specify the path to the Upgrade\3waymerge\work\upgrade
     folder.

   6. Click OK.
   7. Navigate the folder structure and double-click the file that's named after the

     object you want to merge.
   8. Compare the three versions of the object in the 3-way compare view.
   9. Manually apply the changes you have identified to the object in Service

     Manager.

Using the Auto Merge and Revert options

During upgrade processing, the Upgrade Utility attempts to merge your objects with
the corresponding objects provided with the upgrade. You can search for records
with a result type of "Auto Merged" in the Upgrade Results list to review these
objects.

            Note

           An auto-merged object needs to be thoroughly tested for syntax and
           functional integrity.

If you encounter issues with objects that have been auto-merged or reconciled, you
can click the Revert button on the toolbar to restore "Auto Merged" or "Renamed"
objects, or "Replaced" Applications Cluster and ScriptLibrary objects to their previous
states. Use Revert to restore one object and Mass Revert to restore multiple objects.
After restoring an object, you can also re-attempt to auto-merge that object using the
Auto Merge or Mass Auto Merge option from the More Actions menu.

Using the Mass Choose Upgrade feature

During the Upgrade process, you can use the Mass Choose Upgrade feature to
overwrite your systems old objects with the newer versions from the upgrade utility.
You can use this feature to quickly update the objects of the following statuses, which
are generated during the upgrade:

     Auto Merged
     Renamed
     Previously Reconciled
     Reconciled
     Kept Customer Non-OOB


You can use this feature to quickly update Applications Cluster objects of the
following statuses:

     Kept Customer
     Kept Customer Non-OOB
     Renamed
     Previously Reconciled

To use the Mass Choose Upgrade feature, follow these steps:

   1. From the System Navigator, click System Administration > Ongoing
     Maintenance > Upgrade Utility > View/Merge Results.

   2. (Optional) Select View Upgrade Results and Merge Conflicts, and then click
     Next.

                   Note

                This screen appears only after Process Designer migration.

   3. In the Result drop-down list, filter the set of objects (Auto Merged; Renamed;
     Previously Reconciled; Reconciled) on which you wish to use the Mass Choose
     Upgrade feature and then click Search.

   4. If more than two objects exist in the resulting search, click the Mass Choose
     Upgrade button from More Actions menu in the returned list and then click Yes.

After you click Yes, the objects that you selected will be updated with the contents of
the newer versions from the upgrade utility.

Using the Mark as Reconciled feature

During the Upgrade process, you must mark conflicting objects as “Reconciled” after
resolving each conflict. To help with this process, you can use the Mass Mark as
Reconciled feature to mark multiple objects as “Reconciled.” You can use this feature
on objects with the following statuses:

     Auto Merged
     Renamed
     Previously Reconciled

To use the Mass Mark as Reconciled feature, follow these steps:

   1. From the System Navigator, click System Administration > Ongoing
     Maintenance > Upgrade Utility > View/Merge Results.


   2. If you are upgrading from SM9.3x with PDCP3 installed or non-PD environment
     or SM9.4x Classic, you can see a wizard page. Select View Upgrade Results
     and Merge Conflicts, and then click Next.

                   Note

                This screen appears only after Process Designer migration.

   3. In the Result drop-down list, filter the set of objects (Auto Merged; Renamed;
     Previously Reconciled) on which you wish to use the Mass Mark as Reconciled
     feature and then click Search.

   4. If more than two objects exist in the resulting search, click the Mass Mark as
     Reconciled button from the More Actions menu and then click Yes. After you
     click Yes, all objects that you selected will be marked as “Reconciled” and
     removed from current conflict list.

                   Note

                If only one object exits in the resulting search, or if you want to
                resolve conflicts for the selected objects individually, use the Mark
                as Reconciled button on the toolbar instead.

Resolve Process Designer related data

To resolve the Process Designer related data, follow these steps:

   1. From the System Navigator, click System Administration > Ongoing
     Maintenance > Upgrade Utility > View/Merge Results.

   2. If you are upgrading from SM9.3x with PDCP3 installed or non-PD environment
     or SM9.4x Classic, you can see a wizard page. Select View Upgrade Results
     and Merge Conflicts, and then click Next.

                   Note

                This screen appears only after Process Designer Hybrid migration.

   3. Click the Expert Search button from the More Actions menu, type
     version.reconciled#"PD Enable" in the Query field, and then click Search.


4. In the search result, resolve the data by following the actions described in the
  table below.

Reconciled Version                      Result   Action
PD Enable: Updated                      Renamed
                                                 Merge the newer
PD Enable: Replaced Renamed                      object from the
                                                 Upgrade Utility to the
PD Enable: Need to be Any                        object.
removed
                                                 Overwrite your
                                                 systems old object with
                                                 the newer version from
                                                 the Upgrade Utility.

                                                 Remove the objects
                                                 manually.

Sample user scenarios

You need to manually resolve the conflicts when your custom functions are conflicted
in the ScriptLibrary. The following five scenarios shed some light on how to solve your
conflict when performing an upgrade.

   1. An out-of-the-box function that exists in the old version conflicts with the same
     function in the new version.
     In this scenario, choose the function in the new version to resolve the conflict.

   2. A customized out-of-the-box function that exists in the old version conflicts with
     the same function in the new version.
     In this scenario, merge these two functions to resolve the conflict.

   3. A function doesn’t exist in the old version but is available out-of-the-box in the
     new version.
     In this scenario, choose the function in the new version to resolve the conflict.

   4. You have added a function that is unavailable in the out-of-the-box functions of
     the old version. However, this function is available out-of-the-box in the new
     version.
     In this scenario, compare the function between the two versions to resolve the
     conflict.
        1. If you use these functions to achieve the same result, you can merge them
           from a business perspective. We recommend using the function codes in
           the new version since it has a higher priority.


     2. If you use these functions to achieve different results, choose the function
        from the new version to resolve the conflict. Meanwhile, rename the old
        function and then update the corresponding and related functions so that
        the old function still works.

5. An out-of-the-box function exists in the old version but no longer exists in the
  new version.
  In this scenario, we recommend keeping this old function. Of course, you may
  remove it if it's no longer used.


1.3.5.10. Step 10: Perform additional
manual tasks

This section lists changes that can't be automated by the Upgrade Utility and changes
that are required only for certain customers. Make these changes before testing and
backing up your system.

Adopt the logical name solution

In previous versions of Service Manager, the logical.name field in the device table
was used as both the unique identifier and display name for a CI, causing loss of CI
data integrity across Service Manager modules and complexity of CI reconciliation
between integration products (for example, Service Manager doesn't allow duplicate
CI names while UCMDB does).

Service Manager 9.41 and later versions solves the problems described above with
the logical name solution. Once you have upgraded to Service Manager 9.80 from an
applications version prior to 9.41, you need to perform additional manual tasks to
adopt the solution in your production environment. For a summary of this solution and
details of these manual post-upgrade tasks, see the Service Manager Logical Name
Solution white paper.

Adopt Smart Search

Service Manager 9.41 introduces Smart Search which enables you to search among a
variety of content, including Service Manager records, SharePoint documents, static
web pages, and KM documents. You can integrate multiple knowledge libraries by
configuring different search connectors, so that users can search among the
information that they can access.

Once you have upgraded to Service Manager 9.80 from an applications version prior
to 9.41, follow these steps to make sure the login.DEFAULT format control record has
the expected code for the Smart Search feature:

   1. Sign in to your Service Manager server as a System Administrator.

   2. Click Tailoring > Format Control. Service Manager opens a blank Format
     Control Maintenance form.

   3. Type login.DEFAULT in the Name field, and then click Search.
   4. Click JavaScript.

   5. Check whether the following codes exist:


          var idolserver = new SCFile('idolserverinfo');
          var rc = idolserver.doSelect('true');
          if (rc === RC_SUCCESS) {

                                       vars['$lo.idol.enabled'] =
          idolserver['enable'];

                                       vars['$lo.idol.img.enabled'] =
          idolserver['image.enable'];

                                       if (vars['$lo.idol.enabled']) {
                                                     vars['$G.kmsearchengine'] = 'IDOL';

                                         }
          }

     If these codes don't exist, you must type true in the Add field and then add these
     codes manually.
   6. Click Save and OK.

Adopt Chat

Perform the manual steps described in the Deploy and configure the chat server task.

Update the support.groups fields in the device
table

Once you have upgraded to Service Manager 9.80, follow these steps to update the
support.groups fields in the device table:

   1. Sign in to your Service Manager server as a System Administrator.
   2. Click Tailoring > Database Dictionary.
   3. Type device in the File Name field, and then click Search.
   4. Click support.groups of the array type.
   5. Update the value in the SQL Table field to a1, and then click OK to save your

     changes.

                   Note

                If a1 is already in use, use other values instead. For example, a2 or
                a3.

   6. Click support.groups of the character type.


7. Update the value in the SQL Table field to a1, update the value in the SQL Type
  field to VARCHAR(60), and then click OK to save your changes. See the
  following screenshot as an example:

                   Note

                      VARCHAR is the SQL type of a SQL server. Use VARCHAR2 for
                      an Oracle server.
                      If a1 is already in use, use other values instead. For example, a2
                      or a3.
                      If the system displays the following error message, update
                      VARCHAR(60) to a bigger size such as VARCHAR(100).
                       Length (61 bytes) of data for field support.groups in
                      SMSQLF3E5E54522D0397D0D08F6074 exceeds max (60
                      bytes), truncated (record.update,start)

   8. Click OK to save your changes and close the device table.

            Caution

           If the device table contains more than 100,000 records, updating the
           support.groups fields may take more than one hour.

Initialize CI descendant relationships

Follow these steps to initialize CI descendant relationships if you have upgraded to
Service Manager 9.80 from an applications version prior to 9.64:

   1. If you are upgrading from version 9.6x, go to the database and run delete from
     CIRELATIONBSGM1 to remove all records from the table.

   2. Create a ScriptLibrary and then add the following codes:
      lib.BSGRelationsCalculation1.run();


   3. Click the Execute button to initialize the data of CI relationship to improve your
     system performance.

            Note

           The reference time to execute the codes is about 2 minutes per 10000 CI
           relationship records in the dbdict cirelationbsg for CI relationships. The
           actual execution time depends on your computer performance and the CI
           relationship complexity.
           It may take a very long time or even up to multiple days in graph
           generating for a huge CI graph (such as more than 100K cirelationship or
           device records). In order to lower the effect on the production system,
           you may consider restoring a backup of the production system as a test
           environment, running the script in the test environment, and then moving
           the cirelationbsg table contents back to the production system.

Update Smart Email Message ID for EWS

            Note

           Skip this task if you are upgrading from SM9.6x.

You need to complete the following steps only when you use Smart Email with the
EWS protocol:

   1. Create a ScriptLibrary and add the following codes:
      lib.SmartEmailUtil.convertSmartEmailEWSStore(true);

   2. Click the Execute button to update the Smart Email Message IDs for the mails
     received within the previous 24 hours.

            Note

           If you want to update the Smart Email Message IDs for all the received
           mails, you can execute the following codes:
           lib.SmartEmailUtil.convertSmartEmailEWSStore();
           However, doing this may take a long time.

Translate customized inbox names


Service Manager upgrade attempts to enable localization for the customized inbox
names. If you have customized inbox names, search the scmessage record for active
languages other than English and then translate the content of Text for the language:
Language Code: <language code>
Class: local:inbox
Message Number: <inbox id>

Synchronize affected CIs in Problem Management

Follow these steps to synchronize affected CIs in Problem Management:

   1. Create a ScriptLibrary and add the following codes:
      lib.problemManagement.synchronizeAllAffectedCiNames();

   2. Click the Execute button to synchronize all the problem records.

            Note

           The actual execution may take some time depending on the amount of the
           Problem records.

Reimplement Feature Tracker

If you have installed the DevOps Support Content Pack to use Feature Tracker, you
need to reimplement Feature Tracker. See Prepare Git for detailed instructions.

Additional manual migration tasks on Service
Manager 9.80 Hybrid

After you have run the Service Manager 9.80 Applications Upgrade Utility to migrate
your system to Service Manager Hybrid, you must complete a number of manual
configuration tasks. Some tasks are optional, depending on how you want to
configure your Service Manager Hybrid system. For detailed instructions, refer to
Appendix A: Additional manual migration tasks on Service Manager 9.80 Hybrid.

            Note

           Perform these manual migration tasks in the development environment
           only.


1.3.5.11. Step 11: Migrate Process Designer
data

Note: Skip this task if you are upgrading from Service Manager 9.52 or later versions.

You can use the data migration tool to migrate data from legacy process records to
new process records within the same Service Manager system. It's not used to
migrate data across different Service Manager systems. You can configure the
migration tool from the GUI, and it requires administrator privileges.

The migration tool allows an operator to configure the field/value mapping between
two files. It also covers customized fields. The out-of-box Process Designer provides
several sample migration scripts that you can choose to use according to your
migration scenario.

            Caution

           During data migration, there are no dependencies between the modules,
           however the scripts for each specific module must be executed in the
           listed order.

Module                                                                                          Service Manager 9.81
PD Framework
                                        Script
Problem
                                           1. Legacy change model taskplanner
Service Level Agreement                      data to new taskplanner
Service Catalog
Configuration Item                         2. Legacy change instance
                                             taskplanner data to new
                                             taskplanner

                                           3. Legacy change/task data to new
                                             taskplanner

                                           1. Legacy problem to new problem
                                           2. Legacy problem task to new

                                             problem task
                                           3. Legacy known error to new

                                             known error
                                           4. Legacy Process Designer known

                                             error to new Process Designer
                                             known error
                                           5. Legacy known error related
                                             record migration
                                           6. Legacy known error attachment to
                                             new known error attachment

                                           1. Legacy SLA to new Agreement

                                           1. Legacy Catalog Items to new
                                             Catalog Items

                                           1. Legacy configuration item to new
                                             configuration item

If further migrations are needed, an administrator can use these samples to define
their own. Considering that some tables typically have a large data volume, the Data
Migration tool supports an SQL batch update mode to ensure good performance.


          Note

          We recommend that you back up the production data before migration.

Run the scripts for specific modules as follows.

                                              PD Framework module

Script    9.3x                          9.3x  9.3x  9.40           9.40      9.50
          non PD                                                   Codeles   Codeles
                                        PD3   PD4   Classic /      s / 9.41  s / 9.50
                                                                   Hybrid /  Hybrid /
                                                    9.41           9.41      9.51
                                                                   Codeles   Codeles
                                                    Classic        s         s / 9.51
                                                                             Hybrid

Legacy                                  √     √
change
model
taskplan
ner data
to new
taskplan
ner

Legacy                                  √     √
change
instance
taskplan
ner data
to new
taskplan
ner

Legacy √                                            √

change/t

ask data

to new

taskplan

ner


                                              Problem module

Script    9.3x                          9.3x  9.3x            9.40       9.40      9.50
                                                                         Codeles   Codeles
          non PD PD3                          PD4             Classic /  s / 9.41  s / 9.50
                                                                         Hybrid /  Hybrid /
                                                              9.41       9.41      9.51
                                                                         Codeles   Codeles
                                                              Classic    s         s / 9.51
                                                                                   Hybrid

Legacy √                                √                     √

problem

to new

problem

Legacy √                                √                     √

problem

task to

new

problem

task

Legacy √                                √                     √

known

error to

new

known

error

Legacy                                        √
PD
known
error to
new PD
known
error


Script 9.3x                             9.3x  9.3x  9.40  9.40  9.50

          non PD PD3                          PD4   Classic / Codeles Codeles

                                                    9.41  s / 9.41 s / 9.50

                                                    Classic Hybrid / Hybrid /

                                                          9.41  9.51

                                                          Codeles Codeles

                                                          s     s / 9.51

                                                                Hybrid

Legacy √                                √           √

known

error

related

record

migratio

n

Legacy √                                √           √

known

error

attachm

ent to

new

known

error

attachm

ent


             Service Level Agreement, Service Catalog, and Configuration Item

Modul  Script 9.3x 9.3x 9.3x 9.40 9.40                                         9.50
e                                                                              Codele
                non PD PD3 PD4 Classi Codele                                   ss /
                                                                               9.50
                                              c / 9.41 ss /                    Hybrid
                                                                               / 9.51
                                              Classi 9.41                      Codele
                                                                               ss /
                                              c  Hybrid                        9.51
                                                                               Hybrid
                                                 / 9.41

                                                 Codele

                                                 ss

Servic Legacy √                         √  √

e Level SLA to

Agree new

ment Agree

       ment

Servic Legacy √                         √  √  √  √

e      Catalo

Catalo g Items

g      to new

       Catalo

       g Items

Config Legacy √                         √  √  √  √                             √

uration config

Item uration

       item to

       new

       config

       uration

       item

How to run a migration script


            Note

           If you are upgrading an existing Service Manager system to Process
           Designer, you need to customize the legacy out-of-box migration script
           samples for your specific environment.

To run a migration script, follow these steps:

   1. Type db in the command line to open Database Manager.
   2. Type migrationSetting in the Table field, and then click Search.
   3. In the Migration Script setting detail form, click Migrate Data to run the migration

     script.
   4. When using the Batch Update mode, the Data Migration pop-up window shows

     the RDBMS SQL Statements that will be run on the database. Check that the SQL
     statements are correct, and change these SQL statements if needed. Click Next,
     and then click Finish to start the migration in Batch Update mode.

                   Note

                If there is no data to migrate, or if the data is already migrated, you
                receive the following notification:
                "No records match the filter condition. At least one matching record
                is required."


1.3.5.12. Step 12: Return the system to
normal operation

After the upgrade, the system may exhibit abnormal behavior until you return it to its
normal operating environment.

            Note

           Remove all files related to upgrade from the system after successful
           completion of the upgrade. For information on removing these files, see
           Step 10: Perform additional manual tasks.

To return to a normal operating environment, follow these steps:

   1. Sign out.
   2. Stop the server.
   3. Remove the comments from the system.start entry from the sm.cfg file.
   4. Restore all the parameters that you updated in sm.ini and sm.cfg to their

     original state.
   5. Add all parameters that are documented as necessary for your upgraded

     system.
   6. Start the Service Manager server.
   7. Sign in.
   8. Wait for the background processes to start up.

            Note

           Service Manager doesn't recompile indexes in your RDBMS. If your
           RDBMS isn't configured to recompile indexes automatically after index
           changes, you must recompile your indexes manually.


1.3.5.13. Step 13: Test the development
environment

After you resolve all conflicts, test the upgraded system and verify that the conflicts
resolutions function properly. If there are problems that you can't resolve, contact
Customer Support.


1.3.5.14. Step 14: Back up the system

Make a checkpoint backup of the data files to enable you to restore from this point, if
necessary. Refer to the documentation for your RDBMS for backup instructions.
````
