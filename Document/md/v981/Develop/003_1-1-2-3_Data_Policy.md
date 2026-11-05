---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.1.2.3 .. 1.1.2.4.7
printed_pages: 57-88
---

# 1.1.2.3 Data Policy

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.2.3. Data Policy

Data Policy enables System Administrators to apply default values, mandatory fields,
and lookup validations to a specific table. These policies, once set, are enforced
across the entire system, regardless of what form is being used to display the data.

Format Control performs many common data tailoring tasks in Service Manager, is
often complex, and is applied at the form level. If overused, Format Control can affect
system performance. Data Policy operates at the table level and achieves many of the
same results as Format Control without the complexity and without taxing system
resources.

Related topics

Environment configuration
Data Policy expressions
Data Policy and the object record
Data Policy and encryption
Access Data Policy
Change the encryption key value
Example: Create and manage a revision
Create a Data Policy revision


1.1.2.3.1. Access Data Policy

Applies to User Roles: System Administrator

To access Data Policy from the System Navigator

  1. Open System Definition > Tables > file_name > Fields > field_name.

     The Fields and keys definitions for the application table form opens.

   2. Edit the field properties in the Data Policy section, and then click Save to save
     your changes.

To access Data Policy from the Database Dictionary
utility

   1. Open the table (File Name) that you want to set Data Policy for in the database
     dictionary.

   2. Select Data Policy from the More Actions menu.

     The datadict.g form opens, containing the selected file.

   3. Edit the file properties, and then click Save to save your changes.

To search for Data Policy records

   1. Open Tailoring > Data Policy.
   2. Specify search criteria to select the records you want, or leave the form blank to

     see all records, and then click Search.
   3. Select a table (file) from the list.

   4. Select Data Policy from the More Actions menu.

     The datadict.g form opens, containing the selected file.
   5. Edit the file properties, and then click Save to save your changes.

Related topics

Environment configuration
Data Policy
Data Policy expressions
Data Policy and the object record
Data Policy and encryption


Change the encryption key value
Example: Create and manage a revision
Create a Data Policy revision


1.1.2.3.2. Data Policy expressions

Data Policy rules apply to the GUI presentation of data. This allows some degree of
data control into your system without the need to construct numerous different forms
and views.
For example:

     In the Invisible or Read Only fields, you specify an expression. If this expression
     evaluates to true at the time the record is opened, any controls referencing the
     field in question are set to read-only or visible, as appropriate
     If you want only System Administrators to be able to modify the contact.name
     field in the contacts file, use this expression: index("SysAdmin", $lo.ucapex)>0

The record’s database dictionary record defines the fields available on a file’s Data
Policy record. You can't add new fields directly to a Data Policy record.
To see your changes to Data Policy you must restart the client by logging out of the
system and logging in again.


1.1.2.3.3. Usage Type column in Data
Policy

The Usage Type column determines a field's availability for defining views, defining
templates, mass functions, and smart actions in Service Manager.

Usage Type                              Description
Deprecated
                                        The field won't be available for defining
                                        views, defining templates, mass
                                        functions, and smart actions.

                                        In general, the Deprecated usage type
                                        also indicates that you may use the
                                        field in older versions but now this field
                                        is obsolete. It's still there for upgrades.
                                        However, since it's no longer used, you
                                        can use this usage type to exclude it
                                        from views.

System                                  The field will only be available for
                                        defining views.
Application
Data                                    The field isn't restricted.
<empty>
                                        There is no functional difference when
                                        you leave the value empty or set the
                                        value to Application or Data
                                        (informational only)

You need to leave the Usage Type column empty in Data Policy. Or, set the value to
Data or Application for any custom fields used with Views, Templates, mass
functions, or smart actions.


1.1.2.3.4. Data Policy and the object
record

Data Policy control for a table can associate and expand with an object record. If
there is an associated object, the object offers control over revisions, IR searches,
and record displays through SM Manage. If a record in Data Policy has an object
associated with it, the fields on the Engine Specifications tab are grayed out and
unavailable. A button appears that takes you to the object record, where you can
make changes.

If a Data Policy record doesn't have an associated object, then the Engine
Specifications and SM Manage tabs contain fields you can edit that control revisions
and display.

