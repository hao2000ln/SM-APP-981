---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.2.4.3 .. 1.2.4.3.10
printed_pages: 1327-1354
---

# 1.2.4.3 List: rtecalls()

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.4.3. List: rtecalls()

The rtecalls are based on one RAD function, the rtecall( ) function. They are in-line
statements that are useful in the Service Manager RAD Debugger. The rtecall function
is available anywhere in Service Manager that supports expressions, statements, or
calculations. For example, rtecalls can be used in Format Control calculations, scripts,
and displayoptions. The rtecall() function is extensible. New capabilities may appear
in every release of Service Manager.

 Function                                                                                       Service Manager 9.81
 rtecall("alalnum")
                                        Description
 rtecall("counter")
 rtecall("datemake")                    Checks to make sure a string contains
 rtecall("escstr")                      only alphanumeric characters, or only
 rtecall("filldate")                    alphanumeric characters and the
 rtecall("filecopy")                    provided non-alphanumeric characters.
 rtecall("fileinit")
 rtecall("getnumber")                   Turns counters on or off for the current
 rtecall("getrecord")                   session. Other Service Manager users
 rtecall("getunique")                   are unaffected.
 rtecall("isalnum")
                                        Returns a date, in the proper form,
This PDF was generated on May 23, 2026  based upon a series of numbers
                                        passed to it.

                                        Precedes special characters in a string
                                        with an escape character.

                                        Places the current date and time in a
                                        field in the current record.

                                        Copies all of the data in a collection to
                                        another file variable.

                                        Initializes a new file (rinit) in $targetfile.

                                        Replaces the getnumb RAD application.

                                        Retrieves the record identified by
                                        Unique key values in $L.array.

                                        Returns into $L.array the values for the
                                        Unique key from the current record in
                                        $L.file.

                                        Checks to make sure a string contains
                                        only numeric characters, or only
                                        numeric characters and the provided
                                        non-numeric characters.

                                                                                                                        Page 146 of 153
 Function                                                                                       Service Manager 9.81
 rtecall("isalpha")
                                        Description
 rtecall("islower")
                                        Checks to make sure a string contains
 rtecall("isnumeric")                   only alphabetic characters, or only
                                        alphabetic characters and the provided
 rtecall("isupper")                     non-alphabetic characters.

 rtecall("log")                         Checks to make sure a string contains
 rtecall("passchange")                  only lowercase characters, or only
 rtecall("policycheck")                 lowercase characters and the provided
 rtecall("qbeform")                     non-lowercase characters.
 rtecall("recdupl")
 rtecall("recordexists")                Checks to make sure a string contains
                                        only numeric characters, or only
This PDF was generated on May 23, 2026  numeric characters and the provided
                                        non-numeric characters.

                                        Checks to make sure a string contains
                                        only uppercase characters, or only
                                        uppercase characters and the provided
                                        non-uppercase characters.

                                        Sends a message to the external
                                        sm.log file.

                                        Changes this user’s password.

                                        Imposes data policy as defined in the
                                        datadict table.

                                        Returns a record list form, which can
                                        be passed into an rio or fdisp panel.

                                        Copies the contents of the current
                                        record into the contents of another
                                        record.

                                        Specifies whether any records exist
                                        that match a particular query
                                        regardless of any Mandanten data
                                        restrictions.

                                                                                                                        Page 147 of 153
 Function                                                                                       Service Manager 9.81
 rtecall("refresh")
 rtecall("resetnotebook")               Description
 rtecall("rfirst")
 rtecall("rgoto")                       Retrieves the most current value of a
 rtecall("rid")                         record from the database and returns it
 rtecall("scantable")                   in the file variable.
 rtecall ("select")
                                        Adds an XML attribute
 rtecall("setdebug")                    "resetnotebook=true" to the "execute"
 rtecall("sort")                        response of the current RAD thread.
 rtecall("statusupdate")
 rtecall("transtart")                   Places the pointer at the first record in
                                        a record collection (a record list).
