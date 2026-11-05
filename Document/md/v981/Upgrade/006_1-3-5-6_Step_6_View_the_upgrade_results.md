---
source: Document/pdf/v981/Upgrade.pdf
version: 9.81
sections: 1.3.5.6 .. 1.3.5.8
printed_pages: 108-140
---

# 1.3.5.6 Step 6: View the upgrade results

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.3.5.6. Step 6: View the upgrade results

While you are applying an out-of-box upgrade on the development system, the
Upgrade Utility stores information regarding the upgrade result of each object. You
can access this information in the Upgrade Utility through View Upgrade Results and
Merge Conflicts.
To view the upgrade results, follow these steps:

   1. From the System Navigator, click System Administration > Ongoing
     Maintenance > Upgrade Utility > View/Merge Results.

   2. If you are upgrading from SM9.3x with PDCP3 installed or non-PD environment
     or SM9.4x Classic, you can see a wizard page. Select View Upgrade Results
     and Merge Conflicts, and then click Next.

                   Note

                This screen appears only after Process Designer Hybrid migration.

   3. In the Result drop-down list, select the type of results you want to search for.
     Example: Renamed
     When you select a result type from the drop-down list, the description of that
     result type appears under the drop-down list.

   4. Click Search.
   5. A list is returned that displays all the result records of the specified type.

                   Note

                Some types of results are only informational and don't require any
                follow-up action.

Description of upgrade results

The search criteria, search results, and a description of the applicable action for each
result are described in the table below.

Field                                                                                           Service Manager 9.81
Object Type
Object Name                             Definition

Result: Added                           Enter the type of object you want to
                                        search for, or leave this field blank to
                                        return all object types. The object
                                        types you could search for include
                                        Applications Cluster, Object, Process,
                                        ScriptLibrary, displayoption, format,
                                        formatctrl, help, joindefs, link,
                                        scmessage, screlconfig, triggers,
                                        validity, and wizard.

                                        Enter the name of the object you want
                                        to search for, or leave this field blank to
                                        return objects with any name. The
                                        object name is typically the unique
                                        identifier in the database table
                                        specified for the object type.

                                        The unique identifier for some object
                                        types (for example, format) may
                                        contain concatenate values of multiple
                                        fields according to the key setting in
                                        the signaturemake signature definition
                                        table.

                                        Select this option to search for new
                                        objects that the Upgrade Utility added
                                        to the system. These objects did not
                                        exist in your system before this
                                        upgrade.

                                        No further action is necessary for
                                        these objects.

 Field                                                                                          Service Manager 9.81
 Result: Already Current
 Result: Auto Merged                    Definition

 Result: Error                          Select this option to search for objects
                                        that were already the latest version.
This PDF was generated on May 23, 2026  No further action is necessary for
                                        these objects.

                                        Select this option to search for objects
                                        that the Upgrade Utility automatically
                                        merged by using your local version, the
                                        out-of-box version and the upgrade
                                        version of the objects.

                                                    Note

                                                   The result occurs only after
                                                   applying the first out-of-
                                                   box upgrade; it no longer
                                                   occurs after applying the
                                                   custom upgrade.

                                        Required Action: If the object was not
                                        merged the way you expect, use the
                                        Revert or Mass Revert option from the
                                        options menu to revoke the auto-merge
                                        and merge the objects manually.

                                        Select this option to search for objects
                                        that encountered an error while being
                                        updated by the Upgrade Utility. For
                                        more information about the error,
                                        review the sm.log and except.log files.
                                        Required Action: Fix the cause of the
                                        error, or apply the upgrade again in a
                                        copy of your production system if it is
                                        needed.

                                                                                                                        Page 110 of 294
Field                                                                                           Service Manager 9.81
Result: Forced
                                        Definition

                                        Select this option to search for objects
                                        that were not only tailored on your
                                        Service Manager system but also
                                        changed in the upgrade version. After
                                        the upgrade, your objects were
                                        automatically replaced with the objects
                                        in your custom upgrade package. The
                                        Upgrade Utility copied your object of
                                        the original version to its revision.

                                                    Note

                                                   This result occurs only
                                                   after applying the custom
                                                   upgrade.

                                        No further action is necessary for
                                        these objects.