Related topics

Environment configuration
Data Policy
Data Policy expressions
Data Policy and encryption
Access Data Policy
Change the encryption key value
Example: Create and manage a revision
Create a Data Policy revision


1.1.2.3.5. Creating revisions

The revisions option for Data Policy creates a revision database dictionary record,
whose name is specified on the Engine Specifications tab. You can create revisions
either for an entire set of records or for a single form or record. You must be at the
start panel of the application you are working with to create baseline revisions for an
entire set of records. For example, you create a baseline revision of all the forms in
the Forms Designer from the Forms Designer main menu.

When you create a revision, you create a copy of the record only, not the associated
database dictionary record. As a result, any time a field is added to a database
dictionary record, you add it to the revision file database dictionary record.

Create a Data Policy revision

Applies to User Roles: System Administrator

To create a Data Policy revision:

   1. Click Tailoring > Web Services > Data Policy.
   2. Click the Engine Specifications tab.
   3. Type a revision file name in the Revision File Name field.
   4. To limit the number of revisions allowed, fill in the Max # of Revisions field.
   5. Click Create Revision File from the More Actions menu.

Example: Create and manage a revision

Applies to User Roles: System Administrator

The following example steps through the process of creating and controlling a
revision. The example uses the location file.

   1. Open the location record in Data Policy.
   2. Type a revision name on the Engine Specifications tab, for example type

      LocationRevision .
   3. Type the maximum number of revisions allowed on the system for files

     controlled by this record. For example, type 2 .
   4. Save the location Data Policy record.
   5. Go to the Database Manager and type location in the Form field. A record list

     opens.
     Every file in the record list is controlled by the Data Policy record Locations.
   6. Select a record, for example ACME HQ, based in Chicago.


   7. With the record open, click Revision > Create Revision from the More Actions
     menu. Include any relevant text to help you understand the revision and its
     purpose. Label this revision one.

   8. Make a change to the ACME HQ record and save.
   9. Click Revision > Create Revision from the More Actions menu. Label this

     revision two.

The maximum number of revisions has now been reached for the files controlled by
the Locations Data Policy record. The next revision you make will eliminate the
revision you labeled one.

Related topics

Environment configuration
Tools to use for promoting customizations
Revision control
Data Policy and encryption


1.1.2.3.5.1. Example: Create and manage a
revision

Applies to User Roles:

System Administrator

The following example steps through the process of creating and controlling a
revision. The example uses the location file.

   1. Open the location record in Data Policy.
   2. Type a revision name on the Engine Specifications tab, for example type

      LocationRevision .
   3. Type the maximum number of revisions allowed on the system for files

     controlled by this record. For example, type 2 .
   4. Save the location Data Policy record.
   5. Go to the Database Manager and type location in the Form field. A record list

     opens.
     Every file in the record list is controlled by the Data Policy record Locations.
   6. Select a record, for example ACME HQ, based in Chicago.
   7. With the record open, click Revision > Create Revision from the More Actions
     menu. Include any relevant text to help you understand the revision and its
     purpose. Label this revision one.
   8. Make a change to the ACME HQ record and save.
   9. Click Revision > Create Revision from the More Actions menu. Label this
     revision two.

The maximum number of revisions has now been reached for the files controlled by
the Locations Data Policy record. The next revision you make will eliminate the
revision you labeled one.


1.1.2.3.5.2. Create a Data Policy revision

Applies to User Roles:
System Administrator
To create a Data Policy revision:

   1. Click Tailoring > Web Services > Data Policy.
   2. Click the Engine Specifications tab.
   3. Type a revision file name in the Revision File Name field.
   4. To limit the number of revisions allowed, fill in the Max # of Revisions field.
   5. Click Create Revision File from the More Actions menu.


1.1.2.3.6. Revert to a previous revision

Applies to User Roles:
System Administrator
To revert to a previous revision:

   1. Open the form you want to use a previous version of.
   2. Click More or the More Actions icon.
   3. Click Revision.
   4. Click Revisions > Find Revisions.
   5. Click the revision you want to restore.
   6. Click Revert to this Revision from the More Actions menu. The system prompts

     you as to whether you want to save the current version of the record as a
     revision. It is recommended you do.


