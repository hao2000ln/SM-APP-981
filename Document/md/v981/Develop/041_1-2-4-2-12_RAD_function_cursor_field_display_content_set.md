---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.2.4.2.12 .. 1.2.4.2.27
printed_pages: 1120-1142
---

# 1.2.4.2.12 RAD function: cursor.field.display.content.set

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.4.2.12. RAD function:
cursor.field.display.content.set

A Rapid Application Development (RAD) function that sets the display value of the
field where the cursor is currently positioned.
Function

cursor.field.display.content.set

Format

cursor.field.display.content.set($display.value)

Parameters
The following parameter is valid for this function.

Parameter                               Description
$display.value
                                        The display value that you want to
                                        specify for the current field

Factors
If the field is of the array type, the display value is the content of the element where
the cursor is currently positioned.
Return values
The display value that you specify.
Example
cursor.field.display.content.set("Adobe Reader")


1.2.4.2.13. RAD function:
cursor.field.name.set

A RAD function that sets the cursor to a specific field on a form.
Function
cursor.field.name.set
Format

  cursor.field.name.set($field.name, $row.number)

$field name is the field name
$row.number is for arrays (optional)
Factors

     This function returns no value. It is unnecessary to use it in an assignment
     statement.
     If the field is an array, you can position the cursor on a specific row by
     specifying $row.number.
Example

  cursor.field.name.set("address", 2)

After execution, the cursor appears in the second row of the Address field on the
next form displayed.


1.2.4.2.14. RAD function:
cursor.field.name

A RAD function that returns a string containing the name of the input field where the
cursor was located when the user pressed an interrupt key, such as the Enter or
option keys. To position the cursor in a specific field, use the cursor.field.name.set
function. The function returns the field name as it is defined in the current form.
Function
cursor.field.name
Format

  cursor.field.name(n)

Factors
Returns the fully-qualified field name if the function is called with an argument.
Example
cursor.field.name() returns number .
cursor.field.name(1) returns header,number .


1.2.4.2.15. RAD function:
cursor.field.readonly

A RAD function that returns true if the cursor is in a read-only field and false if the
cursor is in a field that's not read-only.
Function
cursor.field.readonly
Format

  cursor.field.readonly()


1.2.4.2.16. RAD function: cursor.line

A RAD function that returns the line number where the cursor was positioned when
the user performed an action such as clicking Fill or Find, or double-clicking an item
in a QBE list. If the action opens a new form, cursor.line returns the focus on the pop-
up form.

Function

cursor.line

Format

  cursor.line(n)

Factors

      $l=cursor.line() = the numeric value of the line where the cursor was
     positioned.
      $l=cursor.line(1) = the numeric value of the index of the array or structure
     where the cursor was last located, including consideration for vertical scrolling.
     If the cursor is in an array input field, $l contains the numeric value of the index
     of the array in which the cursor is positioned. If the cursor is not in an array input
     field, $l contains the numeric value, relative to the format in which the cursor is
     positioned, including accounting for vertical scrolling, which may be greater than
     the client's screen length.


1.2.4.2.17. RAD function: date

A RAD function that returns the date portion of a date and time variable.
Function
date
Format

  date($date.time.variable)

Factors
     The date portion of a date and time value is midnight of that day. For example,
     00:00:00. The function uses the local time zone to determine the date.
     The argument can be any absolute date and time value, or an absolute time,
     including tod.

Example

  $date.opened=date($date.time.variable)

Where $date.time.variable contains the current date and time or another valid date
and time value. For example, if $date.time.variable = '08/01/08 10:10:10' , then
$date.opened = '08/01/08 00:00:00'
.


1.2.4.2.18. RAD function: datecmp

A RAD function that translates the date/time fields to the correct SQL statement
dialect. You can use this function in expert search of incidents, as well as in
JavaScript programming.
Function
datecmp
Format

  datecmp("DateTimeField1","LogicOperator","DateTimeField2","+/-",
  "TimeInterval")

Parameters
This function uses the following arguments.


Argument                                Description                Example Value (s)
DateTimeField1
LogicOperator                           A date time field in an close.time
DateTimeField2                          Service Manager table.

+/-                                     A logic operator.          >, >=, =, <=, <
TimeInterval
                                        Another date time field in open.time
                                        the same Service
                                        Manager table.

                                        Arithmetic operator: +or +, -
                                        -.

                                        A string that represents   10 02:03:04
                                        the time interval to be
                                        added to or subtracted     (This string represents
                                        from the second date       10 days, 2 hours, 3
                                        time field.                minutes and 4 seconds.)

                                        The format of time
                                        interval can be: d, d
                                        hh:mm:ss, d h:m:s,
                                        hh:mm:ss, h:m:s, or
                                        hh:m:ss (1 digit mixed
                                        with 2 digits). Days can
                                        be omitted, or at most 9
                                        digits. Hours, minutes,
                                        and seconds can be 1 or
                                        2 digits (from 0 to 99),
                                        and hour:minute:second
                                        as a whole can be
                                        omitted if you enter only
                                        days.