Field                                                                                           Service Manager 9.81
Result: Kept Customer
                                        Definition

                                        Select this option to search for objects
                                        that were tailored on your Service
                                        Manager system but not changed on
                                        the upgrade version. These objects
                                        were not changed.

                                                    Note

                                                   The result occurs only after
                                                   applying the first out-of-
                                                   box upgrade; it no longer
                                                   occurs after applying the
                                                   custom upgrade.

                                                    Tip

                                                   If an object is Applications
                                                   Cluster and you want to
                                                   use the upgrade version,
                                                   you can select Choose
                                                   Upgrade. The object
                                                  <object name> is then
                                                  renamed to PRE<old
                                                  version number><object
                                                  name> and the object
                                                  NEW980<object name> is
                                                  renamed to <object name>.

                                        No further action is necessary for
                                        these objects.

Field                                                                                           Service Manager 9.81
Result: Kept Customer Non-OOB
                                        Definition

                                        Select this option to search for objects
                                        that did not exist in the original version
                                        but were added on your Service
                                        Manager system, and also added on
                                        the upgrade version.

                                                    Note

                                                        The result occurs only
                                                        after applying the first
                                                        out-of-box upgrade. It
                                                        no longer occurs after
                                                        applying the custom
                                                        upgrade.
                                                        There is no such
                                                        result when upgrading
                                                        from SM9.7x. The
                                                        corresponding result
                                                        is Renamed.

 Field                                                                                          Service Manager 9.81

This PDF was generated on May 23, 2026  Definition

                                                    Tip

                                                   If you want to use the
                                                   upgrade version for the
                                                   object, you can select
                                                   Choose Upgrade. If the
                                                   object is Application
                                                   Cluster, the object <object
                                                   name> is then renamed to
                                                   PRE<old version number>
                                                   <object name> and the
                                                   object NEW980<object
                                                   name> is renamed to
                                                   <object name>. If the
                                                   object is not Application
                                                   Cluster, the object
                                                   NEW980<object name> is
                                                   copied to replace <object
                                                   name>. The result is then
                                                   set to Replaced.

                                        Required Action: Choose one of the
                                        following solutions for each object with
                                        this result.

                                             Keep the old version — No further
                                             action is necessary.
                                             Keep the new version — Select
                                             the object in the merge view and
                                             click Copy all from left to right on
                                             the toolbar.
                                             Merge new and current versions
                                             — Determine which of the new
                                             features need be incorporated
                                             into your tailored object, and then
                                             modify the tailored object. When
                                             finished, delete the new object
                                             NEW980<object name> and the

                                                                                                                        Page 114 of 294
Field                                                                                           Service Manager 9.81
Result: Merged
                                        Definition
                                             copied object PRE<old version
                                             number><object name>.

                                        Select this option to search for dbdict
                                        objects that were tailored on your
                                        Service Manager system, which
                                        Upgrade Utility has merged with the
                                        version in this upgrade.
                                        Required Action: Test these objects,
                                        and when satisfied change their result
                                        to Reconciled.

 Field                                                                                          Service Manager 9.81
 Result: Previously Reconciled
                                        Definition
This PDF was generated on May 23, 2026
                                        Select this option to search for objects
                                        that were tailored on your Service
                                        Manager system, that were marked as
                                        Reconciled during a previous upgrade
                                        or patch release, or where your object
                                        was not changed and the Upgrade
                                        Utility added a new object
                                        NEW980<object name>.

                                                    Note

                                                   The result occurs only after
                                                   applying the out-of-box
                                                   upgrade; it no longer
                                                   occurs after applying the
                                                   custom upgrade.

                                        Required Action: Choose one of the
                                        following for each object with this
                                        result.

                                             Keep the old version — No further
                                             action is necessary.
                                             Keep the new version — Select
                                             the object in the merge view and
                                             click Copy all from left to right on
                                             the toolbar.
                                             Merge new and old versions —
                                             Determine which of the new
                                             features should be incorporated
                                             into your tailored object, and then
                                             make the changes in your tailored
                                             object. When finished, delete the
                                             new object NEW980<object
                                             name> and the copied object
                                             PRE<old version number><object
                                             name>.

                                                                                                                        Page 116 of 294
 Field                                                                                          Service Manager 9.81
 Result: Reconciled
                                        Definition
