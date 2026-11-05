---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.6.5 .. 1.6.5
printed_pages: 2063-2095
---

# 1.6.5 Database (RDBMS) mapping

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.6.5. Database (RDBMS) mapping

The Service Manager database dictionary (DBDICT) contains a logical definition of
the tables and columns that make up your relational database management system
(RDBMS). Each DBDICT record maps a Service Manager logical file to one or more
RDBMS table and a Service Manager logical field to an RDBMS column. In addition,
database dictionary records specify what data type the system uses to store data in
the RDBMS.

Related topics

How do I create good RDBMS mappings?
Mapping rights


1.6.5.1. How do I create good RDBMS
mappings?

The following tips will help you create good mappings between your Service Manager
DBDICT records and your RDBMS.

     Use the DBDICT utility to create and update RDBMS mappings. See Database
     dictionary (DBDICT) utility.
     Provide Service Manager with create, alter, and drop table rights. See Mapping
     rights.
     Choose an array mapping that meets your data access needs. See Array
     mapping options.
     Only change data type mappings to increase the column width and between
     character data types. See Valid data type changes.
     Know when your database dictionary changes will cause Service Manager to
     add, update, or delete RDBMS mappings. See When are RDBMS mappings
     added or updated?.

Related topics

Database dictionary (DBDICT) utility
Mapping rights
Array mapping options
Valid data type changes
When are RDBMS mappings added or updated?


1.6.5.2. Database dictionary (DBDICT)
utility

The database dictionary (DBDICT) utility allows you to view, create, and update the
Service Manager logical files, fields, and keys that your system maps to tables,
columns, and indexes in your relational database management system (RDBMS).

            Important

           When modifying a dbdict record, ensure that there are no other users
           updating existing records or inserting new records in the same file;
           otherwise errors will occur. For example, when updating the
           probsummary dbdict, make sure that there are no other users updating
           existing incidents or opening new incidents.

           Do not change (add, modify, or delete) any of the Service Manager
           system tables, such as the scmessage table. These tables are used by
           Service Manager to provide the basic functionality that allows the system
           to function. In addition, use extreme caution when modifying the records
           in a system table.

The key benefits of the DBDICT utility over other database management utilities are:

    You can define or change how Service Manager maps array data
    You can create database definition language (DDL) for any additions and changes
    in environments where Service Manager doesn't have access rights to your
    RDBMS
    You can view and create mappings to null tables in environments where Service
    Manager doesn't have access rights to your RDBMS
    You can create mappings by importing columns from your RDBMS

            Caution

           Do not change the NLS_LENGTH_SEMANTICS parameter value
           from Byte to CHAR in Oracle databases.
           For details, see NLS_LENGTH_SEMANTICS in Oracle Database Reference.

See the Service Manager help for more information about using the DBDICT utility to
create database dictionary records.


1.6.5.3. Mapping rights

As of version 7.11, your Service Manager system automatically determines if it has the
rights to create, alter, and drop tables. If it has such rights, then Service Manager will
automatically update your RDBMS anytime you make changes in a DBDICT record.

If it doesn't have these rights, Service Manager creates a null table mapping to act as
a placeholder until you can update the DBDICT record with the actual table and
column mappings. In addition, Service Manager offers the option to export
DBDICT record changes as database definition language (DDL) so that a database
administrator (DBA) can review and manually make the desired changes to the
RDBMS. After the DBA has added the needed tables and columns, you can import the
actual table and column mappings into the DBDICT record.


1.6.5.4. Array mapping options

In a database dictionary record, an arrays contain one or more elements of a single
data type or a structure field. If an array contains a structure element it is referred to
as an array of structure. Arrays of structure contain one or more fields that can be of
any data type.

You can map your array data in the following five formats.

     Field in main table
     Field in alias table (Deprecated)
     BLOB in main table
     BLOB in alias table (Deprecated)
     Multi-row array table

The array mapping format you choose determines the following factors about your
array data.

     Can your RDBMS directly query your array data?
     Can third-party tools report against your array data?
     Is your array data stored with other fields in one or more main tables?
     Is your array data stored separately in one or more dedicated alias tables?
     Can your array support complex arrays of structure?
     How efficiently does your system retrieve and write data to your array?

Field in main table

The field in main table format maps a Service Manager array field as a character large
object (CLOB) within a main table. This array format is good for situations where the
following conditions apply:

     You want to be able to use third-party tools to run reports against your array
     data
     You want the option to store very large array elements
     You don't want to remap an existing array

