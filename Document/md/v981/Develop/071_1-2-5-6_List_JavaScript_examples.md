---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.2.5.6 .. 1.2.5.6
printed_pages: 1893-1904
---

# 1.2.5.6 List: JavaScript examples

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.5.6. List: JavaScript examples

The following table lists the JavaScript examples available for review. These examples include sample
JavaScript code for the Service Manager-defined JavaScript objects, methods, and properties, as well as
code samples that call the system JavaScript functions provided in the Script Library. These JavaScript are
intended to work with an out-of-box Service Manager system and sample data.


JavaScript example                      Service Manager object,  System functions called
                                        method, or property
                                        demonstrated

Example: Getting a list of logged                                        None
on users                                system.users (global
                                        property)
                                        print(); (global method)
                                        getName(); (method of the
                                        XML object)
                                        getValue(); (method of the
                                        XML object)

Example: Iterating through a                                             None
complex XML document                    XML(); (XML object)
                                        setContent(); (method of
                                        the XML object)
                                        getDocumentElement();
                                        (method of the XML
                                        object)
                                        getQualifiedName();
                                        (method of the XML
                                        object)
                                        getFirstAttribute();
                                        (method of the XML
                                        object)
                                        getFirstChildElement();
                                        (method of the XML
                                        object)
                                        getNextSiblingElement();
                                        (method of the XML
                                        object)

Example: Query a record using                                            None
the SCFile object                       SCFile(); (SCFile object)
                                        doSelect(); (method of the
                                        SCFile object)
                                        RCtoString(); (method of
                                        the SCFile object)
                                        getFirstChildElement();
                                        (method of the XML
                                        object)
                                        getName(); (method of the
                                        XML object)
                                        getValue(); (method of the
                                        XML object)


JavaScript example                      Service Manager object,          System functions called
Example: Testing a file name            method, or property              None
                                        demonstrated

                                             SCFile(); (SCFile object)
                                             doSelect(); (method of the
                                             SCFile object)
                                             print(); (global method)

Example: Updating a field with                                           None
the current date and time               SCFile(); (SCFile object)
                                        doSelect(); (method of the
                                        SCFile object)
                                        print(); (global method)
                                        system.functions (global
                                        property)
                                        Date(); (Date object)
                                        SCDatum(); (SCDatum
                                        object)
                                        getType(); (method of the
                                        SCDatum object)
                                        doUpdate(); (method of
                                        the SCDatum object)
                                        RCtoString(); (method of
                                        the SCDatum object)


1.2.5.6.1. Example: Getting a list of logged on users

This JavaScript example accesses the built in system.users object to get an XML list of all the currently
logged-on users on the system. It then loops through to access each individual user, and then prints the
name (XML tag) and value of each field.

  var usersXML = system.users;

If you uncomment the line of code, recompile, and then run the script again, you can view the suppressed
output. It prints all logged-on users as a large XML document.

  //print( usersXML );

This part of the script loops through to process each <user> element within <users>.

  for ( userIndex in usersXML )
  {
  var userXML = usersXML[userIndex];

If you uncomment the line of code, recompile, and then run the script again, you can view the suppressed
output. It prints an individual user as an XML document.

  //print( userXML );

This part of the script loops through to process each XML element node within the <user> element.

  for ( fldIndex in userXML )
  {
  var node = userXML[fldIndex];
  print( node.getName() + ": " + node.getValue() );
  }
  }


1.2.5.6.2. Example: Iterating through a complex XML
document

This JavaScript example demonstrates how to iterate through a complex XML document that includes any
number of levels of nesting and contains attributes. The script visits each node, be it an attribute node or
an element node, and prints the name of the node and its value.

  var xmlObj = new XML();
  xmlObj.setContent( "c:\\test.xml", true );
  visitElement( xmlObj.getDocumentElement() ); // getDocumentElement returns the
  root node
  function visitElement( elem )
  {
  print( "Element " + elem.getQualifiedName() );
  // Print attributes for this element
  var node = elem.getFirstAttribute();
  while( node != null )
  {
  var attrName = node.getQualifiedName();
  var attrValue = node.getNodeValue();
  print( "Attribute " + attrName + "=" + attrValue );
  node = elem.getNextAttribute();
  }
  // Print possible element value
  var nodeValue = elem.getNodeValue();
  if ( typeof nodeValue == "string" && nodeValue.length > 0 )
  {
  print( "Element value is " + nodeValue );
  }
  // Now print child elements
  var child = elem.getFirstChildElement();
  while( child != null )
  {
  var nodeName = child.getNodeName();
  var nodeValue = child.getNodeValue();
  visitElement( child );
  child = child.getNextSiblingElement();
  }
  }


1.2.5.6.3. Example: Query a record using the SCFile
object