This PDF was generated on May 23, 2026
                                        Places the pointer at the indicated
                                        record.id in a record collection (a
                                        record list).

                                        Returns the record number of the
                                        current record (represented by $L.file).

                                        Scans the specified table for certain
                                        types of invalid records and fixes them.

                                        Retrieves a list of records for a file in
                                        ascending or descending order
                                        according to the specified sort fields
                                        and group fields.

                                        Sets the debug parameters.

                                        Sorts a list or a list of lists in ascending
                                        or descending order.

                                        Publishes a message to a specific field
                                        on a form.

                                        Measures the amount of data
                                        transferred, elapsed time and CPU
                                        usage of any transaction.

                                                                                                                        Page 148 of 153
Function                                                                                        Service Manager 9.81
rtecall("transtop")
                                        Description
rtecall("trigger")
                                        Measures the amount of data
                                        transferred, elapsed time and CPU
                                        usage of any transaction.
                                        Transtop is commonly invoked from the
                                        RAD debugger and is used in
                                        conjunction with transtart.

                                        Turns triggers on or off for the current
                                        session.


1.2.4.3.1. rtecall("alalnum") function

A RAD function that verifies that a string contains only alphanumeric characters. The
first character must be alphabetic. The remaining characters must be alphabetic,
numeric, or one of the non-alphabetic characters provided.

Function

rtecall("alalnum")

Format

$L.success.flag= rtecall ($L.fnc.name, $L.return.code, $L.str,
$L.chars)

Parameters
The following parameters are valid for the rtecall("alalnum") function:

Parameter                               Data type  Description
$L.success.flg                          Logical
$L.fnc.name                             String     Indicates if the function
                                                   was successful
$L.return.code                          Number
$L.str                                  String     Name of the sub-
$L.chars                                String     function to call, in this
                                                   case "alalnum"

                                                   Provides a more detailed
                                                   return code

                                                   The string to be checked

                                                   An optional comma
                                                   delimited string of non-
                                                   alphanumeric characters
                                                   to allow

Factors

If the $L.success.flg is false , the function failed. If it is true , the function
succeeded.


Example

  $L.success.flag=true
  $L.return.code=0
  $L.str=name in $L.file
  $L.chars="., _"
  $L.success.flag=rtecall("alalnum", $L.return.code, $L.str,
  $L.chars)

Results:

      $L.success.flag is true when name in $L.file="my.name" .
      $L.success.flag is true when name in $L.file="my_name" .
      $L.success.flag is false when name in $L.file="my name" .


1.2.4.3.2. rtecall("counter") function

A RAD function that turns counters on or off for the current session. Other users
aren't affected.

Function

rtecall("counter")

Format

$L.success.flag= rtecall($L.fnc.name, $L.return.code, $L.switch)

Parameters
The following parameters are valid for the rtecall("counter") function:

Parameter                               Data type  Description
$L.success.flg                          Logical
                                                   Indicates whether or not
$L.fnc.name                             String     the function was
                                                   successful.
$L.return.code                          Number
$L.switch                               Number     The name of the sub-
                                                   function to call, in this
                                                   case "counter".

                                                   Provides a more detailed
                                                   return code.

                                                   The value is either one
                                                   ( 1 ), indicating counters
                                                   on, or zero ( 0 ),
                                                   indicating counters off.

Factors

If the $L.success.flg is false , the function failed. If it is true , the function
succeeded.

Example


 $L.success.flg=rtecall("counter", $L.return.code, 1) to turn on
counters
$L.success.flg=rtecall("counter", $L.return.code, 0) to turn off
counters


1.2.4.3.3. rtecall("datemake") function

A RAD function that returns a date, in the proper form, based upon a series of
numbers passed to it.
Function
rtecall("datemake")
Format
$L.success.flg=rtecall($L.fnc.name, $L.return.code, $L.date, $L.yr, $L.mo, $L.da,
$L.hr, $L.mn, $L.se)
Parameters
The following parameters are valid for the rtecall("datemake") function:


Parameter                               Data type  Description
$L.success.flg                          Logical
$L.fnc.name                             String     Indicates if the function
                                                   was successful.
$L.return.code                          Number
$L.date                                 Date/Time  The name of the sub-
$L.yr                                   Number     function to call. In this
                                                   case, "datemake".
$L.mo                                   Number
$L.da                                   Number     Provides a more detailed
                                                   return code.
$L.hr                                   Number
$L.mn                                   Number     The variable in which the
$L.se                                   Number     date will be returned.

                                                   The year. A 2-digit year
                                                   uses the prefix 20 for
                                                   years up to 50, and 19
                                                   for years after. For
                                                   example, 48 returns
                                                   2048 , 99 returns
                                                   1999 .

                                                   The month.

                                                   The day. Valid values are
                                                   from one (1) through 31.

                                                   The hour.

                                                   The minutes.

                                                   The seconds.

Factors

The $L.success.flag and $L.return.code always return true , even when the function
is unsuccessful.

Examples


  $L.cal.date='01/01/05 00:00:00'
  $L.success.flg=rtecall("datemake",$L.return.code, $L.cal.date,
  0, 5, 31, 17, 15, 22)

Results:
      $L.success.flag=true
      $L.cal.date='05/31/2005 17:15:22'

  $L.cal.date='01/01/05 00:00:00'
  $L.success.flag= rtecall("datemake",$L.return.code, $L.cal.date,
  0, 2, 31, 17, 15,
  22)

Note that 2/31/05 is an invalid date.
Results:

      $L.success.flag=true
      $L.cal.date='01/01/2005 00:00:00'
The result is invalid; therefore the date variable is unchanged. Regardless of the
success or failure, the $L.success.flag returns a value of true .


1.2.4.3.4. rtecall("escstr") function

A RAD function that precedes special characters in a string with an escape character.
This function is rarely needed. The only situation in which a string needs the escape
characters added is when that string is to be fed back into Service Manager. Service
Manager treats any data between quotes as a string. If the data contains a quote, then
that quote must be escaped with a backslash escape character (\) to ensure that the
quote is treated as data instead of the end of the string. Since the backslash is used
as the escape character, any occurrence of a backslash in the data must also be
escaped.
An example of when this function might be needed is when a RAD program is
constructing a query to retrieve a record based on data from another record. In this
case, the contact name in an incident retrieves the contact information from the
contacts table. The RAD program might construct a query as follows:

  $L.query = "name="+contact.name in $file

This query will not function properly if the contact.name from $file contains a
quote or a backslash character because these characters aren't properly escaped
and will cause the parse of the query to end prematurely. The correct example is as
follows:

  $L.temp = contact.name in $file
  $L.ret = rtecall("escstr",$L.rc,$L.temp)
  $L.query="name="+$L.temp

Function
rtecall("escstr")
Format

  rtecall($L.fnc.name, $L.rc, $L.str)

Parameters
The following parameters are valid for the rtecall("escstr") function:


Parameter                               Data type          Description
$L.fnc.name                             String
                                                           Name of the sub-
$L.rc                                   Number             function to call, in this
$L.str                                  String             case "escstr".

                                                           Provides a more detailed
                                                           return code.

                                                           The string to be
                                                           modified.

Example
Before the call to "escstr" , $L.str contains c:\dir\sub.

  $L.rc=0
  $L.ret=rtecall("escstr", $L.rc, $L.str)

After the rtecall, $L.str contains the following string: c:\\dir\\sub. The backslash
escape character (\) is now inserted in front of the existing backslash.


1.2.4.3.5. rtecall("filecopy") function

A RAD function that copies all of the data in a collection to another file variable. The
database dictionary record for both the source and target files must exist. Records
are only added.
Function
rtecall("filecopy")
Format

  $L.success.flg=rtecall($L.fnc.name, $L.return.code,
  $L.dbdict.source.name,
  $L.dbdict.target.name, $L.count, $L.bad)

