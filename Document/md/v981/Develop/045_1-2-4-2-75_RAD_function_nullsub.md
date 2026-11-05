---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.2.4.2.75 .. 1.2.4.2.86
printed_pages: 1213-1237
---

# 1.2.4.2.75 RAD function: nullsub

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.4.2.75. RAD function: nullsub

A RAD function that substitutes a null value with the second value specified.
Function
nullsub
Format

  nullsub(value1,value2)

Where the value2 variable is the value to return if value1 is null.
Examples
nullsub(1,2) returns 1 .
nullsub(NULL,2) returns 2 .
$a=NULL
$a=nullsub($a,"test") returns test .


1.2.4.2.76. RAD function: operator

A RAD function that sets and returns the name of the current operator ID. The
operator function is also used to set the operator name.
Function
operator
Format

  operator()

Factors
The operator() value is set to the value of the login name in the operator record at
the time of login.
Examples

  $a = operator()

  operator() = $a


1.2.4.2.77. RAD function: option

A RAD function that returns the number of the last interrupt key. For example, 0 =
Enter, 1 = first option key, 2 = second option key.
Function
option
Format

  option()

Factors
     The Enter key returns a value of zero (0).
     Use caution when option() is a criteria for a decision or process panel that can
     be accessed from several paths. To avoid conflicts, set a variable to option()
     when the first panel is accessed.
     Clicking a button returns the number defined in the Button ID property.
     Clicking an item in the More menu returns the GUI option number associated
     with this option in the displayoption table.

Example
option() returns 10 .


1.2.4.2.78. RAD function: parse

Parses a string into an operator.
Function
parse
Format

  parse(string,type)

Factors
     An operator can be an expression, such as type<11, or a statement, such as
     type=11.
     When enabled on forms, the parse property automatically parses the data
     entered.

Examples

  $x=parse("1+1",1)

Evaluate($x) returns 2 .

  $x=parse("$x=1",11)

Evaluate($x) causes the value of $x to be set to 1 .


1.2.4.2.79. RAD function: perf

A RAD function that evaluates system performance and then logs this information in
Service Manager's systemperform and systemtotals tables. A value of zero ( 0 )
indicates success, and a value of negative one ( -1 ) indicates failure.
Function
perf
Format

  perf(n)

Where the value of n is the number that corresponds to the option you select.
Parameters
The following table shows the parameters used with the perf function:

 Option                                                                                         Service Manager 9.81
 1
                                        Result
 2
                                        Delete records in the systemtotals and
 3                                      systemperform files where
                                        capture=false before writing new
 4                                      information to disk.
Example
perf(1) Returns zero ( 0 ).             Add records and don't delete. Nothing
                                        is removed before new records are
                                        written to the systemtotals and
                                        systemperform files. Maintenance of
                                        these files is typically the responsibility
                                        of the RAD programmer.

                                        Delete records in the systemtotals and
                                        systemperform files where
                                        capture=false and don't write
                                        information to disk.

                                        Delete all records in the systemtotals
                                        and systemperform files, regardless of
                                        capture status.


1.2.4.2.80. RAD function: printer

A RAD function that sets and returns the value of the currently logged-on printer.
Function
printer
Format

  printer()

Factors
This function is most often used to set the current printer. When an operator logs on,
the login application is executed, assigning printer() to be either the printer specified
by the user at login, or the default printer specified in the operator record for the user.
Example

  $a = printer()

  printer() = $a


1.2.4.2.81. RAD function: policyread

A RAD function that reads the data policy from a datadict table.
Function
policyread
Format

  $L.returnvalue = policyread( $L.file/$filename, fieldname,
  fieldsetting)

Parameters
The following parameters are valid for this function.

Parameter                                                                                       Service Manager 9.81
$L.returnvalue
$L.file/$filename                       Description

fieldname                               The policy value returned after it is
                                        read from the database. It can be a
                                        string, a boolean, or null.

                                        This can be either a file variable or a
                                        file name:

                                        $L.file - The file handle of the table for
                                        which the data policy information is to
                                        be read from the database. It can be a
                                        join table, a normal table or an adhoc
                                        table.

                                        Note: Other kinds of tables (merge
                                        files, etc.) aren't supported.

                                        $filename â€“ The name of the table
                                        for which the data policy information is
                                        to be read from the database. It can be
                                        a normal table only.

                                        Note: All other kinds of tables aren't
                                        supported.

                                        The table name is the value in the
                                        Name field in the datadict record.

                                        The name of the field in the specified
                                        table for which the data policy
                                        information is to be read from the
                                        database.

                                        The field name is the value in the Field
                                        Name field in the datadict record.


fieldsetting                            The field setting on the specified field
                                        for which the data policy information is
                                        to be read from the database.

                                        If no field setting is passed in when
                                        calling policyread function, the function
                                        will return true if the field exists in data
                                        policy, otherwise will return false.

                                        This is one of the fields on Field
                                        Settings tab of the datadict record.

                                        Valid field settings are: "invisible",
                                        "readonly", "mandatory", "captions",
                                        "avail","encrypt", "defaults",
                                        "globallist", "matchfields", "matchfiles",
                                        and "validations", â€?typesâ€?,
                                        â€œreference.tableâ€?.

                                        In addition, there two special settings:
                                        â€œdisplay.fieldâ€?,
                                        â€œautocomplete.show.fieldâ€?, if one
                                        of these settings is specified, the field
                                        name will be ignored.

