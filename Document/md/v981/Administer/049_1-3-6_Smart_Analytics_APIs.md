---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.3.6 .. 1.3.6
printed_pages: 1163-1184
---

# 1.3.6 Smart Analytics APIs

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.3.6. Smart Analytics APIs

Smart Analytics provides the following out-of-box APIs:
Smart Analytics RESTful APIs
Auto-classification Javascript API
APIs for Hot Topic Analytics indexing


1.3.6.1. Smart Analytics RESTful APIs

Smart Analytics provides the following RESTful APIs:

     Smart classification
     Hot topic
     Smart search
     Search
     Smart classification (by specifying IDOL adapters)

You must add the capability word RESTful API to a user's operator record for a user to be able to
execute a RESTful API request.

   1. From the System Navigator, click System Administration > Ongoing Maintenance >
     Operators.

   2. Enter or select your search criteria, and then click Search.
   3. Select an operator from the record list to view the operator record.
   4. Click the Startup tab.
   5. Add RESTful API in the Execute Capabilities section.


1.3.6.1.1. Smart classification

This smart classification RESTful API is used to get the classifications suggested by Smart
Analytics.
Request:

  POST http://<SM Server
  Address>:13080/SM/9/rest/SmartAnalytics/1/action/suggest

An example of the request body:

  {
  SmartAnalytics:{
  in:'{"filename": "incidents", "title": "test", "description":
  ["test"],"callback_contact": "AARON, JIM"}'
  }
  }

Response example:

            Note

           You can ignore the messages in the response as these messages are printed by the
           Restful framework.


{
"Messages": [
"Invalid syntax for query. Failed parsing",
"in=\"1\"",
"Invalid syntax for query. Failed parsing",
"in=\"1\""
],
"ReturnCode": 0,
"SmartAnalytics": {
"in": "{\"filename\": \"incidents\", \"title\": \"test\",
\"description\": [\"test\"],\"callback_contact\": \"AARON, JIM\"}",
"out": "
{\"category\":\"incident\",\"subcategory\":\"performance\",\"product.type
\":\"performance degradation\",\"affected.item\":null}"
}
}


1.3.6.1.2. Hot topic

This hot topic RESTful API is used to get the hot topics suggested by Smart Analytics.
Request:

  POST http://<SM Server
  Address>:13080/SM/9/rest/SmartAnalytics/1/action/hottopic

An example of the request body:

{                                       keyword:"email"}',
SmartAnalytics:{
in:'{filename: "probsummary",
}
}

Response example:

Note

You can ignore the messages in the response as these messages are printed by the
Restful framework.


