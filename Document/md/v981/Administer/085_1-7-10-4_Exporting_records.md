---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.7.10.4 .. 1.7.10.4.8
printed_pages: 2080-2107
---

# 1.7.10.4 Exporting records

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.7.10.4. Exporting records

A system administrator can export Service Manager records to an external file using
the following methods:

     Export an individual record as an unload file
           As a binary unload
           As a text unload
           As a formatted text unload

     Export a record from a record list
           As an unload file
           As an Excel file
           As a text file

     Export a list of records from multiple tables
           As an unload file

Related topics

Data maps
Export descriptor records
Unload files
Importing records
Purging and archiving records
Unload script utility
Add an export descriptor record
Export a record list to a text file
Export a record list to an Excel file
Export a record list using an export description record
Export an individual record using an export descriptor record
Export selected records from a table using an export descriptor record
Schedule the exporting of records using an export descriptor record
Schedule the unloading of records
Unload a database dictionary only
Unload a record list
Unload an individual record
Unload records from multiple files
Unload selected records from a file
Update an export descriptor record
Unload error messages
Load error messages and notifications


1.7.10.4.1. Export descriptor records

You can create an export descriptor record to define the rules for exporting data from
Service Manager tables to external files. Each export descriptor record describes the
following information:

     The Service Manager source table to be exported
     The fields from the table to export
     Formatting information about each field

           Field start position
           Field width
           Number of entries to extract from array fields
           Date and time format
     The related Format Control record to use, if any, to validate and format data prior
     to export

Note: You can't export database dictionary field definitions using an export
description record. To export database dictionary field definitions, use the native
Service Manager unload format.

When you create an export descriptor record, Service Manager validates the table
selected for exporting against the database dictionary. If the validation is
unsuccessful, Service Manager displays the following message: Validation failed

You can click on the warning message to see the reasons why the data validation
failed. Although Service Manager lets you save an invalid export description record,
you can't use this record to export data. You need to correct any validation errors
before exporting data. After Service Manager validates the table, it exports each
record as a single line entry in the resulting external file.

Related topics

Data maps
Exporting records
Unload files
Importing records
Purging and archiving records
Unload script utility
Add an export descriptor record
Export a record list to a text file
Export a record list to an Excel file
Export a record list using an export description record


Export an individual record using an export descriptor record
Export selected records from a table using an export descriptor record
Schedule the exporting of records using an export descriptor record
Schedule the unloading of records
Unload a database dictionary only
Unload a record list
Unload an individual record
Unload records from multiple files
Unload selected records from a file
Update an export descriptor record
Unload error messages


1.7.10.4.2. Unload error messages

Service Manager displays an error message if it can't successfully unload an external
file.


Unload error message                     Description
Invalid unload append/create
parameter.                               Valid parameters are append or create
                                         for the unload append/create input
Select ONE export format: binary, text,  field.
or formatted text.
                                         Valid entries are binary, text, and
Invalid unload dbdict load parameter.    formatted text for the unload mode
                                         input field.
Unload mode must be export.
                                         Valid entries are create, replace, and
Invalid unload record load parameter.    remove for the unload dbdict input
                                         field.
No unload filename.
                                         When you specify an export descriptor
The unload format must be binary for     record, you must set the unload type to
Purge/Archives.                          export for the unload mode input field.
<database name> file unloaded to
external file:                           Valid entries are update and add only
<Unix filename>                          for the record load input field.

                                         Type an external file name for the
                                         unload file.

                                         Select the binary unload format when
                                         purging or archiving records.

                                         Unload processing the named
                                         database to the Unix file complete.

External file: <UNIX.filename> is        Another task has exclusive control over
locked; try again later.                 the named external file.

The config record (database              The hardware configuration record
load/unload) is missing.                 database load/unload.unix or database
                                         load/unload.winnt required for
                                         database loads and unloads has been
                                         deleted or renamed. It must be
                                         replaced.


Unload error message                    Description

<nn> records unloaded so far from       The unload utility generates this
<database name> file to <unload file>   message every hundredth record it
                                        attempts to unload.
<database name> file can't be
unloaded to external file:              Service Manager could not connect to
<UNIX/NT.FILENAME>.                     the named external file.

