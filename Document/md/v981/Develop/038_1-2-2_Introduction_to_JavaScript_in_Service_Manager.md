---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.2.2 .. 1.2.2
printed_pages: 1027-1058
---

# 1.2.2 Introduction to JavaScript in Service Manager

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.2. Introduction to JavaScript in
Service Manager

Similar to RAD, JavaScript in Service Manager provides the ability to query, insert,
update, and delete database records, and to make use of existing RAD variables and
functions. The principal benefit of using JavaScript is that it uses an industry-
standard scripting language to execute commands instead of a proprietary language.
JavaScript within Service Manager is implemented using the Mozilla® SpiderMonkey
(JavaScript–C) Engine.

For detailed information about the syntax of Mozilla SpiderMonkey JavaScript, refer
to:

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide

For information about the SpiderMonkey project, refer to:

https://developer.mozilla.org/en-US/docs/Mozilla/Projects/SpiderMonkey


1.2.2.1. Language overview

JavaScript is a scripting language which is different from programming languages like
Java™, C++, or Visual Basic®. It is a smaller, dynamically typed, scripting language
that offers programming tools with easy syntax and built-in functionality.

Unlike programming languages, scripting languages don't use compilers to create
executable program code. Because JavaScript is an interpreted language, each time
the script is executed, it is loaded into an interpreter that runs the code. The Compile
button in the Script Library doesn't create an executable load module; it runs a syntax
check to verify that the script is executable.

JavaScript can be either client-side, server-side, or core language. Core JavaScript is
the base JavaScript language with client-side and server-side JavaScript as
extensions. Server-side JavaScript is used for accessing and manipulating data and is
the only one available within Service Manager.


1.2.2.2. Learning JavaScript

We don't endorse these references but provides them as a courtesy to our customers
and partners. These are helpful resources that contain information about JavaScript.

     For JavaScript basics, refer to the JavaScript tutorial(s) at W3 Schools.
     The Mozilla SpiderMonkey (JavaScript-C) Engine project.
     JavaScript: The Definitive Guide, 5th Edition by David Flanagan (ISBN:
     0596101996).

For best results, fully understand the programming language prior to attempting to
use it with Service Manager.

            Note

           There is a difference between server-side and client-side JavaScript.
           Service Manager only supports server-side JavaScript. Therefore, any
           JavaScript that addresses output is unavailable in the Service Manager
           environment.


1.2.2.3. Basic rules of JavaScript

The following rules apply to the basic syntax of JavaScript:

     JavaScript is case-sensitive.

     Statements should end in a semicolon (;).

     Variables:

          • Must be defined before being used. The variable name can contain A-Z, a-
          z, underscore, or digits and must start with a letter or an underscore ("_").

          • Assume the type of data that's put into the variable. The data type doesn't
          have to be explicitly defined

          • Are global variables when defined outside of a function, and are available
          anywhere in the current script context. Variables created within a function
          are local variables, and can be used only within that function.

     Strings have to be enclosed in quotation marks, either a single or double. For
     example: print("Hello" + 'world' + Country.name) produces the following: Hello
     world US.

     Special characters that are displayed literally must be preceded by a backslash
     character (\). Quotes within a string can be entered preceded by a backslash as
     well. See the Core Language Features - Literals - "String literals" section for
     more information in https://developer.mozilla.org/en-
     US/docs/Web/JavaScript/Guide.

     To increment a variable, such as a = a + 1, you can use a++. You can decrement
     a variable in the same way, as in a--.

     To enter comments in the script, use "//" to start a single line comment or the
     combination of "/*" and "*/" to enclose a multi-line comment.

     Values that aren't defined as a data type (string, number, Boolean) may be
     defined as an object, such as Date, Array, Boolean, String, and Number. As an
     example, you could define: var ArrayList=new Array("test", "this", "list"); .

     Dots in Service Manager field names must be replaced by an underscore (_) in
     JavaScript. For example, contact.name becomes contact_name.

     Service Manager field names that are reserved words in JavaScript have to be
     preceded by an underscore, such as "_class" for the "class" field.


            Note

           Starting from Service Manager 9.70, the following enhancements are
           introduced on JS engine integration:

                All SM extended JS classes, for example,
                SCFile/SCDatum/XML/Script/Query/Record/Vars/Record, now fully
                support the prototype-chain-based inheritance mechanism in
                JavaScript.
                The 'Reflect' and 'Debugger' extensions of SpiderMonkey JS are
                now enabled on the global object.
                When a Javascript error stops the code execution, SM server will
                display file name and line number of the JS source code in the error
                message. If there being any JS exception in the code execution, SM
                server will further return the detailed JS source code call stack and
                log the information in the sm.log file.
                Jasmine v3.x is now fully supported as the JavaScript testing
                framework. The spyOn() function provided by Jasmine is
                supported for 'SCFile/SCDatum' SM extension classes.