{
"Messages": [
"Invalid syntax for query. Failed parsing",
"in=\"1\"",
"Invalid syntax for query. Failed parsing",
"in=\"1\""
],
"ReturnCode": 71,
"SmartAnalytics": {
"in": "{filename: \"probsummary\", keyword:\"email\"}"
"out": ‘{"recommends":["Shared MailBox"," Unable to access"," Email
receiving"],"subtopics":[{"topic":"Shared MailBox","subtopics":
[{"topic":"New mail sending","docs":["IM10122","IM10056"],"id":2},
{"topic":"box is not accessible on outlook","docs":
["IM10121"],"id":4}],"docs":["IM10121","IM10056"],"id":1},
{"topic":"Unable to access","subtopics":[{"topic":"group
mailbox's","docs":["IM10131","IM10128"],"id":7,"subtopics":
[{"id":8,"topic":"CHAR-Intranet / Internet (North
America)","raw":"Intranet / Internet (North
America)","trivial":true,"docs":["IM10131"]},{"id":9,"topic":"CHAR-
Applications","raw":"Applications","trivial":true,"docs":["IM10128"]}]},
{"topic":"Communication mail","docs":
["IM10084","IM10128"],"id":10,"subtopics":[{"id":11,"topic":"CHAR-E-mail
/ Webmail (North America)","raw":"E-mail / Webmail (North
America)","trivial":true,"docs":["IM10084"]},{"id":12,"topic":"CHAR-
Applications","raw":"Applications","trivial":true,"docs":
["IM10128"]}]}],"docs":["IM10131","IM10021"],"id":6},{"topic":"Email
receiving","subtopics":[{"id":14,"topic":"CHAR-E-mail / Webmail (North
America)","raw":"E-mail / Webmail (North America)","trivial":true,"docs":
["IM10081","IM10125","IM10021"]},{"id":15,"topic":"CHAR-Handheld, PDA &
Telephony","raw":"Handheld, PDA & Telephony","trivial":true,"docs":
["IM10012"]}],"docs":["IM10081","IM10125","IM10021","IM10012"],"id":13},
{"topic":"mail issues","subtopics":[{"id":17,"topic":"CHAR-
Applications","raw":"Applications","trivial":true,"docs":["IM10126"]},
{"id":18,"topic":"CHAR-E-mail / Webmail (North America)","raw":"E-mail /
Webmail (North America)","trivial":true,"docs":
["IM10084","IM10081","IM10056"]}],"docs":
["IM10126","IM10084","IM10081","IM10056"],"id":16},
{"topic":"User","subtopics":[{"id":20,"topic":"CHAR-E-mail / Webmail
(Asia)","raw":"E-mail / Webmail (Asia)","trivial":true,"docs":
["IM10186"]},{"id":21,"topic":"CHAR-E-mail / Webmail (North
America)","raw":"E-mail / Webmail (North America)","trivial":true,"docs":
["IM10091","IM10039","IM10081","IM10021"]},{"id":22,"topic":"CHAR-E-mail
/ Webmail (Africa)","raw":"E-mail / Webmail
(Africa)","trivial":true,"docs":["IM10059"]},{"id":23,"topic":"CHAR-


Applications","raw":"Applications","trivial":true,"docs":
["IM10105"]}],"docs":
["IM10186","IM10091","IM10059","IM10039","IM10105","IM10081","IM10021"],"
id":19},{"topic":"outlook","subtopics":[{"id":25,"topic":"CHAR-
Applications","raw":"Applications","trivial":true,"docs":
["IM10126","IM10011","IM10105","IM10128"]},{"id":26,"topic":"CHAR-E-mail
/ Webmail (North America)","raw":"E-mail / Webmail (North
America)","trivial":true,"docs":
["IM10091","IM10039","IM10121","IM10084"]},{"id":27,"topic":"CHAR-
Intranet / Internet (North America)","raw":"Intranet / Internet (North
America)","trivial":true,"docs":["IM10131"]}],"docs":
["IM10126","IM10091","IM10039","IM10011","IM10121","IM10105","IM10084","I
M10131","IM10128"],"id":24}],"summaries":{"IM10011":
{"reference":"IM10011","title":"problems with the send mails from
outlook","summary":"problems with the send mails from outlook. problems
with the send mails from
outlook\n","weight":84.67,"type":"Applications"},"IM10012":
{"reference":"IM10012","title":"Email receiving error when using mobile
phone as email client.","summary":"Email receiving error when using
mobile phone as email client.. report error about 'connection fail' when
attempt to connect to mail server.\n","weight":83.83,"type":"Handheld,
PDA & Telephony"},"IM10021":{"reference":"IM10021","title":"User did not
receive the reset password email notification","summary":"User did not
receive the reset password email notification. I was unable to access
Spend Management as it would not accept my password. I chose Forgot
Password and I still have not received an e-mail with the correct
password.\n","weight":83.83,"type":"E-mail / Webmail (North
America)"},"IM10039":{"reference":"IM10039","title":"outlook flags have
disappeared from the e-mails","summary":"outlook flags have disappeared
from the e-mails. user uses the flags to organize the e-mails, flags have
disappeared from the mailbox.\n","weight":84.67,"type":"E-mail / Webmail
(North America)"},"IM10056":{"reference":"IM10056","title":"Shared
MailBox issue","summary":"Shared MailBox issue. We are receiving the
delivery failure from Generic mailbox while sending new
mails.\n","weight":83.83,"type":"E-mail / Webmail (North
America)"},"IM10059":{"reference":"IM10059","title":"User is not
recieving mails on blackberry","summary":"User is not recieving mails on
blackberry. User is not recieving mails on blackberry and still not work
after restarting.\n","weight":84.67,"type":"E-mail / Webmail
(Africa)"},"IM10081":{"reference":"IM10081","title":"mail
issues","summary":"mail issues. User not receiving salary slips on
email\n","weight":84.46,"type":"E-mail / Webmail (North
America)"},"IM10084":{"reference":"IM10084","title":"Communication mail
issue","summary":"Communication mail issue. I’ am not getting any
communication email to my outlook email id.\n","weight":84.46,"type":"E-
mail / Webmail (North America)"},"IM10091":


{"reference":"IM10091","title":"Users aren't rcving mails on all the
campaings of the COR on Altitude and Outlook both","summary":"Users
aren't rcving mails on all the campaings of the COR on Altitude and
Outlook both. Users aren't rcving mails on all the campaings of the COR
on Altitude and Outlook both. Please assist
asap.\n","weight":84.67,"type":"E-mail / Webmail (North
America)"},"IM10105":{"reference":"IM10105","title":"User unable to send
receive mails on outlook","summary":"User unable to send receive mails on
outlook. outlook state keeps changing from trying to connect to
connected...browser setttings are fine and owa link is also not
working\n","weight":84.46,"type":"Applications"},"IM10121":
{"reference":"IM10121","title":"Shared mail box is not accessible on
outlook","summary":"Shared mail box is not accessible on outlook. I am
not able to access shared mailbox from outlook and Lync since Thursday
after the migration.\nTried adding and removing the mailbox but still
it's not working.\n","weight":84.46,"type":"E-mail / Webmail (North
America)"},"IM10122":{"reference":"IM10122","title":"New mail sending
error","summary":"New mail sending error. When I tried to send new mail
from GSRPA mailbox I’m receiving the below error msg. please do the
needful.\n","weight":84.67,"type":"E-mail / Webmail (North
America)"},"IM10125":{"reference":"IM10125","title":"Not able to send
emails","summary":"Not able to send emails. Not able to send
emails..mails are stucking in outbox.user is able to receive emails how
ever mails are stucking in the Outbox.so raising the request for the
same.\n","weight":83.83,"type":"E-mail / Webmail (North
America)"},"IM10126":{"reference":"IM10126","title":"outlook mail
delivery issue","summary":"outlook mail delivery issue. I am receiving e-
mail in batches, about once an hour. Also, my smartphone keeps
synchronizing e-mail, even though I have set the Sync setting to
'Manual'.\n","weight":84.88,"type":"Applications"},"IM10128":
{"reference":"IM10128","title":"Outlook problem","summary":"Outlook
problem. Communication mail for my Group mailbox\n\nError for your
reference –\n\n\"Cannot Expand the
folder\"\n","weight":83.83,"type":"Applications"},"IM10131":
{"reference":"IM10131","title":"Unable to access group mailbox's
archive","summary":"Unable to access group mailbox's archive. CSCS group
mailbox is recently migrated on outlook and we are unable to access our
group mailbox archive mails. Please do the needful
ASAP.\n","weight":83.83,"type":"Intranet / Internet (North
America)"},"IM10186":{"reference":"IM10186","title":"Not getting mail
from external customer","summary":"Not getting mail from external
customer. user report can't getting mail from external
customer\n","weight":84.67,"type":"E-mail / Webmail (Asia)"}},"docs":
[],"id":0,"topic":"e-mail"}’


}
}


1.3.6.1.3. Smart search

Service Manager uses the hot topic RESTful API to get the search results suggested by Smart
Analytics.

Request:

  POST http://<SM Server
  Address>:13080/SM/9/rest/SmartAnalytics/1/action/smartsearch

An example of the request body:

{                                       start:1, pagesize:2}',
SmartAnalytics:{
in:'{keyword: "test",
}
}

Response example:

Note

You can ignore the messages in the response as these messages are printed by the
Restful framework.


{
"Messages": [
"Invalid syntax for query. Failed parsing",
"in=\"1\"",
"Invalid syntax for query. Failed parsing",
"in=\"1\""
],
"ReturnCode": -1,
"SmartAnalytics": {
"in": "{keyword: \"test\", start:1, pagesize:2}",
"out": "<autnresponse xmlns:autn=\"http://schemas.autonomy.com/aci/\">
<action>QUERY</action><response>SUCCESS</response>
<responsedata>\n<autn:numhits>2</autn:numhits>
<autn:totalhits>18</autn:totalhits>
<autn:totaldbdocs>346</autn:totaldbdocs>
<autn:totaldbsecs>346</autn:totaldbsecs><autn:hit>
<autn:reference>scactivelink:%2F%2Fkmdocument:id%3D%26quot%3BKM0580%26quo
t%3B%26nbsp%3Band%26nbsp%3Bkbname%3D%26quot%3BKnowledge_Library%26quot%3B
</autn:reference><autn:id>1588</autn:id><autn:section>0</autn:section>
<autn:weight>57.09</autn:weight><autn:links>TEST</autn:links>
<autn:database>Knowledge_Library</autn:database><autn:title>test error
message by Jora(Title)</autn:title>
<autn:summary>&lt;_em_&gt;test&lt;/_em_&gt; error message by Jora(Title).
2015/06/22 14:07:46. falcon. external. errormsg.
&lt;_em_&gt;test&lt;/_em_&gt; error message by Jora(Error Message).
&lt;_em_&gt;test&lt;/_em_&gt; error message by Jora(cause).
&lt;_em_&gt;test&lt;/_em_&gt; error message by Jora(Wordaround/Fix).
</autn:summary><autn:content><DOCUMENT>
<KMSEARCHCATEGORY>KM01CAT:KM03CAT:KM05CAT</KMSEARCHCATEGORY>
<KMSTATUS>external</KMSTATUS><DOCTYPE>errormsg</DOCTYPE><ID>KM0580</ID>
<SYSMODTIME_DATE>2015/06/22 14:47:00</SYSMODTIME_DATE><CATEGORY>Service
Manager&gt;Knowledge Management&gt;Document Maintenance and Lifecycle;
</CATEGORY><DRETITLE>test error message by Jora(Title)</DRETITLE>
</DOCUMENT></autn:content></autn:hit><autn:hit>
<autn:reference>scactivelink:%2F%2Fkmdocument:id%3D%26quot%3BKM0580%26quo
t%3B%26nbsp%3Band%26nbsp%3Bkbname%3D%26quot%3BKnowledge_Library%26quot%3B
</autn:reference><autn:id>1588</autn:id><autn:section>0</autn:section>
<autn:weight>57.09</autn:weight><autn:links>TEST</autn:links>
<autn:database>Knowledge_Library</autn:database><autn:title>test error
message by Jora(Title)</autn:title>
<autn:summary>&lt;_em_&gt;test&lt;/_em_&gt; error message by Jora(Title).
2015/06/22 14:07:46. falcon. external. errormsg.
&lt;_em_&gt;test&lt;/_em_&gt; error message by Jora(Error Message).
&lt;_em_&gt;test&lt;/_em_&gt; error message by Jora(cause).
&lt;_em_&gt;test&lt;/_em_&gt; error message by Jora(Wordaround/Fix).


</autn:summary><autn:content><DOCUMENT>
<KMSEARCHCATEGORY>KM01CAT:KM03CAT:KM05CAT</KMSEARCHCATEGORY>
<KMSTATUS>external</KMSTATUS><DOCTYPE>errormsg</DOCTYPE><ID>KM0580</ID>
<SYSMODTIME_DATE>2015/06/22 14:47:00</SYSMODTIME_DATE><CATEGORY>Service
Manager&gt;Knowledge Management&gt;Document Maintenance and Lifecycle;
</CATEGORY><DRETITLE>test error message by Jora(Title)</DRETITLE>
</DOCUMENT></autn:content></autn:hit><autn:engines>
<autn:used>0</autn:used><autn:unused>1</autn:unused></autn:engines>
<autn:warning>Engine 0: Engine 0: At least one of the fields in a
parameter (probably 'printfields') doesn't exist</autn:warning>
<autn:warning>Engine 0: Engine 0: One of the fields used in the field
text doesn't exist</autn:warning><autn:warning>Engine 0: Engine 0: The
languagetype of the text could not be determined. The default
languagetype was used.</autn:warning><autn:warning>Engine 0: Engine 1: At
least one of the fields in a parameter (probably 'printfields') doesn't
exist</autn:warning><autn:warning>Engine 0: Engine 1: One of the fields
used in the field text doesn't exist</autn:warning><autn:warning>Engine
0: Engine 1: The languagetype of the text could not be determined. The
default languagetype was used.</autn:warning></responsedata>
</autnresponse>"
}
}


1.3.6.1.4. Search

This search RESTful API is used to get the search results suggested by Smart Analytics.
Request:

  POST http://<SM Server
  Address>:13080/SM/9/rest/SmartAnalytics/1/action/search

An example of the request body:

  {
  SmartAnalytics:{
  query:'mobile',
  start:1,
  count:100,
  filters:'{"Knowledge_Library":{"status":
  ["external","internal"],"doctype":["howto"]},"Incident_Library":{}}',
  max_characters:500,
  startTag: '<_em_>',
  endTag: '</_em_>'
  }
  }

Response example:

            Note

           You can ignore the messages in the response as these messages are printed by the
           Restful framework.


{
"@count": 2,
"@start": "1",
"Messages": [],
"ResourceName": "SmartAnalytics",
"ReturnCode": 0,
"content": [
{"SmartAnalytics": {
"content": "ADJUST THE TIME AFTER WHICH <em>MOBILE<\/em> ENTERS THE SLEEP
MODE. howto. How to adjust the time after which <em>mobile<\/em> enters
the sleep mode in Android 4.2.2 Operating System.. To adjust the time
after which <em>mobile<\/em>",
"id": "KM0122",
"title": "ADJUST THE TIME AFTER WHICH MOBILE ENTERS THE SLEEP MODE"
}},
{"SmartAnalytics": {
"content": "Email receiving error when using <em>mobile<\/em> phone as
email client.. Email receiving error when using <em>mobile<\/em> phone as
email client.. report error about &#x27;connection fail&#x27; when
attempt to connect to mail server..",
"id": "IM10012",
"title": "Email receiving error when using mobile phone as email client."
}}
]
}


1.3.6.1.5. Smart classification (by specifying
IDOL adapters)

This section introduces another way to perform auto-classification by using two RESTful APIs.
Use the first API to query all the categorization configurations, and then use your desired
configuration (adapter id) to call the second API, which will return the category values.
Normally, you only need to use the first API once to get the configuration while you can use the
second API to do categorization jobs as many times as you need.

API-1: Get all the configurations/adapters definitions

Request:

  GET http://<SM Server Address>:13930/SM/9/rest/idoladapters?view=expand

Response example:


  {
  "@count": 2,
  "@start": 1,
  "@totalcount": 2,
  "Messages": [],
  "ResourceName": "idoladapter",
  "ReturnCode": 0,
  "content": [
  {"idoladapter": {
  "adapter.id": 5,
  "level1.field": "affected.item",
  "source": [
  "title",
  "description"
  ]
  }},
  {"idoladapter": {
  "adapter.id": 7,
  "level1.field": "category",
  "level2.field": "subcategory",
  "level3.field": "product.type",
  "source": [
  "title",
  "description"
  ]
  }}
  ]
  }

API-2: Get the categorization result based on adapter id

For example: id=137, company=abc, text="my laptop is broken", return top 2 suggestions.
Request:

  POST http://<SM Server Address>:13080/sm/9/rest/idoladapters/{adapter.id}

An example of the request body:


  {
      "idoladapter":{

  "source":["Critical CPU temp. BIOS error message", Maybe I work too hard,
  but the temperature of my computers CPU is critical according to the
  error message it displays in the message"],
  "company" :"abc",
  "top":2
  }
  }

Response example:

  {
  "Messages": [],
  "ReturnCode": 0,
  "idoladapter": {
  "level1.field": "category",
  "level2.field": "subcategory",
  "level3.field": "product.type",
  "suggest.candidates": [
  {
  "level1.value": "request for service",
  "level2.value": "app. infrastructure",
  "level3.value": "shared web hosting"
  },
  {
  "level1.value": "request for service",
  "level2.value": "infrastructure",
  "level3.value": "server"
  }
  ]
  }
  }


1.3.6.2. Auto-classification Javascript API

This Javascript API returns an array of arrays that contains the suggested categories.
Syntax
lib.acicategory.getCategoryByContent(file,adapterid,numresult,company)
Arguments

Name           Data type                Required  Description
file           Datum object             Yes
                                                  This argument
adapterid      Integer                  Yes       contains the object
                                                  that holds the input
numresult      Integer                  Yes       source data. For
                                                  example, an
company        String                   No        "incidents" file with
                                                  title and description.

                                                  This argument
                                                  contains the id you
                                                  use to call
                                                  createAndTrainingO
                                                  neCategory, or
                                                  adapter.id in
                                                  idoladapter.

                                                  This argument
                                                  controls the number
                                                  of suggested
                                                  categories to return.

                                                  The company that
                                                  the categories
                                                  belong to.

                                                  Note If you use an
                                                  adapterid with the
                                                  multi-company
                                                  setting configured,
                                                  you must specify
                                                  this parameter in
                                                  your request.

Return values


An array of arrays that contains the suggested categories. For example:
[["incident","hardware","hardware failure"],["incident","performance","performance
degradation"],["incident","failure","job failed"]]
Example
This example assumes that a category group for interactions is configured as the following:
id: 201
Source fields: title and description
Category fields: category, subcategory, product_type
Then, the Javascript API can be used as in the following example:

  var f = new SCFile("incidents");
  f.title = "my pc is broken";
  f.description=["Starting from yesterday, my pc can't be started. Both
  battery and power adapter looks good. The pc itself was very hot before
  it is broken."]
  f.category="incident";
  print(lib.JSON.json().stringify(lib.acicategory.getCategoryByContent(f,20
  1,3,"es")))

If the input parameter (file) includes value of level 1 and level 2 fields that are configured in the
idoladapter, this function will use their values as the parent schema to suggest child category to
get better accuracy. In this example, the level 1 field is specified as f.category="incident" , which
means the returned suggestion will all belong to the "incident" category.


1.3.6.3. APIs for Hot Topic Analytics indexing

If you want to tailor the index schedule of Hot Topic Analytics, you can use the following out-of-
box Javascript APIs to control when to run the index task:

     lib.aciindex.manualFullReindex

     You can use this API to manually run a full index for the specified file that's used by Hot
     Topic Analytics.

     lib.aciindex.manualIncrementalIndex

     You can use this API to manually run an incremental index for the specified file that's used
     by Hot Topic Analytics.

These two functions will run in synchronous mode. We recommend that you run these two
functions in the background schedule of Service Manager.

Syntax
lib.aciindex.manualFullReindex(file)
lib.aciindex.manualIncrementalIndex(file)
Arguments

Name  Data type                         Required  Description
file  String                            Yes
                                                  This argument is the
                                                  Service Manager
                                                  table (for example,
                                                  "probsummary")
                                                  that holds the input
                                                  source data.

                                                  Note Make sure that
                                                  the fields of this
                                                  "file" have been
                                                  added into the Filter
                                                  Fields section in the
                                                  Hot Topic Analytics
                                                  configuration
                                                  (System
                                                  Administration >
                                                  Ongoing
                                                  Maintenance >
                                                  Smart Analytics >
                                                  Hot Topic
                                                  Analytics).
````
