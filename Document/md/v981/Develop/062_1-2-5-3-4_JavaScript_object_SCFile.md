---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.2.5.3.4 .. 1.2.5.3.4.10
printed_pages: 1652-1680
---

# 1.2.5.3.4 JavaScript object: SCFile

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.5.3.4. JavaScript object: SCFile

The following JavaScript object is unique to Service Manager.

With no parameters, the SCFile() constructor creates an empty SCFile object.

With an object parameter, the SCFile() constructor creates an SCFile object containing the
provided record, structure, or array. You must enclose table names and arrays in
quotation marks.

This object's methods use the Service Manager-defined global return codes.

Constructor

new SCFile()
new SCFile(object)
new SCFile( object, SCFILE_READONLY )

Arguments
The following arguments are valid for this object:

Argument                                Data type   Description
object                                  String
                                                    The table name, record,
SCFILE_READONLY                         Number      structure, or array you
                                                    want to query or update.

                                                    Causes the file object to
                                                    become read-only. This
                                                    constant is only supported
                                                    as a second parameter,
                                                    with the file name
                                                    specified as the first
                                                    parameter.

Properties
None
Methods
The following methods are valid for this object:

 Defined method                                                                                  Service Manager 9.81
 deleteAttachment( attachID )
 deleteAttachments()                    Description
 doAction()
 doClose()                              This method deletes a specific
 doCount()                              attachment associated with the current
 doDelete()                             file record.
 doInsert()
 doPurge()                              This method deletes all of the
 doRemove()                             attachments associated with the current
 doSave()                               file record.
 doSelect()
                                        This method executes a method defined
 doUpdate()                             on the object.

This PDF was generated on May 23, 2026  This method closes the cursor that the
                                        SCFile Object stands for.

                                        This method returns the number of
                                        records for the provided query.

                                        This method is synonymous with the
                                        doRemove() method. This method simply
                                        has a more intuitive name.

                                        This method inserts an object into the
                                        database.

                                        This method purges a set of records
                                        directly in the back-end RDBMS.

                                        This method removes an object from the
                                        database.

                                        This method inserts a record if it is new
                                        and updates the record if it already
                                        exists.

                                        This method makes a query. It no longer
                                        requires that the first argument be the
                                        name of the table if the object is
                                        constructed with the name of the table.

                                        This method updates the database.

                                                                                                                          Page 49 of 250
 Defined method                                                                                  Service Manager 9.81
 getAttachment( attachID )
 getAttachments()                       Description
 getBinary()
 getFirst()                             This method gets a specific attachment
 getLast()                              associated with the current file record.
 getLastRC()
 getMessages()                          This method gets all of the attachments
 getNext()                              associated with the current file record.
 getPrev()
 getPurgedRowCount()                    This method returns the binary
 getText()                              representation of a field in a Service
 getType()                              Manager file object.

This PDF was generated on May 23, 2026  This method moves to the first record if
                                        the object represents a result set.

                                        This method moves to the last record if
                                        the object represents a result set.

                                        This method returns the last return code
                                        generated by the SCFile and SCDatum
                                        objects.

                                        This method returns an array of
                                        messages generated by the Document
                                        Engine from a previous doAction().

                                        This method moves to the next record if
                                        the object represents a result set.

                                        This method moves to the previous
                                        record if the object represents a result
                                        set.

                                        This method retrieves the number of
                                        records deleted from a table by the
                                        doPurge().

                                        This method returns a text representation
                                        of the object.

                                        This method returns the object type.

                                                                                                                          Page 50 of 250

Defined method                          Description
getXML()
insertAttachment()                      This method returns an XML
isRecord()                              representation of the object.

setBinary()                             This method creates a new attachment
setFields()                             associated with the current file record.

setRecord()                             This method checks if an object
setOrderBy()                            represents a current table and has a
                                        record.
updateAttachment( attachObj )
                                        This method saves binary data to a field
                                        in a Service Manager file object.

                                        This method causes any subsequent
                                        doSelect() calls to fetch only the
                                        specified fields.

                                        This method sets the field values from a
                                        given XML string.

                                        This method causes any subsequent
                                        doSelect() call on a SCFile object to fetch
                                        only the specified fields by the specified
                                        sort sequences of the SCFile Object.

                                        This method updates a specific
                                        attachment associated with the current
                                        file record.

Example
This example does the following:

     Creates an SCFile object from the contacts table
     Selects records from this contacts table starting with the letter B
     Displays the contacts matching the select query