unable to allocate.                     This message occurs in two distinct
                                        situations:

                                        The unload utility attempted to connect
                                        to a non-existent external file causing
                                        the message to be generated.
                                        However, the unload utility will attempt
                                        to dynamically allocate the Unix/NT
                                        filename. If the dynamic allocation is
                                        successful, confirmation messages will
                                        follow. In this situation, it doesn't
                                        indicate an error condition.

                                        The unload utility attempted to connect
                                        to a non-existent external file causing
                                        the message to be generated. The
                                        subsequent attempt to dynamically
                                        allocate the Unix/NT filename failed
                                        causing the message to be generated a
                                        second time. Other error messages will
                                        follow indicating the error condition.

Application:file.unload has completed   An error exit condition has occurred;
with errors; check other messages.      check the message log for the error
                                        message indicating which exit.
Invalid unload options specified for
unload, no records unloaded.            Since the unload options were invalid,
                                        no records were unloaded.


Related topics

Exporting records
Export descriptor records
Unload files
Importing records
Import descriptor records
Unload files
Export a record list to a text file
Export a record list to an Excel file
Export a record list using an export description record
Export an individual record using an export descriptor record
Export selected records from a table using an export descriptor record
Add an import descriptor record
Import a character-delimited text file
Import a fixed-width text file


1.7.10.4.3. Unload files

The native Service Manager export format is the unload file. An unload file stores the
database dictionary of Service Manager tables in addition to records. The database
dictionary embedded in an unload file determines where Service Manager loads
records during import. The unload file also specifies whether Service Manager should
update or ignore duplicate records when loading records. Service Manager can
export unload files in the following file formats:

     Binary - The binary unload file format archives Service Manager tables. You can
     load binary unload files only from the Database Manager.
     Text - The text unload file format is human readable but only intended to be
     loaded from the Database Manager.
     Formatted text - The formatted text unload file format is intended to be
     compatible with external applications, although the actual format of the file is
     determined by the form you select as a template. You can create export forms to
     create formatted text unload files compatible with specific applications.

You can export records into an unload file from the following Service Manager
utilities:

     Database Manager
     Unload Script Utility
     Directly from some record lists

After you load a .unl file to import data into Service Manager, you must stop and then
restart the Service Manager server. This ensures that the table changes are initialized.

Related topics

Data maps
Exporting records
Importing records
Purging and archiving records
Using data maps to purge and archive records
Unload script utility
Archive records
Purge and archive records
Purge records
Schedule purge and archive processes


1.7.10.4.4. Using data maps to purge and
archive records

You can use data maps to purge or archive related records in your database. A data
map defines connections between various tables in your database. For example,
when you create a record in the probsummary table, you typically create associated
records in the problem and screlation tables. By default, Service Manager comes with
a collection of data maps to common tables. For example, the following tables have
default data maps defined in Service Manager:

Table                                   Table associated by a data map
probsummary
cm3r                                    problem, screlation
ocmo
                                        cm3t, screlation
ocmq
                                        ocmalertlog, ocmapprlog, ocml,
                                        ocmlpage, ocmopage, ocmphaselog

                                        ocmalertlog, ocmapprlog, ocml,
                                        ocmlpage, ocmphaselog, ocmqpage

To purge or archive all records associated with a particular table quickly, enable Use
Data Map? from the Purge and Archive function. You can add or update data maps to
create new associations among records.

Related topics

Data maps
Exporting records
Importing records
Purging and archiving records
Unload files
Unload script utility
Archive records
Purge and archive records
Purge records
Schedule purge and archive processes


1.7.10.4.5. Archive records

Applies to User Roles: System Administrator
To archive records:

   1. Click System Administration > Ongoing Maintenance > System >
     Purge/Archive.

   2. Fill in the following fields:

    Field                               Description
    Enter Format Name
                                        Type the name of the form to
    Use Data Map?                       archive.

    Prompt Data Map?                    Type true or false to enable the data
                                        map associated with this form. If
3. Click OK.                            enabled, Service Manager archives
4. Fill in optional search criteria.    all associated records with the form
5. Click Query.                         you select.
6. Click Execute Search.
7. Click Archive.                       Type true or false to enable a
8. Fill in the following fields:        confirmation message to use a data
                                        map for each record archived. This
                                        option is only valid if the Use Data
                                        Map? option is also enabled.

Field                                                                                     Service Manager 9.81
External File Name
Member                                  Description
Unload Type
Append to File                          Type the name and path of the file
                                        used to save the records. By default,
Use Data Map                            this file is in the RUN folder of the
                                        Service Manager server.
