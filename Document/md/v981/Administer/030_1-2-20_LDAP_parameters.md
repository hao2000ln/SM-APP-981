---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.2.20 .. 1.2.22
printed_pages: 689-715
---

# 1.2.20 LDAP parameters

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.20. LDAP parameters

These parameters determine how the server manages connections to an LDAP directory service.
You can set these parameters from the Service Manager server's operating system command
prompt or from the Service Manager initialization file (sm.ini).

Startup parameter                                                                                 Service Manager 9.81
Startup parameter: ldapauthenticateonly
Startup parameter: ldapbinddn            Brief decription
Startup parameter: ldapbindpass
Startup parameter: ldapdisable           Requires the Service Manager server to use
Startup parameter: ldapdisconnect        LDAP for login authentication only
Startup parameter: ldapmaxrecords
Startup parameter: ldapnosizelimitmsg    Defines the name that the Service Manager
                                         server uses to bind to the LDAP server
Startup parameter: ldapnostrictlogin
                                         Defines the password the Service Manager
Startup parameter: ldapquerymapping      server uses to bind to the LDAP server
Startup parameter: ldapsearchscope
                                         Disables the LDAP login authentication
Startup parameter: ldapserver            procedure

Startup parameter: ldapsslallownocert    Specifies when the Service Manager server
                                         disconnects from the LDAP server

                                         Specifies the maximum number of records to
                                         return from an LDAP query

                                         Disables the "Size limit exceeded" message
                                         from the LDAP server, so that this
                                         informational message doesn't display in each
                                         client and confuse users

                                         Allows users with valid operator records to log
                                         into to Service Manager without also having a
                                         valid LDAP record

                                         Defines LDAP attribute mapping when the
                                         system builds the LDAP query during login

                                         Specifies whether to search the LDAP base
                                         directory only or the LDAP base directory and
                                         subtrees

                                         Defines any back up LDAP servers that the
                                         Service Manager server can connect to if the
                                         primary LDAP server is unavailable

                                         When this parameter is enabled, the RTE
                                         doesn't check a CA's root certification. In this
                                         situation, you don't need to set a root
                                         certificate for the CA that'ssued the LDAP
                                         server’s certificate on the Service Manager
                                         server in order to enable LDAP over SSL in
                                         Service Manager

 Startup parameter                                                                               Service Manager 9.81
 Startup parameter: ldapstats
                                        Brief decription
 Startup parameter: ldaptimelimit
                                        Causes Service Manager to record LDAP
Related topics                          query statistics in the sm.log file.

System parameters                       Defines the maximum number of seconds that
Enter a parameter in the sm.ini file    Service Manager waits for a response to an
                                        LDAP query.


1.2.20.1. Startup parameter:
ldapauthenticateonly

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

ldapauthenticateonly

Description

This parameter requires the Service Manager server to use LDAP for login authentication only.

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

Command line: sm -httpPort:13080 -ldapserver1:ldapparent -ldapauthenticateonly
Initialization file: ldapauthenticateonly

Related topics

System parameters
Enter a parameter in the sm.ini file
LDAP parameters


1.2.20.2. Startup parameter: ldapbinddn

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

ldapbinddn

Description

This parameter defines the name the Service Manager server uses to bind to the LDAP server.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

None

Possible values

LDAP bind name

Example usage

Command line: sm -httpPort:13080 -ldapserver1:ldapparent -
ldapbinddn:uid=falcon,ou=People,dc=<company>,dc=com
Initialization file: ldapbinddn:uid=falcon,ou=People,dc=<company>,dc=com

Related topics

System parameters
Enter a parameter in the sm.ini file
LDAP parameters


1.2.20.3. Startup parameter: ldapbindpass

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

ldapbindpass

Description

This parameter defines the password the Service Manager server uses to bind to the LDAP server.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

None

Possible values

LDAP password

Example usage

Command line: sm -httpPort:13080 -ldapbindpass:ldappassword
Initialization file: ldapbindpass:ldappassword

Related topics

System parameters
Enter a parameter in the sm.ini file
LDAP parameters


1.2.20.4. Startup parameter: ldapdisable

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

ldapdisable

Description

This parameter disables the LDAP login authentication procedure. Although you don't have to
restart the server for this parameter to work, the server will write connection error messages to the
sm.log file until you have restarted the server.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

1

Possible values