The following table summarize the advantages of using this array mapping format.


Advantage                               Advantages

                                              Description

Third-party tools can report against the  Service Manager stores array data as a
array                                     character string that third-party
                                          reporting tools can read. The system
                                          separates each element of the array
                                          with a \n character delimiter.

The array can store very large array      Since the array is mapped to a
elements                                  character large object column, the
                                          column can occupy a large amount of
                                          space. Most RDBMS vendors support
                                          at least 2 gigabytes of large object data
                                          in such a column.

The array has access to other fields in   There is a greater probability that other
the main table                            fields reside in the same main table as
                                          the array. Having all or most of your
                                          fields in a main table reduces the
                                          number of SELECT and
                                          JOIN statements your system has to
                                          make to fetch a record. The less
                                          RDBMS traffic required, the better
                                          performance your queries and reports
                                          will have.

There is no need to remap if you use      The field in main table format is Service
the default array mapping format          Manager's out-of-box array mapping
                                          format. Unless someone has changed
                                          the default array mapping format, all
                                          your array data will automatically be in
                                          this format.

The following table summarize the disadvantages of using this array mapping format.


Disadvantage                            Disadvantages

                                               Description

The RDBMS can't directly query the       Most RDBMS vendors can't query a
array                                    column containing a reference to
                                         character large object data.

Any query against the array is           The RDBMS can't directly query this
inefficient                              array format because the column is
                                         mapped to a large object data type.
                                         Instead, the RDBMS must scan the
                                         table to return all rows of the large
                                         object column, and then forward the
                                         results to Service Manager for
                                         evaluation.

The array shares table space with other  The array doesn't have a dedicated
fields in the table                      table in which to store data. Each
                                         RDBMS vendor has its own rules to
                                         determine the maximum number of
                                         columns allowed in a table, the
                                         maximum size of any row, and the
                                         maximum table size. Any array in a
                                         main table will consume some of these
                                         RDBMS resources. If an array requires
                                         more resources than any one main
                                         table can provide, Service Managerwill
                                         move the array to another main table.

To set up an array in a field in main table mapping, you must create the following
mappings in a database dictionary record.

Database dictionary element type         RDBMS mapping required
Array data type
Sub-field of the array                   Not mapped

RC flag                                  Mapped as a CLOB column in a main
                                         table

                                         False


Field in alias table (Deprecated)

The field in alias table format maps a Service Manager array field as a character large
object (CLOB) within an alias table. This array format is deprecated. In earlier
versions, this format was intended to support the following features:

     Your RDBMS vendor could only support one "long" data type per table (This is
     still a restriction on Oracle databases but can be worked around by using CLOB
     and BLOB data types instead.)
     You wanted the option to store very large array elements
     You wanted to be able to use third-party tools to run reports against your array
     data

You should use one of the following array formats instead of the field in alias table
format.

     Field in main table
     BLOB in main table
     Multi-row array table

BLOB in main table

The BLOB in main table format maps a Service Manager array field as a binary large
object (BLOB) within a main table. This array format is good for situations where the
following conditions apply:

     Your array data is in a binary format (such as attachment data or RAD language
     expressions)
     You want the option to store very large array elements
     You want to support complex arrays of structure
     You don't need to use third-party tools to run reports against your array data

The following table summarize the advantages of using this array mapping format.


Advantage                               Advantages

                                              Description

Preservation of any native binary data   The RDBMS doesn't have to do any
                                         code page translations to store binary
                                         data in the array. Since there is no
                                         translation from a binary format to a
                                         character-based format, there is no
                                         chance that the translation will result in
                                         data corruption such as high-bit
                                         characters becoming question marks.

The array can store very large array     Since the array is mapped to a binary
elements                                 large object column, the column can
                                         occupy a large amount of space. Most
                                         RDBMS vendors support at least 2
                                         gigabytes of large object data in such a
                                         column.

The array has access to other fields in  There is a greater probability that other
the main table                           fields reside in the same main table as
                                         the array. Having all or most of your
                                         fields in a main table reduces the
                                         number of SELECT and
                                         JOIN statements your system has to
                                         make to fetch a record. The less
                                         RDBMS traffic required, the better
                                         performance your queries and reports
                                         will have.

Support for complex arrays of structure This array format supports complex
                                              arrays of structure such as an array of
                                              structure within an array of structure.

The following table summarize the disadvantages of using this array mapping format.


