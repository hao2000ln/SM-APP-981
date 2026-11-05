---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.7.10.1.9 .. 1.7.10.1.9
printed_pages: 1931-1962
---

# 1.7.10.1.9 Methods for adding database dictionary records

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.7.10.1.9. Methods for adding database
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

The following table summarizes the methods you can use to add database dictionary
records and the best practices we recommend.


Action             From the System      From the         From RDBMS
                   Definition utility   Database         utilities
Add a database                          Dictionary form
dictionary record
                   Best                 Best             You can't create a
                   practice: Provide    practice: Pr     Service Manager
                   Service Manager      ovide            database
                   table create-alter-  Service          dictionary record
                   drop-rights to the   Manager          from RDBMS
                   RDBMS, and           table create-    utilities.
                   create a new         alter-drop-
                   database             rights to the
                   dictionary record.   RDBMS, and
                   Service Manager      create a new
                   creates the          database
                   required tables,     dictionary
                   columns, and         record.
                   indexes in the       Service
                   RDBMS.               Manager
                                        creates the
                                        required
                                        tables,
                                        columns,
                                        and indexes
                                        on the
                                        RDBMS.
                                        Enable DDL
                                        logging and
                                        use the
                                        Database
                                        Dictionary
                                        form to
                                        create a new
                                        database
                                        dictionary
                                        record. Have
                                        the RDBMS
                                        administrato
                                        r add tables,


Action  From the System                 From the          From RDBMS
        Definition utility              Database          utilities
                                        Dictionary form

                                             columns,
                                             and indexes
                                             based on
                                             the DDL,
                                             and then
                                             use the
                                             Database
                                             Dictionary
                                             form to
                                             import the
                                             existing
                                             RDBMS
                                             columns.


Action       From the System            From the         From RDBMS
Add a table  Definition utility         Database         utilities
                                        Dictionary form

             Best                       Best             Have the RDBMS
             practice: Provide          practice: Pr     administrator add
             Service Manager            ovide            a table directly to
             table create-alter-        Service          the RDBMS, and
             drop-rights to the         Manager          then use the
             RDBMS, and then            table create-    Database
             create a new               alter-drop-      Dictionary form to
             database                   rights to the    import the
             dictionary record.         RDBMS, and       existing RDBMS
             Service Manager            create a new     columns.
             creates the                database
             required table in          dictionary
             the RDBMS.                 record.
                                        Service
                                        Manager
                                        creates the
                                        required
                                        tables in the
                                        RDBMS.
                                        Enable DDL
                                        logging and
                                        use the
                                        Database
                                        Dictionary
                                        form to
                                        create a new
                                        database
                                        dictionary
                                        record. Have
                                        the RDBMS
                                        administrato
                                        r add a table
                                        based on
                                        the DDL,
                                        and then


Action  From the System                 From the         From RDBMS
        Definition utility              Database         utilities
                                        Dictionary form

                                             use the
                                             Database
                                             Dictionary
                                             form to
                                             import the
                                             existing
                                             RDBMS
                                             columns.


Action       From the System            From the         From RDBMS
Add a field  Definition utility         Database         utilities
                                        Dictionary form

             Best                       Best             You can't create a
             practice: Provide          practice: Pr     Service Manager
             Service Manager            ovide            field from RDBMS
             table create-alter-        Service          utilities.
             drop-rights to the         Manager
             RDBMS, and add             table create-
             a field to a               alter-drop-
             database                   rights to the
             dictionary record.         RDBMS, and
             Service Manager            use the
             creates the                Database
             required column            Dictionary
             in the RDBMS.              form to add
                                        a field to a
                                        database
                                        dictionary
                                        record.
                                        Service
                                        Manager
                                        creates the
                                        required
                                        column in
                                        the RDBMS.
                                        Enable DDL
                                        logging and
                                        use the
                                        Database
                                        Dictionary
                                        form to add
                                        a field to a
                                        database
                                        dictionary
                                        record. Have
                                        the RDBMS
                                        administrato


