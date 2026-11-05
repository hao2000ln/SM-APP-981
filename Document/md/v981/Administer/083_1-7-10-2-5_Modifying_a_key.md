---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.7.10.2.5 .. 1.7.10.2.7
printed_pages: 2040-2052
---

# 1.7.10.2.5 Modifying a key

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.7.10.2.5. Modifying a key

As new users are added to Service Manager and additional requirements are
specified, you may find the need to modify keys in your database dictionary records
in order to optimize performance.

Note: As with adding new keys, if records already exist in the file when you modify a
key, Service Manager automatically performs a regeneration of file data when you
update the database dictionary record.

A modification to a key may be a change in the field(s) comprising the key or a
change in the key type definition.

Note: When you modify keys in a file that contains records, be careful when defining
key types.

For example, don't change a key from a Nulls & Duplicates type to No Nulls if the
field(s) comprising the key is all null (contains no value). In this case, each record that
did not contain a value in the field(s) comprising the key would require an update,
putting data in the field before the key could be changed to No Nulls.

A CREATE INDEX statement is generated when an existing key is changed. For
example, if the key type is changed or fields are added to the key.

A DROP INDEX statement is generated when an existing key is changed. For example,
if fields are removed from the key.

Note: If Service Manager determines it doesn't have rights to CREATE a TABLE, it
assumes it also doesn't have the rights to perform any of the above operations either.
In which case it writes all database definition language (DDL) into files in the <RUN
directory>/ddl folder and accepts changes to the dbdict without performing the
CREATE INDEX or DROP INDEX operations.

Related topics

Adding a key
Deleting a key
Structures
Alias fields
Methods for updating database dictionary records
Methods for deleting database dictionary records
SQL cache
Add a key as the first key


Insert a key between other keys
Add keys to bottom of the key list
Modify keys: Nulls and duplicates to unique
Delete a key
Create an active database dictionary record


1.7.10.2.5.1. Modify keys: Nulls and
Duplicates to Unique

Applies to User Roles: System Administrator

You can modify keys by using System Definition or by using the Database Dictionary
utility. Choose one of the following methods to modify keys.

Modify keys by using System Definition

To modify keys by using System Definition:

   1. From the System Navigation, click System Definition > Tables > Database
     Definition > Keys > key name

   2. Right click Edit.
   3. Make your changes.
   4. Click OK.
   5. Right click Save on the Database Definition node to save your changes.

Modify keys by using the Database Dictionary
utility

Example: Change the key type for operators in a copy of the assignment file from
Nulls & Duplicates to Unique. If data already exists in the file, ensure that a unique
value also exists in the operator field for every record in the file. If this condition is not
met, you will then have to update each record individually or perform a Mass Update.

To modify keys by using the Database Dictionary utility:

   1. Open the assignment dbdict.
   2. Make a copy of the assignment dbdict named assignment2.
   3. Position the cursor on the key type Nulls & Duplicates above the key field

     operators.
   4. Click Edit.
   5. In the Type field, type: unique .
   6. Click OK to close the window and commit the changes to the file.
   7. You can now reedit your database dictionary record, update it, or cancel without

     updating.
   8. Click OK to close and automatically update the file.

This returns the message Record updated in the dbdict file.


Related topics

Modifying a key
Adding a key
Deleting a key
Structures
Alias fields
Methods for updating database dictionary records
Methods for deleting database dictionary records
Open a database dictionary
Copy a database dictionary only
Add a key as the first key
Insert a key between other keys
Add keys to bottom of the key list
Delete a key
Open a database dictionary
Access the Database Dictionary utility
Regen a database dictionary


1.7.10.2.5.2. Modify keys: Convert the first
unique key to a primary key

You can run the sm command together with system_addconstraint parameter to
convert the first unique key of a table to a primary key. When you run this command,
Service Manager first modifies the fields of the first unique keys to be NOT NULL
(as if you ran system_addconstraint:0 as described in Modify keys: Add Not Null
constraints to the first unique key in a table) and then applies a primary constraint to
those keys.
To convert the first unique key to a primary key by using the command line, use one
of the following methods:

            Note

           Note: Make sure that Service Manager is offline before you execute this
           command.

Method 1
Run the following system_addconstraint command with a value of 1 . You can use
this method with an Oracle database. You can't use this with a SQL Server database.

sm -system_addconstraint:<target>:1
In this example, <target> represents the name of the Service Manager table on which
you wish to add the constraint, and 1 indicates that you wish to convert the first
unique key of the <target> to a primary key.

Method 2


            Caution

           If Service Manager fails to perform the conversion by using the command
           in Method 1, or if you have a Microsoft SQL Server database, use the
           following method. However, you should note the following dangers when
           using this method:

                Data loss will occur if you run this method on a unique index that
                contains null values.
                This method invokes a full-table-copy operation, which may take a
                long time.
                Any database exception error that occurs during the operation can
                cause unexpected results.

To use this method, follow these steps:

   1. Make sure that you have no null values on any unique index.
   2. Execute the following command: sm -system_addconstraint:<target>:2

            Note

           Regardless of which method you use, an attempt to revert from a primary
           key to a unique key may cause unpredictable results.


1.7.10.2.5.3. Modify keys: Add Not Null
constraints to unique keys

To add a Not Null constraint on a key by using the command line, enter the following
command from the operating system command prompt:

            Note

                Make sure that Service Manager is offline before you execute this
                command. Otherwise, the "Not Null" constraint may be lost after you
                modify the dbdict. In this case, you would need run the command
                again.
                Due to differences in how databases handle "Not Null" constraints,
                you should note the following behaviors:
                For Oracle database: a "Not Null" constraint is added to the unique
                index.
                For SQL Server database, a "Not Null" attribute is added to each
                field of the unique index.

