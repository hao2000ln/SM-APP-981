---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.2.5.2.16 .. 1.2.5.3.2
printed_pages: 1599-1622
---

# 1.2.5.2.16 JavaScript global method: setAppMessage

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.5.2.16. JavaScript global method:
setAppMessage

Defines the message returned in the "message" attribute in the soap response. For
example, in the following soap response:

<CreateRelationshipResponse message="Here you define your message"
returnCode=….> , where the message attribute is shown in italic.

Syntax

setAppMessage(message);

Arguments
The following arguments are valid for this function:

Argument       Data type                Required      Description
message        String                   Yes
                                                      This argument
                                                      contains the text
                                                      string you want to
                                                      show in the
                                                      "message"
                                                      attribute in the
                                                      soap response.
                                                      You must enclose
                                                      literal text strings
                                                      in quotation
                                                      marks.

Return values
None
Throws
None
Description


This method defines the message returned in the "message" attribute in the soap
response.
Example

  inputValue = "CompanyA";
  setAppMessage("The input value "+inputValue+" is invalid");


1.2.5.2.17. JavaScript global method:
stripHtml

Takes HTML content and strips out the HTML tags and returns the content as text
without the HTML tags.

Syntax

stripHtml();

Arguments
The following arguments are valid for this function:

Argument      Data type                 Required      Description
htmlstr       String                    Yes
                                                      This argument
                                                      contains the
                                                      JavaScript String
                                                      with HTML tags
                                                      that you want to
                                                      strip out of the
                                                      string.

Returns
JavaScript String without HTML tags.
Throws
None
Description
Takes HTML content and strips out the HTML tags and returns the content as text
without HTML tags.
Example


var htmlstr = "<html><body>Hello</body></html>";
var text = stripHtml(htmlstr);
print("before stripping HTML tags: " + htmlstr);
print("after stripping HTML tags: " + text);


1.2.5.2.18. JavaScript global method:
uncompressFile

This method expands a .zip file into a specified location.
Syntax

uncompressFile(file name, target directory);

Arguments
The following arguments are valid for this function:

Argument   Data type                    Required      Description
file name  String                       Yes
                                                      This argument
target directory String                 No            specifies the path
                                                      and file name of
                                                      the .zip file to
                                                      uncompress.

                                                      This argument
                                                      specifies the
                                                      target directory. If
                                                      not specified, the
                                                      location of the
                                                      .zip file is used.

Return values
True indicates that the file uncompressed successfully, and any other return value
indicates failure.
Throws
None
Description
This method expands a .zip file into a specified location.
Example


This example unzips the upgtest.zip file to c:/test.

var rc = uncompressFile("c:/test/upgtest.zip");
if( rc == true )
{

   print("uncompress file with one file successfully");
   // this will unzip the file to C:/test/test
   rc = uncompressFile("c:/test/upgtest.zip", "c:/test/test");
}
else
{
print("Failed to uncompress file.");
}
if(rc == true)
{
print("All tasks are finished.");
}


1.2.5.2.19. JavaScript global method:
writeAttachmentToFile

Writes a requested attachment record to the local file system.
Syntax

  writeAttachmentToFile( File, Application, Topic, UID );

Arguments
The following arguments are valid for this method:

Name         Data type                  Required         Service Manager 9.81
File         String                     Yes
                                                  Description
Application  String                     Yes
                                                  This argument
Topic        String                     Yes       specifies the file
                                                  name of the
This PDF was generated on May 23, 2026            attachment you
                                                  want to write out
                                                  to the file system.
                                                  You may also use
                                                  this argument to
                                                  specify the
                                                  destination path of
                                                  the attachment. If
                                                  this argument
                                                  doesn't specify a
                                                  path, Service
                                                  Manager creates
                                                  the attachment in
                                                  the system
                                                  working directory.

                                                  This argument
                                                  specifies the
                                                  application name
                                                  portion of the key
                                                  that Service
                                                  Manager uses to
                                                  identify the
                                                  attachment in the
                                                  SYSATTACHMENT
                                                  S table.

                                                  This argument
                                                  specifies the topic
                                                  name portion of
                                                  the key that
                                                  Service Manager
                                                  uses to identify the
                                                  attachment in the
                                                  SYSATTACHMENT
                                                  S table.

                                                                               Page 2 of 250

