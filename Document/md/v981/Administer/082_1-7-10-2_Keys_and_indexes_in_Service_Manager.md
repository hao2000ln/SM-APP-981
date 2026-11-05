---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.7.10.2 .. 1.7.10.2.4
printed_pages: 2012-2040
---

# 1.7.10.2 Keys and indexes in Service Manager

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.7.10.2. Keys and indexes in Service
Manager

Service Manager keys are abstract entities that provide a logical view of the indexes
in your RDBMS. When you create Service Manager logical keys, the server creates
corresponding indexes on the back-end RDBMS. The benefits of using Service
Manager logical keys are:

     They allow administrators a means to manage and move indexes from one
     environment to another (for example, from a test environment to a production
     environment)
     They allow administrators a means to move indexes from one RDBMS type to
     another (for example, from a SQL Server Express edition demonstration RDBMS
     to a supported RDBMS in a development environment)

In RDBMS terms, Service Manager keys provide constraints on column data as well as
an index of the records in a table that improves query performance. From the Service
Manager side, logical key definitions are one part of a database dictionary record.
The full database dictionary record also includes field and column mappings.
Typically, you will use database dictionary records to manage and move both logical
keys and field mappings at the same time.

Currently, Service Manager can only push keys as indexes on an RDBMS. It can't read
existing indexes (pull) from the RDBMS and create the corresponding logical keys.
Service Manager can still use existing indexes on an RDBMS without the indexes
being defined as logical keys. Any query issued against an indexed column still gets a
performance benefit. However you can only take advantage of the features of logical
keys if you create them from Service Manager.

Service Manager uses the following logic to create indexes:


Service Manager key type                Type of index created on the RDBMS
Primary                                 Primary
Unique                                  Index with unique constraint
No Nulls                                Index
No Duplicates                           Index
Nulls and Duplicates                    Index
IR index                                None
                                        Service Manager directly manages IR
                                        Index keys

You can define Service Manager keys from either the System Definition utility or the
Table Definition utility.

Related topics

Adding a key
Methods for adding database dictionary records
Add a key as the first key
Insert a key between other keys
Key type attributes
Key type definitions


1.7.10.2.1. Key type definitions

Key type definitions allow you to specify the type of key and the names of the fields
within the key. There may be more than one field in one key. A key with multiple fields
is called a concatenated key.

Key Type                                                                                        Service Manager 9.81
Primary
                                        Description
Unique
No Nulls                                No fields in the key can be null. The
                                        value of the complete key can't be null
                                        and must be unique in the index. A
                                        table can have at most one primary
                                        key.

                                        At least one field in the key must not be
                                        null. The value of the complete key
                                        must be unique in the index.

                                        At least one field in the key must not be
                                        null.

Key Type                                                                                        Service Manager 9.81
No Duplicates
                                        Description
Nulls & Duplicates
                                        The value of the complete key must be
                                        unique in the index or the values of all
                                        fields must be null.

                                        Note:

                                        Postgres 15 adds the clause NULLS
                                        NOT DISTINCT . See PostgreSQL 15
                                        release notes

                                        If your SM server version is 9.80 and
                                        your PostgreSQL version is 15 or
                                        above, NULLS NOT DISTINCT is
                                        supported on No Duplicates key, which
                                        means you are not allowed to have
                                        multiple records with a null entry in this
                                        column/field.

                                        If your SM server version is 9.80p1 or
                                        above, NULLS NOT DISTINCT is only
                                        supported on No Duplicates key when
                                        the key contains multiple columns. For
                                        No Duplicates key with single column,
                                        there's no NULLS NOT
                                        DISTINCT constraints.

                                        If you have upgraded the server to 9.80
                                        or 9.80p1 and later versions, and want
                                        to apply this new functionality, you
                                        need to recreate the existing indexes.

                                        All fields can be null. The complete key
                                        value can be in the index more than
                                        once.

 Key Type                                                                                       Service Manager 9.81
 IR key
                                        Description
Related topics
                                        The fields in the key are indexed by IR
UTF-8 (Unicode) support                 Expert. Only one IR key can be used
                                        per dbdict record or IR searches on
                                        that file don't work. You can
                                        concatenate several fields in an IR key.


1.7.10.2.1.1. Key type attributes

The attributes of Unique keys differ by RDBMS type. For example, in an Oracle
environment, the constraints are No Duplicates and Null. Due to the variety of
constraints for each RDBMS, Service Manager only creates Unique key constraints on
the RDBMS that allows Nulls.