sm -system_addconstraint:<target>:0
In this example, <target> represents the tables on which you wish to add the
constraint, and 0 represents that you wish to add a Not Null constraint on the first
unique key of the <target>.
After you run this script, you will see information that resembles the following in the
sm.log file.


 11508( 12940) 12/11/2012 11:24:59 RTE I Adding NOT NULL
constraint for table 'Alertlog'.

 11508( 12940) 12/11/2012 11:24:59 RTE I Adding NOT NULL
constraint for mapped table 'ALERTLOGM1'.

 11508( 12940) 12/11/2012 11:24:59 RTE I Add NOT NULL
constraint for field 'ALERT_ID' successfully!

 11508( 12940) 12/11/2012 11:24:59 RTE I Add NOT NULL
constraint for mapped table successfully, updated to DBDICT!

 11508( 12940) 12/11/2012 11:24:59 RTE I Adding NOT NULL
constraint for table 'Approval'.

 11508( 12940) 12/11/2012 11:24:59 RTE I Adding NOT NULL
constraint for mapped table 'APPROVALM1'.

 11508( 12940) 12/11/2012 11:24:59 RTE I Add NOT NULL
constraint for field 'UNIQUE_KEY' successfully!

 11508( 12940) 12/11/2012 11:24:59 RTE I Add NOT NULL
constraint for field 'FILE_NAME' successfully!

 11508( 12940) 12/11/2012 11:24:59 RTE I Add NOT NULL
constraint for field 'NAME' successfully!

 11508( 12940) 12/11/2012 11:24:59 RTE E Error: SQL code=2293
message=ORA-02293: can't validate (SM930GA.APPROVALM18C1CC5FB) -
check constraint violated

 11508( 12940) 12/11/2012 11:24:59 RTE E API=OCIStmtExecute [in
sqociExecOne], Statement=ALTER TABLE APPROVALM1 ADD CONSTRAINT
APPROVALM18C1CC5FB CHECK( "COMPONENT" IS NOT NULL )

 11508( 12940) 12/11/2012 11:24:59 RTE W Adding NOT NULL
constraint for field 'COMPONENT' failed, please change/remove
the NULL values in records!

 11508( 12940) 12/11/2012 11:24:59 RTE I Adding NOT NULL
constraint for mapped table 'APPROVALA1'.

 11508( 12940) 12/11/2012 11:24:59 RTE I Add NOT NULL
constraint for field 'UNIQUE_KEY' successfully!

 11508( 12940) 12/11/2012 11:24:59 RTE I Add NOT NULL
constraint for field 'FILE_NAME' successfully!

 11508( 12940) 12/11/2012 11:24:59 RTE I Add NOT NULL
constraint for field 'NAME' successfully!

 11508( 12940) 12/11/2012 11:24:59 RTE E Error: SQL code=2293
message=ORA-02293: can't validate (SM930GA.APPROVALA153D2D5D4) -
check constraint violated

 11508( 12940) 12/11/2012 11:24:59 RTE E API=OCIStmtExecute [in
sqociExecOne], Statement=ALTER TABLE APPROVALA1 ADD CONSTRAINT


  APPROVALA153D2D5D4 CHECK( "COMPONENT" IS NOT NULL )
    11508( 12940) 12/11/2012 11:24:59 RTE W Adding NOT NULL

  constraint for field 'COMPONENT' failed, please change/remove
  the NULL values in records!

Lines in blue mean Service Manager starts to add a NOT NULL constraint for a
logical table in SM.
Lines in dark yellow mean Service Manager starts to add a Not Null constraint for a
physical table in SM.
Lines in red mean Service Manager can't add a Not Null constraint to that field,
because that field has NULL values in records. Therefore, you should remove these
NULL values manually.


1.7.10.2.6. SQL cache

Service Manager uses caches for table descriptions and definitions. They can be
flushed by using the Refresh SQL Cache utility (Tailoring > SQL Utilities). This utility
can be executed at any time and may be used to force Service Manager to retrieve
the table descriptions again from the relational database management system
(RDBMS) in case the database administrator has changed a table while Service
Manager was active. Service Manager doesn't cache information about keys because
it doesn't know much about the keys in the RDBMS.

Related topics

Resetting a database table


1.7.10.2.7. Regenerating database keys

Database keys provide efficient, organized access to records in a table. The keys
define a hierarchical tree of indexes associated with the actual data records.
Regenerating database keys discards and then regenerates the existing index tree for
a table. The regeneration process examines each data record in the table and then
adds indexes to the new index tree for each record.

            Note

           When regenerating the keys to a file, ensure that other users aren't
           accessing the file. The regeneration process will interrupt all activity in
           progress on the file being regenerated.

Related topics

Resetting a database table


1.7.10.2.7.1. Regenerate database keys

In this example we regenerate the keys to the contacts table. Regenerating keys for
other tables works the same way.

Applies to User roles: System Administrator

To regenerate database keys:

   1. Click Tailoring > Database Manager.
   2. Select Administration mode.
   3. In the Form field, type contacts , and then click Search.
   4. Select the form.

   5. Open the More Actions menu and choose Regen IR.
     The Confirm Action window opens.

   6. From the prompt, do one of the following:
           Click OK to continue with the file/key regen.
           Click Cancel to exit this screen without doing a regen.

Related topics

Regenerate IR keys
Regen a database dictionary
````