This PDF was generated on May 23, 2026
                                                    Tip

                                                   If you want to use the
                                                   upgrade version for the
                                                   object, you can select
                                                   Choose Upgrade. If the
                                                   object is Application
                                                   Cluster, the object <object
                                                   name> is then renamed to
                                                   PRE<old version number>
                                                   <object name> and the
                                                   object NEW980<object
                                                   name> is renamed to
                                                   <object name>. If the
                                                   object is not Application
                                                   Cluster, the object
                                                   NEW980<object name> is
                                                   copied to replace <object
                                                   name>. The result is then
                                                   set to Replaced.

                                        Select this option to search for objects
                                        that you have already marked as
                                        Reconciled.

                                                    Note

                                                   The result occurs only after
                                                   applying the out-of-box
                                                   upgrade; it no longer
                                                   occurs after applying the
                                                   custom upgrade.

                                        No further action is necessary for
                                        these objects.

                                                                                                                        Page 117 of 294
 Field                                                                                          Service Manager 9.81
 Result: Renamed
                                        Definition
This PDF was generated on May 23, 2026
                                        Select this option to search for objects
                                        that were not only tailored on your
                                        Service Manager system but also
                                        changed on the upgrade version. After
                                        upgrade, your tailored object was not
                                        changed, the Upgrade Utility added a
                                        new object NEW980<object name>
                                        and copied your tailored object as a
                                        backed up object PRE<old version
                                        number><object name>.

                                                    Note

                                                   The result occurs only after
                                                   applying the out-of-box
                                                   upgrade; it no longer
                                                   occurs after applying the
                                                   custom upgrade.

                                        Required Action: Choose one of the
                                        following for each object with this
                                        result.

                                             Keep the old version — No further
                                             action is necessary.
                                             Keep the new version — Select
                                             the object in the merge view and
                                             click Copy all from left to right on
                                             the tool bar.
                                             Merge new and old versions —
                                             Determine which of the new
                                             features should be incorporated
                                             into your tailored object, and then
                                             make the changes in your tailored
                                             object. When finished, delete the
                                             new object NEW980<object
                                             name> and the copied object

                                                                                                                        Page 118 of 294

Field                                   Definition

                                        PRE<old version number><object
                                        name>.

                                                    Tip

                                                    If you want to use the
                                                    upgrade version for the
                                                    object, you can select
                                                    Choose Upgrade. If the
                                                    object is Application
                                                    Cluster, the object <object
                                                    name> is then renamed to
                                                    PRE<old version number>
                                                    <object name> and the
                                                    object NEW980<object
                                                    name> is renamed to
                                                    <object name>. If the
                                                    object is not Application
                                                    Cluster, the object
                                                    NEW980<object name> is
                                                    copied to replace <object
                                                    name>. The result is then
                                                    set to Replaced.

Field                                                                                           Service Manager 9.81
Result: Upgraded
                                        Definition

                                        Select this option to search for objects
                                        that were automatically replaced with
                                        the upgrade version objects. These are
                                        objects that were not tailored on your
                                        Service Manager system, but changed
                                        on the upgrade version.

                                                    Note

                                                   The result occurs only after
                                                   applying the out-of-box
                                                   upgrade; it no longer
                                                   occurs after applying the
                                                   custom upgrade.

                                        No further action is necessary for
                                        these objects.

 Field                                                                                          Service Manager 9.81
 Result: Replaced
                                        Definition
This PDF was generated on May 23, 2026
                                        Select this option to search for objects
                                        that were not only tailored on your
                                        Service Manager system but also
                                        changed on the upgrade version and
                                        automatically replaced with the
                                        upgrade version objects. These objects
                                        have 3 types: RAD Application,
                                        ScriptLibrary with labels of Proprietary,
                                        and the objects that are necessary for
                                        Process Designer functionality. After
                                        upgrade, your tailored object was
                                        renamed to PRE<old version number>
                                        <object name> and the Upgrade Utility
                                        added a new object <object name>.

                                                    Note

                                                   The result occurs only after
                                                   applying the out-of-box
                                                   upgrade; it doesn't occur
                                                   after applying the custom
                                                   upgrade.

                                        Required Action: Do the following for
                                        the relevant object with this result.

                                             ScriptLibrary - check the new and
                                             old versions — Determine which
                                             of the old tailoring should be
                                             incorporated into the upgraded
                                             object, and then make the
                                             changes in your upgraded object.
                                             When finished, delete the new
                                             object NEW980 and the copied
                                             object PRE.
                                             Others - No further action is
                                             necessary for these objects.

                                                                                                                        Page 121 of 294