0 (Disable)
1 (Enable)

Example usage

Command line: sm -httpPort:13080 -ldapserver1:ldapparent -ldapdisable:1
Initialization file: ldapdisable:1

Related topics

System parameters
Enter a parameter in the sm.ini file
LDAP parameters


1.2.20.5. Startup parameter: ldapdisconnect

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

ldapdisconnect

Description

This parameter specifies when the Service Manager server disconnects from the LDAP server.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

0

Possible values

0 (After client log out)
1 (After every transaction)

Example usage

Command line: sm -httpPort:13080 -ldapserver1:ldapparent -ldapdisconnect:1
Initialization file: ldapdisconnect:1

Related topics

System parameters
Enter a parameter in the sm.ini file
LDAP parameters


1.2.20.6. Startup parameter: ldapmaxrecords

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

ldapmaxrecords

Description

This parameter specifies the maximum number of records to return from an LDAP query. If the
LDAP server has a more restrictive query limit, then that limit determines the actual number of
records returned by a query.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

None

Possible values

Number of records

Example usage

Command line: sm -httpPort:13080 -ldapserver1:ldapparent -ldapmaxrecords:10
Initialization file: ldapmaxrecords:10

Related topics

System parameters
Enter a parameter in the sm.ini file
LDAP parameters


1.2.20.7. Startup parameter: ldapnosizelimitmsg

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

ldapnosizelimitmsg

Description

When limiting LDAP query with ldapmaxrecords:100 (for example), if LDAP query results are bigger
than 100 records, users receive the following message:
Message from LDAP server: Size limit exceeded.
This informational message may mislead users to think that something is not working correctly.
This parameter, when set to 1, allows you to disable this informational message so that it will not
display to and therefore not disturb end users.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

0

Possible values

0 (Enable)
1 (Disable)

Example usage

Command line: sm -httpPort:13080 -ldapserver1:ldapparent -ldapnosizelimitmsg:1
Initialization file: ldapnosizelimitmsg:1

Related topics

System parameters
Enter a parameter in the sm.ini file
LDAP parameters


1.2.20.8. Startup parameter: ldapnostrictlogin

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

ldapnostrictlogin

Description

Enabling this parameter allows users with valid operator records to log into Service Manager
without also having a valid LDAP record. By default, a user is required to have both a valid LDAP
record and a valid Service Manager operator record.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

0

Possible values

0 (Disable)
1 (Enable)

Example usage

Command line: sm -httpPort:13080 -ldapserver1:ldapparent -ldapnostrictlogin:1
Initialization file: ldapnostrictlogin:1

Related topics

System parameters
Enter a parameter in the sm.ini file
LDAP parameters


1.2.20.9. Startup parameter: ldapquerymapping

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

ldapquerymapping:<original_mapped_LDAP_attribute>=<target_mapped_LDAP_attribute>

Description

If you set this parameter, when the system builds the LDAP query during login, the target value
replaces the original value.

Valid if set from

Server's operating system command prompt

Initialization file ( sm.ini )

Requires restart of the Service Manager server?

Yes

Default value

None

Possible values

A string mapping the original attribute to the target attribute: <original_mapped_LDAP_attribute>=
<target_mapped_LDAP_attribute>

Example usage

The following is an example of replacing the user name with the email address. By setting the
parameter as follows, the system uses the user's email address and password for login, instead of
user name and password.

Command line: sm -httpPort:13080 -ldapquerymapping:sAMAccountName=userPrincipalName

Initialization file: ldapquerymapping:sAMAccountName=userPrincipalName

Related topics

System parameters
Enter a parameter in the sm.ini file
LDAP parameters


1.2.20.10. Startup parameter: ldapsearchscope

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

ldapsearchscope

Description

This parameter specifies whether to search the LDAP base directory only or the LDAP base
directory and subtrees.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

0

Possible values