This example requires the following sample data:

     A valid query against the contacts table (for example, contact.name # "B")


var q = new SCFile("contacts");
if ( ( q.doSelect( "contact.name # \"B\"" ) ) == RC_SUCCESS )
{

   print(q.getText());
}
else

   print( "Return code is: " + q.RCtoString );


1.2.5.3.4.1. JavaScript method:
SCFile.deleteAttachment( attachID )

This method deletes a specific attachment associated with the current file record.
Values passed to deleteAttachment() will normally be ones obtained from a previous
insertAttachment(), updateAttachment(), or getAttachments() operation.
Before calling deleteAttachment, you must establish a current record using one of the
positioning methods, such as doSelect(), getNext(), etc.
Syntax

  SCFile_object.deleteAttachment( attachID );

Arguments
deleteAttachment() takes one argument, which is a string containing an attachment ID of
the cid:xxxxx form.
Return values
If successful, deleteAttachment() returns RC_SUCCESS . Otherwise. it returns an error
return code. For example, it returns RC_NO_MORE if the attachment was not found.
Example
This example does the following:

     Selects one record from the probsummary file
     Deletes one attachment associated with the current record
This example requires the following sample data:
     Record number IM10001 in the probsummary table


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
var rc = f.deleteAttachment( attachmentID );


1.2.5.3.4.2. JavaScript method:
SCFile.deleteAttachments()

Deletes all of the attachments associated with the current file record.
Before calling deleteAttachments, you must establish a current record using one of the
positioning methods, such as doSelect(), getNext(), etc.
Syntax

  SCFile_object.deleteAttachments()

Arguments
deleteAttachments() takes no arguments and returns no arguments.
Return values
If successful, deleteAttachments() deletes all of the attachments associated with the
current record.
Example
This example does the following:

     Selects one record from the probsummary file
     Deletes all attachments associated with the current record
     Displays the number of attachments associated with the current record
This example requires the following sample data:
     Record number IM10001 in the probsummary file

  var f = new SCFile( 'probsummary' );
  var rc = f.doSelect( 'number = "IM10001"' );
  f.deleteAttachments();
  var attachments = f.getAttachments();
  print( attachments.length ); // will be zero


1.2.5.3.4.3. JavaScript method:
SCFile.doAction()

This method executes a Document Engine action using any new field values defined in a
Service Manager file object. You must define a Service Manager file object and new
values for required fields.

Syntax

SCFile_object.doAction( docEngineAction );

Arguments
The following arguments are valid for this method:

Argument                                Data type   Description
docEngineAction                         String
                                                    This argument specifies
                                                    the Document Engine
                                                    action you want the script
                                                    to execute on the object.
                                                    This argument must
                                                    contain a valid Service
                                                    Manager Document
                                                    Engine action appropriate
                                                    for the Service Manager
                                                    object.

Return values

RC_SUCCESS or one of the other global return code values.

The method returns RC_SUCCESS if the method successfully runs the Document Engine
action or returns one of the error global return code values if the method can't run the
Document Engine action.

Sample global return code values:


  RC_ERROR (-1) : Some other error occurred. Examine the contents of
  the Messages view or the sm.log file for more information.
  RC_SUCCESS (0) : The operation succeeded.
  RC_CANT_HAVE (3) : The operation failed because the resource is
  unavailable because some other user or process has the resource
  locked.
  RC_NO_MORE (9) : No more records are available in the result set.
  RC_DUPLICATE_KEY (48) : The insert operation failed because the file
  already contains a record with this unique key value.
  RC_MODIFIED (51) : The update operation failed because the record
  was modified by another user or process since you read it.
  RC_DELETED (52) : The operation failed because the record was
  deleted by another user or process.
  RC_BAD_QUERY (66) : The query failed due to incorrect query syntax.
  RC_NOT_AUTHORIZED (28) : The request operation was not performed due
  to an authorization failure. Check the permissions associated with
  the user who submitted the request.
  RC_VALIDATION_FAILED (71) : The operation failed because the data
  supplied in a field or record did not pass validity checks performed
  by the application.
  RC_UNABLE_TO_WRITE_TO_FILE (20) : The operation failed. Check to
  make sure the file name is correct, that the file exists, and that
  it is not read-only.
  RC_UNABLE_TO_CLOSE_FILE (47) : The operation failed. Check to make
  sure the file name is correct, that the file exists, and that it is
  not read-only.
  RC_UNABLE_TO_DELETE_FILE (57) : The operation failed. Check to make
  sure the file name is correct, that the file exists, and that it is
  not read-only.

Example
This example does the following:

     Creates a new incident record from variable values
     Resolves the incident record
This example requires the following sample data:
     The "Use Resolved Status?" option enabled in the Incident Management
     Environment record
     A valid value for the number field (for example, "IM11112")


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
var rc = newIncident.doInsert();
if ( rc == RC_SUCCESS )
{
print( "Success. Created new record " + newIncident.getText() );
return newIncident.number
}
else
{
print( "Could not create record. " + RCtoString( rc ) );
return null
}
}
function resolveIncident( id, action, rescode, res )
{
print( "Resolving incident " + id + "..." );
var findIncident = new SCFile ( "probsummary" );
var f = findIncident.doSelect( "number=\"" + id + "\"" );
if ( f == RC_SUCCESS )
{
print( "Success. Found interaction record..." );
findIncident.resolution_code = rescode;
findIncident.resolution = res;
var a = findIncident.doAction( action );
print( "The resolve Incident return value is " + RCtoString( a ) );
print( "The incident record is " + findIncident.getText() )


print( "The value of the status field is: " +
findIncident.problem_status );
return findIncident
}
else
{
print( "Could not find record. " + RCtoString( f ) );
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
actionType = "resolve";
resultionCodeValue = "Advice & Guidance";
resolutionValue = null;
resolveIncident( interactionID, actionType, resultionCodeValue,
resolutionValue );


1.2.5.3.4.4. JavaScript method:
SCFile.doClose()

This method closes the cursor that the SCFile Object stands for.
Syntax

  SCFile_object.doClose();

Arguments
There are no arguments for this method.
Return values
RC_SUCCESS or one of the other global return code values.
The method returns RC_SUCCESS if the method successfully closes an object or returns
one of the error global return code values if the method can't close an object.
Example
This example does the following:

     Determines the number of contact records.
     Displays the contact record as a text string.
     Close the SCfile Object.
This example requires the following sample data:
     A contact name.


var contactName = "ADMINISTRATOR, SYSTEM";
var contactList = new SCFile( "contacts" );
var findContact = contactList.doSelect( "contact.name=\""+
contactName + "\"" )
if ( findContact == RC_SUCCESS )
{

   print( "Success. found " + contactName + " in contact record:\n" +
contactList.getText() );
}
else
{

   print( "Could not find contact. " + RCtoString( findContact ) );
}
try{

   var rc = contactList.doClose();
   if (rc == RC_SUCCESS)

       print("Success. close the SCFile Object");
   else

       print("Could not close the SCFile Object");
}
catch(e){

   print(e.toString());
}


1.2.5.3.4.5. JavaScript method:
SCFile.doCount()

This method returns the number of records specified by the query.

            Note

           You should not use this method on an SCFile object for which you have
           performed a previous doSelect() if you intend to iterate over the results of the
           doSelect().

Syntax

SCFile_object.doCount( "query" );

Arguments
The following arguments are valid for this method:

Argument                                Data type   Description
query                                   String
                                                    This argument specifies
                                                    the query you want to use
                                                    to search for Service
                                                    Manager records. You
                                                    must use the slash
                                                    character to escape out
                                                    quotation marks and any
                                                    special characters
                                                    restricted from JavaScript.

Return values
A number representing the count of records.
Example
This example does the following:

     Determines the number of contact records.
     Displays the contact record as a text string.

This example requires the following sample data:


   A valid contact name (for example, "ADMINISTRATOR, SYSTEM").
   An invalid contact name (for example, "NOT A, CONTACT").

var contactName;
function countContacts( location )
{
print( "Counting contacts at location: " + location + "..." );
var contactList = new SCFile( "contacts" );
var nCount = contactList.doCount( "location=\""+ location +

                                "\"" );
var rc = getLastRC();
if ( rc == RC_SUCCESS )
{
return nCount;
}
else
{
print( "Could not count records. " + RCtoString( rc ) );
return -1;
}
}


1.2.5.3.4.6. JavaScript method:
SCFile.doDelete()

This method removes a Service Manager record with any new field values defined in a
Service Manager file object. You must define a Service Manager file object and new
values for fields. This method is a synonym of the doRemove() method, and related to the
more extensive doPurge() method.
Syntax

  SCFile_object.doDelete();

Arguments
There are no arguments for this method.
Return values
RC_SUCCESS or one of the other global return code values.
The method returns RC_SUCCESS if the method successfully removes a record or
returns one of the error global return code values if the method can't remove the record.
Example
This example does the following:

     Searches the probsummary table for any interaction record you define in the search
     variable
     Removes the interaction record
This example requires the following sample data:
     A valid value for the number field (for example, "IM11111")


  var numberValue;
  function removeInteraction( num )
  {
  print( "Removing interaction record..." );
  var interactionRecord = new SCFile( "probsummary" );
  var findRecord = interactionRecord.doSelect( "number=\"" + num +
  "\"");
  print( "The interaction record is " + interactionRecord );
  var rc = interactionRecord.doDelete();
  if ( rc == RC_SUCCESS )
  {
  print( "Success. Removed record " + interactionRecord.getText() );
  return interactionRecord
  }
  else
  {
  print( "Could not remove record. " + RCtoString( rc ) );
  return null
  }
  }
  numberValue = "IM11111"
  removeInteraction( numberValue );

Related topics

JavaScript object: SCFile
JavaScript method: SCFile.doRemove()
JavaScript method: SCFile.doPurge()


1.2.5.3.4.7. JavaScript method:
SCFile.doInsert()

This method creates a Service Manager record with any new field values defined in a file
object. You must define a Service Manager file object and new values for the fields.
Syntax

  SCFile_object.doInsert();

Arguments
There are no arguments for this method.
Return values
RC_SUCCESS or one of the other global return code values.
The method returns RC_SUCCESS if the method successfully creates a record or returns
one of the error global return code values if the method can't create the record.
Example
This example does the following:

     Searches the probsummary table for any incident record you define in the search
     variable
     Displays the new incident record as a text string
This example requires the following sample data:
     A valid value for the number field (for example, "IM11111")
     A valid value for the callback.contact field (for example, "ADMINISTRATOR,
     SYSTEM")
     A valid value for the category field (for example, "network")


var numberValue;
var callbackContact;
var categoryValue;
var descriptionValue;
function insertContact( num, name, cat )
{
print( "Creating new interaction record..." );
var newInteraction = new SCFile( "probsummary" );
newInteraction.number = num;
newInteraction.callback_contact = name;
newInteraction.category = cat;
var rc = newInteraction.doInsert();
if ( rc == RC_SUCCESS )
{
print( "Success. Created new record " + newInteraction.getText() );
return newInteraction
}
else
{
print( "Could not create record. " + RCtoString( rc ) );
return null
}
}
numberValue = "IM11112"
callbackContact = "ADMINISTRATOR, SYSTEM";
categoryValue = "network";
insertContact( numberValue, callbackContact, categoryValue,
descriptionValue );


1.2.5.3.4.8. JavaScript method:
SCFile.doPurge()

This method enables you to purge a set of Service Manager records directly in the back-
end RDBMS while bypassing record level processing. The doPurge() method is an
alternative to doDelete() or doRemove(). It enables the back-end RDBMS to do most of
the processing, thereby improving execution times when deleting a large amount of data
from a single table.

The doDelete() method requires you to select a list of records from the database, iterate
over each record in the list and perform a “delete” on a record by record basis. When the
delete is performed, Service Manager respects workflow actions as defined in record
level triggers. The doPurge() method reduces the overhead of much of this by sending
one SQL statement to the RDBMS to purge the data. As a result of the RDBMS processing
the record set purge in one transaction, Service Manager doesn't have control to process
record level triggers on the data being purged. Standard Service Manager trigger
processing will not occur on these records.

You should use doPurge() only when you need to quickly delete a large record set from a
single Service Manager table, and it doesn't matter whether Service Manager triggers are
processed.

            Caution

           Purging data has some risks. Use doPurge() with caution. It is the equivalent
           of issuing a SQL statement to the RDBMS such as, DELETE
           FROM "SM_TABLE_NAME" WHERE "COLOUMN_NAME" = 'value' .

Some issues to understand and consider before using this method:

     Data referential integrity could be an issue by purging data that's related to other
     types of Service Manager data. This method doesn't execute normal record level
     workflow processing in the applications layer. When you turn off triggers and run
     doPurge(), you will bypass normal workflow processing in addition to record level
     triggers.
     No Service Manager rollback or undo is available after you run doPurge().
     No Service Manager audit or other tracking is available to indicate changes made by
     doPurge(). Consider coding your own audit mechanism.

You can retrieve the number of records deleted from a table by doPurge() by using the
JavaScript method: getPurgedRowCount()


Note

When you use doPurge(), Service Manager deletes a set of records. This
causes a delete to the back-end database. When Service Manager attempts to
delete a large set of records, the database could run out of space for this
activity and cause an error. Each supported database platform provides some
type of transaction or undo log to back up data changes and allow a rollback
in case of errors. If you encounter such an error, please contact your
database administrator and ask them to increase the size available for this
purpose.

Some examples of the errors you could encounter are:

Oracle: SQL code=30036 message=ORA-30036: unable to extend segment by % in
undo tablespace

SQL Server SQL State: 42000-9002 Message: [Microsoft][SQL Native Client][SQL
Server]The transaction log for database '%' is full

Syntax

SCFile_object.doPurge( query );

Arguments
The following arguments are valid for this method:

Argument                                Description
query
                                        String, Boolean, or QueryCond object

                                        This argument specifies the query you
                                        want to use to search for Service
                                        Manager records. You must use the slash
                                        character to escape out quotation marks
                                        and any special characters restricted
                                        from JavaScript. Boolean values (true or
                                        false) or a QueryCond object are also
                                        acceptable.

Return values
Returns RC_SUCCESS if successful and RC_ERROR on failure.


The following conditions will cause a doPurge() failure:

     Calling doPurge() on an uninitialized SCFile or a read-only SCFile
     Calling doPurge() with an empty query argument
     Calling doPurge() with an invalid argument type (not a string)
     Calling doPurge() with one (or more) invalid (or unmapped) fields.

A basic validation is performed on the field names to ensure they exist in the DBDICT. This
validation will not cause a failure of the method; it will return RC_SUCCESS . However, in
this case, it will default to a “false” query and no records will be deleted.

     Calling doPurge() with an unsupported complex type SCFile relation.

See the limitations below for supported types.

     Calling doPurge() with an SCFile object which has “delete” triggers defined and
     enabled.

When the method fails, it has no effect.
Limitations
Only simple SCFile relations are supported:

     Must not be a join file or a merge file
     Must have only 1 main table alias (m1)
     Must not have any alias tables (a1,a2,….)
     No LDAP mapped fields
     The table must not have “delete” triggers defined and enabled

Example
This example does the following:

     Searches the kmknowledgebaseupdates table for records where docid="docid1"
     Deletes whatever it finds.

This example requires the following sample data:

     Records in kmknowledgebaseupdates table where docid = "docid1"

  var fileName = "kmknowledgebaseupdates";
  var recordList = new SCFile(fileName);
  var deleteRC = recordList.doPurge("docid = \"docid1\"");

Related topics


JavaScript object: SCFile
JavaScript method: SCFile.getPurgedRowCount()
JavaScript method: SCFile.doDelete()
JavaScript method: SCFile.doRemove()


1.2.5.3.4.9. JavaScript method:
SCFile.doRemove()

This method removes a single Service Manager record matching the field values defined
in the Service Manager file object. To remove multiple records use the doSelect method to
store a record list as a JavaScript object, and then use the getNext, getPrev, getFirst, or
GetLast methods to bring a particular record into memory for removal. It requires defining
a Service Manager file object. This method is a synonym of the doDelete() method, and
related to the more extensive doPurge() method.
Syntax

  SCFile_object.doRemove();

Arguments
There are no arguments for this method.
Return values
RC_SUCCESS or one of the other global return code values.
The method returns RC_SUCCESS if the method successfully removes a record or
returns one of the error global return code values if the method can't remove the record.
Example
This example does the following:

     Searches the probsummary table for any interaction record you define in the search
     variable
     Removes the interaction record

This example requires the following sample data:

     A valid value for the number field (for example, "IM11111")


  var numberValue;
  function removeInteraction( num )
  {
  print( "Removing interaction record..." );
  var interactionRecord = new SCFile( "probsummary" );
  var findRecord = interactionRecord.doSelect( "number=\"" + num +
  "\"");
  print( "The interaction record is " + interactionRecord );
  var rc = interactionRecord.doRemove();
  if ( rc == RC_SUCCESS )
  {
  print( "Success. Removed record " + interactionRecord.getText() );
  return interactionRecord
  }
  else
  {
  print( "Could not remove record. " + RCtoString( rc ) );
  return null
  }
  }
  numberValue = "IM11111"
  removeInteraction( numberValue );

Related topics

JavaScript object: SCFile
JavaScript method: SCFile.doDelete()
JavaScript method: SCFile.doPurge()


1.2.5.3.4.10. JavaScript method:
SCFile.doSave()

This method adds to or updates the Service Manager database with any new field values
defined in a Service Manager file object. It requires defining a Service Manager file object
and defining new values for fields.
Syntax

  SCFile_object.doSave();

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
     Updates the value of the user.type field
     Saves the Service Manager record
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
print( "The current contents of the user.type field are: " +
contactList.user_type );
print( "Updating the user.type field..." );
contactList.user_type = "site";
print( "Saving record..." );
var rc = contactList.doSave();
print( "The return code value for the doSave() method is: " +
RCtoString( rc ) );
print( "The contents of the user.type field are now: " +
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
````
