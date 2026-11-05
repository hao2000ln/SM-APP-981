---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1 .. 1.1.1
printed_pages: 1-32
---

# 1 Develop

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1. Develop

Tailoring
Programming
Document Engine
Web Services
SMIS
Tailoring best practices
Process Designer tailoring best practices
Wizards
Processes and best practices
Database reports
Service Manager third-party components


1.1. Tailoring

Service Manager Tailoring has information for System Administrators and
implementers who install and configure Service Manager. Use Service Manager
Tailoring to make further changes to support site-specific requirements, including
special field validation, new or modified forms design, expanded or varied workflow,
and automatic notifications.

Tailoring is any change to standard functionality without changing actual code. For
example, you can:

     Change the look and operation of forms.
     Change default values for objects on forms that Service Manager uses for field
     validation.
     Create macros, scripts, and stored queries.
     Make changes to record definitions.

            Important

           Service Manager doesn't support excessive tailoring such as changing
           the user access of a module. For example, the Incident Management
           module is intended for power users only; if you tailor your system to make
           this module accessible through the employee self-service (ESS) interface,
           unpredictable results could occur to your system. For more information
           about the Windows client and different web client views, as well as their
           target user groups, see Service Manager Web tier.

Related topics

Environment configuration
Data management
Form creation
Links
Display functions
Advanced functions
Integrations
Service Manager Programming


1.1.1. Environment configuration

A complete Service Manager environment consists of at least three different
instances of Service Manager:

     A development instance, which is used to customize Service Manager to the
     exact needs of the customer
     A test instance, which is used to test these changes in a copy of the production
     system before promoting the customizations into production
     The production instance itself

These topics focus on environment configuration options within the system. The main
utilities that enable environment configuration are:

     Development auditing — tracks changes to records during the development
     phase of implementation.
     Differential Upgrade — moves changes from a development environment into a
     test or production environment.
     Document Engine — defines processing rules for files.
     Revision control — reverts to a previous version of a file or format.
     Wizard creation tool — simplifies repetitive tasks.

Related topics

Tailoring
Tools to use for promoting customizations
Development auditing
Revision control
Differential Upgrade utility
Unload script utility
Document Engine
Wizards


1.1.1.1. Tools to use for promoting
customization

Service Manager offers the system developer different tools to make the transitions
from development to test, and from test to production, easier.

     Development auditing
     Unload script utility
     Differential Upgrade utility
     Revision control
     Change Management

Comparison of the tools to use for promoting
customization

Each method of promoting customization has advantages and disadvantages. The
following table compares what each method is capable of providing.

Note: Manual processing involves writing down each change as it is being made, and
then unloading records one-by-one manually via the Service Manager Database
Manager. Manually unloading each record takes a lot of time and is prone to errors.


Ability       Development Unload script Differential           Manual
                                                               Processing
              auditing                  utility    Upgrade

                                                   Utility

Can monitor No. Hard-                   Yes        Yes         Yes

all files?    coded list of

              tailoring files

Possible to By date only Yes                       Yes         Yes

specify a

detailed

query?

Can select Yes, by                      No         Yes         No

and deselect removing

records to records from

unload?       the devaudit

              file

Can do        No                        No         Yes on fields, Yes, by

dbdict field                                       but not on  changing the

merge?                                             keys        dbdict load

                                                               option

Are changes All                         Latest     Latest      Latest
to the record
included in
unload?

Performance Poor                        Good       Excellent   Fair
Ranking,
includes
creating and
applying
patch

Ranking by Good                         Excellent  Fair        Poor

ease of use


Ability      Development Unload script Differential       Manual
                                                          Processing
             auditing                   utility  Upgrade
                                                          Poor
                                                 Utility

Ranking by Excellent                    Good     Fair

ease to set

up

Related topics

Development auditing
Unload script utility
Differential Upgrade utility
Revision control


1.1.1.1.1. Development auditing

Applies to User Roles: System Administrator

The development auditing utility (devaudit) tracks changes made to Service Manager
records during the development phase of Service Manager implementation. Whether
you make a few changes or extensively customize your system, it is critical to have a
record of your changes to ensure loading of the correct version when you move to
production. With it, you can create an unload of your changes, and load them into
another system.

            Note

           The Differential Upgrade utility is a more powerful and flexible tool for this
           purpose. We recommend that you use it instead of the development
           auditing.

