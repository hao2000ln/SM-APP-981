---
source: Document/pdf/v981/Develop.pdf
version: 9.81
sections: 1.2.5.2 .. 1.2.5.2.5
printed_pages: 1539-1571
---

# 1.2.5.2 List: JavaScript global methods

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.5.2. List: JavaScript global methods

Global methods are functions that are available to any script as they're not methods
of any specific object. You can invoke global methods directly just as you would do
with any core JavaScript global functions such as parselnt() or eval().
This is a complete list of all the global methods available in Service Manager.

 Global method                                                                                  Service Manager 9.81
 base64Decode
 base64Encode                           Description
 compile
 doHTTPRequest                          Converts base 64 string data to its
 doSOAPRequest                          original format.
 execute
 getLog                                 Converts binary data to a base 64
                                        string format.
 help
                                        Validates the syntax of the specified
 insertDatum                            JavaScript.
 makeSCWebURL
 print                                  Issues an HTTP request to a specified
 RCtoString                             URL.

This PDF was generated on May 23, 2026  Issues an SOAP request to a specified
                                        URL.

                                        This method performs the specified
                                        process or program.

                                        This method retrieves a logger named
                                        according to the value of the name
                                        parameter.

                                        Displays a brief description of a
                                        Service Manager-defined JavaScript
                                        object.

                                        Inserts data into an array datum
                                        directly.

                                        Creates a URL query to the Service
                                        Manager Web tier.

                                        Displays a message in the client
                                        Messages view.

                                        Converts a Service Manager global
                                        return code value into a localized text
                                        string.

                                                                                                                        Page 205 of 269
Global method                                                                                   Service Manager 9.81
readFile
rteJSONStringify                        Description
rteJSONParse
setAppMessage                           Reads data from the local file system.

stripHtml                               Converts a value to JSON.

uncompressFile                          Parses a string as JSON.
writeAttachmentToFile
writeFile                               Defines the message returned in the
xmlstring                               "message" attribute in the soap
                                        response.

                                        Takes HTML content and strips out the
                                        HTML tags and returns the content as
                                        text without the HTML tags.

                                        Expands a .zip file into a specified
                                        location.

                                        Writes a requested attachment record
                                        to the local file system.

                                        Writes data to the local file system.

                                        Converts a JavaScript string to an XML
                                        string.


1.2.5.2.1. JavaScript global method:
base64Decode

Converts base 64 string data to its original format.

            Note

           If the value of the data parameter defined in base64Decode() is not a
           valid base64 string, the base64Decode() method will throw an exception
           with the "Exception occurred when calling JSBase64Decode" error
           message. See JavaScript tailoring guideline for details.

Syntax

base64Decode( data );

Arguments
The following arguments are valid for this function:

Argument  Data type                     Required      Description
data      Binary                        Yes
                                                      This argument
                                                      contains the data
                                                      you want the
                                                      script to decode
                                                      to its original
                                                      format.

Return values
A binary or string object containing the original data.
Description
This method converts data in base 64 string format to its original format.
Example
This example does the following:

     Reads the contents of a binary file


     Converts the file to a base 64 string format
     Writes the base 64 string data to a local file
     Prints the number of bytes written to the local file system
     Reads the contents of a base 64 string format file
     Converts the data into a binary file
     Writes the binary data to a local file
     Prints the number of bytes written to the local file system