Disadvantage                            Disadvantages

                                               Description

Third-party tools can't report against  Service Manager stores array data in a
the array                               proprietary binary format that third-
                                        party reporting tools can't read.

The RDBMS can't directly query the      Most RDBMS vendors can't query a
array                                   column containing a reference to
                                        character large object data.

Any query against the array is          The RDBMS can't directly query this
inefficient                             array format because the column is
                                        mapped to a large object data type.
                                        Instead, the RDBMS must scan the
                                        table to return all rows of the large
                                        object column, and then forward the
                                        results to Service Manager for
                                        evaluation.

To set up an array in a field in main table mapping, you must create the following
mappings in a database dictionary record.

Database dictionary element type        RDBMS mapping required
Array data type
                                        Mapped as a BLOB column in a main
Sub-field of the array                  table
RC flag
                                        Not mapped

                                        True

BLOB in alias table (Deprecated)

The BLOB in alias table format maps a Service Manager array field as a binary large
object (BLOB) within an alias table. This array format is deprecated. In earlier
versions, this format was intended to support the following features:

     Your RDBMS vendor could only support one "long" data type per table (This is
     still a restriction on Oracle databases but can be worked around by using CLOB
     and BLOB data types instead.)


     You want the option to store very large array elements
     You want to support complex arrays of structure
     You don't need to use third-party tools to run reports against your array data

You should use one of the following array formats instead of the BLOB in alias table
format.

     Field in main table
     BLOB in main table
     Multi-row array table

Multi-row array table

The multi-row array table format maps a Service Manager array field as a character
string within one or more rows in an alias table. This array format is good for
situations where the following conditions apply:

     You want to be able to run RDBMS queries on your array data
     You want to be able to use third-party tools to run reports against your array
     data
     You want the option to store very large array elements
     You want to support simple arrays of structure

The following table summarize the advantages of using this array mapping format.


Advantage                               Advantages

                                              Description

The RDBMS can directly query the          In this array format, Service Manager
array                                     stores each array element as a simple
                                          character string in one or more rows.
                                          This format allows RDBMS queries to
                                          read each individual array element
                                          without needing to forward the query
                                          to Service Manager for evaluation.

Third-party tools can report against the  Service Manager stores each element
array                                     of the array in its own separate row.
                                          Third-party reporting tools can read
                                          the row and extract the element value.

There is no risk of data truncation for   Each array element occupies as many
new array elements                        rows as necessary to store the full
                                          element. This means that the length of
                                          the array element is not limited by the
                                          length of the column. Any array
                                          element that exceeds the column
                                          length for one row continues onto the
                                          next row. This feature prevents Service
                                          Manager from truncating array element
                                          data.

Support for simple arrays of structure    This array format supports simple
                                          arrays of structure such as an array of
                                          structure within an array of structure.

The following table summarize the disadvantages of using this array mapping format.


Disadvantage                            Disadvantages

                                               Description

Service Manager must maintain a           In order to fetch a record, the system
separate table                            must make SELECT and
                                          JOIN statements between the main and
                                          alias tables. These statements require
                                          more RDBMS traffic and can lower your
                                          RDBMS performance.

The array uses more table rows            Each array element will require one or
                                          more table rows. Each time you fetch
                                          an array record, the system must select
                                          multiple rows from an alias table. The
                                          more rows the system has to select,
                                          the more costly your record retrieval is
                                          in terms of RDBMS performance.

To set up an array in a field in main table mapping, you must create the following
mappings in a database dictionary record.

Database dictionary element type          RDBMS mapping required
Array data type
Sub-field of the array                    Mapped to an alias table

RC flag                                   Mapped as a character column in a
                                          main table

                                          False

Contents

     1 Field in main table
     2 Field in alias table (Deprecated)
     3 BLOB in main table
     4 BLOB in alias table (Deprecated)
     5 Multi-row array table


1.6.5.5. Example: Remapping an array

The following example illustrates remapping an array from a field in main table format
to a multi-row array table format. Typically, you would remap a field in main table
array in order to improve your query performance. Using a multi-row array table array
format allows the RDBMS to directly query the array rather than having to forward the
query to Service Manager for evaluation.

Related topics

Existing array mapping
Existing array query performance
Prepare to remap the array
New array mapping
New array query performance


1.6.5.5.1. Existing array mapping

Suppose you want to remap the assignment.groups array field in the operator table
from a field in a main table array to a multi-row array table array. To ensure that your
tailoring efforts don't negatively impact your system, you should first make a copy of
the operator table. For example, create a new table called hpeoperator .