Though the auditing utility helps you find modified records, strongly recommends that
you record each change more extensively either using tools outside of Service
Manager or using the Revision control feature.

The development auditing utility tracks changes to the following files:

     application
     code
     datadict
     devaudit
     displayevent
     displayoption
     displayscreen
     enclapplication
     eventfilter
     eventmap
     eventregister
     format
     formatctrl
     joindef
     link
     menu
     Object
     Process


     querystored
     scmessage
     screlconfig
     scripts
     States
     trigger
     validity
     wizard

Access the development auditing utility

To access the development auditing utility:

   1. Click Tailoring > Audit.
   2. Select a function from the Audit menu.

           Audit Log: The repository for data gathered during the audit. It displays the
           old and new values of input field data, as well as who made the revisions
           and when.
           Audit Specifications: Provides instructions on how and when to perform
           an audit. Use it to define files and fields that you want the audit application
           to monitor.
           Purge Audit History: After the development phase is completed and all
           related changes have been transferred into the production system, you can
           purge the development audit data. Ensure you carefully review the audit
           records in the Audit History record list before filling in the date to purge
           files, as you can't restore purged files.
           Turn Auditing On/Off: Enable or disable file auditing. If auditing is on, the
           system creates a separate audit record each time you make a change to a
           record and saves it to the database. Service Manager contains a default set
           of audit records to enable you to track development changes.
           Unload an Audit Delta: Unload a change you made during the development
           phase. It is critical that you check the audit files for the correct date of this
           delta. You need the date shown in the Audit History form to enter into the
           Unload form. When the Audit Unload form opens, the current date and time
           automatically fill in the Unload delta since what date? field. Type the
           beginning date for the unload that's found in the View Audit History record
           list.
           View Audit History: Search for a particular audit record or view a record
           list of all audits stored in the database from the Audit History form. It is
           important to look at this file before purging audit records or unloading a
           development change to production.


Turn the auditing on/off

This function enables you to enable or disable file auditing. If auditing is on, the
system creates a separate audit record each time you make a change to a record and
save it to the database. Service Manager contains a default set of audit records to
enable you to track development changes.

   1. Click Tailoring > Audit > Turn Auditing On/Off.
   2. Update one or more of the following functions:

           Do you want to audit development changes?: Enables/disables auditing of
           development changes. When selected, development auditing tracks the
           changes you make. You can put those changes into an unload file and load
           them into another system.
           Do you want to keep backups of Changes?: Enables/disables backups of
           development changes. When selected, development auditing creates a
           copy of the record you changed in the same table. The name of the backup
           record is prefaced with AUDIT and the number of the audit record and key.
           Restores the originals by renaming them to the original file name.
           Do you want to create auditdelete records on unload?: Enables/disables
           creating auditdelete records on unload. When selected, development
           auditing tracks your deletes, and the unload file makes the same deletes
           when you load it into another system.
   3. Click Save and OK.

Best practices

Auditing should always be disabled on a production or test system, and enabled for
development systems (when auditing is used to promote from development to
production).

When selecting auditing settings for a development system:

     Select Do you want to audit development changes?
     Uncheck Do you want to keep backups of changes?
     Uncheck Do you want to create auditdelete records on unload?

View the audit history

Search for a particular audit record or view a record list of all audits stored in the
database from the Audit History form. It is important to look at this file before purging
audit records or unloading a development change to production.


If some of the records should not be added to the auditing delta unload, you can
either change the search criteria of these records (such as changing the date to an
earlier date) or delete the record altogether if it should never be part of the delta and
doesn't need to be documented as changed.

Note: Be aware that the same record may be included in the devaudit file several
times, since each change to a record is noted in devaudit.

   1. Click Tailoring > Audit > View Audit History.
     A blank Audit History record opens.

   2. Open an existing Audit record using one of the following procedures:

           Enter any information you have from the record and click Search.
           Click Search or press Enter. If more than one record matches the search
           criteria, the result screen is split with a record list at the top and the first
           record in the list open below.

     Note: There is an entry for each time you add or update a form or file.

   3. Click the entry you want to view. Information for this record is entered into the
     Audit History form.

   4. Click Delete to remove the current record from the audit list.

The records have the following structure:

     Audit ID: 1
     Filename: format
     Keys: IM.update.incident
     Event Type: update
     Date: 01/14/10 12:31:29
     Operator: falcon
     Last Record: true

