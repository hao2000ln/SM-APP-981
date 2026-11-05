---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.7.10.1.11 .. 1.7.10.1.12
printed_pages: 1977-2012
---

# 1.7.10.1.11 Methods for updating database dictionary records

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.7.10.1.11. Methods for updating database
dictionary records

Your database dictionary records should match the tables and columns Service
Manager manages in the RDBMS. We recommend that you use database dictionary
records as your primary data definition source and allow Service Manager to make
changes to RDBMS tables, columns, and indexes as needed. If you provide Service
Manager with an RDBMS account with table create-alter-drop-rights, any time you
make a change in a database dictionary record, the server automatically makes the
necessary changes in the RDBMS.

If you don't provide Service Manager with table create-alter-drop-rights to the
RDBMS, an RDBMS administrator must make all the necessary changes each time you
add, remove, or update a database dictionary record. In such cases, we recommend
you enable DDL logging to capture database dictionary changes. The Service
Manager administrator can then provide the DDL to the RDBMS administrator who can
approve or modify it as needed. After the RDBMS administrator has created the
necessary tables, columns, and indexes, the Service Manager administrator can
import the existing RDBMS columns.

The following table summarizes the methods you can use to update database
dictionary records and the best practices we recommend.


Action             From the System      From the         From RDBMS
                   Definition utility   Database         utilities
Update a                                Dictionary form
database
dictionary record  Best                 Best             You can't update
                   practice: Provide    practice: Pr     a Service
                   Service Manager      ovide            Manager
                   table create-alter-  Service          database
                   drop-rights to the   Manager          dictionary record
                   RDBMS, and           table create-    from RDBMS
                   update an            alter-drop-      utilities.
                   existing database    rights to the
                   dictionary record.   RDBMS, and
                   Service Manager      update an
                   updates any          existing
                   tables, columns,     database
                   and indexes in the   dictionary
                   RDBMS as well as     record.
                   remaps any           Service
                   existing columns.    Manager
                                        updates the
                                        changed
                                        tables,
                                        columns,
                                        and indexes
                                        in the
                                        RDBMS.
                                        Enable DDL
                                        logging and
                                        use the
                                        Database
                                        Dictionary
                                        form to
                                        update an
                                        existing
                                        database
                                        dictionary
                                        record. Have
                                        the RDBMS


Action  From the System                 From the           From RDBMS
        Definition utility              Database           utilities
                                        Dictionary form

                                             administrato
                                             r update
                                             tables,
                                             columns,
                                             and indexes
                                             based on
                                             the DDL.


Action          From the System         From the         From RDBMS
Update a table  Definition utility      Database         utilities
                                        Dictionary form

                Best                    Best             Have the RDBMS
                practice: Provide       practice: Pr     administrator
                Service Manager         ovide            update the tables
                table create-alter-     Service          directly in the
                drop-rights to the      Manager          RDBMS. Service
                RDBMS, and              table create-    Manager will
                update an               alter-drop-      automatically
                existing database       rights to the    update any
                dictionary record.      RDBMS, and       corresponding
                Service Manager         update an        database
                updates the table       existing         dictionary
                in the RDBMS.           database         records the next
                                        dictionary       time the server
                                        record.          restarts and there
                                        Service          is a query against
                                        Manager          the changed
                                        updates the      table.
                                        tables in the
                                        RDBMS.
                                        Enable DDL
                                        logging and
                                        use the
                                        Database
                                        Dictionary
                                        form to
                                        update an
                                        existing
                                        database
                                        dictionary
                                        record. Have
                                        the RDBMS
                                        administrato
                                        r update the
                                        tables based
                                        on the DDL.


Action  From the System                 From the         From RDBMS
        Definition utility              Database         utilities
                                        Dictionary form


