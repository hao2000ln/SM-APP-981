---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.1.2.4.8 .. 1.1.2.4.9
printed_pages: 88-124
---

# 1.1.2.4.8 Look-up processing

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.2.4.8. Look-up processing

Calling the validity routine while a record is being edited simulates the Find and Fill
functions. This gives the user the ability to determine the valid values or ranges of a
field before attempting to process a record.

You can execute the validity look-up routine from these three places.

     Format Control Additional Options
     Format Control subroutines
     Displayoptions

Related topics

Data validation
Format Control processes
Displayoptions
Display value summary details
Display range summary details
Create validity table definitions
Add field-level definitions
Add value definitions
Add range definitions
Validate the validity definitions
Delete an entire validity record
Delete a single value or range definition
Delete value or range definitions from a table
Print a detailed report of an entire validity record
Validate fields during record processing
Create a validity lookup option in Format Control
Call validate.fields from Format Control
Validity validation rules


1.1.2.4.8.1. Format Control processes

There are eight major functional processes in Format Control that define the actions
to be taken on a record. Each of these processes has a separate form within the
Format Control Utility.

Main information — This form is the entry point in Format Control and has several
functions.

     Initializes fields or variables that are later used in the Format Control record.
     Initialization expressions are the first operation performed for each evaluation of
     a Format Control record.
     Initially displays a value in a field when the record itself opens.
     Names special record list and initial query forms to use, sets up default sort
     sequences, and runs scripts.

Forms — This section in Format Control has two main functions:

     Specify alternate forms to display a list of records.
     Note: This option can't be used when the Record List (split screen) functionality
     is enabled.

     Specify alternate forms to display a single record.

The formatcontrol option allows you to display the information using different Service
Manager forms based on conditions evaluated at run time. You can specify either QBE
Forms to display a list of records or Alternate Forms to display a record. You may want
to specify different lists according to the user role or capabilities.

By specifying alternate forms, whenever the condition is met, the user will have an
option available called "Alternate Forms" where the user can select the form to use to
display the information. Additional forms are useful to display different views such as
financial or security information when the condition specified is met.

Queries — This process enables you to extract information from a file other than the
primary file in order to perform calculations and validations and to report on
information from more than one file.

Calculations — This process enables you to perform calculations on currently
available fields or variables. The fields needed for calculations may be variables,
fields in the primary file, or fields in any other secondary files that may have been
queried.


JavaScript — This process enables you to call JavaScripts from Format Control.

Validations — This process enables you to set up a logical expression for checking
data in fields or variables on the form. The validation expression you set up must
evaluate to true upon the desired edit function for it to be successful. If the
expression doesn't evaluate to true, a validation message opens, and the specified
operation fails.

Subroutines — This process enables you to call RAD routines from Format Control.

Additional options — This process enables you to define menu options you want
available to users on any form associated with the particular Format Control record.
You can use Format Control to set up a menu option called Validity Lookup. This
option performs a validity check on the field of focus in the form for which validity
specifications have been defined. Invalid fields are highlighted and a message is
displayed in the status bar giving details on the type of error incurred.
Note: This feature calls RAD subroutines and is available in Database Manager only.

Privileges — This process enables you to use security to control database options
available to the user. If the contents of a field evaluate to true at processing time, the
corresponding button is available to the user.

Related topics

Format Control


1.1.2.4.8.2. Displayoptions

You can create a Validity lookup option in the More Actions menu by creating a
displayoption record. For detailed information on creating displayoptions, refer to the
Display application help.

Use the following values in the displayoption record:

Field                                   Value
Default Label                           Validity Lookup
Condition                               true
RAD Application                         validate.fields
Separate Thread?                        true

Use the following values in the displayoption record:

Name                                    Value
name                                    cursor.field.name()
second.file                             $L.filed
cond.input                              val("true", 4)

Related topics

Data validation
Look-up processing
Format Control processes
Display application
Selecting display options
More Actions menu


1.1.2.4.8.3. Display value summary details

Applies to User Roles: System Administrator

You can display the details of a single entry in the values summary array, or view the
details for all the entries displayed in a scrollable form.

To display the details of a single entry in the value summary array:

   1. Place your cursor on a line in the value summary array.
   2. Select Options > Edit Line. The details for the entry are displayed.

