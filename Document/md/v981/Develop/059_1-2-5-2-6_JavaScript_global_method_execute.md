---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.2.5.2.6 .. 1.2.5.2.15
printed_pages: 1571-1599
---

# 1.2.5.2.6 JavaScript global method: execute

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.5.2.6. JavaScript global method:
execute

Validates the syntax of the specified JavaScript, and then runs it.
Syntax

execute( script, description );

Arguments
The following arguments are valid for this function:

Argument     Data type                  Required      Description
script       String                     Yes
                                                      This argument
description  String                     No            contains the
                                                      name of the script
                                                      you want to
                                                      validate.

                                                      Use this
                                                      argument to store
                                                      any comments
                                                      you want.

Return values
A success or error message.
This method displays the Successful compilation of JavaScript function or
expression message if the JavaScript passes validation.
Throws
None
Description
This method validates the syntax of a JavaScript, and then runs it. The method also
displays a message as to the success or failure of the validation.
Example


This example does the following:
     Creates a variable to store a JavaScript name
     Validates the contents of the script
     Runs the script

This example requires the following sample data:
     A valid JavaScript

  var s = "lib.SCFILEgetTextTest"
  execute( s, "Testing execute" );


1.2.5.2.7. JavaScript global method:
getLog

This method retrieves a logger named according to the value of the name parameter.
Syntax
getLog (name)
Arguments
The following argument is valid for this function.

Argument  Data type                     Required  Description
name      String                        Yes
                                                  The name of the
                                                  logger to retrieve

Return values

A logger named according to the value of the name parameter.

Description

This method retrieves a logger named according to the value of the name parameter.
Loggers are normally named entities, using dot-separated names such as
"lib.test01.func01." The logger object in JavaScript is an adapter of log4j in the
Service Manager server. Logger names and levels follow the rules of log4j.

Example

This example does the following:

   1. Retrieve a logger with the given name.
   2. Set the logger level to trace.
   3. Print different level messages.
   4. Set the log levels by the code.

  var log = getLog('lib.test01.func01');  Service Manager 9.81
  log.setLevel('trace');                                   Page 239 of 269

  if (log.isTraceEnabled()){
  log.trace('trace message');
  }

  if (log.isDebugEnabled()){
  log.debug('debug message');
  }

  if (log.isInfoEnabled()){
  log.info('informatin message');
  }

  if (log.isWarnEnabled()){
  log.warn('warning message');
  }

  if (log.isErrorEnabled()){
  log.error('error message');
  }

  if (log.isFatalEnabled()){
  log.fatal('fatal message');
  }
  // Set level by code
  log.setLevel("trace");
  log.setLevel("debug");
  log.setLevel("info");
  log.setLevel("warn");
  log.setLevel("error");
  log.setLevel("fatal");

  log.setLevel(0); //trace
  log.setLevel(1); //debug
  log.setLevel(2); // info
  log.setLevel(3); // warn

This PDF was generated on May 23, 2026

log.setLevel(4); // error
log.setLevel(5); // fatal

To set a Javascript logger level, follow these steps:

   1. Go to Tailoring > Script Library.
   2. Click More > Javascript Logger.
   3. In the Name field, type the name of the logger.
   4. In the Level field, select a value from the following values: Trace, Debug, Info,

     Warn, Error, and Fatal.
   5. Click Save.

            Note

           The logger level will be cleared after the Service Manager server is
           restarted.


1.2.5.2.8. JavaScript global method: help

Displays a brief description of a Service Manager-defined JavaScript object.
Syntax

help( object );

Arguments
The following arguments are valid for this function:

Argument         Data type              Required      Description
object
                 Service Manager- Yes                 This argument
                 defined                              contains the
                 JavaScript object                    Service Manager-
                                                      defined
                                                      JavaScript object
                                                      for which you
                                                      want a brief
                                                      description.

Return values

A string or null.

This method returns a brief text string describing the Service Manager-defined
JavaScript object or null if there is no help available.

Throws

None
Description

This method displays a brief description of a Service Manager-defined JavaScript
object. You must use the print() method to see the help text string.

Example

This example displays the help contents of several Service Manager-defined
JavaScript objects.


var f = new SCFile();
print( help( f ) );
var x = new XML();
print( help( x ) );
var d = new XMLDate();
print( help( d ) );