Action          From the System         From the         From RDBMS
Update a field  Definition utility      Database         utilities
                                        Dictionary form

                Best                    Best             You can't update
                practice: Provide       practice: Pr     a Service
                Service Manager         ovide            Manager field
                table create-alter-     Service          from RDBMS
                drop-rights to the      Manager          utilities.
                RDBMS, and              table create-
                update an               alter-drop-
                existing field in a     rights to the
                database                RDBMS, and
                dictionary record.      use the
                Service Manager         Database
                updates the             Dictionary
                column in the           form to
                RDBMS.                  update an
                                        existing field
                                        in a
                                        database
                                        dictionary
                                        record.
                                        Service
                                        Manager
                                        updates the
                                        column in
                                        the RDBMS.
                                        Enable DDL
                                        logging and
                                        use the
                                        Database
                                        Dictionary
                                        form to
                                        update an
                                        existing field
                                        in a
                                        database
                                        dictionary


Action  From the System                 From the           From RDBMS
        Definition utility              Database           utilities
                                        Dictionary form

                                             record. Have
                                             the RDBMS
                                             administrato
                                             r update the
                                             column
                                             based on
                                             the DDL.


Action           From the System        From the         From RDBMS
Update a column  Definition utility     Database         utilities
                                        Dictionary form

                 Best                   Best             Have the RDBMS
                 practice: Provide      practice: Pr     administrator
                 Service Manager        ovide            update the
                 table create-alter-    Service          column directly to
                 drop-rights to the     Manager          the RDBMS.
                 RDBMS, and             table create-    Service Manager
                 update an              alter-drop-      will automatically
                 existing field in a    rights to the    update any
                 database               RDBMS, and       corresponding
                 dictionary record.     use the          database
                 Service Manager        Database         dictionary
                 updates the            Dictionary       records the next
                 column in the          form to          time the server
                 RDBMS.                 update an        restarts and there
                                        existing field   is a query against
                                        in a             the changed
                                        database         table.
                                        dictionary
                                        record.
                                        Service
                                        Manager
                                        updates the
                                        column in
                                        the RDBMS.
                                        Enable DDL
                                        logging and
                                        use the
                                        Database
                                        Dictionary
                                        form to
                                        update an
                                        existing field
                                        in a
                                        database
                                        dictionary


Action  From the System                 From the           From RDBMS
        Definition utility              Database           utilities
                                        Dictionary form

                                             record. Have
                                             the RDBMS
                                             administrato
                                             r update the
                                             column
                                             based on
                                             the DDL.


Action        From the System           From the         From RDBMS
Update a key  Definition utility        Database         utilities
                                        Dictionary form

              Best                      Best             You can't update
              practice: Provide         practice: Pr     a Service
              Service Manager           ovide            Manager key
              table create-alter-       Service          from RDBMS
              drop-rights to the        Manager          utilities.
              RDBMS, and                table create-
              update an                 alter-drop-
              existing key in a         rights to the
              database                  RDBMS, and
              dictionary record.        use the
              Service Manager           Database
              updates the index         Dictionary
              in the RDBMS.             form to
                                        update an
                                        existing key
                                        in a
                                        database
                                        dictionary
                                        record.
                                        Service
                                        Manager
                                        updates the
                                        index in the
                                        RDBMS.
                                        Enable DDL
                                        logging and
                                        use the
                                        Database
                                        Dictionary
                                        form to
                                        update an
                                        existing key
                                        in a
                                        database
                                        dictionary


Action  From the System                 From the           From RDBMS
        Definition utility              Database           utilities
                                        Dictionary form

                                             record. Have
                                             the RDBMS
                                             administrato
                                             r update the
                                             index based
                                             on the DDL.


Action           From the System        From the         From RDBMS
Update an index  Definition utility     Database         utilities
                                        Dictionary form

                 Best                   Best             Have the RDBMS
                 practice: Provide      practice: Pr     administrator
                 Service Manager        ovide            update an index
                 table create-alter-    Service          directly to the
                 drop-rights to the     Manager          RDBMS, and then
                 RDBMS, and             table create-    manage it from
                 update an              alter-drop-      RDBMS utilities.
                 existing key in a      rights to the
                 database               RDBMS, and
                 dictionary record.     use the
                 Service Manager        Database
                 updates the index      Dictionary
                 in the RDBMS.          form to
                                        update an
                                        existing key
                                        in a
                                        database
                                        dictionary
                                        record.
                                        Service
                                        Manager
                                        updates the
                                        index in the
                                        RDBMS.
                                        Enable DDL
                                        logging and
                                        use the
                                        Database
                                        Dictionary
                                        form to
                                        update an
                                        existing key
                                        in a
                                        database
                                        dictionary


