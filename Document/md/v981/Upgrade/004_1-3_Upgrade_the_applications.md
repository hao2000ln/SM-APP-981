---
source: Document/pdf/v981/Upgrade.pdf
version: 9.81
sections: 1.3 .. 1.3.4
printed_pages: 64-89
---

# 1.3 Upgrade the applications

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.3. Upgrade the applications

You can use the Service Manager 9.80 Upgrade Utility to upgrade your Service
Manager applications from version 9.3x, 9.4x, 9.5x, 9.6x, 9.7x to 9.80.

            Note

           The Upgrade Utility includes not only Upgrade Utility but also Application
           Patch Manager. It upgrades not only your applications but also your
           language packs to version 9.80.

Topics in this section include:
Applications upgrade overview
Application upgrade paths
Applications upgrade process
Planning an upgrade
Upgrade tasks on the development environment
Upgrade tasks on the test environment
Upgrade tasks on the production environment
Appendix A: Additional manual migration tasks on Service Manager Hybrid
Appendix B: Data migration
Appendix C: Run the SQL compare utility
Appendix D: Mapping between legacy security profiles and current PD security roles


1.3.1. Applications upgrade overview

The following sections describe how to upgrade your Service Manager applications to
9.80 by using the Service Manager 9.80 Upgrade Utility.

Before you begin an upgrade

Before you begin an upgrade, ensure that you:

     Read through the upgrade documentation to familiarize yourself with the
     upgrade process and all of the upgrade requirements.
     Are an experienced system administrator who is familiar with Service Manager.

If you don't have the administrative experience necessary to manage the upgrade,
you may need assistance from your local applications developers and database
administrators. You can also contact Service Manager Customer Support for help with
troubleshooting upgrade errors. For additional information and support, contact your
software sales representative.

Applications upgrade

You can upgrade your existing Service Manager applications to version 9.80
applications using the Upgrade Utility and resolving the differences between the two
versions.

What are applications?

Applications are the Service Manager modules and their related configuration files.
For example, Incident Management and Change Management are Service Manager
applications.

New features that require an applications upgrade

The following features provided by the release of Service Manager 9.80 require an
applications upgrade.

     ALM Octane integration (provided since Service Manager 9.72)
     Microsoft Teams notification (provided since Service Manager 9.72)
     Integrate with UCMDB gateway in SM-UCMDB integration (provided since
     Service Manager 9.72)
     Microsoft Teams integration (provided since Service Manager 9.71)
     Background process high availability (provided since Service Manager 9.71)
     Feature Tracker (provided since Service Manager 9.70)
     SLM Visualization (provided since Service Manager 9.70)


     Database Report (provided since Service Manager 9.70)
     Scorecard (provided since Service Manager 9.70)
     Native Release Control (provided since Service Manager 9.62)
     Smart Analytics Smart Ticket tuning toolkit (provided since Service Manager
     9.60)
     Smart Analytics search accuracy improvement (provided since Service Manager
     9.60)
     Process Designer framework
     Mobile Applications
     Case exchange
     Smart email
     Service Portal (provided since Service Manager 9.50)
     Enhanced Service Desk, Incident Management, Problem Management, Change
     Management, Request Fulfillment Management, Service Catalog Management
     (provided since Service Manager 9.50), and Service Level Management based
     on Process Designer (provided since Service Manager 9.40)
     Simplified interaction (provided since Service Manager 9.41)
     Logical Name (provided since Service Manager 9.41)
     Smart Search (provided since Service Manager 9.41)
     Service Manager Collaboration (provided since Service Manager 9.41)
     Accessibility for the embedded Service Manager Calendar
     Service Manager Reports (provided since Service Manager 9.40)
     Service Manager Survey (provided since Service Manager 9.40)
     Smart Analytics (provided since Service Manager 9.40)
     Entity Relationship Diagram (ERD and Data integrity check) (provided since
     Service Manager 9.40)

Applications upgrade lifecycle

You can use three environments to complete the upgrade process: your current
production environment, a new development environment, and a new test
environment. You will duplicate your production environment to create the
development and test environments. Run the out-of-box upgrade and create the
custom upgrade on the development environment, and then run and test the custom
upgrade on the test environment before you apply it to your production environment.
The figure below provides an overview of the steps in the upgrade process.

The following flow chart illustrates the lifecycle of a typical upgrade of Service
Manager applications.


Upgrade phases and sub-phases

