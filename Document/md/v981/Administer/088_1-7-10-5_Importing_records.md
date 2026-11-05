---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.7.10.5 .. 1.7.10.5.3
printed_pages: 2166-2198
---

# 1.7.10.5 Importing records

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.7.10.5. Importing records

A system administrator can import Service Manager records from an external unload
file using the Database Manager. Service Manager can import records from all three
formats of unload files (binary unload, text unload, and formatted text unload) as well
as from two formats of text files (fixed-width and character-delimited text files). You
can import records into Service Manager as a manual foreground process or as an
automated scheduled background process.

How Service Manager imports records depends upon the format of the source file.
When importing unload files, Service Manager uses the database dictionary stored in
these files to determine where and how to import records into Service Manager. The
database dictionary inside an unload file determines whether Service Manager
updates or ignores duplicate records in the existing system. When importing text files,
Service Manager requires an import descriptor record to tell it where and how to
import records. You can define an import descriptor record during the import process
or prepare one in advance.

An import descriptor record defines:

     The external file source
     The internal destination table
     The format used to identify fields in the imported file

           Fixed-width fields
           Character-delimited fields
     The rules for handling duplicate records
           Ignore duplicate records
           Replace duplicate records
           Update duplicate records
     The optional Format Control record to apply
     The names of destination fields for import records
     The date format to use
     The number of elements from an array to import

Related topics

Data maps
Exporting records
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
View the contents of an unload file
Load error messages and notifications


1.7.10.5.1. Import descriptor records

You can create an import descriptor record to define the rules for importing data from
external files into Service Manager. Each import descriptor record describes the
following information:

     The external file source
     The internal destination table
     The format used to identify fields in the imported file

           Fixed-width fields
           Character-delimited fields
     The rules for handling duplicate records
           Ignore duplicate records
           Replace duplicate records
           Update duplicate records
     The optional Format Control record to apply
     The names of destination fields for import records
     The date format to use
     The number of elements from an array to import

Note: You can't import the database dictionary definition of fields from an external
file. To import database dictionary field definitions, you must use the native Service
Manager unload format.

When you create an import descriptor record, Service Manager validates the records
in the external file against the Service Manager database dictionary. If the validation is
unsuccessful, Service Manager displays the message: Validation failed

You can click on the warning message to see the reasons why the data validation
failed. Although Service Manager enables you to save an invalid import description
record, you can't use this record to import data. You must correct any validation
errors before importing data. After Service Manager validates the file, it imports one
record for each entry in the external file.

Related topics

Data maps
Exporting records
Importing records
Unload files
Purging and archiving records
Unload script utility


Add an import descriptor record
Import a character-delimited text file
Import a fixed-width text file
Load an unload file
Schedule the importing of records using an import descriptor record
Schedule the loading of an unload file
View the contents of an unload file
Load error messages and notifications


1.7.10.5.2. Load error messages and
notifications

Service Manager displays an error message if it can't successfully load an external
file. The following list contains load error messages and notifications.


Load error message or notification      Description

<WINDOWS.FILENAME> or <UNIX.FILE Service Manager has finished loading

NAME> file loaded.                      the named file.

File(s) loaded from external file:      Service Manager has finished loading

<WINDOWS.FILENAME> or <UNIX.FILE the named files.

NAME>

<Number> records loaded into            Service Manager has finished loading
<Database name> from external file:     <Number> records from the named
<WINDOWS.FILENAME> or                   file.
<UNIX.FILENAME>

Loading <Database name> from            Service Manager has started loading
external file:                          <Database name> from the named file.
<WINDOWS.FILENAME> or <UNIX.FILE
NAME>.

<Number> records have been loaded       The load utility generates this message
so far into the <Database name> file.   for every hundredth record it attempts
                                        to load into the named Service
                                        Manager database.

The config record (database             The hardware configuration record
load/unload) is missing.                database load/unload.unix required for
                                        database loads and unloads has been
                                        deleted or renamed. It must be
                                        replaced. Refer to Unload/Load for
                                        more information.

