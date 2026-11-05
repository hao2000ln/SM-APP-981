---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.7.10.5.4 .. 1.7.10.7
printed_pages: 2198-2229
---

# 1.7.10.5.4 Import a character-delimited text file

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.7.10.5.4. Import a character-delimited
text file

Applies to User Roles: System Administrator
Before you import a character-delimited text file, you need to prepare your source file
and add a character-delimited import descriptor record first.
To import a character-delimited text file, follow these steps:

   1. Prepare the source file. The following table describes the rules that external
     source files must observe.


Rule                                    Note

Only plaint text files are supported.   Be sure to not load binary files, such
                                        as .JPG and .XLS files.
If the source data contains non-
ASCII characters, the external text
file must use UTF-8 or Unicode
encoding.

Column headers in the external file     CSV files with duplicate column
are mandatory and must be unique.       headers can't be imported. The
                                        wizard displays a warning on the
                                        duplicate columns and is not able to
                                        proceed.

                                        Make sure your source file contains
                                        column headers on the first line, and
                                        remove or rename duplicate
                                        columns as needed.

Column headers in source files          Column headers in source files are
should follow the JavaScript            used as JavaScript identifiers in this
Identifier Naming conventions.          feature.

If the number of values in a row        Make sure your source file doesn't
doesn't match the number of the         contain invalid rows.
column headers, the row is skipped.
For example, if your source file
contains 6 column headers, a row
with more or less than 6 values is
skipped.

When a source file is huge (more        You are recommended to split a

than 15, 000 lines or 10 MB in size), it huge file to smaller ones before

may take a long time to load the file. loading.


Rule                                    Note

Digit grouping is unsupported and       For example, "1, 000.000, 3" can't
only numbers in raw format can be       be correctly recognized.
imported.                               You must change it to "1000.0003".

Unique keys aren't automatically        Make sure that the records to import
generated during the import             match the data constraints that are
operation.                              defined in their dbdict.

Delimiters in external CSV files can    When a field value contains the
be one of the following:                delimiter character, enclose the
                                        value in double quotes.
     a comma
     a tab                              For example: "abc,def"
     a semicolon
     a user-defined character other
     than listed above

The following date formats are          Make sure all of your source data
supported for external source files:    uses the correct date format. You
                                        will need to specify the date format
     mm/dd/yy [hh:ii:ss]                later when adding an import
     yy/mm/dd [hh:ii:ss]                descriptor for the source file.
     dd/mm/yy [hh:ii:ss]
                                                    Note
            Note
                                                   After importing, the
           [hh:ii:ss] is optional.                 imported data is
                                                   converted to the login
                                                   user's date format.

2. Resolve necessary validations or dependencies first.


                   Note

                Triggers are enabled during importing. For this reason, you may
                need to resolve some validations or dependencies first. For example,
                before loading a contact record, an operator record should be
                loaded first. Otherwise, a message, for example, “No operator
                record to sync”, pops up.

   3. Launch the Text Import Wizard, and add an import descriptor record for the text
     file. For details, see Add an import descriptor record.

   4. Click Test to test the importing of records.
   5. Review the test results on the Test Import tab.

                   Note

                Only the first ten lines in the external file are tested.

   6. Click Proceed.
   7. Click Run.

     Service Manager imports the external file.

                   Note

                      Scheduled import is unsupported for character-delimited files.
                      Some joinfiles need to be loaded completely to achieve desired
                      data import results. For example, when loading service catalog
                      items, you need to load the service catalog display records
                      concurrently. Otherwise, the imported records aren't displayed
                      correctly in the catalog.

Example: Import Outlook contacts into the contacts
table

The following example describes how to import your Outlook contacts into the
contacts table.

   1. In Outlook 2010, export your contacts to a .csv file. To do this, follow these
     steps:
        1. Click File > Open > Export to open the Import and Export wizard form.


       2. Select Export to a file, and then click Next.

       3. Select Comma Separated Values (Windows), and then click Next.

       4. Select Contacts, and then click Next.
       5. Click Browse to specify the location and file name for your .csv file, and

          then click Next.

       6. Click Finish.

 2. In Service Manager, type db in the command line field, and then press Enter.
    Database Manager opens.

 3. Click More or the More Actions menu, and then select Text Import Wizard. The
    Import wizard form opens.

 4. In the File to import field, browse to your .csv file.
 5. In the Destination table drop-down list, type or select contacts.
 6. In the File Type drop-down list, select winnt.
 7. Click Search.
 8. If a descriptor for the contacts table exists, click New to create a descriptor for

    your import. Otherwise, the Creating a New Import Descriptor page
    automatically opens.

                 Note

               The Import Table field is automatically populated with contacts.

 9. In the Input File Type field, select Character-delimited, and then click Proceed.