The following table describes the phases and sub-phases in the entire applications
upgrade lifecycle. These sub-phases are logged in the upgrade log files during the
upgrade. When an error occurs, the log files can help you find out during which phase
and sub-phase the error occurs.

Phase                                                                                           Service Manager 9.81
Planning and preparation
Running an out-of-box upgrade           Sub-phases

Creating a custom upgrade                    Load Transfer

                                             Pre Upgrade Action Check
                                             Pre Upgrade Action Update
                                             Pre Upgrade Action Purge
                                             Pre Upgrade Action
                                             Load Upgrade File
                                             Upgrade Dbdicts
                                             Load Upgrading Data
                                             Upgrade Data
                                             Post Upgrade Action
                                             Post Upgrade Action Prior to
                                             SM940
                                             Post Upgrade Action Prior to
                                             SM950
                                             Post Upgrade Action Prior to
                                             SM960
                                             Post Upgrade Action Auto Merge
                                             Post Upgrade Action Purge
                                             Post Upgrade Action Update
                                             Post Upgrade Action Notification
                                             Post Upgrade Action Restore

                                             Pre Create Action Check
                                             Build Signatures
                                             Build Distribution
                                             Export Data
                                             Transfer Data

Phase                                                                                           Service Manager 9.81
Applying the custom upgrade
                                        Sub-phases

                                             Pre Upgrade Action Check
                                             Pre Upgrade Action Update
                                             Pre Upgrade Action Purge
                                             Pre Upgrade Action
                                             Load Upgrade File
                                             Upgrade Dbdicts
                                             Load Upgrading Data
                                             Upgrade Data
                                             Post Upgrade Action
                                             Post Upgrade Action Prior to
                                             SM940
                                             Post Upgrade Action Prior to
                                             SM950
                                             Post Upgrade Action Prior to
                                             SM960
                                             Post Upgrade Action Purge
                                             Post Upgrade Action Update
                                             Post Upgrade Action Notification
                                             Post Upgrade Action Restore

            Note

           If you are upgrading from SM9.6x, there are no such sub-phases.

How does customization affect the upgrade
process?

The following explains how customization affects the upgrade process.

Conflicts

Object changes: The Upgrade Utility compares the objects in your database with
their out-of-box versions and the corresponding objects provided from the upgrade
package. The Upgrade Utility compares objects by their signatures. Each data record
in Service Manager has a unique signature, which changes once that data record is
updated. When processing object changes, the Upgrade Utility behaves as described
in the following tables.

                                        Changed object         Service Manager 9.81

Object in DB has  OOB version of        Out-of-box      Custom upgrade
been tailored?    object matches        upgrade
                  upgrade
                  package?


Object in DB has  OOB version of        Out-of-box          Custom upgrade
been tailored?    object matches        upgrade
                  upgrade
Yes               package?              The Upgrade         The Upgrade
                                        Utility tries to    Utility marks the
                  No                    merge the object    object from the
                                        from the upgrade    upgrade package
                                        package with        as “Forced,” and
                                        your tailored       then copies the
                                        object. If the      object in its
                                        merge is            revision.
                                        successful, the
                                        Upgrade Utility
                                        marks the new
                                        merged object as
                                        "Auto Merged." If
                                        the merge fails,
                                        the Upgrade
                                        Utility marks the
                                        object as
                                        "Renamed." In
                                        both cases, the
                                        Upgrade Utility
                                        prefixes the
                                        object from the
                                        upgrade package
                                        with "NEW980,"
                                        and then copies
                                        the object to your
                                        database and
                                        prefixes that
                                        object as
                                        "PRE<version_nu
                                        mber>". For
                                        example, an
                                        object from
                                        applications
                                        version 9.31.0022


Object in DB has  OOB version of        Out-of-box          Custom upgrade
been tailored?    object matches        upgrade
                  upgrade
                  package?

                                        PDCP4 would be
                                        prefixed with
                                        "PRE9.31.0022_P
                                        DCP4".

Yes               Yes                   The Upgrade         The Upgrade
                                        Utility keeps your  Utility marks your
                                        local version,      local version
                                        even if your        object as “Already
                                        version has been    Current.”
                                        tailored and
                                        marks your local
                                        version as “Kept
                                        Customer”.

No                No                    The Upgrade         The Upgrade
                                        Utility overwrites  Utility marks the
                                        the object in your  object from the
                                        database with the   upgrade package
                                        object from the     as “Forced,” and
                                        upgrade package,    then copies the
                                        and marks the       object in its
                                        object as           revision.
                                        “Upgraded.”