Name  Data type                         Required           Description
UID   String                            Yes
                                                           This argument
                                                           specifies the
                                                           unique identifier
                                                           portion of the key
                                                           that Service
                                                           Manager uses to
                                                           uniquely identify
                                                           the attachment in
                                                           the
                                                           SYSATTACHMENT
                                                           S table.

Return values

RC_SUCCESS or one of the other global return code values.

The method writes the attachment record specified in the method arguments to the local
file system and returns a global return code value of RC_SUCCESS or returns one of the
failure global return code values if the method can't return an attachment record.

Description

This method extracts the specified attachment from the SYSATTACHMENTS table and
writes it to the specified file and path on the local file system.

      Note

      If you specify a path, you must escape out any JavaScript reserved-
      characters in the path name such as slashes and backslashes. Consult a
      JavaScript reference for a full list of JavaScript reserved-characters and
      escape methods.

Example
This example does the following:

     Requests an attachment from the SYSATTACHMENTS table
     Writes the attachment to the file c:\kmdocument.pdf
     Prints the return code to the screen

This example requires the following sample data:

     The Knowledge Management record KM0018


An attachment in KM0018

var rc;
rc = writeAttachmentToFile( "c:\\kmdocument.pdf", "kmdocument",
"KM0018", "4462590a062ee0c2101d85c8" );
if ( rc == RC_SUCCESS )
{

 print( "kmdocument.pdf successfully created" );
}
else
{

 print( "kmdocument.pdf failed " , RCtoString(rc) );
}


1.2.5.2.20. JavaScript global method:
writeFile

Writes data to the local file system.
Syntax

  writeFile( path, mode, object );

Arguments
The following arguments are valid for this function:

Argument  Data type                     Required                     Service Manager 9.81
path      String                        Yes
                                                              Description
mode      String                        No
                                                              This argument
object    String                        Yes                   contains the text
                                                              string or variable
                                                              value containing
                                                              the fully qualified
                                                              path of the file to
                                                              be written. You
                                                              must enclose
                                                              literal text strings
                                                              in quotation marks.

                                                              Use the string "b"
                                                              to write a binary
                                                              file. Use the string
                                                              "ba" to append to
                                                              a binary file. Use
                                                              the string "a" to
                                                              append to a text
                                                              file. Use any other
                                                              string or omit the
                                                              parameter to write
                                                              to a text file. This
                                                              is the default. The
                                                              values are case
                                                              sensitive and only
                                                              the values
                                                              specified are valid.

                                                              This parameter
                                                              contains the text
                                                              string or variable
                                                              value containing
                                                              the data you want
                                                              to write to a file.

Return values
A number representing the number of bytes written to a file.
Description


This method writes the contents of the object parameter to the file specified in the path
parameter. The file can be in binary format or text format as determined by the binary
parameter.
Example
This example does the following:

     Writes the list of currently logged on users to a file
This example requires the following sample data:

     The list of currently logged on users stored in system.users

  var userList = system.users;
  var filePath;
  var isMode;
  var fileObject;

  function writeToFile( path, binary, object )
  {

    print( "Writing " + path + " to file..." );
    var output = writeFile( path, mode, object );
    print( "The number of bytes written to file was: " + output );
    return output
  }

  filePath = "C:\\users.xml";
  isMode = null;
  fileObject = userList;
  writeToFile( filePath, isMode, fileObject );


1.2.5.2.21. JavaScript global method:
xmlstring

