---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.2.4.2.28 .. 1.2.4.2.42
printed_pages: 1142-1166
---

# 1.2.4.2.28 RAD function: denull

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.4.2.28. RAD function: denull

A RAD function that compresses an array by removing all trailing NULL entries and
returns the compressed array.
Function
denull
Format

  denull(array)

Factors
     If the array contains a NULL entry in the middle of the array, that entry is not
     removed.
     Using denull on an empty array of structures converts the array of structures to
     a simple array.

                   Note

                Always test for NULL first.

     Displaying arrays extends the length of the array to accommodate window size.

                   Tip

                It is a good practice to denull arrays before records are added or
                updated. You can use denull(contents()) to accomplish this, but
                you should first ensure that the contents don't include any empty
                array of structures or they will be converted to simple arrays.

Example

  denull({1,2,3,,})

Returns {1,2,3} .


  denull({1,,2,,})

Returns {1,,2} .


1.2.4.2.29. RAD function: descriptor

A RAD function that returns the database dictionary descriptor structure for the table
specified.
Function
descriptor
Format

  descriptor($filename)

Parameters
The $filename variable is used for the table whose descriptor structure you are
requesting.


1.2.4.2.30. RAD function:
display.value.copy

A RAD function that copies the internal display value cache from one file variable to
another.
Function

display.value.copy

Format

display.value.copy($targetfile, $sourcefile)

Parameters
The following parameters are valid for this function.

Parameter                               Description
$targetfile
                                        The file to which the internal display
$sourcefile                             value cache is copied.

                                        The file from which the internal display
                                        value cache is copied.

Factors
The source or target file variable must be a valid file variable.
The old internal display value cache on the target file variable (if any) is released and
a new internal display value cache is copied from the source file variable.
Return values
0: success
-1: failure
Example
See RAD function: same.


1.2.4.2.31. RAD function: evaluate

Evaluates an operator and may return a value.
Function
evaluate
Format

  $e = evaluate($x)

Factors

     An operator is created using the parse function.
     The evaluate function is also valuable when the statement to be evaluated is
     contained in a Service Manager field that's not qualified once the application is
     compiled.
     The parse flag is used to parse data in a form, which in turn converts the data to
     an operator (data type 10).
     Although an lvalue is always required, a value is not always assigned to the
     lvalue.
Example
$x=parse("1+1",1) returns two ( 2 ).
$x=evaluate($x)


1.2.4.2.32. RAD function: evaluate.query

A RAD function that evaluates a query against a record. Both are passed as function
parameters.

Function

evaluate.query()

Format

$L.rc=evaluate.query( <query>, <file variable> )

Function returns
true : if the record matches the query.
false : if it doesn't match the query.
unkown : if a comparison in the query encountered a NULL value or a field was
referenced in the query that doesn't exist in the record.
null : if the function was called incorrectly.
Parameters
The following parameters are valid for the evaluate.query function:

Parameter                               Data type              Description
query"<query>"                          operator or character
                                                               Can be a previously
record"<file variable>" record                                 parsed query or a string
                                                               containing a query

                                                               Must be a valid file
                                                               variable

Examples

  $x = evaluate.query( "true", $L.file )

This example returns TRUE for any valid file variable.


  $query = parse( "contact.name # \"S\" ", 4 )
  $y = evaluate.query( $query, $L.filed )

This example returns TRUE only for contacts records that start with "S" and FALSE
for every other contacts record.


1.2.4.2.33. RAD function: exists

A Rapid Application Development (RAD) function that checks for the existence of a
field in a table.
Function
exists
Format

  exists(<field name>, $file)

Factors
     Returns true or false .
     Replaces the index(<field.name>, descriptor($file))>0 expression.
     The $file variable must be of data type 6. Any other data type returns false.
     The first parameter can be either a character type variable or a quoted string.

Example

  $L.return=exists("schedule.id", $L.schedule)

The value of $L.return is true if $L.schedule is a file variable containing a
schedule record.


1.2.4.2.34. RAD function: fduplicate

A RAD function that copies an entire file variable from one record to another.
Function
fduplicate
Format

  fduplicate($target, $source)

Factors
     The system doesn't recognize fduplicate alone.
     Returns a Boolean value: true if it is successful, and false if it fails.
     Used primarily in RAD process panels and in Format Control.

Example

  $L.void=fduplicate($file0, $file)

Creates $file0 , an independent copy of $file .


1.2.4.2.35. RAD function: filename

A RAD function that returns the name of the file for the specified file variable.
Function
filename
Format

  filename($filename)