1.2.5.2.9. JavaScript global method:
insertDatum

Inserts data into an array datum directly.
Syntax
insertDatum( array[, position[, number[, value[, denull]]]])
Arguments
The following parameters are valid for this function.


Parameter                               Data type                Description
array
position                                Array datum              The array parameter is
                                                                 the array into which an
number                                                           element is inserted.

value                                   Number                   The position parameter
                                                                 is the position of the first
                                                                 inserted element. If the
                                                                 value is zero (0), the
                                                                 element is inserted at the
                                                                 end of the array. This is
                                                                 an optional parameter.
                                                                 The default value is zero
                                                                 (0).

                                        Number                   The number parameter is
                                                                 the number of elements
                                                                 to insert. This is an
                                                                 optional parameter. The
                                                                 default value is one (1). If
                                                                 the value is zero (0), this
                                                                 function will return
                                                                 without changing the
                                                                 array.

                                        Any data type supported  The value parameter is a
                                        by RAD                   value to insert into the
                                                                 new elements. This is an
                                                                 optional parameter.

                                                                 The default value is
                                                                 NULL.


Parameter                               Data type  Description
denull                                  Boolean
                                                   The denull parameter is
                                                   a logical value that
                                                   determines whether or
                                                   not the array should be
                                                   denulled before inserting
                                                   elements. This is an
                                                   optional parameter. The
                                                   default value is true.

Return values
The array is returned with the new data inserted.
Throws
None
Description
This method insert data directly into an existing array datum.
Examples


Action desired                            Example and result

Insert an element at the beginning of     vars.$a=["a", "b", "c", "d"];
an array datum                            insertDatum(vars.$a, 1, 1, "z");
                                          Returns: vars.$a = {"z", "a", "b", "c",
                                          "d"}

Insert an element in the middle of an     vars.$a=["a", "b", "c", "d"];
array datum                               insertDatum(vars.$a, 3, 1, "z")

                                          Returns: vars.$a = {"a", "b", "z", "c",
                                          "d"}

Insert an element at the end of an array  vars.$a=["a", "b", "c", "d"];
datum                                     insertDatum(vars.$a, 0, 1, "z");

                                          Returns: vars.$a = {"a", "b", "c", "d",
                                          "z"}

To denull the array datum                 vars.$a=["a", "b", null, null, "e", "f",
                                          null, null, null, null];
                                          insertDatum(vars.$a, 0, 1, "z");

                                          Returns: vars.$a = {"a", "b", , , "e", "f",
                                          "z"}

To avoid denulling the array datum        vars.$a=["a", "b", null, null, "e", "f",
                                          null, null, null, null];
                                          insertDatum(vars.$a, 0, 1, "z", 0);

                                          Returns: vars.$a = {"a", "b", , , "e", "f",
                                          , , , ,"z"}

Action desired                                                                                  Service Manager 9.81
To denull the array datum again
                                        Example and result

                                        vars.$a=["a", "b", null, null, "e", "f", null,
                                        null, null, null]; insertDatum(vars.$a, 2,
                                        1, "z");
                                        Returns: vars.$a = {"a", "z", "b", , , "e",
                                        "f"}


1.2.5.2.10. JavaScript global method:
makeSCWebURL

Creates a URL query to the Service Manager Web tier.
Syntax
makeSCWebURL( Web tier URL, docEngine, table name, query, hash key seed,
action);
Arguments
The following arguments are valid for this function:

Argument      Data type                 Required         Service Manager 9.81
Web tier URL  String                    Yes
                                                  Description
docEngine     String                    Yes
                                                  This argument
table name    String                    Yes       specifies the fully
                                                  qualified URL to
                                                  the Service
                                                  Manager Web
                                                  tier. This URL
                                                  must include the
                                                  http:// protocol
                                                  syntax as well as
                                                  the server name
                                                  or IP address and
                                                  communications
                                                  port number.

                                                  This argument
                                                  specifies that the
                                                  query should be
                                                  handled by the
                                                  Service Manager
                                                  Document
                                                  Engine. This
                                                  argument doesn't
                                                  accept any other
                                                  string value.

                                                  This argument
                                                  specifies the
                                                  table where the
                                                  Document Engine
                                                  should query for
                                                  records.