No                Yes                   The Upgrade
                                        Utility marks the
                                        object as
                                        "Already Current"
                                        regardless of
                                        whether this is
                                        the first upgrade
                                        or a custom
                                        upgrade.


Object is added in ...                            Added object       Note
DB
                                        Behavior
Upgrade package
                                        The Upgrade Utility          The object in your
                                        always keeps your local      database doesn't have a
                                        version and does nothing     corresponding object
                                        else.                        from the upgrade
                                                                     package.

                                        The Upgrade Utility adds     The object from the
                                        the object to your           upgrade package
                                        database and marks the       doesn't have a
                                        object as "Added"            corresponding object
                                        regardless of whether        from your database.
                                        this the first upgrade or a
                                        custom upgrade.

Dbdict changes: The Upgrade Utility automatically adds new dbdict and merges new
fields to existing dbdicts. The Upgrade Utility doesn't delete any existing field. For
field and key changes, check "Field mapping changes" and "Key changes."

Field mapping changes: Normally the Upgrade Utility applies field mapping changes
automatically, but there may be some exceptions. For example, when a length change
is required, the Upgrade Utility automatically expands the length mapping. However, if
the field mapping is a LOB-type change, the Upgrade Utility will not the change the
type mapping. For detailed exceptions, check SQL Field Compare results before the
upgrade and the except.log file after the upgrade.

Key changes: Normally the Upgrade Utility applies key changes automatically, but
there may be some exceptions. For example, the Upgrade Utility automatically adds a
new key and updates the existing key of the pre-upgrade out-of-box version.
However, if a Unique key has been tailored, the Upgrade Utility will not apply the key
change. For detailed exceptions, check the SQL Unique Key Compare Results before
the upgrade and the except.log file after the upgrade.

Customization during upgrade

If any tailoring changes are made to your production system, for example, by applying
an applications "hot fix," after you have initiated the upgrade process, it is highly
recommended that you apply those same changes to the development system that's
being used for conflict resolution before you create the final custom upgrade
package. Or, these tailoring changes may be lost after the custom upgrade has been


applied to production, and any conflict resolution that needs to be done in a
production environment may slow down the production upgrade.

Upgrade Utility contents

The following table lists the files that are included in the Service Manager Upgrade
Utility.


File                                    List of Upgrade Utility files
AppUpgVersion.txt
                                                    Contents

                                        Contains Upgrade Utility version and
                                        build number information to help you
                                        identify which applications upgrade
                                        version you have available. For
                                        example:

                                        A version of "SM950-9.80.00xx
                                        v9.8000xx Upgrade Build 00xx"
                                        indicates the following:

                                             The Upgrade Utility upgrades
                                             Service Manager 9.50 and later
                                             releases to Service Manager 9.80.
                                             The Upgrade Utility version
                                             number is 9.80.00xx.
                                             The Upgrade Utility build number
                                             for this version is 00xx.
                                             The string of Application Version
                                             9.80.00xx Build MF indicates that
                                             Upgrade Utility is released for SM
                                             9.80.

package directory                       Files including upgrade data for all
                                        supported versions.
preupg.bin
                                        Files that allow you to access the
transfer.bin (in the package\<version>  various features of the Upgrade Utility.
folder)
upgrade.ver                             Files that allow for the execution of the
upgdbdct.dta                            upgrade.

                                        Version stamp for this upgrade.

                                        Temporary dbdicts needed for the SQL
                                        Compare process.

File                                                                                            Service Manager 9.81
DeltaMigrationTool.unl
BusinessPurgeTool.unl                   Contents
fileload.unl
                                        Files that allow you to run Delta
.zip (in the 3waymerge\oob folder)      Migration Tool.

                                        Files to allow you to run Business Data
                                        Purge Tool.

                                        If you are upgrading from version 9.30
                                        or 9.31, you need to import the
                                        fileload.unl file that's already in the
                                        Upgrade Utility package before loading
                                        pregupg.bin.

                                        Each zip file includes the XML
                                        representation of the objects that have
                                        been signatured in the pre-upgrade
                                        out-of-box version for the Three-Way
                                        Merge tool.


1.3.2. Applications upgrade paths

Service Manager 9.80 is available in two modes: Service Manager Codeless and
Service Manager Hybrid. The following diagram illustrates the recommended Service
Manager 9.80 applications upgrade paths. The paths and arrows symbolize direct
upgrades.


Service Manager Codeless

