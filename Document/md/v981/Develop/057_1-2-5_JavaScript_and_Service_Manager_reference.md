---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.2.5 .. 1.2.5.1
printed_pages: 1516-1539
---

# 1.2.5 JavaScript and Service Manager reference

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.5. JavaScript and Service Manager
reference

This chapter provide the reference details for the JavaScript global System objects,
JavaScript global methods, Service Manager defined JavaScript objects, JavaScript
functions available in Service Manager, JavaScript functions available in the
ScriptLibrary of Service Manager, and some JavaScript examples.


1.2.5.1. JavaScript global System objects

Global objects are predefined objects that are always instantiated and can't be
created using the “new” operator. Objects have methods and/or subordinate
properties that you refer to by using the dot operator.
The primary global object is the System object. It acts as a container for an entire
hierarchy of objects. These other objects are properties of the System object.

            Note

           None of the Service Manager global System objects have constructors.

This is a complete list of global objects exposed as properties of the System object.

Global System objects                                                                           Service Manager 9.81
system.files
system.forms                            Description
system.functions
system.library                          Allows to call a particular Service
system.oldrecord                        Manager table into memory.
system.record
system.sysinfo                          Allows to call a particular Service
system.threads                          Manager form into memory.
system.user
                                        Calls a particular Service Manager RAD
system.users                            function from JavaScript.

system.vars                             Calls a particular Service Manager
                                        script library function.

                                        Calls the last Service Manager record
                                        into memory.

                                        Calls the current Service Manager
                                        record into memory.

                                        Calls an XML list of properties about
                                        the Service Manager server.

                                        Calls an XML list of the current Service
                                        Manager threads into memory.

                                        Calls an XML list of properties of the
                                        currently logged on Service Manager
                                        user.

                                        Calls an XML list of the currently
                                        logged on Service Manager users into
                                        memory.

                                        Calls a particular Service Manager
                                        variable into memory.


Note

All of the alias or shortcut global objects available in ServiceCenter 6.0
are deprecated in Service Manager. They are deprecated because the
alias or shortcut is likely to be used as a script variable. The scripts that
attempt to use these names as variables will not function as expected.
Therefore, you must type out the entire global system object name. For
example, type system.user instead of user.


1.2.5.1.1. JavaScript object: system.files

The following JavaScript object is unique to Service Manager.

The system.files object allows you to call a particular Service Manager table into
memory.

Usage

system.files.table name

Note

Service Manager global system objects don't have constructors.

Arguments
There are no arguments for this object.
Properties
The following properties are valid for this object:

Property                                Required     Description
table name                              Yes
                                                     This argument contains
                                                     the table name you want
                                                     to bring into memory.

Methods
None
Example
This example does the following:

     Sets a variable equal to system.files.contacts
     Displays the contents of the contacts table
This example requires the following sample data:
     A valid Service Manager table name (for example, contacts)


var f = system.files.contacts;
print( "The value of system.files.contacts is:\n" + f );


1.2.5.1.2. JavaScript object: system.forms

The following JavaScript object is unique to Service Manager.

The system.forms object allows you to call a particular Service Manager form into
memory.

Usage

system.forms.form name

Note

Service Manager global system objects don't have constructors.

Arguments
There are no arguments for this object.
Properties
The following properties are valid for this object:

Property                                Required     Description
form name                               Yes
                                                     This argument contains
                                                     the form name you want
                                                     to bring into memory.

Methods
None
Example
This example does the following:

     Sets a variable equal to system.forms.ScriptLibrary.
     Displays the contents of the ScriptLibrary form.
This example requires the following sample data:
     A valid Service Manager form name (for example, ScriptLibrary)


var fm = system.forms.ScriptLibrary;
print( "The value of system.forms.ScriptLibrary is:\n" + fm );


1.2.5.1.3. JavaScript object:
system.functions

This JavaScript object is unique to Service Manager. The system.functions object
allows you to call a particular Service Manager RAD function from JavaScript.
Usage

  system.functions.RAD function name( RAD function arguments )

            Note

           There are two exceptions to syntax used for RAD functions: delete and
           null .

                        system.functions._delete( RAD function arguments )

                        system.functions._null( RAD function arguments )

Note

Service Manager global system objects don't have constructors.

Arguments
The following arguments are valid for this object:

Argument      Data type                 Required    Description
              String                    Yes
RAD function                                        This argument
arguments                                           contains any
                                                    arguments
                                                    required to
                                                    execute the RAD
                                                    function.

Properties


The following properties are valid for this object:

Property                                Required     Description
RAD function name                       Yes
                                                     This argument contains
                                                     the RAD function name
                                                     you want to bring into
                                                     memory.

Methods
None
Example
This example does the following:

     Sets a variable equal to system.functions.operator().
     Displays the results of the RAD operator() function.
This example requires the following sample data:
     A valid Service Manager RAD function name (for example, operator())

var operator = system.functions.operator();
print( "The value of system.functions.operator() is:\n" +
operator );


1.2.5.1.4. JavaScript object:
system.functions.scmsg

The following JavaScript object is unique to Service Manager.
The system.functions.scmsg object allows you to call a particular Service Manager
message record from JavaScript.
Usage

  system.functions.scmsg( message number, message class, message
  elements )

            Note

           Service Manager global system objects don't have constructors.

Arguments
The following arguments are valid for this object:


Argument  Data type                     Required  Description
          String                        Yes
message                                           This argument
number                                            contains the
                                                  Service Manager
message class String                    Yes       message number
                                                  you want to call
message   Array                         No        into memory.

elements                                          This argument
                                                  contains the
                                                  Service Manager
                                                  message class
                                                  you want to call
                                                  into memory.

                                                  This argument
                                                  contains the
                                                  variable message
                                                  elements
                                                  indicated by %S
                                                  in the message
                                                  record.