Field                                   Definition

                                                    Tip

                                                    If you don't want to replace
                                                    the objects, you may select
                                                    Revert. If the object is
                                                    Application Cluster, the
                                                    object <object name> is
                                                    then renamed to
                                                    NEW980<object name>
                                                    and the object PRE<old
                                                    version number><object
                                                    name> is renamed to
                                                    <object name>. If the
                                                    object is not Application
                                                    Cluster, the object PRE<old
                                                    version number><object
                                                    name> is copied to replace
                                                    <object name>. The result
                                                    is then set back to
                                                    Renamed, Previously
                                                    Reconciled, Kept Customer
                                                    or Kept Customer Non-
                                                    OOB.

See the following table for some examples about how the upgrade result types are
marked for an existing record.


OOB    OOB    Custo                     OOB    Upgr     Upgr     Confli  Upgr    Upgr
recor  recor  mer                       recor  ade      ade      ct      ade     ade
d      d      recor                     d      Utility  Utility  flag    result  result
(9.30  (9.33  d                         (9.80  chec     chec             type    value
)      )      (9.33                     )      k        k
              )                                sequ     condi
                                               ence     tion

111 112 112 112 1                                       Custo No         Alrea 112
                                                        mer              dy
                                                        recor            Curre
                                                        d                nt
                                                        (9.33)
                                                        =
                                                        OOB
                                                        recor
                                                        d
                                                        (9.80)


OOB    OOB    Custo                     OOB    Upgr     Upgr     Confli  Upgr    Upgr
recor  recor  mer                       recor  ade      ade      ct      ade     ade
d      d      recor                     d      Utility  Utility  flag    result  result
(9.30  (9.33  d                         (9.80  chec     chec             type    value
)      )      (9.33                     )      k        k
              )                                sequ     condi
                                               ence     tion

111 112 112 113 2                                       Custo No         Upgra 113
                                                        mer              ded
                                                        recor
                                                        d
                                                        (9.33)
                                                        !=
                                                        OOB
                                                        recor
                                                        d
                                                        (9.80)
                                                        and

                                                        Custo
                                                        mer
                                                        recor
                                                        d
                                                        (9.33)
                                                        =
                                                        OOB
                                                        recor
                                                        d
                                                        (9.33)


OOB    OOB    Custo                     OOB    Upgr     Upgr     Confli  Upgr    Upgr
recor  recor  mer                       recor  ade      ade      ct      ade     ade
d      d      recor                     d      Utility  Utility  flag    result  result
(9.30  (9.33  d                         (9.80  chec     chec             type    value
)      )      (9.33                     )      k        k
              )                                sequ     condi
                                               ence     tion

111 112 113 112 3                                       Custo No         Kept 113
                                                        mer              Custo
                                                        recor            mer
                                                        d
                                                        (9.33)
                                                        !=
                                                        OOB
                                                        recor
                                                        d
                                                        (9.80)
                                                        and

                                                        Custo
                                                        mer
                                                        recor
                                                        d
                                                        (9.33)
                                                        !=
                                                        OOB
                                                        recor
                                                        d
                                                        (9.33)
                                                        and
                                                        OOB
                                                        recor
                                                        d
                                                        (9.33)
                                                        =
                                                        OOB
                                                        recor
                                                        d
                                                        (9.80)


OOB    OOB    Custo                     OOB    Upgr     Upgr     Confli  Upgr    Upgr
recor  recor  mer                       recor  ade      ade      ct      ade     ade
d      d      recor                     d      Utility  Utility  flag    result  result
(9.30  (9.33  d                         (9.80  chec     chec             type    value
)      )      (9.33                     )      k        k
              )                                sequ     condi
                                               ence     tion

