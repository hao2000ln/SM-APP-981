---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.1.3.3 .. 1.1.3.3.5
printed_pages: 497-526
---

# 1.1.3.3 Format Control

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.3.3. Format Control

Format Control allows the System Administrator to apply the following special
processes to Service Manager files through individual forms:

     Validate fields.
     Establish user privileges.
     Display alternate record list forms.
     Do Calculations and Validations based on other fields in this file or other files.
     Call RAD routines.
     Define additional options and menu items.
     Automatically update or insert data in other parts of the database.

Format Control records can attach to any form or file within Service Manager and
don't require special programming skills to implement. You define routines in Format
Control that are user interactive or transparent and perform when a record opens or
when a user adds, updates, or deletes a record from the database. Format Control is
easy to apply and change.

While Format Control is a convenient utility, it should not be overused. Excessive
reliance on Format Control to modify your system results in reduced system
performance. If you intend to heavily customize your system, we recommend you find
other, more efficient ways to implement your changes such as Data Policy or Data
Validation.

Related topics

Tailoring
Format Control processes


1.1.3.3.1. Accessing Format Control

You can access the Format Control utility in Service Manager as follows:

Access Format Control from Forms Designer

Note: The best method for accessing Format Control is through Forms Designer.
Accessing the record from the form with the same name as the Format Control record
reduces your chances of accessing the wrong record.

   1. Click Tailoring > Forms Designer.
   2. Type the name of the form you want to view in the Form field of the Forms

     Designer dialog box.
   3. Click Search to find the form.
   4. Click Format Control from the More Actions menu. The Format Control record

     opens for the selected form.

Access Format Control from Database Manager

Note: To access the Format Control Additional Options for Change Management, you
must select Administration Mode or you will be using Change Management instead of
Database Manager.

Click Tailoring > Database Manager.

Access Format Control directly

Note: Accessing Format Control directly without going through Forms Designer
enables you to search for an existing record or create a new record.

Click Tailoring > Format Control.

Open a Format Control record

   1. Open Format Control using one of the following options:

     • Click Tailoring > Format Control.

     • Type fc in the Service Manager command line and click Execute command
     or press Enter. Service Manager opens a blank Format Control Maintenance
     form.

   2. Type the name of the form or leave all fields blank, and then click Search.


     Service Manager opens a list of active forms. If only one form matches the
     query, Service Manager will display that form.

   3. Click a form on the list to open it. Service Manager opens the selected form,
     showing the Main Information screen.

Add a Format Control record

   1. Access Format Control from Forms Designer.

     Service Manager creates a new Format Control record for the form. Service
     Manager automatically places the form’s name in the Name field. By default, the
     system automatically enters a value in the System field (a required field) and
     selects the Use Default Sort box.

     Note: When you access Format Control in this manner, the name of the new
     record defaults to the same name as the form used to access it. In the rare
     cases where you need a different name, override the default name.

   2. Add the desired data.
   3. Click New to add the record to the database.

Related topics

Format Control
Array maintenance
Array structure maintenance functions


1.1.3.3.2. Using expressions in Format
Control

To create Format Control expressions you will need to be familiar with system
functions, boolean (logical) fields and the file variable.

Use the following definitions when Creating Format Control expressions:

Primary File:
The file attached to a form. This is referred to as $file in a Format Control record.
Additional files are defined as $file1, $file2, etc. in the order of their entry in the
secondary files section of the Additional File Queries screen of the Format Control
record.

Semicolon:
Semicolons(;) separate statements to allow them to be entered on one line.

Variable:
A value that resides in memory only, rather than in a database record. Variable names
always start with $. To ensure that a variable contains the proper value, initialize it in
the Initializations Section of the Format Control record.

Statements:
Service Manager supports some C-like statements.

     if then else
     do while
     for do

Format Control system functions

Many of the Service Manager system functions are used to create expressions in
Format Control. The following is a list of the most commonly used functions:


Function                                Description

denull()                                Compresses an array by deleting all
                                        trailing NULL entries and returns the
                                        compressed array.

index()                                 Returns the index or position number
                                        for a specific element value in an array
                                        or character in a string. If the target
                                        value is not in the array or string, it
                                        returns 0 (zero).