Properties
None
Methods
None
Return values
A string containing the complete message text indicated by the arguments.
Example
This example does the following:

     Sets variables to define the message record
     Calls the RAD function scmsg()
     Displays the results of the RAD function scmsg()


This example requires the following sample data:
     A valid Service Manager message record (for example, "km" class record 14
     "Group %S and Profile %S are already in category %S")

  var msgrecord = "14";
  var msgclass = "km";
  var arguments = new Array();
  arguments.push( "New Group" );
  arguments.push( "New Profile Name" );
  arguments.push( "Category Name" );
  print( system.functions.scmsg( msgrecord, msgclass, arguments )
  );


1.2.5.1.5. JavaScript object: system.library

The following JavaScript object is unique to Service Manager.

The system.library object allows you to call a particular Service Manager script
library function.

Usage

system.library.script name.function name( function arguments )

Note

Service Manager global system objects don't have constructors.

Arguments
The following arguments are valid for this function:

Argument       Data type                          Required  Description
               String                             Yes
function                                                    This argument
arguments                                                   contains the
                                                            function
                                                            arguments you
                                                            want to use.

Properties
The following properties are valid for this object:

Property                                Required            Description
script name                             Yes
                                                            This argument contains
function name                           No                  the script name you want
                                                            to run.

                                                            This argument contains
                                                            the function name you
                                                            want to run.


Methods
None
Example
This example does the following:

     Creates an array.
     Calls a script to check if a value is in the array.

var testArray = new Array();
testArray.push("Blue");
testArray.push("Pink");
var result = system.library.ArrayUtil.contains(testArray,
"Blue");
print("The value you specified is in the array: " + result);


1.2.5.1.6. JavaScript object:
system.oldrecord

The following JavaScript object is unique to Service Manager.
The system.oldrecord object allows you to call the last Service Manager record into
memory.
Usage

  system.oldrecord

            Note

           Service Manager global system objects don't have constructors.

Arguments
There are no arguments for this object.
Properties
There are no properties for this object.
Methods
None
Example
This example does the following:

     Sets a variable equal to system.oldrecord .
     Displays the results of system.oldrecord .

  var o = system.oldrecord;
  print( "The value of system.record is:\n" + o );


1.2.5.1.7. JavaScript object: system.record

The following JavaScript object is unique to Service Manager.
The system.record object allows you to call the current Service Manager record into
memory.
Usage

  system.record

            Note

           Service Manager global system objects don't have constructors.

Arguments
There are no arguments for this object.
Properties
There are no properties for this object.
Methods
None
Example
This example does the following:

     Sets a variable equal to system.record .
     Displays the results of system.record .

  r = system.record;
  print( "The value of system.record is:\n" + r );


1.2.5.1.8. JavaScript object:
system.sysinfo

The following JavaScript object is unique to Service Manager.
The system.sysinfo object allows you to call an XML list of properties about the
Service Manager server.
Usage

  system.sysinfo

            Note

           Service Manager global system objects don't have constructors.

Arguments
There are no arguments for this object.
Properties
There are no properties for this object.
Methods
None
Example
This example does the following:

     Sets a variable equal to system.sysinfo .
     Displays the results of system.sysinfo .

  var s = system.sysinfo;
  print( "The value of system.threads is:\n" + s );


1.2.5.1.9. JavaScript object:
system.threads

The following JavaScript object is unique to Service Manager.
The system.threads object allows you to call an XML list of the current Service
Manager threads into memory.
Usage

  system.threads

            Note

           Service Manager global system objects don't have constructors.

Arguments
There are no arguments for this object.
Properties
There are no properties for this object.
Methods
None
Example
This example does the following:

     Sets a variable equal to system.threads .
     Displays the results of system.threads .

  var th = system.threads;
  print( "The value of system.threads is:\n" + th );


1.2.5.1.10. JavaScript object: system.user

The following JavaScript object is unique to Service Manager.
The system.user object allows you to call an XML list of properties of the currently
logged on Service Manager user.
Usage

  system.user

            Note

           Service Manager global system objects don't have constructors.

Arguments
There are no arguments for this object.
Properties
There are no properties for this object.
Methods
None
Example
This example does the following:

     Sets a variable equal to system.user .
     Displays the results of system.user .

  var u = system.user;
  print( "The value of system.user is:\n" + u );


1.2.5.1.11. JavaScript object: system.users

The following JavaScript object is unique to Service Manager.
The system.users object allows you to call an XML list of the currently logged on
Service Manager users into memory.
Usage

  system.users

            Note

           Service Manager global system objects don't have constructors.

Arguments
There are no arguments for this object.
Properties
There are no properties for this object.
Methods
None
Example
This example does the following:

     Sets a variable equal to system.users .
     Displays the results of system.users .

  u = system.users;
  print( "The value of system.users is:\n" + u );


1.2.5.1.12. JavaScript object: system.vars

The system.vars object is unique to Service Manager.

The system.vars object allows you to call a particular Service Manager variable into
memory.

Usage

system.vars.variable name

Note

Service Manager global system objects don't have constructors.

Arguments
There are no arguments for this object.
Properties
The following properties are valid for this object:

Property                                Required     Description
variable name                           Yes
                                                     This argument contains
                                                     the variable name you
                                                     want to bring into
                                                     memory.

Methods
None
Example
This example does the following:

     Sets a variable equal to system.vars.$L_file .
     Displays the contents of the $L_file variable.

This example requires the following sample data:


   A valid Service Manager variable name (for example, $L_file )

var v = system.vars.$L_file;
print( "The value of system.vars.$L_file is:\n" + v );
````
