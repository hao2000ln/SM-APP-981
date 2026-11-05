---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.2.4.3.25 .. 1.2.4.3.35
printed_pages: 1380-1404
---

# 1.2.4.3.25 rtecall("rfirst") function

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.4.3.25. rtecall("rfirst") function

A RAD function that places the pointer at the first record in a record list.
Function
rtecall("rfirst")
Format

$L.success.flg=rtecall($L.fnc.name, $L.return.code, $L.file)

Parameters
The following parameters are valid for the rtecall("rfirst") function:

Parameter                               Data type  Description
$L.success.flg                          Logical
$L.fnc.name                             String     Indicates if the function
                                                   was successful.
$L.return.code                          Number
$L.file                                 File       The name of the sub-
                                                   function to call, in this
                                                   case "rfirst".

                                                   Provides a more detailed
                                                   return code.

                                                   A file handle that
                                                   represents the collection.

Factors

If the $L.success.flg is false , the function failed. If it is true , the function
succeeded.

Example

$L.success.flg=rtecall("rfirst",$L.return.code, $L.file)


1.2.4.3.26. rtecall("rgoto") function

A RAD function that places the pointer at the indicated record.id in a record list.
Function
rtecall("rgoto")
Format

$L.success.flg=rtecall($L.fnc.name, $L.return.code, $L.file,
$L.record.id)

Parameters
The following parameters are valid for the rtecall("rgoto") function:

Parameter                               Data type  Description
$L.success.flg                          Logical
                                                   Indicates whether or not
$L.fnc.name                             String     the function was
                                                   successful.
$L.return.code                          Number
$L.file                                 File       The name of the sub-
$L.record.id                            Number     function to call, in this
                                                   case "rgoto".

                                                   Provides a more detailed
                                                   return code.

                                                   A file handle that
                                                   represents the collection.

                                                   A record number.

Factors

If the $L.success.flg is false , the function failed. If it is true , the function
succeeded.

Example


$L.success.flg=rtecall("rgoto",$L.return.code, $L.file,
$L.record.id)


1.2.4.3.27. rtecall("rid") function

A RAD function that returns the record number of the current record, as represented
by $L.file.

Function

rtecall("rid")

Format

$L.success.flg=rtecall($L.fnc.name, $L.return.code, $L.file,
$L.record.id)

Parameters
The following parameters are valid for the rtecall("rid") function:

Parameter                               Data type  Description
$L.success.flg                          Logical
                                                   Indicates whether or not
$L.fnc.name                             String     the function was
                                                   successful.
$L.return.code                          Number
$L.file                                 File       The name of the sub-
$L.record.id                            Number     function to call, in this
                                                   case "rid".

                                                   Provides a more detailed
                                                   return code.

                                                   A file handle that
                                                   represents the collection.

                                                   A record number.

Factors

If the $L.success.flg is false , the function failed. If it is true , the function
succeeded.

Example


$L.success.flg=rtecall("rid",$L.return.code, $L.file,
$L.record.id)


1.2.4.3.28. rtecall("scantable") function

A RAD function that scans the specified table for certain types of invalid records and
fixes the records.
Function
rtecall("scantable")
Format
$L.success.flg=rtecall($L.fnc.name, $return.code, $scantype, $tablename, $bfix,
$columns)
$L.success.flg=rtecall($L.fnc.name, $return.code, $scantype, $tablename, $bfix,
$totalnum, $fixed, $deleted)
Parameters
The following parameters are valid for the rtecall("scantable") function:

Parameter                               Data type                          Service Manager 9.81
$L.success.flg                          Logical
$L.fnc.name                             String     Description

$L.return.code                          Number     Indicates if the function
$scantype                               Number     was successful.

$L.tablename                            String     Name of the sub-
$bfix                                   Bool       function to call. In this
                                                   case, "scantable".
This PDF was generated on May 23, 2026
                                                   Provides a more detailed
                                                   return code.

                                                   Specifies the type of
                                                   scan the function will
                                                   perform, which can be
                                                   one of the following:

                                                        1 - to scan for
                                                        duplicate records
                                                        on specified
                                                        columns
                                                        2 - to scan for null
                                                        values on non-
                                                        nullable fields, such
                                                        as fields with a
                                                        "Unique" or "No
                                                        Nulls" key applied
                                                        3 - to scan for
                                                        values whose data
                                                        types don't match
                                                        the data type
                                                        defined on the field

                                                   The name of the table to
                                                   be scanned.

                                                   Specifies whether to
                                                   automatically fix the
                                                   invalid data.

                                                                                                 Page 51 of 269