This example requires the following sample data:

     A binary file on the local file system (for example, an image file)

  var source = readFile( "C:\\header_left.gif", "b" );
  var encode = base64Encode( source );
  var encodedFile = writeFile( "C:\\base64EncodedImage.txt", "b",
  encode );
  print( "Wrote " + encodedFile + " bytes to
  C:\\base64EncodedImage.txt" );
  source = readFile( "C:\\base64EncodedImage.txt", "t" );
  var decode = base64Decode( source );
  var decodedFile = writeFile( "C:\\newImage.gif", "b", decode );
  print( "Wrote " + decodedFile + " bytes to C:\\newImage.gif" );


1.2.5.2.2. JavaScript global method:
base64Encode

Converts binary data to a base 64 string format.
Syntax

base64Encode( data );

Arguments
The following arguments are valid for this function:

Argument  Data type                     Required      Description
data      Binary                        Yes
                                                      This argument
                                                      contains the data
                                                      you want the
                                                      script to encode
                                                      in base 64
                                                      format.

Return values
A string object containing the data in base 64 format.
Description
This method converts binary data to a base 64 string format. You can also use this
method to encode plain text data in base 64 format.
Example
This example does the following:

     Reads the contents of a binary file
     Converts the file to a base 64 string format
     Prints the base 64 string

This example requires the following sample data:

     A binary file on the local file system (for example, an image file)


var source = readFile( "C:\\header_left.gif", "b" );
var encode = base64Encode( source );
print( "The value of encode is:\n" + encode );


1.2.5.2.3. JavaScript global method:
compile

Validates the syntax of the specified JavaScript.
Syntax

compile( script, description );

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
RC_SUCCESS if there is no compilation error or -1 if any compilation error.
This method also returns a success or error message. It displays the following
message if the JavaScript passes validation:

Successful compilation of JavaScript function or expression.
Throws
None
Description
This method validates the syntax of a JavaScript and displays a message as to the
success or failure of the validation. This method is an alias of the execute() method.


Example
This example does the following:

     Creates a variable to store a JavaScript name
     Validates the contents of the script
This example requires the following sample data:
     A valid JavaScript

  var s = "lib.SCFILEgetTextTest"
  compile( s, "Testing execute" );


1.2.5.2.4. JavaScript global method:
doHTTPRequest

Issues an HTTP request to a specified URL.
Syntax
doHTTPRequest( HTTP command, URL, Headers, POST body, Connect Timeout,
Read Timeout, Obsolete, Response headers, Binary request data, Binary response
data, Follow redirects, HTTP proxy host, HTTP proxy port, HTTP proxy authentication
user, HTTP proxy authentication password, Client Keystore Name);
Arguments
The following arguments are valid for this function:

Argument      Data type                 Required         Service Manager 9.81
HTTP command  String                    Yes
                                                  Description
URL           String                    Yes
                                                  This argument
Headers       Array                     Yes       specifies a
                                                  command verb.
POST body     String                    No        We support GET,
                                                  POST, PUT,
                                                  HEAD, PATCH and
                                                  DELETE.

                                                  This argument
                                                  specifies the URL
                                                  to which the
                                                  script should
                                                  send an HTTP
                                                  request. If the
                                                  HTTP request
                                                  requires SSL then
                                                  the URL must
                                                  start with https.

                                                  This argument
                                                  contains a
                                                  JavaScript array
                                                  of Service
                                                  Manager-defined
                                                  Header objects or
                                                  an empty array.
                                                  See JavaScript
                                                  object: Header for
                                                  more information.

                                                  This argument
                                                  contains the body
                                                  of a POST
                                                  command
                                                  request.

Argument  Data type                     Required         Service Manager 9.81
          Number                        No
Connect                                           Description
Timeout
                                                  This argument
                                                  specifies the
                                                  number of
                                                  seconds an HTTP
                                                  request has to
                                                  establish a
                                                  connection
                                                  before it times
                                                  out.

Argument  Data type                     Required         Service Manager 9.81

This PDF was generated on May 23, 2026            Description

                                                              Note

                                                             The
                                                             defaul
                                                             t
                                                             value
                                                             is 120
                                                             secon
                                                             ds,
                                                             and
                                                             the
                                                             maxi
                                                             mum
                                                             value
                                                             is 600
                                                             secon
                                                             ds.
                                                             That
                                                             is, if
                                                             you
                                                             try to
                                                             set
                                                             the
                                                             value
                                                             to a
                                                             numb
                                                             er
                                                             larger
                                                             than
                                                             600
                                                             secon
                                                             ds,
                                                             the
                                                             actual
                                                             timeo
                                                             ut
                                                             perio
                                                             d will
                                                             be
                                                             120
                                                             secon

                                                                           Page 216 of 269
Argument  Data type                     Required         Service Manager 9.81

                                                  Description

                                                             ds. In
                                                             additi
                                                             on,
                                                             settin
                                                             g the
                                                             value
                                                             to 0
                                                             also
                                                             make
                                                             s the
                                                             actual
                                                             timeo
                                                             ut
                                                             perio
                                                             d 120
                                                             secon
                                                             ds.

Argument      Data type                 Required         Service Manager 9.81
Read Timeout  Number                    No
                                                  Description

                                                  This argument
                                                  specifies the
                                                  number of
                                                  seconds an HTTP
                                                  request has to
                                                  read data before
                                                  it times out.

Argument  Data type                     Required         Service Manager 9.81

This PDF was generated on May 23, 2026            Description

                                                              Note

                                                             The
                                                             defaul
                                                             t
                                                             value
                                                             is 120
                                                             secon
                                                             ds,
                                                             and
                                                             the
                                                             maxi
                                                             mum
                                                             value
                                                             is 600
                                                             secon
                                                             ds.
                                                             That
                                                             is, if
                                                             you
                                                             try to
                                                             set
                                                             the
                                                             value
                                                             to a
                                                             numb
                                                             er
                                                             larger
                                                             than
                                                             600
                                                             secon
                                                             ds,
                                                             the
                                                             actual
                                                             timeo
                                                             ut
                                                             perio
                                                             d will
                                                             be
                                                             120
                                                             secon

                                                                           Page 219 of 269
Argument    Data type                   Required         Service Manager 9.81

Receive timeout Number                  No        Description

(Obsolete)                                                   ds. In
                                                             additi
Response    Object                      No                   on,
                                                             settin
headers                                                      g the
                                                             value
Binary request Boolean                  No                   to 0
                                                             also
data                                                         make
                                                             s the
Binary response Boolean                 No                   actual
                                                             timeo
data                                                         ut
                                                             perio
                                                             d 120
                                                             secon
                                                             ds.

                                                  This argument is
                                                  obsolete.

                                                  This argument
                                                  receives the
                                                  headers of an
                                                  HTTP response.

                                                  This argument
                                                  specifies if the
                                                  content of a post
                                                  body is binary
                                                  data.

                                                  This argument
                                                  specifies if the
                                                  content of an
                                                  HTTP response is
                                                  binary data.

Argument          Data type             Required         Service Manager 9.81
Follow redirects  Boolean               No
                                                  Description
Http Proxy Host String                  No
                                                  This argument
Http Proxy Port Number                  No        specifies if the
                                                  HTTP client
Http Proxy        String                No        automatically
                                                  follows the HTTP
Authentication                                    redirects
                                                  (requests with the
user                                              response code
                                                  3xx). The default
Http Proxy        String                No        value is true.

Authentication                                    This argument
                                                  specifies the
password                                          HTTP proxy host.

                                                  This argument
                                                  specifies the
                                                  HTTP proxy port.

                                                  This argument
                                                  specifies the
                                                  authentication
                                                  user of the HTTP
                                                  proxy.

                                                  This argument
                                                  specifies the
                                                  authentication
                                                  password of the
                                                  HTTP proxy.

Argument         Data type              Required         Service Manager 9.81
Client Keystore  String                 No
Name                                              Description

This PDF was generated on May 23, 2026            This argument
                                                  specifies
                                                  the client
                                                  keystore
                                                  for external Web
                                                  Services.

                                                  When you
                                                  execute
                                                  doHTTPRequest
                                                  to send an HTTPS
                                                  request to the
                                                  Web Services, if
                                                  you omit this
                                                  parameter, the
                                                  keystore of
                                                  Service Manager
                                                  server will be
                                                  used.

                                                  If you want the
                                                  Service
                                                  Manager server
                                                  to act as a client
                                                  while the external
                                                  Web Services
                                                  acts as a server,
                                                  you need to
                                                  follow these
                                                  steps:

                                                     1. Get the
                                                       following
                                                       information
                                                       from the
                                                       Web
                                                       Services
                                                       server:

                                                                           Page 222 of 269
Argument  Data type                     Required         Service Manager 9.81

                                                  Description

                                                             The
                                                             client
                                                             keystor
                                                             e and
                                                             the
                                                             client
                                                             keystor
                                                             e
                                                             passw
                                                             ord
                                                             The
                                                             root
                                                             certific
                                                             ate or
                                                             the
                                                             certific
                                                             ate
                                                             authori
                                                             ty's
                                                             (CA)
                                                             certific
                                                             ate
                                                             Note:
                                                             The
                                                             client
                                                             keystor
                                                             e
                                                             should
                                                             only
                                                             contain
                                                             one
                                                             keystor
                                                             e and
                                                             its
                                                             associa
                                                             ted
                                                             certific

Argument  Data type                     Required         Service Manager 9.81

This PDF was generated on May 23, 2026            Description

                                                             ate
                                                             (chain)
                                                     2. Convert the
                                                       format of
                                                       the client
                                                       keystore
                                                       according to
                                                       your SM
                                                       setup.
                                                             For
                                                             FIPS
                                                             mode:
                                                             Covert
                                                             the
                                                             keystor
                                                             e to
                                                             BCFKS
                                                             format

                                                             For
                                                             non-
                                                             FIPS
                                                             mode:
                                                             Covert
                                                             the
                                                             keystor
                                                             e to
                                                             PKCS1
                                                             2
                                                             format
                                                     3. Update the
                                                       client
                                                       keystore
                                                       password
                                                       with the
                                                       value of the
                                                       keystorePas
                                                       s parameter

                                                                           Page 224 of 269
Argument  Data type                     Required         Service Manager 9.81

This PDF was generated on May 23, 2026            Description

                                                       in sm.ini.
                                                       For example:

                                                           > keytool
                                                       -keystore
                                                       clientkeystor
                                                       e.p12 -alias
                                                       clientkey -
                                                       keypasswd
                                                     4. Copy the
                                                       client
                                                       keystore to
                                                       the <SM
                                                       Server intall
                                                       Path>\RUN
                                                       directory.
                                                     5. Import the
                                                       root
                                                       certificate to
                                                       Service
                                                       Manager
                                                       server's
                                                       truststore.
                                                       For example:

                                                           > keytool
                                                       -import -
                                                       keystore
                                                       <SM Server
                                                       intall
                                                       Path>\RUN\
                                                       <truststoreFi
                                                       le> -
                                                       trustcacerts
                                                       -file
                                                       clientcert.crt
                                                       -alias
                                                       clientkey
                                                     6. Set the
                                                       following

                                                                           Page 225 of 269
Argument  Data type                     Required         Service Manager 9.81

This PDF was generated on May 23, 2026            Description

                                                       parameter
                                                       values in the
                                                       sm.ini file:

                                                             truststo
                                                             reFile
                                                             truststo
                                                             rePass
                                                             keystor
                                                             ePass
                                                     7. For
                                                       horizontal
                                                       scaled (HS)
                                                       environment
                                                       s, repeat
                                                       step #4, #5
                                                       and #6 for
                                                       each host.
                                                     8. Use the
                                                       doHTTPReq
                                                       uest
                                                       JavaScript
                                                       method in
                                                       Service
                                                       Manager to
                                                       send an
                                                       HTTP
                                                       request to
                                                       the Web
                                                       services
                                                       API.
                                                       For example:
                                                        doHTTPReq
                                                       uest("GET",
                                                       url, headers,
                                                       null, 10, 10,
                                                       10, null,false,
                                                       false, true,
                                                       null,'', '','',

                                                                           Page 226 of 269
Argument  Data type                     Required         Service Manager 9.81

                                                  Description
                                                       'clientkeysto
                                                       re.p12');

Return values
A string containing an HTTP response or an error message.
Description
This method sends an HTTP request to a remote server.

            Note

           If the charset is undefined in the Content-Type header in the Headers
           parameter, the charset for the message body will be UTF-8 by default.

Example
This example does the following:

     Sends an HTTP request to the Service Manager Web services API
     If successful, writes the response to a local file
     If unsuccessful, displays the HTTP error message

            Note

           To see a working example of the doHTTPRequest method that
           incorporates multiple error-checking conditions, open the SOAP script in
           the script library. The WSDL2js function uses the doHTTPRequest method
           at line 114 as part of a try/catch statement.

This example requires the following sample data:
     The URL to the Service Manager Web services API


// Use the following url value to produce an HTTP 400 error.
//var url =
"http://localhost:13080/IncidentManagement.wsdl";

// Use the following url value to produce valid WSDL.
var url = "https://fqdn:13443/SM/7/IncidentManagement.wsdl";

var headers = new Array();
var WSDLrequest;
var reply;
var respHeaders = new Object();

try
          {
          // request without proxy
          WSDLrequest = doHTTPRequest( "GET", url, headers,

null, 10, 10, null, respHeaders );
          // request with proxy which no need authentication
          // WSDLrequest = doHTTPRequest( "GET", url, headers,

null, 10, 10, null, respHeaders, "web-
proxy.us.softwaregrp.net", 8080);

          // request with proxy which need authentication
          // WSDLrequest = doHTTPRequest( "GET", url, headers,
null, 10, 10, null, respHeaders,
"smcfrdrte305.hpeswlab.net", 3128, "smdev", "!QAZ2wsx");
          // request specified with the client keystore
for external Web Services
          // WSDLrequest = doHTTPRequest("GET", url, headers,
null, 10, 10, 10, null, false, false, true, null,'', '','',
'clientkeystore.p12');
          print( "The response headers of the doHTTPRequest is:"
);
          for( var name in respHeaders )
          {

                  print( name + "=" + respHeaders[name] );
          }
          print( "The result of the doHTTPRequest is \n" +
WSDLrequest );
          reply = writeFile( "C:\\IncidentManagement.wsdl",
"text", WSDLrequest


);
          }