Action  From the System                 From the           From RDBMS
        Definition utility              Database           utilities
                                        Dictionary form

                                             record. Have
                                             the RDBMS
                                             administrato
                                             r update the
                                             index based
                                             on the DDL.

Related topics

Automatic update of database dictionary records
Automatic update of RDBMS data when database dictionary records change
Database dictionary
Database dictionary records
Making database dictionary changes
Add a field to an existing database dictionary record
Import RDBMS columns into an existing database dictionary record
Update an existing database dictionary record


1.7.10.1.11.1. Automatic update of database
dictionary records

Service Manager can detect changes you make to existing columns and data types in
your back-end RDBMS and then automatically update the database dictionary to
match these changes after a system restart. This mechanism allows the database
dictionary to better match the actual columns within the RDBMS. To trigger the
automatic update of database dictionary records, you must first restart Service
Manager and then make a query to the changed table in the RDBMS. Since several
queries are made as part of the log in process, simply logging in may be sufficient to
trigger an automatic update. For tables not queried during login, you will need to
directly query the changed table in some fashion. You can either search from a form
that queries the table or create a query from the Database Manager.

For example, suppose an RDBMS administrator changes the length of the "NUMBER"
column in the "PROBSUMMARYM1" table from VARCHAR2(90) to VARCHAR2(100). To
pick up the change, the administrator restarts the Service Manager server, logs in,
and opens the incident queue form to trigger a query against the probsummary table.
This process causes Service Manager to compare the database dictionary record to
the RDBMS column definition, recognize the change, and update the database
dictionary record to match. Service Manager writes all such changes to the log file.
For example:

  5120( 5872) 02/05/2009 10:57:00 RTE I Change of SQL data type

  for field 'number' from 'VARCHAR2(90)'

  to 'VARCHAR2(100)' detected has been saved to DBDICT for file

  'probsummary'

Note: Service Manager can only change existing entries in database dictionary
records, which are stored in the dbdict table. If your RDBMS administrator adds new
columns intended for Service Manager to the RDBMS, the Service Manager
administrator will have to manually add entries to the database dictionary to reflect
those changes. If your RDBMS administrator removes columns managed by Service
Manager, then Service Manager updates the database dictionary to map the file to a
null table.

Note: In the above example, the "number" field is the unique key of the
"probsummary" database dictionary, which maps to multiple tables in the out-of-box
system. In an Oracle back-end RDBMS for example, the "probsummary" database


dictionary maps to the "probsummarym1" and "probsummarya1" RDBMS tables. If you
change the SQL data type of a unique key that's shared across multiple tables, be
sure to make the same change in all associated tables. In our example above, the
RDBMS administrator should also change the "number" column of the "probsummary
a 1" table from VARCHAR2(90) to VARCHAR2(100). The Service Manager server
displays a warning in the log file when it detects a difference between unique key
definitions. For example:

  4784( 4452) 02/05/2009 10:58:34 RTE W getSqldas: SQL data type
  for column 'NUMBER' in alias table a1
  (VARCHAR2(90)) doesn't match SQL data type in main table
  (VARCHAR2(100))

Related topics

Automatic update of RDBMS data when database dictionary records change


1.7.10.1.11.2. Automatic update of RDBMS
data when database dictionary records
change

The Service Manager server can push changes you make in the database dictionary
to your back-end RDBMS. If you provide the Service Manager server with table
create-alter-drop-rights to the RDBMS, it automatically adds or updates any tables,
columns, or indexes needed in the RDBMS. If you don't provide the Service Manager
server table create-alter-drop-rights to the RDBMS, we recommend you enable
exporting your database dictionary changes as DDL. This allows you to make the
necessary changes to the database dictionary and then have your RDBMS
administrator review and implement the DDL on the RDBMS.