Parameter                               Data type     Description
$columns                                String array
                                                      Only available when
$totalnum                               Number        $scantype is 1, specifies
$fixed                                  Number        the columns on which
$deleted                                Number        the function will scan for
                                                      duplicate records.

                                                      Indicates the number of
                                                      the invalid records that
                                                      were found.

                                                      Indicates the number of
                                                      the invalid records that
                                                      were fixed.

                                                      Indicates the number of
                                                      the records that were
                                                      removed.

Factors

If the $L.success.flg is false , the function failed. If it is true , the function
succeeded.

$totalnum, $fixed, and $deleted are available when $scantype is 2 or 3. This total
number should include $fixed, $deleted, and the number of invalid records that failed
to be fixed.

Examples

The following function call scans the ioaction table for duplicate records on the field1
and field2 fields and fixes the duplicate records.

  $L.flg=rtecall("scantable", $L.return.code, 1, "ioaction", true,
  {"field1","field2"})

The following function call scans the ioaction table for null values that are disallowed
by keys.


  $L.flg=rtecall("scantable", $L.return.code, 2, "ioaction", true,

  $all, $fixed, $deleted)

Additional information

If you choose to fix invalid data by setting $bfix to 1:

     In a "type-1" scan, the function differentiates duplicate items by appending
     suffixes such as -dup1, -dup2...-dupx.
     In a "type-2" scan, the following behaviors occur:

           The function removes the record if null values violate a "Unique" key.
           Or the function replaces the first of the null values with a default value if
           null values violate a "No Nulls" key.
     In a "type-3" scan, the following behaviors occur:
           The function converts the value into the correct data type if the value data
           makes sense in the target data type.
           The function replaces the value with a default value in the correct data
           type.


1.2.4.3.29. rtecall ("select") function

A RAD function that retrieves a list of records for a file in ascending or descending
order according to the specified sort fields and group fields.
Function
rtecall("select")
Format

  $L.success.flg=rtecall($L.fnc.name, $L.return.code, $L.file,
  $L.query, $L.sortfields, $L.sorttype, $L.groupfields,
  $L.groupsorttype, $L.columns)

Parameters
The following parameters are valid for the rtecall("select") function:

Parameter                               Data Type                          Service Manager 9.81
$L.success.flg                          Logical
$L.fnc.name                             String     Description

$L.return.code                          Number     Indicates whether the
                                                   function is successful or
$L.file                                 File       not.
$L.query                                String
$L.sortfields                           Array      Name of the sub-
$L.sorttype                             Logical    function to call. This
                                                   parameter is "select" in
This PDF was generated on May 23, 2026             this case.

                                                   Provides a more detailed
                                                   return code:

                                                        1: Only one record
                                                        found
                                                        2: Multiple records
                                                        found
                                                        3: No records were
                                                        found
                                                        4: Query reached a
                                                        timeout

                                                   A file handle that
                                                   represents the record
                                                   list.

                                                   The query condition for
                                                   retrieving records.

                                                   The array of fields which
                                                   the record list is sorted
                                                   by.

                                                   The sorting order. true
                                                   is descending, and
                                                   false is ascending. By
                                                   default, this value is
                                                   false .

                                                                                                 Page 55 of 269

Parameter                               Data Type  Description
$L.groupfields                          Array
                                                   The array of fields which
$L.groupsorttype                        Logical    the record list is grouped
                                                   by.
$L.columns                              Array
                                                   The sorting order for
                                                   group fields. true is
                                                   descending, and false
                                                   is ascending. By default,
                                                   this value is false .

                                                   The array of the selected
                                                   fields of the file.

Factors

     If $L.success.flg is false , the function fails. If $L.success.flg is true , the
     function succeeds.
     The parameters after $L.query are optional.

Example

$L.success.flg=rtecall("rinit", $L.return.code, $L.operator, "operator");

$L.success.flg=rtecall("select", $L.return.code, $L.operator,
"contact.name=contact.name in $L.file", {"last.login"}, false, {"company"}, false,
{"name", "contact.name", "company"});


1.2.4.3.30. rtecall ("setdebug") function

A RAD function that sets the debug parameters.
Function
rtecall("setdebug")
Format

$L.success.flag= rtecall($L.fnc.name, $L.return.code,
$L.debug.parameter)