This method converts a JavaScript string to an XML-formatted string.
Syntax

xmlstring( string );

Arguments
The following arguments are valid for this function:

Argument       Data type                Required      Description
string         String                   No
                                                      This argument
                                                      contains the text
                                                      string or variable
                                                      value you want the
                                                      script to convert to
                                                      an XML string.

Return values
None
Throws
None
Example

var xmldoc = new SCFile( system.users );
xmlstring( xmldoc );
print( xmldoc );


1.2.5.3. Service Manager defined JavaScript
objects

The defined objects are unique to the implementation of JavaScript within Service
Manager. This is a complete list of the Service Manager defined objects.

 Defined object                                                                                  Service Manager 9.81
 Attachment
 Datum                                  Description
 SCDatum
                                        This object allows you to create
 SCFile                                 attachments for use with
                                        doSOAPRequest methods.
 SCRecordList
 Query                                  This object extracts aggregate types of
                                        data (structures or arrays) from a record
This PDF was generated on May 23, 2026  in the file object. In Service Manager, a
                                        file record is a datum and so is each
                                        component of the record.

                                        This object converts a Datum to a
                                        SCDatum so that you can test the results
                                        by using the return codes. When an
                                        object is initialized in RAD and then
                                        passed to JavaScript, the object
                                        becomes a Datum object and all the
                                        methods return true/false values. If an
                                        error occurs and you want a more
                                        specific error message, you can create a
                                        SCDatum object from the Datum object.

                                        This object constructs a new file object.
                                        You can use the SCFile object to access,
                                        update, and move between Service
                                        Manager files. This object exposes a
                                        small set of frequently used return code
                                        constants that make it easy to test values
                                        returned by methods without having to
                                        hard code return code values in the
                                        script.

                                        This object is an array of Datums that
                                        qualify with the query. SCRecordList has
                                        two available functions: getPosition() and
                                        getCount().

                                        This object returns an array of records.
                                        The Query object can't be used to write
                                        data back to Service Manager.

                                                                                                                          Page 10 of 250
Defined object                                                                                   Service Manager 9.81
QueryCond
XML                                     Description

XMLDate                                 This object defines the conditions of the
                                        query. It is used in conjunction with the
                                        Query object to define the parameters for
                                        returning data from Service Manager.

                                        This object represents an XML document
                                        or a node in an XML document.
                                        Underlying the XML object is the
                                        Document Object Model (DOM) object.
                                        You may find that in certain instances the
                                        XML object in Service Manager is not
                                        compliant with the DOM binding for
                                        JavaScript.

                                        This object makes it possible to do
                                        conversions between three kinds of
                                        datetime values. These include the
                                        following constructors:

                                             XMLDate( dateobject ): passes a
                                             JavaScript Date object to the
                                             constructor.
                                             XMLDate(
                                             iso8601datetimeordurationstring ):
                                             passes an XML schema date, time,
                                             datetime, or duration string to the
                                             constructor.
                                             XMLDate( datetimedatum ): a
                                             Service Manager datum object of
                                             type TIME to the constructor.

Note

In ServiceCenter version 6.1, the File and SCDoc objects are deprecated. We
strongly recommend that you don't use these objects since they may be
removed in a future release.


1.2.5.3.1. JavaScript object: Attachment

The following JavaScript object is unique to Service Manager. This object allows you to
create attachments for use with doSOAPRequest methods. You have to manually define
the value property of each attachment object. For binary data attachments, you can use
the readFile global method to assign the value property. If you need to create multiple
attachments for a doSOAPRequest request, you can use the push method to add each
Attachment object to a JavaScript array.
Constructor

  new Attachment();

Arguments
None
Properties
The following properties are valid for this object:

Property                                Data type                                 Service Manager 9.81
value                                   Binary or String
len                                     Integer           Description
href                                    String
                                                          Use this property to store
action                                  String            the binary or string data of
                                                          the attachment.
