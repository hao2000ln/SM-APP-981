---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.2.13.5 .. 1.2.13.18
printed_pages: 303-328
---

# 1.2.13.5 Web parameter: autoCloseMaskDelay

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.13.5. Web parameter:
autoCloseMaskDelay

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

autoCloseMaskDelay

Description

This parameter specifies the delay in seconds before which the mask is automatically
closed. This parameter value must be at least 60 seconds. If no value is specified, the
default value (180 seconds) is used.

Valid if set from

Web tier configuration file (web.xml and webtier.properties)

Requires restart of the web applications server?

Yes

Default value

180 seconds

Possible values

60-300 seconds

Example usage

  <context-param>
  <param-name>autoCloseMaskDelay</param-name>
  <param-value>180</param-value>
  </context-param>

Related topics

System parameters
Web tier parameters
Enter a parameter in the web client URL
Enter a parameter in the web.xml file


Client parameters for web clients
SSL parameters


1.2.13.6. Web parameter:
autoCompleteDelayTime

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

autoCompleteDelayTime

Description

This parameter defines the delay time in milliseconds to trigger the auto complete
feature after you stop typing characters in a Comfill field.

Valid if set from

Web tier configuration file (web.xml and webtier.properties)

Requires restart of the web application server?

Yes

Default value

200

Possible values

0 to unlimited

            Note

           If you specify an invalid value, the default value is used.

Example usage

  <context-param>
  <param-name>autoCompleteDelayTime</param-name>
  <param-value>200</param-value>
  </context-param>

Related topics


System parameters
Web tier parameters
Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Client parameters for web clients
Web parameter: comfillAutoComplete
Web parameter: autoCompleteListSize
Web parameter: autoCompleteMinChars


1.2.13.7. Web parameter:
autoCompleteListSize

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

autoCompleteListSize

Description

This parameter defines the maximum number of records that are fetched from the
server side at one time and returned to an auto complete selection list. If the total
number of matching records is larger than this specified list size, a More icon displays
at the bottom of the list. Clicking this icon will load more records to the list.
For example, if this parameter is set to 10 (default) and the total number of matching
records is 100, the auto complete selection list displays 10 matching records initially
with a More icon the bottom. If you click the More icon, another 10 records are loaded
to the list. Clicking More repeatedly will load the rest of the records.

Valid if set from

Web tier configuration file (web.xml and webtier.properties)

Requires restart of the web application server?

Yes

Default value

10

Possible values

1 to 100

            Note

           If you specify an invalid value, the default value is used.

Example usage


  <context-param>

  <param-name>autoCompleteListSize</param-name>

  <param-value>10</param-value>

  </context-param>

Related topics

System parameters
Web tier parameters
Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Client parameters for web clients
Web parameter: comfillAutoComplete
Web parameter: autoCompleteDelayTime
Web parameter: autoCompleteMinChars


1.2.13.8. Web parameter:
autoCompleteMinChars

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

autoCompleteMinChars

Description

This parameter defines the minimum number of characters you must type in a Comfill
widget to trigger the auto complete feature.

Valid if set from

Web tier configuration file (web.xml and webtier.properties)

Requires restart of the web application server?

Yes

Default value

3

Possible values

1 or greater

            Note

           If you specify a value of zero or a negative number, the default value is
           used.

Example usage

  <context-param>
      <param-name>autoCompleteMinChars</param-name>
      <param-value>3</param-value>

  </context-param>

Related topics


Client parameters for web clients
Web parameter: comfillAutoComplete
Web parameter: autoCompleteDelayTime
Web parameter: autoCompleteListSize


1.2.13.9. Web parameter:
combo.autoCompleteMode

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

combo.autoCompleteMode

Description

This parameter defines the Auto Complete mode for drop-down fields. In addition to
the combo widgets, this parameter is also applied to other combo-like widgets, such
as the Tags widgets and the smart search filter option fields.

     startsWith (default) - The drop-down list is filtered for items that begin with the
     search string.
     contains - The drop-down list is filtered for items that contain the search string.

                   Note

                For the select-only fields:
                In the startsWith mode, the field value is auto-selected with the
                first corresponding item.
                In the contains mode, the first item in the list will only be auto-
                selected if the item also begins with the search string.

Valid if set from

