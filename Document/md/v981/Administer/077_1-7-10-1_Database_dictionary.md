---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.7.10.1 .. 1.7.10.1.6
printed_pages: 1892-1924
---

# 1.7.10.1 Database dictionary

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.7.10.1. Database dictionary

Service Manager maintains a logical view of your RDBMS tables and columns in the
database dictionary. The database dictionary describes each table and column in
your system and how they are mapped to logical entities within Service Manager. The
Service Manager applications use the logical definitions in the database dictionary to
query and manage the actual records in your RDBMS. You must create a database
dictionary record for each table and column in your system.

Every time you add tables and columns for Service Manager to your RDBMS system,
you must also create database dictionary records describing these new items before
Service Manager can make use of them. The best practice we recommend is to
create the database dictionary records first, and then have Service Manager create
the back-end tables and columns for you automatically. Some environments, however,
don't permit Service Manager to add or update records in the back-end RDBMS.

In restricted-access RDBMS environments, Service Manager can create database
definition language (DDL) describing the changes proposed by your database
dictionary records. The RDBMS administrator can then create the necessary tables
and columns for Service Manager . After the RDBMS has the necessary tables and
columns, the Service Manager administrator can then update the database dictionary
records to map to the actual RDBMS objects. To simplify the mapping process,
Service Manager administrators can also import columns from an RDBMS into a
database dictionary record.

You can access database dictionary records either from the System Definition utility
or from the database dictionary form. Both utilities require having the SysAdmin
capability word or its equivalent. We recommend using the System Definition utility to
create database dictionary records if Service Manager has table create-alter-drop-
rights to the RDBMS. If your environment restricts access to the RDBMS, we
recommend using the database dictionary form to create the initial null mappings and
then update the database dictionary by importing the RDBMS tables and columns.

To provide Service Manager with table create-alter-drop-rights to your RDBMS, you
must add the RDBMS connection parameters to the server configuration file (sm.ini).
The RDBMS user name you provide Service Manager must at least have add and drop
access rights. We recommend you grant the RDBMS user owner rights over the
database so that Service Manager can manage the data as needed.

To have the server create DDL for database dictionary changes, you must add the
sqlddllogging and sqlddldirectory parameters to the server configuration file
(sm.ini). The server creates one DDL file for each logical table in the database


dictionary. For example, the file prosummary.ddl contains DDL for changes made to
the probsummary database dictionary record, which in turn, maps to the physical
tables such as PROSUMMARYA1, PROSUMMARYM1, and PROSUMMARYM2 in your
RDBMS. You can enable exporting to DDL independently of providing Service
Manager with table create-alter-drop-rights to the RDBMS. You may want to export all
RDBMS changes to DDL to keep a log of changes to your RDBMS.

Related topics

Data persistence
Automatic update of database dictionary records
Automatic update of RDBMS data when database dictionary records change
Database dictionary data types
Database dictionary records
Create a database dictionary record by importing RDBMS columns
Create an active database dictionary record
Create an inactive database dictionary record
Enable DDL logging of database dictionary changes
Import RDBMS columns into an existing database dictionary record


1.7.10.1.1. Database dictionary records

Database dictionary records define how RDBMS tables and columns map to logical
entities in Service Manager. RDBMS tables map to database dictionaries. RDBMS
columns map to fields. Database dictionary records also contain information about
RDBMS indexes. You must create a database dictionary record for each table and
column you add to Service Manager.

IMPORTANT: We recommend that you refrain from using the following table mapping
options for the disposition of arrays:
--*Field in Alias Table
--*BLOB in Alias Table
Using these mapping options can result in potential performance-related issues and
unexpected product behavior.

Database dictionary records contain the following information.


Database    Brief                       Contents of      Example      Example
dictionary  description                 object           database     RDBMS
object                                                   dictionary   equivalent or
                                                         entry        mapping
Database
dictionary  A logical                   A list of the    probsummar   In Microsoft
name        name for one                main and         y – logical  SQL Server,
            or more                     alias tables in  table        the
            related                     the RDBMS        containing   probsummar
            RDBMS                       that make up     incident     y database
            tables                      the logical      records      dictionary
                                        table                         maps to the
                                                                      following
                                                                      RDBMS
                                                                      tables.

                                                                           PROBS
                                                                           UMMAR
                                                                           YA1 –
                                                                           alias
                                                                           table 1
                                                                           PROBS
                                                                           UMMAR
                                                                           YM1 –
                                                                           main
                                                                           table 1
                                                                           PROBS
                                                                           UMMAR
                                                                           YM2 –
                                                                           main
                                                                           table 2


