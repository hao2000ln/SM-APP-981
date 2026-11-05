---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.2.4.2.87 .. 1.2.4.2.100
printed_pages: 1237-1261
---

# 1.2.4.2.87 RAD function: same

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.4.2.87. RAD function: same

A RAD function that compares two values. If the values are equal or both values are
null, the result is true; otherwise, the result is false.

Function

same

Format

same(value1,value2)

Parameters
The following parameters are valid for this function.

Parameter                               Description
value1                                  The first value to be compared.
value2                                  The second value to be compared.

Factors

Use this function to compare arrays and structures, nulls, files, or empty strings.

When using the same function to compare arrays or structures, preface the variable
names with denull, as shown in the following example:

not same(denull($filea), denull($fileb))

Note

When using the same function to compare two files, the files must have
the same schema, data, display value, and so on to return a result of True.

Return values

     True: same
     False: not same


Examples
same(1,NULL) returns false .
same(NULL,NULL) returns true .
same({},{,}) returns true .
same({1},{1,}) returns true .
same("",NULL) returns false .
The following is another example:


function testdisplayvaluecopy()
{

              var sql = 'select * from cm3r where number="C10001"';
              var file = new SCFile('cm3r');
              var file1 = new SCFile('cm3r');
              var rc = system.functions.fduplicate( file, file1 );

              rc = file.doSelect(sql);
              rc = system.functions.same( file, file1 );
              print("file is same as file1 after file.doSelect: ", rc
);

              rc = file1.doSelect(sql);
              rc = system.functions.same( file, file1 );
              print("file is same as file1 after file1.doSelect: ", rc
);
              var vRet = system.functions.set_display_value(file1,
"assets", "testbystone", 1);

rc );  rc = system.functions.same( file, file1 );
       print("file is same as file1 after set.display.value: ",

       vRet = system.functions.display_value_copy(file, file1);

              rc = system.functions.same( file, file1 );
              print("file is same as file1 after display.value.copy:
", rc );
}
testdisplayvaluecopy();

This example returns these results:

file is same as file1 after file.doSelect: false

file is same as file1 after file1.doSelect: true

file is same as file1 after set.display.value: false


file is same as file1 after display.value.copy: true


1.2.4.2.88. RAD function: scmsg

Returns a text string matching the format of the message ID number and message
class specified. The function replaces any variables in the message with the text
specified in an array of values.

Function

scmsg

Format

scmsg($id, $class, $arrayof values)

Parameters
The following parameters are valid for the scmsg function:

Parameter                               Data type           Description
$id                                     Number
                                                            The ID number of the
$class                                  String              message (message.id)
$arrayofvalues                          Array               from the scmessage
                                                            table.

                                                            The Message class from
                                                            the scmessage table.

                                                            An array of substitution
                                                            text for the %S
                                                            variables in the message
                                                            text from the scmessage
                                                            table.

Factors

     All substitution text must be %S , which indicates that a string is used to
     provide the data. Each entry in the array of substitution text is examined for the
     type. If it's not a string type, it is converted to a string.
     You must create a separate record in the scmessage table for the message in
     each language you want to display.


     The $arrayofvalues defined in the scmsg function are applied to the message in
     the scmessage table corresponding to the language defined for the client login.
     When adding a scmessage record to the scbutton class, the scballoon class, the
     sccaption class, and the sctitle class, the message ID must end with
      _<number> . <number> is a string of decimal positions of the uppercase
     characters in the message ID. For example, My Affected Example_1413 . In this
     example, 1413 symbolizes the positions of the uppercase characters of M (1),
      A (4), and E (13) in the message ID, respectively.
     When calling the scmsg() function, the message ID must be used without the
      _<number> suffix.
Example

  scmsg("21", "cib", {"mail", "middle,caller.id", "open"})

Resulting message from the scmessage table:

  Built macro to %S to %S on %S.

When the %S array values from the scmsg function in the example are applied, the
message is displayed as:

  Built macro to mail to middle,caller.id on open


1.2.4.2.89. RAD function:
set.display.value

A RAD function that sets the display value for a specified field of a file variable. The
display value can then be retrieved by using the get.display.value($file,$fieldname)
syntax.

Function

set.display.value

Format

set.display.value($file,$fieldname,$dispvalue,[index])

Parameters
The following parameters are valid for this function.

Parameter                               Description
$file
                                        The file variable for which the display
$fieldname                              value is set
$dispvalue
[index]                                 The field name in the file

                                        The display value to be set

                                        This parameter is optional.

                                        If the field specified in $fieldname is of
                                        the array type, the index is the position
                                        number of an element in the array
                                        where the element is located; if the
                                        index is not specified or is -1,
                                        $dispvalue must be an array type value
                                        as well.

Factors


This function sets the display value in an internal display value cache associated with
the $file variable. If an internal display value cache doesn't already exist, this function
creates a cache.
Return values
Null or the old display value, which can be an array of strings or a string.
Example
See RAD function: get.display.value


1.2.4.2.90. RAD function: set.timezone

A RAD function that sets the time zone, the translation from local to internal
characters, and the date format. Time zone is established at either user login or
process startup time. Note that not all processes that are started are user processes.
At login, Service Manager determines the time zone first by the company record and
then the operator record.

Function

set.timezone

Format

set.timezone(servertz)

Parameters
The following parameter is valid for the set.timezone function:

Parameter                               Data type    Description
servertz                                File/record
                                                     A record in a Service
                                                     Manager tzfile table.

Example

$void=rtecall("rinit",$r,$L.tz, "tzfile")
$void=rtecall("select",$r,$L.tz,
"name=\"Australia/Queensland\"")
set.timezone($L.tz)


1.2.4.2.91. RAD function: setsort

A RAD function that sorts the fields in a table. The setsort function allows for a third
parameter so that it could be an array of numbers, zero or one ( 0 or 1 ). The entries
in this array correspond to the entries in the name array. A 0 indicates the field will
be used to sort in ascending order and a 1 indicates the field will be used to sort in
descending order. A 0 or 1 can also be used to sort on all fields in ascending or
descending order.
Function
setsort
Format
p

    setsort($L.file, $L.arrayofnames, 0): ascending sort
  setsort($L.file, $L.arrayofnames, 1): descending sort
  $L.void=setsort($L.file, $L.arrayofnames, $L.arraysortorder)

Example
If you wanted to sort a list of contacts by name (ascending), age (ascending), and
state (descending).

  $L.arrayofnames={"name","age","state"}
  $L.arraysortorder={0,0,1}
  $L.void=setsort{$L.contacts, $L.arrayofnames, $L.arraysortorder}


1.2.4.2.92. RAD function: shutdown

A RAD function that shuts down Service Manager from within the system. No values
are returned, this function only performs an operation.
Function
shutdown
Format

  shutdown()

Factors
Place this function on the last panel to be executed in a shutdown application. Once
the function is executed, the form from which Service Manager was started is
displayed.


1.2.4.2.93. RAD function: simple.file.load

A RAD function that loads an unload file containing only data records of one file into a
target file. If the target file already exists it will either drop the target file first, or return
an error based on a flag passed as a parameter.
This function only works with binary unload files. Text unload files aren't supported.

            Caution

           Due to the limited capabilities of this routine and the potential loss of data,
           this function should not be used except by system RAD routines such as
           the upgrade.

Function
simple.file.load()
Format

  $L.rc=simple.file.load( <unload file name>, <target file name>,
  <drop if already exists flag> )

Function returns
true - if successful.
false - if there was a failure.
Parameters
The following parameters are valid for the simple.file.load function:


Parameter                               Data type  Description
unload file name                        character
                                                   Specifies where the
target file name                        character  unload file is located

drop if already exists                  logical    Specifies the target file
                                                   for this function, for
                                                   example, signatures. As
                                                   a safety precaution, this
                                                   file name has to match
                                                   the dbdict record
                                                   internally stored in the
                                                   unload file, or the
                                                   function returns an error.

                                                   Controls the behavior of
                                                   the function if the target
                                                   file already exists. If set
                                                   to FALSE, the function
                                                   will fail and return an
                                                   error if the target file
                                                   already exists in the
                                                   system. If set to TRUE,
                                                   the function will drop the
                                                   existing target file first,
                                                   before recreating it
                                                   based on the dbdict
                                                   record stored in the
                                                   unload file.

Example

  $L.result=simple.file.load( "C:\\Temp\\my_signatures.unl",
  "signatures", false )

This example attempts to load the unload file C:\Temp\my_signatures.unl into the
signatures file. It will fail if the signatures file already exists (third parameter is false).


Note

The escape characters have to be escaped.


1.2.4.2.94. RAD function: sleep

A RAD function that temporarily ceases the execution of an executing thread for the
specified number of seconds.

Function

sleep

Format

sleep($seconds)

Parameters
The following parameter is valid for the sleep function:

Parameter                               Data type         Description
$seconds                                Integer
                                                          Specifies the positive
                                                          integer of seconds to
                                                          sleep.

Example

  sleep(10)

The thread will sleep 10 seconds.


1.2.4.2.95. RAD function: str

A RAD function that converts a data type that's not a string into a string.
Function
str
Format

  str(any valid expression)

Parameters
Any valid expression passed to the str function can be converted to a string.
Examples
str(1+1) returns 2 .
"report run at "+ str(tod()) returns "report run at 12/10/90 10:10:00" .


1.2.4.2.96. RAD function: stradj

A RAD function that ensures a string is a specific length by removing or adding trailing
blanks.

Function

stradj

Format

$L.void=stradj($string, $size)

Parameters
The following parameters are valid for the stradj function:

Parameter                               Data type            Description
$L.void=                                Not applicable
                                                             A syntax requirement
$string                                 String               only, which doesn't
$size                                   Number               affect the outcome of the
                                                             function.

                                                             The string being
                                                             modified.

                                                             The desired size of
                                                             $string.

Examples

  $string="Hewlett-Packard"
  $size=15
  $L.void=stradj($string, $size)

After execution, the value of $string is Hewlett-Packard .


  $string="Hewlett-Packard"
  $size=10
  $L.void=stradj($string, $size)

After execution, the value of $string is Hewlett-Pa .


1.2.4.2.97. RAD function: strchrcp

A RAD function that replaces part of a string with copies of another string.
Function
strchrcp
Format

$L.void=strchrcp($target, $index, $source, $copies)

Parameters
The following values are valid for the strchrcp function:

Parameter                               Data type          Description
$L.void=                                Not applicable.
                                                           A syntax requirement
$target                                 String             only, doesn't affect the
$index                                  Number             outcome of the function.

$source                                 String             The string being
$copies                                 Number             modified.

                                                           The position in $target
                                                           to begin copying
                                                           $source .

                                                           The string to be copied
                                                           into $target .

                                                           The number of copies of
                                                           $source to replicate
                                                           within $target .

Factors
This function never extends the length of $target .
Example


  $target="Hewlett-Packard"
  $index=4
  $source="falcon"
  $copies=2
  $L.void=strchrcp($target, $index, $source, $copies)

After execution, the value of $target is Hewfalconfalcon .


1.2.4.2.98. RAD function: strchrin

A RAD function that inserts copies of a string into another string.
Function
strchrin
Format

$L.void=strchrin($target, $index, $source, $copies)

Parameters
The following parameters are valid for the strchrin function:

Parameter                               Data type        Description
$L.void=                                Not applicable.
                                                         A syntax requirement
$target                                 String           only, doesn't affect the
$index                                  Number           outcome of the function.

$source                                 String           The string being
$copies                                 Number           modified.

                                                         The position in $target
                                                         to begin inserting copies
                                                         of $source .

                                                         The string to be inserted
                                                         into $target .

                                                         The number of copies of
                                                         $source to insert into
                                                         $target .

Example


  $target="Hewlett-Packard"
  $index=4
  $source="falcon"
  $copies=2
  $L.void=strchrin($target, $index, $source, $copies)

After execution, the value of $target is Hewfalconfalconlett-Packard .


1.2.4.2.99. RAD function: strclpl

A RAD function that removes a number of characters from the beginning of a string.
Function
strclpl
Format

$L.void=strclpl($string, $number)

Parameters
The following parameters are valid for the strclpl function:

Parameter                               Data type             Description
$L.void=                                Not applicable.
                                                              A syntax requirement
$string                                 String                only, doesn't affect the
$number                                 Number                outcome of the function.

                                                              The string being
                                                              modified.

                                                              The number of
                                                              characters to remove.

Example

  $string="Hewlett-Packard"
  $number=6
  $L.void=strclpl($string, $number)

After execution, the value of $string is t-Packard .


1.2.4.2.100. RAD function: strclpr

A RAD function that removes a specified number of characters from the end of a
string.

Function

strclpr

Format

$L.void=strclpr($string, $number)

Parameters
The following parameters are valid for the strclpr function:

Parameter                               Data type             Description
$L.void=                                Not applicable.
                                                              A syntax requirement
$string                                 String                only. It doesn't affect the
$number                                 Number                outcome of the function.

                                                              The string being
                                                              modified.

                                                              The number of
                                                              characters to remove.

Example

  $string="Hewlett-Packard"
  $number=6
  $L.void=strclpr($string, $number)

After execution, the value of $string is Hewlett-P .
````