111 112 113 114 4                                       Custo Yes        Rena 113
                                                        mer              med
                                                        recor
                                                        d(9.3
                                                        3)!=O
                                                        OB
                                                        recor
                                                        d(9.8
                                                        0)
                                                        and

                                                        Custo
                                                        mer
                                                        recor
                                                        d(9.3
                                                        3)!=O
                                                        OB
                                                        recor
                                                        d(9.3
                                                        3)
                                                        and
                                                        OOB
                                                        recor
                                                        d(9.3
                                                        3)!=O
                                                        OB
                                                        recor
                                                        d(9.8
                                                        0)


OOB    OOB    Custo                     OOB    Upgr     Upgr     Confli  Upgr    Upgr
recor  recor  mer                       recor  ade      ade      ct      ade     ade
d      d      recor                     d      Utility  Utility  flag    result  result
(9.30  (9.33  d                         (9.80  chec     chec             type    value
)      )      (9.33                     )      k        k
              )                                sequ     condi
                                               ence     tion

              113 112 5                                 OOB Yes          Kept 113
                                                        recor            Custo
                                                        d                mer
                                                        (9.33)           Non-
                                                        doesn            OOB
                                                        't
                                                        exist
                                                        and

                                                        Custo
                                                        mer
                                                        recor
                                                        d
                                                        (9.33)
                                                        !=
                                                        OOB
                                                        recor
                                                        d
                                                        (9.80)

       Note

       When upgrading from SM9.6x, the upgrade result for Kept Customer
       Non-OOB is Renamed instead.


1.3.5.7. Step 7: Manage the upgrade result
data

To manage the upgrade result data more easily, do either of the following:

     Open the Upgrade Results list, click More or the More Actions icon, and click
     Export to Excel to manage the data in a Microsoft Excel document, or
     Open the Upgrade Results list, click File > Print > List View to print the list of
     records.

After you complete an applications upgrade on your development system, you are
ready to resolve the exceptions and conflicts that originate from tailoring on an
upgraded object. Before resolving conflicts, Service Manager features may not
function as expected.


1.3.5.8. Step 8: Resolve exceptions

Exceptions are logged if the Upgrade Utility can't add or update an object. After
running an upgrade, you can identify exceptions by viewing error messages in the
except.log or sm.log file. These exceptions are reported in the Upgrade Results list as
"Error."

Data type mismatches

If the data type of a field in your dbdict doesn't match the data type of the like-named
field defined in the dbdict provided by the upgrade package, the Upgrade Utility can't
merge these dbdicts. For example, if an existing dbdict has a scalar field and the
Upgrade Utility attempts to add a structure field with the same name, this discrepancy
prevents the dbdict from being updated.

To fix this issue, you can change the data type and the SQL type of the field, and use
Complex Update to migrate existing data on that field to the target data type. Follow
these steps to modify field data type by using the Dbdict Utility:

   1. Navigate to System Navigator > Tailoring > Database Dictionary.
   2. Type the dbdict name in the File Name field, and then click Search.
   3. Double-click the field you want to change the data type, and then make updates

     as expected.
   4. Save your changes.

The following is an example that shows the process of fixing a typical data type
mismatch.


Note

The error messages in the except.log file identify each data type by an
index number:

Index number                            Data type
1                                       number
2                                       character
3                                       date/time
4                                       logical
8                                       array
9                                       structure
11                                      expression

The following table displays a list of data type mismatches that may appear in the
except.log file for an Oracle database. Only some examples are listed for each
category of data type mismatch. If you are using an MSSQL database, the actual error
message may vary slightly. For example, the following list highlights the different
errors in the different databases:

     Oracle Error : dbdict:ApprovalDef, field:appr.condition, SQL type is CHAR(1) --
     expected to be:RAW(255)
     MSSQL Error: dbdict:ApprovalDef, field:appr.condition, SQL type is CHAR(1) --
     expected to be:VARBINARY(255)


Error message in Oracle:                   Solution:

dbdict:incidents, field:svc.options, SQL   To fix these issues, change the SQL
type is VARCHAR2(90) -- expected to        type to RAW(255) or BLOB by using the
be:BLOB                                    Dbdict utility.