Unload an audit delta

To specify what the system unloads, you must first view the audit history. Remove
records from the development audit list by selecting them and then deleting them.

Important: Before unloading a change you made during the development phase, it is
critical that you check the audit files for the correct date of this delta. You need the
date shown in the Audit History form to enter into the Unload form.

To unload the audit delta:


   1. Click Tailoring > Audit > Unload an Audit Delta.
     The Audit Unload form opens, and the current date and time automatically fill in
     the Unload delta since what date? field.

   2. Type the beginning date for the unload that's found in the View Audit History
     record list.

   3. Type the path and file name that you want to send the unloaded data in the Send
     Data to Which File? field.

   4. Type the path and file name of the log for the audit unload process in the Enter
     Log Name Here field.

   5. Click Proceed. The Development Auditor menu opens with a message in the
     status bar indicating how many records were unloaded.

The unload you create can be loaded into the test system, and eventually into the
production system.

Note: You can view the contents of an unload file in Database Manager before
loading it onto the new system.

To view the contents of an unload file:

   1. Open Database Manager.
   2. Select Import/Load from the More Actions menu.
   3. Select the file you want to load.
   4. Click View Contents.

Purge audit records

After the development phase is completed and all related changes have been
transferred into the production system, you can purge the development audit data.
You are prompted to specify the start date for records to be purged. After the data is
purged, it can't be restored (unless an unload of the devaudit file was performed
beforehand).

To purge audit records:

   1. Click Tailoring > Audit > Purge Audit History.
     The Audit Purge form opens with the current date and time filled in.

   2. Replace the date displayed with the beginning date for the range of records you
     want to delete.

     Warning: Ensure that you carefully review the audit records in the Audit History
     record list before filling in this date. You can't restore purged files.


   3. Click Proceed. A confirmation prompt opens informing you how many records
     have been purged.

   4. Click OK to complete the process and return to the Development Auditor menu.

Contents

     1 Access the development auditing utility
     2 Turn the auditing on/off
     3 View the audit history
     4 Unload an audit delta
     5 Purge audit records


1.1.1.1.2. Unload script utility

The unload script utility enables system administrators to create Service Manager
unload files automatically. The unload script utility enhances the standard unload
creation process in many ways. With unload scripts, you can:

     Save records from multiple tables into a single unload file.
     Specify a query for each source table that filters the records added to the
     unload file.
     Purge records during the unload process.
     Specify which formats to protect during a purge process.
     Add related records from the data map file to the unload file.

The unload script utility is available in Tailoring. By default, Service Manager includes
a collection of unload scripts that you can use for common unload tasks. You can also
use the default unload scripts as templates to create your own customized unload
scripts.

To create and use unload scripts effectively, you must be familiar with the Service
Manager Database Manager. You can create a query on any field in the file, but
querying keyed fields improves system performance and response time. You can
create record queries using Structured Query Language (SQL) syntax.

You can use the Purge/Archive utility to unload and purge records from one file; if you
use datamaps, you can use Purge/Archive to unload and purge related records as
well.

After you load a .unl file to import data into Service Manager, you must stop and then
restart the Service Manager server. This ensures that the table changes are initialized.

Note: The Unload Script utility unloads tables using the binary unload file format.

Related topics

Tools to use for promoting customizations
Data maps
Environment configuration
Exporting records
Importing records
Purging and archiving records
Using data maps to purge and archive records
Add an unload script record
Protect forms from the unload script utility


Purge records with the unload script utility
Run an unload script
Validate an unload script record


1.1.1.1.3. Differential Upgrade utility

The Service Manager Differential Upgrade utility enables a developer to compare the
specified files of two Service Manager systems to create a single unload file. The
resulting unload file contains all the necessary records to make the files identical
between the two systems.

The Differential Upgrade utility simplifies the way you move changes from a
development environment into a test or production environment. You can also use this
utility to move files between any two systems, such as:

     Development and test
     Unit testing and acceptance testing
     Two different development systems

Important: We recommend that you understand how to export files and create
different types of unload files before you use the Differential Upgrade utility.

The Differential Upgrade utility, just like the upgrade utility that upgrades applications
from one version to another, relies on patch records and signatures. For more
information on how to use the Differential Upgrade utility, see the Service Manager
online Help topics under "Application Development - Differential Upgrade utility."