To display the details of all entries in the value summary array:

   1. Place your cursor on a line in the value summary array.
   2. Select Options > Display All Values in a validity record. Details of all the entries

     in the value summary array are displayed in a scrollable list.

Note: You may edit or sort the contents of this record as you would any table in
Service Manager.

To display the typical table editing controls in the tool tray:

Select Options > Edit Table.

Related topics

Data validation
Format Control processes
Displayoptions
Display range summary details
Create validity table definitions
Add field-level definitions
Create validity table definitions
Add value definitions
Add range definitions
Validate the validity definitions
Delete an entire validity record
Delete a single value or range definition
Delete value or range definitions from a table
Print a detailed report of an entire validity record
Validate fields during record processing
Create a validity lookup option in Format Control


Call validate.fields from Format Control
Validity validation rules


1.1.2.4.8.4. Display range summary details

Applies to User Roles: System Administrator

You can display the details of a single entry in the range summary array, or view the
details for all the entries displayed in a scrollable form.

To display a single entry in the range summary array:

   1. Place your cursor on a line in the range summary array.
   2. Select Options > Edit Line. The details for the entry are displayed.

To display the details of all entries in the range summary array:

   1. Place your cursor on a line in the range summary array.
   2. Select Options > Display All Values in a validity record. Details of all the entries

     in the Range Summary array are displayed in a scrollable list.

Note: You may edit or sort the contents of this record as you would any table in
Service Manager.

To display the typical table editing controls in the tool tray:

Select Options > Edit Table.

Related topics

Data validation
Format Control processes
Displayoptions
Create validity table definitions
Add field-level definitions
Add value definitions
Add range definitions
Validate the validity definitions
Delete an entire validity record
Delete a single value or range definition
Delete value or range definitions from a table
Print a detailed report of an entire validity record
Validate fields during record processing
Create a validity lookup option in Format Control
Call validate.fields from Format Control
Validity validation rules



1.1.2.4.8.5. Create validity table
definitions

To create a new validity table definition, complete the appropriate records in the
following order:

   1. Add field-level definitions.
   2. Add value definitions.
   3. Add range definitions.
   4. Validate the validity definitions.

Related topics

Data validation
Format Control processes
Displayoptions
Display value summary details
Display range summary details
Add field-level definitions
Add value definitions
Add range definitions
Validate the validity definitions
Delete an entire validity record
Delete a single value or range definition
Delete value or range definitions from a table
Print a detailed report of an entire validity record
Validate fields during record processing
Create a validity lookup option in Format Control
Call validate.fields from Format Control
Validity validation rules


1.1.2.4.8.6. Add field level definitions

   1. Click Tailoring > Database Manager.

   2. Type validity in the Form field, and then click Search.

     A list of the validity form records in your database opens.

   3. Double-click validity.summary, and then click Search.

     The Validity Table Specifications summary form opens.

   4. In the Field Name field, type the name of the field in which you want to create a
     validation record.

   5. In the Files/Formats field, type the name of the file or files in which this field is
     found.

   6. Click Search to search for records that may already exist with this field.

   7. If no record exists, click New to add your new record.

     The following message appears in the status bar: Data Validation record added.

   8. Complete the remaining fields in the form (including the other tabs) with the
     exception of the Values Summary and Range Summary arrays.

   9. Click More or the More Actions icon, and select Validate to validate the
     information you have entered in the form.

     If you have entered an invalid value in the form, a message appears in the status
     bar specifying the error.

 10. Click Save when you have successfully validated your record.

     A message appears in the status bar, stating that the Data Validation record has
     been updated.

Related topics

Accessing the validity file
Data validation
Format Control processes
Displayoptions
Display value summary details
Display range summary details
Create validity table definitions


Add value definitions
Add range definitions
Validate the validity definitions
Delete an entire validity record
Delete a single value or range definition
Delete value or range definitions from a table
Print a detailed report of an entire validity record
Validate fields during record processing
Create a validity lookup option in Format Control
Call validate.fields from Format Control
Validity validation rules


1.1.2.4.8.7. Add value definitions