lng()                                   Returns the number of elements in an

                                        array or structure and the number of

                                        characters in a string.

nullsub()                               Replaces a null value with a known
                                        value, eliminating the possibility that
                                        expressions will return null or unknown
                                        results.

operator()                              Returns the logon id of the current
                                        operator.

str()                                   Converts a non–string data type into a

                                        string.

substr()                                Extracts a substring from a string.

tod()                                   Returns the current date and time.

val()                                   Converts a field into a numeric, logical,

                                        or date/time value.

Format Control Boolean (logical) fields

In the forms for Additional File Queries, Calculations, Validations, and Subroutines,
you will find some or all of the following fields:


Conditional Field                       Format Control              Description
add                                     processing area
update
delete                                  Additional File Queries,    Conditional expressions
display                                 Calculations, Validations,  used in this field are
                                        JavaScript                  evaluated before a
initial                                                             record is added.

                                        Additional File Queries,    Conditional expressions
                                        Calculations, Validations,  used in this field are
                                        JavaScript                  evaluated before a
                                                                    record is updated.

                                        Additional File Queries,    Conditional expressions
                                        Calculations, Validations,  used in this field are
                                        JavaScript                  evaluated before a
                                                                    record is deleted.

                                        Additional File Queries,    Conditional expressions
                                        Calculations, Validations,  used in this field are
                                        JavaScript                  evaluated when a
                                                                    screen/format is
                                                                    displayed or when the
                                                                    Format Control record is
                                                                    used with reports.

                                        Additional File Queries,    Conditional expressions
                                        Calculations, Validations,  used in this field are
                                        JavaScript                  evaluated once, before a
                                                                    record is displayed the
                                                                    first time.


Conditional Field                       Format Control   Description
before                                  processing area
                                                         This field determines
                                        Subroutines      when the Conditional
                                                         expressions in the add,
                                                         update, and delete fields
                                                         are evaluated. If the
                                                         condition is true, the
                                                         expression will be
                                                         evaluated before the
                                                         record is added,
                                                         updated, or deleted. If
                                                         the condition is false, the
                                                         evaluated after the
                                                         record is added,
                                                         updated, or deleted. You
                                                         can't use a variable in
                                                         this field.

These fields must evaluate to true or false only. A value of true (or an expression that
evaluates to true) in any of these fields causes the Format Control functions to
execute. These functions execute before the edit is performed. If the fields are blank,
the calculation or validation aren't performed for this table. For example, a value of
true in the add field causes Format Control functions to be performed before a record
is added. If the other fields (update, delete, display) are blank, the functions aren't
performed when the record is updated, deleted, or displayed.

Normally, these fields contain true, false, blank, or they can contain a variable that's
calculated in the Calculations process before being used in another process. When
using either of these methods, use either the short or long version of Format Control
to enter an expression that's evaluated to true or false at execution time.

This is an example of an expression that's frequently used:

  index ("SysAdmin", $lo.ucapex)>0

This expression searches the user’s capability array in the Operator Record to see if it
has SysAdmin capabilities. The function executes if this evaluates to true, indicating


that the operator has SysAdmin listed as a capability and therefore is authorized for
the function.

Format Control file variable

The current database record (the record the user is opening for modifying) in Format
Control is always identified by the variable $file. Elements of the current record being
acted upon by Format Control associate with $file by expressions. For example,
<field.name > in $file might identify a particular field in the current record to which a
Format Control process is attached. The $file variable does NOT reference a file,
which may use several forms to input data.

Important: In order for a property to depend on a variable or record field, the variable
must be assigned as an input in Format Control.

Turn on menu forms by using Format Control

Applies to User roles: System Administrator

To turn on menu forms using Format Control:

   1. Open Format Control using one of the following options:
           Click Tailoring > Format Control.

           Type fc in the Service Manager command line and click Execute
           command or press Enter.

           Service Manager opens a blank Format Control Maintenance form.

   2. Type login.DEFAULT and then click Search.
   3. Service Manager opens the login default form showing the Main Information

     screen.
   4. Add $G.show.menu.forms="true" to the end of the Initialization Expressions.

Related topics

Format Control
Service Manager Programming


1.1.3.3.3. Sequential numbering for Format
Control

