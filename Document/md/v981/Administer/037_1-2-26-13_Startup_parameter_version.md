---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.2.26.13 .. 1.2.26.27
printed_pages: 849-874
---

# 1.2.26.13 Startup parameter: version

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.26.13. Startup parameter: version

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

version

Description

Using this parameter at the operating system command prompt causes the Service
Manager server to display the Service Manager server (RTE) version, host server,
operating system, and network information. If you use a value of 2 (sm -version:2),
this command also reports the Service Manager database type and version,
application version, and a listing of all Java jars used by the RTE and their
corresponding versions, when available.

Valid if set from

Server's operating system command prompt

Requires restart of the Service Manager server?

No

Default value

0

Possible values

0, 1 - Returns server (RTE) version, host server, operating system, and network
information.

or

2 - Returns database type and version, applications, and jar version information in
addition to server (RTE) version, host server, operating system, and network
information.

Example usage

Command line: sm -version:2

Related topics


System parameters
Enter a parameter in the sm.ini file
System information parameters


1.2.26.14. Special parameters: encrypt

Parameter

encrypt

Description

This parameter encrypts a parameter value that can only be used in the command
line.

Valid if set from

Server's operating system command prompt

Requires restart of the Service Manager server?

No

Example usage

Command line: sm -encrypt:<parameter name>:<parameter value>
If the string containing the <parameter name>:<parameter value> includes spaces,
you must enclose the entire parameter name and value in quotation marks. For
example, sm -encrypt:"sqllogin:RDBMS user/my password".

Related topics

System information parameters


1.2.26.15. Special parameters:
mergeRoles

Parameter

mergeRoles

Description

When you add multiple security roles to an operator, if you change the original
sequence of the security roles, the restrictions set in configuration management area
for specific CI types doesn't work.
You can add the mergeRoles in the sm.ini file to avoid this issue.

Valid if set from

Initialization (sm.ini) file

Requires restart of the Service Manager server?

Yes

Default value

None

Possible values

None

Example usage

Initialization file: mergeRoles


1.2.26.16. Special parameters:
filterQueryOperators

Parameter

filterQueryOperators

Description