0 (Search LDAP base directory and subtrees
1 (Search LDAP base directory only)

Example usage

Command line: sm -httpPort:13080 -ldapserver1:ldapparent -ldapsearchscope:1
Initialization file: ldapsearchscope:1

Related topics

System parameters
Enter a parameter in the sm.ini file
LDAP parameters


1.2.20.11. Startup parameter: ldapserver

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

ldapserver[Numerical ID]

Description

This parameter defines any backup LDAP servers that the Service Manager server can connect to
if the primary LDAP server is unavailable.

You can add this parameter multiple times by adding a number to the end of the parameter. The
Service Manager server attempts to connect to each LDAP server in turn. For example:

  ldapserver1:...
  ldapserver2:...
  ldapserver<n>:...

The parameter uses the following syntax and attributes to define the LDAP server settings.

<hostname>%<port>%<base directory>%<certificate file path>

Attribute                               Required?  Description
<hostname>                              Yes
<port>                                  No         The data source name (DSN)
<base directory>                        No         or IP address of the LDAP
<certificate file path>                 No         server.

                                                   The communications port on
                                                   which the LDAP server listens
                                                   to connection requests.

                                                   The base directory on the
                                                   server where you want LDAP
                                                   searches to start.

                                                   The path to the LDAP server
                                                   SSL certificate.

The following entries illustrate how to properly use the parameter attributes:


  ldapserver1:ldapparent%389%cn=users,dc=ldapparent,dc=microfocus,dc=com%c:\c
  ertificates\sslcert.pem
  ldapserver2:16.183.93.217%636%cn=users,dc=swsm,dc=ind,dc=lab

            Note

           If you configure LDAP servers over an SSL connection, you may wish to enable the
          ldapsslallownocert parameter. When this parameter is enabled, the Service Manager
           server doesn't check a CA's root certification.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

None

Possible values

hostname, port, base directory, certification file path
Append the numerical ID of LDAP server to the end of the parameter (values from 1-99 are
possible)

Example usage

Command line: sm -httpPort:13080 -ldapserver1:ldapparent
Initialization file: ldapserver1:ldapparent

Related topics

System parameters
Enter a parameter in the sm.ini file
LDAP parameters
Startup parameter: ldapsslallownocert


1.2.20.12. Startup parameter: ldapsslallownocert

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

ldapsslallownocert:<numerical ID>

Description

When this parameter is enabled, the Service Manager server doesn't check a CA's root
certification. In this situation, you don't need to set a root certificate for the CA that'ssued the LDAP
server’s certificate on the SM server in order to enable LDAP over SSL in SM.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

0

Possible values

0 (Service Manager checks the CA's root certificates)
1 (Service Manager doesn't check the CA's root certificates)

Example usage

Command line: sm -httpPort:13080 -ldapsslallownocert:1
Initialization file: ldapsslallownocert:1

Related topics

Enable an integration to LDAP
LDAP parameters


1.2.20.13. Startup parameter: ldapstats

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

ldapstats

Description

Enabling this parameter causes Service Manager to record LDAP query statistics in the sm.log
file.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

0

Possible values

0 (Disable)
1 (Enable)

Example usage

Command line: sm -httpPort:13080 -ldapserver1:ldapparent -ldapstats:1
Initialization file: ldapstats:1

Related topics

System parameters
LDAP parameters


1.2.20.14. Startup parameter: ldaptimelimit

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

ldaptimelimit

Description

This parameter defines the maximum number of seconds that Service Manager will wait for a
response to an LDAP query. If this parameter is not provided or the value is set at 0 (zero), then
there is no time limit.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

No

Default value

0

Possible values

Number of seconds

Example usage

Command line: sm -httpPort:13080 -ldapserver1:ldapparent -ldaptimelimit:60
Initialization file: ldaptimelimit:60

Related topics

LDAP parameters


1.2.21. Localization parameters

The following table lists the startup parameters you can set from the Service Manager server's OS
command prompt or from the Service Manager initialization file (sm.ini).

These parameters determine how the Service Manager server displays language and regional
settings.

Localization Parameter                  Brief description

Localization parameters: Language identifiers List of valid language and regional identifier

table                                   codes

Parameter: localizedecimalpoint         Enables the decimal symbol in numeric fields
                                        to be localized.

Related topics

System parameters
Enter a parameter in the sm.ini file


1.2.21.1. Language identifiers table

Language    Identifier                  Unix code page               Service Manager 9.81
Albanian    sq
American                                                     Windows code page
Australian  eu
Basque      bg                          819                  1252
Bulgarian                               819                  1252
Canadian    ca                          819                  1252
Catalan     zh                          915                  1251
Chinese                                 819                  1252
            hr                          819                  1252
Croatian    sr                          Chinese doesn't use  Chinese doesn't use
Cyrillic    cs                          code pages           code pages
Czech       da                          912                  1250
Danish      nl                          915                  1251
Dutch       en                          912                  1250
English     et                          819                  1252
Estonian    fi                          819                  1252
Finnish     fr                          819                  1252
French      de                          819                  1257
German      el                          819                  1252
Greek       hu                          819                  1252
Hungarian   is                          819                  1252
Icelandic   it                          813                  1253
Italian     ja                          912                  1250
Japanese                                819                  1252
                                        819                  1252
                                        EUC                  SJIS


Language    Identifier                  Unix code page  Windows code page
Korean      ko                          949             949
Latvian     lv                          912             1257
Lithuanian  lt                          912             1257
Norwegian   no                          819             1252
Polish      pl                          912             1250
Portuguese  pt                          819             1252
Romanian    ro
Russian     ru                          915             1251
Serbian     sh
Slovak      sk                          912             1250
Slovenian   sl
Spanish     es                          912             1250
Swedish     sv
Swiss                                   819             1252
Thai        th
Turkish     tr                          819             1252
Ukrainian   uk
utf8        utf8                        819             1252

                                        8741            874

                                        920             1254

                                        1251            1251

Note: Service Manager supports Japanese only if you install a multi-byte version.

Related topics

Localization parameters


1.2.21.2. Parameter: localizedecimalpoint

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

localizedecimalpoint

Description

This parameter enables users to use a pre-configured decimal symbol (for example, the comma)
when completing numeric fields. By default, this parameter is disabled (set to "0"), and users can
only enter a period as a decimal symbol. However, in Europe a comma is normally used. When this
parameter is enabled, users can enter numeric values using the Decimal Symbol (either a period or
comma) defined for one of the following currencies, listed from the highest to lowest priority:

     The currency defined in the Display Currency field in the user's operator record
     The currency defined in the Basis Currency field on the General tab of the System
     Information Record
     The US Dollar currency

            Tip

           To view the Decimal Symbol setting for a specific currency, click System
           Administration > Base System Configuration > Currencies, and then click Search.

            Note

                Whether this parameter is enabled or disabled, when a user views a cost value,
                Service Manager automatically converts the value according to the above
                currency settings. For example, when an operator whose currency is British
                Pounds is ordering an item from the Service Catalog, Service Manager displays
                the item's cost in British Pounds (for example, £ 50,00). However, there are
                exceptions (for example, the Total Cost value of an Order in Request Management
                always display in US Dollars.)
                When creating an unload file in .txt format, Service Manager always uses a period
                as the decimal symbol even if the original decimal symbol is a comma, and it can
                successfully process the unload when loading it back. If you need to edit the
                unload file before loading it back, always use a period as the decimal symbol;
                otherwise errors will occur when the unload is loaded back.
                When using the Export to Excel feature, each decimal symbol (for example, a
                comma) will be exported as is. For this reason, be sure not to select a comma as
                the delimiter when exporting data.


            Caution

           When the Service Manager server is running on a Linux host, set the locale to
           en_US.utf8. If you use other locale settings such as de_DE.utf8 or fr_FR.utf8, it's not
           possible to assign a number with decimal places to a variable in RAD expressions or
           JavaScript. If you try to assign something like "$number=1.456" in RAD Debugger, the
           result is 1.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

0 (Disabled)

Possible values

0: Disabled
1: Enabled

Related topics

System parameters
Enter a parameter in the sm.ini file
Localization parameters


1.2.22. Regional settings parameters

These parameters determine the regional settings that the server uses. You can set these
parameters from the Service Manager server's operating system command prompt or from the
Service Manager initialization file (sm.ini).

Startup parameter                       Brief description
Startup parameter: servertz
                                        Causes server processes to use the listed
                                        time zone

Related topics

System parameters
Enter a parameter in the sm.ini file


1.2.22.1. Startup parameter: servertz

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

servertz

Description

Defining this parameter causes server processes to use the listed time zone. The Service Manager
server only uses this time zone value if it can't find time zone information in the user's operator
record or in the System Wide Company Record. Typically, only external processes such as
SCAUTO, SCBUTIL, and JavaMail use this time zone entry.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

None

Possible values

Time zone name in the tzfile table

Example usage

Command line: sm -httpPort:13080 -servertz:US/Pacific

Initialization file: servertz:US/Pacific

Related topics

System parameters
Enter a parameter in the sm.ini file
Regional settings parameters
````