Database    Brief                       Contents of    Example       Example
dictionary  description                 object         database      RDBMS
object                                                 dictionary    equivalent or
Field name                                             entry         mapping

Field type  A logical                   A value that   category –    In Microsoft
            name for an                 Service        logical       SQL Server,
            RDBMS                       Manager        column        the category
            column                      uses to        containing    field maps to
                                        identify a     the type of   the SQL
                                        field. Field   interaction   name
                                        names can                    CATEGORY
                                        only contain
                                        alphanumeric
                                        characters
                                        and periods.

            An abstract                 A value that   The field     In Microsoft
            data type                   defines the    category has  SQL Server,
            describing                  Service        the Service   the category
            the                         Manager data   Manager data  field maps to
            information in              type. Service  type          the
            the RDBMS                   Manager        character     VARCHAR(50
            column                      uses the                     ) SQL data
                                        abstract data                type
                                        type to
                                        generate
                                        queries,
                                        perform
                                        calculations,
                                        and create
                                        SQL
                                        mappings.


Database     Brief                      Contents of       Example          Example
dictionary   description                object            database         RDBMS
object                                                    dictionary       equivalent or
Field level                                               entry            mapping

Field index  A logical data             A numerical       The field        There is no
             type                       value that        category has     RDBMS
             describing                 Service           the field level  equivalent for
             whether a                  Manager           of 1             field level
             given field is             uses to
             part of a                  determine
             structure or               what level in
             an array of                the logical
             structure                  tree a given
                                        field
                                        occupies

             A parameter                A numerical       The field        In Microsoft
             that                       value that        category has     SQL Server,
             describes                  Service           the field        the
             what order a               Manager           index of 2       CATEGORY
             field                      uses to           and is           column is the
             occupies in                determine the     therefore the    second
             the database               order of a        second field     column in the
             dictionary                 field in the      in the           PROBSUMM
             record                     database          database         ARYM1 table
                                        dictionary        dictionary
                                        record.           record
                                        Service
                                        Manager lists
                                        fields in the
                                        order they
                                        are added to
                                        the database
                                        dictionary.
                                        Fields that list
                                        the same
                                        index number
                                        are aliases.


Database    Brief                       Contents of     Example          Example
dictionary  description                 object          database         RDBMS
object                                                  dictionary       equivalent or
Key type                                                entry            mapping

Key fields  A logical key               A data type     The              In Microsoft
            type                        value that      probsummar       SQL Server,
SQL table   describing an               Service         y database       the unique
alias       RDBMS index                 Manager         dictionary       key number
                                        uses to         uses the         maps to the
                                        determine       unique key       unique index
                                        what SQL        number           NUMBER on
                                        index type to                    the RDBMS
                                        use when                         column
                                        mapping
                                        RDBMS index
                                        data

            A list of fields            A list of the   The              In Microsoft
            that identify               fields that     probsummar       SQL Server,
            the logical                 make up the     y database       the unique
            key                         key definition  dictionary       index
                                                        has a unique     consists of
                                                        key              the NUMBER
                                                        consisting of    column
                                                        the number
                                                        field

            A logical                   An              The              In Microsoft
            name for a                  alphanumeric    probsummar       SQL Server,
            SQL main or                 value that      y database       the SQL table
            alias table                 Service         dictionary       aliases map
                                        Manager         has three        to the SQL
                                        uses to         SQL table        tables
                                        identify an     aliases a1, m1,  PROBSUMM
                                        RDBMS table     and m2           ARYA1,
                                                                         PROBSUMM
                                                                         ARYM1, and
                                                                         PROBSUMM
                                                                         ARYM2


Database    Brief                       Contents of     Example        Example
dictionary  description                 object          database       RDBMS
object                                                  dictionary     equivalent or
                                                        entry          mapping

SQL table   A listing of                A RDBMS         When           In Microsoft
name        the actual                  table name      mapped to a    SQL Server,
            RDBMS table                                 Microsoft      the SQL table
            names that                                  SQL Server,    aliases map
            map to the                                  the            to the SQL
            database                                    probsummar     tables
            dictionary                                  y database     PROBSUMM
                                                        dictionary     ARYA1,
                                                        record lists   PROBSUMM
                                                        the SQL table  ARYM1, and
                                                        names          PROBSUMM
                                                        PROBSUMM       ARYM2
                                                        ARYA1,
                                                        PROBSUMM
                                                        ARYM1, and
                                                        PROBSUMM
                                                        ARYM2