Prompt for Data Map
                                        This field is obsolete.
Suppress Messages
                                        Select the operating system file
                                        format of the external file.

                                        Select this option to add records to
                                        the end of an external file of the
                                        same name. If an external file of the
                                        same name doesn't exist, Service
                                        Manager creates a new file. If this
                                        field is cleared, then Service
                                        Manager overwrites any existing file
                                        of the same name.

                                        Select this option to use a
                                        predefined data map when archiving
                                        the selected records. Using a data
                                        map may result in Service Manager
                                        archiving more records than what
                                        you originally selected by the query.

                                        Select this option to enable a
                                        confirmation message to use a data
                                        map for each record archived. This
                                        option is only valid if the Use Data
                                        Map option is also enabled.

                                        Select this option to hide all
                                        messages that the purge and archive
                                        function generates.


Field                                   Description
Export Mode — Binary
                                        Select this option to save the
Export Mode — Text                      external file in Service Manager’s
                                        binary format. Only the Service
Export Mode — Formatted Text            Manager Database Manager can
                                        read this binary file format. You must
Form Name                               select this option for archiving
                                        records.
Dbdict Load Options — Create file if
not there, and update if present        Select this option to save the
                                        external file in Service Manager’s
                                        text format. This format is human
                                        readable but is not intended for
                                        export to other applications other
                                        than Service Manager’s Database
                                        Manager. You can't select this option
                                        for archiving records.

                                        Select this option to save the
                                        external file in a user-defined text
                                        format. This format is intended for
                                        export to other applications. If you
                                        select this option, you must type a
                                        valid text format name in the Form
                                        Name field. You can't select this
                                        option for archiving records.

                                        Type the name of the form to use
                                        when exporting records as
                                        formatted text. This option is valid
                                        only when you select the Formatted
                                        Text option. If the text form doesn't
                                        already exist, Service Manager
                                        prompts you to create it.

                                        Select this option if the data saved in
                                        this external file should replace
                                        existing data in the target Service
                                        Manager system.


Field                                   Description

Dbdict Load Options — Create file if    Select this option to ignore data
not there, but don't update if present  saved in the external file that already
                                        exists in the target Service Manager
                                        system.

Dbdict Load Options — Create file if    Select this option if the data saved in
not there, and update if present,       this external file should replace
including keys                          existing data in the target Service
                                        Manager system including the
                                        database keys.

Dbdict Load Options — Create file if    Select this option if the data saved in
not there, and update if present,       this external file should replace
including SQL mapping                   existing data in the target Service
                                        Manager system including the
                                        database SQL mapping.

Dbdict Load Options — Create file if    Select this option if the data saved in
not there, and update if present,       this external file should replace
including keys AND SQL mapping          existing data in the target Service
                                        Manager system including the
                                        database SQL mapping and the
                                        database keys.

Record Load Options — Add/update        Select this option if the records
records                                 saved in this external file are to
                                        replace any existing records in the
                                        target Service Manager system.

Record Load Options — Only add          Select this option to ignore records
new records                             saved in the external file that already
                                        exist in the target Service Manager
                                        system.

   9. Click unload/export.
     Service Manager saves the select records to an external file.

Related topics


Data maps
Exporting records
Importing records
Purging and archiving records
Unload files
Using data maps to purge and archive records
Unload script utility
Purge and archive records
Purge records
Schedule purge and archive processes
Load/unload implications of case-sensitivity


1.7.10.4.6. Purge and archive records

Applies to User Roles: System Administrator
To purge and archive records:

   1. Click System Administration > Ongoing Maintenance > System >
     Purge/Archive.

   2. Fill in the following fields.

Field                                   Description
Format Name
Use Data Map?                           Type the name of the form to purge
                                        and archive.
Prompt Data Map?
                                        Type true or false to enable the data
                                        map associated with this form. If
                                        enabled, Service Manager archives
                                        all associated records with the form
                                        you select.

                                        Type true or false to enable a
                                        confirmation message to use a data
                                        map for each record purged and
                                        archived. This option is only valid if
                                        the Use Data Map? option is also
                                        enabled.

3. Click OK.
4. Fill in optional search criteria to select the records to purge and archive.
5. Click Query.
6. Click Execute Search.
7. Click Purge/Arch.

8. Fill in the following fields.

Field                                                                                     Service Manager 9.81
External File Name
Member                                  Description
Unload Type
Append to File                          Type the name and path of the file
                                        used to save the records. By default,