1.1.2.3.7. Purge revisions

Applies to User Roles: System Administrator

Purge scripts help administrators with revision maintenance. The
sc.revision.purge.hanging script purges all revisions that no longer have a parent
record because the parent record was either deleted or renamed. The
sc.revision.purge script purges all revisions from the system.

There are two options available when purging revisions.

To search for revisions:

     Purge All Revision Records removes all revisions from your system.
     Purge Hanging Revisions removes only hanging revisions from your system. A
     hanging revision is a revision with no associated file or form. For example, if you
     create a form, create a revision of the form, and then delete the original form,
     the revision remains on the system but with no associated file or form.

            Note

           You can restore a deleted form from its revision file.

   1. Sign in as a System Administrator.
   2. Click System Administration > Base System Configuration > Miscellaneous >

     Purge Hanging Revision Records.
   3. To remove hanging revisions from your system, click Purge Hanging Revisions

     Records.
   4. To remove all revisions from your system, click Purge All Revision Records.


1.1.2.3.8. Data Policy and encryption

When the Data Policy for a table changes, the system checks to see if the encryption
status changes. If the status changes from false to true, each record in the file is read,
the field is encrypted, and the data is written back to the file. If the status has
changed from true to false, each record in the file is read, the field is decrypted, and
the data is written back to the file. The entire process includes reading and updating
each record in the file, which could result in performance loss.

            Important

           If you encrypted any field in your database, ensure that you store the KEY
           value defined in the sm.ini file in a safe place. Without the correct KEY
           value, you will not be able to decrypt. Once a field in a table is encrypted,
           users can no longer search for the contents of the field. The field is not
           searchable.

Related topics

Environment configuration
Data Policy
Data Policy expressions
Data Policy and the object record


1.1.2.3.9. Change the encryption key value

You can set the KEY value that encrypts data on your system with the encryptionkey
parameter in the sm.ini file. This field must be exactly 8 bytes in length. If you change
the KEY value, then every field in every file must be checked and re-encrypted.
Changing the KEY value results in a significant performance hit to the system while
re-encryption takes place.

To change the encryption key value, perform the following steps:

   1. Shut down the Service Manager server.

   2. Run the sm -changeencrkey:XXXX command to change encryptionkey . For
     example, sm -changeencrkey:qwertyui where qwertyui is the new 8-byte key.

     This command decrypts all encrypted fields using the key defined in the sm.ini
     file and then re-encrypts those fields using the key specified in the command
     line parameter encryptionkey . The length of time the conversion takes depends
     on the size of the database and the number of encrypted tables.

  3. Update your sm.ini file to the new key immediately after performing step 2.

     Note that if you are working in a horizontal scaling implementation, you must
     update the encryptionkey value in the sm.ini file for each host. Make sure
     the encryptionkey value is correct and consistent on each
     host. Correct encryptionkey for all nodes as required, and then restart
     the Service Manager server after updating the sm.ini file.

Caution: Encrypting SQL data that's already mapped will increase the size of the data.
Therefore, the existing SQL mapping and column definition may not provide enough
space to store the whole encrypted value. Be sure to change the SQL data type to
accommodate the new column size. If the encrypted value gets truncated, the value
can no longer be decrypted.

Use this formula to calculate the new column length:

encrypted_length = (unencrypted_length + 12) * 2.


1.1.2.3.10. Create an alias for your custom
CI display name field

Applies to User Roles:

System Administrator

In the out-of-box system, the device table uses the display.name field to store CI
display names. However, your production system may use a custom field to store
CI names. For this reason, in the device dbdict record, the sm.device.display.name
field is created as an alias for the display.name field. If your device table uses a
custom field to store CI names, you only need to specify it in the data policy record so
that Service Manager automatically recreates an alias named
sm.device.display.name for it.

            Caution

           Before your proceed, make sure that your custom CI name field has a
           character data type, and is configured to be a No Nulls key and not a
           Unique key. If your custom field doesn't meet these conditions, it is
           unavailable for selection from the Display Field drop-down list in the
           device data policy record.