As of version 9.40, Service Manager Codeless incorporates the Process Designer
functionality that was available through content packs before, together with further
enhancements that aren't available to users of Service Manager Classic. Primarily,
this involves implementing Process Designer-based workflows for a number of
modules, including Change Management, Service Desk, Incident Management,
Problem Management, Request Fulfillment, Knowledge Management, and Service
Level Management.

            Note

           Process Designer is a graphical interface that enables you to develop the
           workflows that control the flow of a single record throughout its lifecycle
           within Service Manager, without being an expert in RAD programming.

Service Manager Codeless is available to customers who are installing Service
Manager for the first time or who are upgrading from the following scenarios:

     A Service Manager 9.3x system that has Process Designer Content Pack 9.30.3
     (PDCP4) applied
     A Service Manager 9.4x system (Codeless mode)
     A Service Manager 9.5x system (Codeless mode)
     A Service Manager 9.6x system (Codeless mode)
     A Service Manager 9.7x system (Codeless mode)

Service Manager Hybrid

Service Manager Hybrid is a mode of Service Manager in which Process Designer
technology is fully implemented, yet that allows you to continue using legacy
technology such as Format Control. Service Manager Hybrid eases the transition
between Service Manager Classic and Service Manager Codeless by enabling you to
continue to take advantage of your previous investments in legacy technology. This
mode is available to customers who are upgrading from the following scenarios:

     A Service Manager 9.3x system without PDCP installed
     A Service Manager 9.3x system that has Process Designer Content Pack 9.30.2
     (PDCP3) applied
     A Service Manager 9.4x system (Classic mode or Hybrid mode)
     A Service Manager 9.5x system (Hybrid mode)
     A Service Manager 9.5x system (Hybrid mode)
     A Service Manager 9.6x system (Hybrid mode)


     A Service Manager 9.7x system (Hybrid mode)

            Important

           Service Manager 9.80 doesn't support the following upgrades:

                Upgrade from SM9.3x with PDCP4 installed to SM9.80 Hybrid.
                Upgrade from SM9.4x Codeless to SM9.80 Hybrid.
                Upgrade from SM9.5x Codeless to SM9.80 Hybrid.
                Upgrade from SM9.6x Codeless to SM9.80 Hybrid.
                Upgrade from SM9.7x Codeless to SM9.80 Hybrid.

           Meanwhile, Service Manager 9.80 doesn't support the following direct
           upgrades:

                Direct upgrade from SC6.2/SM7.0x to SM9.80 Hybrid/Codeless.
                Direct upgrade from SM7.1x/SM9.2x to SM9.80 Hybrid/Codeless.
                Direct upgrade from SM9.3x without PDCP installed/SM9.3x with
                PDCP2 installed/SM9.3x with PDCP3 installed to SM9.80 Codeless.
                Direct upgrade from SM9.4x Classic to SM9.80 Codeless.
                Direct upgrade from SM9.4x Hybrid to SM9.80 Codeless.
                Direct upgrade from SM9.5x Hybrid to SM9.80 Codeless.
                Direct upgrade from SM9.6x Hybrid to SM9.80 Codeless.
                Direct upgrade from SM9.7x Hybrid to SM9.80 Codeless.

After you upgrade to Service Manager 9.80 applications, refer to Service Manager
support matrix for a list of supported databases. If your existing database isn't
supported, upgrade your database by following the instructions in your specific
database documentation.

Recommended upgrade order to Service Manager
9.80

   1. Install the Service Manager 9.80 server.
   2. Install the Service Manager 9.80 Windows and web clients.
   3. Upgrade to the Service Manager 9.80 applications using Service Manager 9.80

     Upgrade Utility.
   4. Install or upgrade other components.

Migration procedure from Service Manager 9.80
Hybrid to 9.80 Codeless


Service Manager Hybrid has all the necessary prerequisites and you can migrate it to
Service Manager Codeless.

            Note

                If your applications version is earlier than 9.31 and has Process
                Designer Content Pack installed, you must first upgrade the
                applications to version 9.31 before you can further upgrade to
                Service Manager 9.80 Hybrid.
                If your Service Manager system has Process Designer Content Pack
                9.30.1 (PDCP2) installed, you must first upgrade to Process Designer
                Content Pack 9.30.2 (PDCP3) before you can further upgrade to
                Service Manager 9.80 Hybrid. For more information about how to
                upgrade from PDCP2 to PDCP3, refer to AppPatchManager_CI.pdf in
                the release package of Process Designer Content Pack 9.30.2 at
                Process Designer Content Packs for Service Manager.


