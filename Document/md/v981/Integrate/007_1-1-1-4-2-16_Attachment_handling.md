---
source: Document/pdf/v981/Integrate.pdf
version: 9.81
sections: 1.1.1.4.2.16 .. 1.1.1.4.2.16
printed_pages: 168-181
---

# 1.1.1.4.2.16 Attachment handling

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.1.1.4.2.16. Attachment handling

What do the following error messages mean?

Error Message: Warning: incoming add attachment request 1 has no href attribute

Error: unable to match incoming add attachment request 1 with no href attribute to an
attachment part

They indicate that the <attachment> elements in the XML in the SOAP requests don't have a
href or contentId attribute value. The same value is supposed to be in the MIME message part
as the Content-ID: value. In SOAP with attachments, we need a correlation between the XML
element/attributes that describe the attachment, and the actual binary or base64 attachment
content which is in a MIME message. This correlation is typically a unique ID specified in an
href or Content-ID attribute.

The Service Manager server deliberately allows requests that omit the href or contentId and
attempts to match up the XML and the attachment parts.

We report the missing href or contentId value with a message in the >sm.log file, as follows:

Warning: incoming add attachment request 1 has no href attribute

The server first tries to get an href or contentId value out of the XML; if it succeeds, it finds the
associated MIME attachment by looking for a MIME message part whose id has the same
value. If there is no href or Content-ID, the server tries to match up the <attachment> element
with a particular attachment part. This assumes that there is a one-to-one correspondence
between <attachment> elements and attachment parts and uses the index of the DOM node of
the <attachment> element as an index into the array of binary attachment parts.

This strategy doesn't work when there are miscellaneous white-space nodes in the DOM
document, because the index number of the DOM node for the <attachment> element is
greater than it would otherwise be.

Service Manager allows requests with no href or
content-id

The reason Service Manager allows requests with no href or Content-ID is that with some tools
and toolkits it is difficult to arrange for the unique id of an attachment part to be the same in the
XML as in the binary attachment part. Though this is trivial when using .NET, when using Axis,
the Java code would generate a unique cid value in the MIME message part dynamically during
message serialization. Unless you write code to set up a handler to participate in serialization
(via a callback), it is impossible to match the value in the XML to the value in the MIME
message part. To prevent these problems, Service Manager:

     Relaxed the schema such that href was not strictly required (use=optional).
     Added an alternative, optional attribute called Content-ID, which is used instead of href
     when serving responses containing attachments to Axis clients.


     Added code to try to guess the href value that should be present in the XML, if it is
     missing. If we are processing the Nth <attachment> element (the Nth DOM Node within
     the set of DOM children for the <attachments> element, where the <attachment> element
     has neither an href nor a Content-ID attribute), Service Manager tries to look at the
     attachment part with the same index value to check whether the name, length, and type
     match. If the number of DOM Node children under <attachments> doesn't match the
     number of attachment parts, Service Manager can't process the attachment. It prints the
     following error in the sm.ini file:

          Error: unable to match incoming add attachment request 2 with no

          href

          attribute to an attachment part

     This message says "attachment request 2", which seems to be incorrect; because there
     is only 1 <attachment> element, it should apparently be "attachment request 1." However,
     the attachment element is the second DOM child node of <attachments> due to the white
     space text present as DOM child node 1; the first child node of <attachments> is white
     space that may be ignored.

     The workaround is either don't serialize with pretty-printing (such as adding white space
     nodes to make the XML easier to read for the human eye) when sending requests to
     Service Manager, or write code that ensures that requests containing attachment
     operations have either an href or Content-ID attribute on the <attachment> element.

     Supported attachment types in Service Manager are MIME and MTOM. We often get the
     question if the consumer doesn't support these attachment types, if the
     SYSATTACHMENTS file can be exposed to get the attachments out of Service Manager.
     This is unsupported. The attachments are compressed and cut into <=32K pieces and
     can't easily be read from an outside source. A workaround that customers use frequently
     is receiving the attachment with the parent record, for example via a RetrieveIncident
     request, and then transforming it into base64 and sending to the consuming application
     where it can be transformed into the required format.