The existing array might be mapped as follows on a Microsoft SQL Server RDBMS.


                                        Existing array field mapping: field in main

Database dictionary field               Value

Name                                    assignment.groups

Type                                    array

Level                                   1

Index                                   88

SQL Name

SQL Type

SQL Table

SQL RC

Since this is a field in main table mapping, the array itself has no direct mapping on
the RDBMS. Only the array's sub-field has a SQL mapping.

                                        Existing sub-field mapping: field in main

Database dictionary field               Value

Name                                    assignment.groups

Type                                    character

Level                                   2

Index                                   1

SQL Name                                ASSIGNMENT_GROUPS

SQL Type                                TEXT

SQL Table                               m1

SQL RC                                  False


The sub-field of the array is mapped to a character large object data type. For
example, TEXT is a character large object data type in Microsoft SQL Server.

Related topics

Existing array query performance
Prepare to remap the array
New array mapping
New array query performance


1.6.5.5.2. Existing query performance

Suppose you make the following Service Manager expert search from the Search
Interaction Records form.

assignment.groups="Application"

If you enable the sqldebug:1 parameter, you can see that Service Manager converts
this query in the following SQL statement:

SELECT NAME, ASSIGNMENT_GROUPS FROM HPOPERATORM1 WHERE
ASSIGNMENT_GROUPS='Application';

However, since the ASSIGNMENT_GROUPS column is in a character large object data
type, the RDBMS can't query the field directly. Instead, the RDBMS must forward each
row to Service Manager for it to evaluate the contents of the array. Using the out-of-
box data, this query returns all 18 sample incident rows.

Operator ID         18 rows forwarded to Service Manager for evaluation

                                           Assignment Groups

CMS.Process                             Application, Hardware, Network

Catherine.Campbell                      Application, Network, Office Support
                                        (North America) SAP Support (North
                                        America)

...                                     Application, ...

Rachel.Boudreau                         Application, E-mail / Webmail (North
                                        America), Network, SAP Support
                                        (North America)

Because of the inefficiency of this query, the system produces performance alert
messages.

Partial File Scan for query involving fields {assignment.groups}
(se.search.engine,select.records)

SQL Query incomplete because field (assignment.groups) in file (hpoperator) can't
be used in an SQL query (se.search.engine,select.records)


Hit Ratio not achieved on file hpoperator and query
(assignment.groups="Application"): Of 101 records checked so far, 94 did not match
the query (display,show.rio)

A partial file scan has two adverse performance impacts on your system:

     The RDBMS uses network traffic to send rows to Service Manager
     Service Manager must search within the array of each row the RDBMS forwards
     to it
     The hit ratio can be low for such queries

Related topics

Existing array mapping
Prepare to remap the array
New array mapping
New array query performance


1.6.5.5.3. Prepare to re-map the array

Before you remap your array, you need to determine the answers to following
questions.

     What's the next free alias table for the database dictionary record?
     What SQL data type will the array sub-element require?
     What length should your character fields have?

Determine the next free alias table

To remap the array as a multi-row array table, you must first determine what the next
free alias table is for the database dictionary record. You can see what alias tables are
already in use from the SQL Tables tab of the database dictionary record.

In this case, the incidents database dictionary already has five existing alias tables, so
the next free alias table is a6. We shall create a new alias table called a6 that will store
our remapped array data.

Determine the data type of the array sub-element

Next, determine what data type the array sub-element will require in SQL terms. You
can use the Service Managersqldbinfo table as a guideline for mapping a Service
Manager data type to a SQL data type. For example, the assignment.groups sub-
element uses the character data type. According to the sqldbinfo table, a character
data type maps to a varchar data type on Microsoft SQL server.


Verify that your SQL data type mapping meets your data needs. Ideally, you want to
identify the source of your data and match its SQL mapping. For example, the source
of the assignment.groups field in the operator table is the name field in the
assignment table. When you look at the database dictionary for the source data, you
see that the source data is mapped as a varchar(60) data type.

In this example, we shall remap the array sub-element to use the varchar(60) data
type to match the source data type.

Determine the length of character fields

If you want to remap your array sub-element with a simple character data type, you
must choose a length for the character field. Remember that multi-row array tables
can't use character large object data types. There are two methods to determine an
appropriate length for your character data.

     Match the length of the data source (preferred)
     Review your existing data and add a padding

