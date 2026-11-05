---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.2.23 .. 1.2.23
printed_pages: 715-732
---

# 1.2.23 Security parameters

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.23. Security parameters

These parameters determine the access requirements for the server. You can set these parameters
from the Service Manager server's operating system command prompt or from the Service
Manager initialization file (sm.ini).

Security parameter                       Brief description
Startup parameter: changeencrkey
Startup parameter: denyattachwithoutext  Changes the database encryption key by
                                         updating all the encrypted fields
Startup parameter: encryptionkey
Parameter: fipsmode                      Enables the Service Manager server to check
Startup parameter: ntlogin               contents of attachments without file
Startup parameter: ntsecuritygroup       extensions submitted through web services.
Parameter: querysecurity
                                         Defines the encryption key that's used to
Startup parameter: restaccessviabrowser  encrypt fields in the database

Startup parameter: soap12binding         Determines if the Service Manager server
Startup parameters: JavaScript access    runs in FIPS 140-2 compliant mode
Startup parameter: upgradeencralg
                                         Defines the account and password of the
                                         Windows Service you want to run Service
                                         Manager server.

                                         Restricts access to the Service Manager
                                         application on the server

                                         Determines if the Service Manager server
                                         requires a security hash with web tier URL
                                         queries

                                         Determines if RESTful access to the Service
                                         Manager server through a web browser is
                                         allowed.

                                         Enables or disables SOAP 1.2 binding on the
                                         server

                                         Specifies access restrictions from JavaScript
                                         code for file access and command execution

                                         Upgrades the database encryption algorithm
                                         from DES to AES by updating all encrypted
                                         fields with a new 256-bit key

Related topics


System parameters
Enter a parameter in the sm.ini file


1.2.23.1. Startup parameter: changeencrkey

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

changeencrkey

Description

This parameter changes the database encryption key by updating all encrypted fields. The value of
this parameter must be either 8 characters long in non-FIPS mode or 32 characters (256 bits) long
in FIPS mode, and consist of alphanumeric characters.

Valid if set from

Server's operating system command prompt

Requires restart of the Service Manager server?

No

Default value

xxxxxxxx in non-FIPS mode
xxxxxxxxxxxxxxxxxxxxxxxx in FIPS mode

Possible values

8 character alphanumeric string in non-FIPS mode
32 character alphanumeric string in FIPS mode

Example usage

Command line: sm -httpPort:13080 -changeencrkey:1234567890abcdefghijklmnopqrstuv

Related topics

FIPS mode
Security parameters


1.2.23.2. Startup parameter:
denyattachwithoutext

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

denyattachwithoutext

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Description

By default, this parameter is set to 0. Attachments without file extensions submitted through web
services to Service Manager are checked by Tika against the Service Manager allowlist saved in a
DB table in DBMS. If matching content types are found, the attachments can be submitted
successfully. If not, the attachments are denied.
When this parameter is set to 1, attachments without file extensions submitted through web
services to Service Manager are denied immediatedly by the Service Manager server without
checking the content.

Requires restart of the Service Manager server?

No

            Note

           For the configuration to take effect, you need to log off and then log back on to the
           clients where attachments are submitted through web services.

Default value

0

Possible values

0, 1

Example usage

Command line: sm -httpPort:13080 -denyattachwithoutext:0
Initialization file: denyattachwithoutext:0

Related topics

Attachments


Support for allowing attachments with certain file extensions
Enter a parameter in the sm.ini file
Security parameters


1.2.23.3. Startup parameter: encryptionkey

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

encryptionkey

Description

This parameter defines the encryption key for encrypting fields in the database. The value of this
parameter must be either 8 characters (64 bits) long in non-FIPS mode or 32 characters (256 bits)
long in FIPS mode, and consist of alphanumeric characters.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

xxxxxxxx in non-FIPS mode
xxxxxxxxxxxxxxxxxxxxxxxx in FIPS mode

Possible values

32 character alphanumeric string

Example usage

Command line: sm -httpPort:13080 -encryptionkey:1234567890abcdefghijklmnopqrstuv
Initialization file: encryptionkey:1234567890abcdefghijklmnopqrstuv

Related topics

FIPS mode
Security parameters


1.2.23.4. Startup parameter:
jsaccesscheckforadmin

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

jsaccesscheckforadmin

Description

The parameter determines whether the system administrator (sysadmin) users can
execute OS commands through JavaScript. When setting this parameter to 1, the system
administrator users will also follow the access restrictions specified by jsaccesscmdregex .
See Startup parameters: JavaScript access.

Valid if set from