Sample script to send a record with attachments within
Service Manager

The sample script below sends a record with attachments from Service Manager to
ServiceManager. First, you will need to have a generated JavaScript for both Service
Managers: Service Manager 1, called IncidentManagement, and Service Manager 2, called
IncidentManagementTarget.

            Note

           The lines in bold font perform the attachment handling.


try
{

              //STEP 1 --> RETRIEVE AN EXISTING INCIDENT HAVING ATTACHMENT(S)
//THIS EXAMPLE USE "IM10010", PLEASE ADD ONE OR MORE ATTACHMENTS TO
THIS INCIDENT IF NO

              var imService = new
lib.IncidentManagement.IncidentManagement();

              var request = new
lib.IncidentManagement.RetrieveIncidentRequest();

              request.model.instance.IncidentID.setValue( "IM10010" );
              request.attachmentInfo = true;
              request.attachmentData = true;
              imService.user = "falcon";
              imService.pwd = "";
              var incidentResp = imService.invoke( request );
              if ( incidentResp.isFault() )
              {

                             print ( incidentResp.detail );
              }
              else
              {

                             print( "SM OOB Test: Retrieved incident:" +
incidentResp.model.instance.IncidentID.getValue());

              }

            //STEP2 -->CREATE A NEW INCIDENT BASED ON THE RETRIEVED INCIDENT
//USING 'IncidentManagement' WEB SERVICE

              var imService2 = new
lib.IncidentManagementTarget.IncidentManagement();

              var attach
              var newAttach = new Array();
              for (var i=0;
i<incidentResp.model.instance.attachments.attachment.length; i++)
              {

                             attach = imService.attachments[i];
                             attach.href = "test_"+i;
                             attach.action="add";
                             newAttach.push( attach );
              }
              var createIM = new
lib.IncidentManagementTarget.CreateIncidentRequest();


imService2.setAttachments( newAttach );
imService2.user = "falcon";
imService2.pwd = "";
createIM.attachmentData = true;
createIM.attachmentInfo = true;

createIM.model.instance.OpenedBy.setValue(incidentResp.model.instance.O
penedBy.getValue());

createIM.model.instance.Title.setValue(incidentResp.model.instance.Titl
e.getValue());

createIM.model.instance.Category.setValue(incidentResp.model.instance.C
ategory.getValue());

createIM.model.instance.Area.setValue(incidentResp.model.instance.Area.
getValue());

createIM.model.instance.Subarea.setValue(incidentResp.model.instance.Su
barea.getValue());

createIM.model.instance.Impact.setValue(incidentResp.model.instance.Imp
act.getValue());

createIM.model.instance.Urgency.setValue(incidentResp.model.instance.Ur
gency.getValue());

createIM.model.instance.AssignmentGroup.setValue(incidentResp.model.ins
tance.AssignmentGroup.getValue());

createIM.model.instance.Service.setValue(incidentResp.model.instance.Se
rvice.getValue());

              for (var i=0;i<newAttach.length;i++)
              {

                             var attachmentXml =
createIM.model.instance.attachments.attachment_newInstance();

                             attachmentXml.action = newAttach[i].action;
                             attachmentXml.name = newAttach[i].name;
                             attachmentXml.type = newAttach[i].type;
                             attachmentXml.len = newAttach[i].value.length;
                             attachmentXml.attachmentType = attach.attachmentType;
              }
              for (var


i=0;i<incidentResp.model.instance.Description.Description.length; i++)
              {
                             newDescriptionLine =

createIM.model.instance.Description.Description_newInstance();

newDescriptionLine.setValue(incidentResp.model.instance.Description.Des
cription[i].getValue());

              }

                 response = imService2.invoke(createIM);
                 if ( response.isFault() )
                 {

                               print ( "SM OOB Test: Outgoing request failed with
  error:" + response.detail );

                 }
                 else
                 {

                               if ( response.messages.message.length; i++ )
                               {

                                              print ( "SM OOB Test: Outgoing request returned
  message:"

                                                                +
  response.messages.message[i].getValue() );

                               }
                 }
  print("Incident" + incidentResp.model.instance.IncidentID.getValue()

                          + "was retrieved from" + imService.getHost() + ":" +
  imService.getPort()

                          + "and copied to new incident "
                          + response.model.instance.IncidentID.getValue()
                          + "on" + imService2.getHost() + ":" +
  imService2.getPort());
  }
  catch( e )
  {
                 print( "SM OOB Test: Outgoing request returned message: "

                                                   + response.messages.message[i].getValue() );
  );
  }