Related topics

Environment configuration
Tools to use for promoting customizations
Patch records
Signature records
Checklist: Differential upgrade steps
Load an unload file


1.1.1.1.3.1. Patch records

A patch record specifies which files the Differential Upgrade utility should compare,
and creates a query that limits the comparison to certain records within files. There
must be a patch record for each system in the comparison.

Note: The query should limit the number of records to upgrade. The more files in the
patch record, the longer the Differential Upgrade process takes.

In a Differential upgrade comparison, you must have one patch record for each
system to be compared. The patch record must point to identical files in each target
system and generate the same queries. You can either create it once on each system;
or create it on one system, unload it, and load it into the other system. You may prefer
to create customized patch records before you start the Differential Upgrade process.

Note: Be sure to include all files that were modified during customizations that you
promote to production.

One method of limiting the number of records included in the patch record is to use
the sysmodtime field that many dbdicts contain. Service Manager updates this field
automatically with each update of the record. If the file doesn't contain a
sysmodtime field, you can either add it before starting the customization work on
the development system, or use another limiting field such as update.time .

In the Patch record dialog box, you can specify that the Differential upgrade should
perform Add only processing on a specific file. If you choose this option, Service
Manager adds only new records to the Differential upgrade unload file and ignores
changes to existing records in the development system.

Related topics

Environment configuration
Tools to use for promoting customizations
Differential Upgrade utility
Signature records
Checklist: Differential upgrade steps
Load an unload file


1.1.1.1.3.2. Signature records

A signature for an Service Manager record is a numerical representation of the
record. Any change to the contents of the record causes the signature of that record
to change, based on the definitions in the signaturemake file.

You must create signature records for any record that you compare in the Differential
Upgrade process. The signatures file contains signature records.

Important: Never change a record in the signaturemake file.

Related topics

Environment configuration
Tools to use for promoting customization
Differential Upgrade utility
Patch records
Checklist: Differential upgrade steps
Load an unload file


1.1.1.1.3.3. Checklist: Differential upgrade
steps

Applying a Differential upgrade from a development system to a production system
requires these steps:

   1. Create separate Patch records for the development and production systems.
     The patch records must reference the same files on each system.

   2. Create Signature records for the production (target) system.
   3. Move Signature records to the development system.
   4. Create the Differential upgrade from the development (source) system. You can

     create an external unload file or an internal file.
   5. Customize the Differential upgrade unload files. This is optional if you created an

     internal file.
   6. Create a differential upgrade unload from internal files.
   7. Load the Differential upgrade unload into the production (target) system.

Create or update a Patch record

Applies to User Roles: System Administrator
To create or update a Patch record:

   1. Click Tailoring > Differential Upgrade > Patch Records.
   2. Type the name of the Patch record in the Patch Name text box.
   3. Type a query (or false) in the Application Clusters text box. For

     example: application ="app_name"
   4. Type a query (or false) in the Format Records text box. For example: name

     ="format_name"
   5. Type the names of files to be included in the Patch record in the Dbdict fields.
   6. Click the Add checkbox if you want to Add new records only. Otherwise, the

     Differential Upgrade utility processes both updated and new records.
   7. Type true, false, or an advanced query in the Query field for each file. True

     includes all records from the file; false doesn't return any records. An advanced


     query enables you to customize the results.

   8. For a new Patch record, click Add.

   9. To update a Patch record, click Save.

 10. Click OK.

There must be a Patch record for each system in the comparison. Each patch record
must point to the same files and records. You can create it once on each system, or
create it on one system, unload it, and load it into the other system.

Create Signature records on the production system

Applies to User Roles: System Administrator

To create Signature records on the production system:

   1. Click Tailoring > Differential Upgrade > Differential Upgrade Wizard.

   2. Click Build Signatures.

   3. Click Next.

   4. Type the name of the system in the System Name text box. Remember the name
     because Service Manager uses it in later steps.

   5. Click the drop-down list to choose an existing Patch record for the named
     system. Remember that there must be a Patch record for each system to be
     compared, and each Patch record must point to the same files and records.

   6. Browse to locate or define the Export Filename. This is an external file that will
     store the signature records.

   7. Optionally, click Signature RAD components for delete processing to delete all
     related RAD panel components.

   8. Click Run in background if you want background processing. If you run in
     background, Service Manager creates a schedule record and creates the unload
     when the schedule record runs. If you choose Run in background, do the
     following:

          • Click Repeat Daily to create signature records daily. This step is optional.

          • Click the drop-down list to choose the Date/Time to Run schedule for
          background processing.

   9. Click Next.


