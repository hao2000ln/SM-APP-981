---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.2.4.3.11 .. 1.2.4.3.24
printed_pages: 1354-1380
---

# 1.2.4.3.11 rtecall("getunique") function

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.4.3.11. rtecall("getunique") function

A RAD function that returns an array containing the Unique key values for a current
record. The keys can later be used to retrieve the record using the rtecall("getrecord")
function.

Function

rtecall("getunique")

Format

$L.void=rtecall($L.fnc.name, $L.errcode, $L.array, $L.file)

Parameters
The following parameters are valid for the rtecall("getunique") function:

Variable/Value                          Description
$L.void = true
                                        If key values are returned in
$L.void = false                         $L.keyvalues. For example, if $L.file
                                        represents a current database record.
$L.errcode = 0
$L.errcode = 1                          If no key values are returned. For
$L.errcode = 2                          example, if $L.file doesn't represent a
$L.file                                 current database record.

                                        The function succeeded.

                                        The $L.file doesn't represent a file
                                        variable.

                                        The file identified by $L.file doesn't
                                        have a Unique key defined.

                                        The file variable initialized by the rinit
                                        command panel and containing a
                                        current record.

Factors


$L.keyvalues is an output variable. The output returns an array containing the unique
key values for the record in $L.file. For example, if $L.file is for the problem table, an
example of the key values returned in $L.keyvalues is {"IM1001",1} .
Example

  $L.void = rtecall( "getunique", $L.errcode, $L.keyvalues,
  $L.file )


1.2.4.3.12. rtecall("isalnum") function

A RAD function that verifies that a string contains only alphabetic, numeric, or the
non-alphabetic characters provided.

Function

rtecall("isalnum")

Format

$L.success.flag= rtecall ($L.fnc.name, $L.return.code, $L.str,
$L.chars)

Parameters
The following parameters are valid for the rtecall("isalnum") function:

Parameter                               Data type  Description
$L.success.flg                          Logical
$L.fnc.name                             String     Indicates if the function
                                                   was successful.
$L.return.code                          Number
$L.str                                  String     Name of the sub-
$L.chars                                String     function to call, in this
                                                   case "isalnum".

                                                   Provides a more detailed
                                                   return code.

                                                   The string to be
                                                   checked.

                                                   An optional comma-
                                                   delimited string of non-
                                                   numeric characters to
                                                   allow.

Factors

If the $L.success.flg is false , the function failed. If it is true , the function
succeeded.


Example

    $L.success.flag=true
  $L.return.code=0
  $L.str=phone in $L.file
  $L.chars=" , (, ), -"
  $L.success.flag=rtecall("isalnum", $L.return.code, $L.str,
  $L.chars)

Results:
     When phone in $L.file="(508) 362.2701" , $L.success.flag is false .
     When phone in $L.file="(508) 362-2701" , $L.success.flag is true .


1.2.4.3.13. rtecall("isalpha") function

A RAD function that verifies that a string contains only alphabetic characters or only
alphabetic characters and the non-alphabetic characters provided.

Function

rtecall("isalpha")

Format

$L.success.flag= rtecall ($L.fnc.name, $L.return.code, $L.str,
$L.chars)

Parameters
The following parameters are valid for the rtecall("isalpha") function:

Parameter                               Data type  Description
$L.success.flg                          Logical
                                                   Indicates whether or not
$L.fnc.name                             String     the function was
                                                   successful.
$L.return.code                          Number
$L.str                                  String     The name of the sub-
$L.chars                                String     function to call, in this
                                                   case "isalpha".

                                                   Provides a more detailed
                                                   return code.

                                                   The string to be
                                                   checked.

                                                   An optional comma-
                                                   delimited string of non-
                                                   alphabetic characters to
                                                   allow.

Factors


If the $L.success.flg is false , the function failed. If it is true , the function
succeeded.
Example

    $L.success.flag=true
  $L.return.code=0
  $L.str=name in $L.file
  $L.chars=" "
  $L.success.flag=rtecall("isalpha", $L.return.code, $L.str,
  $L.chars)

Results:
     When name in $L.file="my name" $L.success.flag is true .
     When name in $L.file="my first name" $L.success.flag is true .
     When name in $L.file="my 1st name" $L.success.flag is false .