Sequential numbering is a Subroutine process of Format Control that automatically
adds identifying numbers to database records as they are created. Sequential
numbering is used for Configuration Management, incident records, or employee
records.

Sequential numbers are defined for appropriate fields in any data record. You create
alphanumeric strings (prefixes and suffixes) that identify records by task or item.

Sequential numbering enables you to:

     Increment/decrement numbers in sequence.
     Reset values at definable intervals.
     Define values for increment/decrement sequence.
     Define the length of the number.
     Append prefixes and suffixes (characters) to sequential numbers.

The getnumb.fc application is called from the Subroutines process of Format Control
to establish the sequential numbering sequence.

Related topics

Data types of sequential numbers
Create simple sequential numbers
Service Manager Programming


1.1.3.3.3.1. Data types of sequential
numbers

There are two data types of sequential numbers:

     Simple numbers. For example, 1, 2, 3.
     Complex character strings. For example, (DEV00001/WS).

Note: If you want to use the prefix and suffix capabilities of sequential numbering, the
field being incremented or decremented must be defined in the database dictionary
as type character. In all other cases, the field must be of type number.

Related topics

Sequential numbering for Format Control
Common routines called from Format Control


1.1.3.3.3.2. Create simple sequential
numbers

Applies to User roles: System Administrator

This example illustrates the process of setting up sequential numbering using Format
Control.

To create simple sequential numbers:

   1. Create the form for simple sequential numbers.
   2. Create a database file for simple sequential numbers.
   3. Create a Format Control record for simple sequential numbers.
   4. Open the number file.
   5. Add a numbered record to the database file for simple sequential numbers.

Create the form for simple sequential numbers

Applies to User roles: System Administrator

Create a form using the Form Wizard in Forms Designer called employees. The form
will record simple employee data, such as name, address, and telephone number. Be
sure to include a field labeled Employee ID with an input value of employee.id.

Create a database file for simple sequential
numbers

Applies to User roles: System Administrator

To create a database file for simple sequential numbers:   Page 323 of 369
   1. Click Tailoring > Forms Designer.
   2. Type employees in the form field, and click Search.
     Service Manager opens the employees form.
   3. Click Create File in the More Actions menu.

This PDF was generated on May 23, 2026

   4. Type employees in the filename field.
   5. Click OK to create the new data file.

   6. Change the Employee ID field of the employee file to a number data type.

        1. Select the employee.id field with the cursor.
        2. Click Edit.
        3. Click number in the Type field menu.
     Important: A data type of number is required for all simple sequential
     numbering.

Create a Format Control record for simple
sequential numbers

Applies to User roles: System Administrator

To create a Format Control record for simple sequential numbers:

   1. Click Tailoring > Format Control
   2. Type employees in the Name field.
   3. Click New.
   4. Click Subroutines in the More Actions menu or click the Subroutines button.
   5. Click Show Expanded Form in the More Actions menu.

   6. Use the following values to complete the Subroutines process:

Application                             Add   Before  Error Message
                                              true
Name                                                  Sequential
                                                      number did not
getnumb.fc                              true          process
                                                      correctly!


Names                                   Definition                Values
record
                                        The record in which       $file
name
                                        the number will be
prompt
                                        placed. In this example,

                                        the employees data

                                        file.

                                        The name to appear in     employees
                                        the Class field of the
                                        Number file generated
                                        by the Format Control
                                        record.

                                        The field within the      employee.id
                                        record receiving the
                                        sequential number.

   7. Click OK to save the record.

Open the number file

Applies to User roles: System Administrator

To open the number file:

   1. Click Tailoring > Database Manager.
   2. Type number in the Form field of the Database Manager dialogue box.
   3. Click Search.
   4. When the blank Sequential Number File form opens, click Search to open a

     record list.
   5. Select employees from the list of records. Service Manager opens the

     Sequential Number File for the employees file.

Add a numbered record to the database file for
simple sequential numbers

Applies to User roles: System Administrator


To add a numbered record to the database file for simple sequential numbers:

   1. Click Tailoring > Database Manager.
   2. Type employees in the Form field.
   3. Click Search.
   4. Add data to the blank Employee Database record, but leave the Employee ID

     field blank.

   5. Click Add.

     Service Manager adds the sequential number to the Employee ID field before the
     record is added to the database.