SQL table   A description               A code that     If you are     There is no
type        of the                      identifies the  mapped to a    RDBMS
            RDBMS                       RDBMS           Microsoft      equivalent for
            vendor                      vendor          SQL Server,    SQL type
                                                        the SQL type
                                                        is sqlserver

Related topics

Database dictionary
Database dictionary data types
Create an active database dictionary record
Create an inactive database dictionary record
Enable DDL logging of database dictionary changes
Import RDBMS columns into an existing database dictionary record
Database dictionary data types


1.7.10.1.2. Making database dictionary
changes

Before making database dictionary (dbdict) changes, consider the following behaviors
and constraints.

A database dictionary (dbdict) update will fail if:

     A SQL data type is changed and it's not a change from CHAR to VARCHAR or
     from VARCHAR to CHAR (VARCHAR2 on Oracle).
     A SQL data type is changed and it's not a change from NCHAR to NVARCHAR or
     from NVARCHAR to NCHAR on Microsoft SQL Server or Oracle (NVARCHAR2).
     A SQL data type is changed and it is a change from NCHAR to CHAR or from
     NVARCHAR to VARCHAR on Microsoft SQL Server.
     A SQL data type CHAR or VARCHAR is shortened.
     ALTER TABLE statements were generated but failed to execute.

A full table copy is triggered for any of the following conditions:

     The RC flag changes for any field.
     The alias changes for any field (but not from or to a NULLTABLE alias).
     A new table is defined for a dbdict.
     The SQL dbtype changed significantly. (For example, from one sqlserver2k to
     sqlserver, if those two SQL dbtypes use different sqldb or sqllogin parameter
     values.)

An ALTER TABLE statement will be generated to accomplish any of the following
changes:

     A SQL data type changed from CHAR to VARCHAR, or vice versa (VARCHAR2 on
     Oracle).
     A SQL data type changed from NCHAR to NVARCHAR, or vice versa on
     Microsoft SQL Server.
     A SQL data type changed from VARCHAR to NVARCHAR on Microsoft
     SQL Server.
     A SQL data type changed from NCHAR to NVARCHAR2, or vice versa on Oracle.
     A SQL data type was widened (for example, from CHAR(10) to CHAR(15)).
     A SQL column was renamed.
     A table was renamed.


A DROP TABLE statement will be generated if a table entry was completely removed
from the SQL Tables tab.

If Service Manager determines it doesn't have rights to CREATE a TABLE, it will
assume not having the rights of performing any of the above operations. In that case
it will write all database definition language (DDL) into files in the <RUN directory>/ddl
folder and accept changes to the dbdict without performing any of the above
operations. It will, however, still verify that the SQL type changes are valid.

Related topics

Methods for updating database dictionary records
Methods for deleting database dictionary records
Adding a key
Modifying a key
Deleting a key


1.7.10.1.3. Database dictionary data types

Every field in a database dictionary record requires a data type value to determine the
format of the data in the field. Database dictionary records use an abstract data type
that the Service Manager server uses to determine how to map your system data to
the SQL data type required by your RDBMS. For example, the database dictionary
data type "number" maps to FLOAT in Microsoft SQL server and maps to NUMBER in
Oracle. For a complete listing of how the database dictionary data types map to
RDBMS data types, use the Database Manager utility to view the records in the
sqldbinfo table.

            Caution

           Do not change the data type mappings in the sqldbinfo table unless
           directed to do so by customer support. Changing these values can result
           in data loss or corruption.

            Note

           Starting with Service Manager 9.40, the sqlserver record in the sqldbinfo
           table contains a read-only flag named Use Unicode Data Type to indicate
           if Microsoft SQL Server uses the Unicode data type (nvarchar).

The Service Manager server doesn't automatically validate field data to ensure that it
matches the data type defined in the database dictionary record. If you want to
validate your data prior to submitting it to the RDBMS, you have several options:

     You can customize your forms so that the input field matches the data type. By
     default, Forms Designer uses the data type to determine the input object to use
     when you drag a field on to a form.
     You can create a data policy record for the table and then create validation rules
     for each field in the table you want to validate.
     You can create a format control record for the table and then create validation
     rules for each particular record state such as add, update, delete, or initial
     display.