1.2.4.3.14. rtecall("islower") function

A RAD function that verifies that a string contains only lowercase characters, or only
lowercase characters and the provided non-lowercase characters.

Function

rtecall("islower")

Format

$L.success.flag= rtecall ($L.fnc.name, $L.return.code, $L.str,
$L.chars)

Parameters
The following parameters are valid for the rtecall("islower") function:

Parameter                               Data type  Description
$L.success.flg                          Logical
$L.fnc.name                             String     Indicates if the function
                                                   was successful.
$L.return.code                          Number
$L.str                                  String     Name of the sub-
$L.chars                                String     function to call, in this
                                                   case "islower".

                                                   Provides a more detailed
                                                   return code.

                                                   The string to be
                                                   checked.

                                                   An optional comma-
                                                   delimited string of non-
                                                   lowercase characters to
                                                   allow.

Factors

If the $L.success.flg is false , the function failed. If it is true , the function
succeeded.


Example

    $L.success.flag=true
  $L.return.code=0
  $L.str=name in $L.file
  $L.chars=" "
  $L.success.flag=rtecall("islower", $L.return.code, $L.str,
  $L.chars)

Results:

     When name in $L.file="b1b" , $L.success.flag is false .
     When name in $L.file="Bob" , $L.success.flag is false .
     When name in $L.file="bob" , $L.success.flag is true .


1.2.4.3.15. rtecall("isnumeric") function

A RAD function that verifies that a string contains only numeric characters, or only
numeric characters and the provided non-numeric characters.

Function

rtecall("isnumeric")

Format

$L.success.flag= rtecall ($L.fnc.name, $L.return.code, $L.str,
$L.chars)

Parameters
The following parameters are valid for the rtecall("isnumeric") function:

Parameter                               Data type  Description
$L.success.flg                          Logical
$L.fnc.name                             String     Indicates if the function
                                                   was successful.
$L.return.code                          Number
$L.str                                  String     Name of the sub-
$L.chars                                String     function to call, in this
                                                   case "isnumeric".

                                                   Provides a more detailed
                                                   return code.

                                                   The string to be
                                                   checked.

                                                   An optional comma-
                                                   delimited string of non-
                                                   numeric characters to
                                                   allow.

Factors

If the $L.success.flg is false , the function failed. If it is true , the function
succeeded.


Example

    $L.success.flag=true
  $L.return.code=0
  $L.str=name in $L.file
  $L.chars="-,+,*,/,%,$"
  $L.success.flag=rtecall("isnumeric", $L.return.code, $L.str,
  $L.chars)

Results:

     When name in $L.file="B1B" , $L.success.flag is false .
     When name in $L.file="Bob" , $L.success.flag is false .
     When name in $L.file="36" , $L.success.flag is true .


1.2.4.3.16. rtecall("isupper") function

A RAD function that verifies that a string contains only uppercase characters, or only
uppercase characters and the provided non-uppercase characters.

Function

tecall("isupper")

Format

$L.success.flag= rtecall ($L.fnc.name, $L.return.code, $L.str,
$L.chars)

Parameters
The following parameters are valid for the rtecall("isupper") function:

Parameter                               Data type  Description
$L.success.flg                          Logical
$L.fnc.name                             String     Indicates if the function
                                                   was successful.
$L.return.code                          Number
$L.str                                  String     Name of the sub-
$L.chars                                String     function to call, in this
                                                   case "isupper".

                                                   Provides a more detailed
                                                   return code.

                                                   The string to be
                                                   checked.

                                                   An optional comma-
                                                   delimited string of non-
                                                   upper case characters to
                                                   allow.

Factors

If the $L.success.flg is false , the function failed. If it is true , the function
succeeded.


Example

    $L.success.flag=true
  $L.return.code=0
  $L.str=name in $L.file
  $L.chars=" "
  $L.success.flag=rtecall("isupper", $L.return.code, $L.str,
  $L.chars)

Results:

     When name in $L.file="B1B" , $L.success.flag is false .
     When name in $L.file="Bob" , $L.success.flag is false .
     When name in $L.file="BOB" , $L.success.flag is true .


1.2.4.3.17. rtecall("log") function