dbdict:SMISTaskQueue,                      Additionally, you will need to set the
field:failedReason, SQL type is            “SQL RC” to true to allow the field to
VARCHAR2(60) -- expected to                store RAD expressions. Note that the
be:BLOB                                    stored value of the field in the database
                                           is encoded by Service Manager.
dbdict:Workflow, field:description, SQL
type is VARCHAR2(255) -- expected to       Note: If you change the value of "SQL
be:BLOB                                    RC", we suggest changing this value
                                           back to the original value after
                                           updating the SQL type.

dbdict:cm3eventack, field:number, field To fix this issue, change the field type

type is number -- expected to              to character by using the Dbdict utility.

be:character

dbdict:Rule, field:tablename, SQL type     Ignore the error message. No further
is VARCHAR2(60) -- expected to             action is necessary.
be:CLOB

dbdict:svcItemCount, field:access.filter,  To fix these issues, change the SQL
SQL type is RAW(255) -- expected to        type to CLOB by using the Dbdict
be:CLOB                                    utility. Additionally, you need to switch
                                           the value of “SQL RC” to update the
                                           type.

                                           Note: If you change the value of "SQL
                                           RC", we suggest changing this value
                                           back to the original value after
                                           updating the SQL type.


Error message in Oracle:                     Solution:

dbdict:eventin, field:evnumber, field        These fields reside in the descriptor
type is number -- expected to                structure field of BLOB SQL type. To fix
be:character                                 this issue, change the field type to
                                             character by using the Dbdict utility.
dbdict:eventout, field:evnumber, field
type is number -- expected to
be:character

dbdict:svcCatLanguage, field:catalogid,      This field resides in the catalog
field type is character -- expected to       structure field of BLOB SQL type. To fix
be:number                                    this issue, change the field type to
                                             number by using the Dbdict utility.

dbdict:licenseinfo, field:id, field type is  The licenseinfo table is used to track
character -- expected to be:number           license information by Service Manager
                                             server. This issue should be ignored.

dbdict:svcCatalog, field:id.attach, field    This id.attach field is an alias of id field
type is character -- expected to             in svcCatalog table. To fix the issue,
be:number                                    change the field type to by using the
                                             Dbdict utility.

dbdict:FolderRights, field:close, field      The close field is an alias of delete field
type is logical -- expected to               in FolderRights table. To fix the issue,
be:character                                 change the field type to character by
                                             using the Dbdict utility.

dbdict:FolderRights, field:delete, field     This issue can be fixed by following the
type is logical -- expected to               steps in the Fixing the FolderRights
be:character                                 delete field section below.


Error message in Oracle:                Solution:

dbdict:cm3r, field:assets, SQL type is  This kind of error message is
CLOB -- expected to be:                 generated because the Upgrade Utility
VARCHAR2(200)                           doesn't remap the field of array type
                                        from the main table to the alias table
dbdict:cm3r, field:assets, field        and the subsequent full-table copy
type:character, SQL type is CLOB --     may slow down the upgrade.
expected to be:VARCHAR2(200), SQL
table is m1 -- expected to be:a3        Follow these steps to fix the issue:

                                           1. Double-click the field of array
                                             type which contains this field in
                                             the related table, and then update
                                             the value in “SQL Table” to
                                             a<number> which is not used in
                                             the alias table. For example, a3.

                                           2. Double-click the field of character
                                             type in the related table. Update
                                             the value in “SQL TYPE” to the
                                             expected value, and then update
                                             the value in “SQL Table” to the
                                             same a<number> which is not
                                             used in the alias table. For
                                             example, a3.

                                           3. Click OK to save your changes.

                                                    Caution

                                                   If the related table contains
                                                   more than 100,000 records,
                                                   fixing the data type
                                                   mismatches in the field
                                                   may take more than one
                                                   hour.


Error message in Oracle:                  Solution:

dbdict:inbox, Primary Key is inbox.id --  To fix this issue, change the unique key
the primay key can't be added. Since      to primary key by using the Dbdict
SM doesn't support operation on table     utility.
with primary key when applications
version is older than 9.32, then add
inbox.id as unique key.