Follow these steps:

   1. Click Tailoring > Database Manager.

   2. Type validity in the Form field, and then click Search. A list of the validity form
     records in your database opens.

   3. Double-click validity.summary, and then click Search. The Validity Table
     Specifications summary form opens.

   4. Put the cursor in the first line of the Values Summary array.

   5. Click the Options menu, and choose Edit Line. The Validity Value Detail
     Specification form opens.

   6. Complete the record as necessary, and then click Add.

     Note: It is possible that the same range could be allowed under multiple
     conditions within the same validity record; therefore, the system doesn't check
     for duplicate field values.

     Important: If the character field starts with a < or > symbol, you must insert a
     blank space before it. These symbols are dropped by the Service Manager
     parser, unless preceded by a blank space.

     The record is added and the buttons in the tool tray change. The following
     message appears in the status bar: Range/Value successfully added.

   7. Click Back to return to the validity record.

     The system combines the values you entered in the Min Desc and Max Desc
     fields with the relational operator you specified to produce the string that
     appears in the Values Summary array.

   8. Put the cursor in the next blank line of the Values Summary array and repeat the
     above steps until you have established all the ranges for your field.

   9. Click Save to add the record to the validity file.

Related topics

Accessing the validity file
Data validation
Format Control processes


Displayoptions
Display value summary details
Display range summary details
Create validity table definitions
Add field level definitions
Create validity table definitions
Add range definitions
Validate the validity definitions
Delete an entire validity record
Delete value or range definitions from a table
Print a detailed report of an entire validity record
Validate fields during record processing
Create a validity lookup option in Format Control
Call validate.fields from Format Control
Validity validation rules


1.1.2.4.8.8. Add range definitions

Follow these steps:

   1. Click Tailoring > Database Manager.

   2. Type validity in the Form field, and then click Search. A list of the validity form
     records in your database opens.

   3. Double-click validity.summary, and then click Search.

     The Validity Table Specifications summary form opens.

   4. Put the cursor in the first line of the Range Summary array.

   5. Click More or the More Actions icon, and then choose Edit Line. The Validity
     Range Detail Specification form opens.

   6. Complete the record as necessary, and then click Add.

     For additional information on writing conditions and expressions, see information
     on system language in the related topics.

     Note: It is possible that the same range could be allowed under multiple
     conditions within the same validity record; therefore, the system doesn't check
     for duplicate field values.

     Important: If the character field starts with a < or > symbol, you must insert a
     blank space before it. These symbols are dropped by the Service Manager
     parser, unless preceded by a blank space.

     The record is added and the buttons in the tool tray change.

   7. Click Back to return to the validity record.

     The system combines the values you entered in the Min Desc and Max Desc
     fields with the relational operator you specified to produce the string that
     appears in the Range Summary array.

   8. Put the cursor in the next blank line of the Range Summary array and repeat the
     above steps until you have established all the ranges for your field.

   9. Click Save to add the record to the validity file.

Related topics


Data validation
Format Control processes
Displayoptions
Display value summary details
Display range summary details
Create validity table definitions
Add field-level definitions
Add value definitions
Validate the validity definitions
Delete an entire validity record
Delete a single value or range definition
Delete value or range definitions from a table
Print a detailed report of an entire validity record
Validate fields during record processing
Create a validity lookup option in Format Control
Call validate.fields from Format Control
Validity validation rules


1.1.2.4.8.9. Validate the validity definitions

The validation routine ensures that field, file, form, and application names referenced
in the definition are valid. It also prompts for a data type if you have left the Field Type
field blank.

To validate the validity definitions:

   1. Open a validity record.
        1. Click Tailoring > Database Manager.

        2. Type validity in the Form field, and then click Search.

           A list of the validity form records in your database opens.

        3. Double-click a validity Format Name record, and then click Search.

           The Validity Table Specifications form opens.

        4. Click Search.

           A list of data validation records opens.

        5. Select a record.
   2. Click More or the More Actions icon, and choose Validate.

If the validation routine detects an invalid entry, a message appears in the status bar
and a form opens with a list of field names to select the correct entry.

If all the record entries are valid, a message appears in the status bar stating that the
validity record entries are valid.

Related topics

Data validation
Format Control processes
Displayoptions
Display value summary details
Display range summary details
Create validity table definitions
Add field-level definitions
Add value definitions
Add range definitions
Delete an entire validity record
Delete a single value or range definition