Enabling this parameter causes Service Manager to check the character of the fields.
If a field contains query operators (<, >, =, ~, #) as first character, an error message is
displayed. If you ignore the error and insist to save the record anyway, the system will
remove the query operator.

Note:

     When this parameter is enabled, in SOAP Request, if Request XML contains
     attribute with query operators (<, >, =, ~, #) as first character, these characters
     will be removed by the system. But in this case, SOAP Request will fail with
     validation failure.
     For the two-character query operators, for example, ">=", both ">" and "=" will
     be removed by the system if the the first two characters are ">=".
     Exception: When this parameter is enabled, if the first characters of the field is "
     <" and this field also include ">", the record can be saved successfully.
     This parameter doesn't work on JS and REST
     If an existing template include a field with query operators (<, >, =, ~, #) as first
     character, the character will not be removed by the system when you apply the
     template. But when you update a template, if the updated field contains query
     operators as first character, the character will be automatically removed by the
     system.

Valid if set from

Initialization (sm.ini) file

Requires restart of the Service Manager server?

No

Default value

0

Possible values


0 (Disable)

1 (Enable)

Example usage

Initialization file: filterQueryOperators:0

Related topics

System parameters
Enter a parameter in the sm.ini file
Debugging parameters


1.2.26.17. Special parameters: instantOn

Parameter

instantOn

Description

This parameter installs an AutoPass Temporary License.

Valid if set from

Server's operating system command prompt

Requires restart of the Service Manager server?

No

Default value

None

Possible values

None

Example usage

Command line: sm -instantOn

Related topics

System information parameters


1.2.26.18. Special parameters: language

Parameter

language

Description

This parameter creates locale for the system running Service Manager.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

English-US

Possible values

All Service Manager supported language codes.

Example usage

Command line: SM -language:LANGUAGE_LOCALE
Initialization file: language:LANGUAGE_LOCALE

Related topics

System information parameters


1.2.26.19. Special parameters:
maxreportpages

Parameter

maxreportpages

Description

This parameter defines the maximum number of pages that users can print from
server-side printers.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

1000

Possible values

Number of pages

Example usage

Command line: sm -httpPort:13080 -maxreportpages:1500
Initialization file: maxreportpages:1500

Related topics

System information parameters


1.2.26.20. Special parameters: msgid

Parameter

msgid

Description

This parameter forces the Service Manager server to display the message ID with all
messages.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

None

Possible values

None

Example usage

Command line: sm -httpPort:13080 -msgid
Initialization file: msgid

Related topics

System information parameters


1.2.26.21. Special parameters: msglog

Parameter

msglog

Description

This parameter defines the maximum number of messages the Service Manager
server displays in the log file. These include only messages designated for the
current operator. That is, the messages that are addressed to operator() or any field
whose value equals operator().

            Note

           If this parameter is not explicitly specified (either in sm.ini or in the
           server's operating system command prompt), only the messages that
           aren't sent to the clients are logged (for example, the messages
           generated by the background processes), and the default value (50000)
           is used. If you want the system to log the messages that are sent to the
           clients, you must explicitly specify this parameter.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

50000

Possible values

Number of log messages to display

Example usage

Command line: sm -httpPort:13080 -msglog:75000

Initialization file: msglog:75000

Related topics


System information parameters


1.2.26.22. Special parameters:
reportcache

Parameter

reportcache

Description

This parameter displays basic Service Manager CACHE statistics to the command
line, which you can capture in a text file using standard output (stdout) parameters
appropriate to your operating system.

Valid if set from

Server's operating system command prompt

Requires restart of the Service Manager server?

No

Default value

None

Possible values

None

Example usage

Command line: sm -reportcache

Related topics

System parameters
Enter a parameter in the sm.ini file
System information parameters


1.2.26.23. Special parameters:
reportdiagnostics

Parameter

reportdiagnostics

Description

This parameter displays the counter diagnostics report. This report contains the
following diagnostic information, which is also available from the server log (default:
sm.log):

     Web services transaction count / size (max size of a web service transaction /
     average size)
     Session login / logout count
     Database client transmission volume / size (network traffic)
     Heartbeat interval - request response count
     Event-in / event-out count
     Email-in / email-out count

            Note

           By default, the Diagnostic Service is disabled. Before running the
           reportdiagnostics command, administrators must specify
           debugdiagnostics:1 to enable the Diagnostic Service.

Valid if set from

Server's operating system command prompt

Requires restart of the Service Manager server?

No

Default value

None

Possible values

None

Example usage


Command line: sm -reportdiagnostics

Related topics

System parameters
Enter a parameter in sm.cfg or the server’s OS command prompt
View diagnostic counter information
System information parameters
Parameter: debugdiagnostics


1.2.26.24. Special parameters: reportipc

Parameter

reportipc

Description

This parameter displays a diagnostic report of semaphore use, which you can capture
in a text file using standard output (stdout) parameters appropriate to your operating
system. The semaphores roughly match the categories of shared memory. That is,
each shared memory category has a semaphore (some shared memory categories
share a semaphore so it's not quite one to one).

Valid if set from

Server's operating system command prompt

Requires restart of the Service Manager server?

No

Default value

None

Possible values

None

Example usage

Command line: sm -reportipc

Related topics

System parameters
Enter a parameter in the sm.ini file
System information parameters


1.2.26.25. Special parameters:
reportlanguages

Parameter

reportlanguages

Description

This parameter lists all possible language settings for Service Manager, as well as
information regarding which code pages those settings will really use.

Valid if set from

Server's operating system command prompt

Requires restart of the Service Manager server?

No

Default value

None

Possible values

None

Example usage

Command line: sm -reportlanguages
Sample output:

Language                                CP                            Service Manager 9.81

iso8859-1                               819   Description
                                              ISO 8859-1 (Western
8859-1                                  819   European Latin-1)
                                              ISO 8859-1 (Western
iso8859-2                               912   European Latin-1)
                                              ISO 8859-2 (Central
8859-2                                  912   European Latin-2)
                                              ISO 8859-2 (Central
iso8859-5                               915   European Latin-2)
                                              ISO 8859-5 (Cyrillic)
8859-5                                  915   ISO 8859-5 (Cyrillic)
                                              ISO 8859-7 (Greek)
iso8859-7                               813   ISO 8859-7 (Greek)
                                              ISO 8859-9 (Turkey
8859-7                                  813   Latin-5)
                                              ISO 8859-9 (Turkey
iso8859-9                               920   Latin-5)
                                              ISO 8859-11 (Thai)
8859-9                                  920   ISO 8859-11 (Thai)
                                              ISO 8859-15 (Euro,
iso8859-11                              8741  Finnish, Estonian Latin-
                                              9)
8859-11                                 8741  ISO 8859-15 (Euro,
                                              Finnish, Estonian Latin-
iso8859-15                              922   9)

8859-15                                 922                                               Page 137 of 180

This PDF was generated on May 23, 2026
Language                                CP                            Service Manager 9.81

koi8-r                                  921   Description
                                              Kod Obmena
koi8-u                                  1124  Informatsiey, Russian,
                                              Bulgarian
utf-8                                   884   Kod Obmena
                                              Informatsiey, Ukranian
utf8                                    884   UTF-8
                                              UTF-8
mswin874                                874   MS cp874 Thai
                                              MS cp932 Japanese
mswin932                                9932  (almost Shift-JIS)
                                              MS cp936 Simplified
mswin936                                936   Chinese
                                              MS cp949 Korean
mswin949                                949   MS cp950 Traditional
                                              Chinese
mswin950                                950   MS cp1250 Central
                                              European
mswin1250                               1250  MS cp1251 Russian,
                                              Bulgarian, Serbian
mswin1251                               1251  MS cp1252
                                              Latin/Western European
mswin1252                               1252  MS cp1253 modern
                                              Greek
mswin1253                               1253  MS cp1254 Turkish

mswin1254                               1254                                              Page 138 of 180

This PDF was generated on May 23, 2026
Language                                CP                            Service Manager 9.81

mswin1257                               1257  Description

sjis                                    932   MS cp1257 Estonian,
                                              Latvian, Lithuanian
american                                1252
                                              Shift-JIS
australian                              1252
                                              MS cp1252
basque                                  1252  Latin/Western European

bosnian                                 1250  MS cp1252
                                              Latin/Western European
bulgarian                               1251
                                              MS cp1252
canadian                                1252  Latin/Western European

catalan                                 1252  MS cp1250 Central
                                              European
chinese_simplified                      936
                                              MS cp1251 Russian,
chinese_traditional                     950   Bulgarian, Serbian

croatian                                1250  MS cp1252
                                              Latin/Western European
czech                                   1250
                                              MS cp1252
This PDF was generated on May 23, 2026        Latin/Western European

                                              MS cp936 Simplified
                                              Chinese

                                              MS cp950 Traditional
                                              Chinese

                                              MS cp1250 Central
                                              European

                                              MS cp1250 Central
                                              European

                                                                                          Page 139 of 180
Language                                CP                            Service Manager 9.81

danish                                  1252  Description

dutch                                   1252  MS cp1252
                                              Latin/Western European
english                                 1252
                                              MS cp1252
estonian                                1257  Latin/Western European

finnish                                 1252  MS cp1252
                                              Latin/Western European
french                                  1252
                                              MS cp1257 Estonian,
german                                  1252  Latvian, Lithuanian

greek                                   1253  MS cp1252
                                              Latin/Western European
hungarian                               1250
                                              MS cp1252
icelandic                               1252  Latin/Western European

italian                                 1252  MS cp1252
                                              Latin/Western European
japanese                                9932
                                              MS cp1253 modern
korean                                  949   Greek

This PDF was generated on May 23, 2026        MS cp1250 Central
                                              European

                                              MS cp1252
                                              Latin/Western European

                                              MS cp1252
                                              Latin/Western European

                                              MS cp932 Japanese
                                              (almost Shift-JIS)

                                              MS cp949 Korean

                                                                                          Page 140 of 180
Language                                CP                            Service Manager 9.81

latvian                                 1257  Description

lithuanian                              1257  MS cp1257 Estonian,
                                              Latvian, Lithuanian
new_zealand                             1252
                                              MS cp1257 Estonian,
new_zealand                             1252  Latvian, Lithuanian

norwegian                               1252  MS cp1252
                                              Latin/Western European
polish                                  1250
                                              MS cp1252
portuguese                              1252  Latin/Western European

russian                                 1251  MS cp1252
                                              Latin/Western European
slovak                                  1250
                                              MS cp1250 Central
slovenian                               1250  European

slovak                                  1250  MS cp1252
                                              Latin/Western European
spanish                                 1252
                                              MS cp1251 Russian,
swedish                                 1252  Bulgarian, Serbian

This PDF was generated on May 23, 2026        MS cp1250 Central
                                              European

                                              MS cp1250 Central
                                              European

                                              MS cp1250 Central
                                              European

                                              MS cp1252
                                              Latin/Western European

                                              MS cp1252
                                              Latin/Western European

                                                                                          Page 141 of 180
Language                                CP                            Service Manager 9.81

swiss                                   1252  Description
                                              MS cp1252
thai                                    874   Latin/Western European
                                              MS cp874 Thai
turkish                                 1254  MS cp1254 Turkish
                                              MS cp1251 Russian,
ukrainian                               1251  Bulgarian, Serbian

Related topics

System parameters
Enter a parameter in the sm.ini file
System information parameters


1.2.26.26. Special parameters: reportlic

Parameter

reportlic

Description

This parameter displays the Service Manager License Report, which you can capture
in a text file using standard output (stdout) parameters appropriate to your operating
system. The license report includes applications and platforms enabled, user seats,
and expiration dates.

Valid if set from

Server's operating system command prompt

Requires restart of the Service Manager server?

No

Default value

None

Possible values

None

Example usage

Command line: sm -reportlic

Related topics

System parameters
Enter a parameter in the sm.ini file
System information parameters


1.2.26.27. Special parameters: reportlocks

Parameter

reportlocks

Description

This parameter displays resource locks, which you can capture in a text file using
standard output (stdout) parameters appropriate to your operating system.

Valid if set from

Server's operating system command prompt

Requires restart of the Service Manager server?

No

Default value

None

Possible values

None

Example usage

Command line: sm -reportlocks

Related topics

System parameters
Enter a parameter in the sm.ini file
System information parameters
````