Action  From the System                 From the         From RDBMS
        Definition utility              Database         utilities
                                        Dictionary form

                                             r add a
                                             column
                                             based on
                                             the DDL,
                                             and then
                                             use the
                                             Database
                                             Dictionary
                                             form to
                                             import the
                                             existing
                                             RDBMS
                                             columns.


Action        From the System           From the         From RDBMS
Add a column  Definition utility        Database         utilities
                                        Dictionary form

              Best                      Best             Have the RDBMS
              practice: Provide         practice: Pr     administrator add
              Service Manager           ovide            a column directly
              table create-alter-       Service          to the RDBMS,
              drop-rights to the        Manager          and then use the
              RDBMS, and add            table create-    Database
              a field to a              alter-drop-      Dictionary form to
              database                  rights to the    import the
              dictionary record.        RDBMS, and       existing RDBMS
              Service Manager           use the          columns.
              creates the               Database
              required column           Dictionary
              in the RDBMS.             form to add
                                        a field to a
                                        database
                                        dictionary
                                        record.
                                        Service
                                        Manager
                                        creates the
                                        required
                                        column in
                                        the RDBMS.
                                        Enable DDL
                                        logging and
                                        use the
                                        Database
                                        Dictionary
                                        form to add
                                        a field to a
                                        database
                                        dictionary
                                        record. Have
                                        the RDBMS
                                        administrato


Action  From the System                 From the         From RDBMS
        Definition utility              Database         utilities
                                        Dictionary form

                                             r add a
                                             column
                                             based on
                                             the DDL,
                                             and then
                                             use the
                                             Database
                                             Dictionary
                                             form to
                                             import the
                                             existing
                                             RDBMS
                                             columns.


Action     From the System              From the         From RDBMS
Add a key  Definition utility           Database         utilities
                                        Dictionary form

           Best                         Best             You can't create a
           practice: Provide            practice: Pr     Service Manager
           Service Manager              ovide            key from RDBMS
           table create-alter-          Service          utilities.
           drop-rights to the           Manager
           RDBMS, and add               table create-
           a key to a                   alter-drop-
           database                     rights to the
           dictionary record.           RDBMS, and
           Service Manager              use the
           creates the                  Database
           required index in            Dictionary
           the RDBMS.                   form to add
                                        a key to a
                                        database
                                        dictionary
                                        record.
                                        Service
                                        Manager
                                        creates the
                                        required
                                        index in the
                                        RDBMS.
                                        Enable DDL
                                        logging and
                                        use the
                                        Database
                                        Dictionary
                                        form to add
                                        a key to a
                                        database
                                        dictionary
                                        record. Have
                                        the RDBMS
                                        administrato


Action  From the System                 From the          From RDBMS
        Definition utility              Database          utilities
                                        Dictionary form

                                             r add an
                                             index based
                                             on the DDL.


Action        From the System           From the         From RDBMS
Add an index  Definition utility        Database         utilities
                                        Dictionary form

              Best                      Best             Have the RDBMS
              practice: Provide         practice: Pr     administrator add
              Service Manager           ovide            an index directly
              table create-alter-       Service          to the RDBMS,
              drop-rights to the        Manager          and then manage
              RDBMS, and add            table create-    it from RDBMS
              a key to a                alter-drop-      utilities.
              database                  rights to the
              dictionary record.        RDBMS, and
              Service Manager           use the
              creates the               Database
              required index in         Dictionary
              the RDBMS.                form to add
                                        a key to a
                                        database
                                        dictionary
                                        record.
                                        Service
                                        Manager
                                        creates the
                                        required
                                        index in the
                                        RDBMS.
                                        Enable DDL
                                        logging and
                                        use the
                                        Database
                                        Dictionary
                                        form to add
                                        a key to a
                                        database
                                        dictionary
                                        record. Have
                                        the RDBMS
                                        administrato


Action  From the System                 From the          From RDBMS
        Definition utility              Database          utilities
                                        Dictionary form

                                             r add an
                                             index based
                                             on the DDL.

Related topics

Automatic update of database dictionary records
Automatic update of RDBMS data when database dictionary records change
Database dictionary
Database dictionary records
Create an active database dictionary record
Create an inactive database dictionary record
Create a database dictionary record by importing RDBMS columns
Import RDBMS columns into an existing database dictionary record