The external file                       The load utility could not access the
<WINDOWS.FILENAME> or <UNIX.FILE        named external file because another
NAME> is being written to and can't be  task has a lock on it.
read at this time.

Invalid end of file encountered in      The load utility encountered an
external file                           incomplete file. Typically, this means
<WINDOWS.FILENAME> or <UNIX.FILE        that the unload process was
NAME>.                                  interrupted before completion.


Load error message or notification       Description

All null keys:file: <Database name>;rec  The load utility attempted to add record
no:<Number> in external file:            number <Number> to the named
<WINDOWS.FILENAME> or <UNIX.FILE         Service Manager database and
NAME>.                                   encountered all null keys.

Invalid null key;file:<database          The load utility attempted to add record
name>;rec no:<Number> in external        number <Number> to the named
file                                     Service Manager database and
<WINDOWS.FILENAME> or <UNIX.FILE         encountered an invalid null key.
NAME>.

Invalid duplicate key:file:<Database     The load utility attempted to add record
name>;rec no:<Number> in external        number <Number> to the named
file                                     Service Manager database and
<WINDOWS.FILENAME> or <UNIX.FILE         encountered an invalid duplicate key.
NAME>.

External file: %S is not in Unload       The named file is not in file format
Format.                                  required by the load utility.

You have duplicated column headers:      When duplicate source columns are
<column names>                           detected in the external source file,
                                         warns the user about the column
                                         names.

You have specified data mapping          If the user has specified a correct
between the target fields and source     mapping between target fields and
columns. This will disable RAD           source columns, when the user
expressions.                             specifies a RAD expression, warns the
                                         user that RAD expressions will not work
                                         in this situation.

Column not found in external file,       When a specified column is not found
column: <columns names>                  in the source file, warns the user about
                                         the missing column.


 Load error message or notification       Description
 Line <line id> is empty. Skipped the
 line.                                    When the line being processed is
                                          empty, warns the user about the line
 Error occurs when processing line        number.
 <line id>.
                                          When an error occurs during the
 Record already exists on line<line id>.  processing of a line, warns the user
 Updated the record.                      about the line number.

 <processed rows count> records           When a record already exists during
 processed.                               the processing of a line, warns the user
                                          about the line number.
Related topics
                                          When every 100 rows have been
Importing records                         processed, notifies the user about the
                                          current number of rows processed.


1.7.10.5.3. Add an import descriptor record

Applies to User Roles: System Administrator
Service Manager enables you to add import descriptor records for two types of text
files: character-delimited, and fixed-width.

Add an import descriptor record for a character-
delimited text file.

To add an import descriptor record for a character-delimited text file, follow these
steps:

   1. Click Tailoring > Database Manager.
   2. Click More or the More Actions icon, and then select Text Import Wizard.
   3. Fill in the following fields.

Field                                                                                     Service Manager 9.81
File to Import
                                        Description
Member
Destination Table                       Type or browse to the path and
File Type                               name of the external text file to
                                        import.

                                                    Note

                                                   Only Windows Dos text
                                                   file format is supported.

                                        This field is obsolete.
                                        Type the database dictionary name
                                        of the table receiving the imported
                                        records.

                                        Select the source operating system
                                        of external file.

                                                    Note

                                                   The Winnt file type is
                                                   recommended.

4. Click Search.
  Service Manager searches for the external file and displays one of the following
  messages:
        If Service Manager finds the external file but there is not existing import
        descriptor record, Service Manager displays the form to create a new
        import descriptor.
        If Service Manager finds the external file and also finds one or more import
        descriptor records, Service Manager displays a list of import descriptor
        records.
        If Service Manager can't find the external file, it displays an error message.

5. If Service Manager displays a list of import descriptor records, do one of the
  following:


        Click an existing import descriptor record.
        Click New.
6. From the Creating a New Import Descriptor form, select Character-delimited
  for Input File Type.
7. Click Proceed.
8. Fill in the following import data definitions.
  ;

Field                                                                                     Service Manager 9.81
Import Name
Import Table                            Description

