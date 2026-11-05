---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.2.5.3.4.11 .. 1.2.5.3.4.24
printed_pages: 1680-1706
---

# 1.2.5.3.4.11 JavaScript method: SCFile.doSelect()

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.5.3.4.11. JavaScript method:
SCFile.doSelect()

This method queries for records in an Service Manager object. The SCFile object has the
following format: table={["field value",{"array value","array value"},...]}
For performance improvement, you can use SCFile.setFields method to limit the fields
that doSelect returns from the database.

            Note

           This method is used for retrieving normal data, not for retrieving attachments.
           If you use this method to retrieve attachments, you could corrupt the
           SYSATTACHMENTS table. If you need to retrieve attachments, use one of the
           following functions to get the attachments associated with the current file
           record: SCFile.getAttachment(attachID) or SCFile.getAtttachments().

Syntax

  SCFile_object.doSelect( query );

or

  SCFile_object.doSelect( query, breferencesort );

Arguments
The following arguments are valid for this method:


Argument                                Data type  Description
query                                   String
                                                   This argument specifies
breferencesort                          Boolean    the query you want to use
                                                   to search for Service
                                                   Manager records. You
                                                   must use the slash
                                                   character to escape out
                                                   quotation marks and any
                                                   special characters
                                                   restricted from JavaScript.

                                                   When this parameter is set
                                                   to true , doSelect will
                                                   check the specified sort
                                                   sequences of reference
                                                   field. When the parameter
                                                   is set to false , it is equal
                                                   to SCFile_object.doSelect
                                                   ( query ); .

                                                   Note: If you want to sort a
                                                   reference field, set this
                                                   parameter to true.

Return values

An SCFile object containing records and RC_SUCCESS or one of the other global return
code values.

The method returns an SCFile object containing the records matching the query and a
global return code value of RC_SUCCESS or returns one of the error global return code
values if the method can't return any records.

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

Related topics

JavaScript object: SCFile
JavaScript method: SCFile.setFields()


1.2.5.3.4.12. JavaScript method:
SCFile.doSelectEx()

The SCFile.doSelectEx() method is designed to improve the system performance. You
can restrict the data retrieval by specifying the start and count parameters. In comparison,
the legacy SCFile.doSelect() method retrieves data from the beginning and may cause
potential performance issue on large tables.

Syntax

SCFile_object.doSelectEx( query, start, count );

Arguments
The following arguments are valid for this method:

Argument                                Data type   Description
query                                   String
                                                    This argument specifies
start                                   Number      the query you want to use
count                                   Number      to search for Service
                                                    Manager records. You
                                                    must use the slash
                                                    character to escape out
                                                    quotation marks and any
                                                    special characters
                                                    restricted from JavaScript.

                                                    This argument specifies
                                                    the start record of query
                                                    results.

                                                    This argument specifies
                                                    the get count from start.

Return values

An SCFile object containing records and RC_SUCCESS or one of the other global return
code values.

The method returns an SCFile object containing the records matching the query and a
global return code value of RC_SUCCESS or returns one of the error global return code


values if the method can't return any records.
Example
This example does the following:

     Searches the device table from 1000 for 1 record
     Displays the device record as a text string
This example requires the following sample data:
     A device table records >=1001

  var deviceFile = new SCFile( "device" );
  var rc = deviceFile.doSelectEx( "true", 1000, 1 )
  if ( rc == RC_SUCCESS )
  {
  print( "Success. found 1 record in device table:" + deviceFile);
  }
  else
  {
  print( "Could not find any record from device table" );
  }

Related topics

JavaScript object: SCFile


1.2.5.3.4.13. JavaScript method:
SCFile.doUpdate()

This method updates a Service Manager record with any new field values defined in a
Service Manager file object. It requires defining a Service Manager file object and
defining new values for fields.
Syntax

  SCFile_object.doUpdate();

Arguments
There are no arguments for this method.
Return values
RC_SUCCESS or one of the other global return code values.
The method returns RC_SUCCESS if the method successfully updates a record or
returns one of the error global return code values if the method can't update the record.
Example
This example does the following:

     Searches the contacts table for any contact name you define in the search variable
     Displays the contact record as a text string
This example requires the following sample data:
     A valid contact name (for example, "ADMINISTRATOR, SYSTEM")
     A valid field value update (for example, set the "user.type" field to "site")