Use Data Map                            this file is located in the RUN folder
                                        of the Service Manager server.
Prompt for Data Map
                                        This field is obsolete.
Suppress Messages
                                        Select the operating system file
                                        format for the external file.

                                        Select this option to add records to
                                        the end of an external file of the
                                        same name. If a external file of the
                                        same name doesn't exist, Service
                                        Manager creates a new file. If this
                                        field is cleared, then Service
                                        Manager overwrites any existing file
                                        of the same name.

                                        Select this option to use a
                                        predefined data map when archiving
                                        the selected records. Using a data
                                        map may result in Service Manager
                                        archiving more records than what
                                        you originally selected by the query.

                                        Select this option to enable a
                                        confirmation message to use a data
                                        map for each record archived. This
                                        option is only valid if the Use Data
                                        Map option is also enabled.

                                        Select this option to hide all
                                        messages that the purge and archive
                                        function generates.

Field                                                                                     Service Manager 9.81
Export Mode — Binary
Export Mode — Text                      Description

Export Mode — Formatted Text            Select this option to save the
                                        external file in Service Manager’s
Form Name                               binary format. Only the Service
                                        Manager Database Manager can
                                        read this binary file format. You must
                                        select this option for archiving
                                        records.

                                        Select this option to save the
                                        external file in Service Manager’s
                                        text format. This format is human
                                        readable but is not intended for
                                        export to other applications other
                                        than Service Manager’s Database
                                        Manager. You can't select this option
                                        for archiving records.

                                        Select this option to save the
                                        external file in a user-defined text
                                        format. This format is intended for
                                        export to other applications. If you
                                        select this option, you must type a
                                        valid text format name in the Form
                                        Name field. You can't select this
                                        option for archiving records.

                                        Type the name of the text format to
                                        use when exporting records as
                                        formatted text. This option is only
                                        valid with the Formatted Text option
                                        is selected. If the text format
                                        description doesn't already exist,
                                        Service Manager prompts you to
                                        create it.


Field                                   Description

Dbdict Load Options — Create file if    Select this option if the data saved in
not there, and update if present        this external file should replace
                                        existing data in the target Service
                                        Manager system.

Dbdict Load Options — Create file if    Select this option to ignore data
not there, but don't update if present  saved in the external file that already
                                        exists in the target Service Manager
                                        system.

Dbdict Load Options — Create file if    Select this option if the data saved in
not there, and update if present,       this external file should replace
including keys                          existing data in the target Service
                                        Manager system including the
                                        database keys.

Dbdict Load Options — Create file if    Select this option if the data saved in
not there, and update if present,       this external file should replace
including SQL mapping                   existing data in the target Service
                                        Manager system including the
                                        database SQL mapping.

Dbdict Load Options — Create file if    Select this option if the data saved in
not there, and update if present,       this external file should replace
including keys AND SQL mapping          existing data in the target Service
                                        Manager system including the
                                        database SQL mapping and the
                                        database keys.

Record Load Options — Add/update        Select this option if the records
records                                 saved in this external file are to
                                        replace any existing records in the
                                        target Service Manager system.

Record Load Options — Only add          Select this option to ignore records
new records                             saved in the external file that already
                                        exist in the target Service Manager
                                        system.


   9. Click unload/export.
 10. Click Purge All.

Related topics

Data maps
Exporting records
Importing records
Purging and archiving records
Unload files
Using data maps to purge and archive records
Unload script utility
Load/unload implications of case-sensitivity
Archive records
Purge records
Schedule purge and archive processes


1.7.10.4.7. Purge records

Applies to User roles: System Administrator
To purge records:

   1. Click System Administration > Ongoing Maintenance > System >
     Purge/Archive.

   2. Fill in the following fields.

Field                                    Description
Format Name
Use Data Map?                            Type the name of the form to purge.

Prompt Data Map?                         Type true or false to enable the data
                                         map associated with this form. If
                                         enabled, Service Manager purges all
                                         associated records with the form
                                         you select.

                                         Type true or false to enable a
                                         confirmation message to use a data
                                         map for each record purged. This
                                         option is only valid if the Use Data
                                         Map? option is also enabled.

   3. Click OK.
   4. Fill in optional search criteria.
   5. Click Query.
   6. Click Execute Search.
   7. Click Purge.
   8. Click Purge All.

Related topics