Once you save data to Service Manager, the RDBMS controls the data type and any
validation. If you change the data type on the RDBMS side, Service Manager can
update the database dictionary record to match the RDBMS data type with a system
restart of the server. We recommend you control data types from the database


dictionary so you don't have to restart your system every time you make a change to
a field.

Service Manager data types also allow you to take advantage of the following
advanced features.

     You can move your system data from one RDBMS type to another
     You can map system data to multiple RDBMS types at the same time

You can use the SQL to SQL Conversion utility to enable one or both of these
advanced features. The SQL to SQL Conversion utility allows you to move or map data
on a table by table basis. It also allows you to customize how you want data in array
fields to be mapped in the new RDBMS as well as offering several export options such
as creating DDL or creating duplicate tables.

Related topics

Automatic update of database dictionary records
Database dictionary
Splitting SQL tables
Database dictionary records
SQL data type for localizable fields
Add a field to an existing database dictionary record
Create an active database dictionary record
Create an inactive database dictionary record
Update the data type of a database dictionary field
Database dictionary data types


1.7.10.1.3.1. Changing data types

A System Administrator can change the type of a scalar field. For example, from a
character field to a number field.

If no data exists in the file, you can edit the field and change the field type quickly
without any other modification required.

If data exists in the file, you must first change the type of the field in the database
dictionary record, and then convert the existing data in the modified field to be
consistent with the new field type. This must be done for all records in the file that
contain data in the modified field.

Related topics

Modify field types: Single to concatenated
Modify field types: Character (scalar) to array
Change data types: Character to number


1.7.10.1.3.2. SQL data type for localizable
fields

Consider the following if you know that a certain data field might contain localized
data:

     MS SQL Server:

Microsoft's SQL Server doesn't offer a UTF-8 codepage. Regular data types such as
VARCHAR, CHAR or TEXT use single byte code pages (such as MS Windows 1252) or
double-byte code pages (such as Shift-JIS), but they can't hold characters out of
multiple regions.
For example, Shift-JIS allows you to store English and Japanese characters, but not
Cyrillic or Portuguese characters. On the other hand, MS WIN 1251 allows you to store
Cyrillic characters but not Japanese.
If you have the requirement to store special characters from many different
languages, you should use the SQL Server data types NVARCHAR, NCHAR, or NTEXT
instead of VARCHAR, CHAR or TEXT. These data types use UTF-16 as a codepage
and therefore are capable of storing special characters from many different
languages. Be careful to use these data types only for fields that should be localized,
and not for fields that will only use English characters, as they take up twice as much
storage space. Also, MS SQL Server has a limitation of 8060 bytes per row in a single
table.

     Oracle:

If you want to store localized data in Oracle, set up your database to use UTF-8 as the
codepage. Service Manager internally uses UTF-8 as the code page and sends data
to the RDBMS clients in UTF-8. By using UTF-8 as the database server's code page,
code page translations aren't necessary, and VARCHAR, CHAR and CLOB data type
can still hold all special characters from all languages.

Related topics

Database dictionary
Database dictionary data types
Create an active database dictionary record
Import RDBMS columns into an existing database dictionary record
Database dictionary data types


1.7.10.1.3.3. Change data types: character
to number

Applies to User Roles: System Administrator

You can change data types by using System Definition, by using Mass update, or by
using the Database Dictionary utility.

Change data types by using System Definition

To change data types by using System Definition:

  1. In the System Navigator, click System Definition > Tables >table_name>
     Fields > field_name.

   2. Double-click the field name.
   3. In the General properties tab, select a new type from the Data type list.
   4. Click Save.

Change data types by using Mass Update

In this example, records have a character in the zip field that's now defined as a
number field.

If some of the records in the file contain data in the modified field that invalidates the
new field type, the data is not converted and the system generates a "can't evaluate"
message for each record failing the conversion.

Service Manager updates only those records that don't fail the conversion.

To change data types by using mass update, use the syntax: zip in
$file=nullsub{val(zip in $file,1),zip in $file} .

Change data types by using the Database
Dictionary utility

This example illustrates how to change the field called zip in the vendor file from a
character type field to a number type field. Assume that data exists in the file.

Note: You must use the Windows client whenever you need to add or edit a field/key
in a database dictionary table.

