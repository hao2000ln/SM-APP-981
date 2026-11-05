---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.2.4.2.136 .. 1.2.4.2.152
printed_pages: 1306-1327
---

# 1.2.4.2.136 RAD function: sysinfo.get("TotalLicenses")

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.4.2.136. RAD function:
sysinfo.get("TotalLicenses")

A RAD function that returns the total number of licenses allowed.
Function
sysinfo.get("TotalLicenses")
Format

  $info=sysinfo.get("TotalLicenses")


1.2.4.2.137. RAD function:
sysinfo.get("TotalNamedUsers")

A RAD function that returns the total number of named users allowed.
Function
sysinfo.get("TotalNamedUsers")
Format

  $info=sysinfo.get("TotalNamedUsers")


1.2.4.2.138. RAD function:
sysinfo.get("TotalProcs")

A RAD function that returns the total number of executing processes.
Function
sysinfo.get("TotalProcs")
Format

  $info=sysinfo.get("TotalProcs")


1.2.4.2.139. RAD function:
sysinfo.get("TotalSystemProcs")

A RAD function that returns the total number of system processes.
Function
sysinfo.get("TotalSystemProcs")
Format

  $info=sysinfo.get("TotalSystemProcs")


1.2.4.2.140. RAD function:
sysinfo.get("TotalUserProcs")

A RAD function that returns the total user processes.
Function
sysinfo.get("TotalUserProcs")
Format

  $info=sysinfo.get("TotalUserProcs")


1.2.4.2.141. RAD function:
sysinfo.get("ess")

A RAD function that checks if the existing session is running in the context of
employee self-service (ESS) session. If the user is accessing service manager
through the ESS portal, it suppose to return true. Otherwise, it returns false.
Function
sysinfo.get("ess")
Format

  $info=sysinfo.get("ess")

Example

  if (sysinfo.get("ess")=true) then ($G.ess=true)

 $G.ess is set in "login" RAD application under following panel check.entry.point &
 init.name


1.2.4.2.142. RAD function: time

A RAD function that returns the time portion of a date and time value.
Function
time
Format

time($date.time.variable)

Parameters
The following parameter is valid for the time function:

Parameter                               Data type        Description
$string                                 String
                                                         The string variable
                                                         containing upper-case
                                                         characters.

Factors
The time of a given date and time may be different in different time zones.
Example

  time($date.time)

After execution, the value of $date.time is 12:10:15 .


1.2.4.2.143. RAD function: tod

A RAD function that returns the current system date and time in the logged on user's
timezone and date format.
Function
tod
Format

  tod()