This JavaScript example demonstrates how to perform the following objectives.
   1. Query a record from a table using the SCFile object.
   2. Obtain the resulting record in XML format by using the getXML method that gives you field names in
     addition to values.
   3. Iterate through the resulting XML and print the field names and values. For a more robust approach,
     see Example: Iterating through a complex XML document.

  var fContacts = new SCFile( "contacts" );
  var rc = fContacts.doSelect( "contact.name = \"BROWN, NICHOLAS\" " );
  if ( rc != RC_SUCCESS ) // doSelect can also return RC_BAD_QUERY or RC_NO_MORE
  {
  print( "Error - doSelect returned " + RCtoString(rc) );
  }
  else
  {
  var xmlContactsRecord = fContacts.getXML().instance;
  var fldIndex;
  for ( fldIndex in xmlContactsRecord )
  {
  var node = xmlContactsRecord[fldIndex];
  if ( node.getFirstChildElement() != null ) // this node has child elements
  {
  var i;
  for ( i in node ) // print the child elements
  {
  var childNode = node[i];
  print( childNode.getName(), "=", childNode.getValue() );
  }
  }
  else
  print( node.getName(), "=", node.getValue() );
  }
  }


1.2.5.6.4. Example: Testing a file name

This JavaScript example demonstrates how to test whether or not a Service Manager file name in a string is
valid. The script uses a string containing the file name to create a new SCFile object, and then tests the
resulting object to see if it is valid. If the file name is valid, it contains the expected properties and methods
(such as doSelect).

  function testFile( fname )
  {
  var undefined;
  var f = new SCFile( fname );
  if ( typeof f == "object" && f.doSelect != undefined )
  {
  print( fname + " is a real file!" );
  }
  else
  print( fname + " is NOT a real file!" );
  }
  testFile( "nonexistentfile" );
  testFile( "contacts" );


1.2.5.6.5. Example: Updating a field with the current
date and time

This JavaScript example demonstrates how to update a field with the current date and time. The script
takes a file object (such as system.vars.$L_file or an SCFile object) and a string containing the name of a
datetime field in that file, and updates the indicated field with the current date and time.
This script illustrates several key concepts of using JavaScript in Service Manager.

     How to call the RAD filename function from JavaScript.
     How to access a field in a record using an expression of the form file[ fieldName ] where fieldName
     is a string.
     How to test the field’s data type.
     How to return JavaScript date objects when you reference Service Manager datetime fields.
     How to assign JavaScript date objects to Service Manager datetime fields.
     How to use SCFile method return codes to test against global properties like RC_SUCCESS.
     How to obtain a localized error message from a return code value using the RCtoString method.
     How to pass traditional query strings that are in Service Manager syntax directly to the doSelect
     method.
     How to use underscores in JavaScript to reference Service Manager field names containing dots
     (such as contact.name).

This script demonstrates calling the datetimestamp function. It selects a record from the contacts table and
updates the sysmodtime field.

  var f = new SCFile( "contacts" );
  f.doSelect( "contact.name = \"BROWN, NICHOLAS\"" );
  print( "sysmodtime was: " + f.sysmodtime );
  datetimestamp( f, "sysmodtime" );
  print( "sysmodtime is now: " + f.sysmodtime );

This script demonstrates how passing the wrong kind of field to the datetimestamp function generates an
error message.


datetimestamp( f, "contact_name" );
function datetimestamp( file, fieldName )
{
var fileName;
var today;
var fieldType;
var rc;
fileName = system.functions.filename( file );
today = new Date();
print( "datetimestamp called for file " + fileName + " and field " + fieldName );
var d = new SCDatum( file[fieldName] );
fieldType = d.getType();
if ( fieldType != "TIME" )
{
print( "Error! Field " + fieldName + " is a " + fieldType + " field!

                             This function can only be called with date/time fields!" );
return false;
}
file[fieldName] = today; // Timestamp the field
rc = file.doUpdate();
if ( rc != RC_SUCCESS )
{
print( "Error " + RCtoString(rc) + " trying to update " + fileName + " record" );
return false;
}
return true;
}


1.2.5.6.6. Example: Working with structured arrays

This JavaScript example shows you how to work with structured arrays.

            Note

           The sample "teststructarray" has the following Database Dictionary format fields:
                id character
                arr array
                arr structure
                a number
                b character

This table has an array of type structure called "arr."

            Note

           : To populate the elements of the field, the elements have to be populated in order.

var fvar = SCFile("teststructarray");

fvar.id="abc";

fvar.arr[2].a=10;                       // Add field 'a' first

fvar.arr[2].b="Test"; // Then add field 'b'

print(fvar);

[C++ object SCFile] - teststructarray={[["abc",{{[, ]},, {[10, "Test"]}}]}

          Caution

         Populating the fields out of order will cause an error.

For example, this will break the structure:

  fvar.arr[2].b="Test"; // This will break the structure!
  fvar.arr[2].a=10;
````