To change data types by using the Database Dictionary utility:

   1. Click Tailoring > Database Dictionary.


   2. Type vendor in File Name field, and then click Search.
   3. Select the zip field name.

   4. Click Edit Field/Key.

     The field editing window opens.

   5. In the Type field, choose number in the Type list selection.

     This replaces character with number in the Type field.

   6. Click OK to close the window and commit the change to the file.

   7. Click OK to update your database dictionary record.

     The message Record updated in the dbdict file displays to confirm the update.

     Note: This may not be the end of the process. If records exist in the file, you
     need to perform a Mass Update to change the field type of the zip field from
     character to number. (The type of field, for example, character, number, or
     date/time is stored in the data record with each associated value).

     All records containing a value in the field zip need to be updated to reflect the
     new field type. For additional information on the Mass Update procedure, see
     the Database Manager Help.

Related topics

Methods for updating database dictionary records
Methods for deleting database dictionary records
Changing data types
Alias fields
Adding a key
Modifying a key
Deleting a key
Access the Database Dictionary utility
Modify field types: Character (scalar) to array
Modify field types: Single to concatenated
Open a database dictionary
Regen a database dictionary


1.7.10.1.3.4. Database dictionary field data
types

Service Manager uses the following data types to describe field data.


Data type                               Purpose                    Typical RDBMS mapping
Number
Character                               Assumes field data         Service Manager maps
Date/time                               consist of numeric data.   number fields to RDBMS
                                                                   data types reserved for
Logical                                                            numerical data, such as
                                                                   FLOAT or NUMBER.

                                        Assumes field data         Service Manager maps
                                        consist of alphanumeric    character fields to
                                        characters (numbers,       RDBMS data types
                                        letters, special           reserved for
                                        characters).               alphanumeric data, such
                                                                   as VARCHAR or
                                                                   VARCHAR2.

                                        Assumes field data         Service Manager maps
                                        contain a Service          date/time fields to
                                        Manager formatted date     RDBMS data types
                                        or time. Service Manager   reserved for date/time
                                        date/time formats          data, such as
                                        include:                   TIMESTAMP or DATE.

                                        MM/DD/YY
                                        HH:MM:SS
                                        MM/DD/YYYY
                                        HH:MM:SS
                                        DD HH:MM:SS

                                        Assumes the field data     Service Manager maps
                                        contain one of the         logical fields to RDBMS
                                        following logical values:  data types reserved for
                                        true, false, NULL or       single character data,
                                        unknown. Logical fields    such as CHAR.
                                        accept yes or no values
                                        for input, but the server
                                        converts them to true or
                                        false values when
                                        stored.


Data type                               Purpose                   Typical RDBMS mapping

Array                                   The field data are        Service Manager maps
                                        compound data             array fields to RDBMS
                                        elements that contain     data types reserved for
                                        one or more elements of   character large object
                                        a single data type or a   (CLOB) data, such as
                                        structure field.          TEXT.

Structure                               The field data are        Service Manager maps
                                        compound data             structure fields that are
                                        elements that contain     within an array field to
                                        several subfields, each   RDBMS data types
                                        of which may have a       reserved for binary large
                                        different data type.      object (BLOB) data, such
                                        Structures must be child  as IMAGE.
                                        elements of an array
                                        field.

Expression                              The field data contain    Service Manager maps
                                        parsed Rapid Application  expression fields to
                                        Development (RAD)         RDBMS data types
                                        language expressions.     reserved for binary large
                                                                  object (BLOB) data, such
                                                                  as IMAGE.

Label                                   The field data contain    Service Manager doesn't
                                        system data used and      map label fields to any
                                        aren't intended for       RDBMS data type.
                                        customer data.

Record                                  The field data contain    Service Manager doesn't
                                        system data and aren't    map record fields to any
                                        intended for customer     RDBMS data type.
                                        data.

Arrays

An array tracks multiple occurrences of a given field. The values in the field are all the
same field type. For example, you can track all of the components for a printer in the
computer file. To accomplish this, create an array field defined as a character type,


rather than creating multiple scalar fields. A scalar field is a simple data element
comprised of a single occurrence of data (as opposed to an array).

Arrayed structures

An arrayed structure is comprised of more than one field with field type definitions
that may or may not be the same. You can define an arrayed structure to your
database dictionary record to ensure that, on any form (format) attached to a file, you
have the ability to scroll more than one field at a time. When the cursor is in a scrolling
field, associated information in one or more other fields will also scroll. For example,
you can track contact names and phone numbers in a Configuration Item (CI) file.
When scrolling the array of contact names, you can also designate the array of
associated telephone numbers to scroll.