To create an alias for your custom CI display name field, follow these steps:

   1. Open the device table from Database Dictionary.
   2. From the More or More Actions menu, select Data Policy to open the data policy

     record.
   3. In the Display Field field, select your custom CI display name field from the

     drop-down list, for example, mycompany.ci.name.

                   Note

                When you change the Display Field value, Service Manager removes
                the alias from the previous field and adds it to the new field.

   4. Click Save to save the data policy record.


5. Click OK twice to save the DBDICT record.

6. Open the device DBDICT record again, and verify that an alias named
  sm.device.display.name has been created for your custom field (that is, both
  the custom field and the alias have the same index number).

7. Execute the refreshSubscriptionDisplayName ScriptLibrary to update the CI
  information in subscriptions.

               Note

             CI information in subscriptions is derived from the Display Field
             defined in the device data policy record. This step is needed
             whenever you have changed the Display Field setting.


1.1.2.3.11. Define auto complete table
columns

Applies to User Roles: System Administrator

For all fields that have auto complete enabled, their data policy record provides an
Auto Complete Table Columns tab, which enables you to define the fields (columns)
to display in the auto complete drop-down table for the field. By providing additional
key information about the field, this feature helps users easily select the right record
from a list of auto complete results.

            Tip

           For a list of fields with auto complete enabled in the out-of-box system,
           see the Out-of-box Comfill fields with auto complete enabled section in
           Auto complete.

            Note

           Auto Complete is always enabled for a field that has a referenced table
           defined, regardless of the value of the comfillAutoComplete parameter
           and the Auto Complete property setting defined in Forms Designer for
           that field. For more information, see Auto complete.

For example, when a web client user enters CI information in the reference modules
(such as Incident, and Change), a drop-down table for auto complete is displayed,
which lists a number of field values of the matching CIs so that the user can easily
select the right CI. By default, the Display Name, CI Identifier, Type, Environment, and
Assignment columns are displayed in the auto complete table for CI fields, and only
one column is displayed for non-CI fields (for example, the Contact field in an
Interaction record).

You can customize the auto complete table columns for a field that has auto complete
enabled. To do this, follow these steps:

   1. Open the data policy record for the field. For example, if this is a CI field, open
     the device data policy.

     There are several ways to do this. For example, open the device dbdict record,
     and then click More > Data Policy.


2. Click the Auto Complete Table Columns tab, and then edit the existing list of
  fields.

  For a CI field, the auto complete drop-down table always displays the
  display.name field as the first column, even if you delete it from this tab.

  For a non-CI field, auto-complete by default uses the target field that's defined
  in the corresponding link record. If you want to add more columns, be sure to
  add this field as the first column. For example, for the Contact field in the
  Interaction form, the Incidents link record defines the contact.name field of the
  contacts table as the target field. Therefore, if you want to add more columns,
  you must add the contact.name field as the first column on the Auto Complete
  Table Columns tab of the contacts data policy record. See the following figures.

3. Save the data policy record.

               Note

             If you configure an empty or duplicate row, the system automatically
             removes it when you save your configuration.


1.1.2.3.12. Specify a referenced table for a
field

The Data Policy for a table can define a referenced table for a field in the table. A
referenced table is the table that's referenced by the current field. From a business
logic perspective, the current field must be used to store the same data as the unique
key field of the referenced table. For example, in the out-of-box cm3r Data Policy
record, the device table is defined as the referenced table of the assets field (the
Affected Configuration Item field). Once you have specified a referenced table,
Service Manager creates a link that points from the current field to the unique key
field of the referenced table.

Furthermore, the referenced table must have a Display Field defined. The current field
displays the values of the display field, instead of values of the unique key field of the
referenced table. For example, the Affected Configuration Item field in a Change
record displays the CI display names (stored in the display.name field), instead of the
CI Identifier values (stored in the logical.name field).

This functionality automatically updates the CI data in the reference modules (such as
Change, and Incident) when a CI name is updated in the Configuration module so that
data integrity is maintained across the modules.