Structure of a JavaScript application

Refer to the following example for the structure of a JavaScript application.

  < Global variable declarations; >

  function < function name > ( < parameters > ) {

         <

         local variable declarations; >

         <

         Statements; >

  }<

  function calls; >

Expressions and operators

For more information on this topic, refer to the Expressions and Operators section in:

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide

The list of operators includes assignment operators, comparison operators, arithmetic
operators, bitwise operators, logical operators, string operators, and special
operators.


JavaScript objects and properties

The key to understanding JavaScript is learning the structure of its objects. Most
JavaScript functionality is contained in objects. The objects contain methods,
parameters, and events. Each object may contain a set of properties that more closely
define the object. The syntax you use to call methods and properties is:
Object.method or Object.property.
For more information about JavaScript objects and properties refer to the Details of
the Object Model section in :
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide

Built-in objects and functions

Built-in objects described in this section are Array, Boolean, Date, Function, Math,
Number, and String.
Each of these is described in detail in the Working With Objects - Predefined Core
Objects section of:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide

Conditional statements

The following example returns true if the date entered is within the number of days in
a month (here, 30 days); otherwise, it returns false.

            Note

           Pay attention to the use of the conditional statement to shorten the "if"
           expressions. The var return = (parm.Date.getDate <= 30) ? true : false;
           statement works in the same way as its much longer equivalent:

                 var result = false;
                 if (parm.getDate() <= 30) {

                        result = true;
                 } else {

                        result = false;
                 }

While and loop statements


            Note

           Whenever programming a loop statement, ensure that the exit condition
           will be met; otherwise, an infinite loop will occur.

For detailed information about the for and while loop statements, refer to the
Statements - Loop Statements section in:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide
The following example shows how to check how many times a given number can be
divided by 2, first using a for loop, and then using a while loop:

  function DivisableByTwoFOR(ParmNumber) {
         for (var i = 0; ParmNumber > 1; i++) {
                 ParmNumber = ParmNumber / 2;
         }
         return i;

  }

  function DivisableByTwoWHILE(ParmNumber) {
         var i = 0;
         while (ParmNumber > 1) {
                 ParmNumber = ParmNumber / 2;
                 i++;
         }
         return i;

  }

            Note

           A Do..While loop is available for those instances when you want to
           execute a statement (or block of statements) at least once. In a
           Do..While loop, the exit condition is checked after the statements are
           executed.


            Caution

           The for…in loop over an array may return unexpected results. For details,
           see Avoiding the use of the for…in loop over an array.

Break and continue statements