Attachment operations using the SOAP API

Service Manager supports all typical attachment operations using its web services (SOAP API)
or REST API. These operations include: get attachment information, get (single) attachment,


delete (single) attachment, insert an attachment, and so on.

The following topics describe how to perform typical attachment operations by using the web
services (SOAP) API. It provides information about the services published by Service Manager,
and explains requests of an external application being sent to Service Manager, as well as the
responses to expect.

            Tip

           This topic describes attachment operations that you can perform using the Service
           Manager web services (SOAP API). For information about attachment operations
           using the REST API, see Attachment operations using the RESTful API.

When writing Web services requests, the WSDL files published by Service Manager on the
published services contain the API information. These files are auto-generated from the
extaccess dbdict. They can be displayed in a browser using a URL like any one of the
following:

     http://localhost:13080/sc62server/PWS/IncidentManagement.wsdl
     http://localhost:13080/SM/9/IncidentManagement.wsdl

            Note

           When the sc62server URL is used, the attachment format is MIME; when the SM/9
           URL is used, the attachment format is MTOM.

            Tip

           Testing web services with tools is quite easy. To avoid unnecessary complexity, the
           SoapUI tool is used for the example below.

Both the request and response tag names include the operation name (for example, Retrieve or
Update), and the target object name (for example, Incident) in namespace
http://schemas.hp.com/SM/9.
The following is an example of a request tag (the prefix ns refers to the namespace definition
in the <soapenv> tag):

  <ns:RetrieveIncidentRequest>

The following is an example of a response tag:

  <RetrieveIncidentResponse>

The operation is also reflected in the HTTP header property named SOAPAction. For example:


  SOAPAction: "Update"

If the request tag and the SOAPAction header don't match, the response shows an error
message:

  <faultstring>A CXmlApiException was raised in native code : error 16 :
  scxmlapi(16) - Invalid or missing file name in XML
  request</faultstring>

Retrieve attachment information

Set up a Retrieve request and set the attachmentInfo attribute in the request tag to true.

  <soapenv:Envelope
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:ns="http://schemas.hp.com/SM/9"
  xmlns:com="http://schemas.hp.com/SM/9/Common"
  xmlns:xm="http://www.w3.org/2005/05/xmlmime">
  <soapenv:Header/>
  <soapenv:Body>
  <ns:RetrieveIncidentRequest attachmentInfo="true">
  <ns:model>
  <ns:keys><ns:IncidentID>IM10003</ns:IncidentID></ns:keys>
  <ns:instance></ns:instance>
  </ns:model>
  </ns:RetrieveIncidentRequest>
  </soapenv:Body>
  </soapenv:Envelope>

The response contains the complete Incident data (shortened in the example below) and the
attachment information:


<SOAP-ENV:Envelope xmlns:SOAP-
ENV="http://schemas.xmlsoap.org/soap/envelope/">
<SOAP-ENV:Body>
<RetrieveIncidentResponse message="Success" returnCode="0"
schemaRevisionDate="2016-05-10" schemaRevisionLevel="0"
status="SUCCESS"
xsi:schemaLocation="http://servicecenter.peregrine.com/PWS
http://bra03sm25.eu.hpecorp.net:13080/sc62server/Incident.xsd"
xmlns="http://servicecenter.peregrine.com/PWS"
xmlns:cmn="http://servicecenter.peregrine.com/PWS/Common"
xmlns:xsd="http://www.w3.org/2001/XMLSchema"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
<model>
<keys>
<IncidentID type="String">IM10003</IncidentID>
</keys>
<instance recordid="IM10003 - Not able to print"
uniquequery="number=&quot;IM10003&quot;">
<IncidentID type="String">IM10003</IncidentID>
[..]
<attachments>
<cmn:attachment href="cid:551bb5d00003a005805a1278" len="19779"
name="cwc_labels_ru.utf8" type="application/octet-stream"
upload.by="falcon" upload.date="04/01/15 03:09:36"/>
<cmn:attachment href="cid:551bb5d00008c006805a1278" len="12842"
name="cwc_labels_en.properties" type="application/octet-stream"
upload.by="falcon" upload.date="04/01/15 03:09:36"/>
<cmn:attachment href="cid:551bb5d0000b8007805a1278" len="14606"
name="cwc_labels_de.utf8" type="application/octet-stream"
upload.by="falcon" upload.date="04/01/15 03:09:36"/>
<cmn:attachment href="cid:5668051d000e901f808612a0" len="21579"
name="cimultirel.unl" type="application/octet-stream"
upload.by="falcon" upload.date="12/09/15 03:40:29"/>
<cmn:attachment href="cid:566808350013605b809bd6c0" len="27944"
name="cimultirel_v2.1.unl" type="application/octet-stream"
upload.by="falcon" upload.date="12/09/15 03:53:41"/>
</attachments>
</instance>
</model>
</RetrieveIncidentResponse>
</SOAP-ENV:Body>
</SOAP-ENV:Envelope>


In the attachment information section, the href attribute contains the content id for each
attachment.

            Note

           When the attachmentData attribute in the request tag is set to true, the response
           contains all file attachments. If attachmentData is set to true, the attachment
           information is always included in the response, regardless of the attachmentInfo
           attribute.

Retrieve a single attachment

In the attachments tag, specify the attachment using the href attribute and set the attribute
action to get. In the request tag, the attachmentData attribute must exist and must be set to
true.

  <soapenv:Envelope
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:ns="http://schemas.hp.com/SM/9"
  xmlns:com="http://schemas.hp.com/SM/9/Common"
  xmlns:xm="http://www.w3.org/2005/05/xmlmime">
  <soapenv:Header/>
  <soapenv:Body>
  <ns:RetrieveIncidentRequest attachmentData="true">
  <ns:model>
  <ns:keys><ns:IncidentID>IM10003</ns:IncidentID></ns:keys>
  <ns:instance>
  <attachments>
  <attachment href="cid:551bb5d00003a005805a1278" action="get"/>
  </attachments>
  </ns:instance>
  </ns:model>
  </ns:RetrieveIncidentRequest>
  </soapenv:Body>
  </soapenv:Envelope>

Now the attachment appears below the XML response in Soap UI.
The raw message showing the file contents is put into a separate HTTP message part:
Note: In Keep-Alive: timeout=60 , the unit is second.


  HTTP/1.1 200 OK
  Server: Apache-Coyote/1.1
  Set-Cookie: JSESSIONID=7A8FB01D34C0CF736842A48724DF3FB5;
  Path=/sc62server/; HttpOnly
  Keep-Alive: timeout=60, max=100
  Connection: Keep-Alive
  Content-Encoding: gzip
  Content-Type: multipart/related; boundary="----
  =_Part_56_30479565.1495112821461"; type="text/xml"
  Transfer-Encoding: chunked
  Date: Thu, 18 May 2017 13:07:01 GMT
  ------=_Part_56_30479565.1495112821461
  Content-Type: text/xml; charset=utf-8
  <SOAP-ENV:Envelope xmlns:SOAP-
  ENV="http://schemas.xmlsoap.org/soap/envelope/"><SOAP-ENV:Body>
  <RetrieveIncidentResponse message="Success" returnCode="0"
  [..]
  ------=_Part_56_30479565.1495112821461
  Content-Type: application/octet-stream
  Content-Location: cwc_labels_ru.utf8
  Content-ID: cid:551bb5d00003a005805a1278
  # <!-- (C) Copyright Hewlett-Packard Company, L.P. All Rights Reserved.
  -->
  AboutPage.Title=Ðž Ð¿Ñ€Ð¾Ð³Ñ€Ð°Ð¼Ð¼Ð½Ð¾Ð¼ Ð¾Ð±ÐµÑ�Ð¿ÐµÑ‡ÐµÐ½Ð¸Ð¸ HP
  [..]