Factors
The tod function returns mm / dd / yy hh : mm : ss .
Examples

  tod()=`4/20/96 12:15:16'

  $curr.time=tod()


1.2.4.2.144. RAD function: tolower

A RAD function that converts all uppercase characters in a string variable to
lowercase characters. Characters with no lowercase equivalent remain the same.

Function

tolower

Format

tolower($string)

Parameters
The following parameter is valid for the tolower function:

Parameter                               Data type           Description
$string                                 String
                                                            The string variable
                                                            containing uppercase
                                                            characters.

Factors
Character conversions are based on the value of the language parameter.
Example

  $s=tolower("Copyright 2011")

After execution, the value of $s is copyright 2011 .


1.2.4.2.145. RAD function: toupper

A RAD function that converts all lower–case characters in a string variable to upper–
case characters. Characters with no upper–case equivalent remain the same.

Function

toupper

Format

toupper($string)

Parameters
The following parameter is valid for the toupper function:

Parameter                               Data type           Description
$string                                 String
                                                            The string variable
                                                            containing lower-case
                                                            characters.

Factors
Character conversions are based on the value of the language parameter.
Example

  $s=toupper("Copyright 2004")

After execution, the value of $s is COPYRIGHT 2004 .


1.2.4.2.146. RAD function: translate

A RAD function that translates from one character set to another.

Programming considerations: This function has been deprecated and is maintained
for backward compatibility only. This function can only be used on simple single byte
character strings and is not UTF-8 safe. Case conversion on strings should be done
with the toupper() and tolower() functions, which are UTF-8 safe.

Function

translate

Format

translate(source, old character set, new character set)

Parameters
The following parameters are valid for the translate function:

Parameter                               Data type  Description
source                                  String
old character set                       String     The string to translate.

new character set                       String     The existing character
                                                   set.

                                                   The character set to
                                                   translate to.

Factors

     Old and new character sets must be strings of the same length.
     Old and new character sets may be literals, variables, or fields.
     A one–for–one correlation must exist between the old and new character sets.
     For example, the third character in the new set replaces the third character in the
     old set.

Example


  translate("123abcdef","abc","ABC")

After execution, the value is 123ABCdef .


1.2.4.2.147. RAD function: trunc

A RAD function that truncates the decimal digits of a number to a specified number of
digits.

Function

trunc

Format

trunc(number,n)

Parameters

Parameter                               Data type  Description
number                                  Number
n                                       Number     The number to truncate.

                                                   The number of decimal
                                                   digits desired. The
                                                   default value of n is zero
                                                   (0).

Factors

     The second parameter is not required. By default, the number passed is
     truncated to a whole number.
     Negative and positive numbers are treated the same.
     Character conversions are based on the value of the language parameter.

Examples

  trunc(3.45,1)

After execution, 3.4 is returned.

  trunc(3.44)

After execution, 3 is returned.


  trunc('13:19:34')

After execution, 13:19:00 is returned.


1.2.4.2.148. RAD function: type

A RAD function returns the numeric type of a datum. See Data types for a numeric
representation of each data type.

Function

type

Format

$ttype=type($any.value)

Parameters
The following parameter is valid for the type function:

Parameter                               Data type        Description
$any.value                              String           Any literal or variable.

Example

  $ttype=type('2/15/96')

After execution, the value of $ttype is three ( 3 ).


1.2.4.2.149. RAD function: updatestatus

A RAD function that returns the result of the last update operation on a Service
Manager file.
Function
updatestatus
Format

  updatestatus(file_variable)

Parameters
file_variable is the variable you want to retrieve.
Factors

     If the last update operation succeeded, this function returns 0 (zero), otherwise
     it returns one of the following values:

           48: The update failed because it contained an invalid duplicate key.
           49: The update failed because it contained an invalid null key.
           50: The update failed because it contained all null keys.
           51: The update failed because the record had already been modified.
           52: The update failed because the record had already been deleted.
           53: The update failed because of a trigger error.
           -1: Other errors.
     Every time the file variable is moved or changed (for example, a new record is
     inserted), the return value of this function is reset to 0.

Example

  $L.updateresult=updatestatus($L.file)


1.2.4.2.150. RAD function: val

A RAD function that converts a datum to a different data type.
Function
val
Format

$new.data=val($data, $new.type)

Parameters
The following parameters are valid for the val function:

Parameter                               Data type         Description
$data                                   Any data type
$new.type                               Number            Datum to be converted.

                                                          Data type to convert the
                                                          data to. The default
                                                          value is one ( 1 ). For a
                                                          list of the numbers that
                                                          correspond to the data
                                                          types, see Data types.

Factors

     A number can be converted to date and time, a string, or logical.
     A string can be converted to a number, date and time, or logical.
     A date and time can be converted to a number or a string.
     Logical can be converted to a number or a string.

Examples

The following examples show the value after execution:

Variable                                                                                        Service Manager 9.81
$x=val(100)
$x=val(100, 2)                          Value of $x after execution
$x=val(100, 3)                          100
$x=val(0, 4)                            "100"
$x=val(1, 4)                            ‘00:01:40’
$x=val(2, 4)                            false
$x=val(3, 4)                            true
$x=val("MICROFOCUS", 1)                 unknown
$x=val("100.3", 1)                      NULL
$x=val("MICROFOCUS", 2)                 NULL
$x=val("MICROFOCS", 3)                  100.3
$x=val("2/15/96", 3)                    "MICROFOCUS"
$x=val("true", 4)                       NULL
$x=val("0", 4)                          ‘02/15/96 00:00:00’
$x=val(‘01:00:23’, 1)                   true
$x=val(‘02/16/96 08:00:00’)             NULL
$x=val(‘01/01/96’, 2)                   3623
$x=val(‘02/09/96 08:00:00’, 3)          62992915200
$x=val(‘01/01/96’, 4)                   “01/01/96 00:00:00”
$x=val(‘12:34:56’, 4)                   ‘02/09/96 08:00:00’
                                        NULL
                                        NULL

Variable                                                                                        Service Manager 9.81
$x=val(false)
$x=val(true, 1)                         Value of $x after execution
$x=val(unknown, 1)                      0
$x=val(false, 2)                        1
b                                       2
$x=val(unknown, 4)                      "false"
                                        NULL
                                        unknown


1.2.4.2.151. RAD function: version

A RAD function that returns an array containing the release number of the Service
Manager executable.
Function
version
Format

  version()

Factors
Character conversions are based on the value of the language parameter.
Example

  $a=version()

After execution, the value of $a is {"unix",9.0,"9.0.1"} .
     The first element is a string naming the platform: unix, or winnt.
     The second element is 9.0 , the RAD release level.
     The third element is a string containing the Service Manager version number
     and the Service Pack number, such as 9.0.1 indicates Service Manager version
     9.0, Service Pack 1 .


1.2.4.2.152. RAD function: year

A RAD function that returns the full year for a date, regardless of the date format.
Function
year
Format

$fyear=year($date)

Parameters
The following parameter is valid for the year function:

Parameter                               Data type        Description
$date                                   Date/time        The date and time value.

Example

  $fyear=year('2/15/05')

After execution, the value of $ fyear is 2005 .
````
