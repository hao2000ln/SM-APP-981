---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.2.5.3.3 .. 1.2.5.3.3
printed_pages: 1622-1652
---

# 1.2.5.3.3 JavaScript object: SCDatum

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.5.3.3. JavaScript object: SCDatum

The following JavaScript object is unique to Service Manager.

With no arguments, the SCDatum() constructor creates an empty SCDatum object.

With an object argument, the SCDatum() constructor creates an SCDatum object
containing the provided record, structure, or array. You must enclose table names and
arrays in quotation marks.

This object's methods use the Service Manager-defined global return codes.

Constructor

new SCDatum()
new SCDatum(object)

Arguments
The following arguments are valid for this object:

Argument                                Data type   Description
object                                  String
                                                    The table name, record,
                                                    structure, or array you
                                                    want to query or update.

Properties
None
Methods
The following methods are valid for this object:

 Defined method                                                                                  Service Manager 9.81
 getSize()
 getText()                              Description
 getType()                              This method returns the size of the
 getXML()                               object.
 join()                                 This method returns a text representation
 JSDate()                               of the object.
 length()                               This method returns the object type.
 pop()                                  This method returns an XML
 push()                                 representation of the object.
 setType()                              This method returns a string of all the
 setValue()                             entries in the array.
 shift()                                This method returns a JavaScript Date
 toArray()                              object.
 unshift()                              This method returns the length of the
                                        object.
This PDF was generated on May 23, 2026  This method removes an item from an
                                        array.
                                        This method adds an item to an array.
                                        This method sets the object type.
                                        This method sets the object to a given
                                        value.
                                        This method returns a string of all the
                                        entries in the array.
                                        This method converts an object to a
                                        JavaScript array.
                                        This method returns a string of all the
                                        entries in the array.

                                                                                                                          Page 19 of 250

1.2.5.3.3.1. JavaScript method:
SCDatum.getSize()

This method returns the number of array elements in an array stored in a Service Manager
Datum object. You can use this method to return the length of Service Manager array
fields, which are always stored as Datum objects. To query a particular array field in an
SCFile object, you can use the following format:
SCFile_object.array_field_name.getSize()

Replace any periods in the name of array_field_name with underscores. For example,
you must convert the Service Manager array field update.action to update_action when
querying it from JavaScript.

Syntax

  SCDatum_object.getSize();

Arguments

There are no arguments for this method.

Return values

A number and RC_SUCCESS or one of the other global return code values.

The method returns the number of array elements in an array stored in a Service Manager
Datum object and a global return code value of RC_SUCCESS , or returns one of the error
global return code values if the method can't return the number of array elements.

Example

This example does the following:

     Searches the probsummary table for any incident record you define in the search
     variable
     Attempts to get the size of the returned SCFile object (the result is always zero)
     Displays the contents of the action field (the action field contains Service Manager
     array data)
     Displays the size of the action field using the Service Manager getSize() method
     Converts the SCFile object into a JavaScript array using the Service Manager
     toArray() method
     Displays the size of the new JavaScript array using the core JavaScript length
     property

This example requires the following sample data:


A valid incident record number (for example, "IM1005")

var incidentQuery;