name                                    String
type                                    String            This property contains the
                                                          file size of the attachment
This PDF was generated on May 23, 2026                    in bytes.

                                                          Use this property to store
                                                          the unique identifier for
                                                          the attachment in the
                                                          SOAP request message.

                                                          Use this property to store
                                                          the name of action to take
                                                          with the attachment in the
                                                          Service Manager Web
                                                          Services API. The
                                                          following options are
                                                          available:

                                                               add – adds the
                                                               specified attachment
                                                               remove – removes
                                                               the specified
                                                               attachment
                                                               get – retrieves the
                                                               specified attachment
                                                               update – updates the
                                                               specified attachment

                                                          Use this property to store
                                                          the file name of the
                                                          attachment.

                                                          Use this property to store
                                                          the MIME type of the
                                                          attachment.

                                                                                                        Page 13 of 250

Property                                Data type  Description
attachmentType                          String
                                                   Use this property to store
stringValue                             String     the attachment type as
                                                   defined in Service
                                                   Manager. If present and
                                                   the property has a value
                                                   of "img," then the
                                                   attachment must also
                                                   have a MIME type of
                                                   "image/gif".

                                                   This is a read only
                                                   property.

                                                   When the attachment
                                                   object contains a text
                                                   value (utf-8 or ascii
                                                   characters), user can use
                                                   this property to get the
                                                   string data of the
                                                   attachment. The obtained
                                                   string date then can be
                                                   printed, concatenated,
                                                   etc.

Methods

None

Example

     This example does the following:
     Assume there are two attachments in the incident IM10005
     Get the existing attachments from the IM10005
     Concatenate these two attachments to a string
     Create a new attachment which contains the concatenated string value
     Insert MyAttachment.txt into IM10005 as a new attachment

This example requires the following sample data:

     A binary file (for example, an image)


var f = new SCFile( 'probsummary' );
var rc = f.doSelect( 'number = "IM10005"' );
var attachmentObj = f.getAttachments();
var str = "";
for ( var attachment in attachmentObj )
{
print("Attachment Name: "+ attachmentObj[ attachment ].name );
print("Attachment Value: "+ attachmentObj[ attachment ].stringValue
);
print("Attachment Value Length: "+ attachmentObj[ attachment
].stringValue.length );
print("Attachment HREF: "+ attachmentObj[ attachment ].href );
print("Attachment Type: "+ attachmentObj[ attachment ].type);
str+= attachmentObj[ attachment ].stringValue ;
}
//Create new attachment with a concatenated value
print("String Length: "+str.length);
var attachObj = new Attachment();
attachObj.type = "text/plain";
attachObj.name = "MyAttachment.txt";
attachObj.value = str;
var attachmentID = f.insertAttachment( attachObj );
print("AttachmentID: "+attachmentID);


1.2.5.3.2. JavaScript object: Header

The following JavaScript object is unique to Service Manager.

With no arguments, the Header() constructor creates an empty Header object.

With the HTTP header arguments, the Header() constructor creates a Header object
containing the provided header types and values. You must enclose header types and
header values in quotation marks.

Constructor

new Header();
new Header(Header type, Header value);

Arguments
The following arguments are valid for this object:

Argument                                Description
Header type
                                        The HTTP header type such as Accept-
Header value                            Encoding or Content-Type.

                                        The HTTP header value such as
                                        gzip,deflate or textl.

Properties

None

Methods

None

Example

This example does the following:

     Creates a Header object using the Header type and Header value arguments
     Creates a second empty Header object
     Defines the properties of the second Header object
     Creates an empty JavaScript array
     Adds the two Header objects to the JavaScript array

This example requires the following sample data:


A valid header

var h = new Header( "Accept-Encoding", "gzip,deflate" );
var hd = new Header();
hd.name = "Content-Type";
hd.value = "text/html";
var headers = new Array();
headers.push( h );
headers.push( hd );
````
