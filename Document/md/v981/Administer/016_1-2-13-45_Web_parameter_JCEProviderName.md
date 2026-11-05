---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.2.13.45 .. 1.2.13.57
printed_pages: 380-406
---

# 1.2.13.45 Web parameter: JCEProviderName

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.13.45. Web parameter:
JCEProviderName

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

JCEProviderName

Description

This parameter specifies the name of a third-party Java Cryptography Extension
(JCE) provider that you plug in when the web tier is running in non-FIPS mode.

            Note

           In FIPS mode, this parameter is ignored.

Valid if set from

Web tier configuration file (web.xml and webtier.properties)

Requires restart of the web applications server?

Yes

Default value

None

Possible values

JCE provider names

Example usage

  <init-param>
      <param-name>JCEProviderName</param-name>
      <param-value>JsafeJCE</param-value>

  </init-param>

Related topics


System parameters
Web tier parameters
Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Client parameters for web clients


1.2.13.46. Web parameter: jsDebug

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

jsDebug

Description

This parameter enables the web client to load unminified JavaScript files. However,
when this parameter is enabled, the web client also displays to end users an error
message that includes full stack trace. For this reason, don't enable this parameter in
production environments to avoid disclosure of sensitive information.

Valid if set from

Web tier configuration file (web.xml and webtier.properties)

Requires restart of the web applications server?

Yes

Default value

false

Possible values

true, false

Example usage

  <init-param>
      <param-name>jsDebug</param-name>
      <param-value>false</param-value>

  </init-param>

Related topics

System parameters
Web tier parameters
Enter a parameter in the web client URL


Enter a parameter in the web.xml file
Client parameters for web clients


1.2.13.47. Web parameter:
labelbgunderline

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

labelbgunderline

Description

This parameter defines the label background display if the user has selected a color
other than white as the Background Color property for a label in a form, but has left
the Background Style property blank. If set to true, the empty Background Style
property defaults to underline. If set to false, the empty Background Style property
defaults to a solid background.

Valid if set from

Web tier configuration file (web.xml and webtier.properties)

Requires restart of the web applications server?

Yes

Default value

true

Possible values

true (default to underline)
false (default to solid background)

Example usage

  <init-param>
      <param-name>labelbgunderline</param-name>
      <param-value>true</param-value>

  </init-param>

Related topics


System parameters
Web tier parameters
Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Client parameters for web clients


1.2.13.48. Web parameter:
lockWaitTimeout

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

lockWaitTimeout

Description

The lockWaitTimeout parameter prevents a web tier application server thread from
waiting infinitely to acquire a lock. After the specified time is reached, the thread
ceases trying to acquire a lock, and the user receives the following warning message:
The session is busy, please try again later.

Valid if set from

Web tier configuration file (web.xml and webtier.properties)

Requires restart of the web applications server?

Yes

Default value

15 seconds

Possible values

1-300 seconds (A value of less than or equal to 0 will indicate the maximum value 300
is used)

Example usage

  <init-param>
      <param-name>lockWaitTimeout</param-name>
      <param-value>15</param-value>

  </init-param>

Related topics


System parameters
Web tier parameters
Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Client parameters for web clients
SSL parameters


1.2.13.49. Web parameter:
log4jConfiguration

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

log4jConfiguration

Description

This parameter defines the path to the web tier's logging properties file, which is a
standard log4j2 logging properties file. You can use the logging properties file to
define the default logging level, the logging level for specific web tier components,
the path to the log file, and to specify what output formats and actions logging should
take (such as, send an e-mail over SMTP, send the log file over FTP, or print the log
file to the event viewer). See the log4j web site for more information on configuring
this file.

Valid if set from

Web tier configuration file (web.xml)

Note: This parameter is not included in web.xml by default.

Requires restart of the web applications server?

Yes

Default value

/WEB-INF/log4j2.properties

Possible values

Absolute path to logging properties file