1.7.10.1.9.1. Field name requirements

You must follow these rules when creating field names:

     Valid characters include uppercase and lowercase letters of the alphabet,
     numeric characters 0 through 9, and the period character.
     Field names must begin with a letter of the alphabet.
     Spaces and all other special characters aren't permitted.
     Do not use the following Service Manager reserved words (uppercase or
     lowercase):

           AND
           BEGIN
           DO
           ELSE
           END
           F
           FALSE
           FOR
           IF
           IN
           ISIN
           LIKE
           MOD
           N
           NO
           NOT
           OR
           STEP
           T
           THEN
           TO
           TRUE
           U
           UNKNOWN
           WHILE
           Y
           YES

Related topics


Methods for adding database dictionary records
Methods for adding database dictionary records
Structures
Alias fields
Adding a key
Methods for updating database dictionary records
Modifying a key
Methods for deleting database dictionary records
Deleting a key
Search for a field in the database dictionary
Database dictionary data types


1.7.10.1.9.2. Create an inactive database
dictionary record

Applies to User roles: System Administrator

This procedure assumes the Service Manager system doesn't have table create-alter-
drop-rights to the RDBMS system. If your system does have table create-alter-drop-
rights to the RDBMS system, then Service Manager automatically creates any
necessary tables, columns, and indexes required by your database dictionary
records.

We recommend you enable the option to create DDL to provide to your RDBMS
administrator. You can then activate the database dictionary record after your RDBMS
administrator has created the tables and columns specified in the DDL.

Note: You must use the Windows client whenever you need to add a new field/key to
a database dictionary table.

To create an inactive database dictionary record:

   1. Sign in to the Service Manager system with a system administrator account.
   2. Click Tailoring > Database Dictionary.
   3. Type the table name in the File Name field, and then click New.
   4. In the Fields tab, click New Field/Key to add one field for each RDBMS column

     you want to add.
   5. In the Keys tab, click New Field/Key to add a unique key to the database

     dictionary record.

   6. Click OK.

     Service Manager creates the database dictionary record and maps each field to
     a null table alias.

The database dictionary record remains inactive until you activate it and remap the
fields to actual RDBMS tables and columns.

Activate a database dictionary record

Applies to User roles: System Administrator

This procedure assumes the Service Manager system doesn't have table create-alter-
drop-rights to the RDBMS system, and that you have not already created a database
dictionary record for this change. If your system has table create-alter-drop-rights to


the RDBMS system, then Service Manager automatically creates any necessary
tables, columns, and indexes when you create a database dictionary record. If your
Service Manager system doesn't have RDBMS table create-alter-drop-rights, we
recommend you create the database dictionary record first and provide DDL to the
RDBMS administrator to implement the necessary changes. The Service Manager
administrator can then use this procedure to activate the database record when the
RDBMS tables and columns become available.

To activate a database dictionary record:

   1. Sign in to the Service Manager system with a System Administrator account.
   2. Click Tailoring > Database Dictionary.

   3. Type the existing database dictionary record name in the Filename field, and
     then click Search.

     The database dictionary record opens.

   4. Click the More Actions and choose Activate Nulltable Rows to have the Service
     Manager server sign in to the RDBMS and check for new columns in the SQL
     tables that match the fields in database dictionary record.

     Service Manager automatically displays the new field mappings in the database
     dictionary record.

   5. Click OK to save the database dictionary record.

Related topics

Database dictionary
Database dictionary records
Data persistence
Enable DDL logging of database dictionary changes


1.7.10.1.9.3. Create an active database
dictionary record

Applies to User roles: System Administrator

This procedure assumes the Service Manager system has table create-alter-drop-
rights to the RDBMS system. If Service Manager doesn't have table create-alter-drop-
rights, your database dictionary record remains inactive and mapped to null tables
until you activate it. If your system doesn't have table create-alter-drop-rights to the
RDBMS, we recommend you enable the option to create DDL to provide to your
RDBMS administrator. You can then activate the database dictionary record after your
RDBMS administrator has created the tables and columns specified in the DDL.

