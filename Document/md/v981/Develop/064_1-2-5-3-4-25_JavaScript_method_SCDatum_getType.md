---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.2.5.3.4.25 .. 1.2.5.3.5
printed_pages: 1706-1730
---

# 1.2.5.3.4.25 JavaScript method: SCDatum.getType()

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.5.3.4.25. JavaScript method:
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


1.2.5.3.4.26. JavaScript method:
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


1.2.5.3.4.27. JavaScript method:
SCFile.insertattachment()

This method creates a new attachment associated with the current file record. Before
calling insertAttachment, you must establish a current record using one of the positioning
methods, such as doSelect(), getNext(), etc.
Syntax

  SCFile_object.insertAttachment( attachObj );

Arguments
The insertAttachment method takes one argument, which is an asttachment object.
The Attachment object must be properly populated prior to calling insertAttachment.
Attachment objects can be obtained via Web Services calls or constructed by JavaScript
code.
Required properties
Attachment.name: This is a string containing the name of the attachment, for example,
foo.txt or foo.pdf.
Attachment.type: This is a string containing the MIME type of the attachment, such as
text/plain or application/pdf.
Attachment.value: This is a binary string containing the actual attachment data. One way
to obtain such data is by using the readFile() global method with the binary file format
(readFile(path,"b")).
The "href" property of the attachment object should not be set for an insert operation.
Any value supplied will be ignored. Attachment ID values are assigned by the server when
attachments are inserted or updated.
Return values
If successful, insertAttachment() returns a string of the form cid:xxxxxx containing the
attachment ID for the inserted attachment.
Example
This example does the following:

     Creates a new attachment object
     Selects one record from the probsummary table


     Inserts the attachment object to the current record
This example requires the following sample data:

     Record number IM10001 in the probsummary table

var attachmentObj = new Attachment();
attachmentObj.type = "text/plain";
attachmentObj.name = "MyAttachment.txt";
attachmentObj.value = "This is a test text attachment";
var f = new SCFile( 'probsummary' );
var rc = f.doSelect( 'number = "IM10001"' );
var attachmentID = f.insertAttachment( attachmentObj );


1.2.5.3.4.28. JavaScript method:
SCFile.isRecord()

This is a deprecated method as of version 6.1 because it doesn't use the Service
Manager-defined global return codes. It requires using the deprecated File() object with a
query or query condition. The isRecord() method verifies that the query or query
condition returns a Service Manager record.
Syntax

  SCFile_object.isRecord();

Arguments
There are no arguments for this method.
Return values
A Boolean value: 1 (true) or 0 (false).
The method returns a Boolean value of 1 if the File object contains a Service Manager
record or returns 0 if the method doesn't find a Service Manager record.
This method doesn't use the Service Manager-defined global return codes.
Example
This example does the following:

     Searches the probsummary table for any incident record you define in the search
     variable
     Displays the incident record object and the results of the isRecord() method
This example requires the following sample data:
     A valid incident record (for example, "IM1005")
     An invalid incident record (for example "incident")