Delete value or range definitions from a table
Print a detailed report of an entire validity record
Validate fields during record processing
Create a validity lookup option in Format Control
Call validate.fields from Format Control
Validity validation rules


1.1.2.4.8.10. Delete an entire validity
record

Follow these steps:

   1. Open a validity record.
        1. Click Tailoring > Database Manager.

        2. Type validity in the Form field, and then click Search.

           A list of the validity form records in your database opens.

        3. Double-click a validity Format Name record, and then click Search.

           The Validity Table Specifications form opens.

        4. Click Search.

           A list of data validation records opens.

        5. Select a record.

   2. Click Delete.

     The following prompt is displayed: Are you sure you want to delete this record?

   3. Click Yes.

Related topics

Accessing the validity file
Data validation
Format Control processes
Displayoptions
Display value summary details
Display range summary details
Create validity table definitions
Add field-level definitions
Add value definitions
Add range definitions
Validate the validity definitions
Delete a single value or range definition
Delete value or range definitions from a table
Print a detailed report of an entire validity record


Validate fields during record processing
Create a validity lookup option in Format Control
Call validate.fields from Format Control
Validity validation rules


1.1.2.4.8.11. Delete a single value or range
definition

Follow these steps:

   1. Open a validity record.
        1. Click Tailoring > Database Manager.

        2. Type validity in the Form field, and then click Search.

           A list of the validity form records in your database opens.

        3. Double-click a validity Format Name record, and then click Search.

           The Validity Table Specifications form opens.

        4. Click Search.

           A list of data validation records opens.

        5. Select a record.
   2. Place the cursor in the line containing the value or range definition you want to

     delete.
   3. Click More or the More Actions icon, and choose Edit Line.

   4. Click Delete in the detail form.

     The following prompt is displayed: Are you sure you want to delete this validity
     detail?

   5. Click Yes. You are returned to the validity record.
   6. Click Save.

Related topics

Accessing the validity file
Data validation
Format Control processes
Displayoptions
Display value summary details
Display range summary details
Create validity table definitions
Add field level definitions
Create validity table definitions


Add value definitions
Add range definitions
Validate the validity definitions
Delete an entire validity record
Delete value or range definitions from a table
Print a detailed report of an entire validity record
Validate fields during record processing
Create a validity lookup option in Format Control
Call validate.fields from Format Control
Validity validation rules


1.1.2.4.8.12. Delete value or range
definitions from a table

Follow these steps:

   1. Open a validity record.
        1. Click Tailoring > Database Manager.
        2. Type validity in the Form field, and then click Search.

           A list of the validity form records in your database opens.

        3. Double-click a validity Format Name record, and then click Search.

           The Validity Table Specifications form opens.

        4. Click Search.
           A list of data validation records opens.

        5. Select a record.

   2. Click More or the More Actions icon and choose Display All Values or Display
     All Ranges.

     A Validity Value Specifications form or Validity Range Specifications form opens.

   3. Access the table editing controls. Click More or the More Actions icon, and
     choose Edit Table.

   4. Put the cursor anywhere in the record you want to delete, and then click Delete.

     Warning: Make sure this is the record you want to delete. When you click Delete,
     you're not prompted to confirm the command. Instead, the record is immediately
     removed from the table.

   5. Repeat the process with any other value or range definitions you want to delete.
   6. Click End to exit the table edit mode.
   7. Click Back to return to the validity record.
   8. Click Save.

Related topics

Accessing the validity file
Data validation
Format Control processes


Displayoptions
Display value summary details
Display range summary details
Create validity table definitions
Add field level definitions
Create validity table definitions
Add value definitions
Add range definitions
Validate the validity definitions
Delete an entire validity record
Print a detailed report of an entire validity record
Validate fields during record processing
Create a validity lookup option in Format Control
Call validate.fields from Format Control
Validity validation rules


1.1.2.4.8.13. Print a detailed report of an
entire validity record

Follow these steps:

   1. Click Tailoring > Database Manager.

   2. Type validity in the Form field, and then click Search.

     A list of the validity form records in your database opens.

   3. Double-click a validity Format Name record, and then click Search.

     The Validity Table Specifications form opens.

   4. Click Search.

     A list of data validation records opens.

   5. Select a record to open it.

     Note: To generate a detailed report, the validity record must contain values or
     range definitions.

  6. Place the cursor in a summary field containing a value.

   7. Click More or the More Actions icon, and then choose Edit Line.

     A detail specification record opens.

   8. Click File >Print or the Print icon.