var contactName;
function updateContact( name )
{
print( "Searching for contact: " + name + "..." );
var contactList = new SCFile( "contacts" );
var isContact = contactList.doSelect( "contact.name=\""+ name + "\""
);
if ( isContact == RC_SUCCESS )
{
print( "Success. found " + name + " in contact record:\n" +
contactList.getText() );
print( "The current contents of the user.type field are " +
contactList.user_type );
print( "Updating the user.type field..." );
contactList.user_type = "site";
contactList.doUpdate();
print( "The contents of the user.type field are now " +
contactList.user_type );
return contactList
}
else
{
print( "Could not find contact. " + RCtoString( isContact ) );
return null
}
}
contactName = "ADMINISTRATOR, SYSTEM";
updateContact( contactName );


1.2.5.3.4.14. JavaScript method:
SCFile.getAttachment( attachID )

Gets a specific attachment associated with the current file record.
Values passed to getAttachment() will normally be ones obtained from a previous
insertAttachment(), updateAttachment(), or getAttachments() operation.
Before calling getAttachment, you must establish a current record using one of the
positioning methods, such as doSelect(), getNext(), etc.
Syntax

  SCFile_object.getAttachment( attachID );

Arguments
getAttachment() takes one argument, which is a string containing an attachment ID of the
cid:xxxxx form.
Return values
If successful, getAttachment() returns an Attachment object. Otherwise, it returns null .
Example
This example does the following:

     Selects one record from the probsummary table.
     Gets a specific attachment associated with the current record
This example requires the following sample data:
     Record number IM10001 in the probsummary table

  var f = new SCFile( 'probsummary' );
  var rc = f.doSelect( 'number = "IM10001"' );
  var attachmentObj = f.getAttachment( attachmentID );


1.2.5.3.4.15. JavaScript method:
SCFile.getattachments()

This method gets all of the attachments associated with the current file record.
Before calling getAttachments, you must establish a current record using one of the
positioning methods, such as doSelect(), getNext(), etc.
Syntax

  SCFile_object.getAttachments()

Arguments
The getAttachments method takes no arguments.
Return values
If successful, getAttachments() returns an array of attachment objects. The array will be
empty if there are no attachments for the record. The attachment objects retrieve here will
only contain metadata. The Attachment.value will be NULL . To get each attachment's
binary data, you will need to use SCFile.getAttachment(attachID) method where attachID
contains the href property of the attachment object.
Example
This example does the following:

     Selects one record from the probsummary table
     Gets all of the attachments associated with the current record
This example requires the following sample data:
     Record number IM10001 in the probsummary table

  var f = new SCFile( 'probsummary' );
  var rc = f.doSelect( 'number = "IM10001"' );
  var attachments = f.getAttachments();
  print( attachments.length );
  for ( var attachment in attachments )
  {
  print( attachments[ attachment ].name );
  }


1.2.5.3.4.16. JavaScript method:
SCFile.getBinary()

This JavaScript method returns the binary representation of a field in a Service Manager
file object.

Syntax

SCFile_object.getBinary (fieldName);

Arguments
The following argument is valid for this method:

Argument                                Data type  Description
fieldName                               String
                                                   This argument specifies
                                                   the name of a field from
                                                   which you want to extract
                                                   the binary data.

Return values
The method returns a JS object that contains the binary data of the field.
Example

var bb = new SCFile("bbtosysattachments");
var rc = bb.doSelect("true");
var attachmentObj= new Attachment();
attachmentObj.value = bb.getBinary("att_attachment")
attachmentObj.name = bb.att_filename;
attachmentObj.type = "excel";


1.2.5.3.4.17. JavaScript method:
SCFile.getFirst()

This method returns the first record in a record list stored in an SCFile object.You must
use one of the other SCFile methods to create a record list.
Syntax

  SCFile_object.getFirst();

Arguments
There are no arguments for this method.
Return values
An SCFile object containing the first record and RC_SUCCESS or one of the other global
return code values.
The method returns an SCFile object containing the first record in a record list and a
global return code value of RC_SUCCESS or returns one of the error global return code
values if the method can't find the first record.
Example
This example does the following:

     Queries the contacts table for any contact name you define in the search variable
     Displays the last record in the record list
     Displays the previous record in the record list
     Displays the first contact in the record list

This example requires the following sample data:

     A contact query that produces a record list (for example, "B")
     A contact query that produces a single record (for example, "F")


var contactQuery;
function findFirstContact( query )
{
print( "Searching for contacts starting with " + query + "..." );
var contactFile = new SCFile( "contacts" );
var findContact = contactFile.doSelect( "contact.name#\""+ query +
"\"" );
if ( findContact == RC_SUCCESS )
{
print( "Success. Found contacts starting with " + query + "." );
var findLastRecord = contactFile.getLast();
print( "The last record is:\n" + contactFile );
var findPrevRecord = contactFile.getPrev();
print( "The previous record is:\n" + contactFile );
var findFirstRecord = contactFile.getFirst();
print( "The first record is:\n" + contactFile );
}
else
{
print( "Could not find contacts starting with " + query + ". " +
RCtoString( findContact ) );
return null
}
}
contactQuery = "H";
findFirstContact( contactQuery );


