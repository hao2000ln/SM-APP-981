---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.7.10.1.10 .. 1.7.10.1.10
printed_pages: 1962-1977
---

# 1.7.10.1.10 Methods for deleting database dictionary records

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.7.10.1.10. Methods for deleting database
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

The following table summarizes the methods you can use to delete database
dictionary records and the best practices we recommend.


Action             From the System      From the         From RDBMS
                   Definition utility   Database         utilities
                                        Dictionary form

Delete a database  Best                 Best             You can't delete a
dictionary record  practice: Provide    practice: Pr     Service Manager
                   Service Manager      ovide            database
                   table create-alter-  Service          dictionary record
                   drop-rights to the   Manager          from RDBMS
                   RDBMS, and           table create-    utilities.
                   delete an existing   alter-drop-
                   database             rights to the
                   dictionary record.   RDBMS, and
                   Service Manager      delete an
                   deletes any          existing
                   tables, columns,     database
                   and indexes in the   dictionary
                   RDBMS.               record.
                                        Service
                                        Manager
                                        deletes the
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
                                        delete an
                                        existing
                                        database
                                        dictionary
                                        record. Have
                                        the RDBMS
                                        administrato


Action  From the System                 From the          From RDBMS
        Definition utility              Database          utilities
                                        Dictionary form

                                             r delete
                                             tables,
                                             columns,
                                             and indexes
                                             based on
                                             the DDL.


Action          From the System         From the         From RDBMS
Delete a table  Definition utility      Database         utilities
                                        Dictionary form

                Best                    Best             Have the RDBMS
                practice: Provide       practice: Pr     administrator
                Service Manager         ovide            delete the tables
                table create-alter-     Service          directly in the
                drop-rights to the      Manager          RDBMS. Service
                RDBMS, and              table create-    Manager will
                delete an existing      alter-drop-      automatically
                database                rights to the    update any
                dictionary record.      RDBMS, and       corresponding
                Service Manager         delete an        database
                deletes the table       existing         dictionary
                in the RDBMS.           database         records to map to
                                        dictionary       NULLTABLE the
                                        record.          next time the
                                        Service          server restarts
                                        Manager          and there is a
                                        deletes the      query against the
                                        tables in the    changed table.
                                        RDBMS.
                                        Enable DDL
                                        logging and
                                        use the
                                        Database
                                        Dictionary
                                        form to
                                        delete an
                                        existing
                                        database
                                        dictionary
                                        record. Have
                                        the RDBMS
                                        administrato
                                        r delete the
                                        tables based
                                        on the DDL.


Action  From the System                 From the         From RDBMS
        Definition utility              Database         utilities
                                        Dictionary form


Action          From the System         From the         From RDBMS
Delete a field  Definition utility      Database         utilities
                                        Dictionary form

                Best                    Best             You can't delete a
                practice: Provide       practice: Pr     Service Manager
                Service Manager         ovide            field from RDBMS
                table create-alter-     Service          utilities.
                drop-rights to the      Manager
                RDBMS, and              table create-
                delete an existing      alter-drop-
                field in a              rights to the
                database                RDBMS, and
                dictionary record.      use the
                Service Manager         Database
                deletes the             Dictionary
                column in the           form to
                RDBMS.                  delete an
                                        existing field
                                        in a
                                        database
                                        dictionary
                                        record.
                                        Service
                                        Manager
                                        deletes the
                                        column in
                                        the RDBMS.
                                        Enable DDL
                                        logging and
                                        use the
                                        Database
                                        Dictionary
                                        form to
                                        delete an
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
                                             r delete the
                                             column
                                             based on
                                             the DDL.


Action           From the System        From the         From RDBMS
Delete a column  Definition utility     Database         utilities
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

              Best                      Best             You can't delete a
              practice: Provide         practice: Pr     Service Manager
              Service Manager           ovide            key from RDBMS
              table create-alter-       Service          utilities.
              drop-rights to the        Manager
              RDBMS, and                table create-
              delete an existing        alter-drop-
              key in a database         rights to the
              dictionary record.        RDBMS, and
              Service Manager           use the
              delete the index          Database
              in the RDBMS.             Dictionary
                                        form to
                                        delete an
                                        existing key
                                        in a
                                        database
                                        dictionary
                                        record.
                                        Service
                                        Manager
                                        deletes the
                                        index in the
                                        RDBMS.
                                        Enable DDL
                                        logging and
                                        use the
                                        Database
                                        Dictionary
                                        form to
                                        delete an
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
                                             r delete the
                                             index based
                                             on the DDL.


