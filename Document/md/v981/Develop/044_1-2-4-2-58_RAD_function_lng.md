---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.2.4.2.58 .. 1.2.4.2.74
printed_pages: 1190-1213
---

# 1.2.4.2.58 RAD function: lng

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.4.2.58. RAD function: lng

A RAD function that returns the number of elements in an array or structure and the
number of characters in a string. Remember to denull arrays to get the correct
number of elements, but be careful when denulling arrays of structures.
Function
lng
Format

  lng($variable)

Where $variable is the array, structure, or string.
Factors

     The $variable must be an array, structure or a character string.
     Arrays return the number of elements, NULL or otherwise.
     Strings return the number of characters.
     Structures return the number of fields.
Examples
lng("1234567890") returns 10 .
lng({1,2,3}) returns 3 .
lng({1,2,3,,,,}) returns 7 .
lng(denull({1,2,3,,,,})) returns 3 .


1.2.4.2.59. RAD function: locks

A RAD function that returns an array of structures containing information about the
locks used to lock a database for an update or the locks set by RAD applications
using a locked command panel.
Function
locks
Format

  locks()

Factors
Each element of the array contains:

     lock time
     process id
     terminal id
     operator name
     resource name (name of the lock)
     number
     exclusive
     locked
     breakable
Example

  locks()

Returns the following:

  {{[‘12/26/96 16:01:07’, 20212, “SYSTEM”, “marquee”,
  “agent:marquee”,
  0, false, true, false]}


{[“01/02/97 11:26:08”, 22699, “Windows 32”, “falcon”,
“AG/pm.main”, 0, true, true,
false]}}


1.2.4.2.60. RAD function: logoff

A RAD function that logs off the current user and terminates the session.
Function
logoff
Format

  logoff()

Factors
This function doesn't return a value. It executes a function.


1.2.4.2.61. RAD function: logon

A RAD function that logs a user on.
Function
logon
Format

  logon()

Factors
This function doesn't return a value. It executes a function.


1.2.4.2.62. RAD function: mandant

The Service Manager mandanten feature protects records of multiple clients by
logically separating a shared database. Clients see only the data they are allowed to
share. The mandant RAD function allows an application to create a subset of the
current mandanten values. For example, if a new record is being opened and the
client (customer) for the record is known, then a subset of the mandanten values can
be created to show only the assignments that are valid for that client.

Function

mandant

Format

  mandant(n,string)

Where n equals 0 , 1 , 2 , or 3 .

Parameters

      0 represents a request for a subset of the current mandanten values.
      1 represents a request to restore the original mandanten values.
      2 links the current user to the set of records in the scsecuritygroup file that
     matches the array of security IDs.
      3 sets the security roles for the tables defined in the scFolderAccess file.

The value of the string variable is the mandanten value.

Example usage

In Service Manager the out-of-box system has three scsecurity group records:
"Company A", "Company B" and "Company C". To establish the mandanten security
for the user, the RAD could call the following:
mandant(2, {"Company A"}) or mandant(2,{"Company A", "Company B"})

Security roles are implemented in the scFolderAccess table. The RAD calls the
mandant function with 3 to set the security roles for the given tables. The following
example sets the security role of ADMIN for two tables, as defined in the
scFolderAccess file.

mandant(3, "ADMIN",{"cm3", "device"})


Note

This fails if the string value doesn't match the values currently
established.


1.2.4.2.63. RAD function: max

A RAD function that returns the largest value in a list of values or arrays.
Function
max
Format

  max(element1, element2, element3, ...)

Or:

  max($variable)

Where the $variable variable is an array or a list of values.
Factors

     The max function returns the maximum value of either times or numbers.
     If you include an array in the list of elements, the system evaluates all of the
     elements in the array as if they were individual values.
     An attempt to use an array of strings as a parameter results in a segmentation
     fault, which causes the application to exit in error.
Example
max(17,24,35,73,10) returns 73 .
max(1,{2,3,4},3) returns 4 .


1.2.4.2.64. RAD function: messages

A RAD function that provides logging functions for use in the memory message log.
The log is implemented as a wraparound cache of the n most recent messages.
Function
messages
Format

  messages($function_number, $function_parameter)