Related topics

Accessing the validity file
Data validation
Format Control processes
Displayoptions
Display value summary details
Display range summary details
Create validity table definitions
Add field-level definitions
Add value definitions
Add range definitions
Validate the validity definitions


Delete an entire validity record
Delete a single value or range definition
Delete value or range definitions from a table
Validate fields during record processing
Create a validity lookup option in Format Control
Call validate.fields from Format Control
Validity validation rules


1.1.2.4.8.14. Validate fields during record
processing

During record processing, the fields in a record can be validated one at a time or in a
particular order.

Note: To invoke validity table processing, see the related topics. You must validate
each validity table definition before using it to validate data records.

   1. Access the Format Control record for the form which you want to invoke validity
     table processing. If a record doesn't already exist, you must create one. For
     details on accessing and using Format Control, see the related topics.

   2. Display the Subroutines process.

   3. Enter validate.fields in the Application Name field.

     Note: The logical values in the Add, Update, and Before fields are examples
     only. For information on how to decide when Format Control is processed, see
     the related topics.

   4. Enter the applicable parameters for validate.fields in the Name and Value fields
     using the information from the following table:

Name                                    Value                             Service Manager 9.81
second.file                             $file
                                                      Description
name                                    <field name>
                                                      Executes all validity
                                                      table records (all fields)
                                                      defined for the file
                                                      being processed.

                                                      Executes only one
                                                      validity table definition
                                                      (one field) defined for
                                                      the file being
                                                      processed.

                                                      Note: You can repeat
                                                      this type of definition in
                                                      the Format Control
                                                      subroutines section as
                                                      many times as
                                                      necessary. However, it
                                                      is more efficient to call
                                                      the subroutine once
                                                      and pass a list of the
                                                      fields to be validated.

Name                                    Value                                    Service Manager 9.81
names                                   <list of fields> or
                                        $<variable>          Description
text
                                        current.format() or  Executes a specific list
                                        <form name>          of validity table
                                                             definitions defined for
                                                             the file associated with
                                                             the form.

                                                             For example, define a $
                                                             variable in either the
                                                             Initializations or
                                                             Calculations process of
                                                             the Format Control
                                                             record as:
                                                             $fieldlist={"reason",
                                                             "risk", "planned.start"}

                                                             In the Subroutine call,
                                                             specify the Value input
                                                             as:

                                                             Name: names Value:
                                                             $fieldlist

                                                             Note: You can use any
                                                             variable name you
                                                             choose, however, you
                                                             are responsible for
                                                             ensuring that your
                                                             variable name doesn't
                                                             corrupt a variable used
                                                             by the application
                                                             validate.fields.

                                                             Executes a specific list
                                                             of validity table
                                                             definitions defined for
                                                             the form just displayed
                                                             to the user.


   5. Enter a message in the Error Message field.

     The recommended error message is: The original record is displayed.

     If a message is undefined, an unfriendly error message is issued when returning
     to the data record.

   6. Click Save.

Related topics

Invoking validity table processing
Data validation
Format Control
Format Control processes
Displayoptions
Display value summary details
Display range summary details
Create validity table definitions
Add field-level definitions
Add value definitions
Add range definitions
Validate the validity definitions
Delete an entire validity record
Delete a single value or range definition
Delete value or range definitions from a table
Print a detailed report of an entire validity record
Create a validity lookup option in Format Control
Call validate.fields from Format Control
Validity validation rules


1.1.2.4.8.15. Create a validity lookup
option in Format Control

Access the Format Control record for the form in which you want to invoke validity
table processing. If a record doesn't already exist, you must create one. For
information on how to access and use Format Control, see the related topics.

   1. Click Tailoring > Format Control.
   2. Type a Name and then click Search.

     Service Manager opens a list of Format Control records.
   3. Click the record you want to update to open it.
   4. Click More or the More Actions icon and choose Additional Options, or click

     Addl Options in the form.
   5. Enter the following field values:

