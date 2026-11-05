---
source: Document/pdf/v981/Upgrade.pdf
version: 9.81
sections: 1.3.9 .. 1.3.10
printed_pages: 234-272
---

# 1.3.9 Appendix B: Data migration

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.3.9. Appendix B: Data migration

This appendix describes the following topics that are related to the data migration
tool.
Field mapping and value mapping
Batch Update mode
Out-of-box data migration settings


1.3.9.1. Field mapping and value mapping

Field mapping defines the mapping between the fields in the source file and target
file, as shown in the following figure.

            Note

                The Target field can't be empty.
                The Source and Target fields must already exist in the table.
                If there is a structure field mapping and you're not in Batch Update
                mode, both fields must have the exact same structure definition.
                Array of structure and structure fields aren't supported when in
                Batch Update mode.
                The M2 and alias table aren't supported in Batch Update mode.
                You can't use jscallback in Batch Update mode.

Value mapping defines the value mapping for each mapped field.


Note

                For the fields that don't have a value mapping defined, the default is
                direct value copy.
                You can define multiple value mappings for the same field.

The following table describes each column in the Value Mapping Definition tab.

Column                                                                                          Service Manager 9.81
Target value mapping field
                                        Description
                                        The field from target field that needs to
                                        define value mapping.

 Column                                                                                         Service Manager 9.81
 Mapping Type
                                        Description
This PDF was generated on May 23, 2026
                                        The following three types are
                                        supported:

                                           1. fixedValue: target field value =
                                             the fixed value defined in “Target
                                             Value” column. The supported
                                             fixed value are number, string,
                                             datetime, and Boolean. You can't
                                             specify an expression in a fixed
                                             table, nor a fixed value for
                                             structure and array field type.

                                           2. sourceField: target field value =
                                             source field value defined in
                                             “Target Value” column.

                                           3. jsCallback: target field value = a
                                             JavaScript script to dynamically
                                             set the value. Three keywords
                                             ($sourceTable, $targetable,
                                             $value) can be used if the direct
                                             script code is written in the Target
                                             Value column:

                                                   $sourceTable, $targetTable
                                                   reference the field value in
                                                   the source table field and
                                                   the target table field,
                                                   respectively as shown in the
                                                   following example:

                                                         var status =
                                                         $sourceTable[“rcSta
                                                         tus”],$targeTable[“
                                                         rcStatus”] = “open”

                                                   $value is used to specify the
                                                   current target field value as

                                                                                                                        Page 238 of 294
Column                                                                                          Service Manager 9.81

Condition                               Description
Target Value                                       shown in the following
                                                   example:

                                                         $value=vars.$G_user
                                                         _role retrieves the
                                                         value from another
                                                         variable.

                                             jsCallback can also support
                                             directly calling a JavaScript
                                             function defined in Script library,
                                             such as the following:

                                                  lib.UpgradeScript.migrat
                                                  eData($sourceTable,.$tar
                                                  getTable);

                                        If the condition is true, then the value
                                        mapping is applied during the
                                        migration. The condition expression
                                        supports the following:

                                           1. Arithmetic operators: >, <, >=, <=,
                                             =, ~=

                                           2. Logical operators: or, and
                                           3. The “null” keyword can be used

                                             as a null value in the formula.

                                        Depending on the Mapping Type
                                        setting, Target Value can be a fixed
                                        value string, or a source field name or a
                                        JavaScript script.


1.3.9.2. Batch Update mode

When the target file equals the source file, the migration tool executes the update
operation on the same table. In addition, an additional SQL batch update mode is
automatically enabled to allow the migration tool to directly update the underlying
database.

            Note

           You can run the migration in Batch Update mode to get better
           performance when the source and target files are the same. The Batch
           Update mode can't be used when you migrate data between two different
           files, such as from Legacy known error to Problem.

            Note

           Some of the out-of-box migration scripts can't be run in Batch Update
           mode. For more information, see Appendix B: Data migration.