Pay attention to the following items:

     All arguments must be enclosed in a pair of double quotes; otherwise, the query
     parsing will fail.


     This function supports AND , OR , and NOT to concatenate multiple
     datecmp() calls in one query.

     The following are two examples:

      datecmp("close.time", "<", "open.time","+", "1") or datecmp("close.time",">=",
     "open.time","+", "5:0:0")

      problem.status="Closed" and (not datecmp("close.time",">", "open.time",
     "+","31 04:02:30"))

     You can combine the result of this function with other query conditions to
     construct a complete query. For example, you can execute one of the following
     queries when performing an expert search of incidents:

            problem.status="Closed" and datecmp("close.time","
           <","open.time","+","04:02:30") and
           datecmp("close.time",">=","open.time","+","02:02:30" )
            problem.status="Closed" and datecmp("open.time",">","close.time", "-",
           "04:02:30" ) and datecmp("close.time",">=","open.time","+","02:02:30" )
            problem.status="Closed" and datecmp("close.time",">", "open.time",
           "+","31 04:02:30")

                   Note

                The first two queries should return the same results, which are
                incidents whose closed time is between 2 hours and 4 hours from
                their open time; the third query should return incidents that were
                closed more than 31 days after their open time.

Example

An example of a JavaScript program that uses this function is as follows:


var f = new SCFile('probsummary', SCFILE_READONLY);
var query = 'problem.status="Closed" and datecmp("close.time", "
<", "open.time","+", "04:02:30")
and datecmp("close.time",">=", "open.time","+", "02:02:30")';
if (RC_SUCCESS == f.doSelect(query))
{
do
{
print(f);
}
while (RC_SUCCESS == f.getNext());
};


1.2.4.2.19. RAD function: day

A RAD function that returns the day of month for a date, regardless of the date format.
Function
day
Format

  day=day($date)

Where the value of $date is a date and time value.
Factors
Although the set.timezone function affects the way a date is presented, the day
function always extracts the proper day value.
Example

  $mday=day(‘2/15/08’)

After execution, the value of $mday is 15 .


1.2.4.2.20. RAD function: dayofweek

A RAD function that returns the day of the week for a date, regardless of the date
format. The dayofweek function returns 1-7, where 1 is Monday, 2 is Tuesday, 3 is
Wednesday, 4 is Thursday, 5 is Friday, 6 is Saturday, and 7 is Sunday.
Function
dayofweek
Format

  day=dayofweek($date)

Where the value of $date is a date and time value.
Factors
The set.timezone function affects the way a date is presented, whereas the
dayofweek function always extracts the proper day of week value.
Examples
From the RAD debugger type:

  d dayofweek(‘11/06/09’)

This expression displays the day of the week of a specific date. (The command d
stands for ’display.’) In this example, the value of dayofweek is 5 or Friday.
From the RAD debugger type:

  x $Ltoday=dayofweek(‘11/06/09’)

This expression executes the function. (The command x stands for ’execute.’) In this
example, you want to assign the value to a variable.


1.2.4.2.21. RAD function: dayofyear

A RAD function that returns the day of year for a date, regardless of the date format.
Function
dayofyear
Format

  $yday=dayofyear($date)

The $date variable is a date and time value.
Example

  $yday=dayofyear('2/15/08')

After execution, the value of $yday is 46 .


1.2.4.2.22. RAD function:
dbdict.helper(“db.type”)

A RAD utility function that helps retrieve the current RDBMS type.
Function
dbdict.helper(“db.type”)
Format

  dbdict.helper(“db.type”)

Parameters
None
Return values
A string type value that represents the current RDBMS type, which can be “sqlserver”,
“oracle”, or “db2universal”.


1.2.4.2.23. RAD function:
dbdict.helper(“field.type”)

A RAD utility function that helps retrieve the field type property efficiently.
Function
dbdict.helper(“field.type”)
Format

dbdict.helper(“field.type”,$L.file/$filename,fieldname)

Parameters
The following parameters are valid for this function.

Parameter                               Description
$L.file/$filename
                                        The variable or name of the file to
fieldname                               which the field belongs

                                        The name of the field whose field type
                                        property is to be retrieved.

Factors
Always consider using a file variable first for better performance.
Return values
A number value that represents the field type. For information about the numeric
representations of data types, see Data types.
Example


function testDBDictHelper()
{

              var file = new SCFile( 'cm3r' );
              var fieldType =
system.functions.dbdict_helper("field.type", file, "assets" );
              print( "fieldType of assets in cm3r=", fieldType );
              var fieldType =
system.functions.dbdict_helper("field.type", file, "type" );
              print( "fieldType of type in cm3r=", fieldType );
              fieldType = system.functions.dbdict_helper("field.type",
"cm3r", "assets" );
              print( "fieldType of assets in cm3r by filename=",
fieldType );
              fieldType = system.functions.dbdict_helper("field.type",
"cm3r", "type" );
              print( "fieldType of type in cm3r by filename=",
fieldType );

              print( "db type=",
system.functions.dbdict_helper("db.type" ) );

              var isAlias = system.functions.dbdict_helper("is.alias",
file, "assets" );

              print( "assets is an alias:", isAlias );

              isAlias = system.functions.dbdict_helper("is.alias",
file, "number.vj" );

              print( "number.vj is an alias:", isAlias );

              isAlias = system.functions.dbdict_helper("is.alias",
file, "number.vj.ooflow" );

              print( "number.vj.ooflow is an alias:", isAlias );
              isAlias = system.functions.dbdict_helper("is.alias",
"cm3r", "number.vj.ooflow" );
              print( "number.vj.ooflow is an alias by filename:",
isAlias );

              isAlias = system.functions.dbdict_helper("is.alias",
file, "number.string" );

              print( "number.string is an alias:", isAlias );


                 isAlias = system.functions.dbdict_helper("is.alias",
  "cm3r", "middle,type" );

                 print( "middle,type is an alias by filename:", isAlias
  );

                 isAlias = system.functions.dbdict_helper("is.alias",
  "cm3r", "number.string" );

                 print( "number.string is an alias by filename:", isAlias
  );

                 isAlias = system.functions.dbdict_helper("is.alias",
  file, "middle,type" );

                 print( "middle,type is an alias:", isAlias );

                 var fileArray = system.functions.dbdict_helper(
  "joinfile.names", "joincomputer" );

                 print( "sub file array of joincomputer is: ", fileArray
  );

                 var uniquekey = system.functions.dbdict_helper(
  "unique.key", file );

                 print( "uniquekey of cm3r is: ", uniquekey );
  }

This example returns the following results:


       fieldType of assets in cm3r= 8
fieldType of type in cm3r= 2
fieldType of assets in cm3r by filename= 8
fieldType of type in cm3r by filename= 2
db type= sqlserver
assets is an alias: false
number.vj is an alias: true
number.vj.ooflow is an alias: true
number.vj.ooflow is an alias by filename: true
number.string is an alias: false
middle,type is an alias by filename: false
number.string is an alias by filename: false
middle,type is an alias: false
sub file array of joincomputer is: [C++ object Datum] -
{"device", "computer"}
uniquekey of cm3r is: [C++ object Datum] - {"number"}
uniquekey of cm3r by filename is: [C++ object Datum] -
{"number"}


1.2.4.2.24. RAD function:
dbdict.helper(“is.alias”)

A RAD utility function that helps determine whether a field is an alias or not.
Function
dbdict.helper(“is.alias”)
Format

dbdict.helper(“is.alias”,$L.file/$filename,fieldname)

Parameters
The following parameters are valid for this function.

Parameter                               Description
$L.file/$filename
                                        The variable or name of the file to
fieldname                               which the field belongs

                                        The name of the field to be checked

Factors
Always consider using a file variable first for better performance.
Return values
True: The field is an alias.
False: The field is not an alias.


1.2.4.2.25. RAD function:
dbdict.helper(“joinfile.names”)

A RAD utility function that helps retrieve an array of names of the sub files that belong
to a join file.
Function

dbdict.helper(“joinfile.names”)

Format

dbdict.helper(“joinfile.names”,$joinfilename)

Parameters
The following parameter is valid for this function.

Parameter                               Description
$joinfilename
                                        The name of the join file whose sub file
                                        names array is to be retrieved.

Factors
The join file must be already defined in joindefs.
Return values
Null or an array of strings containing the sub file names.


1.2.4.2.26. RAD function:
dbdict.helper(“unique.key”)

A RAD utility function that helps retrieve the first unique key or the primary key of a
file efficiently.
Function

dbdict.helper(“unique.key”)

Format

dbdict.helper(“unique.key”,$L.file/$filename)

Parameters
The following parameters are valid for this function.

Parameter                               Description
$L.file/$filename
                                        The variable or name of the file whose
                                        first unique key or primary key is to be
                                        retrieved.

Factors

Only the normal file type is supported. Other types of tables aren't supported.

This function returns the first unique key or the primary key from the datadict file
instead of the dbdict file; the application layer will keep consistency between datadict
and dbdict for the first unique key or the primary key.

Return values

An array of strings containing the names of all fields that constitute the first unique
key or the primary key.


1.2.4.2.27. RAD function: delete

A RAD function that deletes one or more elements in an array and returns the updated
array.
Function
delete
Format

  delete(array, element number, [number of elements])

Where the array variable is the array, the element number is the index number of
the first element to delete, and [number of elements] is the number of elements to
delete. The number of elements to delete is optional. The default value is one ( 1 ).
Example

  delete({1,2,3},2)

Returns {1,3}

  delete({1,2,3},2,2)

Returns {1}
````