Import Mode                             Type the name used to save the
                                        import descriptor record.

                                        This field lists the destination table
                                        you selected earlier in the wizard.
                                        This is a read-only field.

                                        Select one of the following options:

                                             Add: Select this option to only
                                             add new records.
                                             Add/Replace: Select this option
                                             to both add new records and
                                             replace existing records. You
                                             may also select this option to
                                             update fields that you define in
                                             the Advanced tab.
                                             Replace only: Select this option
                                             to only replace existing
                                             records.

                                                    Note

                                                   If you use field mapping
                                                   for importing, Service
                                                   Manager always uses
                                                   the Add/Replace import
                                                   mode regardless of the
                                                   mode you specified.

Field                                                                                     Service Manager 9.81
Format Control
                                        Description

                                        Type the name of the optional
                                        Format Control record used to
                                        format the incoming records.

                                                    Note

                                                   For the Format Control
                                                   record, only the
                                                   following sections are
                                                   supported: Calculations,
                                                   JavaScript, and
                                                   Validations.

Field                                                                                     Service Manager 9.81
Delimiter
                                        Description

                                        Service Manager only displays this
                                        field on character-delimited imports.
                                        Select one of the following options:

                                             Comma: Select this option if
                                             the import file uses a comma (,)
                                             between fields.
                                             Tab: Select this option the
                                             import file uses a tab character
                                             between fields.
                                             Semicolon: Select this option if
                                             the import file uses a
                                             semicolon (;) between fields.
                                             Other: Select this option to
                                             specify the character the
                                             import file uses between fields.

Field                                                                                     Service Manager 9.81
Text Qualifier
                                        Description

                                                    Note

                                                   Delimiter is set to
                                                   Comma by default.
                                                   However, when you add
                                                   a descriptor for the
                                                   import file, if your source
                                                   file uses a comma as the
                                                   delimiter, you must
                                                   select other delimiters
                                                   first and then reselect
                                                   Comma. Alternatively,
                                                   you can first click Add to
                                                   add a descriptor, and
                                                   then click Back to return
                                                   to the descriptor. You
                                                   need to do so to trigger
                                                   the retrieval of the
                                                   source columns from the
                                                   source file using the
                                                   specified delimiter.
                                                   Otherwise, you will see a
                                                   blank Source Column
                                                   list.

                                        Service Manager only displays this
                                        field on character-delimited imports.
                                        Specify the text qualifier the import
                                        file uses to include special
                                        characters such as text delimiters in
                                        the record data.

Field                                                                                     Service Manager 9.81
Array Separator
                                        Description
Field Name
                                        You can specify this field to split
                                        array data in your source file.
                                        Service Manager splits the array
                                        data based on the Array Type field.
                                        Select one of the following
                                        separators for your array data:

                                             Semicolon: Select this
                                             separator if the source file uses
                                             a semicolon to split the array
                                             data.

                                             Line Break: Select this
                                             separator if the source file uses
                                             a line break to split the array
                                             data.

                                        For example, when data is stored as
                                        'va;vb', and Semicolon is selected in
                                        the Array Separator drop-down list,
                                        Service Manager parses the value to
                                        ['va','vb'].

                                        Specify the database dictionary field
                                        name receiving the imported record
                                        data. Type one field name for each
                                        source field in the import file.

       Field                                                                              Service Manager 9.81
       Source Column
                                        Description
This PDF was generated on May 23, 2026
                                        This is a list of column headers in
                                        the source file. Service Manager
                                        automatically retrieves the list
                                        according to the delimiter you
                                        specified. If you specify a wrong
                                        delimiter, the source column retrieval
                                        fails. You should map each source
                                        column to a field in the target table.

                                             If the mapping table contains a
                                             field that is not mapped to a
                                             source column, all mappings
                                             are ignored. Instead, all
                                             specified fields are
                                             automatically mapped to the
                                             source columns in their display
                                             order in the source file.

                                             One source column can be
                                             mapped to multiple target
                                             fields.

                                             For example, a Service Catalog
                                             item can have the same value
                                             for Name and Display Name.

                                             Name: PC Hardware
                                             Display Name: PC Hardware

                                             If you are importing Service
                                             Catalog items into Service
                                             Manager, you can map the
                                             Name column in your source
                                             file to the name and
                                             displayName fields in the
                                             svcDisplay table in Service
                                             Manager, as shown below.

                                             Field Name: name
                                             Source Column: Name

                                                                                                                 Page 262 of 307