Batch update mode can only be enabled when the target file equals the source file. If
it is enabled, a batch SQL update is generated in a popup wizard instead of using the
Service Manager API to update the data records one by one. After confirmation, the
batch SQL update is sent to the underlying database.

If Batch Update mode is enabled, you should note the following:

     You should update the data records directly via the database without triggering
     Service Manager. Otherwise, updating the data records will trigger additional
     background process.
     The Filter Condition field should follow the RDBMS SQL grammar for your
     database. Otherwise, Filter Condition should follow query statement grammar of
     Service Manager.
     The “Condition” field in the Value Mapping Definition should follow the RDBMS
     SQL grammar for your database. Otherwise, Filter Condition should follow query
     statement grammar of Service Manager.



1.3.9.3. Out-of-box data migration
settings

The Data Migration Tool provides the following out-of-box data migration settings.

Problem data migration

Considering that Problem doesn't need to copy data from two different tables, and
that it typically has a large volume of data, we recommend that you run the migration
by using the batch update mode (especially for migrating a large volume of closed
tickets).

            Note

           After you migrate the Problem data, remove the
           “Problem_Library_disabled_by_PDHD” knowledge base as this legacy
           library is no longer used.

The out-of-box example data migration is based on the following three key fields:

     status
     category
     current.phase

            Note

           You can add additional fields if needed, but don't remove these three
           fields.

Problem                                 rootcause
                                        rootcause
Default settings:                       category="BPPM"
 Source Table
 Target Table
 Filter Condition

Field Mapping:


 Target Field                           Source Field
 category                               category
 current.phase                          current.phase
 rcStatus                               rcStatus
Value Mapping:

Target Value   Mapping Type             Condition                  Service Manager 9.81
Mapping Field  fixedValue
category       fixedValue                                   Target Value
current.phase
               fixedValue               category="BPPM problem
current.phase  fixedValue               "
               fixedValue