Contents

     1 Create the form for simple sequential numbers
     2 Create a database file for simple sequential numbers
     3 Create a Format Control record for simple sequential numbers
     4 Open the number file
     5 Add a numbered record to the database file for simple sequential numbers


1.1.3.3.3.3. Create sequential number
prefixes and suffixes

Applies to User roles: System Administrator

Sequential numbering is a subroutine process of Format Control that automatically
adds identifying numbers to database records as they are created for Configuration
Management, incident records, or employee records. Prefixes and suffixes are used
to embed information in the sequential number and provide additional levels of
identification. For example, each device in the database might be described by a
logical name in the form of DEV(number)/(device type). For workstations, the device
type might be WS. In this case, DEV is the prefix for the sequential number and /WS is
the suffix.

For this example, see the task topics linked to below that will allow you to add a
subroutine call to the device.workstation form to assign a unique device number to all
records added to the file from this form.

To create sequential number prefixes and suffixes:

   1. Create a Format Control record with prefixes and suffixes.
   2. Add a record with prefixes and suffixes.

Create a Format Control record with prefixes and
suffixes

Applies to User roles: System Administrator

Sequential numbering is a subroutine process of Format Control that automatically
adds identifying numbers to database records as they are created for Configuration
Management, incident records, or employee records. Prefixes and suffixes are used
to embed information in the sequential number and provide additional levels of
identification. For example, each device in the database might be described by a
logical name in the form of DEV(number)/(device type). For workstations, the device
type might be WS. In this case, DEV is the prefix for the sequential number and /WS is
the suffix.

To create a format control record with prefixes and suffixes:

   1. Click Tailoring > Format Control.
   2. Type device.workstation in the Name field of the Format Control Initializations

     form.


3. Click Search.
4. Click Subroutines in the More Actions menu or click the Subroutines button.

5. Use the following values to complete the Subroutines process:

Application                             Add   Before  Error Message
                                              true
Name                                                  Sequential
                                                      number did not
getnumb.fc                              true          process
                                                      correctly!


Names                                   Definition               Values

record                                  The record in which      $file

                                        the number is placed.

                                        In this example, the

                                        device.workstation

                                        record.

name                                    The sequential number devices

                                        class to be used.

prompt                                  The field within the     logical.name
                                        record receiving the
                                        sequential number.

string1                                 The string (prefix) to DEV
                                        be added to the front
                                        of the sequential
                                        number when creating
                                        a new number.

query                                   The string (suffix) to be /WS
                                        added to the end of the
                                        sequential number
                                        when creating a new
                                        record.

text                                    Defines the sequential string

                                        number type (number

                                        or string). Since

                                        characters occur in the

                                        number, this must be

                                        string.

number1                                 Determines the length    val(“4”, 1)
                                        of the sequential
                                        number.

Add a record with prefixes and suffixes

Applies to User roles: System Administrator


Sequential numbering is a subroutine process of Format Control that automatically
adds identifying numbers to database records as they are created for Configuration
Management, incident records, or employee records. Prefixes and suffixes are used
to embed information in the sequential number and provide additional levels of
identification. For example, each device in the database might be described by a
logical name in the form of DEV(number)/(device type). For workstations, the device
type might be WS. In this case, DEV is the prefix for the sequential number and /WS is
the suffix..

To add a record with prefixes and suffixes:

   1. Click Tailoring > Database Manager.
   2. Type device.workstation in the Form field.
   3. Click Search.
   4. Add data to the blank Workstation record.

   5. Click Add.

     Service Manager adds a complex sequential number to the Asset field before
     the record is added to the database.

Notice that the complex sequential number DEV0002/WS appears in the Asset field
(logical.name). Add another record, and the sequential number advances to
DEV0003/WS.

Related topics

Sequential numbering for Format Control
Create simple sequential numbers


1.1.3.3.4. Array maintenance

Two types of arrays exist within Service Manager: simple arrays, consisting of fields
of similar data types; and arrays of structures composed of related fields of similar or
dissimilar data types. A series of applications exist in Service Manager that can be
called from the Additional Options process of Format Control to perform various
maintenance functions on array structures. A single application called from the
Subroutines process allows the user to sort simple arrays automatically when adding
or updating records.