Parameters
The $filename variable has been bound to a database file with the rinit command
panel.
Factors
This function is useful when executing a common subroutine that has been passed a
file variable. This function allows you to determine the file name because the local
variable contains data from an unknown file.
Example
filename($file) returns the dbdict name.


1.2.4.2.36. RAD function: filequeryex

A RAD function that returns the query parameters of a file variable.
Function
filequeryex
Format

  filequeryex(file)

Parameters
file is an Service Manager file variable, which can be either $L.file in RAD or
SCFile in JavaScript.
Factors
This function returns an array with the following elements:

     No.0 is the query string, which supports both Service Manager queries and
     ADHOC SQL queries.
     No.1 is the sort-by fields, separated by a comma. Note that the group-by fields
     will be merged with a higher priority.
     No.2 is the sort-by order: 0 is ascending, 1 is descending, and an empty value is
     NULL.
     No.3 is the group-by fields, separated by a comma.
     No.4 is the group order: 0 is ascending, 1 is descending, and an empty value is
     NULL.

            Note

           To set the sort-by and group-by arrays, use " var sortOrder=
           [SCFILE_ASC]; " instead of " var sortOrder=new Array(SCFILE_ASC); ".

Examples
Achoc query example:

  var file = new SCFile("probsummary");


  var sql = 'select affected.item, number from probsummary where
  affected.item isin (select logical.name from device where
  owner=\""Administration\"")';
  var success=file.doSelect( sql ) ;
  var fields = new Array("affected.item");
  var sortOrder=[SCFILE_ASC];
  var rc = system.functions.setsort(file,fields,sortOrder);
  var q = system.functions.filequeryex(file);
  print("rc: " + success + ", q[0]: " + q[0] + ", q[1]:" + q[1] +
  ", q[2]:" + q[2]+", q[3]:" + q[3] + ", q[4]:" + q[4]);

Non-adhoc query example:

  var sql='number#"IM1"';
  var f1 = new SCFile("probsummary");
  var rc =f1.doSelect(sql);
  var fields = new Array("affected.item");
  var sortOrder=[SCFILE_ASC];
  var rc = system.functions.setsort(f1,fields,sortOrder);


var q = system.functions.filequeryex(f1);

print("rc: " + success + ", q[0]: " + q[0] + ", q[1]:" + q[1] +
", q[2]:" + q[2]+", q[3]:" + q[3] + ", q[4]:" + q[4]);


1.2.4.2.37. RAD function: frestore

A RAD function that restores all the fields in a file to their original values from the
database.
Function
frestore
Format

  frestore($file)

The $file variable is the file for which you want to restore the fields to their original
values.
Factors

     Use only with a Windows client.
     This function returns no value, it is unnecessary to use it in an assignment
     statement.
Example

  frestore($file)

If the $file variable is initialized and a record is selected, changes are made to the
contents of the $file variable in memory, but the updates aren't yet written to the
database. After execution, the $file variable is restored to the original value, which is
the state stored in the database.


1.2.4.2.38. RAD function: genout

A RAD function that generates a string containing the contents of a record using a
specified form. The output produced is either fixed or variable length.
Function
genout
Format

  genout($file.variable, $format.name)

Parameters
The $file.variable is a variable containing a record or records to process.
The $format.name variable is the name of format to be used.
Factors

     Spaces are substituted for NULL in fixed length output.
     All normal format processing occurs, including input and output routines. Data
     can therefore be automatically reformatted or manipulated as part of the
     function. For example, a date can be converted from 02/28/05 00:00:00to
     February 28, 2005.
Examples

  $output=genout($operator, “operator.view”)

  $output={“Name:joes Full Name:Joe Smith”,

  “Printer:sysprint Email:joes@microfocus.com”}


1.2.4.2.39. RAD function:
get.base.form.name

A RAD function that returns the base name of a form, without the .g (GUI) or .w (Web)
file extension.
Function
get.base.form.name
Format

  $base.form.name=get.base.form.name($form.name)

Parameters
$form.name
Examples
In each of the following examples, the result is the same after execution:
$base.form.name is operator .
Example 1:

  $form.name=“operator.g”

  $base.form.name=get.base.form.name($form.name)

Example 2:

  $form.name=“operator.w”

  $base.form.name=get.base.form.name($form.name)

Example 3:

  $form.name=“operator”


  $base.form.name=get.base.form.name($form.name)

Example 4:

  $form.name=“operator.a”

  $base.form.name=get.base.form.name($form.name)