To trigger the automatic update of RDBMS data, you add or update a database
dictionary record and save it. When you save the database dictionary record, Service
Manager consults the mapping format for your RDBMS to create the corresponding
tables, columns, and indexes required by your addition or change. Service Manager
then connects to the RDBMS with the user account you provided in the configuration
file and attempts to add or update the database. If the add or update is successful,
you will see the updated mapping for the table, column, or index after you restart
Service Manager. If the add or update fails, the Service Manager server changes the
database dictionary mappings to map to null tables and writes an error message in
the Service Manager log file.

For example, suppose the Service Manager administrator creates a new database
dictionary called testtable . The testtable database dictionary consists of two fields:
a number field called test.id and a character field called test.name . The
administrator makes the test.id field the unique key. After saving the new database
dictionary record, the administrator views the database dictionary record to see how
they are mapped to tables and columns in the RDBMS. On a Microsoft SQL Server, the
testtable database dictionary might map to the following tables and columns.

Sample database dictionary for the test.id number
field


Database dictionary                     Value if RDBMS table  Value if RDBMS table
object
                                        create-alter-drop-rights create-alter-drop-rights

                                        granted               denied

Database dictionary field test.id                             test.id
name

Database dictionary data number                               number
type

SQL column name                         TEST_ID               TEST_ID

SQL data type                           FLOAT                 FLOAT

SQL alias                               m1                    N-m1

SQL table name                          TESTTABLEM1           NULLTABLE

Sample database dictionary for the test.name
character field

Database dictionary                     Value if RDBMS table  Value if RDBMS table
object
                                        create-alter-drop-rights create-alter-drop-rights

                                        granted               denied

Database dictionary field test.name                           test.name
name

Database dictionary data character                            character
type

SQL column name                         TEST_NAME             TEST_NAME

SQL data type                           VARCHAR(60)           VARCHAR(60)

SQL alias                               m1                    N-m1

SQL table name                          TESTTABLEM1           NULLTABLE


When Service Manager has table create-alter-drop-rights to the RDBMS, the
database dictionary record contains mapping information to the actual tables and
column names. When Service Manager doesn't have table create-alter-drop-rights to
the RDBMS, the database dictionary record contains mapping information to the
proposed table and column names. The RDBMS administrator can use Service
Manager’s generated DDL to create the proposed table and column names. Until the
actual tables and columns exist, the database dictionary record points to a null table
mapping. All null table aliases start with an "N-" prefix, and the SQL table name maps
to the value NULLTABLE. After the RDBMS administrator has created the tables and
columns for the database dictionary record, the Service Manager administrator can
use the Activate Nulltable Rows option to update the SQL mappings to their new
values. Service Manager will use the column names listed in the database dictionary
record to match it to the proper table name in the RDBMS.

Related topics

Automatic update of database dictionary records
Database dictionary
Database dictionary records
Create an active database dictionary record
Create an inactive database dictionary record
Import RDBMS columns into an existing database dictionary record


1.7.10.1.11.3. Add a field to an existing
database dictionary record

Applies to User roles: System Administrator
This procedure assumes the Service Manager system has the right to create, alter,
and drop tables in the RDBMS system. If the system doesn't have such rights, your
database dictionary record remains inactive and mapped to null tables until you
activate it. If your system doesn't have such rights, it's advisable that you enable the
option to create Database Definition Language (DDL) to offer rights to your RDBMS
administrator. You can then activate the database dictionary record after your RDBMS
administrator has created the tables and columns specified in the DDL.
Note: If you choose to add a new column directly from the RDBMS, Service Manager
will not automatically recognize the new column. You must import the new column
into the database dictionary record before Service Manager can manage it.
To add a field to an existing database dictionary record:

   1. Sign in to the Service Manager system with a system administrator account.
   2. Click System Definition > Tables.
   3. Double-click the table name you want to edit.

     Note: Each table name is actually a database dictionary record.
   4. Click the Fields and Keys tab.
   5. In the Fields and keys definitions for the table, do one of the following:

     • Click New Field to create a scalar field
     • Click New Array to create an array or an array of structure
   6. Type a name for the new field.
   7. Click OK. The field name appears in the list of fields.
   8. Select a value from the Data Type field.
     Note: Each field must have a data type.
   9. Add any optional field properties, such as data policies or editing rules.
 10. Click Save. Service Manager creates a new column in the RDBMS.