Parameters
Parameters for this function are as follows:

Function                                Parameters                          Service Manager 9.81
0                                       0-500
1                                       None        Action
2                                       None
3                                       None        Open message log with
4                                       None        0 to 500 entries.
5                                       0
                                                    Start or resume logging.
5                                       1
                                                    Stop logging.
5                                       2
                                                    Stop logging and clear
5                                       3           the log.

This PDF was generated on May 23, 2026              Close the log and
                                                    recover memory.

                                                    Retrieve array of all log
                                                    entries in most recently
                                                    displayed order. The log
                                                    is not cleared.

                                                    Retrieve array of logged
                                                    informational messages
                                                    in last displayed order;
                                                    excludes error and
                                                    action messages. The
                                                    log is not cleared.

                                                    Retrieve array of logged
                                                    action messages in last
                                                    displayed order;
                                                    excludes error and
                                                    informational messages.
                                                    The log is not cleared.

                                                    Retrieves array of error
                                                    messages in last
                                                    displayed order;
                                                    excludes informational
                                                    and action messages.
                                                    The log is not cleared.

                                                                                                  Page 17 of 153

Factors

The following table outlines the proper order for each action related to this function
and the corresponding function number.

Action                                  Function
Open log.                               Function zero (0)
Start logging.                          Function one (1)
...run application                      N/A
Stop logging.                           Function two (2)
Retrieve log.                           Function five (5)
Clear log.                              Function three (3)
start logging                           Function one (1)
...run application                      N/A
...run application                      N/A
...run application                      N/A
...run application                      N/A
Stop logging.                           Function two (2)
Retrieve log.                           Function five (5)
Close log.                              Function four (4)

Note

     A user task (the sm process) can have only one private message log
     at a time.
     You can't directly access message logs that are using other tasks.
     A maximum of 500 logged messages is supported.


Examples

The following table describes a desired action and the syntax used to initiate the
action.

Action desired                          Syntax
Open a log for 200 messages.            $throwaway=messages(0,200)
Start logging                           $throwaway=messages(1)
Stop logging.                           $throwaway=messages(2)
Clear log.                              $throwaway=messages(3)
Close log.                              $throwaway=messages(4)
Retrieve all logged messages.           $array=messages(5,0)
Retrieve all logged informational       $array=messages(5,1)
messages.
Retrieve all logged action messages.    $array=messages(5,2)
Retrieve all logged error messages.     $array=messages(5,3)


1.2.4.2.65. RAD function: min

A RAD function that returns the smallest element in a list of values or arrays.
Function
min
Format

  min(element1, element2, element3, ...)

Or:

  min($variable)

Where the $variable variable is an array or a list of values.
Factors

     The min function returns the minimum value of either times or numbers.
     If you include an array in the list of elements, Service Manager evaluates all
     elements in the array as individual values.
     An attempt to use an array of strings as a parameter results in a segmentation
     fault, which will cause the application to exit in error.
Example
min(17,24,35,73,10) returns 10 .
min(4,{1,2,3,},2) returns 1 .


1.2.4.2.66. RAD function: modtime

A RAD function that returns the last modified date and time of a record.
Function
modtime
Format

  modtime($file)

Factors
     Use this function to determine if a record has been modified before or after a
     specified time.
     Use modtime(currec()) to return the last modified date and time for any record.
     You can also use this variation in queries to retrieve all records modified after a
     specified point in time.
     The modtime function is not updated on clients when the records are updated
     on the server until after the records are selected again.

Examples
modtime($file) returns 1/10/96 12:15:17 .
modtime(currec)>tod( )- '08:00:00' selects all records in a file that were added or
updated in the last eight hours.


1.2.4.2.67. RAD function: month

A RAD function that returns the month of year for a specified date, regardless of the
date format.
Function
month
Format

  $ymonth=month($date)