Field                                                                                     Service Manager 9.81
Field Type
                                        Description

                                             Field Name: displayName
                                             Source Column: Name

                                             You can't specify duplicate
                                             field names in the mapping
                                             table, that is, each field name
                                             can only occur once in the
                                             mapping table. Service
                                             Manager returns an error if it
                                             detects a duplicate field name.

                                             Only the specified source
                                             columns are imported.

                                        This is a read-only field and can't be
                                        edited. If Service Manager validates
                                        the data from the import file, it
                                        displays a number describing the
                                        data type.

Field                                                                                     Service Manager 9.81
Date Format
                                        Description

                                        Type the date and time format used
                                        to import date and time fields. You
                                        can use the following tokens to
                                        represent units of time:

                                             dd: two digit day
                                             mm: two digit month
                                             yy: two digit year
                                             yyyy: four digit year
                                             hh: hours
                                             ii: minutes
                                             ss ;: seconds

       Field                                                                              Service Manager 9.81

       Array Type                       Description

This PDF was generated on May 23, 2026              Note

                                                        When you specify a
                                                        mapping between
                                                        the source columns
                                                        and target fields,
                                                        yyyy is
                                                        unsupported.

                                                        When you load
                                                        date type records,
                                                        the date format is
                                                        converted to the
                                                        same as the login
                                                        user's. For
                                                        example, the date
                                                        format in the
                                                        external file is
                                                        "mm/dd/yy" with
                                                        the value of
                                                        "07/12/14", and
                                                        defined in the
                                                        mapping table.
                                                        However, the login
                                                        user uses a date
                                                        format of
                                                        "yy/mm/dd". In this
                                                        case, the date
                                                        format is converted
                                                        to "14/07/12" and
                                                        saved in Service
                                                        Manager.

                                        This is a read-only field and can't be
                                        edited. If Service Manager validates
                                        any array data from the import file, it
                                        displays a number describing the
                                        array type.

                                                                                                                 Page 265 of 307
Field                                                                                     Service Manager 9.81
Occurrences
                                        Description
Query
                                        Type the number of array elements
                                        to import for this field.

                                        Type a query used to select an
                                        existing record from the destination
                                        Service Manager database for
                                        updating. If this query returns a
                                        single record, Service Manager
                                        updates this record with the data
                                        from the import file. If the query
                                        returns more than one record, then
                                        Service Manager uses the Import
                                        Mode setting to determine what
                                        action to take.

                                                    Note

                                                   The import utility stores
                                                   the values of imported
                                                   fields in the $L.db
                                                   variable. You can use
                                                   this variable to construct
                                                   queries. For example:
                                                   not null(name in $L.bd)

Field                                                                                     Service Manager 9.81
Skip
                                        Description
Expressions
                                        Type a query that identifies records
                                        to skip when adding or updating
                                        from the import file. If this query
                                        returns one or more records, Service
                                        Manager ignores adds or updates
                                        from records matching the query. To
                                        use this field you must also provide
                                        an entry in the Query field.

                                                    Note

                                                   ;The import utility stores
                                                   the values of imported
                                                   fields in the $L.db
                                                   variable. You can use
                                                   this variable to construct
                                                   a skip condition query.
                                                   For example: null(name
                                                   in $L.bd)

                                        Type any RAD expressions used to
                                        identify records for importing.

                                                    Note

                                                   If you have specified a
                                                   correct mapping
                                                   between the target fields
                                                   and source columns,
                                                   RAD expressions are
                                                   disabled.