Delete an attachment

To remove an attachment, set the action for the attachment to remove.
Any manipulation of an attached file requires a successful update to the target record, and
therefore all validations must be passed. For this reason, the example request updates some
incidents field as well.


  <soapenv:Envelope
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:ns="http://schemas.hp.com/SM/9"
  xmlns:com="http://schemas.hp.com/SM/9/Common"
  xmlns:xm="http://www.w3.org/2005/05/xmlmime">
  <soapenv:Header/>
  <soapenv:Body>
  <ns:UpdateIncidentRequest attachmentInfo="true" attachmentData="false">
  <ns:model>
  <ns:keys>
  <ns:IncidentID>IM10003</ns:IncidentID>
  </ns:keys>
  <ns:instance>
  <Category>incident</Category>
  <Area>hardware</Area>
  <Subarea>hardware failure</Subarea>
  <JournalUpdates>
  <JournalUpdates>Drop attachment</JournalUpdates>
  </JournalUpdates>
  <ns:attachments>
  <com:attachment href="cid:551bb5d00003a005805a1278" action="remove"/>
  </ns:attachments>
  </ns:instance>
  </ns:model>
  </ns:UpdateIncidentRequest>
  </soapenv:Body>
  </soapenv:Envelope>

Attach a new file to an incident

Attaching a file also uses the attachments tag. The action attribute is set to add. The href
attribute refers to the HTTP message of the request itself. Therefore, the href attribute
received in the response may differ from that.
The file name for the attachment is set by the name attribute, and the content type by the type
attribute. Therefore, the actual file name on the source system is not sent in the request.
An update request looks like the following:


  <soapenv:Envelope
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:ns="http://schemas.hp.com/SM/9"
  xmlns:com="http://schemas.hp.com/SM/9/Common"
  xmlns:xm="http://www.w3.org/2005/05/xmlmime">
  <soapenv:Header/>
  <soapenv:Body>
  <ns:UpdateIncidentRequest attachmentInfo="true">
  <ns:model>
  <ns:keys>
  <ns:IncidentID>IM10003</ns:IncidentID>
  </ns:keys>
  <ns:instance>
  <Category>incident</Category>
  <Area>hardware</Area>
  <Subarea>hardware failure</Subarea>
  <JournalUpdates>
  <JournalUpdates>Attach a file</JournalUpdates>
  </JournalUpdates>
  <ns:attachments>
  <com:attachment href="cid:soapui.log" name="soapui.log"
  type="application/octet-stream" action="add"/>
  </ns:attachments>
  </ns:instance>
  </ns:model>
  </ns:UpdateIncidentRequest>
  </soapenv:Body>
  </soapenv:Envelope>

Then, you receive the following attachment information in the response, which lists both the
previously existing attachments and the new file attachment:


[..]
<attachments>
<cmn:attachment href="cid:551bb5d00008c006805a1278" len="12842"
name="cwc_labels_en.properties" type="application/octet-stream"
upload.by="falcon" upload.date="04/01/15 03:09:36"/>
<cmn:attachment href="cid:551bb5d0000b8007805a1278" len="14606"
name="cwc_labels_de.utf8" type="application/octet-stream"
upload.by="falcon" upload.date="04/01/15 03:09:36"/>
<cmn:attachment href="cid:5668051d000e901f808612a0" len="21579"
name="cimultirel.unl" type="application/octet-stream"
upload.by="falcon" upload.date="12/09/15 03:40:29"/>
<cmn:attachment href="cid:566808350013605b809bd6c0" len="27944"
name="cimultirel_v2.1.unl" type="application/octet-stream"
upload.by="falcon" upload.date="12/09/15 03:53:41"/>
<cmn:attachment href="cid:591da42c0029800280680d00" len="79002"
name="soapui.log" type="application/octet-stream" upload.by="falcon"
upload.date="05/18/17 07:39:56"/>
</attachments>
[..]
````
