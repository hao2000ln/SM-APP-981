---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.2.4.2.43 .. 1.2.4.2.57
printed_pages: 1166-1190
---

# 1.2.4.2.43 RAD function: get.graph.id

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.4.2.43. RAD function: get.graph.id

Description
A RAD function that returns the value of the graph ID for the expand action on a node
in the graph diagram.
Function
get.graph.id()
Example

  $L.graphid = get.graph.id()


1.2.4.2.44. RAD function: get.graph.target

Description
A RAD function that returns the target for an activated action on a node in the graph
diagram.
Function
get.graph.target()
Example

  $L.graphtarget = get.graph.target()


1.2.4.2.45. RAD function:
get.graphnode.id

Description
A RAD function that returns the value of the node ID for the expand action on a node
in the graph diagram.
Function
get.graphnode.id()
Example

  $L.graphnodeid = get.graphnode.id()


1.2.4.2.46. RAD function: get.lock.owner

A RAD function that returns the owner of a resource (lock). The function returns the
name of the user who currently has the resource locked.
Function
get.lock.owner
Format

  $owner= get.lock.owner("locked resource")

Example
Assume the user "falcon" is actively updating Incident IM1017. By viewing the Lock
Resource Status display, one can determine that the name of the associated resource
is probsummary;IM1017 . To verify the owner from any other application:

  $lock="probsummary;IM1017"
  $owner=get.lock.owner($lock)

After execution, the value of $owner is falcon .

            Note

           This function is primarily intended for internal use as it requires specific
           knowledge of the underlying resource names associated with a specific
           action.


1.2.4.2.47. RAD function:
get.timezoneoffset

A RAD function that returns the absolute time difference between Greenwich Mean
Time (GMT) and the time zone of the operator.
Function
get.timezoneoffset
Format

  $tzoffset=get.timezoneoffset()

Example

  $tzoffset=get.timezoneoffset()

After execution for a Pacific Standard Time (PST) time zone user, the value of the
$tzoffset variable is -08:00:00 .


1.2.4.2.48. RAD function: get.uid

A RAD function that returns a 32-character identifier that's unique to an installation of
Service Manager. Each successive call returns a value greater than the previous
value.
Function
get.uid
Format

  $uid=get.uid()

Example

  $uid=get.uid()

After execution, $uid contains a unique value such as
608AE3ED276562980000283400002F44.


1.2.4.2.49. RAD function: get.web.url

A RAD function that returns the URL of the web client.
If there's no parameter added, or if the value is set as false or 0, the URL address will
be the Web Tier URL.
If the the value is set as true or 1, the URL address will be the original URL when the
enableGetOriginalUrl parameter is enabled.
Function
get_web_url()
Format

  system.functions.get_web_url()

Example
When the enableGetOriginalUrl parameter is enabled and the web tier full URL is
http://12x.x.x.x/webtier-
x.xx.xx/index.do?originalUrl=http://servicemanager.example.com/index.do
If you execute the following commands:
print(system.functions.get_web_url());
print(system.functions.get_web_url(false));

print(system.functions.get_web_url("false"));

print(system.functions.get_web_url(0));

After execution, the URL http://12x.x.x.x/webtier-x.xx.xx/index.do will be returned.
If you execute the following commands:
print(system.functions.get_web_url(true));

print(system.functions.get_web_url("true"));

print(system.functions.get_web_url(1));


After execution, the URL http://servicemanager.example.com/index.do will be
returned.
Note that if the enableGetOriginalUrl parameter is disabled, then Unknown will be
returned.


1.2.4.2.50. RAD function: gui

A RAD function that determines whether or not a process is running in GUI mode.
Function
gui
Format

  $bool=gui()

Example

  $bool=gui()

After execution in GUI mode, the value of $bool is true . After execution in text
mode, value of $bool is false .


1.2.4.2.51. RAD function: index