Parameters
Where the $date variable is the date and time value.
Example

  $ymonth=month(`2/15/96')

After execution, the value of $ymonth is 2 .


1.2.4.2.68. RAD function:
multiselect.selection("fieldcontents")

A RAD function that returns the contents of the field associated with the
multiselection. Field contents are only returned if the associated column name is set
using the Selection Field property in Forms Designer.
To set the associated column name using the Selection Field property in Forms
Designer, follow these steps:

   1. Sign in to Service Manager as a System Administrator.
   2. Click Tailoring > Forms Designer.
   3. In the Form field, type the form name. For example, type probsummary.qbe.g

     and click Search. The form opens.
   4. Click Design to open design mode.
   5. Click the table object.
   6. In the Selection Field property, type the name of the column on the table (for

     example, type number).
   7. Click OK to see what the form will look like in the Windows client.
   8. Click OK to save your changes.

Function
multiselect.selection("fieldcontents")
Format

  $info=multiselect.selection("fieldcontents")

Example

  $x=multiselect.selection("fieldcontents")

After execution, the value of $x is set to the selected field contents. For example,
{"IM10003", "IM10006", "IM10007", "IM10008", "IM10010", "IM10012"} .

            Note

           Field contents are only returned if the associated column name is set
           using the Selection Field property in Forms Designer.



1.2.4.2.69. RAD function:
multiselect.selection("fieldname")

A RAD function that returns the field name of the column associated with the
multiselection. The associated column name is set using the Selection Field property
in Forms Designer.
To set the associated column name using the Selection Field property in Forms
Designer, follow these steps:

   1. Sign in to Service Manager as a System Administrator.
   2. Click Tailoring > Forms Designer.
   3. In the Form field, type the form name. For example, type probsummary.qbe.g

     and click Search. The form opens.
   4. Click Design to open design mode.
   5. Click the table object.
   6. In the Selection Field property, type the name of the column on the table (for

     example, type number).
   7. Click OK to see what the form will look like in the Windows client.
   8. Click OK to save your changes.

Function
multiselect.selection("fieldname")
Format

  $info=multiselect.selection("fieldname")

Example

  $x=multiselect.selection("fieldname")

After execution, the value of $x is set to the column name (for example,"number").

            Note

           Field contents are only returned if the associated column name is set
           using the Selection Field property in Forms Designer.


1.2.4.2.70. RAD function:
multiselect.selection("rows")

A RAD function that returns an array of row numbers that were selected.
Function
multiselect.selection("rows")
Format

  $info=multiselect.selection("rows")

Example

  $x=multiselect.selection("rows")

After execution, the value of $x is set to the selected rows. For example {2, 3, 7, 22,
23, 30} .


1.2.4.2.71. RAD function:
multiselect.selection("selected")

A RAD function that returns true or false if the provided variable has multiple records
selected.
Function
multiselect.selection("selected",$file.variable)
Format

  $info=multiselect.selection("selected",file.variable)

Example

  $x=multiselect.selection("selected",$L.file)

After execution, the value of $x is set to true or false .


1.2.4.2.72. RAD function:
multiselect.selection("selections")

A RAD function that returns the number of rows selected.
Function
multiselect.selection("selections")
Format

  $info=multiselect.selection("selections")

Example

  $x=multiselect.selection("selections")

After execution, the value of $x is set to the number of selected rows. For example,
6.


1.2.4.2.73. RAD function:
multiselect.selection("tablename")

A RAD function that returns the Table ID associated with the multiselection.
Function
multiselect.selection("tablename")
Format

  $info=multiselect.selection("tablename")

Example

  $x=multiselect.selection("tablename")

After execution, the value of $x is set to the selected Table ID. For example,
Table0 .


1.2.4.2.74. RAD function: null

A RAD function that returns a value of true if the parameter is NULL or is comprised of
a compound data type consisting of all NULL values. Use the null function to
determine whether or not the value of a field or variable is null.

            Note

          The null function is different that the reserved word, NULL.

Function
null
Format

  null(value)

Factors
     The null function can handle compound data types.
     The reserved word NULL only handles primitive data types.
     An array or structure is null if it contains all null elements. This function applies
     itself recursively to nested elements.
     An empty string, such as (" ") is not null.
     A zero (0) is not null.
     The value 00:00 is not null.
     A value of unknown in a Boolean field is not null.

Examples
null(1) returns false .
null(NULL) returns true .
null({}) returns true .
null({1,}) returns false .
null({{},}) returns true .
````