Factors

If the fieldsetting is not in the list of Field Settings in the datadict table, the server will
throw an error message. In any other case, this function returns a valid value or null.

Return values

A String, Boolean or null value.
Examples

Example 1

This example demonstrates how you could use a JavaScript to access the data policy
on a simple file, such as the operator table.


// Access DataPolicy definition on operator file.

var operatorFile = new SCFile( "operator" );
var rteReturn;

rteReturn = system.functions.policyread( operatorFile ,
"profile.change", "invisible" );
print( "DataPolicy on (file:operator, fieldname:profile.change),
as defined in (file:datadict, field:invisible) " + rteReturn );

rteReturn = system.functions.policyread( operatorFile ,
"profile.change", "readonly" );
print( "DataPolicy on (file:operator, fieldname:profile.change),
as defined in (file:datadict, field:readonly) " + rteReturn );

rteReturn = system.functions.policyread( operatorFile ,
"profile.change", "mandatory" );
print( "DataPolicy on (file:operator, fieldname:profile.change),
as defined in (file:datadict, field:mandatory) " + rteReturn );

rteReturn = system.functions.policyread( operatorFile ,
"profile.change", "captions" );
print( "DataPolicy on (file:operator, fieldname:profile.change),
as defined in (file:datadict, field:captions) " + rteReturn );

rteReturn = system.functions.policyread( operatorFile ,
"profile.change", "avail" );
print( "DataPolicy on (file:operator, fieldname:profile.change),
as defined in (file:datadict, field:avail) " + rteReturn );

rteReturn = system.functions.policyread( operatorFile ,
"profile.change", "encrypt" );
print( "DataPolicy on (file:operator, fieldname:profile.change),
as defined in (file:datadict, field:encrypt) " + rteReturn );

rteReturn = system.functions.policyread( operatorFile ,
"profile.change", "defaults" );
print( "DataPolicy on (file:operator, fieldname:profile.change),
as defined in (file:datadict, field:defaults) " + rteReturn );


  rteReturn = system.functions.policyread( operatorFile ,
  "profile.change", "globallist" );
  print( "DataPolicy on (file:operator, fieldname:profile.change),
  as defined in (file:datadict, field:globallist) " + rteReturn );

  rteReturn = system.functions.policyread( operatorFile ,
  "profile.change", "matchfields" );
  print( "DataPolicy on (file:operator, fieldname:profile.change),
  as defined in (file:datadict, field:matchfields) " + rteReturn
  );

  rteReturn = system.functions.policyread( operatorFile ,
  "profile.change", "matchfiles" );
  print( "DataPolicy on (file:operator, fieldname:profile.change),
  as defined in (file:datadict, field:matchfiles) " + rteReturn );

  rteReturn = system.functions.policyread( operatorFile ,
  "profile.change", "validations" );
  print( "DataPolicy on (file:operator, fieldname:profile.change),
  as defined in (file:datadict, field:validations) " + rteReturn
  );

Example 2
This example demonstrates how you could use a JavaScript to access the data policy
on a complex file, such as a join of the incidents and contacts tables.


  // Access DataPolicy definitions on join file inccontacts
  (incidents and contacts)

  var incident_contacts_file = new SCFile( "inccontacts" );
  var rteReturn;

  // Access policy definition on file(contacts) and field(city)
  and datadict field defaults
  rteReturn = system.functions.policyread( incident_contacts_file,
  "file.contacts,city", "defaults" );
  print( "DataPolicy on (joinfile:inccontacts, subfile:contacts,
  field:city), as defined in(file:datadict, field:defaults)" +
  rteReturn );

  // Access policy definition on file(incidents) and field(phone)
  and datadict field defaults
  rteReturn = system.functions.policyread( incident_contacts_file,
  "file.incidents,phone", "defaults" );
  print( "DataPolicy on (joinfile:inccontacts, subfile:incidents,
  field:phone), as defined in(file:datadict, field:defaults)" +
  rteReturn );

  // Access policy definition on file(incidents) and field(phone),
  and datadata field readonly
  rteReturn = system.functions.policyread( incident_contacts_file,
  "file.incidents,phone", "readonly" );
  print( "DataPolicy on (joinfile:inccontacts, subfile:incidents,
  field:phone), as defined in(file:datadict, field:readonly)" +
  rteReturn );

Example 3


function testPolicy()
{

              var file = new SCFile( 'cm3r' );

              var ret = system.functions.policyread(file, "assets",
"reference.table" );

              print( "The reference.table attribute for assets field
in cm3r file is: ", ret );

ret );  ret = system.functions.policyread(file, "assets", "" );
ret );  print( "assets field in cm3r exists in data policy: ",

        ret = system.functions.policyread(file, "nofield", "" );
        print( "nofield field in cm3r exists in data policy: ",

              ret = system.functions.policyread(file, "",
"display.field" );

              print( "display.field for file cm3r is: ", ret );

              ret = system.functions.policyread("device", "",
"display.field" );

              print( "display.field for file device is: ", ret );
}

Example 3 returns the following results:

The reference.table attribute for assets field in cm3r file is:
device

assets field in cm3r exists in data policy: true

nofield field in cm3r exists in data policy: false

display.field for file cm3r is: null


display.field for file device is: display.name


1.2.4.2.82. RAD function: processes

A RAD function that returns an array describing all processes.
Function
processes
Format

processes(s)

Factors

Each element of the array contains the following information:

     login time
     session id
     device name
     user name
     idle time
     process id
     thread id
     hostname
     IP address

The argument of s determines the types of processes to be returned:

S                                       Type of process
null                                    All
ALL                                     All
SYSTEM                                  System (terminal="SYSTEM")
USER                                    User (not System)
ACTIVE                                  Active
INACTIVE                                Inactive (not active)


Example
processes("ACTIVE") returns {{['04/06/09 11:02:22', 11, "Soap-Windows Vista",
"System.Admin", '00:00:00', 1692, 5164, "HPSD9667", "15.80.163.173"]}} .


1.2.4.2.83. RAD function: prof

A RAD function that returns system performance statistics while checking the system
resources used by an application.
Function
prof
Format

  prof(n)

Where:
The value of n is the value for the parameter corresponding to the option you want
returned.
Parameters
The following parameters are valid for the prof function:

 Parameter                                                                                      Service Manager 9.81
 1
 2                                      Description
 3                                      Returns the user CPU time.
 4                                      This parameter is obsolete.
 5                                      Returns the memory allocated.
 6                                      This parameter is obsolete.
 7                                      This parameter is obsolete.
 8                                      This parameter is obsolete.
 9                                      This parameter is obsolete.
 10                                     This parameter is obsolete.
 11                                     This parameter is obsolete.
 12                                     This parameter is obsolete.
 13                                     This parameter is obsolete.
 20                                     This parameter is obsolete.
 21                                     This parameter is obsolete.
                                        Returns the symbol table size.
Example                                 Returns the stack size.
prof(5) returns 7752 .


1.2.4.2.84. RAD function: recordcopy

A RAD function that copies a set of fields from one record to another record.
Function
recordcopy
Format

$L.voide=recordcopy($source.file, $source.fields, $target.file,
$target.fields)

Parameters
The following parameters are valid for the recordcopy function:

Parameter                               Description
$L.void=
$source.file                            Syntax requirement only, doesn't affect
                                        the outcome of the function.
$source.fields
$target.file                            The source record from which fields
$target.fields                          are copied.

                                        Array of field names in $source.file.

                                        The target record to which fields are
                                        copied.

                                        Array of field names in $target.file.

Factors

The recordcopy function doesn't check the data type. Ensure that you don't copy a
number field to a string, or a structure to a number.

Example
$source.file is an operator record, and $target.file is a contacts record.


  name in $source.file="falcon"
  phone in $source.file="858-481-5000"
  $source.fields={"name", "phone"}
  $target.fields={"contact.name", "contact.phone"}
  $L.void=recordcopy($source.file, $source.fields, $target.file,
  $target.fields)

After execution, the value of contact.name in $target.file is falcon and
contact.phone in $target.file is 858-481-5000 .


1.2.4.2.85. RAD function: recordtostring

A RAD function that uses the value of a field from an array and appends that value to
a string.

Function
     recordtostring

Format
     recordtostring($string, $file, $arrayofnames, $sep)

Parameters
     The following values are valid for the recordtostring function:

Parameter                               Description
$string                                 The string to which the field value is
                                        appended.
$file                                   The current file.
$arrayofnames                           The array from which the field is taken.
$sep                                    A separator character.

Factors

Event Services uses the caret character (^) as a default separator. You can use the
recordtostring function to build an eventout string.

Example

  recordtostring("", $file, {"location", "location.name"}, "^")

Where:
The value of $file is a location record in which location=Advantage HQ , and
location.name=downtown . After execution, the value of $string will contain
Advantage HQ^downtown .


1.2.4.2.86. RAD function: round

A RAD function that rounds up, in the positive direction, to the nearest specified
number of decimal places.

Function

round

Format

round(number,n)

Parameters
The following parameters are valid for the round function:

Parameter                               Description
number
n                                       The number to round.

                                        The number of decimal digits to use
                                        when rounding. This number can be
                                        any input that equates to a numeric
                                        value, such as an expression, a
                                        variable, or a number.

Example


$a = round(3.47,1)
$a = 3.5

$a = round(3.53,1)
$a = 3.5

$a = round(3.45,1)
$a = 3.5

$a = round(-3.45,1)
$a = -3.4

$a = round(100/30,2)
$a = 3.33

$a = round(‘1/19/96 06:19:34’,0)
$a = ‘1/19/96 06:20’
````