Caution: You can't use the SQL Query method against fields contained within an
arrayed structure.

Structures

See Structures.

Related topics

Database dictionary
Database dictionary data types
Database dictionary records
Add a field to an existing database dictionary record
Update the data type of a database dictionary field
Service Manager Programming


1.7.10.1.3.5. Structures

Structures are used when you have a common group of fields that you want displayed
on multiple formats. For example, Incident Management has the following three
structures defined in the problem database dictionary record:

     Header
     Middle
     Action

The fields defined in the header and action structures are designed for use in every
problem format, regardless of the category. Instead of using the same input fields for
each category format, specific formats are created and then invoked as a subformat
on each category dialog. The fields defined on a given subformat may be of different
type definitions.

Note: On the primary format, the input field defined as a structure is associated with
the subformat containing some or all of the fields defined within that structure. Fields
defined on the given subformat must be defined within the associated structure, but
not all fields defined within the associated structure need to be contained on the
given subformat.

Create a file called employee with many formats attached to the file (many different
views depending on the user profile). A common group of these fields is displayed on
all associated formats. To avoid redundant typing of the same fields on all formats,
define a structure in your database dictionary record and create a separate format to
contain this common group of fields.

Fields within structures

It is important to define fields within structures when these fields exist on a format(s)
associated with the input field structure name. To define fields within structures, your
cursor (focus) must be on the structure name in the database dictionary record. If
fields don't need to be defined within a given structure in a database dictionary
record, the cursor should be positioned on the descriptor structure when adding the
fields.

Organization of arrays of structure in the Database
Dictionary

In each database dictionary, an array of structures appears in a group. The group is
organized hierarchically, with the field of type array listed first. The field of type


structure is listed next, and is indented once from the field of type array. The
remaining fields are indented and listed below the field of type structure, and can be
of types Character, Number, Location, or Date/Time.

Example: Arrayed structure

An example of an arrayed structure is an unavailability graph. This structure is defined
in the standard Configuration Item (CI) files distributed with the Configuration
Management application.

To create your own CI files and track availability, add the following availability fields to
the CI files:

Database Dictionary field name          Field type
number.of.problems                      number
explicit.unavailability                 date/time
implicit.unavailability                 date/time
perceived.unavailability                date/time
start.of.operating.hours                date/time
graph.of.unavailability                 array
graph.of.unavailability                 structure
date                                    date/time
graph                                   character

The field names must be spelled exactly as they are shown in the above table and
defined with the specified field type.

In this example, there is a devicepc file for which you want each record within this file
to contain statistical information on availability.

Notes:

     The graph fields must also be added to the CI formats.
     You must use the Windows client whenever you need to add or edit a field/key in
     a database dictionary table.


Add availability fields that pertain to the devicepc file

   1. Sign in to the Service Manager system with a system administrator account.
   2. Click Tailoring > Database Dictionary.
   3. In the File Name field, type devicepc, and then click Search.

   4. Place the cursor on the descriptor field, and then click New Field/Key.

     The field window opens.

   5. In the Name field, type graph.of.unavailability.
   6. Click the list in the Type field and choose array.

   7. Click Add.

     The message Enter data type of array's element displays at the top of the screen
     and the window refreshes.

     The Name field still displays graph.of.unavailability, but the Type field is blank.

     To create an arrayed structure, define the type of array as a structure, such as a
     character, number, or date and time structure.

     Click the list in the Type field and choose structure.

   8. Click Add.

     There are two entries in the database dictionary record for the field
     graph.of.unavailability. The first entry defines the field as an array. The second
     entry defines the data type for the array. Both entries are listed as
     graph.of.unavailability. The system default, which can be overridden, is to use
     the same field name for both entries.

     The two entries are added to the bottom of the list of fields in the devicepc
     database dictionary record.

     Note: The second entry is indented in the above example. This occurs only if the
     number of fields specified in the record is less than 50.