Parameters
The following parameters are valid for the rtecall("filecopy") function:


Parameter                               Data type  Description
$L.success.flg                          Logical
                                                   Indicates if the function
$L.fnc.name                             String     was successful.

$L.return.code                          Number     Name of the sub-
                                                   function to call, in this
$L.dbdict.source.name String                       case "filecopy".

$L.dbdict.target.name String                       Provides a more detailed
                                                   return code.
$L.count                                Number
                                                   The name of the source
$L.bad                                  Number     database dictionary
                                                   record.

                                                   The name of the target
                                                   database dictionary
                                                   record.

                                                   A count of the number of
                                                   records successfully
                                                   moved.

                                                   A count of the number of
                                                   errors encountered.

Factors

If the $L.success.flg is false , the function failed. If it is true , the function
succeeded.

Example

  $L.dbdict.source.name="location"
  $L.dbdict.target.name="locationbak"
  $L.success.flg=rtecall("filecopy", $L.return.code,
  $L.dbdict.source.name,
  $L.dbdict.target.name, $L.count, $L.bad)

Returns the locationbak file as an exact copy of the location file.



1.2.4.3.6. rtecall("fileinit") function

A RAD function that initializes a file variable in $targetfile from $sourcefile .
Function
rtecall("fileinit")
Format

rtecall($L.fnc.name, $errcode, $targetfile, $sourcefile)

Parameters
The following parameters are valid for the rtecall("fileinit") function:

Parameter                               Data type  Description
$L.fnc.name                             String
                                                   Name of the sub-
$L.errcode                              Number     function to call, in this
$L.targetfile                           String     case "fileinit".
$L.sourcefile                           String
                                                   The number of the error
                                                   code encountered.

                                                   The target file in which
                                                   to initialize the variable.

                                                   The source file that
                                                   contains the variable.

Factors

     The file initialized is identified by the $sourcefile variable.
     The current record for $targetfile is the same as the current record in
      $sourcefile .
     Update and delete operations can't be performed against $targetfile .

Example

$L.void=rtecall("fileinit", $L.errcode, $file.old, $file)



1.2.4.3.7. rtecall("filldate") function

A RAD function that places the current date and time in a field in the current record.
Function
rtecall("filldate")
Format

$L.success.flg= rtecall($L.fnc.name, $L.return.code, $L.file,
$L.field.name)

Parameters
The following parameters are valid for the rtecall("filldate") function:

Parameter                               Data type  Description
$L.success.flg                          Logical
$L.fnc.name                             String     Indicates if the function
                                                   was successful.
$L.return.code                          Number
$L.file                                 File       The name of the sub-
$L.field                                String     function to call, in this
                                                   case "filldate".

                                                   Provides a more detailed
                                                   return code.

                                                   The file handle.

                                                   The name of the field to
                                                   be updated.

Factors

If the $L.success.flg is false , the function failed. If it is true , the function
succeeded.

Example


$L.file={[, , {}, , , {}, , , {}, , , {}, , , {}, {}, {}, {{[, ,
, ]}}, , , ]} where the first field is
named "date"
$L.field.name="date"
$L.success.flg= rtecall("filldate", $L.return.code, $L.file,
$L.field.name)
$L.file returns ={[‘04/14/2000 08:27:19’, , {}, , , {}, , , {},
, , {}, , , {}, {}, {}, {{[, , , ]}}, , ,
]}


1.2.4.3.8. rtecall("getnumber") function

A RAD function that replaces the getnumb RAD application.
Function
rtecall("getnumber")
Format

$L.flg=rtecall($L.fnc.name, $L.return.code, $L.number, $L.class,
$L.field)

Parameters
The following parameters are valid for the rtecall("getnumber") function:

Parameter                               Data type  Description
$L.flg                                  Logical
                                                   The value is true for
$L.fnc.name                             String     success and false if an
                                                   error occurs.