var incidentQuery;
function findTypes( query )
{
print( "Searching for incident records starting with " + query +
"..." );
var incidentFile = new File( "probsummary", "number#\""+ query +
"\"" );
if ( incidentFile != null )
{
print( "Successfully allocated a File object");
if ( incidentFile.isRecord() )
{
print( "Success. Found incident records starting with " + query + ".
The first record is:\n" + incidentFile );
return incidentFile
}
else
{
print( "Could not find incident records starting with " + query +
"." );
return null
}
}
else
{
print( "Could not allocate a File object." );
return null
}
}
incidentQuery = "IM1005";
findTypes( incidentQuery );
incidentQuery = "incident";
findTypes( incidentQuery );


1.2.5.3.4.29. JavaScript method:
SCFile.setBinary()

This method saves binary data to a field in a Service Manager file object.
Syntax

SCFile_object.setBinary (fieldName, binaryObj);

Arguments
The following arguments are valid for this method:

Argument                                Data type   Description
fieldName                               String
                                                    The name of a field in
binaryObj                               String      which you want to save
                                                    the binary data.

                                                    The name of a JS object
                                                    that contains the binary
                                                    data.

Return values

RC_SUCCES S or one of the other global return code values. The method returns
RC_SUCCESS if the method successfully saves binary data to a Service Manager file
object or returns one of the error global return code values if the method can't save
binary data to a Service Manager file object.

Example

var f = new SCFile("contacts");
rc = f.doSelect('contact.name#"AARON"');
var attachmentObj = f.getAttachments();
var b = new SCFile("blob1");
b.name = attachmentObj[0].name;
b.setBinary ("data",attachmentObj[0].value );
rc = b.doSave();


1.2.5.3.4.30. JavaScript method:
SCFile.setFields()

This method causes any subsequent doSelect() calls to fetch only the specified fields. If
setFields has not been called on a table, all fields are selected and a "SELECT *" is
performed.
This method is supported for read-only objects. You can make an object read-only
specifying the SCFILE_READONLY argument in the SCFile constructor.
Calling setFields with no parameters will reset any previously specified fields. Any
subsequent calls to doSelect() will fetch all fields (a SELECT * will be performed).

            Note

           Do not reference fields in the object that have not been specified in the
           setFields method. If you reference field in the object that has not been
           specified in the setFields method, the field appears as "null" whether the
           database has data in that column or not.

Syntax

  SCFile_object.setFields( field-array );
  SCFile_object.setFields( field-string );
  SCFile_object.setFields( );

Arguments
The following arguments are valid for this method:


Argument                                Data type  Description
field-array                             Array
                                                   A javascript array of field
field-string                            String     name strings; for example,
                                                   setFields(new
                                                   Array("contact.name",
                                                   "user.id")) .

                                                   A string of space-
                                                   separated field names; for
                                                   example,
                                                   setFields("contact.name
                                                   user.id") .

Return values

The method returns RC_SUCCESS if successful and RC_ERROR on failure.

The following conditions cause a setFields failure:

     Calling setFields on an uninitialized SCFile or a non read-only SCFile
     Calling setFields with an invalid argument type (not a string or an array of strings)
     Calling setFields with one (or more) invalid fields. (The method performs a basic
     validation on the field names to ensure they exist in the DBDICT.)

When the method fails, it has no effect, and the last successful call to setFields stays in
effect. It issues a warning in the sm.log file.

Limitations

     The main unique key fields of the dbdict are always selected from the table (and for
     join tables, from each underlying table) even if not explicitly specified in setFields.

     Since only basic field validation is performed in the setFields method, there are
     certain situations when the call can be successful (returns RC_SUCCESS ) but a
     "SELECT *" is still performed.

     This would be the case if:

           All specified fields exist in the DBDICT but at least one field is an alias field, a
           structure name or an unmapped field (which are unsupported).
           LDAP is the primary data source for the table. (LDAP mapped fields are
           supported as long as LDAP is not the primary data source.)

Example usage

This example does the following:


     Takes the prefix of a contact name and returns a list of contacts that start with the
     specified prefix.
     On failure, returns the message "Could not find contact."
This example requires the following sample data:
     a contacts table with some records

  function findPrefix( prefix )
  {
  var contactList = new SCFile( "contacts", SCFILE_READONLY ); //added
  new parameter SCFILE_READONLY
  var fields = new Array("contact.name", "user.id"); // build array of
  fields to be returned from DB
  var rc = contactList.setFields( fields ); // call new setFields
  method to identify fields to query from DB
  if ( rc != RC_SUCCESS )
  {
  print( "setFields() failed, will revert to SELECT * (see log for
  more info)" );
  return null;
  }
  var findContact = contactList.doSelect( "contact.name # \"" + prefix
  + "\"" );
  if ( findContact == RC_SUCCESS )
  {
  return contactList;
  }
  else
  {
  print( "Could not find contact. " + RCtoString( findContact ) );
  return null;
  }
  }

Related topics

JavaScript object: SCFile
JavaScript method: SCFile.doSelect()


1.2.5.3.4.31. JavaScript method:
SCFile.setOrderBy()

This method causes any subsequent doSelect() call on a SCFile object to fetch only the
specified fields by the specified sort sequences of the SCFileObject. If setOrderBy() has
not been called, a subsequent doSelect() will use the default sort sequence.

Syntax

SCFile_object.setOrderBy(sortFields, sortSeqs);

Arguments
The following arguments are valid for this method:

Argument                                Data type   Description
sortFields                              Array
                                                    A javascript array of field
sortSeqs                                Array       name string, for example,
                                                    newArray
                                                    ("name","company") .

                                                    A javascript array of sort
                                                    sequenence specification.
                                                    It is either a
                                                    SCFILE_ASC , or
                                                    SCFILE_DSC . For
                                                    example, new
                                                    Array(SCFILE_ASC,
                                                    SCFILE_DSC);
                                                    SCFILE_ASC is a constant
                                                    for specifying sort by
                                                    ascending order, and
                                                    SCFILE_DSC for
                                                    specifying sort by
                                                    descending order.

Required properties

This method requires two parameters of the data type of array. The two arrays must be of
the same length. Calling setOrderBy() with parameters of uneven length of arrays or non-
array data results in failure return status.


Return values
Returns RC_SUCCESS if successful and RC_ERROR on failure.
The following conditions cause a setOrderBy() failure:

     Calling setOrderBy() on an uninitialized SCFile
     Calling setOrderBy() with an invalid argument type (not an array) for either
     argument.
     Calling setOrderBy() with wrong number of arguments.
     Calling setOrderBy() with two arrays of different length.
     Calling setOrderBy() with one (or more) invalid fields. (The method performs a basic
     validation on the field names to ensure they exist in the DBDICT.

A warning is written to SM.log file.
If the sort sequence specifications in the sortSeq array is of non-recognizable constant,
SCFILE_ASC is assumed.
Limitations:

     Fields used in setOrderBy() should not be within an array in the dbdict.
     Fields from a join file should not be within a structure in the dbdict.

Example

            Note

           If you are running setOrderBy() on a single array, these samples show how to
           define a single sort sequence for descending sort order.

   1. var sortOrder = [SCFILE_DSC];
   2. var sortOrder = new Array(1);

sortOrder[0] = SCFILE_DSC;
This example does the following:

     Takes two fields, name and company, from the operator table, and sorts the
     company field by descending order, then the name field by ascending order.
     On failure returns a RC_ERROR status code.

This example requires the following sample data:

     Records in the operator table that have various company and name fields.


function runOrderByTest( table, fields, sortOrder)
{
var timeBefore = new Date();
var fCount = 0;
print( "doSelect select column OrderBy test : Start time is: " +
timeBefore );
var fRec = new SCFile( table);
var setOrderByRC = fRec.setOrderBy( fields, sortOrder);
if ( setOrderByRC != RC_SUCCESS )
{
print( "ERROR: setOrderBy failed, RC=" + RCtoString( setOrderByRC )
);
return RC_ERROR;
}
var selectRC = fRec.doSelect( "true" );
if ( selectRC != RC_SUCCESS )
{
print( "ERROR: doSelect OrderBy failed, RC=" + RCtoString( selectRC
) );
return RC_ERROR;
}
do
{
fCount++;
}
while (fRec.getNext() == RC_SUCCESS);
var timeAfter = new Date();
print( "doSelect select column Orderby test: table processed = " +
table );
print( "doSelect select column Orderby test: fields processed = " +
fields );
print( "doSelect select column Orderby test: sort order = " +
sortOrder);
print( "doSelect select column Orderby test: count = " + fCount );
print( "doSelect select column Orderby test: End time is " +
timeAfter );
print( "doSelect select column Orderby test: Elapsed time is " +
(timeAfter - timeBefore) + " milliseconds" );
return RC_SUCCESS;
}
var table = "operator";
var fields = new Array("company", "name");


  var sortOrder = new Array(SCFILE_DSC, SCFILE_ASC);
  var testRC = runOrderByTest( table, fields, sortOrder);

Related topics

JavaScript object: SCFile
JavaScript method: SCFile.setFields()


1.2.5.3.4.32. JavaScript method:
SCFile.setRecord()

Sets the SCFile field values from a given XML string.
Syntax

  SCFile_object.setRecord();

Argument
setRecord("xmlstring");
Example


function updateContactPhoneFromXML( name, xmlstr )
{
print("Searching for contact: "+ name + "...");
var contactRecord = new SCFile("contacts");
var rc = contactRecord.doSelect( "contact.name=\""+ name + "\"" );
if ( rc == RC_SUCCESS)
{
print("found contact " + name + ", phone number:\n" +
contactRecord.contact_phone.toString() );
contactRecord.setRecord(xmlstr);
contactRecord.doUpdate();
print("updated phone number in contact record:\n" +
contactRecord.contact_phone.toString());
}
else
{
print("Could not find contact. " + RCtoString( rc ) );
}
}
var contactName = "ADMINISTRATOR, SYSTEM";
var xmlString = "<model name=\"contacts\"
query=\"contact.name="ADMINISTRATOR, SYSTEM"\"><keys><contact.name
sctype=\"string\">ADMINISTRATOR, SYSTEM</contact.name></keys>
<instance recordid=\"ADMINISTRATOR, SYSTEM\"
uniquequery=\"contact.name="ADMINISTRATOR, SYSTEM"\"><contact.name
mandatory=\"true\" type=\"string\">ADMINISTRATOR,
SYSTEM</contact.name><contact.phone type=\"string\">(335) 123-
4567</contact.phone></instance></model>";
updateContactPhoneFromXML(contactName, xmlString);

          Note

              The input XML string should follow the Service Manager File schema.
              You can't use setRecord() to set values for files that contain binary data.
              For example,you can't use setRecord() for displaycache, code,
              SYSATTACHMENTS files.
              You can't use setRecord() to set dbdict records.


1.2.5.3.4.33. JavaScript method:
SCFile.updateAttachment( attachObj )

This method updates a specific attachment associated with the current file record. The
attachment object must contain a valid attachment ID in the "href" property of the
attachment object, as well as valid values for the other required properties (name, type,
and value). Before calling updateAttachment, you must establish a current record using
one of the positioning methods, such as doSelect(), getNext(), etc.
Syntax

  SCFile_object.updateAttachment( attachObj );

Arguments
updateAttachment() takes one argument, which is an Attachment object.
Return values
If successful, updateAttachment() returns a string of the form cid:xxxxxx containing the
new attachment ID for the attachment. Otherwise, it returns NULL .
Example
This example does the following:

     Selects one record from the probsummary table
     Gets a specific attachment associated with the current record
     Updates the attachment

This example requires the following sample data:

     "IM10001" record in "probsummary" table
     An attachment associated with "IM10001" record


function createTestAttachment()
{
var attachmentObj = new Attachment();
attachmentObj.type = "text/plain";
attachmentObj.name = "MyAttachment.txt";
attachmentObj.value = "My text attachment";
var f = new SCFile( 'probsummary' );
var rc = f.doSelect( 'number = "IM10001"' );
var attachmentID = f.insertAttachment( attachmentObj );
return attachmentID;
}
var attachmentID = createTestAttachment();
var f = new SCFile( 'probsummary' );
var rc = f.doSelect( 'number = "IM10001"' );
var attachmentObj = f.getAttachment( attachmentID );
// Now update the attachment object
var newName = "NewName.text";
var newValue = "Updated attachment text value";
attachmentObj.name = newName;
attachmentObj.value = newValue;
// Do the update. This should result in a new attachment ID
var newID = f.updateAttachment( attachmentObj );


1.2.5.3.5. JavaScript object: SCRecordList

The following JavaScript object is unique to Service Manager.
SCRecordList is an array of Datums that qualify with the query.
Constructor

new SCRecordList( <table name>, <QueryCond object>);

Arguments
The following arguments are valid for this object:

Argument                                Data type   Description
table name                              String
                                                    The name of the Service
QueryCond                               object      Manager table. For
                                                    example, probsummary.

                                                    Service Manager
                                                    JavaScript object
                                                    QueryCond which defines
                                                    the SC query to be
                                                    executed.

Properties
None.
Methods
The following methods are valid for this object:

Defined method                                     Description
getCount()
                                                   This method returns the total number of
getPosition()                                      records in the SCRecordList.

                                                   This method returns the last position in
                                                   the record list that has been accessed. .

Example


This example does the following:

     lists the location's position in a record list
     counts the records in the list

This example requires the following sample data:

     valid location(s)
     valid record list with at least one record

  var x = new SCRecordList( 'location', new QueryCond('location.name',
  LIKE, 'a'));
  print("Total record in the list: " + x.getCount());
  for (i in x ) {
  print(x[i].location_name + " is the " + x.getPosition() + " record
  in the record list." );
  }

JavaScript method: SCRecordList.getCount()

This method counts the total number of records in the SCRecordList.
Syntax

  SCRecordList.getCount();

Arguments
There are no arguments for this method.
Return values
This method returns the total number of records in a record list.
Example
This example does the following:

     counts the records in the list
This example requires the following sample data:

     valid location(s)
     valid record list with at least one record


  var x = new SCRecordList( 'location', new QueryCond('location.name',
  LIKE, 'a'));
  print("Total record in the list: " + x.getCount());

JavaScript method: SCRecordList.getPosition()

This method returns the position of the last accessed record in the record list. If there are
no records are in the SCRecordList, it returns -1. If there is at least one record and it has
not been accessed, the position is set to the first element, which is position 0.
Syntax

  SCRecordList.getPosition();

Arguments
There are no arguments for this method.
Return values
Last position of Datum accessed in record list.
Returns -1 if there are no records in the list.
Returns 0 if list is not yet or the first Datum is the last Datum accessed and the list
contains at least one record.
Example
This example does the following:

     lists the location's position in a record list
     counts the records in the list
This example requires the following sample data:
     valid location(s)
     valid record list with at least one record


  var x = new SCRecordList( 'location', new QueryCond('location.name',
  LIKE, 'a'));
  print("Total record in the list: " + x.getCount());
  for (i in x ) {
  print(x[i].location_name + " is the " + x.getPosition() + " record
  in the record list." );
  }

Contents

     1 JavaScript method: SCRecordList.getCount()
     2 JavaScript method: SCRecordList.getPosition()
````