Argument  Data type                     Required        Description
query     String                        Yes
                                                        This argument
hash key seed String                    No              specifies the
                                                        Service Manager
action    String                        Not applicable  query you want to
                                                        use to search for
                                                        records. You must
                                                        URI encode the
                                                        query string to
                                                        prevent special
                                                        characters from
                                                        invalidating the
                                                        URL.

                                                        This argument
                                                        specifies an
                                                        optional string
                                                        you want to use
                                                        to create a unique
                                                        hash key. The
                                                        hash key seed
                                                        doesn't appear in
                                                        the final URL
                                                        produced.

                                                        This argument
                                                        can't be used. By
                                                        default, the URL
                                                        query always
                                                        performs a
                                                        search operation.

Return values

A string containing a URL query to the Service Manager web tier.

Description
This method creates a URL query to the Service Manager web tier. It doesn't convert
any special characters in the URL (such as spaces or quotation marks) to the


character code equivalent in URI format. You can use the encodeURIComponent
method to convert any special characters in the URL.

Example

This example does the following:

     Creates a URL query to the Service Manager Web tier
     Converts any special characters in the URL to valid URI format

This example requires the following sample data:

     The URL to Service Manager Web tier
     A valid Service Manager table name (for example, incidents)
     A valid Service Manager query against the table (for example,
     incident.id="SD1001")