A RAD function that returns the index or position number for the value of a specific
element in an array or a character in a string. If the target value is not in the array or
string, NULL is the return.
Function
index
Format

  index(target value, $variable, starting position #)

Parameters
The target value variable is the value you are searching for in the array or string.
The $variable variable is the name of the variable to be searched.
The starting position # variable is the index in the array or position in the string
where the search will begin. The default value is 1 ).
Factors

     The index() function operates identically for arrays, regardless of the data type
     in the array.
     If the array is composed of structures or of arrays, the target variable must
     exactly match the structure or array.
     For example, the function doesn't allow selecting a field from a structure.
     You can use the index function to search for any value by converting both the
     value and the search variable to the same type.
     For example, if you want to search for the $problem.number variable on all
     forms, you could pass the following query to the select panel:

          index("$problem.number", str(field))

     The index function searches for the $problem.number variable in the field
     field of the format table.


     When you use the index() function in a query, Service Manager evaluates the
     function based on database case sensitivity.

     For example, if you use the Expert Search option on the Incident Management
     search screen, and search for index("Windows Server", brief.description) > 0 :

           On a case-insensitive database, the query returns all records where the
            brief.description field contains windows server or WINDOWS SERVER
           or Windows SERVER , and so on.
           On a case-sensitive database, the query only returns records where the
            brief.description field contains exactly Windows Server .

     When you use the index() function in a RAD or JavaScript expression and not
     within a query, Service Manager evaluates it case-sensitively (regardless of the
     database setting).

     For an example, consider the following RAD or JavaScript expressions:

           The expression index("Windows Server", {"WINDOWS SERVER", "windows
           server"}) , returns 0.
           The expression index("Windows Server", {"WINDOWS SERVER",
           "Windows Server", "windows Server"}) , returns 2.

Example

index(1,{1,2,3}) returns 1

index(2,{1,2,3}) returns 2

index(1,{1,2,3},2) returns 0

index(2,{1,2,3},2) returns 2


1.2.4.2.52. RAD function: insert

A RAD function that returns an array with one or more inserted elements.

Function

insert

Format

  insert( $array[, $position[, $number[, $value[, $denull]]]])

Parameters

     The $array parameter is the array into which an element is inserted.
     The $position parameter is the position of the first inserted element. If the
     value is zero (0), the element is inserted at the end of the array. This is an
     optional parameter. The default value is zero (0).
     The $number parameter is the number of elements to insert. This is an optional
     parameter. The default value is one (1). If the value is zero (0), this function will
     return without changing the array.
     The $value parameter is a value to insert into the new elements. This is an
     optional parameter. The default value is NULL.
     The $denull parameter is a logical value that determines whether or not the
     array should be denulled before inserting elements. This is an optional
     parameter. The default value is true.

Factors

If the source array has NULL elements at the end, this function automatically denulls
the array before inserting new elements in any position. To avoid this, set the value of
the $denull parameter to false.

Examples

The following examples show a desired result and the syntax used to achieve that
result.


Action desired                          Example and result

Insert an element at the beginning of     $a={"a", "b", "c", "d"}
an array.                                 $a=insert($a, 1, 1, "z")

                                        Where:
                                        The value of $a is {"z", "a", "b", "c",
                                        "d"}

Insert an element in the middle of an   To insert an element in the middle of an
array.                                  array:

                                          $a={"a", "b", "c", "d"}
                                          $a=insert($a, 3, 1, "z")

                                        Where:
                                        The value of $a is {"a", "b", "z", "c",
                                        "d"}

Insert an element at the end of an        $a={"a", "b", "c", "d"}
array.                                    $a=insert($a, 0, 1, "z")

                                        Where:
                                        The value of $a is {"a", "b", "c", "d",
                                        "z"}

The array is denulled.

                                          $a={"a", "b", , , "e",
                                          "f", , , , }
                                          $a=insert( $a, 0, 1, "z")

                                        Where:
                                        The value of $a is {"a", "b", , , "e", "f",
                                        "z"}

Action desired                                                                                  Service Manager 9.81
To avoid denulling the array.
                                        Example and result
The array is (again) denulled.
                                          $a={"a", "b", , , "e",
                                          "f", , , , }
                                          $a=insert( $a, 0, 1, "z", 0)

                                        Where:
                                        The value of $a is {"a", "b", , , "e", "f", ,
                                        , , ,"z"}

                                            $a={"a", "b", , , "e",
                                          "f", , , , }
                                          $a=insert( $a, 2, 1, "z")

                                        Where:
                                        The value of $a is {"a", "z", "b", , , "e",
                                        "f"}


1.2.4.2.53. RAD function: iscurrent

A RAD function that determines if the record that you are working with is identical to
the version in the database. A value of true or false is returned.
Function
iscurrent
Format

  $Boolean=iscurrent($file.variable)

Factors
This function only determines if another user has changed the current record since
you open it.
Examples
Example 1:

   1. User1 logs in and opens record IM10005.
   2. User1 modifies IM10005, but doesn't save it.
   3. User1 calls iscurrent($L.file) with $L.file pointing to IM10005.

     A value of true is returned. This is because the record user1 gets in step 1 is
     identical to the version in the database.

Example 2:

   1. User2 logs in and opens record IM10005.
   2. User2 logins and opens record IM10005. (User2 gets the same version of record

     IM10005 as user1.)
   3. User1 modifies IM10005 and saves it. (IM10005 in the database is changed.)
   4. User2 calls iscurrent($L.file) with $L.file pointing to IM10005.

     A value of false is returned. This is because the record user2 gets in step 2 is
     not identical to the version in the database.


1.2.4.2.54. RAD function:
isExpressionValid

A RAD function that determines if a RAD expression is a valid expression of a
specified data type.
Function
isExpressionValid
Format

  $e = isExpressionValid(expr_string, type)

Parameters
expr_string is a RAD expression, and type is a basic data type of Service Manager.
Factors

     It returns true or false .
     It works the same way as the parse.evaluate() function except that it doesn't
     send error messages to the client when the input string is invalid.
Examples

  $x=isExpressionValid(“abc”,3) returns false

  $x=isExpressionValid("date(tod()) + 5*24*60", 3) returns true


1.2.4.2.55. RAD function: isfileexist

A RAD function that determines whether a file or a folder exists or not. If the file
exists, this function returns true . Otherwise, this function returns false .
Function
isfileexist
Format

  isfileexist("path",type)

Parameters
The path variable is the full path of a file or a folder.
The type variable is optional. If omitted, the value is set to 0 by default.

     0: determines whether a file or a folder exists
     1: determines whether a file exists
     2: determines whether a folder exists
Example

  $L.path="c:\\note.txt"
  L.ret=isfileexist($L.path)
  if ($L.ret=false) then ($L.void=rtecall("msg", $L.code, "File
  doesn't exist"))
  else ($L.void=rtecall("msg", $L.code, "File exists"))


1.2.4.2.56. RAD function: jscall

A RAD function that enables you to invoke JavaScript from within RAD.
Function
jscall
Format

  jscall( "script.function" , arg1 , arg2, ... , argN )

            Note

           Note
           If the "script.function" returns const strings rather than fields, you need
           to wrap the return value with quotes.
           For example, if the "script.function" returns the const strings, the
           following usage may cause some problems:
           function Test()
           {
           return "test-test";
           }
           Instead, you need to use the following standard format:
           function Test()
           {
           return "\"test-test\"";
           }

Parameters
The following parameters are valid for the jscall function:


Parameter          Data type            Required         Description
"script.function"  String               Yes
                                                         Refers to a script
arg1, arg2, –      Varies with each     The required     in the
, argN             argument             arguments        ScriptLibrary and
                                        depend upon the  a particular
                                        requirements of  function within
                                        the script you   the script. This
                                        call.            parameter must
                                                         be enclosed in
                                                         double quotes.

                                                         The arguments
                                                         passed to
                                                         JavaScript. You
                                                         can pass an
                                                         infinite number of
                                                         arguments.
                                                         Arguments aren't
                                                         enclosed in
                                                         quotes or double
                                                         quotes and can
                                                         be RAD
                                                         expressions, as
                                                         shown in the
                                                         following
                                                         examples:

                                                           city in
                                                           $L.OLD

                                                         Or:

                                                         level in
                                                         $L.NEW=0


1.2.4.2.57. RAD function: lioption

This RAD function indicates whether a given input value is a licensed option on the
current system.
Function
lioption
Format

  lioption(input value)

Parameters
Parameters for this function are as follows:

Input value                                                                                     Service Manager 9.81
Asset Contract Management
Change Management                       Description
Configuration Management
Contract Management                     Authority to use Asset Contract
Incident Management                     Management application
IR Expert
Knowledge Management                    Authority to use Change Management
Knowledge Management ESS                application

Problem Management                      Authority to use Configuration
RAD Compiler                            Management application
Request Management
SCAuto/SDK Unix                         Authority to use Contract Management
SCAuto/SDK Windows                      application

                                        Authority to use Incident Management
                                        application

                                        Authority to use IR Expert

                                        Authority to use Knowledge
                                        Management application

                                        Authority to use Employee Self-Service
                                        with the Knowledge Management
                                        application

                                        Authority to use Problem Management
                                        application

                                        Authority to use RAD Compiler

                                        Authority to use Request Management
                                        application

                                        Authority to use SC Automate Adapters
                                        Unix SDK

                                        Authority to use SC Automate Adapters
                                        Windows SDK

Input value                                                                                     Service Manager 9.81
SCAuto/HP Network Node Manager
SCAuto/Netview (AIX/NT)                 Description
SCAuto/SunNet
SCAuto/SPECTRUM                         Authority to use SC Automate Adapters
SCAuto/HP Operations (ITO/VPO)          OpenView
SCAuto/UNIXmail
SCAuto/MAPImail                         Authority to use SC Automate Adapters
SCAuto/Lotus Notes                      AIX Netview
SCAuto/Netview OS/390
SCAuto/TBSM                             Authority to use SC Automate Adapters
SCAuto/Unicenter AMO                    SunNet
SCAuto/Unicenter TNG
SCAuto/Tivoli                           Authority to use SC Automate Adapters
                                        SPECTRUM

                                        Authority to use SC Automate Adapters
                                        IT Ops

                                        Authority to use SC Automate Adapters
                                        SMTP or UNIX mail

                                        Authority to use SC Automate Adapters
                                        MAPI mail

                                        Authority to use SC Automate Adapters
                                        Lotus Notes

                                        Authority to use SC Automate Adapters
                                        OS/390 Netview

                                        Authority to use SC Automate Adapters
                                        TBSM

                                        Authority to use SC Automate Adapters
                                        Unicenter

                                        Authority to use SC Automate Adapters
                                        CA TNG

                                        Authority to use SC Automate Adapters
                                        Tivoli


Input value                             Description
SCAuto/Tally NetCensus
SCAuto/Remedy ARS                       Authority to use SC Automate Adapters
SCAuto/ERP Connection                   Tally NetCensus
Scheduled Maintenance
Self-Service Ticketing                  Authority to use SC Automate Adapters
Service Catalog                         Remedy ARS
Service Desk
SLA                                     Authority to use SC Automate Adapters
SOAP API                                ERP Connection

                                        Authority to use Scheduled
                                        Maintenance application

                                        Authority to use Self-Service Ticketing

                                        Authority to use Service Catalog
                                        application

                                        Authority to use Service Desk
                                        application

                                        Authority to use Service Level
                                        Agreements application

                                        Authority to publish Service Manager
                                        data as Web services

Factors
The function returns a true value if the input value is part of the system license.
The function returns a false value if the input value is not part of the system license.
Examples
The following table describes a desired action and the syntax used to initiate the
action.


Action desired                          Syntax

Check for authorization to use Change $licensecheck=lioption("Change

Management                              Management")

Check for authorization to publish Web $licensecheck=lioption("SOAP API")
services
````