If the process runs in background, the unload file will reside on the server. If the
process runs in foreground, the unload file location depends on whether you enable
the Client Side Load/Unload option on the client. Processes running in foreground
post progress messages in Active Notes, if that option is enabled.

Move Signature records to the development system

Follow these steps:

   1. Ensure the signatures file on the development system is empty.

   2. Load the signatures file on the development system using the standard Service
     Manager Import/Load utility.

If you choose background processing, Service Manager moves the signature records
automatically.

Create the Differential upgrade from the
development system

Applies to User Roles: System Administrator

To create the differential upgrade from the development system:

   1. Click Tailoring > Differential Upgrade > Differential Upgrade Wizard.

   2. Click Create Differential Upgrade.

   3. Click Next.

   4. Double-click the correct Patch record from the list of Patch records. This should
     be the same Patch record specified when you created the production Signature
     records.

   5. Type a descriptive name for the system you are building in Current Version.

   6. Type the descriptive name for the system you are upgrading in Compare to
     Version. This should be the System Name you specified when you built the
     Signature records.

   7. Optionally, select Perform Delete Processing to delete records in the target
     system.

   8. Decide whether you want to create an external or internal unload file. Depending
     on your choice, complete Step 9 or Step 10.


 9. To create an external unload file and a text file listing all records included in the
    unload file, click Create Unload and then click Next.

    Click Browse to locate a file, or define an Export Filename for the unload file
    containing the Differential Upgrade.

    Click Browse to locate a file, or define a Log Filename.

    Click Run in background if you want background processing. Service Manager
    creates a schedule record and creates the unload when the schedule record
    runs. If you choose Run in background, do the following:

        a. Click Repeat Daily to create signature records daily. This is an optional
        step.

        b. Click the drop-down list to choose the Date/Time to Run schedule for
        background processing.

        c. Click Browse to locate the Path to Signatures unload where the signature
        file resides. For background processing, the signatures unload file must be
        on the Service Manager server.

    Click Next. When the Differential upgrade is complete, the file named in Export
    Filename contains the information that aligns the production system with the
    development system. There will be a record for each difference between the
    development and production systems.

10. To add a record to the diffupg file for each record included in the upgrade,
    choose Create Internal File and then click Next.

    Click Run in background if you want background processing. If you run in
    background, Service Manager creates a schedule record and creates the unload
    when the schedule record runs. If you choose Run in background, do the
    following:

        a. Click Repeat Daily to create signature records daily. This is an optional
        step.

        b. Click the drop-down list to choose the Date/Time to Run schedule for
        background processing.

        c. Click Browse to locate the Path to Signatures unload where the signature
        file resides. For background processing, the signatures file must be on the
        Service Manager server.


     Click Next. When the Differential upgrade is complete, there is one record for
     each record included in the upgrade.

Customize the Differential upgrade unload file

Applies to User Roles: System Administrator
If you create an internal file, you can customize the unload file before processing
begins. You can page through the diffupg file to examine each record, and specify
whether it is to be included in the unload by selecting the Unload checkbox.
To customize the Differential upgrade unload file:

   1. Ensure that you complete the steps to run the Differential upgrade wizard and
     create an internal file.

   2. Click Tailoring > Differential Upgrade > Differential Upgrade Records.
   3. Click Search.
   4. Choose a record from the list of Differential upgrade records. Service Manager

     displays the record in the Differential Upgrade Results form.
   5. Select or clear the Unload? checkbox to include or exclude the record from the

     Differential upgrade process.
   6. Click Next.
   7. Repeat these steps until you page through all of the records in the file.

Note: Click Go To Record to view the complete record.

Create a differential upgrade unload from an
internal file

Applies to User Roles: System Administrator
To create a baseline revision:

   1. Click Tailoring > Differential Upgrade > Create Differential Unload.
   2. Type an Export Filename.
   3. Type the System Name. You are creating differential upgrade unload records for

     only this system. This is the name of the system listed in the differential upgrade
     records.
   4. Click Next to create the unload.


Load the Differential upgrade into the production
system