A RAD function that sends a message to the external sm.log file.
Function
rtecall("log")
Format

$L.success.flg=rtecall($L.fnc.name, $L.return.code, $L.message)

Parameters
The following parameters are valid for the rtecall("log") function:

Parameter                               Data type  Description
$L.success.flg                          Logical
                                                   Indicates whether or not
$L.fnc.name                             String     the function was
                                                   successful.
$L.return.code                          Number
$L.message                              String     The name of the sub-
                                                   function to call, in this
                                                   case "log".

                                                   Provides a more detailed
                                                   return code.

                                                   The message to be sent.

Factors

If the $L.success.flg is false , the function failed. If it is true , the function
succeeded.

Example

  $L.success.flg=rtecall("log", $L.return.code, "This is a new
  message")

Generates the last line in the following example in sm.log:


     137 04/12/2000 07:03:44 System background scheduler: event
started at:
04/11/2000 23:02:48.

     137 04/12/2000 07:03:45 System background scheduler:
availability started at:
04/11/2000 23:02:49.

     137 04/12/2000 07:03:45 System background scheduler: contract
started at:
04/11/2000 23:02:50.

     137 04/12/2000 07:03:45 System background scheduler: ocm
started at:
04/11/2000 23:02:51.

     137 04/12/2000 07:03:45 System startup completed
successfully, elapsed time:
00:00:18.

     137 04/12/2000 07:32:48 24 records from location unloaded to:
locations.save,
00:00:01 elapsed.

     306 04/12/2000 09:05:09 This is a new message


1.2.4.3.18. rtecall("passchange") function

A RAD function that changes a user password.
Function
rtecall("passchange")
Format

$L.success.flag=rtecall($L.fnc.name, $L.return.code,
$L.old.pass, $L.new.pass,
$L.confirm.pass)

Parameters
The following parameters are valid for the rtecall("passchange") function:

Parameter                               Data type  Description
$L.success.flg                          Logical
                                                   Indicates if the function
$L.fnc.name                             String     was successful.

$L.return.code                          Number     Name of the sub-
                                                   function to call. In this
$L.old.pass                             String     case, the sub-function
$L.new.pass                             String     called is passchange.
$L.confirm.pass                         String
                                                   Provides a more detailed
                                                   return code.

                                                   The old password.

                                                   The new password.

                                                   A confirmation of the
                                                   new password.

Factors

If the $L.success.flg is false , the function failed. If it is true , the function
succeeded.


Example

$L.success.flg= rtecall("passchange", $L.return.code,
"oldpassword",
"newpassword", "newpassword")


1.2.4.3.19. rtecall("policycheck") function

A RAD function that imposes data policy as defined in the System Definition.
Function
rtecall("policycheck")
Format

$L.success.flag= rtecall($L.fnc.name, $L.return.code, $L.file)

Parameters
The following parameters are valid for the rtecall("policycheck") function:

Parameter                               Data type  Description
$L.success.flg                          Logical
$L.fnc.name                             String     Indicates if the function
                                                   was successful.
$L.return.code                          Number
$L.file                                 String     Name of the sub-
                                                   function to call, in this
                                                   case "policycheck".

                                                   Provides a more detailed
                                                   return code.

                                                   The file handle.

Factors

If the $L.success.flg is false , the function failed. If it is true , the function
succeeded.

Example

$L.rc=rtecall("policycheck", $L.errcode, $L.filed)


1.2.4.3.20. rtecall("qbeform") function

A RAD function that returns a record list form, which can be passed into a rio (Record
Display/Input) Command panel or fdisp panel. You can insert this function into a
format file handle using the contents() function. The following example shows the
syntax to use in the contents function: contents($L.format) = $L.qbe.form .
Function
rtecall("qbeform")
Format

  $L.success.flg=
  rtecall($L.fnc.name,$L.return.code,$L.file,$L.qbe.form)

Parameters
The following parameters are valid for the rtecall("qbeform") function:


Parameter                               Data type  Description
$L.success.flg                          Logical
                                                   Indicates whether or not
$L.fnc.name                             String     the function was
                                                   successful.
$L.return.code                          Number
$L.file                                 File       The name of the
                                                   subfunction to call; in
$L.qbe.form                             Structure  this case "qbeform".

                                                   Provides a more detailed
                                                   return code.

                                                   The file handle used to
                                                   generate the record list.
                                                   For example, obtain the
                                                   contacts table by using
                                                   the "rinit" panel.

                                                   The resulting record list
                                                   form returned as a
                                                   structure.

Factors

If the $L.success.flg is false , the function failed. If it is true , the function
succeeded.

Example

$L.success.flg=
rtecall("qbeform",$L.return.code,$L.file,$L.qbe.form)


1.2.4.3.21. rtecall("recdupl") function

A RAD function that copies the contents of the current record into the contents of
another record.

Function

rtecall("recdupl")

Format

rtecall($L.fnc.name, $return.code, $targetfile, $sourcefile)

Parameters
The following parameters are valid for the rtecall("recdupl") function:

Parameter                               Data type  Description
$L.fnc.name                             String
                                                   Name of the sub-
$L.return.code                          Number     function to call, in this
$targetfile                             String     case "recdupl".
$sourcefile                             String
                                                   Provides a more detailed
                                                   return code.

                                                   The target record to
                                                   which fields are copied.

                                                   The source file from
                                                   which fields are copied.

Factors

     Both $targetfile and $sourcefile must have identical descriptors. Data is
     copied by position, not field name.
     Both $targetfile and $sourcefile must be initialized file variables.
     The update and delete operations can't be performed against $targetfile .

Example


$L.flg=rtecall("recdupl", $L.return.code, $L.temp, $L.file)


1.2.4.3.22. rtecall("recordexists")
function

Specifies whether any records exist that match a particular query regardless of any
Mandanten data restrictions. This call doesn't return any records from the query.
Function
rtecall("recordexists")
Format

  $Lexists=rtecall("recordexists", $L.rc, $L.filename, $L.query)

Parameters
The following parameters are valid for the rtecall("recordexists") function:


Parameter                               Data type  Description
"recordexists"                          String
                                                   Determines the name of
$L.rc                                   String     the RTE call, in this case
                                                   "recordexists".
$L.filename                             String
$L.query                                String     Provides a more detailed
                                                   return code. This
                                                   parameter is not
                                                   currently used but is
                                                   reserved for future use.

                                                   The name of the Service
                                                   Manager table to query.
                                                   For example, contacts or
                                                   probsummary.

                                                   The query to be run. The
                                                   query can be true, false,
                                                   a string, or a parsed
                                                   expression. This query
                                                   ignores all Mandanten
                                                   restrictions.

Factors
The call returns true if at least one record matches the query.
The call returns false if there are no records that match the query.
Example

  rtecall( "recordexists", $L.rc, "contacts", true )

Returns true if there are any records in the contacts table.

  rtecall( "recordexists", $L.rc, "device",
  "logical.name=\"pc001\"" )

Returns true if there is a record in the device table with a logical name of pc001
regardless of whether the current user has access to the record or not.



1.2.4.3.23. rtecall("refresh") function

This function retrieves the most current value of a record from the database and
returns it in the file variable.

Function

rtecall("refresh")

Format

$L.success.flg=rtecall("refresh", $L.errcode, $L.file)

Parameters
The following parameters are valid for the rtecall("refresh") function:

Variable/Value                          Description
$L.errcode = 0
$L.errcode = 1                          The function succeeded.

$L.file                                 The $L.file doesn't represent a file
                                        variable.

                                        The file variable initialized by the rinit
                                        command panel. It contains the current
                                        record.

Factors
If the $L.success.flg is false , the function failed. It is true , the function succeeded.
Example

$L.success.flg = rtecall( "refresh", $L.errcode, $L.file )


1.2.4.3.24. rtecall("resetnotebook")
function

A RAD function that adds an XML attribute "resetnotebook=true" to the "execute"
response of the current RAD thread. The Service Manager client will set the active
page of a notebook to its first page when this XML attribute is present.
Function
rtecall("resetnotebook");
Format

  system.functions.rtecall("resetnotebook", ret, 0);

Parameters
This function has no parameters.
Factors
This function always returns RC_SUCCESS.
Example

  var ret = RC_SUCCESS;

  system.functions.rtecall("resetnotebook", ret, 0);
````