Data maps
Exporting records
Importing records
Purging and archiving records
Unload files


Using data maps to purge and archive records
Unload script utility
Archive records
Purge and archive records
Schedule purge and archive processes


1.7.10.4.8. Schedule purge and archive
processes

Applies to User Roles: System Administrator
To schedule purge and archive processes:

   1. Click System Administration > Ongoing Maintenance > System >
     Purge/Archive.

   2. Fill in the following fields.

Field                                   Description
Enter Format Name
Use Data Map?                           Type the name of the form to purge
                                        and archive.
Prompt Data Map?
                                        Type yes or no to enable the data
                                        map associated with this form. If
                                        enabled, Service Manager archives
                                        all associated records with the form
                                        you select.

                                        Type yes or no to enable a
                                        confirmation message to use a data
                                        map for each record purged and
                                        archived. This option is only valid if
                                        the Use Data Map? option is also
                                        enabled.

3. Click OK.
4. Fill in optional search criteria.
5. Click Query.
6. Click Execute Search.
7. Click Schedule.

8. Fill in the following fields.


Field                                   Description
Date/Time to Run
Repeat Interval — Enter Number of       Specify the date and time to run the
Days and Time                           archive, purge, or purge and archive
                                        process.
Repeat Interval — Monthly
Repeat Interval — Quarterly             Specify the number of days, hours,
Repeat Interval — Semi-Annually         minutes, and seconds to wait, if any,
Repeat Interval — Annually              before repeating the archive, purge,
Archive Only — Ext File                 or purge and archive process. Type
Archive Only — Member                   the interval in the following format:
                                        <days><hours>:<minutes>:
                                        <seconds>. For example, 1 00:00:00
                                        is a repeat interval of 1 day.

                                        Select this option to repeat the
                                        archive, purge, or purge and archive
                                        process every once every month
                                        from today’s date.

                                        Select this option to repeat the
                                        archive, purge, or purge and archive
                                        process every once every quarter
                                        from today’s date.

                                        Select this option to repeat the
                                        archive, purge, or purge and archive
                                        process every once every six
                                        months from today’s date.

                                        Select this option to repeat the
                                        archive, purge, or purge and archive
                                        process every once every year from
                                        today’s date.

                                        Type the name and path of the
                                        external file to contain archive
                                        records.

                                        This field is obsolete.


Field                                   Description
Archive Only — Append to existing
file or create new file                 Select Append to add records to the
(append/create)                         end of an external file of the same
                                        name. Select Create to overwrite an
Use Data Map?                           external file of the same name. With
                                        either option, if an external file of the
Suppress Messages                       same name doesn't exist, Service
                                        Manager creates a new file.

                                        Type yes or no to enable the data
                                        map associated with this form. If
                                        enabled, Service Manager archives
                                        all associated records with the form
                                        you select.

                                        Select this option to hide all
                                        messages that the purge and archive
                                        function generates.

Field                                                                                     Service Manager 9.81
Dbdict load options include
                                        Description

                                        Select one of the following options:

                                             Create — Select this option to
                                             create a new file if one is not
                                             present in the target Service
                                             Manager system and to
                                             preserve the existing file if
                                             there is a duplicate file in the
                                             external file.
                                             Replace— Select this option to
                                             create a new file if one is not
                                             present in the target Service
                                             Manager system and to
                                             overwrite any existing files with
                                             the entry in the external file.
                                             Remove — Select this option to
                                             create a new file if one is not
                                             present in the target Service
                                             Manager system and to replace
                                             any existing file with the entry
                                             in the external file.


Field                                         Description
Record load options include
                                              Select one of the following options:

                                                   Add/Update — Select this
                                                   option to create a new records
                                                   if they're not present in the
                                                   target Service Manager system
                                                   and to overwrite existing
                                                   records with entries from the
                                                   external file.
                                                   Add Only — Select this option
                                                   to create a new records if
                                                   they're not present in the target
                                                   Service Manager system and to
                                                   preserve any existing records if
                                                   there duplicates entries the
                                                   external file.

                                              The records will be updated or
                                              inserted into the table regardless of
                                              case-sensitivity.

   9. Click one of the following options:
           Archive
           Purge
           Purge/Arch

Related topics

Data maps
Exporting records
Importing records
Purging and archiving records
Unload files
Using data maps to purge and archive records
Unload script utility
Load/unload implications of case-sensitivity
Archive records


Purge and archive records
Purge records
````