1.3.3. Applications upgrade process

The following diagram illustrates the upgrade process.

The high-level steps of the applications upgrade process are explained as follows. For
more detailed information of each step, see Applications upgrade overview.

Step 1. Create a development system by duplicating
your production system.

You will run an out-of-box upgrade on this system, and then fix errors and resolve
conflicts. Make sure the development system meets the requirements in the support


matrix of the target upgrade version, and copy your production data to the
development system.

Step 2. Prepare the development system for an
upgrade

Prepare the data and binaries (server and client) of the development system for an
upgrade.

   1. Purge and archive unnecessary data to optimize upgrade performance.

     Purge and archive unnecessary data in the following files (which may contain
     large amounts of data): mail, msglog, syslog, spool, eventin, eventout, schedule,
     sysperform, and devaudit (on a production system, development auditing should
     be turned off).

     For information about purging and archiving records, see the Service Manager
     Help Center.

   2. Meet database requirements.

        1. Keep the table space name same as the production system for an Oracle
           database.

        2. Convert all column names to uppercase for a case-sensitive database.
        3. Remove some indexes and constraints.
   3. Upgrade your Service Manager server and client to the latest version.

   4. Update the server configuration files (sm.cfg and sm.ini).

     Before running the Upgrade Utility, you need to make changes to the Service
     Manager configuration files. Record all changes that you have made so that you
     can revert them to the original status after the upgrade.

Step 3. Run an out-of-box upgrade on the
development system.

   1. Check the size of the applications upgrade data, and compare it with the out-of-
     box upgrade package to make sure the downloaded data has no problems.

   2. Load applications upgrade file preupg.bin from the out-of-box upgrade package.
   3. Sign out and then sign in again.
   4. Apply the out-of-box upgrade package to the development system.
   5. Sign out, restart the server, and then sign back in.


Step 4. Conflict resolution on the development
system.

   1. Fix all exceptions in the except.log file, and verify your fixes.
   2. Resolve all conflicts in the upgraderesults table, and verify your conflict

     resolution results.
   3. Perform additional manual tasks.

Step 5. Functional testing on the development
system.

Return the development system to normal operation, and test the upgraded
development system.

Step 6. Create a custom upgrade package in the
development system.

Now you have resolved all the exceptions and conflicts. It is necessary to package all
the reconciled objects together into a "custom upgrade" so that they can be moved
into the production environment automatically.

Step 7. Create a test system by duplicating your
production system.

You need to apply the newly-created custom upgrade to your test system for user
acceptance testing. Make sure the test system meets the requirements in the support
matrix of the target upgrade version, and then copy your production data to the test
system.

Step 8. Prepare the test system for an upgrade.

Follow the same steps for the development system, as described in step 2.

Step 9. Apply the custom upgrade package to the
test system.

   1. Upgrade the Service Manager server and client to the latest version for your test
     system.

   2. Load applications upgrade file preupg.bin from the custom upgrade package.
   3. Sign out and then sign in again.
   4. Apply the custom upgrade package to the test system.
   5. Fix all exceptions in the except.log file, and verify your fixes.


   6. Resolve all "Error" results in the upgraderesults table, and verify your resolution
     results.

Step 10. User acceptance testing on the test
system.

Return the test system to normal operation, and test the custom upgrade.

Test all features that your users will access. Pay particular attention to areas that were
modified on your system.

Step 11: (Optional) Fixing errors in the development
system.

If there are errors found in the test system, fix them in the development system and
then go to step 6.

Step 12. Prepare the production system for an
upgrade.

Follow the same steps for the development system, as described in step 2.

Step 13. Apply the custom upgrade package to your
production system.

Make sure you have thoroughly tested the custom upgrade, before you apply the
newly-created custom upgrade to your production system. This process is identical to
the one you followed when applying your upgrade to your test system.

            Note

           The production system should not be available to users while you are
           applying the custom upgrade.


1.3.4. Planning an upgrade

Good planning allows your upgrade to run as smoothly and quickly as possible, and
helps you to avoid retracing your steps. When preparing for your upgrade, you will
need to consider how long each step will take and when users need to be logged off
the system so that you can schedule each phase of your upgrade.

Step 1: Identify the upgrade resources

Make sure that you have access to the following resources

     Service Manager tools: The utilities you will use most during the upgrade
     process include Database Manager and Forms Designer.
     Documentation resources: See Install for client/server installation instructions
     and Service Manager knowledge.
     Software Support: The Software Support web site has operating system and
     compatibility information, product documentation, and release notes.