Field                                                                                     Service Manager 9.81
Javascript
                                        Description

                                        Specify Javascript code to do
                                        advanced import. The JavaScript
                                        expressions run against each record
                                        in the source file.

                                        For example, when importing your
                                        Outlook contacts data into the
                                        contacts table in Service Manager,
                                        you can combine the First Name and
                                        Last Name, and then import the
                                        combined value into the
                                        contact.name field in the contacts
                                        table.

                                        First Name: ;John
                                        Last Name: ;Smith

                                        After the combination, a contact
                                        record John, Smith is inserted into
                                        the contacts table in Service
                                        Manager.

                                        To achieve this, you can define the
                                        following statement in the
                                        JavaScript field:

                                          target['contact.name'] =
                                          source['First Name'] + ','
                                          + source['Last Name'];

                                        where the target object represents
                                        the Service Manager target field,
                                        and the source object represents
                                        one record in the source file.

       Field                                                                              Service Manager 9.81
       Update Field Names
       Case Conversion                  Description

       Skip Lines                       Type the list of field names from the
                                        destination table used to uniquely
   9. Click Add.                        identify a record. If Service Manager
                                        finds existing records matching
This PDF was generated on May 23, 2026  these fields, it updates the record
                                        with the data from the import file.

                                        Select one of the following options
                                        to convert record data to a specific
                                        case:

                                             None: Select this option if you
                                             don't want to convert the case
                                             of imported data.
                                             Upper case: Select this option
                                             to convert imported data into
                                             all upper case.
                                             Lower case: Select this option
                                             to convert imported data into
                                             all lower case.

                                        Specify the optional number of lines
                                        to skip at the beginning of the file.

                                                    Note

                                                   When you specify a
                                                   mapping between the
                                                   source columns and
                                                   target fields, you must
                                                   set Skip Lines to 1 which
                                                   means the column
                                                   headers is specified as
                                                   the first line.

                                                                                                                 Page 269 of 307

Add an import descriptor record for a fixed-width
text file.

To add a fixed-width import descriptor record, follow these steps:

   1. Click Tailoring ;> Database Manager.
   2. Click More or the More Actions icon, the form and select Text Import Wizard.
   3. Fill in the following fields.

     ;

Field                                   Description
File to Import
                                        Type or browse to the path and
Member                                  name of the external text file to
Destination Table                       import.

File Type                               This field is obsolete.

                                        Type the database dictionary name
                                        of the table receiving the imported
                                        records.

                                        Select the source operating system
                                        of external file.

4. Click Search.
  Service Manager searches for the external file and displays one of the following
  messages:
        If Service Manager finds the external file but there is not existing import
        descriptor record, Service Manager displays the form to create a new
        import descriptor.
        If Service Manager finds the external file and also finds one or more import
        descriptor records, Service Manager displays a list of import descriptor
        records.
        If Service Manager can't find the external file, it displays an error message.

5. If Service Manager displays a list of import descriptor records, do one of the
  following:
        Click an existing import descriptor record.
        Click New.


6. From the Creating a New Import Descriptor form, select Fixed-width for Input
  File Type.

Field                                        Description
Fixed-width
                                             Select this option if each field in the
                                             file occupies a fixed-width position.
                                             For example, the following are two
                                             records using fixed width positions.
                                             The number field starts at position 1
                                             and ends at position 6.

                                             The open.time field starts at position
                                             8 and ends at position 15.

P1 234567891 1 1 1 1 1

o                                            01 2345

s

it

i

o

n

RI  M1                                  042  1 2/ 29/ 00
e
c
o
r
d
1

RI  M1                                  058  1 2/ 29/ 00
e
c
o
r
d
2


7. Click Proceed.
8. Fill in the following import data definitions.

  ;

       Field                                                                              Service Manager 9.81
       Import Name
       Import Table                     Description
       Import Mode
                                        Type the name of the new import
       Format Control                   descriptor record.
       Field Names
       Field type                       This field lists the destination table
                                        you selected earlier in the wizard.