Associate the new field to the structure

  1. Tab to the second occurrence of the graph.of.unavailability field, the structure
     type.

     For any field to be part of a structure, the cursor must be positioned on that
     structure field name before clicking New for the new field to be associated with
     it.


   2. Click New.

     The Structure field contains the value graph.of.unavailability, which is the
     current structure to which you are adding fields.

   3. In the Name field, type date.
   4. Click the list in the Type field and choose date/time.

   5. Click Add.

     The date field is displayed under the structure field graph.of.unavailability.

  6. Select the second occurrence of the graph.of.unavailability field, the structure
     type.

     Note: For any fields to be part of a structure, the cursor must be positioned on
     that structure field name before clicking New.

   7. Click New.

     Notice the Structure field contains the value graph.of.unavailability, which is
     the current structure to which you are adding fields.

   8. In the Name field of the window, type graph.
   9. Click the list in the Type field and choose character.

 10. Click Add.

     The graph field is added as the last field under the structure field
     graph.of.unavailability, and the message graph field added to the pcdevice file
     is displayed.

     In this example, the graph field is behind the window at the bottom of the
     screen.

When you have completed adding fields to the database
dictionary record

   1. Click OK.

     This closes and automatically updates the file. The message Record updated in
     the dbdict file displays when complete.

   2. Press Back to end the database dictionary session and return to the main menu.

You have now added all of the required fields comprising the graph.of.unavailability
structure. You can now edit your database dictionary record again, update it, or
cancel without updating.


Note: You must update your database dictionary record when adding a new field or
the database dictionary record will remain the same. You must also add new fields to
the appropriate formats in Forms Designer.

Create the unique and attribute subtables

Applies to User Roles: System Administrator

You must use the Windows client whenever you need to add or edit a new field/key in
a database dictionary table.

To create the unique and attribute subtables:

   1. Name the unique and attribute files.
        1. Search for the dbdict from which you want to create subtables. In this
           example, the device dbdict is used.

        2. Scroll down the Type column to locate an array of structures.

           Note: An array of structures is identified by an Array field type with a field
           of the same name.

        3. Type Structure directly below the Array field. The Structure field name is
           indented. In this example, the array of structures is features.

        4. Locate the features field of Type Structure .
        5. Insert your cursor in the Type column for the features structure field.
        6. Click Edit Field/Key.

        7. In the field.window dialog box, type a name for the attribute file. The
           standard naming convention for the attribute file is: dbdict + array + attr. In
           this example, the attribute file is named devicefeaturesattr.

           Note: No spaces or special characters are allowed in the subtable names.

        8. In the field.window dialog box, type a name for the unique file. The
           standard naming convention for the unique file is: dbdict + array + uniq. In
           this example, the unique file is named devicefeaturesuniq.

           Note: If the attribute file field is left blank, only the unique subtable will be
           created.

        9. Click OK.
   2. Designate unique fields in the array of structure.

        1. Locate the field you want to designate as unique. In this example, the
           unique field is feature.id.


        2. Insert your cursor in the Type column for the field you want to designate as
           unique.

        3. Click Edit Field/Key.
        4. Click the Unique in Structured Array checkbox.
        5. Click OK.
        6. Repeat steps a to e for each field you want to designate as unique.
   3. From the database dictionary, click OK.

Service Manager updates the dbdict and creates the unique and attribute subtables
from the array of structures.

Name the unique and attribute files

Applies to User Roles: System Administrator

To name the unique and attribute files:

   1. Search for the dbdict from where you want to create subtables.
     In this example, the device dbdict is used.

   2. Scroll down the Type column to locate an array of structures.

     Note: An array of structures is identified by an Array field type with a field of the
     same name.

   3. Type Structure directly below the Array field. The Structure field name is
     indented.
     In this example, the array of structures is features.

   4. Locate the features field of Type Structure .
   5. Insert your cursor in the Type column for the features structure field.
   6. Click Edit.

   7. In the field.window dialog box, type a name for the attribute file.

     The standard naming convention for the attribute file is: dbdict + array + attr.

     In this example, the attribute file is named devicefeaturesattr.

     Note: No spaces or special characters are allowed in the subtable names.

   8. In the field.window dialog box, type a name for the unique file.

     The standard naming convention for the unique file is: dbdict + array + uniq.

     In this example, the unique file is named devicefeaturesuniq.


     Note: If the attribute file field is left blank, only the unique subtable will be
     created.

   9. Click OK.

View the unique and attribute subtables

Applies to User Roles: System Administrator

To view the unique and attribute subtables:

   1. Click Tailoring > Database Manager.
   2. Search for the dbdict that contains the array of structures from which the

     subtables were created. The unique and attribute files you named should appear
     in the record list.
   3. Double-click on the file you want to view.

Related topics

Alias fields
Adding a key
Methods for updating database dictionary records
Modifying a key
Methods for deleting database dictionary records
Deleting a key
Add a structure to the database dictionary
Add fields to a structure
Create an active database dictionary record