Ideally, you want to identify the source of your data and match its SQL mapping. For
example, the source of the assignment.groups field is the name field of the
assignment table. Since the name field is mapped as a varchar(60) data type, we
will map our array to the same length of varchar(60).


You can also use your existing data to determine the proper size of your character
fields. For example, if you review the source data of the assignment.groups field, you
will see text strings from 20 to 40 character long.

You could therefore remap this data as a varchar(40) data type and likely not lose any
data. However, you may want to provide the option to store assignment groups more
than 40 characters long without having to store the array elements in separate rows.
In this case, you may want to use a larger value such as varchar(50) or varchar(60).

When choosing a length value, you want to avoid selecting a SQL length shorter than
the maximum length of your existing data. The system will wrap any existing data that
exceeds the SQL length of the character field into a new row. Wrapping data into a
new row can result in data corruption and broken queries. For example, if you select a
length of varchar(10), then you any existing assignment group longer than ten
characters will wrap into two or more rows. Using this mapping, the system would
change an existing assignment group of "Application" to have one array element row
with the value "Applicatio" and another array element row with the value "n". Any
RDBMS query searching for the value "Application" would fail because there is no
longer one element with this value.

Contents

     1 Determine the next free alias table
     2 Determine the data type of the array sub-element
     3 Determine the length of character fields


1.6.5.5.4. Remap array fields to an alias
table

To improve your query performance, you can move an existing array field or an array
of structure field to an alias table (for example, a1).

            Important

                The " field in alias" and "BLOB in alias" mapping formats are
                deprecated. The multi-row array mapping format is recommended.
                You can revert your remapping changes by moving the field back to
                the main table, removing the alias table, and restoring the original
                SQL configuration.
                It may take some time if the table includes large amounts of records.

Array

You can remap an array field to an alias table using the multi-row array mapping
format.

To remap an array field using the multi-row array mapping format, follow these steps:

   1. Sign in to the Service Manager Windows client as a system administrator.
   2. Type dbdict in the command line, and press Enter.
   3. Open the dbdict that you want to update by performing a search.
   4. Select the Fields tab.
   5. Select the field of the array type, and click Edit Field/Key.

   6. Enter a value in the fields as described in the following table.

                   Note

                As an example, the following table lists the SQL Type values allowed
                for an array of characters. For other types of arrays, the allowed SQL
                Type values may differ.
                Note that both lines of the field should be mapped to the alias table.


Mapping        SQL Name SQL Type SQL Table SQL RC
format
               MULTI_ROW TEXT,                                  a1     False
Multi-row
array          _ARRAY                             varchar,

                                                  char,

                                                  nvarchar, or

                                                  nchar

   7. Click OK.

Array of structure

To remap an array of structure using the multi-row array mapping format, follow these
steps:

   1. Sign in to the Service Manager Windows client as a system administrator.
   2. Type dbdict in the command line, and press Enter.
   3. Open the dbdict that you want to update by performing a search.
   4. Select the Fields tab.

   5. In the array of structure, select the top level field (whose type is array), change
     its SQL Table field value to a1 and leave the rest of the fields empty.

   6. Select the middle level field (whose type is structure), and make sure its SQL
     Name, SQL Type, and SQL Table fields are empty.

   7. Select each element under the structure, and enter a value in the fields as
     described in the following table.

Note

As an example, the following table lists the SQL Type values allowed
for a structure element of the character data type. For elements of
other data types, the allowed SQL Type values may differ.

SQL Name                                SQL Type            SQL Table  SQL RC
                                                            a1         False
<FIELD_NAME_1                           TEXT, varchar,
>                                       char, nvarchar,
                                        or nchar


   8. Click OK.

Related concepts

Existing array mapping
Existing array query performance
Prepare to remap the array


1.6.5.5.5. New array mapping

Suppose we have chosen to remap our assignment.groups array to a multi-row array
table with the following values.

Mapping option                          Multi-row array table remapping options

                                                          Value

Next available alias table              a6

Array field remapped to alias table     a6

Array sub-element remapped to alias a6
table

Array sub-element remapped to simple VARCHAR
data type

Array sub-element length remapped to VARCHAR(60)
appropriate value