Action           From the System        From the         From RDBMS
Delete an index  Definition utility     Database         utilities
                                        Dictionary form

                 Best                   Best             Have the RDBMS
                 practice: Provide      practice: Pr     administrator
                 Service Manager        ovide            delete an index
                 table create-alter-    Service          directly in the
                 drop-rights to the     Manager          RDBMS.
                 RDBMS, and             table create-
                 delete an existing     alter-drop-
                 key in a database      rights to the
                 dictionary record.     RDBMS, and
                 Service Manager        use the
                 deletes the index      Database
                 in the RDBMS.          Dictionary
                                        form to
                                        delete an
                                        existing key
                                        in a
                                        database
                                        dictionary
                                        record.
                                        Service
                                        Manager
                                        deletes the
                                        index in the
                                        RDBMS.
                                        Enable DDL
                                        logging and
                                        use the
                                        Database
                                        Dictionary
                                        form to
                                        delete an
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
                                             r delete the
                                             index based
                                             on the DDL.

Delete a database dictionary record

Applies to User Roles:

System Administrator

This procedure assumes the Service Manager system has table create-alter-drop-
rights to the RDBMS system. If Service Manager doesn't have table create-alter-drop-
rights, your database dictionary record changes remain inactive and mapped to null
tables until you activate them. If your system doesn't have table create-alter-drop-
rights to the RDBMS, we recommend you enable the option to create DDL to provide
to your RDBMS administrator. You can then activate the database dictionary record
changes after your RDBMS administrator has created the tables and columns
specified in the DDL.

To delete a database dictionary record:

   1. Sign in to the Service Manager system with a system administrator account.
   2. From the System Navigator, click System Definition > Tables.

   3. Double-click the table name you want to delete.

     Note: Each table name is actually a database dictionary record.

     Note: You can type the first letter of a table name to jump to that alphabetic
     section. For example, type o to jump to the oncall table.

     An overview of the table opens.

   4. In the Table management section of the Table tab, click Delete.
   5. Click OK to confirm the deletion.
   6. Click OK to close the confirmation message.


Remove a field from an existing database dictionary
record

Applies to User roles: System Administrator

This procedure maps any unwanted fields in your system to NULLTABLE. Service
Manager doesn't actually remove data or delete the corresponding columns from the
RDBMS.

Important: We recommend you leave any unwanted columns mapped to NULLTABLE
rather than actually deleting them from the RDBMS to preserve any legacy data these
columns may still contain and to provide you a means to remap the columns at a later
date.

If you choose to remove the column from the RDBMS, Service Manager will recognize
the change and update the database dictionary record to map the deleted column to
NULLTABLE the next time you restart the server and query the RDBMS table that
contained the deleted column.

To remove a field from an existing database dictionary record, add a table nulltable
with alias n1, using the dbdict utility:

   1. Sign in to Service Manager as a System Administrator.
   2. Click Tailoring > Database Dictionary.
   3. In the File Name field, enter the required file name, and then click Search.
   4. When the correct file is displayed, select the SQL Tables tab.

   5. Add the following line:

Alias                                   Name       Type

n1                                      NULLTABLE  sqlserver

6. Click OK. A message appears, stating that the record has been updated in the
dbdict file.

7. Select the Fields tab and double-click the column to be moved to the Null Table.
The field window opens.

8. In the SQL Table field, change the entry from m1 to n1.

9. Click OK to return to the dbdict record. The 'SQL Table' column value for the
changed field is now 'n1.'


10. Click OK to save the changes in the specified table. A message appears, stating
that the record has been updated in the dbdict file.

When you select the table through the System Definition utility, you will see the
change.

Related topics

Database dictionary
Making database dictionary changes
````