catch ( e )
          {
          print( "WSDL request failed with exception \n" + e );
          }


1.2.5.2.5. JavaScript global method:
doSOAPRequest

Issues a SOAP request to a specified URL.
Syntax
doSOAPRequest( URL, SOAPAction, XML, SOAP user ID, SOAP password, Connect
Timeout, Read Timeout, Obsolete, Attachment object );
Parameters
The following arguments are valid for this function:

Argument      Data type                 Required         Service Manager 9.81
URL           String                    Yes
                                                  Description
SOAPAction    String                    Yes
                                                  This argument
XML           String                    Yes       specifies the URL
                                                  to which the
SOAP user ID  String                    No        script should
                                                  send an HTTP
                                                  request. If the
                                                  HTTP request
                                                  requires SSL then
                                                  the URL must
                                                  start with https.

                                                  This argument
                                                  specifies the
                                                  SOAPAction
                                                  value.

                                                  This argument
                                                  contains the XML
                                                  for an entire
                                                  SOAP request
                                                  including the
                                                  SOAP envelope.
                                                  Refer to the Web
                                                  Service's WSDL
                                                  to determine the
                                                  proper format of
                                                  the SOAP
                                                  request.

                                                  This argument
                                                  contains the user
                                                  ID to be used for
                                                  the Basic
                                                  Authorization
                                                  HTTP header.