Update field type for record.number in    The field type is updated from number
kmreindex dbdict from number to           to character. You need to check
character -- You need to update the       whether the data values are updated
relevant data in dbdict kmreindex         and then update the data values to the
manually.                                 correct ones.

Failed to add Primary key: {"mailno"} to  Check whether the primary key is
table mail. You must add it manually.     added to dbdict mail. If not, please
                                          check whether the values of this field
                                          are filled for all records in this table.
                                          You need to manually fill this field and
                                          add the primary key by using the
                                          Dbdict utility.


            Note

           Ignore the message if the child fields of an array of structure field have
           been mapped to the database columns. For example:

                 dbdict:computer, field:video, SQL type is EMPTY --
                 expected to be:BLOB
                 dbdict:computer, field:vid.card.id, SQL type is
                 VARCHAR2(30) -- expected to be:EMPTY
                 dbdict:computer, field:vid.card.bios, SQL type is
                 VARCHAR2(30) -- expected to be:EMPTY
                 dbdict:computer, field:vid.manufacturer, SQL type is
                 VARCHAR2(30) -- expected to be:EMPTY
                 dbdict:computer, field:vid.model, SQL type is
                 VARCHAR2(30) -- expected to be:EMPTY
                 dbdict:computer, field:vid.chip.type, SQL type is
                 VARCHAR2(30) -- expected to be:EMPTY
                 dbdict:computer, field:vid.memory, SQL type is NUMBER -
                 - expected to be:EMPTY
                 dbdict:computer, field:vid.resolution, SQL type is
                 VARCHAR2(30) -- expected to be:EMPTY
                 dbdict:computer, field:vid.resolution.x, SQL type is
                 VARCHAR2(30) -- expected to be:EMPTY
                 dbdict:computer, field:vid.resolution.y, SQL type is
                 VARCHAR2(30) -- expected to be:EMPTY

Fixing the FolderRights delete field

Example: The dbdict for the FolderRights table has a delete field with the "logical"
data type. The Upgrade Utility tries to update the delete field with the "character"
data type, which has possible values of "always," "never," "workgroup," and
"assigned."


          Note

         The field type of delete field in FolderRights dbdict may be updated to
         character. There is another information in except.log:
          Update field type for delete in FolderRights dbdict from logical to
         character -- You need to update the relevant data in dbdict FolderRights
         manually.

         The value of the field also need to be updated following the steps
         manually.

 1. In the dbdict for the FolderRights table, add a field named delete.tmp with a data
    type of character, and update the dbdict.

 2. Log out of the system and log back in.

 3. Make sure that the Complex Update feature is enabled for the FolderRights table.

                 Note

               To enable the Complex Update feature, open the FolderRights
               Format Control record, go to Privileges and open the Advanced tab,
               and then update the values in the Simple Mass Update field and in
               the Complex Mass Update field to true .

 4. In the Database Manager, search for all records in the FolderRights table.
 5. From the More Actions menu, click Mass Update.
 6. When you are asked whether you want to update all records, click Yes.
 7. Click Complex Update on the toolbar.

 8. In the statements area under Instructions for action on EACH RECORD, add
    statements using standard RAD expressions to migrate data from the delete field
    to the delete.tmp field.

    Example:

     if delete in $file=true then delete.tmp in $file="always" else delete.tmp in
    $file="never"

 9. In the dbdict for the FolderRights table, edit the delete field and add the Type
    (character) and SQL Type (same as the SQL Type automatically assigned for
    delete.tmp).

10. Log out of the system and log back in.


 11. In the Database Manager, search for all records in the FolderRights table.
 12. From the More Actions menu, click Mass Update.
 13. Click Complex Update on the toolbar.

 14. In the statements area under Instructions for action on EACH RECORD, add
     statements using standard RAD expressions to migrate data from the delete.tmp
     field to the delete field and empty the delete.tmp field.

     Example:

      delete in $file=delete.tmp in $file; delete.tmp in $file=NULL

 15. In the dbdict for the FolderRights table, follow these steps to remove the
     delete.tmp field:

        1. In the Database Manager, search for all records in the dbdict table.
        2. Select the dbdict format.
        3. Type FolderRights in the Name field, and then click Search.
        4. Locate the row for the delete.tmp field. Remove the values in the Name,

           Type, Index, and Level fields respectively.
        5. Click Save and OK.
 16. Log out of the system and log back in.
 17. Test the change by updating records in the FolderRights table and populating the
     delete field with "always," "never," "workgroup," or "assigned."