Step 2: Meet the software requirements

Before you start your upgrade, make sure that you meet the following Service
Manager system requirements:

     Your RDBMS version, operating system, and client/server environment must
     meet all criteria listed in the Support Matrix for the target version. See Support
     matrix.
     To directly upgrade your existing applications to Service Manager 9.80, your
     existing Service Manager applications release level must be one of the following:

           Service Manager 9.3x without Process Designer installed
           Service Manager 9.31 or later with Process Designer Content Pack 9.30.2
           or 9.30.3 installed
           Service Manager 9.4x Classic, Codeless, or Hybrid
           Service Manager 9.5x Codeless, or Hybrid
           Service Manager 9.6x Codeless, or Hybrid
           Service Manager 9.7x Codeless, or Hybrid
     The Service Manager server process (sm) must have read-write access to the
     database.

Backups

It is highly recommended, at a minimum, that you back up the database at the
following strategic points in the upgrade lifecycle:


     After applying an upgrade
     After resolving conflicts

NFS-mounted partitions

Do not install either Service Manager or the Service Manager Upgrade Utility on an
NFS-mounted remote partition. This can cause serious performance degradation. The
performance of an NFS-mounted partition drops significantly if it reads data in many
small pieces instead of one large chunk. Service Manager generates a lot of database
read/write activity. An NFS-mounted partition is significantly slower than a local drive
when running the Upgrade Utility process.

Step 3: Perform a system health check

A well-maintained production system is the easiest to upgrade. Before starting the
upgrade process, perform all regular maintenance on your production system. If
necessary, contact Customer Support for recommended actions. Suspend all
customization activity on the production system.

Step 4: Create development and test environments

Plan to have at least two copies of your existing production environment:

     A development system that mirrors your current production environment. Use
     the development system to run the out-of-box upgrade and build a custom
     upgrade.
     A test system that mirrors your current production environment. Apply the
     custom upgrade on the test system and verify it there.

Step 5: Develop an upgrade strategy

In standard Service Manager terminology:

     Customization refers to changes to RAD applications.
     Tailoring refers to changes made by using Service Manager tailoring tools, such
     as Forms Designer and Format Control.
     Configuration refers to local settings (for example, in your environment records
     and the system information record).

The upgrade process affects different parts of the Service Manager system. Besides
upgrading the standard Service Manager applications, an upgrade affects the RDBMS
where Service Manager is running and any customized files or RAD applications. For
more information, see How does customization affect the upgrade process?.


Tailored systems

A list of tailored files can help you resolve differences quickly between your existing
files and new files. You can also use the SQL Compare utility to determine how dbdict
files differ.

To list all upgrade files, click Tailoring > Differential Upgrade > Patch Records.
Select UPGRADE in the drop-down list and then press Enter.

RDBMS-mapped systems

Because Service Manager tables (data files) must be mapped to an RDBMS, you must
choose one of the following options before beginning the upgrade:

     Allow the Upgrade Utility to modify your RDBMS tables for you.
     Use SQL Compare utility to generate dbdict difference report and manually
     update the RDBMS databases before beginning the upgrade process.

The upgrade can affect certain mappings and tables. Contact your database
administrator for assistance and to discuss the impact on the RDBMS.

Localized systems

You can upgrade a localized system with the Upgrade Utility. Before you begin to
upgrade a localized system, ensure that you have the correct language pack for the
language to which you will be upgrading. For more information and instructions on
how to install the language pack, refer to Install language packs. The Upgrade Utility
detects the presence of a localized system and runs the upgrade just as it would for
an English system. You will have to make any customization and tailoring changes,
based on the requirements described in this document for each of your system
configurations.

Customized RAD applications and ScriptLibrary records

A list of customized RAD applications and ScriptLibrary records and the extent of the
customization is useful. If it is unavailable, the programmer who made the changes
may be able to supply information. Or, you may need to run a comparison between
the existing applications or script and the new version.

Step 6: Meet database requirements

Before upgrading your system, verify that your system is pointing to the correct
database.

Convert all tables and fields from lowercase to uppercase


Service Manager doesn't generate lowercase table names or field names. Therefore,
if your database is case-sensitive, you must convert all tables and fields from
lowercase to uppercase before you can upgrade the server and client or applications.

            Note

           For Oracle users, you must have a granted role that includes “connect”
           and “resource” along with a granted system privilege of “select any
           dictionary” as a minimum in order to avoid errors generated by Oracle.
````