Use the standard Service Manager import/load utilities to load the Differential upgrade
unload file into your production system.


1.1.1.1.4. Revision control

Revision control provides developers and administrators with a means of reverting to
a previous version of a file or form. If during the process of creating or modifying
forms you find an error, revision control returns a working version of your file or form.

Revision control allows a developer to:

     Create a snapshot of a record
     Add SCR information and comments to the snapshot
     Replace the current version of the record with a working version of the record at
     any time.

            Note

           Every revision takes up as much disk space as the original record plus a
           few bytes for comments.

Use revision control in conjunction with development auditing to track, record, and
save changes to your system. The development auditing utility provides a record of
the changes to ensure that you load the correct version when you move to
production, whereas revision control documents these changes and enables you to
create working snapshots.

Service Manager handles revisions as part of the Document Engine. Revisions are
available in all utilities that use the Document Engine as base code, including
Database Manager, Format Control, Link Editor, Forms Designer, the RAD Editor, and
others.

The system stores revisions in a separate file whose name is specified in either the
object record for the file or in the datadict record. The system creates this revision file
via an option on the Data Policy or the object screen. Administrators specify the
maximum number of revisions to store for each record in a file. If you don't specify a
number, an unlimited number is stored.

Administrators need to determine in advance in which files to track revisions and then
do a minor setup to establish them. Administrators also need to purge revisions prior
to migrating to a production system.

Create revisions


The revisions option for Data Policy creates a revision database dictionary record,
whose name is specified on the Engine Specifications tab. You can create revisions
either for an entire set of records or for a single form or record. You must be at the
start panel of the application you are working with to create baseline revisions for an
entire set of records. For example, you create a baseline revision of all the forms in
the Forms Designer from the Forms Designer main menu.

When you create a revision, you create a copy of the record only, not the associated
database dictionary record. As a result, any time a field is added to a database
dictionary record, you add it to the revision file database dictionary record.

Create a baseline revision

Applies to User Roles: System Administrator

To create a baseline revision:

   1. Open a search screen for a form or file that supports revisions. For example, the
     Forms Designer application.

   2. Click More of the More Actions icon.
   3. Click Revision.
   4. Click Create Baseline Revision. A dialog box opens.
   5. Enter the SCR information or click Ok to begin.

The system creates a copy of all the records in the application, in this case every form
in the Forms Design application.

Create a single revision

Applies to User Roles: System Administrator

To create a single revision:

   1. Open a form or file that supports revisions. For example, a RAD application in the
     RAD editor.

   2. Click More of the More Actions icon.
   3. Click Create Revision. The revision tracking panel opens.
   4. Type in information relating to the revision. Make comments to help others

     understand the reason for the revision.
   5. Click Save.

A copy of the revision saves and you return to the main panel.

Revert to a previous revision


Applies to User Roles: System Administrator

To revert to a previous revision:

   1. Open the form you want to use a previous version of.
   2. Click More or the More Actions icon.
   3. Click Revision.
   4. Click Revisions > Find Revisions.
   5. Click the revision you want to restore.
   6. Click Revert to this Revision from the More Actions menu. The system prompts

     you as to whether you want to save the current version of the record as a
     revision. It is recommended you do.

Search for revisions

Applies to User Roles: System Administrator

To access the wizard creation tool:

   1. Open an application that supports revisions. For example, the RAD editor or the
     Forms Designer.

   2. Click More or the More Actions icon.

   3. Click Revision > Find Revision.

     You can search for revisions using one or more of up to five of the following
     search criteria:

           syslanguage — Search for revisions by language indicator. For example, en
           for English.
           name — Search for revisions by name. For example, cc.incquick.
           Revision Date — Search for revisions by date in the format month/day/year.
           Operator — Search for revisions by operator name. Enter the name of the
           operator that created the revision. For example, SYSTEM ADMINISTRATOR.
           SCR# — Search for revisions by SCR number. For example, 42.

Purge revisions

Applies to User Roles: System Administrator

Purge scripts help administrators with revision maintenance. The
sc.revision.purge.hanging script purges all revisions that no longer have a parent
record because the parent record was deleted or renamed. The sc.revision.purge
script purges all revisions from the system.


There are two options available when purging revisions.