For Windows clients:

To create an active database dictionary record:

   1. Sign in to the Service Manager system with a system administrator account.
   2. In the System Navigator, click System Definition > Tables.
   3. Right-click Tables, and then click New Table.
   4. Type the Table name.
   5. Add one field for each RDBMS column you want to add.
   6. Add a unique key to the database dictionary record.
   7. Click OK.

For Web clients:

To create an active database dictionary record:

   1. Sign in to the Service Manager system with a system administrator account.
   2. In the System Navigator, click Tailoring > Database Dictionary.
   3. Type the name of the new table in the File Name field, and then click the New

     icon.
   4. Add one field for each RDBMS column you want to add.
   5. Add a unique key to the database dictionary record.
   6. Click OK.

Related topics

Database dictionary
Database dictionary records
Data persistence


Create a database dictionary record by importing RDBMS columns
Enable DDL logging of database dictionary changes


1.7.10.1.9.4. Add a structure to the
database dictionary

Applies to User Roles: System Administrator

You can add a structure to the database dictionary by using System Definition or by
using the Database Dictionary utility. Choose one of the following methods to add a
structure.

Note: You must use the Windows client whenever you need to add a new field/key to
a database dictionary table.

Add a structure by using System Definition

To add a structure by using System Definition:

  1. In the System Navigator, click System Definition > Tables > filename > Fields.
   2. Click New Field.
   3. Type a name in the Field Name field.
   4. Click OK. The new field name is now listed in its alphabetical place in the fields

     list.
   5. Select the new field from the list, and in the General properties section select

     Structure in the Data type field, and then specify other general properties and
     SQL mappings properties for the field.
   6. Select the structure field from the Fields list, and click New Field.
   7. Type a name in the Field name field, and click OK. The field is added to the
     structure.
   8. Specify general properties, aliases, and SQL mapping properties for the field.
   9. Repeat steps 6 through 8 to add more fields to the structure.
 10. Click Save to save the file.

Add a structure by using the Database Dictionary
utility

This example illustrates how to add a structure that contains fields for basic employee
information. The fields are name, telephone number, and address. These fields will
appear on all formats or views of the employee file. Salary, hire.date, review.date,
rehire, termination.date, position, and department will appear only on certain forms.

To add a structure by using the Database Dictionary utility:

   1. From the database dictionary, open the employee file.


   2. On the Fields tab, place the cursor on the descriptor structure.
   3. Click New Field/Key.
   4. In the Name field, type basic.employee.info.
   5. In the Type field, choose structure from the Type list.

   6. Click Add.

     You can now add fields within the structure you just created.

   7. In the Name and Type fields, type a name and select a data type for the first
     field you want to add to the structure. For example, type person.name and
     select character.

   8. Click Add.

     The structure with its first field is added to the Fields tab.

   9. On the Fields tab, select the structure field you added, and click New Field/Key
     to add more fields to the structure field. For example, add two more fields
     named telephone (data type: character) and address (data type: character) .

 10. Click OK to save your edits.

 11. Click SM Alters when you are asked how you want to update the database
     dictionary.

     This returns the message: Record updated in the dbdict file.

Related topics

Forms Designer
Adding a key
Alias fields
Methods for deleting database dictionary records
Deleting a key
Methods for updating database dictionary records
Modifying a key
Structures
Access the Database Dictionary utility
Add fields to a structure
Open a database dictionary
Regen a database dictionary


1.7.10.1.9.5. Add an alias field

Applies to User Roles: System Administrator
You can add an alias field by using System Definition or by using the Database
Dictionary utility. Choose one of the following methods to add an alias field.
Note: You must use the Windows client whenever you need to add or edit a field/key
in a database dictionary table.

Add an alias field by using System Definition

   1. In the System Navigator, click System Definition > Tables.
     Note: To expand any table in the record list, type the first letter of a table name
     to jump to that alphabetic section. For example, type o to jump to the oncall
     table.

   2. Expand Fields, and then select a field.
     The Fields and keys definitions for the activity table opens.

   3. In the Aliases section, click New.
   4. In the Alias name field, type an alias name.
   5. Click OK.
   6. Click Save to save your changes.