Parameters
The following parameters are valid for the rtecall("setdebug") function:

Parameter                               Data Type  Description
$L.success.flag                         Logical
                                                   Indicates whether the
$L.fnc.name                             String     function is successful or
                                                   not.
$L.return.code                          Number
$L.debug.parameter                      Number     The name of the sub-
                                                   function to call. This
                                                   parameter is "select" in
                                                   this case.

                                                   Provides a more detailed
                                                   return code.

                                                   The debug parameters to
                                                   set.

Factors
If $L.success.flg is false , the function fails. If $L.success.flg is true , the function
succeeds.

Example
$L.success.flg=rtecall("setdebug", $L.return.code, "sqldebug:1 rtm:3")


This example sets sqldebug to 1 and rtm to 3 in current session.


1.2.4.3.31. rtecall("sort") function

A RAD function that sorts a list or a list of lists in ascending or descending order.
Function
rtecall("sort")
Format
$L.success.flg=rtecall($L.fnc.name, $L.return.code, $L.grid, $L.index, $L.type,
$L.nulls)
Parameters
The following parameters are valid for the rtecall("sort") function:


Parameter                               Data type  Description
$L.success.flg                          Logical
                                                   Indicates whether or not
$L.fnc.name                             String     the function was
                                                   successful.
$L.return.code                          Number
$L.grid                                 Array      Name of the sub-
$L.index                                Number     function to call, in this
                                                   case "sort".
$L.type                                 Number
                                                   Provides a more detailed
$L.nulls                                Number     return code.

                                                   The list or list of lists to
                                                   be sorted.

                                                   The index of the array in
                                                   the grid to use as the
                                                   sort field. A zero ( 0 ) is
                                                   the first element of the
                                                   array.

                                                   The type of sort to
                                                   perform. Use zero ( 0 )
                                                   for an ascending sort or
                                                   one ( 1 ) for a
                                                   descending sort.

                                                   Specifies how the
                                                   function should sort null
                                                   values. Use one ( 1 ) to
                                                   sort null values at the
                                                   end of the list or zero
                                                   ( 0 ) to sort values at the
                                                   start of the list.

Factors

If the $L.success.flg is false , the function failed. If it is true , the function
succeeded.

Examples


$L.list={29, 2, 72, 42}
$L.success.flg=rtecall("sort", $L.return.code, $L.list, 1, 0)
Returns: $L.list={2, 29, 42, 72}

$L.list={29, 2, 72, 42}
$L.success.flg=rtecall("sort", $L.return.code, $L.list, 1, 1)
Returns: $L.list={72, 42, 29, 2}

$L.list={29, 2, , 72, 42}
$L.success.flg=rtecall("sort", $L.return.code, $L.list, 1, 0, 1)
Returns: $L.list={2, 29, 42, 72, }

$L.list={29, 2, , 72, 42}
$L.success.flg=rtecall("sort", $L.return.code, $L.list, 1, 0, 0)
Returns: $L.list={, 2, 29, 42, 72}

$L.list={{"a", "b", "d", "c"},{1, 3, 4, 2}}
$L.success.flg=rtecall("sort", $L.return.code, $L.list, 1, 0)
Returns: $L.list= {{"a", "c", "b", "d"}, {1, 2, 3, 4}}

$L.list={{"a", "b", "d", "c"},{1, 3, 4, 2}}
$L.success.flg=rtecall("sort", $L.return.code, $L.list, 1, 1)
Returns: $L.list={{"d", "b", "c", "a"}, {4, 3, 2, 1}}

$L.list={{"a", "b", "d", "c"},{1, 3, 4, 2}}
$L.success.flg=rtecall("sort", $L.return.code, $L.list, 0, 0)
Returns: $L.list={{"a", "b", "c", "d"}, {1, 3, 2, 4}}

$L.list={{"a", "b", "d", "c"},{1, 3, 4, 2}}
$L.success.flg=rtecall("sort", $L.return.code, $L.list, 0, 1)
Returns: $L.list={{"d", "c", "b", "a"}, {4, 2, 3, 1}}


1.2.4.3.32. rtecall("statusupdate")
function

A RAD function that dynamically changes the caption of a widget on the current
format. The widget must have a name property specified. This function is commonly
used to update the format during a long-running transaction to inform the user of the
status of the current operation. For example, converting a file to an RDBMS.

Function

rtecall("statusupdate")

Format