Web tier configuration file (webtier.properties)

Requires restart of the web application server?

Yes

Default value

startsWith

Possible values

     startsWith
     contains


Example usage

  combo.autoCompleteMode=contains


1.2.13.10. Web parameter:
autoCompleteSkipCachingChar

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

autoCompleteSkipCachingChar

Description

A Comfill field’s link record may define query expressions that split the Comfill field's
values to multiple levels, using a special character (such as a “/”) as the separator. In
this case, you must specify the separator in this parameter, so that the Auto Complete
feature returns the same query results as the Fill operation when the user input
contains this separator character.

The following table shows an example of such Comfill fields.

Comfill field  Field value              Level 0 value Level 1 value Separator
Location                                (Company) (Location)
Location
               advantage/Af advantage Africa  /

               rica

               advantage/As advantage Asia    /

               ia

In this example, the Link record of the Location field uses the following expressions,
where “/” is used as a separator:

$find.skip=true

if (index("/", location.full.name in $File)=0) then
($ln.query="location.full.name#\""+location.full.name in
$File+"\"";$ln.query=nullsub($ln.query, "true")+" and level=0")

if (index("/", location.full.name in $File)>0) then ($L.tempx=0;for $L.ix = 1 to
lng(location.full.name in $File) do (if (substr(location.full.name in $File, $L.ix, 1)="/")
then $L.tempx+=1);$ln.query="location.full.name#location.full.name in $File and
level="+$L.tempx)


            Note

           If the Link records of your Comfill fields use a different character as the
           separator, set this parameter to that character (for example, “|”). This is a
           global setting, which means all Comfill fields that have Auto Complete
           enabled have to use the same separator.
           If a Comfill field allows values that contain the specified character (for
           example, “E-mail / Webmail (Africa)”), but its Link record doesn't use the
           specified character in its query expressions, Auto Complete will retrieve
           the correct query results no matter whether the user input contains the
           specified character or not.

Valid if set from

Web tier configuration file (web.xml)

Requires restart of the web applications server?

Yes

Default value

/ (forward slash)
Possible values
Any ASCII character

Example usage

  <context-param>
      <param-name>autoCompleteSkipCachingChar</param-name>
      <param-value>/</param-value>

  </context-param>

Related topics

System parameters
Web tier parameters
Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Client parameters for web clients


1.2.13.11. Web parameter: autoSubmit

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

autoSubmit

Description

When this parameter is enabled, users can submit forms on the web client by
pressing the Enter key. Enabling this parameter from the web tier configuration file
forces all web clients to submit data with the Enter key. Enabling the this parameter
from the web browser URL only submit data with the Enter key on that particular web
client. Typically, you only need to disable this parameter on Japanese systems.

Valid if set from

Web browser URL
Web tier configuration file (web.xml and webtier.properties)

Requires restart of the web applications server?

Yes

Default value

true

Possible values

true (Enabled)
false (Disabled)

Example usage

  <init-param>
      <param-name>autoSubmit</param-name>
      <param-value>false</param-value>

  </init-param>

Related topics


System parameters
Web tier parameters
Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Client parameters for web clients


1.2.13.12. Web parameter: cacerts

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

cacerts

Description

This parameter defines the path to the cacerts file that's required for web clients to
make SSL connections to the web tier. You must also install a Certificate Authority
(CA) certificate file on the web tier server and enable the ssl web parameter to enable
SSL connections.

Valid if set from

Web tier configuration file (web.xml and webtier.properties)

Requires restart of the web applications server?

Yes

Default value

WEB-INF/cacerts

Possible values

Relative path and file name to the keystore containing the certificate authority's
certificate

Example usage

  <init-param>
      <param-name>cacerts</param-name>
      <param-value>WEB-INF/mycacerts</param-value>

  </init-param>

Related topics

System parameters
Web tier parameters
Enter a parameter in the web client URL


Enter a parameter in the web.xml file
Client parameters for web clients
SSL parameters


1.2.13.13. Web parameter: CACLogin

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

CACLogin

Description

Enabling this parameter causes the web client to present a Common Access Card
(CAC) certificate as authentication information and to use SSL connections to the web
tier.

Valid if set from

Web tier configuration file (web.xml)

Requires restart of the web applications server?

Yes

Default value

false

Possible values

true (Enable CAC authentication)
false (Disable CAC authentication)

Example usage

  <init-param>
         <param-name>CACLogin</param-name>
         <param-value>true</param-value>

  </init-param>

Related topics

Common Access Card (CAC) sign-on
Example: enabling CAC sign-on
Requirements for CAC sign-on


1.2.13.14. Web parameter: cms.truststore

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

cms.truststore

Description

The trust store of the UCMDB Gateway.

Valid if set from

Web tier configuration file (webtier.properties)

Requires restart of the web applications server?

Yes

Default value

Empty

Possible values

Relative or absolute path and file name of the UCMDB Gateway's trust store

Example usage

  cms.truststore=/WEB-INF/cmsrootca.p12

Related topics

Web parameter: cms.truststore.password


1.2.13.15. Web parameter:
cms.truststore.password

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

cms.truststore.password

Description

The password of the UCMDB Gateway's trust store.
The value of this parameter is automatically encrypted after the Service Manager
server starts. If you need to update the value later, remove the asterisk symbol (*)
before the parameter name.

Valid if set from

Web tier configuration file (webtier.properties)

Requires restart of the web applications server?

Yes

Default value

Empty

Possible values

Password of the UCMDB Gateway's trust store

Example usage

  cms.truststore.password=changeit

Related topics

Web parameter: cms.truststore


1.2.13.16. Web parameter:
comfillAutoComplete

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

comfillAutoComplete

Description

This parameter enables auto complete for the Comfill control. If you want to disable
auto complete globally in Service Manager, set the parameter to false.
To enable auto complete for a specific Comfill field, you must further enable the Auto
Complete property of this Comfill control in Forms Designer. If this property is
disabled, auto complete is disabled for this Comfill field regardless of the global
comfillAutoComplete setting.

Valid if set from

Web tier configuration file (web.xml and webtier.properties)

Requires restart of the web application server?

Yes

Default value

true

Possible values

true (Enabled)
false (Disabled)

Example usage

  <context-param>
      <param-name>comfillAutoComplete</param-name>
      <param-value>true</param-value>

  </context-param>


Related topics

Client parameters for web clients
Web parameter: autoCompleteDelayTime
Web parameter: autoCompleteListSize
Web parameter: autoCompleteMinChars


1.2.13.17. Web parameter: compactLayout

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

compactLayout

Description

This parameter enables the compact layout of the web client.

Service Manager 9.34 introduced the new user interface (UI) style, in which the size
of some UI elements is bigger than those of prior versions of Service Manager (for
example, the height of the text widget, and the vertical space between two adjacent
widgets). The out-of-box forms have been adjusted to match the new size. However,
there is a possibility that the new size may cause some display issues in your tailored
forms. For example, you may experience truncated text or overlapping UI elements.

You can use the compact layout of the web client to fix these display issues. When
you enable the compact layout, the web client uses the same sizes as that of Service
Manager 9.33, so the display issues caused by new sizes will disappear.

            Note

           We recommend that you use the compact layout of the web client in the
           following scenarios:

                Your forms have display issues caused by new sizes.
                You can't easily change the impacted forms to solve the display
                issues.

Valid if set from

Web tier configuration file (web.xml and webtier.properties)

Requires restart of the web applications server?

Yes

Default value

false

Possible values


true (Enabled)
false (Disabled)

Example usage

  <context-param>
      <param-name>compactLayout</param-name>
      <param-value>false</param-value>

  </context-param>

Related topics

System parameters
Web tier parameters
Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Client parameters for web clients


1.2.13.18. Web parameter: compress_soap

Web parameters change the behavior of the web clients that connect to the web tier.
For more information, see Web tier parameters.

Parameter

compress_soap

Description

Enabling this parameter causes the web tier to compress SOAP messages to web
clients.

Valid if set from

Web tier configuration file (web.xml and webtier.properties)

Requires restart of the web applications server?

Yes

Default value

true

Possible values

true (Enabled)
false (Disabled)

Example usage

  <init-param>
      <param-name>compress_soap</param-name>
      <param-value>true</param-value>

  </init-param>

Related topics

System parameters
Web tier parameters
Enter a parameter in the web client URL
Enter a parameter in the web.xml file
Client parameters for web clients
````