Field                                   Value
Condition for Option                    true
Option                                  Validity Lookup
Application                             Application validate.fields
Error Message                           The original record is displayed.

                                        Note: This is the recommended
                                        message. If this field is left blank,
                                        you will receive an unfriendly error
                                        message when you return to the
                                        data record.

Reset on Return                         true

6. Enter the applicable parameters for validate.fields in the Name and Value fields
  using the information from the following table:


Field                                   Value
name                                    cursor.field.name()
second.file                             $file
cond.input                              val("true", 4)

                                        Note: The data passed to the
                                        Boolean parameter must be a type 4
                                        (hence the VAL() statement for the
                                        Value). As an alternative, a $variable
                                        could be defined in the initialization
                                        expressions (for example
                                        $flag=true) and then passed to the
                                        subroutine.

   7. Click Add to add a new Format Control record.
   8. Click Save to save your updates.

Related topics

Data validation
Format Control processes
Format Control
Accessing Format Control
Using expressions in Format Control
Displayoptions
Display value summary details
Display range summary details
Create validity table definitions
Add field-level definitions
Add value definitions
Add range definitions
Validate the validity definitions
Delete an entire validity record
Delete a single value or range definition
Delete value or range definitions from a table
Print a detailed report of an entire validity record
Validate fields during record processing


Call validate.fields from Format Control
Validity validation rules


1.1.2.4.8.16. Call validate.fields from
Format Control

   1. Click Tailoring > Format Control.
   2. In the Name field, type the name of the form for which you want to invoke

     validity table processing.
   3. Click Search.
   4. If a Format Control record doesn't exist for your form, create one. Click New.
   5. Click Subroutines in the form, or select it from the More Actions menu.
   6. Enter the appropriate parameters for validate.fields in the Name and Value

     fields using the information from the following table:

Field                                   Value
name                                    cursor.field.name()
boolean1                                false
second.file                             $current.file.variable
cond.input                              true

   7. Click Save to save changes to an existing record.

     Caution: If you are attempting to add a new record from an existing record,
     make sure that you don't click Save because doing so will replace the existing
     record with the new record. If you are adding a new record, click Add.

   8. Click Add to add a new record.

Related topics

Data validation
Format Control processes
Displayoptions
Display value summary details
Display range summary details
Create validity table definitions
Add field-level definitions


Add value definitions
Add range definitions
Validate the validity definitions
Delete an entire validity record
Delete a single value or range definition
Delete value or range definitions from a table
Print a detailed report of an entire validity record
Validate fields during record processing
Create a validity lookup option in Format Control
Validity validation rules


1.1.2.4.9. Validity validation rules

     Each entry must have at least one entry in the Files/Formats field.
     Each entry in the Files/Formats field must be a valid database dictionary name
     or form name.
     The Field Name must be defined in each database dictionary listed in the
     Files/Formats array or to the database dictionary associated with the form.
     The data type of the Field Name must be the same for each file listed in the
     Files/Formats array or for the file associated with the form.
     The Unique ID is a user-provided value that uniquely identifies the record.
     The unique key of the validity table contains the following fields: field.name,
     sequence, and filename. Each combination of the Field Name, Sequence, and
     each element of the Files/Formats array in the validity record must also be
     unique within the validity table. This check is performed before the record is
     added or updated. If duplicates are found, the add/update action is not
     performed, and the following message is displayed: This record contains an
     invalid duplicate key.
     The value in the Alt Application field must be a valid RAD application.
     The Secondary File Query Filename value must be a valid database dictionary
     name.
     The Lookup Fields must be defined to the Secondary Query Filename and their
     data types must be the same as the Field Name.
     The Val Fields must be defined to the Files/Format file and their data types must
     be the same as the Field Name.
     The Record list format must be a valid form name.
     The value in the No Recs Option field must be the word Proceed, or Return. If
     neither is selected the system defaults to Proceed when the record is validated.

Related topics

Data validation
Look-up processing
Display value summary details
Display range summary details
Create validity table definitions
Add field-level definitions
Add value definitions
Add range definitions
Validate the validity definitions
Delete an entire validity record


Delete a single value or range definition
Delete value or range definitions from a table
Print a detailed report of an entire validity record
Validate fields during record processing
Create a validity lookup option in Format Control
Call validate.fields from Format Control
````