$L.success.flag = rtecall($L.func.name, $L.return.code, $L.widget.name,
$L.widget.caption)

Parameters

The following parameters are valid for the rtecall("statusupdate") function:

Parameter                               Data type  Description
$L.widget.name                          String
                                                   The name of the form
$L.widget.caption                       String     widget, as specified in
                                                   the name property of the
                                                   widget.

                                                   A string to be displayed
                                                   in the widget.

Factors

If the $L.success.flg is false , the function failed. If it is true , the function
succeeded.

Example

$L.success.flg = rtecall("statusupdate", $L.return, "MyScrollingMarqueeWidget",
"The end user will see this text in the marquee" )


1.2.4.3.33. rtecall("transtart") function

A RAD function that measures the amount of data transferred, elapsed time, and CPU
usage of any transaction. This function is commonly invoked from the RAD debugger
and used in conjunction with the rtecall ("transtop") function.

Function
     rtecall("transtart")

Format
     $L.success.flag= rtecall($L.fnc.name, $L.return.code, $L.transaction)

Parameters

The following parameters are valid for the rtecall("transtart") function:

Parameter                               Data type  Description
$L.success.flg                          Logical
                                                   Indicates whether or not
$L.fnc.name                             String     the function was
                                                   successful.
$L.return.code                          Number
$L.transaction                          String     Name of the sub-
                                                   function to call, in this
                                                   case "transtart".

                                                   Provides a more detailed
                                                   return code.

                                                   Any name selected by
                                                   the user for the
                                                   transaction to measure.

Factors

If the $L.success.flg is false , the function failed. If it is true , the function
succeeded.

Example

$L.success.flg= rtecall("transtart", $L.return, "problemopen")


1.2.4.3.34. rtecall("transtop") function

A RAD function that measures the amount of data transferred, elapsed time, and CPU
usage of any transaction. The function is commonly invoked from the RAD debugger
and used in conjunction with the rtecall("transtart") function.

     The CPU time is retrieved from the server machine.
     You can have multiple transaction timings active at the same time.
Function
rtecall("transtop")
Format

  $L.success.flag= rtecall($L.fnc.name, $L.return.code,
  $L.transaction, $results)

Parameters
The following parameters are valid for the rtecall("transtop") function:


Parameter                               Data type  Description
$L.success.flg                          Logical
$L.fnc.name                             String     Indicates whether or not
$L.return.code                          Number     the function was
$L.transaction                          String     successful.
$L.$results                             Array
                                                   Name of the sub-
                                                   function to call, in this
                                                   case "transtop".

                                                   Provides a more detailed
                                                   return code.

                                                   Any name selected by
                                                   the user for the
                                                   transaction to measure.

                                                   The results gathered, in
                                                   the form of an array:
                                                   {elapsed seconds, cpu
                                                   seconds, 0, 0, 0} .
                                                   Service Manager no
                                                   longer keeps track of the
                                                   third, fourth, and fifth
                                                   value in the array and it
                                                   always reports as zero.

Factors

If the $L.success.flg is false , the function failed. If it is true , the function
succeeded.

Example

  $L.success.flg=rtecall("transtop", $L.return.code,
  "problemopen", $results)
  $results={58.164, 0.961, 0, 26712, 2477}

This example shows that the problemopen transaction took 58.164 seconds of real
time and 0.961 CPU seconds.



1.2.4.3.35. rtecall("trigger") function

A RAD function that turns triggers on or off for the current session. Other Service
Manager users aren't affected.

Function

rtecall("trigger")

Format

$L.success.flag= rtecall($L.fnc.name, $L.return.code, $L.switch)

Parameters
The following parameters are valid for the rtecall("trigger") function:

Parameter                               Data type  Description
$L.success.flg                          Logical
$L.fnc.name                             String     Indicates if the function
                                                   was successful.
$L.return.code                          Number
$L.switch                               Number     Name of the sub-
                                                   function to call, in this
                                                   case "trigger".

                                                   Provides a more detailed
                                                   return code.

                                                   The value is either one
                                                   ( 1 ) to turn triggers on.
                                                   or zero ( 0 ) to turn
                                                   triggers off.

Factors
     If the $L.success.flg is false , the function failed. If it is true , the function
     succeeded.

Example


$L.success.flg=rtecall("trigger", $L.return.code, 1) to turn
triggers on
$L.success.flg=rtecall("trigger", $L.return.code, 0) to turn
triggers off
````