function findIncidents( query )
{

 print( "Searching for incident records starting with " + query +
"..." );

 var incidentFile = new SCFile( "probsummary" );
 var findIncident = incidentFile.doSelect( "number#\""+ query + "\""
);
 if ( findIncident == RC_SUCCESS )
 {
 print( "Success. Found incident records starting with " + query +
". The first record is:\n" + incidentFile );
 var objectSize = incidentFile.getSize();
 print( "Running the getSize() method on the returned SCFile object
produces the following result: " + objectSize );
 var actionText = incidentFile.action;
 print( "The contents of the action field is:\n" + actionText );
 var actionSize = incidentFile.action.getSize();
 print( "The size of the action field is: " + actionSize );
 print( "Converting the SCFile object to a JavaScript array..." );
 var incidentArray = incidentFile.toArray();
 print( "The new JavaScript array is:\n" + incidentArray );
 var arraySize = incidentArray.length;
 print( "The size of the converted array is: " + arraySize );

              return incidentFile;
 }
 else
 {

   print( "Could not find incident records starting with " + query +
". " + RCtoString( findIncident ) );

   return null
 }
}

incidentQuery = "IM1005";
findIncidents( incidentQuery );


1.2.5.3.3.2. JavaScript method:
SCDatum.getText()

This method returns a text string representation of the current SCFile or SCDatum object.
The text string has the following format:

  table={["field value",{"array value","array value"},...]}

Syntax

  SCFile_object.getText();

  SCDatum_object.getText();

Arguments
There are no arguments for this method.
Return values
A string and RC_SUCCESS or one of the other global return code values.
The method returns a text string containing the current SCFile or SCDatum object and a
global return code value of RC_SUCCESS , or returns one of the error global return code
values if the method can't return a string.
Example
This example does the following:

     Searches the contacts table for any contact name you define in the search variable
     Displays the contact record as a text string
This example requires the following sample data:
     A valid contact name (for example, "ADMINISTRATOR, SYSTEM")
     A invalid contact name (for example, "NOT A, CONTACT")


var contactName;

function findContactName( name )
{

 print( "Searching for contact: " + name + "..." );
 var contactList = new SCFile( "contacts" );
 var findContact = contactList.doSelect( "contact.name=\""+ name +
"\"" )
 if ( findContact == RC_SUCCESS )
 {

   print( "Success. found " + name + " in contact record:\n" +
contactList.getText() );

   return contactList
 }
 else
 {

   print( "Could not find contact. " + RCtoString( findContact ) );
   return null
   }
}

contactName = "ADMINISTRATOR, SYSTEM";
findContactName( contactName );

contactName = "NOT A, CONTACT";
findContactName( contactName );


1.2.5.3.3.3. JavaScript method:
SCDatum.getType()

This method returns the data type of Service Manager datum objects, such as arrays and
structured arrays. This method fails on any scalar fields within file records, such as
number fields, date fields, string fields, and boolean fields. To determine the type of
scalar fields you can use, see the core JavaScript .type property in the JavaScript Guide
at http://developer.mozilla.org/.
Syntax

  SCFile_object.getType();

  SCDatum_object.getType();

Arguments

There are no arguments for this method.

Return values

A data type and RC_SUCCESS or one of the other global return code values.

The method returns a data type and a global return code value of RC_SUCCESS or
returns one of the error global return code values, if the method can't determine the data
type.

Example

This example does the following:

     Searches the probsummary table for any incident record you define in the search
     variable
     Displays the contents of the incident record object
     Returns the data type of the incident record object using the getType() method
     Displays the contents of the action field object
     Returns the data type of the action field object using the getType() method
     Displays the contents of the category field
     Returns the data type of the category field object using the core JavaScript type
     property

This example requires the following sample data:

     A valid incident record (for example, "IM1001")


var incidentQuery;

function findTypes( query )
{

 print( "Searching for incident records starting with " + query +
"..." );

 var incidentFile = new SCFile( "probsummary" );
 var findIncident = incidentFile.doSelect( "number#\""+ query + "\""
);
 if ( findIncident == RC_SUCCESS )
 {

   print( "Success. Found incident records starting with " + query +
". The first record is:\n" + incidentFile );

   var objectType = incidentFile.getType();
   print( "The object incidentFile is of type: " + objectType );
   var arrayField = incidentFile.action;
   print( "The contents of the action field are:\n" + arrayField );
   fieldType = arrayField.getType();
   print( "The type of the action field is: " + fieldType );
   var textField = incidentFile.category;
   print( "The contents of the category field are:\n" + textField );
   fieldType = textField.getType;
   print( "The type of the category field is: " + fieldType );
 }
 else
 {
   print( "Could not find incident records starting with " + query +
". " + RCtoString( findIncident ) );
   return null
 }
}

incidentQuery = "IM1001";
findTypes( incidentQuery );


1.2.5.3.3.4. JavaScript method:
SCDatum.getXML()

This method returns an XML object representation of the current SCFile or SCDatum
object. The XML object has the following format, which is compatible with the Service
Manager Web services API:
<model name="table" query="query"><keys><fieldname>key value</fieldname>...
</keys><instance><fieldname>instance value</fieldname>...</instance></model>
Syntax

  SCFile_object.getXML();

  SCDatum_object.getXML();

Arguments
There are no arguments for this method.
Return values
An XML object and RC_SUCCESS or one of the other global return code values.
The method returns an XML object containing the current SCFile or SCDatum object and a
global return code value of RC_SUCCESS or returns one of the failure global return code
values if the method can't return an XML object.
Example
This example does the following:

     Searches the contacts table for any contact name you define in the search variable
     Displays the contact record as an XML object
This example requires the following sample data:
     A valid contact name (for example, "ADMINISTRATOR, SYSTEM")
     A invalid contact name (for example, "NOT A, CONTACT")


var contactName;

function findContact( name )
{

 print( "Searching for contact: " + name + "..." );
 var contactList = new SCFile( "contacts" );
 var isContact = contactList.doSelect( "contact.name=\""+ name +
"\"" )
 if ( isContact == RC_SUCCESS )
 {

   print( "Success. found " + name + " in contact record:\n" +
contactList.getXML() );

   return contactList
 }
 else
 {

   print( "Could not find contact. " + RCtoString( isContact ) );
   return null
 }
}

contactName = "ADMINISTRATOR, SYSTEM";
findContact( contactName );

contactName = "NOT A, CONTACT";
findContact( contactName );


1.2.5.3.3.5. JavaScript method:
SCDatum.join()

This method returns the elements of either a Service Manager Datum array object or a
JavaScript array. This method doesn't use the Service Manager global return code values.
Syntax

  SCDatum_object.join();

Arguments
There are no arguments for this method.
Return values
A string.
The method returns the elements of an array.
Example
This example does the following:

     Searches the probsummary table for any incident record you define in the search
     variable
     Displays the new incident record as a text string
     Displays the contents of action field using the join() method
This example requires the following sample data:
     A valid value for the number field (for example, "IM1010")
     An incident record with an action field value (for example, "IM1010")


var incidentID;

function findIncident( id )
{

 print( "Searching for Incident record: " + id + "..." );
 var incidentFile = new SCFile( "probsummary" );
 var rc = incidentFile.doSelect( "number=\"" + id + "\"" )
 if ( rc == RC_SUCCESS )
 {

   print( "Success. found Incident record:\n" +
incidentFile.getText() );

   print( "Displaying the contents of the action field as an object:
" + incidentFile.action );

   print( "Displaying the contents of the action field with join()
method: " + incidentFile.action.join() );

   return incidentFile
 }
 else
 {

   print( "Could not find Incident record. " + RCtoString( rc ) );
   return null
 }
}

incidentID = "IM1010";
findIncident( incidentID );


1.2.5.3.3.6. JavaScript method:
SCDatum.JSDate()

This method is deprecated as of version 6.1 with the introduction of the SCFile object. This
method converted Service Manager date/time data into JavaScript date/time objects. The
SCFile object now automatically converts Service Manager date/time data into JavaScript
date/time objects. Alternatively, you can now use the XMLDate object and its methods to
convert between date/time formats.

Syntax

SCDatum_object.JSDate( dataType );

Arguments
The following arguments are valid for this method:

Argument                                Data type   Description
dataType                                String
                                                    This argument specifies
                                                    the data type of a field in
                                                    an SCDatum object.

Return values

None

Example

This example does the following:

     Searches the probsummary table for any incident record you define in the search
     variable
     Displays the incident record and the value of the open.time field
     Creates an SCDatum object containing the number of milliseconds you want to
     convert
     Converts the open.time field into an SCDatum object (by default the open.time field
     data is in Service Manager's date/time data type)
     Converts the SCDatum object into a JavaScript date/time

This example requires the following sample data:

     A valid incident record with a value in the open.time field (for example, "IM1010")


var incidentID;

function findIncident( id )
{

 print( "Searching for incident: " + id + "..." );
 var incidentFile = new SCFile( "probsummary" );
 var f = incidentFile.doSelect( "number=\""+ id + "\"" );
 if ( f == RC_SUCCESS )
 {

   print( "Success. found " + id + " in incident record:\n" +
incidentFile.getText() );

   print( "The value of the open.time field is: " +
incidentFile.open_time );

   print( "Converting open.time to an SCDatum object..." );
   var dat = new SCDatum( incidentFile.open_time );
   print( "The new SCDatum object is: " + dat );
   print( "Converting the SCDatum object to a JSDate..." );
   var j = dat.JSDate();
   print( "The converted SCDatum object is: " + j );
   return incidentFile
 }
 else
 {
   print( "Could not find incident record. " + RCtoString( f ) );
   return null
 }
}

incidentID = "IM1010";
findIncident( incidentID );


1.2.5.3.3.7. JavaScript method:
SCDatum.length()

This method returns the number of array elements in an array stored in a Service Manager
Datum object. You can use this method to return the length of Service Manager array
fields, which are always stored as Datum objects. To query a particular array field in an
SCFile object, use the following format: SCFile_object.array_field_name.length() .

            Note

           Replace any periods in the name of array_field_name with underscores. For
           example, you must convert the Service Manager array field update.action to
           update_action when querying it from JavaScript.

Syntax

  SCDatum_object.length();

Arguments

There are no arguments for this method.
Return value

A number and RC_SUCCESS or one of the other global return code values.
The method returns the number of array elements in an array stored in a Service Manager
Datum object and a global return code value of RC_SUCCESS or returns one of the error
global return code values if the method can't return the number of array elements.

Example

This example does the following:

     Searches the probsummary table for any incident record you define in the search
     variable
     Attempts to get the size of the returned SCFile object (the result is always zero)
     Displays the contents of the action field (the action field contains Service Manager
     array data)
     Displays the size of the action field using the Service Manager length() method
     Converts the SCFile object into a JavaScript array using the Service Manager
     toArray() method
     Displays the size of the new JavaScript array using the core JavaScript length
     property


var incidentQuery;

function findIncidents( query )
{

 print( "Searching for incident records starting with " + query +
"..." );

 var incidentFile = new SCFile( "probsummary" );
 var findIncident = incidentFile.doSelect( "number#\""+ query + "\""
);
 if ( findIncident == RC_SUCCESS )
 {

   print( "Success. Found incident records starting with " + query +
". The first record is:\n" + incidentFile );

   var objectSize = incidentFile.getSize();
   print( "Running the getSize() method on the returned SCFile object
produces the following result: " + objectSize );
   var actionText = incidentFile.action;
   print( "The contents of the action field is:\n" + actionText );
   var actionSize = incidentFile.action.getSize();
   print( "The size of the action field is: " + actionSize );
   print( "Converting the SCFile object to a JavaScript array..." );
   var incidentArray = incidentFile.toArray();
   print( "The new JavaScript array is:\n" + incidentArray );
   var arraySize = incidentArray.length;
   print( "The size of the converted array is: " + arraySize );

              return incidentFile;
 }
 else
 {

   print( "Could not find incident records starting with " + query +
". " + RCtoString( findIncident ) );

   return null
 }
}

incidentQuery = "IM1005";
findIncidents( incidentQuery );


1.2.5.3.3.8. JavaScript method:
SCDatum.pop()

This method removes the last element from a JavaScript array and returns the element
removed as a string. This method doesn't use the Service Manager global return code
values.
Syntax

  SCDatum_object.pop();

Arguments
There are no arguments for this method.
Return values
A string.
The method returns the element removed from the array.
Example
This example does the following:

     Searches the probsummary table for any incident record you define in the search
     variable
     Displays the new incident record as a text string
     Converts the action field into a JavaScript array
     Adds an item to the end of the array and displays the total number of elements in the
     array
     Removes an item from the end of the array and displays the array item removed

This example requires the following sample data:

     A valid value for the number field (for example, "IM1010")
     An incident record with an action field value (for example, "IM1010")


var incidentID;
function findIncident( id )
{
print( "Searching for Incident record: " + id + "..." );
var incidentFile = new SCFile( "probsummary" );
var rc = incidentFile.doSelect( "number=\"" + id + "\"" )
if ( rc == RC_SUCCESS )
{
print( "Success. found Incident record:\n" + incidentFile.getText()
);
print( "Converting the action field to a JavaScript array..." );
var a = incidentFile.action.toArray();
print( "The action field array contains the following: " + a );
print( "Pushing new array entry..." );
var addOne = a.push( "First array item" );
print( "The number of items in the array are: " + addOne );
print( "The action field array contains the following: " + a );
print( "Popping new array entry..." );
var removeOne = a.pop();
print( "The array item removed was: " + removeOne );
print( "The action field array contains the following: " + a );
return incidentFile;
}
else
{
print( "Could not find Incident record. " + RCtoString( rc ) );
return null
}
}
incidentID = "IM1010";
findIncident( incidentID );


1.2.5.3.3.9. JavaScript method:
SCDatum.push()

This method adds an entry to the end of a JavaScript array and returns the total number
of entries in the array. If you apply this method to a Service Manager array object, then it
adds the item but doesn't return the number of entries in the array. This method doesn't
use the Service Manager global return code values.

Syntax

SCDatum_object.push( arrayItem );

Arguments
The following arguments are valid for this method:

Argument                                Data type   Description
arrayItem                               String
                                                    This argument specifies
                                                    the array item you want to
                                                    add to a JavaScript array.

Return values

A number.

The method returns the number of items in the array.

Example

This example does the following:

     Searches the probsummary table for any incident record you define in the search
     variable
     Displays the new incident record as a text string
     Converts the contents of the action field into a JavaScript array
     Adds an item to the end of the JavaScript array and prints the total number of items
     in the array

This example requires the following sample data:

     A valid value for the number field (for example, "IM1010")
     An incident record with an action field value (for example, "IM1010")


var incidentID;
function findIncident( id )
{
print( "Searching for Incident record: " + id + "..." );
var incidentFile = new SCFile( "probsummary" );
var rc = incidentFile.doSelect( "number=\"" + id + "\"" )
if ( rc == RC_SUCCESS )
{
print( "Success. found Incident record:\n" + incidentFile.getText()
);
print( "Converting the action field to a JavaScript array..." );
var a = incidentFile.action.toArray();
print( "The action field array contains the following: " + a );
print( "Pushing new array entry..." );
var addOne = a.push( "First array item" );
print( "The number of items in the array are: " + addOne );
print( "The action field array contains the following: " + a );
print( "Pushing new array entry..." );
var addTwo = a.push( "Second array item" );
print( "The number of items in the array are: " + addTwo );
print( "The action field array contains the following: " + a );
return incidentFile;
}
else
{
print( "Could not find Incident record. " + RCtoString( rc ) );
return null
}
}
incidentID = "IM1010";
findIncident( incidentID );


1.2.5.3.3.10. JavaScript method:
SCDatum.setType()

This method sets the data type of Service Manager datum objects. The SCDatum object
also automatically converts Service Manager data types into corresponding JavaScript
data types. You can also use the XMLDate object and its methods to convert between
date/time formats.

Syntax

SCDatum_object.setType( dataType );

Arguments
The following arguments are valid for this method:

Argument                                Data type   Description
dataType                                Number
                                                    This argument specifies
                                                    the Service Manager data
                                                    type for the object. See
                                                    Data types.

Return values

None
Example

This example does the following:

     Creates an SCDatum object containing the number of milliseconds you want to
     convert
     Sets the data type of the SCDatum object to a Service Manager date/time type
     Converts the number of milliseconds into a JavaScript date/time

This example requires the following sample data:

     A number of milliseconds (for example, "1234567890")


var millisecs;
function findDateTime( num )
{
var t = new SCDatum( num );
t.setType( 3 );
print( num + " milliseconds is equal to the date: " + t.JSDate() );
}
millisecs = 1234567890;
findDateTime( millisecs );


1.2.5.3.3.11. JavaScript method:
SCDatum.setValue()

This method updates an Service Manager record with the new field value defined in the
newValue argument. This method doesn't use the Service Manager global return codes.

Syntax

SCDatum_object.setValue( newValue );

Arguments
The following arguments are valid for this method:

Argument                                Data type   Description
newValue                                String
                                                    This argument specifies
                                                    the new value you want
                                                    the Service Manager
                                                    object to have. You must
                                                    use the slash character to
                                                    escape out quotation
                                                    marks and any special
                                                    characters restricted from
                                                    JavaScript.

Return values
None

Example

This example does the following:

     Searches the probsummary table for any incident record you define in the search
     variable
     Displays the current value of the action field
     Sets the value of the action field to any value you define in the input variable

This example requires the following sample data:

     A valid incident record with a value in the action field (for example, "IM1010")


   A valid action field value update (for example, set the action field to "New
   description")

var incidentID;
var newValue;
function findIncident( id, value )
{
print( "Searching for Incident record: " + id + "..." );
var incidentFile = new SCFile( "probsummary" );
var rc = incidentFile.doSelect( "number=\"" + id + "\"" )
if ( rc == RC_SUCCESS )
{
print( "Success. found Incident record " + id );
print( "Displaying the contents of the action field as an object: "
+ incidentFile.action );
print( "Setting the value of the action field..." );
incidentFile.action.setValue( value );
print( "Displaying the contents of the action field as an object: "
+ incidentFile.action );
print( "Displaying the Incident record: " + incidentFile );
return incidentFile
}
else
{
print( "Could not find Incident record. " + RCtoString( rc ) );
return null
}
}
incidentID = "IM1010";
newValue = "New description";
findIncident( incidentID, newValue );


1.2.5.3.3.12. JavaScript method:
SCDatum.shift()

This method removes the first element from a JavaScript array and returns the element
removed as a string. This method doesn't use the Service Manager global return code
values.
Syntax

  SCDatum_object.shift();

Arguments
There are no arguments for this method.
Return values
A string.
The method returns the element removed from the array.
Example
This example does the following:

     Searches the probsummary table for any incident record you define in the search
     variable
     Displays the new incident record as a text string
     Converts the action field into a JavaScript array
     Adds an item to the end of the array and displays the total number of elements in the
     array
     Removes an item from the beginning of the array and displays the array item
     removed

This example requires the following sample data:

     A valid value for the number field (for example, "IM1010")
     An incident record with an action field value (for example, "IM1010")


var incidentID;
function findIncident( id )
{
print( "Searching for Incident record: " + id + "..." );
var incidentFile = new SCFile( "probsummary" );
var rc = incidentFile.doSelect( "number=\"" + id + "\"" )
if ( rc == RC_SUCCESS )
{
print( "Success. found Incident record:\n" + incidentFile.getText()
);
print( "Converting the action field to a JavaScript array..." );
var a = incidentFile.action.toArray();
print( "The action field array contains the following: " + a );
print( "Pushing new array entry..." );
var addOne = a.push( "First array item" );
print( "The number of items in the array are: " + addOne );
print( "The action field array contains the following: " + a );
print( "Shifting array one entry..." );
var removeOne = a.shift();
print( "The array item removed was: " + removeOne );
print( "The action field array contains the following: " + a );
return incidentFile;
}
else
{
print( "Could not find Incident record. " + RCtoString( rc ) );
return null
}
}
incidentID = "IM1010";
findIncident( incidentID );


1.2.5.3.3.13. JavaScript method:
SCDatum.toArray()

This method converts an Service Manager Datum object into a JavaScript array.
Syntax

  SCDatum_object.toArray();

Arguments
There are no arguments for this method.
Return values
A JavaScript array and RC_SUCCESS or one of the other global return code values.
Example
This example does the following:

     Searches the probsummary table for any incident record you define in the search
     variable
     Displays the incident record as a text string
     Converts the contents of the action field into a JavaScript array
This example requires the following sample data:
     A valid incident record number (for example, "IM1010")
     An incident record with an action field value (for example, "IM1010")


var incidentID;
function findIncident( id )
{
print( "Searching for Incident record: " + id + "..." );
var incidentFile = new SCFile( "probsummary" );
var rc = incidentFile.doSelect( "number=\"" + id + "\"" )
if ( rc == RC_SUCCESS )
{
print( "Success. found Incident record:\n" + incidentFile.getText()
);
print( "Converting the action field to a JavaScript array..." );
var a = incidentFile.action.toArray();
print( "The action field contains the following " + a );
return incidentFile
}
else
{
print( "Could not find Incident record. " + RCtoString( rc ) );
return null
}
}
incidentID = "IM1010";
findIncident( incidentID );


1.2.5.3.3.14. JavaScript method:
SCDatum.unshift()

This method adds an entry to the beginning of a JavaScript array and returns the total
number of entries in the array. If you apply this method to a Service Manager array object,
then it adds the item but doesn't return the number of entries in the array. This method
doesn't use the Service Manager global return code values.

Syntax

SCDatum_object.unshift( arrayItem );

Arguments
The following arguments are valid for this method:

Argument                                Data type   Description
arrayItem                               String
                                                    This argument specifies
                                                    the array item you want to
                                                    add to a JavaScript array.

Return values

A number.

The method returns the number of items in the array.

Example

This example does the following:

     Searches the probsummary table for any incident record you define in the search
     variable
     Displays the new incident record as a text string
     Converts the contents of the action field into a JavaScript array
     Adds an item to the beginning of the JavaScript array and prints the total number of
     items in the array

This example requires the following sample data:

     A valid value for the number field (for example, "IM1010")
     An incident record with an action field value (for example, "IM1010")


var incidentID;
function findIncident( id )
{
print( "Searching for Incident record: " + id + "..." );
var incidentFile = new SCFile( "probsummary" );
var rc = incidentFile.doSelect( "number=\"" + id + "\"" )
if ( rc == RC_SUCCESS )
{
print( "Success. found Incident record:\n" + incidentFile.getText()
);
print( "Converting the action field to a JavaScript array..." );
var a = incidentFile.action.toArray();
print( "The action field array contains the following: " + a );
print( "Unshifting array one entry..." );
var unshifting = a.unshift( "First array item" );
print( "The number of items in the array are: " + unshifting );
print( "The action field array contains the following: " + a );
return incidentFile;
}
else
{
print( "Could not find Incident record. " + RCtoString( rc ) );
return null
}
}
incidentID = "IM1010";
findIncident( incidentID );
````