Related topics

Methods for deleting database dictionary records


1.7.10.1.11.4. Import RDBMS columns into
an existing database dictionary record

Applies to User Roles: System Administrator

This procedure assumes the SM system doesn't have the right to create, alter, or drop
tables in the RDBMS system. Meanwhile, you haven't already created a database
dictionary record for this change. If your system has such rights in the RDBMS
system, SM automatically creates necessary tables, columns, and indexes when you
create a database dictionary record. If your SM system doesn't have such rights, it's
advisable to:

   1. Create the database dictionary record first
   2. Offer Database Definition Language (DDL) to the RDBMS administrator to

     implement the necessary changes

The Service Manager administrator can then activate the database record when the
RDBMS tables and columns become available. This procedure provides an alternative
means for you to keep your database dictionary records synchronized with an
RDBMS.

In order for Service Manager to successfully import columns into a database
dictionary record, the RDBMS tables must have the following features:

     The table names must be in uppercase
     The table must have an owner who is a Service Manager user

To import RDBMS columns into an existing database dictionary record:

   1. Sign in to the Service Manager system with a system administrator account.

   2. Click Tailoring > Database Dictionary.

   3. Type the existing database dictionary record name in the Filename field, and
     then click Search.
     The database dictionary record opens.

   4. Click Import new columns from SQL to have the Service Manager server sign in
     to the RDBMS and check for new columns in the SQL tables defined for the
     database dictionary record.

     Service Manager automatically displays new columns as fields in the database
     dictionary record.


                   Caution

                Service Manager only supports importing new columns from main
                tables.

   5. Click OK to save the database dictionary record.

Related topics

Automatic update of database dictionary records
Database dictionary records
Create an active database dictionary record
Create an inactive database dictionary record
Enable DDL logging of database dictionary changes


1.7.10.1.11.5. Modify field types character
(scalar) to array

Applies to User roles: System Administrator

Example: Change a field with existing data, called address, from a character type
scalar field to an array. For this example, assume that we created a new file called
vendorview from the format vendor.

To modify field types, character (scalar) to array:

   1. Select the address field name. Only one entry for address should appear, as it is
     currently a scalar field.

   2. Click Edit.
   3. In the Name field, type old.address .
  4. Leave the Type field value as character.
   5. Click OK to close the window and commit the change to the file.

The address field name is now old.address in the Field Name array.

   1. Select the descriptor structure, and then click New.
   2. In the Name field, type address .
   3. In the Type field, type array .
   4. Click Add to commit the new array to the file.

When adding an array field, you also need to specify the type of array (for example,
character, number, date/time, etc.). Service Manager prompts you for this information
now.
A new field.window opens with address displayed in the Name field and the Type
field blank. The message Enter data type of array's element also appears at the
bottom of the format window.

   1. Select the Type field and type: character .
   2. Click Add.

Notice two entries for address now exist in the database dictionary record since it has
been defined as a character array.

   1. Click OK to close the window and save the changes.
   2. Click OK to end this session with the vendorview file.

The field type has been changed, but this is not the end of the process.


Because data exists in the file, you need to move the contents of the field now called
old.address to the field called address. To accomplish this, perform a Mass Update
in Database Manager on all records in the file that have data in the old.address field.

Once the data has been moved, we recommend that you also remove the old.address
field from the database dictionary record.