$L.return.code                          Number
                                                   The name of the sub-
$L.number                               String     function to call, in this
$L.class                                String     case "getnumber".
$L.field                                String
                                                   The value is zero ( 0 ) if
                                                   everything is correct,
                                                   negative one ( -1 ) if an
                                                   error occurs. This is
                                                   related directly to $L.flg.

                                                   The number or string
                                                   returned

                                                   The class of number for
                                                   which you are searching
                                                   (from the number file).

                                                   Reserved for future use.


Factors

A sequential overview:

   1. The function establishes a lock called "getnumb"+$L.class+$L.field and waits
     until the lock is established.

   2. If the number class is not found, or if there are duplicates, the following error
     displays: ($L.flg=false)

   3. The function reads the current number.
   4. The function increments or decrements by the step value. The step defaults to

     one ( 1 ).
   5. If incrementing and the number is greater than the reset value, it uses the start

     number. Start defaults to zero ( 0 ).

   6. A new field called string.flg.

           If string.flg is false , it remains a numeric type.
           If string.flg is true , the number is converted to a string.
           If string.flg is unknown , or the field isn’t in the database dictionary (not
           added during an upgrade), the function checks for a prefix, a suffix, or
           length. If any one of these exists, the function converts the value to a
           string. If none of these exist the function leaves the value as a number.
   7. To convert the value to a string, the function uses the prefix, corrects the length
     of the number (padded with zeros on the left), and then adds the suffix.
   8. The function eventually saves the new number to the file and returns it to the
     user, converted to a string if necessary.
   9. Finally, it unlocks and returns.


1.2.4.3.9. rtecall("getprimary") function

A RAD function that returns an array containing the primary key values for a current
record. The keys can later be used to retrieve the record using the rtecall("getrecord")
function. This function can only be used against tables that have a primary key.
Otherwise, error code 2 is returned.

Function

rtecall("getprimary")

Format

$L.void=rtecall($L.fnc.name, $L.errcode, $L.array, $L.file)

Parameters
The following parameters are valid for the rtecall("getprimary") function:

Variable/Value                          Description
$L.void = true
                                        If key values are returned in
$L.void= false                          $L.keyvalues. For example, if $L.file
                                        represents a current database record.
$L.errcode = 0
$L.errcode = 1                          If no key values are returned. For
$L.errcode = 2                          example, if $L.file doesn't represent a
$L.file                                 current database record.

                                        The function succeeded.

                                        The $L.file doesn't represent a file
                                        variable.

                                        The file identified by $L.file doesn't
                                        have a primary key defined.

                                        The file variable initialized by the rinit
                                        command panel and containing a
                                        current record.


Factors
$L.keyvalues is an output variable. The output returns an array containing the
primary key values for the record in $L.file. For example, if $L.file is for the problem
table, an example of the key values returned in $L.keyvalues is {"IM1001",1} .
Example

  $L.void = rtecall( "getprimary", $L.errcode, $L.keyvalues,
  $L.file )


1.2.4.3.10. rtecall("getrecord") function

A RAD function that retrieves the record identified by Unique key values in $L.array.
Function
rtecall("getrecord")
Format

$L.void=rtecall($L.fnc.name, $L.errcode, $L.array, $L.file)

Parameters
The following parameters are valid for the rtecall("getrecord") function:

Parameter                               Data type  Description
$L.fnc.name                             String
                                                   The name of the sub-
$L.errcode                              Number     function to call, in this
$L.array                                String     case "getrecord".
$L.file                                 String
                                                   The number of the error
                                                   code encountered.

                                                   The name of the record
                                                   to retrieve.

                                                   The name of the table to
                                                   retrieve the record from.

Factors

$L.array is an input variable, typically the key values returned by $L.array in the
rtecall("getunique") function.

Example

  $L.void=rtecall("getrecord", $L.errcode, {"IM1001"}, $L.file)

Where:


The value of $L.file is initialized for the probsummary table.
````