You can use the following steps to remap the agreement.ids field from a field in the
main table array to a multi-row array table.

   1. Open the hpeoperator file in the database dictionary utility.
   2. Double-click on the assignment.groups array field.
   3. In the SQL Table field, type a6 .
   4. Click Next to change the mapping of the array sub-element.
   5. In the SQL Name field, verify that the column name meets the naming

     conventions for your RDBMS. For example, AGREEMENT_IDS is a valid name for
     a Microsoft SQL Server column.
   6. In the SQL Type field, type VARCHAR(60) .
   7. In the SQL Table field, type a6 .
   8. Click OK to update the mapping
   9. Click OK to save the incident database dictionary record. Service Manager
     displays remapping status messages in the top right of the form.


Related topics

Existing array mapping
Existing array query performance
Prepare to remap the array
New array query performance


1.6.5.5.6. New array query performance

Suppose we re-use the same Service Manager expert search from the Search
Interaction Records form.

assignment.groups="Application"

Service Manager generates a new SQL statement that joins the main and alias tables:

SELECT m1."NAME" FROM HPOPERATORM1 m1 JOIN HPOPERATORA6 a6 ON
(m1."NAME" = a6."NAME") WHERE ((a6."ASSIGNMENT_GROUPS"='Application'));

The join statement requires some additional system resources that the old query did
not, however since the ASSIGNMENT_GROUPS column is now a simple character data
type, the RDBMS can query the field directly. While the query still returns the same 18
sample operator records, this time it doesn't have to forward any rows to Service
Manager for evaluation. Nor does running this query generate performance warning
messages. This means that the new query is more efficient despite the added
overhead of a join statement.

Related topics

Existing array mapping
Existing array query performance
Prepare to remap the array
New array mapping


1.6.5.6. Valid data type changes

You can only change existing database dictionary mappings under certain conditions.
If your database dictionary change doesn't fall within one of the following conditions,
you will have to create a new database dictionary mapping to replace the existing
mapping.

Starting data type                           Valid data type changes  Example

                                        New data type

Fixed-length character                  Variable-length               Change a CHAR(10)
field                                   character field with the      mapping to a
                                        same column length            VARCHAR(10) mapping

Variable-length                         Fixed-length character        Change a VARCHAR(10)
character field                         field with the same           mapping to a CHAR(10)
                                        column length                 mapping

Fixed-length character                  Fixed-length character        Change a CHAR(10)
field                                   field with a longer           mapping to a CHAR(15)
                                        column width                  mapping

Fixed-length character                  Variable-length               Change a CHAR(10)
field                                   character field with a        mapping to a
                                        longer column width           VARCHAR(15) mapping

Variable-length                         Variable-length               Change a VARCHAR(20)
character field                         character field with a        mapping to a
                                        longer column width           VARCHAR(40) mapping

Variable-length                         Fixed-length character        Change a VARCHAR(20)
character field                         field with a longer           mapping to a CHAR(40)
                                        column width                  mapping

In addition to changing a column data type, you can also rename a column or a table.


Database dictionary                            Valid name changes  Example
item
File name                               Equivalent RDBMS item

Field name                              Table name                 Change a table name
                                        Column name                from MY_TABLE to
                                                                   SAMPLE_TABLE

                                                                   Change a column name
                                                                   from MY_COLUMN to
                                                                   SAMPLE_COLUMN

Related topics

Database dictionary (DBDICT) utility
Mapping rights
Array mapping options


1.6.5.7. When are RDBMS mappings added
or updated?

Service Manager must have proper RDBMS rights to directly change
RDBMS mappings. If the system doesn't have these rights, it will not add or update
any RDBMS mappings.

Service Manager issues CREATE TABLE statements to create RDBMS mapping in the
following circumstances:

     You create a new file (a logical view of a table) in a database dictionary record
     You create new fields (a logical view of a column) in a database dictionary
     record

Service Manager issues ALTER TABLE statements to update existing RDBMS
mappings in the following circumstances.

     You change a fixed-width character field mapping to a variable-width character
     field mapping
     You change a variable-width character field mapping to a fixed-width character
     field mapping
     You widen a column
     You rename a column
     You rename a table

Service Manager issues DROP TABLE statements to delete existing RDBMS mappings
in the following circumstances.

     You remove a table entry the SQL Table field in a database dictionary record
     You remove a table from the SQL Tables file

Service Manager does a full table copy of an existing table in the following
circumstances.

     You change the RC flag for any field in a database dictionary record
     You change a field alias that's not mapped to a NULLTABLE alias
     You associate a new main or alias table to an existing database dictionary record
     You change the RDBMS connection information to use a new type of RDBMS

Related topics


How do I create good RDBMS mappings?
Valid data type changes
````