Relative path to logging properties file

URL to logging properties file

Example usage


  <context-param>
  <param-name>log4jConfiguration</param-name>
  <param-value>/WEB-INF/log4j2.properties</param-value>
  </context-param>

Related topics

System parameters
Web tier parameters
Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Log4j Web site
Client parameters for web clients


1.2.13.50. Web parameter:
maskMessageDelay

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

maskMessageDelay

Description

The maskMessageDelay parameter specifies the number of seconds before the mask
message is displayed after the mask is shown. The minimum value is 1 second and
the maximum is 30 seconds. A default value of 5 seconds will be used if an invalid
value is specified.

Valid if set from

Web tier configuration file (web.xml and webtier.properties)

Requires restart of the web applications server?

Yes

Default value

5 (seconds)

Possible values

Any integer value from 1 second to 30 seconds. Any invalid value will use the default
value of 5 seconds.

Example usage

  <context-param>
      <param-name>maskMessageDelay</param-name>
      <param-value>5</param-value> \

  </context-param>

Related topics

System parameters
Web tier parameters


Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Client parameters for web clients
Web parameter: recordListArrayDisplayStyle


1.2.13.51. Web parameter:
maxGroupCacheSize

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

maxGroupCacheSize

Description

This parameter defines the maximum number of records that can be cached in the
user's web browser when the user navigates through the groups in a record list. The
default value is 300.

Valid if set from

Web tier configuration file (web.xml)

Requires restart of the web applications server?

Yes

Default value

300

Possible values

No less than 300

Example usage

  <context-param>
      <param-name>maxGroupCacheSize</param-name>
      <param-value>1000</param-value>

  </context-param>

Related topics

System parameters
Web tier parameters
Enter a parameter in the web client URL


Enter a parameter in the web.xml file
Client parameters for web clients


1.2.13.52. Web parameter:
maxattachuploadsize

Web parameters change the behavior of web clients that connect to the web tier. You
can set some of these parameters from the web client login URL, some from the web
tier configuration file (web.xml), and some from both.

Parameter

maxattachuploadsize

Description

This parameter specifies the maximum size limit for individual attachments in a
record.

Valid if set from

Web tier configuration file (web.xml and webtier.properties)

Requires restart of the web applications server?

Yes

Default value

10 MB

Possible values

Unlimited

Example usage

  <context-param>
      <param-name>MaxAttachUploadSize</param-name>
      <param-value>10240</param-value>

  </context-param>

Related topics

System parameters
Web tier parameters
Setting file attachment limits
Enter a parameter in the web.xml file


Enter a parameter in the webtier.properties files
Web parameter: maxtotalattachuploadsize


1.2.13.53. Web parameter:
maxtotalattachuploadsize

Web parameters change the behavior of web clients that connect to the web tier. You
can set some of these parameters from the web client login URL, some from the Web
tier configuration file (web.xml), and some from both.

Parameter

maxtotalattachuploadsize

Description

This parameter specifies the maximum total size of all the attachments in a record.

Valid if set from

Web tier configuration file (web.xml and webtier.properties)

Requires restart of the web applications server?

Yes

Default value

50 MB

Possible values

Unlimited

Example usage

  context-param>
      <param-name>MaxTotalAttachUploadSize</param-name>
      <param-value>51200</param-value>

  </context-param>

Related topics

System parameters
Web tier parameters
Setting file attachment limits
Enter a parameter in the web.xml file


Enter a parameter in the webtier.properties files
Web parameter: maxattachuploadsize


1.2.13.54. Web parameter:
maxMessageNumber

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

maxMessageNumber

Description

This parameter defines the maximum number of messages displayed in Messages
And Alerts.

Valid if set from

webtier.properties

Requires restart of the Service Manager server?

Yes

Default value

50

Possible values

Any positive integer between 1 and 500

Example usage

  maxMessageNumber=50

Related topics