1.7.10.1.3.6. Splitting SQL tables

The Service Manager server reads the row size limitation and column number
limitation from file "sqldbinfo" and uses the information when making a decision about
whether to split SQL tables or not. This applies to all supported database servers.

            Note

           By default, for SQL Server, all fields are put into M1 and will never be put
           into M2 or other “M” tables.

Caution

Modifications to the "sqldbinfo" table require a restart of the Service
Manager server.

Constraints when disabling the row size limitation on SQL Server

If you want to disable the row size limitation on SQL Server, you need to consider the
following constraints:

     The length of individual columns must still fall within the limit of 8,060 bytes for
     varchar, nvarchar, varbinary, sql_variant, and CLR user-defined type columns.
     Only their combined lengths can exceed the 8,060-byte row limit of a table.
     The sum of other data type columns, including char and nchar data, must fall
     within the 8,060-byte row limit. Large object data is also exempt from the 8,060-
     byte row limit.
     After removing the row size limitation, if a file does have an M2 table, before you
     manually move all of the fields in M2 into M1, newly added fields will still be put
     into M2.
     If you want to disable table splitting, you need to manually set the row size
     limitation in the “sqldbinfo" table to a very large number, which is supported by
     SQLSERVER 2008 and later with ROW_OVERFLOW_DATA. The Row-Overflow
     feature is great for allowing occasionally rows longer than 8,060 bytes, but it's
     not well suited for the majority of rows being over-sized, which can lead to a
     drop in query performance.

Related topics

Automatic update of database dictionary records
Database dictionary


Database dictionary records
SQL data type for localizable fields
Add a field to an existing database dictionary record
Create an active database dictionary record
Create an inactive database dictionary record
Update the data type of a database dictionary field
Database dictionary data types


1.7.10.1.4. Alias fields

An alias field is a field that has a different name but the same index, level, and type as
an existing field. Alias fields are used to streamline file maintenance; force fully keyed
queries, such as those in the Incident Management and Service Desk applications;
and facilitate virtual joining. Alias fields are only supported for scalar fields of the
following data types: number, character, date/time, logical. The functionality is not
designed for other data types like arrays and structures.

If regular purge and archive tasks are performed on files with different field names for
the search criteria, such as close.time in the problem and probsummary files,
msg.time in the msglog file, and evtime in the eventin file, you can build an alias
in each file called archive.time and then perform all archive activity based on
archive.time without regard to the file name.

            Note

           For the table whose dbdict structure is similar to table cm3r, the
           performance of alias field query may be slow. For example, the alias field
           query of the field header,number .

In Service Desk and Incident Management, alias keys are used to ensure that a fully
keyed query is performed each time an argument is entered from a record list.

Source fields are defined as an alias when they must be defined as both a normal link
and a virtual join; and the target file or field is different. For example, in the devicepc
database dictionary record and the device.pc format and link records, the
vj.logical.name field is the alias of the logical.name field.

Related topics

Structures
Adding a key
Methods for updating database dictionary records
Modifying a key
Methods for deleting database dictionary records
Deleting a key
Add an alias field
Add a field to an existing database dictionary record
Create an active database dictionary record


1.7.10.1.5. Access the database dictionary
utility

Applies to User Roles: System Administrator
Use one of the following methods to access the Database Dictionary utility:

     To access the Database Dictionary utility from the System Navigator, click
     Tailoring > Database Dictionary.
     To access the Database Dictionary utility from the Service Manager command
     line, type dbdict in the command line, and then press Enter.

Related topics

Copying a database dictionary
Rename a database dictionary
Regen a database dictionary


1.7.10.1.6. Enable DDL logging of database
dictionary changes

Applies to User Roles: System Administrator
You must have administrative access to the server operating system to use this
procedure.
To enable Database Definition Language (DDL) logging of database dictionary
changes:

   1. Sign in to the server running Service Manager.
   2. Stop the Service Manager server.
   3. Open the Service Manager initialization file ( sm.ini ) with a text editor.
   4. Add the following parameters to enable DDL logging of database dictionary

     changes:

          sqlddllogging:1
          sqlddldirectory:<path>

     For <path> , specify the relative path to the directory where you want Service
     Manager to save DDL files. This path is relative to the server's RUN directory.
   5. Save the Service Manager initialization file.
   6. Restart the Service Manager server.

Related topics

Database dictionary
Database dictionary records
Create an active database dictionary record
Create an inactive database dictionary record
````