The Mass Update instruction string to move the data from the field called old.address
to the first element in the newly created array called address is:

  1 in address in $file = old.address in $file

Related topics

Methods for adding database dictionary records
Methods for updating database dictionary records
Methods for deleting database dictionary records
Database dictionary data types
Structures
Alias fields
Adding a key
Modifying a key
Deleting a key
Access the Database Dictionary utility
Add fields to a structure
Modify field types: Single to concatenated
Open a database dictionary
Regen a database dictionary
Search for a field in the database dictionary


1.7.10.1.11.6. Modify field types: single to
concatenated

Applies to User Roles: System Administrator

Example Modify the single key wdManagerName in a copy of the assignment
database dictionary record to make it a concatenated key comprised of the fields
wdManagerName and company.

To modify field types: single to concatenated:

   1. Open the assignment dbdict.
  2. Make a copy of the assignment dbdict named assignment2.
   3. Position the cursor on the key type Nulls & Duplicates, above the key model.
   4. Click Edit.
   5. Add company in the second element of the field names array below

     wdManagerName.
   6. Click OK to close the window.
   7. You can now re-edit your database dictionary record, update it, or cancel

     without updating.
   8. Click OK, to close and automatically update the file. This returns the message

     Record updated in the dbdict file.
   9. When an IR key is added or updated, then Service Manager prompts you to

     regenerate the file. You can either click OK (regen file) to continue with the
     regen, click Cancel (F3) to abort the regen and restore the database dictionary
     record to the version prior to the latest changes, or schedule a time for the file
     regeneration, using Schedule (clock button).

Related topics

Database dictionary data types
Adding a key
Alias fields
Changing data types
Structures
Database dictionary
Access the Database Dictionary utility
Change data types: Character to number
Copy a database dictionary only
Modify field types: Character (scalar) to array


Open a database dictionary
Regen a database dictionary


1.7.10.1.11.7. Regenerate a database
dictionary

Applies to User roles: System Administrator

You can regenerate an IR index in the database dictionary by using the Database
Dictionary utility.

Or, you can regenerate all IR indexes by using the sm -upgradeir command.

Regenerate an IR index using Database Dictionary

You can regenerate IR for a table by using the Database Dictionary utility:

   1. Sign in to the Service Manager Windows or web client.
   2. Click Tailoring > Database Dictionary.

   3. In the Table field, type the table name (for example, incidents), and click
     Search.

     The table details form opens.

   4. From the table details form, click More or the More Actions icon, and select
     Regen IR.

   5. Click OK to run the IR regeneration immediately.

Regenerate IR indexes using the sm -upgradeir
command

   1. Shut down your Service Manager system. For details, see Shut down Service
     Manager.

   2. Run the sm -upgradeir command to regenerate IR indexes.
   3. Restart your Service Manager system as required. For details, see Start Service

     Manager.

Related topics

Regenerate database keys
Regenerate IR keys


1.7.10.1.11.8. Search for a field in a
database dictionary

Applies to User Roles: System Administrator

The ability to search the dictionary for a specific field name is particularly useful
when dealing with a large database dictionary.

You can search for a field in the database dictionary by using System Definition or by
using the Database Dictionary utility. Choose one of the following methods to search
for fields.

Search for fields by using System Definition

To search for a field by using System Definition:

  1. From the System Navigator, click System Definition > Tables > file_name >
     Fields

     Note: You can type the first letter of a table name to jump to that alphabetic
     section. For example, type o to jump to the oncall table. Double-click a table to
     open it. Double-click the table to open it.

   2. Type the first letter(s) of the field you are looking for. The navigator will go to the
     first field starting with those letters.

     Note: If there is a delay between the letters you type, the Navigator will assume
     that you want a different search and jump out of the folder to find the matching
     letters.

Search for fields by using the Database Dictionary
utility

Using the Database Dictionary utility when searching for fields enables you do a
“contains” search.