To specify a referenced table for a field, follow these steps:

   1. Click Tailoring > Data Policy.
   2. Open the corresponding Data Policy record. For example, for the affected.item

     field in the cm3r table, open the cm3r Data Policy record.
   3. Select the Field Settings tab.

   4. Select the field, and select a value from the drop-down list in the Referenced
     Table column. For example, select device.

                   Note

                Currently, only the device table can be used as a referenced table.

   5. Click Save to save the Data Policy record.

     In this example, Service Manager creates a link between the field and the
     logical.name field of the device table, if the link doesn't already exist. In the link
     record, the logical.name field is the target field.


Next, you need to specify a display field for the referenced table. This is the field of
the referenced table whose values will be displayed in the current field. The current
field derives data from the display field based on the unique key field of the
referenced table. For details, see Specify a display field for a referenced table.


1.1.2.3.13. Specify a display field for a
referenced table

You need to define a Display Field in the Data Policy (datadict) record of a referenced
table. For example, the out-of-box system defines the device table as the referenced
table for the assets field of the cm3r table, and defines the display.name field of the
device table as the Display Field. Because of this configuration, Affected CIs in a
Change record are retrieved according to their CI Identifier values and displayed as
their display names.

            Note

           A referenced table must have only one field as the unique key. Currently
           only the device table can be set as a referenced table.

To specify a display field for a referenced table, follow these steps:

   1. Click Tailoring > Data Policy.
   2. Open the Data Policy record for the referenced table. For example, open the

     device Data Policy record.
   3. In the Display Field field, select a value from the drop-down list. For example,

     select Configuration Item Name - display.name.
     A display field has an alias defined in the dbdict record. When you change the
     Display Field value, Service Manager removes the alias from the previous
     display field and adds it to the new field.

                   Note

                A display field must meet the following conditions:
                      Has a character data type
                      Is not a Unique key field.
                      Is a No Nulls key field


4. Click Save to save the Data Policy record.


1.1.2.4. Data validation

The validity table enables you to define a field’s valid values in a list of values, a list of
ranges, a secondary file, and customized RAD subroutines. These values are then
used for validating operator-entered data and for lookup processing (similar to
Service Manager Find and Fill). These various validity definitions are consolidated in
one file, resulting in easy maintenance. This can be of significant benefit when
multiple forms access one database.

Validation routine

The value of a field is validated against a list of values (for example 10, 20, 30, or 40),
a list of ranges (for example 50 through 60), a secondary file (similar to the Format
Control secondary file query) and customized RAD subroutines. The fields within a
file are validated in a particular order (for example fieldx, fielda, fieldg), in alphabetical
sequence (for example fielda, fieldg, fieldx) or according to a field validation
sequence number. The default processing of the validation routine validates the value
of a field against the definitions in the validity table. If the current value of a field is
invalid, a summary list of valid values and ranges is presented to the user. If no values
or ranges are defined for the field, a list of records from the secondary file is
presented. The user can then correct the invalid value and continue processing;
return to the calling application; or force the application to accept the invalid value.
The validity table also enables you to override this processing and execute
customized RAD code.

User-defined processing statements

After determining that a field contains a valid value or range, user-defined processing
statements are executed. Validity processing continues to the next field in the validity
definition table until all specified fields are validated.

Each validity table definition contains four levels of definition:

     Field Summary
     Secondary File Query Information
     Values Summary
     Range Summary

Maintenance procedures

When it is necessary to differentiate the maintenance procedures of these different
levels, the order of the documentation is Field level, Secondary Queries level, Values


level, and Ranges level. For instance, the section on updating shows how to update
Validation Records at the Field Level, the Value Level, and then the Range Level. All
applications and procedures described refer to a unique maintenance application that
specifically supports validity table maintenance. If you access any of the validity table
databases with any other application (such as Database Manager), you must ensure
that all data is properly structured in order for the validity definitions to work correctly
at run time. We recommend that you always follow the documented Validity
procedures.

Related topics

Accessing the validity file
Deleting validity record components
Invalid application names
Invalid files and form names
Invalid field names
Printing validity definitions
Invoking validity table processing
Look-up processing
Validity validation rules


1.1.2.4.1. Accessing the validity file

