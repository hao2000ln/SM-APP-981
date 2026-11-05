---
source: Document/pdf/v981/Administer.pdf
version: 9.81
sections: 1.2.26.28 .. 1.2.26.36
printed_pages: 874-885
---

# 1.2.26.28 Special parameters: reportsem

> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.

````text
1.2.26.28. Special parameters: reportsem

Parameter

reportsem

Description

This parameter displays the semaphore report, which you can capture in a text file
using standard output (stdout) parameters appropriate to your operating system. The
semaphores roughly match the categories of shared memory. That is, each shared
memory category has a semaphore (some shared memory categories share a
semaphore so it's not quite one to one).

Valid if set from

Server's operating system command prompt

Requires restart of the Service Manager server?

No

Default value

None

Possible values

None

Example usage

Command line: sm -reportsem

Related topics

System parameters
Enter a parameter in the sm.ini file
System information parameters


1.2.26.29. Special parameters: reportshm

Parameter

reportshm

Description

This parameter displays the shared memory report, which you can capture in a text
file using standard output (stdout) parameters appropriate to your operating system.

Valid if set from

Server's operating system command prompt

Requires restart of the Service Manager server?

No

Default value

None

Possible values

None

Example usage

Command line: sm -reportshm

Related topics

System parameters
Enter a parameter in the sm.ini file
System information parameters


1.2.26.30. Special parameters:
reportstatus

Parameter

reportstatus

Description

This parameter displays a shared memory, semaphore and process report, which you
can capture in a text file using standard output (stdout) parameters appropriate to
your operating system. The semaphores roughly match the categories of shared
memory. That is, each shared memory category has a semaphore (some shared
memory categories share a semaphore so it's not quite one to one).

This parameter includes a sleep attribute; for example, sm -reportstatus -sleep:nn
executes the reportstatus report every nn seconds.

Valid if set from

Server's operating system command prompt

Requires restart of the Service Manager server?

No

Default value

None

Possible values

None

Example usage

Command line: sm -reportstatus -sleep:30

This will execute the reportstatus report every thirty seconds.

Related topics

System parameters
Enter a parameter in the sm.ini file
System information parameters


1.2.26.31. Special parameters: reporttolog

Parameter

reporttolog

Description

This parameter allows the reportstatus, reportsem, and reportshm reports to be
written to the console or sm.log file.

Valid if set from

The server's operating system command prompt
The initialization (sm.ini) file.

Requires restart of the Service Manager server?

No

Default value

0

Possible values

0 (Output to the console)
1 (Output to the sm.log file)

Example usage

Command line: sm -reportstatus -reporttolog:1

Related topics

System parameters
Enter a parameter in the sm.ini file
System information parameters


1.2.26.32. Special parameters: str_export

Parameter

str_export

Description

This parameter exports a *.str file for localization.

            Note

           For html templates, this parameters exports a *.str file and several *.html
           files into the htmltemplates folder.

Valid if set from

The server's operating system command prompt

Requires restart of the Service Manager server?

No

Possible values

all
format
message
help
unitofmeasure
htmltemplates

            Note

           The value “all” includes all the other four kinds of tables. All these values
           refer to Service Manager database tables that contain information to be
           localized for Service Manager UI (such as button and label) and
           messages (such as error and warning).

Example usage

Command line: sm –str_export:all


Related topics

System parameters
Enter a parameter in the sm.ini file
System information parameters


1.2.26.33. Special parameters:
str_generate

Parameter

str_generate

Description

This parameter generates the scmessage file localization strings.

The Service Manager localization team usually uses this command to extract the
English message strings from the scml.h RTE source code, and then export these
strings to a text file named scml.str

. The internationalization team will translate these English message strings to other
languages and then insert the result to scmessage database files by using the
sm_import command.

Valid if set from

The server's operating system command prompt

Requires restart of the Service Manager server?

No

Example usage

Command line: sm –str_generate

Related topics

System parameters
Enter a parameter in the sm.ini file
System information parameters


1.2.26.34. Special parameters: str_import

Parameter

str_import

Description

This parameter imports a localized *.str file.

            Note

           For HTML templates, this parameters imports a *.str file and several *.html
           files into the htmltemplates folder.

Valid if set from

The server's operating system command prompt

Requires restart of the Service Manager server?

No

Possible values

all
format
message
help
unitofmeasure
htmltemplates

            Note

           The value “all” includes all the other four kinds of tables. All these values
           refer to Service Manager database tables that contain localized
           information for Service Manager UI (such as button and label) and
           messages (such as error and warning).

Example usage

Command line: sm –str_import:all


Related topics

System parameters
Enter a parameter in the sm.ini file
System information parameters


1.2.26.35. Special parameters:
str_language

Parameter

str_language

Description

This parameter imports a localized *.str file for a certain language. This parameter
must be used with –import to specify the target language for which the localized
messages are imported.

Valid if set from

The server's operating system command prompt

Requires restart of the Service Manager server?

No

Example usage

Command line: sm –str_import: all –str_language:Hans

Related topics

System parameters
Enter a parameter in the sm.ini file
System information parameters


1.2.26.36. Special parameters: verifylic

Startup parameters change the behavior of the Service Manager server. You can
always set a startup parameter from the server's operating system command prompt.

Parameter

verifylic

Description

This parameter verifies whether a valid license is found or not.

Valid if set from

Server's operating system command prompt

Requires restart of the Service Manager server?

No

Example usage

Command line: sm -verifylic

Related topics

System parameters
Enter a parameter in the sm.ini file
````
