---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.7.10.1.7 .. 1.7.10.1.8
printed_pages: 1924-1931
---

# 1.7.10.1.7 Open a database dictionary

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.7.10.1.7. Open a database dictionary

Applies to User Roles: System Administrator

You can open a database dictionary (dbdict) from Forms Designer, by using System
Definition, or by using the Database Dictionary utility. Choose one of the following
methods to open a dbdict.

Open a dbdict by using System Definition

To open a dbdict by using System Definition:

  1. From the System Navigator, click System Definition > Tables > <dbdict_name>.

     Note: The files are listed alphabetically. You can type the first letter of a table
     name to jump to that alphabetic section. For example, type o to jump to the
     oncall table.

   2. Click the plus (+) next to the file name to open the folder.
  3. Click the plus (+) next to the Fields or Keys folder to open it.
   4. Double-click a field or key to edit it.

Open a dbdict when using Forms Designer

To open a database dictionary when using Forms Designer:

   1. Open an associated form using Forms Designer. For this example, access the
     contacts form.

   2. Select System Definition from the More Actions menu. The dbdict for that form
     opens.

Open a dbdict by using the Database Dictionary
utility

This example opens the contacts dbdict.

To open a database dictionary by using the Database Dictionary utility:

   1. Click Tailoring > Database Dictionary.
   2. Type the name of the dbdict file you want to edit into the File Name field.

     For this example, type: contacts.

   3. Click Search.


     The dbdict definition record(s) with that name opens. If more than one file is
     displayed, select the correct file to view it.

To see more fields, use the scroll bar on the right of the field names list. To see more
keys, use the scroll bar on the right of the keys list.

Related topics

Copying a database dictionary
Rename a database dictionary
Methods for updating database dictionary records
Methods for deleting database dictionary records


1.7.10.1.8. Copying a database dictionary

You can make copies of your database dictionary for backup purposes or to create
another file with similar dictionary definitions.

When you copy a database dictionary, you have the option to copy the record only or
the record and all individual data records contained in the file. If you copy the
database dictionary and all associated records, data in the original file is inaccessible
during the copy process. The amount of time it takes to copy the file and records will
vary depending on how many records are in the original file.

Related topics

Rename a database dictionary
Copy a database dictionary and data records
Copy a database dictionary only
Access the Database Dictionary utility


1.7.10.1.8.1. Copy a database dictionary
and data records

Applies to User Roles: System Administrator
You can copy a database dictionary by using System Definition or by using the
Database Dictionary utility. Choose one of the following methods to copy a database
dictionary and data records.

By using System Definition

To copy a database dictionary and data records, by using System Definition:

   1. From the System Navigator, click System Definition.

   2. Double-click a table.

     An overview of the table opens.

   3. In the Table management section of the overview, click Copy the definition and
     data.

     A confirmation box opens.
   4. In the New table name field, type the name of the table, and then click OK.

     A message displays, stating that the table definition and data were copied to
     new name.

   5. Click OK.

By using the Database Dictionary utility

Example: Make a copy of all the records in the assignment dbdict by creating a new
file with the same database dictionary structure and containing all records contained
in the original file. To copy records from a file by copying the entire file, copy the
associated data records as well.

To copy a database dictionary and data records, by using the Database Dictionary
utility:

   1. Open the assignment dbdict.
   2. Open the More Actions menu and click Copy/Rename.

   3. In the New Name field, enter assignment1.


     Note: File names must be one word. No blanks and no special delimiters are
     allowed.

   4. Select the Copy dbdict and data option to copy the dbdict and all records from
     the assignment file to the assignment1 file.

   5. Click OK to copy the dbdict and data stored in the file.

     Note: The length of time it takes to copy a file with all records will vary
     depending on how many records exist in the file. Copy a file with all associated
     records during non-peak operation times.

     The database dictionary for the assignment1 file opens and Service Manager
     displays this message: *Dbdict successfully copied

     Note: When an asterisk displays in front of a message, it means there are
     additional messages to display which may have relevant information regarding
     this operation.

     You can now make changes to the enduserbackup database dictionary.

   6. Click OK to exit when you have completed modifications to this file.

     Note: You will need to update your database dictionary only if you have added,
     deleted, or modified fields and/or keys.

Related topics

Copy a database dictionary only


1.7.10.1.8.2. Copy a database dictionary
only

Applies to User Roles: System Administrator
You can copy a database dictionary by using System Definition or by using the
Database Dictionary utility. Choose one of the following methods to copy a database
dictionary.

By using System Definition

To copy a database dictionary only, by using System Definition:

   1. From the System Navigator, click System Definition.
   2. Double-click a table.

     An overview of the table opens.
   3. In the Table management section of the overview, click Copy the definition.

     A confirmation box opens.
   4. In the New table name field, type the name of the table, and then click OK.

     A message displays, stating that the table definition was copied to new name.
   5. Click OK.

By using the Database Dictionary utility

Example: Make a copy of the database dictionary in the assignment file. In this
example, we will copy only the database dictionary, not the data records.
To copy a database dictionary only, by using the Database Dictionary utility:

   1. Open the assignment file using database dictionary.
   2. Open the More Actions menu and click Copy/Rename.
   3. In the New Name field of the rename screen, type assignment2 .

     Note: File names must be one word; no blanks and no special delimiters are
     allowed.
   4. Select the Copy dbdict only radio button.


   5. Click OK to begin file copy. The copied dbdict opens. Service Manager displays
     this message: Dbdict successfully copied.

Related topics

Copy a database dictionary and data records
````