You can choose to modify the Unique constraints to primary keys in your RDBMS. If
you choose to do so, this will allow No Nulls and No Duplicates if the key is to contain
those values.

Key type attributes:

Key Type                                No Duplicates            Allows Duplicates
No Nulls                                                         No Nulls
                                        Unique
                                        Primary (If primary key
                                        mode is enabled)

Allows Nulls                            No Duplicates            Nulls & Duplicates

Note: IR keys are indexed separately and aren't a part of the key types listed in this
table.

Related topics

UTF-8 (Unicode) support
Service Manager Programming
Key type definitions


1.7.10.2.1.2. Tuning: Designing keys for
queries

Fully keyed queries typically offer the best performance. You can design keys to
ensure that every query is fully keyed, although it may not be practical in all
instances. Running all queries fully keyed requires defining a large number of keys,
which in turn can cause performance degradation when using the add, update, and
delete operations. In general, the Service Manager System Administrator should
discuss query performance with the Database Administrator and tune the system
accordingly.

Points to consider when designing keys:

     Design keys for the most used queries.
     You can optionally force users to issue fully keyed queries by not allowing
     partially keyed and non-keyed queries.
     Specify the fields that are most commonly used at the beginning of the key in
     the query.
     Specify fields that have many possible values at the beginning of the key. A key
     with a Boolean field at the beginning is inefficient, unless the majority of your
     queries return only a small number of records. For example, flag=true in the
     probsummary table eliminates 90% of all records.
     Do not use the same field in multiple keys. If you update a record and then
     change the value of that field, update all of the indexes that contain that key.
     Do not define more than 25 keys for one file. The more keys defined for a file,
     the more time is required to add, update, and delete records in that file. Likewise,
     if you define too few keys, the operations run faster but the searches on the
     individual file run slower.
     There is no specific rule of how many keys you should define for a file. Logical
     consideration of these facts and your specific work environment are the best
     decision-making factors.

Related topics

Nonkeyed queries
Partially keyed queries
Stored queries
True queries
Key type definitions
Tuning: Fully keyed queries


Tuning: Improving query speed
Tuning: Key selection algorithms
Tuning: Number of fields in files


1.7.10.2.1.3. Tuning: Key selection
algorithms

A key selection algorithm selects a key to perform a query based on the order of the
fields in the query expression, and the order of the fields in the keys defined in the
dbdict. The system then assigns a weight to each key based on the order in which the
fields appear in the query for the key, and the order in which they appear in the query
and key. For example, if the first field in a key matches the first field in the query,
Service Manager assigns that key a higher weight than one that has that field as the
second field in the key. The system makes the decision for all fields in the query and
keys.

Example query and keys:

query:  a=1 and b=2 and c=3 and d=4
        key1: b,c,d
        key2: a,c,d
        key3: a,b
        key4: a

In this example, the key selection algorithm selects key3. The next highest weight is
key2, followed by key4 and key1. The new key selection is based on the location
database dictionary record with the keys {location}, {location,state}, {location,city},
{location.name,location}, and {location.code}.

Related topics

Key type definitions
Tuning: Designing keys for queries
Tuning: Improving query speed
Tuning: Number of fields in files


1.7.10.2.2. Working with primary keys

In versions of Service Manager earlier than 9.32, Service Manager did not support
primary keys or Not Null constraints in the RDBMS tables. While the Service
Manager logical representations did include support for unique keys with a Not Null
constraint, this support was managed entirely within Service Manager and not in the
RDBMS. Because of this lack of functionality, SQL queries generated by Service
Manager added an Is Null condition in the JOIN/WHERE sub-clause as shown in
the following example:

  SELECT m1."RELATIONSHIP_NAME", m1."LOGICAL_NAME"
  FROM CIRELATIONSHIPM1 m1 LEFT OUTER JOIN CIRELATIONSHIPA1 a1
  ON
  ( ( (m1."LOGICAL_NAME" = a1."LOGICAL_NAME")
  OR (m1."LOGICAL_NAME" IS NULL AND a1."LOGICAL_NAME" IS NULL) )
  AND
  ( (m1."RELATIONSHIP_NAME" = a1."RELATIONSHIP_NAME")
  OR (m1."RELATIONSHIP_NAME" IS NULL AND a1."RELATIONSHIP_NAME" IS
  NULL) ) )
  WHERE …