To search for a field by using the Database Dictionary utility:

   1. Click Tailoring > Database Dictionary, and then open the database dictionary
     file.

   2. From within the database dictionary record you want to search, open the More
     Actions menu and click Field Search.


     This brings up the Field Search window prompt.

   3. Type the field name to search, for example, one.
           Click Exact match if you are sure that what you entered is a field in the
           dictionary record.
           Click Starts with to find all fields starting with the string entered.
           Click Contains to search for fields containing the string entered anywhere
           in the field name. (Used in this example.)
           Click End to cancel the search.

   4. If Service Manager finds a match, it responds by giving a message similar to the
     following: *Field "phone" found: type=character; level=3; index=2.

     The message gives the field type, the level (how many structures down the field
     where it is located), and the index (location within its parent structure).

     For example, one appears in:

           A character type field (phone)
           In the third level structure (alternate.contact)
           As the second field in the alternate.contact structure.
   5. If multiple fields are found by the search, multiple messages are returned, one
     message for each field found. The message in the above example displays an
     asterisk (*), indicating it does have additional messages to display.

   6. View all messages related to this operation.

     In this example, these messages reveal that one is present in at least two fields
     in this database dictionary.

     However, since the Contains button was used, the letters are found in their
     specific order, regardless of where they appear in the field name.

     For an exact match on the word one, you can use the Exact match or Starts with
     button. (Using these options against this example returns no positive hits using
     Exact match or Starts with.)

Related topics

Add a field to an existing database dictionary record
Modify field types: Single to concatenated
Modify field types: Character (scalar) to array


1.7.10.1.11.9. Update an existing database
dictionary record

Applies to User Roles: System Administrator

This procedure assumes the Service Manager system has the right to create, alter,
and drop tables in the RDBMS system. If Service Manager doesn't have such right,
your database dictionary record changes remain inactive and mapped to null tables
until you activate them. In this case, it's advisable that you enable the option to create
Database Definition Language (DDL) for your RDBMS administrator. You can then
activate the database dictionary record changes after your RDBMS administrator has
created the tables and columns specified in the DDL.

To update an existing database dictionary record:

   1. Sign in to the Service Manager system with a system administrator account.

   2. Click System Definition > Tables.

   3. Double-click the table name you want to edit.

     Note: Each table name is actually a database dictionary record.

   4. From the Table tab, you can delete/rename/copy the database dictionary record
     and add triggers.

   5. From the Fields and Keys tab, you can add, delete, or update fields and keys.

   6. Make the changes you want to make, and then click Save to update the
     database dictionary record.

Related topics

     Automatic update of RDBMS data when database dictionary records change
     Database dictionary
     Database dictionary records
     Create a database dictionary record by importing RDBMS columns
     Create an active database dictionary record
     Create an inactive database dictionary record
     Update the data type of a database dictionary field


1.7.10.1.11.10. Update the data type of a
database dictionary field

Applies to User roles: System Administrator
This procedure assumes the Service Manager system has the right to create, alter,
and drop table to the RDBMS system. If Service Manager doesn't have such right,
your database dictionary record changes remain inactive and mapped to null tables
until you activate it. In this case, it's advisable you enable the option to create
Database Definition Language (DDL) for your RDBMS administrator. You can then
activate the database dictionary record changes after your RDBMS administrator has
created the tables and columns specified in the DDL.

To update the data type of a database dictionary field:

   1. Sign in to the Service Manager system with a system administrator account.

   2. Click System Definition > Tables.

   3. Double-click the table name you want to edit.

     Note: Each table name is actually a database dictionary record.
   4. Click the Fields and Keys tab.

   5. Click the field name you want to edit. The General properties pane opens.

   6. Select a new value from the Data type field.

     A confirmation window opens.

     Note: You can't use the drop-down list to change a scalar field to an array or
     structure. Instead, you must add a new array or structure.
   7. Click OK to verify the data type change.

   8. Click Save to update the database dictionary record.

Related topics

Database dictionary
Create an active database dictionary record
Import RDBMS columns into an existing database dictionary record


1.7.10.1.11.11. Rename a database
dictionary

Applies to User Roles: System Administrator