Argument       Data type                Required         Service Manager 9.81
SOAP password  String                   No
                                                  Description
Connect        Number                   No
                                                  This argument
Timeout                                           contains the
                                                  password value
Read Timeout Number                     No        to be used for the
                                                  Basic
Receive timeout Number                  No        Authorization
                                                  HTTP header.
(Obsolete)
                                                  This argument
                                                  specifies the
                                                  number of
                                                  seconds a SOAP
                                                  request has to
                                                  establish a
                                                  connection
                                                  before it times
                                                  out.

                                                  This argument
                                                  specifies the
                                                  number of
                                                  seconds a SOAP
                                                  request has to
                                                  read data before
                                                  it times out.

                                                  This argument is
                                                  obsolete.


Argument    Data type                   Required  Description
            Array                       No
Attachment                                        This argument
object                                            contains a
                                                  JavaScript array
AcceptFastInfos Number                  No        of Service
                                                  Manager-defined
et                                                Attachment
                                                  objects or an
                                                  empty array. See
                                                  JavaScript object:
                                                  Attachment for
                                                  more information.

                                                  To set the SOAP
                                                  Message flag
                                                  "acceptfastinfose
                                                  t". Default value is
                                                  1. To turn
                                                  "acceptfastinfose
                                                  t" off: 0.