Add an alias field by using the Database Dictionary
utility

To add an alias field by using the Database Dictionary utility:

   1. Click Tailoring > Database Dictionary.
   2. In the File Name field type a file name, and then click Search.

     The record opens.
   3. On the Fields tab, scroll through the fields and select one.
   4. Click Edit Field/Key.

     The field window opens.
   5. Click Create Alias.
   6. In the Name field, type the name of the alias.


   7. Click OK.
   8. After the record has been updated, click OK again.

Related topics

Alias fields
Database dictionary data types
Structures
Adding a key
Methods for updating database dictionary records
Modifying a key
Methods for deleting database dictionary records
Deleting a key
Add a field to an existing database dictionary record
Open a database dictionary
Access the Database Dictionary utility
Regen a database dictionary


1.7.10.1.9.6. Add an array

Applies to User Roles: System Administrator
You can add an array by using System Definition or by using the Database Dictionary
utility. Choose one of the following methods to add an array.
Note: You must use the Windows client whenever you need to add a new field/key to
a database dictionary table.

Add an array by using System Definition

   1. In the System Navigator, click System Definition > Tables.
     Note: To expand any table in the record list, type the first letter of a table name
     to jump to that alphabetic section. For example, type o to jump to the oncall
     table.

   2. Double-click Fields.
     The Fields and keys definitions for the table opens.

   3. Place the cursor on a non-structue field, and click New array.
   4. Type a name in the Field Name field, and click OK.

     The array along with an element named after the array is now listed in its
     alphabetical place in the fields list.
   5. Select a data type, and specify other properties for the array field.
   6. Click Save to save your changes to the table.

Add an array by using the Database Dictionary
utility

Example: Add an array to the unitofmeasure file.

   1. Click Tailoring > Database Dictionary.
   2. In the File Name field, type unitofmeasure, and then click Search.
   3. Place the cursor in the descriptor structure.
   4. Click New Field/Key.

     The field window opens.
   5. In the Name field of the field window, type language.


     Note: When specifying field names, no blanks are allowed between words.
     Always use a period as a delimiter.

   6. In the Type field, type array, or select array from the Type list.

   7. Click Add.

     Note: Service Manager displays this message: Enter data type of array’s
     element.

     A new window opens, requesting a data type for the array element you have
     created.

   8. In the Type field, select character, and then click Add to add the new array
     element.

   9. Use the scroll bar to locate the new array and element at the bottom of the fields
     list.

     There are two entries in the record for the new field: The first entry defines the
     field as an array. The second entry defines the data type of the array. Both
     entries are listed, using the field name for both entries. However, you can
     override this if you choose. The two entries are added to the bottom of the list of
     fields in the database dictionary record. The second entry is also indented from
     the first entry (this occurs only if the number of fields specified in the database
     dictionary record is less than 50).

     You can now reedit your database dictionary record, update it, or cancel without
     updating.

     Note: You must update your database dictionary record when adding a new
     field, or the database dictionary record will remain the same. You must also add
     a new field(s) to the applicable format(s) via Forms Designer. See the Forms
     Designer Help for additional information about coordinating record changes.

 10. Once you are finished adding fields to the database dictionary, click OK to close
     and automatically update the file.

Related topics

Database dictionary data types
Methods for adding database dictionary records
Field name requirements
Structures
Alias fields


Adding a key
Methods for updating database dictionary records
Modifying a key
Methods for deleting database dictionary records
Deleting a key
Regen a database dictionary
Search for a field in the database dictionary
Open a database dictionary
Access the Database Dictionary utility
Create an active database dictionary record
Database dictionary data types


1.7.10.1.9.7. Add fields to a structure

Applies to User Roles: System Administrator

You can add fields to a structure with the Database Dictionary utility.

Note: You must use the Windows client whenever you need to add a new field/key to
a database dictionary table.

To add a field to a structure:
Example: Add a field to the descriptor structure in the device table.