System parameters
Web tier parameters
Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Client parameters for web clients


1.2.13.55. Web parameter:
maxRequestPerSecond

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

maxRequestPerSecond

Description

This parameter defines the maximum number of requests that's allowed per second
for one user session. The default value for this parameter is 50. To allow unlimited
requests, set the value less than or equal to zero.

Valid if set from

Web tier configuration file (web.xml and webtier.properties)

Requires restart of the web applications server?

Yes

Default value

50

Possible values

Unlimited

            Note

           The parameter value easily reaches the maximum value if you use too
           many DVD select statements in a form. In this case, you must adjust the
           parameter value accordingly.
           The system may have performance issue that leads to significant increase
           of form loading time if there are too many DVD select statements added to
           a form.

Example usage


  <context-param>

      <param-name>maxRequestPerSecond</param-name>

      <param-value>-1</param-value>

  </context-param>

Related topics

System parameters
Web tier parameters
Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Client parameters for web clients
Web parameter: recordListArrayDisplayStyle


1.2.13.56. Web parameter: message
display properties

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

messageBarError

messageBarInfo

messageBarWarning

Description

These parameters determine how different types of message are displayed. The
parameter value consists of three parts: the first part defines if this type of message
is displayed in the message bar, the second part defines if the message automatically
disappears, and the third part defines the duration in seconds before the message
disappears.

The latter part of the parameter value is dependent on the previous part. For example,
if the first part of value is set as false, which means that this type of message is not
displayed on the top of the detail window, then the following two parts of parameter
values are meaningless and thus ignored. If the second part is set as false, which
means that this type of message doesn't automatically disappear, then the last value
defining the duration before the message disappears is ignored.

Valid if set from

Web tier configuration file (web.xml and webtier.properties)

Requires restart of the web applications server?

Yes

Default value

messageBarError                         true:false
messageBarInfo                          true:true:4
messageBarWarning                       true:true:6


Possible values

true (displayed)/false (not displayed): true (disappear automatically)/false (not
disappear): 0 to unlimited

            Note

           If you specify an invalid number for the third part of the value, a default
           value of 6 seconds is used.

Example usage

          <context-param>
          <param-name>messageBarError</param-name>
          <param-value>true:false</param-value>
          </context-param>

     The default value means that the error type of message is displayed on the top
     of the detail window, and doesn't automatically disappear.

                   Note

                If the user changes the second value to true to make the error
                message bar automatically disappear, then the user has to set the
                last value to decide the duration before it disappears.

          <context-param>
          <param-name>messageBarInfo</param-name>
          <param-value>true:true:4</param-value>
          </context-param>

     The default value means that the information type of message is displayed on
     the top of the detail window, and it automatically disappears after four seconds.

          <context-param>
          <param-name>messageBarWarning</param-name>
          <param-value>true:true:6</param-value>
          </context-param>


     The default value means that the warning type of message is displayed on the
     top of the detail window, and it automatically disappears after six seconds.

Related topics

System parameters
Web tier parameters
Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Enter a parameter in the web.xml file
Client parameters for web clients


1.2.13.57. Web parameter:
openTabsSoftLimit

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

openTabsSoftLimit

Description

This parameter defines the number of tabs users can open in their browsers before a
warning message displays to let them know of the possible risks and advise them to
close some tabs. The message goes away when the number of open tabs is at or
below the limit. This parameter is not a hard limit; it doesn't prevent the user from
opening more tabs than it is set for. Also, it's not related to the RAD thread number
delimiter defined on the Service Manager server (appthreadspersession).

Valid if set from

Web tier configuration file (web.xml and webtier.properties)

Requires restart of the web applications server?

Yes

Default value

15

Possible values

Number of tabs

Example usage

  <init-param>
      <param-name>openTabsSoftLimit</param-name>
      <param-value>10</param-value>

  </init-param>

Related topics


System parameters
Web tier parameters
Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Client parameters for web clients
````