Related topics

Array structure maintenance functions
Add array structure maintenance options to a format control record
Test the array structure maintenance options I added
Service Manager Programming


1.1.3.3.4.1. Array structure maintenance
functions

When using functions, such as copy, move, delete, and insert in the More Actions
menu, these functions act against the entire array structure element, not against a
single field within the structure.

The array structure editor reopens the field in question in an expanded, dynamic array
field. The form that opens when starting the function is the same form that opens
during execution. The routines that perform these functions are available collectively
and individually to any RAD routine or Format Control Additional Options definition.

The following general rules apply to array structure maintenance:

     None of the routines perform update functions to the database. To save the
     changes, you must select the applicable update function within the application
     that called the maintenance functions.
     The applications are cursor dependent. For example, the insert function inserts a
     blank element at the cursor position within the array structure. If the cursor is
     placed in any field within an element of the array structure, the function is
     performed against that entire element.
     If the functions run against a non-array structure field, the procedure normally
     fails and either issues an invalid data-type message or produces unpredictable
     results.

The array structure maintenance RAD applications add buttons to the form that enable
users to perform tasks, such as moving, copying, deleting or sorting lines in array
structures.
They include:

     as.copy
     as.delete
     as.get.name
     as.insert
     as.move
     as.options
     as.sort

You can call the array structure maintenance RAD applications from the Additional
Options Format Control process. You will need a thorough knowledge of Forms
Designer and the use of subforms in the creation of array structures.


For more information on each application, a detailed explanation of how to define
Additional Options, and how to pass data to these subroutines, see the related topics.

Note: RAD users should follow normal subroutine call procedures to run these
applications.

Related topics

Format Control processes
Common routines called from Format Control
Array maintenance
Add array structure maintenance options to a format control record
Test the array structure maintenance options I added
Service Manager Programming


1.1.3.3.4.2. Add array structure
maintenance options to a format control
record

Applies to User roles: System Administrator

In this example we add the RAD application as.options to the format control record
for the servicecontract form. The same general instructions work for any form.

To add array structure maintenance options to a format control record:

   1. Click Tailoring > Format Control.
   2. Type servicecontract in the Name field and press Enter.
   3. If a Format Control record doesn't already exist for the form, click New to create

     one.
   4. Click the Addl Options tab.
   5. Type the following values into the appropriate fields. You can click Show

     Expanded Form from the More Actions menu if you prefer to work in it.


Field                                   Value
Option                                  2
Description                             Array Options
Condition for Option                    true
Reset on Return                         true
Application                             as.options
Error Message                           Could not reset
Names                                   file
                                        name
Values
                                        $file
                                        servicecontract

   6. Click Save. Service Manager updates the Format Control record.

Related topics

Array maintenance
Array structure maintenance functions
Test the array structure maintenance options I added
Service Manager Programming


1.1.3.3.4.3. Test the array structure
maintenance options that I added

Applies to User roles: System Administrator

In this example, we test the option added to Format Control record of the
servicecontract form. The same general instructions work for testing any Format
Control record.

To test the array structure maintenance options you added:

   1. Click Tailoring > Database Manager.
   2. Type servicecontract in the Form field and press Enter.
   3. Select servicecontract from the list. Service Manager displays a blank Service

     Contract form.
   4. Click Search.
   5. Select a record from the list.
   6. Click the Named User tab and insert your cursor in the array.
   7. Click Array Options in the More Actions menu. The System Tray in the Service

     Contract form displays the buttons associated with the as.options subroutine.
           Click Insert to insert a blank line in an array structure above the cursor
           position.
           Click Delete to delete the line in which the cursor is placed.

           Click Copy to copy the entry from the line selected by the cursor.

           The original element is left in place when the copy is inserted into the array
           structure.

           Click Move to copy the entry from the line selected by the cursor.

           The original element is deleted when the copy is inserted into the array
           structure.

           The System Tray display these buttons to complete the Copy and Move
           functions:

           Insert inserts the copied element into the array structure above the line
           selected by the cursor.
           Replace replaces the element selected by the cursor with the copied
           element.
   8. Test the functionality of the buttons by inserting, copying, moving, and deleting
     named users.


   9. Click End to restore the normal tray buttons.

 10. Click OK or Save to save any changes you have made to the Service Agreement
     record.

     You must use OK or Save to update your record. Pressing Enter will NOT save
     any changes you have made.