To search for revisions:

     Purge All Revision Records removes all revisions from your system.
     Purge Hanging Revisions removes only hanging revisions from your system. A
     hanging revision is a revision with no associated file or form. For example, if you
     create a form, create a revision of the form and then delete the original form, the
     revision remains on the system but with no associated file or form.

            Note

           You can restore a deleted form from its revision file.

   1. Sign in as a System Administrator.
   2. Click System Administration > Base System Configuration > Miscellaneous >

     Purge Hanging Revision Records.
   3. To remove hanging revisions from your system, click Purge Hanging Revisions

     Records.
   4. To remove all revisions from your system, click Purge All Revision Records.


1.1.1.2. Best practices for promoting
customizations

The following items are vital in any environment for successful customization of
a Service Manager system:

     The process has to be defined and consistently applied.
     All changes have to be done in one system, the development system, and must
     be thoroughly documented.
     A single unload should contain all records that were customized. In some
     environments, many developers work on developing customizations. In such
     environments, a central system should be used to load the individual changes,
     using revision tracking. That central system can then be used to create the
     unload.
     All changes must be tested in a central system, the test system, and issues
     found there must be repaired in the development system.

Have a well-defined process

It is important that you have a well-defined and documented process for proceeding
from development through test into production. A well-defined process will promote
user satisfaction and prevent delays in the development cycle.

Document all changes

It is the best practice that you document each change made when you tailor the
system, regardless of how the promotion will be done.

Part of the development process should include documenting all changes. Changes
can be documented in an audit log that's stored outside of Service Manager, such as
in an Excel® spreadsheet.

Another possibility is to use Service Manager Change Management for keeping track
of all changes done during the development process.

Important: You must keep track of every change done to the development system, so
that no change is lost when creating the patch unload.

Create a single unload

After the customizations are completed on the development system, create a single
unload to apply to the test system.


Warning: If you create and apply multiple unloads, you increase the possibility that
records can be overwritten or lost.

Use a development system

Make all changes in the development system. Making changes in the test system or
directly to the production system will cause the systems to become out-of-sync and
more difficult to maintain. Applying changes to a system that's out-of-sync with the
system on which the changes were based will most likely result in broken
functionality.

Use a test system

Use a test system to apply the previously-created unloads and test their functionality.
If problems are found during these tests, they can be fixed in the development system
where a new unload will be created. Repeat this cycle until the test is successful.

After testing is complete, you can apply the tested unload to the production system.
Some companies require training before an unload is released to production. You can
apply the tested unload to a training system first, and then to production. The benefit
of having a single tested unload is that it can be applied to as many systems as
necessary.

Related topics

Environment configuration
Tools to use for promoting customizations
Development auditing
Differential Upgrade utility
Unload script utility
Revision control
Promote customizations from development to production


1.1.1.3. Promote customizations from
development to production

   1. Before you promote customizations from development to production, thoroughly
     document every change made in the development system that will need to be
     part of the patch that's promoted to production. The information that you collect
     in this documentation depends on the environment, but should at a minimum
     include the following fields, which are mentioned in the log file:
           Change Number
           Request Description
           Task Number
           Task Description
           Change Requester
           Change Owner
           Record modified
           Date Modified
           Change Description
           Unload Name
           Patch Name
           Test plan
     You can document changes either inside of Service Manager Change
     Management or by using an external program such as Microsoft Excel.

   2. Test all changes in the development system.
   3. After all changes are documented, tested, and functioning in the development

     system, create a single unload.
     We recommend that you:

        1. Remove the field "keys" from the exclude list in the signaturemake file for
           the dbdict table before creating the signatures on both production and
           development. That way, dbdicts that had changes to the keys will be
           unloaded into the file that's loaded into test and then production and these
           changes are easier to find.

        2. Use the Differential Upgrade utility to create a single unload file containing
           all changes.

        3. Manually modify all keys that were changed in any of the dbdicts contained
           in the unload

   4. After the single unload is created, perform the following steps:
        1. Apply it to a test system that's a recent copy of the production
           environment.
        2. Test the changes thoroughly.


     3. Document any reported issues and fix these in the development system
        after each test iteration.

     4. Provide a repaired patch file (while still using a single unload file) to the
        testers at the beginning of each test iteration.

5. After the unload is thoroughly tested and accepted, the latest unload can be
  applied to a production system or to any other system that needs to be
  upgraded with the patch, such as a training system.

         Note

        Do not modify the patch after this point. Address new issues found after
        testing is complete in the next development cycle.
````