After you create a database dictionary, you can do one of the following:

     Change the name of the dictionary.
     Change the name of one or more of the files sent with the base system.

For example, you can rename the communications file to interactions. This changes
the file name but retains all of the field and key definitions in the dictionary.

If records exist in the file, renaming the dictionary associates all of the records with
the new dictionary name. This differs from copying a file because it takes only a few
seconds to perform this function.

Database dictionary names must be one word. No blanks and no special delimiters
are allowed.

You can rename a database dictionary by using System Definition or by using the
Database Dictionary utility. Choose one of the following methods to rename a
database dictionary.

By using System Definition

To rename a database dictionary using System Definition:

  1. On the System Navigation, click System Definition > Tables > file_name.

     Note: You can type the first letter of a table name to jump to that alphabetic
     section. For example, type o to jump to the oncall table. Double-click a table to
     open it.

   2. Click Rename.
   3. Type the desired file name in the Rename To text box.
  4. Click OK. Service Manager displays the following message: File renamed from

     <old name> to <new name>.

By using the Database Dictionary utility

To rename a database dictionary using the Database Dictionary utility:

   1. Open the old dbdict using the Database Dictionary utility.


     Click Tailoring > Database Dictionary.

   2. Open the More Actions menu and click Copy/Rename.
   3. Type the desired file name in the New Name text box.
   4. Select the Rename option.
   5. Click OK. The renamed database dictionary opens with the following message in

     the status bar: Dbdict successfully renamed.
   6. Click OK to exit the record and save the file with the new name.

Related topics

Access the Database Dictionary utility


1.7.10.1.12. Resetting a database table

In some scenarios, you may need to reset a database table to remove all records. For
example, when moving a table from a development environment to a production
environment, you may want to start with an empty production table. You may also
need to limit the size of files that continually increase in size, such as syslog or
msglog.

            Caution

           Use caution when choosing this option, as resetting removes all records
           from the table.

Resetting the database and all records

If the records in a dictionary are no longer needed but the file structure is to be
retained for later use, perform a file reset.
The Reset option deletes all data records from a dictionary. In most instances, once a
system is set up and is in operation, this option is not used. Most often it is utilized
when clearing test data from a preimplemented system or test file.

            Caution

           You should only use this option when you intend to permanently remove
           data file records. Once a reset is performed, the records can't be
           retrieved.

Reset a database table from Database Manager

Applies to User Roles: System Administrator
In this example we reset the syslog table. Resetting other tables works the same way.
To reset a database table from Database Manager:

   1. Open the syslog form in Database Manager.
   2. Click More or the More Actions icon.
   3. Select Reset.

Service Manager displays a prompt, asking you to confirm the action and allowing
you to schedule the Reset.


   1. From the prompt, you can:
           Click OK to reset the syslog table.
           Click Cancel to leave the table intact and return to the blank syslog format.
           Click Schedule to schedule a time to run the file reset operation, either
           once or repeatedly at a set interval.

Schedule a reset

Applies to User Roles: System Administrator

If you chose to schedule a reset by clicking the Schedule button on the reset prompt
you are prompted with a schedule dialog, Service Manager displays a schedule form.

To schedule a reset:

   1. Provide a date in a DD/MM/YYYY format in the Date/Time to run field.
   2. Provide a time in an HH:MM:SS format the Date/Time to run field.
   3. Select a Repeat Interval option to reset the file on a regular basis. This setting is

     optional. The interval period starts from the time and date set in steps 2 and 3.
           Monthly – reset once a month.
           Quarterly – reset every three months.
           Semi-annually – reset every six months.
           Annually – reset once a year.
           Other – reset in the specified number of days, at the specified time.

     Use the dd hh:mm:ss format, where dd is the number of days from the initial
     date and time, and hh:mm:ss is the time of day. For example, 26 10:00:00
     schedules the reset to run at 10 a.m., 26 days from the initial reset date and time
     set in the Date/Time to run field.

   4. Click Schedule to confirm the reset action.

Related topics

Regenerate database keys
````