Following are the ways you can access the validity file.

     Access Validity from a menu

   1. Click Tailoring > Tailoring Tools > Data Validation. The Validity Table
     Specifications form opens.

   2. Click Search. A list of validity maintenance records opens.

     Access Validity through Database Manager

   1. Click Tailoring > Database Manager.
   2. Type validity in the Form field, and then click Search. A list of the validity form

     records in your database opens.
   3. Double-click a validity Format Name record, and then click Search. The Validity

     Table Specifications form opens.
   4. Click Search. A list of data validation records opens.

     Access Validity from the command line

   1. Click Command in the System Administrator’s home menu.
   2. Type validity in the command line.
   3. Press Enter. The Validity Table Specifications form opens.
   4. Type a field name or a file name in the form, and then click Search. The

     requested form opens.

Related topics

Data validation
Deleting validity record components
Invalid application names
Invalid files and form names
Invalid field names
Printing validity definitions
Invoking validity table processing
Look-up processing


1.1.2.4.2. Deleting validity record
components

You can delete entire validity records or parts of records using several different
methods.

     Delete the entire validity record and all its components.
     Delete a value or range definition from an individual record.
     Delete value and range definitions from a table format.

Related topics

Data validation
Accessing the validity file
Invalid application names
Invalid files and form names
Invalid field names
Printing validity definitions
Invoking validity table processing
Look-up processing
Delete an entire validity record
Delete a single value or range definition
Delete value or range definitions from a table


1.1.2.4.3. Invalid application names

If you have entered an invalid application name in the Alt Application field in the
Alternate Application tab, a record list of valid applications opens and the following
message appears in the status bar: The Application Name is invalid. Select one from
the list. Double-click on the correct application to replace the invalid entry.

Related topics

Data validation
Accessing the validity file
Deleting validity record components
Invalid files and form names
Invalid field names
Printing validity definitions
Invoking validity table processing
Look-up processing


1.1.2.4.4. Invalid files and form names

If any element of the Files/Formats field is not a valid database dictionary name or a
valid form name, the following message appears in the status bar: The name
<name > is not a valid dbdict or format . Search for database dictionary records. A
record list of valid file names is displayed. Double-click on the correct file to replace
the invalid entry.

If you have entered an invalid form name in the Files/Formats field and want to view a
record list of valid forms, open the More Actions menu and select Display All
Formats. A record list of valid forms opens. Double-click on the correct form to
replace the invalid entry. If the form you select is not associated with a file, you must
respond by indicating the file with which the form will be associated at run time.

Note: The file associated with the form must contain the Field Name. If it doesn't and
the first element in the list is being validated, you are prompted to select a valid field
name. If the second or greater element is being validated, you are returned to the
original record with an error message.

To switch back to the list of files, select Display Table List from the More Actions
menu.

Related topics

Data validation
Accessing the validity file
Deleting validity record components
Invalid application names
Invalid field names
Printing validity definitions
Invoking validity table processing
Look-up processing


1.1.2.4.5. Invalid field names

If you enter an invalid field name, the following message appears in the status bar:
The field name <field name > is invalid. A list of valid field names for the file you have
entered opens. Select a valid field from the list. The invalid entry is replaced by the
field you have selected.

Related topics

Data validation
Accessing the validity file
Deleting validity record components
Invalid application names
Invalid files and form names
Printing validity definitions
Invoking validity table processing
Look-up processing


1.1.2.4.6. Printing validity definitions

A detailed report of a validity record has four main sections that display all the
information contained in the record and in the detailed summary forms:

     Field specifications
     Query specifications
     Values specifications
     Range specifications.

Note: Any scalar field or array element that's greater than 60 characters in length is
printed in its entirety with the use of continuation lines. All elements of all arrays are
also printed. All continuation lines start with: ***

Related topics

Data validation
Accessing the validity file
Deleting validity record components
Invalid application names
Invalid files and form names
Invalid field names
Invoking validity table processing
Look-up processing


1.1.2.4.7. Invoking validity table
processing

You can invoke validity table processing by calling the RAD application validate.fields
in the Subroutines process of Format Control. Invoke validity table processing to
achieve the following two goals.

     Validate the fields in a record during record processing.
     Allow look-up processing during record editing (similar to Service Manager Find
     and Fill capability).

Related topics

Data validation
Accessing the validity file
Deleting validity record components
Invalid application names
Invalid files and form names
Invalid field names
Printing validity definitions
Look-up processing
Validate fields during record processing
````