The break statement terminates a while or for loop completely. The continue
statement terminates execution of the statements within a while or for loop and
continues the loop in the next iteration. The following two examples demonstrate how
these statements are used.

            Note

           Both these statements violate the rules of structured programming but are
           nonetheless widely used in special cases.

  function break4error(parmArray, x) {
         var i = 0;
         var n = 0;
         while (i < 10) {
                 if (isNaN(parmArray[x])) {
                        print(parmArray[i].toString + "is not numeric.Please

  repair and run again");
                        break;

                 }
                 n = n + parmArray[i];
                 i++;
         }
         return n;
  }

Modifying the above example, the continue statement would work as follows:


  function break4error(parmArray, x) {
         var i = 0;
         var n = 0;
         while (i < 10) {
                 if (isNaN(parmArray[x])) {
                        print(parmArray[i].toString + "is not

  numeric.Continuing with next number");
                        i++;
                        continue;

                 }
                 n = n + parmArray[i];
                 i++;
         }
         return n;
  }

Exception handling statements

As a best practice, exception handling should always be included in any JavaScript
program. The following code provides an example of using exception handling
statements for JavaScript.

  function SetFullName(FirstName, LastName) {
         if (FirstName != null || LastName != null) {
                 FullName = FirstName + "" +LastName;
                 return FullName;
         } else {
                 throw "InvalidName";
         }

  }
  try {

         // statements to try
         var MyName = SetFullName(First, Last); // function could
  throw exception
  } catch (e) {
         MyName = "unknown";
         logMyErrors(e); // pass exception object to error handler
  }


For detailed information about exception handling, refer to the Statements - Exception
Handling Statements section in:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide


1.2.2.4. Using JavaScript in Service
Manager

JavaScript implementation in Service Manager enables complex tailoring. However,
JavaScript has specialities that should be respected. The following sections discuss a
few of them.


1.2.2.4.1. JavaScript tailoring guideline

The embedded Mozilla SpiderMonkey JavaScript engine was upgraded to a higher
version in the 9.70 server. In order to avoid any potential problems, you need to check
your existing scripts and pay attention when you add new scripts.

To check your existing custom scripts:

   1. Go through your existing scripts and make sure that all custom scripts comply
     with the following guideline.

   2. Run a Functional Test and a Performance Test and check the sm logs. Fix the
     remaining issues as required.

JavaScript native object prototype tailoring

The upgraded JavaScript engine supports more methods on JavaScript native
objects. If you have added additional prototypes on JavaScript native objects before,
some of these scripts may conflict with the newly supported methods and cause
errors.

            Note

           To check your existing custom scripts, type fa in the command line, then
           input String.prototype. or Array.prototype. in the search field and click
           Search. Check all search results for tailoring code.

For example, the following scripts may cause errors because the startsWith() and
indexOf() methods are already available in the upgraded JavaScript engine.

  String.prototype.startsWith = function(str){…}
  Array.prototype.indexOf = function(obj){…}

String replace() function

The upgraded JavaScript engine supports 2 parameters for regexp instead of 3
parameters.

            Note

           To check your existing custom scripts, type fa in the command line, then
           input .replace( in the search field and click Search. Check all search
           results for tailoring code.


For example:

  cond = cond.replace('"', '\\"', "g");
✔️ cond = cond.replace(/\"/g, '\\"');

  strTarget = strTarget.replace(strOld, strNew, "g");
✔️ var regexp = new RegExp(strOld, "g");

    strTarget = strTarget.replace(regexp, strNew);

Apart from the changes brought by the JavaScript engine upgrade, you also need to
pay attention to the following JavaScript changes:

Global Method: base64Decode

If the value of the data parameter defined in base64Decode() is not a valid base64
string, the base64Decode() method will throw an exception with the "Exception
occurred when calling JSBase64Decode" error message.

            Note

           To check your existing custom scripts, type fa in the command line, then
           input "base64Decode" in the search field and click Search. Check all
           search results for tailoring code.

To avoid any potential problems, you need to use the try-catch block to catch such
exceptions for the base64Decode() method.

For example:

  try {
    var str = base64Decode(data);

 } catch (e) {
    // Take some actions to handle such exceptions

 }


1.2.2.4.2. Avoiding the use of the for…in
loop over an array

When tailoring Service Manager, you often need to iterate over an array. However,
using a for…in loop to iterate over an array may return unexpected results,
particularly, in the two scenarios illustrated below. We recommend that you use the
for ([initialization]; [condition]; [final-expression]) loop instead when iterating over
an array object.

Enhancing an array object with custom methods

Service Manager currently uses a JavaScript Engine that complies with JavaScript
1.5, in which some Array.prototype functions are implemented as built-in functions.
When enhancing an array object with a custom method, the for...in loop iterates on
all items in the array including the custom method. Similar issue also occurs to
customized Array.prototype functions, as demonstrated in the following example
code and its output. This behavior might lead to errors that are difficult to debug.

  Array.prototype._prototypeFunction = function() {
         // prototype function will be iterated as non built-in

  property
         print('prototype element');

  }
  print('built-in property: ' + array.length);
  // length is built-in property of array object, it will not be
  iterated within for…in statement
  for (var item in [1]) {

         print(' non built-in properties of Array type:' + item);
         //iterate the non built-in properties
  }

Output:

  non built-in property of Array type: _prototypeFunction
  // prototype function added as non built-in
  non built-in property of Array type: 0
  built-in property: 4


In this situation, you can use a guarding if statement to help debug the code. For
example:

  if (<array> .hasOwnProperty(<item index>))

or

  if (typeof(<array>[<item index>]!="function")

Iterating out of order

The for…in loop iterates objects in an order according to the ASCII values of the
property names. Do not use the for…in loop to iterate over an array when the index
order is important. See the following example code and its output.

  var array = [1,2,3];
  array['_'] = 'test';
  // interrupting element
  array[10] = 10;
  for(var item in array) {

             print(' non built-in properties of Array type:' + item);
             //iterate the non built-in properties
  }

Output:

  non built-in property of Array type : 10
  // Missing index 3~9!
  non built-in property of Array type: _
  //interrupt the element index order
  non built-in property of Array type: 2
  non built-in property of Array type: 1
  non built-in property of Array type: 0

For more information about using the for...in statement, refer to
https://developer.mozilla.org/en-
US/docs/Web/JavaScript/Reference/Statements/for...in.


1.2.2.4.3. Avoiding variable declaration
inside a loop

JavaScript is a language with a dynamic garbage collection. Memory allocated even if
inaccessible, will not be given free before the garbage collector deallocates it.
If a variable is declared inside a loop, JavaScript will allocate fresh memory for it in
each iteration, even if older allocations will still consume memory. While this might be
acceptable for variables of scalar data types, it may allocate a lot of memory for
SCFile variables, or huge arrays or objects.
Unrecommended implementation
The following implementation, in which a variable is declared inside a loop, is not
recommended.

  var arr = ["IM10001", "IM10002", "IM10003", "IM10004"];
  var i;
  for (i = 0; i < arr.length; i++) {

         var file = new SCFile("probsummary");
         file.doSelect('name="' + arr[i] + '"');
         // do something with file
  }

Recommended implementation
The following implementation, in which a variable is declared before a loop, is
recommended.

  var arr = ["IM10001", "IM10002", "IM10003", "IM10004"];
  var file = new SCFile("probsummary");
  var i;
  for (i = 0; i < arr.length; i++) {

         file.doSelect('name="' + arr[i] + '"');
         // do something with file
  }


1.2.2.4.4. Counting records

Counting the record set returned by a query is a frequent task in tailoring. Instead of
fetching each record in a loop, you can use the Service Manager rtecall("count")
more efficiently.
Recommended implementation using the doCount() method

  function countFile(filename, query) {
         var file = new SCFile(filename);
         var nCount = file.doCount(query);
         var rc = getLastRC();
         if (RC_SUCCESS == rc) {
                 return nCount;
         } else {
                 print("Could not count records. " + RCtoString(rc));
                 return -1;
         }

  }

Recommended implementation using system.functions.rtecall("count")

  function countFile(file) {
         var iTotal = new SCDatum();
         var returnCode = 1;

         funcs.rtecall("count", returnCode, file, "", iTotal);

         return iTotal.getText();
  }


1.2.2.4.5. Return bad validation message
in Format Control

When you run Format Control through JavaScript, you can use the following
JavaScript statements to display the detailed error messages if data validation fails.
funcs.rtecall("msgonoff", ret, 1); // turn on the Message switch
funcs.rtecall("msgonoff", ret, 0); // turn off the Message switch
Example

  var ret = new SCDatum();

  funcs .rtecall("msgonoff", ret, 1);

  var radResults = lib.RAD.run("se.get.object", argNames, argVals,
  argTypes, results);

  funcs .rtecall("msgonoff", ret, 0);


1.2.2.4.6. Avoiding the use of getLast()

The getLast() method for an SCFile object will select the last record of the list of
results to the currently selected records. However, accessing the last record in a long
list of records is not really a good idea. Since Service Manager selects always a block
of unique keys, this method requires Service Manager to blockwise step through the
complete result list, until it gets to the last one and then fetches its contents.
Unrecommended implementation
The following information is not recommended:

  var file = new SCFile("probsummary");
  file.doSelect('true');
  file.getLast();

Alternatively, you can set the result order by the setOrderBy() method at the time of
the select. You can change the sort order that the record you are looking for is no
more the last in the list, but the first.
Recommended implementation
The following implementation is recommended:

  var file = new SCFile("probsummary");
  file.setOrderBy(["number"],[SCFILE_DSC]);
  file.doSelect('true');


1.2.2.4.7. Restricting fields selected by a
query

When looping on a larger set of records by a query, a huge amount of memory may
be allocated for each record. At the same time, a dbdict might be mapped to multiple
tables on the RDBMS. Service Manager by default fetches the complete records and
therefore selects against each of these tables.
In JavaScript implementations, you can use read-only file variables and restrict them
to a set of fields only. Using this option will significantly reduce memory consumption,
as well as select against tables not containing any of these fields.
Recommended implementation

  var file = new SCFile(filename, SCFILE_READONLY);
  var query = "true";
  var fields = ["number", "status"];
  file.setFields(fields);

  var rc = file.doSelect(query);

  while (RC_SUCCESS == rc) {
         // Do something with file here
         rc = file.getNext();

  }

When using the setFields() function on a file variable that's not read-only, the query
is executed against all fields and this message is written to the log file:
JS W SCFile.setFields called on non readonly SCFile("number", "status")- ignored


1.2.2.4.8. Avoiding the use of assignment
instead of comparison

A common error in JavaScript code is the use of = (assignment), when a ==
(comparison) is actually intended.
Example of this issue

  while (rc = RC_SUCCESS) {
         // Do something with file here
         rc = file.getNext();

  }

A good practice to avoid this issue proactively, is to position the unchangeable value
at the left side.
Recommended implementation

  while (RC_SUCCESS == rc) {
         // Do something with file here
         rc = file.getNext();

  }


1.2.2.4.9. Accessing system language
array data

The Service Manager system language and JavaScript support the array-data type.
However, the implementation of this data type is different. For that reason, the access
to the elements inside the array is different as well.
While Service Manager allows array[<index>] access to system language arrays
from JavaScript, it doesn't allow to access sub items in an array of array like this:
array[<index1>][<index2>] .
However, it is possible to access the sub items in an array of array using this syntax:
array["<index1>.<index2>"] instead.
Example


// Create a nested system language array
var array1 = new SCDatum();
array1.setType(8);
array1.push("1_1");
array1.push("1_2");
array1.push("1_3");

var array2 = new SCDatum();
array2.setType(8);
array2.push("2_1");
array2.push("2_2");
array2.push("2_3");

var nestedArray = new SCDatum();
nestedArray.setType(8);
nestedArray.push(array1);
nestedArray.push(array2);

print("nestedArray: " + nestedArray);
print("Now printing the nested Arrays sub-arrays: ");
print("nestedArray[0]: " + nestedArray[0]);
print("nestedArray[1]: " + nestedArray[1]);

print("Now printing the elements of the first sub-array: ");
print('nestedArray["0.0"]: ' + nestedArray["0.0"]);
print('nestedArray["0.1"]: ' + nestedArray["0.1"]);
print('nestedArray["1.2"]: ' + nestedArray["1.2"]);


1.2.2.4.10. Working with system variables

The Service Manager System Language provides different types of variables
identified by their names. Variables of each type have different behaviors and scopes,
for example, local to RAD application, global inside RAD thread, and global inside
session. For more information, see Variable pools. This may affect the following
JavaScript implementation:

     Function calls in JavaScript use call-by-reference. That is, when calling a
     function with a variable as parameter, the value of the variable is NOT copied,
     but only referenced.
     Calling doAction() function from JavaScript will call the Document Engine, and
     by this MAY CHANGE non-local variables such as $file . That is, when calling a
     JavaScript function from Format Control, and calling doAction() inside this
     function might corrupt the $file variable when control is returned to Format
     Control.

Example of the issue
The following is an example of this issue:

  function test() {
         var file = new SCFile("probsummary");
         var rc = file.doSelect('number="IM10001"');

         if (rc == RC_SUCCESS) {
                 file.job_name = "test";
                 file.doAction("save");

         } else {
                 print("JS testFC.test():Select of incident IM10001

  failed! ");
         }

  }

Format Control "device", tab page "Javascript" to be executed on display:


  print("1. Filename:" + funcs.filename(vars.$file));
  lib.testFC.test();
  print("2. Filename:" + funcs.filename(vars.$file));

To
reproduce the issue, follow these steps:

   1. In the System Navigator, navigate to Configuration Management > Resources >
     Search CIs.

   2. The following messages appear:

          2. Filename:probsummary
          US/Mountain 01/31/14 09:35:29: Incident IM10001 has been
          updated by falcon
          1. Filename:device

Recommended implementation
Back up the $file variable before the function call, and restore afterwards. Change
the Format Control "device" implementation in the example above like this:

  print("1. Filename:" + funcs.filename(vars.$file));
  var backup = new SCFile(funcs.filename(vars.$file));
  var rc = funcs.fduplicate(backup, vars.$file);
  lib.testFC.test();
  vars.$file = backup;
  print("2. Filename:" + funcs.filename(vars.$file));


1.2.2.4.11. Accessing a JavaScript class
definition from another JavaScript

Suppose you have two different JavaScript libraries and you don't want to copy the
code from one library to the other just to make a JavaScript class definition available
to the other one. For example, you define a MyClass class in Test2, then you
instantiate MyClass in Test3, and then you call a function in Test4 passing the
instantiated object in Test3 to that function; additionally, you may want the function in
Test4 to be able to check if the received object is actually an instantiation of the class
defined in Test2. You then need to make Test3 to recognize MyClass.
To achieve this behavior, in the Test2 file, you can add a function that returns the
class itself, instead of an instantiated object of the class. If you call this function from
Test4, you get a pointer to the class definition.
See the following for the sample scripts.

Test2

  var MyClass = function() {
         this.var1 = 'variable 1';
         this.var2 = 'variable 2';

  };
  MyClass.prototype.getVariable1 = function() {

         return this.var1;
  };
  MyClass.prototype.getVariable2 = function() {

         return this.var2;
  };

  function require() {
         return MyClass;

  };

Test3


  var MyClass = lib.Test2.require();
  var objMyClass = new MyClass();
  print('Test3>', objMyClass instanceof lib.Test2.require());
  lib.Test4.checkit(objMyClass);

Test4

  var MyClass = lib.Test2.require();

  function checkit(anObject) {
         print('Test4>', anObject instanceof MyClass);
         print(anObject.getVariable1());
         print(anObject.getVariable2());
         print(anObject.var1);
         print(anObject.var2);

  };


1.2.2.4.12. Implementing custom logging

Instructions in this topic can be used for integrating logging aspect into custom
implementations as well as for temporarily adding logging statements for issue
analysis.

Log file

The default log file is the log file for the servlet. Writing to this file can be done like
this:

     System language:

          $success=rtecall("log", $L.rc, "My message")

     SM JavaScript:

          var rc = new SCDatum();
          var success = funcs.rtecall("log", rc, "My message");

     SM JavaScript also implements the print( "My message" ); function to write to
     the message log in the current session. This information appears in the message
     view of the client. These messages are printed into the servlet log as well, when
     the servlet was started with parameter msglog:1 .
Sometimes you may want to write information into a log file separated from the
servlet log file. This can be done using the writeFile() function:

  writeFile("c:\\SM\\logs\\mylog.log", "a", "My message");

Note In a JavaScript string, the backslash is used as an escape character, and
therefore the backslash character has to appear twice.

Converting variables to a string to print to a log file

You can convert variables into a string for logging:
     System language:


          $s=str('1 00:00:00')

     SM JavaScript:

          // converting a JavaScript value into string
          var s = 1.toString();
          // JavaScript implictly uses toString() method to convert a
          value to string
          print(1);
          // converting a value by System Language function into
          string
          var s = funcs.str(1);

For compound data types, JavaScript function toString() returns frequently just the
string representation of the data type, which is not really helpful. You can use the
following statements to convert complex objects into a string:

     Converting SCFile object to XML string:

          var f = new SCFile("dbdict");
          var rc = f.doSelect('name="pmstatus"');
          // like system language str() function - doesn't include
          fieldnames
          var s1 = f.getText();
          // output as XML document - this includes tags with
          fieldnames
          var s2 = f.getXML();

     Converting a JS object to JSON string:

          var s = JSON.stringify(["a", 1, {field1: "abc", field2:
          2}]);

Writing a custom logging function in SM JavaScript

When designing a logging function, you may want to implement a log level: some
messages should only be logged when debugging, but not during normal operations.
A typical log function design is as follows


  var loglevel = "INFO";

  function logDebug(s) {
         if (loglevel == "DEBUG") {
                 print(s);
         }

  }

This design of the function call has an issue:

  logDebug("Record: " + record);

At the time of the call, the object "record" is converted into a string. However, when
the global variables "loglevel" is not "DEBUG", the message is not printed at all.
Therefore, depending on the size of "record", and the frequency of this call (that is, in
a loop), this may cause significant memory consumption and execution time.
Therefore, consider the following design:

  var loglevel = "INFO";

  function logDebug() {
         if (loglevel == "DEBUG") {
                 print(Array.prototype.join.call(arguments));
         }

  }
  logDebug("Record: ", record);

Now, the reference to object "record" is handed to the logDebug() function and the
conversion to a string takes only place if the variable "loglevel" is equal to "DEBUG".

Out-of-Box loggers for JavaScript

There are two out-of-box loggers.
     ScriptLibrary log4js:
     The ScriptLibrary "log4js" supports logging in Log4J style to a message log.


  // Create a logger object set to log level "INFO"
  var myLogger = new lib.log4js.Log(lib.log4js.Log.INFO);
  myLogger.info("an info");

For more information, see The log4js script.
RTE-supported logger
Using the getLog() global JavaScript function, the Service Manager RTE
provides logger support.

  // Get a logger for name "MyLog"
  var mylog = getLog("MyLog");
  // Set the log level
  mylog.setLevel('trace');
  // Log a message for log level "trace"
  mylog.trace('trace message');

For more information, see JavaScript global method: getLog.
Tip There is GUI-support for this kind of loggers (using ScriptLibrary "jlog"): On
the search form for ScriptLibrary, you select the "JavaScript Logger" option and
you get to a dialog where you can set the log level for loggers by name.
````