function createURLquery( table, query)
{

 var url;
 var webtier;
 var webserver;
 var doceng;
 var hashkey;
 var action;

 print( "Parameters: table="
              + table +
              "query='"
              + query + "'");

 print( "Converting special characters in query to valid URI
format..." );

 queryURI = encodeURIComponent( query );
 print( "Converted: old query='"

              + query +
              "' new query='"
              + queryURI +
              "'" );

 webserver = "http://pdoref02/sc/index.do";
 doceng = "docEngine";
 hashkey = "";
 action = "";
 webtier = makeSCWebURL( webserver,

                    doceng,
                    table,
                    queryURI,
                    hashkey,
                    action, "abc");
 url=encodeURIComponent(webtier);
 print( "Creating URL from information provided..." );
 print( "The value of webtier is:\n" + webtier );
 print( "The value of url is:\n" + url );
 return url;
}


var tablename = "incidents"
var SCquery = "incident.id=\"SD1001\""

createURLquery( tablename, SCquery);


1.2.5.2.11. JavaScript global method: print

Displays a message in the client Messages view and prints it in the Service Manager
log file.

            Note

           Messages only print to the Service Manager log file when JavaScript is
           running in the background.

Syntax

print( output );

Arguments
The following arguments are valid for this function:

Argument          Data type             Required      Description
output            String                Yes
                                                      This argument
                                                      contains the text
                                                      string or variable
                                                      value you want
                                                      the script to print
                                                      to the Message
                                                      View and the
                                                      sm.log file. You
                                                      must enclose
                                                      literal text strings
                                                      in quotation
                                                      marks.

Return values
None
Throws
None


Description
This method displays the contents of the method argument in the Messages view and
also prints it in the Service Manager log file.
Example
This example does the following:

     Creates a variable with a string value
     Displays the contents of the variable
This example requires the following sample data:
     A text string

  var example = "abc123";
  print("The value of example is: " + example);


1.2.5.2.12. JavaScript global method:
RCtoString

Converts a Service Manager global return code value into a localized text string.
Syntax

RCtoString( return code );

Arguments
The following arguments are valid for this function:

Argument     Data type                  Required      Description
return code  Integer                    Yes
                                                      This argument
                                                      contains the
                                                      Service Manager
                                                      global return
                                                      code value you
                                                      want to convert to
                                                      a localized string.

Return values

A localized text string
Throws

None

Description

This method converts a Service Manager global return code value into a localized text
string.

Example
This example does the following:

     Searches the contacts table for any contact name you define in the search
     variable
     Displays the contact record as a text string


This example requires the following sample data:
     A valid contact name (for example, "ADMINISTRATOR, SYSTEM")
     A invalid contact name (for example, "NOT A, CONTACT")

  var contactName;

  function findContactName( name )
  {

    print( "Searching for contact: " + name + "..." );
    var contactList = new SCFile( "contacts" );
    var findContact = contactList.doSelect( "contact.name=\""+ name
  + "\"" )
    if ( findContact == RC_SUCCESS )
    {

      print( "Success. found " + name + " in contact record:\n" +
  contactList.getText() );

      return contactList
    }
    else
    {

      print( "Could not find contact. " + RCtoString( findContact )
  );

      return null
    }
  }

  contactName = "ADMINISTRATOR, SYSTEM";
  findContactName( contactName );

  contactName = "NOT A, CONTACT";
  findContactName( contactName );


1.2.5.2.13. JavaScript global method:
readFile

Reads data from the file system on the Service Manager server host.
Syntax

readFile( path, binary );

Arguments
The following arguments are valid for this function:

Argument  Data type                     Required      Description
path      String                        Yes
                                                      This parameter
binary    String                        Yes           contains the text
                                                      string or variable
                                                      value containing
                                                      the fully qualified
                                                      path of the file to
                                                      be read. You must
                                                      enclose literal
                                                      text strings in
                                                      quotation marks.

                                                      This parameter
                                                      determines if the
                                                      file format is
                                                      binary or text.
                                                      Use the string "b"
                                                      or "B" to read a
                                                      binary file. Use
                                                      any other value to
                                                      read a text file.

Return values
A string object containing the contents of the file.


Description
This method reads the contents of a local file and returns a string object. The file can
be in binary format or text format as determined by the binary argument.
Example
This example does the following:

     Reads the contents of a text file
     Reads the contents of a binary file
This example requires the following sample data:
     A text file on the local file system
     A binary file on the local file system

  var textFile = readFile( "C:\\test.xml", "t" );
  print( "The value of textFile is: " + textFile );

  var binFile = readFile( "C:\\header_left.gif", "b" );
  print( "The value of binFile is: " + binFile );


1.2.5.2.14. JavaScript global method:
rteJSONParse

Parses a string as JSON.
Syntax

rteJSONParse(text);

Arguments
The following arguments are valid for this function:

Argument  Data type                     Required                 Description
text
          Boolean, Number, Yes                                   This argument
          or String                                              contains the
                                                                 string to
                                                                 parse as JSON.

Return values
Returns the object corresponding to the given JSON text.
Throws
Throws an exception if the string to parse is not a valid JSON.
Description
This method parses a string as JSON.
Example


rteJSONParse('{}');                     // {}

rteJSONParse('true');                   // true

rteJSONParse('"foo"');                  // "foo"

rteJSONParse('[1, 5, "false"]'); // [1, 5, "false"]

rteJSONParse('null');                   // null


1.2.5.2.15. JavaScript global method:
rteJSONStringify

Converts a value to JSON.
Syntax

rteJSONStringify(value);

Arguments
The following arguments are valid for this function:

Argument  Data type                     Required      Description
value
          Boolean, Number, Yes                        This argument
          or String                                   contains the
                                                      value to convert
                                                      to a JSON string.

Return values

Returns the JSON string corresponding to the given object.

Throws

None

Description

This method converts a value to JSON notation that represents it.

     This method doesn't guarantee to convert the properties of non-array objects to
     strings in any particular order. Don't rely on the ordering of properties in the
     same object in the converted string.
     This method converts Boolean, Number, and String objects to the corresponding
     primitive values, in accord with the traditional conversion semantics.
     If undefined or this method encounters a function during conversion, this
     method either omits it (when finding it in an object) or censors it to null (when
     finding it in an array).

Example


rteJSONStringify({});                   // '{}'

rteJSONStringify(true);                 // 'true'

rteJSONStringify("foo");                // '"foo"'

rteJSONStringify([1, "false", false]);  //

'[1,"false",false]'

rteJSONStringify([1, undefined, function(){}, "false", false]);
// '[1,null,null,"false",false]'

rteJSONStringify({ x: 5 });             // '{"x":5}'

rteJSONStringify({x: 5, y: 6});         // '{"x":5,"y":6}'
or '{"y":6,"x":5}'

rteJSONStringify({a:undefined, b:function(){}, x: 5, y: 6}); //
'{"x":5,"y":6}' or '{"y":6,"x":5}'

rteJSONStringify([new Number(1), new String("false"), new
Boolean(false)]); // '[1,"false",false]'
````