Initialization file ( sm.ini )

Requires restart of the Service Manager server?

Yes

Default value

0

Possible values

0 (System administrator users are allowed unrestricted access to the file system and command
line)

1 (System administrator users will follow the access restrictions specified by jsaccesscmdregex )

Example usage

Initialization file: jsaccesscheckforadmin :1


1.2.23.5. Startup parameters: JavaScript access

Startup parameters change the behavior of the server.

Parameter

jsaccessfilereadregex

jsaccessfilewriteregex

jsaccesscmdregex

Description

These parameters specify access restrictions from JavaScript code for file access and command
execution. This is required so that users with Process Designer tailoring rights aren't able to use the
available Service Manager JavaScript APIs to directly access the underlying host file system and
command line. These restrictions are described below:

     System administrator (sysadmin) users are allowed unrestricted access to the file system and
     command line. Note that if the jsaccesscheckforadmin parameter is set to 1, the the system
     administrator users will also follow the access restrictions specified by the
      jsaccesscmdregex parameter below.
     Non-sysadmin users are allowed unrestricted access as well by default (none of these
     configuration parameters is present); if any of these parameters is present, access is
     restricted as follows:

            jsaccessfilereadregex:<regex> : Files read using the readFile() and uncompressFile()
           (compressed file only) JavaScript functions must have an absolute path name that
           matches the regular expression <regex>.
            jsaccessfilewriteregex:<regex> : Files written using the writeFile(), deleteFile(),
           makeDir(), uncompressFile() (output dir only), and writeAttachmentToFile() JavaScript
           functions must have an absolute path name that matches the regular expression
           <regex>.
            jsaccesscmdregex:<regex> : Operating system commands executed by using the
           sysExec() JavaScript function (including parameters) must match the regular expression
           <regex>.