This mechanism resulted in poor performance when you consider the speed
advantages of leveraging the inherent integrity of the database.
In Service Manager 9.32 or later versions of Service Manager, primary keys and Not
Null constraints on the unique keys are now supported.

Usage

From command line
The sm -system_addconstraint command line is used to add either NOT NULL or
primary key constraint to the existing files in SM.

            Note

           For details on how to use the system_addconstraint command, see the
           Modify keys: Convert the first unique key to primary key and the Modify
           keys: Add Not Null constraints to unique keys topics.

There are three levels of operations you can perform by using this command:


   1. Add the NOT NULL constraint only

     While Service Manager already has a No Nulls key type, this key type is in fact
     mapped to an normal index in RDBMS. The NOT NULL constraint added by
      system_addconstraint command adds a true constraint in the RDBMS (such as
     the NOT NULL constraint in and Oracle database.

     The NOT NULL constraint is invisible to end users; End users can't add, modify
     or delete it from anywhere in the Service Manager client.

   2. Modify the first unique key to primary key

     By using this command line, the Service Manager server can convert the first
     unique key of the Service Manager files to true primary keys in RDBMS.
     However, if the data in the table is not qualified for the primary key constraint,
     the conversion from unique key to primary key will fail.

   3. Modify the first unique key to primary key more aggressively

     If you can afford the risk of lost data in the RDBMS, you can use this level of
     operation. At this level, the system_addconstraint converts the first unique key
     to a primary key more aggressively. That is, a temporary table will be created, all
     the qualified data will be moved to this new table, and the old table is dropped,
     and the temporary table is renamed to the original one.

     This process is referred to as a full table copy; unqualified data is lost, and
     qualified data is left.

From SM client

From the Service Manager client, users can add, modify or remove the primary key
type just like any other key type.

Considerations

The following behavior is subjected to the primary key feature:

     When there is data in a table, you can't modify the name of the primary key
     column.
     If there is a RECORD_KEY column and one unique key column in a table, the
     RECORD_KEY column is removed, and the first unique key is converted to a
     primary key when you run the sm -system_addconstraint command.
     Service Manager automatically creates a hidden RECORD_KEY field when there
     is no primary key or unique key in the Database Dictionary file. It is
     recommended that you explicitly define a primary key when creating a new


     dbdict record or convert the first unique key to a primary key if you think it
     necessary for better performance or other reasons.
     Once the database is converted to primary key mode by using the
     system_addconstraint parameter, the first unique key in the Database Dictionary
     is changed, and a hidden RECORD_KEY field may or may not have been created
     accordingly. This behavior could potentially impact any integration you may have
     implemented in Service Manager. For example, the legacy SCENTER integration
     and ODBC driver may rely on the primary key field directly. If such integration
     doesn't work as expected after you apply the primary keys, you should review
     and modify the integration accordingly.
     The type of a newly-created RECORD_KEY field is now VARCHAR2 or VARCHAR
     in Service Manager. However, any existing RECORD_KEY fields remain as
     INTEGER.

Related topics

Retrieve primary key values
Retrieve primary key mode
Modify keys: Add Not Null constraints to the first unique key in a table
Modify keys: Convert the first unique key to primary key


1.7.10.2.2.1. Retrieve primary key values

            Caution

           Caution: You can enable primary key mode only after you have upgraded
           to Service Manager 9.32 applications or later. Otherwise, the following
           procedures may have unexpected results.

You can use the following example to derive your own scripts to read the primary key
values:

   1. Start Service Manager and then log in as an administrator.
   2. Navigate to dbdict.
   3. Create a testkey table with a primary key defined.
   4. Create a detailed form based on the testkey table.
   5. Insert several data points into the testkey table.
   6. Navigate to ScriptLibrary.
   7. Create a new script by copying the code below:

          var retValue;
          var retCode;
          var keyValues = new SCDatum();
          var file = new SCFile("testkey");
          file.doSelect( "true" );
          file.getFirst();
          retValue = system.functions.rtecall("getprimary", retCode,
          keyValues, file );
          print( "file testkey is ", file );
          print( "The return value of getprimary is ", retValue );
          print( "The value of primary key is ", keyValues );

   8. Execute the script. You should see output that resembles the following:


The value of primary key is [C++ object SCDatum] -
{'12/12/12 00:00:00', "54343"}
The return value of getprimary is true
File testkey is [C++ object SCFile] - testkey={['12/12/12
00:00:00', "fgdf", , "54343"]}


1.7.10.2.2.2. Retrieve primary key mode

You can run a script to verify whether Service Manager has the primary key feature
enabled.

Application developers

Application developers can retrieve primary key mode information by using the
sysinfo.get("PKMode") Rapid Application Development (RAD) function. To do this,
use the following example:

   1. Sign in to Service Manager as an administrator.
   2. Navigate to Script Library.
   3. Create a new script named test .
   4. Copy the following code into the text box.

          var retValue;
          retValue = system.functions.sysinfo_get ("PKMode" );
          print ( "Current value of PKMode is " + retValue );

   5. Run the script.

If you have enabled the primary key feature, the following message appears in the
Messages pane of the SM client:
Current value of PKMode is true

Client Developers

Client developers can verify whether they have enabled the primary key feature. To
do this, use the following example:

   1. Sign in to Service Manager as an administrator.
   2. Navigate System Navigator > System Definition > Tables.
   3. Double-click any table, and then click the Fields and Keys tab.
   4. Click any key in the Keys list.
   5. Click the Type drop-down list in the General section.

If you have enabled the primary key feature, you should see Primary Key as an option
in the Type drop-down list.


1.7.10.2.3. Adding a key

A key is an identifying field in a file, used when queries are processed so all fields in a
record don't need to be searched for set criteria. A field or fields in a key must be
defined as a field or fields in the database dictionary record. A key may be added in a
production system without a system restart.

When a database dictionary file is created through Forms Designer, Service Manager
automatically uses the first field defined on the associated format to create a Unique
key. Manually modify the database dictionary record to add the necessary keys to
support on-line and reporting queries, as well as sort sequences. Many other default
system files, set up in the base system, may need to be changed, based on your
individual search and reporting requirements. This section details the manual addition
and manipulation of database dictionary record/file keys.

Note: If records already exist in the file when you add a key, updating the database
dictionary record will cause Service Manager to automatically perform an index
regeneration.

If you add keys to a file that contains records, be careful when defining key types. For
example, don't define a new key as No Nulls (no blank values) if records exist in the
file that contain no data in the particular field(s) comprising the key.

Each record not containing a value in the key field would require an update,
populating the field with data. The updates must be performed prior to adding the No
Nulls key in order to satisfy the new key definition.

A CREATE INDEX statement is generated when a new key is defined in the dbdict.

Note: If Service Manager determines it doesn't have rights to CREATE a TABLE it
writes all database definition language (DDL) into files in the <RUN directory>/ddl
folder and accepts changes to the dbdict without performing the CREATE INDEX
operation.

Related topics

Modifying a key
Deleting a key
Structures
Database dictionary data types
Alias fields
Methods for updating database dictionary records
Methods for deleting database dictionary records


Delete a key
Add a key as the first key
Insert a key between other keys
Add keys to bottom of the key list
Modify keys: Nulls and duplicates to unique


1.7.10.2.3.1. Add a key as the first key

Applies to User Roles: System Administrator

Example: Add the language.key field as a No Nulls key to the unitofmeasure
database dictionary record.

In this example, you add the language.key field to the unitofmeasure record and
assign it as the first key with a property of No Nulls. This field is a required field in the
record.

To add a key as the first key:

   1. Sign in to the Windows client.

   2. From the System Navigator, click System Definition > Tables > unitofmeasure
     > Keys.

   3. In the Keys section, click New.

   4. In the General section, click the Type field. For this example, select No nulls in
     the Type list as the key type.

     The following key types are valid:

     • Nulls and duplicates - allows nulls and duplicates in all the fields in the key.
     • No nulls - allows duplicates, if selecting No nulls, the key must contain data in
     at least one of the fields in the key.
     • No duplicates - allows null records but not duplicates. Although the data must
     be unique, but the field may be blank.
     • Unique - must contain unique data and can't be blank.
     • IR key - files that contain an IR key must also contain another key that's
     Unique, with No nulls, No duplicates or Nulls, and Duplicates. A Service Manager
     file can contain only one IR key.

   5. Click Add.

   6. From the Choose a field to add to the key dialog, select the language.key field,
     and then click OK.

   7. In the Keys section, select the key you added (language.key in this example),
     and click Up.

     The key language.key now appears as the first key in the list of keys in the
     database dictionary record. All other keys are moved down the screen.


   8. Once you are finished adding keys to the table, click Save and then click OK to
     confirm your changes.

     Service Manager automatically updates and regenerates the file.

   9. To remove the key, select the key and then click Delete. Click Save.

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
     Add keys to bottom of the key list
     Delete a key
     Insert a key between other keys
     Modify keys: Nulls and duplicates to unique
     Open a database dictionary
     Regenerate a database dictionary


1.7.10.2.3.2. Add keys to the bottom of a
key list

Applies to User Roles: System Administrator
You can add keys to the bottom of the key list by using System Definition or the
Database Dictionary utility. Choose one of the following methods to add keys.

Note: You must use the Windows client whenever you need to add a new field/key to
a database dictionary table.

Add keys to the bottom of the key list by using
System Definition

To add keys to the bottom of the key list by using the System Definition:

   1. In the System Navigator, click System Definition > Tables > file_name >
     Database Definition > Keys.

     Note: To expand any table in the record list, type the first letter of a table name
     to jump to that alphabetic section. For example, type o to jump to the oncall
     table.

   2. Right-click New > Key.

   3. Select the key type, and then click OK.

     Your new key appears in the key list without a (+) sign to the left, because the
     key is still empty.
   4. Drag the fields you want for that key from the Fields node and drop them on the
     key.

   5. Right-click Save on the Database Definition node to save your changes.

Add keys to bottom of the key list by using the
Database Dictionary utility

Example: Add a concatenated key including the fields sysmodtime and sysmoduser
to the bottom of the key list.

To add keys to the bottom of the key list by using the Database Dictionary utility:


1. Open the file in the database dictionary, and then scroll down the keys until you
  reach the bottom of the list.

  The last key in the unitofmeasure database dictionary record is language.key.

  This is a single key, because it contains only one field. If the key is a
  concatenated key, regardless of how many fields are included in the key, only
  two fields are displayed in the key list.

  To view all fields contained in a concatenated key, you must use the scroll arrow
  buttons to the right of the array, or edit the key.

  The blank header represents the beginning of the next key. The number of lines
  displayed per key depends on the number of fields concatenated in that key.

  Position the cursor on the blank header field located below the key type, and
  then click New Field/Key to display the key definition window.

2. Type Nulls & Duplicates in the Type field, or select Nulls & Duplicates from the
  Type list.

3. Select the fields array, and then do the following:

       • Type sysmodtime in the first field of the array.
       • Type sysmoduser in the second field of the fields array.
       • Click Add to commit this new key to the database dictionary file. Service
       Manager displays the message: Key added to the unitofmeasure file . The
       concatenated key comprised of sysmodtime and sysmoduser now appears
       in the bottom of the list of keys in the unitofmeasure database dictionary
       record.
       • Place the cursor in the applicable position in the keys section of the
       database dictionary record, and then click New to add additional keys to the
       database dictionary record without closing the window.

4. You can reedit your database dictionary record, update it, or cancel without
  updating.

  Note: You must update your database dictionary record when adding a new key,
  or the database dictionary record will remain the same.

5. Press OK once you are finished adding keys to the database dictionary record,
  to close and automatically update the file.

  This returns the message Record updated in the dbdict file.

6. You can continue by doing one of the following:


          • Click OK (regen file) to continue with the regen.
          • Click Cancel (F3) to abort the regen and restore the database dictionary
          record to the version prior to the latest changes.
          • Schedule a time for the file regeneration, using Schedule (clock button).

   7. To remove the key, select it and click Edit.

     The edit window appears.

   8. Ignore the edit window and instead click Delete on the main record format.

   9. The next viable key is displayed. If you don't modify this key, click OK.

     You are returned to the database dictionary record, minus the key.

 10. Click OK to save the record.

Related topics

Adding a key
Alias fields
Deleting a key
Methods for deleting database dictionary records
Methods for updating database dictionary records
Modifying a key
Structures
Access the Database Dictionary utility
Add a key as the first key
Insert a key between other keys
Open a database dictionary
Regen a database dictionary


1.7.10.2.3.3. Insert a key between other
keys

Applies to User Roles: System Administrator

Example: Insert the key company between the keys name and operators in a copy of
the assignment file.

To insert a key between other key:

   1. Open the assignment dbdict.
   2. Make a copy of the assignment dbdict named assignment1.
   3. Click on the key type of the second key, Nulls & Duplicates in this example,

     above the operators key.
   4. Click New.
   5. In the new key window, select a valid key in the Type field by either typing in the

     value or selecting it from the drop down menu under the arrow button. Use No
     Nulls for this example.
   6. Enter company in the field names array.
   7. Click Add to add this key to the assignment2 database dictionary record.

The key company now appears after the first key, in the second place in the list, and
the operators key has moved down the list of keys in the assignment2 database
dictionary record. All other keys are moved down the screen. You can scroll the keys
array to view the other keys in the list.

   1. You can now reedit your database dictionary record, update it, or cancel without
     updating.

You must update your database dictionary record when adding a new key, or the
database dictionary record will remain the same.

   1. Press OK once you are finished adding keys to the database dictionary record,
     to close and automatically update the file. This returns the message Record
     updated in the dbdict file.

   2. You can either click OK (regen file) to continue with the regen, click Cancel (F3)
     to abort the regen and restore the database dictionary record to the version prior
     to the latest changes, or schedule a time for the file regeneration, using
     Schedule (clock button).

   3. To remove the key, select it and click Edit.


   4. The edit window appears, but ignore the window, and instead click Delete on the
     main record format.

   5. The next viable key is displayed, if not modifying this key click OK.

You are returned to the database dictionary record minus the key.

   1. Click OK to save the record.

Related topics

Adding a key
Modifying a key
Deleting a key
Structures
Alias fields
Methods for updating database dictionary records
Methods for deleting database dictionary records
Open a database dictionary
Copy a database dictionary and data records
Add a key as the first key
Add keys to bottom of the key list
Modify keys: Nulls and duplicates to unique
Delete a key
Access the Database Dictionary utility
Regen a database dictionary


1.7.10.2.4. Deleting a key

You can delete keys from a database dictionary record. Remember, there is a direct
correlation between the number of keys defined in a database dictionary record and
the length of time it takes to add a record to that file.

A DROP INDEX statement is generated if a key is removed from the dbdict.

Note: If Service Manager determines it doesn't have rights to CREATE a TABLE it
writes all database definition language (DDL) into files in the <RUN directory>/ddl
folder and accepts changes to the dbdict without performing the DROP INDEX
operation.

Related topics

Adding a key
Modifying a key
Structures
Alias fields
Methods for updating database dictionary records
Methods for deleting database dictionary records
Add a key as the first key
Insert a key between other keys
Add keys to bottom of the key list
Modify keys: Nulls and duplicates to unique
Delete a key


1.7.10.2.4.1. Delete a key

Applies to User Roles: System Administrator

You can delete keys from System Definition and from the Database Dictionary utility.
Choose one of the following methods to delete a key.

Delete a key by using System Definition

To delete a key by using System Definition:

  1. From the System Navigator, click System Definition > Tables > file_name >
     Fields

     Note: You can type the first letter of a table name to jump to that alphabetic
     section. For example, type o to jump to the oncall table.

     An overview of the table opens.
   2. Select the Fields and Keys tab.

   3. In the Keys section, click on a key.

     Caution: When you select a key for deletion, you don't receive a confirmation
     message. The key is automatically deleted.

Delete a key by using the Database Dictionary
utility

Example: Delete the Nulls & Duplicates key for operators in the assignment1
database dictionary record.

To delete a key by using the Database Dictionary utility:

   1. Click Tailoring > Database Dictionary.
   2. Open the assignment file, and then make a copy of the assignment dbdict

     named assignment1.

   3. Open the assignment1 dbdict record.

   4. On the Keys tab, place the cursor in the Nulls & Duplicates section under which
     the operators key is located, and then click Edit Field/Key. The key window
     opens.

   5. Click Delete from the tool tray.


   6. Click Yes to confirm the delete.

     The screen redisplays with the key operators removed from the list of keys, and
     the keys below it moved up to take its former place.

   7. Click OK to close and automatically update the file.

     You receive a message that states the record has been updated in the dbdict
     file.

Related topics

Deleting a key
Adding a key
Modifying a key
Structures
Alias fields
Adding a key
Methods for updating database dictionary records
Methods for deleting database dictionary records
Open a database dictionary
Copy a database dictionary and data records
Add a key as the first key
Insert a key between other keys
Add keys to bottom of the key list
Modify keys: Nulls and duplicates to unique
Access the Database Dictionary utility
Regen a database dictionary
````