current.phase                           (current.phase="    Categorization
current.phase                           Problem
                                        Detection,
                                        Logging and
                                        Categorization"
                                        or

                                        current.phase="P
                                        roblem
                                        Prioritization and
                                        Planning") and
                                        rcStatus~="Close
                                        d"

                                        current.phase="P    Investigation
                                        roblem
                                        Investigation and
                                        Diagnosis" and
                                        rcStatus~="Close
                                        d"

                                        current.phase="P    Resolution
                                        roblem
                                        Resolution" and
                                        rcStatus~="Close
                                        d"

                                        current.phase="P    Review
                                        roblem Closure
                                        and Review" and
                                        rcStatus~="Close
                                        d"

Target Value   Mapping Type             Condition                  Service Manager 9.81
Mapping Field  fixedValue
current.phase  fixedValue                                   Target Value
rcStatus
               fixedValue               rcStatus="Closed Closure
rcStatus       fixedValue               "

rcStatus                                (current.phase="    Categorize
                                        Problem
                                        Detection,
                                        Logging and
                                        Categorization"
                                        or
                                        current.phase="P
                                        roblem
                                        Prioritization and
                                        Planning") and
                                        rcStatus~="Close
                                        d" and
                                        rcStatus~="Defer
                                        red"

                                        current.phase="P    Pending
                                        roblem
                                        Resolution" and
                                        (rcStatus="Pendi
                                        ng Vendor" or
                                        rcStatus="Pendin
                                        g User")

                                        (current.phase="    Work In Progress
                                        Problem
                                        Investigation and
                                        Diagnosis" or
                                        current.phase="P
                                        roblem
                                        Resolution") and
                                        rcStatus~="Close
                                        d" and
                                        rcStatus~="Defer
                                        red"

Target Value       Mapping Type         Condition                Service Manager 9.81
Mapping Field      fixedValue
                                                          Target Value
rcStatus
                                        current.phase~="  Deferred
                                        Problem Closure
                                        and Review" and
                                        rcStatus="Deferr
                                        ed"

rcStatus           fixedValue           current.phase="P  Resolved
                                        roblem Closure
                                        and Review" and
                                        rcStatus~="Close
                                        d"

rcStatus           fixedValue           rcStatus="Closed Closed
                                        "

Problem Task                            rootcausetask
                                        rootcausetask
Default Settings:                       task.category="Default"
 Source Table
 Target Table                           Source Field
 Filter Condition                       task.category
                                        current.phase
Field Mapping:                          rcStatus
 Target Field
 task.category
 current.phase
 rcStatus

Value Mapping:


Target Value   Mapping Type             Condition         Target Value
Mapping Field

task.category  fixedValue               　                 Investigation
current.phase  fixedValue
                                        rcStatus~="Close Active
                                        d"

current.phase  fixedValue               rcStatus="Closed Closure
                                        "

rcStatus       fixedValue               rcStatus="Work    Work In Progress
                                        In Progress"

rcStatus       fixedValue               rcStatus="Pendin  Pending
                                        g Vendor" or
                                        rcStatus="Pendin
                                        g User"

rcStatus       fixedValue               rcStatus="Closed Closed
                                        "

rcStatus       fixedValue               rcStatus~="Work   Assigned
                                        In Progress" and
                                        rcStatus~="Pendi
                                        ng Vendor" and
                                        rcStatus~="Pendi
                                        ng User" and
                                        rcStatus~="Close
                                        d"

Task Planner data migration

In versions of Service Manager earlier than 9.40, Task Planner data is stored in the
changeModel and changePlan tables. However, in Service Manager 9.40, Task
Planner data is stored in the changePlan table only. Therefore, two data migration
settings are provided to migrate Task Planner data from Service Manager 9.40 and
earlier versions.

Migrate legacy change model Task Planner data to new Task
Planner

Default settings:  Mapping type         changeModel             Service Manager 9.81
 Source table      fixedValue           changePlan
 Target Table                           not null(tasks)  Target value
 Query                                  false            changeModel
 Batch Update
                                        Source field
Field mapping:
 Target field                           id
 fileName
 number                                 Condition

Value mapping:
 Target value
 mapping field
 fileName

Post script:


for(var i=0;i<$sourceTable.tasks.length();i++){

$targetTable.tasks[i].taskId=$sourceTable.tasks[i].taskId;

$targetTable.tasks[i].taskCoords=$sourceTable.tasks[i].taskCoord
s;

$targetTable.tasks[i].dependentIds=$sourceTable.tasks[i].depende
ntIds;

$targetTable.tasks[i].dependentCoords=$sourceTable.tasks[i].depe
ndentCoords;

$targetTable.tasks[i].taskCategory=$sourceTable.tasks[i].taskCat
egory;

$targetTable.tasks[i].taskTemplate=$sourceTable.tasks[i].taskTem
plate;

$targetTable.tasks[i].taskDescription=$sourceTable.tasks[i].task
Description;

$targetTable.tasks[i].openInPhase=$sourceTable.tasks[i].openInPh
ase;

$targetTable.tasks[i].closeByPhase=$sourceTable.tasks[i].closeBy
Phase;

$targetTable.tasks[i].activeCond=$sourceTable.tasks[i].activeCon
d;

$targetTable.tasks[i].activeCondXML=$sourceTable.tasks[i].active
CondXML;

$targetTable.tasks[i].activeCondDesc=$sourceTable.tasks[i].activ
eCondDesc;

$targetTable.tasks[i].mandatory=$sourceTable.tasks[i].mandatory;


}
$targetTable.doUpdate();

Migrate legacy change instance Task Planner data to new
Task Planner

Default settings:

Source table                            changePlan
Target Table                            changePlan
Query                                   null(fileName)
Batch Update                            true

Field mapping:

Target field                            Source field
fileName                                fileName

Value mapping:

Target value    Mapping type            Condition       Target value
mapping field   fixedValue                              cm3r

fileName

Migrate legacy change/task data to new Task Planner

In Service Manager Hybrid, task information is stored in the change’s task plan.
Change task information must be migrated to the new Task Planner. To do this, use
the “Legacy change/task data to new taskplanner” data migration setting in the data
migration tool.

Default settings:


Source table                            cm3r
Target Table                            changePlan
Query                                   open=true
Batch Update

Field mapping:

Target field                            Source field
fileName                                header,number
Number

Value mapping:

Target value    Mapping type            Condition      Target value
mapping field

fileName

Known Error data migration

Known Error data migration differs from Interaction, Incident, and Problem because
Known Error data must be copied from the knownerror file to the rootcause file, and
the field mapping is also more extensive than in other modules.

Because it is a data copy, you can't use the batch update mode. However, knownerror
data volume is usually much less than that of Incident or Interaction. Therefore, the
normal copy mode should be sufficient for most environments.

Note

After you migrate the knownerror data, remove the
“KnownError_Library_disabled_by_PDHD” knowledge base as this legacy
library is no longer used.

The Data Migration Tool provides four migration settings, which you should run in
their corresponding scenario as described in the following table.


Scenario                                Migration setting(s)
Migrating from legacy Known Error
                                        Legacy known error to new known
Migrating from legacy Process           error
Designer Known Error
                                        Legacy known error related record
                                        migration
                                        Legacy known error attachment to new
                                        known error attachment

                                        Legacy Process Designer known error
                                        to new Process Designer known error

                                        For more information about how to use
                                        this migration setting, see the Migrating
                                        from legacy Process Designer known
                                        error records section.

Additionally, because knownerror data is copied and the records are re-created in the
rootcause file, you must also update the screlation file to correct the relations of
known errors. To do this, the out-of-box Process Designer provides another migration
script called “Legacy known error related record migration”.

            Note

           Attachments for legacy knownerror records are migrated as attachments
           for the new known error records.

Default Settings:                       knownerror
 Source Table                           rootcause
 Target Table                           true
 Filter Condition

Field Mappings:

 Target Field(Problem)                                                                          Service Manager 9.81
 id
 category                               Source Field(Known Error)
 assignment                             id
 status                                 category
 logical.name                           assignment
 brief.description                      status
 description                            logical.name
 root.cause                             brief.description
 update                                 description
 open                                   root.cause
 open.time                              update
 opened.by                              open
 update.time                            open.time
 updated.by                             opened.by
 close.time                             update.time
 closed.by                              updated.by
 reopen.time                            close.time
 reopened.by                            closed.by
 priority.code                          reopen.time
 ticket.owner                           reopened.by
                                        priority.code
This PDF was generated on May 23, 2026  ticket.owner

                                                                                                                        Page 253 of 294
 Target Field(Problem)                                                                          Service Manager 9.81
 severity
 sysmodtime                             Source Field(Known Error)
 sysmodcount                            severity
 sysmoduser                             sysmodtime
 assignee.name                          sysmodcount
 subcategory                            sysmoduser
 product.type                           assignee.name
 problem.type                           subcategory
 company                                product.type
 dump                                   problem.type
 resolution                             company
 workaround                             dump
 incident.category                      resolution
 current.phase                          workaround
 incident.count                         incident.category
 initial.impact                         current.phase
 future.impact                          incident.count
 impact                                 initial.impact
 users.affected                         future.impact
 problem.start.time                     impact
                                        users.affected
This PDF was generated on May 23, 2026  problem.start.time

                                                                                                                        Page 254 of 294
 Target Field(Problem)                                                                          Service Manager 9.81
 expected.resolution.time
 location.type                          Source Field(Known Error)
 frequency                              expected.resolution.time
 proposed.solution                      location.type
 review.notes                           frequency
 cause.code                             proposed.solution
 affected.ci                            review.notes
 ci.device.name                         cause.code
 ci.device.type                         matching.ci
 ci.assign.group                        matching.device.name
 ci.location                            matching.device.type
 affected.companies                     matching.assign.group
 affected.ci.count                      matching.location
 last.task.no                           affected.companies
 kpf.id                                 matching.ci.count
 kpf.file                               last.task.no
 folder                                 kpf.id
 closure.code                           kpf.file
 estimatedCost                          folder
 estimatedMandays                       closure.code
                                        estimatedCost
This PDF was generated on May 23, 2026  estimatedMandays

                                                                                                                        Page 255 of 294

Target Field(Problem)                   Source Field(Known Error)
rootcauseDate                           knownerrorDate
solutionDate                            solutionDate
affected.item                           affected.item
rcStatus                                rcStatus
interaction.count                       interaction.count
publishWorkaround                       publishWorkaround

Value Mappings:

Target Value     Mapping Type           Condition  Target Value
Mapping Field    fixedValue
category         fixedValue             true       known error
current.phase    fixedValue
                 fixedValue             rcStatus~="Close Logging
current.phase    fixedValue             d"
                 fixedValue
isKnownError                            rcStatus="Closed Closure
rcStatus                                "

rcStatus                                true       true

                                        rcStatus~="Close Open
                                        d"

                                        rcStatus="Closed Closed
                                        "

Migrating from legacy Process Designer known error records

If you upgraded your system from an older Process Designer version, you need to
migrate your old Process Designer knownerror records to new Process Designer
knownerror records by using the Legacy PD known error to new PD known error
migration setting. The migration process includes the following procedures:


1. Change the old Known Error record to Problem record, and then create a new
  Known Error record with a category of "known error."

2. Link the new Known Error record to the Problem record.

3. Copy or don't copy the original relations to the new Known Error record, based
  on the option you select in the Post Script tab of this migration setting, as
  described in the following table.

Option for relation processing          Description

Skip Copying Relations to New           This option doesn't copy original
Known Error Records                     relations to new known error
                                        records.

Copy Relations to New Known Error This option copies original relations

Records                                 to new known error records.

Service Level Management data migration

As of Service Manager 9.40, the Service Level Management (SLM) module is
reimplemented on Process Designer (PD). If you upgraded from an earlier version of
Service Manager, you need to migrate your legacy SLM data so that your SLM module
can work correctly on Process Designer-based workflows.

The purpose of SLM data migration is to set a category and set a phase for
agreement records based on the following rules:

     The Category of an agreement record is populated with the category of one of
     the targets if all the targets of the agreement have the same category (that is,
     the Service Level Category field in the target record).
     The Category of an agreement record is populated with a value of Service Level
     Agreement if the targets of the agreement have different categories or have an
     empty category.

     The Phase of an agreement record is populated with “agreed” if the expiration
     date is later than the current date.
     The Phase of an agreement record is populated with “expired” if the expiration
     date is earlier than the current date.


For SLM data migration, the Legacy SLA to new Agreement migration setting is
provided. See the following tables for its details.

Default settings

Source Table

Source Table                            sla

Target Table                            sla

Filter Condition                        true

Field Mappings

Source Field                            Target Field
agreement.id                            agreement.id
agreements                              agreements
category
contacts                                contacts
current.phase
customer                                customer
description                             description
display.category                        display.category
expiration                              expiration
external.support.groups                 external.support.groups

Value Mappings


Target Value      Mapping Type          Condition         Target Value
Mapping Field     jsCallback
                                                          $value=lib.Migrat
category                                                  eSLA.migrateSLA
                                                          (sourceTable['agr
current.phase     fixedValue            expiration>tod()  eement.id'])
current.phase     fixedValue            expiration<tod()
display.category  jsCallback                              agreed

                                                          expired

                                                          $value=lib.Migrat
                                                          eSLA.migrateSLA
                                                          (sourceTable['agr
                                                          eement.id'])

Related Records data migration

Process Designer-based related records retrieves information that is displayed in the
related records columns directly from the screlation table. The table contains a large
number of screlation records and the field values are generated based on legacy
sccrelconfig settings. Therefore, you must perform data migration in order for the
related records section to be displayed correctly.

An out-of-box script ("DataMigrationForRelatedRecords") is available to perform this
data migration. To run the script, follow these steps:

   1. Open the Script Library and search for the "DataMigrationForRelatedRecords"
     file.

   2. Open the file and uncomment the following line:

      //migrateScrelations

   3. Execute the script. The data migration is performed automatically.

Note

By default, only active screlation records are migrated (for time-saving
purposes). Therefore, if you view inactive (closed ) records in the related
records section, the wrong field value may be displayed.


To migrate all the screlation records, uncomment the following line, and then execute
the script:

//var REFRESH_All_SCRELATION_RECORDS = "true";

If you have a large number (millions) of screlation records, the script may take hours
to update all the records. Therefore, you must ensure that the Windows client session
timeout setting is large enough for the script to complete.

Service Catalog data migration

Considering that Service Catalog doesn't need to copy data from two different tables,
and that it typically has a large volume of data, we recommend that you run the
migration by using the batch update mode (especially for migrating a large volume of
closed records).

The out-of-box example data migration is based on the following two key fields:

     status
     current.phase

            Note

           You can add additional fields if needed, but don't remove these two
           fields.

Default settings:                       svcCatalog
 Source Table                           svcCatalog
 Target Table                           null(current.phase)
 Filter Condition
                                        Source Field
Field Mapping:
 Target Field
 current.phase
 status

Value Mapping:


Target Value       Mapping Type         Condition            Target Value
Mapping Field      fixedValue                                Published
current.phase      fixedValue           active="t"           Retired
current.phase      fixedValue           null(active) or      Retired
                   fixedValue           active="t"           Operational
status                                  null(active) or
                                        active="t"
status                                  active="t"

Configuration Item data migration

Considering that Configuration Item doesn't need to copy data from two different
tables, and that it typically has a large volume of data, we recommend that you run
the migration by using the batch update mode.

The out-of-box example data migration is based on the following key field:

     current.phase

Note

You can add additional fields if needed, but don't remove these two
fields.

Default settings:                       device
 Source Table                           device
 Target Table                           null(current.phase)
 Filter Condition
                                        Source Field
Field Mapping:
 Target Field
 current.phase


Value Mapping:

Target Value    Mapping Type            Condition           Target Value
Mapping Field   fixedValue
current.phase                           istatus=null or     Active
                fixedValue              (istatus~="Missin
current.phase                           g" and
                                        istatus~="Retired
                                        /Consumed" and
                                        istatus~="Return
                                        for Maintenance"
                                        and
                                        istatus~="Return
                                        to Supplier")

                                        istatus="Missing"   Inactive
                                        or
                                        istatus="Retired/
                                        Consumed" or
                                        istatus="Return
                                        for Maintenance"
                                        or
                                        istatus="Return to
                                        Supplier"

Re-index the knowledge bases

After you remove the Problem_Library_disabled_by_PDHD and
KnownError_Library_disabled_by_PDHD knowledgebases, you must run a full re-
index of the knowledgebases if you use Knowledge Management in a production
environment.


1.3.10. Appendix C: Run the SQL compare
utility

The SQL compare utility is an informational tool that compares your existing table
fields and unique key information with those of the Service Manager version you are
upgrading to, and then reports the new and modified fields and unique keys that will
merge into the existing tables. You can use the list of the fields and unique keys
produced by the SQL compare utility to determine whether any fields or unique keys
in your current system differ from those in the new version. You can also use the
report to determine which new fields and unique keys you must add to RDBMS-
mapped files if you choose to make the changes manually during the applications
upgrade.

After running the SQL compare utility on the table fields, refer to the following table
for the result types and the recommended actions.


Result type                               Recommended actions
(Null)
                                          The related field is on the id field in the
Nonexistent in Service Manager 9.80       licenseinfo dbdict. No further action is
fresh installation                        necessary.
Not to be modified to other field type
by the Upgrade Utility                    This field is added by tailoring. No
                                          further action is necessary.
Not to be modified to other field
database type by the Upgrade Utility      Manually modify this field type
                                          according to the matching solution
Not to be moved to alias table by the     described in Data type mismatches.
Upgrade Utility
                                          Manually modify this field type
To be modified by the Upgrade Utility     according to the matching solution
                                          described in Data type mismatches.
To be modified by the Upgrade Utility,
and the original field name xxxx will be  Manually modify this field type
renamed to xxxx.old                       according to the matching solution
To be added by the Upgrade Utility        described in Data type mismatches.

                                          This field type modification will be
                                          done automatically by the Upgrade
                                          Utility during the upgrade process. You
                                          can also manually modify this field type
                                          before the upgrade to improve the
                                          upgrade performance.

                                          This field type modification will be
                                          done automatically by the Upgrade
                                          Utility. No further action is necessary.

                                          This new field will be added
                                          automatically by the Upgrade Utility
                                          during the upgrade process. You can
                                          also manually add this new field
                                          manually before the upgrade to
                                          improve the upgrade performance.

After running the SQL compare utility on the table unique keys, refer to the following
table for the result types and the recommended actions.


Result type                             Recommended actions
Nonexistent in Service Manager 9.80
fresh installation                      This key normally is added by tailoring.
                                        Check this key to see whether it
Exist in Old OOB, and will be removed   includes any field of added primary key
by the Upgrade Utility                  or unique key.

To be added by the Upgrade Utility      This key exists in Old OOB only, but
                                        doesn't exist in Service Manager 9.80.
To be ignored by the Upgrade Utility    The Upgrade Utility will remove this key
                                        automatically. No further action is
                                        necessary.

                                        This key doesn't exist in Old OOB, but
                                        exists in Service Manager 9.80. The
                                        Upgrade Utility will add this key
                                        automatically. No further action is
                                        necessary.

                                        The field is added as a unique key
                                        because Service Manager doesn't
                                        support operations on tables with
                                        primary keys when the applications
                                        version is earlier than 9.32. You can
                                        manually change the key type to
                                        primary key after the system upgrade.

Note

If you are going to accept the new DBDICTS and the changes made to the
DBDICTS in the upgrade, you don't need to run this utility.

Running SQL Compare

The following SQL Compare file is included when you install the Service Manager
Upgrade Utility:

     upgdbdct.dta

SQL Compare returns messages for dbdict mappings that contain new fields. You can
update the dbdicts to contain the fields specified by the SQL Compare applications


before you begin the applications upgrade.

            Note

           Run SQL Compare on a development system. Do not run SQL Compare on
           the post-upgrade system.

            Note

           Before running SQL Compare, load the preupg.bin file using Service
           Manager Database Manager. See Step 4: Load the applications upgrade
           file for more information.

To run the SQL Compare utility, follow these steps:

   1. From the System Navigator, click System Administration > Ongoing
     Maintenance > Upgrade Utility > SQL Compare Utility.

   2. Select Run SQL Compare Utility, and then click Next.
   3. Type the full path to upgdbdct.dta including the final back slash (\) or forward

     slash (/), depending on your operating system. For example, if you copied the
     files to a temporary directory, the path might be:
     Windows: c:\temp\upgrade\
     Linux: ~/upgrade/

                   Note

                You must have read, write, and execute permission to the folder.

   4. Click the Next button.
     SQL Compare returns the following message:
      Process Complete. Please check for any additional messages.
     The results of the SQL Compare process are stored in the sqlupgrade table. This
     table resets each time you run SQL Compare.

To view the SQL compare results of the table fields, follow these steps:

   1. From the System Navigator, click System Administration > Ongoing
     Maintenance > Upgrade Utility > SQL Compare Utility.


   2. Select View SQL Field Compare Results, and then click Next.
   3. Click Search. The results are displayed in a record list.

Each table field difference found by the SQL Compare Utility appears as a separate
record in the sqlupgradefield file. This record also lists the new fields that you must
add to the database dictionary if you are updating your RDBMS mapped system
manually.

The sqlupgradefield record provides the following information for each field you must
add or modify if you are updating your RDBMS mapped system manually.


Field                                   List of sqlupgradefield fields
File Name
Field Name                                           Description
Field Structure
Field Type                                           The exact file name which delegates
Field Level                                          the database dictionary.
Result Type
Field Alias Of                                       The exact field name to add or modify
                                                     to the associated database dictionary.
Field SQL Table Alias
Field SQL Name                                       The field structure in the database
Field SQL Type                                       dictionary.
Field SQL RC
Exceptions                                           The field type in the database
                                                     dictionary.

                                                     The field level in the database
                                                     dictionary.

                                                     The actions happened or will happen to
                                                     this field.

                                                     If this is an alias field, it contains the
                                                     name of the primary field that it is an
                                                     alias of. Otherwise, this field is blank.

                                                     The SQL table alias of this field in the
                                                     database dictionary.

                                                     The SQL name of this field in the
                                                     database dictionary.

                                                     The SQL type of this field in the
                                                     database dictionary.

                                                     The encoding format of this field in the
                                                     database dictionary.

                                                     The exceptions that occurs when
                                                     adding or modifying this field.

To view the SQL Compare results of the table unique keys, follow these steps:


1. From the System Navigator, click System Administration > Ongoing
  Maintenance > Upgrade Utility > SQL Compare Utility.

2. Select View SQL Unique Key Compare Results, and then click Next.
3. Click Search. The results are displayed in a record list.

Each table unique key difference found by the SQL Compare Utility appears as a
separate record in the sqlupgradekey file. This record also lists the new unique keys
that you must add to the database dictionary, if you want to check the possible
duplicated record manually.

The sqlupgradekey record provides the following information for each field you must
add or modify, if you want to check the possible duplicated record manually.

Field                                   List of sqlupgradekey fields

                                                     Description

File Name                               The exact file name which delegates
                                        the database dictionary.

Result Type                             The actions happened or will happen to
                                        this field.

Key Type                                The unique key types include primary,
                                        unique, and noduplicated.

Key Field                               character.

Exceptions                              The exceptions that occurs when
                                        adding or modifying this unique key.

Add new fields

For the new fields to perform correctly, they must exist in both the Service Manager
database dictionary and the SQL database. If you are updating your RDBMS mapped
system manually, you must add them to the SQL database and update the existing
Service Manager SQL mapping in the database dictionary. When you update a table in
sqlsystemtables, add fields only through the database dictionary. Modifying the SQL
mapping damages the file structure of the table.

Determine the correct structure

In most cases, you should add the new field to the descriptor structure. However,
sometimes the Structure field contains something other than the word "descriptor".


When this occurs, add the new field to the appropriate location.
Action to take with non-descriptor fields:

In this instance                        Add the field here
The field resides in another structure
The field is an array                   Check the cm3r dbdict. There is a
                                        "middle" field of structure type.
The field is part of an array of
structures                              If the field is an array, the field name
                                        appears twice in the new field list.
                                        Check any field of array type. The root
                                        field has array type, but the same name
                                        field normally has the real type (for
                                        example, VARCHAR(60)). Use the first
                                        entry to determine the structure where
                                        you should add the array. The Structure
                                        field in the second entry reflects both
                                        the structure for the array (unless it
                                        uses the descriptor structure) and the
                                        name of the array itself.

                                        Check the kmcategory dbdict
                                        permission field, which is a structured
                                        array field.

Note

When adding fields to an array of structures, add them in the same order
as they appear in the sqlupgrade record.

Process the NVARCHAR SQL type

Although the upgrade version uses the VARCHAR SQL type for fields, SQL Compare
and Upgrade Utility retain the use of the NVARCHAR SQL type after the upgrade. For
example, if the SQL type of a field is NVARCHAR(60) in the current version and the
SQL type of this field in the upgrade version should be VARCHAR(60), the SQL type of
this field will remain NVARCHAR(60) in the upgraded version.

If the current and updated versions of a field have different length SQL types, SQL
Compare and Upgrade Utility use the longer length. For example, if the field SQL Type


is NVARCHAR(60) in the current version and if the SQL Type of this field in the
upgrade version is VARCHAR(100), the SQL Type of this field will be NVARCHAR(100)
in the upgraded version.

If you want to tailor the SQL type of a field from VARCHAR to NVARCHAR and retain
the same length, be sure to perform tailoring from the database instead of from the
Service Manager database dictionary. Otherwise, the tailoring will be ignored by
Service Manager.
````