Related topics

Array maintenance
Array structure maintenance functions
Add array structure maintenance options to a format control record


1.1.3.3.4.4. Sorting simple arrays

The sort.array application is a utility called from Format Control to sort simple arrays
in either ascending or descending order. Supported array data types are:

     number
     character
     data/time

The sort.array utility is called from the Subroutines process of Format Control. Use
this utility to sort simple arrays in ascending or descending order

To sort simple arrays, follow the procedures in these task topics:

   1. Create the form for sorting simple arrays.
   2. Create the Format Control record for sorting simple arrays.
   3. Create a data record for sorting simple arrays.

Create the form for sorting simple arrays

Applies to User roles: System Administrator

To create a form for sorting simple arrays, use the Form Wizard in Forms Designer
called demo.sort. It has three simple arrays of different data types: numbers,
characters, and dates. Provide a Name field for the record and create a file in the
database dictionary called demosort.

Use the following values to construct your form:

Field Name                              Input Value
Name                                    name
Numbers                                 number
Characters                              character
Dates                                   date

Create the Format Control record for sorting simple
arrays

Applies to User roles: System Administrator


To create the Format Control record for sorting simple arrays, you will call the
sort.array application from the Subroutines process of Format Control as follows:

   1. Click Tailoring > Format Control
   2. Type demo.sort in the Name field.
   3. Click New.
   4. Click Subroutines in the More Actions menu or click the Subroutines button.
   5. Click Show Expanded Form in the More Actions menu.

   6. Use the following values to complete the Subroutines process:

Application Add                         Update      Before                Error
Name                                    true        true                  Message

sort.array true                                                           Could not
                                                                          sort the
                                                                          array.

Names                                   Definition                Values
file
                                        When calling sort.array $file
name                                    from Format Control,
boolean1                                always pass $file to
                                        this parameter.

                                        The name of the input number
                                        field (array) in $file you
                                        wish to sort.

                                        The parameter that        val (“false”, 4) *
                                        controls the sort order.
                                        A value of true sorts in
                                        ascending order. If you
                                        pass false, the sort
                                        order is descending.
                                        The default is true.

  For a detailed discussion of the val function, refer to System Language Help.
7. Click OK to save your record.


Create a data record for sorting simple arrays

Applies to User roles: System Administrator

Once you have created the form and Format Control for sorting simple arrays, you are
ready to create the data record for sorting simple arrays.

To create a data record for sorting simple arrays:

   1. Click Tailoring > Database Manager.
   2. Type demo.sort in the Form field of the Database Manager dialogue box.
   3. Click Search.
   4. Type sort1 in the Name field of your test form.
   5. Enter data in the arrays in random order. For example, numbers in the Numbers

     array and characters in the Characters array.

   6. Click Add to add the record to the database and sort the array.

     Note: Since Update evaluates to true in the Format Control record for this form,
     you may also sort an array by clicking Save.

     The Numbers array is sorted in descending order.

   7. Repeat the process for the other arrays by changing the name parameter in the
     Format Control record to reflect the array being sorted.

   8. Remove the boolean1 parameter, and the sort order defaults to true. The array is
     sorted in ascending order.

Related topics

Format Control
Format Control processes


1.1.3.3.5. Determine parameters without
using the RAD editor

Applies to User roles: System Administrator

You can determine the parameters for any application in Service Manager without
using the RAD Editor. Use Database Manager to display the input value of each field in
a particular application parameter panel. This value is the parameter name used in the
Subroutines process of Format Control.

To determine parameters without using the RAD Editor:

   1. Click Tailoring > Database Manager.
   2. Type format in the Form field, and click Search.
   3. Click Format in the record list.
   4. Type the name of the application whose parameter values you want to view (for

     example, getnumb.fc) in the Format Name field of the blank Format form.

   5. Click Search.

     The parameter Name opens in the Input field of the form and the function
     appears in the Label field.

   6. Scroll down to view all the parameters listed.
   7. Click OK and exit this record without saving it.

Related topic

Service Manager Programming Guide
````