This PDF was generated on May 23, 2026  This is a read-only field.

                                        Select one of the following options:
                                             Add: Select this option to only
                                             add new records.
                                             Add/Replace: Select this option
                                             to both add new records and
                                             replace existing records. You
                                             may also select this option to
                                             update fields that you define in
                                             the Advanced tab.
                                             Replace only: Select this option
                                             to only replace existing
                                             records.

                                        Type the name of the optional
                                        Format Control record used to
                                        format the incoming records.

                                        Specify the database dictionary field
                                        names receiving the imported record
                                        data. Type one field name for each
                                        source field in the import file.

                                        This is a read-only field and can't be
                                        edited. If Service Manager validates
                                        the data from the import file, it
                                        displays a number describing the
                                        data type.

                                                                                                                 Page 273 of 307
Field                                                                                     Service Manager 9.81
Start Position
Field Length                            Description
Array Type
                                        Service Manager only displays this
Occurrences                             field on fixed-width imports. Type
                                        the column number where data for
                                        this field starts.

                                        Service Manager only displays this
                                        field on fixed-width imports. Type
                                        the number columns that the data
                                        from this field uses.

                                        This is a read-only field and can't be
                                        edited. If Service Manager validates
                                        any array data from the import file, it
                                        displays a number describing the
                                        array type.

                                        Type the number of array elements
                                        to import for this field.

       Field                                                                              Service Manager 9.81
       Date Format
                                        Description
       Query
       Skip                             Type the date and time format used
                                        to import date and time fields. You
This PDF was generated on May 23, 2026  can use the following tokens to
                                        represent units of time:

                                             dd: two digit day
                                             mm: two digit month
                                             yy: two digit year
                                             yyyy: four digit year
                                             hh: hours
                                             ii: minutes
                                             ss: seconds

                                        You can use any character to
                                        separate these tokens. For example,
                                        mm/dd/yyyy hh:ii:ss imports dates
                                        and times with slashes between the
                                        month, day, and four-digit year and
                                        colons between the hours, minutes,
                                        and seconds.

                                        Type a query to select one existing
                                        record from the destination Service
                                        Manager database for updating. If
                                        this query returns a single record,
                                        Service Manager updates this record
                                        with the data from the import file. If
                                        the query returns more than one
                                        record, then Service Manager uses
                                        the Import Mode setting to
                                        determine what action to take.

                                        Type a query to identify records to
                                        skip when adding or updating from
                                        the import file. If this query returns
                                        one or more records, Service
                                        Manager ignores adds or updates
                                        from records matching the query.

                                                                                                                 Page 275 of 307

Field                                   Description
Expressions
Update Field Names                      Type any RAD expressions used to
Case Conversion                         identify records for importing.

Skip Lines                              Type the list of field names from the
                                        destination table to uniquely identify
                                        a record. If Service Manager finds
                                        existing records matching these
                                        fields, it updates the record with the
                                        data from the import file.

                                        Select one of the following options
                                        to convert record data to a specific
                                        case:

                                             None: Select this option if you
                                             don't want to convert the case
                                             of imported data.
                                             Upper case: Select this option
                                             to convert imported data into
                                             all upper case.
                                             Lower case: Select this option
                                             to convert imported data into
                                             all lower case.

                                        Specify the optional number of lines
                                        to skip at the beginning of the file.

   9. Click Add.

Delete or update an import descriptor record.

To delete or update an import descriptor record, follow these steps:

   1. Click Tailoring ;> Database Manager.
   2. Type =import in the Form field.
   3. Select Administration Mode. You must select this option for Service Manager to

     display the Delete button.
   4. Click Search.
   5. Click the form where both the Format Name and File Name equal import.


   6. Click Search again to display a list of import descriptor records.

                   Note

                You may need to click Document ;> Restore to see the list of import
                descriptor records.

   7. Select the import descriptor record you want to update or delete.
   8. To update the descriptor record, update the fields and then click Save.
   9. To delete the descriptor record, click Delete, and then select Yes.

Related topics

Data maps
Exporting records
Importing records
Import descriptor records
Unload files
Purging and archiving records
Unload script utility
Load error messages and notifications
Import a character-delimited text file
Import a fixed-width text file
Load an unload file
Schedule the importing of records using an import descriptor record
Schedule the loading of an unload file
View the contents of an unload file
````