1.2.4.2.40. RAD function: get.dateformat

A RAD function that returns the date format, represented by a number, used by your
operator ID.
Function
get.dateformat
Format

  $date.fmt=get.dateformat()

Factors
Date formats represented, by number:

     1 = mm/dd/yy
     2 = dd/mm/yy
     3 = yy/mm/dd
     4 = mm/dd/yyyy
     5 = dd/mm/yyyy
     6 = yyyy/mm/dd
Example

  $date.fmt=get.dateformat()

After execution for a typical user in the United States, the value of $date.fmt is one
( 1 ).


1.2.4.2.41. RAD function:
get.display.value

This RAD function returns the display value of a field in a Service Manager file.
Function
get.display.value
Format

  get.display.value($file, $fieldname, [index], [bForceFromDB])

Parameters
The following parameters are valid for this function.

Parameter                                                                                       Service Manager 9.81
$file
                                        Description
$fieldname
                                        The $file variable is the file from which
                                        you want to retrieve the display value.

                                        The name of a field in the file.

                                                    Caution

                                                   You can't use a variable for
                                                   this parameter. For
                                                   example,
                                                   $L.display=get.display.val
                                                   ue($L.file, "$affected.cis",
                                                   -1, true) is unsupported.

[index]                                 This parameter is optional.
[bForceFromDB]
                                        If the field specified in $fieldname is of
                                        the array type, the index is the position
                                        number of an element in the array
                                        where the element is located.

                                        If the index is not specified or is -1, the
                                        entire array is retrieved instead.

                                        This parameter is optional.

                                        This is a Boolean type variable, which
                                        can be true or false. If it is true, this
                                        function will bypass the internal display
                                        value cache associated with $file, and
                                        retrieve the display value directly from
                                        the RDBMS.

Factors

If an internal display value cache doesn't already exist, a null value is returned;
however, if bForceFromDB is set to true, the Service Manager server looks for the


display value directly from the RDBMS according to the current field value.

For an array type field, if bForceFromDB is set to true, this function combines the
value in the display value cache (if any) and the value fetched directly from the
RDBMS, and returns the combined value.

For a string type field, if bForceFromDB is set to true, while the Service Manager
server can't find any value from the RDBMS, the value in the display value cache (if
any) is returned instead.

There are two ways to create an internal display value cache associated with $file:

     Use the set.display.value function explicitly.
     Any time when users enter or change the display value from the client side and
     the client submits the request to the server side, the internal display value cache
     is updated. This is automatic and not under the user’s control.

Return values

Can be null, a string type display value, or an array of string type display values.

Examples


  function testDisplayValue()
  {

                 var sql = 'select * from cm3r where number="C10008"';
                 var file = new SCFile('cm3r');
                 var rc = file.doSelect(sql);
                 print( "Field value of assets=" + file.assets );
                 print( "Field value of logical.name=" +
  file.logical_name );
                 var darray = new SCDatum();
                 darray.push( "aaa" );
                 darray.push( "bbb" );
                 print( "Value of darray=" + darray );
                 system.functions.set_display_value(file, "assets",
  darray, -1 );
                 var value = system.functions.get_display_value(file,
  "assets" );
                 print( "get.display.value for assets from internal
  display value cache=" + value );
                 value = system.functions.get_display_value(file,
  "assets", -1, true );
                 print( "get.display.value for assets from RDBMS=" +
  value );
                 value = system.functions.get_display_value(file,
  "logical.name" );
                 print( "get.display.value for logical.name from internal
  display value cache=" + value );
                 value = system.functions.get_display_value(file,
  "logical.name", -1, true );
                 print( "get.display.value for logical.name from RDBMS="
  + value );
  }
  testDisplayValue();

This example returns the following results:
Field value of assets=[C++ object Datum] - {"CI1000984", "CI1000988"}
Field value of logical.name=CI1000984
Value of darray=[C++ object SCDatum] - {"aaa", "bbb"}


get.display.value for assets from the internal display value cache=[C++ object Datum]
- {"aaa", "bbb"}
get.display.value for assets from the RDBMS=[C++ object Datum] - {"adv-Windows-
101", "adv-Windows-102", "aaa", "bbb"}
get.display.value for logical.name from the internal display value cache=null
get.display.value for logical.name from the RDBMS=adv-Windows-101


1.2.4.2.42. RAD function:
get.graph.action

Description
A RAD function that returns the activated action on a node in the graph diagram.
Function
get.graph.action()
Example
$L.graphaction = get.graph.action()
````