1.2.5.3.4.18. JavaScript method:
SCFile.getLast()

This method returns the last record in a record list stored in an SCFile object. You must
use the other SCFile methods to create a record list.
Syntax

  SCFile_object.getLast();

Arguments
There are no arguments for this method.
Return values
An SCFile object containing the last record and RC_SUCCESS or one of the other global
return code values.
The method returns an SCFile object containing the last record in a record list and a global
return code value of RC_SUCCESS or returns one of the error global return code values
if the method can't find the last record.
Example
This example does the following:

     Queries the contacts table for any contact name you define in the search variable
     Displays the first contact in the record list
     Displays the last record in the record list
This example requires the following sample data:
     A contact query that produces a record list (for example, "B")
     A contact query that produces a single record (for example, "F")


var contactQuery;
function findLastContact( query )
{
print( "Searching for contacts starting with " + query + "..." );
var contactFile = new SCFile( "contacts" );
var findContact = contactFile.doSelect( "contact.name#\""+ query +
"\"" );
if ( findContact == RC_SUCCESS )
{
print( "Success. Found contacts starting with " + query + ". The
first record is:\n" + contactFile );
var findLastRecord = contactFile.getLast();
print( "The last record is:\n" + contactFile );
return contactFile
}
else
{
print( "Could not find contacts starting with " + query + ". " +
RCtoString( findContact ) );
return null
}
}
contactQuery = "H";
findLastContact( contactQuery );
contactQuery = "F";
findLastContact( contactQuery );


1.2.5.3.4.19. JavaScript method:
SCFile.getLastRC()

This method returns the most recent global return code value generated by the SCFile
object. You can then use the RCtoString global method to convert the return code into a
string.
Syntax

  SCFile_object.getLastRC();

Arguments
There are no arguments for this method.
Return values
One of the global return code values.
The method returns the most recent global return code value generated by the SCFile
object.
Example
This example does the following:

     Inserts a new record into a local variable
     Displays the return code of the insert operation
This example requires the following sample data:
     A valid record in a local variable (for example, $L.file )

  system.vars.$L_file.doInsert();
  var rc = getLastRC();
  if ( rc == RC_SUCCESS )
  {
  print( "Insert of document succeeded" );
  }
  else if ( getLastRC() == false )
  print( "Error " + RCtoString(rc) + " occurred trying to insert the
  record" );


1.2.5.3.4.20. JavaScript method:
SCFile.getMessages()

Returns an array of messages generated by the Document Engine from a previous
SCFile.doAction().
Syntax

  SCFile_object.getMessages();

Arguments
There are no arguments allowed for this method.
Return values
Returns an array of messages from previous SCFile.doAction() call.
Example
This example does the following:

     Uses the Document Engine add to create a new incident record from variable values.
     Shows a validation failed due to invalid assignment group.
     SCFile.doAction() returns 71, "validation failure".
     SCFile.getMessages() returns messages generated from the Document Engine.


var numberValue;
var callbackContact;
var categoryValue;
var assignmentValue;
var descriptionValue;
var actionType;
var resultionCodeValue;
var resolutionValue;
function insertIncident( num, name, cat, group, desc )
{
print( "Creating new incident record..." );
var newIncident = new SCFile( "probsummary" );
newIncident.number = num;
newIncident.callback_contact = name;
newIncident.category = cat;
newIncident.assignment = group;
newIncident.description = desc;
var rc = newIncident.doAction('add');
if ( rc == RC_SUCCESS )
{
print( "Success. Created new record " + newIncident.getText() );
return newIncident.number
}
else
{
print( "Could not create record. " + RCtoString( rc ) );
print( "Reason: "+ newIncident.getMessages() );
return null
}
}
numberValue = "IM11121"
callbackContact = "ADMINISTRATOR, SYSTEM";
categoryValue = "network";
assignmentValue = "HELPDESK";
descriptionValue = null;
interactionID = insertIncident( numberValue, callbackContact,
categoryValue, assignmentValue, descriptionValue );
Output

                Category specified is invalid. Reason: Category specified
is invalid. Could not create record. Validation failed creating new
incident record...



1.2.5.3.4.21. JavaScript method:
SCFile.getNext()

This method returns the next record in a record list stored in an SCFile object. It requires
the use of the other SCFile methods to create a record list.
Syntax

  SCFile_object.getNext();

Arguments
There are no arguments for this method.
Return values
An SCFile object containing the next record and RC_SUCCESS or one of the other global
return code values.
The method returns an SCFile object containing the next record in a record list and a
global return code value of RC_SUCCESS or returns one of the error global return code
values if the method can't find the next record.
Example
This example does the following:

     Queries the contacts table for any contact name you define in the search variable
     Displays the first contact in the record list
     Displays the next record in the record list
This example requires the following sample data:
     A contact query that produces a record list (for example, "B")
     A contact query that produces a single record (for example, "F")


var contactQuery;
function findNextContact( query )
{
print( "Searching for contacts starting with " + query + "..." );
var contactFile = new SCFile( "contacts" );
var findContact = contactFile.doSelect( "contact.name#\""+ query +
"\"" );
if ( findContact == RC_SUCCESS )
{
print( "Success. Found contacts starting with " + query + ". The
first record is:\n" + contactFile.getText() );
var findNextRecord = contactFile.getNext();
print( "The next record is:\n" + contactFile.getText() );
return contactFile
}
else
{
print( "Could not find contact " + query + ". " + RCtoString(
findContact ) );
return null
}
}
contactQuery = "B";
findNextContact( contactQuery );
contactQuery = "F";
findNextContact( contactQuery );


1.2.5.3.4.22. JavaScript method:
SCFile.getPrev()

This method returns the previous record in a record list stored in an SCFile object. You
must use of the other SCFile methods to create a record list.
Syntax

  SCFile_object.getPrev();

Arguments
There are no arguments for this method.
Return values
An SCFile object containing the previous record and RC_SUCCESS or one of the other
global return code values.
The method returns an SCFile object containing the previous record in a record list and a
global return code value of RC_SUCCESS or returns one of the error global return code
values if the method can't find the previous record.
Example
This example does the following:

     Queries the contacts table for any contact name you define in the search variable
     Displays the first contact in the record list
     Displays the last record in the record list
     Displays the previous record in the record list
This example requires the following sample data:
     A contact query that produces a record list (for example, "H")


var contactQuery;
function findPrevContact( query )
{
print( "Searching for contacts starting with " + query + "..." );
var contactFile = new SCFile( "contacts" );
var findContact = contactFile.doSelect( "contact.name#\""+ query +
"\"" );
if ( findContact == RC_SUCCESS )
{
print( "Success. Found contacts starting with " + query + ". The
first record is:\n" + contactFile );
var findLastRecord = contactFile.getLast();
print( "The last record is:\n" + contactFile );
var findPrevRecord = contactFile.getPrev();
print( "The previous record is:\n" + contactFile );
}
else
{
print( "Could not find contacts starting with " + query + ". " +
RCtoString( findContact ) );
return null
}
}
contactQuery = "H";
findPrevContact( contactQuery );


1.2.5.3.4.23. JavaScript method:
SCFile.getPurgedRowCount()

This method enables you to retrieve the number of Service Manager records that were
deleted from a table after invoking the doPurge() method.
Syntax

  SCFile_object.getPurgedRowCount();

Arguments
There are no arguments for this method.
Return values

     If successful, getPurgedRowCount() returns the number of records deleted by the
     last successful doPurge() call (which returned RC_SUCCESS ). This value can be 0
     if no records were deleted.
     If getPurgedRowCount() is not able to retrieve the record count it will return -1 .
The value returned by getPurgedRowCount is unaffected by any SCFile method call other
than doPurge. It is also unaffected by a failed call to doPurge (returned RC_ERROR ).
Example
This example does the following:
     Searches the kmknowledgebaseupdates table for records where docid="docid1"
     Deletes whatever it finds.
This example requires the following sample data:
     Records in kmknowledgebaseupdates table where docid = "docid1"


  var fileName = "kmknowledgebaseupdates";
  var recordList = new SCFile(fileName);
  var deleteRC = recordList.doPurge("docid = \"docid1\"");
  if ( deleteRC == RC_SUCCESS )
  {
  print ("doPurge succeeded");
  var purgedCount = recordList.getPurgedRowCount();
  if ( purgedCount >= 0 )
  {
  print(purgedCount + " records have been purged");
  }
  else
  {
  print("Could not retrieve purged record count");
  }
  }
  else
  {
  print ("doPurge failed");
  }

Related topics

JavaScript object: SCFile
JavaScript method: SCFile.doPurge()


1.2.5.3.4.24. JavaScript method:
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
````