Add new object record failure

All the upgraded objects are saved in the upgradeobjects table, and you need to add
some objects from this table to the current upgradeobjects table. If the target table
contains more than one unique type key, some errors may occur when adding new
objects during the upgrade process. Refer to the following error message as an
example.

2014-03-20 14:04:29 file:inbox, updated the field inbox.id value from 10000313 to
14042954310000313

The value of the inbox.id field is 10000313 in this example, which is used in the
current upgradeobjects table. If the Upgrade Utility adds an inbox record that
contains the same value for this field, the current value of the inbox.id field is
automatically prefixed with a timestamp to avoid duplication errors. The timestamp is
composed of hour (two bits), minute (two bits), second (two bits) and millisecond
(three bits). In this example, the timestamp is 140429543.

After upgrading, you can update the temporary value of the inbox.id field as
necessary.


Handle key change failure

If the Upgrade Utility fails to apply certain key changes, error information is logged
into the except.log file. Review the log file and make appropriate operations.

            Important

           If you are upgrading from applications version earlier than 9.32, we
           recommend you to enable primary keys after the applications upgrade
           and the main steps are as follows:

              1. Apply the out-of-box upgrade
              2. Build a custom upgrade
              3. Apply the custom upgrade
              4. Enable primary keys

           You can review the except.log file and then refer to Working with primary
           keys for conversion instructions.

Error message 1: Failed to add <key_type> key: <field_name> to table <table_name>.
You must add it manually.

Follow these steps to handle this error:

   1. Type dbdict in the Service Manager command line, and press Enter.
   2. In the File Name field, type the table name indicated by the error message, and

     click Search.
   3. Click the Keys tab.
   4. Position the mouse point in the key name part of an empty key structure, and

     click New Field/Key.
   5. Select the appropriate key type from the combo list, and add the appropriate

     field to the key, as indicated by the error message.
   6. Click Add, and click Yes to confirm.
   7. Click the Keys tab, and click OK to save the change.
  8. Continue to follow steps 1 through step 7 for each key that failed to be added.

Error message 2: Failed to update <key_type> key: <old_field_name> to
<new_field_name> in table <table_name>. You must update it manually.

Follow these steps to handle this error:

   1. Type dbdict in the Service Manager command line, and press Enter.
   2. In the File Name field, type the table name indicated by the error message, and

     click Search.


   3. Click the Keys tab.
   4. From the key list, select the key name that's indicated by the error message, and

     click Edit Field/Key.
   5. Update the fields in the key according to the field names indicated by the error

     message.
   6. Click OK, and click Yes to confirm.
   7. Click the Keys tab, and click OK to save the change.
  8. Continue to follow steps 1 through step 7 for each key that failed to be updated.

Error message 3: Failed to remove <key_type> key: <field_name> from table
<table_name>. You must remove it manually.

Follow these steps to handle this error:

   1. Type dbdict in the Service Manager command line, and press Enter.
   2. In the File Name field, type the table name indicated by the error message, and

     click Search.
   3. Click the Keys tab.
   4. From the key list, select the key name that's indicated by the error message, and

     click Edit Field/Key.
   5. Click Delete, and click Yes to confirm.
   6. Click the Keys tab, and click OK to save the change.
  7. Continue to follow steps 1 through step 6 for each key that failed to be removed.

In addition, you may encounter the following Unique Key errors:

Error: dbdict:Approval, Unique Key is {"unique.key", "file.name", "name"} --
expected to be:{"unique.key", "file.name", "name", "component"}

Error: dbdict:ApprovalLog, Unique Key is {"counter", "file.name", "unique.key"} --
expected to be:{"counter", "file.name", "unique.key", "component"}

Unexpected errors

If the except.log file or the Upgrade Results list reports any errors other than data
type mismatches, review the sm.log file for more information, and if needed, contact
Customer Support for assistance.
````