Regular expressions must use proper syntax for Java-style regex (similar to Perl-style) (for
example, '.' means any character and backslashes need to be doubled). File path names in
jsaccessfilereadregex and jsaccessfilewriteregex must be absolute and use proper delimiters ('/'
for UNIX, and '\' for Windows). They are case-sensitive for UNIX and case-insensitive for Windows.

File path names used as parameters to JavaScript functions can still be any legal OS-specific file
path names. Absolute and relative path names are allowed as well as the usage of '.' and '..'. On
Windows, delimiters can be either '/' or '\', while UNIX only allows '/'. However, path names from
JavaScript commands are normalized first (relative paths are made absolute, the '.' and '..' are
eliminated, and on Windows '/'s are transformed into '\'s) before they are pattern matched against
their corresponding regular expression.


Command line strings in the sysExec() JavaScript function are taken as is and compared to the
jsaccesscmdregex regular expression. The following table lists the strings that aren't allowed in
the command line run by sysExec(). If administrators need to use any of these strings in the
command line, they can put the real command line in a .sh or .bat file, and then run the .sh/.bat file
in sysExec() instead. When any JavaScript attempts to run unauthorized commands or use these
forbidden strings in the command line run by sysExec(), audit warning messages will be logged in
the server log (sm.log). The messages include the commands to be run, and the user's login name.

Forbidden string in command line        Comment
||
|                                       Logical OR in shell.
;
``                                      The Pipe symbol.

&&                                      Shell statement ending; the shell interpreter
&                                       will run the command that follows.
>>
>                                       A pair of backquotes. The shell interpreter will
                                        run the command between `` first, and then
                                        insert its STDOUT output to the command line
                                        of the outside command.

                                        Logical AND in shell

                                        Run in the background; the shell interpreter
                                        will run the command that follows.

                                        File appending; it will write to file.

                                        File redirection; it will write to file.

Valid if set from

Server's operating system command promt
Initialization file (sm.ini)

Requires restart of server?

Yes

Default value

None (Unrestricted file access and command execution)

Possible values

Regular expressions

Example usage


      jsaccessfilereadregex:C:\\Users\\joe\\Documents\\.+|C:\\SM-Install\\server-dist\\RUN\\
     (\w)+\.js

     Read access is limited to any files under the C:\Users\joe\Documents directory and only for .js
     files under the C:\SM-Install\server-dist\RUN directory.

      jsaccessfilewriteregex:^$

     Only matches the empty string. This is used to deny all write access to the file system.

      jsaccesscmdregex:dir .*|copy "C:\\Users\\spinu\\Documents\\SM\\Special Dir\\from\\(\w)+"
     "C:\\Users\\spinu\\Documents\\SM\\Special Dir\\to\\(\w)+"

     Command execution is limited to the dir command with any parameters or the copy
     command, but only from a file in the C:\Users\spinu\Documents\SM\Special Dir\from
     directory to a file in the C:\Users\spinu\Documents\SM\Special Dir\ directory.

Related topics

System parameters
Enter a parameter in the sm.ini file
Security parameters


1.2.23.6. Startup parameter: mbeanclientlogin

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

mbeanclientlogin

Description

This parameter defines the account and password for the MBean client.
You must use a slash character to separate the user name and password.

Valid if set from

Initialization file (sm.ini)

Requires restart?

This parameter requires a restart of the Service Manager process.

Default value

None

Possible values

The MBean user account and password

Example usage

mbeanclientlogin:User/Password


1.2.23.7. Startup parameter: ntlogin

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

ntlogin

Description

This parameter defines the account and password of the Windows Service you want to run Service
Manager server.
You must use a slash character to separate the user name and password. If you omit this
parameter, Service Manager will use the Local System as its account by default.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart?

This parameter requires a restart of the Service Manager process.

Default value

None

Possible values

The Windows user account and password

Example usage

smservice -install -ntlogin:User/Password

Related topics

System parameters
Enter a parameter in the sm.ini file
Security parameters


1.2.23.8. Startup parameter: ntsecuritygroup

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

ntsecuritygroup

Description

Defining this parameter restricts access to the Service Manager application on the server. Only
users who are members of the Windows user group defined by this parameter can start or stop the
Service Manager application.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

None

Possible values

Name of the Windows user group

Example usage

Command line: sm -httpPort:13080 -ntsecuritygroup:SM Users
Initialization file: ntsecuritygroup:SM Users

Related topics

System parameters
Enter a parameter in the sm.ini file
Security parameters


1.2.23.9. Parameter: querysecurity

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

querysecurity

Description

The parameter determines whether the Service Manager server generates a query hash when
calling the makeSCWebURL server function. If this parameter is set to 1, a query hash value is
appended to URLs generated by makeSCWebURL.
Note This parameter is tied to the querySecurity (spelled with an uppercase "S") web parameter.
To disable the security hash feature, you must disable both the web.xml and sm.ini versions of this
parameter.

Valid if set from

Server's operating system command prompt

Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

1

Possible values

0 (Disable)

1 (Enable)

Example usage

Command line: sm -httpPort:13080 -querysecurity:0
Initialization file: querysecurity:0

Related topics

Generating Web tier URL queries
SSL parameters


1.2.23.10. Startup parameter:
restaccessviabrowser

Startup parameters change the behavior of the Service Manager server. You can always set a
startup parameter from the server's operating system command prompt.

Parameter

restaccessviabrowser

Description

This parameter determines if RESTful access to the Service Manager server through a web
browser is allowed. You can specify 0 or 1 for this parameter:

     0: Access to Service Manager through REST from a web browser is not allowed
     1: Access to Service Manager through REST from a web browser is allowed

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of the Service Manager server?

Yes

Default value

0

Possible values

0, 1

Example usage

Command line: sm -httpPort:13080 -restaccessviabrowser:1
Initialization file: restaccessviabrowser:1

Related topics

Security parameters


1.2.23.11. Startup parameter:
soap12binding

Startup parameters change the behavior of the server.

Parameter

soap12binding

Description

By default, Service Manager generates WSDLs that conform to soap 1.1 binding.
However, some Web Services clients accept both soap 1.1 and soap 1.2. In such
cases, you can enable soap12binding by providing the parameter soap12binding:1.

Valid if set from

Server's operating system command prompt
Initialization file (sm.ini)

Requires restart of server?

Existing connections will honor the current value. New connections will honor the new
value.

Default value

0 (Disabled)

Possible values

0 (Disabled)
1 (Enabled)

Example usage

Command line: sm -httpPort:13080 –debugnode:1 –soap12binding:0
Initialization file: soap12binding:0

Related topics

Security parameters


1.2.23.12. Startup parameter:
upgradeencralg

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

upgradeencralg

Description

This parameter upgrades the database encryption algorithm from DES to AES by
updating all encrypted fields with a new 256-bit key. The value of this parameter must
be either empty or a 32 characters long alphanumeric string. The specified value will
be used as the encryption key of AES, and a default 256-bit key will be used if you
specify an empty value.

Valid if set from

Server's operating system command prompt

Requires restart of the Service Manager server?

No

Default value

xxxxxxxxxxxxxxxxxxxxxxxx

Possible values

32 character alphanumeric string

Example usage

Command line: sm -upgradeencralg:1234567890abcdefghijklmnopqrstuv

Related topics

Security parameters
````