10. In the Import Name field, specify a name for the descriptor (for example,

    Outlook Contacts Import), and then click Add.

                 Note

               If you want to delete an existing descriptor, see Add an import
               descriptor record

11. In the Import Mode drop-down list, select Add/Replace.
12. In the Delimiter radio button, select Other, and then select Comma. This is

    because your Outlook contacts were exported as Comma Separated Values. If
    this is not the case, specify another delimiter that was used to export your
    Outlook data.


Note

The default Delimiter is Comma. However, you need to select
another value and then select Comma again to activate the retrieval
of the source columns in your .csv file.

13. In the Format Control drop-down list, select fcContacts.
14. On the Fields tab, complete the field mapping table. The following is an example.

Field                                   Source Column
title                                   Job Title
contact.name                            First Name
email                                   E-mail Address
company                                 Company
manager                                 Manager's Name
location                                Location
dept                                    Department
portable.phone                          Mobile Phone

Note

Only the specified source columns are imported. Make sure that you
follow these rules, otherwise, errors occur. You can't specify a
duplicate field in the destination table. However, you can map a
source column to multiple fields. A field can't have an empty source
column mapped to it.

15. On the Advanced tab, add the following lines to the JavaScript box:


          target['contact.name']=source['First Name']+'.'+source['Last

          Name'];

          target['company']='HP1';

 16. Click Save.

 17. Click Proceed.

 18. Click Run.

     The import starts. When it has finished, a message is displayed indicating how
     many records have been successfully inserted. You can go to the contacts table
     to check the import results.

Related topics

Data maps
Exporting records
Importing records
Import descriptor records
Unload files
Purging and archiving records
Unload script utility
Add an import descriptor record
Import a fixed-width text file
Load an unload file
Schedule the importing of records using an import descriptor record
Schedule the loading of an unload file
View the contents of an unload file
Load error messages and notifications


1.7.10.5.5. Import a fixed-width text file

Applies to User roles: System Administrator

Before you import a fixed-width text file, you need to add a fixed-width import
descriptor record first.

To import a fixed-width text file, follow these steps:

   1. Add an import descriptor for the fixed-width text file. For details, see Add an
     import descriptor record

   2. Click Test to test the importing of records.
   3. On the Test Import tab, review the test results.

                   Note

                Only the first ten lines in the external file are tested.

   4. Click Proceed.
   5. Click Run.

     Service Manager imports the external file.

Related topics

Data maps
Exporting records
Importing records
Import descriptor records
Unload files
Purging and archiving records
Unload script utility
Add an import descriptor record
Import a character-delimited text file
Load an unload file
Schedule the importing of records using an import descriptor record
Schedule the loading of an unload file
View the contents of an unload file
Load error messages and notifications


1.7.10.5.6. Load an unload file

Applies to User roles: System Administrator
If your application version is 9.30 ap3, 9.31 or later, you are recommended to use
Unload Manager to load an unload file, because Unload Manager can help you create
a backup of your old data and reconcile conflicts during the installation of the unload;
if your application version is other than any of these, Unload Manager is unavailable
and you can use Database Manager instead.

            Note

           You can use the Unload Manager on Windows client only.

To load an unload file using Unload Manager, follow these steps:
   1. Go to System Administration > Ongoing Maintenance > Unload Manager.
   2. Double-click Apply Unload. A wizard opens.
   3. Select the unload file you want to apply, also specify a backup file, and then
     click Next. Details of the unload file appear.
   4. Double-click a conflicting object in the table to open the merge tool:
        1. Merge the object, and then select the Reconciled checkbox.
        2. Click Save to go back to the wizard.
   5. Click Next after all the conflicting objects are reconciled.
   6. Click Yes on the confirmation window to apply the unload.
   7. Click Finish.
     Now, the unload has been applied and at the same time your old data backed up.

To load an unload file using Database Manager, follow these steps:
   1. Click Tailoring > Database Manager.
   2. Click More or the More Actions menu, and select Import/Load.
   3. Fill in the following fields.


Field                                   Description
File Name
Import Descriptor                       Type the name and path of the file to
                                        load.
File Type
Messages Option — All Messages          Type the name of the optional Import
Messages Option — Totals Only           Descriptor record used to import
Messages Option — None                  records. Since unloads files don't
                                        require an Import Descriptor record,
                                        leave this field blank.

                                        Select the source operating system
                                        of the unload file.

                                        Select this option to see all
                                        messages that Service Manager
                                        generates loading the file.

                                        Select this option to see only the
                                        total number of files Service
                                        Manager loads.

                                        Select this option to hide all
                                        messages that Service Manager
                                        generates loading the file.

     Note: You can view the contents of an unload file before importing it by clicking
     List Contents.

   4. Click Load FG.

Related topics

Data maps
Exporting records
Import descriptor records
Importing records
Purging and archiving records
Unload files
Unload script utility
Add an import descriptor record


Import a character-delimited text file
Import a fixed-width text file
Schedule the importing of records using an import descriptor record
Schedule the loading of an unload file
View the contents of an unload file
Load error messages and notifications


1.7.10.5.7. Schedule the importing of
records using an import descriptor record

Applies to User roles: System Administrator

Before you schedule the importing of records, you may want to add an import
descriptor record first, refer to Add an import descriptor record.

To schedule the importing of records using an import descriptor record, follow these
steps:

   1. Open the import descriptor record you want to schedule, and then click
     Proceed.

   2. In the Expiration field, type the date and time when the scheduled import runs.

   3. To repeat at regular intervals, select one of the following options.

Field                                   Description
Repeat — Monthly
Repeat — Quarterly                      Select this option to repeat the
Repeat — Semi-Annually                  import process every once every
Repeat — Annually                       month from the Expiration date.

                                        Select this option to repeat the
                                        import process every once every
                                        quarter from the Expiration date.

                                        Select this option to repeat the
                                        import process every once every six
                                        months from the Expiration date.

                                        Select this option to repeat the
                                        import process every once every
                                        year from the Expiration date.

   4. Click Schedule.

Related topics

Data maps
Exporting records


Importing records
Import descriptor records
Unload files
Purging and archiving records
Unload script utility
Load/unload implications of case-sensitivity
Add an import descriptor record
Import a character-delimited text file
Import a fixed-width text file
Load an unload file
Schedule the loading of an unload file
View the contents of an unload file
Unload error messages
Load error messages and notifications


1.7.10.5.8. Schedule the loading of an
unload file

Applies to User roles: System Administrator
To schedule the loading of an unload file:

   1. Click Tailoring > Database Manager.
   2. Click More or the More Actions icon, and then select Import/Load.
   3. Fill in the following fields.

Field                                   Description
File Name
Member                                  Type the name and path of the file to
Import Descriptor                       load.

File Type                               This field is obsolete.
Messages Option — All Messages
Messages Option — Totals Only           Type the name of the Import
Messages Option — None                  Descriptor record used to import
                                        records. Because unload files don't
                                        require an Import Descriptor record,
                                        leave this field blank.

                                        Select the source operating system
                                        of unload file.

                                        Select this option to see all
                                        messages that Service Manager
                                        generates loading the file.

                                        Select this option to see only the
                                        total number of files Service
                                        Manager loads.

                                        Select this option to hide all
                                        messages that Service Manager
                                        generates loading the file.

4. Click Load BG.

   5. Fill in the following fields.                                                       Service Manager 9.81
       Field
       Expiration Date                  Description
                                        Specify the date and time the
       Repeat Interval                  scheduled process runs. Service
                                        Manager loads the file at this date
       External Filename                and time. By default, Service
                                        Manager uses the current date and
       Member                           time.
       Suppress Messages?               Select the time period to wait before
                                        repeating the load process. Type the
   6. Click Load BG.                    interval in the following format:
                                        <days><hours>:<minutes>:
Related topics                          <seconds>. For example, 1 00:00:00
                                        is a repeat interval of 1 day.
Data maps                               Type the name and path to the
Exporting records                       external file to load. By default,
Importing records                       Service Manager looks for unload
Import descriptor records               files in the server RUN folder.
Unload files                            This field is obsolete.
Purging and archiving records           Type true or false to show or hide
Unload script utility                   messages Service Manager
Add an import descriptor record         generates loading the external file.


Import a character-delimited text file
Import a fixed-width text file
Load an unload file
Schedule the importing of records using an import descriptor record
View the contents of an unload file
Unload error messages
Load error messages and notifications
Load/unload implications of case-sensitivity


1.7.10.5.9. View the contents of an unload
file

Applies to User roles: System Administrator
To view the contents of an unload file:

   1. Click Tailoring > Database Manager.
   2. Click More or the More Actions icon, and then select Import/Load.
   3. Fill in the following fields.

Field                                   Description
File Name
Member                                  Type the name and path of the file
Import Descriptor                       you want to load.

File Type                               This field is obsolete.
Messages Option — All Messages
Messages Option — Totals Only           Type the name of an Import
Messages Option — None                  Descriptor record used to import
                                        records. Because unload files don't
                                        require an Import Descriptor record,
                                        you can leave this field blank.

                                        Select the source operating system
                                        of the unload file.

                                        Select this option to see all
                                        messages that Service Manager
                                        generates while loading the file.

                                        Select this option to see only the
                                        total number of files Service
                                        Manager loads.

                                        Select this option to hide all
                                        messages that Service Manager
                                        generates loading the file.

4. From the More Actions menu, click List Contents.


Related topics

Data maps
Exporting records
Importing records
Import descriptor records
Unload files
Purging and archiving records
Unload script utility
Add an import descriptor record
Import a character-delimited text file
Import a fixed-width text file
Load an unload file
Schedule the importing of records using an import descriptor record
Schedule the loading of an unload file
Unload error messages
Load error messages and notifications


1.7.10.6. Unload script utility

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


1.7.10.6.1. Add an unload script record

Applies to User Roles: System Administrator
To add an unload script record:

   1. Click Tailoring > Unload Script Utility.
   2. Fill in the following fields.

Field                                                                                     Service Manager 9.81
Unload Script
Unload?                                 Description
Purge?
Show Unload Records                     Type a name or label to identify your
                                        unload script. This name can include
Filename                                spaces.

Query                                   Select this option to create an
                                        external unload file from the records
                                        queried by this script.

                                        Select this option to delete the
                                        records queried by this script.

                                        Select this option to display the
                                        Filename, Query, and Data Map
                                        fields where you can specify the
                                        tables and queries for unloading or
                                        purging records.

                                        Specify the name of the tables
                                        unloading or purging records. This
                                        field is visible only if you select
                                        Show Unload Records.

                                        Type the SQL query to identify the
                                        records to unload or purge. You can
                                        use Service Manager operators and
                                        variables in this field. This field is
                                        visible only if you select Show
                                        Unload Records.


Field                                   Description
Datamap
                                        Specify true or false to specify
Show Protected Formats                  whether Service Manager should
Protected Formats                       use the data map file to unload or
                                        purge any associated records. You
                                        must have previously defined a data
                                        map for the listed file in order to use
                                        this feature. By default, Service
                                        Manager reads a blank entry in this
                                        field as false. This field is only
                                        visible if you select Show Unload
                                        Records.

                                        Select this option to display the
                                        Protected Formats field where you
                                        can specify the forms to protect
                                        from purging.

                                        Type the names of the forms to
                                        protect purging records.

   3. Click Add.

To delete or update an unload script record:

   1. Click Tailoring > Unload Script Utility.
   2. Fill in optional search criteria, and then click Search.
   3. Select the unload script to be deleted, and then click Delete.
   4. Click Yes to confirm the deletion.

Related topics

Data maps
Exporting records
Importing records
Purging and archiving records
Unload script utility
Protect forms from the unload script utility
Purge records with the unload script utility


Run an unload script
Validate an unload script record


1.7.10.6.2. Protect forms from the unload
script utility

Applies to User Roles: System Administrator

You can protect a form from being purged by the unload script utility by explicitly
listing the form in the protected formats list.

   1. Click Tailoring > Unload Script Utility.
   2. Fill in optional search criteria, and then click Search.
   3. Select the unload script to update.
   4. Select the Show Protected Formats options.
   5. In the Protected Formats field, type the names of the forms to protect when you

     purge records from this script.
   6. Click Save.

Related topics

Data maps
Exporting records
Importing records
Purging and archiving records
Unload script utility
Add an unload script record
Purge records with the unload script utility
Run an unload script
Validate an unload script record


1.7.10.6.3. Purge records with the unload
script utility

Applies to User Roles: System Administrator

To purge records with the unload script utility:

   1. Click Tailoring > Unload Script Utility.
   2. Fill in optional search criteria, and then click Search.
   3. Select the unload script to run.
   4. Select the Purge? option.
   5. Select the Show Protected Formats options.
   6. In the Protected Formats field, type the names of the forms to protect when you

     purge records from this script.
   7. Click Proceed.
   8. Click Yes.

Related topics

Data maps
Exporting records
Importing records
Purging and archiving records
Unload script utility
Add an unload script record
Protect forms from the unload script utility
Run an unload script
Validate an unload script record


1.7.10.6.4. Run an unload script

Applies to User Roles: System Administrator

To run an unload script:

   1. Click Tailoring > Unload Script Utility.
   2. Fill in optional search criteria.
   3. Click Search.
   4. Select the unload script to run.
   5. Click Proceed.

   6. Fill in the following fields.


Field                                   Description

External File Name                      Type the name of the unload file to
                                        create. This name can include the
                                        path information but must use
                                        characters that are valid for the
                                        target operating system. By default,
                                        Service Manager saves the unload
                                        file in RUN folder of the server. If
                                        users have enabled client-side
                                        unloading, then the Service Manager
                                        saves the unload file on their
                                        Windows desktop.

Append to File?                         Select this option to add records to
                                        an existing unload file.

When loading records into an            Select this option to use the table
existing database dictionary — Use      and field definitions stored in the
existing database dictionary            database dictionary of the target
                                        system.

When loading records into an            Select this option to use the table
existing database dictionary — Use      and field definitions stored in the
database dictionary of loaded record    unload file. This option will overwrite
                                        the existing database dictionary, if
                                        any, for the loaded file and records.

When loading records — Add new          Select this option to update existing
records and update existing records     records in the target system with
                                        records from the unload file.

                                        The new records will be inserted into
                                        the table and the existing records
                                        will be updated regardless of case-
                                        sensitivity.


Field                                   Description

When loading records — Add new          Select this option to ignore existing
records only                            records and add only new records
                                        from the unload file.

                                        The new records will be inserted into
                                        the table regardless of case-
                                        sensitivity.

   7. Click Proceed.
     Service Manager unloads the tables and records you selected in the unload
     script.

After you load a .unl file to import data into Service Manager, you must stop and then
restart the Service Manager server. This ensures that the table changes are initialized.

Note: The unload script utility unloads tables using the binary unload file format.

Related topics

Data maps
Exporting records
Importing records
Purging and archiving records
Unload script utility
Load/unload implications of case-sensitivity
Add an unload script record
Protect forms from the unload script utility
Purge records with the unload script utility
Validate an unload script record
Unload error messages


1.7.10.6.5. Validate an unload script record

Applies to User Roles: System Administrator

To validate an unload script record:

   1. Click Tailoring > Unload Script Utility.
   2. Use search or advanced search to find one or more records.
   3. Select the unload script to validate.
   4. Click More or the More Actions icon for the record, and then select Validate.

Related topics

Data maps
Exporting records
Importing records
Purging and archiving records
Unload script utility
Add an unload script record
Protect forms from the unload script utility
Purge records with the unload script utility
Run an unload script
Unload error messages
Load error messages and notifications


1.7.10.7. Purging and archiving records

The purge and archive function lets you save Service Manager records to an external
file and then delete those records from the database. You can use the purge and
archive function to archive data as part of your backup plan or to free up space on
your system. You can access the purge and archive function manually or as part of a
scheduled process.

You can use the purge and archive function in one of four ways:

     Archive records only
     Purge records only
     Archive and then purge records
     Schedule an archive, a purge, or an archive and purge process

You can also use the purge and archive function in conjunction with data maps. When
you define a data map, you declare certain records as having a mapping or
connection to other tables and records. If you have created data maps, you can
enable them during the purge and archive process to determine what additional
records Service Manager should include in the process.

Related topics

Data maps
Exporting records
Importing records
Unload files
Using data maps to purge and archive records
Unload script utility
Archive records
Purge and archive records
Purge records
Schedule purge and archive processes
````