Return values

A string containing a SOAP response or an error message.

Description
This method sends a SOAP request to a remote server and returns the SOAP
response.

Examples

Example 1 :

     Sends a SOAP request to a delayed stock quote Web service and indicates SM
     accept the "fastinfoset" formatted SOAP message
     Prints the SOAP response to the screen

This example requires the following sample data:

     The URL to a delayed stock quote Web service
     Stock symbol for company


  var url =
  "http://ws.cdyne.com/delayedstockquote/delayedstockquote.asmx";
  var action = "http://ws.cdyne.com/GetQuote";
  var xml = "<soap:Envelope
  xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\"

        xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"
        xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\"
        xmlns:s0=\"http://ws.cdyne.com/\">
        <soap:Body>

                          <GetQuote xmlns=\"http://ws.cdyne.com/\">
                          <StockSymbol
  xsi:type=\"s:string\">GOOG</StockSymbol>
                          <LicenseKey xsi:type=\"s:string\">0</LicenseKey>
                          </GetQuote>

         </soap:Body></soap:Envelope>";
  var uid = null;
  var pass = null;
  var attachments = new Array();
  var quote = doSOAPRequest( url, action, xml, uid, pass, 60, 60,
  null, attachments );
  print( "The return value is: " + quote );

Example 2:
     Sends a SOAP request to a delayed stock quote Web service and indicates SM
     doesn't accept the "fastinfoset" formatted SOAP message.
     Prints the SOAP response to the screen

This example requires the following sample data:
     The URL to a delayed stock quote Web service
     Stock symbol for company


var url =
"http://ws.cdyne.com/delayedstockquote/delayedstockquote.asmx";
var action = "http://ws.cdyne.com/GetQuote";
var xml = "<soap:Envelope
xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\"

     xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"
     xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\"
     xmlns:s0=\"http://ws.cdyne.com/\">
     <soap:Body>

                  <GetQuote xmlns=\"http://ws.cdyne.com/\">
                  <StockSymbol xsi:type=\"s:string\">GOOG</StockSymbol>
                  <LicenseKey xsi:type=\"s:string\">0</LicenseKey>
                  </GetQuote>

       </soap:Body></soap:Envelope>";
var uid = null;
var pass = null;
var attachments = new Array();
var quote = doSOAPRequest( url, action, xml, uid, pass, 60, 60,
null, attachments, 0 );
print( "The return value is: " + quote );
````