To add fields to a structure by using the Database Dictionary utility:

   1. Open a file in the database dictionary, and then position the cursor on the
     structure descriptor.

   2. Click New Field/Key. In the Name field, type logical.example . In the Type field,
     type character , or select a character from the Type list of valid data types.

   3. Click Add to add the new field in this structure.

     The field appears in the bottom of the list of fields under the structure.
   4. Double-click the new field to enter the remaining SQL information.

   5. Click OK once more to save your edits and end, or click Cancel to quit without
     recording the edits.

You must also add any new fields to the appropriate formats using Forms Designer to
make the field available to users. For additional information, see the Forms Designer
Help.

When you add a new field to structures that are blobs such as an image type, you
don't need the additional SQL information.

When creating categories in Incident Management, define any additional fields in the
newly created categories within the middle structure in the problem
database dictionary record.

Related topics

     Structures
     Database dictionary data types
     Alias fields


Adding a key
Methods for updating database dictionary records
Modifying a key
Methods for deleting database dictionary records
Deleting a key
Add a structure to the database dictionary
Open a database dictionary
Access the Database Dictionary utility
Regenerate a database dictionary


1.7.10.1.9.8. Create a database dictionary
record by importing RDBMS columns

Applies to User roles: System Administrator

This procedure assumes the Service Manager system doesn't have table create-alter-
drop-rights to the RDBMS system, and that you have not already created a database
dictionary record for this change. If your system has table create-alter-drop-rights to
the RDBMS system, then Service Manager automatically creates any necessary
tables, columns, and indexes when you create a database dictionary record. If your
Service Manager system doesn't have RDBMS table create-alter-drop-rights, we
recommend you create the database dictionary record first and provide DDL to the
RDBMS administrator to implement the necessary changes. The Service Manager
administrator can then activate the database record when the RDBMS tables and
columns become available. This procedure provides an alternative means for you to
keep your database dictionary records synchronized with an RDBMS.

In order for Service Manager to successfully import columns into a database
dictionary record, the RDBMS tables must have the following features:

     The table names must be in uppercase
     The table must be owned by a Service Manager user

To create a database dictionary record by importing RDBMS columns:

   1. Have your RDBMS administrator create the new tables and columns you want
     Service Manager to manage.

   2. Click Tailoring > Database Dictionary.

   3. Type the name you want to use for database dictionary record in the File Name
     field, and then click New.

     For example: newtableone .

     A new blank database dictionary record opens.

   4. Click the SQL tables tab.

   5. In the Alias field, type the short name you want fields in this database dictionary
     record to use to refer to this table. For example, m1 .

     Note: Alias names are limited to three characters.


   6. In the Name field, type the name of the RDBMS table to which you want this
     database dictionary record to map.

     For example: NEWTABLEONEM1 .

   7. In the Type field, type one of the following codes to identify the vendor of your
     RDBMS.
            oracle - for supported versions of Oracle databases
            sqlserver - for supported versions of Microsoft SQL Server databases

   8. If this database dictionary maps to multiple RDBMS tables, repeat steps 5-7 for
     each RDBMS table.

   9. Click Import new columns from SQL to have the Service Manager server log in
     to the RDBMS and load all the columns from the SQL tables defined for the
     database dictionary record.

     Service Manager automatically displays new columns as fields in the database
     dictionary record.

 10. Click OK to save the database dictionary record.

Related topics

Database dictionary
Database dictionary records
Data persistence
Create an active database dictionary record
Create an inactive database dictionary record
Import RDBMS columns into an existing database dictionary record


1.7.10.1.9.9. Designate unique fields in the
array of structures

Applies to User Roles: System Administrator

To designate unique fields in the array of structures:

   1. Locate the field you want to designate as unique. In this example, the unique
     field is feature.id.

   2. Insert your cursor in the Type column for the field you want to designate as
     unique.

   3. Click Edit.
   4. Click the Unique in Structured Array checkbox.
   5. Click OK.
   6. Repeat steps 1 to 5 for each field you want to designate as unique.

Related topics

Adding a key
Alias fields
Database dictionary data types
Methods for deleting database dictionary records
Deleting a key
Methods for updating database dictionary records
Modifying a key
Structures
Database dictionary
Access the Database Dictionary utility
Add an array
Open a database dictionary
Regen a database dictionary
````
